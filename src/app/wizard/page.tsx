import CurrencySelect from '@/components/CurrencySelect'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

async function page() {

    const user = await currentUser()
    if (!user) {
        redirect("/sign-in")
    }

    return (
        <div className='container flex max-w-2xl flex-col items-center justify-between gap-4'>
            <div>
                <h1 className='text-center text-3xl'>Bienvenido, <span className='ml-2 font-bold'>{
                    user.firstName} 👋</span></h1>
                <h2 className='text-muted-foreground mt-4 text-center text-base'>Comencemos configurando su moneda</h2>

                <h3 className='mt-2 text-center text-sm text-muted-foreground'>
                    Puedes cambiar esta configuración en cualquier momento
                </h3>
            </div>
            <CurrencySelect />
        </div>
    )
}

export default page