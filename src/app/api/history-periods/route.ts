import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest ){ 
    const user = await currentUser()
    if(!user) redirect("/sign-in")

    const result = await prisma.monthHistory.findMany({
        where: { userId: user.id },
        select: { year: true },
        distinct: ["year"],
        orderBy: { year: "asc" }
    })
    if( !result ) return NextResponse.json([new Date().getFullYear()])
    const years = result.map( el => el.year )
    if( years.length == 0 ) {
        return NextResponse.json([new Date().getFullYear()])
    }
    return NextResponse.json(years)
}