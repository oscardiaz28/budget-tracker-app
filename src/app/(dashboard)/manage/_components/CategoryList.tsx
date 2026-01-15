"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionType } from '@/lib/types'
import { Loader2, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react'
import React, { ReactNode, useState } from 'react'
import CreateCategoryDialog from '../../_components/CreateCategoryDialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { deleteCategory } from '../../_actions/categories';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Category } from '@prisma/client';

function CategoryList({ type }: { type: TransactionType }) {

    const { data: categories = [], isLoading, isFetching, isError } = useQuery<Category[]>({
        queryKey: ["categories", type],
        queryFn: async () => {
            const res = await axios.get(`/api/categories?type=${type}`)
            return res.data
        },
        refetchOnWindowFocus: false
    })

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between gap-2'>
                        <div className="flex items-center gap-2 ">
                            {type == "expense" ? (
                                <TrendingDown
                                    className="size-12 items-center rounded-lg bg-rose-400/10 p-2 text-red-500"
                                />
                            ) : (
                                <TrendingUp
                                    className="size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500"
                                />
                            )}
                            <div className='flex flex-col gap-0'>
                                <p className='text-lg'> Categorias de <span>{type == "income" ? "Ingresos" : "Gastos"}</span></p>
                                <div className='text-sm text-muted-foreground'>
                                    Ordenados por nombre
                                </div>
                            </div>
                        </div>
                        <CreateCategoryDialog type={type} manager={true} />
                    </CardTitle>
                </CardHeader>
                <Separator />
                { ( isLoading || isFetching ) && (
                    <div className='px-2'>
                        <Skeleton className='h-30 w-full' />
                    </div>
                )}
                { !isLoading && !isFetching && categories.length == 0 && (
                    <div className='flex h-40 w-full flex-col items-center justify-center'>
                        <p>No <span>{type}</span> categories yet </p>
                        <p>Create one to get started</p>
                    </div>
                )}
                {!isLoading && !isFetching && categories.length > 0 && (
                    <div className='grid grid-flow-col gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {categories.map(category => (
                            <CategoryCard
                                type={type}
                                category={category}
                                key={category.name}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default CategoryList


function CategoryCard({ category, type }: { category: Category, type: TransactionType }) {

    return (
        <div className=''>
            <div className='flex flex-col items-center gap-2 p-4 border'>
                <span className='text-3xl'>{category.icon}</span>
                <span>{category.name}</span>
            </div>
            <DeleteCategoryDialog
                type={type}
                category={category}>
                <Button
                    variant={"secondary"} className='w-full flex items-center gap-2 text-muted-foreground border-separate rounded-none hover:bg-red-500/20'>
                    <TrashIcon className='size-4' />
                    Eliminar
                </Button>
            </DeleteCategoryDialog>

        </div>
    )
}

function DeleteCategoryDialog( { type, category, children }: { type: TransactionType, category: Category, children: ReactNode }) {

    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        mutation.mutate( { name: category.name, type: type  })
    }

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ( { name, type } : { name: string, type: TransactionType } ) => {
            return await deleteCategory(name, type)
        },
        onSuccess: async ( res ) => {
            console.log(res)
            await queryClient.invalidateQueries({queryKey: ["categories"]})
            toast.success("Categoria eliminada correctamente 🎉")
        },
        onError: () => {
            toast.error("Ha ocurrido un error")
        },
        onSettled: () => {
            setOpen(false)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Estas seguro de eliminar esta categoria?</DialogTitle>
                    <DialogDescription className='mt-2'>
                        Esta acción no puede deshacerse. Esto eliminará permanentemente tu categoría
                    </DialogDescription>
                </DialogHeader>
                <div className='flex items-center gap-2 mt-2'>
                    <Button
                        onClick={() => setOpen(false)}
                    >Cancelar</Button>
                    <Button 
                    disabled={mutation.isPending}
                    className='flex items-center gap-2'
                    onClick={() => handleDelete()}
                    variant={"destructive"} >
                        { mutation.isPending && <Loader2 className='animate-spin' /> }
                        Eliminar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}