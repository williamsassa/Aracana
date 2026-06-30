import Link from "next/link";
import { Orb } from "@/components/Bits";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Orb className="h-28 w-28" />
      <h1 className="display-2 mt-10">Page not found.</h1>
      <p className="lead mt-4 max-w-md">
        The page you are looking for has drifted off the frontier.
      </p>
      <Link href="/" className="btn-dark mt-8">
        Back home
      </Link>
    </section>
  );
}
