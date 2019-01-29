<style lang="scss" scoped>
#app_gm {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    position: relative;
    overflow-x: auto;
    width: 100%;
    .cont {
        position: relative;
        margin: 20px 0;
    }
}
</style>
<style lang="scss">
.ivu-table td.cell_21 {
    background: #c2d69a;
}
.ivu-table td.cell_11 {
    background: #d7e4bc;
}
.ivu-table td.cell_1 {
    background: #eaf1dd;
}
.ivu-table td.cell_0 {
    background: #f2dddc;
}
</style>

<template>
    <div id="app_gm">
        <div class="cont">
            <header-filter @getFuncData="getGRDD"></header-filter>
        </div>
        <!-- 新增玩家 -->
        <div class="cont">
            <Spin fix v-if="viewParam.loading_gms_retain">
                <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
            
            <div class="box">
                <div class="toggleshow">
                    <ButtonGroup size="small">
                        <Button
                            :type="viewParam.gms_retain_graphical ? 'success' : 'default'"
                            @click="show_graphical('gms_retain')"
                        >图形</Button>
                        <Button
                            :type="viewParam.gms_retain_table ? 'success' : 'default'"
                            @click="show_table('gms_retain')"
                        >表格</Button>
                    </ButtonGroup>
                </div>
                <div class="header">
                    <div class="title">新增玩家</div>
                    <div class="subtitle" style="line-height:24px;text-align:left;">
                        SUM 设备 | 账号：{{gmsViewData.sum_device}} | {{gmsViewData.sum_account}} &nbsp;&nbsp;&nbsp;&nbsp; 
                        <br>AVG 设备 | 账号：{{gmsViewData.avg_device}} | {{gmsViewData.avg_account}}
                    </div>
                    <div class="btn-func">
                        <Button class="export" title="导出数据" @click="exportData('gms')">
                            <Icon type="md-download" size="18"/>
                        </Button>
                        <Button
                            @mouseenter.native="showTips('gms_retain')"
                            @mouseleave.native="hideTips('gms_retain')"
                        >
                            <Icon type="md-help" size="18"/>
                        </Button>
                        <div ref="gms_retain-tips" class="tips">新增设备：所选筛选条件下，当日新增加的激活设备量。
                            <br>新增角色：所选筛选条件下，当日新增加的玩家的UID。（只计算第一次注册的UID，当日第二次及以上激活的计入滚服角色）
                            <br>转化率：所选筛选条件下，新增激活设备中创建UID的玩家比例。
                        </div>
                    </div>
                </div>
                <div class="detail" id="simplechart">
                    <div v-show="viewParam.gms_retain_graphical">
                        <highcharts-component
                            :options="gmsViewData.options"
                            :styles="styles"
                            ref="gms_chart"
                        ></highcharts-component>
                    </div>
                    <div v-show="viewParam.gms_retain_table">
                        <h2></h2>
                        <Table
                            border
                            :columns="gmsViewData.columns"
                            :data="gmsViewData.historyData"
                            ref="gms_table"
                        ></Table>
                    </div>
                </div>
                <div class="pagefoot" v-show="viewParam.gms_retain_table">
                    <Page
                        :total="gmsViewData.dataCount"
                        :page-size="gmsViewData.pageSize"
                        :current="gmsViewData.current"
                        simple
                        @on-change="changePage_newGm"
                    ></Page>
                </div>
            </div>
        </div>

        <!-- 新增角色留存 -->
        <div class="cont">
            <Spin fix v-if="viewParam.loading_role_retain">
                <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
            <div class="box">
                <div class="toggleshow">
                    <ButtonGroup size="small">
                        <Button
                            :type="viewParam.role_retain_graphical ? 'success' : 'default'"
                            @click="show_graphical('role_retain')"
                        >图形</Button>
                        <Button
                            :type="viewParam.role_retain_table ? 'success' : 'default'"
                            @click="show_table('role_retain')"
                        >表格</Button>
                    </ButtonGroup>
                </div>
                <div class="header">
                    <div class="title">{{roleViewData.table_title}}</div>
                    <div class="subtitle">
                        <!-- 统计的是新增{{roleViewData.subtitle}}的次留/3/7/30/180日的留存 &nbsp;&nbsp;  -->
                        AVG 次留：{{roleViewData.avg_day1}}%
                    </div>
                    <div class="btn-func">
                        <Button class="export" title="导出数据" @click="exportData('role')">
                            <Icon type="md-download" size="18"/>
                        </Button>
                        <Button
                            @mouseenter.native="showTips('role_retain')"
                            @mouseleave.native="hideTips('role_retain')"
                        >
                            <Icon type="md-help" size="18"/>
                        </Button>
                        <div ref="role_retain-tips" class="tips">
                            <span v-show="viewParam.role_type=='role'">
                                新增角色留存：所选筛选条件下，当日新增的UID中，在该日后的第N日中，仍然进行游戏的UID比例。
                                <br>例如：5月3日新增UID为100个，这100中有24个在5月10日这一天内还有玩过游戏，5月3日的7日留存率=24/100=24%
                            </span>
                            <span v-show="viewParam.role_type=='device'">
                                新增设备留存：所选筛选条件下，当日新增的设备中，在该日后的第N日中，还有进行游戏的设备比例。
                                <br>例如：5月3日新增设备为100，其中24个设备在5月10日这一天内还有玩过游戏，5月3日的7日留存率=24/100=24%。
                            </span>
                        </div>
                    </div>
                </div>
                <div class="selroletype">
                    <Button
                        :type="viewParam.role_type=='role' ? 'success' : 'default'"
                        @click="selType('role')"
                    >新增角色</Button>
                    <Button
                        :type="viewParam.role_type=='device' ? 'success' : 'default'"
                        @click="selType('device')"
                    >新增设备</Button>
                </div>
                <div class="detail">
                    <div v-show="viewParam.role_retain_graphical">
                        <highcharts-component
                            :options="roleViewData.options"
                            :styles="styles"
                            ref="role_chart"
                        ></highcharts-component>
                    </div>
                    <div v-show="viewParam.role_retain_table">
                        <Table
                            border
                            :columns="roleViewData.columns"
                            :data="roleViewData.historyData"
                            ref="role_table"
                        ></Table>
                    </div>
                </div>
                <div class="pagefoot" v-show="viewParam.role_retain_table">
                    <Page
                        :total="roleViewData.dataCount"
                        :page-size="roleViewData.pageSize"
                        :current="roleViewData.current"
                        simple
                        @on-change="changePage_role"
                    ></Page>
                </div>
            </div>
        </div>

        <!-- 详情留存 -->
        <div class="cont">
            <Spin fix v-if="viewParam.loading_detail_retain">
                <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
            <div class="box" style="height:750px;">
                <div class="header">
                    <div class="title">详情留存</div>
                    <div class="btn-func">
                        <Button class="export" title="导出数据" @click="exportData('detail')">
                            <Icon type="md-download" size="18"/>
                        </Button>
                        <Button
                            @mouseenter.native="showTips('detail_retain')"
                            @mouseleave.native="hideTips('detail_retain')"
                        >
                            <Icon type="md-help" size="18"/>
                        </Button>
                        <div
                            ref="detail_retain-tips"
                            class="tips"
                        >详细留存：所选筛选条件下，当日新增/活跃的UID中，在该日后的第N日中，仍然活跃的UID比例。</div>
                    </div>
                </div>
                <Select
                    v-model="detailViewData.user_type"
                    @on-change="getDetailRet"
                    size="small"
                    style="width:100px;position:absolute;top:40px;left:100px;"
                >
                    <Option value="1" selected>新玩家</Option>
                    <Option value="2">老玩家</Option>
                </Select>
                <div class="detail" style="height:605px">
                    <Table
                        border
                        :columns="detailViewData.columns"
                        :data="detailViewData.data"
                        ref="detail_table"
                        size="small"
                        height="600"
                    ></Table>
                </div>
                <div class="pagefoot" v-show="false">
                    <Page
                        :total="detailViewData.dataCount"
                        :page-size="detailViewData.pageSize"
                        :current="detailViewData.current"
                        simple
                        @on-change="changePage_detail"
                    ></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapActions } from "vuex";

import HeaderFilter from "./HeaderFilter.vue";
import Highcharts from "highcharts/highstock";
import HighchartsComponent from "./HighchartsComponent.vue";

export default {
    name: "app_gm",
    data() {
        return {
            // 页面数据参数
            dataParam: {
                goldUnit: this.$store.state.is_oversea ? '$' : '￥',
            },
            viewParam: {
                // 页面显示相关参数
                loading_gms_retain: false,
                loading_role_retain: false,
                loading_detail_retain: false,
                gms_retain_graphical: true,
                gms_retain_table: false,
                role_retain_graphical: true,
                role_retain_table: false,
                device_retain_graphical: true,
                device_retain_table: false,
                exportfilename: "新增角色留存",
                role_type: "role" // 'role' 'device'
            },
            // 新增玩家
            gmsViewData: {
                options: {
                    credits: {
                        enabled: false //去除版权信息
                    },
                    chart: {
                        zoomType: 'x',
                        resetZoomButton: {
                            position: {
                                align: 'right',
                                verticalAlign: 'top',
                                x: -50,
                                y: 50,
                            }
                        }
                    },
                    title: {
                        text: "",
                        align: "left",
                        x: 100,
                        y: 30
                    },
                    subtitle: {
                        text: ``
                    },
                    xAxis: {
                        categories: [],
                        crosshair: true // 鼠标滑过点时的十字准星线
                    },
                    yAxis: [
                        {
                            title: {
                                text: "数量",
                                style: {
                                    color: Highcharts.getOptions().colors[3]
                                }
                            },
                            labels: {
                                format: "{value}",
                                style: {
                                    color: Highcharts.getOptions().colors[3]
                                }
                            },
                            lineWidth: 2
                            // lineColor: '#F33',
                            // opposite: true // 设置为true将y轴显示在右侧,默认在左侧
                        },
                        {
                            title: {
                                text: "", // 新增账号数
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: "{value}",
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            }
                            // opposite: true
                        },
                        {
                            title: {
                                text: "转化率",
                                style: {
                                    color: Highcharts.getOptions().colors[5]
                                }
                            },
                            labels: {
                                format: "{value}%",
                                style: {
                                    color: Highcharts.getOptions().colors[5]
                                }
                            },
                            opposite: true
                        }
                    ],
                    tooltip: {
                        shared: true,
                        valueDecimals: 0
                    },
                    legend: {
                        layout: "horizontal", // "horizontal" 或 "vertical" 即水平布局和垂直布局 默认是：horizontal.
                        align: "center",
                        x: 0,
                        verticalAlign: "top",
                        y: 0,
                        floating: false,
                        backgroundColor:
                            (Highcharts.theme &&
                                Highcharts.theme.legendBackgroundColor) ||
                            "#FFFFFF"
                    },
                    series: [
                        {
                            name: "新增设备数", // 鼠标移动到图形中显示的标题
                            type: "column",
                            yAxis: 0, // y轴显示的坐标，对应yAxis数组中的数据，0是第一个
                            data: [],
                            color: Highcharts.getOptions().colors[3]
                        },
                        {
                            name: "新增账号数",
                            type: "column",
                            data: [],
                            color: Highcharts.getOptions().colors[0]
                        },
                        {
                            name: "转化率",
                            yAxis: 2,
                            tooltip: {
                                valuePrefix: "",
                                valueSuffix: "%",
                                valueDecimals: 2
                            },
                            data: [],
                            color: Highcharts.getOptions().colors[5]
                        },{
                            name: "事件",
                            type: "scatter",
                            showInLegend: false, // 是否显示在图例中
                            data: [],
                            tooltip: {
                                headerFormat: '',
                                pointFormatter: function () {
                                    return '<b>' + this.name + '</b><br/>';
                                }
                            },
                            marker: { // 数据点的样式
                                enabled: true,
                                fillColor: 'red',
                                radius: 6,
                                symbol: 'circle',
                            },
                        }
                    ],
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }]
                    }
                },
                columns: [
                    {
                        title: "日期",
                        key: "stat_date"
                    },
                    {
                        title: "新增设备",
                        key: "new_device"
                    },
                    {
                        title: "新增角色",
                        key: "new_user"
                    },
                    {
                        title: "转化率(%)",
                        key: "rate",
                    }
                ],
                data: [],
                sum_device: 0,
                sum_account: 0,
                avg_device: 0,
                avg_account: 0,
                historyData: [],
                dataCount: 0, // 初始化总条数
                pageSize: 7, // 每页显示多少条
                current: 1 // 当前页
            },
            // 角色
            roleViewData: {
                options: {
                    credits: {
                        enabled: false //去除版权信息
                    },
                    chart: {
                        zoomType: 'x',
                        resetZoomButton: {
                            position: {
                                align: 'right',
                                verticalAlign: 'top',
                                x: -50,
                                y: 50,
                            }
                        }
                    },
                    title: {
                        text: ""
                    },
                    subtitle: {
                        text: "",
                        align: "left",
                        x: 100,
                        y: 0
                    },
                    xAxis: {
                        categories: [],
                        crosshair: true // 鼠标滑过点时的十字准星线
                    },
                    yAxis: [
                        {
                            floor: 0, // y轴下限
                            ceiling: 100, // y轴上限
                            title: {
                                text: "留存率",
                                style: {
                                    color: Highcharts.getOptions().colors[5]
                                }
                            },
                            labels: {
                                format: "{value}%",
                                style: {
                                    color: Highcharts.getOptions().colors[5]
                                }
                            }
                        }
                    ],
                    tooltip: {
                        shared: true,
                        valueDecimals: 2,
                        valuePrefix: "",
                        valueSuffix: "%"
                    },
                    legend: {
                        layout: "horizontal", // "horizontal" "vertical"
                        align: "center",
                        x: 0,
                        verticalAlign: "top",
                        y: 0,
                        floating: false,
                        backgroundColor:
                            (Highcharts.theme &&
                                Highcharts.theme.legendBackgroundColor) ||
                            "#FFFFFF"
                    },
                    series: [
                        {
                            name: "次留",
                            yAxis: 0,
                            data: [],
                            color: Highcharts.getOptions().colors[3]
                        },
                        {
                            name: "3留",
                            data: [],
                            color: Highcharts.getOptions().colors[0]
                        },
                        {
                            name: "7留",
                            data: [],
                            color: Highcharts.getOptions().colors[5]
                        },
                        {
                            name: "30留",
                            data: [],
                            color: Highcharts.getOptions().colors[6]
                        },
                        {
                            name: "180留",
                            data: [],
                            color: Highcharts.getOptions().colors[7]
                        },{
                            name: "事件",
                            type: "scatter",
                            showInLegend: false, // 是否显示在图例中
                            data: [],
                            tooltip: {
                                headerFormat: '',
                                pointFormatter: function () {
                                    return '<b>' + this.name + '</b><br/>';
                                }
                            },
                            marker: { // 数据点的样式
                                enabled: true,
                                fillColor: 'red',
                                radius: 6,
                                symbol: 'circle',
                            },
                        }
                    ],
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }]
                    }
                },
                columns: [
                    {
                        title: "日期",
                        key: "stat_date"
                    },
                    {
                        title: "次留(%)",
                        key: "day1",
                    },
                    {
                        title: "3留(%)",
                        key: "day3",
                    },
                    {
                        title: "7留(%)",
                        key: "day7",
                    },
                    {
                        title: "30留(%)",
                        key: "day30",
                    },
                    {
                        title: "180留(%)",
                        key: "day180",
                    }
                ],
                data: [],
                table_title: "新增角色留存", // '新增设备留存'
                subtitle: 'ID', // 设备
                avg_day1: 0,
                avg_day1_copy: 0,
                historyData: [],
                dataCount: 0, // 初始化总条数
                pageSize: 7, // 每页显示多少条
                current: 1 // 当前页
            },
            // 设备
            deviceViewData: {
                options: {
                    credits: {
                        enabled: false //去除版权信息
                    },
                    chart: {
                        zoomType: 'x',
                        resetZoomButton: {
                            position: {
                                align: 'right',
                                verticalAlign: 'top',
                                x: -50,
                                y: 50,
                            }
                        }
                    },
                    title: {
                        text: ""
                    },
                    subtitle: {
                        text:"",
                        align: "left",
                        x: 100,
                        y: 0
                    },
                    xAxis: {
                        categories: [],
                        crosshair: true // 鼠标滑过点时的十字准星线
                    },
                    yAxis: [
                        {
                            title: {
                                text: "留存率",
                                style: {
                                    color: Highcharts.getOptions().colors[5]
                                }
                            },
                            labels: {
                                format: "{value}%",
                                style: {
                                    color: Highcharts.getOptions().colors[5]
                                }
                            }
                        }
                    ],
                    tooltip: {
                        shared: true,
                        valueDecimals: 2
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            }
                        }
                    },
                    legend: {
                        layout: "horizontal", // "horizontal" "vertical"
                        align: "center",
                        x: 0,
                        verticalAlign: "top",
                        y: 0,
                        floating: false,
                        backgroundColor:
                            (Highcharts.theme &&
                                Highcharts.theme.legendBackgroundColor) ||
                            "#FFFFFF"
                    },
                    series: [
                        {
                            name: "次留",
                            yAxis: 0,
                            data: [],
                            color: Highcharts.getOptions().colors[3]
                        },
                        {
                            name: "3留",
                            data: [],
                            color: Highcharts.getOptions().colors[0]
                        },
                        {
                            name: "7留",
                            data: [],
                            color: Highcharts.getOptions().colors[5]
                        },
                        {
                            name: "30留",
                            data: [],
                            color: Highcharts.getOptions().colors[6]
                        },
                        {
                            name: "180留",
                            data: [],
                            color: Highcharts.getOptions().colors[7]
                        },{
                            name: "事件",
                            type: "scatter",
                            showInLegend: false, // 是否显示在图例中
                            data: [],
                            tooltip: {
                                headerFormat: '',
                                pointFormatter: function () {
                                    return '<b>' + this.name + '</b><br/>';
                                }
                            },
                            marker: { // 数据点的样式
                                enabled: true,
                                fillColor: 'red',
                                radius: 6,
                                symbol: 'circle',
                            },
                        }
                    ],
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }]
                    }
                },
                columns: [
                    {
                        title: "日期",
                        key: "stat_date"
                    },
                    {
                        title: "次留(%)",
                        key: "day1",
                    },
                    {
                        title: "3留(%)",
                        key: "day3",
                    },
                    {
                        title: "7留(%)",
                        key: "day7",
                    },
                    {
                        title: "30留(%)",
                        key: "day30",
                    },
                    {
                        title: "180留(%)",
                        key: "day180",
                    },{
                        name: "事件",
                        type: "scatter",
                        showInLegend: false, // 是否显示在图例中
                        data: [],
                        tooltip: {
                            headerFormat: '',
                            pointFormatter: function () {
                                return '<b>' + this.name + '</b><br/>';
                            }
                        },
                        marker: { // 数据点的样式
                            enabled: true,
                            fillColor: 'red',
                            radius: 6,
                            symbol: 'circle',
                        },
                    }
                ],
                data: [],
                avg_day1: 0,
            },
            // 详情
            detailViewData: {
                user_type: '1',
                columns: [
                    {
                        title: "时间",
                        key: "stat_date"
                    },
                    {
                        title: "用户数",
                        key: "user_num"
                    },
                    {
                        title: "次留(%)",
                        key: "day1",
                    },
                    {
                        title: "2留(%)",
                        key: "day2",
                    },
                    {
                        title: "3留(%)",
                        key: "day3",
                    },
                    {
                        title: "5留(%)",
                        key: "day5",
                    },
                    {
                        title: "7留(%)",
                        key: "day7",
                    },
                    {
                        title: "14留(%)",
                        key: "day14",
                    },
                    {
                        title: "30留(%)",
                        key: "day30",
                    },
                    {
                        title: "60留(%)",
                        key: "day60",
                    },
                    {
                        title: "90留(%)",
                        key: "day90",
                    },
                    {
                        title: "180留(%)",
                        key: "day180",
                    }
                ],
                data: [],
                historyData: [],
                dataCount: 0, // 初始化总条数
                pageSize: 2000, // 每页显示多少条
                current: 1 // 当前页
            },
            styles: {
                width: window.innerWidth < 1600 ? window.innerWidth < 1400 ? 600 : 800 : 1200,
                height: 400
            },
            clientWidth: '',
            event_list: this.$store.state.event_list,
        };
    },
    computed: {
        start_time: {
            get() {
                return this.$store.state.filter.start_time
            },
            set(v) {
                this.$store.commit('StartTime', v)
            }
        },
        end_time: {
            get() {
                return this.$store.state.filter.end_time
            },
            set(v) {
                this.$store.commit('EndTime', v)
            }
        },
        device_type: {
            get() {
                return this.$store.state.filter.device_type
            },
            set(v) {
                this.$store.commit('DeviceType', v)
            }
        },
        area: {
            get() {
                return this.$store.state.filter.area
            },
            set(v) {
                this.$store.commit('Area', v)
            }
        },
        channel: {
            get() {
                return this.$store.state.filter.channel
            },
            set(v) {
                this.$store.commit('Channel', v)
            }
        },
        server: {
            get() {
                return this.$store.state.filter.server
            },
            set(v) {
                this.$store.commit('Server', v)
            }
        },
        checkAll_server: {
            get() {
                return this.$store.state.filter.checkAll_server
            },
            set(v) {
                this.$store.commit('checkAll_server', v)
            }
        },
        checkAll_area: {
            get() {
                return this.$store.state.filter.checkAll_area
            },
            set(v) {
                this.$store.commit('checkAll_area', v)
            }
        },
        checkAll_channel: {
            get() {
                return this.$store.state.filter.checkAll_channel
            },
            set(v) {
                this.$store.commit('checkAll_channel', v)
            }
        },
    },
    components: {
        HighchartsComponent,
        HeaderFilter
    },
    mounted() {
        // this.clientWidth = `${document.documentElement.clientWidth}`;
        const that = this;
        window.onresize = function temp() {
            // that.clientWidth = `${document.documentElement.clientWidth}`;
            // that.$refs.gms_chart.chart.setSize(that.clientWidth*0.55, 400);
            // that.$refs.role_chart.chart.setSize(that.clientWidth*0.55, 400);
            let chartContWidth = document.getElementById('simplechart').offsetWidth;
            that.$refs.gms_chart.chart.setSize(chartContWidth*0.975, 400);
            that.$refs.role_chart.chart.setSize(chartContWidth*0.975, 400);
        };
        this.getNewGms();
        this.getNewRoles();
        this.getNewDevice();
        this.getDetailRet();
    },
    methods: {
        ...mapActions({
            newGms: "newGms/getNewGms",
            role_residue: "newGms/getUser_retention",
            device_residue: "newGms/getDevice_retention",
            detail_residue: "newGms/getRetention_detail"
        }),
        getGRDD() {
            this.getNewGms();
            this.getNewRoles();
            this.getNewDevice();
            this.getDetailRet();
            this.viewParam.role_type = "role";
        },
        // 新增玩家
        getNewGms() {
            this.viewParam.loading_gms_retain = true;
            this.newGms({
                appid: this.$route.params.app_id,
                start_time: this.start_time
                    ? this.start_time
                    : this.transDatePre15(new Date()),
                end_time: this.end_time
                    ? this.transDateNext(this.end_time)
                    : this.transDateNext(new Date()),
                device_type: this.device_type,
                channel_ids: this.arrToString(this.channel),
                server_ids: this.arrToString(this.server),
                area: this.arrToString(this.area)
            })
                .then(res => {
                    // 返回数据
                    if (res && res.code == 1) {
                        res.data = [];
                        res.code = 0;
                    }
                    if (res && res.code == 0) {
                        this.gmsViewData.options.xAxis.categories = [];
                        for (var key in this.gmsViewData.options.series) {
                            this.gmsViewData.options.series[key].data = [];
                        }
                        for (var key in res.data) {
                            this.gmsViewData.options.series[0].data.push(
                                res.data[key].new_device
                            );
                            this.gmsViewData.options.series[1].data.push(
                                res.data[key].new_user
                            );
                            this.gmsViewData.options.series[2].data.push(
                                res.data[key].rate * 100
                            );
                            this.gmsViewData.options.xAxis.categories.push(
                                this.transDateMsec(res.data[key].stat_date)
                            );
                        }
                        // 事件
                        let xArr = this.gmsViewData.options.xAxis.categories;
                        for( var i in this.event_list) {
                            for(var j in xArr) {
                                if(this.event_list[i].date == xArr[j]) {
                                    let title = this.event_list[i].title;
                                    this.gmsViewData.options.series[3].data.push(
                                        {
                                            color: "red",
                                            name: title,
                                            x: j,
                                            y: 0,
                                        }
                                    );
                                }
                            }
                        }

                        let sum_device = 0,
                            sum_account = 0,
                            avg_device = 0,
                            avg_account = 0;
                        for (let v of this.gmsViewData.options.series[0].data) {
                            sum_device += v;
                        }
                        this.gmsViewData.sum_device = sum_device;
                        this.gmsViewData.avg_device = (
                            sum_device /
                            this.gmsViewData.options.series[0].data.length
                        ).toFixed(0);
                        for (let v of this.gmsViewData.options.series[1].data) {
                            sum_account += v;
                        }
                        this.gmsViewData.sum_account = sum_account;
                        this.gmsViewData.avg_account = (
                            sum_account /
                            this.gmsViewData.options.series[1].data.length
                        ).toFixed(0);

                        let rtdata = res.data;
                        for (var key in rtdata) {
                            rtdata[key].stat_date = this.transDateMsec(
                                rtdata[key].stat_date
                            );
                            rtdata[key].rate = (Number(rtdata[key].rate)*100).toFixed(2);
                        }
                        this.gmsViewData.data = rtdata;
                        this.chart = this.$refs.gms_chart.chart.update(
                            this.gmsViewData.options
                        ); // 更新图表

                        this.gmsViewData.dataCount = this.gmsViewData.data.length;
                        // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                        if (
                            this.gmsViewData.data.length <
                            this.gmsViewData.pageSize
                        ) {
                            this.gmsViewData.historyData = this.gmsViewData.data;
                        } else {
                            this.gmsViewData.historyData = this.gmsViewData.data.slice(
                                0,
                                this.gmsViewData.pageSize
                            );
                        }
                    }
                    this.viewParam.loading_gms_retain = false;
                })
                .catch(msg => {
                    console.log(msg);
                    this.$Message.error(msg);
                    this.viewParam.loading_gms_retain = false;
                });
        },
        changePage_newGm(index) {
            // console.log(`第${index}页`);
            var _start = (index - 1) * this.gmsViewData.pageSize;
            var _end = index * this.gmsViewData.pageSize;
            this.gmsViewData.historyData = this.gmsViewData.data.slice(
                _start,
                _end
            );
        },
        // 角色
        getNewRoles() {
            this.viewParam.loading_role_retain = true;
            this.role_residue({
                appid: this.$route.params.app_id,
                start_time: this.start_time
                    ? this.start_time
                    : this.transDatePre15(new Date()),
                end_time: this.end_time
                    ? this.transDateNext(this.end_time)
                    : this.transDateNext(new Date()),
                device_type: this.device_type,
                channel_ids: this.arrToString(this.channel),
                server_ids: this.arrToString(this.server),
                area: this.arrToString(this.area)
            })
                .then(res => {
                    // 返回数据
                    if (res && res.code == 1) {
                        res.data = [];
                        res.code = 0;
                    }
                    if (res && res.code == 0) {
                        this.roleViewData.options.xAxis.categories = [];
                        for (var key in this.roleViewData.options.series) {
                            this.roleViewData.options.series[key].data = [];
                        }
                        for (var key in res.data) {
                            this.roleViewData.options.series[0].data.push(
                                res.data[key].day1 * 100
                            );
                            this.roleViewData.options.series[1].data.push(
                                res.data[key].day3 * 100
                            );
                            this.roleViewData.options.series[2].data.push(
                                res.data[key].day7 * 100
                            );
                            this.roleViewData.options.series[3].data.push(
                                res.data[key].day30 * 100
                            );
                            this.roleViewData.options.series[4].data.push(
                                res.data[key].day180 * 100
                            );
                            this.roleViewData.options.xAxis.categories.push(
                                this.transDateMsec(res.data[key].stat_date)
                            );
                        }
                        // 事件
                        let xArr = this.roleViewData.options.xAxis.categories;
                        for( var i in this.event_list) {
                            for(var j in xArr) {
                                if(this.event_list[i].date == xArr[j]) {
                                    let title = this.event_list[i].title;
                                    this.roleViewData.options.series[5].data.push(
                                        {
                                            color: "red",
                                            name: title,
                                            x: j,
                                            y: 0,
                                        }
                                    );
                                }
                            }
                        }
                        
                        let avg_day1 = 0;
                        for (let v of this.roleViewData.options.series[0].data) {
                            avg_day1 += v;
                        }
                        this.roleViewData.avg_day1 = (
                            avg_day1 /
                            this.roleViewData.options.series[0].data.length
                        ).toFixed(2);
                        this.roleViewData.avg_day1_copy = this.roleViewData.avg_day1;

                        let rtdata = res.data;
                        for (var key in rtdata) {
                            rtdata[key].stat_date = this.transDateMsec(
                                rtdata[key].stat_date
                            );
                            rtdata[key].day1 = (Number(rtdata[key].day1)*100).toFixed(2);
                            rtdata[key].day3 = (Number(rtdata[key].day3)*100).toFixed(2);
                            rtdata[key].day7 = (Number(rtdata[key].day7)*100).toFixed(2);
                            rtdata[key].day30 = (Number(rtdata[key].day30)*100).toFixed(2);
                            rtdata[key].day180 = (Number(rtdata[key].day180)*100).toFixed(2);
                        }
                        this.roleViewData.data = rtdata;
                        this.roleViewData.table_data = rtdata;
                        this.chart = this.$refs.role_chart.chart.update(
                            this.roleViewData.options
                        ); // 更新图表

                        this.roleViewData.dataCount = this.roleViewData.table_data.length;
                        // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                        if (
                            this.roleViewData.table_data.length <
                            this.roleViewData.pageSize
                        ) {
                            this.roleViewData.historyData = this.roleViewData.table_data;
                        } else {
                            this.roleViewData.historyData = this.roleViewData.table_data.slice(
                                0,
                                this.roleViewData.pageSize
                            );
                        }
                    }
                    this.viewParam.loading_role_retain = false;
                })
                .catch(msg => {
                    console.log(msg);
                    this.$Message.error(msg);
                    this.viewParam.loading_role_retain = false;
                });
        },
        changePage_role(index) {
            // console.log(`第${index}页`);
            var _start = (index - 1) * this.roleViewData.pageSize;
            var _end = index * this.roleViewData.pageSize;
            this.roleViewData.historyData = this.roleViewData.table_data.slice(
                _start,
                _end
            );
        },
        // 设备
        getNewDevice() {
            this.device_residue({
                appid: this.$route.params.app_id,
                start_time: this.start_time
                    ? this.start_time
                    : this.transDatePre15(new Date()),
                end_time: this.end_time
                    ? this.transDateNext(this.end_time)
                    : this.transDateNext(new Date()),
                device_type: this.device_type,
                channel_ids: this.arrToString(this.channel),
                area: this.arrToString(this.area)
            })
                .then(res => {
                    // 返回数据
                    if (res && res.code == 1) {
                        res.data = [];
                        res.code = 0;
                    }
                    if (res && res.code == 0) {
                        this.deviceViewData.options.xAxis.categories = [];
                        for (var key in this.deviceViewData.options.series) {
                            this.deviceViewData.options.series[key].data = [];
                        }
                        for (var key in res.data) {
                            this.deviceViewData.options.series[0].data.push(
                                parseFloat(
                                    (res.data[key].day1 * 100).toFixed(2)
                                )
                            );
                            this.deviceViewData.options.series[1].data.push(
                                parseFloat(
                                    (res.data[key].day3 * 100).toFixed(2)
                                )
                            );
                            this.deviceViewData.options.series[2].data.push(
                                parseFloat(
                                    (res.data[key].day7 * 100).toFixed(2)
                                )
                            );
                            this.deviceViewData.options.series[3].data.push(
                                parseFloat(
                                    (res.data[key].day30 * 100).toFixed(2)
                                )
                            );
                            this.deviceViewData.options.series[4].data.push(
                                parseFloat(
                                    (res.data[key].day180 * 100).toFixed(2)
                                )
                            );
                            this.deviceViewData.options.xAxis.categories.push(
                                this.transDateMsec(res.data[key].stat_date)
                            );
                        }
                        // 事件
                        let xArr = this.deviceViewData.options.xAxis.categories;
                        for( var i in this.event_list) {
                            for(var j in xArr) {
                                if(this.event_list[i].date == xArr[j]) {
                                    let title = this.event_list[i].title;
                                    this.deviceViewData.options.series[5].data.push(
                                        {
                                            color: "red",
                                            name: title,
                                            x: j,
                                            y: 0,
                                        }
                                    );
                                }
                            }
                        }

                        let avg_day1 = 0;
                        for (let v of this.deviceViewData.options.series[0].data) {
                            avg_day1 += v;
                        }
                        this.deviceViewData.avg_day1 = (
                            avg_day1 /
                            this.deviceViewData.options.series[0].data.length
                        ).toFixed(2);

                        let rtdata = res.data;
                        for (var key in rtdata) {
                            rtdata[key].stat_date = this.transDateMsec(
                                rtdata[key].stat_date
                            );
                            rtdata[key].day1 = (Number(rtdata[key].day1)*100).toFixed(2);
                            rtdata[key].day3 = (Number(rtdata[key].day3)*100).toFixed(2);
                            rtdata[key].day7 = (Number(rtdata[key].day7)*100).toFixed(2);
                            rtdata[key].day30 = (Number(rtdata[key].day30)*100).toFixed(2);
                            rtdata[key].day180 = (Number(rtdata[key].day180)*100).toFixed(2);
                        }
                        this.deviceViewData.data = rtdata;
                    }
                })
                .catch(msg => {
                    console.log(msg);
                    this.$Message.error(msg);
                    this.deviceViewData.data = rtdata;
                });
        },
        // 选择角色或设备
        selType(type) {
            // 选择角色 | 设备
            if (this.viewParam.role_type != type) {
                let options = this.getMoreOptions(type).options;
                this.chart = this.$refs.role_chart.chart.update(options); // 更新图表
                this.viewParam.role_type = type;
                this.viewParam.exportfilename =
                    type == "role" ? "新增角色留存" : "新增设备留存";
                this.roleViewData.table_title =
                    type == "role" ? "新增角色留存" : "新增设备留存";
                this.roleViewData.subtitle =
                    type == "role" ? "ID" : "设备";
                this.roleViewData.avg_day1 =
                    type == "role" ? this.roleViewData.avg_day1_copy : this.deviceViewData.avg_day1;
                this.roleViewData.table_data = this.getMoreOptions(type).data;
                this.roleViewData.current = 1;
                this.changePage_role(1);
            }
        },
        getMoreOptions(type) {
            if (type === "role") {
                return {
                    options: this.roleViewData.options,
                    data: this.roleViewData.data
                };
            } else if (type === "device") {
                return {
                    options: this.deviceViewData.options,
                    data: this.deviceViewData.data
                };
            }
        },
        // 详情
        getDetailRet(user_type = this.detailViewData.user_type) {
            this.viewParam.loading_detail_retain = true;
            this.detail_residue({
                appid: this.$route.params.app_id,
                start_time: this.start_time
                    ? this.start_time
                    : this.transDatePre15(new Date()),
                end_time: this.end_time
                    ? this.transDateNext(this.end_time)
                    : this.transDateNext(new Date()),
                device_type: this.device_type,
                channel_ids: this.arrToString(this.channel),
                area: this.arrToString(this.area),
                user_type: user_type
            })
                .then(res => {
                    // 返回数据
                    if (res && res.code == 1) {
                        res.data = [];
                        res.code = 0;
                    }
                    if (res && res.code == 0) {
                        let rtdata = res.data;
                        for (var key in rtdata) {
                            rtdata[key].stat_date = this.transDateMsec(
                                rtdata[key].stat_date
                            );
                            rtdata[key].day1 = (Number(rtdata[key].day1)*100).toFixed(2);
                            rtdata[key].day2 = (Number(rtdata[key].day2)*100).toFixed(2);
                            rtdata[key].day3 = (Number(rtdata[key].day3)*100).toFixed(2);
                            rtdata[key].day5 = (Number(rtdata[key].day5)*100).toFixed(2);
                            rtdata[key].day7 = (Number(rtdata[key].day7)*100).toFixed(2);
                            rtdata[key].day14 = (Number(rtdata[key].day14)*100).toFixed(2);
                            rtdata[key].day30 = (Number(rtdata[key].day30)*100).toFixed(2);
                            rtdata[key].day60 = (Number(rtdata[key].day60)*100).toFixed(2);
                            rtdata[key].day90 = (Number(rtdata[key].day90)*100).toFixed(2);
                            rtdata[key].day180 = (Number(rtdata[key].day180)*100).toFixed(2);
                            rtdata[key].cellClassName = {
                                day1: this.checkColor(rtdata[key].day1),
                                day2: this.checkColor(rtdata[key].day2),
                                day3: this.checkColor(rtdata[key].day3),
                                day5: this.checkColor(rtdata[key].day5),
                                day7: this.checkColor(rtdata[key].day7),
                                day14: this.checkColor(rtdata[key].day14),
                                day30: this.checkColor(rtdata[key].day30),
                                day60: this.checkColor(rtdata[key].day60),
                                day90: this.checkColor(rtdata[key].day90),
                                day180: this.checkColor(rtdata[key].day180)
                            };
                        }
                        this.detailViewData.data = rtdata;

                        this.detailViewData.dataCount = this.detailViewData.data.length;
                        // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                        if (
                            this.detailViewData.data.length <
                            this.detailViewData.pageSize
                        ) {
                            this.detailViewData.historyData = this.detailViewData.data;
                        } else {
                            this.detailViewData.historyData = this.detailViewData.data.slice(
                                0,
                                this.detailViewData.pageSize
                            );
                        }
                    }
                    this.viewParam.loading_detail_retain = false;
                })
                .catch(msg => {
                    console.log(msg);
                    this.$Message.error(msg);
                    this.viewParam.loading_detail_retain = false;
                });
        },
        changePage_detail(index) {
            // console.log(`第${index}页`);
            var _start = (index - 1) * this.detailViewData.pageSize;
            var _end = index * this.detailViewData.pageSize;
            this.detailViewData.historyData = this.detailViewData.data.slice(
                _start,
                _end
            );
        },
        checkColor(num) {
            if (num >= 0.2) {
                return "cell_21";
            } else if (num >= 0.1) {
                return "cell_11";
            } else if (num > 0) {
                return "cell_1";
            } else if (num == 0) {
                return "cell_0";
            }
        },
        exportData(type) {
            // 导出数据
            if (type == "gms") {
                this.$refs.gms_table.exportCsv({
                    quoted: true,
                    filename: "新增玩家",
                    columns: this.gmsViewData.columns,
                    data: this.gmsViewData.data
                });
            } else if (type == "role") {
                this.$refs.role_table.exportCsv({
                    quoted: true,
                    filename: this.viewParam.exportfilename,
                    columns: this.roleViewData.columns,
                    data: this.roleViewData.table_data
                });
            } else if (type == "detail") {
                this.$refs.detail_table.exportCsv({
                    quoted: true,
                    filename: "详情留存",
                    columns: this.detailViewData.columns,
                    data: this.detailViewData.data
                });
            }
        },
        // 页面显示
        show_graphical(id) {
            this.viewParam[id + "_table"] = false;
            this.viewParam[id + "_graphical"] = true;
        },
        show_table(id) {
            this.viewParam[id + "_graphical"] = false;
            this.viewParam[id + "_table"] = true;
        },
        showTips(id) {
            this.$refs[id + "-tips"].style.display = "block";
        },
        hideTips(id) {
            this.$refs[id + "-tips"].style.display = "none";
        },
        // 通用方法
        transDateMsec(msec) {
            // 毫秒数转化
            var date = new Date(msec * 1000);
            return `${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}-${date.getDate()<10?'0'+date.getDate():date.getDate()}`; // 年-月-日
        },
        transDate(date) {
            // 日期格式化
            return `${date.getFullYear()}-${date.getMonth() +
                1}-${date.getDate()}`; // 年-月-日
        },
        transDateNext(date) {
            // 日期格式化,后一天的日期
            date = new Date(date);
            return `${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}-${date.getDate()+1<10?'0'+(date.getDate()+1):date.getDate()+1}`; // 年-月-日
        },
        transDatePre15(date) {
            // 日期格式化,指定日期的前7天
            var datepre15 = new Date(date);
            datepre15.setDate(date.getDate() - 7);
            return `${datepre15.getFullYear()}-${datepre15.getMonth() +
                1}-${datepre15.getDate()}`; // 年-月-日
        },
        arrToString(arr) {
            // 数组样式的字符串 '["1","2","3"]'
            if (arr.length) {
                return `["${arr
                    .toString()
                    .split(",")
                    .join('","')}"]`;
            } else {
                return "";
            }
        }
    }
};
</script>

