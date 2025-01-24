import{_ as n,a as s}from"./chunks/dev-package-log-4.Bz2BiRz3.js";import{_ as l,c as p,ai as t,o as e}from"./chunks/framework.BrYByd3F.js";const o="/vitepress-blog-template/images/develop/package/dev-package-log-1.png",i="/vitepress-blog-template/images/develop/package/dev-package-log-2.png",g="/vitepress-blog-template/images/develop/package/dev-package-log-3.png",c="/vitepress-blog-template/images/develop/package/dev-package-log-6.png",k=JSON.parse('{"title":"常用开发库 - 日志类库详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/package/dev-package-x-log.md","filePath":"develop/package/dev-package-x-log.md","lastUpdated":1737706346000}'),r={name:"develop/package/dev-package-x-log.md"};function u(d,a,h,q,m,b){return e(),p("div",null,a[0]||(a[0]=[t('<h1 id="常用开发库-日志类库详解" tabindex="-1">常用开发库 - 日志类库详解 <a class="header-anchor" href="#常用开发库-日志类库详解" aria-label="Permalink to &quot;常用开发库 - 日志类库详解&quot;">​</a></h1><blockquote><p>Java日志库是最能体现Java库在进化中的渊源关系的，在理解时重点理解日志框架本身和日志门面，以及比较好的实践等。要关注其历史渊源和设计（比如桥接），而具体在使用时查询接口即可， 否则会陷入JUL(Java Util Log), JCL(Commons Logging), Log4j, SLF4J, Logback，Log4j2傻傻分不清楚的境地。@pdai</p></blockquote><h2 id="日志库简介" tabindex="-1">日志库简介 <a class="header-anchor" href="#日志库简介" aria-label="Permalink to &quot;日志库简介&quot;">​</a></h2><blockquote><p>我认为全面理解日志库需要从下面三个角度去理解：@pdai</p></blockquote><ul><li>最重要的一点是 区分<strong>日志系统</strong>和<strong>日志门面</strong>;</li><li>其次是日志库的使用, 包含配置与API使用；配置侧重于日志系统的配置，API使用侧重于日志门面；</li><li>最后是选型，改造和最佳实践等</li></ul><h2 id="日志库之日志系统" tabindex="-1">日志库之日志系统 <a class="header-anchor" href="#日志库之日志系统" aria-label="Permalink to &quot;日志库之日志系统&quot;">​</a></h2><h3 id="java-util-logging-jul" tabindex="-1">java.util.logging (JUL) <a class="header-anchor" href="#java-util-logging-jul" aria-label="Permalink to &quot;java.util.logging (JUL)&quot;">​</a></h3><p>JDK1.4 开始，通过 java.util.logging 提供日志功能。虽然是官方自带的log lib，JUL的使用确不广泛。主要原因:</p><ul><li>JUL从JDK1.4 才开始加入(2002年)，当时各种第三方log lib已经被广泛使用了</li><li>JUL早期存在性能问题，到JDK1.5上才有了不错的进步，但现在和Logback/Log4j2相比还是有所不如</li><li>JUL的功能不如Logback/Log4j2等完善，比如Output Handler就没有Logback/Log4j2的丰富，有时候需要自己来继承定制，又比如默认没有从ClassPath里加载配置文件的功能</li></ul><h3 id="log4j" tabindex="-1">Log4j <a class="header-anchor" href="#log4j" aria-label="Permalink to &quot;Log4j&quot;">​</a></h3><p>Log4j 是 apache 的一个开源项目，创始人 Ceki Gulcu。Log4j 应该说是 Java 领域资格最老，应用最广的日志工具。Log4j 是高度可配置的，并可通过在运行时的外部文件配置。它根据记录的优先级别，并提供机制，以指示记录信息到许多的目的地，诸如：数据库，文件，控制台，UNIX 系统日志等。</p><p>Log4j 中有三个主要组成部分：</p><ul><li>loggers - 负责捕获记录信息。</li><li>appenders - 负责发布日志信息，以不同的首选目的地。</li><li>layouts - 负责格式化不同风格的日志信息。</li></ul><p>官网地址：<a href="http://logging.apache.org/log4j/2.x/" target="_blank" rel="noreferrer">http://logging.apache.org/log4j/2.x/在新窗口打开</a></p><p>Log4j 的短板在于性能，在Logback 和 Log4j2 出来之后，Log4j的使用也减少了。</p><h3 id="logback" tabindex="-1">Logback <a class="header-anchor" href="#logback" aria-label="Permalink to &quot;Logback&quot;">​</a></h3><p>Logback 是由 log4j 创始人 Ceki Gulcu 设计的又一个开源日志组件，是作为 Log4j 的继承者来开发的，提供了性能更好的实现，异步 logger，Filter等更多的特性。</p><p>logback 当前分成三个模块：logback-core、logback-classic 和 logback-access。</p><ul><li>logback-core - 是其它两个模块的基础模块。</li><li>logback-classic - 是 log4j 的一个 改良版本。此外 logback-classic 完整实现 SLF4J API 使你可以很方便地更换成其它日志系统如 log4j 或 JDK14 Logging。</li><li>logback-access - 访问模块与 Servlet 容器集成提供通过 Http 来访问日志的功能。</li></ul><p>官网地址: <a href="http://logback.qos.ch/" target="_blank" rel="noreferrer">http://logback.qos.ch/在新窗口打开</a></p><h3 id="log4j2" tabindex="-1">Log4j2 <a class="header-anchor" href="#log4j2" aria-label="Permalink to &quot;Log4j2&quot;">​</a></h3><p>维护 Log4j 的人为了性能又搞出了 Log4j2。</p><p>Log4j2 和 Log4j1.x 并不兼容，设计上很大程度上模仿了 SLF4J/Logback，性能上也获得了很大的提升。</p><p>Log4j2 也做了 Facade/Implementation 分离的设计，分成了 log4j-api 和 log4j-core。</p><p>官网地址: <a href="http://logging.apache.org/log4j/2.x/" target="_blank" rel="noreferrer">http://logging.apache.org/log4j/2.x/在新窗口打开</a></p><h3 id="log4j-vs-logback-vs-log4j2" tabindex="-1">Log4j vs Logback vs Log4j2 <a class="header-anchor" href="#log4j-vs-logback-vs-log4j2" aria-label="Permalink to &quot;Log4j vs Logback vs Log4j2&quot;">​</a></h3><blockquote><p>从性能上Log4J2要强，但从生态上Logback+SLF4J优先。@pdai</p></blockquote><h4 id="初步对比" tabindex="-1">初步对比 <a class="header-anchor" href="#初步对比" aria-label="Permalink to &quot;初步对比&quot;">​</a></h4><blockquote><p>logback和log4j2都宣称自己是log4j的后代，一个是出于同一个作者，另一个则是在名字上根正苗红。</p></blockquote><p>撇开血统不谈，比较一下log4j2和logback：</p><ul><li>log4j2比logback更新：log4j2的GA版在2014年底才推出，比logback晚了好几年，这期间log4j2确实吸收了slf4j和logback的一些优点（比如日志模板），同时应用了不少的新技术</li><li>由于采用了更先进的锁机制和LMAX Disruptor库，log4j2的性能优于logback，特别是在多线程环境下和使用异步日志的环境下</li><li>二者都支持Filter（应该说是log4j2借鉴了logback的Filter），能够实现灵活的日志记录规则（例如仅对一部分用户记录debug级别的日志）</li><li>二者都支持对配置文件的动态更新</li><li>二者都能够适配slf4j，logback与slf4j的适配应该会更好一些，毕竟省掉了一层适配库</li><li>logback能够自动压缩/删除旧日志</li><li>logback提供了对日志的HTTP访问功能</li><li>log4j2实现了“无垃圾”和“低垃圾”模式。简单地说，log4j2在记录日志时，能够重用对象（如String等），尽可能避免实例化新的临时对象，减少因日志记录产生的垃圾对象，减少垃圾回收带来的性能下降</li><li>log4j2和logback各有长处，总体来说，如果对性能要求比较高的话，log4j2相对还是较优的选择。</li></ul><h4 id="性能对比" tabindex="-1">性能对比 <a class="header-anchor" href="#性能对比" aria-label="Permalink to &quot;性能对比&quot;">​</a></h4><blockquote><p>附上log4j2与logback性能对比的benchmark，这份benchmark是Apache Logging出的，有多大水分不知道，仅供参考</p></blockquote><p>同步写文件日志的benchmark：</p><p><img src="'+o+'" alt="error.图片加载失败"></p><p>异步写日志的benchmark：</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>当然，这些benchmark都是在日志Pattern中不包含Location信息（如日志代码行号 ，调用者信息，Class名/源码文件名等）时测定的，如果输出Location信息的话，性能谁也拯救不了：</p><p><img src="'+g+'" alt="error.图片加载失败"></p><h2 id="日志库之日志门面" tabindex="-1">日志库之日志门面 <a class="header-anchor" href="#日志库之日志门面" aria-label="Permalink to &quot;日志库之日志门面&quot;">​</a></h2><h3 id="common-logging" tabindex="-1">common-logging <a class="header-anchor" href="#common-logging" aria-label="Permalink to &quot;common-logging&quot;">​</a></h3><blockquote><p>common-logging 是 apache 的一个开源项目。也称Jakarta Commons Logging，缩写 JCL。</p></blockquote><p>common-logging 的功能是提供日志功能的 API 接口，本身并不提供日志的具体实现（当然，common-logging 内部有一个 Simple logger 的简单实现，但是功能很弱，直接忽略），而是在运行时动态的绑定日志实现组件来工作（如 log4j、java.util.loggin）。</p><p>官网地址: <a href="http://commons.apache.org/proper/commons-logging/" target="_blank" rel="noreferrer">http://commons.apache.org/proper/commons-logging/在新窗口打开</a></p><h3 id="slf4j" tabindex="-1">slf4j <a class="header-anchor" href="#slf4j" aria-label="Permalink to &quot;slf4j&quot;">​</a></h3><blockquote><p>全称为 Simple Logging Facade for Java，即 java 简单日志门面。</p></blockquote><p>什么，作者又是 Ceki Gulcu！这位大神写了 Log4j、Logback 和 slf4j，专注日志组件开发五百年，一直只能超越自己。</p><p>类似于 Common-Logging，slf4j 是对不同日志框架提供的一个 API 封装，可以在部署的时候不修改任何配置即可接入一种日志实现方案。但是，slf4j 在编译时静态绑定真正的 Log 库。使用 SLF4J 时，如果你需要使用某一种日志实现，那么你必须选择正确的 SLF4J 的 jar 包的集合（各种桥接包）。</p><p>官网地址: <a href="http://www.slf4j.org/" target="_blank" rel="noreferrer">http://www.slf4j.org/在新窗口打开</a></p><p><img src="'+c+`" alt="error.图片加载失败"></p><h3 id="common-logging-vs-slf4j" tabindex="-1">common-logging vs slf4j <a class="header-anchor" href="#common-logging-vs-slf4j" aria-label="Permalink to &quot;common-logging vs slf4j&quot;">​</a></h3><blockquote><p>slf4j 库类似于 Apache Common-Logging。但是，他在编译时静态绑定真正的日志库。这点似乎很麻烦，其实也不过是导入桥接 jar 包而已。</p></blockquote><p>slf4j 一大亮点是提供了更方便的日志记录方式：</p><p>不需要使用logger.isDebugEnabled()来解决日志因为字符拼接产生的性能问题。slf4j 的方式是使用{}作为字符串替换符，形式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>logger.debug(&quot;id: {}, name: {} &quot;, id, name);</span></span></code></pre></div><h2 id="日志库使用方案" tabindex="-1">日志库使用方案 <a class="header-anchor" href="#日志库使用方案" aria-label="Permalink to &quot;日志库使用方案&quot;">​</a></h2><p>使用日志解决方案基本可分为三步：</p><ul><li>引入 jar 包</li><li>配置</li><li>使用 API</li></ul><p>常见的各种日志解决方案的第 2 步和第 3 步基本一样，实施上的差别主要在第 1 步，也就是使用不同的库。</p><h3 id="日志库jar包" tabindex="-1">日志库jar包 <a class="header-anchor" href="#日志库jar包" aria-label="Permalink to &quot;日志库jar包&quot;">​</a></h3><p>这里首选推荐使用 slf4j + logback 的组合。</p><p>如果你习惯了 common-logging，可以选择 common-logging+log4j。</p><p>强烈建议不要直接使用日志实现组件(logback、log4j、java.util.logging)，理由前面也说过，就是无法灵活替换日志库。</p><p>还有一种情况：你的老项目使用了 common-logging，或是直接使用日志实现组件。如果修改老的代码，工作量太大，需要兼容处理。在下文，都将看到各种应对方法。</p><p>注：据我所知，当前仍没有方法可以将 slf4j 桥接到 common-logging。如果我孤陋寡闻了，请不吝赐教。</p><h4 id="slf4j-直接绑定日志组件" tabindex="-1">slf4j 直接绑定日志组件 <a class="header-anchor" href="#slf4j-直接绑定日志组件" aria-label="Permalink to &quot;slf4j 直接绑定日志组件&quot;">​</a></h4><ul><li>slf4j + logback</li></ul><p>添加依赖到 pom.xml 中即可。</p><p>logback-classic-1.0.13.jar 会自动将 slf4j-api-1.7.21.jar 和 logback-core-1.0.13.jar 也添加到你的项目中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;ch.qos.logback&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;logback-classic&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.0.13&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li>slf4j + log4j</li></ul><p>添加依赖到 pom.xml 中即可。</p><p>slf4j-log4j12-1.7.21.jar 会自动将 slf4j-api-1.7.21.jar 和 log4j-1.2.17.jar 也添加到你的项目中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;slf4j-log4j12&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.7.21&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li>slf4j + java.util.logging</li></ul><p>添加依赖到 pom.xml 中即可。</p><p>slf4j-jdk14-1.7.21.jar 会自动将 slf4j-api-1.7.21.jar 也添加到你的项目中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;slf4j-jdk14&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.7.21&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h4 id="slf4j-兼容非-slf4j-日志组件" tabindex="-1">slf4j 兼容非 slf4j 日志组件 <a class="header-anchor" href="#slf4j-兼容非-slf4j-日志组件" aria-label="Permalink to &quot;slf4j 兼容非 slf4j 日志组件&quot;">​</a></h4><p>在介绍解决方案前，先提一个概念——桥接</p><ul><li>什么是桥接呢</li></ul><p>假如你正在开发应用程序所调用的组件当中已经使用了 common-logging，这时你需要 jcl-over-slf4j.jar 把日志信息输出重定向到 slf4j-api，slf4j-api 再去调用 slf4j 实际依赖的日志组件。这个过程称为桥接。下图是官方的 slf4j 桥接策略图：</p><p><img src="`+n+`" alt="error.图片加载失败"></p><p>从图中应该可以看出，无论你的老项目中使用的是 common-logging 或是直接使用 log4j、java.util.logging，都可以使用对应的桥接 jar 包来解决兼容问题。</p><ul><li>slf4j 兼容 common-logging</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;jcl-over-slf4j&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.7.12&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li>slf4j 兼容 log4j</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;log4j-over-slf4j&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.7.12&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li>slf4j 兼容 java.util.logging</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jul-to-slf4j&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.7.12&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li>spring 集成 slf4j</li></ul><p>做 java web 开发，基本离不开 spring 框架。很遗憾，spring 使用的日志解决方案是 common-logging + log4j。</p><p>所以，你需要一个桥接 jar 包：logback-ext-spring。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;ch.qos.logback&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;logback-classic&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.1.3&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.logback-extensions&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;logback-ext-spring&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;0.1.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;jcl-over-slf4j&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.7.12&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h4 id="common-logging-绑定日志组件" tabindex="-1">common-logging 绑定日志组件 <a class="header-anchor" href="#common-logging-绑定日志组件" aria-label="Permalink to &quot;common-logging 绑定日志组件&quot;">​</a></h4><ul><li>common-logging + log4j</li></ul><p>添加依赖到 pom.xml 中即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;commons-logging&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;commons-logging&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;log4j&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;log4j&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;1.2.17&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="日志库配置-针对于日志框架" tabindex="-1">日志库配置 - 针对于日志框架 <a class="header-anchor" href="#日志库配置-针对于日志框架" aria-label="Permalink to &quot;日志库配置 - 针对于日志框架&quot;">​</a></h3><h4 id="log4j2-配置" tabindex="-1">log4j2 配置 <a class="header-anchor" href="#log4j2-配置" aria-label="Permalink to &quot;log4j2 配置&quot;">​</a></h4><p>log4j2 基本配置形式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;;</span></span>
<span class="line"><span>&lt;Configuration&gt;</span></span>
<span class="line"><span>  &lt;Properties&gt;</span></span>
<span class="line"><span>    &lt;Property name=&quot;name1&quot;&gt;value&lt;/property&gt;</span></span>
<span class="line"><span>    &lt;Property name=&quot;name2&quot; value=&quot;value2&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/Properties&gt;</span></span>
<span class="line"><span>  &lt;Filter type=&quot;type&quot; ... /&gt;</span></span>
<span class="line"><span>  &lt;Appenders&gt;</span></span>
<span class="line"><span>    &lt;Appender type=&quot;type&quot; name=&quot;name&quot;&gt;</span></span>
<span class="line"><span>      &lt;Filter type=&quot;type&quot; ... /&gt;</span></span>
<span class="line"><span>    &lt;/Appender&gt;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  &lt;/Appenders&gt;</span></span>
<span class="line"><span>  &lt;Loggers&gt;</span></span>
<span class="line"><span>    &lt;Logger name=&quot;name1&quot;&gt;</span></span>
<span class="line"><span>      &lt;Filter type=&quot;type&quot; ... /&gt;</span></span>
<span class="line"><span>    &lt;/Logger&gt;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    &lt;Root level=&quot;level&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;name&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Root&gt;</span></span>
<span class="line"><span>  &lt;/Loggers&gt;</span></span>
<span class="line"><span>&lt;/Configuration&gt;</span></span></code></pre></div><p>配置示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;Configuration status=&quot;debug&quot; strict=&quot;true&quot; name=&quot;XMLConfigTest&quot;</span></span>
<span class="line"><span>               packages=&quot;org.apache.logging.log4j.test&quot;&gt;</span></span>
<span class="line"><span>  &lt;Properties&gt;</span></span>
<span class="line"><span>    &lt;Property name=&quot;filename&quot;&gt;target/test.log&lt;/Property&gt;</span></span>
<span class="line"><span>  &lt;/Properties&gt;</span></span>
<span class="line"><span>  &lt;Filter type=&quot;ThresholdFilter&quot; level=&quot;trace&quot;/&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;Appenders&gt;</span></span>
<span class="line"><span>    &lt;Appender type=&quot;Console&quot; name=&quot;STDOUT&quot;&gt;</span></span>
<span class="line"><span>      &lt;Layout type=&quot;PatternLayout&quot; pattern=&quot;%m MDC%X%n&quot;/&gt;</span></span>
<span class="line"><span>      &lt;Filters&gt;</span></span>
<span class="line"><span>        &lt;Filter type=&quot;MarkerFilter&quot; marker=&quot;FLOW&quot; onMatch=&quot;DENY&quot; onMismatch=&quot;NEUTRAL&quot;/&gt;</span></span>
<span class="line"><span>        &lt;Filter type=&quot;MarkerFilter&quot; marker=&quot;EXCEPTION&quot; onMatch=&quot;DENY&quot; onMismatch=&quot;ACCEPT&quot;/&gt;</span></span>
<span class="line"><span>      &lt;/Filters&gt;</span></span>
<span class="line"><span>    &lt;/Appender&gt;</span></span>
<span class="line"><span>    &lt;Appender type=&quot;Console&quot; name=&quot;FLOW&quot;&gt;</span></span>
<span class="line"><span>      &lt;Layout type=&quot;PatternLayout&quot; pattern=&quot;%C{1}.%M %m %ex%n&quot;/&gt;&lt;!-- class and line number --&gt;</span></span>
<span class="line"><span>      &lt;Filters&gt;</span></span>
<span class="line"><span>        &lt;Filter type=&quot;MarkerFilter&quot; marker=&quot;FLOW&quot; onMatch=&quot;ACCEPT&quot; onMismatch=&quot;NEUTRAL&quot;/&gt;</span></span>
<span class="line"><span>        &lt;Filter type=&quot;MarkerFilter&quot; marker=&quot;EXCEPTION&quot; onMatch=&quot;ACCEPT&quot; onMismatch=&quot;DENY&quot;/&gt;</span></span>
<span class="line"><span>      &lt;/Filters&gt;</span></span>
<span class="line"><span>    &lt;/Appender&gt;</span></span>
<span class="line"><span>    &lt;Appender type=&quot;File&quot; name=&quot;File&quot; fileName=&quot;\${filename}&quot;&gt;</span></span>
<span class="line"><span>      &lt;Layout type=&quot;PatternLayout&quot;&gt;</span></span>
<span class="line"><span>        &lt;Pattern&gt;%d %p %C{1.} [%t] %m%n&lt;/Pattern&gt;</span></span>
<span class="line"><span>      &lt;/Layout&gt;</span></span>
<span class="line"><span>    &lt;/Appender&gt;</span></span>
<span class="line"><span>  &lt;/Appenders&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;Loggers&gt;</span></span>
<span class="line"><span>    &lt;Logger name=&quot;org.apache.logging.log4j.test1&quot; level=&quot;debug&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>      &lt;Filter type=&quot;ThreadContextMapFilter&quot;&gt;</span></span>
<span class="line"><span>        &lt;KeyValuePair key=&quot;test&quot; value=&quot;123&quot;/&gt;</span></span>
<span class="line"><span>      &lt;/Filter&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;STDOUT&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Logger&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;Logger name=&quot;org.apache.logging.log4j.test2&quot; level=&quot;debug&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;File&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Logger&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;Root level=&quot;trace&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;STDOUT&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Root&gt;</span></span>
<span class="line"><span>  &lt;/Loggers&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>&lt;/Configuration&gt;</span></span></code></pre></div><h4 id="logback-配置" tabindex="-1">logback 配置 <a class="header-anchor" href="#logback-配置" aria-label="Permalink to &quot;logback 配置&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>&lt;!-- logback中一共有5种有效级别，分别是TRACE、DEBUG、INFO、WARN、ERROR，优先级依次从低到高 --&gt;</span></span>
<span class="line"><span>&lt;configuration scan=&quot;true&quot; scanPeriod=&quot;60 seconds&quot; debug=&quot;false&quot;&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;property name=&quot;DIR_NAME&quot; value=&quot;spring-helloworld&quot;/&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;!-- 将记录日志打印到控制台 --&gt;</span></span>
<span class="line"><span>  &lt;appender name=&quot;STDOUT&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;!-- RollingFileAppender begin --&gt;</span></span>
<span class="line"><span>  &lt;appender name=&quot;ALL&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 根据时间来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;fileNamePattern&gt;\${user.dir}/logs/\${DIR_NAME}/all.%d{yyyy-MM-dd}.log&lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>      &lt;maxHistory&gt;30&lt;/maxHistory&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!-- 根据文件大小来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;triggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;maxFileSize&gt;30MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>    &lt;/triggeringPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;ERROR&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 根据时间来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;fileNamePattern&gt;\${user.dir}/logs/\${DIR_NAME}/error.%d{yyyy-MM-dd}.log&lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>      &lt;maxHistory&gt;30&lt;/maxHistory&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!-- 根据文件大小来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;triggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;maxFileSize&gt;10MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>    &lt;/triggeringPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&gt;</span></span>
<span class="line"><span>      &lt;level&gt;ERROR&lt;/level&gt;</span></span>
<span class="line"><span>      &lt;onMatch&gt;ACCEPT&lt;/onMatch&gt;</span></span>
<span class="line"><span>      &lt;onMismatch&gt;DENY&lt;/onMismatch&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;WARN&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 根据时间来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;fileNamePattern&gt;\${user.dir}/logs/\${DIR_NAME}/warn.%d{yyyy-MM-dd}.log&lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>      &lt;maxHistory&gt;30&lt;/maxHistory&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!-- 根据文件大小来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;triggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;maxFileSize&gt;10MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>    &lt;/triggeringPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&gt;</span></span>
<span class="line"><span>      &lt;level&gt;WARN&lt;/level&gt;</span></span>
<span class="line"><span>      &lt;onMatch&gt;ACCEPT&lt;/onMatch&gt;</span></span>
<span class="line"><span>      &lt;onMismatch&gt;DENY&lt;/onMismatch&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;INFO&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 根据时间来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;fileNamePattern&gt;\${user.dir}/logs/\${DIR_NAME}/info.%d{yyyy-MM-dd}.log&lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>      &lt;maxHistory&gt;30&lt;/maxHistory&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!-- 根据文件大小来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;triggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;maxFileSize&gt;10MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>    &lt;/triggeringPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&gt;</span></span>
<span class="line"><span>      &lt;level&gt;INFO&lt;/level&gt;</span></span>
<span class="line"><span>      &lt;onMatch&gt;ACCEPT&lt;/onMatch&gt;</span></span>
<span class="line"><span>      &lt;onMismatch&gt;DENY&lt;/onMismatch&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;DEBUG&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 根据时间来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;fileNamePattern&gt;\${user.dir}/logs/\${DIR_NAME}/debug.%d{yyyy-MM-dd}.log&lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>      &lt;maxHistory&gt;30&lt;/maxHistory&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!-- 根据文件大小来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;triggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;maxFileSize&gt;10MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>    &lt;/triggeringPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&gt;</span></span>
<span class="line"><span>      &lt;level&gt;DEBUG&lt;/level&gt;</span></span>
<span class="line"><span>      &lt;onMatch&gt;ACCEPT&lt;/onMatch&gt;</span></span>
<span class="line"><span>      &lt;onMismatch&gt;DENY&lt;/onMismatch&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;TRACE&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 根据时间来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;fileNamePattern&gt;\${user.dir}/logs/\${DIR_NAME}/trace.%d{yyyy-MM-dd}.log&lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>      &lt;maxHistory&gt;30&lt;/maxHistory&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!-- 根据文件大小来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;triggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;maxFileSize&gt;10MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>    &lt;/triggeringPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&gt;</span></span>
<span class="line"><span>      &lt;level&gt;TRACE&lt;/level&gt;</span></span>
<span class="line"><span>      &lt;onMatch&gt;ACCEPT&lt;/onMatch&gt;</span></span>
<span class="line"><span>      &lt;onMismatch&gt;DENY&lt;/onMismatch&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;SPRING&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 根据时间来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;fileNamePattern&gt;\${user.dir}/logs/\${DIR_NAME}/springframework.%d{yyyy-MM-dd}.log</span></span>
<span class="line"><span>      &lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>      &lt;maxHistory&gt;30&lt;/maxHistory&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!-- 根据文件大小来制定滚动策略 --&gt;</span></span>
<span class="line"><span>    &lt;triggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy&quot;&gt;</span></span>
<span class="line"><span>      &lt;maxFileSize&gt;10MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>    &lt;/triggeringPolicy&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>      &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span>  &lt;!-- RollingFileAppender end --&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;!-- logger begin --&gt;</span></span>
<span class="line"><span>  &lt;!-- 本项目的日志记录，分级打印 --&gt;</span></span>
<span class="line"><span>  &lt;logger name=&quot;org.zp.notes.spring&quot; level=&quot;TRACE&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;STDOUT&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;ERROR&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;WARN&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;INFO&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;DEBUG&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;TRACE&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/logger&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;!-- SPRING框架日志 --&gt;</span></span>
<span class="line"><span>  &lt;logger name=&quot;org.springframework&quot; level=&quot;WARN&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;SPRING&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/logger&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;root level=&quot;TRACE&quot;&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;ALL&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/root&gt;</span></span>
<span class="line"><span>  &lt;!-- logger end --&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><h4 id="log4j-配置" tabindex="-1">log4j 配置 <a class="header-anchor" href="#log4j-配置" aria-label="Permalink to &quot;log4j 配置&quot;">​</a></h4><p>完整的 log4j.xml 参考示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;!DOCTYPE log4j:configuration SYSTEM &quot;log4j.dtd&quot;&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>&lt;log4j:configuration xmlns:log4j=&#39;http://jakarta.apache.org/log4j/&#39;&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;STDOUT&quot; class=&quot;org.apache.log4j.ConsoleAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;layout class=&quot;org.apache.log4j.PatternLayout&quot;&gt;</span></span>
<span class="line"><span>      &lt;param name=&quot;ConversionPattern&quot;</span></span>
<span class="line"><span>             value=&quot;%d{yyyy-MM-dd HH:mm:ss,SSS\\} [%-5p] [%t] %c{36\\}.%M - %m%n&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/layout&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;!--过滤器设置输出的级别--&gt;</span></span>
<span class="line"><span>    &lt;filter class=&quot;org.apache.log4j.varia.LevelRangeFilter&quot;&gt;</span></span>
<span class="line"><span>      &lt;param name=&quot;levelMin&quot; value=&quot;debug&quot;/&gt;</span></span>
<span class="line"><span>      &lt;param name=&quot;levelMax&quot; value=&quot;fatal&quot;/&gt;</span></span>
<span class="line"><span>      &lt;param name=&quot;AcceptOnMatch&quot; value=&quot;true&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;appender name=&quot;ALL&quot; class=&quot;org.apache.log4j.DailyRollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;param name=&quot;File&quot; value=&quot;\${user.dir}/logs/spring-common/jcl/all&quot;/&gt;</span></span>
<span class="line"><span>    &lt;param name=&quot;Append&quot; value=&quot;true&quot;/&gt;</span></span>
<span class="line"><span>    &lt;!-- 每天重新生成日志文件 --&gt;</span></span>
<span class="line"><span>    &lt;param name=&quot;DatePattern&quot; value=&quot;&#39;-&#39;yyyy-MM-dd&#39;.log&#39;&quot;/&gt;</span></span>
<span class="line"><span>    &lt;!-- 每小时重新生成日志文件 --&gt;</span></span>
<span class="line"><span>    &lt;!--&lt;param name=&quot;DatePattern&quot; value=&quot;&#39;-&#39;yyyy-MM-dd-HH&#39;.log&#39;&quot;/&gt;--&gt;</span></span>
<span class="line"><span>    &lt;layout class=&quot;org.apache.log4j.PatternLayout&quot;&gt;</span></span>
<span class="line"><span>      &lt;param name=&quot;ConversionPattern&quot;</span></span>
<span class="line"><span>             value=&quot;%d{yyyy-MM-dd HH:mm:ss,SSS\\} [%-5p] [%t] %c{36\\}.%M - %m%n&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/layout&gt;</span></span>
<span class="line"><span>  &lt;/appender&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;!-- 指定logger的设置，additivity指示是否遵循缺省的继承机制--&gt;</span></span>
<span class="line"><span>  &lt;logger name=&quot;org.zp.notes.spring&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>    &lt;level value=&quot;error&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;STDOUT&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;ALL&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/logger&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;!-- 根logger的设置--&gt;</span></span>
<span class="line"><span>  &lt;root&gt;</span></span>
<span class="line"><span>    &lt;level value=&quot;warn&quot;/&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;STDOUT&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/root&gt;</span></span>
<span class="line"><span>&lt;/log4j:configuration&gt;</span></span></code></pre></div><h3 id="日志库api-针对于日志门面" tabindex="-1">日志库API - 针对于日志门面 <a class="header-anchor" href="#日志库api-针对于日志门面" aria-label="Permalink to &quot;日志库API - 针对于日志门面&quot;">​</a></h3><h4 id="slf4j-用法" tabindex="-1">slf4j 用法 <a class="header-anchor" href="#slf4j-用法" aria-label="Permalink to &quot;slf4j 用法&quot;">​</a></h4><p>使用 slf4j 的 API 很简单。使用LoggerFactory初始化一个Logger实例，然后调用 Logger 对应的打印等级函数就行了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.slf4j.Logger;</span></span>
<span class="line"><span>import org.slf4j.LoggerFactory;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class App {</span></span>
<span class="line"><span>    private static final Logger log = LoggerFactory.getLogger(App.class);</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        String msg = &quot;print log, current level: {}&quot;;</span></span>
<span class="line"><span>        log.trace(msg, &quot;trace&quot;);</span></span>
<span class="line"><span>        log.debug(msg, &quot;debug&quot;);</span></span>
<span class="line"><span>        log.info(msg, &quot;info&quot;);</span></span>
<span class="line"><span>        log.warn(msg, &quot;warn&quot;);</span></span>
<span class="line"><span>        log.error(msg, &quot;error&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="common-logging-用法" tabindex="-1">common-logging 用法 <a class="header-anchor" href="#common-logging-用法" aria-label="Permalink to &quot;common-logging 用法&quot;">​</a></h4><p>common-logging 用法和 slf4j 几乎一样，但是支持的打印等级多了一个更高级别的：fatal。</p><p>此外，common-logging 不支持{}替换参数，你只能选择拼接字符串这种方式了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.apache.commons.logging.Log;</span></span>
<span class="line"><span>import org.apache.commons.logging.LogFactory;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class JclTest {</span></span>
<span class="line"><span>    private static final Log log = LogFactory.getLog(JclTest.class);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        String msg = &quot;print log, current level: &quot;;</span></span>
<span class="line"><span>        log.trace(msg + &quot;trace&quot;);</span></span>
<span class="line"><span>        log.debug(msg + &quot;debug&quot;);</span></span>
<span class="line"><span>        log.info(msg + &quot;info&quot;);</span></span>
<span class="line"><span>        log.warn(msg + &quot;warn&quot;);</span></span>
<span class="line"><span>        log.error(msg + &quot;error&quot;);</span></span>
<span class="line"><span>        log.fatal(msg + &quot;fatal&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="日志库选型与改造" tabindex="-1">日志库选型与改造 <a class="header-anchor" href="#日志库选型与改造" aria-label="Permalink to &quot;日志库选型与改造&quot;">​</a></h2><h3 id="对java日志组件选型的建议" tabindex="-1">对Java日志组件选型的建议 <a class="header-anchor" href="#对java日志组件选型的建议" aria-label="Permalink to &quot;对Java日志组件选型的建议&quot;">​</a></h3><p>slf4j已经成为了Java日志组件的明星选手，可以完美替代JCL，使用JCL桥接库也能完美兼容一切使用JCL作为日志门面的类库，现在的新系统已经没有不使用slf4j作为日志API的理由了。</p><p>日志记录服务方面，log4j在功能上输于logback和log4j2，在性能方面log4j2则全面超越log4j和logback。所以新系统应该在logback和log4j2中做出选择，对于性能有很高要求的系统，应优先考虑log4j2</p><h3 id="对日志架构使用比较好的实践" tabindex="-1">对日志架构使用比较好的实践 <a class="header-anchor" href="#对日志架构使用比较好的实践" aria-label="Permalink to &quot;对日志架构使用比较好的实践&quot;">​</a></h3><h4 id="总是使用log-facade-而不是具体log-implementation" tabindex="-1">总是使用Log Facade，而不是具体Log Implementation <a class="header-anchor" href="#总是使用log-facade-而不是具体log-implementation" aria-label="Permalink to &quot;总是使用Log Facade，而不是具体Log Implementation&quot;">​</a></h4><p>正如之前所说的，使用 Log Facade 可以方便的切换具体的日志实现。而且，如果依赖多个项目，使用了不同的Log Facade，还可以方便的通过 Adapter 转接到同一个实现上。如果依赖项目使用了多个不同的日志实现，就麻烦的多了。</p><p>具体来说，现在推荐使用 Log4j-API 或者 SLF4j，不推荐继续使用 JCL。</p><h4 id="只添加一个-log-implementation依赖" tabindex="-1">只添加一个 Log Implementation依赖 <a class="header-anchor" href="#只添加一个-log-implementation依赖" aria-label="Permalink to &quot;只添加一个 Log Implementation依赖&quot;">​</a></h4><p>毫无疑问，项目中应该只使用一个具体的 Log Implementation，建议使用 Logback 或者Log4j2。如果有依赖的项目中，使用的 Log Facade不支持直接使用当前的 Log Implementation，就添加合适的桥接器依赖。具体的桥接关系可以看上一篇文章的图。</p><h4 id="具体的日志实现依赖应该设置为optional和使用runtime-scope" tabindex="-1">具体的日志实现依赖应该设置为optional和使用runtime scope <a class="header-anchor" href="#具体的日志实现依赖应该设置为optional和使用runtime-scope" aria-label="Permalink to &quot;具体的日志实现依赖应该设置为optional和使用runtime scope&quot;">​</a></h4><p>在项目中，Log Implementation的依赖强烈建议设置为runtime scope，并且设置为optional。例如项目中使用了 SLF4J 作为 Log Facade，然后想使用 Log4j2 作为 Implementation，那么使用 maven 添加依赖的时候这样设置:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.logging.log4j&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;log4j-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;\${log4j.version}&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;scope&gt;runtime&lt;/scope&gt;</span></span>
<span class="line"><span>    &lt;optional&gt;true&lt;/optional&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.logging.log4j&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;log4j-slf4j-impl&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;\${log4j.version}&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;scope&gt;runtime&lt;/scope&gt;</span></span>
<span class="line"><span>    &lt;optional&gt;true&lt;/optional&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>设为optional，依赖不会传递，这样如果你是个lib项目，然后别的项目使用了你这个lib，不会被引入不想要的Log Implementation 依赖；</p><p>Scope设置为runtime，是为了防止开发人员在项目中直接使用Log Implementation中的类，而不适用Log Facade中的类。</p><h4 id="如果有必要-排除依赖的第三方库中的log-impementation依赖" tabindex="-1">如果有必要, 排除依赖的第三方库中的Log Impementation依赖 <a class="header-anchor" href="#如果有必要-排除依赖的第三方库中的log-impementation依赖" aria-label="Permalink to &quot;如果有必要, 排除依赖的第三方库中的Log Impementation依赖&quot;">​</a></h4><p>这是很常见的一个问题，第三方库的开发者未必会把具体的日志实现或者桥接器的依赖设置为optional，然后你的项目继承了这些依赖——具体的日志实现未必是你想使用的，比如他依赖了Log4j，你想使用Logback，这时就很尴尬。另外，如果不同的第三方依赖使用了不同的桥接器和Log实现，也极容易形成环。</p><p>这种情况下，推荐的处理方法，是使用exclude来排除所有的这些Log实现和桥接器的依赖，只保留第三方库里面对Log Facade的依赖。</p><p>比如阿里的JStorm就没有很好的处理这个问题，依赖jstorm会引入对Logback和log4j-over-slf4j的依赖，如果你想在自己的项目中使用Log4j或其他Log实现的话，就需要加上excludes:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.alibaba.jstorm&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jstorm-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.1.1&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;exclusions&gt;</span></span>
<span class="line"><span>        &lt;exclusion&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.slf4j&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;log4j-over-slf4j&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;/exclusion&gt;</span></span>
<span class="line"><span>        &lt;exclusion&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;ch.qos.logback&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;logback-classic&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;/exclusion&gt;</span></span>
<span class="line"><span>    &lt;/exclusions&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h4 id="避免为不会输出的log付出代价" tabindex="-1">避免为不会输出的log付出代价 <a class="header-anchor" href="#避免为不会输出的log付出代价" aria-label="Permalink to &quot;避免为不会输出的log付出代价&quot;">​</a></h4><p>Log库都可以灵活的设置输出界别，所以每一条程序中的log，都是有可能不会被输出的。这时候要注意不要额外的付出代价。</p><p>先看两个有问题的写法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>logger.debug(&quot;start process request, url: &quot; + url);</span></span>
<span class="line"><span>logger.debug(&quot;receive request: {}&quot;, toJson(request));</span></span></code></pre></div><p>第一条是直接做了字符串拼接，所以即使日志级别高于debug也会做一个字符串连接操作；第二条虽然用了SLF4J/Log4j2 中的懒求值方式来避免不必要的字符串拼接开销，但是toJson()这个函数却是都会被调用并且开销更大。</p><p>推荐的写法如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>logger.debug(&quot;start process request, url:{}&quot;, url); // SLF4J/LOG4J2</span></span>
<span class="line"><span>logger.debug(&quot;receive request: {}&quot;, () -&gt; toJson(request)); // LOG4J2</span></span>
<span class="line"><span>logger.debug(() -&gt; &quot;receive request: &quot; + toJson(request)); // LOG4J2</span></span>
<span class="line"><span>if (logger.isDebugEnabled()) { // SLF4J/LOG4J2</span></span>
<span class="line"><span>    logger.debug(&quot;receive request: &quot; + toJson(request)); </span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="日志格式中最好不要使用行号-函数名等字段" tabindex="-1">日志格式中最好不要使用行号，函数名等字段 <a class="header-anchor" href="#日志格式中最好不要使用行号-函数名等字段" aria-label="Permalink to &quot;日志格式中最好不要使用行号，函数名等字段&quot;">​</a></h4><p>原因是，为了获取语句所在的函数名，或者行号，log库的实现都是获取当前的stacktrace，然后分析取出这些信息，而获取stacktrace的代价是很昂贵的。如果有很多的日志输出，就会占用大量的CPU。在没有特殊需要的情况下，建议不要在日志中输出这些这些字段。</p><p>最后， log中不要输出稀奇古怪的字符！</p><p>部分开发人员为了方便看到自己的log，会在log语句中加上醒目的前缀，比如:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>logger.debug(&quot;========================start process request=============&quot;);</span></span></code></pre></div><p>虽然对于自己来说是方便了，但是如果所有人都这样来做的话，那log输出就没法看了！正确的做法是使用grep 来看只自己关心的日志。</p><h3 id="对现有系统日志架构的改造建议" tabindex="-1">对现有系统日志架构的改造建议 <a class="header-anchor" href="#对现有系统日志架构的改造建议" aria-label="Permalink to &quot;对现有系统日志架构的改造建议&quot;">​</a></h3><p>如果现有系统使用JCL作为日志门面，又确实面临着JCL的ClassLoader机制带来的问题，完全可以引入slf4j并通过桥接库将JCL api输出的日志桥接至slf4j，再通过适配库适配至现有的日志输出服务（如log4j），如下图：</p><p><img src="`+s+'" alt="error.图片加载失败"></p><p>这样做不需要任何代码级的改造，就可以解决JCL的ClassLoader带来的问题，但没有办法享受日志模板等slf4j的api带来的优点。不过之后在现系统上开发的新功能就可以使用slf4j的api了，老代码也可以分批进行改造。</p><p>如果现有系统使用JCL作为日志门面，又头疼JCL不支持logback和log4j2等新的日志服务，也可以通过桥接库以slf4j替代JCL，但同样无法直接享受slf4j api的优点。</p><p>如果想要使用slf4j的api，那么就不得不进行代码改造了，当然改造也可以参考1中提到的方式逐步进行。</p><p>如果现系统面临着log4j的性能问题，可以使用Apache Logging提供的log4j到log4j2的桥接库log4j-1.2-api，把通过log4j api输出的日志桥接至log4j2。这样可以最快地使用上log4j2的先进性能，但组件中缺失了slf4j，对后续进行日志架构改造的灵活性有影响。另一种办法是先把log4j桥接至slf4j，再使用slf4j到log4j2的适配库。这样做稍微麻烦了一点，但可以逐步将系统中的日志输出标准化为使用slf4j的api，为后面的工作打好基础。</p><h2 id="参考文档" tabindex="-1">参考文档 <a class="header-anchor" href="#参考文档" aria-label="Permalink to &quot;参考文档&quot;">​</a></h2><p>主要参考整理自：</p><ul><li><a href="https://www.jianshu.com/p/85d141365d39" target="_blank" rel="noreferrer">https://www.jianshu.com/p/85d141365d39</a></li><li><a href="https://blog.csdn.net/Dome%5C_/article/details/98489727" target="_blank" rel="noreferrer">https://blog.csdn.net/Dome\\_/article/details/98489727</a></li><li><a href="https://zhuanlan.zhihu.com/p/24272450" target="_blank" rel="noreferrer">https://zhuanlan.zhihu.com/p/24272450</a></li></ul><p>此外还参考了：</p><ul><li><a href="http://www.slf4j.org/manual.html" target="_blank" rel="noreferrer">http://www.slf4j.org/manual.html</a></li><li><a href="http://logback.qos.ch/" target="_blank" rel="noreferrer">http://logback.qos.ch/</a></li><li><a href="http://logging.apache.org/log4j/1.2/" target="_blank" rel="noreferrer">http://logging.apache.org/log4j/1.2/</a></li><li><a href="http://commons.apache.org/proper/commons-logging/" target="_blank" rel="noreferrer">http://commons.apache.org/proper/commons-logging/</a></li><li><a href="http://blog.csdn.net/yycdaizi/article/details/8276265" target="_blank" rel="noreferrer">http://blog.csdn.net/yycdaizi/article/details/8276265</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',163)]))}const v=l(r,[["render",u]]);export{k as __pageData,v as default};
