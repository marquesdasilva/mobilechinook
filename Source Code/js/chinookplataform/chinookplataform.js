var chinookplataform = chinookplataform || {};

var hasConnection = false;

chinookplataform.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#chinookplataformPanel :first-child").removeClass("ui-panel-inner");
        $("#chinookplataformPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.refreshAllChinookPlataformContent = function refreshAllChinookPlataformContent() {
        var connectionApp = new conection.Chinnook();
        connectionApp.checkConnectionIcon('connectionIconChinookPlataform');

        var loginsessionApp = new sessionlogin.Chinnook();
        hasConnection = loginsessionApp.verifieSessionLogin('panelChinookPlataform', 'panelChinookPlataformText');

        var chinookApp = new chinookplataform.Chinnook();
        chinookApp.layoutAspects();
    }

    $('body').on('click', '#regreshPageChinookPlataform', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new chinookplataform.Chinnook();
        classApp.refreshAllChinookPlataformContent();

        $("#chinookplataformPanel").panel("close");
    });

    $('body').on('click', '#exitChinookPlataform', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}

$(document).on("pageshow", "#chinookPlataformPage", function () {
    var chinookApp = new chinookplataform.Chinnook();
    chinookApp.refreshAllChinookPlataformContent();
});

