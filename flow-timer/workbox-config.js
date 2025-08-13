module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{json,ico,html,js,css,png,jpg}'],
  swDest: 'build/service-worker.js',
  swSrc: 'build/src/service-worker.js',
  injectionPoint: 'self.__WB_MANIFEST',
};
