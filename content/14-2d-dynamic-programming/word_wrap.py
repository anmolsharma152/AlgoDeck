"""
Problem: Word Wrap Problem
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/word-wrap/0
"""

def solve_word_wrap(nums: list[int], k: int) -> int:
    """
    Time Complexity: O(N^2)
    Space Complexity: O(N)
    """
    n = len(nums)
    
    # dp[i] represents the minimum cost to wrap words from index i to n-1
    dp = [0] * n
    ans = [0] * n # To track partition (optional, but good)
    
    # If starting word is i, we try to put as many words as possible on the current line
    for i in range(n - 1, -1, -1):
        curr_len = -1
        dp[i] = float('inf')
        
        for j in range(i, n):
            curr_len += nums[j] + 1
            if curr_len > k:
                break
                
            # If we reached the end of the array, the cost is 0 (last line has 0 cost)
            if j == n - 1:
                cost = 0
            else:
                cost = (k - curr_len) ** 2
                
            next_cost = cost + (dp[j + 1] if j + 1 < n else 0)
            if next_cost < dp[i]:
                dp[i] = next_cost
                ans[i] = j
                
    return dp[0]

if __name__ == "__main__":
    assert solve_word_wrap([3, 2, 2, 5], 6) == 10
    assert solve_word_wrap([4, 3], 6) == 4
    print("Python: solve_word_wrap passed tests!")
