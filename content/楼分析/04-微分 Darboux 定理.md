---
chapter: 4
title: "04-微分 Darboux 定理"
type: 讲义
source: 数学分析技巧选讲
depends_on: []
tags:
  - 楼分析
---

# 04-微分 Darboux 定理

## 依赖于
- 无显式依赖

## 被以下题目直接调用
- [[05-微分算子 D]]
- [[06-线性方程组]]

利用微分 Darboux 定理并引入比较定理的思想可以给我们独特而深刻的视角，尤其在讨论微分中值定理类问题时，不仅可提供解决此类问题的统一方法，提高学习效率，更可提高认识，与后继课程紧密联结.

首先, 我们介绍 Darboux 定理.

### 定理 4.1

设实函数 f 在 $[a,b]$ 上处处可导, $f'(a) < \lambda < f'(b)$ , 则存在 $\xi \in (a,b)$ 使得 $f'(\xi) = \lambda$ .

**证明**
令
$$
F (x) = f (x) - \lambda x, \quad x \in [ a, b ].
$$
则
$$
F ^ {\prime} (a) = f ^ {\prime} (a) - \lambda <   0, \quad F ^ {\prime} (b) = f ^ {\prime} (b) - \lambda > 0.
$$
由于
$$
\lim _ {x \to a ^ {+}} \frac {F (x) - F (a)}{x - a} = F ^ {\prime} (a) <   0.
$$
所以存在 $\delta > 0$ 使得当 $x \in (a, a + \delta)$ 时, $F(x) - F(a) < 0$ . 因此 $a$ 不是 $F$ 在 $[a, b]$ 上的最小值点. 同理可证 $b$ 不是 $F$ 在 $[a, b]$ 上的最小值点.

另一方面, 由于 $F$ 连续, 它在 $[a, b]$ 上有最小值, 设 $\xi \in [a, b]$ 是一个最小值点, 则 $\xi \in (a, b)$ , 从而它是极小值点. 于是 $F'(\xi) = 0$ . 亦即 $f'(\xi) = \lambda$ .

Darboux 定理表明, 区间上处处可导的函数, 其导函数具有介值性 $^{(1)}$ . 该定理的一个直接推论是, 若 f 在某区间上处处可导且导数不为零, 则 $f'$ 在该区间恒正或恒负.

我们将会看到, Darboux 定理使得我们在讨论微分中值定理类问题时, 通常只需要假设最高阶导数处处存在, 而不必假设其连续. 除了 Darboux 定理, 本节例题主要还基于利用微分不等式估计函数值大小的思想. 特别地, 其中一些例题并不一定都需要用到 Darboux 定理.

易见, 若 $f$ 在 $[a, b]$ 上可导, $g$ 在 $[a, b]$ 上连续可导, 则由
$$
\left[ f (x) g (x) - \int f (x) g ^ {\prime} (x) \mathrm{d} x \right] ^ {\prime} = f ^ {\prime} (x) g (x)
$$
可见 $f^{\prime}g$ 在 $[a,b]$ 上具有介值性. 进一步, 以上条件中 $g$ 连续可导的条件可以减弱为 $g$ 连续 (参见[[#例 4.16|例4.16]]).

### 例 4.1

> [!question] 例 4.1
> 设 f 在无穷区间 $(a, +\infty)$ 内二次可微, 且 $\lim_{x \to a^{+}} f(x) = \lim_{x \to +\infty} f(x)$ 存在. 证明: 存在 $\xi, \eta \in (a, +\infty)$ 使得 $f'(\xi) = f''(\eta) = 0$ .

**证明**
我们可以寻找两个不同的点 $x_{1}, x_{2}$ 使得 $f(x_{1}) = f(x_{2})$ 来证明 $\xi$ 的存在性. 现在我们用 Darboux 定理来证明.

1.  若 $\forall x \in (a, +\infty)$ , $f'(x) \neq 0$ , 则由 Darboux 定理, $f'$ 恒正或恒负. 不妨设 $f'$ 恒正, 则 $f$ 严格单增. 所以
$$
f (x) > f (a + 2) > f (a + 1) > f (y), \quad \forall x > a + 2, y \in (a, a + 1).
$$
于是
$$
\lim _ {x \to + \infty} f (x) \geqslant f (a + 2) > f (a + 1) \geqslant \lim _ {x \to a ^ {+}} f (x).
$$
这与假设矛盾. 所以必然存在 $\xi \in (a, +\infty)$ 使得 $f'(\xi) = 0$ .

2.  证明 $\eta$ 的存在性. 我们仍用反证法. 若对任何 $x \in (a, +\infty)$ , $f''(x) \neq 0$ , 则 $f''$ 恒正或恒负. 类似地, 不妨设 $f''$ 恒正. 于是任取 $x_0 > \xi$ , 我们有
$$
f ^ {\prime} (x) > f ^ {\prime} (x _ {0}) > f ^ {\prime} (\xi) = 0, \quad \forall x > x _ {0}.
$$
所以
$$
f (x) \geqslant f (x _ {0}) + f ^ {\prime} (x _ {0}) (x - x _ {0}), \quad \forall x > x _ {0}.
$$
从而
$$
\lim _ {x \rightarrow + \infty} f (x) = + \infty > \lim _ {x \rightarrow a ^ {+}} f (x).
$$
与假设矛盾. 因此必然存在 $\eta \in (a, +\infty)$ 使得 $f''(\eta) = 0$ .

易见, 利用上例的思想很容易推出如下结果: 若 $f \in C[0, +\infty) \cap C^{\infty}(0, +\infty)$ , $f(0) = f(+\infty)$ , 则对任何 $k \geqslant 1$ , $f^{(k)}$ 有零点. 进一步, 若在上述条件下 $f$ 不恒为常数, 则 $f^{(k)}$ 必发生变号.

### 例 4.2

> [!question] 例 4.2
> 设 f 是 $[a, +\infty)$ 上可微的有界函数, $|f'|$ 单调. 证明:
> $$
> \lim_{x \to +\infty} x f'(x) = 0
> $$

**证明**
由 Darboux 定理可知 $|f'|$ 的单调性蕴涵着 $f'$ 的保号性. 不妨设 $f'$ 非负, 此时 $f'$ 必然单调减少. 否则 $f'$ 单调增加, 且有 $x_2 > x_1 \geqslant a$ 使得 $f'(x_2) >$

$f^{\prime}(x_{1})\geqslant 0.$ 则由中值定理，当 $x > x_{2}$ 时，
$$
f (x) - f \left(x _ {2}\right) = f ^ {\prime} \left[ x _ {2} + \theta \left(x - x _ {2}\right) \right] \left(x - x _ {2}\right) \geqslant f ^ {\prime} \left(x _ {2}\right) \left(x - x _ {2}\right),
$$
其中 $\theta \in (0,1)$ 与 $x$ 有关. 从而 $\lim_{x\to +\infty}f(x) = +\infty$ . 这与假设矛盾. 于是 $f^{\prime}$ 非负且单调减少. 由中值定理,
$$
2 \left[ f (x) - f \left(\frac {x}{2}\right) \right] = f ^ {\prime} \left(\frac {x}{2} + \alpha \frac {x}{2}\right) x \geqslant f ^ {\prime} (x) x \geqslant 0,
$$
其中 $\alpha \in (0,1)$ 为与 $x$ 有关的一个数. 由于 $f$ 有界, 而由 $f'$ 非负知 $f$ 单调增加, 所以 $\lim_{x\to +\infty}f(x)$ 存在. 于是由夹逼准则得 $\lim_{x\to +\infty}xf'(x) = 0.$

**注 4.1** ^zhu-4-1
事实上, 易见 $f'$ 的单调性蕴涵 $f'$ 的连续性.

### 例 4.3

> [!question] 例 4.3
> 设 f 在区间 $[-1,1]$ 上连续，在 $(-1,1)$ 内三阶可导．证明：存在 $\xi\in(-1,1)$ 使得 $f'''(\xi)=3[f(1)-f(-1)-2f'(0)]$ .

**证明**
记 $k = 3[f(1) - f(-1) - 2f'(0)]$ . 若结论不真, 由 Darboux 定理, $f'''(x) - k$ 在 $(-1,1)$ 内恒正或恒负. 不妨设它恒正, 则 $f'(x) - \frac{kx^2}{2}$ 在 $(-1,1)$ 上为严格凸函数. 因此, 注意到凸函数曲线在切线之上的性质, 可得 $f'(x) - \frac{kx^2}{2} \geqslant f'(0) + f''(0)x (x \in (-1,1))$ , 且等号仅在 $x = 0$ 时成立. 从而
$$
h (x) := f (x) - \frac {k x ^ {3}}{6} - f ^ {\prime} (0) x - \frac {f ^ {\prime \prime} (0) x ^ {2}}{2}
$$
在 $[-1, 1]$ 上严格单调. 这与 $h(1) = h(-1)$ 矛盾.

**注 4.2** ^zhu-4-2
需要指出的是, 若例中的结论是正确的, 则按此证明过程必然导出矛盾. 否则, 我们就有余地通过与证明过程相反的步骤构造出反例.

### 例 4.4

> [!question] 例 4.4
> 设函数 $f$ 在 $[a, b]$ 上连续，在 $(a, b)$ 内可导， $ab > 0$ 。证明：存在 $\xi \in (a, b)$ 使得
> $$
> \frac {1}{a - b} \left| \begin{array}{c c} a & b \\ f (a) & f (b) \end{array} \right| = f (\xi) - \xi f ^ {\prime} (\xi).
> $$
**证明**
记
$$
k = \frac {1}{a - b} \left| \begin{array}{c c} a & b \\ f (a) & f (b) \end{array} \right|.
$$
考虑
$$
F (x) := 2 \int_ {a} ^ {x} f (t) \mathrm{d} t - x f (x) - k x.
$$
则 $F$ 在 $[a, b]$ 上连续, 在 $(a, b)$ 内可导, 且 $F'(x) = f(x) - xf'(x) - k$ . 若本例的结论不真, 则由 Darboux 定理, $F'$ 在 $(a, b)$ 内恒正或恒负. 不妨设 $F'$ 恒正. 则
$$
\left[ \frac {f (x) - k}{x} \right] ^ {\prime} = \frac {x f ^ {\prime} (x) - f (x) + k}{x ^ {2}} <   0, \quad \forall x \in (a, b).
$$
所以 $x \mapsto \frac{f(x) - k}{x}$ 在 $[a, b]$ 上严格单减. 这与 $\frac{f(b) - k}{b} = \frac{f(a) - k}{a}$ 矛盾. 结论得证.

### 例 4.5

> [!question] 例 4.5
> 设 f 在 $[a, b]$ 上可微, $f'(a) = f'(b)$ . 证明: 存在 $\xi \in (a, b)$ 使得
> $$
> f ^ {\prime} (\xi) = \frac {f (\xi) - f (a)}{\xi - a}.
> $$
**证明**
不妨设 $a = 0, f(a) = 0$ . 若结论不真, 则由 Darboux 定理, 成立
$$
f ^ {\prime} (x) > \frac {f (x)}{x}, \quad \forall x \in (0, b) \tag {4.1}
$$
或
$$
f ^ {\prime} (x) <   \frac {f (x)}{x}, \quad \forall x \in (0, b). \tag {4.2}
$$
不妨设 (4.1) 式成立, 则
$$
\left[ \frac {f (x)}{x} \right] ^ {\prime} = \frac {x f ^ {\prime} (x) - f (x)}{x ^ {2}} > 0, \quad \forall x \in (0, b).
$$
从而取 $0 < \alpha < \beta < b$ , 对于任何 $x \in (0, \alpha), y \in (\beta, b)$
$$
\frac {f (x)}{x} <   \frac {f (\alpha)}{\alpha} <   \frac {f (\beta)}{\beta} <   \frac {f (y)}{y} <   f ^ {\prime} (y)
$$
成立. 上式中令 $x \to 0^{+}$ 得到
$$
f ^ {\prime} (0) \leqslant \frac {f (\alpha)}{\alpha} <   \frac {f (\beta)}{\beta} <   f ^ {\prime} (y).
$$
再令 $y \to b^{-}$ 得到 (这里利用了 Darboux 定理)
$$
f ^ {\prime} (0) \leqslant \frac {f (\alpha)}{\alpha} <   \frac {f (\beta)}{\beta} \leqslant \varliminf_ {y \rightarrow b ^ {-}} f ^ {\prime} (y) \leqslant f ^ {\prime} (b).
$$
矛盾. 因此, 本例的结论成立.

$$
\square
$$

**注 4.3** ^zhu-4-3
当 f 在 $(a,b]$ 可导时, $f'$ 在 $[a,b]$ 不一定连续, 但利用 Darboux 定理, 我们有
$$
\varliminf_ {x \to b ^ {-}} f ^ {\prime} (x) \leqslant f ^ {\prime} (b) \leqslant \varlimsup_ {x \to b ^ {-}} f ^ {\prime} (x).
$$
进一步, 若 $f'$ 在 $(a, b)$ 内单调, 则
$$
\lim _ {x \to b ^ {-}} f ^ {\prime} (x) = f ^ {\prime} (b).
$$
### 例 4.6

> [!question] 例 4.6
> 设 f 在 $[a, b]$ 上连续，在 $(a, b)$ 内可导. 证明:
>
> 1.  存在不同的 $\xi, \eta \in (a, b)$ 使得 $(\mathrm{e}^b - \mathrm{e}^a)f'(\eta) = (b - a)\mathrm{e}^\eta f'(\xi)$ .
>
> 2.  若 $a > 0$ , 则存在不同的 $\xi, \eta \in (a, b)$ 使得 $f'(\xi) = \frac{\eta^2 f'(\eta)}{ab}$ .

**证明**
首先我们引入函数 $H$ 以及 $\xi_0 \in (a, b)$ .

在 (1) 中, 令 $H(x) = \frac{\mathrm{e}^b - \mathrm{e}^a}{\mathrm{e}^x(b - a)}$ , 则根据中值定理, 存在 $\xi_0 \in (a, b)$ 使得 $\frac{\mathrm{e}^b - \mathrm{e}^a}{b - a} = \mathrm{e}^{\xi_0}$ , 从而 $H(\xi_0) = 1$ .

在 (2) 中, 令 $H(x) = \frac{x^2}{ab}$ , $\xi_0 = \sqrt{ab}$ , 此时 $H(\xi_0) = 1$ .

以上讨论表明, 若不要求 $\xi \neq \eta$ , 则取 $\xi = \eta = \xi_0$ , 即得例题要证的结论. 换言之, 此时结论是平凡的.

以下用统一的方法分情形证明这两个小题. 易见 $H$ 在 $[a, b]$ 上恒正, 严格单调且连续可导, 进一步有 $\int_{a}^{b} \frac{1}{H(x)} \mathrm{d}x = b - a$ . 我们要证存在不同的 $\xi, \eta \in (a, b)$ 使得 $f'(\xi) = H(\eta)f'(\eta)$ . 记 $\gamma = f'(\xi_0)$ . 请读者注意, 我们有 $f'(\xi_0) = H(\xi_0)f'(\xi_0) = \gamma$ .

由 $H$ 的连续可导性易得 $Hf'$ 具有介值性. 因此, 在以下情形中, 除去情形 I, $f'$ 和 $Hf'$ 均在 $(a, \xi_0)$ 和 $(\xi_0, b)$ 内分别恒大于 $\gamma$ 或恒小于 $\gamma$ .

情形 I 存在 $\xi_{1}\in(a,b)$ 使得 $\xi_{1}\neq\xi_{0}$ ，且下列情形之一成立：
$$
\text { I.1: } f ^ {\prime} (\xi_ {1}) = \gamma ; \quad \text { I.2: } H (\xi_ {1}) f ^ {\prime} (\xi_ {1}) = \gamma .
$$
对情形 I.1, 有 $f'(\xi_1) = H(\xi_0)f'(\xi_0)$ . 取 $\xi = \xi_1, \eta = \xi_0$ 即得结论.

对情形 I.2, 有 $f'(\xi_0) = H(\xi_1)f'(\xi_1)$ . 取 $\xi = \xi_0, \eta = \xi_1$ 即得结论.

情形II 下列情形之一成立:
$$
\text {   II.1:   } f ^ {\prime} (x) > \gamma (\forall x \in (a, \xi_ {0})), \quad H (x) f ^ {\prime} (x) > \gamma (\forall x \in (\xi_ {0}, b));
$$
$$
\text { II.2: } f ^ {\prime} (x) <   \gamma (\forall x \in (a, \xi_ {0})), H (x) f ^ {\prime} (x) <   \gamma (\forall x \in (\xi_ {0}, b));
$$
$$
\text { I   I   .   3   : } H (x) f ^ {\prime} (x) > \gamma (\forall x \in (a, \xi_ {0})), \quad f ^ {\prime} (x) > \gamma (\forall x \in (\xi_ {0}, b));
$$
$$
\text { I   I   .   4   : } H (x) f ^ {\prime} (x) <   \gamma (\forall x \in (a, \xi_ {0})), \quad f ^ {\prime} (x) <   \gamma (\forall x \in (\xi_ {0}, b));
$$
此时, 以II.1为例 (见图4.1), 任取 $x_{1} \in (a, \xi_{0})$ 以及 $x_{2} \in (\xi_{0}, b)$, 则

$$
\gamma = f'(\xi_{0}) < f^{\prime}(x_{1}),\quad \gamma = H(\xi_{0})f^{\prime}(\xi_{0}) < H(x_{2})f^{\prime}(x_{2}).
$$

任取 $\gamma < \alpha < \min \{f^{\prime}(x_{1}),H(x_{2})f^{\prime}(x_{2})\}$, 由介值性，存在 $\xi \in (x_1,\xi_0)$ 以及 $\eta \in (\xi_0,x_2)$ 使得 $f^{\prime}(\xi) = \alpha = H(\eta)f^{\prime}(\eta).$

![[assets/images/楼分析/figure-4-1.png]]

*图4.1*

情形III 下列情形之一成立:

III.1: $\forall x\in (a,b),x\neq \xi_0,f'(x) > \gamma ,H(x)f'(x) <   \gamma ;$

III.2: $\forall x\in (a,b),x\neq \xi_0,f'(x) <   \gamma ,H(x)f'(x) > \gamma ;$

此时, 以III.1为例 (见图4.2), $\forall x \in (a, b), x \neq \xi_0$ , 有 $\gamma < f'(x) < \frac{\gamma}{H(x)}$ . 积分得到 $\gamma(b - a) < f(b) - f(a) < \gamma(b - a)$ . 得到矛盾. 因此, 这种情形不会发生.

![[assets/images/楼分析/figure-4-2.png]]

*图4.2*

情形IV 下列情形之一成立:

IV.1: $\forall x\in (a,\xi_0),f'(x) > \gamma ,H(x)f'(x) > \gamma ;$
$$
\forall x \in (\xi_ {0}, b), f ^ {\prime} (x) <   \gamma , H (x) f ^ {\prime} (x) <   \gamma ;
$$
IV.2: $\forall x\in (a,\xi_0),f'(x) <   \gamma ,H(x)f'(x) <   \gamma ;$
$$
\forall x \in (\xi_ {0}, b), f ^ {\prime} (x) > \gamma , H (x) f ^ {\prime} (x) > \gamma ;
$$
![[assets/images/楼分析/figure-4-3.png]]

*图4.3*

此时, 以IV.1为例 (见图4.3), 若 $f'$ 在 $(a, b)$ 内至少有两个零点, 则结论自然成立. 若

$f'$ 在 $(a, b)$ 内至多只有一个零点, 则存在 $\xi_1 \in (a, \xi_0)$ 使得 $f'(\xi_1) \neq 0$ . 由于 $H$ 严格单调, 因此 $H(\xi_1) \neq H(\xi_0) = 1$ . 从而 $H(\xi_1)f'(\xi_1) \neq f'(\xi_1)$ . 若 $H(\xi_1)f'(\xi_1) > f'(\xi_1)$ , 则由于 $f'(\xi_1) > \gamma = H(\xi_0)f'(\xi_0)$ , 有 $\eta \in (\xi_1, \xi_0)$ 使得 $H(\eta)f'(\eta) = f'(\xi_1)$ . 取 $\xi = \xi_1$ 即得结论. 类似地, 若 $H(\xi_1)f'(\xi_1) < f'(\xi_1)$ , 可取 $\eta = \xi_1$ 且找到 $\xi \neq \eta$ 使得 $H(\eta)f'(\eta) = f'(\xi)$ .

### 例 4.7

> [!question] 例 4.7
> 设 $f$ 在 $[0,1]$ 上连续，在 $(0,1)$ 内可导， $f(0) = 0, f(1) = 1$ 。证明存在两两不同的 $\alpha, \beta, \gamma \in (0,1)$ 使得
> $$
> \frac {1}{f ^ {\prime} (\alpha)} + \frac {1}{f ^ {\prime} (\beta)} + \frac {1}{f ^ {\prime} (\gamma)} = 3.
> $$
**证明**
由中值定理, 存在 $\alpha \in (0,1)$ 使得 $f'(\alpha) = \frac{f(1) - f(0)}{1 - 0} = 1$ .

情形 I $f(\alpha) = \alpha$ . 则由中值定理, 存在 $\beta \in (0, \alpha)$ , $\gamma \in (\alpha, 1)$ 使得
$$
f ^ {\prime} (\beta) = \frac {f (\alpha) - f (0)}{\alpha - 0} = 1, \quad f ^ {\prime} (\gamma) = \frac {f (1) - f (\alpha)}{1 - \alpha} = 1.
$$
此时结论成立.

情形II $f(\alpha) < \alpha$ . 则存在 $\eta \in (0, \alpha)$ , $\zeta \in (\alpha, 1)$ 使得
$$
f ^ {\prime} (\eta) = \frac {f (\alpha) - f (0)}{\alpha - 0} <   1, \quad f ^ {\prime} (\zeta) = \frac {f (1) - f (\alpha)}{1 - \alpha} > 1.
$$
于是有 $\varepsilon > 0$ 使得
$$
f ^ {\prime} (\eta) <   \frac {1}{1 + \varepsilon} <   1 <   \frac {1}{1 - \varepsilon} <   f ^ {\prime} (\zeta).
$$
由 Darboux 定理, 存在 $\beta \in (\eta, \alpha)$ 以及 $\gamma \in (\alpha, \zeta)$ 使得
$$
f ^ {\prime} (\beta) = \frac {1}{1 + \varepsilon}, \quad f ^ {\prime} (\gamma) = \frac {1}{1 - \varepsilon}.
$$
立即得到此时结论也成立.

情形III $f(\alpha) > \alpha$ . 类似于情形II可证.

### 例 4.8

> [!question] 例 4.8
> 设 $\mu > 0$ , f 在 $[a, b]$ 上连续, 在 $(a, b)$ 内可导, $c \in (a, b)$ 且 $f'(c) = 0$ . 求证: 存在 $\xi \in (a, b)$ 使得 $f'(\xi) = \mu[f(\xi) - f(a)]$ .

**证明**
由于
$$
\left\{f (x) - \int_ {a} ^ {x} \mu [ f (t) - f (a) ] \mathrm{d} t \right\} ^ {\prime} = f ^ {\prime} (x) - \mu [ f (x) - f (a) ],
$$
因此由 Darboux 定理, $f' - \mu [f - f(a)]$ 在 $(a, b)$ 内满足介值性.

于是若结论不成立, 则 $f' - \mu[f - f(a)]$ 在 $(a, b)$ 内恒正或恒负. 不妨设
$$
f ^ {\prime} (x) - \mu [ f (x) - f (a) ] > 0, \quad \forall x \in (a, b). \tag {4.3}
$$
则
$$
\{\mathrm{e} ^ {- \mu x} [ f (x) - f (a) ] \} ^ {\prime} = \mathrm{e} ^ {- \mu x} \{f ^ {\prime} (x) - \mu [ f (x) - f (a) ] \} > 0, \quad \forall x \in (a, b).
$$
所以
$$
\mathrm{e} ^ {- \mu x} [ f (x) - f (a) ] > \mathrm{e} ^ {- \mu a} [ f (a) - f (a) ] = 0, \quad \forall x \in (a, b ],
$$
即
$$
f (x) - f (a) > 0, \quad \forall x \in (a, b ].
$$
于是, 由 (4.3) 式, 有
$$
f ^ {\prime} (c) > \mu [ f (c) - f (a) ] > 0.
$$
与 $f'(c)=0$ 矛盾. 证毕.

### 例 4.9

> [!question] 例 4.9
> 设 f 在 $[a,b]$ 上可微, 在 $(a,b)$ 内二阶可导. 证明: 存在 $\xi\in(a,b)$ 使得
> $$
> f ^ {\prime} (b) - f ^ {\prime} (a) = f ^ {\prime \prime} (\xi) (b - a).
> $$
**证明**
本题的困难在于 $f'$ 在 $a, b$ 两点不一定连续, 因此不能直接用中值定理得到结论.

记 $\ell = \frac{f'(b) - f'(a)}{b - a}$ . 若结论不真, 则由 Darboux 定理, 成立
$$
f ^ {\prime \prime} (x) > \ell , \quad \forall x \in (a, b) \tag {4.4}
$$
或
$$
f ^ {\prime \prime} (x) <   \ell , \quad \forall x \in (a, b). \tag {4.5}
$$
不妨设 (4.4) 式成立, 此时 $x \mapsto f'(x) - \ell x$ 在 $(a, b)$ 内严格单增. 由[[#^zhu-4-3|注 4.3]] 可得 $x \mapsto f'(x) - \ell x$ 在 $[a, b]$ 上连续, 从而它又在 $[a, b]$ 上严格单增. 因此, $f'(b) - \ell b > f'(a) - \ell a$ . 得到矛盾. 证毕. $\square$

**注 4.4** ^zhu-4-4
也可以这样证明. 若结论不真, 则(4.4)式或(4.5)式成立. 此时 $x \mapsto f'(x) - \ell x$ 在 $(a, b)$ 内严格单调, 从而结合介值性得到 $x \mapsto f'(x) - \ell x$ 在 $[a, b]$ 上连续. 特别地, $f'$ 在 $[a, b]$ 上连续, 而这时可直接利用Lagrange（拉格朗日）中值定理得到结论.

这是很有趣的一个现象. 在原问题的假设下, $f'$ 不一定连续, 从而导致一些困

难. 而在反设结论不成立时, 可得到 $f'$ 连续, 自然而然地克服了 $f'$ 可能不连续的困难.

### 例 4.10

> [!question] 例 4.10
> 若 $|f|$ 在 $[a,b]$ 上 Riemann 可积, $f = F'$ . 证明: f 在 $[a,b]$ 上 Riemann 可积.

**证明**
对于任何 $[\alpha,\beta]\subseteq[a,b]$ ，若 f 在 $[\alpha,\beta]$ 上保号，则易见
$$
\sup _ {x \in [ \alpha , \beta ]} f (x) - \inf _ {x \in [ \alpha , \beta ]} f (x) = \sup _ {x \in [ \alpha , \beta ]} | f (x) | - \inf _ {x \in [ \alpha , \beta ]} | f (x) |;
$$
若 $f$ 在 $[\alpha, \beta]$ 上变号, 则根据 Darboux 定理, $f$ 在 $[\alpha, \beta]$ 上可以取到 0 值, 于是
$$
\sup _ {x \in [ \alpha , \beta ]} f (x) - \inf _ {x \in [ \alpha , \beta ]} f (x) \leqslant 2 \sup _ {x \in [ \alpha , \beta ]} | f (x) | = 2 \left[ \sup _ {x \in [ \alpha , \beta ]} | f (x) | - \inf _ {x \in [ \alpha , \beta ]} | f (x) | \right].
$$
这样, 对于 $[a, b]$ 的任何划分 $P$ , 都有
$$
U (f, P) - L (f, P) \leqslant 2 [ U (| f |, P) - L (| f |, P) ],
$$
其中 $U(f, P)$ 和 $L(f, P)$ 分别表示 $f$ 在 $[a, b]$ 上关于划分 $P$ 的 Darboux 上和与下和. 由此可得 $f$ 在 $[a, b]$ 上 Riemann 可积.

**注 4.5** ^zhu-4-5
利用微分Darboux定理可以证明当 $f$ 是导函数时， $f$ 和 $|f|$ 有相同的连续点。根据Lebesgue判据，有界闭区间上的有界函数Riemann可积当且仅当它的不连续点全体是Lebesgue零测度集，也可以得到此时 $f$ 和 $|f|$ 有相同的Riemann可积性。

### 例 4.11

> [!question] 例 4.11
> 设 f 在 $\left[0, \frac{\pi}{4}\right]$ 上连续可微，在 $\left(0, \frac{\pi}{4}\right)$ 内有二阶导数， $f(0)=0, f'(0)=1, f\left(\frac{\pi}{4}\right)=1$ 。证明：存在 $\xi \in \left(0, \frac{\pi}{4}\right)$ 使得 $f''(\xi)=2f(\xi)f'(\xi)$ .

**证明**
记 $F(x) = f'(x) - f^2 (x)$ , 则 $F$ 在 $\left[0, \frac{\pi}{4}\right]$ 上可导. 我们要证明的就是存在 $\xi \in \left(0, \frac{\pi}{4}\right)$ 使得 $F'(\xi) = 0$ . 由 Darboux 定理, 若结论不真, 则
$$
F ^ {\prime} (x) = f ^ {\prime \prime} (x) - 2 f (x) f ^ {\prime} (x) <   0, \quad \forall x \in \left(0, \frac {\pi}{4}\right) \tag {4.6}
$$
或
$$
F ^ {\prime} (x) = f ^ {\prime \prime} (x) - 2 f (x) f ^ {\prime} (x) > 0, \quad \forall x \in \left(0, \frac {\pi}{4}\right). \tag {4.7}
$$
若 (4.6) 式成立, 则
$$
f ^ {\prime} (x) - f ^ {2} (x) = F (x) <   F (0) = 1, \quad \forall x \in \left(0, \frac {\pi}{4} \right].
$$
即
$$
\left[ \arctan f (x) \right] ^ {\prime} <   1, \quad \forall x \in \left(0, \frac {\pi}{4} \right].
$$
于是又有
$$
\arctan f (x) - x <   \arctan f (0) - 0 = 0, \quad \forall x \in \left(0, \frac {\pi}{4} \right].
$$
特别地，
$$
f \left(\frac {\pi}{4}\right) <   \tan \frac {\pi}{4} = 1.
$$
得到矛盾. 因此 (4.6) 式不成立. 类似可证 (4.7) 式也不成立.

因此结论成立.

$$
\square
$$

### 例 4.12

> [!question] 例 4.12
> 设 f 在 $[0,1]$ 上连续可微, 在 $(0,1)$ 内有二阶导数, $f(0)=0$ , $f'(0)=0$ , $f(1)=0$ . 证明: 存在 $\xi\in(0,1)$ 使得 $f''(\xi)=f(\xi)$ .

**证明**
若结论不真, 则 $f'' - f$ 在 (0,1) 内恒正或恒负. 不妨设为恒正. 设 $f$ 在 \[0,1\] 上的最小值为 $m$ , 则 $f'' \geqslant m$ . 进而
$$
\left[ f (x) - \frac {m x ^ {2}}{2} \right] ^ {\prime \prime} > 0, \quad \forall x \in (0, 1).
$$
结合 $f(0) = f'(0) = 0$ 可得
$$
f (x) \geqslant \frac {m x ^ {2}}{2}, \quad \forall x \in [ 0, 1 ]. \tag {4.8}
$$
我们断言 $m \geqslant 0$ 。否则 $m < 0$ 。则由 (4.8) 式得到 $f(x) \geqslant \frac{m}{2} (\forall x \in [0,1])$ ，从而 $m \geqslant \frac{m}{2}$ ，即 $m \geqslant 0$ 。得到矛盾。因此 $m \geqslant 0$ 。

于是在 $(0,1)$ 内成立 $f'' > f \geqslant 0$ . 再结合 $f(0) = f'(0) = 0$ 可得 $f'(x) > 0 (\forall x \in (0,1])$ , 进而 $f(x) > 0 (\forall x \in (0,1])$ . 矛盾.

因此, 结论成立.

$$
\square
$$

需要指出, 在 Darboux 定理基础上解决此类问题, 并不总是最简捷的. 比如[[#例 4.4|例 4.4]], 可以发现, 若考虑 $G(x) := \frac{f(x) - k}{x}$ , 则 $G$ 在 $[a, b]$ 上连续, 在 $(a, b)$ 内可导, 且 $G(a) = G(b)$ . 从而有 $\xi \in (a, b)$ 使得 $G'(\xi) = 0$ . 而这就是要证的. 尽管如此, 这种方法的优点是明显的, 它往往最能"抽丝剥茧", 抓住问题实质. 这尤其体现在以下几点: 对于错误的命题, 该法有望帮我们找到反例; 而对于正确的命题, 该法有望帮我们找到命题成立的临界点以及证明命题所需的辅助函数; 进一步, 该法把微分中值定理类问题化为对函数在某一点的值的估计, 使得一大类问题能够统一地加以处理.

在以下三例中, 我们可以进一步看到这种方法的精细.

### 例 4.13

> [!question] 例 4.13
> 设 R 上函数 f 二阶可导, $|f| \leqslant 1$ , 且 $f^{2}(0) + [f'(0)]^{2} > 1$ . 证明: 存在 $\xi \in R$ 使得 $f''(\xi) + f(\xi) = 0$ .

**证明**
记 $a = f^2(0) + [f'(0)]^2$ ，则 $a > 1$ . 记 $F(x) = f^2(x) + [f'(x)]^2$ .

常规方法 用常规方法求解本题的关键是寻找函数 $F$ 大于1的极值. 在这样的极值点, $F$ 的导数为零而 $f'$ 不为零, 从而可得结论. 而为了寻找 $F$ 大于1的极值, 我们只要找到 $\xi_1 \in (0, +\infty)$ 和 $\xi_2 \in (-\infty, 0)$ 使得 $F(\xi_1) \leqslant a$ , $F(\xi_2) \leqslant a$ . 而这只要 $|f'(\xi_1)| \leqslant \sqrt{a - 1}$ , $|f'(\xi_2)| \leqslant \sqrt{a - 1}$ .

由Lagrange中值定理, 易见有 $\xi_1 \in \left(0, \frac{2}{\sqrt{a - 1}}\right)$ 使得
$$
| f ^ {\prime} (\xi_ {1}) | = \left| \frac {f \left(\frac {2}{\sqrt {a - 1}}\right) - f (0)}{\frac {2}{\sqrt {a - 1}}} \right| \leqslant \sqrt {a - 1}.
$$
于是 $F(\xi_1) \leqslant a$ . 同理, 存在 $\xi_2 \in \left(-\frac{2}{\sqrt{a - 1}}, 0\right)$ 使得 $F(\xi_2) \leqslant a$ . 于是 $F$ 在 $[\xi_2, \xi_1]$ 上的最大值可在一内点 $\xi \in (\xi_2, \xi_1)$ 取到. 从而
$$
2 f ^ {\prime} (\xi) [ f (\xi) + f ^ {\prime \prime} (\xi) ] = 0.
$$
另一方面，
$$
\left| f ^ {\prime} (\xi) \right| ^ {2} = F (\xi) - \left| f (\xi) \right| ^ {2} \geqslant a - 1 > 0.
$$
因此
$$
f (\xi) + f ^ {\prime \prime} (\xi) = 0.
$$
上面的证明非常简捷, 看起来也非常简单自然. 然而, 事实上, 由于需要摸索的可能的证明途径很多, 找到以上证明路径并非看起来的那么容易.

更精细的方法 I 现在我们来使用 Darboux 定理和比较定理的思想讨论本例. 考虑这样的 $M > 0$ , 满足 $\forall x \in (-M, M)$ , 成立 $f''(x) + f(x) \neq 0$ .

由 Darboux 定理, $f'' + f$ 在 $(-M, M)$ 内恒正或恒负. 而由假设 $|f'(0)|^2 = F(0) - f^2(0) \geqslant a - 1 > 0$ .

不失一般性, 可设 $f'(0) > 0$ ,
$$
f ^ {\prime \prime} (x) + f (x) > 0, \quad \forall x \in (- M, M).
$$
令
$$
M _ {0} = \sup \left\{S \in (0, M ] \mid f ^ {\prime} (x) > 0, \quad \forall x \in (0, S) \right\},
$$
则 $M_0$ 适定. 进一步, 若 $M_0 \in (0, M)$ , 则由 $f'$ 的连续性可得 $f'(M_0) = 0$ . 我们有
$$
F ^ {\prime} (x) = 2 f ^ {\prime} (x) \left[ f ^ {\prime \prime} (x) + f (x) \right] > 0, \quad \forall x \in \left(0, M _ {0}\right),
$$
从而
$$
F (x) > F (0) = a, \quad \forall x \in (0, M _ {0} ].
$$
所以 $|f'(M_0)|^2 > a - 1 > 0$ . 因此必有 $M_0 = M$ . 进而可得
$$
f ^ {\prime} (x) > \sqrt {a - f ^ {2} (x)}, \quad \forall x \in (0, M), \tag {4.9}
$$
即
$$
\left[ \arcsin \frac {f (x)}{\sqrt {a}} - x \right] ^ {\prime} > 0, \quad \forall x \in (0, M).
$$
于是
$$
\arcsin \frac {f (x)}{\sqrt {a}} - x > \arcsin \frac {f (0)}{\sqrt {a}}, \quad \forall x \in (0, M ],
$$
所以
$$
M <   \arcsin {\frac {f (M)}{\sqrt {a}}} - \arcsin {\frac {f (0)}{\sqrt {a}}} \leqslant 2 \arcsin {\frac {1}{\sqrt {a}}}.
$$
这表明存在
$$
\xi \in \left(- 2 \arcsin \frac {1}{\sqrt {a}}, 2 \arcsin \frac {1}{\sqrt {a}}\right)
$$
使得 $f(\xi) + f''(\xi) = 0$ . 易见, $2 \arcsin \frac{1}{\sqrt{a}} < \frac{2}{\sqrt{a - 1}}$ . 因此, 这一结果要比一开始得到的结果更为精细. 有趣的是, $2 \arcsin \frac{1}{\sqrt{a}}$ 有与 $a > 1$ 无关的上界 $\pi$ , 而 $\frac{2}{\sqrt{a - 1}}$ 是无界的.

事实上, 若 $0 < M < 2 \arcsin \frac{1}{\sqrt{a}}$ , 我们可以构造二次可微函数 $f$ 使得 $f^2(0) + [f'(0)]^2 = a$ , 且在 $[-M, M]$ 上成立 $|f| \leqslant 1$ 以及 $f'' + f > 0$ .

更精细的方法II 若我们只是想找能够使 $F > a$ 在 $(0, M]$ 上成立的最大的 $M > 0$ , 则过程可以更简单一些. 我们设
$$
F (x) > a, \quad \forall x \in (0, M ].
$$
由于 $f'(0) \neq 0$ ，不妨设 $f'(0) > 0$ 。此时，必有 (4.9) 式成立。从而类似地得到

$M < 2\arcsin \frac{1}{\sqrt{a}}$ ，即 $F$ 在 $\left(0,2\arcsin \frac{1}{\sqrt{a}}\right)$ 内有小于或等于 $a$ 的值.同理， $F$ 在 $\left(-2\arcsin \frac{1}{\sqrt{a}},0\right)$ 内有小于或等于 $a$ 的值．于是由前面常规方法中的讨论可见存在
$$
\xi \in \left(- 2 \arcsin {\frac {1}{\sqrt {a}}}, 2 \arcsin {\frac {1}{\sqrt {a}}}\right)
$$
使得 $f(\xi) + f''(\xi) = 0.$

### 例 4.14

> [!question] 例 4.14
> 设 f 在 $[a,b]$ 上连续，在 $(a,b)$ 内二阶可导且满足 $f'' + f \geqslant 0$ , $f(a) = f(b) = 0$ . 证明：若存在 $x_{0} \in (a,b)$ 使得 $f(x_{0}) > 0$ , 则 $b - a \geqslant \pi$ .

**证明**
不妨设 $\max_{x\in [a,b]}f(x) = 1 = f(\bar{x})$ .进一步，不妨设 $\bar{x} = 0$ ，则 $f^{\prime}(0) = 0.$ 令
$$
\alpha = \sup \{x \in [ a, 0 ] | f (x) = 0 \}, \quad \beta = \inf \{x \in [ 0, b ] | f (x) = 0 \},
$$
则
$$
f (x) > 0, \quad \forall x \in (\alpha , \beta).
$$
我们断言
$$
f ^ {\prime} (x) \geqslant - \sqrt {1 - f ^ {2} (x)}, \quad x \in [ 0, \beta). \tag {4.10}
$$
若 $f$ 在 $[0, \beta]$ 上是单调减少的, 则 $f' \leqslant 0$ , 此时易证 (4.10) 式成立 (参见 (4.11) 式). 因此, $f'$ 为正的点给我们造成了困难. 但另一方面, 在 $f'$ 为正的点上, (4.10) 式自然成立.

为此, 考虑 $x_0 \in (0, \beta)$ 满足 $f'(x_0) < 0$ . 令 $s$ 为 $f'$ 在 $[0, x_0]$ 上的最大的零点, 则 $0 < f(s) \leqslant 1$ , $f'(s) = 0$ ,
$$
f ^ {\prime} (x) <   0, \quad \forall x \in (s, x _ {0} ],
$$
从而
$$
[ | f ^ {\prime} (x) | ^ {2} + f ^ {2} (x) ] ^ {\prime} = 2 f ^ {\prime} (x) [ f ^ {\prime \prime} (x) + f (x) ] \leqslant 0, \quad \forall x \in (s, x _ {0} ]. \tag {4.11}
$$
所以 $|f^{\prime}|^{2} + f^{2}$ 在 $[s,x_0]$ 上单调减少，从而 $|f'(x_0)|^2 +f^2 (x_0)\leqslant f^2 (s)\leqslant 1.$ 于是
$$
f ^ {\prime} (x _ {0}) \geqslant - \sqrt {1 - f ^ {2} (x _ {0})}.
$$
因此, 我们总有 (4.10) 式, 即 $x \mapsto \arcsin f(x) + x$ 在 $[0, \beta]$ 上单调增加. 所以
$$
\beta = \arcsin f (\beta) + \beta \geqslant \arcsin f (0) + 0 = \frac {\pi}{2}.
$$
同理可证 $-\alpha \geqslant \frac{\pi}{2}$ . 因此 $b - a \geqslant \beta - \alpha \geqslant \pi$ .

### 例 4.15

> [!question] 例 4.15
> 设 $\alpha \geqslant 2, f$ 在 $[-\alpha, \alpha]$ 上连续，在 $(-\alpha, \alpha)$ 内有三阶导数，
> $$
> f (- \alpha) = f (\alpha) = f ^ {\prime} (- 1) = f ^ {\prime} (1) = 0. \tag {4.12}
> $$
> 证明： 存在 $\xi\in(-\alpha,\alpha)$ 使得 $f'''(\xi)=0$ .

**证明**
由于 -1,1 包含在 $(- \alpha, \alpha)$ 内, 因此, 由 $f(-\alpha) = f(\alpha) = 0$ 以及 Rolle (罗尔) 定理不能保证 $f'$ 存在异于 -1,1 的零点. 事实上, 确实可以找到满足题设的函数使得 $f'$ 在 $(- \alpha, \alpha)$ 内没有异于 -1,1 的零点. 例如, 对于 $g(x) = \sin \frac{\pi x}{2}$ , 我们有 $g(\pm 2) = 0$ 以及 $g'(\pm 1) = 0$ . 但 $g'$ 在 $[-2,2]$ 上没有异于 $\pm 1$ 的零点. 进一步, $\pm 1$ 都不是 $g'$ 的多重零点 (即 $g''(\pm 1) \neq 0$ ). 所以用传统的中值定理来推导本题结论存在很大的困难.

按 Darboux 定理, 若本题结论不真, 则不妨设 $f'''$ 在 $(- \alpha, \alpha)$ 内恒正. 此时, $f'$ 就是 $(- \alpha, \alpha)$ 内的严格凸函数. 如图 4.4 所示, 在 $[0, \alpha)$ 上 $f'$ 的图像在过点 $(1, 0)$ 的切线之上, 而在 $(- \alpha, 0]$ 上 $f'$ 的图像在过点 $(-1, 0)$ 的切线之上. 特别地, 切线与函数图像均只交于一点.

由此立即得到 $^{(1)}$
$$
f (\alpha) - f (- \alpha) = \int_ {- \alpha} ^ {\alpha} f ^ {\prime} (x) \mathrm{d} x > 0,
$$
与 $f(-\alpha) = f(\alpha) = 0$ 矛盾. 因此, 存在 $\xi \in (-\alpha, \alpha)$ 使得 $f'''(\xi) = 0$ .

![[assets/images/楼分析/figure-4-4.png]]

*图4.4*

**注 4.6** ^zhu-4-6
从[[#例 4.15|例 4.15]] 的解法不难看到如何构造反例说明当 $1 < \alpha < 2$ 时, [[#例 4.15|例 4.15]] 的结论不真.

最后, 在下例中, 我们给出一个有趣的结果.

### 例 4.16

> [!question] 例 4.16
> 设 f 在 $[a,b]$ 上可导, g 在 $[a,b]$ 上连续. 证明: $F = f'g$ 在 $[a,b]$ 上有介值性.

**证明**
不失一般性, 只要证明 $F[a, b]$ 为区间或单点集. 进一步, 不妨设 $F(a) < \eta < F(b)$ , 我们只要证明存在 $\xi \in (a, b)$ 使得 $F(\xi) = \eta$ .

情形 I $\eta = 0$ . 此时 $f'(a)f'(b)g(a)g(b) < 0$ . 从而
$$
f ^ {\prime} (a) f ^ {\prime} (b) <   0 \tag {4.13}
$$
或
$$
g (a) g (b) <   0. \tag {4.14}
$$
若 (4.13) 式成立, 则由 Darboux 定理, 存在 $\xi \in (a, b)$ 使得 $f'(\xi) = 0$ . 若 (4.14) 式成立, 则由连续函数的介值定理, 存在 $\xi \in (a, b)$ 使得 $g(\xi) = 0$ . 无论哪种情形, 都有 $f'(\xi)g(\xi) = \eta$ .

情形II $\eta > 0.$ 此时不妨设 $g(b) > 0.$

1.  $g$ 在 $[a,b]$ 上恒正. 则
$$
f ^ {\prime} (a) - \frac {\eta}{g (a)} <   0 <   f ^ {\prime} (b) - \frac {\eta}{g (b)},
$$
而由于函数 $f' - \frac{\eta}{g}$ 具有介值性, 因此, 存在 $\xi \in (a, b)$ 使得 $f'(\xi) - \frac{\eta}{g(\xi)} = 0$ , 即 $f'(\xi)g(\xi) = \eta$ .

2.  $g$ 在 $[a, b]$ 上不恒正. 则 $g$ 在 $[a, b]$ 上有最大零点 $s \in [a, b)$ . 由 Darboux 定理, 有 $(s, b)$ 中趋于 $s$ 的点列 $\{x_n\}$ , 使得 $\lim_{n \to +\infty} f'(x_n) = f'(s)$ . 从而 $\lim_{n \to +\infty} f'(x_n) g(x_n) = 0$ . 于是有 $k \geqslant 1$ 使得 $f'(x_k) g(x_k) < \eta$ . 由于 $g$ 在 $[x_k, b]$ 上恒正, 由 (i) 可得结论.

情形III $\eta < 0$ . 与情形II同理可证.

