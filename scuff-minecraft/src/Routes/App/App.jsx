import { useEffect, useRef, useState } from 'react'
import './App.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Playground from '../../Playground/Playground.js'

export default function App() {
    const CanvasRef = useRef()

    const [ errorMessage, setErrorMessage ] = useState(null)

    function onErrorScreen(message) {
        setErrorMessage(() => message)
    }
    
    useEffect(() => {
        return Playground(CanvasRef.current, onErrorScreen)
    }, [])
    
    return <div className="App">
        <div className="error-screen" style={{ visibility: errorMessage ? 'visible' : 'hidden' }}>
            <header>
                <FontAwesomeIcon icon={faXmark} className='exit' onClick={() => setErrorMessage(() => null)}/>
                <div>An error has occured</div>
            </header>
            <code>{ errorMessage }</code>
        </div>
        <canvas ref={CanvasRef} onContextMenu={e => e.preventDefault()}></canvas>
    </div>
}