'use strict'

const copyProps = require('copy-props')
const defaultValue = require('default-val')
const stringer = require('instance-stringer')

class ClassConfigBase {

  constructor (initConfig, defaultConfig) {
    Object.defineProperty(this, '$private', { value: {} })
    copyProps(defaultConfig, this.$private)
    copyProps(initConfig, this.$private, initPrivateProp)

    const definitions = this.defineAccessors() ||
                        this.getAccessorDescriptors()

    defineConfigProps(this, definitions)
  }

  configure (instance) {
    defineToString(instance)

    const definitions = this.defineInterfaces()
    if (definitions) {
      defineInstanceProps(instance, definitions, this)
    }

    Object.defineProperties(instance, this.getInterfaceDescriptors())
  }

  toString () { return stringer(this) }

  defineAccessors () {}

  defineInterfaces () {}

  getAccessorDescriptors () { return {} }

  getInterfaceDescriptors () { return {} }


  static readonly ({ get, enumerable = true }) {
    return {
      enumerable,
      set () {},
      get,
    }
  }

  static writable ({ get, set, enumerable = true, configurable = false }) {
    return {
      enumerable,
      configurable,
      set,
      get,
    }
  }

  static replaceable ({ get, enumerable = true }) {
    return {
      enumerable,
      configurable: true,
      get,
      set: shouldBeReplaceableSetter,
    }
  }

  static method (fn) {
    return {
      enumerable: true,
      configurable: true,
      writable: true,
      value: fn,
    }
  }
}


function initPrivateProp (src, dst) {
  return defaultValue(src.value, dst.value)
}

function defaultDefinition (parent, key) {
  return {
    enumerable: true,
    get () { return parent[key] },
    set (v) { parent[key] = defaultValue(v, parent[key]) },
  }
}

function defineConfigProps (config, definitions) {
  copyProps(config.$private, config, (src, dst) => {
    const definitionFn = definitions[dst.keyChain] || defaultDefinition
    const descriptor = definitionFn(src.parent, src.key)
    if (descriptor.set === shouldBeReplaceableSetter) {
      toReplaceable(descriptor, dst.parent, dst.key)
    }
    Object.defineProperty(dst.parent, dst.key, descriptor)
  })
}

/* istanbul ignore next */
function shouldBeReplaceableSetter () {}

function defineToString (instance) {
  Object.defineProperties(instance, {
    [Symbol.toStringTag]: {
      get () { return instance.constructor.name },
      set () {},
    },
  })
}

function defineInstanceProps (instance, definitions, config) {
  const descriptors = Object.keys(definitions).reduce((obj, name) => {
    const definitionFn = definitions[name]
    const descriptor = definitionFn(config, name)
    if (descriptor.set === shouldBeReplaceableSetter) {
      toReplaceable(descriptor, instance, name)
    }
    obj[name] = descriptor
    return obj
  }, {})

  Object.defineProperties(instance, descriptors)
}

function toReplaceable (descriptor, obj, name) {
  descriptor.set = value => {
    Object.defineProperty(obj, name, {
      enumerable: descriptor.enumerable,
      configurable: true,
      writable: true,
      value,
    })
  }
}

module.exports = ClassConfigBase
