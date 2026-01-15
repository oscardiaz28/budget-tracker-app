import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import React, { ReactNode } from 'react'

async function layout({ children } : { children: ReactNode }) {

    return (
        <div className='flex items-center justify-center h-screen w-full flex-col'>
            <div className='absolute top-5 right-5'>
                <SignOutButton>
                    <Button
                        className='cursor-pointer text-sm' variant={"ghost"}>
                        <LogOut />
                        Cerrar Sesión
                    </Button>
                </SignOutButton>
            </div>
            {children}
        </div>
    )
}

export default layout