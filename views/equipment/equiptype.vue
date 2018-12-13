<template>
  <div>
      <div class="f-header">
        <el-row>
            <el-col :span="6">
                <label>设备类型：</label>
                <el-select clearable v-model="select_equiptype" placeholder="请选择" size="small" @change="selectFunc">
                    <el-option v-for="item in options_equiptype"
                    :key="item.id"
                    :label="item.equipmentType"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <label>设备型号：</label>
                <el-input clearable placeholder="请输入查询内容" size="small" v-model="version_txt"></el-input>
            </el-col>
            <el-col :span="6">
                <label>设备名称：</label>
                <el-input clearable placeholder="请输入查询内容" size="small" v-model="equipname_txt"></el-input>
            </el-col>
            <el-col :span="6">
                <label>备注：</label>
                <el-input clearable placeholder="请输入查询内容" size="small" v-model="remark_txt"></el-input>
            </el-col>
        </el-row>
            <el-row>
                <el-col :span="24">
                    <el-button type="primary" round size="small" @click="queryResourseFunc()">查询</el-button>
                    <el-button round size="small" @click="resetFunc">重置</el-button>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                
                <el-col :span="24">
                    <el-button type="primary" round size="small" @click="add_revise_detail_Func(handleType=1)">添加</el-button>
                    <el-button type="danger" round size="small" @click="batchRemoveFunc()">批量删除</el-button>
                </el-col>
            </el-row>
      </div>
      <div class="f-contain">
        <el-table
            ref="multipleTable"
            :data="tableData_equiptype"
            tooltip-effect="dark"
            style="width: 100%"
            stripe
            border
            size="mini"
            @selection-change="selectionChangeFunc">
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column
                label="序号"
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                label="类型"
                prop="equipmentType"
                width="150">
            </el-table-column>
            <el-table-column
                label="型号"
                prop="equipmentModel"
                width="200">
            </el-table-column>
            <el-table-column
                label="名称"
                prop="equipmentModelName"
                width="200">
            </el-table-column>
            <el-table-column
                label="备注"
                prop="remark">
            </el-table-column>
            <el-table-column
                prop="addTime"
                label="添加时间"
                width="200"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="add_revise_detail_Func(handleType=3,scope.$index, scope)"
                        type="text"
                        size="small">
                        查看
                    </el-button>
                    <el-button
                        @click.native.prevent="add_revise_detail_Func(handleType=2,scope.$index, scope)"
                        type="text"
                        size="small">
                        修改
                    </el-button>
                    <el-button
                        @click.native.prevent="deleteRowFunc(scope.$index, scope)"
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

      <el-dialog :title=" handleType==1 ? '新增设备型号' : (handleType==2 ? '修改设备型号' :'查看设备型号') " :visible.sync="dialogFormVisible" width="900px">
        <div class="m_dialogHead">
            <el-row>
                <el-col :span="8">
                    <label><i class="i_star">*</i> 设备类型：</label>
                    <el-select :disabled="handleType != 1"  v-model="select_equiptype_dialog" placeholder="请选择" size="small" @change="dialog_selectFunc">
                        <el-option v-for="item in options_equiptype"
                        :key="item.id"
                        :label="item.equipmentType"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <label><i class="i_star">*</i> 设备型号：</label>
                    <el-input :disabled="handleType != 1"  placeholder="请输入查询内容" size="small" v-model="version_dialog"></el-input>
                </el-col>
                <el-col :span="8">
                    <label><i class="i_star">*</i> 设备名称：</label>
                    <el-input :disabled="handleType != 1"  placeholder="请输入查询内容" size="small" v-model="equipname_dialog"></el-input>
                </el-col>
                <el-col :span="8">
                    <label>备注：</label>
                    <el-input :disabled="handleType == 3"  placeholder="请输入查询内容" size="small" v-model="remark_dialog"></el-input>
                </el-col>
            </el-row>
        </div>

        <div class="m_dialogMain">
             <div class="m_aside">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">选择模块</h3>
                    <el-row v-if="handleType != 3">
                        <el-col :span="18">
                            <div class="block">
                                <el-cascader
                                    :options="options_Cascader"
                                    v-model="selectedOptions"
                                    filterable
                                    @change="cascaderChange">
                                </el-cascader>
                            </div>
                        </el-col>
                        <el-col :span="6" class="addBox">
                            <el-button type="primary" round size="small" @click="addDialogFunc">添加</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="m_dialogMain">
                    <div class="box">
                        <el-table
                        :data="tableData_equipmodel"
                        ref="ref_equipmodel"
                        tooltip-effect="dark"
                        style="width: 100%"
                        stripe
                        border
                        size="mini"
                        @current-change="currentChangeFunc"
                        highlight-current-row>
                            <el-table-column
                            label="模块"
                            prop="moduleName">
                            </el-table-column>

                            <el-table-column
                            label="型号"
                            prop="moduleModel">
                            </el-table-column>

                            <el-table-column
                            v-if="handleType != 3"
                            prop="address"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="dialog_deleteRowFunc(scope.$index, scope)"
                                    type="text"
                                    size="small"
                                    class="btnDel">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="m_article">
                 <div class="m_dialogMain">
                    <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">模块能力</h3>
                </div>
                <div class="m_dialogMain">
                    <div class="box">
                        <ul class="infoList">
                            <li v-for="item in infoListDatas" :key="item.moduleAbilityId">
                                <label v-text="item.moduleAbilityName"></label>：
                                <span v-text="item.moduleAbilityValue"></span>
                            </li>

                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </div>
        
        <div slot="footer" class="dialog-footer">
            <div>
                <el-button type="primary" round size="small" @click="revise_saveFunc" v-if="handleType != 3">保存</el-button>
                <el-button type="danger" round size="small" @click="closeFunc">关闭</el-button>
            </div>
        </div>
      </el-dialog>

  </div>
</template>
<style lang="scss" scoped>
.m_aside{
    width: 400px;
    float: left;
}
.m_article{
    margin-left: 400px;
}
.el-cascader{
    width: 100%;
}
.addBox{
    line-height: 40px;
    text-align: right;
}
.m_dialogHead{
    padding: 30px 0 0 30px;
    ul{
        margin: 20px;
    }
    h3{
        margin-bottom: 10px;
        // color: #4381E6;
    }

   .el-row{
        margin-bottom: 15px;
        .el-select,.el-input{
            width: 150px;
        }
        .time_BB{
            width: 60px;
        }
        .el-date-editor.el-input__inner{
            width: 280px;
        }
    } 
  
}

.m_dialogMain{
    overflow-y: auto;
    .box{
        margin: 15px 10px 10px 30px;
        dl{
            overflow: hidden;
            margin: 9px 10px;
            position: relative;
        }
        dt{
            margin-right: 10px;
            float: left;
        }

    dd{
        height: 40px;
        line-height: 40px;
        span{
            width: 150px;
            display: inline-block;
        }
    }

  }
  

.infoList{
    background: #fafafa;
    border-radius: 3px;
    li{
        padding: 5px 0;
    }
    label{
        width: 50%;
        display: inline-block;
        text-align: right;
    }
    span{

    }
}

}
.el-dialog__body{
    max-height: 900px;
}
</style>

<script>
  export default {
    data() {
      return {
        page:{
            current: 1,
            size: 20,
            total: 0,
        },
        options_Cascader: [],
        // props_Cascader: {
        //     value:'moduleId',
        //     label:'moduleName',
        //     children:'moduleModels',
        // },
        selectedOptions: [],
        options: [{
          value: '3',
          label: '公告'
        }, {
          value: '2',
          label: '图片'
        }, {
          value: '1',
          label: '视频'
        }],
        options_equiptype: [],
        select_equiptype: '',
        select_equiptype_dialog: '',
        select_curData_dialog: '',
        tableData_equiptype: [],
        tableData_equipmodel: [],
        tableData_equipmodel_cur: {},
        multipleSelection: [],
        
        dialogFormVisible: false,

        handleType:null,//1：添加；2：修改；3查看；
        infoListDatas:[],
        version_txt:'',
        equipname_txt:'',
        remark_txt:'',
        version_dialog:'',
        equipname_dialog:'',
        remark_dialog:'',
        curEquipmentModelId: ''

      };
    },
    methods: {
        cascaderChange(value) {
            console.log(value);
            this.tableData_equipmodel_cur={
                moduleId: value[0].split(',')[0],
                moduleName: value[0].split(',')[1],
                moduleModelId: value[1].split(',')[0],
                moduleModel: value[1].split(',')[1]
            }
            var datas={
                moduleId: this.tableData_equipmodel_cur.moduleId,
                moduleModelId: this.tableData_equipmodel_cur.moduleModelId
            }
            this.http_queryModuleDetails(datas);
        },
        currentChangeFunc(cur,old){
            debugger;
            if (event.target.innerText!='删除') {
                var datas={
                    moduleId: cur.moduleId,
                    moduleModelId: cur.moduleModelId
                }
                this.http_queryModuleDetails(datas);
            }
                
        },
        http_queryModuleDetails(datas){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryModuleAndModelAbilityDetails',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var datas=response.data.data.modelAbilitys;
                    _this.infoListDatas=datas;
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

        resetFunc(){
            this.select_equiptype='';
            this.version_txt='';
            this.equipname_txt='';
        },

        selectionChangeFunc(val) {
            this.multipleSelection = val;
        },
        add_revise_detail_Func(handleType,index,data){
            console.log(index);
            this.handleType= handleType;
            this.dialogFormVisible= true;
            
            if (handleType==1) {//添加
                this.select_equiptype_dialog= '';
                this.version_dialog= '';
                this.equipname_dialog= '';
                this.remark_dialog= '';
                this.tableData_equipmodel=[];
                this.infoListDatas=[];
            }else{//修改//查看
                this.curEquipmentModelId=data.row.equipmentModelId
                var datas={
                    equipmentModelId: this.curEquipmentModelId
                }
                this.http_add_revise_detail_Func(datas,handleType);
            }

        },
        http_add_revise_detail_Func(datas,handleType){
            debugger;
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentModelById',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var equipmentModel=response.data.data.equipmentModel;
                    var models=response.data.data.models;
                    _this.select_equiptype_dialog= equipmentModel.equipmentTypeId;/* equipmentTypeName */
                    _this.version_dialog= equipmentModel.equipmentModel;
                    _this.equipname_dialog= equipmentModel.equipmentModelName
                    _this.remark_dialog= equipmentModel.remark
                    _this.tableData_equipmodel= models;
                    
                    _this.$refs.ref_equipmodel.setCurrentRow(_this.tableData_equipmodel[0]);//默认选中第一个；
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
        deleteRowFunc(index,data){
            debugger;

            var ids=[data.row.equipmentModelId];

            this.http_deleteEquipFunc(ids);
        },
        dialog_deleteRowFunc(index,data){
            debugger;
            this.tableData_equipmodel.splice(index,1);
            // this.infoListDatas=[];
        },
        closeFunc(){
            console.log('closeFunc');
            this.dialogFormVisible=false;
        },
        batchRemoveFunc(){
            console.log(this.multipleSelection);
            var ids=[],select=this.multipleSelection;
            debugger;
            for (let i = 0; i < select.length; i++) {
                ids.push(this.multipleSelection[i].equipmentModelId);
            }
            this.http_deleteEquipFunc(ids);
        },
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                equipmentTypeId: this.select_equiptype,
                equipmentModel: this.version_txt,
                equipmentModelName: this.equipname_txt,
                remark: this.remark_txt,
            }
            this.http_equipTableFunc(data);
        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                equipmentTypeId: this.select_equiptype,
                equipmentModel: this.version_txt,
                equipmentModelName: this.equipname_txt,
                remark: this.remark_txt,
            }
            this.http_equipTableFunc(data);
        },

        selectFunc(val){
            console.log(val);

        },
        dialog_selectFunc(val){
            console.log(val);
            this.select_curData_dialog=val;
        },
        queryResourseFunc(){
            debugger;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                equipmentTypeId: this.select_equiptype,
                equipmentModel: this.version_txt,
                equipmentModelName: this.equipname_txt,
                remark: this.remark_txt,
            }
            this.http_equipTableFunc(data);
        },
        addDialogFunc(){
            debugger;
            if (this.tableData_equipmodel_cur.hasOwnProperty('moduleId')) {
                this.tableData_equipmodel.push(this.tableData_equipmodel_cur);
            }else{
                this.$message({
                    type:'info',
                    message: '请选择模块'
                })
            }
        },
        revise_saveFunc(type){
            debugger;
            var moduleModelIds=[],listData=this.tableData_equipmodel;
            
            for (let i = 0,len=listData.length; i < len; i++) {
                moduleModelIds.push(listData[i].moduleModelId)
            }
            if (moduleModelIds.length<1) {
                this.$message({
                    type: 'info',
                    message: '模块列表不可为空'
                });  
                return false;
            }
            var datas={
                equipmentModelId: this.curEquipmentModelId,
                moduleModelIds: moduleModelIds,
                equipmentTypeId: this.select_equiptype_dialog,
                equipmentModel: this.version_dialog,
                equipmentModelName: this.equipname_dialog,
                remark: this.remark_dialog,
            }

            this.http_revise_saveFunc(datas);
        },
        http_equipTableFunc(data){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/showEquipmentModelPageList',data)
            .then(function (response) {
            console.log(response);
            if (response.data.code==0) {
                _this.tableData_equiptype=response.data.data.records;
                _this.page.total=response.data.data.total;
            }else{
                _this.$message({
                    type: 'info',
                    message: response.data.msg
                })
            }
            // debugger
            
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        http_getChooseFunc(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentTypes',{})
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    _this.options_equiptype=response.data.data;
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
        http_getChooseCascaderFunc(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryModuleAndModels',{})
            .then(function (response) {
                console.log(response);
                if (response.data.code== 0) {
                    var datas=_this.formatCascaderFunc(response.data.data.content);
                    _this.options_Cascader=datas;
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
        formatCascaderFunc(datas){
            var arr=[]
            for(let i=0,len=datas.length;i<len;i++){
                // debugger;
                var data=datas[i],obj={}
                obj.value=data.moduleId+','+data.moduleName;
                obj.label=data.moduleName;
                obj.children=[];
                if(data.moduleModels.length>0){
                    var childDatas=data.moduleModels,childArr=[];
                    for(let n=0,len=childDatas.length;n<len;n++){
                        var childData=childDatas[n],childObj={};
                        childObj.label=childData.moduleModel;
                        childObj.value=childData.moduleModelId+','+childData.moduleModel;
                        obj.children[n]=childObj;
                    }
                }
                arr[i]=obj;
            }
            return arr;
        },
        http_deleteEquipFunc(ids){
            var _this=this;
            // debugger;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post('/app/equipment-aggr/equipment/deleteEquipmentModelById',{
                    ids:ids
                })
                .then(function (response) {
                    console.log(response);
                    if (response.data.code== 0) {
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        var data={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            equipmentTypeId: _this.select_equiptype,
                            equipmentModel: _this.version_txt,
                            equipmentModelName: _this.equipname_txt,
                            remark: _this.remark_txt,
                        }
                        _this.http_equipTableFunc(data);
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
            
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },

        http_revise_saveFunc(datas){
            var _this=this;
            if (this.handleType==1) {
                this.$post('/app/equipment-aggr/equipment/addEquipmentModel',datas)
                .then(function (response) {
                    if (response.data.code==0) {
                        console.log(response);
                        _this.$message({
                            message:'新增成功',
                            type: 'success'
                        })
                        _this.dialogFormVisible= false;
                        var data={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            equipmentTypeId: _this.select_equiptype,
                            equipmentModel: _this.version_txt,
                            equipmentModelName: _this.equipname_txt,
                            remark: _this.remark_txt,
                        }
                        _this.http_equipTableFunc(data);
                    }else{
                        _this.$message({
                            type: 'info',
                            message: response.data.msg
                        }); 
                    }
                
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            else if(this.handleType==2){
                this.$post('/app/equipment-aggr/equipment/updateEquipmentModel',datas)
                .then(function (response) {
                    if (response.data.code==0) {
                        console.log(response);
                        _this.$message({
                            message:'修改成功',
                            type: 'success'
                        })
                        var data={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            equipmentTypeId: _this.select_equiptype,
                            equipmentModel: _this.version_txt,
                            equipmentModelName: _this.equipname_txt,
                            remark: _this.remark_txt,
                        }
                        _this.http_equipTableFunc(data);
                    }else{
                        _this.$message({
                            type: 'info',
                            message: response.data.msg
                        }); 
                    }
                
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            
        },
      

    },
    watch:{


    },

    created(){
        var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
            }
        this.http_equipTableFunc(data);
        this.http_getChooseFunc();
        this.http_getChooseCascaderFunc();
    },
    updated(){
      
    }
  }
</script>
