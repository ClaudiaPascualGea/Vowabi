
/****** DASHBORAD ******/
function dashboard(){
	var userName = document.querySelector('.dashboard .userBar .userName');
	userName.innerHTML = sessionStorage.usuario;

	prepareSlider();
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
				div.innerHTML += " 	<button class='btn-icon btn btn-second btn-small' onclick='editProject("+ projects[i].id +")'><i class='icon-pencil'></i><span>Editar</span></button>";
				div.innerHTML += " 	<button class='btn btn-red btn-small' onclick='confirmDeleteProject("+ projects[i].id +")'><i class='icon-trash'></i></button>";
				
	
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
	window.location.href="project";
}

function confirmDeleteProject(id){

	swal({   
		title: "Eliminar proyecto",   
		text: "¿Estas seguro de que deseas eliminar el proyecto?<br>Todas sus dependencias también serán borradas.",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Eliminar",   
		cancelButtonText: "Cancelar",
		closeOnConfirm: false,
		html: true
	}, function(){   
		removeProject(id);
	});
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
				swal({
						title: "Proyecto creado correctamente", 
						text: "Tu proyecto " + o.nombre + " ha sido creado correctamente", 
						type: "success",
						confirmButtonText: "Aceptar",  
						html: true 
					}); 			
				document.getElementById("createProject").reset();
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