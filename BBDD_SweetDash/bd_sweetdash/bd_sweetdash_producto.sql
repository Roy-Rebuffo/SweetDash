-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: bd_sweetdash
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `descripcion` text,
  `imagen_url` varchar(255) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `cantidad_personas` varchar(100) DEFAULT NULL,
  `precio_base` decimal(8,2) NOT NULL,
  `id_plantilla` int NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `fk_producto_plantilla_idx` (`id_plantilla`),
  CONSTRAINT `fk_producto_plantilla` FOREIGN KEY (`id_plantilla`) REFERENCES `plantilla_proceso` (`id_plantilla`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Tarta Muerte por Chocolate','Bizcocho húmedo de cacao con relleno de trufa y cobertura fondant',NULL,'Tarta','10-12 raciones',45.00,1),(2,'Tarta Unicornio Vainilla','Bizcocho vainilla con colores pastel y buttercream de nubes',NULL,'Tarta','15 raciones',55.00,2),(3,'Red Velvet Cupcake','Magdalena roja con frosting de queso crema',NULL,'Cupcake','Individual',3.50,3),(4,'Cupcake Vainilla con Flores','Cupcake de vainilla con buttercream floral en tonos pastel',NULL,'Cupcake','Individual',4.00,4),(5,'Cupcake Limón y Frambuesa','Cupcake de limón con frosting de frambuesa fresca',NULL,'Cupcake','Individual',4.00,5),(6,'Galletas Decoradas Surtidas','Pack de 12 galletas con glaseado real y diseños personalizados',NULL,'Galleta','12 unidades',14.00,6),(7,'Tarta Frutos Rojos Naked','Bizcocho vainilla, nata montada y frambuesas frescas al descubierto',NULL,'Tarta','10-12 raciones',48.00,7),(8,'Tarta Drip Chocolate Blanco','Bizcocho vainilla con coulant de chocolate blanco y sprinkles',NULL,'Tarta','12 raciones',52.00,8),(9,'Macarons Surtidos (caja 12)','12 macarons: vainilla, frambuesa, pistacho y café',NULL,'Macaron','12 unidades',18.00,9),(10,'Brownies Chocolate Negro (6u)','Pack de 6 brownies intensos con pepitas de chocolate',NULL,'Brownie','6 unidades',12.00,10),(11,'Cheesecake New York Clásico','Cheesecake horneado estilo Nueva York con coulis de fresa',NULL,'Tarta','8-10 raciones',38.00,11),(12,'Tarta Mousse de Chocolate','Mousse de chocolate 70% sobre base crujiente y espejo oscuro',NULL,'Tarta','10 raciones',42.00,12),(13,'Éclairs de Vainilla (caja 6)','6 éclairs de masa choux con crema pastelera y glaseado blanco',NULL,'Éclair','6 unidades',14.00,13),(14,'Tarta de Santiago XL','Tarta de almendra tradicional gallega en talla grande',NULL,'Tarta','12 raciones',28.00,14),(15,'Cakepops Temáticos (pack 10)','10 cakepops decorados según la temática del evento',NULL,'Cakepop','10 unidades',15.00,15);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-14 16:21:44
