<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadList" :to="{path: item.path}" :key="item.name">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<style lang="scss" scoped>
.el-breadcrumb{
    line-height: 36px;
    font-size: 15px;
    color: #417ccc;
    margin-bottom: 10px;
    background-color: white;
    padding-bottom: 5px;
    border-bottom: 5px #F7F8FC solid;
}
</style>
<script>
export default {
    data(){
        return{
            breadList: []
        }
    },
    methods:{
        getBreadcrumb(){
            var breadNumber= typeof(this.$route.meta.breadNumber) != "undefined" ? this.$route.meta.breadNumber : 1,//默认为
                newBread={
                    name: this.$route.name,
                    path: this.$route.path,
                },
                list=this.$store.getters.breadListGetters;//获取breadList数组
            if (this.$route.path=='/resource') {
                list.push(newBread);
            }
            list.splice(breadNumber,list.length-breadNumber,newBread);
            this.$store.commit('breadListMutations', JSON.stringify(list));
            this.breadList= this.$store.getters.breadListGetters;
        }
    },
    watch: {
        $route(to,from){
            this.getBreadcrumb();
        }
    },
    created() {
        this.getBreadcrumb();
    },
}
</script>

/* 
1、面包屑；
2、breadNumber为层级；
0：为首页；
1：为默认一级；
 */

