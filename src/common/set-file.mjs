import debug from 'debug'

import { writeFile } from 'fs/promises'

const log = debug('housekeeping:common')

log('`housekeeping:common:set-file` is awake')

export default async function setFile (filePath, o) {
  log('setFile')

  const fileData = JSON.stringify(o, null, 2).concat('\n')

  return await writeFile(filePath, fileData, 'utf8')
}
