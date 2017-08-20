var SETTINGS = {
	imagesUrl: 'https://www.happyhey.com/new-tab/acf-fiorentina-tab-list.txt',
	noScript: 'https://www.happyhey.com/share/acf-fiorentina-tab/share.php?noscript=Yes',
	getUrl: 'https://www.happyhey.com/share/acf-fiorentina-tab/getUrl.php',
	bannerUrl: 'https://www.happyhey.com/banner5/acf-fiorentina-tab.php'
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
if(!localStorage.currentDay)
	localStorage.currentDay = (new Date()).getDate();

var currentDay = (new Date()).getDate();

//force cache update
if(!localStorage.imagesList || localStorage.currentDay != currentDay){
		jQuery.ajax({
			method:'GET',
			url: SETTINGS.imagesUrl + '?r=' + Math.random()
		}).done(function(data){
			if(data!='')
			{
				//this moved to function main()
				//localStorage.currentDay = currentDay;
				localStorage.imagesList = data;
			}
			main();
		});
}
else
	main();

function main(){
	var images = (localStorage.imagesList || '').split('\n');
	function getImage(){
		var p = getRandomInt(0, images.length - 1);
		var url = images[p];
		if(url.indexOf('//i.imgbox') == -1 && url.indexOf('//imgbox') != -1){
			url = url.replace('//imgbox', '//i.imgbox') + '.jpg';
		}
		return {index: p, url: url}
	}
	if(localStorage.currentDay != currentDay)
	{
		jQuery.ajax({
			method:'GET',
			url: SETTINGS.noScript + '&r=' + Math.random()
		}).done(function(data){
			if(data!='')
			{
				localStorage.currentDay = currentDay;
				localStorage.currentHtml = data;
			}
		});
	}
	if(localStorage.currentHtml){
		jQuery('#main_container').html( localStorage.currentHtml );
	}
	var image;
	if(localStorage.getNextImage && localStorage.getNextImage.url)
		image = localStorage.getNextImage;
	else
		image = getImage();

	var image1 = getImage();

	jQuery('head').append('<meta property="og:image" content="' + image.url + '"/>');
	jQuery('head').append('<meta name="twitter:image" content="' + image.url + '"/>');
	jQuery('#imgPh').html('<img id="back-img" alt="Do you like it? Share it!" title="Do you like it? Share it! Scroll down for more!" src="'+image.url+'" style="width: 100%; height: auto; position: fixed; top: 0; left: 0; "/>');

	jQuery(function () {
		setTimeout(loadFirstPic, 100);
		var image2 = getImage();
		var img = new Image();
		img.src = image2.url;
		img.onload = function(){
			localStorage.getNextImage = image2;
		};
	});
	function loadFirstPic() {
		var img = new Image();
		img.src = image1.url;
	}
	var navigating = false;
	jQuery(window).mousewheel(function (event, delta, deltaX, deltaY) {
		if (deltaY < 0 && !navigating) {
			navigating = true;
			document.location = jQuery('#down').attr('href');
		}
	})
	jQuery.ajax({
		method:'GET',
		url: SETTINGS.getUrl + '?r=' + Math.random()
	}).done(function(data){
		if(data.indexOf('happyhey.com') || data.indexOf('imgbox'))
		{
			var tmp = data.split('|');
			jQuery('#down').prop('href', tmp[0]).show();
			
			var share = new ShareButton({
				url: tmp[1] || 'https://www.happyhey.com',
				title: "Do You Like ACF Fiorentina?",
				description: "Get awesome ACF Fiorentina HD images in each new Chrome tab!"
			});
			share.open();
		}
	})
	var communicationID = 'ext_' + (new Date()).getTime() + '_' + Math.random();
	(function () {

		window.addEventListener('message', function(evt){
			if(evt&&evt.data&&evt.data.indexOf(communicationID)!=-1){
				var o = false;
				try{
					o = JSON.parse(evt.data);				
				}catch(ex){};
				if(o.cmd == 'redir'){
					document.location = jQuery('#down').attr('href');
				}
			}
		})
		var extName = $('meta[property="og:title"]').attr('content') || '';
		var cnt = jQuery('#run_container');
		var ifr = jQuery('<iframe src="'+SETTINGS.bannerUrl+'?cid=' + communicationID + '&data='+encodeURIComponent(SETTINGS.imagesUrl)+'&index='+image.index+'&ext='+encodeURIComponent(extName)+'" width="100%" height="360px" scrolling="no" frameBorder="0"></iframe>');
		cnt.append(ifr);
	})(jQuery);
};