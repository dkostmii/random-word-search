class SearchableArray extends Array {

    // Returns first found word
    searchWords(search) {
        if (typeof search !== "string") {
            throw new TypeError("Expected search to be string")
        }

        const results = this.filter(value => {
            const normalized = value.substring(0, search.length)
            return normalized === search
        })
        
        return results
    }

    // Returns first element
    first() {
        if (this.length > 0) {
            const [ f ] = this
            return f
        }
    }

    toString() {
        return Array.from(this).toString()
    }
}

export default SearchableArray