var purchases = purchases || {};

purchases.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;

    this.layoutAspects = function layoutAspects() {
        $("#purchasesPanel :first-child").removeClass("ui-panel-inner");
        $("#purchasesPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.initialize = function initialize() {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var classe = new purchases.Chinnook();

        var username = window.sessionStorage.getItem("sessionUsername");
        var username_email = JSON.parse(username).username;

        var elementUsername = $('#userEmailAcountPurchases');
        elementUsername.empty();
        elementUsername.append("<small>" + username_email + "</small>");

        this.getPurchases(classe,username_email);
    }

    this.getPurchases = function getPurchases(classe, username) {
        $('#infoContent').css('display','none');

        $.ajax({
            type: "GET",
            dataType: "json",
            url: classe.baseUrl + "PurchasesService/GetCustomerPurchases?username=" + username,
            cache: false,
            timeout: 10000,
            error: function (a, b, c) {
                $("#serverError").click();
            },
            success: function (data) {
                var responseObj = JSON.parse(data);

                if (responseObj.status == 'OK') {
                    $('#noPurchases').css('display', 'none');
                    $('#tableZone').css('display', 'block');
                    $('#serverErrorZone').css('display', 'none');

                    classe.fillTable(JSON.parse(responseObj.notification));
                }
                else if (responseObj.status == 'NO PURCHASES')
                {
                    $('#noPurchases').css('display', 'block');
                    $('#tableZone').css('display', 'none');
                    $('#serverErrorZone').css('display', 'none');

                    $('#infoContent').css('display', 'block');
                    $.mobile.loading('hide');
                }
                else //Server Error
                {
                    $('#noPurchases').css('display', 'none');
                    $('#tableZone').css('display', 'none');
                    $('#serverErrorZone').css('display', 'block');

                    $("#serverError").click();

                    $('#infoContent').css('display', 'block');
                    $.mobile.loading('hide');
                }
           
            }
        });
    }

    this.fillTable = function fillTable(obj) {
        var tableBody = $('#tableBody');
        tableBody.empty();
 
        $.each(obj, function (index, value) {
            var row = '<tr><td>' + value.title + '</td><td>' + value.artist + '</td><td><a href="album.html?album=' + value.title + '&artist=' + value.artist + '" class="ui-btn ui-btn-inline ui-icon-search ui-btn-icon-notext ui-corner-all ui-shadow">Search</a></td></tr>';

            tableBody.append(row);
        })

        $('#purchasesTable').trigger('create');
        $('#purchasesTable').table("refresh");

        $('#infoContent').css('display', 'block');

        $.mobile.loading('hide');
    }

    this.refreshAllAccountContent = function refreshAllAccountContent() {
        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelPurchases', 'panelPurchasesText');

        var appPurchases = new purchases.Chinnook();

        appPurchases.layoutAspects();
        appPurchases.initialize();

        var connectionApp = new conection.Chinnook();
        connectionApp.checkConnectionIcon('connectionIconPurchases');
    }

    $('body').on('click', '#regreshPagePurchases', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var appPurchases = new purchases.Chinnook();
        appPurchases.refreshAllAccountContent();

        $("#purchasesPanel").panel("close");
    });

    $('body').on('click', '#exitAccount', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}


$(document).on("pageshow", "#purchasesPage", function () {
    var appPurchases = new purchases.Chinnook();
    appPurchases.refreshAllAccountContent();
});



