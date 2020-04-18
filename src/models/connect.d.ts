import { AnyAction } from 'redux'
import { MenuDataItem } from '@ant-design/pro-layout'
import { RouterTypes } from 'umi'
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings'
import { UserModelState } from './user'

export { SettingModelState, UserModelState }

export interface Loading {
  global: boolean
  effects: { [key: string]: boolean | undefined }
  models: {
    global?: boolean
    menu?: boolean
    setting?: boolean
    user?: boolean
    logs?: boolean
  }
}

export interface ConnectState {
  loading: Loading
  settings: SettingModelState
  user: UserModelState
  permission: any
}

export interface Route extends MenuDataItem {
  routes?: Route[]
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?<K = any>(action: AnyAction): K
}
