# 维护手册

这份手册给群管理员和核心编辑使用，记录 GitHub、Cloudflare Pages、日常审核、回滚和后续机器人接入的操作方式。

## GitHub 远程仓库

- 仓库地址：`https://github.com/blueraina/group-vault`
- 生产分支：`main`
- 仓库可见性：Private

本机如果 `github.com` 被错误解析到 `127.0.0.1`，推送时可临时使用：

```powershell
git -c http.curloptResolve=+github.com:443:140.82.112.3 -c http.version=HTTP/1.1 push
```

这只影响当前命令，不会修改系统 hosts。

## GitHub 分支保护

进入仓库网页：

1. 打开 `https://github.com/blueraina/group-vault`。
2. 进入 `Settings`。
3. 打开 `Rules` 或 `Branches`。
4. 为 `main` 新建规则或 branch protection rule。
5. 启用 `Require a pull request before merging`。
6. 启用至少 1 个 approval。
7. 禁止 force push。
8. 禁止删除 `main`。
9. 如果之后 Cloudflare 或 GitHub Actions 有构建检查，再启用“必须检查通过后才能合并”。

目标是：普通成员不能直接 push 到 `main`，所有正式内容都通过 Pull Request 审核。

## Cloudflare Pages

进入 Cloudflare Dashboard：

1. 打开 `Workers & Pages`。
2. 点击 `Create application`。
3. 选择 `Pages`。
4. 选择 `Connect to Git`。
5. 授权并选择 GitHub 仓库 `group-vault`。
6. 设置：
   - Production branch：`main`
   - Framework preset：`None`
   - Build command：`npx quartz plugin install && npx quartz build`
   - Build output directory：`public`
7. 点击部署。
8. 部署完成后记录 `*.pages.dev` 地址，并写回 `README.md`。

通常不需要环境变量。如果 Cloudflare 报 Node 版本不足，添加：

```text
NODE_VERSION=22.16.0
```

## 自动部署验证

首次 Cloudflare Pages 连接后，按下面流程测试：

```powershell
git switch -c test/update-homepage
```

修改 `content/00-首页.md` 后：

```powershell
git add content/00-首页.md
git commit -m "test: update homepage"
git push -u origin test/update-homepage
```

然后：

1. 在 GitHub 创建 Pull Request。
2. 检查修改内容。
3. 合并到 `main`。
4. 打开 Cloudflare Pages，确认出现新部署。
5. 打开网页，确认内容已更新。
6. 运行 `git log --oneline`，确认能看到测试提交。

## 群友简短教程

1. 安装 Obsidian。
2. 安装 Git。
3. 克隆仓库。
4. 用 Obsidian 打开仓库文件夹。
5. 编辑前先 pull。
6. 不要直接改 `main`。
7. 新建分支后编辑笔记。
8. 写完 commit。
9. push 到自己的分支。
10. 发 Pull Request。
11. 等管理员审核。
12. 不要多人同时改同一篇笔记，遇到冲突找管理员。

不会 Git 的群友可以通过 GitHub Issue 投稿。

## 管理员审核流程

审核 Pull Request 时检查：

- 是否有明确修改原因。
- 是否只改了相关笔记。
- 是否包含敏感信息、密钥、手机号、住址、cookie、session 或 API key。
- 是否粘贴私人聊天记录原文。
- 是否包含未授权转载内容。
- 图片是否放在 `assets/images/`。
- Markdown 链接和 Obsidian 双链是否有效。
- 首页、分类或索引是否需要同步更新。

确认无误后再合并。合并后等待 Cloudflare Pages 自动部署。

## 整理 inbox

1. 定期查看 `inbox/` 和 GitHub Issue。
2. 确认内容来源、授权和敏感信息。
3. 拆成一篇主题一篇 Markdown。
4. 补齐 frontmatter。
5. 移动到 `content/`。
6. 更新首页或相关分类页。
7. 通过 Pull Request 合并。

## 回滚方法

查看历史：

```powershell
git log --oneline
```

回滚某个提交：

```powershell
git revert <commit-id>
```

恢复某个文件的旧版本：

```powershell
git checkout <commit-id> -- path/to/file.md
git commit -m "revert: restore old file version"
```

不要用 `git reset --hard` 加 `force push` 覆盖远程历史。管理员误合并后，应优先新建一个 revert commit，再通过 Pull Request 审核。

## 后续 AstrBot 预留方案

本阶段不接 AstrBot、不接 QQ 群机器人、不做自动 RAG。未来可以：

1. 让 AstrBot 定时 `git pull` 仓库。
2. 扫描 `content/` 下 Markdown。
3. 建立本地索引或向量索引。
4. 将索引用于 QQ 群问答。
5. 仍然保持 GitHub PR 审核作为正式知识入口。
