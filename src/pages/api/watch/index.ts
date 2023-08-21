import { type NextApiHandler } from 'next'
import { z } from 'zod'

import { watcher } from '~/middleware/watcher'

const WatchBody = z.object({
  crn: z.string().length(6),
  email: z.string().email()
})

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
        console.error(err)

        res.status(500).end()
      })
  } catch (err) {
    return res.status(400).end(err)
  }
}

export default watch
