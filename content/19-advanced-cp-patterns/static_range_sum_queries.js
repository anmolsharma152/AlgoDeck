/**
 * Problem: Static Range Sum Queries
 * CSES: #1646 (Range Queries)
 * 
 * Time Complexity: Precomputation O(N), Query O(1)
 * Space Complexity: O(N)
 */

class StaticRangeSum {
    constructor(arr) {
        this.prefix = new Array(arr.length + 1).fill(0);
        for (let i = 0; i < arr.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + arr[i];
        }
    }

    query(a, b) {
        return this.prefix[b] - this.prefix[a - 1];
    }
}

if (require.main === module) {
    const solver = new StaticRangeSum([2, 4, 5, 3, 7, 1, 2, 6]);
    console.assert(solver.query(2, 4) === 12, "Test 1 Failed");
    console.assert(solver.query(1, 8) === 30, "Test 2 Failed");
    console.log("All JavaScript tests passed for Static Range Sum Queries!");
}
