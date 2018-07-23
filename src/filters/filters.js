import Vue from 'vue'

// filter za zaokruživanje broja na određeni broj decimala, kao parametre prima vrijednost i broj željeni broj decimala
Vue.filter('round', function(value, decimals) {
    if(!value) {
        value = 0;
    }
    if(!decimals) {
        decimals = 0;
    }
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
});