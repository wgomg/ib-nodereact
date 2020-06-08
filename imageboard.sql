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
  `post_id` bigint(20) unsigned NOT NULL,
  `rule_id` bigint(20) unsigned NOT NULL,
  `user` int(10) unsigned NOT NULL,
  `comment` varchar(45) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ban_id`),
  KEY `staff_id` (`staff_id`),
  KEY `post_id` (`post_id`),
  KEY `rule_id` (`rule_id`),
  CONSTRAINT `Bans_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `Staffs` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bans_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bans_ibfk_3` FOREIGN KEY (`rule_id`) REFERENCES `Rules` (`rule_id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `duration` int(10) unsigned DEFAULT 0,
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
-- Default admin user, defaul password: admin
--
INSERT INTO `Staffs` (`board_id`, `name`, `password`, `admin`, `disabled`) VALUES (NULL,	'admin', '$2b$10$q.GKtwlGnVmtt/fW4ptHIuVcMIPbK7aGLh66dpJbVpS.39qSuHiLa',	1,	0);
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
-- Default Theme
--
INSERT INTO `Themes` (`theme_id`, `name`, `css`) VALUES
(1,	'default',	':root{--general-bg:#0d100f;--general-font:#cecfcc;--general-border:#4d646e;--post-hashed-border:#8be2e4;--card-bg:#232522;--card-header-bg:#7da3b3;--card-header-font:#151613;--link:#8be2e4;--link-visited:#436f70;--link-hover:#b6e3e4;--title:#a2bcc4;--subtitle:#79868a;--button-bg:#414340;--button-font:#a7a8a6;--input-bg:#373c3a;--input-font:#9fafa9;--admin:#ec0033;--thread-title:#066606;--mod:#00ec00;--warning:#ec0000;--separator:#484e4f;--card-post-bg:#3c3d3b;--muted:#658686;--greentext:#b8d962;--redtext:#f84747}*{box-sizing:border-box;margin:0;padding:0}html{font-family:'Lucida Sans','Lucida Sans Regular','Lucida Grande','Lucida Sans Unicode',Geneva,Verdana,sans-serif;font-size:.9rem;background-color:var(--general-bg);color:var(--general-font);height:100%}body{position:relative;min-height:100%}img{display:block;cursor:pointer}img.viewimage{text-align:center;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0}img.viewimage.not-visited{max-width:100vw;max-height:100vh}img.post-image{border:none;max-width:100vw;max-height:100vh;margin-top:.5rem;margin-bottom:.5rem;margin-right:1.5rem;margin-left:1rem;float:left}img.post-image.op{float:left;display:block}img.banner,img.logo{max-width:100vw;max-height:100vh}img.banner.not-visited,img.logo.not-visited{max-width:30%}img.loading{width:20px;margin:auto;display:block}div.container{padding:.5%}div.container.quote-container{padding:0}.centered{margin-left:auto;margin-right:auto}div.centered{width:60%}img.centered{width:80%}h1.centered,h2.centered,h3.centered,h4.centered,h5.centered,h6.centered,p.centered{text-align:center}h1.title,h2.title,h3.title,h4.title,h5.title,h6.title{color:var(--title)}h1.warning,h2.warning,h3.warning,h4.warning,h5.warning,h6.warning{color:var(--warning)}h1.subtitle,h2.subtitle,h3.subtitle,h4.subtitle,h5.subtitle,h6.subtitle,p.subtitle{color:var(--subtitle)}h1.not-found{color:var(--redtext);font-size:20vw}div.card{border:1px;border-style:solid;border-color:var(--general-border);background-color:var(--card-bg);margin-left:1%}div.card>.card-header{background-color:var(--card-header-bg);color:var(--card-header-font);padding-left:1%}div.card-post{display:inline-block;margin-left:0;border-color:var(--card-post-bg)}div.card-post.hashed{border-color:var(--post-hashed-border)}div.columns{display:flex;flex-direction:row;flex-wrap:wrap}div.columns>.col{flex:1}div.columns>.col-1{flex:1;max-width:10%}div.columns>.col-2{flex:1;max-width:20%}div.columns>.col-3{flex:1;max-width:30%}div.columns>.col-4{flex:1;max-width:40%}div.columns>.col-5{flex:1;max-width:50%}div.columns>.col-6{flex:1;max-width:60%}div.columns>.col-7{flex:1;max-width:70%}div.columns>.col-8{flex:1;max-width:80%}div.columns>.col-9{flex:1;max-width:90%}div.columns>.col-10{min-width:100%}div.col.board-list{max-width:33%}ul{padding-left:3%}ul.no-style{padding-left:2%;list-style:none}a{text-decoration:none}a:link,button.link{color:var(--link)}a:visited,button.link.visited{color:var(--link-visited)}a:hover,button.link:hover{color:var(--link-hover)}button.hide{float:left;margin-right:5px;margin-left:5px}button.link{background:0 0!important;border:none;padding:0;cursor:pointer}.form{max-width:50%}.form.floatin{max-width:100%}.form .form-group{margin:.2rem 0;display:block}.form input[type=email],.form input[type=password],.form input[type=text],.form select,.form textarea{display:block;width:100%;padding:.2rem;font-size:1rem;background-color:var(--input-bg);color:var(--input-font);border:none}.form textarea{resize:vertical;white-space:pre-wrap}.form input[type=submit],button{font:inherit}.btn{display:block;background-color:var(--button-bg);color:var(--button-font);padding:.4rem 1.3rem;font-size:1rem;border:none;cursor:pointer;margin-right:.5rem;outline:0;width:100%}.btn:hover{opacity:.8}span.new-item{float:right;padding-right:1rem}span.small{font-size:.8rem}span.admin{color:var(--admin)}span.mod{color:var(--mod)}span.muted{color:var(--muted)}hr.separator{width:99%;border-top:1px solid var(--separator);border-bottom:none;display:inline-block}div.thread-preview{display:block;clear:both}span.thread-title{color:var(--thread-title);font-weight:700;font-size:1.1rem}div.post-container{padding-bottom:0;max-width:80vw}div.quote-container{max-width:50vw}div.post-file{float:none}div.post-file.in-body{margin-right:1rem}div.post-info{display:inline-block;padding-right:1rem}p.file-info{display:block}p.file-info-post{display:block;padding-left:1rem}div.post p{display:block}div.post-text{padding:1rem;word-wrap:break-word;white-space:pre-wrap;font-size:.9rem}div.op-post-text{padding-right:2rem;padding-left:1rem;word-wrap:break-word;white-space:pre-wrap;font-size:.9rem}div.footer,div.pages{display:block;clear:both}.tooltip{padding:0!important;min-width:10vw}span.greentext{color:var(--greentext)}span.redtext{color:var(--redtext)}@media (max-width:700px){div.centered{width:80%}.col-1,.col-10,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,div.columns>.col{max-width:100%;min-width:100%;margin-bottom:2%}img.post-image.not-visited{max-width:50vw;max-height:54vh}img.banner.not-visited,img.logo.not-visited{max-width:60%}.form{max-width:100%}div.post-text{padding-top:0}}');

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

-- Dump completed on 2020-06-08 18:00:17
