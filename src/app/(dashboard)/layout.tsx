import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
export default async function layout( {children} : { children : ReactNode } ){

    return (
        <div className="relateive w-full h-screen flex flex-col">
            <div className="w-full">
                <Navbar />
                {children}
            </div>
        </div>
    )
}