# 评论区与 GitHub 登录配置说明

评论区采用 Cloudflare Pages Functions + D1 数据库。评论提交、评论删除、GitHub 登录会话、做过/收藏标记都保存到 D1，不会写回 GitHub 仓库。

## Cloudflare 需要配置什么

1. 在 Cloudflare Dashboard 创建 D1 数据库，例如 `group-vault-comments`。
2. 进入 `Workers & Pages`，打开本项目 `group-vault`。
3. 进入 `Settings` -> `Functions` -> `D1 database bindings`。
4. 新增绑定：
   - Variable name: `COMMENTS_DB`
   - D1 database: 选择 `group-vault-comments`
5. 在 `Settings` -> `Environment variables` 增加：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `SESSION_SECRET`
   - `ADMIN_GITHUB_LOGINS`，例如 `blueraina`
6. 初始化或更新表结构：

```bash
npx wrangler d1 migrations apply group-vault-comments --remote
```

## GitHub OAuth App

在 GitHub OAuth App 中配置回调地址：

```text
https://group-vault.pages.dev/api/auth/github/callback
```

本项目使用的登录入口是 `/api/auth/github`，回调入口是 `/api/auth/github/callback`。

## 权限规则

- 未登录：只能看评论。
- 登录 GitHub：可以发表评论，做过/收藏标记会同步到 D1。
- 评论作者：可以删除自己的评论。
- `ADMIN_GITHUB_LOGINS` 中的管理员：可以删除任何评论。

## 评论支持什么

- 普通 Markdown：段落、加粗、斜体、链接、引用、列表、代码块。
- 数学公式：
  - 行内公式：`$a^2+b^2=c^2$`
  - 独立公式：

```markdown
$$
\int_a^b f(x)\,dx
$$
```

## 当前版本的限制

- 不支持图片上传；如果需要图片，建议先放外链，后续可以接 R2 上传。
- 管理员先通过 `ADMIN_GITHUB_LOGINS` 白名单配置，后续如有需要再接 GitHub collaborator API。
