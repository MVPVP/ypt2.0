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
                    <el-select clearable v-model="headInput.appType" placeholder="请选择" size="small" @change="head_selectFunc">
                        <el-option v-for="item in option_appType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label>应用编码：</label>
                    <el-select clearable v-model="headInput.appEncode" placeholder="请选择" size="small" @change="head_selectFunc">
                        <el-option v-for="item in option_appEncodes"
                        :key="item.appInfoId"
                        :label="item.appEncode"
                        :value="item.appEncode">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label style="width:120px;">适用设备型号：</label>
                    <el-select clearable multiple v-model="headInput.equipmentModel" placeholder="请选择" size="small" @change="head_selectFunc">
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
        </div>
        
        <div class="f-contain">
            <div class="box">
                <div class="header">
                    <h2 class="m_borderLeft_title">应用详情</h2>
                </div>
                <el-table
                ref="ref_applicationInfo"
                :data="tableData_applicationInfo"
                highlight-current-row
                @current-change="selectApplicationFunc"
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
                        prop="appName">
                    </el-table-column>
                    <el-table-column
                        label="应用类型"
                        prop="appType"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="应用编码"
                        prop="appEncode">
                    </el-table-column>
                    <el-table-column
                        label="设备适用型号"
                        :formatter="format_equipmentModelNames"
                        prop="equipmentModelNames">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="备注"
                        show-overflow-tooltip>
                    </el-table-column>
                </el-table>

                <div style="margin-top: 20px">
                    <div class="block">
                        <el-pagination
                        @size-change="pageSizeChangeFunc"
                        @current-change="pageChangeFunc"
                        :current-page="page.current"
                        :page-sizes="[10, 50, 100, 200]"
                        :page-size="page.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            
            <div class="box">
                <div class="header">
                    <h2 class="m_borderLeft_title">版本详情</h2>
                </div>
                <el-row class="btnBox">
                    <el-col :span="4">
                        <el-button type="primary" round size="small" @click="addBtn_globalFunc(operateStatus=1)">上传新版本</el-button>
                    </el-col>
                </el-row>
                <el-table
                ref="ref_global"
                :data="tableData_versionInfo"
                style="width: 100%"
                border
                size="mini">
                    <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        label="版本名称"
                        prop="versionName">
                    </el-table-column>
                    <el-table-column
                        label="版本号"
                        prop="versionNumber"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        label="是否强制升级"
                        width="100"
                        :formatter="format_forcedUpgrade"
                        prop="forcedUpgrade">
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        :formatter="format_publishStatus"
                        prop="publishStatus">
                    </el-table-column>
                    <el-table-column
                        prop="updateInfo"
                        label="版本更新说明"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="fileName"
                        label="文件名"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="updateTime"
                        label="更新时间"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="modifier"
                        label="更新者"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="publishTime"
                        label="发布时间"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="publisher"
                        label="发布者"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="public_globalFunc(scope)"
                                type="text"
                                size="small">
                                发布
                            </el-button>
                            <el-button
                                @click.native.prevent="addBtn_globalFunc(operateStatus=2,scope)"
                                v-if="scope.row.publishStatus==0"
                                type="text"
                                size="small">
                                编辑
                            </el-button>
                            <el-button
                                @click.native.prevent="back_globalFunc(scope)"
                                v-if="scope.row.publishStatus==1"
                                type="text"
                                size="small">
                                撤回
                            </el-button>
                            <el-button
                                @click.native.prevent="detail_globalFunc(scope)"
                                v-show="scope.row.publishStatus==1"
                                type="text"
                                size="small">
                                升级详情
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>

                <div style="margin-top: 20px">
                    <div class="block">
                        <el-pagination
                        @size-change="pageSizeChangeFunc_versionInfo"
                        @current-change="pageChangeFunc_versionInfo"
                        :current-page="page.current"
                        :page-sizes="[10, 50, 100, 200]"
                        :page-size="page.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total_versionInfo">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- 弹窗  更新安装包-->
        <el-dialog title="更新安装包" :visible.sync="dialogFormVisible_nnnn" width="800px">
            <div class="box" style="padding-right: 40px;">
                <div class="m_dialogMain">
                    <el-form size="small" :model="curPackageData" :rules="curPackage_rules" label-width="120px">
                        <el-form-item label="应用名称：" prop="appName">
                            <el-input disabled v-model="curApplicationInfoData.appName" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="10" class="aaa">
                                <el-form-item label="安装包：" prop="appName" >
                                    <el-upload
                                        class="avatar-uploader"
                                        action=""
                                        ref="ref_uploadVideo"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUploadVideo"
                                        :on-change="uploadChange_videoFunc"
                                        :auto-upload="false">
                                        <i class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="文件名：">
                                    <el-input  v-model="curPackageData.fileName" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="文件大小：">
                                    <el-input  v-model="curPackageData.fileSize" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="包名：">
                                    <el-input  v-model="curPackageData.packageName" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="版本号：" prop="versionNumber">
                                    <el-input  v-model="curPackageData.versionNumber" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="版本名称：" prop="versionName">
                            <el-input  v-model="curPackageData.versionName" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="是否强制升级：" prop="forcedUpgrade">
                            <el-select v-model="curPackageData.forcedUpgrade" placeholder="请选择">
                                <el-option v-for="item in option_ifUpdate"
                                :key="item.val"
                                :label="item.name" 
                                :value="item.val">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版本更新说明：" prop="updateInfo">
                            <el-input type="textarea"  v-model="curPackageData.updateInfo" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="saveUpdateVersionFunc">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗  详情-->
        <el-dialog title="升级详情" :visible.sync="dialogFormVisible_detail" width="800px">
            <div class="box">
                <div class="m_dialogMain">
                    <el-form size="small">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="区域：" prop="areaId " :label-width="formLabelWidth">
                                    <el-input clearable v-model="formData_equip.areaId" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备SN：" prop="equipmentSn " :label-width="formLabelWidth">
                                    <el-input clearable v-model="formData_equip.equipmentSn" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="设备条码：" prop="equipmentBarcode " :label-width="formLabelWidth">
                                    <el-input clearable v-model="formData_equip.equipmentBarcode" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10" :push="2">
                                <!-- <el-form-item label="是否升级：" prop="isForcedUpgrade" :label-width="formLabelWidth">
                                    <el-select v-model="formData_equip.isForcedUpgrade" placeholder="请选择">
                                        <el-option v-for="item in option_appType"
                                        :key="item.id"
                                        :label="item.name" 
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item> -->

                                <el-button type="primary" round size="small" @click="query_equipPageFunc(flag=1)">查询</el-button>
                                <el-button round size="small" @click="reset_equipPageFunc">重置</el-button>
                            </el-col>
                        </el-row>
                        <!-- <el-row class="btnBox">
                            <el-col :span="24">
                                <el-button type="primary" round size="small" @click="query_equipPageFunc(flag=1)">查询</el-button>
                                <el-button round size="small" @click="reset_equipPageFunc">重置</el-button>
                            </el-col>
                        </el-row> -->
                    </el-form>
                </div>
            </div>
            <div class="box">
                    <el-table
                    ref="ref_global"
                    :data="tableData_equipPage"
                    highlight-current-row
                    @current-change="selectApplicationFunc"
                    style="width: 100%"
                    border
                    size="mini">
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            label="设备SN"
                            prop="equipmentSn">
                        </el-table-column>
                        <el-table-column
                            label="设备型号"
                            prop="equipmentModel">
                        </el-table-column>
                        <el-table-column
                            label="设备条码"
                            prop="equipmentBarcode">
                        </el-table-column>
                        <el-table-column
                            label="区域"
                            prop="areaId">
                        </el-table-column>
                        <el-table-column
                            prop="versionNumber"
                            label="当前版本"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="versionUpdateTime"
                            label="升级时间"
                            show-overflow-tooltip>
                        </el-table-column>
                    </el-table>

                    <div style="margin-top: 20px">
                        <div class="block">
                            <el-pagination
                            @size-change="pageSizeChangeFunc_equipPage"
                            @current-change="pageChangeFunc_equipPage"
                            :current-page="page.current"
                            :page-sizes="[10, 50, 100, 200]"
                            :page-size="page.size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="page.total_equipPage">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            <div slot="footer" class="dialog-footer">
                <div>
                    <!-- <el-button type="primary" round size="small" @click="saveOrUpdateFunc">保存</el-button> -->
                    <el-button type="danger" round size="small" @click="dialogFormVisible_detail= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗  发布-->
        <el-dialog title="版本发布" :visible.sync="dialogFormVisible_public" width="900px">
            <div class="box">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="按区域发布" name="1">
                        <div>
                            <div class="m_dialogMain">
                                <p style="color: #999;">注：当前只显示适用该版本的区域</p>
                                <el-form size="small">
                                    <el-row>
                                        <el-col>
                                            <el-form-item label="选择发布区域：">
                                                <el-radio-group v-model="publicDialog.radio" @change="publicDialog_radioFunc">
                                                    <el-radio label="全部区域"></el-radio>
                                                    <el-radio label="指定区域"></el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                        <div v-if="publicDialog.radio=='指定区域'">
                            <el-row>
                                <el-col>
                                    <input @keyup="txt_keyupFunc" v-model="txt_publishArea" @click="mySelect_toggleFunc(mySelectBox_visible)" type="text" class="m_selectOptions">
                                </el-col>
                            </el-row>
                            <div class="m_mySelectBox" v-show="mySelectBox_visible">
                                <div class="tagBox">
                                    <ul>
                                        <li v-for="(items,$index) in mySelect_datas_city" :class="{cur:$index==mySelect_curIndex}" @click="mySelect_city_click($index,items.areaId)" :key="items.areaId">
                                            {{items.areaName}}
                                        </li>
                                    </ul>
                                </div>
                                <div class="itemBox">
                                    <ul>
                                        <li v-show="mySelect_curIndex ==0 || item.parentId==mySelect_curAreaId" v-for="(item,$index) in mySelect_datas_allCommunity" :class="{cur: item.select,isSelect: item.isSelect}" @click="mySelect_itemToggleFunc($index,item.select,item.isSelect)" :key="item.areaId">
                                            {{item.areaName}}
                                        </li>
                                    </ul>
                                    <el-row class="btnBox">
                                        <el-button plain size="mini" @click="save_mySelectBoxFunc">确认</el-button>
                                        <el-button type="danger" size="mini"  @click="cancel_mySelectBox" plain>取消</el-button>
                                    </el-row>
                                </div>
                            </div>
                            <div class="m_mySourceBox" v-if="mySourceBox_visible">
                                <ul>
                                    <li v-show="item.areaName.indexOf(txt_publishArea)>=0" v-for="(item,$index) in mySelect_datas_allCommunity" :class="{cur: item.select,isSelect: item.isSelect}" @click="mySource_itemToggleFunc($index,item.select,item.isSelect)" :key="item.areaId">{{item.areaName}}</li>
                                </ul>
                                <el-row class="btnBox">
                                    <el-button plain size="mini"  @click="save_mySelectBoxFunc">确认</el-button>
                                    <el-button type="danger" size="mini" @click="cancel_mySelectBox" plain>取消</el-button>
                                </el-row>
                            </div>
                            <div>
                                <div class="m_dialogHead">
                                    <h3 class="m_borderLeft_title">已选择发布区域</h3>
                                </div>
                                <el-table
                                ref="ref_global"
                                :data="tableData_publishArea"
                                highlight-current-row
                                max-height="300"
                                @current-change="curChange_publishAreaFunc"
                                style="width: 100%"
                                border
                                size="mini">
                                    <el-table-column
                                        label="社区"
                                        prop="areaName">
                                    </el-table-column>
                                    <el-table-column
                                        label="发布范围"
                                        :formatter="format_isAll"
                                        prop="isAll">
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        width="80">
                                        <template slot-scope="scope">
                                            <el-button
                                                @click.native.prevent="delete_publishAreaFunc(scope)"
                                                type="text"
                                                size="small"
                                                class="btnDel">
                                                移除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <!-- <div style="margin-top: 20px">
                                    <div class="block">
                                        <el-pagination
                                        @size-change="pageSizeChangeFunc"
                                        @current-change="pageChangeFunc"
                                        :current-page="page.current"
                                        :page-sizes="[10, 50, 100, 200]"
                                        :page-size="page.size"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="page.total">
                                        </el-pagination>
                                    </div>
                                </div> -->
                            </div>
                            <div>
                                <div class="m_dialogHead">
                                    <h3 class="m_borderLeft_title">区域范围</h3>
                                </div>
                                <div>
                                    <el-tree
                                        ref="ref_tree"
                                        :data="treeDatas"
                                        :props="treeProps"
                                        :default-checked-keys="checkArray_tree"
                                        show-checkbox
                                        default-expand-all
                                        @check-change="treeCheckChange"
                                        node-key="areaId"
                                        >
                                    </el-tree>

                                </div>
                            </div>
                        </div>
                        <div  v-if="publicDialog.radio=='全部区域'">
                            <div class="infoText">
                                提示：选择【全部区域】发布后，所有适用该版本的设备都会收到升级提醒。
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="按设备发布" name="2">
                        <div class="box">
                            <div class="m_dialogMain">
                                <el-form size="small">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="区域：" prop="areaId " :label-width="formLabelWidth">
                                                <el-input  v-model="formData_equip.areaId" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="设备SN：" prop="equipmentSn " :label-width="formLabelWidth">
                                                <el-input  v-model="formData_equip.equipmentSn" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="设备条码：" prop="equipmentBarcode " :label-width="formLabelWidth">
                                                <el-input  v-model="formData_equip.equipmentBarcode" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="工作模式：" prop="work" :label-width="formLabelWidth">
                                                <el-select v-model="formData_equip.work" placeholder="请选择">
                                                    <el-option v-for="item in option_work"
                                                    :key="item.dataLabel"
                                                    :label="item.dataDetail" 
                                                    :value="item.dataLabel">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row class="btnBox">
                                        <el-col :span="24">
                                            <el-button type="primary" round size="small" @click="query_equipPageFunc(flag=2)">查询</el-button>
                                            <el-button round size="small" @click="reset_equipPageFunc">重置</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                        <div class="box">
                            <!-- _equipPage -->
                            <div class="m_dialogHead">
                                <h3 class="m_borderLeft_title">设备列表</h3>
                                <span @click="toggleVisibleFunc(1,visible_equipPage)" class="right">{{visible_equipPage? '收起' : '展开'}}>></span>
                            </div>
                            <div v-show="visible_equipPage">
                                <el-table
                                ref="ref_global"
                                :data="tableData_equipPage_flag2"
                                style="width: 100%"
                                border
                                size="mini">
                                    <el-table-column
                                        label="序号"
                                        type="index"
                                        width="50">
                                    </el-table-column>
                                    <el-table-column
                                        label="设备SN"
                                        prop="equipmentSn">
                                    </el-table-column>
                                    <el-table-column
                                        label="设备型号"
                                        prop="equipmentModel">
                                    </el-table-column>
                                    <el-table-column
                                        label="设备条码"
                                        prop="equipmentBarcode">
                                    </el-table-column>
                                    <el-table-column
                                        label="工作模式"
                                        prop="workPattern">
                                    </el-table-column>
                                    <el-table-column
                                        label="区域"
                                        prop="areaId">
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        width="120">
                                        <template slot-scope="scope">
                                            <el-button
                                                @click.native.prevent="move_equitFunc(scope)"
                                                type="text"
                                                size="small">
                                                移入待发布列表
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <div style="margin-top: 20px">
                                    <div class="block">
                                        <el-pagination
                                        @size-change="pageSizeChangeFunc_flag2"
                                        @current-change="pageChangeFunc_flag2"
                                        :current-page="page.current"
                                        :page-sizes="[10, 50, 100, 200]"
                                        :page-size="page.size"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="page.total_flag2">
                                        </el-pagination>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="box">
                            <!-- _waitEquipPage -->
                            <div class="m_dialogHead">
                                <h3 class="m_borderLeft_title">待发布设备列表</h3>
                                <span @click="toggleVisibleFunc(2,visible_waitEquipPage)" class="right">{{visible_waitEquipPage? '收起' : '展开'}}>></span>
                            </div>
                            <div v-show="visible_waitEquipPage">
                                <el-table
                                ref="ref_global"
                                :data="tableData_waitEquipPage"
                                style="width: 100%"
                                border
                                size="mini">
                                    <el-table-column
                                        label="序号"
                                        type="index"
                                        width="50">
                                    </el-table-column>
                                    <el-table-column
                                        label="设备SN"
                                        prop="equipmentSn">
                                    </el-table-column>
                                    <el-table-column
                                        label="设备型号"
                                        prop="equipmentModel">
                                    </el-table-column>
                                    <el-table-column
                                        label="设备条码"
                                        prop="equipmentBarcode">
                                    </el-table-column>
                                    <el-table-column
                                        label="工作模式"
                                        prop="workPattern">
                                    </el-table-column>
                                    <el-table-column
                                        label="区域"
                                        prop="areaId">
                                    </el-table-column>
                                    <el-table-column
                                        label="状态"
                                        prop="areaId">
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        width="80">
                                        <template slot-scope="scope">
                                            <el-button
                                                @click.native.prevent="delete_waitEquipFunc(scope)"
                                                type="text"
                                                size="small"
                                                class="btnDel">
                                                移除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <!-- <div style="margin-top: 20px">
                                    <div class="block">
                                        <el-pagination
                                        @size-change="pageSizeChangeFunc"
                                        @current-change="pageChangeFunc"
                                        :current-page="page.current"
                                        :page-sizes="[10, 50, 100, 200]"
                                        :page-size="page.size"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="page.total">
                                        </el-pagination>
                                    </div>
                                </div> -->
                            </div>
                        </div>

                        <div class="box">
                            <!-- _publishEquipPage -->
                            <div class="m_dialogHead">
                                <h3 class="m_borderLeft_title">已发布设备列表</h3>
                                <span @click="toggleVisibleFunc(3,visible_publishEquipPage)" class="right">{{visible_publishEquipPage? '收起' : '展开'}}>></span>
                            </div>
                            <div v-show="visible_publishEquipPage">
                                <el-table
                                    ref="ref_global"
                                    :data="tableData_publishEquipPage"
                                    style="width: 100%"
                                    border
                                    size="mini">
                                        <el-table-column
                                            label="序号"
                                            type="index"
                                            width="50">
                                        </el-table-column>
                                        <el-table-column
                                            label="设备SN"
                                            prop="equipmentSn">
                                        </el-table-column>
                                        <el-table-column
                                            label="设备型号"
                                            prop="equipmentModel">
                                        </el-table-column>
                                        <el-table-column
                                            label="设备条码"
                                            prop="equipmentBarcode">
                                        </el-table-column>
                                        <el-table-column
                                            label="工作模式"
                                            prop="workPattern">
                                        </el-table-column>
                                        <el-table-column
                                            label="区域"
                                            prop="areaId">
                                        </el-table-column>
                                        <el-table-column
                                            label="状态"
                                            prop="areaId">
                                        </el-table-column>
                                    </el-table>

                                    <div style="margin-top: 20px">
                                        <div class="block">
                                            <el-pagination
                                            @size-change="pageSizeChangeFunc_publishEquipPage"
                                            @current-change="pageChangeFunc_publishEquipPage"
                                            :current-page="page.current"
                                            :page-sizes="[10, 50, 100, 200]"
                                            :page-size="page.size"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="page.total_publishEquipPage">
                                            </el-pagination>
                                        </div>
                                    </div>
                            </div>
                            
                        </div>
                        
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="publishFunc">发布</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_public= false">关闭</el-button>
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
        // padding-right: 40px;
    }
    .el-select{
        width: 100%;
    }
}
.m_selectOptions{
    height: 32px;
    line-height: 32px;

        -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}
.m_selectOptions:hover {
    border-color: #c0c4cc;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 112px;
    line-height: 112px;
    text-align: center;
    cursor: pointer;
  }
  .avatar {
    width: 150px;
    height: 112px;
    display: block;
  }
  .aaa{
      .avatar-uploader{
          margin-top: -35px;
      }
      .el-form-item {
        padding: 60px 0;
        margin-bottom: 0;
      }
  }
  .infoText{
      padding: 30px 20px 30px 30px;
      line-height: 40px;
      color: #999;
      font-size: 18px;
  }
  .m_mySelectBox{
        height: 250px;
        border: 1px solid #ccc;
        border-radius: 0 0 3px 3px;
        margin-top: 2px;
        display: flex;
        .tagBox{
            
            background: #EBEEF5;
            width: 150px;
            overflow-x: hidden;
            overflow-y: auto;
            li{
                padding: 0 10px;
                line-height: 30px;
                font-size: 14px;
                cursor: pointer;
            }
            li.cur{
                background: #fff;
            }
        }
        .itemBox{
            flex: 1;
            overflow: hidden;
            position: relative;
            ul{
                overflow: hidden;
                overflow-y: auto;
                height: 210px;
            }
            li{
                float: left;
                margin: 10px;
                padding: 3px 10px;
                border: 1px solid #EBEEF5;
                border-radius: 3px;
                cursor: pointer;
            }
            li.cur{
                background: #409EFF;
                color: #fff;
            }
            li.cur.isSelect{
                background: #75b3f5;
            }
            .btnBox{
                position: absolute;
                padding: 5px 10px;
                bottom: 0;
                background: #EBEEF5;
                right: 0;
                left: 0;
                text-align: center;
            }

        }
  }
.m_mySourceBox{
    max-height: 250px;
    border: 1px solid #ccc;
    border-radius: 0 0 3px 3px;
    margin-top: 2px;
    overflow-y: auto;
    li{
        margin: 10px;
        padding: 3px 5px;
        // border: 1px solid #EBEEF5;
        border-radius: 3px;
        cursor: pointer;
    }
    li.cur{
        background: #409EFF;
        color: #fff;
    }
    li.cur.isSelect{
        background: #75b3f5;
    }
    .btnBox{
                padding: 5px 10px;
                background: #EBEEF5;
                text-align: center;
            }
  }
</style>
<script>
import {arrayToAttrArray,tree_arrayToAttrArray,tree_addAttr_a} from '@/utils/common.js'

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
                size: 10,
                total: 0,
                total_versionInfo: 0,
                total_equipPage: 0,
                total_flag2: 0,
                total_publishEquipPage: 0,
            },
            curPackage_rules:{
                appName:[
                     { required: true, message: '不可为空', trigger: 'blur' }
                ],
                versionNumber:[
                     { required: true, message: '不可为空', trigger: 'blur' }
                ],
                versionName:[
                     { required: true, message: '不可为空', trigger: 'blur' }
                ],
                forcedUpgrade:[
                     { required: true, message: '不可为空', trigger: 'change' }
                ],
                updateInfo:[
                     { required: true, message: '不可为空', trigger: 'blur' }
                ],
            },
            operateStatus: '1',//1为创建；2为编辑；
            publishStatus: '2',//1为发布过；2为没发布；
            formLabelWidth: '110px',
            formData_dialog:{
                appName : '',
                appType : '',
                appEncode : '',
                equipmentModel : [],
                remark : '',
            },
            formData_equip:{
                areaId: '',
                equipmentSn: '',
                equipmentBarcode: '',
                isForcedUpgrade: '',
                work: '',
            },
            option_appType:[],
            option_work:[],
            option_ifUpdate:[
                {name: '否',val: '0'},
                {name: '是',val: '1'},
            ],
            option_equipType:[],
            option_appEncodes:[],

            tableData_global:[
                {
                    aaa: '内容'
                }
            ],
            tableData_equipPage: [],
            tableData_equipPage_flag2: [],
            tableData_waitEquipPage: [],
            tableData_publishEquipPage: [],
            txt_publishArea: '',
            tableData_applicationInfo:[
            ],
            tableData_versionInfo:[
                // {}
            ],
            dialogFormVisible_nnnn: false,
            dialogFormVisible_detail: false,
            dialogFormVisible_public: false,
            mySelectBox_visible: false,
            mySourceBox_visible: false,
            publicDialog: {
                radio: '指定区域'
            },
            mySelect_curIndex: 0,//指定区域当前curindex
            mySelect_curAreaId: '',//
            curApplicationInfoData: {},
            curVersionInfoId: null,
            curAlreadPublishData: {},
            curPackageData: {
                fileSize: '',
                fileName: '',
                packageName: '',
                versionNumber: '',
                versionInfoId: '',
            },
            tableData_publishArea: [
                // {
                //     areaId:"9e8aa0cda04311e88a4a000c29a401f2",
                //     areaName:"赛翼智慧社区",
                //     parentId:"2",
                //     select:true
                // }
            ],
            mySelect_datas_allCommunity: null,
            mySelect_datas_city: null,
            mySelect_datas:[
            ],
            checkTree_record: {},//格式为{'key':value,'key1':value1};key为社区areaId，value值为勾选的区域范围areaId数组
            checkTree_record_key: [],//存key数组；
            add_checkTree_record: {},//tree新增的check；
            back_checkTree_record: {},//回显的数据记录
            activeName: '1',
            treeDatas: [],
            treeProps:{
                label: 'areaName',
                id: 'areaId',
                children: 'childrens',
            },
            checkArray_tree: [],
            visible_equipPage: true,
            visible_waitEquipPage: true,
            visible_publishEquipPage: true,

            tableData_publishArea_ids_session: [],
            tableData_publishArea_session: [],
        }
    },
    methods:{
        query_globalFunc(){
            console.log('chaxun');
            var data={
                pageNum: 1,
                pageSize: this.page.size,
                appName: this.headInput.appName,
                appType: this.headInput.appType,
                appEncode: this.headInput.appEncode,
                equipmentModelIds: this.headInput.equipmentModel.join(','),
                "creator": sessionStorage.getItem('session_username'),
                "creatorId": sessionStorage.getItem('session_userId')
            }
            this.http_applicationDetailTableFunc(data);
        },
        query_equipPageFunc(flag){
            console.log('chaxun');
             var datas={
                pageNum: 1,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : flag,
                areaId: this.formData_equip.areaId,
                equipmentSn: this.formData_equip.equipmentSn,
                equipmentBarcode: this.formData_equip.equipmentBarcode,
                // isForcedUpgrade: flag==1 ? this.formData_equip.isForcedUpgrade : '',
                workPattern: flag==2 ? this.formData_equip.work : '',
            }
            debugger;
            this.http_showEquipmentsPageFunc(datas);
        },
        reset_equipPageFunc(){
            this.formData_equip= {
                areaId: '',
                equipmentSn: '',
                equipmentBarcode: '',
                isForcedUpgrade: '',
                work: ''
            }
        },
        toggleVisibleFunc(index,bool){
            if (index==1) {
                this.visible_equipPage= !bool;
            }
            if (index==2) {
                this.visible_waitEquipPage= !bool;
            }
            if (index==3) {
                this.visible_publishEquipPage= !bool;
            }
        },
        addBtn_globalFunc(operateStatus,scope){
            debugger;
            if (!this.curApplicationInfoData.hasOwnProperty('appInfoId')) {
                this.$message({
                    type: 'info',
                    message: '请选择应用'
                })
                return false;
            }
            this.dialogFormVisible_nnnn= true;
            this.operateStatus= operateStatus;
            if (this.operateStatus==1) {
                this.curPackageData={
                    fileSize: '',
                    fileName: '',
                    packageName: '',
                    versionNumber: '',
                    versionInfoId: '',
                }
            }else{
                this.curPackageData= scope.row;
            }
        },
        mySelect_toggleFunc(bool){
            // debugger;
            if (this.txt_publishArea.length> 0) {
                this.mySelectBox_visible= false;
            }else{
                this.mySelectBox_visible= !bool;
                this.mySourceBox_visible= false;
            }
            
        },
        save_mySelectBoxFunc(){
            debugger;
            var datas= [],
                allConmunity= JSON.parse(sessionStorage.getItem('mySelect_datas_allCommunity_session')),
                publishArea_session= this.tableData_publishArea_session,
                publishArea_ids_session= this.tableData_publishArea_ids_session;
            var datas=allConmunity.filter((items)=>{
                return items.select;
            })
            datas.forEach((item,index)=>{
                var aa= publishArea_ids_session.indexOf(item.areaId);
                if (aa>=0) {
                    datas[index].isAll= publishArea_session[aa].isAll;
                }
            });
            datas.sort((a,b)=>{// 排序
                return a.isSelect
            })
            debugger;
            this.tableData_publishArea= datas;
            this.mySelectBox_visible= false;
            this.mySourceBox_visible= false;
        },
        cancel_mySelectBox(visile){
            this.mySelectBox_visible= false;
            this.mySourceBox_visible= false;
        },
        txt_keyupFunc(){
            // debugger
            console.log(this.txt_publishArea);
            var txt= this.txt_publishArea;
            if (txt.length>0) {
                this.mySelectBox_visible= false;
                this.mySourceBox_visible= true;
            }
        },
        mySelect_itemToggleFunc(index,bool,isSelect){
            // debugger;
            if (isSelect) 
                return ;
            if (bool) {
                this.mySelect_datas_allCommunity[index].select= false;
            }else{
                this.mySelect_datas_allCommunity[index].select= true;
            }
            sessionStorage.setItem('mySelect_datas_allCommunity_session',JSON.stringify(this.mySelect_datas_allCommunity));
            
        },
        mySource_itemToggleFunc(index,bool,isSelect){
            debugger;
            if (isSelect) 
                return ;
            if (bool) {
                this.mySelect_datas_allCommunity[index].select= false;
            }else{
                this.mySelect_datas_allCommunity[index].select= true;
            }
            sessionStorage.setItem('mySelect_datas_allCommunity_session',JSON.stringify(this.mySelect_datas_allCommunity));
        },
        format_forcedUpgrade(row, column, cellValue, index){
            if (cellValue==0) {//0=否，1=是
                return '否'
            }else{
                return '是'
            }
        },
        format_isAll(row, column, cellValue, index){
            if (cellValue==0) {//0=否，1=是
                return '全部区域'
            }else if(cellValue==1){
                return '指定区域'
            }else{
                return '-'
            }
        },
        format_publishStatus(row, column, cellValue, index){
            if (cellValue==0) {//0=未发布，1=已发布，2=撤回
                return '未发布'
            }else if(cellValue==1){
                return '已发布'
            }else{
                return '撤回'
            }
        },
        format_equipmentModelNames(row, column, cellValue, index){
            return cellValue.join(',');
        },
        publicDialog_radioFunc(val){
            this.publicDialog.radio= val;
            console.log(val);
        },
        mySelect_city_click(val,areaId){
            debugger;
            this.mySelect_curIndex= val;
            this.mySelect_curAreaId= areaId;

            console.log(val);
        },
        detail_globalFunc(scope){
            this.dialogFormVisible_detail= true;
            this.curVersionInfoId=scope.row.versionInfoId;
            debugger;
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : 1,
            }
            this.http_showEquipmentsPageFunc(datas);
        },
        public_globalFunc(scope){
            // f56103809ba311e8a2a1000c29a401f2门口机APP
            // f56b91019ba311e8a2a1000c29a401f2手机APP
            // f57090a19ba311e8a2a1000c29a401f2门口机固件
            // f57b33eb9ba311e8a2a1000c29a401f2win客户端
            debugger;
            var appTypeIdArray=['f56103809ba311e8a2a1000c29a401f2','f56b91019ba311e8a2a1000c29a401f2','f57090a19ba311e8a2a1000c29a401f2','f57b33eb9ba311e8a2a1000c29a401f2win']
            if (appTypeIdArray.indexOf(this.curApplicationInfoData.appTypeId)==1 || appTypeIdArray.indexOf(this.curApplicationInfoData.appTypeId)==3) {
                if (scope.row.publishStatus==1) {
                    this.$message({
                        type: 'info',
                        message: '此应用类型已经发布过，不能重复发布'
                    })
                }else{
                    this.$confirm('确认发布吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        var datas={
                            id: scope.row.versionInfoId
                        }
                        this.http_phoneAndWinPublish(datas);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消发布'
                        });          
                    });
                }
                
            }else{
                // 初始化数据
                this.checkTree_record= {};//格式为{'key':value,'key1':value1};key为社区areaId，value值为勾选的区域范围areaId数组
                this.checkTree_record_key= [];//存key数组；
                this.add_checkTree_record= {};//tree新增的check；
                this.back_checkTree_record= {};//回显的数据记录
                this.treeDatas= [];
                this.tableData_waitEquipPage= [];

                this.dialogFormVisible_public= true;
                this.curVersionInfoId=scope.row.versionInfoId;
                var data2={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    versionInfoId: this.curVersionInfoId,
                    flag : 2,
                }
                var data3={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    versionInfoId: this.curVersionInfoId,
                    flag : 3,
                }
                var datas={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    versionInfoId: this.curVersionInfoId,
                }
                
                debugger;
                var data4={
                    versionInfoId: this.curVersionInfoId
                }
                this.http_queryAllCommunityFunc(data4);//版本发布-全部社区
                
                
                this.http_queryAllProvinceAndCityFunc();//版本发布-省市区域
                this.http_queryWorkPatternsFunc();

                this.http_showEquipmentsPageFunc(data2);
                this.http_showEquipmentsPageFunc(data3);
            }
            
        },
        back_globalFunc(scope){
            debugger;
            this.curVersionInfoId=scope.row.versionInfoId
            var datas={
                id: scope.row.versionInfoId
            }
            this.http_withdraw(datas);
        },
        http_phoneAndWinPublish(datas){
            var _this=this;
            this.$post('/app/version-aggr/version/phoneAndWinPublish',datas)
            .then(function (response) {
                
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '发布成功'
                    })
                    var ddd={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size
                    }
                    _this.http_applicationDetailTableFunc(ddd);
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
        http_withdraw(datas){
            var _this=this;
            this.$post('/app/version-aggr/version/withdraw',datas)
            .then(function (response) {
                
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '撤回成功'
                    })

                    var datas={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size,
                        appInfoId: _this.curApplicationInfoData.appInfoId
                    }
                    _this.http_versionInfoTableFunc(datas);
                    
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
        reset_globalFunc(){
            this.headInput= {
                appName: '',
                appType: '',
                appEncode: '',
                equipmentModel: [],
            }
        },
        head_selectFunc(){

        },
        add_revise_detail_Func(){

        },
        selectApplicationFunc(val){
            console.log(val);
            this.curApplicationInfoData= val;
            debugger;
            var datas={
                pageNum: 1,
                pageSize: this.page.size,
                appInfoId: val.appInfoId
            }
            this.http_versionInfoTableFunc(datas);
        },
        curChange_publishAreaFunc(val,old){
            console.log(val);
            this.curAlreadPublishData= val;
            let isAll=val.isAll;
            debugger;
            if (this.checkTree_record_key.indexOf(val.areaId)>=0) {
                debugger;
                this.checkArray_tree= this.checkTree_record[this.curAlreadPublishData.areaId];
                // var _this=this;
                // [this.checkTree_record].forEach((item)=>{
                //     debugger;
                //     for (var key in item) {
                //         if (key == _this.curAlreadPublishData.areaId) {
                //             _this.checkArray_tree= arrayToAttrArray(item[key],'areaId');
                //         }
                //     }
                // })
                var ddd={
                        versionInfoId: this.curVersionInfoId,
                        communityId: val.areaId
                    }
                debugger;
                this.http_queryAreaByCommunityFunc(ddd,isAll,this.checkArray_tree);
            }else{
                var publishArea_ids_session= this.tableData_publishArea_ids_session;
                if (publishArea_ids_session.indexOf(val.areaId)<0) {//新增的已发布区域
                    var data={
                        areaId: val.areaId
                    }
                    this.http_queryAreaByParent(data,isAll);
                }else{//回显的已发布区域
                    // debugger;
                    var ddd={
                        versionInfoId: this.curVersionInfoId,
                        communityId: val.areaId
                    }
                    this.http_queryAreaByCommunityFunc(ddd,isAll);
                }
                
            }
            
            
            // if (this.checkTree_record.length>0) {//每次切换已发布区域，根据记录勾选树节点checkArray_tree；
            //     var _this=this;
            //     this.checkTree_record.forEach((item)=>{
            //         for (var key in item) {
            //             if (key == _this.curAlreadPublishData.areaId) {
            //                 _this.checkArray_tree= arrayToAttrArray(item[key],'areaId');
            //             }
            //         }
            //     })
            // }
        },
        handleClick(tab, event) {
            console.log(tab, event);
            console.log(tab.name);
        },
        move_equitFunc(scope){
            var index= scope.$index;
            var moveData= this.tableData_equipPage_flag2.splice(index,1);
            debugger;
            this.tableData_waitEquipPage.push(moveData[0]);
        },
        delete_waitEquipFunc(scope){
            debugger;
            var index= scope.$index;
            var moveData= this.tableData_waitEquipPage.splice(index,1);
            this.tableData_equipPage_flag2.push(moveData[0]);
        },
        delete_publishAreaFunc(scope){
            debugger;
            var index= scope.$index;
            this.tableData_publishArea.splice(index,1);
            delete this.checkTree_record[scope.row.areaId];
            var indexNuber=this.checkTree_record_key.indexOf(scope.row.areaId);
            this.checkTree_record_key.splice(indexNuber,1);
            this.treeDatas= [];
            var curArea= scope.row.areaId;
            this.mySelect_datas_allCommunity=this.mySelect_datas_allCommunity.map((item)=>{
                // debugger
                if(item.areaId==curArea){
                    item.isSelect=false;
                }
                return item;
            })
        },
        deleteRowFunc(scope){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                debugger;
                var datas={
                    "id": scope.row.id,
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
                
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '删除成功'
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
        saveUpdateVersionFunc(){
            debugger;
            var datas={
                appInfoId : this.curApplicationInfoData.appInfoId,
                fileName : this.curPackageData.fileName,
                fileSize : this.curPackageData.fileSize,
                forcedUpgrade : this.curPackageData.forcedUpgrade,
                packageName : this.curPackageData.packageName,
                publishStatus : this.operateStatus==2 ? this.curPackageData.publishStatus : '',
                updateInfo : this.curPackageData.updateInfo,
                versionInfoId : this.curPackageData.versionInfoId,
                versionName : this.curPackageData.versionName,
                versionNumber : this.curPackageData.versionNumber,
                "modifier": sessionStorage.getItem('session_username'),
                "modifierId": sessionStorage.getItem('session_userId')
            }
            
            this.http_saveUpdateVersion(datas);
        },
        // saveOrUpdateFunc(){
        //     var datas={
        //         appName : this.formData_dialog.appName,
        //         appType : this.formData_dialog.appType,
        //         appEncode : this.formData_dialog.appEncode,
        //         equipmentModel : this.formData_dialog.equipmentModel,
        //         remark : this.formData_dialog.remark,
        //         "creator": sessionStorage.getItem('session_username'),
        //         "creatorId": sessionStorage.getItem('session_userId')
        //     }
        //     debugger;
        //     this.http_saveOrUpdate(datas);
        // },
        treeCheckChange(aa,bb,cc){//记录勾选的树节点和发布区域id组成的对象nodeObj_tree{areaId,[selectTree]}，对象组成的数组checkTree_record
            debugger;
            var nodeObj_tree={},
                ifHas= false,
                selectTree= this.$refs.ref_tree.getCheckedNodes(),
                selectTree_ids= arrayToAttrArray(selectTree,'areaId');
            this.checkTree_record[this.curAlreadPublishData.areaId]= selectTree_ids;
            // if (selectTree.length > 0) {
            //     nodeObj_tree[this.curAlreadPublishData.areaId]= selectTree;
            //     if (this.checkTree_record.length<=0) {
            //         this.checkTree_record.push(nodeObj_tree);
            //     }else{
            //         for (let i = 0; i < this.checkTree_record.length; i++) {
            //             if (this.checkTree_record[i].hasOwnProperty(this.curAlreadPublishData.areaId)) {
            //                 this.checkTree_record[i]= nodeObj_tree;
            //                 ifHas= true;
            //             }
            //         }
            //         if (!ifHas) {
            //             this.checkTree_record.push(nodeObj_tree);
            //         }
            //     }
                
            // }else{
            //     var _this= this;
            //     this.checkTree_record.forEach((item,index)=>{
            //         for(var key in item){
            //             debugger
            //             if(key==_this.curAlreadPublishData.areaId){
            //                 _this.checkTree_record.splice(index,1);
            //             }
            //         }
            //     })
            // }
            
        },
        publishFunc(){
            console.log(this.activeName);
            var tagNumger= this.activeName;
            var objectIds= arrayToAttrArray(this.tableData_waitEquipPage,'equipmentId');
            debugger;
            if (tagNumger==2) {//按设备发布；
                var datas={
                    objectType: tagNumger,
                    publishType: 2,//0全部区域；1指定区域；2设备；
                    versionInfoId: this.curVersionInfoId,
                    objectIds: objectIds
                }
            }
            if (tagNumger==1) {//按区域发布
                if (this.publicDialog.radio=='全部区域') {
                    var objectIds= arrayToAttrArray(this.mySelect_datas_allCommunity,'areaId');
                    var datas={
                        objectType: tagNumger,
                        publishType: 0,//0全部区域；1指定区域；2设备；
                        versionInfoId: this.curVersionInfoId,
                        objectIds: objectIds
                    }
                }else if (this.publicDialog.radio=='指定区域') {
                    debugger;
                    var objectIds= arrayToAttrArray(this.tableData_publishArea,'areaId'),
                        objDatas={};

                    if (JSON.stringify(this.checkTree_record)!='{}') {
                        debugger;
                        for (var key in this.checkTree_record) {
                            if (this.tableData_publishArea_ids_session.indexOf(key)>=0) {
                                var _this= this;
                                var fff=this.checkTree_record[key].filter((items,index)=>{
                                    debugger;
                                    if ( _this.back_checkTree_record[key].indexOf(items)<0) {
                                        return items;
                                    }
                                    
                                })
                                objDatas[key]= fff;
                                debugger;
                            }else{
                                debugger;
                                if (this.checkTree_record[key].indexOf(key)<0) {//非全选
                                    objDatas[key]= this.checkTree_record[key];
                                }
                            }
                            
                        }
                        
                        // objDatas= this.checkTree_record;

                    }else{
                        objDatas= null;
                    }
                    debugger;
                    var datas={
                        objectType: tagNumger,
                        publishType: 1,//0全部区域；1指定区域；2设备；
                        versionInfoId: this.curVersionInfoId,
                        objectIds: objectIds,
                        areaIds: objDatas
                    }
                }
                debugger;
            }
            this.http_versionPublish(datas);
        },
        http_versionPublish(datas){
            var _this= this;
            this.$post('/app/version-aggr/version/versionPublish',datas)
            .then(function (response) {
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '发布成功'
                    })
                    var datas={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size,
                        appInfoId: _this.curApplicationInfoData.appInfoId
                    }
                    _this.dialogFormVisible_public= false;
                    _this.http_versionInfoTableFunc(datas);
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
        http_saveUpdateVersion(datas){
            debugger;
            var _this= this;
            this.$post('/app/version-aggr/version/updateVersionInfo',datas)
            .then(function (response) {
                
                debugger;
                if (response.data.code==0) {
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    var ddd={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size,
                        appInfoId: _this.curApplicationInfoData.appInfoId
                    }
                    _this.http_versionInfoTableFunc(ddd);
                    _this.dialogFormVisible_nnnn= false;
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
        // http_saveOrUpdate(datas){
        //     debugger;
        //     var _this= this;
        //     this.$post('/app/version-aggr/version/saveOrUpdate',datas)
        //     .then(function (response) {
                
        //         debugger;
        //         if (response.data.code==0) {
        //             _this.$message({
        //                 type: 'success',
        //                 message: '保存成功'
        //             })
        //         }else{
        //             _this.$message({
        //                 type: 'info',
        //                 message: response.data.msg
        //             })
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        // },
        http_applicationDetailTableFunc(data){
            var _this=this;
            this.$get('/app/version-aggr/version/showAppInfoPage',data)
            .then(function (response) {
                if (response.data.code==0) {
                    var msgDatas= response.data.data || [];
                    _this.tableData_applicationInfo= msgDatas.records;
                    _this.page.total= msgDatas.total;
                    debugger;
                    // _this.$refs.ref_applicationInfo.setCurrentRow(_this.tableData_applicationInfo[0]);
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
        http_queryAllCommunityFunc(datas){
            var _this=this;
            this.$get('/app/version-aggr/version/queryAllCommunity',datas)
            .then(function (response) {
                debugger;
                if (response.data.code==0) {
                    _this.mySelect_datas_allCommunity= response.data.data;
                    var datas={
                        pageNum: _this.page.current,
                        pageSize: _this.page.size,
                        versionInfoId: _this.curVersionInfoId,
                    }
                    _this.http_queryCommunitysByVersionInfoIdFunc(datas);
                    sessionStorage.setItem('mySelect_datas_allCommunity_session',JSON.stringify(response.data.data));

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
        http_queryCommunitysByVersionInfoIdFunc(datas){
            var _this=this;
            this.$get('/app/version-aggr/version/queryCommunitysByVersionInfoId',datas)
            .then(function (response) {
                
                debugger;
                if (response.data.code==0) {
                    _this.tableData_publishArea= response.data.data;//已选择发布区域列表数据
                    var ddd= JSON.parse(sessionStorage.getItem('mySelect_datas_allCommunity_session'));
                    var selectIds= arrayToAttrArray(_this.tableData_publishArea,'areaId'),
                        index= 0;
                    for (let i = 0,len=ddd.length; i < len; i++) {
                        if (selectIds.indexOf(ddd[i].areaId)<0) {
                            ddd[i].select= false;
                        }else{
                            ddd[i].select= true;
                            ddd[i].isSelect= true;
                            _this.tableData_publishArea[index].areaName= ddd[i].areaName;
                            index++;
                            debugger;
                        }
                        
                    }
                    debugger;
                    _this.mySelect_datas_allCommunity= ddd;
                    var publishArea_ids_session= arrayToAttrArray(_this.tableData_publishArea,'areaId');
                    _this.tableData_publishArea_session= _this.tableData_publishArea;
                    _this.tableData_publishArea_ids_session= publishArea_ids_session;
                    // sessionStorage.setItem('tableData_publishArea_session',JSON.stringify(_this.tableData_publishArea));
                    // sessionStorage.setItem('publishArea_ids_session_session',JSON.stringify(publishArea_ids_session));

                    sessionStorage.setItem('mySelect_datas_allCommunity_session',JSON.stringify(_this.mySelect_datas_allCommunity));
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
        http_queryWorkPatternsFunc(){
            var _this=this;
            this.$get('/app/version-aggr/version/queryWorkPatterns')
            .then(function (response) {
                
                // debugger;
                if (response.data.code==0) {
                    _this.option_work= response.data.data;
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
        http_queryAreaByParent(data,All,checkArray_tree,cur_checkArray){//
            var _this=this;
            this.$get('/app/version-aggr/version/queryAreaByParent',data)
            .then(function (response) {
                console.log('获取树数据');
                debugger;

                if (response.data.code==0) {
                    var msgData=response.data.data;
                    if (checkArray_tree) {//tree回显勾选的节点，并且禁掉；
                        debugger;
                        var msgData=tree_addAttr_a(msgData,checkArray_tree,'disabled','areaId');//禁用
                        if (cur_checkArray) {
                            _this.checkArray_tree= cur_checkArray;
                        }else{
                            // if (All==0) {//全部区域，额外处理
                            //     var attrArray=[];
                            //     var areaIdArray= tree_arrayToAttrArray(msgData,'areaId');
                            //     _this.checkArray_tree= areaIdArray;
                            //     var msgData=tree_addAttr_a(msgData,areaIdArray,'disabled','areaId');//禁用
                            // }else{
                            //     _this.checkArray_tree= checkArray_tree;
                            // }
                            _this.checkArray_tree= checkArray_tree;
                            
                        }
                        
                        debugger;
                    }else{
                        var attrArray=[];
                        var areaIdArray= tree_arrayToAttrArray(msgData,'areaId');
                        _this.checkArray_tree= areaIdArray;
                    }
                    if (All==0) {//全部区域，额外处理
                        var attrArray=[];
                        var areaIdArray= tree_arrayToAttrArray(msgData,'areaId');
                        _this.checkArray_tree= areaIdArray;
                        var msgData=tree_addAttr_a(msgData,areaIdArray,'disabled','areaId');//禁用
                    }
                    var publishArea_ids_session= _this.tableData_publishArea_ids_session;
                    //记录
                    if (_this.checkTree_record_key.indexOf(data.areaId)<0) {
                        _this.checkTree_record_key.push(data.areaId);
                    }
                    _this.checkTree_record[data.areaId] = _this.checkArray_tree;
                    if (publishArea_ids_session.indexOf(data.areaId)>=0) {//记录回显的
                        _this.back_checkTree_record[data.areaId] = _this.checkArray_tree;
                    }
                    debugger;
                    _this.treeDatas= [msgData];
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
        http_queryAreaByCommunityFunc(datas,isAll,cur_checkArray){//tree被勾选的区域范围
            var _this=this;
            this.$get('/app/version-aggr/version/queryAreaByCommunity',datas)
            .then(function (response) {
                
                debugger;
                if (response.data.code==0) {
                    var msgData= response.data.data;
                    
                    var ddd={
                            areaId: datas.communityId
                        }
                    debugger;
                    var is_All=isAll;
                    if (cur_checkArray) {
                        _this.http_queryAreaByParent(ddd,is_All,msgData,cur_checkArray);
                    }else{
                        debugger;
                        _this.http_queryAreaByParent(ddd,is_All,msgData);
                        _this.checkArray_tree= msgData;
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
        http_queryAllProvinceAndCityFunc(){
            var _this=this;
            this.$get('/app/version-aggr/version/queryAllProvinceAndCity')
            .then(function (response) {
                
                // debugger;
                if (response.data.code==0) {
                    _this.mySelect_datas_city= response.data.data;
                    var obj={
                        areaId :"all",
                        areaName: '全部',
                        parentId: 'all',
                    }
                    _this.mySelect_datas_city.unshift(obj);
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
        http_versionInfoTableFunc(data){
            var _this=this;
            this.$get('/app/version-aggr/version/showVersionInfoPage',data)
            .then(function (response) {
                // debugger;
                if (response.data.code==0) {
                    var msgDatas= response.data.data || [];
                    _this.tableData_versionInfo= msgDatas.records;
                    _this.page.total_versionInfo= msgDatas.total;
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
        http_showEquipmentsPageFunc(datas){
            var _this=this;
            this.$get('/app/version-aggr/version/showEquipmentsPage',datas)
            .then(function (response) {
                debugger
                if (response.data.code==0) {
                    var msgDatas= response.data.data || [];
                    // flag，1：升级详情分页，2：设备列表分页，3：已发布设备列表分页
                    if (datas.flag==1) {
                        _this.tableData_equipPage= msgDatas.records;
                        _this.page.total_equipPage= msgDatas.total;
                    }
                    if (datas.flag==2) {
                        //过滤掉待发布列表的数据；
                        // debugger;
                        var recordsDatas= msgDatas.records;
                        var waitSn=arrayToAttrArray(_this.tableData_waitEquipPage,'equipmentSn');
                        var filterData= recordsDatas.filter((item)=>{
                            return waitSn.indexOf(item.equipmentSn)<0;
                        })
                        _this.tableData_equipPage_flag2= filterData;
                        _this.page.total_flag2= msgDatas.total;
                    }
                    if (datas.flag==3) {
                        _this.tableData_publishEquipPage= msgDatas.records;
                        _this.page.total_publishEquipPage= msgDatas.total;
                        debugger;
                    }
                    
                    
                }else{
                    _this.$message({
                        type:'info',
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
            var val=this.option_equipType;
            debugger;
            var prev_val= sessionStorage.getItem('session_moreSelect').split(',');
            debugger;
            prev_val.forEach((item)=>{
                if (val.indexOf(item)<0) {
                    this.option_equipType.push(item);
                }
            })
        },
        removeSelectFunc(tag){
            debugger;
            // this.option_equipType.push(tag);
        },
        uploadChange_videoFunc(file, fileList) {
            console.log(file);
            var type= file.raw.name;
            if (type.indexOf('.apk')<0) {
                this.$message({
                    type: 'info',
                    message: '安装包仅支持.apk文件'
                })
                return false;
            }
            this.curPackageData.fileSize= file.raw.size;
            this.curPackageData.fileName= file.raw.name;

            var formData= new FormData();
            formData.append('file',file.raw);
            debugger;
            this.http_uploadAppPackage(formData);
        },
        http_uploadAppPackage(data){
            var _this=this;
            this.$post('/app/version-aggr/version/uploadAppPackage',data)
            .then(function (response) {
                
                debugger;
                if (response.data.code==0) {
                    _this.curPackageData.packageName= response.data.data.packageName;
                    _this.curPackageData.versionNumber= response.data.data.versionNumber;
                    _this.curPackageData.versionInfoId= response.data.data.versionInfoId;
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
        handleAvatarSuccess(res,file) {
            console.log(file);
        },
        beforeAvatarUploadVideo(file) {
            console.log(file);
            return file;
        },
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size
            }
            this.http_applicationDetailTableFunc(data);
        },
        pageChangeFunc(val,pageArray) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size
            }
            this.http_applicationDetailTableFunc(data);
        },
        pageSizeChangeFunc_versionInfo(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                appInfoId: this.curApplicationInfoData.appInfoId
            }
            this.http_versionInfoTableFunc(datas);
        },
        pageChangeFunc_versionInfo(val,pageArray) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                appInfoId: this.curApplicationInfoData.appInfoId
            }
            this.http_versionInfoTableFunc(datas);
        },
        pageSizeChangeFunc_equipPage(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : 1,
            }
            this.http_showEquipmentsPageFunc(datas);
        },
        pageChangeFunc_equipPage(val,pageArray) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : 1,
            }
            this.http_showEquipmentsPageFunc(datas);
        },
        pageSizeChangeFunc_flag2(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var data2={
                pageNum: this.page.current,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : 2,
            }
            this.http_showEquipmentsPageFunc(data2);
        },
        pageChangeFunc_flag2(val,pageArray) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var data2={
                pageNum: this.page.current,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : 2,
            }
            this.http_showEquipmentsPageFunc(data2);
        },
        pageSizeChangeFunc_publishEquipPage(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var data3={
                pageNum: this.page.current,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : 3,
            }
            this.http_showEquipmentsPageFunc(data3);
        },
        pageChangeFunc_publishEquipPage(val,pageArray) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var data3={
                pageNum: this.page.current,
                pageSize: this.page.size,
                versionInfoId: this.curVersionInfoId,
                flag : 3,
            }
            this.http_showEquipmentsPageFunc(data3);
        },
    },
    created() {
        var data={
            pageNum: this.page.current,
            pageSize: this.page.size
        }
        this.http_applicationDetailTableFunc(data);

        this.http_queryAppTypesFunc();
        this.http_queryAppEncodesFunc();
        this.http_queryEquipmentModelsFunc();

        
        
    },
    filters:{
        capitalize(val){

        }
    },
    computed:{
        // filterData(){
        //     var _this= this;
        //     return this.mySelect_datas_allCommunity.filter((items)=> {
        //         debugger
        //         return items.areaName.indexOf(_this.txt_publishArea)>=0;
        //     });
        // }
    },
    watch:{
        tableData_publishArea(val,old){
            debugger;
            var selectIds= arrayToAttrArray(val,'areaId'),
                ddd= this.mySelect_datas_allCommunity;
            for (let i = 0,len=ddd.length; i < len; i++) {
                if (selectIds.indexOf(ddd[i].areaId)<0) {
                    ddd[i].select= false;
                }else{
                    ddd[i].select= true;
                    ddd[i].isSelect= true;
                }
                
            }
            sessionStorage.setItem('mySelect_datas_allCommunity_session',JSON.stringify(ddd));
        }
    }
}
</script>

/* 
版本发布逻辑：
checkTree_record：格式为{'key':value,'key1':value1};key为社区areaId，value值为勾选的区域范围areaId数组；
checkTree_record_key:存key数组；
《用户每次点击发布区域列表》首先判断checkTree_record_key中是否存有areaId，
如果没有=》分两种情况
1、这个区域id是回显的，那么去后台拿value，并且存到checkTree_record；
2、这个区域id是新增的，那么全部勾选上，并且存到checkTree_record。
如果有=》就直接用value去渲染勾选过的。
《用户操作勾选区域范围》每次操作更新checkTree_record所有勾选的value，并存到checkTree_record；
《用户点击发布按钮》
add_checkTree_record: 遍历checkTree_record，分两种：
社区id是回显的=》把新增的区域范围过滤出来；
社区id是新增的=》分两种：
1、全选了，那么去掉不给后台传；
2、不是全选，那么给后台传新增勾选的；

注意：
1、还有注意回显的区域范围不可取消；非回显数据可以取消；
2、《用户每次点击确认选择社区》判断处理发布范围，发布过的才有isAll；
3、《用户每次点击发布区域列表》分全部区域，指定区域；
4、《点击发布》过滤数据，只要新增的；
 */
 
