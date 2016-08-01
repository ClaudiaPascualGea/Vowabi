-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         5.6.24 - MySQL Community Server (GPL)
-- SO del servidor:              Win32
-- HeidiSQL Versión:             9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Volcando estructura de base de datos para vowabi
CREATE DATABASE IF NOT EXISTS `vowabi` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `vowabi`;


-- Volcando estructura para tabla vowabi.color
CREATE TABLE IF NOT EXISTS `color` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(250) NOT NULL,
  `Valor` varchar(7) NOT NULL,
  `Orden` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.color: ~11 rows (aproximadamente)
DELETE FROM `color`;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` (`id`, `Nombre`, `Valor`, `Orden`) VALUES
	(1, 'Negro', '#252525', 1),
	(2, 'Blanco', '#FFFFFF', 2),
	(3, 'Gris', '#c0c3d5', 3),
	(4, 'Azul', '#5FA1E0', 4),
	(5, 'Verde', '#c1d5c0', 5),
	(6, 'Verde', '#47AE73', 6),
	(7, 'Verde Lima', '#cddc39', 7),
	(8, 'Amarillo', '#eae7c4', 8),
	(9, 'Rojo', '#FB6964', 9),
	(10, 'Gris', '#9e9e9e', 18),
	(11, 'Gris', '#607d8b', 19),
	(12, 'Gris', '#F0F0F0', 3);
/*!40000 ALTER TABLE `color` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.css
CREATE TABLE IF NOT EXISTS `css` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idElemento` int(11) NOT NULL,
  `css` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_css_elemento` (`idElemento`),
  CONSTRAINT `FK_css_elemento` FOREIGN KEY (`idElemento`) REFERENCES `elemento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.css: ~13 rows (aproximadamente)
DELETE FROM `css`;
/*!40000 ALTER TABLE `css` DISABLE KEYS */;
INSERT INTO `css` (`id`, `idElemento`, `css`) VALUES
	(1, 2, '--general--\r\npadding: 10px 20px;\r\ntext-transform: uppercase;\r\nmargin: 20px auto;\r\ndisplay: block;\r\nbackground-color: #000;\r\nfont-family: \'Roboto\', sans-serif;\r\nletter-spacing: 2px;\r\ncolor: #fff;\r\nborder: 1px solid #000;\r\nfont-size: 18px;\r\n-webkit-transition:background-color ease-in-out 0.3s, color ease-in-out 0.3s;\r\n-o-transition:background-color ease-in-out 0.3s, color ease-in-out 0.3s;\r\ntransition:background-color ease-in-out 0.3s, color ease-in-out 0.3s;\r\n--:hover--\r\nbackground-color:#FFF;\r\nborder: 1px solid #000;\r\ncolor:#000;'),
	(2, 1, '--general--\r\nbackground-color: #FFFFF;\r\npadding: 25px;\r\ndisplay: block;\r\nmargin: 0 auto;\r\ntext-align: center;'),
	(3, 3, '--general--\r\npadding:50px;\r\ntext-align: center;\r\nbackground-color:#F0F0F0;'),
	(4, 4, '--general--\r\npadding: 20px;\r\ndisplay: block;\r\ncolor: #252525;\r\nfont-size: 30px;\r\nline-height: 34px;\r\ntext-transform: uppercase;\r\nfont-family: \'Roboto\', sans-serif;\r\nletter-spacing: 6px;\r\nfont-weight: bold;'),
	(5, 5, '--general--\r\nmargin: 10px 0;\r\ndisplay: block;\r\ncolor: #252525;\r\nfont-weight: bold;\r\nfont-size: 20px;\r\nline-height: 24px;\r\nfont-family: \'Roboto\', sans-serif;'),
	(6, 6, '--general--\r\nmargin: 20px 0;\r\ndisplay: block;\r\ncolor: #252525;\r\nfont-size: 18px;\r\nline-height: 22px;\r\nfont-family: \'Roboto\', sans-serif;'),
	(7, 7, '--general--\r\nmargin: 10px;\r\nmax-width: calc(25% - 20px);\r\ndisplay: inline-block;'),
	(8, 8, '--general--\r\npadding:20px;\r\ntext-align: center;\r\nbackground-color:#000;'),
	(9, 9, '--general--\r\npadding:40px 20px;\r\ntext-align: center;\r\nbackground-color:#FFF;'),
	(10, 10, '--general--\r\ntext-align: center;\r\nmargin: 20px 0;'),
	(11, 11, '--general--\r\nfont-family: serif;\r\nfont-size: 100px;\r\nline-height: 50px;\r\ndisplay: block;\r\ncolor:#7B7B7F;'),
	(12, 12, '--general--\r\nfont-size:30px;\r\nline-height: 40px;\r\npadding:10px 0;\r\ncolor:#7B7B7F;'),
	(14, 13, '--general--\r\nfont-size: 18px;\r\ncolor:#7B7B7F;');
/*!40000 ALTER TABLE `css` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.css_usu
CREATE TABLE IF NOT EXISTS `css_usu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idElemento_usu` int(11) NOT NULL,
  `CSS` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_css_usu_elemento_usu` (`idElemento_usu`),
  CONSTRAINT `FK_css_usu_elemento_usu` FOREIGN KEY (`idElemento_usu`) REFERENCES `elemento_usu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=841 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.css_usu: ~5 rows (aproximadamente)
DELETE FROM `css_usu`;
/*!40000 ALTER TABLE `css_usu` DISABLE KEYS */;
INSERT INTO `css_usu` (`id`, `idElemento_usu`, `CSS`) VALUES
	(783, 539, '--general--\npadding:20px;\ntext-align:center;\nbackground-color:#F0F0F0;\n'),
	(784, 540, '--general--\r\nmargin: 10px;\r\nmax-width: calc(25% - 20px);\r\ndisplay: inline-block;'),
	(785, 541, '--general--\r\nmargin: 10px;\r\nmax-width: calc(25% - 20px);\r\ndisplay: inline-block;'),
	(786, 542, '--general--\r\nmargin: 10px;\r\nmax-width: calc(25% - 20px);\r\ndisplay: inline-block;'),
	(832, 588, '--general--\npadding:50px;\ntext-align:center;\nbackground-color:#F0F0F0;\n'),
	(833, 589, '--general--\r\npadding: 20px;\r\ndisplay: block;\r\ncolor: #252525;\r\nfont-size: 30px;\r\nline-height: 34px;\r\ntext-transform: uppercase;\r\nfont-family: \'Roboto\', sans-serif;\r\nletter-spacing: 6px;\r\nfont-weight: bold;'),
	(834, 590, '--general--\r\nmargin: 10px 0;\r\ndisplay: block;\r\ncolor: #252525;\r\nfont-weight: bold;\r\nfont-size: 20px;\r\nline-height: 24px;\r\nfont-family: \'Roboto\', sans-serif;'),
	(835, 591, '--general--\r\nmargin: 20px 0;\r\ndisplay: block;\r\ncolor: #252525;\r\nfont-size: 18px;\r\nline-height: 22px;\r\nfont-family: \'Roboto\', sans-serif;'),
	(836, 592, '--general--\r\npadding:40px 20px;\r\ntext-align: center;\r\nbackground-color:#FFF;'),
	(837, 593, '--general--\r\ntext-align: center;\r\nmargin: 20px 0;'),
	(838, 594, '--general--\r\nfont-family: serif;\r\nfont-size: 100px;\r\nline-height: 50px;\r\ndisplay: block;\r\ncolor:#7B7B7F;'),
	(839, 595, '--general--\nfont-size:30px;\nline-height:40px;\npadding:10px 0;\ncolor:#7B7B7F;\ntext-align:center;\n'),
	(840, 596, '--general--\nfont-size:18px;\ncolor:#7B7B7F;\n');
/*!40000 ALTER TABLE `css_usu` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.elemento
CREATE TABLE IF NOT EXISTS `elemento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(250) NOT NULL,
  `Independiente` tinyint(3) NOT NULL DEFAULT '0',
  `ContentEditable` tinyint(3) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.elemento: ~13 rows (aproximadamente)
DELETE FROM `elemento`;
/*!40000 ALTER TABLE `elemento` DISABLE KEYS */;
INSERT INTO `elemento` (`id`, `Nombre`, `Independiente`, `ContentEditable`) VALUES
	(1, 'Contenedor Blanco', 0, 0),
	(2, 'Botón', 0, 1),
	(3, 'Contenedor Gris', 0, 0),
	(4, 'Título', 1, 1),
	(5, 'Subtítulo', 1, 1),
	(6, 'Texto', 1, 1),
	(7, 'Imagen', 0, 0),
	(8, 'Contenedor negro', 0, 0),
	(9, 'Section', 0, 0),
	(10, 'Blockquote', 0, 0),
	(11, 'Quote Symbol', 0, 0),
	(12, 'Quote Text', 0, 1),
	(13, 'Quote Author', 0, 1);
/*!40000 ALTER TABLE `elemento` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.elemento_usu
CREATE TABLE IF NOT EXISTS `elemento_usu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idProyecto` int(11) NOT NULL,
  `Nombre` varchar(250) NOT NULL,
  `Orden` int(11) NOT NULL DEFAULT '0',
  `idPadre` int(11) DEFAULT NULL,
  `ContentEditable` tinyint(3) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_elemento_usu_elemento` (`idProyecto`),
  KEY `FK_elemento_usu_elemento_usu` (`idPadre`),
  CONSTRAINT `FK_elemento_usu_elemento` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_elemento_usu_elemento_usu` FOREIGN KEY (`idPadre`) REFERENCES `elemento_usu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=597 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.elemento_usu: ~5 rows (aproximadamente)
DELETE FROM `elemento_usu`;
/*!40000 ALTER TABLE `elemento_usu` DISABLE KEYS */;
INSERT INTO `elemento_usu` (`id`, `idProyecto`, `Nombre`, `Orden`, `idPadre`, `ContentEditable`) VALUES
	(539, 40, 'Contenedor negro', 0, NULL, 0),
	(540, 40, 'Imagen', 1, 539, 0),
	(541, 40, 'Imagen', 2, 539, 0),
	(542, 40, 'Imagen', 3, 539, 0),
	(588, 40, 'Contenedor Gris', 2, NULL, 0),
	(589, 40, 'Título', 1, 588, 1),
	(590, 40, 'Subtítulo', 2, 588, 1),
	(591, 40, 'Texto', 3, 588, 1),
	(592, 40, 'Section', 1, NULL, 0),
	(593, 40, 'Blockquote', 1, 592, 0),
	(594, 40, 'Quote Symbol', 1, 593, 0),
	(595, 40, 'Quote Text', 2, 593, 1),
	(596, 40, 'Quote Author', 3, 593, 1);
/*!40000 ALTER TABLE `elemento_usu` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.grupo
CREATE TABLE IF NOT EXISTS `grupo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(250) NOT NULL,
  `Descripcion` varchar(500) DEFAULT NULL,
  `Orden` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.grupo: ~3 rows (aproximadamente)
DELETE FROM `grupo`;
/*!40000 ALTER TABLE `grupo` DISABLE KEYS */;
INSERT INTO `grupo` (`id`, `Nombre`, `Descripcion`, `Orden`) VALUES
	(1, 'Grupo 1', 'Fondo gris <br> Título + Subtítulo + Texto', 1),
	(2, 'Grupo 2', 'Fondo blanco <br> Titulo + Texto + Boton', 2),
	(3, 'Grupo 3', 'Fondo negro <br> Grupo de imágenes', 3),
	(4, 'Quote group', 'Grupo con cita', 4);
/*!40000 ALTER TABLE `grupo` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.grupo_elemento
CREATE TABLE IF NOT EXISTS `grupo_elemento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idGrupo` int(11) NOT NULL,
  `idElemento` int(11) NOT NULL,
  `idPadre` int(11) DEFAULT NULL,
  `Orden` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_grupo_elemento_Grupo` (`idGrupo`),
  KEY `FK_grupo_elemento_elemento` (`idElemento`),
  KEY `FK_grupo_elemento_elemento_2` (`idPadre`),
  CONSTRAINT `FK_grupo_elemento_Grupo` FOREIGN KEY (`idGrupo`) REFERENCES `grupo` (`id`),
  CONSTRAINT `FK_grupo_elemento_elemento` FOREIGN KEY (`idElemento`) REFERENCES `elemento` (`id`),
  CONSTRAINT `FK_grupo_elemento_elemento_2` FOREIGN KEY (`idPadre`) REFERENCES `elemento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.grupo_elemento: ~17 rows (aproximadamente)
DELETE FROM `grupo_elemento`;
/*!40000 ALTER TABLE `grupo_elemento` DISABLE KEYS */;
INSERT INTO `grupo_elemento` (`id`, `idGrupo`, `idElemento`, `idPadre`, `Orden`) VALUES
	(1, 1, 3, NULL, 0),
	(2, 1, 4, 3, 1),
	(3, 1, 5, 3, 2),
	(4, 1, 6, 3, 3),
	(5, 2, 1, NULL, 0),
	(6, 2, 4, 1, 1),
	(7, 2, 6, 1, 2),
	(8, 2, 2, 1, 3),
	(10, 3, 8, NULL, 0),
	(11, 3, 7, 8, 1),
	(12, 3, 7, 8, 2),
	(13, 3, 7, 8, 3),
	(14, 4, 9, NULL, 0),
	(15, 4, 10, 9, 1),
	(16, 4, 11, 10, 1),
	(17, 4, 12, 10, 2),
	(18, 4, 13, 10, 3);
/*!40000 ALTER TABLE `grupo_elemento` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.html
CREATE TABLE IF NOT EXISTS `html` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idElemento` int(11) NOT NULL,
  `HTML` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_html_elemento` (`idElemento`),
  CONSTRAINT `FK_html_elemento` FOREIGN KEY (`idElemento`) REFERENCES `elemento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.html: ~13 rows (aproximadamente)
DELETE FROM `html`;
/*!40000 ALTER TABLE `html` DISABLE KEYS */;
INSERT INTO `html` (`id`, `idElemento`, `HTML`) VALUES
	(1, 1, '<div></div>'),
	(2, 2, '<button>Prueba</button>'),
	(3, 3, '<div></div>'),
	(4, 4, '<h1>Esto es un título</h1>'),
	(5, 5, '<h2>Esto es un subtítulo</h2>'),
	(6, 6, '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>'),
	(7, 7, '<img src="img/background/background1.jpg">'),
	(8, 8, '<div></div>'),
	(10, 9, '<section></section>'),
	(11, 10, '<blockquote></blockquote>'),
	(12, 11, '<span>“</span>'),
	(13, 12, '<p>There are two types of people who will tell you that you cannot make a difference in this world: those who are afraid to try and those who are afraid you will succeed.</p>'),
	(14, 13, '<p>- Ray Goforth</p>');
/*!40000 ALTER TABLE `html` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.html_usu
CREATE TABLE IF NOT EXISTS `html_usu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idElemento_usu` int(11) NOT NULL,
  `HTML` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_html_elemento_usu` (`idElemento_usu`),
  CONSTRAINT `FK_html_elemento_usu` FOREIGN KEY (`idElemento_usu`) REFERENCES `elemento_usu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=842 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.html_usu: ~5 rows (aproximadamente)
DELETE FROM `html_usu`;
/*!40000 ALTER TABLE `html_usu` DISABLE KEYS */;
INSERT INTO `html_usu` (`id`, `idElemento_usu`, `HTML`) VALUES
	(784, 539, '<div></div>'),
	(785, 540, '<img src="img/background/background1.jpg">'),
	(786, 541, '<img src="img/background/background1.jpg">'),
	(787, 542, '<img src="img/background/background1.jpg">'),
	(833, 588, '<div></div>'),
	(834, 589, '<h1>Esto es un título</h1>'),
	(835, 590, '<h2>Esto es un subtítulo</h2>'),
	(836, 591, '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>'),
	(837, 592, '<section></section>'),
	(838, 593, '<blockquote></blockquote>'),
	(839, 594, '<span>“</span>'),
	(840, 595, '<p>There are two types of people who will tell you that you cannot make a difference in this world: those who are afraid to try and those who are afraid you will succeed.</p>'),
	(841, 596, '<p>- Ray Goforth</p>');
/*!40000 ALTER TABLE `html_usu` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.js
CREATE TABLE IF NOT EXISTS `js` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idElemento` int(11) NOT NULL,
  `JS` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_js_elemento` (`idElemento`),
  CONSTRAINT `FK_js_elemento` FOREIGN KEY (`idElemento`) REFERENCES `elemento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.js: ~0 rows (aproximadamente)
DELETE FROM `js`;
/*!40000 ALTER TABLE `js` DISABLE KEYS */;
/*!40000 ALTER TABLE `js` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.js_usu
CREATE TABLE IF NOT EXISTS `js_usu` (
  `idJs_usu` int(11) NOT NULL AUTO_INCREMENT,
  `idElemento_usu` int(11) NOT NULL,
  `JS` text,
  PRIMARY KEY (`idJs_usu`),
  KEY `FK_js_usu_elemento_usu` (`idElemento_usu`),
  CONSTRAINT `FK_js_usu_elemento_usu` FOREIGN KEY (`idElemento_usu`) REFERENCES `elemento_usu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=842 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.js_usu: ~5 rows (aproximadamente)
DELETE FROM `js_usu`;
/*!40000 ALTER TABLE `js_usu` DISABLE KEYS */;
INSERT INTO `js_usu` (`idJs_usu`, `idElemento_usu`, `JS`) VALUES
	(784, 539, ''),
	(785, 540, ''),
	(786, 541, ''),
	(787, 542, ''),
	(833, 588, ''),
	(834, 589, ''),
	(835, 590, ''),
	(836, 591, ''),
	(837, 592, ''),
	(838, 593, ''),
	(839, 594, ''),
	(840, 595, ''),
	(841, 596, '');
/*!40000 ALTER TABLE `js_usu` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.proyecto
CREATE TABLE IF NOT EXISTS `proyecto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUsuario` int(11) NOT NULL,
  `Nombre` varchar(250) NOT NULL,
  `Descripcion` varchar(250) DEFAULT NULL,
  `FechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_Proyecto_Usuario` (`idUsuario`),
  CONSTRAINT `FK_Proyecto_Usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.proyecto: ~3 rows (aproximadamente)
DELETE FROM `proyecto`;
/*!40000 ALTER TABLE `proyecto` DISABLE KEYS */;
INSERT INTO `proyecto` (`id`, `idUsuario`, `Nombre`, `Descripcion`, `FechaCreacion`) VALUES
	(40, 13, 'Proyecto 1', 'Primer proyecto de prueba', '2016-07-19 18:29:12');
/*!40000 ALTER TABLE `proyecto` ENABLE KEYS */;


-- Volcando estructura para tabla vowabi.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(20) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Clave` varchar(35) DEFAULT NULL,
  `Tiempo` timestamp NULL DEFAULT NULL,
  `Admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla vowabi.usuario: ~2 rows (aproximadamente)
DELETE FROM `usuario`;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` (`id`, `Email`, `Password`, `Nombre`, `Clave`, `Tiempo`, `Admin`) VALUES
	(13, 'claudia@tfg.com', '1234', NULL, '7616710cdf6035ddcc229f3c1f190454', '2016-08-02 00:19:03', 1),
	(14, 'clau.p.gea@hotmail.com', '1234', NULL, '26e26141beb7bcad91380017da88d1ee', '2016-08-01 21:43:02', 0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
