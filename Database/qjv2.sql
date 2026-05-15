-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2026 at 11:24 AM
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
-- Database: `qjv2`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievement_definitions`
--

CREATE TABLE `achievement_definitions` (
  `code` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `achievement_definitions`
--

INSERT INTO `achievement_definitions` (`code`, `label`, `icon`, `sort_order`, `created_at`) VALUES
('all_easy', 'All Easy', 'Gem', 8, '2026-05-08 16:25:50'),
('all_hard', 'All Hard', 'Swords', 10, '2026-05-08 16:25:50'),
('all_medium', 'All Medium', 'Shield', 9, '2026-05-08 16:25:50'),
('contest_winner', 'Contest Winner', 'Trophy', 12, '2026-05-08 16:25:50'),
('first_ac', 'First AC', 'Zap', 1, '2026-05-08 16:25:50'),
('five_languages', '5 Languages', 'Code', 5, '2026-05-08 16:25:50'),
('hundred_day_streak', '100-Day Streak', 'Infinity', 11, '2026-05-08 16:25:50'),
('hundred_solved', '100 Solved', 'Star', 3, '2026-05-08 16:25:50'),
('seven_day_streak', '7-Day Streak', 'Flame', 2, '2026-05-08 16:25:50'),
('thirty_day_streak', '30-Day Streak', 'Rocket', 6, '2026-05-08 16:25:50'),
('top_50', 'Top 50', 'Crown', 4, '2026-05-08 16:25:50'),
('two_hundred_solved', '200 Solved', 'Brain', 7, '2026-05-08 16:25:50');

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` int(11) NOT NULL,
  `recipient_user_id` int(11) NOT NULL,
  `actor_user_id` int(11) DEFAULT NULL,
  `type` varchar(80) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `href` varchar(500) DEFAULT NULL,
  `entity_type` varchar(80) NOT NULL,
  `entity_id` varchar(80) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `recipient_user_id`, `actor_user_id`, `type`, `title`, `body`, `href`, `entity_type`, `entity_id`, `is_read`, `read_at`, `created_at`) VALUES
(1, 2, 2, 'problem_missing_editorial', 'Editorial needed', 'Add an editorial for Add Two Numbers.', '/admin/editorials', 'problem', '1', 1, '2026-05-10 00:00:48', '2026-05-09 17:55:30'),
(2, 2, 2, 'problem_missing_editorial', 'Editorial needed', 'Add an editorial for Even or Odd.', '/admin/editorials', 'problem', '2', 1, '2026-05-10 00:00:48', '2026-05-09 17:56:39'),
(3, 2, 2, 'problem_missing_editorial', 'Editorial needed', 'Add an editorial for Maximum in an Array.', '/admin/editorials', 'problem', '3', 1, '2026-05-10 00:00:48', '2026-05-09 17:57:57'),
(4, 2, 2, 'problem_missing_editorial', 'Editorial needed', 'Add an editorial for Count Vowels.', '/admin/editorials', 'problem', '4', 1, '2026-05-10 00:00:48', '2026-05-09 17:59:21'),
(5, 2, 2, 'problem_missing_editorial', 'Editorial needed', 'Add an editorial for Balanced Brackets.', '/admin/editorials', 'problem', '5', 1, '2026-05-10 00:00:48', '2026-05-09 18:00:23'),
(6, 2, 4, 'contest_submission', 'New contest submission', 'Add Two Numbers received a AC submission in Test-2.', '/admin/contests/T-MOYRFMDPE94V/submissions', 'submission', '1', 1, '2026-05-10 02:00:40', '2026-05-09 19:53:18'),
(7, 2, 4, 'contest_submission', 'New contest submission', 'Add Two Numbers received a CE submission in Test-2.', '/admin/contests/T-MOYRFMDPE94V/submissions', 'submission', '2', 1, '2026-05-10 02:00:40', '2026-05-09 19:59:20'),
(8, 2, 4, 'contest_submission', 'New contest submission', 'Add Two Numbers received a AC submission in Test-2.', '/admin/contests/T-MOYRFMDPE94V/submissions', 'submission', '3', 1, '2026-05-10 02:00:40', '2026-05-09 19:59:33'),
(9, 2, 4, 'contest_submission', 'New contest submission', 'Even or Odd received a AC submission in test3.', '/admin/contests/T-MOZLVK672R8S/submissions', 'submission', '4', 1, '2026-05-10 16:19:28', '2026-05-10 10:06:17'),
(10, 2, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in test3.', '/admin/contests/T-MOZLVK672R8S/submissions', 'submission', '5', 1, '2026-05-10 16:19:28', '2026-05-10 10:08:50'),
(11, 2, 3, 'contest_query', 'New contest question', 'HExEN asked a question in test3.', '/admin/contests/T-MOZLVK672R8S/queries', 'contest_query', '1', 1, '2026-05-10 16:19:08', '2026-05-10 10:09:31'),
(12, 2, 3, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in test3.', '/admin/contests/T-MOZLVK672R8S/submissions', 'submission', '6', 1, '2026-05-10 16:19:28', '2026-05-10 10:10:52'),
(13, 2, 3, 'contest_submission', 'New contest submission', 'Even or Odd received a AC submission in test3.', '/admin/contests/T-MOZLVK672R8S/submissions', 'submission', '7', 1, '2026-05-10 16:19:28', '2026-05-10 10:11:44'),
(14, 2, 3, 'contest_submission', 'New contest submission', 'Add Two Numbers received a AC submission in Test-4.', '/admin/contests/T-MOZVBFE4HCIB/submissions', 'submission', '8', 0, NULL, '2026-05-10 14:29:51'),
(15, 1, 3, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-4.', '/admin/contests/T-MP044GIN78FK/submissions', 'submission', '12', 1, '2026-05-11 00:51:58', '2026-05-10 18:42:01'),
(16, 1, 3, 'contest_submission', 'New contest submission', 'Even or Odd received a AC submission in Test-4.', '/admin/contests/T-MP044GIN78FK/submissions', 'submission', '13', 1, '2026-05-11 00:51:58', '2026-05-10 18:42:41'),
(17, 1, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a AC submission in Test-4.', '/admin/contests/T-MP044GIN78FK/submissions', 'submission', '14', 1, '2026-05-11 00:51:58', '2026-05-10 18:43:39'),
(18, 1, 4, 'contest_submission', 'New contest submission', 'Even or Odd received a AC submission in Test-4.', '/admin/contests/T-MP044GIN78FK/submissions', 'submission', '15', 1, '2026-05-11 00:51:58', '2026-05-10 18:44:24'),
(19, 1, 3, 'contest_submission', 'New contest submission', 'Count Vowels received a CE submission in Test-4.', '/admin/contests/T-MP044GIN78FK/submissions', 'submission', '16', 1, '2026-05-11 00:51:58', '2026-05-10 18:51:31'),
(20, 1, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-4.', '/admin/contests/T-MP044GIN78FK/submissions', 'submission', '17', 1, '2026-05-11 01:19:25', '2026-05-10 19:11:49'),
(21, 1, 3, 'contest_submission', 'New contest submission', 'Balanced Brackets received a AC submission in Test-4.', '/admin/contests/T-MP044GIN78FK/submissions', 'submission', '18', 1, '2026-05-11 12:36:36', '2026-05-11 05:25:13'),
(22, 1, 3, 'contest_query', 'New contest question', 'HExEN asked a question in Test-4.', '/admin/contests/T-MP044GIN78FK/queries', 'contest_query', '2', 1, '2026-05-11 12:36:36', '2026-05-11 05:32:42'),
(23, 5, 3, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-6.', '/admin/contests/T-MP0S36E5W7U1/submissions', 'submission', '22', 0, NULL, '2026-05-11 05:46:28'),
(24, 5, 3, 'contest_submission', 'New contest submission', 'Even or Odd received a AC submission in Test-6.', '/admin/contests/T-MP0S36E5W7U1/submissions', 'submission', '23', 0, NULL, '2026-05-11 05:46:38'),
(25, 5, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a AC submission in Test-6.', '/admin/contests/T-MP0S36E5W7U1/submissions', 'submission', '24', 0, NULL, '2026-05-11 05:47:45'),
(26, 1, 6, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '25', 0, NULL, '2026-05-11 06:38:21'),
(27, 1, 6, 'contest_submission', 'New contest submission', 'Even or Odd received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '26', 0, NULL, '2026-05-11 06:38:28'),
(28, 1, 6, 'contest_submission', 'New contest submission', 'Balanced Brackets received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '27', 0, NULL, '2026-05-11 06:38:36'),
(29, 1, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a CE submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '28', 0, NULL, '2026-05-11 06:39:22'),
(30, 1, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a CE submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '29', 0, NULL, '2026-05-11 06:39:29'),
(31, 1, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a CE submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '30', 0, NULL, '2026-05-11 06:39:36'),
(32, 1, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a CE submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '31', 0, NULL, '2026-05-11 06:39:56'),
(33, 1, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a CE submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '32', 0, NULL, '2026-05-11 06:40:04'),
(34, 1, 4, 'contest_submission', 'New contest submission', 'Balanced Brackets received a WA submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '33', 0, NULL, '2026-05-11 06:40:25'),
(35, 1, 3, 'contest_submission', 'New contest submission', 'Balanced Brackets received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '34', 0, NULL, '2026-05-11 06:40:45'),
(36, 1, 4, 'contest_submission', 'New contest submission', 'Even or Odd received a WA submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '35', 0, NULL, '2026-05-11 06:48:20'),
(37, 1, 4, 'contest_submission', 'New contest submission', 'Even or Odd received a WA submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '36', 0, NULL, '2026-05-11 06:48:27'),
(38, 1, 4, 'contest_submission', 'New contest submission', 'Even or Odd received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '37', 0, NULL, '2026-05-11 06:48:32'),
(39, 1, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '38', 0, NULL, '2026-05-11 08:28:59'),
(40, 1, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '39', 0, NULL, '2026-05-11 08:29:02'),
(41, 1, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '40', 0, NULL, '2026-05-11 08:29:24'),
(42, 1, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '41', 0, NULL, '2026-05-11 08:29:38'),
(43, 1, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a CE submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '42', 0, NULL, '2026-05-11 08:32:52'),
(44, 1, 4, 'contest_submission', 'New contest submission', 'Count Vowels received a AC submission in Test-7.', '/admin/contests/T-MP0TXT62DJ2D/submissions', 'submission', '43', 0, NULL, '2026-05-11 08:32:59');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) NOT NULL,
  `actor_user_id` int(11) DEFAULT NULL,
  `actor_email` varchar(150) DEFAULT NULL,
  `actor_role` varchar(30) DEFAULT NULL,
  `action` varchar(80) NOT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` varchar(100) DEFAULT NULL,
  `target_label` varchar(255) DEFAULT NULL,
  `target_user_id` int(11) DEFAULT NULL,
  `target_email` varchar(150) DEFAULT NULL,
  `status` enum('success','failed') NOT NULL DEFAULT 'success',
  `message` varchar(500) DEFAULT NULL,
  `metadata` longtext DEFAULT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `code_drafts`
--

CREATE TABLE `code_drafts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `contest_id` varchar(50) DEFAULT '',
  `contest_problem_code` varchar(20) DEFAULT '',
  `language` varchar(30) NOT NULL,
  `source_code` mediumtext NOT NULL,
  `custom_input` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `code_drafts`
--

INSERT INTO `code_drafts` (`id`, `user_id`, `problem_id`, `contest_id`, `contest_problem_code`, `language`, `source_code`, `custom_input`, `updated_at`) VALUES
(1, 4, 4, 'T-MP0TXT62DJ2D', 'A', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // your code here\n\n    return 0;\n}\n', '', '2026-05-11 09:03:07');

-- --------------------------------------------------------

--
-- Table structure for table `contests`
--

CREATE TABLE `contests` (
  `id` varchar(30) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
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
  `rating_finalized_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contests`
--

INSERT INTO `contests` (`id`, `created_by`, `name`, `description`, `start_time`, `duration_minutes`, `status`, `contest_type`, `problems_count`, `participants_count`, `requires_password`, `password_hash`, `is_rated`, `rating_finalized_at`, `created_at`, `updated_at`) VALUES
('T-MOYQCC8F5HYI', 2, 'Test-1', NULL, '2026-05-10 01:21:00', 3, 'past', 'Contest', 2, 0, 1, '$2b$12$y1K7920WX/b9H2iOxGywtuBmokHC1C8XdEfTYUcoH3R2H3BJaKvZi', 0, NULL, '2026-05-09 19:21:22', '2026-05-09 19:43:23'),
('T-MOYRFMDPE94V', 2, 'Test-2', NULL, '2026-05-10 01:51:00', 4, 'past', 'Contest', 2, 0, 1, '$2b$12$HYGsiVTBajWUc3.OF7UB/uwWe7U9KxuMgTxdpytbYMYLn5z6YUI2C', 0, NULL, '2026-05-09 19:51:54', '2026-05-09 19:59:45'),
('T-MOZLVK672R8S', 2, 'test3', NULL, '2026-05-10 16:05:00', 15, 'past', 'Contest', 2, 0, 0, NULL, 0, NULL, '2026-05-10 10:04:06', '2026-05-10 10:22:01'),
('T-MOZVBFE4HCIB', 2, 'Test-4', NULL, '2026-05-10 20:28:00', 12, 'past', 'Contest', 3, 0, 0, NULL, 0, NULL, '2026-05-10 14:28:23', '2026-05-10 15:00:44'),
('T-MP044GIN78FK', 1, 'Test-4', NULL, '2026-05-11 00:38:00', 18, 'past', 'Contest', 3, 2, 0, NULL, 1, '2026-05-11 12:06:49', '2026-05-10 18:34:55', '2026-05-11 06:06:49'),
('T-MP0S36E5W7U1', 5, 'Test-6', NULL, '2026-05-11 11:45:00', 14, 'past', 'Contest', 3, 2, 0, NULL, 1, '2026-05-11 12:06:49', '2026-05-11 05:45:46', '2026-05-11 06:06:49'),
('T-MP0TXT62DJ2D', 1, 'Test-7', 'Leaderboard Score check', '2026-05-11 12:38:00', 17, 'past', 'Contest', 3, 3, 0, NULL, 1, '2026-05-11 12:55:01', '2026-05-11 06:37:34', '2026-05-11 06:55:01');

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
(1, 3, 'T-MOYQCC8F5HYI', '2026-05-09 19:35:33'),
(3, 4, 'T-MOYRFMDPE94V', '2026-05-09 19:52:25');

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
(1, 'T-MOZLVK672R8S', 'hurry up', 'Hurrryyyyy', '2026-05-10 16:14:10'),
(2, 'T-MP0S36E5W7U1', 'Wishes', 'Best Of Luck', '2026-05-11 11:46:00'),
(3, 'T-MP0TXT62DJ2D', 'kemon lagseee', 'valo to?', '2026-05-11 12:44:47');

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
  `total_points` int(11) NOT NULL DEFAULT 0,
  `total_penalty` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_leaderboard`
--

INSERT INTO `contest_leaderboard` (`id`, `contest_id`, `user_id`, `username`, `solved`, `total_points`, `total_penalty`) VALUES
(1, 'T-MP044GIN78FK', 4, 'ViGor', 2, 180, 13),
(2, 'T-MP044GIN78FK', 3, 'HExEN', 2, 130, 10),
(3, 'T-MP0S36E5W7U1', 3, 'HExEN', 2, 130, 4),
(4, 'T-MP0S36E5W7U1', 4, 'ViGor', 1, 100, 3),
(5, 'T-MP0TXT62DJ2D', 6, 'SluR', 3, 230, 0),
(6, 'T-MP0TXT62DJ2D', 3, 'HExEN', 1, 100, 2),
(7, 'T-MP0TXT62DJ2D', 4, 'ViGor', 1, 80, 50);

-- --------------------------------------------------------

--
-- Table structure for table `contest_problems`
--

CREATE TABLE `contest_problems` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `problem_id` int(11) DEFAULT NULL,
  `problem_code` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `statement` text DEFAULT NULL,
  `input_format` text DEFAULT NULL,
  `output_format` text DEFAULT NULL,
  `constraints_text` text DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `points` int(11) NOT NULL DEFAULT 100,
  `time_limit_seconds` decimal(6,2) NOT NULL DEFAULT 1.00,
  `memory_limit_mb` int(11) NOT NULL DEFAULT 256,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_problems`
--

INSERT INTO `contest_problems` (`id`, `contest_id`, `problem_id`, `problem_code`, `title`, `statement`, `input_format`, `output_format`, `constraints_text`, `difficulty`, `points`, `time_limit_seconds`, `memory_limit_mb`, `sort_order`) VALUES
(1, 'T-MOYQCC8F5HYI', 5, 'A', 'Balanced Brackets', 'Given a string containing only (, ), {, }, [ and ], determine whether the brackets are balanced.', 's', 'Print YES if the brackets are balanced, otherwise print NO', '1 <= length of s <= 10^5', 'medium', 100, 1.00, 256, 1),
(2, 'T-MOYQCC8F5HYI', 4, 'B', 'Count Vowels', 'Given a lowercase English string, count how many vowels it contains.\n\nVowels are a, e, i, o, and u.', 's', 'Print the number of vowels.', '1 <= length of s <= 10^5', 'easy', 50, 1.00, 256, 2),
(3, 'T-MOYRFMDPE94V', 1, 'A', 'Add Two Numbers', 'Given two integers a and b, print their sum.', 'a b', 'sum of a and b', '-10^9 <= a, b <= 10^9', 'easy', 80, 1.00, 256, 1),
(4, 'T-MOYRFMDPE94V', 2, 'B', 'Even or Odd', 'Given an integer n, determine whether it is even or odd.', 'n', 'Print Even if the number is even, otherwise print Odd.', '1 <= n <= 10^9', 'medium', 80, 1.00, 256, 2),
(5, 'T-MOZLVK672R8S', 2, 'A', 'Even or Odd', 'Given an integer n, determine whether it is even or odd.', 'n', 'Print Even if the number is even, otherwise print Odd.', '1 <= n <= 10^9', 'medium', 80, 1.00, 256, 1),
(6, 'T-MOZLVK672R8S', 4, 'B', 'Count Vowels', 'Given a lowercase English string, count how many vowels it contains.\n\nVowels are a, e, i, o, and u.', 's', 'Print the number of vowels.', '1 <= length of s <= 10^5', 'easy', 50, 1.00, 256, 2),
(7, 'T-MOZVBFE4HCIB', 4, 'A', 'Count Vowels', 'Given a lowercase English string, count how many vowels it contains.\n\nVowels are a, e, i, o, and u.', 's', 'Print the number of vowels.', '1 <= length of s <= 10^5', 'easy', 50, 1.00, 256, 1),
(8, 'T-MOZVBFE4HCIB', 3, 'B', 'Maximum in an Array', 'Given an array of n integers, find the maximum value.', 'n\na1 a2 a3 ... an', 'Print the largest number.', '1 <= n <= 10^5\n-10^9 <= ai <= 10^9', 'easy', 50, 1.00, 256, 2),
(9, 'T-MOZVBFE4HCIB', 1, 'C', 'Add Two Numbers', 'Given two integers a and b, print their sum.', 'a b', 'sum of a and b', '-10^9 <= a, b <= 10^9', 'easy', 80, 1.00, 256, 3),
(10, 'T-MP044GIN78FK', 4, 'A', 'Count Vowels', 'Given a lowercase English string, count how many vowels it contains.\n\nVowels are a, e, i, o, and u.', 's', 'Print the number of vowels.', '1 <= length of s <= 10^5', 'easy', 50, 1.00, 256, 1),
(11, 'T-MP044GIN78FK', 2, 'B', 'Even or Odd', 'Given an integer n, determine whether it is even or odd.', 'n', 'Print Even if the number is even, otherwise print Odd.', '1 <= n <= 10^9', 'medium', 80, 1.00, 256, 2),
(12, 'T-MP044GIN78FK', 5, 'C', 'Balanced Brackets', 'Given a string containing only (, ), {, }, [ and ], determine whether the brackets are balanced.', 's', 'Print YES if the brackets are balanced, otherwise print NO', '1 <= length of s <= 10^5', 'medium', 100, 1.00, 256, 3),
(13, 'T-MP0S36E5W7U1', 4, 'A', 'Count Vowels', 'Given a lowercase English string, count how many vowels it contains.\n\nVowels are a, e, i, o, and u.', 's', 'Print the number of vowels.', '1 <= length of s <= 10^5', 'easy', 50, 1.00, 256, 1),
(14, 'T-MP0S36E5W7U1', 2, 'B', 'Even or Odd', 'Given an integer n, determine whether it is even or odd.', 'n', 'Print Even if the number is even, otherwise print Odd.', '1 <= n <= 10^9', 'medium', 80, 1.00, 256, 2),
(15, 'T-MP0S36E5W7U1', 5, 'C', 'Balanced Brackets', 'Given a string containing only (, ), {, }, [ and ], determine whether the brackets are balanced.', 's', 'Print YES if the brackets are balanced, otherwise print NO', '1 <= length of s <= 10^5', 'medium', 100, 1.00, 256, 3),
(16, 'T-MP0TXT62DJ2D', 4, 'A', 'Count Vowels', 'Given a lowercase English string, count how many vowels it contains.\n\nVowels are a, e, i, o, and u.', 's', 'Print the number of vowels.', '1 <= length of s <= 10^5', 'easy', 50, 1.00, 256, 1),
(17, 'T-MP0TXT62DJ2D', 2, 'B', 'Even or Odd', 'Given an integer n, determine whether it is even or odd.', 'n', 'Print Even if the number is even, otherwise print Odd.', '1 <= n <= 10^9', 'medium', 80, 1.00, 256, 2),
(18, 'T-MP0TXT62DJ2D', 5, 'C', 'Balanced Brackets', 'Given a string containing only (, ), {, }, [ and ], determine whether the brackets are balanced.', 's', 'Print YES if the brackets are balanced, otherwise print NO', '1 <= length of s <= 10^5', 'medium', 100, 1.00, 256, 3);

-- --------------------------------------------------------

--
-- Table structure for table `contest_problem_tags`
--

CREATE TABLE `contest_problem_tags` (
  `id` int(11) NOT NULL,
  `contest_problem_id` int(11) NOT NULL,
  `tag_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_problem_tags`
--

INSERT INTO `contest_problem_tags` (`id`, `contest_problem_id`, `tag_name`) VALUES
(2, 1, 'Stack'),
(1, 1, 'String'),
(3, 2, 'String'),
(4, 3, 'Math'),
(5, 4, 'Math'),
(6, 5, 'Math'),
(7, 6, 'String'),
(8, 7, 'String'),
(9, 8, 'Array'),
(10, 9, 'Math'),
(11, 10, 'String'),
(12, 11, 'Math'),
(14, 12, 'Stack'),
(13, 12, 'String'),
(15, 13, 'String'),
(16, 14, 'Math'),
(18, 15, 'Stack'),
(17, 15, 'String'),
(19, 16, 'String'),
(20, 17, 'Math'),
(22, 18, 'Stack'),
(21, 18, 'String');

-- --------------------------------------------------------

--
-- Table structure for table `contest_problem_test_cases`
--

CREATE TABLE `contest_problem_test_cases` (
  `id` int(11) NOT NULL,
  `contest_problem_id` int(11) NOT NULL,
  `input_text` text NOT NULL,
  `output_text` text NOT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_problem_test_cases`
--

INSERT INTO `contest_problem_test_cases` (`id`, `contest_problem_id`, `input_text`, `output_text`, `is_hidden`, `sort_order`) VALUES
(1, 1, '{[()]}\n', 'YES\n', 0, 0),
(2, 2, 'quickjudge\n', '4\n', 0, 0),
(3, 3, '5 7\n', '12\n', 0, 0),
(4, 4, '9\n', 'Odd\n', 0, 0),
(5, 5, '9\n', 'Odd\n', 0, 0),
(6, 6, 'quickjudge\n', '4\n', 0, 0),
(7, 7, 'quickjudge\n', '4\n', 0, 0),
(8, 8, '5\n3 9 1 7 4\n', '9\n', 0, 0),
(9, 9, '5 7\n', '12\n', 0, 0),
(10, 10, 'quickjudge\n', '4\n', 0, 0),
(11, 11, '9\n', 'Odd\n', 0, 0),
(12, 12, '{[()]}\n', 'YES\n', 0, 0),
(13, 13, 'quickjudge\n', '4\n', 0, 0),
(14, 14, '9\n', 'Odd\n', 0, 0),
(15, 15, '{[()]}\n', 'YES\n', 0, 0),
(16, 16, 'quickjudge\n', '4\n', 0, 0),
(17, 17, '9\n', 'Odd\n', 0, 0),
(18, 18, '{[()]}\n', 'YES\n', 0, 0);

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
(1, 'T-MOZLVK672R8S', 3, 'HExEN', 'is question B\'s Output correct?', 'yes', 'answered', '2026-05-10 16:09:31', '2026-05-10 16:13:48'),
(2, 'T-MP044GIN78FK', 3, 'HExEN', 'dsafafdsa', NULL, 'pending', '2026-05-11 11:32:42', NULL);

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
(1, 4, 'T-MOZLVK672R8S', '2026-05-10 10:04:24'),
(2, 3, 'T-MP044GIN78FK', '2026-05-10 18:35:15'),
(3, 6, 'T-MP0TXT62DJ2D', '2026-05-11 06:37:45');

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
(1, 4, 'T-MP044GIN78FK', 1, 1, 2, 2),
(2, 3, 'T-MP044GIN78FK', 1, 2, 2, 2),
(3, 3, 'T-MP0S36E5W7U1', 1, 1, 2, 2),
(4, 4, 'T-MP0S36E5W7U1', 1, 2, 2, 1),
(5, 6, 'T-MP0TXT62DJ2D', 1, 1, 3, 3),
(6, 3, 'T-MP0TXT62DJ2D', 1, 2, 3, 1),
(7, 4, 'T-MP0TXT62DJ2D', 1, 3, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `contest_submissions`
--

CREATE TABLE `contest_submissions` (
  `id` int(11) NOT NULL,
  `contest_id` varchar(30) NOT NULL,
  `user_id` int(11) NOT NULL,
  `problem_id` int(11) DEFAULT NULL,
  `problem_code` varchar(10) NOT NULL,
  `language` varchar(30) NOT NULL,
  `verdict` enum('Accepted','Wrong Answer','Time Limit Exceeded','Runtime Error','Compilation Error') NOT NULL,
  `is_scored` tinyint(1) NOT NULL DEFAULT 1,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_submissions`
--

INSERT INTO `contest_submissions` (`id`, `contest_id`, `user_id`, `problem_id`, `problem_code`, `language`, `verdict`, `is_scored`, `submitted_at`) VALUES
(1, 'T-MOYRFMDPE94V', 4, 1, 'A', 'cpp', 'Accepted', 1, '2026-05-10 01:53:18'),
(2, 'T-MOYRFMDPE94V', 4, 1, 'A', 'cpp', 'Compilation Error', 0, '2026-05-10 01:59:20'),
(3, 'T-MOYRFMDPE94V', 4, 1, 'A', 'cpp', 'Accepted', 0, '2026-05-10 01:59:33'),
(4, 'T-MOZLVK672R8S', 4, 2, 'A', 'cpp', 'Accepted', 1, '2026-05-10 16:06:17'),
(5, 'T-MOZLVK672R8S', 4, 4, 'B', 'cpp', 'Accepted', 1, '2026-05-10 16:08:50'),
(6, 'T-MOZLVK672R8S', 3, 4, 'B', 'cpp', 'Accepted', 1, '2026-05-10 16:10:52'),
(7, 'T-MOZLVK672R8S', 3, 2, 'A', 'cpp', 'Accepted', 1, '2026-05-10 16:11:44'),
(8, 'T-MOZVBFE4HCIB', 3, 1, 'C', 'cpp', 'Accepted', 1, '2026-05-10 20:29:51'),
(9, 'T-MP044GIN78FK', 3, 4, 'A', 'cpp', 'Accepted', 1, '2026-05-11 00:42:01'),
(10, 'T-MP044GIN78FK', 3, 2, 'B', 'cpp', 'Accepted', 1, '2026-05-11 00:42:41'),
(11, 'T-MP044GIN78FK', 4, 5, 'C', 'cpp', 'Accepted', 1, '2026-05-11 00:43:39'),
(12, 'T-MP044GIN78FK', 4, 2, 'B', 'cpp', 'Accepted', 1, '2026-05-11 00:44:24'),
(13, 'T-MP044GIN78FK', 3, 4, 'A', 'cpp', 'Compilation Error', 1, '2026-05-11 00:51:31'),
(14, 'T-MP044GIN78FK', 4, 4, 'A', 'cpp', 'Accepted', 0, '2026-05-11 01:11:49'),
(15, 'T-MP044GIN78FK', 3, 5, 'C', 'cpp', 'Accepted', 0, '2026-05-11 11:25:13'),
(16, 'T-MP0S36E5W7U1', 3, 4, 'A', 'cpp', 'Accepted', 1, '2026-05-11 11:46:28'),
(17, 'T-MP0S36E5W7U1', 3, 2, 'B', 'cpp', 'Accepted', 1, '2026-05-11 11:46:38'),
(18, 'T-MP0S36E5W7U1', 4, 5, 'C', 'cpp', 'Accepted', 1, '2026-05-11 11:47:45'),
(19, 'T-MP0TXT62DJ2D', 6, 4, 'A', 'cpp', 'Accepted', 1, '2026-05-11 12:38:21'),
(20, 'T-MP0TXT62DJ2D', 6, 2, 'B', 'cpp', 'Accepted', 1, '2026-05-11 12:38:28'),
(21, 'T-MP0TXT62DJ2D', 6, 5, 'C', 'cpp', 'Accepted', 1, '2026-05-11 12:38:36'),
(22, 'T-MP0TXT62DJ2D', 4, 5, 'C', 'cpp', 'Compilation Error', 1, '2026-05-11 12:39:22'),
(23, 'T-MP0TXT62DJ2D', 4, 5, 'C', 'cpp', 'Compilation Error', 1, '2026-05-11 12:39:29'),
(24, 'T-MP0TXT62DJ2D', 4, 5, 'C', 'cpp', 'Compilation Error', 1, '2026-05-11 12:39:36'),
(25, 'T-MP0TXT62DJ2D', 4, 5, 'C', 'cpp', 'Compilation Error', 1, '2026-05-11 12:39:56'),
(26, 'T-MP0TXT62DJ2D', 4, 5, 'C', 'cpp', 'Compilation Error', 1, '2026-05-11 12:40:04'),
(27, 'T-MP0TXT62DJ2D', 4, 5, 'C', 'cpp', 'Wrong Answer', 1, '2026-05-11 12:40:25'),
(28, 'T-MP0TXT62DJ2D', 3, 5, 'C', 'cpp', 'Accepted', 1, '2026-05-11 12:40:45'),
(29, 'T-MP0TXT62DJ2D', 4, 2, 'B', 'cpp', 'Wrong Answer', 1, '2026-05-11 12:48:20'),
(30, 'T-MP0TXT62DJ2D', 4, 2, 'B', 'cpp', 'Wrong Answer', 1, '2026-05-11 12:48:27'),
(31, 'T-MP0TXT62DJ2D', 4, 2, 'B', 'cpp', 'Accepted', 1, '2026-05-11 12:48:32'),
(32, 'T-MP0TXT62DJ2D', 4, 4, 'A', 'cpp', 'Accepted', 0, '2026-05-11 14:28:59'),
(33, 'T-MP0TXT62DJ2D', 4, 4, 'A', 'cpp', 'Accepted', 0, '2026-05-11 14:29:02'),
(34, 'T-MP0TXT62DJ2D', 4, 4, 'A', 'cpp', 'Accepted', 0, '2026-05-11 14:29:24'),
(35, 'T-MP0TXT62DJ2D', 4, 4, 'A', 'cpp', 'Accepted', 0, '2026-05-11 14:29:38'),
(36, 'T-MP0TXT62DJ2D', 4, 4, 'A', 'cpp', 'Compilation Error', 0, '2026-05-11 14:32:52'),
(37, 'T-MP0TXT62DJ2D', 4, 4, 'A', 'cpp', 'Accepted', 0, '2026-05-11 14:32:59');

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
(1, 'T-MOYQCC8F5HYI', 'String'),
(2, 'T-MOYQCC8F5HYI', 'Stack'),
(3, 'T-MOYRFMDPE94V', 'Math'),
(4, 'T-MOZLVK672R8S', 'Math'),
(5, 'T-MOZLVK672R8S', 'String'),
(6, 'T-MOZVBFE4HCIB', 'String'),
(7, 'T-MOZVBFE4HCIB', 'Array'),
(8, 'T-MOZVBFE4HCIB', 'Math'),
(9, 'T-MP044GIN78FK', 'String'),
(10, 'T-MP044GIN78FK', 'Math'),
(11, 'T-MP044GIN78FK', 'Stack'),
(12, 'T-MP0S36E5W7U1', 'String'),
(13, 'T-MP0S36E5W7U1', 'Math'),
(14, 'T-MP0S36E5W7U1', 'Stack'),
(15, 'T-MP0TXT62DJ2D', 'String'),
(16, 'T-MP0TXT62DJ2D', 'Math'),
(17, 'T-MP0TXT62DJ2D', 'Stack');

-- --------------------------------------------------------

--
-- Table structure for table `discussion_posts`
--

CREATE TABLE `discussion_posts` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `discussion_posts`
--

INSERT INTO `discussion_posts` (`id`, `author_id`, `title`, `body`, `created_at`, `updated_at`) VALUES
(1, 4, 'Somossa', 'Website Bug Vallok e Vora. Ki kora jay?', '2026-05-11 12:03:45', '2026-05-11 12:03:45');

-- --------------------------------------------------------

--
-- Table structure for table `discussion_replies`
--

CREATE TABLE `discussion_replies` (
  `id` int(11) NOT NULL,
  `discussion_id` int(11) NOT NULL,
  `parent_reply_id` int(11) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`id`, `author_id`, `title`, `statement`, `input_format`, `output_format`, `constraints_text`, `difficulty`, `points`, `time_limit_seconds`, `memory_limit_mb`, `has_editorial`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 2, 'Add Two Numbers', 'Given two integers a and b, print their sum.', 'a b', 'sum of a and b', '-10^9 <= a, b <= 10^9', 'Easy', 80, 1.00, 256, 0, 0, '2026-05-09 17:55:30', '2026-05-09 17:55:30'),
(2, 2, 'Even or Odd', 'Given an integer n, determine whether it is even or odd.', 'n', 'Print Even if the number is even, otherwise print Odd.', '1 <= n <= 10^9', 'Medium', 80, 1.00, 256, 0, 1, '2026-05-09 17:56:39', '2026-05-10 09:37:48'),
(3, 2, 'Maximum in an Array', 'Given an array of n integers, find the maximum value.', 'n\na1 a2 a3 ... an', 'Print the largest number.', '1 <= n <= 10^5\n-10^9 <= ai <= 10^9', 'Easy', 50, 1.00, 256, 0, 0, '2026-05-09 17:57:57', '2026-05-09 17:57:57'),
(4, 2, 'Count Vowels', 'Given a lowercase English string, count how many vowels it contains.\n\nVowels are a, e, i, o, and u.', 's', 'Print the number of vowels.', '1 <= length of s <= 10^5', 'Easy', 50, 1.00, 256, 0, 1, '2026-05-09 17:59:21', '2026-05-10 09:37:58'),
(5, 2, 'Balanced Brackets', 'Given a string containing only (, ), {, }, [ and ], determine whether the brackets are balanced.', 's', 'Print YES if the brackets are balanced, otherwise print NO', '1 <= length of s <= 10^5', 'Medium', 100, 1.00, 256, 0, 1, '2026-05-09 18:00:23', '2026-05-09 19:51:16');

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
(1, 1, 'Math'),
(2, 2, 'Math'),
(3, 3, 'Array'),
(4, 4, 'String'),
(6, 5, 'Stack'),
(5, 5, 'String');

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
(1, 1, '5 7\n', '12\n', 0, 0),
(2, 2, '9\n', 'Odd\n', 0, 0),
(3, 3, '5\n3 9 1 7 4\n', '9\n', 0, 0),
(4, 4, 'quickjudge\n', '4\n', 0, 0),
(5, 5, '{[()]}\n', 'YES\n', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `problem_id` int(11) DEFAULT NULL,
  `contest_id` varchar(30) DEFAULT NULL,
  `contest_problem_code` varchar(10) DEFAULT NULL,
  `problem_title` varchar(255) NOT NULL,
  `contest_name` varchar(255) DEFAULT NULL,
  `language` varchar(30) NOT NULL,
  `source_code` longtext NOT NULL,
  `verdict` enum('AC','WA','TLE','RE','CE','MLE','PE') NOT NULL,
  `runtime_ms` int(11) DEFAULT NULL,
  `memory_kb` int(11) DEFAULT NULL,
  `test_case_note` text DEFAULT NULL,
  `is_scored` tinyint(1) NOT NULL DEFAULT 1,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `user_id`, `problem_id`, `contest_id`, `contest_problem_code`, `problem_title`, `contest_name`, `language`, `source_code`, `verdict`, `runtime_ms`, `memory_kb`, `test_case_note`, `is_scored`, `submitted_at`) VALUES
(1, 4, 1, 'T-MOYRFMDPE94V', 'A', 'Add Two Numbers', 'Test-2', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;cin>> x>>y;\n    cout<<x+y<<endl;\n    return 0;\n}\n', 'AC', 3, 1024, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1024 KB)', 1, '2026-05-10 01:53:18'),
(2, 4, 1, 'T-MOYRFMDPE94V', 'A', 'Add Two Numbers', 'Test-2', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;cin>> x>>y;\n    cout<<x+y<<endl\n    return 0;\n}\n', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:9:20: error: expected ‘;’ before ‘return’\n    9 |     cout<<x+y<<endl\n      |                    ^\n      |                    ;\n   10 |     return 0;\n      |     ~~~~~~          \n', 0, '2026-05-10 01:59:20'),
(3, 4, 1, 'T-MOYRFMDPE94V', 'A', 'Add Two Numbers', 'Test-2', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;cin>> x>>y;\n    cout<<x+y<<endl;\n    return 0;\n}\n', 'AC', 2, 1228, 'All 1 test cases passed.\nTest 1: PASS (2ms, 1228 KB)', 0, '2026-05-10 01:59:33'),
(4, 4, 2, 'T-MOZLVK672R8S', 'A', 'Even or Odd', 'test3', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n   int n;cin>> n;if(n%2)cout<<\"Odd\";else cout<<\"Even\";\n\n    return 0;\n}\n', 'AC', 2, 1152, 'All 1 test cases passed.\nTest 1: PASS (2ms, 1152 KB)', 1, '2026-05-10 16:06:17'),
(5, 4, 4, 'T-MOZLVK672R8S', 'B', 'Count Vowels', 'test3', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string s;cin>> s;\n    int cnt=0;\n\n    for (int i=0;i<s.size();i++){\n        if(s[i]==\'a\'||s[i]==\'e\'||s[i]==\'i\'||s[i]==\'o\'||s[i]==\'u\')\n        cnt++;\n    }\n    cout<<cnt<<endl;\n    return 0;\n}\n', 'AC', 3, 1200, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1200 KB)', 1, '2026-05-10 16:08:50'),
(6, 3, 4, 'T-MOZLVK672R8S', 'B', 'Count Vowels', 'test3', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string s;cin>> s;\n    int cnt=0;\n\n    for (int i=0;i<s.size();i++){\n        if(s[i]==\'a\'||s[i]==\'e\'||s[i]==\'i\'||s[i]==\'o\'||s[i]==\'u\')\n        cnt++;\n    }\n    cout<<cnt<<endl;\n    return 0;\n}\n', 'AC', 3, 872, 'All 1 test cases passed.\nTest 1: PASS (3ms, 872 KB)', 1, '2026-05-10 16:10:52'),
(7, 3, 2, 'T-MOZLVK672R8S', 'A', 'Even or Odd', 'test3', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;\n    if(n%2)cout<<\"Odd\";\n    else cout<<\"Even\";\n\n    return 0;\n}\n', 'AC', 3, 1272, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1272 KB)', 1, '2026-05-10 16:11:44'),
(8, 3, 1, 'T-MOZVBFE4HCIB', 'C', 'Add Two Numbers', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;\n    cin>> x>>y;\n    cout<<x+y<<endl;\n\n    return 0;\n}\n', 'AC', 3, 1268, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1268 KB)', 1, '2026-05-10 20:29:51');
INSERT INTO `submissions` (`id`, `user_id`, `problem_id`, `contest_id`, `contest_problem_code`, `problem_title`, `contest_name`, `language`, `source_code`, `verdict`, `runtime_ms`, `memory_kb`, `test_case_note`, `is_scored`, `submitted_at`) VALUES
(9, 3, 2, NULL, NULL, 'Even or Odd', NULL, 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n\n    return 0;\n}\n', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:8:28: error: no match for ‘operator==’ (operand types are ‘std::basic_ostream<char>’ and ‘int’)\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                   ~~~~~~~~~^~~\n      |                       |      |\n      |                       |      int\n      |                       std::basic_ostream<char>\nmain.cpp:8:28: note: candidate: ‘operator==(int, int)’ <built-in>\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                   ~~~~~~~~~^~~\nmain.cpp:8:28: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘int’\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1026:5: note: candidate: ‘template<class _BiIter> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, const std::__cxx11::sub_match<_BiIter>&)’\n 1026 |     operator==(const sub_match<_BiIter>& __lhs, const sub_match<_BiIter>& __rhs)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1026:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1099:5: note: candidate: ‘template<class _Bi_iter, class _Ch_traits, class _Ch_alloc> bool std::__cxx11::operator==(std::__cxx11::__sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>&, const std::__cxx11::sub_match<_BiIter>&)’\n 1099 |     operator==(const __sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1099:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘std::__cxx11::__sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1173:5: note: candidate: ‘template<class _Bi_iter, class _Ch_traits, class _Ch_alloc> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, std::__cxx11::__sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>&)’\n 1173 |     operator==(const sub_match<_Bi_iter>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1173:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1247:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const typename std::iterator_traits<_Iter>::value_type*, const std::__cxx11::sub_match<_BiIter>&)’\n 1247 |     operator==(typename iterator_traits<_Bi_iter>::value_type const* __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1247:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::__cxx11::sub_match<_BiIter>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1321:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, const typename std::iterator_traits<_Iter>::value_type*)’\n 1321 |     operator==(const sub_match<_Bi_iter>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1321:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1395:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const typename std::iterator_traits<_Iter>::value_type&, const std::__cxx11::sub_match<_BiIter>&)’\n 1395 |     operator==(typename iterator_traits<_Bi_iter>::value_type const& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1395:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::__cxx11::sub_match<_BiIter>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1473:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, const typename std::iterator_traits<_Iter>::value_type&)’\n 1473 |     operator==(const sub_match<_Bi_iter>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1473:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1991:5: note: candidate: ‘template<class _Bi_iter, class _Alloc> bool std::__cxx11::operator==(const std::__cxx11::match_results<_BiIter, _Alloc>&, const std::__cxx11::match_results<_BiIter, _Alloc>&)’\n 1991 |     operator==(const match_results<_Bi_iter, _Alloc>& __m1,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1991:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::match_results<_BiIter, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/iosfwd:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/postypes.h:222:5: note: candidate: ‘template<class _StateT> bool std::operator==(const std::fpos<_StateT>&, const std::fpos<_StateT>&)’\n  222 |     operator==(const fpos<_StateT>& __lhs, const fpos<_StateT>& __rhs)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/postypes.h:222:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::fpos<_StateT>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:64,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_pair.h:448:5: note: candidate: ‘template<class _T1, class _T2> constexpr bool std::operator==(const std::pair<_T1, _T2>&, const std::pair<_T1, _T2>&)’\n  448 |     operator==(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_pair.h:448:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::pair<_T1, _T2>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:325:5: note: candidate: ‘template<class _Iterator> bool std::operator==(const std::reverse_iterator<_Iterator>&, const std::reverse_iterator<_Iterator>&)’\n  325 |     operator==(const reverse_iterator<_Iterator>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:325:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::reverse_iterator<_Iterator>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:363:5: note: candidate: ‘template<class _IteratorL, class _IteratorR> bool std::operator==(const std::reverse_iterator<_Iterator>&, const std::reverse_iterator<_IteratorR>&)’\n  363 |     operator==(const reverse_iterator<_IteratorL>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:363:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::reverse_iterator<_Iterator>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1139:5: note: candidate: ‘template<class _IteratorL, class _IteratorR> bool std::operator==(const std::move_iterator<_IteratorL>&, const std::move_iterator<_IteratorR>&)’\n 1139 |     operator==(const move_iterator<_IteratorL>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1139:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::move_iterator<_IteratorL>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1145:5: note: candidate: ‘template<class _Iterator> bool std::operator==(const std::move_iterator<_IteratorL>&, const std::move_iterator<_IteratorL>&)’\n 1145 |     operator==(const move_iterator<_Iterator>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1145:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::move_iterator<_IteratorL>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/allocator.h:168:5: note: candidate: ‘template<class _T1, class _T2> bool std::operator==(const std::allocator<_CharT>&, const std::allocator<_T2>&)’\n  168 |     operator==(const allocator<_T1>&, const allocator<_T2>&)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/allocator.h:168:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::allocator<_CharT>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6141:5: note: candidate: ‘template<class _CharT, class _Traits, class _Alloc> bool std::operator==(const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&, const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&)’\n 6141 |     operator==(const basic_string<_CharT, _Traits, _Alloc>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6141:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6149:5: note: candidate: ‘template<class _CharT> typename __gnu_cxx::__enable_if<std::__is_char<_Tp>::__value, bool>::__type std::operator==(const std::__cxx11::basic_string<_CharT>&, const std::__cxx11::basic_string<_CharT>&)’\n 6149 |     operator==(const basic_string<_CharT>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6149:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::basic_string<_CharT>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6163:5: note: candidate: ‘template<class _CharT, class _Traits, class _Alloc> bool std::operator==(const _CharT*, const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&)’\n 6163 |     operator==(const _CharT* __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6163:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const _CharT*’ and ‘std::basic_ostream<char>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6175:5: note: candidate: ‘template<class _CharT, class _Traits, class _Alloc> bool std::operator==(const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&, const _CharT*)’\n 6175 |     operator==(const basic_string<_CharT, _Traits, _Alloc>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6175:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:46,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:292:3: note: candidate: ‘bool std::operator==(const std::error_code&, const std::error_code&)’\n  292 |   operator==(const error_code& __lhs, const error_code& __rhs) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:292:32: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_code&’\n  292 |   operator==(const error_code& __lhs, const error_code& __rhs) noexcept\n      |              ~~~~~~~~~~~~~~~~~~^~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:297:3: note: candidate: ‘bool std::operator==(const std::error_code&, const std::error_condition&)’\n  297 |   operator==(const error_code& __lhs, const error_condition& __rhs) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:297:32: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_code&’\n  297 |   operator==(const error_code& __lhs, const error_condition& __rhs) noexcept\n      |              ~~~~~~~~~~~~~~~~~~^~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:304:3: note: candidate: ‘bool std::operator==(const std::error_condition&, const std::error_code&)’\n  304 |   operator==(const error_condition& __lhs, const error_code& __rhs) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:304:37: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_condition&’\n  304 |   operator==(const error_condition& __lhs, const error_code& __rhs) noexcept\n      |              ~~~~~~~~~~~~~~~~~~~~~~~^~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:311:3: note: candidate: ‘bool std::operator==(const std::error_condition&, const std::error_condition&)’\n  311 |   operator==(const error_condition& __lhs,\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:311:37: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_condition&’\n  311 |   operator==(const error_condition& __lhs,\n      |              ~~~~~~~~~~~~~~~~~~~~~~~^~~~~\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_facets.h:48,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_ios.h:37,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:44,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/streambuf_iterator.h:208:5: note: candidate: ‘template<class _CharT, class _Traits> bool std::operator==(const std::istreambuf_iterator<_CharT, _Traits>&, const std::istreambuf_iterator<_CharT, _Traits>&)’\n  208 |     operator==(const istreambuf_iterator<_CharT, _Traits>& __a,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/streambuf_iterator.h:208:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::istreambuf_iterator<_CharT, _Traits>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:459:5: note: candidate: ‘template<class _Tp> constexpr bool std::operator==(const std::complex<_Tp>&, const std::complex<_Tp>&)’\n  459 |     operator==(const complex<_Tp>& __x, const complex<_Tp>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:459:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::complex<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:464:5: note: candidate: ‘template<class _Tp> constexpr bool std::operator==(const std::complex<_Tp>&, const _Tp&)’\n  464 |     operator==(const complex<_Tp>& __x, const _Tp& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:464:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::complex<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:469:5: note: candidate: ‘template<class _Tp> constexpr bool std::operator==(const _Tp&, const std::complex<_Tp>&)’\n  469 |     operator==(const _Tp& __x, const complex<_Tp>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:469:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::complex<_Tp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/deque:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:68,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:283:5: note: candidate: ‘template<class _Tp, class _Ref, class _Ptr> bool std::operator==(const std::_Deque_iterator<_Tp, _Ref, _Ptr>&, const std::_Deque_iterator<_Tp, _Ref, _Ptr>&)’\n  283 |     operator==(const _Deque_iterator<_Tp, _Ref, _Ptr>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:283:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Deque_iterator<_Tp, _Ref, _Ptr>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/deque:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:68,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:290:5: note: candidate: ‘template<class _Tp, class _RefL, class _PtrL, class _RefR, class _PtrR> bool std::operator==(const std::_Deque_iterator<_Tp, _Ref, _Ptr>&, const std::_Deque_iterator<_Tp, _RefR, _PtrR>&)’\n  290 |     operator==(const _Deque_iterator<_Tp, _RefL, _PtrL>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:290:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Deque_iterator<_Tp, _Ref, _Ptr>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/deque:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:68,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:2309:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::deque<_Tp, _Alloc>&, const std::deque<_Tp, _Alloc>&)’\n 2309 |     operator==(const deque<_Tp, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:2309:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::deque<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/tuple:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:54,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/array:252:5: note: candidate: ‘template<class _Tp, long unsigned int _Nm> bool std::operator==(const std::array<_Tp, _Nm>&, const std::array<_Tp, _Nm>&)’\n  252 |     operator==(const array<_Tp, _Nm>& __one, const array<_Tp, _Nm>& __two)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/array:252:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::array<_Tp, _Nm>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:54,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/tuple:1419:5: note: candidate: ‘template<class ... _TElements, class ... _UElements> constexpr bool std::operator==(const std::tuple<_Tps ...>&, const std::tuple<_Elements ...>&)’\n 1419 |     operator==(const tuple<_TElements...>& __t,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/tuple:1419:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::tuple<_Tps ...>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:59,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:748:5: note: candidate: ‘template<class _Res, class ... _Args> bool std::operator==(const std::function<_Res(_ArgTypes ...)>&, std::nullptr_t)’\n  748 |     operator==(const function<_Res(_Args...)>& __f, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:748:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::function<_Res(_ArgTypes ...)>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:59,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:754:5: note: candidate: ‘template<class _Res, class ... _Args> bool std::operator==(std::nullptr_t, const std::function<_Res(_ArgTypes ...)>&)’\n  754 |     operator==(nullptr_t, const function<_Res(_Args...)>& __f) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:754:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::function<_Res(_ArgTypes ...)>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_conv.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/locale:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/iomanip:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:72,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:707:5: note: candidate: ‘template<class _Tp, class _Dp, class _Up, class _Ep> bool std::operator==(const std::unique_ptr<_Tp, _Dp>&, const std::unique_ptr<_Up, _Ep>&)’\n  707 |     operator==(const unique_ptr<_Tp, _Dp>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:707:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unique_ptr<_Tp, _Dp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_conv.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/locale:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/iomanip:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:72,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:713:5: note: candidate: ‘template<class _Tp, class _Dp> bool std::operator==(const std::unique_ptr<_Tp, _Dp>&, std::nullptr_t)’\n  713 |     operator==(const unique_ptr<_Tp, _Dp>& __x, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:713:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unique_ptr<_Tp, _Dp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_conv.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/locale:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/iomanip:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:72,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:718:5: note: candidate: ‘template<class _Tp, class _Dp> bool std::operator==(std::nullptr_t, const std::unique_ptr<_Tp, _Dp>&)’\n  718 |     operator==(nullptr_t, const unique_ptr<_Tp, _Dp>& __x) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:718:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::unique_ptr<_Tp, _Dp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/iterator:66,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:77,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stream_iterator.h:134:5: note: candidate: ‘template<class _Tp, class _CharT, class _Traits, class _Dist> bool std::operator==(const std::istream_iterator<_Tp, _CharT, _Traits, _Dist>&, const std::istream_iterator<_Tp, _CharT, _Traits, _Dist>&)’\n  134 |     operator==(const istream_iterator<_Tp, _CharT, _Traits, _Dist>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stream_iterator.h:134:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::istream_iterator<_Tp, _CharT, _Traits, _Dist>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/list:63,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:79,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_list.h:1991:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::__cxx11::list<_Tp, _Alloc>&, const std::__cxx11::list<_Tp, _Alloc>&)’\n 1991 |     operator==(const list<_Tp, _Alloc>& __x, const list<_Tp, _Alloc>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_list.h:1991:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::list<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/map:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:81,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_map.h:1455:5: note: candidate: ‘template<class _Key, class _Tp, class _Compare, class _Alloc> bool std::operator==(const std::map<_Key, _Tp, _Compare, _Alloc>&, const std::map<_Key, _Tp, _Compare, _Alloc>&)’\n 1455 |     operator==(const map<_Key, _Tp, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_map.h:1455:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::map<_Key, _Tp, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/map:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:81,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multimap.h:1119:5: note: candidate: ‘template<class _Key, class _Tp, class _Compare, class _Alloc> bool std::operator==(const std::multimap<_Key, _Tp, _Compare, _Alloc>&, const std::multimap<_Key, _Tp, _Compare, _Alloc>&)’\n 1119 |     operator==(const multimap<_Key, _Tp, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multimap.h:1119:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::multimap<_Key, _Tp, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:52,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1412:5: note: candidate: ‘template<class _Tp1, class _Tp2, __gnu_cxx::_Lock_policy _Lp> bool std::operator==(const std::__shared_ptr<_Tp1, _Lp>&, const std::__shared_ptr<_Tp2, _Lp>&)’\n 1412 |     operator==(const __shared_ptr<_Tp1, _Lp>& __a,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1412:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__shared_ptr<_Tp1, _Lp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:52,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1418:5: note: candidate: ‘template<class _Tp, __gnu_cxx::_Lock_policy _Lp> bool std::operator==(const std::__shared_ptr<_Tp, _Lp>&, std::nullptr_t)’\n 1418 |     operator==(const __shared_ptr<_Tp, _Lp>& __a, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1418:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__shared_ptr<_Tp, _Lp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:52,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1423:5: note: candidate: ‘template<class _Tp, __gnu_cxx::_Lock_policy _Lp> bool std::operator==(std::nullptr_t, const std::__shared_ptr<_Tp, _Lp>&)’\n 1423 |     operator==(nullptr_t, const __shared_ptr<_Tp, _Lp>& __a) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1423:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::__shared_ptr<_Tp, _Lp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:383:5: note: candidate: ‘template<class _Tp, class _Up> bool std::operator==(const std::shared_ptr<_Tp>&, const std::shared_ptr<_Tp>&)’\n  383 |     operator==(const shared_ptr<_Tp>& __a, const shared_ptr<_Up>& __b) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:383:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::shared_ptr<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:388:5: note: candidate: ‘template<class _Tp> bool std::operator==(const std::shared_ptr<_Tp>&, std::nullptr_t)’\n  388 |     operator==(const shared_ptr<_Tp>& __a, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:388:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::shared_ptr<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:393:5: note: candidate: ‘template<class _Tp> bool std::operator==(std::nullptr_t, const std::shared_ptr<_Tp>&)’\n  393 |     operator==(nullptr_t, const shared_ptr<_Tp>& __a) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:393:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::shared_ptr<_Tp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/vector:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/queue:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:86,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_vector.h:1888:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::vector<_Tp, _Alloc>&, const std::vector<_Tp, _Alloc>&)’\n 1888 |     operator==(const vector<_Tp, _Alloc>& __x, const vector<_Tp, _Alloc>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_vector.h:1888:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::vector<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/queue:64,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:86,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_queue.h:338:5: note: candidate: ‘template<class _Tp, class _Seq> bool std::operator==(const std::queue<_Tp, _Seq>&, const std::queue<_Tp, _Seq>&)’\n  338 |     operator==(const queue<_Tp, _Seq>& __x, const queue<_Tp, _Seq>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_queue.h:338:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::queue<_Tp, _Seq>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/set:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:87,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_set.h:979:5: note: candidate: ‘template<class _Key, class _Compare, class _Alloc> bool std::operator==(const std::set<_Key, _Compare, _Alloc>&, const std::set<_Key, _Compare, _Alloc>&)’\n  979 |     operator==(const set<_Key, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_set.h:979:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::set<_Key, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/set:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:87,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multiset.h:964:5: note: candidate: ‘template<class _Key, class _Compare, class _Alloc> bool std::operator==(const std::multiset<_Key, _Compare, _Alloc>&, const std::multiset<_Key, _Compare, _Alloc>&)’\n  964 |     operator==(const multiset<_Key, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multiset.h:964:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::multiset<_Key, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/stack:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:89,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_stack.h:313:5: note: candidate: ‘template<class _Tp, class _Seq> bool std::operator==(const std::stack<_Tp, _Seq>&, const std::stack<_Tp, _Seq>&)’\n  313 |     operator==(const stack<_Tp, _Seq>& __x, const stack<_Tp, _Seq>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_stack.h:313:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::stack<_Tp, _Seq>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom1, class _Dom2> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Expr, std::_Expr, _Dom1, _Dom2>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::_Expr<_Dom1, typename _Dom1::value_type>&, const std::_Expr<_Dom2, typename _Dom2::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Expr, std::_Constant, _Dom, typename _Dom::value_type>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::_Expr<_Dom1, typename _Dom1::value_type>&, const typename _Dom::value_type&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Constant, std::_Expr, typename _Dom::value_type, _Dom>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const typename _Dom::value_type&, const std::_Expr<_Dom1, typename _Dom1::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Expr, std::_ValArray, _Dom, typename _Dom::value_type>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::_Expr<_Dom1, typename _Dom1::value_type>&, const std::valarray<typename _Dom::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_ValArray, std::_Expr, typename _Dom::value_type, _Dom>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::valarray<typename _Dom::value_type>&, const std::_Expr<_Dom1, typename _Dom1::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note: candidate: ‘template<class _Tp> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_ValArray, std::_ValArray, _Tp, _Tp>, typename std::__fun<std::__equal_to, _Tp>::result_type> std::operator==(const std::valarray<_Tp>&, const std::valarray<_Tp>&)’\n 1197 | _DEFINE_BINARY_OPERATOR(==, __equal_to)\n      | ^~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::valarray<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note: candidate: ‘template<class _Tp> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_ValArray, std::_Constant, _Tp, _Tp>, typename std::__fun<std::__equal_to, _Tp>::result_type> std::operator==(const std::valarray<_Tp>&, const typename std::valarray<_Tp>::value_type&)’\n 1197 | _DEFINE_BINARY_OPERATOR(==, __equal_to)\n      | ^~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::valarray<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note: candidate: ‘template<class _Tp> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Constant, std::_ValArray, _Tp, _Tp>, typename std::__fun<std::__equal_to, _Tp>::result_type> std::operator==(const typename std::valarray<_Tp>::value_type&, const std::valarray<_Tp>&)’\n 1197 | _DEFINE_BINARY_OPERATOR(==, __equal_to)\n      | ^~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::valarray<_Tp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/forward_list:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:104,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/forward_list.tcc:393:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::forward_list<_Tp, _Alloc>&, const std::forward_list<_Tp, _Alloc>&)’\n  393 |     operator==(const forward_list<_Tp, _Alloc>& __lx,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/forward_list.tcc:393:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::forward_list<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/future:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:105,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/thread:276:3: note: candidate: ‘bool std::operator==(std::thread::id, std::thread::id)’\n  276 |   operator==(thread::id __x, thread::id __y) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/thread:276:25: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘std::thread::id’\n  276 |   operator==(thread::id __x, thread::id __y) noexcept\n      |              ~~~~~~~~~~~^~~\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/random:51,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:108,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/random.tcc:1884:5: note: candidate: ‘template<class _RealType1> bool std::operator==(const std::normal_distribution<_RealType>&, const std::normal_distribution<_RealType>&)’\n 1884 |     operator==(const std::normal_distribution<_RealType>& __d1,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/random.tcc:1884:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::normal_distribution<_RealType>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:111,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/scoped_allocator:489:5: note: candidate: ‘template<class _OutA1, class _OutA2, class ... _InA> bool std::operator==(const std::scoped_allocator_adaptor<_OutA1, _InA ...>&, const std::scoped_allocator_adaptor<_InnerHead, _InnerTail ...>&)’\n  489 |     operator==(const scoped_allocator_adaptor<_OutA1, _InA...>& __a,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/scoped_allocator:489:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::scoped_allocator_adaptor<_OutA1, _InA ...>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_map:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:117,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2091:5: note: candidate: ‘template<class _Key, class _Tp, class _Hash, class _Pred, class _Alloc> bool std::operator==(const std::unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>&, const std::unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>&)’\n 2091 |     operator==(const unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2091:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_map:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:117,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2103:5: note: candidate: ‘template<class _Key, class _Tp, class _Hash, class _Pred, class _Alloc> bool std::operator==(const std::unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>&, const std::unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>&)’\n 2103 |     operator==(const unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2103:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_set:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:118,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_set.h:1703:5: note: candidate: ‘template<class _Value, class _Hash, class _Pred, class _Alloc> bool std::operator==(const std::unordered_set<_Value, _Hash, _Pred, _Alloc>&, const std::unordered_set<_Value, _Hash, _Pred, _Alloc>&)’\n 1703 |     operator==(const unordered_set<_Value, _Hash, _Pred, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_set.h:1703:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unordered_set<_Value, _Hash, _Pred, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_set:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:118,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_set.h:1715:5: note: candida', 1, '2026-05-11 00:23:30');
INSERT INTO `submissions` (`id`, `user_id`, `problem_id`, `contest_id`, `contest_problem_code`, `problem_title`, `contest_name`, `language`, `source_code`, `verdict`, `runtime_ms`, `memory_kb`, `test_case_note`, `is_scored`, `submitted_at`) VALUES
(10, 3, 2, NULL, NULL, 'Even or Odd', NULL, 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;cout<<n%2?\"Odd\":\"Even\"<<endl;\n\n    return 0;\n}\n', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:8:41: error: invalid operands of types ‘const char [5]’ and ‘<unresolved overloaded function type>’ to binary ‘operator<<’\n    8 |     int n;cin>> n;cout<<n%2?\"Odd\":\"Even\"<<endl;\n      |                                   ~~~~~~^~~~~~\n', 1, '2026-05-11 00:23:57'),
(11, 3, 2, NULL, NULL, 'Even or Odd', NULL, 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;cout<<(n%2?\"Odd\":\"Even\")<<endl;\n\n    return 0;\n}\n', 'AC', 3, 1332, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1332 KB)', 1, '2026-05-11 00:24:10'),
(12, 3, 4, 'T-MP044GIN78FK', 'A', 'Count Vowels', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'AC', 3, 1168, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1168 KB)', 1, '2026-05-11 00:42:01'),
(13, 3, 2, 'T-MP044GIN78FK', 'B', 'Even or Odd', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 1076, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1076 KB)', 1, '2026-05-11 00:42:41'),
(14, 4, 5, 'T-MP044GIN78FK', 'C', 'Balanced Brackets', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 1556, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1556 KB)', 1, '2026-05-11 00:43:39'),
(15, 4, 2, 'T-MP044GIN78FK', 'B', 'Even or Odd', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 896, 'All 1 test cases passed.\nTest 1: PASS (3ms, 896 KB)', 1, '2026-05-11 00:44:24'),
(16, 3, 4, 'T-MP044GIN78FK', 'A', 'Count Vowels', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n   gg\n\n    return 0;\n}\n', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:8:4: error: ‘gg’ was not declared in this scope\n    8 |    gg\n      |    ^~\n', 1, '2026-05-11 00:51:31'),
(17, 4, 4, 'T-MP044GIN78FK', 'A', 'Count Vowels', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'AC', 3, 1628, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1628 KB)', 0, '2026-05-11 01:11:49'),
(18, 3, 5, 'T-MP044GIN78FK', 'C', 'Balanced Brackets', 'Test-4', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 1380, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1380 KB)', 0, '2026-05-11 11:25:13'),
(19, 3, 4, NULL, NULL, 'Count Vowels', NULL, 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'AC', 3, 1388, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1388 KB)', 1, '2026-05-11 11:44:10'),
(20, 3, 4, NULL, NULL, 'Count Vowels', NULL, 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'AC', 3, 896, 'All 1 test cases passed.\nTest 1: PASS (3ms, 896 KB)', 1, '2026-05-11 11:44:14'),
(21, 3, 4, NULL, NULL, 'Count Vowels', NULL, 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'AC', 3, 1036, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1036 KB)', 1, '2026-05-11 11:44:17'),
(22, 3, 4, 'T-MP0S36E5W7U1', 'A', 'Count Vowels', 'Test-6', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'AC', 3, 1192, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1192 KB)', 1, '2026-05-11 11:46:28'),
(23, 3, 2, 'T-MP0S36E5W7U1', 'B', 'Even or Odd', 'Test-6', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 1252, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1252 KB)', 1, '2026-05-11 11:46:38'),
(24, 4, 5, 'T-MP0S36E5W7U1', 'C', 'Balanced Brackets', 'Test-6', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 1480, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1480 KB)', 1, '2026-05-11 11:47:45'),
(25, 6, 4, 'T-MP0TXT62DJ2D', 'A', 'Count Vowels', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'AC', 3, 1228, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1228 KB)', 1, '2026-05-11 12:38:21'),
(26, 6, 2, 'T-MP0TXT62DJ2D', 'B', 'Even or Odd', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 932, 'All 1 test cases passed.\nTest 1: PASS (3ms, 932 KB)', 1, '2026-05-11 12:38:28'),
(27, 6, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 884, 'All 1 test cases passed.\nTest 1: PASS (3ms, 884 KB)', 1, '2026-05-11 12:38:36'),
(28, 4, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0\n}', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:37:13: error: expected ‘;’ before ‘}’ token\n   37 |     return 0\n      |             ^\n      |             ;\n   38 | }\n      | ~            \n', 1, '2026-05-11 12:39:22'),
(29, 4, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0\n}', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:32:30: error: expected ‘;’ before ‘}’ token\n   32 |         cout << \"YES\" << endl\n      |                              ^\n      |                              ;\n   33 |     } else {\n      |     ~                         \nmain.cpp:37:13: error: expected ‘;’ before ‘}’ token\n   37 |     return 0\n      |             ^\n      |             ;\n   38 | }\n      | ~            \n', 1, '2026-05-11 12:39:29'),
(30, 4, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0\n}', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:15:37: error: expected ‘;’ before ‘return’\n   15 |                 cout << \"NO\" << endl\n      |                                     ^\n      |                                     ;\n   16 |                 return 0;\n      |                 ~~~~~~               \nmain.cpp:32:30: error: expected ‘;’ before ‘}’ token\n   32 |         cout << \"YES\" << endl\n      |                              ^\n      |                              ;\n   33 |     } else {\n      |     ~                         \nmain.cpp:37:13: error: expected ‘;’ before ‘}’ token\n   37 |     return 0\n      |             ^\n      |             ;\n   38 | }\n      | ~            \n', 1, '2026-05-11 12:39:36'),
(31, 4, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp:11:42: error: empty character constant\n   11 |         if (c == \'(\' || c == \'{\' || c == \'\') {\n      |                                          ^~\n', 1, '2026-05-11 12:39:56'),
(32, 4, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'\') { \n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp:11:42: error: empty character constant\n   11 |         if (c == \'(\' || c == \'{\' || c == \'\') {\n      |                                          ^~\n', 1, '2026-05-11 12:40:04'),
(33, 4, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'a\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'WA', 3, 1140, 'Wrong answer on test case 1.\n\nExpected:\nYES\n\nYour Output:\nNO', 1, '2026-05-11 12:40:25'),
(34, 3, 5, 'T-MP0TXT62DJ2D', 'C', 'Balanced Brackets', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 1040, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1040 KB)', 1, '2026-05-11 12:40:45'),
(35, 4, 2, 'T-MP0TXT62DJ2D', 'B', 'Even or Odd', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Od\" << endl;\n    }\n\n    return 0;\n}', 'WA', 2, 900, 'Wrong answer on test case 1.\n\nExpected:\nOdd\n\nYour Output:\nOd', 1, '2026-05-11 12:48:20'),
(36, 4, 2, 'T-MP0TXT62DJ2D', 'B', 'Even or Odd', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Od\" << endl;\n    }\n\n    return 0;\n}', 'WA', 3, 1280, 'Wrong answer on test case 1.\n\nExpected:\nOdd\n\nYour Output:\nOd', 1, '2026-05-11 12:48:27'),
(37, 4, 2, 'T-MP0TXT62DJ2D', 'B', 'Even or Odd', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'AC', 3, 1164, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1164 KB)', 1, '2026-05-11 12:48:32'),
(38, 4, 4, 'T-MP0TXT62DJ2D', 'A', 'Count Vowels', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'AC', 3, 1036, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1036 KB)', 0, '2026-05-11 14:28:59'),
(39, 4, 4, 'T-MP0TXT62DJ2D', 'A', 'Count Vowels', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'AC', 3, 1116, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1116 KB)', 0, '2026-05-11 14:29:02'),
(40, 4, 4, 'T-MP0TXT62DJ2D', 'A', 'Count Vowels', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'AC', 3, 1076, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1076 KB)', 0, '2026-05-11 14:29:24'),
(41, 4, 4, 'T-MP0TXT62DJ2D', 'A', 'Count Vowels', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'AC', 3, 1128, 'All 1 test cases passed.\nTest 1: PASS (3ms, 1128 KB)', 0, '2026-05-11 14:29:38'),
(42, 4, 4, 'T-MP0TXT62DJ2D', 'A', 'Count Vowels', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count\n\n    return 0;\n}', 'CE', 0, 0, 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:16:18: error: expected ‘;’ before ‘return’\n   16 |     cout << count\n      |                  ^\n      |                  ;\n   17 | \n   18 |     return 0;\n      |     ~~~~~~        \n', 0, '2026-05-11 14:32:52'),
(43, 4, 4, 'T-MP0TXT62DJ2D', 'A', 'Count Vowels', 'Test-7', 'cpp', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'AC', 3, 868, 'All 1 test cases passed.\nTest 1: PASS (3ms, 868 KB)', 0, '2026-05-11 14:32:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `userhandle` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','admin','super_admin') NOT NULL DEFAULT 'student',
  `account_status` enum('active','suspended','banned') NOT NULL DEFAULT 'active',
  `suspended_until` datetime DEFAULT NULL,
  `suspended_reason` text DEFAULT NULL,
  `banned_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `userhandle`, `email`, `password_hash`, `role`, `account_status`, `suspended_until`, `suspended_reason`, `banned_reason`, `created_at`, `updated_at`) VALUES
(1, 'SudO', 'SudO', 'sudo@gmail.com', '$2b$10$5Ke6fAVdFsX56Ddm9Z2Jr.xvnCHnrXQbryXjrNM5AeOa.LVk1i33e', 'super_admin', 'active', NULL, NULL, NULL, '2026-05-08 16:30:51', '2026-05-08 16:31:16'),
(2, 'The Monk', 'The Monk', 'monk@gmail.com', '$2b$10$ZTnMqhLjICd7TFy0rMmYTeQmsx7pB6O9bo1bnEsom7r8KdQ95aI1q', 'admin', 'active', NULL, NULL, NULL, '2026-05-08 16:35:46', '2026-05-08 16:35:46'),
(3, 'HExEN', 'HExEN', 'hexen@gmail.com', '$2b$10$sCMX2Gr2U8T6i.Un68UrU.2EclxNuMkkma0snlS6ZNCXiQPyvv7w2', 'student', 'active', NULL, NULL, NULL, '2026-05-08 16:46:15', '2026-05-08 16:46:15'),
(4, 'ViGor', 'ViGor', 'vigor@gmail.com', '$2b$10$lmSBiiV2FnygASXRZbV9eOQR0LIUwJKZUZ6fBFgJ4lFrenZzYLFzK', 'student', 'active', NULL, NULL, NULL, '2026-05-09 19:44:26', '2026-05-09 19:44:26'),
(5, 'Fury', 'Fury', 'fury@gmail.com', '$2b$10$mCUCBSLB/UPm7PhBVhNLieEBUbhKiRzkOMqYYmxahqbeKW/Pi0Wo2', 'admin', 'active', NULL, NULL, NULL, '2026-05-10 18:32:18', '2026-05-10 18:32:18'),
(6, 'SluR', 'SluR', 'slur@gmail.com', '$2b$10$PlwCm.bc/azqKPKF97.9UOcZgS1hE1DED83Z4Q5cBh03jbYVA6nIm', 'student', 'active', NULL, NULL, NULL, '2026-05-11 06:33:15', '2026-05-11 06:33:15');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_code` varchar(50) NOT NULL,
  `unlocked_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_activities`
--

CREATE TABLE `user_activities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity_type` varchar(30) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `problem_code` varchar(50) DEFAULT NULL,
  `problem_title` varchar(255) DEFAULT NULL,
  `verdict` varchar(20) DEFAULT NULL,
  `rating_change` int(11) DEFAULT NULL,
  `contest_code` varchar(30) DEFAULT NULL,
  `contest_name` varchar(255) DEFAULT NULL,
  `result_text` varchar(255) DEFAULT NULL,
  `related_submission_id` int(11) DEFAULT NULL,
  `related_achievement_code` varchar(50) DEFAULT NULL,
  `occurred_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activities`
--

INSERT INTO `user_activities` (`id`, `user_id`, `activity_type`, `title`, `problem_code`, `problem_title`, `verdict`, `rating_change`, `contest_code`, `contest_name`, `result_text`, `related_submission_id`, `related_achievement_code`, `occurred_at`) VALUES
(1, 4, 'solve', 'Solved Add Two Numbers', 'A', 'Add Two Numbers', 'AC', NULL, 'T-MOYRFMDPE94V', 'Test-2', NULL, 1, NULL, '2026-05-10 01:53:18'),
(2, 4, 'fail', 'Submitted Add Two Numbers', 'A', 'Add Two Numbers', 'CE', NULL, 'T-MOYRFMDPE94V', 'Test-2', NULL, 2, NULL, '2026-05-10 01:59:20'),
(3, 4, 'solve', 'Solved Add Two Numbers', 'A', 'Add Two Numbers', 'AC', NULL, 'T-MOYRFMDPE94V', 'Test-2', NULL, 3, NULL, '2026-05-10 01:59:33'),
(4, 4, 'solve', 'Solved Even or Odd', 'A', 'Even or Odd', 'AC', NULL, 'T-MOZLVK672R8S', 'test3', NULL, 4, NULL, '2026-05-10 16:06:17'),
(5, 4, 'solve', 'Solved Count Vowels', 'B', 'Count Vowels', 'AC', NULL, 'T-MOZLVK672R8S', 'test3', NULL, 5, NULL, '2026-05-10 16:08:50'),
(6, 3, 'solve', 'Solved Count Vowels', 'B', 'Count Vowels', 'AC', NULL, 'T-MOZLVK672R8S', 'test3', NULL, 6, NULL, '2026-05-10 16:10:52'),
(7, 3, 'solve', 'Solved Even or Odd', 'A', 'Even or Odd', 'AC', NULL, 'T-MOZLVK672R8S', 'test3', NULL, 7, NULL, '2026-05-10 16:11:44'),
(8, 3, 'solve', 'Solved Add Two Numbers', 'C', 'Add Two Numbers', 'AC', NULL, 'T-MOZVBFE4HCIB', 'Test-4', NULL, 8, NULL, '2026-05-10 20:29:51'),
(9, 3, 'fail', 'Submitted Even or Odd', '2', 'Even or Odd', 'CE', NULL, NULL, NULL, NULL, 9, NULL, '2026-05-11 00:23:30'),
(10, 3, 'fail', 'Submitted Even or Odd', '2', 'Even or Odd', 'CE', NULL, NULL, NULL, NULL, 10, NULL, '2026-05-11 00:23:57'),
(11, 3, 'solve', 'Solved Even or Odd', '2', 'Even or Odd', 'AC', NULL, NULL, NULL, NULL, 11, NULL, '2026-05-11 00:24:10'),
(12, 3, 'solve', 'Solved Count Vowels', 'A', 'Count Vowels', 'AC', NULL, 'T-MP044GIN78FK', 'Test-4', NULL, 12, NULL, '2026-05-11 00:42:01'),
(13, 3, 'solve', 'Solved Even or Odd', 'B', 'Even or Odd', 'AC', NULL, 'T-MP044GIN78FK', 'Test-4', NULL, 13, NULL, '2026-05-11 00:42:41'),
(14, 4, 'solve', 'Solved Balanced Brackets', 'C', 'Balanced Brackets', 'AC', NULL, 'T-MP044GIN78FK', 'Test-4', NULL, 14, NULL, '2026-05-11 00:43:39'),
(15, 4, 'solve', 'Solved Even or Odd', 'B', 'Even or Odd', 'AC', NULL, 'T-MP044GIN78FK', 'Test-4', NULL, 15, NULL, '2026-05-11 00:44:24'),
(16, 3, 'fail', 'Submitted Count Vowels', 'A', 'Count Vowels', 'CE', NULL, 'T-MP044GIN78FK', 'Test-4', NULL, 16, NULL, '2026-05-11 00:51:31'),
(17, 4, 'solve', 'Solved Count Vowels', 'A', 'Count Vowels', 'AC', NULL, 'T-MP044GIN78FK', 'Test-4', NULL, 17, NULL, '2026-05-11 01:11:49'),
(18, 3, 'solve', 'Solved Count Vowels', '4', 'Count Vowels', 'AC', NULL, NULL, NULL, NULL, 19, NULL, '2026-05-11 11:44:10'),
(19, 3, 'solve', 'Solved Count Vowels', '4', 'Count Vowels', 'AC', NULL, NULL, NULL, NULL, 20, NULL, '2026-05-11 11:44:14'),
(20, 3, 'solve', 'Solved Count Vowels', '4', 'Count Vowels', 'AC', NULL, NULL, NULL, NULL, 21, NULL, '2026-05-11 11:44:17'),
(21, 3, 'solve', 'Solved Count Vowels', 'A', 'Count Vowels', 'AC', NULL, 'T-MP0S36E5W7U1', 'Test-6', NULL, 22, NULL, '2026-05-11 11:46:28'),
(22, 3, 'solve', 'Solved Even or Odd', 'B', 'Even or Odd', 'AC', NULL, 'T-MP0S36E5W7U1', 'Test-6', NULL, 23, NULL, '2026-05-11 11:46:38'),
(23, 4, 'solve', 'Solved Balanced Brackets', 'C', 'Balanced Brackets', 'AC', NULL, 'T-MP0S36E5W7U1', 'Test-6', NULL, 24, NULL, '2026-05-11 11:47:45'),
(24, 4, 'rating', 'Rating updated after Test-4', NULL, NULL, NULL, 2000, 'T-MP044GIN78FK', 'Test-4', 'Rank #1 of 2', NULL, NULL, '2026-05-11 12:06:49'),
(25, 3, 'rating', 'Rating updated after Test-4', NULL, NULL, NULL, 400, 'T-MP044GIN78FK', 'Test-4', 'Rank #2 of 2', NULL, NULL, '2026-05-11 12:06:49'),
(26, 3, 'rating', 'Rating updated after Test-6', NULL, NULL, NULL, 400, 'T-MP0S36E5W7U1', 'Test-6', 'Rank #1 of 2', NULL, NULL, '2026-05-11 12:06:49'),
(27, 4, 'rating', 'Rating updated after Test-6', NULL, NULL, NULL, -400, 'T-MP0S36E5W7U1', 'Test-6', 'Rank #2 of 2', NULL, NULL, '2026-05-11 12:06:49'),
(28, 6, 'solve', 'Solved Count Vowels', 'A', 'Count Vowels', 'AC', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 25, NULL, '2026-05-11 12:38:21'),
(29, 6, 'solve', 'Solved Even or Odd', 'B', 'Even or Odd', 'AC', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 26, NULL, '2026-05-11 12:38:28'),
(30, 6, 'solve', 'Solved Balanced Brackets', 'C', 'Balanced Brackets', 'AC', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 27, NULL, '2026-05-11 12:38:36'),
(31, 4, 'fail', 'Submitted Balanced Brackets', 'C', 'Balanced Brackets', 'CE', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 28, NULL, '2026-05-11 12:39:22'),
(32, 4, 'fail', 'Submitted Balanced Brackets', 'C', 'Balanced Brackets', 'CE', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 29, NULL, '2026-05-11 12:39:29'),
(33, 4, 'fail', 'Submitted Balanced Brackets', 'C', 'Balanced Brackets', 'CE', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 30, NULL, '2026-05-11 12:39:36'),
(34, 4, 'fail', 'Submitted Balanced Brackets', 'C', 'Balanced Brackets', 'CE', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 31, NULL, '2026-05-11 12:39:56'),
(35, 4, 'fail', 'Submitted Balanced Brackets', 'C', 'Balanced Brackets', 'CE', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 32, NULL, '2026-05-11 12:40:04'),
(36, 4, 'fail', 'Submitted Balanced Brackets', 'C', 'Balanced Brackets', 'WA', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 33, NULL, '2026-05-11 12:40:25'),
(37, 3, 'solve', 'Solved Balanced Brackets', 'C', 'Balanced Brackets', 'AC', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 34, NULL, '2026-05-11 12:40:45'),
(38, 4, 'fail', 'Submitted Even or Odd', 'B', 'Even or Odd', 'WA', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 35, NULL, '2026-05-11 12:48:20'),
(39, 4, 'fail', 'Submitted Even or Odd', 'B', 'Even or Odd', 'WA', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 36, NULL, '2026-05-11 12:48:27'),
(40, 4, 'solve', 'Solved Even or Odd', 'B', 'Even or Odd', 'AC', NULL, 'T-MP0TXT62DJ2D', 'Test-7', NULL, 37, NULL, '2026-05-11 12:48:32'),
(41, 6, 'rating', 'Rating updated after Test-7', NULL, NULL, NULL, 150, 'T-MP0TXT62DJ2D', 'Test-7', 'Rank #1 of 3', NULL, NULL, '2026-05-11 12:55:01'),
(42, 3, 'rating', 'Rating updated after Test-7', NULL, NULL, NULL, 0, 'T-MP0TXT62DJ2D', 'Test-7', 'Rank #2 of 3', NULL, NULL, '2026-05-11 12:55:01'),
(43, 4, 'rating', 'Rating updated after Test-7', NULL, NULL, NULL, -150, 'T-MP0TXT62DJ2D', 'Test-7', 'Rank #3 of 3', NULL, NULL, '2026-05-11 12:55:01');

-- --------------------------------------------------------

--
-- Table structure for table `user_contests`
--

CREATE TABLE `user_contests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contest_code` varchar(30) NOT NULL,
  `contest_name` varchar(255) NOT NULL,
  `contest_date` date NOT NULL,
  `rank_position` int(11) DEFAULT NULL,
  `participants_count` int(11) NOT NULL DEFAULT 0,
  `solved_count` int(11) NOT NULL DEFAULT 0,
  `total_problems` int(11) NOT NULL DEFAULT 0,
  `rating_delta` int(11) NOT NULL DEFAULT 0,
  `rating_before` int(11) DEFAULT NULL,
  `rating_after` int(11) DEFAULT NULL,
  `is_rated` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_contests`
--

INSERT INTO `user_contests` (`id`, `user_id`, `contest_code`, `contest_name`, `contest_date`, `rank_position`, `participants_count`, `solved_count`, `total_problems`, `rating_delta`, `rating_before`, `rating_after`, `is_rated`, `created_at`) VALUES
(1, 4, 'T-MP044GIN78FK', 'Test-4', '2026-05-11', 1, 2, 2, 3, 2000, 0, 2000, 1, '2026-05-11 06:06:49'),
(2, 3, 'T-MP044GIN78FK', 'Test-4', '2026-05-11', 2, 2, 2, 3, 400, 0, 400, 1, '2026-05-11 06:06:49'),
(3, 3, 'T-MP0S36E5W7U1', 'Test-6', '2026-05-11', 1, 2, 2, 3, 400, 400, 800, 1, '2026-05-11 06:06:49'),
(4, 4, 'T-MP0S36E5W7U1', 'Test-6', '2026-05-11', 2, 2, 1, 3, -400, 2000, 1600, 1, '2026-05-11 06:06:49'),
(5, 6, 'T-MP0TXT62DJ2D', 'Test-7', '2026-05-11', 1, 3, 3, 3, 150, 0, 650, 1, '2026-05-11 06:55:01'),
(6, 3, 'T-MP0TXT62DJ2D', 'Test-7', '2026-05-11', 2, 3, 1, 3, 0, 800, 800, 1, '2026-05-11 06:55:01'),
(7, 4, 'T-MP0TXT62DJ2D', 'Test-7', '2026-05-11', 3, 3, 1, 3, -150, 1600, 1450, 1, '2026-05-11 06:55:01');

-- --------------------------------------------------------

--
-- Table structure for table `user_difficulty_stats`
--

CREATE TABLE `user_difficulty_stats` (
  `user_id` int(11) NOT NULL,
  `difficulty` enum('Easy','Medium','Hard') NOT NULL,
  `solved_count` int(11) NOT NULL DEFAULT 0,
  `total_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `user_id` int(11) NOT NULL,
  `public_id` varchar(50) NOT NULL,
  `department` varchar(120) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 0,
  `rating_delta` int(11) NOT NULL DEFAULT 0,
  `rating_tier` varchar(20) NOT NULL DEFAULT 'UNRATED',
  `global_rank` int(11) DEFAULT NULL,
  `rank_delta` int(11) NOT NULL DEFAULT 0,
  `solved_count` int(11) NOT NULL DEFAULT 0,
  `solved_delta` int(11) NOT NULL DEFAULT 0,
  `total_submissions` int(11) NOT NULL DEFAULT 0,
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `best_streak` int(11) NOT NULL DEFAULT 0,
  `contest_count` int(11) NOT NULL DEFAULT 0,
  `rated_contest_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`user_id`, `public_id`, `department`, `bio`, `github_url`, `avatar_url`, `rating`, `rating_delta`, `rating_tier`, `global_rank`, `rank_delta`, `solved_count`, `solved_delta`, `total_submissions`, `current_streak`, `best_streak`, `contest_count`, `rated_contest_count`, `created_at`, `updated_at`) VALUES
(1, 'QJ-2026-0001', NULL, NULL, NULL, NULL, 0, 0, 'UNRATED', NULL, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-08 16:30:51', '2026-05-08 16:30:51'),
(2, 'QJ-2026-0002', NULL, NULL, NULL, NULL, 0, 0, 'UNRATED', NULL, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-08 16:53:51', '2026-05-08 16:53:51'),
(3, 'QJ-2026-0003', NULL, NULL, NULL, NULL, 800, 0, 'NEWBIE', 2, 0, 12, 0, 16, 0, 0, 3, 3, '2026-05-08 16:46:15', '2026-05-11 06:55:01'),
(4, 'QJ-2026-0004', NULL, NULL, NULL, NULL, 1450, -150, 'PUPIL', 1, 0, 9, 0, 24, 0, 0, 3, 3, '2026-05-09 19:44:26', '2026-05-11 08:32:59'),
(5, 'QJ-2026-0005', NULL, NULL, NULL, NULL, 0, 0, 'UNRATED', NULL, 0, 0, 0, 0, 0, 0, 0, 0, '2026-05-10 18:33:08', '2026-05-10 18:33:08'),
(6, 'QJ-2026-0006', NULL, NULL, NULL, NULL, 650, 150, 'NEWBIE', 3, 0, 3, 0, 3, 0, 0, 1, 1, '2026-05-11 06:33:16', '2026-05-11 06:55:01');

-- --------------------------------------------------------

--
-- Table structure for table `user_rating_history`
--

CREATE TABLE `user_rating_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating_date` date NOT NULL,
  `rating` int(11) NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_rating_history`
--

INSERT INTO `user_rating_history` (`id`, `user_id`, `rating_date`, `rating`, `label`, `created_at`) VALUES
(1, 4, '2026-05-11', 2000, 'T-MP044GIN78FK', '2026-05-11 06:06:49'),
(2, 3, '2026-05-11', 400, 'T-MP044GIN78FK', '2026-05-11 06:06:49'),
(3, 3, '2026-05-11', 800, 'T-MP0S36E5W7U1', '2026-05-11 06:06:49'),
(4, 4, '2026-05-11', 1600, 'T-MP0S36E5W7U1', '2026-05-11 06:06:49'),
(5, 6, '2026-05-11', 650, 'T-MP0TXT62DJ2D', '2026-05-11 06:55:01'),
(6, 3, '2026-05-11', 800, 'T-MP0TXT62DJ2D', '2026-05-11 06:55:01'),
(7, 4, '2026-05-11', 1450, 'T-MP0TXT62DJ2D', '2026-05-11 06:55:01');

-- --------------------------------------------------------

--
-- Table structure for table `user_submissions`
--

CREATE TABLE `user_submissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `problem_code` varchar(50) DEFAULT NULL,
  `problem_title` varchar(255) NOT NULL,
  `contest_code` varchar(30) DEFAULT NULL,
  `contest_name` varchar(255) DEFAULT NULL,
  `language` varchar(30) NOT NULL,
  `verdict` enum('AC','WA','TLE','RE','CE','MLE','PE') NOT NULL,
  `runtime_ms` int(11) DEFAULT NULL,
  `memory_kb` int(11) DEFAULT NULL,
  `difficulty` enum('Easy','Medium','Hard') NOT NULL DEFAULT 'Medium',
  `source_code` longtext NOT NULL,
  `test_case_note` text DEFAULT NULL,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_submissions`
--

INSERT INTO `user_submissions` (`id`, `user_id`, `problem_code`, `problem_title`, `contest_code`, `contest_name`, `language`, `verdict`, `runtime_ms`, `memory_kb`, `difficulty`, `source_code`, `test_case_note`, `submitted_at`) VALUES
(1, 4, 'A', 'Add Two Numbers', 'T-MOYRFMDPE94V', 'Test-2', 'cpp', 'AC', 3, 1024, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;cin>> x>>y;\n    cout<<x+y<<endl;\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1024 KB)', '2026-05-10 01:53:18'),
(2, 4, 'A', 'Add Two Numbers', 'T-MOYRFMDPE94V', 'Test-2', 'cpp', 'CE', 0, 0, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;cin>> x>>y;\n    cout<<x+y<<endl\n    return 0;\n}\n', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:9:20: error: expected ‘;’ before ‘return’\n    9 |     cout<<x+y<<endl\n      |                    ^\n      |                    ;\n   10 |     return 0;\n      |     ~~~~~~          \n', '2026-05-10 01:59:20'),
(3, 4, 'A', 'Add Two Numbers', 'T-MOYRFMDPE94V', 'Test-2', 'cpp', 'AC', 2, 1228, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;cin>> x>>y;\n    cout<<x+y<<endl;\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (2ms, 1228 KB)', '2026-05-10 01:59:33'),
(4, 4, 'A', 'Even or Odd', 'T-MOZLVK672R8S', 'test3', 'cpp', 'AC', 2, 1152, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n   int n;cin>> n;if(n%2)cout<<\"Odd\";else cout<<\"Even\";\n\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (2ms, 1152 KB)', '2026-05-10 16:06:17'),
(5, 4, 'B', 'Count Vowels', 'T-MOZLVK672R8S', 'test3', 'cpp', 'AC', 3, 1200, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string s;cin>> s;\n    int cnt=0;\n\n    for (int i=0;i<s.size();i++){\n        if(s[i]==\'a\'||s[i]==\'e\'||s[i]==\'i\'||s[i]==\'o\'||s[i]==\'u\')\n        cnt++;\n    }\n    cout<<cnt<<endl;\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1200 KB)', '2026-05-10 16:08:50'),
(6, 3, 'B', 'Count Vowels', 'T-MOZLVK672R8S', 'test3', 'cpp', 'AC', 3, 872, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string s;cin>> s;\n    int cnt=0;\n\n    for (int i=0;i<s.size();i++){\n        if(s[i]==\'a\'||s[i]==\'e\'||s[i]==\'i\'||s[i]==\'o\'||s[i]==\'u\')\n        cnt++;\n    }\n    cout<<cnt<<endl;\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (3ms, 872 KB)', '2026-05-10 16:10:52'),
(7, 3, 'A', 'Even or Odd', 'T-MOZLVK672R8S', 'test3', 'cpp', 'AC', 3, 1272, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;\n    if(n%2)cout<<\"Odd\";\n    else cout<<\"Even\";\n\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1272 KB)', '2026-05-10 16:11:44'),
(8, 3, 'C', 'Add Two Numbers', 'T-MOZVBFE4HCIB', 'Test-4', 'cpp', 'AC', 3, 1268, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int x, y;\n    cin>> x>>y;\n    cout<<x+y<<endl;\n\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1268 KB)', '2026-05-10 20:29:51');
INSERT INTO `user_submissions` (`id`, `user_id`, `problem_code`, `problem_title`, `contest_code`, `contest_name`, `language`, `verdict`, `runtime_ms`, `memory_kb`, `difficulty`, `source_code`, `test_case_note`, `submitted_at`) VALUES
(9, 3, '2', 'Even or Odd', NULL, NULL, 'cpp', 'CE', 0, 0, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n\n    return 0;\n}\n', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:8:28: error: no match for ‘operator==’ (operand types are ‘std::basic_ostream<char>’ and ‘int’)\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                   ~~~~~~~~~^~~\n      |                       |      |\n      |                       |      int\n      |                       std::basic_ostream<char>\nmain.cpp:8:28: note: candidate: ‘operator==(int, int)’ <built-in>\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                   ~~~~~~~~~^~~\nmain.cpp:8:28: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘int’\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1026:5: note: candidate: ‘template<class _BiIter> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, const std::__cxx11::sub_match<_BiIter>&)’\n 1026 |     operator==(const sub_match<_BiIter>& __lhs, const sub_match<_BiIter>& __rhs)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1026:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1099:5: note: candidate: ‘template<class _Bi_iter, class _Ch_traits, class _Ch_alloc> bool std::__cxx11::operator==(std::__cxx11::__sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>&, const std::__cxx11::sub_match<_BiIter>&)’\n 1099 |     operator==(const __sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1099:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘std::__cxx11::__sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1173:5: note: candidate: ‘template<class _Bi_iter, class _Ch_traits, class _Ch_alloc> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, std::__cxx11::__sub_match_string<_Bi_iter, _Ch_traits, _Ch_alloc>&)’\n 1173 |     operator==(const sub_match<_Bi_iter>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1173:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1247:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const typename std::iterator_traits<_Iter>::value_type*, const std::__cxx11::sub_match<_BiIter>&)’\n 1247 |     operator==(typename iterator_traits<_Bi_iter>::value_type const* __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1247:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::__cxx11::sub_match<_BiIter>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1321:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, const typename std::iterator_traits<_Iter>::value_type*)’\n 1321 |     operator==(const sub_match<_Bi_iter>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1321:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1395:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const typename std::iterator_traits<_Iter>::value_type&, const std::__cxx11::sub_match<_BiIter>&)’\n 1395 |     operator==(typename iterator_traits<_Bi_iter>::value_type const& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1395:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::__cxx11::sub_match<_BiIter>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1473:5: note: candidate: ‘template<class _Bi_iter> bool std::__cxx11::operator==(const std::__cxx11::sub_match<_BiIter>&, const typename std::iterator_traits<_Iter>::value_type&)’\n 1473 |     operator==(const sub_match<_Bi_iter>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1473:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::sub_match<_BiIter>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/regex:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:110,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1991:5: note: candidate: ‘template<class _Bi_iter, class _Alloc> bool std::__cxx11::operator==(const std::__cxx11::match_results<_BiIter, _Alloc>&, const std::__cxx11::match_results<_BiIter, _Alloc>&)’\n 1991 |     operator==(const match_results<_Bi_iter, _Alloc>& __m1,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/regex.h:1991:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::match_results<_BiIter, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/iosfwd:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/postypes.h:222:5: note: candidate: ‘template<class _StateT> bool std::operator==(const std::fpos<_StateT>&, const std::fpos<_StateT>&)’\n  222 |     operator==(const fpos<_StateT>& __lhs, const fpos<_StateT>& __rhs)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/postypes.h:222:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::fpos<_StateT>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:64,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_pair.h:448:5: note: candidate: ‘template<class _T1, class _T2> constexpr bool std::operator==(const std::pair<_T1, _T2>&, const std::pair<_T1, _T2>&)’\n  448 |     operator==(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_pair.h:448:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::pair<_T1, _T2>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:325:5: note: candidate: ‘template<class _Iterator> bool std::operator==(const std::reverse_iterator<_Iterator>&, const std::reverse_iterator<_Iterator>&)’\n  325 |     operator==(const reverse_iterator<_Iterator>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:325:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::reverse_iterator<_Iterator>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:363:5: note: candidate: ‘template<class _IteratorL, class _IteratorR> bool std::operator==(const std::reverse_iterator<_Iterator>&, const std::reverse_iterator<_IteratorR>&)’\n  363 |     operator==(const reverse_iterator<_IteratorL>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:363:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::reverse_iterator<_Iterator>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1139:5: note: candidate: ‘template<class _IteratorL, class _IteratorR> bool std::operator==(const std::move_iterator<_IteratorL>&, const std::move_iterator<_IteratorR>&)’\n 1139 |     operator==(const move_iterator<_IteratorL>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1139:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::move_iterator<_IteratorL>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_algobase.h:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/char_traits.h:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1145:5: note: candidate: ‘template<class _Iterator> bool std::operator==(const std::move_iterator<_IteratorL>&, const std::move_iterator<_IteratorL>&)’\n 1145 |     operator==(const move_iterator<_Iterator>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_iterator.h:1145:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::move_iterator<_IteratorL>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/allocator.h:168:5: note: candidate: ‘template<class _T1, class _T2> bool std::operator==(const std::allocator<_CharT>&, const std::allocator<_T2>&)’\n  168 |     operator==(const allocator<_T1>&, const allocator<_T2>&)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/allocator.h:168:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::allocator<_CharT>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6141:5: note: candidate: ‘template<class _CharT, class _Traits, class _Alloc> bool std::operator==(const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&, const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&)’\n 6141 |     operator==(const basic_string<_CharT, _Traits, _Alloc>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6141:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6149:5: note: candidate: ‘template<class _CharT> typename __gnu_cxx::__enable_if<std::__is_char<_Tp>::__value, bool>::__type std::operator==(const std::__cxx11::basic_string<_CharT>&, const std::__cxx11::basic_string<_CharT>&)’\n 6149 |     operator==(const basic_string<_CharT>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6149:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::basic_string<_CharT>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6163:5: note: candidate: ‘template<class _CharT, class _Traits, class _Alloc> bool std::operator==(const _CharT*, const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&)’\n 6163 |     operator==(const _CharT* __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6163:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const _CharT*’ and ‘std::basic_ostream<char>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/string:55,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_classes.h:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6175:5: note: candidate: ‘template<class _CharT, class _Traits, class _Alloc> bool std::operator==(const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>&, const _CharT*)’\n 6175 |     operator==(const basic_string<_CharT, _Traits, _Alloc>& __lhs,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_string.h:6175:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::basic_string<_CharT, _Traits, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/ios_base.h:46,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:42,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:292:3: note: candidate: ‘bool std::operator==(const std::error_code&, const std::error_code&)’\n  292 |   operator==(const error_code& __lhs, const error_code& __rhs) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:292:32: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_code&’\n  292 |   operator==(const error_code& __lhs, const error_code& __rhs) noexcept\n      |              ~~~~~~~~~~~~~~~~~~^~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:297:3: note: candidate: ‘bool std::operator==(const std::error_code&, const std::error_condition&)’\n  297 |   operator==(const error_code& __lhs, const error_condition& __rhs) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:297:32: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_code&’\n  297 |   operator==(const error_code& __lhs, const error_condition& __rhs) noexcept\n      |              ~~~~~~~~~~~~~~~~~~^~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:304:3: note: candidate: ‘bool std::operator==(const std::error_condition&, const std::error_code&)’\n  304 |   operator==(const error_condition& __lhs, const error_code& __rhs) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:304:37: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_condition&’\n  304 |   operator==(const error_condition& __lhs, const error_code& __rhs) noexcept\n      |              ~~~~~~~~~~~~~~~~~~~~~~~^~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:311:3: note: candidate: ‘bool std::operator==(const std::error_condition&, const std::error_condition&)’\n  311 |   operator==(const error_condition& __lhs,\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/system_error:311:37: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘const std::error_condition&’\n  311 |   operator==(const error_condition& __lhs,\n      |              ~~~~~~~~~~~~~~~~~~~~~~~^~~~~\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_facets.h:48,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/basic_ios.h:37,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ios:44,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/istream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/sstream:38,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/complex:45,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/streambuf_iterator.h:208:5: note: candidate: ‘template<class _CharT, class _Traits> bool std::operator==(const std::istreambuf_iterator<_CharT, _Traits>&, const std::istreambuf_iterator<_CharT, _Traits>&)’\n  208 |     operator==(const istreambuf_iterator<_CharT, _Traits>& __a,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/streambuf_iterator.h:208:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::istreambuf_iterator<_CharT, _Traits>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:459:5: note: candidate: ‘template<class _Tp> constexpr bool std::operator==(const std::complex<_Tp>&, const std::complex<_Tp>&)’\n  459 |     operator==(const complex<_Tp>& __x, const complex<_Tp>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:459:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::complex<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:464:5: note: candidate: ‘template<class _Tp> constexpr bool std::operator==(const std::complex<_Tp>&, const _Tp&)’\n  464 |     operator==(const complex<_Tp>& __x, const _Tp& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:464:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::complex<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/ccomplex:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:54,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:469:5: note: candidate: ‘template<class _Tp> constexpr bool std::operator==(const _Tp&, const std::complex<_Tp>&)’\n  469 |     operator==(const _Tp& __x, const complex<_Tp>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/complex:469:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::complex<_Tp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/deque:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:68,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:283:5: note: candidate: ‘template<class _Tp, class _Ref, class _Ptr> bool std::operator==(const std::_Deque_iterator<_Tp, _Ref, _Ptr>&, const std::_Deque_iterator<_Tp, _Ref, _Ptr>&)’\n  283 |     operator==(const _Deque_iterator<_Tp, _Ref, _Ptr>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:283:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Deque_iterator<_Tp, _Ref, _Ptr>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/deque:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:68,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:290:5: note: candidate: ‘template<class _Tp, class _RefL, class _PtrL, class _RefR, class _PtrR> bool std::operator==(const std::_Deque_iterator<_Tp, _Ref, _Ptr>&, const std::_Deque_iterator<_Tp, _RefR, _PtrR>&)’\n  290 |     operator==(const _Deque_iterator<_Tp, _RefL, _PtrL>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:290:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Deque_iterator<_Tp, _Ref, _Ptr>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/deque:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:68,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:2309:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::deque<_Tp, _Alloc>&, const std::deque<_Tp, _Alloc>&)’\n 2309 |     operator==(const deque<_Tp, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_deque.h:2309:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::deque<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/tuple:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:54,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/array:252:5: note: candidate: ‘template<class _Tp, long unsigned int _Nm> bool std::operator==(const std::array<_Tp, _Nm>&, const std::array<_Tp, _Nm>&)’\n  252 |     operator==(const array<_Tp, _Nm>& __one, const array<_Tp, _Nm>& __two)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/array:252:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::array<_Tp, _Nm>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:54,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/tuple:1419:5: note: candidate: ‘template<class ... _TElements, class ... _UElements> constexpr bool std::operator==(const std::tuple<_Tps ...>&, const std::tuple<_Elements ...>&)’\n 1419 |     operator==(const tuple<_TElements...>& __t,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/tuple:1419:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::tuple<_Tps ...>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:59,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:748:5: note: candidate: ‘template<class _Res, class ... _Args> bool std::operator==(const std::function<_Res(_ArgTypes ...)>&, std::nullptr_t)’\n  748 |     operator==(const function<_Res(_Args...)>& __f, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:748:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::function<_Res(_ArgTypes ...)>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/functional:59,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:71,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:754:5: note: candidate: ‘template<class _Res, class ... _Args> bool std::operator==(std::nullptr_t, const std::function<_Res(_ArgTypes ...)>&)’\n  754 |     operator==(nullptr_t, const function<_Res(_Args...)>& __f) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/std_function.h:754:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::function<_Res(_ArgTypes ...)>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_conv.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/locale:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/iomanip:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:72,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:707:5: note: candidate: ‘template<class _Tp, class _Dp, class _Up, class _Ep> bool std::operator==(const std::unique_ptr<_Tp, _Dp>&, const std::unique_ptr<_Up, _Ep>&)’\n  707 |     operator==(const unique_ptr<_Tp, _Dp>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:707:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unique_ptr<_Tp, _Dp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_conv.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/locale:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/iomanip:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:72,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:713:5: note: candidate: ‘template<class _Tp, class _Dp> bool std::operator==(const std::unique_ptr<_Tp, _Dp>&, std::nullptr_t)’\n  713 |     operator==(const unique_ptr<_Tp, _Dp>& __x, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:713:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unique_ptr<_Tp, _Dp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/locale_conv.h:41,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/locale:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/iomanip:43,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:72,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:718:5: note: candidate: ‘template<class _Tp, class _Dp> bool std::operator==(std::nullptr_t, const std::unique_ptr<_Tp, _Dp>&)’\n  718 |     operator==(nullptr_t, const unique_ptr<_Tp, _Dp>& __x) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unique_ptr.h:718:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::unique_ptr<_Tp, _Dp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/iterator:66,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:77,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stream_iterator.h:134:5: note: candidate: ‘template<class _Tp, class _CharT, class _Traits, class _Dist> bool std::operator==(const std::istream_iterator<_Tp, _CharT, _Traits, _Dist>&, const std::istream_iterator<_Tp, _CharT, _Traits, _Dist>&)’\n  134 |     operator==(const istream_iterator<_Tp, _CharT, _Traits, _Dist>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stream_iterator.h:134:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::istream_iterator<_Tp, _CharT, _Traits, _Dist>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/list:63,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:79,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_list.h:1991:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::__cxx11::list<_Tp, _Alloc>&, const std::__cxx11::list<_Tp, _Alloc>&)’\n 1991 |     operator==(const list<_Tp, _Alloc>& __x, const list<_Tp, _Alloc>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_list.h:1991:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__cxx11::list<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/map:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:81,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_map.h:1455:5: note: candidate: ‘template<class _Key, class _Tp, class _Compare, class _Alloc> bool std::operator==(const std::map<_Key, _Tp, _Compare, _Alloc>&, const std::map<_Key, _Tp, _Compare, _Alloc>&)’\n 1455 |     operator==(const map<_Key, _Tp, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_map.h:1455:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::map<_Key, _Tp, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/map:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:81,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multimap.h:1119:5: note: candidate: ‘template<class _Key, class _Tp, class _Compare, class _Alloc> bool std::operator==(const std::multimap<_Key, _Tp, _Compare, _Alloc>&, const std::multimap<_Key, _Tp, _Compare, _Alloc>&)’\n 1119 |     operator==(const multimap<_Key, _Tp, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multimap.h:1119:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::multimap<_Key, _Tp, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:52,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1412:5: note: candidate: ‘template<class _Tp1, class _Tp2, __gnu_cxx::_Lock_policy _Lp> bool std::operator==(const std::__shared_ptr<_Tp1, _Lp>&, const std::__shared_ptr<_Tp2, _Lp>&)’\n 1412 |     operator==(const __shared_ptr<_Tp1, _Lp>& __a,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1412:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__shared_ptr<_Tp1, _Lp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:52,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1418:5: note: candidate: ‘template<class _Tp, __gnu_cxx::_Lock_policy _Lp> bool std::operator==(const std::__shared_ptr<_Tp, _Lp>&, std::nullptr_t)’\n 1418 |     operator==(const __shared_ptr<_Tp, _Lp>& __a, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1418:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::__shared_ptr<_Tp, _Lp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:52,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1423:5: note: candidate: ‘template<class _Tp, __gnu_cxx::_Lock_policy _Lp> bool std::operator==(std::nullptr_t, const std::__shared_ptr<_Tp, _Lp>&)’\n 1423 |     operator==(nullptr_t, const __shared_ptr<_Tp, _Lp>& __a) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr_base.h:1423:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::__shared_ptr<_Tp, _Lp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:383:5: note: candidate: ‘template<class _Tp, class _Up> bool std::operator==(const std::shared_ptr<_Tp>&, const std::shared_ptr<_Tp>&)’\n  383 |     operator==(const shared_ptr<_Tp>& __a, const shared_ptr<_Up>& __b) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:383:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::shared_ptr<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:388:5: note: candidate: ‘template<class _Tp> bool std::operator==(const std::shared_ptr<_Tp>&, std::nullptr_t)’\n  388 |     operator==(const shared_ptr<_Tp>& __a, nullptr_t) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:388:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::shared_ptr<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/memory:81,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:82,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:393:5: note: candidate: ‘template<class _Tp> bool std::operator==(std::nullptr_t, const std::shared_ptr<_Tp>&)’\n  393 |     operator==(nullptr_t, const shared_ptr<_Tp>& __a) noexcept\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/shared_ptr.h:393:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::shared_ptr<_Tp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/vector:67,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/queue:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:86,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_vector.h:1888:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::vector<_Tp, _Alloc>&, const std::vector<_Tp, _Alloc>&)’\n 1888 |     operator==(const vector<_Tp, _Alloc>& __x, const vector<_Tp, _Alloc>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_vector.h:1888:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::vector<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/queue:64,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:86,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_queue.h:338:5: note: candidate: ‘template<class _Tp, class _Seq> bool std::operator==(const std::queue<_Tp, _Seq>&, const std::queue<_Tp, _Seq>&)’\n  338 |     operator==(const queue<_Tp, _Seq>& __x, const queue<_Tp, _Seq>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_queue.h:338:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::queue<_Tp, _Seq>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/set:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:87,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_set.h:979:5: note: candidate: ‘template<class _Key, class _Compare, class _Alloc> bool std::operator==(const std::set<_Key, _Compare, _Alloc>&, const std::set<_Key, _Compare, _Alloc>&)’\n  979 |     operator==(const set<_Key, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_set.h:979:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::set<_Key, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/set:62,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:87,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multiset.h:964:5: note: candidate: ‘template<class _Key, class _Compare, class _Alloc> bool std::operator==(const std::multiset<_Key, _Compare, _Alloc>&, const std::multiset<_Key, _Compare, _Alloc>&)’\n  964 |     operator==(const multiset<_Key, _Compare, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_multiset.h:964:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::multiset<_Key, _Compare, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/stack:61,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:89,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_stack.h:313:5: note: candidate: ‘template<class _Tp, class _Seq> bool std::operator==(const std::stack<_Tp, _Seq>&, const std::stack<_Tp, _Seq>&)’\n  313 |     operator==(const stack<_Tp, _Seq>& __x, const stack<_Tp, _Seq>& __y)\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/stl_stack.h:313:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::stack<_Tp, _Seq>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom1, class _Dom2> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Expr, std::_Expr, _Dom1, _Dom2>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::_Expr<_Dom1, typename _Dom1::value_type>&, const std::_Expr<_Dom2, typename _Dom2::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Expr, std::_Constant, _Dom, typename _Dom::value_type>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::_Expr<_Dom1, typename _Dom1::value_type>&, const typename _Dom::value_type&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Constant, std::_Expr, typename _Dom::value_type, _Dom>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const typename _Dom::value_type&, const std::_Expr<_Dom1, typename _Dom1::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Expr, std::_ValArray, _Dom, typename _Dom::value_type>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::_Expr<_Dom1, typename _Dom1::value_type>&, const std::valarray<typename _Dom::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:603,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note: candidate: ‘template<class _Dom> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_ValArray, std::_Expr, typename _Dom::value_type, _Dom>, typename std::__fun<std::__equal_to, typename _Dom1::value_type>::result_type> std::operator==(const std::valarray<typename _Dom::value_type>&, const std::_Expr<_Dom1, typename _Dom1::value_type>&)’\n  417 |     _DEFINE_EXPR_BINARY_OPERATOR(==, __equal_to)\n      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/valarray_after.h:417:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::_Expr<_Dom1, typename _Dom1::value_type>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note: candidate: ‘template<class _Tp> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_ValArray, std::_ValArray, _Tp, _Tp>, typename std::__fun<std::__equal_to, _Tp>::result_type> std::operator==(const std::valarray<_Tp>&, const std::valarray<_Tp>&)’\n 1197 | _DEFINE_BINARY_OPERATOR(==, __equal_to)\n      | ^~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::valarray<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note: candidate: ‘template<class _Tp> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_ValArray, std::_Constant, _Tp, _Tp>, typename std::__fun<std::__equal_to, _Tp>::result_type> std::operator==(const std::valarray<_Tp>&, const typename std::valarray<_Tp>::value_type&)’\n 1197 | _DEFINE_BINARY_OPERATOR(==, __equal_to)\n      | ^~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::valarray<_Tp>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:95,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note: candidate: ‘template<class _Tp> std::_Expr<std::__detail::_BinClos<std::__equal_to, std::_Constant, std::_ValArray, _Tp, _Tp>, typename std::__fun<std::__equal_to, _Tp>::result_type> std::operator==(const typename std::valarray<_Tp>::value_type&, const std::valarray<_Tp>&)’\n 1197 | _DEFINE_BINARY_OPERATOR(==, __equal_to)\n      | ^~~~~~~~~~~~~~~~~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/valarray:1197:1: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   mismatched types ‘const std::valarray<_Tp>’ and ‘int’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/forward_list:40,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:104,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/forward_list.tcc:393:5: note: candidate: ‘template<class _Tp, class _Alloc> bool std::operator==(const std::forward_list<_Tp, _Alloc>&, const std::forward_list<_Tp, _Alloc>&)’\n  393 |     operator==(const forward_list<_Tp, _Alloc>& __lx,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/forward_list.tcc:393:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::forward_list<_Tp, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/future:39,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:105,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/thread:276:3: note: candidate: ‘bool std::operator==(std::thread::id, std::thread::id)’\n  276 |   operator==(thread::id __x, thread::id __y) noexcept\n      |   ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/thread:276:25: note:   no known conversion for argument 1 from ‘std::basic_ostream<char>’ to ‘std::thread::id’\n  276 |   operator==(thread::id __x, thread::id __y) noexcept\n      |              ~~~~~~~~~~~^~~\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/random:51,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:108,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/random.tcc:1884:5: note: candidate: ‘template<class _RealType1> bool std::operator==(const std::normal_distribution<_RealType>&, const std::normal_distribution<_RealType>&)’\n 1884 |     operator==(const std::normal_distribution<_RealType>& __d1,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/random.tcc:1884:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::normal_distribution<_RealType>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:111,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/scoped_allocator:489:5: note: candidate: ‘template<class _OutA1, class _OutA2, class ... _InA> bool std::operator==(const std::scoped_allocator_adaptor<_OutA1, _InA ...>&, const std::scoped_allocator_adaptor<_InnerHead, _InnerTail ...>&)’\n  489 |     operator==(const scoped_allocator_adaptor<_OutA1, _InA...>& __a,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/scoped_allocator:489:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::scoped_allocator_adaptor<_OutA1, _InA ...>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_map:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:117,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2091:5: note: candidate: ‘template<class _Key, class _Tp, class _Hash, class _Pred, class _Alloc> bool std::operator==(const std::unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>&, const std::unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>&)’\n 2091 |     operator==(const unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2091:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_map:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:117,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2103:5: note: candidate: ‘template<class _Key, class _Tp, class _Hash, class _Pred, class _Alloc> bool std::operator==(const std::unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>&, const std::unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>&)’\n 2103 |     operator==(const unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_map.h:2103:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unordered_multimap<_Key, _Tp, _Hash, _Pred, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_set:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:118,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_set.h:1703:5: note: candidate: ‘template<class _Value, class _Hash, class _Pred, class _Alloc> bool std::operator==(const std::unordered_set<_Value, _Hash, _Pred, _Alloc>&, const std::unordered_set<_Value, _Hash, _Pred, _Alloc>&)’\n 1703 |     operator==(const unordered_set<_Value, _Hash, _Pred, _Alloc>& __x,\n      |     ^~~~~~~~\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_set.h:1703:5: note:   template argument deduction/substitution failed:\nmain.cpp:8:30: note:   ‘std::basic_ostream<char>’ is not derived from ‘const std::unordered_set<_Value, _Hash, _Pred, _Alloc>’\n    8 |     int n;cin>> n;cout<<n%2==0?\"Odd\":\"Even\"<<endl;\n      |                              ^\nIn file included from /usr/local/gcc-9.2.0/include/c++/9.2.0/unordered_set:47,\n                 from /usr/local/gcc-9.2.0/include/c++/9.2.0/x86_64-pc-linux-gnu/bits/stdc++.h:118,\n                 from main.cpp:1:\n/usr/local/gcc-9.2.0/include/c++/9.2.0/bits/unordered_set.h:1715:5: note: candida', '2026-05-11 00:23:30');
INSERT INTO `user_submissions` (`id`, `user_id`, `problem_code`, `problem_title`, `contest_code`, `contest_name`, `language`, `verdict`, `runtime_ms`, `memory_kb`, `difficulty`, `source_code`, `test_case_note`, `submitted_at`) VALUES
(10, 3, '2', 'Even or Odd', NULL, NULL, 'cpp', 'CE', 0, 0, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;cout<<n%2?\"Odd\":\"Even\"<<endl;\n\n    return 0;\n}\n', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:8:41: error: invalid operands of types ‘const char [5]’ and ‘<unresolved overloaded function type>’ to binary ‘operator<<’\n    8 |     int n;cin>> n;cout<<n%2?\"Odd\":\"Even\"<<endl;\n      |                                   ~~~~~~^~~~~~\n', '2026-05-11 00:23:57'),
(11, 3, '2', 'Even or Odd', NULL, NULL, 'cpp', 'AC', 3, 1332, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;cin>> n;cout<<(n%2?\"Odd\":\"Even\")<<endl;\n\n    return 0;\n}\n', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1332 KB)', '2026-05-11 00:24:10'),
(12, 3, 'A', 'Count Vowels', 'T-MP044GIN78FK', 'Test-4', 'cpp', 'AC', 3, 1168, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1168 KB)', '2026-05-11 00:42:01'),
(13, 3, 'B', 'Even or Odd', 'T-MP044GIN78FK', 'Test-4', 'cpp', 'AC', 3, 1076, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1076 KB)', '2026-05-11 00:42:41'),
(14, 4, 'C', 'Balanced Brackets', 'T-MP044GIN78FK', 'Test-4', 'cpp', 'AC', 3, 1556, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1556 KB)', '2026-05-11 00:43:39'),
(15, 4, 'B', 'Even or Odd', 'T-MP044GIN78FK', 'Test-4', 'cpp', 'AC', 3, 896, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 896 KB)', '2026-05-11 00:44:24'),
(16, 3, 'A', 'Count Vowels', 'T-MP044GIN78FK', 'Test-4', 'cpp', 'CE', 0, 0, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n   gg\n\n    return 0;\n}\n', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:8:4: error: ‘gg’ was not declared in this scope\n    8 |    gg\n      |    ^~\n', '2026-05-11 00:51:31'),
(17, 4, 'A', 'Count Vowels', 'T-MP044GIN78FK', 'Test-4', 'cpp', 'AC', 3, 1628, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1628 KB)', '2026-05-11 01:11:49'),
(18, 3, 'C', 'Balanced Brackets', 'T-MP044GIN78FK', 'Test-4', 'cpp', 'AC', 3, 1380, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1380 KB)', '2026-05-11 11:25:13'),
(19, 3, '4', 'Count Vowels', NULL, NULL, 'cpp', 'AC', 3, 1388, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1388 KB)', '2026-05-11 11:44:10'),
(20, 3, '4', 'Count Vowels', NULL, NULL, 'cpp', 'AC', 3, 896, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 896 KB)', '2026-05-11 11:44:14'),
(21, 3, '4', 'Count Vowels', NULL, NULL, 'cpp', 'AC', 3, 1036, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1036 KB)', '2026-05-11 11:44:17'),
(22, 3, 'A', 'Count Vowels', 'T-MP0S36E5W7U1', 'Test-6', 'cpp', 'AC', 3, 1192, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1192 KB)', '2026-05-11 11:46:28'),
(23, 3, 'B', 'Even or Odd', 'T-MP0S36E5W7U1', 'Test-6', 'cpp', 'AC', 3, 1252, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1252 KB)', '2026-05-11 11:46:38'),
(24, 4, 'C', 'Balanced Brackets', 'T-MP0S36E5W7U1', 'Test-6', 'cpp', 'AC', 3, 1480, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1480 KB)', '2026-05-11 11:47:45'),
(25, 6, 'A', 'Count Vowels', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 1228, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count << endl;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1228 KB)', '2026-05-11 12:38:21'),
(26, 6, 'B', 'Even or Odd', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 932, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 932 KB)', '2026-05-11 12:38:28'),
(27, 6, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 884, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 884 KB)', '2026-05-11 12:38:36'),
(28, 4, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'CE', 0, 0, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0\n}', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:37:13: error: expected ‘;’ before ‘}’ token\n   37 |     return 0\n      |             ^\n      |             ;\n   38 | }\n      | ~            \n', '2026-05-11 12:39:22'),
(29, 4, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'CE', 0, 0, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0\n}', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:32:30: error: expected ‘;’ before ‘}’ token\n   32 |         cout << \"YES\" << endl\n      |                              ^\n      |                              ;\n   33 |     } else {\n      |     ~                         \nmain.cpp:37:13: error: expected ‘;’ before ‘}’ token\n   37 |     return 0\n      |             ^\n      |             ;\n   38 | }\n      | ~            \n', '2026-05-11 12:39:29'),
(30, 4, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'CE', 0, 0, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0\n}', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:15:37: error: expected ‘;’ before ‘return’\n   15 |                 cout << \"NO\" << endl\n      |                                     ^\n      |                                     ;\n   16 |                 return 0;\n      |                 ~~~~~~               \nmain.cpp:32:30: error: expected ‘;’ before ‘}’ token\n   32 |         cout << \"YES\" << endl\n      |                              ^\n      |                              ;\n   33 |     } else {\n      |     ~                         \nmain.cpp:37:13: error: expected ‘;’ before ‘}’ token\n   37 |     return 0\n      |             ^\n      |             ;\n   38 | }\n      | ~            \n', '2026-05-11 12:39:36'),
(31, 4, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'CE', 0, 0, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'Compilation Error on test case 1.\n\nmain.cpp:11:42: error: empty character constant\n   11 |         if (c == \'(\' || c == \'{\' || c == \'\') {\n      |                                          ^~\n', '2026-05-11 12:39:56'),
(32, 4, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'CE', 0, 0, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'\') { \n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'Compilation Error on test case 1.\n\nmain.cpp:11:42: error: empty character constant\n   11 |         if (c == \'(\' || c == \'{\' || c == \'\') {\n      |                                          ^~\n', '2026-05-11 12:40:04'),
(33, 4, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'WA', 3, 1140, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'a\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'Wrong answer on test case 1.\n\nExpected:\nYES\n\nYour Output:\nNO', '2026-05-11 12:40:25'),
(34, 3, 'C', 'Balanced Brackets', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 1040, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n\n            char top = st.top();\n            st.pop();\n\n            if ((c == \')\' && top != \'(\') ||\n                (c == \'}\' && top != \'{\') ||\n                (c == \']\' && top != \'[\')) {\n                cout << \"NO\" << endl;\n                return 0;\n            }\n        }\n    }\n\n    if (st.empty()) {\n        cout << \"YES\" << endl;\n    } else {\n        cout << \"NO\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1040 KB)', '2026-05-11 12:40:45'),
(35, 4, 'B', 'Even or Odd', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'WA', 2, 900, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Od\" << endl;\n    }\n\n    return 0;\n}', 'Wrong answer on test case 1.\n\nExpected:\nOdd\n\nYour Output:\nOd', '2026-05-11 12:48:20'),
(36, 4, 'B', 'Even or Odd', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'WA', 3, 1280, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Od\" << endl;\n    }\n\n    return 0;\n}', 'Wrong answer on test case 1.\n\nExpected:\nOdd\n\nYour Output:\nOd', '2026-05-11 12:48:27'),
(37, 4, 'B', 'Even or Odd', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 1164, 'Medium', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n\n    if (n % 2 == 0) {\n        cout << \"Even\" << endl;\n    } else {\n        cout << \"Odd\" << endl;\n    }\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1164 KB)', '2026-05-11 12:48:32'),
(38, 4, 'A', 'Count Vowels', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 1036, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1036 KB)', '2026-05-11 14:28:59'),
(39, 4, 'A', 'Count Vowels', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 1116, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1116 KB)', '2026-05-11 14:29:02'),
(40, 4, 'A', 'Count Vowels', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 1076, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1076 KB)', '2026-05-11 14:29:24'),
(41, 4, 'A', 'Count Vowels', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 1128, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 1128 KB)', '2026-05-11 14:29:38'),
(42, 4, 'A', 'Count Vowels', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'CE', 0, 0, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count\n\n    return 0;\n}', 'Compilation Error on test case 1.\n\nmain.cpp: In function ‘int main()’:\nmain.cpp:16:18: error: expected ‘;’ before ‘return’\n   16 |     cout << count\n      |                  ^\n      |                  ;\n   17 | \n   18 |     return 0;\n      |     ~~~~~~        \n', '2026-05-11 14:32:52'),
(43, 4, 'A', 'Count Vowels', 'T-MP0TXT62DJ2D', 'Test-7', 'cpp', 'AC', 3, 868, 'Easy', '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    int count = 0;\n\n    for (char c : s) {\n        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n            count++;\n        }\n    }\n\n    cout << count;\n\n    return 0;\n}', 'All 1 test cases passed.\nTest 1: PASS (3ms, 868 KB)', '2026-05-11 14:32:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievement_definitions`
--
ALTER TABLE `achievement_definitions`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_admin_notification_entity` (`recipient_user_id`,`type`,`entity_type`,`entity_id`),
  ADD KEY `idx_admin_notifications_recipient_read_created` (`recipient_user_id`,`is_read`,`created_at`),
  ADD KEY `idx_admin_notifications_actor` (`actor_user_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_logs_created_at` (`created_at`),
  ADD KEY `idx_audit_logs_actor_role` (`actor_role`),
  ADD KEY `idx_audit_logs_action` (`action`),
  ADD KEY `idx_audit_logs_status` (`status`),
  ADD KEY `idx_audit_logs_actor_user` (`actor_user_id`),
  ADD KEY `idx_audit_logs_target_user` (`target_user_id`);

--
-- Indexes for table `code_drafts`
--
ALTER TABLE `code_drafts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_code_draft_context` (`user_id`,`problem_id`,`contest_id`,`contest_problem_code`),
  ADD KEY `idx_code_drafts_user_problem` (`user_id`,`problem_id`);

--
-- Indexes for table `contests`
--
ALTER TABLE `contests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contests_created_by` (`created_by`);

--
-- Indexes for table `contest_access`
--
ALTER TABLE `contest_access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_contest_access` (`user_id`,`contest_id`),
  ADD KEY `fk_contest_access_contest` (`contest_id`);

--
-- Indexes for table `contest_announcements`
--
ALTER TABLE `contest_announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contest_announcements_contest` (`contest_id`);

--
-- Indexes for table `contest_leaderboard`
--
ALTER TABLE `contest_leaderboard`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_contest_user_lb` (`contest_id`,`user_id`),
  ADD KEY `fk_contest_leaderboard_user` (`user_id`);

--
-- Indexes for table `contest_problems`
--
ALTER TABLE `contest_problems`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_contest_problem_code` (`contest_id`,`problem_code`),
  ADD KEY `fk_contest_problems_problem` (`problem_id`);

--
-- Indexes for table `contest_problem_tags`
--
ALTER TABLE `contest_problem_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_contest_problem_tag` (`contest_problem_id`,`tag_name`),
  ADD KEY `idx_contest_problem_tags_problem_id` (`contest_problem_id`);

--
-- Indexes for table `contest_problem_test_cases`
--
ALTER TABLE `contest_problem_test_cases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contest_problem_test_cases_problem_id` (`contest_problem_id`);

--
-- Indexes for table `contest_queries`
--
ALTER TABLE `contest_queries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contest_queries_contest` (`contest_id`),
  ADD KEY `fk_contest_queries_user` (`user_id`);

--
-- Indexes for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_contest_registration` (`user_id`,`contest_id`),
  ADD KEY `fk_contest_registrations_contest` (`contest_id`);

--
-- Indexes for table `contest_results`
--
ALTER TABLE `contest_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_contest_result` (`user_id`,`contest_id`),
  ADD KEY `fk_contest_results_contest` (`contest_id`);

--
-- Indexes for table `contest_submissions`
--
ALTER TABLE `contest_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contest_submissions_contest` (`contest_id`),
  ADD KEY `fk_contest_submissions_user` (`user_id`),
  ADD KEY `fk_contest_submissions_problem` (`problem_id`);

--
-- Indexes for table `contest_tags`
--
ALTER TABLE `contest_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contest_tags_contest` (`contest_id`);

--
-- Indexes for table `discussion_posts`
--
ALTER TABLE `discussion_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_discussion_posts_author` (`author_id`);

--
-- Indexes for table `discussion_replies`
--
ALTER TABLE `discussion_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_discussion_replies_post` (`discussion_id`),
  ADD KEY `fk_discussion_replies_parent` (`parent_reply_id`),
  ADD KEY `fk_discussion_replies_author` (`author_id`);

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
  ADD UNIQUE KEY `uniq_problem_editorial` (`problem_id`);

--
-- Indexes for table `problem_tags`
--
ALTER TABLE `problem_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_problem_tag` (`problem_id`,`tag_name`);

--
-- Indexes for table `problem_test_cases`
--
ALTER TABLE `problem_test_cases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_problem_test_cases_problem` (`problem_id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_submissions_user` (`user_id`),
  ADD KEY `fk_submissions_problem` (`problem_id`),
  ADD KEY `fk_submissions_contest` (`contest_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `uniq_users_userhandle` (`userhandle`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_achievement` (`user_id`,`achievement_code`),
  ADD KEY `fk_user_achievements_definition` (`achievement_code`);

--
-- Indexes for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_activities_user` (`user_id`);

--
-- Indexes for table `user_contests`
--
ALTER TABLE `user_contests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_contest` (`user_id`,`contest_code`);

--
-- Indexes for table `user_difficulty_stats`
--
ALTER TABLE `user_difficulty_stats`
  ADD PRIMARY KEY (`user_id`,`difficulty`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `public_id` (`public_id`);

--
-- Indexes for table `user_rating_history`
--
ALTER TABLE `user_rating_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_rating_history` (`user_id`,`rating_date`,`label`);

--
-- Indexes for table `user_submissions`
--
ALTER TABLE `user_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_submissions_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `code_drafts`
--
ALTER TABLE `code_drafts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contest_access`
--
ALTER TABLE `contest_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contest_announcements`
--
ALTER TABLE `contest_announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contest_leaderboard`
--
ALTER TABLE `contest_leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `contest_problems`
--
ALTER TABLE `contest_problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `contest_problem_tags`
--
ALTER TABLE `contest_problem_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `contest_problem_test_cases`
--
ALTER TABLE `contest_problem_test_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `contest_queries`
--
ALTER TABLE `contest_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contest_results`
--
ALTER TABLE `contest_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `contest_submissions`
--
ALTER TABLE `contest_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `contest_tags`
--
ALTER TABLE `contest_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `discussion_posts`
--
ALTER TABLE `discussion_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `discussion_replies`
--
ALTER TABLE `discussion_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `problem_editorials`
--
ALTER TABLE `problem_editorials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `problem_tags`
--
ALTER TABLE `problem_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `problem_test_cases`
--
ALTER TABLE `problem_test_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_activities`
--
ALTER TABLE `user_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `user_contests`
--
ALTER TABLE `user_contests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_rating_history`
--
ALTER TABLE `user_rating_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_submissions`
--
ALTER TABLE `user_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD CONSTRAINT `fk_admin_notifications_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_admin_notifications_recipient` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_logs_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_audit_logs_target_user` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contests`
--
ALTER TABLE `contests`
  ADD CONSTRAINT `fk_contests_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contest_access`
--
ALTER TABLE `contest_access`
  ADD CONSTRAINT `fk_contest_access_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contest_access_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_announcements`
--
ALTER TABLE `contest_announcements`
  ADD CONSTRAINT `fk_contest_announcements_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_leaderboard`
--
ALTER TABLE `contest_leaderboard`
  ADD CONSTRAINT `fk_contest_leaderboard_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contest_leaderboard_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_problems`
--
ALTER TABLE `contest_problems`
  ADD CONSTRAINT `fk_contest_problems_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contest_problems_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contest_problem_tags`
--
ALTER TABLE `contest_problem_tags`
  ADD CONSTRAINT `fk_contest_problem_tags_problem` FOREIGN KEY (`contest_problem_id`) REFERENCES `contest_problems` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_problem_test_cases`
--
ALTER TABLE `contest_problem_test_cases`
  ADD CONSTRAINT `fk_contest_problem_test_cases_problem` FOREIGN KEY (`contest_problem_id`) REFERENCES `contest_problems` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_queries`
--
ALTER TABLE `contest_queries`
  ADD CONSTRAINT `fk_contest_queries_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contest_queries_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  ADD CONSTRAINT `fk_contest_registrations_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contest_registrations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_results`
--
ALTER TABLE `contest_results`
  ADD CONSTRAINT `fk_contest_results_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contest_results_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_submissions`
--
ALTER TABLE `contest_submissions`
  ADD CONSTRAINT `fk_contest_submissions_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_contest_submissions_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_contest_submissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contest_tags`
--
ALTER TABLE `contest_tags`
  ADD CONSTRAINT `fk_contest_tags_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `discussion_posts`
--
ALTER TABLE `discussion_posts`
  ADD CONSTRAINT `fk_discussion_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `discussion_replies`
--
ALTER TABLE `discussion_replies`
  ADD CONSTRAINT `fk_discussion_replies_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_discussion_replies_parent` FOREIGN KEY (`parent_reply_id`) REFERENCES `discussion_replies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_discussion_replies_post` FOREIGN KEY (`discussion_id`) REFERENCES `discussion_posts` (`id`) ON DELETE CASCADE;

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

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `fk_submissions_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_submissions_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_submissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `fk_user_achievements_definition` FOREIGN KEY (`achievement_code`) REFERENCES `achievement_definitions` (`code`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_achievements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD CONSTRAINT `fk_user_activities_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_contests`
--
ALTER TABLE `user_contests`
  ADD CONSTRAINT `fk_user_contests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_difficulty_stats`
--
ALTER TABLE `user_difficulty_stats`
  ADD CONSTRAINT `fk_user_difficulty_stats_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `fk_user_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_rating_history`
--
ALTER TABLE `user_rating_history`
  ADD CONSTRAINT `fk_user_rating_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_submissions`
--
ALTER TABLE `user_submissions`
  ADD CONSTRAINT `fk_user_submissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
