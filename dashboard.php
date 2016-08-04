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
        <div class="flash image-background" style="background-image: url('img/background/background1.jpg');"
            data-current="1" data-max="5"
            data-img1="img/background/background1.jpg" data-img2="img/background/background2.jpg" data-img3="img/background/background3.jpg"
            data-img4="img/background/background4.jpg" data-img5="img/background/background5.jpg"
            >
        </div>
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
                <h2 class="title title-small">Crea un nuevo proyecto</h2>

                <form id="createProject" class="cont-content" onsubmit="return createProject(this);">
                    <div class="input-container">
                        <label for="name_p">Nombre</label>
                        <input type="text" id="name_p" required name="name" placeholder=""><br>                         
                    </div>
                    
                    <div class="input-container">
                        <label for="description_p">Descripción</label>
                        <input type="text" id="description_p" name="description" placeholder=""><br>
                    </div>

                    <span class="error">Error de prueba</span>

                    <input class="send btn btn-second btn-small" type="submit" value="Crear">
                </form>     

            </div>

            <div class="cont-50 cont">
                <h2 class="title title-small">Tus proyectos</h2>
                <ul class="projects-list cont-content">
                    
                </ul>
            </div>

        </div>
       

        </div>

        <?php require_once("include/foot.php"); ?>
        <script type='text/javascript' src="js/dashboard.js"></script>
    </body>
</html>
