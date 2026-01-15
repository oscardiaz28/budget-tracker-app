export type TransactionType = "income" | "expense"

export interface StatsData {
    expense: number,
    income: number
}

export type Timeframe = "month" | "year"

export type Period = {
    year: number,
    month: number
}


export type HistoryData = {
    year: number,
    month: number,
    expense: number,
    income: number,
    day?: number
}