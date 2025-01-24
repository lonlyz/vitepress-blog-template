import{_ as a,c as s,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/tomcat/tomcat-x-executor-1.jpg",l="/vitepress-blog-template/images/tomcat/tomcat-x-executor-2.jpg",x=JSON.parse('{"title":"Tomcat - 线程池的设计与实现：StandardThreadExecutor","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-executor.md","filePath":"framework/tomcat/tomcat-x-executor.md","lastUpdated":1737706346000}'),i={name:"framework/tomcat/tomcat-x-executor.md"};function c(r,n,o,u,d,h){return p(),s("div",null,n[0]||(n[0]=[e(`<h1 id="tomcat-线程池的设计与实现-standardthreadexecutor" tabindex="-1">Tomcat - 线程池的设计与实现：StandardThreadExecutor <a class="header-anchor" href="#tomcat-线程池的设计与实现-standardthreadexecutor" aria-label="Permalink to &quot;Tomcat - 线程池的设计与实现：StandardThreadExecutor&quot;">​</a></h1><blockquote><p>上文中我们研究了下Service的设计和实现，StandardService中包含Executor的调用；这个比较好理解，Tomcat需要并发处理用户的请求，自然而言就想到线程池，那么Tomcat中线程池（Executor）具体是如何实现的？本文带你继续深度解析。@pdai</p></blockquote><h2 id="理解思路" tabindex="-1">理解思路 <a class="header-anchor" href="#理解思路" aria-label="Permalink to &quot;理解思路&quot;">​</a></h2><blockquote><p>我们如下几个方面开始引入线程池的，这里主要从上文Service引入，保持上下文之间的衔接，会很好的构筑你的知识体系。@pdai</p></blockquote><ul><li>上文中我们了解到，Executor是包含在Service中的，Service中关于Executor的配置和相关代码如下：</li></ul><p>server.xml中service里包含Executor的配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;Service name=&quot;Catalina&quot;&gt;</span></span>
<span class="line"><span>&lt;!-- 1. 属性说明</span></span>
<span class="line"><span>	name:Service的名称</span></span>
<span class="line"><span>--&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--2. 一个或多个excecutors --&gt; // 看这里</span></span>
<span class="line"><span>    &lt;!--</span></span>
<span class="line"><span>    &lt;Executor name=&quot;tomcatThreadPool&quot; namePrefix=&quot;catalina-exec-&quot;</span></span>
<span class="line"><span>        maxThreads=&quot;150&quot; minSpareThreads=&quot;4&quot;/&gt;</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>&lt;/Service&gt;</span></span></code></pre></div><p>Service中executors相关方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><ul><li>和Server、Service实现一样，StandardThreadExecutor也是继承LifecycleMBeanBase；然后实现Executor的接口。</li></ul><p><img src="`+t+`" alt="error.图片加载失败"></p><ul><li>Tomcat关于Executor相关的配置文档</li></ul><p><a href="http://tomcat.apache.org/tomcat-9.0-doc/config/executor.html" target="_blank" rel="noreferrer">http://tomcat.apache.org/tomcat-9.0-doc/config/executor.html</a></p><h2 id="准备知识" tabindex="-1">准备知识 <a class="header-anchor" href="#准备知识" aria-label="Permalink to &quot;准备知识&quot;">​</a></h2><blockquote><p>在理解Tomcat的线程池时，需要有一定的基础，这里推荐学习下JDK关于线程池的设计和实现。</p></blockquote><blockquote><p>并发基础</p></blockquote><ul><li><p><a href="https://pdai.tech/md/java/thread/java-thread-x-theorty.html" target="_blank" rel="noreferrer">Java 并发 - 理论基础</a></p><ul><li>多线程的出现是要解决什么问题的?</li><li>线程不安全是指什么? 举例说明</li><li>并发出现线程不安全的本质什么? 可见性，原子性和有序性。</li><li>Java是怎么解决并发问题的? 3个关键字，JMM和8个Happens-Before</li><li>线程安全是不是非真即假? 不是</li><li>线程安全有哪些实现思路?</li><li>如何理解并发和并行的区别?</li></ul></li><li><p><a href="https://pdai.tech/md/java/thread/java-thread-x-thread-basic.html" target="_blank" rel="noreferrer">Java 并发 - 线程基础</a></p><ul><li>线程有哪几种状态? 分别说明从一种状态到另一种状态转变有哪些方式?</li><li>通常线程有哪几种使用方式?</li><li>基础线程机制有哪些?</li><li>线程的中断方式有哪些?</li><li>线程的互斥同步方式有哪些? 如何比较和选择?</li><li>线程之间有哪些协作方式?</li></ul></li></ul><blockquote><p>JUC BlockingQueue 和 ThreadPoolExecutor</p></blockquote><ul><li><p><a href="https://pdai.tech/md/java/thread/java-thread-x-juc-collection-BlockingQueue.html" target="_blank" rel="noreferrer">JUC集合: BlockingQueue详解</a></p><ul><li>什么是BlockingDeque?</li><li>BlockingQueue大家族有哪些? ArrayBlockingQueue, DelayQueue, LinkedBlockingQueue, SynchronousQueue...</li><li>BlockingQueue适合用在什么样的场景?</li><li>BlockingQueue常用的方法?</li><li>BlockingQueue插入方法有哪些? 这些方法(<code>add(o)</code>,<code>offer(o)</code>,<code>put(o)</code>,<code>offer(o, timeout, timeunit)</code>)的区别是什么?</li><li>BlockingDeque 与BlockingQueue有何关系，请对比下它们的方法?</li><li>BlockingDeque适合用在什么样的场景?</li><li>BlockingDeque大家族有哪些?</li><li>BlockingDeque 与BlockingQueue实现例子?</li></ul></li><li><p><a href="https://pdai.tech/md/java/thread/java-thread-x-juc-executor-ThreadPoolExecutor.html" target="_blank" rel="noreferrer">JUC线程池: ThreadPoolExecutor详解</a></p><ul><li>为什么要有线程池?</li><li>Java是实现和管理线程池有哪些方式? 请简单举例如何使用。</li><li>为什么很多公司不允许使用Executors去创建线程池? 那么推荐怎么使用呢?</li><li>ThreadPoolExecutor有哪些核心的配置参数? 请简要说明</li><li>ThreadPoolExecutor可以创建哪是哪三种线程池呢?</li><li>当队列满了并且worker的数量达到maxSize的时候，会怎么样?</li><li>说说ThreadPoolExecutor有哪些RejectedExecutionHandler策略? 默认是什么策略?</li><li>简要说下线程池的任务执行机制? execute –&gt; addWorker –&gt;runworker (getTask)</li><li>线程池中任务是如何提交的?</li><li>线程池中任务是如何关闭的?</li><li>在配置线程池的时候需要考虑哪些配置因素?</li><li>如何监控线程池的状态?</li></ul></li></ul><h2 id="executor接口设计" tabindex="-1">Executor接口设计 <a class="header-anchor" href="#executor接口设计" aria-label="Permalink to &quot;Executor接口设计&quot;">​</a></h2><blockquote><p>Executor的设计很简单，在理解的时候需要理解两点：</p></blockquote><ul><li>1.Tomcat希望将Executor也纳入Lifecycle<strong>生命周期管理</strong>，所以让它实现了Lifecycle接口</li><li>2.<strong>引入超时机制</strong>：也就是说当work queue满时，会等待指定的时间，如果超时将抛出RejectedExecutionException，所以这里增加了一个<code>void execute(Runnable command, long timeout, TimeUnit unit)</code>方法; 其实本质上，它构造了JUC中ThreadPoolExecutor，通过它调用ThreadPoolExecutor的<code>void execute(Runnable command, long timeout, TimeUnit unit)</code>方法。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Executor extends java.util.concurrent.Executor, Lifecycle {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Executes the given command at some time in the future.  The command</span></span>
<span class="line"><span>     * may execute in a new thread, in a pooled thread, or in the calling</span></span>
<span class="line"><span>     * thread, at the discretion of the &lt;code&gt;Executor&lt;/code&gt; implementation.</span></span>
<span class="line"><span>     * If no threads are available, it will be added to the work queue.</span></span>
<span class="line"><span>     * If the work queue is full, the system will wait for the specified</span></span>
<span class="line"><span>     * time until it throws a RejectedExecutionException</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param command the runnable task</span></span>
<span class="line"><span>     * @param timeout the length of time to wait for the task to complete</span></span>
<span class="line"><span>     * @param unit    the units in which timeout is expressed</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @throws java.util.concurrent.RejectedExecutionException if this task</span></span>
<span class="line"><span>     * cannot be accepted for execution - the queue is full</span></span>
<span class="line"><span>     * @throws NullPointerException if command or unit is null</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    void execute(Runnable command, long timeout, TimeUnit unit);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>找到Executor的实现类</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h2 id="standardthreadexecutor的实现" tabindex="-1">StandardThreadExecutor的实现 <a class="header-anchor" href="#standardthreadexecutor的实现" aria-label="Permalink to &quot;StandardThreadExecutor的实现&quot;">​</a></h2><blockquote><p>接下来我们看下具体的实现类StandardThreadExecutor。</p></blockquote><h3 id="理解相关配置参数" tabindex="-1">理解相关配置参数 <a class="header-anchor" href="#理解相关配置参数" aria-label="Permalink to &quot;理解相关配置参数&quot;">​</a></h3><p><a href="http://tomcat.apache.org/tomcat-9.0-doc/config/executor.html" target="_blank" rel="noreferrer">Executor官方配置说明文档在新窗口打开</a></p><ul><li>公共属性</li></ul><p>Executor的所有实现都 支持以下属性：</p><table tabindex="0"><thead><tr><th>属性</th><th>描述</th></tr></thead><tbody><tr><td>className</td><td>实现的类。实现必须实现 org.apache.catalina.Executor接口。此接口确保可以通过其name属性引用对象并实现Lifecycle，以便可以使用容器启动和停止对象。className的默认值是org.apache.catalina.core.StandardThreadExecutor</td></tr><tr><td>name</td><td>用于在server.xml中的其他位置引用此池的名称。该名称是必需的，必须是唯一的。</td></tr></tbody></table><ul><li><strong>StandardThreadExecutor属性</strong></li></ul><p>默认实现支持以下属性：</p><table tabindex="0"><thead><tr><th>属性</th><th>描述</th></tr></thead><tbody><tr><td>threadPriority</td><td>（int）执行程序中线程的线程优先级，默认为 5（Thread.NORM_PRIORITY常量的值）</td></tr><tr><td>daemon</td><td>（boolean）线程是否应该是守护程序线程，默认为 true</td></tr><tr><td>namePrefix</td><td>（字符串）执行程序创建的每个线程的名称前缀。单个线程的线程名称将是namePrefix+threadNumber</td></tr><tr><td>maxThreads</td><td>（int）此池中活动线程的最大数量，默认为 200</td></tr><tr><td>minSpareThreads</td><td>（int）最小线程数（空闲和活动）始终保持活动状态，默认为 25</td></tr><tr><td>maxIdleTime</td><td>（int）空闲线程关闭之前的毫秒数，除非活动线程数小于或等于minSpareThreads。默认值为60000（1分钟）</td></tr><tr><td>maxQueueSize</td><td>（int）在我们拒绝之前可以排队等待执行的可运行任务的最大数量。默认值是Integer.MAX_VALUE</td></tr><tr><td>prestartminSpareThreads</td><td>（boolean）是否应该在启动Executor时启动minSpareThreads，默认值为 false</td></tr><tr><td>threadRenewalDelay</td><td>（long）如果配置了ThreadLocalLeakPreventionListener，它将通知此执行程序有关已停止的上下文。上下文停止后，池中的线程将被更新。为避免同时更新所有线程，此选项在任意2个线程的续订之间设置延迟。该值以ms为单位，默认值为1000ms。如果值为负，则不会续订线程。</td></tr></tbody></table><h3 id="lifecycle模板方法" tabindex="-1">Lifecycle模板方法 <a class="header-anchor" href="#lifecycle模板方法" aria-label="Permalink to &quot;Lifecycle模板方法&quot;">​</a></h3><p>先看核心变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 任务队列</span></span>
<span class="line"><span>private TaskQueue taskqueue = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 包装了一个ThreadPoolExecutor</span></span>
<span class="line"><span>protected ThreadPoolExecutor executor = null;</span></span></code></pre></div><ul><li><strong>initInternal</strong>和<strong>destroyInternal</strong>默认父类实现</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void initInternal() throws LifecycleException {</span></span>
<span class="line"><span>    super.initInternal();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void destroyInternal() throws LifecycleException {</span></span>
<span class="line"><span>    super.destroyInternal();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>startInternal方法</strong></li></ul><p>这个方法中，我们不难看出，就是初始化taskqueue，同时构造ThreadPoolExecutor的实例，后面Tomcat的StandardThreadExecutor的实现本质上通过ThreadPoolExecutor实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Start the component and implement the requirements</span></span>
<span class="line"><span>  * of {@link org.apache.catalina.util.LifecycleBase#startInternal()}.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>  *  that prevents this component from being used</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    taskqueue = new TaskQueue(maxQueueSize);</span></span>
<span class="line"><span>    TaskThreadFactory tf = new TaskThreadFactory(namePrefix,daemon,getThreadPriority());</span></span>
<span class="line"><span>    executor = new ThreadPoolExecutor(getMinSpareThreads(), getMaxThreads(), maxIdleTime, TimeUnit.MILLISECONDS,taskqueue, tf);</span></span>
<span class="line"><span>    executor.setThreadRenewalDelay(threadRenewalDelay);</span></span>
<span class="line"><span>    if (prestartminSpareThreads) {</span></span>
<span class="line"><span>        executor.prestartAllCoreThreads();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    taskqueue.setParent(executor);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setState(LifecycleState.STARTING);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>stopInternal方法</strong></li></ul><p>代码很简单，关闭线程池后置null, 方便GC回收。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Stop the component and implement the requirements</span></span>
<span class="line"><span>  * of {@link org.apache.catalina.util.LifecycleBase#stopInternal()}.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>  *  that needs to be reported</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void stopInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setState(LifecycleState.STOPPING);</span></span>
<span class="line"><span>    if (executor != null) {</span></span>
<span class="line"><span>        executor.shutdownNow();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    executor = null;</span></span>
<span class="line"><span>    taskqueue = null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="核心executor方法" tabindex="-1">核心executor方法 <a class="header-anchor" href="#核心executor方法" aria-label="Permalink to &quot;核心executor方法&quot;">​</a></h3><p>本质上就是调用ThreadPoolExecutor的实例的相关方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void execute(Runnable command, long timeout, TimeUnit unit) {</span></span>
<span class="line"><span>    if (executor != null) {</span></span>
<span class="line"><span>        executor.execute(command,timeout,unit);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        throw new IllegalStateException(sm.getString(&quot;standardThreadExecutor.notStarted&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void execute(Runnable command) {</span></span>
<span class="line"><span>    if (executor != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            executor.execute(command);</span></span>
<span class="line"><span>        } catch (RejectedExecutionException rx) {</span></span>
<span class="line"><span>            //there could have been contention around the queue</span></span>
<span class="line"><span>            if (!((TaskQueue) executor.getQueue()).force(command)) {</span></span>
<span class="line"><span>                throw new RejectedExecutionException(sm.getString(&quot;standardThreadExecutor.queueFull&quot;));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        throw new IllegalStateException(sm.getString(&quot;standardThreadExecutor.notStarted&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="动态调整线程池" tabindex="-1">动态调整线程池 <a class="header-anchor" href="#动态调整线程池" aria-label="Permalink to &quot;动态调整线程池&quot;">​</a></h3><p>我们还注意到StandardThreadExecutor还实现了ResizeableExecutor，从名称上我们就可知道它是希望实现对线程池的动态调整，所以呢，它封装了一个ResizeableExecutor的接口，看下接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ResizableExecutor extends Executor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the current number of threads in the pool.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the number of threads</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public int getPoolSize();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getMaxThreads();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Returns the approximate number of threads that are actively executing</span></span>
<span class="line"><span>     * tasks.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return the number of threads</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public int getActiveCount();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean resizePool(int corePoolSize, int maximumPoolSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean resizeQueue(int capacity);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>前三个方法比较简单，我们看下后两个方法是如何实现的, 其实也很简单。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public boolean resizePool(int corePoolSize, int maximumPoolSize) {</span></span>
<span class="line"><span>    if (executor == null)</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    executor.setCorePoolSize(corePoolSize);</span></span>
<span class="line"><span>    executor.setMaximumPoolSize(maximumPoolSize);</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 默认没有实现</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public boolean resizeQueue(int capacity) {</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="补充taskqueue" tabindex="-1">补充TaskQueue <a class="header-anchor" href="#补充taskqueue" aria-label="Permalink to &quot;补充TaskQueue&quot;">​</a></h3><p>我们知道工作队列是有TaskQueue保障的，它集成自LinkedBlockingQueue（一个阻塞的链表队列），来看下源代码吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * As task queue specifically designed to run with a thread pool executor. The</span></span>
<span class="line"><span> * task queue is optimised to properly utilize threads within a thread pool</span></span>
<span class="line"><span> * executor. If you use a normal queue, the executor will spawn threads when</span></span>
<span class="line"><span> * there are idle threads and you wont be able to force items onto the queue</span></span>
<span class="line"><span> * itself.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class TaskQueue extends LinkedBlockingQueue&lt;Runnable&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span>    protected static final StringManager sm = StringManager</span></span>
<span class="line"><span>            .getManager(&quot;org.apache.tomcat.util.threads.res&quot;);</span></span>
<span class="line"><span>    private static final int DEFAULT_FORCED_REMAINING_CAPACITY = -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private transient volatile ThreadPoolExecutor parent = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // No need to be volatile. This is written and read in a single thread</span></span>
<span class="line"><span>    // (when stopping a context and firing the listeners)</span></span>
<span class="line"><span>    private int forcedRemainingCapacity = -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public TaskQueue() {</span></span>
<span class="line"><span>        super();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public TaskQueue(int capacity) {</span></span>
<span class="line"><span>        super(capacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public TaskQueue(Collection&lt;? extends Runnable&gt; c) {</span></span>
<span class="line"><span>        super(c);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setParent(ThreadPoolExecutor tp) {</span></span>
<span class="line"><span>        parent = tp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean force(Runnable o) {</span></span>
<span class="line"><span>        if (parent == null || parent.isShutdown()) throw new RejectedExecutionException(sm.getString(&quot;taskQueue.notRunning&quot;));</span></span>
<span class="line"><span>        return super.offer(o); //forces the item onto the queue, to be used if the task is rejected</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean force(Runnable o, long timeout, TimeUnit unit) throws InterruptedException {</span></span>
<span class="line"><span>        if (parent == null || parent.isShutdown()) throw new RejectedExecutionException(sm.getString(&quot;taskQueue.notRunning&quot;));</span></span>
<span class="line"><span>        return super.offer(o,timeout,unit); //forces the item onto the queue, to be used if the task is rejected</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean offer(Runnable o) {</span></span>
<span class="line"><span>      //we can&#39;t do any checks</span></span>
<span class="line"><span>        if (parent==null) return super.offer(o);</span></span>
<span class="line"><span>        //we are maxed out on threads, simply queue the object</span></span>
<span class="line"><span>        if (parent.getPoolSize() == parent.getMaximumPoolSize()) return super.offer(o);</span></span>
<span class="line"><span>        //we have idle threads, just add it to the queue</span></span>
<span class="line"><span>        if (parent.getSubmittedCount()&lt;=(parent.getPoolSize())) return super.offer(o);</span></span>
<span class="line"><span>        //if we have less threads than maximum force creation of a new thread</span></span>
<span class="line"><span>        if (parent.getPoolSize()&lt;parent.getMaximumPoolSize()) return false;</span></span>
<span class="line"><span>        //if we reached here, we need to add it to the queue</span></span>
<span class="line"><span>        return super.offer(o);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Runnable poll(long timeout, TimeUnit unit)</span></span>
<span class="line"><span>            throws InterruptedException {</span></span>
<span class="line"><span>        Runnable runnable = super.poll(timeout, unit);</span></span>
<span class="line"><span>        if (runnable == null &amp;&amp; parent != null) {</span></span>
<span class="line"><span>            // the poll timed out, it gives an opportunity to stop the current</span></span>
<span class="line"><span>            // thread if needed to avoid memory leaks.</span></span>
<span class="line"><span>            parent.stopCurrentThreadIfNeeded();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return runnable;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Runnable take() throws InterruptedException {</span></span>
<span class="line"><span>        if (parent != null &amp;&amp; parent.currentThreadShouldBeStopped()) {</span></span>
<span class="line"><span>            return poll(parent.getKeepAliveTime(TimeUnit.MILLISECONDS),</span></span>
<span class="line"><span>                    TimeUnit.MILLISECONDS);</span></span>
<span class="line"><span>            // yes, this may return null (in case of timeout) which normally</span></span>
<span class="line"><span>            // does not occur with take()</span></span>
<span class="line"><span>            // but the ThreadPoolExecutor implementation allows this</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return super.take();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int remainingCapacity() {</span></span>
<span class="line"><span>        if (forcedRemainingCapacity &gt; DEFAULT_FORCED_REMAINING_CAPACITY) {</span></span>
<span class="line"><span>            // ThreadPoolExecutor.setCorePoolSize checks that</span></span>
<span class="line"><span>            // remainingCapacity==0 to allow to interrupt idle threads</span></span>
<span class="line"><span>            // I don&#39;t see why, but this hack allows to conform to this</span></span>
<span class="line"><span>            // &quot;requirement&quot;</span></span>
<span class="line"><span>            return forcedRemainingCapacity;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return super.remainingCapacity();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setForcedRemainingCapacity(int forcedRemainingCapacity) {</span></span>
<span class="line"><span>        this.forcedRemainingCapacity = forcedRemainingCapacity;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void resetForcedRemainingCapacity() {</span></span>
<span class="line"><span>        this.forcedRemainingCapacity = DEFAULT_FORCED_REMAINING_CAPACITY;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>TaskQueue这个任务队列是专门为线程池而设计的。优化任务队列以适当地利用线程池执行器内的线程。</p><p>如果你使用一个普通的队列，当有空闲线程executor将产生线程并且你不能强制将任务添加到队列。</p><h3 id="为什么不是直接使用threadpoolexecutor" tabindex="-1">为什么不是直接使用ThreadPoolExecutor <a class="header-anchor" href="#为什么不是直接使用threadpoolexecutor" aria-label="Permalink to &quot;为什么不是直接使用ThreadPoolExecutor&quot;">​</a></h3><p>这里你是否考虑过一个问题，为什么Tomcat会自己构造一个StandardThreadExecutor而不是直接使用ThreadPoolExecutor？</p><p>从上面的代码，你会发现这里只是使用executor只是使用了execute的两个主要方法，它希望让调用层屏蔽掉ThreadPoolExecutor的其它方法：</p><ul><li><p>它体现的原则：<strong>最少知识原则</strong>: 只和你的密友谈话。也就是说客户对象所需要交互的对象应当尽可能少</p></li><li><p>它体现的设计模式：<a href="https://pdai.tech/md/dev-spec/pattern/8_facade.html" target="_blank" rel="noreferrer">结构型 - 外观(Facade)</a></p><ul><li>外观模式(Facade pattern)，它提供了一个统一的接口，用来访问子系统中的一群接口，从而让子系统更容易使用</li></ul></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,64)]))}const g=a(i,[["render",c]]);export{x as __pageData,g as default};
