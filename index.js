'use strict'

const copyProps = require('copy-props')
const defaultValue = require('default-val')
const stringer = require('instance-stringer')

class ConfigBase {

  constructor (initConfig, defaultConfig) {
    Object.defineProperty(this, '$private', {
      value: copyProps(defaultConfig, {}),
    })

    copyProps(initConfig, this.$private,
      (src, dst) => defaultValue(src.value, dst.value))

    defineAccessors(this, this.getAccessorDescriptors())
  }

  getAccessorDescriptors () { return {} }

  getInterfaceDescriptors () { return {} }

  configure (instance) {
    defineToString(instance)
    Object.defineProperties(instance, this.getInterfaceDescriptors())
  }

  toString () { return stringer(this) }
}

function defineAccessors (config, descriptors) {
  descriptors = defaultValue(descriptors, {})

  copyProps(config.$private, config, (src, dst) => {
    let descriptor = descriptors[dst.keyChain] || defaultDescriptor
    descriptor = descriptor(src.parent, src.key, src)
    Object.defineProperty(dst.parent, dst.key, descriptor)
  })
}

function defaultDescriptor (parent, key) {
  return {
    enumerable: true,
    get () { return parent[key] },
    set (v) { parent[key] = defaultValue(v, parent[key]) },
  }
}

function defineToString (instance) {
  Object.defineProperties(instance, {
    [Symbol.toStringTag]: {
      get () { return instance.constructor.name },
      set () {},
    },
  })
}

module.exports = ConfigBase
