import { Radio } from 'antd'
import React from 'react'
import styles from './index.less'

export type BaseRaidoGroupValueProps = number | string

interface RaidoOptionsProps {
  id: BaseRaidoGroupValueProps
  name: string
}

interface BaseRaidoGroupProps {
  value: string | number
  option: RaidoOptionsProps[]
  onChange: (value: BaseRaidoGroupValueProps) => void
}

const getOptions = (data: RaidoOptionsProps[]) =>
  data.map(({ id, name }: RaidoOptionsProps) => (
    <Radio.Button key={id} value={id}>
      {name}
    </Radio.Button>
  ))

const BaseRaidoGroup: React.FC<BaseRaidoGroupProps> = props => {
  const { option, onChange, ...rest } = props
  return (
    <Radio.Group
      className={styles.filterRaidoGroupBtn}
      onChange={e => onChange(e.target.value)}
      {...rest}
    >
      {getOptions(option)}
    </Radio.Group>
  )
}

export default BaseRaidoGroup
