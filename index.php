<!DOCTYPE html>
<html>
    <head>
        <?php require_once("include/head.php"); ?>
        <title>Vowabi</title>
        <meta name="description" content="Vowabi" />
    </head>

    <body>
       
        <div class="content home">
        	<div class="overlay"></div>
        	<div class="flash background" style="background-image: url('img/background.jpg');"></div>

        	<section class="container-home">

                <div class="title">
                    <img src="img/logo.png" alt="Vowabi">
                    <h1>Vowabi</h1>
                    <h2>Construye de manera sencilla y dinámica tu propia web con Vowabi.</h2>
                </div>

                <ul class="tabs">
                    <li class="active" data-tab="1"><h3>Login</h3></li>
                    <li data-tab="2"><h3>Registro</h3></li>
                </ul>
                
                <div class="tab-content">

                    <div class="login-container formContainer active" id="tab-1">
                        <p>¡Hola de nuevo!</p>
                        <form onsubmit="return login(this);">

                            <div class="input-container">
                                <label for="email_l">Email</label>
                                <input type="email" id="email_l" required name="email" placeholder="Email"><br>                                
                            </div>
                            
                            <div class="input-container">
                                <label for="password_l">Password</label>
                                <input type="password" id="password_l" required name="password" placeholder="Password"><br>
                            </div>

                            <span class="tooltip">Error de prueba</span>
    
                            <input class="send" type="submit" value="Log in">
                        </form>     
                        <button>¿Forgot password?</button>
                    </div>

                    <div class="register-container formContainer" id="tab-2">
                        <p>Regístrate gratis</p>
                         <form name="registerForm" onsubmit="return register(this);">

                            <div class="input-container">
                                <label for="email_r">Email</label>
                                <input type="email" id="email_r" required name="email" placeholder="Email"><br>
                            </div>

                            <div class="input-container">
                                <label for="password_r">Password</label>
                                <input type="password" id="password_r" required name="password" placeholder="Password"
                                pattern=".{6,}" title="Mínimo 6 caracteres"><br>
                            </div>
                            
                            <div class="input-container">
                                <label for="password2_r">Repeat password</label>
                                <input type="password" id="password2_r" required name="password2" placeholder="Repeat password"><br>
                            </div>

                            <span class="tooltip">Error de prueba</span>

                            <input class="send" type="submit" value="Registro">
                        </form>     
                    </div>
                </div>

        	</section>


        </div>

        <?php require_once("include/foot.php"); ?>
    </body>
</html>
