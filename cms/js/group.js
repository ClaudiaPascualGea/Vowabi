function group(){
	getGroup();
	getElements();
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

			console.log(grupo);

			var html = "";
			html += '<div class="cont-100 cont">';
			html += "<h1 class='title title-small'>"+grupo["Nombre"] +"</h1>";
			html += "<p class='cont-content'>"+grupo["Descripcion"] +"</p>";
			html += "</div>";

			html += '<button onclick="addElement()" class="btn btn-small btn-primary">Añadir elemento</button>';
			document.querySelector(".userContent").innerHTML = html;


		};

		xhr.send();
	}
	else
		location.href="dashboard.php";
}

function closeGroup(){
	sessionStorage.removeItem("idProject");
	location.href="dashboard.php";	
}