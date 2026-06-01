# 协作指南

这份指南给群友和管理员使用，目标是让知识库长期可维护、可审核、可回滚。

## 协作原则

- 先保证准确，再追求完整。
- 一篇笔记只聚焦一个主题，不把所有内容塞进一个大文件。
- 正式内容进 `content/`，待整理内容进 `inbox/`。
- 图片统一放到 `assets/images/`。
- 不提交密钥、隐私、群聊原文、未授权转载内容或账号凭证。

## 普通群友如何投稿

不会 Git 的群友可以通过 GitHub Issue 投稿，选择“内容投稿”模板，填写标题、正文、来源、是否原创和是否允许整理发布。管理员审核后会整理进 `inbox/` 或 `content/`。

会 Git 的群友可以 fork 或新建分支提交 Pull Request。

## 核心编辑工作流

1. 编辑前先拉取最新内容：`git pull`。
2. 新建分支：`git switch -c edit/主题名称`。
3. 修改或新增 Markdown。
4. 检查图片、链接和敏感信息。
5. 提交修改：`git add .`，然后 `git commit -m "docs: update topic"`。
6. 推送分支：`git push -u origin edit/主题名称`。
7. 创建 Pull Request，等待管理员审核。

`main` 分支只放审核后的正式内容。新内容优先放 `inbox/`，或先在 `draft/主题名称`、`edit/主题名称` 分支中整理。

## 文件命名规范

- 中文笔记可以使用清晰中文名，例如 `01-入门指南.md`。
- 文件名尽量短而明确，避免“最终版”“新建文档”“杂项”。
- 同一主题拆成多篇时，可以用数字或主题前缀保持顺序。
- 图片文件名使用小写英文、数字和短横线，例如 `obsidian-git-settings.png`。

## Markdown 写作规范

- 使用一级标题作为页面标题。
- 使用二级、三级标题组织内容。
- 列表保持简短，复杂流程用编号步骤。
- 代码、命令、文件名使用反引号。
- 外部资料要注明来源，不粘贴大段未授权内容。

## Obsidian 双链规范

- 笔记之间优先使用 Obsidian 双链，例如 `[[01-入门指南]]`。
- 不确定是否已有页面时，先搜索再创建新页面。
- 双链文字要能表达上下文，避免一页里堆太多无意义链接。

## Frontmatter 元数据规范

正式笔记建议使用：

```yaml
---
title: 标题
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - 待分类
status: stable
owner: 维护者名称
---
```

`status` 可选值：

- `draft`：草稿。
- `review`：等待审核。
- `stable`：稳定正式内容。
- `deprecated`：已过时，仅保留历史参考。

## 冲突处理

多人不要同时改同一篇笔记。遇到冲突时，先停止继续提交，联系管理员或相关编辑一起处理。处理前可以运行 `git status` 看哪些文件冲突，再人工保留正确内容。

## 回滚错误修改

- 查看历史：`git log --oneline`。
- 回滚某个提交：`git revert <commit-id>`。
- 恢复某个文件旧版本：`git checkout <commit-id> -- path/to/file.md`。

不要用 `git reset --hard` 加 `force push` 覆盖远程历史，这会破坏多人协作。管理员误合并后，应优先用 `git revert` 创建新的回滚提交，再通过 Pull Request 审核。

## 安全清单

提交前请确认没有包含：

- GitHub token、Cloudflare token、API key。
- `.env` 或本地配置文件。
- cookie、session、密钥、私钥。
- 身份证、手机号、住址等个人信息。
- 私人聊天记录原文。
- 未授权转载内容。
