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

MyPets es un compa帽ero de escritorio pixel art para macOS y Windows. Vive en tu pantalla, te recuerda descansar y beber agua, ayuda a proteger tus sesiones de enfoque y admite personajes con formato PetDex.

Es local-first: los ajustes, estad铆sticas, compa帽eros importados e historial de enfoque se quedan en tu equipo.

## Funciones

- Compa帽ero pixelado transparente, siempre visible y arrastrable
- Recordatorios de descanso y modo opcional de bloqueo de pantalla
- Recordatorios de agua con estad铆sticas hist贸ricas
- Recordatorios diarios personalizados con cuenta atr谩s configurable y agrandado opcional de la mascota al avisar
- Detecci贸n de distracciones en macOS por app o palabra clave
- Alertas locales de Codex / Claude Code / OpenCode / DeepSeek TUI / Hermes al terminar o requerir revisi贸n
- Importaci贸n de paquetes `pet.json + spritesheet.webp/png`
- Lectura autom谩tica de personajes PetDex en `~/.codex/pets`
- Interfaz en 9 idiomas y modo oscuro del sistema

## Instalaci贸n

Descarga instaladores desde [Releases](https://github.com/angziii/MyPets/releases).

| Archivo | Plataforma |
| --- | --- |
| `MyPets-x.x.x-mac-arm64.dmg` | macOS Apple Silicon |
| `MyPets-x.x.x-mac-x64.dmg` | macOS Intel |
| `MyPets-x.x.x-win-x64.exe` | Windows 64-bit |

## Hermes (WSL) 鈫?MyPets (Windows)

Si Hermes se ejecuta en WSL y MyPets en Windows, Hermes debe escribir eventos en una ruta que la app de Windows tambi茅n pueda leer. El hook reciente de Hermes lo hace autom谩ticamente, pero si MyPets sigue sin reaccionar, fija la ruta en el plugin de WSL.

```bash
nano ~/.hermes/plugins/mypets-agent-hook/__init__.py
```

Reemplaza toda la funci贸n `_output_file()` por:

```python
def _output_file() -> Path:
    # WSL -> Windows MyPets fallback.
    return Path("/mnt/c/Users/Administrator/.local/share/mypets/agent-events/hermes.jsonl")
```

Si el usuario de Windows no es `Administrator`, cambia esa parte por el nombre real. Luego ejecuta en WSL:

```bash
mkdir -p /mnt/c/Users/Administrator/.local/share/mypets/agent-events
```

Por 煤ltimo, reinicia Hermes.

## Ejecutar desde c贸digo fuente

```bash
git clone https://github.com/angziii/MyPets.git
cd MyPets
corepack enable
corepack pnpm install
corepack pnpm dev
```

Los paquetes grandes de personajes no se incluyen para mantener el repositorio peque帽o. Imp贸rtalos localmente o inst谩lalos con PetDex.
