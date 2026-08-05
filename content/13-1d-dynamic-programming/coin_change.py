def coinChange(coins, amount: int) -> int:
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])

    return dp[amount] if dp[amount] != amount + 1 else -1

if __name__ == "__main__":
    assert coinChange([1,2,5], 11) == 3, "Test 1 Failed"
    assert coinChange([2], 3) == -1, "Test 2 Failed"
    print("All tests passed!")
