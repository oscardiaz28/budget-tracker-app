import { PiggyBank } from 'lucide-react'
import React from 'react'

export const Logo = () => {

    return (
        <a href="/" className='flex items-center gap-2'>
            <PiggyBank className='stroke size-11 stroke-amber-500 stroke-[1.5]' />
            <p
                className='bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent'
            >MiBalance</p>
        </a>
    )

}


export const LogoMobile = () => {
    return (
        <a href="/" className='flex items-center gap-2'>
            <p
                className='bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent'
            >MiBalance</p>
        </a>
    )
}