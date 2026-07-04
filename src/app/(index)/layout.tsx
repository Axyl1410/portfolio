import { Navbar } from "@/components/navbar";

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center text-center">
        {children}
      </div>
    </>
  );
}
