/** @type {import('next').NextConfig} */
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.notion.so",
      "i.imgur.com",
      "media.giphy.com",
      "prod-files-secure.s3.us-west-2.amazonaws.com",
      "nextjs.org",
      "www.0xkishan.com",
      "lucide.dev",
      "repository-images.githubusercontent.com",
    ],
  },
  sassOptions: {
    includePaths: [path.join(path.dirname("styles"))],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Додаємо glslify-loader для обробки GLSL файлів
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
