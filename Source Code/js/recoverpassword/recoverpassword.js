var recoverpassword = recoverpassword || {};

var hasConnection = false;

recoverpassword.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#recoverpasswordPanel :first-child").removeClass("ui-panel-inner");
        $("#recoverpasswordPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    $('#recoverpasswordForm').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconFavourites');

        var classe = new recoverpassword.Chinnook();

        if (hasConnection) {
            if ($("#recoverpasswordForm").valid()) {
                $('#buttonSubmit').attr('disabled', 'disabled');

                $.mobile.loading('show', {
                    text: 'Recovering password...',
                    textVisible: true,
                    theme: 'b',
                    html: ""
                });

                var username_email = $('#usernameRecover').val();

                var obj = {
                    username: username_email
                }

                var jsonString = JSON.stringify(obj);

                $.ajax({
                    type: "POST",
                    url: classe.baseUrl + "CustomerService/PostRecoverPassword",
                    data: { "": jsonString },
                    cache: false,
                    async: false,
                    error: function (a, b, c) {
                        $.mobile.loading('hide');

                        $('#alertServerError').css('display', 'block');
                        $("#serverError").click();
                        $('#buttonSubmit').removeAttr('disabled');
                    },
                    success: function (data) {
                        var response = JSON.parse(data);

                        $('#buttonSubmit').removeAttr('disabled');

                        if (response.status === "SERVER ERROR") {
                            $.mobile.loading('hide');
                            $('#alertServerError').css('display', 'block');
                            $("#serverError").click();
                        }
                        else if (response.status === "USERNAME NOT FOUND") {
                            $.mobile.loading('hide');
                            $('#alertEmailNotExists').css('display', 'block');
                            $("#emailNotExists").click();
                        }
                        else if (response.status === "OK") {
                            $.mobile.loading('hide');
                            $('#alertPasswordRecovered').css('display', 'block');
                            $("#passwordRecovered").click();
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

    $("#recoverpasswordForm").validate({
        errorPlacement: function (error, element) {
            error.insertAfter($(element).parent());
        },
        rules: {
            username: {
                required: true,
                email: true
            }
        },
        messages: {
            username: {
                required: "",
                email: "Email field"
            }
        }
    });

    this.refreshAllRecoverPasswordContent = function refreshAllRecoverPasswordContent() {
        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelRecoverpassword', 'panelRecoverpasswordText');

        var recoverpasswordApp = new recoverpassword.Chinnook();
        recoverpasswordApp.layoutAspects();

        var connectionApp = new conection.Chinnook();
        connectionApp.checkConnectionIcon('connectionIconRecoverPassword');
    }

    $('body').on('click', '#regreshPageRecoverPassword', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new recoverpassword.Chinnook();
        classApp.refreshAllRecoverPasswordContent();

        $("#recoverpasswordPanel").panel("close");
    });

    $('body').on('click', '#exitRecoverPassword', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}


$(document).on("pageshow", "#recoverpasswordPage", function () {
    var recoverpasswordApp = new recoverpassword.Chinnook();
    recoverpasswordApp.refreshAllRecoverPasswordContent();
});




