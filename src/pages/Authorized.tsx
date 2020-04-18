import React from 'react'
import Redirect from 'umi/redirect'
import { connect } from 'dva'
import pathToRegexp from 'path-to-regexp'
import Authorized from '@/utils/Authorized'
import {
  ConnectProps,
  ConnectState,
  Route,
  UserModelState
} from '@/models/connect'
import { EXTRA_AUTH_STR } from '@/constant'

interface AuthorizedRouteProps {
  role_id: string | undefined
  routes: any[]
  permission: any[]
}
interface AuthComponentProps extends ConnectProps {
  user: UserModelState
}

interface SetRouteAuthProps {
  routes: Route[]
  permission: any[]
}

interface hasAuthRouteProps {
  authority: string
  path: string
}

class AuthorizedRoute {
  role_id: string | undefined

  routes: any[]

  allwaysAuthPermission: any[] = [
    {
      path: '/exception/403'
    }
  ]

  constructor({ role_id, routes, permission }: AuthorizedRouteProps) {
    this.role_id = role_id
    this.routes = routes
    this.setRoutesNoAuth(this.routes) // 重置所有页面暂无权限
    this.setRoutesHasAuth({
      routes: this.routes,
      permission: this.getHasAuthPermission([
        ...permission,
        ...this.allwaysAuthPermission
      ])
    })
  }

  getHasAuthPermission(permission: any[]) {
    const hasAuthRoute: hasAuthRouteProps[] = [] // 有权限页面
    const handlerCurrentRoute = (data: any[]) => {
      data.map(({ path, routes = [] }) => {
        if (path) {
          // 过滤有权限的页面
          hasAuthRoute.push({
            authority: EXTRA_AUTH_STR + this.role_id,
            path
          })
        }
        if (routes.length > 0) {
          handlerCurrentRoute(routes)
        }
        return null
      })
    }
    handlerCurrentRoute(permission)
    return hasAuthRoute
  }

  setRoutesNoAuth(routes: Route[]) {
    routes.map(item => {
      item.authority = 'noAuth'
      if (item.routes) {
        this.setRoutesNoAuth(item.routes)
      }
      return null
    })
  }

  setRoutesHasAuth({ routes, permission }: SetRouteAuthProps) {
    routes.map((item: Route) => {
      const obj = permission.find(i => i.path === item.path)
      if (obj) {
        item.authority = obj.authority
        if (item.routes) {
          this.setRoutesChildHasAuth(item.routes)
        }
      }
      return null
    })
  }

  setRoutesChildHasAuth(routes: Route[]) {
    if (!routes) return
    routes.map(item => {
      item.authority = EXTRA_AUTH_STR + this.role_id
      if (item.routes) {
        this.setRoutesChildHasAuth(item.routes)
      }
      return null
    })
  }

  getHomeRoute() {
    const current = this.routes.filter(
      item =>
        item.authority === EXTRA_AUTH_STR + this.role_id &&
        item.path !== '/exception/403'
    )
    if (current.length <= 0) return '/'
    return current[0].path
  }
}

type Auth = string[] | string | undefined

const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: Auth
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities
      }
    }
  })
  return authorities
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: []
  },
  location = {
    pathname: ''
  },
  user
}) => {
  const { currentUser = {} } = user
  const { routes = [] } = route

  const { info = {}, permission = [] } = currentUser
  const { id } = info
  const targetRoutes = routes || [] // 权限组页面
  if (id) {
    // /* eslint no-new:0 */
    const instanceAuth = new AuthorizedRoute({
      role_id: id,
      routes: targetRoutes,
      permission
    })
    const currentPath = children.props.location.pathname
    if (currentPath === '/') {
      return <Redirect to={instanceAuth.getHomeRoute()} />
    }
  }

  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={<Redirect to="/exception/403" />}
    >
      {children}
    </Authorized>
  )
}

export default connect(({ user }: ConnectState) => ({
  user
}))(AuthComponent)
