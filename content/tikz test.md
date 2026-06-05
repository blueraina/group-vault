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

