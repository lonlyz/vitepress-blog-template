import{_ as s}from"./chunks/mongo-x-usage-spring-4.CKP9rGaU.js";import{_ as n}from"./chunks/mongo-x-usage-spring-5.DWJlL6wS.js";import{_ as p,c as e,ai as t,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springboot/springboot-hello-h2-1.png",r="/vitepress-blog-template/images/project/project-b-4.png",o="/vitepress-blog-template/images/project/project-b-3.png",c="/vitepress-blog-template/images/spring/springboot/springboot-hello-mvc-4.png",h="/vitepress-blog-template/images/spring/springboot/springboot-hello-h2-2.png",d="/vitepress-blog-template/images/spring/springboot/springboot-hello-h2-3.png",g="/vitepress-blog-template/images/spring/springboot/springboot-hello-h2-4.png",y=JSON.parse('{"title":"SpringBoot入门 - 添加内存数据库H2","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-hello-h2-jpa.md","filePath":"spring/springboot/springboot-x-hello-h2-jpa.md","lastUpdated":1737706346000}'),b={name:"spring/springboot/springboot-x-hello-h2-jpa.md"};function u(m,a,v,k,_,f){return l(),e("div",null,a[0]||(a[0]=[t('<h1 id="springboot入门-添加内存数据库h2" tabindex="-1">SpringBoot入门 - 添加内存数据库H2 <a class="header-anchor" href="#springboot入门-添加内存数据库h2" aria-label="Permalink to &quot;SpringBoot入门 - 添加内存数据库H2&quot;">​</a></h1><blockquote><p>上文我们展示了通过学习经典的MVC分包结构展示了一个用户的增删查改项目，但是我们没有接入数据库；本文将在上文的基础上，增加一个H2内存数据库，并且通过Spring 提供的数据访问包JPA进行数据查询。@pdai</p></blockquote><h2 id="准备知识点" tabindex="-1">准备知识点 <a class="header-anchor" href="#准备知识点" aria-label="Permalink to &quot;准备知识点&quot;">​</a></h2><blockquote><p>在介绍通过Spring JPA接入真实H2数据时，需要首先了解下：</p><ol><li>什么是H2数据库？</li><li>什么是JPA？</li></ol></blockquote><h3 id="什么是h2内存数据库" tabindex="-1">什么是H2内存数据库 <a class="header-anchor" href="#什么是h2内存数据库" aria-label="Permalink to &quot;什么是H2内存数据库&quot;">​</a></h3><blockquote><p>H2是一个用Java开发的嵌入式数据库，它本身只是一个类库，可以直接嵌入到应用项目中。</p></blockquote><p><a href="http://www.h2database.com/html/main.html" target="_blank" rel="noreferrer">官方网站在新窗口打开</a></p><p><img src="'+i+'" alt="error.图片加载失败"></p><p><strong>有哪些用途</strong>？</p><ul><li>H2最大的用途在于可以同应用程序打包在一起发布，这样可以非常方便地存储少量结构化数据。</li><li>它的另一个用途是<strong>用于单元测试</strong>。启动速度快，而且可以关闭持久化功能，每一个用例执行完随即还原到初始状态。</li><li>H2的第三个用处是作为缓存，作为NoSQL的一个补充。当某些场景下数据模型必须为关系型，可以拿它当Memcached使，作为后端MySQL/Oracle的一个缓冲层，缓存一些不经常变化但需要频繁访问的数据，比如字典表、权限表。不过这样系统架构就会比较复杂了。</li></ul><p><strong>H2的产品优势</strong>?</p><ul><li>纯Java编写，不受平台的限制；</li><li>只有一个jar文件，适合作为嵌入式数据库使用；</li><li>h2提供了一个十分方便的web控制台用于操作和管理数据库内容；</li><li>功能完整，支持标准SQL和JDBC。麻雀虽小五脏俱全；</li><li>支持内嵌模式、服务器模式和集群。</li></ul><h3 id="什么是jpa-和jdbc是什么关系" tabindex="-1">什么是JPA，和JDBC是什么关系 <a class="header-anchor" href="#什么是jpa-和jdbc是什么关系" aria-label="Permalink to &quot;什么是JPA，和JDBC是什么关系&quot;">​</a></h3><blockquote><p>什么是JDBC, ORM, JPA? 之间的关系是什么？</p></blockquote><ul><li><strong>什么是JDBC</strong></li></ul><p>JDBC（JavaDataBase Connectivity）就是Java数据库连接，说白了就是用Java语言来操作数据库。原来我们操作数据库是在控制台使用SQL语句来操作数据库，JDBC是用Java语言向数据库发送SQL语句。</p><p><img src="'+r+'" alt="error.图片加载失败"></p><ul><li><strong>什么是ORM</strong></li></ul><p>对象关系映射（Object Relational Mapping，简称ORM）， 简单的说，<strong>ORM是通过使用描述对象和数据库之间映射的元数据，将java程序中的对象自动持久化到关系数据库中</strong>。本质上就是将数据从一种形式转换到另外一种形式，具体如下：</p><p><img src="'+o+'" alt="error.图片加载失败"></p><p>具体映射：</p><ol><li>数据库的表（table） --&gt; 类（class）</li><li>记录（record，行数据）--&gt; 对象（object）</li><li>字段（field）--&gt; 对象的属性（attribute）</li></ol><ul><li><strong>什么是JPA</strong></li></ul><p>JPA是Spring提供的一种ORM，首先让我们回顾下Spring runtime体系：</p><p><img src="'+s+'" alt="error.图片加载失败"></p><p>Spring Data是基于Spring runtime体系的，JPA 属于Spring Data, 和JDBC的关系如下：</p><p><img src="'+n+`" alt="error.图片加载失败"></p><h2 id="案例" tabindex="-1">案例 <a class="header-anchor" href="#案例" aria-label="Permalink to &quot;案例&quot;">​</a></h2><blockquote><p>这里承接上文， 使用H2存放用户表，并通过JPA操作用户数据。</p></blockquote><h3 id="添加h2和jpa的依赖" tabindex="-1">添加H2和JPA的依赖 <a class="header-anchor" href="#添加h2和jpa的依赖" aria-label="Permalink to &quot;添加H2和JPA的依赖&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.h2database&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;h2&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;scope&gt;runtime&lt;/scope&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-data-jpa&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="配置h2和jpa注入参数" tabindex="-1">配置H2和JPA注入参数 <a class="header-anchor" href="#配置h2和jpa注入参数" aria-label="Permalink to &quot;配置H2和JPA注入参数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  datasource:</span></span>
<span class="line"><span>    data: classpath:db/data.sql</span></span>
<span class="line"><span>    driverClassName: org.h2.Driver</span></span>
<span class="line"><span>    password: sa</span></span>
<span class="line"><span>    platform: h2</span></span>
<span class="line"><span>    schema: classpath:db/schema.sql</span></span>
<span class="line"><span>    url: jdbc:h2:mem:dbtest</span></span>
<span class="line"><span>    username: sa</span></span>
<span class="line"><span>  h2:</span></span>
<span class="line"><span>    console:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>      path: /h2</span></span>
<span class="line"><span>      settings:</span></span>
<span class="line"><span>        web-allow-others: true</span></span>
<span class="line"><span>  jpa:</span></span>
<span class="line"><span>    hibernate:</span></span>
<span class="line"><span>      ddl-auto: update</span></span>
<span class="line"><span>    show-sql: true</span></span></code></pre></div><p>其中资源下还需要配置数据库的表结构schema.sql</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>create table if not exists tb_user (</span></span>
<span class="line"><span>USER_ID int not null primary key auto_increment,</span></span>
<span class="line"><span>USER_NAME varchar(100)</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>以及数据文件 data.sql, 默认插入一条‘赵一’的数据</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INSERT INTO tb_user (USER_ID,USER_NAME) VALUES(1,&#39;赵一&#39;);</span></span></code></pre></div><h3 id="实体关联表" tabindex="-1">实体关联表 <a class="header-anchor" href="#实体关联表" aria-label="Permalink to &quot;实体关联表&quot;">​</a></h3><p>给User添加@Entity注解，和@Table注解</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.h2.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.persistence.Entity;</span></span>
<span class="line"><span>import javax.persistence.Id;</span></span>
<span class="line"><span>import javax.persistence.Table;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Entity</span></span>
<span class="line"><span>@Table(name = &quot;tb_user&quot;)</span></span>
<span class="line"><span>public class User {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Id</span></span>
<span class="line"><span>    private int userId;</span></span>
<span class="line"><span>    private String userName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getUserId() {</span></span>
<span class="line"><span>        return userId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setUserId(int userId) {</span></span>
<span class="line"><span>        this.userId = userId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getUserName() {</span></span>
<span class="line"><span>        return userName;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setUserName(String userName) {</span></span>
<span class="line"><span>        this.userName = userName;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="dao继承jparepository" tabindex="-1">Dao继承JpaRepository <a class="header-anchor" href="#dao继承jparepository" aria-label="Permalink to &quot;Dao继承JpaRepository&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.h2.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.data.jpa.repository.JpaRepository;</span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springboot.h2.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface UserRepository extends JpaRepository&lt;User, Integer&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>(其它service,App启动类等代码和前文一致)</p><h3 id="运行程序" tabindex="-1">运行程序 <a class="header-anchor" href="#运行程序" aria-label="Permalink to &quot;运行程序&quot;">​</a></h3><p><img src="`+c+'" alt="error.图片加载失败"></p><h2 id="一些思考" tabindex="-1">一些思考 <a class="header-anchor" href="#一些思考" aria-label="Permalink to &quot;一些思考&quot;">​</a></h2><blockquote><p>这里补充一些H2数据库的知识点（特别是如何用H2做单元测试）， 可以跳过。</p></blockquote><h3 id="h2数据库通常如何使用" tabindex="-1">H2数据库通常如何使用？ <a class="header-anchor" href="#h2数据库通常如何使用" aria-label="Permalink to &quot;H2数据库通常如何使用？&quot;">​</a></h3><ul><li><strong>嵌入式模式</strong> （上文例子）</li></ul><p>在嵌入式模式下，应用程序使用JDBC从同一JVM中打开数据库。这是最快也是最容易的连接方式。缺点是数据库可能只在任何时候在一个虚拟机（和类加载器）中打开。与所有模式一样，支持持久性和内存数据库。对并发打开数据库的数量或打开连接的数量没有限制。</p><p><img src="'+h+'" alt="error.图片加载失败"></p><ul><li><strong>服务器模式</strong></li></ul><p>当使用服务器模式（有时称为远程模式或客户机/服务器模式）时，应用程序使用 JDBC 或 ODBC API 远程打开数据库。服务器需要在同一台或另一台虚拟机上启动，或者在另一台计算机上启动。许多应用程序可以通过连接到这个服务器同时连接到同一个数据库。在内部，服务器进程在嵌入式模式下打开数据库。</p><p>服务器模式比嵌入式模式慢，因为所有数据都通过TCP/IP传输。与所有模式一样，支持持久性和内存数据库。对每个服务器并发打开的数据库数量或打开连接的数量没有限制。</p><p><img src="'+d+'" alt="error.图片加载失败"></p><ul><li><strong>混合模式</strong></li></ul><p>混合模式是嵌入式和服务器模式的结合。连接到数据库的第一个应用程序在嵌入式模式下运行，但也启动服务器，以便其他应用程序（在不同进程或虚拟机中运行）可以同时访问相同的数据。本地连接的速度与数据库在嵌入式模式中的使用速度一样快，而远程连接速度稍慢。</p><p>服务器可以从应用程序内（使用服务器API）启动或停止，或自动（自动混合模式）。当使用自动混合模式时，所有想要连接到数据库的客户端（无论是本地连接还是远程连接）都可以使用完全相同的数据库URL来实现。</p><p><img src="'+g+'" alt="error.图片加载失败"></p><p>以上不同的连接方式对应不同的 JDBC URL，可以参考如下附录表格中的连接格式。</p><h3 id="如何使用h2做单元测试" tabindex="-1">如何使用H2做单元测试？ <a class="header-anchor" href="#如何使用h2做单元测试" aria-label="Permalink to &quot;如何使用H2做单元测试？&quot;">​</a></h3><p>为何H2会被用来做单元测试 以及 如何使用H2做单元测试？</p><p>可以参考这篇文章 <a href="https://pdai.tech/md/develop/ut/dev-ut-springboot2.html" target="_blank" rel="noreferrer">单元测试 - SpringBoot2+Mockito实战</a></p><h3 id="h2数据库的兼容性" tabindex="-1">H2数据库的兼容性？ <a class="header-anchor" href="#h2数据库的兼容性" aria-label="Permalink to &quot;H2数据库的兼容性？&quot;">​</a></h3><p>H2会被用作单元测试的模拟库，所以必然也需要了解H2数据库的兼容性。</p><p>h2官网对此有<a href="http://www.h2database.com/html/features.html#compatibility" target="_blank" rel="noreferrer">详细的描述在新窗口打开</a></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://www.jianshu.com/p/0288242ee2cb" target="_blank" rel="noreferrer">https://www.jianshu.com/p/0288242ee2cb</a></p><p><a href="https://www.cnblogs.com/cnjavahome/p/8995650.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/cnjavahome/p/8995650.html</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',72)]))}const x=p(b,[["render",u]]);export{y as __pageData,x as default};
