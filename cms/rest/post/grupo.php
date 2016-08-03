<?php
// FICHERO: rest/post/grupo.php

$METODO = $_SERVER['REQUEST_METHOD'];
// EL METODO DEBE SER POST. SI NO LO ES, NO SE HACE NADA.
if($METODO<>'POST') exit();
// PETICIONES POST ADMITIDAS:
//   rest/grupo/
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

$nombre = "";
$descripcion = "";
$idGrupo = "";
$image = "";
$imageName = "";

if(isset($PARAMS['name']))
  $nombre = mysqli_real_escape_string( $link, $PARAMS['name']);

if(isset($PARAMS['description']))
  $descripcion = mysqli_real_escape_string( $link, $PARAMS['description']);

if(isset($PARAMS['idGrupo']))
  $idGrupo = mysqli_real_escape_string( $link, $PARAMS['idGrupo']);

if(isset($_FILES['file']))
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

if( !comprobarSesion($email,$clave) )
  $R = array('resultado' => 'error', 'descripcion' => 'Tiempo de sesión agotado.');
else if($idGrupo != "" && $nombre != ""){ //Cambio de nombre
  try{
      mysqli_query($link, 'BEGIN');
      $mysql  = 'update grupo set Nombre = "'. $nombre .'" where id = '. $idGrupo;

      if( $res = mysqli_query( $link, $mysql ) )
        $R = array('resultado' => 'ok', 'nombre' => $nombre);
      else
        $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido cambiar el nombre');
      mysqli_query($link, "COMMIT");
    } catch(Exception $e){
      mysqli_query($link, "ROLLBACK");
    }
}
else if($nombre != "" && $descripcion!= "")
{
  try{
    // ******** INICIO DE TRANSACCION **********
    mysqli_query($link, 'BEGIN');
    $mysql  = 'insert into grupo(Nombre,Descripcion) values("';
    $mysql .= $nombre . '","' . $descripcion . '")';

    if( $res = mysqli_query( $link, $mysql ) )
    {
      $id = mysqli_insert_id($link);
      $R = array('resultado' => 'ok', 'nombre' => $nombre, 'id'=> $id);
    }
    else
    {
      $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido crear el grupo');
    }
    // ******** FIN DE TRANSACCION **********
    mysqli_query($link, "COMMIT");

  } catch(Exception $e){
    // Se ha producido un error, se cancela la transacción.
    mysqli_query($link, "ROLLBACK");
  }
}else if($idGrupo!="" && $image!="" && $imageName!=""){

  if (is_dir($uploaddir) && is_writable($uploaddir) && $image['tmp_name']) {

      $ext = pathinfo($imageName, PATHINFO_EXTENSION);
      $name = md5(rand(0,100)."VOWABI").".".$ext;

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

                $mysql  = 'update grupo set idImagen = "'. $id .'" where id = '. $idGrupo;

                if( $res = mysqli_query( $link, $mysql ) )
                  $R = array('resultado' => 'ok', 'img' => $src);
                else
                  $R = array('resultado' => 'error', 'descripcion' => 'No se ha podido asignar la imagen al grupo');
               
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

}else{
  $RESPONSE_CODE = 401;
  $R = array('resultado' => 'error', 'descripcion' => 'Creación de grupo incorrecta');
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