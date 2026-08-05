function topKFrequent(nums, k) {
    let count = {};
    for (let n of nums) count[n] = (count[n] || 0) + 1;

    let freq = Array.from({ length: nums.length + 1 }, () => []);
    for (let n in count) freq[count[n]].push(Number(n));

    let res = [];
    for (let i = freq.length - 1; i > 0; i--) {
        for (let n of freq[i]) {
            res.push(n);
            if (res.length === k) return res;
        }
    }
    return res;
}

const assert = require('assert');
assert.deepStrictEqual(topKFrequent([1,1,1,2,2,3], 2).sort(), [1,2]);
assert.deepStrictEqual(topKFrequent([1], 1), [1]);
console.log("All tests passed!");
