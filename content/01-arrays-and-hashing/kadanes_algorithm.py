"""
Problem: Kadane's Algorithm (Largest Sum Subarray)
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/kadanes-algorithm/0
"""

def max_subarray_sum(arr: list[int]) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    if not arr:
        return 0
        
    max_so_far = arr[0]
    max_ending_here = arr[0]
    
    for num in arr[1:]:
        max_ending_here = max(num, max_ending_here + num)
        max_so_far = max(max_so_far, max_ending_here)
        
    return max_so_far

if __name__ == "__main__":
    assert max_subarray_sum([1, 2, 3, -2, 5]) == 9
    assert max_subarray_sum([-1, -2, -3, -4]) == -1
    assert max_subarray_sum([5, 4, 7, -2, 2]) == 16
    print("Python: max_subarray_sum passed tests!")
