import debug from '#housekeeping/debug'

const MESSAGE = 'No error message defined'

const error = debug('housekeeping:error')

/**
 *  @param {Error} e
 */
export default function handleError ({
  message = MESSAGE
}) {
  error(message)
}
