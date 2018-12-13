<template>
    <div>
        <div class="f-header">
            <el-row class="btnBox">
                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="addBtn_globalFunc">手动入库</el-button>
                </el-col>
            </el-row>
            <div>
                <h2 class="m_borderLeft_title">查询条件</h2>
            </div>
            <el-row>
                <el-col :span="6">
                    <label>设&nbsp;备&nbsp;SN：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.equipmentSn"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>设备条码：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.equipmentBarcode"></el-input>
                </el-col>
                
                <el-col :span="6">
                    <label>设备类型：</label>
                    <el-select multiple v-model="headInput.equipmentTypes" placeholder="请选择" size="small">
                        <el-option v-for="item in option_equipType"
                        :key="item.id"
                        :label="item.equipmentType"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <label style="text-indent: -28px;">生命周期状态：</label>
                    <el-select multiple v-model="headInput.lifecycles" placeholder="请选择" size="small">
                        <el-option v-for="item in option_lifecycles"
                        :key="item.lifecycleCode"
                        :label="item.lifecycle"
                        :value="item.lifecycleCode">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <label>认证状态：</label>
                    <el-select multiple v-model="headInput.attestationStatuss" placeholder="请选择" size="small">
                        <el-option v-for="item in option_attestationStatuss"
                        :key="item.attestationStatusCode"
                        :label="item.attestationStatus"
                        :value="item.attestationStatusCode">
                        </el-option>
                    </el-select>
                </el-col>
                
                <el-col :span="6">
                    <label>生产批号：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.batchNumber"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>客<em class="aa"></em>户：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.clientName"></el-input>
                </el-col>
                <el-col :span="6">
                    <label>所属小区：</label>
                    <el-input clearable placeholder="请输入查询内容" size="small" v-model="headInput.areaName"></el-input>
                </el-col>
                
            </el-row>
            <el-row>
                <el-col :span="12">
                    <label>设备型号：</label>
                    <el-cascader
                        clearable
                        size="small"
                        :options="option_Cascader"
                        v-model="headInput.equipmentModels"
                        filterable
                        @change="cascaderChange">
                    </el-cascader>
                </el-col>
                <el-col :span="12">
                    <label>入库日期：</label>
                    <el-date-picker
                        v-model="headInput.addTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="small">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-button type="primary" round size="small" @click="query_globalFunc()">查询</el-button>
                <el-button round size="small" @click="reset_globalFunc">重置</el-button>
            </el-row>
        </div>

        <div class="f-contain">
            <div>
                <h2 class="m_borderLeft_title">设备列表</h2>
            </div>
            <el-row class="btnBox">
                <el-button type="primary" :disabled="curEquipStatus== null || curEquipStatus != 1" size="small" plain @click="equipList_btnFunc('a')">出库</el-button>
                <el-button type="primary" :disabled="curEquipStatus== null || curEquipStatus != 2" size="small" plain @click="equipList_btnFunc('b')">退货</el-button>
                <el-button type="primary" :disabled="curEquipStatus== null || curEquipStatus != 1" size="small" plain @click="equipList_btnFunc('c')">报废</el-button>
                <el-button type="primary" :disabled="curWorkStatus== null || curWorkStatus == 0" size="small" plain @click="equipList_btnFunc('d')">切换工作模式</el-button>
                <el-button type="primary" :disabled="curValidateStatus== null || curValidateStatus== 1 || curValidateStatus== 2 || curValidateStatus == 0" size="small" plain @click="equipList_btnFunc('e')">重新认证</el-button>
                <el-button type="danger" :disabled="(curAutoStatus== null || curAutoStatus==0) && curValidateStatus != 1" size="small" plain @click="deleteRowFunc">删除</el-button>
            </el-row>
            <el-table
            ref="ref_global"
            @selection-change="selectionChange_global"
            :data="tableData_global"
            style="width: 100%"
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
                    label="类型"
                    prop="equipmentType"
                    width="80">
                </el-table-column>
                <el-table-column
                    label="设备名称"
                    prop="equipmentModelName"
                    show-overflow-tooltip
                    width="150">
                </el-table-column>
                <el-table-column
                    label="型号"
                    prop="equipmentModel"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="生命周期状态"
                    :formatter="lifecycleCode_format"
                    width="110"
                    prop="lifecycleCode">
                </el-table-column>
                <el-table-column
                    prop="attestationStatusCode"
                    :formatter="attestationStatusCode_format"
                    label="认证状态"
                    width="80"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="equipmentSn"
                    label="设备SN"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="equipmentBarcode"
                    label="设备条码"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="clientName"
                    label="客户"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="areaName"
                    label="所属小区"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="batchNumber"
                    label="生产批号"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="firstEntryDate"
                    label="首次入库时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="workPatternCode"
                    label="工作模式"
                    width="80"
                    :formatter="workPatternCode_format"
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
                            查看
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

        <!-- 弹窗 手动入库-->
        <el-dialog title="手动入库" :visible.sync="dialogFormVisible_nnnn" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <!-- <h3>手动入库</h3> -->
                </div>
                <div class="m_dialogMain" style="margin-top: 20px;">
                    <el-row>
                        <el-col :span="12">
                            <label><i class="i_star">*</i> 设备SN码：</label>
                            <el-input clearable placeholder="请输入内容" size="small" v-model="dialog.equipmentSn"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <label><i class="i_star">*</i> 设备条码：</label>
                            <el-input clearable placeholder="请输入内容" size="small" v-model="dialog.equipmentBarcode"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <label><i class="i_star">*</i> 设备型号：</label>
                            <el-cascader
                                placeholder="请输入内容" 
                                :options="option_Cascader"
                                size="small"
                                v-model="dialog.equipmentModelId"
                                filterable
                                @change="cascaderChange">
                            </el-cascader>
                        </el-col>
                        <el-col :span="12">
                            <label><i class="i_star">*</i> 生产批号：</label>
                            <el-input clearable placeholder="请输入内容" size="small" v-model="dialog.batchNumber"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="handPut_saveFunc">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn=false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗 查看-->
        <el-dialog title="查看" :visible.sync="dialogFormVisible_detail" width="1000px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">{{doorInfo.equipmentModelName}}</h3>
                    <span class="lifecycle">{{doorInfo.lifecycle}}</span>
                </div>
                <div class="m_dialogMain" style="margin-top: 20px;">
                   <div class="headBox">
                       <div class="iconBox">
                           <img :src="doorInfo.equipmentIcon" alt="" width="60" height="60">
                       </div>
                       
                       <div class="infoBox">
                           <el-row>
                               <el-col :span="8">
                                   <label>设备类型</label>：
                                   <span>{{doorInfo.equipmentType}}</span>
                               </el-col>
                               <el-col :span="10">
                                   <label>设备SN码</label>：
                                   <span>{{doorInfo.equipmentSn}}</span>
                               </el-col>
                               <el-col :span="6">
                                   <label>工作模式</label>：
                                   <span>{{doorInfo.workPattern}}</span>
                               </el-col>
                           </el-row>
                           <el-row>
                               <el-col :span="8">
                                   <label>设备型号</label>：
                                   <span>{{doorInfo.equipmentModel}}</span>
                               </el-col>
                               <el-col :span="10">
                                   <label>设备条码</label>：
                                   <span>{{doorInfo.equipmentBarcode}}</span>
                               </el-col>
                               <el-col :span="6">
                                   <label>认证状态</label>：
                                   <span>{{doorInfo.attestationStatus}}</span>
                               </el-col>
                           </el-row>
                           <el-row>
                               <el-col :span="8">
                                   <label>所属小区</label>：
                                   <span>{{doorInfo.areaName}}</span>
                               </el-col>
                           </el-row>
                       </div>
                   </div>
                   <div class="containBox">
                        <el-tabs type="border-card">
                            <el-tab-pane label="生产信息">
                                 <div class="infoBox">
                                    <el-row>
                                        <el-col :span="8">
                                            <label>生成批号</label>：
                                            <span>{{productionInfo.batchNumber}}</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label>生产厂家</label>：
                                            <span>{{productionInfo.manufacturer}}</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <label>生产数量</label>：
                                            <span>{{productionInfo.quantity}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <label>质检报告</label>：
                                            <span>{{productionInfo.qcReportPath}}</span>
                                        </el-col>
                                        <el-col :span="10">
                                            <label>质检通过日期</label>：
                                            <span>{{productionInfo.qcPassDate}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane label="应用信息">
                                <el-table
                                ref="ref_global"
                                :data="tableData_versionInfo"
                                style="width: 840px"
                                size="mini">
                                    <el-table-column
                                        label="应用名称"
                                        width="250"
                                        prop="applicationName">
                                    </el-table-column>
                                    <el-table-column
                                        label="版本号"
                                        width="250"
                                        prop="versionNumber">
                                    </el-table-column>
                                    <el-table-column
                                        label="最新升级时间"
                                        width="340"
                                        prop="versionUpdateTime">
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>

                            <el-tab-pane label="生命周期状态更新记录">
                                <el-table
                                ref="ref_global"
                                :data="tableData_lifeCycle"
                                style="width: 840px"
                                size="mini">
                                    <el-table-column
                                        label="生命周期状态"
                                        prop="lifecycle"
                                        width="150">
                                    </el-table-column>
                                    <el-table-column
                                        label="时间"
                                        prop="createDate"
                                        width="200">
                                        <template slot-scope="scope" v-show="scope.row.$index==1">
                                            <el-tag
                                            :type="primary"
                                            disable-transitions>{{当前状态}}</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        prop="operatedMode"
                                        width="200">
                                    </el-table-column>
                                    <el-table-column
                                        label="详情"
                                        width="290"
                                        prop="detail">
                                    </el-table-column>
                                </el-table>
                                <div style="margin-top: 20px">
                                    <div class="block">
                                        <el-pagination
                                        @size-change="pageSizeChangeFunc_a"
                                        @current-change="pageChangeFunc_a"
                                        :current-page="page.current"
                                        :page-sizes="[20, 50, 100, 200]"
                                        :page-size="page.size"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="page.total_a">
                                        </el-pagination>
                                    </div>
                                </div>

                            </el-tab-pane>

                            <el-tab-pane label="认证记录">
                                 <el-table
                                ref="ref_global"
                                :data="tableData_attestation"
                                style="width: 840px"
                                size="mini">
                                    <el-table-column
                                        label="认证状态"
                                        width="240"
                                        prop="attestationStatus">
                                    </el-table-column>
                                    <el-table-column
                                        label="开始时间"
                                        width="300"
                                        prop="startDate">
                                    </el-table-column>
                                    <el-table-column
                                        label="结束时间"
                                        width="300"
                                        prop="endDate">
                                    </el-table-column>
                                </el-table>
                                <div style="margin-top: 20px">
                                    <div class="block">
                                        <el-pagination
                                        @size-change="pageSizeChangeFunc_b"
                                        @current-change="pageChangeFunc_b"
                                        :current-page="page.current"
                                        :page-sizes="[20, 50, 100, 200]"
                                        :page-size="page.size"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="page.total_b">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                   </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_detail= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 弹窗 出库-->
        <el-dialog title="出库" :visible.sync="dialogFormVisible_aa" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <!-- <h3>手动入库</h3> -->
                </div>
                <div class="m_dialogMain" style="margin-top: 20px;">
                    <el-row>
                        <el-col>
                            <label>出库客户：</label>
                            <el-select v-model="txtClientList" placeholder="请选择" size="small">
                                <el-option v-for="item in option_cientList"
                                :key="item.clientId"
                                :label="item.clientName"
                                :value="item.clientId">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="dialog_saveFunc('a')">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_aa=false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗 退货-->
        <el-dialog title="退货" :visible.sync="dialogFormVisible_bb" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <!-- <h3>手动入库</h3> -->
                </div>
                <div class="m_dialogMain" style="margin-top: 20px;">
                    <el-row>
                        <el-col class="headInfo">
                            <i class="el-icon-warning"></i>
                            <span>设备将被退回，重新入库</span>
                        </el-col>
                        <el-col class="aaaa">
                            <label>退货理由：</label>
                            <el-input type="textarea" v-model="txtEquit"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="dialog_saveFunc('b')">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_bb=false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗 报废-->
        <el-dialog title="报废" :visible.sync="dialogFormVisible_cc" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <!-- <h3>手动入库</h3> -->
                </div>
                <div class="m_dialogMain" style="margin-top: 20px;">
                    <el-row>
                        <el-col class="headInfo">
                            <i class="el-icon-warning"></i>
                            <span>设备将被报废</span>
                        </el-col>
                        <el-col class="aaaa">
                            <label>报废原因：</label>
                            <el-input type="textarea" v-model="txtReject"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="dialog_saveFunc('c')">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_cc= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗 切换工作模式-->
        <el-dialog title="切换工作模式" :visible.sync="dialogFormVisible_dd" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <!-- <h3>手动入库</h3> -->
                </div>
                <div class="m_dialogMain" style="margin-top: 20px;">
                    <el-row>
                        <el-col class="headInfo">
                            <i class="el-icon-warning"></i>
                            <span>工作模式将被设置为：{{curWorkStatus==2 ? '调试' : '生产'}}</span>
                            <p>当前工作模式为：{{curWorkStatus==1 ? '调试' : '生产'}}</p>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="dialog_saveFunc('d')">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_dd= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 弹窗 重新认证-->
        <el-dialog title="重新认证" :visible.sync="dialogFormVisible_ee" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <!-- <h3>手动入库</h3> -->
                </div>
                <div class="m_dialogMain" style="margin-top: 20px;">
                    <el-row>
                        <el-col class="headInfo">
                            <i class="el-icon-warning"></i>
                            <span>认证状态将被重置</span>
                        </el-col>
                    </el-row>
                    <p>请选择重置时效：</p>
                    <el-row>
                        <el-col>
                            <el-radio-group v-model="radio_ee">
                                <el-radio :label="12">12小时</el-radio>
                                <el-radio :label="24">24小时</el-radio>
                                <el-radio :label="48">48小时</el-radio>
                                <el-radio :label="0">自定义</el-radio>
                            </el-radio-group>
                            <el-input :disabled="radio_ee != 0" v-model="input_ee" placeholder="请输入时间"></el-input>
                        </el-col>
                    </el-row>
                     <p>请在此时间段内让设备联网。</p>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="primary" round size="small" @click="dialog_saveFunc('e')">保存</el-button>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_ee= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="scss" scoped>
.f-header {
    label{
        width: 80px;
    }
}
.el-dialog{
    h3{
        display: inline-block;
    }
    label{
        width: 90px;
        display: inline-block;
        text-align: right;
    }
    
    .box{
        margin: 0 20px;
    }
    .el-row{
        margin-bottom: 20px;
    }
    .el-input,.el-cascader{
        width: 180px;
    }
}
.lifecycle{
    background: #F6B836;
    padding: 2px 5px;
    border-radius: 2px;
    color: #fff;
}
.headBox{
    display: flex;
}
.iconBox{
    width: 60px;
}
.infoBox{
    flex: 1;
    color: #999;
    span{
        font-size: 12px;
    }
    
}
.containBox{
    margin-bottom: 20px;
}
.headInfo{
    text-align: center;
    font-size: 16px;
    color: #999;
}
.aaaa{
    display: flex;
    margin-top: 20px;
    labal{
        width: 100px;
    }
}

</style>
<script>
import {arrayToAttrArray} from '@/utils/common.js'

export default {
    data(){
        return {
            headInput:{
                equipmentSn: '',
                equipmentBarcode: '',
                equipmentModels: '',
                equipmentTypes: '',
                attestationStatuss: '',
                batchNumber: '',
                clientName: '',
                areaName: '',
                lifecycles: '',
                addTime: '',
            },
            dialog:{
                batchNumber: '',
                equipmentBarcode: '',
                equipmentModelId: '',
                equipmentSn: '',
            },
            doorInfo:{
                equipmentIcon: '',
                equipmentType: '',
                equipmentSn: '',
                workPatternCode: '',
                equipmentModel: '',
                equipmentBarcode: '',
                attestationStatus: '',
                equipmentModelName: '',
                lifecycle: '',
                areaName: '',
            },
            productionInfo:{
                equipmentType: '',
                manufacturer: '',
                quantity: '',
                qcReportPath: '',
                qcPassDate: '',
            },
            txtClientList: '',
            txtEquit: '',
            radio_ee: 12,
            input_ee: '',
            page:{
                current: 1,
                size: 20,
                total: 0,
                total_a: 0,
                total_b: 0,
            },
            tableData_global:[
                {
                    aaa: '内容'
                },
            ],
            tableData_versionInfo:[],
            tableData_lifeCycle:[],
            tableData_attestation:[],
            option_equipType:[],
            option_lifecycles:[],
            option_attestationStatuss:[],
            option_Cascader:[],
            option_cientList:[],
            curChangeData: null,
            curEquipStatus: null,//1均为入库，2均为出库，3已装机，4报废。其它0；
            curWorkStatus: null,//1均为调试，2均为生产，其它0；
            curValidateStatus: null,//1均为未认证，2均为待认证，3均已认证，4均认证失败，5已认证和认证失败，其它0；
            curAutoStatus: null,//1均为手动入库，其它0；
            allSelectDatas: [],//所以勾选数据
            curEquipData: {},
            txtReject: '',
            dialogFormVisible_nnnn: false,
            dialogFormVisible_detail: false,
            dialogFormVisible_aa: false,
            dialogFormVisible_bb: false,
            dialogFormVisible_cc: false,
            dialogFormVisible_dd: false,
            dialogFormVisible_ee: false,
        }
    },
    methods:{
        query_globalFunc(){
            debugger;
            var equipmentModels= this.transformDataFunc(this.headInput.equipmentModels,'equipmentModels');
            var addTime= this.headInput.addTime,
                datas={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    equipmentSn: this.headInput.equipmentSn || null,
                    equipmentBarcode: this.headInput.equipmentBarcode || null,
                    equipmentModels: equipmentModels,
                    equipmentTypes: this.headInput.equipmentTypes.length >0 ? this.headInput.equipmentTypes.join(',') : null,
                    attestationStatuss: this.headInput.attestationStatuss.length>0 ?  this.headInput.attestationStatuss.join(',') : null,
                    batchNumber: this.headInput.batchNumber || null,
                    clientName: this.headInput.clientName || null,
                    areaName: this.headInput.areaName || null,
                    lifecycles: this.headInput.lifecycles.length >0 ? this.headInput.lifecycles.join(',') : null,
                    addStartTime: addTime ? this.headInput.addTime[0] : null,
                    addEndTime: addTime ? this.headInput.addTime[1] : null,
                }
            this.http_pageTableFunc(datas);
        },
        transformDataFunc(datas,string){
            if (string=='equipmentModels') {
                var re_Datas= [];
                if (datas.length>0) {
                    datas.forEach((item)=>{
                        re_Datas.push(item.split(',')[0]);
                    })
                    re_Datas= re_Datas.join(',');
                }else{
                    re_Datas= null;
                }
            }
            return re_Datas;
        },
        addBtn_globalFunc(){
            this.dialogFormVisible_nnnn= true;
        },
        handPut_saveFunc(){
            debugger;
            var equipmentModels= this.transformDataFunc(this.dialog.equipmentModelId,'equipmentModels');
            var datas={
                batchNumber: this.dialog.batchNumber,
                equipmentBarcode: this.dialog.equipmentBarcode,
                equipmentModelId: equipmentModels.split(',')[1],
                equipmentSn: this.dialog.equipmentSn,
            }
            this.http_handPutStorage(datas);
        },
        http_handPutStorage(datas){
            var _this=this;
            this.$post('/app/equipment-aggr/equipment/handPutStorage',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var ddd= _this.return_queryDatas(_this);
                    _this.http_pageTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '手动入库成功'
                    });
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
        http_popOutStorage(datas){
            var _this=this;
            this.$post('/app/equipment-aggr/equipment/popOutStorage',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var ddd= _this.return_queryDatas(_this);
                    _this.http_pageTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogFormVisible_aa= false;
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
        http_retGoods(datas){
            var _this=this;
            this.$post('/app/equipment-aggr/equipment/retGoods',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var ddd= _this.return_queryDatas(_this);
                    _this.http_pageTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogFormVisible_bb= false;
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
        http_scrapped(datas){
            var _this=this;
            this.$post('/app/equipment-aggr/equipment/scrapped',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var ddd= _this.return_queryDatas(_this);
                    _this.http_pageTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogFormVisible_cc= false;
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
        http_switchWorkPattern(datas){
            var _this=this;
            this.$post('/app/equipment-aggr/equipment/switchWorkPattern',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var ddd= _this.return_queryDatas(_this);
                    _this.http_pageTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogFormVisible_dd= false;
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
        http_attestationEquipmentAgain(datas){
            var _this=this;
            this.$post('/app/equipment-aggr/equipment/attestationEquipmentAgain',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var ddd= _this.return_queryDatas(_this);
                    _this.http_pageTableFunc(ddd);
                    _this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    _this.dialogFormVisible_ee= false;
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
        workPatternCode_format(row, column, cellValue, index){
            // debugger;
            if (cellValue==1) {
                return '调试'
            }
            if (cellValue==2) {
                return '生产'
            }
            
        },
        lifecycleCode_format(row, column, cellValue, index){
            // debugger;
            if (cellValue==1) {
                return '已入库'
            }
            if (cellValue==2) {
                return '已出库'
            }
            if (cellValue==3) {
                return '已装机'
            }
            if (cellValue==4) {
                return '报废'
            }
            
        },
        attestationStatusCode_format(row, column, cellValue, index){
            // debugger;
            if (cellValue==1) {
                return '未认证'
            }
            if (cellValue==2) {
                return '待认证'
            }
            if (cellValue==3) {
                return '已认证'
            }
            if (cellValue==4) {
                return '认证失败'
            }
            
        },
        equipList_btnFunc(type){//'a'出库，'b'退货，'c'报废，
            debugger;
            if (type=='a') {
                this.dialogFormVisible_aa= true;
                this.http_queryClientList();
            }
            if (type=='b') {
                this.dialogFormVisible_bb= true;
            }
            if (type=='c') {
                this.dialogFormVisible_cc= true;
            }
            if (type=='d') {
                this.dialogFormVisible_dd= true;
            }
            if (type=='e') {
                this.dialogFormVisible_ee= true;
            }
        },
        dialog_saveFunc(type){//'a'出库，'b'退货，'c'报废，
            debugger;
            var equipmentIds=arrayToAttrArray(this.allSelectDatas,'equipmentId');
            if (type=='a') {
                var clientId=this.txtClientList;
                
                let aa={
                    clientId: clientId,
                    equipmentIds: equipmentIds,
                }
                this.http_popOutStorage(aa);
            }
            if (type=='b') {
                let bb={
                    equipmentIds: equipmentIds,
                    reason: this.txtEquit,
                }
                this.http_retGoods(bb);
            }
            if (type=='c') {
                let cc={
                    equipmentIds: equipmentIds,
                    reason: this.txtReject,
                }
                this.http_scrapped(cc);
            }
            if (type=='d') {
                let dd={
                    equipmentIds: equipmentIds,
                    targetWorkPattern: this.curWorkStatus==1? '2': '1',
                }
                
                this.http_switchWorkPattern(dd);
            }
            if (type=='e') {
                debugger;
                let ee={
                    equipmentIds: equipmentIds,
                    attestationHourTime: this.radio_ee==0 ? this.input_ee : this.radio_ee,
                }
                debugger;
                this.http_attestationEquipmentAgain(ee);
            }
        },
        reset_globalFunc(){
            this.headInput={
                equipmentSn: '',
                equipmentBarcode: '',
                equipmentModels: [],
                equipmentTypes: [],
                attestationStatuss: [],
                batchNumber: '',
                clientName: '',
                areaName: '',
                lifecycles: [],
                addTime: [],
            }
        },
        detail_Func(index,scope){
            console.log(index);
            this.curEquipData= scope.row;
            debugger;
            this.dialogFormVisible_detail= true;
            var data={
                equipmentId : scope.row.equipmentId
            }
            var aaa={
                productionInfoId : scope.row.productionInfoId
            }
            var bbb={
                pageNum: this.page.current,
                pageSize: this.page.size,
                equipmentId : scope.row.equipmentId
            }
            this.http_queryEquipmentInfo(data);
            this.http_queryEquipmentProductionInfo(aaa);
            this.http_showEquipmentVersionInfoList(data);
            this.http_showLifecycleRecord(bbb);
            this.http_showEquipmentAttestationRecord(bbb);
        },
        http_queryClientList(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryClientList')
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    _this.option_cientList= response.data.data;
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
        http_queryEquipmentInfo(data){
            var _this=this;
            // debugger;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentInfo',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var  filePath=_this.$store.getters.getFilePath;
                    _this.doorInfo= response.data.data;
                    _this.doorInfo.equipmentIcon= filePath+_this.doorInfo.equipmentIcon;
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
        http_queryEquipmentProductionInfo(data){
            var _this=this;
            // debugger;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentProductionInfo',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    _this.productionInfo= response.data.data;
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
        http_showEquipmentVersionInfoList(data){
            var _this=this;
            // debugger;
            this.$get('/app/equipment-aggr/equipment/showEquipmentVersionInfoList',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    _this.tableData_versionInfo= response.data.data.versionInfos;
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
        http_showLifecycleRecord(data){
            var _this=this;
            // debugger;
            this.$get('/app/equipment-aggr/equipment/showLifecycleRecord',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    _this.tableData_lifeCycle= msgDatas.records;
                    _this.page.total_a= msgDatas.total;
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
        http_showEquipmentAttestationRecord(data){
            var _this=this;
            // debugger;
            this.$get('/app/equipment-aggr/equipment/showEquipmentAttestationRecord',data)
            .then(function (response) {
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    _this.tableData_attestation= response.data.data.records;
                    _this.page.total_b= msgDatas.total;
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
        deleteRowFunc(){
            var equipmentIds=arrayToAttrArray(this.allSelectDatas,'equipmentId');
            var datas={
                equipmentIds: equipmentIds
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.http_deleteEquipment(datas);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        selectionChange_global(cur,old){
            console.log(cur);
            this.allSelectDatas= cur;
            debugger;
            if (cur.length>0) {
                var equipArray_all= arrayToAttrArray(cur,'lifecycleCode'),
                validateArray_all= arrayToAttrArray(cur,'attestationStatusCode'),
                workArray_all= arrayToAttrArray(cur,'workPatternCode'),
                autoArray_all= arrayToAttrArray(cur,'isHandPutStorage');
                debugger
                //去重；
                var equipArray= [...new Set(equipArray_all)],
                    validateArray= [...new Set(validateArray_all)],
                    workArray= [...new Set(workArray_all)],
                    autoArray= [...new Set(autoArray_all)];
                if (equipArray.length>1) {
                    this.curEquipStatus = 0
                }else{
                    this.curEquipStatus= equipArray[0];
                }

                if (workArray.length>1) {
                    this.curWorkStatus = 0
                }else{
                    this.curWorkStatus= workArray[0];
                }

                if (autoArray.length>1) {
                    this.curAutoStatus = 0
                }else{
                    this.curAutoStatus= autoArray[0];
                }

                if (validateArray.length>1) {
                    this.curValidateStatus = 0;
                    if(validateArray.indexOf("1")<0 && validateArray.indexOf("2")<0 ){
                        this.curValidateStatus = 5;
                    }
                }else{
                    this.curValidateStatus= validateArray[0];
                }
            }else{
                this.curEquipStatus= null;//1均为入库，2均为出库，3已装机，4报废。其它0；
                this.curWorkStatus= null;//1均为调试，2均为生产，其它0；
                this.curValidateStatus= null;//1均为未认证，2均为待认证，3均已认证，4均认证失败，5已认证和认证失败，其它0；
                this.curAutoStatus= null;//1均为手动入库，其它0；
            }
            

        },
        cascaderChange(value) {
            console.log(value);
        },
        http_pageTableFunc(data){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/showEquipmentPageList',data)
            .then(function (response) {
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    _this.tableData_global= msgDatas.records;
                    _this.curEquipStatus=null;
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
        http_deleteEquipment(datas){
            var _this=this;
            this.$post('/app/equipment-aggr/equipment/deleteEquipment',datas)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var ddd= _this.return_queryDatas(_this);
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
        http_queryLifecycles(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryLifecycles')
            .then(function (response) {
                // debugger;
                if (response.data.code==0) {
                    var datas=response.data.data;
                    _this.option_lifecycles=datas;
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
        http_queryAttestationStatusList(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryAttestationStatusList')
            .then(function (response) {
                // debugger;
                if (response.data.code==0) {
                    var datas=response.data.data;
                    _this.option_attestationStatuss=datas;
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
        http_queryEquipmentTypes(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentTypes')
            .then(function (response) {
                if (response.data.code==0) {
                    var datas=response.data.data;
                    _this.option_equipType=datas;
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
         http_queryModuleAndModels(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentTypeAndModels',{})
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var datas=_this.formatCascaderFunc(response.data.data.content);
                    _this.option_Cascader=datas;
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
                obj.value=data.equipmentTypeId+','+data.equipmentType;
                obj.label=data.equipmentType;
                obj.children=[];
                if(data.equipmentTypeModels.length>0){
                    var childDatas=data.equipmentTypeModels,childArr=[];
                    for(let n=0,len=childDatas.length;n<len;n++){
                        var childData=childDatas[n],childObj={};
                        childObj.label=childData.equipmentModel;
                        childObj.value=childData.equipmentModelId+','+childData.equipmentModel;
                        obj.children[n]=childObj;
                    }
                }
                arr[i]=obj;
            }
            return arr;
        },
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var addTime= this.headInput.addTime,
                equipmentModels= this.transformDataFunc(this.headInput.equipmentModels,'equipmentModels'),
                datas={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    equipmentSn: this.headInput.equipmentSn || null,
                    equipmentBarcode: this.headInput.equipmentBarcode || null,
                    equipmentModels: equipmentModels,
                    equipmentTypes: this.headInput.equipmentTypes.length >0 ? this.headInput.equipmentTypes.join(',') : null,
                    attestationStatuss: this.headInput.attestationStatuss.length>0 ?  this.headInput.attestationStatuss.join(',') : null,
                    batchNumber: this.headInput.batchNumber || null,
                    clientName: this.headInput.clientName || null,
                    areaName: this.headInput.areaName || null,
                    lifecycles: this.headInput.lifecycles.length >0 ? this.headInput.lifecycles.join(',') : null,
                    addStartTime: addTime ? this.headInput.addTime[0] : null,
                    addEndTime: addTime ? this.headInput.addTime[1] : null,
                }
            this.http_pageTableFunc(datas);
        },
        return_queryDatas(_this){
            if (_this) {
                _this= _this;
            }
            var addTime= _this.headInput.addTime,
                equipmentModels= _this.transformDataFunc(_this.headInput.equipmentModels,'equipmentModels'),
                datas={
                    pageNum: _this.page.current,
                    pageSize: _this.page.size,
                    equipmentSn: _this.headInput.equipmentSn || null,
                    equipmentBarcode: _this.headInput.equipmentBarcode || null,
                    equipmentModels: equipmentModels,
                    equipmentTypes: _this.headInput.equipmentTypes.length >0 ? _this.headInput.equipmentTypes.join(',') : null,
                    attestationStatuss: _this.headInput.attestationStatuss.length>0 ?  _this.headInput.attestationStatuss.join(',') : null,
                    batchNumber: _this.headInput.batchNumber || null,
                    clientName: _this.headInput.clientName || null,
                    areaName: _this.headInput.areaName || null,
                    lifecycles: _this.headInput.lifecycles.length >0 ? _this.headInput.lifecycles.join(',') : null,
                    addStartTime: addTime ? _this.headInput.addTime[0] : null,
                    addEndTime: addTime ? _this.headInput.addTime[1] : null,
                };
            return datas;
        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var addTime= this.headInput.addTime,
                equipmentModels= this.transformDataFunc(this.headInput.equipmentModels,'equipmentModels'),
                datas={
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    equipmentSn: this.headInput.equipmentSn || null,
                    equipmentBarcode: this.headInput.equipmentBarcode || null,
                    equipmentModels: equipmentModels,
                    equipmentTypes: this.headInput.equipmentTypes.length >0 ? this.headInput.equipmentTypes.join(',') : null,
                    attestationStatuss: this.headInput.attestationStatuss.length>0 ?  this.headInput.attestationStatuss.join(',') : null,
                    batchNumber: this.headInput.batchNumber || null,
                    clientName: this.headInput.clientName || null,
                    areaName: this.headInput.areaName || null,
                    lifecycles: this.headInput.lifecycles.length >0 ? this.headInput.lifecycles.join(',') : null,
                    addStartTime: addTime ? this.headInput.addTime[0] : null,
                    addEndTime: addTime ? this.headInput.addTime[1] : null,
                }
            this.http_pageTableFunc(datas);
        },
        pageSizeChangeFunc_a(val) {
            console.log(`每页 ${val} 条`);
            var bbb={
                pageNum: this.page.current,
                pageSize: val,
                equipmentId : this.curEquipData.equipmentId
            }
            this.http_showLifecycleRecord(bbb);
        },
        pageChangeFunc_a(val) {
            console.log(`当前页: ${val}`);
            var bbb={
                pageNum: val,
                pageSize: this.page.size,
                equipmentId : this.curEquipData.equipmentId
            }
            this.http_showLifecycleRecord(bbb);
        },
        pageSizeChangeFunc_b(val) {
            console.log(`每页 ${val} 条`);
            var bbb={
                pageNum: this.page.current,
                pageSize: val,
                equipmentId : this.curEquipData.equipmentId,
            }
            this.http_showEquipmentAttestationRecord(bbb);
        },
        pageChangeFunc_b(val) {
            console.log(`当前页: ${val}`);
            var bbb={
                pageNum: val,
                pageSize: this.page.size,
                equipmentId : this.curEquipData.equipmentId,
            }
            this.http_showEquipmentAttestationRecord(bbb);
        },
    },
    created() {
        var data={
            pageNum: this.page.current,
            pageSize: this.page.size,
        }
        this.http_pageTableFunc(data);

        this.http_queryLifecycles();
        this.http_queryAttestationStatusList();
        this.http_queryEquipmentTypes();
        this.http_queryModuleAndModels();
    },
}
</script>


