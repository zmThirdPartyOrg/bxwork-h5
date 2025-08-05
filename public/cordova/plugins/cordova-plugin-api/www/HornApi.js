cordova.define(
  "cordova-plugin-api.HornApi",
  function (require, exports, module) {
    var exec = require("cordova/exec");

    module.exports = {
      call: function (successCallback, errorCallback, service, action, params) {
          exec(successCallback, errorCallback, service, action, [params]);
      },
    };
  }
);
