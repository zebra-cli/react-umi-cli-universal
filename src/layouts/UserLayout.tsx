import { MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout'
import { Helmet } from 'react-helmet'
import React from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi-plugin-react/locale'
import { ConnectProps, ConnectState } from '@/models/connect'
import styles from './UserLayout.less'

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem }
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: []
    }
  } = props
  const { routes = [] } = route
  const {
    children,
    location = {
      pathname: ''
    }
  } = props
  const { breadcrumb } = getMenuData(routes)
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props
  })
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <div className={styles.titleZH}>大众进口汽车运营管理平台</div>
              <div className={styles.titleEN}>
                VGIC Dealer Operation Management Platform
              </div>
            </div>
          </div>
          {children}
        </div>
        <div className={styles.globalFooter}>
          建议使用Chrome，火狐或IE10以上版本，若使用360浏览器请在极速模式下打开系统
          <br />{' '}
          如系统出现错误或异常，影响正常使用，请记录错误并通过以下方式通知管理员，以便及时为您解决问题！
          <br />
          工作时间：工作日9:00-18:00 / 联系电话：(86-10) 8450 5127
        </div>
      </div>
    </>
  )
}

export default connect(({ settings }: ConnectState) => ({
  ...settings
}))(UserLayout)
