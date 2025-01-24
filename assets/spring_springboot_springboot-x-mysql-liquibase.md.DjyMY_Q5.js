import{_ as s,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-1.png",t="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-2.png",i="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-3.png",o="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-7.png",c="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-4.png",r="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-5.png",g="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-6.png",u="/vitepress-blog-template/images/spring/springboot/springboot-liquibase-8.png",v=JSON.parse('{"title":"▶SpringBoot数据库管理 - 用Liquibase对数据库管理和迁移","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-liquibase.md","filePath":"spring/springboot/springboot-x-mysql-liquibase.md","lastUpdated":1737706346000}'),h={name:"spring/springboot/springboot-x-mysql-liquibase.md"};function d(b,a,m,q,k,y){return p(),n("div",null,a[0]||(a[0]=[e('<h1 id="▶springboot数据库管理-用liquibase对数据库管理和迁移" tabindex="-1">▶SpringBoot数据库管理 - 用Liquibase对数据库管理和迁移 <a class="header-anchor" href="#▶springboot数据库管理-用liquibase对数据库管理和迁移" aria-label="Permalink to &quot;▶SpringBoot数据库管理 - 用Liquibase对数据库管理和迁移&quot;">​</a></h1><blockquote><p>Liquibase是一个用于<strong>用于跟踪、管理和应用数据库变化的开源工具</strong>，通过日志文件(changelog)的形式记录数据库的变更(changeset)，然后执行日志文件中的修改，将数据库更新或回滚(rollback)到一致的状态。它的目标是提供一种数据库类型无关的解决方案，通过执行schema类型的文件来达到迁移。本文主要介绍SpringBoot与Liquibase的集成。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要理解什么是Liquibase，它的出现是要解决什么问题。</p></blockquote><h3 id="什么是liquibase-这类工具要解决什么问题" tabindex="-1">什么是Liquibase？这类工具要解决什么问题？ <a class="header-anchor" href="#什么是liquibase-这类工具要解决什么问题" aria-label="Permalink to &quot;什么是Liquibase？这类工具要解决什么问题？&quot;">​</a></h3><blockquote><p>Liquibase是一个用于<strong>用于跟踪、管理和应用数据库变化的开源工具</strong>，通过日志文件(changelog)的形式记录数据库的变更(changeset)，然后执行日志文件中的修改，将数据库更新或回滚(rollback)到一致的状态。它的目标是提供一种数据库类型无关的解决方案，通过执行schema类型的文件来达到迁移。</p></blockquote><p><strong>其优点主要有以下</strong>：</p><ul><li>支持几乎所有主流的数据库，目前支持包括 Oracle/Sql Server/DB2/MySql/Sybase/PostgreSQL等 <a href="https://docs.liquibase.com/install/tutorials/home.html" target="_blank" rel="noreferrer">各种数据库在新窗口打开</a>，这样在数据库的部署和升级环节可帮助应用系统支持多数据库；</li><li>支持版本控制，这样就能支持多开发者的协作维护；</li><li>日志文件支持多种格式，如XML, YAML, JSON, SQL等；</li><li>提供变化应用的回滚功能，可按时间、数量或标签（tag）回滚已应用的变化。通过这种方式，开发人员可轻易的还原数据库在任何时间点的状态</li><li>支持多种运行方式，如命令行、Spring集成、Maven插件、Gradle插件等。</li></ul><p><strong>为何会出现Liquibase这类工具呢</strong>？</p><p>在实际上线的应用中，随着版本的迭代，经常会遇到需要变更数据库表和字段，必然会遇到需要对这些变更进行记录和管理，以及回滚等等；同时只有脚本化且版本可管理，才能在让数据库实现真正的DevOps（自动化执行 + 回滚等）。在这样的场景下Liquibase等工具的出现也就成为了必然。</p><h3 id="liquibase有哪些概念-是如何工作的" tabindex="-1">Liquibase有哪些概念？是如何工作的？ <a class="header-anchor" href="#liquibase有哪些概念-是如何工作的" aria-label="Permalink to &quot;Liquibase有哪些概念？是如何工作的？&quot;">​</a></h3><blockquote><p><strong>工作流程</strong>：将<strong>SQL</strong>变更记录到<strong>changeset</strong>，多个changeset变更组成了日志文件(<strong>changelog</strong>)，liquibase将changelog更新日志文件同步到指定的<strong>RDBMS</strong>中。</p></blockquote><p><img src="'+l+`" alt="error.图片加载失败"></p><p>日志文件(databaseChangeLog)支持多种格式，如XML, YAML, JSON, SQL; 我们以xml为例，看下相关配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt; </span></span>
<span class="line"><span>&lt;databaseChangeLog</span></span>
<span class="line"><span>	xmlns=&quot;http://www.liquibase.org/xml/ns/dbchangelog&quot;</span></span>
<span class="line"><span>	xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>	xmlns:ext=&quot;http://www.liquibase.org/xml/ns/dbchangelog-ext&quot;</span></span>
<span class="line"><span>	xmlns:pro=&quot;http://www.liquibase.org/xml/ns/pro&quot;</span></span>
<span class="line"><span>	xsi:schemaLocation=&quot;http://www.liquibase.org/xml/ns/dbchangelog</span></span>
<span class="line"><span>		http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.9.0.xsd</span></span>
<span class="line"><span>		http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd</span></span>
<span class="line"><span>		http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-4.9.0.xsd&quot;&gt;</span></span>
<span class="line"><span>    &lt;changeSet id=&quot;1&quot; author=&quot;bob&quot;&gt;  </span></span>
<span class="line"><span>        &lt;comment&gt;A sample change log&lt;/comment&gt;  </span></span>
<span class="line"><span>        &lt;createTable/&gt; </span></span>
<span class="line"><span>    &lt;/changeSet&gt;  </span></span>
<span class="line"><span>    &lt;changeSet id=&quot;2&quot; author=&quot;bob&quot; runAlways=&quot;true&quot;&gt;  </span></span>
<span class="line"><span>        &lt;alterTable/&gt;  </span></span>
<span class="line"><span>    &lt;/changeSet&gt;  </span></span>
<span class="line"><span>    &lt;changeSet id=&quot;3&quot; author=&quot;alice&quot; failOnError=&quot;false&quot; dbms=&quot;oracle&quot;&gt;</span></span>
<span class="line"><span>        &lt;alterTable/&gt;  </span></span>
<span class="line"><span>    &lt;/changeSet&gt;  </span></span>
<span class="line"><span>    &lt;changeSet id=&quot;4&quot; author=&quot;alice&quot; failOnError=&quot;false&quot; dbms=&quot;!oracle&quot;&gt;</span></span>
<span class="line"><span>        &lt;alterTable/&gt;  </span></span>
<span class="line"><span>    &lt;/changeSet&gt;  </span></span>
<span class="line"><span>&lt;/databaseChangeLog&gt;</span></span></code></pre></div><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>这里主要介绍基于SpringBoot集成liquibase来管理数据库的变更。</p></blockquote><h3 id="pom依赖" tabindex="-1">POM依赖 <a class="header-anchor" href="#pom依赖" aria-label="Permalink to &quot;POM依赖&quot;">​</a></h3><p>Maven 包的依赖，主要包含mysql驱动, JDBC(这里spring-boot-starter-data-jpa包含了jdbc包，当然直接引入jdbc包也行)，以及liquibase包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.liquibase&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;liquibase-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;4.9.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="yml配置" tabindex="-1">yml配置 <a class="header-anchor" href="#yml配置" aria-label="Permalink to &quot;yml配置&quot;">​</a></h3><blockquote><p>SpringBoot AutoConfig默认已经包含了对liquibase的配置，在spring.liquibase配置下。</p></blockquote><p>基础的配置，可以直接使用如下（主要是指定change-log的位置，默认的位置是classpath:/db/changelog/db.changelog-master.yaml）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  datasource:</span></span>
<span class="line"><span>    url: jdbc:mysql://localhost:3306/test_db_liquibase?useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>    driver-class-name: com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span>    username: root</span></span>
<span class="line"><span>    password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>  liquibase:</span></span>
<span class="line"><span>    enabled: true</span></span>
<span class="line"><span>    # 如下配置是被spring.datasource赋值的，所以可以不配置</span></span>
<span class="line"><span>#    url: jdbc:mysql://localhost:3306/test_db_liquibase?useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>#    user: root</span></span>
<span class="line"><span>#    password: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>    change-log: classpath:/db/changelog/db.changelog-master.yaml</span></span></code></pre></div><p>在开发时，更多的配置可以从如下SpringBoot AutoConfig中找到。</p><p><img src="`+t+`" alt="error.图片加载失败"></p><h3 id="新增changelog" tabindex="-1">新增changelog <a class="header-anchor" href="#新增changelog" aria-label="Permalink to &quot;新增changelog&quot;">​</a></h3><p>XML方式固然OK，不过依然推荐使用yml格式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>databaseChangeLog:</span></span>
<span class="line"><span>  - changeSet:</span></span>
<span class="line"><span>      id: 20220412-01</span></span>
<span class="line"><span>      author: pdai</span></span>
<span class="line"><span>      changes:</span></span>
<span class="line"><span>        - createTable:</span></span>
<span class="line"><span>            tableName: person</span></span>
<span class="line"><span>            columns:</span></span>
<span class="line"><span>              - column:</span></span>
<span class="line"><span>                  name: id</span></span>
<span class="line"><span>                  type: int</span></span>
<span class="line"><span>                  autoIncrement: true</span></span>
<span class="line"><span>                  constraints:</span></span>
<span class="line"><span>                    primaryKey: true</span></span>
<span class="line"><span>                    nullable: false</span></span>
<span class="line"><span>              - column:</span></span>
<span class="line"><span>                  name: firstname</span></span>
<span class="line"><span>                  type: varchar(50)</span></span>
<span class="line"><span>              - column:</span></span>
<span class="line"><span>                  name: lastname</span></span>
<span class="line"><span>                  type: varchar(50)</span></span>
<span class="line"><span>                  constraints:</span></span>
<span class="line"><span>                    nullable: false</span></span>
<span class="line"><span>              - column:</span></span>
<span class="line"><span>                  name: state</span></span>
<span class="line"><span>                  type: char(2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  - changeSet:</span></span>
<span class="line"><span>      id: 20220412-02</span></span>
<span class="line"><span>      author: pdai</span></span>
<span class="line"><span>      changes:</span></span>
<span class="line"><span>        - addColumn:</span></span>
<span class="line"><span>            tableName: person</span></span>
<span class="line"><span>            columns:</span></span>
<span class="line"><span>              - column:</span></span>
<span class="line"><span>                  name: username</span></span>
<span class="line"><span>                  type: varchar(8)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  - changeSet:</span></span>
<span class="line"><span>      id: 20220412-03</span></span>
<span class="line"><span>      author: pdai</span></span>
<span class="line"><span>      changes:</span></span>
<span class="line"><span>        - addLookupTable:</span></span>
<span class="line"><span>            existingTableName: person</span></span>
<span class="line"><span>            existingColumnName: state</span></span>
<span class="line"><span>            newTableName: state</span></span>
<span class="line"><span>            newColumnName: id</span></span>
<span class="line"><span>            newColumnDataType: char(2)</span></span></code></pre></div><h3 id="测试" tabindex="-1">测试 <a class="header-anchor" href="#测试" aria-label="Permalink to &quot;测试&quot;">​</a></h3><p>启动springBootApplication, 我们可以看到如下的几个changeSet被依次执行</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-04-12 20:41:20.591  INFO 8476 --- [           main] liquibase.lockservice                    : Successfully acquired change log lock</span></span>
<span class="line"><span>2022-04-12 20:41:20.737  INFO 8476 --- [           main] liquibase.changelog                      : Creating database history table with name: test_db_liquibase.DATABASECHANGELOG</span></span>
<span class="line"><span>2022-04-12 20:41:20.783  INFO 8476 --- [           main] liquibase.changelog                      : Reading from test_db_liquibase.DATABASECHANGELOG</span></span>
<span class="line"><span>Running Changeset: classpath:/db/changelog/db.changelog-master.yaml::20220412-01::pdai</span></span>
<span class="line"><span>2022-04-12 20:41:20.914  INFO 8476 --- [           main] liquibase.changelog                      : Table person created</span></span>
<span class="line"><span>2022-04-12 20:41:20.914  INFO 8476 --- [           main] liquibase.changelog                      : ChangeSet classpath:/db/changelog/db.changelog-master.yaml::20220412-01::pdai ran successfully in 53ms</span></span>
<span class="line"><span>Running Changeset: classpath:/db/changelog/db.changelog-master.yaml::20220412-02::pdai</span></span>
<span class="line"><span>2022-04-12 20:41:20.952  INFO 8476 --- [           main] liquibase.changelog                      : Columns username(varchar(8)) added to person</span></span>
<span class="line"><span>2022-04-12 20:41:20.952  INFO 8476 --- [           main] liquibase.changelog                      : ChangeSet classpath:/db/changelog/db.changelog-master.yaml::20220412-02::pdai ran successfully in 31ms</span></span>
<span class="line"><span>Running Changeset: classpath:/db/changelog/db.changelog-master.yaml::20220412-03::pdai</span></span>
<span class="line"><span>2022-04-12 20:41:21.351  INFO 8476 --- [           main] liquibase.changelog                      : Lookup table added for person.state</span></span>
<span class="line"><span>2022-04-12 20:41:21.351  INFO 8476 --- [           main] liquibase.changelog                      : ChangeSet classpath:/db/changelog/db.changelog-master.yaml::20220412-03::pdai ran successfully in 389ms</span></span>
<span class="line"><span>2022-04-12 20:41:21.382  INFO 8476 --- [           main] liquibase.lockservice                    : Successfully released change log lock</span></span></code></pre></div><p>查看数据库，你会发现数据已经变更</p><p><img src="`+i+`" alt="error.图片加载失败"></p><p>那我们如果重新启动这个SpringBootApplication，会怎么呢？</p><p>很显然，因为databasechangelog表中已经有相关执行记录了，所以将不再执行变更</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-04-12 20:49:01.566  INFO 9144 --- [           main] liquibase.lockservice                    : Successfully acquired change log lock</span></span>
<span class="line"><span>2022-04-12 20:49:01.761  INFO 9144 --- [           main] liquibase.changelog                      : Reading from test_db_liquibase.DATABASECHANGELOG</span></span>
<span class="line"><span>2022-04-12 20:49:01.812  INFO 9144 --- [           main] liquibase.lockservice                    : Successfully released change log lock</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过几个问题，进一步理解。</p></blockquote><h3 id="比较好的changelog的实践" tabindex="-1">比较好的changelog的实践？ <a class="header-anchor" href="#比较好的changelog的实践" aria-label="Permalink to &quot;比较好的changelog的实践？&quot;">​</a></h3><blockquote><p>简单而言：yml格式 + <a href="https://docs.liquibase.com/change-types/sql-file.html" target="_blank" rel="noreferrer">sql-file方式在新窗口打开</a></p></blockquote><p>执行sqlFile格式的changeSet，如下</p><p><img src="`+o+`" alt="error.图片加载失败"></p><p>执行的日志如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-04-12 21:00:28.198  INFO 17540 --- [           main] liquibase.lockservice                    : Successfully acquired change log lock</span></span>
<span class="line"><span>2022-04-12 21:00:28.398  INFO 17540 --- [           main] liquibase.changelog                      : Reading from test_db_liquibase.DATABASECHANGELOG</span></span>
<span class="line"><span>Running Changeset: classpath:/db/changelog/db.changelog-master.yaml::20220412-04::pdai</span></span>
<span class="line"><span>2022-04-12 21:00:28.516  INFO 17540 --- [           main] liquibase.changelog                      : SQL in file classpath:/db/changelog/db.changelog-20220412-04.sql executed</span></span>
<span class="line"><span>2022-04-12 21:00:28.516  INFO 17540 --- [           main] liquibase.changelog                      : ChangeSet classpath:/db/changelog/db.changelog-master.yaml::20220412-04::pdai ran successfully in 83ms</span></span>
<span class="line"><span>2022-04-12 21:00:28.532  INFO 17540 --- [           main] liquibase.lockservice                    : Successfully released change log lock</span></span></code></pre></div><p>执行后，查看变更记录</p><p><img src="`+c+'" alt="error.图片加载失败"></p><p>数据表user表已经创建并插入一条数据</p><p><img src="'+r+'" alt="error.图片加载失败"></p><h3 id="除了addcolumn-addtable还有哪些changetype呢" tabindex="-1">除了addColumn,addTable还有哪些changeType呢？ <a class="header-anchor" href="#除了addcolumn-addtable还有哪些changetype呢" aria-label="Permalink to &quot;除了addColumn,addTable还有哪些changeType呢？&quot;">​</a></h3><blockquote><p>除了addColumn,addTable还有哪些changeType呢?</p></blockquote><p>与此同时，还支持<a href="https://docs.liquibase.com/change-types/home.html" target="_blank" rel="noreferrer">如下changeType在新窗口打开</a>：</p><p><img src="'+g+`" alt="error.图片加载失败"></p><p>此外，还支持执行<a href="https://docs.liquibase.com/commands/home.html" target="_blank" rel="noreferrer">command在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>changeSet:  </span></span>
<span class="line"><span>  id:  executeCommand-example  </span></span>
<span class="line"><span>  author:  liquibase-docs  </span></span>
<span class="line"><span>  changes:  </span></span>
<span class="line"><span>  -  executeCommand:  </span></span>
<span class="line"><span>      args:  </span></span>
<span class="line"><span>      -  arg:  </span></span>
<span class="line"><span>          value:  -out  </span></span>
<span class="line"><span>      -  arg:  </span></span>
<span class="line"><span>          value:  -param2  </span></span>
<span class="line"><span>      executable:  mysqldump  </span></span>
<span class="line"><span>      os:  Windows 7  </span></span>
<span class="line"><span>      timeout:  10s</span></span></code></pre></div><p>比如，回滚的操作可以通过如下command进行</p><p><img src="`+u+'" alt="error.图片加载失败"></p><p>再比如，我们可以通过Liquibase来生成相关差异，再制作成changeSet，最后部署。</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>参考文章</p><p><a href="https://docs.liquibase.com" target="_blank" rel="noreferrer">https://docs.liquibase.com</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',63)]))}const S=s(h,[["render",d]]);export{v as __pageData,S as default};
