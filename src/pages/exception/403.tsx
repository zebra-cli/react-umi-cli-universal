import Link from 'umi/link'
import { Result, Button } from 'antd'
import React from 'react'

export default () => (
  <Result
    status="403"
    title="403"
    style={{
      background: 'none'
    }}
    subTitle="暂无权限"
    extra={
      <Link to="/">
        <Button type="primary">首页</Button>
      </Link>
    }
  />
)
