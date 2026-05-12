-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: bd_sweetdash
-- ------------------------------------------------------
-- Server version	8.0.45

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
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proceso_produccion`
--

LOCK TABLES `proceso_produccion` WRITE;
/*!40000 ALTER TABLE `proceso_produccion` DISABLE KEYS */;
INSERT INTO `proceso_produccion` VALUES (36,'Prueba 1',3,5),(37,'Prueba 2',2,5),(38,'Prueba 3',1,5),(39,'Prueba 1',4,6),(40,'Prueba 2',3,6),(41,'Prueba 3',2,6),(42,'Prueba 4',1,6),(43,'Prueba1',3,7),(44,'Prueba2',2,7),(45,'Prueba3',1,7),(46,'Prueba',3,8),(47,'Prueba',2,8),(48,'Prueba',1,8),(49,'Prueba33',2,9),(50,'Prueba22',1,9),(51,'sapepepepe',12,10),(52,'Prueba1',3,11),(53,'Prueba2',2,11),(54,'Prueba',3,12),(55,'Prueba2',2,12),(56,'Prueba3',1,12),(57,'Prueba1',3,13),(58,'Prueba2',2,13),(59,'Prueba1',3,14),(60,'Prueba2',2,14),(61,'Prueba3',1,14),(80,'22',3,15),(81,'33',2,15),(82,'Prueba22',1,15),(83,'22',3,18),(84,'33',2,18),(85,'Prueba22',1,18),(86,'11',3,16),(87,'12',2,16),(88,'Prueba10',1,16),(89,'11',3,17),(90,'12',2,17),(91,'Prueba10',1,17),(161,'Pruebaaaa11',3,19),(162,'Pruebaaaa22',2,19),(163,'Pruebaaaa33',1,19),(167,'algo mas',3,20),(168,'otra cosita',2,20),(169,'sape',1,20),(179,'algo menos',3,25),(180,'otra cositaaaa',2,25),(181,'sapeeee',1,25);
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

-- Dump completed on 2026-05-12 19:01:58
