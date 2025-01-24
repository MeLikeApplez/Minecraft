import { useEffect, useRef, useState } from 'react'
import './App.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Playground from '../../Playground/Playground.js'
import Engine from '../../Engine/Engine.js'

export default function App() {
    const CanvasRef = useRef()

    const [ errorMessage, setErrorMessage ] = useState(null)
    const [ fps, setFPS ] = useState(0)
    const [ fpsIntervalUpdate, setFpsIntervalUpdate ] = useState(null)

    function onErrorScreen(message) {
        setErrorMessage(() => message)
    }

    /**
     * @param {Engine} Engine 
     */ 
    function onLoad(Engine) {
        clearInterval(fpsIntervalUpdate)
        setFPS(() => `${Engine.fps.toFixed(0)} FPS`)

        setFpsIntervalUpdate(() => {
            return setInterval(() => setFPS(() => `${Engine.fps.toFixed(0)} FPS`), 100)
        })
    }
    
    useEffect(() => {
        setErrorMessage(undefined)

        try {
            const Engine = Playground(CanvasRef.current, onLoad)
    
            return Engine.dispose.bind(Engine)
        } catch(error) {
            if(error instanceof Error) {
                onErrorScreen(error.stack)
            } else {
                onErrorScreen(String(error))
            }
        }
    }, [])
    
    return <div className="App">
        <div className="debug">
            <div className="fps">{ fps }</div>
        </div>
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