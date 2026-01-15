import { CardContent } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CurrencySelector } from "./CurrencySelector"

export default async function CurrencyWrapper() {

    const user = await currentUser()
    if (!user) redirect("/sign-in")
    const userSettings = await prisma.userSettings.findFirst({
        where: { userId: user.id }
    })
    if (!userSettings) redirect("/wizard")

    return (
        <CardContent>
            <CurrencySelector currency={userSettings.currency} />
        </CardContent>
    )

}