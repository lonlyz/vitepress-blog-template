import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/mysql/db-sql-learn-1.png",u=JSON.parse('{"title":"SQL语言 - SQL语句练习","description":"","frontmatter":{},"headers":[],"relativePath":"db/sql-lan/sql-lan-pratice.md","filePath":"db/sql-lan/sql-lan-pratice.md","lastUpdated":1737706346000}'),i={name:"db/sql-lan/sql-lan-pratice.md"};function c(t,s,o,d,E,r){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="sql语言-sql语句练习" tabindex="-1">SQL语言 - SQL语句练习 <a class="header-anchor" href="#sql语言-sql语句练习" aria-label="Permalink to &quot;SQL语言 - SQL语句练习&quot;">​</a></h1><blockquote><p>在上文学习了SQL的基本语法以后，本文将通过最经典的“教师-学生-成绩”表来帮助你练习SQL。@pdai</p></blockquote><h2 id="构建如下表结构" tabindex="-1">构建如下表结构 <a class="header-anchor" href="#构建如下表结构" aria-label="Permalink to &quot;构建如下表结构&quot;">​</a></h2><blockquote><p>还有一个Grade表，在如下的练习中体现</p></blockquote><p><img src="'+l+`" alt="error.图片加载失败"></p><h2 id="插入数据" tabindex="-1">插入数据 <a class="header-anchor" href="#插入数据" aria-label="Permalink to &quot;插入数据&quot;">​</a></h2><blockquote><p>下面表SQL和相关测试数据是我Dump出来的</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: learn_sql_pdai_tech</span></span>
<span class="line"><span>-- ------------------------------------------------------</span></span>
<span class="line"><span>-- Server version	5.7.28</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;</span></span>
<span class="line"><span>/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;</span></span>
<span class="line"><span>/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;</span></span>
<span class="line"><span>/*!40101 SET NAMES utf8 */;</span></span>
<span class="line"><span>/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;</span></span>
<span class="line"><span>/*!40103 SET TIME_ZONE=&#39;+00:00&#39; */;</span></span>
<span class="line"><span>/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;</span></span>
<span class="line"><span>/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=&#39;NO_AUTO_VALUE_ON_ZERO&#39; */;</span></span>
<span class="line"><span>/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`COURSE\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`COURSE\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = utf8 */;</span></span>
<span class="line"><span>CREATE TABLE \`COURSE\` (</span></span>
<span class="line"><span>  \`CNO\` varchar(5) NOT NULL,</span></span>
<span class="line"><span>  \`CNAME\` varchar(10) NOT NULL,</span></span>
<span class="line"><span>  \`TNO\` varchar(10) NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`COURSE\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`COURSE\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`COURSE\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`COURSE\` VALUES (&#39;3-105&#39;,&#39;计算机导论&#39;,&#39;825&#39;),(&#39;3-245&#39;,&#39;操作系统&#39;,&#39;804&#39;),(&#39;6-166&#39;,&#39;数据电路&#39;,&#39;856&#39;),(&#39;9-888&#39;,&#39;高等数学&#39;,&#39;100&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`COURSE\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`SCORE\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`SCORE\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = utf8 */;</span></span>
<span class="line"><span>CREATE TABLE \`SCORE\` (</span></span>
<span class="line"><span>  \`SNO\` varchar(3) NOT NULL,</span></span>
<span class="line"><span>  \`CNO\` varchar(5) NOT NULL,</span></span>
<span class="line"><span>  \`DEGREE\` decimal(10,1) NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`SCORE\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`SCORE\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`SCORE\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`SCORE\` VALUES (&#39;103&#39;,&#39;3-245&#39;,86.0),(&#39;105&#39;,&#39;3-245&#39;,75.0),(&#39;109&#39;,&#39;3-245&#39;,68.0),(&#39;103&#39;,&#39;3-105&#39;,92.0),(&#39;105&#39;,&#39;3-105&#39;,88.0),(&#39;109&#39;,&#39;3-105&#39;,76.0),(&#39;101&#39;,&#39;3-105&#39;,64.0),(&#39;107&#39;,&#39;3-105&#39;,91.0),(&#39;101&#39;,&#39;6-166&#39;,85.0),(&#39;107&#39;,&#39;6-106&#39;,79.0),(&#39;108&#39;,&#39;3-105&#39;,78.0),(&#39;108&#39;,&#39;6-166&#39;,81.0);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`SCORE\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`STUDENT\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`STUDENT\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = utf8 */;</span></span>
<span class="line"><span>CREATE TABLE \`STUDENT\` (</span></span>
<span class="line"><span>  \`SNO\` varchar(3) NOT NULL,</span></span>
<span class="line"><span>  \`SNAME\` varchar(4) NOT NULL,</span></span>
<span class="line"><span>  \`SSEX\` varchar(2) NOT NULL,</span></span>
<span class="line"><span>  \`SBIRTHDAY\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`CLASS\` varchar(5) DEFAULT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`STUDENT\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`STUDENT\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`STUDENT\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`STUDENT\` VALUES (&#39;108&#39;,&#39;曾华&#39;,&#39;男&#39;,&#39;1977-09-01 00:00:00&#39;,&#39;95033&#39;),(&#39;105&#39;,&#39;匡明&#39;,&#39;男&#39;,&#39;1975-10-02 00:00:00&#39;,&#39;95031&#39;),(&#39;107&#39;,&#39;王丽&#39;,&#39;女&#39;,&#39;1976-01-23 00:00:00&#39;,&#39;95033&#39;),(&#39;101&#39;,&#39;李军&#39;,&#39;男&#39;,&#39;1976-02-20 00:00:00&#39;,&#39;95033&#39;),(&#39;109&#39;,&#39;王芳&#39;,&#39;女&#39;,&#39;1975-02-10 00:00:00&#39;,&#39;95031&#39;),(&#39;103&#39;,&#39;陆君&#39;,&#39;男&#39;,&#39;1974-06-03 00:00:00&#39;,&#39;95031&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`STUDENT\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`TEACHER\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`TEACHER\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = utf8 */;</span></span>
<span class="line"><span>CREATE TABLE \`TEACHER\` (</span></span>
<span class="line"><span>  \`TNO\` varchar(3) NOT NULL,</span></span>
<span class="line"><span>  \`TNAME\` varchar(4) NOT NULL,</span></span>
<span class="line"><span>  \`TSEX\` varchar(2) NOT NULL,</span></span>
<span class="line"><span>  \`TBIRTHDAY\` datetime NOT NULL,</span></span>
<span class="line"><span>  \`PROF\` varchar(6) DEFAULT NULL,</span></span>
<span class="line"><span>  \`DEPART\` varchar(10) NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`TEACHER\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`TEACHER\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`TEACHER\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`TEACHER\` VALUES (&#39;804&#39;,&#39;李诚&#39;,&#39;男&#39;,&#39;1958-12-02 00:00:00&#39;,&#39;副教授&#39;,&#39;计算机系&#39;),(&#39;856&#39;,&#39;张旭&#39;,&#39;男&#39;,&#39;1969-03-12 00:00:00&#39;,&#39;讲师&#39;,&#39;电子工程系&#39;),(&#39;825&#39;,&#39;王萍&#39;,&#39;女&#39;,&#39;1972-05-05 00:00:00&#39;,&#39;助教&#39;,&#39;计算机系&#39;),(&#39;831&#39;,&#39;刘冰&#39;,&#39;女&#39;,&#39;1977-08-14 00:00:00&#39;,&#39;助教&#39;,&#39;电子工程系&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`TEACHER\` ENABLE KEYS */;</span></span>
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
<span class="line"><span>-- Dump completed on 2020-02-06 18:18:25</span></span></code></pre></div><h2 id="相关练习" tabindex="-1">相关练习 <a class="header-anchor" href="#相关练习" aria-label="Permalink to &quot;相关练习&quot;">​</a></h2><ul><li>1、 查询Student表中的所有记录的Sname、Ssex和Class列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select SNAME, SSEX, CLASS from STUDENT;</span></span></code></pre></div><ul><li>2、 查询教师所有的单位即不重复的Depart列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select distinct DEPART from TEACHER;</span></span></code></pre></div><ul><li>3、 查询Student表的所有记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select * from STUDENT;</span></span></code></pre></div><ul><li>4、 查询Score表中成绩在60到80之间的所有记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where DEGREE &gt; 60 and DEGREE &lt; 80;</span></span></code></pre></div><ul><li>5、 查询Score表中成绩为85，86或88的记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where DEGREE = 85 or DEGREE = 86 or DEGREE = 88;</span></span></code></pre></div><ul><li>6、 查询Student表中“95031”班或性别为“女”的同学记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where CLASS = &#39;95031&#39; or SSEX = &#39;女&#39;;</span></span></code></pre></div><ul><li>7、 以Class降序查询Student表的所有记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>order by CLASS desc;</span></span></code></pre></div><ul><li>8、 以Cno升序、Degree降序查询Score表的所有记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>order by CNO asc, DEGREE desc;</span></span></code></pre></div><ul><li>9、 查询“95031”班的学生人数。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select count(*)</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where CLASS = &#39;95031&#39;;</span></span></code></pre></div><ul><li>10、查询Score表中的最高分的学生学号和课程号。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  sno,</span></span>
<span class="line"><span>  CNO</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where DEGREE = (</span></span>
<span class="line"><span>  select max(DEGREE)</span></span>
<span class="line"><span>  from SCORE</span></span>
<span class="line"><span>);</span></span></code></pre></div><ul><li>11、查询‘3-105’号课程的平均分。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select avg(DEGREE)</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where CNO = &#39;3-105&#39;;</span></span></code></pre></div><ul><li>12、查询Score表中至少有5名学生选修的并以3开头的课程的平均分数。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  avg(DEGREE),</span></span>
<span class="line"><span>  CNO</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where cno like &#39;3%&#39;</span></span>
<span class="line"><span>group by CNO</span></span>
<span class="line"><span>having count(*) &gt; 5;</span></span></code></pre></div><ul><li>13、查询最低分大于70，最高分小于90的Sno列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select SNO</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>group by SNO</span></span>
<span class="line"><span>having min(DEGREE) &gt; 70 and max(DEGREE) &lt; 90;</span></span></code></pre></div><ul><li>14、查询所有学生的Sname、Cno和Degree列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  SNAME,</span></span>
<span class="line"><span>  CNO,</span></span>
<span class="line"><span>  DEGREE</span></span>
<span class="line"><span>from STUDENT, SCORE</span></span>
<span class="line"><span>where STUDENT.SNO = SCORE.SNO;</span></span></code></pre></div><ul><li>15、查询所有学生的Sno、Cno和Degree列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  SCORE.SNO,</span></span>
<span class="line"><span>  CNO,</span></span>
<span class="line"><span>  DEGREE</span></span>
<span class="line"><span>from STUDENT, SCORE</span></span>
<span class="line"><span>where STUDENT.SNO = SCORE.SNO;</span></span></code></pre></div><ul><li>16、查询所有学生的Sname、Cname和Degree列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>  A.SNAME,</span></span>
<span class="line"><span>  B.CNAME,</span></span>
<span class="line"><span>  C.DEGREE</span></span>
<span class="line"><span>FROM STUDENT A</span></span>
<span class="line"><span>  JOIN (COURSE B, SCORE C)</span></span>
<span class="line"><span>    ON A.SNO = C.SNO AND B.CNO = C.CNO;</span></span></code></pre></div><ul><li>17、查询“95033”班所选课程的平均分。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select avg(DEGREE)</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where sno in (select SNO</span></span>
<span class="line"><span>              from STUDENT</span></span>
<span class="line"><span>              where CLASS = &#39;95033&#39;);</span></span></code></pre></div><ul><li>18、假设使用如下命令建立了一个grade表:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>create table grade (</span></span>
<span class="line"><span>  low  numeric(3, 0),</span></span>
<span class="line"><span>  upp  numeric(3),</span></span>
<span class="line"><span>  rank char(1)</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>insert into grade values (90, 100, &#39;A&#39;);</span></span>
<span class="line"><span>insert into grade values (80, 89, &#39;B&#39;);</span></span>
<span class="line"><span>insert into grade values (70, 79, &#39;C&#39;);</span></span>
<span class="line"><span>insert into grade values (60, 69, &#39;D&#39;);</span></span>
<span class="line"><span>insert into grade values (0, 59, &#39;E&#39;);</span></span></code></pre></div><ul><li>现查询所有同学的Sno、Cno和rank列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>  A.SNO,</span></span>
<span class="line"><span>  A.CNO,</span></span>
<span class="line"><span>  B.RANK</span></span>
<span class="line"><span>FROM SCORE A, grade B</span></span>
<span class="line"><span>WHERE A.DEGREE BETWEEN B.LOW AND B.UPP</span></span>
<span class="line"><span>ORDER BY RANK;</span></span></code></pre></div><ul><li>19、查询选修“3-105”课程的成绩高于“109”号同学成绩的所有同学的记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where CNO = &#39;3-105&#39; and DEGREE &gt; ALL (</span></span>
<span class="line"><span>  select DEGREE</span></span>
<span class="line"><span>  from SCORE</span></span>
<span class="line"><span>  where SNO = &#39;109&#39;</span></span>
<span class="line"><span>);</span></span></code></pre></div><ul><li>20、查询score中选学一门以上课程的同学中分数为非最高分成绩的学生记录</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select * from STUDENT where SNO</span></span>
<span class="line"><span>  in (select SNO</span></span>
<span class="line"><span>  from SCORE</span></span>
<span class="line"><span>  where DEGREE &lt; (select MAX(DEGREE) from SCORE)</span></span>
<span class="line"><span>  group by SNO</span></span>
<span class="line"><span>  having count(*) &gt; 1);</span></span></code></pre></div><ul><li>21、查询成绩高于学号为“109”、课程号为“3-105”的成绩的所有记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where CNO = &#39;3-105&#39; and DEGREE &gt; ALL (</span></span>
<span class="line"><span>  select DEGREE</span></span>
<span class="line"><span>  from SCORE</span></span>
<span class="line"><span>  where SNO = &#39;109&#39;</span></span>
<span class="line"><span>);</span></span></code></pre></div><ul><li>22、查询和学号为108的同学同年出生的所有学生的Sno、Sname和Sbirthday列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  SNO,</span></span>
<span class="line"><span>  SNAME,</span></span>
<span class="line"><span>  SBIRTHDAY</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where year(SBIRTHDAY) = (</span></span>
<span class="line"><span>  select year(SBIRTHDAY)</span></span>
<span class="line"><span>  from STUDENT</span></span>
<span class="line"><span>  where SNO = &#39;108&#39;</span></span>
<span class="line"><span>);</span></span></code></pre></div><ul><li>23、查询“张旭“教师任课的学生成绩。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where cno = (</span></span>
<span class="line"><span>  select CNO</span></span>
<span class="line"><span>  from COURSE</span></span>
<span class="line"><span>    inner join TEACHER on COURSE.TNO = TEACHER.TNO and TNAME = &#39;张旭&#39;</span></span>
<span class="line"><span>);</span></span></code></pre></div><ul><li>24、查询选修某课程的同学人数多于5人的教师姓名。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select TNAME</span></span>
<span class="line"><span>from TEACHER</span></span>
<span class="line"><span>where TNO = (</span></span>
<span class="line"><span>  select TNO</span></span>
<span class="line"><span>  from COURSE</span></span>
<span class="line"><span>  where CNO = (select CNO</span></span>
<span class="line"><span>               from SCORE</span></span>
<span class="line"><span>               group by CNO</span></span>
<span class="line"><span>               having count(SNO) &gt; 5)</span></span>
<span class="line"><span>);</span></span></code></pre></div><ul><li>25、查询95033班和95031班全体学生的记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where CLASS in (&#39;95033&#39;, &#39;95031&#39;);</span></span></code></pre></div><ul><li>26、查询存在有85分以上成绩的课程Cno.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select cno</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>group by CNO</span></span>
<span class="line"><span>having MAX(DEGREE) &gt; 85;</span></span></code></pre></div><ul><li>27、查询出“计算机系“教师所教课程的成绩表。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where CNO in (select CNO</span></span>
<span class="line"><span>              from TEACHER, COURSE</span></span>
<span class="line"><span>              where DEPART = &#39;计算机系&#39; and COURSE.TNO = TEACHER.TNO);</span></span></code></pre></div><ul><li>28、查询“计算机系”与“电子工程系“不同职称的教师的Tname和Prof</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  tname,</span></span>
<span class="line"><span>  prof</span></span>
<span class="line"><span>from TEACHER</span></span>
<span class="line"><span>where depart = &#39;计算机系&#39; and prof not in (</span></span>
<span class="line"><span>  select prof</span></span>
<span class="line"><span>  from TEACHER</span></span>
<span class="line"><span>  where depart = &#39;电子工程系&#39;</span></span>
<span class="line"><span>);</span></span></code></pre></div><ul><li>29、查询选修编号为“3-105“课程且成绩至少高于选修编号为“3-245”的同学的Cno、Sno和Degree,并按Degree从高到低次序排序。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  CNO,</span></span>
<span class="line"><span>  SNO,</span></span>
<span class="line"><span>  DEGREE</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where CNO = &#39;3-105&#39; and DEGREE &gt; any (</span></span>
<span class="line"><span>  select DEGREE</span></span>
<span class="line"><span>  from SCORE</span></span>
<span class="line"><span>  where CNO = &#39;3-245&#39;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>order by DEGREE desc;</span></span></code></pre></div><ul><li>30、查询选修编号为“3-105”且成绩高于选修编号为“3-245”课程的同学的Cno、Sno和Degree.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT *</span></span>
<span class="line"><span>FROM SCORE</span></span>
<span class="line"><span>WHERE CNO = &#39;3-105&#39; AND DEGREE &gt; ALL (</span></span>
<span class="line"><span>  SELECT DEGREE</span></span>
<span class="line"><span>  FROM SCORE</span></span>
<span class="line"><span>  WHERE CNO = &#39;3-245&#39;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>ORDER by DEGREE desc;</span></span></code></pre></div><ul><li>31、查询所有教师和同学的name、sex和birthday.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  TNAME     name,</span></span>
<span class="line"><span>  TSEX      sex,</span></span>
<span class="line"><span>  TBIRTHDAY birthday</span></span>
<span class="line"><span>from TEACHER</span></span>
<span class="line"><span>union</span></span>
<span class="line"><span>select</span></span>
<span class="line"><span>  sname     name,</span></span>
<span class="line"><span>  SSEX      sex,</span></span>
<span class="line"><span>  SBIRTHDAY birthday</span></span>
<span class="line"><span>from STUDENT;</span></span></code></pre></div><ul><li>32、查询所有“女”教师和“女”同学的name、sex和birthday.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  TNAME     name,</span></span>
<span class="line"><span>  TSEX      sex,</span></span>
<span class="line"><span>  TBIRTHDAY birthday</span></span>
<span class="line"><span>from TEACHER</span></span>
<span class="line"><span>where TSEX = &#39;女&#39;</span></span>
<span class="line"><span>union</span></span>
<span class="line"><span>select</span></span>
<span class="line"><span>  sname     name,</span></span>
<span class="line"><span>  SSEX      sex,</span></span>
<span class="line"><span>  SBIRTHDAY birthday</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where SSEX = &#39;女&#39;;</span></span></code></pre></div><ul><li>33、查询成绩比该课程平均成绩低的同学的成绩表。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT A.*</span></span>
<span class="line"><span>FROM SCORE A</span></span>
<span class="line"><span>WHERE DEGREE &lt; (SELECT AVG(DEGREE)</span></span>
<span class="line"><span>                FROM SCORE B</span></span>
<span class="line"><span>                WHERE A.CNO = B.CNO);</span></span></code></pre></div><ul><li>34、查询所有任课教师的Tname和Depart.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  TNAME,</span></span>
<span class="line"><span>  DEPART</span></span>
<span class="line"><span>from TEACHER a</span></span>
<span class="line"><span>where exists(select *</span></span>
<span class="line"><span>             from COURSE b</span></span>
<span class="line"><span>             where a.TNO = b.TNO);</span></span></code></pre></div><ul><li>35、查询所有未讲课的教师的Tname和Depart.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  TNAME,</span></span>
<span class="line"><span>  DEPART</span></span>
<span class="line"><span>from TEACHER a</span></span>
<span class="line"><span>where tno not in (select tno</span></span>
<span class="line"><span>                  from COURSE);</span></span></code></pre></div><ul><li>36、查询至少有2名男生的班号。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select CLASS</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where SSEX = &#39;男&#39;</span></span>
<span class="line"><span>group by CLASS</span></span>
<span class="line"><span>having count(SSEX) &gt; 1;</span></span></code></pre></div><ul><li>37、查询Student表中不姓“王”的同学记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where SNAME not like &quot;王%&quot;;</span></span></code></pre></div><ul><li>38、查询Student表中每个学生的姓名和年龄。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  SNAME,</span></span>
<span class="line"><span>  year(now()) - year(SBIRTHDAY)</span></span>
<span class="line"><span>from STUDENT;</span></span></code></pre></div><ul><li>39、查询Student表中最大和最小的Sbirthday日期值。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select min(SBIRTHDAY) birthday</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>union</span></span>
<span class="line"><span>select max(SBIRTHDAY) birthday</span></span>
<span class="line"><span>from STUDENT;</span></span></code></pre></div><ul><li>40、以班号和年龄从大到小的顺序查询Student表中的全部记录。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>order by CLASS desc, year(now()) - year(SBIRTHDAY) desc;</span></span></code></pre></div><ul><li>41、查询“男”教师及其所上的课程。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from TEACHER, COURSE</span></span>
<span class="line"><span>where TSEX = &#39;男&#39; and COURSE.TNO = TEACHER.TNO;</span></span></code></pre></div><ul><li>42、查询最高分同学的Sno、Cno和Degree列。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select</span></span>
<span class="line"><span>  sno,</span></span>
<span class="line"><span>  CNO,</span></span>
<span class="line"><span>  DEGREE</span></span>
<span class="line"><span>from SCORE</span></span>
<span class="line"><span>where DEGREE = (select max(DEGREE)</span></span>
<span class="line"><span>                from SCORE);</span></span></code></pre></div><ul><li>43、查询和“李军”同性别的所有同学的Sname.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select sname</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where SSEX = (select SSEX</span></span>
<span class="line"><span>              from STUDENT</span></span>
<span class="line"><span>              where SNAME = &#39;李军&#39;);</span></span></code></pre></div><ul><li>44、查询和“李军”同性别并同班的同学Sname.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select sname</span></span>
<span class="line"><span>from STUDENT</span></span>
<span class="line"><span>where (SSEX, CLASS) = (select</span></span>
<span class="line"><span>                         SSEX,</span></span>
<span class="line"><span>                         CLASS</span></span>
<span class="line"><span>                       from STUDENT</span></span>
<span class="line"><span>                       where SNAME = &#39;李军&#39;);</span></span></code></pre></div><ul><li>45、查询所有选修“计算机导论”课程的“男”同学的成绩表</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select *</span></span>
<span class="line"><span>from SCORE, STUDENT</span></span>
<span class="line"><span>where SCORE.SNO = STUDENT.SNO and SSEX = &#39;男&#39; and CNO = (</span></span>
<span class="line"><span>  select CNO</span></span>
<span class="line"><span>  from COURSE</span></span>
<span class="line"><span>  where CNAME = &#39;计算机导论&#39;);</span></span></code></pre></div><ul><li>46、使用游标方式来同时查询每位同学的名字，他所选课程及成绩。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>declare</span></span>
<span class="line"><span> cursor student_cursor is</span></span>
<span class="line"><span>  select S.SNO,S.SNAME,C.CNAME,SC.DEGREE as DEGREE</span></span>
<span class="line"><span>  from STUDENT S, COURSE C, SCORE SC</span></span>
<span class="line"><span>  where S.SNO=SC.SNO</span></span>
<span class="line"><span>  and SC.CNO=C.CNO;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  student_row student_cursor%ROWTYPE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>begin</span></span>
<span class="line"><span>  open student_cursor;</span></span>
<span class="line"><span>   loop</span></span>
<span class="line"><span>    fetch student_cursor INTO student_row;</span></span>
<span class="line"><span>    exit when student_cursor%NOTFOUND;</span></span>
<span class="line"><span>     dbms_output.put_line( student_row.SNO || &#39;&#39; || </span></span>
<span class="line"><span></span></span>
<span class="line"><span>student_row.SNAME|| &#39;&#39; || student_row.CNAME || &#39;&#39; ||</span></span>
<span class="line"><span></span></span>
<span class="line"><span>student_row.DEGREE);</span></span>
<span class="line"><span>   end loop;</span></span>
<span class="line"><span>  close student_cursor;</span></span>
<span class="line"><span>END;</span></span>
<span class="line"><span>/</span></span></code></pre></div><ul><li>47、 声明触发器指令，每当有同学转换班级时执行触发器显示当前和之前所在班级。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE OR REPLACE TRIGGER display_class_changes </span></span>
<span class="line"><span>AFTER DELETE OR INSERT OR UPDATE ON student </span></span>
<span class="line"><span>FOR EACH ROW </span></span>
<span class="line"><span>WHEN (NEW.sno &gt; 0) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>BEGIN </span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>   dbms_output.put_line(&#39;Old class: &#39; || :OLD.class); </span></span>
<span class="line"><span>   dbms_output.put_line(&#39;New class: &#39; || :NEW.class); </span></span>
<span class="line"><span>END; </span></span>
<span class="line"><span>/ </span></span>
<span class="line"><span></span></span>
<span class="line"><span>Update student</span></span>
<span class="line"><span>set class=95031</span></span>
<span class="line"><span>where sno=109;</span></span></code></pre></div><ul><li>48、 删除已设置的触发器指令</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TRIGGER display_class_changes;</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,108)]))}const S=n(i,[["render",c]]);export{u as __pageData,S as default};
