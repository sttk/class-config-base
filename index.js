'use strict'

const ClassConfigBase = require('./lib/class-config-base')

Object.defineProperty(ClassConfigBase, 'ClassConfigManager', {
  enumerable: true,
  value: require('./lib/class-config-manager')
})

module.exports = ClassConfigBase
