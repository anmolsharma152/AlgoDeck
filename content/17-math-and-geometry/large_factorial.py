"""
Problem: Factorials of Large Numbers
GeeksforGeeks: https://practice.geeksforgeeks.org/problems/factorials-of-large-numbers/0
"""

def multiply(x: int, res: list[int]) -> int:
    """
    Multiplies x with the number represented by res array and updates res.
    Returns the new size of res.
    """
    carry = 0
    for i in range(len(res)):
        prod = res[i] * x + carry
        res[i] = prod % 10
        carry = prod // 10
        
    while carry:
        res.append(carry % 10)
        carry //= 10
        
    return len(res)

def factorial(n: int) -> list[int]:
    """
    Calculates factorial of a large number and returns it as a list of digits (reversed).
    Time Complexity: O(N^2)
    Space Complexity: O(N)
    """
    res = [1]
    for x in range(2, n + 1):
        multiply(x, res)
        
    res.reverse()
    return res

if __name__ == "__main__":
    assert "".join(map(str, factorial(5))) == "120"
    assert "".join(map(str, factorial(10))) == "3628800"
    print("Python: factorial passed tests!")
