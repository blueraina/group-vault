---
noteId: Markov 链中的赌徒问题和游走问题
shortId: 1003
title: Markov 链中的赌徒问题和游走问题
created: 2026-07-16
updated: 2026-07-16
tags:
  - 数学
  - 随机过程
status: stable
authors:
  - blueraina
owner: blueraina
---

## 赌徒问题

> [!example] 问题1
> 假设有一个赌徒，在每次赌博中以概率 $p$ 赢取一个单位，以概率 $q = 1-p$ 输一个单位，并且每次赌博都是独立的，设赌徒开始时有 $i$ 个单位，财富到达 $0$ 或者 $N$ 时结束赌博，记 $P_i$ 为从初始财富 $i$ 出发，先到达 $N$ 而不是 $0$ 的概率

> 本质是有两个吸收壁的 Markov 链 

由题目可以看出 $P_0=0,P_N = 1$，由全概率公式，可以得到如下递推公式
$$
P_i = p P_{i+1} + q P_{i-1}
$$
于是
$$
p P_i + q P_i = p  P_{i+1} + q  P_{i-1}
$$
$$
P_{i+1}-P_i = \frac{q}{p}(P_i - P_{i-1})
$$
这是一个等比数列，因此
$$
P_i - P_{i-1} = \frac{q}{p}(P_{i-1} - P_{i}) = (\frac{q}{p})^{i-1}(P_1-P_0)
$$
累加得到
$$
P_i - P_1 = P_1\big[\frac{q}{p}+(\frac{q}{p})^2 + …+(\frac{q}{p})^{i-1} \big]
$$
现在需要分两种情况计算
**Case1:** $p = q$ 时
$$
P_i-P_1 = P_1(i-1)
$$
代入 $P_N = 1$ 这一条件，解得 $P_1= \frac{1}{N}$，于是
$$
P_i = \frac{i}{N}
$$
**Case2:** $p \ne q$ 时
$$
P_i - P_1 = P_1\Big(\frac{1-(\frac{q}{p})^i}{1-\frac{q}{p}}-1 \Big)
$$
代入 $P_N = 1$ 这一条件，解得
$$
P_1 = \frac{1-\frac{q}{p}}{1-(\frac{q}{p})^N}
$$
代入原式，即可得到
$$
P_i = \frac{1-(\frac{q}{p})^i}{1-(\frac{q}{p})^N}
$$

关于上面的递推公式，其实可以写成矩阵形式
$$
\begin{pmatrix} P_{i+1} \\ P_i \end{pmatrix} = \begin{pmatrix} \frac{1}{p} & -\frac{q}{p} \\ 1 & 0\end{pmatrix} \begin{pmatrix} P_i \\ P_{i-1}\end{pmatrix}
$$
然后利用[[三对角行列式#针对特征方程法中通项公式的推导]]相同的方法，只需要求出矩阵的特征值即可，比如这里的特征值是 $\frac{q}{p},1$
当 $p \ne q$ 时，$P_i = C_1 \left( \frac{q}{p} \right)^i + C_2$
当 $p = q$ 时，$P_i = (C_1 + C_2 n)1^n$
然后分别代入初值条件 $P_0=0,P_N=1$，解出 $C_1,C_2$ 就是
$$ P_i= \begin{cases} \dfrac{i}{N},&p=q=\frac12,\\[6pt] \dfrac{1-(q/p)^i}{1-(q/p)^N},&p\ne q. \end{cases}$$
---

> [!example] 问题2
> 赌徒平均多少局结束赌博？即求期望 

记 $M_i$ 为从 $i$ 到 $0$ 或者 $N$ 的平均时间，于是有 $M(0) = M(N) = 0$，由全期望公式，我们有
$$
M_i = (1+M_{i+1})p+(1+M_{i-1})q =1+pM_{i+1} + qM_{i-1}
$$
于是
$$
pM_i+qM_i = pM_{i+1} + qM_{i-1}+1
$$
继续分两种情况计算

**Case1:** $p \ne q$ 时
做变形得到
$$
M_{i+1} - M_i - \frac{1}{q-p} = \frac{q}{p}(M_i-M_{i-1} - \frac{1}{q-p})
$$
与上面的求解方式相同，累加得到:
$$
M_i - M_1 - \frac{i-1}{q-p} = (M_1 - \frac{1}{q-p})(\frac{1-(\frac{q}{p})^i}{1-\frac{q}{p}}-1 )
$$
代入 $M_N = 0$ 这一条件，得到
$$
M_1 = \frac{1}{q-p} - \frac{N}{q-p} \Big(\frac{1-\frac{q}{p}}{1-(\frac{q}{p})^N}\Big)
$$
代回原式，整理得到:
$$
M_i = \frac{i}{q-p} - \frac{N}{q-p}\cdot \frac{1-(\frac{q}{p})^i}{1-(\frac{q}{p})^N}
$$
**Case2:** $p = q$ 时，有
$$
M_{i+1} - M_i = M_i - M_{i-1} - 2
$$
因此
$$
M_2 - M_1 = M_1 - M_0 - 2  
$$
$$
M_3 - M_2 = M_2 - M_1 - 2 
$$
$$
\cdots 
$$
$$
M_i - M_{i-1} =M_{i-1} - M_{i-2} - 2
$$
累加得到:
$$
M_{i}-M_{i-1} = M_1 - 2(i-1)
$$
与上面类似，再次累加得到:
$$
M_i = iM_1 - i(i-1)
$$
利用 $M_N = 0$ 这个条件，可以得到 $M_1 = N-1$
代入上式，解得:
$$
M_i = i(N-i)
$$
实际上，由[[三对角行列式#2. 利用分析学的极限思想导出重根公式]]，对于 $p \ne q$ 的情形，我们只需要令 $q \to p$ 即可，由洛必达法则计算就有
$$\lim_{q \to p}\frac{i}{q-p} - \frac{N}{q-p}\cdot \frac{1-(\frac{q}{p})^i}{1-(\frac{q}{p})^N} = \frac{i(N-i)}{2p} = i(N-i)$$

---

## 游走问题

> [!example] 问题1
> 假设有一只蚂蚁在直线上爬行，原点处有一只蜘蛛捕食，$N$ 处有一挡板，当蚂蚁到达 $N$ 后，只能返回，蚂蚁向左和向右走一步的概率分别为 $p$ 和 $q(p+q = 1,p,q\ne0)$，开始时位于 $i(0 \le i \le N)$，计算蚂蚁被吃掉的概率

> 本质是有一个吸收壁，一个反射壁的Markov链

记 $P_i$ 为开始时的坐标为 $i$ , 且最终到达 $0$ 的概率，于是 $P_0 = 1,P_N = P_{N-1}$
$$
P_i = qP_{i+1}+pP_{i-1} = pP_i+qP_i
$$
于是
$$
P_{i+1} - P_{i} = \frac{p}{q}(P_i - P_{i-1})
$$
与上面的问题一样，累加得到:
$$
P_i - P_1 = (P_1-1)\big[\frac{p}{q}+(\frac{p}{q})^2+…+(\frac{p}{q})^{i-1}\big]
$$
**Case1:** 当 $p =q = \frac{1}{2}$ 时
$$
P_i - P_1 = (P_1-1)(i-1)
$$
由于 $P_N = P_{N-1}$，于是可得 $P_N-P_1 = (P_1-1)(N-1)$ 和 $P_{N-1} - P_1 = (P_1-1)(N-2)$
两式相减得到 $P_1 = 1$，代回原式立即得到 $P_i = 1$

**Case2.** 当 $p \ne q$ 时
$$
P_i - P_1 =(P_1- 1)\Big(\frac{1-(\frac{p}{q})^i}{1-\frac{p}{q}}-1\Big)
$$
令 $i = N,N-1$, 得到
$$
P_N - P_1 =(P_1- 1)\Big(\frac{1-(\frac{p}{q})^N}{1-\frac{p}{q}}-1\Big)
$$
以及
$$
P_{N-1} - P_1 =(P_1- 1)\Big(\frac{1-(\frac{p}{q})^{N-1}}{1-\frac{p}{q}}-1\Big)
$$
两式相减得到:
$$
(P_1-1)(\frac{p}{q})^{N-1} = 0
$$
从而 $P_1 = 1$，代入原式立即得到 $P_i = 1$
因此蚂蚁一定会到达 0 点被吃掉
***

**另一种方法**

设 $X_n$ 为蚂蚁在时刻 $n$ 所处的位置，则可以写出其转移概率矩阵
$$
\mathbf{P} = 
\begin{pmatrix}
1 & 0 & 0 & 0 \cdots 0 & 0 & 0 \\
p & 0 & q & 0 \cdots 0 & 0 & 0 \\
0 & p & 0 & q \cdots 0 & 0 & 0 \\
\vdots & \vdots & \vdots & \cdots & \vdots & \vdots \\
0 & 0 & 0 & 0 \cdots p & 0 & q \\
0 & 0 & 0 & 0 \cdots 0 & 1 & 0
\end{pmatrix}
$$
其中 $p_{ij}=\Pr(X_{n+1}=j\mid X_n=i).$
此 Markov 链有两类，分别为 $\{0\}$ 和 $\{1,2,…,N\}$。由于 $1,2,…,N$ 互通，从而同为常返或者非常返，于是考虑1状态
由于 1 会以 $p$ 的概率到 0，这意味着 1 将以 $p$ 的概率永远回不到 1，从而 1 为非常返
从而 $\{1,2,…,N\}$ 为非常返,于是对于 $i \in \{1,2,…,N\}$, 有
$$
\begin{aligned}
\lim_{n \to \infty} p_{i0}^{(n)} &= \lim_{n \to \infty} (1 - \sum_{j \ne 0}^{N}p_{ij}^{(n)}) \\
&=1-\sum_{j \ne 0}^{N}\lim_{n \to \infty} p_{ij}^{(n)} \\
&=1
\end{aligned} 
$$
从而一定会到达 $0$ 点


***

> [!example] 问题2
> 蚂蚁平均多长时间被吃掉，即求期望

记 $M_i$ 为从 $i$ 到 $0$ 的平均时间，于是有 $M(0) = 0$
由于在 $N$ 处会立即返回 $N-1$ 处，因此 $M(N) = M(N-1)+1$
类似赌徒问题中的期望问题
**Case1:**  $p \ne q$ 时，可以得到
$$
 M_{i+1}-M_i - \frac{1}{p-q}= \frac{p}{q}(M_i-M_{i-1}-\frac{1}{p-q})
$$
累加得到:
$$
M_i - M_1 - \frac{i-1}{p-q}  = (M_1-\frac{1}{p-q})(\frac{1-(\frac{p}{q})^i}{1-\frac{p}{q} }-1)
$$
$令i = N,N-1$, 分别得到
$$
M_N - M_1 - \frac{N-1}{p-q}  = (M_1-\frac{1}{p-q})(\frac{1-(\frac{p}{q})^N}{1-\frac{p}{q} }-1)
$$
$$
M_{N-1} - M_1 - \frac{N-2}{p-q}  = (M_1-\frac{1}{p-q})(\frac{1-(\frac{p}{q})^{N-1}}{1-\frac{p}{q} }-1)
$$
两式相减得
$$
1 - \frac{1}{p-q} = (m_1-\frac{1}{p-q})(\frac{(\frac{p}{q})^{N-1}-(\frac{p}{q})^N}{1-\frac{p}{q}}) = (m_1-\frac{1}{p-q})(\frac{p}{q})^{N-1}
$$
从而
$$
M_1 = (1-\frac{1}{p-q})(\frac{p}{q})^{1-N}+\frac{1}{p-q}
$$
代回原式整理得到
$$
M_i = \frac{i}{p-q}+(1-\frac{1}{p-q})(\frac{p}{q})^{1-N}\cdot \frac{1-(\frac{p}{q})^i}{1-\frac{p}{q}}
$$

**Case2:** $p = q$ 时
同样可以在 **Case1** 中令 $q \to p$ , 然后用洛必达法则就能算出
$$M_i=i(2N-i)$$
