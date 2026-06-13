# 评论区配置说明

评论区采用 Cloudflare Pages Functions + D1 数据库。评论提交和读取不会触发 Cloudflare Pages 重新构建，只有网站代码或笔记内容更新才会触发 Pages 部署。

## Cloudflare 需要配置什么

1. 在 Cloudflare Dashboard 创建一个 D1 数据库，例如 `group-vault-comments`。
2. 进入 `Workers & Pages`，打开本项目 `group-vault`。
3. 进入 `Settings` -> `Functions` -> `D1 database bindings`。
4. 新增绑定：
   - Variable name: `COMMENTS_DB`
   - D1 database: 选择刚创建的 `group-vault-comments`
5. 初始化表结构。可以在 D1 控制台执行 `migrations/0001_comments.sql`，也可以用 Wrangler 执行：

```bash
npx wrangler d1 migrations apply group-vault-comments --remote
```

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

- 这是第一版轻量评论区，先使用昵称提交，不要求登录。
- 不支持图片上传；如果需要图片，建议先放外链，后续可以接 R2 上传。
- 暂无审核后台。数据库中有 `status` 字段，后续可以扩展为隐藏、审核、删除等管理功能。
