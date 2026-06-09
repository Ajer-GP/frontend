import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "placehold.net",
        port: "",
      },
    ],
  },
};

export default nextConfig;
//https://placehold.net/
