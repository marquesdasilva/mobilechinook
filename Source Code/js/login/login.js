var login = login || {};

var hasConnection = false;

login.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#loginPanel :first-child").removeClass("ui-panel-inner");
        $("#loginPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    $('#loginForm').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconFavourites');

        if (hasConnection) {
            if ($("#loginForm").valid()) {
                var email = $('#usernameLogin').val();
                var password = $('#passwordLogin').val();

                $.mobile.loading('show', {
                    text: 'Waiting for Something Special...',
                    textVisible: true,
                    theme: 'b',
                    html: ""
                });

                var classe = new login.Chinnook();

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: classe.baseUrl + "CustomerService/GetCustomerExists?email=" + email + "&password=" + password,
                    cache: false,
                    timeout: 20000,
                    async: false,
                    error: function (a, b, c) {
                        alert('Erro: ' + a + " - " + b + " - " + c)

                        $.mobile.loading('hide');
                    },
                    success: function (data) {
                        var jsonResponse = JSON.parse(data);

                        if (jsonResponse == true) {
                            var jsonSession = '{"username":"' + email + '", "password": "' + password + '"}';

                            window.sessionStorage.setItem("sessionUsername", jsonSession);
                            window.localStorage.setItem("sessionUsername", jsonSession);

                            $('#goBackLink').click();
                            e.stopImmediatePropagation();
                        }
                        else {
                            $.mobile.loading('hide');

                            $('#alertAuthenticationFailed').css('display', 'block');
                            $("#linkAuthenticationFailed").click();
                        }

                        $.mobile.loading('hide');
                    }
                });
            }
        }
        else {
            $('#alertmustbeOnlineMode').css('display', 'block');
            $("#mustbeOnlineMode").click();
        }
    });

    $("#loginForm").validate({
        errorPlacement: function (error, element) {
            error.insertAfter($(element).parent());
        },
        rules: {
            username: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {
            username: {
                required: "",
                email: "Email field"
            },
            password: ""
        }
    });

    this.refreshAllLoginContent = function refreshAllLoginContent() {
        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelLogin', 'panelLoginText');

        var loginApp = new login.Chinnook();
        loginApp.layoutAspects();

        var connectionApp = new conection.Chinnook();
        connectionApp.checkConnectionIcon('connectionIconLogin');
    }

    $('body').on('click', '#regreshPageLogin', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new login.Chinnook();
        classApp.refreshAllLoginContent();

        $("#loginPanel").panel("close");
    });

    $('body').on('click', '#exitLogin', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}


$(document).on("pageshow", "#loginPage", function () {
    var loginApp = new login.Chinnook();
    loginApp.refreshAllLoginContent();
});



