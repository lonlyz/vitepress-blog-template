import{_ as s,a}from"./chunks/tomcat-x-pipline-5.qZWTzKkM.js";import{_ as p,c as e,ai as l,o as i}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/tomcat/tomcat-x-pipline-3.jpg",c="/vitepress-blog-template/images/tomcat/tomcat-x-pipline-1.jpg",r="/vitepress-blog-template/images/tomcat/tomcat-x-pipline-7.jpg",o="/vitepress-blog-template/images/tomcat/tomcat-x-pipline-2.jpg",V=JSON.parse('{"title":"Tomcat - Container的管道机制：责任链模式","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-container-pipline.md","filePath":"framework/tomcat/tomcat-x-container-pipline.md","lastUpdated":1737706346000}'),d={name:"framework/tomcat/tomcat-x-container-pipline.md"};function u(v,n,h,g,f,b){return i(),e("div",null,n[0]||(n[0]=[l('<h1 id="tomcat-container的管道机制-责任链模式" tabindex="-1">Tomcat - Container的管道机制：责任链模式 <a class="header-anchor" href="#tomcat-container的管道机制-责任链模式" aria-label="Permalink to &quot;Tomcat - Container的管道机制：责任链模式&quot;">​</a></h1><blockquote><p>上文中介绍了Engine的设计，其中有Pipline相关内容没有介绍，本文将向你阐述Tomcat的管道机制以及它要解决的问题。@pdai</p></blockquote><h2 id="内容引入" tabindex="-1">内容引入 <a class="header-anchor" href="#内容引入" aria-label="Permalink to &quot;内容引入&quot;">​</a></h2><blockquote><p>承接上文Engine的设计，从以下几个方面，我将向你解释为什么要理解Tomcat中管道机制，它要解决什么问题？@pdai</p></blockquote><ul><li>Tomcat总计架构图中Pipeline和Vavle</li></ul><p><img src="'+t+'" alt="error.图片加载失败"></p><ul><li>我们在上文Engine中有一块Pipline没有解释：</li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><ul><li>为什么Tomcat要引入Pipline呢？它要解决什么问题呢？</li></ul><p>下文将向你详细阐述。</p><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>在弄清楚管道机制前，你需要一些基础知识和其它软件设计中的应用场景。</p></blockquote><h3 id="责任链模式" tabindex="-1">责任链模式 <a class="header-anchor" href="#责任链模式" aria-label="Permalink to &quot;责任链模式&quot;">​</a></h3><p>管道机制在设计模式上属于责任链模式，如果你不理解，请参看如下文章：</p><p><a href="https://pdai.tech/md/dev-spec/pattern/15_chain.html" target="_blank" rel="noreferrer">责任链模式(Chain of responsibility pattern)</a>: 通过责任链模式, 你可以为某个请求创建一个对象链. 每个对象依序检查此请求并对其进行处理或者将它传给链中的下一个对象。</p><h3 id="filterchain" tabindex="-1">FilterChain <a class="header-anchor" href="#filterchain" aria-label="Permalink to &quot;FilterChain&quot;">​</a></h3><p>在软件开发的常接触的责任链模式是FilterChain，它体现在很多软件设计中：</p><ul><li><strong>比如Spring Security框架中</strong></li></ul><p><img src="'+s+'" alt="error.图片加载失败"></p><ul><li><strong>比如HttpServletRequest处理的过滤器中</strong></li></ul><p>当一个request过来的时候，需要对这个request做一系列的加工，使用责任链模式可以使每个加工组件化，减少耦合。也可以使用在当一个request过来的时候，需要找到合适的加工方式。当一个加工方式不适合这个request的时候，传递到下一个加工方法，该加工方式再尝试对request加工。</p><p>网上找了图，这里我们后文将通过Tomcat请求处理向你阐述。</p><p><img src="'+a+`" alt="error.图片加载失败"></p><h2 id="pipline机制" tabindex="-1">Pipline机制 <a class="header-anchor" href="#pipline机制" aria-label="Permalink to &quot;Pipline机制&quot;">​</a></h2><blockquote><p>为什么要有管道机制？</p></blockquote><p>在一个比较复杂的大型系统中，如果一个对象或数据流需要进行繁杂的逻辑处理，我们可以选择在一个大的组件中直接处理这些繁杂的业务逻辑， 这个方式虽然达到目的，但扩展性和可重用性较差， 因为可能牵一发而动全身。更好的解决方案是采用管道机制，<strong>用一条管道把多个对象(阀门部件)连接起来，整体看起来就像若干个阀门嵌套在管道中一样，而处理逻辑放在阀门上</strong>。</p><h3 id="vavle接口设计" tabindex="-1">Vavle接口设计 <a class="header-anchor" href="#vavle接口设计" aria-label="Permalink to &quot;Vavle接口设计&quot;">​</a></h3><p>理解它的设计，第一步就是阀门设计</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Valve {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 因为需要传递给下个Valve处理，所以有next</span></span>
<span class="line"><span>    public Valve getNext();</span></span>
<span class="line"><span>    public void setNext(Valve valve);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设计这个方法，便于执行周期任务，比如重新加载组件。此方法将在该容器的类加载上下文中调用。</span></span>
<span class="line"><span>    public void backgroundProcess();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 这个方法很容易理解，阀门中处理的执行方法，传入Request和Response进行处理</span></span>
<span class="line"><span>    public void invoke(Request request, Response response)</span></span>
<span class="line"><span>        throws IOException, ServletException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 此阀门是否支持Servlet 3+ 异步的请求</span></span>
<span class="line"><span>    public boolean isAsyncSupported();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="pipline接口设计" tabindex="-1">Pipline接口设计 <a class="header-anchor" href="#pipline接口设计" aria-label="Permalink to &quot;Pipline接口设计&quot;">​</a></h3><p>由于Pipline是为容器设计的，所以它在设计时加入了一个Containerd接口, 就是为了制定当前Pipline所属的容器：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Contained {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Container getContainer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setContainer(Container container);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们接着看下Pipline接口设计</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Pipeline extends Contained {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 基础的处理阀</span></span>
<span class="line"><span>    public Valve getBasic();</span></span>
<span class="line"><span>    public void setBasic(Valve valve);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 对节点（阀门）增删查</span></span>
<span class="line"><span>    public void addValve(Valve valve);</span></span>
<span class="line"><span>    public Valve[] getValves();</span></span>
<span class="line"><span>    public void removeValve(Valve valve);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取第一个节点，遍历的起点，所以需要有这方法</span></span>
<span class="line"><span>    public Valve getFirst();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 是否所有节点（阀门）都支持处理Servlet3异步处理</span></span>
<span class="line"><span>    public boolean isAsyncSupported();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 找到所有不支持Servlet3异步处理的阀门</span></span>
<span class="line"><span>    public void findNonAsyncValves(Set&lt;String&gt; result);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="basevavle设计" tabindex="-1">BaseVavle设计 <a class="header-anchor" href="#basevavle设计" aria-label="Permalink to &quot;BaseVavle设计&quot;">​</a></h3><p>由于Valve也是组件，需要生命周期管理，所以实现LifecycleMBeanBase，同时集成Contained和Valve</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class ValveBase extends LifecycleMBeanBase implements Contained, Valve {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected static final StringManager sm = StringManager.getManager(ValveBase.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //------------------------------------------------------ Constructor</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ValveBase() {</span></span>
<span class="line"><span>        this(false);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ValveBase(boolean asyncSupported) {</span></span>
<span class="line"><span>        this.asyncSupported = asyncSupported;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //------------------------------------------------------ Instance Variables</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Does this valve support Servlet 3+ async requests?</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected boolean asyncSupported;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * The Container whose pipeline this Valve is a component of.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected Container container = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Container log</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected Log containerLog = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * The next Valve in the pipeline this Valve is a component of.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected Valve next = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //-------------------------------------------------------------- Properties</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Return the Container with which this Valve is associated, if any.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Container getContainer() {</span></span>
<span class="line"><span>        return container;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Set the Container with which this Valve is associated, if any.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param container The new associated container</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setContainer(Container container) {</span></span>
<span class="line"><span>        this.container = container;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean isAsyncSupported() {</span></span>
<span class="line"><span>        return asyncSupported;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setAsyncSupported(boolean asyncSupported) {</span></span>
<span class="line"><span>        this.asyncSupported = asyncSupported;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Return the next Valve in this pipeline, or &lt;code&gt;null&lt;/code&gt; if this</span></span>
<span class="line"><span>     * is the last Valve in the pipeline.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Valve getNext() {</span></span>
<span class="line"><span>        return next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Set the Valve that follows this one in the pipeline it is part of.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param valve The new next valve</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setNext(Valve valve) {</span></span>
<span class="line"><span>        this.next = valve;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //---------------------------------------------------------- Public Methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Execute a periodic task, such as reloading, etc. This method will be</span></span>
<span class="line"><span>     * invoked inside the classloading context of this container. Unexpected</span></span>
<span class="line"><span>     * throwables will be caught and logged.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void backgroundProcess() {</span></span>
<span class="line"><span>        // NOOP by default</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void initInternal() throws LifecycleException {</span></span>
<span class="line"><span>        super.initInternal();</span></span>
<span class="line"><span>        containerLog = getContainer().getLogger();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Start this component and implement the requirements</span></span>
<span class="line"><span>     * of {@link org.apache.catalina.util.LifecycleBase#startInternal()}.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>     *  that prevents this component from being used</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected synchronized void startInternal() throws LifecycleException {</span></span>
<span class="line"><span>        setState(LifecycleState.STARTING);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Stop this component and implement the requirements</span></span>
<span class="line"><span>     * of {@link org.apache.catalina.util.LifecycleBase#stopInternal()}.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>     *  that prevents this component from being used</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected synchronized void stopInternal() throws LifecycleException {</span></span>
<span class="line"><span>        setState(LifecycleState.STOPPING);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Return a String rendering of this object.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return ToStringUtil.toString(this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // -------------------- JMX and Registration  --------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String getObjectNameKeyProperties() {</span></span>
<span class="line"><span>        StringBuilder name = new StringBuilder(&quot;type=Valve&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Container container = getContainer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        name.append(container.getMBeanKeyProperties());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int seq = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Pipeline may not be present in unit testing</span></span>
<span class="line"><span>        Pipeline p = container.getPipeline();</span></span>
<span class="line"><span>        if (p != null) {</span></span>
<span class="line"><span>            for (Valve valve : p.getValves()) {</span></span>
<span class="line"><span>                // Skip null valves</span></span>
<span class="line"><span>                if (valve == null) {</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // Only compare valves in pipeline until we find this valve</span></span>
<span class="line"><span>                if (valve == this) {</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (valve.getClass() == this.getClass()) {</span></span>
<span class="line"><span>                    // Duplicate valve earlier in pipeline</span></span>
<span class="line"><span>                    // increment sequence number</span></span>
<span class="line"><span>                    seq ++;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (seq &gt; 0) {</span></span>
<span class="line"><span>            name.append(&quot;,seq=&quot;);</span></span>
<span class="line"><span>            name.append(seq);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String className = this.getClass().getName();</span></span>
<span class="line"><span>        int period = className.lastIndexOf(&#39;.&#39;);</span></span>
<span class="line"><span>        if (period &gt;= 0) {</span></span>
<span class="line"><span>            className = className.substring(period + 1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        name.append(&quot;,name=&quot;);</span></span>
<span class="line"><span>        name.append(className);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return name.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String getDomainInternal() {</span></span>
<span class="line"><span>        Container c = getContainer();</span></span>
<span class="line"><span>        if (c == null) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return c.getDomain();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="standardpipline实现" tabindex="-1">StandardPipline实现 <a class="header-anchor" href="#standardpipline实现" aria-label="Permalink to &quot;StandardPipline实现&quot;">​</a></h3><p>里面方法很简单，就直接贴代码了。它必然是继承LifecycleBase同时实现Pipline.</p><p>贴个图方面你理解</p><p><img src="`+r+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class StandardPipeline extends LifecycleBase implements Pipeline {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final Log log = LogFactory.getLog(StandardPipeline.class);</span></span>
<span class="line"><span>    private static final StringManager sm = StringManager.getManager(Constants.Package);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ----------------------------------------------------------- Constructors</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Construct a new StandardPipeline instance with no associated Container.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public StandardPipeline() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Construct a new StandardPipeline instance that is associated with the</span></span>
<span class="line"><span>     * specified Container.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param container The container we should be associated with</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public StandardPipeline(Container container) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        super();</span></span>
<span class="line"><span>        setContainer(container);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ----------------------------------------------------- Instance Variables</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * The basic Valve (if any) associated with this Pipeline.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected Valve basic = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * The Container with which this Pipeline is associated.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected Container container = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * The first valve associated with this Pipeline.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    protected Valve first = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // --------------------------------------------------------- Public Methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean isAsyncSupported() {</span></span>
<span class="line"><span>        Valve valve = (first!=null)?first:basic;</span></span>
<span class="line"><span>        boolean supported = true;</span></span>
<span class="line"><span>        while (supported &amp;&amp; valve!=null) {</span></span>
<span class="line"><span>            supported = supported &amp; valve.isAsyncSupported();</span></span>
<span class="line"><span>            valve = valve.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return supported;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void findNonAsyncValves(Set&lt;String&gt; result) {</span></span>
<span class="line"><span>        Valve valve = (first!=null) ? first : basic;</span></span>
<span class="line"><span>        while (valve != null) {</span></span>
<span class="line"><span>            if (!valve.isAsyncSupported()) {</span></span>
<span class="line"><span>                result.add(valve.getClass().getName());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            valve = valve.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ------------------------------------------------------ Contained Methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Return the Container with which this Pipeline is associated.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Container getContainer() {</span></span>
<span class="line"><span>        return this.container;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Set the Container with which this Pipeline is associated.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param container The new associated container</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setContainer(Container container) {</span></span>
<span class="line"><span>        this.container = container;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void initInternal() {</span></span>
<span class="line"><span>        // NOOP</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Start {@link Valve}s) in this pipeline and implement the requirements</span></span>
<span class="line"><span>     * of {@link LifecycleBase#startInternal()}.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>     *  that prevents this component from being used</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected synchronized void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Start the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>        Valve current = first;</span></span>
<span class="line"><span>        if (current == null) {</span></span>
<span class="line"><span>            current = basic;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        while (current != null) {</span></span>
<span class="line"><span>            if (current instanceof Lifecycle)</span></span>
<span class="line"><span>                ((Lifecycle) current).start();</span></span>
<span class="line"><span>            current = current.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        setState(LifecycleState.STARTING);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Stop {@link Valve}s) in this pipeline and implement the requirements</span></span>
<span class="line"><span>     * of {@link LifecycleBase#stopInternal()}.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>     *  that prevents this component from being used</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected synchronized void stopInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        setState(LifecycleState.STOPPING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Stop the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>        Valve current = first;</span></span>
<span class="line"><span>        if (current == null) {</span></span>
<span class="line"><span>            current = basic;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        while (current != null) {</span></span>
<span class="line"><span>            if (current instanceof Lifecycle)</span></span>
<span class="line"><span>                ((Lifecycle) current).stop();</span></span>
<span class="line"><span>            current = current.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void destroyInternal() {</span></span>
<span class="line"><span>        Valve[] valves = getValves();</span></span>
<span class="line"><span>        for (Valve valve : valves) {</span></span>
<span class="line"><span>            removeValve(valve);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Return a String representation of this component.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return ToStringUtil.toString(this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ------------------------------------------------------- Pipeline Methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * &lt;p&gt;Return the Valve instance that has been distinguished as the basic</span></span>
<span class="line"><span>     * Valve for this Pipeline (if any).</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Valve getBasic() {</span></span>
<span class="line"><span>        return this.basic;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * &lt;p&gt;Set the Valve instance that has been distinguished as the basic</span></span>
<span class="line"><span>     * Valve for this Pipeline (if any).  Prior to setting the basic Valve,</span></span>
<span class="line"><span>     * the Valve&#39;s &lt;code&gt;setContainer()&lt;/code&gt; will be called, if it</span></span>
<span class="line"><span>     * implements &lt;code&gt;Contained&lt;/code&gt;, with the owning Container as an</span></span>
<span class="line"><span>     * argument.  The method may throw an &lt;code&gt;IllegalArgumentException&lt;/code&gt;</span></span>
<span class="line"><span>     * if this Valve chooses not to be associated with this Container, or</span></span>
<span class="line"><span>     * &lt;code&gt;IllegalStateException&lt;/code&gt; if it is already associated with</span></span>
<span class="line"><span>     * a different Container.&lt;/p&gt;</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param valve Valve to be distinguished as the basic Valve</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setBasic(Valve valve) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Change components if necessary</span></span>
<span class="line"><span>        Valve oldBasic = this.basic;</span></span>
<span class="line"><span>        if (oldBasic == valve)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Stop the old component if necessary</span></span>
<span class="line"><span>        if (oldBasic != null) {</span></span>
<span class="line"><span>            if (getState().isAvailable() &amp;&amp; (oldBasic instanceof Lifecycle)) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    ((Lifecycle) oldBasic).stop();</span></span>
<span class="line"><span>                } catch (LifecycleException e) {</span></span>
<span class="line"><span>                    log.error(sm.getString(&quot;standardPipeline.basic.stop&quot;), e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (oldBasic instanceof Contained) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    ((Contained) oldBasic).setContainer(null);</span></span>
<span class="line"><span>                } catch (Throwable t) {</span></span>
<span class="line"><span>                    ExceptionUtils.handleThrowable(t);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Start the new component if necessary</span></span>
<span class="line"><span>        if (valve == null)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        if (valve instanceof Contained) {</span></span>
<span class="line"><span>            ((Contained) valve).setContainer(this.container);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (getState().isAvailable() &amp;&amp; valve instanceof Lifecycle) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) valve).start();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;standardPipeline.basic.start&quot;), e);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Update the pipeline</span></span>
<span class="line"><span>        Valve current = first;</span></span>
<span class="line"><span>        while (current != null) {</span></span>
<span class="line"><span>            if (current.getNext() == oldBasic) {</span></span>
<span class="line"><span>                current.setNext(valve);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            current = current.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.basic = valve;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * &lt;p&gt;Add a new Valve to the end of the pipeline associated with this</span></span>
<span class="line"><span>     * Container.  Prior to adding the Valve, the Valve&#39;s</span></span>
<span class="line"><span>     * &lt;code&gt;setContainer()&lt;/code&gt; method will be called, if it implements</span></span>
<span class="line"><span>     * &lt;code&gt;Contained&lt;/code&gt;, with the owning Container as an argument.</span></span>
<span class="line"><span>     * The method may throw an</span></span>
<span class="line"><span>     * &lt;code&gt;IllegalArgumentException&lt;/code&gt; if this Valve chooses not to</span></span>
<span class="line"><span>     * be associated with this Container, or &lt;code&gt;IllegalStateException&lt;/code&gt;</span></span>
<span class="line"><span>     * if it is already associated with a different Container.&lt;/p&gt;</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param valve Valve to be added</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @exception IllegalArgumentException if this Container refused to</span></span>
<span class="line"><span>     *  accept the specified Valve</span></span>
<span class="line"><span>     * @exception IllegalArgumentException if the specified Valve refuses to be</span></span>
<span class="line"><span>     *  associated with this Container</span></span>
<span class="line"><span>     * @exception IllegalStateException if the specified Valve is already</span></span>
<span class="line"><span>     *  associated with a different Container</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addValve(Valve valve) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Validate that we can add this Valve</span></span>
<span class="line"><span>        if (valve instanceof Contained)</span></span>
<span class="line"><span>            ((Contained) valve).setContainer(this.container);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Start the new component if necessary</span></span>
<span class="line"><span>        if (getState().isAvailable()) {</span></span>
<span class="line"><span>            if (valve instanceof Lifecycle) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    ((Lifecycle) valve).start();</span></span>
<span class="line"><span>                } catch (LifecycleException e) {</span></span>
<span class="line"><span>                    log.error(sm.getString(&quot;standardPipeline.valve.start&quot;), e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Add this Valve to the set associated with this Pipeline</span></span>
<span class="line"><span>        if (first == null) {</span></span>
<span class="line"><span>            first = valve;</span></span>
<span class="line"><span>            valve.setNext(basic);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            Valve current = first;</span></span>
<span class="line"><span>            while (current != null) {</span></span>
<span class="line"><span>                if (current.getNext() == basic) {</span></span>
<span class="line"><span>                    current.setNext(valve);</span></span>
<span class="line"><span>                    valve.setNext(basic);</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                current = current.getNext();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        container.fireContainerEvent(Container.ADD_VALVE_EVENT, valve);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Return the set of Valves in the pipeline associated with this</span></span>
<span class="line"><span>     * Container, including the basic Valve (if any).  If there are no</span></span>
<span class="line"><span>     * such Valves, a zero-length array is returned.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Valve[] getValves() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;Valve&gt; valveList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        Valve current = first;</span></span>
<span class="line"><span>        if (current == null) {</span></span>
<span class="line"><span>            current = basic;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        while (current != null) {</span></span>
<span class="line"><span>            valveList.add(current);</span></span>
<span class="line"><span>            current = current.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return valveList.toArray(new Valve[0]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ObjectName[] getValveObjectNames() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;ObjectName&gt; valveList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        Valve current = first;</span></span>
<span class="line"><span>        if (current == null) {</span></span>
<span class="line"><span>            current = basic;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        while (current != null) {</span></span>
<span class="line"><span>            if (current instanceof JmxEnabled) {</span></span>
<span class="line"><span>                valveList.add(((JmxEnabled) current).getObjectName());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            current = current.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return valveList.toArray(new ObjectName[0]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Remove the specified Valve from the pipeline associated with this</span></span>
<span class="line"><span>     * Container, if it is found; otherwise, do nothing.  If the Valve is</span></span>
<span class="line"><span>     * found and removed, the Valve&#39;s &lt;code&gt;setContainer(null)&lt;/code&gt; method</span></span>
<span class="line"><span>     * will be called if it implements &lt;code&gt;Contained&lt;/code&gt;.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param valve Valve to be removed</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void removeValve(Valve valve) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Valve current;</span></span>
<span class="line"><span>        if(first == valve) {</span></span>
<span class="line"><span>            first = first.getNext();</span></span>
<span class="line"><span>            current = null;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            current = first;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        while (current != null) {</span></span>
<span class="line"><span>            if (current.getNext() == valve) {</span></span>
<span class="line"><span>                current.setNext(valve.getNext());</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            current = current.getNext();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (first == basic) first = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (valve instanceof Contained)</span></span>
<span class="line"><span>            ((Contained) valve).setContainer(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (valve instanceof Lifecycle) {</span></span>
<span class="line"><span>            // Stop this valve if necessary</span></span>
<span class="line"><span>            if (getState().isAvailable()) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    ((Lifecycle) valve).stop();</span></span>
<span class="line"><span>                } catch (LifecycleException e) {</span></span>
<span class="line"><span>                    log.error(sm.getString(&quot;standardPipeline.valve.stop&quot;), e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) valve).destroy();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;standardPipeline.valve.destroy&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        container.fireContainerEvent(Container.REMOVE_VALVE_EVENT, valve);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Valve getFirst() {</span></span>
<span class="line"><span>        if (first != null) {</span></span>
<span class="line"><span>            return first;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return basic;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="containerbase中运用pipline" tabindex="-1">ContainerBase中运用Pipline <a class="header-anchor" href="#containerbase中运用pipline" aria-label="Permalink to &quot;ContainerBase中运用Pipline&quot;">​</a></h3><blockquote><p>那么容器中是如何运用Pipline的呢？</p></blockquote><ul><li>容器中是如何运用Pipline的？</li></ul><p>由于Container中都有涉及，实现方法肯定是在抽象的实现类中，所以肯定是在ContainerBase中实现。</p><ul><li>初始化</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * The Pipeline object with which this Container is associated.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected final Pipeline pipeline = new StandardPipeline(this);</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the Pipeline object that manages the Valves associated with</span></span>
<span class="line"><span>  * this Container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Pipeline getPipeline() {</span></span>
<span class="line"><span>    return this.pipeline;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Lifecycle模板方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected synchronized void startInternal() throws LifecycleException {</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>    // Start the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>    if (pipeline instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) pipeline).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected synchronized void stopInternal() throws LifecycleException {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stop the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>    if (pipeline instanceof Lifecycle &amp;&amp;</span></span>
<span class="line"><span>            ((Lifecycle) pipeline).getState().isAvailable()) {</span></span>
<span class="line"><span>        ((Lifecycle) pipeline).stop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void destroyInternal() throws LifecycleException {</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stop the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>    if (pipeline instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) pipeline).destroy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>    super.destroyInternal();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>重点是<strong>backgroundProcess方法</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void backgroundProcess() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!getState().isAvailable())</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Cluster cluster = getClusterInternal();</span></span>
<span class="line"><span>    if (cluster != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            cluster.backgroundProcess();</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            log.warn(sm.getString(&quot;containerBase.backgroundProcess.cluster&quot;,</span></span>
<span class="line"><span>                    cluster), e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Realm realm = getRealmInternal();</span></span>
<span class="line"><span>    if (realm != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            realm.backgroundProcess();</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            log.warn(sm.getString(&quot;containerBase.backgroundProcess.realm&quot;, realm), e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 看这里</span></span>
<span class="line"><span>    Valve current = pipeline.getFirst();</span></span>
<span class="line"><span>    while (current != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            current.backgroundProcess();</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            log.warn(sm.getString(&quot;containerBase.backgroundProcess.valve&quot;, current), e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        current = current.getNext();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fireLifecycleEvent(Lifecycle.PERIODIC_EVENT, null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看下相关链路</p><p><img src="`+o+'" alt="error.图片加载失败"></p><h2 id="对比下两种责任链模式" tabindex="-1">对比下两种责任链模式 <a class="header-anchor" href="#对比下两种责任链模式" aria-label="Permalink to &quot;对比下两种责任链模式&quot;">​</a></h2><table tabindex="0"><thead><tr><th>管道/阀门</th><th>过滤器链/过滤器</th></tr></thead><tbody><tr><td>管道（Pipeline）</td><td>过滤器链（FilterChain）</td></tr><tr><td>阀门（Valve）</td><td>过滤器（Filter）</td></tr><tr><td>底层实现为具有头（first）、尾（basic）指针的单向链表</td><td>底层实现为数组</td></tr><tr><td>Valve的核心方法invoke(request,response)</td><td>Filter核心方法doFilter(request,response,chain)</td></tr><tr><td>pipeline.getFirst().invoke(request,response)</td><td>filterchain.doFilter(request,response)</td></tr></tbody></table><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',57)]))}const C=p(d,[["render",u]]);export{V as __pageData,C as default};
