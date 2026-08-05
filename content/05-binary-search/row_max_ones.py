"""
Problem: Row with Maximum Number of 1s
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/row-with-max-1s0023/1
"""

def row_with_max_ones(matrix: list[list[int]]) -> int:
    """
    Time Complexity: O(M + N)
    Space Complexity: O(1)
    """
    if not matrix or not matrix[0]:
        return -1
        
    r = len(matrix)
    c = len(matrix[0])
    
    max_row_idx = -1
    j = c - 1 # Start from top-right corner
    
    for i in range(r):
        while j >= 0 and matrix[i][j] == 1:
            j -= 1
            max_row_idx = i
            
    return max_row_idx

if __name__ == "__main__":
    grid = [[0, 1, 1, 1], [0, 0, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]]
    assert row_with_max_ones(grid) == 2
    grid2 = [[0, 0], [0, 0]]
    assert row_with_max_ones(grid2) == -1
    print("Python: row_with_max_ones passed tests!")
