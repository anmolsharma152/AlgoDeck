function canPartition(nums) {
    let total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;

    let target = total / 2;
    let dp = new Set([0]);

    for (let n of nums) {
        let nextDP = new Set(dp);
        for (let t of dp) {
            if (t + n === target) return true;
            if (t + n < target) nextDP.add(t + n);
        }
        dp = nextDP;
    }

    return dp.has(target);
}

const assert = require('assert');
assert.strictEqual(canPartition([1,5,11,5]), true);
assert.strictEqual(canPartition([1,2,3,5]), false);
console.log("All tests passed!");
