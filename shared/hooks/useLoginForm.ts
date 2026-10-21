import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../components/Auth/LoginValidate';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { sendLoginCode, verifyEmailCode } from '@/actions/EmailActions';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

type LoginFormValues = z.infer<typeof loginSchema> & {
    CodeConfirm?: string;
};

export const useLoginForm = ({ onRegister, onClose }: { onRegister?: () => void; onClose?: () => void } = {}) => {
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
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

    const doYouRegister = () => setOpen(true);

    const handleInvalidSubmit = () => {
        toast.error('Будь ласка, заповніть усі поля правильно');
    };

    const handleSendCode = async () => {
        const isValid = await trigger([
            "Email",
            "Password"
        ]);

        if (!isValid) {
            handleInvalidSubmit();
            return;
        }

        const email = getValues('Email').trim();

        setIsSendingCode(true);

        try {
            await sendLoginCode(email);
            setIsCodeSent(true);
            setCode("");
            setIsEmailVerified(false);
            toast.success('Код підтвердження надіслано на вашу пошту');
        } catch (error) {
            console.error('Помилка відправки:', error);
            toast.error(error instanceof Error ? error.message : 'Не вдалося надіслати код підтвердження');
        } finally {
            setIsSendingCode(false);
        }
    };
    const handleVerifyCode = async () => {
    const data = getValues();

    const isValid = await trigger(["Email", "Password"]);

    if (!isValid) {
        toast.error("Пожалуйста, заполните все поля");
        return;
    }

    if (!isCodeSent) {
        toast.error("Сначала отправьте код на почту");
        return;
    }

    if (!code || !/^\d{4}$/.test(code)) {
        toast.error("Код має містити 4 цифри");
        return;
    }

    setIsVerifyingCode(true);

    try {
        const isValidCode = await verifyEmailCode(data.Email, code);

        if (!isValidCode) {
            toast.error("Неверный код");
            return;
        }

        const result = await signIn("credentials", {
            email: data.Email,
            password: data.Password,
            redirect: false,
        });

        if (!result || result.error || !result.ok) {
            toast.error("Код підтверджено, але не вдалося створити сесію");
            return;
        }

        setIsEmailVerified(true);
        toast.success("Email подтверждён, вы вошли в аккаунт");
    } catch (error) {
        console.error(error);
        toast.error("Не удалось подтвердить код или войти");
    } finally {
        setIsVerifyingCode(false);
    }
};
    return {
        form,
        register,
        errors,
        handleSubmit: (callback: typeof handleSendCode) => form.handleSubmit(callback, handleInvalidSubmit),
        isSendingCode,
        isCodeSent,
        open,
        isVerifyingCode,
        doYouRegister,
        handleSendCode,
        isEmailVerified,
        code,
        setCode,
        setIsCodeSent,
        handleVerifyCode
    };
};
