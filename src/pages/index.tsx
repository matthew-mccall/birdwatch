import type { NextPage } from 'next'
import Image from 'next/image'
import { useCallback, useContext, useRef } from 'react'
import { Button, Input, Join, Tooltip } from 'react-daisyui'
import { ReporterContext } from '~/components/layout/Reporter'
import { useFetcher } from '~/hooks/fetcher'
import { useRouter } from 'next/router'

import banner from 'public/images/banner.png'

const Home: NextPage = () => {
  const router = useRouter()
  const { dispatch: report } = useContext(ReporterContext)
  const fetcher = useFetcher()

  const formRef = useRef<HTMLFormElement>(null)
  const crnRef = useRef<HTMLInputElement>(null)

  const register = useCallback(() => {
    if (formRef.current?.reportValidity()) {
      const data = new FormData(formRef.current)

      fetcher.post(router.basePath + '/api/watch', {
        email: data.get('email'),
        crn: data.get('crn')
      })
        .then(() => report({ status: 'success', message: 'Successfully registered' }))
        .catch((err) => report({ status: 'error', message: err.response?.data ?? err.message }))
        .finally(() => crnRef.current && (crnRef.current.value = ''))
    }
  }, [report, fetcher, router])

  const unregister = useCallback(() => {
    if (formRef.current?.reportValidity()) {
      const data = new FormData(formRef.current)

      fetcher.post(router.basePath + '/api/unwatch', {
        email: data.get('email'),
        crn: data.get('crn')
      })
        .then(() => report({ status: 'success', message: 'Successfully unregistered' }))
        .catch((err) => report({ status: 'error', message: err.response?.data ?? err.message }))
        .finally(() => crnRef.current && (crnRef.current.value = ''))
    }
  }, [report, fetcher, router])

  const purge = useCallback(() => {
    if (!crnRef.current) return

    crnRef.current.required = false

    if (formRef.current?.reportValidity()) {
      const data = new FormData(formRef.current)

      fetcher.post(router.basePath + '/api/unwatch', {
        email: data.get('email')
      })
        .then(() => report({ status: 'success', message: 'Successfully purged email' }))
        .catch((err) => report({ status: 'error', message: err.response?.data ?? err.message }))
    }

    crnRef.current.required = true
  }, [report, fetcher, router])

  return (
    <>
      <form className='flex flex-col grow justify-center items-center gap-12' ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <Image className='drop-shadow-lg rounded-lg' src={banner} alt='QuACS Birdwatch' width={400} />

        <Join horizontal>
          <Input name='email' required className='join-item w-full focus:z-10' placeholder='Email...' type='email' />
          <Input ref={crnRef} name='crn' required className='join-item w-full focus:z-10' placeholder='CRN...' minLength={5} maxLength={5} />
        </Join>

        <Join horizontal>
          <Button color='primary' className='join-item' onClick={register}>Register</Button>
          <Button color='neutral' className='join-item' onClick={unregister}>Unregister</Button>
        </Join>
      </form>

      <div className='self-center flex flex-col items-center gap-2 mb-4'>
        <label>No longer want to receive any emails?</label>
        <Tooltip message='This will unregister you from all CRNs'>
          <Button size='sm' color='error' onClick={purge}>Unsubscribe</Button>
        </Tooltip>
      </div>
    </>
  )
}

export default Home
