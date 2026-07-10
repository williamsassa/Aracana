import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Output mode:
  //  - BUILD_TARGET=static  -> ./out static export (Desktop/Mobile shells)
  //  - DOCKER=1             -> standalone server bundle (slim container image)
  //  - default              -> regular .next build (next start)
  ...(process.env.BUILD_TARGET === "static"
    ? { output: "export", images: { unoptimized: true } }
    : process.env.DOCKER
    ? { output: "standalone" }
    : {}),
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  },
};

export default withNextIntl(nextConfig);
