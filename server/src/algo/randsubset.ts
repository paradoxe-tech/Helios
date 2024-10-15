 /**
 * selects a random subset from an array with constant
 * distribution before u and growing distribution after u.
 * this version uses reservoir sampling for efficiency.
 * @param {Array<T>} array : the array to sample from
 * @param {number} n : the number of elements to select
 * @param {number} u : the index between constant and growing distributions
 * @returns {Array<T>} : an array containing the random subset
 */
export default function randsubset<T>(arr: T[], n: number, u: number): T[] {
  const subset: T[] = [];
  const max = arr.length;

  for (let i = 0; i < max; i++) {
    let probability;

    // uniform selection before u
    if (i < u) probability = n / max;
    else {
      // exponential growth after u
      const factor = (i - u) / (max - u);
      probability = 1 - Math.exp(-factor);
    }

    // use reservoir sampling to select items
    if (Math.random() < probability) {
      if (subset.length < n) subset.push(arr[i]); // add directly if subset is not full
      else {
        // randomly replace an existing element in the subset
        const j = Math.floor(Math.random() * subset.length);
        subset[j] = arr[i];
      }
    }

    // early exit if enough items were selected
    if (subset.length === n) break;
  }

  return subset;
}