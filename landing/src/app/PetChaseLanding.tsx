"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const repoUrl = "https://github.com/angziii/MyPets";
const latestReleaseUrl = `${repoUrl}/releases/latest`;
const petdexUrl = "https://petdex.crafter.run/zh";
const latestVersion = "v1.0.6";
const starNudgeDurationMs = 8000;
const starNudgeDurationSeconds = starNudgeDurationMs / 1000;
const brandedAgentNames = ["Claude Code", "DeepSeek TUI", "OpenCode", "Hermes", "Codex"];
const brandedAgentPattern = /(Claude Code|DeepSeek TUI|OpenCode|Hermes|Codex)/g;

const links = [
  { id: "download", href: latestReleaseUrl, primary: true },
  { id: "github", href: repoUrl },
  { id: "petdex", href: petdexUrl },
];

type Language = "zh-CN" | "en" | "ja" | "ko" | "es" | "fr" | "de" | "ru" | "ar";

type LandingCopy = {
  dir?: "rtl";
  languageLabel: string;
  nav: Record<(typeof links)[number]["id"], string>;
  eyebrow: string;
  hero: string;
  localFirst: string;
  petdexLine1: string;
  petdexLine2: string;
  bubbles: string;
  release: string;
  downloadTitle: string;
  downloadSubtitle: string;
  downloadAll: string;
  closeDownload: string;
  starNudge: string;
  starNudgeCountdown: string;
  starNudgeAria: string;
  prompts: string[];
};

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "zh-CN", label: "涓枃" },
  { value: "en", label: "English" },
  { value: "ja", label: "鏃ユ湰瑾? },
  { value: "ko", label: "頃滉淡鞏? },
  { value: "es", label: "Espa帽ol" },
  { value: "fr", label: "Fran莽ais" },
  { value: "de", label: "Deutsch" },
  { value: "ru", label: "袪褍褋褋泻懈泄" },
  { value: "ar", label: "丕賱毓乇亘賷丞" },
];

const downloadOptions = [
  {
    title: "macOS Apple Silicon",
    meta: "M1 / M2 / M3 / M4 路 DMG",
    href: `${repoUrl}/releases/download/${latestVersion}/MyPets-1.0.6-mac-arm64.dmg`,
  },
  {
    title: "macOS Intel",
    meta: "Intel Mac 路 DMG",
    href: `${repoUrl}/releases/download/${latestVersion}/MyPets-1.0.6-mac-x64.dmg`,
  },
  {
    title: "Windows",
    meta: "64-bit 路 EXE",
    href: `${repoUrl}/releases/download/${latestVersion}/MyPets-1.0.6-win-x64.exe`,
  },
  {
    title: "More builds",
    meta: "ZIP files and release notes",
    href: latestReleaseUrl,
  },
];

const copies: Record<Language, LandingCopy> = {
  "zh-CN": {
    languageLabel: "璇█",
    nav: { download: "涓嬭浇", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "璁╃數瀛愬疇鐗╀綇杩涙闈細鎻愰啋浼戞伅銆佸枬姘淬€佷繚鎸佷笓娉ㄣ€佷綆鐢甸噺鍏呯數鎻愰啋锛屼篃鑳藉湪 Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes 宸ヤ綔鏃剁粰浣犲姩鎬佹彁绀恒€?,
    localFirst: "鏈湴浼樺厛锛屼笉闇€瑕佽处鍙枫€?,
    petdexLine1: "鍏煎 Codex 瀹犵墿鏍煎紡锛?,
    petdexLine2: "鍙墠寰€ PetDex 绀惧尯涓嬭浇銆?,
    bubbles: "v1.0.6 鏂板浣庣數閲忔彁閱掋€佽繛缁櫔浼村ぉ鏁般€丟itHub 椋庢牸涓撴敞鐑姏鍥俱€佸彲璋冩皵娉℃椂闂村拰鏇村璺戝姩鏂瑰悜銆?,
    release: "Latest release: v1.0.6",
    downloadTitle: "閫夋嫨瀹夎鍖?,
    downloadSubtitle: "鏍规嵁浣犵殑绯荤粺涓嬭浇鏈€鏂扮増鏈€?,
    downloadAll: "鏌ョ湅鍏ㄩ儴 Release",
    closeDownload: "鍏抽棴涓嬭浇寮圭獥",
    starNudge: "鍦?GitHub 鐐逛釜鏄熸槦鏀寔鎴戜滑鍚с€?,
    starNudgeCountdown: "{seconds} 绉掑悗鏀跺洖",
    starNudgeAria: "鎵撳紑 GitHub 缁?MyPets 鐐规槦",
    prompts: [
      "Codex 姝ｅ湪鎬濊€?,
      "Claude Code 姝ｅ湪璋冪敤宸ュ叿",
      "OpenCode 姝ｅ湪鎵ц鑴氭湰",
      "DeepSeek TUI 姝ｅ湪鎺ㄧ悊",
      "Hermes 姝ｅ湪鎵ц鑴氭湰",
      "闇€瑕佷綘鍋氫釜閫夋嫨",
      "闇€瑕佹潈闄愭墠鑳界户缁?,
      "鏈夌粨鏋滈渶瑕佷綘纭",
      "浼戞伅涓€涓嬶紝璧颁竴鍒嗛挓",
      "鍠濆彛姘村啀缁х画",
      "宸ュ叿缁撴灉鍥炴潵浜?,
    ],
  },
  en: {
    languageLabel: "Language",
    nav: { download: "Download", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "MyPets is a pixel desktop companion for macOS and Windows. It helps with breaks, water, focus, low-battery charging nudges, and live Codex, Claude Code, OpenCode, DeepSeek TUI, and Hermes activity.",
    localFirst: "Local first. No account needed.",
    petdexLine1: "Compatible with the Codex pet format.",
    petdexLine2: "Download more from PetDex.",
    bubbles: "v1.0.6 adds low-battery alerts, companion streak days, a GitHub-style focus heatmap, adjustable bubbles, and richer pet movement.",
    release: "Latest release: v1.0.6",
    downloadTitle: "Choose an installer",
    downloadSubtitle: "Download the latest build for your system.",
    downloadAll: "View all releases",
    closeDownload: "Close download dialog",
    starNudge: "Star us on GitHub to support MyPets.",
    starNudgeCountdown: "Retracts in {seconds}s",
    starNudgeAria: "Open GitHub to star MyPets",
    prompts: [
      "Codex is thinking",
      "Claude Code is using a tool",
      "OpenCode is running a script",
      "DeepSeek TUI is reasoning",
      "Hermes is running a script",
      "Needs you to choose",
      "Permission needed",
      "Results need review",
      "Take a one-minute walk",
      "Drink some water",
      "Tool results are back",
    ],
  },
  ja: {
    languageLabel: "瑷€瑾?,
    nav: { download: "鍏ユ墜", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "浼戞啯銉绘按鍒嗚绲︺兓闆嗕腑銈掓敮銇堛€丆odex / Claude Code / OpenCode / DeepSeek TUI / Hermes 銇綔妤姸娉併倐鐭ャ倝銇涖倠銉斻偗銈汇儷鐩告銇с仚銆?,
    localFirst: "銉兗銈儷鍎厛銆傘偄銈偊銉炽儓涓嶈銆?,
    petdexLine1: "Codex 銉氥儍銉堝舰寮忋伀瀵惧繙銆?,
    petdexLine2: "杩藉姞銈儯銉┿偗銈裤兗銇?PetDex 銈炽儫銉ャ儖銉嗐偅銇嬨倝鍏ユ墜銇с亶銇俱仚銆?,
    bubbles: "v1.0.6 銇с伅浣庨浕閲忛€氱煡銆佺浉妫掋伄鏃ユ暟銆侀泦涓儝銉笺儓銉炪儍銉椼€佸惞銇嶅嚭銇楁檪闁撹ō瀹氥€佺Щ鍕曟柟鍚戙伄杩藉姞銇蹇溿仐銇俱仐銇熴€?,
    release: "Latest release: v1.0.6",
    downloadTitle: "銈ゃ兂銈广儓銉笺儵銈掗伕鎶?,
    downloadSubtitle: "銇婁娇銇勩伄鐠板鍚戙亼銇渶鏂扮増銈掋儉銈︺兂銉兗銉夈€?,
    downloadAll: "銇欍伖銇︺伄銉儶銉笺偣銈掕銈?,
    closeDownload: "銉€銈︺兂銉兗銉夈儉銈ゃ偄銉偘銈掗枆銇樸倠",
    starNudge: "GitHub 銇ф槦銈掋仱銇戙仸蹇滄彺銇椼仸銇忋仩銇曘亜銆?,
    starNudgeCountdown: "{seconds}绉掋仹鎴汇倞銇俱仚",
    starNudgeAria: "GitHub 銈掗枊銇勩仸 MyPets 銇槦銈掋仱銇戙倠",
    prompts: [
      "Codex 銇岃€冦亪銇︺亜銇俱仚",
      "Claude Code 銇屻儎銉笺儷銈掍娇鐢ㄤ腑",
      "OpenCode 銇屻偣銈儶銉椼儓銈掑疅琛屼腑",
      "DeepSeek TUI 銇屾帹璜栦腑",
      "Hermes 銇屻偣銈儶銉椼儓銈掑疅琛屼腑",
      "閬告姙銇屽繀瑕併仹銇?,
      "妯╅檺銇屽繀瑕併仹銇?,
      "绲愭灉銇⒑瑾嶃亴蹇呰銇с仚",
      "1鍒嗘銇嶃伨銇椼倗銇?,
      "姘淬倰椋层伩銇俱仐銈囥亞",
      "銉勩兗銉祼鏋溿亴鎴汇倞銇俱仐銇?,
    ],
  },
  ko: {
    languageLabel: "鞏胳柎",
    nav: { download: "雼れ毚搿滊摐", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "頊挫嫕, 氍?毵堨嫓旮? 歆戩鞚?霃曣碃 Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes 鞛戩梾 靸來儨霃?鞎岆牑欤茧姅 頂届厐 霃欕皹鞛愳瀰雼堧嫟.",
    localFirst: "搿滌滑 鞖办劆. 瓿勳爼鞚?頃勳殧 鞐嗢柎鞖?",
    petdexLine1: "Codex 韼?順曥嫕瓿?順疙櫂霅╇媹雼?",
    petdexLine2: "PetDex 旎る雼堩嫲鞐愳劀 雿?氚涭潉 靾?鞛堨柎鞖?",
    bubbles: "v1.0.6鞚€ 鞝€鞝勲牓 鞎岆, 頃粯頃?雮? 歆戩 頌堩姼毵? 毵愴拲靹?鞁滉皠 靹れ爼, 雿?毵庫潃 鞚措彊 氚╉枼鞚?於旉皜頃╇媹雼?",
    release: "Latest release: v1.0.6",
    downloadTitle: "靹れ箻 韺岇澕 靹犿儩",
    downloadSubtitle: "鞁滌姢韰滌棎 毵炿姅 斓滌嫚 氩勳爠鞚?雼れ毚搿滊摐頃橃劯鞖?",
    downloadAll: "氇摖 毽措Μ鞀?氤搓赴",
    closeDownload: "雼れ毚搿滊摐 彀?雼赴",
    starNudge: "GitHub鞐愳劀 氤勳潉 雸岆煬 鞚戩洂頃?欤检劯鞖?",
    starNudgeCountdown: "{seconds}齑?頉?鞝戫灅",
    starNudgeAria: "GitHub鞐愳劀 MyPets鞐?氤?欤缄赴",
    prompts: [
      "Codex 靸濌皝 欷?,
      "Claude Code 霃勱惮 靷毄 欷?,
      "OpenCode 鞀ろ伂毽巾姼 鞁ろ枆 欷?,
      "DeepSeek TUI 於旊 欷?,
      "Hermes 鞀ろ伂毽巾姼 鞁ろ枆 欷?,
      "靹犿儩鞚?頃勳殧頃挫殧",
      "甓岉暅鞚?頃勳殧頃挫殧",
      "瓴瓣臣 頇曥澑鞚?頃勳殧頃挫殧",
      "1攵勲 瓯胳柎氪愳殧",
      "氍检潉 毵堨厰鞖?,
      "霃勱惮 瓴瓣臣臧€ 霃岇晞鞕旍柎鞖?,
    ],
  },
  es: {
    languageLabel: "Idioma",
    nav: { download: "Descargar", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "Una mascota pixel para pausas, agua, concentraci贸n y avisos en vivo de Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes.",
    localFirst: "Primero local. Sin cuenta.",
    petdexLine1: "Compatible con el formato de mascotas de Codex.",
    petdexLine2: "Descarga m谩s en PetDex.",
    bubbles: "v1.0.6 agrega alerta de bater铆a baja, d铆as de compa帽铆a, mapa de enfoque, duraci贸n de globos y m谩s direcciones.",
    release: "Latest release: v1.0.6",
    downloadTitle: "Elige un instalador",
    downloadSubtitle: "Descarga la version mas reciente para tu sistema.",
    downloadAll: "Ver todas las versiones",
    closeDownload: "Cerrar dialogo de descarga",
    starNudge: "Danos una estrella en GitHub para apoyarnos.",
    starNudgeCountdown: "Se cierra en {seconds}s",
    starNudgeAria: "Abrir GitHub para dar una estrella a MyPets",
    prompts: [
      "Codex est谩 pensando",
      "Claude Code usa una herramienta",
      "OpenCode ejecuta un script",
      "DeepSeek TUI est谩 razonando",
      "Hermes ejecuta un script",
      "Necesita que elijas",
      "Necesita permiso",
      "Revisa los resultados",
      "Camina un minuto",
      "Bebe agua",
      "Volvieron los resultados",
    ],
  },
  fr: {
    languageLabel: "Langue",
    nav: { download: "T茅l茅charger", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "Un compagnon pixel pour les pauses, l'eau, la concentration et les alertes Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes.",
    localFirst: "Local d'abord. Aucun compte requis.",
    petdexLine1: "Compatible avec le format de compagnon Codex.",
    petdexLine2: "T茅l茅charge d'autres personnages sur PetDex.",
    bubbles: "v1.0.6 ajoute l'alerte batterie faible, les jours ensemble, la carte de concentration, la dur茅e des bulles et plus de directions.",
    release: "Latest release: v1.0.6",
    downloadTitle: "Choisir un installateur",
    downloadSubtitle: "Telecharge la derniere version pour ton systeme.",
    downloadAll: "Voir toutes les versions",
    closeDownload: "Fermer la fenetre de telechargement",
    starNudge: "Ajoute une 茅toile sur GitHub pour nous soutenir.",
    starNudgeCountdown: "Se replie dans {seconds}s",
    starNudgeAria: "Ouvrir GitHub pour ajouter une 茅toile 脿 MyPets",
    prompts: [
      "Codex r茅fl茅chit",
      "Claude Code utilise un outil",
      "OpenCode ex茅cute un script",
      "DeepSeek TUI raisonne",
      "Hermes ex茅cute un script",
      "Un choix est n茅cessaire",
      "Autorisation requise",
      "R茅sultats 脿 v茅rifier",
      "Marche une minute",
      "Bois de l'eau",
      "Les r茅sultats de l'outil sont l脿",
    ],
  },
  de: {
    languageLabel: "Sprache",
    nav: { download: "Download", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "Ein Pixel-Begleiter f眉r Pausen, Wasser, Fokus und Live-Hinweise von Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes.",
    localFirst: "Lokal zuerst. Kein Konto n枚tig.",
    petdexLine1: "Kompatibel mit dem Codex-Pet-Format.",
    petdexLine2: "Weitere Figuren gibt es bei PetDex.",
    bubbles: "v1.0.6 bringt Akkuwarnungen, Begleittage, Fokus-Heatmap, einstellbare Blasen und mehr Bewegungsrichtungen.",
    release: "Latest release: v1.0.6",
    downloadTitle: "Installer wahlen",
    downloadSubtitle: "Lade die neueste Version fur dein System herunter.",
    downloadAll: "Alle Versionen ansehen",
    closeDownload: "Download-Dialog schliessen",
    starNudge: "Gib uns auf GitHub einen Stern zur Unterst眉tzung.",
    starNudgeCountdown: "Zieht sich in {seconds}s zur眉ck",
    starNudgeAria: "GitHub 枚ffnen, um MyPets einen Stern zu geben",
    prompts: [
      "Codex denkt nach",
      "Claude Code nutzt ein Tool",
      "OpenCode f眉hrt ein Skript aus",
      "DeepSeek TUI denkt nach",
      "Hermes f眉hrt ein Skript aus",
      "Eine Auswahl ist n枚tig",
      "Berechtigung n枚tig",
      "Ergebnisse pr眉fen",
      "Geh eine Minute",
      "Trink Wasser",
      "Tool-Ergebnisse sind zur眉ck",
    ],
  },
  ru: {
    languageLabel: "携蟹褘泻",
    nav: { download: "小泻邪褔邪褌褜", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "袩懈泻褋械谢褜薪褘泄 锌芯屑芯褖薪懈泻 写谢褟 锌邪褍蟹, 胁芯写褘, 褎芯泻褍褋邪 懈 褋褌邪褌褍褋芯胁 Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes.",
    localFirst: "袥芯泻邪谢褜薪芯 胁 锌械褉胁褍褞 芯褔械褉械写褜. 袗泻泻邪褍薪褌 薪械 薪褍卸械薪.",
    petdexLine1: "小芯胁屑械褋褌懈屑 褋 褎芯褉屑邪褌芯屑 锌懈褌芯屑褑械胁 Codex.",
    petdexLine2: "袘芯谢褜褕械 锌械褉褋芯薪邪卸械泄 械褋褌褜 胁 PetDex.",
    bubbles: "v1.0.6 写芯斜邪胁谢褟械褌 锌褉械写褍锌褉械卸写械薪懈械 芯 斜邪褌邪褉械械, 写薪懈 胁屑械褋褌械, 泻邪褉褌褍 褎芯泻褍褋邪, 胁褉械屑褟 锌芯写褋泻邪蟹芯泻 懈 薪芯胁褘械 薪邪锌褉邪胁谢械薪懈褟.",
    release: "Latest release: v1.0.6",
    downloadTitle: "袙褘斜械褉懈褌械 褍褋褌邪薪芯胁褖懈泻",
    downloadSubtitle: "小泻邪褔邪泄褌械 锌芯褋谢械写薪褞褞 胁械褉褋懈褞 写谢褟 胁邪褕械泄 褋懈褋褌械屑褘.",
    downloadAll: "袙褋械 褉械谢懈蟹褘",
    closeDownload: "袟邪泻褉褘褌褜 芯泻薪芯 蟹邪谐褉褍蟹泻懈",
    starNudge: "袩芯褋褌邪胁褜褌械 蟹胁械蟹写褍 薪邪 GitHub, 褔褌芯斜褘 锌芯写写械褉卸邪褌褜 薪邪褋.",
    starNudgeCountdown: "小胁械褉薪械褌褋褟 褔械褉械蟹 {seconds} 褋",
    starNudgeAria: "袨褌泻褉褘褌褜 GitHub 懈 锌芯褋褌邪胁懈褌褜 蟹胁械蟹写褍 MyPets",
    prompts: [
      "Codex 写褍屑邪械褌",
      "Claude Code 懈褋锌芯谢褜蟹褍械褌 懈薪褋褌褉褍屑械薪褌",
      "OpenCode 蟹邪锌褍褋泻邪械褌 褋泻褉懈锌褌",
      "DeepSeek TUI 褉邪褋褋褍卸写邪械褌",
      "Hermes 蟹邪锌褍褋泻邪械褌 褋泻褉懈锌褌",
      "袧褍卸薪芯 胁褘斜褉邪褌褜",
      "袧褍卸薪芯 褉邪蟹褉械褕械薪懈械",
      "袩褉芯胁械褉褜 褉械蟹褍谢褜褌邪褌褘",
      "袩褉芯泄写懈褋褜 屑懈薪褍褌褍",
      "袙褘锌械泄 胁芯写褘",
      "袪械蟹褍谢褜褌邪褌褘 懈薪褋褌褉褍屑械薪褌邪 谐芯褌芯胁褘",
    ],
  },
  ar: {
    dir: "rtl",
    languageLabel: "丕賱賱睾丞",
    nav: { download: "鬲賳夭賷賱", github: "GitHub", petdex: "PetDex" },
    eyebrow: "Interactive desktop companion",
    hero: "乇賮賷賯 亘賰爻賱 賱賱鬲賵賯賮丕鬲 賵卮乇亘 丕賱賲丕亍 賵丕賱鬲乇賰賷夭 賵鬲賳亘賷賴丕鬲 Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes 丕賱丨賷丞.",
    localFirst: "賲丨賱賷 兀賵賱丕. 賱丕 鬲丨鬲丕噩 丨爻丕亘丕.",
    petdexLine1: "賲鬲賵丕賮賯 賲毓 鬲賳爻賷賯 丨賷賵丕賳丕鬲 Codex.",
    petdexLine2: "丨賲賾賱 丕賱賲夭賷丿 賲賳 賲噩鬲賲毓 PetDex.",
    bubbles: "賷囟賷賮 v1.0.6 鬲賳亘賷賴 丕賱亘胤丕乇賷丞 賵兀賷丕賲 丕賱乇賮賯丞 賵禺乇賷胤丞 丕賱鬲乇賰賷夭 賵賲丿丞 丕賱賮賯丕毓丕鬲 賵丕鬲噩丕賴丕鬲 丨乇賰丞 兀賰孬乇.",
    release: "Latest release: v1.0.6",
    downloadTitle: "丕禺鬲乇 丕賱賲孬亘鬲",
    downloadSubtitle: "丨賲賾賱 兀丨丿孬 賳爻禺丞 賱賳馗丕賲賰.",
    downloadAll: "毓乇囟 賰賱 丕賱廿氐丿丕乇丕鬲",
    closeDownload: "廿睾賱丕賯 賳丕賮匕丞 丕賱鬲賳夭賷賱",
    starNudge: "丕丿毓賲賳丕 亘賳噩賲丞 毓賱賶 GitHub.",
    starNudgeCountdown: "賷賳爻丨亘 禺賱丕賱 {seconds} 孬",
    starNudgeAria: "丕賮鬲丨 GitHub 賱賲賳丨 MyPets 賳噩賲丞",
    prompts: [
      "Codex 賷賮賰乇",
      "Claude Code 賷爻鬲禺丿賲 兀丿丕丞",
      "OpenCode 賷卮睾賱 賳氐丕",
      "DeepSeek TUI 賷賮賰乇",
      "Hermes 賷卮睾賱 賳氐丕",
      "賷丨鬲丕噩 丕禺鬲賷丕乇賰",
      "賷丨鬲丕噩 廿匕賳丕",
      "乇丕噩毓 丕賱賳鬲丕卅噩",
      "丕賲卮 丿賯賷賯丞 賵丕丨丿丞",
      "丕卮乇亘 亘毓囟 丕賱賲丕亍",
      "毓丕丿鬲 賳鬲丕卅噩 丕賱兀丿丕丞",
    ],
  },
};

const PROMPT_COUNT = copies["zh-CN"].prompts.length;

function renderBrandedText(text: string): ReactNode[] {
  return text.split(brandedAgentPattern).map((part, index) =>
    brandedAgentNames.includes(part) ? (
      <span className="logo-word" key={`${part}-${index}`}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function resolveLanguage(value: string | undefined): Language {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("ko")) return "ko";
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("fr")) return "fr";
  if (normalized.startsWith("de")) return "de";
  if (normalized.startsWith("ru")) return "ru";
  if (normalized.startsWith("ar")) return "ar";
  return "en";
}

type PetDefinition = {
  slug: string;
  name: string;
  asset: string;
};

const pets: PetDefinition[] = [
  { slug: "duo", name: "Duo", asset: "/pets/duo.webp" },
  { slug: "lil-finder", name: "Lil Finder", asset: "/pets/lil-finder.webp" },
  { slug: "pingu", name: "Pingu", asset: "/pets/pingu.webp" },
  { slug: "shinchan", name: "Shinchan", asset: "/pets/shinchan.webp" },
  { slug: "clippy", name: "Clippy", asset: "/pets/clippy.webp" },
  { slug: "crab-buddy", name: "Crab Buddy", asset: "/pets/crab-buddy.webp" },
  { slug: "lando", name: "Lando", asset: "/pets/lando.webp" },
  { slug: "macintosh", name: "Macintosh", asset: "/pets/macintosh.webp" },
  { slug: "wall-e", name: "Wall-E", asset: "/pets/wall-e.webp" },
  { slug: "triple-t", name: "Triple T", asset: "/pets/triple-t.webp" },
];

export default function PetChaseLanding() {
  const reactionTimer = useRef<number | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isStarNudgeVisible, setIsStarNudgeVisible] = useState(false);
  const [starNudgeSeconds, setStarNudgeSeconds] = useState(starNudgeDurationSeconds);
  const [starCountLabel, setStarCountLabel] = useState("...");
  const [activePet, setActivePet] = useState<{ slug: string; promptIndex: number } | null>(null);
  const copy = copies[language];
  const starNudgeCountdown = copy.starNudgeCountdown.replace("{seconds}", String(starNudgeSeconds));
  const [petdexPrefix, petdexSuffix] = copy.petdexLine2.split("PetDex");
  const primaryMobileLinks = links.filter((link) => link.id === "github" || link.id === "petdex");
  const secondaryMobileLinks = links.filter((link) => link.id !== "github" && link.id !== "petdex");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = copy.dir ?? "ltr";
  }, [copy.dir, language]);

  useEffect(() => {
    return () => {
      if (reactionTimer.current) window.clearTimeout(reactionTimer.current);
    };
  }, []);

  useEffect(() => {
    const duration = starNudgeDurationMs;
    const startedAt = Date.now();
    setIsStarNudgeVisible(true);
    setStarNudgeSeconds(starNudgeDurationSeconds);

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((duration - (Date.now() - startedAt)) / 1000));
      setStarNudgeSeconds(remaining);

      if (remaining <= 0) {
        setIsStarNudgeVisible(false);
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let timer: number | null = null;

    const loadStars = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/angziii/MyPets", {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!response.ok) return;
        const data = (await response.json()) as { stargazers_count?: number };
        const count = data.stargazers_count;
        if (isCancelled || typeof count !== "number") return;
        const label = new Intl.NumberFormat("en", { notation: "compact" }).format(count);
        setStarCountLabel(label);
      } catch {
        if (!isCancelled) setStarCountLabel("...");
      }
      if (!isCancelled) {
        timer = window.setTimeout(loadStars, 60000);
      }
    };

    void loadStars();
    return () => {
      isCancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isLanguageMenuOpen && !isMobileNavOpen) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (topbarRef.current && !topbarRef.current.contains(target)) {
        setIsMobileNavOpen(false);
        setIsLanguageMenuOpen(false);
        return;
      }
      if (isLanguageMenuOpen && languageMenuRef.current && !languageMenuRef.current.contains(target)) {
        setIsLanguageMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
        setIsLanguageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isLanguageMenuOpen, isMobileNavOpen]);

  useEffect(() => {
    if (!isDownloadOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDownloadOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDownloadOpen]);

  const openDownloadDialog = () => {
    setIsDownloadOpen(true);
    setIsMobileNavOpen(false);
    setIsLanguageMenuOpen(false);
  };

  const renderLanguagePicker = (extraClassName = "") => (
    <div className={`language-picker ${extraClassName}`.trim()} ref={languageMenuRef}>
      <button
        type="button"
        className="language-trigger"
        aria-haspopup="listbox"
        aria-expanded={isLanguageMenuOpen}
        aria-label={copy.languageLabel}
        onClick={() => setIsLanguageMenuOpen((open) => !open)}
      >
        <span>{copy.languageLabel}</span>
        <span className="language-current">
          {languageOptions.find((option) => option.value === language)?.label ?? language}
        </span>
        <span className={isLanguageMenuOpen ? "language-caret is-open" : "language-caret"}>鈻?/span>
      </button>
      <ul
        className={isLanguageMenuOpen ? "language-menu is-open" : "language-menu"}
        role="listbox"
        aria-label={copy.languageLabel}
      >
        {languageOptions.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              role="option"
              aria-selected={option.value === language}
              className={option.value === language ? "language-option is-active" : "language-option"}
              onClick={() => {
                setLanguage(resolveLanguage(option.value));
                setIsLanguageMenuOpen(false);
                setIsMobileNavOpen(false);
              }}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const reactToPet = (slug: string, index: number) => {
    if (reactionTimer.current) window.clearTimeout(reactionTimer.current);
    setActivePet({
      slug,
      promptIndex: (index * 2 + Math.floor(Math.random() * PROMPT_COUNT)) % PROMPT_COUNT,
    });
    reactionTimer.current = window.setTimeout(() => setActivePet(null), 2600);
  };

  return (
    <main className="page-shell" dir={copy.dir ?? "ltr"}>
      <a
        aria-hidden={!isStarNudgeVisible}
        aria-label={copy.starNudgeAria}
        className={isStarNudgeVisible ? "star-nudge is-visible" : "star-nudge"}
        href={repoUrl}
        rel="noreferrer"
        target="_blank"
        tabIndex={isStarNudgeVisible ? 0 : -1}
      >
        <span className="star-nudge__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.25.82-.57l-.01-2.01c-3.34.72-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.73-1.33-1.73-1.1-.74.08-.73.08-.73 1.21.09 1.85 1.22 1.85 1.22 1.08 1.82 2.83 1.3 3.52.99.11-.77.42-1.3.77-1.59-2.67-.3-5.47-1.31-5.47-5.82 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.11-3.16 0 0 .99-.31 3.24 1.2a11.3 11.3 0 0 1 5.9 0c2.25-1.51 3.24-1.2 3.24-1.2.64 1.64.23 2.86.11 3.16.76.82 1.22 1.87 1.22 3.15 0 4.52-2.8 5.51-5.48 5.81.43.37.82 1.09.82 2.2l-.01 3.26c0 .32.22.68.83.57A12 12 0 0 0 12 .5Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="star-nudge__body">
          <span className="star-nudge__message">{copy.starNudge}</span>
          <span className="star-nudge__countdown" aria-live="polite">
            {starNudgeCountdown}
          </span>
        </span>
        <span className="star-nudge__meter" aria-hidden="true" />
      </a>
      <section className="hero-stage" aria-label="MyPets interactive pet playground">
        <nav className="topbar" aria-label="MyPets links" ref={topbarRef}>
          <div className="desktop-nav-links">
            {links.map((link) =>
              link.id === "download" ? (
                <button
                  aria-haspopup="dialog"
                  className="nav-link nav-link--primary"
                  key={link.id}
                  onClick={openDownloadDialog}
                  type="button"
                >
                  {copy.nav[link.id]}
                </button>
              ) : (
                <a
                  className="nav-link"
                  href={link.href}
                  key={link.id}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.id === "github" ? `${copy.nav[link.id]} stars ${starCountLabel}` : undefined}
                >
                {link.id === "github" ? (
                  <span className="github-inline-stars" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="github-inline-logo" focusable="false">
                      <path
                        d="M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.25.82-.57l-.01-2.01c-3.34.72-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.73-1.33-1.73-1.1-.74.08-.73.08-.73 1.21.09 1.85 1.22 1.85 1.22 1.08 1.82 2.83 1.3 3.52.99.11-.77.42-1.3.77-1.59-2.67-.3-5.47-1.31-5.47-5.82 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.11-3.16 0 0 .99-.31 3.24 1.2a11.3 11.3 0 0 1 5.9 0c2.25-1.51 3.24-1.2 3.24-1.2.64 1.64.23 2.86.11 3.16.76.82 1.22 1.87 1.22 3.15 0 4.52-2.8 5.51-5.48 5.81.43.37.82 1.09.82 2.2l-.01 3.26c0 .32.22.68.83.57A12 12 0 0 0 12 .5Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg viewBox="0 0 24 24" className="github-inline-star-icon" focusable="false">
                      <path
                        d="M12 3.2 14.89 9l6.41.93-4.65 4.52 1.1 6.39L12 17.8l-5.75 3.04 1.1-6.39L2.7 9.93 9.11 9 12 3.2Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>{starCountLabel}</span>
                  </span>
                ) : (
                  copy.nav[link.id]
                )}
                </a>
              ),
            )}
            {renderLanguagePicker()}
          </div>
          <div className="mobile-nav">
            <div className="mobile-nav-row">
              {primaryMobileLinks.map((link) => (
                <a
                  className={
                    link.primary
                      ? "nav-link nav-link--primary"
                      : link.id === "github"
                        ? "nav-link mobile-star-link"
                        : "nav-link"
                  }
                  href={link.href}
                  key={link.id}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.id === "github" ? (
                    <span className="github-inline-stars" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="github-inline-logo" focusable="false">
                        <path
                          d="M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.25.82-.57l-.01-2.01c-3.34.72-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.73-1.33-1.73-1.1-.74.08-.73.08-.73 1.21.09 1.85 1.22 1.85 1.22 1.08 1.82 2.83 1.3 3.52.99.11-.77.42-1.3.77-1.59-2.67-.3-5.47-1.31-5.47-5.82 0-1.28.46-2.33 1.22-3.15-.12-.3-.53-1.52.11-3.16 0 0 .99-.31 3.24 1.2a11.3 11.3 0 0 1 5.9 0c2.25-1.51 3.24-1.2 3.24-1.2.64 1.64.23 2.86.11 3.16.76.82 1.22 1.87 1.22 3.15 0 4.52-2.8 5.51-5.48 5.81.43.37.82 1.09.82 2.2l-.01 3.26c0 .32.22.68.83.57A12 12 0 0 0 12 .5Z"
                          fill="currentColor"
                        />
                      </svg>
                      <svg viewBox="0 0 24 24" className="github-inline-star-icon" focusable="false">
                        <path
                          d="M12 3.2 14.89 9l6.41.93-4.65 4.52 1.1 6.39L12 17.8l-5.75 3.04 1.1-6.39L2.7 9.93 9.11 9 12 3.2Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>{starCountLabel}</span>
                    </span>
                  ) : (
                    copy.nav[link.id]
                  )}
                </a>
              ))}
              <button
                type="button"
                className={isMobileNavOpen ? "mobile-nav-toggle is-open" : "mobile-nav-toggle"}
                aria-label="Toggle more links"
                aria-expanded={isMobileNavOpen}
                onClick={() => {
                  setIsMobileNavOpen((open) => !open);
                  setIsLanguageMenuOpen(false);
                }}
              >
                鈻?              </button>
            </div>
            <div className={isMobileNavOpen ? "mobile-nav-panel is-open" : "mobile-nav-panel"}>
              {secondaryMobileLinks.map((link) =>
                link.id === "download" ? (
                  <button
                    aria-haspopup="dialog"
                    className="mobile-panel-link mobile-panel-button"
                    key={link.id}
                    onClick={openDownloadDialog}
                    type="button"
                  >
                    {copy.nav[link.id]}
                  </button>
                ) : (
                  <a
                    className="mobile-panel-link"
                    href={link.href}
                    key={link.id}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {copy.nav[link.id]}
                  </a>
                ),
              )}
              {renderLanguagePicker("language-picker--panel")}
            </div>
          </div>
        </nav>

        <div className="hero-copy">
          <h1>MyPets</h1>
          <p className="hero-text">{renderBrandedText(copy.hero)}</p>
        </div>

        <div className="pet-grid" aria-label="Interactive MyPets pets">
          {pets.map((pet, index) => {
            const isActive = activePet?.slug === pet.slug;
            return (
              <button
                aria-label={`${pet.name}: ${copy.prompts[(index * 2) % copy.prompts.length]}`}
                className={isActive ? "pet-card is-reacting" : "pet-card"}
                key={pet.slug}
                onClick={() => reactToPet(pet.slug, index)}
                type="button"
              >
                <span className={isActive ? "pet-bubble is-visible" : "pet-bubble"}>
                  {renderBrandedText(copy.prompts[activePet?.promptIndex ?? (index * 2) % copy.prompts.length])}
                </span>
                <span
                  className="pet-sprite"
                  style={{ "--pet-image": `url(${pet.asset})` } as CSSProperties}
                />
                <span className="pet-name">{pet.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="info-strip" aria-label="MyPets highlights">
        <p>{copy.localFirst}</p>
        <p>
          <span className="petdex-lines">
            <span>{copy.petdexLine1}</span>
            <span>
              {petdexPrefix}
              <a className="inline-link" href={petdexUrl} target="_blank" rel="noreferrer">
                PetDex
              </a>
              {petdexSuffix}
            </span>
          </span>
        </p>
        <p>{copy.bubbles}</p>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <span>MyPets by angziii</span>
          <span>{copy.release}</span>
        </div>
        <nav className="footer-links" aria-label="MyPets trust and support links">
          <a href="/about">About</a>
          <a href="/support">Support</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </footer>

      {isDownloadOpen ? (
        <div className="download-layer" role="presentation" onMouseDown={() => setIsDownloadOpen(false)}>
          <div
            aria-labelledby="download-title"
            aria-modal="true"
            className="download-dialog"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label={copy.closeDownload}
              className="download-close"
              onClick={() => setIsDownloadOpen(false)}
              type="button"
            >
              脳
            </button>
            <div className="download-dialog__header">
              <p>{latestVersion}</p>
              <h2 id="download-title">{copy.downloadTitle}</h2>
              <span>{copy.downloadSubtitle}</span>
            </div>
            <div className="download-options">
              {downloadOptions.map((option) => (
                <a
                  className="download-option"
                  href={option.href}
                  key={option.title}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{option.title}</span>
                  <small>{option.meta}</small>
                </a>
              ))}
            </div>
            <a className="download-all" href={latestReleaseUrl} target="_blank" rel="noreferrer">
              {copy.downloadAll}
            </a>
          </div>
        </div>
      ) : null}
    </main>
  );
}
