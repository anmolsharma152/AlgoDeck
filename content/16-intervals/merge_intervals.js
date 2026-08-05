/**
 * Problem: Merge Intervals
 * LeetCode: #56 (Medium) | NeetCode 150 | Blind 75
 * 
 * Time Complexity: O(N log N)
 * Space Complexity: O(N)
 */

function mergeIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const interval of intervals) {
        if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
            merged.push(interval);
        } else {
            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
        }
    }
    return merged;
}

if (require.main === module) {
    console.assert(JSON.stringify(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])) === JSON.stringify([[1, 6], [8, 10], [15, 18]]), "Test 1 Failed");
    console.assert(JSON.stringify(mergeIntervals([[1, 4], [4, 5]])) === JSON.stringify([[1, 5]]), "Test 2 Failed");
    console.log("All JavaScript tests passed for Merge Intervals!");
}
