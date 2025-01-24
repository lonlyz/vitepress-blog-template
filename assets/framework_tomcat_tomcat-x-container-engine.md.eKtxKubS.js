import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/tomcat/tomcat-x-container-engine-1.jpg",h=JSON.parse('{"title":"Tomcat - Container容器之Engine：StandardEngine","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-container-engine.md","filePath":"framework/tomcat/tomcat-x-container-engine.md","lastUpdated":1737706346000}'),t={name:"framework/tomcat/tomcat-x-container-engine.md"};function i(c,n,o,r,d,u){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="tomcat-container容器之engine-standardengine" tabindex="-1">Tomcat - Container容器之Engine：StandardEngine <a class="header-anchor" href="#tomcat-container容器之engine-standardengine" aria-label="Permalink to &quot;Tomcat - Container容器之Engine：StandardEngine&quot;">​</a></h1><blockquote><p>上文已经知道Container的整体结构和设计，其中Engine其实就是Servlet Engine，负责处理request的顶层容器。@pdai</p></blockquote><h2 id="理解思路" tabindex="-1">理解思路 <a class="header-anchor" href="#理解思路" aria-label="Permalink to &quot;理解思路&quot;">​</a></h2><ul><li><strong>第一：抓住StandardEngine整体类依赖结构来理解</strong></li></ul><p><img src="'+l+`" alt="error.图片加载失败"></p><ul><li><strong>第二：结合server.xml中Engine配置来理解</strong></li></ul><p>见下文具体阐述。</p><ul><li><strong>第三：结合Engine Config官方配置文档</strong></li></ul><p><a href="http://tomcat.apache.org/tomcat-9.0-doc/config/engine.html" target="_blank" rel="noreferrer">http://tomcat.apache.org/tomcat-9.0-doc/config/engine.html</a></p><h2 id="engine接口设计" tabindex="-1">Engine接口设计 <a class="header-anchor" href="#engine接口设计" aria-label="Permalink to &quot;Engine接口设计&quot;">​</a></h2><blockquote><p>这看Engine.java接口前，先要看下相关属性</p></blockquote><ul><li>支持设置的属性列表</li></ul><table tabindex="0"><thead><tr><th>属性</th><th>描述</th></tr></thead><tbody><tr><td>backgroundProcessorDelay</td><td>此值表示在此引擎及其子容器（包括所有Host和Context）上调用backgroundProcess方法之间的延迟（以秒为单位）。如果子容器的延迟值不为负（则表示它们正在使用自己的处理线程），则不会调用它们。将此值设置为正值将导致产生线程。等待指定的时间后，线程将在此引擎及其所有子容器上调用backgroundProcess方法。如果未指定，则此属性的默认值为10，表示10秒的延迟。</td></tr><tr><td>className</td><td>使用的Java类名称。此类必须实现org.apache.catalina.Engine接口。如果未指定，将使用标准值（定义如下）。</td></tr><tr><td><strong>defaultHost</strong></td><td>默认的主机名，它标识Host将处理针对主机名此服务器上的请求，但在此配置文件中没有配置。此名称必须与嵌套在name 其中的Host元素之一的属性匹配。</td></tr><tr><td><strong>jvmRoute</strong></td><td>必须在负载平衡方案中使用的标识符才能启用会话亲缘关系。标识符（在参与集群的所有Tomcat服务器之间必须是唯一的）将附加到生成的会话标识符上，因此允许前端代理始终将特定会话转发到同一Tomcat实例。注意，jvmRoute也可以使用jvmRoutesystem属性设置 。属性中的<code>jvmRoute set&lt;Engine&gt;</code>将覆盖任何jvmRoute系统属性。</td></tr><tr><td>name</td><td>此引擎的逻辑名称，用于日志和错误消息。在同一台Server中使用多个Service元素时 ，必须为每个引擎分配一个唯一的名称。</td></tr><tr><td>startStopThreads</td><td>该引擎将用来并行启动子Host元素的线程数。特殊值0将导致使用该值 Runtime.getRuntime().availableProcessors()。Runtime.getRuntime().availableProcessors() + value除非小于1，否则将使用负值， 在这种情况下将使用1个线程。如果未指定，将使用默认值1。如果使用了1个线程，那么ExecutorService将使用当前线程，而不是使用。</td></tr></tbody></table><ul><li>Engine的接口设计</li></ul><p>这里你会发现，如下接口中包含上述defaultHost和jvmRoute属性设置；同时还有Service，因为Engine的上层是service。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * An &lt;b&gt;Engine&lt;/b&gt; is a Container that represents the entire Catalina servlet</span></span>
<span class="line"><span> * engine.  It is useful in the following types of scenarios:</span></span>
<span class="line"><span> * &lt;ul&gt;</span></span>
<span class="line"><span> * &lt;li&gt;You wish to use Interceptors that see every single request processed</span></span>
<span class="line"><span> *     by the entire engine.</span></span>
<span class="line"><span> * &lt;li&gt;You wish to run Catalina in with a standalone HTTP connector, but still</span></span>
<span class="line"><span> *     want support for multiple virtual hosts.</span></span>
<span class="line"><span> * &lt;/ul&gt;</span></span>
<span class="line"><span> * In general, you would not use an Engine when deploying Catalina connected</span></span>
<span class="line"><span> * to a web server (such as Apache), because the Connector will have</span></span>
<span class="line"><span> * utilized the web server&#39;s facilities to determine which Context (or</span></span>
<span class="line"><span> * perhaps even which Wrapper) should be utilized to process this request.</span></span>
<span class="line"><span> * &lt;p&gt;</span></span>
<span class="line"><span> * The child containers attached to an Engine are generally implementations</span></span>
<span class="line"><span> * of Host (representing a virtual host) or Context (representing individual</span></span>
<span class="line"><span> * an individual servlet context), depending upon the Engine implementation.</span></span>
<span class="line"><span> * &lt;p&gt;</span></span>
<span class="line"><span> * If used, an Engine is always the top level Container in a Catalina</span></span>
<span class="line"><span> * hierarchy. Therefore, the implementation&#39;s &lt;code&gt;setParent()&lt;/code&gt; method</span></span>
<span class="line"><span> * should throw &lt;code&gt;IllegalArgumentException&lt;/code&gt;.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author Craig R. McClanahan</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface Engine extends Container {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return the default host name for this Engine.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public String getDefaultHost();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Set the default hostname for this Engine.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param defaultHost The new default host</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void setDefaultHost(String defaultHost);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return the JvmRouteId for this engine.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public String getJvmRoute();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Set the JvmRouteId for this engine.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param jvmRouteId the (new) JVM Route ID. Each Engine within a cluster</span></span>
<span class="line"><span>     *        must have a unique JVM Route ID.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void setJvmRoute(String jvmRouteId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return the &lt;code&gt;Service&lt;/code&gt; with which we are associated (if any).</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public Service getService();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Set the &lt;code&gt;Service&lt;/code&gt; with which we are associated (if any).</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param service The service that owns this Engine</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void setService(Service service);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>其它属性支持都包含在我们上文分析的ContainerBase中</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * The processor delay for this component.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected int backgroundProcessorDelay = -1;</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * The number of threads available to process start and stop events for any</span></span>
<span class="line"><span>  * children associated with this container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private int startStopThreads = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span></code></pre></div><h2 id="engine接口实现-standardengine" tabindex="-1">Engine接口实现：StandardEngine <a class="header-anchor" href="#engine接口实现-standardengine" aria-label="Permalink to &quot;Engine接口实现：StandardEngine&quot;">​</a></h2><h3 id="接口中简单方法实现" tabindex="-1">接口中简单方法实现 <a class="header-anchor" href="#接口中简单方法实现" aria-label="Permalink to &quot;接口中简单方法实现&quot;">​</a></h3><p>上述接口里面的defaultHost, JvmRoute, service 很简单</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the default host.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public String getDefaultHost() {</span></span>
<span class="line"><span>    return defaultHost;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the default host.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param host The new default host</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setDefaultHost(String host) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String oldDefaultHost = this.defaultHost;</span></span>
<span class="line"><span>    if (host == null) {</span></span>
<span class="line"><span>        this.defaultHost = null;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        this.defaultHost = host.toLowerCase(Locale.ENGLISH);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (getState().isAvailable()) {</span></span>
<span class="line"><span>        service.getMapper().setDefaultHostName(host);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    support.firePropertyChange(&quot;defaultHost&quot;, oldDefaultHost,</span></span>
<span class="line"><span>                                this.defaultHost);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the cluster-wide unique identifier for this Engine.</span></span>
<span class="line"><span>  * This value is only useful in a load-balancing scenario.</span></span>
<span class="line"><span>  * &lt;p&gt;</span></span>
<span class="line"><span>  * This property should not be changed once it is set.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setJvmRoute(String routeId) {</span></span>
<span class="line"><span>    jvmRouteId = routeId;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Retrieve the cluster-wide unique identifier for this Engine.</span></span>
<span class="line"><span>  * This value is only useful in a load-balancing scenario.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public String getJvmRoute() {</span></span>
<span class="line"><span>    return jvmRouteId;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the &lt;code&gt;Service&lt;/code&gt; with which we are associated (if any).</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Service getService() {</span></span>
<span class="line"><span>    return this.service;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the &lt;code&gt;Service&lt;/code&gt; with which we are associated (if any).</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param service The service that owns this Engine</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setService(Service service) {</span></span>
<span class="line"><span>    this.service = service;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="child-parent" tabindex="-1">child, parent <a class="header-anchor" href="#child-parent" aria-label="Permalink to &quot;child, parent&quot;">​</a></h3><p><code>addChild</code>重载方法，限制只能添加Host作为子容器；</p><p><code>setParent</code>直接抛出异常，因为Engine接口中已经包含了setService方法作为它的上层，而Engine的上层没有容器的概念。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a child Container, only if the proposed child is an implementation</span></span>
<span class="line"><span>  * of Host.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param child Child container to be added</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void addChild(Container child) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!(child instanceof Host))</span></span>
<span class="line"><span>        throw new IllegalArgumentException</span></span>
<span class="line"><span>            (sm.getString(&quot;standardEngine.notHost&quot;));</span></span>
<span class="line"><span>    super.addChild(child);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Disallow any attempt to set a parent for this Container, since an</span></span>
<span class="line"><span>  * Engine is supposed to be at the top of the Container hierarchy.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param container Proposed parent Container</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setParent(Container container) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    throw new IllegalArgumentException</span></span>
<span class="line"><span>        (sm.getString(&quot;standardEngine.notParent&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="lifecycle的模板方法" tabindex="-1">Lifecycle的模板方法 <a class="header-anchor" href="#lifecycle的模板方法" aria-label="Permalink to &quot;Lifecycle的模板方法&quot;">​</a></h3><p>无非就是调用上文中我们介绍ContainerBase中的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void initInternal() throws LifecycleException {</span></span>
<span class="line"><span>    // Ensure that a Realm is present before any attempt is made to start</span></span>
<span class="line"><span>    // one. This will create the default NullRealm if necessary.</span></span>
<span class="line"><span>    getRealm();</span></span>
<span class="line"><span>    super.initInternal();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Start this component and implement the requirements</span></span>
<span class="line"><span>  * of {@link org.apache.catalina.util.LifecycleBase#startInternal()}.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>  *  that prevents this component from being used</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected synchronized void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Log our server identification information</span></span>
<span class="line"><span>    if (log.isInfoEnabled()) {</span></span>
<span class="line"><span>        log.info(sm.getString(&quot;standardEngine.start&quot;, ServerInfo.getServerInfo()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Standard container startup</span></span>
<span class="line"><span>    super.startInternal();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="logaccess" tabindex="-1">LogAccess <a class="header-anchor" href="#logaccess" aria-label="Permalink to &quot;LogAccess&quot;">​</a></h3><blockquote><p>这里需要补充下之前没有介绍的<strong>日志访问</strong>，这里介绍下。</p></blockquote><p>运行Web服务器时，<strong>正常生成的输出文件之一是访问日志</strong>，该访问日志以标准格式为服务器处理的每个请求生成一行信息。Catalina包括一个可选的Valve实现，该实现可以创建与Web服务器创建的标准格式相同的访问日志，也可以创建任意数量的自定义格式。</p><p>需要先看下xml配置; 您可以通过嵌套如下所示的Valve元素，要求Catalina为Engine， Host或Context处理的所有请求创建访问日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;Engine name=&quot;Standalone&quot; ...&gt;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  &lt;Valve className=&quot;org.apache.catalina.valves.AccessLogValve&quot;</span></span>
<span class="line"><span>         prefix=&quot;catalina_access_log&quot; suffix=&quot;.txt&quot;</span></span>
<span class="line"><span>         pattern=&quot;common&quot;/&gt;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>&lt;/Engine&gt;</span></span></code></pre></div><p>好了看下具体的实现，使用适配器模式获取AccessLog类型的Valve：</p><p>适配器模式看这里：<a href="https://pdai.tech/md/dev-spec/pattern/9_adapter.html" target="_blank" rel="noreferrer">结构型 - 适配器(Adapter)</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public AccessLog getAccessLog() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (accessLogScanComplete) {</span></span>
<span class="line"><span>        return accessLog;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AccessLogAdapter adapter = null;</span></span>
<span class="line"><span>    Valve valves[] = getPipeline().getValves();</span></span>
<span class="line"><span>    for (Valve valve : valves) {</span></span>
<span class="line"><span>        if (valve instanceof AccessLog) { // 看这里</span></span>
<span class="line"><span>            if (adapter == null) {</span></span>
<span class="line"><span>                adapter = new AccessLogAdapter((AccessLog) valve);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                adapter.add((AccessLog) valve);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (adapter != null) {</span></span>
<span class="line"><span>        accessLog = adapter;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    accessLogScanComplete = true;</span></span>
<span class="line"><span>    return accessLog;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AccessLog(日志记录器)主要的作用就是记录日志，这个记录的方法就是<code>logAccess()</code>方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Override the default implementation. If no access log is defined for the</span></span>
<span class="line"><span>  * Engine, look for one in the Engine&#39;s default host and then the default</span></span>
<span class="line"><span>  * host&#39;s ROOT context. If still none is found, return the default NoOp</span></span>
<span class="line"><span>  * access log.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void logAccess(Request request, Response response, long time,</span></span>
<span class="line"><span>        boolean useDefault) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean logged = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     // 如果有accessLog，则记录日志</span></span>
<span class="line"><span>    if (getAccessLog() != null) {</span></span>
<span class="line"><span>        accessLog.log(request, response, time);</span></span>
<span class="line"><span>        logged = true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 没找到且使用useDefault，表示从下层容器中获取accessLog</span></span>
<span class="line"><span>    if (!logged &amp;&amp; useDefault) {</span></span>
<span class="line"><span>        AccessLog newDefaultAccessLog = defaultAccessLog.get();</span></span>
<span class="line"><span>        if (newDefaultAccessLog == null) {</span></span>
<span class="line"><span>            // If we reached this point, this Engine can&#39;t have an AccessLog</span></span>
<span class="line"><span>            // Look in the defaultHost</span></span>
<span class="line"><span>            Host host = (Host) findChild(getDefaultHost()); // 如果没有默认的accessLog，则获取默认Host的accessLog</span></span>
<span class="line"><span>            Context context = null;</span></span>
<span class="line"><span>            if (host != null &amp;&amp; host.getState().isAvailable()) {</span></span>
<span class="line"><span>                newDefaultAccessLog = host.getAccessLog();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (newDefaultAccessLog != null) {</span></span>
<span class="line"><span>                    if (defaultAccessLog.compareAndSet(null,</span></span>
<span class="line"><span>                            newDefaultAccessLog)) {</span></span>
<span class="line"><span>                        AccessLogListener l = new AccessLogListener(this,</span></span>
<span class="line"><span>                                host, null);</span></span>
<span class="line"><span>                        l.install(); // 注册AccessLog监听器至当前Engine</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    // Try the ROOT context of default host</span></span>
<span class="line"><span>                    context = (Context) host.findChild(&quot;&quot;); // 如果仍然没有找到，则获取默认host的ROOT Context的accessLog</span></span>
<span class="line"><span>                    if (context != null &amp;&amp;</span></span>
<span class="line"><span>                            context.getState().isAvailable()) {</span></span>
<span class="line"><span>                        newDefaultAccessLog = context.getAccessLog();</span></span>
<span class="line"><span>                        if (newDefaultAccessLog != null) {</span></span>
<span class="line"><span>                            if (defaultAccessLog.compareAndSet(null,</span></span>
<span class="line"><span>                                    newDefaultAccessLog)) {</span></span>
<span class="line"><span>                                AccessLogListener l = new AccessLogListener(</span></span>
<span class="line"><span>                                        this, null, context);</span></span>
<span class="line"><span>                                l.install();</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (newDefaultAccessLog == null) { </span></span>
<span class="line"><span>                newDefaultAccessLog = new NoopAccessLog(); // 这个其实是一个空模式，以便采用统一方式调用（不用判空了）</span></span>
<span class="line"><span>                if (defaultAccessLog.compareAndSet(null,</span></span>
<span class="line"><span>                        newDefaultAccessLog)) {</span></span>
<span class="line"><span>                    AccessLogListener l = new AccessLogListener(this, host,</span></span>
<span class="line"><span>                            context);</span></span>
<span class="line"><span>                    l.install();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 最后记录日志，（上面最后有空模式实现，所以可以直接调用，不用判空）</span></span>
<span class="line"><span>        newDefaultAccessLog.log(request, response, time);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中涉及的相关内部类如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected static final class NoopAccessLog implements AccessLog {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void log(Request request, Response response, long time) {</span></span>
<span class="line"><span>        // NOOP</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setRequestAttributesEnabled(</span></span>
<span class="line"><span>            boolean requestAttributesEnabled) {</span></span>
<span class="line"><span>        // NOOP</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean getRequestAttributesEnabled() {</span></span>
<span class="line"><span>        // NOOP</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected static final class AccessLogListener</span></span>
<span class="line"><span>        implements PropertyChangeListener, LifecycleListener,</span></span>
<span class="line"><span>        ContainerListener {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final StandardEngine engine;</span></span>
<span class="line"><span>    private final Host host;</span></span>
<span class="line"><span>    private final Context context;</span></span>
<span class="line"><span>    private volatile boolean disabled = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AccessLogListener(StandardEngine engine, Host host,</span></span>
<span class="line"><span>            Context context) {</span></span>
<span class="line"><span>        this.engine = engine;</span></span>
<span class="line"><span>        this.host = host;</span></span>
<span class="line"><span>        this.context = context;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void install() {</span></span>
<span class="line"><span>        engine.addPropertyChangeListener(this);</span></span>
<span class="line"><span>        if (host != null) { // 同时注册至host和context</span></span>
<span class="line"><span>            host.addContainerListener(this);</span></span>
<span class="line"><span>            host.addLifecycleListener(this);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (context != null) {</span></span>
<span class="line"><span>            context.addLifecycleListener(this);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void uninstall() {</span></span>
<span class="line"><span>        disabled = true;</span></span>
<span class="line"><span>        if (context != null) {</span></span>
<span class="line"><span>            context.removeLifecycleListener(this);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (host != null) {</span></span>
<span class="line"><span>            host.removeLifecycleListener(this);</span></span>
<span class="line"><span>            host.removeContainerListener(this);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        engine.removePropertyChangeListener(this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void lifecycleEvent(LifecycleEvent event) {</span></span>
<span class="line"><span>        if (disabled) return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String type = event.getType();</span></span>
<span class="line"><span>        if (Lifecycle.AFTER_START_EVENT.equals(type) ||</span></span>
<span class="line"><span>                Lifecycle.BEFORE_STOP_EVENT.equals(type) ||</span></span>
<span class="line"><span>                Lifecycle.BEFORE_DESTROY_EVENT.equals(type)) {</span></span>
<span class="line"><span>            // Container is being started/stopped/removed</span></span>
<span class="line"><span>            // Force re-calculation and disable listener since it won&#39;t</span></span>
<span class="line"><span>            // be re-used</span></span>
<span class="line"><span>            engine.defaultAccessLog.set(null);</span></span>
<span class="line"><span>            uninstall();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void propertyChange(PropertyChangeEvent evt) {</span></span>
<span class="line"><span>        if (disabled) return;</span></span>
<span class="line"><span>        if (&quot;defaultHost&quot;.equals(evt.getPropertyName())) {</span></span>
<span class="line"><span>            // Force re-calculation and disable listener since it won&#39;t</span></span>
<span class="line"><span>            // be re-used</span></span>
<span class="line"><span>            engine.defaultAccessLog.set(null);</span></span>
<span class="line"><span>            uninstall();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void containerEvent(ContainerEvent event) {</span></span>
<span class="line"><span>        // Only useful for hosts</span></span>
<span class="line"><span>        if (disabled) return;</span></span>
<span class="line"><span>        if (Container.ADD_CHILD_EVENT.equals(event.getType())) {</span></span>
<span class="line"><span>            Context context = (Context) event.getData();</span></span>
<span class="line"><span>            if (context.getPath().isEmpty()) {</span></span>
<span class="line"><span>                // Force re-calculation and disable listener since it won&#39;t</span></span>
<span class="line"><span>                // be re-used</span></span>
<span class="line"><span>                engine.defaultAccessLog.set(null);</span></span>
<span class="line"><span>                uninstall();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="jmx相关" tabindex="-1">JMX相关 <a class="header-anchor" href="#jmx相关" aria-label="Permalink to &quot;JMX相关&quot;">​</a></h3><p>之前已经有过相关介绍，这里不再介绍相关方法，只列出相关方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected String getObjectNameKeyProperties() {</span></span>
<span class="line"><span>    return &quot;type=Engine&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected String getDomainInternal() {</span></span>
<span class="line"><span>    return getName();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,45)]))}const v=s(t,[["render",i]]);export{h as __pageData,v as default};
