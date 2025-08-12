# Birdwatch
Notifier for when seats open in class sections on QuACS

## Env vars
```env
# The database client to use for Knex ("pg" recommended)
DATABASE_CLIENT=

DATABASE_URL=
MAILER_HOST=
MAILER_PORT=
MAILER_USER=
MAILER_PASS=
```

## Getting started
> Install dependencies:
> 
> `bun i`

> Initialize Database:
> 
> `bunx knex migrate:latest`

> Build:
> 
> `bun run build`

> Start:
> 
> `bun run start`
