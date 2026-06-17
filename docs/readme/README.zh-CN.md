<p align="center">
  <img src="../social-preview.png" alt="MyPets" width="800" />
</p>

<h1 align="center">MyPets</h1>

<p align="center">
  <a href="../../README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a>
</p>

MyPets 是一款本地优先的 AI 桌面宠物应用。它可以常驻在屏幕上，提醒你休息、喝水、保持专注，支持上传 GIF 自定义不同动作形象，并在三击桌宠后调用 DeepSeek API 进行聊天互动。

## 核心功能

- 透明、置顶、可拖拽的桌面宠物。
- 休息提醒、喝水提醒、专注模式和每日自定义提醒。
- 为待机、移动、思考、失败、复核等状态上传不同 GIF。
- 三击桌宠打开聊天气泡，调用 DeepSeek 进行问答。
- 对天气等实时问题尝试获取在线上下文，失败时给出兜底说明。
- 监听 Codex、Claude Code、OpenCode、DeepSeek TUI、Hermes 等本地 Agent 活动。
- 本地保存设置、统计数据和导入的宠物资源。

## 本地开发

```bash
corepack enable
pnpm install
pnpm dev
```

如果 Electron 依赖提示未安装，可重新安装依赖：

```bash
pnpm install
```

## DeepSeek 聊天配置

在启动应用前设置环境变量：

```powershell
$env:DEEPSEEK_API_KEY="你的 DeepSeek API Key"
pnpm.cmd dev
```

也可以使用项目专属变量：

```powershell
$env:MYPETS_DEEPSEEK_API_KEY="你的 DeepSeek API Key"
$env:MYPETS_DEEPSEEK_MODEL="deepseek-chat"
pnpm.cmd dev
```

## AI 产品评估

项目内置了桌宠聊天的离线评估样本：

```bash
pnpm eval:chat
```

评估维度包括：意图识别、依据约束、可执行性、桌宠语气、风险兜底。详见 [AI_PRODUCT_ITERATION.md](../AI_PRODUCT_ITERATION.md)。

## 面试表述边界

可以写：桌面宠物原型、DeepSeek 接入、联网信息补充、GIF 状态自定义、AI 对话评估集、badcase 迭代框架。

不要写：真实上线用户规模、AB 实验、商业转化提升、生产级模型优化，除非你后续真的做了数据记录和验证。
