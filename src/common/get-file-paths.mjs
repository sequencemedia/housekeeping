import debug from '#housekeeping/debug'

import glob from 'glob-all'

const log = debug('housekeeping/common')

log('`housekeeping/common/get-file-paths` is awake')

/**
 *  @param {string | string[]} patterns
 *  @returns {Promise<string[]>}
 */
export default function getFilePaths (patterns = './*') {
  log('getFilePaths')

  return (
    new Promise((resolve, reject) => {
      glob(patterns, (e, filePaths) => {
        if (!e) {
          /**
           *  Ensure unique
           *
           *  @type {Set<string>}
           */
          const s = new Set(filePaths)
          /**
           *  Ensure truthy string
           *
           *  @type {string[]}
           */
          const a = Array.from(s).filter(Boolean).map(String)

          resolve(a)
        } else {
          reject(e)
        }
      })
    })
  )
}
