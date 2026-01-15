"use client";

import { Button } from '@/components/ui/button'
import CreateTransactionDialog from './_components/CreateTransactionDialog'
import Overview from './_components/Overview'
import History from './_components/History'
import { useDashboard } from '@/components/hooks/useDashboard';

const page = async () => {

    const { firstName, userSettings } = useDashboard()

    return (
        <div className='w-full bg-background'>

            <div className='border-b bg-card'>
                <div className='container mx-auto flex flex-wrap items-center justify-between gap-6 py-8 px-5 md:px-8'>
                    <p className='font-bold text-2xl'>Hola, {firstName}! 👋</p>
                    <div className='flex items-center justify-center gap-3'>
                        <CreateTransactionDialog type='income'>
                            <Button
                                className='border border-emerald-500 bg-emerald-950 
                        text-white hover:bg-emerald-700 hover:text-white cursor-pointer'
                            >
                                Nuevo Ingreso
                            </Button>
                        </CreateTransactionDialog>
                        <CreateTransactionDialog type='expense'>
                            <Button
                                className='border border-rose-500 bg-rose-950 
                            text-white hover:bg-rose-700 hover:text-white cursor-pointer'
                            >
                                Nuevo Gasto
                            </Button>
                        </CreateTransactionDialog>
                    </div>
                </div>
            </div>

            <Overview userSettings={userSettings} />

            <History userSettings={userSettings} />

        </div>
    )

}

export default page