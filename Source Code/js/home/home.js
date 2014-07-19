var index = index || {};

var hasConnectionIndex = false;
var cordovaLoaded = false;

index.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();
    
    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#indexPanel :first-child").removeClass("ui-panel-inner");
        $("#indexPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    this.initializeCarousell = function initializeCarousell() {
        $("#owl-demo").owlCarousel({
            slideSpeed: 1500,
            singleItem: true,
            autoPlay: 7500,
            pagination: false
        });
    }

    this.bindAlbums = function bindAlbums(classe, nItems) {
        if (hasConnectionIndex) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: this.baseUrl + "AlbumService/GetRandomAlbums?nItems=" + nItems,
                cache: false,
                error: function () {
                    //classe.getArtistsAlbums("Error Retrieving Albums");
                },
                success: function (data) {
                    classe.getRandomAlbums(classe, data);
                }
            });
        }
        else {
            classe.getRandomAlbumsFromLocalStorage(classe, nItems);
        }
    }

    this.getRandomAlbums = function getRandomAlbums(classe, data) {
        var mainElement = $('#albumsListView');
        mainElement.css('display','none');
        mainElement.empty();

        var jsonArtistsObj = JSON.parse(data);

        mainElement.append("<li data-role='list-divider'><div style='float:left;'>Spotlight Albums</div> <div style='float:right;'><a href='#' onclick='var classApp = new index.Chinnook();classApp.refreshAllIndexContent(true,false);' style='margin-top:0;' class='ui-btn ui-shadow ui-corner-all ui-icon-refresh ui-btn-icon-notext'>Search</a></div><br/><small> Albums with songs featured in </small></li>");
        
        $.each(jsonArtistsObj, function (index, value) {
            var albumsItems = "<li><a href='album.html?" + "album=" + escape(value.Title) + "&artist=" + escape(value.Name) + "'>";
            albumsItems += "<img style='padding:8px;' width='64px' height='64px' src='";

            var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + value.Name + "&album=" + value.Title + "&format=json";
            $.ajax({
                type: "GET",
                dataType: "json",
                url: classe.lastFMBaseUrl + imageUrl,
                cache: false,
                timeout: 20000,
                error: function (a, b, c) {
                    //Depois chama outra funcao que percorre o dom do 2 collapsible e para cada um obtem as tracks com id = artistCollapsible_metallica[artist]_master+of+puppets[album]
                    albumsItems += "img/unknowAlbum.jpg" + "'>";
                    albumsItems += "<h2>" + value.Title + "</h2>";
                    albumsItems += "<p>" + value.Name + "</p>";
                    albumsItems += "</a><li>";

                    mainElement.append(albumsItems);
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();
                    mainElement.css('display', 'block');
                    $.mobile.loading('hide');
                },
                success: function (data) {
                    if (data.message === "Album not found") {
                        albumsItems += "img/unknowAlbum.jpg" + "'>";
                    }
                    else {
                        try
                        {
                            if ((data.album.image[1])['#text'] != "") {
                                albumsItems += (data.album.image[1])['#text'] + "'>";
                            }
                            else if ((data.album.image[2])['#text'] != "") {
                                albumsItems += (data.album.image[2])['#text'] + "'>";
                            }
                            else {
                                albumsItems += "img/unknowAlbum.jpg" + "'>";
                            }
                        }
                        catch (e) {
                            albumsItems += "img/unknowAlbum.jpg" + "'>";
                        }

                    }

                    albumsItems += "<h2>" + value.Title + "</h2>";
                    albumsItems += "<p>" + value.Name + "</p>";
                    albumsItems += "</a><li>";

                    mainElement.append(albumsItems);
                 
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();
                    mainElement.css('display', 'block');
                    $.mobile.loading('hide');
                }
            });


        })
    }

    this.getRandomAlbumsFromLocalStorage = function getRandomAlbumsFromLocalStorage(classe, nItems) {
        var mainElement = $('#albumsListView');
        mainElement.css('display', 'none');
        mainElement.empty();

        mainElement.append("<li data-role='list-divider'><div style='float:left;'>Spotlight Albums</div> <div style='float:right;'><a href='#' onclick='var classApp = new index.Chinnook();classApp.refreshAllIndexContent(true,false);' style='margin-top:0;' class='ui-btn ui-shadow ui-corner-all ui-icon-refresh ui-btn-icon-notext'>Search</a></div><br/><small> Albums in mobile device </small></li>");

        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

        if (favouritesAlbumsLocalStorage !== null && favouritesAlbumsLocalStorage.length !== 0) {
            var objJsFavouritesAlbums = JSON.parse(favouritesAlbumsLocalStorage);

            if (objJsFavouritesAlbums.albums.length > 0) {

                if (objJsFavouritesAlbums.albums.length > nItems) {
                    var jsUtilsApp = new jsUtils.Chinnook();
                    objJsFavouritesAlbums = jsUtilsApp.getRandomIndexesFromArray(objJsFavouritesAlbums.albums, nItems);
                }
                else {
                    objJsFavouritesAlbums = objJsFavouritesAlbums.albums;
                }

                $.each(objJsFavouritesAlbums, function (index, value) {
                    var artist = unescape(value.artist);
                    var title = unescape(value.title);

                    var albumsItems = "<li><a href='album.html?album=" + title + "&artist=" + artist + "'>";
                    albumsItems += "<img style='padding:8px;' width='64px' height='64px' src='";

                    var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + artist + "&album=" + title + "&format=json";
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: classe.lastFMBaseUrl + imageUrl,
                        cache: false,
                        timeout: 20000,
                        error: function (a, b, c) {
                            //Depois chama outra funcao que percorre o dom do 2 collapsible e para cada um obtem as tracks com id = artistCollapsible_metallica[artist]_master+of+puppets[album]
                            albumsItems += "img/unknowAlbum.jpg" + "'>";
                            albumsItems += "<h2>" + title + "</h2>";
                            albumsItems += "<p>" + artist + "</p>";
                            albumsItems += "</a><li>";

                            mainElement.append(albumsItems);
                            mainElement.listview("refresh");
                            mainElement.find('li.ui-li-static').remove();

                            mainElement.css('display', 'block');
                        },
                        success: function (data) {
                            if (data.message === "Album not found") {
                                albumsItems += "img/unknowAlbum.jpg" + "'>";
                            }
                            else {
                                try
                                {
                                    if ((data.album.image[1])['#text'] != "") {
                                        albumsItems += (data.album.image[1])['#text'] + "'>";
                                    }
                                    else if ((data.album.image[2])['#text'] != "") {
                                        albumsItems += (data.album.image[2])['#text'] + "'>";
                                    }
                                    else {
                                        albumsItems += "img/unknowAlbum.jpg" + "'>";
                                    }

                                }
                                catch (e) {
                                    albumsItems += "img/unknowAlbum.jpg" + "'>";
                                }
                               
                            }

                            albumsItems += "<h2>" + title + "</h2>";
                            albumsItems += "<p>" + artist + "</p>";
                            albumsItems += "</a><li>";

                            mainElement.append(albumsItems);

                            mainElement.listview("refresh");
                            mainElement.find('li.ui-li-static').remove();

                            mainElement.css('display', 'block');
                        }
                    });
                })
            }
            else {
                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

                mainElement.listview("refresh");
                mainElement.find('li.ui-li-static').remove();

                mainElement.css('display', 'block');
            }
        }
        else
        {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

            mainElement.listview("refresh");
            mainElement.find('li.ui-li-static').remove();

            mainElement.css('display', 'block');
        }
     
        
        $.mobile.loading('hide');
    }


    this.bindArtists = function bindArtists(classe, nItems) {
        if (hasConnectionIndex) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: this.baseUrl + "ArtistService/GetRandomArtists?nItems=" + nItems,
                cache: false,
                error: function () {
                    classe.getArtistsAlbums("Error Retrieving Artists");
                },
                success: function (data) {
                    classe.getRandomArtists(classe, data);
                }
            });
        }
        else {
            classe.getRandomArtistsFromLocalStorage(classe, nItems);
        }
    }

    this.getRandomArtists = function getRandomArtists(classe, data) {
        //Create JQuery Collapsible Set with id = artistCollapsible_metallica[artist] para cada artista
        //Depois chama uma funcao que percorre o dom do collapsible e para cada um obtem os albums com id = artistCollapsible_metallica[artist]_master+of+puppets[album]
        //Depois chama outra funcao que percorre o dom do 2 collapsible e para cada um obtem as tracks com id = artistCollapsible_metallica[artist]_master+of+puppets[album]
        var mainElement = $('#artistsListView');
        mainElement.css('display', 'none');
        mainElement.empty();

        var jsonArtistsObj = JSON.parse(data);

        mainElement.append("<li data-role='list-divider'><div style='float:left;'>Spotlight Artists</div> <div style='float:right;'><a href='#' onclick='var classApp = new index.Chinnook();classApp.refreshAllIndexContent(false,true);' style='margin-top:0;' class='ui-btn ui-shadow ui-corner-all ui-icon-refresh ui-btn-icon-notext'>Search</a></div><br/><small> Artists with albums featured in </small></li>");

        //black = false;
        $.each(jsonArtistsObj, function (index, value) {
            var artistItems = "<li><a href='artist.html?artist=" + escape(value.Name) + "'>";
            artistItems += "<img style='padding:8px;' width='64px' height='64px' src='";

            var imageUrl = "?method=artist.getinfo&artist=" + value.Name + "&api_key=7d1fcf8968cf0312944f28c1972e0202&format=json";

            $.ajax({
                type: "GET",
                dataType: "json",
                url: classe.lastFMBaseUrl + imageUrl,
                cache: false,
                timeout: 20000,
                error: function (a, b, c) {
                    artistItems += "img/unknowArtist.jpg" + "'>";
                    artistItems += "<h2>" + value.Name + "</h2>";
                    artistItems += "</a><li>";

                    mainElement.append(artistItems);
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();
                    mainElement.css('display', 'block');

                    $.mobile.loading('hide');
                },
                success: function (data) {
                    if (data.message === "Artist not found") {
                        artistItems += "img/unknowArtist.jpg" + "'>";
                    }
                    else {
                        try
                        {
                            if ((data.artist.image[1])['#text'] != "") {
                                artistItems += (data.artist.image[1])['#text'] + "'>";
                            }
                            else if ((data.artist.image[2])['#text'] != "") {
                                artistItems += (data.artist.image[2])['#text'] + "'>";
                            }
                            else {
                                artistItems += "img/unknowArtist.jpg" + "'>";
                            }
                        }
                        catch (e) {
                            artistItems += "img/unknowArtist.jpg" + "'>";
                        }
                    }

                    artistItems += "<h2>" + value.Name + "</h2>";
                    artistItems += "</a><li>";

                    mainElement.append(artistItems);
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();
                    mainElement.css('display', 'block');

                    $.mobile.loading('hide');
                }
            });
        })

    }

    this.getRandomArtistsFromLocalStorage = function getRandomArtistsFromLocalStorage(classe, nItems) {
        var mainElement = $('#artistsListView');
        mainElement.css('display', 'none');
        mainElement.empty();

        mainElement.append("<li data-role='list-divider'><div style='float:left;'>Spotlight Artists</div> <div style='float:right;'><a href='#' onclick='var classApp = new index.Chinnook();classApp.refreshAllIndexContent(false,true);' style='margin-top:0;' class='ui-btn ui-shadow ui-corner-all ui-icon-refresh ui-btn-icon-notext'>Search</a></div><br/><small> Artists in mobile device </small></li>");

        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

        if (favouritesArtistsLocalStorage !== null && favouritesArtistsLocalStorage.length !== 0) {
            var objJsFavouritesArtists = JSON.parse(favouritesArtistsLocalStorage);

            if (objJsFavouritesArtists.artists.length > 0) {

                if (objJsFavouritesArtists.artists.length > nItems) {
                    var jsUtilsApp = new jsUtils.Chinnook();
                    objJsFavouritesArtists = jsUtilsApp.getRandomIndexesFromArray(objJsFavouritesArtists.artists, nItems);
                }
                else {
                    objJsFavouritesArtists = objJsFavouritesArtists.artists;
                }

                $.each(objJsFavouritesArtists, function (index, value) {
                    var artist = unescape(value.artist);

                    var artistItems = "<li><a href='artist.html?artist=" + artist + "'>";
                    artistItems += "<img style='padding:8px;' width='64px' height='64px' src='";

                    var imageUrl = "?method=artist.getinfo&artist=" + artist + "&api_key=7d1fcf8968cf0312944f28c1972e0202&format=json";

                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: classe.lastFMBaseUrl + imageUrl,
                        cache: false,
                        timeout: 20000,
                        error: function (a, b, c) {
                            artistItems += "img/unknowArtist.jpg" + "'>";
                            artistItems += "<h2>" + artist + "</h2>";
                            artistItems += "</a><li>";

                            mainElement.append(artistItems);
                            mainElement.listview("refresh");
                            mainElement.find('li.ui-li-static').remove();
                            mainElement.css('display', 'block');
                            $.mobile.loading('hide');
                        },
                        success: function (data) {
                            if (data.message === "Artist not found") {
                                artistItems += "img/unknowArtist.jpg" + "'>";
                            }
                            else {
                                try
                                {
                                    if ((data.artist.image[1])['#text'] != "") {
                                        artistItems += (data.artist.image[1])['#text'] + "'>";
                                    }
                                    else if ((data.artist.image[2])['#text'] != "") {
                                        artistItems += (data.artist.image[2])['#text'] + "'>";
                                    }
                                    else {
                                        artistItems += "img/unknowArtist.jpg" + "'>";
                                    }
                                }
                                catch (e) {
                                    artistItems += "img/unknowArtist.jpg" + "'>";
                                }
                            }

                            artistItems += "<h2>" + artist + "</h2>";
                            artistItems += "</a><li>";

                            mainElement.append(artistItems);

                            mainElement.listview("refresh");
                            mainElement.find('li.ui-li-static').remove();
                            mainElement.css('display', 'block');
                        }
                    });
                })
            }
            else {
                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

                mainElement.listview("refresh");
                mainElement.find('li.ui-li-static').remove();
                mainElement.css('display', 'block');
            }
        }
        else
        {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')

            mainElement.listview("refresh");
            mainElement.find('li.ui-li-static').remove();
            mainElement.css('display', 'block');
        }

        $.mobile.loading('hide');
    }

    this.refreshAllIndexContent = function refreshAllIndexContent(refreshAlbums,refreshArtists) {
        try
        {
            $.mobile.loading('show', {
                text: 'Waiting for Something Special...',
                textVisible: true,
                theme: 'b',
                html: ""
            });
     
            var connectionApp = new conection.Chinnook();
            hasConnectionIndex = connectionApp.checkConnectionIcon('connectionIconIndex');
           
            var loginsessionApp = new sessionlogin.Chinnook();
            loginsessionApp.verifieSessionLogin('panelAccount', 'panelAccountText');
          
            var classApp = new index.Chinnook();

            classApp.layoutAspects();
            classApp.initializeCarousell();

            if (refreshAlbums) {
                var mainElementAlbums = $('#albumsListView');
                mainElementAlbums.empty();
                classApp.bindAlbums(classApp, 5);
            }
        
            if (refreshArtists) {
                var mainElementArtists = $('#artistsListView');
                mainElementArtists.empty();
                classApp.bindArtists(classApp, 5);
            }
        }
        catch (e) {
        }
    }

    $('body').on('click', '#regreshPageIndex', function (e) {
        $("#indexPanel").panel("close");

        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new index.Chinnook();
        classApp.refreshAllIndexContent(true,true);
    });

    $('body').on('click', '#exitIndex', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
   
}


$(document).on("pageshow", "#homePage", function () {
    try
    {
        if (cordovaLoaded) {
            FastClick.attach(document.body);

            var classApp = new index.Chinnook();

            classApp.refreshAllIndexContent(true, true);
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
        $("#homePage").trigger("pageshow");
    }
})

//$(document).ready(function () {
    
//    cordovaLoaded = true;
//    $("#homePage").trigger("pageshow");
//})

