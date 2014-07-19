var search = search || {};

var hasConnection = false;

search.Chinnook = function Chinnook() {
    this.connectionApp = new conection.Chinnook();

    this.baseUrl = this.connectionApp.currentConnection;
    this.lastFMBaseUrl = "http://ws.audioscrobbler.com/2.0/";

    this.layoutAspects = function layoutAspects() {
        $("#searchPanel :first-child").removeClass("ui-panel-inner");
        $("#searchPanel .ui-btn").css("padding", "1em");
        $(".ui-listview > .ui-li-divider ").css('padding', '1em 1.143em');
    }

    $('body').on('click', '#searchArtists', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        $('#searchArtists').addClass('ui-btn-active');
        $('#searchAlbums').removeClass('ui-btn-active');
    });

    $('body').on('click', '#searchAlbums', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        $('#searchAlbums').addClass('ui-btn-active');
        $('#searchArtists').removeClass('ui-btn-active');
    });

    this.searchResults = function searchResults() {
        var searchText = $('#myFilter').val();

        if (searchText !== '') {
            if ($('#searchAlbums').hasClass('ui-btn-active')) {
                if (hasConnection) {
                    this.bindAlbums(this, searchText);
                }
                else {
                    this.getAlbumsLocalStorage(this, searchText);
                }
            }
            else
            {
                if (hasConnection) {
                    this.bindArtists(this, searchText);
                }
                else {
                    this.getArtistsLocalStorage(this, searchText);
                }       
            }
        }
    }

    this.bindAlbums = function bindAlbums(classe, searchText) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        $.ajax({
            type: "GET",
            dataType: "json",
            url: this.baseUrl + "AlbumService/GetAlbumsSearch?title=" + searchText,
            cache: false,
            error: function () {
                var mainElement = $('#searchListView');
                mainElement.empty();

                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Results for <em>' + searchText + '</em></a></li>');

                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
                $.mobile.loading('hide');
            },
            success: function (data) {
                classe.getAlbums(classe, searchText,data);
            }
        });
    }

    this.getAlbums = function getAlbums(classe, searchText, data) {
        //Create JQuery Collapsible Set with id = artistCollapsible_metallica[artist] para cada artista
        //Depois chama uma funcao que percorre o dom do collapsible e para cada um obtem os albums com id = artistCollapsible_metallica[artist]_master+of+puppets[album]
        var mainElement = $('#searchListView');
        mainElement.empty();

        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Results for <em>' + searchText + '</em></a></li>');
    
        var jsonArtistsObj = JSON.parse(data);

        if (jsonArtistsObj.length > 0) {
            $.each(jsonArtistsObj, function (index, value) {
                var albumsItems = "<li><a href='album.html?album=" + escape(value.Title) + "&artist=" + escape(value.Name) + "'>";
                albumsItems += "<img style='padding:8px;' src='";
                
                var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + value.Name + "&album=" + value.Title + "&format=json";
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: classe.lastFMBaseUrl + imageUrl,
                    cache: false,
                    timeout: 20000,
                    error: function (a, b, c) {
                        albumsItems += "img/unknowAlbum.jpg" + "'>";
                        albumsItems += "<h2>" + value.Title + "</h2>";
                        albumsItems += "<p>" + value.Name + "</p>";
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

                        albumsItems += "<h2>" + value.Title + "</h2>";
                        albumsItems += "<p>" + value.Name + "</p>";
                        albumsItems += "</a><li>";

                        mainElement.append(albumsItems);
                        mainElement.listview("refresh");
                        mainElement.find('li.ui-li-static').remove();

                        $.mobile.loading('hide');
                    }
                });
            })
        }
        else
        {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
            $.mobile.loading('hide');
        }
    }

    this.getAlbumsLocalStorage = function bindAlbumsLocalStorage(classe, searchText) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var favouritesAlbumsLocalStorage = localStorage.getItem("favouritesAlbums");

        if (favouritesAlbumsLocalStorage !== null && favouritesAlbumsLocalStorage.length !== 0) {
            var objJsFavouritesAlbums = JSON.parse(favouritesAlbumsLocalStorage);
           
            var jsUtilsApp = new jsUtils.Chinnook();
    
            var existsAlbumInLocalStorage = jsUtilsApp.findKeyValueInJsonStartsWith(objJsFavouritesAlbums.albums, 'title', searchText);
          
            this.bindAlbumsInLocalStorage(existsAlbumInLocalStorage);
        }
        else
        {
            var mainElement = $('#searchListView');
            mainElement.empty();

            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
            $.mobile.loading('hide');
        }
    }

    this.bindAlbumsInLocalStorage = function bindAlbumsInLocalStorage(obj) {
        var mainElement = $('#searchListView');
        mainElement.empty();

        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Albums found in local device </a></li>');

        if (obj.length > 0) {
            $.each(obj, function (index, value) {
                var artist = (value.artist);
                var title = (value.title);

                var albumsItems = "<li><a href='album.html?album=" + title + "&artist=" + artist + "'>";
                albumsItems += "<img style='padding:8px;' width='64px' height='64px' src='";

                var imageUrl = "?method=album.getinfo&api_key=7d1fcf8968cf0312944f28c1972e0202&artist=" + un(artist) + "&album=" + un(title) + "&format=json";

                var appFav = new favourites.Chinnook();

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: appFav.lastFMBaseUrl + imageUrl,
                    cache: false,
                    timeout: 20000,
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
        }
        else
        {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
        }

        $.mobile.loading('hide');
    }

    this.bindArtists = function bindArtists(classe, searchText) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });
        $.ajax({
            type: "GET",
            dataType: "json",
            url: this.baseUrl + "ArtistService/GetArtistsSearch?name=" + searchText,
            cache: false,
            error: function () {
                var mainElement = $('#searchListView');
                mainElement.empty();

                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Results for <em>' + searchText + '</em></a></li>');

                mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
                $.mobile.loading('hide');
            },
            success: function (data) {
                classe.getArtists(classe, searchText, data);
            }
        });
    }

    this.getArtists = function getArtists(classe, searchText, data) {
        //Create JQuery Collapsible Set with id = artistCollapsible_metallica[artist] para cada artista
        //Depois chama uma funcao que percorre o dom do collapsible e para cada um obtem os albums com id = artistCollapsible_metallica[artist]_master+of+puppets[album]
        //Depois chama outra funcao que percorre o dom do 2 collapsible e para cada um obtem as tracks com id = artistCollapsible_metallica[artist]_master+of+puppets[album]
        var mainElement = $('#searchListView');
        mainElement.empty();

        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Results for <em>' + searchText + '</em></a></li>');

        var jsonArtistsObj = JSON.parse(data);
      
        if (jsonArtistsObj.length > 0) {
            $.each(jsonArtistsObj, function (index, value) {
                var artistItems = "<li><a href='artist.html?artist=" + escape(value.Name) + "'>";
                artistItems += "<img style='padding:8px;' src='";

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

                        $.mobile.loading('hide');
                    },
                    success: function (data) {
                        if (data.message === "Artist not found") {
                            artistItems += "img/unknowArtist.jpg" + "'>";
                        }
                        else {
                            if (data.artist != undefined && (data.artist.image[1])['#text'] != "") {
                                artistItems += (data.artist.image[1])['#text'] + "'>";
                            }
                            else if (data.artist != undefined && (data.artist.image[2])['#text'] != "") {
                                artistItems += (data.artist.image[2])['#text'] + "'>";
                            }
                            else {
                                artistItems += "img/unknowArtist.jpg" + "'>";
                            }

                        }

                        artistItems += "<h2>" + value.Name + "</h2>";
                        artistItems += "</a><li>";

                        mainElement.append(artistItems);
                        mainElement.listview("refresh");
                        mainElement.find('li.ui-li-static').remove();

                        $.mobile.loading('hide');
                    }
                });
            })
        }
        else
        {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
            $.mobile.loading('hide');
        }
    }

    this.getArtistsLocalStorage = function bindArtistsLocalStorage(classe, searchText) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var favouritesArtistsLocalStorage = localStorage.getItem("favouritesArtists");

        if (favouritesArtistsLocalStorage !== null && favouritesArtistsLocalStorage.length !== 0) {
            var objJsFavouritesArtists = JSON.parse(favouritesArtistsLocalStorage);

            var jsUtilsApp = new jsUtils.Chinnook();

            var existsAlbumInLocalStorage = jsUtilsApp.findKeyValueInJsonStartsWith(objJsFavouritesArtists.artists, 'artist', searchText);

            this.bindArtistsInLocalStorage(existsAlbumInLocalStorage);
        }
        else {
            var mainElement = $('#searchListView');
            mainElement.empty();

            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
            $.mobile.loading('hide');
        }
    }

    this.bindArtistsInLocalStorage = function bindArtistsInLocalStorage(obj) {
        $.mobile.loading('show', {
            text: 'Waiting for Something Special...',
            textVisible: true,
            theme: 'b',
            html: ""
        });

        var mainElement = $('#searchListView');
        mainElement.empty();

        mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn ui-icon-bars ui-btn-icon-left" style="font-size:12px;"> Albums found in local device </a></li>');

        if(obj.length > 0) {
            $.each(obj, function (index, value) {
                var artist = value.artist.replace(/%20/gi, " ");

                var artistItems = "<li><a href='artist.html?artist=" + (artist) + "'>";
                artistItems += "<img style='padding:8px;' width='64px' height='64px' src='";

                var imageUrl = "?method=artist.getinfo&artist=" + artist + "&api_key=7d1fcf8968cf0312944f28c1972e0202&format=json";

                var appFav = new favourites.Chinnook();

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: appFav.lastFMBaseUrl + imageUrl,
                    cache: false,
                    timeout: 20000,
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
                            if (data.artist != undefined && (data.artist.image[1])['#text'] != "") {
                                artistItems += (data.artist.image[1])['#text'] + "'>";
                            }
                            else if (data.artist != undefined && (data.artist.image[2])['#text'] != "") {
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
        }
        else {
            mainElement.append('<li data-mini="true" data-theme="b"><a href="#" data-mini="true" class="ui-btn" style="font-size:12px;"> Sorry, no results found... </a></li>')
        }

        $.mobile.loading('hide');
    }

    this.refreshAllSearchContent = function refreshAllSearchContent() {
        var connectionApp = new conection.Chinnook();
        hasConnection = connectionApp.checkConnectionIcon('connectionIconSearch');

        var loginsessionApp = new sessionlogin.Chinnook();
        loginsessionApp.verifieSessionLogin('panelSearch', 'panelSearchText');

        var mainElement = $('#searchListView');
        mainElement.empty();

        var searchApp = new search.Chinnook();
        searchApp.layoutAspects();

    }

    $('body').on('click', '#regreshPageSearch', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var classApp = new search.Chinnook();
        classApp.refreshAllSearchContent();

        $("#searchPanel").panel("close");
    });

    $('body').on('click', '#exitSearch', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var generalApp = new general.Chinnook();
        generalApp.exitFromApp();
    });
}


$(document).on("pageshow", "#searchPage", function () {
    var searchApp = new search.Chinnook();
    searchApp.refreshAllSearchContent();
});

