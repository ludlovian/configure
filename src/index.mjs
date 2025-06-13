import process from 'node:process'
import { parse as parseMs } from '@lukeed/ms'
import camelCase from '@ludlovian/camel'
import guess from '@ludlovian/guess'

const key = Symbol.for('@ludlovian/configure')
const GLOBAL = global[key] ?? (global[key] = {})

// the global config which has everything
const config = GLOBAL.config ?? (GLOBAL.config = {})

// the local one(s) which might be shared across multiple
// settings
const localConfigs = GLOBAL.localConfigs ?? (GLOBAL.localConfigs = {})

if (!config.clear) {
  Object.defineProperty(config, 'clear', {
    enumerable: false,
    writable: false,
    configurable: true,
    value: clear
  })
}

function configure (prefix, defaults = {}) {
  if (prefix && !prefix.endsWith('_')) prefix += '_'

  const localConfig = localConfigs[prefix] ?? (localConfigs[prefix] = {})

  for (const localKey of Object.keys(defaults)) {
    const globalKey = camelCase(prefix + localKey)
    const envKey = snake(prefix) + snake(localKey)
    let value =
      typeof defaults[localKey] === 'function'
        ? defaults[localKey](localConfig)
        : convertTime(defaults[localKey])

    if (envKey in process.env) {
      value = guess(convertTime(process.env[envKey]))
    }
    // don't overwrite someone else - first one wins
    // and applies the environment if set
    if (localKey in localConfig) {
      continue
    }
    localConfig[localKey] = config[globalKey] = value
  }
  return localConfig
}

function clear () {
  for (const k in config) {
    if (k !== 'clear') delete config[k]
  }

  for (const k in localConfigs) {
    delete localConfigs[k]
  }
}

const rxPeriod = /^\d+[dhms]$/
function convertTime (value) {
  return typeof value === 'string' && rxPeriod.test(value)
    ? parseMs(value)
    : value
}

const rxSnake = /([a-z0-9])([A-Z])/g
function snake (s) {
  return s.replace(rxSnake, '$1_$2').toUpperCase()
}

configure.config = config
export { configure, config }
export default configure
