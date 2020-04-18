/*
| table 接口
*/
export interface TableListPagination {
  total: number
  pageSize: number
  currentPage: number
}

export interface TableListData<T> {
  list: T[]
  pagination: Partial<TableListPagination>
  [x: string]: any
}

/*
| select 接口
*/
export interface SelectValueItem {
  id: string | number
  name: string
  children?: SelectValueItem[]
}

export interface tableQueryProps {
  [key: string]: string | number | undefined
}

export interface TableListParams {
  key: string
  currentPage: number
  pageSize: number
}
