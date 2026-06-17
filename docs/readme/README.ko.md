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

MyPets電?macOS / Windows鞖?頂届厐 雿办姢韥啽 霃欕皹鞛愳瀰雼堧嫟. 頇旊┐ 鞙勳棎 鞛戩潃 霃欕皹鞛愲ゼ 霛勳泴 頊挫嫕, 氍?毵堨嫓旮? 歆戩鞚?霃勳檧欤缄碃 PetDex 順曥嫕 旌愲Ν韯半ゼ 臧€鞝胳槵 靾?鞛堨姷雼堧嫟.

搿滌滑 鞖办劆鞛呺媹雼? 靹れ爼, 韱店硠, 臧€鞝胳槰 霃欕皹鞛? 歆戩 旮半鞚€ 旮瓣赴鞐愲 鞝€鞛ル惄雼堧嫟.

## 旮半姤

- 韴獏頃橁碃 頃儊 鞙勳棎 鞛堨溂氅?霌滊灅攴?臧€電ロ暅 頂届厐 霃欕皹鞛?- 頊挫嫕 鞎岆瓿?靹犿儩 臧€電ロ暅 頇旊┐ 彀嫧 頊挫嫕
- 氍?毵堨嫓旮?鞎岆瓿?旮半 韱店硠
- 靷毄鞛?歆€鞝?毵れ澕 鞎岆: 旃挫毚韸鸽嫟鞖挫潉 氙鸽Μ 響滌嫓頃?鞁滉皠瓿?鞎岆 鞁?頇曤寑 牍勳湪 靹れ爼
- macOS 頇滌劚 彀?臧愳毳?韱淀暅 氚╉暣 鞎岆
- Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes 搿滌滑 靹胳厴 鞕勲 鞎岆
- `pet.json + spritesheet.webp/png` 韺偆歆€ 臧€鞝胳槫旮?- `~/.codex/pets`鞚?PetDex 旌愲Ν韯?鞛愲彊 臧愳
- 9臧?鞏胳柎 UI鞕€ 鞁滌姢韰?雼ろ伂 氇摐 歆€鞗?
## 靹れ箻

[Releases](https://github.com/angziii/MyPets/releases)鞐愳劀 靹れ箻 韺岇澕鞚?雼れ毚搿滊摐頃橃劯鞖?

| 韺岇澕 | 頂岆灚韽?|
| --- | --- |
| `MyPets-x.x.x-mac-arm64.dmg` | macOS Apple Silicon |
| `MyPets-x.x.x-mac-x64.dmg` | macOS Intel |
| `MyPets-x.x.x-win-x64.exe` | Windows 64-bit |

## Hermes(WSL) 鈫?MyPets(Windows)

Hermes臧€ WSL鞐愳劀 鞁ろ枆霅橁碃 MyPets臧€ Windows鞐愳劀 鞁ろ枆霅橂姅 瓴届毎, Hermes 鞚措菠韸?韺岇澕鞚€ Windows 飒届棎靹滊弰 鞚届潉 靾?鞛堧姅 瓴诫鞐?鞃暭 頃╇媹雼? 斓滌嫚 Hermes hook鞚€ 鞛愲彊鞙茧 觳橂Μ頃橃毵? 鞎岆鞚?瓿勳啀 鞓れ 鞎婌溂氅?WSL plugin鞐愳劀 瓴诫毳?瓿犾爼頃橃劯鞖?

```bash
nano ~/.hermes/plugins/mypets-agent-hook/__init__.py
```

`_output_file()` 鞝勳泊毳?雼れ潓鞙茧 氚旉繅雼堧嫟.

```python
def _output_file() -> Path:
    # WSL -> Windows MyPets fallback.
    return Path("/mnt/c/Users/Administrator/.local/share/mypets/agent-events/hermes.jsonl")
```

Windows 靷毄鞛?鞚措鞚?`Administrator`臧€ 鞎勲媹氅?鞁れ牅 靷毄鞛?鞚措鞙茧 氚旉繑 欤检劯鞖? 攴鸽嫟鞚?WSL鞐愳劀 鞁ろ枆頃╇媹雼?

```bash
mkdir -p /mnt/c/Users/Administrator/.local/share/mypets/agent-events
```

毵堨毵夓溂搿?Hermes毳?雼れ嫓 鞁滌瀾頃橃劯鞖?

## 靻岇姢鞐愳劀 鞁ろ枆

```bash
git clone https://github.com/angziii/MyPets.git
cd MyPets
corepack enable
corepack pnpm install
corepack pnpm dev
```

鞝€鞛レ唽 韥赴毳?鞛戧矊 鞙犾頃橁赴 鞙勴暣 韥?旌愲Ν韯?毽唽鞀?韺╈潃 韽暔頃橃 鞎婌姷雼堧嫟. 搿滌滑鞐愳劀 臧€鞝胳槫瓯半倶 PetDex搿?靹れ箻頃橃劯鞖?
