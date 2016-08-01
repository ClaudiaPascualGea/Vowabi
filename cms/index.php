<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <meta name="description" content="Vowabi" />
        <meta name="title" content="Vowabi">
        <title>Vowabi</title>
    </head>

    <body>
       
        <div class="content home">
            
            <!-- Background Slider -->
            <div class="overlay"></div>
            <div class="flash image-foreground" style="background-image: url('img/background/background1.jpg');"></div>

        	<section class="container-home">


                <img class="logo" src="img/logo.png" alt="Vowabi">
                <h1 class="title">CMS Vowabi</h1>             

                <ul class="tabs js-tabs">
                    <li class="active" data-tab="1">Login</li>
                </ul>
                
                <div class="tab-content js-tab-content">

                    <div class="js-login-container formContainer active" id="tab-1">
                        <h3 class="subtitle">Login Admin</h3>
                        <form onsubmit="return login(this);">

                            <div class="input-container">
                                <label for="email_l">Email</label>
                                <input type="email" id="email_l" required name="email" placeholder="Email"><br>                                
                            </div>
                            
                            <div class="input-container">
                                <label for="password_l">Password</label>
                                <input type="password" id="password_l" required name="password" placeholder="Password"><br>
                            </div>

                            <span class="js-error error">Error de prueba</span>
    
                            <input class="send btn btn-primary" type="submit" value="Login">
                        </form>                         
                    </div>

                    <div class="js-register-container formContainer" id="tab-2">
 
                    </div>
                </div>

        	</section>


        </div>

        <?php require_once("include/foot.php"); ?>
        <script type='text/javascript' src="js/index.js"></script>

    </body>
</html>
