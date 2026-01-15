import Navbar from "@/components/Navbar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import prisma from "@/lib/prisma";
import { DashboardProvider } from "@/components/providers/DashboardProvider";

export default async function layout( {children} : { children : ReactNode } ){

    const user = await currentUser()
    if(!user) redirect("/sign-in")
    const userSettings = await prisma.userSettings.findFirst({
        where: { userId: user.id }  
    })
    console.log('exec on server: ')
    console.log(userSettings)
    if(!userSettings) {
        redirect("/wizard")
    }

    return (
        <div className="relateive w-full h-screen flex flex-col">
            <div className="w-full">
                <Navbar />
                <DashboardProvider userSettings={userSettings} firstName={user.firstName} >
                    {children}
                </DashboardProvider>
            </div>
        </div>
    )
}