'use strict'

/* global describe it */
/* eslint quotes: "off" */

const ClassConfigBase = require('..')
const chai = require('chai')
const expect = chai.expect
const instanceStringer = require('instance-stringer')

describe('class-config-base', () => {

  it('Should define a config class which extends ClassConfigBase', () => {
    const defaultConfig = {
      a: 0,
      b: { c: '', d: false },
    }

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }
    }

    const myConfig = new MyClassConfig()

    expect(myConfig.a).to.equal(0)
    expect(myConfig.b.c).to.equal('')
    expect(myConfig.b.d).to.equal(false)
    expect(myConfig.toString()).to.equal(
      "MyClassConfig { a: 0, b: { c: '', d: false } }")

    myConfig.a = 123
    myConfig.b.c = 'ABC'
    myConfig.b.d = true

    expect(myConfig.a).to.equal(123)
    expect(myConfig.b.c).to.equal('ABC')
    expect(myConfig.b.d).to.equal(true)
    expect(myConfig.toString()).to.equal(
      "MyClassConfig { a: 123, b: { c: 'ABC', d: true } }")
  })

  it('Should override accessors of a config class', () => {
    const defaultConfig = {
      a: 0,
      b: { c: '', d: false },
    }

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      getAccessorDescriptors () {
        return {
          a: parent => ({
            enumerable: true,
            get () { return parent.a },
            set () {},
          }),

          'b.c': parent => ({
            enumerable: true,
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

    const myConfig = new MyClassConfig()

    expect(myConfig.a).to.equal(0)
    expect(myConfig.b.c).to.equal('')
    expect(myConfig.b.d).to.equal(false)
    expect(myConfig.toString()).to.equal(
      "MyClassConfig { a: 0, b: { c: '', d: false } }")

    myConfig.a = 123
    myConfig.b.d = true
    myConfig.b.c = 'ABC'

    expect(myConfig.a).to.equal(0)
    expect(myConfig.b.c).to.equal('ABC')
    expect(myConfig.b.d).to.equal(true)
    expect(myConfig.toString()).to.equal(
      "MyClassConfig { a: 0, b: { c: 'ABC', d: true } }")

    myConfig.$private.a = 123

    expect(myConfig.a).to.equal(123)
    expect(myConfig.b.c).to.equal('ABC')
    expect(myConfig.b.d).to.equal(true)
    expect(myConfig.toString()).to.equal(
      "MyClassConfig { a: 123, b: { c: 'ABC', d: true } }")
  })

  it('Should define interfaces for target class', () => {
    const defaultConfig = {
      a: 0,
      b: { c: '', d: false },
    }

    class MyClassConfig extends ClassConfigBase {
      constructor (initConfig) {
        super(initConfig, defaultConfig)
      }

      getAccessorDescriptors () {
        return {
          a: parent => ({
            enumerable: true,
            get () { return parent.a },
            set (v) { parent.a = Math.max(0, v) },
          }),

          'b.c': parent => ({
            enumerable: true,
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
        }
      }
    }

    class MyClass {
      constructor (myConfig) {
        myConfig.configure(this)
      }
    }

    const myConfig = new MyClassConfig({ a: 999, b: { c: 'AAA', d: true } })
    const myObj = new MyClass(myConfig)

    expect(myObj.myA).to.equal(999)
    expect(myObj.myC).to.equal('AAA')
    expect(myObj.myD).to.equal(true)
    expect(myObj.toString()).to.equal('[object MyClass]');
    expect(Object.prototype.toString.call(myObj)).to.equal('[object MyClass]');

    myObj.myA = 888
    myObj.myC = 'BBB'
    myObj.myD = false

    expect(myObj.myA).to.equal(888)
    expect(myObj.myC).to.equal('BBB')
    expect(myObj.myD).to.equal(false)
    expect(myObj.toString()).to.equal('[object MyClass]');
    expect(Object.prototype.toString.call(myObj)).to.equal('[object MyClass]');

    myObj.myA = -1
    myObj.myC = 'CCC'

    expect(myObj.myA).to.equal(0)
    expect(myObj.myC).to.equal('BBB')
    expect(myObj.myD).to.equal(false)
    expect(myObj.toString()).to.equal('[object MyClass]');
    expect(Object.prototype.toString.call(myObj)).to.equal('[object MyClass]');

    // toString

    myObj[Symbol.toStringTag] = 'MYOBJ'
    expect(myObj.toString()).to.equal('[object MyClass]')
    expect(Object.prototype.toString.call(myObj)).to.equal('[object MyClass]');

    myObj.toString = () => { return 'my object' }
    expect(myObj.toString()).to.equal('my object')
    expect(Object.prototype.toString.call(myObj)).to.equal('[object MyClass]');
  })

  it('Should define an empty config class and a empty class', () => {
    class EmptyClassConfig extends ClassConfigBase {
      constructor () { super() }
    }

    class EmptyClass {
      constructor (config) { config.configure(this) }
    }

    const config = new EmptyClassConfig()
    expect(config.toString()).to.equal('EmptyClassConfig {}')

    const obj = new EmptyClass(config)
    expect(Object.keys(obj).length).to.equal(0)
    expect(obj.toString()).to.equal('[object EmptyClass]')

    expect(Object.prototype.toString.call(obj)).to.equal('[object EmptyClass]')
  })
})
