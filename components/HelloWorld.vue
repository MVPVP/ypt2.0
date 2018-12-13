<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <h2>Essential Links</h2>
        <ul>
        <li>
            <a href="https://vuejs.org" target="_blank">
            Core Docs
            </a>
        </li>
        <li>
            <a href="https://forum.vuejs.org" target="_blank">
            Forum
            </a>
        </li>
        <li>
            <a href="https://chat.vuejs.org" target="_blank">
            Community Chat
            </a>
        </li>
        <li>
            <a href="https://twitter.com/vuejs" target="_blank">
            Twitter
            </a>
        </li>
        <br>
        <li>
            <a href="http://vuejs-templates.github.io/webpack/" target="_blank">
            Docs for This Template
            </a>
        </li>
        </ul>
        <h2>Ecosystem</h2>
        <ul>
        <li>
            <a href="http://router.vuejs.org/" target="_blank">
            vue-router
            </a>
        </li>
        <li>
            <a href="http://vuex.vuejs.org/" target="_blank">
            vuex
            </a>
        </li>
        <li>
            <a href="http://vue-loader.vuejs.org/" target="_blank">
            vue-loader
            </a>
        </li>
        <li>
            <a href="https://github.com/vuejs/awesome-vue" target="_blank">
            awesome-vue
            </a>
        </li>
        </ul>
        <el-row>
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
        </el-row>
        <el-row :gutter="20">
        <el-col :span="10">
            <div class="grid-content bg-purple">1</div>
        </el-col>
        <el-col :span="8" :offset="6">
            <div class="grid-content bg-purple">2</div>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="6">
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" icon="el-icon-circle-plus">搜索</el-button>
        </el-col>
        <el-col :span="6">
            <i class="el-icon-info">图标集合</i>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" plain>主要按钮</el-button>
        </el-col>
        </el-row>
        <el-radio-group v-model="radio3" @change="radioFunc(radio3)">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
        </el-radio-group>
        <el-checkbox-group v-model="checkList" @change="checkFunc(checkList)">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>
        <el-input prefix-icon="el-icon-search" size="mini" @focus="inputFunc"></el-input>
        <el-select v-model="selectvalue" filterable placeholder="请选择">
        <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">

        </el-option>
        </el-select>
        <div id="myChart" :style="{width: '900px', height: '300px'}"></div>
        <div>
        <h3 class="m_borderLeft_title">树</h3>
        <el-tree :data="data2" check-strictly="true" show-checkbox default-expand-all node-key="id" ref="tree"
            highlight-current>
        </el-tree>

        <div class="buttons">
            <el-button @click="getCheckedNodes">通过 node 获取</el-button>
            <el-button @click="getCheckedKeys">通过 key 获取</el-button>
            <el-button @click="setCheckedNodes">通过 node 设置</el-button>
            <el-button @click="setCheckedKeys">通过 key 设置</el-button>
            <el-button @click="resetChecked">清空</el-button>
        </div>

        </div>
        <div>
        <h3 class="m_borderLeft_title">下拉树数据</h3>
        <div>
            <el-select v-model="value6" placeholder="请选择">
            <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
                <el-tree :data="data2" check-strictly="true" default-expand-all node-key="id" ref="tree"
                highlight-current>
                </el-tree>
            </el-option>
            </el-select>
        </div>
        </div>

        <div>
        <h3 class="m_borderLeft_title">过滤filter</h3>
        <div>
            {{filtData | filtFunc}}
        </div>
        </div>
        <div>
            <h3 class="m_borderLeft_title">表单</h3>
            <div>
                <el-form :model="numberValidateForm" :rules="numberValidateForm_rules" ref="numberValidateForm_ref" label-width="100px">
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="numberValidateForm.age"></el-input>
                </el-form-item>
                </el-form>
                <div>
                <el-button @click="resetForm">重置1</el-button>
                </div>

            </div>
        </div>
        <div>
            <h3 class="m_borderLeft_title">懒加载自定义叶子节点</h3>
            <div>
                <el-tree
                    :props="props1"
                    :load="loadNode1"
                    lazy>
                </el-tree>
            </div>
        </div>
        <div>
            <h3>textarea清除功能</h3>
            <el-input
                clearable
                type="input"
                :rows="2"
                placeholder="请输入内容"
                v-model="filtData">
                </el-input>
        </div>
    </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
        props1: {
            label: 'name',
            children: 'zones',
            isLeaf: 'leaf'
        },
        loadNode1(node, resolve) {
            debugger
            if (node.level === 0) {
                return resolve([{ name: 'region' }]);
            }
            if (node.level > 1) return resolve([]);

            setTimeout(() => {
            const data = [{
                name: 'leaf',
                leaf: true,
                disabled: true,
            }, {
                name: 'zone'
            }];

            resolve(data);
            }, 500);
        },

      numberValidateForm: {
        age: "",
        age11: ""
      },
      numberValidateForm_rules: {},
      data2: [
        {
          id: 1,
          label: "一级 1",
          disabled: true,
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      msg: "Welcome to Your Vue.js App",
      filtData: 3, //1:aa,2:ee,3:yy
      radio3: "上海",
      checkList: ["复选框 A", "复选框 C"],
      selectvalue: "",
      selectOptions: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项11",
          label: "黄金糕"
        },
        {
          value: "选项21",
          label: "双皮奶"
        },
        {
          value: "选项31",
          label: "蚵仔煎"
        },
        {
          value: "选项41",
          label: "龙须面"
        },
        {
          value: "选项51",
          label: "北京烤鸭"
        },
      ],
      value6: "",
      cities: []
    };
  },
  created() {
    this.httpFunc();
  },
  mounted() {
    this.drawLine();
  },
  filters: {
    filtFunc(val) {
      if (val == 1) {
        return "aa";
      }
      if (val == 2) {
        return "ee";
      }
      if (val == 3) {
        return "yy";
      }
    }
  },
  methods: {
    resetForm() {
      debugger;
      this.$refs.numberValidateForm_ref.resetFields();
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([
        {
          id: 5,
          label: "二级 2-1"
        },
        {
          id: 9,
          label: "三级 1-1-1"
        }
      ]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "在Vue中使用echarts"
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    },
    radioFunc(label) {
      console.log(label);
    },
    checkFunc(label) {
      console.log(label);
    },
    inputFunc() {
      console.log(9999);
    },
    httpFunc() {
      this.$get("test_01.json")
        .then(response => {})
        .catch(error => {});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
$red: #417ccc;

h1,
h2 {
  font-weight: normal;
  color: $red;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  // display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.bg-purple {
  background: #d3dce6;
}
</style>
