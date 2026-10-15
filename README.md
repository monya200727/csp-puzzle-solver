# Constraint Satisfaction Puzzle Solver

A generalized **Constraint Satisfaction Problem (CSP) solver** built on **backtracking**, with **N-Queens** as the main demonstration. The same solver also handles **Sudoku** and **Graph Coloring**. It animates the search step by step, draws the search tree, and reports how much of the search space pruning removes.

> **Course:** BCSE204P - Design and Analysis of Algorithms (Lab)
> **Project:** Digital Assignment, Project 8 - Backtracking (Syllabus: Exp 4)
> **Live demo:** _add your GitHub Pages link here_

## Features

- Generic CSP solver: any problem described as variables, domains and constraints
- N-Queens for N = 4 to 20
- Sudoku (easy and hard puzzles) and Graph Coloring (Australia map, Petersen graph, 2 to 4 colors)
- Three algorithms: plain backtracking, backtracking with forward checking, forward checking with MRV
- Animated step-by-step visualization with play, pause, single step, speed control and run-to-end
- Live search tree showing consistent placements, pruned dead ends and solutions
- Statistics: nodes explored, values pruned, backtracks, placements tried, solutions, max depth
- Side-by-side algorithm comparison on any instance
- Light and dark theme, works on desktop and mobile

## How it works

A CSP is defined by three things: **variables**, the **values** each variable can take (its domain), and **constraints** between variables.

| Problem | Variables | Domain | Constraint |
|---|---|---|---|
| N-Queens | one per row | column number | no two queens share a column or diagonal |
| Sudoku | 81 cells | 1 to 9 | no repeat in a row, column or 3x3 box |
| Graph coloring | one per node | a color | adjacent nodes get different colors |

**Backtracking** assigns variables one at a time. If a value breaks a constraint, it is rejected, and if a variable has no valid value left the search returns to the previous variable and tries another value.

**Forward checking** goes further. After each assignment it removes the conflicting values from the domains of the unassigned neighbours. If any domain becomes empty, the search backtracks immediately, before going deeper.

**MRV (Minimum Remaining Values)** always picks the variable with the smallest remaining domain next, so dead ends are found earlier.

### Pseudocode

```
solve(depth):
    if all variables assigned: record solution; return
    v = next variable            # MRV picks the smallest domain
    for each value a in domain(v):
        if a conflicts with assigned neighbours: prune; continue
        assign v = a
        remove conflicting values from neighbours' domains   # forward checking
        if no neighbour domain is empty: solve(depth + 1)
        restore domains; unassign v                          # backtrack
```

## Complexity

| Case | Time |
|---|---|
| Brute force over all assignments (N-Queens) | O(N^N) |
| One queen per row, no pruning | O(N!) |
| Backtracking with pruning, worst case | exponential, but far fewer nodes in practice |
| Space | O(N) for the recursion stack and current assignment |

Pruning does not change the worst-case bound. It reduces the number of nodes explored on typical inputs, and the Compare button in the app measures this directly.

## Project structure

```
csp-puzzle-solver/
├── index.html        page layout
├── css/
│   └── style.css     styles and light/dark theme
├── js/
│   ├── utils.js      small DOM and theme helpers
│   ├── problems.js   N-Queens, Sudoku and Graph Coloring definitions
│   ├── solver.js     generic backtracking / forward checking / MRV solver
│   ├── render.js     board, search tree and statistics drawing
│   └── app.js        controls, animation loop and comparison
├── README.md
├── LICENSE
└── .gitignore
```

To add a new puzzle, write a function in `js/problems.js` that returns `{ n, dom, nb, conf }` (number of variables, domains, neighbour lists, conflict test) and the solver will run it unchanged.

## Run locally

No installation or build step is needed.

1. Download or clone this repository.
2. Open `index.html` in any modern browser.

## Usage

1. Choose a problem, its size or instance, and an algorithm.
2. Press **Start** to watch the search, **Step** to advance one move, or **Run to end** for the final result.
3. Read the statistics and the search tree, then press **Run comparison** to compare all three algorithms.

For N-Queens, forward checking is enough up to N = 20. For the hard Sudoku, use forward checking with MRV.

## Tech stack

HTML, CSS and vanilla JavaScript (no libraries). The solver is a JavaScript generator, which is what allows each step to be animated.

## Author

**Mounya** - VIT-AP University
GitHub: [@monya200727](https://github.com/monya200727)

## License

Released under the [MIT License](LICENSE).
