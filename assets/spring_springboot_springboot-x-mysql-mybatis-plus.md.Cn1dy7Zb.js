import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/spring/springboot/springboot-mybatis-plus-1.jpeg",g=JSON.parse('{"title":"SpringBoot集成MySQL - MyBatis-Plus方式","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-mybatis-plus.md","filePath":"spring/springboot/springboot-x-mysql-mybatis-plus.md","lastUpdated":1737706346000}'),l={name:"spring/springboot/springboot-x-mysql-mybatis-plus.md"};function i(o,s,r,c,u,d){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="springboot集成mysql-mybatis-plus方式" tabindex="-1">SpringBoot集成MySQL - MyBatis-Plus方式 <a class="header-anchor" href="#springboot集成mysql-mybatis-plus方式" aria-label="Permalink to &quot;SpringBoot集成MySQL - MyBatis-Plus方式&quot;">​</a></h1><blockquote><p>MyBatis-Plus（简称 MP）是一个 MyBatis的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。MyBatis-Plus在国内也有很多的用户，本文主要介绍MyBatis-Plus和SpringBoot的集成。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>MyBatis-Plus（简称 MP）是一个 MyBatis的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。</p></blockquote><h3 id="为什么会诞生mybatis-plus" tabindex="-1">为什么会诞生MyBatis-Plus？ <a class="header-anchor" href="#为什么会诞生mybatis-plus" aria-label="Permalink to &quot;为什么会诞生MyBatis-Plus？&quot;">​</a></h3><blockquote><p>正如前文所述（<a href="https://pdai.tech/md/spring/springboot/springboot-x-mysql-mybatis-xml.html" target="_blank" rel="noreferrer">SpringBoot集成MySQL - MyBatis XML方式</a>），为了更高的效率，出现了MyBatis-Plus这类工具，对MyBatis进行增强。</p></blockquote><ol><li><strong>考虑到MyBatis是半自动化ORM</strong>，MyBatis-Plus 启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作; 并且内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求；总体上让其支持全自动化的使用方式（本质上借鉴了Hibernate思路）。</li><li><strong>考虑到Java8 Lambda（函数式编程）开始流行</strong>，MyBatis-Plus支持 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错</li><li><strong>考虑到MyBatis还需要独立引入PageHelper分页插件</strong>，MyBatis-Plus支持了内置分页插件，同PageHelper一样基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询</li><li><strong>考虑到自动化代码生成方式</strong>，MyBatis-Plus也支持了内置代码生成器，采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、 Controller 层代码，支持模板引擎，更有超多自定义配置等您来使用</li><li><strong>考虑到SQL性能优化等问题</strong>，MyBatis-Plus内置性能分析插件, 可输出 SQL 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出慢查询</li><li>其它还有解决一些常见开发问题，比如<strong>支持主键自动生成</strong>，支持4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题；以及<strong>内置全局拦截插件</strong>，提供全表 delete 、 update 操作智能分析阻断，也可自定义拦截规则，预防误操作</li></ol><h3 id="支持数据库" tabindex="-1">支持数据库 <a class="header-anchor" href="#支持数据库" aria-label="Permalink to &quot;支持数据库&quot;">​</a></h3><p>任何能使用 MyBatis 进行 CRUD, 并且支持标准 SQL 的数据库，具体支持情况如下：</p><ul><li>MySQL，Oracle，DB2，H2，HSQL，SQLite，PostgreSQL，SQLServer，Phoenix，Gauss ，ClickHouse，Sybase，OceanBase，Firebird，Cubrid，Goldilocks，csiidb</li><li>达梦数据库，虚谷数据库，人大金仓数据库，南大通用(华库)数据库，南大通用数据库，神通数据库，瀚高数据库</li></ul><h3 id="整体架构" tabindex="-1">整体架构 <a class="header-anchor" href="#整体架构" aria-label="Permalink to &quot;整体架构&quot;">​</a></h3><p><img src="'+t+`" alt="error.图片加载失败"></p><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里沿用上一篇文章的数据库, 向你展示SpringBoot + MyBatis-Plus的使用等。</p></blockquote><h3 id="准备db和依赖配置" tabindex="-1">准备DB和依赖配置 <a class="header-anchor" href="#准备db和依赖配置" aria-label="Permalink to &quot;准备DB和依赖配置&quot;">​</a></h3><p>创建MySQL的schema test_db, 导入SQL 文件如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db</span></span>
<span class="line"><span>-- ------------------------------------------------------</span></span>
<span class="line"><span>-- Server version	5.7.17-log</span></span>
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
<span class="line"><span>-- Table structure for table \`tb_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_role\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = utf8 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_role\` (</span></span>
<span class="line"><span>  \`id\` int(11) NOT NULL AUTO_INCREMENT,</span></span>
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
<span class="line"><span>INSERT INTO \`tb_role\` VALUES (1,&#39;admin&#39;,&#39;admin&#39;,&#39;admin&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = utf8 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user\` (</span></span>
<span class="line"><span>  \`id\` int(11) NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int(11) DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user\` VALUES (1,&#39;pdai&#39;,&#39;dfasdf&#39;,&#39;suzhou.daipeng@gmail.com&#39;,1212121213,&#39;afsdfsaf&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;);</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` ENABLE KEYS */;</span></span>
<span class="line"><span>UNLOCK TABLES;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Table structure for table \`tb_user_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_user_role\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = utf8 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_user_role\` (</span></span>
<span class="line"><span>  \`user_id\` int(11) NOT NULL,</span></span>
<span class="line"><span>  \`role_id\` int(11) NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_role\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user_role\` VALUES (1,1);</span></span>
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
<span class="line"><span>-- Dump completed on 2021-09-08 17:12:11</span></span></code></pre></div><p>引入maven依赖</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;mysql&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mysql-connector-java&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;8.0.28&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.baomidou&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mybatis-plus-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.5.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>增加yml配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  datasource:</span></span>
<span class="line"><span>    url: jdbc:mysql://localhost:3306/test_db?useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>    driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>    username: root</span></span>
<span class="line"><span>    password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mybatis-plus:</span></span>
<span class="line"><span>  configuration:</span></span>
<span class="line"><span>    cache-enabled: true</span></span>
<span class="line"><span>    use-generated-keys: true</span></span>
<span class="line"><span>    default-executor-type: REUSE</span></span>
<span class="line"><span>    use-actual-param-name: true</span></span></code></pre></div><h3 id="定义dao" tabindex="-1">定义dao <a class="header-anchor" href="#定义dao" aria-label="Permalink to &quot;定义dao&quot;">​</a></h3><p>(也就是你自己的xxxMapper)</p><p>RoleDao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.core.mapper.BaseMapper;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.Role;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IRoleDao extends BaseMapper&lt;Role&gt; {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserDao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.core.mapper.BaseMapper;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.UserQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IUserDao extends BaseMapper&lt;User&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;User&gt; findList(UserQueryBean userQueryBean);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里你也同时可以支持BaseMapper方式和自己定义的xml的方法（比较适用于关联查询），比如findList是自定义xml配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;</span></span>
<span class="line"><span>&lt;!DOCTYPE mapper</span></span>
<span class="line"><span>PUBLIC &quot;-//mybatis.org//DTD Mapper 3.0//EN&quot;</span></span>
<span class="line"><span>&quot;http://mybatis.org/dtd/mybatis-3-mapper.dtd&quot;&gt;</span></span>
<span class="line"><span>&lt;mapper namespace=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.dao.IUserDao&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&lt;resultMap type=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.entity.User&quot; id=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;userName&quot;     column=&quot;user_name&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;password&quot;     column=&quot;password&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;email&quot;        column=&quot;email&quot;        	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;phoneNumber&quot;  column=&quot;phone_number&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;description&quot;  column=&quot;description&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;collection property=&quot;roles&quot; ofType=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.entity.Role&quot;&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;id&quot; column=&quot;id&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;name&quot; column=&quot;name&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;roleKey&quot; column=&quot;role_key&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;description&quot; column=&quot;description&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;/collection&gt;</span></span>
<span class="line"><span>	&lt;/resultMap&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	&lt;sql id=&quot;selectUserSql&quot;&gt;</span></span>
<span class="line"><span>        select u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time, r.name, r.role_key, r.description, r.create_time, r.update_time</span></span>
<span class="line"><span>		from tb_user u</span></span>
<span class="line"><span>		left join tb_user_role ur on u.id=ur.user_id</span></span>
<span class="line"><span>		inner join tb_role r on ur.role_id=r.id</span></span>
<span class="line"><span>    &lt;/sql&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	&lt;select id=&quot;findList&quot; parameterType=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.UserQueryBean&quot; resultMap=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;include refid=&quot;selectUserSql&quot;/&gt;</span></span>
<span class="line"><span>		where u.id != 0</span></span>
<span class="line"><span>		&lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.user_name like concat(&#39;%&#39;, #{user_name}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.description like concat(&#39;%&#39;, #{description}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.phone_number like concat(&#39;%&#39;, #{phoneNumber}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.email like concat(&#39;%&#39;, #{email}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>	&lt;/select&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><h3 id="定义service接口和实现类" tabindex="-1">定义Service接口和实现类 <a class="header-anchor" href="#定义service接口和实现类" aria-label="Permalink to &quot;定义Service接口和实现类&quot;">​</a></h3><p>UserService接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.IService;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.UserQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IUserService extends IService&lt;User&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;User&gt; findList(UserQueryBean userQueryBean);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>User Service的实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.dao.IUserDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class UserDoServiceImpl extends ServiceImpl&lt;IUserDao, User&gt; implements IUserService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;User&gt; findList(UserQueryBean userQueryBean) {</span></span>
<span class="line"><span>        return baseMapper.findList(userQueryBean);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Role Service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.IService;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.RoleQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IRoleService extends IService&lt;Role&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;Role&gt; findList(RoleQueryBean roleQueryBean);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Role Service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.dao.IRoleDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.service.IRoleService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class RoleDoServiceImpl extends ServiceImpl&lt;IRoleDao, Role&gt; implements IRoleService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;Role&gt; findList(RoleQueryBean roleQueryBean) {</span></span>
<span class="line"><span>        return lambdaQuery().like(StringUtils.isNotEmpty(roleQueryBean.getName()), Role::getName, roleQueryBean.getName())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(roleQueryBean.getDescription()), Role::getDescription, roleQueryBean.getDescription())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(roleQueryBean.getRoleKey()), Role::getRoleKey, roleQueryBean.getRoleKey())</span></span>
<span class="line"><span>                .list();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller" tabindex="-1">controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;controller&quot;">​</a></h3><p>User Controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.*;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.time.LocalDateTime;</span></span>
<span class="line"><span>import java.util.List;</span></span>
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
<span class="line"><span>        if (user.getId() == null) {</span></span>
<span class="line"><span>            user.setCreateTime(LocalDateTime.now());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        user.setUpdateTime(LocalDateTime.now());</span></span>
<span class="line"><span>        userService.save(user);</span></span>
<span class="line"><span>        return ResponseResult.success(userService.getById(user.getId()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query User One&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;edit/{userId}&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;User&gt; edit(@PathVariable(&quot;userId&quot;) Long userId) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.getById(userId));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query User List&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;list&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;List&lt;User&gt;&gt; list(UserQueryBean userQueryBean) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.findList(userQueryBean));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Role Controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.GetMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.anno.service.IRoleService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/role&quot;)</span></span>
<span class="line"><span>public class RoleController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private IRoleService roleService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return role list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query Role List&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;list&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;List&lt;Role&gt;&gt; list(RoleQueryBean roleQueryBean) {</span></span>
<span class="line"><span>        return ResponseResult.success(roleService.findList(roleQueryBean));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="分页配置" tabindex="-1">分页配置 <a class="header-anchor" href="#分页配置" aria-label="Permalink to &quot;分页配置&quot;">​</a></h3><p>通过配置内置的MybatisPlusInterceptor拦截器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.anno.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;</span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Bean;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * MyBatis-plus configuration, add pagination interceptor.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class MyBatisConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * inject pagination interceptor.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return pagination</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public PaginationInnerInterceptor paginationInnerInterceptor() {</span></span>
<span class="line"><span>        return new PaginationInnerInterceptor();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * add pagination interceptor.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return MybatisPlusInterceptor</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public MybatisPlusInterceptor mybatisPlusInterceptor() {</span></span>
<span class="line"><span>        MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();</span></span>
<span class="line"><span>        mybatisPlusInterceptor.addInnerInterceptor(paginationInnerInterceptor());</span></span>
<span class="line"><span>        return mybatisPlusInterceptor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>MyBatis-plus学习梳理</p></blockquote><ul><li><a href="https://baomidou.com/" target="_blank" rel="noreferrer">官方文档在新窗口打开</a></li><li><a href="https://github.com/baomidou/mybatis-plus-samples" target="_blank" rel="noreferrer">官方案例在新窗口打开</a></li><li><a href="https://github.com/baomidou/mybatis-plus" target="_blank" rel="noreferrer">官方源码仓库在新窗口打开</a></li><li><a href="https://github.com/baomidou/awesome-mybatis-plus" target="_blank" rel="noreferrer">Awesome Mybatis-Plus在新窗口打开</a></li></ul><h3 id="比较好的实践" tabindex="-1">比较好的实践 <a class="header-anchor" href="#比较好的实践" aria-label="Permalink to &quot;比较好的实践&quot;">​</a></h3><blockquote><p>总结下开发的过程中比较好的实践</p></blockquote><ol><li>Mapper层：继承<code>BaseMapper</code></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface IRoleDao extends BaseMapper&lt;Role&gt; {</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>Service层：继承<code>ServiceImpl</code>并实现对应接口</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RoleDoServiceImpl extends ServiceImpl&lt;IRoleDao, Role&gt; implements IRoleService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>Lambda函数式查询</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public List&lt;Role&gt; findList(RoleQueryBean roleQueryBean) {</span></span>
<span class="line"><span>    return lambdaQuery().like(StringUtils.isNotEmpty(roleQueryBean.getName()), Role::getName, roleQueryBean.getName())</span></span>
<span class="line"><span>            .like(StringUtils.isNotEmpty(roleQueryBean.getDescription()), Role::getDescription, roleQueryBean.getDescription())</span></span>
<span class="line"><span>            .like(StringUtils.isNotEmpty(roleQueryBean.getRoleKey()), Role::getRoleKey, roleQueryBean.getRoleKey())</span></span>
<span class="line"><span>            .list();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>分页采用内置MybatisPlusInterceptor</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * inject pagination interceptor.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return pagination</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Bean</span></span>
<span class="line"><span>public PaginationInnerInterceptor paginationInnerInterceptor() {</span></span>
<span class="line"><span>    return new PaginationInnerInterceptor();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * add pagination interceptor.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return MybatisPlusInterceptor</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Bean</span></span>
<span class="line"><span>public MybatisPlusInterceptor mybatisPlusInterceptor() {</span></span>
<span class="line"><span>    MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();</span></span>
<span class="line"><span>    mybatisPlusInterceptor.addInnerInterceptor(paginationInnerInterceptor());</span></span>
<span class="line"><span>    return mybatisPlusInterceptor;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="5"><li>对于复杂的关联查询</li></ol><p>可以配置原生xml方式, 在其中自定义ResultMap</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;</span></span>
<span class="line"><span>&lt;!DOCTYPE mapper</span></span>
<span class="line"><span>PUBLIC &quot;-//mybatis.org//DTD Mapper 3.0//EN&quot;</span></span>
<span class="line"><span>&quot;http://mybatis.org/dtd/mybatis-3-mapper.dtd&quot;&gt;</span></span>
<span class="line"><span>&lt;mapper namespace=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.dao.IUserDao&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&lt;resultMap type=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.entity.User&quot; id=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;userName&quot;     column=&quot;user_name&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;password&quot;     column=&quot;password&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;email&quot;        column=&quot;email&quot;        	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;phoneNumber&quot;  column=&quot;phone_number&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;description&quot;  column=&quot;description&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;collection property=&quot;roles&quot; ofType=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.entity.Role&quot;&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;id&quot; column=&quot;id&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;name&quot; column=&quot;name&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;roleKey&quot; column=&quot;role_key&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;description&quot; column=&quot;description&quot;  /&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>			&lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;/collection&gt;</span></span>
<span class="line"><span>	&lt;/resultMap&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	&lt;sql id=&quot;selectUserSql&quot;&gt;</span></span>
<span class="line"><span>        select u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time, r.name, r.role_key, r.description, r.create_time, r.update_time</span></span>
<span class="line"><span>		from tb_user u</span></span>
<span class="line"><span>		left join tb_user_role ur on u.id=ur.user_id</span></span>
<span class="line"><span>		inner join tb_role r on ur.role_id=r.id</span></span>
<span class="line"><span>    &lt;/sql&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	&lt;select id=&quot;findList&quot; parameterType=&quot;tech.pdai.springboot.mysql8.mybatisplus.anno.entity.query.UserQueryBean&quot; resultMap=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;include refid=&quot;selectUserSql&quot;/&gt;</span></span>
<span class="line"><span>		where u.id != 0</span></span>
<span class="line"><span>		&lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.user_name like concat(&#39;%&#39;, #{user_name}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.description like concat(&#39;%&#39;, #{description}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.phone_number like concat(&#39;%&#39;, #{phoneNumber}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND u.email like concat(&#39;%&#39;, #{email}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>	&lt;/select&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><h3 id="除了分页插件之外还提供了哪些插件" tabindex="-1">除了分页插件之外还提供了哪些插件？ <a class="header-anchor" href="#除了分页插件之外还提供了哪些插件" aria-label="Permalink to &quot;除了分页插件之外还提供了哪些插件？&quot;">​</a></h3><p>插件都是基于拦截器实现的，MyBatis-Plus提供了如下<a href="https://baomidou.com/pages/2976a3/#mybatisplusinterceptor" target="_blank" rel="noreferrer">插件在新窗口打开</a>：</p><ul><li>自动分页: PaginationInnerInterceptor</li><li>多租户: TenantLineInnerInterceptor</li><li>动态表名: DynamicTableNameInnerInterceptor</li><li>乐观锁: OptimisticLockerInnerInterceptor</li><li>sql 性能规范: IllegalSQLInnerInterceptor</li><li>防止全表更新与删除: BlockAttackInnerInterceptor</li></ul><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,68)]))}const b=n(l,[["render",i]]);export{g as __pageData,b as default};
