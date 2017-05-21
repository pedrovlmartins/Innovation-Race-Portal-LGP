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
      `race` int(11) DEFAULT NULL,
      `title` varchar(1000) NOT NULL,
      `description` varchar(1000) NOT NULL,
      `teamName` varchar(50) DEFAULT NULL,
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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas`
--

LOCK TABLES `ideas` WRITE;
/*!40000 ALTER TABLE `ideas` DISABLE KEYS */;
INSERT INTO `ideas` VALUES
(1,4,1,'Idea #1',NULL,NULL,NULL,0,1,'\0', NULL, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(2,4,1,'Idea #2',NULL,NULL,NULL,0,6,'\0', NULL, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(3,4,1,'Idea #3',NULL,NULL,NULL,0,2,'\0', NULL, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(4,4,1,'Idea #4',NULL,NULL,NULL,0,3,'\0', NULL, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(5,4,1,'Idea #5',NULL,NULL,NULL,0,4,'\0', NULL, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(6,4,1,'Idea #6',NULL,NULL,NULL,0,6,'\0', NULL, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL);
UNLOCK TABLES;

--
-- Table structure for table `races`
--

DROP TABLE IF EXISTS `races`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `races` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(1000) NOT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `phase1Start` timestamp NOT NULL,
  `phase2Start` timestamp NOT NULL,
  `phase3Start` timestamp NOT NULL,
  `phase4Start` timestamp NOT NULL,
  `phase4End` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `BMC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BMC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ideaID` int(11) DEFAULT NULL,
  `keyPartners` varchar(1000) DEFAULT NULL,
  `keyActivities` varchar(1000) DEFAULT NULL,
  `keyResources` varchar(1000) DEFAULT NULL,
  `valuePropositions` varchar(1000) DEFAULT NULL,
  `costumerRelationships` varchar(1000) DEFAULT NULL,
  `costumerSegments` varchar(1000) DEFAULT NULL,
  `channels` varchar(1000) DEFAULT NULL,
  `costStructure` varchar(1000) DEFAULT NULL,
  `revenueStreams` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `races`
--
LOCK TABLES `races` WRITE;
/*!40000 ALTER TABLE `races` DISABLE KEYS */;
/*!40000 ALTER TABLE `races` ENABLE KEYS */;
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
  `blocked` bit(1) NOT NULL default 0,
  `confirmed` bit(1) NOT NULL default 0,
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
  UNIQUE KEY `users_passwordReminderToken_uindex` (`passwordReminderToken`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'silva95gustavo@gmail.com','Gustavo Rocha da Silva','pbkdf2$10000$78b8b70a4d7b4a84640224cfff1497dbcb7be9a729baf1266a939ff03b119957a37db78eca47e276ded1e913a818cb3dd751e3456d7e09b09ce4e58c49711a21$b28358ee5638f96b1d269d3a8284dc68663ad8bdbe9408fb3fb85de9161254658a731dc02cd44fdbbf94b118a5484df9c898e25759c12661aff5071bf1457f92',4,0,0,'2017-04-19 21:12:30',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL),
                            (2,'member1@altran.musaic.ml','Altran Member #1','pbkdf2$10000$81a2045ab812723acfe486c66dbbf5ac1e2248bddf49c3f9573e9ed770be6b26c559213adfb3dd5750c07c24ebadcf4e45fc1cda54a284dd91ccecd46ab71d98$7ef970efaa302a28a0e9bbb9efb2d0235b76bdf28566b3d8d3e31fd42065a8f8a80094a9857276d4996ab550c1e7a63be82cfcd1dc1f7844af9ed674b0ccea69',1,0,0,'2017-04-25 21:10:02',1,NULL,NULL,NULL,1,'',NULL,NULL,NULL,NULL,NULL),
                            (3,'partner1@altran.musaic.ml','Partner #1','pbkdf2$10000$cb7c33bf0d3ccad2aee60a664e751695cde060c81363d4eea91dc0bedce100623a7e0f1dfd7586183cb550a8ce7fc767876fc090aabdc3e987107c1343516028$d0775c7e6b0365b2c3d51adf51420e3d2b15d464e2546d336f38624dc69a1bfa091fe892d4ec338c9a3500f2cd61328023495f9e7f789d1f4dec7e47bf641d13',2,0,0,'2017-04-25 21:10:40',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL),
                            (4,'client1@altran.musaic.ml','Client #1','pbkdf2$10000$aecc5a3b1a687210195f2b446bee7d59b639707605743fe2694000bab2b96b7813838160c7fce39ccde69141abb173464d428ea7dc1c21ce4e074dff7acc47e7$4ec6beee94a18592c5065c88e63aade6e19e40b5e30c158d2e7df977e3e51527bf2db2a63eb411ad766eba476e6b7d46a82c05b4891ff5aadd2b75359072e7b8',3,0,0,'2017-04-25 21:15:32',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL),
                            (5,'manager1@altran.musaic.ml','Manager 1','pbkdf2$10000$e02aa33e43023ef930a2c6abf53028fc4a5d0992b3334d08a1aea8811e2843a2cda01f1ab17681036f1295ed4440535822471ac50136d8ade196e8983dbb2d91$309d801dfcc01c6af3f9c003b7478658a1fd57ebf58cab1d2ec513478240767da39b5f55a69a10c15e960bc4283fd584a8d6e7e8bb0ff244807c510b71825902',4,0,0,'2017-04-25 21:16:39',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL),
                            (6,'committee1@altran.musaic.ml','Committee #1','pbkdf2$10000$58924201568d2f052ad305cadf51436e58ff627adff8085ac720e6aa7cdb3dca74fe35bbcd99e415a0830daeefd64c1a266821d34f8d684002d7ad42340a39a5$83ccc5402d15da8ef139f1980aa970d47eb4872ca80952d962b20b1c6bbfffb5d99b3a3d38421703e8d3e0a2df067471faca09a72edcf2b9be193e289322f8b2',5,0,0,'2017-04-25 21:17:30',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL),
                            (7,'team1@altran.musaic.ml','Team #1','pbkdf2$10000$5c6fafc3f943d0b77eb50189268fcbc42694c602466716be0871da2546e89c1eac03ec3bfe2141ce1cc59e2e3a691ac37f1bbdef0ba9600f4173a02901d93660$f11c1e5c2c70a811450849b575b28c138c3feffeb583d9e617010e2de7e6f6742421b0328a42427a48ec09ed11a23d788b728cdbbbb60ba5792464c264f7eccb',6,0,0,'2017-04-25 21:18:36',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL),
                            (8,'technicaldirector1@altran.musaic.ml','Technical Director #1','pbkdf2$10000$a2ab068d60717ce33a00335d52e19d58a44a3f03f1d110f9a7ff57f783e55994e4dbf18ae35b70639bc9f27d55213eb1b626ed9da47fbab849b833292ac8513d$d8873d2002f5d7dfd1ecddc02b3382d78d8148206c50ace117e0f4e9c6adb23af5ddbb656b0017dc670e294a28ddba00e060cfce11b580ea72712e229462d5e9',7,0,0,'2017-04-25 21:26:59',1,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
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

-- Dump completed on 2017-04-25 22:43:58

DROP TABLE IF EXISTS `irp`.`drafts`;
CREATE TABLE `irp`.`drafts` (
  `user_id` INT NOT NULL,
  `title` VARCHAR(45) NULL,
  `description` VARCHAR(1000) NULL,
  `teamIdeas` VARCHAR(1000) NULL,
  `teammembers` VARCHAR(1000) NULL,
  `uncertaintyToSolve` VARCHAR(1000) NULL,
  `solutionTechnicalCompetence` VARCHAR(1000) NULL,
  `techHumanResources` VARCHAR(1000) NULL,
  `results` VARCHAR(1000) NULL,
  PRIMARY KEY (`user_id`));
