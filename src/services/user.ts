import request from '@/utils/request'
import { BASE_URL } from '@/utils/utils'

export async function queryCurrent(): Promise<any> {
  const data = await request(`${BASE_URL}/auth/userInfo`, {
    method: 'POST'
  })
  return data
}
