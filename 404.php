<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <meta name="description" content="Error 404" />
        <meta name="title" content="Vowabi">
        <title>Error 404 - Vowabi</title>
    </head>

    <body>
       
        <div class="content home">                

        	<section class="container-home">

                <img class="logo" src="img/logo.png" alt="Vowabi">
                <h1 class="title">Vowabi</h1>
                <p class="text">¡Ups! Lo sentimos, no hemos encontrado la página solicitada.</p>
                <a href="<?='http://'.$_SERVER['HTTP_HOST']?>/vowabi" class="btn">Volver al inicio</a>
        	</section>


        </div>

        <?php require_once("include/foot.php"); ?>
        <script type='text/javascript' src="<?='http://'.$_SERVER['HTTP_HOST']?>/vowabi/js/index.js"></script>

    </body>
</html>
