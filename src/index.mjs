import process from 'node:process'

import { parse as parseMs } from '@lukeed/ms'
import camelCase from '@ludlovian/camel'
import guess from '@ludlovian/guess'

const { entries, fromEntries } = Object

export default function configure (prefix, defaults = {}) {
  return fromEntries([
    ...entries(defaults).map(([k, v]) => [k, convertTime(v)]),
    ...entries(process.env)
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [camelCase(k.slice(prefix.length)), v])
      .map(([k, v]) => [k, guess(convertTime(v))])
  ])
}

const rgxMs = /^\d+[ms]$/
function convertTime (value) {
  return typeof value === 'string' && rgxMs.test(value) ? parseMs(value) : value
}
