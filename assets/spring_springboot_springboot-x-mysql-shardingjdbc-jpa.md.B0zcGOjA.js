import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/spring-sharding-5.png",i="/vitepress-blog-template/images/spring/springboot/spring-sharding-6.png",m=JSON.parse('{"title":"SpringBoot集成ShardingJDBC - 基于JPA的单库分表","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-shardingjdbc-jpa.md","filePath":"spring/springboot/springboot-x-mysql-shardingjdbc-jpa.md","lastUpdated":1737706346000}'),t={name:"spring/springboot/springboot-x-mysql-shardingjdbc-jpa.md"};function c(r,s,o,d,g,u){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="springboot集成shardingjdbc-基于jpa的单库分表" tabindex="-1">SpringBoot集成ShardingJDBC - 基于JPA的单库分表 <a class="header-anchor" href="#springboot集成shardingjdbc-基于jpa的单库分表" aria-label="Permalink to &quot;SpringBoot集成ShardingJDBC - 基于JPA的单库分表&quot;">​</a></h1><blockquote><p>上文介绍SpringBoot集成基于ShardingJDBC的读写分离实践，本文在此基础上介绍SpringBoot集成基于ShardingJDBC+JPA的单库分表实践。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>主要理解Sharding-JDBC及JPA等。@pdai</p></blockquote><ul><li><p>JPA相关 <a href="https://pdai.tech/md/spring/springboot/springboot-x-mysql-jpa.html" target="_blank" rel="noreferrer">SpringBoot集成MySQL - 基于JPA的封装</a></p></li><li><p>ShardingJDBC 相关 <a href="https://pdai.tech/md/spring/springboot/springboot-x-mysql-shardingjdbc.html" target="_blank" rel="noreferrer">SpringBoot集成ShardingJDBC - Sharding-JDBC简介和基于MyBatis的单库分表</a></p></li></ul><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里主要介绍SpringBoot集成基于ShardingJDBC的<strong>单库分表</strong>实践，主要承接之前的相关文章在JPA的基础上实现的。</p></blockquote><h3 id="准备db和依赖配置" tabindex="-1">准备DB和依赖配置 <a class="header-anchor" href="#准备db和依赖配置" aria-label="Permalink to &quot;准备DB和依赖配置&quot;">​</a></h3><p>创建MySQL的schema test_db_sharding, 导入SQL 文件如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db_sharding</span></span>
<span class="line"><span>-- ------------------------------------------------------</span></span>
<span class="line"><span>-- Server version	8.0.28</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;</span></span>
<span class="line"><span>/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;</span></span>
<span class="line"><span>/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;</span></span>
<span class="line"><span>/*!50503 SET NAMES utf8 */;</span></span>
<span class="line"><span>/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;</span></span>
<span class="line"><span>/*!40103 SET TIME_ZONE=&#39;+00:00&#39; */;</span></span>
<span class="line"><span>/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=&#39;NO_AUTO_VALUE_ON_ZERO&#39; */;</span></span>
<span class="line"><span>/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_role_0\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_role_0\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_role_0\` (</span></span>
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`name\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`role_key\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_role_0\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_role_0\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role_0\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_role_0\` VALUES (3,&#39;333&#39;,&#39;333&#39;,&#39;33&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role_0\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_role_1\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_role_1\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_role_1\` (</span></span>
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`name\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`role_key\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_role_1\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_role_1\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role_1\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_role_1\` VALUES (1,&#39;admin&#39;,&#39;admin&#39;,&#39;admin&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;),(2,&#39;11&#39;,&#39;11&#39;,&#39;11&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role_1\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user_0\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user_0\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user_0\` (</span></span>
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_0\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_0\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_0\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user_0\` VALUES (718415228786159616,&#39;pdai&#39;,&#39;dad&#39;,&#39;pdai@pdai.tech&#39;,121212121,&#39;pdai&#39;,&#39;2022-04-06 20:45:38&#39;,&#39;2022-04-06 20:45:38&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_0\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user_1\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user_1\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user_1\` (</span></span>
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_1\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_1\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_1\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user_1\` VALUES (1,&#39;pdai&#39;,&#39;dfasdf&#39;,&#39;suzhou.daipeng@gmail.com&#39;,1212121213,&#39;afsdfsaf&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;),(718415481409089537,&#39;pdai2&#39;,&#39;dad2&#39;,&#39;pdai2@pdai.tech&#39;,1212121212,&#39;pdai2&#39;,&#39;2022-04-06 20:46:38&#39;,&#39;2022-04-06 20:46:38&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_1\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user_role_0\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user_role_0\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user_role_0\` (</span></span>
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`role_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_role_0\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_role_0\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role_0\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user_role_0\` VALUES (1,1,1);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role_0\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user_role_1\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user_role_1\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user_role_1\` (</span></span>
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`role_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_role_1\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_role_1\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role_1\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user_role_1\` VALUES (11,718415481409089537,3),(13,718415228786159616,2);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role_1\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span>/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;</span></span>
<span class="line"><span>/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;</span></span>
<span class="line"><span>/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;</span></span>
<span class="line"><span>/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;</span></span>
<span class="line"><span>/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;</span></span>
<span class="line"><span>/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;</span></span>
<span class="line"><span>/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- Dump completed on 2022-04-06 23:06:23</span></span></code></pre></div><p>引入maven依赖, 包含mysql驱动，JPA, 以及sharding-jdbc的依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;mysql&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mysql-connector-java&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;8.0.28&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.github.wenhao&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jpa-spec&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.1.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-data-jpa&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.shardingsphere&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;sharding-jdbc-spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;4.1.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>增加yml配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  shardingsphere:</span></span>
<span class="line"><span>    datasource:</span></span>
<span class="line"><span>      names: ds</span></span>
<span class="line"><span>      ds:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_sharding?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>    sharding:</span></span>
<span class="line"><span>      tables:</span></span>
<span class="line"><span>        tb_user:</span></span>
<span class="line"><span>          actual-data-nodes: ds.tb_user_$-&gt;{0..1}</span></span>
<span class="line"><span>          table-strategy:</span></span>
<span class="line"><span>            inline:</span></span>
<span class="line"><span>              sharding-column: id</span></span>
<span class="line"><span>              algorithm-expression: tb_user_$-&gt;{id % 2}</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_role:</span></span>
<span class="line"><span>          actual-data-nodes: ds.tb_role_$-&gt;{0..1}</span></span>
<span class="line"><span>          table-strategy:</span></span>
<span class="line"><span>            inline:</span></span>
<span class="line"><span>              sharding-column: id</span></span>
<span class="line"><span>              algorithm-expression: tb_role_$-&gt;{id % 2}</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_user_role:</span></span>
<span class="line"><span>          actual-data-nodes: ds.tb_user_role_$-&gt;{0..1}</span></span>
<span class="line"><span>          table-strategy:</span></span>
<span class="line"><span>            inline:</span></span>
<span class="line"><span>              sharding-column: id</span></span>
<span class="line"><span>              algorithm-expression: tb_user_role_$-&gt;{id % 2}</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>      binding-tables: tb_user,tb_role,tb_user_role</span></span>
<span class="line"><span>  jpa:</span></span>
<span class="line"><span>    open-in-view: false</span></span>
<span class="line"><span>    generate-ddl: false</span></span>
<span class="line"><span>    show-sql: false</span></span>
<span class="line"><span>    properties:</span></span>
<span class="line"><span>      hibernate:</span></span>
<span class="line"><span>        dialect: org.hibernate.dialect.MySQLDialect</span></span>
<span class="line"><span>        format_sql: true</span></span>
<span class="line"><span>        use-new-id-generator-mappings: false</span></span></code></pre></div><h3 id="entity" tabindex="-1">Entity <a class="header-anchor" href="#entity" aria-label="Permalink to &quot;Entity&quot;">​</a></h3><p>user entity</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.time.LocalDateTime;</span></span>
<span class="line"><span>import java.util.Set;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.persistence.CascadeType;</span></span>
<span class="line"><span>import javax.persistence.Column;</span></span>
<span class="line"><span>import javax.persistence.Entity;</span></span>
<span class="line"><span>import javax.persistence.FetchType;</span></span>
<span class="line"><span>import javax.persistence.GeneratedValue;</span></span>
<span class="line"><span>import javax.persistence.GenerationType;</span></span>
<span class="line"><span>import javax.persistence.Id;</span></span>
<span class="line"><span>import javax.persistence.JoinColumn;</span></span>
<span class="line"><span>import javax.persistence.JoinTable;</span></span>
<span class="line"><span>import javax.persistence.ManyToMany;</span></span>
<span class="line"><span>import javax.persistence.Table;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.Getter;</span></span>
<span class="line"><span>import lombok.Setter;</span></span>
<span class="line"><span>import lombok.ToString;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Getter</span></span>
<span class="line"><span>@Setter</span></span>
<span class="line"><span>@ToString</span></span>
<span class="line"><span>@Entity</span></span>
<span class="line"><span>@Table(name = &quot;tb_user&quot;)</span></span>
<span class="line"><span>public class User implements BaseEntity {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user id.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Id</span></span>
<span class="line"><span>    @GeneratedValue(strategy = GenerationType.IDENTITY)</span></span>
<span class="line"><span>    @Column(name = &quot;id&quot;, nullable = false)</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * username.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String userName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user pwd.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String password;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * email.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String email;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * phoneNumber.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private long phoneNumber;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * description.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String description;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * create date time.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private LocalDateTime createTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * update date time.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private LocalDateTime updateTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * join to role table.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ManyToMany(cascade = {CascadeType.REFRESH}, fetch = FetchType.EAGER)</span></span>
<span class="line"><span>    @JoinTable(name = &quot;tb_user_role&quot;, joinColumns = {</span></span>
<span class="line"><span>            @JoinColumn(name = &quot;user_id&quot;)}, inverseJoinColumns = {@JoinColumn(name = &quot;role_id&quot;)})</span></span>
<span class="line"><span>    private Set&lt;Role&gt; roles;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role entity</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.time.LocalDateTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.persistence.Column;</span></span>
<span class="line"><span>import javax.persistence.Entity;</span></span>
<span class="line"><span>import javax.persistence.GeneratedValue;</span></span>
<span class="line"><span>import javax.persistence.GenerationType;</span></span>
<span class="line"><span>import javax.persistence.Id;</span></span>
<span class="line"><span>import javax.persistence.Table;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.Getter;</span></span>
<span class="line"><span>import lombok.Setter;</span></span>
<span class="line"><span>import lombok.ToString;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Getter</span></span>
<span class="line"><span>@Setter</span></span>
<span class="line"><span>@ToString</span></span>
<span class="line"><span>@Entity</span></span>
<span class="line"><span>@Table(name = &quot;tb_role&quot;)</span></span>
<span class="line"><span>public class Role implements BaseEntity {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * role id.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Id</span></span>
<span class="line"><span>    @GeneratedValue(strategy = GenerationType.IDENTITY)</span></span>
<span class="line"><span>    @Column(name = &quot;id&quot;, nullable = false)</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * role name.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * role key.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String roleKey;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * description.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String description;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * create date time.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private LocalDateTime createTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * update date time.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private LocalDateTime updateTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="dao" tabindex="-1">DAO <a class="header-anchor" href="#dao" aria-label="Permalink to &quot;DAO&quot;">​</a></h3><p>user dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface IUserDao extends IBaseDao&lt;User, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.Role;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface IRoleDao extends IBaseDao&lt;Role, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="service" tabindex="-1">Service <a class="header-anchor" href="#service" aria-label="Permalink to &quot;Service&quot;">​</a></h3><p>user service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.query.UserQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IUserService extends IBaseService&lt;User, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find by page.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param userQueryBean query</span></span>
<span class="line"><span>     * @param pageRequest   pageRequest</span></span>
<span class="line"><span>     * @return page</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    Page&lt;User&gt; findPage(UserQueryBean userQueryBean, PageRequest pageRequest);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>user service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.github.wenhao.jpa.Specifications;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import org.springframework.data.jpa.domain.Specification;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.dao.IBaseDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.dao.IUserDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class UserDoServiceImpl extends BaseDoServiceImpl&lt;User, Long&gt; implements IUserService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * userDao.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final IUserDao userDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param userDao2 user dao</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public UserDoServiceImpl(final IUserDao userDao2) {</span></span>
<span class="line"><span>        this.userDao = userDao2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return base dao</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public IBaseDao&lt;User, Long&gt; getBaseDao() {</span></span>
<span class="line"><span>        return this.userDao;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find by page.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param queryBean   query</span></span>
<span class="line"><span>     * @param pageRequest pageRequest</span></span>
<span class="line"><span>     * @return page</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Page&lt;User&gt; findPage(UserQueryBean queryBean, PageRequest pageRequest) {</span></span>
<span class="line"><span>        Specification&lt;User&gt; specification = Specifications.&lt;User&gt;and()</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(queryBean.getName()), &quot;user_name&quot;, queryBean.getName())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(queryBean.getDescription()), &quot;description&quot;,</span></span>
<span class="line"><span>                        queryBean.getDescription())</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        return this.getBaseDao().findAll(specification, pageRequest);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.query.RoleQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IRoleService extends IBaseService&lt;Role, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find page by query.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param roleQueryBean query</span></span>
<span class="line"><span>     * @param pageRequest   pageRequest</span></span>
<span class="line"><span>     * @return page</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    Page&lt;Role&gt; findPage(RoleQueryBean roleQueryBean, PageRequest pageRequest);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.github.wenhao.jpa.Specifications;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import org.springframework.data.jpa.domain.Specification;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.dao.IBaseDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.dao.IRoleDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.service.IRoleService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class RoleDoServiceImpl extends BaseDoServiceImpl&lt;Role, Long&gt; implements IRoleService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * roleDao.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final IRoleDao roleDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param roleDao2 role dao</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public RoleDoServiceImpl(final IRoleDao roleDao2) {</span></span>
<span class="line"><span>        this.roleDao = roleDao2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return base dao</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public IBaseDao&lt;Role, Long&gt; getBaseDao() {</span></span>
<span class="line"><span>        return this.roleDao;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find page by query.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param roleQueryBean query</span></span>
<span class="line"><span>     * @param pageRequest   pageRequest</span></span>
<span class="line"><span>     * @return page</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Page&lt;Role&gt; findPage(RoleQueryBean roleQueryBean, PageRequest pageRequest) {</span></span>
<span class="line"><span>        Specification&lt;Role&gt; specification = Specifications.&lt;Role&gt;and()</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(roleQueryBean.getName()), &quot;name&quot;,</span></span>
<span class="line"><span>                        roleQueryBean.getName())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(roleQueryBean.getDescription()), &quot;description&quot;,</span></span>
<span class="line"><span>                        roleQueryBean.getDescription())</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        return this.roleDao.findAll(specification, pageRequest);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller" tabindex="-1">Controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;Controller&quot;">​</a></h3><p>user controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tables.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.time.LocalDateTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.GetMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.PathVariable;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.PostMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestParam;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tables.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/user&quot;)</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private IUserService userService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @param user user param</span></span>
<span class="line"><span>     * @return user</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Add/Edit User&quot;)</span></span>
<span class="line"><span>    @PostMapping(&quot;add&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;User&gt; add(User user) {</span></span>
<span class="line"><span>        if (user.getId()==null || !userService.exists(user.getId())) {</span></span>
<span class="line"><span>            user.setCreateTime(LocalDateTime.now());</span></span>
<span class="line"><span>            user.setUpdateTime(LocalDateTime.now());</span></span>
<span class="line"><span>            userService.save(user);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            user.setUpdateTime(LocalDateTime.now());</span></span>
<span class="line"><span>            userService.update(user);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return ResponseResult.success(userService.find(user.getId()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query User One&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;edit/{userId}&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;User&gt; edit(@PathVariable(&quot;userId&quot;) Long userId) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.find(userId));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query User Page&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;list&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;Page&lt;User&gt;&gt; list(@RequestParam int pageSize, @RequestParam int pageNumber) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.findPage(UserQueryBean.builder().build(), PageRequest.of(pageNumber, pageSize)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="简单测试" tabindex="-1">简单测试 <a class="header-anchor" href="#简单测试" aria-label="Permalink to &quot;简单测试&quot;">​</a></h3><p>访问页面：</p><p><a href="http://localhost:8080/doc.html" target="_blank" rel="noreferrer">http://localhost:8080/doc.html</a></p><p>插入数据</p><p><img src="`+l+'" alt="error.图片加载失败"></p><p>查询数据</p><p><img src="'+i+'" alt="error.图片加载失败"></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',46)]))}const h=n(t,[["render",c]]);export{m as __pageData,h as default};
