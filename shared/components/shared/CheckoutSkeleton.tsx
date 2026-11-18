import { Skeleton } from "../ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <main className="flex justify-center px-3 py-6 sm:px-5 sm:py-10 lg:px-8 lg:py-[50px]">
      <div className="w-full max-w-[1440px]">
        <Skeleton className="h-10 w-64 rounded-[18px] bg-[#E7E0DA]" />

        <div className="mt-6 grid w-full min-w-0 grid-cols-1 items-start gap-6 lg:mt-[50px] lg:grid-cols-[minmax(0,1fr)_minmax(360px,640px)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-6 sm:gap-8 lg:gap-[40px]">
            <div className="min-h-[340px] w-full min-w-0 rounded-2xl bg-white p-4 sm:rounded-[30px] sm:p-6 lg:max-w-[750px] lg:p-[30px]">
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-7 w-36 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-6 w-32 rounded-[12px] bg-[#F2EEE9]" />
              </div>

              <div className="mt-[22px] space-y-[18px]">
                {[0, 1].map((item) => (
                  <div key={item} className="flex min-w-0 flex-wrap items-center gap-[16px] rounded-[16px] border border-[#F1EEE9] p-3">
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

            <div className="min-h-[270px] w-full min-w-0 rounded-2xl bg-white p-4 sm:rounded-[30px] sm:p-6 lg:max-w-[750px] lg:p-[30px]">
              <Skeleton className="h-7 w-52 rounded-[12px] bg-[#F2EEE9]" />
              <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 rounded-[12px] bg-[#F2EEE9]" />
              </div>
            </div>

            <div className="min-h-[360px] w-full min-w-0 rounded-2xl bg-white p-4 sm:rounded-[30px] sm:p-6 lg:max-w-[750px] lg:p-[30px]">
              <Skeleton className="h-7 w-48 rounded-[12px] bg-[#F2EEE9]" />
              <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
              <div className="space-y-[18px]">
                <Skeleton className="h-12 w-full rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-24 w-full rounded-[12px] bg-[#F2EEE9]" />
                <Skeleton className="h-12 w-60 rounded-[12px] bg-[#F2EEE9]" />
              </div>
            </div>
          </div>

          <div className="w-full min-w-0 max-w-[640px]">
            <div className="min-h-[490px] w-full min-w-0 rounded-2xl bg-white p-5 sm:rounded-[30px] sm:p-8 lg:p-[40px]">
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
