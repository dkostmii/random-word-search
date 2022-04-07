function WordsList({ words }) {
    if (Array.isArray(words) && words.length > 0) {
        return (
            <div>
                <h4>Found {words.length} words:</h4>
                <div>
                    { words
                        .map((word, id) => <p key={id}><span>{ word }</span></p>) }
                </div>
            </div>
            
        )
    }
    else {
        return (
            <h3>Let's find some words!</h3>
        )
    }
    
}

export default WordsList