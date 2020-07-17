/* eslint-disable prettier/prettier */

// normalize to valid integer value
export const validate = (v, max = 0) => Math.max((Number.isInteger(v) ? v : 0), max);

// calculate 0-indexed numbers
// Example:
// 4/5 = 0.x, 1 page, max page index 1-1 = 0
// 5/5 = 1.0, 1 page, max page index 1-1 = 0
// 6/5 = 1.x, 2 pages, max page index 2-1 = 1
export const pageMax = (itemMax, pageRows) => Math.ceil(itemMax / pageRows) - 1;

