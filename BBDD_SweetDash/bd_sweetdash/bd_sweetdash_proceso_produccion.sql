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
-- Table structure for table `proceso_produccion`
--

DROP TABLE IF EXISTS `proceso_produccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proceso_produccion` (
  `id_proceso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `dias_antes_entrega` int NOT NULL DEFAULT '0',
  `plantilla_proceso_id_plantilla` int NOT NULL,
  PRIMARY KEY (`id_proceso`),
  KEY `fk_proceso_plantilla_idx` (`plantilla_proceso_id_plantilla`),
  CONSTRAINT `fk_proceso_plantilla` FOREIGN KEY (`plantilla_proceso_id_plantilla`) REFERENCES `plantilla_proceso` (`id_plantilla`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proceso_produccion`
--

LOCK TABLES `proceso_produccion` WRITE;
/*!40000 ALTER TABLE `proceso_produccion` DISABLE KEYS */;
INSERT INTO `proceso_produccion` VALUES (1,'Horneado bizcocho de cacao',2,1),(2,'Preparación trufa y relleno',1,1),(3,'Ganache y decoración final',0,1),(4,'Horneado bizcocho vainilla',2,2),(5,'Teñido y montaje de capas',1,2),(6,'Buttercream y decoración unicornio',0,2),(7,'Preparación masa red velvet',1,3),(8,'Horneado y enfriado',1,3),(9,'Frosting de queso y decoración',0,3),(10,'Horneado cupcake vainilla',1,4),(11,'Preparación buttercream floral',0,4),(12,'Decoración con flores en manga',0,4),(13,'Horneado cupcake de limón',1,5),(14,'Preparación frosting frambuesa',0,5),(15,'Montaje y decoración',0,5),(16,'Preparación y corte de masa',2,6),(17,'Horneado y enfriado',1,6),(18,'Glaseado real y decoración',0,6),(19,'Horneado base naked cake',2,7),(20,'Montaje de capas con nata',1,7),(21,'Decoración con frambuesas frescas',0,7),(22,'Horneado bizcocho base',2,8),(23,'Buttercream y alisado',1,8),(24,'Drip de chocolate blanco y sprinkles',0,8),(25,'Preparación merengue y macaronage',2,9),(26,'Horneado y reposo',1,9),(27,'Relleno y maduración 24h',1,9),(28,'Preparación masa brownie',1,10),(29,'Horneado preciso y enfriado',1,10),(30,'Cortado y emplatado',0,10),(31,'Preparación base de galleta',2,11),(32,'Horneado en baño maría',2,11),(33,'Enfriado, coulis y acabado',1,11),(34,'Preparación base crujiente',2,12),(35,'Elaboración mousse de chocolate',1,12),(36,'Cobertura espejo y refrigeración',1,12),(37,'Preparación masa choux',1,13),(38,'Horneado y relleno crema pastelera',1,13),(39,'Glaseado y presentación',0,13),(40,'Preparación masa de almendra',1,14),(41,'Horneado y enfriado',1,14),(42,'Azúcar glass y acabado',0,14),(43,'Horneado bizcocho base',2,15),(44,'Mezcla con frosting y boleado',1,15),(45,'Cobertura de chocolate y decoración temática',0,15),(46,'Compra y preparación de ingredientes',3,1),(47,'Compra frambuesas y preparación nata',4,7),(48,'Compra ingredientes y base galleta',5,11),(49,'Reposo claras de huevo a temperatura',3,9),(50,'Horneado bizcocho de cacao',2,1),(51,'Preparación trufa y relleno',1,1),(52,'Ganache y decoración final',0,1),(53,'Horneado bizcocho vainilla',2,2),(54,'Teñido y montaje de capas',1,2),(55,'Buttercream y decoración unicornio',0,2),(56,'Preparación masa red velvet',1,3),(57,'Horneado y enfriado',1,3),(58,'Frosting de queso y decoración',0,3),(59,'Horneado cupcake vainilla',1,4),(60,'Preparación buttercream floral',0,4),(61,'Decoración con flores en manga',0,4),(62,'Horneado cupcake de limón',1,5),(63,'Preparación frosting frambuesa',0,5),(64,'Montaje y decoración',0,5),(65,'Preparación y corte de masa',2,6),(66,'Horneado y enfriado',1,6),(67,'Glaseado real y decoración',0,6),(68,'Horneado base naked cake',2,7),(69,'Montaje de capas con nata',1,7),(70,'Decoración con frambuesas frescas',0,7),(71,'Horneado bizcocho base',2,8),(72,'Buttercream y alisado',1,8),(73,'Drip de chocolate blanco y sprinkles',0,8),(74,'Preparación merengue y macaronage',2,9),(75,'Horneado y reposo',1,9),(76,'Relleno y maduración 24h',1,9),(77,'Preparación masa brownie',1,10),(78,'Horneado preciso y enfriado',1,10),(79,'Cortado y emplatado',0,10),(80,'Preparación base de galleta',2,11),(81,'Horneado en baño maría',2,11),(82,'Enfriado, coulis y acabado',1,11),(83,'Preparación base crujiente',2,12),(84,'Elaboración mousse de chocolate',1,12),(85,'Cobertura espejo y refrigeración',1,12),(86,'Preparación masa choux',1,13),(87,'Horneado y relleno crema pastelera',1,13),(88,'Glaseado y presentación',0,13),(89,'Preparación masa de almendra',1,14),(90,'Horneado y enfriado',1,14),(91,'Azúcar glass y acabado',0,14),(92,'Horneado bizcocho base',2,15),(93,'Mezcla con frosting y boleado',1,15),(94,'Cobertura de chocolate y decoración temática',0,15);
/*!40000 ALTER TABLE `proceso_produccion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-14 16:21:42
