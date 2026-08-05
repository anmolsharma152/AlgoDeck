"""
Problem: Static Range Sum Queries
CSES: #1646 (Range Queries)

Given an array of n integers, process q queries of the form: what is the sum of values in range [a, b]?

Time Complexity: Precomputation O(N), Query O(1)
Space Complexity: O(N)
"""

class StaticRangeSum:
    def __init__(self, arr: list[int]):
        self.prefix = [0] * (len(arr) + 1)
        for i in range(len(arr)):
            self.prefix[i + 1] = self.prefix[i] + arr[i]

    def query(self, a: int, b: int) -> int:
        """1-indexed range query [a, b]"""
        return self.prefix[b] - self.prefix[a - 1]

if __name__ == "__main__":
    solver = StaticRangeSum([2, 4, 5, 3, 7, 1, 2, 6])
    assert solver.query(2, 4) == 12  # 4 + 5 + 3 = 12
    assert solver.query(1, 8) == 30  # sum of all elements
    print("All Python tests passed for Static Range Sum Queries!")
