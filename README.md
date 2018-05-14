# [class-config-base][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

The base class of a configuration class which configures a interfacial class.

## Install

```
npm install class-config-base --save
```

### Load this module

For Node.js

```js
const ClassConfigBase = require('class-config-base')
```

For Web browser (only supporting es6)

```html
<script src="class-config-base.min.js"></script>
```

## Usage

1. Define default config object. This object determines **the property default values**, **the property structure** and **the property data types** of the class config class.

   ```js
   const defaultConfig = { a: '', b: { c: 0, d: false } }
   ```

2. Define the class config class. `defineAccessors` method is optional and creates descriptors to override property accessors. `defineInterfaces` method creates descriptors to define properties and methods of the target interfacial class.

    ```js
    class MyClassConfig extends ClassConfigBase {
    
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }
    
      defineAccessors () {
        return {
          'b.c': (parent, key) => ({
            enumerable: true,
            get () { return parent[key] },
            set (v) { parent[key] = Math.max(0, v) },
          })
        }
      }
      
      defineInterfaces () {
        return {
          myA: (config, myA) => ({ /* readonly property */
            enumerable: true,
            set () {},
            get () { return config.a },
          }),
          myC: (config, myC) => ({ /* writable property */
            enumerable: true,
            set (v) { config.b.c = Math.max(v, 0) },
            get () { return config.b.c },
          }),
          myD: (config, myD) => ({ /* replaceable property */
            enumerable: true,
            configurable: true,
            set (value) { Object.defineProperty(this, myD, {
              enumerable: true,
              configuable: true,
              writable: true,
              value,
            }) },
            get () { return config.b.d },
          }),
          myE: (config, myE) => ({ /* method property */
            enumerable: true,
            configurable: true,
            writable: true,
            value: (v) => { return config.b.c * v },
          }),
        }
      }     
    }
    ```
    
    This module prepares some useful functions to define accessors/interfaces simply.
    By using these functions, the above example can be rewritten as follows:
    
    ```js
    const { readonly, writable, replaceable, method } = ClassConfigBase
    
    class MyClassConfig extends ClassConfigBase {
    
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }
    
      defineAccessors () {
        return {
          'b.c': (parent, key) => writable({
            get: () => parent[key],
            set: v => { parent[key] = Math.max(0, v) },
          })
        }
      }
      
      defineInterfaces () {
        return {
          myA: config => readonly({
            get: () => config.a,
          }),
          myC: config => writable({
            set (v) { config.b.c = Math.max(v, 0) },
            get () { return config.b.c },
          }),
          myD: config => replaceable({
            get: () => config.b.d,
          }),
          myE: config => method(v => config.b.c * v),
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
    
4. Instantiate and use the interfacial class.
    
    ```js
    const myCfg = new MyClassConfig({ a: 'Foo', b: { c: 123, d: true } })
    const myObj = new MyClass(myCfg)
    
    console.log(myObj.toString())  // [object MyClass]
    console.log(Object.prototype.toString.call(myObj)) // [object MyClass]
    console.log(myObj.myA) // 'Foo'
    console.log(myObj.myC) // 123
    console.log(myObj.myD) // true
    
    myObj.myA = 'Bar'
    console.log(myObj.myA) // 'Foo'
    
    myObj.myC = 999
    console.log(myObj.myC) // 999
    console.log(myObj.myE(2)) // 1998

    myObj.myC = -888
    console.log(myObj.myC) // 0
    
    myObj.myD = false
    console.log(myObj.myD) // false
    
    myObj.myD = 123
    console.log(myObj.myD) // 123
    ```

5. A property value, even if it is read-only, can be updated with the class config object.

    ```js
    myCfg.a = 'Buz'
    myCfg.b.c = 666
   
    console.log(myObj.myA) // 'Buz'
    console.log(myObj.myC) // 666
    
    console.log(myObj.myE(-4)) // -2664
    ```

6. A mapping between a configuration class instance and a interfacial class instance can be managed by `ClassConfigManager` object.

    ```js
    const { ClassConfigManager } = ClassConfigBase
    
    const manager = new ClassConfigManager()  // Create a manager
    
    manager.set(myCfg, myObj)  // Set a mapping
    
    const aCfg = manager.getConfig(myObj)  // Get the configure object
    const aObj = manager.getObject(myCfg)  // Get the interfacial object
    
    manager.delete(aObj)  // Delete a mapping
    ```

## API

### <u>ClassConfigBase(initConfig, defaultConfig)</u>

Is a constructor to constructs a configuration class instance.
*initConfig* and *defaultConfig* are plain objects and can be nested objects.
*defaultConfig* is to specify the default values and the types of the properties.
So if a property in *initConfig* is different from a corresponding property in *defaultConfig*, the property value in *initConfig* is ignored.

**Parameters:**

| Parameter       |  Type  | Description                            |
|:----------------|:------:|:---------------------------------------|
| *initConfig*    | object | A configuration object which has initial property values. |
| *defaultConfig* | object | A configuration object which has default property values. |

### <u>defineAccessors() : object</u>

Returns an object which maps between property key chains and functions which return property descriptors. 
A key chain concatenates all keys in a key path with dots. A descriptor is a thing used by `Object.defineProperty`.

This method is used to override accessors of the config class.

**Returns:**

An object which maps between property key chains and functions to get property descriptors of the config class.

The format of an entry in the returned object is as follows:

This entry is a function of which the arguments are *parent* and *key*.
In the following example, *parent* equals to `.a.b`, and *key* equals to `'c'`.

```js
defineAccessors () {
  return {
    'a.b.c' : function (parent, key) {
      return {
        enumerable: true,
        get () { return parent[key] },
        set (v) { parent[key] = v },
      }
    },
    ...
  }
}
```

### <u>defineInterfaces() : object</u>

Returns an object which maps between property names and functions which return property descriptors. A descriptor is a thing used by `Object.defineProperty`.

This method defines the interfaces of the target class.

**Returns:**

An object which maps between property name and functions to get property descriptors of the target class.

The format of an entry in the returned object is as follows:

```
  defineInterfaces () {
    return {
      'ccc' : function (config, interfaceName) {
        return {
          enumerable: true,
          get () { return config.a.b.c },
          set (v) { config.a.b.c = v },
        }
      },
      ...
    }
  }
```

This entry is a function of which the arguments are *config* and *interfaceName*.
In the above example, *interfaceName* equals to `'ccc'`.

### <u>configure(instance) : void</u>

Configures the interfaces of the target class instance in its constructor.

**Parameters:**

| Parameter   |  Type  | Description                        |
|:------------|:------:|:-----------------------------------|
| *instance*  | object | A class instance to be configured. |


### <u>*static* readonly({ get, enumerable = true }) : object</u>

Returns a readonly property descriptor.

**Parameters:**

| Parameter  |  Type  | Description                              |
|:-----------|:------:|:-----------------------------------------|
| *get*      |function| A getter for this property.              |
|*enumerable*|boolean | A flag to show this property during enumeration of the properties. |

**Return:**

A property descriptor of the target readonly property.


### <u>*static* writable({ get, set, enumerable = true, configurable = false }) => object</u>

Returns a writable property descriptor.

| Parameter    |  Type  | Descriptor                                |
|:-------------|:------:|:------------------------------------------|
| *get*        |function| A getter for this property.               |
| *set*        |function| A setter for this property.               |
| *enumerable* |boolean | A flag to show this property during enumeration of the properties. |
|*configurable*|boolean | A flag to change or delete this property. |

**Return:**

A property descriptor of the target writable property.


### <u>*static* replaceable({ get, enumerable = true }) : object</u>

Returns a replaceable property descriptor.

**Parameters:**

| Parameter    |  Type  | Description                              |
|:-------------|:------:|:-----------------------------------------|
| *get*        |function| A getter for this property.              |
| *enumerable* |boolean | A flag to show this property during enumeration of the properties. |

**Return:**

A property descriptor of the target replaceable property.


### <u>*static* method(fn) : object</u>

Returns a property descriptor for a method.

**Parameters:**

| Parameter    |  Type  | Description                              |
|:-------------|:------:|:-----------------------------------------|
| *fn*         |function| A method function for this property.     |

**Return:**

A property descriptor of the target method property.

## License

Copyright (C) 2017 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/class-config-base/
[npm-img]: https://img.shields.io/badge/npm-v0.3.1-blue.svg
[npm-url]: https://www.npmjs.org/package/class-config-base/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/class-config-base.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/class-config-base
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/class-config-base?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/class-config-base
[coverage-img]: https://coveralls.io/repos/github/sttk/class-config-base/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/class-config-base?branch=master
