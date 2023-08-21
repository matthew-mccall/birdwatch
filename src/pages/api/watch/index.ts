import { type NextApiHandler } from 'next'
import { z } from 'zod'

import { watcher } from '~/middleware/watcher'

const WatchBody = z.object({
  crn: z.string().length(6),
  email: z.string().email()
})

/**
 * Register an email to receive updates for a certain CRN
 */
const watch: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Only POST requests allowed')

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

export default watch
