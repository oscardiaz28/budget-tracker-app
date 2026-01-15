import React, { JSX, ReactNode, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { StatsData } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { getCurrencyFormatter } from '@/lib/helpers'
import { UserSettings } from '@prisma/client'

interface Props {
    userSettings: UserSettings
}

function StatsCard({ userSettings }: Props) {

    const { data, isLoading, isError } = useQuery<StatsData>({
        queryKey: ["overview", "stats"],
        queryFn: async () => {
            const res = await axios.get("/api/stats/balance")
            return res.data
        }
    })

    const formatter = useMemo(() => {
        return getCurrencyFormatter(userSettings.currency)
    }, [userSettings.currency])

    const expense = data?.expense || 0
    const income = data?.income || 0
    const balance = income - expense

    return (
        <div className=''>
            {(isLoading) ? (
                <SkeletonStats />
            ) : (
                <div className='flex flex-col gap-3 md:flex-row'>
                    <StatCard
                        formatter={formatter}
                        value={income}
                        title="Ingresos"
                        icon={ <TrendingUp className='size-12 items-center rounded-lg p-2 text-emerald-600 bg-emerald-400/10' /> }
                    />
                        <StatCard
                        formatter={formatter}
                        value={expense}
                        title="Gastos"
                        icon={ <TrendingDown className='size-12 items-center rounded-lg p-2 text-rose-600 bg-rose-400/10' /> }
                    />
                        <StatCard
                        formatter={formatter}
                        value={balance}
                        title="Balance"
                        icon={ <Wallet className='size-12 items-center rounded-lg p-2 text-violet-600 bg-violet-400/10' /> }
                    />
                </div>
            )}
        </div>
    )

}

export default StatsCard

interface StatCardProps {
    formatter: Intl.NumberFormat,
    value: number,
    title: string,
    icon: JSX.Element
}

function StatCard({ formatter, icon, title, value }: StatCardProps) {

    const formatFn = useCallback( (value: number) => {
        return formatter.format(value)
    }, [formatter])

    return (
        <Card className='flex flex-row h-24 w-full items-center gap-3 p-4'>
            {icon}
            <div className='flex flex-col items-start gap-0'>
                <p className='text-muted-foreground'>{title}</p>
                <p className='text-lg font-medium'>{formatFn(value)}</p>
            </div>
        </Card>
    )
}

function SkeletonStats() {
    return (
        <div className='flex flex-col gap-3 md:flex-row'>
            <Skeleton className='h-24 p-4 w-full' />
            <Skeleton className='h-24 p-4 w-full' />
            <Skeleton className='h-24 p-4 w-full' />
        </div>
    )
}
