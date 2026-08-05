def canFinish(numCourses: int, prerequisites) -> bool:
    preMap = {i: [] for i in range(numCourses)}
    for crs, pre in prerequisites:
        preMap[crs].append(pre)

    visiting = set()

    def dfs(crs):
        if crs in visiting:
            return False
        if preMap[crs] == []:
            return True
        visiting.add(crs)
        for pre in preMap[crs]:
            if not dfs(pre):
                return False
        visiting.remove(crs)
        preMap[crs] = []
        return True

    for c in range(numCourses):
        if not dfs(c):
            return False
    return True

if __name__ == "__main__":
    assert canFinish(2, [[1,0]]) == True, "Test 1 Failed"
    assert canFinish(2, [[1,0],[0,1]]) == False, "Test 2 Failed"
    print("All tests passed!")
