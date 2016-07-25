/****** PROJECT *******/
function project(){
	var userName = document.querySelector('.userBar .userName');
	userName.innerHTML = sessionStorage.usuario;

	var orderElements = 0;	
	getProject();
	getGroups();
}

function getProject(){

	if(sessionStorage.getItem("idProject")){ 

		var idProject = sessionStorage.getItem("idProject");

		var url= 'rest/proyecto/' + idProject;
		var xhr = new XMLHttpRequest();
		var proyecto;
		xhr.open('GET', url, true);
		document.getElementById("projectContainer").innerHTML = "";

	  	xhr.onload = function(){

				//console.log(this.responseText);
				if(window.JSON) // Comprueba si soporta JSON nativo
					proyecto = window.JSON.parse( this.responseText );	

				if(proyecto.length>0)
					document.title = proyecto[0]["Nombre"];

				var ordenPadres = 0;

				//Anyadimos el primer contenedor de drop
				var elem_drop = document.createElement("div");
				elem_drop.dataset.order = ordenPadres;
				elem_drop.className = "drop-element first";

				elem_drop.ondragover = function(e){
			        e.preventDefault();
					addClass(e.target, "over");
			    };
			    elem_drop.ondrop = function(e){
			        e.preventDefault();
			        var id = e.dataTransfer.getData('text/plain');
			        var order = e.target.dataset.order;
			        addGroup(id, order);
			    };
			    elem_drop.ondragleave = function(e){
			    	e.preventDefault();
					removeClass(e.target, "over");
			    }

			    document.getElementById("projectContainer").appendChild(elem_drop); 
				
				var padre;				

				for(var i=0; i< proyecto.length; i++){
					with(proyecto[i]){
						//Solo si son padres
						if(idElemento == idPadre){
							var id = "el-" + idElemento;
							var padre = createHTMLElement(HTML);
							padre.id = id;
							padre.dataset.order = op;
							padre.className = "project-element-parent";	

							if(CSS)
								setCSS(CSS, id);


							var element_tools = document.createElement("div");
							element_tools.className = "element-tools";

							var html = "";
							html += "<button class='btn-blue btn btn-small'>";
							html += "	<i class='icon-cog-1'></i>";
							html += "</button>";
							html += "<button class='btn-green btn btn-small' onclick='moveElement(\"down\", "+op+", "+idElemento+")'>";
							html += "	<i class='icon-down-open'></i>";
							html += "</button>";
							html += "<button class='btn-green btn btn-small' onclick='moveElement(\"up\", "+op+", "+idElemento+")'>";
							html += "	<i class='icon-up-open-1'></i>";
							html += "</button>";
							html += "<button class='btn btn-small btn-red' onclick='removeElement("+idElemento+")'>";
							html += "	<i class='icon-trash'></i>";
							html += "</button>";

							element_tools.innerHTML = html;


							padre.appendChild(element_tools);

							var ordenHijos = 0;
							//Buscamos los hijos
							for(var j=0; j< proyecto.length; j++){
								var elem = proyecto[j];
								if(elem["idPadre"] == idElemento && idElemento != elem["idElemento"] ){
									var idHijo = "el-" + elem["idElemento"];
									var hijo = createHTMLElement(elem["HTML"]);
									hijo.id = idHijo;
									hijo.dataset.order = elem["oh"];
									hijo.className = "project-element";
									ordenHijos++;

									if(elem["CSS"])
										setCSS(elem["CSS"], idHijo);

									padre.appendChild(hijo);
								}
							}				

							document.getElementById("projectContainer").appendChild(padre); 

							ordenPadres++;

							//Element drop
							var elem_drop = document.createElement("div");
							elem_drop.dataset.order = ordenPadres;
							elem_drop.className = "drop-element";
						    //elem_drop.innerHTML = '<i class="icon-plus"></i>';

							elem_drop.ondragover = function(e){
						        e.preventDefault();
								addClass(e.target, "over");
						    };
						    elem_drop.ondrop = function(e){
						        e.preventDefault();
						        var id = e.dataTransfer.getData('text/plain');
						        var order = e.target.dataset.order;
						        addGroup(id, order);
						    };
						    elem_drop.ondragleave = function(e){
						    	e.preventDefault();
								removeClass(e.target, "over");
						    }


						    //Lo insertamos despues del padre
						    padre.parentNode.insertBefore(elem_drop, padre.nextSibling);						   

						}

					}
				}
				
		};

		xhr.send();
	}
	else
		location.href="dashboard.php";
}

/**
	Mueve un elemento
**/
function moveElement(direction, order, idelement){

	var numE = document.querySelectorAll("#projectContainer .project-element-parent").length;
	var directionId = undefined;

	if(direction == "up"){
		directionId = 1;
		order--;
	}else{
		directionId = 0;
		order++;
	}

	if(order >= 0 && order <= numE && idelement && directionId != undefined){
		var url = 'rest/elemento/';
		var xhr = new XMLHttpRequest();
		var params = '';
		xhr.open('POST', url, true);

		xhr.onload = function(){	

			o = JSON.parse(this.responseText);	
			//console.log(o);
			if(o.resultado == 'ok'){							
				getProject();						
			}else{
				swal({   
					title: "¡Upps! Ha habido algún error moviendo el elemento",   
					text: o.descripcion,   
					type: "error",     
					confirmButtonText: "Aceptar",   
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
function removeElement(idelement){

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

		var url = 'rest/elemento/' + idelement + "?idproject=" + sessionStorage.getItem("idProject");
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', url, true);

		xhr.onload = function(){	
				o = JSON.parse(this.responseText);	
				//console.log(o);
				if(o.resultado == 'ok'){							
					getProject();
				}else{				
					swal({   
						title: "¡Upps! Ha habido algún error",   
						text: "Ha habido algún error elminando el elemento, inténtalo de nuevo más tarde.",   
						type: "error",     
						confirmButtonText: "Aceptar",   
					});
				}
		};

		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(sessionStorage.usuario + ":" + sessionStorage.clave));
		xhr.send();
	});
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
			elem.dataset.id = groups[i].id;

			elem.innerHTML += "<h3>"+ groups[i].Nombre +"</h3>";
			if(groups[i].Descripcion && groups[i].Descripcion != "")
				elem.innerHTML += "<p>"+ groups[i].Descripcion +"</p>";

			elem.innerHTML += "<button class='btn btn-second btn-small' onclick='addGroup("+ groups[i].id +")'>Añadir</button>";

			// PARTE DEL DRAG
			elem.className = "grabbable";
		    elem.setAttribute('draggable','true');
		    elem.ondragstart = function(e){
		    	document.getElementById('open-right').click();
	            e.dataTransfer.setData('text/plain', e.target.dataset.id);
	        };

			container.appendChild(elem);
		    
		}
	}else{
		var elem = document.createElement("li");
		elem.innerHTML += "No se ha encontrado ningún grupo de elementos.";
		container.appendChild(elem);
	}
}

/**
Añade el grupo de elementos seleccionado al proyecto
Recibe el id del grupo y el orden del padre
**/
function addGroup(idgroup, order){	
	if(idgroup){
		var url = 'rest/elemento/';
		var xhr = new XMLHttpRequest();
		var params = '';
		xhr.open('POST', url, true);

		xhr.onload = function(){	

			o = JSON.parse(this.responseText);	
			//console.log(o);
			if(o.resultado == 'ok'){							
				getProject();		
				if( hasClass( document.querySelector(".menu-right") ,"active") )
					document.getElementById('open-right').click();				
			}else{
				swal({   
					title: "¡Upps! Ha habido algún error",   
					text: o.descripcion,   
					type: "error",     
					confirmButtonText: "Aceptar",   
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


	if( html.search("img") != -1){
		var elem = document.createElement("img");	
		var aux = html.split('"');
		var aux2 = aux[1].split('"');		
		elem.src = aux2;
	}else{
		var aux = html.split("<");
		var aux2 = aux[1].split(">");
		var elemName = aux2[0];
		var elemContent = aux2[1];

		var elem = document.createElement(elemName);
		elem.innerHTML = elemContent;
	}

	
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

//Menu colores
(function() {

	var bodyEl = document.body,
		content = document.querySelector( '.content' ),
		menuRight = document.querySelector( '.menu-right' ), 
		openbtn = document.getElementById( 'open-button' ),
		openright = document.getElementById( 'open-right' ),
		closebtn = document.getElementById( 'close-button' ),
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
		content.addEventListener( 'click', function(ev) {
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
		}
		else {
			addClass( bodyEl, 'show-menu' );
			addClass( openbtn, 'active' );
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