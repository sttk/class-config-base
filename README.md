# [class-config-base][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

The base class of a configuration class for a interfacial class. 


## Install

```
npm i class-config-base --save
```


## Usage

Load this module :

```js
const ClassConfigBase = require('class-config-base')
```

Define a configration class :

```js
const defaultConfig = {
  a: 0,
  b: { c: '', d: false },
}

class MyClassConfig extends ClassConfigBase {
  constructor (initConfig) {
    super(initConfig, defaultConfig)
  }
}

let myConfig = new MyClassConfig()
console.log(myConfig) // => MyClassConfig { a: 0, b: { c: '', d: false } }

myConfig.a = 123
myConfig.b.c = 'ABC'
myConfig.b.d = true
console.log(myConfig) // => MyClassConfig { a: 123, b: { c: 'ABC', d: true } }

myConfig = new MyClassConfig({ a: 9, b: { c: 'Z', d: true } })
console.log(myConfig) // => MyClassConfig { a: 9, b: { c: 'Z', d: true } }
```

Define accessors of the configuration class

```js
class MyClassConfig extends ClassConfigBase {
  constructor (initConfig) {
    super(initConfig, defaultConfig)
  }

  getAccessorDescriptors () {
    return {
      'a': parent => ({
        enumerable: true,
        get () { return parent.a },
        set (v) {},
      })

      'b.c': parent => ({
        get () { return parent.c },
        set (v) {
          if (parent.d) {
            parent.c = v
          }
        },
      }),
    }
  }
}

let myConfig = new MyConfig()
console.log(myConfig) // => MyClassConfig { a: 0, b: { c: '', d: false } }

myConfig.a = 123
myConfig.b.d = true
myConfig.b.c = 'ABC'
console.log(myConfig) // => MyClassConfig { a: 0, b: { c: 'ABC', d: true } }

myConfig.$private.a = 123  // `$private` property holds the entity
console.log(myConfig) // => MyClassConfig { a: 123, b: { c: 'ABC', d: true } }
```

Define a interfacial class which doesn't have property entities :

```js
class MyClassConfig extends ClassConfigBase {
  constructor (initConfig) {
    super(initConfig, defaultConfig)
  }

  getAccessorDescriptors () {
    return {
      'a' : parent => ({
        get () { return parent.a },
        set (v) { parent.a = Math.max(0, v) }
      }),

      'b.c': parent => ({
        get () { return parent.c },
        set (v) {
          if (parent.d) {
            parent.c = v
          }
        },
      }),
    }
  }

  getInterfaceDescriptors () {
    const self = this

    return {
      myA: {
        enumerable: true,
        set (v) { self.a = v },
        get () { return self.a },
      },

      myC: {
        enumerable: true,
        set (v) { self.b.c = v },
        get () { return self.b.c },
      },

      myD: {
        enumerable: true,
        set (v) { self.b.d = v },
        get () { return self.b.d },
      },

      toString: {
        set (v) { this.toString = v },
        get () { return () => stringer(this) },
      },
    }
  }
}

class MyClass {
  constructor(myConfig) {
    myConfig.configure(this)
  }
}

let myConfig = new MyConfig({ a: 999, b: { c: 'AAA', d: true } })
let myObj = new MyClass(myConfig)

myObj.myA // => 999
myObj.myC // => 'AAA'
myObj.myD // => true
myObj.toString() // => MyClass { myA: 999, myB: 'AAA', myC: true }
```

## API

### <u>*constructor*(initConfig, defaultConfig)</u>

Constructs a configuration class instance.
*initConfig* and *defaultConfig* is plain objects and may be nested objects.
*defaultConfig* is to specify the default values and the type of the properties.
So if a property of *initConfig* is different from a corresponding property of *defaultConfig*, the property value of *initConfig* is ignored.

**Parameter:**

* **initConfig** [object] : a configuration object which has initial property values.
* **defaultConfig** [object] : a configuration object which has default property values.

### <u>getAccessorDescriptors() => object</u>

Returns an object which maps between property key chains and functions which get property descriptors. 
A key chain concatenates all keys in a key path with dots. A descriptor is the one used by `Object.defineProperty`.

This method may override to configure accessors of the config class.

**Return:** [object]

An object which maps between property key chains and property descriptors of the config class instance.

The format of an entry in the returned object is as follows:

```
  getAccessorDescriptors () {
    return {
      /* An example of an entry in the returned object */
      'a.b.c' : function (parent, key, Info) {
        return {
          enumerable: true,
          configurable: false,
          get () { return parent[key] },
          set (v) { parent[key] = v },
        }
      },
      ...
    }
  }
```

The entry is a function of which the arguments are *parent*, *key*, *info*. *parent* is same with `config.a.b`, and *key* is same with `'c'`. *info* is same with *nodeInfo* of [each-props](https://github.com/sttk/each-props).


### <u>getInterfaceDescriptors() => object</u>

Returns an object which maps between property name and property descriptors. A descriptor is the one used by `Object.defineProperty`.

This method may override to configure interfaces of the target class.

**Returns:** [object]

An object which maps between property name and property descriptors of the target class.

The format of an entry in the returned object is as follows:

```
  getInterfaceDescriptors () {
    const self = this
    
    return {
      /* An example of an entry in the returned object */
      'a' : {
        return {
          enumerable: true,
          configurable: false,
          get () { return self.a },
          set (v) { self.a = v },
        }
      },
      ...
    }
  }
```

### <u>configure(instance)</u>

Configures the target class instance in its constructor.

**Parameters:**

* **instance** [object] : A class instance to be configured.


## License

Copyright (C) 2017 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/class-config-base/
[npm-img]: https://img.shields.io/badge/npm-v0.1.0-blue.svg
[npm-url]: https://www.npmjs.org/package/class-config-base/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/class-config-base.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/class-config-base
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/class-config-base?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/class-config-base
[coverage-img]: https://coveralls.io/repos/github/sttk/class-config-base/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/class-config-base?branch=master
