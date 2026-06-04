# 群知识库

这是一个由群友共同维护的长期 Obsidian Markdown 知识库。内容通过 Git 记录历史，进入 `main` 分支后由 Quartz 构建为静态网站发布到 Cloudflare Pages。

## 这个仓库是什么

本仓库存放本群沉淀下来的正式知识、教程、规则、经验和待整理投稿。正式内容放在 `content/`，临时投稿和待整理材料放在 `inbox/`，图片统一放在 `assets/images/`。

本方案使用 GitHub 私有仓库 + Quartz + Cloudflare Pages，不使用 Obsidian Sync 或 Obsidian Publish 作为主同步和发布方案。

## 发布机制

仓库配置了 GitHub Action 自动维护 `content/维护时间线.md`。有人修改 `content/` 内笔记并推送到 `main` 后，Action 会记录“谁在什么时候新增、修改、删除或重命名了哪篇笔记”，再提交维护时间线。

Cloudflare Pages 建议配置 Build watch paths，只监听：

```text
content/维护时间线.md
```

这样普通笔记提交不会立即部署，等维护时间线自动更新后再部署一次，网页会同时包含笔记改动和维护记录。

## 谁可以编辑

有仓库权限的群友可以本地克隆仓库，用 Obsidian、GitHub Desktop、命令行 Git 或 Obsidian Git 插件编辑。普通群友也可以通过 GitHub Issue 投稿，由管理员整理。

## Collaborators / 协作者

<!-- collaborators:start -->

这些 GitHub 账号拥有本仓库协作权限。

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
## 本地打开 Obsidian vault

1. 安装 Obsidian 和 Git。
2. 克隆这个仓库到本地。
3. 打开 Obsidian，选择“打开本地文件夹作为仓库”。
4. 选择本仓库根目录，也就是包含 `content/`、`inbox/`、`assets/` 的文件夹。

## 如何提交修改

1. 编辑前先从远程同步最新内容。
2. 新建自己的分支，例如 `edit/update-guide`。
3. 修改 Markdown 笔记或图片。
4. 提交 commit。
5. 推送分支并创建 Pull Request。
6. 等管理员审核后合并到 `main`。

## 为什么不能直接改 main

`main` 分支代表已经审核过、可以发布到网页的正式内容。直接修改 `main` 会绕过审核，容易把错误内容、敏感信息或未授权材料发布出去。所有修改都应通过 Pull Request 留下讨论、审核和回滚记录。

## 网页地址

部署后填写：`https://group-vault.pages.dev`

## 管理员联系方式

待填写：管理员昵称 / QQ / GitHub 用户名。

## 后续机器人接入预留

本阶段不接入 AstrBot、QQ 群机器人或自动 RAG。未来可以让 AstrBot 定时 `git pull` 本仓库，扫描 `content/` 下的 Markdown，并建立知识库索引，用于 QQ 群问答。
