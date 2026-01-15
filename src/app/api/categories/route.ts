import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest){
    const user = await currentUser()
    if(!user) redirect("/sign-in")
    
    const { searchParams } = new URL(req.url)
    const paramType = searchParams.get("type")

    const validator = z.enum(["income", "expense"])

    const parsed = validator.safeParse(paramType)
    if(!parsed.success){
        return NextResponse.json({ error: 'Invalid type param' }, { status: 400 })
    }
    const type = parsed.data
    const categories = await prisma.category.findMany({
        where: { userId: user.id, ...(type && { type } ) },
        orderBy: { name: "asc" }
    })
    return NextResponse.json(categories)
}