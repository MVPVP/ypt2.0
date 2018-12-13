<!-- <p>v5MOhIsz4tPIROKshVmD4WC9UFH5UFcX</p> -->
<template>
<div>
    <baidu-map 
    :center="center" 
    :zoom="zoom" 
    @ready="handler" 
    :scroll-wheel-zoom="true"
    class="bm-view">
        <div class="header" >
            <bm-control  anchor="BMAP_ANCHOR_TOP_LEFT" :offset="zzz" class="m_communityBox">
                <div class="box1" v-show="toggleBool">
                    <el-select v-model="value" placeholder="请选择社区" clearable>
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                
                <div class="box2" v-show="!toggleBool">
                    <el-tabs type="border-card">
                        <el-tab-pane label="设备账号">
                            <el-input
                            placeholder="请输入设备账号"
                            v-model="input_equipmentAccount"
                            clearable>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-tab-pane>
                        <el-tab-pane label="设备SN">
                            <el-input
                            placeholder="请输入设备SN"
                            v-model="input_equipmentSn"
                            clearable>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-tab-pane>
                        <el-tab-pane label="SIP账号">
                            <el-input
                            placeholder="请输入SIP账号"
                            v-model="input_sipAccount"
                            clearable>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-tab-pane>
                        <el-tab-pane label="装机地址">
                            <el-row>
                                <el-col>
                                    <input v-model="input_areaId" @click="mySelect_toggleFunc(mySelectBox_visible)" type="text" class="m_selectOptions">
                                </el-col>
                            </el-row>
                            <div class="m_mySelectBox" v-show="mySelectBox_visible">
                                <div class="treeBox1">
                                    <el-tree 
                                    :data="treeData" 
                                    :props="defaultProps" 
                                    :default-expand-all="true"
                                    :expand-on-click-node="false"
                                    @node-click="handleNodeClick">
                                    </el-tree>
                                </div>
                                <div class="treeBox2">
                                    <ul>
                                        <li v-for="items in treeBox2_datas" :key="items" @click="treeBox2_Func(items)">{{items}}</li>
                                    </ul>
                                </div>
                                
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <el-button class="btn" @click="communityBtnFunc(toggleBool)">{{toggleBool ? '精准定位' : '模糊搜索'}}</el-button>
            </bm-control>

            <bm-control  anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="aaa">
                <el-select v-model="value_onlineStatus" placeholder="请选择状态" clearable>
                    <el-option
                    v-for="item in options_onlineStatus"
                    :key="item.status"
                    :label="item.name"
                    :value="item.status">
                    </el-option>
                </el-select>
            </bm-control>
            <bm-control  anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="bbb">
                <el-select v-model="value_onlineLevel" placeholder="请选择监控级别" clearable>
                    <el-option
                    v-for="item in options_onlineLevel"
                    :key="item.monitoringLevel"
                    :label="item.name"
                    :value="item.monitoringLevel">
                    </el-option>
                </el-select>
            </bm-control>
        </div>
        <bm-view class="bm-view"></bm-view>
        <!-- <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT"></bm-scale> -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type> -->
        
        <bm-point-collection :points="points" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_SMALL" @click="clickHandler"></bm-point-collection>

        <bm-marker 
        @click="infoWindowOpen" 
        :position="{lng: 113.415767, lat: 23.177493}" 
        :dragging="true" 
        :icon="{url:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTgiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgOTggMTUwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8dGl0bGU+ZHVvaHVpLWVsZW1lbnQ8L3RpdGxlPgo8ZGVzYz5DcmVhdGVkIHVzaW5nIEZpZ21hPC9kZXNjPgo8ZyBpZD0iQ2FudmFzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIxNiAxNDApIj4KPGNsaXBQYXRoIGlkPSJjbGlwLTAiIGNsaXAtcnVsZT0iZXZlbm9kZCI+CjxwYXRoIGQ9Ik0gMjIxNiAtMTQwTCAyMzE0IC0xNDBMIDIzMTQgMTBMIDIyMTYgMTBMIDIyMTYgLTE0MFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9jbGlwUGF0aD4KPGcgaWQ9ImR1b2h1aS1lbGVtZW50IiBjbGlwLXBhdGg9InVybCgjY2xpcC0wKSI+CjxwYXRoIGQ9Ik0gMjIxNiAtMTQwTCAyMzE0IC0xNDBMIDIzMTQgMTBMIDIyMTYgMTBMIDIyMTYgLTE0MFoiIGZpbGw9IiNGRkZGRkYiLz4KPGcgaWQ9IkR1b2h1aSBJY29uIDIiPgo8ZyBpZD0iVmVjdG9yIj4KPHVzZSB4bGluazpocmVmPSIjcGF0aDBfZmlsbCIgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNjYzNiAwIDAgMS4yMTkyOSAyMjMwIC03NS43MDM4KSIgZmlsbD0iIzNBODhGRCIvPgo8L2c+CjxnIGlkPSJWZWN0b3IiPgo8dXNlIHhsaW5rOmhyZWY9IiNwYXRoMV9maWxsIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjQxNTM0IDAgMCAxLjIxODM0IDIyMjYgLTExMikiIGZpbGw9IiMzNUFGRkIiLz4KPC9nPgo8L2c+CjwvZz4KPC9nPgo8ZGVmcz4KPHBhdGggaWQ9InBhdGgwX2ZpbGwiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTSAyNS43NzIyIDEuMDA2MzVDIDI2LjIgMC4zNzQ5ODMgMjYuODk0OSAtMi42NjEzZS0wNyAyNy42MzQ5IC0yLjY2MTNlLTA3QyAyOC4zNzU1IC0yLjY2MTNlLTA3IDI5LjA2OTkgMC4zNzQ5ODMgMjkuNDk4MyAxLjAwNjM1QyAzNC40MDkgOC4yNDk2NCA0Ny43OTggMjcuOTk2NCA1NC41OTg2IDM4LjAyNjJDIDU1LjM4NzggMzkuMTkwMSA1NS40ODk2IDQwLjcxNjIgNTQuODYyMyA0MS45ODNDIDU0LjIzNSA0My4yNDk4IDUyLjk4MzMgNDQuMDQ1MiA1MS42MTc4IDQ0LjA0NTJDIDM5LjY2OTQgNDQuMDQ1MiAxNS42MDEgNDQuMDQ1MiAzLjY1MjEgNDQuMDQ1MkMgMi4yODcxMiA0NC4wNDUyIDEuMDM1NDUgNDMuMjQ5OCAwLjQwODE3MyA0MS45ODNDIC0wLjIxOTEwNiA0MC43MTYyIC0wLjExNzM1MyAzOS4xOTAxIDAuNjcxODA0IDM4LjAyNjJDIDcuNDcyNDIgMjcuOTk2NCAyMC44NjA5IDguMjQ5NjQgMjUuNzcyMiAxLjAwNjM1WiIvPgo8cGF0aCBpZD0icGF0aDFfZmlsbCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNIDI0Ljk5MzkgMS40NDcwM0MgMjUuNjEzNyAwLjUzMzExNyAyNi41NTcyIC0zLjAxNjE0ZS0wNyAyNy41NTUxIC0zLjAxNjE0ZS0wN0MgMjguNTUzNSAtMy4wMTYxNGUtMDcgMjkuNDk3IDAuNTMzMTE3IDMwLjExNjggMS40NDcwM0MgMzUuNDY3NCA5LjMzODU0IDQ3Ljg3MjUgMjcuNjM0MiA1NC40MDQzIDM3LjI2ODFDIDU1LjE4MjUgMzguNDE1NyA1NS4zMjk5IDM5Ljk4MiA1NC43ODQ3IDQxLjI5OTlDIDU0LjIzODkgNDIuNjE4NSA1My4wOTYgNDMuNDU1NiA1MS44NDI2IDQzLjQ1NTZDIDM5LjkwMjMgNDMuNDU1NiAxNS4yMDg0IDQzLjQ1NTYgMy4yNjgxMSA0My40NTU2QyAyLjAxNDcxIDQzLjQ1NTYgMC44NzE3MzkgNDIuNjE4NSAwLjMyNTk3OCA0MS4yOTk5QyAtMC4yMTk3ODMgMzkuOTgyIC0wLjA3MTc4MTMgMzguNDE1NyAwLjcwNjM5IDM3LjI2ODFDIDcuMjM4MTggMjcuNjM0MiAxOS42NDMzIDkuMzM4NTQgMjQuOTkzOSAxLjQ0NzAzWiIvPgo8L2RlZnM+Cjwvc3ZnPgo=',size: {width:60,height:60}}">
            <bm-info-window :position="{lng: 113.415767, lat: 23.177493}" title="设备信息" size="20px" :show="infoWindow.show"  @close="infoWindowClose" @open="infoWindowOpen">
                <div class="m_infoWindowBox">
                    <!-- <p v-text="infoWindow.contents"></p> -->
                    <p>
                        <label>装机地址：</label><span>放松的方式对付对手</span>
                    </p>
                    <p>
                        <label>在线状态：</label><span>时的方式的方式对付</span>
                    </p>
                    <p>
                        <label>操<em class="aa"></em>作：</label>
                        <span>
                            <el-button size="mini">设备重启</el-button>
                            <el-button size="mini">软件重启</el-button>
                            <el-button size="mini">门口机视频监控</el-button>
                        </span>
                    </p>
                    <p>
                        <label>监控信息：</label><span style="color:#f00;">【设备故障】-控制板无响应</span>
                    </p>
                    <div class="btnBox">
                        <el-button type="text"  @click="aaaa">处理</el-button>
                        <el-button type="text"  @click="bbbb">取消提醒</el-button>
                        <el-button type="text"  @click="cccc">详情&gt;&gt;</el-button>
                    </div>
                    
                </div>
                
            </bm-info-window>
        </bm-marker>

    </baidu-map>
    <!-- 弹窗 处理-->
    <el-dialog title="监控信息处理" :visible.sync="dialogFormVisible_nnnn" width="800px">
        <div class="box">
            <div class="m_dialogHead">
                <h3 class="m_borderLeft_title">{{errorStatus==1 ? '警告' :(errorStatus==2 ? '错误' : '故障')}}处理</h3>
            </div>
            <div class="m_dialogMain">
                <el-row class="m_label_text">
                    <el-col>
                        <label>装机地址：</label>
                        <span>恐怕看破可怕可怕</span>
                    </el-col>
                </el-row>
                <el-row class="m_label_text">
                    <el-col :span="12">
                        <label>设备SN：</label>
                        <span>恐怕看破可怕可怕</span>
                    </el-col>
                    <el-col :span="12">
                        <label>设备账号：</label>
                        <span>恐怕看破可怕可怕</span>
                    </el-col>
                </el-row>
                <el-row class="m_label_text">
                    <el-col :span="12">
                        <label>SIP账号：</label>
                        <span>恐怕看破可怕可怕</span>
                    </el-col>
                    <el-col :span="12">
                        <label>发生时间：</label>
                        <span>恐怕看破可怕可怕</span>
                    </el-col>
                </el-row>
                <el-row class="m_label_text">
                    <el-col>
                        <label>监控信息：</label>
                        <span>恐怕看破可怕可怕恐怕看破可怕可怕</span>
                    </el-col>
                </el-row>
                <el-row class="m_label_text">
                    <el-col>
                        <label>描述：</label>
                        <span>恐怕看破可怕可怕恐怕看破可怕可怕</span>
                    </el-col>
                </el-row>
                <el-row class="m_label_text" v-show="errorStatus==2 || errorStatus==3">
                    <el-col>
                        <label>错误编码：</label>
                        <span>110101</span>
                    </el-col>
                </el-row>
                <el-row class="m_label_text" v-show="errorStatus==2 || errorStatus==3">
                    <el-col>
                        <label>错误详情：</label>
                        <span>恐怕看破可怕可怕恐怕看破可怕可怕</span>
                    </el-col>
                </el-row>
                <el-row class="m_label_text">
                    <el-row>
                        <label>处理人：</label>
                        <el-input
                        size="small "
                        placeholder="请输入内容"
                        v-model="input_aa"
                        clearable>
                        </el-input>
                    </el-row>
                </el-row>
                <el-row class="m_label_text">
                    <el-row>
                        <label>处理时间：</label>
                        <el-input
                        size="small "
                        placeholder="请输入内容"
                        v-model="input_aa"
                        clearable>
                        </el-input>
                    </el-row>
                </el-row>
                <el-row class="m_label_text">
                    <el-row>
                        <label>处理意见：</label>
                        <el-input
                        size="small "
                        placeholder="请输入内容"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 6 }"
                        v-model="input_aa"
                        clearable>
                        </el-input>
                    </el-row>
                </el-row>
            </div>
        </div>

        <div slot="footer" class="dialog-footer">
            <div>
                <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn= false">关闭</el-button>
            </div>
        </div>
    </el-dialog>
    <!-- 弹窗 详情-->
    <el-dialog title="监控详情页" :visible.sync="dialogFormVisible_detail" width="900px">
        <div class="box">
            <div class="m_dialogHead">
                <h3 class="m_borderLeft_title">******</h3>
            </div>
            <div class="m_dialogMain">
                <el-form size="small">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="告警状态：" :label-width="formLabelWidth">
                                <el-select v-model="input_aa" placeholder="请选择">
                                    <el-option v-for="item in option_datas"
                                    :key="item.aaa"
                                    :label="item.aaa" 
                                    :value="item.aaa">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="监控级别：" :label-width="formLabelWidth">
                                <el-select v-model="input_aa" placeholder="请选择">
                                    <el-option v-for="item in option_datas"
                                    :key="item.aaa"
                                    :label="item.aaa" 
                                    :value="item.aaa">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="监控类型：" :label-width="formLabelWidth">
                                <el-select v-model="input_aa" placeholder="请选择">
                                    <el-option v-for="item in option_datas"
                                    :key="item.aaa"
                                    :label="item.aaa" 
                                    :value="item.aaa">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="处理状态：" :label-width="formLabelWidth">
                                <el-select v-model="input_aa" placeholder="请选择">
                                    <el-option v-for="item in option_datas"
                                    :key="item.aaa"
                                    :label="item.aaa" 
                                    :value="item.aaa">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="btnBox">
                        <el-col :span="18">
                            <el-form-item label="添加时间：" :label-width="formLabelWidth">
                                <el-date-picker
                                    v-model="input_aa"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" round size="small" @click="query_aaaa">查询</el-button>
                            <el-button round size="small" @click="reset_aaaa">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                ref="ref_global"
                :data="tableData_bbbb"
                style="width: 100%"
                border
                size="mini">
                    <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        label="装机地址"
                        width="180px"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="设备SN"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="设备账号"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="SIP账号"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="监控级别"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="监控类型"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="描述"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="告警状态"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="发生时间"
                        prop="aaa">
                    </el-table-column>
                    <el-table-column
                        label="处理状态"
                        prop="aaa">
                    </el-table-column>
                    
                    <el-table-column
                        label="操作"
                        fixed="right"
                        width="60">
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="tttt(scope)"
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
        </div>

        <div slot="footer" class="dialog-footer">
            <div>
                <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn= false">关闭</el-button>
            </div>
        </div>

        <!-- 弹窗 详情查看-->
        <el-dialog append-to-body title="监控信息" :visible.sync="dialogFormVisible_append" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">{{errorStatus==1 ? '警告' :(errorStatus==2 ? '错误' : (errorStatus==3 ? '故障':(errorStatus==4 ?'信息': '调试日志')))}}详情</h3>
                </div>
                <div class="m_dialogMain">
                    <el-row class="m_label_text">
                        <el-col>
                            <label>装机地址：</label>
                            <span>恐怕看破可怕可怕</span>
                        </el-col>
                    </el-row>
                    <el-row class="m_label_text">
                        <el-col :span="12">
                            <label>设备SN：</label>
                            <span>恐怕看破可怕可怕</span>
                        </el-col>
                        <el-col :span="12">
                            <label>设备账号：</label>
                            <span>恐怕看破可怕可怕</span>
                        </el-col>
                    </el-row>
                    <el-row class="m_label_text">
                        <el-col :span="12">
                            <label>SIP账号：</label>
                            <span>恐怕看破可怕可怕</span>
                        </el-col>
                        <el-col :span="12">
                            <label>发生时间：</label>
                            <span>恐怕看破可怕可怕</span>
                        </el-col>
                    </el-row>
                    
                    <div v-show="errorStatus==1 ||errorStatus==2 || errorStatus==3">
                        <el-row class="m_label_text">
                            <el-col>
                                <label>监控信息：</label>
                                <span>恐怕看破可怕可怕恐怕看破可怕可怕</span>
                            </el-col>
                        </el-row>
                        <el-row class="m_label_text">
                            <el-col>
                                <label>描述：</label>
                                <span>恐怕看破可怕可怕恐怕看破可怕可怕</span>
                            </el-col>
                        </el-row>
                        <div v-show="errorStatus==2 || errorStatus==3">
                            <el-row class="m_label_text">
                                <el-col>
                                    <label>错误编码：</label>
                                    <span>110101</span>
                                </el-col>
                            </el-row>
                            <el-row class="m_label_text">
                                <el-col>
                                    <label>错误详情：</label>
                                    <span>恐怕看破可怕可怕恐怕看破可怕可怕</span>
                                </el-col>
                            </el-row>
                        </div>
                        <el-row class="m_label_text">
                            <el-col>
                                <label>处理人：</label>
                                <el-input
                                size="small "
                                disabled
                                placeholder="请输入内容"
                                v-model="input_aa"
                                clearable>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row class="m_label_text">
                            <el-col>
                                <label>处理时间：</label>
                                <el-input
                                size="small "
                                disabled
                                placeholder="请输入内容"
                                v-model="input_aa"
                                clearable>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row class="m_label_text">
                            <el-col>
                                <label>处理意见：</label>
                                <el-input
                                size="small "
                                disabled
                                placeholder="请输入内容"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 6 }"
                                v-model="input_aa"
                                clearable>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-show="errorStatus==4">
                        <el-row class="m_label_text">
                            <el-col :span="12">
                                <label>系统版本：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                            <el-col :span="12">
                                <label>开机时间：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                        </el-row>
                        <el-row class="m_label_text">
                            <el-col :span="12">
                                <label style="text-indent: -1em;">控制板固件版本：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                            <el-col :span="12">
                                <label style="text-indent: -1em;">蓝牙固件版本：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                        </el-row>
                        <el-row class="m_label_text">
                            <el-col :span="12">
                                <label>剩余存储：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                            <el-col :span="12">
                                <label>剩余内存：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                        </el-row>
                        <el-row class="m_label_text">
                            <el-col :span="12">
                                <label>CPU使用率：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                            <el-col :span="12">
                                <label>CPU温度：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                        </el-row>
                        <el-row class="m_label_text">
                            <el-col :span="12">
                                <label>应用编码：</label>
                                <span>恐怕看破可怕可怕</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-show="errorStatus==5">
                        <el-row class="m_label_text">
                            <el-col>
                                <label>日志文件：</label>
                                <span>98369872.zip</span>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_append= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </el-dialog>
</div>
    
</template>

<script>
export default {
    data () {
        return {
            page:{
                current: 1,
                size: 20,
                total: 0,
            },
            center: {lng: 0, lat: 0},
            zoom: 3,
            options: [{
            value: '选项1',
            label: '黄金糕'
            }, {
            value: '选项2',
            label: '双皮奶'
            }],
            options_onlineLevel:[],
            options_onlineStatus:[],
            value_onlineLevel: null,
            value_onlineStatus: null,
            value: '',
            zzz:{
                width: 100,
                height: 10
            },
            bbb:{
                width: 50,
                height: 10
            },
            aaa:{
                width: 300,
                height: 10
            },
            points: [],
            infoWindow: {
                show: true,
            },
            errorStatus: 2,//警告1，错误2，故障3，4信息，5调试日志；
            toggleBool: true,
            input_aa: '',
            input_equipmentAccount: '',
            input_equipmentSn: '',
            input_sipAccount: '',
            input_areaId: '',
            mySelectBox_visible: false,
            treeData: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                    label: '三级 1-1-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            treeBox2_datas: [],
            dialogFormVisible_nnnn: false,
            dialogFormVisible_detail: false,
            dialogFormVisible_append: false,
            option_datas: [],
            tableData_bbbb: [{},{},{}],
            formLabelWidth: '110px',
            
            
        }
    },
    methods: {
        handler ({BMap, map}) {
            console.log(BMap, map)
            this.center.lng = 113.415767
            this.center.lat = 23.177493
            this.zoom = 18
        },

        communityBtnFunc(toggleBool){
            this.toggleBool= !toggleBool;
        },
        mySelect_toggleFunc(bool){
            // debugger;
            this.mySelectBox_visible= !bool;
            
        },
        handleNodeClick(data) {
            console.log(data);
            this.treeBox2_datas=['据了解了十分简单理解','32ljljlsjflj']
        },
        treeBox2_Func(items){
            this.input_areaId= items;
            this.mySelectBox_visible= false;
            this.treeBox2_datas= [];
        },
        addPoints () {
            const points = [];
            for (var i = 0; i < 10; i++) {
                const position = {lng: Math.random() * 0.1 + 113.4, lat: Math.random() * 0.1 + 23.1}
                points.push(position)
            }
            this.points = points;
            console.log(this.points);
        },
        clickHandler (e) {
            alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`);
        },
        infoWindowClose (e) {
            this.infoWindow.show = false
        },
        infoWindowOpen (e) {
            this.infoWindow.show = true
        },

        aaaa(){
            this.dialogFormVisible_nnnn= true;
        },
        cccc(){
            this.dialogFormVisible_detail= true;
        },
        bbbb(){
            var _this=this;
            this.$notify.error({
                title: '设备故障',
                dangerouslyUseHTMLString: true,
                message: '<div style="color: red;">【故障】这是一条错误的提示消息</div>',
                position: 'bottom-right',
                duration: 0,
                onClick: function ddddd(params) {
                    _this.infoWindowOpen();
                }
            });
        },
        query_aaaa(){

        },
        reset_aaaa(){

        },
        tttt(scope){
            this.dialogFormVisible_append= true;
        },
        http_nnnnTableFunc(data){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/showEquipmentMonitoringList',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var msg= response.data.data;
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
        query_equipList(){
            var datas={
                areaId: this.input_areaId,
                equipmentAccount: this.input_equipmentAccount,
                equipmentSn: this.input_equipmentSn,
                monitoringLevel: this.value_onlineLevel,
                monitoringStatus: this.value_onlineStatus,
                sipAccount: this.input_sipAccount,
            }
            this.http_showEquipmentMonitoringList(datas);
        },
        http_showEquipmentMonitoringList(datas){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/showEquipmentMonitoringList',datas)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
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
        http_queryEquipmentOnlineLevel(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentMonitoringLevel')
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var msgDatas= response.data.data,
                        allNumber= 0,
                        options=[];
                    debugger
                    for (let i = 0; i < msgDatas.length; i++) {
                        var obj={};
                        obj.monitoringLevel= msgDatas[i].monitoringLevel;
                        obj.name= msgDatas[i].name+'('+msgDatas[i].number+')';
                        options.push(obj);
                        allNumber+= Number(msgDatas[i].number);
                    }
                    options.unshift({monitoringLevel: null,name: '监控级别：全部('+allNumber+')'});
                    _this.options_onlineLevel= options;
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
        http_queryEquipmentOnlineStatus(){
            var _this=this;
            this.$get('/app/equipment-aggr/equipment/queryEquipmentOnlineStatus')
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    var msgDatas= response.data.data,
                        allEquip= 0,
                        leave,
                        online,
                        options=[];
                    debugger;
                    // 0等于离线，1等于在线
                    for (let i = 0; i < msgDatas.length; i++) {
                        var obj= {};
                        obj.name= msgDatas[i].name+'('+msgDatas[i].number+')';
                        obj.status= msgDatas[i].status;
                        options.push(obj);
                        allEquip+= Number(msgDatas[i].number)
                    }
                    options.unshift({status: null,name: '设备状态：全部('+allEquip+')'})
                    _this.options_onlineStatus= options;
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

        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            this.page.current= val;

        },
    },
    created() {
        this.addPoints();
        var data={
            
        }
        // this.http_nnnnTableFunc(data);
        this.http_queryEquipmentOnlineLevel();
        this.http_queryEquipmentOnlineStatus();
    },
}
</script>
<style scoped  lang="scss">
.bm-view {
    width: 100%;
    height: 700px;
}
.m_communityBox {
    .box1,.box2{
        display: inline-block;
    }
    .btn{
        vertical-align: top;
    }
}
.m_mySelectBox{
    min-height: 100px;
    max-height: 250px;
    border: 1px solid #ccc;
    border-radius: 0 0 3px 3px;
    margin-top: 2px;
    display: flex;
    .treeBox1{
        flex: 0.7;
    }
    .treeBox2{
        flex: 0.3;
        li{
            line-height: 15px;
            padding: 5px;
            background: #eee;
            border-radius: 2px;
            margin: 2px;
            cursor: pointer;
        }
        li:hover{
            background: #ddd;
        }
    }
 }
.header{
    /* margin: 20px; */

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
.m_infoWindowBox{
    p{
        line-height: 30px;
        color: #666;
        label{
            margin-right: 10px;
            width: 90px;
            text-align: right;
            display: inline-block;
        }
    }
    .btnBox{
        text-align: right;
    }
}
.el-dialog{
    .box{
        padding: 0 20px 20px 20px;
    }
    .m_label_text{
        .el-input,.el-textarea{
            display: inline-block;
            width: 570px;
        }
    }
    .el-date-editor{
        width: 340px;
    }
}
</style>
