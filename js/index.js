
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
				location.href="dashboard";
			}else{
				$(".js-login-container .js-error").html(o.descripcion);
				$(".js-login-container .js-error").css("height", "20px");
			}
	};

	params = 'usu='+ usu + '&pwd='+pwd;
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
	return false;
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
					console.log("no coinciden");
					$(".js-register-container .js-error").html("Las contraseñas no coinciden");
					$(".js-register-container .js-error").css("height", "20px");
				}else{
					var url2 = 'rest/registro/';
					var xhr2 = new XMLHttpRequest();
					var params2 = '';
					xhr2.open('POST', url2, true);

					xhr2.onload = function(){	
							o = JSON.parse(this.responseText);	
							if(o.resultado == 'ok'){
								// var text = "Bienvenid@ a Vowabi <strong>" + o.login + "</strong><br>Inicia sesión.";
								// modal_redirect = "index";
								//showModal("Registro correcto", text, "Aceptar");
								$(".js-register-container .js-error").html("");
								$(".js-register-container .js-error").css("height", "0px");
								swal({
										title: "Registro correcto", 
										text: "Bienvenid@ a Vowabi <strong>" + o.login + "</strong><br>Inicia sesión.", 
										type: "success",
										confirmButtonText: "Aceptar",  
										html: true 
									}, function(){
										$(".js-tabs li:first-child").trigger("click");
										$(".js-login-container input[type=email]").val(o.login);
								}); 			
							}else{
								$(".js-register-container .js-error").html(o.descripcion);
								$(".js-register-container .js-error").css("height", "20px");
							}
					};

					params2 = 'usu='+ email + '&pwd=' + pwd;
					xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr2.send(params2);
				}

			}else{
				$(".js-register-container .js-error").html("Email ya registrado");
				$(".js-register-container .js-error").css("height", "20px");
				console.log("noDisponible");
				return false;
			}
	};

	xhr.send();


	return false;
}



function rememberPassword() {		
}
/****** END LOGIN/REGISTER ******/