var contacts = contacts || {};

var hasConnection = false;

contacts.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#contactsPanel :first-child").removeClass("ui-panel-inner");
        $("#contactsPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.refreshAllContactsContent = function refreshAllContactsContent() {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconContacts');

        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelContacts', 'panelContactsText');

        var contactsApp = new contacts.Chinnook();
        contactsApp.layoutAspects();

        $.mobile.loading('hide');
    }

    $('body').on('click', '#regreshPageContacts', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new contacts.Chinnook();
        classApp.refreshAllContactsContent();

        $("#contactsPanel").panel("close");
    });

    $('body').on('click', '#exitContacts', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}

$(document).on("pageshow", "#contactsPage", function () {
    var contactsApp = new contacts.Chinnook();
    contactsApp.refreshAllContactsContent();
});

