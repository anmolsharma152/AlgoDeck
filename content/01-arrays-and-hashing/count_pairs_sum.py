"""
Problem: Count Pairs with Given Sum
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/count-pairs-with-given-sum5022/1
"""

def get_pairs_count(arr: list[int], target: int) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    count = 0
    freq = {}
    
    for num in arr:
        complement = target - num
        if complement in freq:
            count += freq[complement]
        freq[num] = freq.get(num, 0) + 1
        
    return count

if __name__ == "__main__":
    assert get_pairs_count([1, 5, 7, 1], 6) == 2
    assert get_pairs_count([1, 1, 1, 1], 2) == 6
    print("Python: count_pairs_sum passed tests!")
