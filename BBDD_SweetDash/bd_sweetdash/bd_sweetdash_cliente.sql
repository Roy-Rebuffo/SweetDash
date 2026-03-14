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
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `notas` text,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Ana','García López','600111222','ana.garcia@gmail.com','Calle Mayor 10, Madrid','Cliente habitual, alérgica a las nueces'),(2,'Carlos','Sánchez Miró','600333444','carlos.sanchez@hotmail.com','Av. de la Ilustración 45, Madrid','Prefiere entregas por la tarde'),(3,'Lucía','Fernández Dias','600555666','lucia.fdz@yahoo.es','Plaza de España 3, Piso 4B',NULL),(4,'María','Rodríguez Vega','601100200','maria.rodriguez@gmail.com','Calle Alcalá 88, Madrid','Alérgica al gluten, siempre pide sin'),(5,'Pablo','Martínez Ruano','601200300','pablo.martinez@outlook.com','Calle Serrano 22, Madrid','Prefiere recogida en tienda'),(6,'Sofía','López Herrera','601300400','sofia.lopez@gmail.com','Av. Constitución 5, Alcobendas',NULL),(7,'Javier','Torres Almansa','601400500','javier.torres@icloud.com','Calle Pez 11, Madrid','Paga siempre por transferencia'),(8,'Elena','Díaz Fuentes','601500600','elena.diaz@hotmail.com','Paseo Castellana 200, Madrid','Clienta VIP, descuento 10%'),(9,'Miguel','Romero Castillo','601600700','miguel.romero@gmail.com','Calle Luna 3, Getafe',NULL),(10,'Laura','Jiménez Peral','601700800','laura.jimenez@yahoo.es','Calle del Carmen 14, Madrid','Intolerante a la lactosa'),(11,'Sergio','Moreno Blanco','601800900','sergio.moreno@gmail.com','Calle Velázquez 9, Madrid','Solo contactar por WhatsApp'),(12,'Isabel','Ruiz Montoya','601900100','isabel.ruiz@outlook.com','Av. América 17, Madrid',NULL),(13,'Carmen','Vázquez Iglesias','602100300','carmen.vazquez@hotmail.com','Calle Bravo Murillo 101, Madrid','Alérgica al huevo'),(14,'Fernando','Gil Medina','602400600','fernando.gil@gmail.com','Av. Vallecas 33, Madrid',NULL),(15,'Natalia','Serrano Campos','602500700','natalia.serrano@yahoo.es','Calle Gran Vía 48, Madrid','Clienta nueva, referida por Ana García');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
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
