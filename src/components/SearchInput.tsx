'use client';

import axios from 'axios';
import { Product } from '@prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!focused) {
      setProducts([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      if (!searchQuery.trim()) {
        setProducts([]);
        return;
      }

      try {
        const { data } = await axios.get<Product[]>('/api/products');
        const filtered = data.filter((product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setProducts(filtered);
      } catch (error) {
        console.log(error);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [focused, searchQuery]);

  useEffect(() => {
    if (!focused) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [focused]);

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery('');
    setProducts([]);
  };

  return (
    <>

      <div
        ref={ref}
        className={cn('flex rounded-2xl flex-1 justify-between relative h-11 z-30', className)}>
        <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
        <input
          className="rounded-2xl outline-none w-full bg-gray-100 pl-11"
          type="text"
          placeholder="Найти пиццу..."
          onFocus={() => setFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {products.length > 0 && (
          <div
            className={cn(
              'absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30',
              focused && 'visible opacity-100 top-12',
            )}>
            {products.map((product) => (
              <Link
                onClick={onClickItem}
                key={product.id}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10"
                href={`/product/${product.id}`}>
                <img className="rounded-sm h-8 w-8" src={product.imageUrl} alt={product.name} />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};