import { useState } from 'react'

import WordsList from './WordsList'

// Search and list search results
function Word({ wordService }) {
    const [words, setWords] = useState([])

    // Update search
    const inputEvent = (e) => {
        setWords(
            Array.from(wordService.search(e.target.value, 40))
        )
    }

    return (
        <div>
            <h1>Random Word Search</h1>
            <label>
                { "Search word: " }
                <input
                    type="text"
                    placeholder="love"
                    onInput={inputEvent}
                />
            </label>
            <WordsList words={words} />
        </div>
    )
}

export default Word