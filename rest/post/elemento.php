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
header("Access-Control-Allow-Orgin: *");
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

if(isset($PARAMS['idgroup']))
  $idgroup = mysqli_real_escape_string( $link, $PARAMS['idgroup']);

if(isset($PARAMS['idproject']))
  $idproject = mysqli_real_escape_string( $link, $PARAMS['idproject']);

if(isset($PARAMS['order']))
  $order = mysqli_real_escape_string($link, $PARAMS['order']);

if(isset($_SERVER['PHP_AUTH_USER']) &&  isset($_SERVER['PHP_AUTH_PW'])){
    $email = $_SERVER['PHP_AUTH_USER'];
    $clave = $_SERVER['PHP_AUTH_PW'];
}else{
    $email = "";
    $clave = "";
}

//Comprobamos la sesion del usuario para hacer la consulta
if( !comprobarSesion($email,$clave) )
  $R = array('resultado' => 'error', 'descripcion' => 'Tiempo de sesión agotado.');
//Copiamos los elementos de un grupo al proyecto del usuario
else if($idproject != "" && $idgroup != "" && $order != ""){ 

  try{

    $mysql = 'select g.id as grupo, ge.idPadre, ge.Orden, e.*, h.HTML , c.CSS, j.JS from 
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


    //SELECCIONAMOS LOS ELEMENTOS DEL GRUPO
    if( strlen($mysql)>0 && $res = mysqli_query( $link, $mysql ) )
    {
        while( $row = mysqli_fetch_assoc( $res ) ){
          $R[] = $row;
          //row: grupo, id, Nombre, idPadre, idGrupo_elemento, Orden, HTML, CSS, JS

          //En caso de que sea el padre del contenedor
          if(!$row["idPadre"]){ 
            $orden = $order;
            $idPadre = "NULL";
            //Comprobamos si hay que hacer reajuste de orden
            //Si hay padres con orden mayor o igual al actual, les sumamos una unidad al orden
            $mysql_orden = 'select * from elemento_usu WHERE idPadre IS NULL AND Orden >='.$orden.';';
            $res_orden = mysqli_query( $link, $mysql_orden );
            if($res_orden){
              while( $row_orden = mysqli_fetch_assoc( $res_orden ) ){
                $mysql_updateOrden  = 'update elemento_usu set Orden = "'. ($row_orden["Orden"]+1) .'" where id = '. $row_orden["id"];
                mysqli_query( $link, $mysql_updateOrden);           
              }
            }

          }
          //En caso de que sea algun hijo
          else{
            $orden = $row["Orden"];
          }

          //COPIAMOS EL ELEMENTO EN ELEMENTO_USU        
          mysqli_query($link, 'BEGIN');

          $mysql_elemento  = 'insert into elemento_usu (idProyecto, Nombre, Orden, idPadre) values("';
          $mysql_elemento .=  $idproject . '","' . $row["Nombre"] . '","' . $orden .  '", ' . $idPadre . '); ';
          
          if( $res2 = mysqli_query( $link, $mysql_elemento ) ) {
          
            $id = mysqli_insert_id($link);
            if(!$row["idPadre"]){
              $idPadre = $id;
            }
            
            //COPIAMOS EL HTML, CSS Y JS DEL ELEMENTO
            $mysql_html  = 'insert into html_usu (idElemento_usu, HTML) values(';
            $mysql_html .=  $id . ', "' . mysqli_real_escape_string($link, $row["HTML"]) . '"); ';

            $mysql_js  = ' insert into js_usu (idElemento_usu, JS) values(';
            $mysql_js .=  $id . ', "' . $row["JS"] . '" ); ';

            $mysql_css  = 'insert into css_usu (idElemento_usu, CSS) values(';
            $mysql_css .=  $id . ', "' . mysqli_real_escape_string($link, $row["CSS"]) . '"); ';
           

            //echo $mysql_content;
            if( $res_html = mysqli_query( $link, $mysql_html ) && 
                $res_js = mysqli_query( $link, $mysql_js ) &&
                $res_css = mysqli_query( $link, $mysql_css )
            ) {
               $R = array('resultado' => 'ok');
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


  } catch(Exception $e){
    mysqli_query($link, "ROLLBACK");
  }

}
else if($PARAMS['idproject']=='' || $PARAMS['idgroup']=='')
{
  $RESPONSE_CODE = 401;
  $R = array('resultado' => 'error', 'descripcion' => 'Ha habido algún error añadiendo el grupo de elementos.');
}
//Aqui iria la creacion de un elemento individual
/*else
{

  

}*/

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