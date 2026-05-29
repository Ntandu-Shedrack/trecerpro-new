"use server";

export default async function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden bg-dot-grid">
      {children}
    </div>
  );
}
