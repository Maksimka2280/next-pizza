type Props = {
title: string;
description: string;
}
export const CheckoutInfo: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex min-w-0 flex-col ">
      <h2 className="font-bold truncate">{title}</h2>
      <p className="w-full max-w-[280px] break-words text-xs text-[#A1A1A1] sm:text-sm">{description}</p>
    </div>
  )
}