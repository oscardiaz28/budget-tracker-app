"use server";

import { currentUser } from "@clerk/nextjs/server";
import { CreateTransactionSchema, CreateTransactionValues } from "../../../../schema/transaction";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function createTransaction( body : CreateTransactionValues ){
    const user = await currentUser()
    if(!user) redirect("/sign-in")

    const parsed = CreateTransactionSchema.safeParse(body)
    if(!parsed.success) return NextResponse.json({message: "Ha ocurrido un error"}, { status: 400 })
    
    const { amount, category, date, description, type } = parsed.data

    const categoryEntity = await prisma.category.findFirst({
        where: { userId: user.id, name: category }
    })
    if(!categoryEntity) return NextResponse.json({message: "Categoria no encontrada"}, { status: 400} )
    
    const transaction = await prisma.$transaction([
        //create user transaction
        prisma.transaction.create({
            data: {
                amount,
                description,
                date,
                userId: user.id,
                type,
                category,
                categoryIcon: categoryEntity.icon,
            }
        }),
        // update  month agregates tables
        prisma.monthHistory.upsert({
            where: { 
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
             },
             create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type == "expense" ? amount : 0,
                income: type == "income" ? amount : 0
             },
             update: {
                expense: {
                    increment: type == "expense" ? amount : 0 
                },
                income: {
                    increment: type == "income" ? amount : 0
                }
             }
        }),

        //update year agregate
        prisma.yearHistory.upsert({
            where: { 
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
             },
             create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type == "expense" ? amount : 0,
                income: type == "income" ? amount : 0
             },
             update: {
                expense: {
                    increment: type == "expense" ? amount : 0 
                },
                income: {
                    increment: type == "income" ? amount : 0
                }
             }
        })
    ])
    return transaction
}