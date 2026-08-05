"""
Problem: Longest Palindromic Substring
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/longest-palindrome-in-a-string/0
"""

def longest_palindrome(s: str) -> str:
    """
    Time Complexity: O(N^2)
    Space Complexity: O(1)
    """
    if not s:
        return ""
        
    start, end = 0, 0
    
    def expand_around_center(left: int, right: int) -> int:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1

    for i in range(len(s)):
        len1 = expand_around_center(i, i)      # Odd length palindromes
        len2 = expand_around_center(i, i + 1)  # Even length palindromes
        max_len = max(len1, len2)
        
        if max_len > end - start:
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
            
    return s[start:end + 1]

if __name__ == "__main__":
    assert longest_palindrome("aaaabbaa") == "aabbaa"
    assert longest_palindrome("abc") in ["a", "b", "c"]
    print("Python: longest_palindrome passed tests!")
