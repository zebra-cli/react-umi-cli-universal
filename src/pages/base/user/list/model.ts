import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva'
import { message } from 'antd'
import { SelectValueItem } from '@/interfaces'
import { getTableList, getPermission, updateUser } from './service'
import { TableListData } from './data.d'

export interface StateType {
  tableList: TableListData
  report: Array<SelectValueItem>
  permission: Array<SelectValueItem>
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & {
    select: <T>(func: (state: StateType) => T) => T
  }
) => void

export interface ModelType {
  namespace: string
  state: StateType
  effects: {
    permission: Effect
    fetch: Effect
    update: Effect
  }
  reducers: {
    save: Reducer<StateType>
  }
}

const Model: ModelType = {
  namespace: 'baseUserList',
  state: {
    tableList: {
      list: [],
      pagination: {}
    },
    report: [],
    permission: []
  },
  effects: {
    *permission({ callback }, { call, put }) {
      let permission = []
      try {
        permission = yield call(getPermission)
      } catch (error) {
        console.log(error)
      }
      yield put({
        type: 'save',
        payload: {
          permission
        }
      })
      if (callback) callback()
    },
    *update({ callback, payload }, { call }) {
      const url = payload.id ? 'updateUser' : 'addUser'
      const { errcode, message: msg } = yield call(updateUser(url), payload)
      if (errcode !== 0) {
        message.error(msg)
        return
      }
      if (callback) callback()
    },
    *fetch({ payload }, { call, put }) {
      let tableList = []
      try {
        tableList = yield call(getTableList, payload)
      } catch (error) {
        console.log(error)
      }
      yield put({
        type: 'save',
        payload: {
          tableList
        }
      })
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}

export default Model
