"""
Problem: Rotate Image
LeetCode: #48 (Medium) | NeetCode 150 | Blind 75
"""

def rotate(matrix: list[list[int]]) -> None:
    """
    Time Complexity: O(N^2)
    Space Complexity: O(1)
    Do not return anything, modify matrix in-place instead.
    """
    n = len(matrix)
    # Transpose matrix
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
            
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()

if __name__ == "__main__":
    mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    rotate(mat)
    assert mat == [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
    print("Python: rotate_image passed tests!")
