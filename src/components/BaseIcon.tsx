import React from 'react'

export interface Type {
  type: string
  className?: string
}

const BizIcon: React.FC<Type> = props => (
  <i className={`iconfont icon-cw-${props.type} ${props.className}`} />
)

export default BizIcon
