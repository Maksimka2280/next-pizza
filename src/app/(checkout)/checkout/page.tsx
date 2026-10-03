'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Checkout } from '../../../../shared/components/shared/CheckOut';
import { useCart } from '../../../../shared/hooks/useCart';
import { CheckoutSkeleton } from '../../../../shared/components/shared/CheckoutSkeleton';

export default function Checkouts() {
    const router = useRouter();
    const { cart, loading } = useCart();

    useEffect(() => {
        if (!loading && !cart?.items?.length) {
            router.replace('/');
        }
    }, [cart, loading, router]);

    if (loading) {
        return <CheckoutSkeleton />;
    }

    if (!cart?.items?.length) {
        return null;
    }

    return <Checkout />;
}