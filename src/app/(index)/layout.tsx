import Menu from "@/components/menu/menu";
import Nav from "@/components/nav/nav";

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="u-container u-gap flex min-h-screen flex-col">
      <Nav />
      <main className="flex flex-1 flex-col">{children}</main>
      <Menu />
    </div>
  );
}
