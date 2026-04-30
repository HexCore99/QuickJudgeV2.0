-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2026 at 05:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quickjudge`
--

-- --------------------------------------------------------

--
-- Table structure for table `contests`
--

CREATE TABLE `contests` (
  `id` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `status` enum('live','upcoming','past') NOT NULL,
  `contest_type` varchar(50) DEFAULT 'Contest',
  `problems_count` int(11) DEFAULT 0,
  `participants_count` int(11) DEFAULT 0,
  `requires_password` tinyint(1) DEFAULT 0,
  `password_hash` varchar(255) DEFAULT NULL,
  `is_rated` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contests`
--

INSERT INTO `contests` (`id`, `name`, `description`, `start_time`, `duration_minutes`, `status`, `contest_type`, `problems_count`, `participants_count`, `requires_password`, `password_hash`, `is_rated`, `created_at`) VALUES
('BLZ-08', 'Blitz Round #8', 'Math and Implementation', '2026-03-20 22:00:00', 90, 'past', 'Blitz', 3, 389, 0, NULL, 0, '2026-04-02 16:00:05'),
('BLZ-09L', 'Blitz Round #9', 'Fast-Paced Implementation & Math', '2026-04-03 20:00:00', 90, 'live', 'Blitz', 3, 423, 1, '$2b$12$z6lWAQSO8fi3ESuhCWKZMu6sRpnP39hXfXlWYlgka/9LmROEfoKHi', 0, '2026-04-02 16:00:05'),
('MC-08', 'Monthly Challenge #8', 'Segment Tree, BIT and Strings', '2026-03-10 19:00:00', 180, 'past', 'Monthly', 6, 1245, 0, NULL, 1, '2026-04-02 16:00:05'),
('MC-09U', 'Monthly Challenge #9', 'Advanced Data Structures & Optimization', '2026-04-08 19:00:00', 180, 'upcoming', 'Monthly', 6, 0, 0, NULL, 1, '2026-04-02 16:00:05'),
('NC-03', 'Night Challenge #3', 'Strings, Hashing and Trie', '2026-03-05 22:00:00', 120, 'past', 'Night', 5, 512, 0, NULL, 0, '2026-04-02 16:00:05'),
('NC-04U', 'Night Challenge #4', 'Strings, Hashing & Suffix Structures', '2026-04-05 22:00:00', 120, 'upcoming', 'Night', 5, 0, 0, NULL, 0, '2026-04-02 16:00:05'),
('SEC-01L', 'Secure Contest #1', 'Password Protected Mixed Topic Contest', '2026-04-03 22:00:00', 120, 'live', 'Special', 4, 185, 1, '$2b$12$87Py25w217AhR6gy2S6BE.grugxintOHDteHdgU1SpTrNubrbnNHC', 0, '2026-04-02 16:00:05'),
('WC-41', 'Weekly Contest #41', 'Arrays, Binary Search and Two Pointers', '2026-03-15 20:00:00', 120, 'past', 'Weekly', 5, 823, 0, NULL, 1, '2026-04-02 16:00:05'),
('WC-42', 'Weekly Contest #42', 'Graphs, Trees and Greedy', '2026-03-25 20:00:00', 120, 'past', 'Weekly', 5, 847, 0, NULL, 1, '2026-04-02 16:00:05'),
('WC-43L', 'Weekly Contest #43', 'Graph Algorithms & Greedy Techniques', '2026-04-02 20:00:00', 90, 'live', 'Weekly', 4, 892, 0, NULL, 1, '2026-04-02 16:00:05'),
('WC-44U', 'Weekly Contest #44', 'Dynamic Programming & Combinatorics', '2026-04-10 20:00:00', 120, 'upcoming', 'Weekly', 4, 0, 0, NULL, 1, '2026-04-02 16:00:05');

-- --------------------------------------------------------

--
-- Table structure for table `contest_access`
--

CREATE TABLE `contest_access` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `granted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_access`
--

INSERT INTO `contest_access` (`id`, `user_id`, `contest_id`, `granted_at`) VALUES
(1, 2, 'SEC-01L', '2026-04-03 10:53:59'),
(2, 2, 'BLZ-09L', '2026-04-27 13:14:02');

-- --------------------------------------------------------

--
-- Table structure for table `contest_announcements`
--

CREATE TABLE `contest_announcements` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `posted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_announcements`
--

INSERT INTO `contest_announcements` (`id`, `contest_id`, `title`, `body`, `posted_at`) VALUES
(1, 'WC-43L', 'Welcome to Weekly Contest #43!', 'Good luck to all participants. Please read all problem statements carefully before coding.', '2026-04-02 20:00:00'),
(2, 'WC-43L', 'Clarification on Problem B', 'In Problem B, array indices are 1-based, not 0-based.', '2026-04-02 20:30:00'),
(3, 'WC-43L', 'Problem D Time Limit Extended', 'The time limit for Problem D has been extended from 1s to 2s.', '2026-04-02 21:00:00'),
(4, 'WC-43L', 'announcement', 'announcement', '2026-04-27 20:23:12');

-- --------------------------------------------------------

--
-- Table structure for table `contest_leaderboard`
--

CREATE TABLE `contest_leaderboard` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `solved` int(11) NOT NULL DEFAULT 0,
  `total_penalty` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_leaderboard`
--

INSERT INTO `contest_leaderboard` (`id`, `contest_id`, `user_id`, `username`, `solved`, `total_penalty`) VALUES
(1, 'WC-43L', 1, 'alice_cp', 4, 180),
(2, 'WC-43L', 2, 'siyam', 2, 95),
(3, 'WC-43L', 3, 'bob_codes', 3, 140),
(4, 'WC-43L', 4, 'dev_ninja', 4, 200),
(5, 'WC-43L', 5, 'zara_42', 1, 55),
(6, 'WC-43L', 6, 'codex_ray', 2, 110),
(7, 'WC-43L', 7, 'night_owl', 3, 160),
(8, 'WC-43L', 8, 'fast_typer', 4, 175),
(9, 'WC-43L', 9, 'loop_king', 0, 0),
(10, 'WC-43L', 10, 'debug_mode', 1, 70);

-- --------------------------------------------------------

--
-- Table structure for table `contest_problems`
--

CREATE TABLE `contest_problems` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `problem_code` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `points` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_problems`
--

INSERT INTO `contest_problems` (`id`, `contest_id`, `problem_code`, `title`, `difficulty`, `points`, `sort_order`) VALUES
(117, 'WC-43L', 'A', 'Minimum Path in DAG', 'easy', 100, 1),
(118, 'WC-43L', 'B', 'Greedy Interval Merge', 'medium', 200, 2),
(119, 'WC-43L', 'C', 'Tree Teleport', 'medium', 200, 3),
(120, 'WC-43L', 'D', 'Shortest Route Rebuild', 'hard', 300, 4),
(121, 'BLZ-09L', 'A', 'Digit Collapse', 'easy', 100, 1),
(122, 'BLZ-09L', 'B', 'Fast Matrix Walk', 'medium', 200, 2),
(123, 'BLZ-09L', 'C', 'Prime Window', 'hard', 300, 3),
(124, 'SEC-01L', 'A', 'Locked Prefix', 'easy', 100, 1),
(125, 'SEC-01L', 'B', 'Checkpoint Greedy', 'medium', 200, 2),
(126, 'SEC-01L', 'C', 'Secret Tunnel Graph', 'medium', 200, 3),
(127, 'SEC-01L', 'D', 'Encrypted States', 'hard', 300, 4),
(128, 'NC-04U', 'A', 'Rolling Hash Warmup', 'easy', 100, 1),
(129, 'NC-04U', 'B', 'Prefix String Clash', 'medium', 200, 2),
(130, 'NC-04U', 'C', 'Trie Path Counter', 'medium', 200, 3),
(131, 'NC-04U', 'D', 'Suffix Match Range', 'hard', 300, 4),
(132, 'NC-04U', 'E', 'Cyclic Hash Query', 'hard', 300, 5),
(133, 'MC-09U', 'A', 'Range Sum Redux', 'easy', 100, 1),
(134, 'MC-09U', 'B', 'Fenwick Jump', 'medium', 200, 2),
(135, 'MC-09U', 'C', 'Persistent Versioning', 'medium', 200, 3),
(136, 'MC-09U', 'D', 'Lazy Fortress', 'hard', 300, 4),
(137, 'MC-09U', 'E', 'Optimizer Chain', 'hard', 300, 5),
(138, 'MC-09U', 'F', 'K-th Query Machine', 'hard', 300, 6),
(139, 'WC-44U', 'A', 'Coin Paths', 'easy', 100, 1),
(140, 'WC-44U', 'B', 'Balanced Choices', 'medium', 200, 2),
(141, 'WC-44U', 'C', 'Probability Steps', 'medium', 200, 3),
(142, 'WC-44U', 'D', 'Combinatoric Tower', 'hard', 300, 4),
(143, 'WC-42', 'A', 'Forest Walk', 'easy', 100, 1),
(144, 'WC-42', 'B', 'Edge Pick', 'medium', 200, 2),
(145, 'WC-42', 'C', 'Tree Distance Sum', 'medium', 200, 3),
(146, 'WC-42', 'D', 'Directed Escape', 'hard', 300, 4),
(147, 'WC-42', 'E', 'Greedy Reorder', 'hard', 300, 5),
(148, 'BLZ-08', 'A', 'Fast Additions', 'easy', 100, 1),
(149, 'BLZ-08', 'B', 'Odd Pair Count', 'medium', 200, 2),
(150, 'BLZ-08', 'C', 'Modulo Chase', 'hard', 300, 3),
(151, 'WC-41', 'A', 'Sorted Slice', 'easy', 100, 1),
(152, 'WC-41', 'B', 'Nearest Bound', 'medium', 200, 2),
(153, 'WC-41', 'C', 'Double Pointer Run', 'medium', 200, 3),
(154, 'WC-41', 'D', 'Range Packing', 'hard', 300, 4),
(155, 'WC-41', 'E', 'Array Rebuild', 'hard', 300, 5),
(156, 'MC-08', 'A', 'Segment Intro', 'easy', 100, 1),
(157, 'MC-08', 'B', 'Point Update Mania', 'medium', 200, 2),
(158, 'MC-08', 'C', 'String Blocks', 'medium', 200, 3),
(159, 'MC-08', 'D', 'Bit Inversion', 'hard', 300, 4),
(160, 'MC-08', 'E', 'Interval Lock', 'hard', 300, 5),
(161, 'MC-08', 'F', 'Segment Tree Beats Lite', 'hard', 300, 6),
(162, 'NC-03', 'A', 'String Echo', 'easy', 100, 1),
(163, 'NC-03', 'B', 'Hash Window', 'medium', 200, 2),
(164, 'NC-03', 'C', 'Trie Merge', 'medium', 200, 3),
(165, 'NC-03', 'D', 'Pattern Rush', 'hard', 300, 4),
(166, 'NC-03', 'E', 'Lexicographic Night', 'hard', 300, 5);

-- --------------------------------------------------------

--
-- Table structure for table `contest_queries`
--

CREATE TABLE `contest_queries` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `status` enum('pending','answered') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `answered_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_queries`
--

INSERT INTO `contest_queries` (`id`, `contest_id`, `user_id`, `username`, `question`, `answer`, `status`, `created_at`, `answered_at`) VALUES
(1, 'WC-43L', 2, 'siyam', 'Is the graph in Problem A guaranteed to be connected?', 'Yes, the graph is always connected.', 'answered', '2026-04-02 20:20:00', '2026-04-02 20:25:00'),
(2, 'WC-43L', 1, 'siyam', 'Can we use floating point for Problem C?', 'No, all answers are integers.', 'answered', '2026-04-02 20:50:00', '2026-04-02 20:55:00'),
(3, 'WC-43L', 2, 'siyam', 'What is the max value of N for Problem D?', NULL, 'pending', '2026-04-02 21:40:00', NULL),
(4, 'BLZ-09L', 2, 'siyam', 'adfasf', NULL, 'pending', '2026-04-27 19:01:37', NULL),
(5, 'WC-43L', 2, 'siyam', 'test', 'test2', 'answered', '2026-04-27 19:02:16', '2026-04-27 20:22:56'),
(6, 'WC-43L', 2, 'siyam', 'dasfas', 'yes', 'answered', '2026-04-27 19:02:46', '2026-04-27 20:22:50'),
(7, 'WC-43L', 2, 'siyam', 'adsfasfa', NULL, 'pending', '2026-04-27 19:10:42', NULL),
(8, 'BLZ-09L', 2, 'siyam', 'dfsadsfasdfasdfasdfasdf', NULL, 'pending', '2026-04-27 19:14:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contest_registrations`
--

CREATE TABLE `contest_registrations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_registrations`
--

INSERT INTO `contest_registrations` (`id`, `user_id`, `contest_id`, `created_at`) VALUES
(7, 2, 'NC-04U', '2026-04-02 16:00:05'),
(8, 2, 'WC-44U', '2026-04-02 16:00:05'),
(9, 2, 'MC-09U', '2026-04-02 16:00:17');

-- --------------------------------------------------------

--
-- Table structure for table `contest_results`
--

CREATE TABLE `contest_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `participated` tinyint(1) DEFAULT 0,
  `rank_position` int(11) DEFAULT NULL,
  `total_participants` int(11) DEFAULT 0,
  `solved_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_results`
--

INSERT INTO `contest_results` (`id`, `user_id`, `contest_id`, `participated`, `rank_position`, `total_participants`, `solved_count`) VALUES
(13, 2, 'WC-42', 1, 12, 847, 4),
(14, 2, 'BLZ-08', 0, NULL, 389, 0),
(15, 2, 'WC-41', 1, 18, 823, 3),
(16, 2, 'MC-08', 0, NULL, 1245, 0),
(17, 2, 'NC-03', 1, 7, 512, 5);

-- --------------------------------------------------------

--
-- Table structure for table `contest_submissions`
--

CREATE TABLE `contest_submissions` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `user_id` int(11) NOT NULL,
  `problem_code` varchar(10) NOT NULL,
  `language` varchar(30) NOT NULL,
  `verdict` enum('Accepted','Wrong Answer','Time Limit Exceeded','Runtime Error','Compilation Error') NOT NULL,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_submissions`
--

INSERT INTO `contest_submissions` (`id`, `contest_id`, `user_id`, `problem_code`, `language`, `verdict`, `submitted_at`) VALUES
(1, 'WC-43L', 2, 'A', 'C++', 'Accepted', '2026-04-02 20:15:00'),
(2, 'WC-43L', 2, 'B', 'C++', 'Wrong Answer', '2026-04-02 20:45:00'),
(3, 'WC-43L', 2, 'B', 'C++', 'Accepted', '2026-04-02 21:10:00'),
(4, 'WC-43L', 2, 'C', 'Python', 'Time Limit Exceeded', '2026-04-02 21:35:00'),
(5, 'WC-43L', 2, 'D', 'Java', 'Runtime Error', '2026-04-02 21:55:00'),
(6, 'WC-43L', 2, 'A', 'C++', 'Accepted', '2026-04-02 20:15:00'),
(7, 'WC-43L', 2, 'B', 'C++', 'Wrong Answer', '2026-04-02 20:45:00'),
(8, 'WC-43L', 2, 'B', 'C++', 'Accepted', '2026-04-02 21:10:00'),
(9, 'WC-43L', 2, 'C', 'Python', 'Time Limit Exceeded', '2026-04-02 21:35:00'),
(10, 'WC-43L', 2, 'D', 'Java', 'Runtime Error', '2026-04-02 21:55:00');

-- --------------------------------------------------------

--
-- Table structure for table `contest_tags`
--

CREATE TABLE `contest_tags` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `tag_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_tags`
--

INSERT INTO `contest_tags` (`id`, `contest_id`, `tag_name`) VALUES
(85, 'WC-43L', 'Graphs'),
(86, 'WC-43L', 'Greedy'),
(87, 'WC-43L', 'Trees'),
(88, 'WC-43L', 'Shortest Path'),
(89, 'BLZ-09L', 'Math'),
(90, 'BLZ-09L', 'Implementation'),
(91, 'BLZ-09L', 'Number Theory'),
(92, 'SEC-01L', 'Greedy'),
(93, 'SEC-01L', 'Binary Search'),
(94, 'SEC-01L', 'Graphs'),
(95, 'SEC-01L', 'DP'),
(96, 'NC-04U', 'Strings'),
(97, 'NC-04U', 'Hashing'),
(98, 'NC-04U', 'Trie'),
(99, 'NC-04U', 'Suffix Array'),
(100, 'MC-09U', 'Segment Tree'),
(101, 'MC-09U', 'BIT'),
(102, 'MC-09U', 'Persistent'),
(103, 'MC-09U', 'Optimization'),
(104, 'WC-44U', 'DP'),
(105, 'WC-44U', 'Combinatorics'),
(106, 'WC-44U', 'Probability'),
(107, 'WC-42', 'Graphs'),
(108, 'WC-42', 'Trees'),
(109, 'WC-42', 'Greedy'),
(110, 'BLZ-08', 'Math'),
(111, 'BLZ-08', 'Implementation'),
(112, 'WC-41', 'Arrays'),
(113, 'WC-41', 'Binary Search'),
(114, 'WC-41', 'Two Pointers'),
(115, 'MC-08', 'Segment Tree'),
(116, 'MC-08', 'BIT'),
(117, 'MC-08', 'String'),
(118, 'NC-03', 'Strings'),
(119, 'NC-03', 'Hashing'),
(120, 'NC-03', 'Trie');

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `statement` text NOT NULL,
  `input_format` text DEFAULT NULL,
  `output_format` text DEFAULT NULL,
  `constraints_text` text DEFAULT NULL,
  `difficulty` enum('Easy','Medium','Hard') NOT NULL DEFAULT 'Medium',
  `points` int(11) NOT NULL DEFAULT 100,
  `time_limit_seconds` decimal(6,2) NOT NULL DEFAULT 1.00,
  `memory_limit_mb` int(11) NOT NULL DEFAULT 256,
  `has_editorial` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`id`, `author_id`, `title`, `statement`, `input_format`, `output_format`, `constraints_text`, `difficulty`, `points`, `time_limit_seconds`, `memory_limit_mb`, `has_editorial`, `created_at`, `updated_at`) VALUES
(2, 6, 'asdf', 'as', 'a', 'f', 'sd', 'Medium', 100, 1.00, 256, 0, '2026-04-27 17:27:50', '2026-04-27 17:27:50');

-- --------------------------------------------------------

--
-- Table structure for table `problem_editorials`
--

CREATE TABLE `problem_editorials` (
  `id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `markdown_content` text DEFAULT NULL,
  `code_content` text DEFAULT NULL,
  `video_link` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `problem_tags`
--

CREATE TABLE `problem_tags` (
  `id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `tag_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `problem_tags`
--

INSERT INTO `problem_tags` (`id`, `problem_id`, `tag_name`) VALUES
(4, 2, 'Graph');

-- --------------------------------------------------------

--
-- Table structure for table `problem_test_cases`
--

CREATE TABLE `problem_test_cases` (
  `id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `input_text` text NOT NULL,
  `output_text` text NOT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `problem_test_cases`
--

INSERT INTO `problem_test_cases` (`id`, `problem_id`, `input_text`, `output_text`, `is_hidden`, `sort_order`) VALUES
(3, 2, 'as', 'df', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'siyam', 'x@gmail.com', '$2b$10$.DHmCaTGFZi3UG3tDO5Fm.uTaDg31AFE5RRcPi4FKn5NaZpM6uV6.', 'student', '2026-04-01 09:18:07'),
(2, 'siyam', 'a@gmail.com', '$2b$10$m7Ndd5vOdb7vcpLBzWiqaOUxOuY1IPS4CNgF0PYewidaTtVtB74A6', 'student', '2026-04-02 06:14:21'),
(3, 'Codex Test', 'codex.test.1775233015@example.com', '$2b$10$rVYU07vcpjInVD3fvGZ/luTNrUxkiKu2Sxfnj8nLKhwfc1.B9PPQm', 'student', '2026-04-03 16:16:55'),
(4, 'Playwright Smoke', 'playwright+20260416195149@example.com', '$2b$10$54HLnk4c9eJIkrsFzYaSC.FzW9Zt7x9LAk58gWanojWNFFlgQOpUq', 'student', '2026-04-16 13:51:56'),
(5, 'a', 'ab@gmail.com', '$2b$10$jlJFNqwIdtcQLD6PyRp0Ce7bmrICjxxAGBlpiT44URAoYnryVyw.y', 'student', '2026-04-16 18:12:16'),
(6, 'admin', 'admin@gmail.com', '$2b$10$66FKBFmWCtMN7iZOruv0xuhfIt1ol50ikdA8oj2uIkpbTs63b7Ify', 'admin', '2026-04-27 14:05:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contests`
--
ALTER TABLE `contests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contest_access`
--
ALTER TABLE `contest_access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_contest_access` (`user_id`,`contest_id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `contest_announcements`
--
ALTER TABLE `contest_announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `contest_leaderboard`
--
ALTER TABLE `contest_leaderboard`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_contest_user_lb` (`contest_id`,`user_id`);

--
-- Indexes for table `contest_problems`
--
ALTER TABLE `contest_problems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `contest_queries`
--
ALTER TABLE `contest_queries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contest_id` (`contest_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_contest_registration` (`user_id`,`contest_id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `contest_results`
--
ALTER TABLE `contest_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_contest_result` (`user_id`,`contest_id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `contest_submissions`
--
ALTER TABLE `contest_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contest_id` (`contest_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `contest_tags`
--
ALTER TABLE `contest_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_problems_author_id` (`author_id`);

--
-- Indexes for table `problem_editorials`
--
ALTER TABLE `problem_editorials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_problem_editorial` (`problem_id`),
  ADD KEY `idx_problem_editorials_problem_id` (`problem_id`);

--
-- Indexes for table `problem_tags`
--
ALTER TABLE `problem_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_problem_tag` (`problem_id`,`tag_name`),
  ADD KEY `idx_problem_tags_problem_id` (`problem_id`);

--
-- Indexes for table `problem_test_cases`
--
ALTER TABLE `problem_test_cases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_problem_test_cases_problem_id` (`problem_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contest_access`
--
ALTER TABLE `contest_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contest_announcements`
--
ALTER TABLE `contest_announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contest_leaderboard`
--
ALTER TABLE `contest_leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `contest_problems`
--
ALTER TABLE `contest_problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

--
-- AUTO_INCREMENT for table `contest_queries`
--
ALTER TABLE `contest_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `contest_results`
--
ALTER TABLE `contest_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `contest_submissions`
--
ALTER TABLE `contest_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contest_tags`
--
ALTER TABLE `contest_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `problem_editorials`
--
ALTER TABLE `problem_editorials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `problem_tags`
--
ALTER TABLE `problem_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `problem_test_cases`
--
ALTER TABLE `problem_test_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contest_access`
--
ALTER TABLE `contest_access`
  ADD CONSTRAINT `contest_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contest_access_ibfk_2` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_announcements`
--
ALTER TABLE `contest_announcements`
  ADD CONSTRAINT `contest_announcements_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_leaderboard`
--
ALTER TABLE `contest_leaderboard`
  ADD CONSTRAINT `contest_leaderboard_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_problems`
--
ALTER TABLE `contest_problems`
  ADD CONSTRAINT `contest_problems_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_queries`
--
ALTER TABLE `contest_queries`
  ADD CONSTRAINT `contest_queries_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contest_queries_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  ADD CONSTRAINT `contest_registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contest_registrations_ibfk_2` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_results`
--
ALTER TABLE `contest_results`
  ADD CONSTRAINT `contest_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contest_results_ibfk_2` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_submissions`
--
ALTER TABLE `contest_submissions`
  ADD CONSTRAINT `contest_submissions_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contest_submissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_tags`
--
ALTER TABLE `contest_tags`
  ADD CONSTRAINT `contest_tags_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `fk_problems_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `problem_editorials`
--
ALTER TABLE `problem_editorials`
  ADD CONSTRAINT `fk_problem_editorials_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `problem_tags`
--
ALTER TABLE `problem_tags`
  ADD CONSTRAINT `fk_problem_tags_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `problem_test_cases`
--
ALTER TABLE `problem_test_cases`
  ADD CONSTRAINT `fk_problem_test_cases_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
