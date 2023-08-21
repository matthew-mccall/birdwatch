import { createContext, useReducer, useEffect, useMemo, useCallback } from 'react'
import { Toast, Alert, type AlertProps, Button } from 'react-daisyui'

const defaultHeaders = {
  info: 'Heads up!',
  warning: 'Watch out!',
  error: 'An error has occured!',
  success: 'Success!'
}

export interface Report {
  status?: AlertProps['status']
  header?: string
  message: string
}

export type ReporterAction = {
  type: 'report'
} & Report | {
  type: 'dismiss'
  index: number
}

export interface ReporterContextType {
  reports: Report[]
  dispatch: React.Dispatch<Report>
}

export const ReporterContext = createContext<ReporterContextType>({
  reports: [],
  dispatch: () => {}
})

function reporterReducer (state: Report[], action: ReporterAction): Report[] {
  switch (action.type) {
    case 'report':
      return state.concat({
        status: action.status,
        message: action.message
      })
    case 'dismiss':
      return state.slice(0, action.index).concat(state.slice(action.index + 1))
  }
}

const Reporter: React.FC<React.PropsWithChildren> = (props) => {
  const [reports, dispatchReport] = useReducer(reporterReducer, [])

  const dispatch = useCallback((opts: Report) => {
    if (!document.hasFocus()) alert(opts.message)

    dispatchReport({
      type: 'report',
      ...opts
    })
  }, [dispatchReport])

  const dismiss = useCallback((index: number) => dispatchReport({
    type: 'dismiss',
    index
  }), [dispatchReport])

  useEffect(() => { // Auto-dismiss after 10 seconds
    if (reports.length) {
      const timeout = setTimeout(() => dismiss(reports.length - 1), 10000)

      return () => clearTimeout(timeout)
    }
  }, [reports, dismiss])

  const alerts = useMemo(() => reports.map((r, i) => (
    <Alert className='relative min-w-sm max-w-md' icon={<span className='material-symbols-outlined text-white'>{r.status === 'success' ? 'check' : r.status}</span>} status={r.status ?? 'info'} key={i}>
      <div className='w-full flex-row justify-between gap-2 text-white'>
        <h3 className='text-lg font-bold text-white wrap'>{r.header ?? defaultHeaders[r.status ?? 'info']}</h3>
        <h4 className='text-white whitespace-break-spaces'>{r.message}</h4>
      </div>

      <Button size='sm' color='ghost' shape='circle' className='absolute right-2 top-2' onClick={() => dismiss(i)}>X</Button>
    </Alert>
  )), [reports, dismiss])

  return (
    <ReporterContext.Provider value={{ reports, dispatch }}>
      <Toast className='z-40' horizontal='start' vertical='bottom'>
        {alerts}
      </Toast>

      {props.children}
    </ReporterContext.Provider>
  )
}

export default Reporter
