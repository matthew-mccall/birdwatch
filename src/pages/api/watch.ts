import { type NextApiHandler } from 'next'
import { z } from 'zod'

import { watcher } from '~/middleware/watcher'

const WatchBody = z.object({
  crn: z.string().length(6),
  email: z.string().email()
})

const UnwatchBody = z.object({
  email: z.string().email(),
  crn: z.string().length(6).optional()
})

const register: NextApiHandler = (req, res) => {
  try {
    const {
      crn,
      email
    } = WatchBody.parse(req.body)

    return watcher.register(crn, email)
      .then(() => res.status(200).end())
      .catch((err) => {
        if (err.message === 'not found') return res.status(404).end('could not find that CRN')

        console.error(err)

        res.status(500).end()
      })
  } catch (err) {
    return res.status(400).end(err)
  }
}

const unregister: NextApiHandler = (req, res) => {
  try {
    const {
      crn,
      email
    } = WatchBody.parse(req.body)

    return watcher.purge(email, crn)
      .then(() => res.status(200).end())
      .catch((err) => {
        console.error(err)

        res.status(500).end()
      })
  } catch (err) {
    return res.status(400).end(err)
  }
}

/**
 * Register an email to receive updates for a certain CRN
 */
const watch: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'POST': return register(req, res)
    case 'DELETE': return unregister(req, res)
    default: return res.status(405).end('Method not allowed')
  }
}

export default watch
