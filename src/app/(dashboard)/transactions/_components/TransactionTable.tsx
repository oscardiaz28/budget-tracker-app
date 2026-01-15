"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { dateToUtcDate, formatDate } from "@/lib/helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import { useState } from "react";
import { Transaction } from "@prisma/client";

export function TransactionTable({ from, to }: { from: Date, to: Date }) {

    const { data: transactions = [], isLoading, isError } = useQuery<Transaction[]>({
        queryKey: ["transactions", "history", from, to],
        queryFn: async () => {
            const res = await axios.get(`/api/transactions-history?from=${dateToUtcDate(from)}&to=${dateToUtcDate(to)}`)
            return res.data
        },
        refetchOnWindowFocus: false
    })
    const [openDialog, setOpenDialog] = useState(false)
    const [transactionId, setTransactionId] = useState<string | null>(null)

    console.log(transactions)

    return (
        <div className="mt-6 rounded-sm pb-12">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-base text-muted-foreground py-3">Category</TableHead>
                        <TableHead className="text-base text-muted-foreground py-3">Description</TableHead>
                        <TableHead className="text-base text-muted-foreground py-3">Date</TableHead>
                        <TableHead className="text-base text-muted-foreground py-3">Type</TableHead>
                        <TableHead className="text-base text-muted-foreground py-3">Amount</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="w-full py-8">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : transactions.length == 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                <p>No hay transacciones en esta fecha</p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map(transaction => (
                            <TableRow key={transaction.id} >
                                <TableCell>
                                    <div className="table-cell text-base">
                                        {transaction.category}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="table-cell text-base">
                                        {transaction.description}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="table-cell text-base">
                                        {formatDate(transaction.date)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="table-cell">
                                        <p className={`py-2 px-4 rounded-sm font-medium ${transaction.type == "income" ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"}`}>
                                            {transaction.type == "income" ? "Ingreso" : "Gasto"}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="table-cell">
                                        {transaction.amount}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant={"ghost"} className="cursor-pointer">
                                                <MoreHorizontal className="text-sm text-white" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setTransactionId(transaction.id)
                                                    setOpenDialog(true) 
                                                }}
                                            >
                                                <Trash />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <DeleteTransactionDialog
                open={openDialog}
                setOpen={setOpenDialog}
                transactionId={transactionId}
                setTransactionId={setTransactionId}
            />
        </div>
    )

}
