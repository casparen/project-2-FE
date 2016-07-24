//db = project_2
// collection = search
// favCollection = favorites

window.onload = function (){
  var welcomeButton = document.querySelector('#welcome')
  var welcomeDiv = document.querySelector('.welcomeDiv')

  var searchDiv = document.querySelector('.search');
  var submitSearch = document.querySelector('#submitSearch');


  var wifiSearch = document.querySelector('#wifiSearch')
  var wifiSearchDiv = document.querySelector('.wifiSearchDiv')

  var viewFavorites = document.querySelector('.viewFavorites');
  var favoritesButton = document.querySelector('#favoritesButton')



  var url = 'http://localhost:3000';
  var LNG = ''
  var LAT = ''
  var map;
  var service;
  var infowindow;



  searchDiv.style.visibility = "hidden";
  wifiSearchDiv.style.visibility = "hidden";
  viewFavorites.style.visibility = "hidden";


  welcomeButton.addEventListener('click', function (){//////////////////////////////welcome


    welcomeDiv.innerHTML = ""
    searchDiv.style.visibility = "visible";
    wifiSearchDiv.style.visibility = "visible";
    viewFavorites.style.visibility = 'visible';

    navigator.geolocation.getCurrentPosition(success, error, options);

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };
    function success(pos) {
      var crd = pos.coords;
      LAT = crd.latitude
      LNG = crd.longitude
      // console.log('Latitude : ' + crd.latitude);
      // console.log('Longitude: ' + crd.longitude);
      // console.log('More or less ' + crd.accuracy + ' meters.');
      initMap(LAT, LNG)
    };
  })//click to view map

  function initMap(LAT, LNG) {
    var myLatLng = {lat: LAT, lng: LNG}
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'),{
      center: {lat: LAT, lng: LNG},
      // scrollwheel: false,
      zoom: 14,
    });

    var myMarker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      animation: google.maps.Animation.DROP,
      title: 'Hello World!'
    });


    // var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
    // var styles = [
    //   {
    //     stylers: [
    //       { hue: "#0076A3" },
    //       { saturation: -80 },
    //       {invert_lightness: true}
    //     ]
    //   }
    // ];
    // map.setOptions({styles: styles});
    // map.mapTypes.set('map_style', styledMap);
    // map.setMapTypeId('map_style');



    wifiSearch.addEventListener('click', function (){//////////////////////////////////wifi search
      console.log('hallo');
      var options = document.querySelector('.options').value
      var data = {}
      var data = {
        lat: LAT,
        lng: LNG,
      }

      console.log(data.lat);
      console.log(data.lng);


      $.ajax({
        url: url + '/search',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).done(function(response){
        for(var i = 0; i < response.length; i++){
          if(response[i].city === 'New York'){
            var newYork = response[i]
            console.log(newYork);
            var latitude = parseFloat(newYork.lat) //if black in console means its a stirng
            var longitude = parseFloat(newYork.long_)
            console.log(latitude);
            console.log(longitude);

            var wifiLatLng = {lat: latitude, lng: longitude}

            var cityCircle = new google.maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.1,
              map: map,
              center: wifiLatLng,
              radius: 280
            });
            // var marker = new google.maps.Marker({
            //   map: map,
            //   position: wifiLatLng,
            //   icon: {
            //     url: 'http://maps.gstatic.com/mapfiles/circle.png',
            //     anchor: new google.maps.Point(20, 20),
            //     scaledSize: new google.maps.Size(10, 17)
            //   }
            // });
            // marker[i]
          }
        }
      })
    })//submit search
  }//init map function



  submitSearch.addEventListener('click', function (){
    var data = {}
    var path = ""
    var searchOptions = document.querySelector('.options').value
    if(searchOptions === 'Coffeee'){
      path = 'Coffeee'
      console.log('Coffeee');
    }
    if(searchOptions === 'smoothie'){
      console.log('smoothie');
      path = 'smoothie'
    }

    data = {
      lat: LAT,
      lng: LNG,
      keyword: path
    }

    $.ajax({
      url: url + '/searchPlaces',
      method: 'POST',
      data: data,
      dataType:'json'
    }).done(function(response){
      var results = response.results
      console.log(results);
      for(var i = 0; i < results.length; i++){
        var placeLat = results[i].geometry.location.lat
        var placeLng = results[i].geometry.location.lng
        var PLACE_LAT_LNG  = {lat: placeLat, lng: placeLng}

        var infowindow = ""
        createMarker(results[i])


        function createMarker(result){
          var marker = new google.maps.Marker({
            position: PLACE_LAT_LNG,
            map: map,
            icon: {
              url: 'http://maps.gstatic.com/mapfiles/circle.png',
              anchor: new google.maps.Point(20, 20),
              scaledSize: new google.maps.Size(10, 17)
            }
          });
          marker.addListener('click',function() {
            var contentString = result.name
            infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            infowindow.open(map, marker, result)
            // console.log(result);

            google.maps.event.addListener(infowindow, 'domready', function (){
              console.log('dom ready');
              form(result)
            })
          })//marker click
        }//function createMarker
      }//for loop
    })
  })//submit search


  function form(result) {
    var infoWindowDiv = document.querySelector('.gm-style-iw')

    var formDiv = document.createElement('div');
    formDiv.class = 'formDiv'
    infoWindowDiv.appendChild(formDiv)

    var select = document.createElement('SELECT');
    select.className= 'options dropdown-button btn'
    formDiv.appendChild(select);

    var one = document.createElement('option');
    one.setAttribute('value', 'one')
    one.innerText = '*'
    select.appendChild(one)

    var two = document.createElement('option');
    two.setAttribute('value', 'two')
    two.innerText = '**'
    select.appendChild(two)

    var three = document.createElement('option');
    three.setAttribute('value', 'three')
    three.innerText = '***'
    select.appendChild(three)

    var four = document.createElement('option');
    four.setAttribute('value', 'four')
    four.innerText = '****'
    select.appendChild(four)

    var five = document.createElement('option');
    five.setAttribute('value', 'five')
    five.innerText = '*****'
    select.appendChild(five)

    var button = document.createElement('BUTTON');
    button.id = "submitForm"
    button.innerHTML = 'SUBMIT'
    formDiv.appendChild(button);


    button.addEventListener('click', function () {
      console.log('YAHAHAHAHAHAHAAH clickkkkkkk');
      console.log(result);
      var dropdown = document.querySelector('.options')
      var dropValue = dropdown.value
      console.log(dropValue);

      var name = result.name
      var adress = result.vicinity
      var rating = dropValue
      var data = {
        placeName: name,
        placeAdress: adress,
        placeRating: rating
      }

      console.log(name);
      $.ajax({
        url: 'http://localhost:3000/favorites/new',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).done(function(response){
        console.log('ajax call');
        // console.log('This one added to favorites: ', response);
      })//done post to fav

    })// button event listener
  }//function form





  ///////////////////////////////////////////////////////////////////////view favorites
  favoritesButton.addEventListener('click', function (){
    console.log('click');
    var favPlacesDiv = document.querySelector('.favPlacesDiv')
    favPlacesDiv.innerHTML = ""

    $.ajax({
      url: url + '/favorites',
      dataType: 'json'
    }).done(function(response){
      var result = response
      console.log(result);

      for(var i = 0; i < response.length; i ++){
        var name = result[i].placeName
        var adress = result[i].placeAdress
        var rating = result[i].placeRating
        var placeId = result[i]._id

        var placeContainer = document.createElement('div');
        placeContainer.className = 'placeContainer'
        placeContainer.id = i
        favPlacesDiv.appendChild(placeContainer)

        var placeName = document.createElement("h5");
        placeName.className = 'header'
        placeName.innerText = name
        placeContainer.appendChild(placeName)

        var placeAdress = document.createElement('h6')
        placeAdress.className = 'about'
        placeAdress.innerText = adress
        placeContainer.appendChild(placeAdress)

        if(rating === 'one'){
          var placeRating = document.createElement('h6');
          placeRating.className = 'rating'
          placeRating.innerText = '*'
          placeContainer.appendChild(placeRating)
        }

        if(rating === 'two'){
          var placeRating = document.createElement('h6');
          placeRating.className = 'rating'
          placeRating.innerText = '**'
          placeContainer.appendChild(placeRating)
        }

        if(rating === 'three'){
          var placeRating = document.createElement('h6');
          placeRating.className = 'rating'
          placeRating.innerText = '***'
          placeContainer.appendChild(placeRating)
        }

        if(rating === 'four'){
          var placeRating = document.createElement('h6');
          placeRating.className = 'rating'
          placeRating.innerText = '****'
          placeContainer.appendChild(placeRating)
        }

        if(rating === 'five'){
          var placeRating = document.createElement('h6');
          placeRating.className = 'rating'
          placeRating.innerText = '*****'
          placeContainer.appendChild(placeRating)
        }

        var deleteButton = document.createElement('BUTTON')
        deleteButton.className = 'deleteButton'
        deleteButton.id = i
        deleteButton.innerText = 'Delete'
        placeContainer.appendChild(deleteButton)


        // var id = document.createElement('p');
        // id.className = 'hidden';
        // id.innerHTML = placeId
        // // id.style.display = 'none'
        // id.style.visibility = 'hidden';
        // placeContainer.appendChild(id)
        deleteButton.addEventListener('click', function (){
          console.log('clikc');
          var header = document.querySelector('.header')

            for(var x = 0; x < response.length; x ++){
                var name = response[x].name

              if(header.innerText === name){
                  console.log(name);
              }
            }

          // console.log(result);

        })//delete click
      }//for loop


    })//ajax done


  })//click view favs








}//on load


//workss
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7400036,-73.9896392&radius=400&type=restaurant&key=AIzaSyCLSDon0Fh4aD2ipbh_01P-_twyWzj_H9E

//returns Coffee shops
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7400036,-73.9896392&radius=400&keyword=Coffee&key=AIzaSyCLSDon0Fh4aD2ipbh_01P-_twyWzj_H9E






//Old LINKS
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7400036,-73.9896392&radius=500&type=restaurant&key=AIzaSyCLSDon0Fh4aD2ipbh_01P-_twyWzj_H9E
// https://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
// &key=AIzaSyCLSDon0Fh4aD2ipbh_01P-_twyWzj_H9E
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&name=cruise&key=AIzaSyB4kPGJ8nxAWgnwUakZVRiSkK_dN2VgB28


























////////////////////////////////////////////OLD
// window.onload = function (){
//
//
//
//
// //last_fm_API
//
//
//   var submitGenre = document.querySelector('#submitGenre');
// submitGenre.addEventListener('click', function () {
//   // console.log('click');
//   var genreValue = document.querySelector('#genreInput').value;
//
//   var url = 'http://localhost:3000';
//
// console.log(genreValue);
//
//   var data = {
//     genre: genreValue
//   }
//
//   $.ajax({
//     url: url + '/API/search',
//     method: 'POST',
//     data: data,
//     dataType: 'json'
//   }).done(function (response){
//     console.log(response);
//   })//done
//
// })//click
//
//
// //
// //   var welcome = document.querySelector('#welcome').addEventListener('click', function (){
// // console.log('click');
// //
// //     })//click
//
//
//
//
//
//
//
//
//
//
//
// }//on load
//
//
//
// //export LAST_FM_KEY = 'cb8b1a5dcb21602f48885f556a6bd619'
