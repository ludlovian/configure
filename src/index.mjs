import process from 'node:process'

import { parse as parseMs } from '@lukeed/ms'
import camelCase from '@ludlovian/camel'
import guess from '@ludlovian/guess'

export default function configure (prefix, defaults = {}) {
  return Object.assign({}, defaults, fromEnv(prefix))
}

function fromEnv (prefix) {
  return Object.fromEntries(
    Object.entries(process.env)
      .map(([key, value]) => {
        if (!key.startsWith(prefix)) return undefined
        key = key.slice(prefix.length)
        return [camelCase(key), convert(value)]
      })
      .filter(Boolean)
  )
}

const rgxMs = /^\d+[ms]$/

function convert (x) {
  if (rgxMs.test(x)) return parseMs(x)
  return guess(x)
}
