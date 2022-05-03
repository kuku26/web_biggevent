$(function () {
    // 点击“去注册账号”的a链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击“去登陆”的a链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验注册时 密码和再次输入是否一致
        repwd: function (value) {
            var firstpwd = $('.reg-box [name=password]').val()
            if (firstpwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1、首先阻止表单的默认提交行为
        e.preventDefault()
        // 2、发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message, function () {})
            }
            layer.msg('注册成功！')
            // 注册成功后模拟人为登录页面，跳转至登录页面
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form-login').submit(function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 Ajax 的请求
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！', function () {})
                }
                layer.msg('登录成功!')
                // success 函数中返回的除了status message 还有 token
                // console.log(res.token)
                // console.log(res)
                // 将 登录成功后得到的token 存入本地
                localStorage.setItem('token', res.token)

                // 登录成功后发生页面跳转
                location.href = './index.html'
            }
        })
    })
})