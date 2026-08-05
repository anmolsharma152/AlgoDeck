function dailyTemperatures(temperatures) {
    let res = new Array(temperatures.length).fill(0);
    let stack = [];

    for (let i = 0; i < temperatures.length; i++) {
        let t = temperatures[i];
        while (stack.length > 0 && t > stack[stack.length - 1][0]) {
            let [stackT, stackInd] = stack.pop();
            res[stackInd] = i - stackInd;
        }
        stack.push([t, i]);
    }
    return res;
}

const assert = require('assert');
const t = [73,74,75,71,69,72,76,73];
assert.deepStrictEqual(dailyTemperatures(t), [1,1,4,2,1,1,0,0]);
console.log("All tests passed!");
