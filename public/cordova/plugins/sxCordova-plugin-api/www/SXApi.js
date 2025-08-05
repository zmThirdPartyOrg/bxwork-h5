cordova.define("sxCordova-plugin-api.SXApi", function(require, exports, module) {
                  
      var exec = require('cordova/exec');
      
      module.exports = {
               call: function(successCallback, errorCallback, service, action, params) {
                          switch(service) {
                            case "InterfacePlugin":
                            exec(successCallback, errorCallback, "InterfacePlugin", action, [params]);
                            break
                            case "DbPlugin":
                            exec(successCallback, errorCallback, "DbPlugin", action, [params]);
                            break
                            case "FunctionPlugin":
                                exec(successCallback, errorCallback, "FunctionPlugin", action, [params]);
                            break
                            default:
                                exec(successCallback, errorCallback, service, action, [params]);
                            break
                          }
               }
      }
});

