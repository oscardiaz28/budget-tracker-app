"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { Period, Timeframe } from '@/lib/types';
import { getCurrencyFormatter } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HistoryPeriodSelector from './HistoryPeriodSelector';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { UserSettings } from '@prisma/client';

interface Props {
    userSettings: UserSettings
}

function History({ userSettings }: Props) {

    const [timeframe, setTimeFrame] = useState<Timeframe>("month")
    const [period, setPeriod] = useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    })

    const formatter = useMemo(() => {
        return getCurrencyFormatter(userSettings.currency)
    }, [userSettings.currency])

    const { data = [], isLoading } = useQuery({
        queryKey: ["overview", "history", timeframe, period],
        queryFn: async () => {
            const res = await axios.get(`/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`)
            return res.data
        },
        refetchOnWindowFocus: false
    })
    const dataAvailable = data && data.length > 0

    return (
        <div className="container mx-auto px-5 md:px-8 pb-10">
            <h2 className='py-6 text-3xl font-bold'>Historial</h2>
            <Card className='mt-2 full'>
                <CardHeader>
                    <CardTitle className='grid grid-flow-row justify-between gap-2 md:grid-flow-col'>
                        <HistoryPeriodSelector
                            period={period}
                            setPeriod={setPeriod}
                            timeframe={timeframe}
                            setTimeFrame={setTimeFrame}
                        />
                        <div className='flex h-10 gap-2'>
                            <Badge className='flex items-center gap-2 text-sm' variant={"outline"}>
                                <div className='size-4 rounded-full bg-emerald-500'></div>
                                Ingresos
                            </Badge>
                            <Badge className='flex items-center gap-2 text-sm' variant={"outline"}>
                                <div className='size-4 rounded-full bg-rose-500'></div>
                                Gastos
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div>
                            <Loader2 className='animate-spin' />
                        </div>
                    )}
                    {!isLoading && !dataAvailable && (
                        <Card className='h-75 flex flex-col items-center justify-center bg-background'>
                            <div className='flex items-center justify-center flex-col gap-2'>
                                <p>No hay datos para el periodo seleccionado</p>
                                <p className='text-muted-foreground text-sm'>
                                    Prueba a seleccionar un periodo diferente o añadir nuevas transacciones
                                </p>
                            </div>
                        </Card>
                    )}
                    {!isLoading && dataAvailable && (
                        <ResponsiveContainer width={"100%"} height={300}>
                            <BarChart height={300} data={data} barCategoryGap={5} >
                                <defs>
                                    <linearGradient
                                        id='incomeBar' x1="0" y1="0" x2="0" y2="1"
                                    >
                                        <stop
                                            offset={"0"}
                                            stopColor='#10b981'
                                            stopOpacity={"1"}
                                        />
                                        <stop
                                            offset={"1"}
                                            stopColor='#10b981'
                                            stopOpacity={"0"}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id='expenseBar' x1="0" y1="0" x2="0" y2="1"
                                    >
                                        <stop
                                            offset={"0"}
                                            stopColor='#ef4444'
                                            stopOpacity={"1"}
                                        />
                                        <stop
                                            offset={"1"}
                                            stopColor='#ef4444'
                                            stopOpacity={"0"}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="5 5"
                                    strokeOpacity={"0.2"}
                                    vertical={false}
                                />
                                <XAxis 
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                padding={{left: 5, right: 5}}
                                dataKey={ data => {
                                    const {year, month, day} = data
                                    const date = new Date(year, month, day || 1)
                                    if( timeframe == "year" ){
                                        return date.toLocaleDateString("default", {month: "long"})
                                    }
                                    return date.toLocaleDateString("default", {day: "2-digit"})
                                } }
                                />
                                <YAxis 
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Bar 
                                    dataKey={"income"}
                                    fill='url(#incomeBar)'
                                    radius={4}
                                    className='cursor-pointer'
                                />
                                <Bar 
                                    dataKey={"expense"}
                                    fill='url(#expenseBar)'
                                    radius={4}
                                    className='cursor-pointer'
                                />
                                <Tooltip cursor={ {opacity: 0.1} } content={ props => (
                                    <CustomTooltip formatter={formatter} {...props} />
                                ) } />
                            </BarChart>
                        </ResponsiveContainer>
                    )}  
                </CardContent>
            </Card>
        </div>
    )

}

function CustomTooltip( { active, payload, formatter } : any ){
    if( !active || !payload || payload.length == 0 ) return null;

    const data = payload[0].payload
    const {expense, income} = data
    const balance = income - expense

    return (
        <div className='min-w-75 rounded border bg-background p-4 space-y-1'>
            <TooltipRow formatter={formatter} label="Ingresos" value={income} bgColor="bg-emerald-500" textColor="text-emerald-500"  /> 
            <TooltipRow formatter={formatter} label="Gastos" value={expense} bgColor="bg-red-500" textColor="text-red-500"  /> 
            <TooltipRow formatter={formatter} label="Balance" value={balance} bgColor="bg-white" textColor="text-white"  /> 
        </div> 
    )    
}

interface TooltipRowProps{
    formatter: Intl.NumberFormat,
    label: string,
    value: number,
    bgColor: string,
    textColor: string
}

function TooltipRow( { bgColor, formatter, label, textColor, value } : TooltipRowProps ){
    return (
        <div className='flex items-center gap-2'>
            <div className={`size-4 rounded-full ${bgColor}`}></div>
            <div className='flex w-full justify-between'>
                <p className='text-sm text-muted-foreground'>{label}</p>
                <p className={`text-sm font-bold ${textColor}`}>{formatter.format(value)}</p>
            </div>
        </div>
    )
}
export default History