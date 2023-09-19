import { type Knex } from 'knex'
import cron from 'node-cron'
import axios from 'axios'
import mailer from 'nodemailer'

import { db } from '~/middleware/database'

import { env } from '~/env.mjs'

const {
  MAILER_HOST,
  MAILER_PORT,
  MAILER_USER,
  MAILER_PASS
} = env

const GITHUB_API = 'https://api.github.com'
const GITHUB_CDN = 'https://raw.githubusercontent.com'

interface WatcherRow {
  crn: number
  emails: string[]
}

interface Section {
  cap: number
  rem: number
  crn: number
}

interface Course {
  crse: string
  id: string
  sections: Section[]
  title: string
}

interface Department {
  code: string
  courses: Course[]
}

const transporter = mailer.createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS
  }
})

class Watcher {
  db: Knex
  listeners = new Map<number, string[]>()
  courseData?: Department[]
  initialized = false

  constructor (db: Knex) {
    this.db = db
  }

  /**
   * Fetch listeners from database
   */
  async init (): Promise<void> {
    if (!this.initialized) {
      this.initialized = true

      await db('watchers')
        .select(['crn', 'emails'])
        .then((rows: WatcherRow[]) => {
          for (const row of rows) {
            this.listeners.set(row.crn, row.emails)

            console.log(`init listening for ${row.crn}`)
          }
        })

      await this.scan()
      this.watch()
    }
  }

  /**
   * Scan for seat updates
   */
  scan (): Promise<void> {
    console.log('beginning scan')

    return axios.get(`${GITHUB_API}/repos/quacs/quacs-data/contents/semester_data`)
      .then(({ data: semesters }) => axios.get<Department[]>(`${GITHUB_CDN}/quacs/quacs-data/master/${semesters[semesters.length - 1].path}/courses.json`))
      .then(({ data: departments }) => {
        this.courseData = departments

        for (const department of departments) {
          for (const course of department.courses) {
            for (const section of course.sections) {
              if (this.listeners.has(section.crn) && section.rem) {
                const recipients = this.listeners.get(section.crn)?.join(', ') ?? ''

                console.log(`emailing ${recipients}`)

                void transporter.sendMail({
                  to: recipients,
                  subject: `Course [${course.title}] has a seat available!`,
                  text: `${section.rem}/${section.cap} available`
                }, console.error)

                void db('watchers')
                  .delete()
                  .where({
                    crn: section.crn
                  })
                  .then(() => console.log(`deleted ${section.crn}`))
              }
            }
          }
        }
      })
  }

  /**
   * Register an email to receive updates for a CRN
   * @param crn   The CRN
   * @param email The email
   */
  async register (crn: number, email: string): Promise<void> {
    let found = false

    if (!this.courseData) await this.scan()

    for (const department of this.courseData!) {
      for (const course of department.courses) {
        for (const section of course.sections) {
          console.log(section.crn, typeof section.crn, section.crn === 664437)
          if (section.crn === crn) {
            found = true

            break
          }
        }

        if (found) break
      }

      if (found) break
    }

    if (!found) throw Error('not found')

    if (!this.listeners.has(crn)) this.listeners.set(crn, [])

    this.listeners.get(crn)?.push(email)

    await db('watchers')
      .update({
        emails: db.raw('ARRAY_APPEND(emails, ?)', [email])
      })
      .where({
        crn
      })
      .then(() => console.log(`added ${email} to ${crn}`))
  }

  /**
   * Unregister an email from receiving updates
   * @param email The email
   * @param crn   The CRN if only for one section
   */
  async purge (email: string, crn?: number): Promise<void> {
    for (const [eCrn, list] of this.listeners.entries()) {
      if (crn && eCrn !== crn) continue

      const index = list.indexOf(email)

      if (index !== -1) {
        list.splice(index, 1)

        await db('watchers')
          .update({
            emails: db.raw('ARRAY_REMOVE(emails, ?)', [email])
          })
          .where({
            crn
          })
          .then(() => console.log(`removed ${email} from ${crn}`))
      }
    }
  }

  /***
   * Set up a cron job to watch for data updates
   */
  watch (): void {
    cron.schedule('*/30 * * * *', this.scan as () => void)
  }
}

export const watcher = new Watcher(db)

void watcher.init()
