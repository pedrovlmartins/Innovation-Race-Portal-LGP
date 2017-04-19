-- MySQL dump 10.13  Distrib 5.7.14, for Win64 (x86_64)
--
-- Host: localhost    Database: irp
-- ------------------------------------------------------
-- Server version	5.7.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ideamember`
--

DROP TABLE IF EXISTS `ideamember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ideamember` (
  `idMember` int(11) NOT NULL,
  `idIdea` int(11) NOT NULL,
  PRIMARY KEY (`idMember`,`idIdea`),
  KEY `idIdea` (`idIdea`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideamember`
--

LOCK TABLES `ideamember` WRITE;
/*!40000 ALTER TABLE `ideamember` DISABLE KEYS */;
/*!40000 ALTER TABLE `ideamember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ideas`
--

DROP TABLE IF EXISTS `ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ideas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCreator` int(11) NOT NULL,
  `title` varchar(1000) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `teamName` varchar(50) DEFAULT NULL,
  `approved` bit(1) DEFAULT b'0',
  `disapproveReason` varchar(1000) DEFAULT NULL,
  `potential` varchar(1000) DEFAULT NULL,
  `score` int(11) DEFAULT '0',
  `state` int(11) DEFAULT '0',
  `cancelled` bit(1) DEFAULT b'0',
  `offerType` int(11) DEFAULT NULL,
  `market` varchar(1000) DEFAULT NULL,
  `technicalViability` varchar(1000) DEFAULT NULL,
  `economicalViability` varchar(1000) DEFAULT NULL,
  `riskFactors` varchar(1000) DEFAULT NULL,
  `uncertaintyToSolve` varchar(1000) NOT NULL,
  `solutionTechnicalCompetence` varchar(1000) NOT NULL,
  `techHumanResources` varchar(1000) NOT NULL,
  `resultsToProduce` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCreator` (`idCreator`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas`
--

LOCK TABLES `ideas` WRITE;
/*!40000 ALTER TABLE `ideas` DISABLE KEYS */;
/*!40000 ALTER TABLE `ideas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(254) NOT NULL,
  `name` varchar(200) NOT NULL,
  `passwordHash` varchar(1000) NOT NULL,
  `type` int(11) NOT NULL,
  `registrationTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accountStatus` int(11) NOT NULL DEFAULT '0',
  `passwordReminderExpire` timestamp NULL DEFAULT NULL,
  `businessField` varchar(200) DEFAULT NULL,
  `colaboratorNum` int(11) DEFAULT NULL,
  `manager` varchar(200) DEFAULT NULL,
  `role` varchar(200) DEFAULT NULL,
  `company` varchar(200) DEFAULT NULL,
  `referral` varchar(200) DEFAULT NULL,
  `emailConfirmationToken` varchar(1000) DEFAULT NULL,
  `passwordReminderToken` varchar(1000) DEFAULT NULL,
  `filiation` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_emailConfirmationToken_uindex` (`emailConfirmationToken`),
  UNIQUE KEY `users_passwordReminderToken_uindex` (`passwordReminderToken`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'silva95gustavo@gmail.com','Gustavo Rocha da Silva','pbkdf2$10000$5c45f92a5dc28565ccdbeb106aaa04caf82ce7473e47c9ea868ed96f40b0af368911819acf777ceb4f181536c44484effce2eecc1a792ba879df7b552d7899a5$1ea6b51ac822b41649ac5b5df475926658a9c82f90d3448e563be41793ae41226f826d2be43454b9236df04d34f29e0dbb763579924120bfbf3596593d54c848',0,'2017-04-19 07:55:04',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-19  9:23:56
