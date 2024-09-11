export interface Investment {
    id: string,
    qtd: number,
    name: string,
    amount: number,
    percentage: number,
    dividend_yeld: number,
    movement: "Up" | "Down" | ""
}

interface PriceMovement {
    price: number;
    percentage: number
    movement?: "Up" | "Down"
    date: string
}

export interface FundData {
    price: number
    price_movement: PriceMovement
}