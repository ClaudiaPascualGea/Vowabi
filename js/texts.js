function initTexts(){
  prepareFonts();
}

function addTextBar(){

  var textBar = document.querySelector(".textBar");
  if(textBar)
    textBar.parentNode.removeChild(textBar);

  var element = this;

  var textBar = createTextToolbar(element);

  element.parentNode.insertBefore(textBar, element);

  var childPos = element.getBoundingClientRect();
  var parentPos = element.parentNode.getBoundingClientRect();
  var childOffset = {
      top: childPos.top - parentPos.top,
      left: childPos.left - parentPos.left
  }
  var top = childOffset.top - 30;
  textBar.style.top = top + "px";
  textBar.style.width = "100vw";

  var id = element.id;
  var idelement = id.replace("el-", "");

  //FontSize Listener
  var sel = document.querySelector(".textBar select[name='font-size']");
  sel.addEventListener("click", function(){
    var value = this.options[this.selectedIndex].value;
    var currentValue = getStyle(element, 'font-size').replace("px", "");
    if(value && idelement && currentValue!=value)
      changeCSS("font-size", value + "px", idelement);
  });

  //LineHeight Listener
  var sel = document.querySelector(".textBar select[name='line-height']");
  sel.addEventListener("click", function(){
    var value = this.options[this.selectedIndex].value;
    var currentValue = getStyle(element, 'line-height').replace("px", "");
    if(value && idelement && currentValue!=value)
      changeCSS("line-height", value + "px", idelement);
  });

  //Fonts Listener
  var sel = document.querySelector(".textBar select[name='fonts']");
  sel.addEventListener("click", function(){
    var value = this.options[this.selectedIndex].value;  
    if(value && idelement )
      selectFont(value, idelement);
  });

}

function removeTextBar(){
  var textBar = document.querySelector(".textBar");

  setTimeout(function(){
    var activeElement = document.activeElement.parentNode;
    var parent = activeElement.parentNode.className;
    if(textBar && textBar.parentNode && activeElement.className!="textBar" && parent!="textBar" ){
      textBar.parentNode.removeChild(textBar);
    }
  }, 100);

}

function createTextToolbar(element){

  var div = document.createElement("div");
  div.className = "textBar";

  var html = "";

  html += "   <button onclick='changeTextCss(this)' data-key='text-transform' data-value='uppercase' class='btn-small btn tooltip' data-title='Mayúsculas'>AA</button>";

  html += "   <button onclick='changeTextCss(this)' data-key='font-weight' data-value='bold' class='btn-small btn tooltip' data-title='Negrita'><i class='icon-bold-1'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='font-style' data-value='italic' class='btn-small btn tooltip' data-title='Cursiva'><i class='icon-italic'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-decoration' data-value='underline' class='btn-small btn tooltip' data-title='Subrayado'><i class='icon-underline'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-decoration' data-value='line-through' class='btn-small btn tooltip' data-title='Tachado'><i class='icon-strike'></i></button>";

  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-value='left' class='btn-small btn tooltip' data-title='Texto a la izquierda'><i class='icon-align-left'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-value='center' class='btn-small btn tooltip' data-title='Texto centrado'><i class='icon-align-center'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-value='right' class='btn-small btn tooltip' data-title='Texto a la derecha'><i class='icon-align-right'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-command='justifyFull' class='btn-small btn tooltip' data-title='Texto justificado'><i class='icon-align-justify'></i></button>";

  //Font size
  var fontSize = getStyle(element, 'font-size');
  var fs = fontSize.replace("px", "");
  html += "<i class='pre-select icon-fontsize'></i>";
  html += "<div class='styled-select tooltip' data-title='Tamaño de letra'>";
    html += " <select name='font-size'>";
    for (var i = 8; i <= 52; i++) {

      var cl = "";
      if (i == fs)
        cl = "selected"

      html += " <option "+cl+">" + i + "</option>";
    }
    html += " </select>";
  html += "</div>";

  //Line Height
  var fontSize = getStyle(element, 'line-height');
  var fs = fontSize.replace("px", "");
  html += "<i class='pre-select icon-text-height'></i>";
  html += "<div class='styled-select tooltip' data-title='Interlineado'>";
    html += " <select name='line-height'>";
    for (var i = 8; i <= 80; i++) {

      var cl = "";
      if (i == fs)
        cl = "selected"

      html += " <option "+cl+">" + i + "</option>";
    }
    html += " </select>";
  html += "</div>";

  //Fonts
  var id = element.id;
  var currentValue = defaultFont;
  if(cssDOM[id] && cssDOM[id]["general"] && cssDOM[id]["general"]["font-family"] )
    currentValue = cssDOM[id]["general"]["font-family"];
  if(cssDOM[id] && cssDOM[id]["general"] && cssDOM[id]["general"]["font-weight"] )
    currentValue = currentValue + ":" + cssDOM[id]["general"]["font-weight"];

  html += "<i class='pre-select icon-font'></i>";
  html += "<div class='styled-select big'>";
    html += " <select name='fonts'>";
    
      html += listFonts(currentValue);

    html += " </select>";
  html += "</div>";



  div.innerHTML = html;
 
  return div;
}

function changeTextCss(elem){
   
    var selection = getSelectedContent();
    var anchor_node = selection.anchorNode; 

    if(anchor_node){
      var element = anchor_node.parentNode;

      if(element.id == "")
        element = element.parentNode;

      var idelement = element.id.replace("el-","");

      var key = elem.getAttribute("data-key");
      var value = elem.getAttribute("data-value");
      
      if(idelement)
        changeCSS(key, value, idelement);
    }
}

function getSelectedContent(){
  var selection
  if (window.getSelection)
    selection = window.getSelection();
  else if (document.selection && document.selection.type != "Control")
    selection = document.selection;

  return selection;
}

function getStyle(el,styleProp) {
  var camelize = function (str) {
    return str.replace(/\-(\w)/g, function(str, letter){
      return letter.toUpperCase();
    });
  };

  if (el.currentStyle) {
    return el.currentStyle[camelize(styleProp)];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(el,null)
                               .getPropertyValue(styleProp);
  } else {
    return el.style[camelize(styleProp)]; 
  }
}

function prepareFonts(){

  var obj = document.getElementsByTagName('head')[0];

  for(var i=0; i<fonts.length; i++){
    var link = settings.api + fonts[i];
    
    var x = document.createElement("LINK");
    x.setAttribute("rel", "stylesheet");
    x.setAttribute("type", "text/css");
    x.setAttribute("href", link);
    document.head.appendChild(x);
  }

}

function listFonts(currentValue){
  var html = '';
  var l = fonts.length;
  var r, s = '';

  currentValue = currentValue.replace(":bold", ":400");
  if(currentValue.indexOf(":") == -1)
    currentValue += ":400";

  for(var i=0; i<l; i++){
      r = fonts[i].replace(/[\+|:]/g, ' ');
      var t = fonts[i].split(':');
      s = {
        'font-family': t[0].replace(/[\+|:]/g, ' ') , 
        'font-weight': (t[1] || 400)
      };
      
      var cl = "";

      // if(currentValue.indexOf(":") != -1)
      var junto = s['font-family'] + ":" + s['font-weight'];
      // else
      //   var junto = s['font-family'];

      if(currentValue == junto )
        cl = "selected";

      html += '<option '+cl+' value="'+ fonts[i] +'" style="font-family: '+s['font-family'] +'; font-weight: '+s['font-weight'] +'">'+ r +'</option>';
  }
  return html;
}

function selectFont(value, idelement){
 
  var t = value.split(':');
  s = {
      'font-family': t[0].replace(/[\+|:]/g, ' ') , 
      'font-weight': (t[1] || 400)
  };

  changeCSS("font-family", s['font-family'], idelement);
  changeCSS("font-weight", s['font-weight'], idelement);


}

//Global variables
var settings = {
    style: 'font-select',
    api: 'https://fonts.googleapis.com/css?family='
};
var defaultFont = "Lato";
var fonts = [
      "Aclonica",
      "Allan",
      "Annie+Use+Your+Telescope",
      "Anonymous+Pro",
      "Allerta+Stencil",
      "Allerta",
      "Amaranth",
      "Anton",
      "Architects+Daughter",
      "Arimo",
      "Artifika",
      "Arvo",
      "Asset",
      "Astloch",
      "Bangers",
      "Bentham",
      "Bevan",
      "Bigshot+One",
      "Bowlby+One",
      "Bowlby+One+SC",
      "Brawler",
      "Buda:300",
      "Cabin",
      "Calligraffitti",
      "Candal",
      "Cantarell",
      "Cardo",
      "Carter One",
      "Caudex",
      "Cedarville+Cursive",
      "Cherry+Cream+Soda",
      "Chewy",
      "Coda",
      "Coming+Soon",
      "Copse",
      "Corben:700",
      "Cousine",
      "Covered+By+Your+Grace",
      "Crafty+Girls",
      "Crimson+Text",
      "Crushed",
      "Cuprum",
      "Damion",
      "Dancing+Script",
      "Dawning+of+a+New+Day",
      "Didact+Gothic",
      "Droid+Sans",
      "Droid+Sans+Mono",
      "Droid+Serif",
      "EB+Garamond",
      "Expletus+Sans",
      "Fontdiner+Swanky",
      "Forum",
      "Francois+One",
      "Geo",
      "Give+You+Glory",
      "Goblin+One",
      "Goudy+Bookletter+1911",
      "Gravitas+One",
      "Gruppo",
      "Hammersmith+One",
      "Holtwood+One+SC",
      "Homemade+Apple",
      "Inconsolata",
      "Indie+Flower",
      "IM+Fell+DW+Pica",
      "IM+Fell+DW+Pica+SC",
      "IM+Fell+Double+Pica",
      "IM+Fell+Double+Pica+SC",
      "IM+Fell+English",
      "IM+Fell+English+SC",
      "IM+Fell+French+Canon",
      "IM+Fell+French+Canon+SC",
      "IM+Fell+Great+Primer",
      "IM+Fell+Great+Primer+SC",
      "Irish+Grover",
      "Irish+Growler",
      "Istok+Web",
      "Josefin+Sans",
      "Josefin+Slab",
      "Judson",
      "Jura",
      "Jura:500",
      "Jura:600",
      "Just+Another+Hand",
      "Just+Me+Again+Down+Here",
      "Kameron",
      "Kenia",
      "Kranky",
      "Kreon",
      "Kristi",
      "La+Belle+Aurore",
      "Lato:100",
      "Lato:100italic",
      "Lato:300", 
      "Lato",
      "Lato:bold",  
      "Lato:900",
      "League+Script",
      "Lekton",  
      "Limelight",  
      "Lobster",
      "Lobster Two",
      "Lora",
      "Love+Ya+Like+A+Sister",
      "Loved+by+the+King",
      "Luckiest+Guy",
      "Maiden+Orange",
      "Mako",
      "Maven+Pro",
      "Maven+Pro:500",
      "Maven+Pro:700",
      "Maven+Pro:900",
      "Meddon",
      "MedievalSharp",
      "Megrim",
      "Merriweather",
      "Metrophobic",
      "Michroma",
      "Miltonian Tattoo",
      "Miltonian",
      "Modern Antiqua",
      "Monofett",
      "Molengo",
      "Mountains of Christmas",
      "Muli:300", 
      "Muli", 
      "Neucha",
      "Neuton",
      "News+Cycle",
      "Nixie+One",
      "Nobile",
      "Nova+Cut",
      "Nova+Flat",
      "Nova+Mono",
      "Nova+Oval",
      "Nova+Round",
      "Nova+Script",
      "Nova+Slim",
      "Nova+Square",
      "Nunito:light",
      "Nunito",
      "OFL+Sorts+Mill+Goudy+TT",
      "Old+Standard+TT",
      "Open+Sans:300",
      "Open+Sans",
      "Open+Sans:600",
      "Open+Sans:800",
      "Open+Sans+Condensed:300",
      "Orbitron",
      "Orbitron:500",
      "Orbitron:700",
      "Orbitron:900",
      "Oswald",
      "Over+the+Rainbow",
      "Reenie+Beanie",
      "Pacifico",
      "Patrick+Hand",
      "Paytone+One", 
      "Permanent+Marker",
      "Philosopher",
      "Play",
      "Playfair+Display",
      "Podkova",
      "PT+Sans",
      "PT+Sans+Narrow",
      "PT+Sans+Narrow:regular,bold",
      "PT+Serif",
      "PT+Serif Caption",
      "Puritan",
      "Quattrocento",
      "Quattrocento+Sans",
      "Radley",
      "Raleway",
      "Raleway:100",
      "Redressed",
      "Rock+Salt",
      "Rokkitt",
      "Roboto",
      "Ruslan+Display",
      "Schoolbell",
      "Shadows+Into+Light",
      "Shanti",
      "Sigmar+One",
      "Six+Caps",
      "Slackey",
      "Smythe",
      "Sniglet:800",
      "Special+Elite",
      "Stardos+Stencil",
      "Sue+Ellen+Francisco",
      "Sunshiney",
      "Swanky+and+Moo+Moo",
      "Syncopate",
      "Tangerine",
      "Tenor+Sans",
      "Terminal+Dosis+Light",
      "The+Girl+Next+Door",
      "Tinos",
      "Ubuntu",
      "Ultra",
      "Unkempt",
      "UnifrakturCook:bold",
      "UnifrakturMaguntia",
      "Varela",
      "Varela Round",
      "Vibur",
      "Vollkorn",
      "VT323",
      "Waiting+for+the+Sunrise",
      "Wallpoet",
      "Walter+Turncoat",
      "Wire+One",
      "Yanone+Kaffeesatz",
      "Yanone+Kaffeesatz:300",
      "Yanone+Kaffeesatz:400",
      "Yanone+Kaffeesatz:700",
      "Yeseva+One",
      "Zeyada"];
