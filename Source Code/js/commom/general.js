
var general = general || {};

general.Chinnook = function Chinnook() {
    this.exitFromApp = function exitFromApp() {
        try
        {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
        catch (e) {
            alert(e);
        }
      
    }
}
