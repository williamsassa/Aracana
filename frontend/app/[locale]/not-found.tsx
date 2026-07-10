import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Orb } from "@/components/Bits";

export default function NotFound() {
  const t = useTranslations("notFound");
  const c = useTranslations("common");

  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Orb className="h-28 w-28" />
      <h1 className="display-2 mt-10">{t("title")}</h1>
      <p className="lead mt-4 max-w-md">{t("body")}</p>
      <Link href="/" className="btn-dark mt-8">
        {c("backHome")}
      </Link>
    </section>
  );
}
