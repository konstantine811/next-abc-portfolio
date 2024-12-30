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
      "images.unsplash.com",
      "opengraph.githubassets.com",
    ],
  },
  sassOptions: {
    includePaths: [path.join(path.dirname("styles"))],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Додаємо glslify-loader для обробки GLSL файлів
    config.externals = config.externals || {};
    config.externals["undici"] = "commonjs undici";
    config.module.rules.push(
      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        use: ["raw-loader", "glslify-loader"],
      },
      {
        test: /\.(wav|mp3|ogg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "static/media/",
            publicPath: "/_next/static/media/",
          },
        },
      }
    );
    return config;
  },
};

export default withNextIntl(nextConfig);
