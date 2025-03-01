import debug from 'debug'

const {
  env: {
    DEBUG = 'housekeeping*'
  }
} = process

if (DEBUG) debug.enable(DEBUG)
