
var sessionlogin = sessionlogin || {};

sessionlogin.Chinnook = function Chinnook() {
    this.verifieSessionLogin = function verifieSessionLogin(idPanelAccount,idPanelAccountText) {
        if (typeof (Storage) == "undefined") {
            alert("Your browser does not support HTML5 window.localStorage. Try upgrading.");
        }
        else {
            var hadSessionSet = window.sessionStorage.getItem("sessionUsername");

            if (hadSessionSet == null || hadSessionSet == 'undefined') {
                $('#' + idPanelAccount).attr("href", "login.html")

                $('#' + idPanelAccountText).text("Sign In")
            } else {
                $('#' + idPanelAccount).attr("href", "account.html")

                var username = window.sessionStorage.getItem("sessionUsername");
                var username_email = JSON.parse(username).username;
 
                $('#' + idPanelAccountText).text(username_email)
            }
        }
    }

    this.isAuthenticated = function isAuthenticated() {
        var hadSessionSet = window.sessionStorage.getItem("sessionUsername");

        if (hadSessionSet == null || hadSessionSet == 'undefined') {
            return false;
        } else {
            return true;
        }
    }

    this.getUsername = function getUsername() {
        var username = window.sessionStorage.getItem("sessionUsername");
        return JSON.parse(username).username;
    }
}