import{_ as s}from"./chunks/tomcat-x-start-1.Cdb8mF_w.js";import{_ as n,c as p,ai as e,o as t}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/tomcat/tomcat-x-start-2.png",b=JSON.parse('{"title":"Tomcat - 启动过程：初始化和启动流程","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-start.md","filePath":"framework/tomcat/tomcat-x-start.md","lastUpdated":1737706346000}'),o={name:"framework/tomcat/tomcat-x-start.md"};function i(c,a,r,d,m,u){return t(),p("div",null,a[0]||(a[0]=[e('<h1 id="tomcat-启动过程-初始化和启动流程" tabindex="-1">Tomcat - 启动过程：初始化和启动流程 <a class="header-anchor" href="#tomcat-启动过程-初始化和启动流程" aria-label="Permalink to &quot;Tomcat - 启动过程：初始化和启动流程&quot;">​</a></h1><blockquote><p>在有了Tomcat架构设计和源码入口以后，我们便可以开始真正读源码了。@pdai</p></blockquote><h2 id="总体流程" tabindex="-1">总体流程 <a class="header-anchor" href="#总体流程" aria-label="Permalink to &quot;总体流程&quot;">​</a></h2><blockquote><p>很多人在看框架代码的时候会很难抓住重点的，而一开始了解整体流程会很大程度提升理解的效率。@pdai</p></blockquote><p>我们看下整体的初始化和启动的流程，在<strong>理解的时候可以直接和Tomcat架构设计中组件关联上</strong>：</p><p><img src="'+s+`" alt="error.图片加载失败"></p><h2 id="代码浅析" tabindex="-1">代码浅析 <a class="header-anchor" href="#代码浅析" aria-label="Permalink to &quot;代码浅析&quot;">​</a></h2><p>看了下网上关于Tomcat的文章，很多直接关注在纯代码的分析，这种是很难的；我建议你一定要把代码加载进来自己看一下，然后这里我把它转化为核心的几个问题来帮助你理解。@pdai</p><h3 id="bootstrap主入口" tabindex="-1">Bootstrap主入口？ <a class="header-anchor" href="#bootstrap主入口" aria-label="Permalink to &quot;Bootstrap主入口？&quot;">​</a></h3><p>Tomcat源码就从它的main方法开始。Tomcat的main方法在org.apache.catalina.startup.Bootstrap 里。 如下代码我们就是创建一个 Bootstrap 对象，调用它的 init 方法初始化，然后根据启动参数，分别调用 Bootstrap 对象的不同方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class Bootstrap {</span></span>
<span class="line"><span>    ……</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Daemon object used by main.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final Object daemonLock = new Object();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ……</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>   /**</span></span>
<span class="line"><span>     * Main method and entry point when starting Tomcat via the provided</span></span>
<span class="line"><span>     * scripts.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param args Command line arguments to be processed</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void main(String args[]) {</span></span>
<span class="line"><span>        // 创建一个 Bootstrap 对象，调用它的 init 方法初始化</span></span>
<span class="line"><span>        synchronized (daemonLock) {</span></span>
<span class="line"><span>            if (daemon == null) {</span></span>
<span class="line"><span>                // Don&#39;t set daemon until init() has completed</span></span>
<span class="line"><span>                Bootstrap bootstrap = new Bootstrap();</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    bootstrap.init();</span></span>
<span class="line"><span>                } catch (Throwable t) {</span></span>
<span class="line"><span>                    handleThrowable(t);</span></span>
<span class="line"><span>                    t.printStackTrace();</span></span>
<span class="line"><span>                    return;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                daemon = bootstrap;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                // When running as a service the call to stop will be on a new</span></span>
<span class="line"><span>                // thread so make sure the correct class loader is used to</span></span>
<span class="line"><span>                // prevent a range of class not found exceptions.</span></span>
<span class="line"><span>                Thread.currentThread().setContextClassLoader(daemon.catalinaLoader);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 根据启动参数，分别调用 Bootstrap 对象的不同方法</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            String command = &quot;start&quot;; // 默认是start</span></span>
<span class="line"><span>            if (args.length &gt; 0) {</span></span>
<span class="line"><span>                command = args[args.length - 1];</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (command.equals(&quot;startd&quot;)) {</span></span>
<span class="line"><span>                args[args.length - 1] = &quot;start&quot;;</span></span>
<span class="line"><span>                daemon.load(args);</span></span>
<span class="line"><span>                daemon.start();</span></span>
<span class="line"><span>            } else if (command.equals(&quot;stopd&quot;)) {</span></span>
<span class="line"><span>                args[args.length - 1] = &quot;stop&quot;;</span></span>
<span class="line"><span>                daemon.stop();</span></span>
<span class="line"><span>            } else if (command.equals(&quot;start&quot;)) {</span></span>
<span class="line"><span>                daemon.setAwait(true);</span></span>
<span class="line"><span>                daemon.load(args);</span></span>
<span class="line"><span>                daemon.start();</span></span>
<span class="line"><span>                if (null == daemon.getServer()) {</span></span>
<span class="line"><span>                    System.exit(1);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else if (command.equals(&quot;stop&quot;)) {</span></span>
<span class="line"><span>                daemon.stopServer(args);</span></span>
<span class="line"><span>            } else if (command.equals(&quot;configtest&quot;)) {</span></span>
<span class="line"><span>                daemon.load(args);</span></span>
<span class="line"><span>                if (null == daemon.getServer()) {</span></span>
<span class="line"><span>                    System.exit(1);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                System.exit(0);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                log.warn(&quot;Bootstrap: command \\&quot;&quot; + command + &quot;\\&quot; does not exist.&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Throwable t) {</span></span>
<span class="line"><span>            // Unwrap the Exception for clearer error reporting</span></span>
<span class="line"><span>            if (t instanceof InvocationTargetException &amp;&amp;</span></span>
<span class="line"><span>                    t.getCause() != null) {</span></span>
<span class="line"><span>                t = t.getCause();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            handleThrowable(t);</span></span>
<span class="line"><span>            t.printStackTrace();</span></span>
<span class="line"><span>            System.exit(1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ……</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="bootstrap如何初始化catalina的" tabindex="-1">Bootstrap如何初始化Catalina的？ <a class="header-anchor" href="#bootstrap如何初始化catalina的" aria-label="Permalink to &quot;Bootstrap如何初始化Catalina的？&quot;">​</a></h3><p>我们用<code>Sequence Diagram</code>插件来看main方法的时序图，但是可以发现它并没有帮我们画出Bootstrap初始化Catalina的过程，这和上面的组件初始化不符合？</p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>让我们带着这个为看下Catalina的初始化的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 初始化守护进程</span></span>
<span class="line"><span>  * </span></span>
<span class="line"><span>  * @throws Exception Fatal initialization error</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public void init() throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化classloader（包括catalinaLoader），下文将具体分析</span></span>
<span class="line"><span>    initClassLoaders();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置当前的线程的contextClassLoader为catalinaLoader</span></span>
<span class="line"><span>    Thread.currentThread().setContextClassLoader(catalinaLoader);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    SecurityClassLoad.securityClassLoad(catalinaLoader);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 通过catalinaLoader加载Catalina，并初始化startupInstance 对象</span></span>
<span class="line"><span>    if (log.isDebugEnabled())</span></span>
<span class="line"><span>        log.debug(&quot;Loading startup class&quot;);</span></span>
<span class="line"><span>    Class&lt;?&gt; startupClass = catalinaLoader.loadClass(&quot;org.apache.catalina.startup.Catalina&quot;);</span></span>
<span class="line"><span>    Object startupInstance = startupClass.getConstructor().newInstance();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 通过反射调用了setParentClassLoader 方法</span></span>
<span class="line"><span>    if (log.isDebugEnabled())</span></span>
<span class="line"><span>        log.debug(&quot;Setting startup class properties&quot;);</span></span>
<span class="line"><span>    String methodName = &quot;setParentClassLoader&quot;;</span></span>
<span class="line"><span>    Class&lt;?&gt; paramTypes[] = new Class[1];</span></span>
<span class="line"><span>    paramTypes[0] = Class.forName(&quot;java.lang.ClassLoader&quot;);</span></span>
<span class="line"><span>    Object paramValues[] = new Object[1];</span></span>
<span class="line"><span>    paramValues[0] = sharedLoader;</span></span>
<span class="line"><span>    Method method =</span></span>
<span class="line"><span>        startupInstance.getClass().getMethod(methodName, paramTypes);</span></span>
<span class="line"><span>    method.invoke(startupInstance, paramValues);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    catalinaDaemon = startupInstance;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面几行关键代码的注释，我们就可以看出Catalina是如何初始化的。这里还留下一个问题，tomcat为什么要初始化不同的classloader呢？我们将在下文进行详解。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,18)]))}const q=n(o,[["render",i]]);export{b as __pageData,q as default};
