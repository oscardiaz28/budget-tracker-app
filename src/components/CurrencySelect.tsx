"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Currencies } from '@/lib/currencies'
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { updateCurrency } from '@/app/wizard/_actions/updateCurrency';
import { Separator } from './ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';


function CurrencySelect() {

    const handleChange = (currency: string) => {
        mutation.mutate(currency)
    }

    const mutation = useMutation({
        mutationFn: async (currency: string) => {
            await updateCurrency(currency)
        },
        onSuccess: () => {
            toast.success("Moneda establecida")
        },
        onError: () => {
            toast.error("Ha ocurrido un error")
        }
    })

    return (
        <>
            <Separator />
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Moneda</CardTitle>
                    <CardDescription>
                        Establece tu moneda predeterminada para las transacciones
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={handleChange}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Selecciona una moneda" />
                        </SelectTrigger>
                        <SelectContent className='w-full'>
                            {Currencies.map(currency => (
                                <SelectItem key={currency.label} value={currency.value}>
                                    {currency.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <Separator />
            <Button
                disabled={mutation.isPending}
                className='w-full'>
                { mutation.isPending ? (
                    <>
                        <Loader2 className='animate-spin size-5' />
                    </>
                ) : (
                    <Link href={"/"} className='block w-full'>
                        Finalizado. Ir a dashboard
                    </Link>
                )}
            </Button>
        </>
    )
}
export default CurrencySelect