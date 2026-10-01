import { Skeleton } from "../ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <main className="flex justify-center py-[50px]">
      <div className="w-full max-w-[1440px]">
        <Skeleton className="h-10 w-64 rounded-[18px] bg-[#E7E0DA]" />

        <div className="mt-[50px] flex w-full flex-wrap gap-[32px]">
          <div className="flex flex-1 flex-col gap-[40px]">
            <div className="h-[340px] w-full max-w-[750px] rounded-[30px] bg-white p-[30px]">
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-7 w-36 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-6 w-32 rounded-[12px] bg-[#F2EEE9]" />
              </div>

              <div className="mt-[22px] space-y-[18px]">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-[16px] rounded-[16px] border border-[#F1EEE9] p-[12px]">
                    <Skeleton className="h-[72px] w-[72px] rounded-[16px] bg-[#F2EEE9]" />
                    <div className="flex-1 space-y-[10px]">
                      <Skeleton className="h-5 w-2/3 rounded-[10px] bg-[#F2EEE9]" />
                      <Skeleton className="h-4 w-1/2 rounded-[10px] bg-[#F2EEE9]" />
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <Skeleton className="h-9 w-9 rounded-[10px] bg-[#F2EEE9]" />
                      <Skeleton className="h-6 w-8 rounded-[10px] bg-[#F2EEE9]" />
                      <Skeleton className="h-9 w-9 rounded-[10px] bg-[#F2EEE9]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[270px] w-full max-w-[750px] rounded-[30px] bg-white p-[30px]">
              <Skeleton className="h-7 w-52 rounded-[12px] bg-[#F2EEE9]" />
              <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
              </div>
            </div>

            <div className="h-[360px] w-full max-w-[750px] rounded-[30px] bg-white p-[30px]">
              <Skeleton className="h-7 w-48 rounded-[12px] bg-[#F2EEE9]" />
              <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
              <div className="space-y-[18px]">
                <Skeleton className="h-12 w-full rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-24 w-full rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 w-60 rounded-[12px] bg-[#F2EEE9]" />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[640px] shrink-0">
            <div className="h-[490px] rounded-[30px] bg-white p-[40px]">
              <Skeleton className="h-8 w-32 rounded-[12px] bg-[#F2EEE9]" />
              <Skeleton className="mt-5 h-12 w-52 rounded-[12px] bg-[#F2EEE9]" />
              <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
              <div className="space-y-[16px]">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-36 rounded-[10px] bg-[#F2EEE9]" />
                  <Skeleton className="h-5 w-16 rounded-[10px] bg-[#F2EEE9]" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-28 rounded-[10px] bg-[#F2EEE9]" />
                  <Skeleton className="h-5 w-12 rounded-[10px] bg-[#F2EEE9]" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-28 rounded-[10px] bg-[#F2EEE9]" />
                  <Skeleton className="h-5 w-16 rounded-[10px] bg-[#F2EEE9]" />
                </div>
              </div>
              <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
              <Skeleton className="h-12 w-full rounded-[15px] bg-[#F2EEE9]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
