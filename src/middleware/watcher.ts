import { type Knex } from 'knex'
import cron from 'node-cron'
import axios from 'axios'
import sendmail from 'sendmail'

import { db } from '~/middleware/database'

import { env } from '~/env.mjs'

const {
  SENDER
} = env

const GITHUB_API = 'https://api.github.com'
const GITHUB_CDN = 'https://raw.githubusercontent.com'

interface WatcherRow {
  crn: string
  emails: string[]
}

interface Section {
  cap: number
  rem: number
  crn: string
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

const mailer = sendmail({})

class Watcher {
  db: Knex
  listeners = new Map<string, string[]>()
  courseData?: Department[]

  constructor (db: Knex) {
    this.db = db
  }

  async init (): Promise<void> {
    await db('watchers')
      .select(['email', 'crns'])
      .then((rows: WatcherRow[]) => {
        for (const row of rows) {
          this.listeners.set(row.crn, row.emails)
        }
      })

    await this.scan()
  }

  scan (): Promise<void> {
    return axios.get(`${GITHUB_API}/repos/quacs/quacs-data/contents/semester_data`)
      .then(({ data: semesters }) => axios.get<Department[]>(`${GITHUB_CDN}/quacs/quacs-data/master/${semesters[semesters.length].path}/courses.json`))
      .then(({ data: departments }) => {
        this.courseData = departments

        for (const department of departments) {
          for (const course of department.courses) {
            for (const section of course.sections) {
              if (this.listeners.has(section.crn) && section.rem) {
                void mailer({
                  from: SENDER,
                  to: this.listeners.get(section.crn)?.join(', ') ?? '',
                  subject: `Course [${course.title}] has a seat available!`,
                  text: `${section.rem}/${section.cap} available`
                }, console.error)

                void db('watchers')
                  .delete()
                  .where({
                    crn: section.crn
                  })
              }
            }
          }
        }
      })
  }

  async register (crn: string, email: string): Promise<void> {
    if (!this.listeners.has(crn)) this.listeners.set(crn, [])

    this.listeners.get(crn)?.push(email)

    await db('watchers')
      .update({
        emails: db.raw('ARRAY_APPEND(emails, ?)', [email])
      })
      .where({
        crn
      })
  }

  async purge (email: string): Promise<void> {
    for (const [crn, list] of this.listeners.entries()) {
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
      }
    }
  }

  watch (): void {
    cron.schedule('* */30 * * * *', this.scan as () => void)
  }
}

export const watcher = new Watcher(db)

void watcher.init()
watcher.watch()
