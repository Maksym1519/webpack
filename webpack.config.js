const path = require("path");
const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const target = devMode ? "web" : "browserslist";
const devtool = devMode ? "source-map" : undefined;
const prefix = require("postcss-preset-env");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    open: true,
    historyApiFallback: true,
  },
  entry: ["@babel/polyfill", path.resolve(__dirname, "src", "index.js")],
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "[name].[contenthash].js",
    assetModuleFilename: "assets/[hash][ext]"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src", "index.html"),
    }),
    new HtmlWebpackPlugin({
      filename: "pages/about/about.html",
      template: path.resolve(__dirname, "src", "pages", "about", "about.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new SpriteLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [prefix()],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            targets: "defaults",
            presets: [["@babel/preset-env"]],
          },
        },
      },
      {
        test: /\.woff?2$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },

      {
        test: /\.svg$/,
        include: path.resolve(__dirname, "images/sprite.svg"),
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              extract: true,
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              svgo: {
                plugins: [
                  { name: "removeViewBox", active: false },
                  { name: "cleanupIDs", active: false }
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|webp|gif)$/,
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
              },

              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
              symbolId: "[name]-[hash]",
            },
          },
        ],
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
};
