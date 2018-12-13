<template>
    <div class="ztree_box">
        <div class="ztree_aside">
            <el-input 
                placeholder="输入关键字进行过滤"
                v-model="ztree_filterText">
            </el-input>
            <div class="m_scroll">
                <!-- <el-tree
                    :data="house_treeData"
                    :props="house_props"
                    default-expand-all
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :filter-node-method="ztree_filterNode"
                    :render-content	="ztree_render"
                    @node-click="tree_nodeFunc"
                    ref="ref_tree">
                </el-tree> -->

                <el-tree
                    v-if="if_load_treeAgain"
                    :data="publish_treeData"
                    :props="publish_props"
                    :default-expanded-keys="defaultExpandedKeys"
                    node-key="areaId"
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
                <el-row class="btnBox">
                    <el-col :span="2">
                        <el-button :disabled="cur_level==50" type="primary" round size="small" @click="add_ztreeFunc">添加</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button :disabled="cur_level==20" type="danger" round size="small" @click="delete_ztree">删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="f-contain">
                <div class="box">
                    <div class="header">
                        <h2 class="m_borderLeft_title">房产属性</h2>
                    </div>
                    <div class="contain">
                        <div class="typeBox">
                            <div v-if="cur_level==50">
                                <el-form :model="formData_attr" :rules="rules_attrRoom" size="small" ref="ref_attrRoom">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="房号：" prop="roomNum">
                                                <el-input clearable placeholder="请输入内容" v-model="formData_attr.roomNum"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="房产类型：">
                                                <el-input clearable placeholder="请输入内容" disabled v-model="formData_attr.levelToHouseType"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="房屋类型：">
                                                <el-select clearable prop="select"  v-model="formData_attr.roomType" placeholder="请选择" >
                                                    <el-option v-for="item in options_room"
                                                        :key="item.dataLabel"
                                                        :label="item.dataDetail"
                                                        :value="item.dataLabel">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="建筑面积：" prop="floorArea">
                                                <el-input clearable placeholder="请输入数字值" v-model="formData_attr.floorArea" maxlength="10">
                                                    <template slot="append">㎡</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="套内面积：" prop="innerArea">
                                                <el-input clearable placeholder="请输入数字值" v-model="formData_attr.innerArea" maxlength="10">
                                                    <template slot="append">㎡</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="房产证地址：">
                                                <el-input clearable placeholder="请输入内容" v-model="formData_attr.address"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="经度：" prop="longitude">
                                                <el-input clearable placeholder="请输入有效数字值" v-model="formData_attr.longitude" maxlength="11"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="纬度：" prop="latitude">
                                                <el-input clearable placeholder="请输入有效数字值" v-model="formData_attr.latitude" maxlength="11"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="备注：">
                                                <el-input clearable placeholder="请输入内容" v-model="formData_attr.areaRemark"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-button type="primary" round size="small" @click="attr_saveFunc">保存</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                            <!-- 根据后台返回动态渲染 -->
                            <div class="dynamicsBox_attr" v-else>
                                <el-row>
                                    <el-col :span="8">
                                        <label><i class="i_star">*</i>名称：</label>
                                        <el-input clearable placeholder="请输入内容" size="small" v-model="formData_attr.areaName"></el-input>
                                    </el-col>
                                    <el-col v-for="item in dynamicsData_attr" :key="item.areaDataLabel"  :span="8">
                                        <label>{{item.attributeName}}：</label>
                                        <el-input clearable placeholder="请输入内容" size="small" v-model="item.dataValue"></el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <label>备注：</label>
                                        <el-input clearable placeholder="请输入内容" size="small" v-model="formData_attr.areaRemark"></el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-button type="primary" round size="small" @click="attr_saveFunc">保存</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div class="header">
                        <h2 class="m_borderLeft_title">住户列表</h2>
                    </div>
                    <div class="contain">
                        <el-table
                            ref="ref_family"
                            :data="tableData_live"
                            border
                            size="mini">
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                label="姓名"
                                prop="personName">
                            </el-table-column>
                            <el-table-column
                                label="身份"
                                prop="personIdentity">
                            </el-table-column>
                            <el-table-column
                                label="状态"
                                prop="personCardStatus"
                                :formatter="liveStatus_formatFunc">
                                <!-- person_card_status，1为正常，2为已过期 -->
                            </el-table-column>
                            <el-table-column
                                label="电话号码"
                                :formatter="format_mobileNums"
                                prop="mobileNums">
                            </el-table-column>
                            <el-table-column
                                label="添加时间"
                                prop="startDate">
                            </el-table-column>
                            <el-table-column
                                label="有效期"
                                prop="expiryDate">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="80">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="detailRowFunc_liveList(scope.$index,scope)"
                                        type="text"
                                        size="small">
                                        查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="box">
                    <div class="header">
                        <h2 class="m_borderLeft_title">门禁卡列表</h2>
                    </div>
                    <div class="contain">
                        <el-table
                            ref="ref_door"
                            :data="tableData_door"
                            border
                            size="mini">
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                label="卡ID"
                                prop="cardId">
                            </el-table-column>
                            <el-table-column
                                label="状态"
                                prop="cardStatusCode"
                                :formatter="doorCardStatus_formatFunc">
                            </el-table-column>
                            <el-table-column
                                label="卡类型"
                                prop="cardType">
                            </el-table-column>
                            <el-table-column
                                label="发卡时间"
                                prop="startDate">
                            </el-table-column>
                            <el-table-column
                                label="有效期"
                                prop="expiryDate">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="80"
                                prop="creatorName">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="detailRowFunc_door(scope.$index,scope)"
                                        type="text"
                                        size="small">
                                        查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <!-- 添加房产 -->
        <el-dialog title="添加房产" :visible.sync="dialogFormVisible_add" width="850px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">添加房产</h3>
                </div>
                <div class="m_dialogMain">
                    <el-form :model="formData_add" :rules="rules_add" size="small" ref="refForm_add">
                        <el-row>
                            <el-col>
                                <el-form-item label="房产类型：" prop="select" >
                                    <el-select clearable v-model="formData_add.select" placeholder="请选择" size="small" @change="housetypeChanceFunc">
                                        <el-option v-for="item in options_house"
                                            :key="item.level"
                                            :label="item.areaTypeName"
                                            :value="item.level">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!-- 根据后台返回动态渲染 -->
                        <div class="dynamicsBox_add"   v-if="formData_add.select != 50">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="名称：" prop="number" :label-width="formLabelWidth">
                                        <el-input clearable v-model="formData_add.number" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col v-for="item in dynamicsData_add" :key="item.areaDataLabel"  :span="12">
                                    <el-form-item :label="item.attributeName+'：'" :label-width="formLabelWidth">
                                        <el-input clearable v-model="item.dataValue" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="备注：" prop="areaRemark" :label-width="formLabelWidth">
                                        <el-input clearable type="textarea" v-model="formData_add.areaRemark" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- 房屋类型渲染  -->
                        <div v-if="formData_add.select== 50">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="房号：" prop="number" :label-width="formLabelWidth">
                                        <el-input clearable v-model="formData_add.number" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="房屋类型：" prop="type">
                                        <el-select clearable v-model="formData_add.type" placeholder="请选择" size="small" @change="housetypeChanceFunc">
                                            <el-option v-for="item in options_room"
                                                :key="item.dataLabel"
                                                :label="item.dataDetail"
                                                :value="item.dataLabel">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
              
                                <el-col :span="12">
                                    <el-form-item label="建筑面积：" prop="floorArea" :label-width="formLabelWidth">
                                        <el-input clearable v-model="formData_add.floorArea" placeholder="请输入数字" maxlength="10">
                                            <template slot="append">㎡</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="套内面积：" prop="innerArea" :label-width="formLabelWidth">
                                        <el-input clearable v-model="formData_add.innerArea" placeholder="请输入数字" maxlength="10">
                                            <template slot="append">㎡</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                   
                                <el-col :span="12">
                                    <el-form-item label="房产证地址：" prop="address" :label-width="formLabelWidth">
                                        <el-input clearable v-model="formData_add.address" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="经度：" prop="longitude" :label-width="formLabelWidth">
                                        <el-input clearable v-model="formData_add.longitude" placeholder="请输入有效数字值" maxlength="11"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="纬度：" prop="latitude" :label-width="formLabelWidth">
                                        <el-input clearable v-model="formData_add.latitude" placeholder="请输入有效数字值" maxlength="11"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="备注：" prop="areaRemark" :label-width="formLabelWidth">
                                        <el-input clearable type="textarea" v-model="formData_add.areaRemark" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="add_saveFunc">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_add= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 住户 -->
        <el-dialog title="住户详情" :visible.sync="dialogFormVisible_house" width="850px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">住户信息</h3>
                </div>
                <div class="m_dialogMain">
                    <el-row>
                        <el-col :span="12">
                            <label><i class="i_star">*</i>姓名：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_house.name"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <label><i class="i_star">*</i>证件类型：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_house.type"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <label><i class="i_star">*</i>证件号：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_house.number"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <label>备注：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_house.remark"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">手机列表</h3>
                </div>
                <div class="m_dialogMain">
                     <el-table
                            ref="ref_door"
                            :data="tableData_phoneList"
                            border
                            size="mini">
                            <el-table-column
                                label="手机号"
                                prop="mobileNum">
                            </el-table-column>
                            <el-table-column
                                label="状态"
                                prop="verifyStatus">
                            </el-table-column>
                            <el-table-column
                                label="添加时间"
                                prop="createTime">
                            </el-table-column>
                            <el-table-column
                                label="添加机构"
                                prop="managementName">
                            </el-table-column>
                            <el-table-column
                                label="客户端实名验证时间"
                                width="150"
                                prop="verifyTime">
                            </el-table-column>
                            <el-table-column
                                label="备注"
                                prop="remark">
                            </el-table-column>
                        </el-table>
                </div>
            </div>
            
            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_house= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 门禁卡 -->
        <el-dialog title="门禁卡详情" :visible.sync="dialogFormVisible_door" width="850px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">卡片信息</h3>
                </div>
                <div class="m_dialogMain">
                    <el-row>
                        <el-col :span="12">
                            <label>卡ID：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_cardDetail.cardSn"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <label>卡片类型：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_cardDetail.cardType"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <label>卡片状态：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_cardDetail.cardStatus"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <label>备注：</label>
                            <el-input clearable disabled placeholder="请输入内容" size="small" v-model="formData_cardDetail.areaRemark"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">绑定住户</h3>
                </div>
                <div class="m_dialogMain">
                     <el-table
                        ref="ref_door"
                        :data="tableData_bindPerson"
                        border
                        size="mini">
                        <el-table-column
                            label="姓名"
                            prop="personName">
                        </el-table-column>
                        <el-table-column
                            label="电话"
                            prop="mobiles"
                            :formatter="aaaType_formatFunc">
                        </el-table-column>
                        <el-table-column
                            label="证件类型"
                            width="80"
                            prop="certificateType">
                        </el-table-column>
                        <el-table-column
                            label="证件号码"
                            prop="certificateNo">
                        </el-table-column>
                        <el-table-column
                            label="关联房屋数"
                            prop="roomCount">
                        </el-table-column>
                        <el-table-column
                            label="绑定时间"
                            prop="boundDate">
                        </el-table-column>
                        <el-table-column
                            label="有效期"
                            prop="expiryDate">
                        </el-table-column>
                        <el-table-column
                            label="绑定状态"
                            width="80"
                            prop="personCardStatus">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">授权房产</h3>
                </div>
                <div class="m_dialogMain">
                     <el-table
                        ref="ref_door"
                        :data="tableData_bindAreas"
                        border
                        size="mini">
                        <el-table-column
                            label="房产"
                            prop="areaPath">
                        </el-table-column>
                        <el-table-column
                            label="授权状态"
                            prop="authorizationStatus"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            label="授权有效期"
                            prop="expiryDate">
                        </el-table-column>
                        <el-table-column
                            label="权限角色"
                            width="100"
                            prop="permissionRole">
                        </el-table-column>
                        <el-table-column
                            label="添加时间"
                            prop="addDate">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            
            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_door= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss" scope>
.ztree_box{
    .box{
        min-height: 200px;
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
        height: 50px;
    }
    .el-input{
        width: 180px;
    }
    label{
        width: 100px;
        text-align: right;
        display: inline-block;
    }
    .el-col{
        min-height: 50px;
    }
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
    .box{
        padding: 0 20px;
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
        var checkNumber=(rule,value,callback)=>{
            if (value && isNaN(Number(value)) ) {
                callback(new Error('请输入数字值'));
            }else {
                callback();
            }
        }
        var checkNumber_1000=(rule,value,callback)=>{
            debugger
            if (value && isNaN(Number(value)) || Math.abs(Number(value)||0)>1000 ) {
                callback(new Error('请输入有效数字值范围'));
            }else {
                callback();
            }
        }
        return {
            ztree_filterText: '',
            formLabelWidth: '100px',
            houseName: '',
            dynamicsData_add: [],
            dynamicsData_attr: [],
            formData_attr:{
                roomNum: '',//房号
                areaName: '',//名称
                roomType: '',//房屋类型
                levelToHouseType: '',//房屋类型
                floorArea: '',//建筑面积
                innerArea: '',//套内面积
                address: '',//房产证地址
                areaRemark: '',//备注
                areaId: '',//
            },
            formData_house:{
                name: '',//姓名
                type: '',//type
                number: '',//证件号
                remark: '',//备注
            },
            formData_add:{
                select: '',
                number: '',
                type: '',
                floorArea: '',
                innerArea: '',
                address: '',
                areaRemark: '',
                longitude: '',
                latitude: '',
            },
            formData_cardDetail:{
                cardSn: '',
                cardType: '',
                cardStatus: '',
                remark: '',
            },
            dialogFormVisible_house: false,
            dialogFormVisible_door: false,
            dialogFormVisible_add: false,
            options_house: [],
            options_house_attr: [
                {}
            ],

            options_room: [],
            
            rules_add:{
                select:[
                    { required: true, message: '请选择房产类型', trigger: 'change' },
                ],
                type:[
                    { required: true, message: '请选择房屋类型', trigger: 'change' },
                ],
                number:[
                    { required: true, message: '不可为空', trigger: 'blur' },
                ],
                floorArea:[
                    {validator: checkNumber, trigger: 'blur'}
                ],
                innerArea:[
                    {validator: checkNumber, trigger: 'blur'}
                ],
                longitude:[
                    {validator: checkNumber_1000, trigger: 'blur'}
                ],
                latitude:[
                    {validator: checkNumber_1000, trigger: 'blur'}
                ],
            },
            rules_attrRoom:{
                roomNum:[
                    { required: true, message: '不可为空', trigger: 'blur' },
                ],
                floorArea:[
                    {validator: checkNumber, trigger: 'blur'}
                ],
                innerArea:[
                    {validator: checkNumber, trigger: 'blur'}
                ],
                longitude:[
                    {validator: checkNumber_1000, trigger: 'blur'},
                ],
                latitude:[
                    {validator: checkNumber_1000, trigger: 'blur'},
                ],
            },
            tableData_live: [],
            tableData_door: [],
            tableData_bindAreas: [],
            tableData_bindPerson: [],
            tableData_phoneList: [],
            tableData_equipmodel: [
                {
                    ccc:'门禁卡列表'
                }
            ],
            cur_nodeClick: {},
            cur_level: '',
            page:{
                current: 1,
                size: 20,
                total: 100
            },

            if_load_treeAgain: false,//控制是否从新渲染树数据，不知道还有没有更好的方法。。
            publish_treeData: [],
            publish_props:{
                label: 'areaName',
                children: 'childrens',
                isLeaf: 'ifLeaf'
            },
            defaultExpandedKeys: [],
        }
    },
    methods:{
        loadNodeTree(node, resolve) {
            debugger;
            if (node.level === 0) {
                debugger
                var sessionTreeDatas=JSON.parse(sessionStorage.getItem('httpData_queryAreaTree_session')),
                    expandTreeDatas=JSON.parse(sessionStorage.getItem('httpData_defaultExpandedKeys_session'));
                
                if (sessionTreeDatas) {//缓存起来；
                // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                //     msgDatas_disabled=tree_addAttr_b([sessionTreeDatas],arrayId,'disabled','areaId');
                    resolve(sessionTreeDatas) ;
                    this.defaultExpandedKeys= expandTreeDatas;
                }else{
                    this.http_getAreaTreesFunc(resolve);
                }
            }else{
                var hasChild= node.data.childrens ? 1 : 0;
                if (hasChild) {
                    // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                    //     msgDatas_disabled=tree_addAttr_b(node.data.childrens,arrayId,'disabled','areaId');
                    resolve(node.data.childrens);
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

                    // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                    //     msgDatas_disabled=tree_addAttr_b([msgDatas],arrayId,'disabled','areaId');
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
        http_queryAreaChildrens(data,resolve){
            var _this=this
             this.$get('/app/hpc-aggr/hpc/queryAreaChildrens',data)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var msgDatas=response.data.data;
                    if (msgDatas.length>0) {
                        // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                        //     msgDatas_disabled=tree_addAttr_b(msgDatas,arrayId,'disabled','areaId');
                        for(let i=0;i<msgDatas.length;i++){//房间去掉下拉按钮；
                            if(msgDatas[i].level==50){
                                msgDatas[i].ifLeaf= true;
                            }
                        }
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
        updatedTreeStatusFunc(){//更新树状图禁用状态；
            console.log('更新树状图禁用状态；');
            var _this=this;
            setTimeout(() => {
                _this.if_load_treeAgain= true;
            }, 0);
        },

        liveStatus_formatFunc(row, column, cellValue){
            if (cellValue==2) {
                return '过期'
            }else{
                return '正常'
            }
        },
        format_mobileNums(row, column, cellValue){
            return cellValue.join(',');
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
        doorCardStatus_formatFunc(row, column, cellValue){
            if (cellValue==1) {
                return '新建'
            }
            else if(cellValue==2){
                return '激活'
            }
            else if(cellValue==3){
                return '挂失'
            }
            else if(cellValue==4){
                return '注销'
            }
            else if(cellValue==5){
                return '禁用'
            }
        },
        aaaType_formatFunc(){

        },
        add_saveFunc(){
            var level=this.formData_add.select,
                parentId=this.$refs.ref_tree.getCurrentNode().areaId;
            debugger;
            if (this.formData_add.number=='' ||this.formData_add.select == '') {
                this.$message({
                    type: 'info',
                    message: '必填项不可为空'
                })
                return false;
            }

            let value= this.formData_add.longitude;
            if (value && isNaN(Number(value)) || Math.abs(Number(value)||0)>1000) {
                this.$message({
                    type: 'info',
                    message: '经度请输入有效数字值范围'
                })
                return false;
            }

            let value1= this.formData_add.latitude;
            if (value1 && isNaN(Number(value1)) || Math.abs(Number(value1)||0)>1000) {
                this.$message({
                    type: 'info',
                    message: '纬度请输入有效数字值范围'
                })
                return false;
            }

            if(level==50){
                var datas= {
                    "parentId": parentId,
                    "level": this.formData_add.select,
                    "areaName": this.formData_add.number,
                    "areaRemark": this.formData_add.areaRemark,

                    "roomNum": this.formData_add.number,
                    "roomType": this.formData_add.type,
                    "address": this.formData_add.address,
                    "floorArea": this.formData_add.floorArea,
                    "innerArea": this.formData_add.innerArea,
                    "longitude": this.formData_add.longitude,
                    "latitude": this.formData_add.latitude,
                    
                }
            }else{
                var dd=this.dynamicsData_add;
                if (dd.length>0) {
                    var dataLabels=[],dataValues=[];
                    var areaTypeCode=dd[0].areaTypeCode;
                    for (let i = 0,len=dd.length; i < len; i++) {
                        dataLabels.push(dd[i].areaAttributeLabel);
                        dataValues.push(dd[i].dataValue || '');
                        //是否必填，根据后台控制；isRequired   0否 1是必填
                        if (dd[i].isRequired==1 && dataValues[i]=='') {
                            this.$message({
                                type: 'info',
                                message: dd[i].attributeName+'输入框不可为空'
                            })
                            return false;
                        }
                        if (dd[i].attributeName=='经度') {
                            let value= dd[i].dataValue;
                            if (value && isNaN(Number(value)) || Math.abs(Number(value)||0)>1000) {
                                this.$message({
                                    type: 'info',
                                    message: dd[i].attributeName+'请输入有效数字值范围'
                                })
                                return false;
                            }
                        }
                        if (dd[i].attributeName=='纬度') {
                            let value= dd[i].dataValue;
                            if (value && isNaN(Number(value)) || Math.abs(Number(value)||0)>1000) {
                                this.$message({
                                    type: 'info',
                                    message: dd[i].attributeName+'请输入有效数字值范围'
                                })
                                return false;
                            }
                        }
                    }
                    var datas={
                        "parentId": parentId,
                        "level": this.formData_add.select,
                        "areaName": this.formData_add.number,
                        "areaRemark": this.formData_add.areaRemark,

                        "areaAttributeLabel": dataLabels,
                        "dataValues": dataValues,
                        "areaTypeCode": areaTypeCode,
                    }
                }else{
                    var datas= {
                        "parentId": parentId,
                        "level": this.formData_add.select,
                        "areaName": this.formData_add.number,
                        "areaRemark": this.formData_add.areaRemark,
                    }
                }
            }
            this.http_addSaveFunc(datas);
        },
        housetypeChanceFunc(){
            var level=this.formData_add.select;
            if (level != 50) {
                var data={
                    level: level
                }
                this.http_queryAreaProperty(data);
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
        http_addSaveFunc(datas){
            var _this=this;
            this.$post('/app/hpc-aggr/hpc/saveOrUpdateArea',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    if (datas.areaId) {
                        _this.$message({
                            type: 'success',
                            message: '保存成功'
                        })
                    }else{
                        _this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
                        _this.dialogFormVisible_add=false;
                    }
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
        attr_saveFunc(){
            var level=this.cur_level;
            debugger;
            if(level==50){
                var _this= this;
                this.$refs.ref_attrRoom.validate((valid)=>{
                    if (valid) {
                        var datas= {
                            "level": level,

                            "areaName": _this.formData_attr.roomNum,//跟roomNum一样；
                            "roomNum": _this.formData_attr.roomNum,
                            "roomType": _this.formData_attr.roomType,
                            "floorArea": _this.formData_attr.floorArea,
                            "innerArea": _this.formData_attr.innerArea,
                            "address": _this.formData_attr.address,
                            "longitude": _this.formData_attr.longitude,
                            "latitude": _this.formData_attr.latitude,
                            "areaRemark": _this.formData_attr.areaRemark,
                            
                            "areaId": _this.formData_attr.areaId
                        }
                        _this.http_addSaveFunc(datas);
                    }
                })
            }else{
                if (this.formData_attr.areaName.trim()== '') {
                    this.$message({
                        type: 'info',
                        message: '名称不可为空'
                    })
                    return false;
                }
                var dd=this.dynamicsData_attr;
                if (dd.length>0) {
                    var dataLabels=[],dataValues=[];
                    var areaTypeCode=dd[0].areaTypeCode;
                    for (let i = 0,len=dd.length; i < len; i++) {
                        dataLabels.push(dd[i].areaAttributeLabel);
                        dataValues.push(dd[i].dataValue || '');
                        //是否必填，根据后台控制；isRequired   0否 1是必填
                        if (dd[i].isRequired==1 && dataValues[i]=='') {
                            this.$message({
                                type: 'info',
                                message: dd[i].attributeName+'输入框不可为空'
                            })
                            return false;
                        }
                        if (dd[i].attributeName=='经度') {
                            let value= dd[i].dataValue;
                            if (value && isNaN(Number(value)) || Math.abs(Number(value)||0)>1000) {
                                this.$message({
                                    type: 'info',
                                    message: dd[i].attributeName+'请输入有效数字值范围'
                                })
                                return false;
                            }
                        }
                        if (dd[i].attributeName=='纬度') {
                            let value= dd[i].dataValue;
                            if (value && isNaN(Number(value)) || Math.abs(Number(value)||0)>1000) {
                                this.$message({
                                    type: 'info',
                                    message: dd[i].attributeName+'请输入有效数字值范围'
                                })
                                return false;
                            }
                        }
                    }
                    var datas={
                        "level": level,
                        "areaName": this.formData_attr.areaName,
                        "areaRemark": this.formData_attr.areaRemark,

                        "areaAttributeLabel": dataLabels,
                        "dataValues": dataValues,
                        "areaTypeCode": areaTypeCode,

                        "areaId": this.formData_attr.areaId
                    }
                }else{
                    var datas= {
                        "level": level,
                        "areaName": this.formData_attr.areaName,
                        "areaRemark": this.formData_attr.areaRemark,

                        "areaId": this.formData_attr.areaId
                    }
                }
                this.http_addSaveFunc(datas);
            }
            
        },
        delete_ztree(){
            var cur_nodeClick=this.$refs.ref_tree.getCurrentNode();
            if (cur_nodeClick) {
                var data={
                    id: cur_nodeClick.areaId
                }
                debugger;
                this.http_delete_ztree(data);
            }else{
                this.$message({
                    type: 'info',
                    message: '请选择树状图'
                })
            }
        },
        http_delete_ztree(data){
            var _this=this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post('/app/hpc-aggr/hpc/deleteArea',data)
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
            console.log(aa);
            var level= aa.level;
            this.cur_level=level;
            this.formData_attr.areaId= aa.areaId;
            debugger;
            
        
            var data={
                areaId: aa.areaId
            }
            this.http_queryAreaInfo(data);

            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                areaId : aa.areaId,
            }
            this.http_getAreaCardPageList(datas);
            this.http_getAreaPersonPageList(datas);
        },
        http_getAreaCardPageList(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/getAreaCardPageList',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    _this.tableData_door= response.data.data.records;
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
        http_getAreaPersonPageList(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/getAreaPersonPageList',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var msgDatas= response.data.data.records
                    _this.tableData_live= msgDatas;
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
        http_queryAreaInfo(data){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryAreaInfo',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    debugger;
                    _this.formData_attr= response.data.data;
                    _this.formData_attr.levelToHouseType= _this.levelToHouseTypeFunc(response.data.data.level);
                    debugger;
                    _this.dynamicsData_attr= response.data.data.properties;
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
            if (!value) 
                return true;
            debugger;
            return data.areaName.indexOf(value) !== -1;
        },
        ztree_render(h, { node, data, store }) {
            // debugger;
            if (data.level==50) {
                return (
                    <span>
                        <span class="curColor">{node.label}</span>
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
        detailRowFunc_liveList(index, scope){
            console.log('detailRowFunc');
            this.dialogFormVisible_house=true;

            debugger;
            var datas={
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                personInfoId : scope.row.personInfoId,
            }
            this.formData_house={
                name: scope.row.personName,
                type: scope.row.certificateType,
                number: scope.row.certificateNo,
                remark: scope.row.remark,
            }
            this.http_getLiveDetailFunc(datas);
        },
        detailRowFunc_door(index, scope){
            console.log('detailRowFunc');
            this.dialogFormVisible_door=true;
            this.tableData_bindPerson= [];
            this.tableData_bindAreas= [];

            debugger;
            var datas={
                cardId : scope.row.cardId,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2'
            }
            this.http_getDoorCardDetailFunc(datas);
        },
        http_getLiveDetailFunc(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryManagementPersonInfoById',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var msg=response.data.data;
                    _this.tableData_phoneList=msg;
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
        http_getDoorCardDetailFunc(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryCardInfoAndPersonAndAreaById',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    var msg=response.data.data;
                    _this.formData_cardDetail={
                        cardSn: msg.cardSn,
                        cardType: msg.cardType,
                        cardStatus: msg.cardStatus,
                        remark: msg.areaRemark,
                    }
                    _this.tableData_bindPerson= [msg.bindPerson];
                    _this.tableData_bindAreas= msg.bindAreas;
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

        http_queryAllowableAreaType(data){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryAllowableAreaType',data)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    if (response.data.data.length>0) {
                        _this.dialogFormVisible_add=true;
                        _this.options_house=response.data.data;
                        _this.formData_add={
                            select: '',
                            number: '',
                            type: '',
                            floorArea: '',
                            innerArea: '',
                            address: '',
                            areaRemark: '',
                            longitude: '',
                            latitude: '',
                        }
                        _this.dynamicsData_add= [];
                    }else{
                        _this.$message({
                            type: 'info',
                            message: '此节点不可添加'
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
        http_queryAreaRoomTypes(){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryAreaRoomTypes')
            .then(function (response) {
                if (response.data.code==0) {
                    debugger;
                    console.log('queryAreaRoomTypes')
                    _this.options_room=response.data.data;
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
        http_queryAreaProperty(data){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/queryAreaTypeProperty',data)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    _this.dynamicsData_add=response.data.data;
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
    watch: {
        ztree_filterText(val) {
            this.$refs.ref_tree.filter(val);
        }
    },
    created() {
        this.if_load_treeAgain= true;
        this.http_queryAreaRoomTypes();
    },
}
</script>


