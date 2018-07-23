// komponenta koja se koristi prilikom dohvaćanja podataka sa api-ja


<template>
    <div class="widget">
        <div class="loading-wrapper" v-if="loading || error">
            <section class="loader"  v-if="loading"></section>
            <section class="message" v-if="error">{{ msg }}</section>
        </div>
        <slot></slot>
    </div>
</template>

<script>

    export default {
        props: ['loading','error','msg'],
        data () {
            return {}
        }
    }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    .widget{position:relative;width:100%;}

    .loading-wrapper {
        position: absolute;
        z-index: 999;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #ffffff;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loader {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        border: .2rem solid $dark-grey;
        border-top-color: $red;
        -moz-animation: spin .8s infinite linear;
        -o-animation: spin .8s infinite linear;
        -webkit-animation: spin .8s infinite linear;
        animation: spin .8s infinite linear;
        background: 0 0;
    }


    .message{
        @extend .l300;
        font-size:18px;
        line-height:1.4;
        color:$dark-grey;
        padding:40px;
        text-align:center;

        @media (max-width: $sm) {
            font-size:16px;
            padding:20px;
        }
    }

</style>