(function(){
	function $(selector, context){
		return (context || document).querySelectorAll(selector);
	}
	
	function sec2str(secs){
		var h = Math.floor(secs / 3600);
		var m = Math.floor((secs % 3600) / 60);
		m = m > 9 ? m : ('0' + m);
		var s = (secs % 60);
		s = s > 9 ? s : ('0' + s);
		return (h ? ( h + ('小时')) : '') + (m + '分' + s + '秒');
	}
		
	function onLoad(text) {
		if(!text){
			return;
		}
		
		var data = eval('(' + text + ')');
		if(data.err){
			return;
		}
		var count = data.data.total;
		data = data.data.videos;
		var link = search + encodeURIComponent(title.split(' ')[0]);
		var doc = window.getBrowser().selectedBrowser.contentDocument;
		var pd = $('div.aside', doc)[0];
		var nd = doc.createElement('div');
		nd.className = 'indent';
		var html = '<h2>PPTV上有这部电影看？ · · · · · ·</h2>';
		html += '<div style="display:block;margin-bottom:8px;padding:4px 8px;background:#dfc;border-radius:4px;"><a href="'+link+'" target="_blank">在PPTV上共有<b> '+ count+' </b>个相关结果</a></div>';
		html += '<ul class="bs" style="background-image:none;">';
		var d;
		for(var i=0,l=data.length;i<l && i < 6;i++)
		{
			d = data[i];
			//html += '<li><a target="_blank" href="' + d.link + '" title="' + d.name + '">' + d.name + '</a></li>'
			html = html + '<li class="clearbox">'
					//+ '<div class="title"><a target="_blank" title="' + d.title + '" href="' + d.link + '">' + d.title + '</a></div>'
					+ '<a href="' + d.link + '" style="display:inline-block;width:48px;height:48px;padding:3px;border:1px solid #ddd;line-height:150%;">'
					+ '<b style="display:block;width:48px;height:48px;background:#fff url('+(d.cover || d.picture)+') center center no-repeat;">&nbsp;</b>'
					+ '</a>'
					+ '<div style="display:inline-block;width:246px;margin-left:8px;padding-top:2px;vertical-align:top;line-height:150%;">'
					+ '<a target="_blank" title="' + d.title + '" href="' + d.link + '">' + d.title + '</a><br />'
					+ (d.duration ? ('时长：' + sec2str(d.duration)) : (d.episode ? ('集数：共' + d.episode + '集') : ''))
					+ '</div>'
					+ '</li>';
		}
		html += '</ul>';
		nd.innerHTML = html;
		pd.insertBefore(nd, pd.firstChild);
	};
	
	function request(url){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function(){
	        if (xhr.readyState == 4){
	        	if(xhr.status == 200){
	        		onLoad(xhr.responseText);
	        	}
	        }
	    };
		xhr.send(null);
	}

	function start(evt){
		var bs = window.getBrowser().selectedBrowser;
		var doc = bs.contentDocument,
		    url = bs.currentURI.spec;
		if(/^https?:\/\/movie.douban.com\/subject\/.*/i.test(url)){
			title = $('h1 span', doc)[0];
			title = title ? title.textContent : null;
			if(title){
				request(api + encodeURIComponent(title.split(' ')[0]));
			}
		}
		else{
			//alert(location.href);
		}
	}

	function main(evt){
		window.getBrowser().selectedBrowser.contentDocument.addEventListener( "DOMContentLoaded", start, false);
	}
	
	var title,
		search = 'http://ikan.pptv.com/search/?kw=',
		//search = 'http://ikan.pptv.com/search/suggest/?kw=',
		api = 'http://ikan.pptv.com/api/openapi/search.json?num=6&kw=';
		
	document.addEventListener( "DOMContentLoaded", main, false); 
})();
