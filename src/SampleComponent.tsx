import React from 'react'
import { WidgetModel } from '@jupyter-widgets/base'
import { useModelValue } from './hooks'

interface Props {
  model: WidgetModel
}

export const SampleComponent = ({ model } : Props) => {
  const [value, setValue] = useModelValue<string>(model, 'value')
  const [inputValue, setInputValue] = React.useState<string>(value)

  React.useEffect(() => {
    console.log('Context value changed:', value)
    setInputValue(value)
  }, [value])

  const updateValue = () => {
    setValue(inputValue)
  }

  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    <b>Value is: {value}</b>
    <input type="text" onChange={e => setInputValue(e.target.value)} value={inputValue}/>
    <button onClick={updateValue}>Update value</button>
  </div>
}