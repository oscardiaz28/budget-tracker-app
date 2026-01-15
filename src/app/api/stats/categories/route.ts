import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest ){ 

    const user = await currentUser()
    if(!user) redirect("/sign-in")    

    const transactions = await prisma.transaction.groupBy({
        by: ["type", "category", "categoryIcon"],
        where: { userId: user.id },
        _sum: {
            amount: true
        },
        orderBy: {
            _sum: {
                amount: 'desc'
            }
        }
    })
    return NextResponse.json(transactions)
}