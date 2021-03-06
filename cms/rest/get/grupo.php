<?php
// FICHERO: rest/get/grupo.php

$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER GET. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'GET') exit();
// PETICIONES GET ADMITIDAS:
//   rest/grupo/{ID_grupo} -> devuelve toda la información del grupo
//   rest/grupo/?all={BOOL} -> devuelve todos los grupos

// =================================================================================
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
   require_once('../configbd.php');
// =================================================================================
// =================================================================================

$RECURSO = array();
$RECURSO = explode("/", $_GET['prm']);
$PARAMS = array_slice($_GET, 1, count($_GET) - 1,true);
$ID = $RECURSO[0];
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
$mysql='';
// =================================================================================
if(is_numeric($ID))
{ // Se devuelve el grupo por ID

  $mysql = 'select g.*, i.FicheroCMS as Fichero, i.Nombre as Filename FROM grupo g
               LEFT JOIN imagen i ON g.idImagen=i.id
            WHERE g.id = '.$ID.';';

  if($res = mysqli_query( $link, $mysql ) ){
      while( $row = mysqli_fetch_assoc( $res ) )
        $R[] = $row;
    mysqli_free_result( $res );
  }else 
    $R[] = $res;

  if($R[0]){
    $mysql_elementos = 'select e.*, ge.idPadre, ge.Orden, h.HTML, c.CSS, c.CSS_768, c.CSS_1024, j.JS
              FROM elemento e
                JOIN grupo_elemento ge ON ge.idElemento=e.id
                JOIN grupo g ON g.id=ge.idGrupo
                LEFT JOIN html h ON h.idElemento=e.id
                LEFT JOIN css c ON c.idElemento=e.id
                LEFT JOIN js j ON j.idElemento=e.id
              WHERE g.id='.$ID.'
            ORDER BY ge.idPadre, ge.Orden;';

    if($resEl = mysqli_query( $link, $mysql_elementos ) ){
      while( $row = mysqli_fetch_assoc( $resEl ) )
        $R[0]["elements"][] = $row;
      mysqli_free_result( $resEl );
    }
  } 

   
}

else
{ // Se utilizan parámetros
  if( isset($PARAMS['all']) )
  { // se piden todos los grupos que tienen elementos
      $mysql = 'select g.*,i.FicheroCMS as Fichero, i.Nombre as Filename FROM grupo g
                  LEFT JOIN imagen i ON g.idImagen=i.id
                GROUP BY g.id
                ORDER BY g.Orden;';
      if( strlen($mysql)>0 && count($R)==0 && $res = mysqli_query( $link, $mysql ) )
      {
      if( substr($mysql, 0, 6) == "select" )
      {
        while( $row = mysqli_fetch_assoc( $res ) )
          $R[] = $row;
        mysqli_free_result( $res );
      }
      else $R[] = $res;
      }
  }
  else
  {
    $RESPONSE_CODE = 400; // Los parámetros no son correctos
    $R = array("id", "2", "error", "Los parámetros no son correctos");
  }
}

// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
mysqli_close($link);
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
if(strlen($mysql)<1)
{
  $R = array("resultado" => "error", "codigo", "2", "descripcion", "Los parámetros no son correctos.");
  $RESPONSE_CODE = 500;
}

http_response_code($RESPONSE_CODE);
print json_encode($R);
?>