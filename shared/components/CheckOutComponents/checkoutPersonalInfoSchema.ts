import { z } from "zod";

const normalizePhone = (value: string) => value.replace(/\D/g, "");

export const checkoutPersonalInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Введите ваше имя")
    .max(50, "Имя слишком длинное")
    .refine(
      (value) => /^[a-zA-Zа-яА-ЯіІїЇєЄ' -]+$/.test(value),
      "Имя может содержать только буквы, пробелы и дефисы",
    ),

  lastName: z
    .string()
    .trim()
    .min(2, "Введите вашу фамилию")
    .max(50, "Фамилия слишком длинная")
    .refine(
      (value) => /^[a-zA-Zа-яА-ЯіІїЇєЄ' -]+$/.test(value),
      "Фамилия может содержать только буквы, пробелы и дефисы",
    ),

  email: z
    .string()
    .trim()
    .min(1, "Введите электронную почту")
    .email("Неверный формат e-mail"),

  phone: z
    .string()
    .trim()
    .min(1, "Введите номер телефона")
    .refine((value) => {
      const cleaned = normalizePhone(value);
      return cleaned.length >= 10 && cleaned.length <= 15;
    }, "Неверный формат телефона. Пример: +7 (999) 100-20-20"),
  address: z
    .string()
    .trim()
    .min(3, "Введите адрес доставки")
    .max(200, "Адрес слишком длинный"),

  comment: z
    .string()
    .trim()
    .max(500, "Комментарий слишком длинный")
    .optional(),

  deliveryTime: z.string().min(1, "Выберите время доставки"),
});

export type CheckoutPersonalInfoFormValues = z.infer<
  typeof checkoutPersonalInfoSchema
>;