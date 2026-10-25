import MainHeader from "../../../shared/components/headers/main-header";



export const metadata = {
  title: "Next-Pizza - наилучший сайт по заказу пиццы",
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
      <MainHeader    />
      {children}
      {modal}
    </>
  );
}