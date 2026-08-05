/**
 * Problem: Elements Appearing More than N/K times
 * GeeksforGeeks: https://www.geeksforgeeks.org/given-an-array-of-of-size-n-finds-all-the-elements-that-appear-more-than-nk-times/
 */

function getMajorityElements(arr, k) {
    /**
     * Finds elements that appear more than N/K times.
     * Time Complexity: O(N)
     * Space Complexity: O(K)
     */
    const n = arr.length;
    if (k <= 1) return Array.from(new Set(arr)).sort((a, b) => a - b);
    
    // Step 1: Find candidates
    let candidates = new Map();
    for (let i = 0; i < n; i++) {
        const num = arr[i];
        if (candidates.has(num)) {
            candidates.set(num, candidates.get(num) + 1);
        } else if (candidates.size < k - 1) {
            candidates.set(num, 1);
        } else {
            const nextCandidates = new Map();
            for (const [key, value] of candidates.entries()) {
                if (value > 1) {
                    nextCandidates.set(key, value - 1);
                }
            }
            candidates = nextCandidates;
        }
    }
    
    // Step 2: Validate candidates
    const res = [];
    const threshold = Math.floor(n / k);
    for (const candidate of candidates.keys()) {
        let count = 0;
        for (let i = 0; i < n; i++) {
            if (arr[i] === candidate) count++;
        }
        if (count > threshold) {
            res.push(candidate);
        }
    }
    
    return res.sort((a, b) => a - b);
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(getMajorityElements([3, 1, 2, 2, 1, 2, 3, 3], 4), [2, 3]);
    assert.deepStrictEqual(getMajorityElements([9, 8, 7, 9, 2, 9, 7], 3), [9]);
    console.log("JS: getMajorityElements passed tests!");
}
