const Terser = require('terser')
const template = require('lodash/template')

import { log } from './tools.js'
import { getSnippet } from './snippet.js'

/**
 * Render analytics as string.
 * Validate options and output logs.
 */
export const renderAnalytics = (options) => {
  const { cdnUrl, services } = options
  // validate parameters
  if (services===undefined) throw new Error('please pass "services"-option')
  // DEVELOPMENT
  // in development, stub out all analytics.js methods
  // this prevents "dirtying" your real analytics with local testing/traffic
  const { NODE_ENV = 'development' } = process.env
  if (NODE_ENV === 'development') {
    log('development mode detected! NOT sending data to analytics-tools')
    return `
      (function () {
        // analytics.js stub
        const analytics = window.analytics = {}
        const methods = [
          'trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview',
          'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug',
          'page', 'once', 'off', 'on'
        ]
        methods.forEach(method =>
          analytics[method] = (...args) => console.log(\`[analytics-js-without-segment development-mode active] analytics.\${method}\`, ...args)
        )
      })()
    `
  }
  // PRODUCTION
  log('production mode! SENDING data to analytics-tools')
  const snippet = getSnippet()
  const theTemplate = template(snippet)
  const sourceWithValues = theTemplate({
    cdnUrl: cdnUrl || 'https://cdnjs.cloudflare.com/ajax/libs/analytics.js/2.9.1/analytics.min.js',  // default
    services: JSON.stringify(services),
  })
  const result = Terser.minify(sourceWithValues)  // see https://www.npmjs.com/package/terser
  if (result.error) throw new Error(result.error)
  log(result.code)
  return result.code
}

/**
 * Run analytics and attach them to window.analytics
 */
export const runAnalytics = (options) => {
  eval(renderAnalytics(options))
}
