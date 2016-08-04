function initTexts(){
  
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
  var top = childOffset.top - 25;
  textBar.style.top = top + "px";

  var id = element.id;
  var idelement = id.replace("el-", "");

  //FontSize Listener
  var sel = document.querySelector(".textBar select[name='font-size']");
  sel.addEventListener("click", function(){
    var value = this.options[this.selectedIndex].value;
    var currentValue = getStyle(element, 'font-size').replace("px", "");
    console.log(currentValue + " " + idelement + " " + value);
    if(value && idelement && currentValue!=value)
      changeCSS("font-size", value + "px", idelement);
  });

}

function removeTextBar(){
  var textBar = document.querySelector(".textBar");

  setTimeout(function(){
    var activeElement = document.activeElement.parentNode;
    if(textBar && textBar.parentNode && (activeElement.className!="textBar") ){
      textBar.parentNode.removeChild(textBar);
    }
  }, 100);


}

function createTextToolbar(element){

  var div = document.createElement("div");
  div.className = "textBar";

  var html = "";

  html += "   <button onclick='changeTextCss(this)' data-key='font-weight' data-value='bold' class='btn-small btn'><i class='icon-bold-1'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='font-style' data-value='italic' class='btn-small btn'><i class='icon-italic'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-decoration' data-value='underline' class='btn-small btn'><i class='icon-underline'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-decoration' data-value='line-through' class='btn-small btn'><i class='icon-strike'></i></button>";

  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-value='left' class='btn-small btn'><i class='icon-align-left'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-value='center' class='btn-small btn'><i class='icon-align-center'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-value='right' class='btn-small btn'><i class='icon-align-right'></i></button>";
  html += "   <button onclick='changeTextCss(this)' data-key='text-align' data-command='justifyFull' class='btn-small btn'><i class='icon-align-justify'></i></button>";

  //Font size
  var fontSize = getStyle(element, 'font-size');
  var fs = fontSize.replace("px", "");
  html += " <select class='styled-select btn-small btn' name='font-size'>";
  for (var i = 8; i <= 52; i++) {

    var cl = "";
    if (i == fs)
      cl = "selected"

    html += " <option "+cl+">" + i + "</option>";
  }
  html += " </select>";

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

