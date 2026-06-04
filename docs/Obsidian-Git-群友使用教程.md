# Obsidian Git 群友使用教程

本文档给本群核心编辑使用，目标是让大家可以在 Obsidian 里直接修改知识库，并一键同步到 GitHub。同步成功后，Cloudflare Pages 会自动更新网站。

知识库网站：

```text
https://group-vault.pages.dev
```

GitHub 仓库：

```text
https://github.com/blueraina/group-vault
```

本协作方式采用“方案 A”：可信核心编辑拥有 GitHub 仓库写权限，可以直接同步到 `main` 分支，不需要每次提交 Pull Request 审核。

请注意：GitHub collaborator 权限是仓库级权限，不能只限制某个人修改某几个文件夹。因此本文档里的“可修改目录”和“不要修改目录”是协作约定，不是技术强制限制。请只邀请可信成员成为核心编辑。

## 一、你需要准备什么

你需要准备：

1. 一个 GitHub 账号。
2. 已接受仓库 collaborator 邀请。
3. 已安装 Obsidian。
4. 已安装 Git。
5. 已把仓库克隆到本地电脑。
6. 已在 Obsidian 中安装 Obsidian Git 插件。

如果你只是阅读知识库，不需要做下面这些配置，直接打开网站即可：

```text
https://group-vault.pages.dev
```

## 二、接受 GitHub 邀请

管理员邀请你成为 collaborator 后，你会在 GitHub 或邮箱里看到邀请。

操作步骤：

1. 登录 GitHub。
2. 打开邀请链接。
3. 点击接受邀请。
4. 确认自己能打开仓库：

```text
https://github.com/blueraina/group-vault
```

如果打不开仓库，请先联系管理员，不要继续配置 Obsidian。

## 三、安装必要软件

### 1. 安装 Obsidian

打开 Obsidian 官网并安装：

```text
https://obsidian.md
```

### 2. 安装 Git

打开 Git 官网并安装：

```text
https://git-scm.com
```

安装时一路默认即可。安装完成后，重启一次电脑或重新打开终端。

### 3. 登录 GitHub

如果你使用 GitHub Desktop，可以在 GitHub Desktop 中登录 GitHub。

如果你使用命令行 Git，第一次 push 时 GitHub 会要求你登录或授权。按浏览器提示完成即可。

不建议把 GitHub token、密码、cookie 发给任何人。

## 四、克隆知识库到本地

推荐使用 GitHub Desktop，比较适合不熟悉命令行的群友。

### 方法 A：使用 GitHub Desktop

1. 安装并打开 GitHub Desktop。
2. 登录你的 GitHub 账号。
3. 点击 `File -> Clone repository`。
4. 选择 `blueraina/group-vault`。
5. 选择本地保存位置，例如：

```text
D:\obsidian_cowork\group-vault
```

6. 点击 `Clone`。

### 方法 B：使用命令行

打开终端，运行：

```powershell
cd D:\obsidian_cowork
git clone https://github.com/blueraina/group-vault.git
```

如果你想放到其他目录，也可以，只要后面 Obsidian 打开的是克隆下来的 `group-vault` 文件夹即可。

## 五、用 Obsidian 打开知识库

1. 打开 Obsidian。
2. 点击“打开本地文件夹作为仓库”。
3. 选择本地的 `group-vault` 文件夹。
4. 确认左侧能看到这些文件夹：

```text
content
inbox
templates
assets
docs
```

注意：请选择仓库根目录，也就是包含 `content/`、`inbox/`、`templates/`、`assets/` 的那个文件夹。不要只打开 `content/`。

## 六、安装 Obsidian Git 插件

1. 打开 Obsidian 设置。
2. 进入“第三方插件”。
3. 关闭“安全模式”。
4. 点击“浏览”。
5. 搜索 `Git`。
6. 安装插件 `Obsidian Git`。
7. 安装后点击“启用”。

启用后，可以按 `Ctrl + P` 打开命令面板，搜索 `Git`，如果能看到 `Git: Commit-and-sync`，说明插件已经可用。

## 七、Obsidian Git 推荐设置

打开：

```text
设置 -> 第三方插件 -> Obsidian Git
```

推荐先使用“手动一键同步”，不要一开始就全自动。

### 自动同步设置

建议设置：

```text
Split timers for automatic commit and sync: 关
Auto commit-and-sync interval: 0
Auto commit-and-sync after stopping file edits: 关
Auto commit-and-sync after latest commit: 关
Auto push interval: 0
Auto pull interval: 4 或 10
Pull on startup: 开
```

说明：

- `Auto commit-and-sync interval` 设为 `0` 表示不定时自动提交。
- `Auto pull interval` 可以设为 `4` 或 `10`，表示插件会定期拉取别人更新的内容。
- `Pull on startup` 打开后，每次打开 Obsidian 会先同步远端最新内容。

### Commit-and-sync 设置

建议设置：

```text
Push on commit-and-sync: 开
Pull on commit-and-sync: 开
```

这两个必须打开。否则你可能只是本地 commit 了，但没有真正上传到 GitHub，网站也不会更新。

### 提交信息设置

建议把自动提交信息设置成：

```text
vault backup: {{date}}
```

日期格式建议：

```text
YYYY-MM-DD HH:mm:ss
```

这样 GitHub 历史会显示类似：

```text
vault backup: 2026-06-03 22:35:39
```

## 八、日常使用流程

每次编辑前，请先同步最新内容。

### 推荐流程

1. 打开 Obsidian。
2. 等待插件自动 `pull` 最新内容。
3. 修改或新增笔记。
4. 保存文件。
5. 按 `Ctrl + P` 打开命令面板。
6. 搜索并执行：

```text
Git: Commit-and-sync
```

7. 等待同步完成。
8. 几分钟后打开网站确认更新：

```text
https://group-vault.pages.dev
```

### 不要只执行 Commit

不要只执行：

```text
Git: Commit
```

只 commit 代表“保存到本地 Git 历史”，不代表上传到了 GitHub。

要更新网站，必须执行：

```text
Git: Commit-and-sync
```

它会尽量完成：

```text
pull 最新内容 -> commit 本地修改 -> push 到 GitHub -> GitHub Action 更新时间线 -> Cloudflare 部署
```

## 九、哪些目录可以改

核心编辑只应该修改下面这些目录：

```text
content/        正式发布到网站的笔记
inbox/          临时投稿、待整理内容
templates/      笔记模板
assets/images/  图片
docs/           使用说明和协作文档
```

### content/

`content/` 里的 Markdown 会发布到公开网站。

适合放：

- 已整理过的教程。
- 已确认准确的经验。
- 群规、流程、索引页。
- 可以长期公开展示的内容。

不要放：

- 私人聊天记录。
- 账号、密码、token、cookie。
- 未经授权转载的大段内容。
- 还没整理完的草稿。

### inbox/

`inbox/` 用来放待整理内容，一般不直接显示在网站上。

适合放：

- 群友发来的投稿。
- 暂时没整理完的材料。
- 等管理员审核的内容。

整理完成后，再移动到 `content/`。

### templates/

`templates/` 放 Obsidian 笔记模板。

修改模板前最好先和管理员说一声，因为模板会影响大家之后新建笔记的格式。

### assets/images/

图片统一放在：

```text
assets/images/
```

图片命名建议使用小写英文、数字和短横线，例如：

```text
obsidian-git-settings.png
cloudflare-pages-success.png
```

不要使用：

```text
截图1.png
新建图片.png
最终最终版.png
```

## 十、哪些目录不要改

请不要修改下面这些目录或文件，除非管理员明确要求：

```text
quartz/
.quartz/
node_modules/
public/
package.json
package-lock.json
quartz.config.yaml
quartz.ts
.github/
.gitignore
```

这些是网站构建、依赖、部署和仓库配置相关文件。随意修改可能导致网站部署失败。

## 十一、写笔记规范

### 1. 一篇笔记只写一个主题

不要把所有内容都堆进一个大文件。一个主题写一篇，方便搜索、链接和维护。

### 2. 标题清楚

推荐文件名：

```text
01-入门指南.md
Obsidian-Git-使用教程.md
Cloudflare-Pages-部署记录.md
```

不推荐：

```text
新建文档.md
杂项.md
最终版.md
教程2.md
```

### 3. 使用 Obsidian 双链

笔记之间优先使用双链：

```text
[[01-入门指南]]
[[Obsidian-Git-使用教程]]
```

### 4. 外部资料要写来源

如果参考了外部文章、文档、视频，请写来源链接。

不要直接复制大段未经授权内容。

### 5. 不要提交敏感信息

提交前请检查不要包含：

```text
GitHub token
Cloudflare token
API key
.env 文件
cookie
session
手机号
身份证
住址
私人聊天记录原文
未授权转载内容
```

## 十二、网站什么时候更新

你执行 `Git: Commit-and-sync` 后，流程是：

```text
Obsidian -> GitHub -> 维护时间线自动更新 -> Cloudflare Pages -> 网站
```

通常需要几十秒到几分钟。

如果你已经同步成功，但网站没变：

1. 等 1 到 3 分钟。
2. 按 `Ctrl + F5` 强制刷新网页。
3. 确认你修改的是 `content/` 里的文件。
4. 确认 Obsidian Git 没有显示 `ahead 1`。
5. 确认 GitHub Actions 里的 `Update maintenance timeline` 已完成。
6. 如果仍然没更新，联系管理员检查 Cloudflare 部署记录。

注意：

- 修改 `content/` 会发布到网站。
- 修改 `inbox/` 通常不会显示到网站。
- 只 commit 不 push，不会更新网站。
- 普通笔记提交会先触发维护时间线自动更新，然后由 `content/维护时间线.md` 触发 Cloudflare 部署。

## 十三、常见问题

### 1. Obsidian Git 显示 ahead 1 是什么意思

`ahead 1` 表示：

```text
本地有 1 个提交还没有推送到 GitHub
```

这时网站不会更新。

请执行：

```text
Git: Commit-and-sync
```

或者执行：

```text
Git: Push
```

### 2. 出现 conflict 冲突怎么办

冲突通常表示你和别人同时改了同一个文件。

处理方式：

1. 先不要继续乱点同步。
2. 截图错误信息。
3. 联系管理员。
4. 管理员会帮你保留正确内容并解决冲突。

为了减少冲突，建议：

- 编辑前先 pull。
- 不要多人同时改同一篇笔记。
- 大改前在群里说一声。

### 3. 插件提示 authentication failed

这通常是 GitHub 登录或权限问题。

请检查：

1. 是否接受了 collaborator 邀请。
2. GitHub Desktop 是否登录了正确账号。
3. 本地仓库是否是 `blueraina/group-vault`。
4. 是否有权限 push。

还是不行就联系管理员。

### 4. 为什么我改了 inbox 但网站没变

这是正常的。

`inbox/` 是待整理区，不是正式发布区。整理完成后，需要移动到 `content/` 才会显示在网站上。

### 5. 我可以开自动同步吗

可以，但新手不建议一开始就开。

如果想开，可以设置：

```text
Auto commit-and-sync after stopping file edits: 开
```

意思是：你停止编辑一段时间后，插件会自动提交并同步。

风险是：你写到一半的草稿也可能被同步到 GitHub，甚至发布到网站。

建议先手动同步几次，熟悉之后再开自动同步。

## 十四、推荐工作习惯

每次开始编辑：

```text
打开 Obsidian -> 等自动 pull -> 再开始写
```

每次结束编辑：

```text
Ctrl + P -> Git: Commit-and-sync -> 等同步完成
```

准备发布正式内容：

```text
先放 inbox -> 整理检查 -> 移到 content -> Commit-and-sync
```

发布前自查：

```text
没有敏感信息
没有未授权转载
图片路径正常
标题清楚
链接能打开
内容适合公开展示
```

## 十五、管理员联系方式

遇到以下情况请联系管理员：

- push 失败。
- 出现 conflict。
- 不知道内容该放 `content/` 还是 `inbox/`。
- 想大改目录结构。
- 想新增重要分类。
- 不确定某段内容能不能公开。

管理员：

```text
待填写
```

## 十六、一句话总结

核心编辑的日常流程就是：

```text
用 Obsidian 打开 group-vault
只改 content / inbox / templates / assets/images / docs
写完执行 Git: Commit-and-sync
等待维护时间线和 Cloudflare 自动更新网站
```

不要提交隐私、密钥、私人聊天记录和未授权内容。
