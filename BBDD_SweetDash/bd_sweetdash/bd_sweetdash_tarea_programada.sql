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
-- Table structure for table `tarea_programada`
--

DROP TABLE IF EXISTS `tarea_programada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarea_programada` (
  `id_tarea` int NOT NULL AUTO_INCREMENT,
  `fecha_ejecucion` date NOT NULL,
  `estado` enum('Pendiente','En proceso','Completada') NOT NULL DEFAULT 'Pendiente',
  `id_pedido` int NOT NULL,
  `id_proceso` int NOT NULL,
  PRIMARY KEY (`id_tarea`),
  KEY `fk_tarea_pedido_idx` (`id_pedido`),
  KEY `fk_tarea_proceso_idx` (`id_proceso`),
  CONSTRAINT `fk_tarea_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `fk_tarea_proceso` FOREIGN KEY (`id_proceso`) REFERENCES `proceso_produccion` (`id_proceso`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarea_programada`
--

LOCK TABLES `tarea_programada` WRITE;
/*!40000 ALTER TABLE `tarea_programada` DISABLE KEYS */;
INSERT INTO `tarea_programada` VALUES (1,'2026-02-12','Completada',1,1),(2,'2026-02-13','Completada',1,2),(3,'2026-02-14','Completada',1,3),(4,'2026-03-10','Completada',6,8),(5,'2026-03-11','Completada',6,9),(6,'2026-03-13','Completada',9,5),(7,'2026-03-14','En proceso',9,6),(8,'2026-03-15','Pendiente',9,7),(9,'2026-03-12','Completada',11,14),(10,'2026-03-13','Completada',11,15),(11,'2026-03-14','En proceso',11,3),(12,'2026-03-18','Pendiente',12,1),(13,'2026-03-19','Pendiente',12,2),(14,'2026-03-20','Pendiente',12,3),(15,'2026-04-17','Pendiente',15,10);
/*!40000 ALTER TABLE `tarea_programada` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-14 16:21:43
