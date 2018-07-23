<template>
  <div class="container">
    <div class="l-wrap">

        <div class="l-map mt15">
            <app-map></app-map>
        </div>

      <div class="l-sidebar mt15">
          <details-widget></details-widget>
          <weather-widget></weather-widget>
      </div>

    </div>
  </div>
</template>

<script>

import Map from './components/Map.vue';
import DetailsWidget from './components/DetailsWidget.vue';
import WeathersWidget from './components/WeatherWidget.vue';

export default {
  components:{
    'app-map': Map,
    'details-widget': DetailsWidget,
    'weather-widget': WeathersWidget,
  },
  data () {
    return {}
  }
}
</script>


