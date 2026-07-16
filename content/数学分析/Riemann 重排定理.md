---
noteId: Riemann 重排定理
shortId: 2005
title: Riemann 重排定理
created: 2026-07-16
updated: 2026-07-16
tags:
  - 数学
  - 级数
status: stable
authors:
  - blueraina
owner: blueraina
---

> 对于级数的重排问题，在[[正项级数重排和加括号问题]]中，有如下结论: **收敛的正项级数和绝对收敛级数**的重排不影响收敛性，并且与原来的级数极限值相同
> 对于一般级数，条件收敛级数，通项中有正有负，对于此类重排后的级数有如下定理


> [! ] Riemann 重排定理
> $S_n = \sum\limits_{n = 1}^{\infty} a_n$ 条件收敛，对于任意的 $-\infty \le \alpha < \beta \le +\infty$，总存在级数的重排 $S_n' = \sum\limits_{n = 1}^{\infty} a_n'$，使得
> $$\overline{\lim_{n \to \infty}} S_n' = \beta \quad \underline{\lim}\limits_{n \to \infty} S_n' = \alpha$$

>证明的思路来源于条件收敛级数的特性:
>既然通项中既有正数也有负数，那就将正项和负项拿出来分成两组，比如，一开始令某个重排 $S_n' > \beta$，由于有着 $\alpha <\beta$ 的约束，因此如果 $S_n'$ 比 $\beta$ 大，加负项来调小，如果比 $\alpha$ 小，再加正项来调大

将原数列 $\{a_n\}$ 分离为非负项子序列 $\{p_n\}$ 和负项子序列 $\{q_n\}$，选取两个实数数列 $\{x_k\}$ 和 $\{y_k\}$，使得当 $k \to \infty$ 时，$x_k \to \beta$ 且 $y_k \to \alpha$。为了方便，我们要求 $y_k \le x_k$。(如果 $\beta = +\infty$，则取 $x_k \to +\infty$ 即可，$\alpha$ 同理)

**step1:** 向上逼近 $x_1$
从正项序列 $\{p_n\}$ 中取出最前面的 $m_1$ 项，刚好使得其和首次严格大于 $x_1$。
$$S_{m_1} = p_1 + p_2 + \dots + p_{m_1} > x_1$$
因为 $\sum p_n = +\infty$，这一步必定能完成。注意这是“首次”越界，说明在加 $p_{m_1}$ 之前和是 $\le x_1$ 的，因此误差 $\vert{}S_{m_1} - x_1\vert{} \le p_{m_1}$

**step2:** 向下逼近 $y_1$
接着第一步的部分和，从负项序列 $\{q_n\}$ 中取出最前面的 $k_1$ 项，刚好使得加上它们后的和首次严格小于 $y_1$。
$$S_{m_1 + k_1} = S_{m_1} + q_1 + q_2 + \dots + q_{k_1} < y_1$$
同样由于 $\sum q_n = -\infty$，这必定能完成。此时的误差 $\vert{}S_{m_1+k_1} - y_1\vert{} \le \vert{}q_{k_1}\vert{}$

现在重复上面的过程，由于我们在不断消耗 $\{p_n\}$ 和 $\{q_n\}$ 中的项，原级数的所有项都会被包含在这个新的重排级数 $\sum a'_n$ 中，在这个序列的部分和中，局部最高点（上极限）总是接近于 $x_k$。由于当 $k \to \infty$ 时，多出来的最后一项 $p_{m_k} \to 0$ 且 $x_k \to \beta$，因此上极限 $\limsup_{n \to \infty} S'_n = \beta$
同理，局部最低点（下极限）总是接近于 $y_k$。由于 $q_{k_i} \to 0$ 且 $y_k \to \alpha$，下极限 $\liminf_{n \to \infty} S'_n = \alpha$
于是我们就完成了证明