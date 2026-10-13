import z from "zod";

export const loginSchema = z.object({
    Email: z
        .string()
        .trim()
        .min(1, "Введите почту")
        .pipe(z.email("Неверный формат почты")),
    Password: z
        .string()
        .trim()
        .min(4, "Пароль должен содержать минимум 4 символа")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
   
})

export const codeSchema = z.object({
  CodeConfirm: z.string().length(4, "Код должен содержать 4 цифры")
    .regex(/^\d{4}$/, "Код должен состоять только из цифр"),
});