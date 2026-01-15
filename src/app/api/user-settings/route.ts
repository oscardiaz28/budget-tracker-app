import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest ){
    const user = await currentUser()
    if(!user) redirect("/sign-in")

    const userSettings = await prisma.userSettings.findUnique({
        where: { userId: user.id }
    })
    if(!userSettings){
        return NextResponse.json({message: "User doesn't have settings"})
    }
    return NextResponse.json(userSettings)
}