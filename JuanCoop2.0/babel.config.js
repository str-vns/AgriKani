module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        "react-native-reanimated/plugin",
        ['module:react-native-dotenv', {
          "moduleName": "@env",
          "path": ".env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true
        }],
        ["module-resolver", {
          root: ["./"],
          alias: {
            "@": "./",
            "@src": "./scripts",
            "@navigators": "./scripts/navigators",
            "@assets": "./assets",
            "@screens": "./scripts/screens",
            "@shared": "./scripts/shared",
            "@context": "./scripts/context",
            "@redux": "./scripts/redux",
            "@config": "./config",
            "@components" : "./components",
            "@SocketIo" : "./SocketIo",
          }
        }]
      ]
    };
  };
  