# Pattern 12: Advanced Graphs & Shortest Paths

## Core Concepts & Strategy
Advanced graphs focus on weighted graphs, path optimization, and connectivity. Key concepts include finding shortest paths (Dijkstra, Bellman-Ford, Floyd-Warshall) and finding Minimum Spanning Trees (Prim's, Kruskal's).

## Core Algorithms
1. **Dijkstra's Algorithm**:
   - Signature: Shortest path from a single source on a graph with *non-negative* edge weights.
   - Complexity: $O(E \log V)$ with Min-Heap.
2. **Bellman-Ford Algorithm**:
   - Signature: Shortest path from a single source on graphs with *negative* edge weights (and detects negative cycles).
   - Complexity: $O(V \cdot E)$.
3. **Floyd-Warshall Algorithm**:
   - Signature: Shortest paths between *all pairs* of vertices.
   - Complexity: $O(V^3)$ DP.
4. **Kruskal's / Prim's Algorithm**:
   - Signature: Minimum Spanning Tree (MST) connecting all vertices with minimum edge weight sum.
   - Complexity: $O(E \log V)$ using Disjoint Set Union (DSU) (Kruskal's) or Priority Queue (Prim's).

---

## Code Boilerplate Templates

### Python Template (Dijkstra's Shortest Path)
```python
import heapq

def dijkstra(n: int, edges: list[list[int]], source: int) -> dict[int, int]:
    """
    Finds shortest paths from source to all other nodes in a weighted graph.
    Time Complexity: O(E log V)
    Space Complexity: O(V + E)
    """
    adj = {i: [] for i in range(1, n + 1)}
    for u, v, w in edges:
        adj[u].append((v, w))
        
    distances = {i: float('inf') for i in range(1, n + 1)}
    distances[source] = 0
    
    min_heap = [(0, source)] # (distance, node)
    
    while min_heap:
        dist, u = heapq.heappop(min_heap)
        
        if dist > distances[u]:
            continue
            
        for v, weight in adj[u]:
            new_dist = dist + weight
            if new_dist < distances[v]:
                distances[v] = new_dist
                heapq.heappush(min_heap, (new_dist, v))
                
    return distances
```

### JavaScript Template (Dijkstra's Shortest Path using linear search for minimum node)
```javascript
function dijkstra(n, edges, source) {
    /**
     * Finds shortest paths from source to all nodes in a weighted graph.
     * Time Complexity: O(V^2 + E) without a Binary Heap
     * Space Complexity: O(V + E)
     */
    const adj = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of edges) {
        adj[u].push([v, w]);
    }
    
    const distances = Array(n + 1).fill(Infinity);
    const visited = Array(n + 1).fill(false);
    distances[source] = 0;
    
    for (let count = 0; count < n; count++) {
        // Find minimum distance node that has not been visited
        let minDist = Infinity;
        let u = -1;
        for (let i = 1; i <= n; i++) {
            if (!visited[i] && distances[i] < minDist) {
                minDist = distances[i];
                u = i;
            }
        }
        
        if (u === -1) break;
        visited[u] = true;
        
        for (const [v, weight] of adj[u]) {
            if (!visited[v] && distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
            }
        }
    }
    
    return distances;
}
```
