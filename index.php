<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <meta name="description" content="Vowabi" />
        <meta name="title" content="Vowabi">
        <title>Vowabi</title>
    </head>

    <body onLoad="prepareSlider();">
       
        <div class="content home">
            
            <!-- Background Slider -->
            <div class="overlay"></div>
            <div class="flash image-background" style="background-image: url('img/background/background1.jpg');"
                data-current="1" data-max="5"
                data-img1="img/background/background1.jpg" data-img2="img/background/background2.jpg" data-img3="img/background/background3.jpg"
                data-img4="img/background/background4.jpg" data-img5="img/background/background5.jpg"
                >
            </div>
            <div class="flash image-foreground" style="background-image: url('img/background/background1.jpg');"></div>

        	<section class="container-home">


                <img class="logo" src="img/logo.png" alt="Vowabi">
                <h1 class="title">Vowabi</h1>
                <h2 class="text">Construye de manera sencilla y dinámica tu propia web con Vowabi.</h2>
  

                <ul class="tabs js-tabs">
                    <li class="active" data-tab="1">Login</li>
                    <li data-tab="2">Registro</li>
                </ul>
                
                <div class="tab-content js-tab-content">

                    <div class="js-login-container formContainer active" id="tab-1">
                        <h3 class="subtitle">¡Hola de nuevo!</h3>
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
                       <!--  <button onclick="rememberPassword()" class="link">¿Forgot password?</button> -->
                    </div>

                    <div class="js-register-container formContainer" id="tab-2">
                        <h3 class="subtitle">Regístrate gratis</h3>
                         <form name="registerForm" onsubmit="return register(this);">

                            <div class="input-container">
                                <label for="email_r">Email</label>
                                <input type="email" id="email_r" required name="email" placeholder="Email"><br>
                            </div>

                            <div class="input-container">
                                <label for="password_r">Password</label>
                                <input type="password" id="password_r" required name="password" placeholder="Password"
                                pattern=".{4,}" title="Mínimo 4 caracteres"><br>
                            </div>
                            
                            <div class="input-container">
                                <label for="password2_r">Repeat password</label>
                                <input type="password" id="password2_r" required name="password2" placeholder="Repeat password"><br>
                            </div>

                            <span class="js-error error">Error de prueba</span>

                            <input class="send btn btn-primary" type="submit" value="Registro">
                        </form>     
                    </div>
                </div>

        	</section>


        </div>

        <?php require_once("include/foot.php"); ?>
        <script type='text/javascript' src="js/index.js"></script>

    </body>
</html>
