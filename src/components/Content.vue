<template>
    <!--这里可以用v-for循环数据动态构建页面-->
    <div class="img-block">
        <div @click="openImage()" class="img-bg imgsrc" title=查看病理图详细></div>
        <div class="wsi-template">
            <p @click="openImage()" class="wsi-name" title=查看病理图详细>
                {{ imageName }}
            </p>
            <div v-if="isAdmin">
                <span data-id='${imageId}' class="wsi-del" title=删除病理图>删除</span>
                <p class="wsi-regions" title=视野个数>{{ numRegion }}</p>
            </div>

            <div v-else>
                <p class="wsi-percentage" title=已被标记比例>{{ percentage }}</p>
            </div>
            <a data-id='imageId' data-image='${imageName}' class='wsi-preview' title=截图截图>视野截图</a>

        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            time() {
                return this.$store.state.totalTime
            },
            isAdmin() {
                return this.$store.state.isAdmin
            }
        },
        data() {
            return {
                imageName: '这是图片名',
                numRegion: 123,
                percentage: 54,
                imageId: 9384,
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
        background-image: url('../../static/images/bg.jpeg')
    }
</style>
