import Header from "@/components/headers/Header";

export const metadata = {
  title: "Next Pizza",
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      {modal}
    </>
  );
}