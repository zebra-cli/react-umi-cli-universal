import { Button, Result } from 'antd'
import React from 'react'
import router from 'umi/router'

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        首页
      </Button>
    }
  />
)

export default NoFoundPage
