export default function DashboardLoading() {
  return (
    <main className="bg-paper min-h-dvh pb-24 lg:pb-0 lg:pl-72">
      <aside className="fixed inset-y-4 left-4 z-10 hidden w-64 animate-pulse rounded-3xl bg-[#292621] lg:block" />
      <div className="border-line sticky top-0 h-16 border-b bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:h-[72px] lg:px-10" />
      <div className="mx-auto grid w-full max-w-7xl gap-5 p-4 sm:p-6 lg:p-10">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-[#e7e1da]" />
        <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
          <div className="h-[430px] animate-pulse rounded-2xl bg-[#e7e1da]" />
          <div className="min-h-[430px] animate-pulse rounded-2xl bg-[#e7e1da]" />
        </div>
      </div>
    </main>
  );
}
