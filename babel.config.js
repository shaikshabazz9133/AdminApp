module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@store": "./src/store",
            "@data": "./src/data",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@constants": "./src/constants",
            "@assets": "./src/assets",
          },
        },
      ],
    ],
  };
};
