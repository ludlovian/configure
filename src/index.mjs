import process from 'node:process'
import { parse as parseMs } from '@lukeed/ms'
import camelCase from '@ludlovian/camel'
import guess from '@ludlovian/guess'

const { entries } = Object
const config = {}

function configure (prefix, defaults = {}) {
  if (prefix && !prefix.endsWith('_')) prefix += '_'

  // The config object we are building
  const localConfig = {}

  // step 1 - static values from the defaults
  for (const [k, v] of entries(defaults)) {
    if (typeof v !== 'function') localConfig[k] = convertTime(v)
  }

  // step 2 - function-based values from the defaults
  //
  for (const [k, fn] of entries(defaults)) {
    if (typeof fn === 'function') localConfig[k] = fn(localConfig)
  }

  // step 3 - add in environment varaiables
  //
  for (const [kk, v] of entries(process.env)) {
    if (kk.startsWith(prefix)) {
      const k = camelCase(kk.slice(prefix.length))
      localConfig[k] = guess(convertTime(v))
    }
  }

  // step 4 - add to global object
  //
  for (const [k, v] of entries(localConfig)) {
    config[camelCase(prefix + k)] = v
  }

  return localConfig
}

const rgxMs = /^\d+[dhms]$/
function convertTime (value) {
  return typeof value === 'string' && rgxMs.test(value) ? parseMs(value) : value
}

configure.config = config
export { configure, config }
export default configure
