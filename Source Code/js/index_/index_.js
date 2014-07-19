var index_ = index_ || {};

var hasConnectionIndex = false;
var cordovaLoaded = false;

index_.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#indexPanel :first-child").removeClass("ui-panel-inner");
        $("#indexPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.initializeCarousell = function initializeCarousell() {
        $("#owl-demo_").owlCarousel({
            slideSpeed: 1500,
            singleItem: true,
            autoPlay: 7500,
            pagination: false
        });
    }

    this.bindContent = function bindContent(result) {
        if (result === false) { //noConnection or to much slow
            alert('bindContent no connection');
            $('#loading').css('display', 'none');
            $('#connection').css('display', 'none');
            $('#noconnection').css('display', 'block');
        }
        else
        {
            alert('bindContent connection');
            $('#loading').css('display', 'none');
            $('#noconnection').css('display', 'none')
            $('#connection').css('display', 'block');
        }
    }

    $('body').on('click', '#exitIndex', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });

    this.sleep = function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

}


$(document).on("pageshow", "#index_Page", function () {
    try
    {
        $('#noconnection').css('display', 'none')
        $('#connection').css('display', 'none')
        $('#loading').css('display', 'block');

        var classApp_ = new index_.Chinnook();
        classApp_.initializeCarousell();

        if (cordovaLoaded) {
            window.localStorage.removeItem("localmode");
  
            var connectionApp = new conection.Chinnook();
            var resultTestConnection = connectionApp.checkConnection();

            if (resultTestConnection === false) {
                alert('foreced');
                window.localStorage.setItem("localmode","");
            }

            classApp_.bindContent(resultTestConnection);
        }
    }
    catch (e) {

    }
});


$(document).ready(function () {
    // Wait for PhoneGap to load
    document.addEventListener("deviceready", onDeviceReady, false);

    // PhoneGap is loaded and it is now safe to make calls PhoneGap methods
    function onDeviceReady() {
        cordovaLoaded = true;
        $("#index_Page").trigger("pageshow");
    }
})

//$(document).ready(function () {

//    cordovaLoaded = true;
//    $("#index_Page").trigger("pageshow");
  
//})

