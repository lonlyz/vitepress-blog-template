import{_ as a}from"./chunks/spring-springframework-aop-63.CDaCunzX.js";import{_ as n,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/pics/a6c20f60-5eba-427d-9413-352ada4b40fe.png",t="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-61.png",c="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-62.png",r="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-64.png",f=JSON.parse('{"title":"Spring进阶 - Spring AOP实现原理详解之Cglib代理实现","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-aop-source-3.md","filePath":"spring/spring-x-framework-aop-source-3.md","lastUpdated":1737706346000}'),o={name:"spring/spring-x-framework-aop-source-3.md"};function d(g,s,h,b,u,m){return l(),p("div",null,s[0]||(s[0]=[e('<h1 id="spring进阶-spring-aop实现原理详解之cglib代理实现" tabindex="-1">Spring进阶 - Spring AOP实现原理详解之Cglib代理实现 <a class="header-anchor" href="#spring进阶-spring-aop实现原理详解之cglib代理实现" aria-label="Permalink to &quot;Spring进阶 - Spring AOP实现原理详解之Cglib代理实现&quot;">​</a></h1><blockquote><p>我们在前文中已经介绍了SpringAOP的切面实现和创建动态代理的过程，那么动态代理是如何工作的呢？本文主要介绍Cglib动态代理的案例和SpringAOP实现的原理。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>我们在前文中已经介绍了SpringAOP的切面实现和创建动态代理的过程，那么动态代理是如何工作的呢？本文主要介绍Cglib动态代理的案例和SpringAOP实现的原理。</p></blockquote><p>要了解动态代理是如何工作的，首先需要了解</p><ul><li>什么是代理模式？</li><li>什么是动态代理？</li><li>什么是Cglib？</li><li>SpringAOP和Cglib是什么关系？</li></ul><h3 id="动态代理要解决什么问题" tabindex="-1">动态代理要解决什么问题？ <a class="header-anchor" href="#动态代理要解决什么问题" aria-label="Permalink to &quot;动态代理要解决什么问题？&quot;">​</a></h3><h4 id="什么是代理" tabindex="-1">什么是代理？ <a class="header-anchor" href="#什么是代理" aria-label="Permalink to &quot;什么是代理？&quot;">​</a></h4><p><strong>代理模式</strong>(Proxy pattern): 为另一个对象提供一个替身或占位符以控制对这个对象的访问</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>举个简单的例子：</p><p>我(client)如果要买(doOperation)房，可以找中介(proxy)买房，中介直接和卖方(target)买房。中介和卖方都实现买卖(doOperation)的操作。中介就是代理(proxy)。</p><h4 id="什么是动态代理" tabindex="-1">什么是动态代理？ <a class="header-anchor" href="#什么是动态代理" aria-label="Permalink to &quot;什么是动态代理？&quot;">​</a></h4><blockquote><p>动态代理就是，在程序运行期，创建目标对象的代理对象，并对目标对象中的方法进行功能性增强的一种技术。</p></blockquote><p>在生成代理对象的过程中，目标对象不变，代理对象中的方法是目标对象方法的增强方法。可以理解为运行期间，对象中方法的动态拦截，在拦截方法的前后执行功能操作。</p><p><img src="'+t+'" alt="error.图片加载失败"></p><h3 id="什么是cglib-springaop和cglib是什么关系" tabindex="-1">什么是Cglib? SpringAOP和Cglib是什么关系？ <a class="header-anchor" href="#什么是cglib-springaop和cglib是什么关系" aria-label="Permalink to &quot;什么是Cglib? SpringAOP和Cglib是什么关系？&quot;">​</a></h3><blockquote><p>Cglib是一个强大的、高性能的代码生成包，它广泛被许多AOP框架使用，为他们提供方法的拦截。</p></blockquote><p><img src="'+c+`" alt="error.图片加载失败"></p><ul><li>最底层是字节码，字节码相关的知识请参考 <a href="https://pdai.tech/md/java/jvm/java-jvm-class.html" target="_blank" rel="noreferrer">JVM基础 - 类字节码详解</a></li><li>ASM是操作字节码的工具</li><li>cglib基于ASM字节码工具操作字节码（即动态生成代理，对方法进行增强）</li><li>SpringAOP基于cglib进行封装，实现cglib方式的动态代理</li></ul><h2 id="cglib代理的案例" tabindex="-1">Cglib代理的案例 <a class="header-anchor" href="#cglib代理的案例" aria-label="Permalink to &quot;Cglib代理的案例&quot;">​</a></h2><blockquote><p>这里我们写一个使用cglib的简单例子。@pdai</p></blockquote><h3 id="pom包依赖" tabindex="-1">pom包依赖 <a class="header-anchor" href="#pom包依赖" aria-label="Permalink to &quot;pom包依赖&quot;">​</a></h3><p>引入cglib的依赖包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span></span>
<span class="line"><span>         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;</span></span>
<span class="line"><span>    &lt;parent&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;tech-pdai-spring-demos&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;tech.pdai&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/parent&gt;</span></span>
<span class="line"><span>    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;artifactId&gt;007-spring-framework-demo-aop-proxy-cglib&lt;/artifactId&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;properties&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.source&gt;8&lt;/maven.compiler.source&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.target&gt;8&lt;/maven.compiler.target&gt;</span></span>
<span class="line"><span>    &lt;/properties&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;dependencies&gt;</span></span>
<span class="line"><span>        &lt;!-- https://mvnrepository.com/artifact/cglib/cglib --&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;cglib&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;cglib&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;3.3.0&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;/dependencies&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/project&gt;</span></span></code></pre></div><h3 id="定义实体" tabindex="-1">定义实体 <a class="header-anchor" href="#定义实体" aria-label="Permalink to &quot;定义实体&quot;">​</a></h3><p>User</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class User {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user&#39;s name.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user&#39;s age.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param name name</span></span>
<span class="line"><span>     * @param age  age</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public User(String name, int age) {</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>        this.age = age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setName(String name) {</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getAge() {</span></span>
<span class="line"><span>        return age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setAge(int age) {</span></span>
<span class="line"><span>        this.age = age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return &quot;User{&quot; +</span></span>
<span class="line"><span>                &quot;name=&#39;&quot; + name + &#39;\\&#39;&#39; +</span></span>
<span class="line"><span>                &quot;, age=&quot; + age +</span></span>
<span class="line"><span>                &#39;}&#39;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="被代理的类" tabindex="-1">被代理的类 <a class="header-anchor" href="#被代理的类" aria-label="Permalink to &quot;被代理的类&quot;">​</a></h3><p>即目标类, 对被代理的类中的方法进行增强</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Collections;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserServiceImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public List&lt;User&gt; findUserList() {</span></span>
<span class="line"><span>        return Collections.singletonList(new User(&quot;pdai&quot;, 18));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * add user</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void addUser() {</span></span>
<span class="line"><span>        // do something</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="cglib代理" tabindex="-1">cglib代理 <a class="header-anchor" href="#cglib代理" aria-label="Permalink to &quot;cglib代理&quot;">​</a></h3><p>cglib代理类，需要实现MethodInterceptor接口，并指定代理目标类target</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.proxy;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import net.sf.cglib.proxy.Enhancer;</span></span>
<span class="line"><span>import net.sf.cglib.proxy.MethodInterceptor;</span></span>
<span class="line"><span>import net.sf.cglib.proxy.MethodProxy;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * This class is for proxy demo.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserLogProxy implements MethodInterceptor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 业务类对象，供代理方法中进行真正的业务方法调用</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private Object target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object getUserLogProxy(Object target) {</span></span>
<span class="line"><span>        //给业务对象赋值</span></span>
<span class="line"><span>        this.target = target;</span></span>
<span class="line"><span>        //创建加强器，用来创建动态代理类</span></span>
<span class="line"><span>        Enhancer enhancer = new Enhancer();</span></span>
<span class="line"><span>        //为加强器指定要代理的业务类（即：为下面生成的代理类指定父类）</span></span>
<span class="line"><span>        enhancer.setSuperclass(this.target.getClass());</span></span>
<span class="line"><span>        //设置回调：对于代理类上所有方法的调用，都会调用CallBack，而Callback则需要实现intercept()方法进行拦</span></span>
<span class="line"><span>        enhancer.setCallback(this);</span></span>
<span class="line"><span>        // 创建动态代理类对象并返回</span></span>
<span class="line"><span>        return enhancer.create();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 实现回调方法</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {</span></span>
<span class="line"><span>        // log - before method</span></span>
<span class="line"><span>        System.out.println(&quot;[before] execute method: &quot; + method.getName());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // call method</span></span>
<span class="line"><span>        Object result = proxy.invokeSuper(obj, args);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // log - after method</span></span>
<span class="line"><span>        System.out.println(&quot;[after] execute method: &quot; + method.getName() + &quot;, return value: &quot; + result);</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="使用代理" tabindex="-1">使用代理 <a class="header-anchor" href="#使用代理" aria-label="Permalink to &quot;使用代理&quot;">​</a></h3><p>启动类中指定代理目标并执行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.proxy.UserLogProxy;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Cglib proxy demo.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class ProxyDemo {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * main interface.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param args args</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        // proxy</span></span>
<span class="line"><span>        UserServiceImpl userService = (UserServiceImpl) new UserLogProxy().getUserLogProxy(new UserServiceImpl());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // call methods</span></span>
<span class="line"><span>        userService.findUserList();</span></span>
<span class="line"><span>        userService.addUser();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="简单测试" tabindex="-1">简单测试 <a class="header-anchor" href="#简单测试" aria-label="Permalink to &quot;简单测试&quot;">​</a></h3><p>我们启动上述类main 函数，执行的结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[before] execute method: findUserList</span></span>
<span class="line"><span>[after] execute method: findUserList, return value: [User{name=&#39;pdai&#39;, age=18}]</span></span>
<span class="line"><span>[before] execute method: addUser</span></span>
<span class="line"><span>[after] execute method: addUser, return value: null</span></span></code></pre></div><h2 id="cglib代理的流程" tabindex="-1">Cglib代理的流程 <a class="header-anchor" href="#cglib代理的流程" aria-label="Permalink to &quot;Cglib代理的流程&quot;">​</a></h2><p>我们把上述Demo的主要流程画出来，你便能很快理解</p><p><img src="`+a+`" alt="error.图片加载失败"></p><p>更多细节：</p><ul><li>在上图中，我们可以通过在Enhancer中配置更多的参数来控制代理的行为，比如如果只希望增强这个类中的一个方法（而不是所有方法），那就增加callbackFilter来对目标类中方法进行过滤；Enhancer可以有更多的参数类配置其行为，不过我们在学习上述主要的流程就够了。</li><li>final方法为什么不能被代理？很显然final方法没法被子类覆盖，当然不能代理了。</li><li>Mockito为什么不能mock静态方法？因为mockito也是基于cglib动态代理来实现的，static方法也不能被子类覆盖，所以显然不能mock。但PowerMock可以mock静态方法，因为它直接在bytecode上工作，更多可以看<a href="https://pdai.tech/md/develop/ut/dev-ut-x-mockito.html" target="_blank" rel="noreferrer">Mockito单元测试</a>。（pdai: 通了没？是不是so easy...）</li></ul><h2 id="springaop中cglib代理的实现" tabindex="-1">SpringAOP中Cglib代理的实现 <a class="header-anchor" href="#springaop中cglib代理的实现" aria-label="Permalink to &quot;SpringAOP中Cglib代理的实现&quot;">​</a></h2><blockquote><p>SpringAOP封装了cglib，通过其进行动态代理的创建。</p></blockquote><p>我们看下CglibAopProxy的getProxy方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Object getProxy() {</span></span>
<span class="line"><span>  return getProxy(null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Object getProxy(@Nullable ClassLoader classLoader) {</span></span>
<span class="line"><span>  if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>    logger.trace(&quot;Creating CGLIB proxy: &quot; + this.advised.getTargetSource());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    Class&lt;?&gt; rootClass = this.advised.getTargetClass();</span></span>
<span class="line"><span>    Assert.state(rootClass != null, &quot;Target class must be available for creating a CGLIB proxy&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 上面流程图中的目标类</span></span>
<span class="line"><span>    Class&lt;?&gt; proxySuperClass = rootClass;</span></span>
<span class="line"><span>    if (rootClass.getName().contains(ClassUtils.CGLIB_CLASS_SEPARATOR)) {</span></span>
<span class="line"><span>      proxySuperClass = rootClass.getSuperclass();</span></span>
<span class="line"><span>      Class&lt;?&gt;[] additionalInterfaces = rootClass.getInterfaces();</span></span>
<span class="line"><span>      for (Class&lt;?&gt; additionalInterface : additionalInterfaces) {</span></span>
<span class="line"><span>        this.advised.addInterface(additionalInterface);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Validate the class, writing log messages as necessary.</span></span>
<span class="line"><span>    validateClassIfNecessary(proxySuperClass, classLoader);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重点看这里，就是上图的enhancer，设置各种参数来构建</span></span>
<span class="line"><span>    Enhancer enhancer = createEnhancer();</span></span>
<span class="line"><span>    if (classLoader != null) {</span></span>
<span class="line"><span>      enhancer.setClassLoader(classLoader);</span></span>
<span class="line"><span>      if (classLoader instanceof SmartClassLoader &amp;&amp;</span></span>
<span class="line"><span>          ((SmartClassLoader) classLoader).isClassReloadable(proxySuperClass)) {</span></span>
<span class="line"><span>        enhancer.setUseCache(false);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    enhancer.setSuperclass(proxySuperClass);</span></span>
<span class="line"><span>    enhancer.setInterfaces(AopProxyUtils.completeProxiedInterfaces(this.advised));</span></span>
<span class="line"><span>    enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);</span></span>
<span class="line"><span>    enhancer.setStrategy(new ClassLoaderAwareGeneratorStrategy(classLoader));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置callback回调接口，即方法的增强点</span></span>
<span class="line"><span>    Callback[] callbacks = getCallbacks(rootClass);</span></span>
<span class="line"><span>    Class&lt;?&gt;[] types = new Class&lt;?&gt;[callbacks.length];</span></span>
<span class="line"><span>    for (int x = 0; x &lt; types.length; x++) {</span></span>
<span class="line"><span>      types[x] = callbacks[x].getClass();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 上节说到的filter</span></span>
<span class="line"><span>    enhancer.setCallbackFilter(new ProxyCallbackFilter(</span></span>
<span class="line"><span>        this.advised.getConfigurationOnlyCopy(), this.fixedInterceptorMap, this.fixedInterceptorOffset));</span></span>
<span class="line"><span>    enhancer.setCallbackTypes(types);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重点：创建proxy和其实例</span></span>
<span class="line"><span>    return createProxyClassAndInstance(enhancer, callbacks);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (CodeGenerationException | IllegalArgumentException ex) {</span></span>
<span class="line"><span>    throw new AopConfigException(&quot;Could not generate CGLIB subclass of &quot; + this.advised.getTargetClass() +</span></span>
<span class="line"><span>        &quot;: Common causes of this problem include using a final class or a non-visible class&quot;,</span></span>
<span class="line"><span>        ex);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (Throwable ex) {</span></span>
<span class="line"><span>    // TargetSource.getTarget() failed</span></span>
<span class="line"><span>    throw new AopConfigException(&quot;Unexpected AOP exception&quot;, ex);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>获取callback的方法如下，提几个理解的要点吧，具体读者在学习的时候建议把我的例子跑一下，然后打一个断点进行理解。</p><ul><li><code>rootClass</code>: 即目标代理类</li><li><code>advised</code>: 包含上文中我们获取到的advisor增强器的集合</li><li><code>exposeProxy</code>: 在xml配置文件中配置的，背景就是如果在事务A中使用了代理，事务A调用了目标类的的方法a，在方法a中又调用目标类的方法b，方法a，b同时都是要被增强的方法，如果不配置exposeProxy属性，方法b的增强将会失效，如果配置exposeProxy，方法b在方法a的执行中也会被增强了</li><li><code>DynamicAdvisedInterceptor</code>: 拦截器将advised(包含上文中我们获取到的advisor增强器)构建配置的AOP的callback（第一个callback)</li><li><code>targetInterceptor</code>: xml配置的optimize属性使用的（第二个callback)</li><li>最后连同其它5个默认的Interceptor 返回作为cglib的拦截器链，之后通过CallbackFilter的accpet方法返回的索引从这个集合中返回对应的拦截增强器执行增强操作。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Callback[] getCallbacks(Class&lt;?&gt; rootClass) throws Exception {</span></span>
<span class="line"><span>  // Parameters used for optimization choices...</span></span>
<span class="line"><span>  boolean exposeProxy = this.advised.isExposeProxy();</span></span>
<span class="line"><span>  boolean isFrozen = this.advised.isFrozen();</span></span>
<span class="line"><span>  boolean isStatic = this.advised.getTargetSource().isStatic();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Choose an &quot;aop&quot; interceptor (used for AOP calls).</span></span>
<span class="line"><span>  Callback aopInterceptor = new DynamicAdvisedInterceptor(this.advised);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Choose a &quot;straight to target&quot; interceptor. (used for calls that are</span></span>
<span class="line"><span>  // unadvised but can return this). May be required to expose the proxy.</span></span>
<span class="line"><span>  Callback targetInterceptor;</span></span>
<span class="line"><span>  if (exposeProxy) {</span></span>
<span class="line"><span>    targetInterceptor = (isStatic ?</span></span>
<span class="line"><span>        new StaticUnadvisedExposedInterceptor(this.advised.getTargetSource().getTarget()) :</span></span>
<span class="line"><span>        new DynamicUnadvisedExposedInterceptor(this.advised.getTargetSource()));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    targetInterceptor = (isStatic ?</span></span>
<span class="line"><span>        new StaticUnadvisedInterceptor(this.advised.getTargetSource().getTarget()) :</span></span>
<span class="line"><span>        new DynamicUnadvisedInterceptor(this.advised.getTargetSource()));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Choose a &quot;direct to target&quot; dispatcher (used for</span></span>
<span class="line"><span>  // unadvised calls to static targets that cannot return this).</span></span>
<span class="line"><span>  Callback targetDispatcher = (isStatic ?</span></span>
<span class="line"><span>      new StaticDispatcher(this.advised.getTargetSource().getTarget()) : new SerializableNoOp());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Callback[] mainCallbacks = new Callback[] {</span></span>
<span class="line"><span>      aopInterceptor,  // </span></span>
<span class="line"><span>      targetInterceptor,  // invoke target without considering advice, if optimized</span></span>
<span class="line"><span>      new SerializableNoOp(),  // no override for methods mapped to this</span></span>
<span class="line"><span>      targetDispatcher, this.advisedDispatcher,</span></span>
<span class="line"><span>      new EqualsInterceptor(this.advised),</span></span>
<span class="line"><span>      new HashCodeInterceptor(this.advised)</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Callback[] callbacks;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // If the target is a static one and the advice chain is frozen,</span></span>
<span class="line"><span>  // then we can make some optimizations by sending the AOP calls</span></span>
<span class="line"><span>  // direct to the target using the fixed chain for that method.</span></span>
<span class="line"><span>  if (isStatic &amp;&amp; isFrozen) {</span></span>
<span class="line"><span>    Method[] methods = rootClass.getMethods();</span></span>
<span class="line"><span>    Callback[] fixedCallbacks = new Callback[methods.length];</span></span>
<span class="line"><span>    this.fixedInterceptorMap = CollectionUtils.newHashMap(methods.length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // TODO: small memory optimization here (can skip creation for methods with no advice)</span></span>
<span class="line"><span>    for (int x = 0; x &lt; methods.length; x++) {</span></span>
<span class="line"><span>      Method method = methods[x];</span></span>
<span class="line"><span>      List&lt;Object&gt; chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, rootClass);</span></span>
<span class="line"><span>      fixedCallbacks[x] = new FixedChainStaticTargetInterceptor(</span></span>
<span class="line"><span>          chain, this.advised.getTargetSource().getTarget(), this.advised.getTargetClass());</span></span>
<span class="line"><span>      this.fixedInterceptorMap.put(method, x);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Now copy both the callbacks from mainCallbacks</span></span>
<span class="line"><span>    // and fixedCallbacks into the callbacks array.</span></span>
<span class="line"><span>    callbacks = new Callback[mainCallbacks.length + fixedCallbacks.length];</span></span>
<span class="line"><span>    System.arraycopy(mainCallbacks, 0, callbacks, 0, mainCallbacks.length);</span></span>
<span class="line"><span>    System.arraycopy(fixedCallbacks, 0, callbacks, mainCallbacks.length, fixedCallbacks.length);</span></span>
<span class="line"><span>    this.fixedInterceptorOffset = mainCallbacks.length;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    callbacks = mainCallbacks;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return callbacks;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以结合调试，方便理解</p><p><img src="`+r+'" alt="error.图片加载失败"></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',57)]))}const x=n(o,[["render",d]]);export{f as __pageData,x as default};
