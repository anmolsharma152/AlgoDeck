"""
Problem: Chocolate Distribution Problem
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/chocolate-distribution-problem/0
"""

def find_min_diff(arr: list[int], m: int) -> int:
    """
    Time Complexity: O(N log N)
    Space Complexity: O(1)
    """
    n = len(arr)
    if m == 0 or n == 0:
        return 0
    if n < m:
        return -1
        
    arr.sort()
    min_diff = float('inf')
    
    # Sliding window of size m
    for i in range(n - m + 1):
        diff = arr[i + m - 1] - arr[i]
        min_diff = min(min_diff, diff)
        
    return min_diff

if __name__ == "__main__":
    assert find_min_diff([7, 3, 2, 4, 9, 12, 56], 3) == 2  # Sorted: 2, 3, 4, 7, 9, 12, 56. Subarray of size 3 with min diff: [2, 3, 4] -> diff = 2
    assert find_min_diff([3, 4, 1, 9, 56, 7, 9, 12], 5) == 6 # Sorted: 1, 3, 7, 9, 9, 12, 56. [3, 7, 9, 9, 12] -> diff = 9
    print("Python: find_min_diff passed tests!")
