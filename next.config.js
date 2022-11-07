const fs = require("fs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.MULTIMOCO_STATIC_BUILD? "/multimoco-web": "",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  exportPathMap: async function (defaultPathMap, args) {
    const pathMap = {
      "/video": { page: '/video' },
      ...Object.fromEntries(
        fs.readdirSync("pages/search_static")
          .map((x) => {
            const fname = x.replace(".tsx", "");
            return ["/" + fname, { page: "/search_static/" + fname }]
          }))
    };
    console.log(pathMap);
    return pathMap
  },
  redirects: async function () {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
