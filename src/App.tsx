/* eslint-disable react/style-prop-object */
import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import "./App.css"
import generateUniqueId from "./utils/generateUniqueId"
import {Investment, FundData} from "./types/types"
import Spinner from "react-bootstrap/Spinner"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
    document.title = "Investments"

    const symbol = useRef<HTMLInputElement>(null)
    const quantity = useRef<HTMLInputElement>(null)

    const [totalCost, setTotalCost] = useState(0)
    const [totalActives, setTotalActives] = useState(0)

    const [editingItem, setEditingItem] = useState<string | null>(null)

    const [investmentsArray, setInvestmentsArray] = useState<Investment[]>([])

    const [renderList, setRenderList] = useState<any>()
    const [valueApplied, setValueApplied] = useState<number>(0)
    const [valueAppliedTarget, setValueAppliedTarget] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isError, setIsError] = useState<string | null>(null)

    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleEditApplied = () => {
        setShow(false)
        localStorage.setItem("APPLIED", JSON.stringify(valueAppliedTarget))
        setValueApplied(valueAppliedTarget)
    }

    const formatToReal = (number: number) => {
        return number.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }

    function Item(data: Investment, index: number) {
        return (
            <tr key={data.id} style={{backgroundColor: index % 2 ? "#3337" : "#444"}}>
                <td style={{fontWeight: 500}}>{data.name.toLocaleUpperCase()}</td>
                <td style={{fontWeight: 500}}>{data.qtd}</td>
                <td style={{fontWeight: 500}}>{formatToReal(data.amountApplied)}</td>
                <td style={{fontWeight: 500, color: data.amountApplied > data.amount ? "#d44d4d" : "green"}}>
                    {formatToReal(data.amount)}
                </td>
                <td className={data.movement} style={{fontWeight: 500}}>
                    {data.dividend_yeld}
                </td>
                <td className={data.movement} style={{fontWeight: 500}}>
                    {data.percentage}%
                    {data.movement !== "" ? (
                        <span aria-hidden="true" className="u47KMb" style={{height: "12px", width: "12px", paddingLeft: "4px"}}>
                            <svg version="1.1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6,0.002L0 6.002 4.8 6.002 4.8 11.9996 7.2 11.9996 7.2 6.002 12 6.002z"></path>
                            </svg>
                        </span>
                    ) : (
                        <></>
                    )}
                </td>
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

    // async function Item(data: Investment, index: number) {
    //     let response = await fetch(`https://finances-six-blush.vercel.app/api/v1/quote/${data.name.toUpperCase() as string}`)
    //     let fund: FundData = await response.json()
    //     return (
    //         <tr key={data.id} style={{backgroundColor: index % 2 ? "#3337" : "#444"}}>
    //             <td style={{fontWeight: 500}}>{data.name.toLocaleUpperCase()}</td>
    //             <td style={{fontWeight: 500}}>{data.qtd}</td>
    //             <td style={{fontWeight: 500}}>{formatToReal(data.amount)}</td>
    //             <td style={{fontWeight: 500}}>{fund.price * data.qtd}</td>
    //             <td className={fund.price_movement.movement ? fund.price_movement.movement : ""} style={{fontWeight: 500}}>
    //                 {fund.price_movement.price}
    //             </td>
    //             <td className={fund.price_movement.movement ? fund.price_movement.movement : ""} style={{fontWeight: 500}}>
    //                 {fund.price_movement.percentage}%
    //                 {fund.price_movement.movement && fund.price_movement.movement as string !== "" ? (
    //                     <span aria-hidden="true" className="u47KMb" style={{height: "12px", width: "12px", paddingLeft: "4px"}}>
    //                         <svg version="1.1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    //                             <path d="M6,0.002L0 6.002 4.8 6.002 4.8 11.9996 7.2 11.9996 7.2 6.002 12 6.002z"></path>
    //                         </svg>
    //                     </span>
    //                 ) : (
    //                     <></>
    //                 )}
    //             </td>
    //             <td style={{width: "150px"}}>
    //                 {editingItem === data.id ? (
    //                     <div style={{display: "flex", justifyContent: "space-evenly", gap: "10px"}}>
    //                         <button onClick={handleCancel}>Cancel</button>
    //                         <button onClick={() => DeleteItem(data.id)}>Delete</button>
    //                     </div>
    //                 ) : (
    //                     <button onClick={() => handleEdit(data.id)}>Edit</button>
    //                 )}
    //             </td>
    //         </tr>
    //     )
    // }

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

    async function AddItem(param: any) {
        try {
            setIsLoading(true)

            fetch(`https://finances-six-blush.vercel.app/api/v1/quote/${param.fundo}`)
                .then(async (response) => {
                    return await response.json()
                })
                .then((fund: FundData) => {
                    const getId = generateUniqueId()
                    let getAppliedValueFromStorage: string | null | number = localStorage.getItem(param.fundo)
                    if (!getAppliedValueFromStorage) {
                        localStorage.setItem(param.fundo, JSON.stringify(fund.price * param.quantidade))
                        getAppliedValueFromStorage = fund.price * param.quantidade
                    }

                    let data: Investment = {
                        id: getId,
                        name: param.fundo,
                        qtd: param.quantidade,
                        dividend_yeld: fund.price_movement.price,
                        percentage: fund.price_movement.percentage,
                        amount: fund.price * param.quantidade,
                        amountApplied: Number(getAppliedValueFromStorage),
                        movement: fund.price_movement.movement ? fund.price_movement.movement : "",
                    }

                    if (symbol.current && quantity.current) {
                        symbol.current.value = ""
                        quantity.current.value = ""
                    }

                    let itens = GetItens()
                    if (itens) {
                        let filterItens = itens.filter((item) => item.name === data.name)
                        if (filterItens.length > 0) {
                            let filteredItem = filterItens[0]
                            let item: Investment = {
                                ...filteredItem,
                                amount: filteredItem.amount + data.amount,
                                qtd: filteredItem.qtd + data.qtd,
                            }
                            let itensWithoutItem = itens.filter((_item) => _item.id !== filteredItem.id)
                            itensWithoutItem.push(item)
                            localStorage.setItem("investments", JSON.stringify(itensWithoutItem))
                            setInvestmentsArray(itensWithoutItem)
                        } else {
                            itens.push(data)
                            localStorage.setItem("investments", JSON.stringify(itens))
                            setInvestmentsArray(itens)
                        }
                    } else {
                        let saveItem = JSON.stringify([data])
                        localStorage.setItem("investments", saveItem)
                        setInvestmentsArray([data])
                    }
                    RenderCardsValues()
                })
        } catch (error: any) {
            setIsError(error)
        } finally {
            setIsLoading(false)
        }
    }

    function ReloadItens() {
        setRenderList(RenderItens(investmentsArray))
    }

    function LoadScreen() {
        let itens = GetItens()
        if (itens) {
            for (const item of itens) {
                DeleteItem(item.id)
                setTimeout(() => {
                    AddItem({fundo: item.name, quantidade: item.qtd})
                }, 500)
            }
        }
    }

    function GetAppliedValue() {
        const value = localStorage.getItem("APPLIED")
        if (value) {
            setValueApplied(Number(value))
        } else {
            setValueApplied(0)
        }
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
        RenderCardsValues()
        LoadScreen()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        ReloadItens()
        GetAppliedValue()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [investmentsArray, editingItem, valueApplied])

    return (
        <div className="App">
            <header className="App-header">
                <div className="boxes">
                    <div className="box">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h4>Total Aplicado</h4>
                            <button onClick={handleShow}>
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3e/White_pencil.png" fluid />
                            </button>
                        </div>
                        <h1>{formatToReal(valueApplied)}</h1>
                        {/* <h1>R$ 3.390,36</h1> */}
                    </div>
                    <div className="box">
                        <h4>Investimento</h4>
                        <h1>{formatToReal(totalCost)}</h1>
                        {/* <h1>R$ 3.390,36</h1> */}
                    </div>
                    <div className="box">
                        <h4>Ativos</h4>
                        <h1>{totalActives}</h1>
                    </div>
                </div>
                <div className="addInput">
                    <input type="text" placeholder="Codigo" ref={symbol} />
                    <input type="number" placeholder="Quantidade" ref={quantity} />
                    <button
                        onClick={() => {
                            setIsLoading(true)
                            fetch(`https://finances-six-blush.vercel.app/api/v1/quote/${symbol.current?.value.toUpperCase() as string}`)
                                .then(async (response) => {
                                    return await response.json()
                                })
                                .then((fund: FundData) => {
                                    const value = localStorage.getItem("APPLIED")
                                    if (value) {
                                        const newValue = Number(value) + fund.price * Number(quantity.current?.value)
                                        localStorage.setItem("APPLIED", JSON.stringify(newValue))
                                        setValueApplied(newValue)
                                    } else {
                                        localStorage.setItem("APPLIED", JSON.stringify(fund.price * Number(quantity.current?.value)))
                                        setValueApplied(fund.price * Number(quantity.current?.value))
                                    }
                                    AddItem({
                                        fundo: symbol.current?.value.toUpperCase() as string,
                                        quantidade: Number(quantity.current?.value),
                                    })
                                })
                        }}
                    >
                        {isLoading ? <Spinner animation="border" variant="light" size="sm" /> : "Adicionar"}
                    </button>
                </div>
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>Ativos</th>
                                <th>Qtd</th>
                                <th>Aplicado</th>
                                <th>Investimento</th>
                                <th>Rend. de Div</th>
                                <th>Porcentagem</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>{renderList}</tbody>
                    </table>
                </div>
            </header>
            <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton style={{background: "#333", borderColor: "#222"}}>
                    <Modal.Title style={{color: "#ccc"}}>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{background: "#333"}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label style={{color: "#ccc"}}>Total Aplicado</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder=""
                                autoFocus
                                style={{color: "#ccc", background: "#333", outline: "none", borderColor: "#222"}}
                                onChange={(text) => {
                                    setValueAppliedTarget(Number(text.target.value))
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{background: "#333", borderColor: "#222"}}>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleEditApplied}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default App
