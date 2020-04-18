import React from 'react'
import { Upload, Button, message } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { BASE_URL } from '@/utils/utils'

interface BaseBtnUploadProps {
  action: string
  name: string
  ghost: boolean
  uploadDone: () => void
}
class BaseBtnUpload extends React.Component<BaseBtnUploadProps> {
  handleChangeUpload = (info: UploadChangeParam) => {
    const { uploadDone } = this.props
    if (info.file.status !== 'done') {
      return
    }
    const { errcode, message: msg } = info.file.response || {}
    if (errcode === 0) {
      message.success(`成功导入 ${info.file.name} 文件`)
      uploadDone()
      return
    }
    message.error(msg)
  }

  render() {
    const { action, name = '导入Excel', uploadDone, ...rest } = this.props
    const icon = name !== '导入Excel' ? '' : 'cloud-upload'
    return (
      <Upload
        action={`${BASE_URL}${action}`}
        name="file"
        showUploadList={false}
        onChange={this.handleChangeUpload}
      >
        <Button icon={icon} type="primary" {...rest}>
          {name}
        </Button>
      </Upload>
    )
  }
}
export default BaseBtnUpload
