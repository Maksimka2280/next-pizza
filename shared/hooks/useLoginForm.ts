import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../components/Auth/LoginValidate';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { sendLoginCode } from '@/actions/EmailActions';
import toast from 'react-hot-toast';

export const useLoginForm = ({ onRegister, onClose }: { onRegister?: () => void; onClose?: () => void } = {}) => {
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [open, setOpen] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            Email: '',
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
        toast.error('Пожалуйста, заполните все поля правильно');
    };

    const handleSendCode = async () => {
        const isValid = await trigger('Email');

        if (!isValid) {
            handleInvalidSubmit();
            return;
        }

        const email = getValues('Email').trim();

        setIsSendingCode(true);

        try {
            await sendLoginCode(email);
            setIsCodeSent(true);
            toast.success('Код подтверждения отправлен на вашу почту');
        } catch (error) {
            console.error('Ошибка отправки:', error);
            toast.error(error instanceof Error ? error.message : 'Не удалось отправить код подтверждения');
        } finally {
            setIsSendingCode(false);
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
        doYouRegister,
        handleSendCode,
    };
};
