def rob(nums) -> int:
    rob1, rob2 = 0, 0
    for n in nums:
        temp = max(n + rob1, rob2)
        rob1 = rob2
        rob2 = temp
    return rob2

if __name__ == "__main__":
    assert rob([1,2,3,1]) == 4, "Test 1 Failed"
    assert rob([2,7,9,3,1]) == 12, "Test 2 Failed"
    print("All tests passed!")
