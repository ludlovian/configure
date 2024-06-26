import { suite, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import process from 'node:process'

import configure from '../src/index.mjs'

suite('configure', () => {
  let _savedEnv
  const prefix = 'FOO_'
  function setEnv (obj) {
    Object.entries(obj).forEach(([k, v]) => (process.env[prefix + k] = v))
  }

  beforeEach(() => {
    _savedEnv = { ...process.env }
  })
  afterEach(() => {
    for (const k in process.env) {
      if (k in _savedEnv) {
        process.env[k] = _savedEnv[k]
      } else {
        delete process.env[k]
      }
    }

    for (const k in configure.config) {
      delete configure.config[k]
    }
  })

  test('empty', () => {
    const exp = {}
    const act = configure(prefix)

    assert.deepStrictEqual(act, exp)
  })

  test('full set', () => {
    setEnv({
      BAR: '1',
      BAZ: 'true',
      FIZZ_BAR: '3s',
      BAZ_FOO: 'foobar'
    })

    const exp = {
      bar: 1,
      baz: true,
      fizzBar: 3 * 1000,
      bazFoo: 'foobar'
    }

    const act = configure(prefix)

    assert.deepStrictEqual(act, exp)
  })

  test('default override', () => {
    setEnv({ BAR: 'baz' })
    const def = { bar: 'foo', baz: 'fizz' }

    const exp = {
      bar: 'baz',
      baz: 'fizz'
    }

    const act = configure(prefix, def)

    assert.deepStrictEqual(act, exp)
  })

  test('converts defaults', () => {
    const exp = {
      foo: 3 * 1000
    }

    const def = { foo: '3s' }

    const act = configure(prefix, def)

    assert.deepStrictEqual(act, exp)
  })

  test('captures globals', () => {
    let act
    let exp
    let def

    def = { baz: 1 }
    exp = { baz: 1 }

    act = configure('FOO', def)
    assert.deepStrictEqual(act, exp)

    def = { boo: 2 }
    exp = { boo: 2 }

    act = configure('BAR_', def)
    assert.deepStrictEqual(act, exp)

    exp = { fooBaz: 1, barBoo: 2 }
    act = { ...configure.config }
    assert.deepStrictEqual(act, exp)
  })

  test('Vars referring to others', () => {
    const def = {
      bar: x => x.foo + 'bar',
      foo: 'baz'
    }
    const exp = {
      bar: 'bazbar',
      foo: 'baz'
    }
    const act = configure(prefix, def)
    assert.deepStrictEqual(act, exp)
  })
})
