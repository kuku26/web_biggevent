$(function () {
    // 导入layui.form模块
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd:function(value){
            if(value !== $('[name="newPwd"]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 表达验证完成后需要点击“修改密码”，提交表单至服务器，发起ajax请求
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更改密码失败！',function(){})
                }
                layui.layer.msg('更改密码成功！')
    
                // 重置表单
                // form表单可以调用reset()，但是必须是原生dom元素才能调用，jquery对象[0]可转换成原生dom对象
                $('.layui-form')[0].reset()
            }
        })    
    })
})