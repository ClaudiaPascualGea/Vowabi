<?php
// =================================================================================
// INCLUSION DE FUNCIONES EXTERNAS
// =================================================================================
require_once('funciones.php');
// =================================================================================
// =================================================================================
// CONFIGURACION DE ACCESO A LA BASE DE DATOS:
// =================================================================================
$_server   = "127.0.0.1";
$_dataBase = "vowabi";
$_user     = "claudia";
$_password = "claudia";
// =================================================================================
// SE ABRE LA CONEXION A LA BD
// =================================================================================
$link =  mysqli_connect($_server, $_user, $_password, $_dataBase);
if (mysqli_connect_errno()) {
  printf("Fallo en la conexión: %s\n", mysqli_connect_error());
  exit();
}
// =================================================================================
// SE CONFIGURA EL JUEGO DE CARACTERES DE LA CONEXION A UTF-8
// =================================================================================
mysqli_set_charset($link, 'utf8');
// =================================================================================
// =================================================================================

// =================================================================================
// Comprueba si el usuario está logueado y la clave es válida:
// =================================================================================
function comprobarSesion($email, $clave)
{
	global $link;
	global $tiempo_de_sesion;
  $valorRet = false;
  $mysql  = 'select * from Usuario where Email="' . $email . '"';
  $mysql .= ' and Clave="' . $clave . '"';
  $mysql .= ' and UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(Tiempo)<' . $tiempo_de_sesion;
  if( $res = mysqli_query($link, $mysql) )
  {
    if(mysqli_num_rows($res)==1){
      $valorRet = true;
      actualizarUltimoAcceso($email, $clave);
    }
  }
  else
  {
    $RESPONSE_CODE = 500;
    print json_encode( array('resultado' => 'error', 'descripcion' => 'Error de servidor.') );
    exit();
  }
  return $valorRet;
}

function actualizarUltimoAcceso($email, $clave){
  global $link;
  $valorRet = false;

  $mysql  = 'update Usuario set Tiempo=NOW()';
  $mysql .= ' where Clave="' . $clave . '"';
  $mysql .= ' and Email="' . $email . '"';

  if( $res = mysqli_query($link, $mysql) )
  {
      $valorRet = true;
  }
  else
  {
    $RESPONSE_CODE = 500;
    print json_encode( array('resultado' => 'error', 'descripcion' => 'Error de servidor 2.') );
    exit();
  }

  //ultimo_acceso = now
  return $valorRet;
}
// =================================================================================
?>