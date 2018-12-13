<template>
  <div>
        <head-top></head-top>
        <side-bar @childEmit="emitSideBar"></side-bar>
        <div class="f-main" style="margin-left:315px;min-width:1285px;">
            <bread-crumb></bread-crumb>
            <router-view></router-view>
        </div>
        
  </div>
</template>
<script>
    import headTop from '@/components/header.vue'
    import sideBar from '@/components/sidebar.vue'
    import breadCrumb from '@/components/breadcrumb.vue'

    import {clientObj} from '@/utils/common.js'
    export default{
        data(){
            return {
                clientObj: clientObj
            }
        },
        components:{
            sideBar,
            breadCrumb,
            headTop
        },
        methods:{
            emitSideBar(bool){
                console.log('bool:'+bool);
                if(bool){
                    document.querySelector('.f-main').style.marginLeft='315px';
                    document.querySelector('.f-main').style.minWidth=1600-315+'px';
                }else{
                    document.querySelector('.f-main').style.marginLeft='80px';
                    document.querySelector('.f-main').style.minWidth=1600-80+'px';
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.f-main{
    background: #fff;
    padding: 10px;
    transition: all .3s;
    overflow: hidden;
}
</style>

