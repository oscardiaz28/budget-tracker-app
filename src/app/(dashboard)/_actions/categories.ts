"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { CreateCategorySchema, CreateCategoryValues } from "../../../../schema/categories";

export async function createCategory( body : CreateCategoryValues ){
    const parsed = CreateCategorySchema.safeParse(body)
    if( !parsed.success ){
        throw new Error("Bad request")
    }
    const user = await currentUser()
    if(!user) redirect("/sign-in")
    const { icon, name, type } = parsed.data

    const existingCategory = await prisma.category.findFirst({
        where: { userId: user.id, name, type }
    })
    if( existingCategory ) throw new Error("Category already exists")
        
    return await prisma.category.create({
        data: {
            icon,
            name,
            type,
            userId: user.id
        }
    })
}

export async function deleteCategory( name: string, type: TransactionType ){
    const user = await currentUser()
    if(!user) redirect("/sign-in")
    const category = await prisma.category.deleteMany({
        where: { name, type, userId: user.id  } 
    })    
    if( category.count == 0 ) throw new Error("Category not found")
    return { success: true }
}