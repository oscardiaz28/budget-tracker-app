"use client";

import { UserSettings } from "@prisma/client"
import { createContext, ReactNode, useContext, useState } from "react"

type DashboardContextType = {
    firstName: string | null,
    userSettings: UserSettings
}

export const DashboardContext = createContext<DashboardContextType | null>(null)

interface Props{
    firstName: string | null,
    userSettings: UserSettings,
    children: ReactNode
}

export const DashboardProvider = ( { firstName, userSettings, children  } : Props ) => {

    return (
        <DashboardContext.Provider value={ {firstName, userSettings} } >
            {children}
        </DashboardContext.Provider>
    )
}

