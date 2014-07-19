var register = register || {};

var hasConnection = false;

register.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#registerPanel :first-child").removeClass("ui-panel-inner");
        $("#registerPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    $('#registerForm').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconFavourites');

        if (hasConnection) {
            if ($("#registerForm").valid()) {
                var email = $('#usernameRegister').val();
                var password = $('#passwordRegister').val();
                var passwordConfirm = $('#confirmpasswordRegister').val();

                $.mobile.loading('show', {
                    text: 'Waiting for Something Special...',
                    textVisible: true,
                    theme: 'b',
                    html: ""
                });

                var classe = new register.Chinnook();

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: classe.baseUrl + "CustomerService/GetCustomer?email=" + email + "&password=" + password + "&passwordConfirm=" + passwordConfirm,
                    cache: false,
                    timeout: 20000,
                    async: false,
                    error: function (a, b, c) {
                        alert('Erro: ' + a + " - " + b + " - " + c)

                        $.mobile.loading('hide');
                    },
                    success: function (data) {
                        var jsonResponse = JSON.parse(data);
                        jsonResponse = JSON.parse(jsonResponse);

                        if (jsonResponse.Response == "Email already registed") {
                            $.mobile.loading('hide');
                            $('#alertAuthenticationEmailRegistered').css('display', 'block');
                            $("#linkAuthenticationEmailRegistered").click();
                        }
                        else if (jsonResponse.Response == "Data not validated in server") {
                            $.mobile.loading('hide');
                            $('#alertAuthenticationNotValidatedServer').css('display', 'block');
                            $("#linkAuthenticationNotValidatedServer").click();
                        }
                        else if (jsonResponse.Response == "Error saving data in server") {
                            $.mobile.loading('hide');
                            $('#alertAuthenticationErrorServer').css('display', 'block');
                            $("#linkAuthenticationErrorServer").click();
                        }
                        else { //sucess
                            $.mobile.loading('hide');

                            var jsonSession = '{"username":"' + email + '", "password": "' + password + '"}';

                            window.sessionStorage.setItem("sessionUsername", jsonSession);
                            window.localStorage.setItem("sessionUsername", jsonSession);

                            window.location.href = "./home.html";
                        }
                    }
                });
            }
        }
        else
        {
            $('#alertmustbeOnlineMode').css('display', 'block');
            $("#mustbeOnlineMode").click();
        }
    });

    $("#registerForm").validate({
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
            },
            confirmpassword: {
                required: true,
                equalTo: "#passwordRegister"
            }
        },
        messages: {
            username: {
                required: "",
                email: "Email field"
            },
            password: "",
            confirmpassword: {
                required: "",
                equalTo: "Please enter the same password as above"
            }
        }
    });

    this.refreshAllRegisterContent = function refreshAllRegisterContent() {
        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelRegister', 'panelRegisterText');

        var registerApp = new register.Chinnook();
        registerApp.layoutAspects();

        var connectionApp = new conection.Chinnook();
        connectionApp.checkConnectionIcon('connectionIconRegister');
    }

    $('body').on('click', '#regreshPageRegister', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new register.Chinnook();
        classApp.refreshAllRegisterContent();

        $("#registerPanel").panel("close");
    });

    $('body').on('click', '#exitRegister', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}


$(document).on("pageshow", "#registerPage", function () {
    var registerApp = new register.Chinnook();
    registerApp.refreshAllRegisterContent();
});



