// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind must come before Reanimated
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
