<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <meta name="description" content="Dashboard - Vowabi" />
        <meta name="title" content="Dashboard - Vowabi">
        <title>Dashboard - Vowabi</title>
    </head>

    <body onLoad="dashboard();">
       
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
            </div>
        </header>
        
        <div class="userContent">

            <div class="cont-50 cont">
                <h2 class="title title-small">Grupos</h2>
                <ul class="group-list list cont-content">
                    
                </ul>
                
                <h3 class="title title-small">Crear un nuevo grupo</h3>
                <form class="cont-content" onsubmit="return createGroup(this);">
                    <div class="input-container">
                        <label for="name_p">Nombre</label>
                        <input type="text" id="name_p" required name="name" placeholder=""><br>                         
                    </div>
                    
                    <div class="input-container">
                        <label for="description_p">Descripción</label>
                        <input type="text" id="description_p" required name="description" placeholder=""><br>
                    </div>

                    <span class="error">Error de prueba</span>

                    <input class="send btn btn-second btn-small" type="submit" value="Crear">
                </form>     
            </div>
           
            <div class="cont-50 cont">
                <h2 class="title title-small">Colores</h2>

                <ul class="colors-list list">
                    
                </ul>

                <form class="cont-content" id="newColor" onsubmit="return createColor(this);">
                    <div class="input-container">
                        <label for="name_p">Nombre</label>
                        <input type="text" id="name_p" required name="nombre" placeholder=""><br>                         
                    </div>
                    
                    <div class="input-container">
                        <label for="description_p">Valor</label>
                        <input type="text" id="description_p" name="valor" placeholder=""><br>
                    </div>

                    <span class="error">Error de prueba</span>

                    <input class="send btn btn-second btn-small" type="submit" value="Crear">
                </form>     

            </div>            

        </div>
       

        </div>

        <?php require_once("include/foot.php"); ?>
        <script type='text/javascript' src="js/dashboard.js"></script>
    </body>
</html>
