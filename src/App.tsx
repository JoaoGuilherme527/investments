import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import "./App.css"
import generateUniqueId from "./utils/generateUniqueId"
import {Investment, FundData} from "./types/types"
import {config, getJson} from "serpapi"

config.api_key = process.env.API_KEY as string

const useFetchFundsData = () => {
    const [funds, setFunds] = useState<FundData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(`https://conversify-wvae.onrender.com/ranking`)
                let json: FundData[] = await response.json()

                setFunds(json)
            } catch (err) {
                setError("Failed to fetch data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return {funds, loading, error}
}

function App() {
    document.title = "Investments"

    const symbol = useRef<HTMLInputElement>(null)
    const quantity = useRef<HTMLInputElement>(null)

    const [totalCost, setTotalCost] = useState(0)
    const [totalActives, setTotalActives] = useState(0)

    const [editingItem, setEditingItem] = useState<string | null>(null)

    const [investmentsArray, setInvestmentsArray] = useState<Investment[]>([])

    const [renderList, setRenderList] = useState<any>()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isError, setIsError] = useState<string | null>(null)

    const formatToReal = (number: number) => {
        return number.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }

    function Item(data: Investment, index: number) {
        return (
            <tr key={data.id} style={{backgroundColor: index % 2 ? "#333" : "#444"}}>
                <td style={{fontWeight: 500}}>{data.name.toLocaleUpperCase()}</td>
                <td style={{fontWeight: 500}}>{data.qtd}</td>
                <td style={{fontWeight: 500}}>{formatToReal(data.amount)}</td>
                <td style={{width: "150px"}}>
                    {editingItem === data.id ? (
                        <div style={{display: "flex", justifyContent: "space-evenly", gap: "10px"}}>
                            <button onClick={handleCancel}>Cancel</button>
                            <button onClick={() => DeleteItem(data.id)}>Delete</button>
                        </div>
                    ) : (
                        <button onClick={() => handleEdit(data.id)}>Edit</button>
                    )}
                </td>
            </tr>
        )
    }

    const handleEdit = (id: string) => {
        setEditingItem(id)
    }

    const handleCancel = () => {
        setEditingItem(null)
    }

    function RenderItens(datas: Investment[]) {
        return datas.map((data, index) => Item(data, index))
    }

    function GetItens(): Investment[] | undefined {
        let itens = localStorage.getItem("investments")

        if (itens) {
            let data = JSON.parse(itens)
            setInvestmentsArray(data)
            return data
        }
    }

    function DeleteItem(id: string) {
        let itens = GetItens()
        if (itens) {
            let filteredItens = itens.filter((item) => item.id !== id)
            localStorage.setItem("investments", JSON.stringify(filteredItens))
            setInvestmentsArray(filteredItens)
        }
        RenderCardsValues()
    }

    async function AddItem() {
        try {
            setIsLoading(true)

            // let data: Investment = {
            //     id: generateUniqueId(),
            //     name: symbol.current?.value.toUpperCase() as string,
            //     qtd: Number(quantity.current?.value),
            //     amount: Number(fund.currentPrice.replace(",", ".")) * Number(quantity.current?.value),
            // }

            // if (symbol.current && quantity.current) {
            //     symbol.current.value = ""
            //     quantity.current.value = ""
            // }

            // let itens = GetItens()
            // if (itens) {
            //     let filterItens = itens.filter((item) => item.name === data.name)
            //     if (filterItens.length > 0) {
            //         let filteredItem = filterItens[0]
            //         let item: Investment = {
            //             id: filteredItem.id,
            //             name: filteredItem.name,
            //             amount: filteredItem.amount + data.amount,
            //             qtd: filteredItem.qtd + data.qtd,
            //         }
            //         let itensWithoutItem = itens.filter((_item) => _item.id !== filteredItem.id)
            //         itensWithoutItem.push(item)
            //         localStorage.setItem("investments", JSON.stringify(itensWithoutItem))
            //         setInvestmentsArray(itensWithoutItem)
            //     } else {
            //         itens.push(data)
            //         localStorage.setItem("investments", JSON.stringify(itens))
            //         setInvestmentsArray(itens)
            //     }
            // } else {
            //     let saveItem = JSON.stringify([data])
            //     localStorage.setItem("investments", saveItem)
            //     setInvestmentsArray([data])
            // }
            // RenderCardsValues()
        } catch (error: any) {
            setIsError(error)
        } finally {
            setIsLoading(false)
        }
    }

    function ReloadItens() {
        setRenderList(RenderItens(investmentsArray))
    }

    function RenderCardsValues() {
        let itens = GetItens()
        if (itens) {
            let total = itens.reduce((acc, item) => acc + item.amount, 0)
            let totalQtd = itens.reduce((acc, item) => acc + item.qtd, 0)
            setTotalActives(totalQtd)
            setTotalCost(total)
        }
    }

    useLayoutEffect(() => {
        GetItens()
        RenderCardsValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        ReloadItens()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [investmentsArray, editingItem])

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>{isError}</p>

    return (
        <div className="App">
            <header className="App-header">
                <div className="cards">
                    <div className="card">
                        <h4>Total Aplicado</h4>
                        <h1>{formatToReal(totalCost)}</h1>
                        {/* <h1>R$ 3.390,36</h1> */}
                    </div>
                    <div className="card">
                        <h4>Ativos</h4>
                        <h1>{totalActives}</h1>
                    </div>
                </div>
                <div className="addInput">
                    <input type="text" placeholder="Codigo" ref={symbol} />
                    <input type="number" placeholder="Quantidade" ref={quantity} />
                    <button onClick={AddItem}>Adicionar</button>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Ativos</th>
                                <th>Qtd</th>
                                <th>Aplicado</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>{renderList}</tbody>
                    </table>
                </div>
            </header>
        </div>
    )
}

export default App
