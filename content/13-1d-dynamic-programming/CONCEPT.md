# Pattern 13: 1D Dynamic Programming

## Core Concepts & Strategy
Dynamic Programming solves complex problems by breaking them down into simpler subproblems and caching their solutions to avoid redundant computations.

## Approach Selection
1. **Top-Down (Memoization)**: Recursion + HashMap/Array Cache (`@cache` in Python).
2. **Bottom-Up (Tabulation)**: Iterative array building (`dp[i] = dp[i-1] + dp[i-2]`).
3. **Space Optimization**: Storing only previous state values (`prev1`, `prev2`) to reduce space from $O(N)$ to $O(1)$.

---

## Code Boilerplate Templates

### Python Template (Coin Change - Bottom Up)
```python
def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

### JavaScript Template (Coin Change - Bottom Up)
```javascript
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] !== Infinity ? dp[amount] : -1;
}
```
