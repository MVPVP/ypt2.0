<template>
    <div>
        <div class="f-contain">
            <div class="box">
                <div class="header">
                    <h2 class="m_borderLeft_title">卡片信息</h2>
                </div>
                <div class="contain">
                    <el-row>
                        <el-col :span="8">
                            <label for="">卡ID：</label><span>{{headInput.cardSn}}</span>
                        </el-col>
                        <el-col :span="5">
                            <label for="">卡片类型：</label><span>{{headInput.cardType}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label for="">备注：</label>
                            <span>{{headInput.remark}}</span>
                        </el-col>
                        <el-col :span="5">
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
                    <div class="noCardBox" v-if="cardStatus == 1">
                        <el-row class="btnBox">
                            <el-col :span="24">
                                <el-button type="primary" round size="small" @click="card_bindPersonFunc">绑定用户</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="m-cardBox"  v-if="cardStatus == 2">
                        <div class="header">
                            <span class="name">
                                {{personInfo.personName}} 
                                <el-button size="mini" type="text" @click="card_unBindPersonFunc">解绑</el-button>
                            </span>
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
                                <el-col :span="12" v-if="bindTime">
                                    <label for="">绑定时间：</label><span>{{personInfo.boundDate}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <label for="">有效期：</label>
                                    <span>
                                        <el-date-picker
                                            style="width:360px;"
                                            v-model="personInfo.date"
                                            type="daterange"
                                            :picker-options="pickerOptions2"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd"
                                            size="small">
                                        </el-date-picker>
                                    </span>
                                </el-col>
                                <el-col :span="12">
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
                </div>
            </div>
            <div class="box">
                <div class="header">
                    <h2 class="m_borderLeft_title">授权房产</h2>
                </div>
                <div class="ztree_box">
                    <div class="ztree_aside">
                        <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="ztree_filterText">
                        </el-input>
                        <div class="m_scroll">
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
                    <div class="ztree_article">
                        <div class="f-contain">
                            <div class="contain">
                                <el-table
                                    ref="ref_global"
                                    :data="tableData_houseList"
                                    style="width: 88%"
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
                                        label="授权角色"
                                        :formatter="permission_format"
                                        prop="permissionRoleCode">
                                    </el-table-column>
                                    <el-table-column
                                        prop="addDate"
                                        label="添加时间"
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
                                                移除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <el-row class="m_footBox">
                <el-button type="primary" round size="small" @click="doorCard_saveFunc">保存</el-button>
                <el-button type="danger" round size="small"  @click="backFunc">返回</el-button>
            </el-row>
        </div>

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
                            <label>授权角色：</label>
                            <el-select  v-model="cur_houseList.select" placeholder="请选择" size="small">
                                <el-option v-for="item in options_personIdentity"
                                :key="item.dataLabel"
                                :label="item.dataDetail"
                                :value="item.dataLabel">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="addHouse_saveFunc">确认</el-button>
                    <el-button type="danger" round size="small" @click="dialogVisible_door_edit= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 弹窗 选择住户-->
        <el-dialog title="选择住户" :visible.sync="dialogVisible_liveList" width="900px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">请选择住户</h3>
                </div>
                <div class="m_dialogMain">
                    <el-form size="small">
                        <div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="证件号：" prop="certificate" :label-width="formLabelWidth">
                                        <el-input  v-model="formData_liveList.certificate" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="手机号：" prop="phone" :label-width="formLabelWidth">
                                        <el-input  v-model="formData_liveList.phone" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="姓名：" prop="name" :label-width="formLabelWidth">
                                        <el-input v-model="formData_liveList.name" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-button type="primary" round size="small" @click="query_dialogFunc">查询</el-button>
                                    <el-button round size="small" @click="reset_dialogFunc">重置</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>
                </div>
            </div>
            <div class="box">
                <div class="m_dialogMain">
                    <el-table
                    ref="ref_phoneList"
                    :data="tableData_liveList"
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
                            prop="phoneNumber"
                            show-overflow-tooltip
                            width="200">
                        </el-table-column>
                        <el-table-column
                            label="证件类型"
                            prop="certificateType"
                            :formatter="formatCertificateType"
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
                            prop="remark"
                            label="备注"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            fixed="right"
                            width="80">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="selectRowFunc(scope)"
                                    type="text"
                                    size="small">
                                    选择
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
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
        
    </div>
</template>

<style lang="scss" scoped>
.f-contain{
    .el-col{
        line-height: 40px;
        label,dt{
            padding: 0 10px 0 0;
            width: 90px;
            text-align: right;
            display: inline-block;
        }
        .el-input{width: 180px;}
    }
    .main{
        .el-col{
            line-height: 35px;
        }
    }
    
    .m-cardBox{
        width: 90%;
        dt{
            float: left;

        }
        dd{
            margin-left: 90px;
        }
    }
    .ztree_box{
        background: #fff;
        min-height: 500px;
        max-height: 500px;
        .custom-tree-node{
            overflow: hidden;
        }
        .aaa{
            color: #999;
        }
        .ztree_aside{
            .el-input{
                margin-bottom: 10px;
            }
        }
    }
    
}
.doorEdit{
    padding: 0 20px 20px 20px;
    label{
        width: 100px;
        display: inline-block;
        text-align: right;
    }
    .el-date-editor,.el-select{
        width: 350px;
    }
    .el-col{
        height: 50px;
    }
}
.el-dialog {
    .el-input{
        width: 180px;
    }
    .box{
        padding: 0 20px 20px 20px;
    }
}
</style>
<script>
import {arrayToAttrArray,formateDate,tree_addAttr,tree_addAttr_b,tree_arrayToAttrArray_childrens} from '@/utils/common.js'

export default {
    data(){
        return{
            page:{
                current: 1,
                size: 20,
                total: 100
            },
            headInput:null,
            personInfo:{
                rooms:[]
            },
            cardStatus: 1,//1为没有绑定住户；2有绑定住户
            tableData_houseList:[],

            dialogVisible_door_edit: false,
            bindTime: true,

            cur_houseList:{
                date: '',
                select: ''
            },
            cur_houseData: null,
            cur_$index: null,
            options_personIdentity: [],
            isAdd: null,
            dialogVisible_liveList: false,
            formLabelWidth: '100px',
            tableData_liveList: [],
            formData_liveList: {
                certificate: '',
                phone: '',
                name: '',
            },

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
            options_house: [],

            if_load_treeAgain: false,//控制是否从新渲染树数据，不知道还有没有更好的方法。。
            publish_treeData: [],
            publish_props:{
                label: 'areaName',
                children: 'childrens'
            },
            defaultExpandedKeys: [],
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
                    msgDatas_disabled=tree_addAttr_b([sessionTreeDatas],arrayId,'disabled','areaId');
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
                        msgDatas_disabled=tree_addAttr_b([msgDatas],arrayId,'disabled','areaId');
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

        backFunc(){
            this.$router.push({path: '/doormanage'});
        },
        append(data) {
            console.log('9');
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
        },
        tree_nodeFunc(aa,bb,cc){

        },
        doorCard_saveFunc(){
            debugger;
            var prev_dataList= JSON.parse(sessionStorage.getItem('session_tableData_houseList')),
                prev_id= [],
                now_dataList=this.tableData_houseList,
                now_id= [],
                deleteIds= [],
                addInfos= [];

            var prev_id=arrayToAttrArray(prev_dataList,'areaId');
            var now_id=arrayToAttrArray(now_dataList,'areaId');
            // debugger;
            // prev_dataList.forEach(function(item){
            //     prev_id.push(item.areaId);
            // });
            // now_dataList.forEach(function(item){
            //     now_id.push(item.areaId);
            // });
            for (let t = 0,lent=now_dataList.length; t < lent; t++) {
                if (prev_id.indexOf(now_dataList[t].areaId) <0 || now_dataList[t].hasOwnProperty('isEdit')) {//添加或者编辑的
                // debugger;
                    var obj={
                        "areaId": now_dataList[t].areaId,
                        "cardAreaManagementId": now_dataList[t].cardAreaManagementId,
                        "permissionRole": now_dataList[t].permissionRoleCode,
                        "cardAreaStartDate": now_dataList[t].startDate,
                        "cardAreaEndDate": now_dataList[t].endDate,
                    }
                    addInfos.push(obj);
                }
                
            }
            for (let k = 0,lenk= prev_dataList.length; k < lenk; k++) {
                if (now_id.indexOf(prev_dataList[k].areaId)< 0) {
                    // debugger;
                    deleteIds.push(prev_dataList[k].cardAreaManagementId);
                }
                
            }
            var ifBindPerson= this.personInfo.hasOwnProperty('personInfoId');//判断有没有绑定用户；
            if (ifBindPerson && (typeof this.personInfo.date)=='undefined') {
                this.$message({
                    type: 'info',
                    message: '请选择有效期'
                })
                return false;
            }

            var datas={
                cardAreaManagementInfos: addInfos,
                deleteCardAreaManagementIds: deleteIds,
                cardPersonStartDate: ifBindPerson ? this.personInfo.date[0] : null,
                cardPersonEndDate: ifBindPerson ? this.personInfo.date[1] : null ,
                cardId: this.headInput.cardId,
                remark: this.headInput.remark,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                personInfoId: ifBindPerson ? this.personInfo.personInfoId : null,
                
            }
            this.http_doorCardSaveFunc(datas);
        },
        http_doorCardSaveFunc(datas){
            var _this=this;
            this.$post('/app/hpc-aggr/hpc/saveOrUpdateCardInfo',datas)
            .then(function (response) {
                console.log(response);
                // debugger
                if (response.data.code==0) {
                    _this.if_load_treeAgain= false;
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    debugger;
                    var ddd={
                        cardId: _this.headInput.cardId,
                        managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                    }
                    _this.http_getCardAuthorizationAreas(ddd);
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
        card_unBindPersonFunc(){
            // debugger
            if (this.personInfo.cardId) {
                this.$confirm('此操作将解绑该住户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var datas={
                        id: this.personInfo.cardId
                    }
                    this.http_cardUnBindPerson(datas);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消解绑'
                    });          
                });
                
            }else{
                this.cardStatus= 1;
            }
            
        },
        card_bindPersonFunc(){
            // debugger
            this.dialogVisible_liveList= true;

            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2'
            }
            this.http_liveTableFunc(datas);
        },
        http_cardUnBindPerson(datas){
            var _this=this;
            this.$post('/app/hpc-aggr/hpc/cardUnBindPerson',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    _this.cardStatus= 1;
                    _this.$message({
                        type: 'success',
                        message: '解绑成功'
                    })
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
        doorRowFunc(scope){
            this.dialogVisible_door_edit=true;
            // debugger;
            this.cur_houseData=scope.row;
            this.cur_$index= scope.$index;
            this.isAdd= false;
            this.cur_houseList={
                date: [scope.row.startDate,scope.row.endDate],
                select: scope.row.permissionRoleCode
            }
            
        },
        deleteRow_houseList(scope){
            this.$confirm('是否从列表移除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.tableData_houseList.splice(scope.$index,1);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消移除'
                });          
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
                    authorizationStatus: '待授权',
                    endDate: this.cur_houseList.date[1],
                    expiryDate: this.cur_houseList.date[0] +'~'+this.cur_houseList.date[1],
                    permissionRoleCode: this.cur_houseList.select,
                    startDate: this.cur_houseList.date[0] 
                }
                this.tableData_houseList.push(obj);
            }else{
                this.tableData_houseList[this.cur_$index].expiryDate=this.cur_houseList.date[0] +'~'+this.cur_houseList.date[1];
                this.tableData_houseList[this.cur_$index].permissionRoleCode=this.cur_houseList.select;
                this.tableData_houseList[this.cur_$index].isEdit=true;
            }
            this.dialogVisible_door_edit= false;
            

        },
        http_getCardBindPersonInfo(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryCardBindPersonInfo',datas)
            .then(function (response) {
                console.log(response);
                // debugger
                if (response.data.code==0) {
                    var msg= response.data.data;
                    if (msg) {
                        _this.cardStatus= 2;
                        msg.phones= msg.phones.join(',');
                        msg.date=[msg.startDate,msg.endDate];
                        msg.personInfoId=msg.personId;
                        // debugger;
                        _this.personInfo= msg;
                    }else{
                        _this.cardStatus= 1;
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
        http_getPrepareBindPersonInfo(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryPrepareBindPersonInfo',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var msg= response.data.data.rooms;
                    if (msg.length>0) {
                        _this.personInfo.rooms=msg;
                        //添加进列表，不重复；
                        var tableData_houseList= _this.tableData_houseList;
                        var id_houseList= arrayToAttrArray(tableData_houseList,'areaId');
                        var id_msg= arrayToAttrArray(msg,'areaId');
                        for (let i = 0,len=msg.length; i < len; i++) {
                            if (id_houseList.indexOf(msg[i].areaId)<0) {
                                var obj=msg[i];
                                obj.areaPath=obj.areaPath.split('（')[0];
                                obj.permissionRoleCode='1';
                                obj.authorizationStatus= '待授权';
                                obj.startDate= formateDate(new Date()).split(' ')[0];
                                obj.endDate= (Number(obj.startDate.split('-')[0]) +1)+'-'+obj.startDate.match(/\d-(.*)/)[1];
                                obj.date= [obj.startDate,obj.endDate];
                                obj.expiryDate= obj.startDate+'~'+obj.endDate;
                                _this.tableData_houseList.push(obj);
                            }
                        }
                    }else{
                        
                    }
                    _this.cardStatus= 2;
                    
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
                   _this.tableData_houseList=msg;
                   sessionStorage.setItem('session_tableData_houseList',JSON.stringify(response.data.data));
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

        http_getCardAndAreaPermissionRole(){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryCardAndAreaPermissionRole')
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
        query_dialogFunc(){
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                certificateNo: this.formData_liveList.certificate,
                personMobile: this.formData_liveList.phone,
                personName: this.formData_liveList.name,
            }
            this.http_liveTableFunc(datas);
        },
        reset_dialogFunc(){
            this.formData_liveList={
                certificate: '',
                phone: '',
                name: '',
                remark: '',
            }
        },
        selectRowFunc(scope){
            debugger;
            this.personInfo= scope.row;
            this.personInfo.phones= scope.row.phoneNumber;
            this.dialogVisible_liveList= false;
            this.bindTime= false;
            var datas={
                personId: scope.row.personInfoId,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
            }
            this.http_getPrepareBindPersonInfo(datas);
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
        permission_format(row, column, cellValue, index){
            if (cellValue==1) {
                return '住户'
            }else{
                return '物业人员'
            }
        },
        http_liveTableFunc(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/getManagementPersonInfoList',datas)
            .then(function (response) {
                console.log(response);
                // debugger
                if (response.data.code==0) {
                    var msgDatas=response.data.data.records,
                        allDatas=[];
                    for (let i = 0,len=msgDatas.length; i < len; i++) {
                        var data=msgDatas[i];
                        if (data.personMobileInfos.length>0) {
                            var datak=data.personMobileInfos,
                                phone=[];
                            for (let k = 0,lenk=datak.length; k < lenk; k++) {
                               phone.push(datak[k].mobileNum);
                            }
                            data.phoneNumber=phone.join(',');
                        }
                        allDatas.push(data);
                    }
                    _this.tableData_liveList= allDatas;
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
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            var data={
                pageNum: this.page.current,
                pageSize: val
            }
            this.http_liveTableFunc(data);
        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            var data={
                pageNum: val,
                pageSize: this.page.size
            }
            this.http_liveTableFunc(data);
        },
    },
    watch:{
        ztree_filterText(val) {
            this.$refs.ref_tree.filter(val);
        },
    },
    created() {
        this.headInput= JSON.parse(sessionStorage.getItem('curCardData_session'));
        // debugger;
        var datas={
            cardId: this.headInput.cardId,
            managementId: '6b0c4ccab56711e88a4a000c29a401f2',
        }

        this.http_getCardBindPersonInfo(datas);
        this.http_getCardAuthorizationAreas(datas);
        

        this.http_getCardAndAreaPermissionRole();
        
        this.if_load_treeAgain= true;
    },
}
</script>


