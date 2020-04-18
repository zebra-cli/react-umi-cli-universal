import { IConfig, IPlugin } from 'umi-types'
import slash from 'slash2'
import path from 'path'
import defaultSettings from './defaultSettings'
import themeConfig from './themeConfig'

const { pwa } = defaultSettings // preview.pro.ant.design only do not use in your production ;

const {
  ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION,
  REACT_APP_OUTPUT_PUBLIC_PATH,
  REACT_APP_OUTPUT_PATH,
  REACT_APP_PROXY_URL,
  REACT_APP_PROXY_BASE_URL
} = process.env
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true
      },
      locale: {
        baseNavigator: false
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local'
            }
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      dll: {
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
        exclude: ['@babel/runtime', 'netlify-lambda']
      }
    }
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true
    }
  ]
]

export default {
  plugins,
  // base: REACT_APP_OUTPUT_PATH,
  publicPath: REACT_APP_OUTPUT_PUBLIC_PATH || '/',
  outputPath: REACT_APP_OUTPUT_PATH,
  hash: true,
  history: 'hash',
  targets: {
    ie: 11
  },
  mock: {
    exclude: ['src/pages/mock/**/_*.ts', 'src/pages/mock/**/_*.ts']
  },
  routes: [
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          Routes: ['src/pages/Authorized'],
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/exception/403',
              hideInMenu: true,
              component: './exception/403'
            },
            {
              name: 'base',
              path: '/base',
              icon: 'icon-cw-base',
              component: './base/user',
              routes: [
                {
                  path: '/base/user',
                  name: 'user',
                  component: './base/user',
                  routes: [
                    {
                      name: 'list',
                      path: '/base/user/list',
                      hideInMenu: true,
                      component: './base/user/list'
                    },
                    {
                      component: './exception/404'
                    }
                  ]
                },
                {
                  path: '/base/down',
                  name: 'down',
                  component: './base/down',
                  routes: [
                    {
                      name: 'list',
                      path: '/base/down/list',
                      hideInMenu: true,
                      component: './base/down/list'
                    },
                    {
                      name: 'part',
                      path: '/base/down/part',
                      hideInMenu: true,
                      component: './base/down/part'
                    },
                    {
                      component: './exception/404'
                    }
                  ]
                },
                {
                  path: '/base/process',
                  name: 'process',
                  component: './base/process',
                  routes: [
                    {
                      name: 'upload',
                      path: '/base/process/upload',
                      hideInMenu: true,
                      component: './base/process/upload'
                    },
                    {
                      name: 'check',
                      path: '/base/process/check',
                      hideInMenu: true,
                      component: './base/process/check'
                    },
                    {
                      component: './exception/404'
                    }
                  ]
                },
                {
                  name: 'log',
                  path: '/base/log',
                  component: './base/log'
                },
                {
                  component: './exception/404'
                }
              ]
            },
            {
              path: '/419',
              component: './exception/419'
            },
            {
              // path: '/404',
              component: './exception/404'
            }
          ]
        }
      ]
    }
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: themeConfig,
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '' // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName
      }

      const match = context.resourcePath.match(/src(.*)/)

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '')
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase())
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-')
      }
      return localName
    }
  },
  manifest: {
    basePath: '/'
  },
  chainWebpack(config, { webpack }) {
    config.module
      .rule('pdf')
      .test(/\.pdf$/)
      .use('file')
      .loader('file-loader')
      .end()
      .end()
  },
  alias: {
    assets: path.resolve(__dirname, '../src/assets/'),
    styles: path.resolve(__dirname, '../src/styles/'),
    pages: path.resolve(__dirname, '../src/pages/')
  },
  proxy: {
    [`${REACT_APP_PROXY_URL}`]: {
      target: REACT_APP_PROXY_BASE_URL,
      changeOrigin: true,
      pathRewrite: {
        [`^${REACT_APP_PROXY_URL}`]: ''
      }
    }
  },
  treeShaking: true
} as IConfig
