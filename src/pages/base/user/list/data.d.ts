import { TableListData } from '@/interfaces'

export interface TableListItem {
  id: number | string
  name: string
  email: string
  phone: string
  can_use: number
  permission_name_arr: Array<string> | null
  permission_id_arr: Array<number> | null
}

export declare type TableListData = TableListData<TableListItem>

export interface TableListParams extends Partical<TableListItem> {
  key: string
  currentPage: number
  pageSize: number
}
