import React from 'react'
import * as H from 'history'
import { connect } from 'dva'
import { Menu, Icon } from 'antd'
import { ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import HeaderDropdown from '@/components/HeaderDropdown'
import { Dispatch, Action } from 'redux'
import styles from './HeaderTopNav.less'

interface HeaderTopNavProps {
  dispatch: Dispatch<Action<'login/logout'>>
  currentUser: CurrentUser
  history: H.History
  location: H.Location
}

class HeaderTopNav extends React.Component<HeaderTopNavProps> {
  handlerLogout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'login/logout'
    })
  }

  render() {
    const { currentUser = {} } = this.props
    const { info = {} } = currentUser
    const name = info && info.real_name
    const menuHeaderDropdown = (
      <Menu>
        <Menu.Item onClick={this.handlerLogout}>退出</Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.globalHeaderRight}>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span title={name} className={styles.username}>
            {name} <Icon type="down" />
          </span>
        </HeaderDropdown>
      </div>
    )
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser
}))(HeaderTopNav)
