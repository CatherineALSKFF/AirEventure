mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: events.geometry.coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl())

new mapboxgl.Marker()
.setLngLat(events.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML(`<p>${events.title}</p><p class='text-muted'>${events.location}</p>`)) 
.addTo(map);