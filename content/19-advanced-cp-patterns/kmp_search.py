"""
Problem: KMP Pattern Searching
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/longest-prefix-suffix2527/1
"""

def kmp_search(pat: str, txt: str) -> list[int]:
    """
    KMP search algorithm. Returns 0-based indices of pattern matches.
    Time Complexity: O(N + M)
    Space Complexity: O(M)
    """
    m = len(pat)
    n = len(txt)
    res = []
    
    if m == 0 or n == 0 or m > n:
        return []

    # Compute LPS (Longest Prefix Suffix) array
    lps = [0] * m
    length = 0 # length of the previous longest prefix suffix
    i = 1
    
    while i < m:
        if pat[i] == pat[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1

    # Search pattern
    i = 0 # index for txt
    j = 0 # index for pat
    while i < n:
        if pat[j] == txt[i]:
            i += 1
            j += 1
            
        if j == m:
            res.append(i - j)
            j = lps[j - 1]
        elif i < n and pat[j] != txt[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
                
    return res

if __name__ == "__main__":
    assert kmp_search("ABABCABAB", "ABABDABABCABAB") == [5]
    assert kmp_search("TEST", "THIS IS A TEST TEXT") == [10]
    assert kmp_search("A", "AAAAA") == [0, 1, 2, 3, 4]
    print("Python: kmp_search passed tests!")
