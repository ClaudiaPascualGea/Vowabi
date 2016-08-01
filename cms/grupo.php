<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <meta name="description" content="Dashboard - Vowabi" />
        <meta name="title" content="Dashboard - Vowabi">
        <title>Dashboard - Vowabi</title>
    </head>

    <body onload="group()">
       
        <div class="content dashboard">

         <!-- Background Slider -->
        <div class="overlay"></div>        
        <div class="flash image-foreground" style="background-image: url('img/background/background1.jpg');"></div>

        
        <header class="userBar">
            <div class="left">
                <img src="img/logo.png" alt="Vowabi">
                <span class="userName"></span>
            </div>
            <div class="right">
                <button class="btn btn-small btn-icon btn-primary logout" onclick="logout()"><i class="icon-logout"></i><span>Cerrar sesión</span></button>
                 <button class="btn btn-icon btn-small btn-primary button1" onclick="closeGroup()"><i class="icon-left-open"></i><span>Volver</span></button>
            </div>
        </header>
        
        <div class="userContent">            

        </div>
       

        </div>

        <?php require_once("include/foot.php"); ?>
        <script type='text/javascript' src="js/group.js"></script>
    </body>
</html>
