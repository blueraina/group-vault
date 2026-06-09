---
title: Jordan-Hölder 定理及其模论版本
created: 2026-06-09
updated: 2026-06-09
tags:
  - 数学
  - 抽象代数
status: stable
authors:
  - VesperaZephyr
owner: VesperaZephyr
---
这一定理在Dummit上留作习题了，我们根据Rotman的Advanced Modern Algebra整理了一个证明，并给出其模论版本。

## 预备知识

群的同构定理，基本的模论知识。

# Jordan-Hölder 定理的群论版本

先介绍相关定义。

> **定义.** 群 $G$ 中的子群序列 
> $$G=G_0\geq G_1\geq G_2\geq \cdots\geq G_{k-1}\geq G_k=\{1\},\tag1$$
> - 若满足 $G_{i+1} \unlhd G_{i} \ (i = 0, \cdots, k-1)$，则称为**正规序列**，$G_{i}/G_{i+1}$ 为此序列的**因子**。
> - 如果 $G$ 的正规序列的因子 $G_i/G_{i+1}$ 都是单群，则称该正规序列为 $G$ 的**合成序列**（composition series），称 $G_{i}/G_{i+1}$ 为 $G$ 的**合成因子**（composition factor）。
> - 群 $G$ 中的正规序列 
> $$G=G_0'\geq G_1'\geq G_2'\geq \cdots\geq G_{l-1}'\geq G_l=\{1\},\tag2$$
> 称为序列$(1)$的**加细**，如果序列$(1)$中的每个子群 $G_i$ 都在序列$(2)$中出现。
> - 群 $G$ 的两个正规序列称为**等价的**，如果这两个序列的因子集之间有一一对应，且对应的因子同构。

> **例.** 群 $\mathbb{Z}$ 没有合成序列。

**证明.** 设 $\mathbb{Z}$ 有合成列 $\mathbb{Z} = G_0 > G_1 > G_2 > \cdots > G_n = \{0\}.$ 注意 $\mathbb{Z}$ 的子群均形如 $n\mathbb{Z}$，因此设 $G_{n-1} = k\mathbb{Z}$，则 $G_{n-1}/G_n\cong k\mathbb{Z}\cong \mathbb{Z}$，这说明 $G_{n-1}/G_n$ 不是单群，矛盾。 $\square$

> **命题.** 每个有限群 $G$ 都有一个合成列。

**证明.** 对群 $G$ 的阶数归纳。

- 当 $|G|=1$，显然成立；
- 假设命题对 $|G|\lt n$（$n\geq 2$）的群 $G$ 成立，当 $|G|=n$ 时，分为两种情况：
    - 若 $G$ 是单群，则有显然的合成序列 $\{1\}=G_0\leq G_1=G$。
    - 若 $G$ 不是单群，考虑 $G$ 的极大正规子群 $M$，则有 $\{1\}=G_0\leq M\leq G_1$，显然这是合成序列，注意 $|M|\lt n$，从而由归纳假设，$M$ 拥有合成列。设其合成列为 $\{1\}=M_0\leq M_1\leq\cdots\leq M_k=M$，从而有 $G$ 的子群序列 $\{1\}=G_0\leq M_1\leq\cdots\leq M_k=M\leq G$，容易验证这是合成序列，于是由归纳假设，命题得证。 $\square$

> **定理1（Jordan-Hölder 定理）.** 设群 $G$ 存在合成序列，则 $G$ 的任意两个合成序列等价。

**证明.** 我们直接证明更强的 **Schreier 加细定理**。由 Schreier 加细定理，任一合成列都与其加细列等价，而其两个加细列等价，故定理内容成立。 $\square$

## Zassenhaus 引理或蝴蝶引理

Schreier 加细定理需要用到 Zassenhaus 引理。

> **引理（Zassenhaus 引理或蝴蝶引理）.** 给定群 $G$ 的四个子群 $A \unlhd A^*$ 和 $B \unlhd B^*$，则 $A(A^* \cap B) \unlhd A(A^* \cap B^*)$，$B(B^* \cap A) \unlhd B(B^* \cap A^*)$，并且存在同构
> $$\frac{A(A^\ast \cap B^\ast)}{A(A^\ast \cap B)} \cong \frac{B(B^\ast \cap A^\ast)}{B(B^\ast \cap A)}.$$

该引理的名称来自下面的一个示意图，虽然我并不认为这很像蝴蝶，也并不能帮助理解证明：

```tikz
\usepackage{tikz}
\begin{document}
\begin{tikzpicture}[
    every node/.style={inner sep=2pt, anchor=center, font=\small},
    line/.style={draw}
]

\node (m11) at (-4.2, 0) {$A(A^*\cap B^*)$};
\node (m13) at (4.2, 0) {$B(A^*\cap B^*)$};

\node (m21) at (-4.2, -1.4) {$A(A^*\cap B)$};
\node (m22) at (0, -1.4) {$A^*\cap B^*$};
\node (m23) at (4.2, -1.4) {$B(A\cap B^*)$};

\node (m31) at (-4.2, -2.8) {$A$};
\node (m32) at (0, -2.8) {$D=(A^*\cap B)(A\cap B^*)$};
\node (m33) at (4.2, -2.8) {$B$};

\node (m41) at (-4.2, -4.2) {$A\cap B^*$};
\node (m43) at (4.2, -4.2) {$A^*\cap B$};

% row 1 to row 2
\draw[line] (m11) -- (m21);
\draw[line] (m11) -- (m22);
\draw[line] (m13) -- (m23);
\draw[line] (m13) -- (m22);

% row 2 to row 3
\draw[line] (m21) -- (m31);
\draw[line] (m21) -- (m32);
\draw[line] (m22) -- (m32);
\draw[line] (m23) -- (m33);
\draw[line] (m23) -- (m32);

% row 3 to row 4
\draw[line] (m31) -- (m41);
\draw[line] (m33) -- (m43);
\draw[line] (m41) -- (m32);
\draw[line] (m43) -- (m32);
\end{tikzpicture}
\end{document}
```

**证明.** 我们断言：
$$(A\cap B^*)\unlhd (A^*\cap B^*).$$
事实上，任取 $c \in A \cap B^*$，$x \in A^* \cap B^*$，由 $A\unlhd A^*$，$c,x\in B^*$ 易知 $xcx^{-1}\in A\cap B^*$。类似地，$(A^* \cap B) \unlhd (A^* \cap B^*)$。因此，
$$D :=(A \cap B^*)(A^* \cap B)$$
是 $A^* \cap B^*$ 的一个正规子群。

注意到对称性，所以只需证明存在同构：
$$\frac{A(A^\ast \cap B^\ast)}{A(A^\ast \cap B)} \cong \frac{A^\ast \cap B^\ast}{D}.\tag3$$
定义 $\varphi : A(A^\ast \cap B^\ast) \rightarrow (A^\ast \cap B^\ast)/D$，$ax\mapsto xD$，其中 $a\in A$，$x \in A^* \cap B^*$。

- **良定义：** 如果 $ax = a'x'$，其中 $a' \in A$ 且 $x' \in A^* \cap B^*$，则 $(a')^{-1}a = x'x^{-1} \in A \cap (A^\ast \cap B^\ast) = A \cap B^* \leq D$。
- **同态：** $axa'x' = a''xx'$，其中 $a'' = a(xa'x^{-1}) \in A$（因为 $A \unlhd A^*$），所以 $\varphi(axa'x') = \varphi(a''xx') = xx'D = \varphi(ax)\varphi(a'x')$。
- 易验证 $\varphi$ 是满射且 $\ker \varphi = A(A^* \cap B)$。

于是由群的第一同构定理，$(3)$ 成立，证毕。 $\square$

## Schreier 加细定理

> **定理2.** 群 $G$ 的任意两个正规列
> $$ G = G_0 \geq G_1 \geq \cdots \geq G_n = \{1\}$$
> 和
> $$ G = N_0 \geq N_1 \geq \cdots \geq N_k = \{1\}$$
> 的两个加细是等价的。

**证明.** 我们在第一列中每对相邻项之间插入第二列的副本。对于每个 $i \geq 0$，定义
$$ G_{ij} := G_{i+1}(G_i \cap N_j),$$
注意 $G_{i+1} \unlhd G_i$，因此 $G_{ij}\leq G$。我们有
$$\begin{gather*}
G_{i0} = G_{i+1}(G_i \cap N_0) = G_{i+1}G_i = G_i,\\[5pt]
G_{ik} = G_{i+1}(G_i \cap N_k) = G_{i+1},
\end{gather*}$$
故 $G_{ij}$ 序列是 $G_i$ 序列的一个子序列：
$$ \cdots \geq G_i = G_{i0} \geq G_{i1} \geq G_{i2} \geq \cdots \geq G_{ik} = G_{i+1} \geq \cdots. $$
同理，若定义 $N_{pq}:= N_{p+1}(N_p \cap G_q)$，得到 $N_i$ 序列的子序列，且两个子序列都有 $nk$ 项。对于每个 $i, j$，注意 $G_{i+1} \unlhd G_i$，$N_{j+1} \unlhd N_j$，于是由 **Zassenhaus 引理**，
$$G_{i,j+1}\unlhd G_{i,j},\quad N_{j,i+1}\unlhd N_{j,i},$$
故表明两个子序列是正规列，从而使原两个正规列的加细。由 Zassenhaus 引理知存在同构
$$ \frac{G_{i+1}(G_i \cap N_j)}{G_{i+1}(G_i \cap N_{j+1})} \cong \frac{N_{j+1}(N_j \cap G_i)}{N_{j+1}(N_j \cap G_{i+1})},$$
即
$$ G_{i,j}/G_{i,j+1} \cong N_{j,i}/N_{j,i+1}. $$
于是 $G_{i,j}/G_{i,j+1} \mapsto N_{j,i}/N_{j,i+1}$ 给出了一个双射，因此加细是等价的。 $\square$

---

Jordan-Hölder 定理的模论版本和群论版本证明思路基本一致，所以下面的就当是水字数了（笑）。

# Jordan-Hölder 定理的模论版本

先说明术语问题，这是容易的。群的正规序列对应子模序列，单群对应**不可约模**，其余术语类似定义。

> **定义.** 设 $R$ 是含幺环。称 $R$-模 $M$ 为**不可约的**（irreducible），如果 $M \neq 0$ 且 $0$ 和 $M$ 是 $M$ 仅有的子模。

> **定理3（Jordan-Hölder 定理的模论版本）.** 设 $R$ 是环，$M$ 是 $R$-模。若模 $M$ 存在合成序列，则 $M$ 的任意两个合成序列是等价的。即如果
> $$ M = M_0 \supseteq M_1 \supseteq \cdots \supseteq M_n = \{0\},\quad M = N_0 \supseteq N_1 \supseteq \cdots \supseteq N_k = \{0\}\tag4$$
> 是两个合成序列，则 $n=k$，且存在 $\{0, \cdots, n-1\}$ 的一个置换 $\sigma$，使得 $M_i/M_{i+1} \cong N_{\sigma(i)}/N_{\sigma(i)+1}$。

我们的证明思路就是证明模中的 Zassenhaus 引理，由此证明模中的 Schreier 加细定理，由此证明模的 Jordan-Hölder 定理。

**证明.**

**Step 1** 证明模中的 Zassenhaus 引理。我们证明如下结果：

> 设 $M$ 是一个模。给定 $M$ 的四个子模 $A, A^*, B, B^*$，满足 $A$ 是 $A^*$ 的子模，$B$ 是 $B^*$ 的子模。则 $A + (A^* \cap B)$ 是 $A + (A^* \cap B^*)$ 的子模，$B + (B^* \cap A)$ 是 $B + (B^* \cap A^*)$ 的子模，且有同构
> $$\frac{A + (A^\ast \cap B^\ast)}{A + (A^\ast \cap B)} \cong \frac{B + (B^\ast \cap A^\ast)}{B + (B^\ast \cap A)}.\tag5$$

由对称性，只需证明
$$\frac{A + (A^\ast \cap B^\ast)}{A + (A^\ast \cap B)} \cong \frac{A^\ast \cap B^\ast}{(A^\ast \cap B) + (A \cap B^\ast)}.$$
简记 $D:= \frac{A^* \cap B^*}{(A^* \cap B) + (A \cap B^*)}$。定义映射
$$\varphi: A + (A^\ast \cap B^\ast) \longrightarrow \frac{A^\ast \cap B^\ast}{(A^\ast \cap B) + (A \cap B^\ast)},\quad \varphi(a+z) := z + D\quad (z\in A^* \cap B^*).$$

- **良定义性.** 设 $x$ 有两种表示方式：$x = a_1 + z_1 = a_2 + z_2$，其中 $a_1, a_2 \in A$，$z_1, z_2 \in A^* \cap B^*$。则 $a_1-a_2=z_2-z_1$，其中 $a_1-a_2\in A$，$z_2-z_1\in A^\ast\cap B^\ast$，从而 $z_2-z_1\in A\cap (A^\ast \cap B^\ast)=A\cap B^*\subseteq (A^\ast \cap B) + (A \cap B^\ast) = D$，于是 $z_1+D = z_2+D$，因此 $\varphi$ 是良定义的。
- 显然这是满同态，其核为 $\ker \varphi = A + (A^* \cap B)$。

于是由模的第一同构定理知
$$\frac{A^\ast \cap B^\ast}{(A^\ast \cap B) + (A \cap B^\ast)} \cong \frac{A + (A^\ast \cap B^\ast)}{A + (A^\ast \cap B)},$$
第一步得证。

**Step 2.** 证明模中的 Schreier 加细定理。

> 设模 $M$ 有两个正规序列（即子模序列）：
> $$\begin{align} M = M_0 \supseteq M_1 \supseteq \cdots \supseteq M_n = \{0\},\tag6\\[5pt] M = N_0 \supseteq N_1 \supseteq \cdots \supseteq N_k = \{0\}.\tag7 \end{align}$$
> 则这两个序列拥有等价的加细。

我们在序列 $(6)$ 的每一项 $M_i$ 和 $M_{i+1}$ 之间插入由序列 $(7)$ 定义的项。定义：
$$ M_{i,j} := M_{i+1} + (M_i \cap N_j), \quad (0 \leq i \leq n-1,\ 0 \leq j \leq k).$$
注意当 $j=0$ 时，$M_{i,0} = M_{i+1} + (M_i \cap M) = M_{i+1} + M_i = M_i$；当 $j=k$ 时，$M_{i,k} = M_{i+1} + (M_i \cap \{0\}) = M_{i+1}$。所以序列 $M_{i,0} \supseteq M_{i,1} \supseteq \cdots \supseteq M_{i,k}$ 构成了从 $M_i$ 到 $M_{i+1}$ 的加细。连接所有 $i$ 的这些片段，我们得到序列 $(6)$ 的一个加细，其因子为：
$$ \frac{M_{i,j}}{M_{i,j+1}} = \frac{M_{i+1} + (M_i \cap N_j)}{M_{i+1} + (M_i \cap N_{j+1})}.$$

对称地，我们在序列 $(7)$ 的 $N_j$ 和 $N_{j+1}$ 之间插入由序列 $(6)$ 定义的项：
$$ N_{j,i} := N_{j+1} + (N_j \cap M_i), \quad (0 \leq j \leq k-1,\ 0 \leq i \leq n)$$
这构成了序列 $(7)$ 的加细，其因子为：
$$ \frac{N_{j,i}}{N_{j,i+1}} = \frac{N_{j+1} + (N_j \cap M_i)}{N_{j+1} + (N_j \cap M_{i+1})}.$$
在 $(5)$ 中取 $A = M_{i+1}$，$A^* = M_i$ 且 $B = N_{j+1}$，$B^* = N_j$，则有同构
$$ \frac{M_{i+1} + (M_i \cap N_j)}{M_{i+1} + (M_i \cap N_{j+1})} \cong \frac{N_{j+1} + (N_j \cap M_i)}{N_{j+1} + (N_j \cap M_{i+1})},$$
即
$$ \frac{M_{i,j}}{M_{i,j+1}} \cong \frac{N_{j,i}}{N_{j,i+1}},$$
这表明两个加细序列的因子集在双射 $(i,j) \leftrightarrow (j,i)$ 下是同构的。

**Step 3.** 导出模的 Jordan-Hölder 定理。现在由加细定理，$M$ 的任意两个正规序列 $(4)$ 拥有等价的加细，而对于合成序列而言，由于其因子已是不可约模（无非平凡子模），任何加细操作仅能插入平凡项，导致加细后的非零因子集仍与原序列的因子集完全一致，因此原正规序列等价。 $\blacksquare$
