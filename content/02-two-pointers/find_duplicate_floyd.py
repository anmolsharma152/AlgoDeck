"""
Problem: Find Duplicate Number (Floyd's Cycle Detection)
LeetCode: #287 (Medium)
"""

def find_duplicate(nums: list[int]) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    # Find intersection point of the two runners
    slow, fast = nums[0], nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
            
    # Find entrance to cycle
    slow2 = nums[0]
    while slow != slow2:
        slow = nums[slow]
        slow2 = nums[slow2]
        
    return slow

if __name__ == "__main__":
    assert find_duplicate([1, 3, 4, 2, 2]) == 2
    assert find_duplicate([3, 1, 3, 4, 2]) == 3
    assert find_duplicate([3, 3, 3, 3, 3]) == 3
    print("Python: find_duplicate passed tests!")
