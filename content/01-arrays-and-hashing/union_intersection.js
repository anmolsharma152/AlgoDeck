/**
 * Problem: Union and Intersection of Sorted Arrays
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/union-of-two-arrays/0
 */

function getUnionAndIntersection(arr1, arr2) {
    /**
     * Finds the union and intersection of two sorted arrays.
     * Time Complexity: O(N + M)
     * Space Complexity: O(N + M)
     */
    let i = 0, j = 0;
    const union = [];
    const intersection = [];
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
                union.push(arr1[i]);
            }
            i++;
        } else if (arr1[i] > arr2[j]) {
            if (union.length === 0 || union[union.length - 1] !== arr2[j]) {
                union.push(arr2[j]);
            }
            j++;
        } else {
            if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
                union.push(arr1[i]);
            }
            if (intersection.length === 0 || intersection[intersection.length - 1] !== arr1[i]) {
                intersection.push(arr1[i]);
            }
            i++;
            j++;
        }
    }
    
    while (i < arr1.length) {
        if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
            union.push(arr1[i]);
        }
        i++;
    }
    
    while (j < arr2.length) {
        if (union.length === 0 || union[union.length - 1] !== arr2[j]) {
            union.push(arr2[j]);
        }
        j++;
    }
    
    return [union, intersection];
}

if (require.main === module) {
    const assert = require('assert');
    const [u, inter] = getUnionAndIntersection([1, 3, 4, 5, 7], [2, 3, 5, 6]);
    assert.deepStrictEqual(u, [1, 2, 3, 4, 5, 6, 7]);
    assert.deepStrictEqual(inter, [3, 5]);
    console.log("JS: union_intersection passed tests!");
}
