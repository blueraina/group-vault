---
chapter: 15
title: "15-第十五章 Fourier 级数"
type: 讲义
source: 谢惠民数学分析习题课讲义下册
depends_on: []
tags:
  - 谢惠民数学分析
---

# 15-第十五章 Fourier 级数

## 依赖于
- 无显式依赖

## 被以下题目直接调用
- 无

## 正文部分

### 15.1.4 例题

> [!question] 例题 15.1.1
> 证明：三角多项式
> $$
> P_n(x)=\sum_{k=0}^n(A_k\cos kx+B_k\sin kx)
> $$
> 的 Fourier 级数就是其本身。
>

**证**
三角多项式可看成是只含有限个非零项的三角级数，因此在 $(-\infty,+\infty)$ 上一致收敛，引用命题 15.1.1 即得。（本题的另一个解法当然是直接计算。）

> [!question] 例题 15.1.2
> 设函数 $f(x)=x^3,\ x\in(-\pi,\pi)$，求 $f$ 的 Fourier 级数。
>

**解 1**
利用 Euler 公式 $e^{i\theta}=\cos\theta+i\sin\theta$ 在复数域进行计算往往是很有效的方法。对本题可以计算如下：
$$
\begin{aligned}
\frac{1}{\pi}\int_{-\pi}^{\pi}x^3(\cos nx+i\sin nx)\,dx
&=\frac{1}{\pi}\int_{-\pi}^{\pi}x^3e^{inx}\,dx\\
&=\left.\frac{1}{\pi}\left(\frac{x^3}{in}e^{inx}-\frac{3x^2}{(in)^2}e^{inx}
+\frac{6x}{(in)^3}e^{inx}-\frac{6}{(in)^4}e^{inx}\right)\right|_{-\pi}^{\pi}\\
&=i\frac{2(-1)^n}{\pi}\left(-\frac{\pi^3}{n}+\frac{6\pi}{n^3}\right)\\
&=i(-1)^{n-1}\left(\frac{2\pi^2}{n}-\frac{12}{n^3}\right).
\end{aligned}
$$
于是所求的 Fourier 级数为
$$
\sum_{n=1}^{\infty}(-1)^{n-1}\left(\frac{2\pi^2}{n}-\frac{12}{n^3}\right)\sin nx.
$$

**解 2**
这里的工具是命题 15.1.2。先用公式 (15.2) 直接计算出在 $(-\pi,\pi)$ 上函数 $x$ 的 Fourier 级数：
$$
x\sim \sum_{n=1}^{\infty}\frac{2(-1)^{n-1}}{n}\sin nx.
$$
然后从 $(x^2)'=2x$ 和公式 (15.6) 得到
$$
x^2\sim \frac{\pi^2}{3}+\sum_{n=1}^{\infty}\frac{4(-1)^n}{n^2}\cos nx,
$$
其中常数项是直接计算得到的。

由于在区间 $(-\pi,\pi)$ 上的 $x^3$ 不可能连续延拓为周期 $2\pi$ 的连续函数，因此不能直接用命题 15.1.2，但可以采用技巧 (15.7) 将 $x^3$ 分解为
$$
x^3=(x^3-\pi^2x)+\pi^2x.
$$
右边第一项可以延拓为满足命题 15.1.2 的周期 $2\pi$ 的连续函数，其导函数为 $3x^2-\pi^2$，因此可以用公式 (15.6) 和 (15.12) 得到 $x^3$ 的正弦级数中 $\sin nx$ 的系数为
$$
3\cdot \frac{4(-1)^n}{n^3}+\pi^2\cdot\frac{2(-1)^{n-1}}{n}
=\frac{(-1)^n12}{n^3}+\frac{(-1)^{n-1}2\pi^2}{n}.
$$

> [!question] 例题 15.1.3
> 设 $f$ 为 $\left(0,\frac{\pi}{2}\right)$ 上的可积和绝对可积函数。问：如何将 $f$ 延拓到区间 $(-\pi,\pi)$ 上，使其 Fourier 级数具有如下的形式：
> $$
> \sum_{n=1}^{\infty}a_{2n-1}\cos(2n-1)x.
> $$
>

**解**
由题意要求 $a_{2n}=0$。从公式
$$
a_{2n}=\frac{2}{\pi}\int_0^\pi f(x)\cos 2nx\,dx
$$
可见，由于 $\cos 2nx$ 在 $[0,\pi]$ 上关于其中点为偶函数，根据上册 324 页命题 10.4.5，只要有 $f(x)=-f(\pi-x)$ 成立就可以使上述积分为 0。这决定了 $f$ 在 $\left(\frac{\pi}{2},\pi\right)$ 上的延拓。定义 $f(0)=f\left(\frac{\pi}{2}\right)=0$，然后用偶延拓 $f(-x)=f(x)$ 将 $f$ 延拓到 $(-\pi,0)$ 上即可。

结论：将 $f$ 以如下方式延拓：
$$
F(x)=
\begin{cases}
f(x), & x\in\left(0,\frac{\pi}{2}\right),\\
-f(\pi-x), & x\in\left(\frac{\pi}{2},\pi\right),\\
0, & x=0,\frac{\pi}{2},\\
f(-x), & x\in(-\pi,0).
\end{cases}
$$

### 15.1.5 练习题

> [!question] 题目 1
> 求下列函数的 Fourier 级数：
> 1. $\sin^3x+\cos^4x$；
> 2. $ax^3+bx^2+cx+d,\ x\in(-\pi,\pi)$。
>

**解答**
（1）由恒等式 $\sin^3x=(3\sin x-\sin3x)/4$ 与 $\cos^4x=(3+4\cos2x+\cos4x)/8$，原函数本身就是三角多项式，故其 Fourier 级数为
$$
\frac38+\frac34\sin x-\frac14\sin3x+\frac12\cos2x+\frac18\cos4x.
$$

（2）利用
$$
x\sim2\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}n\sin nx,
\quad x^2\sim\frac{\pi^2}{3}+4\sum_{n=1}^{\infty}\frac{(-1)^n}{n^2}\cos nx,
$$
以及例题 15.1.2 中 $x^3$ 的展开式，线性组合即得
$$
\begin{aligned}
ax^3+bx^2+cx+d
&\sim d+\frac{b\pi^2}{3}
+\sum_{n=1}^{\infty}\Biggl[
\frac{4b(-1)^n}{n^2}\cos nx\\
&\hspace{7em}
+(-1)^{n-1}\left(\frac{2a\pi^2+2c}{n}-\frac{12a}{n^3}\right)\sin nx
\Biggr].
\end{aligned}
$$

> [!question] 题目 2
> 将定义在 $\left(0,\frac{\pi}{2}\right)$ 上的可积和绝对可积函数 $f$ 延拓到区间 $(-\pi,\pi)$ 上，使其 Fourier 级数具有如下的形式：
> $$
> \sum_{n=1}^{\infty}b_{2n-1}\sin(2n-1)x.
> $$
>

**解答**
在 $(0,\pi)$ 上作关于 $\pi/2$ 的偶延拓，再关于原点作奇延拓，即令
$$
F(x)=
\begin{cases}
f(x),&0<x<\dfrac\pi2,\\
f(\pi-x),&\dfrac\pi2<x<\pi,\\
-F(-x),&-\pi<x<0,
\end{cases}
$$
端点及 $\pi/2$ 处的值可任取。奇性使所有余弦系数为零；又因 $F(\pi-x)=F(x)$，
$$
\int_0^\pi F(x)\sin(2nx)\,dx
=-\int_0^\pi F(x)\sin(2nx)\,dx=0,
$$
故只含 $\sin(2n-1)x$ 项。

> [!question] 题目 3
> 证明：函数
> $$
> f(x)=
> \begin{cases}
> c, & 0<x\le \pi,\\
> 0, & x=0,\\
> -c, & -\pi<x<0
> \end{cases}
> $$
> 的 Fourier 级数的前 $2n+1$ 项的和
> $$
> S_n(x)=\frac{a_0}{2}+\sum_{k=1}^n(a_k\cos kx+b_k\sin kx)
> $$
> 具有形式
> $$
> S_n(x)=\frac{2c}{\pi}\int_0^x\frac{\sin 2nt}{\sin t}\,dt.
> $$
>

**解答**
$f$ 为奇函数，故 $a_k=0$，并且
$$
b_k=\frac{2c}{\pi}\int_0^\pi\sin kx\,dx
=\begin{cases}
\dfrac{4c}{\pi k},&k\text{ 为奇数},\\
0,&k\text{ 为偶数}.
\end{cases}
$$
由
$$
\frac{\sin2nt}{\sin t}=2\sum_{j=1}^n\cos(2j-1)t
$$
积分可得
$$
S_{2n-1}(x)=S_{2n}(x)
=\frac{4c}{\pi}\sum_{j=1}^n\frac{\sin(2j-1)x}{2j-1}
=\frac{2c}{\pi}\int_0^x\frac{\sin2nt}{\sin t}\,dt.
$$
因此题中所写公式按非零正弦项编号成立；若 $S_n$ 严格按题面定义，则应写成上述 $S_{2n-1}=S_{2n}$ 的形式。

> [!question] 题目 4
> 设 $f\in C^1[-\pi,\pi]$，证明：
> $$
> a_n=o\left(\frac{1}{n}\right),\qquad b_n=O\left(\frac{1}{n}\right);
> $$
> 如果又有 $f(\pi)=f(-\pi)$，则 $b_n=o\left(\frac{1}{n}\right)$。
>

**解答**
分部积分并用 Riemann 引理，
$$
a_n=-\frac1{\pi n}\int_{-\pi}^{\pi}f'(x)\sin nx\,dx=o\!\left(\frac1n\right),
$$
而
$$
b_n=\frac{(-1)^n[f(-\pi)-f(\pi)]}{\pi n}
+\frac1{\pi n}\int_{-\pi}^{\pi}f'(x)\cos nx\,dx.
$$
后一积分趋于零，故一般有 $b_n=O(1/n)$；若 $f(\pi)=f(-\pi)$，边界项消失，便有 $b_n=o(1/n)$。

> [!question] 题目 5
> 设 $f$ 是以 $2\pi$ 为周期的有界函数且在 $(-\pi,\pi)$ 上逐段单调，证明：
> $$
> a_n=O\left(\frac{1}{n}\right),\qquad b_n=O\left(\frac{1}{n}\right).
> $$
> （可在每个单调区间上用积分第二中值定理，见上册的命题 10.2.2。）
>

**解答**
将 $[-\pi,\pi]$ 分成有限个单调区间，并在每段上分别对余弦积分与正弦积分使用积分第二中值定理。正弦、余弦的任一原函数在该区间上的振幅均不超过 $2/n$，故每段积分的绝对值不超过 $C_j/n$。分段数有限，求和后即得 $a_n=O(1/n)$、$b_n=O(1/n)$。

> [!question] 题目 6
> 设 $f$ 是以 $2\pi$ 为周期的函数且在 $[-\pi,\pi]$ 上可积和绝对可积，证明：用 $\sin x$ 去乘 $f$ 的 Fourier 级数的每一项所得的三角级数就是 $f(x)\sin x$ 的 Fourier 级数。
>

**解答**
记 $f$ 的 Fourier 系数为 $a_0,a_n,b_n$，并约定 $b_0=0$。设 $f(x)\sin x$ 的 Fourier 系数为 $A_0,A_m,B_m$。利用积化和差公式直接计算得
$$
A_0=b_1,
\qquad A_m=\frac{b_{m+1}-b_{m-1}}2\quad(m\ge1),
$$
以及
$$
B_1=\frac{a_0-a_2}{2},
\qquad B_m=\frac{a_{m-1}-a_{m+1}}2\quad(m\ge2).
$$
另一方面，用 $\sin x$ 逐项乘原 Fourier 级数，再把每一项积化为和差，所得常数项、余弦项和正弦项的系数恰为以上各式，故该三角级数正是 $f(x)\sin x$ 的 Fourier 级数。

> [!question] 题目 7
> 设 $[a,b]$ 上的连续函数系 $\{e_n\}$ 满足条件
> $$
> \int_a^b e_i(x)e_j(x)\,dx=\delta_{ij},
> \qquad
> \delta_{ij}=0\ (i\ne j),\quad \delta_{ii}=1,
> $$
> 则称该函数系在 $[a,b]$ 上为规范正交系。设 $f$ 在 $[a,b]$ 上可积和平方可积，定义
> $$
> c_n=\int_a^b f(x)e_n(x)\,dx
> $$
> 为 $f$ 关于 $e_n$ 的 Fourier 系数，$n=1,2,\cdots$。证明：级数 $\sum_{n=1}^{\infty}c_n^2$ 收敛。又问：当 $n$ 固定时，$a_1,a_2,\ldots,a_n$ 取什么值时，平方平均误差
> $$
> \int_a^b\left[f(x)-\sum_{k=1}^n a_ke_k(x)\right]^2\,dx
> $$
> 最小？
>

**解答**
对任意实数 $\alpha_1,\ldots,\alpha_n$，由正交性展开平方可得
$$
\int_a^b\left(f-\sum_{k=1}^n\alpha_ke_k\right)^2dx
=\int_a^bf^2dx-\sum_{k=1}^nc_k^2
+\sum_{k=1}^n(\alpha_k-c_k)^2.
$$
取 $\alpha_k=c_k$，左边非负，于是 $\sum_{k=1}^nc_k^2\le\int_a^bf^2dx$。其部分和单调有界，故 $\sum c_k^2$ 收敛。上式还表明平方平均误差恰在且仅在 $\alpha_k=c_k$（$1\le k\le n$）时最小。

> [!question] 题目 8
> 设 $g$ 是周期为 1 的连续函数且
> $$
> \int_0^1 g(x)\,dx=0,
> $$
> 函数 $f\in C^1[0,1]$，令
> $$
> a_n=\int_0^1 f(x)g(nx)\,dx,\qquad n=1,2,\cdots,
> $$
> 证明：级数 $\sum_{n=1}^{\infty}a_n^2$ 收敛。
>

**解答**
令 $G(x)=\int_0^xg(t)\,dt$。因 $g$ 的周期为 $1$ 且一个周期上的积分为零，$G$ 也是周期为 $1$ 的连续有界函数，并有 $G(0)=G(n)=0$。由 $g(nx)=n^{-1}[G(nx)]'$ 分部积分，
$$
a_n=-\frac1n\int_0^1f'(x)G(nx)\,dx,
$$
从而 $|a_n|\le \|G\|_\infty\|f'\|_{L^1}/n$。因此 $\sum a_n^2$ 由 $\sum n^{-2}$ 控制而收敛。

### 15.2.2 Gibbs 现象中的例题

> [!question] 例题 15.2.1（Gibbs 现象）
> 记 $\{S_n(x)\}$ 是 Fourier 级数
> $$
> S(x)=\sum_{n=1}^{\infty}\frac{\sin nx}{n}
> $$
> 的部分和函数列，$S(x)=\frac{\pi-x}{2}$ 为该级数在区间 $(0,2\pi)$ 上的和函数，则有
> $$
> \lim_{n\to\infty}\max_{0\le x\le \pi}\{S_n(x)-S(x)\}
> =\int_0^\pi \frac{\sin t}{t}\,dt-\frac{\pi}{2}\approx \frac{\pi}{2}\times 0.17898.
> $$
>

**证**
研究误差 $\varepsilon_n(x)=S_n(x)-S(x)$ 在 $x=0$ 右侧的性态。直接计算得到
$$
\frac{d\varepsilon_n(x)}{dx}=\frac{1}{2}+\sum_{k=1}^n\cos kx,
$$
因此就有
$$
\frac{d\varepsilon_n(x)}{dx}=D_n(x)
=\frac{\sin\left(n+\frac12\right)x}{2\sin\frac{x}{2}}.
$$
可以看出误差 $\varepsilon_n(x)$ 的极值点为
$$
x_n^{(m)}=\frac{\pi m}{n+\frac12},\qquad m=1,2,\cdots,2n.
$$
其中当 $m$ 为奇数时是极大值点，当 $m$ 为偶数时是极小值点。

直接计算在这些极值点上的误差值：
$$
\begin{aligned}
\varepsilon_n\left(x_n^{(m)}\right)
&=S_n\left(x_n^{(m)}\right)-S\left(x_n^{(m)}\right)\\
&=\sum_{k=1}^n\frac{\sin\left(kx_n^{(m)}\right)}{k}
-\frac{\pi-x_n^{(m)}}{2}\\
&=\left(\sum_{k=1}^n
\frac{\sin\left(kx_n^{(m)}\right)}{kx_n^{(m)}}\cdot\frac{\pi m}{n}\right)
\left(\frac{n}{n+\frac12}\right)-\frac{\pi}{2}+\frac{\pi m}{2n+1}\\
&=\left(\sum_{k=1}^n
\frac{\sin\left(kx_n^{(m)}\right)}{kx_n^{(m)}}\cdot\frac{\pi m}{n}\right)
-\frac{\pi}{2}+O\left(\frac{1}{n}\right).
\end{aligned}
$$
由于右边第一项可看作为 Riemann 积分和式，因此当 $n\to\infty$ 时得到
$$
\lim_{n\to\infty}\varepsilon_n\left(x_n^{(m)}\right)
=\int_0^{\pi m}\frac{\sin t}{t}\,dt-\frac{\pi}{2}.
$$
容易知道当 $m=1$ 时的极限值最大，即得到
$$
\int_0^\pi\frac{\sin t}{t}\,dt-\frac{\pi}{2}
\approx \frac{\pi}{2}\times 0.17898.
$$

**注 1**
若取 $x_n=c/n,\ n=1,2,\cdots$，则类似地有
$$
\lim_{n\to\infty}S_n\left(\frac{c}{n}\right)=\int_0^c\frac{\sin t}{t}\,dt.
$$
取不同的 $c$ 值，这样的极限值就会形成一个闭区间 $[CS(0^-),CS(0^+)]$，其中
$$
C=\frac{2}{\pi}\int_0^\pi\frac{\sin t}{t}\,dt\approx 1.17898.
$$

**注 2**
虽然以上只是一个特例，但可以用它以及它的平移来吸收一般的和函数中的所有间断点。因此以上所得的结论、常数 $18\%$ 以及注 1 中的内容都具有普遍意义。

**小结**
若和函数有间断点，则不可能依靠 Fourier 级数的部分和函数 $S_n(x)$ 的 $n$ 增加来改进近似计算的精确程度。这是在 Fourier 级数的应用中不能忽视的问题。

**注 3**
以上证明的思想来自《美国数学月刊》(1980) 第 87 卷 210--212 页。

### 15.2.6 例题

> [!question] 例题 15.2.2
> 求级数
> $$
> \sum_{n=1}^{\infty}\frac{1}{n^4}
> \qquad\text{与}\qquad
> \sum_{n=1}^{\infty}\frac{1}{n^6}
> $$
> 的和。
>

**解**
由 (15.13) 以及收敛性定理，我们有
$$
x^2=\frac{\pi^2}{3}+4\sum_{n=1}^{\infty}\frac{(-1)^n}{n^2}\cos nx,\qquad x\in[-\pi,\pi].
$$
用 $x=\pi$ 代入就得到
$$
\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}.
$$
然后利用
$$
a_0=\frac{2\pi^2}{3},\qquad
a_n=\frac{4(-1)^n}{n^2},\qquad
b_n=0,\quad n=1,2,\cdots,
$$
由 Parseval 等式，就得到
$$
\frac{1}{\pi}\int_{-\pi}^{\pi}x^4\,dx
=\frac12\left(\frac{2\pi^2}{3}\right)^2+\sum_{n=1}^{\infty}\frac{16}{n^4}.
$$
由此解得
$$
\sum_{n=1}^{\infty}\frac{1}{n^4}=\frac{\pi^4}{90}.
$$

同样，对 $f(x)=x^3,\ x\in(-\pi,\pi)$ 的 Fourier 展开式
$$
x^3=2\sum_{n=1}^{\infty}(-1)^n(6-\pi^2n^2)\frac{\sin nx}{n^3},
\qquad x\in(-\pi,\pi),
$$
应用 Parseval 等式，可以得到
$$
\frac{1}{\pi}\int_{-\pi}^{\pi}x^6\,dx
=\sum_{n=1}^{\infty}\left[2(-1)^n(6-\pi^2n^2)\frac{1}{n^3}\right]^2,
$$
整理后得到
$$
\frac{2}{7}\pi^6
=\sum_{n=1}^{\infty}\left(\frac{4\pi^4}{n^2}-\frac{48\pi^2}{n^4}+\frac{144}{n^6}\right).
$$
再利用
$$
\sum_{n=1}^{\infty}\frac{1}{n^4}=\frac{\pi^4}{90}
\qquad\text{与}\qquad
\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6},
$$
即可解得
$$
\sum_{n=1}^{\infty}\frac{1}{n^6}=\frac{\pi^6}{945}.
$$

**例题 15.1.2 之解 3**
在学了 Fourier 级数的逐项积分定理后可以如下求出在区间 $(-\pi,\pi)$ 上函数 $x^3$ 的 Fourier 级数，并同时确定其收敛性。

第一步与过去一样，先求出 (15.12)。然后逐项积分得到等式
$$
x^2=\sum_{n=1}^{\infty}(-1)^{n-1}\frac{4}{n^2}(1-\cos nx),
$$
其中的常数项是一个无穷级数，但可以不必去管它，只需直接按照公式 (15.1)（$n=0$）就可以得到所要的常数项
$$
\frac{1}{2\pi}\int_{-\pi}^{\pi}x^2\,dx=\frac{\pi^2}{3},
$$
因此就得到 Fourier 余弦级数展开式
$$
x^2=\frac{\pi^2}{3}+4\sum_{n=1}^{\infty}\frac{(-1)^n}{n^2}\cos nx.
$$
再用逐项积分方法得到等式
$$
x^3=\pi^2x+12\sum_{n=1}^{\infty}\frac{(-1)^n}{n^3}\sin nx.
$$
在第一项中将 $x$ 用它的 Fourier 级数代替，就得到与解 1 相同的答案。

> [!question] 例题 15.2.3
> 设数列 $\{b_n\}$ 单调收敛于 0，且已知级数 $\sum_{n=1}^{\infty}\frac{b_n}{n}$ 收敛，则函数
> $$
> f(x)=\sum_{n=1}^{\infty}b_n\sin nx
> $$
> 于区间 $[-\pi,\pi]$ 上可积和绝对可积。
>

**证**
从函数项级数的 Dirichlet 一致收敛判别法知道 $f$ 在 $x\ne 0$ 时连续，因此只有点 $x=0$ 可能是瑕点。以下只需要证明：当点 $x=0$ 为瑕点时 $|f|$ 在 $[0,\pi]$ 上广义可积。为此将下列积分作分拆：
$$
\int_{\pi/(n+1)}^\pi |f(x)|\,dx
=\sum_{k=1}^n\int_{\pi/(k+1)}^{\pi/k}|f(x)|\,dx.
$$
对于 $\pi/(k+1)\le x\le \pi/k$ 时的函数 $f$ 作估计如下：
$$
|f(x)|\le
\left|\sum_{i=1}^k b_i\sin ix\right|
+\left|\sum_{i=k+1}^{\infty}b_i\sin ix\right|.
$$
其中右边第一项不超过 $S_k=b_1+b_2+\cdots+b_k$，而第二项可利用 $\{b_n\}$ 非负单调减少的条件和 Abel 变换估计如下：
$$
\left|\sum_{i=k+1}^{\infty}b_i\sin ix\right|
\le \frac{b_{k+1}}{|\sin x/2|}
\le \frac{b_{k+1}}{x/\pi}
\le (k+1)b_{k+1}\le (k+1)b_k.
$$
因此就有
$$
\int_{\pi/(k+1)}^{\pi/k}|f(x)|\,dx
\le \bigl[S_k+(k+1)b_k\bigr]\frac{\pi}{k(k+1)}
=\pi\left[\frac{S_k}{k(k+1)}+\frac{b_k}{k}\right].
$$
令 $k=1,2,\cdots,n$ 代入并相加，就得到
$$
\int_{\pi/(n+1)}^\pi |f(x)|\,dx
\le \pi\sum_{k=1}^n\frac{S_k}{k(k+1)}
+\pi\sum_{k=1}^n\frac{b_k}{k}.
$$
对右边第一项利用类似的方法可以得到
$$
\begin{aligned}
\sum_{k=1}^n\frac{S_k}{k(k+1)}
&=\sum_{k=1}^n\frac{1}{k(k+1)}\sum_{i=1}^k b_i\\
&=\sum_{i=1}^n b_i\sum_{k=i}^n\frac{1}{k(k+1)}
=\sum_{i=1}^n\frac{b_i}{i}-\frac{S_n}{n+1}.
\end{aligned}
$$
从 $b_n\to0$ 可见右边第二项 $n\to\infty$ 时趋于 0，因此有
$$
\sum_{n=1}^{\infty}\frac{S_n}{n(n+1)}
=\sum_{n=1}^{\infty}\frac{b_n}{n}.
$$
并最后估计得到
$$
\int_{\pi/(n+1)}^\pi |f(x)|\,dx
\le 2\pi\sum_{n=1}^{\infty}\frac{b_n}{n},
$$
因此积分 $\int_0^\pi |f(x)|\,dx$ 收敛。

> [!question] 例题 15.2.4
> 设数列 $\{b_n\}$ 单调收敛于 0，且已知
> $$
> f(x)=\sum_{n=1}^{\infty}b_n\sin nx
> $$
> 于 $[-\pi,\pi]$ 上可积，则
> $$
> \sum_{n=1}^{\infty}b_n\sin nx
> $$
> 是 $f$ 的 Fourier 级数。
>

**证**
由于 $f$ 于 $x\ne0$ 时连续，只需讨论 $x=0$ 为瑕点时的情况。利用广义积分的 Abel 判别法可知积分
$$
\int_{-\pi}^{\pi}f(x)\cos nx\,dx
\qquad\text{和}\qquad
\int_{-\pi}^{\pi}f(x)\sin nx\,dx
$$
均收敛。由于 $f$ 为奇函数，因此就得到 $a_n=0,\ n=0,1,\cdots$。以下只要证明
$$
b_n=2\int_0^\pi f(x)\sin nx\,dx,\qquad n=1,2,\cdots.
$$
写出
$$
2\int_0^\pi f(x)\sin nx\,dx
=2\int_0^\pi\left(\sum_{k=1}^{\infty}b_k\sin kx\sin nx\right)\,dx.
$$
从 $\{b_k\}$ 单调收敛于 0，又用三角变换和 Jordan 不等式可知对任意 $m\ge 1$ 有
$$
\left|\sum_{k=1}^m\sin kx\sin nx\right|
\le \left|\frac{\sin nx}{\sin(x/2)}\right|
\le \frac{nx}{x/\pi}=n\pi.
$$
因此从 Dirichlet 一致收敛判别法知道积分号下的级数在 $[0,\pi]$ 上一致收敛，用逐项积分计算就可以得到所求的结果。

**非 Fourier 级数的三角级数**
合并以上两个结果就可以知道，当 $\{b_n\}$ 单调趋于 0 时，处处收敛的三角级数
$$
\sum_{n=1}^{\infty}b_n\sin nx
$$
是其和函数 $f$ 的 Fourier 级数的充分必要条件是数项级数
$$
\sum_{n=1}^{\infty}\frac{b_n}{n}
$$
收敛。因此在 Bessel 不等式（即命题 15.1.7）后的注 2 中举出的例子
$$
\sum_{n=1}^{\infty}\frac{\sin nx}{n^p}\quad \left(0<p\le \frac12\right)
$$
仍然是其和函数 $f$ 的 Fourier 级数，当然 $f$ 不平方可积。

但在命题 15.2.9 后所举的例子，如
$$
\sum_{n=2}^{\infty}\frac{\sin nx}{\ln n},\qquad
\sum_{n=9}^{\infty}\frac{\sin nx}{\ln\ln n}
$$
等则确实不是 Fourier 级数，而且它们的和函数一定不是可积和绝对可积函数。

### 15.2.7 练习题

> [!question] 题目 1
> 定义函数
> $$
> f(x)=
> \begin{cases}
> x, & x\in\left(0,\frac{\pi}{2}\right),\\
> \frac{\pi}{4}, & x=\frac{\pi}{2},\\
> x-\frac{\pi}{2}, & x\in\left(\frac{\pi}{2},\pi\right),
> \end{cases}
> $$
> 将 $f$ 展开为余弦级数，并求数项级数
> $$
> \sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{2n-1}
> $$
> 的值。
>

**解答**
余弦系数为
$$
a_0=\frac2\pi\int_0^\pi f(x)\,dx=\frac\pi2,
\qquad
a_n=\frac{2[(-1)^n-1]}{\pi n^2}+\frac{\sin(n\pi/2)}n.
$$
故偶数项全为零，而当 $n=2k-1$ 时
$$
a_{2k-1}=\frac{(-1)^{k-1}}{2k-1}-\frac4{\pi(2k-1)^2}.
$$
于是
$$
f(x)\sim\frac\pi4+
\sum_{k=1}^{\infty}\left[\frac{(-1)^{k-1}}{2k-1}-\frac4{\pi(2k-1)^2}\right]\cos(2k-1)x.
$$
在 $x=0$ 处代入，并用 $\sum_{k\ge1}(2k-1)^{-2}=\pi^2/8$，得到
$$
\sum_{k=1}^{\infty}\frac{(-1)^{k-1}}{2k-1}=\frac\pi4.
$$

> [!question] 题目 2
> 设对于 $a>0$ 有函数
> $$
> f(x)=
> \begin{cases}
> x, & x\in\left[0,\frac{a}{2}\right],\\
> a-x, & x\in\left[\frac{a}{2},a\right],
> \end{cases}
> $$
> 将 $f$ 展开为：
> 1. 余弦级数；
> 2. 正弦级数。
>

**解答**
记半区间展开的基函数为 $\cos(n\pi x/a)$、$\sin(n\pi x/a)$。直接积分得余弦展开
$$
f(x)=\frac a4-\frac{2a}{\pi^2}
\sum_{k=0}^{\infty}\frac{\cos\dfrac{(4k+2)\pi x}{a}}{(2k+1)^2},
\qquad 0\le x\le a,
$$
以及正弦展开
$$
f(x)=\frac{4a}{\pi^2}
\sum_{k=0}^{\infty}\frac{(-1)^k}{(2k+1)^2}
\sin\frac{(2k+1)\pi x}{a},
\qquad 0\le x\le a.
$$

> [!question] 题目 3
> 设 $\alpha$ 为非整数，利用 $f(x)=\cos\alpha x,\ x\in[-\pi,\pi]$ 的 Fourier 展开式，证明下列关于余切函数和余割函数的部分分式展开式：
> $$
> \cot x=\frac{1}{x}+\sum_{n=1}^{\infty}\left(\frac{1}{x-n\pi}+\frac{1}{x+n\pi}\right)
> =\frac{1}{x}+\sum_{n=1}^{\infty}\frac{2x}{x^2-n^2\pi^2},
> $$
> $$
> \csc x=\frac{1}{x}+\sum_{n=1}^{\infty}(-1)^n
> \left(\frac{1}{x-n\pi}+\frac{1}{x+n\pi}\right)
> =\frac{1}{x}+\sum_{n=1}^{\infty}(-1)^n\frac{2x}{x^2-n^2\pi^2},
> $$
> 且求出级数 $\sum_{n=1}^{\infty}\frac{1}{n^2-\alpha^2}$ 的和。
>

**解答**
因 $\alpha\notin\mathbb Z$，直接计算 $\cos\alpha x$ 的 Fourier 系数可得
$$
\cos\alpha x=\frac{\sin\pi\alpha}{\pi\alpha}
+\frac{2\alpha\sin\pi\alpha}{\pi}
\sum_{n=1}^{\infty}\frac{(-1)^n\cos nx}{\alpha^2-n^2}.
$$
令 $x=\pi$，约去 $\sin\pi\alpha$ 后得到
$$
\cot\pi\alpha=\frac1{\pi\alpha}
+\frac{2\alpha}{\pi}\sum_{n=1}^{\infty}\frac1{\alpha^2-n^2};
$$
令 $x=0$ 则得到
$$
\csc\pi\alpha=\frac1{\pi\alpha}
+\frac{2\alpha}{\pi}\sum_{n=1}^{\infty}\frac{(-1)^n}{\alpha^2-n^2}.
$$
把 $\pi\alpha$ 改记为 $x$，即为题中的两组部分分式展开式。第一式同时给出
$$
\sum_{n=1}^{\infty}\frac1{n^2-\alpha^2}
=\frac1{2\alpha^2}-\frac{\pi}{2\alpha}\cot\pi\alpha.
$$

> [!question] 题目 4
> 将下列函数在 $[-\pi,\pi]$ 上展开为 Fourier 级数：
> 1. $f(x)=|\sin x|$；
> 2.
> $$
> f(x)=
> \begin{cases}
> ax, & x\in[-\pi,0),\\
> bx, & x\in[0,\pi].
> \end{cases}
> $$
>

**解答**
（1）函数为偶函数。计算余弦系数可得
$$
|\sin x|=\frac2\pi-\frac4\pi
\sum_{n=1}^{\infty}\frac{\cos2nx}{4n^2-1}.
$$

（2）写成
$$
f(x)=\frac{a+b}{2}x+\frac{b-a}{2}|x|.
$$
结合 $x$ 与 $|x|$ 的 Fourier 展开，得到
$$
f(x)\sim\frac{(b-a)\pi}{4}
+(a+b)\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}n\sin nx
-\frac{2(b-a)}\pi\sum_{k=0}^{\infty}
\frac{\cos(2k+1)x}{(2k+1)^2}.
$$

> [!question] 题目 5
> 将下列函数展开为正弦级数：
> 1. $f(x)=e^{-2x},\ x\in[0,\pi]$；
> 2.
> $$
> f(x)=
> \begin{cases}
> \cos\frac{\pi x}{2}, & x\in[0,1],\\
> 0, & x\in[1,2].
> \end{cases}
> $$
>

**解答**
（1）在 $[0,\pi]$ 上的正弦系数为
$$
b_n=\frac2\pi\int_0^\pi e^{-2x}\sin nx\,dx
=\frac{2n[1-(-1)^ne^{-2\pi}]}{\pi(n^2+4)},
$$
故
$$
e^{-2x}\sim\sum_{n=1}^{\infty}
\frac{2n[1-(-1)^ne^{-2\pi}]}{\pi(n^2+4)}\sin nx.
$$

（2）在 $[0,2]$ 上展开为 $\sin(n\pi x/2)$。系数
$$
b_n=\int_0^1\cos\frac{\pi x}{2}\sin\frac{n\pi x}{2}\,dx
$$
满足 $b_1=1/\pi$，而对 $n\ge2$，
$$
b_n=\frac{2[n-\sin(n\pi/2)]}{\pi(n^2-1)}.
$$
因此所求正弦级数为 $\sum_{n\ge1}b_n\sin(n\pi x/2)$。

> [!question] 题目 6
> 将下列函数展开为余弦级数：
> 1. $f(x)=x(\pi-x),\ x\in[0,\pi]$；
> 2.
> $$
> f(x)=
> \begin{cases}
> \sin 2x, & x\in\left[0,\frac{\pi}{4}\right],\\
> 1, & x\in\left[\frac{\pi}{4},\frac{\pi}{2}\right].
> \end{cases}
> $$
>

**解答**
（1）直接计算得
$$
x(\pi-x)=\frac{\pi^2}{6}-\sum_{n=1}^{\infty}\frac{\cos2nx}{n^2},
\qquad 0\le x\le\pi.
$$

（2）在 $[0,\pi/2]$ 上用 $\cos2nx$ 展开。常数项为 $1/2+1/\pi$，且
$$
a_1=-\frac1\pi,
\qquad
a_n=\frac{2[\sin(n\pi/2)-n]}{\pi n(n^2-1)}\quad(n\ge2).
$$
故
$$
f(x)=\frac12+\frac1\pi-\frac1\pi\cos2x
+\sum_{n=2}^{\infty}
\frac{2[\sin(n\pi/2)-n]}{\pi n(n^2-1)}\cos2nx.
$$

> [!question] 题目 7
> 设函数
> $$
> f(x)=
> \begin{cases}
> \pi-x, & 0<x\le \pi,\\
> 0, & x=0,\\
> -\pi-x, & -\pi<x<0,
> \end{cases}
> $$
> 求：
> 1. $f$ 的 Fourier 展开式；
> 2. 讨论 $f$ 的 Fourier 级数在 $(-\pi,\pi]$ 上是否收敛于 $f$，是否一致收敛。
>

**解答**
$f$ 为奇函数，且
$$
b_n=\frac2\pi\int_0^\pi(\pi-x)\sin nx\,dx=\frac2n.
$$
因此
$$
f(x)\sim2\sum_{n=1}^{\infty}\frac{\sin nx}{n}.
$$
其周期延拓除 $x=0$ 外连续，在 $x=0$ 处左右极限分别为 $-\pi$、$\pi$，而题设值恰为二者平均值，所以 Fourier 级数在 $(-\pi,\pi]$ 的每一点都收敛于 $f$。但各部分和均连续，而 $f$ 在 $0$ 处不连续，故不可能一致收敛。

> [!question] 题目 8
> 设 $f$ 在 $[-\pi,\pi]$ 上可积和绝对可积，证明：$\forall \varepsilon>0$，存在三角多项式
> $$
> P_n(x)=\sum_{k=0}^n(A_k\cos kx+B_k\sin kx),
> $$
> 使
> $$
> \int_{-\pi}^{\pi}|f(x)-P_n(x)|\,dx<\varepsilon.
> $$
>

**解答**
先取周期连续函数 $g$，使 $\int_{-\pi}^{\pi}|f-g|<\varepsilon/2$；这可由可积函数的连续函数 $L^1$ 逼近得到，并在端点附近作微小修改使 $g(-\pi)=g(\pi)$。由 Weierstrass 第二逼近定理，存在三角多项式 $P$ 使 $\|g-P\|_\infty<\varepsilon/(4\pi)$。于是
$$
\int_{-\pi}^{\pi}|f-P|
\le\int_{-\pi}^{\pi}|f-g|+2\pi\|g-P\|_\infty<\varepsilon.
$$

> [!question] 题目 9
> 设 $f$ 为周期 $2\pi$ 的连续函数，且已知
> $$
> f(x)\sim \frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx),
> $$
> 证明：若右边的级数一致收敛，则其和函数一定就是 $f$。
>

**解答**
设右端一致收敛于 $g$。逐项积分表明 $g$ 的 Fourier 系数仍为 $a_n,b_n$，故 $h=f-g$ 的全部 Fourier 系数均为零。对任意三角多项式 $T$ 有 $\int_{-\pi}^{\pi}hT=0$。再取三角多项式 $T_m$ 一致逼近连续周期函数 $h$，则
$$
\int_{-\pi}^{\pi}h^2
=\int_{-\pi}^{\pi}h(h-T_m)\longrightarrow0.
$$
故 $h\equiv0$，即 $g=f$。

> [!question] 题目 10
> 设 $0<a<\pi$，定义函数
> $$
> f(x)=
> \begin{cases}
> 1, & |x|<a,\\
> 0, & a\le |x|<\pi.
> \end{cases}
> $$
> 利用 $f$ 的 Parseval 等式，求下列级数的和：
> $$
> \sum_{n=1}^{\infty}\frac{\sin^2 na}{n^2},\qquad
> \sum_{n=1}^{\infty}\frac{\cos^2 na}{n^2}.
> $$
>

**解答**
其 Fourier 系数为
$$
a_0=\frac{2a}{\pi},
\qquad a_n=\frac{2\sin na}{\pi n},
\qquad b_n=0.
$$
Parseval 等式给出
$$
\frac1\pi\int_{-\pi}^{\pi}f^2(x)\,dx
=\frac{a_0^2}{2}+\sum_{n=1}^{\infty}a_n^2,
$$
即
$$
\sum_{n=1}^{\infty}\frac{\sin^2na}{n^2}
=\frac{a(\pi-a)}2.
$$
再由 $\cos^2na=1-\sin^2na$ 与 $\sum n^{-2}=\pi^2/6$，得到
$$
\sum_{n=1}^{\infty}\frac{\cos^2na}{n^2}
=\frac{\pi^2}{6}-\frac{a(\pi-a)}2.
$$

### 15.3.2 参考题

> [!question] 题目 1
> 设 $f$ 是以 $2\pi$ 为周期的函数且在 $(0,2\pi)$ 上可积和绝对可积，证明：
> 1. 如果 $f$ 在 $(0,2\pi)$ 上单调减少，则
> $$
> \int_0^{2\pi}f(x)\sin nx\,dx\ge 0,\qquad n=1,2,\cdots;
> $$
> 2. 设 $f$ 在 $(0,2\pi)$ 可导且 $f'$ 在 $(0,2\pi)$ 上可积和绝对可积，如果 $f'$ 在 $(0,2\pi)$ 上单调增加，则
> $$
> \int_0^{2\pi}f(x)\cos nx\,dx\ge 0,\qquad n=1,2,\cdots.
> $$
>

**解答**
（1）把 $[0,2\pi]$ 分成 $n$ 个相邻的正、负半波。对 $j=0,1,\ldots,n-1$ 作变量替换可得
$$
\begin{aligned}
&\int_{2j\pi/n}^{(2j+2)\pi/n}f(x)\sin nx\,dx\\
&\quad=\frac1n\int_0^\pi
\left[f\!\left(\frac{t+2j\pi}{n}\right)
-f\!\left(\frac{t+(2j+1)\pi}{n}\right)\right]\sin t\,dt\ge0.
\end{aligned}
$$
求和即得结论。

（2）分部积分时边界项为零，故
$$
\int_0^{2\pi}f(x)\cos nx\,dx
=-\frac1n\int_0^{2\pi}f'(x)\sin nx\,dx.
$$
因 $f'$ 单调增加，$-f'$ 单调减少，对 $-f'$ 应用（1）即知右端非负。

> [!question] 题目 2
> 设 $f$ 为区间 $[0,2\pi]$ 上的下凸函数，证明：
> $$
> \int_0^{2\pi}f(x)\cos nx\,dx\ge0,\qquad \forall n\ge1.
> $$
>

**解答**
下凸函数在闭区间上绝对连续，其导函数几乎处处存在且单调增加。分部积分得
$$
\int_0^{2\pi}f(x)\cos nx\,dx
=-\frac1n\int_0^{2\pi}f'(x)\sin nx\,dx.
$$
由上题（1）作用于单调减少函数 $-f'$，右端非负。若不使用绝对连续性的通常结论，也可先对折线下凸函数证明，再用折线函数一致逼近一般下凸函数。

> [!question] 题目 3
> 设 $f$ 是周期 $2\pi$ 的连续函数，
> $$
> F_h(x)=\frac{1}{2h}\int_{x-h}^{x+h}f(t)\,dt,\qquad h>0,
> $$
> 证明：
> 1. $F_h$ 是以 $2\pi$ 为周期的连续可微函数；
> 2. $\forall \varepsilon>0$，$\exists h>0$，使在 $[-\pi,\pi]$ 上一致成立 $|f(x)-F_h(x)|<\varepsilon$；
> 3. 利用命题 15.2.8 重新证明 Weierstrass 第二逼近定理；
> 4. 已知 $f$ 的 Fourier 级数，计算 $F_h$ 的 Fourier 级数。
>

**解答**
周期性由定义立即得到；又由积分上限函数的求导公式，
$$
F_h'(x)=\frac{f(x+h)-f(x-h)}{2h},
$$
故 $F_h\in C^1$。设 $\omega_f$ 为 $f$ 的连续模，则
$$
|F_h(x)-f(x)|
\le\frac1{2h}\int_{-h}^h|f(x+t)-f(x)|\,dt
\le\omega_f(h),
$$
所以 $F_h\to f$ 一致收敛。给定 $\varepsilon>0$，先取 $h$ 使 $\|F_h-f\|_\infty<\varepsilon/2$；再由命题 15.2.8 取三角多项式 $T$ 使 $\|F_h-T\|_\infty<\varepsilon/2$，便重新得到 Weierstrass 第二逼近定理。

若 $f$ 的 Fourier 系数为 $a_0,a_n,b_n$，交换积分次序或直接计算卷积系数可得
$$
F_h(x)\sim\frac{a_0}{2}
+\sum_{n=1}^{\infty}\frac{\sin nh}{nh}
(a_n\cos nx+b_n\sin nx).
$$

> [!question] 题目 4
> 设 $f$ 为周期 $2\pi$ 的连续函数，
> $$
> f(x)\sim \frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx),
> $$
> 定义
> $$
> F(x)=\frac{1}{\pi}\int_{-\pi}^{\pi}f(t)f(x+t)\,dt.
> $$
> 1. 计算 $F$ 的 Fourier 系数；
> 2. 证明：$F$ 的 Fourier 级数一致收敛；
> 3. 由此推出 $f$ 的 Parseval 等式。
>

**解答**
利用三角函数的加法公式与正交性，$F$ 的 Fourier 系数为
$$
A_0=a_0^2,
\qquad A_n=a_n^2+b_n^2,
\qquad B_n=0\quad(n\ge1).
$$
因此
$$
F(x)\sim\frac{a_0^2}{2}
+\sum_{n=1}^{\infty}(a_n^2+b_n^2)\cos nx.
$$
由 Bessel 不等式，$\sum(a_n^2+b_n^2)<\infty$，所以上式绝对且一致收敛。其和函数与 $F$ 有相同的 Fourier 系数，因而就是 $F$。令 $x=0$，得到
$$
\frac1\pi\int_{-\pi}^{\pi}f^2(t)\,dt
=\frac{a_0^2}{2}+\sum_{n=1}^{\infty}(a_n^2+b_n^2),
$$
即 Parseval 等式。

> [!question] 题目 5
> 1. 利用
> $$
> \sum_{k=1}^n\frac{\sin kx}{k}
> =\sum_{k=1}^n\int_0^x\cos kt\,dt
> $$
> 求 $\sum_{n=1}^{\infty}\frac{\sin nx}{n}$ 之和；
> 2. 用类似的方法求 $\sum_{n=1}^{\infty}\frac{\sin(2n-1)x}{2n-1}$ 之和。
>

**解答**
（1）由
$$
\sum_{k=1}^n\frac{\sin kx}{k}
=\int_0^x\sum_{k=1}^n\cos kt\,dt
$$
以及 Dirichlet 核的积分极限，得到
$$
\sum_{n=1}^{\infty}\frac{\sin nx}{n}
=\begin{cases}
\dfrac{\pi-x}{2},&0<x<2\pi,\\
0,&x=0,2\pi,
\end{cases}
$$
并按 $2\pi$ 周期延拓。

（2）从全体正整数项中减去偶数项，
$$
\sum_{n=1}^{\infty}\frac{\sin(2n-1)x}{2n-1}
=\begin{cases}
\dfrac\pi4,&0<x<\pi,\\
-\dfrac\pi4,&\pi<x<2\pi,\\
0,&x=0,\pi,2\pi,
\end{cases}
$$
再按 $2\pi$ 周期延拓。

> [!question] 题目 6
> 从上题的 (1) 所得的结果出发，直接证明下列展开式成立：
> 1.
> $$
> \sum_{k=1}^{\infty}\frac{\sin 2kx}{2k}=\frac{\pi}{4}-\frac{x}{2},\qquad 0<x<\pi;
> $$
> 2.
> $$
> \sum_{k=1}^{\infty}\frac{\sin(2k-1)x}{2k-1}=\frac{\pi}{4},\qquad 0<x<\pi;
> $$
> 3.
> $$
> \sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{n}\sin nx=\frac{x}{2},\qquad |x|<\pi;
> $$
> 4.
> $$
> x^2=\frac{\pi^2}{3}+4\sum_{n=1}^{\infty}\frac{(-1)^n}{n^2}\cos nx,\qquad |x|<\pi;
> $$
> 5.
> $$
> x=\frac{\pi}{2}-\frac{4}{\pi}\sum_{k=1}^{\infty}\frac{\cos(2k-1)x}{(2k-1)^2},\qquad 0\le x\le \pi;
> $$
> 6.
> $$
> \frac{3x^2-6\pi x+2\pi^2}{12}
> =\sum_{n=1}^{\infty}\frac{\cos nx}{n^2},\qquad 0\le x\le \pi.
> $$
>

**解答**
前两式分别由上题（1）中取偶数项及用全体项减去偶数项得到。把上题（1）中的 $x$ 换成 $x+\pi$，便有
$$
\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}n\sin nx=\frac x2,
\qquad |x|<\pi.
$$
对此逐项积分并确定常数项，得到
$$
x^2=\frac{\pi^2}{3}+4\sum_{n=1}^{\infty}\frac{(-1)^n}{n^2}\cos nx.
$$
同理，对奇数正弦级数积分并利用 $\sum_{k\ge1}(2k-1)^{-2}=\pi^2/8$，得
$$
x=\frac\pi2-\frac4\pi\sum_{k=1}^{\infty}
\frac{\cos(2k-1)x}{(2k-1)^2},
\qquad0\le x\le\pi.
$$
对 $\sum\sin nx/n=(\pi-x)/2$ 积分，再由 $\sum n^{-2}=\pi^2/6$ 定出常数，便得
$$
\sum_{n=1}^{\infty}\frac{\cos nx}{n^2}
=\frac{3x^2-6\pi x+2\pi^2}{12},
\qquad0\le x\le\pi.
$$

> [!question] 题目 7
> （Steklov 不等式）设连续函数 $f$ 在 $[0,\pi]$ 上分段可导，且 $f'$ 在 $[0,\pi]$ 上可积和平方可积，证明：只要条件
> $$
> \int_0^\pi f=0
> \qquad\text{和}\qquad
> f(0)=f(\pi)=0
> $$
> 之中有一个满足，就成立不等式
> $$
> \int_0^\pi f'^2(x)\,dx\ge \int_0^\pi f^2(x)\,dx,
> $$
> 且其中等号成立的条件为：在第一种条件下 $f(x)=A\cos x$，在第二种条件下 $f(x)=B\sin x$。
>

**解答**
若 $\int_0^\pi f=0$，取 $f$ 的余弦系数 $a_n$。Parseval 等式与 $f'$ 的 Bessel 不等式给出
$$
\int_0^\pi f^2dx=\frac\pi2\sum_{n=1}^{\infty}a_n^2,
\qquad
\int_0^\pi f'^2dx\ge\frac\pi2\sum_{n=1}^{\infty}n^2a_n^2.
$$
故后一积分不小于前一积分。等号迫使 $a_n=0$（$n\ge2$），于是 $f(x)=A\cos x$；反之显然取等。

若 $f(0)=f(\pi)=0$，改用正弦系数 $b_n$。此时 $f'$ 的余弦系数为 $nb_n$，同样得到
$$
\int_0^\pi f'^2dx\ge\frac\pi2\sum_{n=1}^{\infty}n^2b_n^2
\ge\frac\pi2\sum_{n=1}^{\infty}b_n^2
=\int_0^\pi f^2dx.
$$
等号当且仅当 $f(x)=B\sin x$。

> [!question] 题目 8
> （Wirtinger 不等式）设连续函数 $f$ 在 $[-\pi,\pi]$ 上分段可导，$f(-\pi)=f(\pi)$，且 $f'$ 在 $[-\pi,\pi]$ 上可积和平方可积，又
> $$
> \int_{-\pi}^{\pi}f(x)\,dx=0,
> $$
> 证明：
> $$
> \int_{-\pi}^{\pi}f'^2(x)\,dx\ge \int_{-\pi}^{\pi}f^2(x)\,dx,
> $$
> 且仅当 $f(x)=A\cos x+B\sin x$ 时等号成立。
>

**解答**
由平均值为零，$f$ 的 Fourier 展开中常数项为零。Parseval 等式分别作用于 $f$ 与 $f'$，得到
$$
\int_{-\pi}^{\pi}f^2dx
=\pi\sum_{n=1}^{\infty}(a_n^2+b_n^2),
\quad
\int_{-\pi}^{\pi}f'^2dx
=\pi\sum_{n=1}^{\infty}n^2(a_n^2+b_n^2).
$$
故所求不等式成立。等号等价于 $a_n=b_n=0$（$n\ge2$），即 $f(x)=A\cos x+B\sin x$。

> [!question] 题目 9
> 设周期 $2\pi$ 的函数 $f$ 及其导函数 $f'$ 均分段连续，证明：$f$ 的 Fourier 级数在含有 $f$ 的间断点的任何闭区间上不一致收敛。
>

**解答**
在 $f$ 的间断点 $x_0$，Dirichlet--Jordan 定理表明 Fourier 部分和收敛于 $[f(x_0-)+f(x_0+)]/2$；而在 $x_0$ 两侧的连续点，和函数分别等于 $f$，其左右极限为 $f(x_0-)$、$f(x_0+)$。由于二者不等，Fourier 级数的和函数在 $x_0$ 不连续。若它在含 $x_0$ 的闭区间上一致收敛，则连续的部分和之极限必连续，矛盾。

> [!question] 题目 10
> 证明：
> $$
> \sum_{n=1}^{\infty}\frac{\sin n}{n}
> =\sum_{n=1}^{\infty}\frac{\sin^2 n}{n^2}
> =\frac{\pi-1}{2},
> \qquad
> \sum_{n=1}^{\infty}\frac{\sin^2 n}{n^4}
> =\frac{(\pi-1)^2}{6}.
> $$
>

**解答**
由第 5 题（1）在 $x=1$ 处代入，
$$
\sum_{n=1}^{\infty}\frac{\sin n}{n}=\frac{\pi-1}{2}.
$$
又因
$$
\sum_{n=1}^{\infty}\frac{\cos nx}{n^2}
=\frac{\pi^2}{6}-\frac{\pi x}{2}+\frac{x^2}{4},
\qquad0\le x\le2\pi,
$$
令 $x=2$ 并用 $\sin^2n=(1-\cos2n)/2$，可得第二个等式。再对上式积分两次，或直接由 Fourier 系数计算，得到
$$
\sum_{n=1}^{\infty}\frac{\cos nx}{n^4}
=\frac{\pi^4}{90}-\frac{\pi^2x^2}{12}
+\frac{\pi x^3}{12}-\frac{x^4}{48}.
$$
令 $x=2$，便有
$$
\sum_{n=1}^{\infty}\frac{\sin^2n}{n^4}
=\frac12\sum_{n=1}^{\infty}\frac{1-\cos2n}{n^4}
=\frac{(\pi-1)^2}{6}.
$$

> [!question] 题目 11
> 设函数 $f$ 是以 $2\pi$ 为周期的连续函数，不恒等于 0，且
> $$
> \int_{-\pi}^{\pi}f(x)\sin kx\,dx
> =\int_{-\pi}^{\pi}f(x)\cos kx\,dx=0,\qquad k=0,1,\cdots,n.
> $$
> 证明：$f$ 在任何长度大于 $2\pi$ 的区间上至少改变符号 $2n+2$ 次。
>

**解答**
一个周期内的变号次数必为偶数。反设至多为 $2m\le2n$，记变号点为 $x_1,\ldots,x_{2m}$。三角多项式
$$
P(x)=\pm\prod_{j=1}^{2m}\sin\frac{x-x_j}{2}
$$
的次数为 $m$，可选取正负号使 $f(x)P(x)\ge0$，且该乘积不恒为零。因此 $\int_{-\pi}^{\pi}fP>0$。但 $P$ 是次数不超过 $n$ 的三角多项式，题设正交条件又给出 $\int fP=0$，矛盾。故每个周期至少变号 $2n+2$ 次；任何长度大于 $2\pi$ 的区间都含有一个完整周期，结论随即成立。

> [!question] 题目 12
> 设 $f$ 是在区间 $[0,+\infty)$ 上的单调函数，且 $f(+\infty)=0$，证明：
> $$
> \lim_{n\to\infty}\int_0^{+\infty}f(x)\sin nx\,dx=0.
> $$
>

**解答**
单调且趋于零的 $f$ 在半轴上有界，并且由积分第二中值定理或 Dirichlet 判别法，
$$
\left|\int_0^{\infty}f(x)\sin nx\,dx\right|
\le\frac{2|f(0)|}{n}.
$$
右端趋于零，故所求极限为零。若 $f$ 单调增加趋于零，对 $-f$ 使用同一估计即可。

> [!question] 题目 13
> 设
> $$
> f(x)=\sum_{n=1}^{\infty}n^2e^{-n}\sin nx,
> $$
> 证明：
> $$
> \max_{0\le x\le 2\pi}\{|f(x)|\}\ge \frac{2}{\pi e}.
> $$
>

**解答**
该级数绝对一致收敛，所以它就是 $f$ 的 Fourier 级数，且第一正弦系数为 $b_1=e^{-1}$。若 $M=\max_{[0,2\pi]}|f|$，则
$$
\frac1e=|b_1|
\le\frac{M}{\pi}\int_{-\pi}^{\pi}|\sin x|\,dx
=\frac{4M}{\pi}.
$$
故 $M\ge\pi/(4e)>2/(\pi e)$。

> [!question] 题目 14
> 对于收敛于 0 的给定正数数列 $\{\varepsilon_n\}$，证明：存在连续函数 $f$，使得 $f$ 的 Fourier 系数 $\{a_n\},\{b_n\}$ 对于无限多个 $n$ 满足不等式
> $$
> |a_n|+|b_n|>\varepsilon_n.
> $$
>

**解答**
选取严格增加的整数列 $n_k$，使 $\varepsilon_{n_k}<2^{-k}$。级数
$$
f(x)=\sum_{k=1}^{\infty}2^{-k}\cos n_kx
$$
绝对一致收敛，故 $f$ 连续。其 Fourier 系数满足 $a_{n_k}=2^{-k}$、$b_{n_k}=0$，于是对所有 $k$ 都有 $|a_{n_k}|+|b_{n_k}|>\varepsilon_{n_k}$。

> [!question] 题目 15
> 设 $f\in C[-\pi,\pi]$，且其导函数 $f'$ 可积和绝对可积，若有
> $$
> f(x)\sim \frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx),
> $$
> 证明：
> $$
> f'(x)\sim \frac{c}{2}+\sum_{n=1}^{\infty}\{[nb_n+(-1)^nc]\cos nx-na_n\sin nx\},
> $$
> 其中
> $$
> c=\frac{f(\pi)-f(-\pi)}{\pi},
> \qquad
> c=\lim_{n\to\infty}(-1)^{n-1}nb_n.
> $$
>

**解答**
对 $f'$ 计算 Fourier 系数。常数项为
$$
\frac1\pi\int_{-\pi}^{\pi}f'(x)\,dx=c.
$$
分部积分得
$$
A_n=nb_n+(-1)^nc,
\qquad B_n=-na_n,
$$
从而得到题中的形式。由 Riemann 引理 $A_n\to0$，故
$$
(-1)^{n-1}nb_n=c+(-1)^{n-1}A_n\longrightarrow c.
$$

> [!question] 题目 16
> 设三角级数
> $$
> \frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx)
> $$
> 有极限
> $$
> c=\lim_{n\to\infty}\{(-1)^{n-1}nb_n\},
> $$
> 又有可积和绝对可积函数 $\varphi$ 满足条件
> $$
> \varphi(x)\sim \frac{c}{2}+\sum_{n=1}^{\infty}\{[nb_n+(-1)^nc]\cos nx-na_n\sin nx\}.
> $$
> 证明：上述三角级数处处收敛，为其和函数 $f$ 的 Fourier 级数：
> $$
> f(x)=\frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx),
> $$
> 且在 $\varphi$ 的连续点上成立 $f'(x)=\varphi(x)$。
>

**解答**
令
$$
F(x)=K+\int_{-\pi}^x\varphi(t)\,dt,
$$
其中 $K$ 取成使 $F$ 的平均值为 $a_0/2$。因 $\varphi$ 的常数 Fourier 系数为 $c$，有 $F(\pi)-F(-\pi)=\pi c$。将上题的分部积分公式反向使用可知，$F$ 的 Fourier 系数恰为 $a_0,a_n,b_n$。

函数 $F$ 绝对连续，因而有界变差。把它作周期延拓，Dirichlet--Jordan 定理说明其 Fourier 级数在 $(-\pi,\pi)$ 上处处收敛于 $F$，在端点收敛于 $[F(-\pi)+F(\pi)]/2$。这正是题给三角级数，故它处处收敛，且为其和函数 $f$ 的 Fourier 级数。又在 $\varphi$ 的每个连续点，积分上限函数的求导公式给出 $F'=\varphi$，从而 $f'=\varphi$。

> [!question] 题目 17
> 利用上题证明：三角级数
> $$
> \sum_{n=1}^{\infty}\frac{(-1)^n n\sin nx}{n^2-1}
> $$
> 是某个连续可微函数 $f$ 的 Fourier 级数，且 $f$ 满足微分方程
> $$
> f''+f=-\sin x,
> $$
> 并求出 $f$。
>

**解答**
题面在 $n=1$ 时分母为零，故应将级数理解为从 $n=2$ 起求和，即约定第一正弦系数为零。令
$$
f(x)=\frac{x\cos x}{2}+\frac{\sin x}{4},
\qquad -\pi<x<\pi.
$$
直接积分可得 $b_1=0$，并且对 $n\ge2$，
$$
\frac1\pi\int_{-\pi}^{\pi}f(x)\sin nx\,dx
=\frac{(-1)^nn}{n^2-1};
$$
所有余弦系数均为零。因此题中级数正是 $f$ 的 Fourier 级数。直接求导又有
$$
f''(x)+f(x)=-\sin x.
$$

> [!question] 题目 18
> 证明：在区间 $[a,b]$ 上的可积和平方可积函数空间中，由有限个函数组成的正交系不可能是完备的。
>

**解答**
设正交系为 $e_1,\ldots,e_m$。在 $m+1$ 维空间 $\operatorname{span}\{1,x,\ldots,x^m\}$ 中，齐次线性方程组
$$
\int_a^bp(x)e_j(x)\,dx=0,
\qquad j=1,\ldots,m,
$$
至少有一个非零解 $p$。于是非零平方可积函数 $p$ 与全部 $e_j$ 正交，故该有限正交系不可能完备。

> [!question] 题目 19
> （de la Vallée Poussin 核）设 $f$ 是以 $2\pi$ 为周期的连续函数，记
> $$
> V_n(x)=\frac{(2n)!!}{2\pi(2n-1)!!}\int_{-\pi}^{\pi}f(t)\left(\cos\frac{t-x}{2}\right)^{2n}\,dt.
> $$
> 证明：
> 1. $V_n(x)$ 是 $n$ 次三角多项式；
> 2. 函数列 $\{V_n\}$ 在 $(-\infty,+\infty)$ 上一致收敛于 $f$。
>

**解答**
由二项式公式，
$$
\left(\cos\frac u2\right)^{2n}
=2^{-2n}\left[\binom{2n}{n}
+2\sum_{k=1}^n\binom{2n}{n-k}\cos ku\right].
$$
将 $u=t-x$ 代入并对 $t$ 积分，可知 $V_n$ 是次数不超过 $n$ 的三角多项式。又有
$$
\int_{-\pi}^{\pi}\left(\cos\frac{t-x}{2}\right)^{2n}dt
=2\pi\frac{(2n-1)!!}{(2n)!!},
$$
所以核的积分为 $1$ 且处处非负。

给定 $\varepsilon>0$，由 $f$ 的一致连续性取 $\delta>0$，使周期距离 $|t-x|<\delta$ 时 $|f(t)-f(x)|<\varepsilon$。近区间的误差不超过 $\varepsilon$；远区间上存在 $q<1$ 使 $|\cos((t-x)/2)|\le q$，而 $(2n)!!/(2n-1)!!=O(\sqrt n)$，故远区间的误差为 $O(\sqrt n\,q^{2n})\to0$。于是 $V_n\to f$ 一致收敛。

> [!question] 题目 20
> 证明：三角级数
> $$
> \cos x+\frac{\cos 2x}{2}+\cdots+\frac{\cos nx}{n}+\cdots
> $$
> 的部分和函数 $S_n(x)\ge -1$，并且
> $$
> \lim_{n\to\infty}\min_{0\le x\le \pi}\{S_n(x)\}=-\ln 2.
> $$
>

**解答**
记 $S_n(x)=\sum_{k=1}^n\cos kx/k$。在 $0<x<2\pi$，
$$
S_n'(x)=-\sum_{k=1}^n\sin kx
=-\frac{\sin(nx/2)\sin((n+1)x/2)}{\sin(x/2)}.
$$
考察导数在这些零点两侧的符号可知，内部极小点只能是 $x=2\pi j/(n+1)$；$n=1$ 时结论直接成立。对 $n\ge2$，在这样的点令 $z=e^{ix}$、$c=\cos x$，则 $z^{n+1}=1$，从而
$$
S_n(x)=\operatorname{Re}\int_0^1\sum_{k=1}^nz^kt^{k-1}dt
=\operatorname{Re}\int_0^1\frac{z-t^n}{1-tz}\,dt.
$$
于是
$$
1+S_n(x)=\int_0^1\frac{A(t)+cB(t)}{1-2ct+t^2}\,dt,
$$
其中 $A=1-t+t^2-t^n$，$B=1-2t+t^{n+1}$。对 $0\le t\le1$，
$$
A-B=(1+t)(t-t^n)\ge0,
\qquad
A+B=(1-t)^2(2+t+\cdots+t^{n-1})\ge0,
$$
故 $A\ge|B|$，进而 $A+cB\ge0$。端点 $x=0,2\pi$ 处 $S_n=\sum1/k>0$，所以处处有 $S_n(x)\ge-1$。

再记 $m_n=\min_{0\le x\le\pi}S_n(x)$。因 $m_n\le S_n(\pi)\to-\ln2$，只需估计下极限。若 $x_j\to0$、$n_j\to\infty$，取 $r_j=\min(n_j,\lfloor1/x_j\rfloor)$。前 $r_j$ 项满足 $\cos(kx_j)\ge\cos1$，而其余项由 Dirichlet 估计有
$$
\left|\sum_{k=r_j+1}^{n_j}\frac{\cos(kx_j)}k\right|
\le\frac{C}{r_j\sin(x_j/2)}=O(1).
$$
故 $S_{n_j}(x_j)\to+\infty$。因此极小点不会趋于 $0$。在任意 $[\delta,\pi]$ 上，$S_n$ 一致收敛于
$$
-\ln\left(2\sin\frac x2\right),
$$
该函数的最小值为 $-\ln2$，在 $x=\pi$ 取得。于是 $\liminf m_n\ge-\ln2$，结合前面的上界即得
$$
\lim_{n\to\infty}m_n=-\ln2.
$$
