import{_ as s,a}from"./chunks/tomcat-x-container-3.CpCiapYt.js";import{_ as p,c as e,ai as l,o as i}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/tomcat/tomcat-x-container-2.png",f=JSON.parse('{"title":"Tomcat - Request请求处理: Container设计","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-container.md","filePath":"framework/tomcat/tomcat-x-container.md","lastUpdated":1737706346000}'),c={name:"framework/tomcat/tomcat-x-container.md"};function r(o,n,h,d,u,g){return i(),e("div",null,n[0]||(n[0]=[l('<h1 id="tomcat-request请求处理-container设计" tabindex="-1">Tomcat - Request请求处理: Container设计 <a class="header-anchor" href="#tomcat-request请求处理-container设计" aria-label="Permalink to &quot;Tomcat - Request请求处理: Container设计&quot;">​</a></h1><blockquote><p>在理解了Server，Service和Executor后，我们可以进入Request处理环节了。我们知道客户端是可以发起多个请求的，Tomcat也是可以支持多个webapp的，有多个上下文，且一个webapp中可以有多个Servlet...等等，那么Tomcat是如何设计组件来支撑请求处理的呢？本节文将介绍Tomcat的Container设计。@pdai</p></blockquote><h2 id="内容引入" tabindex="-1">内容引入 <a class="header-anchor" href="#内容引入" aria-label="Permalink to &quot;内容引入&quot;">​</a></h2><blockquote><p>这里一定把握住我们上下文之间的衔接，这是我们整个系列理解Tomcat的主线。@pdai</p></blockquote><ul><li>到目前我们研究到了哪里？</li></ul><p><img src="'+t+'" alt="error.图片加载失败"></p><h2 id="理解思路" tabindex="-1">理解思路 <a class="header-anchor" href="#理解思路" aria-label="Permalink to &quot;理解思路&quot;">​</a></h2><ul><li><strong>为什么我们说上面的是Container呢？我们看下几个Container之间的关系</strong>：</li></ul><p><img src="'+s+`" alt="error.图片加载失败"></p><p>从上图上，我们也可以看出Container顶层也是基于Lifecycle的组件设计的。</p><ul><li><strong>在设计Container组件层次组件时，上述4个组件分别做什么的呢？为什么要四种组件呢？</strong></li></ul><p>如下是Container接口类的相关注释</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> * &lt;li&gt;&lt;b&gt;Engine&lt;/b&gt; - Representation of the entire Catalina servlet engine,</span></span>
<span class="line"><span> *     most likely containing one or more subcontainers that are either Host</span></span>
<span class="line"><span> *     or Context implementations, or other custom groups.</span></span>
<span class="line"><span> * &lt;li&gt;&lt;b&gt;Host&lt;/b&gt; - Representation of a virtual host containing a number</span></span>
<span class="line"><span> *     of Contexts.</span></span>
<span class="line"><span> * &lt;li&gt;&lt;b&gt;Context&lt;/b&gt; - Representation of a single ServletContext, which will</span></span>
<span class="line"><span> *     typically contain one or more Wrappers for the supported servlets.</span></span>
<span class="line"><span> * &lt;li&gt;&lt;b&gt;Wrapper&lt;/b&gt; - Representation of an individual servlet definition</span></span>
<span class="line"><span> *     (which may support multiple servlet instances if the servlet itself</span></span>
<span class="line"><span> *     implements SingleThreadModel).</span></span>
<span class="line"><span> * &lt;/ul&gt;</span></span></code></pre></div><p><strong>Engine</strong> - 表示整个catalina的servlet引擎，多数情况下包含<strong>一个或多个</strong>子容器，这些子容器要么是Host，要么是Context实现，或者是其他自定义组。</p><p><strong>Host</strong> - 表示包含多个Context的虚拟主机的。</p><p><strong>Context</strong> — 表示一个ServletContext，表示一个webapp，它通常包含一个或多个wrapper。</p><p><strong>Wrapper</strong> - 表示一个servlet定义的（如果servlet本身实现了SingleThreadModel，则可能支持多个servlet实例）。</p><ul><li><strong>结合整体的框架图中上述组件部分，我们看下包含了什么</strong>？</li></ul><p><img src="`+a+`" alt="error.图片加载失败"></p><p>很明显，除了四个组件的嵌套关系，Container中还包含了Realm，Cluster，Listeners, Pipleline等支持组件。</p><p>这一点，还可以通过相关注释可以看出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>**Loader** - Class loader to use for integrating new Java classes for this Container into the JVM in which Catalina is running.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Logger** - Implementation of the log() method signatures of the ServletContext interface.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Manager** - Manager for the pool of Sessions associated with this Container.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Realm** - Read-only interface to a security domain, for authenticating user identities and their corresponding roles.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Resources** - JNDI directory context enabling access to static resources, enabling custom linkages to existing server components when Catalina is embedded in a larger server.</span></span></code></pre></div><h2 id="container的设计" tabindex="-1">Container的设计 <a class="header-anchor" href="#container的设计" aria-label="Permalink to &quot;Container的设计&quot;">​</a></h2><blockquote><p>这container应该包含哪些接口呢？如果你看源代码它包含二十多个接口，这里理解的时候一定要分组去理解。</p></blockquote><h3 id="container的层次结构方法" tabindex="-1">Container的层次结构方法 <a class="header-anchor" href="#container的层次结构方法" aria-label="Permalink to &quot;Container的层次结构方法&quot;">​</a></h3><p>查找父容器的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Get the parent container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return Return the Container for which this Container is a child, if</span></span>
<span class="line"><span>  *         there is one. If there is no defined parent, return</span></span>
<span class="line"><span>  *         &lt;code&gt;null&lt;/code&gt;.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Container getParent();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the parent Container to which this Container is being added as a</span></span>
<span class="line"><span>  * child.  This Container may refuse to become attached to the specified</span></span>
<span class="line"><span>  * Container by throwing an exception.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param container Container to which this Container is being added</span></span>
<span class="line"><span>  *  as a child</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception IllegalArgumentException if this Container refuses to become</span></span>
<span class="line"><span>  *  attached to the specified Container</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setParent(Container container);</span></span></code></pre></div><p>由于Engine显然上层是Service，所以里面加了一个getService的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the Service to which this container belongs.</span></span>
<span class="line"><span>  * @param container The container to start from</span></span>
<span class="line"><span>  * @return the Service, or null if not found</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public static Service getService(Container container) {</span></span>
<span class="line"><span>    while (container != null &amp;&amp; !(container instanceof Engine)) {</span></span>
<span class="line"><span>        container = container.getParent();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (container == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ((Engine) container).getService();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>类比树接口，有Parent方法，那肯定也child方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a new child Container to those associated with this Container,</span></span>
<span class="line"><span>  * if supported.  Prior to adding this Container to the set of children,</span></span>
<span class="line"><span>  * the child&#39;s &lt;code&gt;setParent()&lt;/code&gt; method must be called, with this</span></span>
<span class="line"><span>  * Container as an argument.  This method may thrown an</span></span>
<span class="line"><span>  * &lt;code&gt;IllegalArgumentException&lt;/code&gt; if this Container chooses not</span></span>
<span class="line"><span>  * to be attached to the specified Container, in which case it is not added</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param child New child Container to be added</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception IllegalArgumentException if this exception is thrown by</span></span>
<span class="line"><span>  *  the &lt;code&gt;setParent()&lt;/code&gt; method of the child Container</span></span>
<span class="line"><span>  * @exception IllegalArgumentException if the new child does not have</span></span>
<span class="line"><span>  *  a name unique from that of existing children of this Container</span></span>
<span class="line"><span>  * @exception IllegalStateException if this Container does not support</span></span>
<span class="line"><span>  *  child Containers</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void addChild(Container child);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the child Containers associated with this Container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return An array containing all children of this container. If this</span></span>
<span class="line"><span>  *         Container has no children, a zero-length array is returned.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Container[] findChildren();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Remove an existing child Container from association with this parent</span></span>
<span class="line"><span>  * Container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param child Existing child Container to be removed</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void removeChild(Container child);</span></span></code></pre></div><h3 id="container事件监听相关方法" tabindex="-1">Container事件监听相关方法 <a class="header-anchor" href="#container事件监听相关方法" aria-label="Permalink to &quot;Container事件监听相关方法&quot;">​</a></h3><p>前文我们也分析过Tomcat的事件监听机制，Container也是一样， 比如如下的ContainerListener</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a container event listener to this component.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param listener The listener to add</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void addContainerListener(ContainerListener listener);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the container listeners associated with this Container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return An array containing the container listeners associated with this</span></span>
<span class="line"><span>  *         Container. If this Container has no registered container</span></span>
<span class="line"><span>  *         listeners, a zero-length array is returned.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public ContainerListener[] findContainerListeners();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Remove a container event listener from this component.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param listener The listener to remove</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void removeContainerListener(ContainerListener listener);</span></span></code></pre></div><p>除了Container级别的，和前文我们理解的一样，还有属性相关的Listener, 显然就增删属性的监听方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Remove a property change listener from this component.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param listener The listener to remove</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void removePropertyChangeListener(PropertyChangeListener listener);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a property change listener to this component.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param listener The listener to add</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void addPropertyChangeListener(PropertyChangeListener listener);</span></span></code></pre></div><p>最后显然还有事件的触发方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Notify all container event listeners that a particular event has</span></span>
<span class="line"><span>  * occurred for this Container.  The default implementation performs</span></span>
<span class="line"><span>  * this notification synchronously using the calling thread.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param type Event type</span></span>
<span class="line"><span>  * @param data Event data</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void fireContainerEvent(String type, Object data);</span></span></code></pre></div><h3 id="container功能支撑方法" tabindex="-1">Container功能支撑方法 <a class="header-anchor" href="#container功能支撑方法" aria-label="Permalink to &quot;Container功能支撑方法&quot;">​</a></h3><p>前面我们知道，Loader, Logger, Manager, Realm, Resources等支撑功能。这里简单看下接口定义，相关基本实现看下节ContainerBase的实现。</p><ul><li>Loader</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Get the parent class loader.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return the parent class loader for this component. If not set, return</span></span>
<span class="line"><span>  *         {@link #getParent()}.{@link #getParentClassLoader()}. If no</span></span>
<span class="line"><span>  *         parent has been set, return the system class loader.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public ClassLoader getParentClassLoader();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the parent class loader for this component. For {@link Context}s</span></span>
<span class="line"><span>  * this call is meaningful only &lt;strong&gt;before&lt;/strong&gt; a Loader has</span></span>
<span class="line"><span>  * been configured, and the specified value (if non-null) should be</span></span>
<span class="line"><span>  * passed as an argument to the class loader constructor.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param parent The new parent class loader</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setParentClassLoader(ClassLoader parent);</span></span></code></pre></div><ul><li>Logger</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the log to which events for this container should be logged.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return The Logger with which this Container is associated.  If there is</span></span>
<span class="line"><span>  *         no associated Logger, return the Logger associated with the</span></span>
<span class="line"><span>  *         parent Container (if any); otherwise return &lt;code&gt;null&lt;/code&gt;.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Log getLogger();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the logger name that the container will use.</span></span>
<span class="line"><span>  * @return the abbreviated name of this container for logging messages</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getLogName();</span></span></code></pre></div><ul><li>Manager</li></ul><p>体现在我们之前分析的JMX管理</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the JMX name for this container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return the JMX name associated with this container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public ObjectName getObjectName();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the JMX domain under which this container will be / has been</span></span>
<span class="line"><span>  * registered.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return The JMX domain name</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getDomain();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Calculate the key properties string to be added to an object&#39;s</span></span>
<span class="line"><span>  * {@link ObjectName} to indicate that it is associated with this container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return          A string suitable for appending to the ObjectName</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getMBeanKeyProperties();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the number of threads available for starting and stopping any</span></span>
<span class="line"><span>  * children associated with this container. This allows start/stop calls to</span></span>
<span class="line"><span>  * children to be processed in parallel.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return The currently configured number of threads used to start/stop</span></span>
<span class="line"><span>  *         children associated with this container</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public int getStartStopThreads();</span></span></code></pre></div><ul><li>Realm</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the Realm with which this Container is associated.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return The associated Realm; if there is no associated Realm, the</span></span>
<span class="line"><span>  *         Realm associated with the parent Container (if any); otherwise</span></span>
<span class="line"><span>  *         return &lt;code&gt;null&lt;/code&gt;.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Realm getRealm();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the Realm with which this Container is associated.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param realm The newly associated Realm</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setRealm(Realm realm);</span></span></code></pre></div><ul><li>Cluster</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Get the Cluster for this container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return The Cluster with which this Container is associated. If there is</span></span>
<span class="line"><span>  *         no associated Cluster, return the Cluster associated with our</span></span>
<span class="line"><span>  *         parent Container (if any); otherwise return &lt;code&gt;null&lt;/code&gt;.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Cluster getCluster();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the Cluster with which this Container is associated.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param cluster the Cluster with which this Container is associated.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setCluster(Cluster cluster);</span></span></code></pre></div><ul><li>其它</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Return a name string (suitable for use by humans) that describes this</span></span>
<span class="line"><span>  * Container.  Within the set of child containers belonging to a particular</span></span>
<span class="line"><span>  * parent, Container names must be unique.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return The human readable name of this container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public String getName();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set a name string (suitable for use by humans) that describes this</span></span>
<span class="line"><span>  * Container.  Within the set of child containers belonging to a particular</span></span>
<span class="line"><span>  * parent, Container names must be unique.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param name New name of this container</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception IllegalStateException if this Container has already been</span></span>
<span class="line"><span>  *  added to the children of a parent Container (after which the name</span></span>
<span class="line"><span>  *  may not be changed)</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setName(String name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Sets the number of threads available for starting and stopping any</span></span>
<span class="line"><span>  * children associated with this container. This allows start/stop calls to</span></span>
<span class="line"><span>  * children to be processed in parallel.</span></span>
<span class="line"><span>  * @param   startStopThreads    The new number of threads to be used</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void setStartStopThreads(int startStopThreads);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the location of CATALINA_BASE.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return  The location of CATALINA_BASE.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public File getCatalinaBase();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Obtain the location of CATALINA_HOME.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @return The location of CATALINA_HOME.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public File getCatalinaHome();</span></span></code></pre></div><h2 id="container基本实现-containerbase" tabindex="-1">Container基本实现：ContainerBase <a class="header-anchor" href="#container基本实现-containerbase" aria-label="Permalink to &quot;Container基本实现：ContainerBase&quot;">​</a></h2><blockquote><p>就讲讲几个比较核心的</p></blockquote><h3 id="logger" tabindex="-1">Logger <a class="header-anchor" href="#logger" aria-label="Permalink to &quot;Logger&quot;">​</a></h3><p>日志记录器，比较简单，直接看代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the Logger for this Container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Log getLogger() {</span></span>
<span class="line"><span>    if (logger != null)</span></span>
<span class="line"><span>        return logger;</span></span>
<span class="line"><span>    logger = LogFactory.getLog(getLogName());</span></span>
<span class="line"><span>    return logger;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * @return the abbreviated name of this container for logging messages</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public String getLogName() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (logName != null) {</span></span>
<span class="line"><span>        return logName;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    String loggerName = null;</span></span>
<span class="line"><span>    Container current = this;</span></span>
<span class="line"><span>    while (current != null) {</span></span>
<span class="line"><span>        String name = current.getName();</span></span>
<span class="line"><span>        if ((name == null) || (name.equals(&quot;&quot;))) {</span></span>
<span class="line"><span>            name = &quot;/&quot;;</span></span>
<span class="line"><span>        } else if (name.startsWith(&quot;##&quot;)) {</span></span>
<span class="line"><span>            name = &quot;/&quot; + name;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        loggerName = &quot;[&quot; + name + &quot;]&quot;</span></span>
<span class="line"><span>            + ((loggerName != null) ? (&quot;.&quot; + loggerName) : &quot;&quot;);</span></span>
<span class="line"><span>        current = current.getParent();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    logName = ContainerBase.class.getName() + &quot;.&quot; + loggerName;</span></span>
<span class="line"><span>    return logName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="cluster" tabindex="-1">Cluster <a class="header-anchor" href="#cluster" aria-label="Permalink to &quot;Cluster&quot;">​</a></h3><ul><li><code>getCluster</code>：读锁，获取子类的cluster，如果没有则返回父类的cluster；</li><li><code>getClusterInternal</code>: 读锁，获取子类的cluster</li><li><code>setCluster</code>: 写锁，设置container的cluster；由于cluster具备生命周期，所以需要对停止旧的cluster，启动新的cluster；设置成功后，再触发cluster变更事件。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * The cluster with which this Container is associated.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected Cluster cluster = null;</span></span>
<span class="line"><span>private final ReadWriteLock clusterLock = new ReentrantReadWriteLock();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * The parent Container to which this Container is a child.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected Container parent = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the Cluster with which this Container is associated.  If there is</span></span>
<span class="line"><span>  * no associated Cluster, return the Cluster associated with our parent</span></span>
<span class="line"><span>  * Container (if any); otherwise return &lt;code&gt;null&lt;/code&gt;.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Cluster getCluster() {</span></span>
<span class="line"><span>    Lock readLock = clusterLock.readLock();</span></span>
<span class="line"><span>    readLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (cluster != null)</span></span>
<span class="line"><span>            return cluster;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (parent != null)</span></span>
<span class="line"><span>            return parent.getCluster();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        readLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>  * Provide access to just the cluster component attached to this container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected Cluster getClusterInternal() {</span></span>
<span class="line"><span>    Lock readLock = clusterLock.readLock();</span></span>
<span class="line"><span>    readLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        return cluster;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        readLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set the Cluster with which this Container is associated.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param cluster The newly associated Cluster</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setCluster(Cluster cluster) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Cluster oldCluster = null;</span></span>
<span class="line"><span>    Lock writeLock = clusterLock.writeLock();</span></span>
<span class="line"><span>    writeLock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // Change components if necessary</span></span>
<span class="line"><span>        oldCluster = this.cluster;</span></span>
<span class="line"><span>        if (oldCluster == cluster)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        this.cluster = cluster;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Stop the old component if necessary</span></span>
<span class="line"><span>        if (getState().isAvailable() &amp;&amp; (oldCluster != null) &amp;&amp;</span></span>
<span class="line"><span>            (oldCluster instanceof Lifecycle)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) oldCluster).stop();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;containerBase.cluster.stop&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Start the new component if necessary</span></span>
<span class="line"><span>        if (cluster != null)</span></span>
<span class="line"><span>            cluster.setContainer(this);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (getState().isAvailable() &amp;&amp; (cluster != null) &amp;&amp;</span></span>
<span class="line"><span>            (cluster instanceof Lifecycle)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) cluster).start();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;containerBase.cluster.start&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        writeLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Report this property change to interested listeners</span></span>
<span class="line"><span>    support.firePropertyChange(&quot;cluster&quot;, oldCluster, cluster);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="realm" tabindex="-1">Realm <a class="header-anchor" href="#realm" aria-label="Permalink to &quot;Realm&quot;">​</a></h3><p>Realm和上面的Cluster方法基本一致。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Return the Realm with which this Container is associated.  If there is</span></span>
<span class="line"><span> * no associated Realm, return the Realm associated with our parent</span></span>
<span class="line"><span> * Container (if any); otherwise return &lt;code&gt;null&lt;/code&gt;.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Realm getRealm() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Lock l = realmLock.readLock();</span></span>
<span class="line"><span>    l.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (realm != null)</span></span>
<span class="line"><span>            return realm;</span></span>
<span class="line"><span>        if (parent != null)</span></span>
<span class="line"><span>            return parent.getRealm();</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        l.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected Realm getRealmInternal() {</span></span>
<span class="line"><span>    Lock l = realmLock.readLock();</span></span>
<span class="line"><span>    l.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        return realm;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        l.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Set the Realm with which this Container is associated.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param realm The newly associated Realm</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setRealm(Realm realm) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Lock l = realmLock.writeLock();</span></span>
<span class="line"><span>    l.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // Change components if necessary</span></span>
<span class="line"><span>        Realm oldRealm = this.realm;</span></span>
<span class="line"><span>        if (oldRealm == realm)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        this.realm = realm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Stop the old component if necessary</span></span>
<span class="line"><span>        if (getState().isAvailable() &amp;&amp; (oldRealm != null) &amp;&amp;</span></span>
<span class="line"><span>            (oldRealm instanceof Lifecycle)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) oldRealm).stop();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;containerBase.realm.stop&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Start the new component if necessary</span></span>
<span class="line"><span>        if (realm != null)</span></span>
<span class="line"><span>            realm.setContainer(this);</span></span>
<span class="line"><span>        if (getState().isAvailable() &amp;&amp; (realm != null) &amp;&amp;</span></span>
<span class="line"><span>            (realm instanceof Lifecycle)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                ((Lifecycle) realm).start();</span></span>
<span class="line"><span>            } catch (LifecycleException e) {</span></span>
<span class="line"><span>                log.error(sm.getString(&quot;containerBase.realm.start&quot;), e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Report this property change to interested listeners</span></span>
<span class="line"><span>        support.firePropertyChange(&quot;realm&quot;, oldRealm, this.realm);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        l.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="name等属性" tabindex="-1">name等属性 <a class="header-anchor" href="#name等属性" aria-label="Permalink to &quot;name等属性&quot;">​</a></h3><p>此类属性改变时触发属性变更事件，比如name是容器的名字，name变更会触发name变更事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * The human-readable name of this Container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected String name = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Return a name string (suitable for use by humans) that describes this</span></span>
<span class="line"><span>  * Container.  Within the set of child containers belonging to a particular</span></span>
<span class="line"><span>  * parent, Container names must be unique.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public String getName() {</span></span>
<span class="line"><span>    return name;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Set a name string (suitable for use by humans) that describes this</span></span>
<span class="line"><span>  * Container.  Within the set of child containers belonging to a particular</span></span>
<span class="line"><span>  * parent, Container names must be unique.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param name New name of this container</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception IllegalStateException if this Container has already been</span></span>
<span class="line"><span>  *  added to the children of a parent Container (after which the name</span></span>
<span class="line"><span>  *  may not be changed)</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void setName(String name) {</span></span>
<span class="line"><span>    if (name == null) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(sm.getString(&quot;containerBase.nullName&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    String oldName = this.name;</span></span>
<span class="line"><span>    this.name = name;</span></span>
<span class="line"><span>    support.firePropertyChange(&quot;name&quot;, oldName, this.name);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="child相关" tabindex="-1">child相关 <a class="header-anchor" href="#child相关" aria-label="Permalink to &quot;child相关&quot;">​</a></h3><p>添加子容器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Add a new child Container to those associated with this Container,</span></span>
<span class="line"><span>  * if supported.  Prior to adding this Container to the set of children,</span></span>
<span class="line"><span>  * the child&#39;s &lt;code&gt;setParent()&lt;/code&gt; method must be called, with this</span></span>
<span class="line"><span>  * Container as an argument.  This method may thrown an</span></span>
<span class="line"><span>  * &lt;code&gt;IllegalArgumentException&lt;/code&gt; if this Container chooses not</span></span>
<span class="line"><span>  * to be attached to the specified Container, in which case it is not added</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param child New child Container to be added</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception IllegalArgumentException if this exception is thrown by</span></span>
<span class="line"><span>  *  the &lt;code&gt;setParent()&lt;/code&gt; method of the child Container</span></span>
<span class="line"><span>  * @exception IllegalArgumentException if the new child does not have</span></span>
<span class="line"><span>  *  a name unique from that of existing children of this Container</span></span>
<span class="line"><span>  * @exception IllegalStateException if this Container does not support</span></span>
<span class="line"><span>  *  child Containers</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void addChild(Container child) {</span></span>
<span class="line"><span>    if (Globals.IS_SECURITY_ENABLED) {</span></span>
<span class="line"><span>        PrivilegedAction&lt;Void&gt; dp =</span></span>
<span class="line"><span>            new PrivilegedAddChild(child);</span></span>
<span class="line"><span>        AccessController.doPrivileged(dp);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        addChildInternal(child);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void addChildInternal(Container child) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (log.isDebugEnabled()) {</span></span>
<span class="line"><span>        log.debug(&quot;Add child &quot; + child + &quot; &quot; + this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    synchronized(children) {</span></span>
<span class="line"><span>        if (children.get(child.getName()) != null)</span></span>
<span class="line"><span>            throw new IllegalArgumentException(</span></span>
<span class="line"><span>                    sm.getString(&quot;containerBase.child.notUnique&quot;, child.getName()));</span></span>
<span class="line"><span>        child.setParent(this);  // May throw IAE 设置父容器</span></span>
<span class="line"><span>        children.put(child.getName(), child); // 使用map,方便通过name查找子容器</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fireContainerEvent(ADD_CHILD_EVENT, child); // 触发添加子容器的事件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start child // 注意下这里，没有将start方法放到synchronized的原因</span></span>
<span class="line"><span>    // Don&#39;t do this inside sync block - start can be a slow process and</span></span>
<span class="line"><span>    // locking the children object can cause problems elsewhere</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if ((getState().isAvailable() ||</span></span>
<span class="line"><span>                LifecycleState.STARTING_PREP.equals(getState())) &amp;&amp;</span></span>
<span class="line"><span>                startChildren) {</span></span>
<span class="line"><span>            child.start();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (LifecycleException e) {</span></span>
<span class="line"><span>        throw new IllegalStateException(sm.getString(&quot;containerBase.child.start&quot;), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>查找子容器</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the child Container, associated with this Container, with</span></span>
<span class="line"><span>  * the specified name (if any); otherwise, return &lt;code&gt;null&lt;/code&gt;</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param name Name of the child Container to be retrieved</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Container findChild(String name) {</span></span>
<span class="line"><span>    if (name == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    synchronized (children) {</span></span>
<span class="line"><span>        return children.get(name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>  * Return the set of children Containers associated with this Container.</span></span>
<span class="line"><span>  * If this Container has no children, a zero-length array is returned.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Container[] findChildren() {</span></span>
<span class="line"><span>    synchronized (children) {</span></span>
<span class="line"><span>        Container results[] = new Container[children.size()];</span></span>
<span class="line"><span>        return children.values().toArray(results);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>删除子容器</li></ul><p>子容器有生命周期，所以应该是先停止，然后销毁（distroy), 再触发删除事件，最后将children中子容器删除。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Remove an existing child Container from association with this parent</span></span>
<span class="line"><span>  * Container.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @param child Existing child Container to be removed</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void removeChild(Container child) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (child == null) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (child.getState().isAvailable()) {</span></span>
<span class="line"><span>            child.stop();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (LifecycleException e) {</span></span>
<span class="line"><span>        log.error(sm.getString(&quot;containerBase.child.stop&quot;), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean destroy = false;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // child.destroy() may have already been called which would have</span></span>
<span class="line"><span>        // triggered this call. If that is the case, no need to destroy the</span></span>
<span class="line"><span>        // child again.</span></span>
<span class="line"><span>        if (!LifecycleState.DESTROYING.equals(child.getState())) {</span></span>
<span class="line"><span>            child.destroy();</span></span>
<span class="line"><span>            destroy = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (LifecycleException e) {</span></span>
<span class="line"><span>        log.error(sm.getString(&quot;containerBase.child.destroy&quot;), e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!destroy) {</span></span>
<span class="line"><span>        fireContainerEvent(REMOVE_CHILD_EVENT, child);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    synchronized(children) {</span></span>
<span class="line"><span>        if (children.get(child.getName()) == null)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        children.remove(child.getName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="lifecycle的模板方法" tabindex="-1">Lifecycle的模板方法 <a class="header-anchor" href="#lifecycle的模板方法" aria-label="Permalink to &quot;Lifecycle的模板方法&quot;">​</a></h3><ul><li><strong>initInternal</strong></li></ul><p>startStopThreads 默认为 1 ，所以 reconfigureStartStopExecutor 方法会走 if 语句，而 startStopExecutor 最开始是没有赋值的，startStopExecutor instanceof InlineExecutorService 会返回 false，因此最终会执行 startStopExecutor = new InlineExecutorService()，InlineExecutorService 只是简单地实现了 java.util.concurrent.AbstractExecutorService 类。 最终 reconfigureStartStopExecutor 给 startStopExecutor 这个成员变量设置了，startStopExecutor。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * The number of threads available to process start and stop events for any</span></span>
<span class="line"><span>  * children associated with this container.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>private int startStopThreads = 1;</span></span>
<span class="line"><span>protected ExecutorService startStopExecutor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void initInternal() throws LifecycleException {</span></span>
<span class="line"><span>    reconfigureStartStopExecutor(getStartStopThreads()); // 设置一个线程池来处理子容器启动和关闭事件</span></span>
<span class="line"><span>    super.initInternal(); // 调用LifecycleMBeanBase的方法</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void reconfigureStartStopExecutor(int threads) {</span></span>
<span class="line"><span>    if (threads == 1) {</span></span>
<span class="line"><span>        // Use a fake executor</span></span>
<span class="line"><span>        if (!(startStopExecutor instanceof InlineExecutorService)) {</span></span>
<span class="line"><span>            startStopExecutor = new InlineExecutorService(); // 执行这里</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        // Delegate utility execution to the Service</span></span>
<span class="line"><span>        Server server = Container.getService(this).getServer();</span></span>
<span class="line"><span>        server.setUtilityThreads(threads);</span></span>
<span class="line"><span>        startStopExecutor = server.getUtilityExecutor();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>startInternal</strong></li></ul><p>试想，container中有很多组件，而且属于Lifecycle生命周期管理；那么启动容器的时候，必然是逐个将这些子组件（包括子容器）启动起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Start this component and implement the requirements</span></span>
<span class="line"><span>  * of {@link org.apache.catalina.util.LifecycleBase#startInternal()}.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>  *  that prevents this component from being used</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected synchronized void startInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start our subordinate components, if any</span></span>
<span class="line"><span>    logger = null;</span></span>
<span class="line"><span>    getLogger();</span></span>
<span class="line"><span>    Cluster cluster = getClusterInternal();</span></span>
<span class="line"><span>    if (cluster instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) cluster).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Realm realm = getRealmInternal();</span></span>
<span class="line"><span>    if (realm instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) realm).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start our child containers, if any</span></span>
<span class="line"><span>    Container children[] = findChildren();</span></span>
<span class="line"><span>    List&lt;Future&lt;Void&gt;&gt; results = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (Container child : children) {</span></span>
<span class="line"><span>        results.add(startStopExecutor.submit(new StartChild(child)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MultiThrowable multiThrowable = null; // 引入一个MultiThrowable，来收集多个异常</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (Future&lt;Void&gt; result : results) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            result.get();</span></span>
<span class="line"><span>        } catch (Throwable e) {</span></span>
<span class="line"><span>            log.error(sm.getString(&quot;containerBase.threadedStartFailed&quot;), e);</span></span>
<span class="line"><span>            if (multiThrowable == null) {</span></span>
<span class="line"><span>                multiThrowable = new MultiThrowable();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            multiThrowable.add(e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (multiThrowable != null) {</span></span>
<span class="line"><span>        throw new LifecycleException(sm.getString(&quot;containerBase.threadedStartFailed&quot;),</span></span>
<span class="line"><span>                multiThrowable.getThrowable());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Start the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>    if (pipeline instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) pipeline).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setState(LifecycleState.STARTING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 看这个，本质是调用最上层server的utilityExecutorWrapper 线程池去执行 ContainerBackgroundProcessorMonitor 任务</span></span>
<span class="line"><span>    if (backgroundProcessorDelay &gt; 0) {</span></span>
<span class="line"><span>        monitorFuture = Container.getService(ContainerBase.this).getServer()</span></span>
<span class="line"><span>                .getUtilityExecutor().scheduleWithFixedDelay(</span></span>
<span class="line"><span>                        new ContainerBackgroundProcessorMonitor(), 0, 60, TimeUnit.SECONDS);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>stopInternal</strong></li></ul><p>和initInternal初始化子组件方式倒过来，逐一停止子组件，并触发相关事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Stop this component and implement the requirements</span></span>
<span class="line"><span>  * of {@link org.apache.catalina.util.LifecycleBase#stopInternal()}.</span></span>
<span class="line"><span>  *</span></span>
<span class="line"><span>  * @exception LifecycleException if this component detects a fatal error</span></span>
<span class="line"><span>  *  that prevents this component from being used</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected synchronized void stopInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stop our thread</span></span>
<span class="line"><span>    if (monitorFuture != null) {</span></span>
<span class="line"><span>        monitorFuture.cancel(true);</span></span>
<span class="line"><span>        monitorFuture = null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    threadStop();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setState(LifecycleState.STOPPING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stop the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>    if (pipeline instanceof Lifecycle &amp;&amp;</span></span>
<span class="line"><span>            ((Lifecycle) pipeline).getState().isAvailable()) {</span></span>
<span class="line"><span>        ((Lifecycle) pipeline).stop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stop our child containers, if any</span></span>
<span class="line"><span>    Container children[] = findChildren();</span></span>
<span class="line"><span>    List&lt;Future&lt;Void&gt;&gt; results = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (Container child : children) {</span></span>
<span class="line"><span>        results.add(startStopExecutor.submit(new StopChild(child)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean fail = false;</span></span>
<span class="line"><span>    for (Future&lt;Void&gt; result : results) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            result.get();</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            log.error(sm.getString(&quot;containerBase.threadedStopFailed&quot;), e);</span></span>
<span class="line"><span>            fail = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (fail) {</span></span>
<span class="line"><span>        throw new LifecycleException(</span></span>
<span class="line"><span>                sm.getString(&quot;containerBase.threadedStopFailed&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stop our subordinate components, if any</span></span>
<span class="line"><span>    Realm realm = getRealmInternal();</span></span>
<span class="line"><span>    if (realm instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) realm).stop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Cluster cluster = getClusterInternal();</span></span>
<span class="line"><span>    if (cluster instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) cluster).stop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>destroyInternal</strong></li></ul><p>对比下initInternal，它初始化了什么就destory什么</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void destroyInternal() throws LifecycleException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Realm realm = getRealmInternal();</span></span>
<span class="line"><span>    if (realm instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) realm).destroy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Cluster cluster = getClusterInternal();</span></span>
<span class="line"><span>    if (cluster instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) cluster).destroy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Stop the Valves in our pipeline (including the basic), if any</span></span>
<span class="line"><span>    if (pipeline instanceof Lifecycle) {</span></span>
<span class="line"><span>        ((Lifecycle) pipeline).destroy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Remove children now this container is being destroyed</span></span>
<span class="line"><span>    for (Container child : findChildren()) {</span></span>
<span class="line"><span>        removeChild(child);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Required if the child is destroyed directly.</span></span>
<span class="line"><span>    if (parent != null) {</span></span>
<span class="line"><span>        parent.removeChild(this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // If init fails, this may be null</span></span>
<span class="line"><span>    if (startStopExecutor != null) {</span></span>
<span class="line"><span>        startStopExecutor.shutdownNow();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    super.destroyInternal(); // 调用LifecycleMBeanBase的方法</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,89)]))}const C=p(c,[["render",r]]);export{f as __pageData,C as default};
