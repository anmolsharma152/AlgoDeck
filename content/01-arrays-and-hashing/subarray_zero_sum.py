"""
Problem: Subarray with 0 Sum
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/subarray-with-0-sum/0
"""

def has_zero_sum_subarray(arr: list[int]) -> bool:
    """
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    prefix_sum_set = set()
    curr_sum = 0
    
    for num in arr:
        curr_sum += num
        if curr_sum == 0 or curr_sum in prefix_sum_set:
            return True
        prefix_sum_set.add(curr_sum)
        
    return False

if __name__ == "__main__":
    assert has_zero_sum_subarray([4, 2, -3, 1, 6]) == True
    assert has_zero_sum_subarray([4, 2, 0, 1, 6]) == True
    assert has_zero_sum_subarray([1, 2, 3, 4]) == False
    print("Python: has_zero_sum_subarray passed tests!")
