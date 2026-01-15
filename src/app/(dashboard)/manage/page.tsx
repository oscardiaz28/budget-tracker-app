import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CategoryList from "./_components/CategoryList";
import CurrencyWrapper from "./_components/CurrencyWrapper";
import { Suspense } from "react";

async function page() {

    return (
        <div>
            
            <div className="border-b bg-card">
                <div className="container mx-auto px-5 md:px-8 py-8">
                    <div className="">
                        <p className="font-bold text-2xl">Configuración</p>
                        <p className="text-muted-foreground">Gestiona la configuración y las categorías de tu cuenta</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-4 flex flex-col gap-4">

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Moneda</CardTitle>
                        <CardDescription>Establece tu moneda predeterminada para las transacciones</CardDescription>
                    </CardHeader>
                    <Suspense fallback={<div className="px-5 md:px-8"><Loader2 /></div>}>
                        <CurrencyWrapper />
                    </Suspense>
                </Card>

                <CategoryList type="income" />
                <CategoryList type="expense" />

            </div>

        </div>
    )
}


export default page