<template>
    <aside>
        <div class="view-function-list functions">
            <router-link to="/content">
                <button class="all-wsi active" type="button">全部病理图</button>
            </router-link>
            <router-link to="/content1">
                <button class="all-clips active" type="button">已导出视野截图</button>
            </router-link>
        </div>

        <!-- <div class="mark-meaning">
          <p class="mark-title">标记</p>
          <p>
            <icon class="bk-red"></icon>
            已阅
          </p>
          <p>
            <icon class="bk-orange"></icon>
            未阅
          </p>
          <p>
            <icon class="bk-green"></icon>
            已创建区域截图
          </p>
          <p>
            <icon class="bk-blue"></icon>
            学生1标记
          </p>
          <p>
            <icon class="bk-purple"></icon>
            学生2标记
          </p>
        </div> -->

        <!-- <div class="hospital-search">
          <input type="text" placeholder="快速搜索医院" name="" value="">
        </div> -->
    </aside>

</template>

<script>
    export default {
        computed: {
            time() {
                return this.$store.state.totalTime
            }
        },
        data() {
            return {
                foo: 'foo'
            }
        }
    }
</script>

<style>
    .functions {
        position: relative;
        margin-top: 0;
    }
</style>
