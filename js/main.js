$(document).ready(function() {
    $(window).load(function() {
        $(".flash").css ("opacity","1");
    });


  $('body').niceScroll({
    autohidemode: true,   
    cursorborderradius: '0px',
    cursorwidth: '5px',     
    cursorcolor: '#222c35',
    enablescrollonselection: false,
    nativeparentscrolling: false,
  });

    checkLogin();
});

function checkLogin(){
    var path = window.location.pathname;
    var pagina = path.substring(path.lastIndexOf('/') + 1);
    //console.log(pagina);

    //Si esta logeado
    if(sessionStorage.usuario != undefined){
        if(pagina =='')
            location.href="dashboard.php";
    }
    //No esta logeado
    else{
        if(pagina !='index.php')
            location.href="index.php";
            
    }
}

function logout(){
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("clave");
    sessionStorage.removeItem("idUsuario");
    location.href="index.php";
}

/****** TABS HOME *******/
$('.js-tabs li').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).addClass('active');
  $(this).siblings().removeClass('active');
  
  var tabId = $(this).attr("data-tab");
  target = $("#tab-" + tabId);

  $('.js-tab-content > div').not(target).hide();
  $(target).fadeIn(600);
  
});
/****** END TABS HOME *******/

/****** BACKGROUND SLIDER ******/

//Cambia de slider cada 10s
function prepareSlider(){
    setInterval(function() {
        nextSlide();
    }, 10000); 

}

function nextSlide() {

    var trs = 300;

    var obj = document.querySelector('.content .image-background');
    var obj2 = document.querySelector('.content .image-foreground');

    var max = obj.getAttribute("data-max");
    var current = obj.dataset.current;
    var current_image = obj.getAttribute("data-img"+current);
    var next = parseInt(current) + 1;

    if(next>max)
        next = 1;

    var image = obj.getAttribute("data-img"+next);

    obj2.style.backgroundImage = "url(" + current_image + ")";
    
    setTimeout(function(){
        obj.style.opacity = "0";
    },trs);

    setTimeout(function(){
        obj.style.backgroundImage = "url(" + image + ")";
        obj.dataset.current = next;
    },trs*2);

    setTimeout(function(){
        obj.style.opacity = "1";
    },trs*3);
    

   
    

}
/****** FIN BACKGROUND SLIDER ******/



/****** POPUP *******/
var overlay = document.querySelector( '.md-overlay' );
var modal = document.querySelector( '#modal' );
var modal_title = document.querySelector( '#modal h3' );
var modal_content = document.querySelector( '#modal p' );
var modal_button = document.querySelector( '#modal button' );
var close = modal.querySelector( '.md-close' );
var modal_buttons = document.querySelector( '#modal .buttons' );

var modal_redirect ="";


close.addEventListener( 'click', function( ev ) {
	ev.stopPropagation();
	removeModal();
});

function removeModal() {
	$(modal).removeClass('md-show');

	if(modal_redirect != ""){
		setTimeout(function(){
			location.href  = modal_redirect;
			modal_redirect = "";
		}, 200);
	}

}

function showModal(title, content, button){

	if(title)
		$(modal_title).html(title);
	if(content)
		$(modal_content).html(content);
	if(button)
		$(modal_button).html(button);

	$(modal_button).show();
	$(modal_buttons).hide();

	$(modal).addClass('md-show');
	overlay.removeEventListener( 'click', removeModal );
	overlay.addEventListener( 'click', removeModal );
}

function dialog(title, content, btnYes, btnNo, yesCallback, noCallback) {

	if(title)
		$(modal_title).html(title);
	if(content)
		$(modal_content).html(content);

	$(modal_button).hide();

	$(modal_buttons).show();
	$(modal_buttons).html(
		'<button id="btnYes">'+ btnYes +'</button> <button id="btnNo">'+ btnNo +'</button>'
	);

	$(modal).addClass('md-show');
	overlay.removeEventListener( 'click', removeModal );
	overlay.addEventListener( 'click', removeModal );

    $('#btnYes').click(function() {
        yesCallback();
        removeModal();
    });
    $('#btnNo').click(function() {
        noCallback();
        removeModal();
    });
}

/****** END POPUP *******/

/****** USEFUL FUNCTIONS - PURE JS ********/
function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

function removeClasses(elements,cls){
    for (var i = 0; i < elements.length; i++) {
        var ele = elements[i];
        if (hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }
}

function addClasses(elements,cls){
    for (var i = 0; i < elements.length; i++) {
        var ele = elements[i];
        if (!hasClass(ele,cls)) ele.className += " "+cls;
    }
}


/********* HEADER BASE64 ********/

var Base64 = {
// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}