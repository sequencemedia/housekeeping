import {
  readFile
} from 'node:fs/promises'

import debug from '#housekeeping/debug'

const log = debug('housekeeping/common/from-file')

log('`housekeeping` is awake')

export default async function fromFile (filePath) {
  log('fromFile')

  const fileData = await readFile(filePath, 'utf8')

  return (
    JSON.parse(fileData)
  )
}
