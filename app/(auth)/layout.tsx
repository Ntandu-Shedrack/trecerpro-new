import { Toaster } from "sonner";

export default async function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {children}
      <Toaster position="top-right" duration={5000} richColors closeButton />
    </div>
  );
}
