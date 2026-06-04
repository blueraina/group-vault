# GitHub Desktop + Git 群友使用教程

本文档给已经成为 `blueraina/group-vault` 仓库 collaborator 的群友使用。目标是：不用命令行，也能把知识库下载到本地，用 Obsidian 编辑，并把修改同步回 GitHub。

知识库网站：

```text
https://group-vault.pages.dev
```

GitHub 仓库：

```text
https://github.com/blueraina/group-vault
```

## 一、先说结论

请使用 GitHub Desktop 的 `Clone repository`，不要下载 ZIP。

正确流程是：

```text
接受 GitHub 邀请
-> 安装 GitHub Desktop 和 Git
-> 用 GitHub Desktop 克隆仓库
-> 用 Obsidian 打开本地 group-vault 文件夹
-> 修改笔记
-> 用 GitHub Desktop 或 Obsidian Git 同步
```

不推荐流程：

```text
Download ZIP
-> 解压
-> 想办法登录
-> pull / push
```

原因：ZIP 只是普通文件包，不包含 `.git` 历史和远程仓库连接，不能正常 pull / push。

## 二、你需要准备什么

你需要：

1. 一个 GitHub 账号。
2. 已接受 `blueraina/group-vault` 的 collaborator 邀请。
3. 已安装 Obsidian。
4. 已安装 GitHub Desktop。
5. 已安装 Git。

下载地址：

```text
Obsidian: https://obsidian.md
GitHub Desktop: https://desktop.github.com
Git: https://git-scm.com
```

GitHub Desktop 负责可视化同步；Git 是底层同步工具。即使不用命令行，也建议安装 Git。

## 三、接受 GitHub collaborator 邀请

管理员邀请你之后，你需要先接受邀请。

步骤：

1. 登录 GitHub。
2. 打开 GitHub 或邮箱里的邀请链接。
3. 点击接受邀请。
4. 确认自己能打开仓库：

```text
https://github.com/blueraina/group-vault
```

如果打不开这个仓库，说明邀请还没接受成功，或者登录的 GitHub 账号不对。

## 四、安装并登录 GitHub Desktop

步骤：

1. 打开 `https://desktop.github.com`。
2. 下载并安装 GitHub Desktop。
3. 打开 GitHub Desktop。
4. 按提示登录 GitHub 账号。
5. 登录后确认头像或账号名是你接受 collaborator 邀请的那个账号。

如果登录了错误账号，后面可能看不到仓库，或者无法 push。

## 五、安装 Git

步骤：

1. 打开 `https://git-scm.com`。
2. 下载 Windows 版 Git。
3. 安装时保持默认选项即可。
4. 安装完成后，重启 Obsidian 和 GitHub Desktop。

一般群友不需要手动输入 Git 命令。安装 Git 主要是为了让 Obsidian Git 插件和本机凭据管理正常工作。

## 六、克隆仓库到本地

请用 GitHub Desktop 克隆，不要下载 ZIP。

步骤：

1. 打开 GitHub Desktop。
2. 点击 `File -> Clone repository`。
3. 在列表中找到 `blueraina/group-vault`。
4. 选择本地保存位置，例如：

```text
D:\obsidian_cowork\group-vault
```

5. 点击 `Clone`。
6. 等待下载完成。

克隆完成后，本地会出现一个 `group-vault` 文件夹。这个文件夹才是真正可以同步的仓库。

## 七、用 Obsidian 打开仓库

步骤：

1. 打开 Obsidian。
2. 选择“打开本地文件夹作为仓库”。
3. 选择刚刚克隆下来的 `group-vault` 文件夹。
4. 确认左侧能看到类似这些内容：

```text
content/
inbox/
templates/
assets/
docs/
```

注意：要打开整个 `group-vault` 文件夹，不要只打开 `content/` 文件夹。

## 八、两种同步方式怎么选

有两种常用方式。

### 方式 A：只用 GitHub Desktop 同步

适合新手。优点是界面清楚，不需要配置 Obsidian Git。

日常流程：

```text
打开 GitHub Desktop
-> Fetch origin / Pull origin
-> 打开 Obsidian 写笔记
-> 回到 GitHub Desktop
-> 填写提交说明
-> Commit to main
-> Push origin
```

### 方式 B：用 Obsidian Git 一键同步

适合想在 Obsidian 里直接同步的人。优点是不用来回切换软件。

日常流程：

```text
打开 Obsidian
-> 等自动 pull
-> 写笔记
-> Ctrl + P
-> Git: Commit-and-sync
```

两种方式选一种为主就好。不要在同一批修改里一会儿用 GitHub Desktop commit，一会儿又用 Obsidian Git commit，容易把自己绕晕。

## 九、只用 GitHub Desktop 的详细流程

### 1. 开始写之前先拉取

打开 GitHub Desktop，点击：

```text
Fetch origin
```

如果按钮变成：

```text
Pull origin
```

就继续点击 `Pull origin`。

这一步是把别人已经更新的内容拉到你的电脑，减少冲突。

### 2. 在 Obsidian 修改笔记

用 Obsidian 打开 `group-vault`，然后编辑笔记。

正式发布到网站的笔记放：

```text
content/
```

临时投稿或待整理内容放：

```text
inbox/
```

图片建议放：

```text
assets/images/
```

### 3. 回到 GitHub Desktop 查看变化

写完后回到 GitHub Desktop。左侧会显示你改过的文件。

建议检查一下：

- 有没有误删文件。
- 有没有改到不该改的配置文件。
- 有没有提交隐私信息或密钥。

### 4. 填写提交说明

左下角 `Summary` 填一句简单说明，例如：

```text
更新三对角行列式笔记
```

或：

```text
新增好题分享笔记
```

### 5. Commit 到本地

点击：

```text
Commit to main
```

这一步只是提交到你的电脑本地，还没有上传到 GitHub。

### 6. Push 到 GitHub

继续点击：

```text
Push origin
```

这一步才是上传到 GitHub。上传成功后，网站才会进入自动更新流程。

## 十、使用 Obsidian Git 的详细流程

如果你想在 Obsidian 里直接同步，可以安装 Obsidian Git 插件。

### 1. 安装插件

步骤：

1. 打开 Obsidian 设置。
2. 进入“第三方插件”。
3. 关闭安全模式。
4. 点击“浏览”。
5. 搜索 `Git`。
6. 安装 `Obsidian Git`。
7. 启用插件。

### 2. Obsidian Git 需要登录吗

Obsidian Git 插件本身通常不用登录账号。

它只是调用你电脑里的 Git 来执行：

```text
pull
commit
push
```

真正负责 GitHub 登录和权限的是：

- GitHub Desktop 的登录状态。
- Windows 的 Git Credential Manager。
- 你本机 Git 保存的 GitHub 授权。

所以建议先在 GitHub Desktop 里登录 GitHub，并确认能 pull / push。

### 3. 推荐设置

打开：

```text
设置 -> 第三方插件 -> Obsidian Git
```

推荐设置为“自动拉取，手动提交和推送”。

```text
Auto commit-and-sync interval: 0
Auto commit-and-sync after stopping file edits: 关
Auto commit-and-sync after latest commit: 关
Auto push interval: 0

Auto pull interval: 10
Pull on startup: 开
Pull on commit-and-sync: 开
Push on commit-and-sync: 开
```

这样设置后：

- 会自动拉取别人更新的内容。
- 不会自动提交你写到一半的内容。
- 只有你手动执行 `Git: Commit-and-sync` 时，才会提交并推送。

### 4. 手动同步

写完笔记后：

1. 按 `Ctrl + P` 打开命令面板。
2. 搜索：

```text
Git: Commit-and-sync
```

3. 执行它。
4. 等待右上角提示完成。

不要只执行 `Git: Commit`，因为 commit 只保存到本地，不会上传到 GitHub。

## 十一、哪些目录可以改

普通群友主要修改这些目录：

```text
content/        正式发布到网站的笔记
inbox/          临时投稿、待整理内容
templates/      笔记模板
assets/images/  图片
docs/           使用说明
```

一般不要改这些：

```text
quartz/
plugins-local/
node_modules/
public/
.github/
package.json
package-lock.json
quartz.config.yaml
quartz.ts
```

这些是网站构建和部署相关文件，改错可能导致网站部署失败。

## 十二、新建笔记怎么写

新建正式笔记时，建议放在 `content/` 里。

笔记最开头建议使用这个模板：

```yaml
---
title:
created:
updated:
tags:
  -
status:
authors:
  -
owner:
---
```

填写示例：

```yaml
---
title: 三对角行列式
created: 2026-06-04
updated: 2026-06-04
tags:
  - 数学
status: draft
authors:
  - 张三
owner: 张三
---
```

常用 `status`：

```text
draft          草稿
stable         稳定版
needs-review   需要检查
archived       归档
```

## 十三、网站什么时候更新

你 push 到 GitHub 后，流程大致是：

```text
GitHub 收到你的修改
-> GitHub Action 自动更新 content/维护时间线.md
-> Cloudflare Pages 自动部署
-> 网站更新
```

通常需要几十秒到几分钟。

如果网站没立刻变，先等 1 到 3 分钟，再按 `Ctrl + F5` 强制刷新。

## 十四、冲突是什么，怎么避免

冲突通常是因为两个人同时改了同一篇笔记。

避免方法：

- 开始写之前先 `Pull origin`。
- 不要多人同时大改同一篇笔记。
- 大改前在群里说一声。
- 写完尽快 push，不要长时间留在本地。

如果已经出现 conflict，不要反复点击同步。先截图，联系管理员处理。

## 十五、常见问题

### 1. 为什么不能下载 ZIP 后同步

ZIP 没有 Git 仓库信息，不能正常 pull / push。请用 GitHub Desktop 的 `Clone repository`。

### 2. GitHub Desktop 看不到仓库

常见原因：

- 没接受 collaborator 邀请。
- 登录了错误的 GitHub 账号。
- 管理员邀请的是另一个账号。

### 3. Commit 和 Push 有什么区别

`Commit` 是保存到本地 Git 历史。

`Push` 是上传到 GitHub。

只 commit 不 push，网站不会更新。

### 4. Pull 是什么

`Pull` 是把 GitHub 上别人已经提交的内容同步到你的电脑。

写之前先 pull，可以减少冲突。

### 5. Obsidian Git 报 authentication failed

通常是 GitHub 登录或权限问题。

建议：

1. 打开 GitHub Desktop。
2. 确认登录账号正确。
3. 在 GitHub Desktop 里尝试 `Fetch origin`。
4. 如果仍然失败，退出登录后重新登录 GitHub Desktop。

### 6. Obsidian Git 显示 ahead 1

意思是你本地有 1 个提交还没 push 到 GitHub。

可以执行：

```text
Git: Commit-and-sync
```

或者在 GitHub Desktop 里点击：

```text
Push origin
```

## 十六、发布前检查清单

提交前检查：

- 没有账号、密码、token、cookie、API key。
- 没有私人聊天记录原文。
- 没有未授权转载的大段内容。
- 图片路径正常。
- 数学公式能正常显示。
- 文件放在正确目录。
- 提交说明写清楚。
- 已经 push 到 GitHub。

## 十七、推荐工作习惯

每次开始：

```text
打开 GitHub Desktop
-> Fetch origin / Pull origin
-> 打开 Obsidian 写笔记
```

每次结束：

```text
回到 GitHub Desktop
-> 检查改动
-> 填提交说明
-> Commit to main
-> Push origin
```

如果使用 Obsidian Git：

```text
打开 Obsidian
-> 等自动 pull
-> 写笔记
-> Ctrl + P
-> Git: Commit-and-sync
```

## 十八、一句话总结

不要下载 ZIP。请用 GitHub Desktop 克隆仓库。

写之前先 pull，写完后 commit，再 push。

想在 Obsidian 里一键完成，就安装 Obsidian Git，并设置为“自动 pull，手动 commit-and-sync”。
