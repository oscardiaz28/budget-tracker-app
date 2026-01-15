"use client";

import { UserSettings } from "@prisma/client";
import CategoriesStats from "./CategoriesStats";
import StatsCard from "./StatsCard";

interface Props {
    userSettings: UserSettings
}

function Overview({ userSettings }: Props) {

    return (
        <div className="container mx-auto px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-2 py-6 ">
                <h2 className="text-3xl font-bold">Resumen</h2>
                <div>
                </div>
            </div>
            <StatsCard 
                userSettings={userSettings} 
            />
            <CategoriesStats 
                userSettings={userSettings}
            />
        </div>
    )
}

export default Overview