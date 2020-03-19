--
-- Current Database: `imageboard`
--

--
-- Host, database, usuario y contraseña por defecto
-- Cambiar si estos se modifican en back/config/db.json
--
CREATE DATABASE IF NOT EXISTS `imageboard` /*!40100 DEFAULT CHARACTER SET utf8 */;
CREATE USER 'imageboard'@'locahost' IDENTIFIED BY 'imageboard';
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
  `image_uri` varchar(120) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`banner_id`),
  KEY `board_id` (`board_id`),
  CONSTRAINT `Banners_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Bans`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Bans` (
  `ban_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `staff_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `rule_id` bigint(20) unsigned NOT NULL,
  `comment` varchar(45) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ban_id`),
  KEY `staff_id` (`staff_id`),
  KEY `post_id` (`post_id`),
  KEY `rule_id` (`rule_id`),
  CONSTRAINT `Bans_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `Staffs` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bans_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bans_ibfk_3` FOREIGN KEY (`rule_id`) REFERENCES `Rules` (`rule_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Boards`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Boards` (
  `board_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `uri` varchar(10) NOT NULL,
  `description` varchar(250) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`board_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uri` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Posts`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `Posts` (
  `post_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` bigint(20) unsigned NOT NULL,
  `text` varchar(1000) NOT NULL,
  `user` varbinary(16) NOT NULL,
  `name` varchar(10) DEFAULT NULL,
  `file_uri` varchar(120) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`post_id`),
  KEY `thread_id` (`thread_id`),
  CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `Threads` (`thread_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
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
  `duration` int(10) unsigned NOT NULL,
  `details` varchar(250) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rule_id`),
  KEY `board_id` (`board_id`),
  CONSTRAINT `Rules_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `Boards` (`board_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Default admin user, defaul password: admin
--
INSERT INTO `Staffs` (`board_id`, `name`, `password`, `admin`, `disabled`) VALUES (NULL,	'admin', '$2b$10$q.GKtwlGnVmtt/fW4ptHIuVcMIPbK7aGLh66dpJbVpS.39qSuHiLa',	1,	0);

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
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
