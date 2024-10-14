 /**
 * clamps a value between a `minValue` and a `maxValue`
 * @param {number} x : the input value to be clamped
 * @param {number} [minValue=0] : the minimum allowable value, defaults to 0
 * @param {number} [maxValue=1] : the maximum allowable value, defaults to 1
 * @returns {number} the clamped value
 * @throws {Error} if `maxValue` is more than or equal to `minValue`
 */
export function cut(x:number, minValue:number=0, maxValue:number=1):number {
  if (minValue >= maxValue) throw new Error('minValue cannot be >= maxValue')
  return Math.min(Math.max(minValue, x), maxValue)
}

 /**
 * performs z-score normalization on the value
 * @param {number} x : the input value
 * @param {number} mu : the mean of the dataset
 * @param {number} sigma : the standard deviation of the dataset
 * @param {number} [minValue=0] : the minimum possible value after scaling
 * @param {number} [maxValue=1] : the maximum possible value after scaling
 * @returns {number} the scaled z-score normalized value
 * @throws {Error} if `sigma` is <= 0 to prevent division by zero
 * @throws {Error} if `maxValue` is more than or equal to `minValue`
 */
export function z(x:number, mu:number, sigma:number, minValue:number=0, maxValue:number=1):number {
  if (sigma <= 0) throw new Error('sigma parameter cannot be <= 0')
  if (minValue >= maxValue) throw new Error('minValue cannot be >= maxValue')
  const zValue = (x - mu) / sigma
  return minValue + (maxValue - minValue) * (zValue - (-3)) / 6 // Approximate range of [-3, 3]
}

 /**
 * scales a value between 0 and 1 depending on a max
 * @param {number} x : the input value
 * @param {number} min : the minimum value of the dataset
 * @param {number} max : the maximum value of the dataset
 * @param {number} [minValue=0] : the minimum possible value after scaling
 * @param {number} [maxValue=1] : the maximum possible value after scaling
 * @returns {number} the scaled min-max normalized value
 * @throws {Error} if `max` is less than or equal to `min`
 * @throws {Error} if `maxValue` is more than or equal to `minValue`
 */
export function minmax(x:number, min:number, max:number, minValue:number=0, maxValue:number=1):number {
  if (max <= min) throw new Error('max must be > min')
  if (minValue >= maxValue) throw new Error('minValue cannot be >= maxValue')
  const normalized = (x - min) / (max - min)
  return minValue + (maxValue - minValue) * normalized
}

 /**
 * applies sigmoid normalization on the value
 * @param {number} x : the input value
 * @param {number} [minValue=0] : the minimum possible value after scaling
 * @param {number} [maxValue=1] : the maximum possible value after scaling
 * @returns {number} the scaled sigmoid normalized value
 * @throws {Error} if `maxValue` is more than or equal to `minValue`
 */
export function sigmoid(x:number, minValue:number=0, maxValue:number=1):number {
  if (minValue >= maxValue) throw new Error('minValue cannot be >= maxValue')
  const normalized = 1 / (1 + Math.exp(-x))
  return minValue + (maxValue - minValue) * normalized
}

 /**
 * applies exponential normalization to the value
 * @param {number} x : the input value
 * @param {number} [minValue=0] : the minimum possible value after scaling
 * @param {number} [maxValue=1] : the maximum possible value after scaling
 * @returns {number} the scaled exponentially normalized value
 * @throws {Error} if `maxValue` is more than or equal to `minValue`
 */
export function exp(x:number, minValue:number=0, maxValue:number=1):number {
  if (minValue >= maxValue) throw new Error('minValue cannot be >= maxValue')
  const normalized = 1 - Math.exp(-x)
  return minValue + (maxValue - minValue) * normalized
}

/**
 * apply the bell curve normalization to the value
 * @param {number} x - the input value
 * @param {number} mu - the mean of the dataset
 * @param {number} sigma - the standard deviation of the dataset
 * @param {number} [minValue=0] - the minimum value after normalization
 * @param {number} [maxValue=1] - the maximum value after normalization
 * @returns {number} the normalized and scaled value based on the normal curve
 * @throws {Error} if `sigma` is <= 0 to prevent division by zero
 * @throws {Error} if `maxValue` is more than or equal to `minValue`
 */
export function bell(x:number, mu:number, sigma:number, minValue:number=0, maxValue:number=1): number {
  if (sigma <= 0) throw new Error('sigma parameter cannot be <= 0');
  if (minValue >= maxValue) throw new Error('minValue cannot be >= maxValue')

  const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -((x - mu) ** 2) / (2 * sigma ** 2);
  const pdfValue = coefficient * Math.exp(exponent);
  return minValue + (maxValue - minValue) * pdfValue;
}