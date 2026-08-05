function canCompleteCircuit(gas, cost) {
    let totalGas = gas.reduce((a,b)=>a+b, 0);
    let totalCost = cost.reduce((a,b)=>a+b, 0);
    if (totalGas < totalCost) return -1;

    let total = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        total += (gas[i] - cost[i]);
        if (total < 0) {
            total = 0;
            start = i + 1;
        }
    }
    return start;
}

const assert = require('assert');
assert.strictEqual(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]), 3);
assert.strictEqual(canCompleteCircuit([2,3,4], [3,4,3]), -1);
console.log("All tests passed!");
