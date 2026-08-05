def canPartition(nums) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False

    target = total // 2
    dp = set([0])

    for n in nums:
        nextDP = set(dp)
        for t in dp:
            if t + n == target:
                return True
            if t + n < target:
                nextDP.add(t + n)
        dp = nextDP

    return target in dp

if __name__ == "__main__":
    assert canPartition([1,5,11,5]) == True, "Test 1 Failed"
    assert canPartition([1,2,3,5]) == False, "Test 2 Failed"
    print("All tests passed!")
