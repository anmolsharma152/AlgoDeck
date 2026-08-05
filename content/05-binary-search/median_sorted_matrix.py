"""
Problem: Median in Row-wise Sorted Matrix
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1
"""
import bisect

def get_median(matrix: list[list[int]]) -> int:
    """
    Time Complexity: O(32 * M * log N) where 32 is max bits for integers
    Space Complexity: O(1)
    """
    r = len(matrix)
    c = len(matrix[0])
    
    minimum = matrix[0][0]
    maximum = matrix[0][-1]
    
    for i in range(1, r):
        minimum = min(minimum, matrix[i][0])
        maximum = max(maximum, matrix[i][-1])
        
    desired = (r * c + 1) // 2
    
    while minimum < maximum:
        mid = minimum + (maximum - minimum) // 2
        count = 0
        
        # Count elements less than or equal to mid
        for i in range(r):
            count += bisect.bisect_right(matrix[i], mid)
            
        if count < desired:
            minimum = mid + 1
        else:
            maximum = mid
            
    return minimum

if __name__ == "__main__":
    mat = [[1, 3, 5], [2, 6, 9], [3, 6, 9]]
    assert get_median(mat) == 5
    mat2 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
    assert get_median(mat2) == 1
    print("Python: get_median passed tests!")
