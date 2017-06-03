{
'use strict'

/* global describe it */


const { readonly, writable, replaceable } = ClassConfigBase

const expect = chai.expect

describe('class-config-base', () => {

  describe('no accessor and no interface', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfigBase {
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
      const myconfig = new MyClassConfig()
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)
    })

    it('Should create a config with an argument', () => {
      const myconfig = new MyClassConfig({ a: 9, b: { c: 'DEF', d: true } })
      expect(myconfig.a).to.equal(9)
      expect(myconfig.b.c).to.equal('DEF')
      expect(myconfig.b.d).to.equal(true)
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

    it('Should delete normal properties', () => {
      const myconfig = new MyClassConfig()

      if (typeof window !== 'undefined') {
        delete myconfig.a
        delete myconfig.b.c
        delete myconfig.b.d
      } else {
        expect(() => { delete myconfig.a }).to.throw(TypeError)
        expect(() => { delete myconfig.b.c }).to.throw(TypeError)
        expect(() => { delete myconfig.b.d }).to.throw(TypeError)
      }

      expect(myconfig.a).not.to.equal(undefined)
      expect(myconfig.b.c).not.to.equal(undefined)
      expect(myconfig.b.d).not.to.equal(undefined)
    })

    it('Should not allow to set bad type value', () => {
      const myconfig = new MyClassConfig()
      myconfig.a = 'A'
      myconfig.b.c = 1
      myconfig.b.d = 9
      expect(myconfig.a).to.equal(0)
      expect(myconfig.b.c).to.equal('')
      expect(myconfig.b.d).to.equal(false)

      myconfig.a = 123
      myconfig.b.c = 'ABC'
      myconfig.b.d = true
      expect(myconfig.a).to.equal(123)
      expect(myconfig.b.c).to.equal('ABC')
      expect(myconfig.b.d).to.equal(true)

      myconfig.a = 'ABC'
      myconfig.b.c = true
      myconfig.b.d = 123
      expect(myconfig.a).to.equal(123)
      expect(myconfig.b.c).to.equal('ABC')
      expect(myconfig.b.d).to.equal(true)
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

  describe('define readonly accessors', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors () {
        return {
          a: (p, key) => readonly({ get: () => Math.max(p[key], 0) }),
          'b.c': (p, key) => readonly({ get: () => p[key].toUpperCase() }),
          'b.d': (p, key) => readonly({ get () { return p[key] } }),
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

      if (typeof window !== 'undefined') {
        delete myconfig.a
        delete myconfig.b.c
        delete myconfig.b.d
      } else {
        expect(() => { delete myconfig.a }).to.throw(TypeError)
        expect(() => { delete myconfig.b.c }).to.throw(TypeError)
        expect(() => { delete myconfig.b.d }).to.throw(TypeError)
      }

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

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors () {
        return {
          a: (p, key) => writable({
            get: () => p[key],
            set: v => { p[key] = Math.max(v, 0) },
          }),
          'b.c': (p, key) => writable({
            get: () => p[key],
            set: v => { p[key] = v ? v.toUpperCase() : '' },
          }),
          'b.d': (p, key) => writable({
            get () { return p[key] },
            set (v) { p[key] = v },
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

      if (typeof window !== 'undefined') {
        delete myconfig.a
        delete myconfig.b.c
        delete myconfig.b.d
      } else {
        expect(() => { delete myconfig.a }).to.throw(TypeError)
        expect(() => { delete myconfig.b.c }).to.throw(TypeError)
        expect(() => { delete myconfig.b.d }).to.throw(TypeError)
      }

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

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineAccessors () {
        return {
          a: (p, key) => replaceable({
            get: () => Math.max(p[key], 0),
          }),
          'b.c': (p, key) => replaceable({
            get: () => p[key].toUpperCase(),
          }),
          'b.d': (p, key) => replaceable({
            get () { return p[key] },
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

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineInterfaces () {
        return {
          aaa: cfg => readonly({
            get: () => Math.max(cfg.a, 0),
          }),
          ccc: cfg => readonly({
            get: () => cfg.b.c.toUpperCase(),
          }),
          ddd: cfg => readonly({
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

      if (typeof window !== 'undefined') {
        delete myconfig.a
        delete myconfig.b.c
        delete myconfig.b.d
      } else {
        expect(() => { delete myconfig.a }).to.throw(TypeError)
        expect(() => { delete myconfig.b.c }).to.throw(TypeError)
        expect(() => { delete myconfig.b.d }).to.throw(TypeError)
      }

      expect(myconfig.a).not.to.equal(undefined)
      expect(myconfig.b.c).not.to.equal(undefined)
      expect(myconfig.b.d).not.to.equal(undefined)
    })
  })

  describe('define writable interfaces', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineInterfaces () {
        return {
          aaa: cfg => writable({
            set: v => { cfg.a = Math.max(v, 0) },
            get: () => cfg.a,
          }),
          ccc: cfg => writable({
            set: v => { cfg.b.c = v ? v.toUpperCase() : '' },
            get: () => cfg.b.c,
          }),
          ddd: cfg => writable({
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

      if (typeof window !== 'undefined') {
        delete myconfig.a
        delete myconfig.b.c
        delete myconfig.b.d
      } else {
        expect(() => { delete myconfig.a }).to.throw(TypeError)
        expect(() => { delete myconfig.b.c }).to.throw(TypeError)
        expect(() => { delete myconfig.b.d }).to.throw(TypeError)
      }

      expect(myconfig.a).not.to.equal(undefined)
      expect(myconfig.b.c).not.to.equal(undefined)
      expect(myconfig.b.d).not.to.equal(undefined)
    })
  })

  describe('define replaceable interfaces', () => {
    const defaultConfig = { a: 0, b: { c: '', d: false } }

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      defineInterfaces () {
        return {
          aaa: cfg => replaceable({
            set: v => cfg.a = Math.max(v, 0),
            get: () => cfg.a,
          }),
          ccc: cfg => replaceable({
            set: v => cfg.b.c = v ? v.toUpperCase() : '',
            get: () => cfg.b.c,
          }),
          ddd: cfg => replaceable({
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

})

}
