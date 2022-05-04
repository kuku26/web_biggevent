$(function () {
    // 调用获取用户信息函数
    getUserInfo()

    var layer = layui.layer

    // 给退出按钮做点击事件，实现退出登录功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确认退出登录？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 1、清空本地存储中的 token
            localStorage.removeItem('token')
            // 2、重新跳转到登录页面
            location.href = './login.html'
            // 关闭 confirm 询问 layui自带
            layer.close(index);
        });
    })
})

// 获取用户的基本信息函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers 是请求配置对象
        // headers: {Authorization: localStorage.getItem('token') || ''},
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！', function () {})
            }
            // 调用 renderAvater 渲染用户的头像
            renderAvater(res.data)
        },
        // 不论获取用户信息成功还是失败，最终都会调用 complete 回调函数,目的都是为了控制用户的访问权限，必须有token才能让客户端调用有权限的页面，
        // complete: function (res) {
        //     console.log(res)
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1、强制清空 token
        //         localStorage.removeItem('token')
        //         // 2、强制跳转到登录页面
        //         location.href = './login.html'
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvater(user) {
    // 1、获取用户的名称
    var name = user.nickname || user.username
    // 2、设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3、按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avater').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }
}