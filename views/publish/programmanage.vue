<template>
    <div>
        <div class="f-header">
            <el-row>
            <el-col :span="6">
                <label>节目单名称：</label>
                <el-input clearable placeholder="请输入查询内容" size="small" v-model="head_programName"></el-input>
            </el-col>
            <el-col :span="10">
                <label>添加时间：</label>
                <el-date-picker
                    v-model="value_add_time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH-mm-ss"
                    size="small">
                </el-date-picker>
            </el-col>
            <el-col :span="6">
                <label>模版名称：</label>
                <el-input clearable placeholder="请输入查询内容" size="small" v-model="head_modelName"></el-input>
            </el-col>
            
            </el-row>

            <el-row>
                <el-col :span="6">
                    <label>设备类型：</label>
                    <el-select clearable v-model="head_equipmentSize" placeholder="请选择" size="small" @change="selectFunc">
                        <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <label>发布时间：</label>
                    <el-date-picker
                        v-model="value_public_time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH-mm-ss"
                        size="small">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" round size="small" @click="queryProgramFunc">查询</el-button>
                    <el-button round size="small"  @click="resetFunc">重置</el-button>
                </el-col>
            </el-row>

            <el-row class="btnBox">
            <el-col :span="6">
                <el-button type="primary" round size="small" @click="addFunc()">添加</el-button>
            </el-col>
            </el-row>
        </div>

        <div class="f-contain">
            <el-table
                ref="multipleTable"
                :data="tableData_program"
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
                    label="节目单名称"
                    prop="programName">
                </el-table-column>
                <el-table-column
                    label="设备类型"
                    prop="equipmentSize"
                    width="120">
                </el-table-column>
                <el-table-column
                    label="模版名称"
                    prop="templateName"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="creatorName"
                    label="添加人"
                    width="120"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="添加时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="promulgator"
                    label="发布人"
                    width="120"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="promulgateTime"
                    label="发布时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    width="120"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="publishRowFunc(scope.$index, scope)"
                            type="text"
                            size="small">
                            发布
                        </el-button>
                        <el-button
                            @click.native.prevent="detailRowFunc(scope.$index,scope)"
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
        <!-- 添加_add -->
        <el-dialog title="添加" :visible.sync="dialogFormVisible_add" width="800px">

            <div class="m_dialogMain">
                <div class="box">
                    <el-table
                        ref="ref_AA"
                        :data="tableData_AA"
                        style="width: 100%"
                        border
                        size="mini"
                        highlight-current-row
                        @current-change="handleCurrentChange_AA">
                        
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            label="设备类型"
                            prop="equipmentSize">
                        </el-table-column>
                        <el-table-column
                            label="模版名称"
                            prop="templateName">
                        </el-table-column>
                        <el-table-column
                            label="节目单名称"
                            prop="programName">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="150">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="addNext_save_AAFunc(scope)"
                                    type="text"
                                    size="small">
                                    添加节目单
                                </el-button>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                </div>
            </div>
             <div slot="footer" class="dialog-footer">
                <div>
                    <!-- <el-button round size="small" @click="addNext_save_AAFunc">下一步</el-button> -->
                    <el-button type="danger" round size="small" @click="dialogFormVisible_add=false">关闭</el-button>
                </div>
            </div>
            <!-- dialog_BB -->
            <el-dialog 
                title="添加" 
                :visible.sync="dialogFormVisible_add_BB"
                ref="ref_BB" 
                width="800px"
                append-to-body>
                <div class="m_dialogHead">
                    <el-form :model="formData_BB" :rules="rules_BB" size="small" ref="refForm_BB">
                        <el-form-item label="节目单名称：" prop="name" :label-width="formLabelWidth">
                            <el-input clearable maxlength="20" v-model="formData_BB.name" placeholder="请输入节目单名称"></el-input>
                            <span class="m_form_rightInfo">{{formData_BB.name.trim().length}}/20</span>
                        </el-form-item>
                        
                        <el-form-item label="备   注：" prop="textarea" :label-width="formLabelWidth">
                            <el-input clearable type="textarea" v-model="formData_BB.textarea" placeholder="请在此输入内容"></el-input>
                        </el-form-item>
                    </el-form>
                    <ul class="tabsBox">
                        <li v-for="item in bannerData" :key="item.bannerId" :class=" (item.bannerType==curBanner) ? 'cur' : '' " @click="bannerFunc(item.bannerType)" v-text="item.bannerName"></li>
                    </ul>
                    <el-row v-show="tabs_bool_BB==1">
                        <el-col :span="12">
                            <label>播放模式：</label>
                            <el-select clearable v-model="value_BB" placeholder="请选择" size="small" @change="selectBB_Func">
                                <el-option v-for="item in options_BB"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                         <el-col :span="12">
                            <label>图片播放时长：</label>
                            <el-input clearable placeholder="请输入查询内容" size="small" v-model="time_BB" class="time_BB"></el-input>
                            <label>秒</label>
                        </el-col>
                    </el-row>
                    <div>
                        <el-button type="primary" round size="small" @click="BB_addFunc()">添加</el-button>
                    </div>
                </div>
                <div class="m_dialogMain">
                    <div class="box" v-show="tabs_bool_BB==1">
                        <el-table
                            ref="ref_BB_media"
                            :data="tableData_BB_media"
                            style="width: 100%"
                            border
                            size="mini">
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
                                :formatter="format_resourceType"
                                prop="resourceType">
                            </el-table-column>
                            <el-table-column
                                label="视频时长"
                                prop="duration">
                            </el-table-column>
                            <el-table-column
                                label="分辨率"
                                prop="fenbianlv">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="deleteRow_BB_Func(scope.$index, scope)"
                                        type="text"
                                        size="small"
                                        class="btnDel">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="box" v-show="tabs_bool_BB==2">
                        <el-table
                            ref="ref_BB_notice"
                            :data="tableData_BB_notice"
                            style="width: 100%"
                            border
                            size="mini">
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                label="资源名称"
                                width="307"
                                prop="resourceName">
                            </el-table-column>
                            <el-table-column
                                label="资源类型"
                                width="200"
                                :formatter="format_resourceType"
                                prop="resourceType">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-button
                                        @click.native.prevent="deleteRow_BB_Func(scope.$index, scope)"
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
                        <el-button round size="small" @click="dialogFormVisible_add_BB=false">上一步</el-button>
                        <el-button type="primary" round size="small" @click="addSaveFunc_BB">保存</el-button>
                        <el-button type="danger" round size="small" @click="dialogFormVisible_add_BB=false">关闭</el-button>
                    </div>
                </div>

                 <!-- dialog_CC -->
                <el-dialog 
                    title="添加" 
                    :visible.sync="dialogFormVisible_add_CC"
                    ref="ref_CC" 
                    width="800px"
                    append-to-body>
                    <div class="m_dialogHead">
                        <el-row>
                            <el-col :span="12">
                                <label>资源名称：</label>
                                <el-input clearable placeholder="请输入查询内容" size="small" v-model="resourseName_CC"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <label>资源类型：</label>
                                <el-select :disabled="curBanner==3" clearable v-model="resourseType_CC" placeholder="请选择" size="small" @change="selectCC_Func">
                                    <el-option v-for="item in options_CC"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    v-if="item.banner==curBanner">
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
                    </div>
                    <div class="m_dialogMain">
                        <div class="box" v-show="tabs_bool_BB==1">
                            <el-table
                                ref="ref_CC"
                                :data="tableData_CC_media"
                                style="width: 100%"
                                border
                                @selection-change="selectionChangeFunc_CC_media"
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
                                    :formatter="format_resourceType"
                                    prop="resourceType">
                                </el-table-column>
                                <el-table-column
                                    label="视频时长"
                                    prop="duration">
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
                        <div class="box" v-show="tabs_bool_BB==2">
                            <el-table
                                ref="ref_CC"
                                :data="tableData_CC_notice"
                                style="width: 100%"
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
                                    :formatter="format_resourceType"
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
                                        @size-change="pageSizeChangeFunc_BB_CC_media"
                                        @current-change="pageChangeFunc_BB_CC_media"
                                        :current-page="page.current"
                                        :page-sizes="[20, 50, 100, 200]"
                                        :page-size="page.size_CC_media"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="page.total_BB_CC_media">
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
        </el-dialog>
        <!-- 发布_publish -->
        <el-dialog title="发布节目单" :visible.sync="dialogFormVisible_publish" width="720px"  @close="closeDialogFunc">
            <div class="m_dialogHead">
                <h3 class="m_borderLeft_title">选择发布区域：</h3>
                <p style="color:#999;">提示:当前节目单发布后，会自动覆盖掉所选区域之前发布过的节目单，请谨慎操作。</p>
            </div>
            
            <div class="m_dialogMain">
                <div class="box">
                    <el-tree
                        v-if="if_load_treeAgain"
                        :data="publish_treeData"
                        :props="publish_props"
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
             <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="publish_saveFunc">发布</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_publish=false">关闭</el-button>
                </div>
            </div>
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
                        node-key="id"
                        @setChecked="setCheckedFunc">
                    </el-tree>
                </div>
            </div>
            </div>
            <div class="m_article">
                <div class="m_dialogHead">
                    <ul class="tabsBox">
                        <li v-for="item in detail_bannerData" :key="item.bannerType" :class=" (item.bannerType==detail_curBanner) ? 'cur' : '' " @click="detail_bannerFunc(item.bannerType)" v-text="item.bannerName"></li>
                        <!-- <li :class="tabs_bool_detail==1? 'cur' : '' " @click="tabs_bool_detail=1">图片视频栏目</li>
                        <li :class="tabs_bool_detail==2? 'cur' : '' " @click="tabs_bool_detail=2">公告文本栏目</li> -->
                    </ul>
                    <el-row v-show="tabs_bool_detail==1" style="height:20px;">
                        <el-col :span="12">
                            <label>播放模式：</label>
                            <span>循环轮播</span>
                        </el-col>
                         <el-col :span="12">
                            <label>图片播放时长：</label>
                            <span>{{imageRunningTime}} s</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="m_dialogMain">
                    <div class="box" v-show="tabs_bool_detail==1">
                        <el-table
                            ref="ref_BB_media_detail"
                            :data="tableData_BB_media_detail"
                            style="width: 100%"
                            border
                            size="mini">
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
                                :formatter="format_resourceType"
                                prop="resourceType">
                            </el-table-column>
                            <el-table-column
                                label="视频时长"
                                prop="duration">
                            </el-table-column>
                            <el-table-column
                                label="分辨率"
                                prop="fenbianlv">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="box" v-show="tabs_bool_detail==2">
                        <el-table
                            ref="ref_BB_notice_detail"
                            :data="tableData_BB_notice_detail"
                            style="width: 100%"
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
                                :formatter="format_resourceType"
                                prop="resourceType">
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
        .time_BB{
            width: 60px;
        }
        .el-date-editor.el-input__inner{
            width: 280px;
        }
    }   
}    
.m_dialogMain{
    .box{
        margin: 15px 30px;
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
.el-form{
    margin-right: 60px;
}
</style>
<script>
// const defaultCheckedKeys=[];
// function treeForEachFunc(node){
//     debugger;
//     if(node.children && node.children.length>0){
//         debugger;
//         for(var i=0,len=node.children.length;i<len;i++){
//             debugger;
//             if (node.children[i].checked) {
//                 defaultCheckedKeys.push(node.children[i].id)
//             }
//             treeForEachFunc(node.children[i])
//         }
//     }
//     return defaultCheckedKeys;
// }
import {tree_arrayToAttrArray_childrens , tree_addAttr_b} from '@/utils/common.js';
export default {
    data(){
        return {
            head_programName: '',
            head_modelName: '',
            head_equipmentSize: '',
            value_add_time: '',
            value_public_time: '',
            formLabelWidth: '120px',
            tabs_bool_BB: 1,
            tabs_bool_detail: 1,
            time_BB: 15,
            time_CC: '',
            bannerData: [],
            detail_bannerData: [],
            templateId: '',
            curBanner: '1',//
            detail_curBanner: '1',
            imageRunningTime: '',
            formData_BB:{
                name: '',
                textarea: ''
            },
            formData_CC:{
                name: '',
                textarea: ''
            },
            resourseName_CC: '',
            resourseType_CC: '',
            selectionData_CC_media: [],
            selectionData_CC_notice: [],
            value_BB: '1',
            options_BB: [{
                value: '1',
                label: '循环播放'
                }],
            options_CC: [{
                value: '3',
                label: '公告',
                banner: '3'
                }, {
                value: '2',
                label: '图片',
                banner: '1'
                }, {
                value: '1',
                label: '视频',
                banner: '1'
            }],

            rules_BB:{
                name:[
                    { required: true, message: '请输入节目单名称', trigger: 'blur' },
                    {mix: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}

                ]
            },
            rules_CC:{
                name:[
                    { required: true, message: '请输入节目单名称', trigger: 'blur' },
                ]
            },
            tableData_program: [
                // {
                //     programName: '节目单名称',
                //     equipmentSize: '设备类型',
                //     templateName: '模版名称',
                //     creatorName: '添加人',
                //     createTime: '2018-07-02',
                //     promulgator: '发布人',
                //     promulgateTime: '发布时间',
                //     remark: '备注备注',
                // }
            ],
            tableData_AA: [
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'模版模版',
                //     id:'id_01'
                // },
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'模版模版',
                //     id:'id_02'
                // }
            ],
            tableData_BB_media: [
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'模版模版',
                //     dd:'1980*1080',
                // },
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'模版模版',
                //     dd:'1980*1080',
                // }
            ],
            tableData_BB_media_detail: [
            ],
            tableData_BB_notice_detail: [
            ],
            tableData_BB_notice: [
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                // },
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                // }
            ],
            tableData_CC_media: [
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'10s',
                //     dd:'2018-06-29',
                //     ee:'管理人员',
                // },
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'10s',
                //     dd:'2018-06-29',
                //     ee:'管理人员',
                // }
            ],
            tableData_CC_notice: [
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'2018-06-29',
                //     dd:'管理员',
                // },
                // {
                //     aa:'节目单名称',
                //     bb:'设备类型',
                //     cc:'2018-06-29',
                //     dd:'管理员',
                // }
            ],
            publish_treeData: [],
            detail_treeData: [],
            aaa:[
                 {
                    aaa: '一级 1',
                    subs: [{
                            aaa: '二级 1-1',
                            subs: [{
                            aaa: '三级 1-1-1'
                        }]
                    }]
                }
            ],
            detail_props:{
                label: 'areaName',
                children: 'childrens'
            },
            publish_props:{
                label: 'areaName',
                children: 'childrens'
            },
            curProgramId: '',
            page:{
                current: 1,
                size: 20,
                size_CC_media: 20,
                size_CC_notice: 20,
                total: 0,
                total_BB_CC_media: 0,
            },
            options: [{
                value: '13',
                label: '13寸'
            }, {
                value: '19',
                label: '19寸'
            }],
            if_load_treeAgain: false,//控制是否从新渲染树数据，不知道还有没有更好的方法。。
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            dialogFormVisible_add: false,
            dialogFormVisible_add_BB: false,
            dialogFormVisible_add_CC: false,
            dialogFormVisible_publish: false,
            dialogFormVisible_detail: false,

        }
    },
    methods:{
        selectFunc(){

        },
        selectBB_Func(){

        },
        closeDialogFunc(){
            console.log('closeDialogFunc');
            this.if_load_treeAgain= false;
        },
        format_resourceType(row, column, cellValue, index){
          if (cellValue==1) {//
              return '视频'
          }else if(cellValue==2){
              return '图片'
          }else{
              return '公告'
          }
      },
        resetFunc(){
            this.head_programName='';
            this.value_add_time='';
            this.head_modelName='';
            this.head_equipmentSize='';
            this.value_public_time='';
        },
        resetFunc_CC(){
            this.resourseName_CC='';
            this.resourseType_CC='';
            this.time_CC='';
        },
        bannerFunc(bannerType){
            this.curBanner=bannerType;
            if (this.curBanner=='1') {
                this.tabs_bool_BB=1;
            }
            if (this.curBanner=='3') {
                this.tabs_bool_BB=2;
            }
        },
        detail_bannerFunc(bannerType){
            this.detail_curBanner=bannerType;
            if (this.detail_curBanner=='1') {
                this.tabs_bool_detail=1;
            }
            if (this.detail_curBanner=='3') {
                this.tabs_bool_detail=2;
            }
        },
        selectCC_Func(){

        },
        queryProgramFunc(){
            debugger;
            var add_time=this.value_add_time,
                public_time= this.value_public_time,
                data={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    programName: this.head_programName,
                    equipmentSize: this.head_equipmentSize,
                    addStartTime: add_time ? this.value_add_time[0] : '',
                    addEndTime: add_time ? this.value_add_time[1] : '',
                    promulgateStartTime: public_time ? this.value_public_time[0] : '',
                    promulgateEndTime: public_time ? this.value_public_time[1] : '',
                    templateName: this.head_modelName,
                }
            this.http_programTableFunc(data);
        },
        queryResourseFunc_CC(){
            var time_CC= this.time_CC,
                data={
                pageNum: this.page.current,
                pageSize: this.page.size,
                resourceType: this.resourseType_CC || '12',
                resourceName: this.resourseName_CC,
                startTime: time_CC ? this.time_CC[0] : null,
                endTime: time_CC ? this.time_CC[1] : null,
            }
            debugger;
            this.http_resourceTableFunc(data);
        },

        http_programTableFunc(data){
            var _this=this;
                this.$get('/app/content-aggr/content/showProgramPage',data)
                .then(function (response) {
                    console.log(response);
                    if (response.data.code==0) {
                        _this.tableData_program=response.data.data.records;
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
        addFunc(){
            console.log('addFunc');
            this.dialogFormVisible_add=true;
            this.http_addFunc();
        },
        http_addFunc(){
            var _this=this;
            this.$get('/app/content-aggr/content/queryEquipmentTypeTemplateProgram')
            .then((response)=> {
                console.log(response);
                var datas=response.data.data , items=[];
                for (let i = 0,len=datas.length; i < len; i++) {
                    var data=datas[i];
                    var item={
                        equipmentSize: data.equipmentSize,//	       设备类型名称
                        equipmentTypeId:  data.equipmentTypeId,//  设备类型id
                        programId: 	 data.programId,//      节目单id
                        programName: data.programName,//	       节目单名称
                        templateId: data.templateId,	//       模版id
                        templateName: data.templateName,//	       模版名称
                    }
                    items.push(item);
                }
                _this.tableData_AA=items;

            })
            .catch((error)=>{
                console.log(error);
            })
        },
        BB_addFunc(){
            this.dialogFormVisible_add_CC=true;
            
            var resourceType='';
            this.curBanner=='1'? (resourceType='12'):(resourceType='3');
            debugger;
            if (this.curBanner==3) {
                this.resourseType_CC= '3';
            }
            console.log('BB_addFunc');
            var data={
                pageNum: 1,
                pageSize: 20,
                resourceType: resourceType
            }
            this.http_resourceTableFunc(data);
        },
        publishRowFunc(index, scope){
            console.log('publishRowFunc');
            this.dialogFormVisible_publish=true;
            
            debugger
            this.curProgramId=scope.row.programId;
            var datas={
                programId:scope.row.programId
            }
            this.http_getCheckAreaTreesFunc(datas);
        },
        loadNodeTree(node, resolve) {
            if (node.level === 0) {
                debugger
                var sessionTreeDatas=JSON.parse(sessionStorage.getItem('httpData_queryAreaTree_session')),
                    expandTreeDatas=JSON.parse(sessionStorage.getItem('httpData_defaultExpandedKeys_session'));
                
                if (sessionTreeDatas) {//缓存起来；
                var arrayId= JSON.parse(sessionStorage.getItem('defaultCheckedKeys_session')),
                    msgDatas_disabled=tree_addAttr_b([sessionTreeDatas],arrayId,'disabled','areaId');
                    resolve(msgDatas_disabled) ;
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
                        var arrayId= JSON.parse(sessionStorage.getItem('defaultCheckedKeys_session')),
                            msgDatas_disabled=tree_addAttr_b(node.data.childrens,arrayId,'disabled','areaId');
                        resolve(msgDatas_disabled);
                    }else{
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
                    
                    _this.defaultExpandedKeys= tree_arrayToAttrArray_childrens(msgDatas,'areaId');
                    sessionStorage.setItem('httpData_queryAreaTree_session',JSON.stringify(msgDatas));
                    sessionStorage.setItem('httpData_defaultExpandedKeys_session',JSON.stringify(_this.defaultExpandedKeys));

                    var arrayId= JSON.parse(sessionStorage.getItem('defaultCheckedKeys_session')),
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
        http_getCheckAreaTreesFunc(datas){
            var _this=this
             this.$get('/app/content-aggr/content/queryAreaByProgramId',datas)
            .then(function (response) {
                if (response.data.code== 0) {
                    debugger
                    _this.defaultCheckedKeys=response.data.data;
                    _this.if_load_treeAgain= true;
                    sessionStorage.setItem('defaultCheckedKeys_session',JSON.stringify(_this.defaultCheckedKeys));
                }else{
                    _this.$message({
                        type: 'info',
                        message: response.data.msg
                    })
                }
                
                // _this.http_getAreaTreesFunc();
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
                        var arrayId= JSON.parse(sessionStorage.getItem('defaultCheckedKeys_session')),
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
        http_detailResourceFunc(datas){
            var _this=this
             this.$get('/app/content-aggr/content/queryProgramColumnResourceByProgramId',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var datas=response.data.data,
                        items=[];
                        debugger;
                    for (let i = 0,len=datas.length; i < len; i++) {
                        var data=datas[i].programColumn;
                        var item={
                            bannerName:	data.columnName,//控件名称
                            bannerType:	data.bannerId//控件类型,'1'为视图控件，'3'为公告控件
                        }
                        items.push(item);
                        _this.detail_curBanner=datas[0].programColumn.bannerId;
                        if (_this.detail_curBanner=='1') {
                            _this.tabs_bool_detail=1;
                        }
                        if (_this.detail_curBanner=='3') {
                            _this.tabs_bool_detail=2;
                        }
                        if (data.bannerId==1) {
                            var resourcesDatas=datas[i].resources;
                            _this.imageRunningTime=data.imageRunningTime;
                            for (let t = 0,len=resourcesDatas.length; t < len; t++) {
                                if(resourcesDatas[t].resourceType==2){
                                    resourcesDatas[t].fenbianlv=resourcesDatas[t].imageWidth+'x'+resourcesDatas[t].imageHeight;
                                }else{
                                    resourcesDatas[t].fenbianlv=resourcesDatas[t].videoWidth+'x'+resourcesDatas[t].videoHeight;
                                }
                                
                            }
                            _this.tableData_BB_media_detail=resourcesDatas;
                        }
                        if (data.bannerId==3) {
                            _this.tableData_BB_notice_detail=datas[i].resources;
                        }
                    }
                    debugger
                    _this.detail_bannerData=items;
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
             this.$get('/app/content-aggr/content/queryProgramAreaTree',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var msgDatas= response.data.data
                    if (msgDatas) {
                        _this.detail_treeData=[msgDatas];
                    }else{
                        _this.detail_treeData= [];
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
        detailRowFunc(index, scope){
            console.log('detailRowFunc');
            this.dialogFormVisible_detail=true;

            // this.detail_treeData=this.aaa;
            var datas={
                programId: scope.row.programId
            }
            debugger;
            this.http_detailResourceFunc(datas);
            this.http_detailTreeDataFunc(datas);
        },
        addNext_saveFunc(type){

        },
        handleCurrentChange_AA(val){
            console.log(val);
        },
        selectionChangeFunc_CC_media(selection){
            console.log('selectionChangeFunc_CC_media');
            this.selectionData_CC_media=selection;
            // debugger;
        },
        selectionChangeFunc_CC_notice(selection){
            console.log('selectionChangeFunc_CC_notice');
            this.selectionData_CC_notice=selection;
            // debugger;
        },
        deleteRow_BB_Func(index,data){
            debugger;
            if(this.tabs_bool_BB==1){
                this.tableData_BB_media.splice(index,1)
            }
            if(this.tabs_bool_BB==2){
                this.tableData_BB_notice.splice(index,1)
            }
        },
        addNext_save_AAFunc(scope){
            // debugger;
            var templateId=scope.row.templateId;
            this.templateId=templateId;
            console.log('addNext_save_AAFunc');
            var data={
                templateId: templateId
            }
            this.http_addNext_save_AAFunc(data);

            this.tableData_BB_media=[];
            this.tableData_BB_notice=[];

        },
        http_addNext_save_AAFunc(data){
            var _this=this;
            this.$get('/app/content-aggr/content/findTemplateBannerByTemplateId',data)
            .then((response)=> {
                console.log(response);
                if (response.data.code==0) {
                    this.dialogFormVisible_add_BB=true;
                    debugger;
                    var msgDatas=response.data.data , items=[];
                    for (let i = 0,len=msgDatas.length; i < len; i++) {
                        var data=msgDatas[i];
                        var item={
                            bannerId: data.bannerId,//	 控件id
                            bannerName:	data.bannerName,//控件名称
                            bannerType:	data.bannerType//控件类型,'1'为视图控件，'3'为公告控件
                        }
                        items.push(item);
                        this.curBanner=msgDatas[0].bannerType;
                        if (this.curBanner=='1') {
                            this.tabs_bool_BB=1;
                        }
                        if (this.curBanner=='3') {
                            this.tabs_bool_BB=2;
                        }
                    }
                    _this.bannerData=items;
                }else{
                    _this.$message({
                        type: 'info',
                        message: response.data.msg
                    })
                }
                

            })
            .catch((error)=>{
                console.log(error);
            })
        },
        http_resourceTableFunc(data){
            var _this=this;
            var resourceType=data.resourceType;
            this.$get('/app/content-aggr/content/showResourcePage',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    debugger
                    var tableData_resource=response.data.data.records;
                    if (resourceType==3) {
                        _this.tableData_CC_notice=tableData_resource;
                    }else{
                        _this.tableData_CC_media=tableData_resource;
                        
                    }
                    _this.page.total_BB_CC_media= response.data.data.total;
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
        addSaveFunc_BB(){
            console.log('addSaveFunc_BB');
            
            var programName= this.formData_BB.name,
                remark= this.formData_BB.textarea,
                templateId= this.templateId,
                creatorId= sessionStorage.getItem('session_userId'),
                orgId= sessionStorage.getItem('session_userId'),
                creatorName= sessionStorage.getItem('session_username');
            debugger;
            var mediaData=this.tableData_BB_media,
                noticeData=this.tableData_BB_notice,
                resourceId_media=[],
                resourceId_notice=[];
            var bannerData=this.bannerData, 
                resourceIds=[],
                columns=[];
            for (let j = 0,len=bannerData.length; j < len; j++) {
                if(bannerData[j].bannerType==1){
                    if (mediaData.length==0) {
                        this.$message({
                            type: 'info',
                            message: '请添加视图控件资源'
                        })
                        return false;
                    }
                    for (let m = 0,len=mediaData.length; m < len; m++) {
                        resourceId_media.push(mediaData[m].resourceId);
                    }
                    var obj={
                        "bannerId": bannerData[j].bannerId,
                        "columnName": bannerData[j].bannerName,
                        "imageRunningTime": this.time_BB,
                        "playMode": 1,
                        "resourceIds": resourceId_media
	                }
                    columns.push(obj);
                }
                if (bannerData[j].bannerType==3) {
                    if (noticeData.length==0) {
                        this.$message({
                            type: 'info',
                            message: '请添加公告控件资源'
                        })
                        return false;
                    }
                    for (let n = 0,len=noticeData.length; n < len; n++) {
                        resourceId_notice.push(noticeData[n].resourceId);
                    }
                    var obj={
                        "bannerId": bannerData[j].bannerId,
                        "columnName": bannerData[j].bannerName,
                        "imageRunningTime": this.time_BB,
                        "playMode": 1,
                        "resourceIds": resourceId_notice
	                }
                    columns.push(obj);
                }
            } 
            var datas={
                    "columns": columns,
                    "creatorId": creatorId,
                    "creatorName": creatorName,//"创建者名称",
                    "orgId": orgId,
                    "programName": programName,//"节目单名称",
                    "remark": remark,//"备注",
                    "templateId": templateId
            }
            this.http_addSaveFunc_BB(datas);
        },
        http_addSaveFunc_BB(datas){
            var _this=this;
            this.$post('/app/content-aggr/content/addProgram',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                     _this.$message({
                        message:'新增节目单成功',
                        type: 'success'
                    })
                    _this.dialogFormVisible_add_BB= false;
                    var data={
                        pageNum: 1,
                        pageSize: 20
                    }
                    _this.http_programTableFunc(data);
                }else{
                     _this.$message({
                        message:response.data.msg,
                        type: 'info'
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        addSaveFunc_CC(){
            console.log('addSaveFunc_CC');
            if (this.tabs_bool_BB==1) {
                // debugger;
                var datas=this.selectionData_CC_media;
                for (let i = 0,len=datas.length; i < len; i++) {
                    if (datas[i].resourceType==1) {
                        // debugger;
                        datas[i].fenbianlv=datas[i].videoWidth+'x'+datas[i].videoHeight;
                    }
                    if (datas[i].resourceType==2) {
                        // debugger;
                        datas[i].fenbianlv=datas[i].imageWidth+'x'+datas[i].imageHeight;
                    }
                    
                }
                
                this.tableData_BB_media=datas;
            }
            if (this.tabs_bool_BB==2) {
                this.tableData_BB_notice=this.selectionData_CC_notice;
            }
            this.dialogFormVisible_add_CC=false;
        },
        publish_saveFunc(){
            console.log('publish_saveFunc');
            var checkedKeys=this.$refs.ref_tree.getCheckedKeys(),
                defaultChecked=JSON.parse(sessionStorage.getItem('defaultCheckedKeys_session')),
                add_checkedKeys= [];

            if (checkedKeys.length<1) {
                this.$message({
                    type: 'info',
                    message: '请选择发布区域'
                });
                return false;
            }
            
            checkedKeys.forEach((item)=>{
                if (defaultChecked.indexOf(item)<0) {
                    add_checkedKeys.push(item);
                }
            });

            if (add_checkedKeys.length<1) {
                this.$message({
                    type: 'info',
                    message: '没有新增区域'
                });
                return false;
            }
            debugger;
            var datas={
                "areaIds": add_checkedKeys,
                "programId": this.curProgramId,
                "promulgator": sessionStorage.getItem('session_username'),
                "promulgatorId": sessionStorage.getItem('session_userId')
            }
            this.http_publish_saveFunc(datas);
        },
        http_publish_saveFunc(datas){
            var _this=this;
            this.$post('/app/content-aggr/content/publishProgram',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    _this.$message({
                        message:'节目单发布成功',
                        type: 'success'
                    })
                    _this.dialogFormVisible_publish= false;
                    var add_time=_this.value_add_time,
                        public_time= _this.value_public_time,
                        ddd={
                            pageNum: _this.page.current,
                            pageSize: _this.page.size,
                            programName: _this.head_programName,
                            equipmentSize: _this.head_equipmentSize,
                            addStartTime: add_time ? _this.value_add_time[0] : '',
                            addEndTime: add_time ? _this.value_add_time[1] : '',
                            promulgateStartTime: public_time ? _this.value_public_time[0] : '',
                            promulgateEndTime: public_time ? _this.value_public_time[1] : '',
                            templateName: _this.head_modelName,
                        }
                    _this.http_programTableFunc(ddd);
                }else{
                    _this.$message.error('节目单发布失败')
                }
                debugger;
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        setCheckedFunc(key, checked, deep) {
            debugger;
        },
        getCheckedNodesFunc(key, checked, deep) {
            debugger;
        },
        treeFunc(key, checked, deep) {
            debugger;
        },
        pageChangeFunc(val){
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var add_time=this.value_add_time,
                public_time= this.value_public_time,
                data={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    programName: this.head_programName,
                    equipmentSize: this.head_equipmentSize,
                    addStartTime: add_time ? this.value_add_time[0] : '',
                    addEndTime: add_time ? this.value_add_time[1] : '',
                    promulgateStartTime: public_time ? this.value_public_time[0] : '',
                    promulgateEndTime: public_time ? this.value_public_time[1] : '',
                    templateName: this.head_modelName,
                }
            this.http_programTableFunc(data);
        },
        pageSizeChangeFunc(val){
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var add_time=this.value_add_time,
                public_time= this.value_public_time,
                data={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    programName: this.head_programName,
                    equipmentSize: this.head_equipmentSize,
                    addStartTime: add_time ? this.value_add_time[0] : '',
                    addEndTime: add_time ? this.value_add_time[1] : '',
                    promulgateStartTime: public_time ? this.value_public_time[0] : '',
                    promulgateEndTime: public_time ? this.value_public_time[1] : '',
                    templateName: this.head_modelName,
                };
            this.http_programTableFunc(data);
        },
        pageChangeFunc_BB_CC_media(val){
            console.log(`当前页: ${val}`);
            this.page.current= val;

            var resourceType='';
            this.curBanner=='1'? (resourceType='12'):(resourceType='3')
            console.log('BB_addFunc');
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size_CC_media,
                resourceType: resourceType
            }
            this.http_resourceTableFunc(data);
        },
        pageSizeChangeFunc_BB_CC_media(val){
            console.log(`每页 ${val} 条`);
            this.page.size_CC_media= val;

            var resourceType='';
            this.curBanner=='1'? (resourceType='12'):(resourceType='3')
            console.log('BB_addFunc');
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size_CC_media,
                resourceType: resourceType
            }
            this.http_resourceTableFunc(data);
        },

    },
    created() {
        var data={
            pageNum: this.page.current,
            pageSize: this.page.size
        }
    this.http_programTableFunc(data);
    },

}
</script>


