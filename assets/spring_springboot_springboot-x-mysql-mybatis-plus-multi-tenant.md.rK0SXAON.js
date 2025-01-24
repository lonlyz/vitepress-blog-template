import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-mybatis-plus-tenant-1.png",b=JSON.parse('{"title":"SpringBoot集成MySQL - MyBatis-Plus基于字段隔离的多租户","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-mybatis-plus-multi-tenant.md","filePath":"spring/springboot/springboot-x-mysql-mybatis-plus-multi-tenant.md","lastUpdated":1737706346000}'),t={name:"spring/springboot/springboot-x-mysql-mybatis-plus-multi-tenant.md"};function i(r,n,o,c,u,d){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="springboot集成mysql-mybatis-plus基于字段隔离的多租户" tabindex="-1">SpringBoot集成MySQL - MyBatis-Plus基于字段隔离的多租户 <a class="header-anchor" href="#springboot集成mysql-mybatis-plus基于字段隔离的多租户" aria-label="Permalink to &quot;SpringBoot集成MySQL - MyBatis-Plus基于字段隔离的多租户&quot;">​</a></h1><blockquote><p>本文主要介绍 MyBatis-Plus的基于字段隔离的多租户实现，以及MyBatis-Plus的基于字段的隔离方式实践和原理。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要了解多租户及常见的实现方式，以及MyBatis-Plus的基于字段的隔离方式原理。@pdai</p></blockquote><h3 id="什么是多租户" tabindex="-1">什么是多租户？ <a class="header-anchor" href="#什么是多租户" aria-label="Permalink to &quot;什么是多租户？&quot;">​</a></h3><blockquote><p>如下解释来源于百度百科</p></blockquote><p>多租户技术（英语：multi-tenancy technology）或称多重租赁技术，是一种软件架构技术，它是在探讨与实现如何于多用户的环境下共用相同的系统或程序组件，并且仍可确保各用户间数据的隔离性。</p><p>多租户简单来说是指一个单独的实例可以为多个组织服务。多租户技术为共用的数据中心内如何以单一系统架构与服务提供多数客户端相同甚至可定制化的服务，并且仍然可以保障客户的数据隔离。一个支持多租户技术的系统需要在设计上对它的数据和配置进行虚拟分区，从而使系统的每个租户或称组织都能够使用一个单独的系统实例，并且每个租户都可以根据自己的需求对租用的系统实例进行个性化配置。</p><p>多租户技术可以实现多个租户之间共享系统实例，同时又可以实现租户的系统实例的个性化定制。通过使用多租户技术可以保证系统共性的部分被共享，个性的部分被单独隔离。通过在多个租户之间的资源复用，运营管理维护资源，有效节省开发应用的成本。而且，在租户之间共享应用程序的单个实例，可以实现当应用程序升级时，所有租户可以同时升级。同时，因为多个租户共享一份系统的核心代码，因此当系统升级时，只需要升级相同的核心代码即可。</p><h3 id="多租户在数据存储上有哪些实现方式" tabindex="-1">多租户在数据存储上有哪些实现方式？ <a class="header-anchor" href="#多租户在数据存储上有哪些实现方式" aria-label="Permalink to &quot;多租户在数据存储上有哪些实现方式？&quot;">​</a></h3><blockquote><p>如下解释来源于百度百科</p></blockquote><p>多租户在数据存储上存在三种主要的方案，分别是</p><h4 id="db隔离-独立数据库" tabindex="-1">DB隔离：独立数据库 <a class="header-anchor" href="#db隔离-独立数据库" aria-label="Permalink to &quot;DB隔离：独立数据库&quot;">​</a></h4><p>这是第一种方案，即<strong>一个租户一个数据库</strong>，这种方案的用户数据隔离级别最高，安全性最好，但成本也高。</p><ul><li><strong>优点</strong>：</li></ul><ol><li>为不同的租户提供独立的数据库，有助于简化数据模型的扩展设计，满足不同租户的独特需求；</li><li>如果出现故障，恢复数据比较简单。</li></ol><ul><li><strong>缺点</strong>：</li></ul><ol><li>增大了数据库的安装数量，随之带来维护成本和购置成本的增加。</li><li>这种方案与传统的一个客户、一套数据、一套部署类似，差别只在于软件统一部署在运营商那里。如果面对的是银行、医院等需要非常高数据隔离级别的租户，可以选择这种模式，提高租用的定价。如果定价较低，产品走低价路线，这种方案一般对运营商来说是无法承受的。</li></ol><h4 id="schema隔离-共享数据库-隔离数据架构" tabindex="-1">Schema隔离：共享数据库，隔离数据架构 <a class="header-anchor" href="#schema隔离-共享数据库-隔离数据架构" aria-label="Permalink to &quot;Schema隔离：共享数据库，隔离数据架构&quot;">​</a></h4><p>这是第二种方案，即多个或所有租户共享Database，但<strong>一个租户（Tenant）一个Schema</strong>。</p><ul><li><strong>优点</strong>：</li></ul><ol><li>为安全性要求较高的租户提供了一定程度的逻辑数据隔离，并不是完全隔离；每个数据库可以支持更多的租户数量。</li></ol><ul><li><strong>缺点</strong>：</li></ul><ol><li>如果出现故障，数据恢复比较困难，因为恢复数据库将牵扯到其他租户的数据；</li><li>如果需要跨租户统计数据，存在一定困难。</li></ol><h4 id="字段隔离-共享数据库-共享数据架构" tabindex="-1">字段隔离：共享数据库，共享数据架构 <a class="header-anchor" href="#字段隔离-共享数据库-共享数据架构" aria-label="Permalink to &quot;字段隔离：共享数据库，共享数据架构&quot;">​</a></h4><p>这是第三种方案，即租户共享同一个Database、同一个Schema，但在表中<strong>通过TenantID区分租户的数据</strong>。这是共享程度最高、隔离级别最低的模式。</p><ul><li><strong>优点</strong>：</li></ul><ol><li>三种方案比较，第三种方案的维护和购置成本最低，允许每个数据库支持的租户数量最多。</li></ol><ul><li><strong>缺点</strong>：</li></ul><ol><li>隔离级别最低，安全性最低，需要在设计开发时加大对安全的开发量；</li><li>数据备份和恢复最困难，需要逐表逐条备份和还原。</li><li>如果希望以最少的服务器为最多的租户提供服务，并且租户接受以牺牲隔离级别换取降低成本，这种方案最适合。</li></ol><h3 id="mybatis-plus的基于字段的隔离方式原理是什么" tabindex="-1">MyBatis-Plus的基于字段的隔离方式原理是什么？ <a class="header-anchor" href="#mybatis-plus的基于字段的隔离方式原理是什么" aria-label="Permalink to &quot;MyBatis-Plus的基于字段的隔离方式原理是什么？&quot;">​</a></h3><p>这里请看MyBatis的插件机制：<a href="https://pdai.tech/md/framework/orm-mybatis/mybatis-y-plugin.html" target="_blank" rel="noreferrer">MyBatis详解 - 插件机制</a></p><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里沿用之前的test_db，在表中添加tenant_id，并命名为新的schema test_db_tenant。</p></blockquote><h3 id="准备db和依赖配置" tabindex="-1">准备DB和依赖配置 <a class="header-anchor" href="#准备db和依赖配置" aria-label="Permalink to &quot;准备DB和依赖配置&quot;">​</a></h3><p>创建MySQL的schema test_db_tenant, 导入SQL 文件如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db_tenant</span></span>
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
<span class="line"><span>-- Table structure for table \`tb_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`tb_role\`;</span></span>
<span class="line"><span>/*!40101 SET @saved_cs_client     = @@character_set_client */;</span></span>
<span class="line"><span>/*!50503 SET character_set_client = utf8mb4 */;</span></span>
<span class="line"><span>CREATE TABLE \`tb_role\` (</span></span>
<span class="line"><span>  \`id\` int NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`tenant_id\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`name\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`role_key\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_role\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_role\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_role\` VALUES (1,1,&#39;admin&#39;,&#39;admin&#39;,&#39;admin&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;);</span></span>
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
<span class="line"><span>  \`tenant_id\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user\` VALUES (1,1,&#39;pdai&#39;,&#39;dfasdf&#39;,&#39;suzhou.daipeng@gmail.com&#39;,1212121213,&#39;afsdfsaf&#39;,&#39;2021-09-08 17:09:15&#39;,&#39;2021-09-08 17:09:15&#39;);</span></span>
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
<span class="line"><span>  \`role_id\` int NOT NULL,</span></span>
<span class="line"><span>  \`tenant_id\` int NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user_role\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user_role\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user_role\` DISABLE KEYS */;</span></span>
<span class="line"><span>INSERT INTO \`tb_user_role\` VALUES (1,1,1);</span></span>
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
<span class="line"><span>-- Dump completed on 2022-04-02 12:50:14</span></span></code></pre></div><p>引入maven依赖</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
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
<span class="line"><span>    url: jdbc:mysql://localhost:3306/test_db_tenant?useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>    driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>    username: root</span></span>
<span class="line"><span>    password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mybatis-plus:</span></span>
<span class="line"><span>  configuration:</span></span>
<span class="line"><span>    cache-enabled: true</span></span>
<span class="line"><span>    use-generated-keys: true</span></span>
<span class="line"><span>    default-executor-type: REUSE</span></span>
<span class="line"><span>    use-actual-param-name: true</span></span>
<span class="line"><span>    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl # 输出SQL log 方便 debug</span></span></code></pre></div><h3 id="mybatis-plus配置" tabindex="-1">MyBatis-Plus配置 <a class="header-anchor" href="#mybatis-plus配置" aria-label="Permalink to &quot;MyBatis-Plus配置&quot;">​</a></h3><p>通过添加TenantLineInnerInterceptor来完成。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;</span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;</span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;</span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor;</span></span>
<span class="line"><span>import net.sf.jsqlparser.expression.Expression;</span></span>
<span class="line"><span>import net.sf.jsqlparser.expression.LongValue;</span></span>
<span class="line"><span>import net.sf.jsqlparser.schema.Column;</span></span>
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
<span class="line"><span>     * add interceptor.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return MybatisPlusInterceptor</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public MybatisPlusInterceptor mybatisPlusInterceptor() {</span></span>
<span class="line"><span>        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();</span></span>
<span class="line"><span>        // TenantLineInnerInterceptor</span></span>
<span class="line"><span>        interceptor.addInnerInterceptor(new TenantLineInnerInterceptor(new TenantLineHandler() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public Expression getTenantId() {</span></span>
<span class="line"><span>                // 实际可以将TenantId放在threadLocale中(比如xxxxContext中)，并获取。</span></span>
<span class="line"><span>                return new LongValue(1);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public String getTenantIdColumn() {</span></span>
<span class="line"><span>                return &quot;tenant_id&quot;;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public boolean ignoreTable(String tableName) {</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public boolean ignoreInsert(List&lt;Column&gt; columns, String tenantIdColumn) {</span></span>
<span class="line"><span>                return TenantLineHandler.super.ignoreInsert(columns, tenantIdColumn);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }));</span></span>
<span class="line"><span>        // 如果用了分页插件注意先 add TenantLineInnerInterceptor 再 add PaginationInnerInterceptor</span></span>
<span class="line"><span>        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());</span></span>
<span class="line"><span>        return interceptor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="定义dao" tabindex="-1">定义dao <a class="header-anchor" href="#定义dao" aria-label="Permalink to &quot;定义dao&quot;">​</a></h3><p>(也就是你自己的xxxMapper)</p><p>RoleDao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.core.mapper.BaseMapper;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.Role;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IRoleDao extends BaseMapper&lt;Role&gt; {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserDao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.core.mapper.BaseMapper;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.UserQueryBean;</span></span>
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
<span class="line"><span>&lt;mapper namespace=&quot;tech.pdai.springboot.mysql8.mybatisplus.tenant.dao.IUserDao&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&lt;resultMap type=&quot;tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.User&quot; id=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>		&lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;userName&quot;     column=&quot;user_name&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;password&quot;     column=&quot;password&quot;    	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;email&quot;        column=&quot;email&quot;        	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;phoneNumber&quot;  column=&quot;phone_number&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;description&quot;  column=&quot;description&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>		&lt;collection property=&quot;roles&quot; ofType=&quot;tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.Role&quot;&gt;</span></span>
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
<span class="line"><span>	&lt;select id=&quot;findList&quot; parameterType=&quot;tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.UserQueryBean&quot; resultMap=&quot;UserResult&quot;&gt;</span></span>
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
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><h3 id="定义service接口和实现类" tabindex="-1">定义Service接口和实现类 <a class="header-anchor" href="#定义service接口和实现类" aria-label="Permalink to &quot;定义Service接口和实现类&quot;">​</a></h3><p>UserService接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.IService;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.UserQueryBean;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>User Service的实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.dao.IUserDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.service.IUserService;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>Role Service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.IService;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.RoleQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IRoleService extends IService&lt;Role&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;Role&gt; findList(RoleQueryBean roleQueryBean);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Role Service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.dao.IRoleDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.service.IRoleService;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller" tabindex="-1">controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;controller&quot;">​</a></h3><p>User Controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.*;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.service.IUserService;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>Role Controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.mysql8.mybatisplus.tenant.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.GetMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.mysql8.mybatisplus.tenant.service.IRoleService;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h3 id="简单测试" tabindex="-1">简单测试 <a class="header-anchor" href="#简单测试" aria-label="Permalink to &quot;简单测试&quot;">​</a></h3><p>访问页面：</p><p><a href="http://localhost:8080/doc.html" target="_blank" rel="noreferrer">http://localhost:8080/doc.html</a></p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>拦截之前的SQL</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>original SQL: select u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time, r.name, r.role_key, r.description, r.create_time, r.update_time</span></span>
<span class="line"><span>		from tb_user u</span></span>
<span class="line"><span>		left join tb_user_role ur on u.id=ur.user_id</span></span>
<span class="line"><span>		inner join tb_role r on ur.role_id=r.id  </span></span>
<span class="line"><span>		where u.id != 0</span></span></code></pre></div><p>最后执行的SQL中，对联表查询的每个表都加了：tenant_id</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2021-09-22 20:26:22.368  INFO 28404 --- [nio-8080-exec-1] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.</span></span>
<span class="line"><span>JDBC Connection [HikariProxyConnection@529070127 wrapping com.mysql.cj.jdbc.ConnectionImpl@785a9c8] will not be managed by Spring</span></span>
<span class="line"><span>==&gt;  Preparing: SELECT u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time, r.name, r.role_key, r.description, r.create_time, r.update_time FROM tb_user u LEFT JOIN tb_user_role ur ON u.id = ur.user_id AND ur.tenant_id = 1 INNER JOIN tb_role r ON ur.role_id = r.id AND u.tenant_id = 1 AND r.tenant_id = 1 WHERE u.id != 0</span></span>
<span class="line"><span>==&gt; Parameters: </span></span>
<span class="line"><span>&lt;==    Columns: id, password, user_name, email, phone_number, description, create_time, update_time, name, role_key, description, create_time, update_time</span></span>
<span class="line"><span>&lt;==        Row: 1, dfasdf, pdai, suzhou.daipeng@gmail.com, 1212121213, afsdfsaf, 2021-09-08 17:09:15, 2021-09-08 17:09:15, admin, admin, admin, 2021-09-08 17:09:15, 2021-09-08 17:09:15</span></span>
<span class="line"><span>&lt;==      Total: 1</span></span>
<span class="line"><span>Closing non transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@5cf94cf9]</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>在实际使用字段进行多租户隔离时有哪些注意点呢？</p></blockquote><h3 id="来自官方的注意点" tabindex="-1">来自官方的注意点 <a class="header-anchor" href="#来自官方的注意点" aria-label="Permalink to &quot;来自官方的注意点&quot;">​</a></h3><blockquote><p><a href="https://baomidou.com/pages/aef2f2/#tenantlineinnerinterceptor" target="_blank" rel="noreferrer">相关建议在新窗口打开</a></p></blockquote><ol><li>多租户 != 权限过滤,不要乱用,租户之间是完全隔离的!!!</li><li>启用多租户后所有执行的method的sql都会进行处理.</li><li>自写的sql请按规范书写(sql涉及到多个表的每个表都要给别名,特别是 inner join 的要写标准的 inner join)</li></ol><h3 id="插件的顺序" tabindex="-1">插件的顺序 <a class="header-anchor" href="#插件的顺序" aria-label="Permalink to &quot;插件的顺序&quot;">​</a></h3><blockquote><p>MyBatis-Plus使用多个功能插件需要注意顺序关系</p></blockquote><p>MyBatis-Plus基于字段的多租户是通过插件机制拦截实现的，因为还有很多其它的拦截器，比如:</p><ul><li>自动分页: PaginationInnerInterceptor</li><li>多租户: TenantLineInnerInterceptor</li><li><ul><li>动态表名: DynamicTableNameInnerInterceptor</li></ul></li><li>乐观锁: OptimisticLockerInnerInterceptor</li><li>sql 性能规范: IllegalSQLInnerInterceptor</li><li>防止全表更新与删除: BlockAttackInnerInterceptor</li></ul><p>所以需要注意顺序: 使用多个功能需要注意顺序关系,建议使用如下顺序</p><ul><li>多租户,动态表名</li><li>分页,乐观锁</li><li>sql 性能规范,防止全表更新与删除</li></ul><p>总结: 对 sql 进行单次改造的优先放入,不对 sql 进行改造的最后放入</p><h3 id="封装性实践" tabindex="-1">封装性实践 <a class="header-anchor" href="#封装性实践" aria-label="Permalink to &quot;封装性实践&quot;">​</a></h3><blockquote><p>实际项目中还需要对配置进行封装。</p></blockquote><p>回看如下的处理， 我们看下可以封装的点：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// TenantLineInnerInterceptor</span></span>
<span class="line"><span>interceptor.addInnerInterceptor(new TenantLineInnerInterceptor(new TenantLineHandler() {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Expression getTenantId() {</span></span>
<span class="line"><span>        // 实际可以将TenantId放在threadLocale中(比如xxxxContext中)，并获取。</span></span>
<span class="line"><span>        return new LongValue(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String getTenantIdColumn() {</span></span>
<span class="line"><span>        return &quot;tenant_id&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean ignoreTable(String tableName) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean ignoreInsert(List&lt;Column&gt; columns, String tenantIdColumn) {</span></span>
<span class="line"><span>        return TenantLineHandler.super.ignoreInsert(columns, tenantIdColumn);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}));</span></span></code></pre></div><ol><li>对于配置</li></ol><p>相关配置可以封装到yml, 然后注入进来。</p><ol start="2"><li>对于TenantId</li></ol><p>实际可以将TenantId放在threadLocale中(比如xxxxContext中)，并获取。</p><ol start="3"><li>对于ignoreTable</li></ol><p>比如有些表不要自动进行拦截的，可以在yml中配置并重写ignoreTable方法。</p><ol start="4"><li>对于ignoreInsert</li></ol><p>对于插入数据是否需要携带TenantId，可以通过重写ignoreInsert方法。</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,101)]))}const g=s(t,[["render",i]]);export{b as __pageData,g as default};
