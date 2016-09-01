var doc;
var filename;
var zip;
var img;
var cssDOMExport = [];
var cssDOM768Export = [];
var cssDOM1024Export = [];
var bigLoader = '<section class="spinner_2"><div class="spinner"></div><p>Exportando...</p></section>';
var cssExport = "";

function exportProject(){

	var div = document.createElement("div");
	div.className = "spinner_2";
	div.innerHTML += '<div class="spinner"></div><p>Exportando...</p>';
	document.querySelector("body").appendChild(div);

	addClass(document.body, "fixed");

	zip = new JSZip();
	img = zip.folder("uploads");

	doc = document.implementation.createHTMLDocument("New Document");
	//fileName = "prueba.html";

	var headMeta = '<meta charset="UTF-8">';
	headMeta += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
	doc.head.innerHTML += headMeta;

	var style = doc.createElement("style");
	style.id = "exportCSS";
	//doc.head.appendChild(style);
	cssExport += "body{margin:0;}";
	//doc.getElementById("exportCSS").innerHTML += "body{margin:0;}";

	var x = document.createElement("LINK");
    x.setAttribute("rel", "stylesheet");
    x.setAttribute("type", "text/css");
    x.setAttribute("href", "style.css");
    doc.head.appendChild(x);

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

					if(CSS_768)
						setCSSWidthExport(CSS_768, id, "768");	

					if(CSS_1024)
						setCSSWidthExport(CSS_1024, id, "1024");				
					
					//document.getElementById("exportContainer").appendChild(padre); 
					body.appendChild(padre); 

					if(cssDOMExport[id]["general"] && cssDOMExport[id]["general"]["background-image"]){
						var bi = cssDOMExport[id]["general"]["background-image"];
						var url = bi.replace("url(", "").replace(")","").replace(new RegExp("'", 'g'),"");
						var aux = url.split('/');	
						var name = aux[aux.length-1];
						var imageE = document.createElement("img");
						imageE.src = url;
						var image = getBase64Image(imageE);
						img.file(name, image, {base64: true});
					}

					ordenPadres++;
					
				    if(hijos && hijos.length > 0)
				    	pintarHijosExport(hijos, padre);	
				}
			}	

			var html = doc.documentElement.outerHTML;

			zip.file("index.html", html);
			zip.file("style.css", cssExport);
			zip.generateAsync({type:"blob"})
				.then(function(content) {	
					saveAs(content, "VowabiProject.zip");
				});

			document.querySelector("body").removeChild(document.querySelector(".spinner_2"));
			removeClass(document.body, "fixed");

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

		if(elem["CSS_768"])
			setCSSWidthExport(elem["CSS_768"], idHijo, "768");	

		if(elem["CSS_1024"])
			setCSSWidthExport(elem["CSS_1024"], idHijo, "1024");					

		if(hijo.tagName == "IMG"){			
			var image = getBase64Image(hijo);
			var aux = hijo.src.split('/');	
			var name = aux[aux.length-1];
			img.file(name, image, {base64: true});
		}

		if(cssDOMExport[idHijo]["general"] && cssDOMExport[idHijo]["general"]["background-image"]){
			var bi = cssDOMExport[idHijo]["general"]["background-image"];
			var url = bi.replace("url(", "").replace(")","").replace(new RegExp("'", 'g'),"");
			var aux = url.split('/');	
			var name = aux[aux.length-1];
			var imageE = document.createElement("img");
			imageE.src = url;
			var image = getBase64Image(imageE);
			img.file(name, image, {base64: true});
		}
		padre.appendChild(hijo);		

		
		if(elem["hijos"] && elem["hijos"].length > 0)
	    	pintarHijosExport(elem["hijos"], hijo);			
	}
}

var cssReset = "html, body, div, span, applet, object, iframe,h1, h2, h3, h4, h5, h6, p, blockquote, pre,a, abbr, acronym, address, big, cite, code,del, dfn, em, img, ins, kbd, q, s, samp,small, strike, strong, sub, sup, tt, var,b, u, i, center,dl, dt, dd, ol, ul, li,fieldset, form, label, legend,table, caption, tbody, tfoot, thead, tr, th, td,article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video, main {margin: 0;padding: 0;border: 0;font: inherit;}";

function setCSSExport(CSS, id){

	cssDOMExport[id] = parseCSS(CSS);
	var css = '';
	css += cssReset;
	var v =  CSS.split('--');
	for(var i=1; i<v.length; i=i+2){

		if(v[i] == "general")
			css += '#'+id+'{';
		else if(v)
			css += '#'+id + v[i] + '{';

		css += v[i+1];
		css += '}';
		
	}

	//doc.getElementById("exportCSS").innerHTML += css;
	cssExport += css;
}



function setCSSWidthExport(CSS, id, width){

	if(width == "768")
		cssDOM768Export[id] = parseCSS(CSS);
	else if(width == "1024")
		cssDOM1024Export[id] = parseCSS(CSS);

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

	//doc.getElementById("exportCSS").innerHTML += css;
	cssExport += css;
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