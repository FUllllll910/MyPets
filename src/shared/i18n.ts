import type { Language } from "./types";

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
  { value: "de", label: "Deutsch" },
  { value: "ru", label: "Русский" }
];

export function resolveLanguage(value: unknown): Language {
  if (typeof value !== "string") return "zh-CN";
  const normalized = value.toLowerCase();
  if (normalized === "zh-cn" || normalized.startsWith("zh")) return "zh-CN";
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  if (normalized === "ja" || normalized.startsWith("ja-")) return "ja";
  if (normalized === "ko" || normalized.startsWith("ko-")) return "ko";
  if (normalized === "es" || normalized.startsWith("es-")) return "es";
  if (normalized === "fr" || normalized.startsWith("fr-")) return "fr";
  if (normalized === "ar" || normalized.startsWith("ar-")) return "ar";
  if (normalized === "de" || normalized.startsWith("de-")) return "de";
  if (normalized === "ru" || normalized.startsWith("ru-")) return "ru";
  return "zh-CN";
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const EN_BUNDLE = {
  bubble: {
    woof: ["Ready!", "I am here.", "What shall we do next?"],
    breakReminder: ["Time for a short break.", "Stretch a little and rest your eyes."],
    breakDone: ["Nice break.", "Back with fresh energy."],
    breakRun: [
      (seconds: number) => `Break timer: ${seconds}s left.`,
      (seconds: number) => `${seconds}s of rest to go.`
    ],
    breakRunComplete: ["Break complete.", "All set, let's continue."],
    breakIgnore: ["Break muted for today.", "Okay, I will stop reminding you today."],
    hydrationReminder: ["Drink some water.", "Hydration check."],
    hydrationDone: ["Water logged.", "Nice sip."],
    customReminder: [(title: string) => `Reminder: ${title}`, (title: string) => `${title} is due.`],
    lowBattery: [(percent: number) => `Battery is low: ${percent}%.`],
    focusStart: [(minutes: number) => `Focus mode started for ${minutes} minutes.`],
    focusWarning: [(rule: string) => `Careful, this looks distracting: ${rule}`],
    focusComplete: ["Focus session complete.", "Good work."],
    focusCancelled: ["Focus mode stopped.", "Focus session ended early."],
    focusBack: ["Welcome back to focus.", "Nice recovery."],
    agentDone: ["Agent finished.", "Your coding agent is done."],
    agentWorking: [(source: string) => `${source} is working.`],
    agentThinking: [(source: string) => `${source} is thinking.`],
    agentUsingTool: [(source: string) => `${source} is using a tool.`],
    agentRunningScript: [(source: string) => `${source} is running a script.`],
    agentNeedsChoice: [(source: string) => `${source} needs your choice.`],
    agentNeedsPermission: [(source: string) => `${source} needs permission.`],
    agentNeedsReview: [(source: string) => `${source} may need review.`],
    agentFailed: [(source: string) => `${source} failed.`],
    agentComplete: [(source: string) => `${source} completed.`]
  },
  actions: {
    breakDone: "Done",
    breakRunDone: "Done",
    breakSnooze: "Snooze",
    breakMute: "Mute today",
    hydrationDone: "Logged",
    hydrationSnooze: "Later",
    focusBack: "Back",
    focusEnd: "End focus",
    customReminderDone: "Done"
  },
  menu: {
    settings: "Settings",
    showDog: "Show pet",
    hideDog: "Hide pet",
    startFocusMode: "Start focus",
    stopFocusMode: "Stop focus",
    demoBreakReminder: "Demo break",
    demoHydrationReminder: "Demo water",
    demoFocusWarning: "Demo focus warning",
    demoHappyReaction: "Demo happy",
    resetToday: "Reset today",
    quit: "Quit"
  },
  settings: {
    preloadUnavailable: "MyPets preload is unavailable",
    preloadCopy: "Please restart the app or rebuild it if this keeps happening.",
    title: "Settings",
    language: "Language",
    statsHeading: "Stats",
    statsRangeDay: "Today",
    statsRangeMonth: "Month",
    statsRangeAll: "All",
    breaks: "Breaks",
    waters: "Water",
    focusMin: "Focus",
    warnings: "Warnings",
    countUnit: "times",
    minuteUnit: "min",
    secondUnit: "sec",
    off: "off",
    now: "now",
    never: "never",
    companionDays: "Companion days",
    dayUnit: "days",
    focusHeatmap: "Focus heatmap",
    heatmapLess: "Less",
    heatmapMore: "More",
    focusHeatmapTooltip: (minutes: number, date: string) => `${date}: ${minutes} focus minutes`,
    welcomeTitle: "Welcome",
    welcomeCopy: "MyPets can remind you to rest, drink water, focus, and chat when clicked.",
    dismissWelcome: "Got it",
    petAppearance: "Pet",
    importPet: "Import pet",
    importPetError: "Import failed",
    importPetSuccess: "Imported",
    importPetHint: "Import a Petdex package or upload GIFs for each action.",
    petdexDownloadCta: "Browse Petdex",
    emptyReminders: "No custom reminders yet.",
    reminderPageTitle: "Reminders",
    reminderTitle: "Title",
    reminderTime: "Time",
    reminderTitlePlaceholder: "Reminder title",
    reminderUntitled: "Untitled reminder",
    addReminder: "Add reminder",
    customReminderNextAt: "Next",
    customReminderEnabled: "Enabled",
    customReminderCountdown: "Show countdown",
    customReminderCountdownLead: "Countdown lead",
    customReminderEnlargeOnDue: "Enlarge when due",
    customReminderEnlargeScale: "Due scale",
    removeReminder: (title: string) => `Remove ${title}`,
    appearance: "Appearance",
    petSize: "Pet size",
    enableLyricsMode: "Lyrics mode",
    lyricsModeHelp: "Hide action buttons and keep bubbles lightweight.",
    petBubbleDuration: "Bubble duration",
    petMotion: "Motion",
    enablePetRoam: "Roam",
    petRoamDirection: "Roam direction",
    petRoamDirectionBoth: "Horizontal",
    petRoamDirectionVertical: "Vertical",
    petRoamDirectionDiagonal: "Diagonal",
    petRoamDirectionAll: "All",
    petRoamDirectionLeft: "Left",
    petRoamDirectionRight: "Right",
    petRoamFrequency: "Roam frequency",
    petRoamDuration: "Roam duration",
    petIdleMotionFrequency: "Idle motion",
    reminders: "Reminder rules",
    enableBreakReminder: "Break reminder",
    breakInterval: "Break interval",
    enableScreenBlock: "Screen block",
    screenBlockDuration: "Block duration",
    screenBlockCoverage: "Block coverage",
    enableHydrationReminder: "Water reminder",
    hydrationInterval: "Water interval",
    focus: "Focus",
    focusDuration: "Focus duration",
    enableAgentActivity: "Agent activity",
    agentActivityHelp: "React when local coding agents are active.",
    enableAgentCompletionSound: "Completion sound",
    enableDistractionDetection: "Distraction detection",
    detectionFocusHelp: "Warn during focus mode when blocked apps or keywords are active.",
    detectionOffHelp: "Detection is off.",
    detectionPermissionHelp: "Grant screen or accessibility permission to detect active windows.",
    detectionUnsupportedHelp: "Detection is not supported on this platform.",
    detectionErrorHelp: "Detection ran into an error.",
    detectionWaitingHelp: "Waiting for focus mode.",
    detectionPreviewHelp: "Watching the current app for matches.",
    detectionGrace: "Grace period",
    blockedApps: "Blocked apps",
    blockedKeywords: "Blocked keywords",
    addListItem: "Add item",
    removeListItem: (item: string) => `Remove ${item}`,
    stopFocus: "Stop focus",
    startFocus: "Start focus",
    testTools: "Test tools",
    demoBreak: "Break",
    demoWater: "Water",
    demoFocusWarning: "Focus warning",
    demoHappy: "Happy",
    resetToday: "Reset today",
    diagnostics: "Diagnostics",
    runtime: "Runtime",
    state: "State",
    mode: "Mode",
    idle: "Idle",
    reminder: "Reminder",
    dog: "Pet",
    visible: "Visible",
    hidden: "Hidden",
    none: "None",
    distraction: "Distraction",
    status: "Status",
    statusIdle: "Idle",
    statusWatching: "Watching",
    statusPermissionNeeded: "Permission needed",
    statusUnsupported: "Unsupported",
    statusError: "Error",
    matched: "Matched",
    app: "App",
    checked: "Checked",
    timers: "Timers",
    break: "Break",
    water: "Water",
    focusEnd: "Focus end",
    updated: "Updated",
    countdownMore: (count: number) => `+${count} more`
  },
  system: {
    breakNotificationTitle: "MyPets break reminder",
    breakNotificationBody: "Time to rest your eyes.",
    hydrationNotificationTitle: "MyPets water reminder",
    hydrationNotificationBody: "Drink some water.",
    focusNotificationTitle: "MyPets focus",
    focusNotificationBody: "Focus session complete.",
    unsupportedDistraction: "Distraction detection is only supported on macOS right now."
  }
};

const ZH_BUNDLE: typeof EN_BUNDLE = {
  ...EN_BUNDLE,
  settings: {
    ...EN_BUNDLE.settings,
    title: "设置",
    language: "语言",
    statsHeading: "统计",
    reminderPageTitle: "提醒",
    petAppearance: "宠物",
    focus: "专注",
    break: "休息",
    water: "喝水",
    startFocus: "开始专注",
    stopFocus: "停止专注",
    importPet: "导入宠物",
    importPetHint: "导入 Petdex 宠物包，或上传 GIF 自定义动作。",
    petdexDownloadCta: "打开 Petdex",
    reminders: "提醒规则",
    diagnostics: "诊断",
    visible: "显示",
    hidden: "隐藏",
    none: "无"
  },
  menu: {
    ...EN_BUNDLE.menu,
    settings: "设置",
    showDog: "显示宠物",
    hideDog: "隐藏宠物",
    startFocusMode: "开始专注",
    stopFocusMode: "停止专注",
    quit: "退出"
  }
};

const I18N: Record<Language, typeof EN_BUNDLE> = {
  "zh-CN": ZH_BUNDLE,
  en: EN_BUNDLE,
  ja: EN_BUNDLE,
  ko: EN_BUNDLE,
  es: EN_BUNDLE,
  fr: EN_BUNDLE,
  ar: EN_BUNDLE,
  de: EN_BUNDLE,
  ru: EN_BUNDLE
};

export type I18nBundle = (typeof I18N)[Language];

export function i18n(language: Language): I18nBundle {
  return I18N[language] ?? I18N["zh-CN"];
}
