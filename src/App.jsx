import { useState, useEffect } from 'react'

import Word from './components/Word'
// used to cache words
import WordService from './services/WordService'

function App() {
    const [ services ] = useState({
        wordService: new WordService()
    })

    const [ state, setState ] = useState({
        error: null,
        loading: true
    })

    // Preconnect and cache words when mounted
    useEffect(() => {
        const load = async () => {
            const { success, dataIsValid } = await services.wordService.preconnect()
            if (success && dataIsValid) {
                services.wordService.cache()
                    .then(() => {
                        setState(prevState => {
                            return { ...prevState, loading: false }
                        })
                    })
                    .catch(e => {
                        setState(prevState => {
                            return { ...prevState, error: e.toString() }
                        })
                    })
            }
            else if (!success) {
                setState(prevState => {
                    return { ...prevState, error: "Connection was not successful." }
                })
            }
            else if (!dataIsValid) {
                setState(prevState => {
                    return { ...prevState, error: "Data from server is not valid" }
                })
            }
        }
        if (services.wordService) {
            load()
        }
    }, [services.wordService])
    
    if (!state.error) {
        if (state.loading) {
            return <p>Loading...</p>
        }
        else {
            return <Word wordService={services.wordService} />
        }
    }
    else {
        // Error occurred
        return (
            <div>
                <h3>Error</h3>
                <p>{state.error}</p>
            </div>
        )
    }
}


export default App
