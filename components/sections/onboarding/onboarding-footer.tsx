import Link from "next/link";

export default function OnBoardingFooter() {
  return (
    <section>
      <footer className="w-full py-6 text-center text-muted-foreground text-sm">
        <p>
          © {new Date().getFullYear()} TracerPro Asset Management. All rights
          reserved.
        </p>
        <div className="flex justify-center gap-6 mt-2">
          <Link
            className="hover:text-foreground transition-colors"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="hover:text-foreground transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </section>
  );
}
