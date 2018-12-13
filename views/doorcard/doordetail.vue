<template>
    <div>
        <div class="f-contain">
            <div class="box">
                <div class="header">
                    <h2 class="m_borderLeft_title">卡片信息</h2>
                </div>
                <div class="contain">
                    <el-row>
                        <el-col :span="6">
                            <label for="">卡ID：</label><span>{{headInput.cardSn}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label for="">卡片类型：</label><span>{{headInput.cardType}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label for="">备注：</label>
                            <span>{{headInput.remark}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label for="">卡片状态：</label><span>{{headInput.cardStatus}}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="box">
                <div class="header">
                    <h2 class="m_borderLeft_title">绑定住户</h2>
                </div>
                <div class="contain">
                    <div class="m-cardBox" v-show="personInfo.hasOwnProperty('personName')">
                        <div class="header">
                            <span class="name">{{personInfo.personName}}</span>
                            <span class="statu fr">状态：<em style="font-style:normal;">正常</em></span>
                        </div>
                        <div class="main">
                            <el-row>
                                <el-col :span="12">
                                    <label for="">证件类型：</label><span>{{personInfo.certificateType}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <label for="">证件号码：</label><span>{{personInfo.certificateNo}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <label for="">绑定时间：</label><span>{{personInfo.boundDate}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <label for="">有效期：</label><span>{{personInfo.startDate}}~{{personInfo.endDate}}</span>
                                </el-col>
                                <el-col :span="24">
                                    <label for="">电话号码：</label><span>{{personInfo.phones}}</span>
                                </el-col>
                                <el-col :span="24">
                                    <dl>
                                        <dt>关联房产：</dt>
                                        <dd v-for="item in personInfo.rooms" :key="item.areaId">{{item.areaPath}}</dd>
                                    </dl>
                                </el-col>

                            </el-row>
                        </div>
                    </div>
                    <div style="color: #999;line-height: 40px;" v-show="!personInfo.hasOwnProperty('personName')">
                        你当前未绑定用户
                    </div>
                </div>
            </div>
            <div class="box">
                <div class="header">
                    <h2 class="m_borderLeft_title">授权房产</h2>
                </div>
                <div class="contain">
                    <el-table
                    ref="ref_global"
                    :data="tableData_global"
                    style="width: 80%"
                    border
                    size="mini">
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            label="房产"
                            prop="areaPath">
                        </el-table-column>
                        <el-table-column
                            label="授权状态"
                            prop="authorizationStatus"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            label="授权有效期"
                            prop="expiryDate">
                        </el-table-column>
                        <el-table-column
                            label="授权方式"
                            prop="permissionRole">
                        </el-table-column>
                        <el-table-column
                            prop="addDate"
                            label="添加时间"
                            show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <el-row class="m_footBox">
                <el-button type="danger" @click="backFunc" round size="small" >返回</el-button>
            </el-row>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.f-contain{
    .el-col{
        line-height: 40px;
        label,dt{
            padding: 0 10px 0 0;
            // width: 90px;
            text-align: right;
            display: inline-block;
        }
    }
    .el-input{width: 180px;}
    .m-cardBox{
        width: 80%;
        dt{
            float: left;

        }
        dd{
            margin-left: 84px;
        }
    }
}
</style>
<script>
export default {
    data(){
        return{
            tableData_global:[],
            headInput:null,
            personInfo:{}
        }
    },
    methods:{
        backFunc(){
            this.$router.push({path: '/doormanage'});
        },
        http_getCardBindPersonInfo(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryCardBindPersonInfo',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var msg= response.data.data;
                    msg.phones= msg.phones.join(',');
                    _this.personInfo= msg;
                }else{
                    _this.$message({
                        type: 'info',
                        message: response.data.msg
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        http_getCardAuthorizationAreas(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryCardAuthorizationAreas',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                   var msg=response.data.data;
                   _this.tableData_global=msg;
                }else{
                    _this.$message({
                        type: 'info',
                        message: response.data.msg
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    },
    created() {
        this.headInput= JSON.parse(sessionStorage.getItem('curCardData_session'));
        debugger;
        var ddd={
            cardId: this.headInput.cardId,
            managementId: '6b0c4ccab56711e88a4a000c29a401f2',
        }
        this.http_getCardBindPersonInfo(ddd);
        this.http_getCardAuthorizationAreas(ddd);
    },
}
</script>


