module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/assets/service-worker.js',
    }
  },
}