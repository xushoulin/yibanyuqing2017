module.exports = {
  proxyTable: {
    '/yibanSA':{
      target:'http://10.21.3.91:18080',
      changeOrigin: true
    }
  },
  entry: {
    vue: ['vue', 'vue-router', 'vuex', 'axios'],
    main: './app/scripts/main.js' // entry js file
  },
  vendors: ['vue'],
  assets: {
    publicUrl: '/',
    root: 'assets', // replace 'assets' to your remote project root
    publicPath: 'public',
    subDir: 'yq'
  },
  publish: {
    'index.html': {
      target: 'views', // replace 'views' to your remote project views path
      option: {
        basename: 'index',
        extname: '.php'
      }
    }
  }
};
