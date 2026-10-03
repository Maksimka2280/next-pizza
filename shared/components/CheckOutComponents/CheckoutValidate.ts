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
const isValidCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 16) return false;

  let sum = 0;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if ((digits.length - 1 - index) % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};
const isValidExpiry = (value: string) => {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};
export const checkoutPaymentSchema = z.object({
  cardNumber: z.string()
    .regex(/^\d{4}( \d{4}){3}$/, 'Введите номер из 16 цифр')
    .refine(isValidCardNumber, 'Проверьте номер карты'),
  cardholder: z.string()
    .trim()
    .min(2, 'Введите имя владельца карты')
    .max(64, 'Имя слишком длинное')
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ' -]+$/, 'Используйте только буквы, пробелы и дефисы'),
  expiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Введите срок в формате ММ/ГГ')
    .refine(isValidExpiry, 'Срок действия карты истёк'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV должен содержать 3 или 4 цифры'),
});

export type CheckoutPersonalInfoFormValues = z.infer<
  typeof checkoutPersonalInfoSchema
>;