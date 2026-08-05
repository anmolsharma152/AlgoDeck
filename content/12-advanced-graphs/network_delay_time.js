/**
 * Problem: Network Delay Time
 * LeetCode: #743 (Medium) | NeetCode 150
 */

class MinHeap {
    constructor() {
        this.heap = [];
    }
    push(val) {
        this.heap.push(val);
        this.siftUp(this.heap.length - 1);
    }
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.siftDown(0);
        return root;
    }
    siftUp(idx) {
        let parent = Math.floor((idx - 1) / 2);
        while (idx > 0 && this.heap[idx][0] < this.heap[parent][0]) {
            [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
            idx = parent;
            parent = Math.floor((idx - 1) / 2);
        }
    }
    siftDown(idx) {
        let smallest = idx;
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        if (left < this.heap.length && this.heap[left][0] < this.heap[smallest][0]) {
            smallest = left;
        }
        if (right < this.heap.length && this.heap[right][0] < this.heap[smallest][0]) {
            smallest = right;
        }
        if (smallest !== idx) {
            [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
            this.siftDown(smallest);
        }
    }
}

function networkDelayTime(times, n, k) {
    /**
     * Time Complexity: O(E * log V)
     * Space Complexity: O(V + E)
     */
    const adj = {};
    for (let i = 1; i <= n; i++) {
        adj[i] = [];
    }
    for (const [u, v, w] of times) {
        adj[u].push([v, w]);
    }
    
    const minHeap = new MinHeap();
    minHeap.push([0, k]); // [cost, node]
    const visit = new Map();
    
    while (minHeap.heap.length > 0) {
        const [w1, n1] = minHeap.pop();
        if (visit.has(n1)) continue;
        visit.set(n1, w1);
        
        for (const [n2, w2] of adj[n1]) {
            if (!visit.has(n2)) {
                minHeap.push([w1 + w2, n2]);
            }
        }
    }
    
    if (visit.size !== n) return -1;
    let maxCost = 0;
    for (const cost of visit.values()) {
        maxCost = Math.max(maxCost, cost);
    }
    return maxCost;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), 2);
    assert.strictEqual(networkDelayTime([[1, 2, 1]], 2, 1), 1);
    assert.strictEqual(networkDelayTime([[1, 2, 1]], 2, 2), -1);
    console.log("JS: networkDelayTime passed tests!");
}
