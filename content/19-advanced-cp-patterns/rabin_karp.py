"""
Problem: Rabin-Karp Pattern Searching
GeeksforGeeks: https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/
"""

def rabin_karp(pat: str, txt: str) -> list[int]:
    """
    Rabin-Karp string matching. Returns 0-based indices of pattern matches.
    Time Complexity: O(N + M) average, O(N * M) worst
    Space Complexity: O(1)
    """
    d = 256 # Number of characters in the alphabet
    q = 101 # A prime number
    m = len(pat)
    n = len(txt)
    p = 0    # hash value for pattern
    t = 0    # hash value for txt
    h = 1
    res = []
    
    if m > n:
        return []

    # The value of h would be "pow(d, m-1)%q"
    for i in range(m - 1):
        h = (h * d) % q

    # Calculate the hash value of pattern and first window of text
    for i in range(m):
        p = (d * p + ord(pat[i])) % q
        t = (d * t + ord(txt[i])) % q

    # Slide the pattern over text one by one
    for i in range(n - m + 1):
        # Check the hash values of current window of text and pattern
        if p == t:
            # Check characters one by one
            match = True
            for j in range(m):
                if txt[i + j] != pat[j]:
                    match = False
                    break
            if match:
                res.append(i)

        # Calculate hash value for next window of text
        if i < n - m:
            t = (d * (t - ord(txt[i]) * h) + ord(txt[i + m])) % q
            # We might get negative values of t, converting it to positive
            if t < 0:
                t = t + q
                
    return res

if __name__ == "__main__":
    assert rabin_karp("GEEK", "GEEKS FOR GEEKS") == [0, 10]
    assert rabin_karp("TEST", "THIS IS A TEST TEXT") == [10]
    assert rabin_karp("A", "AAAAA") == [0, 1, 2, 3, 4]
    print("Python: rabin_karp passed tests!")
