def canCompleteCircuit(gas, cost) -> int:
    if sum(gas) < sum(cost):
        return -1
    total, start = 0, 0
    for i in range(len(gas)):
        total += (gas[i] - cost[i])
        if total < 0:
            total = 0
            start = i + 1
    return start

if __name__ == "__main__":
    assert canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]) == 3, "Test 1 Failed"
    assert canCompleteCircuit([2,3,4], [3,4,3]) == -1, "Test 2 Failed"
    print("All tests passed!")
