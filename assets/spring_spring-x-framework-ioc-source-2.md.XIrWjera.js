import{_ as a}from"./chunks/spring-framework-ioc-source-8.BCWIRaOr.js";import{_ as s,c as e,ai as p,o as i}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/spring/springframework/spring-framework-ioc-source-73.png",l="/vitepress-blog-template/images/spring/springframework/spring-framework-ioc-source-9.png",m=JSON.parse('{"title":"Spring进阶- Spring IOC实现原理详解之IOC初始化流程","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-ioc-source-2.md","filePath":"spring/spring-x-framework-ioc-source-2.md","lastUpdated":1737706346000}'),o={name:"spring/spring-x-framework-ioc-source-2.md"};function c(r,n,d,u,f,g){return i(),e("div",null,n[0]||(n[0]=[p('<h1 id="spring进阶-spring-ioc实现原理详解之ioc初始化流程" tabindex="-1">Spring进阶- Spring IOC实现原理详解之IOC初始化流程 <a class="header-anchor" href="#spring进阶-spring-ioc实现原理详解之ioc初始化流程" aria-label="Permalink to &quot;Spring进阶- Spring IOC实现原理详解之IOC初始化流程&quot;">​</a></h1><blockquote><p>上文，我们看了IOC设计要点和设计结构；紧接着这篇，我们可以看下源码的实现了：Spring如何实现将资源配置（以xml配置为例）通过加载，解析，生成BeanDefination并注册到IoC容器中的。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><p>上文，我们看了IOC设计要点和设计结构；\b紧接着这篇，我们可以看下源码的实现了：Spring如何实现将资源配置（以xml配置为例）通过加载，解析，生成BeanDefination并注册到IoC容器中的（就是我们圈出来的部分）</p><p><img src="'+t+`" alt="error.图片加载失败"></p><h2 id="如何将bean从xml配置中解析后放到ioc容器中的" tabindex="-1">如何将Bean从XML配置中解析后放到IoC容器中的？ <a class="header-anchor" href="#如何将bean从xml配置中解析后放到ioc容器中的" aria-label="Permalink to &quot;如何将Bean从XML配置中解析后放到IoC容器中的？&quot;">​</a></h2><blockquote><p>本文的目标就是分析Spring如何实现将资源配置（以xml配置为例）通过加载，解析，生成BeanDefination并注册到IoC容器中的。</p></blockquote><h3 id="初始化的入口" tabindex="-1">初始化的入口 <a class="header-anchor" href="#初始化的入口" aria-label="Permalink to &quot;初始化的入口&quot;">​</a></h3><p>对于xml配置的Spring应用，在main()方法中实例化ClasspathXmlApplicationContext即可创建一个IoC容器。我们可以从这个构造方法开始，探究一下IoC容器的初始化过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> // create and configure beans</span></span>
<span class="line"><span>ApplicationContext context = new ClassPathXmlApplicationContext(&quot;aspects.xml&quot;, &quot;daos.xml&quot;, &quot;services.xml&quot;);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ClassPathXmlApplicationContext(String... configLocations) throws BeansException {</span></span>
<span class="line"><span>    this(configLocations, true, (ApplicationContext)null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public ClassPathXmlApplicationContext(String[] configLocations, boolean refresh, @Nullable ApplicationContext parent) throws BeansException {</span></span>
<span class="line"><span>    // 设置Bean资源加载器</span></span>
<span class="line"><span>    super(parent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置配置路径</span></span>
<span class="line"><span>    this.setConfigLocations(configLocations);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化容器</span></span>
<span class="line"><span>    if (refresh) {</span></span>
<span class="line"><span>        this.refresh();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="设置资源解析器和环境" tabindex="-1">设置资源解析器和环境 <a class="header-anchor" href="#设置资源解析器和环境" aria-label="Permalink to &quot;设置资源解析器和环境&quot;">​</a></h3><p>调用父类容器AbstractApplicationContext的构造方法(<code>super(parent)</code>方法)为容器设置好Bean资源加载器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public AbstractApplicationContext(@Nullable ApplicationContext parent) {</span></span>
<span class="line"><span>    // 默认构造函数初始化容器id, name, 状态 以及 资源解析器</span></span>
<span class="line"><span>    this();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将父容器的Environment合并到当前容器</span></span>
<span class="line"><span>    this.setParent(parent);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过AbstractApplicationContext默认构造函数初始化容器id, name, 状态 以及 资源解析器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public AbstractApplicationContext() {</span></span>
<span class="line"><span>    this.logger = LogFactory.getLog(this.getClass());</span></span>
<span class="line"><span>    this.id = ObjectUtils.identityToString(this);</span></span>
<span class="line"><span>    this.displayName = ObjectUtils.identityToString(this);</span></span>
<span class="line"><span>    this.beanFactoryPostProcessors = new ArrayList();</span></span>
<span class="line"><span>    this.active = new AtomicBoolean();</span></span>
<span class="line"><span>    this.closed = new AtomicBoolean();</span></span>
<span class="line"><span>    this.startupShutdownMonitor = new Object();</span></span>
<span class="line"><span>    this.applicationStartup = ApplicationStartup.DEFAULT;</span></span>
<span class="line"><span>    this.applicationListeners = new LinkedHashSet();</span></span>
<span class="line"><span>    this.resourcePatternResolver = this.getResourcePatternResolver();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// Spring资源加载器</span></span>
<span class="line"><span>protected ResourcePatternResolver getResourcePatternResolver() {</span></span>
<span class="line"><span>    return new PathMatchingResourcePatternResolver(this);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过AbstractApplicationContext的<code>setParent(parent)</code>方法将父容器的Environment合并到当前容器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setParent(@Nullable ApplicationContext parent) {</span></span>
<span class="line"><span>    this.parent = parent;</span></span>
<span class="line"><span>    if (parent != null) {</span></span>
<span class="line"><span>        Environment parentEnvironment = parent.getEnvironment();</span></span>
<span class="line"><span>        if (parentEnvironment instanceof ConfigurableEnvironment) {</span></span>
<span class="line"><span>            this.getEnvironment().merge((ConfigurableEnvironment)parentEnvironment);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="设置配置路径" tabindex="-1">设置配置路径 <a class="header-anchor" href="#设置配置路径" aria-label="Permalink to &quot;设置配置路径&quot;">​</a></h3><p>在设置容器的资源加载器之后，接下来FileSystemXmlApplicationContet执行setConfigLocations方法通过调用其父类AbstractRefreshableConfigApplicationContext的方法进行对Bean定义资源文件的定位</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setConfigLocations(@Nullable String... locations) {</span></span>
<span class="line"><span>    if (locations != null) {</span></span>
<span class="line"><span>        Assert.noNullElements(locations, &quot;Config locations must not be null&quot;);</span></span>
<span class="line"><span>        this.configLocations = new String[locations.length];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for(int i = 0; i &lt; locations.length; ++i) {</span></span>
<span class="line"><span>            // 解析配置路径</span></span>
<span class="line"><span>            this.configLocations[i] = this.resolvePath(locations[i]).trim();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        this.configLocations = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>protected String resolvePath(String path) {</span></span>
<span class="line"><span>    // 从上一步Environment中解析</span></span>
<span class="line"><span>    return this.getEnvironment().resolveRequiredPlaceholders(path);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="初始化的主体流程" tabindex="-1">初始化的主体流程 <a class="header-anchor" href="#初始化的主体流程" aria-label="Permalink to &quot;初始化的主体流程&quot;">​</a></h3><p>Spring IoC容器对Bean定义资源的载入是从refresh()函数开始的，refresh()是一个模板方法，refresh()方法的作用是：在创建IoC容器前，如果已经有容器存在，则需要把已有的容器销毁和关闭，以保证在refresh之后使用的是新建立起来的IoC容器。refresh的作用类似于对IoC容器的重启，在新建立好的容器中对容器进行初始化，对Bean定义资源进行载入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void refresh() throws BeansException, IllegalStateException {</span></span>
<span class="line"><span>    synchronized (this.startupShutdownMonitor) {</span></span>
<span class="line"><span>        StartupStep contextRefresh = this.applicationStartup.start(&quot;spring.context.refresh&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Prepare this context for refreshing.</span></span>
<span class="line"><span>        prepareRefresh();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Tell the subclass to refresh the internal bean factory.</span></span>
<span class="line"><span>        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Prepare the bean factory for use in this context.</span></span>
<span class="line"><span>        prepareBeanFactory(beanFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // Allows post-processing of the bean factory in context subclasses.</span></span>
<span class="line"><span>            postProcessBeanFactory(beanFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            StartupStep beanPostProcess = this.applicationStartup.start(&quot;spring.context.beans.post-process&quot;);</span></span>
<span class="line"><span>            // Invoke factory processors registered as beans in the context.</span></span>
<span class="line"><span>            invokeBeanFactoryPostProcessors(beanFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Register bean processors that intercept bean creation.</span></span>
<span class="line"><span>            registerBeanPostProcessors(beanFactory);</span></span>
<span class="line"><span>            beanPostProcess.end();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Initialize message source for this context.</span></span>
<span class="line"><span>            initMessageSource();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Initialize event multicaster for this context.</span></span>
<span class="line"><span>            initApplicationEventMulticaster();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Initialize other special beans in specific context subclasses.</span></span>
<span class="line"><span>            onRefresh();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Check for listener beans and register them.</span></span>
<span class="line"><span>            registerListeners();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Instantiate all remaining (non-lazy-init) singletons.</span></span>
<span class="line"><span>            finishBeanFactoryInitialization(beanFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Last step: publish corresponding event.</span></span>
<span class="line"><span>            finishRefresh();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        catch (BeansException ex) {</span></span>
<span class="line"><span>            if (logger.isWarnEnabled()) {</span></span>
<span class="line"><span>                logger.warn(&quot;Exception encountered during context initialization - &quot; +</span></span>
<span class="line"><span>                        &quot;cancelling refresh attempt: &quot; + ex);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Destroy already created singletons to avoid dangling resources.</span></span>
<span class="line"><span>            destroyBeans();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Reset &#39;active&#39; flag.</span></span>
<span class="line"><span>            cancelRefresh(ex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Propagate exception to caller.</span></span>
<span class="line"><span>            throw ex;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        finally {</span></span>
<span class="line"><span>            // Reset common introspection caches in Spring&#39;s core, since we</span></span>
<span class="line"><span>            // might not ever need metadata for singleton beans anymore...</span></span>
<span class="line"><span>            resetCommonCaches();</span></span>
<span class="line"><span>            contextRefresh.end();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的设计上是一个非常典型的资源类加载处理型的思路，头脑中需要形成如下图的<strong>顶层思路</strong>（而不是只停留在流水式的方法上面）：</p><ul><li><strong>模板方法设计模式</strong>，模板方法中使用典型的<strong>钩子方法</strong></li><li>将<strong>具体的初始化加载方法</strong>插入到钩子方法之间</li><li>将初始化的阶段封装，用来记录当前初始化到什么阶段；常见的设计是xxxPhase/xxxStage；</li><li>资源加载初始化有失败等处理，必然是<strong>try/catch/finally</strong>...</li></ul><p><img src="`+a+`" alt="error.图片加载失败"></p><h4 id="初始化beanfactory之obtainfreshbeanfactory" tabindex="-1">初始化BeanFactory之obtainFreshBeanFactory <a class="header-anchor" href="#初始化beanfactory之obtainfreshbeanfactory" aria-label="Permalink to &quot;初始化BeanFactory之obtainFreshBeanFactory&quot;">​</a></h4><p>AbstractApplicationContext的obtainFreshBeanFactory()方法调用子类容器的refreshBeanFactory()方法，启动容器载入Bean定义资源文件的过程，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected ConfigurableListableBeanFactory obtainFreshBeanFactory() {</span></span>
<span class="line"><span>    // 这里使用了委派设计模式，父类定义了抽象的refreshBeanFactory()方法，具体实现调用子类容器的refreshBeanFactory()方法</span></span>
<span class="line"><span>    refreshBeanFactory();</span></span>
<span class="line"><span>    return getBeanFactory();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AbstractApplicationContext类中只抽象定义了refreshBeanFactory()方法，容器真正调用的是其子类AbstractRefreshableApplicationContext实现的refreshBeanFactory()方法; 在创建IoC容器前，如果已经有容器存在，则需要把已有的容器销毁和关闭，以保证在refresh之后使用的是新建立起来的IoC容器。方法的源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected final void refreshBeanFactory() throws BeansException {</span></span>
<span class="line"><span>    // 如果已经有容器存在，则需要把已有的容器销毁和关闭，以保证在refresh之后使用的是新建立起来的IoC容器</span></span>
<span class="line"><span>    if (hasBeanFactory()) {</span></span>
<span class="line"><span>        destroyBeans();</span></span>
<span class="line"><span>        closeBeanFactory();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 创建DefaultListableBeanFactory，并调用loadBeanDefinitions(beanFactory)装载bean定义</span></span>
<span class="line"><span>        DefaultListableBeanFactory beanFactory = createBeanFactory();</span></span>
<span class="line"><span>        beanFactory.setSerializationId(getId());</span></span>
<span class="line"><span>        customizeBeanFactory(beanFactory); // 对IoC容器进行定制化，如设置启动参数，开启注解的自动装配等 </span></span>
<span class="line"><span>        loadBeanDefinitions(beanFactory); // 调用载入Bean定义的方法，主要这里又使用了一个委派模式，在当前类中只定义了抽象的loadBeanDefinitions方法，具体的实现调用子类容器  </span></span>
<span class="line"><span>        this.beanFactory = beanFactory;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (IOException ex) {</span></span>
<span class="line"><span>        throw new ApplicationContextException(&quot;I/O error parsing bean definition source for &quot; + getDisplayName(), ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="初始化beanfactory之loadbeandefinitions" tabindex="-1">初始化BeanFactory之loadBeanDefinitions <a class="header-anchor" href="#初始化beanfactory之loadbeandefinitions" aria-label="Permalink to &quot;初始化BeanFactory之loadBeanDefinitions&quot;">​</a></h4><p>AbstractRefreshableApplicationContext中只定义了抽象的loadBeanDefinitions方法，容器真正调用的是其子类AbstractXmlApplicationContext对该方法的实现，AbstractXmlApplicationContext的主要源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void loadBeanDefinitions(DefaultListableBeanFactory beanFactory) throws BeansException, IOException {</span></span>
<span class="line"><span>    // 创建XmlBeanDefinitionReader，即创建Bean读取器，并通过回调设置到容器中去，容器使用该读取器读取Bean定义资源  </span></span>
<span class="line"><span>    XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 配置上下文的环境，资源加载器、解析器</span></span>
<span class="line"><span>    beanDefinitionReader.setEnvironment(this.getEnvironment());</span></span>
<span class="line"><span>    beanDefinitionReader.setResourceLoader(this);</span></span>
<span class="line"><span>    beanDefinitionReader.setEntityResolver(new ResourceEntityResolver(this)); // 为Bean读取器设置SAX xml解析器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 允许子类自行初始化（比如校验机制），并提供真正的加载方法</span></span>
<span class="line"><span>    initBeanDefinitionReader(beanDefinitionReader); // 当Bean读取器读取Bean定义的Xml资源文件时，启用Xml的校验机制  </span></span>
<span class="line"><span>    loadBeanDefinitions(beanDefinitionReader);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected void loadBeanDefinitions(XmlBeanDefinitionReader reader) throws BeansException, IOException {</span></span>
<span class="line"><span>    // 加载XML配置方式里的Bean定义的资源</span></span>
<span class="line"><span>    Resource[] configResources = getConfigResources();</span></span>
<span class="line"><span>    if (configResources != null) {</span></span>
<span class="line"><span>        reader.loadBeanDefinitions(configResources);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 加载构造函数里配置的Bean配置文件，即{&quot;aspects.xml&quot;, &quot;daos.xml&quot;, &quot;services.xml&quot;}</span></span>
<span class="line"><span>    String[] configLocations = getConfigLocations();</span></span>
<span class="line"><span>    if (configLocations != null) {</span></span>
<span class="line"><span>        reader.loadBeanDefinitions(configLocations);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Xml Bean读取器(XmlBeanDefinitionReader)调用其父类AbstractBeanDefinitionReader的 reader.loadBeanDefinitions方法读取Bean定义资源。</p><p>由于我们使用ClassPathXmlApplicationContext作为例子分析，因此getConfigResources的返回值为null，因此程序执行reader.loadBeanDefinitions(configLocations)分支。</p><h4 id="abstractbeandefinitionreader读取bean定义资源" tabindex="-1">AbstractBeanDefinitionReader读取Bean定义资源 <a class="header-anchor" href="#abstractbeandefinitionreader读取bean定义资源" aria-label="Permalink to &quot;AbstractBeanDefinitionReader读取Bean定义资源&quot;">​</a></h4><p>AbstractBeanDefinitionReader的loadBeanDefinitions方法源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public int loadBeanDefinitions(String location) throws BeanDefinitionStoreException {</span></span>
<span class="line"><span>    return loadBeanDefinitions(location, null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public int loadBeanDefinitions(String location, @Nullable Set&lt;Resource&gt; actualResources) throws BeanDefinitionStoreException {</span></span>
<span class="line"><span>    ResourceLoader resourceLoader = getResourceLoader();</span></span>
<span class="line"><span>    if (resourceLoader == null) {</span></span>
<span class="line"><span>        throw new BeanDefinitionStoreException(</span></span>
<span class="line"><span>                &quot;Cannot load bean definitions from location [&quot; + location + &quot;]: no ResourceLoader available&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 模式匹配类型的解析器，这种方式是加载多个满足匹配条件的资源</span></span>
<span class="line"><span>    if (resourceLoader instanceof ResourcePatternResolver) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 获取到要加载的资源</span></span>
<span class="line"><span>            Resource[] resources = ((ResourcePatternResolver) resourceLoader).getResources(location);</span></span>
<span class="line"><span>            int count = loadBeanDefinitions(resources); // 委派调用其子类XmlBeanDefinitionReader的方法，实现加载功能  </span></span>
<span class="line"><span>            if (actualResources != null) {</span></span>
<span class="line"><span>                Collections.addAll(actualResources, resources);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>                logger.trace(&quot;Loaded &quot; + count + &quot; bean definitions from location pattern [&quot; + location + &quot;]&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return count;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch (IOException ex) {</span></span>
<span class="line"><span>            throw new BeanDefinitionStoreException(</span></span>
<span class="line"><span>                    &quot;Could not resolve bean definition resource pattern [&quot; + location + &quot;]&quot;, ex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        // 只能通过绝对路径URL加载单个资源.</span></span>
<span class="line"><span>        Resource resource = resourceLoader.getResource(location);</span></span>
<span class="line"><span>        int count = loadBeanDefinitions(resource);</span></span>
<span class="line"><span>        if (actualResources != null) {</span></span>
<span class="line"><span>            actualResources.add(resource);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>            logger.trace(&quot;Loaded &quot; + count + &quot; bean definitions from location [&quot; + location + &quot;]&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从对AbstractBeanDefinitionReader的loadBeanDefinitions方法源码分析可以看出该方法做了以下两件事：</p><ul><li>首先，调用资源加载器的获取资源方法resourceLoader.getResource(location)，获取到要加载的资源。</li><li>其次，真正执行加载功能是其子类XmlBeanDefinitionReader的loadBeanDefinitions方法。</li></ul><h4 id="xmlbeandefinitionreader加载bean定义资源" tabindex="-1">XmlBeanDefinitionReader加载Bean定义资源 <a class="header-anchor" href="#xmlbeandefinitionreader加载bean定义资源" aria-label="Permalink to &quot;XmlBeanDefinitionReader加载Bean定义资源&quot;">​</a></h4><p>继续看子类XmlBeanDefinitionReader的loadBeanDefinitions(Resource …)方法看到代表bean文件的资源定义以后的载入过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * 本质上是加载XML配置的Bean。</span></span>
<span class="line"><span>    * @param inputSource the SAX InputSource to read from</span></span>
<span class="line"><span>    * @param resource the resource descriptor for the XML file</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>protected int doLoadBeanDefinitions(InputSource inputSource, Resource resource)</span></span>
<span class="line"><span>        throws BeanDefinitionStoreException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        Document doc = doLoadDocument(inputSource, resource); // 将Bean定义资源转换成Document对象</span></span>
<span class="line"><span>        int count = registerBeanDefinitions(doc, resource);</span></span>
<span class="line"><span>        if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>            logger.debug(&quot;Loaded &quot; + count + &quot; bean definitions from &quot; + resource);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (BeanDefinitionStoreException ex) {</span></span>
<span class="line"><span>        throw ex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (SAXParseException ex) {</span></span>
<span class="line"><span>        throw new XmlBeanDefinitionStoreException(resource.getDescription(),</span></span>
<span class="line"><span>                &quot;Line &quot; + ex.getLineNumber() + &quot; in XML document from &quot; + resource + &quot; is invalid&quot;, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (SAXException ex) {</span></span>
<span class="line"><span>        throw new XmlBeanDefinitionStoreException(resource.getDescription(),</span></span>
<span class="line"><span>                &quot;XML document from &quot; + resource + &quot; is invalid&quot;, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (ParserConfigurationException ex) {</span></span>
<span class="line"><span>        throw new BeanDefinitionStoreException(resource.getDescription(),</span></span>
<span class="line"><span>                &quot;Parser configuration exception parsing XML from &quot; + resource, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (IOException ex) {</span></span>
<span class="line"><span>        throw new BeanDefinitionStoreException(resource.getDescription(),</span></span>
<span class="line"><span>                &quot;IOException parsing XML document from &quot; + resource, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (Throwable ex) {</span></span>
<span class="line"><span>        throw new BeanDefinitionStoreException(resource.getDescription(),</span></span>
<span class="line"><span>                &quot;Unexpected exception parsing XML document from &quot; + resource, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 使用配置的DocumentLoader加载XML定义文件为Document.</span></span>
<span class="line"><span>protected Document doLoadDocument(InputSource inputSource, Resource resource) throws Exception {</span></span>
<span class="line"><span>    return this.documentLoader.loadDocument(inputSource, getEntityResolver(), this.errorHandler,</span></span>
<span class="line"><span>            getValidationModeForResource(resource), isNamespaceAware());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过源码分析，载入Bean定义资源文件的最后一步是将Bean定义资源转换为Document对象，该过程由documentLoader实现</p><h4 id="documentloader将bean定义资源转换为document对象" tabindex="-1">DocumentLoader将Bean定义资源转换为Document对象 <a class="header-anchor" href="#documentloader将bean定义资源转换为document对象" aria-label="Permalink to &quot;DocumentLoader将Bean定义资源转换为Document对象&quot;">​</a></h4><p>DocumentLoader将Bean定义资源转换成Document对象的源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 使用标准的JAXP将载入的Bean定义资源转换成document对象</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Document loadDocument(InputSource inputSource, EntityResolver entityResolver,</span></span>
<span class="line"><span>        ErrorHandler errorHandler, int validationMode, boolean namespaceAware) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建文件解析器工厂</span></span>
<span class="line"><span>    DocumentBuilderFactory factory = createDocumentBuilderFactory(validationMode, namespaceAware);</span></span>
<span class="line"><span>    if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>        logger.trace(&quot;Using JAXP provider [&quot; + factory.getClass().getName() + &quot;]&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 创建文档解析器</span></span>
<span class="line"><span>    DocumentBuilder builder = createDocumentBuilder(factory, entityResolver, errorHandler);</span></span>
<span class="line"><span>    return builder.parse(inputSource); // 解析</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected DocumentBuilderFactory createDocumentBuilderFactory(int validationMode, boolean namespaceAware)</span></span>
<span class="line"><span>        throws ParserConfigurationException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();</span></span>
<span class="line"><span>    factory.setNamespaceAware(namespaceAware);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置解析XML的校验</span></span>
<span class="line"><span>    if (validationMode != XmlValidationModeDetector.VALIDATION_NONE) {</span></span>
<span class="line"><span>        factory.setValidating(true);</span></span>
<span class="line"><span>        if (validationMode == XmlValidationModeDetector.VALIDATION_XSD) {</span></span>
<span class="line"><span>            // Enforce namespace aware for XSD...</span></span>
<span class="line"><span>            factory.setNamespaceAware(true);</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                factory.setAttribute(SCHEMA_LANGUAGE_ATTRIBUTE, XSD_SCHEMA_LANGUAGE);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            catch (IllegalArgumentException ex) {</span></span>
<span class="line"><span>                ParserConfigurationException pcex = new ParserConfigurationException(</span></span>
<span class="line"><span>                        &quot;Unable to validate using XSD: Your JAXP provider [&quot; + factory +</span></span>
<span class="line"><span>                        &quot;] does not support XML Schema. Are you running on Java 1.4 with Apache Crimson? &quot; +</span></span>
<span class="line"><span>                        &quot;Upgrade to Apache Xerces (or Java 1.5) for full XSD support.&quot;);</span></span>
<span class="line"><span>                pcex.initCause(ex);</span></span>
<span class="line"><span>                throw pcex;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return factory;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该解析过程调用JavaEE标准的JAXP标准进行处理。</p><p>至此Spring IoC容器根据定位的Bean定义资源文件，将其加载读入并转换成为Document对象过程完成。</p><p>接下来我们要继续分析Spring IoC容器将载入的Bean定义资源文件转换为Document对象之后，是如何将其解析为Spring IoC管理的Bean对象并将其注册到容器中的。</p><h4 id="xmlbeandefinitionreader解析载入的bean定义资源文件" tabindex="-1">XmlBeanDefinitionReader解析载入的Bean定义资源文件 <a class="header-anchor" href="#xmlbeandefinitionreader解析载入的bean定义资源文件" aria-label="Permalink to &quot;XmlBeanDefinitionReader解析载入的Bean定义资源文件&quot;">​</a></h4><p>XmlBeanDefinitionReader类中的doLoadBeanDefinitions方法是从特定XML文件中实际载入Bean定义资源的方法，该方法在载入Bean定义资源之后将其转换为Document对象，接下来调用registerBeanDefinitions启动Spring IoC容器对Bean定义的解析过程，registerBeanDefinitions方法源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 按照Spring的Bean语义要求将Bean定义资源解析并转换为容器内部数据结构 </span></span>
<span class="line"><span>public int registerBeanDefinitions(Document doc, Resource resource) throws BeanDefinitionStoreException {</span></span>
<span class="line"><span>    BeanDefinitionDocumentReader documentReader = createBeanDefinitionDocumentReader();</span></span>
<span class="line"><span>    int countBefore = getRegistry().getBeanDefinitionCount();</span></span>
<span class="line"><span>    // 解析过程入口，这里使用了委派模式，具体的解析实现过程有实现类DefaultBeanDefinitionDocumentReader完成  </span></span>
<span class="line"><span>    documentReader.registerBeanDefinitions(doc, createReaderContext(resource));</span></span>
<span class="line"><span>    return getRegistry().getBeanDefinitionCount() - countBefore;  // 返回此次解析了多少个对象</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 创建BeanDefinitionDocumentReader对象，解析Document对象  </span></span>
<span class="line"><span>protected BeanDefinitionDocumentReader createBeanDefinitionDocumentReader() {</span></span>
<span class="line"><span>    return BeanUtils.instantiateClass(this.documentReaderClass);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>    * Create the {@link XmlReaderContext} to pass over to the document reader.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>public XmlReaderContext createReaderContext(Resource resource) {</span></span>
<span class="line"><span>    return new XmlReaderContext(resource, this.problemReporter, this.eventListener,</span></span>
<span class="line"><span>            this.sourceExtractor, this, getNamespaceHandlerResolver());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Bean定义资源的载入解析分为以下两个过程：</p><ul><li>首先，通过调用XML解析器将Bean定义资源文件转换得到Document对象，但是这些Document对象并没有按照Spring的Bean规则进行解析。这一步是载入的过程</li><li>其次，在完成通用的XML解析之后，按照Spring的Bean规则对Document对象进行解析。</li></ul><p>按照Spring的Bean规则对Document对象解析的过程是在接口BeanDefinitionDocumentReader的实现类DefaultBeanDefinitionDocumentReader中实现的。</p><h4 id="defaultbeandefinitiondocumentreader对bean定义的document对象解析" tabindex="-1">DefaultBeanDefinitionDocumentReader对Bean定义的Document对象解析 <a class="header-anchor" href="#defaultbeandefinitiondocumentreader对bean定义的document对象解析" aria-label="Permalink to &quot;DefaultBeanDefinitionDocumentReader对Bean定义的Document对象解析&quot;">​</a></h4><p>BeanDefinitionDocumentReader接口通过registerBeanDefinitions方法调用其实现类DefaultBeanDefinitionDocumentReader对Document对象进行解析，解析的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void registerBeanDefinitions(Document doc, XmlReaderContext readerContext) {</span></span>
<span class="line"><span>    this.readerContext = readerContext;</span></span>
<span class="line"><span>    doRegisterBeanDefinitions(doc.getDocumentElement());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 注册&lt;beans/&gt;配置的Beans</span></span>
<span class="line"><span>@SuppressWarnings(&quot;deprecation&quot;)  // for Environment.acceptsProfiles(String...)</span></span>
<span class="line"><span>protected void doRegisterBeanDefinitions(Element root) {</span></span>
<span class="line"><span>    // Any nested &lt;beans&gt; elements will cause recursion in this method. In</span></span>
<span class="line"><span>    // order to propagate and preserve &lt;beans&gt; default-* attributes correctly,</span></span>
<span class="line"><span>    // keep track of the current (parent) delegate, which may be null. Create</span></span>
<span class="line"><span>    // the new (child) delegate with a reference to the parent for fallback purposes,</span></span>
<span class="line"><span>    // then ultimately reset this.delegate back to its original (parent) reference.</span></span>
<span class="line"><span>    // this behavior emulates a stack of delegates without actually necessitating one.</span></span>
<span class="line"><span>    BeanDefinitionParserDelegate parent = this.delegate;</span></span>
<span class="line"><span>    this.delegate = createDelegate(getReaderContext(), root, parent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (this.delegate.isDefaultNamespace(root)) {</span></span>
<span class="line"><span>        String profileSpec = root.getAttribute(PROFILE_ATTRIBUTE);</span></span>
<span class="line"><span>        if (StringUtils.hasText(profileSpec)) {</span></span>
<span class="line"><span>            String[] specifiedProfiles = StringUtils.tokenizeToStringArray(</span></span>
<span class="line"><span>                    profileSpec, BeanDefinitionParserDelegate.MULTI_VALUE_ATTRIBUTE_DELIMITERS);</span></span>
<span class="line"><span>            // We cannot use Profiles.of(...) since profile expressions are not supported</span></span>
<span class="line"><span>            // in XML config. See SPR-12458 for details.</span></span>
<span class="line"><span>            if (!getReaderContext().getEnvironment().acceptsProfiles(specifiedProfiles)) {</span></span>
<span class="line"><span>                if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>                    logger.debug(&quot;Skipped XML bean definition file due to specified profiles [&quot; + profileSpec +</span></span>
<span class="line"><span>                            &quot;] not matching: &quot; + getReaderContext().getResource());</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    preProcessXml(root);</span></span>
<span class="line"><span>    parseBeanDefinitions(root, this.delegate); // 从Document的根元素开始进行Bean定义的Document对象  </span></span>
<span class="line"><span>    postProcessXml(root);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.delegate = parent;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="beandefinitionparserdelegate解析bean定义资源文件生成beandefinition" tabindex="-1">BeanDefinitionParserDelegate解析Bean定义资源文件生成BeanDefinition <a class="header-anchor" href="#beandefinitionparserdelegate解析bean定义资源文件生成beandefinition" aria-label="Permalink to &quot;BeanDefinitionParserDelegate解析Bean定义资源文件生成BeanDefinition&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Parse the elements at the root level in the document:</span></span>
<span class="line"><span>    * &quot;import&quot;, &quot;alias&quot;, &quot;bean&quot;.</span></span>
<span class="line"><span>    * @param root the DOM root element of the document</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>protected void parseBeanDefinitions(Element root, BeanDefinitionParserDelegate delegate) {</span></span>
<span class="line"><span>    if (delegate.isDefaultNamespace(root)) {</span></span>
<span class="line"><span>        NodeList nl = root.getChildNodes();</span></span>
<span class="line"><span>        for (int i = 0; i &lt; nl.getLength(); i++) {</span></span>
<span class="line"><span>            Node node = nl.item(i);</span></span>
<span class="line"><span>            if (node instanceof Element) {</span></span>
<span class="line"><span>                Element ele = (Element) node;</span></span>
<span class="line"><span>                if (delegate.isDefaultNamespace(ele)) {</span></span>
<span class="line"><span>                    parseDefaultElement(ele, delegate);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                else {</span></span>
<span class="line"><span>                    delegate.parseCustomElement(ele);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        delegate.parseCustomElement(root);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void parseDefaultElement(Element ele, BeanDefinitionParserDelegate delegate) {</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>    // 如果元素节点是&lt;Import&gt;导入元素，进行导入解析</span></span>
<span class="line"><span>    if (delegate.nodeNameEquals(ele, IMPORT_ELEMENT)) {</span></span>
<span class="line"><span>        importBeanDefinitionResource(ele);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 如果元素节点是&lt;Alias&gt;别名元素，进行别名解析 </span></span>
<span class="line"><span>    else if (delegate.nodeNameEquals(ele, ALIAS_ELEMENT)) {</span></span>
<span class="line"><span>        processAliasRegistration(ele);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 如果元素节点&lt;Bean&gt;元素, 按照Spring的Bean规则解析元素  </span></span>
<span class="line"><span>    else if (delegate.nodeNameEquals(ele, BEAN_ELEMENT)) {</span></span>
<span class="line"><span>        processBeanDefinition(ele, delegate);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 如果元素节点&lt;Beans&gt;元素，即它是嵌套类型的</span></span>
<span class="line"><span>    else if (delegate.nodeNameEquals(ele, NESTED_BEANS_ELEMENT)) {</span></span>
<span class="line"><span>        // 递归解析</span></span>
<span class="line"><span>        doRegisterBeanDefinitions(ele);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>解析Bean生成BeanDefinitionHolder的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Process the given bean element, parsing the bean definition</span></span>
<span class="line"><span>    * and registering it with the registry.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>protected void processBeanDefinition(Element ele, BeanDefinitionParserDelegate delegate) {</span></span>
<span class="line"><span>    BeanDefinitionHolder bdHolder = delegate.parseBeanDefinitionElement(ele);</span></span>
<span class="line"><span>    if (bdHolder != null) {</span></span>
<span class="line"><span>        bdHolder = delegate.decorateBeanDefinitionIfRequired(ele, bdHolder);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 注册最终的装饰实例</span></span>
<span class="line"><span>            BeanDefinitionReaderUtils.registerBeanDefinition(bdHolder, getReaderContext().getRegistry());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch (BeanDefinitionStoreException ex) {</span></span>
<span class="line"><span>            getReaderContext().error(&quot;Failed to register bean definition with name &#39;&quot; +</span></span>
<span class="line"><span>                    bdHolder.getBeanName() + &quot;&#39;&quot;, ele, ex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // Send registration event.</span></span>
<span class="line"><span>        getReaderContext().fireComponentRegistered(new BeanComponentDefinition(bdHolder));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>（这里就不展开了，无非就是解析XML各种元素，来生成BeanDefinition）</p><h4 id="解析过后的beandefinition在ioc容器中的注册" tabindex="-1">解析过后的BeanDefinition在IoC容器中的注册 <a class="header-anchor" href="#解析过后的beandefinition在ioc容器中的注册" aria-label="Permalink to &quot;解析过后的BeanDefinition在IoC容器中的注册&quot;">​</a></h4><p>Document对象的解析后得到封装BeanDefinition的BeanDefinitionHold对象，然后调用BeanDefinitionReaderUtils的registerBeanDefinition方法向IoC容器注册解析的Bean，BeanDefinitionReaderUtils的注册的源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 通过BeanDefinitionRegistry将BeanDefinitionHolder注册到BeanFactory</span></span>
<span class="line"><span>public static void registerBeanDefinition(</span></span>
<span class="line"><span>        BeanDefinitionHolder definitionHolder, BeanDefinitionRegistry registry)</span></span>
<span class="line"><span>        throws BeanDefinitionStoreException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Register bean definition under primary name.</span></span>
<span class="line"><span>    String beanName = definitionHolder.getBeanName();</span></span>
<span class="line"><span>    registry.registerBeanDefinition(beanName, definitionHolder.getBeanDefinition());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Register aliases for bean name, if any.</span></span>
<span class="line"><span>    String[] aliases = definitionHolder.getAliases();</span></span>
<span class="line"><span>    if (aliases != null) {</span></span>
<span class="line"><span>        for (String alias : aliases) {</span></span>
<span class="line"><span>            registry.registerAlias(beanName, alias);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当调用BeanDefinitionReaderUtils向IoC容器注册解析的BeanDefinition时，真正完成注册功能的是DefaultListableBeanFactory。</p><h4 id="defaultlistablebeanfactory向ioc容器注册解析后的beandefinition" tabindex="-1">DefaultListableBeanFactory向IoC容器注册解析后的BeanDefinition <a class="header-anchor" href="#defaultlistablebeanfactory向ioc容器注册解析后的beandefinition" aria-label="Permalink to &quot;DefaultListableBeanFactory向IoC容器注册解析后的BeanDefinition&quot;">​</a></h4><p>IOC容器本质上就是一个beanDefinitionMap， 注册即将BeanDefinition put到map中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** Map of bean definition objects, keyed by bean name. */</span></span>
<span class="line"><span>private final Map&lt;String, BeanDefinition&gt; beanDefinitionMap = new ConcurrentHashMap&lt;&gt;(256);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/** Map from bean name to merged BeanDefinitionHolder. */</span></span>
<span class="line"><span>private final Map&lt;String, BeanDefinitionHolder&gt; mergedBeanDefinitionHolders = new ConcurrentHashMap&lt;&gt;(256);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void registerBeanDefinition(String beanName, BeanDefinition beanDefinition)</span></span>
<span class="line"><span>        throws BeanDefinitionStoreException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Assert.hasText(beanName, &quot;Bean name must not be empty&quot;);</span></span>
<span class="line"><span>    Assert.notNull(beanDefinition, &quot;BeanDefinition must not be null&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (beanDefinition instanceof AbstractBeanDefinition) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            ((AbstractBeanDefinition) beanDefinition).validate();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch (BeanDefinitionValidationException ex) {</span></span>
<span class="line"><span>            throw new BeanDefinitionStoreException(beanDefinition.getResourceDescription(), beanName,</span></span>
<span class="line"><span>                    &quot;Validation of bean definition failed&quot;, ex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    BeanDefinition existingDefinition = this.beanDefinitionMap.get(beanName);</span></span>
<span class="line"><span>    // 如果已经注册</span></span>
<span class="line"><span>    if (existingDefinition != null) {</span></span>
<span class="line"><span>        // 检查是否可以覆盖</span></span>
<span class="line"><span>        if (!isAllowBeanDefinitionOverriding()) {</span></span>
<span class="line"><span>            throw new BeanDefinitionOverrideException(beanName, beanDefinition, existingDefinition);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (existingDefinition.getRole() &lt; beanDefinition.getRole()) {</span></span>
<span class="line"><span>            // e.g. was ROLE_APPLICATION, now overriding with ROLE_SUPPORT or ROLE_INFRASTRUCTURE</span></span>
<span class="line"><span>            if (logger.isInfoEnabled()) {</span></span>
<span class="line"><span>                logger.info(&quot;Overriding user-defined bean definition for bean &#39;&quot; + beanName +</span></span>
<span class="line"><span>                        &quot;&#39; with a framework-generated bean definition: replacing [&quot; +</span></span>
<span class="line"><span>                        existingDefinition + &quot;] with [&quot; + beanDefinition + &quot;]&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (!beanDefinition.equals(existingDefinition)) {</span></span>
<span class="line"><span>            if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>                logger.debug(&quot;Overriding bean definition for bean &#39;&quot; + beanName +</span></span>
<span class="line"><span>                        &quot;&#39; with a different definition: replacing [&quot; + existingDefinition +</span></span>
<span class="line"><span>                        &quot;] with [&quot; + beanDefinition + &quot;]&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>                logger.trace(&quot;Overriding bean definition for bean &#39;&quot; + beanName +</span></span>
<span class="line"><span>                        &quot;&#39; with an equivalent definition: replacing [&quot; + existingDefinition +</span></span>
<span class="line"><span>                        &quot;] with [&quot; + beanDefinition + &quot;]&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 覆盖</span></span>
<span class="line"><span>        this.beanDefinitionMap.put(beanName, beanDefinition);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        if (hasBeanCreationStarted()) {</span></span>
<span class="line"><span>            // Cannot modify startup-time collection elements anymore (for stable iteration)</span></span>
<span class="line"><span>            synchronized (this.beanDefinitionMap) {</span></span>
<span class="line"><span>                this.beanDefinitionMap.put(beanName, beanDefinition);</span></span>
<span class="line"><span>                List&lt;String&gt; updatedDefinitions = new ArrayList&lt;&gt;(this.beanDefinitionNames.size() + 1);</span></span>
<span class="line"><span>                updatedDefinitions.addAll(this.beanDefinitionNames);</span></span>
<span class="line"><span>                updatedDefinitions.add(beanName);</span></span>
<span class="line"><span>                this.beanDefinitionNames = updatedDefinitions;</span></span>
<span class="line"><span>                removeManualSingletonName(beanName);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            // Still in startup registration phase</span></span>
<span class="line"><span>            this.beanDefinitionMap.put(beanName, beanDefinition);</span></span>
<span class="line"><span>            this.beanDefinitionNames.add(beanName);</span></span>
<span class="line"><span>            removeManualSingletonName(beanName);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //重置所有已经注册过的BeanDefinition的缓存  </span></span>
<span class="line"><span>        this.frozenBeanDefinitionNames = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (existingDefinition != null || containsSingleton(beanName)) {</span></span>
<span class="line"><span>        resetBeanDefinition(beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else if (isConfigurationFrozen()) {</span></span>
<span class="line"><span>        clearByTypeCache();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>至此，Bean定义资源文件中配置的Bean被解析过后，已经注册到IoC容器中，被容器管理起来，真正完成了IoC容器初始化所做的全部工作。现 在IoC容器中已经建立了整个Bean的配置信息，这些BeanDefinition信息已经可以使用，并且可以被检索，IoC容器的作用就是对这些注册的Bean定义信息进行处理和维护。这些的注册的Bean定义信息是IoC容器控制反转的基础，正是有了这些注册的数据，容器才可以进行依赖注入。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>现在通过上面的代码，总结一下IOC容器初始化的基本步骤：</p><p><img src="`+l+'" alt="error.图片加载失败"></p><ul><li><p>初始化的入口在容器实现中的 refresh()调用来完成</p></li><li><p>对 bean 定义载入 IOC 容器使用的方法是 loadBeanDefinition,其中的大致过程如下：</p><ul><li>通过 ResourceLoader 来完成资源文件位置的定位，DefaultResourceLoader 是默认的实现，同时上下文本身就给出了 ResourceLoader 的实现，可以从类路径，文件系统, URL 等方式来定为资源位置。如果是 XmlBeanFactory作为 IOC 容器，那么需要为它指定 bean 定义的资源，也就是说 bean 定义文件时通过抽象成 Resource 来被 IOC 容器处理的</li><li>通过 BeanDefinitionReader来完成定义信息的解析和 Bean 信息的注册, 往往使用的是XmlBeanDefinitionReader 来解析 bean 的 xml 定义文件 - 实际的处理过程是委托给 BeanDefinitionParserDelegate 来完成的，从而得到 bean 的定义信息，这些信息在 Spring 中使用 BeanDefinition 对象来表示 - 这个名字可以让我们想到loadBeanDefinition,RegisterBeanDefinition 这些相关的方法 - 他们都是为处理 BeanDefinitin 服务的</li><li>容器解析得到 BeanDefinition 以后，需要把它在 IOC 容器中注册，这由 IOC 实现 BeanDefinitionRegistry 接口来实现。注册过程就是在 IOC 容器内部维护的一个HashMap 来保存得到的 BeanDefinition 的过程。这个 HashMap 是 IoC 容器持有 bean 信息的场所，以后对 bean 的操作都是围绕这个HashMap 来实现的.</li></ul></li><li><p>然后我们就可以通过 BeanFactory 和 ApplicationContext 来享受到 Spring IOC 的服务了,在使用 IOC 容器的时候，我们注意到除了少量粘合代码，绝大多数以正确 IoC 风格编写的应用程序代码完全不用关心如何到达工厂，因为容器将把这些对象与容器管理的其他对象钩在一起。基本的策略是把工厂放到已知的地方，最好是放在对预期使用的上下文有意义的地方，以及代码将实际需要访问工厂的地方。 Spring 本身提供了对声明式载入 web 应用程序用法的应用程序上下文,并将其存储在ServletContext 中的框架实现。</p></li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://blog.csdn.net/qq%5C_36212439/article/details/82749963" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_36212439/article/details/82749963</a></p><p><a href="https://juejin.cn/post/6973884466171215908" target="_blank" rel="noreferrer">https://juejin.cn/post/6973884466171215908</a></p><p><a href="https://juejin.cn/post/6844903838743265294" target="_blank" rel="noreferrer">https://juejin.cn/post/6844903838743265294</a></p><p><a href="https://blog.csdn.net/hjing123/article/details/104867343" target="_blank" rel="noreferrer">https://blog.csdn.net/hjing123/article/details/104867343</a></p><p><a href="https://www.cnblogs.com/wl20200316/p/12522993.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/wl20200316/p/12522993.html</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',85)]))}const D=s(o,[["render",c]]);export{m as __pageData,D as default};
