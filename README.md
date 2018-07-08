# [class-config-base][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

The base class of a configuration class which configures a interfacial class.

## Install

```
npm install class-config-base
```

### Load this module

For Node.js

```js
const ClassConfig = require('class-config-base')
```

For Web browser (only supporting es6)

```html
<script src="class-config-base.min.js"></script>
```

## Usage

1. Define default config object. This object determines **the property default values**, **the property structure** and **the property data types** of the class config class.

   ```js
   const defaultConfig = { a: '', b: { c: 0, d: 1 } }
   ```

2. Define the class config class.
    * `defineMorePrivates` method is optional and provides a timing to define more private data than private data defined by `defaultConfig`.
    * `defineAccessors` method is optional and creates descriptors to override property accessors.
    * `defineInterfaces` method creates descriptors to define properties and methods of the target interfacial class.

    ```js
    class MyClassConfig extends ClassConfig {

      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineMorePrivates ($private) {
        $private.e = { f: [1, 2, 3] }
      }

      defineAccessors ($private, config) {
        return {
          'b.c': {
            enumerable: true,
            get () { return $private.b.c },
            set (v) { $private.b.c = Math.max(0, v) },
          }
        }
      }

      defineInterfaces (config, instance) {
        return {
          myA: { /* readonly property */
            enumerable: true,
            set () {},
            get () { return config.a },
          },
          myC: { /* writable property */
            enumerable: true,
            set (v) { config.b.c = v },
            get () { return config.b.c },
          },
          myF: { /* replaceable property */
            enumerable: true,
            configurable: true,
            set (value) { Object.defineProperty(instance, 'myF', {
              enumerable: true,
              configuable: true,
              writable: true,
              value,
            }) },
            get () { return config.e.f },
          },
          myG: { /* method property */
            enumerable: true,
            configurable: true,
            writable: true,
            value: (v) => { return config.b.d * v },
          },
        }
      }
    }
    ```

    This module provides some useful functions to define accessors/interfaces simply.
    By using these functions, the above example can be rewritten as follows:

    ```js
    const { readonly, writable, replaceable, method } = ClassConfig

    class MyClassConfig extends ClassConfig {

      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineMorePrivates ($private) {
        $private.e = { f: [1, 2, 3] }
      }

      defineAccessors ($private, config) {
        return {
          'b.c': writable({
            get () { return $private.b.c },
            set (v) { $private.b.c = Math.max(0, v) },
          }),
        }
      }

      defineInterfaces (config, instance) {
        return {
          myA: readonly({ get: () => config.a }),
          myC: writable({
            set: v => { config.b.c = v },
            get: () => config.b.c,
          }),
          myF: replaceable({ get: () => config.e.f }),
          myG: method((v) => { return config.b.d * v }),
        }
      }
    }
    ```

3. Define the interfacial class with the class config.

    ```js
    class MyClass {
      constructor (config) {
        config.configure(this)
      }
    }
    ```

    The interfaces of interfacial class can be also defined by following way:

    ```js
    class MyClassConfig extends ClassConfig {
      constructor (initConfig) { ... }
      defineMorePrivates ($private) { ... }
      defineAccessors ($private, config) { ... }
    }

    class MyClass {
      constructor (config) {
        config.configure(this, {

          myA: readonly({ get: () => config.a }),

          myC: writable({
            set: v => { config.b.c = v },
            get: () => config.b.c,
          }),

          myF: replaceable({ get: () => config.e.f }),

          myG: method((v) => { return config.b.d * v }),
        })
      }
    }
    ```

4. Instantiate and use the interfacial class.

    ```js
    const myCfg = new MyClassConfig({ a: 'Foo', b: { c: 123, d: true } })
    const myObj = new MyClass(myCfg)

    console.log(myObj.toString())  // [object MyClass]
    console.log(Object.prototype.toString.call(myObj)) // [object MyClass]
    console.log(myObj.myA) // 'Foo'
    console.log(myObj.myC) // 123
    console.log(myObj.myF) // [1, 2, 3]
    console.log(myObj.myG(2)) // 2

    myObj.myA = 'Bar'
    console.log(myObj.myA) // 'Foo'

    myObj.myC = 999
    console.log(myObj.myC) // 999

    myObj.myF = 123
    console.log(myObj.myF) // 123
    ```

5. A property value, even if it is read-only or hidden, can be updated with the class config object.

    ```js
    myCfg.a = 'Buz'
    myCfg.b.c = 666
    myCfg.b.d = 888

    console.log(myObj.myA) // 'Buz'
    console.log(myObj.myC) // 666
    console.log(myObj.myG(2)) // 1776
    ```

6. A mapping between a config class instance and a interfacial class instance can be managed by `ClassConfig.Manager` object.

    ```js
    const { Manager } = ClassConfig

    const manager = new Manager()  // Create a manager

    manager.set(myCfg, myObj)  // Set a mapping

    const aCfg = manager.getConfig(myObj)  // Get the configure object
    const aObj = manager.getObject(myCfg)  // Get the interfacial object

    manager.delete(aObj)  // Delete a mapping
    ```

## API

### <u>class ClassConfig</u>

Is a class to configure the target class instance from hiding place.

#### <u>.constructor (initConfig, defaultConfig) => ClassConfig</u>

Is a constructor to creates an instance of this class.
*initConfig* and *defaultConfig* are plain objects and can be nested objects.
*defaultConfig* is to specify the default values and the types of the properties.
So if a type of a property in *initConfig* is different from a type of a corresponding property in *defaultConfig*, the property value in *initConfig* is ignored.

**Parameters:**

| Parameter       |  Type  | Description                            |
|:----------------|:------:|:---------------------------------------|
| *initConfig*    | object | A configuration object which has initial property values. |
| *defaultConfig* | object | A configuration object which has default property values. |

**Returns:**

A `ClassConfig` object.

#### <u>.configure (instance, descriptors) => Void</u>

Configures the interfaces of the target class instance in its constructor.

**Parameters:**

| Parameter     |  Type  | Description                        |
|:--------------|:------:|:-----------------------------------|
| *instance*    | object | A class instance to be configured. |
| *descriptors* | object | A plain object which has descriptors of interfaces of the target class instance. |

#### <u>.defineMorePrivates ($private) => Void</u>

Defines more private data than private data defined in `defaultConfig`.

**Parameters:**

| Parameter     |  Type  | Description                        |
|:--------------|:------:|:-----------------------------------|
| *$private*    | object | The root object to store private data of the config object. |

#### <u>.defineAccessors ($private, config) => object</u>

Returns an object which maps between property key chains and property descriptors.
A key chain is a string that concatenates all keys in a key path with dots. A descriptor is a thing used by `Object.defineProperty`.

This method is used to override accessors of the config class.

**Parameters:**

| Parameter     |  Type  | Description                               |
|:--------------|:------:|:------------------------------------------|
| *$private*    | object | The root object to store private data of the config object. |
| *config*      | `ClassConfig` | This config object.                |

**Returns:**

A nested plain object which contains property descriptors of accessors of this config object.

#### <u>.defineInterfaces (config, instance) => Void</u>

Returns an object which maps between property names and property descriptors. A descriptor is a thing used by `Object.defineProperty`.

This method defines the interfaces of the target class.

**Parameters:**

| Parameter     |  Type  | Description                        |
|:--------------|:------:|:-----------------------------------|
| *config*      | `ClassConfig` | This config object.                |
| *instance*    | object | The instance of the interfacial class configured by this config object. |

#### <u>[static] .readonly ({ getter [, enumerable ] }) => object</u>

Returns a readonly property descriptor.

**Parameters:**

| Parameter    |   Type   | Description                              |
|:-------------|:--------:|:-----------------------------------------|
| *getter*     | function | A getter for this property.              |
| *enumerable* | boolean  | A flag to show this property during enumeration of the properties. |

**Return:**

A property descriptor of the target readonly property.

#### <u>[static] .writable ({ getter, setter, [, enumerable ] [, configurable ] }) => object</u>

Returns a writable property descriptor.

| Parameter    |   Type   | Descriptor                                |
|:-------------|:--------:|:------------------------------------------|
| *getter*     | function | A getter for this property.               |
| *setter*     | function | A setter for this property.               |
| *enumerable* | boolean  | A flag to show this property during enumeration of the properties. |
|*configurable*| boolean  | A flag to change or delete this property. |

**Return:**

A property descriptor of the target writable property.

#### <u>[static] .replaceable ({ getter [, enumerable ] }) => object</u>

Returns a replaceable property descriptor.

**Parameters:**

| Parameter    |   Type   | Description                              |
|:-------------|:--------:|:-----------------------------------------|
| *get*        | function | A getter for this property.              |
| *enumerable* | boolean  | A flag to show this property during enumeration of the properties. |

**Return:**

A property descriptor of the target replaceable property.

#### <u>[static] .method (fn) : object</u>

Returns a property descriptor for a method.

**Parameters:**

| Parameter    |   Type   | Description                              |
|:-------------|:--------:|:-----------------------------------------|
| *fn*         | function | A method function for this property.     |

**Return:**

A property descriptor of the target method property.

### <u>class ClassConfig.Manager</u>

Is a manager class which has mappings of a config object and an object configured by it.

#### <u>.constructor () => ClassConfig.Manager</u>

Creates an instance of this class.

**Returns:**

A `ClassConfig.Manager` object.

#### <u>.set (object, config) => Void</u>

Sets a mapping of a config object and an object configured by it.

**Parameters:**

| Parameter     |  Type      | Description                                 |
|:--------------|:----------:|:--------------------------------------------|
| *object*      | object     | The object configured by the config object. |
| *config*      | `ClassConfig` | The config object.                       |

#### <u>.delete (objectOrConfig) => Void</u>

Deletes a mapping of a config object and an object configured by it.

**Parameters:**

| Parameter        |            Type           | Description                |
|:-----------------|:-------------------------:|:---------------------------|
| *objectOrConfig* | object &#124;`ClassConfig`| The object or config object to be deleted its mapping from this manager object. |

#### <u>.getConfig (object) => ClassConfig</u>

Gets a config object corresponding to the specified object.

**Parameters:**

| Parameter     |  Type  | Description                                     |
|:--------------|:------:|:------------------------------------------------|
| *object*      | object | The object registered with this manager object. |

**Returns:**

The config object corresponding to the specified object.

#### <u>.getObject (config) => object</u>

Get an object corresponding to the specified config object.

**Parameters:**

| Parameter     |      Type     | Description                               |
|:--------------|:-------------:|:------------------------------------------|
| *config*      | `ClassConfig` | The config object registered with this manager object. |

**Returns:**

The object corresponding to the specified config object.

## License

Copyright (C) 2017-2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/class-config-base/
[npm-img]: https://img.shields.io/badge/npm-v1.0.0-blue.svg
[npm-url]: https://www.npmjs.org/package/class-config-base/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/class-config-base.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/class-config-base
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/class-config-base?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/class-config-base
[coverage-img]: https://coveralls.io/repos/github/sttk/class-config-base/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/class-config-base?branch=master
