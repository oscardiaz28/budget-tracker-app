import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TransactionType } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleOff, Loader2, PlusIcon, PlusSquare } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateCategorySchema, CreateCategoryValues } from '../../../../schema/categories'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '../_actions/categories'
import { toast } from 'sonner'
import { Category } from '@prisma/client'


function CreateCategoryDialog({ type, manager }: { type: TransactionType, manager?: boolean }) {

    const formRef = useRef<HTMLFormElement>(null)
    const [open, setOpen] = useState(false)
    const [openEmojiModal, setOpenEmojiModal] = useState(false)
    const queryClient = useQueryClient()

    const { handleSubmit, register, control, setValue, reset, watch, formState: { errors } } = useForm<CreateCategoryValues>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            icon: '',
            type,
            name: ''
        }
    })

    const handleEmoji = (emoji: string) => {
        setValue("icon", emoji)
        setOpenEmojiModal(false)
    }

    const onSubmit = async (data: CreateCategoryValues) => {
        toast.loading("Creando categoria...", {
            id: "create-category"
        })
        mutation.mutate(data)
    }

    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: async (data: Category) => {
            toast.success(`Categoria ${data.name} creada exitosamente`, {
                id: "create-category"
            })
            await queryClient.invalidateQueries({ queryKey: ["categories"] })
            setOpen((prev) => !prev)
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: "create-category"
            })
        }
    })

    useEffect(() => {
        return () => {
            reset()
            setOpenEmojiModal(false)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {manager ? (
                    <Button className='flex border-separate items-center justify-start rounded-md px-3 py-3 ' >
                        <PlusSquare />
                        Crear nuevo
                    </Button>
                ) : (
                    <Button variant={"ghost"} className='flex border-separate border-b items-center justify-start rounded-none px-3 py-3 text-muted-foreground' >
                        <PlusSquare />
                        Crear nuevo
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Crear
                        category
                        de
                        <span className={`m-1 ${type == "income" ? "text-emerald-500" : "text-rose-500"}`}>
                            {type == "income" ? "ingresos" : "gastos"}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        Las categorías se utilizan para agrupar tus transacciones
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} className='space-y-4 mt-5'>
                    <Field className='flex flex-col gap-4'>
                        <Label>Nombre</Label>
                        <Input {...register("name")} aria-invalid={errors.name !== undefined} />
                        <FieldDescription>
                            Nombre de la categoría que aparecerá en la app
                        </FieldDescription>
                        {errors.name && <span className='text-sm text-rose-500'>{errors.name.message}</span>}
                    </Field>
                    <div className='flex flex-col gap-4'>
                        <Label>Icono</Label>
                        <Button
                            type='button'
                            onClick={() => setOpenEmojiModal(true)}
                            variant={"outline"} className='h-25 w-full'>
                            { watch("icon") ? (
                                <div className='flex flex-col items-center gap-2'>
                                    <span className='text-4xl'>
                                        {watch("icon")}
                                    </span>
                                    <p className='text-xs text-mute-foreground'>Click para cambiar</p>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center gap-2'>
                                    <CircleOff className='size-10' />
                                    <p className='text-xs text-mute-foreground'>Click para seleccionar</p>
                                </div>
                            )}
                        </Button>
                        {openEmojiModal && (
                            <div className='fixed inset-0 bg-background/25 flex items-start justify-center z-50 h-screen'>
                                <EmojiPicker
                                    theme={Theme.DARK}
                                    open={openEmojiModal}
                                    onEmojiClick={(data) => handleEmoji(data.emoji)}
                                    skinTonesDisabled={true}
                                    emojiStyle={EmojiStyle.APPLE}
                                />
                            </div>
                        )}
                        <FieldDescription>
                            Así es como aparecerá tu categoría en la app
                        </FieldDescription>
                    </div>
                    <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-end mt-6'>
                        <Button
                            onClick={() => {
                                reset()
                                setOpen(false)
                            }}
                            type='button'
                            className='' variant={"secondary"} >Cancelar</Button>
                        <Button
                            disabled={mutation.isPending}
                            onClick={handleSubmit(onSubmit)} >
                            {mutation.isPending ? (<Loader2 className='animate-spin' />) : "Crear"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )

}

export default CreateCategoryDialog