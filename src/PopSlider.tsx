import 'rc-slider/assets/index.css'

import Slider from 'rc-slider'
import React from 'react'

type Props = {
  value: number
  maxValue: number
  onChange: (value: number) => void
}

const PopSlider = ({ value, maxValue, onChange }: Props) => {
  return (
    <div className="w-full border border-gray-400 bg-white rounded p-2 mt-1 absolute left-0 right-0">
      <Slider
        min={0}
        max={maxValue}
        value={value}
        onChange={onChange}
        handleStyle={{
          backgroundColor: 'rgb(160, 174, 192)',
          borderColor: 'rgb(160, 174, 192)',
          boxShadow: 'none',
        }}
        railStyle={{ backgroundColor: 'rgb(203, 213, 224)' }}
        trackStyle={{ backgroundColor: 'rgb(203, 213, 224)' }}
      />
    </div>
  )
}

export default PopSlider
