const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = function(_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    devtool: isDevelopment && "cheap-module-source-map",
    entry: "./src/application.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "assets/js/[name].[contenthash:8].js",
      publicPath: "/"
	 },
+    module: {
+      rules: [
+        {
+          test: /\.jsx?$/,
+          exclude: /node_modules/,
+          use: {
+            loader: "babel-loader",
+            options: {
+              cacheDirectory: true,
+              cacheCompression: false,
+              envName: isProduction ? "production" : "development"
+            }
+          }
		 },
+        {
+          test: /\.css$/,
+          use: [
+            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
+            "css-loader"
+          ]
+        }
+      ]
+    },
+    resolve: {
+      extensions: [".js", ".jsx"]
    },
+    plugins: [
+      isProduction &&
+        new MiniCssExtractPlugin({
+          filename: "assets/css/[name].[contenthash:8].css",
+          chunkFilename: "assets/css/[name].[contenthash:8].chunk.css"
+        })
+    ].filter(Boolean)
  };
};

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties"
  ],
  env: {
    production: {
      only: ["src"],
      plugins: [
        [
          "transform-react-remove-prop-types",
          {
            removeImport: true
          }
        ],
        "@babel/plugin-transform-react-inline-elements",
        "@babel/plugin-transform-react-constant-elements"
      ]
    }
  }
};
