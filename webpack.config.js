const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  entry: "./src/main.ts",
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, 'app'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    open: true,
    host: "localhost",
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true
  },
  plugins: [
    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      template: "./view/index.html",
      inject: 'body',
      minify: true
    }),

    new CopyPlugin({
      patterns: [
        { from: "assets", to: "assets" }
      ],
    }),

    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          "css-loader",
          "postcss-loader",
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset"
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  return config;
};
