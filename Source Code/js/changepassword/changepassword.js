var changepassword = changepassword || {};

var hasConnection = false;

changepassword.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#changepasswordPanel :first-child").removeClass("ui-panel-inner");
        $("#changepasswordPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    $('#changeForm').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconFavourites');

        var classe = new changepassword.Chinnook();

        if (hasConnection) {
            if ($("#changeForm").valid()) {
                $('#buttonSubmitChangePassword').attr('disabled', 'disabled');

                $.mobile.loading('show', {
                    text: 'Changing password...',
                    textVisible: true,
                    theme: 'b',
                    html: ""
                });

                var username_email = $('#usernameChange').val();
                var oldPassword = $('#passwordChange').val();
                var newPassword = $('#newpasswordChange').val();

                var obj = {
                    username: username_email,
                    oldpassword: oldPassword,
                    newpassword: newPassword
                }

                var jsonString = JSON.stringify(obj);
         
                $.ajax({
                    type: "POST",
                    url: classe.baseUrl + "CustomerService/PostChangePassword",
                    data: { "": jsonString },
                    cache: false,
                    async: false,
                    error: function (a, b, c) {
                        $.mobile.loading('hide');

                        $("#serverError").click();
                        $('#buttonSubmitChangePassword').removeAttr('disabled');
                    },
                    success: function (data) {
                        var response = JSON.parse(data);

                        $('#buttonSubmitChangePassword').removeAttr('disabled');

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
                        else if(response.status === "AUTHENTICATION ERROR")
                        {
                            $.mobile.loading('hide');
                            $('#alertAuthenticationError').css('display', 'block');
                            $("#authenticationError").click();
                        }
                        else if (response.status === "OK") {
                            $.mobile.loading('hide');
                            $('#alertPasswordChanged').css('display', 'block');
                            $("#passwordChanged").click();
                        }       
                    }
                });
            }
            else
            {
                $('#buttonSubmitChangePassword').removeAttr('disabled');
            }
        }
        else
        {
            $('#alertmustbeOnlineMode').css('display', 'block');
            $("#mustbeOnlineMode").click();
        }
        
    });

    $("#changeForm").validate({
        errorPlacement: function (error, element) {
            error.insertAfter($(element).parent());
        },
        rules: {
            username: {
                required: true,
                email: true
            },
            oldpasswordchange: {
                required: true
            },
            confirmpasswordchange: {
                required: true
            },
            confirmnewpasswordchange: {
                required: true,
                equalTo: "#newpasswordChange"
            }
        },
        messages: {
            username: {
                required: "",
                email: "Email field"
            },
            oldpasswordchange: {
                required: ""
            },
            confirmpasswordchange: {
                required: ""
            },
            confirmnewpasswordchange: {
                required: "",
                equalTo: "Please enter the same password as above"
            }
        }
    });

    this.refreshAllRecoverPasswordContent = function refreshAllRecoverPasswordContent() {
        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelChangepassword', 'panelChangepasswordText');

        var changepasswordApp = new changepassword.Chinnook();
        changepasswordApp.layoutAspects();

        var connectionApp = new conection.Chinnook();
        connectionApp.checkConnectionIcon('connectionIconChangePassword');
    }

    $('body').on('click', '#regreshPageChangePassword', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new changepassword.Chinnook();
        classApp.refreshAllRecoverPasswordContent();

        $("#changepasswordPanel").panel("close");
    });

    $('body').on('click', '#exitChangePassword', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}


$(document).on("pageshow", "#changepasswordPage", function () {
    $('#buttonSubmitChangePassword').removeAttr('disabled');

    var changepasswordApp = new changepassword.Chinnook();
    changepasswordApp.refreshAllRecoverPasswordContent();
});




