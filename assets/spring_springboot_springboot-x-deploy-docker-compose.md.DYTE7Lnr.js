import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-x-docker-27.png",i="/vitepress-blog-template/images/spring/springboot/springboot-x-docker-26.png",g=JSON.parse('{"title":"SpringBoot应用部署 - 使用Docker Compose对容器编排管理","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-deploy-docker-compose.md","filePath":"spring/springboot/springboot-x-deploy-docker-compose.md","lastUpdated":1737706346000}'),o={name:"spring/springboot/springboot-x-deploy-docker-compose.md"};function t(r,s,c,m,d,_){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="springboot应用部署-使用docker-compose对容器编排管理" tabindex="-1">SpringBoot应用部署 - 使用Docker Compose对容器编排管理 <a class="header-anchor" href="#springboot应用部署-使用docker-compose对容器编排管理" aria-label="Permalink to &quot;SpringBoot应用部署 - 使用Docker Compose对容器编排管理&quot;">​</a></h1><blockquote><p>如果docker容器是相互依赖的（比如SpringBoot容器依赖另外一个MySQL的数据库容器），那就需要对容器进行编排。本文主要介绍基于Docker Compose的简单容器化编排SpringBoot应用。</p></blockquote><h2 id="docker-compose编排管理" tabindex="-1">Docker Compose编排管理 <a class="header-anchor" href="#docker-compose编排管理" aria-label="Permalink to &quot;Docker Compose编排管理&quot;">​</a></h2><blockquote><p>本例子主要介绍基于SpringBoot + MySQL的应用基于Docker Compose的编排。</p></blockquote><h3 id="springboot应用准备" tabindex="-1">SpringBoot应用准备 <a class="header-anchor" href="#springboot应用准备" aria-label="Permalink to &quot;SpringBoot应用准备&quot;">​</a></h3><blockquote><p>主要在如下文章的基础上，基于Docker Compose编排部署。</p></blockquote><ul><li><a href="https://pdai.tech/md/spring/springboot/springboot-x-mysql-jpa.html" target="_blank" rel="noreferrer">SpringBoot集成MySQL - 基于JPA的封装</a><ul><li>在实际开发中，最为常见的是基于数据库的CRUD封装等，比如SpringBoot集成MySQL数据库，常用的方式有JPA和MyBatis； 本文主要介绍基于JPA方式的基础封装思路。</li></ul></li></ul><h3 id="dockercompose编排" tabindex="-1">DockerCompose编排 <a class="header-anchor" href="#dockercompose编排" aria-label="Permalink to &quot;DockerCompose编排&quot;">​</a></h3><blockquote><p>DockerCompose编排配置如下</p></blockquote><ul><li>整体的文件结构</li></ul><p>PS: 注意红色的字</p><p><img src="'+l+`" alt="error.图片加载失败"></p><ul><li>Docker Compose 配置文件</li></ul><p>PS：参数可以设置成环境变量注入进来</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>version: &quot;3.1&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>services:</span></span>
<span class="line"><span>  db-mysql:</span></span>
<span class="line"><span>    image: mysql:8.0.28</span></span>
<span class="line"><span>    container_name: mysql8</span></span>
<span class="line"><span>    restart: always</span></span>
<span class="line"><span>    privileged: true</span></span>
<span class="line"><span>    volumes:</span></span>
<span class="line"><span>      # files</span></span>
<span class="line"><span>      - /usr/local/docker/mysql/files/:/var/lib/mysql-files/</span></span>
<span class="line"><span>#      # conf</span></span>
<span class="line"><span>#      - /usr/local/docker/mysql/conf/:/etc/mysql/conf.d/</span></span>
<span class="line"><span>#      # data</span></span>
<span class="line"><span>#      - /usr/local/docker/mysql/data/:/var/lib/mysql/</span></span>
<span class="line"><span>#      # log</span></span>
<span class="line"><span>#      - /usr/local/docker/mysql/logs/:/var/log/</span></span>
<span class="line"><span>      # init db by order</span></span>
<span class="line"><span>      - ./db/:/docker-entrypoint-initdb.d/</span></span>
<span class="line"><span>    environment:</span></span>
<span class="line"><span>      TZ : Asia/Shanghai</span></span>
<span class="line"><span>      MYSQL_ROOT_PASSWORD: bfXa4Pt2lUUScy8jakXf</span></span>
<span class="line"><span>      MYSQL_DATABASE: test_db</span></span>
<span class="line"><span>      MYSQL_USER: pdai</span></span>
<span class="line"><span>      MYSQL_PASSWORD: sdqiireasgadklkklk</span></span>
<span class="line"><span>    ports:</span></span>
<span class="line"><span>      - 13306:3306</span></span>
<span class="line"><span>    command:</span></span>
<span class="line"><span>      --authentication_policy=mysql_native_password</span></span>
<span class="line"><span>      --character-set-server=utf8mb4</span></span>
<span class="line"><span>      --collation-server=utf8mb4_general_ci</span></span>
<span class="line"><span>      --explicit_defaults_for_timestamp=true</span></span>
<span class="line"><span>      --lower_case_table_names=1</span></span>
<span class="line"><span>    networks:</span></span>
<span class="line"><span>      - internal</span></span>
<span class="line"><span>  service-app:</span></span>
<span class="line"><span>    image: springboot-demo-mysql8-jpa</span></span>
<span class="line"><span>    container_name: springboot-demo-mysql8-jpa</span></span>
<span class="line"><span>    environment:</span></span>
<span class="line"><span>      # profile</span></span>
<span class="line"><span>#      SPRING_PROFILES_ACTIVE: prod</span></span>
<span class="line"><span>      # or</span></span>
<span class="line"><span>      SPRING_DATASOURCE_URL: jdbc:mysql://db-mysql:3306/test_db?useSSL=false&amp;autoReconnect=true&amp;characterEncoding=utf8</span></span>
<span class="line"><span>      SPRING_DATASOURCE_USERNAME: pdai</span></span>
<span class="line"><span>      SPRING_DATASOURCE_PASSWORD: sdqiireasgadklkklk</span></span>
<span class="line"><span>    depends_on:</span></span>
<span class="line"><span>      - db-mysql</span></span>
<span class="line"><span>    ports:</span></span>
<span class="line"><span>      - 18080:8080</span></span>
<span class="line"><span>    networks:</span></span>
<span class="line"><span>      - internal</span></span>
<span class="line"><span></span></span>
<span class="line"><span>networks:</span></span>
<span class="line"><span>  internal:</span></span>
<span class="line"><span>    name: internal</span></span></code></pre></div><ul><li>SQL</li></ul><p>PS: 如果需要有time_zone字段，请参考<a href="https://github.com/docker-library/mysql/issues/229" target="_blank" rel="noreferrer">Github在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>use test_db;</span></span>
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
<span class="line"><span>UNLOCK TABLES;</span></span></code></pre></div><h3 id="测试和校验" tabindex="-1">测试和校验 <a class="header-anchor" href="#测试和校验" aria-label="Permalink to &quot;测试和校验&quot;">​</a></h3><p>通过docker-compose up启动，启动后的日志如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pdai@MacBook-Pro resources % docker-compose up                                                  </span></span>
<span class="line"><span>Starting mysql8 ... done</span></span>
<span class="line"><span>Starting springboot-demo-mysql8-jpa ... done</span></span>
<span class="line"><span>Attaching to mysql8, springboot-demo-mysql8-jpa</span></span>
<span class="line"><span>mysql8         | 2022-04-20 11:25:49+08:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.28-1debian10 started.</span></span>
<span class="line"><span>mysql8         | 2022-04-20 11:25:49+08:00 [Note] [Entrypoint]: Switching to dedicated user &#39;mysql&#39;</span></span>
<span class="line"><span>mysql8         | 2022-04-20 11:25:49+08:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.28-1debian10 started.</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:49.555053Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.28) starting as process 1</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:49.563364Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:49.832470Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:49.935130Z 0 [System] [MY-010229] [Server] Starting XA crash recovery...</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:49.943755Z 0 [System] [MY-010232] [Server] XA crash recovery finished.</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:50.011665Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:50.011719Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:50.013067Z 0 [Warning] [MY-011810] [Server] Insecure configuration for --pid-file: Location &#39;/var/run/mysqld&#39; in the path is accessible to all OS users. Consider choosing a different directory.</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:50.028686Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: &#39;::&#39; port: 33060, socket: /var/run/mysqld/mysqlx.sock</span></span>
<span class="line"><span>mysql8         | 2022-04-20T03:25:50.028772Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: &#39;8.0.28&#39;  socket: &#39;/var/run/mysqld/mysqld.sock&#39;  port: 3306  MySQL Community Server - GPL.</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | </span></span>
<span class="line"><span>springboot-demo-mysql8-jpa |   .   ____          _            __ _ _</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa |  /\\\\ / ___&#39;_ __ _ _(_)_ __  __ _ \\ \\ \\ \\</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | ( ( )\\___ | &#39;_ | &#39;_| | &#39;_ \\/ _\` | \\ \\ \\ \\</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa |  \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa |   &#39;  |____| .__|_| |_|_| |_\\__, | / / / /</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa |  =========|_|==============|___/=/_/_/_/</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa |  :: Spring Boot ::                (v2.5.3)</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | </span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:50.475  INFO 1 --- [           main] t.p.s.mysql8.jpa.dockercompose.App       : Starting App v1.0-SNAPSHOT using Java 1.8.0_322 on 468363ab8772 with PID 1 (/app.jar started by root in /)</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:50.477  INFO 1 --- [           main] t.p.s.mysql8.jpa.dockercompose.App       : The following profiles are active: prod</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:51.482  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:51.557  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 66 ms. Found 2 JPA repository interfaces.</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.135  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.148  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.148  INFO 1 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.50]</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.203  INFO 1 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.203  INFO 1 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 1682 ms</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.353  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.593  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.638  INFO 1 --- [           main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.694  INFO 1 --- [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 5.4.32.Final</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.824  INFO 1 --- [           main] o.hibernate.annotations.common.Version   : HCANN000001: Hibernate Commons Annotations {5.1.2.Final}</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:52.941  INFO 1 --- [           main] org.hibernate.dialect.Dialect            : HHH000400: Using dialect: org.hibernate.dialect.MySQLDialect</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:53.541  INFO 1 --- [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:53.550  INFO 1 --- [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit &#39;default&#39;</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:54.665  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path &#39;&#39;</span></span>
<span class="line"><span>springboot-demo-mysql8-jpa | 2022-04-20 03:25:54.930  INFO 1 --- [           main] t.p.s.mysql8.jpa.dockercompose.App       : Started App in 4.854 seconds (JVM running for 5.267)</span></span></code></pre></div><ul><li>查看mysql db是否正确创建</li></ul><p>（注意：也可以不开放端口，通过服务名进行内部网络通信）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pdai@MacBook-Pro conf % docker exec -it mysql8 /bin/bash  </span></span>
<span class="line"><span>root@028760cee140:/# mysql -u pdai -p</span></span>
<span class="line"><span>Enter password: </span></span>
<span class="line"><span>Welcome to the MySQL monitor.  Commands end with ; or \\g.</span></span>
<span class="line"><span>Your MySQL connection id is 8</span></span>
<span class="line"><span>Server version: 8.0.28 MySQL Community Server - GPL</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Copyright (c) 2000, 2022, Oracle and/or its affiliates.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Oracle is a registered trademark of Oracle Corporation and/or its</span></span>
<span class="line"><span>affiliates. Other names may be trademarks of their respective</span></span>
<span class="line"><span>owners.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Type &#39;help;&#39; or &#39;\\h&#39; for help. Type &#39;\\c&#39; to clear the current input statement.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; show databases;</span></span>
<span class="line"><span>+--------------------+</span></span>
<span class="line"><span>| Database           |</span></span>
<span class="line"><span>+--------------------+</span></span>
<span class="line"><span>| information_schema |</span></span>
<span class="line"><span>| test_db            |</span></span>
<span class="line"><span>+--------------------+</span></span>
<span class="line"><span>2 rows in set (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; use test_db;</span></span>
<span class="line"><span>Reading table information for completion of table and column names</span></span>
<span class="line"><span>You can turn off this feature to get a quicker startup with -A</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Database changed</span></span>
<span class="line"><span>mysql&gt; show tables;</span></span>
<span class="line"><span>+-------------------+</span></span>
<span class="line"><span>| Tables_in_test_db |</span></span>
<span class="line"><span>+-------------------+</span></span>
<span class="line"><span>| tb_role           |</span></span>
<span class="line"><span>| tb_user           |</span></span>
<span class="line"><span>| tb_user_role      |</span></span>
<span class="line"><span>+-------------------+</span></span>
<span class="line"><span>3 rows in set (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt;</span></span></code></pre></div><ul><li>访问服务</li></ul><p>通过对外端口18080进行访问</p><p><img src="`+i+'" alt="error.图片加载失败"></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',30)]))}const u=n(o,[["render",t]]);export{g as __pageData,u as default};
