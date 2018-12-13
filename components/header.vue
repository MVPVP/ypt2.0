<template>
    <div class="cp_header layout_min_width">
            <div class="">
                <i class="logo iconfont icon-yunpingtai"></i>
                <h1>赛翼智慧社区云平台</h1>
            </div>
            <div class="adminBox">
                欢迎：{{userName}}
            </div>
            <div class="moreBox">
                <div class="iconBox" @mouseover="dropdownFunc" @mouseout="dropdown_mouseoutFunc">
                    <i class="iconfont icon-gengduoneirong"></i>
                    <ul class="dropdown" v-show="visible_dropdown">
                        <router-link tag="li" to="/resource">返回首页</router-link>
                        <router-link tag="li" to="/login">退出登录</router-link>
                    </ul>
                </div>
            </div>
    </div>
</template>

<style lang="scss" scoped>
.cp_header{
    height: $head_height;
    line-height: $head_height;
    width: 100%;
    background: $color_active;
    display: flex;
    i.logo{
        vertical-align: middle;
        margin: 0 10px 0 17px;
        font-size: 30px;
        color: #fff;
    }
    h1{
        color: #fff;
        display: inline-block;
        font-size: 18px;
    }
    .adminBox{
        flex: 0.9;
        text-align: right;
        color: #fff;
    }
    .moreBox{
        flex: 0.1;
        margin-right: 70px;
        text-align: right;
        z-index: 1;
        .iconBox{
            width: 100px;
            float: right;
            position: relative;
            height: 80px;
            text-align: center;
            cursor: pointer;
            .iconfont{
                font-size: 22px;
                color: #fff;
            }
        }
        .dropdown{
            position: absolute;
            top: 80px;
            width: 100px;
            color: #fff;
            text-align: center;
            li{
                font-size: 14px;
                line-height: 32px;
                border-top: 1px solid #fff;
                background: #4381E6;
                opacity: .9;
            }
            li:hover{
                background: #417ccc;
                opacity: 1;
            }
        }
    }
}
</style>

<script>
export default {
    data(){
        return {
            userName: sessionStorage.getItem('session_username'),
            visible_dropdown: false,
        }
    },
    methods:{
        dropdownFunc(){
            this.visible_dropdown= true;
        },
        dropdown_mouseoutFunc(){
            this.visible_dropdown= false;
        },

    }
}
</script>



