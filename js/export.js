var doc;
var filename;
var zip;
var img;

function exportProject(){

	zip = new JSZip();
	img = zip.folder("uploads");

	doc = document.implementation.createHTMLDocument("New Document");
	fileName = "prueba.html";

	var headMeta = '<meta charset="UTF-8">';
	headMeta += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
	doc.head.innerHTML += headMeta;

	var style = doc.createElement("style");
	style.id = "exportCSS";
	doc.head.appendChild(style);
	doc.getElementById("exportCSS").innerHTML += "body{margin:0;}";

	prepareExportFonts();

	getExportProject();
}

//Monta el html del proyecto
function getExportProject(){

	if(sessionStorage.getItem("idProject")){ 

		var idProject = sessionStorage.getItem("idProject");

		var url= 'rest/proyecto/' + idProject;
		var xhr = new XMLHttpRequest();
		var proyecto;
		xhr.open('GET', url, true);

		var body = doc.body;
		
	  	xhr.onload = function(){
		
			if(window.JSON) // Comprueba si soporta JSON nativo
				proyecto = window.JSON.parse( this.responseText );	

			if(proyecto.length>0){
				doc.title = proyecto[0]["Nombre"];
				fileName = proyecto[0]["Nombre"] + ".html";				
			}

			var ordenPadres = 0;
	
			var padre;				

			for(var i=0; i< proyecto.length; i++){
				with(proyecto[i]){			
				
					var id = "el-" + id;
					var padre = createHTMLElement(HTML);
					padre.id = id;					

					if(CSS)
						setCSSExport(CSS, id);
					
					//document.getElementById("exportContainer").appendChild(padre); 
					body.appendChild(padre); 

					ordenPadres++;
					
				    if(hijos && hijos.length > 0)
				    	pintarHijosExport(hijos, padre);	
				}
			}	

			var html = doc.documentElement.outerHTML;

			zip.file("index.html", html);
			zip.generateAsync({type:"blob"})
				.then(function(content) {	
					saveAs(content, "VowabiProject.zip");
				});

		};

		xhr.send();
	}
	else
		location.href="dashboard";
}


function pintarHijosExport(hijos, padre){

	for (var i = 0; i < hijos.length; i++) {

		var elem = hijos[i];						
		var idHijo = "el-" + elem["id"];
		var hijo = createHTMLElement(elem["HTML"]);
		hijo.id = idHijo;

		if(elem["CSS"])
			setCSSExport(elem["CSS"], idHijo);					

		if(hijo.tagName == "IMG"){
			
			var image = getBase64Image(hijo);
			var aux = hijo.src.split('/');	
			var name = aux[aux.length-1];

			img.file(name, image, {base64: true});
		}

		padre.appendChild(hijo);			
		
		if(elem["hijos"] && elem["hijos"].length > 0)
	    	pintarHijosExport(elem["hijos"], hijo);			
	}
}

function setCSSExport(CSS, id){

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
	doc.getElementById("exportCSS").innerHTML += css;
}

function getBase64Image(img) {
    var canvas = doc.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function prepareExportFonts(){
  for(var i=0; i<fonts.length; i++){
    var link = settings.api + fonts[i];
    
    var x = doc.createElement("LINK");
    x.setAttribute("rel", "stylesheet");
    x.setAttribute("type", "text/css");
    x.setAttribute("href", link);
    doc.head.appendChild(x);
  }

}