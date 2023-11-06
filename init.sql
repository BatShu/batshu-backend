create database batshu_db;

use batshu_db;

CREATE TABLE `user` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
    `uid` varchar(255) NOT NULL,
	`real_name` varchar(255) NULL,
    `bank_name` varchar(255) NULL,
    `account_number` varchar(255) NULL
);


CREATE TABLE `accident` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`content_title` varchar(255) NOT NULL,
	`content_description` varchar(255) NOT NULL,
	`accident_start_time` datetime NOT NULL,
    `accident_end_time` datetime NOT NULL,
	`created_at` datetime NOT NULL,
	`accident_location` point NOT NULL,
	`place_name` varchar(255) NOT NULL,
	`car_model_name` varchar(255),
	`license_plate` varchar(255),
	`bounty` int NULL,
	`uid` varchar(255) NOT NULL
);

CREATE TABLE `observe` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`content_title`	varchar(255) NOT NULL,
	`content_description` varchar(255) NOT NULL,
	`observe_start_time` datetime NOT NULL,
    `observe_end_time` datetime NOT NULL,
	`created_at` datetime NOT NULL,
	`observe_location` point NOT NULL,
	`place_name` varchar(255) NOT NULL,
	`car_model_name` varchar(255),
	`license_plate` varchar(255),
	`uid` varchar(255) NOT NULL,
    `video_id` int NOT NULL
);

CREATE TABLE `video` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`status` varchar(255) NOT NULL,
	`video_url`	varchar(255) NOT NULL,
    `thumbnail_url` varchar(255)
);

CREATE TABLE `accident_photo` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`photo_url` varchar(255) NOT NULL,
	`accident_id` int NOT NULL
);


CREATE TABLE `room` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`report_uid` varchar(255) NOT NULL,
	`uid` varchar(255) NOT NULL,
    `accident_id` int,
    `observe_id` int
);

CREATE TABLE `message` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`uid` varchar(255) NOT NULL,
	`room_id` int NOT NULL,
	`message_text` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`message_type` varchar(255) NULL
);

ALTER TABLE `user` ADD INDEX `idx_uid` (`uid`);

ALTER TABLE `accident` ADD CONSTRAINT `FK_user_TO_accident_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `observe` ADD CONSTRAINT `FK_video_TO_observe_1` FOREIGN KEY (
	`video_id`
)
REFERENCES `video` (
	`id`
);

ALTER TABLE `observe` ADD CONSTRAINT `FK_user_TO_observe_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `accident_photo` ADD CONSTRAINT `FK_accident_TO_accident_photo_1` FOREIGN KEY (
	`accident_id`
)
REFERENCES `accident` (
	`id`
);

ALTER TABLE `room` ADD CONSTRAINT `FK_user_TO_room_1` FOREIGN KEY (
	`report_uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `room` ADD CONSTRAINT `FK_user_TO_room_2` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `message` ADD CONSTRAINT `FK_user_TO_message_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `message` ADD CONSTRAINT `FK_room_TO_message_1` FOREIGN KEY (
	`room_id`
)
REFERENCES `room` (
	`id`
);

GRANT ALL PRIVILEGES ON batshu_db.* TO 'root'@'%';

flush privileges;

use mysql;

select user, host from user;