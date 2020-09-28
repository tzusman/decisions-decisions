type concepts = (string | number)[][]

export default (concepts: concepts, weights: Array<number>) => {
  const maxWeight = Math.max(...weights)

  const a = concepts.reduce<concepts>((memo, set, idx) => {
    const [concept, ...scores] = set
    const adjustedValues = scores.map((score, i) => ((score as number) * weights[i]) / 100.0)
    memo.push([concept, ...adjustedValues])
    return memo
  }, [])

  const adjustedScores = a.map(set => {
    const [concept, ...scores] = set
    const adjusted = (scores as number[]).map((score, idx) => score * (100 / maxWeight))
    return [concept, ...adjusted]
  })

  return adjustedScores
}
