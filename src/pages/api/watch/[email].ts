import { type NextApiHandler } from 'next'

import { watcher } from '~/middleware/watcher'

/**
 * Unregister an email from receiving seat updates
 */
const watch: NextApiHandler = (req, res) => {
  if (req.method !== 'DELETE') return res.status(405).end('Only DELETE requests allowed')

  if (typeof req.query.email !== 'string') return res.status(400).end('Only one email allowed')

  return watcher.purge(req.query.email)
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error(err)

      res.status(500).end()
    })
}

export default watch
