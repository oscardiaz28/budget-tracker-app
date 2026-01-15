"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TransactionType } from '@/lib/types'
import React, { ReactNode, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTransactionSchema, CreateTransactionValues } from '../../../../schema/transaction';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import CategoryPicker from './CategoryPicker';
import { Label } from '@/components/ui/label';
import { createTransaction } from '../_actions/transactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { dateToUtcDate } from '@/lib/helpers';
import { date } from 'zod';

interface Props {
    children: ReactNode,
    type: TransactionType
}

function CreateTransactionDialog({ children, type }: Props) {

    const [open, setOpen] = useState(false)
    const currentDate = new Date().toISOString().split("T")[0]
    console.log(currentDate)
    const { handleSubmit, register, formState: { errors }, watch, reset, control, setValue } = useForm({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            description: '',
            type,
            date: currentDate,
            category: ''
        }
    })
    const queryClient = useQueryClient()

    const onSubmit = async (data: CreateTransactionValues) => {
        toast.loading("Creando transacción...", {
            id: "create-transaction"
        })
        createTransactionMutation.mutate(data)
    }

    const createTransactionMutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            toast.success("Transacción creada exitosamente 🎉", {
                id: "create-transaction"
            })
            reset({ type })
            setOpen(false)
            queryClient.invalidateQueries({queryKey: ["overview"]})
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: "create-transaction"
            })
        }
    })

    useEffect(() => {
        return () => {
            reset({ type, date: new Date().toISOString().split("T")[0]})
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Crea una <span className={`m-1 ${type == "income" ? "text-emerald-500" : "text-rose-500"}`}>nueva</span> transacción
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-5'>
                    <Field>
                        <Label>Descripción</Label>
                        <Input {...register("description")}
                            aria-invalid={errors.description != undefined}
                            autoComplete='off'
                        />
                        <FieldDescription>Descripción de la transacción (opcional)</FieldDescription>
                        {errors.description && <span className='text-sm text-rose-400'>{errors.description.message}</span>}
                    </Field>
                    <Field>
                        <Label>Monto</Label>
                        <Input {...register("amount")}
                            aria-invalid={errors.amount != undefined}
                            autoComplete='off'
                            type='number'
                            step={"0.01"}
                        />
                        <FieldDescription>Monto de la transacción (requerido)</FieldDescription>
                        {errors.amount && <span className='text-sm text-rose-400'>{errors.amount.message}</span>}
                    </Field>
                    <div className='flex items-center justify-between gap-5'>
                        <Controller
                            name='category'
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Categoria</FieldLabel>
                                    <CategoryPicker
                                        type={type}
                                        onChange={(value: string) => {
                                            console.log(value)
                                            field.onChange(value)
                                            // setValue("category", value)
                                        }}
                                    />
                                    <FieldDescription>Selecciona una categoria para esta transacción</FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <FieldLabel>Fecha de Transacción</FieldLabel>
                            <Input type='date' {...register("date")} />
                            <FieldDescription>Selecciona una fecha para esta transacción</FieldDescription>
                        </Field>

                    </div>
                    <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-end mt-4'>
                        <Button
                            className='bg-secondary text-white hover:bg-secondary'
                            type='button' onClick={() => {
                                setOpen(false)
                                reset()
                            }} >Cancel</Button>
                        <Button
                            disabled={createTransactionMutation.isPending}
                            type='submit'>
                                { createTransactionMutation.isPending ? (
                                    <span><Loader2 className='animate-spin size-5' /></span>
                                ) : (
                                    <>Crear </>
                                ) }
                            </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default CreateTransactionDialog