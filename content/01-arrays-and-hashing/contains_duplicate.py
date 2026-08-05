"""
Problem: Contains Duplicate
LeetCode: #217 (Easy) | NeetCode 150 | Blind 75
"""

def contains_duplicate(nums: list[int]) -> bool:
    """
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False

if __name__ == "__main__":
    assert contains_duplicate([1, 2, 3, 1]) == True
    assert contains_duplicate([1, 2, 3, 4]) == False
    assert contains_duplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) == True
    print("Python: contains_duplicate passed tests!")
