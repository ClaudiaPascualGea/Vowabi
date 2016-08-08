function initColors(){
	getColors();	
}

/**
Obtiene todos los colores
**/
function getColors(){

	var url='rest/color/?all=true';
	var xhr = new XMLHttpRequest();
	var colors;
	var container = document.querySelector(".menu-wrap .menu");
	container.innerHTML = "";

	xhr.open('GET', url, true);

  	xhr.onload = function(){
			if(window.JSON) // Comprueba si soporta JSON nativo
				colors = window.JSON.parse( this.responseText );
			listColors(colors, container);
	};

	xhr.send();
}

function listColors(colors, container){
	var ul = document.createElement("ul");
	for (var i = 0; i < colors.length; i++) {
		var li = document.createElement("li");

		li.className = "color";
		li.style.backgroundColor = colors[i].Valor;
		li.setAttribute('data-color', colors[i].Valor);
		li.setAttribute('data-id', colors[i].id);

		addClass(li, "grabbable");
	    li.setAttribute('draggable','true');
	    li.ondragstart = function(e){	    	
            e.dataTransfer.setData('text', e.target.getAttribute("data-color"));
            addClasses(document.querySelectorAll("#projectContainer .drop-element"), "hidden");
            dragElement = "color";
        };
        li.ondragend = function(e){	    	
	    	e.preventDefault();
	    	dragElement = "";
			removeClasses(document.querySelectorAll("#projectContainer .drop-element"), "hidden");
			removeClasses(document.querySelectorAll("#projectContainer .project-element-parent"), "over");
			removeClasses(document.querySelectorAll("#projectContainer .project-element"), "over");
	    }

		ul.appendChild(li);
	}
	container.appendChild(ul);

	$(ul).niceScroll({
		autohidemode: true,     
		cursorborderradius: '0px', 
		background: '#222c35',     
		cursorwidth: '5px',      
		cursorcolor: '#999999',
		hidecursordelay: 200,
		enablescrollonselection: false,
		nativeparentscrolling: false
	});
	$(ul).getNiceScroll().hide();

	$(window).bind('scroll',function(){
        $(ul).getNiceScroll().resize();
    });
    $(ul).mouseover(function() {
	    $(ul).getNiceScroll().resize();
	});
	
}

function prepareDropElements(){
	var elements = document.querySelectorAll("#projectContainer .project-element-parent");
	
	for (var i = 0; i < elements.length; i++) {
		var elem = elements[i];		
		createDropColorElement(elem);
	}
	
}

function createDropColorElement(elem){
	elem.ondragover = function(e){
        e.preventDefault();
        if(dragElement == "color")
			addClass(e.target, "over");
    };
    elem.ondrop = function(e){
        e.preventDefault();
        if(dragElement == "color"){
	        var color = e.dataTransfer.getData('text');
	        var id = e.target.id;
	        var idelement = id.replace("el-", "");

	        var back = cssDOM[id]["general"]["background-color"];

	        if(back != undefined)
	        	changeCSS("background-color", color, idelement);		  
	        else
	        	changeCSS("color", color, idelement);
	    }		   
	    dragElement = "";
    };
    elem.ondragleave = function(e){
    	e.preventDefault();
		removeClass(e.target, "over");
    }	    
}
