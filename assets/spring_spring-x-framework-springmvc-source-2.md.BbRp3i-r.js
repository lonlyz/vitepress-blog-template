import{_ as n}from"./chunks/spring-springframework-mvc-5.BsR4fwMq.js";import{_ as a}from"./chunks/spring-springframework-mvc-30.Dg28lYS9.js";import{_ as e,c as p,ai as l,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-27.png",r="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-29.png",c="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-31.png",f=JSON.parse('{"title":"Spring进阶 - SpringMVC实现原理之DispatcherServlet处理请求的过程","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-springmvc-source-2.md","filePath":"spring/spring-x-framework-springmvc-source-2.md","lastUpdated":1737706346000}'),o={name:"spring/spring-x-framework-springmvc-source-2.md"};function d(u,s,h,g,v,m){return t(),p("div",null,s[0]||(s[0]=[l('<h1 id="spring进阶-springmvc实现原理之dispatcherservlet处理请求的过程" tabindex="-1">Spring进阶 - SpringMVC实现原理之DispatcherServlet处理请求的过程 <a class="header-anchor" href="#spring进阶-springmvc实现原理之dispatcherservlet处理请求的过程" aria-label="Permalink to &quot;Spring进阶 - SpringMVC实现原理之DispatcherServlet处理请求的过程&quot;">​</a></h1><blockquote><p>前文我们有了IOC的源码基础以及SpringMVC的基础，我们便可以进一步深入理解SpringMVC主要实现原理，包含DispatcherServlet的初始化过程和DispatcherServlet处理请求的过程的源码解析。本文是第二篇：DispatcherServlet处理请求的过程的源码解析。@pdai</p></blockquote><h2 id="dispatcherservlet处理请求的过程" tabindex="-1">DispatcherServlet处理请求的过程？ <a class="header-anchor" href="#dispatcherservlet处理请求的过程" aria-label="Permalink to &quot;DispatcherServlet处理请求的过程？&quot;">​</a></h2><blockquote><p>一个请求发出，经过DispatcherServlet进行了什么样的处理，最后将内容返回的呢？</p></blockquote><h3 id="回顾整理处理流程" tabindex="-1">回顾整理处理流程 <a class="header-anchor" href="#回顾整理处理流程" aria-label="Permalink to &quot;回顾整理处理流程&quot;">​</a></h3><p>首先让我们整体看一下Spring Web MVC 处理请求的流程：</p><p><img src="'+n+`" alt="error.图片加载失败"></p><p><strong>核心架构的具体流程步骤</strong>如下：</p><ol><li><strong>首先用户发送请求——&gt;DispatcherServlet</strong>，前端控制器收到请求后自己不进行处理，而是委托给其他的解析器进行 处理，作为统一访问点，进行全局的流程控制；</li><li><strong>DispatcherServlet——&gt;HandlerMapping</strong>， HandlerMapping 将会把请求映射为 HandlerExecutionChain 对象（包含一 个Handler 处理器（页面控制器）对象、多个HandlerInterceptor 拦截器）对象，通过这种策略模式，很容易添加新 的映射策略；</li><li><strong>DispatcherServlet——&gt;HandlerAdapter</strong>，HandlerAdapter 将会把处理器包装为适配器，从而支持多种类型的处理器， 即适配器设计模式的应用，从而很容易支持很多类型的处理器；</li><li><strong>HandlerAdapter——&gt;处理器功能处理方法的调用</strong>，HandlerAdapter 将会根据适配的结果调用真正的处理器的功能处 理方法，完成功能处理；并返回一个ModelAndView 对象（包含模型数据、逻辑视图名）；</li><li><strong>ModelAndView 的逻辑视图名——&gt; ViewResolver</strong>，ViewResolver 将把逻辑视图名解析为具体的View，通过这种策 略模式，很容易更换其他视图技术；</li><li><strong>View——&gt;渲染</strong>，View 会根据传进来的Model 模型数据进行渲染，此处的Model 实际是一个Map 数据结构，因此 很容易支持其他视图技术；</li><li><strong>返回控制权给DispatcherServlet</strong>，由DispatcherServlet 返回响应给用户，到此一个流程结束。</li></ol><h3 id="doget入口" tabindex="-1">doGet入口 <a class="header-anchor" href="#doget入口" aria-label="Permalink to &quot;doGet入口&quot;">​</a></h3><blockquote><p>我们以上个demo中这个GET请求为例，请求URL是<a href="http://localhost:8080/011%5C_spring%5C_framework%5C_demo%5C_springmvc%5C_war%5C_exploded/user" target="_blank" rel="noreferrer">http://localhost:8080/011\\_spring\\_framework\\_demo\\_springmvc\\_war\\_exploded/user</a></p></blockquote><p>我们知道servlet处理get请求是doGet方法，所以我们去找DispatcherServlet类结构中的doGet方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected final void doGet(HttpServletRequest request, HttpServletResponse response)</span></span>
<span class="line"><span>    throws ServletException, IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  processRequest(request, response);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>processRequest处理请求的方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Process this request, publishing an event regardless of the outcome.</span></span>
<span class="line"><span>  * &lt;p&gt;The actual event handling is performed by the abstract</span></span>
<span class="line"><span>  * {@link #doService} template method.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected final void processRequest(HttpServletRequest request, HttpServletResponse response)</span></span>
<span class="line"><span>    throws ServletException, IOException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 计算处理请求的时间</span></span>
<span class="line"><span>  long startTime = System.currentTimeMillis();</span></span>
<span class="line"><span>  Throwable failureCause = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext();</span></span>
<span class="line"><span>  LocaleContext localeContext = buildLocaleContext(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes();</span></span>
<span class="line"><span>  ServletRequestAttributes requestAttributes = buildRequestAttributes(request, response, previousAttributes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);</span></span>
<span class="line"><span>  asyncManager.registerCallableInterceptor(FrameworkServlet.class.getName(), new RequestBindingInterceptor());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 初始化context</span></span>
<span class="line"><span>  initContextHolders(request, localeContext, requestAttributes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    // 看这里</span></span>
<span class="line"><span>    doService(request, response);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (ServletException | IOException ex) {</span></span>
<span class="line"><span>    failureCause = ex;</span></span>
<span class="line"><span>    throw ex;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (Throwable ex) {</span></span>
<span class="line"><span>    failureCause = ex;</span></span>
<span class="line"><span>    throw new NestedServletException(&quot;Request processing failed&quot;, ex);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  finally {</span></span>
<span class="line"><span>    // 重置context</span></span>
<span class="line"><span>    resetContextHolders(request, previousLocaleContext, previousAttributes);</span></span>
<span class="line"><span>    if (requestAttributes != null) {</span></span>
<span class="line"><span>      requestAttributes.requestCompleted();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    logResult(request, response, failureCause, asyncManager);</span></span>
<span class="line"><span>    publishRequestHandledEvent(request, response, startTime, failureCause);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本质上就是调用doService方法，由DispatchServlet类实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Exposes the DispatcherServlet-specific request attributes and delegates to {@link #doDispatch}</span></span>
<span class="line"><span>  * for the actual dispatching.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>  logRequest(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 保存下请求之前的参数.</span></span>
<span class="line"><span>  Map&lt;String, Object&gt; attributesSnapshot = null;</span></span>
<span class="line"><span>  if (WebUtils.isIncludeRequest(request)) {</span></span>
<span class="line"><span>    attributesSnapshot = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    Enumeration&lt;?&gt; attrNames = request.getAttributeNames();</span></span>
<span class="line"><span>    while (attrNames.hasMoreElements()) {</span></span>
<span class="line"><span>      String attrName = (String) attrNames.nextElement();</span></span>
<span class="line"><span>      if (this.cleanupAfterInclude || attrName.startsWith(DEFAULT_STRATEGIES_PREFIX)) {</span></span>
<span class="line"><span>        attributesSnapshot.put(attrName, request.getAttribute(attrName));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 方便后续 handlers 和 view 要使用它们.</span></span>
<span class="line"><span>  request.setAttribute(WEB_APPLICATION_CONTEXT_ATTRIBUTE, getWebApplicationContext());</span></span>
<span class="line"><span>  request.setAttribute(LOCALE_RESOLVER_ATTRIBUTE, this.localeResolver);</span></span>
<span class="line"><span>  request.setAttribute(THEME_RESOLVER_ATTRIBUTE, this.themeResolver);</span></span>
<span class="line"><span>  request.setAttribute(THEME_SOURCE_ATTRIBUTE, getThemeSource());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (this.flashMapManager != null) {</span></span>
<span class="line"><span>    FlashMap inputFlashMap = this.flashMapManager.retrieveAndUpdate(request, response);</span></span>
<span class="line"><span>    if (inputFlashMap != null) {</span></span>
<span class="line"><span>      request.setAttribute(INPUT_FLASH_MAP_ATTRIBUTE, Collections.unmodifiableMap(inputFlashMap));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    request.setAttribute(OUTPUT_FLASH_MAP_ATTRIBUTE, new FlashMap());</span></span>
<span class="line"><span>    request.setAttribute(FLASH_MAP_MANAGER_ATTRIBUTE, this.flashMapManager);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  RequestPath previousRequestPath = null;</span></span>
<span class="line"><span>  if (this.parseRequestPath) {</span></span>
<span class="line"><span>    previousRequestPath = (RequestPath) request.getAttribute(ServletRequestPathUtils.PATH_ATTRIBUTE);</span></span>
<span class="line"><span>    ServletRequestPathUtils.parseAndCache(request);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    // 看这里，终于将这个请求分发出去了</span></span>
<span class="line"><span>    doDispatch(request, response);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  finally {</span></span>
<span class="line"><span>    if (!WebAsyncUtils.getAsyncManager(request).isConcurrentHandlingStarted()) {</span></span>
<span class="line"><span>      // Restore the original attribute snapshot, in case of an include.</span></span>
<span class="line"><span>      if (attributesSnapshot != null) {</span></span>
<span class="line"><span>        restoreAttributesAfterInclude(request, attributesSnapshot);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (this.parseRequestPath) {</span></span>
<span class="line"><span>      ServletRequestPathUtils.setParsedRequestPath(previousRequestPath, request);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="请求分发" tabindex="-1">请求分发 <a class="header-anchor" href="#请求分发" aria-label="Permalink to &quot;请求分发&quot;">​</a></h3><p>doDispatch方法是真正处理请求的核心方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>  HttpServletRequest processedRequest = request;</span></span>
<span class="line"><span>  HandlerExecutionChain mappedHandler = null;</span></span>
<span class="line"><span>  boolean multipartRequestParsed = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    ModelAndView mv = null;</span></span>
<span class="line"><span>    Exception dispatchException = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      // 判断是不是文件上传类型的request</span></span>
<span class="line"><span>      processedRequest = checkMultipart(request);</span></span>
<span class="line"><span>      multipartRequestParsed = (processedRequest != request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 根据request获取匹配的handler.</span></span>
<span class="line"><span>      mappedHandler = getHandler(processedRequest);</span></span>
<span class="line"><span>      if (mappedHandler == null) {</span></span>
<span class="line"><span>        noHandlerFound(processedRequest, response);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 根据handler获取匹配的handlerAdapter</span></span>
<span class="line"><span>      HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 如果handler支持last-modified头处理</span></span>
<span class="line"><span>      String method = request.getMethod();</span></span>
<span class="line"><span>      boolean isGet = HttpMethod.GET.matches(method);</span></span>
<span class="line"><span>      if (isGet || HttpMethod.HEAD.matches(method)) {</span></span>
<span class="line"><span>        long lastModified = ha.getLastModified(request, mappedHandler.getHandler());</span></span>
<span class="line"><span>        if (new ServletWebRequest(request, response).checkNotModified(lastModified) &amp;&amp; isGet) {</span></span>
<span class="line"><span>          return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if (!mappedHandler.applyPreHandle(processedRequest, response)) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 真正handle处理，并返回modelAndView</span></span>
<span class="line"><span>      mv = ha.handle(processedRequest, response, mappedHandler.getHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if (asyncManager.isConcurrentHandlingStarted()) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 通过视图的prefix和postfix获取完整的视图名</span></span>
<span class="line"><span>      applyDefaultViewName(processedRequest, mv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 应用后置的拦截器</span></span>
<span class="line"><span>      mappedHandler.applyPostHandle(processedRequest, response, mv);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (Exception ex) {</span></span>
<span class="line"><span>      dispatchException = ex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (Throwable err) {</span></span>
<span class="line"><span>      // As of 4.3, we&#39;re processing Errors thrown from handler methods as well,</span></span>
<span class="line"><span>      // making them available for @ExceptionHandler methods and other scenarios.</span></span>
<span class="line"><span>      dispatchException = new NestedServletException(&quot;Handler dispatch failed&quot;, err);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 处理handler处理的结果，显然就是对ModelAndView 或者 出现的Excpetion处理</span></span>
<span class="line"><span>    processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (Exception ex) {</span></span>
<span class="line"><span>    triggerAfterCompletion(processedRequest, response, mappedHandler, ex);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (Throwable err) {</span></span>
<span class="line"><span>    triggerAfterCompletion(processedRequest, response, mappedHandler,</span></span>
<span class="line"><span>        new NestedServletException(&quot;Handler processing failed&quot;, err));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  finally {</span></span>
<span class="line"><span>    if (asyncManager.isConcurrentHandlingStarted()) {</span></span>
<span class="line"><span>      // Instead of postHandle and afterCompletion</span></span>
<span class="line"><span>      if (mappedHandler != null) {</span></span>
<span class="line"><span>        mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      // Clean up any resources used by a multipart request.</span></span>
<span class="line"><span>      if (multipartRequestParsed) {</span></span>
<span class="line"><span>        cleanupMultipart(processedRequest);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="映射和适配器处理" tabindex="-1">映射和适配器处理 <a class="header-anchor" href="#映射和适配器处理" aria-label="Permalink to &quot;映射和适配器处理&quot;">​</a></h3><p>对于真正的handle方法，我们看下其处理流程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * This implementation expects the handler to be an {@link HandlerMethod}.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>public final ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)</span></span>
<span class="line"><span>    throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return handleInternal(request, response, (HandlerMethod) handler);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>交给handleInternal方法处理，以RequestMappingHandlerAdapter这个HandlerAdapter中的处理方法为例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected ModelAndView handleInternal(HttpServletRequest request,</span></span>
<span class="line"><span>    HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ModelAndView mav;</span></span>
<span class="line"><span>  checkRequest(request);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Execute invokeHandlerMethod in synchronized block if required.</span></span>
<span class="line"><span>  if (this.synchronizeOnSession) {</span></span>
<span class="line"><span>    HttpSession session = request.getSession(false);</span></span>
<span class="line"><span>    if (session != null) {</span></span>
<span class="line"><span>      Object mutex = WebUtils.getSessionMutex(session);</span></span>
<span class="line"><span>      synchronized (mutex) {</span></span>
<span class="line"><span>        mav = invokeHandlerMethod(request, response, handlerMethod);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      // No HttpSession available -&gt; no mutex necessary</span></span>
<span class="line"><span>      mav = invokeHandlerMethod(request, response, handlerMethod);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    // No synchronization on session demanded at all...</span></span>
<span class="line"><span>    mav = invokeHandlerMethod(request, response, handlerMethod);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (!response.containsHeader(HEADER_CACHE_CONTROL)) {</span></span>
<span class="line"><span>    if (getSessionAttributesHandler(handlerMethod).hasSessionAttributes()) {</span></span>
<span class="line"><span>      applyCacheSeconds(response, this.cacheSecondsForSessionAttributeHandlers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      prepareResponse(response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return mav;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+i+`" alt="error.图片加载失败"></p><p>然后执行invokeHandlerMethod这个方法，用来对RequestMapping（usercontroller中的list方法）进行处理</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Invoke the {@link RequestMapping} handler method preparing a {@link ModelAndView}</span></span>
<span class="line"><span>  * if view resolution is required.</span></span>
<span class="line"><span>  * @since 4.2</span></span>
<span class="line"><span>  * @see #createInvocableHandlerMethod(HandlerMethod)</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>protected ModelAndView invokeHandlerMethod(HttpServletRequest request,</span></span>
<span class="line"><span>    HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ServletWebRequest webRequest = new ServletWebRequest(request, response);</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    WebDataBinderFactory binderFactory = getDataBinderFactory(handlerMethod);</span></span>
<span class="line"><span>    ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重要：设置handler(controller#list)方法上的参数，返回值处理，绑定databinder等</span></span>
<span class="line"><span>    ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);</span></span>
<span class="line"><span>    if (this.argumentResolvers != null) {</span></span>
<span class="line"><span>      invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (this.returnValueHandlers != null) {</span></span>
<span class="line"><span>      invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    invocableMethod.setDataBinderFactory(binderFactory);</span></span>
<span class="line"><span>    invocableMethod.setParameterNameDiscoverer(this.parameterNameDiscoverer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ModelAndViewContainer mavContainer = new ModelAndViewContainer();</span></span>
<span class="line"><span>    mavContainer.addAllAttributes(RequestContextUtils.getInputFlashMap(request));</span></span>
<span class="line"><span>    modelFactory.initModel(webRequest, mavContainer, invocableMethod);</span></span>
<span class="line"><span>    mavContainer.setIgnoreDefaultModelOnRedirect(this.ignoreDefaultModelOnRedirect);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AsyncWebRequest asyncWebRequest = WebAsyncUtils.createAsyncWebRequest(request, response);</span></span>
<span class="line"><span>    asyncWebRequest.setTimeout(this.asyncRequestTimeout);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);</span></span>
<span class="line"><span>    asyncManager.setTaskExecutor(this.taskExecutor);</span></span>
<span class="line"><span>    asyncManager.setAsyncWebRequest(asyncWebRequest);</span></span>
<span class="line"><span>    asyncManager.registerCallableInterceptors(this.callableInterceptors);</span></span>
<span class="line"><span>    asyncManager.registerDeferredResultInterceptors(this.deferredResultInterceptors);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (asyncManager.hasConcurrentResult()) {</span></span>
<span class="line"><span>      Object result = asyncManager.getConcurrentResult();</span></span>
<span class="line"><span>      mavContainer = (ModelAndViewContainer) asyncManager.getConcurrentResultContext()[0];</span></span>
<span class="line"><span>      asyncManager.clearConcurrentResult();</span></span>
<span class="line"><span>      LogFormatUtils.traceDebug(logger, traceOn -&gt; {</span></span>
<span class="line"><span>        String formatted = LogFormatUtils.formatValue(result, !traceOn);</span></span>
<span class="line"><span>        return &quot;Resume with async result [&quot; + formatted + &quot;]&quot;;</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>      invocableMethod = invocableMethod.wrapConcurrentResult(result);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 执行controller中方法</span></span>
<span class="line"><span>    invocableMethod.invokeAndHandle(webRequest, mavContainer);</span></span>
<span class="line"><span>    if (asyncManager.isConcurrentHandlingStarted()) {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return getModelAndView(mavContainer, modelFactory, webRequest);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  finally {</span></span>
<span class="line"><span>    webRequest.requestCompleted();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>invokeAndHandle交给UserController中具体执行list方法执行</p><p><img src="`+r+'" alt="error.图片加载失败"></p><p>后续invoke执行的方法，直接看整个请求流程的调用链即可</p><p><img src="'+a+'" alt="error.图片加载失败"></p><p>执行后获得视图和Model</p><p><img src="'+c+`" alt="error.图片加载失败"></p><h3 id="视图渲染" tabindex="-1">视图渲染 <a class="header-anchor" href="#视图渲染" aria-label="Permalink to &quot;视图渲染&quot;">​</a></h3><p>接下来继续执行processDispatchResult方法，对视图和model（如果有异常则对异常处理）进行处理（显然就是渲染页面了）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Handle the result of handler selection and handler invocation, which is</span></span>
<span class="line"><span>  * either a ModelAndView or an Exception to be resolved to a ModelAndView.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>    @Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv,</span></span>
<span class="line"><span>    @Nullable Exception exception) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  boolean errorView = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 如果处理过程有异常，则异常处理</span></span>
<span class="line"><span>  if (exception != null) {</span></span>
<span class="line"><span>    if (exception instanceof ModelAndViewDefiningException) {</span></span>
<span class="line"><span>      logger.debug(&quot;ModelAndViewDefiningException encountered&quot;, exception);</span></span>
<span class="line"><span>      mv = ((ModelAndViewDefiningException) exception).getModelAndView();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      Object handler = (mappedHandler != null ? mappedHandler.getHandler() : null);</span></span>
<span class="line"><span>      mv = processHandlerException(request, response, handler, exception);</span></span>
<span class="line"><span>      errorView = (mv != null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 是否需要渲染视图</span></span>
<span class="line"><span>  if (mv != null &amp;&amp; !mv.wasCleared()) {</span></span>
<span class="line"><span>    render(mv, request, response); // 渲染视图</span></span>
<span class="line"><span>    if (errorView) {</span></span>
<span class="line"><span>      WebUtils.clearErrorRequestAttributes(request);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>      logger.trace(&quot;No view rendering, null ModelAndView returned.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (WebAsyncUtils.getAsyncManager(request).isConcurrentHandlingStarted()) {</span></span>
<span class="line"><span>    // Concurrent handling started during a forward</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (mappedHandler != null) {</span></span>
<span class="line"><span>    // Exception (if any) is already handled..</span></span>
<span class="line"><span>    mappedHandler.triggerAfterCompletion(request, response, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来显然就是渲染视图了, spring在initStrategies方法中初始化的组件（LocaleResovler等）就派上用场了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Render the given ModelAndView.</span></span>
<span class="line"><span>  * &lt;p&gt;This is the last stage in handling a request. It may involve resolving the view by name.</span></span>
<span class="line"><span>  * @param mv the ModelAndView to render</span></span>
<span class="line"><span>  * @param request current HTTP servlet request</span></span>
<span class="line"><span>  * @param response current HTTP servlet response</span></span>
<span class="line"><span>  * @throws ServletException if view is missing or cannot be resolved</span></span>
<span class="line"><span>  * @throws Exception if there&#39;s a problem rendering the view</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>  // Determine locale for request and apply it to the response.</span></span>
<span class="line"><span>  Locale locale =</span></span>
<span class="line"><span>      (this.localeResolver != null ? this.localeResolver.resolveLocale(request) : request.getLocale());</span></span>
<span class="line"><span>  response.setLocale(locale);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  View view;</span></span>
<span class="line"><span>  String viewName = mv.getViewName();</span></span>
<span class="line"><span>  if (viewName != null) {</span></span>
<span class="line"><span>    // We need to resolve the view name.</span></span>
<span class="line"><span>    view = resolveViewName(viewName, mv.getModelInternal(), locale, request);</span></span>
<span class="line"><span>    if (view == null) {</span></span>
<span class="line"><span>      throw new ServletException(&quot;Could not resolve view with name &#39;&quot; + mv.getViewName() +</span></span>
<span class="line"><span>          &quot;&#39; in servlet with name &#39;&quot; + getServletName() + &quot;&#39;&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    // No need to lookup: the ModelAndView object contains the actual View object.</span></span>
<span class="line"><span>    view = mv.getView();</span></span>
<span class="line"><span>    if (view == null) {</span></span>
<span class="line"><span>      throw new ServletException(&quot;ModelAndView [&quot; + mv + &quot;] neither contains a view name nor a &quot; +</span></span>
<span class="line"><span>          &quot;View object in servlet with name &#39;&quot; + getServletName() + &quot;&#39;&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Delegate to the View object for rendering.</span></span>
<span class="line"><span>  if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>    logger.trace(&quot;Rendering view [&quot; + view + &quot;] &quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    if (mv.getStatus() != null) {</span></span>
<span class="line"><span>      response.setStatus(mv.getStatus().value());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    view.render(mv.getModelInternal(), request, response);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (Exception ex) {</span></span>
<span class="line"><span>    if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>      logger.debug(&quot;Error rendering view [&quot; + view + &quot;]&quot;, ex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    throw ex;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>后续就是通过viewResolver进行解析了，这里就不再继续看代码了，上述流程基本上够帮助你构建相关的认知了。</p><p>最后无非是返回控制权给DispatcherServlet，由DispatcherServlet 返回响应给用户。</p><p>最后的最后我们看下请求的日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>21:45:53.390 [http-nio-8080-exec-6] DEBUG org.springframework.web.servlet.DispatcherServlet - GET &quot;/011_spring_framework_demo_springmvc_war_exploded/user&quot;, parameters={}</span></span>
<span class="line"><span>21:45:53.400 [http-nio-8080-exec-6] DEBUG org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping - Mapped to tech.pdai.springframework.springmvc.controller.UserController#list(HttpServletRequest, HttpServletResponse)</span></span>
<span class="line"><span>22:51:14.504 [http-nio-8080-exec-6] DEBUG org.springframework.web.servlet.view.JstlView - View name &#39;userList&#39;, model {dateTime=Fri Apr 22 21:45:53 CST 2022, userList=[tech.pdai.springframework.springmvc.entity.User@7b8c8dc]}</span></span>
<span class="line"><span>22:51:14.550 [http-nio-8080-exec-6] DEBUG org.springframework.web.servlet.view.JstlView - Forwarding to [/WEB-INF/views/userList.jsp]</span></span>
<span class="line"><span>22:51:44.395 [http-nio-8080-exec-6] DEBUG org.springframework.web.servlet.DispatcherServlet - Completed 200 OK</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,44)]))}const M=e(o,[["render",d]]);export{f as __pageData,M as default};
