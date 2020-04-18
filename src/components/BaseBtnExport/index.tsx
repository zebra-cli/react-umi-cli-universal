import React from 'react'
import qs from 'qs'
import { Button } from 'antd'
import { BASE_URL } from '@/utils/utils'
import { ButtonProps } from 'antd/es/button/button'

interface BaseBtnExportrops extends ButtonProps {
  action: string
  name?: string
  query?: {
    [x: string]: string | number | undefined | null | ''
  }
}
const BaseBtnExport: React.FC<BaseBtnExportrops> = props => {
  const { action, query = '', name = '导出列表', ...rest } = props
  const icon = name !== '导出列表' ? '' : 'cloud-download'
  const href = `${BASE_URL}${action}?${qs.stringify(query)}`

  return (
    <Button icon={icon} type="primary" href={href} target="_blank" {...rest}>
      {name}
    </Button>
  )
}
export default BaseBtnExport
