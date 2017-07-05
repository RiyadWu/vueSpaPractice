<template>
    <div id="wrapper">
        <navbar></navbar>
        <div class="container">
            <div class="col-sm-3">
                <sidebar></sidebar>
            </div>
            <div class="col-sm-9">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import Sidebar from './components/Sidebar.vue'
    import Nav from './components/Nav.vue'

    export default {
        components: {
            'sidebar': Sidebar,
            'navbar': Nav,
        },
    }
</script>

<style>

</style>
