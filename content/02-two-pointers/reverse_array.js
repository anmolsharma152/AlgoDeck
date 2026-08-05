/**
 * Problem: Reverse an Array
 * Platform: GeeksforGeeks / Standard Fundamental Benchmark
 * Pattern: Two Pointers (Opposite Direction)
 * 
 * Given an array, reverse the elements in-place using two pointers.
 * 
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */

function reverseArray(arr) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    return arr;
}

if (require.main === module) {
    const test1 = [1, 2, 3, 4, 5];
    console.assert(JSON.stringify(reverseArray(test1)) === JSON.stringify([5, 4, 3, 2, 1]), "Test 1 Failed");

    const test2 = [10, 20];
    console.assert(JSON.stringify(reverseArray(test2)) === JSON.stringify([20, 10]), "Test 2 Failed");

    const test3 = [7];
    console.assert(JSON.stringify(reverseArray(test3)) === JSON.stringify([7]), "Test 3 Failed");

    console.log("All JavaScript tests passed for Reverse Array!");
}
