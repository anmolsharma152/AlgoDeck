/**
 * Problem: Two Sum
 * LeetCode: #1 (Easy) | NeetCode 150 | Blind 75
 * 
 * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
 * 
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */

function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

// Test Cases
if (require.main === module) {
    console.assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]), "Test 1 Failed");
    console.assert(JSON.stringify(twoSum([3, 2, 4], 6)) === JSON.stringify([1, 2]), "Test 2 Failed");
    console.assert(JSON.stringify(twoSum([3, 3], 6)) === JSON.stringify([0, 1]), "Test 3 Failed");
    console.log("All JavaScript tests passed for Two Sum!");
}
