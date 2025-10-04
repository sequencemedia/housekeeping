import {
  resolve,
  dirname
} from 'node:path'

import debug from '#housekeeping/debug'

import formatDirectory from './common/format-directory.mjs'
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/json')
const info = debug('housekeeping/json:info')

log('`housekeeping/json` is awake')

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
    info(formatDirectory(filePath))

    const fileData = await fromFile(filePath)
    await toFile(filePath, fileData)
  } catch (e) {
    handleError(e)
  }
}

async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  const d = resolve(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPatterns(d))
    for (const filePath of genFilePath(a)) await renderFile(filePath)
  } catch (e) {
    handleError(e)
  }
}

export default async function handleDirectory (directory) {
  log('handleDirectory')

  const d = resolve(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPackages(d))
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath))
  } catch (e) {
    handleError(e)
  }
}
