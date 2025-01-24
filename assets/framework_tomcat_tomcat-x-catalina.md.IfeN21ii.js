import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/tomcat/tomcat-x-catalina-1.png",t="/vitepress-blog-template/images/tomcat/tomcat-x-catalina-2.png",m=JSON.parse('{"title":"Tomcat - 启动过程:Catalina的加载","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-catalina.md","filePath":"framework/tomcat/tomcat-x-catalina.md","lastUpdated":1737706346000}'),i={name:"framework/tomcat/tomcat-x-catalina.md"};function o(c,a,r,d,u,g){return e(),s("div",null,a[0]||(a[0]=[p('<h1 id="tomcat-启动过程-catalina的加载" tabindex="-1">Tomcat - 启动过程:Catalina的加载 <a class="header-anchor" href="#tomcat-启动过程-catalina的加载" aria-label="Permalink to &quot;Tomcat - 启动过程:Catalina的加载&quot;">​</a></h1><blockquote><p>通过前两篇文章，我们知道了<a href="https://pdai.tech/md/framework/tomcat/tomcat-x-classloader.html" target="_blank" rel="noreferrer">Tomcat的类加载机制</a>和<a href="https://pdai.tech/md/framework/tomcat/tomcat-x-start.html" target="_blank" rel="noreferrer">整体的组件加载流程</a>；我们也知道通过Bootstrap初始化的catalinaClassLoader加载了Catalina，那么进而引入了一个问题就是Catalina是如何加载的呢？加载了什么呢？本文将带你进一步分析。@pdai</p></blockquote><h2 id="catalina的引入" tabindex="-1">Catalina的引入 <a class="header-anchor" href="#catalina的引入" aria-label="Permalink to &quot;Catalina的引入&quot;">​</a></h2><blockquote><p>通过前两篇文章，我们知道了Tomcat的类加载机制和整体的组件加载流程；我们也知道通过Bootstrap初始化的catalinaClassLoader加载了Catalina，那么进而引入了一个问题就是Catalina是如何加载的呢？加载了什么呢？</p></blockquote><ul><li>先回顾下整个流程，和我们分析的阶段</li></ul><p><img src="'+l+`" alt="error.图片加载失败"></p><ul><li>看下Bootstrap中Load的过程</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 加载守护进程</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private void load(String[] arguments) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Call the load() method</span></span>
<span class="line"><span>    String methodName = &quot;load&quot;;</span></span>
<span class="line"><span>    Object param[];</span></span>
<span class="line"><span>    Class&lt;?&gt; paramTypes[];</span></span>
<span class="line"><span>    if (arguments==null || arguments.length==0) {</span></span>
<span class="line"><span>        paramTypes = null;</span></span>
<span class="line"><span>        param = null;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        paramTypes = new Class[1];</span></span>
<span class="line"><span>        paramTypes[0] = arguments.getClass();</span></span>
<span class="line"><span>        param = new Object[1];</span></span>
<span class="line"><span>        param[0] = arguments;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Method method =</span></span>
<span class="line"><span>        catalinaDaemon.getClass().getMethod(methodName, paramTypes); </span></span>
<span class="line"><span>    if (log.isDebugEnabled()) {</span></span>
<span class="line"><span>        log.debug(&quot;Calling startup class &quot; + method);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    method.invoke(catalinaDaemon, param);// 本质上就是调用catalina的load方法</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="catalina的加载" tabindex="-1">Catalina的加载 <a class="header-anchor" href="#catalina的加载" aria-label="Permalink to &quot;Catalina的加载&quot;">​</a></h2><p>上一步，我们知道catalina load的触发，因为有参数所以是load(String[])方法。我们进而看下这个load方法做了什么？</p><ul><li>load(String[])本质上还是调用了load方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span>  * Load using arguments</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void load(String args[]) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (arguments(args)) { // 处理命令行的参数</span></span>
<span class="line"><span>            load();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace(System.out);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>load加载过程本质上是初始化Server的实例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Start a new server instance.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void load() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果已经加载则退出</span></span>
<span class="line"><span>    if (loaded) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    loaded = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long t1 = System.nanoTime();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // （已经弃用）</span></span>
<span class="line"><span>    initDirs();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Before digester - it may be needed</span></span>
<span class="line"><span>    initNaming();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 解析 server.xml</span></span>
<span class="line"><span>    parseServerXml(true);</span></span>
<span class="line"><span>    Server s = getServer();</span></span>
<span class="line"><span>    if (s == null) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    getServer().setCatalina(this);</span></span>
<span class="line"><span>    getServer().setCatalinaHome(Bootstrap.getCatalinaHomeFile());</span></span>
<span class="line"><span>    getServer().setCatalinaBase(Bootstrap.getCatalinaBaseFile());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stream redirection</span></span>
<span class="line"><span>    initStreams();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 启动Server</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        getServer().init();</span></span>
<span class="line"><span>    } catch (LifecycleException e) {</span></span>
<span class="line"><span>        if (Boolean.getBoolean(&quot;org.apache.catalina.startup.EXIT_ON_INIT_FAILURE&quot;)) {</span></span>
<span class="line"><span>            throw new java.lang.Error(e);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            log.error(sm.getString(&quot;catalina.initError&quot;), e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(log.isInfoEnabled()) {</span></span>
<span class="line"><span>        log.info(sm.getString(&quot;catalina.init&quot;, Long.toString(TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - t1))));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>总体流程如下：</p><p><img src="`+t+`" alt="error.图片加载失败"></p><h3 id="initdirs" tabindex="-1">initDirs <a class="header-anchor" href="#initdirs" aria-label="Permalink to &quot;initDirs&quot;">​</a></h3><p>已经弃用了，Tomcat10会删除这个方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * @deprecated unused. Will be removed in Tomcat 10 onwards.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Deprecated</span></span>
<span class="line"><span>protected void initDirs() {</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="initnaming" tabindex="-1">initNaming <a class="header-anchor" href="#initnaming" aria-label="Permalink to &quot;initNaming&quot;">​</a></h3><p>设置额外的系统变量</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void initNaming() {</span></span>
<span class="line"><span>  // Setting additional variables</span></span>
<span class="line"><span>  if (!useNaming) {</span></span>
<span class="line"><span>      log.info(sm.getString(&quot;catalina.noNaming&quot;));</span></span>
<span class="line"><span>      System.setProperty(&quot;catalina.useNaming&quot;, &quot;false&quot;);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>      System.setProperty(&quot;catalina.useNaming&quot;, &quot;true&quot;);</span></span>
<span class="line"><span>      String value = &quot;org.apache.naming&quot;;</span></span>
<span class="line"><span>      String oldValue =</span></span>
<span class="line"><span>          System.getProperty(javax.naming.Context.URL_PKG_PREFIXES);</span></span>
<span class="line"><span>      if (oldValue != null) {</span></span>
<span class="line"><span>          value = value + &quot;:&quot; + oldValue;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      System.setProperty(javax.naming.Context.URL_PKG_PREFIXES, value);</span></span>
<span class="line"><span>      if( log.isDebugEnabled() ) {</span></span>
<span class="line"><span>          log.debug(&quot;Setting naming prefix=&quot; + value);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      value = System.getProperty</span></span>
<span class="line"><span>          (javax.naming.Context.INITIAL_CONTEXT_FACTORY);</span></span>
<span class="line"><span>      if (value == null) {</span></span>
<span class="line"><span>          System.setProperty</span></span>
<span class="line"><span>              (javax.naming.Context.INITIAL_CONTEXT_FACTORY,</span></span>
<span class="line"><span>                &quot;org.apache.naming.java.javaURLContextFactory&quot;);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>          log.debug(&quot;INITIAL_CONTEXT_FACTORY already set &quot; + value );</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="server-xml的解析" tabindex="-1">Server.xml的解析 <a class="header-anchor" href="#server-xml的解析" aria-label="Permalink to &quot;Server.xml的解析&quot;">​</a></h3><p>分三大块，下面的代码还是很清晰的:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void parseServerXml(boolean start) {</span></span>
<span class="line"><span>    // Set configuration source</span></span>
<span class="line"><span>    ConfigFileLoader.setSource(new CatalinaBaseConfigurationSource(Bootstrap.getCatalinaBaseFile(), getConfigFile()));</span></span>
<span class="line"><span>    File file = configFile();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (useGeneratedCode &amp;&amp; !Digester.isGeneratedCodeLoaderSet()) {</span></span>
<span class="line"><span>        // Load loader</span></span>
<span class="line"><span>        String loaderClassName = generatedCodePackage + &quot;.DigesterGeneratedCodeLoader&quot;;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Digester.GeneratedCodeLoader loader =</span></span>
<span class="line"><span>                    (Digester.GeneratedCodeLoader) Catalina.class.getClassLoader().loadClass(loaderClassName).newInstance();</span></span>
<span class="line"><span>            Digester.setGeneratedCodeLoader(loader);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            if (log.isDebugEnabled()) {</span></span>
<span class="line"><span>                log.info(sm.getString(&quot;catalina.noLoader&quot;, loaderClassName), e);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                log.info(sm.getString(&quot;catalina.noLoader&quot;, loaderClassName));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // No loader so don&#39;t use generated code</span></span>
<span class="line"><span>            useGeneratedCode = false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化server.xml的位置</span></span>
<span class="line"><span>    File serverXmlLocation = null;</span></span>
<span class="line"><span>    String xmlClassName = null;</span></span>
<span class="line"><span>    if (generateCode || useGeneratedCode) {</span></span>
<span class="line"><span>        xmlClassName = start ? generatedCodePackage + &quot;.ServerXml&quot; : generatedCodePackage + &quot;.ServerXmlStop&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (generateCode) {</span></span>
<span class="line"><span>        if (generatedCodeLocationParameter != null) {</span></span>
<span class="line"><span>            generatedCodeLocation = new File(generatedCodeLocationParameter);</span></span>
<span class="line"><span>            if (!generatedCodeLocation.isAbsolute()) {</span></span>
<span class="line"><span>                generatedCodeLocation = new File(Bootstrap.getCatalinaHomeFile(), generatedCodeLocationParameter);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            generatedCodeLocation = new File(Bootstrap.getCatalinaHomeFile(), &quot;work&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        serverXmlLocation = new File(generatedCodeLocation, generatedCodePackage);</span></span>
<span class="line"><span>        if (!serverXmlLocation.isDirectory() &amp;&amp; !serverXmlLocation.mkdirs()) {</span></span>
<span class="line"><span>            log.warn(sm.getString(&quot;catalina.generatedCodeLocationError&quot;, generatedCodeLocation.getAbsolutePath()));</span></span>
<span class="line"><span>            // Disable code generation</span></span>
<span class="line"><span>            generateCode = false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 用 SAXParser 来解析 xml，解析完了之后，xml 里定义的各种标签就有对应的实现类对象了</span></span>
<span class="line"><span>    ServerXml serverXml = null;</span></span>
<span class="line"><span>    if (useGeneratedCode) {</span></span>
<span class="line"><span>        serverXml = (ServerXml) Digester.loadGeneratedClass(xmlClassName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (serverXml != null) {</span></span>
<span class="line"><span>        serverXml.load(this);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        try (ConfigurationSource.Resource resource = ConfigFileLoader.getSource().getServerXml()) {</span></span>
<span class="line"><span>            // Create and execute our Digester</span></span>
<span class="line"><span>            Digester digester = start ? createStartDigester() : createStopDigester();</span></span>
<span class="line"><span>            InputStream inputStream = resource.getInputStream();</span></span>
<span class="line"><span>            InputSource inputSource = new InputSource(resource.getURI().toURL().toString());</span></span>
<span class="line"><span>            inputSource.setByteStream(inputStream);</span></span>
<span class="line"><span>            digester.push(this);</span></span>
<span class="line"><span>            if (generateCode) {</span></span>
<span class="line"><span>                digester.startGeneratingCode();</span></span>
<span class="line"><span>                generateClassHeader(digester, start);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            digester.parse(inputSource);</span></span>
<span class="line"><span>            if (generateCode) {</span></span>
<span class="line"><span>                generateClassFooter(digester);</span></span>
<span class="line"><span>                try (FileWriter writer = new FileWriter(new File(serverXmlLocation,</span></span>
<span class="line"><span>                        start ? &quot;ServerXml.java&quot; : &quot;ServerXmlStop.java&quot;))) {</span></span>
<span class="line"><span>                    writer.write(digester.getGeneratedCode().toString());</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                digester.endGeneratingCode();</span></span>
<span class="line"><span>                Digester.addGeneratedClass(xmlClassName);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            log.warn(sm.getString(&quot;catalina.configFail&quot;, file.getAbsolutePath()), e);</span></span>
<span class="line"><span>            if (file.exists() &amp;&amp; !file.canRead()) {</span></span>
<span class="line"><span>                log.warn(sm.getString(&quot;catalina.incorrectPermissions&quot;));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="initstreams" tabindex="-1">initStreams <a class="header-anchor" href="#initstreams" aria-label="Permalink to &quot;initStreams&quot;">​</a></h3><p>替换掉System.out, System.err为自定义的PrintStream</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void initStreams() {</span></span>
<span class="line"><span>    // Replace System.out and System.err with a custom PrintStream</span></span>
<span class="line"><span>    System.setOut(new SystemLogHandler(System.out));</span></span>
<span class="line"><span>    System.setErr(new SystemLogHandler(System.err));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="catalina-的启动" tabindex="-1">Catalina 的启动 <a class="header-anchor" href="#catalina-的启动" aria-label="Permalink to &quot;Catalina 的启动&quot;">​</a></h2><p>在 load 方法之后，Tomcat 就初始化了一系列的组件，接着就可以调用 start 方法进行启动了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Start a new server instance.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void start() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (getServer() == null) {</span></span>
<span class="line"><span>        load();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (getServer() == null) {</span></span>
<span class="line"><span>        log.fatal(sm.getString(&quot;catalina.noServer&quot;));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long t1 = System.nanoTime();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start the new server</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        getServer().start();</span></span>
<span class="line"><span>    } catch (LifecycleException e) {</span></span>
<span class="line"><span>        log.fatal(sm.getString(&quot;catalina.serverStartFail&quot;), e);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            getServer().destroy();</span></span>
<span class="line"><span>        } catch (LifecycleException e1) {</span></span>
<span class="line"><span>            log.debug(&quot;destroy() failed for failed Server &quot;, e1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long t2 = System.nanoTime();</span></span>
<span class="line"><span>    if(log.isInfoEnabled()) {</span></span>
<span class="line"><span>        log.info(sm.getString(&quot;catalina.startup&quot;, Long.valueOf((t2 - t1) / 1000000)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Register shutdown hook</span></span>
<span class="line"><span>    if (useShutdownHook) {</span></span>
<span class="line"><span>        if (shutdownHook == null) {</span></span>
<span class="line"><span>            shutdownHook = new CatalinaShutdownHook();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Runtime.getRuntime().addShutdownHook(shutdownHook);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // If JULI is being used, disable JULI&#39;s shutdown hook since</span></span>
<span class="line"><span>        // shutdown hooks run in parallel and log messages may be lost</span></span>
<span class="line"><span>        // if JULI&#39;s hook completes before the CatalinaShutdownHook()</span></span>
<span class="line"><span>        LogManager logManager = LogManager.getLogManager();</span></span>
<span class="line"><span>        if (logManager instanceof ClassLoaderLogManager) {</span></span>
<span class="line"><span>            ((ClassLoaderLogManager) logManager).setUseShutdownHook(</span></span>
<span class="line"><span>                    false);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (await) {</span></span>
<span class="line"><span>        await();</span></span>
<span class="line"><span>        stop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面这段代码，逻辑非常简单，首先确定 getServer() 方法不为 null ，也就是确定 server 属性不为null，而 server 属性是在 load 方法就初始化了。</p><p>整段代码的核心就是 try-catch 里的 getServer().start() 方法了，也就是调用 Server 对象的 start() 方法来启动 Tomcat。本篇文章就先不对 Server 的 start() 方法进行解析了，下篇文章会单独讲。</p><h2 id="catalina-的关闭" tabindex="-1">Catalina 的关闭 <a class="header-anchor" href="#catalina-的关闭" aria-label="Permalink to &quot;Catalina 的关闭&quot;">​</a></h2><p>调用完 Server#start 方法之后，注册了一个ShutDownHook，也就是 CatalinaShutdownHook 对象，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Shutdown hook which will perform a clean shutdown of Catalina if needed.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected class CatalinaShutdownHook extends Thread {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>          if (getServer() != null) {</span></span>
<span class="line"><span>              Catalina.this.stop();</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>      } catch (Throwable ex) {</span></span>
<span class="line"><span>          ExceptionUtils.handleThrowable(ex);</span></span>
<span class="line"><span>          log.error(sm.getString(&quot;catalina.shutdownHookFail&quot;), ex);</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>          // If JULI is used, shut JULI down *after* the server shuts down</span></span>
<span class="line"><span>          // so log messages aren&#39;t lost</span></span>
<span class="line"><span>          LogManager logManager = LogManager.getLogManager();</span></span>
<span class="line"><span>          if (logManager instanceof ClassLoaderLogManager) {</span></span>
<span class="line"><span>              ((ClassLoaderLogManager) logManager).shutdown();</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>CatalinaShutdownHook 的逻辑也简单，就是调用 Catalina 对象的 stop 方法来停止 tomcat。</p><p>最后就进入 if 语句了，await 是在 Bootstrap 里调用的时候设置为 true 的，也就是本文开头的时候提到的三个方法中的一个。await 方法的作用是停住主线程，等待用户输入shutdown 命令之后，停止等待，之后 main 线程就调用 stop 方法来停止Tomcat。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Stop an existing server instance.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void stop() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // Remove the ShutdownHook first so that server.stop()</span></span>
<span class="line"><span>        // doesn&#39;t get invoked twice</span></span>
<span class="line"><span>        if (useShutdownHook) {</span></span>
<span class="line"><span>            Runtime.getRuntime().removeShutdownHook(shutdownHook);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // If JULI is being used, re-enable JULI&#39;s shutdown to ensure</span></span>
<span class="line"><span>            // log messages are not lost</span></span>
<span class="line"><span>            LogManager logManager = LogManager.getLogManager();</span></span>
<span class="line"><span>            if (logManager instanceof ClassLoaderLogManager) {</span></span>
<span class="line"><span>                ((ClassLoaderLogManager) logManager).setUseShutdownHook(</span></span>
<span class="line"><span>                        true);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Throwable t) {</span></span>
<span class="line"><span>        ExceptionUtils.handleThrowable(t);</span></span>
<span class="line"><span>        // This will fail on JDK 1.2. Ignoring, as Tomcat can run</span></span>
<span class="line"><span>        // fine without the shutdown hook.</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Shut down the server</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        Server s = getServer();</span></span>
<span class="line"><span>        LifecycleState state = s.getState();</span></span>
<span class="line"><span>        if (LifecycleState.STOPPING_PREP.compareTo(state) &lt;= 0</span></span>
<span class="line"><span>                &amp;&amp; LifecycleState.DESTROYED.compareTo(state) &gt;= 0) {</span></span>
<span class="line"><span>            // Nothing to do. stop() was already called</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            s.stop();</span></span>
<span class="line"><span>            s.destroy();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (LifecycleException e) {</span></span>
<span class="line"><span>        log.error(sm.getString(&quot;catalina.stopError&quot;), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Catalina 的 stop 方法主要逻辑是调用 Server 对象的 stop 方法。</p><h2 id="聊聊关闭钩子" tabindex="-1">聊聊关闭钩子 <a class="header-anchor" href="#聊聊关闭钩子" aria-label="Permalink to &quot;聊聊关闭钩子&quot;">​</a></h2><p>上面我们看到CatalinaShutdownHook, 这里有必要谈谈JVM的关闭钩子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (shutdownHook == null) {</span></span>
<span class="line"><span>    shutdownHook = new CatalinaShutdownHook();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>Runtime.getRuntime().addShutdownHook(shutdownHook);</span></span></code></pre></div><p>关闭钩子是指通过<strong>Runtime.addShutdownHook注册的但尚未开始的线程</strong>。这些钩子可以用于<strong>实现服务或者应用程序的清理工作</strong>，例如删除临时文件，或者清除无法由操作系统自动清除的资源。</p><p>JVM既可以正常关闭，也可以强行关闭。正常关闭的触发方式有多种，包括：当最后一个“正常（非守护）”线程结束时，或者当调用了System.exit时，或者通过其他特定于平台的方法关闭时（例如发送了SIGINT信号或者键入Ctrl-C）。</p><p>在<strong>正常关闭中，JVM首先调用所有已注册的关闭钩子</strong>。JVM并不能保证关闭钩子的调用顺序。在关闭应用程序线程时，如果有（守护或者非守护）线程仍然在执行，那么这些线程接下来将与关闭进程并发执行。当所有的关闭钩子都执行结束时，如果runFinalizersOnExit为true【通过Runtime.runFinalizersOnExit(true)设置】，那么JVM将运行这些Finalizer（对象重写的finalize方法），然后再停止。JVM不会停止或中断任何在关闭时仍然运行的应用程序线程。当JVM最终结束时，这些线程将被强行结束。如果关闭钩子或者Finalizer没有执行完成，那么正常关闭进程“挂起”并且JVM必须被强行关闭。当<strong>JVM被强行关闭时，只是关闭JVM，并不会运行关闭钩子</strong>（举个例子，类似于电源都直接拔了，还怎么做其它动作呢？）。</p><p>下面是一个简单的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class T {</span></span>
<span class="line"><span>	@SuppressWarnings(&quot;deprecation&quot;)</span></span>
<span class="line"><span>	public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>		//启用退出JVM时执行Finalizer</span></span>
<span class="line"><span>		Runtime.runFinalizersOnExit(true);</span></span>
<span class="line"><span>		MyHook hook1 = new MyHook(&quot;Hook1&quot;);</span></span>
<span class="line"><span>		MyHook hook2 = new MyHook(&quot;Hook2&quot;);</span></span>
<span class="line"><span>		MyHook hook3 = new MyHook(&quot;Hook3&quot;);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		//注册关闭钩子</span></span>
<span class="line"><span>		Runtime.getRuntime().addShutdownHook(hook1);</span></span>
<span class="line"><span>		Runtime.getRuntime().addShutdownHook(hook2);</span></span>
<span class="line"><span>		Runtime.getRuntime().addShutdownHook(hook3);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		//移除关闭钩子</span></span>
<span class="line"><span>		Runtime.getRuntime().removeShutdownHook(hook3);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		//Main线程将在执行这句之后退出</span></span>
<span class="line"><span>		System.out.println(&quot;Main Thread Ends.&quot;);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyHook extends Thread {</span></span>
<span class="line"><span>	private String name;</span></span>
<span class="line"><span>	public MyHook (String name) {</span></span>
<span class="line"><span>		this.name = name;</span></span>
<span class="line"><span>		setName(name);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	public void run() {</span></span>
<span class="line"><span>		System.out.println(name + &quot; Ends.&quot;);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	//重写Finalizer，将在关闭钩子后调用</span></span>
<span class="line"><span>	protected void finalize() throws Throwable {</span></span>
<span class="line"><span>		System.out.println(name + &quot; Finalize.&quot;);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>和（可能的）执行结果（因为JVM不保证关闭钩子的调用顺序，因此结果中的第二、三行可能出现相反的顺序）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Main Thread Ends.</span></span>
<span class="line"><span>Hook2 Ends.</span></span>
<span class="line"><span>Hook1 Ends.</span></span>
<span class="line"><span>Hook3 Finalize.</span></span>
<span class="line"><span>Hook2 Finalize.</span></span>
<span class="line"><span>Hook1 Finalize.</span></span></code></pre></div><p>可以看到，main函数执行完成，首先输出的是Main Thread Ends，接下来执行关闭钩子，输出Hook2 Ends和Hook1 Ends。这两行也可以证实：JVM确实不是以注册的顺序来调用关闭钩子的。而由于hook3在调用了addShutdownHook后，接着对其调用了removeShutdownHook将其移除，于是hook3在JVM退出时没有执行，因此没有输出Hook3 Ends。</p><p>另外，由于MyHook类实现了finalize方法，而main函数中第一行又通过Runtime.runFinalizersOnExit(true)打开了退出JVM时执行Finalizer的开关，于是3个hook对象的finalize方法被调用，输出了3行Finalize。</p><p>注意，多次调用addShutdownHook来注册同一个关闭钩子将会抛出IllegalArgumentException:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Exception in thread &quot;main&quot; java.lang.IllegalArgumentException: Hook previously registered</span></span>
<span class="line"><span>	at java.lang.ApplicationShutdownHooks.add(ApplicationShutdownHooks.java:72)</span></span>
<span class="line"><span>	at java.lang.Runtime.addShutdownHook(Runtime.java:211)</span></span>
<span class="line"><span>	at T.main(T.java:12)</span></span></code></pre></div><p>另外，从JavaDoc中得知：<strong>一旦JVM关闭流程开始，就只能通过调用halt方法来停止该流程，也不可能再注册或移除关闭钩子了，这些操作将导致抛出IllegalStateException</strong>。</p><p>如果在关闭钩子中关闭应用程序的公共的组件，如日志服务，或者数据库连接等，像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Runtime.getRuntime().addShutdownHook(new Thread() {</span></span>
<span class="line"><span>	public void run() {</span></span>
<span class="line"><span>		try { </span></span>
<span class="line"><span>			LogService.this.stop();</span></span>
<span class="line"><span>		} catch (InterruptedException ignored){</span></span>
<span class="line"><span>			//ignored</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>由于<strong>关闭钩子将并发执行，因此在关闭日志时可能导致其他需要日志服务的关闭钩子产生问题</strong>。<strong>为了避免这种情况，可以使关闭钩子不依赖那些可能被应用程序或其他关闭钩子关闭的服务</strong>。实现这种功能的一种方式是对所有服务使用同一个关闭钩子（而不是每个服务使用一个不同的关闭钩子），并且在该关闭钩子中执行一系列的关闭操作。这确保了关闭操作在单个线程中串行执行，从而避免了在关闭操作之前出现竞态条件或死锁等问题。</p><h3 id="使用场景" tabindex="-1">使用场景 <a class="header-anchor" href="#使用场景" aria-label="Permalink to &quot;使用场景&quot;">​</a></h3><p>通过Hook实现临时文件清理</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>          Thread.sleep(20000);</span></span>
<span class="line"><span>      } catch (InterruptedException e) {</span></span>
<span class="line"><span>          e.printStackTrace();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {</span></span>
<span class="line"><span>          public void run() {</span></span>
<span class="line"><span>              System.out.println(&quot;auto clean temporary file&quot;);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>      }));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>Catalina 类承接了 Bootstrap 类的 load 和 start 方法，然后根据配置初始化了 Tomcat 的组件，并调用了 Server 类的 init 和 start 方法来启动 Tomcat。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://segmentfault.com/a/1190000022012525" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000022012525</a></li><li><a href="https://my.oschina.net/itblog/blog/811053" target="_blank" rel="noreferrer">https://my.oschina.net/itblog/blog/811053</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,66)]))}const v=n(i,[["render",o]]);export{m as __pageData,v as default};
