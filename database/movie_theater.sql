CREATE DATABASE IF NOT EXISTS movie_theater;
USE movie_theater;

DROP TABLE IF EXISTS credits_refund;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS seat;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS screen;
DROP TABLE IF EXISTS users;

create table if not exists movie (
    id int auto_increment primary key,
    movieName varchar(50) not null,
    addedDate timestamp default NOW() not null,
    url varchar(2048) null
);

create table if not exists screen (
    id int auto_increment primary key,
    screenName varchar(20) not null unique,
    length int not null,
    width int not null,
    capacity int as (width * length) stored
);

create table if not exists schedule (
    id int auto_increment primary key,
    movieId int null,
    screenId int null,
    startTime timestamp not null,
    price decimal(10, 2) not null,
    constraint schedules_movies_id_fk foreign key (movieId) references movie (id),
    constraint schedules_screens_id_fk foreign key (screenId) references screen (id)
);

create table if not exists seat (
    scheduleId int not null,
    seatNumber int not null,
    isAvaliable tinyint(1) default 1 null,
    primary key (seatNumber, scheduleId),
    constraint schedules_seats_schedules_id_fk foreign key (scheduleId) references schedule (id)
);

create table if not exists users (
    id int auto_increment primary key,
    email varchar(50) not null unique,
    password varchar(255) not null,
    paymentMethod ENUM('DEBIT', 'CREDIT') null,
    cardNumber varchar(19) null,
    membershipExpiryDate timestamp null
);

create table if not exists ticket (
    id int auto_increment primary key,
    userId int not null,
    scheduleId int not null,
    seatNumber int not null,
    isCancelled tinyint(1) default 0 not null,
    cancellationDate timestamp default null,
    constraint ticket_users_id_fk foreign key (userId) references users (id),
    constraint ticket_schedule_seat_scheduleId_seatNumber_fk foreign key (scheduleId, seatNumber) references seat (scheduleId, seatNumber)
)

create table if not exists payment (
    id int auto_increment primary key,
    ticketId int,
    paymentTime timestamp default NOW() not null,
    paymentMethod ENUM('DEBIT', 'CREDIT') not null,
    cardNumber varchar(19) null,
    creditSpent decimal(10, 2) default 0.00 not null,
    moneySpent decimal(10, 2) default 0.00 not null,
    constraint payment_ticket_id_fk foreign key (ticketId) references ticket (id)
);

create table if not exists credits_refund (
    paymentId int not null primary key,
    creditsRefund decimal(10, 2) null,
    expiryDate timestamp not null,
    constraint credits_refund_fk foreign key (paymentId) references payment (id)
);

DROP PROCEDURE IF EXISTS insert_schedule_seats;

DELIMITER $$
create procedure insert_schedule_seats(IN p_scheduleId int, IN p_screenId int)
BEGIN
	DECLARE i INT DEFAULT 1;
	DECLARE screen_capacity INT;

    SELECT capacity INTO screen_capacity FROM screens WHERE id = p_screenId;

    WHILE i <= screen_capacity DO
            INSERT INTO seat (scheduleId, seatNumber)
            VALUES (p_scheduleId, i);
            SET i = i + 1;
	END WHILE;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS after_insert_schedule;

DELIMITER $$
create trigger after_insert_schedule
after insert
on schedule
for each row
BEGIN
    CALL insert_schedule_seats(NEW.id, NEW.screenId);
END $$
DELIMITER ;