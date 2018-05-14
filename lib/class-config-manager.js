'use strict'

const ClassConfigBase = require('./class-config-base')

class ClassConfigManager {

  constructor () {
    this._objectConfigMap = new WeakMap()
  }

  set (object, config) {
    if (config instanceof ClassConfigBase ||
        object instanceof ClassConfigBase) {
      this._objectConfigMap.set(config, object)
      this._objectConfigMap.set(object, config)
    }
  }

  delete (objectOrConfig) {
    const configOrObject = this._objectConfigMap.get(objectOrConfig)
    this._objectConfigMap.delete(objectOrConfig)
    this._objectConfigMap.delete(configOrObject)
  }

  getConfig (object) {
    const config = this._objectConfigMap.get(object)
    if (config instanceof ClassConfigBase) {
      return config
    }
  }

  getObject (config) {
    if (config instanceof ClassConfigBase) {
      return this._objectConfigMap.get(config)
    }
  }
}

module.exports = ClassConfigManager
