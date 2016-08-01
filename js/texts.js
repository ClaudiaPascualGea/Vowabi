function initTexts(){
  
}

function addTextBar(){

  var element = this;
  var textBar = createTextToolbar();
  element.parentNode.insertBefore(textBar, element);

  var childPos = element.getBoundingClientRect();
  var parentPos = element.parentNode.getBoundingClientRect();
  var childOffset = {
      top: childPos.top - parentPos.top,
      left: childPos.left - parentPos.left
  }
  var top = childOffset.top - 25;
  textBar.style.top = top + "px";

}

function removeTextBar(){
  var textBar = document.querySelector(".textBar");
  var element = this;
  var idelement = element.id;


  setTimeout(function(){
    var selection = getSelectedContent();
    var anchor_node = selection.anchorNode; 
    var parent = anchor_node.parentNode;
    var idelement2 = parent.id;

    var activeElement = document.activeElement.parentNode;
    console.log(activeElement);
    console.log(textBar + " - " + idelement + " - " + idelement2 + " - " + activeElement.className);

    if(textBar && (!idelement2 || idelement2!=idelement || activeElement.className!="textBar") ){
      textBar.parentNode.removeChild(textBar);
    }
  }, 100);


}

function createTextToolbar(){

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

  div.innerHTML = html;
 
  return div;
}

function changeTextCss(elem){
   
    var selection = getSelectedContent();
    var anchor_node = selection.anchorNode; 

    if(anchor_node){
      var element = anchor_node.parentNode;
      var idelement = element.id.replace("el-","");

      var key = elem.getAttribute("data-key");
      var value = elem.getAttribute("data-value");
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