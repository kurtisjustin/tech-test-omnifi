
/* A few notes about this test:
    - This is my first time using the maps api, I was not sure how to close an already open infoWindow
    - The dataset did not include negative longitudes so anything on the left of the Prime Meridian shows on the right of it

 */

// Variables
const dataURL = "https://s3-eu-west-1.amazonaws.com/omnifi/techtests/locations.json";
const mapOptions = {
    zoom: 4,
    center: {lat: 54.5260, lng: 15.2551} // Map coords for Europe
};
let dataset;

const sideBarList = document.querySelector('.side-bar__list-menu');
let mapCanvas = document.getElementById('map');
let sideBar = document.querySelector('.side-bar');
let sideBarToggle = sideBar.querySelector('.side-bar__toggle');

let map;
let markers = [];
let listHtml = '';

// initialise map
function initMap() {

    map = new google.maps.Map(mapCanvas, mapOptions);

}

// Add the marker
function plotMarker(data) {
    let marker = new google.maps.Marker({
        position: {lat: data.latitude, lng: data.longitude},
        map:map,
    });
    let infoWindow = new google.maps.InfoWindow({
        content: `
            <h2>This country is ${data.name}</h2>
            <p>It's Capital City is ${data.capital}</p>
            <p>The latitude and longitude for ${data.name} is ${data.latitude}, ${data.longitude}</p>`
    });
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}

// Add the menu item to the list
function createMenuItem(data, i) {
    listHtml += `
        <div class="side-bar__list-item">
            <h3>${data.name}</h3>
            <p>Capital city: ${data.capital}</p>
            <a href="javascript:toggleInfoBox(${i})"></a>
        </div>`
}

// Get data
fetch(dataURL)
    .then(response => response.json())
    .then(data => dataset = data)
    .then(function(dataset) {
        // dataset.map(function(location) {
        //     plotMarker(location);
        // })
        for (let i = 0; i < dataset.length; i++) {
            plotMarker(dataset[i]);
            createMenuItem(dataset[i], i)
        }
    })
    .then(function() {
        sideBarList.innerHTML = listHtml;
    })
    .catch(function(error) {
        console.log('An error has occurred: ', JSON.stringify(error))
    });

// Toggle function is used to toggle the side menu
function toggle(elem, target) {
    elem.addEventListener('click', function() {
        if( target.classList.contains('active')) {
            target.classList.remove('active');
            mapCanvas.classList.remove('side-bar-active')
        } else {
            target.classList.add('active');
            mapCanvas.classList.add('side-bar-active')
        }
    })
}
toggle(sideBarToggle, sideBar);

// toggleInfoBox is used to... toggle the info box, from the menu items
function toggleInfoBox(i) {
    google.maps.event.trigger(markers[i], "click");
}