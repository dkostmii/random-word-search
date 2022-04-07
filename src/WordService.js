import SearchableArray from "./SearchableArray"

class WordService {
    constructor() {
        this.baseUrl = "https://random-word-form.herokuapp.com/random/noun"
        this.words = new SearchableArray()
        this.maxCount = 1000
    }


    async preconnect() {
        const state = {
            success: false,
            dataIsValid: false
        }

        await fetch(this.baseUrl)
            .then(
                response => {
                    if (response.ok) {
                        state.success = true
                        return response.json()
                    }
                    else {
                        throw new Error(`${this.toString()} Request failed. ${response.status}`)
                    }
                }
            )
            .then(json => {
                if (Array.isArray(json)) {
                    const searchableJson = SearchableArray.from(json)
                    if (searchableJson.every(word => typeof word === "string" && word.length > 0)) {
                        state.dataIsValid = true
                    }
                    else {
                        throw new TypeError(`${this.toString()} Expected array of words. Got: ${searchableJson}`)
                    }
                }
                else {
                    throw new TypeError(`${this.toString()} Expected array. Got: ${typeof json}`)
                }
            })
            .catch(e => console.error(e.toString()))

            return state
    }

    // get the ASCII alphabet
    alphabet() {
        const startCharCode = 97
        const alphabetSize = 24

        return new Array(alphabetSize)
            .fill()
            .map((_, id) => startCharCode + id)
            .map(code => String.fromCharCode(code))
    }

    isLetter(letter) {
        if (typeof letter !== "string") {
            throw new TypeError(`${this.toString()} Expected letter to be string`)
        }

        if (letter.length !== 1) {
            throw new TypeError(`${this.toString()} Expected letter to have exactly 1 characters`)
        }

        return this.alphabet().includes(letter)
    }

    async fetchByLetter(letter) {
        if (!this.isLetter(letter)) {
            throw new Error(`${this.toString()} Expected letter to be a letter`)
        }

        const url = `${this.baseUrl}/${letter}?count=${this.maxCount}`
        const result = [ ]

        return await fetch(url)
            .then(
                response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else {
                        throw new Error(`${this.toString()} Request failed. ${response.status}`)
                    }
                }
            )
            .then(json => {
                if (Array.isArray(json)) {
                    json.forEach(word => {
                        if (!this.words.includes(word)) {
                            result.push(word)
                        }
                    })

                    return result
                }
                else {
                    throw new TypeError(`${this.toString()} Expected array. Got: ${typeof json}`)
                }
            })
            .catch(e => console.error(e.toString()))
    }

    async cache() {
        const result = await Promise.all(this.alphabet().map(letter => this.fetchByLetter(letter)))
        if (Array.isArray(result) && result.length > 0) {
            this.words = SearchableArray.from(result.reduce((acc, val) => acc.concat(val)))
        }
        else {
            throw new TypeError(`${this.toString()} Unable to cache words.`)
        }
    }

    search(s, limit) {
        if (!["number", "undefined"].includes(typeof limit)) {
            throw new TypeError(`${this.toString()} Expected limit to be number or undefined. Got: ${typeof limit}`)
        }

        const result = this.words.searchWords(s)

        if (typeof limit === "number") {
            return result.slice(0, limit)
        }

        return result
    }

    toString() {
        return "[WordService]"
    }
}

export default WordService
