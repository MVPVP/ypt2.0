<template>
    <div>
        <div class="f-header">
            <el-row>
                <el-col :span="6">
                    <label>输入框：</label>
                    <el-input placeholder="请输入查询内容" size="small" v-model="headInput.hhaa"></el-input>
                </el-col>

                <el-col :span="6">
                    <label>下拉框：</label>
                    <el-select  v-model="headInput.hhbb" placeholder="请选择" size="small" @change="head_selectFunc">
                        <el-option v-for="item in head_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :span="8">
                    <label>添加时间：</label>
                    <el-date-picker
                        v-model="headInput.hhcc"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        size="small">
                    </el-date-picker>
                </el-col>

                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="query_globalFunc()">查询</el-button>
                    <el-button round size="small" @click="reset_globalFunc">重置</el-button>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-col :span="4">
                    <!-- <el-button type="primary" round size="small" @click="addBtn_globalFunc">添加弹窗</el-button> -->
                </el-col>
            </el-row>
        </div>

        <div class="f-contain">
            <el-row>
                <el-col :span="18">
                    <div id="aaaa" :style="{width: '100%', height: '500px'}"></div>
                </el-col>
                <el-col :span="6">
                    <div id="bbbb" :style="{width: '100%', height: '500px'}"></div>
                </el-col>
            </el-row>
            <el-row>
                <div id="cccc" :style="{width: '100%', height: '500px'}"></div>
            </el-row>
            <!-- <el-row>
                <div id="dddddddd" :style="{width: '100%', height: '500px'}"></div>
            </el-row> -->
        </div>

        <!-- 弹窗 -->
        <el-dialog title="设备离线详情" :visible.sync="dialogFormVisible_nnnn" width="1000px">
            <div class="box">
                <!-- <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">小标题</h3>
                </div> -->
                <div class="m_dialogMain">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="离线分布详情" name="first">
                            <el-row>
                                <el-col :span="6">
                                    装机地址：{{dialogInfo.address}}
                                </el-col>
                                <el-col :span="6">
                                    设备SN：{{dialogInfo.sn}}
                                </el-col>
                                <el-col :span="6">
                                    统计日期：{{dialogInfo.date}}
                                </el-col>
                                <el-col :span="6">
                                    离线总次数：{{dialogInfo.count}}
                                </el-col>
                            </el-row>
                            <el-row :span="24">
                                <el-col :span="24">
                                    <div ref="ref_eeee" id="eeee" :style="{width: '875px', height: '500px'}"></div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="离线时长详情" name="second">
                            <el-row>
                                <el-col :span="6">
                                    装机地址：{{dialogInfo.address}}
                                </el-col>
                                <el-col :span="6">
                                    设备SN：{{dialogInfo.sn}}
                                </el-col>
                                <el-col :span="6">
                                    统计日期：{{dialogInfo.date}}
                                </el-col>
                                <el-col :span="6">
                                    离线总次数：{{dialogInfo.count}}
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <div ref="ref_dddd" id="dddd" :style="{width: '875px', height: '500px'}"></div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="离线详情信息" name="third">
                            <el-row class="m_label_text">
                                <el-col :span="12">
                                    <label>装机地址：</label>
                                    <span>恐怕看破可怕可怕</span>
                                </el-col>
                                <el-col :span="12">
                                    <label>设备SN：</label>
                                    <span>恐怕看破可怕可怕</span>
                                </el-col>
                            </el-row>
                            <el-row class="m_label_text">
                                <el-col :span="12">
                                    <label>统计日期：</label>
                                    <span>恐怕看破可怕可怕</span>
                                </el-col>
                                <el-col :span="12">
                                    <label>离线次数：</label>
                                    <span>恐怕看破可怕可怕</span>
                                </el-col>
                            </el-row>
                            <el-row class="m_label_text">
                                <el-col :span="12">
                                    <label>在线时长：</label>
                                    <span>恐怕看破可怕可怕</span>
                                </el-col>
                                <el-col :span="12">
                                    <label>离线时长：</label>
                                    <span>恐怕看破可怕可怕</span>
                                </el-col>
                            </el-row>
                            <el-table
                                ref="ref_able"
                                :data="tableData"
                                :size="mini"
                                style="width: 100%">
                                <el-table-column
                                type="index"
                                width="50">
                                </el-table-column>
                                <el-table-column
                                property="name"
                                label="离线原因"
                                width="350">
                                </el-table-column>
                                <el-table-column
                                property="address"
                                label="离线时长"
                                width="250">
                                </el-table-column>
                                <el-table-column
                                property="date"
                                label="离线时间起止">
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<style lang="scss" scoped>
.f-header{
    label{
        width: 80px;
    }
}
.el-dialog{
    .box{
        margin: 10px 20px;
    }
}
</style>
<script>
export default {
    data(){
        return {
            headInput:{
                hhaa: '',
                hhbb: '',
                hhcc: '',
            },
            page:{
                current: 1,
                size: 20,
                total: 0,
            },
            head_options: [{
                value: '3',
                label: '公告'
            }, {
                value: '2',
                label: '图片'
            }, {
                value: '1',
                label: '视频'
            }],
            dialogFormVisible_nnnn: false,
            activeName: 'first',
            dialogInfo:{
                address: '',
                sn: '',
                date: '',
                count: '',
            },
            tableData: [
                {
                date: '2016-05-02~2018-10-24',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }
            ],
        }
    },
    methods:{
        query_globalFunc(){

        },
        addBtn_globalFunc(){//弹窗
            this.dialogFormVisible_nnnn= true;
            debugger;
            var _this= this;
            setTimeout(() => {
                _this.http_dddd();
                _this.http_eeee();
            }, 0);
            
        },
        reset_globalFunc(){

        },
        head_selectFunc(){

        },
        http_nnnnTableFunc(data){
            // var _this=this;
            // this.$get('/app/content-aggr/content/shownnnnPage',data)
            // .then(function (response) {
            //     console.log(response);
            //     if (response.data.code==0) {
            //         var msg= response.data.data;

            //     }else{
            //         _this.$message({
            //             type: 'info',
            //             message: response.data.msg
            //         })
            //     }
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });
        },
        handleClick(tab, event) {
            console.log(tab, event);
            
        },
        http_aaaa(){
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById("aaaa")),
                xDatas= ["2000-06-05", "2000-06-06", "2000-06-07", "2000-06-08", "2000-06-09"],
                yDatas= [116, 329, 29,10,500];
            var myOption={
                    title: {
                        text: "离线设备数量-总览",
                    },
                    tooltip: {},
                    xAxis: {
                        data: xDatas
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: "离线设备",
                            type: "line",
                            data: yDatas,
                            markLine: {
                                silent: true,
                                data: [{
                                    yAxis: 50
                                }, {
                                    yAxis: 100
                                }, {
                                    yAxis: 150
                                }, {
                                    yAxis: 200
                                }, {
                                    yAxis: 300
                                }]
                            },
                        }
                    ],
                    visualMap: {
                        top: 10,
                        right: 10,
                        pieces: [{
                            gt: 0,
                            lte: 50,
                            color: '#096'
                        }, {
                            gt: 50,
                            lte: 100,
                            color: '#ffde33'
                        }, {
                            gt: 100,
                            lte: 150,
                            color: '#ff9933'
                        }, {
                            gt: 150,
                            lte: 200,
                            color: '#cc0033'
                        }, {
                            gt: 200,
                            lte: 300,
                            color: '#660099'
                        }, {
                            gt: 300,
                            color: '#7e0023'
                        }],
                    },
                };
            // 绘制图表
            myChart.setOption(myOption);
        },
        http_bbbb(){
            var myChart = this.$echarts.init(document.getElementById("bbbb")),
                xDatas= ['离线占比','在线占比'],
                yDatas= [
                    {value:35, name:'离线占比'},
                    {value:310, name:'在线占比'},
                ];
            var myOption= {
                title : {
                    text: '设备离线时长总占比',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    right: 'right',
                    data: xDatas
                },
                series : [
                    {
                        name: '信息',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data: yDatas,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(myOption);
        },
        http_cccc(){
            var _this= this;
            var myChart = this.$echarts.init(document.getElementById("cccc")),
                xDatas= ['门口机一','门口机二','门口机三','门口机四','门口机五','门口机六','门口机七','门口机八','门口机九','门口机零'],
                yDatas_on= [80, 81, 82, 83, 84, 85, 86, 87, 88,89],
                yDatas_down= [20, 19, 18, 17, 16, 15, 14, 13, 12,11];
            var myOption = {
                title: {
                    text: "设备离线时长占比",
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['离线时长占比','在线时长占比']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xDatas
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'离线时长占比',
                        type:'bar',
                        stack: '广告',
                        data:  yDatas_down
                    },
                    {
                        name:'在线时长占比',
                        type:'bar',
                        stack: '广告',
                        data: yDatas_on
                    },
                    
                    
                ]
            };
            myChart.setOption(myOption);
            myChart.on('click',function (params) {
                debugger;
                _this.dialogInfo= {
                    address: params.name,
                    sn: params.name,
                    date: params.name,
                    count: params.name,
                }
                _this.addBtn_globalFunc();
            })
        },
        http_dddd(){
            debugger
            var myChart = this.$echarts.init(document.getElementById("dddd")),
                yDatas= ["2000-06-05", "2000-06-06", "2000-06-07", "2000-06-08", "2000-06-09","2000-06-10", "2000-06-11", "2000-06-12", "2000-06-13", "2000-06-14"],
                xDatas_on= [80, 81, 82, 83, 84, 85, 86, 87, 88,89],
                xDatas_down= [20, 19, 18, 17, 16, 15, 14, 13, 12,11];
            var myOption =  {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['离线时长', '在线时长']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: yDatas
                    },
                    series: [
                        {
                            name: '离线时长',
                            type: 'bar',
                            // stack: '总量',
                            // label: {
                            //     normal: {
                            //         show: true,
                            //         position: 'insideRight'
                            //     }
                            // },
                            data: xDatas_down
                        },
                        {
                            name: '在线时长',
                            type: 'bar',
                            // stack: '总量',
                            // label: {
                            //     normal: {
                            //         show: true,
                            //         position: 'insideRight'
                            //     }
                            // },
                            data: xDatas_on
                        },
                    ]
                };
            myChart.setOption(myOption);
        },
        http_eeee(){
            var _this= this;
            var myChart = this.$echarts.init(document.getElementById("eeee"));
            var data = [];
            var startTime = 0;
            var types = [
                {name: '在线', color: '#2F4554'},
                {name: '离线', color: '#C23531'},
            ];
            var categories= [
                {"2000-06-05":[{0:100},{1:200},{0:300},{1:150},{0:250}]}, 
                {"2000-06-06":[{0:100},{1:200},{0:300},{1:400}]}, 
                {"2000-06-07":[{1:100},{1:200},{0:300},{1:400}]}, 
                {"2000-06-08":[{0:100},{1:200},{1:300},{1:300},{0:10},{1:90}]}, 
                {"2000-06-09":[{1:100},{1:200},{0:300},{1:100},{0:200},{1:100}]}
            ];
            var yDatas=categories.map((item)=>{
                return Object.keys(item)[0]
            })

            // Generate mock data
            this.$echarts.util.each(categories, function (category, index) {
                var baseTime = startTime;
                var timeArray= Object.values(category)[0]
                var dataCount= timeArray.length;
                for (var i = 0; i < dataCount; i++) {
                    var typeItem= types[Object.keys(timeArray[i])[0]];
                    var duration= Object.values(timeArray[i])[0];
                    data.push({
                        name: typeItem.name,
                        value: [
                            index,
                            baseTime,
                            baseTime += duration,
                            duration
                        ],
                        itemStyle: {
                            normal: {
                                color: typeItem.color
                            }
                        }
                    });
                }
            });
            
            function renderItem(params, api) {
                var categoryIndex = api.value(0);
                var start = api.coord([api.value(1), categoryIndex]);
                var end = api.coord([api.value(2), categoryIndex]);
                var height = api.size([0, 1])[1] * 0.6;

                var rectShape = _this.$echarts.graphic.clipRectByRect({
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                }, {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                });

                return rectShape && {
                    type: 'rect',
                    shape: rectShape,
                    style: api.style()
                };
            }

            var myOption = {
                tooltip: {
                    formatter: function (params) {
                        // debugger;
                        return params.marker + params.data.name + ': ' + params.value[3] + 'h';
                    }
                },
                legend: {
                    data: ['离线', '在线']
                },
                // title: {
                //     text: '离线分布详情',
                //     left: 'center'
                // },
                // dataZoom: [{
                //     type: 'slider',
                //     filterMode: 'weakFilter',
                //     showDataShadow: false,
                //     top: 400,
                //     height: 10,
                //     borderColor: 'transparent',
                //     backgroundColor: '#e2e2e2',
                //     handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                //     handleSize: 20,
                //     handleStyle: {
                //         shadowBlur: 6,
                //         shadowOffsetX: 1,
                //         shadowOffsetY: 2,
                //         shadowColor: '#aaa'
                //     },
                //     labelFormatter: ''
                // }, {
                //     type: 'inside',
                //     filterMode: 'weakFilter'
                // }],
                // grid: {
                //     height:300
                // },
                xAxis: {
                    min: startTime,
                    scale: true,
                    axisLabel: {
                        formatter: function (val) {
                            return Math.max(val) + 'h';
                        }
                    }
                },
                yAxis: {
                    data: yDatas
                },
                series: [{
                    type: 'custom',
                    renderItem: renderItem,
                    itemStyle: {
                        normal: {
                            opacity: 0.8
                        }
                    },
                    encode: {
                        x: [1, 2],
                        y: 0
                    },
                    data: data
                },
                {
                    name: '离线',
                    color: types[1].color,
                    type: 'bar',
                },
                {
                    name: '在线',
                    color: types[0].color,
                    type: 'bar',
                }]
            };

            myChart.setOption(myOption);
        }
        
    },
    mounted() {
        this.http_aaaa();
        this.http_bbbb();
        this.http_cccc();
    }
}
</script>


