const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const { INTERNAL_API_URL = 'http://localhost:3333' } = process.env

const apiPath = '/api'
const graphqlPath = '/api/graphql'

module.exports = withVanillaExtract({
  webpack: (config, options) => {
    // if (!options.isServer) {
    //   config.resolve.alias['@sentry/node'] = '@sentry/browser'
    // }
    return config
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: `${INTERNAL_API_URL}${apiPath}`,
    graphqlEndpoint: `${INTERNAL_API_URL}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: apiPath,
    graphqlEndpoint: graphqlPath,
  },
  env: {
    API_MOCKS: process.env.API_MOCKS ?? '',
  },
  devIndicators: {
    autoPrerender: false,
  },
})
