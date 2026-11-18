
import { useFormContext, useFormState } from "react-hook-form";

import type { CheckoutPersonalInfoFormValues } from "./CheckoutValidate";

type FieldProps = {
    name: keyof CheckoutPersonalInfoFormValues;
    label: string;
    placeholder: string;
    type?: string;
    autoComplete?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    textarea?: boolean;
};

export function CheckoutField({
    name,
    label,
    placeholder,
    type = "text",
    autoComplete,
    inputMode,
    textarea = false,
}: FieldProps) {
    const { register, control } =
        useFormContext<CheckoutPersonalInfoFormValues>();

    const { errors } = useFormState({
        control,
        name,
        exact: true,
    });

    const errorMessage = errors[name]?.message;
    const isInvalid = Boolean(errorMessage);
    const fieldId = String(name);
    return (
        <div className="flex w-full flex-col gap-[8px]">
            <label htmlFor={fieldId} className="text-[14px] font-bold text-[#212121]">
                {label}
            </label>

            {textarea ? (
                <textarea
                    id={fieldId}
                    {...register(name)}
                    placeholder={placeholder}
                    aria-invalid={isInvalid}
                    aria-describedby={
                        isInvalid ? `${String(name)}-error` : undefined
                    }
                    className={`h-[120px] w-full resize-none rounded-[10px] border bg-transparent px-[18px] py-[14px] text-[16px] text-[#1F1F1F] outline-none transition-all ${isInvalid
                            ? "border-[#FF4D4F] shadow-[0_0_0_1px_rgba(255,77,79,0.35)]"
                            : "border-[#E7E7E7] focus:border-[#FF7A00]"
                        }`}
                />
            ) : (
                <input
                    id={fieldId}
                    {...register(name)}
                    type={type}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    placeholder={placeholder}
                    aria-invalid={isInvalid}
                    aria-describedby={
                        isInvalid ? `${String(name)}-error` : undefined
                    }
                    className={`h-[48px] w-full rounded-[10px] border bg-transparent px-[18px] text-[16px] text-[#1F1F1F] outline-none transition-all ${isInvalid
                            ? "border-[#FF4D4F] shadow-[0_0_0_1px_rgba(255,77,79,0.35)]"
                            : "border-[#E7E7E7] focus:border-[#FF7A00]"
                        }`}
                />
            )}

            {isInvalid && (
                <span
                    id={`${String(name)}-error`}
                    className="text-[14px] font-medium text-[#FF4D4F]"
                >
                    {String(errorMessage)}
                </span>
            )}
        </div>
    );
}
