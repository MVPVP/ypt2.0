<template>
    <div>
        <div class="f-header">
            <el-row>
                <el-col :span="5">
                    <label>证件号：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.certificate"></el-input>
                </el-col>
                <el-col :span="5">
                    <label>手机号：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.phone"></el-input>
                </el-col>
                <el-col :span="5">
                    <label>姓名：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.name"></el-input>
                </el-col>
                <el-col :span="5">
                    <label>备注：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.remark"></el-input>
                </el-col>

                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="query_globalFunc">查询</el-button>
                    <el-button round size="small" @click="reset_globalFunc">重置</el-button>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="addBtn_globalFunc(type=1)">添加住户</el-button>
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
                    label="姓名"
                    prop="personName"
                    width="120">
                </el-table-column>
                <el-table-column
                    label="电话"
                    prop="mobileNum"
                    show-overflow-tooltip
                    width="200">
                </el-table-column>
                <el-table-column
                    label="证件类型"
                    prop="certificateType"
                    
                    width="100">
                </el-table-column>
                <el-table-column
                    label="证件号码"
                    width="200"
                    prop="certificateNo">
                </el-table-column>
                <el-table-column
                    prop="roomCount"
                    label="关联房屋数"
                    width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="添加住户时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="250">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="addBtn_globalFunc(type=3,scope)"
                            type="text"
                            size="small">
                            查看
                        </el-button>
                        <el-button
                            @click.native.prevent="addBtn_globalFunc(type=2,scope)"
                            type="text"
                            size="small">
                            编辑
                        </el-button>
                        <el-button
                            @click.native.prevent="house_operate_globalFunc(scope)"
                            type="text"
                            size="small">
                            房产
                        </el-button>
                        <el-button
                            @click.native.prevent="door_operate_globalFunc(scope)"
                            type="text"
                            size="small">
                            门禁卡
                        </el-button>
                        <el-button
                            @click.native.prevent="deleteRow_globalFunc(scope)"
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

        <!-- 弹窗 添加1、编辑2、查看3、用=》operateType；add_detail_edit-->
        <el-dialog :title="operateType==1 ? '添加' : ( operateType==2 ? '编辑' : '查看')" :visible.sync="dialogVisible_addBtn" width="900px" @close="formAddClose">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">住户信息</h3>
                </div>
                <div class="m_dialogMain">
                    <el-form size="small" :model="formData_add" :rules="rules_form" ref="ref_form">
                        <div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="姓名:" prop="name" :label-width="formLabelWidth">
                                        <el-input clearable :disabled="operateType==3" v-model="formData_add.name" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="证件类型:" :label-width="formLabelWidth" prop="type">
                                        <el-select clearable :disabled="operateType==3 || operateType==2" v-model="formData_add.type" placeholder="请选择" size="small" @change="housetypeChanceFunc">
                                            <el-option v-for="item in options_certificateType"
                                            :key="item.certificateType"
                                            :label="item.certificateTypeName"
                                            :value="item.certificateType">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="证件号:" prop="number" :label-width="formLabelWidth">
                                        <el-input clearable :disabled="operateType==3 || operateType==2" v-model="formData_add.number" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="备注:" prop="remark" :label-width="formLabelWidth">
                                        <el-input clearable :disabled="operateType==3" v-model="formData_add.remark" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>
                </div>
            </div>
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">手机列表</h3>
                    <el-row class="btnBox" v-if="operateType!=3">
                        <el-col :span="4">
                            <el-button type="primary" round size="small" @click="addBtn_phoneFunc">添加手机</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="m_dialogMain">
                    <el-table
                    ref="ref_phoneList"
                    :data="tableData_phoneList"
                    style="width: 100%"
                    border
                    size="mini">
                        <el-table-column
                            label="手机号"
                            prop="mobileNum">
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            v-if="operateType!=1"
                            key="key_verifyStatus"
                            prop="verifyStatus">
                        </el-table-column>
                        <el-table-column
                            label="添加时间"
                            key="key_createTime"
                            v-if="operateType!=1"
                            prop="createTime">
                        </el-table-column>
                        <el-table-column
                            label="添加机构"
                            v-if="operateType!=1"
                            key="key_managementName"
                            prop="managementName">
                        </el-table-column>
                        <el-table-column
                            prop="verifyTime"
                            label="客户端实名验证时间"
                            v-if="operateType!=1"
                            key="key_verifyTime"
                            width="150"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            label="备注"
                            v-if="operateType!=1"
                            key="key_remark"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            v-if="operateType!=3"
                            key="key_scope"
                            label="操作"
                            width="80">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="deleteRow_phoneListFunc(scope.$index,scope)"
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

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" v-if="operateType==1" round size="small" @click="add_saveFunc">保存</el-button>
                    <el-button type="primary" v-if="operateType==2" round size="small" @click="edit_saveFunc">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogVisible_addBtn= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗 门禁卡-->
        <el-dialog title="门禁卡" :visible.sync="dialogVisible_door" width="900px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">门禁卡列表</h3>
                </div>
                <div class="m_dialogMain">
                    <el-table
                    ref="ref_global"
                    :data="tableData_doorCard"
                    style="width: 100%"
                    border
                    size="mini">
                        <el-table-column
                            label="卡ID"
                            prop="cardSn">
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            prop="personCardStatus">
                        </el-table-column>
                        <el-table-column
                            label="卡类型"
                            prop="cardType">
                        </el-table-column>
                        <el-table-column
                            label="发卡机构"
                            prop="managementName">
                        </el-table-column>
                        <el-table-column
                            prop="boundDate"
                            label="发卡时间"
                            width="150"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="strDate"
                            label="有效期">
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogVisible_door= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗- 房产 -->
        <el-dialog title="房产" :visible.sync="dialogVisible_house" width="1000px">
            <div class="m_aside">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">选择关联房产：</h3>
                    <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="ztree_filterText">
                    </el-input>
                </div>
                <div class="m_dialogMain">
                    <div class="box">
                        <el-tree
                            v-if="if_load_treeAgain"
                            :data="publish_treeData"
                            :props="publish_props"
                            :default-expanded-keys="defaultExpandedKeys"
                            node-key="areaId"
                            :load="loadNodeTree"
                            :expand-on-click-node="false"
                            :filter-node-method="filterNode"
                            lazy
                            ref="ref_tree">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span :class="{'aaa': node.disabled}" style="overflow:hidden;">{{ node.label }}</span>
                                    <span>
                                        <el-button
                                            type="text"
                                            size="mini"
                                            v-if="!node.disabled"
                                            style="padding:5px;font-weight:bold;"
                                            @click="() => append(data)">
                                            +
                                        </el-button>
                                    </span>
                                </span>
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="m_article">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">
                        房产列表：
                    </h3>
                </div>
                <div class="m_dialogMain">
                    <el-table
                    ref="ref_global"
                    :data="tableData_houseList"
                    style="width: 100%"
                    border
                    size="mini">
                        <el-table-column
                            label="房产"
                            prop="areaPath">
                        </el-table-column>
                        <el-table-column
                            label="授权状态"
                            width="80"
                            prop="dwelling">
                        </el-table-column>
                        <el-table-column
                            label="授权有效期"
                            prop="expiryDate">
                        </el-table-column>
                        <el-table-column
                            label="身份"
                            width="80"
                            :formatter="format_personIdentity"
                            prop="personIdentityCode">
                        </el-table-column>
                        <el-table-column
                            prop="startDate"
                            label="关联时间"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="doorRowFunc(scope)"
                                    type="text"
                                    size="small">
                                    编辑
                                </el-button>
                                <el-button
                                    @click.native.prevent="deleteRow_houseList(scope)"
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
             <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="livemanage_saveFunc">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogVisible_house=false">关闭</el-button>
                </div>
            </div>

            <!-- 弹窗 关联房产-->
        <el-dialog append-to-body title="关联房产" :visible.sync="dialogVisible_door_edit" width="700px">
            <div class="box doorEdit">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">关联房产</h3>
                </div>
                <div class="m_dialogMain">
                    <el-row>
                        <el-col :span="24">
                            <label>有效期：</label>
                            <el-date-picker
                                v-model="cur_houseList.date"
                                type="daterange"
                                :picker-options="pickerOptions2"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                size="small">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <label>住户身份：</label>
                            <el-select  v-model="cur_houseList.select" placeholder="请选择" size="small">
                                <el-option v-for="item in options_personIdentity"
                                :key="item.personIdentity"
                                :label="item.personIdentityName"
                                :value="item.personIdentity">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="addHouse_saveFunc(isAdd)">确认</el-button>
                    <el-button type="danger" round size="small" @click="dialogVisible_door_edit= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

        </el-dialog>

    </div>
</template>
<style lang="scss" scoped>
.f-header{
    label{
        width: 60px;
    }
    .el-input{
        width: 180px;
    }
}
.custom-tree-node{
    overflow: hidden;
}
.el-dialog{
    .m_aside .box{
        padding-left: 0;
    }
    .box{
        padding: 0 20px 20px 20px;
    }
    .el-col{
        height: 50px;
    }
    .el-input,.el-select{
        width: 180px;
    }
    .m_aside{
        width: 230px;
        float: left;
        margin-left: 20px;
        .el-input{
            width: 210px;
            margin-bottom: 10px;
        }
        min-height: 300px;
    }
    .m_article{
        margin-left: 250px;
        margin-right: 20px;
    }
    .doorEdit{
        label{
            width: 100px;
            display: inline-block;
            text-align: right;
        }
        .el-date-editor,.el-select{
            width: 350px;
        }
    }
    .aaa{
        color: #999;
    }
}
</style>
<script>
// import {validate} from '@/utils/validate.js'
import {arrayToAttrArray,tree_addAttr,tree_arrayToAttrArray_childrens,tree_addAttr_b} from '@/utils/common.js'
export default {
    data(){
        return {
            headInput:{
                certificate: '',
                phone: '',
                name: '',
                remark: '',
            },
            cur_houseList:{
                date: '',
                select: ''
            },
            cur_houseData: null,
            cur_$index: null,
            page:{
                current: 1,
                size: 20,
                total: 100
            },
            tableData_global:[
            ],
            tableData_houseList:[
            ],
            tableData_doorCard:[],
            tableData_phoneList:[],
            formLabelWidth: '100px',
            formData_add: {},
            formData_add_old: {
                name: '',
                remark: '',
            },
            dialogVisible_addBtn: false,
            dialogVisible_house: false,
            dialogVisible_door: false,
            dialogVisible_door_edit: false,
            options_certificateType: [],//1身份证、2护照、3其它
            options_personIdentity: [],
            operateType: 1,//添加1、编辑2、查看3
            curManagementId: '',
            curPersonInfoId: '',
            isAdd: null,
            ztree_filterText: '',

            pickerOptions2: {
                shortcuts: [{
                    text: '六个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    end.setTime(start.getTime() + 3600 * 1000 * 24 * 180);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '一年',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    end.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '一百年',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    end.setTime(start.getTime() + 3600 * 1000 * 24 * 36500);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },

            if_load_treeAgain: false,//控制是否从新渲染树数据，不知道还有没有更好的方法。。
            publish_treeData: [],
            publish_props:{
                label: 'areaName',
                children: 'childrens',
                isLeaf: 'ifLeaf'
            },
            defaultExpandedKeys: [],
            rules_form:{
                name:[
                    { required: true, message: '必填项，请输入', trigger: 'blur' }
                ],
                number:[
                    { required: true, message: '必填项，请输入', trigger: 'blur' }
                ],
                type:[
                    { required: true, message: '必选项，请选择', trigger: 'change' }
                ],
            }
        }
    },
    methods:{
        loadNodeTree(node, resolve) {
            if (node.level === 0) {
                debugger
                var sessionTreeDatas=JSON.parse(sessionStorage.getItem('httpData_queryAreaTree_session')),
                    expandTreeDatas=JSON.parse(sessionStorage.getItem('httpData_defaultExpandedKeys_session'));
                
                if (sessionTreeDatas) {//缓存起来；
                var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                    msgDatas_disabled=tree_addAttr_b(sessionTreeDatas,arrayId,'disabled','areaId');
                    resolve(msgDatas_disabled) ;
                    this.defaultExpandedKeys= expandTreeDatas;
                }else{
                    this.http_getAreaTreesFunc(resolve);
                }
            }else{
                debugger;
                var hasChild= node.data.childrens ? 1 : 0;
                if (hasChild) {
                    var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                        msgDatas_disabled=tree_addAttr_b(node.data.childrens,arrayId,'disabled','areaId');
                    resolve(msgDatas_disabled);
                }else{
                    var data={
                        parentId : node.data.areaId
                    }
                    this.http_queryAreaChildrens(data,resolve);
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
                    
                    _this.defaultExpandedKeys= tree_arrayToAttrArray_childrens(msgDatas,'areaId');
                    sessionStorage.setItem('httpData_queryAreaTree_session',JSON.stringify(msgDatas));
                    sessionStorage.setItem('httpData_defaultExpandedKeys_session',JSON.stringify(_this.defaultExpandedKeys));

                    var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                        msgDatas_disabled=tree_addAttr_b(msgDatas,arrayId,'disabled','areaId');
                    resolve(msgDatas_disabled);
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
                    for(let i=0;i<msgDatas.length;i++){//房间去掉下拉按钮；
                        if(msgDatas[i].level==50){
                            msgDatas[i].ifLeaf= true;
                        }
                    }
                    if (msgDatas.length>0) {
                        var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                            msgDatas_disabled=tree_addAttr_b(msgDatas,arrayId,'disabled','areaId');
                        
                        resolve(msgDatas_disabled);
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
        updatedTreeStatusFunc(){//更新树状图禁用状态；
            console.log('更新树状图禁用状态；');
            var disabledAreaIds= arrayToAttrArray(this.tableData_houseList,'areaId');
            sessionStorage.setItem('disabledNodes_session',JSON.stringify(disabledAreaIds));
            var _this=this;
            setTimeout(() => {
                _this.if_load_treeAgain= true;
            }, 0);
        },

        query_globalFunc(){
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                certificateNo: this.headInput.certificate,
                personMobile: this.headInput.phone,
                personName: this.headInput.name,
                remark: this.headInput.remark,
            }
            this.http_liveTableFunc(datas);
        },
        formAddClose(){
            this.$refs.ref_form.resetFields();
        },
        addBtn_globalFunc(type,scope){
            this.operateType=type;
            if (type==1) {//添加
                this.tableData_phoneList=[];
                this.formData_add={
                    name: '',
                    type: '',
                    number: '',
                    remark: ''
                }
            }else{//编辑//查看
                this.formData_add={
                    name: scope.row.personName,
                    type: scope.row.certificateType,
                    number: scope.row.certificateNo,
                    remark: scope.row.remark
                }
                this.formData_add_old.name= scope.row.personName;
                this.formData_add_old.remark= scope.row.remark;
                debugger;
                this.curPersonInfoId= scope.row.personInfoId;
                var datas={
                    managementId: scope.row.managementId,
                    personInfoId: scope.row.personInfoId,
                }
                this.http_getLiveDetailFunc(datas);
                
            }
            this.dialogVisible_addBtn= true;
        },
        addBtn_phoneFunc(){
            this.$prompt('请输入手机号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^1[34578][0-9]{9}$/,
                inputErrorMessage: '手机号格式不正确'
            }).then(({ value }) => {
                var datas={
                    managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                    mobileNum: value
                }
                this.http_checkMobileFunc(datas);
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });

        },
        reset_globalFunc(){
            this.headInput={
                certificate: '',
                phone: '',
                name: '',
                remark: '',
            }
        },
        formatCertificateType(row, column, cellValue, index){
            if (cellValue==1) {
                return '身份证'
            }else if (cellValue==2) {
                return '护照'
            }else{
                return '其它'
            }
        },
        format_personIdentity(row, column, cellValue, index){
            if (cellValue==1) {
                return '业主'
            }else if (cellValue==2) {
                return '业主亲属'
            }else if (cellValue==3) {
                return '租客'
            }else{
                return '承租人'
            }
        },
        house_operate_globalFunc(scope){
            this.dialogVisible_house=true;
            this.tableData_houseList= [];
            debugger;
            var data={
                personId: scope.row.personInfoId
            }
            this.curManagementId= scope.row.managementId;
            this.curPersonInfoId= scope.row.personInfoId;
            this.http_queryPersonBindAreas(data);
            this.if_load_treeAgain= false;
            // this.if_load_treeAgain= true;
        },
        door_operate_globalFunc(scope){
            this.dialogVisible_door=true;
            debugger;
            var datas={
                personId: scope.row.personInfoId
            }
            this.http_getDoorCardFunc(datas);
        },
        deleteRow_globalFunc(scope){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var datas={
                    "managementId": scope.row.managementId,
                    "personInfoId": scope.row.personInfoId
                }
                var _this=this;
                this.$post('/app/hpc-aggr/hpc/deleteManagementPersonInfo',datas)
                .then(function (response) {
                    console.log(response);
                    debugger;
                    if (response.data.code==0) {
                        _this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        var ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                            certificateNo: _this.headInput.certificate,
                            personMobile: _this.headInput.phone,
                            personName: _this.headInput.name,
                            remark: _this.headInput.remark,
                        }
                        _this.http_liveTableFunc(ddd);
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
        deleteRow_phoneListFunc(index,scope){
            this.tableData_phoneList.splice(index,1);
        },
        
        add_saveFunc(){
            var addMobileNums=[];
            var phoneList=this.tableData_phoneList;
            for (let i = 0,len=phoneList.length; i < len; i++) {
                addMobileNums.push(phoneList[i].mobileNum);
            }
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            debugger
            // var bool=reg.test(this.formData_add.number);
            // if ( this.options_certificateType==1 && !bool) {
            //     this.$message({
            //         type: 'info',
            //         message: '请输入正确证件号码'
            //     })
            // }
            debugger
            this.$refs.ref_form.validate((valid)=>{
                debugger;
                if (valid) {
                    var datas={
                            personName: this.formData_add.name,
                            certificateType: this.formData_add.type,
                            certificateNo: this.formData_add.number,
                            remark: this.formData_add.remark,
                            addMobileNums: addMobileNums,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2'
                        },
                        ddd={
                            certificateType: this.formData_add.type,
                            certificateNo: this.formData_add.number,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2'
                        };
                    this.http_checkCertificateNoIsExist(ddd,datas);
                    // this.http_addLiveFunc(datas);
                }
            })
            
        },
        edit_saveFunc(){
            var addMobileNums=[],
                deleteMobileNums=[],
                phone=[],
                oldphone=[],
                personName_bool= false,
                remark_bool= false;
            var phoneList=this.tableData_phoneList,
                oldPhoneList= JSON.parse(sessionStorage.getItem('session_phoneList'));
                debugger;
                for (let i = 0,len=phoneList.length; i < len; i++) {
                    phone.push(phoneList[i].mobileNum);
                }
                for (let k = 0,lenk=oldPhoneList.length; k < lenk; k++) {
                    oldphone.push(oldPhoneList[k].mobileNum);
                }
                for (let h = 0,lenh=phone.length; h < lenh; h++) {
                   if (oldphone.indexOf(phone[h])<0) {
                       addMobileNums.push(phone[h]);
                   } 
                }
                for (let t = 0,lent=oldphone.length; t < lent; t++) {
                   if (phone.indexOf(oldphone[t])<0) {
                       deleteMobileNums.push(oldphone[t]);
                   } 
                }
                debugger;
            // 有更改才需要传
            if (this.formData_add_old.name !=this.formData_add.name) {
                var personName_bool= true;
            }
            if (this.formData_add_old.remark !=this.formData_add.remark) {
                var remark_bool= true;
            }
            this.$refs.ref_form.validate((valid)=>{
                if (valid) {
                    var datas={
                        personName: personName_bool ? this.formData_add.name : null,
                        // certificateType: this.formData_add.type,
                        // certificateNo: this.formData_add.number,
                        remark: remark_bool ? this.formData_add.remark : null,

                        addMobileNums: addMobileNums,
                        deleteMobileNums: deleteMobileNums,
                        managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                        personInfoId: this.curPersonInfoId,
                    }
                    this.http_editLiveFunc(datas);
                }
            });
            
        },
        housetypeChanceFunc(){
            var level=this.formData_add.select;
            
        },
        livemanage_saveFunc(){
            debugger;
            var prev_dataList= JSON.parse(sessionStorage.getItem('session_tableData_houseList')) || [],
                prev_id= [],
                now_dataList=this.tableData_houseList,
                now_id= [],
                deleteIds= [],
                addInfos= [];
            prev_id= arrayToAttrArray(prev_dataList,'areaId');
            now_id= arrayToAttrArray(now_dataList,'areaId');
            for (let t = 0,lent=now_dataList.length; t < lent; t++) {
                if (prev_id.indexOf(now_dataList[t].areaId) <0 || now_dataList[t].hasOwnProperty('isEdit')) {//添加或者编辑的
                debugger;
                    var obj={
                        "areaId": now_dataList[t].areaId,
                        "areaRoomPersonId": now_dataList[t].areaRoomPersonId,
                        "endDate": now_dataList[t].endDate,
                        "personIdentity": now_dataList[t].personIdentityCode,
                        "startDate": now_dataList[t].startDate
                    }
                    addInfos.push(obj);
                }
                
            }
            for (let k = 0,lenk= prev_dataList.length; k < lenk; k++) {
                if (now_id.indexOf(prev_dataList[k].areaId)< 0) {
                    debugger;
                    deleteIds.push(prev_dataList[k].areaRoomPersonId);
                }
                
            }
            if (deleteIds.length==0 && addInfos.length==0) {
                this.$message({
                    type: 'info',
                    message: '没有任何更改'
                })
                return false;
            }
            var datas={
                "deleteIds": deleteIds,
                "infos": addInfos,
                "managementId": this.curManagementId,
                "personId": this.curPersonInfoId
            }
            this.http_saveOrUpdatePersonBindArea(datas);
        },
        http_saveOrUpdatePersonBindArea(datas){
            var _this=this;
            this.$post('/app/hpc-aggr/hpc/saveOrUpdatePersonBindArea',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogVisible_house= false;
                    _this.if_load_treeAgain= false;
                    var ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2'
                        }
                    _this.http_liveTableFunc(ddd);
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
        addHouse_saveFunc(){
            debugger;
            if (this.cur_houseList.date=='' || this.cur_houseList.date==null) {
                this.$message({
                    type: 'info',
                    message: '请选择日期'
                })
                return;
            }
            if (this.cur_houseList.select=='' || this.cur_houseList.select==null) {
                this.$message({
                    type: 'info',
                    message: '请选择角色'
                })
                return;
            }
            
            if (this.isAdd) {//添加
                var obj={
                    areaPath: this.cur_houseData.areaName,
                    areaId: this.cur_houseData.areaId,
                    dwelling: '待授权',
                    endDate: this.cur_houseList.date[1],
                    expiryDate: this.cur_houseList.date[0] +'~'+this.cur_houseList.date[1],
                    personIdentityCode: this.cur_houseList.select,
                    startDate: this.cur_houseList.date[0] 
                }
                this.tableData_houseList.push(obj);
            }else{
                this.tableData_houseList[this.cur_$index].startDate=this.cur_houseList.date[0];
                this.tableData_houseList[this.cur_$index].endDate=this.cur_houseList.date[1];
                this.tableData_houseList[this.cur_$index].expiryDate=this.cur_houseList.date[0] +'~'+this.cur_houseList.date[1];
                this.tableData_houseList[this.cur_$index].personIdentityCode=this.cur_houseList.select;
                this.tableData_houseList[this.cur_$index].isEdit=true;
            }
            this.dialogVisible_door_edit= false;
            

        },
        append(data) {
            var areaIdList= arrayToAttrArray(this.tableData_houseList,'areaId');
            if (areaIdList.indexOf(data.areaId)>=0) {
                this.$message({
                    type: 'info',
                    message: '已经添加入列表'
                })
                return false;
            }
            this.dialogVisible_door_edit=true;
            this.cur_houseData= data;
            this.isAdd= true;
            debugger;
            this.cur_houseList={
                date: ['',''],
                select: ''
            }
        },
        doorRowFunc(scope){
            this.dialogVisible_door_edit=true;
            debugger;
            this.cur_houseData=scope.row;
            this.cur_$index= scope.$index;
            this.isAdd= false;
            this.cur_houseList={
                date: [scope.row.startDate,scope.row.endDate],
                select: scope.row.personIdentityCode
            }
            
        },
        deleteRow_houseList(scope){
            this.tableData_houseList.splice(scope.$index,1);
        },
        
        http_liveTableFunc(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/getManagementPersonInfoList',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var msgDatas=response.data.data.records;
                    _this.tableData_global= msgDatas;
                    _this.page.total=response.data.data.total;
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
        http_checkCertificateNoIsExist(ddd,datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/checkCertificateNoIsExist',ddd)
            .then(function (response) {
                debugger
                if (response.data.code==0) {
                    if (response.data.data.isExist==1) {//是否已存在，1为不存在，2为已存在
                        _this.http_addLiveFunc(datas);
                    }else{
                        _this.$message({
                            type: 'info',
                            message: '此证件号已经存在'
                        })
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
        http_addLiveFunc(datas){
            var _this=this;
            this.$post('/app/hpc-aggr/hpc/addManagementPersonInfo',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                            certificateNo: _this.headInput.certificate,
                            personMobile: _this.headInput.phone,
                            personName: _this.headInput.name,
                            remark: _this.headInput.remark,
                        }
                    _this.http_liveTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                    _this.dialogVisible_addBtn= false;
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
        http_editLiveFunc(datas){
            var _this=this;
            this.$post('/app/hpc-aggr/hpc/updateManagementPersonInfo',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                            certificateNo: _this.headInput.certificate,
                            personMobile: _this.headInput.phone,
                            personName: _this.headInput.name,
                            remark: _this.headInput.remark,
                        }
                    _this.http_liveTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '编辑成功'
                    })
                    _this.dialogVisible_addBtn= false;
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
        http_getLiveDetailFunc(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryManagementPersonInfoById',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    _this.tableData_phoneList= msgDatas;
                    if (_this.operateType==2) {//编辑的时候记录手机列表，编辑好保存的时候才知道那些是新增的或者被删除了；
                        sessionStorage.setItem('session_phoneList',JSON.stringify(_this.tableData_phoneList));
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
        http_getDoorCardFunc(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryPersonCardList',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    _this.tableData_doorCard= response.data.data;
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
        http_getTypeFunc(){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/getCertificateType')
            .then(function (response) {
                console.log(response);
                // debugger
                if (response.data.code==0) {
                    _this.options_certificateType=response.data.data;
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
        http_getPersonIdentity(){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryPersonIdentityList')
            .then(function (response) {
                console.log(response);
                // debugger
                if (response.data.code==0) {
                    _this.options_personIdentity=response.data.data;
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
        http_checkMobileFunc(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/checkMobileIsBindOtherPerson',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    if (response.data.data.isBindOtherPerson==1) {
                        _this.$message({
                            type: 'success',
                            message: '你的手机号是: ' + datas.mobileNum
                        });
                        var obj={
                            mobileNum: datas.mobileNum
                        }
                        _this.tableData_phoneList.push(obj);
                    }else{
                        _this.$message({
                            type: 'info',
                            message: datas.mobileNum+'已绑定了其他住户'
                        });
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
        filterNode(value, data) {
            debugger;
            if (!value) 
                return true;
            return data.areaName.indexOf(value) !== -1;
        },

        http_queryPersonBindAreas(data){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryPersonBindAreas',data)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    // if (response.data.data.length>0) {
                        _this.tableData_houseList=response.data.data;
                        sessionStorage.setItem('session_tableData_houseList',JSON.stringify(response.data.data));
                    // }
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
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                certificateNo: this.headInput.certificate,
                personMobile: this.headInput.phone,
                personName: this.headInput.name,
                remark: this.headInput.remark,
            }
            this.http_liveTableFunc(datas);
        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                certificateNo: this.headInput.certificate,
                personMobile: this.headInput.phone,
                personName: this.headInput.name,
                remark: this.headInput.remark,
            }
            this.http_liveTableFunc(datas);
        },
    },
    created() {
        var datas={
            pageNum: this.page.current,
            pageSize: this.page.size,
            managementId: '6b0c4ccab56711e88a4a000c29a401f2'
        }
        this.http_liveTableFunc(datas);
        this.http_getTypeFunc();
        this.http_getPersonIdentity();
    },
    watch: {
        ztree_filterText(val) {
            this.$refs.ref_tree.filter(val);
        }
    },
}
</script>


