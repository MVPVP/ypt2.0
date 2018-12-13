# ypt2.0
重点难点记录，暂未整理
1、vue组件内，如果定义js原生事件，如onclick="func()"的方法怎么写
解决：window.func=function(){};

2、获取视频时长方法：
解决：oncanplaythrough="oncanplaythroughGetTimeFunc(this)"

3、scss作用于scoped域出现的问题；

4、获取图片分辨率：（在input，file的时候）
document.querySelector('.media').naturalWidth

5、axios发送post请求返回400状态码，写个简单form表单提交没问题，发现是请求头跟后台没对应上；
解决1：用'username=admin&password=654321'方式传参；
解决2：axios请求头的 Content-Type 默认是 application/json，而postman默认的是 application/x-www-form-urlencoded。我这里采取的解决办法是改变后台的接收方式：

6、// `baseURL`将被添加到`url`前面，除非`url`是绝对的。

7、beforeRouteEnter (to, from, next) {
      next(vm => {
      	vm.httpTest()
    	});
    });
注意:这个vm代表this；

8、查看到浏览器NetWork有两次请求，请求url一样：

9、关于路由的梳理：
一、项目启动，
{
    path: '/',
    redirect: '/login',
 }
强行切换到login页面；
二、必须要映射好login页面：
{
    path: '/login',
    name: 'loginPage',
    component: loginPage
  }
三、全局做router.beforeEach((to, from, next) => {})路由拦截；
四、登录成功进入主页面，（由于主页面涉及到多路由，如头部，左侧菜单栏固定，内容详情做路由控制）此时怎么做路由映射呢？
五、应该借助个模版页面，如main.vue：
	<head-top></head-top>
        <side-bar></side-bar>
        <div class="f-main" style="margin-left:315px;min-width:1285px;">
            <router-view></router-view>
        </div>
六、此时路由为（children里面路由，都是在mainPage模版中的<router-view>标签渲染的）：
{
    path: '/',
    name: '发布系统',
    component: mainPage,
    meta: {
      icon: 'el-icon-menu'
    },
    children: [
      {
        path: '/program',
        name: '资源管理',
        component: programPage
      }
    ]
  }

10、http_开头的函数表示请求接口的；

11、new formData();这个方法去创建与表单格式相同的数据；var formdata=new FormData();
        formdata.append('file',file);

12、es6 for（let i）i作用域问题；

13、定义的对象没有设置属性，如formData:{}，页面如<div v-text="formData.width">;异步设置this.formData.width='10',页面没渲染出数据；
解决：应该定义好所有属性，如：formData:{width: ''}

14、　　computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会出发实时计算。比如：
栗子：computed:{
        filterData(){
            var _this= this;
            debugger;
            return this.mySelect_datas[0].datas.filter((items)=> {
                return items.name.indexOf(_this.txt_publishArea)>=0;
            });
        }
    }
此时如果_this.txt_publishArea变化或者this.mySelect_datas[0].datas变化都会触发；

15、后台需要的map数据，我前端给的是对象{"key":["velue"],"key":["velue"]}

16、发现有tag切换，有多个table时，table宽度如果不写死，100%宽度，会出现bug；要设置好key解决

17、1.  错误: TypeError: _self.$scopedSlots.default is not a function

   原因:这是因为在v-for/v-if切换标签时，原本这些标签每一个都是独立的 ，如果不添加key来区分则会出现复用的情况。故，需要添加key来做区分。如下:

   解决: <el-table key=‘ticketTable‘ v-if="isShowTicket"></el-table>

vue elementui报错总结


