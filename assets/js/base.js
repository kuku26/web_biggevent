// 注意：每次调用 $.get() $.post() $.ajax() 的时候
// 都会预先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 ajax 请求之前，同意拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log( options.url)

    // 统一给有权限的接口，设置 headers 请求头
    // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载 complete 回调函数
    // 不论获取用户信息成功还是失败，最终都会调用 complete 回调函数,目的都是为了控制用户的访问权限，必须有token才能让客户端调用有权限的页面
    options.complete = function (res) {
        console.log(res)
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空 token
            localStorage.removeItem('token')
            // 2、强制跳转到登录页面
            location.href = './login.html'
        }
    }
})