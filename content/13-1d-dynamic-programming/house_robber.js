function rob(nums) {
    let rob1 = 0, rob2 = 0;
    for (let n of nums) {
        let temp = Math.max(n + rob1, rob2);
        rob1 = rob2;
        rob2 = temp;
    }
    return rob2;
}

const assert = require('assert');
assert.strictEqual(rob([1,2,3,1]), 4);
assert.strictEqual(rob([2,7,9,3,1]), 12);
console.log("All tests passed!");
