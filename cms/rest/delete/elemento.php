<?php
// FICHERO: rest/delete/elemento.php

// Analizar la variable PHP_AUTH_DIGEST
$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER DELETE. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'DELETE') exit();
// PETICIONES DELETE ADMITIDAS:
//   delete/elemento/{ID_ELEMENTO} -> elimina el elemento indicado

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

$idproject = "";

if(isset($PARAMS['idproject']))
  $idproject = mysqli_real_escape_string( $link, $PARAMS['idproject']);

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

if(!comprobarSesion($email,$clave) ){
  $R = array('resultado' => 'error', 'descripcion' => 'Tiempo de sesión agotado.', 'email'=>$email, 'clave'=>$clave);
}
else if(is_numeric($ID) && $idproject!="")
{ // Se elimina el elemento

    try{
        // ******** INICIO DE TRANSACCION **********
        mysqli_query($link, 'BEGIN');
        $mysql  = 'delete from elemento_usu where id='. $ID;

        if( $res = mysqli_query( $link, $mysql ) )
        {
            //Reajustamos el orden del resto de elementos padre, empezando por el 0
            $mysql_orden = 'select * from elemento_usu WHERE idPadre IS NULL Order By Orden AND idProyecto = '.$idproject.' AND id!='.$ID.';';
            $res_orden = mysqli_query( $link, $mysql_orden );
            if($res_orden){
                $orden = 0;
                while( $row_orden = mysqli_fetch_assoc( $res_orden ) ){
                    $mysql_updateOrden  = 'update elemento_usu set Orden = "'. $orden .'" where id = '. $row_orden["id"];
                    if($res_updateOrden = mysqli_query( $link, $mysql_updateOrden) )
                        $orden++;
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