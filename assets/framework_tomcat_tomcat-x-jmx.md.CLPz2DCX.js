import{_ as s,c as e,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const a="/vitepress-blog-template/images/tomcat/tomcat-x-jmx-1.jpg",t="/vitepress-blog-template/images/tomcat/tomcat-x-jmx-2.png",i="/vitepress-blog-template/images/tomcat/tomcat-x-jmx-3.jpg",c="/vitepress-blog-template/images/tomcat/tomcat-x-jmx-4.jpg",r="/vitepress-blog-template/images/tomcat/tomcat-x-jmx-5.jpg",M=JSON.parse('{"title":"Tomcat - 组件拓展管理:JMX和MBean","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-jmx.md","filePath":"framework/tomcat/tomcat-x-jmx.md","lastUpdated":1737706346000}'),o={name:"framework/tomcat/tomcat-x-jmx.md"};function d(m,n,g,h,b,u){return l(),e("div",null,n[0]||(n[0]=[p('<h1 id="tomcat-组件拓展管理-jmx和mbean" tabindex="-1">Tomcat - 组件拓展管理:JMX和MBean <a class="header-anchor" href="#tomcat-组件拓展管理-jmx和mbean" aria-label="Permalink to &quot;Tomcat - 组件拓展管理:JMX和MBean&quot;">​</a></h1><blockquote><p>我们在前文中讲Lifecycle以及组件，怎么会突然讲JMX和MBean呢？本文通过承接上文Lifecycle讲Tomcat基于JMX的实现。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>我们在前文中讲Lifecycle以及组件，怎么会突然讲JMX和MBean呢？本文通过承接上文Lifecycle讲Tomcat基于JMX的实现。</p></blockquote><h3 id="为什么要了解jmx" tabindex="-1">为什么要了解JMX <a class="header-anchor" href="#为什么要了解jmx" aria-label="Permalink to &quot;为什么要了解JMX&quot;">​</a></h3><p>我们在上文中讲Lifecycle和相关组件时，你会发现其实还设计一块就是左侧的JMX和MBean的实现，即LifecycleMBeanBase.</p><p><img src="'+a+'" alt="error.图片加载失败"></p><h3 id="什么是jmx和mbean" tabindex="-1">什么是JMX和MBean <a class="header-anchor" href="#什么是jmx和mbean" aria-label="Permalink to &quot;什么是JMX和MBean&quot;">​</a></h3><blockquote><p>JMX是java1.5中引入的新特性。JMX全称为“Java Management Extension”，即Java管理扩展。</p></blockquote><p>JMX(Java Management Extensions)是一个为应用程序植入管理功能的框架。JMX是一套标准的代理和服务，实际上，用户可以在任何Java应用程序中使用这些代理和服务实现管理。它使用了最简单的一类javaBean，使用有名的MBean，其内部包含了数据信息，这些信息可能是程序配置信息、模块信息、系统信息、统计信息等。MBean可以操作可读可写的属性、直接操作某些函数。</p><p><strong>应用场景</strong>：中间件软件WebLogic的管理页面就是基于JMX开发的，而JBoss则整个系统都基于JMX构架，我们今天讲的Tomcat也是基于JMX开发而来的。</p><p>我们看下<strong>JMX的结构</strong></p><p><img src="'+t+`" alt="error.图片加载失败"></p><ul><li><strong>Probe Level</strong> 负责资源的检测（获取信息），包含MBeans，通常也叫做Instrumentation Level。MX管理构件（MBean）分为四种形式，分别是标准管理构件（Standard MBean）、动态管理构件（Dynamic MBean）、开放管理构件(Open Mbean)和模型管理构件(Model MBean)。</li><li><strong>The Agent Level</strong> 或者叫做MBean Server（代理服务器），是JMX的核心，连接Mbeans和远程监控程序。</li><li><strong>Remote Management Level</strong> 通过connectors和adaptors来远程操作MBean Server。</li></ul><h2 id="jmx使用案例" tabindex="-1">JMX使用案例 <a class="header-anchor" href="#jmx使用案例" aria-label="Permalink to &quot;JMX使用案例&quot;">​</a></h2><blockquote><p>上节只是引入和相关概念，这是不够的，你依然需要一个案例来帮助你理解JMX是如何工作的。</p></blockquote><h3 id="基于jmx的监控例子" tabindex="-1">基于JMX的监控例子 <a class="header-anchor" href="#基于jmx的监控例子" aria-label="Permalink to &quot;基于JMX的监控例子&quot;">​</a></h3><ul><li>ServerImpl - 我们模拟的某个服务器ServerImpl状态</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ServerImpl {</span></span>
<span class="line"><span>    public final long startTime;</span></span>
<span class="line"><span>    public ServerImpl() {</span></span>
<span class="line"><span>        startTime = System.currentTimeMillis();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>由于MXBean规定，标准MBean也要实现一个接口，其所有向外界公开的方法都要在该接口中声明，否则管理系统就不能从中获取信息。此外，该接口的命名有一定的规范：在标准MBean类名后加上MBean后缀。这里的标准MBean类就是ServerMonitor，所以其对应的接口就应该是ServerMonitorMBean。因此ServerMonitorMBean的实现如下</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ServerMonitorMBean {</span></span>
<span class="line"><span>	public long getUpTime();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>使用ServerMonitor类来监测ServerImpl的状态，实现如下</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ServerMonitor implements ServerMonitorMBean {</span></span>
<span class="line"><span>    private final ServerImpl target;</span></span>
<span class="line"><span>    public ServerMonitor(ServerImpl target) {</span></span>
<span class="line"><span>        this.target = target;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public long getUpTime() {</span></span>
<span class="line"><span>        return System.currentTimeMillis() - target.startTime;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>对于管理系统来讲，这些MBean中公开的方法，最终会被JMX转换为属性（Attribute）、监听（Listener）和调用（Invoke）的概念。下面代码中Main类的manage方法就模拟了管理程序是如何获取监测到的属性，并表现监测结果。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import javax.management.MBeanServer;</span></span>
<span class="line"><span>import javax.management.MBeanServerFactory;</span></span>
<span class="line"><span>import javax.management.ObjectName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Main {</span></span>
<span class="line"><span>    private static ObjectName objectName;</span></span>
<span class="line"><span>    private static MBeanServer mBeanServer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        init();</span></span>
<span class="line"><span>        manage();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static void init() throws Exception {</span></span>
<span class="line"><span>        ServerImpl serverImpl = new ServerImpl();</span></span>
<span class="line"><span>        ServerMonitor serverMonitor = new ServerMonitor(serverImpl);</span></span>
<span class="line"><span>        mBeanServer = MBeanServerFactory.createMBeanServer();</span></span>
<span class="line"><span>        objectName = new ObjectName(&quot;objectName:id=ServerMonitor1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 注册到MBeanServer</span></span>
<span class="line"><span>        mBeanServer.registerMBean(serverMonitor, objectName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static void manage() throws Exception {</span></span>
<span class="line"><span>        // 获取属性值</span></span>
<span class="line"><span>        long upTime = (Long)mBeanServer.getAttribute(objectName, &quot;UpTime&quot;);</span></span>
<span class="line"><span>        System.out.println(upTime);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>整体流程</li></ul><p><img src="`+i+`" alt="error.图片加载失败"></p><blockquote><p>如上步骤就能让你理解常见的Jconsole是如何通过JMX获取属性，对象等监控信息的了。</p></blockquote><h3 id="基于jmx的htmladapter案例" tabindex="-1">基于JMX的HTMLAdapter案例 <a class="header-anchor" href="#基于jmx的htmladapter案例" aria-label="Permalink to &quot;基于JMX的HTMLAdapter案例&quot;">​</a></h3><blockquote><p>上面例子，还没有体现adapter展示，比如上述信息在HTML页面中展示出来，再看一个例子</p></blockquote><ul><li>我们的管理目标</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ControlTarget {</span></span>
<span class="line"><span>	private long width;</span></span>
<span class="line"><span>	private long length;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public ControlTarget( long width, long length) {</span></span>
<span class="line"><span>		this.width = width;</span></span>
<span class="line"><span>		this.length = length;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public long getWidth() {</span></span>
<span class="line"><span>		return width;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public long getLength() {</span></span>
<span class="line"><span>		return length;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>根据标准MBean类抽象出符合规范的MBean类的接口，并修改标准MBean类实现该接口。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ControlImplMBean {</span></span>
<span class="line"><span>	public long getLength();</span></span>
<span class="line"><span>	public long getWidth();</span></span>
<span class="line"><span>	public long getArea();</span></span>
<span class="line"><span>	public double getLengthWidthRatio();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>根据需求，创建管理（目标程序）的类，其中包含操纵和获取（目标程序）特性的方法。这个类就是标准MBean类。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ControlImpl implements ControlImplMBean {</span></span>
<span class="line"><span>	private ControlTarget target;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public ControlImpl(ControlTarget target) {</span></span>
<span class="line"><span>		this.target = target;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public long getLength() {</span></span>
<span class="line"><span>		return target.getLength();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public long getWidth() {</span></span>
<span class="line"><span>		return target.getWidth();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public long getArea() {</span></span>
<span class="line"><span>		return target.getLength() * target.getWidth();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public double getLengthWidthRatio() {</span></span>
<span class="line"><span>		return  target.getLength() * 1.0f / target.getWidth();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>创建MBean的代理类，代理中包含创建MBeanServer、生成ObjectName、注册MBean、表现MBean</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import com.sun.jdmk.comm.HtmlAdaptorServer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.management.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ControlImplAgent {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws MalformedObjectNameException, NullPointerException, InstanceAlreadyExistsException, MBeanRegistrationException, NotCompliantMBeanException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 创建MBeanServer</span></span>
<span class="line"><span>        MBeanServer server = MBeanServerFactory.createMBeanServer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 为MBean创建ObjectName</span></span>
<span class="line"><span>        ObjectName controlImplName = new ObjectName(&quot;controlImpl:name=firstOne&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 注册MBean到Server中</span></span>
<span class="line"><span>        server.registerMBean(new ControlImpl(new ControlTarget(50, 200)), controlImplName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 表现MBean(一种方式)</span></span>
<span class="line"><span>        ObjectName adapterName = new ObjectName(&quot;ControlImpl:name=htmladapter,port=8082&quot;);</span></span>
<span class="line"><span>        HtmlAdaptorServer adapter = new HtmlAdaptorServer();</span></span>
<span class="line"><span>        server.registerMBean(adapter, adapterName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        adapter.start();</span></span>
<span class="line"><span>        //adapter.stop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>打开相关页面</li></ul><p>PS：相关Adapter可以通过这里下载<a href="https://download.csdn.net/download/com%5C_ma/10379741" target="_blank" rel="noreferrer">https://download.csdn.net/download/com\\_ma/10379741</a></p><p><img src="`+c+'" alt="error.图片加载失败"></p><p>点击最后一个链接</p><p><img src="'+r+'" alt="error.图片加载失败"></p><h2 id="tomcat如何通过jmx实现组件管理" tabindex="-1">Tomcat如何通过JMX实现组件管理 <a class="header-anchor" href="#tomcat如何通过jmx实现组件管理" aria-label="Permalink to &quot;Tomcat如何通过JMX实现组件管理&quot;">​</a></h2><blockquote><p>在简单理解了JMX概念和案例之后，我们便可以开始学习Tomcat基于JMX的实现了。</p></blockquote><p><img src="'+a+`" alt="error.图片加载失败"></p><p>上述图中，我们看下相关的类的用途</p><ul><li><p><code>MBeanRegistration</code>：Java JMX框架提供的注册MBean的接口，引入此接口是为了便于使用JMX提供的管理功能；</p></li><li><p><code>JmxEnabled</code>: 此接口由组件实现，这些组件在创建时将注册到MBean服务器，在销毁时将注销这些组件。它主要是由实现生命周期的组件来实现的，但并不是专门为它们实现的。</p></li><li><p><code>LifecycleMBeanBase</code>：Tomcat提供的对MBeanRegistration的抽象实现类，运用抽象模板模式将所有容器统一注册到JMX；</p></li></ul><p>此外，ContainerBase、StandardServer、StandardService、WebappLoader、Connector、StandardContext、StandardEngine、StandardHost、StandardWrapper等容器都继承了LifecycleMBeanBase，因此这些容器都具有了同样的生命周期并可以通过JMX进行管理。</p><h3 id="mbeanregistration" tabindex="-1">MBeanRegistration <a class="header-anchor" href="#mbeanregistration" aria-label="Permalink to &quot;MBeanRegistration&quot;">​</a></h3><p>理解MBeanRegistration主要在于:</p><ul><li>两块内容：registered 和 unregistered</li><li>两类方法：before和after</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface MBeanRegistration   {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在注册之前执行的方法，如果发生异常，MBean不会注册到MBean Server中</span></span>
<span class="line"><span>    public ObjectName preRegister(MBeanServer server,</span></span>
<span class="line"><span>                                  ObjectName name) throws java.lang.Exception;</span></span>
<span class="line"><span>    // 在注册之后执行的方法，比如注册失败提供报错信息</span></span>
<span class="line"><span>    public void postRegister(Boolean registrationDone);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在卸载前执行的方法</span></span>
<span class="line"><span>    public void preDeregister() throws java.lang.Exception ;</span></span>
<span class="line"><span>    // 在执行卸载之后的方法</span></span>
<span class="line"><span>    public void postDeregister();</span></span>
<span class="line"><span></span></span>
<span class="line"><span> }</span></span></code></pre></div><h3 id="jmxenabled" tabindex="-1">JmxEnabled <a class="header-anchor" href="#jmxenabled" aria-label="Permalink to &quot;JmxEnabled&quot;">​</a></h3><p>理解JmxEnabled：在设计上它引一个域（Domain）对注册的MBeans进行隔离，这个域类似于MBean上层的命名空间一样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface JmxEnabled extends MBeanRegistration {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取MBean所属于的Domain</span></span>
<span class="line"><span>    String getDomain();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置Domain</span></span>
<span class="line"><span>    void setDomain(String domain);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取MBean的名字</span></span>
<span class="line"><span>    ObjectName getObjectName();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="lifecyclembeanbase" tabindex="-1">LifecycleMBeanBase <a class="header-anchor" href="#lifecyclembeanbase" aria-label="Permalink to &quot;LifecycleMBeanBase&quot;">​</a></h3><p>这样理解LifecycleMBeanBase时，你便知道它包含两块，一个是Lifecycle的接口实现，一个是Jmx接口封装实现。</p><p>从它实现的类继承和实现关系便能看出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class LifecycleMBeanBase extends LifecycleBase</span></span>
<span class="line"><span>        implements JmxEnabled {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="jmxenabled的接口实现" tabindex="-1">JmxEnabled的接口实现 <a class="header-anchor" href="#jmxenabled的接口实现" aria-label="Permalink to &quot;JmxEnabled的接口实现&quot;">​</a></h4><ul><li>Domain和mBeanName相关，代码很简单，不做详解</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Cache components of the MBean registration. */</span></span>
<span class="line"><span>private String domain = null;</span></span>
<span class="line"><span>private ObjectName oname = null;</span></span>
<span class="line"><span>@Deprecated</span></span>
<span class="line"><span>protected MBeanServer mserver = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Specify the domain under which this component should be registered. Used</span></span>
<span class="line"><span>  * with components that cannot (easily) navigate the component hierarchy to</span></span>
<span class="line"><span>  * determine the correct domain to use.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final void setDomain(String domain) {</span></span>
<span class="line"><span>    this.domain = domain;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the domain under which this component will be / has been</span></span>
<span class="line"><span>  * registered.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final String getDomain() {</span></span>
<span class="line"><span>    if (domain == null) {</span></span>
<span class="line"><span>        domain = getDomainInternal();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (domain == null) {</span></span>
<span class="line"><span>        domain = Globals.DEFAULT_MBEAN_DOMAIN;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return domain;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Method implemented by sub-classes to identify the domain in which MBeans</span></span>
<span class="line"><span>  * should be registered.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return  The name of the domain to use to register MBeans.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected abstract String getDomainInternal();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the name under which this component has been registered with JMX.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final ObjectName getObjectName() {</span></span>
<span class="line"><span>    return oname;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Allow sub-classes to specify the key properties component of the</span></span>
<span class="line"><span>  * {@link ObjectName} that will be used to register this component.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return  The string representation of the key properties component of the</span></span>
<span class="line"><span>  *          desired {@link ObjectName}</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected abstract String getObjectNameKeyProperties();</span></span></code></pre></div><ul><li>注册和卸载的相关方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Utility method to enable sub-classes to easily register additional</span></span>
<span class="line"><span>  * components that don&#39;t implement {@link JmxEnabled} with an MBean server.</span></span>
<span class="line"><span>  * &lt;br&gt;</span></span>
<span class="line"><span>  * Note: This method should only be used once {@link #initInternal()} has</span></span>
<span class="line"><span>  * been called and before {@link #destroyInternal()} has been called.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param obj                       The object the register</span></span>
<span class="line"><span>  * @param objectNameKeyProperties   The key properties component of the</span></span>
<span class="line"><span>  *                                  object name to use to register the</span></span>
<span class="line"><span>  *                                  object</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return  The name used to register the object</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected final ObjectName register(Object obj,</span></span>
<span class="line"><span>        String objectNameKeyProperties) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Construct an object name with the right domain</span></span>
<span class="line"><span>    StringBuilder name = new StringBuilder(getDomain());</span></span>
<span class="line"><span>    name.append(&#39;:&#39;);</span></span>
<span class="line"><span>    name.append(objectNameKeyProperties);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ObjectName on = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        on = new ObjectName(name.toString());</span></span>
<span class="line"><span>        Registry.getRegistry(null, null).registerComponent(obj, on, null);</span></span>
<span class="line"><span>    } catch (MalformedObjectNameException e) {</span></span>
<span class="line"><span>        log.warn(sm.getString(&quot;lifecycleMBeanBase.registerFail&quot;, obj, name),</span></span>
<span class="line"><span>                e);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        log.warn(sm.getString(&quot;lifecycleMBeanBase.registerFail&quot;, obj, name),</span></span>
<span class="line"><span>                e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return on;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Utility method to enable sub-classes to easily unregister additional</span></span>
<span class="line"><span>  * components that don&#39;t implement {@link JmxEnabled} with an MBean server.</span></span>
<span class="line"><span>  * &lt;br&gt;</span></span>
<span class="line"><span>  * Note: This method should only be used once {@link #initInternal()} has</span></span>
<span class="line"><span>  * been called and before {@link #destroyInternal()} has been called.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param objectNameKeyProperties   The key properties component of the</span></span>
<span class="line"><span>  *                                  object name to use to unregister the</span></span>
<span class="line"><span>  *                                  object</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected final void unregister(String objectNameKeyProperties) {</span></span>
<span class="line"><span>    // Construct an object name with the right domain</span></span>
<span class="line"><span>    StringBuilder name = new StringBuilder(getDomain());</span></span>
<span class="line"><span>    name.append(&#39;:&#39;);</span></span>
<span class="line"><span>    name.append(objectNameKeyProperties);</span></span>
<span class="line"><span>    Registry.getRegistry(null, null).unregisterComponent(name.toString());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Utility method to enable sub-classes to easily unregister additional</span></span>
<span class="line"><span>  * components that don&#39;t implement {@link JmxEnabled} with an MBean server.</span></span>
<span class="line"><span>  * &lt;br&gt;</span></span>
<span class="line"><span>  * Note: This method should only be used once {@link #initInternal()} has</span></span>
<span class="line"><span>  * been called and before {@link #destroyInternal()} has been called.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param on    The name of the component to unregister</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected final void unregister(ObjectName on) {</span></span>
<span class="line"><span>    Registry.getRegistry(null, null).unregisterComponent(on);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Not used - NOOP.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final void postDeregister() {</span></span>
<span class="line"><span>    // NOOP</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Not used - NOOP.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final void postRegister(Boolean registrationDone) {</span></span>
<span class="line"><span>    // NOOP</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Not used - NOOP.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final void preDeregister() throws Exception {</span></span>
<span class="line"><span>    // NOOP</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Allows the object to be registered with an alternative</span></span>
<span class="line"><span>  * {@link MBeanServer} and/or {@link ObjectName}.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public final ObjectName preRegister(MBeanServer server, ObjectName name)</span></span>
<span class="line"><span>        throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.mserver = server;</span></span>
<span class="line"><span>    this.oname = name;</span></span>
<span class="line"><span>    this.domain = name.getDomain().intern();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return oname;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="lifecyclebase相关接口" tabindex="-1">LifecycleBase相关接口 <a class="header-anchor" href="#lifecyclebase相关接口" aria-label="Permalink to &quot;LifecycleBase相关接口&quot;">​</a></h4><p>这样你就知道这里抽象出的LifecycleBase如下两个方法的用意，就是为了注册和卸载MBean</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>注册MBean</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void initInternal() throws LifecycleException {</span></span>
<span class="line"><span>    // If oname is not null then registration has already happened via</span></span>
<span class="line"><span>    // preRegister().</span></span>
<span class="line"><span>    if (oname == null) {</span></span>
<span class="line"><span>        mserver = Registry.getRegistry(null, null).getMBeanServer();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        oname = register(this, getObjectNameKeyProperties());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  卸载MBean</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void destroyInternal() throws LifecycleException {</span></span>
<span class="line"><span>    unregister(oname);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文档" tabindex="-1">参考文档 <a class="header-anchor" href="#参考文档" aria-label="Permalink to &quot;参考文档&quot;">​</a></h2><p>JMX例子整理自：</p><ul><li><p><a href="https://blog.csdn.net/xiaoxiaoyusheng2012/article/details/52101083" target="_blank" rel="noreferrer">https://blog.csdn.net/xiaoxiaoyusheng2012/article/details/52101083</a></p></li><li><p><a href="https://www.cnblogs.com/dongguacai/p/5900507.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/dongguacai/p/5900507.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,72)]))}const B=s(o,[["render",d]]);export{M as __pageData,B as default};
