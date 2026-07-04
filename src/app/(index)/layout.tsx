import { IndexChrome } from "@/components/index-chrome";

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IndexChrome>
      <div className="flex min-h-screen items-center justify-center text-center">
        {children}
      </div>
    </IndexChrome>
  );
}
