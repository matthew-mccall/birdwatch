import { type NextPage } from 'next'
import Image from 'next/image'
import { useCallback, useContext, useRef } from 'react'
import { Button, Input, Join, Tooltip } from 'react-daisyui'
import { ReporterContext } from '~/components/layout/Reporter'
import { useFetcher } from '~/hooks/fetcher'

import banner from 'public/images/banner.png'

const Home: NextPage = () => {
  const { dispatch: report } = useContext(ReporterContext)
  const fetcher = useFetcher()

  const formRef = useRef<HTMLFormElement>(null)

  const register = useCallback(() => {
    if (formRef.current && formRef.current.reportValidity()) {
      const data = new FormData(formRef.current)

      fetcher.post('/api/watch', {
        email: data.get('email'),
        crn: data.get('crn')
      })
        .then(() => report({ status: 'success', message: 'Successfully registered' }))
        .catch((err) => report({ status: 'error', message: err.response?.data ?? err.message }))
    }
  }, [report, fetcher])

  const unregister = useCallback(() => {
    if (formRef.current && formRef.current.reportValidity()) {
      
    }
  }, [])

  const purge = useCallback(() => {
    const crnInput = document.getElementById('crn') as HTMLInputElement | null
    if (!crnInput) return

    crnInput.required = false

    if (formRef.current && formRef.current.reportValidity()) {

    }

    crnInput.required = true
  }, [])

  return (
    <>
      <form className='flex flex-col grow justify-center items-center gap-12' ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <Image className='drop-shadow-lg rounded-lg' src={banner} alt='QuACS Birdwatch' width={280} />

        <Join horizontal>
          <Input name='email' required className='join-item' placeholder='Email...' type='email' />
          <Input name='crn' required className='join-item' placeholder='CRN...' minLength={5} maxLength={5} />
        </Join>

        <Join horizontal>
          <Button color='primary' className='join-item' onClick={register}>Register</Button>
          <Button color='neutral' className='join-item' onClick={unregister}>Unregister</Button>
        </Join>
      </form>

      <div className='self-center flex flex-col gap-2 mb-4'>
        <label>No longer want to receive any emails?</label>
        <Tooltip message='This will unregister you from all CRNs'>
          <Button size='sm' color='error' onClick={purge}>Unsubscribe</Button>
        </Tooltip>
      </div>
    </>
  )
}

export default Home
