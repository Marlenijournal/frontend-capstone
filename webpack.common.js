const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/scripts/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/public/"),
          to: path.resolve(__dirname, "dist/"),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "manifest.json"),
          to: path.resolve(__dirname, "dist/"),
        },
        {
          from: path.resolve(__dirname, "src/offline.html"),
          to: path.resolve(__dirname, "dist/"),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "_redirects"),
          to: path.resolve(__dirname, "dist/"),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, "netlify.toml"),
          to: path.resolve(__dirname, "dist/"),
          noErrorOnMissing: true,
        },
      ],
    }),
    new Dotenv(),
  ],
};
