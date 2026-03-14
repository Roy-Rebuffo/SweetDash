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
-- Table structure for table `stock_material`
--

DROP TABLE IF EXISTS `stock_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_material` (
  `id_stock` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `cantidad_stock` int NOT NULL DEFAULT '0',
  `stock_maximo` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_stock`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_material`
--

LOCK TABLES `stock_material` WRITE;
/*!40000 ALTER TABLE `stock_material` DISABLE KEYS */;
INSERT INTO `stock_material` VALUES (1,'Caja Tarta Grande (30cm)',50,100),(2,'Caja Tarta Mediana (24cm)',60,100),(3,'Caja Tarta Pequeña (18cm)',80,150),(4,'Caja Cupcakes (pack 6)',100,200),(5,'Caja Cupcakes (pack 12)',75,150),(6,'Base Cartón Dorada',200,300),(7,'Base Cartón Plateada',150,300),(8,'Lazo Rojo Satén',500,1000),(9,'Lazo Dorado Satén',400,1000),(10,'Cinta Decorativa Rosa',350,500),(11,'Bolsa Kraft con Ventana',300,500),(12,'Cápsula Cupcake Dorada',800,1500),(13,'Manga Pastelera Desechable',500,1000),(14,'Papel Vegetal Horno (rollo)',20,50),(15,'Etiqueta Kraft \"Hecho con amor\"',1000,2000);
/*!40000 ALTER TABLE `stock_material` ENABLE KEYS */;
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
