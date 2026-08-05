"""
Problem: Maximum Product Subarray
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/maximum-product-subarray3604/1
"""

def max_product(nums: list[int]) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    if not nums:
        return 0
        
    res = max(nums)
    curr_min, curr_max = 1, 1
    
    for num in nums:
        if num == 0:
            curr_min, curr_max = 1, 1
            continue
            
        temp = curr_max * num
        curr_max = max(num * curr_max, num * curr_min, num)
        curr_min = min(temp, num * curr_min, num)
        res = max(res, curr_max)
        
    return res

if __name__ == "__main__":
    assert max_product([6, -3, -10, 0, 2]) == 180
    assert max_product([-1, -3, -10, 60]) == 1800
    assert max_product([-2, 0, -1]) == 0
    print("Python: max_product passed tests!")
