var artist = artist || {};

var hasConnection = false;

artist.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#artistPanel :first-child").removeClass("ui-panel-inner");
        $("#artistPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.bindHeader = function bindHeader(classe, artist) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });
 
        artist_ = unescape(artist);
       
        var artistInfo = $('#artistHeaderInfo');
        artistInfo.css('display', 'none');


        var mainElement = $('#artistAlbumsListView');
        mainElement.css('display', 'none');

        artistInfo.empty();

        artistInfo.append('<li id="artistHeader" data-role="list-divider" style="background-color: #373737;"><div style="float:left;">' + artist_);

        var titleElement = $('#artistHeader');

        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");
 
        if (favouritesArtistsLocalStorage === null || favouritesArtistsLocalStorage.length === 0) {
            console.log('favouritesArtistsLocalStorage === null || favouritesArtistsLocalStorage.length === 0');

            titleElement.append('<div style="float:right;"><a href="#" onclick="var classe = new artist.Chinnook(); classe.addToFavourites();" class="ui-btn ui-shadow ui-corner-all ui-icon-star ui-btn-icon-notext">Search</a></div></li>');
        }
        else {
            var jsonObj = JSON.parse(favouritesArtistsLocalStorage);
        
            var jsUtilsApp = new jsUtils.Chinnook();
            var existsArtistsInLocalStorage = jsUtilsApp.findKeyValueInJson(jsonObj.artists, 'artist', artist_);
          
            if (existsArtistsInLocalStorage == null || existsArtistsInLocalStorage.length === 0) {
                titleElement.append('<div style="float:right;"><a href="#" onclick="var classe = new artist.Chinnook(); classe.addToFavourites();" class="ui-btn ui-shadow ui-corner-all ui-icon-star ui-btn-icon-notext">Search</a></div></li>');
            }
            else {
                titleElement.append('<div style="float:right;"><a href="#" onclick="var classe = new artist.Chinnook(); classe.removeFromFavourites();" class="ui-btn ui-btn-icon-left ui-icon-star ui-mini">My Favourites</a></div>');
            }

        }

        classe.bindHeaderArtistInfo(classe, artist);
    }

    this.bindHeaderArtistInfo = function bindAlbumInfo(classe, artist) {
        artist_ = escape(artist);

        var contentInfo = $('#artistHeaderInfo');
        contentInfo.append('<li id="artistInfoContent" class="ui-li-static ui-body-a" data-theme="a" data-icon="false" style="padding-bottom: 30px;"></li>');
        var contentInfoContent = $('#artistInfoContent')

        var headerInfo = $('#artistHeader');

        var imageUrl = "?method=artist.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + artist + "&format=json";
        $.ajax({
            type: "GET",
            dataType: "json",
            url: classe.lastFMBaseUrl + imageUrl,
            cache: false,
            timeout: 20000,
            error: function (a, b, c) {
                contentInfoContent.append('<a href="#"><img src="../../img/unknowArtist.jpg" style="float:left;height:125px;margin-right:15px;" />');
                contentInfoContent.append('<p style="white-space: normal;overflow: visible;"> No information found </p>');

                headerInfo.append('<br/><small> Unknown Formation Date </small>');

                contentInfo.listview("refresh");

                headerInfo.css('display', 'block');
                contentInfo.css('display', 'block');
                contentInfoContent.css('display', 'block');

                classe.bindArtistAlbums(classe, artist);
            },
            success: function (data) {
                if (data.artist != undefined && (data.artist.image[2])['#text'] != "") {
                    contentInfoContent.append('<a href="#popupArtistImage" data-transition="slidedown" data-rel="popup" data-position-to="window"><img src="' + (data.artist.image[2])['#text'] + '" style="float:left;height:125px;margin-right:15px;" />');

                    var popupImage = $('#popupArtistImage');
                    popupImage.append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>');
                    popupImage.append('<img width="250" height="250" src="' + (data.artist.image[2])['#text'] + '" style="" />');
                }
                else if (data.artist != undefined && (data.artist.image[1])['#text'] != "") {
                    contentInfoContent.append('<a href="#popupArtistImage" data-transition="slidedown" data-rel="popup" data-position-to="window"><img src="' + (data.artist.image[1])['#text'] + '" style="float:left;height:125px;margin-right:15px;" />');

                    var popupImage = $('#popupArtistImage');
                    popupImage.append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>');
                    popupImage.append('<img width="250" height="250" src="' + (data.artist.image[1])['#text'] + '" style="" />');
                }
                else {
                    contentInfoContent.append('<a href="#"><img src="../../img/unknowAlbum.jpg" style="float:left;height:125px;margin-right:15px;" />');
                }

                if (data.artist != undefined && data.artist.bio != undefined && data.artist.bio.summary != "") {
                    contentInfoContent.append('<p style="white-space: normal;overflow: visible;">' + data.artist.bio.summary + '</p>');
                }
                else {
                    contentInfoContent.append('<p style="white-space: normal;overflow: visible;"> No information found </p>');
                }

                if (data.artist != undefined && data.artist.bio != undefined && data.artist.bio.formationlist != undefined && data.artist.bio.formationlist.formation != undefined && data.artist.bio.formationlist.formation.yearfrom != '') {
                    headerInfo.append('<br/><small>' + data.artist.bio.formationlist.formation.yearfrom + '</small>')
                }
                else {
                    headerInfo.append('<br/><small> Unknown Formation Date </small>');
                }
         
                contentInfo.listview("refresh");

                headerInfo.css('display', 'block');
                contentInfo.css('display', 'block');
                contentInfoContent.css('display', 'block');

                classe.bindArtistAlbums(classe, artist);
            }
        });


    }

    this.bindArtistAlbums = function bindArtistAlbums(classe, artist) {
        if (hasConnection) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: this.baseUrl + "albumservice/getalbums?artistname=" + artist, 
                cache: false,
                timeout: 20000,
                error: function (a, b, c) {
                    alert('error: ' + a + " ; " + b + " ; " + c);
                },
                success: function (data) {
                    classe.getArtistsAlbumsContent(classe, data, artist);
                }
            });
        }
        else
        {
            classe.getArtistsAlbumsContentFromLocalStorage(classe, artist);
        }
    
    }

    this.getArtistsAlbumsContent = function getArtistsAlbumsContent(classe, data, artist) {
        var contentInfo = $('#artistHeaderInfo');

        var mainElement = $('#artistAlbumsListView');
        mainElement.css('display', 'none');
        mainElement.empty();

        var jsonArtistsObj = JSON.parse(data);
      
        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Albums </a></li>');

        if (jsonArtistsObj.length > 0) {
            $.each(jsonArtistsObj, function (index, value) {
                var albumsItems = "<li><a href='album.html?album=" + escape(value.Title) + "&artist=" +  escape(artist) + "'>";
                albumsItems += "<img style='padding:8px;' src='";
         
                var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + artist + "&album=" + value.Title + "&format=json";
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: classe.lastFMBaseUrl + imageUrl,
                    cache: false,
                    timeout: 20000,
                    error: function (a, b, c) {
                        albumsItems += "../../img/unknowAlbum.jpg" + "'>";
                        albumsItems += "<h2>" + value.Title + "</h2>";
                        albumsItems += "<p>" + value.Name + "</p>";
                        albumsItems += "</a><li>";

                        mainElement.append(albumsItems);
                        mainElement.listview("refresh");
                        mainElement.find('li.ui-li-static').remove();

                        contentInfo.listview("refresh");
                 
                        mainElement.css('display', 'block');

                        $.mobile.loading('hide');
                    },
                    success: function (data) {
                        if (data.message === "Album not found") {
                            albumsItems += "../../img/unknowAlbum.jpg" + "'>";
                        }
                        else {
                            if ((data.album.image[1])['#text'] != "") {
                                albumsItems += (data.album.image[1])['#text'] + "'>";
                            }
                            else if ((data.album.image[2])['#text'] != "") {
                                albumsItems += (data.album.image[2])['#text'] + "'>";
                            }
                            else {
                                albumsItems += "../../img/unknowAlbum.jpg" + "'>";
                            }

                        }

                        albumsItems += "<h2>" + value.Title + "</h2>";

                        if (data.album != undefined && data.album.releasedate != undefined && data.album.releasedate != '') {
                            albumsItems += "<p>" + (data.album.releasedate.split(','))[0] + "</p>";
                        }
                        else {
                            albumsItems += "<p>Unknown Release Date</p>";
                        }

                        albumsItems += "</a><li>";

                        mainElement.append(albumsItems);
                        mainElement.listview("refresh");
                        mainElement.find('li.ui-li-static').remove();

                        contentInfo.listview("refresh");
              
                        mainElement.css('display', 'block');

                        $.mobile.loading('hide');
                    }
                })
            })
        }
        else
        {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

            mainElement.listview("refresh");
            mainElement.find('li.ui-li-static').remove();

            contentInfo.listview("refresh");

            mainElement.css('display', 'block');

            $.mobile.loading('hide');
        }
       
    }

    this.getArtistsAlbumsContentFromLocalStorage = function getArtistsAlbartistHeaderInfoumsContent(classe, artist) {
        var contentInfo = $('#artistHeaderInfo');

        var mainElement = $('#artistAlbumsListView');
        mainElement.css('display', 'none');

        mainElement.empty();

        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Albums in device </a></li>');

        var favouriteAlbumsInLocalStorage = localStorage.getItem("favouritesAlbums");

        if (favouriteAlbumsInLocalStorage !== null && favouriteAlbumsInLocalStorage.length !== 0) {
            var objJsFavouritesAlbums = JSON.parse(favouriteAlbumsInLocalStorage);

            if (objJsFavouritesAlbums.albums.length > 0) {
                var jsUtilsApp = new jsUtils.Chinnook();
                var artistAlbums = jsUtilsApp.findKeyValueInJson(objJsFavouritesAlbums.albums, "artist", artist);

                if (artistAlbums.length > 0) {
                    $.each(artistAlbums, function (index, value) {
                        console.log(value);
                        var artist = escape(value.artist);
                        var title = escape(value.title);

                        var albumsItems = "<li><a href='album.html?album=" + escape(title) + "&artist=" + escape(artist) + "'>";
                        albumsItems += "<img style='padding:8px;' src='";

                        var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + artist + "&album=" + title + "&format=json";
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: classe.lastFMBaseUrl + imageUrl,
                            cache: false,
                            timeout: 20000,
                            error: function (a, b, c) {
                                albumsItems += "../../img/unknowAlbum.jpg" + "'>";
                                albumsItems += "<h2>" + title + "</h2>";
                                albumsItems += "<p>" + artist + "</p>";
                                albumsItems += "</a><li>";

                                mainElement.append(albumsItems);
                                mainElement.listview("refresh");
                                mainElement.find('li.ui-li-static').remove();

                                contentInfo.listview("refresh");

                                mainElement.css('display', 'block');

                                $.mobile.loading('hide');
                            },
                            success: function (data) {
                                if (data.message === "Album not found") {
                                    albumsItems += "../../img/unknowAlbum.jpg" + "'>";
                                }
                                else {
                                    if ((data.album.image[1])['#text'] != "") {
                                        albumsItems += (data.album.image[1])['#text'] + "'>";
                                    }
                                    else if ((data.album.image[2])['#text'] != "") {
                                        albumsItems += (data.album.image[2])['#text'] + "'>";
                                    }
                                    else {
                                        albumsItems += "../../img/unknowAlbum.jpg" + "'>";
                                    }

                                }

                                albumsItems += "<h2>" + value.title + "</h2>";

                                if (data.album != undefined && data.album.releasedate != undefined && data.album.releasedate != '') {
                                    albumsItems += "<p>" + (data.album.releasedate.split(','))[0] + "</p>";
                                }
                                else {
                                    albumsItems += "<p>Unknown Release Date</p>";
                                }

                                albumsItems += "</a><li>";

                                mainElement.append(albumsItems);

                                mainElement.listview("refresh");
                                mainElement.find('li.ui-li-static').remove();

                                mainElement.css('display', 'block');

                                contentInfo.listview("refresh");
                            }
                        })
                    })
                }
                else
                {
                    mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();

                    mainElement.css('display', 'block');

                    contentInfo.listview("refresh");
                }
            }
            else
            {
                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

                mainElement.listview("refresh");
                mainElement.find('li.ui-li-static').remove();

                mainElement.css('display', 'block');

                contentInfo.listview("refresh");
            }
        }
        else
        {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

            mainElement.listview("refresh");
            mainElement.find('li.ui-li-static').remove();

            mainElement.css('display', 'block');

            contentInfo.listview("refresh");
        }

 
        $.mobile.loading('hide');
    }

    this.addToFavourites = function addToFavourites() {
        var jsUtilsApp = new jsUtils.Chinnook();

        var artist = unescape(jsUtilsApp.getUrlVars()["artist"]);

        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

        var artist = {
            artist: artist
        }

        if (favouritesArtistsLocalStorage === null || favouritesArtistsLocalStorage.length === 0) {
            var artists = {
                artists: [artist]
            }

            var jsonString = JSON.stringify(artists);
            localStorage.setItem("favouritesArtists", jsonString);
        }
        else {
            var jsonObj = JSON.parse(favouritesArtistsLocalStorage);
            jsonObj.artists.push(artist);
            var jsonString = JSON.stringify(jsonObj);
            localStorage.setItem("favouritesArtists", jsonString);
        }

        this.bindHeader(this, unescape(jsUtilsApp.getUrlVars()["artist"]));
    }

    this.removeFromFavourites = function removeFromFavourites() {
        var jsUtilsApp = new jsUtils.Chinnook();

        var artist = unescape(jsUtilsApp.getUrlVars()["artist"]); 

        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

        if (favouritesArtistsLocalStorage !== null && favouritesArtistsLocalStorage.length !== 0) {
            var jsonObj = JSON.parse(favouritesArtistsLocalStorage);

            var index = -1;

            for (i = 0; i < jsonObj.artists.length; i++) {
                console.log(jsonObj.artists[i].artist)
                if (jsonObj.artists[i].artist === artist) {
                    index = i;
                    break;
                }
            }
         
            if (index > -1) {
                jsonObj.artists.splice(index, 1);
            }

            var jsonString = JSON.stringify(jsonObj);
            localStorage.setItem("favouritesArtists", jsonString);
        }

        this.bindHeader(this, unescape(jsUtilsApp.getUrlVars()["artist"]));
    }

    this.refreshAllArtistContent = function refreshAllArtistContent() {
        var jsUtilsApp = new jsUtils.Chinnook();

        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconArtist');

        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelAccountArtist', 'panelAccountTextArtist');

        var artistName = jsUtilsApp.getUrlVars()["artist"]; artistName = unescape(artistName);

        var artistHeaderInfo = $('#artistHeaderInfo');
        artistHeaderInfo.empty();
        var artistAlbumsList = $('#artistAlbumsListView');
        artistAlbumsList.empty();

        var artistApp = new artist.Chinnook();
        artistApp.layoutAspects();
        artistApp.bindHeader(artistApp, artistName);
    }

    $('body').on('click', '#regreshPageArtist', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new artist.Chinnook();
        classApp.refreshAllArtistContent();

        $("#artistPanel").panel("close");
    });

    $('body').on('click', '#exitArtist', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}



$(document).on("pageshow", "#artistPage", function () {
    var artistApp = new artist.Chinnook();
    artistApp.refreshAllArtistContent();
});


