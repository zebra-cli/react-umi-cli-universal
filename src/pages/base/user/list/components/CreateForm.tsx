import React, { Component } from 'react'
import { Form, Input, Modal, Select, Switch } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { SelectValueItem } from '@/interfaces'
import { TableListItem } from '../data.d'

const FormItem = Form.Item
const { Option } = Select

export interface FormValsType extends Partial<TableListItem> {}
interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean
  handleAdd: (fieldsValue: FormValsType) => void
  handleModalVisible: () => void
  values: FormValsType
  loading: boolean
  option: {
    permission: Array<SelectValueItem>
  }
}

class CreateForm extends Component<CreateFormProps> {
  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      values = {},
      option,
      loading
    } = this.props
    const { permission } = option
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return
        const fields = values.id
          ? { ...fieldsValue, id: values.id }
          : { ...fieldsValue }
        fields.can_use = fields.can_use ? 2 : 1
        handleAdd({ ...fields })
      })
    }
    const title = values.id ? '修改' : '新增'
    return (
      <Modal
        keyboard={false}
        maskClosable={false}
        className="modal-create-form"
        destroyOnClose
        width={800}
        title={`${title}用户`}
        okButtonProps={{ loading }}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="姓名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入姓名' }],
            initialValue: values.name
          })(<Input placeholder="请输入" allowClear />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="邮箱">
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱' }],
            initialValue: values.email
          })(<Input placeholder="请输入" allowClear />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="权限">
          {form.getFieldDecorator('permission_id_arr', {
            rules: [{ required: true, message: '请选择权限' }],
            initialValue: values.permission_id_arr
          })(
            <Select
              className="w-100"
              allowClear
              mode="multiple"
              placeholder="请选择权限"
              showSearch
              filterOption={(input = '', item): any => {
                const value: any = item.props.children
                return value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
            >
              {permission.map(({ id, name }) => (
                <Option value={id} key={id}>
                  {name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          label="联系方式"
        >
          {form.getFieldDecorator('phone', {
            initialValue: values.phone
          })(<Input placeholder="请输入" allowClear />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          label="用户可用"
        >
          {form.getFieldDecorator('can_use', {
            valuePropName: 'checked',
            initialValue: values.can_use === 2
          })(<Switch />)}
        </FormItem>
      </Modal>
    )
  }
}

export default Form.create<CreateFormProps>()(CreateForm)
