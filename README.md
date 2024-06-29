# configure
Easy configuration for projects

## configure

Exposed as the default an a named export

```
import configure from '@ludlovian/configure

config = configure('FOO_BAR_', {
    defaultOne: 1
})
```

configure (prefix, defaults) => object

This function assembles the configuration from:
- the default object
- environment variables

The environment variables should be in `SNAKE_UPPER_CASE` prefixed
with the given `PREFIX_`. They will be converted to `camelCase`.

In addition:
- things that like numbers or `true`/`false` will be converted automagically
- durations like `10m` will be converted too if given as a string. This is also true for the defaults object

## config

Exposed as a named export and also `configure.config`

This is the global config object, allowing one pacakge to see (a copy of) the configuration
used by another.

Items are keyed in `prefixCamelCase`.
