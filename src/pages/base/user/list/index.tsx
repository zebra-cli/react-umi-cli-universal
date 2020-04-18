import { Card, Input, message, Button } from 'antd'
import React, { Component } from 'react'
import { Dispatch, Action } from 'redux'
import { connect } from 'dva'
import * as H from 'history'
import { TableListPagination, tableQueryProps } from '@/interfaces'
import StandardTable, {
  StandardTableColumnProps
} from '@/components/StandardTable'
import BaseBtnExport from '@/components/BaseBtnExport'
import CreateForm, { FormValsType } from './components/CreateForm'
import { StateType } from './model'
import { TableListItem } from './data.d'

const { Search } = Input

interface TableListProps {
  dispatch: Dispatch<
    Action<
      'baseUserList/fetch' | 'baseUserList/permission' | 'baseUserList/update'
    >
  >
  loading: boolean
  dialogLoading: boolean
  baseUserList: StateType
  location: H.Location
}

interface TableListState {
  modalVisible: boolean
  createFormValues: Partial<TableListItem>
  query: tableQueryProps
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    baseUserList,
    loading
  }: {
    baseUserList: StateType
    loading: {
      effects: {
        [key: string]: boolean
      }
    }
  }) => ({
    baseUserList,
    loading: loading.effects['baseUserList/fetch'],
    dialogLoading: loading.effects['baseUserList/update']
  })
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    query: {},
    createFormValues: {}
  }

  columns: StandardTableColumnProps<TableListItem>[] = [
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
      render: (val, record) => (
        <span
          className="table-text primary"
          onClick={() => this.handleModalVisible(true, record)}
        >
          {val}
        </span>
      )
    },
    {
      title: '邮箱',
      align: 'center',
      dataIndex: 'email'
    },
    {
      title: '权限',
      align: 'left',
      dataIndex: 'permission_name_arr',
      render: val => val.join(', ')
    },
    {
      title: '联系方式',
      align: 'center',
      dataIndex: 'phone'
    }
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'baseUserList/fetch'
    })
    dispatch({
      type: 'baseUserList/permission'
    })
  }

  handleModalVisible = (flag?: boolean, record?: TableListItem) => {
    this.setState({
      createFormValues: record || {},
      modalVisible: !!flag
    })
  }

  handleAdd = (fields: FormValsType) => {
    const { id } = fields
    const { dispatch } = this.props
    dispatch({
      type: 'baseUserList/update',
      payload: {
        ...fields,
        id
      },
      callback: () => {
        dispatch({
          type: 'baseUserList/fetch',
          payload: this.state.query
        })
        message.success('操作成功')
        this.handleModalVisible()
      }
    })
  }

  handleStandardTableChange = (pagination: Partial<TableListPagination>) => {
    const { query } = this.state
    const params: tableQueryProps = {
      ...query,
      ...pagination
    }
    this.refreshTable(params)
  }

  tableOperatorSearch = (key: string) => {
    const { query } = this.state
    const params = {
      ...query,
      key,
      currentPage: 1
    }
    this.refreshTable(params)
  }

  refreshTable = (params: tableQueryProps) => {
    const { dispatch } = this.props
    this.setState({
      query: params
    })
    dispatch({
      type: 'baseUserList/fetch',
      payload: params
    })
  }

  render() {
    const {
      baseUserList: { tableList, permission },
      loading,
      dialogLoading
    } = this.props
    const { modalVisible, createFormValues, query } = this.state
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    }
    return (
      <Card bordered={false}>
        <div className="table-operator-wrap">
          <div className="table-operator-search">
            <Search
              className="w-22"
              placeholder="请输入关键字"
              onSearch={value => this.tableOperatorSearch(value)}
            />
          </div>
          <div className="table-operator-btn">
            <Button
              className="mr-3"
              type="primary"
              onClick={() => this.handleModalVisible(true)}
            >
              新增
            </Button>
            <BaseBtnExport
              ghost
              name="全部导出"
              query={query}
              action="/home/Permission/exportUserList"
            />
          </div>
        </div>
        <StandardTable
          rowKey="id"
          loading={loading}
          data={tableList}
          columns={this.columns}
          rowClassName={record => (record.can_use === 1 ? 'disabled' : '')}
          onChange={this.handleStandardTableChange}
        />
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          loading={dialogLoading}
          values={createFormValues}
          option={{
            permission
          }}
        />
      </Card>
    )
  }
}

export default TableList
