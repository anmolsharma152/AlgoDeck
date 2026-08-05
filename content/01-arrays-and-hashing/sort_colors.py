"""
Problem: Sort Colors (Dutch National Flag Algorithm)
LeetCode: #75 (Medium) | NeetCode 150 | Blind 75

Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue (0, 1, and 2).

Time Complexity: O(N) single pass
Space Complexity: O(1)
"""

def sort_colors(nums: list[int]) -> None:
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1

if __name__ == "__main__":
    nums1 = [2, 0, 2, 1, 1, 0]
    sort_colors(nums1)
    assert nums1 == [0, 0, 1, 1, 2, 2]
    
    nums2 = [2, 0, 1]
    sort_colors(nums2)
    assert nums2 == [0, 1, 2]
    print("All Python tests passed for Sort Colors (Dutch National Flag)!")
