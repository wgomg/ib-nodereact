-- MariaDB dump 10.18  Distrib 10.5.8-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: imageboard
-- ------------------------------------------------------
-- Server version	10.5.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE `imageboard` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

CREATE USER 'imageboard'@'localhost' IDENTIFIED BY 'imageboard';
GRANT ALL PRIVILEGES ON imageboard.* TO 'imageboard'@'localhost';
FLUSH PRIVILEGES;

USE `imageboard`;

--
-- Table structure for table `Banners`
--

DROP TABLE IF EXISTS `Banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Banners` (
  `banner_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned NOT NULL,
  `file_id` bigint(20) unsigned NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`banner_id`),
  KEY `Banners_FK` (`board_id`),
  KEY `Banners_FK_1` (`file_id`),
  CONSTRAINT `Banners_FK` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Banners_FK_1` FOREIGN KEY (`file_id`) REFERENCES `Files` (`file_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Banners`
--

LOCK TABLES `Banners` WRITE;
/*!40000 ALTER TABLE `Banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `Banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Boards`
--

DROP TABLE IF EXISTS `Boards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Boards` (
  `board_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uri` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`board_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Boards`
--

LOCK TABLES `Boards` WRITE;
/*!40000 ALTER TABLE `Boards` DISABLE KEYS */;
INSERT INTO `Boards` VALUES (1,'Random','b','Random','2020-11-01 01:47:32');
INSERT INTO `Boards` VALUES (2,'Comics','c','Comics','2020-11-01 17:57:38');
/*!40000 ALTER TABLE `Boards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Files`
--

DROP TABLE IF EXISTS `Files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Files` (
  `file_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mimetype` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(164) COLLATE utf8mb4_unicode_ci NOT NULL,
  `extension` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int(10) unsigned NOT NULL,
  `dir` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Files`
--

LOCK TABLES `Files` WRITE;
/*!40000 ALTER TABLE `Files` DISABLE KEYS */;
INSERT INTO `Files` VALUES (1,'image/gif','vanished','gif',0,'public/default','2020-07-09 05:51:11');
/*!40000 ALTER TABLE `Files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Posts` (
  `post_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` bigint(20) unsigned NOT NULL,
  `text` varchar(3000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_id` bigint(20) unsigned DEFAULT NULL,
  `hasBan` tinyint(1) DEFAULT 0,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`post_id`),
  KEY `Posts_FK` (`thread_id`),
  KEY `Posts_FK_1` (`file_id`),
  CONSTRAINT `Posts_FK` FOREIGN KEY (`thread_id`) REFERENCES `Threads` (`thread_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Posts_FK_1` FOREIGN KEY (`file_id`) REFERENCES `Files` (`file_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reports`
--

DROP TABLE IF EXISTS `Reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reports` (
  `report_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `rule_id` bigint(20) unsigned NOT NULL,
  `solved` tinyint(1) NOT NULL DEFAULT 0,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`report_id`),
  KEY `Reports_FK` (`post_id`),
  KEY `Reports_FK_1` (`board_id`),
  KEY `Reports_FK_2` (`rule_id`),
  CONSTRAINT `Reports_FK` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Reports_FK_1` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Reports_FK_2` FOREIGN KEY (`rule_id`) REFERENCES `Rules` (`rule_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reports`
--

LOCK TABLES `Reports` WRITE;
/*!40000 ALTER TABLE `Reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rules`
--

DROP TABLE IF EXISTS `Rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rules` (
  `rule_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned DEFAULT NULL,
  `short_text` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ban_duration` int(10) unsigned NOT NULL DEFAULT 0,
  `apply_on` enum('post','file') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'post',
  `long_text` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rule_id`),
  KEY `Rules_FK` (`board_id`),
  CONSTRAINT `Rules_FK` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rules`
--

LOCK TABLES `Rules` WRITE;
/*!40000 ALTER TABLE `Rules` DISABLE KEYS */;
INSERT INTO `Rules` VALUES (1,NULL,'Archivo no permitido',0,'file',NULL,'2020-07-09 02:58:30');
/*!40000 ALTER TABLE `Rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Settings`
--

DROP TABLE IF EXISTS `Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Settings` (
  `setting_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `Settings_UN` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Settings`
--

LOCK TABLES `Settings` WRITE;
/*!40000 ALTER TABLE `Settings` DISABLE KEYS */;
INSERT INTO `Settings` VALUES (1,'fe_uri_format','/[board_uri]/t[thread_id]#p[post_id]','2020-11-24 22:05:32');
/*!40000 ALTER TABLE `Settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Staffs`
--

DROP TABLE IF EXISTS `Staffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Staffs` (
  `staff_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `is_disabled` tinyint(1) NOT NULL DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `Staffs_UN` (`name`),
  KEY `Staffs_FK` (`board_id`),
  CONSTRAINT `Staffs_FK` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Staffs`
--

LOCK TABLES `Staffs` WRITE;
/*!40000 ALTER TABLE `Staffs` DISABLE KEYS */;
INSERT INTO `Staffs` VALUES (1,NULL,'admin','$2b$10$q.GKtwlGnVmtt/fW4ptHIuVcMIPbK7aGLh66dpJbVpS.39qSuHiLa',1,0,NULL,'2020-10-31 22:33:33');
/*!40000 ALTER TABLE `Staffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tags` (
  `tag_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tag` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` enum('start','end','both') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'both',
  `prefix_replacer` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postfix_replacer` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `css` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `Tags_UN_1` (`tag`),
  UNIQUE KEY `Tags_UN_2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tags`
--

LOCK TABLES `Tags` WRITE;
/*!40000 ALTER TABLE `Tags` DISABLE KEYS */;
INSERT INTO `Tags` VALUES (1,'\'\'\'','bold','both','<strong>','</strong>',NULL,'2020-05-07 04:45:43');
INSERT INTO `Tags` VALUES (2,'==','scream','both','<span class=\'scream\'>','</span>','.scream { font-size: 1.25rem; color: #AF0A0F; font-weight: bold; }','2020-05-08 00:40:37');
INSERT INTO `Tags` VALUES (3,'~~','strike','both','<s>','</s>','','2020-05-09 03:31:21');
INSERT INTO `Tags` VALUES (4,'**','spoiler','both','<spoiler class=\'spoiler\'>','</spoiler>','.spoiler {\n  background: black;\n  color: black;\n  padding: 0 4px;\n  transition: color .125s ease-in-out;\n}\n\n.spoiler:hover {\n  color: white;\n}','2020-05-09 03:46:53');
INSERT INTO `Tags` VALUES (5,'__','underline','both','<u>','</u>','','2020-05-09 04:00:02');
INSERT INTO `Tags` VALUES (6,'>','greentext','start','<span class=\'greentext\'>>','</span>','span.greentext { color: var(--greentext);}','2020-11-15 23:53:53');
/*!40000 ALTER TABLE `Tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Themes`
--

DROP TABLE IF EXISTS `Themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Themes` (
  `theme_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `css` varchar(10000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creted_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`theme_id`),
  UNIQUE KEY `Themes_UN` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Themes`
--

LOCK TABLES `Themes` WRITE;
/*!40000 ALTER TABLE `Themes` DISABLE KEYS */;
INSERT INTO `Themes` VALUES (1,'default',':root {\n  --general-bg: #0d100f;\n  --general-font: #cecfcc;\n  --general-border: #4d646e;\n  --post-hashed-border: #8be2e4;\n  --card-bg: #232522;\n  --card-header-bg: #7da3b3;\n  --card-header-font: #151613;\n  --link: #8be2e4;\n  --link-visited: #436f70;\n  --link-hover: #b6e3e4;\n  --title: #a2bcc4;\n  --subtitle: #79868a;\n  --button-bg: #414340;\n  --button-font: #a7a8a6;\n  --input-bg: #373c3a;\n  --input-font: #9fafa9;\n  --admin: #ec0033;\n  --thread-title: #066606;\n  --mod: #00ec00;\n  --warning: #ec0000;\n  --separator: #484e4f;\n  --card-post-bg: #3c3d3b;\n  --muted: #658686;\n  --greentext: #b8d962;\n  --redtext: #f84747;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nhtml {\n  font-family: \'Lucida Sans\', \'Lucida Sans Regular\', \'Lucida Grande\', \'Lucida Sans Unicode\', Geneva,\n    Verdana, sans-serif;\n  font-size: 0.9rem;\n  background-color: var(--general-bg);\n  color: var(--general-font);\n  height: 100%;\n}\n\nbody {\n  position: relative;\n  min-height: 100%;\n}\n\nimg {\n  display: block;\n  cursor: pointer;\n}\n\nimg.viewimage {\n  text-align: center;\n  position: absolute;\n  margin: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\nimg.viewimage.not-visited {\n  max-width: 100vw;\n  max-height: 100vh;\n}\n\nimg.post-image {\n  border: none;\n  max-width: 100vw;\n  max-height: 100vh;\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n  margin-right: 1.5rem;\n  margin-left: 1rem;\n  float: left;\n}\n\nimg.post-image.op {\n  float: left;\n  display: block;\n}\n/*\nimg.post-image.not-visited {\n max-width: 10vw;\n max-height: 20vh;\n margin-left: 0.5rem;\n}*/\n\nimg.logo,\nimg.banner {\n  max-width: 100vw;\n  max-height: 100vh;\n}\n\nimg.logo.not-visited,\nimg.banner.not-visited {\n  max-width: 30%;\n}\n\nimg.loading {\n  width: 20px;\n  margin: auto;\n  display: block;\n}\n\ndiv.container {\n  padding: 0.5%;\n}\n\ndiv.container.quote-container {\n  padding: 0%;\n  border-color: var(--general-border);\n}\n\n.centered {\n  margin-left: auto;\n  margin-right: auto;\n}\n\ndiv.centered {\n  width: 60%;\n}\n\nimg.centered {\n  margin-left: auto;\n  margin-right: auto;\n}\n\nh1.centered,\nh2.centered,\nh3.centered,\nh4.centered,\nh5.centered,\nh6.centered,\np.centered {\n  text-align: center;\n}\n\nh1.title,\nh2.title,\nh3.title,\nh4.title,\nh5.title,\nh6.title {\n  color: var(--title);\n}\n\nh1.warning,\nh2.warning,\nh3.warning,\nh4.warning,\nh5.warning,\nh6.warning {\n  color: var(--warning);\n}\n\nh1.subtitle,\nh2.subtitle,\nh3.subtitle,\nh4.subtitle,\nh5.subtitle,\nh6.subtitle,\np.subtitle {\n  color: var(--subtitle);\n}\n\nh1.not-found {\n  color: var(--redtext);  \n  font-size: 20vw;\n}\n\ndiv.card {\n  border: 1px;\n  border-style: solid;\n  border-color: var(--general-border);\n  background-color: var(--card-bg);\n  margin-left: 1%;\n}\n\ndiv.card > .card-header {\n  background-color: var(--card-header-bg);\n  color: var(--card-header-font);\n  padding-left: 1%;\n}\n\ndiv.card-post {\n  display: inline-block;\n  margin-left: 0;\n  border-color: var(--card-post-bg);\n}\n\ndiv.card-post.hashed {\n  border-color: var(--post-hashed-border);\n}\n\ndiv.columns {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n}\n\ndiv.columns > .col {\n  flex: 1;\n}\n\ndiv.columns > .col-1 {\n  flex: 1;\n  max-width: 10%;\n}\n\ndiv.columns > .col-2 {\n  flex: 1;\n  max-width: 20%;\n}\n\ndiv.columns > .col-3 {\n  flex: 1;\n  max-width: 30%;\n}\n\ndiv.columns > .col-4 {\n  flex: 1;\n  max-width: 40%;\n}\n\ndiv.columns > .col-5 {\n  flex: 1;\n  max-width: 50%;\n}\n\ndiv.columns > .col-6 {\n  flex: 1;\n  max-width: 60%;\n}\n\ndiv.columns > .col-7 {\n  flex: 1;\n  max-width: 70%;\n}\n\ndiv.columns > .col-8 {\n  flex: 1;\n  max-width: 80%;\n}\n\ndiv.columns > .col-9 {\n  flex: 1;\n  max-width: 90%;\n}\n\ndiv.columns > .col-10 {\n  min-width: 100%;\n}\n\ndiv.col.board-list {\n  max-width: 33%;\n}\n\nul {\n  padding-left: 3%;\n}\n\nul.no-style {\n  padding-left: 2%;\n  list-style: none;\n}\n\na {\n  text-decoration: none;\n}\n\na:link,\nbutton.link {\n  color: var(--link);\n}\n\na:visited,\nbutton.link.visited {\n  color: var(--link-visited);\n}\n\na:hover,\nbutton.link:hover {\n  color: var(--link-hover);\n}\n\nbutton.hide {\n  float: left;\n  margin-right: 5px;\n  margin-left: 5px;\n}\n\nbutton.link {\n  background: none !important;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n}\n\n.form {\n  max-width: 50%;\n}\n\n.form.floatin {\nmax-width: 100%;\n}\n\n.form .form-group {\n  margin: 0.2rem 0;\n  display: block;\n}\n\n.form input[type=\'text\'],\n.form input[type=\'email\'],\n.form input[type=\'password\'],\n.form select,\n.form textarea {\n  display: block;\n  width: 100%;\n  padding: 0.2rem;\n  font-size: 1rem;\n  background-color: var(--input-bg);\n  color: var(--input-font);\n  border: none;\n}\n\n.form textarea {\n  resize: vertical;\n  white-space: pre-wrap;\n}\n\n.form input[type=\'submit\'],\nbutton {\n  font: inherit;\n}\n\n.btn {\n  display: block;\n  background-color: var(--button-bg);\n  color: var(--button-font);\n  padding: 0.4rem 1.3rem;\n  font-size: 1rem;\n  border: none;\n  cursor: pointer;\n  margin-right: 0.5rem;\n  outline: none;\n  width: 100%;\n}\n\n.btn:hover {\n  opacity: 0.8;\n}\n\nspan.new-item {\n  float: right;\n  padding-right: 1rem;\n}\n\nspan.small {\n  font-size: 0.8rem;\n}\n\nspan.admin {\n  color: var(--admin);\n}\n\nspan.mod {\n  color: var(--mod);\n}\n\nspan.muted {\n  color: var(--muted);\n}\n\nhr.separator {\n  width: 99%;\n  border-top: 1px solid var(--separator);\n  border-bottom: none;\n  display: inline-block;\n}\n\ndiv.thread-preview {\n  display: block;\n  clear: both;\n}\n\nspan.thread-title {\n  color: var(--thread-title);\n  font-weight: bold;\n  font-size: 1.1rem;\n}\n\ndiv.post-container {\n  padding-bottom: 0;\n  max-width: 80vw;\n}\n\ndiv.quote-container {\n  max-width: 50vw;\n}\n\ndiv.post-file {\n  float: none;\n}\n\ndiv.post-file.in-body {\n  margin-right: 1rem;\n}\n\ndiv.post-info {\n  display: inline-block;\n  padding-right: 1rem;\n}\n\np.file-info {\n  display: block;\n}\n\np.file-info-post {\n  display: block;\n  padding-left: 1rem;\n}\n\ndiv.post p {\n  display: block;\n}\n\ndiv.post.vanished {\n  color: var(--muted);\n}\n\ndiv.post-text {\n  padding: 1rem;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  font-size: 0.9rem;\n}\n\ndiv.op-post-text {\n  padding-right: 2rem;\n  padding-left: 1rem;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  font-size: 0.9rem;\n}\n\ndiv.footer,\ndiv.pages {\n  display: block;\n  clear: both;\n}\n\n.tooltip {\n  padding: 0 !important;\n  min-width: 10vw;\n}\n\nspan.greentext {\n  color: var(--greentext);\n}\n\nspan.redtext {\n  color: var(--redtext);\n}\n\n.react-player__preview {\n  background-size: contain !important;\n  background-repeat: no-repeat !important;\n}\n\n@media (max-width: 1600px) {\n  div.centered {\n    width: 80%;\n  }\n\n  div.columns > .col,\n  .col-1,\n  .col-2,\n  .col-3,\n  .col-4,\n  .col-5,\n  .col-6,\n  .col-7,\n  .col-8,\n  .col-9,\n  .col-10 {\n    max-width: 100%;\n    min-width: 100%;\n    margin-bottom: 2%;\n  }\n\n  img.post-image.not-visited {\n    max-width: 50vw;\n    max-height: 54vh;\n  }\n\n  img.logo.not-visited,\n  img.banner.not-visited {\n    max-width: 60%;\n  }\n\n  .form {\n    max-width: 100%;\n  }\n\n  div.post-text {\n    padding-top: 0;\n  }\n}\n','2020-05-08 05:47:17');
/*!40000 ALTER TABLE `Themes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Threads`
--

DROP TABLE IF EXISTS `Threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Threads` (
  `thread_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned NOT NULL,
  `subject` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`thread_id`),
  KEY `Threads_FK` (`board_id`),
  CONSTRAINT `Threads_FK` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Threads`
--

LOCK TABLES `Threads` WRITE;
/*!40000 ALTER TABLE `Threads` DISABLE KEYS */;
/*!40000 ALTER TABLE `Threads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'imageboard'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-24 19:07:40
