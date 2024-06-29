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

Environment variables overwrite defaults

### Variable names

The environment variables should be in `SNAKE_UPPER_CASE` prefixed
with the given `PREFIX_`.

They will be converted to `camelCase`, which is how they appear in the object
returned.

### Value conversion

Environment variables will be converted as follows:
- Number-y strings will become numbers
- The strings `true` and `false` will be turned into Booleans
- Strings that look like short durations - e.g. `15s` or `2m` - will be converted to milliseconds

Default variables will only have the duration convenience conversion

### Referring to other variables

If a value given is a function, it will be called with the configuration object.

The return value will be used as the value for this variable


## config

Exposed as a named export and also `configure.config`

This is the global config object, allowing one pacakge to see (a copy of) the configuration
used by another.

Items are keyed in `prefixCamelCase`.
