$(function () {
    // 给表单做验证规则，首先导入layui里的form模块
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度应控制在1~6个字符之间'
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }
    })

    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！', function () {})
                }
                // console.log(res)

                // 调用 form.val() 快速为表单赋值
                // 如果 res.data 参数存在，则为赋值；如果 res.data 参数不存在，则为取值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        // 重置表单时，再次发起请求获取用户的信息
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            // 将更新的用户信息发送给服务器， 服务器好进行更新再把新的用户信息发给客户端进行渲染
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！', function () {})
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                // window 指当前的页面
                // parent 指这个页面的父页面  也就是iframe(user_info.html)的父页面：index.html ，index.html的js文件:index.js中有相关的渲染用户信息的函数:getUserInfo()
                window.parent.getUserInfo()
            }
        })
    })
})