import { Pen, Phone, User } from "lucide-react"
import { Button } from "../ui/button"

interface ProfileInfoProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | undefined;
}

export const ProfileInfo = ({ user }: ProfileInfoProps) => {
    return (
        <>
            <div className="bg-white w-full h-[250px] rounded-[15px] flex justify-start gap-[20px] items-center p-7">
                <div className="bg-[#ffe6c8] w-[160px] h-[160px] shrink-0 flex justify-center items-center rounded-[50%]">
                    <User size={80} className="text-[#ffc074]" />
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-col gap-[5px]">
                        <h1 className="text-[22px] font-bold">{user?.name}</h1>
                        <p className="text-[#B1B1B1]">{user?.email}</p>
                        <p className="flex text-[#8f8f8f] items-center">
                            <Phone size={16} /> телефон +
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className="text-[#FE5F00] p-5 font-bold gap-3 mt-[20px]"
                    >
                        <Pen strokeWidth={3} />
                        Редактировать данные
                    </Button>
                </div>

                <div className="ml-auto h-full border-l border-[#EEEEEE] pl-10 flex flex-col justify-center gap-5 min-w-[280px]">
                    <h2 className="text-[18px] font-bold">Информация про аккаунт</h2>

                    <div className="flex flex-col gap-1">
                        <p className="text-[#B1B1B1] text-sm">ID пользователя</p>
                        <p className="font-semibold">#{user?.id}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-[#B1B1B1] text-sm">Статус аккаунта</p>
                        <p className="text-green-600 font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Активный
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}