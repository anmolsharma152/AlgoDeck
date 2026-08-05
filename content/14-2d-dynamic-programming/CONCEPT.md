# Pattern 14: 2D Dynamic Programming

## Core Concepts & Strategy
2D Dynamic Programming builds on top of 1D DP but maintains state across two variables (commonly represented by a 2D table `dp[i][j]`).
Commonly used for grid problems, string matchings, subsets/partitions, and game states.

## Sub-Patterns & Identification Signatures
1. **Grid Paths**:
   - Signature: "Unique paths in a grid", "Minimum path sum in grid".
   - Relation: $dp[i][j] = grid[i][j] + \min(dp[i-1][j], dp[i][j-1])$.
2. **String Alignment / LCS**:
   - Signature: "Longest Common Subsequence", "Edit Distance", "Interleaving String".
   - Relation: If `s1[i] == s2[j]`, $dp[i][j] = 1 + dp[i-1][j-1]$. Else, $dp[i][j] = \max(dp[i-1][j], dp[i][j-1])$.
3. **0/1 Knapsack**:
   - Signature: "Subset sum partition", "Target sum".
   - Relation: $dp[i][w] = \max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])$.

---

## Code Boilerplate Templates

### Python Template (Longest Common Subsequence)
```python
def lcs(s1: str, s2: str) -> int:
    """
    Time Complexity: O(M * N)
    Space Complexity: O(M * N) (can be optimized to O(min(M, N)))
    """
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]
```

### JavaScript Template (Longest Common Subsequence)
```javascript
function lcs(s1, s2) {
    /**
     * Time Complexity: O(M * N)
     * Space Complexity: O(M * N)
     */
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}
```
