import React from 'react'
import { Upload, Button, Icon, message } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import reqwest from 'reqwest'
import styles from './index.less'

interface BaseUploadProps {
  action: string
  onUpload: (params: any) => void
}
interface BaseUploadState {
  fileList: UploadFile<any>[]
  uploading: boolean
}

class BaseUpload extends React.Component<BaseUploadProps, BaseUploadState> {
  state = {
    fileList: [],
    uploading: false
  }

  handleUpload = () => {
    const { fileList } = this.state
    const { action, onUpload } = this.props
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('files[]', file)
    })

    this.setState({
      uploading: true
    })

    // You can use any AJAX library you like
    reqwest({
      url: action,
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false
        })
        onUpload({ id: 10010 })
        message.success('upload successfully.')
      },
      error: () => {
        this.setState({
          uploading: false
        })
        message.error('upload failed.')
      }
    })
  }

  render() {
    const { uploading, fileList } = this.state
    const props = {
      onRemove: (file: UploadFile<any>) => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList
          }
        })
      },
      beforeUpload: (file: UploadFile<any>) => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }))
        return false
      },
      fileList
    }

    return (
      <div className={styles.fileUpload}>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          className={styles.upload}
        >
          {uploading ? '正在上传...' : '上传选择文件'}
        </Button>
      </div>
    )
  }
}
export default BaseUpload
