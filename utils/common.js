

export const clientObj = new GetClientFunc();

function GetClientFunc() {//浏览器相关参数；
    this.height = document.documentElement.clientHeight;
}

window.onresize=function(){
    console.log(clientObj.height)
}
document.onload=function(){
    debugger;
    document.getElementsByClassName('f-main')[0].style.height = document.documentElement.clientHeight - 80 + 'px';
}

function card_interfaceFunc() {
    // #赛翼发卡器接口用户名
    // card_interface.username = Admin
    // #赛翼发卡器接口密码
    // card_interface.password = Sayee@38059979
    var username = 'Admin';
    var password = 'Sayee@38059979';
    var timestemp = (new Date()).valueOf();
    var webSocket= null
    var param = '{"method":"Login","data":{"tick":"' + timestemp + '","password":"' + hex_md5(username + timestemp + hex_md5(password)) + '","username":"' + username + '"}}'
    debugger;
    webSocket = new WebSocket("ws://127.0.0.1:28080");
    debugger;
    var obj = websocketRequest(webSocket, function (evt) {
        if (evt.type == 'open') {
            console.log("open.....");
            webSocket.send(param);
            console.log(param);
            webSocket.onmessage = function (evt) {
                debugger;
                console.log("onmessage");
                var obj = JSON.parse(decode(evt.data));
                console.log(obj.data);
                if (obj.data.code != "0") {
                    // hiAlert("提示", "获取token失败！");
                    return false;
                }
                var token = obj.data.result.token;
                console.log("token::::" + token);
                sessionStorage.setItem('IdCardToken_session', token);
                return token;
            };
        } else {
            console.log("unopen.....");
            // hiAlert("提示", "连接发卡器服务失败");
            return false;
        }

    })

}

function readIdCardFunc(callback) {//读身份证信息；
    var webSocket = null, token = sessionStorage.getItem('IdCardToken_session');
    webSocket = new WebSocket("ws://127.0.0.1:28080");
    webSocket.send('{"method":"ConnectIdReaderEx","token":"' + token + '"}');
    webSocket.onmessage = function (evt) {
        var obj = JSON.parse(decode(evt.data));
        if (obj.method == "ConnectIdReaderEx") {
            console.log("ConnectIdReaderEx");
            debugger;
            console.log(obj);
            if (obj.data.code == '0') {
                console.log('{"method":"GetIdCardInfoEx2","token":"' + token + '"}');
                sleep(100)
                webSocket.send('{"method":"GetIdCardInfoEx2","token":"' + token + '"}');
            } else {
                hiAlert("提示", "连接发卡器出错！");
                return false;
            }
        } else if (obj.method == "GetIdCardInfoEx2") {
            if (obj.data.code == '0') {
                console.log("GetIdCardInfoEx2");
                console.log(obj);
                var is_ic = obj.data.result.is_ic; // 1：id卡;2:身份证
                var card_id = obj.data.result.card_id;
                var resData = obj.data.result;
                callback(resData);
            } else {
                hiAlert("提示", "获取身份证信息失败！");
                return false;
            }
        }
    }
}

function websocketRequest(webSocket, onopen) {
    webSocket.onopen = onopen;
}

var decode = function (input) {
    console.log(5555);
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    output = _utf8_decode(output);
    console.log(output);
    return output;
}
function _utf8_decode(utftext) {
    var string = "";
    var i = 0,c1,c2,c3;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}  

//提取数组对象某个属性组成数组返回；
function arrayToAttrArray(array,attr) {
    var attrArray=[];
    if (array.length>0 && array[0].hasOwnProperty(attr)) {
        array.forEach((item, val) => {
            attrArray.push(item[attr]);
        });
    }
    return attrArray;
}
//提取treeObj对象某个属性组成数组返回；
const tree_attrArray= [];
function tree_arrayToAttrArray(treeObj, attr) {
    // debugger
    if (treeObj.hasOwnProperty(attr)) {
        tree_attrArray.push(treeObj[attr]);
    }
    if (treeObj.subs && treeObj.subs.length > 0) {
        for (var i = 0, len = treeObj.subs.length; i < len; i++) {
            var item = treeObj.subs[i];
            tree_arrayToAttrArray(item,attr)
        }
    }
    return tree_attrArray;
}
//提取treeObj对象某个属性组成数组返回_childrens；
const tree_attrArray_childrens= [];
function tree_arrayToAttrArray_childrens(treeObj, attr) {
    // debugger
    if (treeObj.hasOwnProperty(attr)) {
        tree_attrArray_childrens.push(treeObj[attr]);
    }
    if (treeObj.childrens && treeObj.childrens.length > 0) {
        for (var i = 0, len = treeObj.childrens.length; i < len; i++) {
            var item = treeObj.childrens[i];
            tree_arrayToAttrArray_childrens(item,attr);
        }
    }
    return tree_attrArray_childrens;
}
//// 获取年月日时分秒值
function formateDate(datetime) {
    var result= '',
        year= datetime.getFullYear(),
        month= ('0'+(datetime.getMonth()+1)).slice(-2),
        date= ('0'+datetime.getDate()).slice(-2),
        hour= ('0'+datetime.getHours()).slice(-2),
        minute= ('0'+datetime.getMinutes()).slice(-2),
        second = ("0" + datetime.getSeconds()).slice(-2);
    result = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;

    return result;
}
//给树数据treeData符合arrayId节点的数据添加属性attr
function tree_addAttr(treeData, arrayId,attr) {
    // debugger;
    if (arrayId.indexOf(treeData.id) >= 0) {
        // debugger;
        treeData[attr] = true;
    }
    if (treeData.subs && treeData.subs.length > 0) {
        for (var i = 0, len = treeData.subs.length; i < len; i++) {
            var item = treeData.subs[i];
            tree_addAttr(item, arrayId, attr)
        }
    }
    return treeData;
}
//给树数据treeData符合arrayId节点的数据添加属性attr
function tree_addAttr_a(treeData, arrayId,attr,string) {//string
    // debugger;
    if (arrayId.indexOf(treeData[string]) >= 0) {
        treeData[attr] = true;
    }
    if (treeData.childrens && treeData.childrens.length > 0) {
        for (var i = 0, len = treeData.childrens.length; i < len; i++) {
            var item = treeData.childrens[i];
            tree_addAttr_a(item, arrayId, attr, string)
        }
    }
    return treeData;
}
//给树数据treeData符合arrayId节点的数据添加属性attr; _childrens
function tree_addAttr_b(treeData_arr, arrayId_arr,attr,string) {//string
    // debugger;
    for (let i = 0,len=treeData_arr.length; i < len; i++) {
        if (arrayId_arr.indexOf(treeData_arr[i][string]) >= 0) {
            treeData_arr[i][attr] = true;
        }
        if (treeData_arr.childrens && treeData_arr.childrens.length > 0) {
            tree_addAttr_b(treeData_arr.childrens, arrayId, attr, string)
        }
    }
    
    
    return treeData_arr;
}

export { card_interfaceFunc, readIdCardFunc, arrayToAttrArray, formateDate, tree_addAttr, tree_addAttr_a, tree_addAttr_b, tree_arrayToAttrArray, tree_arrayToAttrArray_childrens}