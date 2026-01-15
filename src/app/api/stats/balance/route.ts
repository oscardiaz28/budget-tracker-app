import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req : NextRequest ){
    const user = await currentUser()
    if(!user) redirect("/sign-in")

    const stats = await getBalanceStats(user.id)
    return NextResponse.json(stats)
}

async function getBalanceStats( userId: string ){
    const totals = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            userId
        },
        _sum: {
            amount: true
        }
    })
    return {
        expense: totals.find( t => t.type === "expense" )?._sum.amount || 0,
        income: totals.find( t => t.type === "income" )?._sum.amount || 0
    }
}