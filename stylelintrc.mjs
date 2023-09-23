#!/usr/bin/env node

import debug from 'debug'

import S from './src/stylelintrc.mjs'

async function app () {
  const {
    env: {
      DIR = '..',
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  return await S(DIR)
}

export default app()
