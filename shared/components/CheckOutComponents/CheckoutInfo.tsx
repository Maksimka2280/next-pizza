type Props = {
title: string;
description: string;
}
export const CheckoutInfo: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col ">
      <h2 className="font-bold truncate">{title}</h2>
      <p className="text-sm text-[#A1A1A1] max-w-[280px] w-full">{description}</p>
    </div>
  )
}