import z from "zod";

export const loginSchema = z.object({
    Email: z
        .string()
        .trim()
        .min(1 , "Введите почту")
        .pipe(z.email("Неверний формат почты")),
})