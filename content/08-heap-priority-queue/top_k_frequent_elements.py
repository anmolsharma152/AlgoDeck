from collections import Counter

def topKFrequent(nums, k: int):
    count = Counter(nums)
    freq = [[] for _ in range(len(nums) + 1)]

    for n, c in count.items():
        freq[c].append(n)

    res = []
    for i in range(len(freq) - 1, 0, -1):
        for n in freq[i]:
            res.append(n)
            if len(res) == k:
                return res
    return res

if __name__ == "__main__":
    assert sorted(topKFrequent([1,1,1,2,2,3], 2)) == [1,2], "Test 1 Failed"
    assert topKFrequent([1], 1) == [1], "Test 2 Failed"
    print("All tests passed!")
