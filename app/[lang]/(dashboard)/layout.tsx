import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { getDictionary } from "@/app/dictionaries";
import { redirect } from "next/navigation";

const Layout = async ({ children, params: { lang } }: { children: React.ReactNode; params: { lang: any } }) => {
  const session = typeof window === "undefined" ? null : localStorage.getItem("session");

  if (!session) {
    redirect(`/${lang}/auth/login`);
  }

  const trans = await getDictionary(lang);

  return <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>;
};

export default Layout;
