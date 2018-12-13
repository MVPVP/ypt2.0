import router from '@/router/index.js'
const whiteRoute=['/login'];
import { routeArray } from '@/router/index.js'

const allPath=getRoutePath(routeArray);
    
function getRoutePath(params) {
    let array = [];
    for(let i=0,len=params.length;i<len;i++){
        if(params[i].children){
            for (let j = 0, long = params[i].children.length; j < long; j++) {
                if (params[i].children[j].path.indexOf(':')>=0) {//动态路由处理
                    array.push(params[i].children[j].path.split('/:')[0]);
                }else{
                    array.push(params[i].children[j].path);
                }
            }
        }
        
    }
    return array;
}

// function http_loginFunc(){
//         this.$post('/user/login', {
//             username: 'admin',
//             password: '654321'
//         })
//         .then(function (response) {
//             console.log(response);
//             sessionStorage.setItem('session_accessToken', response.data.data.jwt.access_token);
//             sessionStorage.setItem('session_userId', response.data.data.jwt.userId);
//             sessionStorage.setItem('session_username', response.data.data.user.username);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }
function dynamicPath(path) {//动态路由处理
    var pp = path.split('/')[1];
    if (pp.indexOf('/')>0) {
        return '/'+pp.match(/^(\/\S+)\//)[1]
    }
    return '/'+pp;
}
router.beforeEach((to, from, next) => {
    let cookie=sessionStorage.getItem('user')||1;
    console.log('router.beforeEach');
    
    // http_loginFunc();
    // debugger
    var toPath = dynamicPath(to.path);
    // debugger
    if(whiteRoute.indexOf(to.path)>=0){
        next()
    }else{
        if (allPath.indexOf(toPath)>=0){
            if (cookie) {
                next();
            } else {
                if (toPath == '/login') {
                    next();
                } else {
                    next('/login');
                }
            }
        }else{
            if (toPath=='/404') {
                next()
            }else{
                next('/404');
            }
            
        }
        
    }

})