var album = album || {};

var hasConnection = false;

album.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#albumPanel :first-child").removeClass("ui-panel-inner");
        $("#albumPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.bindHeader = function bindHeader(classe, album, artist) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        artist_ = unescape(artist);
        title_ = unescape(album);
        
        if (artist_[artist_.length - 1] == "#") {
            artist_ = artist_.slice(0, -1);
        }

        var mainElement = $('#contentList');
        mainElement.empty();

        mainElement.append('<li id="title" data-role="list-divider" style="background-color: #373737;"><div style="float:left;">' + title_ + '</div>');
        
        var titleElement = $('#title');
        var favouritesAlbumsLocalStorage = window.localStorage.getItem("favouritesAlbums");

        var inFavourites = false;

        if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0)
        {
            titleElement.append('<div style="float:right;"><a href="#" onclick="var classe = new album.Chinnook(); classe.addToFavourites();"  class="ui-btn ui-shadow ui-corner-all ui-icon-star ui-btn-icon-notext">Search</a></div>');
        }
        else
        {
            var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);
 
            var jsUtilsApp = new jsUtils.Chinnook();
            var existsAlbumInLocalStorage = jsUtilsApp.findKeyValueInJson(jsonObj.albums, 'title', title_);

            if (existsAlbumInLocalStorage == null || existsAlbumInLocalStorage.length === 0)
            {
                titleElement.append('<div style="float:right;"><a href="#"  onclick="var classe = new album.Chinnook(); classe.addToFavourites();"  class="ui-btn ui-shadow ui-corner-all ui-icon-star ui-btn-icon-notext">Search</a></div>');
            }
            else
            {
                var inFavourites = true;

                titleElement.append('<div style="float:right;"><a href="#" onclick="var classe = new album.Chinnook(); classe.removeFromFavourites();"  class="ui-btn ui-btn-icon-left ui-icon-star ui-mini">My Favourites</a></div>');
            }
        }

        classe.bindHeaderArtist(classe, title_, artist_, inFavourites);
    }

    this.bindHeaderArtist = function bindHeaderArtist(classe, title, artist, inFavourites) {
        artist_ = unescape(artist);

        var mainElement = $('#contentList');
        mainElement.append('<li data-mini="true" data-theme="b" data-icon="false"><a href="artist.html?artist=' + escape(artist_) + '" data-mini="true" class="ui-btn" style="font-size: 12px; padding: 0.5em 1.3em;height:18px;">' + artist_ + '&nbsp;&nbsp;<small>Visit Artist</small></a></li>');
     
        classe.bindAlbumInfo(classe, title, artist,inFavourites);
    }

    this.bindAlbumInfo = function bindAlbumInfo(classe, album, artist, inFavourites) {
        var mainElement = $('#contentList');
        mainElement.append('<li id="albumInfoContent" data-theme="a" data-icon="false"></li><li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> PlayList </a></li>');

        var contentInfo = $('#albumInfoContent');

        var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + escape(artist) + "&album=" + escape(album) + "&format=json";
        $.ajax({
            type: "GET",
            dataType: "json",
            url: classe.lastFMBaseUrl + imageUrl,
            cache: false,
            timeout: 3000,
            error: function (a, b, c) {
                contentInfo.append('<a href="#"><img src="../../img/unknowAlbum.jpg" style="float:left;height:125px;margin-right:15px;" />');
                contentInfo.append('<p style="white-space: normal;overflow: visible;"> No information found </p>');

                var date = $('#releaseDate');
                date.append('<small> Unknown Release Date </small>');
               
                classe.bindAlbumTracks(classe, album, artist,inFavourites);
            },
            success: function (data) {
                try
                {
                    if (data.album != null && (data.album.image[2])['#text'] != "") {
                        contentInfo.append('<a href="#popupImage" data-transition="slidedown" data-rel="popup" data-position-to="window"><img src="' + (data.album.image[2])['#text'] + '" style="float:left;height:125px;margin-right:15px;" />');

                        var popupImage = $('#popupImage');
                        popupImage.append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>');
                        popupImage.append('<img width="250" height="250" src="' + (data.album.image[2])['#text'] + '" style="" />');
                    }
                    else if (data.album != null && (data.album.image[1])['#text'] != "") {
                        contentInfo.append('<a href="#popupImage" data-transition="slidedown" data-rel="popup" data-position-to="window"><img src="' + (data.album.image[1])['#text'] + '" style="float:left;height:125px;margin-right:15px;" />');

                        var popupImage = $('#popupImage');
                        popupImage.append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>');
                        popupImage.append('<img width="250" height="250" src="' + (data.album.image[1])['#text'] + '" style="" />');
                    }
                    else {
                        contentInfo.append('<a href="#"><img src="../../img/unknowAlbum.jpg" style="float:left;height:125px;margin-right:15px;" />');
                    }

                    if (data.album != null && data.album.wiki != undefined && data.album.wiki.summary != "") {
                        contentInfo.append('<p style="white-space: normal;overflow: visible;">' + data.album.wiki.summary + '</p>');
                    }
                    else {
                        contentInfo.append('<p style="white-space: normal;overflow: visible;"> No information found </p>');
                    }

                    var date = $('#title');
                    if (data.album != null && data.album.releasedate != undefined && data.album.releasedate != '') {
                        date.append('<br/><small>' + (data.album.releasedate.split(','))[0] + '</small>')
                    }
                    else {
                        date.append('<br/><small> Unknown Release Date </small>');
                    }
                }
                catch (e) {

                }

                classe.bindAlbumTracks(classe, album, artist, inFavourites);
               
            }
        });

        mainElement.listview("refresh");
    }

    this.bindAlbumTracks = function bindAlbumTracks(classe, album, artist, inFavourites)
    {
        var mainElement = $('#contentList');
       
        if(inFavourites == false && hasConnection == true)
        {
            var url = this.baseUrl;
            var sessionCont = new sessionlogin.Chinnook();
            
            if (sessionCont.isAuthenticated()) {
                var username = sessionCont.getUsername();

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: url + "TrackService/GetAllTracksInfoBuy?albumName=" + album + "&username=" + username,
                    cache: false,
                    timeout: 20000,
                    async: false,
                    error: function (a, b, c) {
                        $.mobile.loading('hide');
                    },
                    success: function (data) {
                        var obj = JSON.parse(data);

                        mainElement.append('<li data-theme="b" data-inset="false"> <fieldset id="fieldsetTracks" data-role="controlgroup" data-mini="true" data-iconpos="right" data-inset="false">');

                        var fieldsetTracks = $('#fieldsetTracks'); fieldsetTracks.empty();

                        fieldsetTracks.append('<label for="all">&nbsp;<span class="ui-li-count"> All </span>  </label>');
                        fieldsetTracks.append('<input type="checkbox" name="favcolor" id="all" value="all" onclick="var tmp = new album.Chinnook(); tmp.selectDeselectAll(this)"/>');

                        $.each(obj, function (index, value) {
                            fieldsetTracks.append('<label id="label_' + value.Name + '" for="' + value.Name + '">' + value.Name + '<br/><span class="ui-li-count" style="position:initial;">' + value.UnitPrice + '</span></label>');

                            if (value.buyed == true) {
                                fieldsetTracks.append('<input class="buyed" type="checkbox" data-price="' + value.UnitPrice + '" name="favcolor" id="' + value.Name + '" value="' + value.Name + '" checked="true" disabled="true"  />');
                            }
                            else {
                                fieldsetTracks.append('<input type="checkbox" data-price="' + value.UnitPrice + '" name="favcolor" id="' + value.Name + '" value="' + value.Name + '"/>');
                            }

                        })
                      
                        mainElement.trigger('create');
                        mainElement.listview("refresh");
                        fieldsetTracks.css('display', 'block');

                        $.mobile.loading('hide');
                    }
                });
            }
            else {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: url + "TrackService/GetTracks?albumName=" + escape(album),
                    cache: false,
                    timeout: 30000,
                    error: function () {
                        var mainElement = $('#contentList');
                        mainElement.append('<div>Sorry,playlist not find</div>');

                        mainElement.listview("refresh");

                        $.mobile.loading('hide');
                    },
                    success: function (data) {
                        var mainElement = $('#contentList');
                        mainElement.append('<li data-theme="b" data-inset="false"> <fieldset id="fieldsetTracks" data-role="controlgroup" data-mini="true" data-iconpos="right" data-inset="false">');

                        var jsonTracksObj = JSON.parse(data);
                        var fieldsetTracks = $('#fieldsetTracks'); fieldsetTracks.empty();
                        fieldsetTracks.css('display', 'none');

                        fieldsetTracks.append('<label for="all">&nbsp;<span class="ui-li-count"> All </span>  </label>');
                        fieldsetTracks.append('<input type="checkbox" name="favcolor" id="all" value="all" onclick="var tmp = new album.Chinnook(); tmp.selectDeselectAll(this)"/>');

                        $.each(jsonTracksObj, function (index, value) {
                                fieldsetTracks.append('<label id="label_' + value.Name + '" for="' + value.Name + '">' + value.Name + '<br/><span class="ui-li-count" style="position:initial;">' + value.UnitPrice + '</span></label>');
                                fieldsetTracks.append('<input type="checkbox" data-price="' + value.UnitPrice + '" name="favcolor" id="' + value.Name + '" value="' + value.Name + '"/>');
                        });

                        mainElement.trigger('create');
                        mainElement.listview("refresh");
                        fieldsetTracks.css('display', 'block');

                        $.mobile.loading('hide');
                    }
                });
            }
        }
        else
        {
            var favouritesAlbumsLocalStorage = window.localStorage.getItem("favouritesAlbums");
            var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);

            var jsUtilsApp = new jsUtils.Chinnook();
            var existsAlbumInLocalStorage = jsUtilsApp.findKeyValueInJson(jsonObj.albums, 'title', album);

            if (existsAlbumInLocalStorage != null && existsAlbumInLocalStorage.length > 0)
            {
                var tracks = existsAlbumInLocalStorage[0].tracks;

                mainElement.append('<li data-theme="b" data-inset="false"> <fieldset id="fieldsetTracks" data-role="controlgroup" data-mini="true" data-iconpos="right" data-inset="false">');
             
                var fieldsetTracks = $('#fieldsetTracks'); fieldsetTracks.empty();
                fieldsetTracks.css('display', 'none');

                fieldsetTracks.append('<label for="all">&nbsp;<span class="ui-li-count"> All </span>  </label>');
                fieldsetTracks.append('<input type="checkbox" name="favcolor" id="all" value="all" onclick="var tmp = new album.Chinnook(); tmp.selectDeselectAll(this)"/>');

                $.each(tracks, function (index, value) {
                    fieldsetTracks.append('<label id="label_' + value.title + '" for="' + value.title + '">' + value.title + '<br/><span class="ui-li-count" style="position:initial;">' + value.price + '</span></label>');

                    if (value.selected == true) {
                        fieldsetTracks.append('<input class="buyed" type="checkbox" data-price="' + value.price + '" name="favcolor" id="' + value.title + '" value="' + value.title + '" checked="true" disabled="true" />');
                    }
                    else
                    {
                        fieldsetTracks.append('<input type="checkbox" data-price="' + value.price + '" name="favcolor" id="' + value.title + '" value="' + value.title + '"/>'); 
                    }
                }) 
            }
            else
            {
                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
            }

            mainElement.trigger('create');
            mainElement.listview("refresh");
            fieldsetTracks.css('display', 'block');

            $.mobile.loading('hide');
        }
    }

    this.addToFavourites = function addToFavourites() {
        var jsUtilsApp = new jsUtils.Chinnook();

        var title = unescape(jsUtilsApp.getUrlVars()["album"]);
        var artist = unescape(jsUtilsApp.getUrlVars()["artist"]);

        var favouritesAlbumsLocalStorage = window.localStorage.getItem("favouritesAlbums");

        var tracks = [];
      
        $("#fieldsetTracks input[type='checkbox']").each(function () {
            if($(this).prop('id') !== 'all') {
                var track = {
                    title: $(this).prop('id'),
                    price: $(this).data('price'),
                    selected: $(this).hasClass('buyed')
                }

                tracks.push(track);
            }
        });
       
        var album = {
            title: title,
            artist: artist,
            tracks: tracks
        }

        if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
            var albums = {
                albums: [album]
            }

            var jsonString = JSON.stringify(albums);

            window.localStorage.setItem("favouritesAlbums", jsonString);
        }
        else {
            var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);
            jsonObj.albums.push(album);
            var jsonString = JSON.stringify(jsonObj);
            localStorage.setItem("favouritesAlbums", jsonString);
        }

        this.bindHeader(this, jsUtilsApp.getUrlVars()["album"], jsUtilsApp.getUrlVars()["artist"]);
    }

    this.removeFromFavourites = function removeFromFavourites() {
        var jsUtilsApp = new jsUtils.Chinnook();

        var title = unescape(jsUtilsApp.getUrlVars()["album"]);
        var artist = unescape(jsUtilsApp.getUrlVars()["artist"]);

        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

        if (favouritesAlbumsLocalStorage !== null && favouritesAlbumsLocalStorage.length !== 0) {
            var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);

            var index = -1;

            for (i = 0; i < jsonObj.albums.length; i++) {
                if (jsonObj.albums[i].title === title) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                jsonObj.albums.splice(index, 1);
            }

            var jsonString = JSON.stringify(jsonObj);
            localStorage.setItem("favouritesAlbums", jsonString);
        }

        this.bindHeader(this, jsUtilsApp.getUrlVars()["album"], jsUtilsApp.getUrlVars()["artist"]);
    }

    this.selectDeselectAll = function selectDeselectAll(e) {
        if ($("#all").is(':checked')) {
            $("#fieldsetTracks input[type='checkbox']").each(function () {
                if (!$(this).hasClass('buyed'))
                {
                    $(this).prop('checked', true);
                }
            });
        }
        else {
            $("#fieldsetTracks input[type='checkbox']").each(function () {
                if (!$(this).hasClass('buyed')) {
                    $(this).prop('checked', false);
                }
                
            });
        }

        var mainElement = $('#contentList');
        mainElement.trigger('create'); 
        mainElement.listview("refresh");
    }

    this.refreshAllAlbumContent = function refreshAllAlbumContent() {
        var jsUtilsApp = new jsUtils.Chinnook();

        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconAlbum');

        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelAlbum', 'panelAlbumText');

        var title = jsUtilsApp.getUrlVars()["album"]; title = unescape(title);
        var artist = jsUtilsApp.getUrlVars()["artist"]; artist = unescape(artist); 

        var mainElement = $('#contentList');
        mainElement.empty();

        var albumApp = new album.Chinnook();
        albumApp.layoutAspects();
        albumApp.bindHeader(albumApp, title, artist);
    }

    this.buy = function buy() {
        if (hasConnection) {
            var sessionCont = new sessionlogin.Chinnook();

            if (sessionCont.isAuthenticated()) {
                var username = sessionCont.getUsername();

                this.prepareRequest(username);
            }
            else {
                $("#alertmustbeAuthenticated").css('display', 'block');
                $("#mustbeAuthenticated").click();
            }
        }
        else {
            $("#alertmustbeOnlineMode").css('display', 'block');
            $("#mustbeOnlineMode").click();
        }
    }

    this.getSelectedTracks = function getSelectedTracks() {
        var tracks = [];

        $("#fieldsetTracks input[type='checkbox']").each(function () {
            if ($(this).attr("id") != "all" && $(this).is(':checked') && (!$(this).hasClass('buyed'))) {
                tracks.push({
                    name : $(this).attr("id"),
                    price : $(this).attr("data-price")
                });
            }
        });
        return tracks;
    }

    this.prepareRequest = function prepareRequest(username_) {
        var jsUtilsApp = new jsUtils.Chinnook();

        var title_ = unescape(jsUtilsApp.getUrlVars()["album"]); 
        var artist_ = unescape(jsUtilsApp.getUrlVars()["artist"]);
       
        var tracks_ = this.getSelectedTracks();
        
        if (tracks_.length == 0) {
            $("#alertAnyTrackSelected").css('display', 'block');
            $("#anyTrackSelected").click();
        }
        else
        {
            var inFavourites_ = null;

            var favouritesAlbumsLocalStorage = window.localStorage.getItem("favouritesAlbums");
            if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
                inFavourites_ = false;
            }
            else {
                var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);

                var jsUtilsApp = new jsUtils.Chinnook();
                var existsAlbumInLocalStorage = jsUtilsApp.findKeyValueInJson(jsonObj.albums, 'title', unescape(jsUtilsApp.getUrlVars()["album"]));

                if (existsAlbumInLocalStorage == null || existsAlbumInLocalStorage.length === 0) {
                    inFavourites_ = false;
                }
                else {
                    inFavourites_ = true;
                }
            }

            if (artist_[artist_.length - 1] == "#") {
                artist_ = artist_.slice(0, -1);
            }

            var requestObj = {
                username: username_,
                title: title_,
                artist: artist_,
                favourites: inFavourites_,
                tracks: tracks_,
                smartphone: true
            }

            var stringObj = JSON.stringify(requestObj);
            this.doTransactionRequest(stringObj, inFavourites_, title_,artist_);
        }
    }

    this.doTransactionRequest = function doTransactionRequest(jsonString, inFavourites, albumName, artist) {
        var jsUtilsApp = new jsUtils.Chinnook();

        $.mobile.loading('show', {
            text: 'Transaction request...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        $.ajax({
            type: "POST",
            url: this.baseUrl + "PurchasesService/buyTransaction",
            data: { "": jsonString },
            cache: false,
            error: function (a, b, c) {
                $.mobile.loading('hide');
                $("#serverError").click();
            },
            success: function (data) {
                var response = JSON.parse(data);

                if (response.status === "SERVER ERROR") {
                    $.mobile.loading('hide');
                    $("#alertServerError").css('display', 'block');
                    $("#serverError").click();
                }
                else if (response.status === "ARTIST NOT FOUND") {
                    $.mobile.loading('hide');
                    $("#alertArtistNotExists").css('display', 'block');
                    $("#artistNotExists").click();
                }
                else if (response.status === "ALBUM NOT FOUND") {
                    $.mobile.loading('hide');
                    $("#alertAlbumNotExists").css('display', 'block');
                    $("#albumNotExists").click();
                }
                else if (response.status === "TRACKS COUNTER") {
                    $.mobile.loading('hide');
                    $("#alertTracksCounter").css('display', 'block');
                    $("#tracksCounter").click();
                }
                else if (response.status === "ALBUM NOT SYNC") {
                    $.mobile.loading('hide');
                    $("#alertAlbumNotSync").css('display', 'block');
                    $("#albumNotSync").click();
                }
                else if (response.status === "TIME PLAN") {
                    $.mobile.loading('hide');
                    $("#alertTimePlan").css('display', 'block');
                    $("#timePlan").click();
                }
                else if (response.status === "OK") {
                    $.mobile.loading('hide');
                   
                    if (inFavourites === true) {
                        var favouritesAlbumsLocalStorage = window.localStorage.getItem("favouritesAlbums");
                        var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);

                        var jsUtilsApp = new jsUtils.Chinnook();
                        var existsAlbumInLocalStorage = jsUtilsApp.findKeyValueInJson(jsonObj.albums, 'title', unescape(jsUtilsApp.getUrlVars()["album"]));

                        var tracks = existsAlbumInLocalStorage[0].tracks;
                        var tracksSubmited = JSON.parse(response.notification);
                        $.each(tracks, function (index, value) {
                            $.each(tracksSubmited, function (index_, value_) {
                                if (value_.name == value.title) {
                                    value.selected = true;
                                }
                            })
                        })

                        var jsonObj_ = JSON.parse(favouritesAlbumsLocalStorage);

                        //Remove from Local Storage to update info
                        var index = -1;

                        for (i = 0; i < jsonObj_.albums.length; i++) {
                            if (jsonObj_.albums[i].title === unescape(jsUtilsApp.getUrlVars()["album"])) {
                                index = i;
                                break;
                            }
                        }

                        if (index > -1) {
                            jsonObj_.albums.splice(index, 1);
                        }

                        var jsonString_ = JSON.stringify(jsonObj_);
                        localStorage.setItem("favouritesAlbums", jsonString_);

                        //Add Album To Local Storage
                        var album = {
                            title: unescape(jsUtilsApp.getUrlVars()["album"]),
                            artist: artist,
                            tracks: tracks
                        }

                        var albums = {
                            albums: [album]
                        }

                        var jsonString__ = JSON.stringify(albums);

                        window.localStorage.setItem("favouritesAlbums", jsonString__);

                        jsonObj_.albums.push(album);
                        var jsonString__ = JSON.stringify(jsonObj_);
                        localStorage.setItem("favouritesAlbums", jsonString__);
                    }
                   
                    $('#alertTransactionSubmited').css('display', 'block');
                    $("#transactionSubmited").click();
                }
            }  
        });
    }

    $('body').on('click', '#regreshPageAlbum', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new album.Chinnook();
        classApp.refreshAllAlbumContent();

        $("#albumPanel").panel("close");
    });

    $('body').on('click', '#exitAlbum', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
 
}

$(document).on("pageshow", "#albumPage", function () {
    var albumApp = new album.Chinnook();
    albumApp.refreshAllAlbumContent();
});

