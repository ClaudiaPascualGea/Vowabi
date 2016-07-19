<?php
// FICHERO: rest/get/elemento.php

$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER GET. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'GET') exit();
// PETICIONES GET ADMITIDAS:
//   rest/elemento/{ID_ELEMENTO} -> devuelve toda la información del elemento
//   rest/elemento/?idgroup={ID_GRUPO} -> devuelve todos los elementos del grupo

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
header("Access-Control-Allow-Orgin: *");
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
{ // Se devuelve el elemento por ID

  $mysql = 'select e.id, e.Nombre, h.HTML , c.CSS, j.JS from elemento e
                    LEFT JOIN css c
                    ON c.idElemento=e.id
                    LEFT JOIN js j
                    ON j.idElemento=e.id
                    LEFT JOIN html h
                    ON h.idElemento=e.id
            WHERE e.id = '.$ID.';';
}

else
{ // Se utilizan parámetros
  if(isset($PARAMS['idgroup']) && is_numeric($PARAMS['idgroup']) )
  { // se piden todos los elementos del grupo indicado
      $mysql = 'select g.id as grupo, c1.*, h.HTML , c.CSS, j.JS from html hu,
            (select padre.Orden as op,hijo.Orden as oh, padre.id as idPadre, hijo.id as idElemento, hijo.Nombre, padre.idGrupo_elemento from elemento padre, elemento hijo
            where padre.id=hijo.idPadre
            union
            select p.Orden,0, p.id, p.id,p.Nombre, p.idGrupo_elemento from elemento p
            where p.idPadre is NULL
            order by op, oh) c1
                LEFT JOIN html h
                ON h.idElemento=c1.idElemento
                LEFT JOIN css c
                ON c.idElemento=c1.idElemento
                LEFT JOIN js j
                ON j.idElemento=c1.idElemento
          JOIN grupo_elemento g ON g.id=c1.idGrupo_elemento AND g.id=' . mysqli_real_escape_string($link,$PARAMS['idgroup']) . '
            where c1.idElemento = hu.idElemento
        order by op,oh';
  }
  else
  {
    $RESPONSE_CODE = 400; // Los parámetros no son correctos
    $R = array("id", "2", "error", "Los parámetros no son correctos");
  }
}
// =================================================================================
// SE HACE LA CONSULTA
// =================================================================================
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