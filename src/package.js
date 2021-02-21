import debug from 'debug'

import {
  resolve,
  dirname,
  join
} from 'path'

import {
  readFile,
  writeFile
} from 'fs/promises'

import ensureDir from 'ensureDir'

import {
  exec
} from 'child_process'

import getPackages from './common/get-packages'

const log = debug('housekeeping:package')

log('`housekeeping:package` is awake')

const transform = (v) => resolve(v) // constrain to one arg

const ensure = async (p) => (
  new Promise((resolve, reject) => {
    ensureDir(p, 755, (e) => !e ? resolve() : reject(e))
  })
)

async function execute (p, AUTHOR, REGEXP, d) {
  log('execute')

  let s = await readFile(p, 'utf8')
  let o = JSON.parse(s)

  const {
    name,
    version,
    description,
    keywords,
    private: isPrivate,
    main,
    type,
    types,
    author,
    contributors,
    license,
    engines,
    repository,
    homepage,
    bugs,
    scripts,
    bin,
    dependencies,
    devDependencies,
    peerDependencies,
    _moduleAliases,
    husky,
    ...rest
  } = o

  o = {
    ...(name ? { name } : {}),
    ...(version ? { version } : {}),
    ...(description ? { description } : {}),
    ...(keywords ? { keywords } : {}),
    ...(isPrivate ? { private: isPrivate } : {}),
    ...(main ? { main } : {}),
    ...(type ? { type } : {}),
    ...(types ? { types } : {}),
    ...(author ? (typeof author === 'string' && author.startsWith('Jonathan Perry')) ? { author: AUTHOR } : { author } : {}),
    ...(contributors ? { contributors } : {}),
    ...(license ? { license } : {}),
    ...(engines ? { engines } : {}),
    ...(repository ? { repository } : {}),
    ...(homepage ? { homepage } : {}),
    ...(bugs ? { bugs } : {}),
    ...(scripts ? { scripts } : {}),
    ...(bin ? { bin } : {}),
    ...(dependencies ? { dependencies } : {}),
    ...(devDependencies ? { devDependencies } : {}),
    ...(peerDependencies ? { peerDependencies } : {}),
    ...rest,
    ...(_moduleAliases ? { _moduleAliases } : {})
  }

  if (husky) {
    const {
      hooks = {}
    } = husky

    const h = resolve(join(dirname(p), '.husky'))

    await ensure(h)

    const a = Array
      .from(Object.entries(hooks))
      .map(([key, value]) => (
        new Promise((resolve) => {
          exec(`npx husky add "${h}/${key}" "${value}"`, (e) => {
            if (e) log(`Error at "${h}/${key}"`)

            resolve()
          })
        }))
      )

    await Promise.all(a)
  }

  s = JSON.stringify(o, null, 2).concat('\n')
  await writeFile(p, s, 'utf8')
}

export default async function app (directory, author) {
  log('app')

  const array = await getPackages(transform(directory))

  await Promise.all(array.map(transform).map((p) => execute(p, author)))
}
