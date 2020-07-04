-- MariaDB dump 10.17  Distrib 10.4.13-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: imageboard
-- ------------------------------------------------------
-- Server version	10.4.13-MariaDB

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

--
-- Current Database: `imageboard`
--

--
-- Host, database, usuario y contraseña por defecto
-- Cambiar si estos se modifican en back/config/db.json
--
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `imageboard` /*!40100 DEFAULT CHARACTER SET utf8 */;
CREATE USER 'imageboard'@'localhost' IDENTIFIED BY 'imageboard';
GRANT ALL PRIVILEGES ON imageboard.* TO 'imageboard'@'localhost';
FLUSH PRIVILEGES;

USE `imageboard`;

--
-- Table structure for table `Banners`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Banners` (
  `banner_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned DEFAULT NULL,
  `file_id` bigint(20) unsigned NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`banner_id`),
  KEY `board_id` (`board_id`),
  KEY `file_id` (`file_id`),
  CONSTRAINT `Banners_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Banners_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `Files` (`file_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Bans`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Bans` (
  `ban_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `staff_id` bigint(20) unsigned NOT NULL,
  `report_id` bigint(20) unsigned NOT NULL,
  `ipaddress` int(10) unsigned NOT NULL,
  `fingerprint` char(32) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ban_id`),
  KEY `staff_id` (`staff_id`),
  KEY `report_id` (`report_id`),
  CONSTRAINT `Bans_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `Staffs` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bans_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `Reports` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Boards`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Boards` (
  `board_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `uri` varchar(4) NOT NULL,
  `description` varchar(250) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`board_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uri` (`uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Files`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Files` (
  `file_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mimetype` varchar(45) NOT NULL,
  `name` varchar(50) NOT NULL,
  `extension` varchar(4) NOT NULL,
  `size` int(10) unsigned NOT NULL,
  `folder` varchar(20) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Posts`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Posts` (
  `post_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` bigint(20) unsigned NOT NULL,
  `text` varchar(3000) NOT NULL,
  `name` varchar(10) DEFAULT NULL,
  `file_id` bigint(20) unsigned DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`post_id`),
  KEY `thread_id` (`thread_id`),
  KEY `file_id` (`file_id`),
  CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `Threads` (`thread_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Posts_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `Files` (`file_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Reports`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Reports` (
  `report_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL,
  `rule_id` bigint(20) unsigned NOT NULL,
  `solved` tinyint(2) NOT NULL DEFAULT 0,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`report_id`),
  KEY `post_id` (`post_id`),
  KEY `rule_id` (`rule_id`),
  CONSTRAINT `Reports_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Reports_ibfk_2` FOREIGN KEY (`rule_id`) REFERENCES `Rules` (`rule_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Rules`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Rules` (
  `rule_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned DEFAULT NULL,
  `text` varchar(45) NOT NULL,
  `ban_duration` int(10) unsigned DEFAULT 0,
  `details` varchar(250) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rule_id`),
  KEY `board_id` (`board_id`),
  CONSTRAINT `Rules_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Staffs`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Staffs` (
  `staff_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(15) NOT NULL,
  `password` char(100) NOT NULL,
  `admin` tinyint(2) NOT NULL DEFAULT 0,
  `disabled` tinyint(2) NOT NULL DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `name` (`name`),
  KEY `board_id` (`board_id`),
  CONSTRAINT `Staffs_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tags`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Tags` (
  `tag_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tag` varchar(3) NOT NULL,
  `name` varchar(10) NOT NULL,
  `op_replacer` varchar(50) NOT NULL,
  `cl_replacer` varchar(50) NOT NULL,
  `css` varchar(250) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Themes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Themes` (
  `theme_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `css` varchar(10000) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`theme_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Threads`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Threads` (
  `thread_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) unsigned NOT NULL,
  `subject` varchar(45) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`thread_id`),
  KEY `board_id` (`board_id`),
  CONSTRAINT `Threads_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-14 20:20:30

--
--
-- Default administrator account admin:admin
--
INSERT INTO `Staffs` (`board_id`, `name`, `password`, `admin`, `disabled`) VALUES (NULL, 'admin', '$2b$10$q.GKtwlGnVmtt/fW4ptHIuVcMIPbK7aGLh66dpJbVpS.39qSuHiLa', 1, 0);

-- MariaDB dump 10.17  Distrib 10.4.13-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: imageboard
-- ------------------------------------------------------
-- Server version	10.4.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `Themes`
--
-- WHERE:  theme_id=1

LOCK TABLES `Themes` WRITE;
/*!40000 ALTER TABLE `Themes` DISABLE KEYS */;
INSERT INTO `Themes` VALUES (1,'default',':root {\r\n  --general-bg: #0d100f;\r\n  --general-font: #cecfcc;\r\n  --general-border: #4d646e;\r\n  --post-hashed-border: #8be2e4;\r\n  --card-bg: #232522;\r\n  --card-header-bg: #7da3b3;\r\n  --card-header-font: #151613;\r\n  --link: #8be2e4;\r\n  --link-visited: #436f70;\r\n  --link-hover: #b6e3e4;\r\n  --title: #a2bcc4;\r\n  --subtitle: #79868a;\r\n  --button-bg: #414340;\r\n  --button-font: #a7a8a6;\r\n  --input-bg: #373c3a;\r\n  --input-font: #9fafa9;\r\n  --admin: #ec0033;\r\n  --thread-title: #066606;\r\n  --mod: #00ec00;\r\n  --warning: #ec0000;\r\n  --separator: #484e4f;\r\n  --card-post-bg: #3c3d3b;\r\n  --muted: #658686;\r\n  --greentext: #b8d962;\r\n  --redtext: #f84747;\r\n}\r\n\r\n* {\r\n  box-sizing: border-box;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\nhtml {\r\n  font-family: \'Lucida Sans\', \'Lucida Sans Regular\', \'Lucida Grande\', \'Lucida Sans Unicode\', Geneva,\r\n    Verdana, sans-serif;\r\n  font-size: 0.9rem;\r\n  background-color: var(--general-bg);\r\n  color: var(--general-font);\r\n  height: 100%;\r\n}\r\n\r\nbody {\r\n  position: relative;\r\n  min-height: 100%;\r\n}\r\n\r\nimg {\r\n  display: block;\r\n  cursor: pointer;\r\n}\r\n\r\nimg.viewimage {\r\n  text-align: center;\r\n  position: absolute;\r\n  margin: auto;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n}\r\n\r\nimg.viewimage.not-visited {\r\n  max-width: 100vw;\r\n  max-height: 100vh;\r\n}\r\n\r\nimg.post-image {\r\n  border: none;\r\n  max-width: 100vw;\r\n  max-height: 100vh;\r\n  margin-top: 0.5rem;\r\n  margin-bottom: 0.5rem;\r\n  margin-right: 1.5rem;\r\n  margin-left: 1rem;\r\n  float: left;\r\n}\r\n\r\nimg.post-image.op {\r\n  float: left;\r\n  display: block;\r\n}\r\n/*\r\nimg.post-image.not-visited {\r\n max-width: 10vw;\r\n max-height: 20vh;\r\n margin-left: 0.5rem;\r\n}*/\r\n\r\nimg.logo,\r\nimg.banner {\r\n  max-width: 100vw;\r\n  max-height: 100vh;\r\n}\r\n\r\nimg.logo.not-visited,\r\nimg.banner.not-visited {\r\n  max-width: 30%;\r\n}\r\n\r\nimg.loading {\r\n  width: 20px;\r\n  margin: auto;\r\n  display: block;\r\n}\r\n\r\ndiv.container {\r\n  padding: 0.5%;\r\n}\r\n\r\ndiv.container.quote-container {\r\n  padding: 0%;\r\n}\r\n\r\n.centered {\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n\r\ndiv.centered {\r\n  width: 60%;\r\n}\r\n\r\nimg.centered {\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n\r\nh1.centered,\r\nh2.centered,\r\nh3.centered,\r\nh4.centered,\r\nh5.centered,\r\nh6.centered,\r\np.centered {\r\n  text-align: center;\r\n}\r\n\r\nh1.title,\r\nh2.title,\r\nh3.title,\r\nh4.title,\r\nh5.title,\r\nh6.title {\r\n  color: var(--title);\r\n}\r\n\r\nh1.warning,\r\nh2.warning,\r\nh3.warning,\r\nh4.warning,\r\nh5.warning,\r\nh6.warning {\r\n  color: var(--warning);\r\n}\r\n\r\nh1.subtitle,\r\nh2.subtitle,\r\nh3.subtitle,\r\nh4.subtitle,\r\nh5.subtitle,\r\nh6.subtitle,\r\np.subtitle {\r\n  color: var(--subtitle);\r\n}\r\n\r\nh1.not-found {\r\n  color: var(--redtext);  \r\n  font-size: 20vw;\r\n}\r\n\r\ndiv.card {\r\n  border: 1px;\r\n  border-style: solid;\r\n  border-color: var(--general-border);\r\n  background-color: var(--card-bg);\r\n  margin-left: 1%;\r\n}\r\n\r\ndiv.card > .card-header {\r\n  background-color: var(--card-header-bg);\r\n  color: var(--card-header-font);\r\n  padding-left: 1%;\r\n}\r\n\r\ndiv.card-post {\r\n  display: inline-block;\r\n  margin-left: 0;\r\n  border-color: var(--card-post-bg);\r\n}\r\n\r\ndiv.card-post.hashed {\r\n  border-color: var(--post-hashed-border);\r\n}\r\n\r\ndiv.columns {\r\n  display: flex;\r\n  flex-direction: row;\r\n  flex-wrap: wrap;\r\n}\r\n\r\ndiv.columns > .col {\r\n  flex: 1;\r\n}\r\n\r\ndiv.columns > .col-1 {\r\n  flex: 1;\r\n  max-width: 10%;\r\n}\r\n\r\ndiv.columns > .col-2 {\r\n  flex: 1;\r\n  max-width: 20%;\r\n}\r\n\r\ndiv.columns > .col-3 {\r\n  flex: 1;\r\n  max-width: 30%;\r\n}\r\n\r\ndiv.columns > .col-4 {\r\n  flex: 1;\r\n  max-width: 40%;\r\n}\r\n\r\ndiv.columns > .col-5 {\r\n  flex: 1;\r\n  max-width: 50%;\r\n}\r\n\r\ndiv.columns > .col-6 {\r\n  flex: 1;\r\n  max-width: 60%;\r\n}\r\n\r\ndiv.columns > .col-7 {\r\n  flex: 1;\r\n  max-width: 70%;\r\n}\r\n\r\ndiv.columns > .col-8 {\r\n  flex: 1;\r\n  max-width: 80%;\r\n}\r\n\r\ndiv.columns > .col-9 {\r\n  flex: 1;\r\n  max-width: 90%;\r\n}\r\n\r\ndiv.columns > .col-10 {\r\n  min-width: 100%;\r\n}\r\n\r\ndiv.col.board-list {\r\n  max-width: 33%;\r\n}\r\n\r\nul {\r\n  padding-left: 3%;\r\n}\r\n\r\nul.no-style {\r\n  padding-left: 2%;\r\n  list-style: none;\r\n}\r\n\r\na {\r\n  text-decoration: none;\r\n}\r\n\r\na:link,\r\nbutton.link {\r\n  color: var(--link);\r\n}\r\n\r\na:visited,\r\nbutton.link.visited {\r\n  color: var(--link-visited);\r\n}\r\n\r\na:hover,\r\nbutton.link:hover {\r\n  color: var(--link-hover);\r\n}\r\n\r\nbutton.hide {\r\n  float: left;\r\n  margin-right: 5px;\r\n  margin-left: 5px;\r\n}\r\n\r\nbutton.link {\r\n  background: none !important;\r\n  border: none;\r\n  padding: 0;\r\n  cursor: pointer;\r\n}\r\n\r\n.form {\r\n  max-width: 50%;\r\n}\r\n\r\n.form.floatin {\r\nmax-width: 100%;\r\n}\r\n\r\n.form .form-group {\r\n  margin: 0.2rem 0;\r\n  display: block;\r\n}\r\n\r\n.form input[type=\'text\'],\r\n.form input[type=\'email\'],\r\n.form input[type=\'password\'],\r\n.form select,\r\n.form textarea {\r\n  display: block;\r\n  width: 100%;\r\n  padding: 0.2rem;\r\n  font-size: 1rem;\r\n  background-color: var(--input-bg);\r\n  color: var(--input-font);\r\n  border: none;\r\n}\r\n\r\n.form textarea {\r\n  resize: vertical;\r\n  white-space: pre-wrap;\r\n}\r\n\r\n.form input[type=\'submit\'],\r\nbutton {\r\n  font: inherit;\r\n}\r\n\r\n.btn {\r\n  display: block;\r\n  background-color: var(--button-bg);\r\n  color: var(--button-font);\r\n  padding: 0.4rem 1.3rem;\r\n  font-size: 1rem;\r\n  border: none;\r\n  cursor: pointer;\r\n  margin-right: 0.5rem;\r\n  outline: none;\r\n  width: 100%;\r\n}\r\n\r\n.btn:hover {\r\n  opacity: 0.8;\r\n}\r\n\r\nspan.new-item {\r\n  float: right;\r\n  padding-right: 1rem;\r\n}\r\n\r\nspan.small {\r\n  font-size: 0.8rem;\r\n}\r\n\r\nspan.admin {\r\n  color: var(--admin);\r\n}\r\n\r\nspan.mod {\r\n  color: var(--mod);\r\n}\r\n\r\nspan.muted {\r\n  color: var(--muted);\r\n}\r\n\r\nhr.separator {\r\n  width: 99%;\r\n  border-top: 1px solid var(--separator);\r\n  border-bottom: none;\r\n  display: inline-block;\r\n}\r\n\r\ndiv.thread-preview {\r\n  display: block;\r\n  clear: both;\r\n}\r\n\r\nspan.thread-title {\r\n  color: var(--thread-title);\r\n  font-weight: bold;\r\n  font-size: 1.1rem;\r\n}\r\n\r\ndiv.post-container {\r\n  padding-bottom: 0;\r\n  max-width: 80vw;\r\n}\r\n\r\ndiv.quote-container {\r\n  max-width: 50vw;\r\n}\r\n\r\ndiv.post-file {\r\n  float: none;\r\n}\r\n\r\ndiv.post-file.in-body {\r\n  margin-right: 1rem;\r\n}\r\n\r\ndiv.post-info {\r\n  display: inline-block;\r\n  padding-right: 1rem;\r\n}\r\n\r\np.file-info {\r\n  display: block;\r\n}\r\n\r\np.file-info-post {\r\n  display: block;\r\n  padding-left: 1rem;\r\n}\r\n\r\ndiv.post p {\r\n  display: block;\r\n}\r\n\r\ndiv.post-text {\r\n  padding: 1rem;\r\n  word-wrap: break-word;\r\n  white-space: pre-wrap;\r\n  font-size: 0.9rem;\r\n}\r\n\r\ndiv.op-post-text {\r\n  padding-right: 2rem;\r\n  padding-left: 1rem;\r\n  word-wrap: break-word;\r\n  white-space: pre-wrap;\r\n  font-size: 0.9rem;\r\n}\r\n\r\ndiv.footer,\r\ndiv.pages {\r\n  display: block;\r\n  clear: both;\r\n}\r\n\r\n.tooltip {\r\n  padding: 0 !important;\r\n  min-width: 10vw;\r\n}\r\n\r\nspan.greentext {\r\n  color: var(--greentext);\r\n}\r\n\r\nspan.redtext {\r\n  color: var(--redtext);\r\n}\r\n\r\n.react-player__preview {\r\n  background-size: contain !important;\r\n  background-repeat: no-repeat !important;\r\n}\r\n\r\n@media (max-width: 700px) {\r\n  div.centered {\r\n    width: 80%;\r\n  }\r\n\r\n  div.columns > .col,\r\n  .col-1,\r\n  .col-2,\r\n  .col-3,\r\n  .col-4,\r\n  .col-5,\r\n  .col-6,\r\n  .col-7,\r\n  .col-8,\r\n  .col-9,\r\n  .col-10 {\r\n    max-width: 100%;\r\n    min-width: 100%;\r\n    margin-bottom: 2%;\r\n  }\r\n\r\n  img.post-image.not-visited {\r\n    max-width: 50vw;\r\n    max-height: 54vh;\r\n  }\r\n\r\n  img.logo.not-visited,\r\n  img.banner.not-visited {\r\n    max-width: 60%;\r\n  }\r\n\r\n  .form {\r\n    max-width: 100%;\r\n  }\r\n\r\n  div.post-text {\r\n    padding-top: 0;\r\n  }\r\n}\r\n','2020-05-08 01:47:17');
/*!40000 ALTER TABLE `Themes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-14 20:20:32
