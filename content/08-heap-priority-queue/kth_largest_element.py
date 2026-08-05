"""
Problem: Kth Largest Element in an Array
LeetCode: #215 (Medium) | NeetCode 150

Given an integer array nums and an integer k, return the kth largest element in the array.

Time Complexity: O(N log K)
Space Complexity: O(K)
"""

import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

if __name__ == "__main__":
    assert find_kth_largest([3, 2, 1, 5, 6, 4], 2) == 5
    assert find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) == 4
    print("All Python tests passed for Kth Largest Element!")
