# Pattern 11: Graph Algorithms

## Core Concepts & Strategy
Graphs model entities (vertices) and relationships (edges). Graph problems test your ability to model state transitions, explore paths, analyze connectivity, and find topological dependencies.

## Key Sub-Patterns
1. **Grid BFS / DFS (Flood Fill)**:
   - Traversal on 2D matrices using 4-directional or 8-directional offsets (`dx`, `dy`).
2. **Topological Sort (Kahn's Algorithm / Indegree BFS)**:
   - Ordering directed acyclic graph (DAG) vertices by dependencies (e.g. Course Schedule).
3. **Disjoint Set Union (DSU / Union-Find)**:
   - Efficiently management of dynamic connected components in $O(\alpha(N))$ time per operation.

---

## Code Boilerplate Templates

### Python Template (Grid BFS - Shortest Path / Rotting Oranges)
```python
from collections import deque

def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = "0"
        while queue:
            curr_r, curr_c = queue.popleft()
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = curr_r + dr, curr_c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1":
                    grid[nr][nc] = "0"
                    queue.append((nr, nc))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                islands += 1
                bfs(r, c)
    return islands
```

### JavaScript Template (Grid BFS)
```javascript
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    const rows = grid.length, cols = grid[0].length;
    let islands = 0;

    function bfs(r, c) {
        const queue = [[r, c]];
        grid[r][c] = "0";
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        while (queue.length > 0) {
            const [currR, currC] = queue.shift();
            for (const [dr, dc] of dirs) {
                const nr = currR + dr, nc = currC + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "1") {
                    grid[nr][nc] = "0";
                    queue.push([nr, nc]);
                }
            }
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "1") {
                islands++;
                bfs(r, c);
            }
        }
    }
    return islands;
}
```
