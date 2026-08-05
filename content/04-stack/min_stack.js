class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }

    push(val) {
        this.stack.push(val);
        let minVal = this.minStack.length > 0 ? Math.min(val, this.minStack[this.minStack.length - 1]) : val;
        this.minStack.push(minVal);
    }

    pop() {
        this.stack.pop();
        this.minStack.pop();
    }

    top() {
        return this.stack[this.stack.length - 1];
    }

    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}

const assert = require('assert');
const ms = new MinStack();
ms.push(-2);
ms.push(0);
ms.push(-3);
assert.strictEqual(ms.getMin(), -3);
ms.pop();
assert.strictEqual(ms.top(), 0);
assert.strictEqual(ms.getMin(), -2);
console.log("All tests passed!");
