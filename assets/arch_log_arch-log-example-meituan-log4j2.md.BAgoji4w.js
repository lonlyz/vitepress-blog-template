import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/arch/log/log-log4j-1.png",t="/vitepress-blog-template/images/arch/log/log-log4j-2.png",i="/vitepress-blog-template/images/arch/log/log-log4j-2-2.png",o="/vitepress-blog-template/images/arch/log/log-log4j-3.png",r="/vitepress-blog-template/images/arch/log/log-log4j-4.png",c="/vitepress-blog-template/images/arch/log/log-log4j-5.png",g="/vitepress-blog-template/images/arch/log/log-log4j-6.png",u="/vitepress-blog-template/images/arch/log/log-log4j-7.png",d="/vitepress-blog-template/images/arch/log/log-log4j-8.png",h="/vitepress-blog-template/images/arch/log/log-log4j-9.png",m="/vitepress-blog-template/images/arch/log/log-log4j-10.png",f="/vitepress-blog-template/images/arch/log/log-log4j-11.png",b="/vitepress-blog-template/images/arch/log/log-log4j-12.png",v="/vitepress-blog-template/images/arch/log/log-log4j-13.png",y="/vitepress-blog-template/images/arch/log/log-log4j-14.png",L="/vitepress-blog-template/images/arch/log/log-log4j-15.png",k="/vitepress-blog-template/images/arch/log/log-log4j-16.png",S="/vitepress-blog-template/images/arch/log/log-log4j-16-2.png",q="/vitepress-blog-template/images/arch/log/log-log4j-17.png",C="/vitepress-blog-template/images/arch/log/log-log4j-18.png",A="/vitepress-blog-template/images/arch/log/log-log4j-19.png",E="/vitepress-blog-template/images/arch/log/log-log4j-20.png",T="/vitepress-blog-template/images/arch/log/log-log4j-21.png",x="/vitepress-blog-template/images/arch/log/log-log4j-22.png",w="/vitepress-blog-template/images/arch/log/log-log4j-22-2.png",M="/vitepress-blog-template/images/arch/log/log-log4j-23.png",_="/vitepress-blog-template/images/arch/log/log-log4j-24.png",P="/vitepress-blog-template/images/arch/log/log-log4j-25.png",I="/vitepress-blog-template/images/arch/log/log-log4j-26.png",U=JSON.parse('{"title":"美团: 日志导致线程Block的这些坑，你不得不防","description":"","frontmatter":{},"headers":[],"relativePath":"arch/log/arch-log-example-meituan-log4j2.md","filePath":"arch/log/arch-log-example-meituan-log4j2.md","lastUpdated":1737706346000}'),B={name:"arch/log/arch-log-example-meituan-log4j2.md"};function j(R,n,O,N,D,F){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="美团-日志导致线程block的这些坑-你不得不防" tabindex="-1">美团: 日志导致线程Block的这些坑，你不得不防 <a class="header-anchor" href="#美团-日志导致线程block的这些坑-你不得不防" aria-label="Permalink to &quot;美团: 日志导致线程Block的这些坑，你不得不防&quot;">​</a></h1><blockquote><p>日志导致线程Block的问题，相信你或许已经遇到过，对此应该深有体会；或许你还没遇到过，但不代表没有问题，只是可能还没有触发而已。关于日志框架（日志门面）建议先理解下这篇<a href="https://pdai.tech/md/develop/package/dev-package-x-log.html" target="_blank" rel="noreferrer">常用开发库 - 日志类库详解</a>。@pdai</p></blockquote><h2 id="_1-前言" tabindex="-1">1. 前言 <a class="header-anchor" href="#_1-前言" aria-label="Permalink to &quot;1\\. 前言&quot;">​</a></h2><blockquote><p>日志对程序的重要性不言而喻。它很“大”，我们在项目中经常通过日志来记录信息和排查问题，相关代码随处可见。它也很“小”，作为辅助工具，日志使用简单、上手快，我们通常不会花费过多精力耗在日志上。但看似不起眼的日志也隐藏着各种各样的“坑”，如果使用不当，它不仅不能帮助我们，反而还可能降低服务性能，甚至拖垮我们的服务。</p></blockquote><p>日志导致线程Block的问题，相信你或许已经遇到过，对此应该深有体会；或许你还没遇到过，但不代表没有问题，只是可能还没有触发而已。本文主要介绍美团统一API网关服务Shepherd（参见《百亿规模API网关服务Shepherd的设计与实现》一文）在实践中所踩过的关于日志导致线程Block的那些“坑”，然后再分享一些避“坑”经验。</p><h2 id="_2-背景" tabindex="-1">2. 背景 <a class="header-anchor" href="#_2-背景" aria-label="Permalink to &quot;2\\. 背景&quot;">​</a></h2><blockquote><p>API网关服务Shepherd基于Java语言开发，使用业界大名鼎鼎的Apache Log4j2作为主要日志框架，同时使用美团内部的XMD-Log SDK和Scribe-Log SDK对日志内容进行处理，日志处理整体流程如下图1所示。业务打印日志时，日志框架基于Logger配置来决定把日志交给XMDFile处理还是Scribe处理。其中，XMDFile是XMD-Log内部提供的日志Appender名称，负责输出日志到本地磁盘，Scribe是Scribe-Log内部提供的日志Appender名称，负责上报日志到远程日志中心。</p></blockquote><p><img src="'+l+`" alt="error.图片加载失败"></p><p>随着业务的快速增长，日志导致的线程Block问题愈发频繁。比如调用后端RPC服务超时，导致调用方大量线程Block；再比如，业务内部输出异常日志导致服务大量线程Block等，这些问题严重影响着服务的稳定性。因此，我们结合项目在过去一段时间暴露出来的各种由于日志导致的线程Block问题，对日志框架存在的稳定性风险因素进行了彻底的排查和修复，并在线下、线上环境进行全方位验证。在此过程中，我们总结了一些日志使用相关的实践经验，希望分享给大家。</p><p>在进入正文前，首先介绍项目当时的运行环境和日志相关配置信息。</p><p><strong>JDK版本</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java version &quot;1.8.0_45&quot;</span></span>
<span class="line"><span>Java(TM) SE Runtime Environment (build 1.8.0_45-b14)</span></span>
<span class="line"><span>Java HotSpot(TM) 64-Bit Server VM (build 25.45-b02, mixed mode)</span></span></code></pre></div><p><strong>日志依赖版本</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.logging.log4j&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;log4j-api&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.7&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.logging.log4j&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;log4j-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.7&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.logging.log4j&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;log4j-slf4j-impl&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.7&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p><strong>日志配置文件</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;configuration status=&quot;warn&quot;&gt;</span></span>
<span class="line"><span>    &lt;appenders&gt;</span></span>
<span class="line"><span>        &lt;Console name=&quot;Console&quot; target=&quot;SYSTEM_OUT&quot; follow=&quot;true&quot;&gt;</span></span>
<span class="line"><span>            &lt;PatternLayout pattern=&quot;%d{yyyy/MM/dd HH:mm:ss.SSS} %t [%p] %c{1} (%F:%L) %msg%n&quot; /&gt;</span></span>
<span class="line"><span>        &lt;/Console&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;XMDFile name=&quot;ShepherdLog&quot; fileName=&quot;shepherd.log&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!--XMDFile异步磁盘日志配置示例--&gt;</span></span>
<span class="line"><span>        &lt;!--默认按天&amp;按512M文件大小切分日志，默认最多保留30个日志文件。--&gt;</span></span>
<span class="line"><span>        &lt;!--注意：fileName前会自动增加文件路径，只配置文件名即可--&gt;</span></span>
<span class="line"><span>        &lt;XMDFile name=&quot;LocalServiceLog&quot; fileName=&quot;request.log&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;Scribe name=&quot;LogCenterSync&quot;&gt;</span></span>
<span class="line"><span>            &lt;!-- 在指定日志名方面，scribeCategory 和 appkey 两者至少存在一种，且 scribeCategory 高于 appkey。--&gt;</span></span>
<span class="line"><span>            &lt;!-- &lt;Property name=&quot;scribeCategory&quot;&gt;data_update_test_lc&lt;/Property&gt; --&gt;</span></span>
<span class="line"><span>            &lt;LcLayout/&gt;</span></span>
<span class="line"><span>        &lt;/Scribe&gt;</span></span>
<span class="line"><span>        &lt;Async name=&quot;LogCenterAsync&quot; blocking=&quot;false&quot;&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;LogCenterSync&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/Async&gt;</span></span>
<span class="line"><span>    &lt;/appenders&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;loggers&gt;</span></span>
<span class="line"><span>        &lt;AsyncLogger name=&quot;com.sankuai.shepherd&quot; level=&quot;info&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;ShepherdLog&quot; level=&quot;warn&quot;/&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;LogCenterAsync&quot; level=&quot;info&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/AsyncLogger&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;root level=&quot;info&quot;&gt;</span></span>
<span class="line"><span>            &lt;!--Console日志是同步、阻塞的，推荐只在本地调试时使用，线上将该配置去掉--&gt;</span></span>
<span class="line"><span>            &lt;!--appender-ref ref=&quot;Console&quot; /--&gt;</span></span>
<span class="line"><span>            &lt;appender-ref ref=&quot;LocalServiceLog&quot;/&gt;</span></span>
<span class="line"><span>            &lt;appender-ref ref=&quot;LogCenterAsync&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/root&gt;</span></span>
<span class="line"><span>    &lt;/loggers&gt;</span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><h2 id="_3-踩过的坑" tabindex="-1">3. 踩过的坑 <a class="header-anchor" href="#_3-踩过的坑" aria-label="Permalink to &quot;3\\. 踩过的坑&quot;">​</a></h2><blockquote><p>本章节主要记录项目过去一段时间，我们所遇到的一系列日志导致的线程Block问题，并逐个深入分析问题根因。</p></blockquote><h3 id="_3-1-日志队列满导致线程block" tabindex="-1">3.1 日志队列满导致线程Block <a class="header-anchor" href="#_3-1-日志队列满导致线程block" aria-label="Permalink to &quot;3.1 日志队列满导致线程Block&quot;">​</a></h3><h4 id="_3-1-1-问题现场" tabindex="-1">3.1.1 问题现场 <a class="header-anchor" href="#_3-1-1-问题现场" aria-label="Permalink to &quot;3.1.1 问题现场&quot;">​</a></h4><p>收到“jvm.thread.blocked.count”告警后立刻通过监控平台查看线程监控指标，当时的线程堆栈如图2和图3所示。</p><p><img src="`+t+'" alt="error.图片加载失败"></p><p><img src="'+i+'" alt="error.图片加载失败"></p><p><img src="'+o+'" alt="error.图片加载失败"></p><p>从Blocked线程堆栈不难看出这跟日志打印相关，而且是INFO级别的日志，遂即登陆机器查看日志是否有异样，发现当时日志量非常大，差不多每两分钟就写满一个500MB的日志文件。</p><p>那大量输出日志和线程Block之间会有怎样的关联呢？接下来本章节将结合如下图4所示的调用链路深入分析线程Block的根因。</p><p><img src="'+r+'" alt="error.图片加载失败"></p><h4 id="_3-1-2-为什么会block线程" tabindex="-1">3.1.2 为什么会Block线程？ <a class="header-anchor" href="#_3-1-2-为什么会block线程" aria-label="Permalink to &quot;3.1.2 为什么会Block线程？&quot;">​</a></h4><p>从Blocked线程堆栈着手分析，查看PrintStream相关代码片段如下图5所示，可以看到被阻塞地方有synchronized同步调用，再结合上文发现每两分钟写满一个500MB日志文件的现象，初步怀疑是日志量过大导致了线程阻塞。</p><p><img src="'+c+`" alt="error.图片加载失败"></p><p>但上述猜测仍有一些值得推敲的地方：</p><ul><li>如果仅仅因为日志量过大就导致线程Block，那日志框架也太不堪重用了，根本没法在高并发、高吞吐业务场景下使用。</li><li>日志配置里明明是输出日志到文件，怎么会输出到Console PrintStream？</li></ul><h4 id="_3-1-3-为什么会输出到console" tabindex="-1">3.1.3 为什么会输出到Console？ <a class="header-anchor" href="#_3-1-3-为什么会输出到console" aria-label="Permalink to &quot;3.1.3 为什么会输出到Console？&quot;">​</a></h4><p>继续沿着线程堆栈调用链路分析，可以看出是AsyncAppender调用append方法追加日志时发生了错误，相关代码片段如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.appender.AsyncAppender</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 内部维护的阻塞队列，队列大小默认是128</span></span>
<span class="line"><span>private final BlockingQueue&lt;LogEvent&gt; queue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void append(final LogEvent logEvent) {</span></span>
<span class="line"><span>    if (!isStarted()) {</span></span>
<span class="line"><span>        throw new IllegalStateException(&quot;AsyncAppender &quot; + getName() + &quot; is not active&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!Constants.FORMAT_MESSAGES_IN_BACKGROUND) { // LOG4J2-898: user may choose</span></span>
<span class="line"><span>        logEvent.getMessage().getFormattedMessage(); // LOG4J2-763: ask message to freeze parameters</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    final Log4jLogEvent memento = Log4jLogEvent.createMemento(logEvent, includeLocation);</span></span>
<span class="line"><span>  	// 日志事件转入异步队列</span></span>
<span class="line"><span>    if (!transfer(memento)) {</span></span>
<span class="line"><span>      	// 执行到这里说明队列满了，入队失败，根据是否blocking执行具体策略</span></span>
<span class="line"><span>        if (blocking) {</span></span>
<span class="line"><span>          	// 阻塞模式，选取特定的策略来处理，策略可能是 &quot;忽略日志&quot;、&quot;日志入队并阻塞&quot;、&quot;当前线程打印日志&quot;</span></span>
<span class="line"><span>            // delegate to the event router (which may discard, enqueue and block, or log in current thread)</span></span>
<span class="line"><span>            final EventRoute route = asyncQueueFullPolicy.getRoute(thread.getId(), memento.getLevel());</span></span>
<span class="line"><span>            route.logMessage(this, memento);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          	// 非阻塞模式，交由 ErrorHandler 处理失败日志</span></span>
<span class="line"><span>            error(&quot;Appender &quot; + getName() + &quot; is unable to write primary appenders. queue is full&quot;);</span></span>
<span class="line"><span>            logToErrorAppenderIfNecessary(false, memento);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean transfer(final LogEvent memento) {</span></span>
<span class="line"><span>    return queue instanceof TransferQueue</span></span>
<span class="line"><span>        ? ((TransferQueue&lt;LogEvent&gt;) queue).tryTransfer(memento)</span></span>
<span class="line"><span>        : queue.offer(memento);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void error(final String msg) {</span></span>
<span class="line"><span>    handler.error(msg);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AsyncAppender顾名思义是个异步Appender，采用异步方式处理日志，在其内部维护了一个BlockingQueue队列，每次处理日志时，都先尝试把Log4jLogEvent事件存入队列中，然后交由后台线程从队列中取出事件并处理（把日志交由AsyncAppender所关联的Appender处理），但队列长度总是有限的，且队列默认大小是128，如果日志量过大或日志异步线程处理不及时，就很可能导致日志队列被打满。</p><p>当日志队列满时，日志框架内部提供了两种处理方式，具体如下：</p><ul><li>如果blocking配置为true，会选择相应的处理策略，默认是SYNCHRONOUS策略，可以在log4j2.component.properties文件中，通过log4j2.AsyncQueueFullPolicy参数配置日志框架提供的其他策略或自定义策略。 <ul><li><strong>DISCARD策略</strong>，直接忽略日志。</li><li><strong>SYNCHRONOUS策略</strong>，当前线程直接发送日志到Appender。</li><li><strong>ENQUEUE策略</strong>，强制阻塞入队。</li></ul></li><li>如果blocking配置为false，则由ErrorHandler和ErrorAppender处理失败日志。日志框架提供了默认的ErrorHandler实现，即DefaultErrorHandler，目前暂不支持业务在XML、JSON等日志配置文件里自定义ErrorHandler。日志框架默认不提供ErrorAppender，业务如有需要可在XML、JSON等日志配置文件里自定义error-ref配置。</li></ul><p>在本项目的日志配置文件中可以看到，AsyncAppender设置了blocking为false，且没有配置error-ref，下面具体分析DefaultErrorHandler。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.appender.DefaultErrorHandler</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static final Logger LOGGER = StatusLogger.getLogger();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static final int MAX_EXCEPTIONS = 3;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 5min 时间间隔</span></span>
<span class="line"><span>private static final long EXCEPTION_INTERVAL = TimeUnit.MINUTES.toNanos(5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int exceptionCount = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private long lastException = System.nanoTime() - EXCEPTION_INTERVAL - 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void error(final String msg) {</span></span>
<span class="line"><span>    final long current = System.nanoTime();</span></span>
<span class="line"><span>  	// 当前时间距离上次异常处理时间间隔超过5min 或者异常处理数小于3次</span></span>
<span class="line"><span>    if (current - lastException &gt; EXCEPTION_INTERVAL || exceptionCount++ &lt; MAX_EXCEPTIONS) {</span></span>
<span class="line"><span>      	// StatusLogger 负责处理</span></span>
<span class="line"><span>        LOGGER.error(msg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    lastException = current;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DefaultErrorHandler内部在处理异常日志时增加了条件限制，只有下述两个条件任一满足时才会处理，从而避免大量异常日志导致的性能问题。</p><ul><li><strong>两条日志处理间隔超过5min</strong>。</li><li><strong>异常日志数量不超过3次</strong>。</li></ul><p>但项目所用日志框架版本的默认实现看起来存在一些不太合理的地方：</p><ul><li>lastException用于标记上次异常的时间戳，该变量可能被多线程访问，无法保证多线程情况下的线程安全。</li><li>exceptionCount用于统计异常日志次数，该变量可能被多线程访问，无法保证多线程情况下的线程安全。</li></ul><p>所以，在多线程场景下，可能有大量异常日志同时被DefaultErrorHandler处理，带来线程安全问题。值得一提的是，该问题已有相关<a href="https://issues.apache.org/jira/browse/LOG4J2-3185" target="_blank" rel="noreferrer">Issue: DefaultErrorHandler can not share values across threads在新窗口打开</a>反馈给社区，并在<a href="https://logging.apache.org/log4j/2.x/changes-report.html#a2.15.0" target="_blank" rel="noreferrer">2.15.0在新窗口打开</a>版本中进行了修复。</p><p>从上述DefaultErrorHandler代码中可以看到，真正负责处理日志的是StatusLogger，继续跟进代码进入logMessage方法，方法执行逻辑如下：</p><ul><li>如果StatusLogger内部注册了StatusListener，则由对应的StatusListener负责处理日志。</li><li>否则由SimpleLogger负责处理日志，直接输出日志到System.err输出流。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.status.StatusLogger</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static final StatusLogger STATUS_LOGGER = new StatusLogger(StatusLogger.class.getName(),</span></span>
<span class="line"><span>            ParameterizedNoReferenceMessageFactory.INSTANCE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// StatusListener</span></span>
<span class="line"><span>private final Collection&lt;StatusListener&gt; listeners = new CopyOnWriteArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private final SimpleLogger logger;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private StatusLogger(final String name, final MessageFactory messageFactory) {</span></span>
<span class="line"><span>    super(name, messageFactory);</span></span>
<span class="line"><span>    this.logger = new SimpleLogger(&quot;StatusLogger&quot;, Level.ERROR, false, true, false, false, Strings.EMPTY,</span></span>
<span class="line"><span>            messageFactory, PROPS, System.err);</span></span>
<span class="line"><span>    this.listenersLevel = Level.toLevel(DEFAULT_STATUS_LEVEL, Level.WARN).intLevel();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Retrieve the StatusLogger.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @return The StatusLogger.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public static StatusLogger getLogger() {</span></span>
<span class="line"><span>    return STATUS_LOGGER;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void logMessage(final String fqcn, final Level level, final Marker marker, final Message msg,</span></span>
<span class="line"><span>        final Throwable t) {</span></span>
<span class="line"><span>    StackTraceElement element = null;</span></span>
<span class="line"><span>    if (fqcn != null) {</span></span>
<span class="line"><span>        element = getStackTraceElement(fqcn, Thread.currentThread().getStackTrace());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    final StatusData data = new StatusData(element, level, msg, t, null);</span></span>
<span class="line"><span>    msgLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        messages.add(data);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        msgLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    if (listeners.size() &gt; 0) {</span></span>
<span class="line"><span>      	// 如果系统注册了 listener，由 StatusConsoleListener 处理日志</span></span>
<span class="line"><span>        for (final StatusListener listener : listeners) {</span></span>
<span class="line"><span>            if (data.getLevel().isMoreSpecificThan(listener.getStatusLevel())) {</span></span>
<span class="line"><span>                listener.log(data);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      	// 否则由 SimpleLogger 处理日志，直接输出到 System.err</span></span>
<span class="line"><span>        logger.logMessage(fqcn, level, marker, msg, t);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述Blocked线程堆栈来看，是StatusConsoleListener负责处理日志，而StatusConsoleListener是StatusListener接口的实现类，那么StatusConsoleListener是如何被创建的？</p><h4 id="_3-1-4-statusconsolelistener是怎么来的" tabindex="-1">3.1.4 StatusConsoleListener是怎么来的？ <a class="header-anchor" href="#_3-1-4-statusconsolelistener是怎么来的" aria-label="Permalink to &quot;3.1.4 StatusConsoleListener是怎么来的？&quot;">​</a></h4><p>通常来说，每个项目都会有一个日志配置文件（如log4j2.xml），该配置对应Log4j2日志框架中的Configuration接口，不同的日志配置文件格式有不同的实现类：</p><ul><li>XmlConfiguration，即XML格式日志配置</li><li>JsonConfiguration，即JSON格式日志配置</li><li>XMDConfiguration，即美团内部日志组件XMD-Log定义的日志配置（XML格式）</li><li>……</li></ul><p>log4j2.xml 示例配置（仅做示例，请勿实际项目中使用该配置）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;Configuration status=&quot;debug&quot; name=&quot;RoutingTest&quot;&gt;</span></span>
<span class="line"><span>  &lt;Properties&gt;</span></span>
<span class="line"><span>    &lt;Property name=&quot;filename&quot;&gt;target/rolling1/rollingtest-$\${sd:type}.log&lt;/Property&gt;</span></span>
<span class="line"><span>  &lt;/Properties&gt;</span></span>
<span class="line"><span>  &lt;ThresholdFilter level=&quot;debug&quot;/&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;Appenders&gt;</span></span>
<span class="line"><span>    &lt;Console name=&quot;STDOUT&quot;&gt;</span></span>
<span class="line"><span>      &lt;PatternLayout pattern=&quot;%m%n&quot;/&gt;</span></span>
<span class="line"><span>      &lt;ThresholdFilter level=&quot;debug&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Console&gt;</span></span>
<span class="line"><span>    &lt;Routing name=&quot;Routing&quot;&gt;</span></span>
<span class="line"><span>      &lt;Routes pattern=&quot;$\${sd:type}&quot;&gt;</span></span>
<span class="line"><span>        &lt;Route&gt;</span></span>
<span class="line"><span>          &lt;RollingFile name=&quot;Rolling-\${sd:type}&quot; fileName=&quot;\${filename}&quot;</span></span>
<span class="line"><span>                       filePattern=&quot;target/rolling1/test1-\${sd:type}.%i.log.gz&quot;&gt;</span></span>
<span class="line"><span>            &lt;PatternLayout&gt;</span></span>
<span class="line"><span>              &lt;pattern&gt;%d %p %c{1.} [%t] %m%n&lt;/pattern&gt;</span></span>
<span class="line"><span>            &lt;/PatternLayout&gt;</span></span>
<span class="line"><span>            &lt;SizeBasedTriggeringPolicy size=&quot;500&quot; /&gt;</span></span>
<span class="line"><span>          &lt;/RollingFile&gt;</span></span>
<span class="line"><span>        &lt;/Route&gt;</span></span>
<span class="line"><span>        &lt;Route ref=&quot;STDOUT&quot; key=&quot;Audit&quot;/&gt;</span></span>
<span class="line"><span>      &lt;/Routes&gt;</span></span>
<span class="line"><span>    &lt;/Routing&gt;</span></span>
<span class="line"><span>  &lt;/Appenders&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  &lt;Loggers&gt;</span></span>
<span class="line"><span>    &lt;Logger name=&quot;EventLogger&quot; level=&quot;info&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;Routing&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Logger&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    &lt;Root level=&quot;error&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;STDOUT&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Root&gt;</span></span>
<span class="line"><span>  &lt;/Loggers&gt;</span></span>
<span class="line"><span>&lt;/Configuration&gt;</span></span></code></pre></div><p>Log4j2在启动时会加载并解析log4j2.xml配置文件，由对应的ConfigurationFactory创建具体Configuration实例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.config.xml.XmlConfiguration</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public XmlConfiguration(final LoggerContext loggerContext, final ConfigurationSource configSource) {</span></span>
<span class="line"><span>    super(loggerContext, configSource);</span></span>
<span class="line"><span>    final File configFile = configSource.getFile();</span></span>
<span class="line"><span>    byte[] buffer = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        final InputStream configStream = configSource.getInputStream();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            buffer = toByteArray(configStream);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            Closer.closeSilently(configStream);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        final InputSource source = new InputSource(new ByteArrayInputStream(buffer));</span></span>
<span class="line"><span>        source.setSystemId(configSource.getLocation());</span></span>
<span class="line"><span>        final DocumentBuilder documentBuilder = newDocumentBuilder(true);</span></span>
<span class="line"><span>        Document document;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          	// 解析 xml 配置文件</span></span>
<span class="line"><span>            document = documentBuilder.parse(source);</span></span>
<span class="line"><span>        } catch (final Exception e) {</span></span>
<span class="line"><span>            // LOG4J2-1127</span></span>
<span class="line"><span>            final Throwable throwable = Throwables.getRootCause(e);</span></span>
<span class="line"><span>            if (throwable instanceof UnsupportedOperationException) {</span></span>
<span class="line"><span>                LOGGER.warn(</span></span>
<span class="line"><span>                        &quot;The DocumentBuilder {} does not support an operation: {}.&quot;</span></span>
<span class="line"><span>                        + &quot;Trying again without XInclude...&quot;,</span></span>
<span class="line"><span>                        documentBuilder, e);</span></span>
<span class="line"><span>                document = newDocumentBuilder(false).parse(source);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                throw e;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        rootElement = document.getDocumentElement();</span></span>
<span class="line"><span>      	// 处理根节点属性配置，即 &lt;Configuration&gt;&lt;/Configuration&gt; 节点</span></span>
<span class="line"><span>        final Map&lt;String, String&gt; attrs = processAttributes(rootNode, rootElement);</span></span>
<span class="line"><span>      	// 创建 StatusConfiguration</span></span>
<span class="line"><span>        final StatusConfiguration statusConfig = new StatusConfiguration().withVerboseClasses(VERBOSE_CLASSES)</span></span>
<span class="line"><span>                .withStatus(getDefaultStatus());</span></span>
<span class="line"><span>        for (final Map.Entry&lt;String, String&gt; entry : attrs.entrySet()) {</span></span>
<span class="line"><span>            final String key = entry.getKey();</span></span>
<span class="line"><span>            final String value = getStrSubstitutor().replace(entry.getValue());</span></span>
<span class="line"><span>          	// 根据配置文件中的 status 属性值，来设置 StatusConfiguration 的 status level</span></span>
<span class="line"><span>            if (&quot;status&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                statusConfig.withStatus(value);</span></span>
<span class="line"><span>            // 根据配置文件中的 dest 属性值，来设置 StatusConfiguration 的日志输出 destination</span></span>
<span class="line"><span>            } else if (&quot;dest&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                statusConfig.withDestination(value);</span></span>
<span class="line"><span>            } else if (&quot;shutdownHook&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                isShutdownHookEnabled = !&quot;disable&quot;.equalsIgnoreCase(value);</span></span>
<span class="line"><span>            } else if (&quot;verbose&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                statusConfig.withVerbosity(value);</span></span>
<span class="line"><span>            } else if (&quot;packages&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                pluginPackages.addAll(Arrays.asList(value.split(Patterns.COMMA_SEPARATOR)));</span></span>
<span class="line"><span>            } else if (&quot;name&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                setName(value);</span></span>
<span class="line"><span>            } else if (&quot;strict&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                strict = Boolean.parseBoolean(value);</span></span>
<span class="line"><span>            } else if (&quot;schema&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                schemaResource = value;</span></span>
<span class="line"><span>            } else if (&quot;monitorInterval&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                final int intervalSeconds = Integer.parseInt(value);</span></span>
<span class="line"><span>                if (intervalSeconds &gt; 0) {</span></span>
<span class="line"><span>                    getWatchManager().setIntervalSeconds(intervalSeconds);</span></span>
<span class="line"><span>                    if (configFile != null) {</span></span>
<span class="line"><span>                        final FileWatcher watcher = new ConfiguratonFileWatcher(this, listeners);</span></span>
<span class="line"><span>                        getWatchManager().watchFile(configFile, watcher);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else if (&quot;advertiser&quot;.equalsIgnoreCase(key)) {</span></span>
<span class="line"><span>                createAdvertiser(value, configSource, buffer, &quot;text/xml&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>     		// 初始化 StatusConfiguration</span></span>
<span class="line"><span>        statusConfig.initialize();</span></span>
<span class="line"><span>    } catch (final SAXException | IOException | ParserConfigurationException e) {</span></span>
<span class="line"><span>        LOGGER.error(&quot;Error parsing &quot; + configSource.getLocation(), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (getName() == null) {</span></span>
<span class="line"><span>        setName(configSource.getLocation());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  	// 忽略以下内容</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.config.status.StatusConfiguration</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static final PrintStream DEFAULT_STREAM = System.out;</span></span>
<span class="line"><span>private static final Level DEFAULT_STATUS = Level.ERROR;</span></span>
<span class="line"><span>private static final Verbosity DEFAULT_VERBOSITY = Verbosity.QUIET;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private final Collection&lt;String&gt; errorMessages = Collections.synchronizedCollection(new LinkedList&lt;String&gt;());</span></span>
<span class="line"><span>// StatusLogger</span></span>
<span class="line"><span>private final StatusLogger logger = StatusLogger.getLogger();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private volatile boolean initialized = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private PrintStream destination = DEFAULT_STREAM;</span></span>
<span class="line"><span>private Level status = DEFAULT_STATUS;</span></span>
<span class="line"><span>private Verbosity verbosity = DEFAULT_VERBOSITY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void initialize() {</span></span>
<span class="line"><span>    if (!this.initialized) {</span></span>
<span class="line"><span>        if (this.status == Level.OFF) {</span></span>
<span class="line"><span>            this.initialized = true;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            final boolean configured = configureExistingStatusConsoleListener();</span></span>
<span class="line"><span>            if (!configured) {</span></span>
<span class="line"><span>              	// 注册新 StatusConsoleListener</span></span>
<span class="line"><span>                registerNewStatusConsoleListener();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            migrateSavedLogMessages();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean configureExistingStatusConsoleListener() {</span></span>
<span class="line"><span>    boolean configured = false;</span></span>
<span class="line"><span>    for (final StatusListener statusListener : this.logger.getListeners()) {</span></span>
<span class="line"><span>        if (statusListener instanceof StatusConsoleListener) {</span></span>
<span class="line"><span>            final StatusConsoleListener listener = (StatusConsoleListener) statusListener;</span></span>
<span class="line"><span>          	// StatusConsoleListener 的 level 以 StatusConfiguration 的 status 为准</span></span>
<span class="line"><span>            listener.setLevel(this.status);</span></span>
<span class="line"><span>            this.logger.updateListenerLevel(this.status);</span></span>
<span class="line"><span>            if (this.verbosity == Verbosity.QUIET) {</span></span>
<span class="line"><span>                listener.setFilters(this.verboseClasses);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            configured = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return configured;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void registerNewStatusConsoleListener() {</span></span>
<span class="line"><span>  	// 创建 StatusConsoleListener，级别以 StatusConfiguration 为准</span></span>
<span class="line"><span>  	// 默认 status 是 DEFAULT_STATUS 即 ERROR</span></span>
<span class="line"><span>  	// 默认 destination 是 DEFAULT_STREAM 即 System.out</span></span>
<span class="line"><span>    final StatusConsoleListener listener = new StatusConsoleListener(this.status, this.destination);</span></span>
<span class="line"><span>    if (this.verbosity == Verbosity.QUIET) {</span></span>
<span class="line"><span>        listener.setFilters(this.verboseClasses);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.logger.registerListener(listener);</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.status.StatusConsoleListener</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Level level = Level.FATAL; // 级别</span></span>
<span class="line"><span>private String[] filters;</span></span>
<span class="line"><span>private final PrintStream stream; // 输出流</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public StatusConsoleListener(final Level level, final PrintStream stream) {</span></span>
<span class="line"><span>    if (stream == null) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;You must provide a stream to use for this listener.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.level = level;</span></span>
<span class="line"><span>    this.stream = stream;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以XmlConfiguration为例，分析上述日志配置解析代码片段可以得知，创建XmlConfiguration时，会先创建StatusConfiguration，随后在初始化StatusConfiguration时创建并注册StatusConsoleListener到StatusLogger的listeners中，日志配置文件中<code>&lt;Configuration&gt;</code>标签的属性值通过XmlConfiguration-&gt;StatusConfiguration-&gt;StatusConsoleListener这样的关系链路最终影响StatusConsoleListener的行为。</p><p>日志配置文件中的<code>&lt;Configuration&gt;</code>标签可以配置属性字段，部分字段如下所示：</p><ul><li><strong>status</strong>，可选值包括OFF、FATAL、ERROR、WARN、INFO、DEBUG、TRACE、ALL，该值决定StatusConsoleListener级别，默认是ERROR。</li><li><strong>dest</strong>，可选值包括out、err、标准的URI路径，该值决定StatusConsoleListener输出流目的地，默认是System.out。</li></ul><p>在本项目的日志配置文件中可以看到并没有设置Configuration的dest属性值，所以日志直接输出到System.out。</p><h4 id="_3-1-5-statuslogger有什么用" tabindex="-1">3.1.5 StatusLogger有什么用？ <a class="header-anchor" href="#_3-1-5-statuslogger有什么用" aria-label="Permalink to &quot;3.1.5 StatusLogger有什么用？&quot;">​</a></h4><p>上文提到StatusConsoleListener是注册在StatusLogger中，StatusLogger在交由StatusListener处理日志前，会判断日志级别，如果级别条件不满足，则忽略此日志，StatusConsoleListener的日志级别默认是ERROR。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.status.StatusLogger</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void logMessage(final String fqcn, final Level level, final Marker marker, final Message msg,</span></span>
<span class="line"><span>        final Throwable t) {</span></span>
<span class="line"><span>    StackTraceElement element = null;</span></span>
<span class="line"><span>    if (fqcn != null) {</span></span>
<span class="line"><span>        element = getStackTraceElement(fqcn, Thread.currentThread().getStackTrace());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    final StatusData data = new StatusData(element, level, msg, t, null);</span></span>
<span class="line"><span>    msgLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        messages.add(data);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        msgLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  	// 系统注册了 listener，由 StatusConsoleListener 处理日志</span></span>
<span class="line"><span>    if (listeners.size() &gt; 0) {</span></span>
<span class="line"><span>        for (final StatusListener listener : listeners) {</span></span>
<span class="line"><span>          	// 比较当前日志的 leve 和 listener 的 level</span></span>
<span class="line"><span>            if (data.getLevel().isMoreSpecificThan(listener.getStatusLevel())) {</span></span>
<span class="line"><span>                listener.log(data);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        logger.logMessage(fqcn, level, marker, msg, t);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们回头再来看下StatusLogger，StatusLogger采用单例模式实现，它输出日志到Console（如System.out或System.err），从上文分析可知，在高并发场景下非常容易导致线程Block，那么它的存在有什么意义呢？</p><p>看官方介绍大意是说，在日志初始化完成前，也有打印日志调试的需求，StatusLogger就是为了解决这个问题而生。</p><p>Troubleshooting tip for the impatient:</p><p>From log4j-2.9 onward, log4j2 will print all internal logging to the console if system property log4j2.debug is defined (with any or no value).</p><p>Prior to log4j-2.9, there are two places where internal logging can be controlled:</p><p>Before a configuration is found, status logger level can be controlled with system property org.apache.logging.log4j.simplelog.StatusLogger.level. After a configuration is found, status logger level can be controlled in the configuration file with the “status” attribute, for example: <code>&lt;Configuration status=“trace”&gt;</code>. Just as it is desirable to be able to diagnose problems in applications, it is frequently necessary to be able to diagnose problems in the logging configuration or in the configured components. Since logging has not been configured, “normal” logging cannot be used during initialization. In addition, normal logging within appenders could create infinite recursion which Log4j will detect and cause the recursive events to be ignored. To accomodate this need, the Log4j 2 API includes a StatusLogger.</p><h4 id="_3-1-6-问题小结" tabindex="-1">3.1.6 问题小结 <a class="header-anchor" href="#_3-1-6-问题小结" aria-label="Permalink to &quot;3.1.6 问题小结&quot;">​</a></h4><p>日志量过大导致AsyncAppender日志队列被打满，新的日志事件无法入队，进而由ErrorHandler处理日志，同时由于ErrorHandler存在线程安全问题，导致大量日志输出到了Console，而Console在输出日志到PrintStream输出流时，存在synchronized同步代码块，所以在高并发场景下导致线程Block。</p><h3 id="_3-2-asyncappender导致线程block" tabindex="-1">3.2 AsyncAppender导致线程Block <a class="header-anchor" href="#_3-2-asyncappender导致线程block" aria-label="Permalink to &quot;3.2 AsyncAppender导致线程Block&quot;">​</a></h3><h4 id="_3-2-1-问题现场" tabindex="-1">3.2.1 问题现场 <a class="header-anchor" href="#_3-2-1-问题现场" aria-label="Permalink to &quot;3.2.1 问题现场&quot;">​</a></h4><p>收到“jvm.thread.blocked.count”告警后立刻通过监控平台查看线程监控指标，当时的线程堆栈如下图6和图7所示。</p><p><img src="`+g+'" alt="error.图片加载失败"></p><p><img src="'+u+'" alt="error.图片加载失败"></p><p>从Blocked线程堆栈不难看出是跟日志打印相关，由于是ERROR级别日志，查看具体报错日志，发现有两种业务异常，分别如下图8和图9所示：</p><p><img src="'+d+'" alt="error.图片加载失败"></p><p><img src="'+h+'" alt="error.图片加载失败"></p><p>这些业务异常会是导致线程Block的幕后元凶吗？接下来本章节将结合如下图10所示的调用链路深入分析线程Block的根因。</p><p><img src="'+m+'" alt="error.图片加载失败"></p><h4 id="_3-2-2-为什么会block线程" tabindex="-1">3.2.2 为什么会Block线程？ <a class="header-anchor" href="#_3-2-2-为什么会block线程" aria-label="Permalink to &quot;3.2.2 为什么会Block线程？&quot;">​</a></h4><p>从Blocked线程堆栈中可以看出，线程阻塞在类加载流程上，查看WebAppClassLoader相关代码片段如下图11所示，发现加载类时确实会根据类名来加synchronized同步块，因此初步猜测是类加载导致线程Block。</p><p><img src="'+f+`" alt="error.图片加载失败"></p><p>但上述猜测还有一些值得推敲的地方：</p><ul><li>项目代码里只是普通地输出一条ERROR日志而已，为何会触发类加载？</li><li>通常情况下类加载几乎不会触发线程Block，不然一个项目要加载成千上万个类，如果因为加载类就导致Block，那项目就没法正常运行了。</li></ul><h4 id="_3-2-3-为什么会触发类加载" tabindex="-1">3.2.3 为什么会触发类加载？ <a class="header-anchor" href="#_3-2-3-为什么会触发类加载" aria-label="Permalink to &quot;3.2.3 为什么会触发类加载？&quot;">​</a></h4><p>继续从Blocked线程堆栈着手分析，查看堆栈中的ThrowableProxy相关代码，发现其构造函数会遍历整个异常堆栈中的所有堆栈元素，最终获取所有堆栈元素类所在的JAR名称和版本信息。具体流程如下：</p><ul><li>首先获取堆栈元素的类名称。</li><li>再通过loadClass的方式获取对应的Class对象。</li><li>进一步获取该类所在的JAR信息，从CodeSource中获取JAR名称，从Package中获取JAR版本。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.impl.ThrowableProxy</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>private ThrowableProxy(final Throwable throwable, final Set&lt;Throwable&gt; visited) {</span></span>
<span class="line"><span>    this.throwable = throwable;</span></span>
<span class="line"><span>    this.name = throwable.getClass().getName();</span></span>
<span class="line"><span>    this.message = throwable.getMessage();</span></span>
<span class="line"><span>    this.localizedMessage = throwable.getLocalizedMessage();</span></span>
<span class="line"><span>    final Map&lt;String, CacheEntry&gt; map = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    final Stack&lt;Class&lt;?&gt;&gt; stack = ReflectionUtil.getCurrentStackTrace();</span></span>
<span class="line"><span>  	// 获取堆栈扩展信息</span></span>
<span class="line"><span>    this.extendedStackTrace = this.toExtendedStackTrace(stack, map, null, throwable.getStackTrace());</span></span>
<span class="line"><span>    final Throwable throwableCause = throwable.getCause();</span></span>
<span class="line"><span>    final Set&lt;Throwable&gt; causeVisited = new HashSet&lt;&gt;(1);</span></span>
<span class="line"><span>    this.causeProxy = throwableCause == null ? null : new ThrowableProxy(throwable, stack, map, throwableCause,</span></span>
<span class="line"><span>        visited, causeVisited);</span></span>
<span class="line"><span>    this.suppressedProxies = this.toSuppressedProxies(throwable, visited);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ExtendedStackTraceElement[] toExtendedStackTrace(final Stack&lt;Class&lt;?&gt;&gt; stack, final Map&lt;String, CacheEntry&gt; map,</span></span>
<span class="line"><span>                                                 final StackTraceElement[] rootTrace,</span></span>
<span class="line"><span>                                                 final StackTraceElement[] stackTrace) {</span></span>
<span class="line"><span>    int stackLength;</span></span>
<span class="line"><span>    if (rootTrace != null) {</span></span>
<span class="line"><span>        int rootIndex = rootTrace.length - 1;</span></span>
<span class="line"><span>        int stackIndex = stackTrace.length - 1;</span></span>
<span class="line"><span>        while (rootIndex &gt;= 0 &amp;&amp; stackIndex &gt;= 0 &amp;&amp; rootTrace[rootIndex].equals(stackTrace[stackIndex])) {</span></span>
<span class="line"><span>            --rootIndex;</span></span>
<span class="line"><span>            --stackIndex;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        this.commonElementCount = stackTrace.length - 1 - stackIndex;</span></span>
<span class="line"><span>        stackLength = stackIndex + 1;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        this.commonElementCount = 0;</span></span>
<span class="line"><span>        stackLength = stackTrace.length;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    final ExtendedStackTraceElement[] extStackTrace = new ExtendedStackTraceElement[stackLength];</span></span>
<span class="line"><span>    Class&lt;?&gt; clazz = stack.isEmpty() ? null : stack.peek();</span></span>
<span class="line"><span>    ClassLoader lastLoader = null;</span></span>
<span class="line"><span>    for (int i = stackLength - 1; i &gt;= 0; --i) {</span></span>
<span class="line"><span>      	// 遍历 StackTraceElement</span></span>
<span class="line"><span>        final StackTraceElement stackTraceElement = stackTrace[i];</span></span>
<span class="line"><span>      	// 获取堆栈元素对应的类名称</span></span>
<span class="line"><span>        final String className = stackTraceElement.getClassName();</span></span>
<span class="line"><span>        // The stack returned from getCurrentStack may be missing entries for java.lang.reflect.Method.invoke()</span></span>
<span class="line"><span>        // and its implementation. The Throwable might also contain stack entries that are no longer</span></span>
<span class="line"><span>        // present as those methods have returned.</span></span>
<span class="line"><span>        ExtendedClassInfo extClassInfo;</span></span>
<span class="line"><span>        if (clazz != null &amp;&amp; className.equals(clazz.getName())) {</span></span>
<span class="line"><span>            final CacheEntry entry = this.toCacheEntry(stackTraceElement, clazz, true);</span></span>
<span class="line"><span>            extClassInfo = entry.element;</span></span>
<span class="line"><span>            lastLoader = entry.loader;</span></span>
<span class="line"><span>            stack.pop();</span></span>
<span class="line"><span>            clazz = stack.isEmpty() ? null : stack.peek();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          	// 对加载过的 className 进行缓存，避免重复加载</span></span>
<span class="line"><span>            final CacheEntry cacheEntry = map.get(className);</span></span>
<span class="line"><span>            if (cacheEntry != null) {</span></span>
<span class="line"><span>                final CacheEntry entry = cacheEntry;</span></span>
<span class="line"><span>                extClassInfo = entry.element;</span></span>
<span class="line"><span>                if (entry.loader != null) {</span></span>
<span class="line"><span>                    lastLoader = entry.loader;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>              	// 通过加载类来获取类的扩展信息，如 location 和 version 等</span></span>
<span class="line"><span>                final CacheEntry entry = this.toCacheEntry(stackTraceElement,</span></span>
<span class="line"><span>                    // 获取 Class 对象</span></span>
<span class="line"><span>                    this.loadClass(lastLoader, className), false);</span></span>
<span class="line"><span>                extClassInfo = entry.element;</span></span>
<span class="line"><span>                map.put(stackTraceElement.toString(), entry);</span></span>
<span class="line"><span>                if (entry.loader != null) {</span></span>
<span class="line"><span>                    lastLoader = entry.loader;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        extStackTrace[i] = new ExtendedStackTraceElement(stackTraceElement, extClassInfo);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return extStackTrace;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Construct the CacheEntry from the Class&#39;s information.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param stackTraceElement The stack trace element</span></span>
<span class="line"><span> * @param callerClass       The Class.</span></span>
<span class="line"><span> * @param exact             True if the class was obtained via Reflection.getCallerClass.</span></span>
<span class="line"><span> * @return The CacheEntry.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private CacheEntry toCacheEntry(final StackTraceElement stackTraceElement, final Class&lt;?&gt; callerClass,</span></span>
<span class="line"><span>                                final boolean exact) {</span></span>
<span class="line"><span>    String location = &quot;?&quot;;</span></span>
<span class="line"><span>    String version = &quot;?&quot;;</span></span>
<span class="line"><span>    ClassLoader lastLoader = null;</span></span>
<span class="line"><span>    if (callerClass != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 获取 jar 文件信息</span></span>
<span class="line"><span>            final CodeSource source = callerClass.getProtectionDomain().getCodeSource();</span></span>
<span class="line"><span>            if (source != null) {</span></span>
<span class="line"><span>                final URL locationURL = source.getLocation();</span></span>
<span class="line"><span>                if (locationURL != null) {</span></span>
<span class="line"><span>                    final String str = locationURL.toString().replace(&#39;\\\\&#39;, &#39;/&#39;);</span></span>
<span class="line"><span>                    int index = str.lastIndexOf(&quot;/&quot;);</span></span>
<span class="line"><span>                    if (index &gt;= 0 &amp;&amp; index == str.length() - 1) {</span></span>
<span class="line"><span>                        index = str.lastIndexOf(&quot;/&quot;, index - 1);</span></span>
<span class="line"><span>                        location = str.substring(index + 1);</span></span>
<span class="line"><span>                    } else {</span></span>
<span class="line"><span>                        location = str.substring(index + 1);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (final Exception ex) {</span></span>
<span class="line"><span>            // Ignore the exception.</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    		// 获取类所在 jar 版本信息</span></span>
<span class="line"><span>        final Package pkg = callerClass.getPackage();</span></span>
<span class="line"><span>        if (pkg != null) {</span></span>
<span class="line"><span>            final String ver = pkg.getImplementationVersion();</span></span>
<span class="line"><span>            if (ver != null) {</span></span>
<span class="line"><span>                version = ver;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        lastLoader = callerClass.getClassLoader();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return new CacheEntry(new ExtendedClassInfo(exact, location, version), lastLoader);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码中可以看到，ThrowableProxy#toExtendedStackTrace方法通过Map缓存当前堆栈元素类对应的CacheEntry，来避免重复解析CacheEntry，但是由于Map缓存put操作使用的key来自于StackTraceElement.toString方法，而get操作使用的key却来自于StackTraceElement.getClassName方法，即使对于同一个StackTraceElement而言，其toString和getClassName方法对应的返回结果也不一样，所以此map形同虚设。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// java.lang.StackTraceElement</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>public String getClassName() {</span></span>
<span class="line"><span>    return declaringClass;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public String toString() {</span></span>
<span class="line"><span>    return getClassName() + &quot;.&quot; + methodName +</span></span>
<span class="line"><span>        (isNativeMethod() ? &quot;(Native Method)&quot; :</span></span>
<span class="line"><span>         (fileName != null &amp;&amp; lineNumber &gt;= 0 ?</span></span>
<span class="line"><span>          &quot;(&quot; + fileName + &quot;:&quot; + lineNumber + &quot;)&quot; :</span></span>
<span class="line"><span>          (fileName != null ?  &quot;(&quot;+fileName+&quot;)&quot; : &quot;(Unknown Source)&quot;)));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该问题已有相关<a href="https://issues.apache.org/jira/browse/LOG4J2-2389" target="_blank" rel="noreferrer">Issue: fix the CacheEntry map in ThrowableProxy#toExtendedStackTrace to be put and gotten with same key在新窗口打开</a>反馈给社区，并在<a href="https://logging.apache.org/log4j/2.x/changes-report.html#a2.11.1" target="_blank" rel="noreferrer">2.11.1在新窗口打开</a>版本中修复了该问题。虽然通过让get/put方法使用同一个key来修复缓存的有效性问题，但由于ThrowableProxy对每个Throwable都会创建一个全新的Map，而不是使用全局Map，因此其缓存也仅仅对单个Throwable生效，作用范围非常有限，食之无味，弃之可惜。</p><p>言归正传，通常情况下一个类加载器对于一个类只会加载一次，类加载器内部保存有类缓存，无需重复加载，但目前的现象却是由于类加载而导致线程大量Block，因此必然是有些类加载不了，且不断重复尝试加载，那到底是什么类无法加载呢？</p><h4 id="_3-2-4-到底什么类加载不了" tabindex="-1">3.2.4 到底什么类加载不了？ <a class="header-anchor" href="#_3-2-4-到底什么类加载不了" aria-label="Permalink to &quot;3.2.4 到底什么类加载不了？&quot;">​</a></h4><p>要找到具体是什么类无法加载，归根结底还是要分析业务异常的具体堆栈。</p><p><img src="`+b+'" alt="error.图片加载失败"></p><p><img src="'+v+`" alt="error.图片加载失败"></p><p>对比如图12和图13所示的两份业务异常堆栈，我们可以看到两份堆栈基本相似，且大多数类都是很普通的类，但是唯一不同的地方在于：</p><ul><li>sun.reflect.NativeMethodAccessorImpl（参见图12）。</li><li>sun.reflect.GeneratedMethodAccessor261（参见图13）。</li></ul><p>从字面信息中不难猜测出这与反射调用相关，但问题是这两份堆栈对应的其实是同一份业务代码，为什么会产生两份不同的异常堆栈？</p><p>查阅相关资料得知，这与JVM反射调用相关，JVM对反射调用分两种情况：</p><ul><li>默认使用native方法进行反射操作。</li><li>一定条件下会生成字节码进行反射操作，即生成<code>sun.reflect.GeneratedMethodAccessor&lt;N&gt;</code>类，它是一个反射调用方法的包装类，代理不同的方法，类后缀序号递增。</li></ul><p>JVM反射调用的主要流程是获取MethodAccessor，并由MethodAccessor执行invoke调用，相关代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// java.lang.reflect.Method  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>@CallerSensitive</span></span>
<span class="line"><span>public Object invoke(Object obj, Object... args)</span></span>
<span class="line"><span>    throws IllegalAccessException, IllegalArgumentException,</span></span>
<span class="line"><span>       InvocationTargetException</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (!override) {</span></span>
<span class="line"><span>        if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) {</span></span>
<span class="line"><span>            Class&lt;?&gt; caller = Reflection.getCallerClass();</span></span>
<span class="line"><span>            checkAccess(caller, clazz, obj, modifiers);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MethodAccessor ma = methodAccessor;             // read volatile</span></span>
<span class="line"><span>    if (ma == null) {</span></span>
<span class="line"><span>    		// 获取 MethodAccessor</span></span>
<span class="line"><span>        ma = acquireMethodAccessor();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 通过 MethodAccessor 调用</span></span>
<span class="line"><span>    return ma.invoke(obj, args);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private MethodAccessor acquireMethodAccessor() {</span></span>
<span class="line"><span>    MethodAccessor tmp = null;</span></span>
<span class="line"><span>    if (root != null) tmp = root.getMethodAccessor();</span></span>
<span class="line"><span>    if (tmp != null) {</span></span>
<span class="line"><span>        methodAccessor = tmp;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        // 通过 ReflectionFactory 创建 MethodAccessor</span></span>
<span class="line"><span>        tmp = reflectionFactory.newMethodAccessor(this);</span></span>
<span class="line"><span>        setMethodAccessor(tmp);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return tmp;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当noInflation为false（默认为false）或者反射方法所在类是VM匿名类（类名中包括斜杠“/”）的情况下，ReflectionFactory会返回一个MethodAccessor代理类，即DelegatingMethodAccessorImpl。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// sun.reflect.ReflectionFactory</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public MethodAccessor newMethodAccessor(Method method) {</span></span>
<span class="line"><span>  	// 通过启动参数获取并解析 noInflation 和 inflationThreshold 值</span></span>
<span class="line"><span>  	// noInflation 默认为 false</span></span>
<span class="line"><span>  	// inflationThreshold 默认为15</span></span>
<span class="line"><span>    checkInitted();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (noInflation &amp;&amp; !ReflectUtil.isVMAnonymousClass(method.getDeclaringClass())) {</span></span>
<span class="line"><span>        return new MethodAccessorGenerator().</span></span>
<span class="line"><span>            generateMethod(method.getDeclaringClass(),</span></span>
<span class="line"><span>                           method.getName(),</span></span>
<span class="line"><span>                           method.getParameterTypes(),</span></span>
<span class="line"><span>                           method.getReturnType(),</span></span>
<span class="line"><span>                           method.getExceptionTypes(),</span></span>
<span class="line"><span>                           method.getModifiers());</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        NativeMethodAccessorImpl acc =</span></span>
<span class="line"><span>            new NativeMethodAccessorImpl(method);</span></span>
<span class="line"><span>        DelegatingMethodAccessorImpl res =</span></span>
<span class="line"><span>            new DelegatingMethodAccessorImpl(acc);</span></span>
<span class="line"><span>        acc.setParent(res);</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      	// 返回代理 DelegatingMethodAccessorImpl</span></span>
<span class="line"><span>        return res;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static void checkInitted() {</span></span>
<span class="line"><span>    if (initted) return;</span></span>
<span class="line"><span>    AccessController.doPrivileged(</span></span>
<span class="line"><span>        new PrivilegedAction&lt;Void&gt;() {</span></span>
<span class="line"><span>            public Void run() {</span></span>
<span class="line"><span>                // Tests to ensure the system properties table is fully</span></span>
<span class="line"><span>                // initialized. This is needed because reflection code is</span></span>
<span class="line"><span>                // called very early in the initialization process (before</span></span>
<span class="line"><span>                // command-line arguments have been parsed and therefore</span></span>
<span class="line"><span>                // these user-settable properties installed.) We assume that</span></span>
<span class="line"><span>                // if System.out is non-null then the System class has been</span></span>
<span class="line"><span>                // fully initialized and that the bulk of the startup code</span></span>
<span class="line"><span>                // has been run.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (System.out == null) {</span></span>
<span class="line"><span>                    // java.lang.System not yet fully initialized</span></span>
<span class="line"><span>                    return null;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                String val = System.getProperty(&quot;sun.reflect.noInflation&quot;);</span></span>
<span class="line"><span>                if (val != null &amp;&amp; val.equals(&quot;true&quot;)) {</span></span>
<span class="line"><span>                    noInflation = true;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                val = System.getProperty(&quot;sun.reflect.inflationThreshold&quot;);</span></span>
<span class="line"><span>                if (val != null) {</span></span>
<span class="line"><span>                    try {</span></span>
<span class="line"><span>                        inflationThreshold = Integer.parseInt(val);</span></span>
<span class="line"><span>                    } catch (NumberFormatException e) {</span></span>
<span class="line"><span>                        throw new RuntimeException(&quot;Unable to parse property sun.reflect.inflationThreshold&quot;, e);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                initted = true;</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>默认情况下DelegatingMethodAccessorImpl代理了NativeMethodAccessorImpl，但是随着反射调用次数的增加，当一个方法被反射调用的次数超过一定的阀值时（inflationThreshold，默认值是15），NativeMethodAccessorImpl会通过字节码生成技术，自动生成MethodAccessorImpl实现类，并修改DelegatingMethodAccessorImpl的内部代理对象指向字节码生成类实例，从而改变后续反射调用逻辑。</p><p><img src="`+y+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// sun.reflect.DelegatingMethodAccessorImpl</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class DelegatingMethodAccessorImpl extends MethodAccessorImpl {</span></span>
<span class="line"><span>  	// 内部代理 MethodAccessorImpl</span></span>
<span class="line"><span>    private MethodAccessorImpl delegate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DelegatingMethodAccessorImpl(MethodAccessorImpl delegate) {</span></span>
<span class="line"><span>        setDelegate(delegate);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object invoke(Object obj, Object[] args)</span></span>
<span class="line"><span>        throws IllegalArgumentException, InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return delegate.invoke(obj, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setDelegate(MethodAccessorImpl delegate) {</span></span>
<span class="line"><span>        this.delegate = delegate;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// sun.reflect.NativeMethodAccessorImpl</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class NativeMethodAccessorImpl extends MethodAccessorImpl {</span></span>
<span class="line"><span>    private final Method method;</span></span>
<span class="line"><span>    private DelegatingMethodAccessorImpl parent;</span></span>
<span class="line"><span>    private int numInvocations;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    NativeMethodAccessorImpl(Method method) {</span></span>
<span class="line"><span>        this.method = method;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object invoke(Object obj, Object[] args)</span></span>
<span class="line"><span>        throws IllegalArgumentException, InvocationTargetException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // We can&#39;t inflate methods belonging to vm-anonymous classes because</span></span>
<span class="line"><span>        // that kind of class can&#39;t be referred to by name, hence can&#39;t be</span></span>
<span class="line"><span>        // found from the generated bytecode.</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      	// 每次调用时 numInvocations 都会自增加1，如果超过阈值（默认是15次），就会修改父类的代理对象，从而改变调用链路</span></span>
<span class="line"><span>        if (++numInvocations &gt; ReflectionFactory.inflationThreshold()</span></span>
<span class="line"><span>                &amp;&amp; !ReflectUtil.isVMAnonymousClass(method.getDeclaringClass())) {</span></span>
<span class="line"><span>            MethodAccessorImpl acc = (MethodAccessorImpl)</span></span>
<span class="line"><span>              	// 动态生成字节码，优化反射调用速度</span></span>
<span class="line"><span>                new MethodAccessorGenerator().</span></span>
<span class="line"><span>                    generateMethod(method.getDeclaringClass(),</span></span>
<span class="line"><span>                                   method.getName(),</span></span>
<span class="line"><span>                                   method.getParameterTypes(),</span></span>
<span class="line"><span>                                   method.getReturnType(),</span></span>
<span class="line"><span>                                   method.getExceptionTypes(),</span></span>
<span class="line"><span>                                   method.getModifiers());</span></span>
<span class="line"><span>          	// 修改父代理类的代理对象</span></span>
<span class="line"><span>            parent.setDelegate(acc);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return invoke0(method, obj, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setParent(DelegatingMethodAccessorImpl parent) {</span></span>
<span class="line"><span>        this.parent = parent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static native Object invoke0(Method m, Object obj, Object[] args);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从<code>MethodAccessorGenerator#generateName</code>方法可以看到，字节码生成的类名称规则是<code>sun.reflect.GeneratedConstructorAccessor&lt;N&gt;</code>，其中N是从0开始的递增数字，且生成类是由DelegatingClassLoader类加载器定义，所以其他类加载器无法加载该类，也就无法生成类缓存数据，从而导致每次加载类时都需要遍历JarFile，极大地降低了类查找速度，且类加载过程是synchronized同步调用，在高并发情况下会更加恶化，从而导致线程Block。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// sun.reflect.MethodAccessorGenerator</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public MethodAccessor generateMethod(Class&lt;?&gt; declaringClass,</span></span>
<span class="line"><span>                                     String   name,</span></span>
<span class="line"><span>                                     Class&lt;?&gt;[] parameterTypes,</span></span>
<span class="line"><span>                                     Class&lt;?&gt;   returnType,</span></span>
<span class="line"><span>                                     Class&lt;?&gt;[] checkedExceptions,</span></span>
<span class="line"><span>                                     int modifiers)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return (MethodAccessor) generate(declaringClass,</span></span>
<span class="line"><span>                                     name,</span></span>
<span class="line"><span>                                     parameterTypes,</span></span>
<span class="line"><span>                                     returnType,</span></span>
<span class="line"><span>                                     checkedExceptions,</span></span>
<span class="line"><span>                                     modifiers,</span></span>
<span class="line"><span>                                     false,</span></span>
<span class="line"><span>                                     false,</span></span>
<span class="line"><span>                                     null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private MagicAccessorImpl generate(final Class&lt;?&gt; declaringClass,</span></span>
<span class="line"><span>                                   String name,</span></span>
<span class="line"><span>                                   Class&lt;?&gt;[] parameterTypes,</span></span>
<span class="line"><span>                                   Class&lt;?&gt;   returnType,</span></span>
<span class="line"><span>                                   Class&lt;?&gt;[] checkedExceptions,</span></span>
<span class="line"><span>                                   int modifiers,</span></span>
<span class="line"><span>                                   boolean isConstructor,</span></span>
<span class="line"><span>                                   boolean forSerialization,</span></span>
<span class="line"><span>                                   Class&lt;?&gt; serializationTargetClass)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>	  final String generatedName = generateName(isConstructor, forSerialization);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 忽略以上代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return AccessController.doPrivileged(</span></span>
<span class="line"><span>        new PrivilegedAction&lt;MagicAccessorImpl&gt;() {</span></span>
<span class="line"><span>            public MagicAccessorImpl run() {</span></span>
<span class="line"><span>                    try {</span></span>
<span class="line"><span>                    return (MagicAccessorImpl)</span></span>
<span class="line"><span>                    ClassDefiner.defineClass</span></span>
<span class="line"><span>                            (generatedName,</span></span>
<span class="line"><span>                             bytes,</span></span>
<span class="line"><span>                             0,</span></span>
<span class="line"><span>                             bytes.length,</span></span>
<span class="line"><span>                             declaringClass.getClassLoader()).newInstance();</span></span>
<span class="line"><span>                    } catch (InstantiationException | IllegalAccessException e) {</span></span>
<span class="line"><span>                        throw new InternalError(e);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 生成反射类名，看到了熟悉的 sun.reflect.GeneratedConstructorAccessor&lt;N&gt;</span></span>
<span class="line"><span>private static synchronized String generateName(boolean isConstructor, boolean forSerialization)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (isConstructor) {</span></span>
<span class="line"><span>        if (forSerialization) {</span></span>
<span class="line"><span>            int num = ++serializationConstructorSymnum;</span></span>
<span class="line"><span>            return &quot;sun/reflect/GeneratedSerializationConstructorAccessor&quot; + num;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            int num = ++constructorSymnum;</span></span>
<span class="line"><span>            return &quot;sun/reflect/GeneratedConstructorAccessor&quot; + num;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        int num = ++methodSymnum;</span></span>
<span class="line"><span>        return &quot;sun/reflect/GeneratedMethodAccessor&quot; + num;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// sun.reflect.ClassDefiner</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>static Class&lt;?&gt; defineClass(String name, byte[] bytes, int off, int len,</span></span>
<span class="line"><span>                            final ClassLoader parentClassLoader)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ClassLoader newLoader = AccessController.doPrivileged(</span></span>
<span class="line"><span>        new PrivilegedAction&lt;ClassLoader&gt;() {</span></span>
<span class="line"><span>            public ClassLoader run() {</span></span>
<span class="line"><span>                    return new DelegatingClassLoader(parentClassLoader);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>  	// 通过 DelegatingClassLoader 类加载器定义生成类</span></span>
<span class="line"><span>    return unsafe.defineClass(name, bytes, off, len, newLoader, null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>那么，JVM反射调用为什么要做这么做</strong>？</p><p>其实这是JVM对反射调用的一种优化手段，在sun.reflect.ReflectionFactory的文档注释里对此做了解释，这是一种“Inflation”机制，加载字节码的调用方式在第一次调用时会比Native调用的速度要慢3~4倍，但是在后续调用时会比Native调用速度快20多倍。为了避免反射调用影响应用的启动速度，所以在反射调用的前几次通过Native方式调用，当超过一定调用次数后使用字节码方式调用，提升反射调用性能。</p><p>注意</p><p>“Inflation” mechanism. Loading bytecodes to implement Method.invoke() and Constructor.newInstance() currently costs 3-4x more than an invocation via native code for the first invocation (though subsequent invocations have been benchmarked to be over 20x faster). Unfortunately this cost increases startup time for certain applications that use reflection intensively (but only once per class) to bootstrap themselves. To avoid this penalty we reuse the existing JVM entry points for the first few invocations of Methods and Constructors and then switch to the bytecode-based implementations.</p><p>至此，总算理清了类加载导致线程Block的直接原因，但这并非根因，业务代码中普普通通地打印一条ERROR日志，为何会导致解析、加载异常堆栈类？</p><h4 id="_3-2-5-为什么要解析异常堆栈" tabindex="-1">3.2.5 为什么要解析异常堆栈？ <a class="header-anchor" href="#_3-2-5-为什么要解析异常堆栈" aria-label="Permalink to &quot;3.2.5 为什么要解析异常堆栈？&quot;">​</a></h4><p><img src="`+L+`" alt="error.图片加载失败"></p><p>AsyncAppender处理日志简要流程如上图15所示，在其内部维护一个BlockingQueue队列和一个AsyncThread线程，处理日志时先把日志转换成Log4jLogEvent快照然后入队，同时AsyncThread线程负责从队列里获取元素来异步处理日志事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.appender.AsyncAppender</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void append(final LogEvent logEvent) {</span></span>
<span class="line"><span>    if (!isStarted()) {</span></span>
<span class="line"><span>        throw new IllegalStateException(&quot;AsyncAppender &quot; + getName() + &quot; is not active&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!Constants.FORMAT_MESSAGES_IN_BACKGROUND) { // LOG4J2-898: user may choose</span></span>
<span class="line"><span>        logEvent.getMessage().getFormattedMessage(); // LOG4J2-763: ask message to freeze parameters</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  	// 创建 日志数据快照</span></span>
<span class="line"><span>    final Log4jLogEvent memento = Log4jLogEvent.createMemento(logEvent, includeLocation);</span></span>
<span class="line"><span>  	// 放入 BlockingQueue 中</span></span>
<span class="line"><span>    if (!transfer(memento)) {</span></span>
<span class="line"><span>        if (blocking) {</span></span>
<span class="line"><span>            // delegate to the event router (which may discard, enqueue and block, or log in current thread)</span></span>
<span class="line"><span>            final EventRoute route = asyncQueueFullPolicy.getRoute(thread.getId(), memento.getLevel());</span></span>
<span class="line"><span>            route.logMessage(this, memento);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            error(&quot;Appender &quot; + getName() + &quot; is unable to write primary appenders. queue is full&quot;);</span></span>
<span class="line"><span>            logToErrorAppenderIfNecessary(false, memento);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AsyncAppender在生成LogEvent的快照Log4jLogEvent时，会先对LogEvent序列化处理统一转换为LogEventProxy，此时不同类型的LogEvent的处理情况稍有差异：</p><ul><li><strong>Log4jLogEvent类型</strong>，先执行Log4jLogEvent#getThrownProxy方法，触发创建ThrowableProxy实例。</li><li><strong>MutableLogEvent类型</strong>，先创建LogEventProxy实例，在构造函数内执行MutableLogEvent#getThrownProxy方法，触发创建ThrowableProxy实例。</li></ul><p>综上，不管LogEvent的实际类型是MutableLogEvent还是Log4jLogEvent，最终都会触发创建ThrowableProxy实例，并在ThrowableProxy构造函数内触发了解析、加载异常堆栈类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.impl.Log4jLogEvent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 生成Log4jLogEvent快照</span></span>
<span class="line"><span>public static Log4jLogEvent createMemento(final LogEvent event, final boolean includeLocation) {</span></span>
<span class="line"><span>    // TODO implement Log4jLogEvent.createMemento()</span></span>
<span class="line"><span>    return deserialize(serialize(event, includeLocation));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static Serializable serialize(final LogEvent event, final boolean includeLocation) {</span></span>
<span class="line"><span>    if (event instanceof Log4jLogEvent) {</span></span>
<span class="line"><span>      	// 确保 ThrowableProxy 已完成初始化</span></span>
<span class="line"><span>        event.getThrownProxy(); // ensure ThrowableProxy is initialized</span></span>
<span class="line"><span>      	// 创建 LogEventProxy</span></span>
<span class="line"><span>        return new LogEventProxy((Log4jLogEvent) event, includeLocation);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  	// 创建 LogEventProxy</span></span>
<span class="line"><span>    return new LogEventProxy(event, includeLocation);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public ThrowableProxy getThrownProxy() {</span></span>
<span class="line"><span>    if (thrownProxy == null &amp;&amp; thrown != null) {</span></span>
<span class="line"><span>        thrownProxy = new ThrowableProxy(thrown);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return thrownProxy;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public LogEventProxy(final LogEvent event, final boolean includeLocation) {</span></span>
<span class="line"><span>    this.loggerFQCN = event.getLoggerFqcn();</span></span>
<span class="line"><span>    this.marker = event.getMarker();</span></span>
<span class="line"><span>    this.level = event.getLevel();</span></span>
<span class="line"><span>    this.loggerName = event.getLoggerName();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    final Message msg = event.getMessage();</span></span>
<span class="line"><span>    this.message = msg instanceof ReusableMessage</span></span>
<span class="line"><span>            ? memento((ReusableMessage) msg)</span></span>
<span class="line"><span>            : msg;</span></span>
<span class="line"><span>    this.timeMillis = event.getTimeMillis();</span></span>
<span class="line"><span>    this.thrown = event.getThrown();</span></span>
<span class="line"><span>  	// 创建 ThrownProxy 实例</span></span>
<span class="line"><span>    this.thrownProxy = event.getThrownProxy();</span></span>
<span class="line"><span>    this.contextData = memento(event.getContextData());</span></span>
<span class="line"><span>    this.contextStack = event.getContextStack();</span></span>
<span class="line"><span>    this.source = includeLocation ? event.getSource() : null;</span></span>
<span class="line"><span>    this.threadId = event.getThreadId();</span></span>
<span class="line"><span>    this.threadName = event.getThreadName();</span></span>
<span class="line"><span>    this.threadPriority = event.getThreadPriority();</span></span>
<span class="line"><span>    this.isLocationRequired = includeLocation;</span></span>
<span class="line"><span>    this.isEndOfBatch = event.isEndOfBatch();</span></span>
<span class="line"><span>    this.nanoTime = event.getNanoTime();</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.impl.MutableLogEvent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public ThrowableProxy getThrownProxy() {</span></span>
<span class="line"><span>    if (thrownProxy == null &amp;&amp; thrown != null) {</span></span>
<span class="line"><span>      	// 构造 ThrowableProxy 时打印异常堆栈</span></span>
<span class="line"><span>        thrownProxy = new ThrowableProxy(thrown);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return thrownProxy;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_3-2-6-问题小结" tabindex="-1">3.2.6 问题小结 <a class="header-anchor" href="#_3-2-6-问题小结" aria-label="Permalink to &quot;3.2.6 问题小结&quot;">​</a></h4><p>Log4j2打印异常日志时，AsyncAppender会先创建日志事件快照，并进一步触发解析、加载异常堆栈类。JVM通过生成字节码的方式优化反射调用性能，但该动态生成的类无法被WebAppClassLoader类加载器加载，因此当大量包含反射调用的异常堆栈被输出到日志时，会频繁地触发类加载，由于类加载过程是synchronized同步加锁的，且每次加载都需要读取文件，速度较慢，从而导致线程Block。</p><h3 id="_3-3-lambda表达式导致线程block" tabindex="-1">3.3 Lambda表达式导致线程Block <a class="header-anchor" href="#_3-3-lambda表达式导致线程block" aria-label="Permalink to &quot;3.3 Lambda表达式导致线程Block&quot;">​</a></h3><h4 id="_3-3-1-问题现场" tabindex="-1">3.3.1 问题现场 <a class="header-anchor" href="#_3-3-1-问题现场" aria-label="Permalink to &quot;3.3.1 问题现场&quot;">​</a></h4><p>收到“jvm.thread.blocked.count”告警后，立刻通过监控平台查看线程监控指标，当时的线程堆栈如下图16和图17所示：</p><p><img src="`+k+'" alt="error.图片加载失败"></p><p><img src="'+S+'" alt="error.图片加载失败"></p><p><img src="'+q+'" alt="error.图片加载失败"></p><p>从Blocked线程堆栈不难看出是和日志打印相关，由于是ERROR级别日志，查看具体报错日志，发现如下图18所示的业务异常。</p><p><img src="'+C+'" alt="error.图片加载失败"></p><p>本案例的Blocked线程堆栈和上述“AsyncAppender导致线程Block”案例一样，那么导致线程Block的罪魁祸首会是业务异常吗？接下来本章节将结合下图19所示的调用链路深入分析线程Block的根因。</p><p><img src="'+A+'" alt="error.图片加载失败"></p><h4 id="_3-3-2-为什么会block线程" tabindex="-1">3.3.2 为什么会Block线程？ <a class="header-anchor" href="#_3-3-2-为什么会block线程" aria-label="Permalink to &quot;3.3.2 为什么会Block线程？&quot;">​</a></h4><p>从Blocked线程堆栈中可以看出，线程阻塞在类加载上，该线程堆栈和上述“AsyncAppender导致线程Block”案例相似，这里不再重复分析。</p><h4 id="_3-3-3-为什么会触发类加载" tabindex="-1">3.3.3 为什么会触发类加载？ <a class="header-anchor" href="#_3-3-3-为什么会触发类加载" aria-label="Permalink to &quot;3.3.3 为什么会触发类加载？&quot;">​</a></h4><p>原因和上述“AsyncAppender导致线程Block”案例相似，这里不再重复分析。</p><h4 id="_3-3-4-到底什么类加载不了" tabindex="-1">3.3.4 到底什么类加载不了？ <a class="header-anchor" href="#_3-3-4-到底什么类加载不了" aria-label="Permalink to &quot;3.3.4 到底什么类加载不了？&quot;">​</a></h4><p>上述“AsyncAppender导致线程Block”案例中，类加载器无法加载由JVM针对反射调用优化所生成的字节码类，本案例是否也是该原因导致，还待进一步具体分析。</p><p>要找到具体是什么类无法加载，归根结底还是要分析业务异常的具体堆栈。从业务堆栈中可以明显看出来，没有任何堆栈元素和JVM反射调用相关，因此排除JVM反射调用原因，但如下的特殊堆栈信息引起了注意：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>com.sankuai.shepherd.core.process.ProcessHandlerFactory$$Lambda$35/1331430278</span></span></code></pre></div><p>从堆栈的关键字<code>$$Lambda$</code>大致能猜测出这是代码里使用了Lambda表达式的缘故，查看代码确实相关部分使用了Lambda表达式，经过断点调试，证实的确无法加载该类。那么，这样的类是怎么来的？</p><p>查阅相关资料得知，Lambda表达式区别于匿名内部类实现，在构建时不会生成class文件，而是在运行时通过invokeDynamic指令动态调用，Lambda表达式的内容会被封装在一个静态方法内，JVM通过ASM字节码技术来动态生成调用类，也就是<code>$$Lambda$</code>这种形式的类，生成类示例如下图20所示：</p><p><img src="'+E+'" alt="error.图片加载失败"></p><p>Lambda表达式的实现原理不是本文重点内容，在此不做过多介绍。项目代码中使用Lambda表达式是再普通不过的事情，但是关于此类的案例却并不多见，实在令人难以置信。继续查阅Lambda表达式相关文档，发现异常堆栈类名包含$$Lambda$这样的关键字，其实是JDK的一个Bug，相关Issue可参考:</p><ul><li>NoClassDefFound error in transforming lambdas</li><li>JVMTI RedefineClasses doesn’t handle anonymous classes properly</li></ul><p>值得一提的是，该Bug在JDK9版本已经修复，实际测试中发现，在JDK8的高版本如8U171等已修复该Bug，异常堆栈中不会有类似<code>$$Lambda$</code>的堆栈信息，示例如下图21所示：</p><p><img src="'+T+'" alt="error.图片加载失败"></p><h4 id="_3-3-5-为什么要解析异常堆栈" tabindex="-1">3.3.5 为什么要解析异常堆栈？ <a class="header-anchor" href="#_3-3-5-为什么要解析异常堆栈" aria-label="Permalink to &quot;3.3.5 为什么要解析异常堆栈？&quot;">​</a></h4><p>原因和上述“AsyncAppender导致线程Block”案例相似，不再重复分析。</p><h4 id="_3-3-6-问题小结" tabindex="-1">3.3.6 问题小结 <a class="header-anchor" href="#_3-3-6-问题小结" aria-label="Permalink to &quot;3.3.6 问题小结&quot;">​</a></h4><p>Log4j2打印异常日志时，AsyncAppender会先创建日志事件快照，并进一步触发解析、加载异常堆栈类。JDK 8低版本中使用Lambda表达式所生成的异常堆栈类无法被WebAppClassLoader类加载器加载，因此，当大量包含Lambda表达式调用的异常堆栈被输出到日志时，会频繁地触发类加载，由于类加载过程是synchronized同步加锁的，且每次加载都需要读取文件，速度较慢，从而导致了线程Block。</p><h3 id="_3-4-asyncloggerconfig导致线程block" tabindex="-1">3.4 AsyncLoggerConfig导致线程Block <a class="header-anchor" href="#_3-4-asyncloggerconfig导致线程block" aria-label="Permalink to &quot;3.4 AsyncLoggerConfig导致线程Block&quot;">​</a></h3><h4 id="_3-4-1-问题现场" tabindex="-1">3.4.1 问题现场 <a class="header-anchor" href="#_3-4-1-问题现场" aria-label="Permalink to &quot;3.4.1 问题现场&quot;">​</a></h4><p>收到“jvm.thread.blocked.count”告警后立刻通过监控平台查看线程监控指标，当时的线程堆栈如下图22和图23所示。</p><p><img src="'+x+'" alt="error.图片加载失败"></p><p><img src="'+w+'" alt="error.图片加载失败"></p><p><img src="'+M+'" alt="error.图片加载失败"></p><p>从Blocked线程堆栈不难看出是和日志打印相关，本案例的业务异常和上述“AsyncAppender导致线程Block”的业务异常一样，这里不再重复介绍。</p><p>那么，到底是什么原因导致线程Block呢？接下来本章节将结合下图24所示的调用链路深入分析线程Block的根因。</p><p><img src="'+_+'" alt="error.图片加载失败"></p><h4 id="_3-4-2-为什么会block线程" tabindex="-1">3.4.2 为什么会Block线程？ <a class="header-anchor" href="#_3-4-2-为什么会block线程" aria-label="Permalink to &quot;3.4.2 为什么会Block线程？&quot;">​</a></h4><p>原因和上述“AsyncAppender导致线程Block”案例相似，这里不再重复分析。</p><h4 id="_3-4-3-为什么会触发类加载" tabindex="-1">3.4.3 为什么会触发类加载？ <a class="header-anchor" href="#_3-4-3-为什么会触发类加载" aria-label="Permalink to &quot;3.4.3 为什么会触发类加载？&quot;">​</a></h4><p>原因和上述“AsyncAppender导致线程Block”案例相似，这里不再重复分析。</p><h4 id="_3-4-4-到底是什么类加载不了" tabindex="-1">3.4.4 到底是什么类加载不了？ <a class="header-anchor" href="#_3-4-4-到底是什么类加载不了" aria-label="Permalink to &quot;3.4.4 到底是什么类加载不了？&quot;">​</a></h4><p>原因和上述“AsyncAppender导致线程Block”案例相似，这里不再重复分析。</p><h4 id="_3-4-5-为什么要解析异常堆栈" tabindex="-1">3.4.5 为什么要解析异常堆栈？ <a class="header-anchor" href="#_3-4-5-为什么要解析异常堆栈" aria-label="Permalink to &quot;3.4.5 为什么要解析异常堆栈？&quot;">​</a></h4><p>在开始分析原因之前，先理清楚Log4j2关于日志的几个重要概念：</p><ul><li><code>&lt;Logger&gt;</code>，日志配置标签，用于XML日志配置文件中，对应Log4j2框架中的LoggerConfig类，同步分发日志事件到对应Appender。</li><li><code>&lt;AsyncLogger&gt;</code>，日志配置标签，用于XML日志配置文件中，对应Log4j2框架中的AsyncLoggerConfig类，内部使用Disruptor队列异步分发日志事件到对应Appender。</li><li><code>Logger</code>，同步日志类，用于创建同步日志实例，同步调用ReliabilityStrategy处理日志。</li><li><code>AsyncLogger</code>，异步日志类，用于创建异步日志实例，内部使用Disruptor队列实现异步调用ReliabilityStrategy处理日志。</li></ul><p>总的来说，<code>&lt;Logger&gt;</code>标签和Logger类是完全不同的两个概念，<code>&lt;AsyncLogger&gt;</code>标签和AsyncLogger类也是完全不同的两个概念，不可混淆。</p><p>由于项目并未配置Log4jContextSelector参数，所以使用的是同步Logger，即通过LoggerFactory.getLogger方法获取的是Logger类实例而不是AsyncLogger类实例，同时由于项目的log4j2.xml配置文件里配置了<code>&lt;AsyncLogger&gt;</code>标签，所以其底层是Logger和AsyncLoggerConfig组合。</p><p>AsyncLoggerConfig处理日志事件简要流程如下图25所示，内部使用Disruptor队列，在生成队列元素时，由translator来负责填充元素字段，并把填充后的元素放入RingBuffer中，于此同时，独立的异步线程从RingBuffer中消费事件，并调用配置在该AsyncLoggerConfig上的Appender处理日志请求。</p><p><img src="'+P+`" alt="error.图片加载失败"></p><p>AsyncLoggerConfig提供了带有Disruptor队列实现的代理类即AsyncLoggerConfigDisruptor，在日志事件进入RingBuffer时，由于项目使用的是ReusableLogEventFactory，所以由MUTABLE_TRANSLATOR负责初始化日志事件，在此过程中会调用getThrownProxy方法创建ThrowableProxy实例，进而在ThrowableProxy构造函数内部触发解析、加载异常堆栈类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.async.AsyncLoggerConfigDisruptor$EventTranslatorTwoArg</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Object responsible for passing on data to a RingBuffer event with a MutableLogEvent.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private static final EventTranslatorTwoArg&lt;Log4jEventWrapper, LogEvent, AsyncLoggerConfig&gt; MUTABLE_TRANSLATOR =</span></span>
<span class="line"><span>        new EventTranslatorTwoArg&lt;Log4jEventWrapper, LogEvent, AsyncLoggerConfig&gt;() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void translateTo(final Log4jEventWrapper ringBufferElement, final long sequence,</span></span>
<span class="line"><span>            final LogEvent logEvent, final AsyncLoggerConfig loggerConfig) {</span></span>
<span class="line"><span>      	// 初始化 Disruptor RingBuffer 日志元素字段</span></span>
<span class="line"><span>        ((MutableLogEvent) ringBufferElement.event).initFrom(logEvent);</span></span>
<span class="line"><span>        ringBufferElement.loggerConfig = loggerConfig;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.impl.MutableLogEvent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void initFrom(final LogEvent event) {</span></span>
<span class="line"><span>    this.loggerFqcn = event.getLoggerFqcn();</span></span>
<span class="line"><span>    this.marker = event.getMarker();</span></span>
<span class="line"><span>    this.level = event.getLevel();</span></span>
<span class="line"><span>    this.loggerName = event.getLoggerName();</span></span>
<span class="line"><span>    this.timeMillis = event.getTimeMillis();</span></span>
<span class="line"><span>    this.thrown = event.getThrown();</span></span>
<span class="line"><span>  	// 触发创建 ThrowableProxy 实例</span></span>
<span class="line"><span>    this.thrownProxy = event.getThrownProxy();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // NOTE: this ringbuffer event SHOULD NOT keep a reference to the specified</span></span>
<span class="line"><span>    // thread-local MutableLogEvent&#39;s context data, because then two threads would call</span></span>
<span class="line"><span>    // ReadOnlyStringMap.clear() on the same shared instance, resulting in data corruption.</span></span>
<span class="line"><span>    this.contextData.putAll(event.getContextData());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.contextStack = event.getContextStack();</span></span>
<span class="line"><span>    this.source = event.isIncludeLocation() ? event.getSource() : null;</span></span>
<span class="line"><span>    this.threadId = event.getThreadId();</span></span>
<span class="line"><span>    this.threadName = event.getThreadName();</span></span>
<span class="line"><span>    this.threadPriority = event.getThreadPriority();</span></span>
<span class="line"><span>    this.endOfBatch = event.isEndOfBatch();</span></span>
<span class="line"><span>    this.includeLocation = event.isIncludeLocation();</span></span>
<span class="line"><span>    this.nanoTime = event.getNanoTime();</span></span>
<span class="line"><span>    setMessage(event.getMessage());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public ThrowableProxy getThrownProxy() {</span></span>
<span class="line"><span>    if (thrownProxy == null &amp;&amp; thrown != null) {</span></span>
<span class="line"><span>      	// 构造 ThrowableProxy 时打印异常堆栈</span></span>
<span class="line"><span>        thrownProxy = new ThrowableProxy(thrown);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return thrownProxy;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_3-4-6-问题小结" tabindex="-1">3.4.6 问题小结 <a class="header-anchor" href="#_3-4-6-问题小结" aria-label="Permalink to &quot;3.4.6 问题小结&quot;">​</a></h4><p>Log4j2打印异常日志时，AsyncLoggerConfig会初始化Disruptor RingBuffer日志元素字段，并进一步触发解析、加载异常堆栈类。JVM通过生成字节码的方式优化反射调用性能，但该动态生成的类无法被WebAppClassLoader类加载器加载，因此当大量包含反射调用的异常堆栈被输出到日志时，会频繁地触发类加载，由于类加载过程是synchronized同步加锁的，且每次加载都需要读取文件，速度较慢，从而导致线程Block。</p><h2 id="_4-避坑指南" tabindex="-1">4. 避坑指南 <a class="header-anchor" href="#_4-避坑指南" aria-label="Permalink to &quot;4\\. 避坑指南&quot;">​</a></h2><p>本章节主要对上述案例中导致线程Block的原因进行汇总分析，并给出相应的解决方案。</p><h3 id="_4-1-问题总结" tabindex="-1">4.1 问题总结 <a class="header-anchor" href="#_4-1-问题总结" aria-label="Permalink to &quot;4.1 问题总结&quot;">​</a></h3><p><img src="`+I+`" alt="error.图片加载失败"></p><p>日志异步处理流程示意如图26所示，整体步骤如下：</p><ul><li>业务线程组装日志事件对象，如创建日志快照或者初始化日志字段等。</li><li>日志事件对象入队，如BlockingQueue队列或Disruptor RingBuffer队列等。</li><li>日志异步线程从队列获取日志事件对象，并输出至目的地，如本地磁盘文件或远程日志中心等。</li></ul><p>对应地，Log4j2导致线程Block的主要潜在风险点如下：</p><ul><li>如上图标号①所示，<strong>日志事件对象在入队前，组装日志事件时触发了异常堆栈类解析、加载，从而引发线程Block</strong>。</li><li>如上图标号②所示，<strong>日志事件对象在入队时，由于队列满，无法入队，从而引发线程Block</strong>。</li><li>如上图标号③所示，<strong>日志事件对象在出队后，对日志内容进行格式化处理时触发了异常堆栈类解析、加载，从而引发线程 Block</strong>。</li></ul><p>从上述分析不难看出：</p><ul><li>标号①和②处如果发生线程Block，那么会直接影响业务线程池内的所有线程。</li><li>标号③出如果发生线程Block，那么会影响日志异步线程，该线程通常为单线程。</li></ul><p><strong>标号①和②处发生线程Block的影响范围远比标号③更大，因此核心是要避免日志事件在入队操作完成前触发线程Block</strong>。其实日志异步线程通常是单线程，因此对于单个Appender来说，不会出现Block现象，至多会导致异步线程处理速度变慢而已，但如果存在多个异步Appender，那么多个日志异步线程仍然会出现彼此Block的现象。</p><h3 id="_4-2-对症下药" tabindex="-1">4.2 对症下药 <a class="header-anchor" href="#_4-2-对症下药" aria-label="Permalink to &quot;4.2 对症下药&quot;">​</a></h3><blockquote><p>搞清楚了日志导致线程Block的原因后，问题也就不难解决，解决方案主要从日志事件“入队前”、“入队时”和“出队后”三方面展开。</p></blockquote><h4 id="_4-2-1-入队前避免线程block" tabindex="-1">4.2.1 入队前避免线程Block <a class="header-anchor" href="#_4-2-1-入队前避免线程block" aria-label="Permalink to &quot;4.2.1 入队前避免线程Block&quot;">​</a></h4><p>结合上文分析的“AsyncAppender导致线程Block”、“Lambda表达式导致线程Block”和“AsyncLoggerConfig导致线程Block”案例，日志事件入队前避免线程Block的解决方案可从如下几方面考虑：</p><ul><li>日志事件入队前避免触发异常堆栈类解析、加载操作。</li><li>禁用JVM反射调用优化。</li><li>升级JDK版本修复Lambda类Bug。</li></ul><p>先说方案结论：</p><ul><li>自定义Appender实现，创建日志事件快照时避免触发异常堆栈类解析、加载，美团内部Scribe-Log提供的AsyncScribeAppender即是如此。</li><li>日志配置文件中不使用<code>&lt;AsyncLogger&gt;</code>标签，可以使用<code>&lt;Logger&gt;</code>标签来代替。</li></ul><p>下面具体分析方案可行性：</p><ol><li><strong>日志事件入队前避免触发异常堆栈类解析、加载操作</strong></li></ol><p>如果在日志事件入队前，能避免异常堆栈类解析、加载操作，则可从根本上解决该问题，但在Log4j2的2.17.1版本中AsyncAppender和AsyncLoggerConfig仍存在该问题，此时：</p><ul><li>对于AsyncAppender场景来说，可以通过自定义Appender实现，在生成日志事件快照时避免触发解析、加载异常堆栈类，并在配置文件中使用自定义的Appender代替Log4j2提供的AsyncAppender。自定义AsyncScribeAppender相关代码片段如下。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.scribe.appender.AsyncScribeAppender</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void append(final LogEvent logEvent) {</span></span>
<span class="line"><span>    // ... 以上部分忽略 ...</span></span>
<span class="line"><span>    Log4jLogEvent.Builder builder = new Log4jLogEvent.Builder(event);</span></span>
<span class="line"><span>    builder.setIncludeLocation(includeLocation);</span></span>
<span class="line"><span>    // 创建日志快照，避免解析、加载异常堆栈类</span></span>
<span class="line"><span>    final Log4jLogEvent memento = builder.build();</span></span>
<span class="line"><span>    // ... 以下部分忽略 ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>对于AsyncLoggerConfig场景来说，可以考虑使用非ReusableLogEventFactory类型的LogEventFactory来规避该问题，除此之外也可以考虑换用LoggerConfig来避免该问题。</li></ul><ol start="2"><li><strong>禁用JVM反射调用优化</strong></li></ol><p>调大inflationThreshold（其类型为 int）值到int最大值，如此，虽然一定范围内（反射调用次数不超过int最大值时）避免了类加载Block问题，但损失了反射调用性能，顾此失彼，且无法根治。另外，对于非反射类问题仍然无法解决，如上文所述的Lambda表达式问题等。</p><ol start="3"><li><strong>升级JDK版本修复Lambda类Bug</strong></li></ol><p>升级JDK版本的确可以解决Lambda表达式问题，但并不能彻底解决线程Block问题，如上文所述的反射调用等。</p><h4 id="_4-2-2-入队时避免线程block" tabindex="-1">4.2.2 入队时避免线程Block <a class="header-anchor" href="#_4-2-2-入队时避免线程block" aria-label="Permalink to &quot;4.2.2 入队时避免线程Block&quot;">​</a></h4><p>结合上文分析的“日志队列满导致线程Block”案例，日志事件入队时避免线程Block的解决方案可从如下几方面考虑：</p><ul><li>日志队列满时，Appender忽略该日志。</li><li>Appender使用自定义的ErrorHandler实现处理日志。</li><li>关闭StatusConfigListener日志输出。</li></ul><p>先说方案结论：<strong>自定义Appender实现，日志事件入队失败时忽略错误日志，美团内部Scribe-Log提供的AsyncScribeAppender即是如此</strong>。</p><p>下面具体分析方案可行性：</p><ol><li><strong>日志队列满时Appender忽略该日志</strong></li></ol><p>日志队列满，某种程度上说明日志线程的处理能力不足，在现有机器资源不变的情况下需要做一定取舍，如果日志不是特别重要通常可丢弃该日志，此时：</p><ul><li>对于AsyncAppender在blocking场景来说，可以通过配置log4j2.AsyncQueueFullPolicy=Discard来使用DISCARD策略忽略日志。</li><li>对于AsyncAppender在非blocking场景来说，可以通过自定义Appender实现，在日志事件入队失败后直接忽略错误日志，并在配置文件中使用自定义的Appender代替Log4j2提供的AsyncAppender。自定义AsyncScribeAppender相关代码片段如下。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.scribe.appender.AsyncScribeAppender</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void append(final LogEvent logEvent) {</span></span>
<span class="line"><span>		// ... 以上部分忽略 ...</span></span>
<span class="line"><span>    if (!transfer(memento)) {</span></span>
<span class="line"><span>        if (blocking) {</span></span>
<span class="line"><span>            // delegate to the event router (which may discard, enqueue and block, or log in current thread)</span></span>
<span class="line"><span>            final EventRouteAsyncScribe route = asyncScribeQueueFullPolicy.getRoute(processingThread.getId(), memento.getLevel());</span></span>
<span class="line"><span>            route.logMessage(this, memento);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          	// 自定义printDebugInfo参数，控制是否输出error信息，默认为false</span></span>
<span class="line"><span>            if (printDebugInfo) {</span></span>
<span class="line"><span>                error(&quot;Appender &quot; + getName() + &quot; is unable to write primary appenders. queue is full&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            logToErrorAppenderIfNecessary(false, memento);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>		// ... 以下部分忽略 ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li><strong>Appender使用自定义的ErrorHandler实现处理日志</strong></li></ol><p>自定义ErrorHandler，Appender内设置handler为自定义ErrorHandler实例即可，但该方式仅适用于通过Log4j2 API方式创建的Logger，不支持日志配置文件的使用方式。由于大多数用户都使用配置文件方式，所以该方案使用场景有限，不过可以期待后续日志框架支持配置文件自定义ErrorHandler，已有相关<a href="https://issues.apache.org/jira/browse/LOG4J2-2927" target="_blank" rel="noreferrer">Issue: ErrorHandlers on Appenders cannot be configured在新窗口打开</a>反馈给社区。</p><ol start="3"><li><strong>关闭StatusConfigListener日志输出</strong></li></ol><ul><li>配置文件中设置Configuration的status属性值为off，则不会创建StatusConfigListener，但此时StatusLogger会调用SimpleLogger来输出日志到System.err，仍不解决问题。</li><li>配置文件中设置Configuration的status属性值为fatal，则只有fatal级别的日志才会输出，普通的error日志直接忽略，但fatal条件过于严苛，可能会忽略一些重要的error日志。</li></ul><h4 id="_4-2-3-出队后避免线程block" tabindex="-1">4.2.3 出队后避免线程Block <a class="header-anchor" href="#_4-2-3-出队后避免线程block" aria-label="Permalink to &quot;4.2.3 出队后避免线程Block&quot;">​</a></h4><p>日志事件出队后会按照用户配置的输出样式，对日志内容进行格式化转换，此时仍然可能触发解析、加载异常堆栈类。因此，日志出队后避免线程Block的根本解决方法是在异常格式化转换时避免解析、加载异常堆栈类。</p><p>先说方案结论：<strong>显式配置日志输出样式%ex来代替默认的%xEx，避免对日志内容格式化时解析、加载异常堆栈类</strong>。</p><p>下面通过分析日志内容格式化处理流程来介绍解决方案。以PatternLayout为例，日志内容格式化转换流程链路为：Layout-&gt;PatternFormatter-&gt;LogEventPatternConverter。其中LogEventPatternConverter是个抽象类，有两个处理异常的格式化转换具体实现类，分别是ThrowablePatternConverter和ExtendedThrowablePatternConverter。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.layout.PatternLayout</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将 LogEvent 转换为可以输出的 String</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public String toSerializable(final LogEvent event) {</span></span>
<span class="line"><span>  	// 由 PatternSerializer 对日志事件格式化处理</span></span>
<span class="line"><span>    return eventSerializer.toSerializable(event);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// org.apache.logging.log4j.core.layout.PatternLayout.PatternSerializer</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public String toSerializable(final LogEvent event) {</span></span>
<span class="line"><span>    final StringBuilder sb = getStringBuilder();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        return toSerializable(event, sb).toString();</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        trimToMaxSize(sb);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public StringBuilder toSerializable(final LogEvent event, final StringBuilder buffer) {</span></span>
<span class="line"><span>    final int len = formatters.length;</span></span>
<span class="line"><span>    for (int i = 0; i &lt; len; i++) {</span></span>
<span class="line"><span>    		// 由 PatternFormatter 对日志事件格式化处理</span></span>
<span class="line"><span>        formatters[i].format(event, buffer);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (replace != null) { // creates temporary objects</span></span>
<span class="line"><span>        String str = buffer.toString();</span></span>
<span class="line"><span>        str = replace.format(str);</span></span>
<span class="line"><span>        buffer.setLength(0);</span></span>
<span class="line"><span>        buffer.append(str);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return buffer;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// org.apache.logging.log4j.core.pattern.PatternFormatter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void format(final LogEvent event, final StringBuilder buf) {</span></span>
<span class="line"><span>    if (skipFormattingInfo) {</span></span>
<span class="line"><span>      	// 由 LogEventPatternConverter 对日志事件进行格式化处理</span></span>
<span class="line"><span>        converter.format(event, buf);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        formatWithInfo(event, buf);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void formatWithInfo(final LogEvent event, final StringBuilder buf) {</span></span>
<span class="line"><span>    final int startField = buf.length();</span></span>
<span class="line"><span>  	// 由 LogEventPatternConverter 对日志事件进行格式化处理</span></span>
<span class="line"><span>    converter.format(event, buf);</span></span>
<span class="line"><span>    field.format(startField, buf);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// org.apache.logging.log4j.core.pattern.LogEventPatternConverter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public abstract class LogEventPatternConverter extends AbstractPatternConverter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 将日志事件 LogEvent 转换为 String</span></span>
<span class="line"><span>     * Formats an event into a string buffer.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param event      event to format, may not be null.</span></span>
<span class="line"><span>     * @param toAppendTo string buffer to which the formatted event will be appended.  May not be null.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public abstract void format(final LogEvent event, final StringBuilder toAppendTo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>日志框架对异常进行格式化转换时，有如下两个配置项可参考，默认配置是%xEx。</p><ol><li><strong>%ex，仅输出异常信息，不获取扩展信息（jar文件名称和版本信息）</strong></li></ol><p>对应的格式转化类是ThrowablePatternConverter，在format方法内部并没有获取ThrowableProxy对象，所以不会触发解析、加载异常堆栈类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.pattern.ThrowablePatternConverter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Plugin(name = &quot;ThrowablePatternConverter&quot;, category = PatternConverter.CATEGORY)</span></span>
<span class="line"><span>@ConverterKeys({ &quot;ex&quot;, &quot;throwable&quot;, &quot;exception&quot; })</span></span>
<span class="line"><span>public class ThrowablePatternConverter extends LogEventPatternConverter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void format(final LogEvent event, final StringBuilder buffer) {</span></span>
<span class="line"><span>        final Throwable t = event.getThrown();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (isSubShortOption()) {</span></span>
<span class="line"><span>            formatSubShortOption(t, getSuffix(event), buffer);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (t != null &amp;&amp; options.anyLines()) {</span></span>
<span class="line"><span>            formatOption(t, getSuffix(event), buffer);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private boolean isSubShortOption() {</span></span>
<span class="line"><span>        return ThrowableFormatOptions.MESSAGE.equalsIgnoreCase(rawOption) ||</span></span>
<span class="line"><span>                ThrowableFormatOptions.LOCALIZED_MESSAGE.equalsIgnoreCase(rawOption) ||</span></span>
<span class="line"><span>                ThrowableFormatOptions.FILE_NAME.equalsIgnoreCase(rawOption) ||</span></span>
<span class="line"><span>                ThrowableFormatOptions.LINE_NUMBER.equalsIgnoreCase(rawOption) ||</span></span>
<span class="line"><span>                ThrowableFormatOptions.METHOD_NAME.equalsIgnoreCase(rawOption) ||</span></span>
<span class="line"><span>                ThrowableFormatOptions.CLASS_NAME.equalsIgnoreCase(rawOption);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void formatSubShortOption(final Throwable t, final String suffix, final StringBuilder buffer) {</span></span>
<span class="line"><span>        StackTraceElement[] trace;</span></span>
<span class="line"><span>        StackTraceElement throwingMethod = null;</span></span>
<span class="line"><span>        int len;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (t != null) {</span></span>
<span class="line"><span>            trace = t.getStackTrace();</span></span>
<span class="line"><span>            if (trace !=null &amp;&amp; trace.length &gt; 0) {</span></span>
<span class="line"><span>                throwingMethod = trace[0];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (t != null &amp;&amp; throwingMethod != null) {</span></span>
<span class="line"><span>            String toAppend = Strings.EMPTY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (ThrowableFormatOptions.CLASS_NAME.equalsIgnoreCase(rawOption)) {</span></span>
<span class="line"><span>                toAppend = throwingMethod.getClassName();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ThrowableFormatOptions.METHOD_NAME.equalsIgnoreCase(rawOption)) {</span></span>
<span class="line"><span>                toAppend = throwingMethod.getMethodName();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ThrowableFormatOptions.LINE_NUMBER.equalsIgnoreCase(rawOption)) {</span></span>
<span class="line"><span>                toAppend = String.valueOf(throwingMethod.getLineNumber());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ThrowableFormatOptions.MESSAGE.equalsIgnoreCase(rawOption)) {</span></span>
<span class="line"><span>                toAppend = t.getMessage();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ThrowableFormatOptions.LOCALIZED_MESSAGE.equalsIgnoreCase(rawOption)) {</span></span>
<span class="line"><span>                toAppend = t.getLocalizedMessage();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ThrowableFormatOptions.FILE_NAME.equalsIgnoreCase(rawOption)) {</span></span>
<span class="line"><span>                toAppend = throwingMethod.getFileName();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            len = buffer.length();</span></span>
<span class="line"><span>            if (len &gt; 0 &amp;&amp; !Character.isWhitespace(buffer.charAt(len - 1))) {</span></span>
<span class="line"><span>                buffer.append(&#39; &#39;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            buffer.append(toAppend);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (Strings.isNotBlank(suffix)) {</span></span>
<span class="line"><span>                buffer.append(&#39; &#39;);</span></span>
<span class="line"><span>                buffer.append(suffix);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void formatOption(final Throwable throwable, final String suffix, final StringBuilder buffer) {</span></span>
<span class="line"><span>        final StringWriter w = new StringWriter();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        throwable.printStackTrace(new PrintWriter(w));</span></span>
<span class="line"><span>        final int len = buffer.length();</span></span>
<span class="line"><span>        if (len &gt; 0 &amp;&amp; !Character.isWhitespace(buffer.charAt(len - 1))) {</span></span>
<span class="line"><span>            buffer.append(&#39; &#39;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (!options.allLines() || !Strings.LINE_SEPARATOR.equals(options.getSeparator()) || Strings.isNotBlank(suffix)) {</span></span>
<span class="line"><span>            final StringBuilder sb = new StringBuilder();</span></span>
<span class="line"><span>            final String[] array = w.toString().split(Strings.LINE_SEPARATOR);</span></span>
<span class="line"><span>            final int limit = options.minLines(array.length) - 1;</span></span>
<span class="line"><span>            final boolean suffixNotBlank = Strings.isNotBlank(suffix);</span></span>
<span class="line"><span>            for (int i = 0; i &lt;= limit; ++i) {</span></span>
<span class="line"><span>                sb.append(array[i]);</span></span>
<span class="line"><span>                if (suffixNotBlank) {</span></span>
<span class="line"><span>                    sb.append(&#39; &#39;);</span></span>
<span class="line"><span>                    sb.append(suffix);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (i &lt; limit) {</span></span>
<span class="line"><span>                    sb.append(options.getSeparator());</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            buffer.append(sb.toString());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            buffer.append(w.toString());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * This converter obviously handles throwables.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return true.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean handlesThrowable() {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected String getSuffix(final LogEvent event) {</span></span>
<span class="line"><span>        //noinspection ForLoopReplaceableByForEach</span></span>
<span class="line"><span>        final StringBuilder toAppendTo = new StringBuilder();</span></span>
<span class="line"><span>        for (int i = 0, size = formatters.size(); i &lt;  size; i++) {</span></span>
<span class="line"><span>            formatters.get(i).format(event, toAppendTo);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return toAppendTo.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ThrowableFormatOptions getOptions() {</span></span>
<span class="line"><span>        return options;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li><strong>%xEx，不仅输出异常信息，同时获取扩展信息</strong></li></ol><p>对应的格式转化类是ExtendedThrowablePatternConverter，在format方法内部获取了ThrowableProxy对象，此时一定会触发解析、加载异常堆栈类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// org.apache.logging.log4j.core.pattern.ExtendedThrowablePatternConverter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Plugin(name = &quot;ExtendedThrowablePatternConverter&quot;, category = PatternConverter.CATEGORY)</span></span>
<span class="line"><span>@ConverterKeys({ &quot;xEx&quot;, &quot;xThrowable&quot;, &quot;xException&quot; })</span></span>
<span class="line"><span>public final class ExtendedThrowablePatternConverter extends ThrowablePatternConverter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * {@inheritDoc}</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void format(final LogEvent event, final StringBuilder toAppendTo) {</span></span>
<span class="line"><span>      	// 获取 ThrowableProxy 对象，触发解析、加载异常堆栈类</span></span>
<span class="line"><span>        final ThrowableProxy proxy = event.getThrownProxy();</span></span>
<span class="line"><span>        final Throwable throwable = event.getThrown();</span></span>
<span class="line"><span>        if ((throwable != null || proxy != null) &amp;&amp; options.anyLines()) {</span></span>
<span class="line"><span>            if (proxy == null) {</span></span>
<span class="line"><span>                super.format(event, toAppendTo);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            final String extStackTrace = proxy.getExtendedStackTraceAsString(options.getIgnorePackages(),</span></span>
<span class="line"><span>                    options.getTextRenderer(), getSuffix(event), options.getSeparator());</span></span>
<span class="line"><span>            final int len = toAppendTo.length();</span></span>
<span class="line"><span>            if (len &gt; 0 &amp;&amp; !Character.isWhitespace(toAppendTo.charAt(len - 1))) {</span></span>
<span class="line"><span>                toAppendTo.append(&#39; &#39;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            toAppendTo.append(extStackTrace);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="_5-最佳实践" tabindex="-1">5. 最佳实践 <a class="header-anchor" href="#_5-最佳实践" aria-label="Permalink to &quot;5\\. 最佳实践&quot;">​</a></h2><blockquote><p>本章节主要结合项目在日志使用方面的一系列踩坑经历和实践经验，总结了一份关于日志配置的最佳实践，供大家参考。</p></blockquote><ul><li><strong>建议日志配置文件中对所有Appender的PatternLayout都增加%ex配置</strong>，因为如果没有显式配置%ex，则异常格式化输出的默认配置是%xEx，此时会打印异常的扩展信息（JAR名称和版本），可能导致业务线程Block。</li><li><strong>不建议日志配置文件中使用AsyncAppender，建议自定义Appender实现</strong>，因为AsyncAppender是日志框架默认提供的，目前最新版本中仍然存在日志事件入队前就触发加载异常堆栈类的问题，可能导致业务线程Block。</li><li><strong>不建议生产环境使用ConsoleAppender</strong>，因为输出日志到Console时有synchronized同步操作，高并发场景下非常容易导致业务线程Block。</li><li><strong>不建议在配置文件中使用<code>&lt;AsyncLogger&gt;</code>标签</strong>，因为日志事件元素在入队前就会触发加载异常堆栈类，可能导致业务线程Block。如果希望使用Log4j2提供的异步日志AsyncLogger，建议配置Log4jContextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector参数，开启异步日志。</li></ul><p>下面提供一份log4j2.xml配置示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration status=&quot;warn&quot;&gt;</span></span>
<span class="line"><span>    &lt;appenders&gt;</span></span>
<span class="line"><span>        &lt;Console name=&quot;Console&quot; target=&quot;SYSTEM_OUT&quot; follow=&quot;true&quot;&gt;</span></span>
<span class="line"><span>            &lt;PatternLayout pattern=&quot;%d{yyyy/MM/dd HH:mm:ss.SSS} %t [%p] %c{1} (%F:%L) %msg%n %ex&quot; /&gt;</span></span>
<span class="line"><span>        &lt;/Console&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;XMDFile name=&quot;ShepherdLog&quot; fileName=&quot;shepherd.log&quot;&gt;</span></span>
<span class="line"><span>          	&lt;PatternLayout pattern=&quot;%d{yyyy/MM/dd HH:mm:ss.SSS} %t [%p] %c{1} (%F:%L) %msg%n %ex&quot; /&gt;</span></span>
<span class="line"><span>	      &lt;/XMDFile&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!--XMDFile异步磁盘日志配置示例--&gt;</span></span>
<span class="line"><span>        &lt;!--默认按天&amp;按512M文件大小切分日志，默认最多保留30个日志文件。--&gt;</span></span>
<span class="line"><span>        &lt;!--注意：fileName前会自动增加文件路径，只配置文件名即可--&gt;</span></span>
<span class="line"><span>        &lt;XMDFile name=&quot;LocalServiceLog&quot; fileName=&quot;request.log&quot;&gt;</span></span>
<span class="line"><span>	          &lt;PatternLayout pattern=&quot;%d{yyyy/MM/dd HH:mm:ss.SSS} %t [%p] %c{1} (%F:%L) %msg%n %ex&quot; /&gt;</span></span>
<span class="line"><span>	      &lt;/XMDFile&gt;</span></span>
<span class="line"><span>  			</span></span>
<span class="line"><span>      	&lt;!-- 使用自定义的AsyncScribeAppender代替原有的AsycncAppender --&gt;</span></span>
<span class="line"><span>        &lt;AsyncScribe name=&quot;LogCenterAsync&quot; blocking=&quot;false&quot;&gt;</span></span>
<span class="line"><span>            &lt;!-- 在指定日志名方面，scribeCategory 和 appkey 两者至少存在一种，且 scribeCategory 高于 appkey。--&gt;</span></span>
<span class="line"><span>            &lt;!-- &lt;Property name=&quot;scribeCategory&quot;&gt;data_update_test_lc&lt;/Property&gt; --&gt;</span></span>
<span class="line"><span>           &lt;LcLayout/&gt;</span></span>
<span class="line"><span>        &lt;/AsyncScribe&gt;</span></span>
<span class="line"><span>    &lt;/appenders&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;loggers&gt;</span></span>
<span class="line"><span>        &lt;logger name=&quot;com.sankuai.shepherd&quot; level=&quot;info&quot; additivity=&quot;false&quot;&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;ShepherdLog&quot; level=&quot;warn&quot;/&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;LogCenterAsync&quot; level=&quot;info&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/logger&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;root level=&quot;info&quot;&gt;</span></span>
<span class="line"><span>            &lt;!--Console日志是同步、阻塞的，推荐只在本地调试时使用，线上将该配置去掉--&gt;</span></span>
<span class="line"><span>            &lt;!--appender-ref ref=&quot;Console&quot; /--&gt;</span></span>
<span class="line"><span>            &lt;appender-ref ref=&quot;LocalServiceLog&quot;/&gt;</span></span>
<span class="line"><span>            &lt;appender-ref ref=&quot;LogCenterAsync&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/root&gt;</span></span>
<span class="line"><span>    &lt;/loggers&gt;</span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><h2 id="_6-文章来源" tabindex="-1">6 文章来源 <a class="header-anchor" href="#_6-文章来源" aria-label="Permalink to &quot;6 文章来源&quot;">​</a></h2><p>转载说明:</p><ul><li>作者：志洋、陈超、李敏、凯晖、殷琦等，均来自美团基础技术部-应用中间件团队。</li><li>版权声明：本文为「美团技术团队」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。</li><li>原文链接：<a href="https://tech.meituan.com/2022/07/29/tips-for-avoiding-log-blocking-threads.html" target="_blank" rel="noreferrer">https://tech.meituan.com/2022/07/29/tips-for-avoiding-log-blocking-threads.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,249)]))}const J=s(B,[["render",j]]);export{U as __pageData,J as default};
