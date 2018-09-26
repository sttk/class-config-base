(function(){
'use strict'


const expect = chai.expect

const { readonly, writable, replaceable, method } = ClassConfig

describe('ClassConfig', () => {

  describe('no accessor and no interface', () => {
    const defaultConfig = { a: true, b: { c: '', d: 0 } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config with no argument', () => {
      const myConfig = new MyClassConfig()
      expect(myConfig.a).to.equal(true)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(0)
      expect(myConfig.toString()).to.equal(
        'MyClassConfig { a: true, b: { c: \'\', d: 0 } }')
    })

    it('Should create a config with an argument', () => {
      const myConfig = new MyClassConfig({ a: false, b: { c: 'DEF', d: 1 } })
      expect(myConfig.a).to.equal(false)
      expect(myConfig.b.c).to.equal('DEF')
      expect(myConfig.b.d).to.equal(1)
      expect(myConfig.toString()).to.equal(
        'MyClassConfig { a: false, b: { c: \'DEF\', d: 1 } }')
    })

    it('Should access config\'s accessors', () => {
      const myConfig = new MyClassConfig()
      myConfig.a = false
      myConfig.b.c = 'ABC'
      myConfig.b.d = 123
      expect(myConfig.a).to.equal(false)
      expect(myConfig.b.c).to.equal('ABC')
      expect(myConfig.b.d).to.equal(123)

      myConfig.a = true
      myConfig.b.c = 'abc'
      myConfig.b.d = -123
      expect(myConfig.a).to.equal(true)
      expect(myConfig.b.c).to.equal('abc')
      expect(myConfig.b.d).to.equal(-123)
    })

    it('Should delete normal properties', () => {
      const myConfig = new MyClassConfig()

      expect(() => { delete myConfig.a }).to.throw(TypeError)
      expect(() => { delete myConfig.b.c }).to.throw(TypeError)
      expect(() => { delete myConfig.b.d }).to.throw(TypeError)

      expect(myConfig.a).not.to.equal(undefined)
      expect(myConfig.b.c).not.to.equal(undefined)
      expect(myConfig.b.d).not.to.equal(undefined)
    })

    it('Should not allow to set bad type value', () => {
      const myConfig = new MyClassConfig()
      myConfig.a = 'A'
      myConfig.b.c = 1
      myConfig.b.d = 'B'
      expect(myConfig.a).to.equal(true)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(0)
    })

    it('Should be able to create an object but no interface', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      expect(Object.keys(myObject).length).to.equal(0)
      expect(myObject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myObject))
        .to.equal('[object MyClass]')
    })
  })

  describe('define further private members', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineMorePrivates ($private) {
        $private.e = { f: [1, 2, 3], g: 123 }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config with no argument', () => {
      const myConfig = new MyClassConfig()
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(false)
      expect(myConfig.e.f).to.deep.equal([1, 2, 3])
      expect(myConfig.e.g).to.equal(123)
    })

    it('Should be able to create an object but no interface', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      expect(Object.keys(myObject).length).to.equal(0)
      expect(myObject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myObject))
        .to.equal('[object MyClass]')
    })
  })

  describe('define accessors', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineMorePrivates ($private) {
        $private.e = { f: [1, 2, 3], g: 123 }
      }

      defineAccessors ($private) {
        return {
          a: {
            get () { return Math.max($private.a, 0) },
            set () {},
          },
          'b.c': {
            get: () => $private.b.c.toUpperCase(),
            set: () => {},
          },
          'b.d': {
            get: () => $private.b.d,
            set: v => { $private.b.d = v },
          },
          'e.f': {
            get: () => $private.e.f,
            set: () => {},
          },
          'e.g': {
            get: () => $private.e.g * 2,
            set: v => { $private.e.g = v / 2 },
          },
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this, {})
      }
    }

    it('Should create a config with no argument', () => {
      const myConfig = new MyClassConfig()
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(false)
      expect(myConfig.e.f).to.deep.equal([1, 2, 3])
      expect(myConfig.e.g).to.equal(246)
    })

    it('Should access config\'s accessors', () => {
      const myConfig = new MyClassConfig()
      myConfig.a = 123
      myConfig.b.c = 'ABC'
      myConfig.b.d = true
      myConfig.e.f = [4, 5]
      myConfig.e.g = 222
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(true)
      expect(myConfig.e.f).to.deep.equal([1, 2, 3])
      expect(myConfig.e.g).to.equal(222)
      expect(myConfig.$private.a).to.equal(0)
      expect(myConfig.$private.b.c).to.equal('')
      expect(myConfig.$private.b.d).to.equal(true)
      expect(myConfig.$private.e.f).to.deep.equal([1, 2, 3])
      expect(myConfig.$private.e.g).to.equal(111)
    })

    it('Should not delete properties', () => {
      const myConfig = new MyClassConfig()

      expect(() => { delete myConfig.a }).to.throw(TypeError)
      expect(() => { delete myConfig.b.c }).to.throw(TypeError)
      expect(() => { delete myConfig.b.d }).to.throw(TypeError)
      expect(() => { delete myConfig.e.f }).to.throw(TypeError)
      expect(() => { delete myConfig.e.g }).to.throw(TypeError)

      expect(myConfig.a).not.to.equal(undefined)
      expect(myConfig.b.c).not.to.equal(undefined)
      expect(myConfig.b.d).not.to.equal(undefined)
      expect(myConfig.e.f).not.to.equal(undefined)
      expect(myConfig.e.g).not.to.equal(undefined)
    })

    it('Should be able to create an object but no interface', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      expect(Object.keys(myObject).length).to.equal(0)
      expect(myObject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myObject))
        .to.equal('[object MyClass]')
    })

  })

  describe('define interfaces by config', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors ($private) {
        return {
          a: {
            get () { return Math.max($private.a, 0) },
            set () {},
          },
          'b.c': {
            get: () => $private.b.c.toUpperCase(),
            set: () => {},
          },
          'b.d': {
            get: () => $private.b.d,
            set: v => { $private.b.d = v },
          },
        }
      }

      defineInterfaces (config) {
        return {
          a: {
            get: () => config.a,
            set: () => {},
          },
          bC: {
            get: () => config.b.c,
            set: () => {},
          },
          bD: {
            get: () => config.b.d,
            set: v => { config.b.d = v },
          },
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create an instance', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(false)
      expect(myObject.a).to.equal(0)
      expect(myObject.bC).to.equal('')
      expect(myObject.bD).to.equal(false)
    })

    it('Should access config\'s accessors', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      myConfig.a = 123
      myConfig.b.c = 'ABC'
      myConfig.b.d = true
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(true)
      expect(myObject.a).to.equal(0)
      expect(myObject.bC).to.equal('')
      expect(myObject.bD).to.equal(true)

      myObject.a = 456
      myObject.bC = 'XXX'
      myObject.bD = false
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(false)
      expect(myObject.a).to.equal(0)
      expect(myObject.bC).to.equal('')
      expect(myObject.bD).to.equal(false)
    })

    it('Should not delete properties', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)

      expect(() => { delete myObject.a }).to.throw(TypeError)
      expect(() => { delete myObject.bC }).to.throw(TypeError)
      expect(() => { delete myObject.bD }).to.throw(TypeError)

      expect(myObject.a).not.to.equal(undefined)
      expect(myObject.bC).not.to.equal(undefined)
      expect(myObject.bD).not.to.equal(undefined)
    })

    it('Should be able to create an object but no interface', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      expect(Object.keys(myObject).length).to.equal(0)
      expect(myObject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myObject))
        .to.equal('[object MyClass]')
    })
  })

  describe('define interfaces by instance', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors ($private) {
        return {
          a: {
            get () { return Math.max($private.a, 0) },
            set () {},
          },
          'b.c': {
            get: () => $private.b.c.toUpperCase(),
            set: () => {},
          },
          'b.d': {
            get: () => $private.b.d,
            set: v => { $private.b.d = v },
          },
        }
      }
    }

    class MyClass {
      constructor (config) {
        config.configure(this, {
          a: {
            get: () => config.a,
            set: () => {},
          },
          bC: {
            get: () => config.b.c,
            set: () => {},
          },
          bD: {
            get: () => config.b.d,
            set: v => { config.b.d = v },
          },
        })
      }
    }

    it('Should create an instance', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(false)
      expect(myObject.a).to.equal(0)
      expect(myObject.bC).to.equal('')
      expect(myObject.bD).to.equal(false)
    })

    it('Should access config\'s accessors', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      myConfig.a = 123
      myConfig.b.c = 'ABC'
      myConfig.b.d = true
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(true)
      expect(myObject.a).to.equal(0)
      expect(myObject.bC).to.equal('')
      expect(myObject.bD).to.equal(true)

      myObject.a = 456
      myObject.bC = 'XXX'
      myObject.bD = false
      expect(myConfig.a).to.equal(0)
      expect(myConfig.b.c).to.equal('')
      expect(myConfig.b.d).to.equal(false)
      expect(myObject.a).to.equal(0)
      expect(myObject.bC).to.equal('')
      expect(myObject.bD).to.equal(false)
    })

    it('Should not delete properties', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)

      expect(() => { delete myObject.a }).to.throw(TypeError)
      expect(() => { delete myObject.bC }).to.throw(TypeError)
      expect(() => { delete myObject.bD }).to.throw(TypeError)

      expect(myObject.a).not.to.equal(undefined)
      expect(myObject.bC).not.to.equal(undefined)
      expect(myObject.bD).not.to.equal(undefined)
    })

    it('Should be able to create an object but no interface', () => {
      const myConfig = new MyClassConfig()
      const myObject = new MyClass(myConfig)
      expect(Object.keys(myObject).length).to.equal(0)
      expect(myObject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myObject))
        .to.equal('[object MyClass]')
    })
  })

  describe('define readonly accessors', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors ($private) {
        return {
          a: readonly({ get: () => Math.max($private.a, 0) }),
          'b.c': readonly({ get: () => $private.b.c.toUpperCase() }),
          'b.d': readonly({ get () { return $private.b.d } }),
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config with no argument', () => {
      const myconfig = new MyClassConfig()
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should access config\'s accessors', () => {
      const myconfig = new MyClassConfig()
      myconfig.a = 123
      myconfig.b.c = 'ABC'
      myconfig.b.d = true
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)

      myconfig.$private.a = 123
      myconfig.$private.b.c = 'ABC'
      myconfig.$private.b.d = true
      expect(myconfig.a).to.equal(123)
      expect(myconfig.b.c).to.equal('ABC')
      expect(myconfig.b.d).to.equal(true)

      myconfig.$private.a = -123
      myconfig.$private.b.c = 'def'
      myconfig.$private.b.d = false
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('DEF')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should not delete readonly properties', () => {
      const myconfig = new MyClassConfig()

      expect(() => { delete myconfig.a }).to.throw(TypeError)
      expect(() => { delete myconfig.b.c }).to.throw(TypeError)
      expect(() => { delete myconfig.b.d }).to.throw(TypeError)

      expect(myconfig.a).not.to.equal(undefined)
      expect(myconfig.b.c).not.to.equal(undefined)
      expect(myconfig.b.d).not.to.equal(undefined)
    })

    it('Should be able to create an object but no interface', () => {
      const myconfig = new MyClassConfig()
      const myobject = new MyClass(myconfig)
      expect(Object.keys(myobject).length).to.equal(0)
      expect(myobject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myobject))
        .to.equal('[object MyClass]')
    })
  })

  describe('define writable accessors', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors ($private) {
        return {
          a: writable({
            get: () => $private.a,
            set: v => { $private.a = Math.max(v, 0) },
          }),
          'b.c': writable({
            get: () => $private.b.c,
            set: v => { $private.b.c = v ? v.toUpperCase() : '' },
          }),
          'b.d': writable({
            get () { return $private.b.d },
            set (v) { $private.b.d = v },
          }),
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config with no argument', () => {
      const myconfig = new MyClassConfig()
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should access config\'s accessors', () => {
      const myconfig = new MyClassConfig()
      myconfig.a = 123
      myconfig.b.c = 'ABC'
      myconfig.b.d = true
      expect(myconfig.a).to.equal(123)
      expect(myconfig.b.c).to.equal('ABC')
      expect(myconfig.b.d).to.equal(true)

      myconfig.a = -123
      myconfig.b.c = 'def'
      myconfig.b.d = false
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('DEF')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should not delete writable properties', () => {
      const myconfig = new MyClassConfig()

      expect(() => { delete myconfig.a }).to.throw(TypeError)
      expect(() => { delete myconfig.b.c }).to.throw(TypeError)
      expect(() => { delete myconfig.b.d }).to.throw(TypeError)

      expect(myconfig.a).not.to.equal(undefined)
      expect(myconfig.b.c).not.to.equal(undefined)
      expect(myconfig.b.d).not.to.equal(undefined)
    })

    it('Should be able to create an object but no interface', () => {
      const myconfig = new MyClassConfig()
      const myobject = new MyClass(myconfig)
      expect(Object.keys(myobject).length).to.equal(0)
      expect(myobject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myobject))
        .to.equal('[object MyClass]')
    })
  })

  describe('define replaceable accessors', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors ($private) {
        return {
          a: replaceable({
            get: () => Math.max($private.a, 0),
          }),
          'b.c': replaceable({
            get: () => $private.b.c.toUpperCase(),
          }),
          'b.d': replaceable({
            get () { return $private.b.d },
          }),
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config with no argument', () => {
      const myconfig = new MyClassConfig()
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should access config\'s accessors', () => {
      const myconfig = new MyClassConfig()
      myconfig.a = 123
      myconfig.b.c = 'ABC'
      myconfig.b.d = true
      expect(myconfig.a).to.equal(123)
      expect(myconfig.b.c).to.equal('ABC')
      expect(myconfig.b.d).to.equal(true)

      myconfig.a = -123
      myconfig.b.c = 'abc'
      myconfig.b.d = false
      expect(myconfig.a).to.equal(-123)
      expect(myconfig.b.c).to.equal('abc')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should delete replaceable properties', () => {
      const myconfig = new MyClassConfig()

      delete myconfig.a
      delete myconfig.b.c
      delete myconfig.b.d

      expect(myconfig.a).to.equal(undefined)
      expect(myconfig.b.c).to.equal(undefined)
      expect(myconfig.b.d).to.equal(undefined)
    })

    it('Should be able to create an object but no interface', () => {
      const myconfig = new MyClassConfig()
      const myobject = new MyClass(myconfig)
      expect(Object.keys(myobject).length).to.equal(0)
      expect(myobject.toString()).to.equal('[object MyClass]')
      expect(Object.prototype.toString.call(myobject))
        .to.equal('[object MyClass]')
    })
  })

  describe('define readonly interfaces', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineInterfaces (cfg) {
        return {
          aaa: readonly({
            get: () => Math.max(cfg.a, 0),
          }),
          ccc: readonly({
            get: () => cfg.b.c.toUpperCase(),
          }),
          ddd: readonly({
            get () { return cfg.b.d },
          }),
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config and a class instance with interfaces', () => {
      const myconfig = new MyClassConfig()
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)

      const myobject = new MyClass(myconfig)
      expect(myobject.aaa).to.equal(0)
      expect(myobject.ccc).to.equal('')
      expect(myobject.ddd).to.equal(false)
      expect(Object.keys(myobject)).to.deep.equal(['aaa', 'ccc', 'ddd'])

      myobject.aaa = 123
      myobject.ccc = 'ABC'
      myobject.ddd = true

      expect(myobject.aaa).to.equal(0)
      expect(myobject.ccc).to.equal('')
      expect(myobject.ddd).to.equal(false)

      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should change readonly property values by a config object', () => {
      const myconfig = new MyClassConfig()
      const myobject = new MyClass(myconfig)

      myconfig.a = 123
      myconfig.b.c = 'ABC'
      myconfig.b.d = true

      expect(myobject.aaa).to.equal(123)
      expect(myobject.ccc).to.equal('ABC')
      expect(myobject.ddd).to.equal(true)
    })

    it('Should not delete readonly interfaces', () => {
      const myconfig = new MyClassConfig()

      expect(() => { delete myconfig.a }).to.throw(TypeError)
      expect(() => { delete myconfig.b.c }).to.throw(TypeError)
      expect(() => { delete myconfig.b.d }).to.throw(TypeError)

      expect(myconfig.a).not.to.equal(undefined)
      expect(myconfig.b.c).not.to.equal(undefined)
      expect(myconfig.b.d).not.to.equal(undefined)
    })
  })

  describe('define writable interfaces', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineInterfaces (cfg) {
        return {
          aaa: writable({
            set: v => { cfg.a = Math.max(v, 0) },
            get: () => cfg.a,
          }),
          ccc: writable({
            set: v => { cfg.b.c = v ? v.toUpperCase() : '' },
            get: () => cfg.b.c,
          }),
          ddd: writable({
            set: v => { cfg.b.d = v },
            get: () => cfg.b.d,
          }),
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config and a class instance with interfaces', () => {
      const myconfig = new MyClassConfig()
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)

      const myobject = new MyClass(myconfig)
      expect(myobject.aaa).to.equal(0)
      expect(myobject.ccc).to.equal('')
      expect(myobject.ddd).to.equal(false)
      expect(Object.keys(myobject)).to.deep.equal(['aaa', 'ccc', 'ddd'])

      myobject.aaa = 123
      myobject.ccc = 'ABC'
      myobject.ddd = true

      expect(myobject.aaa).to.equal(123)
      expect(myobject.ccc).to.equal('ABC')
      expect(myobject.ddd).to.equal(true)

      expect(myconfig.a).to.equal(123)
      expect(myconfig.b.c).to.equal('ABC')
      expect(myconfig.b.d).to.equal(true)

      myobject.aaa = -99
      myobject.ccc = 'def'
      myobject.ddd = false

      expect(myobject.aaa).to.equal(0)
      expect(myobject.ccc).to.equal('DEF')
      expect(myobject.ddd).to.equal(false)

      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('DEF')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should not delete writable interfaces', () => {
      const myconfig = new MyClassConfig()

      expect(() => { delete myconfig.a }).to.throw(TypeError)
      expect(() => { delete myconfig.b.c }).to.throw(TypeError)
      expect(() => { delete myconfig.b.d }).to.throw(TypeError)

      expect(myconfig.a).not.to.equal(undefined)
      expect(myconfig.b.c).not.to.equal(undefined)
      expect(myconfig.b.d).not.to.equal(undefined)
    })
  })

  describe('define replaceable interfaces', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineInterfaces (cfg) {
        return {
          aaa: replaceable({
            set: v => cfg.a = Math.max(v, 0),
            get: () => cfg.a,
          }),
          ccc: replaceable({
            set: v => cfg.b.c = v ? v.toUpperCase() : '',
            get: () => cfg.b.c,
          }),
          ddd: replaceable({
            set: v => cfg.b.d = v,
            get: () => cfg.b.d,
          }),
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    it('Should create a config and a class instance with interfaces', () => {
      const myconfig = new MyClassConfig()
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)

      const myobject = new MyClass(myconfig)
      expect(myobject.aaa).to.equal(0)
      expect(myobject.ccc).to.equal('')
      expect(myobject.ddd).to.equal(false)
      expect(Object.keys(myobject)).to.deep.equal(['aaa', 'ccc', 'ddd'])

      myobject.aaa = 123
      myobject.ccc = 'ABC'
      myobject.ddd = true

      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should be able to change interface values by config accessors', () => {
      const myconfig = new MyClassConfig()
      const myobject = new MyClass(myconfig)

      myconfig.a = 123
      myconfig.b.c = 'ABC'
      myconfig.b.d = true

      expect(myobject.aaa).to.equal(123)
      expect(myobject.ccc).to.equal('ABC')
      expect(myobject.ddd).to.equal(true)

      myconfig.a = -98
      myconfig.b.c = 'def'
      myconfig.b.d = false

      expect(myobject.aaa).to.equal(-98)
      expect(myobject.ccc).to.equal('def')
      expect(myobject.ddd).to.equal(false)
    })

    it('Should replace properties', () => {
      const myconfig = new MyClassConfig()
      const myobject = new MyClass(myconfig)

      myconfig.a = 999
      myconfig.b.c = 'xxx'
      myconfig.b.d = true

      expect(myobject.aaa).to.equal(999)
      expect(myobject.ccc).to.equal('xxx')
      expect(myobject.ddd).to.equal(true)

      expect(myconfig.a).to.equal(999)
      expect(myconfig.b.c).to.equal('xxx')
      expect(myconfig.b.d).to.equal(true)

      myobject.aaa = 'abc'
      myobject.ccc = 222
      myobject.ddd = 333

      expect(myobject.aaa).to.equal('abc')
      expect(myobject.ccc).to.equal(222)
      expect(myobject.ddd).to.equal(333)

      expect(myconfig.a).to.equal(999)
      expect(myconfig.b.c).to.equal('xxx')
      expect(myconfig.b.d).to.equal(true)
    })

    it('Should delete replaceable interfaces', () => {
      const myconfig = new MyClassConfig()
      const myobject = new MyClass(myconfig)

      myconfig.a = 999
      myconfig.b.c = 'xxx'
      myconfig.b.d = true

      expect(myobject.aaa).to.equal(999)
      expect(myobject.ccc).to.equal('xxx')
      expect(myobject.ddd).to.equal(true)

      expect(myconfig.a).to.equal(999)
      expect(myconfig.b.c).to.equal('xxx')
      expect(myconfig.b.d).to.equal(true)

      delete myobject.aaa
      delete myobject.ccc
      delete myobject.ddd

      expect(myobject.aaa).to.equal(undefined)
      expect(myobject.ccc).to.equal(undefined)
      expect(myobject.ddd).to.equal(undefined)

      expect(myconfig.a).to.equal(999)
      expect(myconfig.b.c).to.equal('xxx')
      expect(myconfig.b.d).to.equal(true)
    })
  })

  describe('define methods', () => {
    const defaultConfig = { a: 0, b: { c: '', d: '' } }

    class MyClassConfig extends ClassConfig {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineInterfaces (cfg) {
        return {
          aa: method(() => cfg.a * 2),
          bc: method(() => cfg.b.c.toUpperCase()),
          bd: method(() => cfg.b.d.toLowerCase()),
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    const myconfig = new MyClassConfig()
    const myobject = new MyClass(myconfig)

    it('Should create a config and a class instance with methods', () => {
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal('')

      expect(myobject.aa()).to.equal(0)
      expect(myobject.bc()).to.equal('')
      expect(myobject.bd()).to.equal('')

      myconfig.a = 123
      myconfig.b.c = 'aBc'
      myconfig.b.d = 'DeF'

      expect(myconfig.a).to.equal(123)
      expect(myconfig.b.c).to.equal('aBc')
      expect(myconfig.b.d).to.equal('DeF')

      expect(myobject.aa()).to.equal(246)
      expect(myobject.bc()).to.equal('ABC')
      expect(myobject.bd()).to.equal('def')

      expect(Object.keys(myobject)).to.deep.equal(['aa', 'bc', 'bd'])
    })

    it('Should be able to change methods', () => {
      myobject.aa = () => myconfig.a * -1
      myobject.bc = 'AAA'
      myobject.bd = null

      expect(myobject.aa()).to.equal(-123)
      expect(myobject.bc).to.equal('AAA')
      expect(myobject.bd).to.equal(null)

      expect(Object.keys(myobject)).to.deep.equal(['aa', 'bc', 'bd'])
    })

    it('Should be able to delete methods', () => {
      delete myobject.aa
      delete myobject.bd

      expect(myobject.aa).to.equal(undefined)
      expect(myobject.bc).to.equal('AAA')
      expect(myobject.bd).to.equal(undefined)

      expect(Object.keys(myobject)).to.deep.equal(['bc'])
    })
  })

  describe('share private data', () => {
    class FooConfig extends ClassConfig {
      constructor (initConfig, opts) {
        super(initConfig, { bar: 1, baz: 'A' }, opts)
      }
    }

    it('Should share .$private', () => {
      const config1 = new FooConfig()
      const config2 = new FooConfig(config1, { sharePrivate: true })
      expect(config1.$private).to.equal(config2.$private)
    })

    it('Should change properties of sharing configs synchronously', () => {
      const config1 = new FooConfig()
      const config2 = new FooConfig(config1, { sharePrivate: true })

      config1.bar = 2
      expect(config1.bar).to.equal(2)
      expect(config2.bar).to.equal(2)

      config2.baz = 'Bbb'
      expect(config1.baz).to.equal('Bbb')
      expect(config2.baz).to.equal('Bbb')
    })
  })

})

})();
(function(){
'use strict'


const expect = chai.expect

const { Manager } = ClassConfig

describe('ClassConfig.Manager', () => {

  describe('constructor', () => {
    it('Should create a Manager object', () => {
      const manager = new Manager()
      expect(manager).to.be.instanceof(Manager)
    })
  })

  describe('set and delete', () => {
    const manager = new Manager()

    class Config1 extends ClassConfig {
      constructor () { super() }
    }
    const obj1 = new Object()
    const cfg1 = new Config1()

    class Config2 extends ClassConfig {
      constructor () { super() }
    }
    const obj2 = new Object()
    const cfg2 = new Config2()

    const obj3 = new Object()
    const obj4 = new Object()

    const cfg3 = new Config1()
    const cfg4 = new Config2()

    it('Should always return undefined when empty', () => {
      expect(manager.getConfig(obj1)).to.equal(undefined)
      expect(manager.getConfig(cfg1)).to.equal(undefined)
      expect(manager.getConfig(obj2)).to.equal(undefined)
      expect(manager.getConfig(cfg2)).to.equal(undefined)

      expect(manager.getObject(obj1)).to.equal(undefined)
      expect(manager.getObject(cfg1)).to.equal(undefined)
      expect(manager.getObject(obj2)).to.equal(undefined)
      expect(manager.getObject(cfg2)).to.equal(undefined)
    })

    it('Should set a pair of an object and a config', () => {
      manager.set(obj1, cfg1)

      expect(manager.getConfig(obj1)).to.equal(cfg1)
      expect(manager.getConfig(cfg1)).to.equal(undefined)
      expect(manager.getConfig(obj2)).to.equal(undefined)
      expect(manager.getConfig(cfg2)).to.equal(undefined)

      expect(manager.getObject(obj1)).to.equal(undefined)
      expect(manager.getObject(cfg1)).to.equal(obj1)
      expect(manager.getObject(obj2)).to.equal(undefined)
      expect(manager.getObject(cfg2)).to.equal(undefined)
    })

    it('Should set a pair of a config and an object', () => {
      manager.set(obj2, cfg2)

      expect(manager.getConfig(obj1)).to.equal(cfg1)
      expect(manager.getConfig(cfg1)).to.equal(undefined)
      expect(manager.getConfig(obj2)).to.equal(cfg2)
      expect(manager.getConfig(cfg2)).to.equal(undefined)

      expect(manager.getObject(obj1)).to.equal(undefined)
      expect(manager.getObject(cfg1)).to.equal(obj1)
      expect(manager.getObject(obj2)).to.equal(undefined)
      expect(manager.getObject(cfg2)).to.equal(obj2)
    })

    it('Should not set a pair of an object and an object', () => {
      manager.set(obj3, obj4)

      expect(manager.getConfig(obj1)).to.equal(cfg1)
      expect(manager.getConfig(cfg1)).to.equal(undefined)
      expect(manager.getConfig(obj2)).to.equal(cfg2)
      expect(manager.getConfig(cfg2)).to.equal(undefined)

      expect(manager.getConfig(obj3)).to.equal(undefined)
      expect(manager.getConfig(obj4)).to.equal(undefined)

      expect(manager.getObject(obj1)).to.equal(undefined)
      expect(manager.getObject(cfg1)).to.equal(obj1)
      expect(manager.getObject(obj2)).to.equal(undefined)
      expect(manager.getObject(cfg2)).to.equal(obj2)

      expect(manager.getObject(obj3)).to.equal(undefined)
      expect(manager.getObject(obj4)).to.equal(undefined)
    })

    it('Should not set a pair of a config and a config', () => {
      manager.set(cfg3, cfg4)

      expect(manager.getConfig(obj1)).to.equal(cfg1)
      expect(manager.getConfig(cfg1)).to.equal(undefined)
      expect(manager.getConfig(obj2)).to.equal(cfg2)
      expect(manager.getConfig(cfg2)).to.equal(undefined)

      expect(manager.getConfig(obj3)).to.equal(undefined)
      expect(manager.getConfig(obj4)).to.equal(undefined)
      expect(manager.getConfig(cfg3)).to.equal(cfg4)
      expect(manager.getConfig(cfg4)).to.equal(cfg3)

      expect(manager.getObject(obj1)).to.equal(undefined)
      expect(manager.getObject(cfg1)).to.equal(obj1)
      expect(manager.getObject(obj2)).to.equal(undefined)
      expect(manager.getObject(cfg2)).to.equal(obj2)

      expect(manager.getObject(obj3)).to.equal(undefined)
      expect(manager.getObject(obj4)).to.equal(undefined)
      expect(manager.getObject(cfg3)).to.equal(cfg4)
      expect(manager.getObject(cfg4)).to.equal(cfg3)
    })

    it('Should delete both object and config with either one of them', () => {
      manager.delete(obj1)

      expect(manager.getConfig(obj1)).to.equal(undefined)
      expect(manager.getConfig(cfg1)).to.equal(undefined)
      expect(manager.getConfig(obj2)).to.equal(cfg2)
      expect(manager.getConfig(cfg2)).to.equal(undefined)

      expect(manager.getConfig(obj3)).to.equal(undefined)
      expect(manager.getConfig(obj4)).to.equal(undefined)
      expect(manager.getConfig(cfg3)).to.equal(cfg4)
      expect(manager.getConfig(cfg4)).to.equal(cfg3)

      expect(manager.getObject(obj1)).to.equal(undefined)
      expect(manager.getObject(cfg1)).to.equal(undefined)
      expect(manager.getObject(obj2)).to.equal(undefined)
      expect(manager.getObject(cfg2)).to.equal(obj2)

      expect(manager.getObject(obj3)).to.equal(undefined)
      expect(manager.getObject(obj4)).to.equal(undefined)
      expect(manager.getObject(cfg3)).to.equal(cfg4)
      expect(manager.getObject(cfg4)).to.equal(cfg3)

      manager.delete(cfg2)

      expect(manager.getConfig(obj1)).to.equal(undefined)
      expect(manager.getConfig(cfg1)).to.equal(undefined)
      expect(manager.getConfig(obj2)).to.equal(undefined)
      expect(manager.getConfig(cfg2)).to.equal(undefined)

      expect(manager.getConfig(obj3)).to.equal(undefined)
      expect(manager.getConfig(obj4)).to.equal(undefined)
      expect(manager.getConfig(cfg3)).to.equal(cfg4)
      expect(manager.getConfig(cfg4)).to.equal(cfg3)

      expect(manager.getObject(obj1)).to.equal(undefined)
      expect(manager.getObject(cfg1)).to.equal(undefined)
      expect(manager.getObject(obj2)).to.equal(undefined)
      expect(manager.getObject(cfg2)).to.equal(undefined)

      expect(manager.getObject(obj3)).to.equal(undefined)
      expect(manager.getObject(obj4)).to.equal(undefined)
      expect(manager.getObject(cfg3)).to.equal(cfg4)
      expect(manager.getObject(cfg4)).to.equal(cfg3)
    })
  })

})


})();
