$(document).ready(function ()
{
	//初始化响应式导航条
	$(".button-collapse").sideNav();

	//初始化Markdown解析器使用HighlightJs高亮代码
	marked.setOptions({
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: true,
		pedantic: false,
		sanitize: false,
		smartLists: false,
		smartypants: false,
		highlight: function (code)
		{
			return hljs.highlightAuto(code).value;
		}
	});

	//返回顶部按钮特效
	$("#return_top").click(function ()
	{
		var speed = 400;
		$("body,html").animate({scrollTop: 0}, speed);
		return false;
	});

	//url hash 实现前端路由
	$(window).bind("hashchange", function (e)
	{
		reload_page();
	});

	reload_page();

	function reload_page()
	{
		var urls = location.href.split("#");
		if (urls.length === 1)
		{
			load_home();
		}
		else
		{
			var targets = urls[1].split("/");
			var base_target = targets[0];
			var arg0_target = targets[1];
			var arg1_target = targets[2];
			var arg2_target = targets[3];
			// console.log(targets);

			if (base_target === "")
			{
				load_home();
			}
			//#home
			else if (base_target === "home")
			{
				load_home();
			}
			//#search
			else if (base_target === "search")
			{
				load_search();
			}
			//#me
			else if (base_target === "me")
			{
				load_me();
			}
			//#indexers
			else if (base_target === "indexers" && arg0_target === undefined)
			{
				load_index();
			}
			//#indexers/<notebook_name>/<category_name>
			else if (base_target === "indexers" && arg0_target !== undefined && arg1_target !== undefined)
			{
				load_note_list(arg0_target, arg1_target)
			}
			//#directory/<notebook_name>/<category_name>/<note_name>
			else if (base_target === "directory")
			{
				load_directory(arg0_target, arg1_target, arg2_target);
			}
			//#about
			else if (base_target === "about")
			{
				load_about();
			}
			else
			{
				load_404();
			}
		}
	}
});

//加载home页面
function load_home()
{
	var content = $("#content");
	content.empty();
	$.get(".loader/fragments/home.html", function (result)
	{
		content.append($(result));
	});
}

//加载"我"页面
function load_me()
{
	var content = $("#content");
	content.empty();
	$.get(".loader/fragments/me.html", function (result)
	{
		content.append($(result));
	});
}

//加载关于页面
function load_about()
{
	var content = $("#content");
	content.empty();
	$.get(".loader/fragments/about.html", function (result)
	{
		content.append($(result));
	});
}

//加载搜索框
function load_search()
{
	var content = $("#content");
	content.empty();
	$.get(".loader/fragments/search.html", function (result)
	{
		content.append($(result));
	});
}

//加载索引页面
function load_index()
{
	$.getJSON("indexed.json", function (result)
	{
		var content = $("#content");
		content.empty();

		var notebooks = result.notebooks;
		var notebook_num = notebooks.length;
		for (var i = 0; i < notebook_num; i++)
		{
			var notebook = notebooks[i];

			var notebook_card = $("<div class='card'></div>");
			content.append(notebook_card);

			var notebook_card_content = $("<div class='card-content'></div>");
			notebook_card.append(notebook_card_content);

			var notebook_card_title = $("<span class='card-title'></span>");
			notebook_card_title.text(notebook.notebook_name);
			notebook_card_content.append(notebook_card_title);

			var categories = notebook.categories;
			var category_num = categories.length;

			var category_collection = $("<div class='collection'></div>");
			notebook_card_content.append(category_collection);

			for (var j = 0; j < category_num; j++)
			{
				var category = categories[j];

				var category_link = $("<a href='" + "#indexers/" + notebook.notebook_name + "/" + category.category_name + "' class='collection-item'></a>");
				category_link.text(category.category_name);

				category_collection.append(category_link);
			}
		}
	});
}

//加载笔记列表
function load_note_list(notebook_name, category_name)
{
	//避免乱码
	notebook_name = decodeURI(notebook_name);
	category_name = decodeURI(category_name);

	let notes = [];
	$.getJSON("indexed.json", function (result)
	{
		let notebooks = result["notebooks"];
		let notebook_num = notebooks.length;
		for (let i = 0; i < notebook_num; i++)
		{
			if (notebooks[i]["notebook_name"] === notebook_name)
			{
				categories = notebooks[i]["categories"];
				let category_num = categories.length;
				for (let j = 0; j < category_num; j++)
				{
					if (categories[j]["category_name"] === category_name)
					{
						notes = categories[j]["notes"];
					}
				}
			}
		}

		let content = $("#content");
		content.empty();

		let notes_card = $("<div class='card'></div>");
		content.append(notes_card);

		let notes_card_content = $("<div class='card-content'></div>");
		notes_card.append(notes_card_content);

		let notes_card_title = $("<span class='card-title'></span>");
		notes_card_title.text(notebook_name + "/" + category_name);
		notes_card_content.append(notes_card_title);

		let notes_collection = $("<div class='collection'></div>");
		notes_card_content.append(notes_collection);

		let note_num = notes.length;
		for (let i = 0; i < note_num; i++)
		{
			let note_link = $("<a href='#directory/" + notebook_name + "/" + category_name + "/" + notes[i] + "' class='collection-item'></a>");
			note_link.text(notes[i]);

			notes_collection.append(note_link);
		}
	});
}

//加载文章页面
function load_directory(notebook_name, category_name, note_name)
{
	//文档URL
	var md_path = notebook_name + "/" + category_name + "/" + note_name + "/" + note_name + ".md";
	//文档包根路径,用于加载图片和资源
	var root_path = notebook_name + "/" + category_name + "/" + note_name + "/";

	//异步加载Markdown文档
	$.get(md_path, function (result)
	{
		var content = $("#content");
		content.empty();

		var rendered_md = marked(result);

		//图片链接替换
		var rendered_md_dom = $(rendered_md);
		var imgs = rendered_md_dom.children("img");
		imgs.each(function ()
		{
			var img_name = this.src.split("/").pop();
			this.src = root_path + "res/" + img_name;

			$(this).addClass("responsive-img");
		});

		content.append(rendered_md_dom);
	});
}

//加载404页面
function load_404()
{
	location.href = "404.html";
}