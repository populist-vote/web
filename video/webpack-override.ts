import { WebpackOverrideFn } from "@remotion/bundler";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import type { Configuration } from "webpack";

export const enableTypescriptAliases: (
  config: Configuration
) => Configuration = (config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        stream: false,
        zlib: false,
        util: false,
      },
      plugins: [...(config.resolve?.plugins ?? []), new TsconfigPathsPlugin()],
    },
  };
};

export const enableSass: WebpackOverrideFn = (currentConfiguration) => {
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules
          ? currentConfiguration.module.rules
          : []),
        {
          test: /\.s[ac]ss$/i,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            { loader: "sass-loader", options: { sourceMap: true } },
          ],
        },
      ],
    },
  };
};
