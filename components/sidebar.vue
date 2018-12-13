<template>
    <div class="cp_sidebar" style="width: 300px;">
        <div class="toggleBox clearfix" @click="toggleFunc(isCollapse)"><span class="btn"></span></div>
        <el-menu @open="handleOpen" @close="handleClose" :router="true" :collapse="isCollapse" :unique-opened="true" :default-active="$route.path">
            <el-submenu :index="item.name" v-for="(item,index) in routeArray" :key="index" v-if="item.children">
                <template slot="title">
                    <i :class="item.meta.icon"></i>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item :index="itemChild.path" v-if="itemChild.path.indexOf(':')<0" v-for="(itemChild,indexChild) in (item.children)" :key="indexChild">
                        {{itemChild.name}}
                    </el-menu-item> 
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
    import {routeArray} from '@/router/index.js'
    export default{
        data(){
            return {
                routeArray: routeArray,
                isCollapse: false
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            toggleFunc(ee){
                this.$emit('childEmit',ee);
                if(ee){
                    document.querySelector('.cp_sidebar').style.width='300px';
                    this.isCollapse=false;
                }
                else{
                    document.querySelector('.cp_sidebar').style.width='65px';
                    this.isCollapse=true;
                }
                    
            }
        }
    }
</script>
<style lang="scss">
.cp_sidebar{
    position: absolute;
    top: $head_height;
    bottom: 0;
    border-right: solid 1px #e6e6e6;
    background: #fff;
    transition: width 0.3s;
    overflow-y: auto;
    z-index: 1111;
    .el-menu{
        border-right: none;
        .el-submenu__title{
            background: #F6F8FC;
        }
        .el-submenu.is-active .el-submenu__title{
            background: $color_active;
            color: #fff;
            i{
                color: #fff;
            }
        }
        .el-submenu{
            border-bottom: 1px solid #fff;
        }
    }
    .toggleBox {
        text-align: right;
        .btn{
            width: 32px;
            height: 32px;
            background: #F6F8FC;
            border-radius: 5px;
            margin: 8px 15px;
            display: inline-block;
            cursor: pointer;
        }
    }
    .el-menu-item-group__title{
        padding: 0;
    }
}
</style>

