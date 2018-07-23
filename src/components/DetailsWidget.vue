<template>
    <div class="sidebar-box shadow">
        <div v-show="!isSelected">
            <span>Choose betting shop from the map to see details.</span>
        </div>
        <div v-show="isSelected">
            <div class="details-group">
                <div class="mr15"><img src="../assets/icons/ic_bet_shop_location.png"></div>
                <div>
                    <p>{{betShop.name}}</p>
                    <p>{{betShop.address}}</p>
                    <p>{{betShop.city}} - {{betShop.county}}</p>
                </div>
            </div>
            <div class="details-group mt15">
                <div class="mr15"><img src="../assets/icons/ic_bet_shop_phone.png"></div>
                <div>
                    <p>{{betShop.phone}}</p>
                </div>
            </div>
            <div class="details-group mt15">
                <div class="mr15"><img src="../assets/icons/ic_bet_shop_hours.png"></div>
                <div>
                    <p v-show="isOpen"> Open now until : {{betShop.workingHourEnd}}</p>
                    <p v-show="!isOpen"> Opens tomorrow at  : {{betShop.workingHourStart}}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { bus } from '../main'
import moment from 'moment';

export default {
    data () {
        return {
            betShop: {},
            isSelected: false,
            isOpen: false,
        }
    },
    created(){
        // kada se aktivira event na marker iz druge komponente funkcija prima podatke, zatim ih obrađuje i ispisuje na ekran
        bus.$on("markerClicked", (data) => {
            this.betShop = Object.assign({}, this.betShop, {
                name: data.name,
                address: data.address,
                city: data.city,
                county: data.county,
                phone: data.phone,
                workingHourStart: data.workingHourStart,
                workingHourEnd: data.workingHourEnd,
            });

            var currentHours = moment().hour();

            if(parseInt(this.betShop.workingHourStart) <= currentHours && currentHours < parseInt(this.betShop.workingHourEnd)){
                this.isOpen = true;
            }else{
                this.isOpen = false;
            }

            this.isSelected = true;
        })
    }
}

</script>


<style lang="scss" rel="stylesheet/scss" scoped>

    .sidebar-box{ padding: 22px 18px;}

    .details-group{display:flex;}

    p{
        @extend .os400;
        font-size: 15px;
        line-height: 1.4;
        color: #808080;
    }

    img{margin-top:-2px;}

    span{
        display:inline-block;
        @extend .l300;
        line-height: 1.4;
        color:$dark-grey;
        font-size:18px;
        padding: 20px;

    }

</style>