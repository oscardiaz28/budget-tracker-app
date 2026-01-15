import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { deleteTransaction } from '../_actions/deleteTransaction'
import { Loader2 } from 'lucide-react'

interface Props{
    open: boolean,
    setOpen: ( state: boolean ) => void,
    transactionId: string | null,
    setTransactionId: ( id: string | null ) => void
}

function DeleteTransactionDialog( { open, setOpen, transactionId } : Props ) {

    const handleDelete = () => {
        if(!transactionId) return;
        mutation.mutate(transactionId)
    }

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ( id: string ) => {
            return await deleteTransaction(id)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["transactions"]})
            toast.success("Transacción eliminada 🎉")
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Estas seguro de eliminar esta transacción?</DialogTitle>
                    <DialogDescription className='mt-2'>
                        Esta acción no puede deshacerse. Esto eliminará permanentemente la transacción
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className='flex items-center justify-end gap-2'>
                        <Button
                        disabled={mutation.isPending}
                        onClick={ () => setOpen(false) }
                        >Cancelar</Button>
                        <Button 
                        className='flex items-center gap-2'
                        onClick={ () => handleDelete() }
                        variant={"destructive"}>
                            { mutation.isPending && <Loader2 className='animate-spin' /> }
                            Eliminar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

}

export default DeleteTransactionDialog