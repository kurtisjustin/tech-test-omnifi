"use strict";var dataURL="https://s3-eu-west-1.amazonaws.com/omnifi/techtests/locations.json",mapOptions={zoom:4,center:{lat:54.526,lng:15.2551}},dataset=void 0,sideBarList=document.querySelector(".side-bar__list-menu"),mapCanvas=document.getElementById("map"),sideBar=document.querySelector(".side-bar"),sideBarToggle=sideBar.querySelector(".side-bar__toggle"),map=void 0,markers=[],listHtml="";function initMap(){map=new google.maps.Map(mapCanvas,mapOptions)}function plotMarker(t){var e=new google.maps.Marker({position:{lat:t.latitude,lng:t.longitude},map:map}),a=new google.maps.InfoWindow({content:"\n            <h2>This country is "+t.name+"</h2>\n            <p>It's Capital City is "+t.capital+"</p>\n            <p>The latitude and longitude for "+t.name+" is "+t.latitude+", "+t.longitude+"</p>"});e.addListener("click",function(){a.open(map,e)}),markers.push(e)}function createMenuItem(t,e){listHtml+='\n        <div class="side-bar__list-item">\n            <h3>'+t.name+"</h3>\n            <p>Capital city: "+t.capital+'</p>\n            <a href="javascript:toggleInfoBox('+e+')"></a>\n        </div>'}function toggle(t,e){t.addEventListener("click",function(){e.classList.contains("active")?(e.classList.remove("active"),mapCanvas.classList.remove("side-bar-active")):(e.classList.add("active"),mapCanvas.classList.add("side-bar-active"))})}function toggleInfoBox(t){google.maps.event.trigger(markers[t],"click")}fetch(dataURL).then(function(t){return t.json()}).then(function(t){return dataset=t}).then(function(t){for(var e=0;e<t.length;e++)plotMarker(t[e]),createMenuItem(t[e],e)}).then(function(){sideBarList.innerHTML=listHtml}).catch(function(t){console.log("An error has occurred: ",JSON.stringify(t))}),toggle(sideBarToggle,sideBar);