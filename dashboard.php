<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
    </head>

    <body onLoad="dashboard();">
       
        <div class="content dashboard">
        
        <header class="userBar">
            <div class="left">
                <img src="img/logo2.png" alt="Vowabi">
                <span class="userName"></span>
            </div>
            <div class="right">
                <button class="button1 logout" onclick="logout()"><i class="icon-logout"></i><span>Cerrar sesión</span></button>
            </div>
        </header>
        
        <div class="userContent">
            <section class="left">
                <h2>Crea un nuevo proyecto</h2>

                <form onsubmit="return createProject(this);">
                    <div class="input-container">
                        <label for="name_p">Nombre</label>
                        <input type="text" id="name_p" required name="name" placeholder="Nombre*"><br>                         
                    </div>
                    
                    <div class="input-container">
                        <label for="description_p">Descripción</label>
                        <input type="text" id="description_p" name="description" placeholder="Descripción"><br>
                    </div>

                    <span class="tooltip">Error de prueba</span>

                    <input class="send" type="submit" value="Crear">
                </form>     

            </section>
            <section class="right">
                <h2>Tus proyectos</h2>
                <ul class="projects-list">
                    <li>
                        <h3>Proyeto 1 - <span class="date">2016-02-18 22:09:38</span></h3>
                        <button><i class="icon-pencil"></i><span>Editar</span></button>
                    </li>
                    <li>
                        <h3>Proyeto 2 - <span class="date">2016-02-18 22:09:38</span></h3>
                        <button><i class="icon-pencil"></i><span>Editar</span></button>
                    </li>
                </ul>
            </section>

        </div>
       

        </div>

        <?php require_once("include/foot.php"); ?>
    </body>
</html>
