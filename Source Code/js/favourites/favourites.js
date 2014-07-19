var favourites = favourites || {};

var hasConnection = false;

favourites.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#favouritesPanel :first-child").removeClass("ui-panel-inner");
        $("#favouritesPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

   
    $('body').on('click', '#favouritesArtists', function (e) {
        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconFavourites');

        var mainElement = $('#searchFavouritesListView');
        mainElement.empty();

        e.preventDefault();
        e.stopImmediatePropagation();

        $('#favouritesArtists').addClass('ui-btn-active');
        $('#favouritesAlbums').removeClass('ui-btn-active');
        $('#myFilter').val('');

        var tempObj = new favourites.Chinnook();
        tempObj.searchResultsInLocal();

    });

    $('body').on('click', '#favouritesAlbums', function (e) {
        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconFavourites');

        var mainElement = $('#searchFavouritesListView');
        mainElement.empty();

        e.preventDefault();
        e.stopImmediatePropagation();

        $('#favouritesAlbums').addClass('ui-btn-active');
        $('#favouritesArtists').removeClass('ui-btn-active');
        $('#myFilter').val('');

        var tempObj = new favourites.Chinnook();
        tempObj.searchResultsInLocal();
    });
  
    this.searchResultsInLocal = function searchResultsInLocal() {
        if ($('#favouritesArtists').hasClass('ui-btn-active')) {
            $('#myFilter').attr('placeholder','Search artists...');

            var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

            if (favouritesArtistsLocalStorage === null || favouritesArtistsLocalStorage.length === 0) {
                $('#resultsNumberInLocal').html('No results found');
            }
            else
            {
                var objJsFavouritesArtists = JSON.parse(favouritesArtistsLocalStorage);
                $('#resultsNumberInLocal').html(objJsFavouritesArtists.artists.length + ' result(s) found');

                this.bindAllArtists(objJsFavouritesArtists.artists);
            }
        }
        else
        {
            $('#myFilter').attr('placeholder', 'Search albums...');

            var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

            if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
                $('#resultsNumberInLocal').html('No results found');
            }
            else {
                var objJsFavouritesAlbums = JSON.parse(favouritesAlbumsLocalStorage);
                $('#resultsNumberInLocal').html(objJsFavouritesAlbums.albums.length + ' result(s) found');
                
                this.bindAllAlbums(objJsFavouritesAlbums.albums);
            }
        }
    }

    this.bindAllArtists = function bindAllArtists(obj) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var mainElement = $('#searchFavouritesListView');
        mainElement.empty();

        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Artists found in local device </a></li>');

        $.each(obj, function (index, value) {
            var artist = value.artist.replace(/%20/gi, " ");

            var artistItems = "<li><a href='artist.html?artist=" + escape(artist) + "'>";
            artistItems += "<img style='padding:8px;' width='64px' height='64px' src='";

            var imageUrl = "?method=artist.getinfo&artist=" + artist + "&api_key=7d1fcf8968cf0312944f28c1972e0202&format=json";

            var appFav = new favourites.Chinnook();

            $.ajax({
                type: "GET",
                dataType: "json",
                url: appFav.lastFMBaseUrl + imageUrl,
                cache: false,
                timeout: 30000,
                error: function (a, b, c) {
                    artistItems += "img/unknowArtist.jpg" + "'>";
                    artistItems += "<h2>" + artist + "</h2>";
                    artistItems += "</a><li>";

                    mainElement.append(artistItems);
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();

                    $.mobile.loading('hide');
                },
                success: function (data) {
                    if (data.message === "Artist not found") {
                        artistItems += "img/unknowArtist.jpg" + "'>";
                    }
                    else {
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

                    artistItems += "<h2>" + artist + "</h2>";
                    artistItems += "</a><li>";

                    mainElement.append(artistItems);
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();
                }
            });
        })

        $.mobile.loading('hide');
    }

    this.bindAllAlbums = function bindAllAlbums(obj) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var mainElement = $('#searchFavouritesListView');
        mainElement.empty();

        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Albums found in local device </a></li>');

        $.each(obj, function (index, value) {
            var artist = value.artist.replace(/%20/gi, " ");
            var title = value.title.replace(/%20/gi, " ");

            var albumsItems = "<li><a href='album.html?album=" + escape(title) + "&artist=" + escape(artist) + "'>";
            albumsItems += "<img style='padding:8px;' width='64px' height='64px' src='";

            var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + artist + "&album=" + title + "&format=json";

            var appFav = new favourites.Chinnook();

            $.ajax({
                type: "GET",
                dataType: "json",
                url: appFav.lastFMBaseUrl + imageUrl,
                cache: false,
                timeout: 30000,
                error: function (a, b, c) {
                    albumsItems += "img/unknowAlbum.jpg" + "'>";
                    albumsItems += "<h2>" + title + "</h2>";
                    albumsItems += "<p>" + artist + "</p>";
                    albumsItems += "</a><li>";

                    mainElement.append(albumsItems);
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();

                    $.mobile.loading('hide');
                },
                success: function (data) {
                    if (data.message === "Album not found") {
                        albumsItems += "img/unknowAlbum.jpg" + "'>";
                    }
                    else {
                        if (data.album != undefined && (data.album.image[1])['#text'] != "") {
                            albumsItems += (data.album.image[1])['#text'] + "'>";
                        }
                        else if (data.album != undefined && (data.album.image[2])['#text'] != "") {
                            albumsItems += (data.album.image[2])['#text'] + "'>";
                        }
                        else {
                            albumsItems += "img/unknowAlbum.jpg" + "'>";
                        }

                    }

                    albumsItems += "<h2>" + title + "</h2>";
                    albumsItems += "<p>" + artist + "</p>";
                    albumsItems += "</a><li>";

                    mainElement.append(albumsItems);
                    mainElement.listview("refresh");
                    mainElement.find('li.ui-li-static').remove();


                }
            });
        })

        $.mobile.loading('hide');
    }

    this.syncOut = function syncOut() {
        if (hasConnection) {
            var sessionCont = new sessionlogin.Chinnook();

            if (sessionCont.isAuthenticated()) {
                var username = sessionCont.getUsername();

                if ($('#favouritesArtists').hasClass('ui-btn-active')) {
                    this.syncOutArtists(username);
                }
                else {
                    this.syncOutAlbums(username);
                }
            }
            else {
                $('#alertmustbeAuthenticated').css('display', 'block');
                $("#mustbeAuthenticated").click();
            }
        }
        else {
            $('#alertmustbeOnlineMode').css('display', 'block');
            $("#mustbeOnlineMode").click();
        }
    }

    this.syncOutArtists = function syncOutArtists(username) {
        $.mobile.loading('show', {
            text: 'Synchronizing artists...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");
        
        if (favouritesArtistsLocalStorage === null || favouritesArtistsLocalStorage.length === 0) {
            $('#alertNothingToSync').css('display', 'block');
            $("#nothingToSync").click();
        }
        else {
            var jsonObj = {
                username: username,
                artists: JSON.parse(favouritesArtistsLocalStorage).artists
            }
            var jsonString = JSON.stringify(jsonObj);

            $.ajax({
                type: "POST",
                url: this.baseUrl + "CustomerFavouriteArtistsService/syncOut",
                data: { "": jsonString },
                cache: false,
                async: false,
                error: function () {
                    $('#alertOutServerError').css('display', 'block');
                    $("#syncOutServerError").click();
                },
                success: function (data) {
                    var response = JSON.parse(data);

                    if (response.status === "DATA LOST") {
                        var favouritesArtistsLocalStorage = localStorage.setItem("favouritesArtists", "");
                        var notificationJson = JSON.parse(response.notification);
                      
                        $.each(notificationJson, function (index, value) {
                            var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

                            var artist = {
                                artist: value.artist
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
                        })

                        $('#alertOutDataLost').css('display', 'block');
                        $("#syncOutDataLost").click();
                    }
                    else if (response.status === "SERVER ERROR") {
                        $('#alertOutServerError').css('display', 'block');
                        $("#syncOutServerError").click();
                    }
                    else if (response.status === "OK") {
                        $('#alertsyncOutOk').css('display', 'block');
                        $("#syncOutOk").click();
                    }
                }
            });
        }

        $.mobile.loading('hide');
        this.refreshAllFavouritesContent();
        this.refreshFooter();
    }

    this.syncOutAlbums = function syncOutAlbums(username) {
        $.mobile.loading('show', {
            text: 'Synchronizing albums...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

        if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
            $('#alertNothingToSync').css('display', 'block');
            $("#nothingToSync").click();
        }
        else {
            var jsonObj = {
                username: username,
                albums: JSON.parse(favouritesAlbumsLocalStorage).albums
            }
            var jsonString = JSON.stringify(jsonObj);

            $.ajax({
                type: "POST",
                url: this.baseUrl + "CustomerFavouriteAlbumsService/syncOut",
                data: { "": jsonString },
                cache: false,
                async: false,
                error: function (a, b, c) {
                    $('#alertOutServerError').css('display', 'block');
                    $("#syncOutServerError").click();
                },
                success: function (data) {
                    var response = JSON.parse(data);

                    if (response.status === "DATA LOST") {
                        var favouritesAlbumsLocalStorage = localStorage.setItem("favouritesAlbums", "");
                        var notificationJson = JSON.parse(response.notification);

                        $.each(notificationJson, function (index, value) {
                            var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

                            var album = {
                                artist: value.artist,
                                title: value.title,
                                tracks: value.tracks
                            }

                            if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
                                var albums = {
                                    albums: [album]
                                }

                                var jsonString = JSON.stringify(albums);
                                localStorage.setItem("favouritesAlbums", jsonString);
                            }
                            else {
                                var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);
                                jsonObj.albums.push(album);
                                var jsonString = JSON.stringify(jsonObj);
                                localStorage.setItem("favouritesAlbums", jsonString);
                            }
                        })

                        $('#alertOutDataLost').css('display', 'block');
                        $("#syncOutDataLost").click();
                    }
                    else if (response.status === "SERVER ERROR") {
                        $('#alertOutServerError').css('display', 'block');
                        $("#syncOutServerError").click();
                    }
                    else if (response.status === "OK") {
                        $('#alertsyncOutOk').css('display', 'block');
                        $("#syncOutOk").click();
                    }
                }
            });
        }

        $.mobile.loading('hide');
        this.refreshAllFavouritesContent();
        this.refreshFooter();
    }

    this.syncOutAlbumsLocalStorage = function syncOutAlbumsLocalStorage(username) {
        $.mobile.loading('show', {
            text: 'Synchronizing albums...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

        if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
            $('#alertNothingToSync').css('display', 'block');
            $("#nothingToSync").click();
        }
        else {
            var jsonObj = {
                username: username,
                albums: JSON.parse(favouritesAlbumsLocalStorage).albums
            }
            var jsonString = JSON.stringify(jsonObj);

            $.ajax({
                type: "POST",
                url: this.baseUrl + "CustomerFavouriteAlbumsService/syncOut",
                data: { "": jsonString },
                cache: false,
                async: false,
                error: function (a, b, c) {
                    $('#alertOutServerError').css('display', 'block');
                    $("#syncOutServerError").click();
                },
                success: function (data) {
                    var response = JSON.parse(data);

                    if (response.status === "DATA LOST") {
                        var favouritesAlbumsLocalStorage = localStorage.setItem("favouritesAlbums", "");
                        var notificationJson = JSON.parse(response.notification);

                        $.each(notificationJson, function (index, value) {
                            var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

                            var album = {
                                artist: value.artist,
                                title: value.title,
                                tracks: value.tracks
                            }

                            if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
                                var albums = {
                                    albums: [album]
                                }

                                var jsonString = JSON.stringify(albums);
                                localStorage.setItem("favouritesAlbums", jsonString);
                            }
                            else {
                                var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);
                                jsonObj.albums.push(album);
                                var jsonString = JSON.stringify(jsonObj);
                                localStorage.setItem("favouritesAlbums", jsonString);
                            }
                        })
                    }
                }
            });
        }

        $.mobile.loading('hide');
    }

    this.syncIn = function syncIn() {
        if (hasConnection) {
            var sessionCont = new sessionlogin.Chinnook();

            if (sessionCont.isAuthenticated()) {
                var username = sessionCont.getUsername();

                if ($('#favouritesArtists').hasClass('ui-btn-active')) {
                    this.syncInArtists(username);
                }
                else {
                    this.syncInAlbums(username);
                }
            }
            else {
                $('#alertmustbeAuthenticated').css('display', 'block');
                $("#mustbeAuthenticated").click();
            }
        }
        else {
            $('#alertmustbeOnlineMode').css('display', 'block');
            $("#mustbeOnlineMode").click();
        }
    }

    this.syncInAlbums = function syncInAlbums(username) {
        $.mobile.loading('show', {
            text: 'Synchronizing albums...',
            textVisible: true,
            theme: 'b',
            html: ""
        });
  
        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

        $.ajax({
            type: "GET",
            url: this.baseUrl + "CustomerFavouriteAlbumsService/syncIn?username=" + username,
            cache: false,
            async: false,
            error: function () {
                $('#alertSyncInServerError').css('display', 'block');
                $("#syncInServerError").click();
            },
            success: function (data) {
                var response = JSON.parse(data);
      
                if (response.status === "OK") {
                    var favouritesAlbumsLocalStorage = localStorage.setItem("favouritesAlbums", "");

                    var notificationJson = JSON.parse(response.notification);
                    
                    $.each(notificationJson, function (index, value) {
                        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");
                        console.log(value);
                        var album = {
                            title: value.title,
                            artist: value.artist,
                            tracks: value.tracks
                        }

                        if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
                            var albums = {
                                albums: [album]
                            }

                            var jsonString = JSON.stringify(albums);

                            localStorage.setItem("favouritesAlbums", jsonString);
                        }
                        else {
                            var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);
                            jsonObj.albums.push(album);
                            var jsonString = JSON.stringify(jsonObj);
                            localStorage.setItem("favouritesAlbums", jsonString);
                        }
                    })

                    $('#alertsyncInOk').css('display', 'block');
                    $("#syncInOk").click();
                }
                else if (response.status === "SERVER ERROR") {
                    $('#alertSyncInServerError').css('display', 'block');
                    $("#syncInServerError").click();
                }
                else if (response.status === "NOTHING SYNC") {
                    $('#alertsyncInNothing').css('display', 'block');
                    $("#syncInNothing").click();
                }
            }
        });
        

        $.mobile.loading('hide');
        this.refreshAllFavouritesContent();
        this.refreshFooter();
    }

    this.syncInAlbumsLocalStorage = function syncInAlbumsLocalStorage(username) {
        $.mobile.loading('show', {
            text: 'Synchronizing albums...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

        $.ajax({
            type: "GET",
            url: this.baseUrl + "CustomerFavouriteAlbumsService/syncIn?username=" + username,
            cache: false,
            async: false,
            error: function () {
                $('#alertSyncInServerError').css('display', 'block');
                $("#syncInServerError").click();
            },
            success: function (data) {
                var response = JSON.parse(data);
                console.log(response);
                if (response.status === "OK") {
                    var favouritesAlbumsLocalStorage = localStorage.setItem("favouritesAlbums", "");

                    var notificationJson = JSON.parse(response.notification);
                   
                    $.each(notificationJson, function (index, value) {
                        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");
                        console.log(value);
                        var album = {
                            title: value.title,
                            artist: value.artist,
                            tracks: value.tracks
                        }

                        if (favouritesAlbumsLocalStorage === null || favouritesAlbumsLocalStorage.length === 0) {
                            var albums = {
                                albums: [album]
                            }

                            var jsonString = JSON.stringify(albums);
                         
                            localStorage.setItem("favouritesAlbums", jsonString);
                        }
                        else {
                            var jsonObj = JSON.parse(favouritesAlbumsLocalStorage);
                            jsonObj.albums.push(album);
                            var jsonString = JSON.stringify(jsonObj);
                            localStorage.setItem("favouritesAlbums", jsonString);
                        }
                    })
                }
            }
        });

        $.mobile.loading('hide');
    }

    this.syncInArtists= function syncInArtists(username) {
        $.mobile.loading('show', {
            text: 'Synchronizing artists...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

        $.ajax({
            type: "GET",
            url: this.baseUrl + "CustomerFavouriteArtistsService/syncIn?username=" + username,
            cache: false,
            async: false,
            error: function () {
                $('#alertSyncInServerError').css('display', 'block');
                $("#syncInServerError").click();
            },
            success: function (data) {
                var response = JSON.parse(data);
                console.log(response);
                if (response.status === "OK") {
                    var favouritesArtistsLocalStorage = localStorage.setItem("favouritesArtists", "");

                    var notificationJson = JSON.parse(response.notification);
                    console.log(notificationJson);
                    $.each(notificationJson, function (index, value) {
                        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

                        var artist = {
                            artist: value.artist
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
                    })

                    $('#alertsyncInOk').css('display', 'block');
                    $("#syncInOk").click();
                }
                else if (response.status === "SERVER ERROR") {
                    $('#alertSyncInServerError').css('display', 'block');
                    $("#syncInServerError").click();
                }
                else if (response.status === "NOTHING SYNC") {
                    $('#alertsyncInNothing').css('display', 'block');
                    $("#syncInNothing").click();
                }
            }
        });


        $.mobile.loading('hide');
        this.refreshAllFavouritesContent();
        this.refreshFooter();
    }

    this.refreshFooter = function refresFooter() {
        $('#footer').empty();
        $('#footer').append('<div data-role="navbar"><ul><li><a id="linkSyncIn" onclick="var favouritesApp = new favourites.Chinnook(); favouritesApp.syncIn();" href="#" data-icon="arrow-d-l">Sync In</a></li><li><a id="linkSyncOut" onclick="var favouritesApp = new favourites.Chinnook(); favouritesApp.syncOut();" data-icon="arrow-u-r">Sync Out</a></li> </ul></div><a href="#" class="ui-btn ui-icon-back ui-btn-icon-left" style="clear:both;float:right;margin-top:1.5%;" data-rel="back">Go Back</a>');
        $('#footer').trigger('create');
    }

    this.refreshAllFavouritesContent = function refreshAllFavouritesContent() {
        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconFavourites');

        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelFavourites', 'panelFavouritesText');

        var mainElement = $('#searchFavouritesListView');
        mainElement.empty();
        $('#myFilter').val('');

        var favouritesApp = new favourites.Chinnook();
        favouritesApp.layoutAspects();

        favouritesApp.searchResultsInLocal();
    }

    $('body').on('click', '#regreshPageFavourites', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new favourites.Chinnook();
        classApp.refreshAllFavouritesContent();

        $("#favouritesPanel").panel("close");
    });

    $('body').on('click', '#exitFavourites', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });

   
}

$(document).on("pageshow", "#favouritesPage", function () {
    var favouritesApp = new favourites.Chinnook();
    favouritesApp.refreshAllFavouritesContent();
});

