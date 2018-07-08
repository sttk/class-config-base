'use strict'

const chai = require('chai')
const expect = chai.expect
const ClassConfig = require('..')
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

