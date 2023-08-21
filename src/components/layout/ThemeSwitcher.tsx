import { useCallback, useEffect } from 'react'
import { useTheme } from 'react-daisyui'

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const stored = localStorage.getItem('theme')

    if (stored) setTheme(stored)
  }, [setTheme])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'

    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }, [setTheme, theme])

  return (
    <div className={'absolute bottom-4 right-4 swap swap-rotate ' + (theme === 'dark' ? 'swap-active' : '')} onClick={toggleTheme}>
      <span className='material-symbols-outlined swap-off'>light_mode</span>
      <span className='material-symbols-outlined swap-on'>dark_mode</span>
    </div>
  )
}

export default ThemeSwitcher
