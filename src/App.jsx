import { useState, useEffect } from 'react'

const maxCount = 1000


// Do not use in production !!!
Array.prototype.searchWord = function(word) {
    if (typeof word !== "string") {
        return;
    }

    const results = this.filter(value => {
        const normalized = value.substring(0, word.length)
        return normalized === word
    })

    if (results) {
        const [ found ] = results

        return found
    }
}

function App() {
    const [ state, setState ] = useState({
        word: "",
        search: ""
    })

    useEffect(() => {
        state.word && console.log("Updated!")
    })

    const updateWord = (word = "") => {
        setState(prevState => {
            return { ...prevState, word }
        })
    }

    const fetchWord = (search = "") => {

        const baseUrl = "https://random-word-form.herokuapp.com/random/noun"
        const [ firstLetter ] = search.split("")

        const endpoint = search ? `/${firstLetter}` : ""
        const countParam = `?count=${maxCount}`

        const url = `${baseUrl}${endpoint}${countParam}`

        fetch(url)
            .then(
                response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else {
                        throw new Error("Request failed.")
                    }
                }
            )
            .then(json => {
                if (Array.isArray(json)) {
                    if (search) {
                        const word = json.searchWord(search)
                        if (word) {
                            updateWord(word)
                        }
                        else {
                            updateWord()
                        }
                    }
                    else {
                        const [ word ] = json
                        updateWord(word)
                    }
                }
                else {
                    throw new Error(`Expected array. Got: ${typeof json}`)
                }
            })
            .catch(e => console.error(e.toString()))
    }


    const updateSearch = (search) => {
        if (typeof search === "string") {
            setState(prevState => {
                return { ...prevState, search }
            })
        }
        else {
            throw new Error("Expected search to be string.")
        }
    }

    return (
        <div>
            <h1>Random word</h1>
            <input 
                type="text"
                placeholder="Click 'Get' to get random word."
                value={ typeof state.word === "string" ? state.word : "" }
                readOnly
            />
            <label>
                { "Search word: " }
                <input
                    type="text"
                    placeholder="Hello"
                    value={ typeof state.search === "string" ? state.search : "" }
                    onInput={ e => updateSearch(e.target.value) }
                />
            </label>
            <button onClick={ e => fetchWord(state.search) }>Search</button>
        </div>
    )
}


export default App
