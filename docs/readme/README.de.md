<p align="center">
  <img src="../social-preview.png" alt="MyPets" width="800" />
</p>

<h1 align="center">MyPets</h1>

<p align="center">
  <a href="../../README.md">English</a> 路
  <a href="README.zh-CN.md">涓枃</a> 路
  <a href="README.ja.md">鏃ユ湰瑾?/a> 路
  <a href="README.ko.md">頃滉淡鞏?/a> 路
  <a href="README.fr.md">Fran莽ais</a> 路
  <a href="README.de.md">Deutsch</a> 路
  <a href="README.ru.md">袪褍褋褋泻懈泄</a> 路
  <a href="README.ar.md">丕賱毓乇亘賷丞</a> 路
  <a href="README.es.md">Espa帽ol</a>
</p>

MyPets ist ein Pixel-Desktop-Begleiter f眉r macOS und Windows. Er bleibt auf deinem Bildschirm, erinnert an Pausen und Wasser, sch眉tzt Fokuszeiten und unterst眉tzt Figuren im PetDex-Format.

Local-first: Einstellungen, Statistiken, importierte Begleiter und Fokusverlauf bleiben auf deinem Rechner.

## Funktionen

- Transparenter, immer sichtbarer und verschiebbarer Pixel-Begleiter
- Pausenerinnerungen und optionaler Bildschirmblock
- Wassererinnerungen mit Verlauf
- Eigene t盲gliche Erinnerungen mit einstellbarem Countdown-Vorlauf und optionaler Vergr枚脽erung beim Hinweis
- macOS-Ablenkungserkennung nach App oder Schl眉sselwort
- Lokale Codex / Claude-Code / OpenCode / DeepSeek TUI / Hermes-Hinweise bei Abschluss oder Review-Bedarf
- Import von `pet.json + spritesheet.webp/png` Paketen
- Automatisches Lesen von PetDex-Figuren in `~/.codex/pets`
- Oberfl盲che in 9 Sprachen und System-Dunkelmodus

## Installation

Lade Installer unter [Releases](https://github.com/angziii/MyPets/releases) herunter.

| Datei | Plattform |
| --- | --- |
| `MyPets-x.x.x-mac-arm64.dmg` | macOS Apple Silicon |
| `MyPets-x.x.x-mac-x64.dmg` | macOS Intel |
| `MyPets-x.x.x-win-x64.exe` | Windows 64-bit |

## Hermes (WSL) 鈫?MyPets (Windows)

Wenn Hermes in WSL l盲uft und MyPets unter Windows, muss Hermes die Events in einen Pfad schreiben, den die Windows-App lesen kann. Der aktuelle Hermes-Hook erledigt das automatisch. Falls trotzdem keine Hinweise erscheinen, setze den Pfad im WSL-Plugin fest.

```bash
nano ~/.hermes/plugins/mypets-agent-hook/__init__.py
```

Ersetze die gesamte Funktion `_output_file()` durch:

```python
def _output_file() -> Path:
    # WSL -> Windows MyPets fallback.
    return Path("/mnt/c/Users/Administrator/.local/share/mypets/agent-events/hermes.jsonl")
```

Wenn der Windows-Benutzername nicht `Administrator` ist, ersetze diesen Teil durch den echten Benutzernamen. Danach in WSL ausf眉hren:

```bash
mkdir -p /mnt/c/Users/Administrator/.local/share/mypets/agent-events
```

Starte Hermes anschlie脽end neu.

## Aus dem Quellcode starten

```bash
git clone https://github.com/angziii/MyPets.git
cd MyPets
corepack enable
corepack pnpm install
corepack pnpm dev
```

Gro脽e Figurenpakete werden nicht mitgeliefert, damit das Repository klein bleibt. Importiere sie lokal oder installiere sie mit PetDex.
