module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // V61: REANIMATED PLUGIN (Required for APK Build)
      'react-native-reanimated/plugin',
    ],
  };
};
