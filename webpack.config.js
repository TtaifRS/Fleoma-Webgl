const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app");
const dirStyles = path.join(__dirname, "styles");
const dirShared = path.join(__dirname, "shared");
const dirNode = "node_modules";

module.exports = {
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],
  resolve: {
    modules: [dirApp, dirShared, dirStyles, dirNode],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./shared/",
          to: "",
        },
      ],
    }),

    new MiniCSSExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),

    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
        ],
      },
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },

      //scss
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },

      // Images and font
      {
        test: /\.(jpg?g|png|gif|svg|woff2?|fnt|webp)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name(file) {
                return "[hash].[ext]";
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
          },
        ],
      },
      {
        test: /\.(glsl|vs|fs|ver|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader", "glslify-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
