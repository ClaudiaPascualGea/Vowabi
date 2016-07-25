<?php
// FICHERO: rest/delete/proyecto.php

// Analizar la variable PHP_AUTH_DIGEST
$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER DELETE. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'DELETE') exit();
// PETICIONES DELETE ADMITIDAS:
//   delete/proyecto/{ID_PROYECTO} -> elimina el proyecto indicado

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

if(isset($_SERVER['PHP_AUTH_USER']) &&  isset($_SERVER['PHP_AUTH_PW'])){
    $email = $_SERVER['PHP_AUTH_USER'];
    $clave = $_SERVER['PHP_AUTH_PW'];
}else{
    $email = "";
    $clave = "";
}

if( !comprobarSesion($email,$clave) ){
    $R = array('resultado' => 'error', 'descripcion' => 'Tiempo de sesión agotado.');
}
else if(is_numeric($ID))
{ // Se elimina el proyecto

    try{
    // ******** INICIO DE TRANSACCION **********
    mysqli_query($link, 'BEGIN');
    $mysql  = 'delete from proyecto where id='. $ID;

    if( $res = mysqli_query( $link, $mysql ) )
    {
        $R = array('resultado' => 'ok');
    }
    else
    {
      $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido eliminar el proyecto');
    }
    // ******** FIN DE TRANSACCION **********
    mysqli_query($link, "COMMIT");
  } catch(Exception $e){
    // Se ha producido un error, se cancela la transacción.
    mysqli_query($link, "ROLLBACK");
  }
}
else
{ 
    $RESPONSE_CODE = 400; // Los parámetros no son correctos
    $R = array("id", "2", "error", "Los parámetros no son correctos");
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
?>