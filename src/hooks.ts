import React from 'react'
import { WidgetModel } from '@jupyter-widgets/base'

export const useModelValue = <T extends unknown>(model: WidgetModel, propertyName: string): [T, (value: T) => void] => {
  const [value, setValue] = React.useState<T>(model.get(propertyName) as T)

  model.on(`change:${propertyName}`, () => {
    setValue(model.get(propertyName) as T)
  })

  const updateValue = (v: T) => {
    setValue(v)
    model.set(propertyName, v)
    model.save_changes()
  }

  return [value, updateValue]
}
