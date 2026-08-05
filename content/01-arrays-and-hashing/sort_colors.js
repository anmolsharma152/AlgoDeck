/**
 * Problem: Sort Colors (Dutch National Flag Algorithm)
 * LeetCode: #75 (Medium) | NeetCode 150 | Blind 75
 * 
 * Sort an array of 0s, 1s, and 2s in-place.
 * 
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */

function sortColors(nums) {
    let low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
}

if (require.main === module) {
    const nums1 = [2, 0, 2, 1, 1, 0];
    sortColors(nums1);
    console.assert(JSON.stringify(nums1) === JSON.stringify([0, 0, 1, 1, 2, 2]), "Test 1 Failed");

    const nums2 = [2, 0, 1];
    sortColors(nums2);
    console.assert(JSON.stringify(nums2) === JSON.stringify([0, 1, 2]), "Test 2 Failed");
    console.log("All JavaScript tests passed for Sort Colors (Dutch National Flag)!");
}
