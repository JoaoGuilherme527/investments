import React, {useEffect, useLayoutEffect, useState} from "react"
interface FundData {
    fundName: string
    currentPrice: string
    dividendYield: string
    priceChange: string
}

const useFetchFundsData = () => {
    const [funds, setFunds] = useState<FundData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:4000/ranking")
                const data = await response.json()

                setFunds(data)
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

const FundsTable: React.FC = () => {
    const {funds, loading, error} = useFetchFundsData()

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <table>
            <thead>
                <tr>
                    <th>Fundos</th>
                    <th>Preço Atual (R$)</th>
                    <th>Dividend Yield</th>
                    <th>Variação Preço</th>
                </tr>
            </thead>
            <tbody>
                {funds.map((fund, index) => (
                    <tr key={index}>
                        <td>{fund.fundName}</td>
                        <td>{fund.currentPrice}</td>
                        <td>{fund.dividendYield}</td>
                        <td>{fund.priceChange}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default FundsTable
