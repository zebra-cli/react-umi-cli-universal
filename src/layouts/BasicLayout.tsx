import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings
} from '@ant-design/pro-layout'
import * as H from 'history'
import React from 'react'
import Link from 'umi/link'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { formatMessage } from 'umi-plugin-react/locale'
import Authorized from '@/utils/Authorized'
import { ConnectState, Route } from '@/models/connect'
import { getAuthorityFromRouter } from '@/utils/utils'
import NoMatch from '@/pages/exception/403'
import logo from '../assets/logo.png'
import HeaderRender from './HeaderRender'
import HeaderTopNav from './components/HeaderTopNav'
import styles from './BasicLayout.less'

export interface BasicLayoutProps extends ProLayoutProps {
  route: Route & {
    authority: string[]
    string: string[]
  }
  settings: Settings
  location: H.Location
  history: H.History
  dispatch: Dispatch
}

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : ['haveChildren']
    }
    return Authorized.check(item.authority, localItem, null) as MenuDataItem
  })

const renderMenu = (name: React.ReactNode) => (
  <div>
    <div className={styles.globalMenu}>{name}</div>
  </div>
)

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    children,
    settings,
    location,
    history,
    route = { routes: [] }
  } = props

  const handlerHeaderRender = () => {
    const path = location.pathname.split('/')[1] || ''
    if (path === 'base') {
      return (
        <>
          <HeaderRender
            history={history}
            location={location}
            route={location}
            {...props}
          />
          <HeaderTopNav {...props} />
        </>
      )
    }
    return <HeaderTopNav {...props} />
  }

  const authorized = getAuthorityFromRouter(
    route.routes as { path: string; authority: string }[],
    location.pathname || '/'
  ) || {
    authority: undefined
  }

  return (
    <ProLayout
      className={styles.proLayout}
      logo={logo}
      siderWidth={180}
      collapsed={false}
      onCollapse={() => {}}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      disableMobile
      headerRender={handlerHeaderRender}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return `${defaultDom}`
        }
        return (
          <Link to={menuItemProps.path as string}>
            {renderMenu(defaultDom)}
          </Link>
        )
      }}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      footerRender={() => (
        <div className={styles.globalFooter}>
          使用手册 | ｜技术支持：(86-10) 8450 5127（工作日9:00-18:00）
          <br /> Copyright © {new Date().getFullYear()}{' '}
          光速斑马数据科技有限公司, All Rights Reserved | 京ICP备XXXXXX号
        </div>
      )}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={NoMatch}>
        {children}
      </Authorized>
    </ProLayout>
  )
}

export default connect(({ settings }: ConnectState) => ({
  settings
}))(BasicLayout)
