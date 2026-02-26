"use server";

export default async function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col min-h-screen">{children}</div>;
}
