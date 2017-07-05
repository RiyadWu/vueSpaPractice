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
        methods: {
            ajax() {
                return {
                    a: 1,
                    b: 2,
                }
            }
        },
        mounted: function () {
            // 页面加载完成后会执行此函数，
            console.log('mounted')

            // 用self保存app实例的引用，防止this变化后导致的错误
            const self = this

            // 可以在这里调用后台接口（ajax/vue-resource），获取初始化数据
            const dataPool = self.ajax()
            
            // 保存到vuex中
            this.$store.dispatch('prepareDataPool', dataPool)
        }
    }
</script>

<style>

</style>
