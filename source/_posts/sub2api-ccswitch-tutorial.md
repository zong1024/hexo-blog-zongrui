---
title: OpenCode / Claude Code / Codex 配合 CC Switch 接入 SUB2API 中转站教程
date: 2026-06-08 15:55:00
tags:
  - OpenCode
  - Claude Code
  - Codex
  - CC Switch
  - SUB2API
  - API
categories:
  - AI
  - 教程
---

本文是一篇给新手看的配置教程，主要讲如何在 **OpenCode**、**Claude Code**、**Codex** 这三类 AI 编程工具中，配合 **CC Switch** 管理配置，并统一接入我的 **SUB2API 中转站 URL 和密钥**。

先把关系说清楚：

> **SUB2API 才是中转站。**
>
> **CC Switch 不是中转站，它只是用来切换 Provider、模型和配置的工具。**

也就是说，真正接收请求的是 SUB2API；CC Switch 只是帮助你更方便地在不同工具、不同模型、不同 Provider 之间切换。

<!-- more -->

## 一、我的 SUB2API 信息

SUB2API 官网地址：

```text
https://20260513.xyz
```

OpenAI-compatible API 地址：

```text
https://20260513.xyz/v1
```

密钥填写位置示例：

```text
<YOUR_SUB2API_KEY>
```

如果你拿到我提供的赠送密钥，把它完整复制到客户端的密钥输入框即可。

## 二、整体关系

整个调用链可以简单理解成：

```text
OpenCode / Claude Code / Codex
        ↓
通过 CC Switch 选择或切换配置
        ↓
请求你的 SUB2API OpenAI URL
        ↓
SUB2API 转发到上游模型服务
```

所以真正需要填写的是三样东西：

```text
SUB2API OpenAI URL
SUB2API 密钥
SUB2API 后台支持的模型名
```

本文对应配置为：

```text
Base URL: https://20260513.xyz/v1
Key:      <YOUR_SUB2API_KEY>
Model:    SUB2API 后台支持的模型名
```

## 三、配置 CC Switch

CC Switch 的作用不是转发请求，而是帮你管理和切换不同配置。

你可以在 CC Switch 中新建一个 Provider，例如叫：

```text
SUB2API
```

配置逻辑如下：

```json
{
  "name": "SUB2API",
  "base_url": "https://20260513.xyz/v1",
  "api_key": "<YOUR_SUB2API_KEY>",
  "models": [
    "gpt-5.1-codex",
    "claude-sonnet-4-5",
    "deepseek-chat"
  ]
}
```

这里需要注意：

- `base_url` 填 SUB2API 的 OpenAI URL，也就是 `https://20260513.xyz/v1`；
- `api_key` 填 SUB2API 的密钥；
- `models` 填 SUB2API 后台实际支持的模型名；
- CC Switch 只是切换配置，不是中转站。

错误理解：

```text
OpenCode → CC Switch → SUB2API
```

正确理解：

```text
OpenCode → 使用 CC Switch 选中的配置 → SUB2API
```

## 四、OpenCode 接入 SUB2API

OpenCode 如果支持 OpenAI-compatible Provider，就可以直接接入 SUB2API。

配置项一般类似：

```text
Provider: OpenAI Compatible
Base URL: https://20260513.xyz/v1
Key:      <YOUR_SUB2API_KEY>
Model:    SUB2API 后台支持的模型名
```

如果 OpenCode 支持环境变量，也可以这样配置：

```bash
export OPENAI_BASE_URL="https://20260513.xyz/v1"
export OPENAI_API_KEY="<YOUR_SUB2API_KEY>"
```

然后启动 OpenCode：

```bash
opencode
```

如果能正常返回模型回答，说明 OpenCode 已经通过 SUB2API 连通。

## 五、Claude Code 接入 SUB2API

Claude Code 本身偏向 Anthropic 体系，所以这里要看 SUB2API 是否提供 Claude 兼容接口，或者是否把 Claude 模型转换成 OpenAI-compatible 格式。

如果你的 SUB2API 提供 OpenAI-compatible 接口，配置思路仍然是：

```text
Base URL: https://20260513.xyz/v1
Key:      <YOUR_SUB2API_KEY>
Model:    SUB2API 后台支持的 Claude 模型名
```

如果使用 Anthropic 兼容环境变量，常见写法可能类似：

```bash
export ANTHROPIC_BASE_URL="https://20260513.xyz"
export ANTHROPIC_AUTH_TOKEN="<YOUR_SUB2API_KEY>"
```

实际变量名以你当前 Claude Code 和 SUB2API 的兼容方式为准。

重点是：

```text
Claude Code 不是连 CC Switch
Claude Code 最终请求的是 SUB2API
CC Switch 只是负责切换配置
```

## 六、Codex 接入 SUB2API

Codex 通常可以通过配置文件添加自定义 Provider。

假设 Codex 配置文件支持 `model_providers`，可以写成类似下面这样：

```toml
[model_providers.sub2api]
name = "SUB2API"
base_url = "https://20260513.xyz/v1"
env_key = "SUB2API_API_KEY"

[profiles.sub2api]
model_provider = "sub2api"
model = "gpt-5.1-codex"
```

然后设置环境变量。

Linux / macOS：

```bash
export SUB2API_API_KEY="<YOUR_SUB2API_KEY>"
```

Windows PowerShell：

```powershell
setx SUB2API_API_KEY "<YOUR_SUB2API_KEY>"
```

设置完成后，重新打开终端，再启动 Codex。

如果你想切换模型，只需要修改：

```toml
model = "gpt-5.1-codex"
```

把它改成 SUB2API 后台支持的其他模型即可。

## 七、测试是否接入成功

可以用 curl 简单测试 SUB2API 是否可用：

```bash
curl https://20260513.xyz/v1/models \
  -H "Authorization: Bearer <YOUR_SUB2API_KEY>"
```

如果返回模型列表，说明 Base URL 和密钥基本没问题。

也可以测试聊天接口：

```bash
curl https://20260513.xyz/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_SUB2API_KEY>" \
  -d '{
    "model": "gpt-5.1-codex",
    "messages": [
      {
        "role": "user",
        "content": "Hello, SUB2API test."
      }
    ]
  }'
```

如果返回正常 JSON，说明 SUB2API 可以正常转发请求。

## 八、常见错误

### 1. 把 CC Switch 当成中转站

这是最容易弄错的地方。

错误理解：

```text
客户端请求 CC Switch URL
```

正确理解：

```text
客户端请求 SUB2API URL
CC Switch 只负责切换配置
```

### 2. Base URL 没有带 `/v1`

OpenAI-compatible 接口通常需要：

```text
https://20260513.xyz/v1
```

如果只写：

```text
https://20260513.xyz
```

可能会出现接口路径错误。

### 3. 模型名写错

客户端填写的模型名必须在 SUB2API 后台存在。

例如后台支持：

```text
gpt-5.1-codex
claude-sonnet-4-5
deepseek-chat
```

那客户端里就应该填写这些名字，而不是随便写一个不存在的模型名。

### 4. 密钥填错位置

密钥通常不是填在 Base URL 里，而是填在：

```text
Authorization: Bearer <YOUR_SUB2API_KEY>
```

或者客户端的密钥输入框里。

### 5. HTTP / HTTPS 写错

本文使用的是 HTTPS：

```text
https://20260513.xyz/v1
```

不要写成：

```text
http://20260513.xyz/v1
```

## 九、总结

这套配置的核心只有一句话：

> **SUB2API 是中转站，CC Switch 是配置切换工具。**

OpenCode、Claude Code、Codex 都是调用端，它们最终请求的应该是 SUB2API 的 OpenAI URL。

记住这三个配置项：

```text
Base URL = https://20260513.xyz/v1
Key      = <YOUR_SUB2API_KEY>
Model    = SUB2API 后台支持的模型名
```

配置完成后，就可以通过 CC Switch 在不同工具和模型之间快速切换，同时统一走我的 SUB2API 中转站。
