import Link from "next/link";

interface ProductBreadcrumbsProps {
    categoryName?: string;
    productName: string;
}

export function ProductBreadcrumbs({
    categoryName,
    productName,
}: ProductBreadcrumbsProps) {
    return (
        <div className="mb-[20px] flex flex-wrap items-center gap-2 text-sm text-[#777777]">
            <Link href="/" className="hover:text-[#FE5F00]">
                Главная
            </Link>
            <span>/</span>
            <span className="font-semibold">{categoryName || "Категория"}</span>
            <span>/</span>
            <span className="font-bold text-[#1F1F1F]">{productName}</span>
        </div>
    );
}
