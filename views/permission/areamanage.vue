<template>
    <div class="ztree_box">
        <div class="ztree_aside">
            <el-input 
                placeholder="输入关键字进行过滤"
                v-model="ztree_filterText">
            </el-input>
            <div class="m_scroll">
                <el-tree
                    default-expand-all
                    v-if="if_load_treeAgain"
                    :data="area_treeDatas"
                    :props="area_props"
                    :default-expanded-keys="defaultExpandedKeys"
                    node-key="id"
                    :load="loadNodeTree"
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :filter-node-method="filterNode"
                    lazy
                    ref="ref_tree"
                    @node-click="tree_nodeFunc"
                    :render-content	="ztree_render">
                </el-tree>
            </div>
            
        </div>
        <div class="ztree_article">
            <div class="f-header">
                <h2>域名称：<span>{{curNode.name}}</span></h2>
                <el-row>
                    <el-col :span="24">
                        <label>父级域：</label>
                        <span>{{curNode.parentName || '无'}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <label>域类型：</label>
                        <span>{{curNode.areaTypeName || '无'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>创建信息：</label>
                        <span>{{curNode.createTime}}&nbsp;&nbsp;{{curNode.creator || '无'}}</span>
                    </el-col>
                    <el-col :span="10">
                        <label>备注：</label>
                        <span>{{curNode.remark || '无'}}</span>
                    </el-col>
                </el-row>
                <el-row class="btnBox">
                    <el-button type="primary" round size="small" @click="dialogFunc(type=2)">编辑</el-button>
                    <el-button type="danger" round size="small" @click="delete_ztree()" :disabled="curNode.level==0 && curNode.isCustom==0">删除</el-button>
                </el-row>
            </div>
            <div class="f-contain">
                <div class="box">
                    <div class="header">
                        <h2 class="m_borderLeft_title">子域列表</h2>
                    </div>
                    <div class="contain">
                        <el-row class="btnBox">
                            <el-col :span="4">
                                <el-button type="primary" round size="small" @click="dialogFunc(type=1)" :disabled="curNode.level==10 && curNode.isCustom==0">创建子域</el-button>
                            </el-col>
                        </el-row>
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
                                label="域名称"
                                prop="name">
                            </el-table-column>
                            <el-table-column
                                label="域类型"
                                width="200"
                                prop="areaTypeName">
                            </el-table-column>
                            <el-table-column
                                label="创建时间"
                                prop="createTime"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                label="创建人"
                                prop="creator"
                                width="150">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="200">
                                <template slot-scope="scope">
                                    <el-button
                                        v-show="!scope.row.readonly"
                                        @click.native.prevent="dialogFunc(type=3,scope)"
                                        type="text"
                                        size="small">
                                        查看
                                    </el-button>
                                    <el-button
                                        v-show="!scope.row.readonly"
                                        @click.native.prevent="dialogFunc(type=2,scope)"
                                        type="text"
                                        size="small">
                                        编辑
                                    </el-button>
                                    <el-button
                                         v-show="!scope.row.readonly"
                                        @click.native.prevent="delete_ztree(scope)"
                                        type="text"
                                        size="small"
                                        class="btnDel">
                                        删除
                                    </el-button>
                                    <span v-show="scope.row.readonly">-</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog :title="dialogType==1 ? '创建子域' : (dialogType==2 ? '编辑域' : '查看域') " :visible.sync="dialogFormVisible_nnnn" width="600px" @close="closeFunc">
            <div class="box">
                <div class="m_dialogHead">
                </div>
                <div class="m_dialogMain">
                    <el-form :model="ruleForm" :rules="rules" ref="ref_dialog" label-width="100px" size="small">
                        <el-form-item label="域类型：" prop="level" v-if="dialogType==1">
                            <el-select v-model="ruleForm.level" placeholder="请选择活动区域" clearable :disabled="dialogType!=1">
                                <el-option v-for="item in options_areaType"
                                    :key="item.level"
                                    :label="item.areaTypeName"
                                    :value="item.level">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="域类型：" prop="showType" v-else>
                            <el-input v-model="ruleForm.showType" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="域名称：" prop="name">
                            <el-input v-model="ruleForm.name" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="备注：" prop="remark">
                            <el-input type="textarea" v-model="ruleForm.remark" clearable></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn= false">关闭</el-button>
                    <el-button type="primary" round size="small" @click="saveFunc" v-show="dialogType != 3">保存</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<style lang="scss" scope>
span.aaa{
    color: #999;
}
.ztree_box{

    .f-contain{
        .box{
            min-height: 550px;
        }
    } 
    .ztree_aside{
        .el-input{
            width: 100%;
            margin-bottom: 10px;
        }
        .m_scroll{

        }
    }
    .f-header{
        height: 175px;
        color: #666;
        h2{
            line-height: 50px;
        }
        .el-row{
            line-height: 30px;
            height: 30px;;
        }
        
    }
    label{
        width: 100px;
        text-align: right;
        display: inline-block;
    }
    // .el-col{
    //     min-height: 50px;
    // }
    .el-textarea{
        width: 180px;
        display: inline-block;
        .el-textarea__inner{
            height: 80px;
        }
    }
    .el-dialog{
        .el-dialog__body{
            padding: 5px 0 20px 0;
        }
        h3.m_borderLeft_title{
            font-size: 16px;
        }
        .el-input,.el-select,.el-textarea{
            width: 100%;
        }
        .box{
            padding: 40px 60px 20px 20px;
        }
    }

}


.curColor{
    color: #417ccc;
}
</style>
<script>
import {arrayToAttrArray,tree_addAttr,tree_addAttr_b,tree_arrayToAttrArray_childrens} from '@/utils/common.js'

export default {
    data (){
        return {
            ztree_filterText: '',
            cur_nodeClick: {},
            cur_level: '',

            if_load_treeAgain: false,//控制是否从新渲染树数据，不知道还有没有更好的方法。。
            area_treeDatas: [],
            area_props:{
                label: 'name',
                children: 'children',
            },
            defaultExpandedKeys: [],

            page:{
                current: 1,
                size: 20,
                total: 0,
            },
            tableData_global:[
            ],
            dialogFormVisible_nnnn: false,
            ruleForm:{
                level: '',
                name: '',
                remark: ''
            },
            rules:{
                level: [
                    { required: true, message: '请选择域类型', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                showType: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
            },
            dialogType: null,//1:创建子域；2:编辑域；3:查看；
            options_areaType: [],
            curNode:{
                name: '',
                areaTypeName: '',
                createTime: '',
                creator: '',
                parentName: '',
                remark: '',
                level:'',
            },

        }
    },
    methods:{
        loadNodeTree(node, resolve) {
            if (node.level === 0) {
                this.http_getAreaTreesFunc(resolve);
            }else{
                var data={
                    parentId : node.data.id
                }
                this.http_getAreaTreesFunc(resolve,data);

                if (node.level==1) {
                    debugger;
                    this.curNode= node.data;
                    this.setCurrentNodeFunc(node);

                    this.http_getAreaListFunc(data);
                }
            }
            
            
        },
        http_getAreaTreesFunc(resolve,data){
            var _this=this
             this.$get('/app/area-aggr/area/queryAreaTree',data)
            .then(function (response) {
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    resolve(msgDatas);
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
        http_getAreaListFunc(data){
            var _this=this
             this.$get('/app/area-aggr/area/queryAreaTree',data)
            .then(function (response) {
                // debugger
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    _this.tableData_global= msgDatas;
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
        updatedTreeStatusFunc(){//更新树状图禁用状态；
            console.log('更新树状图禁用状态；');
            var _this=this;
            setTimeout(() => {
                _this.if_load_treeAgain= true;
            }, 0);
        },
        setCurrentNodeFunc(node){
            var _this=this;
            setTimeout(() => {
                _this.$refs.ref_tree.setCurrentKey(node.data.id);
            }, 0);
            
        },
      
        levelToHouseTypeFunc(level){
            if (level==0) {
                return '二级平台'
            }
            if (level==20) {
                return '小区'
            }
            if (level==30) {
                return '楼栋'
            }
            if (level==40) {
                return '单元'
            }
            if (level==50) {
                return '房屋'
            }else{
                return '自定义'
            }
        },

        add_ztreeFunc(){
            
            debugger;
            var cur_nodeClick=this.$refs.ref_tree.getCurrentNode();
            if (cur_nodeClick) {
                var data={
                    areaId: cur_nodeClick.areaId
                }
                this.http_queryAllowableAreaType(data);
                
            }else{
                this.$message({
                    type: 'info',
                    message: '请选择树状图'
                })
            }

        },
        delete_ztree(scope){
            debugger
            if (scope) {
                var data={
                        areaId: scope.row.id
                    }
                    this.http_delete_ztree(data);
            }else{
                var cur_nodeClick=this.$refs.ref_tree.getCurrentNode();
                if (cur_nodeClick) {
                    var data={
                        areaId: cur_nodeClick.id
                    }
                    debugger;
                    this.http_delete_ztree(data);
                }else{
                    this.$message({
                        type: 'info',
                        message: '请选择树状图'
                    })
                }
            }
            
        },
        http_delete_ztree(data){
            var _this=this;
            this.$confirm('是否确认删除选中的域?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post('/app/area-aggr/area/deleteArea',data)
                .then(function (response) {
                    console.log(response);
                    debugger;
                    if (response.data.code==0) {
                        _this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        _this.if_load_treeAgain= false;
                        _this.updatedTreeStatusFunc();
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
        tree_nodeFunc(aa,bb,cc){
            if (!aa.readonly) {
                this.curNode= aa;
                var data={
                    parentId: aa.id
                }
                this.http_getAreaListFunc(data);
                debugger
            }
        },
        filterNode(value, data) {
            if (!value) 
                return true;
            debugger;
            return data.name.indexOf(value) !== -1;
        },
        ztree_render(h, { node, data, store }) {
            // debugger;
            if (data.readonly) {
                return (
                    <span>
                        <span class="aaa">{node.label}</span>
                    </span>
                )
            }else{
                return (
                    <span>
                        <span>{node.label}</span>
                    </span>
                )
            }
            
        },
        http_queryAreaType(datas){
            var _this=this
             this.$get('/app/area-aggr/area/queryAreaType',datas)
            .then(function (response) {
                if (response.data.code==0) {
                    var msgDatas= response.data.data || [];
                    msgDatas=msgDatas.map((item)=>{
                        item.level=Number(item.level)
                        return item;
                    })
                    debugger
                    _this.options_areaType= msgDatas;
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
        http_updateArea(datas){
            var _this=this
             this.$post('/app/area-aggr/area/updateArea',datas)
            .then(function (response) {
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogFormVisible_nnnn= false;
                    _this.if_load_treeAgain= false;
                    _this.updatedTreeStatusFunc();
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
        http_createArea(datas){
            var _this=this
             this.$post('/app/area-aggr/area/createArea',datas)
            .then(function (response) {
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '创建成功'
                    })
                    _this.dialogFormVisible_nnnn= false;
                    _this.if_load_treeAgain= false;
                    _this.updatedTreeStatusFunc();
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
        dialogFunc(type,scope){//1:创建子域；2:编辑域；3:查看；
            this.dialogType= type;
            this.dialogFormVisible_nnnn= true;
            var currentNode= this.$refs.ref_tree.getCurrentNode();
            console.log('999');
            if (type==1) {
                this.ruleForm={
                    level: '',
                    name: '',
                    remark: '',
                    isCustom: '',
                    showType: '',
                }
                var datas={
                    level: currentNode.level
                }
                this.http_queryAreaType(datas);
            }
            if (type==2) {
                if (scope) {
                    this.ruleForm= scope.row;
                }else{
                    this.curNode.level= this.curNode.level;
                    this.ruleForm= currentNode;
                }
            }
            if (type==3) {
                this.ruleForm= scope.row;
            }
            if (this.ruleForm.level==0 && this.ruleForm.isCustom==0) {
                this.ruleForm.showType= '一级平台'
            }else if (this.ruleForm.level==10 && this.ruleForm.isCustom==0) {
                this.ruleForm.showType= '二级平台'
            }else{
                this.ruleForm.showType= '自定义'
            }
        },
        closeFunc(){
            this.$refs.ref_dialog.resetFields();
        },
        saveFunc(){
            var _this= this;
            this.$refs.ref_dialog.validate((valid)=>{
                debugger;
                if (valid) {
                    if (_this.dialogType==1) {
                        var datas={
                            "areaName": _this.ruleForm.name,
                            "areaRemark": _this.ruleForm.remark,
                            "id": null,
                            "level": _this.ruleForm.level,
                            "parentId": _this.curNode.id,
                        }
                        _this.http_createArea(datas);
                    }
                    if (_this.dialogType==2) {
                        var datas={
                            "areaName": _this.ruleForm.name,
                            "areaRemark": _this.ruleForm.remark,
                            "id": _this.ruleForm.id,
                            "level": _this.ruleForm.level,
                            "parentId": _this.ruleForm.parentId,
                        }
                        _this.http_updateArea(datas);
                    }
                }
            })
            
            
        },

    },
    watch: {
        ztree_filterText(val) {
            this.$refs.ref_tree.filter(val);
        }
    },
    created() {
        this.if_load_treeAgain= true;
        
    },
}
</script>


