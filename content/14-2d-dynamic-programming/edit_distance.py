"""
Problem: Edit Distance
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/edit-distance3702/1
"""

def edit_distance(s1: str, s2: str) -> int:
    """
    Time Complexity: O(M * N)
    Space Complexity: O(M * N)
    """
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
        
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],    # Remove
                    dp[i][j - 1],    # Insert
                    dp[i - 1][j - 1] # Replace
                )
                
    return dp[m][n]

if __name__ == "__main__":
    assert edit_distance("geek", "gesek") == 1
    assert edit_distance("gfg", "gfg") == 0
    assert edit_distance("cat", "cut") == 1
    print("Python: edit_distance passed tests!")
