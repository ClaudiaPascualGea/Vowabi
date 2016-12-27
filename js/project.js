/****** PROJECT *******/
function project(){
	var userName = document.querySelector('.userBar .userName');
	userName.innerHTML = sessionStorage.usuario;

	var orderElements = 0;	
	getProject();
	getGroups();	
	prepareUploadInput();
}

/*
	Variables globales
*/
var dragElement = "";
var cssDOM = [];
var cssDOM768 = [];
var cssDOM1024 = [];
var loader = '<div class="loader"><span class="dot dot_1"></span><span class="dot dot_2"></span><span class="dot dot_3"></span><span class="dot dot_4"></span></div>';
var bigLoader2 = '<div class="spinner_2"><div class="spinner"></div><p>Añadiendo...</p></div>';

function getProject(){

	if(sessionStorage.getItem("idProject")){ 

		var idProject = sessionStorage.getItem("idProject");

		var url= 'rest/proyecto/' + idProject;
		var xhr = new XMLHttpRequest();
		var proyecto;
		xhr.open('GET', url, true);
		document.getElementById("projectContainer").innerHTML = loader;

	  	xhr.onload = function(){
		
			if(window.JSON) // Comprueba si soporta JSON nativo
				proyecto = window.JSON.parse( this.responseText );	

			if(proyecto.length>0){
				document.title = proyecto[0]["Nombre"];
				removeClass(document.querySelector(".tooltipRight"), "active");
			}
			else{
				addClass(document.querySelector(".tooltipRight"), "active");
			}

			var ordenPadres = 0;

			//Anyadimos el primer contenedor de drop
			var elem_drop = createDropElement(ordenPadres);
		    document.getElementById("projectContainer").appendChild(elem_drop); 
				
			var padre;				

			for(var i=0; i< proyecto.length; i++){
				with(proyecto[i]){	

					var id = "el-" + id;
					var padre = createHTMLElement(HTML);
					padre.id = id;
					padre.setAttribute("data-order", Orden);
					padre.className = "project-element-parent";	

					if(CSS){
						setCSS(CSS, id);
						if(cssDOM[id]["general"] && cssDOM[id]["general"]["background-image"]){
							padre.style.cursor = "pointer";
							padre.addEventListener("click", changeBackgroundImage, false);
						}
					}

					if(CSS_768)
						setCSSWidth(CSS_768, id, "768");	

					if(CSS_1024)
						setCSSWidth(CSS_1024, id, "1024");				

					var element_tools = createElementTools();
					padre.appendChild(element_tools);
			
					document.getElementById("projectContainer").appendChild(padre); 

					ordenPadres++;

					//Element drop
					var elem_drop = createDropElement(ordenPadres);						   
				    padre.parentNode.insertBefore(elem_drop, padre.nextSibling);			

				    if(hijos && hijos.length > 0)
				    	pintarHijos(hijos, padre);	

					if(ContentEditable == 1 && padre)
						enableContentEditable(padre);
				}
			}	

			document.getElementById("projectContainer").removeChild(document.querySelector(".loader"));
			prepareDropElements();
			$("body").getNiceScroll().resize();			
		};
		xhr.send();
	}
	else
		location.href="dashboard";
}

function getProject_old(){

	if(sessionStorage.getItem("idProject")){ 

		var idProject = sessionStorage.getItem("idProject");

		var url= 'rest/proyecto/' + idProject;
		var xhr = new XMLHttpRequest();
		var proyecto;
		xhr.open('GET', url, true);
		document.getElementById("projectContainer").innerHTML = "";

	  	xhr.onload = function(){
		
			if(window.JSON) // Comprueba si soporta JSON nativo
				proyecto = window.JSON.parse( this.responseText );	

			if(proyecto.length>0)
				document.title = proyecto[0]["Nombre"];

			var ordenPadres = 0;

			//Anyadimos el primer contenedor de drop
			var elem_drop = createDropElement(ordenPadres);
		    document.getElementById("projectContainer").appendChild(elem_drop); 
				
			var padre;				

			for(var i=0; i< proyecto.length; i++){
				with(proyecto[i]){
		
					//Buscamos si su padre esta pintado
					var elemento = [];
					padre = document.getElementById("el-"+idPadre);

					if(!padre){
						var id = "el-" + idElemento;
						var padre = createHTMLElement(HTML);
						padre.id = id;
						padre.setAttribute("data-order", op);
						padre.className = "project-element-parent";	

						if(CSS)
							setCSS(CSS, id);

						var element_tools = createElementTools();
						padre.appendChild(element_tools);
				
						document.getElementById("projectContainer").appendChild(padre); 

						ordenPadres++;

						//Element drop
						var elem_drop = createDropElement(ordenPadres);						   
					    padre.parentNode.insertBefore(elem_drop, padre.nextSibling);			

					    elemento = padre;			   

					}else{
											
						var elem = proyecto[i];						
						var idHijo = "el-" + elem["idElemento"];
						var hijo = createHTMLElement(elem["HTML"]);
						hijo.id = idHijo;
						hijo.setAttribute("data-order", elem["oh"]);
						hijo.className = "project-element";

						if(elem["CSS"])
							setCSS(elem["CSS"], idHijo);						

						padre.appendChild(hijo);				

						elemento = hijo;		
					}

					if(ContentEditable == 1 && elemento){
						var elem = elemento;
						//Hacemos el contenido editable
						elem.contentEditable = true;
						elem.addEventListener("input", changeHTML, false);

						if(elem.innerHTML != ""){										
							elem.addEventListener("focus", addTextBar, false);
							elem.addEventListener("blur", removeTextBar, false);								
						}
					}

				}
			}	

			prepareDropElements();
			$("body").getNiceScroll().resize();
			
		};

		xhr.send();
	}
	else
		location.href="dashboard";
}


function pintarHijos(hijos, padre){

	for (var i = 0; i < hijos.length; i++) {

		var elem = hijos[i];						
		var idHijo = "el-" + elem["id"];
		var hijo = createHTMLElement(elem["HTML"]);


		hijo.id = idHijo;
		hijo.setAttribute("data-order", elem["Orden"]);
		hijo.className = "project-element";

		if(hijo.tagName == "IMG"){
			hijo.style.cursor = "pointer";
			hijo.addEventListener("click", changeSRC, false);
		}

		if(elem["CSS"]){
			setCSS(elem["CSS"], idHijo);	
			if(cssDOM[idHijo]["general"] && cssDOM[idHijo]["general"]["background-image"]){
				hijo.style.cursor = "pointer";
				hijo.addEventListener("click", changeBackgroundImage, false);
			}
		}

		if(elem["CSS_768"])
			setCSSWidth(elem["CSS_768"], idHijo, "768");	

		if(elem["CSS_1024"])
			setCSSWidth(elem["CSS_1024"], idHijo, "1024");				

		padre.appendChild(hijo);			

		if(elem["hijos"] && elem["hijos"].length > 0)
	    	pintarHijos(elem["hijos"], hijo);		

		if(elem["ContentEditable"] == 1 && hijo)
			enableContentEditable(hijo);	
	}
}

function enableContentEditable(elem){					
	//Hacemos el contenido editable
	elem.contentEditable = true;
	elem.addEventListener("input", changeHTML, false);

	if(elem.innerHTML != ""){										
		elem.addEventListener("focus", addTextBar, false);
		elem.addEventListener("blur", removeTextBar, false);								
	}
}

/**
	Crea las herramientas para cada elemento
**/
function createElementTools(){
	var element_tools = document.createElement("div");
	element_tools.className = "element-tools";

	var html = "";
	html += "<button style='display:none;' class='btn-blue btn btn-small' data-title='Configuración'>";
	html += "	<i class='icon-cog-1'></i>";
	html += "</button>";
	html += "<button class='btn-green btn btn-small' data-title='Bajar bloque' onclick='moveElement(\"down\", this)'>";
	html += "	<i class='icon-down-open'></i>";
	html += "</button>";
	html += "<button class='btn-green btn btn-small' data-title='Subir bloque' onclick='moveElement(\"up\", this)'>";
	html += "	<i class='icon-up-open-1'></i>";
	html += "</button>";
	html += "<button class='btn btn-small btn-red' data-title='Eliminar bloque' onclick='removeElement(this)'>";
	html += "	<i class='icon-trash'></i>";
	html += "</button>";

	element_tools.innerHTML = html;

	return element_tools;
}



/**
	Crea el bloque para el drop de los elementos padre
**/
function createDropElement(orden){
	var elem_drop = document.createElement("div");
	elem_drop.setAttribute("data-order", orden);
	elem_drop.className = "drop-element";
    //elem_drop.innerHTML = '<i class="icon-plus"></i>';

	elem_drop.ondragover = function(e){
        e.preventDefault();
        if(dragElement == "group")
			addClass(e.target, "over");
    };
    elem_drop.ondrop = function(e){
        e.preventDefault();
        if(dragElement == "group"){
	        var id = e.dataTransfer.getData('text');
	        var order = e.target.getAttribute("data-order");
	        addGroup(id, order);
	    }
	    dragElement = "";
    };
    elem_drop.ondragleave = function(e){
    	e.preventDefault();
		removeClass(e.target, "over");
    }

    return elem_drop;
}

/**
	Prepara el input file para la subida de imagenes
**/
function prepareUploadInput(){

	var input = document.getElementById("uploadFile");

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		fileName = e.target.value.split( '\\' ).pop();

		uploadFile(this.files[0], fileName, this.getAttribute("data-id"));					

	});
}

/**
	Cambia el SRC de las imagenes
**/
function changeSRC(){
	var id = this.id;
	id = id.replace("el-", "");

	var inp = document.getElementById("uploadFile");
	inp.setAttribute("data-id", id);
	inp.click();
}

function changeBackgroundImage(){
	var id = this.id;
	id = id.replace("el-", "");

	var inp = document.getElementById("uploadFile");
	inp.setAttribute("data-id", id);
	inp.click();
}


function uploadFile(file, filename, idelement){

	var formdata = new FormData();
	formdata.append('file', file);
	formdata.append('fileName', filename);
	formdata.append('idelement', idelement);

	var url = 'rest/elemento/';
	var xhr = new XMLHttpRequest();
	var params = '';
	xhr.open('POST', url, true);

	var div = document.createElement("div");
	div.className = "spinner_2";
	div.innerHTML += '<div class="spinner"></div><p>Subiendo Foto...</p>';
	document.querySelector("body").appendChild(div);

	xhr.onload = function(){	
			o = JSON.parse(this.responseText);	
			document.querySelector("body").removeChild(document.querySelector(".spinner_2"));	
			if(o.resultado == 'ok'){				
				//console.log(o);
				var el = document.getElementById("el-"+idelement);
				if(el.tagName == "IMG"){
					el.src = o.imagen;
					changeHTML(el);						
				}else{
					changeCSS("background-image", "url("+o.imagen+")", idelement);
				}
			}else{
				swal({
					title: "Error", 
					text: o.descripcion, 
					type: "warning",
					confirmButtonText: "Aceptar",  
					html: true 
				}, function(){  
					if(o.code == 408)
						logout();
				});		
			}
	};

	// params = 'idGrupo='+sessionStorage.getItem("idGroup") + '&image='+file + '&imageName='+filename;
	// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
	xhr.send(formdata);
	return false;
	
}


/**
	Cambia el HTML de un elemento cuando es Contenteditable
**/
function changeHTML(el){

	if(this.id)
		el = this;

	var id = el.id;
	var idelement = id.replace("el-", "");
	var elem = createHTMLElement(el.outerHTML, true);
	var html = elem.outerHTML;

	if(html && idelement){
		var url = 'rest/elemento/';
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);

		xhr.onload = function(){	
				o = JSON.parse(this.responseText);	
				//console.log(o);				
				if(o.resultado != 'ok'){												
					swal({   
						title: "¡Upps! Ha habido algún error",   
						text: "Ha habido algún error cambiando el HTML del elemento, inténtalo de nuevo más tarde.",   
						type: "error",     
						confirmButtonText: "Aceptar",   
						closeOnConfirm: false
					}, function(){  
						if(o.code == 408)
							logout();
					});
				}
		};
		params = 'idelement='+idelement + '&html='+ html;
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
		xhr.send(params);
	}
}

/**
	Mueve un elemento
**/
function moveElement(direction, element){

	var order = element.parentNode.parentNode.getAttribute("data-order");
	var id = element.parentNode.parentNode.id;
	var idelement = id.replace("el-", "");

	var numE = document.querySelectorAll("#projectContainer .project-element-parent").length;
	var iniOrder = order;
	var directionId = undefined;

	if(direction == "up"){
		directionId = 1;
		order--;
	}else{
		directionId = 0;
		order++;
	}

	if(order >= 0 && order < numE && idelement && directionId != undefined){

		var url = 'rest/elemento/';
		var xhr = new XMLHttpRequest();
		var params = '';
		xhr.open('POST', url, true);

		xhr.onload = function(){	

			o = JSON.parse(this.responseText);	
			//console.log(o);
			if(o.resultado == 'ok'){							
				//getProject();		
				//Movemos los elementos con JS
				var element = document.querySelector("#projectContainer #el-"+idelement);
				var secondElement = document.querySelector("#projectContainer .project-element-parent[data-order='"+order+"']");				

				element.setAttribute("data-order", order);
				secondElement.setAttribute("data-order", iniOrder);

				if(direction == "up"){			
					element.parentNode.insertBefore(element, secondElement);
					element.parentNode.insertBefore(secondElement, secondElement.nextSibling.nextSibling);
				}else{
					element.parentNode.insertBefore(element, secondElement.nextSibling);
					element.parentNode.insertBefore(secondElement, secondElement.previousSibling);
				}

			}else{
				swal({   
					title: "¡Upps! Ha habido algún error moviendo el elemento",   
					text: o.descripcion,   
					type: "error",     
					confirmButtonText: "Aceptar", 
					closeOnConfirm: false
					}, function(){  
						if(o.code == 408)
							logout();
				});
			}
		};

		params = 'idproject='+ sessionStorage.getItem("idProject") + '&idelement='+idelement + '&order='+order + '&direction=' + directionId;
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
		xhr.send(params);
	}
}


/**
Elimina el elemento del proyecto del usuario
**/
function removeElement(element){

	var elementProject = element.parentNode.parentNode;
	var order = elementProject.getAttribute("data-order");
	var id = elementProject.id;
	var idelement = id.replace("el-", "");

	swal({   
		title: "Eliminar elemento",   
		text: "¿Estas seguro de que deseas eliminar el elemento?",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Eliminar",   
		cancelButtonText: "Cancelar",
		closeOnConfirm: false,
		html: true
	}, function(){   

		//Cerramos el modal
		document.querySelector(".sa-button-container .cancel").click();

		//var url = 'rest/elemento/' + idelement + "?idproject=" + sessionStorage.getItem("idProject") ;
		var url = 'rest/elemento/';
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);

		xhr.onload = function(){	
				o = JSON.parse(this.responseText);	
				//console.log(o);
				if(o.resultado == 'ok'){							
					//getProject();
					elementProject.parentNode.removeChild(elementProject.previousSibling);
					elementProject.parentNode.removeChild(elementProject);
					$("body").getNiceScroll().resize();				
					resetOrder(order,0);

					var numE = document.querySelectorAll("#projectContainer .project-element-parent").length;
					if(numE == 0)
						addClass(document.querySelector(".tooltipRight"), "active");
				}else{						
					swal({   
						title: "¡Upps! Ha habido algún error",   
						text: "Ha habido algún error elminando el elemento, inténtalo de nuevo más tarde.",   
						type: "error",     
						confirmButtonText: "Aceptar",   
						closeOnConfirm: false
					}, function(){  
						if(o.code == 408)
							logout();
					});
				}
		};
		params = 'idproject='+ sessionStorage.getItem("idProject") + '&idelement='+idelement + '&order='+order + '&delete='+true;
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
		xhr.send(params);
		/*xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.getItem("usuario") + ":" + sessionStorage.getItem("clave") ));
		xhr.send();*/
	});
}

/**
Cambia el orden de los elementos mayores que order tras un borrado (type=0) o tras anyadir un elemento (type=1)
**/
function resetOrder(order, type, id){
	var elements = document.querySelectorAll("#projectContainer .project-element-parent");

	for(var i=0; i< elements.length; i++){
		var elemOrder = elements[i].getAttribute("data-order");
		var elemId = elements[i].id;
		if(elemOrder > order){
			if(type == 0){ //Tras el borrado
				elements[i].setAttribute("data-order", parseInt(elemOrder)-1);
				elements[i].previousSibling.setAttribute("data-order", parseInt(elemOrder)-1);					
			}else{ //Tras un anyadido
				elements[i].setAttribute("data-order", parseInt(elemOrder)+1);
				elements[i].previousSibling.setAttribute("data-order", parseInt(elemOrder)+1);							
			}

		}
	}

	if(type == 0){
		var elem = document.querySelector("#projectContainer .drop-element[data-order='"+parseInt(elements.length + 1)+"']");
		elem.setAttribute("data-order", parseInt(elements.length));		
	}else{
		var elem = document.querySelectorAll("#projectContainer .drop-element[data-order='"+elements.length+"']");
		if(elem[1])
			elem[1].setAttribute("data-order", parseInt(elements.length)+1);	
	}

}



/**
Obtiene todos los grupos de elementos
**/
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

/**
Obtiene todos los elementos independientes
**/
function getElements(){

	var url='rest/elemento/?ind=true';
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

/**
Pinta todos los grupos de elementos
**/
function listGroups(groups, container){
	
	container.innerHTML = "";

	if(groups.length){
		for(var i=0; i<groups.length; i++){
			var elem = document.createElement("li");
			elem.setAttribute("data-id", groups[i].id);

			elem.innerHTML += "<h3>"+ groups[i].Nombre +"</h3>";
			
			if(groups[i].Fichero){
				elem.innerHTML += "<img data-id='"+groups[i].id+"' src='"+groups[i].Fichero+"'>";			
			}else{					
				if(groups[i].Descripcion && groups[i].Descripcion != "")
					elem.innerHTML += "<p>"+ groups[i].Descripcion +"</p>";
				elem.innerHTML += "<button class='btn btn-second btn-small' onclick='addGroup("+ groups[i].id +")'>Añadir</button>";
			}

			// PARTE DEL DRAG
			elem.className = "grabbable";
		    elem.setAttribute('draggable','true');
		    elem.ondragstart = function(e){
		    	document.getElementById('open-right').click();
	            e.dataTransfer.setData('text', e.target.getAttribute("data-id"));
	            dragElement = "group";
	            addClasses(document.querySelectorAll(".drop-element"), "active");
	        };
	        elem.ondragend = function(e){	    	
		    	e.preventDefault();
		    	dragElement = "";		    	
				removeClasses(document.querySelectorAll(".drop-element"), "active");
		    }

			container.appendChild(elem);
		    
		}
	}else{
		var elem = document.createElement("li");
		elem.innerHTML += "No se ha encontrado ningún grupo de elementos.";
		container.appendChild(elem);
	}
}

function addLoader(){
	var div = document.createElement("div");
	div.className = "spinner_2";
	div.innerHTML += '<div class="spinner"></div><p>Añadiendo...</p>';
	document.querySelector("body").appendChild(div);
}


/**
Añade el grupo de elementos seleccionado al proyecto
Recibe el id del grupo y el orden del padre
**/
function addGroup(idgroup, order){	

	if(!order)
		order = document.querySelectorAll("#projectContainer .project-element-parent").length;

	if(idgroup){
		var url = 'rest/elemento/';
		var xhr = new XMLHttpRequest();
		var params = '';
		xhr.open('POST', url, true);

		addLoader();

		xhr.onload = function(){	

			o = JSON.parse(this.responseText);	
			//console.log(o);
			if(o.resultado == 'ok'){							
				//getProject();										
				addGroupElements(o.elements);
				if( hasClass( document.querySelector(".menu-right") ,"active") )
					document.getElementById('open-right').click();			

				removeClass(document.querySelector(".tooltipRight"), "active");
			}else{
				swal({   
					title: "¡Upps! Ha habido algún error",   
					text: o.descripcion,   
					type: "error",     
					confirmButtonText: "Aceptar",   
				}, function(){  
					if(o.code == 408)
						logout();
				});
			}
		};

		params = 'idproject='+ sessionStorage.getItem("idProject") + '&idgroup='+idgroup + '&order='+order;
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
		xhr.send(params);
	}
	//getElements(idgroup);
}

/**
	Añade un grupo de elementos en su posición adecuada
**/
function addGroupElements(elements){

	var projectElements = document.querySelectorAll("#projectContainer .project-element-parent").length;

	with(elements[0]){
		var id = "el-" + id;
		var padre = createHTMLElement(HTML);
		padre.id = id;
		padre.setAttribute("data-order", parseInt(order) );
		padre.className = "project-element-parent";	

		if(CSS)
			setCSS(CSS, id);

		if(CSS_768)
			setCSSWidth(CSS_768, id, "768");	

		if(CSS_1024)
			setCSSWidth(CSS_1024, id, "1024");				

		var element_tools = createElementTools();
		padre.appendChild(element_tools);
		var ordenPadre = order;

		resetOrder(order-1, 1);

		var orderSibling = parseInt(order);

		if(order < projectElements){
			var orderSibling = parseInt(order) + 1;
			var elemDrop =  document.querySelector("#projectContainer .drop-element[data-order='"+(orderSibling)+"']");	
			document.getElementById("projectContainer").insertBefore(padre, elemDrop); 		
		}else{
			document.getElementById("projectContainer").appendChild(padre);
		}

		createDropColorElement(padre);

		//Element drop			
		if(order < projectElements){   
			var elem_drop = createDropElement(ordenPadre);		
	    	padre.parentNode.insertBefore(elem_drop, padre);
	    }else{
	    	var elem_drop = createDropElement( parseInt(ordenPadre) + 1);	
	    	document.getElementById("projectContainer").appendChild(elem_drop);
	    }

	    var overDrop = document.querySelector("#projectContainer .drop-element.over");
	    if(overDrop)
	    	removeClass(overDrop, "over");


	    if(hijos && hijos.length > 0)
	    	pintarHijos(hijos, padre);	

		if(ContentEditable == 1 && padre)
			enableContentEditable(padre);
	}

	document.querySelector("body").removeChild(document.querySelector(".spinner_2"));
	$("body").getNiceScroll().resize();			
}

function addGroupElements2(elements){

	var projectElements = document.querySelectorAll("#projectContainer .project-element-parent").length;

	var padre;				
	for(var i=0; i< elements.length; i++){

		with(elements[i]){

			//Buscamos si su padre esta pintado
			var elemento = [];
			padre = document.getElementById("el-"+idPadre);

			if(!padre){
				var id = "el-" + idElemento;
				var padre = createHTMLElement(HTML);
				padre.id = id;
				padre.setAttribute("data-order", order);
				padre.className = "project-element-parent";	

				if(CSS)
					setCSS(CSS, id);

				if(CSS_768)
					setCSSWidth(CSS_768, id, "768");	

				if(CSS_1024)
					setCSSWidth(CSS_1024, id, "1024");				

				var element_tools = createElementTools();
				padre.appendChild(element_tools);
				var ordenPadre = order;
		
				resetOrder(order-1, 1);

				var orderSibling = parseInt(order);

				if(order < projectElements){
					var orderSibling = parseInt(order) + 1;
					var elemDrop =  document.querySelector("#projectContainer .drop-element[data-order='"+(orderSibling)+"']");	
					document.getElementById("projectContainer").insertBefore(padre, elemDrop); 		
				}else{
					document.getElementById("projectContainer").appendChild(padre);
				}

				createDropColorElement(padre);

				
				//Element drop			
				if(order < projectElements){   
					var elem_drop = createDropElement(ordenPadre);		
			    	padre.parentNode.insertBefore(elem_drop, padre);
			    }else{
			    	var elem_drop = createDropElement( parseInt(ordenPadre) + 1);	
			    	document.getElementById("projectContainer").appendChild(elem_drop);
			    }

			    var overDrop = document.querySelector("#projectContainer .drop-element.over");
			    if(overDrop)
			    	removeClass(overDrop, "over");

			    $("body").getNiceScroll().resize();

			}else{
									
				var elem = elements[i];						
				var idHijo = "el-" + elem["idElemento"];
				var hijo = createHTMLElement(elem["HTML"]);
				hijo.id = idHijo;
				hijo.setAttribute("data-order", elem["oh"]);
				hijo.className = "project-element";

				if(hijo.tagName == "IMG"){
					hijo.style.cursor = "pointer";
					hijo.addEventListener("click", changeSRC, false);
				}

				if(elem["CSS"])
					setCSS(elem["CSS"], idHijo);						

				if(elem["CSS_768"])
					setCSSWidth(elem["CSS_768"], idHijo, "768");	

				if(elem["CSS_1024"])
					setCSSWidth(elem["CSS_1024"], idHijo, "1024");				

				padre.appendChild(hijo);				

				elemento = hijo;		
			}

			if(ContentEditable == 1 && elemento)
				enableContentEditable(elemento);				
			
		}

		$("body").getNiceScroll().resize();
	}	
}

/**
Obtiene todos los elementos del grupo seleccionado
**/
function getElements(idgroup){

	if(idgroup){
		var url='rest/elemento/?idgroup='+idgroup;
		var xhr = new XMLHttpRequest();
		var elements;
		var container = document.querySelector(".projectContainer");
		xhr.open('GET', url, true);

	  	xhr.onload = function(){
				if(window.JSON) // Comprueba si soporta JSON nativo
					elements = window.JSON.parse( this.responseText );

				//console.log(elements);				
		};

		xhr.send();		
	}
}

function createHTMLElement(html, clean) {
	
	if( html.search("img") != -1){
		var elem = document.createElement("img");	
		var aux = html.split('"');
		var aux2 = aux[1].split('"');		
		elem.src = aux2;		
	}else{
		var aux = html.split("<");
		var aux2 = aux[1].split(">");

		var elementType = aux2[0].split(" ")[0];
		
		//var elemContent = aux2[1];
		var cont1 = html.substring(aux[1].indexOf(">") + 2);
		var regex1 = new RegExp('\\</'+elementType+'\\>', 'gi');
		elemContent = cont1.replace(regex1, "");						

		var elem = document.createElement(elementType);
		elem.innerHTML = elemContent;
	}

	
	return elem;
}

function changeCSS(key, value, idelement){

	var id = "el-"+idelement;

	if(cssDOM[id]){
		if(cssDOM[id]["general"][key] == value)
			delete cssDOM[id]["general"][key];
		else
			cssDOM[id]["general"][key] = value;

		var css = deParse(cssDOM[id]);
	}else{
		var css = "";
	}

	if(css && idelement){
		var url = 'rest/elemento/';
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);

		xhr.onload = function(){	
				o = JSON.parse(this.responseText);	
				//console.log(o);
				if(o.resultado != 'ok'){												
					swal({   
						title: "¡Upps! Ha habido algún error",   
						text: "Ha habido algún error cambiando el CSS del elemento, inténtalo de nuevo más tarde.",   
						type: "error",     
						confirmButtonText: "Aceptar",   
						closeOnConfirm: false
					}, function(){  
						if(o.code == 408)
							logout();
					});
				}else{
					//getStyleEqu(style)
					//document.getElementById(id).syle.
					resetCSS();
				}
		};
		params = 'idelement='+idelement + '&css='+ css;
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
		xhr.send(params);
	}

}	

function setCSS(CSS, id){

	cssDOM[id] = parseCSS(CSS);
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

function setCSSWidth(CSS, id, width){

	if(width == "768")
		cssDOM768[id] = parseCSS(CSS);
	else if(width == "1024")
		cssDOM1024[id] = parseCSS(CSS);

	var css = '';
	var v =  CSS.split('--');

	css += "@media all and (min-width: "+width+"px) {";
	for(var i=1; i<v.length; i=i+2){

		if(v[i] == "general")
			css += '#'+id+'{';
		else if(v)
			css += '#'+id + v[i] + '{';

		css += v[i+1];
		css += '}';
	}
	css += "}";

	document.getElementById("projectStyle").innerHTML += css;
}

function resetCSS(){
	var css = '';

	css += setCSSDOM(cssDOM);

	if(cssDOM768){
		css += "@media all and (min-width:768px){";
		css += setCSSDOM(cssDOM768);
		css += "}";
	}

	if(cssDOM1024){
		css += "@media all and (min-width:1024px){";
		css += setCSSDOM(cssDOM1024);
		css += "}";
	}

	document.getElementById("projectStyle").innerHTML = css;
}

function setCSSDOM(obj){
	var css = "";
	for(var key in obj){	
		if(obj[key]){
			for(var key2 in obj[key]){
				var el = obj[key];
				if(el[key2]){

					if(key2  == "general")
						css += '#'+key+'{';
					else
						css += '#'+key+key2+'{';

					for(var key3 in el[key2]){
						var val = el[key2];
						css += key3 + ':' + val[key3] +";";						
					}

					css += '}';
				}
					
			}
		}
	}
	return css;
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
	return css;
}


function closeProject(){
	sessionStorage.removeItem("idProject");
	location.href="dashboard";	
}

//Menu colores
(function() {

	var bodyEl = document.body,
		content = document.querySelector( '.content' ),
		overlay = document.querySelector( '.overlay' ),
		menuRight = document.querySelector( '.menu-right' ), 
		openbtn = document.getElementById( 'open-button' ),
		openright = document.getElementById( 'open-right' ),
		closebtn = document.getElementById( 'close-button' )
		isOpen = false,
		isOpenRight = false;

	function init() {
		initEvents();
	}

	function initEvents() {
		openbtn.addEventListener( 'click', toggleMenu );
		openright.addEventListener( 'click', toggleMenuRight );

		if( closebtn ) {
			closebtn.addEventListener( 'click', toggleMenu );
		}

		// close the menu element if the target it´s not the menu element or one of its descendants..
		overlay.addEventListener( 'click', function(ev) {
			var target = ev.target;
			if( isOpen && target !== openbtn ) {
				toggleMenu();				
			}

			if(isOpenRight && target !== openright)
				toggleMenuRight();

		} );
	}

	function toggleMenu() {
		if( isOpen ) {
			removeClass( bodyEl, 'show-menu' );
			removeClass( openbtn, 'active' );			
			$(".menu-wrap .menu ul").getNiceScroll().hide();
		}
		else {
			addClass( bodyEl, 'show-menu' );
			addClass( openbtn, 'active' );		
			$(".menu-wrap .menu ul").getNiceScroll().show();	
		}
		isOpen = !isOpen;
	}


	function toggleMenuRight() {
		if( isOpenRight ) {
			removeClass( content, 'active' );
			removeClass( menuRight, 'active' );
			removeClass( openright, 'active' );
			removeClass( bodyEl, 'show-menu-right' );

		}
		else {
			$('.menu-right').niceScroll({
			    autohidemode: true,   
			    cursorborderradius: '0px',
			    cursorwidth: '5px',     
			    cursorcolor: '#222c35',
			    enablescrollonselection: false,
			    nativeparentscrolling: false,
			    spacebarenabled: false,
			});
			addClass( content, 'active' );
			addClass( menuRight, 'active' );
			addClass( openright, 'active' );
			addClass( bodyEl, 'show-menu-right' );
		}
		isOpenRight = !isOpenRight;
	}

	init();

})();
//End menu colores



/****** END PROJECT *******/