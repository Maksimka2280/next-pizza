"use client";


import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
    id: string;
    items: string[];
    defaultValue?: number;
    onChange?: (index: number) => void;
}

export function SegmentedControl({
    id,
    items,
    defaultValue = 0,

    onChange,
}: Props) {
    const [active, setActive] = useState(defaultValue);

    return (
        <div
            className="grid rounded-full bg-muted p-1 w-[430px]"
            style={{
                gridTemplateColumns: `repeat(${items.length}, 1fr)`,
            }}
        >
            {items.map((item, index) => (
                <button
                    key={item}
                    onClick={() => {
                        setActive(index);
                        onChange?.(index);
                    }}
                    className="relative h-11 w-full"
                >
                    {active === index && (
                        <motion.div
                            layoutId={`segment-${id}`}
                            className="absolute inset-0 rounded-full bg-white shadow"
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                            }}
                        />
                    )}

                    <span
                        className={cn(
                            "relative z-10 text-sm font-medium",
                            active === index
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        {item}
                    </span>
                </button>
            ))}
        </div>
    );
}