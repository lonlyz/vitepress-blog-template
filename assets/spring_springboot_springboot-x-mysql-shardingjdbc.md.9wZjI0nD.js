import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/spring/springboot/spring-sharding-3.png",l="/vitepress-blog-template/images/spring/springboot/spring-sharding-1.png",i="/vitepress-blog-template/images/spring/springboot/spring-sharding-2.png",r="/vitepress-blog-template/images/spring/springboot/springboot-sharding-1.png",o="/vitepress-blog-template/images/spring/springboot/springboot-sharding-2.png",S=JSON.parse('{"title":"▶SpringBoot集成ShardingJDBC - Sharding-JDBC简介和基于MyBatis的单库分表","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-shardingjdbc.md","filePath":"spring/springboot/springboot-x-mysql-shardingjdbc.md","lastUpdated":1737706346000}'),c={name:"spring/springboot/springboot-x-mysql-shardingjdbc.md"};function u(d,s,g,h,b,q){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="▶springboot集成shardingjdbc-sharding-jdbc简介和基于mybatis的单库分表" tabindex="-1">▶SpringBoot集成ShardingJDBC - Sharding-JDBC简介和基于MyBatis的单库分表 <a class="header-anchor" href="#▶springboot集成shardingjdbc-sharding-jdbc简介和基于mybatis的单库分表" aria-label="Permalink to &quot;▶SpringBoot集成ShardingJDBC - Sharding-JDBC简介和基于MyBatis的单库分表&quot;">​</a></h1><blockquote><p>本文主要介绍分表分库，以及SpringBoot集成基于ShardingJDBC+MyBatis的单库分表实践。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>主要理解分表分库，Sharding-JDBC要解决什么问题，Sharding-JDBC及ShardingSphere的关系等。@pdai</p></blockquote><h3 id="为什么要分表分库" tabindex="-1">为什么要分表分库？ <a class="header-anchor" href="#为什么要分表分库" aria-label="Permalink to &quot;为什么要分表分库？&quot;">​</a></h3><p><a href="https://pdai.tech/md/db/sql-mysql/sql-mysql-devide.html" target="_blank" rel="noreferrer">MySQL - 分表分库</a></p><h3 id="什么是sharding-jdbc" tabindex="-1">什么是Sharding-JDBC？ <a class="header-anchor" href="#什么是sharding-jdbc" aria-label="Permalink to &quot;什么是Sharding-JDBC？&quot;">​</a></h3><blockquote><p>来自ShardingSphere官网</p></blockquote><p>Sharding-JDBC是ShardingSphere的第一个产品，也是ShardingSphere的前身。 它定位为轻量级Java框架，在Java的JDBC层提供的额外服务。它使用客户端直连数据库，以jar包形式提供服务，无需额外部署和依赖，可理解为增强版的JDBC驱动，完全兼容JDBC和各种ORM框架。</p><ul><li>适用于任何基于Java的ORM框架，如：JPA, Hibernate, Mybatis, Spring JDBC Template或直接使用JDBC。</li><li>基于任何第三方的数据库连接池，如：DBCP, C3P0, BoneCP, Druid, HikariCP等。</li><li>支持任意实现JDBC规范的数据库。目前支持MySQL，Oracle，SQLServer和PostgreSQL。</li></ul><p><img src="'+t+'" alt="error.图片加载失败"></p><h3 id="和shardingsphere是什么关系" tabindex="-1">和ShardingSphere是什么关系？ <a class="header-anchor" href="#和shardingsphere是什么关系" aria-label="Permalink to &quot;和ShardingSphere是什么关系？&quot;">​</a></h3><blockquote><p>来自ShardingSphere官网</p></blockquote><p>ShardingSphere是一套开源的分布式数据库中间件解决方案组成的生态圈，它由Sharding-JDBC、Sharding-Proxy和Sharding-Sidecar（计划中）这3款相互独立的产品组成。 他们均提供标准化的数据分片、分布式事务和数据库治理功能，可适用于如Java同构、异构语言、容器、云原生等各种多样化的应用场景。</p><p>ShardingSphere定位为关系型数据库中间件，旨在充分合理地在分布式的场景下利用关系型数据库的计算和存储能力，而并非实现一个全新的关系型数据库。 它与NoSQL和NewSQL是并存而非互斥的关系。NoSQL和NewSQL作为新技术探索的前沿，放眼未来，拥抱变化，是非常值得推荐的。反之，也可以用另一种思路看待问题，放眼未来，关注不变的东西，进而抓住事物本质。 关系型数据库当今依然占有巨大市场，是各个公司核心业务的基石，未来也难于撼动，我们目前阶段更加关注在原有基础上的增量，而非颠覆。</p><p><img src="'+l+'" alt="error.图片加载失败"></p><p>对应的版本功能</p><p><img src="'+i+`" alt="error.图片加载失败"></p><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里主要介绍SpringBoot集成基于ShardingJDBC的<strong>单库分表</strong>实践，主要承接之前的相关文章在MyBatis的注解方式的基础上实现的。</p></blockquote><h3 id="准备db和依赖配置" tabindex="-1">准备DB和依赖配置 <a class="header-anchor" href="#准备db和依赖配置" aria-label="Permalink to &quot;准备DB和依赖配置&quot;">​</a></h3><p>创建MySQL的schema test_db_sharding, 导入SQL 文件如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)</span></span>
<span class="line"><span>--</span></span>
<span class="line"><span>-- Host: localhost    Database: test_db_sharding</span></span>
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
<span class="line"><span>-- Dump completed on 2022-04-05 19:56:52</span></span></code></pre></div><p>引入maven依赖, 包含mysql驱动，mybatis和pageHelper, 以及sharding-jdbc的依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;mysql&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mysql-connector-java&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;8.0.28&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.mybatis.spring.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;mybatis-spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.1.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.github.pagehelper&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;pagehelper-spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.2.10&lt;/version&gt;</span></span>
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
<span class="line"><span>        username: test</span></span>
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
<span class="line"><span>      binding-tables: tb_user</span></span>
<span class="line"><span>      broadcast-tables: t_address</span></span>
<span class="line"><span>mybatis:</span></span>
<span class="line"><span>  type-aliases-package: tech.pdai.springboot.shardingjdbc.mybatis.tables.entity</span></span>
<span class="line"><span>  configuration:</span></span>
<span class="line"><span>    cache-enabled: true</span></span>
<span class="line"><span>    use-generated-keys: true</span></span>
<span class="line"><span>    default-executor-type: REUSE</span></span>
<span class="line"><span>    use-actual-param-name: true</span></span></code></pre></div><h3 id="dao" tabindex="-1">DAO <a class="header-anchor" href="#dao" aria-label="Permalink to &quot;DAO&quot;">​</a></h3><p>mapper/dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.mybatis.tables.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.ibatis.annotations.*;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.dao.provider.UserDaoProvider;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.query.UserQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Mapper</span></span>
<span class="line"><span>public interface IUserDao {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String SELECT_USER_SQL = &quot;select u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time from tb_user u&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Results(</span></span>
<span class="line"><span>            id = &quot;UserResult&quot;,</span></span>
<span class="line"><span>            value = {</span></span>
<span class="line"><span>                    @Result(property = &quot;id&quot;, column = &quot;id&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;userName&quot;, column = &quot;user_name&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;password&quot;, column = &quot;password&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;email&quot;, column = &quot;email&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;phoneNumber&quot;, column = &quot;phone_number&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;description&quot;, column = &quot;description&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;createTime&quot;, column = &quot;create_time&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;updateTime&quot;, column = &quot;update_time&quot;)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    @Select({SELECT_USER_SQL, &quot; where id = #{id}&quot;})</span></span>
<span class="line"><span>    User findById(@Param(&quot;id&quot;) Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ResultMap(&quot;UserResult&quot;)</span></span>
<span class="line"><span>    @Select(SELECT_USER_SQL)</span></span>
<span class="line"><span>    User findAll();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ResultMap(&quot;UserResult&quot;)</span></span>
<span class="line"><span>    @Select({&quot;&lt;script&gt; &quot;, SELECT_USER_SQL, &quot; where u.id != 0\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;if test=\\&quot;userName != null and userName != &#39;&#39;\\&quot;&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;AND u.user_name like concat(&#39;%&#39;, #{user_name}, &#39;%&#39;)\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;if test=\\&quot;description != null and description != &#39;&#39;\\&quot;&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;AND u.description like concat(&#39;%&#39;, #{description}, &#39;%&#39;)\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;if test=\\&quot;phoneNumber != null and phoneNumber != &#39;&#39;\\&quot;&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;AND u.phone_number like concat(&#39;%&#39;, #{phoneNumber}, &#39;%&#39;)\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;if test=\\&quot;email != null and email != &#39;&#39;\\&quot;&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;AND u.email like concat(&#39;%&#39;, #{email}, &#39;%&#39;)\\n&quot; +</span></span>
<span class="line"><span>            &quot;\\t\\t&lt;/if&gt;&quot;, &quot; &lt;/script&gt;&quot;})</span></span>
<span class="line"><span>    List&lt;User&gt; findList(UserQueryBean userQueryBean);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Delete(&quot;delete from tb_user where id = #{id}&quot;)</span></span>
<span class="line"><span>    int deleteById(Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Delete({&quot;&lt;script&gt; &quot;, &quot;delete from tb_user where id in\\n&quot; +</span></span>
<span class="line"><span>            &quot;&lt;foreach collection=\\&quot;array\\&quot; item=\\&quot;id\\&quot; open=\\&quot;(\\&quot; separator=\\&quot;,\\&quot; close=\\&quot;)\\&quot;&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot;#{id}\\n&quot; +</span></span>
<span class="line"><span>            &quot;&lt;/foreach&gt;&quot;, &quot; &lt;/script&gt;&quot;})</span></span>
<span class="line"><span>    int deleteByIds(Long[] ids);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Update({&quot;&lt;script&gt; &quot;, &quot;update tb_user\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;set&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;userName != null and userName != &#39;&#39;\\&quot;&gt;user_name = #{userName},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;email != null and email != &#39;&#39;\\&quot;&gt;email = #{email},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;phoneNumber != null and phoneNumber != &#39;&#39;\\&quot;&gt;phone_number = #{phoneNumber},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;description != null and description != &#39;&#39;\\&quot;&gt;description = #{description},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; update_time = sysdate()\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;/set&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; where id = #{id}&quot;, &quot; &lt;/script&gt;&quot;})</span></span>
<span class="line"><span>    int update(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Insert({&quot;&lt;script&gt; &quot;, &quot;insert into tb_user(\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;userName != null and userName != &#39;&#39;\\&quot;&gt;user_name,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;password != null and password != &#39;&#39;\\&quot;&gt;password,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;email != null and email != &#39;&#39;\\&quot;&gt;email,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;phoneNumber != null and phoneNumber != &#39;&#39;\\&quot;&gt;phone_number,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;description != null and description != &#39;&#39;\\&quot;&gt;description,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; create_time,\\n&quot; +</span></span>
<span class="line"><span>            &quot; update_time\\n&quot; +</span></span>
<span class="line"><span>            &quot; )values(\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;userName != null and userName != &#39;&#39;\\&quot;&gt;#{userName},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;password != null and password != &#39;&#39;\\&quot;&gt;#{password},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;email != null and email != &#39;&#39;\\&quot;&gt;#{email},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;phoneNumber != null and phoneNumber != &#39;&#39;\\&quot;&gt;#{phoneNumber},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; &lt;if test=\\&quot;description != null and description != &#39;&#39;\\&quot;&gt;#{description},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>            &quot; sysdate(),\\n&quot; +</span></span>
<span class="line"><span>            &quot; sysdate()\\n&quot; +</span></span>
<span class="line"><span>            &quot; )&quot;, &quot; &lt;/script&gt;&quot;})</span></span>
<span class="line"><span>    @Options(useGeneratedKeys = true, keyProperty = &quot;id&quot;)</span></span>
<span class="line"><span>    int save(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Update({&quot;update tb_user set password = #{password}, update_time = sysdate()&quot;, &quot; where id = #{id}&quot;})</span></span>
<span class="line"><span>    int updatePassword(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ResultMap(&quot;UserResult&quot;)</span></span>
<span class="line"><span>    @SelectProvider(type = UserDaoProvider.class, method = &quot;findById&quot;)</span></span>
<span class="line"><span>    User findById2(Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="service" tabindex="-1">Service <a class="header-anchor" href="#service" aria-label="Permalink to &quot;Service&quot;">​</a></h3><p>user service 接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.mybatis.tables.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.query.UserQueryBean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
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
<span class="line"><span>    User findById2(Long userId);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>service实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.mybatis.tables.service.impl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.dao.IUserDao;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public User findById2(Long userId) {</span></span>
<span class="line"><span>        return userDao.findById2(userId);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller" tabindex="-1">Controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;Controller&quot;">​</a></h3><p>user controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.shardingjdbc.mybatis.tables.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.query.UserQueryBean;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.entity.response.ResponseResult;</span></span>
<span class="line"><span>import io.swagger.annotations.ApiOperation;</span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.*;</span></span>
<span class="line"><span>import tech.pdai.springboot.shardingjdbc.mybatis.tables.service.IUserService;</span></span>
<span class="line"><span></span></span>
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
<span class="line"><span>            userService.save(user);</span></span>
<span class="line"><span>        } else {</span></span>
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
<span class="line"><span>     * @return user list 2</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ApiOperation(&quot;Query User One 2&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;edit2/{userId}&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;User&gt; edit2(@PathVariable(&quot;userId&quot;) Long userId) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.findById2(userId));</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    @ApiOperation(&quot;Delete by id&quot;)</span></span>
<span class="line"><span>    @PostMapping(&quot;delete&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;Integer&gt; delete(Long userId) {</span></span>
<span class="line"><span>        return ResponseResult.success(userService.deleteById(userId));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="简单测试" tabindex="-1">简单测试 <a class="header-anchor" href="#简单测试" aria-label="Permalink to &quot;简单测试&quot;">​</a></h3><p>访问页面：</p><p><a href="http://localhost:8080/doc.html" target="_blank" rel="noreferrer">http://localhost:8080/doc.html</a></p><p>插入数据</p><p><img src="`+r+'" alt="error.图片加载失败"></p><p>查询数据</p><p><img src="'+o+`" alt="error.图片加载失败"></p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过几个问题进一步理解。</p></blockquote><h3 id="几个常见的错误" tabindex="-1">几个常见的错误 <a class="header-anchor" href="#几个常见的错误" aria-label="Permalink to &quot;几个常见的错误&quot;">​</a></h3><p>在使用sharding-jdbc以及和其它组件集成（比如mybatis，mybatis-plus，druid等）遇到的问题会比较多，这里举几个典型的报错例子：</p><ul><li><strong>Sharding value must implements Comparable</strong>.</li></ul><p>由于数据分片，原有的数据库自动增长ID设置以及ORM层相关配置策略都不能再使用，所以需要取消数据库自增长以及ORM层@ID或者@TableID等注解。</p><p>key-generator 由如下配置替代</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  key-generator:</span></span>
<span class="line"><span>    column: id</span></span>
<span class="line"><span>    type: SNOWFLAKE</span></span>
<span class="line"><span>    props:</span></span>
<span class="line"><span>      worker:</span></span>
<span class="line"><span>        id: 123</span></span></code></pre></div><ul><li><strong>Data truncation: Out of range value for column &#39;id&#39;</strong></li></ul><p>正是由于上述SNOWFLAKE雪花算法（相关文章请参考<a href="https://pdai.tech/md/algorithm/alg-domain-id-snowflake.html" target="_blank" rel="noreferrer">分布式算法 - Snowflake算法</a>）， 相关ID是64位的long类型，所以需要设置相关字段位BIGINT类型。</p><ul><li><strong>java.sql.SQLFeatureNotSupportedException: getObject with type</strong></li></ul><p>这是与Mybatis等其它框架集成的一个bug：LocalDateTimeTypeHandler未能进行关联处理； 官方在5.0版本修复了这个问题，只是当前sharding-jdbc-spring-boot-starter的版本依然是4.1.1，所以依然有问题。这也凸显出了国产开源（即便是进入Apache且在不断完善）整体上还有很长的路（文档，闭环，Ecosystem...等等）要走。</p><p><a href="https://github.com/apache/shardingsphere/pull/6202" target="_blank" rel="noreferrer">https://github.com/apache/shardingsphere/pull/6202</a></p><h3 id="核心作者采访谈sharding-jdbc" tabindex="-1">核心作者采访谈Sharding-JDBC <a class="header-anchor" href="#核心作者采访谈sharding-jdbc" aria-label="Permalink to &quot;核心作者采访谈Sharding-JDBC&quot;">​</a></h3><p><a href="https://juejin.cn/post/6844903476393164813" target="_blank" rel="noreferrer">深度认识 Sharding-JDBC：做最轻量级的数据库中间层在新窗口打开</a></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,63)]))}const y=n(c,[["render",u]]);export{S as __pageData,y as default};
