<template>
    <div>
        <div class="f-header">
            <el-row>
                <el-col :span="6">
                    <label>应用名称：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.appName"></el-input>
                </el-col>

                <el-col :span="6">
                    <label>应用类型：</label>
                    <el-select clearable v-model="headInput.appType" placeholder="请选择" size="small">
                        <el-option v-for="item in option_appType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label>应用编码：</label>
                    <el-select clearable filterable v-model="headInput.appEncode" placeholder="请选择" size="small" @change="aaaaa">
                        <el-option v-for="item in option_appEncodes"
                        :key="item.appInfoId"
                        :label="item.appEncode"
                        :value="item.appEncode">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label style="width:120px;">适用设备型号：</label>
                    <el-select clearable multiple v-model="headInput.equipmentModel" placeholder="请选择" size="small">
                        <el-option v-for="item in option_equipType"
                        :key="item.equipmentModelId"
                        :label="item.equipmentModel"
                        :value="item.equipmentModelId">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="query_globalFunc()">查询</el-button>
                    <el-button round size="small" @click="reset_globalFunc">重置</el-button>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="addBtn_globalFunc(operateStatus=1)">创建应用</el-button>
                </el-col>
            </el-row>
        </div>

        <div class="f-contain">
            <el-table
            ref="ref_global"
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
                    label="应用名称"
                    prop="appName"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="应用类型"
                    prop="appType"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="应用编码"
                    prop="appEncode"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="适用设备型号"
                    :formatter="format_equipmentModelNames"
                    prop="equipmentModelNames">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="creator"
                    label="创建者"
                    width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="最后更新时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="modifier"
                    label="更新者"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="addBtn_globalFunc(operateStatus=2,scope)"
                            type="text"
                            size="small">
                            编辑
                        </el-button>
                        <el-button
                            v-show="scope.row.publishStatus==0"
                            @click.native.prevent="deleteRowFunc(scope)"
                            type="text"
                            size="small"
                            class="btnDel">
                            删除
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

        <!-- 弹窗 -->
        <el-dialog :title="operateStatus==1 ? '创建应用' : '编辑应用' " :visible.sync="dialogFormVisible_nnnn" width="600px" @close="dialogFormVisibleClose">
            <div class="box">
                <div class="m_dialogMain">
                    <el-form size="small" :model="formData_dialog" :rules="rules_dialog" ref="ref_dialog" :label-width="formLabelWidth">
                        <el-form-item label="应用名称：" prop="appName">
                            <el-input v-model="formData_dialog.appName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <!-- publishStatus==1 已经发布 && operateStatus==2 编辑操作; -->
                        <el-form-item label="应用类型：" prop="appType">
                            <el-select v-model="formData_dialog.appType" placeholder="请选择" :disabled="publishStatus==1 && operateStatus==2">
                                <el-option v-for="item in option_appType"
                                :key="item.id"
                                :label="item.name" 
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="应用编码：" prop="appEncode">
                            <el-input  v-model="formData_dialog.appEncode" placeholder="请输入" clearable :disabled="publishStatus==1 && operateStatus==2"></el-input>
                        </el-form-item>
                        <el-form-item label="适用设备型号：" prop="equipmentModel">
                            <el-select @change="changeSelectFunc" multiple v-model="formData_dialog.equipmentModel" placeholder="请选择">
                                <el-option v-for="item in option_equipType"
                                :key="item.equipmentModelId"
                                :label="item.equipmentModel" 
                                :value="item.equipmentModelId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注：" prop="remark">
                            <el-input type="textarea"  v-model="formData_dialog.remark" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="resetForm" v-show="operateStatus==1">重置</el-button>
                    <el-button type="primary" round size="small" @click="saveOrUpdateFunc">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<style lang="scss" scoped>
.f-header{
    
} 
.el-dialog{
    .box{
        margin: 20px;
        padding-right: 40px;
    }
    .el-select{
        width: 100%;
    }
}
</style>
<script>
import {arrayToAttrArray} from '@/utils/common.js'

export default {
    data(){
        return {
            headInput:{
                appName: '',
                appType: '',
                appEncode: '',
                equipmentModel: [],
            },
            page:{
                current: 1,
                size: 20,
                total: 0
            },
            operateStatus: '1',//1为创建；2为编辑；
            publishStatus: null,//0未发布 1已发布；
            formLabelWidth: '120px',
            formData_dialog:{
                appName : '',
                appType : '',
                appEncode : '',
                equipmentModel : [],
                remark : '',
            },
            option_appType:[],
            option_equipType:[],
            option_appEncodes:[],

            tableData_global:[],
            dialogFormVisible_nnnn: false,
            prev_edit_appEncode: '',
            rules_dialog:{
                appName:[
                    {required: true, message: '不可为空', trigger: 'blur'}
                ],
                appEncode:[
                    {required: true, message: '不可为空', trigger: 'blur'}
                ],
                appType:[
                    {required: true, message: '请选择', trigger: 'change'}
                ],
                equipmentModel:[
                    {required: true, message: '请选择', trigger: 'change'}
                ],
            }
        }
    },
    methods:{
        aaaaa(a,b,c){
            debugger;
        },
        query_globalFunc(){
            console.log('chaxun');
            debugger;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                appName: this.headInput.appName,
                appType: this.headInput.appType,
                appEncode: this.headInput.appEncode,
                equipmentModelIds: this.headInput.equipmentModel.join(','),
                "creator": sessionStorage.getItem('session_username'),
                "creatorId": sessionStorage.getItem('session_userId')
            }
            this.http_applicationListTableFunc(data);
        },
        format_equipmentModelNames(row, column, cellValue, index){
            if (cellValue) {
                return cellValue.join(',');
            }else{
                return '-'
            }
            
        },
        dialogFormVisibleClose(){
            console.log('close');
            this.resetForm();
        },
        resetForm() {
            console.log('重置');
            this.$refs.ref_dialog.resetFields();
        },
        sortFunc_time(arr_array,attr_tring){//按照数组arr_array，的attr_tring属性降序排序；
            var arr_array= arr_array,
                attr_string= attr_tring;
            arr_array.sort((a,b)=>{
                var aa= a[attr_tring].replace(/[- :]/g,''),
                    bb= b[attr_tring].replace(/[- :]/g,'');
                return bb-aa;
            })
            // debugger;
            return arr_array;
        },
        addBtn_globalFunc(operateStatus,scope){
            var _this= this;
            this.formData_dialog= {
                appName : '',
                appType : '',
                appEncode : '',
                equipmentModel : [],
                remark : '',
            },
            this.dialogFormVisible_nnnn= true;
            debugger
            
            this.operateStatus= operateStatus;
            if (this.operateStatus==1) {
                this.formData_dialog.equipmentModel =[];
            }else{
                debugger;
                var data={
                    id: scope.row.appInfoId
                }
                // this.http_publishStatus(data);
                this.formData_dialog={
                    appName : scope.row.appName,
                    appType : scope.row.appTypeId,
                    appEncode : scope.row.appEncode,
                    equipmentModel : scope.row.equipmentModelIds,
                    remark : scope.row.remark,
                    appInfoId: scope.row.appInfoId
                }
                this.prev_edit_appEncode= scope.row.appEncode;
                this.publishStatus= scope.row.publishStatus;
            }
        },
        // http_publishStatus(data){
        //     var _this=this;
        //     this.$post('/app/version-aggr/version/isPublishStatus',data)
        //     .then(function (response) {
        //         console.log(response);
        //         debugger;
        //         if (response.data.code==0) {//0未发布 1已发布 
        //             _this.publishStatus= response.data.data;
        //             if (_this.publishStatus==0) {
        //                 // this.option_equipType =['222','9999'];
        //                 // sessionStorage.setItem('session_moreSelect',this.option_equipType);
        //             }else{
        //                 _this.$message({
        //                     type: 'info',
        //                     message: response.data.msg
        //                 })
        //             }
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        // },
        reset_globalFunc(){
            this.headInput= {
                appName: '',
                appType: '',
                appEncode: '',
                equipmentModel: [],
            }
        },
        deleteRowFunc(scope){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                debugger;
                var datas={
                    "id": scope.row.appInfoId,
                }
                this.http_deleteRowFunc(datas)
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        http_deleteRowFunc(datas){
            var _this=this;
            this.$post('/app/version-aggr/version/deleteAppInfo',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    var data={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size
                    }
                    _this.http_applicationListTableFunc(data);
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
        saveOrUpdateFunc(){
            var equipmentModelId= this.formData_dialog.equipmentModel,
                equipmentModelName= [],
                _this=this;

            //应用编码不可重复；
            var arrayCode=arrayToAttrArray(this.option_appEncodes,'appEncode');
            if (this.operateStatus==2) {//编辑状态，去掉自身
                arrayCode.splice(arrayCode.indexOf(this.prev_edit_appEncode),1);
            }
            if (arrayCode.indexOf(this.formData_dialog.appEncode)>=0) {
                this.$message({
                    type: 'info',
                    message: '应用编码不可重复'
                })
                return false;
            }
     
        
            debugger
            this.option_equipType.forEach((item)=>{
                if (equipmentModelId.indexOf(item.equipmentModelId)>=0) {
                    equipmentModelName.push(item.equipmentModel)
                }
            })

            this.$refs.ref_dialog.validate((valid)=>{
                debugger;
                var datas={
                    appName : _this.formData_dialog.appName,
                    appType : _this.formData_dialog.appType,
                    appEncode : _this.formData_dialog.appEncode,
                    equipmentModelId : equipmentModelId,
                    equipmentModelName : equipmentModelName,
                    remark : _this.formData_dialog.remark,
                    appInfoId : _this.operateStatus==2 ? this.formData_dialog.appInfoId : '',
                    "creator": sessionStorage.getItem('session_username'),
                    "creatorId": sessionStorage.getItem('session_userId')
                }
                _this.http_saveOrUpdate(datas);
            })
            
            
        },
        http_saveOrUpdate(datas){
            debugger;
            var _this= this;
            this.$post('/app/version-aggr/version/saveOrUpdate',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogFormVisible_nnnn= false;
                    var data={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size
                    }
                    _this.http_applicationListTableFunc(data);
                    _this.http_queryAppTypesFunc();
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
        http_applicationListTableFunc(data){
            var _this=this;
            this.$get('/app/version-aggr/version/showAppInfoPage',data)
            .then(function (response) {
                console.log(response);
                // debugger;
                if (response.data.code==0) {
                    var msgDatas= response.data.data.records || [],
                    msgDatas= _this.sortFunc_time(msgDatas,'updateTime');
                    debugger;
                    _this.tableData_global= msgDatas;
                    _this.page.total= response.data.data.total;
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
        http_queryAppTypesFunc(){
            var _this=this;
            this.$get('/app/version-aggr/version/queryAppTypes')
            .then(function (response) {
                console.log(response);
                // debugger;
                if (response.data.code==0) {
                    _this.option_appType= response.data.data;
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
        http_queryAppEncodesFunc(){
            var _this=this;
            this.$get('/app/version-aggr/version/queryAppEncodes')
            .then(function (response) {
                console.log(response);
                // debugger;
                if (response.data.code==0) {
                    _this.option_appEncodes= response.data.data;
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
        http_queryEquipmentModelsFunc(){
            var _this=this;
            this.$get('/app/version-aggr/version/queryEquipmentModels')
            .then(function (response) {
                console.log(response);
                // debugger;
                if (response.data.code==0) {
                    _this.option_equipType= response.data.data;
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
        changeSelectFunc(curTag){
            // var val=this.option_equipType;
            // debugger;
            // var prev_val= sessionStorage.getItem('session_moreSelect').split(',');
            // debugger;
            // prev_val.forEach((item)=>{
            //     if (val.indexOf(item)<0) {
            //         this.option_equipType.push(item);
            //     }
            // })
        },
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                appName: this.headInput.appName,
                appType: this.headInput.appType,
                appEncode: this.headInput.appEncode,
                equipmentModelIds: this.headInput.equipmentModel.join(','),
                "creator": sessionStorage.getItem('session_username'),
                "creatorId": sessionStorage.getItem('session_userId')
            }
            this.http_applicationListTableFunc(data);
        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                appName: this.headInput.appName,
                appType: this.headInput.appType,
                appEncode: this.headInput.appEncode,
                equipmentModelIds: this.headInput.equipmentModel.join(','),
                "creator": sessionStorage.getItem('session_username'),
                "creatorId": sessionStorage.getItem('session_userId')
            }
            this.http_applicationListTableFunc(data);
        },
    },
    created() {
        var data={
            pageNum: this.page.current,
            pageSize: this.page.size
        }
        this.http_applicationListTableFunc(data);

        this.http_queryAppTypesFunc();
        this.http_queryAppEncodesFunc();
        this.http_queryEquipmentModelsFunc();
    },
}
</script>


