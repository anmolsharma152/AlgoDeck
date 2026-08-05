"""
Problem: Merge Intervals
LeetCode: #56 (Medium) | NeetCode 150 | Blind 75

Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.

Time Complexity: O(N log N)
Space Complexity: O(N)
"""

def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged

if __name__ == "__main__":
    assert merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]
    assert merge_intervals([[1, 4], [4, 5]]) == [[1, 5]]
    print("All Python tests passed for Merge Intervals!")
