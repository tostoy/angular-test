--
-- kleinere Datenbank zum testen. Nur letzte Messwerte wurden eingefügt
--

CREATE DATABASE IF NOT EXISTS `sep_ss2018_cm1` DEFAULT CHARACTER SET latin1;

USE `sep_ss2018_cm1`;

CREATE TABLE IF NOT EXISTS `nodes` (
  `id` int(11) unsigned NOT NULL,
  `latitude` decimal(8,6) unsigned NOT NULL,
  `longitude` decimal(8,6) unsigned NOT NULL,
  `last_seen` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `data` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `node_id` int(11) unsigned DEFAULT NULL,
  `air_humidity` float DEFAULT NULL,
  `air_pressure` float DEFAULT NULL,
  `air_temperature` float DEFAULT NULL,
  `particle_25` float DEFAULT NULL,
  `particle_100` float DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `latitude` decimal(8,6) DEFAULT NULL,
  `longitude` decimal(8,6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1375312 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `dataNew` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `node_id` int(11) unsigned DEFAULT NULL,
  `air_humidity` float DEFAULT NULL,
  `air_pressure` float DEFAULT NULL,
  `air_temperature` float DEFAULT NULL,
  `particle_25` float DEFAULT NULL,
  `particle_100` float DEFAULT NULL,
  `date` date DEFAULT NULL,
  `hour` int(2) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_node_idx2` (`node_id`),
  CONSTRAINT `fk_node2` FOREIGN KEY (`node_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1375312 DEFAULT CHARSET=latin1;

INSERT INTO `nodes`
(`id`,
`latitude`,
`longitude`,
`last_seen`)
(SELECT `nodes`.`id`,
    `nodes`.`latitude`,
    `nodes`.`longitude`,
    `nodes`.`last_seen`
FROM `sep_ss2018`.`nodes`);

INSERT INTO `data`
(`id`,
`node_id`,
`air_humidity`,
`air_pressure`,
`air_temperature`,
`particle_25`,
`particle_100`,
`datetime`,
`latitude`,
`longitude`)
(SELECT `data`.`id`,
    `data`.`node_id`,
    `data`.`air_humidity`,
    `data`.`air_pressure`,
    `data`.`air_temperature`,
    `data`.`particle_25`,
    `data`.`particle_100`,
    `data`.`datetime`,
    `data`.`latitude`,
    `data`.`longitude`
FROM `sep_ss2018`.`data`
WHERE `data`.`id` >= 1300000);
