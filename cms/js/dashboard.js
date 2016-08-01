
/****** DASHBORAD ******/
function dashboard(){
	getGroups();
	getColors();
}

function getColors(){

	var url='rest/color/?all=true';
	var xhr = new XMLHttpRequest();
	var colors;
	xhr.open('GET', url, true);

  	xhr.onload = function(){
			if(window.JSON) // Comprueba si soporta JSON nativo
				colors = window.JSON.parse( this.responseText );
			listColors(colors);	
	};

	xhr.send();
}

function listColors(colors){
	
	var container = document.querySelector(".dashboard .colors-list");
	container.innerHTML = "";

	if(colors.length){
		for(var i=0; i<colors.length; i++){
			var elem = document.createElement("li");
			elem.dataset.id = colors[i].id;

				var div = document.createElement("div");
				div.className = "text";
				div.innerHTML += "<h3><span class='projectName'>"+ colors[i].Nombre +"</span> - <span class='date'>"+ colors[i].Valor +"</span></h3>";				

			elem.appendChild(div);

				var div = document.createElement("div");
				div.className = "buttons";				
				div.innerHTML += " 	<button class='btn btn-red btn-small' onclick='confirmDeleteColor("+ colors[i].id +")'><i class='icon-trash'></i></button>";
				
	
			elem.appendChild(div);
			container.appendChild(elem);
		}
	}else{
		var elem = document.createElement("li");
		elem.innerHTML += "Todavía no tienes ningún proyecto.";
		container.appendChild(elem);
	}
}


function confirmDeleteColor(id){

	swal({   
		title: "Eliminar Color",   
		text: "¿Estas seguro de que deseas eliminar el color?",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Eliminar",   
		cancelButtonText: "Cancelar",
		closeOnConfirm: false,
		html: true
	}, function(){   
		//removeColor(id);
	});
}

function removeColor(id){
	var idcolor = id;
	var url = 'rest/color/' + idProject;
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	
			console.log(o);
			if(o.resultado == 'ok'){			
				swal({   
					title: "Proyecto eliminado correctamente",   
					text: "Tu proyecto ha sido eliminado correctamente",   
					type: "success",     
					confirmButtonText: "Aceptar",   
				});
				getProjects();
			}else{				
				swal({   
					title: "¡Upps! Ha habido algún error",   
					text: "Ha habido algún error elminando tu proyecto, inténtalo de nuevo más tarde.",   
					type: "error",     
					confirmButtonText: "Aceptar",   
				});
			}
	};

	xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
	xhr.send();
	return false;
}

function getGroups(){

	var url='rest/grupo/?all=true';
	var xhr = new XMLHttpRequest();
	var groups;
	var container = document.querySelector(".group-list");
	container.innerHTML = "";

	xhr.open('GET', url, true);

  	xhr.onload = function(){
			if(window.JSON) // Comprueba si soporta JSON nativo
				groups = window.JSON.parse( this.responseText );
			listGroups(groups, container);
	};

	xhr.send();
}

function listGroups(groups, container){
	
	container.innerHTML = "";

	if(groups.length){
		for(var i=0; i<groups.length; i++){
			var elem = document.createElement("li");
			elem.setAttribute("data-id", groups[i].id);

			elem.innerHTML += "<h3>"+ groups[i].Nombre +"</h3>";
			if(groups[i].Descripcion && groups[i].Descripcion != "")
				elem.innerHTML += "<p>"+ groups[i].Descripcion +"</p>";

			container.appendChild(elem);

			var div = document.createElement("div");
				div.className = "buttons";
				div.innerHTML += " 	<button class='btn-icon btn btn-second btn-small' onclick='editGroup("+ groups[i].id +")'><i class='icon-pencil'></i><span>Editar</span></button>";							
	
			elem.appendChild(div);
		    
		}
	}else{
		var elem = document.createElement("li");
		elem.innerHTML += "No se ha encontrado ningún grupo de elementos.";
		container.appendChild(elem);
	}
}

function createGroup(form){

	var name = form.name.value;
	var description = form.description.value;
	var url = 'rest/grupo/';
	var xhr = new XMLHttpRequest();
	var params = '';
	xhr.open('POST', url, true);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	

			if(o.resultado == 'ok'){				
				swal({
						title: "Proyecto creado correctamente", 
						text: "Tu proyecto " + o.nombre + " ha sido creado correctamente", 
						type: "success",
						confirmButtonText: "Aceptar",  
						html: true 
					}); 			
				editGroup(o.id);
			}else{
				$(".dashboard form .tooltip").html(o.descripcion);
				$(".dashboard form .tooltip").css("height", "20px");
			}
	};

	params = 'name='+name + '&description='+description;
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
	xhr.send(params);
	return false;
}

function editGroup(idGroup){
	sessionStorage.setItem('idGroup', idGroup);
	window.location.href = "grupo.php";
}

/****** END DASHBOARD *******/