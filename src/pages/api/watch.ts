import { type NextApiHandler } from 'next'
import { ZodError, z } from 'zod'

import { watcher } from '~/middleware/watcher'

const WatchBody = z.object({
  crn: z.coerce.number(),
  email: z.string().email()
})

/**
 * Register an email to receive updates for a certain CRN
 */
const watch: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  try {
    const {
      crn,
      email
    } = WatchBody.parse(req.body)

    await watcher.register(crn, email)
      .then(() => res.status(200).end())
      .catch((err) => {
        if (err.message === 'not found') return res.status(404).send('could not find that CRN')

        console.error(err)

        res.status(500).end()
      })
  } catch (err) {
    if (err instanceof ZodError) res.status(400).send(err.message)
    else res.status(500).end()
  }
}

export default watch
