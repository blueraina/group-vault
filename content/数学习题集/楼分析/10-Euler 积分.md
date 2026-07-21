---
noteId: "楼分析/10-euler-积分"
shortId: 793
chapter: 10
title: "10-Euler 积分"
type: 讲义
source: 数学分析技巧选讲
depends_on: []
tags:
  - 楼分析
---

# 10-Euler 积分

## 依赖于
- 无显式依赖

## 被以下题目直接调用
- 无

## 正文部分

Euler 积分在一些定积分的计算中十分有用. 除了 Beta (贝塔) 函数和 Gamma (伽马) 函数, 让我们对所谓双 Gamma 函数和多重对数函数加以一定关注.

## 双 Gamma 函数

定义双 Gamma 函数 $\psi$ 如下:
$$
\psi (x) := (\ln \Gamma (x)) ^ {\prime}, \quad \forall x > 0. \tag {10.1}
$$
该函数也称为 $\psi$ 函数 $^{(1)}$ .

关于双 Gamma 函数, 有如下基本性质:

1.  利用 $\Gamma(x + 1) = x\Gamma(x)$ 得到
$$
\psi (x + 1) = \psi (x) + \frac {1}{x}, \quad x > 0. \tag {10.2}
$$
2.  设 $x, y > 0$ , 则
$$
\psi (x) - \psi (y) = \sum_ {k = 0} ^ {\infty} \left(\frac {1}{y + k} - \frac {1}{x + k}\right). \tag {10.3}
$$
**证明**
利用 (i) 可得
$$
\psi (x + 1) = \frac {1}{x} + \psi (x), \quad \forall x > 0. \tag {10.4}
$$
从而 $\forall n\geqslant 1,$
$$
\begin{aligned}
\psi(x)-\psi(y)
&= \psi(x+1)-\psi(y+1)-\left(\frac{1}{x}-\frac{1}{y}\right) \\[6pt]
&= \dots \\[6pt]
&= \psi(x+n)-\psi(y+n)
  -\sum_{k=0}^{n-1}\left(\frac{1}{x+k}-\frac{1}{y+k}\right).
\end{aligned} \tag{10.5}
$$
另一方面, 由于 $\psi$ 单调增加, 所以当 $y \leqslant x \leqslant y + 1$ 时,
$$
\begin{aligned}
0 \leqslant \psi (x + n) - \psi (y + n) &= \frac {1}{x + n - 1} + \psi (x + n - 1) - \psi (y + n) \\[6pt]
&\leqslant \frac {1}{x + n - 1}, \quad \forall n \geqslant 1.
\end{aligned}
$$
由此得到
$$
\lim _ {n \rightarrow + \infty} [ \psi (x + n) - \psi (y + n) ] = 0. \tag {10.6}
$$
结合 (10.4) 式知 (10.6) 式对所有 $x, y > 0$ 成立. 于是, 在 (10.5) 式中令 $n \to +\infty$ 即得 (10.3) 式.

3.  对 (10.3) 式关于 $x$ 求导即得
$$
\psi^ {\prime} (x) = \sum_ {n = 0} ^ {\infty} \frac {1}{(n + x) ^ {2}}, \quad x > 0. \tag {10.7}
$$
4.  对 (10.7) 式求导得
$$
\psi^ {\prime \prime} (x) = - \sum_ {n = 0} ^ {\infty} \frac {2}{(n + x) ^ {3}}, \quad x > 0. \tag {10.8}
$$
22. 对余元公式两边取对数后求导可得
$$
\psi (x) - \psi (1 - x) = - \pi \cot \pi x, \quad \forall x \in (0, 1). \tag {10.9}
$$
6.  利用
$$
\Gamma (x) \Gamma \left(x + \frac {1}{k}\right) \dots \Gamma \left(x + \frac {k - 1}{k}\right) = (2 \pi) ^ {\frac {k - 1}{2}} k ^ {\frac {1}{2} - k x} \Gamma (k x) \tag {10.10}
$$
直接得到: 当 $k \geqslant 2$ 时, 成立
$$
\sum_ {j = 0} ^ {k - 1} \psi \left(x + \frac {j}{k}\right) = k (\psi (k x) - \ln k), \quad \forall x > 0. \tag {10.11}
$$
7.  可以由上述性质和 $\Gamma'(1) = -\gamma$（其中 $\gamma := \lim_{n \to +\infty} \left(\sum_{k=1}^{n} \frac{1}{k} - \ln n\right)$ 为 Euler 常数）得到 $\psi$ 在 $\frac{1}{2}, \frac{1}{3}, \frac{2}{3}, \frac{1}{4}, \frac{3}{4}, \frac{1}{6}, \frac{5}{6}$ 等点的值. 例如 $\psi\left(\frac{1}{2}\right) = -2 \ln 2 - \gamma$ .

## 多重对数函数

对于 $p > 1$ ，可引入多重对数函数
$$
\operatorname{Li} _ {p} (x) := \sum_ {n = 1} ^ {\infty} \frac {x ^ {n}}{n ^ {p}}, \quad | x | \leqslant 1.
$$
当 p = 2 时, 通过两边求导容易证明以下的 Euler 公式:
$$
\operatorname{Li} _ {2} (x) + \operatorname{Li} _ {2} (1 - x) = \frac {\pi^ {2}}{6} - \ln x \ln (1 - x), \quad x \in (0, 1). \tag {10.12}
$$
这是多重对数函数的余元公式.

**证明**
$$
\operatorname{Li}_2(x) + \operatorname{Li}_2(1 - x) = \operatorname{Li}_2(0) + \operatorname{Li}_2(1) + \int_0^x [\operatorname{Li}_2(t) + \operatorname{Li}_2(1 - t)]'\mathrm{d}t
$$
$$
= \frac {\pi^ {2}}{6} + \int_ {0} ^ {x} \sum_ {n = 1} ^ {+ \infty} \left[ \frac {t ^ {n - 1}}{n} - \frac {(1 - t) ^ {n - 1}}{n} \right] \mathrm{d} x
$$
$$
= \frac {\pi^ {2}}{6} + \int_ {0} ^ {x} \left(- \frac {\ln (1 - t)}{t} + \frac {\ln t}{1 - t}\right) \mathrm{d} t
$$
$$
= \frac {\pi^ {2}}{6} - [ \ln t \ln (1 - t) ] \Big | _ {0} ^ {x}
$$
$$
= \frac {\pi^ {2}}{6} - \ln x \ln (1 - x), \quad x \in (0, 1).
$$
### 例 10.1

> [!question] 例 10.1
> 设 $p > -1, q > -1$ ，则
> $$
> \begin{aligned}
> \int_ {0} ^ {\frac {\pi}{2}} \sin^ {p} x \cos^ {q} x \mathrm{d} x &= \int_ {0} ^ {1} t ^ {p} (1 - t ^ {2}) ^ {\frac {q - 1}{2}} \mathrm{d} t \\[6pt]
> &= \frac {1}{2} \int_ {0} ^ {1} s ^ {\frac {p - 1}{2}} (1 - s) ^ {\frac {q - 1}{2}} \mathrm{d} s &= \frac {1}{2} \mathrm{B} \left(\frac {p + 1}{2}, \frac {q + 1}{2}\right) \\[6pt]
> &= \frac {1}{2} \frac {\Gamma \left(\frac {p + 1}{2}\right) \Gamma \left(\frac {q + 1}{2}\right)}{\Gamma \left(\frac {p + q}{2} + 1\right)}.
> \end{aligned}
> $$

### 例 10.2

> [!question] 例 10.2
> 设 $p, q, r > 0, qr > p + 1$ ，则
> $$
> \int_ {0} ^ {+ \infty} {\frac {x ^ {p}}{(1 + x ^ {q}) ^ {r}}} \mathrm{d} x = \int_ {1} ^ {0} \left(\frac {1}{t} - 1\right) ^ {\frac {p}{q}} t ^ {r} \left[ - \frac {1}{q} \left(\frac {1}{t} - 1\right) ^ {\frac {1}{q} - 1} \frac {1}{t ^ {2}} \right] \mathrm{d} t
> $$
> $$
> = \frac {1}{q} \int_ {0} ^ {1} \left(\frac {1}{t} - 1\right) ^ {\frac {p + 1}{q} - 1} t ^ {r - 2} \mathrm{d} t
> $$
> $$
> \begin{aligned}
> &= \frac {1}{q} \int_ {0} ^ {1} (1 - t) ^ {\frac {p + 1}{q} - 1} t ^ {r - 1 - \frac {p + 1}{q}} d t \\[6pt]
> &\quad = \frac {1}{q} \mathrm{B} \left(\frac {p + 1}{q}, r - \frac {p + 1}{q}\right) \\[6pt]
> &\quad = \frac {\Gamma \left(\frac {p + 1}{q}\right) \Gamma \left(r - \frac {p + 1}{q}\right)}{q \Gamma (r)}.
> \end{aligned}
> $$

### 例 10.3

> [!question] 例 10.3
> 设 $a, b \in \mathbb{R}, p > 0, q > 0$ ，则
> $$
> \begin{aligned}
> \int_ {a} ^ {b} (b - x) ^ {p - 1} (x - a) ^ {q - 1} \mathrm{d} x &= (b - a) ^ {p + q - 1} \int_ {0} ^ {1} (1 - t) ^ {p - 1} t ^ {q - 1} \mathrm{d} t \quad (\text {作变量代换} x \\[6pt]
> &= a + t (b - a)) \\[6pt]
> &= (b - a) ^ {p + q - 1} \mathrm{B} (p, q).
> \end{aligned}
> $$
> 特别地，
> $$
> \int_ {- 1} ^ {1} (1 - x) ^ {p - 1} (1 + x) ^ {q - 1} \mathrm{d} x = 2 ^ {p + q - 1} \mathrm{B} (p, q).
> $$

### 例 10.4

> [!question] 例 10.4
> 证明:
> $$
> \Gamma'(1) = -\gamma
> $$

**证明**
法 I 我们有
$$
\Gamma^ {\prime} (1) = \psi (1) = \psi (n + 1) - \sum_ {k = 1} ^ {n} \frac {1}{k}, \quad \forall n \geqslant 1.
$$
另一方面, 因为 $\ln \Gamma$ 是凸函数, 可得
$$
\psi (x) \leqslant \ln \Gamma (x + 1) - \ln \Gamma (x) \leqslant \psi (x + 1), \quad \forall x > 0.
$$
特别地，
$$
\ln n \leqslant \psi (n + 1) \leqslant \ln (n + 1), \quad \forall n \geqslant 1.
$$
因此，
$$
\ln n - \sum_ {k = 1} ^ {n} \frac {1}{k} \leqslant \Gamma^ {\prime} (1) \leqslant \ln (n + 1) - \sum_ {k = 1} ^ {n} \frac {1}{k}, \quad \forall n \geqslant 1.
$$
在上式中令 $n \to +\infty$ 即得 $\Gamma'(1) = -\gamma$ .

**法II**
$$
\gamma=\lim_{n\to+\infty}\left(\frac{1}{1}+\frac{1}{2}+\cdots+\frac{1}{n}-\ln n\right)
$$
$$
\begin{aligned}
&= \lim _ {n \rightarrow + \infty} \left(\sum_ {k = 1} ^ {n} \int_ {0} ^ {1} x ^ {k - 1} \mathrm{d} x - \int_ {1} ^ {n} \frac {1}{x} \mathrm{d} x\right) \\[6pt]
&= \lim _ {n \rightarrow + \infty} \left(\int_ {0} ^ {1} \frac {1 - x ^ {n}}{1 - x} \mathrm{d} x - \int_ {1} ^ {n} \frac {1}{x} \mathrm{d} x\right) \\[6pt]
&= \lim _ {n \rightarrow + \infty} \left[ \int_ {0} ^ {n} \frac {1 - \left(1 - \frac {t}{n}\right) ^ {n}}{t} \mathrm{d} t - \int_ {1} ^ {n} \frac {1}{x} \mathrm{d} x \right] \\[6pt]
&= \lim _ {n \rightarrow + \infty} \left[ \int_ {0} ^ {1} \frac {1 - \left(1 - \frac {x}{n}\right) ^ {n}}{x} \mathrm{d} x - \int_ {1} ^ {n} \frac {\left(1 - \frac {x}{n}\right) ^ {n}}{x} \mathrm{d} x \right] \\[6pt]
&= \int_ {0} ^ {1} \frac {1 - \mathrm{e} ^ {- x}}{x} \mathrm{d} x - \int_ {1} ^ {+ \infty} \frac {\mathrm{e} ^ {- x}}{x} \mathrm{d} x \\[6pt]
&= - \int_ {0} ^ {+ \infty} \mathrm{e} ^ {- x} \ln x \mathrm{d} x &= - \Gamma^ {\prime} (1).
\end{aligned}
$$
**法III**
$$
\gamma = \sum_{n=1}^{+\infty}\left[\frac{1}{n}-\ln\left(1+\frac{1}{n}\right)\right] = \sum_{n=1}^{+\infty}\int_{0}^{1}\frac{x}{n(n+x)}\mathrm{d}x
$$
$$
= \sum_ {n = 1} ^ {+ \infty} \int_ {0} ^ {1} \mathrm{d} x \int_ {0} ^ {1} \frac {x t ^ {n + x - 1}}{n} \mathrm{d} t = - \int_ {0} ^ {1} \mathrm{d} x \int_ {0} ^ {1} x t ^ {x - 1} \ln (1 - t) \mathrm{d} t
$$
$$
= - \int_ {0} ^ {1} x \frac {\partial \mathrm{B} (x , y)}{\partial y} \bigg | _ {y = 1} \mathrm{d} x = - \int_ {0} ^ {1} x \frac {\partial}{\partial y} \frac {\Gamma (x) \Gamma (y)}{\Gamma (x + y)} \bigg | _ {y = 1} \mathrm{d} x
$$
$$
= - \int_ {0} ^ {1} \left[ \Gamma^ {\prime} (1) - \frac {\Gamma^ {\prime} (x + 1)}{\Gamma (x + 1)} \right] \mathrm{d} x = - \Gamma^ {\prime} (1) + \ln \Gamma (x + 1) \Bigg | _ {x = 0} ^ {1}
$$
$$
= - \Gamma^ {\prime} (1).
$$
### 例 10.5

> [!question] 例 10.5
> 设 $\alpha > 0$ 计算
> $$
> \sum_{n=1}^{\infty} \frac{1}{n(n + \alpha)}
> $$

**解**
法 I 利用双 Gamma 函数, 由 (10.3) 式立即得到
$$
\sum_ {n = 1} ^ {\infty} \frac {1}{n (n + \alpha)} = \frac {1}{\alpha} \sum_ {n = 1} ^ {\infty} \left(\frac {1}{n} - \frac {1}{n + \alpha}\right) = \frac {1}{\alpha} [ \psi (1 + \alpha) - \psi (1) ].
$$
**法II**
$$
\sum_{n=1}^{\infty}\frac{1}{n(n+\alpha)}=\sum_{n=1}^{\infty}\int_{0}^{1}\frac{t^{n+\alpha-1}}{n}\mathrm{d}t=-\int_{0}^{1}t^{\alpha-1}\ln(1-t)\mathrm{d}t
$$
$$
\begin{aligned}
&= - \left[ \frac {\partial}{\partial y} \int_ {0} ^ {1} t ^ {\alpha - 1} (1 - t) ^ {y - 1} \mathrm{d} t \right] \Bigg | _ {y = 1} \\[6pt]
&= - \frac {\partial \mathrm{B} (\alpha , y)}{\partial y} \Bigg | _ {y = 1} \\[6pt]
&= - \frac {\partial}{\partial y} \frac {\Gamma (\alpha) \Gamma (y)}{\Gamma (\alpha + y)} \Bigg | _ {y \\[6pt] = 1} \\[6pt]
&= - \frac {\Gamma^ {\prime} (1)}{\alpha} + \frac {\Gamma^ {\prime} (\alpha + 1)}{\alpha \Gamma (\alpha + 1)}.
\end{aligned}
$$
### 例 10.6

> [!question] 例 10.6
> 设 $0 < \alpha < 1$ , 计算
> $$
> \sum_{n=1}^{\infty} \frac{1}{n(n - \alpha)}
> $$

**解**
利用双 Gamma 函数, 有
$$
\sum_ {n = 1} ^ {\infty} \frac {1}{n (n - \alpha)} = \frac {1}{\alpha} \sum_ {n = 1} ^ {\infty} \left(\frac {1}{n - \alpha} - \frac {1}{n}\right) = \frac {1}{\alpha} [ \psi (1) - \psi (1 - \alpha) ].
$$
### 例 10.7

> [!question] 例 10.7
> 设 $0 < \alpha < 1$ ，计算
> $$
> \sum_{n=1}^{\infty} \frac{1}{n^2 - \alpha^2}
> $$

**解**
$$
\sum_{n=1}^{\infty} \frac{1}{n^2 - \alpha^2} = \frac{1}{2\alpha} \sum_{n=1}^{\infty} \left( \frac{1}{n - \alpha} - \frac{1}{n + \alpha} \right)
$$
$$
\begin{aligned}
&= \frac {1}{2 \alpha} [ \psi (1 + \alpha) - \psi (1 - \alpha) ] \\[6pt]
&\quad = \frac {1}{2 \alpha} \left[ \frac {1}{\alpha} + \psi (\alpha) - \psi (1 - \alpha) \right] \\[6pt]
&\quad = \frac {1}{2 \alpha^ {2}} + \frac {1}{2 \alpha} \frac {\mathrm{d}}{\mathrm{d} \alpha} \ln [ \Gamma (\alpha) \Gamma (1 - \alpha) ] \\[6pt]
&\quad = \frac {1}{2 \alpha^ {2}} - \frac {\pi \cot (\alpha \pi)}{2 \alpha}.
\end{aligned}
$$
**注 10.1** ^zhu-10-1
另一方面,
$$
\begin{aligned}
\sum_ {n = 1} ^ {\infty} \frac {1}{n ^ {2} - \alpha^ {2}} \\[6pt]
&= \sum_ {n \\[6pt] = 1} ^ {\infty} \frac {1}{n ^ {2}} \sum_ {k \\[6pt] = 1} ^ {\infty} \frac {\alpha^ {2 (k - 1)}}{n ^ {2 (k - 1)}} \\[6pt]
&= \sum_ {k = 1} ^ {\infty} \sum_ {n \\[6pt] = 1} ^ {\infty} \frac {\alpha^ {2 (k - 1)}}{n ^ {2 k}} \\[6pt]
&= \sum_ {k \\[6pt] = 1} ^ {\infty} \zeta (2 k) \alpha^ {2 (k - 1)}.
\end{aligned}
$$
因此
$$
\alpha \pi \cot (\alpha \pi) = 1 - 2 \sum_ {k = 1} ^ {\infty} \zeta (2 k) \alpha^ {2 k}, \quad | \alpha | <   1. \tag {10.13}
$$
### 例 10.8

> [!question] 例 10.8
> 设 $0 < \alpha \leqslant 1$ , 计算
> $$
> \sum_{n=1}^{\infty} \frac{1}{n^2 + \alpha^2}
> $$

**解**
可以由[[#例 10.7|例 10.7]] 的结果作如下猜想:
$$
\begin{aligned}
\sum_ {n = 1} ^ {\infty} \frac {1}{n ^ {2} + \alpha^ {2}} \\[6pt]
&= \frac {1}{2 (\mathrm{i} \alpha) ^ {2}} - \frac {\pi \cos (\mathrm{i} \alpha \pi)}{2 \mathrm{i} \alpha \sin (\mathrm{i} \alpha \pi)} \\[6pt]
&= - \frac {1}{2 \alpha^ {2}} + \frac {\pi}{2 \alpha \tanh (\alpha \pi)}.
\end{aligned}
$$
由解析函数理论即可直接得到上述结果, 在实数范围内则可作如下解答:

对于 $0 < \alpha < 1$ ，有
$$
\begin{aligned}
\sum_ {n = 1} ^ {\infty} \frac {1}{n ^ {2} + \alpha^ {2}} \\[6pt]
&= \sum_ {n \\[6pt] = 1} ^ {\infty} \frac {1}{n ^ {2}} \sum_ {k \\[6pt] = 1} ^ {\infty} \frac {(- 1) ^ {k - 1} \alpha^ {2 (k - 1)}}{n ^ {2 (k - 1)}} \\[6pt]
&= \sum_ {k = 1} ^ {\infty} \sum_ {n \\[6pt] = 1} ^ {\infty} \frac {(- 1) ^ {k - 1} \alpha^ {2 (k - 1)}}{n ^ {2 k}} \\[6pt]
&= \sum_ {k \\[6pt] = 1} ^ {\infty} (- 1) ^ {k - 1} \zeta (2 k) \alpha^ {2 (k - 1)} \\[6pt]
&= \frac {\pi}{2 \alpha} \left[ \coth (\alpha \pi) - \frac {1}{\alpha \pi} \right] &= - \frac {1}{2 \alpha^ {2}} + \frac {\pi}{2 \alpha} \coth (\alpha \pi).
\end{aligned}
$$
利用连续性, 上式对于 $\alpha = 1$ 也成立. 利用 (实) 解析性, 可以说明上式对所有 $\alpha > 0$ 成立 (详细讨论请见 \[10\]).

### 例 10.9

> [!question] 例 10.9
> 对于 $\alpha > -1$ ，有
> $$
> \begin{aligned}
> \int_ {0} ^ {1} \frac {x ^ {\alpha} - 1}{1 - x} \mathrm{d} x &= \int_ {0} ^ {1} \sum_ {n \\[6pt]
> &= 0} ^ {\infty} (x ^ {\alpha} - 1) x ^ {n} \mathrm{d} x \\[6pt]
> &= \sum_ {n = 0} ^ {\infty} \left(\frac {1}{n + 1 + \alpha} - \frac {1}{n + 1}\right) \\[6pt]
> &= \psi (1) - \psi (1 + \alpha).
> \end{aligned}
> $$

### 例 10.10

> [!question] 例 10.10
> 对于 $\alpha > 0$ , 有
> $$
> \begin{aligned}
> \int_ {0} ^ {1} \frac {x ^ {\alpha - 1} \ln x}{1 - x} \mathrm{d} x &= \frac {\mathrm{d}}{\mathrm{d} \alpha} \left(\int_ {0} ^ {1} \frac {x ^ {\alpha - 1} - 1}{1 - x} \mathrm{d} x\right) \\[6pt]
> &= \frac {\mathrm{d}}{\mathrm{d} \alpha} [ \psi (1) - \psi (\alpha) ] &= - \psi^ {\prime} (\alpha).
> \end{aligned}
> $$

### 例 10.11

> [!question] 例 10.11
> 计算
> $$
> I = \int_{0}^{\frac{\pi}{2}}x\ln (\sin x)\ln (\cos x)\mathrm{d}x.
> $$

**解**
易见
$$
I = \int_ {0} ^ {\frac {\pi}{2}} x \ln (\sin x) \ln (\cos x) \mathrm{d} x = \frac {\pi}{4} \int_ {0} ^ {\frac {\pi}{2}} \ln (\sin x) \ln (\cos x) \mathrm{d} x.
$$
**法I**
$$
I = \frac{\pi}{4}\int_0^1\frac{\ln t\ln\sqrt{1 - t^2}}{\sqrt{1 - t^2}}\mathrm{d}t = \frac{\pi}{32}\int_0^1\frac{\ln s\ln(1 - s)}{\sqrt{s}\sqrt{1 - s}}\mathrm{d}s
$$
$$
\begin{aligned}
&= \left. \frac {\pi}{32} \left[ \frac {\partial^ {2}}{\partial \alpha \partial \beta} \int_ {0} ^ {1} s ^ {- \frac {1}{2} + \alpha} (1 - s) ^ {- \frac {1}{2} + \beta} d s \right] \right| _ {\alpha = 0, \beta \\[6pt] = 0} \\[6pt]
&= \left. \frac {\pi}{32} \left[ \frac {\partial^ {2}}{\partial \alpha \partial \beta} \frac {\Gamma \left(\frac {1}{2} + \alpha\right) \Gamma \left(\frac {1}{2} + \beta\right)}{\Gamma (1 + \alpha + \beta)} \right] \right| _ {\alpha = 0, \beta \\[6pt] = 0} \\[6pt]
&= \frac {\pi}{32} \Gamma^ {2} \left(\frac {1}{2}\right) \left\{\left[ \psi \left(\frac {1}{2}\right) - \psi (1) \right] ^ {2} - \psi^ {\prime} (1) \right\} \\[6pt]
&= \frac {\pi^ {2}}{32} \left[ (- 2 \ln 2) ^ {2} - \frac {\pi^ {2}}{6} \right] \\[6pt]
&= \frac {\pi^ {2}}{8} \ln^ {2} 2 - \frac {\pi^ {4}}{192}.
\end{aligned}
$$
**法II**
利用
$$
\ln \left(2 \sin \frac {x}{2}\right) = - \sum_ {n = 1} ^ {\infty} \frac {\cos n x}{n}, \quad \forall x \in (0, 2 \pi).
$$
我们有
$$
I = \frac {\pi}{8} \int_ {0} ^ {\frac {\pi}{2}} \left\{\left[ \ln (\sin x) + \ln (\cos x) \right] ^ {2} - \ln^ {2} (\sin x) - \ln^ {2} (\cos x) \right\} d x
$$
$$
= \frac {\pi}{8} \int_ {0} ^ {\frac {\pi}{2}} \left[ \ln^ {2} \frac {\sin 2 x}{2} - 2 \ln^ {2} (\sin x) \right] \mathrm{d} x
$$
$$
= \frac {\pi}{8} \int_ {0} ^ {\frac {\pi}{2}} \left\{\left[ 2 \ln 2 + \sum_ {n = 1} ^ {\infty} \frac {\cos (4 n x)}{n} \right] ^ {2} - 2 \left[ \ln 2 + \sum_ {n = 1} ^ {\infty} \frac {\cos (2 n x)}{n} \right] ^ {2} \right\} d x
$$
$$
= \frac {\pi}{8} \left(\pi \ln^ {2} 2 - \frac {\pi}{4} \sum_ {n = 1} ^ {\infty} \frac {1}{n ^ {2}}\right)
$$
$$
= \frac {\pi^ {2}}{8} \ln^ {2} 2 - \frac {\pi^ {4}}{192}.
$$
### 例 10.12

> [!question] 例 10.12
> 计算
> $$
> \int_0^1\frac{\ln\frac{1}{x}}{2 - x}\mathrm{d}x.
> $$

**解**
$$
\int_0^1\frac{\ln\frac{1}{x}}{2 - x}\mathrm{d}x = -\int_0^1\frac{1}{2}\sum_{n = 1}^{\infty}\left(\frac{x}{2}\right)^{n - 1}\ln x\mathrm{d}x
$$
$$
= \sum_ {n = 1} ^ {\infty} \frac {1}{2 ^ {n} n ^ {2}} = \operatorname{Li} _ {2} \left(\frac {1}{2}\right) = \frac {\pi^ {2}}{12} - \frac {1}{2} \ln^ {2} 2.
$$
### 例 10.13

> [!question] 例 10.13
> 计算
> $$
> \int_0^{+\infty}\frac{\ln x}{x^2 - 1}\mathrm{d}x.
> $$

**法 I**
$$
\begin{aligned}
\int_0^{+\infty}\frac{\ln x}{x^2-1}\,\mathrm{d}x
&= \int_1^{+\infty}\frac{\ln x}{x^2-1}\,\mathrm{d}x
  +\int_0^1\frac{\ln x}{x^2-1}\,\mathrm{d}x \\[6pt]
&= 2\int_0^1\frac{\ln x}{x^2-1}\,\mathrm{d}x
\\[6pt]
&= -\int_0^1\frac{\ln x}{2\sqrt{x}(1-x)}\,\mathrm{d}x \\[6pt]
&= -\frac{1}{2}\lim_{\alpha\to\frac{1}{2}}\lim_{\beta\to 0^+}
\frac{\partial}{\partial\alpha}
\int_0^1 x^{\alpha-1}(1-x)^{\beta-1}\,\mathrm{d}x \\[6pt]
&= -\frac{1}{2}\lim_{\alpha\to\frac{1}{2}}\lim_{\beta\to 0^+}
\frac{\partial}{\partial\alpha}
\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)} \\[6pt]
&= -\frac{1}{2}\lim_{\alpha\to\frac{1}{2}}\lim_{\beta\to 0^+}
\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}
[\psi(\alpha)-\psi(\beta+\alpha)] \\[6pt]
&= -\frac{1}{2}\lim_{\alpha\to\frac{1}{2}}\lim_{\beta\to 0^+}
\frac{1}{\beta}[\psi(\alpha)-\psi(\beta+\alpha)]
\\[6pt]
&= \frac{1}{2}\psi'\left(\frac{1}{2}\right).
\end{aligned}
$$
另一方面，对
$$
\ln\left[\Gamma\left(\frac{1}{2}-s\right)\Gamma\left(\frac{1}{2}+s\right)\right]
= \ln\frac{\pi}{\sin\left(\frac{1}{2}-s\right)\pi},
\quad s\in\left(-\frac{1}{2},\frac{1}{2}\right)
$$
求导两次得到 $\psi'\left(\frac{1}{2}\right)=\frac{\pi^2}{2}$ . 所以
$$
\int_0^{+\infty}\frac{\ln x}{x^2-1}\,\mathrm{d}x=\frac{\pi^2}{4}.
$$

**法II**
$$
\int_0^{+\infty}\frac{\ln x}{x^2 - 1}\mathrm{d}x = 2\int_0^1\frac{\ln x}{x^2 - 1}\mathrm{d}x
$$
$$
= - 2 \int_ {0} ^ {1} \sum_ {n = 0} ^ {\infty} x ^ {2 n} \ln x \mathrm{d} x = - 2 \sum_ {n = 0} ^ {\infty} \int_ {0} ^ {1} x ^ {2 n} \ln x \mathrm{d} x
$$
$$
= 2 \sum_ {n = 0} ^ {\infty} \frac {1}{(2 n + 1) ^ {2}} = \frac {\pi^ {2}}{4}.
$$
