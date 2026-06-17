import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, JSX, PointerEvent } from "react";
import { i18n, resolveLanguage } from "../../../shared/i18n";
import type { CustomReminder, PetLayout, SpeechBubble } from "../../../shared/types";
import { getSelectedPetAsset } from "../assets";
import { useNow, useSnapshot } from "../hooks";

type DragRef = {
  pointerId: number;
  startX: number;
  startY: number;
  dragging: boolean;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const DRAG_START_DISTANCE_PX = 10;
const PET_CHAT_CLICK_COUNT = 1;
const PET_CHAT_CLICK_WINDOW_MS = 650;

function formatFocusCountdown(endsAt: number | null, now: number): string {
  const remainingSeconds = Math.max(0, Math.ceil(((endsAt ?? now) - now) / 1000));
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function nextReminderDueAt(time: string, now: number): number | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const due = new Date(now);
  due.setHours(hours, minutes, 0, 0);
  if (due.getTime() <= now) due.setDate(due.getDate() + 1);
  return due.getTime();
}

function reminderCountdowns(reminders: CustomReminder[], now: number): Array<CustomReminder & { dueAt: number }> {
  return reminders
    .flatMap((reminder): Array<CustomReminder & { dueAt: number }> => {
      if (!reminder.enabled || !reminder.showCountdownOnPet) return [];
      const dueAt = nextReminderDueAt(reminder.time, now);
      const leadMs = Math.max(1, reminder.countdownLeadMinutes) * 60 * 1000;
      if (!dueAt || dueAt - now > leadMs) return [];
      return dueAt ? [{ ...reminder, dueAt }] : [];
    })
    .sort((left, right) => left.dueAt - right.dueAt);
}

export function PetView(): JSX.Element {
  const snapshot = useSnapshot();
  const now = useNow(1000);
  const [bubble, setBubble] = useState<SpeechBubble | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [layout, setLayout] = useState<PetLayout>({
    petOffsetX: 0,
    bubbleAnchorX: 0,
    bubbleLeftX: 0,
    bubbleArrowX: 0
  });
  const dragRef = useRef<DragRef | null>(null);
  const clickSequenceRef = useRef<{ count: number; timer: number | null }>({ count: 0, timer: null });
  const labels = i18n(resolveLanguage(snapshot.settings.language)).settings;

  useEffect(() => {
    const offLayout = window.mypets.onPetLayout(setLayout);
    const offBubble = window.mypets.onShowBubble((nextBubble) => {
      setBubble(nextBubble);
      if (nextBubble.kind === "chat") {
        setChatMessages([{ role: "assistant", content: nextBubble.message }]);
        setChatDraft("");
        setChatSending(false);
      }
    });
    const offHide = window.mypets.onHideBubble(() => {
      setBubble(null);
      setChatMessages([]);
      setChatDraft("");
      setChatSending(false);
    });
    return () => {
      offLayout();
      offBubble();
      offHide();
      resetPetClickSequence();
    };
  }, []);

  const state = snapshot.petState;
  const altText = `MyPets ${state}`;
  const usesDirectionalSprite = state === "runningLeft" || state === "runningRight";
  const facingClass = usesDirectionalSprite
    ? "facing-natural"
    : snapshot.petFacing === "left"
      ? "facing-left"
      : "facing-right";
  const selectedPetId = snapshot.settings.selectedPetId;
  const asset = getSelectedPetAsset(
    selectedPetId,
    snapshot.settings.installedPets,
    state,
    snapshot.settings.customGifPet
  );
  const lyricsModeEnabled = snapshot.settings.lyricsModeEnabled;
  const bubbleClickActionId = !lyricsModeEnabled && !bubble?.actions?.length ? bubble?.clickActionId : undefined;
  const chatOpen = bubble?.kind === "chat";
  const countdownReminders = reminderCountdowns(snapshot.settings.customReminders, now);
  const visibleCountdownReminders = countdownReminders.slice(0, 3);
  const hiddenCountdownCount = Math.max(0, countdownReminders.length - visibleCountdownReminders.length);

  function finishPointerDrag(clicked: boolean): void {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (drag.dragging) {
      window.mypets.petDragStop();
      return;
    }
    if (clicked) registerPetClick();
  }

  function resetPetClickSequence(): void {
    const sequence = clickSequenceRef.current;
    if (sequence.timer) window.clearTimeout(sequence.timer);
    clickSequenceRef.current = { count: 0, timer: null };
  }

  function registerPetClick(): void {
    const sequence = clickSequenceRef.current;
    if (sequence.timer) window.clearTimeout(sequence.timer);
    const nextCount = sequence.count + 1;
    if (nextCount >= PET_CHAT_CLICK_COUNT) {
      resetPetClickSequence();
      window.mypets.petChatRequested();
      return;
    }
    clickSequenceRef.current = {
      count: nextCount,
      timer: window.setTimeout(() => {
        resetPetClickSequence();
        window.mypets.petClicked();
      }, PET_CHAT_CLICK_WINDOW_MS)
    };
  }

  useEffect(() => {
    const cancelActiveDrag = (): void => finishPointerDrag(false);
    window.addEventListener("pointerup", cancelActiveDrag);
    window.addEventListener("pointercancel", cancelActiveDrag);
    window.addEventListener("blur", cancelActiveDrag);
    return () => {
      window.removeEventListener("pointerup", cancelActiveDrag);
      window.removeEventListener("pointercancel", cancelActiveDrag);
      window.removeEventListener("blur", cancelActiveDrag);
    };
  }, []);

  useEffect(() => {
    if (!lyricsModeEnabled) return;
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.dragging) window.mypets.petDragStop();
  }, [lyricsModeEnabled]);

  function startPointer(event: PointerEvent<HTMLButtonElement>): void {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false
    };
  }

  function movePointer(event: PointerEvent<HTMLButtonElement>): void {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.dragging && distance > DRAG_START_DISTANCE_PX) {
      drag.dragging = true;
      window.mypets.petDragStart({ offsetX: drag.startX, offsetY: drag.startY });
    }
  }

  function stopPointer(event: PointerEvent<HTMLButtonElement>): void {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const shouldReleaseCapture = event.currentTarget.hasPointerCapture(event.pointerId);
    finishPointerDrag(true);
    if (shouldReleaseCapture) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function cancelPointer(event: PointerEvent<HTMLButtonElement>): void {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    finishPointerDrag(false);
  }

  async function sendChatMessage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const message = chatDraft.trim();
    if (!message || chatSending) return;
    setChatDraft("");
    setChatSending(true);
    setChatMessages((messages) => [...messages, { role: "user", content: message }]);
    const result = await window.mypets.petGptChatMessage(message);
    setChatMessages((messages) => [
      ...messages,
      {
        role: "assistant",
        content: result.ok ? result.message : `连接失败：${result.error}`
      }
    ]);
    setChatSending(false);
  }

  return (
    <main
      className={`pet-shell${snapshot.screenBlockActive ? " is-screen-block" : ""}${lyricsModeEnabled ? " is-lyrics-mode" : ""}`}
      aria-label="MyPets desktop pet"
      dir={resolveLanguage(snapshot.settings.language) === "ar" ? "rtl" : "ltr"}
      style={
        {
          "--pet-scale": snapshot.settings.petScale,
          "--pet-display-scale": snapshot.petDisplayScale,
          "--idle-motion-duration": `${snapshot.settings.petIdleMotionSeconds}s`,
          "--pet-layout-offset-x": `${layout.petOffsetX}px`,
          "--bubble-anchor-x": `${layout.bubbleAnchorX}px`,
          "--bubble-left-x": `${layout.bubbleLeftX}px`,
          "--bubble-arrow-x": `${layout.bubbleArrowX}px`
        } as CSSProperties
      }
      onContextMenu={
        lyricsModeEnabled
          ? undefined
          : (event) => {
              event.preventDefault();
              window.mypets.petContextMenu();
            }
      }
    >
      {bubble ? (
        chatOpen ? (
          <section className="speech-bubble chat-bubble" aria-label="GPT chat with pet">
            <div className="chat-log">
              {chatMessages.map((message, index) => (
                <p className={`chat-line ${message.role}`} key={`${message.role}-${index}`}>
                  {message.content}
                </p>
              ))}
              {chatSending ? <p className="chat-line assistant">正在思考...</p> : null}
            </div>
            <form className="chat-form" onSubmit={(event) => void sendChatMessage(event)}>
              <input
                type="text"
                value={chatDraft}
                onChange={(event) => setChatDraft(event.target.value)}
                placeholder="和它聊点什么..."
                disabled={chatSending}
              />
              <button type="submit" disabled={chatSending || !chatDraft.trim()}>
                发送
              </button>
              <button type="button" onClick={() => window.mypets.bubbleAction("pet-chat:close")}>
                关闭
              </button>
            </form>
          </section>
        ) :
        bubbleClickActionId ? (
          <button
            className="speech-bubble speech-bubble--button"
            onClick={() => window.mypets.bubbleAction(bubbleClickActionId)}
            type="button"
          >
            <p>{bubble.message}</p>
          </button>
        ) : (
          <section className="speech-bubble">
            <p>{bubble.message}</p>
            {!lyricsModeEnabled && bubble.actions?.length ? (
              <div className="bubble-actions">
                {bubble.actions.map((action) => (
                  <button
                    className={`bubble-button ${action.kind ?? "secondary"}`}
                    key={action.id}
                    onClick={() => window.mypets.bubbleAction(action.id)}
                    type="button"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        )
      ) : null}

      {snapshot.focusActive ? (
        <div className="focus-badge">
          <span>{labels.focus}</span>
          <strong>{formatFocusCountdown(snapshot.timers.focusEndsAt, now)}</strong>
        </div>
      ) : null}

      {!snapshot.focusActive && snapshot.timers.breakSnoozeDueAt ? (
        <div className="focus-badge break-snooze-badge">
          <span>{labels.break}</span>
          <strong>{formatFocusCountdown(snapshot.timers.breakSnoozeDueAt, now)}</strong>
        </div>
      ) : null}

      {visibleCountdownReminders.length ? (
        <div className="reminder-countdowns" aria-label={labels.reminderPageTitle}>
          {visibleCountdownReminders.map((reminder) => (
            <div className="reminder-countdown-badge" key={reminder.id}>
              <span>{reminder.title}</span>
              <strong>{formatFocusCountdown(reminder.dueAt, now)}</strong>
            </div>
          ))}
          {hiddenCountdownCount ? (
            <div className="reminder-countdown-badge reminder-countdown-badge--more">
              <span>{labels.countdownMore(hiddenCountdownCount)}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        className={`pet-button state-${state} ${facingClass}`}
        aria-disabled={lyricsModeEnabled}
        onPointerCancel={lyricsModeEnabled ? undefined : cancelPointer}
        onPointerDown={lyricsModeEnabled ? undefined : startPointer}
        onLostPointerCapture={lyricsModeEnabled ? undefined : () => finishPointerDrag(false)}
        onPointerMove={lyricsModeEnabled ? undefined : movePointer}
        onPointerUp={lyricsModeEnabled ? undefined : stopPointer}
        tabIndex={lyricsModeEnabled ? -1 : 0}
        type="button"
      >
        {asset.kind === "sprite" ? (
          <span
            className="sprite-pet"
            role="img"
            aria-label={altText}
            style={
              {
                "--sprite-url": `url(${asset.src})`,
                "--sprite-row": asset.animation.row,
                "--sprite-frames": asset.animation.frames,
                "--sprite-duration": `${asset.animation.durationMs}ms`,
                "--sprite-frame-width": `${asset.frameWidth}px`,
                "--sprite-frame-height": `${asset.frameHeight}px`,
                "--sprite-sheet-width": `${asset.sheetWidth}px`,
                "--sprite-sheet-height": `${asset.sheetHeight}px`
              } as CSSProperties
            }
          />
        ) : asset.kind === "gif" ? (
          <img className="gif-pet" src={asset.src} alt={altText} draggable={false} />
        ) : (
          <span className="fallback-pet" role="img" aria-label={altText}>
            <span className="fallback-pet__ear fallback-pet__ear--left" />
            <span className="fallback-pet__ear fallback-pet__ear--right" />
            <span className="fallback-pet__face">
              <span className="fallback-pet__eye fallback-pet__eye--left" />
              <span className="fallback-pet__eye fallback-pet__eye--right" />
              <span className="fallback-pet__nose" />
            </span>
            <span className="fallback-pet__tail" />
          </span>
        )}
      </button>
    </main>
  );
}
