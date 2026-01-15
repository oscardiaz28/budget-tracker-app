"use client";

import { updateCurrency } from "@/app/wizard/_actions/updateCurrency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Currencies } from "@/lib/currencies";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";


export function CurrencySelector( { currency } : { currency: string } ){

    const [currentCurrency, setCurrentCurrency] = useState(currency)
    const handleChange = ( val : string ) => {
        mutation.mutate(val)
        toast.loading("Actualizando moneda...", {
            id: "update-currency"
        })
    }

    const mutation = useMutation({
        mutationFn: async ( currency: string ) => {
            return await updateCurrency(currency)
        },
        onSuccess: ( value : string ) => {
            setCurrentCurrency(value)
            toast.success("Moneda actualizada", {
                id: "update-currency"
            })
        },
        onError: () => {
            toast.error("Ha ocurrido un error", {
                id: "update-currency"
            })
        }
    })

    return (
        <Select value={currentCurrency} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una moneda" />
            </SelectTrigger>
            <SelectContent>
                { Currencies.map( currency => (
                    <SelectItem value={currency.value} key={currency.label} >
                        {currency.label}
                    </SelectItem>
                ) ) } 
            </SelectContent>
        </Select>
    )
}