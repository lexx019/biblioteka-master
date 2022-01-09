-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2022 at 03:02 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `biblioteka`
--

-- --------------------------------------------------------

--
-- Table structure for table `kategorije`
--

CREATE TABLE `kategorije` (
  `idKategorije` int(11) NOT NULL,
  `zanr` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kategorije`
--

INSERT INTO `kategorije` (`idKategorije`, `zanr`) VALUES
(1, 'horor');

-- --------------------------------------------------------

--
-- Table structure for table `knjige`
--

CREATE TABLE `knjige` (
  `idKnjige` int(11) NOT NULL,
  `ime` varchar(55) NOT NULL,
  `imeAutora` varchar(55) NOT NULL,
  `idKategorije` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `knjige`
--

INSERT INTO `knjige` (`idKnjige`, `ime`, `imeAutora`, `idKategorije`) VALUES
(1, 'witcherr', 'Autor A', 1),
(2, 'wiitcher 333', 'NNnnn', 1),
(3, 'Test knjiga 1', 'Test autor', 1),
(4, 'Test knjiga 333', 'Autor Test', 1),
(5, 'Sezona oluja', 'Andzej Sapkowski', 1);

-- --------------------------------------------------------

--
-- Table structure for table `korisnici`
--

CREATE TABLE `korisnici` (
  `ime` varchar(55) NOT NULL,
  `prezime` varchar(55) NOT NULL,
  `brojlicne` int(11) NOT NULL,
  `datumrodjenja` date NOT NULL,
  `jmbg` int(11) NOT NULL,
  `telefon` varchar(55) NOT NULL,
  `tipnaloga` varchar(55) NOT NULL,
  `email` varchar(255) NOT NULL,
  `lozinka` varchar(255) NOT NULL,
  `idKorisnika` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `korisnici`
--

INSERT INTO `korisnici` (`ime`, `prezime`, `brojlicne`, `datumrodjenja`, `jmbg`, `telefon`, `tipnaloga`, `email`, `lozinka`, `idKorisnika`) VALUES
('johnn', 'doe', 1212312321, '2022-01-04', 11112233, '0651233123', 'bibliotekar', 'email@gmail.com', '$2b$05$inkdxAfj1YbJZWUeiqHJq.sMbNBnXBt7aHAkoFP/cp413FUPlM.z2', 1),
('johnn111', 'doeee', 1212312321, '2022-01-10', 1231321313, '666643444', 'korisnik', 'miha019@gmail.com', '$2b$05$inkdxAfj1YbJZWUeiqHJq.sMbNBnXBt7aHAkoFP/cp413FUPlM.z2', 2);

-- --------------------------------------------------------

--
-- Table structure for table `primerci_knjige`
--

CREATE TABLE `primerci_knjige` (
  `id` int(255) NOT NULL,
  `idKorisnika` int(55) NOT NULL,
  `idKnjige` int(55) NOT NULL,
  `datumUzimanja` date DEFAULT NULL,
  `datumVracanja` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `primerci_knjige`
--

INSERT INTO `primerci_knjige` (`id`, `idKorisnika`, `idKnjige`, `datumUzimanja`, `datumVracanja`) VALUES
(1, 0, 1, '2022-01-07', '2022-01-21'),
(2, 0, 2, NULL, '0000-00-00'),
(3, 0, 2, '0000-00-00', '0000-00-00'),
(4, 0, 2, '0000-00-00', '0000-00-00'),
(5, 0, 3, '0000-00-00', '0000-00-00'),
(6, 2, 4, NULL, '0000-00-00'),
(7, 1, 5, '2022-01-01', '2022-01-13'),
(8, 2, 5, '2022-01-01', '2022-01-20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kategorije`
--
ALTER TABLE `kategorije`
  ADD PRIMARY KEY (`idKategorije`);

--
-- Indexes for table `knjige`
--
ALTER TABLE `knjige`
  ADD PRIMARY KEY (`idKnjige`),
  ADD KEY `idKategorije` (`idKategorije`);

--
-- Indexes for table `korisnici`
--
ALTER TABLE `korisnici`
  ADD PRIMARY KEY (`idKorisnika`);

--
-- Indexes for table `primerci_knjige`
--
ALTER TABLE `primerci_knjige`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idKorisnika` (`idKorisnika`),
  ADD KEY `primerci_knjige_ibfk_1` (`idKnjige`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kategorije`
--
ALTER TABLE `kategorije`
  MODIFY `idKategorije` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `knjige`
--
ALTER TABLE `knjige`
  MODIFY `idKnjige` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `korisnici`
--
ALTER TABLE `korisnici`
  MODIFY `idKorisnika` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `primerci_knjige`
--
ALTER TABLE `primerci_knjige`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `knjige`
--
ALTER TABLE `knjige`
  ADD CONSTRAINT `knjige_ibfk_1` FOREIGN KEY (`idKategorije`) REFERENCES `kategorije` (`idKategorije`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `primerci_knjige`
--
ALTER TABLE `primerci_knjige`
  ADD CONSTRAINT `primerci_knjige_ibfk_1` FOREIGN KEY (`idKnjige`) REFERENCES `knjige` (`idKnjige`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
