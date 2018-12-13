// export function http_loginFunc(account,password) {
//     var URL = '/user/login';
//     return this.$post(URL, {
//         username: account,
//         password: password
//     })
//     .then(function (response) {
//         console.log(response);
//         sessionStorage.setItem('session_accessToken', response.data.data.jwt.access_token);
//         sessionStorage.setItem('session_userId', response.data.data.jwt.userId);
//         sessionStorage.setItem('session_username', response.data.data.user.username);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// }