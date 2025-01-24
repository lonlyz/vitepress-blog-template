import{_ as s}from"./chunks/spring-springframework-mvc-23.D3ApHqul.js";import{_ as a,c as e,ai as p,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-13.png",l="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-11.png",r="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-24.png",o="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-26.png",c="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-25.png",x=JSON.parse('{"title":"Spring进阶 - SpringMVC实现原理之DispatcherServlet的初始化过程","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-springmvc-source-1.md","filePath":"spring/spring-x-framework-springmvc-source-1.md","lastUpdated":1737706346000}'),g={name:"spring/spring-x-framework-springmvc-source-1.md"};function d(f,n,m,h,u,b){return t(),e("div",null,n[0]||(n[0]=[p('<h1 id="spring进阶-springmvc实现原理之dispatcherservlet的初始化过程" tabindex="-1">Spring进阶 - SpringMVC实现原理之DispatcherServlet的初始化过程 <a class="header-anchor" href="#spring进阶-springmvc实现原理之dispatcherservlet的初始化过程" aria-label="Permalink to &quot;Spring进阶 - SpringMVC实现原理之DispatcherServlet的初始化过程&quot;">​</a></h1><blockquote><p>前文我们有了IOC的源码基础以及SpringMVC的基础，我们便可以进一步深入理解SpringMVC主要实现原理，包含DispatcherServlet的初始化过程和DispatcherServlet处理请求的过程的源码解析。本文是第一篇：DispatcherServlet的初始化过程的源码解析。@pdai</p></blockquote><h2 id="dispatcherservlet和applicationcontext有何关系" tabindex="-1">DispatcherServlet和ApplicationContext有何关系？ <a class="header-anchor" href="#dispatcherservlet和applicationcontext有何关系" aria-label="Permalink to &quot;DispatcherServlet和ApplicationContext有何关系？&quot;">​</a></h2><blockquote><p>DispatcherServlet 作为一个 Servlet，需要根据 Servlet 规范使用 Java 配置或 web.xml 声明和映射。反过来，DispatcherServlet 使用 Spring 配置来发现请求映射、视图解析、异常处理等等所需的委托组件。那它和ApplicationContext有和关系呢？如下内容可以参考<a href="https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-servlet" target="_blank" rel="noreferrer">官网-SpringMVC文档在新窗口打开</a></p></blockquote><p>DispatcherServlet 需要 WebApplicationContext（继承自 ApplicationContext） 来配置。WebApplicationContext 可以链接到ServletContext 和 Servlet。因为绑定了 ServletContext，这样应用程序就可以在需要的时候使用 RequestContextUtils 的静态方法访问 WebApplicationContext。</p><p>大多数应用程序只有一个WebApplicationContext，除此之外也可以一个Root WebApplicationContext 被多个 Servlet实例，然后各自拥有自己的Servlet WebApplicationContext 配置。</p><p>Root WebApplicationContext 包含需要共享给多个 Servlet 实例的数据源和业务服务基础 Bean。这些 Bean 可以在 Servlet 特定的范围被继承或覆盖。</p><p>（PS：官网上的这张图可以可以帮助你构建DispatcherServlet和ApplicationContext在设计上的认知，这一点对于理解DispatcherServlet的设计和初始化过程非常重要）</p><p><img src="'+i+'" alt="error.图片加载失败"></p><h2 id="dispatcherservlet是如何初始化的" tabindex="-1">DispatcherServlet是如何初始化的？ <a class="header-anchor" href="#dispatcherservlet是如何初始化的" aria-label="Permalink to &quot;DispatcherServlet是如何初始化的？&quot;">​</a></h2><blockquote><p>DispatcherServlet首先是Sevlet，Servlet有自己的生命周期的方法（init,destory等），那么我们在看DispatcherServlet初始化时首先需要看源码中DispatcherServlet的类结构设计。</p></blockquote><p>首先我们看DispatcherServlet的类结构关系，在这个类依赖结构中找到init的方法</p><p><img src="'+l+'" alt="error.图片加载失败"></p><p>很容易找到init()的方法位于HttpServletBean中，然后跑<a href="https://pdai.tech/md/spring/spring-x-framework-springmvc.html" target="_blank" rel="noreferrer">Spring基础 - SpringMVC请求流程和案例</a>中的代码，在init方法中打断点。</p><p><img src="'+s+`" alt="error.图片加载失败"></p><h3 id="init" tabindex="-1">init <a class="header-anchor" href="#init" aria-label="Permalink to &quot;init&quot;">​</a></h3><p>init()方法如下, 主要读取web.xml中servlet参数配置，并将交给子类方法initServletBean()继续初始化</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Map config parameters onto bean properties of this servlet, and</span></span>
<span class="line"><span>  * invoke subclass initialization.</span></span>
<span class="line"><span>  * @throws ServletException if bean properties are invalid (or required</span></span>
<span class="line"><span>  * properties are missing), or if subclass initialization fails.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final void init() throws ServletException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 读取web.xml中的servlet配置</span></span>
<span class="line"><span>  PropertyValues pvs = new ServletConfigPropertyValues(getServletConfig(), this.requiredProperties);</span></span>
<span class="line"><span>  if (!pvs.isEmpty()) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      // 转换成BeanWrapper，为了方便使用Spring的属性注入功能</span></span>
<span class="line"><span>      BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(this);</span></span>
<span class="line"><span>      // 注入Resource类型需要依赖于ResourceEditor解析，所以注册Resource类关联到ResourceEditor解析器</span></span>
<span class="line"><span>      ResourceLoader resourceLoader = new ServletContextResourceLoader(getServletContext());</span></span>
<span class="line"><span>      bw.registerCustomEditor(Resource.class, new ResourceEditor(resourceLoader, getEnvironment()));</span></span>
<span class="line"><span>      // 更多的初始化可以让子类去拓展</span></span>
<span class="line"><span>      initBeanWrapper(bw);</span></span>
<span class="line"><span>      // 让spring注入namespace,contextConfigLocation等属性</span></span>
<span class="line"><span>      bw.setPropertyValues(pvs, true);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (BeansException ex) {</span></span>
<span class="line"><span>      if (logger.isErrorEnabled()) {</span></span>
<span class="line"><span>        logger.error(&quot;Failed to set bean properties on servlet &#39;&quot; + getServletName() + &quot;&#39;&quot;, ex);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      throw ex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 让子类去拓展</span></span>
<span class="line"><span>  initServletBean();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>读取配置可以从下图看出，正是初始化了我们web.xml中配置</p><p><img src="`+r+`" alt="error.图片加载失败"></p><p>再看下initServletBean()方法，位于FrameworkServlet类中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Overridden method of {@link HttpServletBean}, invoked after any bean properties</span></span>
<span class="line"><span>  * have been set. Creates this servlet&#39;s WebApplicationContext.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected final void initServletBean() throws ServletException {</span></span>
<span class="line"><span>  getServletContext().log(&quot;Initializing Spring &quot; + getClass().getSimpleName() + &quot; &#39;&quot; + getServletName() + &quot;&#39;&quot;);</span></span>
<span class="line"><span>  if (logger.isInfoEnabled()) {</span></span>
<span class="line"><span>    logger.info(&quot;Initializing Servlet &#39;&quot; + getServletName() + &quot;&#39;&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  long startTime = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    // 最重要的是这个方法</span></span>
<span class="line"><span>    this.webApplicationContext = initWebApplicationContext();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 可以让子类进一步拓展</span></span>
<span class="line"><span>    initFrameworkServlet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (ServletException | RuntimeException ex) {</span></span>
<span class="line"><span>    logger.error(&quot;Context initialization failed&quot;, ex);</span></span>
<span class="line"><span>    throw ex;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>    String value = this.enableLoggingRequestDetails ?</span></span>
<span class="line"><span>        &quot;shown which may lead to unsafe logging of potentially sensitive data&quot; :</span></span>
<span class="line"><span>        &quot;masked to prevent unsafe logging of potentially sensitive data&quot;;</span></span>
<span class="line"><span>    logger.debug(&quot;enableLoggingRequestDetails=&#39;&quot; + this.enableLoggingRequestDetails +</span></span>
<span class="line"><span>        &quot;&#39;: request parameters and headers will be &quot; + value);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (logger.isInfoEnabled()) {</span></span>
<span class="line"><span>    logger.info(&quot;Completed initialization in &quot; + (System.currentTimeMillis() - startTime) + &quot; ms&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="initwebapplicationcontext" tabindex="-1">initWebApplicationContext <a class="header-anchor" href="#initwebapplicationcontext" aria-label="Permalink to &quot;initWebApplicationContext&quot;">​</a></h3><p>initWebApplicationContext用来初始化和刷新WebApplicationContext。</p><p>initWebApplicationContext() 方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Initialize and publish the WebApplicationContext for this servlet.</span></span>
<span class="line"><span>  * &lt;p&gt;Delegates to {@link #createWebApplicationContext} for actual creation</span></span>
<span class="line"><span>  * of the context. Can be overridden in subclasses.</span></span>
<span class="line"><span>  * @return the WebApplicationContext instance</span></span>
<span class="line"><span>  * @see #FrameworkServlet(WebApplicationContext)</span></span>
<span class="line"><span>  * @see #setContextClass</span></span>
<span class="line"><span>  * @see #setContextConfigLocation</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected WebApplicationContext initWebApplicationContext() {</span></span>
<span class="line"><span>  WebApplicationContext rootContext =</span></span>
<span class="line"><span>      WebApplicationContextUtils.getWebApplicationContext(getServletContext());</span></span>
<span class="line"><span>  WebApplicationContext wac = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 如果在构造函数已经被初始化</span></span>
<span class="line"><span>  if (this.webApplicationContext != null) {</span></span>
<span class="line"><span>    // A context instance was injected at construction time -&gt; use it</span></span>
<span class="line"><span>    wac = this.webApplicationContext;</span></span>
<span class="line"><span>    if (wac instanceof ConfigurableWebApplicationContext) {</span></span>
<span class="line"><span>      ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext) wac;</span></span>
<span class="line"><span>      if (!cwac.isActive()) {</span></span>
<span class="line"><span>        // The context has not yet been refreshed -&gt; provide services such as</span></span>
<span class="line"><span>        // setting the parent context, setting the application context id, etc</span></span>
<span class="line"><span>        if (cwac.getParent() == null) {</span></span>
<span class="line"><span>          // The context instance was injected without an explicit parent -&gt; set</span></span>
<span class="line"><span>          // the root application context (if any; may be null) as the parent</span></span>
<span class="line"><span>          cwac.setParent(rootContext);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        configureAndRefreshWebApplicationContext(cwac);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 没有在构造函数中初始化，则尝试通过contextAttribute初始化</span></span>
<span class="line"><span>  if (wac == null) {</span></span>
<span class="line"><span>    // No context instance was injected at construction time -&gt; see if one</span></span>
<span class="line"><span>    // has been registered in the servlet context. If one exists, it is assumed</span></span>
<span class="line"><span>    // that the parent context (if any) has already been set and that the</span></span>
<span class="line"><span>    // user has performed any initialization such as setting the context id</span></span>
<span class="line"><span>    wac = findWebApplicationContext();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 还没有的话，只能重新创建了</span></span>
<span class="line"><span>  if (wac == null) {</span></span>
<span class="line"><span>    // No context instance is defined for this servlet -&gt; create a local one</span></span>
<span class="line"><span>    wac = createWebApplicationContext(rootContext);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (!this.refreshEventReceived) {</span></span>
<span class="line"><span>    // Either the context is not a ConfigurableApplicationContext with refresh</span></span>
<span class="line"><span>    // support or the context injected at construction time had already been</span></span>
<span class="line"><span>    // refreshed -&gt; trigger initial onRefresh manually here.</span></span>
<span class="line"><span>    synchronized (this.onRefreshMonitor) {</span></span>
<span class="line"><span>      onRefresh(wac);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (this.publishContext) {</span></span>
<span class="line"><span>    // Publish the context as a servlet context attribute.</span></span>
<span class="line"><span>    String attrName = getServletContextAttributeName();</span></span>
<span class="line"><span>    getServletContext().setAttribute(attrName, wac);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return wac;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>webApplicationContext只会初始化一次，依次尝试构造函数初始化，没有则通过contextAttribute初始化，仍没有则创建新的</p><p>创建的createWebApplicationContext方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Instantiate the WebApplicationContext for this servlet, either a default</span></span>
<span class="line"><span>  * {@link org.springframework.web.context.support.XmlWebApplicationContext}</span></span>
<span class="line"><span>  * or a {@link #setContextClass custom context class}, if set.</span></span>
<span class="line"><span>  * &lt;p&gt;This implementation expects custom contexts to implement the</span></span>
<span class="line"><span>  * {@link org.springframework.web.context.ConfigurableWebApplicationContext}</span></span>
<span class="line"><span>  * interface. Can be overridden in subclasses.</span></span>
<span class="line"><span>  * &lt;p&gt;Do not forget to register this servlet instance as application listener on the</span></span>
<span class="line"><span>  * created context (for triggering its {@link #onRefresh callback}, and to call</span></span>
<span class="line"><span>  * {@link org.springframework.context.ConfigurableApplicationContext#refresh()}</span></span>
<span class="line"><span>  * before returning the context instance.</span></span>
<span class="line"><span>  * @param parent the parent ApplicationContext to use, or {@code null} if none</span></span>
<span class="line"><span>  * @return the WebApplicationContext for this servlet</span></span>
<span class="line"><span>  * @see org.springframework.web.context.support.XmlWebApplicationContext</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected WebApplicationContext createWebApplicationContext(@Nullable ApplicationContext parent) {</span></span>
<span class="line"><span>  Class&lt;?&gt; contextClass = getContextClass();</span></span>
<span class="line"><span>  if (!ConfigurableWebApplicationContext.class.isAssignableFrom(contextClass)) {</span></span>
<span class="line"><span>    throw new ApplicationContextException(</span></span>
<span class="line"><span>        &quot;Fatal initialization error in servlet with name &#39;&quot; + getServletName() +</span></span>
<span class="line"><span>        &quot;&#39;: custom WebApplicationContext class [&quot; + contextClass.getName() +</span></span>
<span class="line"><span>        &quot;] is not of type ConfigurableWebApplicationContext&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 通过反射方式初始化</span></span>
<span class="line"><span>  ConfigurableWebApplicationContext wac =</span></span>
<span class="line"><span>      (ConfigurableWebApplicationContext) BeanUtils.instantiateClass(contextClass);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  wac.setEnvironment(getEnvironment());</span></span>
<span class="line"><span>  wac.setParent(parent);</span></span>
<span class="line"><span>  String configLocation = getContextConfigLocation(); // 就是前面Demo中的springmvc.xml</span></span>
<span class="line"><span>  if (configLocation != null) {</span></span>
<span class="line"><span>    wac.setConfigLocation(configLocation);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 初始化Spring环境</span></span>
<span class="line"><span>  configureAndRefreshWebApplicationContext(wac);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return wac;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>configureAndRefreshWebApplicationContext方法初始化设置Spring环境</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void configureAndRefreshWebApplicationContext(ConfigurableWebApplicationContext wac) {</span></span>
<span class="line"><span>  // 设置context ID</span></span>
<span class="line"><span>  if (ObjectUtils.identityToString(wac).equals(wac.getId())) {</span></span>
<span class="line"><span>    // The application context id is still set to its original default value</span></span>
<span class="line"><span>    // -&gt; assign a more useful id based on available information</span></span>
<span class="line"><span>    if (this.contextId != null) {</span></span>
<span class="line"><span>      wac.setId(this.contextId);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      // Generate default id...</span></span>
<span class="line"><span>      wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX +</span></span>
<span class="line"><span>          ObjectUtils.getDisplayString(getServletContext().getContextPath()) + &#39;/&#39; + getServletName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 设置servletContext, servletConfig, namespace, listener...</span></span>
<span class="line"><span>  wac.setServletContext(getServletContext());</span></span>
<span class="line"><span>  wac.setServletConfig(getServletConfig());</span></span>
<span class="line"><span>  wac.setNamespace(getNamespace());</span></span>
<span class="line"><span>  wac.addApplicationListener(new SourceFilteringListener(wac, new ContextRefreshListener()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // The wac environment&#39;s #initPropertySources will be called in any case when the context</span></span>
<span class="line"><span>  // is refreshed; do it eagerly here to ensure servlet property sources are in place for</span></span>
<span class="line"><span>  // use in any post-processing or initialization that occurs below prior to #refresh</span></span>
<span class="line"><span>  ConfigurableEnvironment env = wac.getEnvironment();</span></span>
<span class="line"><span>  if (env instanceof ConfigurableWebEnvironment) {</span></span>
<span class="line"><span>    ((ConfigurableWebEnvironment) env).initPropertySources(getServletContext(), getServletConfig());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 让子类去拓展</span></span>
<span class="line"><span>  postProcessWebApplicationContext(wac);</span></span>
<span class="line"><span>  applyInitializers(wac);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Spring环境初始化完了，就可以初始化DispatcherServlet处理流程中需要的组件了。</span></span>
<span class="line"><span>  wac.refresh();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="refresh" tabindex="-1">refresh <a class="header-anchor" href="#refresh" aria-label="Permalink to &quot;refresh&quot;">​</a></h3><p>有了webApplicationContext后，就开始刷新了（onRefresh()方法），这个方法是FrameworkServlet提供的模板方法，由子类DispatcherServlet来实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * This implementation calls {@link #initStrategies}.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void onRefresh(ApplicationContext context) {</span></span>
<span class="line"><span>  initStrategies(context);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>刷新主要是调用initStrategies(context)方法对DispatcherServlet中的组件进行初始化，这些组件就是在SpringMVC请求流程中包的主要组件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Initialize the strategy objects that this servlet uses.</span></span>
<span class="line"><span>  * &lt;p&gt;May be overridden in subclasses in order to initialize further strategy objects.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected void initStrategies(ApplicationContext context) {</span></span>
<span class="line"><span>  initMultipartResolver(context);</span></span>
<span class="line"><span>  initLocaleResolver(context);</span></span>
<span class="line"><span>  initThemeResolver(context);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 主要看如下三个方法</span></span>
<span class="line"><span>  initHandlerMappings(context);</span></span>
<span class="line"><span>  initHandlerAdapters(context);</span></span>
<span class="line"><span>  initHandlerExceptionResolvers(context);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  initRequestToViewNameTranslator(context);</span></span>
<span class="line"><span>  initViewResolvers(context);</span></span>
<span class="line"><span>  initFlashMapManager(context);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="inithanlderxxx" tabindex="-1">initHanlderxxx <a class="header-anchor" href="#inithanlderxxx" aria-label="Permalink to &quot;initHanlderxxx&quot;">​</a></h3><p>我们主要看initHandlerXXX相关的方法，它们之间的关系可以看SpringMVC的请求流程：</p><p><img src="`+o+'" alt="error.图片加载失败"></p><ol><li>HandlerMapping是映射处理器</li><li>HandlerAdpter是<strong>处理适配器</strong>，它用来找到你的Controller中的处理方法</li><li>HandlerExceptionResolver是当遇到处理异常时的异常解析器</li></ol><p>initHandlerMapping方法如下，无非就是获取按照优先级排序后的HanlderMappings, 将来匹配时按照优先级最高的HanderMapping进行处理。</p><p><img src="'+c+`" alt="error.图片加载失败"></p><p>initHandlerAdapters方法和initHandlerExceptionResolvers方法也是类似的，如果没有找到，那就构建默认的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Initialize the HandlerAdapters used by this class.</span></span>
<span class="line"><span>  * &lt;p&gt;If no HandlerAdapter beans are defined in the BeanFactory for this namespace,</span></span>
<span class="line"><span>  * we default to SimpleControllerHandlerAdapter.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private void initHandlerAdapters(ApplicationContext context) {</span></span>
<span class="line"><span>  this.handlerAdapters = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (this.detectAllHandlerAdapters) {</span></span>
<span class="line"><span>    // Find all HandlerAdapters in the ApplicationContext, including ancestor contexts.</span></span>
<span class="line"><span>    Map&lt;String, HandlerAdapter&gt; matchingBeans =</span></span>
<span class="line"><span>        BeanFactoryUtils.beansOfTypeIncludingAncestors(context, HandlerAdapter.class, true, false);</span></span>
<span class="line"><span>    if (!matchingBeans.isEmpty()) {</span></span>
<span class="line"><span>      this.handlerAdapters = new ArrayList&lt;&gt;(matchingBeans.values());</span></span>
<span class="line"><span>      // We keep HandlerAdapters in sorted order.</span></span>
<span class="line"><span>      AnnotationAwareOrderComparator.sort(this.handlerAdapters);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      HandlerAdapter ha = context.getBean(HANDLER_ADAPTER_BEAN_NAME, HandlerAdapter.class);</span></span>
<span class="line"><span>      this.handlerAdapters = Collections.singletonList(ha);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (NoSuchBeanDefinitionException ex) {</span></span>
<span class="line"><span>      // Ignore, we&#39;ll add a default HandlerAdapter later.</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Ensure we have at least some HandlerAdapters, by registering</span></span>
<span class="line"><span>  // default HandlerAdapters if no other adapters are found.</span></span>
<span class="line"><span>  if (this.handlerAdapters == null) {</span></span>
<span class="line"><span>    this.handlerAdapters = getDefaultStrategies(context, HandlerAdapter.class);</span></span>
<span class="line"><span>    if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>      logger.trace(&quot;No HandlerAdapters declared for servlet &#39;&quot; + getServletName() +</span></span>
<span class="line"><span>          &quot;&#39;: using default strategies from DispatcherServlet.properties&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Initialize the HandlerExceptionResolver used by this class.</span></span>
<span class="line"><span>  * &lt;p&gt;If no bean is defined with the given name in the BeanFactory for this namespace,</span></span>
<span class="line"><span>  * we default to no exception resolver.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private void initHandlerExceptionResolvers(ApplicationContext context) {</span></span>
<span class="line"><span>  this.handlerExceptionResolvers = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (this.detectAllHandlerExceptionResolvers) {</span></span>
<span class="line"><span>    // Find all HandlerExceptionResolvers in the ApplicationContext, including ancestor contexts.</span></span>
<span class="line"><span>    Map&lt;String, HandlerExceptionResolver&gt; matchingBeans = BeanFactoryUtils</span></span>
<span class="line"><span>        .beansOfTypeIncludingAncestors(context, HandlerExceptionResolver.class, true, false);</span></span>
<span class="line"><span>    if (!matchingBeans.isEmpty()) {</span></span>
<span class="line"><span>      this.handlerExceptionResolvers = new ArrayList&lt;&gt;(matchingBeans.values());</span></span>
<span class="line"><span>      // We keep HandlerExceptionResolvers in sorted order.</span></span>
<span class="line"><span>      AnnotationAwareOrderComparator.sort(this.handlerExceptionResolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      HandlerExceptionResolver her =</span></span>
<span class="line"><span>          context.getBean(HANDLER_EXCEPTION_RESOLVER_BEAN_NAME, HandlerExceptionResolver.class);</span></span>
<span class="line"><span>      this.handlerExceptionResolvers = Collections.singletonList(her);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (NoSuchBeanDefinitionException ex) {</span></span>
<span class="line"><span>      // Ignore, no HandlerExceptionResolver is fine too.</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Ensure we have at least some HandlerExceptionResolvers, by registering</span></span>
<span class="line"><span>  // default HandlerExceptionResolvers if no other resolvers are found.</span></span>
<span class="line"><span>  if (this.handlerExceptionResolvers == null) {</span></span>
<span class="line"><span>    this.handlerExceptionResolvers = getDefaultStrategies(context, HandlerExceptionResolver.class);</span></span>
<span class="line"><span>    if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>      logger.trace(&quot;No HandlerExceptionResolvers declared in servlet &#39;&quot; + getServletName() +</span></span>
<span class="line"><span>          &quot;&#39;: using default strategies from DispatcherServlet.properties&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后我们看下初始化的日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>21:30:33.163 [RMI TCP Connection(2)-127.0.0.1] INFO org.springframework.web.servlet.DispatcherServlet - Initializing Servlet &#39;springmvc-demo&#39;</span></span>
<span class="line"><span>21:30:38.242 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.context.support.XmlWebApplicationContext - Refreshing WebApplicationContext for namespace &#39;springmvc-demo-servlet&#39;</span></span>
<span class="line"><span>21:30:39.256 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.context.annotation.ClassPathBeanDefinitionScanner - Identified candidate component class: file [/Users/pdai/pdai/www/tech-pdai-spring-demos/011-spring-framework-demo-springmvc/target/011-spring-framework-demo-springmvc-1.0-SNAPSHOT/WEB-INF/classes/tech/pdai/springframework/springmvc/controller/UserController.class]</span></span>
<span class="line"><span>21:30:39.261 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.context.annotation.ClassPathBeanDefinitionScanner - Identified candidate component class: file [/Users/pdai/pdai/www/tech-pdai-spring-demos/011-spring-framework-demo-springmvc/target/011-spring-framework-demo-springmvc-1.0-SNAPSHOT/WEB-INF/classes/tech/pdai/springframework/springmvc/dao/UserDaoImpl.class]</span></span>
<span class="line"><span>21:30:39.274 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.context.annotation.ClassPathBeanDefinitionScanner - Identified candidate component class: file [/Users/pdai/pdai/www/tech-pdai-spring-demos/011-spring-framework-demo-springmvc/target/011-spring-framework-demo-springmvc-1.0-SNAPSHOT/WEB-INF/classes/tech/pdai/springframework/springmvc/service/UserServiceImpl.class]</span></span>
<span class="line"><span>21:30:39.546 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 29 bean definitions from class path resource [springmvc.xml]</span></span>
<span class="line"><span>21:30:39.711 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.context.annotation.internalConfigurationAnnotationProcessor&#39;</span></span>
<span class="line"><span>21:30:39.973 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.context.event.internalEventListenerProcessor&#39;</span></span>
<span class="line"><span>21:30:39.984 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.context.event.internalEventListenerFactory&#39;</span></span>
<span class="line"><span>21:30:39.995 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.context.annotation.internalAutowiredAnnotationProcessor&#39;</span></span>
<span class="line"><span>21:30:40.003 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.context.annotation.internalCommonAnnotationProcessor&#39;</span></span>
<span class="line"><span>21:30:40.042 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.ui.context.support.UiApplicationContextUtils - Unable to locate ThemeSource with name &#39;themeSource&#39;: using default [org.springframework.ui.context.support.ResourceBundleThemeSource@791af912]</span></span>
<span class="line"><span>21:30:40.052 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;userController&#39;</span></span>
<span class="line"><span>21:30:40.136 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;userServiceImpl&#39;</span></span>
<span class="line"><span>21:30:40.140 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;userDaoImpl&#39;</span></span>
<span class="line"><span>21:30:40.147 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler#0&#39;</span></span>
<span class="line"><span>21:30:40.153 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.handler.SimpleUrlHandlerMapping#0&#39;</span></span>
<span class="line"><span>21:30:40.350 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.handler.MappedInterceptor#0&#39;</span></span>
<span class="line"><span>21:30:40.356 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.format.support.FormattingConversionServiceFactoryBean#0&#39;</span></span>
<span class="line"><span>21:30:40.741 [RMI TCP Connection(2)-127.0.0.1] DEBUG _org.springframework.web.servlet.HandlerMapping.Mappings - &#39;org.springframework.web.servlet.handler.SimpleUrlHandlerMapping#0&#39; {/**=org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler@216c0f1f}</span></span>
<span class="line"><span>21:30:40.742 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;mvcCorsConfigurations&#39;</span></span>
<span class="line"><span>21:30:40.742 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping&#39;</span></span>
<span class="line"><span>21:30:40.792 [RMI TCP Connection(2)-127.0.0.1] DEBUG _org.springframework.web.servlet.HandlerMapping.Mappings - &#39;org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping&#39; {}</span></span>
<span class="line"><span>21:30:40.792 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.mvc.HttpRequestHandlerAdapter&#39;</span></span>
<span class="line"><span>21:30:40.793 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter&#39;</span></span>
<span class="line"><span>21:30:40.794 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;localeResolver&#39;</span></span>
<span class="line"><span>21:30:40.796 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;themeResolver&#39;</span></span>
<span class="line"><span>21:30:40.798 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;viewNameTranslator&#39;</span></span>
<span class="line"><span>21:30:40.799 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;flashMapManager&#39;</span></span>
<span class="line"><span>21:30:40.805 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;mvcContentNegotiationManager&#39;</span></span>
<span class="line"><span>21:30:40.887 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping&#39;</span></span>
<span class="line"><span>21:30:41.150 [RMI TCP Connection(2)-127.0.0.1] DEBUG _org.springframework.web.servlet.HandlerMapping.Mappings - </span></span>
<span class="line"><span>	t.p.s.s.c.UserController:</span></span>
<span class="line"><span>	{ [/user]}: list(HttpServletRequest,HttpServletResponse)</span></span>
<span class="line"><span>21:30:41.202 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping - 1 mappings in &#39;org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping&#39;</span></span>
<span class="line"><span>21:30:41.202 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter&#39;</span></span>
<span class="line"><span>21:30:41.626 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter - ControllerAdvice beans: none</span></span>
<span class="line"><span>21:30:41.738 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;mvcUriComponentsContributor&#39;</span></span>
<span class="line"><span>21:30:41.786 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter - ControllerAdvice beans: none</span></span>
<span class="line"><span>21:30:41.806 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver#0&#39;</span></span>
<span class="line"><span>21:30:41.919 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver - ControllerAdvice beans: none</span></span>
<span class="line"><span>21:30:41.920 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.mvc.annotation.ResponseStatusExceptionResolver#0&#39;</span></span>
<span class="line"><span>21:30:41.949 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver#0&#39;</span></span>
<span class="line"><span>21:30:41.967 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;jspViewResolver&#39;</span></span>
<span class="line"><span>21:30:44.214 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.DispatcherServlet - Detected AcceptHeaderLocaleResolver</span></span>
<span class="line"><span>21:30:44.214 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.DispatcherServlet - Detected FixedThemeResolver</span></span>
<span class="line"><span>21:31:02.141 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.DispatcherServlet - Detected org.springframework.web.servlet.view.DefaultRequestToViewNameTranslator@d57bc91</span></span>
<span class="line"><span>21:31:03.483 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.DispatcherServlet - Detected org.springframework.web.servlet.support.SessionFlashMapManager@2b4e795e</span></span>
<span class="line"><span>21:44:08.180 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.jndi.JndiTemplate - Looking up JNDI object with name [java:comp/env/spring.liveBeansView.mbeanDomain]</span></span>
<span class="line"><span>21:44:08.185 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.jndi.JndiLocatorDelegate - Converted JNDI name [java:comp/env/spring.liveBeansView.mbeanDomain] not found - trying original name [spring.liveBeansView.mbeanDomain]. javax.naming.NameNotFoundException: 名称[spring.liveBeansView.mbeanDomain]未在此上下文中绑定。找不到[spring.liveBeansView.mbeanDomain]。</span></span>
<span class="line"><span>21:44:08.185 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.jndi.JndiTemplate - Looking up JNDI object with name [spring.liveBeansView.mbeanDomain]</span></span>
<span class="line"><span>21:44:08.185 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.jndi.JndiPropertySource - JNDI lookup for name [spring.liveBeansView.mbeanDomain] threw NamingException with message: 名称[spring.liveBeansView.mbeanDomain]未在此上下文中绑定。找不到[spring.liveBeansView.mbeanDomain]。. Returning null.</span></span>
<span class="line"><span>21:44:08.195 [RMI TCP Connection(2)-127.0.0.1] DEBUG org.springframework.web.servlet.DispatcherServlet - enableLoggingRequestDetails=&#39;false&#39;: request parameters and headers will be masked to prevent unsafe logging of potentially sensitive data</span></span>
<span class="line"><span>21:44:08.195 [RMI TCP Connection(2)-127.0.0.1] INFO org.springframework.web.servlet.DispatcherServlet - Completed initialization in 815032 ms</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,47)]))}const w=a(g,[["render",d]]);export{x as __pageData,w as default};
