<?php
// FICHERO: rest/get/comentario.php

$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER GET. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'GET') exit();
// PETICIONES GET ADMITIDAS:
//   rest/proyecto/{ID_PROYECTO} -> devuelve toda la información del proyecto con todos los elementos
//   rest/proyecto/?idusu={ID_USUARIO}  -> devuelve un array con todos los proyectos del usuario

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
{ // Se debe devolver la información del proyecto



  
  $mysql = 'select e.id as idElemento, e.Nombre, e.Orden, h.HTML, c.CSS, j.JS  
              FROM proyecto p
                LEFT JOIN elemento_usu e
                ON e.idProyecto=p.id
                LEFT JOIN html_usu h
                ON h.idElemento_usu=e.id
                LEFT JOIN css_usu c
                ON c.idElemento_usu=e.id
                LEFT JOIN js_usu j
                ON j.idElemento_usu=e.id
              WHERE p.id=' . mysqli_real_escape_string($link,$ID) . '    
              ORDER BY e.idPadre,e.Orden
            ';

            /*
select c1.*, hu.HTML from html_usu hu,(select padre.Orden as op,hijo.Orden as oh,padre.id as p_i, hijo.id as h_i, padre.Nombre from elemento_usu padre, elemento_usu hijo
where padre.id=hijo.idPadre
union
select p.Orden,0, p.id, p.id,p.Nombre from elemento_usu p
where p.idPadre is NULL
order by op, oh) c1
where c1.h_i = hu.idElemento_usu
order by op,oh
            */
}
else
{ // Se utilizan parámetros
	if(isset($PARAMS['idusu']) && is_numeric($PARAMS['idusu']))
	{ // se piden todos los proyectos del usuario
		$mysql = 'select * from proyecto where idUsuario =' . mysqli_real_escape_string($link,$PARAMS['idusu']) . ' order by FechaCreacion desc';
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