import { suite, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import process from 'node:process'

import configure from '../src/index.mjs'

suite('configure', () => {
  let _savedEnv

  beforeEach(() => {
    _savedEnv = process.env
    process.env = { ..._savedEnv }
  })
  afterEach(() => {
    process.env = _savedEnv
    configure.config.clear()
  })

  test('empty', () => {
    const exp = {}
    const act = configure('FOO_')

    assert.deepStrictEqual(act, exp)
  })

  test('full set', () => {
    const exp = {
      bar: 2,
      baz: false,
      fizzBar: 3 * 1000,
      boof: 20
    }

    const def1 = {
      bar: 2,
      baz: false
    }

    const def2 = {
      fizzBar: '3s',
      boof: c => c.bar * 10
    }

    const act = configure('FOO_', def1)
    configure('FOO_', def2)

    assert.deepStrictEqual(act, exp)
  })

  test('full set of overrides', () => {
    process.env = {
      FOO_BAR: '1',
      FOO_BAZ: 'true',
      FOO_FIZZ_BAR: '3s',
      BAZ_FOO: 'foobar'
    }

    const exp = {
      bar: 1,
      baz: true,
      fizzBar: 3 * 1000,
      boof: 10
    }

    const def = {
      bar: 2,
      baz: false,
      fizzBar: undefined,
      boof: c => c.bar * 10
    }

    const act = configure('FOO_', def, { shared: false })

    assert.deepStrictEqual(act, exp)
  })

  test('prefix without underscore', () => {
    const def = { bar: 'foo', baz: 'fizz' }
    const exp = {
      bar: 'baz',
      baz: 'fizz'
    }
    process.env = { FOO_BAR: 'baz' }
    const act = configure('FOO', def, { shared: false })
    assert.deepStrictEqual(act, exp)
  })

  test('captures globals', () => {
    let act
    let exp
    let def

    def = { baz: 1 }
    exp = { baz: 1 }

    act = configure('FOO', def, { shared: false })
    assert.deepStrictEqual(act, exp)

    def = { boo: 2 }
    exp = { boo: 2 }

    act = configure('BAR_', def)
    assert.deepStrictEqual(act, exp)

    exp = { fooBaz: 1, barBoo: 2 }
    act = { ...configure.config }
    assert.deepStrictEqual(act, exp)
  })

  test('doesnt overwrite', () => {
    const cfg1 = configure('FOO_', {
      foo: 'bar'
    })
    const cfg2 = configure('FOO_', {
      foo: 'baz'
    })
    assert(cfg1 === cfg2)
    assert(cfg1.foo === 'bar')
  })
})
