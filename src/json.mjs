import {
  resolve,
  dirname
} from 'node:path'

import debug from '#housekeeping/debug'

import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/*')
const info = debug('housekeeping/*:info')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/*.json`,
    `${directory}/**/*.json`,
    `!${directory}/node_modules/*.json`,
    `!${directory}/node_modules/**/*.json`,
    `!${directory}/**/node_modules/*.json`,
    `!${directory}/**/node_modules/**/*.json`
  ]
}

async function renderFile (filePath) {
  log('renderFile')

  try {
    info(filePath)

    const fileData = await fromFile(filePath)
    await toFile(filePath, fileData)
  } catch (e) {
    handleError(e)
  }
}

async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  try {
    info(directory)

    const a = await getFilePaths(toPatterns(directory))
    for (const filePath of genFilePath(a)) await renderFile(filePath)
  } catch (e) {
    handleError(e)
  }
}

export default async function handleDirectory (directory) {
  log('handleDirectory')

  const d = resolve(directory)
  try {
    info(d)

    const a = await getFilePaths(toPackages(d))
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath))
  } catch (e) {
    handleError(e)
  }
}
