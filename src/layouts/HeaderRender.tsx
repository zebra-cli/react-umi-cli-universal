import React from 'react'
import * as H from 'history'
import { Menu } from 'antd'
import { ClickParam } from 'antd/lib/menu'
import { FormattedMessage } from 'umi-plugin-react/locale'
import { Route } from '@/models/connect'

interface HeaderRenderProps {
  history: H.History
  location: H.Location
  route: Route
}
interface HeaderRenderState {
  current: string
}
class HeaderRender extends React.Component<
  HeaderRenderProps,
  HeaderRenderState
> {
  state = {
    current: ''
  }

  hasTopHeaderPathName = 'base'

  handleClick = (e: ClickParam) => {
    const { history } = this.props
    history.push({
      pathname: `${e.key}`,
      state: { path: e.key }
    })
    this.setState({
      current: e.key
    })
  }

  findRoute = (routes: Route, name: string) =>
    routes.find((item: { name: string }) => item.name === name)

  render() {
    const { location = { pathname: '' }, route = { routes: [] } } = this.props
    const { routes: projectRoute = [] } = route
    if (projectRoute.length <= 0) return <></>
    const parent = `${location.pathname.split('/')[2]}`
    if (!parent || parent === 'undefined') return <></>
    const { routes: routeItem = [] } = this.findRoute(
      projectRoute,
      this.hasTopHeaderPathName
    )
    const { routes: menuList = [] } = this.findRoute(routeItem, parent)
    const items = menuList.map((ele: Route) => {
      if (!ele.name) return null
      return (
        <Menu.Item key={ele.path}>
          <FormattedMessage
            id={`menu.${this.hasTopHeaderPathName}.${parent}.${ele.name}`}
          />
        </Menu.Item>
      )
    })
    let current = null
    if (this.state.current && location.pathname) {
      current = location.pathname
    } else {
      current = this.state.current || location.pathname
    }
    return (
      <Menu
        onClick={e => this.handleClick(e)}
        selectedKeys={[current]}
        mode="horizontal"
      >
        {items}
      </Menu>
    )
  }
}

export default HeaderRender
