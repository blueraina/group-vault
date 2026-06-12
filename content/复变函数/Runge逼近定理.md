---
title: Runge逼近定理
created: 2026-06-13
updated: 2026-06-13
tags:
  - 复分析
  - 泛函分析
status: stable
authors:
  - VesperaZephyr
owner: VesperaZephyr
---

我们知道著名的 Weierstrass（第一）逼近定理（1885）：

> **Weierstrass 第一逼近定理.**  
> 设 $f$ 是闭区间 $[a,b]$ 上的连续实值函数, 则对任意 $\varepsilon>0$, 存在多项式 $P(x)$, 使得  
> $$\sup_{x\in[a,b]}|f(x)-P(x)|<\varepsilon.$$  
> 也就是说, 闭区间上的连续函数可以被多项式一致逼近. 

我们自然要问, 这对全纯函数正确吗？也就是考虑

> **断言.** 设 $f$ 在紧集 $K\subseteq \mathbb{C}$ 上全纯（即在 $K$ 的开邻域上全纯）, 是否存在复多项式 $P(z)$ 一致逼近全纯函数？

的正确性. 事实上, 这是错误的. 考察 $f(z):=1/z$ 在 $K=B(0,1)$. 则 $f$ 在 $K$ 的开邻域全纯（例如圆环 $\frac{1}{2}<|z|<\frac{3}{2}$ 内全纯）, 却不存在任何多项式序列能在 $K$ 上一致逼近 $f$. 

> 若其不然, 设多项式序列 $\{P_n(z)\}$ 使得 $\max_{|z|=1} |P_n(z) - f(z)| \to 0 \ (n\to\infty)$. 但
> $$2\pi \mathrm{i}=\oint_{|z|=1} f(z)\,\mathrm{d}z = \lim_{n\to\infty} \oint_{|z|=1} P_n(z)\,\mathrm{d}z = 0,$$
> 矛盾. 

究其原因, 还是因为拓扑的障碍. 单位圆周的补集有两个连通分支（单位圆内部和外部）, 连通性被破坏, 多项式逼近失效. 

同一年, **Runge 逼近定理**指出, 在一定条件下, 刚性很强的全纯函数可以被有理函数一致逼近, 甚至可以选为多项式. 

> **定理 0 (Runge 逼近定理).** 设 $K$ 为 $\mathbb{C}$ 中的紧子集, $E$ 为 $\mathbb{C}_\infty \setminus K$ 的一个子集, 且与 $\mathbb{C}_\infty \setminus K$ 的每个连通分支相交. 若 $f$ 在 $K$ 的邻域内解析, 则存在仅以 $E$ 中的点为极点的有理函数序列 $\{f_n\}$, 使得 $f_n$ 在 $K$ 上一致收敛于 $f$. 

Runge 逼近定理的证明较为复杂, 笔者目前见过三种：

1. 来自 Stein, 也是较为古典的证明方法, 比较复杂；
2. 来自 Conway GTM11 (1978), 实际选自美国数学月刊：*A Short Proof of Runge's Theorem*, Sandy Grabiner, The American Mathematical Monthly, Vol. 83, No. 10 (Dec., 1976), pp. 807-808 (2 pages), https://doi.org/10.2307/2318689. 说是比较 short, 实际上省略了很多细节, Conway 详细补全了这些细节, 但是仍然比较 dirty；
3. 来自 Conway GTM96 (1990), 也见于 Rudin 的 Real Analysis and Complex Analysis, 采用了一些高级的实分析结果以及泛函分析, 较为优美, 这是本篇文章所记录的. 

# 基于 Hahn-Banach 定理和 Riesz 表示定理的证明

以下内容整理自 Conway, 虽然不如 Rudin 的证明简洁, 但是细节上更加完善. 

> **定理 1 (Hahn-Banach 定理的重要推论).** 设 $\mathcal{X}$ 是赋范向量空间, $\mathcal{M}$ 是 $\mathcal{X}$ 的线性子空间. 则
> $$\overline{\mathcal{M}} = \bigcap_{f \in \mathcal{X}^*,\ f|_{\mathcal{M}} = 0} \ker f= \bigcap_{f\in M^\perp}\ker(f)= \{x\in\mathcal{X} : f(x) = 0,\ \forall f \in M^\perp\},$$
> 其中 $M^\perp=\{f\in\mathcal{X}^* : f|_{\mathcal{M}}=0\}$ 称为 $\mathcal{M}$ 的**零化子** (annihilator). 

定义空间
$$
R(K, E) := \operatorname{span}\left\{ \frac{1}{(z - \alpha)^n} : \alpha \in E,\ n \geq 1 \right\},
$$
即极点在 $E$ 中的有理函数, 再记 $\overline{\mathcal{M}}:=\overline{R(K,E)}^{C(K)}$, 即 $R(K,E)$ 在 $C(K)$ 中的闭包, 则根据 **Hahn-Banach 定理推论**, 设 $f$ 在 $K$ 开邻域内全纯, 只需证

> **Claim 1.** 对任意有界线性泛函 $\varLambda:C(K)\to \mathbb{C}$, 且对任意 $R\in \overline{\mathcal{M}}$, $\varLambda(R)=0$, 则 $\varLambda(f)=0$. 

而我们有复 Borel 测度与有界线性泛函的 **Riesz 表示定理**：

> **定理 (Riesz 表示定理).** 若 $X$ 是局部紧 Hausdorff 空间, 则定义在 $C_0(X)$ 上的**每一个有界线性泛函** $\varLambda$ 都可由**唯一的正则复 Borel 测度** $\mu$ 表示, 即对任意 $f \in C_0(X)$, 有
> $$\varLambda(f) = \int_X f \, \mathrm d\mu. $$

**证明.** 见 big Rudin, Theorem 6.19. $\square$

利用强大的 Riesz 表示定理, 我们将 Claim 1 化归为下面的待证命题：

> **Claim 2.** 若 $K$ 上的正则复 Borel 测度满足 $\int_K r \, \mathrm{d}\mu = 0$ 对所有 $r \in R(K,E)$ 成立, 则必有 $\int_K f \, \mathrm{d}\mu = 0$. 

因此, 我们的目标是：**从“$\mu$ 与所有允许有理函数正交”推出“$\mu$ 与 $f$ 正交”**. 

---

## 第一步：定义 Cauchy 型积分 $\hat{\mu}(w)$

对任意正则复 Borel 测度 $\mu$, 定义其 **Cauchy 型积分**为：

$$
\hat{\mu}(w) := \int_K \frac{\mathrm{d}\mu(z)}{z - w}, \qquad w \in \mathbb{C}_\infty \setminus K.
$$

> **命题 2 ($\hat{\mu}$ 的性质).**  
> 若 $\mu$ 是正则复 Borel 测度, 则：
> 1. $\hat{\mu} \in L^1_{\text{loc}}(\mathbb{C},\lambda)$, 其中 $\lambda$ 是平面上的 Lebesgue 测度；
> 2. $\hat{\mu}$ 在 $\mathbb{C}_\infty \setminus K$ 上解析；
> 3. $\hat{\mu}(\infty) = 0$. 

**证明.**

- **局部可积性**：  
  对任意 $R > 0$, 取 $\rho > 0$ 使得 $D(0; R) \subseteq D(z; \rho)$ 对所有 $z \in K$ 成立. 则：
  $$
  \begin{aligned}
  \int_{D(0;R)} |\hat{\mu}(w)| \, \mathrm{d}\lambda(w)
  &= \int_{D(0;R)} \int_K \frac{\mathrm{d}|\mu|(z)}{|z - w|} \, \mathrm{d}\lambda(w) \\
  &= \int_K \int_{B(0;R)} \frac{\mathrm{d}\lambda(w)}{|z - w|} \, \mathrm{d}|\mu|(z) \\
  &\leq \int_K 2\pi\rho \, \mathrm{d}|\mu|(z) = 2\pi\rho \|\mu\|.
  \end{aligned}
  $$
  故 $\hat{\mu} < \infty$ $\lambda$-a.e., 且局部可积. 

- **解析性**：  
  对 $w_0 \in \mathbb{C} \setminus K$, 计算差商：
  $$
  \frac{\hat{\mu}(w) - \hat{\mu}(w_0)}{w - w_0} = \int_K \frac{\mathrm{d}\mu(z)}{(z - w)(z - w_0)}.
  $$
  当 $w \to w_0$, 被积函数一致收敛到 $(z - w_0)^{-2}$, 故导数存在：
  $$
  \hat{\mu}'(w_0) = \int_K \frac{\mathrm{d}\mu(z)}{(z - w_0)^2}. \tag{*}
  $$
  同样的方法可以推得对 $w_0 \in \mathbb{C} \setminus K$, 有：
  $$
  \left( \frac{\mathrm{d}}{\mathrm{d}w} \right)^n \hat{\mu}(w_0) = n! \int_K \frac{\mathrm{d}\mu(z)}{(z - w_0)^{n+1}}.
  $$
  所以 $\hat{\mu}$ 在 $\mathbb{C} \setminus K$ 上解析. 

- **无穷远处行为**：  
  当 $|w| \to \infty$, 有 $\hat{\mu}(w) \sim \frac{1}{w} \int_K \mathrm{d}\mu(z) \to 0$, 故 $\infty$ 是可去奇点, $\hat{\mu}$ 在 $\mathbb{C}_\infty \setminus K$ 上解析. 事实上, 当 $|w| > \max_{z \in K} |z|$, 有
  $$
  \hat{\mu}(w) = \int_K \frac{\mathrm{d}\mu(z)}{z - w} = -\frac{1}{w} \int_K \left(1 - \frac{z}{w}\right)^{-1} \mathrm{d}\mu(z)
  = -\sum_{n=0}^\infty \frac{a_n}{w^{n+1}},
  $$
  其中 $a_n := \int_K z^n \, \mathrm{d}\mu(z)$. 

---

## 第二步：利用正交条件推出 $\hat{\mu} \equiv 0$

设 $\mu$ 是正则复 Borel 测度, 且
$$
\int_K r \,\mathrm{d}\mu = 0,\quad r\in R(K,E).
$$

设 $U$ 是 $\mathbb{C}_\infty \setminus K$ 的一个连通分支, $w_0 \in E \cap U$. 

### ➤ 情况一：$w_0 \neq \infty$

考虑函数 $g_n(z) = \dfrac{1}{(z - w_0)^{n+1}} \in R(K,E)$, 由假设, 
$$
\int_K g_n(z) \, \mathrm{d}\mu(z) = 0.
$$
由 $(*)$ 知
$$
\hat{\mu}^{(n)}(w_0) = n! \int_K \frac{\mathrm{d}\mu(z)}{(z - w_0)^{n+1}} = 0.
$$
所以 $\hat{\mu}$ 在 $w_0$ 处所有导数为零, 故 $\hat{\mu}|_U \equiv 0$. 

### ➤ 情况二：$w_0 = \infty$

此时考虑多项式 $g_n(z) = z^n$, 它们是极点仅在 $\infty$ 的有理函数, 由假设知
$$
a_n = \int_K z^n \, \mathrm{d}\mu(z) = 0.
$$
由 $(*)$ 知
$$
\hat{\mu}(w) = -\sum_{n=0}^\infty \frac{a_n}{w^{n+1}} = 0.
$$
故 $\hat{\mu} \equiv 0$ 在包含 $\infty$ 的分支 $U$ 上. 

因此, $\hat{\mu}(w) = 0$ 对所有 $w \in \mathbb{C}_\infty \setminus K$ 成立. 

---

## 第三步：回到原问题, 证明 $\int_K f \, \mathrm{d}\mu = 0$

我们还需要一个某种意义上 Cauchy 积分定理的反向命题：

> **命题 3.** 设 $K$ 为区域 $G$ 中的紧致子集, 则存在直线段 $\gamma_1, \dots, \gamma_n$ 位于 $G-K$ 中, 使得对于 $H(G)$（即在 $G$ 内全纯的函数）中的每一个函数 $f$, 都有
> $$f(z) = \sum_{k=1}^n \frac{1}{2\pi \mathrm{i}} \int_{\gamma_k} \frac{f(w)}{w-z} \mathrm{d}w$$
> 对所有 $z \in K$ 成立, 这些直线段构成有限个闭合多边形. 

**证明.** 见 GTM 11 (Conway 1978), Proposition 8.1.1.  $\square$

已知 $f \in H(G)$, $G \supseteq K$ 为开集. 由前述**命题**, 存在有限条直线段 $\gamma_1, \dots, \gamma_n \subset G \setminus K$, 使得对任意 $z \in K$：
$$
f(z) = \sum_{k=1}^n \frac{1}{2\pi \mathrm{i}} \int_{\gamma_k} \frac{f(w)}{w - z} \, \mathrm{d}w.
$$

于是由 Fubini 定理交换积分次序：
$$
\begin{aligned}
\int_K f(z) \, \mathrm{d}\mu(z)
&= \sum_{k=1}^n \frac{1}{2\pi \mathrm{i}} \int_K \left[ \int_{\gamma_k} \frac{f(w)}{w - z} \, \mathrm{d}w \right] \mathrm{d}\mu(z) \\
&= \sum_{k=1}^n \frac{1}{2\pi \mathrm{i}} \int_{\gamma_k} f(w) \left[ \int_K \frac{\mathrm{d}\mu(z)}{w - z} \right] \mathrm{d}w \\
&= \sum_{k=1}^n \frac{1}{2\pi \mathrm{i}} \int_{\gamma_k} f(w) \cdot \hat{\mu}(w) \, \mathrm{d}w.
\end{aligned}
$$

但前面已证 $\hat{\mu}(w) = 0$ 对所有 $w \in \mathbb{C}_\infty \setminus K$ 成立, 而 $\gamma_k \subseteq G \setminus K \subseteq \mathbb{C}_\infty \setminus K$, 故 $\hat{\mu}(w) = 0$ 在每条 $\gamma_k$ 上成立！因此
$$
\int_K f \, \mathrm{d}\mu = 0,
$$
证毕.  $\square$

# Runge 逼近定理的一些推论

首先, 我们可以将紧集上的 Runge 定理推广到开集上：

> **推论 4.** 设 $G$ 为复平面上的开集, $E$ 为 $\mathbb{C}_\infty \setminus G$ 的子集, 且 $E$ 与 $\mathbb{C}_\infty \setminus G$ 的每个连通分支都相交. 记 $R(G,E)$ 为所有极点位于 $E$ 中的有理函数构成的集合, 将其视为 $H(G)$ 的子空间. 若 $f \in H(G)$, 则存在序列 $\{R_n\} \subseteq R(G,E)$, 使得在 $H(G)$ 中 $f = \lim\limits_{n\to\infty} R_n$, 即 $R(G,E)$ 在 $H(G)$ 中稠密. 

**证明.** 任取紧集 $K \subseteq G$ 与 $\varepsilon>0$, 需证明存在 $R \in R(G,E)$, 使得对所有 $z \in K$, 有
$$
|f(z)-R(z)|<\varepsilon.
$$
由 $\mathbb{C}$ 中开集的 $\sigma$-紧性, 存在紧集 $K_1$ 满足 $K \subseteq K_1 \subseteq G$, 且 $\mathbb{C}_\infty \setminus K_1$ 的每个连通分支都包含 $\mathbb{C}_\infty \setminus G$ 的一个连通分支. 因此 $E$ 与 $\mathbb{C}_\infty \setminus K_1$ 的每个连通分支都相交. 由 Runge 定理, 结论得证.  $\square$

> **注记 1.** 推论 4 的条件可稍作加强, 只需 $E$ 的闭包 $\overline{E}$ 与 $\mathbb{C}_\infty \setminus G$ 的每个连通分支相交即可, 不过证明略有麻烦, 我们简述思路：取一列紧集 $\{K_n\}_{n\geq 1}\subseteq G$ 满足 $K_n\subseteq \operatorname{Int} K_{n+1}$, $\bigcup_{n\geq 1}K_n=G$, $\mathbb{C}_\infty\setminus K_n$ 的每个连通分支都与 $\mathbb{C}\setminus G$ 的某个连通分支相交. 事实上, 取
> $$K_n:=\left\{z\in G:|z|\leq n,\ d(z,\mathbb{C}_\infty\setminus G)\ge \frac1n\right\}.$$
> 此时可验证 $\overline{E}$ 与 $\mathbb{C}_\infty\setminus K_n$ 的每个连通分支相交. 最后使用 Runge 定理. 

> **注记 2.** “$\overline{E}$ 与 $\mathbb{C}_\infty \setminus G$ 的每个连通分支相交”这一条件不可弱化. 

以去心平面 $G = \mathbb{C} \setminus \{0\}$ 为例, 此时 $\mathbb{C}_\infty \setminus G = \{0,\infty\}$. 假设该情形下可将 Runge 定理的条件弱化为 $E=\{\infty\}$, 则对任意 $n\ge1$, 存在多项式 $p_n(z)$, 使得
$$
\left| \frac{1}{z} - p_n(z) \right| < \frac{1}{n}
$$
对所有满足 $\frac{1}{n} \le |z| \le n$ 的 $z$ 成立. 此时有
$$
|1 - z p_n(z)| \le \frac{|z|}{n} \le 1,\quad \frac{1}{n} \le |z| \le n.
$$
当 $|z|=n$ 时, 
$$
|p_n(z)| = \frac{1}{n} |z p_n(z)| \le \frac{1}{n} |z p_n(z)-1| + \frac{1}{n} \le \frac{2}{n}.
$$
由**最大模原理**, 对所有 $|z| \le n$, 有
$$
|p_n(z)| \le \frac{2}{n}.
$$
特别地, 在 $|z| \le 1$ 上 $p_n(z) \to 0$ 一致成立, 这与 $(1)$ 矛盾. 因此 $E$ 必须取为 $\{0,\infty\}$. 

---

令 $E=\{\infty\}$, 并利用“仅在 $\infty$ 处有极点的有理函数是多项式”这一事实, 可得如下推论. 

> **推论 5 (多项式一致逼近).** 设 $G$ 为 $\mathbb{C}$ 的开集, 且 $\mathbb{C}_\infty \setminus G$ 连通, 则对任意解析函数 $f \in H(G)$, 存在多项式序列 $\{p_n\}$, 使得在 $H(G)$ 中 $f = \lim p_n$. 

# 更为强大的 Mergelyan 定理

实际上, 我们还有一个更为强大的 Mergelyan 定理：

> **Mergelyan 定理.** $K$ 是 $\mathbb{C}$ 中紧集, $\mathbb{C}\setminus K$ 连通, $f$ 在 $K$ 上连续且在 $K$ 的内部全纯, 则 $f$ 可被多项式一致逼近. 

这个条件是相当弱的, 所以证明十分复杂, 可见 big Rudin, **Theorem 20.5**. 

当 $K=[a,b]$ 时, 内部为空, 条件“在内部全纯”平凡成立, 这就是 Weierstrass 定理；而当 $f$ 在 $K$ 的邻域全纯时, 就回到 Runge 定理的多项式情形. 