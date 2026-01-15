import React, { ReactNode, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getCurrencyFormatter } from '@/lib/helpers'
import { TransactionType } from '@/lib/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { UserSettings } from '@prisma/client'

type CategoriesStatsData = {
    category: string,
    categoryIcon: string,
    type: TransactionType,
    _sum?: {
        amount: number
    }
}

interface Props {
    userSettings: UserSettings
}

function CategoriesStats({ userSettings }: Props) {

    const { data = [], isLoading, isError } = useQuery<CategoriesStatsData[]>({
        queryKey: ["overview", "stats", "categories"],
        queryFn: async () => {
            const res = await axios.get("/api/stats/categories")
            return res.data
        }
    })

    const formatter = useMemo(() => {
        return getCurrencyFormatter(userSettings.currency)
    }, [userSettings.currency])


    return (
        <div className='flex flex-col gap-3 md:flex-row'>
            {isLoading ? (
                <SkeletonWrapper />
            ) : (
                <>
                    <CategoriesCard
                        formatter={formatter}
                        type="income"
                        data={data || []}
                    />
                    <CategoriesCard
                        formatter={formatter}
                        type="expense"
                        data={data || []}
                    />
                </>
            )}

        </div>
    )
}

function SkeletonWrapper() {
    return (
        <>
            <Skeleton className='h-80 w-full mt-3' />
            <Skeleton className='h-80 w-full mt-3' />
        </>
    )
}


interface CategoriesCardProps {
    formatter: Intl.NumberFormat,
    type: TransactionType,
    data: CategoriesStatsData[]
}

function CategoriesCard({ data, formatter, type }: CategoriesCardProps) {

    const filteredData = data.filter(el => el.type == type)
    const total = filteredData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0)

    return (
        <Card className='h-80 w-full mt-3 '>
            <CardHeader>
                <CardTitle className='text-muted-foreground text-3xl'>
                    {type === "income" ? "Ingresos" : "Gastos"} por categoria
                </CardTitle>
            </CardHeader>
            <div className='flex items-center justify-between gap-2 overflow-hidden'>
                {filteredData.length == 0 && (
                    <div className='flex h-60 w-full flex-col items-center justify-center text-muted-foreground'>
                        No se encontraron datos
                        <p>Intenta agregando nuevos {" "} {type == "income" ? "ingresos" : "gastos"} </p>
                    </div>
                )}
                {filteredData.length > 0 && (
                    <ScrollArea className='h-60 w-full px-4'>
                        <div className='flex w-full flex-col gap-4 p-4'>
                            {filteredData.map((item, idx) => {
                                const amount = item._sum?.amount || 0
                                const percentage = (amount * 100) / (total || amount)
                                return (
                                    <div key={idx} className='flex flex-col gap-3'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-3'>
                                                <span className=''>{item.categoryIcon} {item.category}</span>
                                                <span className='text-muted-foreground'>{`(${percentage.toFixed()}%)`}</span>
                                            </div>
                                            <span className=''>{formatter.format(amount)}</span>
                                        </div>
                                        <Progress
                                            value={percentage}
                                            indicator={type == "income" ? "bg-emerald-500" : "bg-rose-500"}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </Card>
    )
}

export default CategoriesStats