import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import "./App.css"
import generateUniqueId from "./utils/generateUniqueId"
import Investment from "./types/types"

function App() {
    document.title = "Investments"

    const symbol = useRef<HTMLInputElement>(null)
    const quantity = useRef<HTMLInputElement>(null)
    const cost = useRef<HTMLInputElement>(null)

    const [totalCost, setTotalCost] = useState(0)
    const [totalActives, setTotalActives] = useState(0)

    const [editingItem, setEditingItem] = useState<Investment | null>(null)

    const [investmentsArray, setInvestmentsArray] = useState<Investment[]>([])
    //     [
    //     {id: generateUniqueId(), name: "HGCR11", amount: 103.14, qtd: 1},
    //     {id: generateUniqueId(), name: "KNSC11", amount: 46.1, qtd: 5},
    //     {id: generateUniqueId(), name: "MXRF11", amount: 60.42, qtd: 6},
    //     {id: generateUniqueId(), name: "VGHF11", amount: 44.4, qtd: 5},
    //     {id: generateUniqueId(), name: "VGIA11", amount: 27.03, qtd: 3},
    //     {id: generateUniqueId(), name: "VGIR11", amount: 40, qtd: 4},
    // ]

    const [renderList, setRenderList] = useState<any>()

    const formatToReal = (number: number) => {
        return number.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }

    function Item(data: Investment, index: number) {
        return (
            <tr key={data.id} style={{backgroundColor: index % 2 ? "#bdbdbd8d" : "#fff"}}>
                <td style={{fontWeight: 500}}>{data.name.toLocaleUpperCase()}</td>
                <td style={{fontWeight: 500}}>{data.qtd}</td>
                <td style={{fontWeight: 500}}>{formatToReal(data.amount)}</td>
                <td style={{width: "300px"}}>
                    {editingItem?.id === data.id ? (
                        <div style={{display: "flex", justifyContent: "space-evenly", gap: "10px"}}>
                            <button style={{width: "40%", fontSize: "16px"}} onClick={handleCancel}>
                                Cancel
                            </button>
                            <button
                                style={{width: "40%", fontSize: "16px", background: "red", color: "white"}}
                                onClick={() => DeleteItem(data.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => handleEdit(data)}>Edit</button>
                    )}
                </td>
            </tr>
        )
    }

    const handleEdit = (item: Investment) => {
        setEditingItem(item)
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
    }

    function AddItem() {
        let data: Investment = {
            id: generateUniqueId(),
            name: symbol.current?.value.toUpperCase() as string,
            qtd: Number(quantity.current?.value),
            amount: Number(cost.current?.value),
        }

        if (symbol.current && quantity.current && cost.current) {
            symbol.current.value = ""
            quantity.current.value = ""
            cost.current.value = ""
        }

        let itens = GetItens()
        if (itens) {
            let filterItens = itens.filter((item) => item.name === data.name)
            if (filterItens.length > 0) {
                let filteredItem = filterItens[0]
                let item: Investment = {
                    id: filteredItem.id,
                    name: filteredItem.name,
                    amount: filteredItem.amount + data.amount,
                    qtd: filteredItem.qtd + data.qtd,
                }
                let itensWithoutItem = itens.filter((_item) => _item.id !== filteredItem.id)
                itensWithoutItem.push(item)
                localStorage.setItem("investments", JSON.stringify(itensWithoutItem))
                setInvestmentsArray(itensWithoutItem)
            } else {
                itens.push(data)
            }
        } else {
            let saveItem = JSON.stringify([data])
            localStorage.setItem("investments", saveItem)
            setInvestmentsArray([data])
        }
    }

    function UpdateItem(data: Investment) {
        let itens = GetItens()
        if (itens) {
            let index = itens.findIndex((item) => item.id === data.id)
            itens[index] = data
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        RenderCardsValues()
        ReloadItens()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [investmentsArray])

    return (
        <div className="App">
            <header className="App-header">
                <div className="cards">
                    <div className="card">
                        <h4>Total Aplicado</h4>
                        <h1>{formatToReal(totalCost)}</h1>
                    </div>
                    <div className="card">
                        <h4>Ativos</h4>
                        <h1>{totalActives}</h1>
                    </div>
                </div>
                <div className="addInput">
                    <input type="text" placeholder="Symbol" ref={symbol} />
                    <input type="number" placeholder="Quantidade" ref={quantity} />
                    <input type="number" placeholder="Valor" ref={cost} />
                    <button onClick={AddItem}>Adicionar</button>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Ativos</th>
                                <th>Quantidade</th>
                                <th>Valor Aplicado</th>
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
