"""
Problem: Spiral Traversal on a Matrix
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/spirally-traversing-a-matrix/0
"""

def spiral_order(matrix: list[list[int]]) -> list[int]:
    """
    Time Complexity: O(M * N)
    Space Complexity: O(1) auxiliary
    """
    if not matrix or not matrix[0]:
        return []
        
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Traverse right
        for col in range(left, right + 1):
            res.append(matrix[top][col])
        top += 1
        
        # Traverse down
        for row in range(top, bottom + 1):
            res.append(matrix[row][right])
        right -= 1
        
        # Traverse left
        if top <= bottom:
            for col in range(right, left - 1, -1):
                res.append(matrix[bottom][col])
            bottom -= 1
            
        # Traverse up
        if left <= right:
            for row in range(bottom, top - 1, -1):
                res.append(matrix[row][left])
            left += 1
            
    return res

if __name__ == "__main__":
    mat = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
    assert spiral_order(mat) == [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
    print("Python: spiral_order passed tests!")
