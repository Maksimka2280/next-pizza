import { Bell, Box, Heart } from "lucide-react"

export const ProfileLilInfo = () => {
    return (
        <>
            <div className="bg-white w-full h-[150px] rounded-[15px] py-6 flex justify-center items-center gap-[100px]">
                <div className="w-[200px]  flex flex-col justify-center gap-2 border-r border-[#E5E5E5] pr-5">
                    <Box size={28} className="text-[#FE5F00]" />

                    <p className="text-[24px] font-bold">2</p>

                    <h2 className="text-[16px] font-semibold text-[#8F8F8F]">
                        Мои заказы
                    </h2>
                </div>
                <div className="w-[200px]  flex flex-col justify-center gap-2 border-r border-[#E5E5E5] pr-5">
                    <Heart size={28} className="text-[#FE5F00]" />

                    <p className="text-[24px] font-bold">2</p>

                    <h2 className="text-[16px] font-semibold text-[#8F8F8F]">
                        Избранные товары
                    </h2>
                </div>
                <div className="w-[200px]  flex flex-col justify-center gap-2 border-r border-[#E5E5E5] pr-5">
                    <Bell size={28} className="text-[#FE5F00]" />

                    <p className="text-[24px] font-bold">2</p>

                    <h2 className="text-[16px] font-semibold text-[#8F8F8F]">
                        Уведомления
                    </h2>

                </div>
            </div>
        </>
    )
}