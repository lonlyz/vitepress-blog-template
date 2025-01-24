import{_ as n,c as a,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/arch/log/log-mt-log-1.png",l="/vitepress-blog-template/images/arch/log/log-mt-log-2.png",i="/vitepress-blog-template/images/arch/log/log-mt-log-3.png",o="/vitepress-blog-template/images/arch/log/log-mt-log-4.png",r="/vitepress-blog-template/images/arch/log/log-mt-log-5.png",c="/vitepress-blog-template/images/arch/log/log-mt-log-6.png",d="/vitepress-blog-template/images/arch/log/log-mt-log-7.png",u="/vitepress-blog-template/images/arch/log/log-mt-log-8.png",g="/vitepress-blog-template/images/arch/log/log-mt-log-9.png",h="/vitepress-blog-template/images/arch/log/log-mt-log-10.png",x=JSON.parse('{"title":"美团: 如何优雅地记录操作日志？","description":"","frontmatter":{},"headers":[],"relativePath":"arch/log/arch-log-example-meituan-log.md","filePath":"arch/log/arch-log-example-meituan-log.md","lastUpdated":1737706346000}'),v={name:"arch/log/arch-log-example-meituan-log.md"};function b(m,s,q,y,C,S){return p(),a("div",null,s[0]||(s[0]=[e('<h1 id="美团-如何优雅地记录操作日志" tabindex="-1">美团: 如何优雅地记录操作日志？ <a class="header-anchor" href="#美团-如何优雅地记录操作日志" aria-label="Permalink to &quot;美团: 如何优雅地记录操作日志？&quot;">​</a></h1><blockquote><p>操作日志几乎存在于每个系统中，而这些系统都有记录操作日志的一套 API。操作日志和系统日志不一样，操作日志必须要做到简单易懂。所以如何让操作日志不跟业务逻辑耦合，如何让操作日志的内容易于理解，如何让操作日志的接入更加简单？上面这些都是本文要回答的问题。我们主要围绕着如何“优雅”地记录操作日志展开描述，希望对从事相关工作的同学能够有所帮助或者启发。</p></blockquote><h2 id="_1-操作日志的使用场景" tabindex="-1">1. 操作日志的使用场景 <a class="header-anchor" href="#_1-操作日志的使用场景" aria-label="Permalink to &quot;1\\. 操作日志的使用场景&quot;">​</a></h2><p><img src="'+t+`" alt="error.图片加载失败"></p><p><strong>系统日志和操作日志的区别</strong></p><ul><li><strong>系统日志</strong>：系统日志主要是为开发排查问题提供依据，一般打印在日志文件中；系统日志的可读性要求没那么高，日志中会包含代码的信息，比如在某个类的某一行打印了一个日志。</li><li><strong>操作日志</strong>：主要是对某个对象进行新增操作或者修改操作后记录下这个新增或者修改，操作日志要求可读性比较强，因为它主要是给用户看的，比如订单的物流信息，用户需要知道在什么时间发生了什么事情。再比如，客服对工单的处理记录信息。</li></ul><p>操作日志的记录格式大概分为下面几种：</p><ol><li>单纯的文字记录，比如：2021-09-16 10:00 订单创建。</li><li>简单的动态的文本记录，比如：2021-09-16 10:00 订单创建，订单号：NO.11089999，其中涉及变量订单号“NO.11089999”。</li><li>修改类型的文本，包含修改前和修改后的值，比如：2021-09-16 10:00 用户小明修改了订单的配送地址：从“金灿灿小区”修改到“银盏盏小区” ，其中涉及变量配送的原地址“金灿灿小区”和新地址“银盏盏小区”。</li><li>修改表单，一次会修改多个字段。</li></ol><h2 id="_2-实现方式" tabindex="-1">2. 实现方式 <a class="header-anchor" href="#_2-实现方式" aria-label="Permalink to &quot;2\\. 实现方式&quot;">​</a></h2><h3 id="_2-1-使用-canal-监听数据库记录操作日志" tabindex="-1">2.1 使用 Canal 监听数据库记录操作日志 <a class="header-anchor" href="#_2-1-使用-canal-监听数据库记录操作日志" aria-label="Permalink to &quot;2.1 使用 Canal 监听数据库记录操作日志&quot;">​</a></h3><p>Canal 是一款基于 MySQL 数据库增量日志解析，提供增量数据订阅和消费的开源组件，通过采用监听数据库 Binlog 的方式，这样可以从底层知道是哪些数据做了修改，然后根据更改的数据记录操作日志。</p><p>这种方式的优点是和业务逻辑完全分离。缺点也很明显，局限性太高，只能针对数据库的更改做操作日志记录，如果修改涉及到其他团队的 RPC 的调用，就没办法监听数据库了。举个例子：给用户发送通知，通知服务一般都是公司内部的公共组件，这时候只能在调用 RPC 的时候手工记录发送通知的操作日志了。</p><h3 id="_2-2-通过日志文件的方式记录" tabindex="-1">2.2 通过日志文件的方式记录 <a class="header-anchor" href="#_2-2-通过日志文件的方式记录" aria-label="Permalink to &quot;2.2 通过日志文件的方式记录&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>log.info(&quot;订单创建&quot;)</span></span>
<span class="line"><span>log.info(&quot;订单已经创建，订单编号:{}&quot;, orderNo)</span></span>
<span class="line"><span>log.info(&quot;修改了订单的配送地址：从“{}”修改到“{}”&quot;， &quot;金灿灿小区&quot;, &quot;银盏盏小区&quot;)</span></span></code></pre></div><p>这种方式的操作记录需要解决三个问题。</p><ul><li><strong>问题一：操作人如何记录</strong></li></ul><p>借助 SLF4J 中的 MDC 工具类，把操作人放在日志中，然后在日志中统一打印出来。首先在用户的拦截器中把用户的标识 Put 到 MDC 中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class UserInterceptor extends HandlerInterceptorAdapter {</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {</span></span>
<span class="line"><span>    //获取到用户标识</span></span>
<span class="line"><span>    String userNo = getUserNo(request);</span></span>
<span class="line"><span>    //把用户 ID 放到 MDC 上下文中</span></span>
<span class="line"><span>    MDC.put(&quot;userId&quot;, userNo);</span></span>
<span class="line"><span>    return super.preHandle(request, response, handler);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private String getUserNo(HttpServletRequest request) {</span></span>
<span class="line"><span>    // 通过 SSO 或者Cookie 或者 Auth信息获取到 当前登陆的用户信息</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其次，把 userId 格式化到日志中，使用 <code>%X{userId}</code> 可以取到 MDC 中用户标识。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;pattern&gt;&quot;%d{yyyy-MM-dd HH:mm:ss.SSS} %t %-5level %X{userId} %logger{30}.%method:%L - %msg%n&quot;&lt;/pattern&gt;</span></span></code></pre></div><ul><li><strong>问题二：操作日志如何和系统日志区分开</strong></li></ul><p>通过配置 Log 的配置文件，把有关操作日志的 Log 单独放到一日志文件中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//不同业务日志记录到不同的文件</span></span>
<span class="line"><span>&lt;appender name=&quot;businessLogAppender&quot; class=&quot;ch.qos.logback.core.rolling.RollingFileAppender&quot;&gt;</span></span>
<span class="line"><span>    &lt;File&gt;logs/business.log&lt;/File&gt;</span></span>
<span class="line"><span>    &lt;append&gt;true&lt;/append&gt;</span></span>
<span class="line"><span>    &lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&gt;</span></span>
<span class="line"><span>        &lt;level&gt;INFO&lt;/level&gt;</span></span>
<span class="line"><span>        &lt;onMatch&gt;ACCEPT&lt;/onMatch&gt;</span></span>
<span class="line"><span>        &lt;onMismatch&gt;DENY&lt;/onMismatch&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span>    &lt;rollingPolicy class=&quot;ch.qos.logback.core.rolling.TimeBasedRollingPolicy&quot;&gt;</span></span>
<span class="line"><span>        &lt;fileNamePattern&gt;logs/业务A.%d.%i.log&lt;/fileNamePattern&gt;</span></span>
<span class="line"><span>        &lt;maxHistory&gt;90&lt;/maxHistory&gt;</span></span>
<span class="line"><span>        &lt;timeBasedFileNamingAndTriggeringPolicy class=&quot;ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP&quot;&gt;</span></span>
<span class="line"><span>            &lt;maxFileSize&gt;10MB&lt;/maxFileSize&gt;</span></span>
<span class="line"><span>        &lt;/timeBasedFileNamingAndTriggeringPolicy&gt;</span></span>
<span class="line"><span>    &lt;/rollingPolicy&gt;</span></span>
<span class="line"><span>    &lt;encoder&gt;</span></span>
<span class="line"><span>        &lt;pattern&gt;&quot;%d{yyyy-MM-dd HH:mm:ss.SSS} %t %-5level %X{userId} %logger{30}.%method:%L - %msg%n&quot;&lt;/pattern&gt;</span></span>
<span class="line"><span>        &lt;charset&gt;UTF-8&lt;/charset&gt;</span></span>
<span class="line"><span>    &lt;/encoder&gt;</span></span>
<span class="line"><span>&lt;/appender&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>&lt;logger name=&quot;businessLog&quot; additivity=&quot;false&quot; level=&quot;INFO&quot;&gt;</span></span>
<span class="line"><span>    &lt;appender-ref ref=&quot;businessLogAppender&quot;/&gt;</span></span>
<span class="line"><span>&lt;/logger&gt;</span></span></code></pre></div><p>然后在 Java 代码中单独的记录业务日志。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//记录特定日志的声明</span></span>
<span class="line"><span>private final Logger businessLog = LoggerFactory.getLogger(&quot;businessLog&quot;);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>//日志存储</span></span>
<span class="line"><span>businessLog.info(&quot;修改了配送地址&quot;);</span></span></code></pre></div><ul><li><strong>问题三：如何生成可读懂的日志文案</strong></li></ul><p>可以采用 LogUtil 的方式，也可以采用切面的方式生成日志模板，后续内容将会进行介绍。这样就可以把日志单独保存在一个文件中，然后通过日志收集可以把日志保存在 Elasticsearch 或者数据库中，接下来我们看下如何生成可读的操作日志。</p><h3 id="_2-3-通过-logutil-的方式记录日志" tabindex="-1">2.3 通过 LogUtil 的方式记录日志 <a class="header-anchor" href="#_2-3-通过-logutil-的方式记录日志" aria-label="Permalink to &quot;2.3 通过 LogUtil 的方式记录日志&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LogUtil.log(orderNo, &quot;订单创建&quot;, &quot;小明&quot;)</span></span>
<span class="line"><span>LogUtil.log(orderNo, &quot;订单创建，订单号&quot;+&quot;NO.11089999&quot;,  &quot;小明&quot;)</span></span>
<span class="line"><span>String template = &quot;用户%s修改了订单的配送地址：从“%s”修改到“%s”&quot;</span></span>
<span class="line"><span>LogUtil.log(orderNo, String.format(tempalte, &quot;小明&quot;, &quot;金灿灿小区&quot;, &quot;银盏盏小区&quot;),  &quot;小明&quot;)</span></span></code></pre></div><p>:::warning这里解释下 为什么记录操作日志的时候都绑定了一个 OrderNo，因为操作日志记录的是：某一个“时间”“谁”对“什么”做了什么“事情”。当查询业务的操作日志的时候，会查询针对这个订单的的所有操作，所以代码中加上了 OrderNo，记录操作日志的时候需要记录下操作人，所以传了操作人“小明”进来。 :::</p><p>上面看起来问题并不大，在修改地址的业务逻辑方法中使用一行代码记录了操作日志，接下来再看一个更复杂的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private OnesIssueDO updateAddress(updateDeliveryRequest request) {</span></span>
<span class="line"><span>    DeliveryOrder deliveryOrder = deliveryQueryService.queryOldAddress(request.getDeliveryOrderNo());</span></span>
<span class="line"><span>    // 更新派送信息，电话，收件人，地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>    String logContent = getLogContent(request, deliveryOrder);</span></span>
<span class="line"><span>    LogUtils.logRecord(request.getOrderNo(), logContent, request.getOperator);</span></span>
<span class="line"><span>    return onesIssueDO;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String getLogContent(updateDeliveryRequest request, DeliveryOrder deliveryOrder) {</span></span>
<span class="line"><span>    String template = &quot;用户%s修改了订单的配送地址：从“%s”修改到“%s”&quot;;</span></span>
<span class="line"><span>    return String.format(tempalte, request.getUserName(), deliveryOrder.getAddress(), request.getAddress);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到上面的例子使用了两个方法代码，外加一个 getLogContent 的函数实现了操作日志的记录。当业务变得复杂后，记录操作日志放在业务代码中会导致业务的逻辑比较繁杂，最后导致 LogUtils.logRecord() 方法的调用存在于很多业务的代码中，而且类似 getLogContent() 这样的方法也散落在各个业务类中，对于代码的可读性和可维护性来说是一个灾难。下面介绍下如何避免这个灾难。</p><h3 id="_2-4-方法注解实现操作日志" tabindex="-1">2.4 方法注解实现操作日志 <a class="header-anchor" href="#_2-4-方法注解实现操作日志" aria-label="Permalink to &quot;2.4 方法注解实现操作日志&quot;">​</a></h3><p>为了解决上面问题，一般采用 AOP 的方式记录日志，让操作日志和业务逻辑解耦，接下来看一个简单的 AOP 日志的例子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content=&quot;修改了配送地址&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request){</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以在注解的操作日志上记录固定文案，这样业务逻辑和业务代码可以做到解耦，让我们的业务代码变得纯净起来。可能有同学注意到，上面的方式虽然解耦了操作日志的代码，但是记录的文案并不符合我们的预期，文案是静态的，没有包含动态的文案，因为我们需要记录的操作日志是：用户%s修改了订单的配送地址，从“%s”修改到“%s”。接下来，我们介绍一下如何优雅地使用 AOP 生成动态的操作日志。</p><h2 id="_3-优雅地支持-aop-生成动态的操作日志" tabindex="-1">3. 优雅地支持 AOP 生成动态的操作日志 <a class="header-anchor" href="#_3-优雅地支持-aop-生成动态的操作日志" aria-label="Permalink to &quot;3\\. 优雅地支持 AOP 生成动态的操作日志&quot;">​</a></h2><h3 id="_3-1-动态模板" tabindex="-1">3.1 动态模板 <a class="header-anchor" href="#_3-1-动态模板" aria-label="Permalink to &quot;3.1 动态模板&quot;">​</a></h3><p>一提到动态模板，就会涉及到让变量通过占位符的方式解析模板，从而达到通过注解记录操作日志的目的。模板解析的方式有很多种，这里使用了 SpEL（Spring Expression Language，Spring表达式语言）来实现。我们可以先写下期望的记录日志的方式，然后再看看能否实现这样的功能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送地址：从“#oldAddress”, 修改到“#request.address”&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request, String oldAddress){</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过 SpEL 表达式引用方法上的参数，可以让变量填充到模板中达到动态的操作日志文本内容。但是现在还有几个问题需要解决：</p><ul><li>操作日志需要知道是哪个操作人修改的订单配送地址。</li><li>修改订单配送地址的操作日志需要绑定在配送的订单上，从而可以根据配送订单号查询出对这个配送订单的所有操作。</li><li>为了在注解上记录之前的配送地址是什么，在方法签名上添加了一个和业务无关的 oldAddress 的变量，这样就不优雅了。</li></ul><p>为了解决前两个问题，我们需要把期望的操作日志使用形式改成下面的方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(</span></span>
<span class="line"><span>     content = &quot;修改了订单的配送地址：从“#oldAddress”, 修改到“#request.address”&quot;,</span></span>
<span class="line"><span>     operator = &quot;#request.userName&quot;, bizNo=&quot;#request.deliveryOrderNo&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request, String oldAddress){</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>修改后的代码在注解上添加两个参数，一个是操作人，一个是操作日志需要绑定的对象。但是，在普通的 Web 应用中用户信息都是保存在一个线程上下文的静态方法中，所以 operator 一般是这样的写法（假定获取当前登陆用户的方式是 <code>UserContext.getCurrentUser()</code>）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>operator = &quot;#{T(com.meituan.user.UserContext).getCurrentUser()}&quot;</span></span></code></pre></div><p>这样的话，每个 @LogRecord 的注解上的操作人都是这么长一串。为了避免过多的重复代码，我们可以把注解上的 operator 参数设置为非必填，这样用户可以填写操作人。但是，如果用户不填写我们就取 UserContext 的 user（下文会介绍如何取 user）。最后，最简单的日志变成了下面的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送地址：从“#oldAddress”, 修改到“#request.address”&quot;, </span></span>
<span class="line"><span>           bizNo=&quot;#request.deliveryOrderNo&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request, String oldAddress){</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们需要解决第三个问题：为了记录业务操作记录添加了一个 oldAddress 变量，不管怎么样这都不是一个好的实现方式，所以接下来，我们需要把 oldAddress 变量从修改地址的方法签名上去掉。但是操作日志确实需要 oldAddress 变量，怎么办呢？</p><p>要么和产品经理 PK 一下，让产品经理把文案从“修改了订单的配送地址：从 xx 修改到 yy” 改为 “修改了订单的配送地址为：yy”。但是从用户体验上来看，第一种文案更人性化一些，显然我们不会 PK 成功的。那么我们就必须要把这个 oldAddress 查询出来然后供操作日志使用了。还有一种解决办法是：把这个参数放到操作日志的线程上下文中，供注解上的模板使用。我们按照这个思路再改下操作日志的实现代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送地址：从“#oldAddress”, 修改到“#request.address”&quot;,</span></span>
<span class="line"><span>        bizNo=&quot;#request.deliveryOrderNo&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request){</span></span>
<span class="line"><span>    // 查询出原来的地址是什么</span></span>
<span class="line"><span>    LogRecordContext.putVariable(&quot;oldAddress&quot;, DeliveryService.queryOldAddress(request.getDeliveryOrderNo()));</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这时候可以看到，LogRecordContext 解决了操作日志模板上使用方法参数以外变量的问题，同时避免了为了记录操作日志修改方法签名的设计。虽然已经比之前的代码好了些，但是依然需要在业务代码里面加了一行业务逻辑无关的代码，如果有“强迫症”的同学还可以继续往下看，接下来我们会讲解自定义函数的解决方案。下面再看另一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送员：从“#oldDeliveryUserId”, 修改到“#request.userId”&quot;,</span></span>
<span class="line"><span>        bizNo=&quot;#request.deliveryOrderNo&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request){</span></span>
<span class="line"><span>    // 查询出原来的地址是什么</span></span>
<span class="line"><span>    LogRecordContext.putVariable(&quot;oldDeliveryUserId&quot;, DeliveryService.queryOldDeliveryUserId(request.getDeliveryOrderNo()));</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个操作日志的模板最后记录的内容是这样的格式：修改了订单的配送员：从 “10090”，修改到 “10099”，显然用户看到这样的操作日志是不明白的。用户对于用户 ID 是 10090 还是 10099 并不了解，用户期望看到的是：修改了订单的配送员：从“张三（18910008888）”，修改到“小明（13910006666）”。用户关心的是配送员的姓名和电话。但是我们方法中传递的参数只有配送员的 ID，没有配送员的姓名可电话。我们可以通过上面的方法，把用户的姓名和电话查询出来，然后通过 LogRecordContext 实现。 但是，“强迫症”是不期望操作日志的代码嵌入在业务逻辑中的。接下来，我们考虑另一种实现方式：自定义函数。如果我们可以通过自定义函数把用户 ID 转换为用户姓名和电话，那么就能解决这一问题，按照这个思路，我们把模板修改为下面的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送员：从“{deliveryUser{#oldDeliveryUserId}}”, 修改到“{deveryUser{#request.userId}}”&quot;,</span></span>
<span class="line"><span>        bizNo=&quot;#request.deliveryOrderNo&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request){</span></span>
<span class="line"><span>    // 查询出原来的地址是什么</span></span>
<span class="line"><span>    LogRecordContext.putVariable(&quot;oldDeliveryUserId&quot;, DeliveryService.queryOldDeliveryUserId(request.getDeliveryOrderNo()));</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中 deliveryUser 是自定义函数，使用大括号把 Spring 的 SpEL 表达式包裹起来，这样做的好处：一是把 Spring EL 表达式和自定义函数区分开便于解析；二是如果模板中不需要 SpEL 表达式解析可以容易的识别出来，减少 SpEL 的解析提高性能。这时候我们发现上面代码还可以优化成下面的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送员：从“{queryOldUser{#request.deliveryOrderNo()}}”, 修改到“{deveryUser{#request.userId}}”&quot;,</span></span>
<span class="line"><span>        bizNo=&quot;#request.deliveryOrderNo&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request){</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样就不需要在 modifyAddress 方法中通过 LogRecordContext.putVariable() 设置老的快递员了，通过直接新加一个自定义函数 queryOldUser() 参数把派送订单传递进去，就能查到之前的配送人了，只需要让方法的解析在 modifyAddress() 方法执行之前运行。这样的话，我们让业务代码又变得纯净了起来，同时也让“强迫症”不再感到难受了。</p><h2 id="_4-代码实现解析" tabindex="-1">4. 代码实现解析 <a class="header-anchor" href="#_4-代码实现解析" aria-label="Permalink to &quot;4\\. 代码实现解析&quot;">​</a></h2><h3 id="_4-1-代码结构" tabindex="-1">4.1 代码结构 <a class="header-anchor" href="#_4-1-代码结构" aria-label="Permalink to &quot;4.1 代码结构&quot;">​</a></h3><p><img src="`+l+`" alt="error.图片加载失败"></p><p>上面的操作日志主要是通过一个 AOP 拦截器实现的，整体主要分为 AOP 模块、日志解析模块、日志保存模块、Starter 模块；组件提供了4个扩展点，分别是：自定义函数、默认处理人、业务保存和查询；业务可以根据自己的业务特性定制符合自己业务的逻辑。</p><h3 id="_4-2-模块介绍" tabindex="-1">4.2 模块介绍 <a class="header-anchor" href="#_4-2-模块介绍" aria-label="Permalink to &quot;4.2 模块介绍&quot;">​</a></h3><p>有了上面的分析，已经得出一种我们期望的操作日志记录的方式，接下来我们看下如何实现上面的逻辑。实现主要分为下面几个步骤：</p><ul><li>AOP 拦截逻辑</li><li>解析逻辑 <ul><li>模板解析</li><li>LogContext 逻辑</li><li>默认的 operator 逻辑</li><li>自定义函数逻辑</li></ul></li><li>默认的日志持久化逻辑</li><li>Starter 封装逻辑</li></ul><h4 id="_4-2-1-aop-拦截逻辑" tabindex="-1">4.2.1 AOP 拦截逻辑 <a class="header-anchor" href="#_4-2-1-aop-拦截逻辑" aria-label="Permalink to &quot;4.2.1 AOP 拦截逻辑&quot;">​</a></h4><p>这块逻辑主要是一个拦截器，针对 @LogRecord 注解分析出需要记录的操作日志，然后把操作日志持久化，这里把注解命名为 @LogRecordAnnotation。接下来，我们看下注解的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ElementType.METHOD})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Inherited</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface LogRecordAnnotation {</span></span>
<span class="line"><span>    String success();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String fail() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String operator() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String bizNo();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String category() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String detail() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String condition() default &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注解中除了上面提到参数外，还增加了 fail、category、detail、condition 等参数，这几个参数是为了满足特定的场景，后面还会给出具体的例子。</p><p><img src="`+i+'" alt="error.图片加载失败"></p><p>为了保持简单，组件的必填参数就两个。业务中的 AOP 逻辑大部分是使用 @Aspect 注解实现的，但是基于注解的 AOP 在 Spring boot 1.5 中兼容性是有问题的，组件为了兼容 Spring boot1.5 的版本我们手工实现 Spring 的 AOP 逻辑。</p><p><img src="'+o+`" alt="error.图片加载失败"></p><p>切面选择 AbstractBeanFactoryPointcutAdvisor 实现，切点是通过 StaticMethodMatcherPointcut 匹配包含 LogRecordAnnotation 注解的方法。通过实现 MethodInterceptor 接口实现操作日志的增强逻辑。</p><p>下面是拦截器的切点逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LogRecordPointcut extends StaticMethodMatcherPointcut implements Serializable {</span></span>
<span class="line"><span>    // LogRecord的解析类</span></span>
<span class="line"><span>    private LogRecordOperationSource logRecordOperationSource;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean matches(@NonNull Method method, @NonNull Class&lt;?&gt; targetClass) {</span></span>
<span class="line"><span>          // 解析 这个 method 上有没有 @LogRecordAnnotation 注解，有的话会解析出来注解上的各个参数</span></span>
<span class="line"><span>        return !CollectionUtils.isEmpty(logRecordOperationSource.computeLogRecordOperations(method, targetClass));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setLogRecordOperationSource(LogRecordOperationSource logRecordOperationSource) {</span></span>
<span class="line"><span>        this.logRecordOperationSource = logRecordOperationSource;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>切面的增强逻辑主要代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Object invoke(MethodInvocation invocation) throws Throwable {</span></span>
<span class="line"><span>    Method method = invocation.getMethod();</span></span>
<span class="line"><span>    // 记录日志</span></span>
<span class="line"><span>    return execute(invocation, invocation.getThis(), method, invocation.getArguments());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Object execute(MethodInvocation invoker, Object target, Method method, Object[] args) throws Throwable {</span></span>
<span class="line"><span>    Class&lt;?&gt; targetClass = getTargetClass(target);</span></span>
<span class="line"><span>    Object ret = null;</span></span>
<span class="line"><span>    MethodExecuteResult methodExecuteResult = new MethodExecuteResult(true, null, &quot;&quot;);</span></span>
<span class="line"><span>    LogRecordContext.putEmptySpan();</span></span>
<span class="line"><span>    Collection&lt;LogRecordOps&gt; operations = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    Map&lt;String, String&gt; functionNameAndReturnMap = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        operations = logRecordOperationSource.computeLogRecordOperations(method, targetClass);</span></span>
<span class="line"><span>        List&lt;String&gt; spElTemplates = getBeforeExecuteFunctionTemplate(operations);</span></span>
<span class="line"><span>        //业务逻辑执行前的自定义函数解析</span></span>
<span class="line"><span>        functionNameAndReturnMap = processBeforeExecuteFunctionTemplate(spElTemplates, targetClass, method, args);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        log.error(&quot;log record parse before function exception&quot;, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        ret = invoker.proceed();</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        methodExecuteResult = new MethodExecuteResult(false, e, e.getMessage());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(operations)) {</span></span>
<span class="line"><span>            recordExecute(ret, method, args, operations, targetClass,</span></span>
<span class="line"><span>                    methodExecuteResult.isSuccess(), methodExecuteResult.getErrorMsg(), functionNameAndReturnMap);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Exception t) {</span></span>
<span class="line"><span>        //记录日志错误不要影响业务</span></span>
<span class="line"><span>        log.error(&quot;log record parse exception&quot;, t);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        LogRecordContext.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (methodExecuteResult.throwable != null) {</span></span>
<span class="line"><span>        throw methodExecuteResult.throwable;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>拦截逻辑的流程：</p><p><img src="`+r+`" alt="error.图片加载失败"></p><p>可以看到，操作日志的记录持久化是在方法执行完之后执行的，当方法抛出异常之后会先捕获异常，等操作日志持久化完成后再抛出异常。在业务的方法执行之前，会对提前解析的自定义函数求值，解决了前面提到的需要查询修改之前的内容。</p><h4 id="_4-2-2-解析逻辑" tabindex="-1">4.2.2 解析逻辑 <a class="header-anchor" href="#_4-2-2-解析逻辑" aria-label="Permalink to &quot;4.2.2 解析逻辑&quot;">​</a></h4><ul><li><strong>模板解析</strong></li></ul><p>Spring 3 中提供了一个非常强大的功能：SpEL，SpEL 在 Spring 产品中是作为表达式求值的核心基础模块，它本身是可以脱离 Spring 独立使用的。举个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>        SpelExpressionParser parser = new SpelExpressionParser();</span></span>
<span class="line"><span>        Expression expression = parser.parseExpression(&quot;#root.purchaseName&quot;);</span></span>
<span class="line"><span>        Order order = new Order();</span></span>
<span class="line"><span>        order.setPurchaseName(&quot;张三&quot;);</span></span>
<span class="line"><span>        System.out.println(expression.getValue(order));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法将打印 “张三”。LogRecord 解析的类图如下：</p><p><img src="`+c+`" alt="error.图片加载失败"></p><ul><li><strong>解析核心类</strong>：LogRecordValueParser 里面封装了自定义函数和 SpEL 解析类 LogRecordExpressionEvaluator。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LogRecordExpressionEvaluator extends CachedExpressionEvaluator {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Map&lt;ExpressionKey, Expression&gt; expressionCache = new ConcurrentHashMap&lt;&gt;(64);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final Map&lt;AnnotatedElementKey, Method&gt; targetMethodCache = new ConcurrentHashMap&lt;&gt;(64);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String parseExpression(String conditionExpression, AnnotatedElementKey methodKey, EvaluationContext evalContext) {</span></span>
<span class="line"><span>        return getExpression(this.expressionCache, methodKey, conditionExpression).getValue(evalContext, String.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>LogRecordExpressionEvaluator 继承自 CachedExpressionEvaluator 类，这个类里面有两个 Map，一个是 expressionCache 一个是 targetMethodCache。在上面的例子中可以看到，SpEL 会解析成一个 Expression 表达式，然后根据传入的 Object 获取到对应的值，所以 expressionCache 是为了缓存方法、表达式和 SpEL 的 Expression 的对应关系，让方法注解上添加的 SpEL 表达式只解析一次。下面的 targetMethodCache 是为了缓存传入到 Expression 表达式的 Object。核心的解析逻辑是上面最后一行代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>getExpression(this.expressionCache, methodKey, conditionExpression).getValue(evalContext, String.class);</span></span></code></pre></div><p>getExpression 方法会从 expressionCache 中获取到 @LogRecordAnnotation 注解上的表达式的解析 Expression 的实例，然后调用 getValue 方法，getValue 传入一个 evalContext 就是类似上面例子中的 order 对象。其中 Context 的实现将会在下文介绍。</p><ul><li><strong>日志上下文实现</strong></li></ul><p>下面的例子把变量放到了 LogRecordContext 中，然后 SpEL 表达式就可以顺利的解析方法上不存在的参数了，通过上面的 SpEL 的例子可以看出，要把方法的参数和 LogRecordContext 中的变量都放到 SpEL 的 getValue 方法的 Object 中才可以顺利的解析表达式的值。下面看看如何实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送员：从“{deveryUser{#oldDeliveryUserId}}”, 修改到“{deveryUser{#request.getUserId()}}”&quot;,</span></span>
<span class="line"><span>            bizNo=&quot;#request.getDeliveryOrderNo()&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request){</span></span>
<span class="line"><span>    // 查询出原来的地址是什么</span></span>
<span class="line"><span>    LogRecordContext.putVariable(&quot;oldDeliveryUserId&quot;, DeliveryService.queryOldDeliveryUserId(request.getDeliveryOrderNo()));</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 LogRecordValueParser 中创建了一个 EvaluationContext，用来给 SpEL 解析方法参数和 Context 中的变量。相关代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>EvaluationContext evaluationContext = expressionEvaluator.createEvaluationContext(method, args, targetClass, ret, errorMsg, beanFactory);</span></span></code></pre></div><p>在解析的时候调用 getValue 方法传入的参数 evalContext，就是上面这个 EvaluationContext 对象。下面是 LogRecordEvaluationContext 对象的继承体系：</p><p><img src="`+d+`" alt="error.图片加载失败"></p><p>LogRecordEvaluationContext 做了三个事情：</p><ul><li>把方法的参数都放到 SpEL 解析的 RootObject 中。</li><li>把 LogRecordContext 中的变量都放到 RootObject 中。</li><li>把方法的返回值和 ErrorMsg 都放到 RootObject 中。</li></ul><p>LogRecordEvaluationContext 的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LogRecordEvaluationContext extends MethodBasedEvaluationContext {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public LogRecordEvaluationContext(Object rootObject, Method method, Object[] arguments,</span></span>
<span class="line"><span>                                      ParameterNameDiscoverer parameterNameDiscoverer, Object ret, String errorMsg) {</span></span>
<span class="line"><span>       //把方法的参数都放到 SpEL 解析的 RootObject 中</span></span>
<span class="line"><span>       super(rootObject, method, arguments, parameterNameDiscoverer);</span></span>
<span class="line"><span>       //把 LogRecordContext 中的变量都放到 RootObject 中</span></span>
<span class="line"><span>        Map&lt;String, Object&gt; variables = LogRecordContext.getVariables();</span></span>
<span class="line"><span>        if (variables != null &amp;&amp; variables.size() &gt; 0) {</span></span>
<span class="line"><span>            for (Map.Entry&lt;String, Object&gt; entry : variables.entrySet()) {</span></span>
<span class="line"><span>                setVariable(entry.getKey(), entry.getValue());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //把方法的返回值和 ErrorMsg 都放到 RootObject 中</span></span>
<span class="line"><span>        setVariable(&quot;_ret&quot;, ret);</span></span>
<span class="line"><span>        setVariable(&quot;_errorMsg&quot;, errorMsg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是 LogRecordContext 的实现，这个类里面通过一个 ThreadLocal 变量保持了一个栈，栈里面是个 Map，Map 对应了变量的名称和变量的值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LogRecordContext {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final InheritableThreadLocal&lt;Stack&lt;Map&lt;String, Object&gt;&gt;&gt; variableMapStack = new InheritableThreadLocal&lt;&gt;();</span></span>
<span class="line"><span>   //其他省略....</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面使用了 InheritableThreadLocal，所以在线程池的场景下使用 LogRecordContext 会出现问题，如果支持线程池可以使用阿里巴巴开源的 TTL 框架。那这里为什么不直接设置一个 <code>ThreadLocal&lt;Map&lt;String, Object&gt;&gt;</code> 对象，而是要设置一个 Stack 结构呢？我们看一下这么做的原因是什么。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@LogRecord(content = &quot;修改了订单的配送员：从“{deveryUser{#oldDeliveryUserId}}”, 修改到“{deveryUser{#request.getUserId()}}”&quot;,</span></span>
<span class="line"><span>        bizNo=&quot;#request.getDeliveryOrderNo()&quot;)</span></span>
<span class="line"><span>public void modifyAddress(updateDeliveryRequest request){</span></span>
<span class="line"><span>    // 查询出原来的地址是什么</span></span>
<span class="line"><span>    LogRecordContext.putVariable(&quot;oldDeliveryUserId&quot;, DeliveryService.queryOldDeliveryUserId(request.getDeliveryOrderNo()));</span></span>
<span class="line"><span>    // 更新派送信息 电话，收件人、地址</span></span>
<span class="line"><span>    doUpdate(request);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面代码的执行流程如下：</p><p><img src="`+u+'" alt="error.图片加载失败"></p><p>看起来没有什么问题，但是使用 LogRecordAnnotation 的方法里面嵌套了另一个使用 LogRecordAnnotation 方法的时候，流程就变成下面的形式：</p><p><img src="'+g+`" alt="error.图片加载失败"></p><p>可以看到，当方法二执行了释放变量后，继续执行方法一的 logRecord 逻辑，此时解析的时候 <code>ThreadLocal&lt;Map&lt;String, Object&gt;&gt;</code>的 Map 已经被释放掉，所以方法一就获取不到对应的变量了。方法一和方法二共用一个变量 Map 还有个问题是：如果方法二设置了和方法一相同的变量两个方法的变量就会被相互覆盖。所以最终 LogRecordContext 的变量的生命周期需要是下面的形式：</p><p>LogRecordContext 每执行一个方法都会压栈一个 Map，方法执行完之后会 Pop 掉这个 Map，从而避免变量共享和覆盖问题。</p><ul><li><strong>默认操作人逻辑</strong></li></ul><p>在 LogRecordInterceptor 中 IOperatorGetService 接口，这个接口可以获取到当前的用户。下面是接口的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface IOperatorGetService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 可以在里面外部的获取当前登陆的用户，比如 UserContext.getCurrentUser()</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return 转换成Operator返回</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    Operator getUser();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面给出了从用户上下文中获取用户的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DefaultOperatorGetServiceImpl implements IOperatorGetService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Operator getUser() {</span></span>
<span class="line"><span>    //UserUtils 是获取用户上下文的方法</span></span>
<span class="line"><span>         return Optional.ofNullable(UserUtils.getUser())</span></span>
<span class="line"><span>                        .map(a -&gt; new Operator(a.getName(), a.getLogin()))</span></span>
<span class="line"><span>                        .orElseThrow(()-&gt;new IllegalArgumentException(&quot;user is null&quot;));</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>组件在解析 operator 的时候，就判断注解上的 operator 是否是空，如果注解上没有指定，我们就从 IOperatorGetService 的 getUser 方法获取了。如果都获取不到，就会报错。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String realOperatorId = &quot;&quot;;</span></span>
<span class="line"><span>if (StringUtils.isEmpty(operatorId)) {</span></span>
<span class="line"><span>    if (operatorGetService.getUser() == null || StringUtils.isEmpty(operatorGetService.getUser().getOperatorId())) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;user is null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    realOperatorId = operatorGetService.getUser().getOperatorId();</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    spElTemplates = Lists.newArrayList(bizKey, bizNo, action, operatorId, detail);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>自定义函数逻辑</strong></li></ul><p>自定义函数的类图如下：</p><p><img src="`+h+`" alt="error.图片加载失败"></p><p>下面是 IParseFunction 的接口定义：executeBefore 函数代表了自定义函数是否在业务代码执行之前解析，上面提到的查询修改之前的内容。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface IParseFunction {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  default boolean executeBefore(){</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  String functionName();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  String apply(String value);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ParseFunctionFactory 的代码比较简单，它的功能是把所有的 IParseFunction 注入到函数工厂中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ParseFunctionFactory {</span></span>
<span class="line"><span>  private Map&lt;String, IParseFunction&gt; allFunctionMap;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ParseFunctionFactory(List&lt;IParseFunction&gt; parseFunctions) {</span></span>
<span class="line"><span>    if (CollectionUtils.isEmpty(parseFunctions)) {</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    allFunctionMap = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    for (IParseFunction parseFunction : parseFunctions) {</span></span>
<span class="line"><span>      if (StringUtils.isEmpty(parseFunction.functionName())) {</span></span>
<span class="line"><span>        continue;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      allFunctionMap.put(parseFunction.functionName(), parseFunction);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public IParseFunction getFunction(String functionName) {</span></span>
<span class="line"><span>    return allFunctionMap.get(functionName);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean isBeforeFunction(String functionName) {</span></span>
<span class="line"><span>    return allFunctionMap.get(functionName) != null &amp;&amp; allFunctionMap.get(functionName).executeBefore();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DefaultFunctionServiceImpl 的逻辑就是根据传入的函数名称 functionName 找到对应的 IParseFunction，然后把参数传入到 IParseFunction 的 apply 方法上最后返回函数的值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DefaultFunctionServiceImpl implements IFunctionService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private final ParseFunctionFactory parseFunctionFactory;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public DefaultFunctionServiceImpl(ParseFunctionFactory parseFunctionFactory) {</span></span>
<span class="line"><span>    this.parseFunctionFactory = parseFunctionFactory;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public String apply(String functionName, String value) {</span></span>
<span class="line"><span>    IParseFunction function = parseFunctionFactory.getFunction(functionName);</span></span>
<span class="line"><span>    if (function == null) {</span></span>
<span class="line"><span>      return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return function.apply(value);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public boolean beforeFunction(String functionName) {</span></span>
<span class="line"><span>    return parseFunctionFactory.isBeforeFunction(functionName);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_4-2-3-日志持久化逻辑" tabindex="-1">4.2.3 日志持久化逻辑 <a class="header-anchor" href="#_4-2-3-日志持久化逻辑" aria-label="Permalink to &quot;4.2.3 日志持久化逻辑&quot;">​</a></h4><p>同样在 LogRecordInterceptor 的代码中引用了 ILogRecordService，这个 Service 主要包含了日志记录的接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ILogRecordService {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 保存 log</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param logRecord 日志实体</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    void record(LogRecord logRecord);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>业务可以实现这个保存接口，然后把日志保存在任何存储介质上。这里给了一个 2.2 节介绍的通过 log.info 保存在日志文件中的例子，业务可以把保存设置成异步或者同步，可以和业务放在一个事务中保证操作日志和业务的一致性，也可以新开辟一个事务，保证日志的错误不影响业务的事务。业务可以保存在 Elasticsearch、数据库或者文件中，用户可以根据日志结构和日志的存储实现相应的查询逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class DefaultLogRecordServiceImpl implements ILogRecordService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>//    @Transactional(propagation = Propagation.REQUIRES_NEW)</span></span>
<span class="line"><span>    public void record(LogRecord logRecord) {</span></span>
<span class="line"><span>        log.info(&quot;【logRecord】log={}&quot;, logRecord);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="_4-2-4-starter-逻辑封装" tabindex="-1">4.2.4 Starter 逻辑封装 <a class="header-anchor" href="#_4-2-4-starter-逻辑封装" aria-label="Permalink to &quot;4.2.4 Starter 逻辑封装&quot;">​</a></h4><p>上面逻辑代码已经介绍完毕，那么接下来需要把这些组件组装起来，然后让用户去使用。在使用这个组件的时候只需要在 Springboot 的入口上添加一个注解 <code>@EnableLogRecord(tenant = &quot;com.mzt.test&quot;)</code>。其中 tenant 代表租户，是为了多租户使用的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)</span></span>
<span class="line"><span>@EnableTransactionManagement</span></span>
<span class="line"><span>@EnableLogRecord(tenant = &quot;com.mzt.test&quot;)</span></span>
<span class="line"><span>public class Main {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        SpringApplication.run(Main.class, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再看下 EnableLogRecord 的代码，代码中 Import 了 LogRecordConfigureSelector.class，在 LogRecordConfigureSelector 类中暴露了 LogRecordProxyAutoConfiguration 类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.TYPE)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Import(LogRecordConfigureSelector.class)</span></span>
<span class="line"><span>public @interface EnableLogRecord {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String tenant();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AdviceMode mode() default AdviceMode.PROXY;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>LogRecordProxyAutoConfiguration 就是装配上面组件的核心类了，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class LogRecordProxyAutoConfiguration implements ImportAware {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private AnnotationAttributes enableLogRecord;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  @Role(BeanDefinition.ROLE_INFRASTRUCTURE)</span></span>
<span class="line"><span>  public LogRecordOperationSource logRecordOperationSource() {</span></span>
<span class="line"><span>    return new LogRecordOperationSource();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  @ConditionalOnMissingBean(IFunctionService.class)</span></span>
<span class="line"><span>  public IFunctionService functionService(ParseFunctionFactory parseFunctionFactory) {</span></span>
<span class="line"><span>    return new DefaultFunctionServiceImpl(parseFunctionFactory);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  public ParseFunctionFactory parseFunctionFactory(@Autowired List&lt;IParseFunction&gt; parseFunctions) {</span></span>
<span class="line"><span>    return new ParseFunctionFactory(parseFunctions);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  @ConditionalOnMissingBean(IParseFunction.class)</span></span>
<span class="line"><span>  public DefaultParseFunction parseFunction() {</span></span>
<span class="line"><span>    return new DefaultParseFunction();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  @Role(BeanDefinition.ROLE_INFRASTRUCTURE)</span></span>
<span class="line"><span>  public BeanFactoryLogRecordAdvisor logRecordAdvisor(IFunctionService functionService) {</span></span>
<span class="line"><span>    BeanFactoryLogRecordAdvisor advisor =</span></span>
<span class="line"><span>            new BeanFactoryLogRecordAdvisor();</span></span>
<span class="line"><span>    advisor.setLogRecordOperationSource(logRecordOperationSource());</span></span>
<span class="line"><span>    advisor.setAdvice(logRecordInterceptor(functionService));</span></span>
<span class="line"><span>    return advisor;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  @Role(BeanDefinition.ROLE_INFRASTRUCTURE)</span></span>
<span class="line"><span>  public LogRecordInterceptor logRecordInterceptor(IFunctionService functionService) {</span></span>
<span class="line"><span>    LogRecordInterceptor interceptor = new LogRecordInterceptor();</span></span>
<span class="line"><span>    interceptor.setLogRecordOperationSource(logRecordOperationSource());</span></span>
<span class="line"><span>    interceptor.setTenant(enableLogRecord.getString(&quot;tenant&quot;));</span></span>
<span class="line"><span>    interceptor.setFunctionService(functionService);</span></span>
<span class="line"><span>    return interceptor;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  @ConditionalOnMissingBean(IOperatorGetService.class)</span></span>
<span class="line"><span>  @Role(BeanDefinition.ROLE_APPLICATION)</span></span>
<span class="line"><span>  public IOperatorGetService operatorGetService() {</span></span>
<span class="line"><span>    return new DefaultOperatorGetServiceImpl();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Bean</span></span>
<span class="line"><span>  @ConditionalOnMissingBean(ILogRecordService.class)</span></span>
<span class="line"><span>  @Role(BeanDefinition.ROLE_APPLICATION)</span></span>
<span class="line"><span>  public ILogRecordService recordService() {</span></span>
<span class="line"><span>    return new DefaultLogRecordServiceImpl();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void setImportMetadata(AnnotationMetadata importMetadata) {</span></span>
<span class="line"><span>    this.enableLogRecord = AnnotationAttributes.fromMap(</span></span>
<span class="line"><span>            importMetadata.getAnnotationAttributes(EnableLogRecord.class.getName(), false));</span></span>
<span class="line"><span>    if (this.enableLogRecord == null) {</span></span>
<span class="line"><span>      log.info(&quot;@EnableCaching is not present on importing class&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个类继承 ImportAware 是为了拿到 EnableLogRecord 上的租户属性，这个类使用变量 logRecordAdvisor 和 logRecordInterceptor 装配了 AOP，同时把自定义函数注入到了 logRecordAdvisor 中。</p><p><strong>对外扩展类</strong>：分别是IOperatorGetService、ILogRecordService、IParseFunction。业务可以自己实现相应的接口，因为配置了 @ConditionalOnMissingBean，所以用户的实现类会覆盖组件内的默认实现。</p><h2 id="_5-总结" tabindex="-1">5. 总结 <a class="header-anchor" href="#_5-总结" aria-label="Permalink to &quot;5\\. 总结&quot;">​</a></h2><p>这篇文章介绍了操作日志的常见写法，以及如何让操作日志的实现更加简单、易懂，通过组件的四个模块，介绍了组件的具体实现。对于上面的组件介绍，大家如果有疑问，也欢迎在文末留言，我们会进行答疑。</p><h2 id="_6-参考资料" tabindex="-1">6. 参考资料 <a class="header-anchor" href="#_6-参考资料" aria-label="Permalink to &quot;6\\. 参考资料&quot;">​</a></h2><ul><li>Canal</li><li>Spring-Framework</li><li>Spring Expression Language (SpEL)</li><li>ThreadLocal、InheritableThreadLocal、TransmittableThreadLocal三者之间区别</li></ul><h2 id="_7-作者简介" tabindex="-1">7. 作者简介 <a class="header-anchor" href="#_7-作者简介" aria-label="Permalink to &quot;7\\. 作者简介&quot;">​</a></h2><p>转载说明:</p><ul><li>作者：站通，2020年加入美团，基础研发平台/研发质量及效率部工程师。</li><li>版权声明：本文为「美团技术团队」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。</li><li>原文链接：<a href="https://mp.weixin.qq.com/s/JC51S%5C_bI02npm4CE5NEEow" target="_blank" rel="noreferrer">https://mp.weixin.qq.com/s/JC51S\\_bI02npm4CE5NEEow</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,151)]))}const L=n(v,[["render",b]]);export{x as __pageData,L as default};
