import { type AppType } from 'next/dist/shared/lib/utils'
import Head from 'next/head'
import { Theme } from 'react-daisyui'
import Reporter from '~/components/layout/Reporter'
import ThemeSwitcher from '~/components/layout/ThemeSwitcher'

import '~/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Birdwatch</title>
        <meta name='description' content='Get notified when seats free up in an RPI course section' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Theme className='min-h-screen flex flex-col'>
        <Reporter>
          <Component {...pageProps} />

          <ThemeSwitcher />
        </Reporter>
      </Theme>
    </>
  )
}

export default MyApp
