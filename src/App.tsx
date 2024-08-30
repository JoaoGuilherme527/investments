import React, {useLayoutEffect, useState} from "react"
import "./App.css"
import generateUniqueId from "./utils/generateUniqueId"

function App() {
    const [investmentsArray, setInvestmentsArray] = useState()

    useLayoutEffect(() => {
        let id = generateUniqueId()
        console.debug({id})
    }, [])

    return (
        <div className="App">
            <header className="App-header"></header>
            <div></div>
            <div></div>
        </div>
    )
}

export default App
