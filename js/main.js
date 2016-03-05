$(document).ready(function() {

    $(window).load(function() {
        $(".flash").css("opacity", "1");
    });
    checkLogin();



});


/****** LOGIN/REGISTER ******/
function login(form){

var usu = form.email.value;
var pwd = form.password.value;
var url = 'rest/login/';
var xhr = new XMLHttpRequest();
var params = '';
xhr.open('POST', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	
			console.log(o);
			if(o.resultado == 'ok'){
				sessionStorage.idUsuario = o.id;
				sessionStorage.usuario = o.email;
				sessionStorage.clave = o.clave;
				console.log(sessionStorage);
				location.href="dashboard.php";
			}else{
				$(".login-container .tooltip").html(o.descripcion);
				$(".login-container .tooltip").css("height", "20px");
			}
	};

	params = 'usu='+ usu + '&pwd='+pwd;
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
	return false;
}

function logout(){
	sessionStorage.removeItem("usuario");
	sessionStorage.removeItem("clave");
	sessionStorage.removeItem("idUsuario");
	location.href="index.php";
}

function checkPasswords(pwd, pwd2){

	if(pwd == pwd2)
		return true;

	return false;
}

function register(form){


	var email = form.email.value;
	var pwd = form.password.value;
	var pwd2 = form.password2.value;

	var url = 'rest/login/' + email;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	
			if(o.disponible == "true"){
				console.log("disponible");

				if(!checkPasswords(pwd, pwd2)){
					$(".register-container .tooltip").html("Las contraseñas no coinciden");
					$(".register-container .tooltip").css("height", "20px");
				}else{
					var url2 = 'rest/registro/';
					var xhr2 = new XMLHttpRequest();
					var params2 = '';
					xhr2.open('POST', url2, true);

					xhr2.onload = function(){	
							o = JSON.parse(this.responseText);	
							if(o.resultado == 'ok'){
								var text = "Bienvenid@ a Vowabi <strong>" + o.login + "</strong><br>Inicia sesión.";
								modal_redirect = "index.php";
								showModal("Registro correcto", text, "Aceptar");			
							}else{
								$(".register-container .tooltip").html(o.descripcion);
								$(".register-container .tooltip").css("height", "20px");
							}
					};

					params2 = 'usu='+ email + '&pwd=' + pwd;
					xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr2.send(params2);
				}

			}else{
				$(".register-container .tooltip").html("Email ya registrado");
				$(".register-container .tooltip").css("height", "20px");
				console.log("noDisponible");
				return false;
			}
	};

	xhr.send();


	return false;
}

function checkLogin(){
	var path = window.location.pathname;
  	var pagina = path.substring(path.lastIndexOf('/') + 1);
  	console.log(pagina);

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
/****** END LOGIN/REGISTER ******/

/****** DASHBORAD ******/
function dashboard(){
	var userName = document.querySelector('.dashboard .userBar .userName');
	userName.innerHTML = sessionStorage.usuario;

	getProjects();
}

function getProjects(){

	var url='rest/proyecto/?idusu=' + sessionStorage.idUsuario;
	var xhr = new XMLHttpRequest();
	var projects;
	var container = document.querySelector(".dashboard .projects-list");
	container.innerHTML = "";

	xhr.open('GET', url, true);

  	xhr.onload = function(){
			if(window.JSON) // Comprueba si soporta JSON nativo
				projects = window.JSON.parse( this.responseText );
			listProjects(projects);	

			var contents = $('.projectName').html();
			$('.projectName').blur(function() {
			    if (contents!=$(this).html()){
			    	if($(this).html() == ""){
				        $(this).html(contents);
				    }else{
				        contents = $(this).html();
				        var idProject = $(this).parent().parent().parent().attr("data-id");
				        changeName(contents, idProject);
				    }
			    }
			});
	};

	xhr.send();
}

function listProjects(projects){
	
	var container = document.querySelector(".dashboard .projects-list");
	container.innerHTML = "";

	if(projects.length){
		for(var i=0; i<projects.length; i++){
			var elem = document.createElement("li");
			elem.dataset.id = projects[i].id;

				var div = document.createElement("div");
				div.className = "text";
				div.innerHTML += "<h3><span class='projectName' contenteditable='true'>"+ projects[i].Nombre +"</span> - <span class='date'>"+ projects[i].FechaCreacion +"</span></h3>";
				if(projects[i].Descripcion && projects[i].Descripcion != "")
					div.innerHTML += "<p>"+ projects[i].Descripcion +"</p>";

			elem.appendChild(div);

				var div = document.createElement("div");
				div.className = "buttons";
				div.innerHTML += " 	<button onclick='editProject("+ projects[i].id +")'><i class='icon-pencil'></i><span>Editar</span></button>";
				div.innerHTML += " 	<button onclick='confirmDeleteProject("+ projects[i].id +")'><i class='icon-trash'></i><span>Eliminar</span></button>";
				
	
			elem.appendChild(div);
			container.appendChild(elem);
		}
	}else{
		var elem = document.createElement("li");
		elem.innerHTML += "Todavía no tienes ningún proyecto.";
		container.appendChild(elem);
	}
}


function changeName(name, id){
	
	var url = 'rest/proyecto/';
	var xhr = new XMLHttpRequest();
	var params = '';
	xhr.open('POST', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	
			console.log(o);
			if(o.resultado == 'ok'){
				var text = "Nombre del proyecto (" + o.nombre + ") cambiado correctamente";
				showModal("Nombre cambiado correctamente", text, "Aceptar");		
				getProjects();
			}else{
				$(".dashboard form .tooltip").html(o.descripcion);
				$(".dashboard form .tooltip").css("height", "20px");
			}
	};

	params = 'idProyecto='+ id + '&name='+name;
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
	xhr.send(params);
	return false;
}

function editProject(id){
	sessionStorage.setItem('idProject', id);
	window.location.href="project.php";
}

function confirmDeleteProject(id){

	var text = "¿Estas seguro de que deseas eliminar el proyecto?<br>Todas sus dependencias también serán borradas.";
	dialog('Eliminar proyecto', text, "Eliminar", "Cancelar",
	    function() {
	        removeProject(id);
	    },
	    function() {
	        console.log("NOO");
	    }
	);
}

function removeProject(id){
	var idProject = id;
	var url = 'rest/proyecto/' + idProject;
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	
			console.log(o);
			if(o.resultado == 'ok'){
				showModal("Proyecto eliminado correctamente", "Tu proyecto ha sido eliminado correctamente", "Aceptar");
				getProjects();
			}else{
				var text = "Ha habido algún error elminando tu proyecto, inténtalo de nuevo más tarde.";
				showModal("¡Upps! Ha habido algún error", text, "Aceptar");		
			}
	};

	xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
	xhr.send();
	return false;
}

function createProject(form){

	var name = form.name.value;
	var description = form.description.value;
	var idUsuario = sessionStorage.idUsuario;
	var url = 'rest/proyecto/';
	var xhr = new XMLHttpRequest();
	var params = '';
	xhr.open('POST', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	
			console.log(o);
			if(o.resultado == 'ok'){
				var text = "Tu proyecto " + o.nombre + " ha sido creado correctamente";
				//modal_redirect = "index.php";
				showModal("Proyecto creado correctamente", text, "Aceptar");		
				getProjects();
			}else{
				$(".dashboard form .tooltip").html(o.descripcion);
				$(".dashboard form .tooltip").css("height", "20px");
			}
	};

	params = 'idUsuario='+idUsuario + '&name='+name + '&description='+description;
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
	xhr.send(params);
	return false;
}
/****** END DASHBOARD *******/

/****** PROJECT *******/
function project(){
	var userName = document.querySelector('.userBar .userName');
	userName.innerHTML = sessionStorage.usuario;

	getProject();
}

function getProject(){

	if(sessionStorage.getItem("idProject")){ 

		var idProject = sessionStorage.getItem("idProject");

		var url= 'rest/proyecto/' + idProject;
		var xhr = new XMLHttpRequest();
		var proyecto;
		xhr.open('GET', url, true);

	  	xhr.onload = function(){
				//console.log(this.responseText);
				if(window.JSON) // Comprueba si soporta JSON nativo
					proyecto = window.JSON.parse( this.responseText );	

				var padre;

				for(var i=0; i< proyecto.length; i++){
					with(proyecto[i]){

						//Solo si son padres
						if(idElemento == idPadre){

							var id = "el-" + idElemento;
							var padre = createHTMLElement(HTML);
							padre.id = id;

							if(CSS)
								setCSS(CSS, id);


							//Buscamos los hijos
							for(var j=0; j< proyecto.length; j++){
								var elem = proyecto[j];
								if(elem["idPadre"] == idElemento && idElemento != elem["idElemento"] ){
									var idHijo = "el-" + elem["idElemento"];
									var hijo = createHTMLElement(elem["HTML"]);
									hijo.id = idHijo;

									if(elem["CSS"])
										setCSS(elem["CSS"], idHijo);

									padre.appendChild(hijo);
								}
							}

							document.getElementById("projectContainer").appendChild(padre); 

						}

					}
				}

				
		};

		xhr.send();
	}
	else
		location.href="dashboard.php";
}

function setCSS(CSS, id){

	var css = '';
	var v =  CSS.split('--');

	for(var i=1; i<v.length; i=i+2){

		if(v[i] == "general")
			css += '#'+id+'{';
		else if(v)
			css += '#'+id + v[i] + '{';

		css += v[i+1];
		css += '}';
		
	}

	document.getElementById("projectStyle").innerHTML += css;
}

function createHTMLElement(html) {

	var aux = html.split("<");
	var aux2 = aux[1].split(">");
	var elemName = aux2[0];
	var elemContent = aux2[1];

	var elem = document.createElement(elemName);
	elem.innerHTML = elemContent;

	return elem;
}

function parseCSS(css){
	var aux = new Object();

	var v = css.trim().split("--");

	for(var i=1; i<v.length; i=i+2){
		v2 = new Object();

		var v3 = v[i+1].split(';');

		v3.forEach(function(e2){
			var regla = e2.split(':');
			if(regla.length > 1)
				v2[regla[0].trim()] = regla[1].trim();
		});
		
		aux[v[i]] = v2;
	}

	return aux;
	/*	
	var v = css.split(';');
	var aux = new Object();

	v.forEach(function(e){
		var regla = e.split(':');

		if(regla[0].length > 0)
			aux[regla[0].trim()] = regla[1].trim();
	});

	return aux; */
}

function deParse(obj){

	var css = '';

	for(var key in obj){
		css += '--' + key + '--' + '\n';

		if(obj[key]){
			for(var key2 in obj[key]){
				var el = obj[key];
				css += key2 + ':' + el[key2] + ';' + '\n';
			}
		}
	}
}


function closeProject(){
	sessionStorage.removeItem("idProject");
	location.href="dashboard.php";	
}
/****** END PROJECT *******/

/****** TABS HOME *******/
$('.tabs li').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).addClass('active');
  $(this).siblings().removeClass('active');
  
  var tabId = $(this).attr("data-tab");
  target = $("#tab-" + tabId);

  $('.tab-content > div').not(target).hide();
  $(target).fadeIn(600);
  
});
/****** END TABS HOME *******/

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