import React, { Component, ReactElement } from 'react'
import Redirect from 'umi/redirect'

interface RouterViewPrpos {
  children: ReactElement
}
class RouterView extends Component<RouterViewPrpos> {
  render() {
    const { children } = this.props
    const name = children.props.location.pathname
    if (name === '/base' || name === '/base/user') {
      return <Redirect to="/base/user/list" />
    }
    return children
  }
}
export default RouterView
