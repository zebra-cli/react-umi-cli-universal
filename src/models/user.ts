import { Effect } from 'dva'
import { Reducer } from 'redux'
import { queryCurrent } from '@/services/user'
import { setAuthority } from '@/utils/authority'
import { EXTRA_AUTH_STR } from '@/constant'

export interface CurrentUser {
  info?: {
    id?: string | number
    real_name?: string
    user_name?: string
  }
  role?: {
    role_id?: string
    permission_list?: any
  }
  data?: {
    data_type?: string
    dealer_list?: any
  }
}

export interface UserModelState {
  currentUser?: CurrentUser
}

export interface UserModelType {
  namespace: 'user'
  state: UserModelState
  effects: {
    fetchCurrent: Effect
  }
  reducers: {
    saveCurrentUser: Reducer<UserModelState>
  }
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {}
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const { data } = yield call(queryCurrent)
      if (!data) {
        // yield put(
        //   routerRedux.replace({
        //     pathname: '/user/login',
        //   }),
        // );
      }
      const { user = {}, permission = {} } = data || {}
      setAuthority(EXTRA_AUTH_STR + user.id)
      yield put({
        type: 'saveCurrentUser',
        payload: {
          info: {
            id: user.id,
            real_name: user.name
          },
          permission
        }
      })
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      }
    }
  }
}

export default UserModel
