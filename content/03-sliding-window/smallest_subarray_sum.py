"""
Problem: Smallest Subarray with Sum > K
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/smallest-subarray-with-sum-greater-than-x/0
"""

def smallest_subarray_with_sum(arr: list[int], x: int) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    n = len(arr)
    curr_sum = 0
    min_len = n + 1
    left = 0
    
    for right in range(n):
        curr_sum += arr[right]
        
        while curr_sum > x:
            min_len = min(min_len, right - left + 1)
            curr_sum -= arr[left]
            left += 1
            
    return min_len if min_len <= n else 0

if __name__ == "__main__":
    assert smallest_subarray_with_sum([1, 4, 45, 6, 0, 19], 51) == 3 # Subarray [45, 6, 19] has sum 70 > 51, length 3.
    assert smallest_subarray_with_sum([1, 10, 5, 2, 7], 9) == 1 # Subarray [10] has sum 10 > 9, length 1.
    assert smallest_subarray_with_sum([1, 2, 4], 8) == 0
    print("Python: smallest_subarray_with_sum passed tests!")
