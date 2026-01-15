import { z } from 'zod'

export const CreateTransactionSchema = z.object({
    description: z
        .string({ error: "Campo requerido" }),
    amount: z
        .preprocess(val => val == "" ? undefined : Number(val), z.number({ error: "Campo invalido" })),
    category: z
        .string()
        .min(1, "Campo requerido"),
    type: z
        .enum(["income", "expense"]),
    date: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                const [y, m, d] = val.split("-").map(Number)
                return new Date(y, m - 1, d)
            }
            return val
        },
        z.date()
    )
})

export type CreateTransactionValues = z.infer<typeof CreateTransactionSchema>

