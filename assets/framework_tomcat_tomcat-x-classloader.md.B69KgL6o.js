import{_ as s}from"./chunks/java_jvm_classload_3.fMcwOggY.js";import{_ as n,c as e,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/tomcat/tomcat-x-classloader-1.png",o="/vitepress-blog-template/images/tomcat/tomcat-x-classloader-2.png",L=JSON.parse('{"title":"Tomcat - 启动过程:类加载机制详解","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-classloader.md","filePath":"framework/tomcat/tomcat-x-classloader.md","lastUpdated":1737706346000}'),r={name:"framework/tomcat/tomcat-x-classloader.md"};function i(c,a,d,h,u,m){return l(),e("div",null,a[0]||(a[0]=[p(`<h1 id="tomcat-启动过程-类加载机制详解" tabindex="-1">Tomcat - 启动过程:类加载机制详解 <a class="header-anchor" href="#tomcat-启动过程-类加载机制详解" aria-label="Permalink to &quot;Tomcat - 启动过程:类加载机制详解&quot;">​</a></h1><blockquote><p>上文我们讲了Tomcat在初始化时会初始化classLoader。本文将具体分析Tomcat的类加载机制，特别是区别于传统的<code>双亲委派模型</code>的加载机制。@pdai</p></blockquote><h2 id="tomcat初始化了哪些classloader" tabindex="-1">Tomcat初始化了哪些classloader <a class="header-anchor" href="#tomcat初始化了哪些classloader" aria-label="Permalink to &quot;Tomcat初始化了哪些classloader&quot;">​</a></h2><p>在Bootstrap中我们可以看到有如下三个classloader</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ClassLoader commonLoader = null;</span></span>
<span class="line"><span>ClassLoader catalinaLoader = null;</span></span>
<span class="line"><span>ClassLoader sharedLoader = null;</span></span></code></pre></div><h3 id="如何初始化的呢" tabindex="-1">如何初始化的呢？ <a class="header-anchor" href="#如何初始化的呢" aria-label="Permalink to &quot;如何初始化的呢？&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void initClassLoaders() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // commonLoader初始化</span></span>
<span class="line"><span>        commonLoader = createClassLoader(&quot;common&quot;, null);</span></span>
<span class="line"><span>        if (commonLoader == null) {</span></span>
<span class="line"><span>            // no config file, default to this loader - we might be in a &#39;single&#39; env.</span></span>
<span class="line"><span>            commonLoader = this.getClass().getClassLoader();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // catalinaLoader初始化, 父classloader是commonLoader</span></span>
<span class="line"><span>        catalinaLoader = createClassLoader(&quot;server&quot;, commonLoader);</span></span>
<span class="line"><span>        // sharedLoader初始化</span></span>
<span class="line"><span>        sharedLoader = createClassLoader(&quot;shared&quot;, commonLoader);</span></span>
<span class="line"><span>    } catch (Throwable t) {</span></span>
<span class="line"><span>        handleThrowable(t);</span></span>
<span class="line"><span>        log.error(&quot;Class loader creation threw exception&quot;, t);</span></span>
<span class="line"><span>        System.exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>可以看出，catalinaLoader 和 sharedLoader 的 parentClassLoader 是 commonLoader。</p></blockquote><h3 id="如何创建classloader的" tabindex="-1">如何创建classLoader的？ <a class="header-anchor" href="#如何创建classloader的" aria-label="Permalink to &quot;如何创建classLoader的？&quot;">​</a></h3><p>不妨再看下如何创建的？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private ClassLoader createClassLoader(String name, ClassLoader parent)</span></span>
<span class="line"><span>    throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String value = CatalinaProperties.getProperty(name + &quot;.loader&quot;);</span></span>
<span class="line"><span>    if ((value == null) || (value.equals(&quot;&quot;)))</span></span>
<span class="line"><span>        return parent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    value = replace(value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;Repository&gt; repositories = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String[] repositoryPaths = getPaths(value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (String repository : repositoryPaths) {</span></span>
<span class="line"><span>        // Check for a JAR URL repository</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            @SuppressWarnings(&quot;unused&quot;)</span></span>
<span class="line"><span>            URL url = new URL(repository);</span></span>
<span class="line"><span>            repositories.add(new Repository(repository, RepositoryType.URL));</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        } catch (MalformedURLException e) {</span></span>
<span class="line"><span>            // Ignore</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Local repository</span></span>
<span class="line"><span>        if (repository.endsWith(&quot;*.jar&quot;)) {</span></span>
<span class="line"><span>            repository = repository.substring</span></span>
<span class="line"><span>                (0, repository.length() - &quot;*.jar&quot;.length());</span></span>
<span class="line"><span>            repositories.add(new Repository(repository, RepositoryType.GLOB));</span></span>
<span class="line"><span>        } else if (repository.endsWith(&quot;.jar&quot;)) {</span></span>
<span class="line"><span>            repositories.add(new Repository(repository, RepositoryType.JAR));</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            repositories.add(new Repository(repository, RepositoryType.DIR));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ClassLoaderFactory.createClassLoader(repositories, parent);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>方法的逻辑也比较简单就是从 catalina.property文件里找 common.loader, shared.loader, server.loader 对应的值，然后构造成Repository 列表，再将Repository 列表传入ClassLoaderFactory.createClassLoader 方法，ClassLoaderFactory.createClassLoader 返回的是 URLClassLoader，而Repository 列表就是这个URLClassLoader 可以加在的类的路径。 在catalina.property文件里</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>common.loader=&quot;\${catalina.base}/lib&quot;,&quot;\${catalina.base}/lib/*.jar&quot;,&quot;\${catalina.home}/lib&quot;,&quot;\${catalina.home}/lib/*.jar&quot;</span></span>
<span class="line"><span>server.loader=</span></span>
<span class="line"><span>shared.loader=</span></span></code></pre></div><p>其中 shared.loader, server.loader 是没有值的，createClassLoader 方法里如果没有值的话，就返回传入的 parent ClassLoader，也就是说，commonLoader,catalinaLoader,sharedLoader 其实是一个对象。在Tomcat之前的版本里，这三个是不同的URLClassLoader对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Class&lt;?&gt; startupClass = catalinaLoader.loadClass(&quot;org.apache.catalina.startup.Catalina&quot;);</span></span>
<span class="line"><span>        Object startupInstance = startupClass.getConstructor().newInstance();</span></span></code></pre></div><p>初始化完三个ClassLoader对象后，init() 方法就使用 catalinaClassLoader 加载了org.apache.catalina.startup.Catalina 类，并创建了一个对象，然后通过反射调用这个对象的 setParentClassLoader 方法，传入的参数是 sharedClassLoader。最后吧这个 Catania 对象复制给 catalinaDaemon 属性。</p><h2 id="深入理解" tabindex="-1">深入理解 <a class="header-anchor" href="#深入理解" aria-label="Permalink to &quot;深入理解&quot;">​</a></h2><p>可以复习下类加载机制的基础：<a href="https://pdai.tech/md/java/jvm/java-jvm-classload.html" target="_blank" rel="noreferrer">JVM基础 - Java 类加载机制</a></p><h3 id="什么是类加载机制" tabindex="-1">什么是类加载机制 <a class="header-anchor" href="#什么是类加载机制" aria-label="Permalink to &quot;什么是类加载机制&quot;">​</a></h3><p>Java是一门面向对象的语言，而对象又必然依托于类。类要运行，必须首先被加载到内存。我们可以简单地把类分为几类：</p><ul><li><p>Java自带的核心类</p></li><li><p>Java支持的可扩展类</p></li><li><p>我们自己编写的类</p></li><li><p><strong>为什么要设计多个类加载器</strong>？</p></li></ul><blockquote><p>如果所有的类都使用一个类加载器来加载，会出现什么问题呢？</p></blockquote><p>假如我们自己编写一个类<code>java.util.Object</code>，它的实现可能有一定的危险性或者隐藏的bug。而我们知道Java自带的核心类里面也有<code>java.util.Object</code>，如果JVM启动的时候先行加载的是我们自己编写的<code>java.util.Object</code>，那么就有可能出现安全问题！</p><p>所以，Sun（后被Oracle收购）采用了另外一种方式来保证最基本的、也是最核心的功能不会被破坏。你猜的没错，那就是双亲委派模式！</p><ul><li><strong>什么是双亲委派模型</strong>？</li></ul><blockquote><p>双亲委派模型解决了类错乱加载的问题，也设计得非常精妙。</p></blockquote><p>双亲委派模式对类加载器定义了层级，每个类加载器都有一个父类加载器。在一个类需要加载的时候，首先委派给父类加载器来加载，而父类加载器又委派给祖父类加载器来加载，以此类推。如果父类及上面的类加载器都加载不了，那么由当前类加载器来加载，并将被加载的类缓存起来。</p><p><img src="`+s+`" alt="error.图片加载失败"></p><p>所以上述类是这么加载的</p><ul><li>Java自带的核心类 -- 由启动类加载器加载</li><li>Java支持的可扩展类 -- 由扩展类加载器加载</li><li>我们自己编写的类 -- 默认由应用程序类加载器或其子类加载</li></ul><blockquote><p>但它也不是万能的，在有些场景也会遇到它解决不了的问题，比如如下场景。</p></blockquote><h3 id="双亲委派模型问题是如何解决的" tabindex="-1">双亲委派模型问题是如何解决的？ <a class="header-anchor" href="#双亲委派模型问题是如何解决的" aria-label="Permalink to &quot;双亲委派模型问题是如何解决的？&quot;">​</a></h3><blockquote><p>在Java核心类里面有SPI（Service Provider Interface），它由Sun编写规范，第三方来负责实现。SPI需要用到第三方实现类。如果使用双亲委派模型，那么第三方实现类也需要放在Java核心类里面才可以，不然的话第三方实现类将不能被加载使用。但是这显然是不合理的！怎么办呢？</p></blockquote><p><strong>ContextClassLoader</strong>（上下文类加载器）就来解围了。</p><p>在java.lang.Thread里面有两个方法，get/set上下文类加载器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setContextClassLoader(ClassLoader cl)</span></span>
<span class="line"><span>public ClassLoader getContextClassLoader()</span></span></code></pre></div><p>我们可以通过在SPI类里面调用getContextClassLoader来获取第三方实现类的类加载器。由第三方实现类通过调用setContextClassLoader来传入自己实现的类加载器, 这样就变相地解决了双亲委派模式遇到的问题。</p><h3 id="为什么tomcat的类加载器也不是双亲委派模型" tabindex="-1">为什么Tomcat的类加载器也不是双亲委派模型 <a class="header-anchor" href="#为什么tomcat的类加载器也不是双亲委派模型" aria-label="Permalink to &quot;为什么Tomcat的类加载器也不是双亲委派模型&quot;">​</a></h3><blockquote><p>我们知道，Java默认的类加载机制是通过双亲委派模型来实现的，而Tomcat实现的方式又和双亲委派模型有所区别。</p></blockquote><p><strong>原因在于一个Tomcat容器允许同时运行多个Web程序，每个Web程序依赖的类又必须是相互隔离的</strong>。因此，如果Tomcat使用双亲委派模式来加载类的话，将导致Web程序依赖的类变为共享的。</p><p>举个例子，假如我们有两个Web程序，一个依赖A库的1.0版本，另一个依赖A库的2.0版本，他们都使用了类xxx.xx.Clazz，其实现的逻辑因类库版本的不同而结构完全不同。那么这两个Web程序的其中一个必然因为加载的Clazz不是所使用的Clazz而出现问题！而这对于开发来说是非常致命的！</p><h3 id="tomcat类加载机制是怎么样的呢" tabindex="-1">Tomcat类加载机制是怎么样的呢 <a class="header-anchor" href="#tomcat类加载机制是怎么样的呢" aria-label="Permalink to &quot;Tomcat类加载机制是怎么样的呢&quot;">​</a></h3><blockquote><p>既然Tomcat的类加载机器不同于双亲委派模式，那么它又是一种怎样的模式呢？</p></blockquote><p>我们在这里一定要看下官网提供的<a href="https://tomcat.apache.org/tomcat-9.0-doc/class-loader-howto.html" target="_blank" rel="noreferrer">类加载的文档在新窗口打开</a></p><p><img src="`+t+'" alt="error.图片加载失败"></p><p>结合经典的类加载机制，我们完整的看下Tomcat类加载图</p><p><img src="'+o+`" alt="error.图片加载失败"></p><p>我们在这张图中看到很多类加载器，除了Jdk自带的类加载器，我们尤其关心Tomcat自身持有的类加载器。仔细一点我们很容易发现：Catalina类加载器和Shared类加载器，他们并不是父子关系，而是兄弟关系。为啥这样设计，我们得分析一下每个类加载器的用途，才能知晓。</p><ul><li><strong>Common类加载器</strong>，负责加载Tomcat和Web应用都复用的类 <ul><li><strong>Catalina类加载器</strong>，负责加载Tomcat专用的类，而这些被加载的类在Web应用中将不可见</li><li><strong>Shared类加载器</strong>，负责加载Tomcat下所有的Web应用程序都复用的类，而这些被加载的类在Tomcat中将不可见 <ul><li><strong>WebApp类加载器</strong>，负责加载具体的某个Web应用程序所使用到的类，而这些被加载的类在Tomcat和其他的Web应用程序都将不可见</li><li><strong>Jsp类加载器</strong>，每个jsp页面一个类加载器，不同的jsp页面有不同的类加载器，方便实现jsp页面的热插拔</li></ul></li></ul></li></ul><p>同样的，我们可以看到通过<strong>ContextClassLoader</strong>（上下文类加载器）的<strong>setContextClassLoader</strong>来传入自己实现的类加载器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void init() throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  initClassLoaders();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 看这里</span></span>
<span class="line"><span>  Thread.currentThread().setContextClassLoader(catalinaLoader);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SecurityClassLoad.securityClassLoad(catalinaLoader);</span></span>
<span class="line"><span>...</span></span></code></pre></div><h3 id="webapp类加载器" tabindex="-1">WebApp类加载器 <a class="header-anchor" href="#webapp类加载器" aria-label="Permalink to &quot;WebApp类加载器&quot;">​</a></h3><blockquote><p>到这儿，我们隐隐感觉到少分析了点什么！没错，就是WebApp类加载器。整个启动过程分析下来，我们仍然没有看到这个类加载器。它又是在哪儿出现的呢？</p></blockquote><p>我们知道WebApp类加载器是Web应用私有的，而每个Web应用其实算是一个Context，那么我们通过Context的实现类应该可以发现。在Tomcat中，Context的默认实现为StandardContext，我们看看这个类的startInternal()方法，在这儿我们发现了我们感兴趣的WebApp类加载器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected synchronized void startInternal() throws LifecycleException {</span></span>
<span class="line"><span>    if (getLoader() == null) {</span></span>
<span class="line"><span>        WebappLoader webappLoader = new WebappLoader(getParentClassLoader());</span></span>
<span class="line"><span>        webappLoader.setDelegate(getDelegate());</span></span>
<span class="line"><span>        setLoader(webappLoader);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>入口代码非常简单，就是webappLoader不存在的时候创建一个，并调用setLoader方法。我们接着分析setLoader</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setLoader(Loader loader) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Lock writeLock = loaderLock.writeLock();</span></span>
<span class="line"><span>    writeLock.lock();</span></span>
<span class="line"><span>    Loader oldLoader = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // Change components if necessary</span></span>
<span class="line"><span>        oldLoader = this.loader;</span></span>
<span class="line"><span>        if (oldLoader == loader)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        this.loader = loader;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Stop the old component if necessary</span></span>
<span class="line"><span>        if (getState().isAvailable() &amp;&amp; (oldLoader != null) &amp;&amp;</span></span>
<span class="line"><span>            (oldLoader instanceof Lifecycle)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) oldLoader).stop();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(&quot;StandardContext.setLoader: stop: &quot;, e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Start the new component if necessary</span></span>
<span class="line"><span>        if (loader != null)</span></span>
<span class="line"><span>            loader.setContext(this);</span></span>
<span class="line"><span>        if (getState().isAvailable() &amp;&amp; (loader != null) &amp;&amp;</span></span>
<span class="line"><span>            (loader instanceof Lifecycle)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) loader).start();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(&quot;StandardContext.setLoader: start: &quot;, e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        writeLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Report this property change to interested listeners</span></span>
<span class="line"><span>    support.firePropertyChange(&quot;loader&quot;, oldLoader, loader);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这儿，我们感兴趣的就两行代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>((Lifecycle) oldLoader).stop(); // 旧的加载器停止</span></span>
<span class="line"><span>((Lifecycle) loader).start(); // 新的加载器启动</span></span></code></pre></div><h3 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h3><ul><li><a href="https://tomcat.apache.org/tomcat-9.0-doc/class-loader-howto.html" target="_blank" rel="noreferrer">https://tomcat.apache.org/tomcat-9.0-doc/class-loader-howto.html</a></li><li>juconcurrent <a href="https://www.jianshu.com/p/51b2c50c58eb" target="_blank" rel="noreferrer">https://www.jianshu.com/p/51b2c50c58eb</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,62)]))}const C=n(r,[["render",i]]);export{L as __pageData,C as default};
