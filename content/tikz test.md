1.

```tikz
\usepackage{tikz}
\begin{document}

\begin{tikzpicture}
  \draw[->] (-0.5,0) -- (3,0) node[right] {$x$};
  \draw[->] (0,-0.5) -- (0,3) node[above] {$y$};
  \draw[blue, thick] (0,0) -- (2,2);
  \node at (2.2,2.1) {$y=x$};
\end{tikzpicture}

\end{document}
```

---

2.

```tikz
\usepackage{tikz}
\usepackage{amsmath,amssymb}
\begin{document}

\begin{tikzpicture}[
  >=stealth,
  every node/.style={font=\large},
  lab/.style={font=\normalsize}
]
  \node (A) at (-5.0, 0.0) {$(X,\mathcal A,\mu_0)$};

  \node (Pp) at (-1.0, 2.0) {$(X,\mathcal P(X),\mu^*)$};
  \node (Pplus) at (-1.0, 3.7) {$(X,\mathcal P(X),\mu^+)$};
  \node (Psharp) at (-1.0, 0.1) {$(X,\mathcal P(X),\mu^\#)$};

  \node (M) at (-0.8,-1.45) {$(X,\mathcal M,\mu)$};

  \node (Mstar) at (4.0, 2.0) {$(X,\mathcal M^*,\bar\mu)$};
  \node (Mhat) at (4.0, 0.0) {$(X,\widehat{\mathcal M},\widehat\mu)$};
  \node (Mtilde) at (4.0,-1.45) {$(X,\mathcal M,\widetilde\mu)$};

  \draw[->] (A.east) -- (Pp.west)
    node[midway, above, sloped, lab] {$\mu_0\to\mu^*$};

  \draw[->] (A.east) -- (M.west)
    node[midway, below, sloped, lab] {$\mathcal A\to\mathcal M$};

  \draw[double] (Pp.north) -- (Pplus.south);
  \node[lab, left] at (-1.25,2.85) {$\mu^*:\mu^*\sim\mu_0$};

  \draw (Pp.south) -- (Psharp.north);
  \node[lab, left] at (-1.25,1.05) {$\mu:\mu\sim\mu_0$};

  \draw[->] (M.north) -- (Psharp.south)
    node[midway, left, lab] {$\mu\hookrightarrow\mu^\#$};

  \draw[->, double] (Pp.east) -- (Mstar.west)
    node[midway, below, lab] {Caratheodory, $\mathcal P(X)\to\mathcal M^*$};

  \draw[->] (Mstar.north west) -- (Pplus.east)
    node[midway, above, sloped, lab] {$\bar\mu\to\mu^+$};

  \draw (Mstar.south) -- (4.0,0.85);
  \draw[->] (4.0,0.85) -- (Mhat.north);
  \node[lab] at (2.65,0.95) {saturation; $\mu_0:\sigma$-finite};

  \draw[->, dashed] (M.east) -- (Mhat.west)
    node[midway, above, lab] {completion};

  \draw[double] (M.east) -- (Mtilde.west)
    node[midway, below, lab] {$\mu_0:\sigma$-finite};

  \draw[->] (Mstar.east) .. controls (6.2,1.0) and (6.0,-0.9) .. (Mtilde.east)
    node[midway, right, lab] {$\mathcal M^*\to\mathcal M$};
\end{tikzpicture}

\end{document}
```

---

3.

```tikz
\usepackage{tikz}
\begin{document}

\begin{tikzpicture}[scale=0.9, line cap=round, line join=round]
  % tail
  \fill[yellow!80!orange, draw=black, line width=0.8pt]
    (2.2,0.2) -- (3.0,0.8) -- (2.6,1.0) -- (3.4,1.8) --
    (2.8,2.0) -- (3.8,3.0) -- (3.0,2.7) -- (2.4,1.9) --
    (2.7,1.7) -- (2.0,1.1) -- cycle;

  \fill[brown!70!black, draw=black, line width=0.8pt]
    (2.15,0.25) -- (2.45,0.45) -- (2.15,0.95) -- (1.9,0.75) -- cycle;

  % body
  \fill[yellow!80!orange, draw=black, line width=1pt]
    (0,-0.3) ellipse (1.7 and 2.0);

  % head
  \fill[yellow!80!orange, draw=black, line width=1pt]
    (0,2.2) circle (1.8);

  % ears
  \fill[yellow!80!orange, draw=black, line width=1pt]
    (-1.15,3.35) -- (-1.9,5.3) -- (-0.75,4.2) -- cycle;
  \fill[black]
    (-1.55,4.35) -- (-1.9,5.3) -- (-1.25,4.75) -- cycle;

  \fill[yellow!80!orange, draw=black, line width=1pt]
    (1.15,3.35) -- (1.9,5.3) -- (0.75,4.2) -- cycle;
  \fill[black]
    (1.55,4.35) -- (1.9,5.3) -- (1.25,4.75) -- cycle;

  % arms
  \draw[black, line width=8pt] (-1.2,1.0) -- (-2.1,0.4);
  \draw[yellow!80!orange, line width=6pt] (-1.2,1.0) -- (-2.1,0.4);

  \draw[black, line width=8pt] (1.2,1.0) -- (2.1,0.7);
  \draw[yellow!80!orange, line width=6pt] (1.2,1.0) -- (2.1,0.7);

  % feet
  \fill[yellow!80!orange, draw=black, line width=1pt]
    (-0.8,-2.0) ellipse (0.55 and 0.3);
  \fill[yellow!80!orange, draw=black, line width=1pt]
    (0.8,-2.0) ellipse (0.55 and 0.3);

  % eyes
  \fill[black] (-0.62,2.55) circle (0.18);
  \fill[black] (0.62,2.55) circle (0.18);
  \fill[white] (-0.55,2.63) circle (0.05);
  \fill[white] (0.69,2.63) circle (0.05);

  % nose
  \fill[black] (0,2.1) circle (0.06);

  % mouth
  \draw[black, line width=0.8pt] (-0.32,1.8) .. controls (-0.18,1.62) and (-0.05,1.62) .. (0,1.8);
  \draw[black, line width=0.8pt] (0,1.8) .. controls (0.05,1.62) and (0.18,1.62) .. (0.32,1.8);

  % cheeks
  \fill[red!75!orange, draw=black, line width=0.8pt] (-1.15,1.95) circle (0.28);
  \fill[red!75!orange, draw=black, line width=0.8pt] (1.15,1.95) circle (0.28);

  % belly line
  \draw[black!50, line width=0.5pt] (0,-1.5) .. controls (-0.15,-0.8) and (-0.15,0.1) .. (0,-0.2);

  % back stripes
  \draw[black, line width=2pt] (-0.55,0.75) -- (-0.05,0.45);
  \draw[black, line width=2pt] (0.0,0.95) -- (0.5,0.65);
\end{tikzpicture}

\end{document}
```

---

4.


```tikz
\usepackage{tikz}
\begin{document}

\begin{tikzpicture}[scale=1.1, >=stealth]
  % filled domain first
  \fill[gray!15] (0,0) circle (2);

  % axes after filling
  \draw[->] (-3.2,0) -- (3.5,0) node[right] {$\mathrm{Re}\,z$};
  \draw[->] (0,-2.7) -- (0,2.8) node[above] {$\mathrm{Im}\,z$};

  % contour boundary
  \draw[thick] (0,0) circle (2);

  % direction arrows on contour
  \draw[->, thick] (2,0) arc (0:35:2);
  \draw[->, thick] (-0.35,1.97) arc (100:140:2);
  \draw[->, thick] (-2,0) arc (180:215:2);
  \draw[->, thick] (0.35,-1.97) arc (280:320:2);

  % labels
  \node at (1.45,1.55) {$C$};
  \node at (-0.8,-0.45) {$D$};

  % inside singularity
  \fill (0.65,0.55) circle (2pt);
  \node[above right] at (0.65,0.55) {$z_0$};

  % outside point
  \fill (2.7,1.0) circle (2pt);
  \node[above right] at (2.7,1.0) {$a$};

  % radius
  \draw[dashed] (0,0) -- (2,0);
  \node[below] at (1,0) {$R$};

  % origin
  \fill (0,0) circle (1pt);
  \node[below left] at (0,0) {$0$};
\end{tikzpicture}

\end{document}
```5. 
```tikz
\usepackage{tikz}
\usetikzlibrary{matrix}

\begin{document}

\begin{tikzpicture}[
  every node/.style={inner sep=2pt, anchor=center},
  line/.style={draw, shorten >=1pt, shorten <=1pt}
]
\matrix (m) [matrix of nodes, nodes in empty cells, column sep=1.5cm, row sep=1.2cm] {
  $A(A^*\cap B^*)$ & & $B(A^*\cap B^*)$ \\
  $A(A^*\cap B)$ & $A^*\cap B^*$ & $B(A\cap B^*)$ \\
  $A$ & $D=(A^*\cap B)(A\cap B^*)$ & $B$ \\
  $A\cap B^*$ & & $A^*\cap B$ \\
};

\draw[line] (m-1-1) -- (m-2-1);
\draw[line] (m-1-1) -- (m-2-2);
\draw[line] (m-1-3) -- (m-2-3);
\draw[line] (m-1-3) -- (m-2-2);

\draw[line] (m-2-1) -- (m-3-1);
\draw[line] (m-2-1) -- (m-3-2);
\draw[line] (m-2-2) -- (m-3-2);
\draw[line] (m-2-3) -- (m-3-3);
\draw[line] (m-2-3) -- (m-3-2);

\draw[line] (m-3-1) -- (m-4-1);
\draw[line] (m-3-3) -- (m-4-3);
\draw[line] (m-4-1) -- (m-3-2);
\draw[line] (m-4-3) -- (m-3-2);
\end{tikzpicture}

\end{document}
```

```tikz
\usepackage{tikz}
\usetikzlibrary{matrix}

\begin{document}

\begin{tikzpicture}[
  every node/.style={inner sep=2pt, anchor=center},
  line/.style={draw, shorten >=1pt, shorten <=1pt}
]
\matrix (m) [matrix of nodes, nodes in empty cells, column sep=1.5cm, row sep=1.2cm] {
  $A(A^*\cap B^*)$ & & $B(A^*\cap B^*)$ \\
  $A(A^*\cap B)$ & $A^*\cap B^*$ & $B(A\cap B^*)$ \\
  $A$ & $D=(A^*\cap B)(A\cap B^*)$ & $B$ \\
  $A\cap B^*$ & & $A^*\cap B$ \\
};

\draw[line] (m-1-1) -- (m-2-1);
\draw[line] (m-1-1) -- (m-2-2);
\draw[line] (m-1-3) -- (m-2-3);
\draw[line] (m-1-3) -- (m-2-2);

\draw[line] (m-2-1) -- (m-3-1);
\draw[line] (m-2-1) -- (m-3-2);
\draw[line] (m-2-2) -- (m-3-2);
\draw[line] (m-2-3) -- (m-3-3);
\draw[line] (m-2-3) -- (m-3-2);

\draw[line] (m-3-1) -- (m-4-1);
\draw[line] (m-3-3) -- (m-4-3);
\draw[line] (m-4-1) -- (m-3-2);
\draw[line] (m-4-3) -- (m-3-2);
\end{tikzpicture}

\end{document}
```

