export const dragFunc=function (el,binding) {
    let oDiv = el;
    console.log(binding.value);
    console.log(binding.name);
    oDiv.onmousedown = function (e) {
        console.log('drag')
        let l = e.clientX - oDiv.offsetLeft;
        let t = e.clientY - oDiv.offsetTop;
        document.onmousemove = function (e) {
            oDiv.style.left = e.clientX - l + 'px';
            oDiv.style.top = e.clientY - t + 'px';
        };
        oDiv.onmouseup = function () {
            document.onmousemove = null;
            oDiv.onmouseup = null;
        }
    }
}