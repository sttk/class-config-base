'use strict'

const fs = require('fs')
const path = require('path')
const encoding = 'utf-8'
const outdir = path.resolve(__dirname, '../test/web')

function listFiles (rpath, extensions) {
  extensions = Array.isArray(extensions) || [extensions]
  const apath = path.resolve(__dirname, rpath)
  return fs.readdirSync(apath, encoding).filter(isExtension).map(resolve)

  function isExtension (filename) {
    for (const ext of extensions) {
      if (filename.slice(-ext.length) === ext) {
        return true
      }
    }
  }

  function resolve (filename) {
    return path.resolve(apath, filename)
  }
}

function copyFile (filepath) {
  const apath = path.resolve(__dirname, filepath)
  const filename = path.basename(filepath)
  const data = fs.readFileSync(apath, encoding)
  fs.writeFileSync(path.resolve(outdir, filename), data, encoding)
}

function convertFile (filepath) {
  const apath = path.resolve(__dirname, filepath)
  const filename = path.basename(filepath)
  let data = fs.readFileSync(apath, encoding)
  data = data.replace(/[^\r\n]*require *\([^\r\n]*/g, '')
  data = `{\n${data}\n}\n`
  fs.writeFileSync(path.resolve(outdir, filename), data, encoding)
}

listFiles('.', '.html').forEach(copyFile)
listFiles('../test', '.js').forEach(convertFile)

