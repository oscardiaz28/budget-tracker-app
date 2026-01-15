"use client";

import { useContext } from "react";
import { DashboardContext } from "../providers/DashboardProvider";

export const useDashboard = () => {
    const context = useContext(DashboardContext)
    if(!context) throw new Error("hook must be used within DashboardProvider")
    return context;
}