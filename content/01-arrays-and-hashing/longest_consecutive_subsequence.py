"""
Problem: Longest Consecutive Subsequence
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/longest-consecutive-subsequence/0
"""

def longest_consecutive(arr: list[int]) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    num_set = set(arr)
    longest_streak = 0
    
    for num in num_set:
        # Check if it's the start of a sequence
        if num - 1 not in num_set:
            current_num = num
            current_streak = 1
            
            while current_num + 1 in num_set:
                current_num += 1
                current_streak += 1
                
            longest_streak = max(longest_streak, current_streak)
            
    return longest_streak

if __name__ == "__main__":
    assert longest_consecutive([2, 6, 1, 9, 4, 5, 3]) == 6
    assert longest_consecutive([1, 9, 3, 10, 4, 20, 2]) == 4
    assert longest_consecutive([]) == 0
    print("Python: longest_consecutive passed tests!")
