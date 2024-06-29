import process from 'node:process'

import { parse as parseMs } from '@lukeed/ms'
import camelCase from '@ludlovian/camel'
import guess from '@ludlovian/guess'

const { entries } = Object

const config = {}

function configure (prefix, defaults = {}) {
  if (prefix && !prefix.endsWith('_')) prefix += '_'

  const localConfig = {}

  // first we add in the defauls
  for (const [k, v] of entries(defaults)) {
    localConfig[k] = convertTime(v)
  }

  // now we override with matching ENV
  for (let [k, v] of entries(process.env)) {
    if (k.startsWith(prefix)) {
      k = camelCase(k.slice(prefix.length))
      v = guess(convertTime(v))
      localConfig[k] = v
    }
  }

  // now add to global config
  for (const [k, v] of entries(localConfig)) {
    config[camelCase(prefix + k)] = v
  }
  return localConfig
}

const rgxMs = /^\d+[ms]$/
function convertTime (value) {
  return typeof value === 'string' && rgxMs.test(value) ? parseMs(value) : value
}

configure.config = config
export { configure, config }
export default configure
