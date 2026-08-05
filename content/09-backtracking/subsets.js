/**
 * Problem: Subsets
 * LeetCode: #78 (Medium) | NeetCode 150
 * 
 * Time Complexity: O(N * 2^N)
 * Space Complexity: O(N)
 */

function subsets(nums) {
    const res = [];
    const subset = [];

    function dfs(i) {
        if (i >= nums.length) {
            res.push([...subset]);
            return;
        }
        subset.push(nums[i]);
        dfs(i + 1);
        subset.pop();
        dfs(i + 1);
    }

    dfs(0);
    return res;
}

if (require.main === module) {
    const res = subsets([1, 2, 3]);
    console.assert(res.length === 8, "Test Failed");
    console.log("All JavaScript tests passed for Subsets!");
}
