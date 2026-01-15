import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Period, Timeframe } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'

interface HistoryPeriodSelectorProps {
    period: Period,
    setPeriod: (period: Period) => void,
    timeframe: Timeframe,
    setTimeFrame: (timeframe: Timeframe) => void
}

function HistoryPeriodSelector({ period, setPeriod, setTimeFrame, timeframe }: HistoryPeriodSelectorProps) {

    const historyPeriods = useQuery<number[]>({
        queryKey: ["overview", "history", "periods"],
        queryFn: async () => {
            const res = await axios.get("/api/history-periods")
            return res.data
        }
    })

    return (
        <div className='flex flex-wrap items-center gap-4'>
            {historyPeriods.isLoading && (
                <>
                    <Skeleton className='w-22.5 h-9' />
                    <Skeleton className='w-32 h-9' />
                </>
            )}
            {!historyPeriods.isLoading && (
                <>
                    <Tabs value={timeframe} onValueChange={val => setTimeFrame(val as Timeframe)} >
                        <TabsList>
                            <TabsTrigger className='cursor-pointer' value='year'>Año</TabsTrigger>
                            <TabsTrigger className='cursor-pointer' value='month'>Mes</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className='flex flex-wrap items-center gap-2'>
                        <YearSelector
                            period={period}
                            setPeriod={setPeriod}
                            years={historyPeriods.data || []}
                        />
                        {timeframe == "month" && (
                            <MonthSelector
                                period={period}
                                setPeriod={setPeriod}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    )

}

interface MonthSelectorProps {
    period: Period,
    setPeriod: (period: Period) => void
}

function MonthSelector({ period, setPeriod }: MonthSelectorProps) {
    return (
        <Select value={period.month.toString()} onValueChange={(value) => setPeriod({
            year: period.year,
            month: parseInt(value)
        })} >
            <SelectTrigger className='w-45'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
                    const monthStr = new Date(period.year, month, 1).toLocaleString("default", {month: "long"})
                    return (
                        <SelectItem value={month.toString()} key={month} >
                            {monthStr}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}

interface YearSelectorProps {
    period: Period,
    setPeriod: (period: Period) => void,
    years: number[]
}

function YearSelector({ period, setPeriod, years }: YearSelectorProps) {
    return (
        <Select value={period.year.toString()} onValueChange={(value) => setPeriod({
            month: period.month,
            year: parseInt(value)
        })} >
            <SelectTrigger className='w-45'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {years.map(year => (
                    <SelectItem value={year.toString()} key={year} >{year}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default HistoryPeriodSelector