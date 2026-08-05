"""
Problem: Best Time to Buy and Sell Stock
LeetCode: #121 (Easy) | NeetCode 150 | Blind 75
"""

def max_profit(prices: list[int]) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    min_price = float('inf')
    max_prof = 0
    
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_prof:
            max_prof = price - min_price
            
    return max_prof

if __name__ == "__main__":
    assert max_profit([7, 1, 5, 3, 6, 4]) == 5
    assert max_profit([7, 6, 4, 3, 1]) == 0
    print("Python: max_profit passed tests!")
