import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/tomcat/tomcat-x-connector-1.jpg",g=JSON.parse('{"title":"Tomcat - Request请求处理过程：Connector","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-connector.md","filePath":"framework/tomcat/tomcat-x-connector.md","lastUpdated":1737706346000}'),t={name:"framework/tomcat/tomcat-x-connector.md"};function i(o,n,c,r,d,u){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="tomcat-request请求处理过程-connector" tabindex="-1">Tomcat - Request请求处理过程：Connector <a class="header-anchor" href="#tomcat-request请求处理过程-connector" aria-label="Permalink to &quot;Tomcat - Request请求处理过程：Connector&quot;">​</a></h1><blockquote><p>本文主要介绍request请求的处理过程。</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><ul><li><p>线程池Executor是在哪里启动的？</p></li><li><p>Request是如何处理并交个Container处理的？</p></li><li><p>Tomcat支持哪些协议？这些协议是处理的？协议层次结构如何设计的？</p></li></ul><h2 id="connector" tabindex="-1">Connector <a class="header-anchor" href="#connector" aria-label="Permalink to &quot;Connector&quot;">​</a></h2><h3 id="connector构造" tabindex="-1">Connector构造 <a class="header-anchor" href="#connector构造" aria-label="Permalink to &quot;Connector构造&quot;">​</a></h3><p>本质是初始化了ProtocolHandler，默认是HTTP/1.1 NIO实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Defaults to using HTTP/1.1 NIO implementation.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Connector() {</span></span>
<span class="line"><span>    this(&quot;HTTP/1.1&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Connector(String protocol) {</span></span>
<span class="line"><span>    boolean apr = AprStatus.isAprAvailable() &amp;&amp;</span></span>
<span class="line"><span>        AprStatus.getUseAprConnector();</span></span>
<span class="line"><span>    ProtocolHandler p = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        p = ProtocolHandler.create(protocol, apr);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        log.error(sm.getString(</span></span>
<span class="line"><span>                &quot;coyoteConnector.protocolHandlerInstantiationFailed&quot;), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (p != null) {</span></span>
<span class="line"><span>        protocolHandler = p;</span></span>
<span class="line"><span>        protocolHandlerClassName = protocolHandler.getClass().getName();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        protocolHandler = null;</span></span>
<span class="line"><span>        protocolHandlerClassName = protocol;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // Default for Connector depends on this system property</span></span>
<span class="line"><span>    setThrowOnFailure(Boolean.getBoolean(&quot;org.apache.catalina.startup.EXIT_ON_INIT_FAILURE&quot;));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ProtocolHandler是怎么通过protocol初始化实现的呢？我们看下<code>ProtocolHandler.create(protocol, apr)</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static ProtocolHandler create(String protocol, boolean apr)</span></span>
<span class="line"><span>        throws ClassNotFoundException, InstantiationException, IllegalAccessException,</span></span>
<span class="line"><span>        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {</span></span>
<span class="line"><span>    if (protocol == null || &quot;HTTP/1.1&quot;.equals(protocol)</span></span>
<span class="line"><span>            || (!apr &amp;&amp; org.apache.coyote.http11.Http11NioProtocol.class.getName().equals(protocol))</span></span>
<span class="line"><span>            || (apr &amp;&amp; org.apache.coyote.http11.Http11AprProtocol.class.getName().equals(protocol))) {</span></span>
<span class="line"><span>        if (apr) {</span></span>
<span class="line"><span>            return new org.apache.coyote.http11.Http11AprProtocol();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return new org.apache.coyote.http11.Http11NioProtocol();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else if (&quot;AJP/1.3&quot;.equals(protocol)</span></span>
<span class="line"><span>            || (!apr &amp;&amp; org.apache.coyote.ajp.AjpNioProtocol.class.getName().equals(protocol))</span></span>
<span class="line"><span>            || (apr &amp;&amp; org.apache.coyote.ajp.AjpAprProtocol.class.getName().equals(protocol))) {</span></span>
<span class="line"><span>        if (apr) {</span></span>
<span class="line"><span>            return new org.apache.coyote.ajp.AjpAprProtocol();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return new org.apache.coyote.ajp.AjpNioProtocol();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        // Instantiate protocol handler</span></span>
<span class="line"><span>        Class&lt;?&gt; clazz = Class.forName(protocol);</span></span>
<span class="line"><span>        return (ProtocolHandler) clazz.getConstructor().newInstance();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到上述方法实际通过Protocol初始化了ProtocolHandler, 我们看下它所支持的HTTP1.1，Ajp协议的处理，我们通过它的类层次结构来看协议支持处理类</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h3 id="connector初始化" tabindex="-1">Connector初始化 <a class="header-anchor" href="#connector初始化" aria-label="Permalink to &quot;Connector初始化&quot;">​</a></h3><p>在JMX的初始化模板方法<code>initInternal</code>中，进行了Connector的初始化，它做了哪些事呢？</p><ul><li>给protocolHandler初始化了adapter //这adapter是真正衔接Container处理的适配器，后文我们会有详解。</li><li>设置parseBody的方法，默认为POST方法</li><li>一些校验</li><li>调用protocolHandler的init</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void initInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    super.initInternal();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (protocolHandler == null) {</span></span>
<span class="line"><span>        throw new LifecycleException(</span></span>
<span class="line"><span>                sm.getString(&quot;coyoteConnector.protocolHandlerInstantiationFailed&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化 adapter</span></span>
<span class="line"><span>    adapter = new CoyoteAdapter(this);</span></span>
<span class="line"><span>    protocolHandler.setAdapter(adapter); // 交给protocolHandler</span></span>
<span class="line"><span>    if (service != null) {</span></span>
<span class="line"><span>        protocolHandler.setUtilityExecutor(service.getServer().getUtilityExecutor());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置parseBody的方法，默认为POST</span></span>
<span class="line"><span>    if (null == parseBodyMethodsSet) {</span></span>
<span class="line"><span>        setParseBodyMethods(getParseBodyMethods());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 校验</span></span>
<span class="line"><span>    if (protocolHandler.isAprRequired() &amp;&amp; !AprStatus.isInstanceCreated()) {</span></span>
<span class="line"><span>        throw new LifecycleException(sm.getString(&quot;coyoteConnector.protocolHandlerNoAprListener&quot;,</span></span>
<span class="line"><span>                getProtocolHandlerClassName()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (protocolHandler.isAprRequired() &amp;&amp; !AprStatus.isAprAvailable()) {</span></span>
<span class="line"><span>        throw new LifecycleException(sm.getString(&quot;coyoteConnector.protocolHandlerNoAprLibrary&quot;,</span></span>
<span class="line"><span>                getProtocolHandlerClassName()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (AprStatus.isAprAvailable() &amp;&amp; AprStatus.getUseOpenSSL() &amp;&amp;</span></span>
<span class="line"><span>            protocolHandler instanceof AbstractHttp11JsseProtocol) {</span></span>
<span class="line"><span>        AbstractHttp11JsseProtocol&lt;?&gt; jsseProtocolHandler =</span></span>
<span class="line"><span>                (AbstractHttp11JsseProtocol&lt;?&gt;) protocolHandler;</span></span>
<span class="line"><span>        if (jsseProtocolHandler.isSSLEnabled() &amp;&amp;</span></span>
<span class="line"><span>                jsseProtocolHandler.getSslImplementationName() == null) {</span></span>
<span class="line"><span>            // OpenSSL is compatible with the JSSE configuration, so use it if APR is available</span></span>
<span class="line"><span>            jsseProtocolHandler.setSslImplementationName(OpenSSLImplementation.class.getName());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 调用protocolHandler的init</span></span>
<span class="line"><span>        protocolHandler.init(); </span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        throw new LifecycleException(</span></span>
<span class="line"><span>                sm.getString(&quot;coyoteConnector.protocolHandlerInitializationFailed&quot;), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>protocolHandler的init做了什么？本质上调用了AbstractEndpoint的init方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Endpoint that provides low-level network I/O - must be matched to the</span></span>
<span class="line"><span>  * ProtocolHandler implementation (ProtocolHandler using NIO, requires NIO</span></span>
<span class="line"><span>  * Endpoint etc.).</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private final AbstractEndpoint&lt;S,?&gt; endpoint;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void init() throws Exception {</span></span>
<span class="line"><span>    if (getLog().isInfoEnabled()) {</span></span>
<span class="line"><span>        getLog().info(sm.getString(&quot;abstractProtocolHandler.init&quot;, getName()));</span></span>
<span class="line"><span>        logPortOffset();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (oname == null) {</span></span>
<span class="line"><span>        // Component not pre-registered so register it</span></span>
<span class="line"><span>        oname = createObjectName();</span></span>
<span class="line"><span>        if (oname != null) {</span></span>
<span class="line"><span>            Registry.getRegistry(null, null).registerComponent(this, oname, null);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (this.domain != null) {</span></span>
<span class="line"><span>        rgOname = new ObjectName(domain + &quot;:type=GlobalRequestProcessor,name=&quot; + getName());</span></span>
<span class="line"><span>        Registry.getRegistry(null, null).registerComponent(</span></span>
<span class="line"><span>                getHandler().getGlobal(), rgOname, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String endpointName = getName();</span></span>
<span class="line"><span>    endpoint.setName(endpointName.substring(1, endpointName.length()-1));</span></span>
<span class="line"><span>    endpoint.setDomain(domain);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    endpoint.init();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>endpoint.init()</code>做了什么呢？之前的版本中是直接调用bind方法，这里改成了bindWithCleanup, 变化点在于失败后的清理操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final void init() throws Exception {</span></span>
<span class="line"><span>    if (bindOnInit) {</span></span>
<span class="line"><span>        bindWithCleanup(); // 看这里</span></span>
<span class="line"><span>        bindState = BindState.BOUND_ON_INIT;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 下面就是注册JMX，前文我们有讲</span></span>
<span class="line"><span>    if (this.domain != null) {</span></span>
<span class="line"><span>        // Register endpoint (as ThreadPool - historical name)</span></span>
<span class="line"><span>        oname = new ObjectName(domain + &quot;:type=ThreadPool,name=\\&quot;&quot; + getName() + &quot;\\&quot;&quot;);</span></span>
<span class="line"><span>        Registry.getRegistry(null, null).registerComponent(this, oname, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ObjectName socketPropertiesOname = new ObjectName(domain +</span></span>
<span class="line"><span>                &quot;:type=SocketProperties,name=\\&quot;&quot; + getName() + &quot;\\&quot;&quot;);</span></span>
<span class="line"><span>        socketProperties.setObjectName(socketPropertiesOname);</span></span>
<span class="line"><span>        Registry.getRegistry(null, null).registerComponent(socketProperties, socketPropertiesOname, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (SSLHostConfig sslHostConfig : findSslHostConfigs()) {</span></span>
<span class="line"><span>            registerJmx(sslHostConfig);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>bindWithCleanup()</code>做了bind方法，如果绑定失败就回调unbind方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void bindWithCleanup() throws Exception {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        bind();</span></span>
<span class="line"><span>    } catch (Throwable t) {</span></span>
<span class="line"><span>        // Ensure open sockets etc. are cleaned up if something goes</span></span>
<span class="line"><span>        // wrong during bind</span></span>
<span class="line"><span>        ExceptionUtils.handleThrowable(t);</span></span>
<span class="line"><span>        unbind();</span></span>
<span class="line"><span>        throw t;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>bind()</code>方法做了初始化ServerSocket和初始化ssl</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Initialize the endpoint.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void bind() throws Exception {</span></span>
<span class="line"><span>    initServerSocket();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setStopLatch(new CountDownLatch(1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Initialize SSL if needed</span></span>
<span class="line"><span>    initialiseSsl();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    selectorPool.open(getName());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Separated out to make it easier for folks that extend NioEndpoint to</span></span>
<span class="line"><span>// implement custom [server]sockets</span></span>
<span class="line"><span>protected void initServerSocket() throws Exception {</span></span>
<span class="line"><span>    if (!getUseInheritedChannel()) {</span></span>
<span class="line"><span>        serverSock = ServerSocketChannel.open(); // 打开ServerSocket通道</span></span>
<span class="line"><span>        socketProperties.setProperties(serverSock.socket());</span></span>
<span class="line"><span>        InetSocketAddress addr = new InetSocketAddress(getAddress(), getPortWithOffset());</span></span>
<span class="line"><span>        serverSock.socket().bind(addr,getAcceptCount()); // 绑定到指定服务地址和端口，这样你才可以通过这个访问服务（处理请求）</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        // Retrieve the channel provided by the OS</span></span>
<span class="line"><span>        Channel ic = System.inheritedChannel();</span></span>
<span class="line"><span>        if (ic instanceof ServerSocketChannel) {</span></span>
<span class="line"><span>            serverSock = (ServerSocketChannel) ic;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (serverSock == null) {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(sm.getString(&quot;endpoint.init.bind.inherited&quot;));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    serverSock.configureBlocking(true); //mimic APR behavior</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="connector的启动" tabindex="-1">Connector的启动 <a class="header-anchor" href="#connector的启动" aria-label="Permalink to &quot;Connector的启动&quot;">​</a></h3><p>这里依然是调用JMX的模板方法startInternal方法, start方法本质就是委托给<code>protocolHandler</code>处理，调用它的start方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Begin processing requests via this Connector.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception LifecycleException if a fatal startup error occurs</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Validate settings before starting</span></span>
<span class="line"><span>    if (getPortWithOffset() &lt; 0) {</span></span>
<span class="line"><span>        throw new LifecycleException(sm.getString(</span></span>
<span class="line"><span>                &quot;coyoteConnector.invalidPort&quot;, Integer.valueOf(getPortWithOffset())));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setState(LifecycleState.STARTING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        protocolHandler.start();</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        throw new LifecycleException(</span></span>
<span class="line"><span>                sm.getString(&quot;coyoteConnector.protocolHandlerStartFailed&quot;), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>protocolHandler.start()</code>方法如下，它又交给endpoint进行start处理</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void start() throws Exception {</span></span>
<span class="line"><span>    if (getLog().isInfoEnabled()) {</span></span>
<span class="line"><span>        getLog().info(sm.getString(&quot;abstractProtocolHandler.start&quot;, getName()));</span></span>
<span class="line"><span>        logPortOffset();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 本质是调用endpoint的start方法</span></span>
<span class="line"><span>    endpoint.start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 启动一个异步的线程，处理startAsyncTimeout方法，每隔60秒执行一次</span></span>
<span class="line"><span>    monitorFuture = getUtilityExecutor().scheduleWithFixedDelay(</span></span>
<span class="line"><span>            new Runnable() {</span></span>
<span class="line"><span>                @Override</span></span>
<span class="line"><span>                public void run() {</span></span>
<span class="line"><span>                    if (!isPaused()) {</span></span>
<span class="line"><span>                        startAsyncTimeout();</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }, 0, 60, TimeUnit.SECONDS);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>endpoint.start()</code>就是调用startInternal方法。当然它会先检查是否绑定端口，没有绑定便执行bindWithCleanup方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final void start() throws Exception {</span></span>
<span class="line"><span>    if (bindState == BindState.UNBOUND) {</span></span>
<span class="line"><span>        bindWithCleanup();</span></span>
<span class="line"><span>        bindState = BindState.BOUND_ON_START;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    startInternal();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看下NIOEndPoint的<code>startInternal</code>方法做了啥</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Start the NIO endpoint, creating acceptor, poller threads.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void startInternal() throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!running) {</span></span>
<span class="line"><span>        running = true;</span></span>
<span class="line"><span>        paused = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (socketProperties.getProcessorCache() != 0) {</span></span>
<span class="line"><span>            processorCache = new SynchronizedStack&lt;&gt;(SynchronizedStack.DEFAULT_SIZE,</span></span>
<span class="line"><span>                    socketProperties.getProcessorCache());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (socketProperties.getEventCache() != 0) {</span></span>
<span class="line"><span>            eventCache = new SynchronizedStack&lt;&gt;(SynchronizedStack.DEFAULT_SIZE,</span></span>
<span class="line"><span>                    socketProperties.getEventCache());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (socketProperties.getBufferPool() != 0) {</span></span>
<span class="line"><span>            nioChannels = new SynchronizedStack&lt;&gt;(SynchronizedStack.DEFAULT_SIZE,</span></span>
<span class="line"><span>                    socketProperties.getBufferPool());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 重点：创建了Executor</span></span>
<span class="line"><span>        if (getExecutor() == null) {</span></span>
<span class="line"><span>            createExecutor();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        initializeConnectionLatch();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Start poller thread</span></span>
<span class="line"><span>        poller = new Poller();</span></span>
<span class="line"><span>        Thread pollerThread = new Thread(poller, getName() + &quot;-ClientPoller&quot;);</span></span>
<span class="line"><span>        pollerThread.setPriority(threadPriority);</span></span>
<span class="line"><span>        pollerThread.setDaemon(true);</span></span>
<span class="line"><span>        pollerThread.start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        startAcceptorThread();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>createExecutor()</code>方法如下，本质是创建一个ThreadPoolExecutor</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void createExecutor() {</span></span>
<span class="line"><span>    internalExecutor = true;</span></span>
<span class="line"><span>    TaskQueue taskqueue = new TaskQueue();</span></span>
<span class="line"><span>    TaskThreadFactory tf = new TaskThreadFactory(getName() + &quot;-exec-&quot;, daemon, getThreadPriority());</span></span>
<span class="line"><span>    executor = new ThreadPoolExecutor(getMinSpareThreads(), getMaxThreads(), 60, TimeUnit.SECONDS,taskqueue, tf);</span></span>
<span class="line"><span>    taskqueue.setParent( (ThreadPoolExecutor) executor);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,36)]))}const m=s(t,[["render",i]]);export{g as __pageData,m as default};
