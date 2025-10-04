import debug from '#housekeeping/debug'

import {
  writeFile
} from 'node:fs/promises'

const log = debug('housekeeping/common')

log('`housekeeping/common/to-file` is awake')

export default async function toFile (filePath, o) {
  log('toFile')

  const fileData = JSON.stringify(o, null, 2).concat('\n')

  return await writeFile(filePath, fileData, 'utf8')
}
