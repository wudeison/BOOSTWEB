-- =====================================
-- CREAR BASE DE DATOS
-- =====================================
CREATE DATABASE IF NOT EXISTS boost;
USE boost;

-- =====================================
-- ELIMINAR TABLAS EXISTENTES EN ORDEN CORRECTO
-- =====================================
DROP TABLE IF EXISTS `pago`;
DROP TABLE IF EXISTS `sesion`;
DROP TABLE IF EXISTS `recursodigital`;
DROP TABLE IF EXISTS `profesional`;
DROP TABLE IF EXISTS `usuario`;

-- =====================================
-- 1️⃣ Tabla usuario
-- =====================================
CREATE TABLE `usuario` (
  `idUsuario` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `fechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipoUsuario` enum('profesional','cliente') DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================
-- 2️⃣ Tabla profesional
-- =====================================
CREATE TABLE `profesional` (
  `idProfesional` int NOT NULL AUTO_INCREMENT,
  `idUsuario` varchar(20) NOT NULL,
  `profesion` varchar(100) DEFAULT NULL,
  `experiencia` int DEFAULT NULL,
  PRIMARY KEY (`idProfesional`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `profesional_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================
-- 3️⃣ Tabla recursodigital
-- =====================================
CREATE TABLE `recursodigital` (
  `idRecurso` int NOT NULL AUTO_INCREMENT,
  `idProfesional` int NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `url` varchar(255),
  PRIMARY KEY (`idRecurso`),
  KEY `idProfesional` (`idProfesional`),
  CONSTRAINT `recursodigital_ibfk_1` FOREIGN KEY (`idProfesional`) REFERENCES `profesional` (`idProfesional`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================
-- 4️⃣ Tabla sesion
-- =====================================
CREATE TABLE `sesion` (
  `idSesion` int NOT NULL AUTO_INCREMENT,
  `idUsuario` varchar(20) NOT NULL,
  `idProfesional` int DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `duracion` int DEFAULT NULL,
  PRIMARY KEY (`idSesion`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idProfesional` (`idProfesional`),
  CONSTRAINT `sesion_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sesion_ibfk_2` FOREIGN KEY (`idProfesional`) REFERENCES `profesional` (`idProfesional`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================
-- 5️⃣ Tabla pago
-- =====================================
CREATE TABLE `pago` (
  `idPago` int NOT NULL AUTO_INCREMENT,
  `idUsuario` varchar(20) NOT NULL,
  `idSesion` int DEFAULT NULL,
  `idRecurso` int DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fechaPago` datetime DEFAULT NULL,
  PRIMARY KEY (`idPago`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idSesion` (`idSesion`),
  KEY `idRecurso` (`idRecurso`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pago_ibfk_2` FOREIGN KEY (`idSesion`) REFERENCES `sesion` (`idSesion`),
  CONSTRAINT `pago_ibfk_3` FOREIGN KEY (`idRecurso`) REFERENCES `recursodigital` (`idRecurso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;