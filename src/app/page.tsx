import Header from "@/components/headers/Header";
import Image from "next/image";

export default function Home() {
  return (
    <>

      <Header />

      <main className="px-[67px] pt-[40px]">
        <div>
          <h1 className="text-[36px] font-black">Все пиццы</h1>
        </div>
      </main>
    </>
  );
}
