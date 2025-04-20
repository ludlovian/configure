import process from 'node:process'
import { parse as parseMs } from '@lukeed/ms'
import camelCase from '@ludlovian/camel'
import guess from '@ludlovian/guess'

// the global config which has everything
const config = {}

// the local one(s) which might be shared across multiple
// settings
const localConfigs = {}

function configure (prefix, defaults = {}, opts = {}) {
  const { shared = true } = opts
  if (prefix && !prefix.endsWith('_')) prefix += '_'

  if (!shared || !(prefix in localConfigs)) localConfigs[prefix] = {}
  const localConfig = localConfigs[prefix]

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

    localConfig[localKey] = config[globalKey] = value
  }

  if (process.env[snake(prefix) + 'SHOW_CONFIG']) {
    console.log(`\nShowing config for ${prefix.replace(/_$/, '')}:\n`)
    console.log(localConfig)
    console.log('\n')
    process.exit(1)
  }
  return localConfig
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
