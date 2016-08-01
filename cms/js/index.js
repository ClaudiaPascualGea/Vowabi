
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
				$(".js-login-container .js-error").html(o.descripcion);
				$(".js-login-container .js-error").css("height", "20px");
			}
	};

	params = 'usu='+ usu + '&pwd='+pwd;
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
	return false;
}

function rememberPassword() {		
}
/****** END LOGIN/REGISTER ******/