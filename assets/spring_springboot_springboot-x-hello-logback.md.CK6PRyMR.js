import{_ as a,c as s,ai as l,o as p}from"./chunks/framework.BrYByd3F.js";const q=JSON.parse('{"title":"SpringBoot入门 - 添加Logback日志","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-hello-logback.md","filePath":"spring/springboot/springboot-x-hello-logback.md","lastUpdated":1737706346000}'),t={name:"spring/springboot/springboot-x-hello-logback.md"};function e(o,n,i,c,g,r){return p(),s("div",null,n[0]||(n[0]=[l(`<h1 id="springboot入门-添加logback日志" tabindex="-1">SpringBoot入门 - 添加Logback日志 <a class="header-anchor" href="#springboot入门-添加logback日志" aria-label="Permalink to &quot;SpringBoot入门 - 添加Logback日志&quot;">​</a></h1><blockquote><p>SpringBoot开发中如何选用日志框架呢？ 出于性能等原因，Logback 目前是springboot应用日志的标配； 当然有时候在生产环境中也会考虑和三方中间件采用统一处理方式。@pdai</p></blockquote><h2 id="日志框架的基础" tabindex="-1">日志框架的基础 <a class="header-anchor" href="#日志框架的基础" aria-label="Permalink to &quot;日志框架的基础&quot;">​</a></h2><p>在学习这块时需要一些日志框架的发展和基础，同时了解日志配置时考虑的因素。</p><h3 id="关于日志框架-日志门面" tabindex="-1">关于日志框架（日志门面） <a class="header-anchor" href="#关于日志框架-日志门面" aria-label="Permalink to &quot;关于日志框架（日志门面）&quot;">​</a></h3><blockquote><p>Java日志库是最能体现Java库在进化中的渊源关系的，在理解时重点理解<strong>日志框架本身</strong>和<strong>日志门面</strong>，以及比较好的实践等。要关注其历史渊源和设计（比如桥接），而具体在使用时查询接口即可， 否则会陷入JUL(Java Util Log), JCL(Commons Logging), Log4j, SLF4J, Logback，Log4j2傻傻分不清楚的境地。</p></blockquote><p>关于日志框架（日志门面）这篇文章有过详细的介绍。</p><p><a href="https://pdai.tech/md/develop/package/dev-package-x-log.html" target="_blank" rel="noreferrer">常用开发库 - 日志类库详解</a></p><h3 id="配置时考虑点" tabindex="-1">配置时考虑点 <a class="header-anchor" href="#配置时考虑点" aria-label="Permalink to &quot;配置时考虑点&quot;">​</a></h3><blockquote><p>在配置日志时需要考虑哪些因素？</p></blockquote><ul><li>支持日志路径，日志level等配置</li><li>日志控制配置通过application.yml下发</li><li>按天生成日志，当天的日志&gt;50MB回滚</li><li>最多保存10天日志</li><li>生成的日志中Pattern自定义</li><li>Pattern中添加用户自定义的MDC字段，比如用户信息(当前日志是由哪个用户的请求产生)，request信息。此种方式可以通过AOP切面控制，在MDC中添加requestID，在spring-logback.xml中配置Pattern。</li><li>根据不同的运行环境设置Profile - dev，test，product</li><li>对控制台，Err和全量日志分别配置</li><li>对第三方包路径日志控制</li></ul><h2 id="实现范例" tabindex="-1">实现范例 <a class="header-anchor" href="#实现范例" aria-label="Permalink to &quot;实现范例&quot;">​</a></h2><blockquote><p>如下两个例子基本包含了上述的考虑点:</p></blockquote><h3 id="综合范例" tabindex="-1">综合范例 <a class="header-anchor" href="#综合范例" aria-label="Permalink to &quot;综合范例&quot;">​</a></h3><ul><li>application.yml</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>logging:</span></span>
<span class="line"><span>  level:</span></span>
<span class="line"><span>    root: debug</span></span>
<span class="line"><span>  path: C:/data/logs/springboot-logback-demo</span></span>
<span class="line"><span>server:</span></span>
<span class="line"><span>  port: 8080</span></span>
<span class="line"><span>spring:</span></span>
<span class="line"><span>  application:</span></span>
<span class="line"><span>    name: springboot-logback-demo</span></span>
<span class="line"><span>debug: false</span></span></code></pre></div><ul><li>Spring-logback.xml</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 日志根目录--&gt;</span></span>
<span class="line"><span>    &lt;springProperty scope=&quot;context&quot; name=&quot;LOG_HOME&quot; source=&quot;logging.path&quot; defaultValue=&quot;/data/logs/springboot-logback-demo&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 日志级别 --&gt;</span></span>
<span class="line"><span>    &lt;springProperty scope=&quot;context&quot; name=&quot;LOG_ROOT_LEVEL&quot; source=&quot;logging.level.root&quot; defaultValue=&quot;DEBUG&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--  标识这个&quot;STDOUT&quot; 将会添加到这个logger --&gt;</span></span>
<span class="line"><span>    &lt;springProperty scope=&quot;context&quot; name=&quot;STDOUT&quot; source=&quot;log.stdout&quot; defaultValue=&quot;STDOUT&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 日志文件名称--&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;LOG_PREFIX&quot; value=&quot;spring-boot-logback&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 日志文件编码--&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;LOG_CHARSET&quot; value=&quot;UTF-8&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 日志文件路径+日期--&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;LOG_DIR&quot; value=&quot;\${LOG_HOME}/%d{yyyyMMdd}&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--对日志进行格式化--&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;LOG_MSG&quot; value=&quot;- | [%X{requestUUID}] | [%d{yyyyMMdd HH:mm:ss.SSS}] | [%level] | [\${HOSTNAME}] | [%thread] | [%logger{36}] | --&gt; %msg|%n &quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--文件大小，默认10MB--&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;MAX_FILE_SIZE&quot; value=&quot;50MB&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 配置日志的滚动时间 ，表示只保留最近 10 天的日志--&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;MAX_HISTORY&quot; value=&quot;10&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--输出到控制台--&gt;</span></span>
<span class="line"><span>    &lt;appender name=&quot;STDOUT&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- 输出的日志内容格式化--&gt;</span></span>
<span class="line"><span>        &lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&gt;</span></span>
<span class="line"><span>            &lt;pattern&gt;\${LOG_MSG}&lt;/pattern&gt;</span></span>
<span class="line"><span>        &lt;/layout&gt;</span></span>
<span class="line"><span>    &lt;/appender&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--输出到文件--&gt;</span></span>
<span class="line"><span>    &lt;appender name=&quot;0&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;/appender&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 定义 ALL 日志的输出方式:--&gt;</span></span>
<span class="line"><span>    &lt;appender name=&quot;FILE_ALL&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>        &lt;!--日志文件路径，日志文件名称--&gt;</span></span>
<span class="line"><span>        &lt;File&gt;\${LOG_HOME}/all_\${LOG_PREFIX}.log&lt;/File&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- 设置滚动策略，当天的日志大小超过 \${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB --&gt;</span></span>
<span class="line"><span>        &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            &lt;!--日志文件路径，新的 ALL 日志文件名称，“ i ” 是个变量 --&gt;</span></span>
<span class="line"><span>            &lt;FileNamePattern&gt;\${LOG_DIR}/all_\${LOG_PREFIX}%i.log&lt;/FileNamePattern&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            &lt;!-- 配置日志的滚动时间 ，表示只保留最近 10 天的日志--&gt;</span></span>
<span class="line"><span>            &lt;MaxHistory&gt;\${MAX_HISTORY}&lt;/MaxHistory&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            &lt;!--当天的日志大小超过 \${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB--&gt;</span></span>
<span class="line"><span>            &lt;timeBasedFileNamingAndTriggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP&quot;&gt;</span></span>
<span class="line"><span>                &lt;maxFileSize&gt;\${MAX_FILE_SIZE}&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>            &lt;/timeBasedFileNamingAndTriggeringPolicy&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- 输出的日志内容格式化--&gt;</span></span>
<span class="line"><span>        &lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&gt;</span></span>
<span class="line"><span>            &lt;pattern&gt;\${LOG_MSG}&lt;/pattern&gt;</span></span>
<span class="line"><span>        &lt;/layout&gt;</span></span>
<span class="line"><span>    &lt;/appender&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 定义 ERROR 日志的输出方式:--&gt;</span></span>
<span class="line"><span>    &lt;appender name=&quot;FILE_ERROR&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- 下面为配置只输出error级别的日志 --&gt;</span></span>
<span class="line"><span>        &lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&gt;</span></span>
<span class="line"><span>            &lt;level&gt;ERROR&lt;/level&gt;</span></span>
<span class="line"><span>            &lt;OnMismatch&gt;DENY&lt;/OnMismatch&gt;</span></span>
<span class="line"><span>            &lt;OnMatch&gt;ACCEPT&lt;/OnMatch&gt;</span></span>
<span class="line"><span>        &lt;/filter&gt;</span></span>
<span class="line"><span>        &lt;!--日志文件路径，日志文件名称--&gt;</span></span>
<span class="line"><span>        &lt;File&gt;\${LOG_HOME}/err_\${LOG_PREFIX}.log&lt;/File&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- 设置滚动策略，当天的日志大小超过 \${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB --&gt;</span></span>
<span class="line"><span>        &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            &lt;!--日志文件路径，新的 ERR 日志文件名称，“ i ” 是个变量 --&gt;</span></span>
<span class="line"><span>            &lt;FileNamePattern&gt;\${LOG_DIR}/err_\${LOG_PREFIX}%i.log&lt;/FileNamePattern&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            &lt;!-- 配置日志的滚动时间 ，表示只保留最近 10 天的日志--&gt;</span></span>
<span class="line"><span>            &lt;MaxHistory&gt;\${MAX_HISTORY}&lt;/MaxHistory&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            &lt;!--当天的日志大小超过 \${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB--&gt;</span></span>
<span class="line"><span>            &lt;timeBasedFileNamingAndTriggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP&quot;&gt;</span></span>
<span class="line"><span>                &lt;maxFileSize&gt;\${MAX_FILE_SIZE}&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>            &lt;/timeBasedFileNamingAndTriggeringPolicy&gt;</span></span>
<span class="line"><span>        &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- 输出的日志内容格式化--&gt;</span></span>
<span class="line"><span>        &lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&gt;</span></span>
<span class="line"><span>            &lt;Pattern&gt;\${LOG_MSG}&lt;/Pattern&gt;</span></span>
<span class="line"><span>        &lt;/layout&gt;</span></span>
<span class="line"><span>    &lt;/appender&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- additivity 设为false,则logger内容不附加至root ，配置以配置包下的所有类的日志的打印，级别是 ERROR--&gt;</span></span>
<span class="line"><span>    &lt;logger name=&quot;org.springframework&quot;     level=&quot;ERROR&quot; /&gt;</span></span>
<span class="line"><span>    &lt;logger name=&quot;org.apache.commons&quot;      level=&quot;ERROR&quot; /&gt;</span></span>
<span class="line"><span>    &lt;logger name=&quot;org.apache.zookeeper&quot;    level=&quot;ERROR&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;logger name=&quot;com.alibaba.dubbo.monitor&quot; level=&quot;ERROR&quot;/&gt;</span></span>
<span class="line"><span>    &lt;logger name=&quot;com.alibaba.dubbo.remoting&quot; level=&quot;ERROR&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- \${LOG_ROOT_LEVEL} 日志级别 --&gt;</span></span>
<span class="line"><span>    &lt;root level=&quot;\${LOG_ROOT_LEVEL}&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- 标识这个&quot;\${STDOUT}&quot;将会添加到这个logger --&gt;</span></span>
<span class="line"><span>        &lt;appender-ref ref=&quot;\${STDOUT}&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- FILE_ALL 日志输出添加到 logger --&gt;</span></span>
<span class="line"><span>        &lt;appender-ref ref=&quot;FILE_ALL&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- FILE_ERROR 日志输出添加到 logger --&gt;</span></span>
<span class="line"><span>        &lt;appender-ref ref=&quot;FILE_ERROR&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/root&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><p>Profile 相关的配置可以参考:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>    &lt;include resource=&quot;org/springframework/boot/logging/logback/base.xml&quot; /&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>     &lt;!-- roll by day --&gt;</span></span>
<span class="line"><span>     &lt;appender name=&quot;FILE&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;   </span></span>
<span class="line"><span>    	&lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;   </span></span>
<span class="line"><span>      		&lt;fileNamePattern&gt;logs/springboot-logback-demo.%d{yyyy-MM-dd}.log&lt;/fileNamePattern&gt;   </span></span>
<span class="line"><span>      		&lt;maxHistory&gt;30&lt;/maxHistory&gt;  </span></span>
<span class="line"><span>    	&lt;/rollingPolicy&gt;   </span></span>
<span class="line"><span>    	&lt;encoder&gt;   </span></span>
<span class="line"><span>      		&lt;pattern&gt;%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{35} - %msg%n&lt;/pattern&gt;   </span></span>
<span class="line"><span>    	&lt;/encoder&gt;  </span></span>
<span class="line"><span>  	&lt;/appender&gt; </span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    &lt;!-- dev --&gt;</span></span>
<span class="line"><span>	&lt;logger name=&quot;org.springframework.web&quot; level=&quot;INFO&quot;/&gt;</span></span>
<span class="line"><span>		&lt;root level=&quot;INFO&quot;&gt;</span></span>
<span class="line"><span>		&lt;appender-ref ref=&quot;FILE&quot; /&gt;</span></span>
<span class="line"><span>	&lt;/root&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- test or production --&gt;</span></span>
<span class="line"><span>    &lt;springProfile name=&quot;test,prod&quot;&gt;</span></span>
<span class="line"><span>        &lt;logger name=&quot;org.springframework.web&quot; level=&quot;INFO&quot;/&gt;</span></span>
<span class="line"><span>        &lt;logger name=&quot;com.pdai.springboot&quot; level=&quot;INFO&quot;/&gt;</span></span>
<span class="line"><span>        &lt;root level=&quot;INFO&quot;&gt;</span></span>
<span class="line"><span>        	&lt;appender-ref ref=&quot;FILE&quot; /&gt;</span></span>
<span class="line"><span>        &lt;/root&gt;</span></span>
<span class="line"><span>    &lt;/springProfile&gt;</span></span>
<span class="line"><span>  	 </span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><h3 id="在配置前可以参考如下文章" tabindex="-1">在配置前可以参考如下文章 <a class="header-anchor" href="#在配置前可以参考如下文章" aria-label="Permalink to &quot;在配置前可以参考如下文章&quot;">​</a></h3><p><a href="https://www.cnblogs.com/warking/p/5710303.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/warking/p/5710303.html</a></p><h2 id="參考文档" tabindex="-1">參考文档 <a class="header-anchor" href="#參考文档" aria-label="Permalink to &quot;參考文档&quot;">​</a></h2><ul><li>Logback官网</li></ul><p><a href="https://logback.qos.ch/manual/layouts.html#conversionWord" target="_blank" rel="noreferrer">https://logback.qos.ch/manual/layouts.html#conversionWord</a></p><ul><li>Logback官网 文档</li></ul><p><a href="https://logback.qos.ch/manual/index.html" target="_blank" rel="noreferrer">https://logback.qos.ch/manual/index.html</a></p><ul><li>Logback中Encoder Pattern</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;encoder&gt;</span></span>
<span class="line"><span>	&lt;pattern&gt;%d{HH:mm:ss} [%thread][%X{traceId}] %-5level %logger{36} - %msg%n&lt;/pattern&gt;</span></span>
<span class="line"><span>&lt;/encoder&gt;</span></span></code></pre></div><p><a href="https://logback.qos.ch/manual/layouts.html#conversionWord" target="_blank" rel="noreferrer">https://logback.qos.ch/manual/layouts.html#conversionWord</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,31)]))}const d=a(t,[["render",e]]);export{q as __pageData,d as default};
