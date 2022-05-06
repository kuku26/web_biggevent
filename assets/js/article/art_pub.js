$(function () {
    var layer = layui.layer
    var form = layui.form

    getID()
    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！', function () {})
                }
                // 调用模板引擎渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                // 一定要调用 form.render() 方法
                // 因为$('[name="cate_id"]')中的子元素是通过动态方式加载到页面的，layui需要渲染这个动态内容需要刷新
                form.render()
            }
        })
    }

    // 图片封面快速设置（现成的文件）
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为“选择封面”按钮添加点击事件
    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').click()
    })

    // 监听 $('#coverFile') 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 1、获取到用户选择的文件列表
        var files = e.target.files
        // console.log(files[0]) // 存放的是用户选择的文件的所有信息  length name...
        if (files.length === 0) {
            return layer.msg('请选择图片', function () {})
        }
        // 2、根据用户选择的文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 3、先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态 默认为  已发布
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为整个表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1、阻止表单的提交行为
        e.preventDefault()
        // 2、基于 form 表单，快速创建一个 FormDate 对象
        // $(this)[0] 将 jquery 对象转换成 DOM元素
        var fd = new FormData($(this)[0])
        // 3、将文章的发布状态，存到 id 中
        fd.append('state', art_state)
        // 4、将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5、将该文件 blob 对象存储到 fd 中
                fd.append('cover_img', blob)
                // 6、发起 ajax 请求，从而实现发布文章
                publishArticle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormDate 格式的数据，必须包含以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！', function () {})
                }
                layer.msg('发布文章成功！')

                // 发布文章后，跳转到文章列表页面
                location.href = '/4-Node[v6.5]/day-07/code/article/art_list.html'
            }
        })
    }
})