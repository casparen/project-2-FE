//db = project_2
// collection = search
// favCollection = favorites

//https://mysterious-peak-84379.herokuapp.com

window.onload = function (){
  var welcomeButton = document.querySelector('#welcome')
  var welcomeDiv = document.querySelector('.welcomeDiv')

  var searchDiv = document.querySelector('.search');
  var submitSearch = document.querySelector('#submitSearch');


  var wifiSearch = document.querySelector('#wifiSearch')
  var wifiSearchDiv = document.querySelector('.wifiSearchDiv')

  var viewFavorites = document.querySelector('.viewFavorites');
  var favoritesButton = document.querySelector('#favoritesButton')


  ///tetetet
  // var url = 'http://localhost:3000';
  var url = 'https://mysterious-peak-84379.herokuapp.com'
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
              fillOpacity: 0.2,
              map: map,
              center: wifiLatLng,
              radius: 100
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
    if(searchOptions === 'Coffee'){
      path = 'Coffee'
      console.log('Coffee');
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
              var infowindow = ""
          // var map = document.querySelector('#map')
        var placeLat = results[i].geometry.location.lat
        var placeLng = results[i].geometry.location.lng
        var PLACE_LAT_LNG  = {lat: placeLat, lng: placeLng}
        var markerContainer = document.querySelector('.markerContainer')

        var markerContent = document.createElement('div')
        markerContent.innerHTML = createMarker(results[i])
        markerContent.style.display = 'none';
        markerContainer.appendChild(markerContent)



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
    console.log(result);
    var infoWindowDiv = document.querySelector('.gm-style-iw')

    var adress = document.createElement('h6');
    adress.className = 'windowContent';
    adress.innerText = 'Adress: ' + result.vicinity;
    infoWindowDiv.appendChild(adress)

    var publicRating = document.createElement('h6');
    publicRating.className = 'windowContent'
    publicRating.innerText = 'Rating: ' + result.rating
    infoWindowDiv.appendChild(publicRating)

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
    button.ClassName = 'thumb_up'
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
        url: url + '/favorites/new',
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
    // var markers = document.querySelector('.markerContainer')
    // markers.innerHTML = ""
    console.log('click');
    var favPlacesDiv = document.querySelector('.favPlacesDiv')
    favPlacesDiv.innerHTML = ""

    $.ajax({
      url: url + '/favorites',
      dataType: 'json'
    }).done(function(response){
      var result = response
      // console.log(result);
      // var indexButtonDelete = []
      // var indexI = []

      for(var i = 0; i < result.length; i ++){
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
        // deleteButton.innerText = result[i]._id
        deleteButton.innerText = 'Delete'
        placeContainer.appendChild(deleteButton)



        // indexButtonDelete.push(deleteButton.id)
        // indexI.push(i)

        // console.log(deleteButton.id);
        // console.log(i);
        // console.log(indexButtonDelete[i]);
        deleteButton.addEventListener('click', function (ev){
          // console.log(ev);
          var buttonNum = ev.srcElement
          // console.log(buttonNum);
          var buttonNumId = buttonNum.id
          var deletePlace = result[buttonNumId]
          var deleteName = deletePlace.placeName
              console.log(deleteName);
          var data = {
              name: deleteName
          }

          $.ajax({
              url: url + '/favorites/' + deleteName,
              dataType: 'json',
              data: data,
              method: 'delete'
          }).done(function(response){
            console.log(response);
              console.log(deleteName + " has been deleted.");
          })//end ajax call
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
