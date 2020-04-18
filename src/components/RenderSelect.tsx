import React from 'react'
import { Select } from 'antd'
import { SelectValueItem } from '@/interfaces'

const { Option } = Select
const renderItemArr = (data: any[]) =>
  data.map(
    (item: string, index: number) =>
      index !== 0 && (
        <Option key={index} value={index}>
          {item}
        </Option>
      )
  )

const renderItem = (data: SelectValueItem[]) =>
  data.map(({ id, name }) => (
    <Option key={id} value={id}>
      {name}
    </Option>
  ))

const filterOption = (input = '', item: any): any => {
  const value: any = item.props.children
  return value.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

export { renderItem, renderItemArr, filterOption }
