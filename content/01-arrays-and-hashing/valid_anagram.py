"""
Problem: Valid Anagram
LeetCode: #242 (Easy) | NeetCode 150 | Blind 75
"""

def is_anagram(s: str, t: str) -> bool:
    """
    Time Complexity: O(N)
    Space Complexity: O(1) -> Max 26 unique lowercase alphabet chars
    """
    if len(s) != len(t):
        return False
    
    count = {}
    for char in s:
        count[char] = count.get(char, 0) + 1
        
    for char in t:
        if char not in count or count[char] == 0:
            return False
        count[char] -= 1
        
    return True

if __name__ == "__main__":
    assert is_anagram("anagram", "nagaram") == True
    assert is_anagram("rat", "car") == False
    print("Python: is_anagram passed tests!")
