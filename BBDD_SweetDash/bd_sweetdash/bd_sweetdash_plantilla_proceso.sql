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
-- Table structure for table `plantilla_proceso`
--

DROP TABLE IF EXISTS `plantilla_proceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_proceso` (
  `id_plantilla` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_plantilla`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_proceso`
--

LOCK TABLES `plantilla_proceso` WRITE;
/*!40000 ALTER TABLE `plantilla_proceso` DISABLE KEYS */;
INSERT INTO `plantilla_proceso` VALUES (1,'Tarta Muerte por Chocolate','Proceso específico para la tarta húmeda de cacao con trufa'),(2,'Tarta Unicornio Vainilla','Proceso específico para la tarta vainilla con colores pastel'),(3,'Red Velvet Cupcake','Proceso específico para el cupcake rojo con frosting de queso'),(4,'Cupcake Vainilla con Flores','Proceso específico para el cupcake vainilla con buttercream floral'),(5,'Cupcake Limón y Frambuesa','Proceso específico para el cupcake de limón con frosting de frambuesa'),(6,'Galletas Decoradas Surtidas','Proceso específico para las galletas con glaseado real'),(7,'Tarta Frutos Rojos Naked','Proceso específico para la naked cake con nata y frambuesas'),(8,'Tarta Drip Chocolate Blanco','Proceso específico para la tarta drip con coulant de chocolate blanco'),(9,'Macarons Surtidos','Proceso específico para los macarons de vainilla, frambuesa, pistacho y café'),(10,'Brownies Chocolate Negro','Proceso específico para los brownies intensos con pepitas'),(11,'Cheesecake New York Clásico','Proceso específico para el cheesecake horneado con coulis de fresa'),(12,'Tarta Mousse de Chocolate','Proceso específico para la mousse de chocolate con espejo oscuro'),(13,'Éclairs de Vainilla','Proceso específico para los éclairs de masa choux con crema pastelera'),(14,'Tarta de Santiago XL','Proceso específico para la tarta de almendra gallega en talla grande'),(15,'Cakepops Temáticos','Proceso específico para los cakepops decorados por temática');
/*!40000 ALTER TABLE `plantilla_proceso` ENABLE KEYS */;
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
