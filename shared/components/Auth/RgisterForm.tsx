import { Input } from "@base-ui/react";
import { Button } from "../ui/button";
import { useRegisterForm } from "../../hooks/useRegsiterForm";

export const RegisterForm = ({ onClose }: { onClose?: () => void }) => {
    const {
        form,
        formRef,
        register,
        errors,
        handleSubmit,
        getValues,
        trigger,
        code,
        setCode,
        isCodeSent,
        isEmailVerified,
        isSendingCode,
        isVerifyingCode,
        isRegistering,
        handleSendCode,
        handleVerifyCode,
        handleRegister,
    } = useRegisterForm(onClose)
    const canEnterCode = isCodeSent && !isEmailVerified;

    return (
        <>
            <form ref={formRef} noValidate onSubmit={handleSubmit(handleSendCode)} className="flex flex-col gap-[10px] max-h-[60vh] overflow-auto pr-2">
                <Input
                    {...register("Name")}
                    inputMode="text"
                    autoComplete="additional-name"
                    type="text"
                    aria-invalid={!!errors.Name}
                    minLength={2}
                    placeholder="Имя"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                />
                {
                    errors.Name && (
                        <p className=' text-sm text-red-500'>
                            {errors.Name.message}
                        </p>
                    )
                }
                <Input
                    {...register("Email")}
                    inputMode="email"
                    autoComplete="email"
                    type="email"
                    aria-invalid={!!errors.Email}
                    placeholder="example@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                />
                 {errors.Email && <p className='mt-1 text-sm text-red-500'>{errors.Email.message}</p>}
                <Input
                    {...register("Password")}
                    autoComplete="current-password"
                    type="password"
                    aria-invalid={!!errors.Password}
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                />
                {
                    errors.Password && (
                        <p className=' mt-1 text-sm text-red-500'>
                            {errors.Password.message}
                        </p>
                    )
                }
                <Button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSendingCode}
                    className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
                >
                    {isSendingCode ? 'Надсилаємо код...' : 'Получить код'}
                </Button>
                {canEnterCode && (
                    <>

                        <Input
                            {...register("CodeConfirm", {
                                onChange: (event) => {
                                    const next = event.target.value.replace(/\D/g, "").slice(0, 4);
                                    setCode(next);
                                    form.setValue("CodeConfirm", next);
                                },
                            })}
                            value={code}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            type="text"
                            maxLength={4}
                            aria-invalid={!!errors.CodeConfirm}
                            placeholder="Код із листа"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                        />

                        {errors.CodeConfirm && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.CodeConfirm.message}
                            </p>
                        )}


                        <Button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={isVerifyingCode}
                            className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
                        >
                            {isVerifyingCode ? 'Перевіряємо...' : 'Підтвердити код'}
                        </Button>
                    </>
                )}
                {isEmailVerified && (
                    <Button
                        type="button"
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
                    >
                        {isRegistering ? 'Реєструємо...'  : 'Зарегистрироваться'}
                    </Button>
                )}
            </form>
        </>
    )
}