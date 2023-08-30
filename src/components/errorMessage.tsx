import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'


function ErrorMessage(props: { message: string }): h.JSX.Element | null {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false)
        }, 10000)
        return () => clearTimeout(timer)
    }, [])

    if (!props.message) return null
    if (!show) return null

    return (
        // <div className="absolute wcg-bottom-0 wcg-right-1 dark:wcg-text-white wcg-bg-red-500 wcg-p-4 wcg-rounded-lg wcg-mb-4 wcg-mr-4 wcg-text-sm">
        <div role="alert" className="absolute bottom-0 right-1 dark:text-white bg-red-500 p-4 rounded-lg mb-4 mr-4 text-sm max-w-sm">
            <b>An error occurred</b><br />
            {props.message}<br /><br />
            You can check the console for more details. (Ctrl+Shift+J)
        </div>
    )
}

export default ErrorMessage