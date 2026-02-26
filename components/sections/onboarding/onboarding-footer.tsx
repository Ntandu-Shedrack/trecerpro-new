import Link from "next/link";

export default function OnBoardingFooter() {
  return (
    <section>
      <footer className="w-full py-6 text-center text-gray-400 dark:text-gray-600 text-sm">
        <p>
          © {new Date().getFullYear()} TracerPro Asset Management. All rights
          reserved.
        </p>
        <div className="flex justify-center gap-6 mt-2">
          <Link
            className="hover:text-gray-600 dark:hover:text-gray-300"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="hover:text-gray-600 dark:hover:text-gray-300"
            href="#"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </section>
  );
}
