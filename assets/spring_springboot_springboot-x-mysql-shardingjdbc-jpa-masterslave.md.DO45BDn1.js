import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/spring-sharding-11.png",i="/vitepress-blog-template/images/spring/springboot/spring-sharding-12.png",t="/vitepress-blog-template/images/spring/springboot/springboot-sharding-5.png",r="/vitepress-blog-template/images/spring/springboot/springboot-sharding-6.png",c="/vitepress-blog-template/images/spring/springboot/springboot-sharding-7.png",o="/vitepress-blog-template/images/spring/springboot/springboot-sharding-8.png",S=JSON.parse('{"title":"SpringBoot集成ShardingJDBC - 基于JPA的读写分离","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-shardingjdbc-jpa-masterslave.md","filePath":"spring/springboot/springboot-x-mysql-shardingjdbc-jpa-masterslave.md","lastUpdated":1737706346000}'),_={name:"spring/springboot/springboot-x-mysql-shardingjdbc-jpa-masterslave.md"};function d(u,s,m,g,h,b){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="springboot集成shardingjdbc-基于jpa的读写分离" tabindex="-1">SpringBoot集成ShardingJDBC - 基于JPA的读写分离 <a class="header-anchor" href="#springboot集成shardingjdbc-基于jpa的读写分离" aria-label="Permalink to &quot;SpringBoot集成ShardingJDBC - 基于JPA的读写分离&quot;">​</a></h1><blockquote><p>本文主要介绍分表分库，以及SpringBoot集成基于ShardingJDBC的读写分离实践。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>主要理解ShardingJDBC针对读写分离库的场景和设计目标等。@pdai</p></blockquote><h3 id="读写分离库的场景和设计目标" tabindex="-1">读写分离库的场景和设计目标？ <a class="header-anchor" href="#读写分离库的场景和设计目标" aria-label="Permalink to &quot;读写分离库的场景和设计目标？&quot;">​</a></h3><blockquote><p>透明化读写分离所带来的影响，<strong>让使用方尽量像使用一个数据库一样使用主从数据库集群</strong>，是ShardingSphere读写分离模块的主要设计目标。</p></blockquote><p>面对日益增加的系统访问量，数据库的吞吐量面临着巨大瓶颈。 对于同一时刻有大量并发读操作和较少写操作类型的应用系统来说，将数据库拆分为主库和从库，<strong>主库负责处理事务性的增删改操作，从库负责处理查询操作</strong>，能够有效的避免由数据更新导致的行锁，使得整个系统的查询性能得到极大的改善。</p><p>通过一主多从的配置方式，可以将查询请求均匀的分散到多个数据副本，能够进一步的提升系统的处理能力。 使用多主多从的方式，不但能够提升系统的吞吐量，还能够提升系统的可用性，可以达到在任何一个数据库宕机，甚至磁盘物理损坏的情况下仍然不影响系统的正常运行。</p><p>与将数据根据分片键打散至各个数据节点的水平分片不同，读写分离则是根据SQL语义的分析，将读操作和写操作分别路由至主库与从库。</p><p><img src="'+l+'" alt="error.图片加载失败"></p><p>读写分离的数据节点中的数据内容是一致的，而水平分片的每个数据节点的数据内容却并不相同。将水平分片和读写分离联合使用，能够更加有效的提升系统性能。</p><p>读写分离虽然可以提升系统的吞吐量和可用性，但同时也带来了数据不一致的问题。 这包括多个主库之间的数据一致性，以及主库与从库之间的数据一致性的问题。 并且，读写分离也带来了与数据分片同样的问题，它同样会使得应用开发和运维人员对数据库的操作和运维变得更加复杂。 下图展现了将分库分表与读写分离一同使用时，应用程序与数据库集群之间的复杂拓扑关系。</p><p><img src="'+i+`" alt="error.图片加载失败"></p><h3 id="核心功能" tabindex="-1">核心功能 <a class="header-anchor" href="#核心功能" aria-label="Permalink to &quot;核心功能&quot;">​</a></h3><ul><li>提供一主多从的读写分离配置，可独立使用，也可配合分库分表使用。</li><li>独立使用读写分离支持SQL透传。</li><li>同一线程且同一数据库连接内，如有写入操作，以后的读操作均从主库读取，用于保证数据一致性。</li><li>基于Hint的强制主库路由。</li></ul><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里主要介绍SpringBoot集成基于ShardingJDBC的读写分离和数据分片实践，主要承接之前的相关文章在JPA方式的基础上实现的。</p></blockquote><h3 id="准备db和依赖配置" tabindex="-1">准备DB和依赖配置 <a class="header-anchor" href="#准备db和依赖配置" aria-label="Permalink to &quot;准备DB和依赖配置&quot;">​</a></h3><p>创建MySQL的schema test_db_sharding_master 和 test_db_sharding_slave, 导入SQL 文件如下</p><p>test_db_sharding_master</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db_sharding_master</span></span>
<span class="line"><span>-- ------------------------------------------------------</span></span>
<span class="line"><span>-- Server version	8.0.22</span></span>
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
<span class="line"><span>-- Table structure for table \`tb_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_role\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_role\` (</span></span>
<span class="line"><span>  \`id\` int NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`name\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`role_key\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_role\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role\` DISABLE KEYS */;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user\` (</span></span>
<span class="line"><span>  \`id\` int NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user\` VALUES (2,&#39;pdai2&#39;,&#39;aaa&#39;,&#39;pdai@pdai.tech&#39;,123133332,&#39;pdai2&#39;,&#39;2022-04-06 20:44:34&#39;,&#39;2022-04-06 20:44:34&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user_role\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user_role\` (</span></span>
<span class="line"><span>  \`user_id\` int NOT NULL,</span></span>
<span class="line"><span>  \`role_id\` int NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_role\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role\` DISABLE KEYS */;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role\` ENABLE KEYS */;</span></span>
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
<span class="line"><span>-- Dump completed on 2022-04-06 21:08:09</span></span></code></pre></div><p>test_db_sharding_slave</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db_sharding_slave0</span></span>
<span class="line"><span>-- ------------------------------------------------------</span></span>
<span class="line"><span>-- Server version	8.0.22</span></span>
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
<span class="line"><span>-- Table structure for table \`tb_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_role\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_role\` (</span></span>
<span class="line"><span>  \`id\` int NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`name\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`role_key\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_role\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role\` DISABLE KEYS */;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user\` (</span></span>
<span class="line"><span>  \`id\` int NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user\` VALUES (2,&#39;pdai-salve&#39;,&#39;xxx&#39;,&#39;xx&#39;,12111,&#39;pdai&#39;,&#39;2022-04-06 20:44:34&#39;,&#39;2022-04-06 20:44:34&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user_role\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user_role\` (</span></span>
<span class="line"><span>  \`user_id\` int NOT NULL,</span></span>
<span class="line"><span>  \`role_id\` int NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_role\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role\` DISABLE KEYS */;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role\` ENABLE KEYS */;</span></span>
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
<span class="line"><span>-- Dump completed on 2022-04-06 21:08:28</span></span></code></pre></div><p>引入maven依赖, 包含mysql驱动，JPA包, 以及sharding-jdbc的依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
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
<span class="line"><span>      names: master,slave0</span></span>
<span class="line"><span>      master:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_sharding_master?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>      slave0:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_sharding_slave0?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>    sharding:</span></span>
<span class="line"><span>      tables:</span></span>
<span class="line"><span>        tb_user:</span></span>
<span class="line"><span>          database-strategy:</span></span>
<span class="line"><span>            inline:</span></span>
<span class="line"><span>              sharding-column: id</span></span>
<span class="line"><span>              algorithm-expression: master</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_role:</span></span>
<span class="line"><span>          database-strategy:</span></span>
<span class="line"><span>            inline:</span></span>
<span class="line"><span>              sharding-column: id</span></span>
<span class="line"><span>              algorithm-expression: master</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_user_role:</span></span>
<span class="line"><span>          database-strategy:</span></span>
<span class="line"><span>            inline:</span></span>
<span class="line"><span>              sharding-column: id</span></span>
<span class="line"><span>              algorithm-expression: master</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>    master-slave:</span></span>
<span class="line"><span>        name: ms</span></span>
<span class="line"><span>        load-balance-algorithm-type: round_robin</span></span>
<span class="line"><span>        master-data-source-name: master</span></span>
<span class="line"><span>        slave-data-source-names: slave0</span></span>
<span class="line"><span>    props:</span></span>
<span class="line"><span>      sql:</span></span>
<span class="line"><span>        show: true</span></span>
<span class="line"><span>  jpa:</span></span>
<span class="line"><span>    open-in-view: false</span></span>
<span class="line"><span>    generate-ddl: false</span></span>
<span class="line"><span>    show-sql: false</span></span>
<span class="line"><span>    properties:</span></span>
<span class="line"><span>      hibernate:</span></span>
<span class="line"><span>        dialect: org.hibernate.dialect.MySQLDialect</span></span>
<span class="line"><span>        format_sql: true</span></span>
<span class="line"><span>        use-new-id-generator-mappings: false</span></span></code></pre></div><h3 id="entity" tabindex="-1">Entity <a class="header-anchor" href="#entity" aria-label="Permalink to &quot;Entity&quot;">​</a></h3><p>user entity</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>role entity</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h3 id="dao" tabindex="-1">DAO <a class="header-anchor" href="#dao" aria-label="Permalink to &quot;DAO&quot;">​</a></h3><p>user dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface IUserDao extends IBaseDao&lt;User, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.Role;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface IRoleDao extends IBaseDao&lt;Role, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="service" tabindex="-1">Service <a class="header-anchor" href="#service" aria-label="Permalink to &quot;Service&quot;">​</a></h3><p>user service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.query.UserQueryBean;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>user service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.github.wenhao.jpa.Specifications;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import org.springframework.data.jpa.domain.Specification;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.dao.IBaseDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.dao.IUserDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.service.IUserService;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>role service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.query.RoleQueryBean;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>role service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.github.wenhao.jpa.Specifications;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import org.springframework.data.jpa.domain.Specification;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.dao.IBaseDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.dao.IRoleDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.service.IRoleService;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller" tabindex="-1">Controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;Controller&quot;">​</a></h3><p>user controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.masterslave.controller;</span></span>
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
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.masterslave.service.IUserService;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h3 id="简单测试" tabindex="-1">简单测试 <a class="header-anchor" href="#简单测试" aria-label="Permalink to &quot;简单测试&quot;">​</a></h3><p>访问页面：</p><p><a href="http://localhost:8080/doc.html" target="_blank" rel="noreferrer">http://localhost:8080/doc.html</a></p><p><strong>插入数据，写入master库</strong></p><p><img src="`+t+'" alt="error.图片加载失败"></p><p>(注意：主库和从库的数据同步不是shardingJDBC做的，需要自行同步)</p><p><img src="'+r+'" alt="error.图片加载失败"></p><p><strong>查询数据，从slave中查询</strong></p><p>slave db中的数据</p><p><img src="'+c+'" alt="error.图片加载失败"></p><p>查询结果</p><p><img src="'+o+`" alt="error.图片加载失败"></p><p>相关查询console打印出的日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// pdai: 如下是插入</span></span>
<span class="line"><span>2022-04-06 20:44:11.045  INFO 26013 --- [nio-8080-exec-4] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms</span></span>
<span class="line"><span>2022-04-06 20:44:34.127  INFO 26013 --- [nio-8080-exec-8] ShardingSphere-SQL                       : Logic SQL: insert into tb_user (create_time, description, email, password, phone_number, update_time, user_name) values (?, ?, ?, ?, ?, ?, ?)</span></span>
<span class="line"><span>2022-04-06 20:44:34.127  INFO 26013 --- [nio-8080-exec-8] ShardingSphere-SQL                       : SQLStatement: CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.InsertStatement@5a160db9, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@4070419f)</span></span>
<span class="line"><span>2022-04-06 20:44:34.128  INFO 26013 --- [nio-8080-exec-8] ShardingSphere-SQL                       : Actual SQL: master ::: insert into tb_user (create_time, description, email, password, phone_number, update_time, user_name) values (?, ?, ?, ?, ?, ?, ?)</span></span>
<span class="line"><span>2022-04-06 20:44:34.184  INFO 26013 --- [nio-8080-exec-8] ShardingSphere-SQL                       : Logic SQL: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.update_time as update_t7_1_0_, user0_.user_name as user_nam8_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.update_time as update_t6_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=?</span></span>
<span class="line"><span>2022-04-06 20:44:34.184  INFO 26013 --- [nio-8080-exec-8] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@1089fea0, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@60fc819), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@60fc819, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=541, distinctRow=false, projections=[ColumnProjection(owner=user0_, name=id, alias=Optional[id1_1_0_]), ColumnProjection(owner=user0_, name=create_time, alias=Optional[create_t2_1_0_]), ColumnProjection(owner=user0_, name=description, alias=Optional[descript3_1_0_]), ColumnProjection(owner=user0_, name=email, alias=Optional[email4_1_0_]), ColumnProjection(owner=user0_, name=password, alias=Optional[password5_1_0_]), ColumnProjection(owner=user0_, name=phone_number, alias=Optional[phone_nu6_1_0_]), ColumnProjection(owner=user0_, name=update_time, alias=Optional[update_t7_1_0_]), ColumnProjection(owner=user0_, name=user_name, alias=Optional[user_nam8_1_0_]), ColumnProjection(owner=roles1_, name=user_id, alias=Optional[user_id1_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[role_id2_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[id1_0_2_]), ColumnProjection(owner=role2_, name=create_time, alias=Optional[create_t2_0_2_]), ColumnProjection(owner=role2_, name=description, alias=Optional[descript3_0_2_]), ColumnProjection(owner=role2_, name=name, alias=Optional[name4_0_2_]), ColumnProjection(owner=role2_, name=role_key, alias=Optional[role_key5_0_2_]), ColumnProjection(owner=role2_, name=update_time, alias=Optional[update_t6_0_2_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@456da89f, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@4f139aa4, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@10b01118, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-06 20:44:34.184  INFO 26013 --- [nio-8080-exec-8] ShardingSphere-SQL                       : Actual SQL: slave0 ::: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.update_time as update_t7_1_0_, user0_.user_name as user_nam8_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.update_time as update_t6_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// pdai: 如下是查询</span></span>
<span class="line"><span>2022-04-06 20:58:50.220  INFO 26013 --- [nio-8080-exec-5] ShardingSphere-SQL                       : Logic SQL: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.update_time as update_t7_1_0_, user0_.user_name as user_nam8_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.update_time as update_t6_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=?</span></span>
<span class="line"><span>2022-04-06 20:58:50.220  INFO 26013 --- [nio-8080-exec-5] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@1089fea0, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@75ff28f7), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@75ff28f7, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=541, distinctRow=false, projections=[ColumnProjection(owner=user0_, name=id, alias=Optional[id1_1_0_]), ColumnProjection(owner=user0_, name=create_time, alias=Optional[create_t2_1_0_]), ColumnProjection(owner=user0_, name=description, alias=Optional[descript3_1_0_]), ColumnProjection(owner=user0_, name=email, alias=Optional[email4_1_0_]), ColumnProjection(owner=user0_, name=password, alias=Optional[password5_1_0_]), ColumnProjection(owner=user0_, name=phone_number, alias=Optional[phone_nu6_1_0_]), ColumnProjection(owner=user0_, name=update_time, alias=Optional[update_t7_1_0_]), ColumnProjection(owner=user0_, name=user_name, alias=Optional[user_nam8_1_0_]), ColumnProjection(owner=roles1_, name=user_id, alias=Optional[user_id1_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[role_id2_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[id1_0_2_]), ColumnProjection(owner=role2_, name=create_time, alias=Optional[create_t2_0_2_]), ColumnProjection(owner=role2_, name=description, alias=Optional[descript3_0_2_]), ColumnProjection(owner=role2_, name=name, alias=Optional[name4_0_2_]), ColumnProjection(owner=role2_, name=role_key, alias=Optional[role_key5_0_2_]), ColumnProjection(owner=role2_, name=update_time, alias=Optional[update_t6_0_2_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@1d491acc, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@61fdb66b, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@2ee96c65, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-06 20:58:50.220  INFO 26013 --- [nio-8080-exec-5] ShardingSphere-SQL                       : Actual SQL: slave0 ::: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.update_time as update_t7_1_0_, user0_.user_name as user_nam8_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.update_time as update_t6_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=?</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过几个问题进一步理解。</p></blockquote><h3 id="shardingjdbc的主从分离解决不了什么问题" tabindex="-1">shardingJDBC的主从分离解决不了什么问题？ <a class="header-anchor" href="#shardingjdbc的主从分离解决不了什么问题" aria-label="Permalink to &quot;shardingJDBC的主从分离解决不了什么问题？&quot;">​</a></h3><ul><li>主库和从库的数据同步。</li><li>主库和从库的数据同步延迟导致的数据不一致。</li><li>主库双写或多写。</li></ul><h3 id="读写分离加数据分片" tabindex="-1">读写分离加数据分片？ <a class="header-anchor" href="#读写分离加数据分片" aria-label="Permalink to &quot;读写分离加数据分片？&quot;">​</a></h3><p>可以参考官方给的如下配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dataSources:</span></span>
<span class="line"><span>  ds0: !!org.apache.commons.dbcp.BasicDataSource</span></span>
<span class="line"><span>    driverClassName: com.mysql.jdbc.Driver</span></span>
<span class="line"><span>    url: jdbc:mysql://localhost:3306/ds0</span></span>
<span class="line"><span>    username: root</span></span>
<span class="line"><span>    password: </span></span>
<span class="line"><span>  ds0_slave0: !!org.apache.commons.dbcp.BasicDataSource</span></span>
<span class="line"><span>      driverClassName: com.mysql.jdbc.Driver</span></span>
<span class="line"><span>      url: jdbc:mysql://localhost:3306/ds0_slave0</span></span>
<span class="line"><span>      username: root</span></span>
<span class="line"><span>      password: </span></span>
<span class="line"><span>  ds0_slave1: !!org.apache.commons.dbcp.BasicDataSource</span></span>
<span class="line"><span>      driverClassName: com.mysql.jdbc.Driver</span></span>
<span class="line"><span>      url: jdbc:mysql://localhost:3306/ds0_slave1</span></span>
<span class="line"><span>      username: root</span></span>
<span class="line"><span>      password: </span></span>
<span class="line"><span>  ds1: !!org.apache.commons.dbcp.BasicDataSource</span></span>
<span class="line"><span>    driverClassName: com.mysql.jdbc.Driver</span></span>
<span class="line"><span>    url: jdbc:mysql://localhost:3306/ds1</span></span>
<span class="line"><span>    username: root</span></span>
<span class="line"><span>    password: </span></span>
<span class="line"><span>  ds1_slave0: !!org.apache.commons.dbcp.BasicDataSource</span></span>
<span class="line"><span>        driverClassName: com.mysql.jdbc.Driver</span></span>
<span class="line"><span>        url: jdbc:mysql://localhost:3306/ds1_slave0</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: </span></span>
<span class="line"><span>  ds1_slave1: !!org.apache.commons.dbcp.BasicDataSource</span></span>
<span class="line"><span>        driverClassName: com.mysql.jdbc.Driver</span></span>
<span class="line"><span>        url: jdbc:mysql://localhost:3306/ds1_slave1</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: </span></span>
<span class="line"><span></span></span>
<span class="line"><span>shardingRule:  </span></span>
<span class="line"><span>  tables:</span></span>
<span class="line"><span>    t_order: </span></span>
<span class="line"><span>      actualDataNodes: ms_ds\${0..1}.t_order\${0..1}</span></span>
<span class="line"><span>      databaseStrategy:</span></span>
<span class="line"><span>        inline:</span></span>
<span class="line"><span>          shardingColumn: user_id</span></span>
<span class="line"><span>          algorithmExpression: ms_ds\${user_id % 2}</span></span>
<span class="line"><span>      tableStrategy: </span></span>
<span class="line"><span>        inline:</span></span>
<span class="line"><span>          shardingColumn: order_id</span></span>
<span class="line"><span>          algorithmExpression: t_order\${order_id % 2}</span></span>
<span class="line"><span>      keyGenerator:</span></span>
<span class="line"><span>        type: SNOWFLAKE</span></span>
<span class="line"><span>        column: order_id</span></span>
<span class="line"><span>    t_order_item:</span></span>
<span class="line"><span>      actualDataNodes: ms_ds\${0..1}.t_order_item\${0..1}</span></span>
<span class="line"><span>      databaseStrategy:</span></span>
<span class="line"><span>        inline:</span></span>
<span class="line"><span>          shardingColumn: user_id</span></span>
<span class="line"><span>          algorithmExpression: ms_ds\${user_id % 2}</span></span>
<span class="line"><span>      tableStrategy:</span></span>
<span class="line"><span>        inline:</span></span>
<span class="line"><span>          shardingColumn: order_id</span></span>
<span class="line"><span>          algorithmExpression: t_order_item\${order_id % 2}  </span></span>
<span class="line"><span>  bindingTables:</span></span>
<span class="line"><span>    - t_order,t_order_item</span></span>
<span class="line"><span>  broadcastTables:</span></span>
<span class="line"><span>    - t_config</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  defaultDataSourceName: ds0</span></span>
<span class="line"><span>  defaultTableStrategy:</span></span>
<span class="line"><span>    none:</span></span>
<span class="line"><span>  defaultKeyGenerator:</span></span>
<span class="line"><span>    type: SNOWFLAKE</span></span>
<span class="line"><span>    column: order_id</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  masterSlaveRules:</span></span>
<span class="line"><span>      ms_ds0:</span></span>
<span class="line"><span>        masterDataSourceName: ds0</span></span>
<span class="line"><span>        slaveDataSourceNames:</span></span>
<span class="line"><span>          - ds0_slave0</span></span>
<span class="line"><span>          - ds0_slave1</span></span>
<span class="line"><span>        loadBalanceAlgorithmType: ROUND_ROBIN</span></span>
<span class="line"><span>      ms_ds1:</span></span>
<span class="line"><span>        masterDataSourceName: ds1</span></span>
<span class="line"><span>        slaveDataSourceNames: </span></span>
<span class="line"><span>          - ds1_slave0</span></span>
<span class="line"><span>          - ds1_slave1</span></span>
<span class="line"><span>        loadBalanceAlgorithmType: ROUND_ROBIN</span></span>
<span class="line"><span>props:</span></span>
<span class="line"><span>  sql.show: true</span></span></code></pre></div><p>!! 表示实例化该类</p><ul><li>表示可以包含一个或多个</li></ul><p>[] 表示数组，可以与减号相互替换使用</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,76)]))}const T=n(_,[["render",d]]);export{S as __pageData,T as default};
