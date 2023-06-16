import React, { useState } from 'react'
import "../Product/Search.css"
import MetaData from "../layout/MetaData"
const Search = ({ history }) => {
    const [keyword, setKeyword] = useState('')
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`/products/${keyword}`)
        }
        else {
            history.push(`/products`)
        }
    }
    return (
        <div>
            <MetaData title="Search A Product ......Ecommerce" />
            <form className='searchBox' onSubmit={searchSubmitHandler}>
                <input type="text" placeholder='Search a Product....' onChange={(e) => setKeyword(e.target.value)} value={keyword} />
                <input type="submit" value="Search" />
            </form>
        </div>
    )
}

export default Search
