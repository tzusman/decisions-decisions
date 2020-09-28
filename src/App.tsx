import classNames from 'classnames'
import { map, sortBy, times } from 'lodash'
import React, { Fragment, useMemo, useRef, useState } from 'react'

import calculateAdjustedScores from './calculate-adjusted-scores'
import calculateWeights from './calculate-weights'
import { ReactComponent as LockIcon } from './lock.svg'
import PopSlider from './PopSlider'
import { ReactComponent as UserIcon } from './user-regular.svg'

const criteria = ['Price', 'Wow factor', 'Maintenance', 'Gas efficiency']

const scores = [
  ['BMW', 3, 4, 2, 3],
  ['Infiniti', 4, 3, 4, 3],
  ['Lamborghini', 1, 5, 1, 2],
  ['Tesla', 2, 4, 3, 5],
  ['Toyota', 5, 1, 4, 4],
]

const styleByScore = (score: number) => ({
  width: `${1.5 + (score / 5) * 2.5}rem`,
  height: `${1.5 + (score / 5) * 2.5}rem`,
  opacity: score <= 4 ? 1 - 0.1 * score : 1,
})

const modes: Array<'Importance' | 'Agreement'> = ['Importance', 'Agreement']

function App() {
  /*
   * Weight adjusting
   */
  const [weightIdx, setWeightIdx] = useState<number | null>(null)
  const [weights, setWeights] = useState([25, 25, 25, 25])
  const sliderRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ]
  const setWeightIndex = (idx: number) => () => {
    if (weightIdx === idx) {
      setWeightIdx(null)
    } else {
      setWeightIdx(idx)
    }
  }
  const setWeightValue = (idx: number) => (value: number) => {
    const updatedWeights = calculateWeights(weights, lockedWeights, idx, value)
    setWeights(updatedWeights)
  }

  const adjustedConcepts = useMemo(() => calculateAdjustedScores(scores, weights), [weights])

  /*
   * Column sorting
   */
  const [sortColumn, setSortColumn] = useState(0)
  const [activeMode, setActiveMode] = useState<'Importance' | 'Agreement'>(modes[0])
  const sortedConcepts = useMemo(() => {
    let sorted = sortBy(adjustedConcepts, sortColumn)
    if (sortColumn > 0) {
      sorted = sorted.reverse()
    }
    return sorted
  }, [adjustedConcepts, sortColumn])

  /*
   * Locking weights
   */
  const [lockedWeights, setLockedWeights] = useState<Set<number>>(new Set())

  const onClickLock = (idx: number) => () => {
    if (lockedWeights.has(idx)) {
      lockedWeights.delete(idx)
    } else {
      lockedWeights.add(idx)
    }

    setLockedWeights(new Set(lockedWeights))
    setWeightIdx(-1)
  }

  const maxAvailable = useMemo(
    () => weights.reduce((memo, weight, i) => memo - (lockedWeights.has(i) ? weight : 0), 100),
    [weights, lockedWeights]
  )

  return (
    <Fragment>
      <div className="w-full px-4 md:px-0 md:w-2/3 mx-auto mt-4 md:mt-8 flex flex-col md:flex-row">
        <div className="leading-10 tracking-wider text-gray-600 flex">
          Which car should I buy?
          <div className="flex-1 text-gray-500 text-right mr-6 md:hidden inline">
            <UserIcon className="w-4 h-4 inline relative" style={{ bottom: 2 }} /> 278
          </div>
        </div>
        <div className="flex-1 text-gray-500 text-right mr-6 pt-2 hidden md:block">
          <UserIcon className="w-4 h-4 inline relative mr-1" style={{ bottom: 2 }} /> 278
        </div>
        <div className="button-wrapper w-full md:w-auto mt-3 md:mt-0 ">
          {map(modes, mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={classNames('button', {
                active: activeMode === mode,
                inactive: activeMode !== mode,
              })}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full md:w-2/3 mx-auto my-6">
        <div className="bg-white md:rounded-lg shadow">
          <table>
            <thead>
              <tr className="text-left">
                {map(['Concept', ...criteria], (criterion, idx) => (
                  <th
                    key={criterion}
                    onClick={() => setSortColumn(idx)}
                    className={classNames({
                      'cursor-pointer': sortColumn !== idx,
                      'text-center': idx > 0,
                      'pl-6': idx === 0,
                    })}
                    style={{
                      width: `${idx === 0 ? 28 : 18}%`,
                    }}
                  >
                    {sortColumn === idx && <span>&bull; </span>}
                    {criterion}
                  </th>
                ))}
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td></td>
                {times(criteria.length).map(idx => (
                  <td key={idx} className="align-baseline" style={{ zIndex: 100 - idx }}>
                    <div>
                      <LockIcon
                        onClick={onClickLock(idx)}
                        className={classNames('w-3 h-3 ml-16 absolute right-0 cursor-pointer', {
                          'text-gray-500 visible-on-hover': !lockedWeights.has(idx),
                          'text-gray-700': lockedWeights.has(idx),
                        })}
                        style={{ marginTop: '0.2rem', marginRight: '25%' }}
                      />
                      <span
                        onClick={setWeightIndex(idx)}
                        ref={sliderRefs[idx]}
                        className={classNames({
                          'cursor-default': lockedWeights.has(idx),
                          'cursor-pointer': !lockedWeights.has(idx),
                        })}
                      >
                        {Math.round(weights[idx])}%
                      </span>
                    </div>
                    {weightIdx === idx && !lockedWeights.has(idx) && (
                      <PopSlider
                        value={weights[idx]}
                        maxValue={maxAvailable}
                        onChange={setWeightValue(idx)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
            <tbody>
              {map(sortedConcepts, ([concept, ...scores]) => (
                <tr key={concept}>
                  <td className={classNames('pl-6')}>
                    <span className={'cell-text'}>{concept}</span>
                  </td>
                  {map(scores, (score: number, idx) => {
                    return (
                      <td key={idx} data-score={score} className={classNames('text-center')}>
                        <div className={'mx-auto flex'} style={styleByScore(5)}>
                          <span className="score" style={styleByScore(score)} />
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  )
}

export default App
