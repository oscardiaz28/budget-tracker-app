"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const updateCurrency = async (currency: string) => {
    const user = await currentUser()
    if(!user) redirect("/sign-in")

    const userSettings = await prisma.userSettings.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            currency: currency
        },
        update: {
            currency: currency
        }
    })
    return currency;
}