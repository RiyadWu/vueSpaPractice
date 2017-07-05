<template>
    <!--这里可以用v-for循环数据动态构建页面-->
    <div class="img-block clip-block">
        <div class="img-bg imgsrc"></div>
        <span class="clip-user-name">{{ sectionUser }}</span>
        <a class="clip-link" data-user='sectionUser' data-id='sectionId'>截图预览</a>
        <div class="clip-info">
            {{sName}}
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            isAdmin() {
                return this.$store.state.isAdmin
            }
        },
        data() {
            return {
                sectionUser: '大葱鸭',
                sectionId: 234,
                sName: '皮卡丘',
            }
        },
        method: {
            openImage() {
                console.log('openImage')
            },

        }
    }
</script>

<style>
    .imgsrc {
        background-image: url('../../static/images/bg1.jpg')
    }
</style>
