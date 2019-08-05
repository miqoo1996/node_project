/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.7.13-0ubuntu0.16.04.2 : Database - node_project
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`node_project` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `node_project`;

/*Table structure for table `role_groups` */

DROP TABLE IF EXISTS `role_groups`;

CREATE TABLE `role_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `role_groups` */

insert  into `role_groups`(`id`,`name`) values (1,'admin'),(2,'user');

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `role_gropup_id` int(10) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roles_role_group_id` (`role_gropup_id`),
  CONSTRAINT `roles_role_group_id` FOREIGN KEY (`role_gropup_id`) REFERENCES `role_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `roles` */

insert  into `roles`(`id`,`role_gropup_id`,`name`) values (1,1,'admin'),(2,2,'role1'),(3,2,'role2'),(4,2,'role3'),(5,2,'role4'),(6,2,'role5');

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `sessions` */

insert  into `sessions`(`session_id`,`expires`,`data`) values ('xcD5kpPkBZVWzMR25pf9w1mH0RRmrdZu',1499112855,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"userIsGuest\":false,\"user\":{\"id\":20,\"firstname\":\"Miqayel\",\"lastname\":\"Ishkhanyan\",\"email\":\"admin@admin.com\",\"username\":\"admin123\",\"password\":\"f6fdffe48c908deb0f4c3bd36c032e72\",\"created_at\":\"2017-07-02T09:01:26.000Z\",\"updated_at\":\"2017-07-02T08:43:00.000Z\"}}');

/*Table structure for table `user_roles` */

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `role_id` int(10) NOT NULL DEFAULT '0',
  `user_id` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `users_user_roles_user_id_fk` (`user_id`),
  KEY `roles_user_roles_role_id_fk` (`role_id`),
  CONSTRAINT `roles_user_roles_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_user_roles_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `user_roles` */

insert  into `user_roles`(`id`,`role_id`,`user_id`) values (6,1,20);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`firstname`,`lastname`,`email`,`username`,`password`,`created_at`,`updated_at`) values (17,'Miqayel','Ishkhanyan','miqoo1996@mail.ru','miqoo1996','96e79218965eb72c92a549dd5a330112','2017-06-07 00:03:38','0000-00-00 00:00:00'),(20,'Miqayel','Ishkhanyan','admin@admin.com','admin123','f6fdffe48c908deb0f4c3bd36c032e72','2017-07-02 13:01:26','2017-07-02 12:43:00');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
