"""
Problem: Number of Islands
LeetCode: #200 (Medium) | NeetCode 150 | Blind 75
"""

def num_islands(grid: list[list[str]]) -> int:
    """
    Time Complexity: O(M * N)
    Space Complexity: O(M * N) in worst case for recursion stack
    """
    if not grid:
        return 0
        
    m, n = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == "0":
            return
        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(m):
        for c in range(n):
            if grid[r][c] == "1":
                islands += 1
                dfs(r, c)
                
    return islands

if __name__ == "__main__":
    grid1 = [
      ["1","1","1","1","0"],
      ["1","1","0","1","0"],
      ["1","1","0","0","0"],
      ["0","0","0","0","0"]
    ]
    assert num_islands(grid1) == 1

    grid2 = [
      ["1","1","0","0","0"],
      ["1","1","0","0","0"],
      ["0","0","1","0","0"],
      ["0","0","0","1","1"]
    ]
    assert num_islands(grid2) == 3
    print("Python: num_islands passed tests!")
