var account = account || {};

account.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#accountPanel :first-child").removeClass("ui-panel-inner");
        $("#accountPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.initialize = function initialize() {
        var username = window.sessionStorage.getItem("sessionUsername");
        var username_email = JSON.parse(username).username;

        var elementUsername = $('#userEmailAcount');
        elementUsername.empty();
        elementUsername.append("<small>" + username_email + "</small>");
    }

    this.logout = function logout()
    {
        window.sessionStorage.removeItem('sessionUsername');

        $('#goBackLink').click();
    }

    this.refreshAllAccountContent = function refreshAllAccountContent() {
        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelAccount', 'panelAccountText');

        var appAccount = new account.Chinnook();

        appAccount.layoutAspects();
        appAccount.initialize();

        var connectionApp = new conection.Chinnook();
        connectionApp.checkConnectionIcon('connectionIconAccount');
    }

    $('body').on('click', '#regreshPageAccount', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new account.Chinnook();
        classApp.refreshAllAccountContent();

        $("#accountPanel").panel("close");
    });

    $('body').on('click', '#exitAccount', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}


$(document).on("pageshow", "#accountPage", function () {
    var appAccount = new account.Chinnook();
    appAccount.refreshAllAccountContent();
});



