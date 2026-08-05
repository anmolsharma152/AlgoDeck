"""
Problem: Subsets
LeetCode: #78 (Medium) | NeetCode 150

Given an integer array nums of unique elements, return all possible subsets (the power set).

Time Complexity: O(N * 2^N)
Space Complexity: O(N)
"""

def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    subset = []

    def dfs(i):
        if i >= len(nums):
            res.append(subset.copy())
            return
        # Include nums[i]
        subset.append(nums[i])
        dfs(i + 1)
        # Exclude nums[i]
        subset.pop()
        dfs(i + 1)

    dfs(0)
    return res

if __name__ == "__main__":
    res = subsets([1, 2, 3])
    assert len(res) == 8
    print("All Python tests passed for Subsets!")
