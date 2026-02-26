import { Footer } from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="w-full max-auto">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
}
