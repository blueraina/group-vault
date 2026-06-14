# 群知识库

群知识库是一个由群友共同维护的 Obsidian Markdown 笔记库。维护者主要在 Obsidian 中编辑，通过 Obsidian Git 插件同步到 GitHub；网站由 Quartz 构建并发布到 Cloudflare Pages。

网站地址：<https://group-vault.pages.dev/>

## 当前有什么

- 数学笔记、教程、题目整理和群内长期资料。
- 高等代数白皮书题目整理。
- Obsidian 双链、局部图谱和全局图谱。
- 已读、收藏标记，并在图谱中用颜色区分。
- GitHub 登录。
- 登录后发表评论。
- 已读、收藏和评论身份与 GitHub 账号关联。
- 笔记维护者可以删除不合适的评论。
- 评论管理页用于查看近期评论。
- 全局图谱可以按标签隐藏节点，适合临时隐藏题库类大批量节点。

## 仓库结构

```text
content/                 正式发布到网站的笔记
content/assets/          图片、协作者头像等网页资源
inbox/                   待整理投稿
functions/               Cloudflare Pages Functions API
migrations/              Cloudflare D1 数据库迁移
plugins-local/           本仓库使用的本地 Quartz 插件
scripts/                 维护脚本
```

## 日常维护方式

笔记维护者推荐使用 Obsidian Git 插件，而不是每次都走 Pull Request。

推荐流程：

1. 打开 Obsidian。
2. 等 Obsidian Git 自动 pull 最新内容。
3. 在 `content/` 中新增或修改笔记。
4. 检查内容、来源、标签和双链。
5. 执行 `Git: Commit-and-sync`。
6. 等 GitHub Actions 和 Cloudflare Pages 自动更新网站。

不熟悉 Git 的群友可以把内容发给维护者，或通过 GitHub Issue 投稿，由维护者整理。

Pull Request 主要用于这些情况：

- 修改网站代码、插件、Cloudflare Functions 或数据库迁移。
- 大规模重排目录或重命名文件。
- 外部贡献者没有仓库写权限。
- 维护者希望其他人先审核。

## 写笔记的规则

正式笔记建议放在 `content/`，待整理材料先放在 `inbox/`。

正式笔记建议带 frontmatter：

```yaml
---
title: 标题
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - 高等代数
status: stable
owner: github-login
authors:
  - github-login
---
```

常用 `status`：

- `draft`：草稿。
- `review`：等待核对。
- `stable`：稳定正式内容。
- `deprecated`：已过时，仅保留历史参考。

标签会影响页面展示和图谱过滤。大批量题库建议统一打一个可隐藏标签，例如：

```yaml
tags:
  - 高等代数
    - 高代白皮书
    - 题目
```

这样读者可以在全局图谱设置中隐藏 `高代白皮书`，避免题库节点淹没其他笔记。

## 安全和授权

不要提交：

- GitHub token、Cloudflare token、API key。
- `.env`、cookie、session、私钥。
- 身份证、手机号、住址等个人信息。
- 私人聊天记录原文。
- 未授权转载内容。

向本仓库提交内容，表示你确认自己有权提交这些材料，并同意按仓库协议发布。

## 网站部署要点

网站部署在 Cloudflare Pages。

```text
Build command: npx quartz plugin install && npx quartz build
Build output directory: public
D1 binding: COMMENTS_DB
```

GitHub 登录和评论需要在 Cloudflare Pages 配置：

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
SESSION_SECRET
ADMIN_GITHUB_LOGINS
MAINTAINER_GITHUB_LOGINS
```

D1 迁移：

```powershell
npx wrangler d1 migrations apply group-vault-comments --remote
```

协作者和维护者名单由脚本生成：

```powershell
node scripts/update-collaborators.mjs
```

生成结果包括 `data/collaborators.json`、`functions/_lib/maintainers.generated.js`、协作者头像和本 README 的协作者区块。

## 常见问题

- 评论加载失败并提示 `COMMENTS_DB`：检查 Cloudflare D1 binding。
- 登录提示 `GITHUB_CLIENT_ID is not configured`：检查 Cloudflare 环境变量并重新部署。
- 提示 `no such column`：远程 D1 还没应用最新 migration。
- 维护者不能访问评论管理页：重新生成协作者/维护者名单，或检查 `ADMIN_GITHUB_LOGINS`、`MAINTAINER_GITHUB_LOGINS`。
- 已登录用户数不变：确认 `0003_registered_users.sql` 已应用；这个数字是登录过的用户总数，不是实时在线人数。

## Collaborators / 协作者

<!-- collaborators:start -->

这些 GitHub 账号拥有本仓库协作权限，也是网站上的默认笔记维护者。

<table>
<tr>
<td align="center">
  <a href="https://github.com/blueraina">
    <img src="content/assets/collaborators/blueraina.png" width="64" height="64" alt="@blueraina" />
  </a>
  <br />
  <sub><b>@blueraina</b></sub>
</td>
<td align="center">
  <a href="https://github.com/libinyam">
    <img src="content/assets/collaborators/libinyam.png" width="64" height="64" alt="@libinyam" />
  </a>
  <br />
  <sub><b>@libinyam</b></sub>
</td>
<td align="center">
  <a href="https://github.com/llc-byte">
    <img src="content/assets/collaborators/llc-byte.png" width="64" height="64" alt="@llc-byte" />
  </a>
  <br />
  <sub><b>@llc-byte</b></sub>
</td>
<td align="center">
  <a href="https://github.com/VesperaZephyr">
    <img src="content/assets/collaborators/vesperazephyr.png" width="64" height="64" alt="@VesperaZephyr" />
  </a>
  <br />
  <sub><b>@VesperaZephyr</b></sub>
</td>
</tr>
</table>

<!-- collaborators:end -->

## 协议

本仓库采用双协议：

- 代码、构建脚本、Quartz 配置和本地插件按 MIT License 授权，见 [LICENSE-CODE.txt](LICENSE-CODE.txt)。
- 原创笔记、教程、文档、模板和知识库文字内容按 Creative Commons Attribution-ShareAlike 4.0 International 授权，见 [LICENSE-CONTENT.md](LICENSE-CONTENT.md)。

第三方材料、头像、商标和截图不自动包含在上述授权中。
