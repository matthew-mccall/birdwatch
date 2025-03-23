import type { NextApiHandler } from 'next'
import { ZodError, z } from 'zod'

import { watcher } from '~/middleware/watcher'

const UnwatchBody = z.object({
  email: z.string().email(),
  crn: z.coerce.number().optional()
})

const unwatch: NextApiHandler = async (req, res) => {
  try {
    const {
      crn,
      email
    } = UnwatchBody.parse(req.body)

    await watcher.purge(email, crn)
      .then(() => res.status(200).end())
      .catch((err) => {
        console.error(err)

        res.status(500).end()
      })
  } catch (err) {
    if (err instanceof ZodError) res.status(400).send(err.message)
    else res.status(500).end()
  }
}

export default unwatch
