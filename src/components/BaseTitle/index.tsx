import React from 'react'
import styles from './index.less'

export interface Title {
  title: string | React.ReactNode
  size?: string
}

const BaseTitle: React.FC<Title> = props => {
  const { size = '' } = props
  const className = size === 'mini' ? styles.miniTitle : styles.title
  return (
    <div className={className}>
      {props.title}
      {props.children}
    </div>
  )
}

export default BaseTitle
