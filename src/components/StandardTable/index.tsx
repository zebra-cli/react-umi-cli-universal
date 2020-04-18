import { Table } from 'antd'
import {
  ColumnProps,
  TableRowSelection,
  TableProps,
  PaginationConfig,
  SorterResult,
  TableCurrentDataSource
} from 'antd/es/table'
import React, { Component } from 'react'

import styles from './index.less'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface FormatPagination extends PaginationConfig {
  currentPage?: number
  pageSize?: number
}

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps<T>[]
  data: {
    list: T[]
    pagination: FormatPagination | false | undefined
  }
  selection?: boolean
  isNum?: boolean // 是否序号
  selectedRows?: T[]
  onSelectRow?: (rows: any) => void
  // eslint-disable-next-line max-len
  onChange?: (
    pagination: FormatPagination,
    filters: Partial<Record<keyof T, string[]>>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>
  ) => void
}

export interface StandardTableColumnProps<T> extends ColumnProps<T> {
  needTotal?: boolean
  total?: number
}

function initTotalList<T>(columns: StandardTableColumnProps<T>[]) {
  if (!columns) {
    return []
  }
  const totalList: StandardTableColumnProps<T>[] = []
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 })
    }
  })
  return totalList
}

interface StandardTableState<T> {
  selectedRowKeys: string[]
  needTotalList: StandardTableColumnProps<T>[]
}

class StandardTable<T> extends Component<
  StandardTableProps<T>,
  StandardTableState<T>
> {
  static getDerivedStateFromProps<K>(nextProps: StandardTableProps<K>) {
    // clean state
    const { length } = nextProps.selectedRows || []
    if (length === 0) {
      const needTotalList = initTotalList(nextProps.columns)
      return {
        selectedRowKeys: [],
        needTotalList
      }
    }
    return null
  }

  constructor(props: StandardTableProps<T>) {
    super(props)
    const { columns } = props
    const needTotalList = initTotalList(columns)

    this.state = {
      selectedRowKeys: [],
      needTotalList
    }
  }

  handleRowSelectChange: TableRowSelection<T>['onChange'] = (
    selectedRowKeys,
    selectedRows: T[]
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[]
    let { needTotalList } = this.state
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce(
        (sum, val) => sum + parseFloat(val[item.dataIndex || 0]),
        0
      )
    }))
    const { onSelectRow } = this.props
    if (onSelectRow) {
      onSelectRow(selectedRows)
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList })
  }

  handleTableChange: TableProps<T>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props
    if (onChange) {
      const formartPagination = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize
      } as FormatPagination
      onChange(formartPagination, filters, sorter, ...rest)
    }
  }

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], [])
    }
  }

  getFormatterColumns = (columns: any[] = []) => {
    let formartColumns: any[] = []
    formartColumns = JSON.parse(JSON.stringify(columns))
    const { data } = this.props
    const { pagination = false } = data || {}
    const { currentPage = 1, pageSize = 10 } = pagination || {}

    formartColumns.splice(0, 0, {
      title: '序号',
      align: 'center',
      dataIndex: 'id',
      width: 60,
      render: (_: any, record: any, index: number) => {
        if (!pagination) return index
        return pageSize * (currentPage - 1) + 1 + index
      }
    })
    formartColumns = formartColumns.map(
      (item: { align: any }, index: number) => {
        const otherColumns =
          index === 0 ? formartColumns[0] : columns[index - 1]
        return {
          ...otherColumns,
          align: item.align || 'center'
        }
      }
    )
    return formartColumns
  }

  formatterPagination = () => {
    const { data } = this.props
    const { currentPage: current, ..._pages } = data.pagination || {}
    const pagination = data.pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          current,
          ..._pages
        }
      : data.pagination
    if (!pagination) return pagination
    pagination.pageSize = pagination.pageSize ? ~~pagination.pageSize : 10
    pagination.current = pagination.current ? ~~pagination.current : 1
    return pagination
  }

  renderFooter() {
    const { data } = this.props
    const { pagination = false } = data || {}
    if (!pagination) return null
    const { total = 0, currentPage = 1, pageSize = 10 } = pagination || {}
    const left = pageSize * (currentPage - 1) + 1
    let right = pageSize * currentPage
    if (right > total) {
      right = total
    }
    if (total === 0) return null
    return (
      <span className={styles.footerTotal}>
        当前显示 {left} - {right} 条，共 {total} 条
      </span>
    )
  }

  render() {
    const { selectedRowKeys } = this.state
    const { data, rowKey, selection, isNum = true, ...rest } = this.props
    let formartColumns: any[] = []
    formartColumns = isNum
      ? this.getFormatterColumns(rest.columns)
      : rest.columns
    const { list = [] } = data || {}
    const pagination = this.formatterPagination()

    const rowSelection: TableRowSelection<T> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange
    }

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={selection ? rowSelection : undefined}
          dataSource={list}
          pagination={pagination}
          {...rest}
          onChange={this.handleTableChange}
          columns={formartColumns}
          footer={() => this.renderFooter()}
        />
      </div>
    )
  }
}

export default StandardTable
