<?php
// FICHERO: rest/post/elemento.php

$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER POST. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'POST') exit();
// PETICIONES POST ADMITIDAS:
//   rest/elemento/
//  

// =================================================================================
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
   require_once('../configbd.php');
// =================================================================================
// =================================================================================

// =================================================================================
// CONFIGURACION DE SALIDA JSON
// =================================================================================
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = []; // Almacenará el resultado.
$RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK
// =================================================================================
// =================================================================================
// Se supone que si llega aquí es porque todo ha ido bien y tenemos los datos correctos:
$PARAMS      = $_POST;

$idgroup = "";
$idproject = "";
$order = "";
$idelement = "";
$direction = "";
$delete = "";
$html = "";
$css = "";
$image = "";
$imageName = "";

if(isset($PARAMS['idgroup']))
  $idgroup = mysqli_real_escape_string( $link, $PARAMS['idgroup']);

if(isset($PARAMS['idproject']))
  $idproject = mysqli_real_escape_string( $link, $PARAMS['idproject']);

if(isset($PARAMS['order']))
  $order = mysqli_real_escape_string($link, $PARAMS['order']);

if(isset($PARAMS['idelement']))
  $idelement = mysqli_real_escape_string($link, $PARAMS['idelement']);

if(isset($PARAMS['direction']))
  $direction = mysqli_real_escape_string($link, $PARAMS['direction']);

if(isset($PARAMS['delete']))
  $delete = mysqli_real_escape_string($link, $PARAMS['delete']);

if(isset($PARAMS['html']))
  $html = mysqli_real_escape_string($link, $PARAMS['html']);

if(isset($PARAMS['css']))
  $css = mysqli_real_escape_string($link, $PARAMS['css']);

if($_FILES && isset($_FILES['file']))
  $image = $_FILES['file'];

if(isset($PARAMS['fileName']))
  $imageName = mysqli_real_escape_string( $link, $PARAMS['fileName']);

if(isset($_SERVER['PHP_AUTH_USER']) &&  isset($_SERVER['PHP_AUTH_PW'])){
    $email = $_SERVER['PHP_AUTH_USER'];
    $clave = $_SERVER['PHP_AUTH_PW'];
}else{
    $email = "";
    $clave = "";
}

//Comprobamos la sesion del usuario para hacer la consulta
if( !comprobarSesion($email,$clave) ){
  $R = array('resultado' => 'error', 'descripcion' => 'Tiempo de sesión agotado.', 'code'=>408);

}
//Copiamos los elementos de un grupo al proyecto del usuario
else if($idproject != "" && $idgroup && $idgroup != "" && $order != ""){ 

  try{

    $mysql = 'select g.id as grupo, ge.idPadre, ge.Orden, e.*, h.HTML , c.CSS, c.CSS_768, c.CSS_1024, j.JS from 
                  elemento e 
                           LEFT JOIN html h
                           ON h.idElemento=e.id
                           LEFT JOIN css c
                           ON c.idElemento=e.id
                           LEFT JOIN js j
                           ON j.idElemento=e.id
                JOIN grupo g ON g.id= '. mysqli_real_escape_string($link,$PARAMS['idgroup']) . '
                JOIN grupo_elemento ge ON ge.idGrupo=g.id AND ge.idElemento=e.id
              order by ge.idPadre, ge.Orden;';

    //Primero hacemos la consulta y formateamos el resultado
    if( strlen($mysql)>0 && count($R)==0 && $res = mysqli_query( $link, $mysql ) )
    {
        while( $row = mysqli_fetch_assoc( $res ) )
          $R[] = $row;
        mysqli_free_result( $res );
    }

    $elementos = array();
    $ids = array();
    $cont = 0;

    foreach ($R as $elemento) {
      $hijos = getHijos($elemento, $R);
      if(count($hijos)>0 && !$elemento["idPadre"]){
        $elementos[$cont] = $elemento;
        $elementos[$cont]["hijos"] = $hijos;
        $cont++;
      }
    }

    $resultado = array();
    $cont = 0;

    //Recorremos los elementos y los insertamos como elementos_usu
    foreach ($elementos as $elemento) {
      
      resetOrder($idproject, $order, $link);

      //Insertamos el padre
      $idPadre = "NULL";
      $mysql_elemento  = 'insert into elemento_usu (idProyecto, Nombre, Orden, idPadre, ContentEditable) values("';
      $mysql_elemento .=  $idproject . '","' . $elemento["Nombre"] . '","' . $order .  '", ' . $idPadre . ' , '. $elemento["ContentEditable"] . '); ';
      
      if( $res2 = mysqli_query( $link, $mysql_elemento ) ) {

        $id = mysqli_insert_id($link);
        $resultado[0] = insertContent($id, $elemento, $link, $id, $order);            

        if(isset($elemento["hijos"]) && count($elemento["hijos"] > 0))
          $resultado[0]["hijos"] = pintarHijos($elemento["hijos"], $id, $idproject, $link);
      }
    }

    $R = array('resultado' => 'ok', 'elements' => $resultado);


  } catch(Exception $e){
    mysqli_query($link, "ROLLBACK");
  }

}
//Cambia el orden entre dos elementos
else if($idproject != "" && $idelement != "" && $order != "" && $direction != ""){ 

   try{

      if($direction == 1) //Up
        $orden = $order + 1;
      else if($direction == 0) //down
        $orden = $order - 1;

      mysqli_query($link, 'BEGIN');

      $mysql_update  = 'update elemento_usu set Orden = "'. ($order) .'" where id='. $idelement;
      $res = mysqli_query( $link, $mysql_update);  

      $mysql_orden = 'select * from elemento_usu WHERE idPadre IS NULL AND idProyecto = '.$idproject.' AND id!='.$idelement.' AND Orden ='.$order.';';
      $res_orden = mysqli_query( $link, $mysql_orden );

      if($res && $res_orden){
        while( $row_orden = mysqli_fetch_assoc( $res_orden ) ){
          $mysql_updateOrden  = 'update elemento_usu set Orden = "'. $orden .'" where id = '. $row_orden["id"];
          $res2 = mysqli_query( $link, $mysql_updateOrden);     
          if(!$res2){
            $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido modificar el orden del otro elemento');
            mysqli_query($link, "ROLLBACK");
          }
        }
        $R = array('resultado' => 'ok');
        mysqli_query($link, "COMMIT");
      }else{
         $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido modificar el orden');
         mysqli_query($link, "ROLLBACK");
      }

      mysqli_query($link, "COMMIT");
    } catch(Exception $e){
      mysqli_query($link, "ROLLBACK");
    }

}
//Elimina el elemento indicado
else if($idelement!='' && $delete!='' && $idproject!='' && $order!=''){
    try{
        // ******** INICIO DE TRANSACCION **********
        mysqli_query($link, 'BEGIN');
        $mysql  = 'delete from elemento_usu where id='. $idelement;

        if( $res = mysqli_query( $link, $mysql ) )
        {
            //Reajustamos el orden del resto de elementos padre, empezando por el 0
            $mysql_orden = 'select * from elemento_usu WHERE idPadre IS NULL AND Orden >'.$order.' AND idProyecto = '.$idproject.';';
            $res_orden = mysqli_query( $link, $mysql_orden );
            if($res_orden){
                while( $row_orden = mysqli_fetch_assoc( $res_orden ) ){
                    $orden = (int) $row_orden["Orden"] - 1;
                    $mysql_updateOrden  = 'update elemento_usu set Orden = "'. $orden .'" where id = '. $row_orden["id"];
                    if(!$res_updateOrden = mysqli_query( $link, $mysql_updateOrden) )
                      $R = array('resultado' => 'error');
                }
            }
            
            $R = array('resultado' => 'ok');
        }
        else
        {
          $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido eliminar el elemento');
        }
        // ******** FIN DE TRANSACCION **********
        mysqli_query($link, "COMMIT");

    } catch(Exception $e){
        // Se ha producido un error, se cancela la transacción.
        mysqli_query($link, "ROLLBACK");
    }
}
else if($idelement!='' && $html!=''){
    try{
        // ******** INICIO DE TRANSACCION **********
        mysqli_query($link, 'BEGIN');
        $mysql  = 'update html_usu SET HTML="'. $html .'" where idElemento_usu='. $idelement;

        if( $res = mysqli_query( $link, $mysql ) )
        {      
            $R = array('resultado' => 'ok');
        }
        else
        {
          print_r($res);
          print_r($link);
          print_r($mysql);           

          $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido modificar el HTML del elemento');
        }
        // ******** FIN DE TRANSACCION **********
        mysqli_query($link, "COMMIT");

    } catch(Exception $e){
        // Se ha producido un error, se cancela la transacción.
        mysqli_query($link, "ROLLBACK");
    }
}
else if($idelement!='' && $css!=''){
    try{
        // ******** INICIO DE TRANSACCION **********
        mysqli_query($link, 'BEGIN');
        $mysql  = 'update css_usu SET CSS="'. $css .'" where idElemento_usu='. $idelement;

        if( $res = mysqli_query( $link, $mysql ) )
        {      
            $R = array('resultado' => 'ok');
        }
        else
        {        
          $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido modificar el CSS del elemento');
        }
        // ******** FIN DE TRANSACCION **********
        mysqli_query($link, "COMMIT");

    } catch(Exception $e){
        // Se ha producido un error, se cancela la transacción.
        mysqli_query($link, "ROLLBACK");
    }
}
//Sube un fichero y lo asocia al elemento
else if($idelement!="" && $image!="" && $imageName!=""){

  if (is_dir($uploaddir) && is_writable($uploaddir) && $image['tmp_name']) {

      $ext = pathinfo($imageName, PATHINFO_EXTENSION);
      $name = md5(rand(0,100)."VOWABI"). time() .".".$ext;

      $uploadfile = $uploaddir . $name;

      if(move_uploaded_file($image['tmp_name'], $uploadfile )){       
          $src_cms = $uploaddirCMS . $name;     
          $src = $uploaddirWeb . $name;     

           try{
              // ******** INICIO DE TRANSACCION **********
              mysqli_query($link, 'BEGIN');
              $mysql  = 'insert into imagen(Nombre,Fichero, FicheroCMS) values("';
              $mysql .= $imageName . '","' . $src . '","' . $src_cms . '" )';

              if( $res = mysqli_query( $link, $mysql ) )
              {
                $id = mysqli_insert_id($link);

                $mysql  = 'update elemento_usu set idImagen = "'. $id .'" where id = '. $idelement;

                if( $res = mysqli_query( $link, $mysql ) )
                  $R = array('resultado' => 'ok', 'img' => $src);
                else
                  $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido asignar la imagen al elemento');
               
              }
              else
              {
                $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido crear la Imagen');
              }
              // ******** FIN DE TRANSACCION **********
              mysqli_query($link, "COMMIT");

            } catch(Exception $e){
              // Se ha producido un error, se cancela la transacción.
              mysqli_query($link, "ROLLBACK");
            }

          $R = array('resultado' => 'ok', 'imagen' => $src);          
      }else{
         $R = array('resultado' => 'error', 'descripcion' => 'Error moviendo la imagen');          
      }

  }else{
    $R = array('resultado' => 'error', 'descripcion' => 'Carpeta innacesible.');  
  }

}
else if($PARAMS['idproject']=='' || $PARAMS['idgroup']=='')
{
  $RESPONSE_CODE = 401;
  $R = array('resultado' => 'error', 'descripcion' => 'Parámetros incorrectos.');
}

//Aqui iria la creacion de un elemento individual
/*else
{

  

}*/

// =================================================================================
// FUNCIONES
// =================================================================================
function getHijos($el, $R){
  $hijos = array();
  $cont = 0;
  foreach ($R as $element) {    
    if($element["idPadre"]==$el["id"]){
      $hijos[$cont] = $element;
      $hijos2 = getHijos($element, $R);
      if(count($hijos2)>0)
        $hijos[$cont]["hijos"] = $hijos2;
      $cont++;
    }
  }
  return $hijos;
}

//Comprobamos si hay que hacer reajuste de orden, Si hay padres con orden mayor o igual al actual, les sumamos una unidad al orden
function resetOrder($idproject, $order, $link){
  $mysql_orden = 'select * from elemento_usu WHERE idPadre IS NULL AND idProyecto = '.$idproject.' AND Orden >='.$order.';';
      $res_orden = mysqli_query( $link, $mysql_orden );
      if($res_orden){
        while( $row_orden = mysqli_fetch_assoc( $res_orden ) ){
          $mysql_updateOrden  = 'update elemento_usu set Orden = "'. ($row_orden["Orden"]+1) .'" where id = '. $row_orden["id"];
          mysqli_query( $link, $mysql_updateOrden);      
          if(!$mysql_updateOrden){
            $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido modificar el orden del otro elemento');
            mysqli_query($link, "ROLLBACK");
          }     
        }
      }
}

function pintarHijos($elementos, $idPadre, $idproject, $link){
  $resultado = array();
  $cont = 0;

  foreach ($elementos as $elemento) {

    $mysql_elemento  = 'insert into elemento_usu (idProyecto, Nombre, Orden, idPadre, ContentEditable) values("';
    $mysql_elemento .=  $idproject . '","' . $elemento["Nombre"] . '","' . $elemento["Orden"] .  '", ' . $idPadre . ' , '. $elemento["ContentEditable"] . '); ';
    
    if( $res2 = mysqli_query( $link, $mysql_elemento ) ) {

      $id = mysqli_insert_id($link);
      $resultado[$cont] = insertContent($id, $elemento, $link, $idPadre, $elemento["Orden"]);      

      if(isset($elemento["hijos"]) && count($elemento["hijos"] > 0))
        $resultado[$cont]["hijos"] = pintarHijos($elemento["hijos"], $id, $idproject, $link);

      $cont++;      
    }
  }

  return $resultado;
}

function insertContent($id, $elemento, $link, $idpadre, $order){
  //COPIAMOS EL HTML, CSS Y JS DEL ELEMENTO
  $mysql_html  = 'insert into html_usu (idElemento_usu, HTML) values(';
  $mysql_html .=  $id . ', "' . mysqli_real_escape_string($link, $elemento["HTML"]) . '"); ';

  $mysql_js  = ' insert into js_usu (idElemento_usu, JS) values(';
  $mysql_js .=  $id . ', "' . $elemento["JS"] . '" ); ';

  $mysql_css  = 'insert into css_usu (idElemento_usu, CSS, CSS_768, CSS_1024) values(';
  $mysql_css .=  $id . ', "' . mysqli_real_escape_string($link, $elemento["CSS"]) . '", "' . mysqli_real_escape_string($link, $elemento["CSS_768"]) . '", "' . mysqli_real_escape_string($link, $elemento["CSS_1024"]) . '"); ';
 

  //echo $mysql_content;
  if( $res_html = mysqli_query( $link, $mysql_html ) && 
      $res_js = mysqli_query( $link, $mysql_js ) &&
      $res_css = mysqli_query( $link, $mysql_css )
  ) {
    return array("id"=>$id, "HTML"=>$elemento["HTML"], "idPadre"=>$idpadre, "CSS"=>$elemento["CSS"], "CSS_768"=>$elemento["CSS_768"], "CSS_1024"=> $elemento["CSS_1024"], "JS"=>$elemento["JS"], "order"=>$order, "ContentEditable"=>$elemento["ContentEditable"]);
  }

}


// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
mysqli_close($link);
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
try {
    // Here: everything went ok. So before returning JSON, you can setup HTTP status code too
    http_response_code($RESPONSE_CODE);
    print json_encode($R);
}
catch (SomeException $ex) {
    $rtn = array('resultado' => 'error', 'descripción' => "Se ha producido un error");
    http_response_code(500);
    print json_encode($rtn);
}
// =================================================================================
?>


<?php 
/*OLD*/
/*



    //SELECCIONAMOS LOS ELEMENTOS DEL GRUPO
    if( strlen($mysql)>0 && $res = mysqli_query( $link, $mysql ) )
    {
        $elements = array();
        $cont = 0;
        $idAnterior = "";
        $idsInsertados = array();

        while( $row = mysqli_fetch_assoc( $res ) ){
          $R[] = $row;
          //row: grupo, id, Nombre, idPadre, idGrupo_elemento, Orden, HTML, CSS, JS

          //En caso de que sea el padre del contenedor
          if(!$row["idPadre"]){ 
            $orden = $order;
            $idPadre = "NULL";

            //Comprobamos si hay que hacer reajuste de orden
            //Si hay padres con orden mayor o igual al actual, les sumamos una unidad al orden
            $mysql_orden = 'select * from elemento_usu WHERE idPadre IS NULL AND idProyecto = '.$idproject.' AND Orden >='.$orden.';';
            $res_orden = mysqli_query( $link, $mysql_orden );
            if($res_orden){
              while( $row_orden = mysqli_fetch_assoc( $res_orden ) ){
                $mysql_updateOrden  = 'update elemento_usu set Orden = "'. ($row_orden["Orden"]+1) .'" where id = '. $row_orden["id"];
                mysqli_query( $link, $mysql_updateOrden);      
                if(!$mysql_updateOrden){
                  $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido modificar el orden del otro elemento');
                  mysqli_query($link, "ROLLBACK");
                }     
              }
            }

          }
          //En caso de que sea algun hijo
          else{
            $orden = $row["Orden"];                         
            $idPadre = $idsInsertados[$row["idPadre"]];
          }



          //COPIAMOS EL ELEMENTO EN ELEMENTO_USU        
          mysqli_query($link, 'BEGIN');

          $mysql_elemento  = 'insert into elemento_usu (idProyecto, Nombre, Orden, idPadre, ContentEditable) values("';
          $mysql_elemento .=  $idproject . '","' . $row["Nombre"] . '","' . $orden .  '", ' . $idPadre . ' , '. $row["ContentEditable"] . '); ';
          
          if( $res2 = mysqli_query( $link, $mysql_elemento ) ) {
          
            $id = mysqli_insert_id($link);

            if(!$row["idPadre"]){
              $idPadre = $id;
            }

            $idsInsertados[$row["id"]] = $id;
            
                        
            //COPIAMOS EL HTML, CSS Y JS DEL ELEMENTO
            $mysql_html  = 'insert into html_usu (idElemento_usu, HTML) values(';
            $mysql_html .=  $id . ', "' . mysqli_real_escape_string($link, $row["HTML"]) . '"); ';

            $mysql_js  = ' insert into js_usu (idElemento_usu, JS) values(';
            $mysql_js .=  $id . ', "' . $row["JS"] . '" ); ';

            $mysql_css  = 'insert into css_usu (idElemento_usu, CSS, CSS_768, CSS_1024) values(';
            $mysql_css .=  $id . ', "' . mysqli_real_escape_string($link, $row["CSS"]) . '", "' . mysqli_real_escape_string($link, $row["CSS_768"]) . '", "' . mysqli_real_escape_string($link, $row["CSS_1024"]) . '"); ';
           

            //echo $mysql_content;
            if( $res_html = mysqli_query( $link, $mysql_html ) && 
                $res_js = mysqli_query( $link, $mysql_js ) &&
                $res_css = mysqli_query( $link, $mysql_css )
            ) {
              $elements[$cont] = array("idElemento"=>$id, "HTML"=>$row["HTML"], "idPadre"=>$idPadre, "CSS"=>$row["CSS"], "CSS_768"=>$row["CSS_768"], "CSS_1024"=> $row["CSS_1024"], "JS"=>$row["JS"], "order"=>$orden, "ContentEditable"=>$row["ContentEditable"]);
              $cont++;
              $R = array('resultado' => 'ok', "elements"=>$elements);
            }else{
              print_r($mysql_elemento);
              print_r($mysql_css);
              print_r($mysql_html);
              $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido copiar el contenido del elemento.');
              mysqli_query($link, "ROLLBACK");
            }

          }else{

            $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido crear el elemento');
            mysqli_query($link, "ROLLBACK");
          }
          
          mysqli_query($link, "COMMIT");
        }
        mysqli_free_result( $res );
    }
*/
?>