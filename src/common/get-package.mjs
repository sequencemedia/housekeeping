import debug from '#housekeeping/debug'

import fromFile from './from-file.mjs'

const log = debug('housekeeping/common')

log('`housekeeping/common/get-package` is awake')

export default async function getPackage (directory = '.') {
  log('getPackage')

  return await fromFile(`${directory}/package.json`)
}
