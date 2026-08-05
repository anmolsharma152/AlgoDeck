"""
Problem: Binary Search
LeetCode: #704 (Easy) | NeetCode 150
"""

def search(nums: list[int], target: int) -> int:
    """
    Time Complexity: O(log N)
    Space Complexity: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

if __name__ == "__main__":
    assert search([-1, 0, 3, 5, 9, 12], 9) == 4
    assert search([-1, 0, 3, 5, 9, 12], 2) == -1
    print("Python: search passed tests!")
