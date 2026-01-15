import prisma from "@/lib/prisma";
import { HistoryData, Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const historyDataSchema = z.object({
    timeframe: z.enum(["month", "year"]),
    month: z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().min(2000).max(3000)
})

export async function GET( req: NextRequest ){
    const user = await currentUser()
    if(!user) redirect("/sign-in")
    const { searchParams } = new URL(req.url)

    const timeframe = searchParams.get("timeframe")
    const year = searchParams.get("year")
    const month = searchParams.get("month")

    const parsed = historyDataSchema.safeParse({timeframe, year, month})
    if(!parsed.success){
        return NextResponse.json({message: "Something went wrong"}, { status: 400 })
    }

    const data = await getHistoryData(user.id, parsed.data.timeframe, { month: parsed.data.month, year: parsed.data.year } )

    return NextResponse.json(data)
}

async function getHistoryData(userId: string, timeframe: Timeframe, period : Period ) {
    switch( timeframe ){
        case "year":
            return await getYearHistoryData(userId, period.year);
        case "month":
            return await getMonthHistoryData(userId, period)
    }
}


const getYearHistoryData = async ( userId: string, year: number ) => {
    const result : any = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: { userId, year },
        _sum: { expense: true, income: true },
        orderBy: { month: "asc" }
    })
    if( !result || result.length == 0 ) return []

    const history : HistoryData[] = []
    for( let i = 0; i < 12; i++ ){
        let expense = 0;
        let income = 0;
        const month = result.find( ( row : any ) => row.month === i )
        if( month ){
            expense = month._sum.expense || 0
            income = month._sum.income || 0
        }
        history.push({
            year,
            month: i,
            expense,
            income
        })
    }
    return history;
}

const getMonthHistoryData = async (userId: string, period: Period) => {
    const result : any = await prisma.monthHistory.groupBy({
        by: ["day"],
        where:{ userId, year: period.year, month: period.month },
        _sum: { expense: true, income: true },
        orderBy: { day: "asc" }   
    })
    if( !result || result.length == 0 ) return []

    const history : HistoryData[] = []

    const daysInMonth = getDaysInMonth(new Date(period.year, period.month))
    for( let i = 0; i < daysInMonth; i++ ){
        let expense = 0;
        let income = 0;
        const day = result.find( (row: any) => row.day === i )
        if( day ){
            expense = day._sum?.expense || 0
            income = day._sum?.income || 0
        }
        history.push({
            expense,
            income,
            month: period.month,
            year: period.year,
            day: i
        })
    }
    return history;
}

const getDaysInMonth = (date: Date) => {    
    const year = date.getFullYear()
    const month = date.getMonth()
     return new Date(year, month + 1, 0).getDate()
}