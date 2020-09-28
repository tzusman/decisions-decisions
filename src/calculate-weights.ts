export default (weights: number[], lockedWeights: Set<number>, idx: number, value: number) => {
  const availableSum = weights.reduce(
    (memo, weight, i) => memo - (lockedWeights.has(i) ? weight : 0),
    100
  )

  const val = Math.min(value, availableSum)
  const nextRemaining = availableSum - val

  return weights.reduce((memo: Array<number>, weight, i) => {
    if (i === idx) {
      memo[i] = val
    } else if (lockedWeights.has(i)) {
      memo[i] = weight
    } else {
      memo[i] = nextRemaining / (weights.length - lockedWeights.size - 1)
    }
    return memo
  }, [])
}
