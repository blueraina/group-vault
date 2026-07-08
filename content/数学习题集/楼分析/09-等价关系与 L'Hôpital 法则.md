---
noteId: "楼分析/09-等价关系与-l'hôpital-法则"
shortId: 792
chapter: 9
title: "09-等价关系与 L'Hôpital 法则"
type: 讲义
source: 数学分析技巧选讲
depends_on:
  - "03-上、下极限的运用"
  - "08-连续性方法"
tags:
  - 楼分析
---

# 09-等价关系与 L'Hôpital 法则

## 依赖于
- [[03-上、下极限的运用]]
- [[08-连续性方法]]

## 被以下题目直接调用
- 无

## 正文部分

我们在此介绍 L'Hôpital 法则的运用中如何结合等价关系、变量代换、化简等来计算极限. 在极限的计算中, 我们例题中的很多措施其实是非常平凡的, 但不采用这些措施则会给计算过程带来很大的麻烦.

首先, 我们请大家注意以下这些极限以及它们的变形:
$$
\begin{aligned}
\lim _ {x \to 0} \frac {\sin x}{x} &= 1, \\[6pt]
\lim _ {x \to 0} \frac {\ln (1 + x)}{x} &= 1, \\[6pt]
\lim _ {x \to 0} \frac {\mathrm{e} ^ {x} - 1}{x} &= 1, \\[6pt]
\lim _ {x \to 0} \frac {(1 + x) ^ {\alpha} - 1}{x} &= \alpha , \quad \forall \alpha \in \mathbb {R}, \\[6pt]
\lim _ {x \to 0 ^ {+}} x ^ {\alpha} \ln x &= 0, \quad \forall \alpha > 0, \\[6pt]
\lim _ {x \to + \infty} \frac {x ^ {\alpha}}{\mathrm{e} ^ {x}} &= 0, \quad \forall \alpha \in \mathbb {R}.
\end{aligned}
$$
进一步, 我们请大家关注以下几个明显的结果.

### 命题 9.1

设 $n \geqslant 1, \lim_{x \to 0} \frac{F(x)}{x} = 1, \lim_{x \to 0} \frac{f(x)}{x^n} = \ell \in [-\infty, +\infty]$ . 则
$$
\lim _ {x \to 0} \frac {f [ F (x) ]}{x ^ {n}} = \ell . \tag {9.1}
$$
### 命题 9.2

设 F 在点 0 的一个邻域内可导, 且 $\lim_{x\to0}F'(x)=A$ . 又设 $\lim_{x\to0}f(x)=\lim_{x\to0}g(x)=0$ , 且对 $0<|x|<\delta$ 成立 $f(x)\neq g(x)$ . 则 $^{(1)}$
$$
\lim _ {x \rightarrow 0} \frac {F [ f (x) ] - F [ g (x) ]}{f (x) - g (x)} = A. \tag {9.2}
$$
### 命题 9.3

设实函数 $f$ 在点0的一个邻域内解析且不恒为零. 则存在 $n \geqslant 0$ 以及 $c \neq 0$ 使得
$$
\lim _ {x \rightarrow 0} \frac {f (x)}{x ^ {n}} = c. \tag {9.3}
$$
结合[[#命题 9.1|命题9.1]]和9.3就可以得到

推论9.1 设 $\lim_{x\to 0}\frac{F(x)}{x} = 1$ ，实函数 $f,h$ 在点0附近解析， $h\not\equiv 0.$ 则
$$
\lim _ {x \rightarrow 0} \frac {f [ F (x) ]}{h (x)} = \lim _ {x \rightarrow 0} \frac {f (x)}{h (x)}.
$$
**注 9.1** ^zhu-9-1
在应用中, [[#命题 9.1|命题 9.1]] 和 9.2 常用于在一定条件下得到如下形式的等式:
$$
\lim _ {x \rightarrow 0} \frac {f [ F (x) ] - g [ F (x) ]}{h (x)} = \lim _ {x \rightarrow 0} \frac {f (x) - g (x)}{h (x)} \tag {9.4}
$$
以及
$$
\lim _ {x \rightarrow 0} \frac {F [ f (x) ] - F [ g (x) ]}{h (x)} = \lim _ {x \rightarrow 0} \frac {f (x) - g (x)}{h (x)}. \tag {9.5}
$$
### 命题 9.1

用于处理前者, 把内层的 F 去掉, 可称之为 "去核"; 而[[#命题 9.2|命题 9.2]] 用于处理后者, 把外层的 F 去掉, 可称之为 "去皮".

**注 9.2** ^zhu-9-2
就应试而言, 应用[[#命题 9.1|命题 9.1]]---9.3 以及推论 9.1 时, 宜给出必要的步骤或加上必要的说明.

### 例 9.1

> [!question] 例 9.1
> 求
> $$
> \lim_{x\to 0}\frac{\tan x - x}{x\sin^2x}.
> $$

**解**
对于此例的分母, 宜先利用等价关系, 而不宜直接对分母求导.
$$
\begin{aligned}
\lim _ {x \rightarrow 0} \frac {\tan x - x}{x \sin^ {2} x} &= \lim _ {x \rightarrow 0} \frac {\tan x - x}{x ^ {3}} \quad (\sin x \sim x) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {\sec^ {2} x - 1}{3 x ^ {2}} \quad (\text {L'Hôpital法则}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {\tan^ {2} x}{3 x ^ {2}} \quad (\text {整理}) \\[6pt]
&= \frac {1}{3}.
\end{aligned}
$$
### 例 9.2

> [!question] 例 9.2
> 求
> $$
> \lim_{x\to 0}\left(\frac{1}{x^2} -\cot^2 x\right).
> $$

**解**
计算过程中能够化简的应尽量化简.
$$
\begin{aligned}
\lim _ {x \rightarrow 0} \left(\frac {1}{x ^ {2}} - \cot^ {2} x\right) &= \lim _ {x \rightarrow 0} \frac {\tan^ {2} x - x ^ {2}}{x ^ {2} \tan^ {2} x} \quad (\text {整理}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {(\tan x - x) (\tan x + x)}{x ^ {4}} \quad (\tan x \sim x)
\end{aligned}
$$
$$
= 2 \lim _ {x \rightarrow 0} \frac {\tan x - x}{x ^ {3}} \quad (\tan x \sim x)
$$
$$
= \frac {2}{3}. \quad (\text {见上例})
$$
### 例 9.3

> [!question] 例 9.3
> 求
> $$
> \lim_{x\to \infty}\left[x - x^2\ln \left(1 + \frac{1}{x}\right)\right].
> $$

**解**
适当的变量代换可以使计算过程更简捷.
$$
\lim _ {x \rightarrow \infty} \left[ x - x ^ {2} \ln \left(1 + \frac {1}{x}\right)\right] = \lim _ {x \rightarrow 0} \left[ \frac {1}{x} - \frac {\ln (1 + x)}{x ^ {2}} \right] \quad (\text {变量代换})
$$
$$
= \lim _ {x \rightarrow 0} \frac {x - \ln (1 + x)}{x ^ {2}} \quad (\text {整理})
$$
$$
= \lim _ {x \rightarrow 0} \frac {1 - \frac {1}{1 + x}}{2 x} \quad (\text {L'Hôpital法则})
$$
$$
= \frac {1}{2}.
$$
### 例 9.4

> [!question] 例 9.4
> 求
> $$
> \lim_{x\to 0}\frac{(1 + x)^{\frac{1}{x}} - \mathrm{e}}{x}.
> $$

**解**
$\lim_{x\to 0}\frac{(1 + x)^{\frac{1}{x}} - \mathrm{e}}{x} = \lim_{x\to 0}\frac{\mathrm{e}^{\frac{\ln(1 + x)}{x} - 1} - 1}{x}\mathrm{e}$ （整理）
$$
= \lim _ {x \rightarrow 0} \frac {\frac {\ln (1 + x)}{x} - 1}{x} \mathrm{e} \quad \left(\mathrm{e} ^ {y} - 1 \sim y (y \rightarrow 0)\right)
$$
$$
= \lim _ {x \rightarrow 0} \frac {\ln (1 + x) - x}{x ^ {2}} \mathrm{e} \quad (\text {整理})
$$
$$
= \lim _ {x \rightarrow 0} \frac {\frac {1}{1 + x} - 1}{2 x} \mathrm{e} \quad (\text {L'Hôpital法则})
$$
$$
= - \frac {\mathrm{e}}{2}.
$$
### 例 9.5

> [!question] 例 9.5
> 求
> $$
> \lim_{x\to 0^{+}}x^{(x^x -1)}
> $$

**解**
$\lim_{x\to 0^{+}}x^{(x^{x} - 1)} = \lim_{x\to 0^{+}}\mathrm{e}^{(\mathrm{e}^{x\ln x} - 1)\ln x}$ (整理)
$$
= \lim _ {x \rightarrow 0 ^ {+}} \mathrm{e} ^ {x \ln x \cdot \ln x} \quad (\mathrm{e} ^ {y} - 1 \sim y (y \rightarrow 0))
$$
$$
= 1. \quad (x \ln^ {2} x \rightarrow 0)
$$
### 例 9.6

> [!question] 例 9.6
> 求
> $$
> \lim_{x\to 0}\left(\frac{1 + \tan x}{1 + \sin x}\right)^{\frac{1}{\sin^3x}}.
> $$

**解**
考虑
$$
\lim _ {x \to 0} \frac {\ln \frac {1 + \tan x}{1 + \sin x}}{\sin^ {3} x}.
$$
法 I 下面第一步中把分子拆开是求导时一个常用的技巧.
$$
\begin{aligned}
\lim _ {x \rightarrow 0} \frac {\ln \frac {1 + \tan x}{1 + \sin x}}{\sin^ {3} x} &= \lim _ {x \rightarrow 0} \frac {\ln (1 + \tan x) - \ln (1 + \sin x)}{x ^ {3}} \quad (\sin x \sim x) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {\frac {\sec^ {2} x}{1 + \tan x} - \frac {\cos x}{1 + \sin x}}{3 x ^ {2}} \quad (\text {L'Hôpital法则}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {\sec^ {2} x - \cos x + \tan^ {2} x \sin x}{3 x ^ {2} (1 + \tan x) (1 + \sin x)} \quad (\text {整理}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {\sec^ {2} x - \cos x}{3 x ^ {2}} \quad (\text {化简}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {2 \sec^ {2} x \tan x + \sin x}{6 x} \quad (\text {L'Hôpital法则}) \\[6pt]
&= \frac {1}{2}. \quad (\tan x \sim x, \sin x \sim x)
\end{aligned}
$$
或者我们可以这样计算倒数第二步的极限:
$$
\begin{aligned}
\lim _ {x \rightarrow 0} \frac {\sec^ {2} x - \cos x}{3 x ^ {2}} &= \lim _ {x \rightarrow 0} \frac {1 - \cos^ {3} x}{3 x ^ {2} \cos^ {2} x} \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {1 - \cos^ {3} x}{3 x ^ {2}} \quad (\text {化简}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {3 \cos^ {2} x \sin x}{6 x} \quad (\mathrm{L} ^ {\prime} \text {Hôpital法则}) \\[6pt]
&= \frac {1}{2}.
\end{aligned}
$$
这对于不熟悉求导公式 $(\sec x)' = \sec x \tan x$ 的读者不失为一个简便的方法.
$$
\begin{aligned}
&= \lim _ {x \rightarrow 0} \frac {\tan x - \sin x}{x ^ {3} (1 + \sin x)} \quad (\text {整理}) \\[6pt]
&\quad = \lim _ {x \to 0} \frac {\tan x - \sin x}{x ^ {3}} \quad (\text {化简}) \\[6pt]
&\quad = \lim _ {x \rightarrow 0} \frac {\sec^ {2} x - \cos x}{3 x ^ {2}} \quad (\mathrm{L} ^ {\prime} \text {Hôpital法则})
\end{aligned}
$$
**法II**
$$
\lim_{x\to0}\frac{\ln\frac{1+\tan x}{1+\sin x}}{\sin^{3}x}=\lim_{x\to0}\frac{\frac{1+\tan x}{1+\sin x}-1}{x^{3}}\quad(\ln(1+y)\sim y(y\to0),\sin x\sim x)
$$
$$
= \frac {1}{2}. \quad (\text {见法I})
$$
$$
\begin{aligned}
&= \lim _ {x \rightarrow 0} \frac {\tan x - \sin x}{x ^ {3} (1 + \sin x)} \quad (\text {整理}) \\[6pt]
&\quad = \lim _ {x \rightarrow 0} \frac {1 - \cos x}{x ^ {2}} \quad (\tan x \sim x) \\[6pt]
&\quad = \lim _ {x \rightarrow 0} \frac {\sin x}{2 x} \quad (\text {L'Hôpital法则}) \\[6pt]
&\quad = \frac {1}{2}. \quad (\sin x \sim x)
\end{aligned}
$$
**法III**
$$
\lim_{x\to0}\frac{\ln\frac{1+\tan x}{1+\sin x}}{\sin^{3}x}=\lim_{x\to0}\frac{\frac{1+\tan x}{1+\sin x}-1}{x^{3}}\quad(\ln(1+y)\sim y(y\to0),\sin x\sim x)
$$
$$
\begin{aligned}
&= \lim _ {x \rightarrow 0} \frac {\tan x - \sin x}{x ^ {3}} \quad (\text {命题} 9. 2, \text {等价关系}) \\[6pt]
&\quad = \lim _ {x \rightarrow 0} \frac {1 - \cos x}{x ^ {2}} \quad (\tan x \sim x) \\[6pt]
&\quad = \lim _ {x \rightarrow 0} \frac {\sin x}{2 x} \quad (\text {L'Hôpital法则}) \\[6pt]
&\quad = \frac {1}{2}. \quad (\sin x \sim x)
\end{aligned}
$$
法IV $\lim_{x\to 0}\frac{\ln(1 + \tan x) - \ln(1 + \sin x)}{\sin^3x}$

从这个例子我们可以看出, 早一点使用等价关系, 可以简化计算. 法III、法IV的等价关系运用得比法II彻底, 所以也更简捷, 更容易避免计算错误.

最后我们有
$$
\lim _ {x \rightarrow 0} \left(\frac {1 + \tan x}{1 + \sin x}\right) ^ {\frac {1}{\sin^ {3} x}} = \mathrm{e} ^ {\frac {1}{2}}.
$$
### 例 9.7

> [!question] 例 9.7
> 求
> $$
> \lim_{x\to 0}\frac{\sin(\sin x) - x}{x^3}.
> $$

**解**
法 I 用 L'Hôpital 法则.
$$
\begin{aligned}
\lim _ {x \rightarrow 0} \frac {\sin (\sin x) - x}{x ^ {3}} &= \lim _ {x \rightarrow 0} \frac {\cos (\sin x) \cos x - 1}{3 x ^ {2}} \quad \text {(L'Hôpital法则)} \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {- \sin (\sin x) \cos^ {2} x - \cos (\sin x) \sin x}{6 x} \quad \text {(L'Hôpital法则)} \\[6pt]
&= - \frac {1}{3}. \quad (\sin (\sin x) \sim x, \sin x \sim x)
\end{aligned}
$$
**法II**
$\lim_{x\to 0}\frac{\sin(\sin x) - x}{x^3} = \lim_{x\to 0}\frac{\sin x - \arcsin x}{x^3}$ （[[#命题 9.1|命题9.1]]或[[#命题 9.2|命题9.2]]）
$$
\begin{aligned}
&= \lim _ {x \rightarrow 0} \frac {\cos x - \frac {1}{\sqrt {1 - x ^ {2}}}}{3 x ^ {2}} \quad (\text {L'Hôpital法则}) \\[6pt]
&\quad = \lim _ {x \rightarrow 0} \frac {- \sin x - x \left(1 - x ^ {2}\right) ^ {- 3 / 2}}{6 x} \quad \text {(L'Hôpital法则)} \\[6pt]
&\quad = - \frac {1}{3}.
\end{aligned}
$$
**法III**
$$
\lim_{x\to 0}\frac{\sin(\sin x) - x}{x^3}
$$
$$
= \lim _ {x \rightarrow 0} \frac {\sin (\sin x) - \sin x}{x ^ {3}} + \lim _ {x \rightarrow 0} \frac {\sin x - x}{x ^ {3}} \quad (\text {拆项})
$$
$$
= 2 \lim _ {x \rightarrow 0} \frac {\sin x - x}{x ^ {3}} \quad (\text {命题} 9. 1 \text {或命题} 9. 2)
$$
$$
= \dots = - \frac {1}{3}.
$$
### 例 9.8

> [!question] 例 9.8
> 求
> $$
> \lim_{x\to 0}\frac{\tan(\tan x) - \sin(\sin x)}{\tan x - \sin x}.
> $$

**解**
$$
\lim_{x\to 0}\frac{\tan(\tan x) - \sin(\sin x)}{\tan x - \sin x}
$$
$$
\begin{aligned}
&= \lim _ {x \rightarrow 0} \frac {\tan (\tan x) - \tan (\sin x)}{\tan x - \sin x} + \lim _ {x \rightarrow 0} \frac {\tan (\sin x) - \sin (\sin x)}{\tan x - \sin x} \quad (\text {分拆}) \\[6pt]
&\quad = 1 + 1 \quad (\text {第一式命题} 9. 2, \text {第二式命题} 9. 1) \\[6pt]
&\quad = 2.
\end{aligned}
$$
### 例 9.9

> [!question] 例 9.9
> 求
> $$
> \lim_{x\to 0}\left[\frac{1}{\ln(x + \sqrt{1 + x^2})} -\frac{1}{\ln(1 + x)}\right].
> $$

**法 I**
$$
\begin{aligned}
\lim_{x\to 0}\left[\frac{1}{\ln(x+\sqrt{1+x^2})}-\frac{1}{\ln(1+x)}\right]
&= \lim_{x\to 0}\frac{-\ln\frac{x+\sqrt{1+x^2}}{1+x}}
{\ln(x+\sqrt{1+x^2})\ln(1+x)}
\quad(\text{通分}) \\[6pt]
&= \lim_{x\to 0}\frac{1-\frac{x+\sqrt{1+x^2}}{1+x}}{x^2}
\quad(\text{等价关系}) \\[6pt]
&= \lim_{x\to 0}\frac{1-\sqrt{1+x^2}}{x^2}
\quad(\text{整理简化}) \\[6pt]
&= -\frac{1}{2}.
\end{aligned}
$$

**法II**
若利用[[#命题 9.2|命题 9.2]], 取 $F(x) = \ln(1 + x)$ , 则 $\lim_{x \to 0} F'(x) = 1$ . 因此, 本例也可以这样写
$$
\begin{aligned}
\lim _ {x \to 0} \left[ \frac {1}{\ln (x + \sqrt {1 + x ^ {2}})} - \frac {1}{\ln (1 + x)} \right] &= \lim _ {x \rightarrow 0} \frac {\ln (1 + x) - \ln \left(x + \sqrt {1 + x ^ {2}}\right)}{\ln \left(x + \sqrt {1 + x ^ {2}}\right) \ln (1 + x)} \quad (\text {通分}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {x - (x + \sqrt {1 + x ^ {2}} - 1)}{x ^ {2}} \quad (\text {命题9.2,等价关系}) \\[6pt]
&= \lim _ {x \rightarrow 0} \frac {1 - \sqrt {1 + x ^ {2}}}{x ^ {2}} \quad (\text {整理简化}) \\[6pt]
&= - \frac {1}{2}. \quad (\text {等价关系})
\end{aligned}
$$
在本例中, 由于 $F$ 是对数函数, 其函数值的差可以化为商的函数值, 因此, 这两种解法没有多大的区别.

### 例 9.10

> [!question] 例 9.10
> 求
> $$
> \lim_{x\to 0}\frac{\left(1 + \frac{x}{1 + x}\right)^{\frac{1 + x}{x}} - (1 + \tan x)^{\frac{1}{\tan x}}}{x^2}.
> $$

**解**
考虑 $F(x) = (1 + x)^{\frac{1}{x}}$ ，则 $\lim_{x\to 0}F'(x) = -\frac{\mathrm{e}}{2}$ . 因此
$$
\begin{aligned}
&\lim_{x\to 0}
\frac{\left(1+\frac{x}{1+x}\right)^{\frac{1+x}{x}}
-(1+\tan x)^{\frac{1}{\tan x}}}{x^2} \\[6pt]
&= -\frac{\mathrm{e}}{2}
\lim_{x\to 0}\frac{\frac{x}{1+x}-\tan x}{x^2}
\quad(\text{命题 9.2}) \\[6pt]
&= -\frac{\mathrm{e}}{2}
\lim_{x\to 0}\frac{\frac{1}{(1+x)^2}-\sec^2 x}{2x}
\quad(\text{L'Hôpital 法则}) \\[6pt]
&= -\frac{\mathrm{e}}{2}
\lim_{x\to 0}\frac{\frac{1}{(1+x)^2}-1-\tan^2x}{2x}
\quad(\text{等价关系}) \\[6pt]
&= \frac{\mathrm{e}}{2}.
\end{aligned}
$$
### 例 9.11

> [!question] 例 9.11
> 计算
> $$
> \lim_{x\to 0}\frac{\tan[1 + \cos(\tan x)] - \tan(1 + \cos x)}{x^4}.
> $$

**解**
取 $F(x) = \tan (1 + \cos x)$ , 则 $F'(0) = 0$ . 但此时不能由[[#命题 9.2|命题9.2]]得到如下结果:
$$
\lim _ {x \to 0} \frac {\tan [ 1 + \cos (\tan x) ] - \tan (1 + \cos x)}{x ^ {4}} = 0 \cdot \lim _ {x \to 0} \frac {\tan x - x}{x ^ {4}} = 0.
$$
其原因自然是因为 $\lim_{x\to 0}\frac{\tan x - x}{x^4}$ 不存在. 正确的解法是利用Lagrange中值定理，对点0附近的每个 $x$ ，存在 $\theta_{x}\in (0,1)$ 使得
$$
F (\tan x) - F (x) = F ^ {\prime} [ x + \theta_ {x} (\tan x - x) ] (\tan x - x).
$$
从而利用 $\lim_{x\to 0}\frac{F'(x)}{x} = -\sec^22$ 可得
$$
\begin{aligned}
\lim _ {x \to 0} \frac {\tan [ 1 + \cos (\tan x) ] - \tan (1 + \cos x)}{x ^ {4}} &= \lim _ {x \rightarrow 0} \frac {F ^ {\prime} [ x + \theta_ {x} (\tan x - x) ]}{x} \lim _ {x \rightarrow 0} \frac {\tan x - x}{x ^ {3}} \\[6pt]
&= - \frac {1}{3 \cos^ {2} 2}.
\end{aligned}
$$
我们把上述结果一般化成以下结果.

### 命题 9.4

设 $\alpha, \beta \in R$ ，实函数 $F, \varphi, \psi$ 满足
$$
\lim _ {x \rightarrow 0} \frac {F ^ {\prime} (x)}{x ^ {\alpha}} = A, \quad \lim _ {x \rightarrow 0} \frac {\varphi (x)}{x} = \lim _ {x \rightarrow 0} \frac {\psi (x)}{x} = 1,
$$
以及
$$
\lim _ {x \to 0} \frac {\varphi (x) - \psi (x)}{x ^ {\beta}} = B.
$$
则
$$
\lim _ {x \to 0} \frac {F [ \varphi (x) ] - F [ \psi (x) ]}{x ^ {\alpha + \beta}} = A B.
$$
### 例 9.12

> [!question] 例 9.12
> 求
> $$
> \lim_{x\to 0}\frac{\sin x - \arctan x}{\tan x - \arcsin x}.
> $$

**解**
由[[#命题 9.3|命题9.3]], 存在 $n \geqslant 0$ 使得 $\lim_{x \to 0} \frac{\sin x - \arctan x}{x^n} = c \in \mathbb{R} \setminus \{0\}$ . 于是
$$
\lim _ {x \to 0} \frac {\tan x - \arcsin x}{x ^ {n}} = \lim _ {x \to 0} \frac {\tan (\sin x) - x}{x ^ {n}} \tag {命题9.1}
$$
$$
= \lim _ {x \rightarrow 0} \frac {\sin x - \arctan x}{x ^ {n}} \quad (\text {命题} 9. 2)
$$
$$
= c.
$$
所以 $\lim_{x\to 0}\frac{\sin x - \arctan x}{\tan x - \arcsin x} = 1.$

一般地, 我们有

### 例 9.13

> [!question] 例 9.13
> 设实函数 $f$ 和 $g$ 在点 $x = 0$ 的一个邻域内解析且不恒等. 若 $\lim_{x\to 0}\frac{f(x)}{x} = \lim_{x\to 0}\frac{g(x)}{x} = 1$ ，则 $\lim_{x\to 0}\frac{f(x) - g(x)}{g^{-1}(x) - f^{-1}(x)} = 1$ ，其中 $f^{-1}, g^{-1}$ 分别为 $f, g$ 的反函数.

作为[[#例 9.13|例 9.13]] 的又一个特例, 我们有

### 例 9.14

> [!question] 例 9.14
> $$
> \lim_{x\to 0}\frac{\sin(\tan x) - \tan(\sin x)}{\arcsin(\arctan x) - \arctan(\arcsin x)} = 1.
> $$

而直接计算[[#例 9.14|例 9.14]] 中分子、分母的阶, 并不是那么容易.

### 例 9.15

> [!question] 例 9.15
> 计算
> $$
> \lim_{x\to 0}\frac{\sin(\tan x) - \tan(\sin x)}{x^7}.
> $$

**解**
此类问题用 Taylor 展开式解决是自然的. 我们设
$$
f (x) = x + a _ {3} x ^ {3} + a _ {5} x ^ {5} + a _ {7} x ^ {7} + o \left(x ^ {7}\right), \quad x \rightarrow 0,
$$
$$
g (x) = x + b _ {3} x ^ {3} + b _ {5} x ^ {5} + b _ {7} x ^ {7} + o (x ^ {7}), \quad x \to 0.
$$
则
$$
\begin{aligned}
f (g (x)) &= g (x) + a _ {3} g ^ {3} (x) + a _ {5} g ^ {5} (x) + a _ {7} g ^ {7} (x) + o \left(x ^ {7}\right) \\[6pt]
&= x + b _ {3} x ^ {3} + b _ {5} x ^ {5} + b _ {7} x ^ {7} + a _ {3} (x + b _ {3} x ^ {3} + b _ {5} x ^ {5}) ^ {3} + \\[6pt]
&\quad a _ {5} (x + b _ {3} x ^ {3}) ^ {5} + a _ {7} x ^ {7} + o (x ^ {7}) \\[6pt]
&= x + \left(a _ {3} + b _ {3}\right) x ^ {3} + \left(a _ {5} + b _ {5} + 3 a _ {3} b _ {3}\right) x ^ {5} + \\[6pt]
&\quad (a _ {7} + b _ {7} + 3 a _ {3} b _ {3} ^ {2} + 3 a _ {3} b _ {5} + 5 a _ {5} b _ {3}) x ^ {7} + o (x ^ {7}), \quad x \rightarrow 0
\end{aligned}
$$
因此，
$$
f [ g (x) ] - g [ f (x) ] = \left(3 a _ {3} b _ {3} ^ {2} - 3 a _ {3} ^ {2} b _ {3} + 2 a _ {5} b _ {3} - 2 a _ {3} b _ {5}\right) x ^ {7} + o \left(x ^ {7}\right), \quad x \rightarrow 0.
$$
由于相对来讲, 大家不熟悉 $\tan x$ 的 Taylor 展开式, 我们可以利用 $\arctan x$ 的 Taylor 展开式
$$
\arctan x = x - \frac {x ^ {3}}{3} + \frac {x ^ {5}}{5} - \frac {x ^ {7}}{7} + o (x ^ {7}), \quad x \rightarrow 0,
$$
$$
\sin x = x - \frac {x ^ {3}}{3 !} + \frac {x ^ {5}}{5 !} - \frac {x ^ {7}}{7 !} + o (x ^ {7}), \quad x \to 0.
$$
得到
$$
\begin{aligned}
\lim_{x\to 0}\frac{\sin(\tan x)-\tan(\sin x)}{x^7}
&= \lim_{x\to 0}
\frac{\sin x-\tan[\sin(\arctan x)]}{x^7}
\quad(\text{命题 9.1}) \\[6pt]
&= \lim_{x\to 0}
\frac{\arctan(\sin x)-\sin(\arctan x)}{x^7}
\quad(\text{命题 9.2}) \\[6pt]
&= \frac{1}{3!}\left(\frac{1}{3}-\frac{1}{3!}\right)
  +\frac{2}{3\cdot 5!}-\frac{2}{5\cdot 3!} \\[6pt]
&= -\frac{1}{30}.
\end{aligned}
$$
**注 9.3** ^zhu-9-3
显然, 我们也可以利用 $\sin (\arctan x) = \frac{x}{\sqrt{1 + x^2}}$ .

### 例 9.16

> [!question] 例 9.16
> 设 $f$ 在 $R$ 上连续, $b$ > $a$ > 0, 对任何 $x \in R$ , 成立
> $$
> \varliminf_ {t \to 0} \frac {f (x + b t) + f (x + a t) - f (x - a t) - f (x - b t)}{t} > 0,
> $$
> 其中上式左边的下极限有可能是 $+\infty$ 。证明 $f$ 严格单增。

**证明**
当 $a = 0$ 或 $a = b$ 时, 本质上, 本例就变为[[08-连续性方法#例 8.4|例8.4]]. 因此, 本例是[[08-连续性方法#例 8.4|例8.4]]的推广. 按以下的证明方法, 我们可以把结论推广到更一般的情形.

令 $F(x) = \int_0^x f(t)\mathrm{d}t(x\in \mathbb{R})$ ，则利用推广的L'Hôpital法则(参见[[03-上、下极限的运用#定理 3.2|定理3.2]])，
$$
\lim _ {t \rightarrow 0} \frac {a F (x + b t) + b F (x + a t) + b F (x - a t) + a F (x - b t) - 2 (a + b) F (x)}{t ^ {2}}
$$
$$
\geqslant \varliminf_ {t \rightarrow 0} \frac {a b [ f (x + b t) + f (x + a t) - f (x - a t) - f (x - b t) ]}{2 t} > 0.
$$
我们断言, $F$ 是严格凸函数. 这只要证明对于任意 $A < B$ 以及 $x \in (A, B)$ , 成立 $G(x) < 0$ , 其中
$$
G (x) = F (x) - F (A) - \frac {F (B) - F (A)}{B - A} (x - A).
$$
如若不然, 注意到 $G(A) = G(B) = 0$ , 我们有 $\xi \in (A, B)$ 使得 $G(\xi) = \max_{x \in [A, B]} G(x)$ . 易见
$$
\begin{aligned}
\lim _ {t \to 0} \frac {a F (\xi + b t) + b F (\xi + a t) + b F (\xi - a t) + a F (\xi - b t) - 2 (a + b) F (\xi)}{t ^ {2}} \\[6pt]
&\quad \geqslant \varliminf_ {t \rightarrow 0} \frac {a G (\xi + b t) + b G (\xi + a t) + b G (\xi - a t) + a G (\xi - b t) - 2 (a + b) G (\xi)}{t ^ {2}} \leqslant 0.
\end{aligned}
$$
得到矛盾. 因此, $F$ 是严格凸函数, 从而 $f = F'$ 严格单增.

类似地, 我们可以给出积分型的结果.

### 例 9.17

> [!question] 例 9.17
> 设 $f$ 在 $R$ 上连续, 对任何 $x \in R$ , 成立
> $$
> \varliminf_ {\delta \rightarrow 0 ^ {+}} \int_ {0} ^ {1} \frac {f (x + \delta t) - f (x - \delta t)}{\delta} \mathrm{d} t > 0,
> $$
> 其中上式左边的下极限有可能是 $+\infty$ 。证明 $f$ 严格单增。

**证明**
令 $F(x) = \int_{0}^{x}f(t)\mathrm{d}t(x\in \mathbb{R})$ ，易见
$$
\lim _ {\delta \rightarrow 0 ^ {+}} \int_ {0} ^ {1} \frac {F (x + \delta t) + F (x - \delta t) - 2 F (x)}{t} \mathrm{d} t = 0.
$$
则类似上一例, 有
$$
\begin{aligned}
\varliminf_ {\delta \to 0 ^ {+}} \int_ {0} ^ {1} \frac {F (x + \delta t) + F (x - \delta t) - 2 F (x)}{\delta^ {2} t} \mathrm{d} t \\[6pt]
&\quad \geqslant \varliminf_ {\delta \rightarrow 0 ^ {+}} \frac {1}{2 \delta} \frac {\partial}{\partial \delta} \int_ {0} ^ {1} \frac {F (x + \delta t) + F (x - \delta t) - 2 F (x)}{t} \mathrm{d} t \\[6pt]
&\quad = \varliminf_ {\delta \rightarrow 0 ^ {+}} \int_ {0} ^ {1} \frac {f (x + \delta t) - f (x - \delta t)}{2 \delta} \mathrm{d} t > 0.
\end{aligned}
$$
进而可证 $F$ 是严格凸函数. 最后得到 $f$ 严格单增.

**注 9.4** ^zhu-9-4
在《大学数学》的问题征解中, 梅加强提供了如下问题: 设 $f \in C(R)$ 满足: $\forall x \in \mathbb{R}$ , 成立
$$
\lim _ {\delta \rightarrow 0} \frac {1}{\delta^ {3}} \int_ {- \delta} ^ {\delta} f (x + t) t \mathrm{d} t = 0,
$$
则 $f$ 恒等于常数.

可以利用上例的方法给出此题的一个解答. 我们把它留给读者.
