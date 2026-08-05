"""
Problem: Search a 2D Matrix
LeetCode: #74 (Medium)
"""

def search_matrix(matrix: list[list[int]], target: int) -> bool:
    """
    Time Complexity: O(log(M * N))
    Space Complexity: O(1)
    """
    if not matrix or not matrix[0]:
        return False
        
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        mid_val = matrix[mid // n][mid % n]
        
        if mid_val == target:
            return True
        elif mid_val < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return False

if __name__ == "__main__":
    matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
    assert search_matrix(matrix, 3) == True
    assert search_matrix(matrix, 13) == False
    print("Python: search_matrix passed tests!")
