import{_ as n,a,b as e}from"./chunks/tomcat-x-lifecycle-3.DSSrfTXI.js";import{_ as p,c as l,ai as i,o as t}from"./chunks/framework.BrYByd3F.js";const c="/vitepress-blog-template/images/tomcat/tomcat-x-lifecycle-5.png",o="/vitepress-blog-template/images/tomcat/tomcat-x-lifecycle-4.jpeg",g=JSON.parse('{"title":"Tomcat - 组件生命周期管理:LifeCycle","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-lifecycle.md","filePath":"framework/tomcat/tomcat-x-lifecycle.md","lastUpdated":1737706346000}'),r={name:"framework/tomcat/tomcat-x-lifecycle.md"};function f(d,s,y,u,h,E){return t(),l("div",null,s[0]||(s[0]=[i('<h1 id="tomcat-组件生命周期管理-lifecycle" tabindex="-1">Tomcat - 组件生命周期管理:LifeCycle <a class="header-anchor" href="#tomcat-组件生命周期管理-lifecycle" aria-label="Permalink to &quot;Tomcat - 组件生命周期管理:LifeCycle&quot;">​</a></h1><blockquote><p>上文中，我们已经知道Catalina初始化了Server（它调用了 Server 类的 init 和 start 方法来启动 Tomcat）；你会发现Server是Tomcat的配置文件server.xml的顶层元素，那这个阶段其实我们已经进入到Tomcat内部组件的详解；这时候有一个问题，这么多组件是如何管理它的生命周期的呢？@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>我从以下几方面，帮助你构建基于上下文的知识体系和理解为什么要理解组件的生命周期管理（LifeCycle)。@pdai</p></blockquote><ul><li>Server及其它组件</li></ul><p><img src="'+n+'" alt="error.图片加载失败"></p><ul><li>Server后续组件生命周期及初始化</li></ul><p><img src="'+a+'" alt="error.图片加载失败"></p><ul><li>Server的依赖结构</li></ul><p><img src="'+e+`" alt="error.图片加载失败"></p><h2 id="lifecycle接口" tabindex="-1">LifeCycle接口 <a class="header-anchor" href="#lifecycle接口" aria-label="Permalink to &quot;LifeCycle接口&quot;">​</a></h2><blockquote><p>理解Lifecycle主要有两点：第一是三类接口方法；第二是状态机。@pdai</p></blockquote><h3 id="一个标准的lifecycle有哪些方法" tabindex="-1">一个标准的LifeCycle有哪些方法？ <a class="header-anchor" href="#一个标准的lifecycle有哪些方法" aria-label="Permalink to &quot;一个标准的LifeCycle有哪些方法？&quot;">​</a></h3><p>分三类去看：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Lifecycle {</span></span>
<span class="line"><span>    /** 第1类：针对监听器 **/</span></span>
<span class="line"><span>    // 添加监听器</span></span>
<span class="line"><span>    public void addLifecycleListener(LifecycleListener listener);</span></span>
<span class="line"><span>    // 获取所以监听器</span></span>
<span class="line"><span>    public LifecycleListener[] findLifecycleListeners();</span></span>
<span class="line"><span>    // 移除某个监听器</span></span>
<span class="line"><span>    public void removeLifecycleListener(LifecycleListener listener);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /** 第2类：针对控制流程 **/</span></span>
<span class="line"><span>    // 初始化方法</span></span>
<span class="line"><span>    public void init() throws LifecycleException;</span></span>
<span class="line"><span>    // 启动方法</span></span>
<span class="line"><span>    public void start() throws LifecycleException;</span></span>
<span class="line"><span>    // 停止方法，和start对应</span></span>
<span class="line"><span>    public void stop() throws LifecycleException;</span></span>
<span class="line"><span>    // 销毁方法，和init对应</span></span>
<span class="line"><span>    public void destroy() throws LifecycleException;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /** 第3类：针对状态 **/</span></span>
<span class="line"><span>    // 获取生命周期状态</span></span>
<span class="line"><span>    public LifecycleState getState();</span></span>
<span class="line"><span>    // 获取字符串类型的生命周期状态</span></span>
<span class="line"><span>    public String getStateName();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="lifecycle状态机有哪些状态" tabindex="-1">LifeCycle状态机有哪些状态？ <a class="header-anchor" href="#lifecycle状态机有哪些状态" aria-label="Permalink to &quot;LifeCycle状态机有哪些状态？&quot;">​</a></h3><p>Tomcat 给各个组件定义了一些生命周期中的状态</p><ul><li>在枚举类 LifecycleState 里</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum LifecycleState {</span></span>
<span class="line"><span>    NEW(false, null),</span></span>
<span class="line"><span>    INITIALIZING(false, Lifecycle.BEFORE_INIT_EVENT),</span></span>
<span class="line"><span>    INITIALIZED(false, Lifecycle.AFTER_INIT_EVENT),</span></span>
<span class="line"><span>    STARTING_PREP(false, Lifecycle.BEFORE_START_EVENT),</span></span>
<span class="line"><span>    STARTING(true, Lifecycle.START_EVENT),</span></span>
<span class="line"><span>    STARTED(true, Lifecycle.AFTER_START_EVENT),</span></span>
<span class="line"><span>    STOPPING_PREP(true, Lifecycle.BEFORE_STOP_EVENT),</span></span>
<span class="line"><span>    STOPPING(false, Lifecycle.STOP_EVENT),</span></span>
<span class="line"><span>    STOPPED(false, Lifecycle.AFTER_STOP_EVENT),</span></span>
<span class="line"><span>    DESTROYING(false, Lifecycle.BEFORE_DESTROY_EVENT),</span></span>
<span class="line"><span>    DESTROYED(false, Lifecycle.AFTER_DESTROY_EVENT),</span></span>
<span class="line"><span>    FAILED(false, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final boolean available;</span></span>
<span class="line"><span>    private final String lifecycleEvent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private LifecycleState(boolean available, String lifecycleEvent) {</span></span>
<span class="line"><span>        this.available = available;</span></span>
<span class="line"><span>        this.lifecycleEvent = lifecycleEvent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ……</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>它们之间的关系是怎么样的呢？</li></ul><p>在Lifecycle.java源码中有相关的注释：</p><p><img src="`+c+'" alt="error.图片加载失败"></p><p>看不太清楚的可以看下图：</p><p><img src="'+o+`" alt="error.图片加载失败"></p><h2 id="lifecyclebase-lifecycle的基本实现" tabindex="-1">LifecycleBase - LifeCycle的基本实现 <a class="header-anchor" href="#lifecyclebase-lifecycle的基本实现" aria-label="Permalink to &quot;LifecycleBase - LifeCycle的基本实现&quot;">​</a></h2><blockquote><p>LifecycleBase是Lifecycle的基本实现。</p></blockquote><h3 id="监听器相关" tabindex="-1">监听器相关 <a class="header-anchor" href="#监听器相关" aria-label="Permalink to &quot;监听器相关&quot;">​</a></h3><p>生命周期监听器保存在一个线程安全的<strong>CopyOnWriteArrayList</strong>中。所以add和remove都是直接调用此List的相应方法。 findLifecycleListeners返回的是一个数组，为了线程安全，所以这儿会生成一个新数组。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final List&lt;LifecycleListener&gt; lifecycleListeners = new CopyOnWriteArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void addLifecycleListener(LifecycleListener listener) {</span></span>
<span class="line"><span>    lifecycleListeners.add(listener);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public LifecycleListener[] findLifecycleListeners() {</span></span>
<span class="line"><span>    return lifecycleListeners.toArray(new LifecycleListener[0]);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void removeLifecycleListener(LifecycleListener listener) {</span></span>
<span class="line"><span>    lifecycleListeners.remove(listener);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="生命周期相关" tabindex="-1">生命周期相关 <a class="header-anchor" href="#生命周期相关" aria-label="Permalink to &quot;生命周期相关&quot;">​</a></h3><ul><li>init</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public final synchronized void init() throws LifecycleException {</span></span>
<span class="line"><span>    // 非NEW状态，不允许调用init()方法</span></span>
<span class="line"><span>    if (!state.equals(LifecycleState.NEW)) {</span></span>
<span class="line"><span>        invalidTransition(Lifecycle.BEFORE_INIT_EVENT);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 初始化逻辑之前，先将状态变更为\`INITIALIZING\`</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.INITIALIZING, null, false);</span></span>
<span class="line"><span>        // 初始化，该方法为一个abstract方法，需要组件自行实现</span></span>
<span class="line"><span>        initInternal();</span></span>
<span class="line"><span>        // 初始化完成之后，状态变更为\`INITIALIZED\`</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.INITIALIZED, null, false);</span></span>
<span class="line"><span>    } catch (Throwable t) {</span></span>
<span class="line"><span>        // 初始化的过程中，可能会有异常抛出，这时需要捕获异常，并将状态变更为\`FAILED\`</span></span>
<span class="line"><span>        ExceptionUtils.handleThrowable(t);</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.FAILED, null, false);</span></span>
<span class="line"><span>        throw new LifecycleException(</span></span>
<span class="line"><span>                sm.getString(&quot;lifecycleBase.initFail&quot;,toString()), t);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再来看看invalidTransition方法，该方法直接抛出异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void invalidTransition(String type) throws LifecycleException {</span></span>
<span class="line"><span>    String msg = sm.getString(&quot;lifecycleBase.invalidTransition&quot;, type,</span></span>
<span class="line"><span>            toString(), state);</span></span>
<span class="line"><span>    throw new LifecycleException(msg);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>setStateInternal方法用于维护状态，同时在状态转换成功之后触发事件。为了状态的可见性，所以state声明为volatile类型的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private volatile LifecycleState state = LifecycleState.NEW;。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private synchronized void setStateInternal(LifecycleState state,</span></span>
<span class="line"><span>        Object data, boolean check) throws LifecycleException {</span></span>
<span class="line"><span>    if (log.isDebugEnabled()) {</span></span>
<span class="line"><span>        log.debug(sm.getString(&quot;lifecycleBase.setState&quot;, this, state));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 是否校验状态</span></span>
<span class="line"><span>    if (check) {</span></span>
<span class="line"><span>        // Must have been triggered by one of the abstract methods (assume</span></span>
<span class="line"><span>        // code in this class is correct)</span></span>
<span class="line"><span>        // null is never a valid state</span></span>
<span class="line"><span>        // state不允许为null</span></span>
<span class="line"><span>        if (state == null) {</span></span>
<span class="line"><span>            invalidTransition(&quot;null&quot;);</span></span>
<span class="line"><span>            // Unreachable code - here to stop eclipse complaining about</span></span>
<span class="line"><span>            // a possible NPE further down the method</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Any method can transition to failed</span></span>
<span class="line"><span>        // startInternal() permits STARTING_PREP to STARTING</span></span>
<span class="line"><span>        // stopInternal() permits STOPPING_PREP to STOPPING and FAILED to</span></span>
<span class="line"><span>        // STOPPING</span></span>
<span class="line"><span>        if (!(state == LifecycleState.FAILED ||</span></span>
<span class="line"><span>                (this.state == LifecycleState.STARTING_PREP &amp;&amp;</span></span>
<span class="line"><span>                        state == LifecycleState.STARTING) ||</span></span>
<span class="line"><span>                (this.state == LifecycleState.STOPPING_PREP &amp;&amp;</span></span>
<span class="line"><span>                        state == LifecycleState.STOPPING) ||</span></span>
<span class="line"><span>                (this.state == LifecycleState.FAILED &amp;&amp;</span></span>
<span class="line"><span>                        state == LifecycleState.STOPPING))) {</span></span>
<span class="line"><span>            // No other transition permitted</span></span>
<span class="line"><span>            invalidTransition(state.name());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置状态</span></span>
<span class="line"><span>    this.state = state;</span></span>
<span class="line"><span>    // 触发事件</span></span>
<span class="line"><span>    String lifecycleEvent = state.getLifecycleEvent();</span></span>
<span class="line"><span>    if (lifecycleEvent != null) {</span></span>
<span class="line"><span>        fireLifecycleEvent(lifecycleEvent, data);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>设置完 state 的状态之后，就触发该状态的事件了，通知事件监听器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * The list of registered LifecycleListeners for event notifications.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private final List&lt;LifecycleListener&gt; lifecycleListeners = new CopyOnWriteArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected void fireLifecycleEvent(String type, Object data) {</span></span>
<span class="line"><span>    LifecycleEvent event = new LifecycleEvent(this, type, data);</span></span>
<span class="line"><span>    for (LifecycleListener listener : lifecycleListeners) {</span></span>
<span class="line"><span>        listener.lifecycleEvent(event);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的 LifecycleListener 对象是在 Catalina 对象解析 server.xml 文件时就已经创建好并加到 lifecycleListeners 里的。这个不是特别重要就不细讲了。</p><ul><li>start</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public final synchronized void start() throws LifecycleException {</span></span>
<span class="line"><span>    // \`STARTING_PREP\`、\`STARTING\`和\`STARTED时，将忽略start()逻辑</span></span>
<span class="line"><span>    if (LifecycleState.STARTING_PREP.equals(state) || LifecycleState.STARTING.equals(state) ||</span></span>
<span class="line"><span>            LifecycleState.STARTED.equals(state)) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (log.isDebugEnabled()) {</span></span>
<span class="line"><span>            Exception e = new LifecycleException();</span></span>
<span class="line"><span>            log.debug(sm.getString(&quot;lifecycleBase.alreadyStarted&quot;, toString()), e);</span></span>
<span class="line"><span>        } else if (log.isInfoEnabled()) {</span></span>
<span class="line"><span>            log.info(sm.getString(&quot;lifecycleBase.alreadyStarted&quot;, toString()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // \`NEW\`状态时，执行init()方法</span></span>
<span class="line"><span>    if (state.equals(LifecycleState.NEW)) {</span></span>
<span class="line"><span>        init();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // \`FAILED\`状态时，执行stop()方法</span></span>
<span class="line"><span>    else if (state.equals(LifecycleState.FAILED)) {</span></span>
<span class="line"><span>        stop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 不是\`INITIALIZED\`和\`STOPPED\`时，则说明是非法的操作</span></span>
<span class="line"><span>    else if (!state.equals(LifecycleState.INITIALIZED) &amp;&amp;</span></span>
<span class="line"><span>            !state.equals(LifecycleState.STOPPED)) {</span></span>
<span class="line"><span>        invalidTransition(Lifecycle.BEFORE_START_EVENT);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // start前的状态设置</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.STARTING_PREP, null, false);</span></span>
<span class="line"><span>        // start逻辑，抽象方法，由组件自行实现</span></span>
<span class="line"><span>        startInternal();</span></span>
<span class="line"><span>        // start过程中，可能因为某些原因失败，这时需要stop操作</span></span>
<span class="line"><span>        if (state.equals(LifecycleState.FAILED)) {</span></span>
<span class="line"><span>            // This is a &#39;controlled&#39; failure. The component put itself into the</span></span>
<span class="line"><span>            // FAILED state so call stop() to complete the clean-up.</span></span>
<span class="line"><span>            stop();</span></span>
<span class="line"><span>        } else if (!state.equals(LifecycleState.STARTING)) {</span></span>
<span class="line"><span>            // Shouldn&#39;t be necessary but acts as a check that sub-classes are</span></span>
<span class="line"><span>            // doing what they are supposed to.</span></span>
<span class="line"><span>            invalidTransition(Lifecycle.AFTER_START_EVENT);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // 设置状态为STARTED</span></span>
<span class="line"><span>            setStateInternal(LifecycleState.STARTED, null, false);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Throwable t) {</span></span>
<span class="line"><span>        // This is an &#39;uncontrolled&#39; failure so put the component into the</span></span>
<span class="line"><span>        // FAILED state and throw an exception.</span></span>
<span class="line"><span>        ExceptionUtils.handleThrowable(t);</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.FAILED, null, false);</span></span>
<span class="line"><span>        throw new LifecycleException(sm.getString(&quot;lifecycleBase.startFail&quot;, toString()), t);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>stop</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public final synchronized void stop() throws LifecycleException {</span></span>
<span class="line"><span>    // \`STOPPING_PREP\`、\`STOPPING\`和STOPPED时，将忽略stop()的执行</span></span>
<span class="line"><span>    if (LifecycleState.STOPPING_PREP.equals(state) || LifecycleState.STOPPING.equals(state) ||</span></span>
<span class="line"><span>            LifecycleState.STOPPED.equals(state)) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (log.isDebugEnabled()) {</span></span>
<span class="line"><span>            Exception e = new LifecycleException();</span></span>
<span class="line"><span>            log.debug(sm.getString(&quot;lifecycleBase.alreadyStopped&quot;, toString()), e);</span></span>
<span class="line"><span>        } else if (log.isInfoEnabled()) {</span></span>
<span class="line"><span>            log.info(sm.getString(&quot;lifecycleBase.alreadyStopped&quot;, toString()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // \`NEW\`状态时，直接将状态变更为\`STOPPED\`</span></span>
<span class="line"><span>    if (state.equals(LifecycleState.NEW)) {</span></span>
<span class="line"><span>        state = LifecycleState.STOPPED;</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // stop()的执行，必须要是\`STARTED\`和\`FAILED\`</span></span>
<span class="line"><span>    if (!state.equals(LifecycleState.STARTED) &amp;&amp; !state.equals(LifecycleState.FAILED)) {</span></span>
<span class="line"><span>        invalidTransition(Lifecycle.BEFORE_STOP_EVENT);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // \`FAILED\`时，直接触发BEFORE_STOP_EVENT事件</span></span>
<span class="line"><span>        if (state.equals(LifecycleState.FAILED)) {</span></span>
<span class="line"><span>            // Don&#39;t transition to STOPPING_PREP as that would briefly mark the</span></span>
<span class="line"><span>            // component as available but do ensure the BEFORE_STOP_EVENT is</span></span>
<span class="line"><span>            // fired</span></span>
<span class="line"><span>            fireLifecycleEvent(BEFORE_STOP_EVENT, null);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            // 设置状态为STOPPING_PREP</span></span>
<span class="line"><span>            setStateInternal(LifecycleState.STOPPING_PREP, null, false);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // stop逻辑，抽象方法，组件自行实现</span></span>
<span class="line"><span>        stopInternal();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Shouldn&#39;t be necessary but acts as a check that sub-classes are</span></span>
<span class="line"><span>        // doing what they are supposed to.</span></span>
<span class="line"><span>        if (!state.equals(LifecycleState.STOPPING) &amp;&amp; !state.equals(LifecycleState.FAILED)) {</span></span>
<span class="line"><span>            invalidTransition(Lifecycle.AFTER_STOP_EVENT);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 设置状态为STOPPED</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.STOPPED, null, false);</span></span>
<span class="line"><span>    } catch (Throwable t) {</span></span>
<span class="line"><span>        ExceptionUtils.handleThrowable(t);</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.FAILED, null, false);</span></span>
<span class="line"><span>        throw new LifecycleException(sm.getString(&quot;lifecycleBase.stopFail&quot;,toString()), t);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        if (this instanceof Lifecycle.SingleUse) {</span></span>
<span class="line"><span>            // Complete stop process first</span></span>
<span class="line"><span>            setStateInternal(LifecycleState.STOPPED, null, false);</span></span>
<span class="line"><span>            destroy();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>destory</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public final synchronized void destroy() throws LifecycleException {</span></span>
<span class="line"><span>    // \`FAILED\`状态时，直接触发stop()逻辑</span></span>
<span class="line"><span>    if (LifecycleState.FAILED.equals(state)) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // Triggers clean-up</span></span>
<span class="line"><span>            stop();</span></span>
<span class="line"><span>        } catch (LifecycleException e) {</span></span>
<span class="line"><span>            // Just log. Still want to destroy.</span></span>
<span class="line"><span>            log.warn(sm.getString(</span></span>
<span class="line"><span>                    &quot;lifecycleBase.destroyStopFail&quot;, toString()), e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // \`DESTROYING\`和\`DESTROYED\`时，忽略destroy的执行</span></span>
<span class="line"><span>    if (LifecycleState.DESTROYING.equals(state) ||</span></span>
<span class="line"><span>            LifecycleState.DESTROYED.equals(state)) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (log.isDebugEnabled()) {</span></span>
<span class="line"><span>            Exception e = new LifecycleException();</span></span>
<span class="line"><span>            log.debug(sm.getString(&quot;lifecycleBase.alreadyDestroyed&quot;, toString()), e);</span></span>
<span class="line"><span>        } else if (log.isInfoEnabled() &amp;&amp; !(this instanceof Lifecycle.SingleUse)) {</span></span>
<span class="line"><span>            // Rather than have every component that might need to call</span></span>
<span class="line"><span>            // destroy() check for SingleUse, don&#39;t log an info message if</span></span>
<span class="line"><span>            // multiple calls are made to destroy()</span></span>
<span class="line"><span>            log.info(sm.getString(&quot;lifecycleBase.alreadyDestroyed&quot;, toString()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 非法状态判断</span></span>
<span class="line"><span>    if (!state.equals(LifecycleState.STOPPED) &amp;&amp;</span></span>
<span class="line"><span>            !state.equals(LifecycleState.FAILED) &amp;&amp;</span></span>
<span class="line"><span>            !state.equals(LifecycleState.NEW) &amp;&amp;</span></span>
<span class="line"><span>            !state.equals(LifecycleState.INITIALIZED)) {</span></span>
<span class="line"><span>        invalidTransition(Lifecycle.BEFORE_DESTROY_EVENT);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // destroy前状态设置</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.DESTROYING, null, false);</span></span>
<span class="line"><span>       // 抽象方法，组件自行实现</span></span>
<span class="line"><span>        destroyInternal();</span></span>
<span class="line"><span>        // destroy后状态设置</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.DESTROYED, null, false);</span></span>
<span class="line"><span>    } catch (Throwable t) {</span></span>
<span class="line"><span>        ExceptionUtils.handleThrowable(t);</span></span>
<span class="line"><span>        setStateInternal(LifecycleState.FAILED, null, false);</span></span>
<span class="line"><span>        throw new LifecycleException(</span></span>
<span class="line"><span>                sm.getString(&quot;lifecycleBase.destroyFail&quot;,toString()), t);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="用了什么设计模式" tabindex="-1">用了什么设计模式？ <a class="header-anchor" href="#用了什么设计模式" aria-label="Permalink to &quot;用了什么设计模式？&quot;">​</a></h3><p>从上述源码看得出来，LifecycleBase是使用了<strong>状态机</strong>+<strong>模板模式</strong>来实现的。模板方法有下面这几个：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 初始化方法</span></span>
<span class="line"><span>protected abstract void initInternal() throws LifecycleException;</span></span>
<span class="line"><span>// 启动方法</span></span>
<span class="line"><span>protected abstract void startInternal() throws LifecycleException;</span></span>
<span class="line"><span>// 停止方法</span></span>
<span class="line"><span>protected abstract void stopInternal() throws LifecycleException;</span></span>
<span class="line"><span>// 销毁方法</span></span>
<span class="line"><span>protected abstract void destroyInternal() throws LifecycleException;</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://segmentfault.com/a/1190000022016991" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000022016991</a></li><li><a href="https://www.jianshu.com/p/2a9ffbd00724" target="_blank" rel="noreferrer">https://www.jianshu.com/p/2a9ffbd00724</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,51)]))}const T=p(r,[["render",f]]);export{g as __pageData,T as default};
