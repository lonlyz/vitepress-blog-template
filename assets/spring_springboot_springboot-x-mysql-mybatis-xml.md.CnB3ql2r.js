import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const m=JSON.parse('{"title":"SpringBoot集成MySQL - MyBatis XML方式","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-mybatis-xml.md","filePath":"spring/springboot/springboot-x-mysql-mybatis-xml.md","lastUpdated":1737706346000}'),t={name:"spring/springboot/springboot-x-mysql-mybatis-xml.md"};function l(i,s,o,r,c,u){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="springboot集成mysql-mybatis-xml方式" tabindex="-1">SpringBoot集成MySQL - MyBatis XML方式 <a class="header-anchor" href="#springboot集成mysql-mybatis-xml方式" aria-label="Permalink to &quot;SpringBoot集成MySQL - MyBatis XML方式&quot;">​</a></h1><blockquote><p>上文介绍了用JPA方式的集成MySQL数据库，JPA方式在中国以外地区开发而言基本是标配，在国内MyBatis及其延伸框架较为主流。本文主要介绍<strong>MyBatis技栈的演化</strong>以及<strong>SpringBoot集成基础的MyBatis XML实现方式</strong>的实例。@pdai</p></blockquote><h2 id="准备知识" tabindex="-1">准备知识 <a class="header-anchor" href="#准备知识" aria-label="Permalink to &quot;准备知识&quot;">​</a></h2><blockquote><p>需要了解MyBatis及MyBatis技术栈的演进，这对新的开发者可以很好的构筑其知识体系。@pdai</p></blockquote><h3 id="什么是mybatis" tabindex="-1">什么是MyBatis？ <a class="header-anchor" href="#什么是mybatis" aria-label="Permalink to &quot;什么是MyBatis？&quot;">​</a></h3><blockquote><p>MyBatis是一款优秀的基于java的持久层框架，它内部封装了jdbc，使开发者只需要关注sql语句本身，而不需要花费精力去处理加载驱动、创建连接、创建statement等繁杂的过程。</p></blockquote><p>MyBatis 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。</p><ul><li>mybatis是一个优秀的基于java的持久层框架，它内部封装了jdbc，使开发者只需要关注sql语句本身，而不需要花费精力去处理加载驱动、创建连接、创建statement等繁杂的过程。</li><li>mybatis通过xml或注解的方式将要执行的各种statement配置起来，并通过java对象和statement中sql的动态参数进行映射生成最终执行的sql语句，最后由mybatis框架执行sql并将结果映射为java对象并返回。</li></ul><p><strong>MyBatis的主要设计目</strong>的就是让我们对执行SQL语句时对输入输出的数据管理更加方便，所以方便地写出SQL和方便地获取SQL的执行结果才是MyBatis的核心竞争力。</p><p><strong>Mybatis的功能架构分为三层</strong>：</p><ul><li><strong>API接口层</strong>：提供给外部使用的接口API，开发人员通过这些本地API来操纵数据库。接口层一接收到调用请求就会调用数据处理层来完成具体的数据处理。</li><li><strong>数据处理层</strong>：负责具体的SQL查找、SQL解析、SQL执行和执行结果映射处理等。它主要的目的是根据调用的请求完成一次数据库操作。</li><li><strong>基础支撑层</strong>：负责最基础的功能支撑，包括连接管理、事务管理、配置加载和缓存处理，这些都是共用的东西，将他们抽取出来作为最基础的组件。为上层的数据处理层提供最基础的支撑。</li></ul><p>更多介绍可以参考：<a href="https://mybatis.org/mybatis-3/" target="_blank" rel="noreferrer">MyBatis3 官方网站在新窗口打开</a></p><h3 id="为什么说mybatis是半自动orm" tabindex="-1">为什么说MyBatis是半自动ORM？ <a class="header-anchor" href="#为什么说mybatis是半自动orm" aria-label="Permalink to &quot;为什么说MyBatis是半自动ORM？&quot;">​</a></h3><blockquote><p>为什么说MyBatis是半自动ORM？</p></blockquote><ul><li><strong>什么是ORM</strong>？</li></ul><p>JDBC，ORM知识点可以参考<a href="https://pdai.tech/md/spring/springboot/springboot-x-hello-h2-jpa.html" target="_blank" rel="noreferrer">SpringBoot入门 - 添加内存数据库H2</a></p><ul><li><strong>什么是全自动ORM</strong>？</li></ul><p>ORM框架可以根据对象关系模型直接获取，查询关联对象或者关联集合对象，简单而言使用全自动的ORM框架查询时可以不再写SQL。典型的框架如Hibernate； 因为Spring-data-jpa很多代码也是Hibernate团队贡献的，所以spring-data-jpa也是全自动ORM框架。</p><ul><li><strong>MyBatis是半自动ORM</strong>？</li></ul><p>Mybatis 在查询关联对象或关联集合对象时，需要手动编写 sql 来完成，所以，称之为半自动ORM 映射工具。</p><p>（PS: 正是由于MyBatis是半自动框架，基于MyBatis技术栈的框架开始考虑兼容MyBatis开发框架的基础上提供自动化的能力，比如MyBatis-plus等框架）</p><h3 id="mybatis栈技术演进" tabindex="-1">MyBatis栈技术演进 <a class="header-anchor" href="#mybatis栈技术演进" aria-label="Permalink to &quot;MyBatis栈技术演进&quot;">​</a></h3><blockquote><p>了解MyBatis技术栈的演进，对你构建基于MyBatis的知识体系极为重要。@pdai</p></blockquote><h4 id="jdbc-自行封装jdbcutil" tabindex="-1">JDBC，自行封装JDBCUtil <a class="header-anchor" href="#jdbc-自行封装jdbcutil" aria-label="Permalink to &quot;JDBC，自行封装JDBCUtil&quot;">​</a></h4><p>Java5的时代，通常的开发中会自行封装JDBC的Util，比如创建 Connection，以及确保关闭 Connection等。</p><h4 id="ibatis" tabindex="-1">IBatis <a class="header-anchor" href="#ibatis" aria-label="Permalink to &quot;IBatis&quot;">​</a></h4><p>MyBatis的前身，它封装了绝大多数的 JDBC 样板代码，使得开发者只需关注 SQL 本身，而不需要花费精力去处理例如注册驱动，创建 Connection，以及确保关闭 Connection 这样繁杂的代码。</p><h4 id="mybatis" tabindex="-1">MyBatis <a class="header-anchor" href="#mybatis" aria-label="Permalink to &quot;MyBatis&quot;">​</a></h4><p>伴随着JDK5+ 泛型和注解特性开始流行，IBatis在3.0变更为MyBatis，对泛型和注解等特性开始全面支持，同时支持了很多新的特性，比如：</p><ol><li>mybatis实现了接口绑定，通过Dao接口 和xml映射文件的绑定，自动生成接口的具体实现</li><li>mybatis支持 ognl表达式，比如 <code>&lt;if&gt;, &lt;else&gt;</code>使用ognl进行解析</li><li>mybatis插件机制等，（PageHelper分页插件应用而生，解决了数据库层的分页封装问题）</li></ol><p>所以这个时期，<strong>MyBatis XML 配置方式 + PageHelper</strong> 成为重要的开发方式。</p><h4 id="mybatis衍生-代码生成工具等" tabindex="-1">MyBatis衍生：代码生成工具等 <a class="header-anchor" href="#mybatis衍生-代码生成工具等" aria-label="Permalink to &quot;MyBatis衍生：代码生成工具等&quot;">​</a></h4><p>MyBatis提供了开发上的便捷，但是依然需要写大量的xml配置，并且很多都是CRUD级别的（这便有了很多重复性的工作），所以为了减少重复编码，衍生出了MyBatis代码生成工具, 比如CodeGenerator等。</p><p>其它开发IDE也开始出现封装一些工具和插件来生成代码生成工具等。</p><p>由于后端视图解析引擎多样性（比如freemarker, volicty, thymeleaf等），以及前后端分离前端独立等，为了进一步减少重复代码的编写（包括视图层），自动生成的代码工具也开始演化为自动生成前端视图代码。</p><h4 id="spring-mybatis基于注解的配置集成" tabindex="-1">Spring+MyBatis基于注解的配置集成 <a class="header-anchor" href="#spring-mybatis基于注解的配置集成" aria-label="Permalink to &quot;Spring+MyBatis基于注解的配置集成&quot;">​</a></h4><p>与此同时，Spring 2.5 开始完全支持基于注解的配置并且也支持JSR250 注解。在Spring后续的版本发展倾向于通过注解和Java配置结合使用。基于Spring+MyBatis开发技术栈开始有xml配置方式往注解和java配置方式反向发展。</p><p>Spring Boot的出现便是要解决配置过多的问题，它实际上通过约定大于配置的方式大大简化了用户的配置，对于三方组件使用xx-starter统一的对Bean进行默认初始化，用户只需要很少的配置就可以进行开发了。所以出现了mybatis-spring-boot-starter的封装等。</p><p>这个阶段，主要的开发技术栈是 <strong>Spring + mybatis-spring-boot-starter 自动化配置 + PageHelper</strong>，并且很多数据库实体mapper还是通过xml方式配置的（伴随着使用一些自动化生成工具）。</p><h4 id="mybatis-plus" tabindex="-1">MyBatis-Plus <a class="header-anchor" href="#mybatis-plus" aria-label="Permalink to &quot;MyBatis-Plus&quot;">​</a></h4><p>为了更高的效率，出现了MyBatis-Plus这类工具，对MyBatis进行增强。</p><ol><li><strong>考虑到MyBatis是半自动化ORM</strong>，MyBatis-Plus 启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作; 并且内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求；总体上让其支持全自动化的使用方式（本质上借鉴了Hibernate思路）。</li><li><strong>考虑到Java8 Lambda（函数式编程）开始流行</strong>，MyBatis-Plus支持 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错</li><li><strong>考虑到MyBatis还需要独立引入PageHelper分页插件</strong>，MyBatis-Plus支持了内置分页插件，同PageHelper一样基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询</li><li><strong>考虑到自动化代码生成方式</strong>，MyBatis-Plus也支持了内置代码生成器，采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、 Controller 层代码，支持模板引擎，更有超多自定义配置等您来使用</li><li><strong>考虑到SQL性能优化等问题</strong>，MyBatis-Plus内置性能分析插件, 可输出 SQL 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出慢查询</li><li>其它还有解决一些常见开发问题，比如<strong>支持主键自动生成</strong>，支持4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题；以及<strong>内置全局拦截插件</strong>，提供全表 delete 、 update 操作智能分析阻断，也可自定义拦截规则，预防误操作</li></ol><p>顶层思维能力</p><p>用这种思路去理解，你便能很快了解MyBatis技术栈的演化（能够快速维护老一些的技术框架），以及理解新的中小项目中MyBatis-Plus被大量使用的原因（新项目的技术选型参考）；所以java全栈知识体系的目标是帮助你构建知识体系，甚至是辅助你培养顶层思维能力。@pdai</p><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>尽管MyBatis-Plus大行其道，MyBatis XML 配置方式 + PageHelper依然是基础使用方式。本例依然向你展示MyBatis XML 配置方式，考虑到和spring-data-jpa方式对比，这里沿用上一篇文章的数据库。后续的案例中将具体介绍MyBatis分页，以及MyBatis-Plus的使用等。</p></blockquote><h3 id="准备db和依赖配置" tabindex="-1">准备DB和依赖配置 <a class="header-anchor" href="#准备db和依赖配置" aria-label="Permalink to &quot;准备DB和依赖配置&quot;">​</a></h3><p>创建MySQL的schema test_db, 导入SQL 文件如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)</span></span>
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
<span class="line"><span>    &lt;version&gt;5.1.47&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.mybatis.spring.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mybatis-spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.1.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;!--pagehelper分页 --&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.github.pagehelper&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;pagehelper-spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.2.10&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>增加yml配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  datasource:</span></span>
<span class="line"><span>    url: jdbc:mysql://localhost:3306/test_db?useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>    driver-class-name: com.mysql.jdbc.Driver</span></span>
<span class="line"><span>    username: root</span></span>
<span class="line"><span>    password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mybatis:</span></span>
<span class="line"><span>  mapper-locations: classpath:mybatis/mapper/*.xml</span></span>
<span class="line"><span>  type-aliases-package: tech.pdai.springboot.mysql57.xml.entity</span></span>
<span class="line"><span>  configuration:</span></span>
<span class="line"><span>    cache-enabled: true</span></span>
<span class="line"><span>    use-generated-keys: true</span></span>
<span class="line"><span>    default-executor-type: REUSE</span></span>
<span class="line"><span>    use-actual-param-name: true</span></span></code></pre></div><p><code>classpath:mybatis/mapper/*.xml</code>是mapper的位置。</p><h3 id="mapper文件" tabindex="-1">Mapper文件 <a class="header-anchor" href="#mapper文件" aria-label="Permalink to &quot;Mapper文件&quot;">​</a></h3><p>mapper文件定义在配置的路径中（<code>classpath:mybatis/mapper/*.xml</code>）</p><p>UserMapper.xml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;</span></span>
<span class="line"><span>&lt;!DOCTYPE mapper</span></span>
<span class="line"><span>PUBLIC &quot;-//mybatis.org//DTD Mapper 3.0//EN&quot;</span></span>
<span class="line"><span>&quot;http://mybatis.org/dtd/mybatis-3-mapper.dtd&quot;&gt;</span></span>
<span class="line"><span>&lt;mapper namespace=&quot;tech.pdai.springboot.mysql57.mybatis.xml.dao.IUserDao&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&lt;resultMap type=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot; id=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;userName&quot;     column=&quot;user_name&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;password&quot;     column=&quot;password&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;email&quot;        column=&quot;email&quot;        	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;phoneNumber&quot;  column=&quot;phone_number&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;description&quot;  column=&quot;description&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;collection property=&quot;roles&quot; ofType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.Role&quot;&gt;</span></span>
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
<span class="line"><span>	&lt;select id=&quot;findList&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.query.UserQueryBean&quot; resultMap=&quot;UserResult&quot;&gt;</span></span>
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
<span class="line"><span>	&lt;select id=&quot;findById&quot; parameterType=&quot;Long&quot; resultMap=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;include refid=&quot;selectUserSql&quot;/&gt;</span></span>
<span class="line"><span>		where u.id = #{id}</span></span>
<span class="line"><span>	&lt;/select&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	&lt;delete id=&quot;deleteById&quot; parameterType=&quot;Long&quot;&gt;</span></span>
<span class="line"><span> 		delete from tb_user where id = #{id}</span></span>
<span class="line"><span> 	&lt;/delete&gt;</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	&lt;delete id=&quot;deleteByIds&quot; parameterType=&quot;Long&quot;&gt;</span></span>
<span class="line"><span>		delete from tb_user where id in</span></span>
<span class="line"><span> 		&lt;foreach collection=&quot;array&quot; item=&quot;id&quot; open=&quot;(&quot; separator=&quot;,&quot; close=&quot;)&quot;&gt;</span></span>
<span class="line"><span> 			#{id}</span></span>
<span class="line"><span>        &lt;/foreach&gt; </span></span>
<span class="line"><span> 	&lt;/delete&gt;</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	&lt;update id=&quot;update&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot;&gt;</span></span>
<span class="line"><span> 		update tb_user</span></span>
<span class="line"><span> 		&lt;set&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;user_name = #{userName},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;email = #{email},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;phone_number = #{phoneNumber},&lt;/if&gt;</span></span>
<span class="line"><span>			&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;description = #{description},&lt;/if&gt;</span></span>
<span class="line"><span> 			update_time = sysdate()</span></span>
<span class="line"><span> 		&lt;/set&gt;</span></span>
<span class="line"><span> 		where id = #{id}</span></span>
<span class="line"><span>	&lt;/update&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&lt;update id=&quot;updatePassword&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot;&gt;</span></span>
<span class="line"><span>		update tb_user</span></span>
<span class="line"><span>		&lt;set&gt;</span></span>
<span class="line"><span>			password = #{password}, update_time = sysdate()</span></span>
<span class="line"><span>		&lt;/set&gt;</span></span>
<span class="line"><span>		where id = #{id}</span></span>
<span class="line"><span>	&lt;/update&gt;</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	&lt;insert id=&quot;save&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot; useGeneratedKeys=&quot;true&quot; keyProperty=&quot;id&quot;&gt;</span></span>
<span class="line"><span> 		insert into tb_user(</span></span>
<span class="line"><span> 			&lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;user_name,&lt;/if&gt;</span></span>
<span class="line"><span>			&lt;if test=&quot;password != null and password != &#39;&#39;&quot;&gt;password,&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;email,&lt;/if&gt;</span></span>
<span class="line"><span>			&lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;phone_number,&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;description,&lt;/if&gt;</span></span>
<span class="line"><span> 			create_time,</span></span>
<span class="line"><span>			update_time</span></span>
<span class="line"><span> 		)values(</span></span>
<span class="line"><span> 			&lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;#{userName},&lt;/if&gt;</span></span>
<span class="line"><span>			&lt;if test=&quot;password != null and password != &#39;&#39;&quot;&gt;#{password},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;#{email},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;#{phone_number},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;#{description},&lt;/if&gt;</span></span>
<span class="line"><span> 			sysdate(),</span></span>
<span class="line"><span>			sysdate()</span></span>
<span class="line"><span> 		)</span></span>
<span class="line"><span>	&lt;/insert&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><p>RoleMapper.xml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;</span></span>
<span class="line"><span>&lt;!DOCTYPE mapper</span></span>
<span class="line"><span>PUBLIC &quot;-//mybatis.org//DTD Mapper 3.0//EN&quot;</span></span>
<span class="line"><span>&quot;http://mybatis.org/dtd/mybatis-3-mapper.dtd&quot;&gt;</span></span>
<span class="line"><span>&lt;mapper namespace=&quot;tech.pdai.springboot.mysql57.mybatis.xml.dao.IRoleDao&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&lt;resultMap type=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.Role&quot; id=&quot;RoleResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;name&quot; 		column=&quot;name&quot;  /&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;roleKey&quot; 		column=&quot;role_key&quot;  /&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;description&quot; 	column=&quot;description&quot;  /&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>	&lt;/resultMap&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	&lt;sql id=&quot;selectRoleSql&quot;&gt;</span></span>
<span class="line"><span>        select  r.id, r.name, r.role_key, r.description, r.create_time, r.update_time</span></span>
<span class="line"><span>			from tb_role r</span></span>
<span class="line"><span>    &lt;/sql&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	&lt;select id=&quot;findList&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.query.RoleQueryBean&quot; resultMap=&quot;RoleResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;include refid=&quot;selectRoleSql&quot;/&gt;</span></span>
<span class="line"><span>		where r.id != 0</span></span>
<span class="line"><span>		&lt;if test=&quot;name != null and name != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND r.name like concat(&#39;%&#39;, #{name}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;roleKey != null and roleKey != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND r.role_key = #{roleKey}</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>		&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>			AND r.description like concat(&#39;%&#39;, #{description}, &#39;%&#39;)</span></span>
<span class="line"><span>		&lt;/if&gt;</span></span>
<span class="line"><span>	&lt;/select&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><h3 id="定义dao" tabindex="-1">定义dao <a class="header-anchor" href="#定义dao" aria-label="Permalink to &quot;定义dao&quot;">​</a></h3><p>与Mapper文件中方法对应</p><p>UserDao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.ibatis.annotations.Mapper;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.UserQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Mapper</span></span>
<span class="line"><span>public interface IUserDao {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;User&gt; findList(UserQueryBean userQueryBean);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    User findById(Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int deleteById(Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int deleteByIds(Long[] ids);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int update(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int save(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int updatePassword(User user);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>RoleDao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.ibatis.annotations.Mapper;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.RoleQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Mapper</span></span>
<span class="line"><span>public interface IRoleDao {</span></span>
<span class="line"><span>    List&lt;Role&gt; findList(RoleQueryBean roleQueryBean);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="定义service接口和实现类" tabindex="-1">定义Service接口和实现类 <a class="header-anchor" href="#定义service接口和实现类" aria-label="Permalink to &quot;定义Service接口和实现类&quot;">​</a></h3><p>UserService接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.UserQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IUserService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;User&gt; findList(UserQueryBean userQueryBean);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    User findById(Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int deleteById(Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int deleteByIds(Long[] ids);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int update(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int save(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int updatePassword(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>User Service的实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.dao.IUserDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class UserDoServiceImpl implements IUserService {</span></span>
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
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;User&gt; findList(UserQueryBean userQueryBean) {</span></span>
<span class="line"><span>        return userDao.findList(userQueryBean);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public User findById(Long id) {</span></span>
<span class="line"><span>        return userDao.findById(id);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int deleteById(Long id) {</span></span>
<span class="line"><span>        return userDao.deleteById(id);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int deleteByIds(Long[] ids) {</span></span>
<span class="line"><span>        return userDao.deleteByIds(ids);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int update(User user) {</span></span>
<span class="line"><span>        return userDao.update(user);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int save(User user) {</span></span>
<span class="line"><span>        return userDao.save(user);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int updatePassword(User user) {</span></span>
<span class="line"><span>        return userDao.updatePassword(user);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Role Service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.RoleQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IRoleService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;Role&gt; findList(RoleQueryBean roleQueryBean);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Role Service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.dao.IRoleDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.service.IRoleService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class RoleDoServiceImpl implements IRoleService {</span></span>
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
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;Role&gt; findList(RoleQueryBean roleQueryBean) {</span></span>
<span class="line"><span>        return roleDao.findList(roleQueryBean);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller" tabindex="-1">controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;controller&quot;">​</a></h3><p>User Controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.time.LocalDateTime;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.GetMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.PathVariable;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.PostMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.service.IUserService;</span></span>
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
<span class="line"><span>        if (user.getId()==null) {</span></span>
<span class="line"><span>            user.setCreateTime(LocalDateTime.now());</span></span>
<span class="line"><span>            user.setUpdateTime(LocalDateTime.now());</span></span>
<span class="line"><span>            userService.save(user);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            user.setUpdateTime(LocalDateTime.now());</span></span>
<span class="line"><span>            userService.update(user);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return ResponseResult.success(userService.findById(user.getId()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query User One&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;edit/{userId}&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;User&gt; edit(@PathVariable(&quot;userId&quot;) Long userId) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.findById(userId));</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>Role Controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql57.mybatis.xml.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.GetMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql57.mybatis.xml.service.IRoleService;</span></span>
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
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query Role List&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;list&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;List&lt;Role&gt;&gt; list(RoleQueryBean roleQueryBean) {</span></span>
<span class="line"><span>        return ResponseResult.success(roleService.findList(roleQueryBean));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p>（上述代码中一些实体类和配置的完整代码，请参考如下代码仓库）</p><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,84)]))}const g=n(t,[["render",l]]);export{m as __pageData,g as default};
