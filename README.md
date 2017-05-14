# [class-config-base][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

The base class of a configuration class for a interfacial class. 


## Install

```
npm i class-config-base --save
```


## Usage

1. Load this module.

   ```js
   const ClassConfigBase = require('class-config-base')
   ```

2. Define default config object. This object determines **the property default values**, **the property structure** and **the property data types** of the target class config object.

   ```js
   const defaultConfig = { a: '', b: { c: 0, d: false } }
   ```

3. Define the class config class. `getAccessorDescriptors` method is optional and creates descriptors to override property accessors. `getInterfaceDescriptors` method creates descriptors to define properties and methods of the target interfacial class.

    ```js
    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }
    
      getAccessorDescriptors () {
        return {
          'b.c': parent => ({
            get () { return parent.a },
            set (v) { parent.a = Math.max(0, v) },
          }),
        }
      }

      getInterfaceDescriptors () {
        const self = this
        return {
          myA: {  /* to make a read-only property */
            enumerable: true,
            set () {},
            get () { return self.a },
          },
          
          myC: {  /* to make a restricted property */
            enumerable: true,
            set (v) { if (self.b.d) { self.b.c = v } },
            get () { return self.b.c },
          },
          
          myD: {
            enumerable: true,
            set (v) { self.b.d = v },
            get () { return self.b.d },
          },
        }
      }
    }
    ```

4. Define the interfacial class with the class config.
 
    ```js
    class MyClass {
      constructor (myClassConfig) {
        myClassConfig.configure(this)
      }
    }
    ```
    
5. Instantiate and use the interfacial class.
    
    ```js
    const myClassConfig = new MyClassConfig({ a: 'Foo', b: { c: 123, d: true } })
    const myObj = new MyClass(myClassConfig)
    
    console.log(myObj.toString())  // [object MyClass]
    console.log(Object.prototype.toString.call(myObj)) // [object MyClass]
    console.log(myObj.myA) // 'Foo'
    console.log(myObj.myC) // 123
    console.log(myObj.myD) // true
    
    myObj.myA = 'Bar'
    console.log(myObj.myA) // 'Foo'
    
    myObj.myC = 999
    console.log(myObj.myC) // 999

    myObj.myC = -888
    console.log(myObj.myC) // 0
    
    myObj.myD = false
    console.log(myObj.myD) // false
    
    myObj.myC = 777
    console.log(myObj.myC) // 0
    ```

6. A property value, even if it is read-only, can be updated with the class config object.

    ```js
    myClassConfig.a = 'Buz'
    myClassConfig.b.c = 666

    console.log(myObj.myA) // 'Buz'
    console.log(myObj.myC) // 666
    console.log(myObj.myD) // false
    ```


## API

### <u>*constructor*(initConfig, defaultConfig)</u>

Constructs a configuration class instance.
*initConfig* and *defaultConfig* is plain objects and can be nested objects.
*defaultConfig* is to specify the default values and the types of the properties.
So if a property in *initConfig* is different from a corresponding property in *defaultConfig*, the property value in *initConfig* is ignored.

**Parameters:**

* **initConfig** (object) : a configuration object which has initial property values.
* **defaultConfig** (object) : a configuration object which has default property values.

### <u>getAccessorDescriptors() => object</u>

Returns an object which maps between property key chains and functions which get property descriptors. 
A key chain concatenates all keys in a key path with dots. A descriptor is the one used by `Object.defineProperty`.

This method is to override configure accessors of the config class.

**Returns:** 

* (object) An object which maps between property key chains and property descriptors of the config class instance.

The format of an entry in the returned object is as follows:

```
  getAccessorDescriptors () {
    return {
      /* An example of an entry in the returned object */
      'a.b.c' : function (parent, key, info) {
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

The entry is a function of which the arguments are *parent*, *key*, *info*.
In the above example, *parent* equals to `config.a.b`, and *key* equals to `'c'`. *info* is same with *nodeInfo* of [each-props](https://github.com/sttk/each-props).


### <u>getInterfaceDescriptors() => object</u>

Returns an object which maps between property name and property descriptors. A descriptor is the one used by `Object.defineProperty`.

This method defines the interfaces of the target class.

**Returns:**

* (object) An object which maps between property name and property descriptors of the target class.

The format of an entry in the returned object is as follows:

```
  getInterfaceDescriptors () {
    const self = this
    
    return {
      /* An example of an entry in the returned object */
      'c' : {
        return {
          enumerable: true,
          configurable: false,
          get () { return self.a.b.c },
          set (v) { self.a.b.c = v },
        }
      },
      ...
    }
  }
```

### <u>configure(instance)</u>

Configures the interfaces of the target class instance in its constructor.

**Parameters:**

* **instance** (object) : A class instance to be configured.


## License

Copyright (C) 2017 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/class-config-base/
[npm-img]: https://img.shields.io/badge/npm-v0.2.0-blue.svg
[npm-url]: https://www.npmjs.org/package/class-config-base/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/license.MIT
[travis-img]: https://travis-ci.org/sttk/class-config-base.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/class-config-base
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/class-config-base?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/class-config-base
[coverage-img]: https://coveralls.io/repos/github/sttk/class-config-base/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/class-config-base?branch=master
