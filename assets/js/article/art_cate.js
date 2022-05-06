$(function () {

    var layer = layui.layer
    var form = layui.form

    // 调用才能拿到从服务器获取到的数据，运用于全局（Id,name,alias...）
    initArtCateList()


    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败！', function () {})
                }
                // console.log(res)  // 得到服务器返回的一个对象，里面包含 data 属性，是一个数组，里面包含了我们想要用模板引擎渲染的内容，用遍历来获取每一项
                // res 成功得到我们想要获取的内容用模板引擎来遍历渲染
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为“添加类别”按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，给 form-add （“添加类别”按钮） 表单绑定 submit 事件
    // 因为 form-add 表单是需要点击才会渲染，并非一进入页面就存在的表单，无法直接给它绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！', function () {})
                }
                layer.msg('新增分类成功')
                // 当成功新增了分类到服务器，我们再次从服务器端获得最新的文章数据渲染
                initArtCateList()
                // 根据 layui中的弹出层中的关闭层指示来写
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式给 btn-edit（编辑） 按钮绑定点击事件
    // 理由同上，父元素我们直接找到 tbody
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文字分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 给“编辑”按钮设置了个 data-id 的属性，里面存放了{{$value.Id}}拿到服务器返回的data里的Id
        var id = $(this).attr('data-id')
        // console.log(id)
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)  // 拿到的是一个对象，包含了Id,name,alias...
                // layui.form提供了表单赋值/取值的模块 form.val()
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式 ，为修改分类的表单绑定 submit 事件（编辑按钮中的确认修改）
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功')
                // 关闭该弹出层
                layer.close(indexEdit)
                // 重新获取文章分类列表并渲染
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 点击“删除按钮”弹出一个提示框
        layer.confirm('确认删除？', {icon: 3,title: '提示'}, function (index) {
            //提示以后从服务器中获取到当前数据
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！', function () {})
                    }
                    layer.msg('删除分类成功')
                    // 删除成功后关闭该弹出框
                    layer.close(index)
                    // 并重新获取文章分类列表、渲染
                    initArtCateList()
                }
            })
        })
    })
})