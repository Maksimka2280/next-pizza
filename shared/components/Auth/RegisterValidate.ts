import z, { number } from "zod";

export const registerSchema = z.object({
    Name: z
        .string()
        .trim()
        .min(2, "Введите имя")
        .max(50, "Имя слишком длинное")
        .refine(
            (value) => /^[a-zA-Zа-яА-ЯіІїЇєЄёЁґҐ' -]+$/.test(value),
            "Имя может содержать только буквы, пробелы и дефисы",
        ),
    Email: z
        .string()
        .trim()
        .min(1, "Введите почту")
        .pipe(z.email("Неверний формат почты")),

    Password: z
        .string()
        .trim()
        .min(4, "Пароль должен содержать минимум 4 символа")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    CodeConfirm: z
        .string()
        .length(4, "Код должен содержать 4 цифры")
        .regex(/^\d{4}$/, "Код должен состоять только из цифр"),

})