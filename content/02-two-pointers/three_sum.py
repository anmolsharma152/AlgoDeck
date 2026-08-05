"""
Problem: 3Sum
LeetCode: #15 (Medium) | NeetCode 150 | Blind 75
"""

def three_sum(nums: list[int]) -> list[list[int]]:
    """
    Time Complexity: O(N^2)
    Space Complexity: O(1) or O(N) depending on sorting implementation
    """
    nums.sort()
    res = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
            
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
                
    return res

if __name__ == "__main__":
    assert three_sum([-1, 0, 1, 2, -1, -4]) == [[-1, -1, 2], [-1, 0, 1]]
    assert three_sum([0, 1, 1]) == []
    assert three_sum([0, 0, 0]) == [[0, 0, 0]]
    print("Python: three_sum passed tests!")
