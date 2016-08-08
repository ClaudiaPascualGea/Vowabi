<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <meta name="description" content="Vowabi" />
        <meta name="title" content="Vowabi">
        <title>Vowabi</title>
        <style id="projectStyle"></style>
    </head>

    <body onLoad="initTexts(); project(); initColors();" class="body-project">
       
        <div class="content project">
        
            <header class="userBar">
                <div class="left">
                    <img src="img/logo2.png" alt="Vowabi">
                    <span class="userName"></span>
                </div>
                <div class="right">
                    <button class="btn btn-small btn-primary button1 tooltip" data-title="Volver a Dashboard" onclick="closeProject()"><i class="icon-left-open"></i></button>
                    <button class="btn btn-small btn-primary button1 tooltip tooltip" data-title="Exportar Proyecto" onclick="exportProject()"><i class="icon-export-1"></i></button>
                    <button class="btn btn-small btn-red button1 logout tooltip tooltip-right" data-title="Cerrar sesión" onclick="logout()"><i class="icon-logout"></i></button>
                </div>
            </header>

            <div id="projectContainer">
                
            </div>

            <input type="file" style="visibility:hidden;" id="uploadFile"  accept="image/*">

        </div>

        <div class="overlay"></div>
        
       
         <!-- Menu colors -->
          <div class="menu-wrap">
              <nav class="menu">
              </nav>
          </div>

          <i class="icon-droplet menu-button"  id="open-button"></i>
          <!-- Fin menu colors -->

          
        <!-- Menu right -->

        <div class="tooltipRight tooltip-east">
            <span class="tooltip-content">Añade tu primer elemento arrastrándolo al lugar deseado</span>
        </div>
     
        <i class="icon-plus menu-right-button" id="open-right"></i>
        <nav class="menu-right">
            <ul class="group-list">

            </ul>
        </nav>
        <!-- Fin menu right -->

        <?php require_once("include/foot.php"); ?>
        <script type='text/javascript' src="js/project.js"></script>
        <script type='text/javascript' src="js/colors.js"></script>
        <script type='text/javascript' src="js/texts.js"></script>
        <script type='text/javascript' src="js/export.js"></script>

    </body>
</html>
