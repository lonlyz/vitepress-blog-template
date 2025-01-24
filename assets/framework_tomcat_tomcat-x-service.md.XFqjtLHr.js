import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/tomcat/tomcat-x-service-1.jpg",g=JSON.parse('{"title":"Tomcat - Service的设计和实现: StandardService","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-service.md","filePath":"framework/tomcat/tomcat-x-service.md","lastUpdated":1737706346000}'),t={name:"framework/tomcat/tomcat-x-service.md"};function i(c,n,o,r,d,u){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="tomcat-service的设计和实现-standardservice" tabindex="-1">Tomcat - Service的设计和实现: StandardService <a class="header-anchor" href="#tomcat-service的设计和实现-standardservice" aria-label="Permalink to &quot;Tomcat - Service的设计和实现: StandardService&quot;">​</a></h1><blockquote><p>上文讲了Server的具体实现了，本文主要讲Service的设计和实现；我们从上文其实已经知道Server中包含多个service了。@pdai</p></blockquote><h2 id="理解思路" tabindex="-1">理解思路 <a class="header-anchor" href="#理解思路" aria-label="Permalink to &quot;理解思路&quot;">​</a></h2><ul><li><strong>第一：类比StandardServer, 抓住StandardService整体类依赖结构来理解</strong></li></ul><p><img src="'+l+`" alt="error.图片加载失败"></p><ul><li><strong>第二：结合server.xml中service配置来理解</strong></li></ul><p>见下文具体阐述。</p><ul><li><strong>第三：结合Service Config官方配置文档</strong></li></ul><p><a href="http://tomcat.apache.org/tomcat-9.0-doc/config/service.html" target="_blank" rel="noreferrer">http://tomcat.apache.org/tomcat-9.0-doc/config/service.html</a></p><h2 id="service结构设计" tabindex="-1">Service结构设计 <a class="header-anchor" href="#service结构设计" aria-label="Permalink to &quot;Service结构设计&quot;">​</a></h2><blockquote><p>我们需要从高一点的维度去理解service的结构设计，而不是多少方法多少代码；这里的理解一定是要结合Server.xml中service配置部分对应理解。@pdai</p></blockquote><h3 id="server-xml" tabindex="-1">server.xml <a class="header-anchor" href="#server-xml" aria-label="Permalink to &quot;server.xml&quot;">​</a></h3><ul><li>首先要看下server.xml中Service的配置，这样你便知道了需要了解的4个部分</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!--</span></span>
<span class="line"><span>    每个Service元素只能有一个Engine元素.元素处理在同一个&lt;Service&gt;中所有&lt;Connector&gt;元素接收到的客户请求</span></span>
<span class="line"><span>--&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;Service name=&quot;Catalina&quot;&gt;</span></span>
<span class="line"><span>&lt;!-- 1. 属性说明</span></span>
<span class="line"><span>	name:Service的名称</span></span>
<span class="line"><span>--&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--2. 一个或多个excecutors --&gt;</span></span>
<span class="line"><span>    &lt;!--</span></span>
<span class="line"><span>    &lt;Executor name=&quot;tomcatThreadPool&quot; namePrefix=&quot;catalina-exec-&quot;</span></span>
<span class="line"><span>        maxThreads=&quot;150&quot; minSpareThreads=&quot;4&quot;/&gt;</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--</span></span>
<span class="line"><span>		3.Connector元素:</span></span>
<span class="line"><span>			由Connector接口定义.&lt;Connector&gt;元素代表与客户程序实际交互的组件,它负责接收客户请求,以及向客户返回响应结果.</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>    &lt;Connector port=&quot;80&quot; maxHttpHeaderSize=&quot;8192&quot;</span></span>
<span class="line"><span>               maxThreads=&quot;150&quot; minSpareThreads=&quot;25&quot; maxSpareThreads=&quot;75&quot;</span></span>
<span class="line"><span>               enableLookups=&quot;false&quot; redirectPort=&quot;8443&quot; acceptCount=&quot;100&quot;</span></span>
<span class="line"><span>               connectionTimeout=&quot;20000&quot; disableUploadTimeout=&quot;true&quot; /&gt;</span></span>
<span class="line"><span>    &lt;!-- 属性说明</span></span>
<span class="line"><span>		port:服务器连接器的端口号,该连接器将在指定端口侦听来自客户端的请求。</span></span>
<span class="line"><span>		enableLookups:如果为true，则可以通过调用request.getRemoteHost()进行DNS查询来得到远程客户端的实际主机名；</span></span>
<span class="line"><span>					若为false则不进行DNS查询，而是返回其ip地址。</span></span>
<span class="line"><span>		redirectPort:服务器正在处理http请求时收到了一个SSL传输请求后重定向的端口号。</span></span>
<span class="line"><span>		acceptCount:当所有可以使用的处理请求的线程都被用光时,可以放到处理队列中的请求数,超过这个数的请求将不予处理，而返回Connection refused错误。</span></span>
<span class="line"><span>		connectionTimeout:等待超时的时间数（以毫秒为单位）。</span></span>
<span class="line"><span>		maxThreads:设定在监听端口的线程的最大数目,这个值也决定了服务器可以同时响应客户请求的最大数目.默认值为200。</span></span>
<span class="line"><span>		protocol:必须设定为AJP/1.3协议。</span></span>
<span class="line"><span>		address:如果服务器有两个以上IP地址,该属性可以设定端口监听的IP地址,默认情况下,端口会监听服务器上所有IP地址。</span></span>
<span class="line"><span>		minProcessors:服务器启动时创建的处理请求的线程数，每个请求由一个线程负责。</span></span>
<span class="line"><span>		maxProcessors:最多可以创建的处理请求的线程数。</span></span>
<span class="line"><span>		minSpareThreads:最小备用线程 。</span></span>
<span class="line"><span>		maxSpareThreads:最大备用线程。</span></span>
<span class="line"><span>		debug:日志等级。</span></span>
<span class="line"><span>		disableUploadTimeout:禁用上传超时,主要用于大数据上传时。</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;Connector port=&quot;8009&quot; enableLookups=&quot;false&quot; redirectPort=&quot;8443&quot; protocol=&quot;AJP/1.3&quot; /&gt;</span></span>
<span class="line"><span>    &lt;!-- 负责和其他HTTP服务器建立连接。在把Tomcat与其他HTTP服务器集成时就需要用到这个连接器。 --&gt;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    &lt;!--</span></span>
<span class="line"><span>		4. Engine</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>    &lt;Engine name=&quot;Catalina&quot; defaultHost=&quot;localhost&quot;&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;/Engine&gt;</span></span>
<span class="line"><span>  &lt;/Service&gt;</span></span></code></pre></div><h3 id="service中的接口设计" tabindex="-1">Service中的接口设计 <a class="header-anchor" href="#service中的接口设计" aria-label="Permalink to &quot;Service中的接口设计&quot;">​</a></h3><ul><li><strong>公共属性</strong>, name等</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the name of this Service.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getName();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the name of this Service.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param name The new service name</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setName(String name);</span></span></code></pre></div><ul><li>父Server相关</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the &lt;code&gt;Server&lt;/code&gt; with which we are associated (if any).</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Server getServer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the &lt;code&gt;Server&lt;/code&gt; with which we are associated (if any).</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param server The server that owns this Service</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setServer(Server server);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the parent class loader for this component. If not set, return</span></span>
<span class="line"><span>  * {@link #getServer()} {@link Server#getParentClassLoader()}. If no server</span></span>
<span class="line"><span>  * has been set, return the system class loader.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public ClassLoader getParentClassLoader();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the parent class loader for this service.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param parent The new parent class loader</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setParentClassLoader(ClassLoader parent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the domain under which this container will be / has been</span></span>
<span class="line"><span>  * registered.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getDomain();</span></span></code></pre></div><ul><li>Connector相关</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a new Connector to the set of defined Connectors, and associate it</span></span>
<span class="line"><span>  * with this Service&#39;s Container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param connector The Connector to be added</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void addConnector(Connector connector);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Find and return the set of Connectors associated with this Service.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return the set of associated Connectors</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Connector[] findConnectors();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Remove the specified Connector from the set associated from this</span></span>
<span class="line"><span>  * Service.  The removed Connector will also be disassociated from our</span></span>
<span class="line"><span>  * Container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param connector The Connector to be removed</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void removeConnector(Connector connector);</span></span></code></pre></div><ul><li>Engine</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the &lt;code&gt;Engine&lt;/code&gt; that handles requests for all</span></span>
<span class="line"><span>  * &lt;code&gt;Connectors&lt;/code&gt; associated with this Service.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Engine getContainer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the &lt;code&gt;Engine&lt;/code&gt; that handles requests for all</span></span>
<span class="line"><span>  * &lt;code&gt;Connectors&lt;/code&gt; associated with this Service.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param engine The new Engine</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setContainer(Engine engine);</span></span></code></pre></div><ul><li>Excutor相关</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Adds a named executor to the service</span></span>
<span class="line"><span>  * @param ex Executor</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void addExecutor(Executor ex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Retrieves all executors</span></span>
<span class="line"><span>  * @return Executor[]</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Executor[] findExecutors();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Retrieves executor by name, null if not found</span></span>
<span class="line"><span>  * @param name String</span></span>
<span class="line"><span>  * @return Executor</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Executor getExecutor(String name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Removes an executor from the service</span></span>
<span class="line"><span>  * @param ex Executor</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void removeExecutor(Executor ex);</span></span></code></pre></div><h2 id="standardservice的实现" tabindex="-1">StandardService的实现 <a class="header-anchor" href="#standardservice的实现" aria-label="Permalink to &quot;StandardService的实现&quot;">​</a></h2><p>属性和父Server相关比较简单，这里主要看下其它的方法：</p><h3 id="engine相关" tabindex="-1">Engine相关 <a class="header-anchor" href="#engine相关" aria-label="Permalink to &quot;Engine相关&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>private Engine engine = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Engine getContainer() {</span></span>
<span class="line"><span>    return engine;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setContainer(Engine engine) {</span></span>
<span class="line"><span>    Engine oldEngine = this.engine;</span></span>
<span class="line"><span>    if (oldEngine != null) {</span></span>
<span class="line"><span>        oldEngine.setService(null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.engine = engine;</span></span>
<span class="line"><span>    if (this.engine != null) {</span></span>
<span class="line"><span>        this.engine.setService(this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (getState().isAvailable()) {</span></span>
<span class="line"><span>        if (this.engine != null) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                this.engine.start(); // 启动Engine</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;standardService.engine.startFailed&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 重启Mapper - Restart MapperListener to pick up new engine.</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            mapperListener.stop();</span></span>
<span class="line"><span>        } catch (LifecycleException e) {</span></span>
<span class="line"><span>            log.error(sm.getString(&quot;standardService.mapperListener.stopFailed&quot;), e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            mapperListener.start();</span></span>
<span class="line"><span>        } catch (LifecycleException e) {</span></span>
<span class="line"><span>            log.error(sm.getString(&quot;standardService.mapperListener.startFailed&quot;), e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (oldEngine != null) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                oldEngine.stop();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;standardService.engine.stopFailed&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 触发container属性变更事件</span></span>
<span class="line"><span>    support.firePropertyChange(&quot;container&quot;, oldEngine, this.engine);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="connectors相关" tabindex="-1">Connectors相关 <a class="header-anchor" href="#connectors相关" aria-label="Permalink to &quot;Connectors相关&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * The set of Connectors associated with this Service.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected Connector connectors[] = new Connector[0];</span></span>
<span class="line"><span>private final Object connectorsLock = new Object();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a new Connector to the set of defined Connectors, and associate it</span></span>
<span class="line"><span>  * with this Service&#39;s Container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param connector The Connector to be added</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void addConnector(Connector connector) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    synchronized (connectorsLock) {</span></span>
<span class="line"><span>        connector.setService(this);</span></span>
<span class="line"><span>        Connector results[] = new Connector[connectors.length + 1];</span></span>
<span class="line"><span>        System.arraycopy(connectors, 0, results, 0, connectors.length);</span></span>
<span class="line"><span>        results[connectors.length] = connector;</span></span>
<span class="line"><span>        connectors = results;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (getState().isAvailable()) {</span></span>
<span class="line"><span>            connector.start();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (LifecycleException e) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(</span></span>
<span class="line"><span>                sm.getString(&quot;standardService.connector.startFailed&quot;, connector), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Report this property change to interested listeners</span></span>
<span class="line"><span>    support.firePropertyChange(&quot;connector&quot;, null, connector);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public ObjectName[] getConnectorNames() {</span></span>
<span class="line"><span>    ObjectName results[] = new ObjectName[connectors.length];</span></span>
<span class="line"><span>    for (int i=0; i&lt;results.length; i++) {</span></span>
<span class="line"><span>        results[i] = connectors[i].getObjectName();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return results;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * 当前Service相关的所有Connectors.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Connector[] findConnectors() {</span></span>
<span class="line"><span>    return connectors;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * 删除connector</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param connector The Connector to be removed</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void removeConnector(Connector connector) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    synchronized (connectorsLock) {</span></span>
<span class="line"><span>        // 找到conector位置</span></span>
<span class="line"><span>        int j = -1;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; connectors.length; i++) {</span></span>
<span class="line"><span>            if (connector == connectors[i]) {</span></span>
<span class="line"><span>                j = i;</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (j &lt; 0)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        if (connectors[j].getState().isAvailable()) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                connectors[j].stop(); // 停止</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(</span></span>
<span class="line"><span>                        &quot;standardService.connector.stopFailed&quot;,</span></span>
<span class="line"><span>                        connectors[j]), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        connector.setService(null); // 去除父service绑定</span></span>
<span class="line"><span>        int k = 0;</span></span>
<span class="line"><span>        Connector results[] = new Connector[connectors.length - 1];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; connectors.length; i++) {</span></span>
<span class="line"><span>            if (i != j)</span></span>
<span class="line"><span>                results[k++] = connectors[i]; // 后续connector向前移位</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        connectors = results;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 触发connector属性变更事件</span></span>
<span class="line"><span>        support.firePropertyChange(&quot;connector&quot;, connector, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="executor相关" tabindex="-1">Executor相关 <a class="header-anchor" href="#executor相关" aria-label="Permalink to &quot;Executor相关&quot;">​</a></h3><p>CRUD方法，代码比较简单</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Adds a named executor to the service</span></span>
<span class="line"><span>  * @param ex Executor</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void addExecutor(Executor ex) {</span></span>
<span class="line"><span>    synchronized (executors) {</span></span>
<span class="line"><span>        if (!executors.contains(ex)) {</span></span>
<span class="line"><span>            executors.add(ex);</span></span>
<span class="line"><span>            if (getState().isAvailable()) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    ex.start(); // 启动</span></span>
<span class="line"><span>                } catch (LifecycleException x) {</span></span>
<span class="line"><span>                    log.error(sm.getString(&quot;standardService.executor.start&quot;), x);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Retrieves all executors</span></span>
<span class="line"><span>  * @return Executor[]</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Executor[] findExecutors() {</span></span>
<span class="line"><span>    synchronized (executors) {</span></span>
<span class="line"><span>        Executor[] arr = new Executor[executors.size()];</span></span>
<span class="line"><span>        executors.toArray(arr);</span></span>
<span class="line"><span>        return arr;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Retrieves executor by name, null if not found</span></span>
<span class="line"><span>  * @param executorName String</span></span>
<span class="line"><span>  * @return Executor</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Executor getExecutor(String executorName) {</span></span>
<span class="line"><span>    synchronized (executors) {</span></span>
<span class="line"><span>        for (Executor executor: executors) {</span></span>
<span class="line"><span>            if (executorName.equals(executor.getName()))</span></span>
<span class="line"><span>                return executor;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Removes an executor from the service</span></span>
<span class="line"><span>  * @param ex Executor</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void removeExecutor(Executor ex) {</span></span>
<span class="line"><span>    synchronized (executors) {</span></span>
<span class="line"><span>        if ( executors.remove(ex) &amp;&amp; getState().isAvailable() ) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ex.stop(); // 停止</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;standardService.executor.stop&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="lifecycle相关模板方法" tabindex="-1">Lifecycle相关模板方法 <a class="header-anchor" href="#lifecycle相关模板方法" aria-label="Permalink to &quot;Lifecycle相关模板方法&quot;">​</a></h3><p>首先看 <strong>initInternal</strong> 方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Invoke a pre-startup initialization. This is used to allow connectors</span></span>
<span class="line"><span> * to bind to restricted ports under Unix operating environments.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void initInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    super.initInternal();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (engine != null) {</span></span>
<span class="line"><span>        engine.init();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Initialize any Executors</span></span>
<span class="line"><span>    for (Executor executor : findExecutors()) {</span></span>
<span class="line"><span>        if (executor instanceof JmxEnabled) {</span></span>
<span class="line"><span>            ((JmxEnabled) executor).setDomain(getDomain());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        executor.init();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Initialize mapper listener</span></span>
<span class="line"><span>    mapperListener.init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Initialize our defined Connectors</span></span>
<span class="line"><span>    synchronized (connectorsLock) {</span></span>
<span class="line"><span>        for (Connector connector : connectors) {</span></span>
<span class="line"><span>            connector.init();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>initInternal 代码很短，思路也很清晰，就是依次调用了这个成员变量的 init 方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>engine.init() </span></span>
<span class="line"><span>executor.init </span></span>
<span class="line"><span>mapperListener.init()</span></span>
<span class="line"><span>connector.init()</span></span></code></pre></div><p><strong>startInternal 方法</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Start nested components ({@link Executor}s, {@link Connector}s and</span></span>
<span class="line"><span> * {@link Container}s) and implement the requirements of</span></span>
<span class="line"><span> * {@link org.apache.catalina.util.LifecycleBase#startInternal()}.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span> *  that prevents this component from being used</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(log.isInfoEnabled())</span></span>
<span class="line"><span>        log.info(sm.getString(&quot;standardService.start.name&quot;, this.name));</span></span>
<span class="line"><span>    setState(LifecycleState.STARTING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start our defined Container first</span></span>
<span class="line"><span>    if (engine != null) {</span></span>
<span class="line"><span>        synchronized (engine) {</span></span>
<span class="line"><span>            engine.start();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    synchronized (executors) {</span></span>
<span class="line"><span>        for (Executor executor: executors) {</span></span>
<span class="line"><span>            executor.start();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mapperListener.start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start our defined Connectors second</span></span>
<span class="line"><span>    synchronized (connectorsLock) {</span></span>
<span class="line"><span>        for (Connector connector: connectors) {</span></span>
<span class="line"><span>            // If it has already failed, don&#39;t try and start it</span></span>
<span class="line"><span>            if (connector.getState() != LifecycleState.FAILED) {</span></span>
<span class="line"><span>                connector.start();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>startInternal 跟 initInternal 方法一样，也是依次调用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>engine.start();</span></span>
<span class="line"><span>executor.start();</span></span>
<span class="line"><span>mapperListener.start();</span></span>
<span class="line"><span>connector.start();</span></span></code></pre></div><h3 id="补充下mapperlistener" tabindex="-1">补充下MapperListener <a class="header-anchor" href="#补充下mapperlistener" aria-label="Permalink to &quot;补充下MapperListener&quot;">​</a></h3><p>mapperListener 的作用是在 start 的时候将容器类对象注册到 Mapper 对象中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Create mapper listener.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param service The service this listener is associated with</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public MapperListener(Service service) {</span></span>
<span class="line"><span>    this.service = service;</span></span>
<span class="line"><span>    this.mapper = service.getMapper();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>service.getMapper() 返回的是 StandardService 对象的 mapper 成员变量。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Mapper.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>protected final Mapper mapper = new Mapper();</span></span></code></pre></div><p>Mapper是 Tomcat 处理 Http 请求时非常重要的组件。Tomcat 使用 Mapper 来处理一个 Request 到 Host、Context 的映射关系，从而决定使用哪个 Service 来处理请求。</p><p>MapperListener 也是继承自 LifecycleMBeanBase，不过没有重载 initInternal 方法。</p><ul><li>startInternal 方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setState(LifecycleState.STARTING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Engine engine = service.getContainer();</span></span>
<span class="line"><span>    if (engine == null) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    findDefaultHost();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    addListeners(engine);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Container[] conHosts = engine.findChildren();</span></span>
<span class="line"><span>    for (Container conHost : conHosts) {</span></span>
<span class="line"><span>        Host host = (Host) conHost;</span></span>
<span class="line"><span>        if (!LifecycleState.NEW.equals(host.getState())) {</span></span>
<span class="line"><span>            // Registering the host will register the context and wrappers</span></span>
<span class="line"><span>            registerHost(host);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>findDefaultHost() 方法</li></ul><p>首先看 findDefaultHost() 方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void findDefaultHost() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Engine engine = service.getContainer();</span></span>
<span class="line"><span>    String defaultHost = engine.getDefaultHost();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean found = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (defaultHost != null &amp;&amp; defaultHost.length() &gt; 0) {</span></span>
<span class="line"><span>        Container[] containers = engine.findChildren();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (Container container : containers) {</span></span>
<span class="line"><span>            Host host = (Host) container;</span></span>
<span class="line"><span>            if (defaultHost.equalsIgnoreCase(host.getName())) {</span></span>
<span class="line"><span>                found = true;</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            String[] aliases = host.findAliases();</span></span>
<span class="line"><span>            for (String alias : aliases) {</span></span>
<span class="line"><span>                if (defaultHost.equalsIgnoreCase(alias)) {</span></span>
<span class="line"><span>                    found = true;</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (found) {</span></span>
<span class="line"><span>        mapper.setDefaultHostName(defaultHost);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        log.error(sm.getString(&quot;mapperListener.unknownDefaultHost&quot;, defaultHost, service));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>findDefaultHost() 是主要是找出 defaultHost ，并调用 <code>mapper.setDefaultHostName(defaultHost);</code> 这个 defaultHost 是 server.xml 的 <code>&lt;Engine&gt;</code> 标签的属性，一般都是 &quot;localHost&quot;。</p><p>从上面代码 for 代码块里可以看出，Host 是 Engine 的子 Container。for 语句就是找出一个名字跟 defaultHost 指定的名字相同的 Host 对象。</p><ul><li>addListeners(engine) 方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Add this mapper to the container and all child containers</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param container</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void addListeners(Container container) {</span></span>
<span class="line"><span>    container.addContainerListener(this);</span></span>
<span class="line"><span>    container.addLifecycleListener(this);</span></span>
<span class="line"><span>    for (Container child : container.findChildren()) {</span></span>
<span class="line"><span>        addListeners(child);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法的作用是，将 MapperListener 这个监听器添加到 Engine 及其子容器中</p><ul><li>registerHost 调用 registerHost方法来注册 Engine 的字容器 Host。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Register host.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void registerHost(Host host) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String[] aliases = host.findAliases();</span></span>
<span class="line"><span>    mapper.addHost(host.getName(), aliases, host);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (Container container : host.findChildren()) {</span></span>
<span class="line"><span>        if (container.getState().isAvailable()) {</span></span>
<span class="line"><span>            registerContext((Context) container);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Default host may have changed</span></span>
<span class="line"><span>    findDefaultHost();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(log.isDebugEnabled()) {</span></span>
<span class="line"><span>        log.debug(sm.getString(&quot;mapperListener.registerHost&quot;,</span></span>
<span class="line"><span>                host.getName(), domain, service));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>registerHost 方法先调用 mapper.addHost，然后调用 registerContext 方法注册 Host 的子容器 Context。 mapper.addHost 方法是将 Host 加入的 Mapper 类的的成员变量MappedHost[] hosts 中。</p><p>接着看 registerContext 方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Register context.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void registerContext(Context context) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String contextPath = context.getPath();</span></span>
<span class="line"><span>    if (&quot;/&quot;.equals(contextPath)) {</span></span>
<span class="line"><span>        contextPath = &quot;&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Host host = (Host)context.getParent();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    WebResourceRoot resources = context.getResources();</span></span>
<span class="line"><span>    String[] welcomeFiles = context.findWelcomeFiles();</span></span>
<span class="line"><span>    List&lt;WrapperMappingInfo&gt; wrappers = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (Container container : context.findChildren()) {</span></span>
<span class="line"><span>        prepareWrapperMappingInfo(context, (Wrapper) container, wrappers);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(log.isDebugEnabled()) {</span></span>
<span class="line"><span>            log.debug(sm.getString(&quot;mapperListener.registerWrapper&quot;,</span></span>
<span class="line"><span>                    container.getName(), contextPath, service));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mapper.addContextVersion(host.getName(), host, contextPath,</span></span>
<span class="line"><span>            context.getWebappVersion(), context, welcomeFiles, resources,</span></span>
<span class="line"><span>            wrappers);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(log.isDebugEnabled()) {</span></span>
<span class="line"><span>        log.debug(sm.getString(&quot;mapperListener.registerContext&quot;,</span></span>
<span class="line"><span>                contextPath, service));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>registerContext 里先获取一些对象，比如 WebResourceRoot 对象、WrapperMappingInfo 对象，然后调用 mapper.addContextVersion。</p><p>Mapper#addContextVersion 方法比较琐细，就不细讲了。</p><p>其主要逻辑是将 Context 对象，以及 Context 的子容器 Wrapper 对象，每一个都分别构建一个对应的 MappedContext 和 MappedWrapper 对象，</p><p>然后把 MappedContext 和 MappedWrapper 塞进 ContextVersion 对象中，</p><p>最后把 Context 和 ContextVersion 的对应关系放在 Mapper 对象的一个 Map 里。</p><p>这里的 MappedContext 和 MappedWrapper 在 Tomcat 处理 Http 请求的时候是比较关键的。</p><p>registerHost 最后再更新了一下可能发生改变里的的 defaultHost。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://segmentfault.com/a/1190000022026318" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000022026318</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,73)]))}const v=s(t,[["render",i]]);export{g as __pageData,v as default};
