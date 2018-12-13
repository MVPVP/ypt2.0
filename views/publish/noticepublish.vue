<template>
    <div>
        <div class="f-header">
            <el-row>
            <el-col :span="10">
                <label>添加时间：</label>
                <el-date-picker
                    v-model="value_add_time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="small">
                </el-date-picker>
            </el-col>
            
            <el-col :span="10">
                <label>发布时间：</label>
                <el-date-picker
                    v-model="value_public_time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="small">
                </el-date-picker>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" round size="small" @click="queryProgramFunc">查询</el-button>
                <el-button round size="small"  @click="resetFunc">重置</el-button>
            </el-col>
                
            </el-row>

            <el-row class="btnBox">
                <el-col :span="6">
                    <el-button type="primary" round size="small" @click="add_revise_RowFunc(isAdd=true)">添加</el-button>
                </el-col>
            </el-row>
        </div>

        <div class="f-contain">
            <el-table
                ref="multipleTable"
                :data="tableData_noticepublish"
                style="width: 100%"
                stripe
                border
                size="mini"
                highlight-current-row>
                <el-table-column
                    label="序号"
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="状态"
                    :formatter="status_formatFunc"
                    prop="publishStatus">
                </el-table-column>
                <el-table-column
                    prop="creator"
                    label="添加人"
                    width="150"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="creatorTime"
                    label="添加时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="promulgator"
                    label="发布人"
                    width="150"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="promulgateTime"
                    label="发布时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="publish_RowFunc(scope.$index, scope)"
                            v-if="scope.row.publishStatus==2"
                            type="text"
                            size="small">
                            发布
                        </el-button>
                        <el-button
                            @click.native.prevent="add_revise_RowFunc(isAdd=false,scope.$index, scope)"
                            v-if="scope.row.publishStatus==2"
                            type="text"
                            size="small">
                            修改
                        </el-button>
                        <el-button
                            @click.native.prevent="detailRowFunc(scope.$index,scope)"
                            type="text"
                            size="small">
                            详情
                        </el-button>
                        <el-button
                            @click.native.prevent="deleteRowFunc(scope.$index, scope)"
                            v-if="scope.row.publishStatus==2"
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
 
        <!-- '添加公告': '修改公告' -->
        <el-dialog :title="dialog_isAdd ? '添加公告': '修改公告'" :visible.sync="dialogFormVisible_publish" width="900px" @close="closeDialogFunc">
            <div class="m_aside">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">选择发布区域：</h3>
                </div>
                <div class="m_dialogMain">
                    <div class="box">
                        <el-tree
                            :props="publish_props"
                            v-if="if_load_treeAgain"
                            :default-expanded-keys="defaultExpandedKeys"
                            :default-checked-keys="defaultCheckedKeys"
                            node-key="areaId"
                            show-checkbox
                            :load="loadNodeTree"
                            lazy
                            ref="ref_tree">
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="m_article">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">
                        公告内容：
                    </h3>
                    <el-row style="height:20px">
                        <el-col :span="24">
                            <el-button type="primary" round size="small" @click="getResourse_addFunc()">添加</el-button>
                            <!-- <el-button type="danger" round size="small" @click="batchRemoveFunc()">批量删除</el-button> -->
                        </el-col>
                    </el-row>
                </div>
                <div class="m_dialogMain">
                    <div class="box">
                        <el-table
                            ref="ref_add_revise"
                            :data="tableData_notice_dialog"
                            border
                            size="mini">
                            <!-- <el-table-column
                                type="selection"
                                width="35">
                            </el-table-column> -->
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                label="资源名称"
                                prop="resourceName"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                label="资源类型"
                                prop="resourceType"
                                :formatter="resourceType_formatFunc">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="deleteResourse_rowFunc(scope.$index, scope)"
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
             <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="publish_saveFunc">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_publish=false">关闭</el-button>
                </div>
            </div>

             <!-- dialog_CC -->
                <el-dialog 
                    title="选择" 
                    :visible.sync="dialogFormVisible_add_CC"
                    ref="ref_CC" 
                    width="700px"
                    append-to-body>
                    <div class="m_dialogHead">
                        <el-row>
                            <el-col :span="12">
                                <label>资源名称：</label>
                                <el-input clearable placeholder="请输入查询内容" size="small" v-model="resourseName_CC"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <label>资源类型：</label>
                                <el-select disabled  v-model="resourseType_CC" placeholder="请选择" size="small" @change="selectCC_Func">
                                    <el-option v-for="item in options_CC"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                            <label>创建时间：</label>
                                <el-date-picker
                                    v-model="time_CC"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    size="small">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="primary" round size="small" @click="queryResourseFunc_CC()">查询</el-button>
                                <el-button round size="small"  @click="resetFunc_CC">重置</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                             <el-button type="primary" round size="small" @click="redirectFunc('/resource')">添加公告</el-button>
                        </el-row>
                    </div>
                    <div class="m_dialogMain">
                        <div class="box">
                            <el-table
                                ref="ref_CC"
                                :data="tableData_CC_notice"
                                @selection-change="selectionChangeFunc_CC_notice"
                                border
                                size="mini">
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
                                    label="资源名称"
                                    prop="resourceName">
                                </el-table-column>
                                <el-table-column
                                    label="资源类型"
                                    :formatter="resourceType_formatFunc"
                                    prop="resourceType">
                                </el-table-column>
                                <el-table-column
                                    label="创建时间"
                                    prop="createTime">
                                </el-table-column>
                                <el-table-column
                                    label="创建人"
                                    prop="creatorName">
                                </el-table-column>
                            </el-table>
                        </div>

                        <div style="margin: 20px 30px">
                            <div class="block">
                                <el-pagination
                                    @size-change="pageSizeChangeFunc_CC"
                                    @current-change="pageChangeFunc_CC"
                                    :current-page="page.current"
                                    :page-sizes="[20, 50, 100, 200]"
                                    :page-size="this.page.size"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="page.total_CC">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <div>
                            <el-button round size="small" @click="dialogFormVisible_add_CC=false">上一步</el-button>
                            <el-button type="primary" round size="small" @click="addSaveFunc_CC">确定</el-button>
                            <el-button type="danger" round size="small" @click="dialogFormVisible_add_CC=false">关闭</el-button>
                        </div>
                    </div>
                </el-dialog>

        </el-dialog>
        <!-- 详情_detail -->
        <el-dialog title="详情" :visible.sync="dialogFormVisible_detail" width="900px">

            <div class="m_aside">
                <div class="m_dialogHead">
                <h3 class="m_borderLeft_title">发布区域：</h3>
            </div>
            <div class="m_dialogMain">
                <div class="box">
                    <el-tree
                        :data="detail_treeData"
                        :props="detail_props"
                        default-expand-all
                        node-key="id">
                    </el-tree>
                </div>
            </div>
            </div>
            <div class="m_article">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">
                        公告内容：
                    </h3>
                </div>
                <div class="m_dialogMain">
                    <div class="box">
                        <el-table
                            ref="ref_detail"
                            :data="tableData_notice_dialog"
                            border
                            size="mini">
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                label="资源名称"
                                prop="resourceName"
                                width="250">
                            </el-table-column>
                            <el-table-column
                                label="资源类型"
                                prop="resourceType"
                                :formatter="resourceType_formatFunc">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            
            
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss" scoped>
.m_dialogHead{
    padding: 30px 30px 0 30px;
    // h3{
    //     line-height: 30px;
    //     margin-bottom: 10px;
    // }
    .tabsBox{
        font-size: 18px;
        color: #333;
        border: 1px solid #ccc;
        overflow: hidden;
        display: inline-block;
        margin-bottom: 15px;
        li{
            width: 140px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            float: left;
            cursor: pointer;
        }
        li.cur{
            background: #5693F6;
            color: #fff;
        }
    }
    .el-row{
        margin-bottom: 15px;
        .el-select,.el-input{
            width: 150px;
        }
        .el-date-editor.el-input__inner{
            width: 280px;
        }
    }   
}    
.m_dialogMain{
    .box{
        margin: 30px;
    }
}
.el-dialog__body{
    overflow: auto;
}
.m_aside{
    width: 250px;
    float: left;
}
.m_article{
    margin-left: 250px;
}
</style>
<script>
import {tree_arrayToAttrArray_childrens} from '@/utils/common.js';
export default {
    data(){
        return {
            value_add_time: '',
            value_public_time: '',
            tabs_bool_detail: 1,
            time_CC: '',

            imageRunningTime: '',


            resourseName_CC: '',
            resourseType_CC: '',

            selectionData_CC_notice: [],

            options_CC: [{
                value: '3',
                label: '公告'
                }],
   
            tableData_noticepublish: [

            ],

            tableData_notice_dialog: [
            ],

            tableData_CC_notice: [
   
            ],
            publish_treeData: [],
            detail_treeData: [],
            detail_props:{
                label: 'areaName',
                children: 'childrens',
            },
            publish_props:{
                label: 'areaName',
                children: 'childrens',
            },
            page:{
                current: 1,
                size: 20,
                total: 0,
                total_CC: 0,
            },
            curProgramId: '',
  
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],

            dialogFormVisible_add_CC: false,
            dialogFormVisible_publish: false,
            dialogFormVisible_detail: false,
            if_load_treeAgain: false,//控制是否从新渲染树数据，不知道还有没有更好的方法。。

            dialog_isAdd: null,
            deleteResourceIds: []

        }
    },
    methods:{
        status_formatFunc(row, column, cellValue){
            if (cellValue==1) {
                return '已发布'
            }
            if (cellValue==2) {
                return '待发布'
            }
        },
        resourceType_formatFunc(row, column, cellValue){
            if (cellValue==3) {
                return '公告'
            }else{
                return '-'
            }
        },
        closeDialogFunc(){
            console.log('closeDialogFunc');
            this.if_load_treeAgain= false;
        },
        redirectFunc(url){
            this.$router.push({path: url});
            debugger;
            this.$store.state.user_module.switchTo_resource_dialogOpen_notice=true;
        },
        deleteRowFunc(indes,scope){
            debugger;
            var datas={
                id: scope.row.id
            }
            this.http_deleteRowFunc(datas);
        },
        http_deleteRowFunc(datas){
            var _this=this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post('/app/content-aggr/content/deletePublishResourceRecord',datas)
                .then(function (response) {
                    debugger;
                    if (response.data.code==0) {
                        _this.$message({
                            message:'公告删除成功',
                            type: 'success'
                        });
                        var add_time= _this.value_add_time,
                            publish_time= _this.value_public_time;
                        var ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            addStartTime: add_time ? add_time[0] : '',
                            addEndTime: add_time ? add_time[1] : '',
                            promulgateStartTime: publish_time ? publish_time[0] : '',
                            promulgateEndTime: publish_time ? publish_time[1] : '',
                            resourceTypes: '3'
                        }
                        _this.http_noticepublishTableFunc(ddd);
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


        resetFunc(){
            this.value_add_time='';
            this.value_public_time='';
        },
        resetFunc_CC(){
            this.resourseName_CC='';
            this.resourseType_CC='';
            this.time_CC='';
        },
        selectCC_Func(){

        },
        queryProgramFunc(){
            debugger;
            var add_time= this.value_add_time,
                publish_time= this.value_public_time;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                addStartTime: add_time ? add_time[0] : '',
                addEndTime: add_time ? add_time[1] : '',
                promulgateStartTime: publish_time ? publish_time[0] : '',
                promulgateEndTime: publish_time ? publish_time[1] : '',
                resourceTypes: '3'
            }
            this.http_noticepublishTableFunc(data);
        },
        queryResourseFunc_CC(){
            var time_CC= this.time_CC,
                data={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    resourceType: this.resourseType_CC || '3',
                    resourceName: this.resourseName_CC,
                    startTime: time_CC ? this.time_CC[0] : '',
                    endTime: time_CC ? this.time_CC[1] : '',
                };
            this.http_resourceTableFunc(data);
        },

        http_noticepublishTableFunc(data){
            var _this=this;
                this.$get('/app/content-aggr/content/showResourcePublishRecordPage',data)
                .then(function (response) {
                    console.log(response);
                    if (response.data.code==0) {
                        _this.tableData_noticepublish=response.data.data.records;
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
        getResourse_addFunc(){
            this.dialogFormVisible_add_CC=true;
            this.resourseType_CC='';
            var resourceType='3';
            console.log('getResourse_addFunc');
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                resourceType: resourceType
            }
            this.http_resourceTableFunc(data);
        },
        add_revise_RowFunc(isAdd,index, scope){
            console.log('add_revise_RowFunc');
            this.dialogFormVisible_publish=true;
            this.dialog_isAdd=isAdd;
            this.tableData_notice_dialog=[];
            
            debugger
            
            if (isAdd) {
                this.if_load_treeAgain= true;
                this.defaultCheckedKeys=[];
            }else{
                this.curProgramId=scope.row.id;
                var datas={
                    resourcePublishRecordId:scope.row.id
                }
                this.http_getCheckAreaTreesFunc(datas);
                this.http_detailResourceFunc(datas);
            }
            
        },
        publish_RowFunc(index, scope){
            console.log('publish_RowFunc');
            debugger;
            this.curProgramId=scope.row.id;
            var datas={
                resourcePublishRecordId : this.curProgramId
            }
            this.http_queryResourcePublishAreas(datas);
        },
        http_queryResourcePublishAreas(datas){
             var _this=this
             debugger;
             this.$get('/app/content-aggr/content/queryResourcePublishAreas',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.data.length>0) {
                    var datas={
                        "promulgator": sessionStorage.getItem('session_username'),
                        "promulgatorId": sessionStorage.getItem('session_userId'),
                        "resourcePublishRecordId": _this.curProgramId
                    }
                    _this.http_publish_RowFunc(datas);
                }else{
                    _this.$message.error('发布域为空，发布失败')
                }
                
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        http_publish_RowFunc(datas){//点击发布
             var _this=this;
            this.$post('/app/content-aggr/content/resourcePublishRecord',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        message:'公告发布成功',
                        type: 'success'
                    });
                    _this.dialogFormVisible_publish= false;
                    var add_time= _this.value_add_time,
                        publish_time= _this.value_public_time;
                    var ddd={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size,
                        addStartTime: add_time ? add_time[0] : '',
                        addEndTime: add_time ? add_time[1] : '',
                        promulgateStartTime: publish_time ? publish_time[0] : '',
                        promulgateEndTime: publish_time ? publish_time[1] : '',
                        resourceTypes: '3'
                    }
                    _this.http_noticepublishTableFunc(ddd);
                    
                }else{
                    _this.$message.error('公告发布失败')
                }
                debugger;
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        loadNodeTree(node, resolve) {
            
            if (node.level === 0) {
                debugger
                var sessionTreeDatas=JSON.parse(sessionStorage.getItem('httpData_queryAreaTree_session')),
                    expandTreeDatas=JSON.parse(sessionStorage.getItem('httpData_defaultExpandedKeys_session'));
                
                if (sessionTreeDatas) {//缓存起来；
                    resolve([sessionTreeDatas]) ;
                    this.defaultExpandedKeys= expandTreeDatas;
                }else{
                    this.http_getAreaTreesFunc(resolve);
                }
                
            }else{
                debugger;
                if (node.data.level===40) {//不加载房间
                    resolve([]);
                }else{
                    var hasChild= node.data.childrens ? 1 : 0;
                    if (hasChild) {
                        resolve(node.data.childrens);
                    }else{
                        debugger;
                        var data={
                            parentId : node.data.areaId
                        }
                        this.http_queryAreaChildrens(data,resolve);
                    }
                }
            }
            
        },
        http_getAreaTreesFunc(resolve){
            var _this=this
             this.$get('/app/hpc-aggr/hpc/queryAreaTree')
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    resolve([msgDatas]) ;
                    _this.defaultExpandedKeys= tree_arrayToAttrArray_childrens(msgDatas,'areaId');
                    sessionStorage.setItem('httpData_queryAreaTree_session',JSON.stringify(msgDatas));
                    sessionStorage.setItem('httpData_defaultExpandedKeys_session',JSON.stringify(_this.defaultExpandedKeys));
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
        http_queryAreaChildrens(data,resolve){
            var _this=this
             this.$get('/app/hpc-aggr/hpc/queryAreaChildrens',data)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var msgDatas=response.data.data;
                    if (msgDatas.length>0) {
                        resolve(msgDatas);
                    }else{
                        resolve([]);
                    }
                    
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
        http_getCheckAreaTreesFunc(datas){
            var _this=this
             this.$get('/app/content-aggr/content/queryResourcePublishAreas',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    _this.defaultCheckedKeys=response.data.data;
                    _this.if_load_treeAgain= true;
                    sessionStorage.setItem('defaultCheckedKeys_session',JSON.stringify(_this.defaultCheckedKeys));
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
        http_detailResourceFunc(datas){
            var _this=this
             this.$get('/app/content-aggr/content/queryResourcePublishDetail',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var response_tableData_detail_ids=_this.return_dataId_Func(response.data.data);
                    sessionStorage.setItem('response_tableData_detail_ids',response_tableData_detail_ids.join());
                    
                    debugger;
                   _this.tableData_notice_dialog=response.data.data;
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
        http_detailTreeDataFunc(datas){
            var _this=this
             this.$get('/app/content-aggr/content/queryResourcePublishAreaTree',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    _this.detail_treeData=[response.data.data];
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
        detailRowFunc(index, scope){
            console.log('detailRowFunc');
            this.dialogFormVisible_detail=true;

            // this.detail_treeData=this.aaa;
            var datas={
                resourcePublishRecordId: scope.row.id
            }
            debugger;
            this.http_detailResourceFunc(datas);
            this.http_detailTreeDataFunc(datas);
        },

        selectionChangeFunc_CC_notice(selection){
            console.log('selectionChangeFunc_CC_notice');
            this.selectionData_CC_notice=selection;
            // debugger;
        },
        deleteResourse_rowFunc(index,data){
            debugger;
            var delData=this.tableData_notice_dialog.splice(this.tableData_notice_dialog.indexOf(data.row),1);
            this.return_deleteResourceIdsFunc(delData);

        },
        return_deleteResourceIdsFunc(delData){
            // debugger;
            var response_tableData_detail=sessionStorage.getItem('response_tableData_detail_ids').split(',');
            var ids=response_tableData_detail;
            if(ids.indexOf(delData[0].resourceId)>=0){
                this.deleteResourceIds.push(delData[0].resourceId);
                console.log(this.deleteResourceIds);
            }

        },

        http_resourceTableFunc(data){
            var _this=this;
            var resourceType=data.resourceType;
            this.$get('/app/content-aggr/content/showResourcePage',data)
            .then(function (response) {
                console.log(response);
                // debugger
                var tableData_resource=response.data.data.records;
                _this.page.total_CC=response.data.data.total;
                _this.tableData_CC_notice=tableData_resource;

            })
            .catch(function (error) {
                console.log(error);
            });
        },

        addSaveFunc_CC(){
            console.log('addSaveFunc_CC');
            
            var allDatas=this.return_noRepeatDatasFunc(this.selectionData_CC_notice,this.tableData_notice_dialog);
            debugger;
            this.tableData_notice_dialog=allDatas;
            this.dialogFormVisible_add_CC=false;
        },
        return_dataId_Func(datas){
            var ids=[];
            // debugger;
            for (let i = 0,len=datas.length; i < len; i++) {
                ids.push(datas[i].resourceId);
            }
            
            return ids;
        },
        return_noRepeatDatasFunc(AddDatas,datas){
            var ids=this.return_dataId_Func(datas),
                r_datas=[];
                debugger;
            for (let i = 0,len=AddDatas.length; i < len; i++) {
                if (ids.indexOf(AddDatas[i].resourceId)<0) {
                    debugger
                    r_datas.push(AddDatas[i])
                }
            }
            
            return datas.concat(r_datas);
            
        },
        publish_saveFunc(){
            console.log('publish_saveFunc');
            console.log(this.dialog_isAdd);

            var checkedKeys=this.$refs.ref_tree.getCheckedKeys(),
                resourceData=this.tableData_notice_dialog,
                addResourceIds=[],
                addAreaIds=[],
                deleteAreaIds=[];

            var add_Ids=this.return_dataId_Func(resourceData);

            debugger;
            if (checkedKeys.length<1) {
                this.$message({
                    type: 'info',
                    message: '请选择发布区域'
                });
                return false;
            }
            if (this.tableData_notice_dialog.length<1) {
                this.$message({
                    type: 'info',
                    message: '资源列表不可为空'
                });
                return false;
            }
            if (this.dialog_isAdd) {
                var addResourceIds=add_Ids;
                
                var datas={
                    "areaIds": checkedKeys,
                    "addResourceIds": addResourceIds,
                    // "creator": sessionStorage.getItem('session_username'),
                    // "creatorId": sessionStorage.getItem('session_userId')
                }
                this.http_add_saveFunc(datas);
            }else{
                var get_ids=sessionStorage.getItem('response_tableData_detail_ids').split(','),
                    get_areaId= JSON.parse(sessionStorage.getItem('defaultCheckedKeys_session'));
                for (let i = 0,len=add_Ids.length; i < len; i++) {
                    if (get_ids.indexOf(add_Ids[i])<0) {
                        addResourceIds.push(add_Ids[i]);//找出新增的addResourceIds
                    }
                }

                for (let i = 0,len=get_areaId.length; i < len; i++) {
                    if (checkedKeys.indexOf(get_areaId[i])<0) {
                        deleteAreaIds.push(get_areaId[i]);//找出删除的deleteAreaIds
                    }
                }
                for (let i = 0,len=checkedKeys.length; i < len; i++) {
                    if (get_areaId.indexOf(checkedKeys[i])<0) {
                        addAreaIds.push(checkedKeys[i]);//找出新增的addAreaIds
                    }
                }

                var datas={
                    // "areaIds": checkedKeys,
                    "addAreaIds": addAreaIds,
                    "deleteAreaIds": deleteAreaIds,
                    "addResourceIds": addResourceIds,
                    "creator": sessionStorage.getItem('session_username'),
                    "creatorId": sessionStorage.getItem('session_userId'),
                    "deleteResourceIds": this.deleteResourceIds,
                    "resourcePublishRecordId": this.curProgramId
                }
                this.http_revise_saveFunc(datas);
            }

            

            
            
        },
        http_add_saveFunc(datas){
            var _this=this;
            this.$post('/app/content-aggr/content/addResourcePublishRecord',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    _this.$message({
                        message:'公告添加成功',
                        type: 'success'
                    });
                    _this.dialogFormVisible_publish= false;
                    var add_time= _this.value_add_time,
                        publish_time= _this.value_public_time;
                    var ddd={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size,
                        addStartTime: add_time ? add_time[0] : '',
                        addEndTime: add_time ? add_time[1] : '',
                        promulgateStartTime: publish_time ? publish_time[0] : '',
                        promulgateEndTime: publish_time ? publish_time[1] : '',
                        resourceTypes: '3'
                    }
                    _this.http_noticepublishTableFunc(ddd);
                }else{
                    _this.$message.error('添加公告失败')
                }
                debugger;
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        http_revise_saveFunc(datas){
            var _this=this;
            this.$post('/app/content-aggr/content/updateResourcePublishRecord',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    _this.$message({
                        message:'公告修改成功',
                        type: 'success'
                    });
                    _this.dialogFormVisible_publish= false;
                    var add_time= _this.value_add_time,
                        publish_time= _this.value_public_time;
                    var ddd={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size,
                        addStartTime: add_time ? add_time[0] : '',
                        addEndTime: add_time ? add_time[1] : '',
                        promulgateStartTime: publish_time ? publish_time[0] : '',
                        promulgateEndTime: publish_time ? publish_time[1] : '',
                        resourceTypes: '3'
                    }
                    _this.http_noticepublishTableFunc(ddd);
                }else{
                    _this.$message.error('公告修改失败')
                }
                debugger;
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        
        pageChangeFunc(val){
            console.log('pageChangeFunc');
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var add_time= this.value_add_time,
                publish_time= this.value_public_time;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                addStartTime: add_time ? add_time[0] : '',
                addEndTime: add_time ? add_time[1] : '',
                promulgateStartTime: publish_time ? publish_time[0] : '',
                promulgateEndTime: publish_time ? publish_time[1] : '',
                resourceTypes: '3'
            }
            this.http_noticepublishTableFunc(data);
        },
        pageSizeChangeFunc(val){
            console.log('pageSizeChangeFunc');
            this.page.size= val;
            var add_time= this.value_add_time,
                publish_time= this.value_public_time;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                addStartTime: add_time ? add_time[0] : '',
                addEndTime: add_time ? add_time[1] : '',
                promulgateStartTime: publish_time ? publish_time[0] : '',
                promulgateEndTime: publish_time ? publish_time[1] : '',
                resourceTypes: '3'
            }
            this.http_noticepublishTableFunc(data);
        },
        pageChangeFunc_CC(val){
            this.page.current= val;
            var time_CC= this.time_CC,
                data={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    resourceType: this.resourseType_CC || '3',
                    resourceName: this.resourseName_CC,
                    startTime: time_CC ? this.time_CC[0] : '',
                    endTime: time_CC ? this.time_CC[1] : '',
                };
            this.http_resourceTableFunc(data);
        },
        pageSizeChangeFunc_CC(val){
            this.page.size= val;
            var time_CC= this.time_CC,
                data={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    resourceType: this.resourseType_CC || '3',
                    resourceName: this.resourseName_CC,
                    startTime: time_CC ? this.time_CC[0] : '',
                    endTime: time_CC ? this.time_CC[1] : '',
                };
            this.http_resourceTableFunc(data);
        }
    },
    created() {
        var data={
            pageNum: this.page.current,
            pageSize: this.page.size,
            resourceTypes: '3'
          }
        this.http_noticepublishTableFunc(data);
    },

}
</script>


