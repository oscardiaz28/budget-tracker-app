"use client";

import { TransactionType } from '@/lib/types'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import CreateCategoryDialog from './CreateCategoryDialog';
import { Check } from 'lucide-react';
import { Category } from '@prisma/client';

function CategoryPicker({ type, onChange }: { type: TransactionType, onChange: (value: string) => void }) {

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const { data : categories = [], isLoading } = useQuery<Category[]>({
        queryKey: ["categories", type],
        queryFn: async () => {
            const res = await axios.get(`/api/categories?type=${type}`)
            return res.data
        }
    })
    const selectedCategory = categories.find( category => category.name === value )

    useEffect(() => {
        if(!value) return;
        onChange(value)
    }, [onChange, value])

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button variant="outline" role='combobox' aria-expanded={open} className='w-50 justify-between' >
                    { selectedCategory ? (
                        <CategoryRow category={selectedCategory} />
                    ) : (
                        "Selecciona categoria"
                    ) }
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-55 p-0'>
                <Command onSubmit={ (e) => e.preventDefault() } >
                    <CommandInput placeholder='Buscar categoria...' />
                    <CreateCategoryDialog type={type} />
                    <CommandEmpty>
                        <p>Categoria no encontrada</p>
                        <p className='text-xs text-muted-foreground'>
                            Tip: Crea una nueva categoria
                        </p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            { categories.map( category => (
                                <CommandItem
                                className='flex items-center justify-between'
                                key={category.name}
                                onSelect={ () => {
                                    setValue( category.name )
                                    setOpen( prev => !prev )
                                } }
                                >
                                    <CategoryRow category={category} />
                                    <Check 
                                    className={`mr-2 size-4 opacity-0 ${ value === category.name && "opacity-100" }`}
                                    />
                                </CommandItem>
                            ) ) }
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


function CategoryRow( { category }: { category : Category} ){
    return (
        <div className='flex items-center gap-2'>
            <span role='img'>{category.icon}</span>
            <span>{category.name}</span>
        </div>
    )
}

export default CategoryPicker