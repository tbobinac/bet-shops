<template>

    <loading-widget v-bind="loader">
        <div id="map" class="shadow"></div>
    </loading-widget>

</template>

<script>

    import '../../node_modules/leaflet/dist/leaflet.js'

    import LoadingWidget from './LoadingWidget.vue'
    import Helper from '../helpers/helpers'
    import { bus } from '../main'

    export default {
        components:{
            'loading-widget': LoadingWidget,
        },
        data() {
            return {
                map: null,
                tileLayer: null,
                betShops: [],
                currentMarker: null,
                apiCallShops: 'http://sa-proxy.azurewebsites.net/list?boundingBox=44.581149,26.304202,44.299059,25.553844',
                loader: {
                    loading: true,
                    error: false,
                    msg: "We're sorry, we're not able to retrieve this information at the moment, please try back later.",
                }

            }
        },
        methods: {

            // marker
            getMarkerIcon(){
                return L.icon({iconUrl:require('../assets/icons/ic_pin_normal.png'),iconSize:[33,45],iconAnchor:[16,45],
                });
            },

            // aktivni marker
            getActiveMarkerIcon(){
                return L.icon({iconUrl:require('../assets/icons/ic_pin_active.png'),iconSize:[48,65],iconAnchor:[24,65],});
            },

            // trenutna lokacija marker
            getCurrentLocationIcon(){
                return L.divIcon({className:'user-location-marker',iconSize:[24,24],})
            },

            // inicijalizacija mape (leaflet library)
            initMap() {
                this.map = L.map('map', {
                    center: [44.435105, 26.100019],
                    zoom: 13,
                    zoomControl:false
                });


                this.tileLayer = L.tileLayer(
                        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
                        {
                            maxZoom: 18,
                            id: 'mapbox.streets',
                            accessToken: 'pk.eyJ1IjoidGJvYmluYWMiLCJhIjoiY2pqbGJjcWFwMG9jaDNwcWl4c2JwZjN2YiJ9.4Gn_lDeJjvVYOJoAeSrtfg'
                        }
                );
                this.tileLayer.addTo(this.map);

                // dohvaćanje trenutno lokacije ako korisnik da dopuštenje, te postavljanje markera na tu lokaciju
                this.$getLocation()
                        .then(coordinates => {
                            this.map.setView(new L.LatLng(coordinates.lat, coordinates.lng), 15);
                            new L.marker([coordinates.lat,coordinates.lng], {icon: this.getCurrentLocationIcon() }).addTo(this.map);
                        }).catch(function(e) {
                    console.log(e);
                });

                this.initMarkers();
            },

            // inicijalizacija markera
            initMarkers(){

                var markersLayer = L.featureGroup().addTo(this.map);

                for (var i = 0; i < this.betShops.length; i++) {
                    var marker = new L.marker([this.betShops[i].Location.Lat,this.betShops[i].Location.Lng],{icon: this.getMarkerIcon()}).addTo(this.map);

                    marker.name = this.betShops[i].Name;
                    marker.address = this.betShops[i].Address;
                    marker.city = this.betShops[i].City;
                    marker.county = this.betShops[i].County;
                    marker.phone = this.betShops[i].Phone;
                    marker.workingHourStart = this.betShops[i].WorkingHourStart;
                    marker.workingHourEnd = this.betShops[i].WorkingHourEnd;
                    marker.addTo(markersLayer);

                }

                // bind on click eventa na svaki marker
                markersLayer.on("click", this.markerOnClick);
            },

            // promjena icone markera na koji se klikne, te slanje njegovih podataka u drugu komponentu
            markerOnClick(e){

                if(this.currentMarker != null){
                    this.currentMarker.setIcon(this.getMarkerIcon())
                }

                e.layer.setIcon(this.getActiveMarkerIcon());
                this.currentMarker = e.layer;

                bus.$emit('markerClicked', e.layer);
            },

            // dohvaćanje betshopova preko api-ja
            // ukoliko je success podaci se spremaju u local storage na sat vremena i mapa se incijalizira
            // ukoliko je došlo do greške, na ekranu se ispisuje poruka
            // dok se request ne izvrši na ekranu se vrti loading
            fetchShops(){
                this.axios
                        .get(this.apiCallShops)
                        .then(response => {
                            this.betShops = response.data;
                            Helper.setLocalItem("listOfShops", this.betShops, 3600);
                            this.initMap();
                        }).catch(error => {
                            console.log(error)
                            this.loader.error = true;
                        }).finally(() => {this.loader.loading = false;});
            },
        },
        mounted() {
            // provjera da li podaci već postoje u local storage
            // ukoliko podaci postoje mapa se inicijalizira
            // ukoliko podaci ne postoje poziva se funkcija za njihovo dohvaćanje
            if(Helper.getLocalItem('listOfShops')){
                this.betShops = Helper.getLocalItem('listOfShops');
                this.initMap();
                this.loader.loading = false;
            }else{
                this.fetchShops();
            }
        }
    }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    @import '../../node_modules/leaflet/dist/leaflet.css';

    #map{
        width:100%;
        min-height:580px;
        height:100%;
        border: 2px solid white;
    }

</style>

