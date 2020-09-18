const { override, fixBabelImports, addLessLoader, overrideDevServer } = require('customize-cra');
const addHtmlWebpackPluginEnv = () => config => {
  config.plugins[0].options.WEB_ENV = process.env.WEB_ENV
  config.plugins[0].options.DIR = process.cwd().replace(/\\/g, '/');
  return config;
}
const configFunction = () => config => {
  return {
    ...config,
    proxy: {
      '/api/': {
        target: 'http://192.168.1.170:8282',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    }
  };
}
module.exports = {
  webpack: override(
    addHtmlWebpackPluginEnv(),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyvars: { // 定制主题
        '@primary-color': '#1DA57A',
        // 'primary-color': '#1DA57A',
        // 'link-color': '#1DA57A',
        // '@box-shadow-base': '0 2 px 8 px rgba(0, 0, 0, 0.15)'
      }
    })
  ),
  devServer: overrideDevServer(
    configFunction()
  )
}
// module.exports = override(
//   addHtmlWebpackPluginEnv(),
//   fixBabelImports('import', {
//     libraryName: 'antd',
//     libraryDirectory: 'es',
//     style: true,
//   }),
//   addLessLoader({
//     javascriptEnabled: true,
//     // 定制主题
//     modifyVars: { '@primary-color': '#1DA57A' },
//   }),
//   overrideDevServer(configFunction())
// );