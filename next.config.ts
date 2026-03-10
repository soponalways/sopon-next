// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "**" },
//     ],
//   },
//   serverExternalPackages: ["@prisma/client"],
//   experimental: {
//     serverComponentsExternalPackages: ["@prisma/client", "better-auth"],
//     // serverExternalPackages: ["@prisma/client"],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],

  experimental: {
    optimizePackageImports: ["better-auth"],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Server bundle এ better-auth/react ঢুকবে না
      config.externals = [...(config.externals || []), "better-auth/react"];
    }
    return config;
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;