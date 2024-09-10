export interface Investment {
    id: string,
    qtd: number,
    name: string,
    amount: number
}


export interface FundData {
    fundName: string
    currentPrice: string
    dividendYield: string
    priceChange: string
}