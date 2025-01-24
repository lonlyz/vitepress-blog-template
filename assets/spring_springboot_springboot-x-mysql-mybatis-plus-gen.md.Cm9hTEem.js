import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-engine-1.png",t="/vitepress-blog-template/images/spring/springboot/springboot-mybatisplus-gen-1.png",h=JSON.parse('{"title":"SpringBoot集成MySQL - MyBatis-Plus代码自动生成","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-mybatis-plus-gen.md","filePath":"spring/springboot/springboot-x-mysql-mybatis-plus-gen.md","lastUpdated":1737706346000}'),i={name:"spring/springboot/springboot-x-mysql-mybatis-plus-gen.md"};function c(o,n,r,u,d,g){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="springboot集成mysql-mybatis-plus代码自动生成" tabindex="-1">SpringBoot集成MySQL - MyBatis-Plus代码自动生成 <a class="header-anchor" href="#springboot集成mysql-mybatis-plus代码自动生成" aria-label="Permalink to &quot;SpringBoot集成MySQL - MyBatis-Plus代码自动生成&quot;">​</a></h1><blockquote><p>本文主要介绍 MyBatis-Plus代码自动生成，以及产生此类代码生成工具的背景和此类工具的基本实现原理。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要了解MyBatis和MyBatis-Plus基础，并了解产生此类代码生成工具的背景和基本原理。</p></blockquote><h3 id="mybatis-plus相关" tabindex="-1">MyBatis-Plus相关 <a class="header-anchor" href="#mybatis-plus相关" aria-label="Permalink to &quot;MyBatis-Plus相关&quot;">​</a></h3><p><a href="https://pdai.tech/md/spring/springboot/springboot-x-mysql-mybatis-plus.html" target="_blank" rel="noreferrer">SpringBoot集成MySQL - MyBatis-Plus方式</a></p><h3 id="为什么会产生此类代码生成工具" tabindex="-1">为什么会产生此类代码生成工具？ <a class="header-anchor" href="#为什么会产生此类代码生成工具" aria-label="Permalink to &quot;为什么会产生此类代码生成工具？&quot;">​</a></h3><p>由于CRUD的工作占了普通开发很多工作，而这些工作是重复的，所以出现了此类的代码生成工具。这些工具通过模板引擎来生成代码，常见于三方集成工具，IDE插件等等。</p><h3 id="什么是模板引擎" tabindex="-1">什么是模板引擎？ <a class="header-anchor" href="#什么是模板引擎" aria-label="Permalink to &quot;什么是模板引擎？&quot;">​</a></h3><p>模板引擎可以在代码生成过程中减少大量机械重复工作，大大提高开发效率，良好的设计使得代码重用，后期维护都降低成本。一个好的模板引擎的使用要考虑的方面无外乎：功能是否强大，使用是否简单，整合性、扩展性与灵活性，性能。</p><p>比如：</p><ul><li>Velocity</li><li>FreeMarker</li><li>Thymeleaf</li><li>...</li></ul><p><img src="'+l+`" alt="error.图片加载失败"></p><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里展示通过MyBatis-Plus生成代码实现的</p></blockquote><h3 id="准备db" tabindex="-1">准备DB <a class="header-anchor" href="#准备db" aria-label="Permalink to &quot;准备DB&quot;">​</a></h3><p>创建MySQL的schema test_db, 导入SQL 文件如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)</span></span>
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
<span class="line"><span>-- Dump completed on 2021-09-08 17:12:11</span></span></code></pre></div><h3 id="添加pom依赖" tabindex="-1">添加POM依赖 <a class="header-anchor" href="#添加pom依赖" aria-label="Permalink to &quot;添加POM依赖&quot;">​</a></h3><p>包括mybatis-plus-generator和默认的模板引擎velocity依赖的velocity-engine-core。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.baomidou&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mybatis-plus-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.5.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.baomidou&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mybatis-plus-generator&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.5.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.velocity&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;velocity-engine-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="代码生成配置" tabindex="-1">代码生成配置 <a class="header-anchor" href="#代码生成配置" aria-label="Permalink to &quot;代码生成配置&quot;">​</a></h3><blockquote><p>mybatis-plus-generator 3.5.1 及其以上版本，对历史版本不兼容！3.5.1 以下的请参考<a href="https://baomidou.com/pages/d357af/" target="_blank" rel="noreferrer">这里在新窗口打开</a></p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import com.baomidou.mybatisplus.generator.FastAutoGenerator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * This class is for xxxx.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class TestGenCode {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        FastAutoGenerator.create(&quot;jdbc:mysql://localhost:3306/test_db?useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8&quot;, &quot;test&quot;, &quot;bfXa4Pt2lUUScy8jakXf&quot;)</span></span>
<span class="line"><span>                .globalConfig(builder -&gt;</span></span>
<span class="line"><span>                        builder.author(&quot;pdai&quot;) // 设置作者</span></span>
<span class="line"><span>                                .enableSwagger() // 开启 swagger 模式</span></span>
<span class="line"><span>                )</span></span>
<span class="line"><span>                .packageConfig(builder -&gt;</span></span>
<span class="line"><span>                        builder.parent(&quot;tech.pdai.springboot.mysql8.mybatisplus.anno&quot;) // 设置父包名</span></span>
<span class="line"><span>                                .moduleName(&quot;gencode&quot;) // 设置父包模块名</span></span>
<span class="line"><span>                )</span></span>
<span class="line"><span>                .strategyConfig(builder -&gt;</span></span>
<span class="line"><span>                        builder.addInclude(&quot;tb_user&quot;, &quot;tb_role&quot;, &quot;tb_user_role&quot;)</span></span>
<span class="line"><span>                )</span></span>
<span class="line"><span>                .execute();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="生成代码" tabindex="-1">生成代码 <a class="header-anchor" href="#生成代码" aria-label="Permalink to &quot;生成代码&quot;">​</a></h3><p><img src="`+t+`" alt="error.图片加载失败"></p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>主要了解MyBatis-Plus生成代码的原理。</p></blockquote><h3 id="代码生成的基本原理" tabindex="-1">代码生成的基本原理 <a class="header-anchor" href="#代码生成的基本原理" aria-label="Permalink to &quot;代码生成的基本原理&quot;">​</a></h3><blockquote><p>其实代码生成是非常简单的，有了模板引擎的介绍，我们再看下MyBatis-Plus的代码生成工具是如何生成代码的。</p></blockquote><p>配置的装载, FastAutoGenerator本质上就是通过builder注入各种配置，并将它交给代码生成主类：AutoGenerator</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void execute() {</span></span>
<span class="line"><span>    new AutoGenerator(this.dataSourceConfigBuilder.build())</span></span>
<span class="line"><span>        // 全局配置</span></span>
<span class="line"><span>        .global(this.globalConfigBuilder.build())</span></span>
<span class="line"><span>        // 包配置</span></span>
<span class="line"><span>        .packageInfo(this.packageConfigBuilder.build())</span></span>
<span class="line"><span>        // 策略配置</span></span>
<span class="line"><span>        .strategy(this.strategyConfigBuilder.build())</span></span>
<span class="line"><span>        // 注入配置</span></span>
<span class="line"><span>        .injection(this.injectionConfigBuilder.build())</span></span>
<span class="line"><span>        // 模板配置</span></span>
<span class="line"><span>        .template(this.templateConfigBuilder.build())</span></span>
<span class="line"><span>        // 执行</span></span>
<span class="line"><span>        .execute(this.templateEngine);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AutoGenerator中execute方法，包括初始化配置和模板引擎（默认是Velocity），然后将配置交给模板引擎初始化执行文件输出</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 生成代码</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param templateEngine 模板引擎</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void execute(AbstractTemplateEngine templateEngine) {</span></span>
<span class="line"><span>    logger.debug(&quot;==========================准备生成文件...==========================&quot;);</span></span>
<span class="line"><span>    // 初始化配置</span></span>
<span class="line"><span>    if (null == config) {</span></span>
<span class="line"><span>        config = new ConfigBuilder(packageInfo, dataSource, strategy, template, globalConfig, injection);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (null == templateEngine) {</span></span>
<span class="line"><span>        // 为了兼容之前逻辑，采用 Velocity 引擎 【 默认 】</span></span>
<span class="line"><span>        templateEngine = new VelocityTemplateEngine();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    templateEngine.setConfigBuilder(config);</span></span>
<span class="line"><span>    // 模板引擎初始化执行文件输出</span></span>
<span class="line"><span>    templateEngine.init(config).batchOutput().open();</span></span>
<span class="line"><span>    logger.debug(&quot;==========================文件生成完成！！！==========================&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>模板引擎中batchOuput方法中，包含获取表的信息并根据模板来生成类文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 批量输出 java xml 文件</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@NotNull</span></span>
<span class="line"><span>public AbstractTemplateEngine batchOutput() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        ConfigBuilder config = this.getConfigBuilder();</span></span>
<span class="line"><span>        List&lt;TableInfo&gt; tableInfoList = config.getTableInfoList();</span></span>
<span class="line"><span>        tableInfoList.forEach(tableInfo -&gt; {</span></span>
<span class="line"><span>            Map&lt;String, Object&gt; objectMap = this.getObjectMap(config, tableInfo);</span></span>
<span class="line"><span>            Optional.ofNullable(config.getInjectionConfig()).ifPresent(t -&gt; {</span></span>
<span class="line"><span>                t.beforeOutputFile(tableInfo, objectMap);</span></span>
<span class="line"><span>                // 输出自定义文件</span></span>
<span class="line"><span>                outputCustomFile(t.getCustomFile(), tableInfo, objectMap);</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>            // entity</span></span>
<span class="line"><span>            outputEntity(tableInfo, objectMap);</span></span>
<span class="line"><span>            // mapper and xml</span></span>
<span class="line"><span>            outputMapper(tableInfo, objectMap);</span></span>
<span class="line"><span>            // service</span></span>
<span class="line"><span>            outputService(tableInfo, objectMap);</span></span>
<span class="line"><span>            // controller</span></span>
<span class="line"><span>            outputController(tableInfo, objectMap);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;无法创建文件，请检查配置信息！&quot;, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return this;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>获取表的列表，由ConfigBuilder完成</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;TableInfo&gt; getTableInfoList() {</span></span>
<span class="line"><span>    if (tableInfoList.isEmpty()) {</span></span>
<span class="line"><span>        // TODO 暂时不开放自定义</span></span>
<span class="line"><span>        List&lt;TableInfo&gt; tableInfos = new IDatabaseQuery.DefaultDatabaseQuery(this).queryTables();</span></span>
<span class="line"><span>        if (!tableInfos.isEmpty()) {</span></span>
<span class="line"><span>            this.tableInfoList.addAll(tableInfos);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return tableInfoList;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后获取上述单个表（tableInfo)的具体信息（objectMap)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 渲染对象 MAP 信息</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param config    配置信息</span></span>
<span class="line"><span>  * @param tableInfo 表信息对象</span></span>
<span class="line"><span>  * @return ignore</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@NotNull</span></span>
<span class="line"><span>public Map&lt;String, Object&gt; getObjectMap(@NotNull ConfigBuilder config, @NotNull TableInfo tableInfo) {</span></span>
<span class="line"><span>    StrategyConfig strategyConfig = config.getStrategyConfig();</span></span>
<span class="line"><span>    Map&lt;String, Object&gt; controllerData = strategyConfig.controller().renderData(tableInfo);</span></span>
<span class="line"><span>    Map&lt;String, Object&gt; objectMap = new HashMap&lt;&gt;(controllerData);</span></span>
<span class="line"><span>    Map&lt;String, Object&gt; mapperData = strategyConfig.mapper().renderData(tableInfo);</span></span>
<span class="line"><span>    objectMap.putAll(mapperData);</span></span>
<span class="line"><span>    Map&lt;String, Object&gt; serviceData = strategyConfig.service().renderData(tableInfo);</span></span>
<span class="line"><span>    objectMap.putAll(serviceData);</span></span>
<span class="line"><span>    Map&lt;String, Object&gt; entityData = strategyConfig.entity().renderData(tableInfo);</span></span>
<span class="line"><span>    objectMap.putAll(entityData);</span></span>
<span class="line"><span>    objectMap.put(&quot;config&quot;, config);</span></span>
<span class="line"><span>    objectMap.put(&quot;package&quot;, config.getPackageConfig().getPackageInfo());</span></span>
<span class="line"><span>    GlobalConfig globalConfig = config.getGlobalConfig();</span></span>
<span class="line"><span>    objectMap.put(&quot;author&quot;, globalConfig.getAuthor());</span></span>
<span class="line"><span>    objectMap.put(&quot;kotlin&quot;, globalConfig.isKotlin());</span></span>
<span class="line"><span>    objectMap.put(&quot;swagger&quot;, globalConfig.isSwagger());</span></span>
<span class="line"><span>    objectMap.put(&quot;date&quot;, globalConfig.getCommentDate());</span></span>
<span class="line"><span>    // 启用 schema 处理逻辑</span></span>
<span class="line"><span>    String schemaName = &quot;&quot;;</span></span>
<span class="line"><span>    if (strategyConfig.isEnableSchema()) {</span></span>
<span class="line"><span>        // 存在 schemaName 设置拼接 . 组合表名</span></span>
<span class="line"><span>        schemaName = config.getDataSourceConfig().getSchemaName();</span></span>
<span class="line"><span>        if (StringUtils.isNotBlank(schemaName)) {</span></span>
<span class="line"><span>            schemaName += &quot;.&quot;;</span></span>
<span class="line"><span>            tableInfo.setConvert(true);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    objectMap.put(&quot;schemaName&quot;, schemaName);</span></span>
<span class="line"><span>    objectMap.put(&quot;table&quot;, tableInfo);</span></span>
<span class="line"><span>    objectMap.put(&quot;entity&quot;, tableInfo.getEntityName());</span></span>
<span class="line"><span>    return objectMap;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据TableInfo和objectMap输出类文件，以输出Entity实体类为例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 输出实体文件</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param tableInfo 表信息</span></span>
<span class="line"><span>  * @param objectMap 渲染数据</span></span>
<span class="line"><span>  * @since 3.5.0</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected void outputEntity(@NotNull TableInfo tableInfo, @NotNull Map&lt;String, Object&gt; objectMap) {</span></span>
<span class="line"><span>    String entityName = tableInfo.getEntityName();</span></span>
<span class="line"><span>    String entityPath = getPathInfo(OutputFile.entity);</span></span>
<span class="line"><span>    if (StringUtils.isNotBlank(entityName) &amp;&amp; StringUtils.isNotBlank(entityPath)) {</span></span>
<span class="line"><span>        getTemplateFilePath(template -&gt; template.getEntity(getConfigBuilder().getGlobalConfig().isKotlin())).ifPresent((entity) -&gt; {</span></span>
<span class="line"><span>            String entityFile = String.format((entityPath + File.separator + &quot;%s&quot; + suffixJavaOrKt()), entityName);</span></span>
<span class="line"><span>            outputFile(new File(entityFile), objectMap, entity, getConfigBuilder().getStrategyConfig().entity().isFileOverride());</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在outputFile中来确定生成文件的名字和路径</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 输出文件</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param file         文件</span></span>
<span class="line"><span>  * @param objectMap    渲染信息</span></span>
<span class="line"><span>  * @param templatePath 模板路径</span></span>
<span class="line"><span>  * @param fileOverride 是否覆盖已有文件</span></span>
<span class="line"><span>  * @since 3.5.2</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected void outputFile(@NotNull File file, @NotNull Map&lt;String, Object&gt; objectMap, @NotNull String templatePath, boolean fileOverride) {</span></span>
<span class="line"><span>    if (isCreate(file, fileOverride)) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 全局判断【默认】</span></span>
<span class="line"><span>            boolean exist = file.exists();</span></span>
<span class="line"><span>            if (!exist) {</span></span>
<span class="line"><span>                File parentFile = file.getParentFile();</span></span>
<span class="line"><span>                FileUtils.forceMkdir(parentFile);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            writer(objectMap, templatePath, file);</span></span>
<span class="line"><span>        } catch (Exception exception) {</span></span>
<span class="line"><span>            throw new RuntimeException(exception);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后通过writer方法生成文件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 将模板转化成为文件</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param objectMap    渲染对象 MAP 信息</span></span>
<span class="line"><span>  * @param templatePath 模板文件</span></span>
<span class="line"><span>  * @param outputFile   文件生成的目录</span></span>
<span class="line"><span>  * @throws Exception 异常</span></span>
<span class="line"><span>  * @since 3.5.0</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void writer(@NotNull Map&lt;String, Object&gt; objectMap, @NotNull String templatePath, @NotNull File outputFile) throws Exception {</span></span>
<span class="line"><span>    this.writer(objectMap, templatePath, outputFile.getPath());</span></span>
<span class="line"><span>    logger.debug(&quot;模板:&quot; + templatePath + &quot;;  文件:&quot; + outputFile);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本质上就是调用模板引擎来生成</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void writer(@NotNull Map&lt;String, Object&gt; objectMap, @NotNull String templatePath, @NotNull File outputFile) throws Exception {</span></span>
<span class="line"><span>        Template template = velocityEngine.getTemplate(templatePath, ConstVal.UTF8);</span></span>
<span class="line"><span>        try (FileOutputStream fos = new FileOutputStream(outputFile);</span></span>
<span class="line"><span>             OutputStreamWriter ow = new OutputStreamWriter(fos, ConstVal.UTF8);</span></span>
<span class="line"><span>             BufferedWriter writer = new BufferedWriter(ow)) {</span></span>
<span class="line"><span>            template.merge(new VelocityContext(objectMap), writer);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>比如Entity，velocityEngine.getTemplate会获取如下entity.vm模板生成Entity的类文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package \${package.Entity};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#foreach($pkg in \${table.importPackages})</span></span>
<span class="line"><span>import \${pkg};</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#if(\${swagger})</span></span>
<span class="line"><span>import io.swagger.annotations.ApiModel;</span></span>
<span class="line"><span>import io.swagger.annotations.ApiModelProperty;</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * &lt;p&gt;</span></span>
<span class="line"><span> * $!{table.comment}</span></span>
<span class="line"><span> * &lt;/p&gt;</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author \${author}</span></span>
<span class="line"><span> * @since \${date}</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>#if(\${table.convert})</span></span>
<span class="line"><span>@TableName(&quot;\${schemaName}\${table.name}&quot;)</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#if(\${swagger})</span></span>
<span class="line"><span>@ApiModel(value = &quot;\${entity}对象&quot;, description = &quot;$!{table.comment}&quot;)</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#if(\${superEntityClass})</span></span>
<span class="line"><span>class \${entity} : \${superEntityClass}#if(\${activeRecord})&lt;\${entity}&gt;#end() {</span></span>
<span class="line"><span>#elseif(\${activeRecord})</span></span>
<span class="line"><span>class \${entity} : Model&lt;\${entity}&gt;() {</span></span>
<span class="line"><span>#elseif(\${entitySerialVersionUID})</span></span>
<span class="line"><span>class \${entity} : Serializable {</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>class \${entity} {</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## ----------  BEGIN 字段循环遍历  ----------</span></span>
<span class="line"><span>#foreach($field in \${table.fields})</span></span>
<span class="line"><span>#if(\${field.keyFlag})</span></span>
<span class="line"><span>#set($keyPropertyName=\${field.propertyName})</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#if(&quot;$!field.comment&quot; != &quot;&quot;)</span></span>
<span class="line"><span>    #if(\${swagger})</span></span>
<span class="line"><span>    @ApiModelProperty(value = &quot;\${field.comment}&quot;)</span></span>
<span class="line"><span>    #else</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * \${field.comment}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    #end</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#if(\${field.keyFlag})</span></span>
<span class="line"><span>## 主键</span></span>
<span class="line"><span>#if(\${field.keyIdentityFlag})</span></span>
<span class="line"><span>    @TableId(value = &quot;\${field.annotationColumnName}&quot;, type = IdType.AUTO)</span></span>
<span class="line"><span>#elseif(!$null.isNull(\${idType}) &amp;&amp; &quot;$!idType&quot; != &quot;&quot;)</span></span>
<span class="line"><span>    @TableId(value = &quot;\${field.annotationColumnName}&quot;, type = IdType.\${idType})</span></span>
<span class="line"><span>#elseif(\${field.convert})</span></span>
<span class="line"><span>    @TableId(&quot;\${field.annotationColumnName}&quot;)</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>## 普通字段</span></span>
<span class="line"><span>#elseif(\${field.fill})</span></span>
<span class="line"><span>## -----   存在字段填充设置   -----</span></span>
<span class="line"><span>#if(\${field.convert})</span></span>
<span class="line"><span>    @TableField(value = &quot;\${field.annotationColumnName}&quot;, fill = FieldFill.\${field.fill})</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>    @TableField(fill = FieldFill.\${field.fill})</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#elseif(\${field.convert})</span></span>
<span class="line"><span>    @TableField(&quot;\${field.annotationColumnName}&quot;)</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>## 乐观锁注解</span></span>
<span class="line"><span>#if(\${field.versionField})</span></span>
<span class="line"><span>    @Version</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>## 逻辑删除注解</span></span>
<span class="line"><span>#if(\${field.logicDeleteField})</span></span>
<span class="line"><span>    @TableLogic</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>    #if(\${field.propertyType} == &quot;Integer&quot;)</span></span>
<span class="line"><span>    var \${field.propertyName}: Int? = null</span></span>
<span class="line"><span>    #else</span></span>
<span class="line"><span>    var \${field.propertyName}: \${field.propertyType}? = null</span></span>
<span class="line"><span>    #end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>## ----------  END 字段循环遍历  ----------</span></span>
<span class="line"><span>#if(\${entityColumnConstant})</span></span>
<span class="line"><span>    companion object {</span></span>
<span class="line"><span>#foreach($field in \${table.fields})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const val \${field.name.toUpperCase()} : String = &quot;\${field.name}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#if(\${activeRecord})</span></span>
<span class="line"><span>    override fun pkVal(): Serializable? {</span></span>
<span class="line"><span>#if(\${keyPropertyName})</span></span>
<span class="line"><span>        return \${keyPropertyName}</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>        return null</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>    override fun toString(): String {</span></span>
<span class="line"><span>        return &quot;\${entity}{&quot; +</span></span>
<span class="line"><span>#foreach($field in \${table.fields})</span></span>
<span class="line"><span>#if($!{foreach.index}==0)</span></span>
<span class="line"><span>        &quot;\${field.propertyName}=&quot; + \${field.propertyName} +</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>        &quot;, \${field.propertyName}=&quot; + \${field.propertyName} +</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>#end</span></span>
<span class="line"><span>        &quot;}&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同理生成mapper, service, controller等文件。是不是很简单？</p><h3 id="如何看mybatis-plus生成代码的功能" tabindex="-1">如何看MyBatis-Plus生成代码的功能？ <a class="header-anchor" href="#如何看mybatis-plus生成代码的功能" aria-label="Permalink to &quot;如何看MyBatis-Plus生成代码的功能？&quot;">​</a></h3><blockquote><p>简单而言，对于初学者好像能生成代码作用很大，实际情况是很鸡肋！</p></blockquote><ul><li>从上面的源码我们可以看出，生成类只适合单表结构，表的关联无法处理；</li><li>对于单表的CRUD类，如果可以自动化生成，必然是可以很好的抽象的，而BaseMapper, BaseServiceImpl的封装已经足够了；</li><li>通常真正可以通过一体化集成前端代码的生成，才有一定的意义；</li><li>当然少部分情况快速提供接口的可以考虑，不过其实也省不了什么时间。</li></ul><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,57)]))}const f=s(i,[["render",c]]);export{h as __pageData,f as default};
