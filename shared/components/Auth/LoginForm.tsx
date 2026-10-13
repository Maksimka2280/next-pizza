import { Button, Input } from "@base-ui/react"
import { useLoginForm } from "../../hooks/useLoginForm";
interface Props {
    onRegister: () => void;
    onClose: () => void;
}
export const LoginForm = ({ onRegister, onClose }: Props) => {
    const {
        form,
        register,
        errors,
        handleSubmit,
        isSendingCode,
        open,
        setCode,
        code,
        isVerifyingCode,
        doYouRegister,
        handleSendCode,
        handleVerifyCode,
        isEmailVerified,
        isCodeSent
    } = useLoginForm({ onRegister, onClose });
    const canEnterCode = isCodeSent && !isEmailVerified;
    return (
        <>
            <div className="flex flex-col gap-[20px]">
                <form noValidate onSubmit={handleSubmit(handleSendCode)} className="flex flex-col gap-[10px]">
                    <Input
                        {...register('Email')}
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
                    {errors.Password && (<p className=' mt-1 text-sm text-red-500'> {errors.Password.message} </p>)}
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
                                placeholder="Код з листа"
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
                                className="mt-4 rounded-[18px] bg-[#FE5F00] py-[15px] text-[16px] font-extrabold text-white transition-opacity disabled:opacity-70"
                            >
                                {isVerifyingCode ? 'Проверяем...' : 'Подтвердить код'}
                            </Button>
                        </>
                    )}
                    {!canEnterCode && (
                        <Button
                        type="submit"
                        disabled={isSendingCode}
                        className="mt-4 rounded-[18px] bg-[#FE5F00] py-[15px] text-[16px] font-extrabold text-white transition-opacity disabled:opacity-70"
                    >
                        {isSendingCode ? 'Надсилаємо код...' : 'Надіслати код'}
                    </Button>)

                    }
                </form>
                <button type="button" onClick={doYouRegister} className='text-[#7C7C7C]'> Немає акаунта? </button>
                {open && (
                    <Button
                        type="button"
                        onClick={onRegister}
                        className="rounded-[18px] bg-[#FE5F00] py-[15px] text-[16px] font-extrabold text-white disabled:opacity-70"
                    >
                        Зареєструватися
                    </Button>
                )}

            </div >
        </>
    )
}