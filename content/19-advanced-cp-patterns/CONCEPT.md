# Pattern 19: Advanced CP Patterns

## Core Concepts & Strategy
Advanced CP patterns cover data structures and algorithms used extensively in competitive programming to optimize range queries, string search, and tree traversal beyond the standard interview scopes.

## Core Topics
1. **Range Query Optimizations**:
   - **Segment Trees**: For range query (e.g. sum, min/max) and range update in $O(\log N)$ time.
   - **Fenwick Trees (Binary Indexed Trees)**: Lightweight alternative to Segment Trees for range sum queries and point updates in $O(\log N)$ time.
2. **String Search Optimizations**:
   - **KMP (Knuth-Morris-Pratt)**: String matching in $O(N + M)$ time using the Longest Prefix Suffix (LPS) array.
3. **Tree Queries**:
   - **Binary Lifting / LCA**: Finds Lowest Common Ancestor of two nodes in a tree in $O(\log N)$ query time after $O(N \log N)$ precomputation.

---

## Code Boilerplate Templates

### Python Template (Fenwick Tree / Binary Indexed Tree)
```python
class FenwickTree:
    """
    1-indexed Binary Indexed Tree.
    Time Complexity:
      - Point Update: O(log N)
      - Range Query: O(log N)
    """
    def __init__(self, size: int):
        self.size = size
        self.tree = [0] * (size + 1)

    def update(self, idx: int, delta: int) -> None:
        while idx <= self.size:
            self.tree[idx] += delta
            idx += idx & (-idx) # Add lowbit

    def query(self, idx: int) -> int:
        s = 0
        while idx > 0:
            s += self.tree[idx]
            idx -= idx & (-idx) # Subtract lowbit
        return s

    def range_query(self, l: int, r: int) -> int:
        return self.query(r) - self.query(l - 1)
```

### JavaScript Template (Fenwick Tree / Binary Indexed Tree)
```javascript
class FenwickTree {
    /**
     * 1-indexed Binary Indexed Tree.
     * Time Complexity: O(log N) for both updates and queries
     */
    constructor(size) {
        this.size = size;
        this.tree = new Array(size + 1).fill(0);
    }

    update(idx, delta) {
        while (idx <= this.size) {
            this.tree[idx] += delta;
            idx += idx & (-idx); // Add lowbit
        }
    }

    query(idx) {
        let s = 0;
        while (idx > 0) {
            s += this.tree[idx];
            idx -= idx & (-idx); // Subtract lowbit
        }
        return s;
    }

    rangeQuery(l, r) {
        return this.query(r) - this.query(l - 1);
    }
}
```
