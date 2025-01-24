import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/tomcat/tomcat-x-server-1.jpg",v=JSON.parse('{"title":"Tomcat - Server的设计和实现: StandardServer","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-server.md","filePath":"framework/tomcat/tomcat-x-server.md","lastUpdated":1737706346000}'),i={name:"framework/tomcat/tomcat-x-server.md"};function t(c,s,r,o,d,u){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="tomcat-server的设计和实现-standardserver" tabindex="-1">Tomcat - Server的设计和实现: StandardServer <a class="header-anchor" href="#tomcat-server的设计和实现-standardserver" aria-label="Permalink to &quot;Tomcat - Server的设计和实现: StandardServer&quot;">​</a></h1><blockquote><p>基于前面的几篇文章，我们终于可以总体上梳理Server的具体实现了，这里体现在StandardServer具体的功能实现上。@pdai</p></blockquote><h2 id="理解思路" tabindex="-1">理解思路 <a class="header-anchor" href="#理解思路" aria-label="Permalink to &quot;理解思路&quot;">​</a></h2><ul><li><strong>第一：抓住StandardServer整体类依赖结构来理解</strong></li></ul><p><img src="'+l+`" alt="error.图片加载失败"></p><ul><li><strong>第二：结合server.xml来理解</strong></li></ul><p>见下文具体阐述。</p><ul><li><strong>第三：结合Server Config官方配置文档</strong></li></ul><p><a href="http://tomcat.apache.org/tomcat-9.0-doc/config/server.html" target="_blank" rel="noreferrer">http://tomcat.apache.org/tomcat-9.0-doc/config/server.html</a></p><h2 id="server结构设计" tabindex="-1">Server结构设计 <a class="header-anchor" href="#server结构设计" aria-label="Permalink to &quot;Server结构设计&quot;">​</a></h2><blockquote><p>我们需要从高一点的维度去理解Server的结构设计，而不是多少方法多少代码；这里的理解一定是要结合Server.xml对应理解。@pdai</p></blockquote><h3 id="server-xml" tabindex="-1">server.xml <a class="header-anchor" href="#server-xml" aria-label="Permalink to &quot;server.xml&quot;">​</a></h3><ul><li>首先要看下server.xml，这样你便知道了需要了解的四个部分</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;Server port=&quot;8005&quot; shutdown=&quot;SHUTDOWN&quot;&gt;</span></span>
<span class="line"><span>  &lt;!-- 1.属性说明</span></span>
<span class="line"><span>    port:指定一个端口，这个端口负责监听关闭Tomcat的请求</span></span>
<span class="line"><span>    shutdown:向以上端口发送的关闭服务器的命令字符串</span></span>
<span class="line"><span>  --&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!-- 2.Listener 相关 --&gt;</span></span>
<span class="line"><span>  &lt;Listener className=&quot;org.apache.catalina.core.AprLifecycleListener&quot; /&gt;</span></span>
<span class="line"><span>  &lt;Listener className=&quot;org.apache.catalina.mbeans.ServerLifecycleListener&quot; /&gt;</span></span>
<span class="line"><span>  &lt;Listener className=&quot;org.apache.catalina.mbeans.GlobalResourcesLifecycleListener&quot; /&gt;</span></span>
<span class="line"><span>  &lt;Listener className=&quot;org.apache.catalina.storeconfig.StoreConfigLifecycleListener&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!-- 3.GlobalNamingResources 相关 --&gt;</span></span>
<span class="line"><span>  &lt;GlobalNamingResources&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;Environment name=&quot;simpleValue&quot; type=&quot;java.lang.Integer&quot; value=&quot;30&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;Resource name=&quot;UserDatabase&quot; auth=&quot;Container&quot;</span></span>
<span class="line"><span>              type=&quot;org.apache.catalina.UserDatabase&quot;</span></span>
<span class="line"><span>       description=&quot;User database that can be updated and saved&quot;</span></span>
<span class="line"><span>           factory=&quot;org.apache.catalina.users.MemoryUserDatabaseFactory&quot;</span></span>
<span class="line"><span>          pathname=&quot;conf/tomcat-users.xml&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;/GlobalNamingResources&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!-- 4.service 相关 --&gt;</span></span>
<span class="line"><span>  &lt;Service name=&quot;Catalina&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;/Service&gt;</span></span>
<span class="line"><span>&lt;/Server&gt;</span></span></code></pre></div><h3 id="server中的接口设计" tabindex="-1">Server中的接口设计 <a class="header-anchor" href="#server中的接口设计" aria-label="Permalink to &quot;Server中的接口设计&quot;">​</a></h3><ul><li><strong>公共属性</strong>, 包括上面的port，shutdown, address等</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the port number we listen to for shutdown commands.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @see #getPortOffset()</span></span>
<span class="line"><span>  * @see #getPortWithOffset()</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public int getPort();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the port number we listen to for shutdown commands.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param port The new port number</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @see #setPortOffset(int)</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setPort(int port);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Get the number that offsets the port used for shutdown commands.</span></span>
<span class="line"><span>  * For example, if port is 8005, and portOffset is 1000,</span></span>
<span class="line"><span>  * the server listens at 9005.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return the port offset</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public int getPortOffset();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the number that offsets the server port used for shutdown commands.</span></span>
<span class="line"><span>  * For example, if port is 8005, and you set portOffset to 1000,</span></span>
<span class="line"><span>  * connector listens at 9005.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param portOffset sets the port offset</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setPortOffset(int portOffset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Get the actual port on which server is listening for the shutdown commands.</span></span>
<span class="line"><span>  * If you do not set port offset, port is returned. If you set</span></span>
<span class="line"><span>  * port offset, port offset + port is returned.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return the port with offset</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public int getPortWithOffset();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the address on which we listen to for shutdown commands.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getAddress();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the address on which we listen to for shutdown commands.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param address The new address</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setAddress(String address);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the shutdown command string we are waiting for.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getShutdown();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the shutdown command we are waiting for.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param shutdown The new shutdown command</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setShutdown(String shutdown);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Get the utility thread count.</span></span>
<span class="line"><span>  * @return the thread count</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public int getUtilityThreads();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the utility thread count.</span></span>
<span class="line"><span>  * @param utilityThreads the new thread count</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setUtilityThreads(int utilityThreads);</span></span></code></pre></div><table tabindex="0"><thead><tr><th>属性</th><th>描述</th></tr></thead><tbody><tr><td>className</td><td>使用的Java类名称。此类必须实现org.apache.catalina.Server接口。如果未指定类名，则将使用标准实现。</td></tr><tr><td>address</td><td>该服务器等待关闭命令的TCP / IP地址。如果未指定地址，localhost则使用。</td></tr><tr><td>port</td><td>该服务器等待关闭命令的TCP / IP端口号。设置为-1禁用关闭端口。注意：当使用Apache Commons Daemon启动Tomcat （在Windows上作为服务运行，或者在un * xes上使用jsvc运行）时，禁用关闭端口非常有效。但是，当使用标准shell脚本运行Tomcat时，不能使用它，因为它将阻止shutdown.bat</td></tr><tr><td>portOffset</td><td>应用于port和嵌套到任何嵌套连接器的端口的偏移量。它必须是一个非负整数。如果未指定，0则使用默认值。</td></tr><tr><td>shutdown</td><td>为了关闭Tomcat，必须通过与指定端口号的TCP / IP连接接收的命令字符串。</td></tr><tr><td>utilityThreads</td><td>此service中用于各种实用程序任务（包括重复执行的线程）的线程数。特殊值0将导致使用该值 Runtime.getRuntime().availableProcessors()。Runtime.getRuntime().availableProcessors() + value除非小于1，否则将使用负值， 在这种情况下将使用1个线程。预设值是1。</td></tr></tbody></table><ul><li>NamingResources</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the global naming resources.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public NamingResourcesImpl getGlobalNamingResources();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the global naming resources.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param globalNamingResources The new global naming resources</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setGlobalNamingResources</span></span>
<span class="line"><span>    (NamingResourcesImpl globalNamingResources);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the global naming resources context.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public javax.naming.Context getGlobalNamingContext();</span></span></code></pre></div><ul><li>Service相关， 包括添加Service， 查找Service，删除service等</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a new Service to the set of defined Services.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param service The Service to be added</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void addService(Service service);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Wait until a proper shutdown command is received, then return.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void await();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Find the specified Service</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param name Name of the Service to be returned</span></span>
<span class="line"><span>  * @return the specified Service, or &lt;code&gt;null&lt;/code&gt; if none exists.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Service findService(String name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the set of Services defined within this Server.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Service[] findServices();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Remove the specified Service from the set associated from this</span></span>
<span class="line"><span>  * Server.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param service The Service to be removed</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void removeService(Service service);</span></span></code></pre></div><h2 id="standardserver的实现" tabindex="-1">StandardServer的实现 <a class="header-anchor" href="#standardserver的实现" aria-label="Permalink to &quot;StandardServer的实现&quot;">​</a></h2><h3 id="线程池" tabindex="-1">线程池 <a class="header-anchor" href="#线程池" aria-label="Permalink to &quot;线程池&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 此service中用于各种实用程序任务（包括重复执行的线程）的线程数</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public int getUtilityThreads() {</span></span>
<span class="line"><span>    return utilityThreads;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * 获取内部进程数计算逻辑：</span></span>
<span class="line"><span>  * &gt; 0时，即utilityThreads的值。</span></span>
<span class="line"><span>  * &lt;=0时，Runtime.getRuntime().availableProcessors() + result...</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private static int getUtilityThreadsInternal(int utilityThreads) {</span></span>
<span class="line"><span>    int result = utilityThreads;</span></span>
<span class="line"><span>    if (result &lt;= 0) {</span></span>
<span class="line"><span>        result = Runtime.getRuntime().availableProcessors() + result;</span></span>
<span class="line"><span>        if (result &lt; 2) {</span></span>
<span class="line"><span>            result = 2;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setUtilityThreads(int utilityThreads) {</span></span>
<span class="line"><span>    // Use local copies to ensure thread safety</span></span>
<span class="line"><span>    int oldUtilityThreads = this.utilityThreads;</span></span>
<span class="line"><span>    if (getUtilityThreadsInternal(utilityThreads) &lt; getUtilityThreadsInternal(oldUtilityThreads)) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.utilityThreads = utilityThreads;</span></span>
<span class="line"><span>    if (oldUtilityThreads != utilityThreads &amp;&amp; utilityExecutor != null) {</span></span>
<span class="line"><span>        reconfigureUtilityExecutor(getUtilityThreadsInternal(utilityThreads));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 线程池</span></span>
<span class="line"><span>private synchronized void reconfigureUtilityExecutor(int threads) {</span></span>
<span class="line"><span>    // The ScheduledThreadPoolExecutor doesn&#39;t use MaximumPoolSize, only CorePoolSize is available</span></span>
<span class="line"><span>    if (utilityExecutor != null) {</span></span>
<span class="line"><span>        utilityExecutor.setCorePoolSize(threads);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        ScheduledThreadPoolExecutor scheduledThreadPoolExecutor =</span></span>
<span class="line"><span>                new ScheduledThreadPoolExecutor(threads,</span></span>
<span class="line"><span>                        new TaskThreadFactory(&quot;Catalina-utility-&quot;, utilityThreadsAsDaemon, Thread.MIN_PRIORITY));</span></span>
<span class="line"><span>        scheduledThreadPoolExecutor.setKeepAliveTime(10, TimeUnit.SECONDS);</span></span>
<span class="line"><span>        scheduledThreadPoolExecutor.setRemoveOnCancelPolicy(true);</span></span>
<span class="line"><span>        scheduledThreadPoolExecutor.setExecuteExistingDelayedTasksAfterShutdownPolicy(false);</span></span>
<span class="line"><span>        utilityExecutor = scheduledThreadPoolExecutor;</span></span>
<span class="line"><span>        utilityExecutorWrapper = new org.apache.tomcat.util.threads.ScheduledThreadPoolExecutor(utilityExecutor);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Get if the utility threads are daemon threads.</span></span>
<span class="line"><span>  * @return the threads daemon flag</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public boolean getUtilityThreadsAsDaemon() {</span></span>
<span class="line"><span>    return utilityThreadsAsDaemon;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the utility threads daemon flag. The default value is true.</span></span>
<span class="line"><span>  * @param utilityThreadsAsDaemon the new thread daemon flag</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setUtilityThreadsAsDaemon(boolean utilityThreadsAsDaemon) {</span></span>
<span class="line"><span>    this.utilityThreadsAsDaemon = utilityThreadsAsDaemon;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="service相关方法实现" tabindex="-1">Service相关方法实现 <a class="header-anchor" href="#service相关方法实现" aria-label="Permalink to &quot;Service相关方法实现&quot;">​</a></h3><p>里面的方法都很简单。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a new Service to the set of defined Services.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param service The Service to be added</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void addService(Service service) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    service.setServer(this);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    synchronized (servicesLock) {</span></span>
<span class="line"><span>        Service results[] = new Service[services.length + 1];</span></span>
<span class="line"><span>        System.arraycopy(services, 0, results, 0, services.length);</span></span>
<span class="line"><span>        results[services.length] = service;</span></span>
<span class="line"><span>        services = results;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (getState().isAvailable()) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                service.start();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                // Ignore</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Report this property change to interested listeners</span></span>
<span class="line"><span>        support.firePropertyChange(&quot;service&quot;, null, service);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void stopAwait() {</span></span>
<span class="line"><span>    stopAwait=true;</span></span>
<span class="line"><span>    Thread t = awaitThread;</span></span>
<span class="line"><span>    if (t != null) {</span></span>
<span class="line"><span>        ServerSocket s = awaitSocket;</span></span>
<span class="line"><span>        if (s != null) {</span></span>
<span class="line"><span>            awaitSocket = null;</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                s.close();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                // Ignored</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        t.interrupt();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            t.join(1000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            // Ignored</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Wait until a proper shutdown command is received, then return.</span></span>
<span class="line"><span>  * This keeps the main thread alive - the thread pool listening for http</span></span>
<span class="line"><span>  * connections is daemon threads.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void await() {</span></span>
<span class="line"><span>    // Negative values - don&#39;t wait on port - tomcat is embedded or we just don&#39;t like ports</span></span>
<span class="line"><span>    if (getPortWithOffset() == -2) {</span></span>
<span class="line"><span>        // undocumented yet - for embedding apps that are around, alive.</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (getPortWithOffset() == -1) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            awaitThread = Thread.currentThread();</span></span>
<span class="line"><span>            while(!stopAwait) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    Thread.sleep( 10000 );</span></span>
<span class="line"><span>                } catch( InterruptedException ex ) {</span></span>
<span class="line"><span>                    // continue and check the flag</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            awaitThread = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Set up a server socket to wait on</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        awaitSocket = new ServerSocket(getPortWithOffset(), 1,</span></span>
<span class="line"><span>                InetAddress.getByName(address));</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        log.error(sm.getString(&quot;standardServer.awaitSocket.fail&quot;, address,</span></span>
<span class="line"><span>                String.valueOf(getPortWithOffset()), String.valueOf(getPort()),</span></span>
<span class="line"><span>                String.valueOf(getPortOffset())), e);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        awaitThread = Thread.currentThread();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Loop waiting for a connection and a valid command</span></span>
<span class="line"><span>        while (!stopAwait) {</span></span>
<span class="line"><span>            ServerSocket serverSocket = awaitSocket;</span></span>
<span class="line"><span>            if (serverSocket == null) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Wait for the next connection</span></span>
<span class="line"><span>            Socket socket = null;</span></span>
<span class="line"><span>            StringBuilder command = new StringBuilder();</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                InputStream stream;</span></span>
<span class="line"><span>                long acceptStartTime = System.currentTimeMillis();</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    socket = serverSocket.accept();</span></span>
<span class="line"><span>                    socket.setSoTimeout(10 * 1000);  // Ten seconds</span></span>
<span class="line"><span>                    stream = socket.getInputStream();</span></span>
<span class="line"><span>                } catch (SocketTimeoutException ste) {</span></span>
<span class="line"><span>                    // This should never happen but bug 56684 suggests that</span></span>
<span class="line"><span>                    // it does.</span></span>
<span class="line"><span>                    log.warn(sm.getString(&quot;standardServer.accept.timeout&quot;,</span></span>
<span class="line"><span>                            Long.valueOf(System.currentTimeMillis() - acceptStartTime)), ste);</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                } catch (AccessControlException ace) {</span></span>
<span class="line"><span>                    log.warn(sm.getString(&quot;standardServer.accept.security&quot;), ace);</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                } catch (IOException e) {</span></span>
<span class="line"><span>                    if (stopAwait) {</span></span>
<span class="line"><span>                        // Wait was aborted with socket.close()</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    log.error(sm.getString(&quot;standardServer.accept.error&quot;), e);</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // Read a set of characters from the socket</span></span>
<span class="line"><span>                int expected = 1024; // Cut off to avoid DoS attack</span></span>
<span class="line"><span>                while (expected &lt; shutdown.length()) {</span></span>
<span class="line"><span>                    if (random == null)</span></span>
<span class="line"><span>                        random = new Random();</span></span>
<span class="line"><span>                    expected += (random.nextInt() % 1024);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                while (expected &gt; 0) {</span></span>
<span class="line"><span>                    int ch = -1;</span></span>
<span class="line"><span>                    try {</span></span>
<span class="line"><span>                        ch = stream.read();</span></span>
<span class="line"><span>                    } catch (IOException e) {</span></span>
<span class="line"><span>                        log.warn(sm.getString(&quot;standardServer.accept.readError&quot;), e);</span></span>
<span class="line"><span>                        ch = -1;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    // Control character or EOF (-1) terminates loop</span></span>
<span class="line"><span>                    if (ch &lt; 32 || ch == 127) {</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    command.append((char) ch);</span></span>
<span class="line"><span>                    expected--;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                // Close the socket now that we are done with it</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    if (socket != null) {</span></span>
<span class="line"><span>                        socket.close();</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } catch (IOException e) {</span></span>
<span class="line"><span>                    // Ignore</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Match against our command string</span></span>
<span class="line"><span>            boolean match = command.toString().equals(shutdown);</span></span>
<span class="line"><span>            if (match) {</span></span>
<span class="line"><span>                log.info(sm.getString(&quot;standardServer.shutdownViaPort&quot;));</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            } else</span></span>
<span class="line"><span>                log.warn(sm.getString(&quot;standardServer.invalidShutdownCommand&quot;, command.toString()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        ServerSocket serverSocket = awaitSocket;</span></span>
<span class="line"><span>        awaitThread = null;</span></span>
<span class="line"><span>        awaitSocket = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Close the server socket and return</span></span>
<span class="line"><span>        if (serverSocket != null) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                serverSocket.close();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                // Ignore</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the specified Service (if it exists); otherwise return</span></span>
<span class="line"><span>  * &lt;code&gt;null&lt;/code&gt;.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param name Name of the Service to be returned</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Service findService(String name) {</span></span>
<span class="line"><span>    if (name == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    synchronized (servicesLock) {</span></span>
<span class="line"><span>        for (Service service : services) {</span></span>
<span class="line"><span>            if (name.equals(service.getName())) {</span></span>
<span class="line"><span>                return service;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the set of Services defined within this Server.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Service[] findServices() {</span></span>
<span class="line"><span>    return services;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the JMX service names.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public ObjectName[] getServiceNames() {</span></span>
<span class="line"><span>    ObjectName onames[]=new ObjectName[ services.length ];</span></span>
<span class="line"><span>    for( int i=0; i&lt;services.length; i++ ) {</span></span>
<span class="line"><span>        onames[i]=((StandardService)services[i]).getObjectName();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return onames;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Remove the specified Service from the set associated from this</span></span>
<span class="line"><span>  * Server.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param service The Service to be removed</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void removeService(Service service) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    synchronized (servicesLock) {</span></span>
<span class="line"><span>        int j = -1;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; services.length; i++) {</span></span>
<span class="line"><span>            if (service == services[i]) {</span></span>
<span class="line"><span>                j = i;</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (j &lt; 0)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            services[j].stop();</span></span>
<span class="line"><span>        } catch (LifecycleException e) {</span></span>
<span class="line"><span>            // Ignore</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int k = 0;</span></span>
<span class="line"><span>        Service results[] = new Service[services.length - 1];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; services.length; i++) {</span></span>
<span class="line"><span>            if (i != j)</span></span>
<span class="line"><span>                results[k++] = services[i];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        services = results;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Report this property change to interested listeners</span></span>
<span class="line"><span>        support.firePropertyChange(&quot;service&quot;, service, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="lifecycle相关模板方法" tabindex="-1">Lifecycle相关模板方法 <a class="header-anchor" href="#lifecycle相关模板方法" aria-label="Permalink to &quot;Lifecycle相关模板方法&quot;">​</a></h3><p>这里只展示startInternal方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Start nested components ({@link Service}s) and implement the requirements</span></span>
<span class="line"><span> * of {@link org.apache.catalina.util.LifecycleBase#startInternal()}.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span> *  that prevents this component from being used</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fireLifecycleEvent(CONFIGURE_START_EVENT, null);</span></span>
<span class="line"><span>    setState(LifecycleState.STARTING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    globalNamingResources.start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start our defined Services</span></span>
<span class="line"><span>    synchronized (servicesLock) {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; services.length; i++) {</span></span>
<span class="line"><span>            services[i].start();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (periodicEventDelay &gt; 0) {</span></span>
<span class="line"><span>        monitorFuture = getUtilityExecutor().scheduleWithFixedDelay(</span></span>
<span class="line"><span>                new Runnable() {</span></span>
<span class="line"><span>                    @Override</span></span>
<span class="line"><span>                    public void run() {</span></span>
<span class="line"><span>                        startPeriodicLifecycleEvent();</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }, 0, 60, TimeUnit.SECONDS);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>protected void startPeriodicLifecycleEvent() {</span></span>
<span class="line"><span>    if (periodicLifecycleEventFuture == null || (periodicLifecycleEventFuture != null &amp;&amp; periodicLifecycleEventFuture.isDone())) {</span></span>
<span class="line"><span>        if (periodicLifecycleEventFuture != null &amp;&amp; periodicLifecycleEventFuture.isDone()) {</span></span>
<span class="line"><span>            // There was an error executing the scheduled task, get it and log it</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                periodicLifecycleEventFuture.get();</span></span>
<span class="line"><span>            } catch (InterruptedException | ExecutionException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;standardServer.periodicEventError&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        periodicLifecycleEventFuture = getUtilityExecutor().scheduleAtFixedRate(</span></span>
<span class="line"><span>                new Runnable() {</span></span>
<span class="line"><span>                    @Override</span></span>
<span class="line"><span>                    public void run() {</span></span>
<span class="line"><span>                        fireLifecycleEvent(Lifecycle.PERIODIC_EVENT, null);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }, periodicEventDelay, periodicEventDelay, TimeUnit.SECONDS);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>方法的第一行代码先触发 CONFIGURE_START_EVENT 事件，以便执行 StandardServer 的 LifecycleListener 监听器，然后调用 setState 方法设置成 LifecycleBase 的 state 属性为 LifecycleState.STARTING。 接着就 globalNamingResources.start()，跟 initInternal 方法其实是类似的。</p><p>再接着就调用 Service 的 start 方法来启动 Service 组件。可以看出，StandardServe 的 startInternal 跟 initInternal 方法类似，都是调用内部的 service 组件的相关方法。</p><p>调用完 service.init 方法后，就使用 getUtilityExecutor() 返回的线程池延迟执行startPeriodicLifecycleEvent 方法，而在 startPeriodicLifecycleEvent 方法里，也是使用 getUtilityExecutor() 方法，定期执行 fireLifecycleEvent 方法，处理 Lifecycle.PERIODIC_EVENT 事件，如果有需要定期处理的，可以再 Server 的 LifecycleListener 里处理 Lifecycle.PERIODIC_EVENT 事件。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://segmentfault.com/a/1190000022016991" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000022016991</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,37)]))}const m=n(i,[["render",t]]);export{v as __pageData,m as default};
