module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          "root": ["./"],
          "alias": {
            "@components": "./components",
            "@screens": "./screens",
            "@contexts": "./contexts",
            "@helpers": "./helpers",
            "@services": "./services",
            "@assets": "./assets",
            "@constants": "./constants"
          }
        },
      ],
    ],
  };
};
