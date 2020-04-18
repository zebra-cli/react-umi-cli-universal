import request from '@/utils/request'
import { BASE_URL } from '@/utils/utils'
import { TableListParams, TableListItem } from './data.d'

export async function getPermission() {
  const { data } = await request(`${BASE_URL}/permissionDropdown`, {
    method: 'get'
  })
  return data
}

export async function getTableList(params: TableListParams) {
  const { data } = await request(`${BASE_URL}/userList`, {
    method: 'get',
    params
  })
  return data
}

export const updateUser = (url: string) => async (params: TableListItem) => {
  const res = await request(`${BASE_URL}/Permission/${url}`, {
    method: 'POST',
    data: params
  })
  return res
}
