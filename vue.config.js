
module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/css/_variables.scss";
          @import "@/css/_mixins.scss";
        `
      }
    }
  },
  devServer: {
    host: 'localhost'
  }
};