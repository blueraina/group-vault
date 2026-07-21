---
noteId: "obsidian使用与同步教程"
shortId: 10
title: Obsidian 使用与同步教程
created: 2026-06-04
updated: 2026-06-04
tags:
  - 使用说明
  - Obsidian
  - 同步
  - 图谱隐藏
authors:
  - blueraina
status: stable
owner: blueraina
---

# Obsidian 使用与同步教程

这篇笔记给群友快速上手用：如何在 Obsidian 里写笔记、如何用 Obsidian Git 同步到 GitHub，以及常用 Markdown / Obsidian 语法怎么写。

## 一、日常更新笔记流程

推荐流程：

1. 打开 Obsidian。
2. 等 Obsidian Git 自动拉取最新内容。
3. 在 `content/` 里新建或修改正式笔记。
4. 写完后按 `Ctrl + P` 打开命令面板。
5. 搜索并执行 `Git: Commit-and-sync`。
6. 等待同步完成。
7. 等 GitHub Action 和 Cloudflare Pages 自动更新网站。

流程大致是：

```text
Obsidian 本地修改
-> Git: Commit-and-sync
-> 推送到 GitHub
-> 自动更新 content/其他信息/维护时间线.md
-> Cloudflare Pages 部署
-> 网站更新
```

## 二、Obsidian Git 推荐设置

打开：

```text
设置 -> 第三方插件 -> Obsidian Git
```

推荐设置成“自动拉取，手动提交和推送”。

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

- 会自动拉取别人更新的笔记。
- 不会自动提交你正在写的半成品。
- 你要发布时，手动执行 `Git: Commit-and-sync`。

## 三、文件应该放哪里

正式发布到网站的笔记放这里：

```text
content/
```

临时投稿、还没整理完的内容放这里：

```text
inbox/
```

笔记模板放这里：

```text
templates/
```

图片建议放这里：

```text
assets/images/
```

不要提交账号密码、GitHub token、Cloudflare token、API key、cookie、私人聊天记录原文、未授权转载的大段内容。

## 四、新笔记模板

新建正式笔记时，可以复制下面这段放在文件最开头。注意：Properties 必须在整篇笔记最顶部，前后都要有 `---`。

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

常用状态：

- `draft`：草稿，还没整理好。
- `stable`：稳定版，可以正常阅读。
- `needs-review`：需要别人检查。
- `archived`：归档，不再维护。

## 五、标题和段落

Markdown 用 `#` 表示标题层级。

```md
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

普通段落直接写文字即可。段落之间空一行。

```md
这是第一段。

这是第二段。
```

## 六、加粗、斜体、删除线和高亮

```md
**加粗**
*斜体*
~~删除线~~
==高亮==
```

显示效果：

**加粗**

*斜体*

~~删除线~~

==高亮==

## 七、列表和待办

无序列表：

```md
- 第一项
- 第二项
- 第三项
```

有序列表：

```md
1. 第一步
2. 第二步
3. 第三步
```

待办列表：

```md
- [ ] 未完成
- [x] 已完成
```

## 八、链接和双链

链接到其他笔记：

```md
[[00-首页]]
[[01-入门指南]]
```

显示成别名：

```md
[[01-入门指南|入门指南]]
```

外部链接：

```md
[Obsidian 官网](https://obsidian.md)
```

链接到某个小标题：

```md
[[01-入门指南#如何贡献]]
```

## 九、图片和附件

推荐把图片放到：

```text
assets/images/
```

插入图片：

```md
![[assets/images/example.png]]
```

也可以给图片加说明文字：

```md
![图片说明](../assets/images/example.png)
```

图片命名建议用英文、数字和短横线：

```text
obsidian-git-settings.png
cloudflare-deploy-success.png
```

## 十、引用和分割线

普通引用：

```md
> 这是一段引用。
```

多行引用：

```md
> 第一行引用。
> 第二行引用。
```

分割线：

```md
---
```

## 十一、代码

行内代码：

```md
使用 `Git: Commit-and-sync` 同步。
```

代码块：

````md
```python
print("hello")
```
````

## 十二、表格

```md
| 字段 | 说明 |
| --- | --- |
| title | 笔记标题 |
| tags | 标签 |
| status | 状态 |
| authors | 作者 |
```

显示效果：

| 字段 | 说明 |
| --- | --- |
| title | 笔记标题 |
| tags | 标签 |
| status | 状态 |
| authors | 作者 |

## 十三、数学公式

行内公式：

```md
$a^2 + b^2 = c^2$
```

块级公式：

```md
$$
\int_a^b f(x)\,dx
$$
```

注意：块级公式前后最好单独空一行。

### TikZJax 图象

网站已经支持用 TikZJax 渲染 TikZ 图象。适合画交换图、坐标轴、简单几何图、箭头关系图等数学图象。

基本写法是在笔记中使用 `tikz` 代码块：

````md
```tikz
\usepackage{tikz}
\begin{document}

\begin{tikzpicture}
  \draw[->] (0,0) -- (2,0) node[right] {$x$};
  \draw[->] (0,0) -- (0,2) node[above] {$y$};
  \draw[blue, thick] (0,0) circle (1);
\end{tikzpicture}

\end{document}
```
````

发布到网页后，上面的代码会自动渲染成 SVG 图象。

常用例子：

````md
```tikz
\usepackage{tikz}
\begin{document}

\begin{tikzpicture}
  \node (A) at (0,1) {$A$};
  \node (B) at (2,1) {$B$};
  \node (C) at (0,0) {$C$};
  \node (D) at (2,0) {$D$};
  \draw[->] (A) -- (B);
  \draw[->] (A) -- (C);
  \draw[->] (B) -- (D);
  \draw[->] (C) -- (D);
\end{tikzpicture}

\end{document}
```
````

注意事项：

- 代码块语言必须写成 `tikz`，不要写成 `tex`、`latex` 或 `tikzpicture`。
- 推荐写成完整结构：先写 `\usepackage{tikz}`，再写 `\begin{document}`，中间放 `\begin{tikzpicture}` 到 `\end{tikzpicture}`，最后写 `\end{document}`。这样更兼容 Obsidian 本地预览。
- 首次打开含 TikZ 图象的网页时，浏览器需要加载 TikZJax，可能会比普通笔记慢一点。
- 太复杂的 TikZ 包、外部图片、系统字体或依赖完整 LaTeX 编译环境的代码不一定能渲染。网页端尤其不建议使用 `decorations.pathmorphing`、`snake` 这类装饰路径；可以先用普通箭头、虚线、双线替代。
- 如果网页没有渲染，先检查代码块上下的三个反引号是否完整，以及代码块第一行是否写成 `tikz`。

## 十四、脚注

```md
这句话有一个脚注。[^1]

[^1]: 这里是脚注内容。
```

## 十五、标签

可以在正文中写标签：

```md
#数学 #教程 #待整理
```

更推荐写在 Properties 里：

```yaml
tags:
  - 数学
  - 教程
```

## 十六、Callout 提示框

Obsidian 的提示框格式是：

```md
> [!类型]
> 内容
```

### Note

```md
> [!note]
> 这是一条普通说明。
```

> [!note]
> 这是一条普通说明。

### Abstract / Summary / TLDR

```md
> [!abstract]
> 这里写摘要。
```

> [!abstract]
> 这里写摘要。

### Info

```md
> [!info]
> 这里写补充信息。
```

> [!info]
> 这里写补充信息。

### Todo

```md
> [!todo]
> 这里写待办事项。
```

> [!todo]
> 这里写待办事项。

### Tip / Hint / Important

```md
> [!tip]
> 这里写技巧。
```

> [!tip]
> 这里写技巧。

### Success / Check / Done

```md
> [!success]
> 这里写已经完成或验证通过的内容。
```

> [!success]
> 这里写已经完成或验证通过的内容。

### Question / Help / FAQ

```md
> [!question]
> 这里写常见问题。
```

> [!question]
> 这里写常见问题。

### Warning / Caution / Attention

```md
> [!warning]
> 这里写需要注意的风险。
```

> [!warning]
> 这里写需要注意的风险。

### Failure / Fail / Missing

```md
> [!failure]
> 这里写失败原因或缺失内容。
```

> [!failure]
> 这里写失败原因或缺失内容。

### Danger / Error

```md
> [!danger]
> 这里写严重错误或高风险提醒。
```

> [!danger]
> 这里写严重错误或高风险提醒。

### Bug

```md
> [!bug]
> 这里写已知问题。
```

> [!bug]
> 这里写已知问题。

### Example

```md
> [!example]
> 这里写例子。
```

> [!example]
> 这里写例子。

### Quote / Cite

```md
> [!quote]
> 这里写引用内容。
```

> [!quote]
> 这里写引用内容。

## 十七、可折叠提示框

默认折叠：

```md
> [!note]- 默认折叠
> 这里的内容默认收起。
```

默认展开：

```md
> [!note]+ 默认展开
> 这里的内容默认展开。
```

## 十八、嵌入其他笔记

嵌入整篇笔记：

```md
![[01-入门指南]]
```

嵌入某个标题下的内容：

```md
![[01-入门指南#如何贡献]]
```

## 十九、写数学笔记的小建议

- 一篇笔记只讲一个定理、题型或方法。
- 文件名尽量清楚，例如 `三对角行列式.md`。
- 公式用 `$...$` 或 `$$...$$`。
- 重要结论可以用 `[!tip]`。
- 易错点可以用 `[!warning]`。
- 例题可以用 `[!example]`。
- 还没整理好的内容先放 `inbox/`。

## 二十、同步失败怎么办

如果看到 conflict、push failed、authentication failed，不要反复点击同步。

推荐处理：

1. 截图错误提示。
2. 先不要继续修改同一个文件。
3. 联系管理员。
4. 等管理员确认后再继续同步。

常见原因：

- 你和别人同时改了同一篇笔记。
- 打开 Obsidian 后没有先拉取最新内容。
- GitHub 登录过期。
- 仓库权限还没开通。
- 分支保护设置阻止了直接推送。

## 二十一、发布前检查清单

- [ ] 笔记放在正确目录。
- [ ] Properties 在文件最开头。
- [ ] `title`、`created`、`updated`、`tags`、`status`、`authors`、`owner` 已填写。
- [ ] 没有账号、密码、token、cookie、API key。
- [ ] 没有私人聊天记录原文。
- [ ] 没有未授权转载的大段内容。
- [ ] 图片路径正常。
- [ ] 数学公式能正常显示。
- [ ] 写完后执行了 `Git: Commit-and-sync`。
