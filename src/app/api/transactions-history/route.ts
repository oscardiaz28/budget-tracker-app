import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const fetchTransactionsSchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
})

export async function GET( req : NextRequest ){
    const user = await currentUser()
    if(!user) redirect("/sign-in")

    const {searchParams} = new URL(req.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const parsed = fetchTransactionsSchema.safeParse({from, to})

    console.log("from")
    console.log(from)

    if(!parsed.success){
        return NextResponse.json({ message: "Ha ocurrido un error" }, {  status: 400 })
    }
    const transactions = await getTransactionsHistory( {userId: user.id, from: parsed.data.from, to: parsed.data.to } )
    return NextResponse.json(transactions)
}


async function getTransactionsHistory({ userId, from, to } : { userId: string, from: Date, to: Date } ){
    const transactions = await prisma.transaction.findMany({
        where: { userId, date: { gte: from, lte: to }  },
        orderBy: { date: "desc" } 
    })
    return transactions;
}