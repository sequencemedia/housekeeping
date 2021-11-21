import debug from 'debug'

import app from './src/depsrc.mjs'

const {
  env: {
    DIR = '..',
    DEBUG = 'housekeeping*'
  }
} = process

debug.enable(DEBUG)

export default app(DIR)
