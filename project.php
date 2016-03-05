<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <style id="projectStyle"></style>
    </head>

    <body onLoad="project();">
       
        <div class="content project">
        
        <header class="userBar">
            <div class="left">
                <img src="img/logo2.png" alt="Vowabi">
                <span class="userName"></span>
            </div>
            <div class="right">
                <button class="button1" onclick="closeProject()"><i class="icon-left-open"></i><span>Volver</span></button>
                <button class="button1 logout" onclick="logout()"><i class="icon-logout"></i><span>Cerrar sesión</span></button>
            </div>
        </header>

        <div id="projectContainer">
            
        </div>
        

        <?php require_once("include/foot.php"); ?>
    </body>
</html>
