---
chapter: 2
title: "02-Euler 公式"
type: 讲义
source: 数学分析技巧选讲
depends_on: []
tags:
  - 楼分析
---

# 02-Euler 公式

## 依赖于
- 无显式依赖

## 被以下题目直接调用
- 无

## 正文部分

Euler (欧拉) 公式 $e^{i\theta} = \cos\theta + i\sin\theta$ 将三角函数与复指数函数联系起来, 对于更好地理解数学分析以及进行一些计算起着重要的作用.

我们可以用以下三种方法之一来定义复指数函数 $e^{z}$，其中 $z$ 是一个复数.

### 定义 2.1

对于 $a, b \in \mathbb{R}$，定义
$$
\mathrm{e}^{a+\mathrm{i}b}:=\mathrm{e}^{a}(\cos b+\mathrm{i}\sin b). \tag{2.1}
$$
### 定义 2.2

对于 $z \in \mathbb{C}$，定义
$$
\mathrm{e}^{z}:=\lim_{n\to+\infty}\left(1+\frac{z}{n}\right)^{n}. \tag{2.2}
$$
### 定义 2.3

对于 $z \in \mathbb{C}$，定义
$$
\mathrm{e}^{z}:=\sum_{n=0}^{\infty}\frac{z^{n}}{n!}. \tag{2.3}
$$
通常, 教材中采用[[#定义 2.3|定义 2.3]], 但由于涉及幂级数, 导致该定义的引入较晚. 由中学的知识作为基础, 我们可采用[[#定义 2.1|定义 2.1]] 以便早日引入这一关系式.

容易证明上面三个定义是等价的. 比如, [[#定义 2.1|定义 2.1]] 和[[#定义 2.2|定义 2.2]] 的等价性可由下式得到: $\forall a, b \in \mathbb{R}$ ,
$$
\begin{array}{l} \lim _ {n \to + \infty} \left(1 + \frac {a + \mathrm{i} b}{n}\right) ^ {n} \\ = \lim _ {n \rightarrow + \infty} \left[\left(1 + \frac {a}{n}\right) ^ {2} + \frac {b ^ {2}}{n ^ {2}} \right] ^ {\frac {n}{2}}. \\ \lim _ {n \to + \infty} \left\{\cos \left[ \arcsin \frac {b}{\sqrt {(n + a) ^ {2} + b ^ {2}}} \right] + \mathrm{i} \sin \left[ \arcsin \frac {b}{\sqrt {(n + a) ^ {2} + b ^ {2}}} \right] \right\} ^ {n} \\ = \lim _ {n \rightarrow + \infty} \left(1 + \frac {2 a}{n} + \frac {a ^ {2} + b ^ {2}}{n ^ {2}}\right) ^ {\frac {n}{2}}. \\ \end{array}
$$
$$
\begin{array}{l} \lim _ {n \to + \infty} \left\{\cos \left[ n \arcsin \frac {b}{\sqrt {(n + a) ^ {2} + b ^ {2}}} \right] + \mathrm{i} \sin \left[ n \arcsin \frac {b}{\sqrt {(n + a) ^ {2} + b ^ {2}}} \right] \right\} \\ = \mathrm{e} ^ {a} (\cos b + \mathrm{i} \sin b). \\ \end{array}
$$
还可以证明 $\mathrm{e}^z$ 满足指数函数的一些基本性质：

1.  对于复数 $z_{1}, z_{2} \in \mathbb{C}$ , 成立 $\mathrm{e}^{z_1 + z_2} = \mathrm{e}^{z_1}\mathrm{e}^{z_2}$ .

2.  对于整数 $m \in \mathbb{Z}$ 和复数 $z \in \mathbb{C}$ , 成立 $(\mathrm{e}^z)^m = \mathrm{e}^{mz}$ .

3.  对于实数 $a, b$ , 成立 $|\mathrm{e}^{a + \mathrm{i}b}| = \mathrm{e}^a$ .

4.  若对于实函数 $f, g$ , 定义
$$
\frac {\mathrm{d}}{\mathrm{d} x} [ f (x) + \mathrm{i} g (x) ] := \frac {\mathrm{d}}{\mathrm{d} x} f (x) + \mathrm{i} \frac {\mathrm{d}}{\mathrm{d} x} g (x),
$$
则 $\forall \lambda \in \mathbb{C}$
$$
\frac {\mathrm{d}}{\mathrm{d} x} \mathrm{e} ^ {\lambda x} = \lambda \mathrm{e} ^ {\lambda x}.
$$
5.  若对于实函数 $f, g$ , 定义
$$
\int [ f (x) + \mathrm{i} g (x) ] \mathrm{d} x := \int f (x) \mathrm{d} x + \mathrm{i} \int g (x) \mathrm{d} x,
$$
则 $\forall \lambda \in \mathbb{C},\lambda \neq 0,$ 有
$$
\int \mathrm{e} ^ {\lambda x} \mathrm{d} x = \frac {\mathrm{e} ^ {\lambda x}}{\lambda} + C,
$$
其中 $C$ 是复常数.

6.  若对于 $x > 0$ 以及复数 $\lambda \in \mathbb{C}$ , 定义 $x^{\lambda} := \mathrm{e}^{\lambda \ln x}$ , 则当 $\lambda \neq -1$ 时, 有
$$
\int x ^ {\lambda} \mathrm{d} x = \int \mathrm{e} ^ {\lambda \ln x} \mathrm{d} x = \int \mathrm{e} ^ {(\lambda + 1) \ln x} \mathrm{d} \ln x = \frac {1}{\lambda + 1} x ^ {\lambda + 1} + C,
$$
其中 C 是复常数. 类似地,
$$
\frac {\mathrm{d}}{\mathrm{d} x} x ^ {\lambda} = \frac {\mathrm{d}}{\mathrm{d} x} \mathrm{e} ^ {\lambda \ln x} = \mathrm{e} ^ {\lambda \ln x} \cdot \frac {\lambda}{x} = \lambda x ^ {\lambda - 1}.
$$
今后, 我们用 $\operatorname{Re} z$ 表示复数 $z$ 的实部, 用 $\operatorname{Im} z$ 表示 $z$ 的虚部.

### 例 2.1

> [!question] 例 2.1
> 求
> $$
> \left(\mathrm{e}^{x}\cos\sqrt{3}x\right)^{(98)}
> $$

$$
(\mathrm{e}^x\cos \sqrt{3} x)^{(98)} = (\mathrm{Re}\mathrm{e}^{x + \mathrm{i}\sqrt{3} x})^{(98)} = \mathrm{Re}\big(\mathrm{e}^{x + \mathrm{i}\sqrt{3} x}\big)^{(98)}
$$
$$
= \operatorname{Re} \left[ (1 + \mathrm{i} \sqrt {3}) ^ {98} \mathrm{e} ^ {x + \mathrm{i} \sqrt {3} x} \right] = \operatorname{Re} \left[ (2 \mathrm{e} ^ {\frac {\mathrm{i} \pi}{3}}) ^ {98} \mathrm{e} ^ {x + \mathrm{i} \sqrt {3} x} \right]
$$
$$
= \mathrm{Re} \left(2 ^ {98} \mathrm{e} ^ {x + \mathrm{i} \sqrt {3} x + \mathrm{i} \frac {2 \pi}{3}}\right) = 2 ^ {98} \mathrm{e} ^ {x} \cos \left(\sqrt {3} x + \frac {2 \pi}{3}\right).
$$
### 例 2.2

> [!question] 例 2.2
> 计算
> $$
> \int \mathrm{e}^{2x}\sin 3x\,\mathrm{d}x
> $$

$$
\begin{aligned}
\int \mathrm{e}^{2x}\sin 3x\,\mathrm{d}x
&= \operatorname{Im}\int \mathrm{e}^{(2+3\mathrm{i})x}\,\mathrm{d}x \\
&= \operatorname{Im}\left[\frac{1}{2+3\mathrm{i}}\,\mathrm{e}^{(2+3\mathrm{i})x}\right]+C \\
&= \operatorname{Im}\left[\frac{2-3\mathrm{i}}{13}\,\mathrm{e}^{2x}(\cos 3x+\mathrm{i}\sin 3x)\right]+C \\
&= \frac{2\sin 3x-3\cos 3x}{13}\,\mathrm{e}^{2x}+C.
\end{aligned}
$$
### 例 2.3

> [!question] 例 2.3
> 计算
> $$
> \int_{0}^{\frac{\pi}{2}}\sin^{10}x\,\mathrm{d}x
> $$

$$
\begin{aligned}
\int_{0}^{\frac{\pi}{2}}\sin^{10}x\,\mathrm{d}x
&= \int_{0}^{\frac{\pi}{2}}\left(\frac{\mathrm{e}^{\mathrm{i}x}-\mathrm{e}^{-\mathrm{i}x}}{2\mathrm{i}}\right)^{10}\,\mathrm{d}x \\
&= \frac{1}{2^{10}}\int_{0}^{\frac{\pi}{2}}\sum_{k=0}^{10}C_{10}^{k}(-1)^{k+1}\mathrm{e}^{(10-2k)\mathrm{i}x}\,\mathrm{d}x \\
&= \frac{1}{2^{10}}\cdot C_{10}^{5}\cdot \frac{\pi}{2}
 = \frac{63\pi}{512}.
\end{aligned}
$$
### 例 2.4

> [!question] 例 2.4
> 设 $q \in \mathbb{R}, n \geqslant 1$，计算
> $$
> \frac{\mathrm{d}^{n}}{\mathrm{d}x^{n}}(x^{q}\cos \ln x)
> $$

$$
\begin{array}{l}
\frac{\mathrm{d}^{n}}{\mathrm{d}x^{n}}(x^{q}\cos\ln x)=\operatorname{Re}\frac{\mathrm{d}^{n}}{\mathrm{d}x^{n}}(x^{q}\mathrm{e}^{\mathrm{i}\ln x})=\operatorname{Re}\frac{\mathrm{d}^{n}}{\mathrm{d}x^{n}}x^{q+\mathrm{i}},\\
= \operatorname{Re}\left[x^{q+\mathrm{i}-n}\prod_{k=0}^{n-1}(q-k+\mathrm{i})\right].
\end{array}
$$
### 例 2.5

> [!question] 例 2.5
> 计算
> $$
> \int \cos \ln x\,\mathrm{d}x
> $$

$$
\begin{array}{l}
\int \cos \ln x\,\mathrm{d}x=\operatorname{Re}\int \mathrm{e}^{\mathrm{i}\ln x}\,\mathrm{d}x=\operatorname{Re}\int x^{\mathrm{i}}\,\mathrm{d}x,\\
= \operatorname{Re}\left(\frac{1}{1+\mathrm{i}}x^{1+\mathrm{i}}\right)+C,\\
= \frac{x}{2}(\cos \ln x+\sin \ln x)+C.
\end{array}
$$
### 例 2.6

> [!question] 例 2.6
> 设 $a,b>0$，计算
> $$
> \int_{0}^{1}\frac{x^{b}-x^{a}}{\ln x}\cos\ln x\,\mathrm{d}x
> $$

$$
\begin{aligned}
\int_{0}^{1}\frac{x^{b}-x^{a}}{\ln x}\cos\ln x\,\mathrm{d}x
&= \int_{0}^{1}\mathrm{d}x\int_{a}^{b}x^{y}\cos\ln x\,\mathrm{d}y \\
&= \int_{a}^{b}\mathrm{d}y\int_{0}^{1}x^{y}\cos\ln x\,\mathrm{d}x \\
&= \operatorname{Re}\int_{a}^{b}\mathrm{d}y\int_{0}^{1}x^{y+\mathrm{i}}\,\mathrm{d}x \\
&= \operatorname{Re}\int_{a}^{b}\frac{1}{y+1+\mathrm{i}}\,\mathrm{d}y \\
&= \int_{a}^{b}\frac{y+1}{(y+1)^{2}+1}\,\mathrm{d}y
 = \frac{1}{2}\ln\frac{(b+1)^{2}+1}{(a+1)^{2}+1}.
\end{aligned}
$$
### 例 2.7

> [!question] 例 2.7
> 求
> $$
> \sum_{n=1}^{\infty}\frac{\sin nx}{n!}
> $$

$$
\sum_{n=1}^{\infty}\frac{\sin nx}{n!}
= \operatorname{Im}\sum_{n=1}^{\infty}\frac{\mathrm{e}^{\mathrm{i}nx}}{n!}
= \operatorname{Im}\bigl(\mathrm{e}^{\mathrm{e}^{\mathrm{i}x}}-1\bigr)
= \operatorname{Im}\,\mathrm{e}^{\cos x+\mathrm{i}\sin x}
= \mathrm{e}^{\cos x}\sin(\sin x).
$$
### 例 2.8

> [!question] 例 2.8
> 求
> $$
> \sum_{n=1}^{\infty}\frac{\sin nx}{n}
> $$

本例中, 我们希望给出直接计算上述级数的一种方法. 我们只需要关心 $x\in(0,2\pi)$ 的情形. 考虑级数
$$
\sum_{n=1}^{\infty}\frac{t^{n}\mathrm{e}^{\mathrm{i}nx}}{n}, \qquad t\in[0,1].
$$
利用级数收敛的 Dirichlet (狄利克雷) 判别法, 不难看到, 对于任何 $x\in(0,2\pi)$, 前式作为 $t$ 的幂级数, 在 $[0,1]$ 上都是收敛的. 于是,
$$
\begin{aligned}
\sum_{n=1}^{\infty}\frac{\sin nx}{n}
&= \operatorname{Im}\sum_{n=1}^{\infty}\frac{\mathrm{e}^{\mathrm{i}nx}}{n}
 = \operatorname{Im}\int_{0}^{1}\sum_{n=1}^{\infty}t^{n-1}\mathrm{e}^{\mathrm{i}nx}\,\mathrm{d}t \\
&= \operatorname{Im}\int_{0}^{1}\frac{\mathrm{e}^{\mathrm{i}x}}{1-t\mathrm{e}^{\mathrm{i}x}}\,\mathrm{d}t
 = \int_{0}^{1}\frac{\sin x}{(t-\cos x)^{2}+\sin^{2}x}\,\mathrm{d}t \\
&= \int_{-\cot x}^{\frac{1-\cos x}{\sin x}}\frac{1}{s^{2}+1}\,\mathrm{d}s
 = \arctan \frac{1-\cos x}{\sin x}-\arctan(-\cot x) \\
&= \arctan\left(\tan \frac{x}{2}\right)-\arctan\left[\tan\left(x-\frac{\pi}{2}\right)\right]
 = \frac{\pi-x}{2}, \qquad \forall x\in(0,2\pi).
\end{aligned}
$$
类似地可以得到
$$
\sum_{n=1}^{\infty}\frac{\cos nx}{n}
= -\ln\left(2\sin \frac{x}{2}\right), \qquad \forall x\in(0,2\pi). \tag{2.4}
$$
对 (2.4) 式在 $[0,2\pi]$ 上积分立即可得
$$
\int_{0}^{\pi}\ln \sin x\,\mathrm{d}x = -\pi \ln 2.
$$
请读者补充说明上述过程的合理性.

### 例 2.9

> [!question] 例 2.9
> 求
> $$
> \int_{0}^{2\pi}\mathrm{e}^{\cos x}\cos(\sin x)\,\mathrm{d}x
> $$

注意到
$$
\int_{0}^{2\pi}\mathrm{e}^{\cos x}\cos(\sin x)\,\mathrm{d}x
= \operatorname{Re}\int_{0}^{2\pi}\mathrm{e}^{\mathrm{e}^{\mathrm{i}x}}\,\mathrm{d}x.
$$
考虑函数
$$
F(\alpha):=\int_{0}^{2\pi}\mathrm{e}^{\alpha \mathrm{e}^{\mathrm{i}x}}\,\mathrm{d}x, \qquad \alpha\in\mathbb{R},
$$
则
$$
F'(\alpha)=\int_{0}^{2\pi}\mathrm{e}^{\mathrm{i}x}\mathrm{e}^{\alpha \mathrm{e}^{\mathrm{i}x}}\,\mathrm{d}x=0.
$$
因此, $F(\alpha)\equiv F(0)=2\pi$. 特别地,
$$
\int_{0}^{2\pi}\mathrm{e}^{\cos x}\cos(\sin x)\,\mathrm{d}x = 2\pi.
$$
