import z from "zod";

export const CreateCategorySchema = z.object({
    name: z.string().min(3, "Campo requerido").max(20),
    icon: z.string().max(20),
    type: z.enum(["income", "expense"])
})

export type CreateCategoryValues = z.infer<typeof CreateCategorySchema >