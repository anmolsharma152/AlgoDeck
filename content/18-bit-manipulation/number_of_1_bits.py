"""
Problem: Number of 1 Bits (Hamming Weight)
LeetCode: #191 (Easy) | NeetCode 150 | Blind 75

Given a positive integer n, write a function that returns the number of set bits it has (also known as the Hamming weight).

Time Complexity: O(k) where k is number of set bits (Brian Kernighan's Algorithm)
Space Complexity: O(1)
"""

def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= (n - 1)  # Clears the lowest set bit
        count += 1
    return count

if __name__ == "__main__":
    assert hamming_weight(11) == 3  # 11 is 1011 in binary
    assert hamming_weight(128) == 1 # 128 is 10000000
    assert hamming_weight(2147483645) == 30
    print("All Python tests passed for Number of 1 Bits!")
