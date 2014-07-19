
var conection = conection || {};

conection.Chinnook = function Chinnook() {
    this.visualstudiowebdeveloper = "http://localhost:4277/api/";
    this.iis = "http://192.168.1.231:8083/api/";
    this.webserverver = "http://chinooksl.somee.com/ChinookService/api/";
    this.lastFM = "http://ws.audioscrobbler.com/2.0/";
    
    this.currentConnection = this.webserverver;

    this.checkConnection = function checkConnection() {
        try {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.NONE] = 'No network connection';

            if (states[networkState] == states[Connection.NONE]) {
                return false;
            }
            else {
                if (window.localStorage.getItem("localmode") !== null) {
                    return false;
                }
                else {
                    var toSlow = this.toSlowConnection();

                    if (toSlow === false) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        catch (e) {
            return false;
        }
    }

    //this.checkConnection = function checkConnection() {
    //    return true;
    //}

    this.toSlowConnection = function toSlowConnection() {
        var response;

        try {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: this.lastFM + "?method=artist.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=Metallica&format=json",
                cache: false,
                timeout: 15000,
                async:false,
                error: function(x, t, m) {
                    if (t === "timeout") { 
                        response = true;
                    } else {
                        response = true;
                    }
                },
                success: function (data) {
                    response = false;
                }
            });
        }
        catch (e) {
            response = true;
        }

        return response;
    }

    this.checkConnectionIcon = function checkConnectionIcon(idIcon) {
        var hasConnection = this.checkConnection();

        if (hasConnection)
        {
            $('#' + idIcon).removeClass('ui-icon-delete');
            $('#' + idIcon).addClass('ui-icon-check');
        }
        else
        {
            $('#' + idIcon).removeClass('ui-icon-check');
            $('#' + idIcon).addClass('ui-icon-delete');
        }

        return hasConnection;
    }

    
}
