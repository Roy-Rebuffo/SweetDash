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
-- Table structure for table `material_pedido`
--

DROP TABLE IF EXISTS `material_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_pedido` (
  `id_material_pedido` int NOT NULL AUTO_INCREMENT,
  `cantidad_necesaria` int NOT NULL,
  `precio_venta` decimal(8,2) DEFAULT NULL,
  `id_stock` int NOT NULL,
  `id_pedido` int NOT NULL,
  PRIMARY KEY (`id_material_pedido`),
  KEY `fk_matped_stock_idx` (`id_stock`),
  KEY `fk_matped_pedido_idx` (`id_pedido`),
  CONSTRAINT `fk_matped_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `fk_matped_stock` FOREIGN KEY (`id_stock`) REFERENCES `stock_material` (`id_stock`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_pedido`
--

LOCK TABLES `material_pedido` WRITE;
/*!40000 ALTER TABLE `material_pedido` DISABLE KEYS */;
INSERT INTO `material_pedido` VALUES (1,1,0.00,1,1),(2,1,0.00,6,1),(3,1,0.00,4,2),(4,1,0.00,8,2),(5,1,0.00,1,3),(6,1,0.00,6,3),(7,1,0.00,1,4),(8,1,0.00,9,4),(9,1,0.00,4,5),(10,1,0.00,1,6),(11,1,0.00,9,6),(12,1,0.00,7,7),(13,1,0.00,1,8),(14,1,0.00,6,8),(15,1,0.00,5,9);
/*!40000 ALTER TABLE `material_pedido` ENABLE KEYS */;
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
