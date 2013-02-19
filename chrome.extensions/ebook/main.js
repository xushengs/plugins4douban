(function(){

    // 如果不是书的介绍页，不处理
    if(!/http\:\/\/book\.douban\.com\/subject\/\d+\/$/i.test(location.href)){
        return;
    }

	String.prototype.process = function(o) {
		return this.replace(/\$\{([^\}]+)\}/g, function(a, b) {
			return o ? o[b] : '';
		});
	};
	
	function $(selector, context){
		return (context || document).querySelectorAll(selector);
	}

    /**
    * Performs an XMLHttpRequest.
    * @param callback Function If the response from fetching url has a
    *     HTTP status of 200, this function is called with a JSON decoded
    *     response.  Otherwise, this function is called with null.
    */
    function sendRequest(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(xhr);
                } 
                else {
                    callback(null);
                }
            }
        }
        // Note that any URL fetched here must be matched by a permission in
        // the manifest.json file!
        xhr.open('GET', url, true);
        xhr.send();
    };

    var _books = [],
        _isbn = '', _title = '', _link = '',
        _extLinkTpl = 'http://www.google.com/cse?cx=004798099194550741737%3Aq_g80ujebkq&ie=UTF-8&q=${key}&sa=Search',
        _apiUrlTpl = 'https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=zh_CN&prettyPrint=false&source=gcsc&gss=.com&sig=981037b0e11ff304c7b2bfd67d56a506&cx=004798099194550741737:q_g80ujebkq&q=${key}&googlehost=www.google.com&nocache=${timestamp}',
        _itemTpl = ['<li>',
                        '<a href="${link}" target="_blank">${title}</a>',
                        '<br />',
                        '来自：${website}',
                        '</li>'].join('');
						
	function onLoad(res){
		if(!res){
			return;
		}

        var res = JSON.parse(res.responseText);
        if(!res || !res.results){
            return;
        }

        res = res.results;
        var item, i = 0;
        while(item = res[i++]){
            _books.push({ 'link': item.unescapedUrl, 'title': item.titleNoFormatting, 'website': item.visibleUrl });
        }

		var pd = document.querySelectorAll('div.aside')[0];
		var nd = document.createElement('div');
		nd.className = 'indent';
		nd.innerHTML = _getHtml();
		pd.insertBefore(nd, pd.firstChild);
		
		$('#_ebook_toggle')[0].addEventListener('click', _ebook_toggle);
	};
	
    // gernerate html
    function _getHtml() {
        var _link = _extLinkTpl.process({ 'key': encodeURIComponent(_title) });
        var s = [];
        //s.push('<script type="text/javascript">');
        //s.push('var showing = false;');
        //s.push('function _ebook_toggle(o){ var m = document.getElementById("_ebook_more"); if(showing){ m.style.display="none"; o.innerHTML = "显示更多..."; }else{ m.style.display=""; o.innerHTML = "收起"; } showing = !showing; }');
        //s.push('</script>');
        s.push('<h2>哪里有这本书的电子版?  ·  ·  ·  ·  ·  · </h2>');
        s.push('<div class="indent">');
        s.push('<div style="display:block;margin-bottom:8px;padding:4px 8px;background:#dfc;border-radius:4px;"><a href="' + _link + '" target="_blank">去Google搜索更多结果</a></div>');
        var l = _books.length;
        if (l > 0) {
            s.push('<ul class="bs">');
            for (var i = 0; i < 3 && i < l; i++) {
                s.push(_itemTpl.process(_books[i]));
            }
            s.push('<span id="_ebook_more" style="display:none">');
            while (i < l) {
                s.push(_itemTpl.process(_books[i]));
                i++;
            }
            s.push('</span>');
            if (l > 3) {
                s.push('<a id="_ebook_toggle" href="javascript:void(0)">显示更多...</a>');
            }
            s.push('</ul>');
        }
        s.push('</div>');
        return s.join('');
    }

	_title = $('h1 span')[0];
	_title = _title ? _title.innerText : null;

	if(_title){
		//chrome.extension.
        sendRequest(_apiUrlTpl.process({ 'key': encodeURIComponent(_title), 'timestamp': +new Date() }), onLoad);
	}
	
	function _ebook_toggle(evt){ var o = this; var m = document.getElementById("_ebook_more"); if(this.showing){ m.style.display="none"; o.innerHTML = "显示更多..."; }else{ m.style.display=""; o.innerHTML = "收起"; } this.showing = !this.showing; }
	_ebook_toggle.showing = false;
	
})();
