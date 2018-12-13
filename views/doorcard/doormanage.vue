<template>
    <div>
        <div class="f-header">
            <el-row>
                <el-col :span="6">
                    <label>卡ID：</label>
                    <el-input placeholder="请输入查询内容" size="small" v-model="headInput.cardSn"></el-input>
                    <el-button type="primary" round size="small" disabled>读卡</el-button>
                </el-col>
                <el-col :span="6">
                    <label>电<em class="a"></em>话：</label>
                    <el-input placeholder="请输入查询内容" size="small" v-model="headInput.personMobile"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>证件号：</label>
                    <el-input placeholder="请输入查询内容" size="small" v-model="headInput.certificateNo"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>房产地址：</label>
                    <el-input placeholder="请输入查询内容" size="small" v-model="headInput.address"></el-input>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-button type="primary" round size="small" @click="query_globalFunc()">查询</el-button>
                <el-button round size="small" @click="reset_globalFunc">重置</el-button>
            </el-row>
        </div>

        <div class="f-contain">
            <div>
                <h2 class="m_borderLeft_title">门禁卡操作</h2>
            </div>
            <el-row class="btnBox">
                <el-button type="primary" :disabled="curCardStatus== null || curCardStatus== 3 || curCardStatus== 4 || curCardStatus== 5" size="small" plain @click="authorizeBtn">门禁卡授权</el-button>
                <el-button type="primary" :disabled="curCardStatus== null || curCardStatus== 3 || curCardStatus== 4 || curCardStatus== 5" size="small" plain @click="updateStatusFunc('3')">挂失</el-button>
                <el-button type="primary" :disabled="curCardStatus== null || curCardStatus== 2 || curCardStatus== 4 || curCardStatus== 5" size="small" plain @click="updateStatusFunc('2')">解挂</el-button>
                <el-button type="primary" :disabled="curCardStatus== null || curCardStatus== 4" size="small" plain @click="updateStatusFunc('4')">注销</el-button>
                <el-button type="primary" :disabled="curCardStatus== null || curCardStatus== 4 || curCardStatus== 5" size="small" plain @click="updateStatusFunc('5')">禁用</el-button>
                <el-button type="primary" :disabled="curCardStatus== null || curCardStatus== 2 || curCardStatus== 3 || curCardStatus== 4" size="small" plain @click="updateStatusFunc('2')">启用</el-button>
                <el-button type="danger" :disabled="curCardStatus== null" size="small" plain @click="deleteRowFunc">删除</el-button>
            </el-row>
            <el-table
            ref="ref_global"
            highlight-current-row
            @current-change="curChangeFunc"
            :data="tableData_global"
            style="width: 100%"
            border
            size="mini">
                <el-table-column
                    label="序号"
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="卡ID"
                    prop="cardSn"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="卡类型"
                    prop="cardType"
                    :formatter="cardType_format"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="卡状态"
                    prop="cardStatusCode"
                    :formatter="cardStatus_format"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="关联住户"
                    prop="personName">
                </el-table-column>
                <el-table-column
                    prop="areaPaths"
                    label="关联房产"
                    :formatter="areaPaths_format"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="managementName"
                    label="发卡机构"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="issuingTime"
                    label="开卡时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="endDate"
                    label="失效日期"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="80">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="detail_Func(scope.$index,scope)"
                            type="text"
                            size="small">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
                <div class="block">
                    <el-pagination
                    @size-change="pageSizeChangeFunc"
                    @current-change="pageChangeFunc"
                    :current-page="page.current"
                    :page-sizes="[20, 50, 100, 200]"
                    :page-size="page.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total">
                    </el-pagination>
                </div>
            </div>
        </div>

    </div>
</template>
<style lang="scss" scoped>
.f-header label{
    width: 80px;
}
</style>
<script>
export default {
    data(){
        return {
            headInput:{
                cardSn: '',
                personMobile: '',
                certificateNo: '',
                address: ''
            },
            page:{
                current: 1,
                size: 20,
                total: 0
            },
            tableData_global:[
            ],
            curChangeData: null,
            curCardStatus: null,
        }
    },
    methods:{
        query_globalFunc(){
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                cardSn: this.headInput.cardSn,
                personMobile: this.headInput.personMobile,
                certificateNo: this.headInput.certificateNo,
                address: this.headInput.address
            }
            this.http_pageTableFunc(datas);
        },
        cardType_format(row, column, cellValue, index){
            if (cellValue==1) {
                return 'IC'
            }
            if (cellValue==2) {
                return 'CPU'
            }
            if (cellValue==3) {
                return 'NFC'
            }
            if (cellValue==4) {
                return 'ID'
            }
            if (cellValue==5) {
                return '身份证'
            }else{
                return '居住证'
            }
        },
        cardStatus_format(row, column, cellValue, index){
            // debugger;
            if (cellValue==1) {
                return '新建'
            }
            if (cellValue==2) {//解挂、启用
                return '激活'
            }
            if (cellValue==3) {
                return '挂失'
            }
            if (cellValue==4) {
                return '注销'
            }
            if (cellValue==5) {
                return '禁用'
            }
        },
        areaPaths_format(row, column, cellValue, index){
                return cellValue.join(',');
        },
        authorizeBtn(){
            if (this.curChangeData) {

                sessionStorage.setItem('curCardData_session',JSON.stringify(this.curChangeData));
                debugger;
                this.$router.push({path:'/doorauthorize/11'})
            }else{
                this.$message({
                    type: 'info',
                    message: '请选择门禁卡'
                })
            }
            
        },
        reset_globalFunc(){
            this.headInput= {
                cardSn: '',
                personMobile: '',
                certificateNo: '',
                address: ''
            }
        },
        detail_Func(index,scope){
            console.log(index);
            debugger;
            sessionStorage.setItem('curCardData_session',JSON.stringify(scope.row));
            this.$router.push({path:'/doordetail/'+index});
        },
        deleteRowFunc(){
            var data={
                id: this.curChangeData.cardId
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(()=>{
                this.http_deleteCard(data);
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });   
            })
            
        },
        curChangeFunc(cur,old){
            console.log(cur);
            this.curChangeData= cur;
            this.curCardStatus=this.curChangeData.cardStatusCode;
        },
        updateStatusFunc(val){
            debugger;
            var datas= {
                cardId: this.curChangeData.cardId, 
                nowStatus: this.curCardStatus, 
                changeStatus: val, 
            }
            this.http_updateCardStatus(datas);
        },
        http_updateCardStatus(datas){
            var _this= this;
            this.$post('/app/hpc-aggr/hpc/updateCardStatus',datas)
                .then(function (response) {
                    console.log(response);
                    debugger;
                    if (response.data.code==0) {
                        _this.$message({
                            type: 'success',
                            message: '状态修改成功'
                        })
                        var ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2'
                        }
                        _this.http_pageTableFunc(ddd);
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
        http_pageTableFunc(data){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/showCardListPage',data)
            .then(function (response) {
                console.log(response);
                // debugger;
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    _this.tableData_global= msgDatas.records;
                    _this.curCardStatus=null;
                    _this.page.total= msgDatas.total;
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
        http_deleteCard(data){
            var _this=this;
            this.$post('/app/hpc-aggr/hpc/deleteCard',data)
            .then(function (response) {
                console.log(response);
                // debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    var ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2'
                        }
                    _this.http_pageTableFunc(ddd);
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
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2'
            }
            this.http_pageTableFunc(data);
        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2'
            }
            this.http_pageTableFunc(data);
        },
    },
    created() {
        var data={
            pageNum: this.page.current,
            pageSize: this.page.size,
            managementId: '6b0c4ccab56711e88a4a000c29a401f2'
        }
        this.http_pageTableFunc(data);
    },
}
</script>


