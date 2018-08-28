# Note2Blog loader

这个工具的用途是把markdown记的笔记加载成博客，方便用于git pages上，功能类似`hexo`。

## 用法

首先按固定目录格式编写笔记。

```
|-笔记本1
    |-分类1
        |-笔记1
            |-attach（附件）
            |-res（图片、录的gif动画之类的）
            |-笔记1.md
```

新添加笔记本后在`indexer-config.json`里配置笔记本目录
```
{
	"indexed_categories": [
		"笔记本1",
		...
	]
}
```

目录结构改变后，发布前先生成索引，`indexed.json`是自动生成的
```
python3 blog_indexer.py
```

然后push到git pages的仓库就行了，浏览器访问时会加载`index.html`，以及加载`.loader`中的前端程序到浏览器中，浏览笔记时，会通过ajax加载`indxed.json`在浏览器内存中生成笔记的索引，以及加载对应的`markdown`笔记通过`marked.js`和`highlight.js`进行渲染。

## 定制

* `.loader/fragments` 乱七八糟页面的HTML
* `.loader/js/app.js` 路由、ajax加载和改变页面DOM的操作
* `.loader/css/app.css` 一些全局的CSS设置
* `.loader/css/note.css` 主要控制笔记页面的显示效果
* `.nojekyII` 告诉github别用nojekyII加载
* `blog_indexer.py` 生成索引的脚本
* `CNAME` 绑定域名
* `indexer-config.json` 指定哪些笔记本要加载到博客