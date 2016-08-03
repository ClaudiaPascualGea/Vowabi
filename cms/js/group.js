function group(){
	getGroup();
	//getElements();
}

function getGroup(){

	if(sessionStorage.getItem("idGroup")){ 

		var idGroup = sessionStorage.getItem("idGroup");

		var url= 'rest/grupo/' + idGroup;
		var xhr = new XMLHttpRequest();
		var grupo;
		xhr.open('GET', url, true);
		document.querySelector(".userContent").innerHTML = "";

	  	xhr.onload = function(){

			//console.log(this.responseText);
			if(window.JSON) // Comprueba si soporta JSON nativo
				grupo = window.JSON.parse( this.responseText )[0];	

			var html = "";
			html += '<div class="cont-100 cont cont-flex">';
			html += "	<h1 class='title title-small'>"+grupo["Nombre"] +"</h1>";

			html += "	<div class='cont-content left'>";
			html += "		<p>"+grupo["Descripcion"] +"</p>";
			html += "	</div>";

			html += "	<div class='cont-content right'>";
			html +=	"		<input type='file' name='file' id='file' class='inputfile' />";
			html += " 		<label class='btn btn-second btn-small' for='file'><span>Choose a file</span></label>"
			html += "	</div>";

			html += "</div>";


			if(grupo["Fichero"]){
				html += '<div class="cont-100 cont">';
				html += "	<h1 class='title title-small'>Imagen del grupo</h1>";
					html += "<img src='"+grupo["Fichero"]+"'>";
				html += "</div>";
			}

			html += '<button onclick="addElement()" class="btn btn-small btn-primary">Añadir elemento</button>';
			document.querySelector(".userContent").innerHTML = html;

			var inputs = document.querySelectorAll( '.inputfile' );
			Array.prototype.forEach.call( inputs, function( input )
			{
				var label	 = input.nextElementSibling,
					labelVal = label.innerHTML;

				input.addEventListener( 'change', function( e )
				{
					var fileName = '';
					fileName = e.target.value.split( '\\' ).pop();

					if( fileName )
						label.querySelector( 'span' ).innerHTML = fileName;
					else
						label.innerHTML = labelVal;

					uploadFile(this.files[0], fileName);					

				});
			});


		};

		xhr.send();


	}
	else
		location.href="dashboard.php";
}

function uploadFile(file, filename){

	var formdata = new FormData();
	formdata.append('file', file);
	formdata.append('fileName', filename);
	formdata.append('idGrupo', sessionStorage.getItem("idGroup"));

	var url = 'rest/grupo/';
	var xhr = new XMLHttpRequest();
	var params = '';
	xhr.open('POST', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	

			if(o.resultado == 'ok'){				
				console.log(o);
				getGroup();				
			}else{
				swal({
					title: "Error", 
					text: o.descripcion, 
					type: "warning",
					confirmButtonText: "Aceptar",  
					html: true 
				}); 		
			}
	};

	// params = 'idGrupo='+sessionStorage.getItem("idGroup") + '&image='+file + '&imageName='+filename;
	// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
	xhr.send(formdata);
	return false;
}


function closeGroup(){
	sessionStorage.removeItem("idProject");
	location.href="dashboard.php";	
}