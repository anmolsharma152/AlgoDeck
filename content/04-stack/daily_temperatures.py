def dailyTemperatures(temperatures):
    res = [0] * len(temperatures)
    stack = []

    for i, t in enumerate(temperatures):
        while stack and t > stack[-1][0]:
            stackT, stackInd = stack.pop()
            res[stackInd] = i - stackInd
        stack.append((t, i))

    return res

if __name__ == "__main__":
    t = [73,74,75,71,69,72,76,73]
    assert dailyTemperatures(t) == [1,1,4,2,1,1,0,0], "Test 1 Failed"
    print("All tests passed!")
