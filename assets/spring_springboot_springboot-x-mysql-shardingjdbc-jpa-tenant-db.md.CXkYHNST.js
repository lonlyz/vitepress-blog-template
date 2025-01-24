import{_ as a,c as s,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/spring-sharding-21.png",t="/vitepress-blog-template/images/spring/springboot/spring-sharding-22.png",i="/vitepress-blog-template/images/spring/springboot/spring-sharding-23.png",r="/vitepress-blog-template/images/spring/springboot/springboot-sharding-x1.png",o="/vitepress-blog-template/images/spring/springboot/springboot-sharding-x2.png",c="/vitepress-blog-template/images/spring/springboot/springboot-sharding-x3.png",_="/vitepress-blog-template/images/spring/springboot/springboot-sharding-x4.png",d="/vitepress-blog-template/images/spring/springboot/springboot-sharding-x5.png",u="/vitepress-blog-template/images/spring/springboot/springboot-sharding-x6.png",g="/vitepress-blog-template/images/spring/springboot/springboot-sharding-x7.png",x=JSON.parse('{"title":"SpringBoot集成ShardingJDBC - 基于JPA的DB隔离多租户方案","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-shardingjdbc-jpa-tenant-db.md","filePath":"spring/springboot/springboot-x-mysql-shardingjdbc-jpa-tenant-db.md","lastUpdated":1737706346000}'),m={name:"spring/springboot/springboot-x-mysql-shardingjdbc-jpa-tenant-db.md"};function h(b,n,S,C,E,L){return p(),s("div",null,n[0]||(n[0]=[e(`<h1 id="springboot集成shardingjdbc-基于jpa的db隔离多租户方案" tabindex="-1">SpringBoot集成ShardingJDBC - 基于JPA的DB隔离多租户方案 <a class="header-anchor" href="#springboot集成shardingjdbc-基于jpa的db隔离多租户方案" aria-label="Permalink to &quot;SpringBoot集成ShardingJDBC - 基于JPA的DB隔离多租户方案&quot;">​</a></h1><blockquote><p>本文主要介绍ShardingJDBC的分片算法和分片策略，并在此基础上通过SpringBoot集成ShardingJDBC的几种策略（标准分片策略，行表达式分片策略和hint分片策略）向你展示DB隔离的多租户方案。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>主要理解ShardingJDBC表的基本术语，以及分片算法和分片策略等。@pdai</p></blockquote><h3 id="逻辑表-绑定表" tabindex="-1">逻辑表？绑定表？ <a class="header-anchor" href="#逻辑表-绑定表" aria-label="Permalink to &quot;逻辑表？绑定表？&quot;">​</a></h3><blockquote><p>如下内容来自<a href="https://shardingsphere.apache.org/" target="_blank" rel="noreferrer">官网在新窗口打开</a></p></blockquote><ul><li><strong>逻辑表</strong></li></ul><p>水平拆分的数据库（表）的相同逻辑和数据结构表的总称。例：订单数据根据主键尾数拆分为10张表，分别是t_order_0到t_order_9，他们的逻辑表名为t_order。</p><ul><li><strong>真实表</strong></li></ul><p>在分片的数据库中真实存在的物理表。即上个示例中的t_order_0到t_order_9。</p><ul><li><strong>数据节点</strong></li></ul><p>数据分片的最小单元。由数据源名称和数据表组成，例：ds_0.t_order_0。</p><ul><li><strong>绑定表</strong></li></ul><p>指分片规则一致的主表和子表。例如：t_order表和t_order_item表，均按照order_id分片，则此两张表互为绑定表关系。绑定表之间的多表关联查询不会出现笛卡尔积关联，关联查询效率将大大提升。举例说明，如果SQL为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT i.* FROM t_order o JOIN t_order_item i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);</span></span></code></pre></div><p>在不配置绑定表关系时，假设分片键order_id将数值10路由至第0片，将数值11路由至第1片，那么路由后的SQL应该为4条，它们呈现为笛卡尔积：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT i.* FROM t_order_0 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SELECT i.* FROM t_order_0 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SELECT i.* FROM t_order_1 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SELECT i.* FROM t_order_1 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);</span></span></code></pre></div><p>在配置绑定表关系后，路由的SQL应该为2条：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT i.* FROM t_order_0 o JOIN t_order_item_0 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SELECT i.* FROM t_order_1 o JOIN t_order_item_1 i ON o.order_id=i.order_id WHERE o.order_id in (10, 11);</span></span></code></pre></div><p>其中t_order在FROM的最左侧，ShardingSphere将会以它作为整个绑定表的主表。 所有路由计算将会只使用主表的策略，那么t_order_item表的分片计算将会使用t_order的条件。故绑定表之间的分区键要完全相同。</p><ul><li><strong>广播表</strong></li></ul><p>指所有的分片数据源中都存在的表，表结构和表中的数据在每个数据库中均完全一致。适用于数据量不大且需要与海量数据的表进行关联查询的场景，例如：字典表。</p><h3 id="分片算法-分片策略" tabindex="-1">分片算法？分片策略？ <a class="header-anchor" href="#分片算法-分片策略" aria-label="Permalink to &quot;分片算法？分片策略？&quot;">​</a></h3><blockquote><p>如下内容来自<a href="https://shardingsphere.apache.org/" target="_blank" rel="noreferrer">官网在新窗口打开</a></p></blockquote><h4 id="分片键" tabindex="-1">分片键 <a class="header-anchor" href="#分片键" aria-label="Permalink to &quot;分片键&quot;">​</a></h4><p>用于分片的数据库字段，是将数据库(表)水平拆分的关键字段。例：将订单表中的订单主键的尾数取模分片，则订单主键为分片字段。 SQL中如果无分片字段，将执行全路由，性能较差。 除了对单分片字段的支持，ShardingSphere也支持根据多个字段进行分片。</p><h4 id="分片算法" tabindex="-1">分片算法 <a class="header-anchor" href="#分片算法" aria-label="Permalink to &quot;分片算法&quot;">​</a></h4><blockquote><p>通过分片算法将数据分片，支持通过=、&gt;=、&lt;=、&gt;、&lt;、BETWEEN和IN分片。分片算法需要应用方开发者自行实现，可实现的灵活度非常高。</p></blockquote><p>目前提供4种分片算法。由于分片算法和业务实现紧密相关，因此并未提供内置分片算法，而是通过分片策略将各种场景提炼出来，提供更高层级的抽象，并提供接口让应用开发者自行实现分片算法。</p><ul><li><strong>精确分片算法</strong></li></ul><p>对应PreciseShardingAlgorithm，用于处理使用单一键作为分片键的=与IN进行分片的场景。需要配合StandardShardingStrategy使用。</p><ul><li><strong>范围分片算法</strong></li></ul><p>对应RangeShardingAlgorithm，用于处理使用单一键作为分片键的<code>BETWEEN AND、&gt;、&lt;、&gt;=、&lt;=</code>进行分片的场景。需要配合StandardShardingStrategy使用。</p><ul><li><strong>复合分片算法</strong></li></ul><p>对应ComplexKeysShardingAlgorithm，用于处理使用多键作为分片键进行分片的场景，包含多个分片键的逻辑较复杂，需要应用开发者自行处理其中的复杂度。需要配合ComplexShardingStrategy使用。</p><ul><li><strong>Hint分片算法</strong></li></ul><p>对应HintShardingAlgorithm，用于处理使用Hint行分片的场景。需要配合HintShardingStrategy使用。</p><p><img src="`+l+'" alt="error.图片加载失败"></p><h4 id="分片策略" tabindex="-1">分片策略 <a class="header-anchor" href="#分片策略" aria-label="Permalink to &quot;分片策略&quot;">​</a></h4><blockquote><p>包含分片键和分片算法，由于分片算法的独立性，将其独立抽离。真正可用于分片操作的是分片键 + 分片算法，也就是分片策略。目前提供5种分片策略。</p></blockquote><ul><li><strong>标准分片策略</strong></li></ul><p>对应StandardShardingStrategy。提供对SQL语句中的<code>=, &gt;, &lt;, &gt;=, &lt;=, IN</code>和BETWEEN AND的分片操作支持。StandardShardingStrategy只支持单分片键，提供PreciseShardingAlgorithm和RangeShardingAlgorithm两个分片算法。PreciseShardingAlgorithm是必选的，用于处理=和IN的分片。RangeShardingAlgorithm是可选的，用于处理<code>BETWEEN AND, &gt;, &lt;, &gt;=, &lt;=</code>分片，如果不配置RangeShardingAlgorithm，SQL中的BETWEEN AND将按照全库路由处理。</p><ul><li><strong>复合分片策略</strong></li></ul><p>对应ComplexShardingStrategy。复合分片策略。提供对SQL语句中的<code>=, &gt;, &lt;, &gt;=, &lt;=, IN</code>和BETWEEN AND的分片操作支持。ComplexShardingStrategy支持多分片键，由于多分片键之间的关系复杂，因此并未进行过多的封装，而是直接将分片键值组合以及分片操作符透传至分片算法，完全由应用开发者实现，提供最大的灵活度。</p><ul><li><strong>行表达式分片策略</strong></li></ul><p>对应InlineShardingStrategy。使用Groovy的表达式，提供对SQL语句中的=和IN的分片操作支持，只支持单分片键。对于简单的分片算法，可以通过简单的配置使用，从而避免繁琐的Java代码开发，如: <code>t_user_$-&gt;{u_id % 8}</code> 表示t_user表根据u_id模8，而分成8张表，表名称为t_user_0到t_user_7。</p><ul><li><strong>Hint分片策略</strong></li></ul><p>对应HintShardingStrategy。通过Hint指定分片值而非从SQL中提取分片值的方式进行分片的策略。</p><ul><li><strong>不分片策略</strong></li></ul><p>对应NoneShardingStrategy。不分片的策略。</p><p><img src="'+t+'" alt="error.图片加载失败"></p><h4 id="sql-hint" tabindex="-1">SQL Hint <a class="header-anchor" href="#sql-hint" aria-label="Permalink to &quot;SQL Hint&quot;">​</a></h4><p>对于分片字段非SQL决定，而由其他外置条件决定的场景，可使用SQL Hint灵活的注入分片字段。例：内部系统，按照员工登录主键分库，而数据库中并无此字段。SQL Hint支持通过Java API和SQL注释(待实现)两种方式使用。</p><h3 id="shardingjdbc-内部结构" tabindex="-1">ShardingJDBC 内部结构 <a class="header-anchor" href="#shardingjdbc-内部结构" aria-label="Permalink to &quot;ShardingJDBC 内部结构&quot;">​</a></h3><p><img src="'+i+`" alt="error.图片加载失败"></p><ul><li><strong>黄色部分</strong></li></ul><p>图中黄色部分表示的是Sharding-JDBC的入口API，采用工厂方法的形式提供。 目前有ShardingDataSourceFactory和MasterSlaveDataSourceFactory两个工厂类。ShardingDataSourceFactory用于创建分库分表或分库分表+读写分离的JDBC驱动，MasterSlaveDataSourceFactory用于创建独立使用读写分离的JDBC驱动。</p><ul><li><strong>蓝色部分</strong></li></ul><p>图中蓝色部分表示的是Sharding-JDBC的配置对象，提供灵活多变的配置方式。 ShardingRuleConfiguration是分库分表配置的核心和入口，它可以包含多个TableRuleConfiguration和MasterSlaveRuleConfiguration。每一组相同规则分片的表配置一个TableRuleConfiguration。如果需要分库分表和读写分离共同使用，每一个读写分离的逻辑库配置一个MasterSlaveRuleConfiguration。 每个TableRuleConfiguration对应一个ShardingStrategyConfiguration，它有5中实现类可供选择。</p><p>仅读写分离使用MasterSlaveRuleConfiguration即可。</p><ul><li><strong>红色部分</strong></li></ul><p>图中红色部分表示的是内部对象，由Sharding-JDBC内部使用，应用开发者无需关注。Sharding-JDBC通过ShardingRuleConfiguration和MasterSlaveRuleConfiguration生成真正供ShardingDataSource和MasterSlaveDataSource使用的规则对象。ShardingDataSource和MasterSlaveDataSource实现了DataSource接口，是JDBC的完整实现方案。</p><h4 id="初始化流程" tabindex="-1">初始化流程 <a class="header-anchor" href="#初始化流程" aria-label="Permalink to &quot;初始化流程&quot;">​</a></h4><ol><li>配置Configuration对象。</li><li>通过Factory对象将Configuration对象转化为Rule对象。</li><li>通过Factory对象将Rule对象与DataSource对象装配。</li><li>Sharding-JDBC使用DataSource对象进行分库。</li></ol><h4 id="使用约定" tabindex="-1">使用约定 <a class="header-anchor" href="#使用约定" aria-label="Permalink to &quot;使用约定&quot;">​</a></h4><p>在org.apache.shardingsphere.api和org.apache.shardingsphere.shardingjdbc.api 包中的类是面向用户的API，每次修改都会在release notes中明确声明。 其他包中的类属于内部实现，可能随时进行调整，请勿直接使用。</p><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里主要介绍SpringBoot集成基于ShardingJDBC的按字段分库，两种策略（标准分片策略 和 行表达式分片策略），主要承接之前的相关文章在JPA方式的基础上实现的。</p></blockquote><h3 id="准备db和依赖配置" tabindex="-1">准备DB和依赖配置 <a class="header-anchor" href="#准备db和依赖配置" aria-label="Permalink to &quot;准备DB和依赖配置&quot;">​</a></h3><p>创建MySQL的schema test_db_tenant_a 和 test_db_tenant_b, 导入SQL 文件如下</p><p>test_db_tenant_a</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db_tenant_a</span></span>
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
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`name\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`role_key\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`tenant\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
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
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`tenant\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` DISABLE KEYS */;</span></span>
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
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`role_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`tenant\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
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
<span class="line"><span>-- Dump completed on 2022-04-07 20:28:34</span></span></code></pre></div><p>test_db_tenant_b</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db_tenant_b</span></span>
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
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`name\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`role_key\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`tenant\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
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
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_name\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(45) NOT NULL,</span></span>
<span class="line"><span>  \`email\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  \`phone_number\` int DEFAULT NULL,</span></span>
<span class="line"><span>  \`description\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`create_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`update_time\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`tenant\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
<span class="line"><span>/*!40101 SET character_set_client = @saved_cs_client */;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Dumping data for table \`tb_user\`</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOCK TABLES \`tb_user\` WRITE;</span></span>
<span class="line"><span>/*!40000 ALTER TABLE \`tb_user\` DISABLE KEYS */;</span></span>
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
<span class="line"><span>  \`id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`user_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`role_id\` bigint NOT NULL,</span></span>
<span class="line"><span>  \`tenant\` varchar(45) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;</span></span>
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
<span class="line"><span>-- Dump completed on 2022-04-07 20:28:29</span></span></code></pre></div><p>引入maven依赖, 包含mysql驱动，JPA包, 以及sharding-jdbc的依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
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
<span class="line"><span>      names: tenant-a,tenant-b</span></span>
<span class="line"><span>      tenant-a:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_tenant_a?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>      tenant-b:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_tenant_b?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>    sharding:</span></span>
<span class="line"><span>      default-database-strategy:</span></span>
<span class="line"><span>        # way 1: standard strategy</span></span>
<span class="line"><span>        # standard:</span></span>
<span class="line"><span>        #  precise-algorithm-class-name: tech.pdai.springboot.shardingjdbc.jpa.tenant.db.config.MyPreciseShardingDBAlgorithm</span></span>
<span class="line"><span>        #  sharding-column: tenant</span></span>
<span class="line"><span>        # way 2: inline strategy</span></span>
<span class="line"><span>        inline:</span></span>
<span class="line"><span>          sharding-column: tenant</span></span>
<span class="line"><span>          algorithm-expression: tenant-$-&gt;{tenant}</span></span>
<span class="line"><span>      tables:</span></span>
<span class="line"><span>        tb_user:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_user</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_role:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_role</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_user_role:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_user_role</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>      binding-tables: tb_user,tb_role,tb_user_role</span></span>
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
<span class="line"><span>        use-new-id-generator-mappings: false</span></span></code></pre></div><h3 id="entity" tabindex="-1">Entity <a class="header-anchor" href="#entity" aria-label="Permalink to &quot;Entity&quot;">​</a></h3><p>user entity</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity;</span></span>
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
<span class="line"><span>     * tenant.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String tenant;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * join to role table.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ManyToMany(cascade = {CascadeType.REFRESH}, fetch = FetchType.EAGER)</span></span>
<span class="line"><span>    @JoinTable(name = &quot;tb_user_role&quot;, joinColumns = {</span></span>
<span class="line"><span>            @JoinColumn(name = &quot;user_id&quot;)}, inverseJoinColumns = {@JoinColumn(name = &quot;role_id&quot;)})</span></span>
<span class="line"><span>    private Set&lt;Role&gt; roles;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role entity</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.Getter;</span></span>
<span class="line"><span>import lombok.Setter;</span></span>
<span class="line"><span>import lombok.ToString;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.persistence.*;</span></span>
<span class="line"><span>import java.time.LocalDateTime;</span></span>
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
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * tenant.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String tenant;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="dao" tabindex="-1">DAO <a class="header-anchor" href="#dao" aria-label="Permalink to &quot;DAO&quot;">​</a></h3><p>user dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface IUserDao extends IBaseDao&lt;User, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.Role;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface IRoleDao extends IBaseDao&lt;Role, Long&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="service" tabindex="-1">Service <a class="header-anchor" href="#service" aria-label="Permalink to &quot;Service&quot;">​</a></h3><p>user service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.query.UserQueryBean;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>user service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.github.wenhao.jpa.Specifications;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import org.springframework.data.jpa.domain.Specification;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.dao.IBaseDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.dao.IUserDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.service.IUserService;</span></span>
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
<span class="line"><span>                .eq(StringUtils.isNotEmpty(queryBean.getTenant()), &quot;tenant&quot;, queryBean.getTenant())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(queryBean.getName()), &quot;user_name&quot;, queryBean.getName())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(queryBean.getDescription()), &quot;description&quot;,</span></span>
<span class="line"><span>                        queryBean.getDescription())</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        return this.getBaseDao().findAll(specification, pageRequest);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>role service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.query.RoleQueryBean;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>role service 实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.github.wenhao.jpa.Specifications;</span></span>
<span class="line"><span>import org.apache.commons.lang3.StringUtils;</span></span>
<span class="line"><span>import org.springframework.data.domain.Page;</span></span>
<span class="line"><span>import org.springframework.data.domain.PageRequest;</span></span>
<span class="line"><span>import org.springframework.data.jpa.domain.Specification;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.dao.IBaseDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.dao.IRoleDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.Role;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.query.RoleQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.service.IRoleService;</span></span>
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
<span class="line"><span>                .eq(StringUtils.isNotEmpty(roleQueryBean.getTenant()), &quot;tenant&quot;, roleQueryBean.getTenant())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(roleQueryBean.getName()), &quot;name&quot;,</span></span>
<span class="line"><span>                        roleQueryBean.getName())</span></span>
<span class="line"><span>                .like(StringUtils.isNotEmpty(roleQueryBean.getDescription()), &quot;description&quot;,</span></span>
<span class="line"><span>                        roleQueryBean.getDescription())</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>        return this.roleDao.findAll(specification, pageRequest);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller" tabindex="-1">Controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;Controller&quot;">​</a></h3><p>user controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.controller;</span></span>
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
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.entity.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.jpa.tenant.db.service.IUserService;</span></span>
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
<span class="line"><span>    public ResponseResult&lt;Page&lt;User&gt;&gt; list(@RequestParam int pageSize, @RequestParam int pageNumber, String tenant) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.findPage(UserQueryBean.builder().tenant(tenant).build(), PageRequest.of(pageNumber, pageSize)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="简单测试" tabindex="-1">简单测试 <a class="header-anchor" href="#简单测试" aria-label="Permalink to &quot;简单测试&quot;">​</a></h3><p>访问页面：</p><p><a href="http://localhost:8080/doc.html" target="_blank" rel="noreferrer">http://localhost:8080/doc.html</a></p><p>插入数据</p><p><img src="`+r+'" alt="error.图片加载失败"></p><p>DB 中对应schema中的数据</p><p><img src="'+o+'" alt="error.图片加载失败"></p><p>查询数据</p><p><img src="'+c+`" alt="error.图片加载失败"></p><p>相关查询console打印出的日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-04-08 20:58:35.755  INFO 8256 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Logic SQL: insert into tb_user (create_time, description, email, password, phone_number, tenant, update_time, user_name) values (?, ?, ?, ?, ?, ?, ?, ?)</span></span>
<span class="line"><span>2022-04-08 20:58:35.755  INFO 8256 --- [nio-8080-exec-1] ShardingSphere-SQL                       : SQLStatement: InsertStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.InsertStatement@67776a98, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@1d5f5394), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@1d5f5394, columnNames=[create_time, description, email, password, phone_number, tenant, update_time, user_name], insertValueContexts=[InsertValueContext(parametersCount=8, valueExpressions=[ParameterMarkerExpressionSegment(startIndex=118, stopIndex=118, parameterMarkerIndex=0), ParameterMarkerExpressionSegment(startIndex=121, stopIndex=121, parameterMarkerIndex=1), ParameterMarkerExpressionSegment(startIndex=124, stopIndex=124, parameterMarkerIndex=2), ParameterMarkerExpressionSegment(startIndex=127, stopIndex=127, parameterMarkerIndex=3), ParameterMarkerExpressionSegment(startIndex=130, stopIndex=130, parameterMarkerIndex=4), ParameterMarkerExpressionSegment(startIndex=133, stopIndex=133, parameterMarkerIndex=5), ParameterMarkerExpressionSegment(startIndex=136, stopIndex=136, parameterMarkerIndex=6), ParameterMarkerExpressionSegment(startIndex=139, stopIndex=139, parameterMarkerIndex=7), DerivedParameterMarkerExpressionSegment(super=ParameterMarkerExpressionSegment(startIndex=0, stopIndex=0, parameterMarkerIndex=8))], parameters=[2022-04-08 20:58:35.323, pdai-b, pdai2@pdai.tech, dad23b, 1212121212, b, 2022-04-08 20:58:35.323, pdai23b])], generatedKeyContext=Optional[GeneratedKeyContext(columnName=id, generated=true, generatedValues=[719173465277968384])])</span></span>
<span class="line"><span>2022-04-08 20:58:35.755  INFO 8256 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Actual SQL: tenant-b ::: insert into tb_user (create_time, description, email, password, phone_number, tenant, update_time, user_name, id) values (?, ?, ?, ?, ?, ?, ?, ?, ?) ::: [2022-04-08 20:58:35.323, pdai-b, pdai2@pdai.tech, dad23b, 1212121212, b, 2022-04-08 20:58:35.323, pdai23b, 719173465277968384]</span></span>
<span class="line"><span>2022-04-08 20:58:35.849  INFO 8256 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Logic SQL: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.tenant as tenant7_1_0_, user0_.update_time as update_t8_1_0_, user0_.user_name as user_nam9_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.tenant as tenant6_0_2_, role2_.update_time as update_t7_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=?</span></span>
<span class="line"><span>2022-04-08 20:58:35.849  INFO 8256 --- [nio-8080-exec-1] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@8ca5ff1, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@120db4fa), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@120db4fa, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=603, distinctRow=false, projections=[ColumnProjection(owner=user0_, name=id, alias=Optional[id1_1_0_]), ColumnProjection(owner=user0_, name=create_time, alias=Optional[create_t2_1_0_]), ColumnProjection(owner=user0_, name=description, alias=Optional[descript3_1_0_]), ColumnProjection(owner=user0_, name=email, alias=Optional[email4_1_0_]), ColumnProjection(owner=user0_, name=password, alias=Optional[password5_1_0_]), ColumnProjection(owner=user0_, name=phone_number, alias=Optional[phone_nu6_1_0_]), ColumnProjection(owner=user0_, name=tenant, alias=Optional[tenant7_1_0_]), ColumnProjection(owner=user0_, name=update_time, alias=Optional[update_t8_1_0_]), ColumnProjection(owner=user0_, name=user_name, alias=Optional[user_nam9_1_0_]), ColumnProjection(owner=roles1_, name=user_id, alias=Optional[user_id1_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[role_id2_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[id1_0_2_]), ColumnProjection(owner=role2_, name=create_time, alias=Optional[create_t2_0_2_]), ColumnProjection(owner=role2_, name=description, alias=Optional[descript3_0_2_]), ColumnProjection(owner=role2_, name=name, alias=Optional[name4_0_2_]), ColumnProjection(owner=role2_, name=role_key, alias=Optional[role_key5_0_2_]), ColumnProjection(owner=role2_, name=tenant, alias=Optional[tenant6_0_2_]), ColumnProjection(owner=role2_, name=update_time, alias=Optional[update_t7_0_2_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@419cdd89, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@5c35abd5, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@6da5275, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 20:58:35.849  INFO 8256 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Actual SQL: tenant-b ::: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.tenant as tenant7_1_0_, user0_.update_time as update_t8_1_0_, user0_.user_name as user_nam9_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.tenant as tenant6_0_2_, role2_.update_time as update_t7_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=? ::: [719173465277968384]</span></span>
<span class="line"><span>2022-04-08 20:58:35.849  INFO 8256 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.tenant as tenant7_1_0_, user0_.update_time as update_t8_1_0_, user0_.user_name as user_nam9_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.tenant as tenant6_0_2_, role2_.update_time as update_t7_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=? ::: [719173465277968384]</span></span>
<span class="line"><span>2022-04-08 21:03:33.876  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Logic SQL: select user0_.id as id1_1_, user0_.create_time as create_t2_1_, user0_.description as descript3_1_, user0_.email as email4_1_, user0_.password as password5_1_, user0_.phone_number as phone_nu6_1_, user0_.tenant as tenant7_1_, user0_.update_time as update_t8_1_, user0_.user_name as user_nam9_1_ from tb_user user0_ where user0_.tenant=? limit ?</span></span>
<span class="line"><span>2022-04-08 21:03:33.877  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@15243518, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@23f84ca7), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@23f84ca7, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=293, distinctRow=false, projections=[ColumnProjection(owner=user0_, name=id, alias=Optional[id1_1_]), ColumnProjection(owner=user0_, name=create_time, alias=Optional[create_t2_1_]), ColumnProjection(owner=user0_, name=description, alias=Optional[descript3_1_]), ColumnProjection(owner=user0_, name=email, alias=Optional[email4_1_]), ColumnProjection(owner=user0_, name=password, alias=Optional[password5_1_]), ColumnProjection(owner=user0_, name=phone_number, alias=Optional[phone_nu6_1_]), ColumnProjection(owner=user0_, name=tenant, alias=Optional[tenant7_1_]), ColumnProjection(owner=user0_, name=update_time, alias=Optional[update_t8_1_]), ColumnProjection(owner=user0_, name=user_name, alias=Optional[user_nam9_1_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@18e2796e, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@6a16cbdf, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@5eaeaf70, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 21:03:33.877  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Actual SQL: tenant-b ::: select user0_.id as id1_1_, user0_.create_time as create_t2_1_, user0_.description as descript3_1_, user0_.email as email4_1_, user0_.password as password5_1_, user0_.phone_number as phone_nu6_1_, user0_.tenant as tenant7_1_, user0_.update_time as update_t8_1_, user0_.user_name as user_nam9_1_ from tb_user user0_ where user0_.tenant=? limit ? ::: [b, 10]</span></span>
<span class="line"><span>2022-04-08 21:03:33.890  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Logic SQL: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.tenant as tenant6_0_1_, role1_.update_time as update_t7_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=?</span></span>
<span class="line"><span>2022-04-08 21:03:33.890  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@5e7c4e50, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@6f2681ce), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@6f2681ce, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=302, distinctRow=false, projections=[ColumnProjection(owner=roles0_, name=user_id, alias=Optional[user_id1_2_0_]), ColumnProjection(owner=roles0_, name=role_id, alias=Optional[role_id2_2_0_]), ColumnProjection(owner=role1_, name=id, alias=Optional[id1_0_1_]), ColumnProjection(owner=role1_, name=create_time, alias=Optional[create_t2_0_1_]), ColumnProjection(owner=role1_, name=description, alias=Optional[descript3_0_1_]), ColumnProjection(owner=role1_, name=name, alias=Optional[name4_0_1_]), ColumnProjection(owner=role1_, name=role_key, alias=Optional[role_key5_0_1_]), ColumnProjection(owner=role1_, name=tenant, alias=Optional[tenant6_0_1_]), ColumnProjection(owner=role1_, name=update_time, alias=Optional[update_t7_0_1_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@3212b90b, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@516424e5, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@6d56fe57, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 21:03:33.890  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Actual SQL: tenant-b ::: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.tenant as tenant6_0_1_, role1_.update_time as update_t7_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=? ::: [719173465277968384]</span></span>
<span class="line"><span>2022-04-08 21:03:33.890  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.tenant as tenant6_0_1_, role1_.update_time as update_t7_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=? ::: [719173465277968384]</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过几个问题进一步理解。</p></blockquote><h3 id="如果使用standard策略如何" tabindex="-1">如果使用standard策略如何？ <a class="header-anchor" href="#如果使用standard策略如何" aria-label="Permalink to &quot;如果使用standard策略如何？&quot;">​</a></h3><blockquote><p>上述inline策略也可以改成standard策略，效果一样。</p></blockquote><p>首先自定义PreciseShardingAlgorithm算法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.db.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Collection;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.shardingsphere.api.sharding.standard.PreciseShardingAlgorithm;</span></span>
<span class="line"><span>import org.apache.shardingsphere.api.sharding.standard.PreciseShardingValue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * This class is for MyPreciseShardingDBAlgorithm.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class MyPreciseShardingDBAlgorithm implements PreciseShardingAlgorithm&lt;String&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final String DATABASE_TENANT_PREFIX = &quot;tenant-&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @param availableTargetNames tenant-a, tenant-b</span></span>
<span class="line"><span>     * @param shardingValue        sharding value</span></span>
<span class="line"><span>     * @return targetDb</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String doSharding(final Collection&lt;String&gt; availableTargetNames, final PreciseShardingValue&lt;String&gt; shardingValue) {</span></span>
<span class="line"><span>        String targetDb = DATABASE_TENANT_PREFIX + shardingValue.getValue();</span></span>
<span class="line"><span>        if (availableTargetNames.contains(targetDb)) {</span></span>
<span class="line"><span>            return targetDb;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        throw new UnsupportedOperationException(&quot;UnsupportedOperationException: &quot; + shardingValue.getValue());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后配置sharding.default-database-strategy为standard，具体如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  shardingsphere:</span></span>
<span class="line"><span>    datasource:</span></span>
<span class="line"><span>      names: tenant-a,tenant-b</span></span>
<span class="line"><span>      tenant-a:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_tenant_a?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>      tenant-b:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_tenant_b?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>    sharding:</span></span>
<span class="line"><span>      default-database-strategy:</span></span>
<span class="line"><span>        # way 1: standard strategy</span></span>
<span class="line"><span>        standard:</span></span>
<span class="line"><span>          precise-algorithm-class-name: tech.pdai.springboot.shardingjdbc.jpa.tenant.db.config.MyPreciseShardingDBAlgorithm</span></span>
<span class="line"><span>          sharding-column: tenant</span></span>
<span class="line"><span>        # way 2: inline strategy</span></span>
<span class="line"><span>#        inline:</span></span>
<span class="line"><span>#          sharding-column: tenant</span></span>
<span class="line"><span>#          algorithm-expression: tenant-$-&gt;{tenant}</span></span>
<span class="line"><span>      tables:</span></span>
<span class="line"><span>        tb_user:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_user</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_role:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_role</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_user_role:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_user_role</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>      binding-tables: tb_user,tb_role,tb_user_role</span></span>
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
<span class="line"><span>        use-new-id-generator-mappings: false</span></span></code></pre></div><h3 id="上述两种策略存在什么问题" tabindex="-1">上述两种策略存在什么问题？ <a class="header-anchor" href="#上述两种策略存在什么问题" aria-label="Permalink to &quot;上述两种策略存在什么问题？&quot;">​</a></h3><blockquote><p>上面两种策略存在什么问题呢？</p></blockquote><ul><li><strong>侵入性</strong>： DB层和代码层</li></ul><p>上述两种模式需要增加一个新的字段tenant, 并且根据这个字段来对不同租户进行sharding（db级别或者table级别）； 这时候你会发现所有的查询必须要有tenant这个字段，这意味着所有的方法都支持tenant查询。一旦没有全部支持，你会看到Actual SQL会执行多次（每个DB一次）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-04-08 21:03:33.890  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Actual SQL: tenant-b ::: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.tenant as tenant6_0_1_, role1_.update_time as update_t7_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=? ::: [719173465277968384]</span></span>
<span class="line"><span>2022-04-08 21:03:33.890  INFO 8256 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.tenant as tenant6_0_1_, role1_.update_time as update_t7_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=? ::: [719173465277968384]</span></span></code></pre></div><ul><li><strong>租户之外的数据</strong></li></ul><p>比如系统级别的管理人员数据，元数据等，需要独立一个DB； 虽然可以通过一些配置来解决一些场景，但是上述两种方式的动态性不够（场景变动意味着推翻这两种模式）。</p><h3 id="如何使用hint强制路由方式" tabindex="-1">如何使用Hint强制路由方式？ <a class="header-anchor" href="#如何使用hint强制路由方式" aria-label="Permalink to &quot;如何使用Hint强制路由方式？&quot;">​</a></h3><blockquote><p>针对侵入性的问题，就多租户的场景下而言，可以通过Hint强制路由策略解决。</p></blockquote><p>首先我们需要定义个拦截的APO切面, 对数据操作层进行拦截。通过hintManager设置ShardingValue, 实际环境将client信息放在xxxContext中（由ThreadLocal承接），并通过client-id来获取tenant。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.dbhint.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.shardingsphere.api.hint.HintManager;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.After;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Aspect;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Before;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Pointcut;</span></span>
<span class="line"><span>import org.springframework.core.annotation.Order;</span></span>
<span class="line"><span>import org.springframework.stereotype.Component;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Aspect</span></span>
<span class="line"><span>@Order(1)</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class TenantDatasourceAspect {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * point cut.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Pointcut(&quot;execution(* tech.pdai.springboot.shardingjdbc.jpa.tenant.dbhint.dao.*.*(..))&quot;)</span></span>
<span class="line"><span>    public void useTenantDSPointCut() {</span></span>
<span class="line"><span>        // no impl</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Before(&quot;useTenantDSPointCut()&quot;)</span></span>
<span class="line"><span>    public void doDs0Before() {</span></span>
<span class="line"><span>        HintManager.clear();</span></span>
<span class="line"><span>        HintManager hintManager = HintManager.getInstance();</span></span>
<span class="line"><span>        // pdai: 实际环境将client信息放在xxxContext中（由ThreadLocal承接），并通过client-id来获取tenant.</span></span>
<span class="line"><span>        // 这里为了方便演示，只是使用了tenant-a</span></span>
<span class="line"><span>        hintManager.setDatabaseShardingValue(&quot;tenant-a&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @After(&quot;useTenantDSPointCut()&quot;)</span></span>
<span class="line"><span>    public void doDs0after() {</span></span>
<span class="line"><span>        HintManager.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后自定义HintShardingAlgorithm实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.jpa.tenant.dbhint.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Collection;</span></span>
<span class="line"><span>import java.util.stream.Collectors;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.shardingsphere.api.sharding.hint.HintShardingAlgorithm;</span></span>
<span class="line"><span>import org.apache.shardingsphere.api.sharding.hint.HintShardingValue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class MyHintShardingDBAlgorithm implements HintShardingAlgorithm&lt;String&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Sharding.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &lt;p&gt;sharding value injected by hint, not in SQL.&lt;/p&gt;</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param availableTargetNames available data sources or tables&#39;s names</span></span>
<span class="line"><span>     * @param shardingValue        sharding value</span></span>
<span class="line"><span>     * @return sharding result for data sources or tables&#39;s names</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Collection&lt;String&gt; doSharding(Collection&lt;String&gt; availableTargetNames, HintShardingValue&lt;String&gt; shardingValue) {</span></span>
<span class="line"><span>        return shardingValue.getValues().stream().filter(availableTargetNames::contains).collect(Collectors.toList());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在配置中配置sharding.default-database-strategy为inline</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  shardingsphere:</span></span>
<span class="line"><span>    datasource:</span></span>
<span class="line"><span>      names: tenant-a,tenant-b</span></span>
<span class="line"><span>      tenant-a:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_tenant_a?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>      tenant-b:</span></span>
<span class="line"><span>        type: com.zaxxer.hikari.HikariDataSource</span></span>
<span class="line"><span>        driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>        jdbc-url: jdbc:mysql://localhost:3306/test_db_tenant_b?allowPublicKeyRetrieval=true&amp;useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>        username: root</span></span>
<span class="line"><span>        password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>    sharding:</span></span>
<span class="line"><span>      default-database-strategy:</span></span>
<span class="line"><span>        hint:</span></span>
<span class="line"><span>          algorithm-class-name: tech.pdai.springboot.shardingjdbc.jpa.tenant.dbhint.config.MyHintShardingDBAlgorithm</span></span>
<span class="line"><span>      tables:</span></span>
<span class="line"><span>        tb_user:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_user</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_role:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_role</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>        tb_user_role:</span></span>
<span class="line"><span>          actual-data-nodes: tenant-\${[&#39;a&#39;,&#39;b&#39;]}.tb_user_role</span></span>
<span class="line"><span>          key-generator:</span></span>
<span class="line"><span>            column: id</span></span>
<span class="line"><span>            type: SNOWFLAKE</span></span>
<span class="line"><span>            props:</span></span>
<span class="line"><span>              worker:</span></span>
<span class="line"><span>                id: 123</span></span>
<span class="line"><span>      binding-tables: tb_user,tb_role,tb_user_role</span></span>
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
<span class="line"><span>        use-new-id-generator-mappings: false</span></span></code></pre></div><p>访问页面：</p><p><a href="http://localhost:8080/doc.html" target="_blank" rel="noreferrer">http://localhost:8080/doc.html</a></p><p>插入数据，会进入hint策略对应的算法</p><p><img src="`+_+'" alt="error.图片加载失败"></p><p>成功插入数据（因为我们上面hintManager中是tenant-a)</p><p><img src="'+d+'" alt="error.图片加载失败"></p><p>DB 中对应schema中的数据</p><p><img src="'+u+'" alt="error.图片加载失败"></p><p>查询数据</p><p><img src="'+g+`" alt="error.图片加载失败"></p><p>执行console log</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-04-08 21:38:49.473  INFO 13136 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Logic SQL: insert into tb_user (create_time, description, email, password, phone_number, update_time, user_name) values (?, ?, ?, ?, ?, ?, ?)</span></span>
<span class="line"><span>2022-04-08 21:38:49.473  INFO 13136 --- [nio-8080-exec-1] ShardingSphere-SQL                       : SQLStatement: InsertStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.InsertStatement@3f8ce2d6, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@7845fc58), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@7845fc58, columnNames=[create_time, description, email, password, phone_number, update_time, user_name], insertValueContexts=[InsertValueContext(parametersCount=7, valueExpressions=[ParameterMarkerExpressionSegment(startIndex=110, stopIndex=110, parameterMarkerIndex=0), ParameterMarkerExpressionSegment(startIndex=113, stopIndex=113, parameterMarkerIndex=1), ParameterMarkerExpressionSegment(startIndex=116, stopIndex=116, parameterMarkerIndex=2), ParameterMarkerExpressionSegment(startIndex=119, stopIndex=119, parameterMarkerIndex=3), ParameterMarkerExpressionSegment(startIndex=122, stopIndex=122, parameterMarkerIndex=4), ParameterMarkerExpressionSegment(startIndex=125, stopIndex=125, parameterMarkerIndex=5), ParameterMarkerExpressionSegment(startIndex=128, stopIndex=128, parameterMarkerIndex=6), DerivedParameterMarkerExpressionSegment(super=ParameterMarkerExpressionSegment(startIndex=0, stopIndex=0, parameterMarkerIndex=7))], parameters=[2022-04-08 21:37:45.061, pdai-hint-a, pdai2@pdai.tech, dad23i-hint-a, 0, 2022-04-08 21:37:45.061, pdai23i-hint-a])], generatedKeyContext=Optional[GeneratedKeyContext(columnName=id, generated=true, generatedValues=[719183321087062016])])</span></span>
<span class="line"><span>2022-04-08 21:38:49.473  INFO 13136 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: insert into tb_user (create_time, description, email, password, phone_number, update_time, user_name, id) values (?, ?, ?, ?, ?, ?, ?, ?) ::: [2022-04-08 21:37:45.061, pdai-hint-a, pdai2@pdai.tech, dad23i-hint-a, 0, 2022-04-08 21:37:45.061, pdai23i-hint-a, 719183321087062016]</span></span>
<span class="line"><span>2022-04-08 21:38:53.287  INFO 13136 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Logic SQL: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.update_time as update_t7_1_0_, user0_.user_name as user_nam8_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.update_time as update_t6_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=?</span></span>
<span class="line"><span>2022-04-08 21:38:53.287  INFO 13136 --- [nio-8080-exec-1] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@602d359e, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@3bf8fb09), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@3bf8fb09, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=541, distinctRow=false, projections=[ColumnProjection(owner=user0_, name=id, alias=Optional[id1_1_0_]), ColumnProjection(owner=user0_, name=create_time, alias=Optional[create_t2_1_0_]), ColumnProjection(owner=user0_, name=description, alias=Optional[descript3_1_0_]), ColumnProjection(owner=user0_, name=email, alias=Optional[email4_1_0_]), ColumnProjection(owner=user0_, name=password, alias=Optional[password5_1_0_]), ColumnProjection(owner=user0_, name=phone_number, alias=Optional[phone_nu6_1_0_]), ColumnProjection(owner=user0_, name=update_time, alias=Optional[update_t7_1_0_]), ColumnProjection(owner=user0_, name=user_name, alias=Optional[user_nam8_1_0_]), ColumnProjection(owner=roles1_, name=user_id, alias=Optional[user_id1_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[role_id2_2_1_]), ColumnProjection(owner=role2_, name=id, alias=Optional[id1_0_2_]), ColumnProjection(owner=role2_, name=create_time, alias=Optional[create_t2_0_2_]), ColumnProjection(owner=role2_, name=description, alias=Optional[descript3_0_2_]), ColumnProjection(owner=role2_, name=name, alias=Optional[name4_0_2_]), ColumnProjection(owner=role2_, name=role_key, alias=Optional[role_key5_0_2_]), ColumnProjection(owner=role2_, name=update_time, alias=Optional[update_t6_0_2_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@17cddd9a, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@43769c72, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@4afed047, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 21:38:53.287  INFO 13136 --- [nio-8080-exec-1] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select user0_.id as id1_1_0_, user0_.create_time as create_t2_1_0_, user0_.description as descript3_1_0_, user0_.email as email4_1_0_, user0_.password as password5_1_0_, user0_.phone_number as phone_nu6_1_0_, user0_.update_time as update_t7_1_0_, user0_.user_name as user_nam8_1_0_, roles1_.user_id as user_id1_2_1_, role2_.id as role_id2_2_1_, role2_.id as id1_0_2_, role2_.create_time as create_t2_0_2_, role2_.description as descript3_0_2_, role2_.name as name4_0_2_, role2_.role_key as role_key5_0_2_, role2_.update_time as update_t6_0_2_ from tb_user user0_ left outer join tb_user_role roles1_ on user0_.id=roles1_.user_id left outer join tb_role role2_ on roles1_.role_id=role2_.id where user0_.id=? ::: [719183321087062016]</span></span>
<span class="line"><span>2022-04-08 21:39:26.996  INFO 13136 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Logic SQL: select user0_.id as id1_1_, user0_.create_time as create_t2_1_, user0_.description as descript3_1_, user0_.email as email4_1_, user0_.password as password5_1_, user0_.phone_number as phone_nu6_1_, user0_.update_time as update_t7_1_, user0_.user_name as user_nam8_1_ from tb_user user0_ where 1=1 limit ?</span></span>
<span class="line"><span>2022-04-08 21:39:26.997  INFO 13136 --- [nio-8080-exec-2] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@2dbe7c04, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@7ce6951d), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@7ce6951d, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=264, distinctRow=false, projections=[ColumnProjection(owner=user0_, name=id, alias=Optional[id1_1_]), ColumnProjection(owner=user0_, name=create_time, alias=Optional[create_t2_1_]), ColumnProjection(owner=user0_, name=description, alias=Optional[descript3_1_]), ColumnProjection(owner=user0_, name=email, alias=Optional[email4_1_]), ColumnProjection(owner=user0_, name=password, alias=Optional[password5_1_]), ColumnProjection(owner=user0_, name=phone_number, alias=Optional[phone_nu6_1_]), ColumnProjection(owner=user0_, name=update_time, alias=Optional[update_t7_1_]), ColumnProjection(owner=user0_, name=user_name, alias=Optional[user_nam8_1_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@77b55ac4, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@765e7ff9, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@28de736a, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 21:39:26.997  INFO 13136 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select user0_.id as id1_1_, user0_.create_time as create_t2_1_, user0_.description as descript3_1_, user0_.email as email4_1_, user0_.password as password5_1_, user0_.phone_number as phone_nu6_1_, user0_.update_time as update_t7_1_, user0_.user_name as user_nam8_1_ from tb_user user0_ where 1=1 limit ? ::: [10]</span></span>
<span class="line"><span>2022-04-08 21:39:27.004  INFO 13136 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Logic SQL: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.update_time as update_t6_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=?</span></span>
<span class="line"><span>2022-04-08 21:39:27.005  INFO 13136 --- [nio-8080-exec-2] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@17b5967d, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@7ac1dcb9), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@7ac1dcb9, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=271, distinctRow=false, projections=[ColumnProjection(owner=roles0_, name=user_id, alias=Optional[user_id1_2_0_]), ColumnProjection(owner=roles0_, name=role_id, alias=Optional[role_id2_2_0_]), ColumnProjection(owner=role1_, name=id, alias=Optional[id1_0_1_]), ColumnProjection(owner=role1_, name=create_time, alias=Optional[create_t2_0_1_]), ColumnProjection(owner=role1_, name=description, alias=Optional[descript3_0_1_]), ColumnProjection(owner=role1_, name=name, alias=Optional[name4_0_1_]), ColumnProjection(owner=role1_, name=role_key, alias=Optional[role_key5_0_1_]), ColumnProjection(owner=role1_, name=update_time, alias=Optional[update_t6_0_1_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@68d9e73a, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@6331421f, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@580c367a, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 21:39:27.005  INFO 13136 --- [nio-8080-exec-2] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.update_time as update_t6_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=? ::: [719183321087062016]</span></span>
<span class="line"><span>2022-04-08 21:40:28.220  INFO 13136 --- [nio-8080-exec-4] ShardingSphere-SQL                       : Logic SQL: select user0_.id as id1_1_, user0_.create_time as create_t2_1_, user0_.description as descript3_1_, user0_.email as email4_1_, user0_.password as password5_1_, user0_.phone_number as phone_nu6_1_, user0_.update_time as update_t7_1_, user0_.user_name as user_nam8_1_ from tb_user user0_ where 1=1 limit ?</span></span>
<span class="line"><span>2022-04-08 21:40:28.220  INFO 13136 --- [nio-8080-exec-4] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@2dbe7c04, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@5c74176f), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@5c74176f, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=264, distinctRow=false, projections=[ColumnProjection(owner=user0_, name=id, alias=Optional[id1_1_]), ColumnProjection(owner=user0_, name=create_time, alias=Optional[create_t2_1_]), ColumnProjection(owner=user0_, name=description, alias=Optional[descript3_1_]), ColumnProjection(owner=user0_, name=email, alias=Optional[email4_1_]), ColumnProjection(owner=user0_, name=password, alias=Optional[password5_1_]), ColumnProjection(owner=user0_, name=phone_number, alias=Optional[phone_nu6_1_]), ColumnProjection(owner=user0_, name=update_time, alias=Optional[update_t7_1_]), ColumnProjection(owner=user0_, name=user_name, alias=Optional[user_nam8_1_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@19769285, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@2caf7930, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@28258a73, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 21:40:28.220  INFO 13136 --- [nio-8080-exec-4] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select user0_.id as id1_1_, user0_.create_time as create_t2_1_, user0_.description as descript3_1_, user0_.email as email4_1_, user0_.password as password5_1_, user0_.phone_number as phone_nu6_1_, user0_.update_time as update_t7_1_, user0_.user_name as user_nam8_1_ from tb_user user0_ where 1=1 limit ? ::: [10]</span></span>
<span class="line"><span>2022-04-08 21:40:28.221  INFO 13136 --- [nio-8080-exec-4] ShardingSphere-SQL                       : Logic SQL: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.update_time as update_t6_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=?</span></span>
<span class="line"><span>2022-04-08 21:40:28.221  INFO 13136 --- [nio-8080-exec-4] ShardingSphere-SQL                       : SQLStatement: SelectStatementContext(super=CommonSQLStatementContext(sqlStatement=org.apache.shardingsphere.sql.parser.sql.statement.dml.SelectStatement@17b5967d, tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@14ffd315), tablesContext=org.apache.shardingsphere.sql.parser.binder.segment.table.TablesContext@14ffd315, projectionsContext=ProjectionsContext(startIndex=7, stopIndex=271, distinctRow=false, projections=[ColumnProjection(owner=roles0_, name=user_id, alias=Optional[user_id1_2_0_]), ColumnProjection(owner=roles0_, name=role_id, alias=Optional[role_id2_2_0_]), ColumnProjection(owner=role1_, name=id, alias=Optional[id1_0_1_]), ColumnProjection(owner=role1_, name=create_time, alias=Optional[create_t2_0_1_]), ColumnProjection(owner=role1_, name=description, alias=Optional[descript3_0_1_]), ColumnProjection(owner=role1_, name=name, alias=Optional[name4_0_1_]), ColumnProjection(owner=role1_, name=role_key, alias=Optional[role_key5_0_1_]), ColumnProjection(owner=role1_, name=update_time, alias=Optional[update_t6_0_1_])]), groupByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.groupby.GroupByContext@6aff8332, orderByContext=org.apache.shardingsphere.sql.parser.binder.segment.select.orderby.OrderByContext@32acce81, paginationContext=org.apache.shardingsphere.sql.parser.binder.segment.select.pagination.PaginationContext@70f82e86, containsSubquery=false)</span></span>
<span class="line"><span>2022-04-08 21:40:28.221  INFO 13136 --- [nio-8080-exec-4] ShardingSphere-SQL                       : Actual SQL: tenant-a ::: select roles0_.user_id as user_id1_2_0_, roles0_.role_id as role_id2_2_0_, role1_.id as id1_0_1_, role1_.create_time as create_t2_0_1_, role1_.description as descript3_0_1_, role1_.name as name4_0_1_, role1_.role_key as role_key5_0_1_, role1_.update_time as update_t6_0_1_ from tb_user_role roles0_ inner join tb_role role1_ on roles0_.role_id=role1_.id where roles0_.user_id=? ::: [719183321087062016]</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,149)]))}const y=a(m,[["render",h]]);export{x as __pageData,y as default};
