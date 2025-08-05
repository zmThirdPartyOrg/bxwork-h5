cordova.define("cordova/plugin_list", function (require, exports, module) {
  module.exports = [
    {
      id: "cordova-plugin-dialogs.notification",
      file: "plugins/cordova-plugin-dialogs/www/notification.js",
      pluginId: "cordova-plugin-dialogs",
      merges: ["navigator.notification"],
    },
    {
      id: "cordova-plugin-api.HornApi",
      file: "plugins/cordova-plugin-api/www/HornApi.js",
      pluginId: "cordova-plugin-api",
      runs: true,
      clobbers: ["HornApi"],
    },
    {
    "id": "sxCordova-plugin-api.SXApi",
    "file": "plugins/sxCordova-plugin-api/www/SXApi.js",
    "pluginId": "sxCordova-plugin-api",
    "runs": true,
    "clobbers": [
                 "SXApi"
                 ]
    }
  ];
  module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-whitelist": "1.3.3",
    };
  // BOTTOM OF METADATA
});
