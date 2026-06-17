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

MyPets 銇?macOS / Windows 鍚戙亼銇償銈偦銉儑銈广偗銉堛儍銉楃浉妫掋仹銇欍€傜敾闈笂銇皬銇曘仾鐩告銈掑父椐愩仌銇涖€佷紤鎲┿€佹按鍒嗚绲︺€侀泦涓倰銈勩仌銇椼亸淇冦仐銆丳etDex 褰㈠紡銇偔銉ｃ儵銈偪銉笺倰銈ゃ兂銉濄兗銉堛仹銇嶃伨銇欍€?
銉兗銈儷銉曘偂銉笺偣銉堛仹銇欙細瑷畾銆佺当瑷堛€併偆銉炽儩銉笺儓銇椼仧鐩告銆侀泦涓饱姝淬伅銇傘仾銇熴伄銉炪偡銉充笂銇繚瀛樸仌銈屻伨銇欍€?
## 姗熻兘

- 閫忔槑銆佹渶鍓嶉潰銆併儔銉┿儍銈板彲鑳姐仾銉斻偗銈汇儷鐩告
- 浼戞啯銉優銈ゃ兂銉€銉笺仺浠绘剰銇敾闈儢銉儍銈紤鎲?- 姘村垎瑁滅郸銉優銈ゃ兂銉€銉笺仺灞ユ绲辫▓
- 銈偣銈裤儬姣庢棩銉優銈ゃ兂銉€銉硷細銈偊銉炽儓銉€銈︺兂銇簨鍓嶈〃绀烘檪闁撱仺閫氱煡鏅傘伄鎷″ぇ鐜囥倰瑷畾鍙兘
- macOS 銇偄銈儐銈ｃ儢銈︺偅銉炽儔銈︽鍑恒伀銈堛倠姘楁櫞銈夈仐閫氱煡
- Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes 銇儹銉笺偒銉畬浜嗛€氱煡
- `pet.json + spritesheet.webp/png` 銉戙儍銈便兗銈搞伄銈ゃ兂銉濄兗銉?- `~/.codex/pets` 銇?PetDex 銈儯銉┿偗銈裤兗銈掕嚜鍕曡銇胯炯銇?- 9 瑷€瑾?UI 銇ㄣ偡銈广儐銉犮伄銉€銉笺偗銉兗銉夊蹇?
## 銈ゃ兂銈广儓銉笺儷

[Releases](https://github.com/angziii/MyPets/releases) 銇嬨倝銉€銈︺兂銉兗銉夈仐銇︺亸銇犮仌銇勩€?
| 銉曘偂銈ゃ儷 | 銉椼儵銉冦儓銉曘偐銉笺儬 |
| --- | --- |
| `MyPets-x.x.x-mac-arm64.dmg` | macOS Apple Silicon |
| `MyPets-x.x.x-mac-x64.dmg` | macOS Intel |
| `MyPets-x.x.x-win-x64.exe` | Windows 64-bit |

## Hermes锛圵SL锛夈仺 MyPets锛圵indows锛?
Hermes 銈?WSL 銇у疅琛屻仐銆丳awPause 銈?Windows 銇у疅琛屻仚銈嬪牬鍚堛€丠ermes 銇偆銉欍兂銉堝嚭鍔涘厛銇?Windows 鍋淬亱銈夎銈併倠銉戙偣銇с亗銈嬪繀瑕併亴銇傘倞銇俱仚銆傛柊銇椼亜 Hermes hook 銇嚜鍕曞蹇溿仐銇俱仚銇屻€侀€氱煡銇屽嚭銇亜鍫村悎銇?WSL 鍋淬伄 plugin 銇с儜銈广倰鍥哄畾銇椼仸銇忋仩銇曘亜銆?
```bash
nano ~/.hermes/plugins/mypets-agent-hook/__init__.py
```

`_output_file()` 鍏ㄤ綋銈掓銇唴瀹广伀缃亶鎻涖亪銇俱仚銆?
```python
def _output_file() -> Path:
    # WSL -> Windows MyPets fallback.
    return Path("/mnt/c/Users/Administrator/.local/share/mypets/agent-events/hermes.jsonl")
```

Windows 銇儲銉笺偠銉煎悕銇?`Administrator` 銇с仾銇勫牬鍚堛伅銆併仢銇儴鍒嗐倰瀹熼殯銇儲銉笺偠銉煎悕銇鏇淬仐銇︺亸銇犮仌銇勩€傘仢銇緦 WSL 銇у疅琛屻仐銇俱仚銆?
```bash
mkdir -p /mnt/c/Users/Administrator/.local/share/mypets/agent-events
```

鏈€寰屻伀 Hermes 銈掑啀璧峰嫊銇椼伨銇欍€?
## 銈姐兗銈广亱銈夊疅琛?
```bash
git clone https://github.com/angziii/MyPets.git
cd MyPets
corepack enable
corepack pnpm install
corepack pnpm dev
```

銉儩銈搞儓銉倰灏忋仌銇忎繚銇ゃ仧銈併€佸ぇ銇嶃仾銈儯銉┿偗銈裤兗绱犳潗銉戙儍銈伅鍚倎銇︺亜銇俱仜銈撱€傘儹銉笺偒銉仹銈ゃ兂銉濄兗銉堛伨銇熴伅 PetDex 銇嬨倝銈ゃ兂銈广儓銉笺儷銇椼仸銇忋仩銇曘亜銆?