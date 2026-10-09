import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema } from "../components/Auth/RegisterValidate";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { registerUser, sendRegistrationCode, verifyRegistrationCode } from "@/actions/EmailActions";
import toast from "react-hot-toast";

export const useRegisterForm = (onClose?: () => void) => {
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            Name: '',
            Email: '',
            Password: '',
            CodeConfirm: '',
        },
    });
    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        trigger,
    } = form;

    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);


    const handleSendCode = async () => {
        const isValid = await trigger([
            "Name",
            "Email",
            "Password",
            
        ]);
        if (!isValid) {
            toast.error("Пожалуйста, заполните все поля правильно");
            return;
        }

        const { Email } = getValues();

        setIsSendingCode(true);

        try {
            await sendRegistrationCode(Email);
            setIsCodeSent(true);
            setIsEmailVerified(false);
            setCode("");
            toast.success("Код подтверждения отправлен на вашу почту");
        } catch (error) {
            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Не удалось отправить код подтверждения"
            );
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleVerifyCode = async () => {
     

        const data = getValues();

        const isValid = await trigger([
            "Name",
            "Email",
            "Password",
            "CodeConfirm",
        ]);

        if (!isValid) {
            toast.error("Пожалуйста, заполните все поля");
            return;
        }

        if (!isCodeSent) {
            toast.error("Сначала отправьте код на почту");
            return;
        }

        if (!data) return;

        setIsVerifyingCode(true);

        try {
            const isValid = await verifyRegistrationCode(data.Email, code);

            if (!isValid) {
                toast.error("Неверный код");
                return;
            }

            setIsEmailVerified(true);
            toast.success("Email подтверджжено ");
        } catch (error) {
            console.error(error);
            toast.error("Не удалость подтвердить код");
        } finally {
            setIsVerifyingCode(false);
        }
    };

    const handleRegister = async () => {
        const isValid = await trigger([
            "Name",
            "Email",
            "Password",
            "CodeConfirm",
        ]);

        if (!isValid) {
            toast.error("Пожалуйста, заполните все поля");
            return;
        }

        if (!isEmailVerified) {
            toast.error("Сначала подтвердите электронную почту");
            return;
        }

        const data = getValues();

        setIsRegistering(true);

        try {
            const isRegistered = await registerUser(
                data.Name,
                data.Email,
                data.Password,
                data.CodeConfirm
            );

            if (!isRegistered) {
                setIsEmailVerified(false);

                toast.error(
                    "Не удалось завершить регистрацию. Проверьте код и попробуйте ещё раз."
                );
                return;
            }

            toast.success("Регистрация успешна");
            
            onClose?.();
        } catch (error) {
            console.error(error);
            toast.error("Не удалось завершить регистрацию");
        } finally {
            setIsRegistering(false);
        }
    };

    return {
        form,
        formRef,
        register: form.register,
        errors: form.formState.errors,
        handleSubmit: form.handleSubmit,
        getValues: form.getValues,
        trigger: form.trigger,
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
    };
};


