import{_ as n}from"./chunks/spring-springframework-aop-71.BAAuNawc.js";import{_ as a,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const m=JSON.parse('{"title":"Spring进阶 - Spring AOP实现原理详解之JDK代理实现","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-aop-source-4.md","filePath":"spring/spring-x-framework-aop-source-4.md","lastUpdated":1737706346000}'),i={name:"spring/spring-x-framework-aop-source-4.md"};function t(c,s,r,o,d,h){return l(),p("div",null,s[0]||(s[0]=[e(`<h1 id="spring进阶-spring-aop实现原理详解之jdk代理实现" tabindex="-1">Spring进阶 - Spring AOP实现原理详解之JDK代理实现 <a class="header-anchor" href="#spring进阶-spring-aop实现原理详解之jdk代理实现" aria-label="Permalink to &quot;Spring进阶 - Spring AOP实现原理详解之JDK代理实现&quot;">​</a></h1><blockquote><p>上文我们学习了SpringAOP Cglib动态代理的实现，本文主要是SpringAOP JDK动态代理的案例和实现部分。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>上文我们学习了SpringAOP Cglib动态代理的实现，本文主要是SpringAOP JDK动态代理的案例和实现部分。</p></blockquote><h3 id="什么是jdk代理" tabindex="-1">什么是JDK代理? <a class="header-anchor" href="#什么是jdk代理" aria-label="Permalink to &quot;什么是JDK代理?&quot;">​</a></h3><p>JDK动态代理是有JDK提供的工具类Proxy实现的，动态代理类是在运行时生成指定接口的代理类，每个代理实例（实现需要代理的接口）都有一个关联的调用处理程序对象，此对象实现了InvocationHandler，最终的业务逻辑是在InvocationHandler实现类的invoke方法上。</p><h2 id="jdk代理的案例" tabindex="-1">JDK代理的案例 <a class="header-anchor" href="#jdk代理的案例" aria-label="Permalink to &quot;JDK代理的案例&quot;">​</a></h2><blockquote><p>这里我们写一个使用jdk代理的简单例子。@pdai</p></blockquote><h3 id="不需要maven依赖" tabindex="-1">不需要maven依赖 <a class="header-anchor" href="#不需要maven依赖" aria-label="Permalink to &quot;不需要maven依赖&quot;">​</a></h3><p>jdk代理不需要任何依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
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
<span class="line"><span>    &lt;artifactId&gt;006-spring-framework-demo-aop-proxy-jdk&lt;/artifactId&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;properties&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.source&gt;8&lt;/maven.compiler.source&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.target&gt;8&lt;/maven.compiler.target&gt;</span></span>
<span class="line"><span>    &lt;/properties&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!--based on jdk proxy --&gt;</span></span>
<span class="line"><span>    &lt;dependencies&gt;</span></span>
<span class="line"><span></span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h3 id="被代理的类和接口" tabindex="-1">被代理的类和接口 <a class="header-anchor" href="#被代理的类和接口" aria-label="Permalink to &quot;被代理的类和接口&quot;">​</a></h3><p>接口如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IUserService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    List&lt;User&gt; findUserList();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * add user</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    void addUser();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实现类如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Collections;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserServiceImpl implements IUserService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;User&gt; findUserList() {</span></span>
<span class="line"><span>        return Collections.singletonList(new User(&quot;pdai&quot;, 18));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * add user</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addUser() {</span></span>
<span class="line"><span>        // do something</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="jdk代理类" tabindex="-1">JDK代理类 <a class="header-anchor" href="#jdk代理类" aria-label="Permalink to &quot;JDK代理类&quot;">​</a></h3><p>代理类如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.proxy;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.service.IUserService;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.reflect.InvocationHandler;</span></span>
<span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span>import java.lang.reflect.Proxy;</span></span>
<span class="line"><span>import java.util.Arrays;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * This class is for proxy demo.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserLogProxy {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * proxy target</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private IUserService target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param target target</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public UserLogProxy(UserServiceImpl target) {</span></span>
<span class="line"><span>        super();</span></span>
<span class="line"><span>        this.target = target;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * get proxy.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return proxy target</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public IUserService getLoggingProxy() {</span></span>
<span class="line"><span>        IUserService proxy;</span></span>
<span class="line"><span>        ClassLoader loader = target.getClass().getClassLoader();</span></span>
<span class="line"><span>        Class[] interfaces = new Class[]{IUserService.class};</span></span>
<span class="line"><span>        InvocationHandler h = new InvocationHandler() {</span></span>
<span class="line"><span>            /**</span></span>
<span class="line"><span>             * proxy: 代理对象。 一般不使用该对象 method: 正在被调用的方法 args: 调用方法传入的参数</span></span>
<span class="line"><span>             */</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {</span></span>
<span class="line"><span>                String methodName = method.getName();</span></span>
<span class="line"><span>                // log - before method</span></span>
<span class="line"><span>                System.out.println(&quot;[before] execute method: &quot; + methodName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // call method</span></span>
<span class="line"><span>                Object result = null;</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    // 前置通知</span></span>
<span class="line"><span>                    result = method.invoke(target, args);</span></span>
<span class="line"><span>                    // 返回通知, 可以访问到方法的返回值</span></span>
<span class="line"><span>                } catch (NullPointerException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                    // 异常通知, 可以访问到方法出现的异常</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // 后置通知. 因为方法可以能会出异常, 所以访问不到方法的返回值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // log - after method</span></span>
<span class="line"><span>                System.out.println(&quot;[after] execute method: &quot; + methodName + &quot;, return value: &quot; + result);</span></span>
<span class="line"><span>                return result;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        /**</span></span>
<span class="line"><span>         * loader: 代理对象使用的类加载器.</span></span>
<span class="line"><span>         * interfaces: 指定代理对象的类型. 即代理代理对象中可以有哪些方法.</span></span>
<span class="line"><span>         * h: 当具体调用代理对象的方法时, 应该如何进行响应, 实际上就是调用 InvocationHandler 的 invoke 方法</span></span>
<span class="line"><span>         */</span></span>
<span class="line"><span>        proxy = (IUserService) Proxy.newProxyInstance(loader, interfaces, h);</span></span>
<span class="line"><span>        return proxy;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="使用代理" tabindex="-1">使用代理 <a class="header-anchor" href="#使用代理" aria-label="Permalink to &quot;使用代理&quot;">​</a></h3><p>启动类中指定代理目标并执行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.proxy.UserLogProxy;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.IUserService;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Jdk proxy demo.</span></span>
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
<span class="line"><span>        IUserService userService = new UserLogProxy(new UserServiceImpl()).getLoggingProxy();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // call methods</span></span>
<span class="line"><span>        userService.findUserList();</span></span>
<span class="line"><span>        userService.addUser();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="简单测试" tabindex="-1">简单测试 <a class="header-anchor" href="#简单测试" aria-label="Permalink to &quot;简单测试&quot;">​</a></h3><p>我们启动上述类main 函数，执行的结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[before] execute method: findUserList</span></span>
<span class="line"><span>[after] execute method: findUserList, return value: [User{name=&#39;pdai&#39;, age=18}]</span></span>
<span class="line"><span>[before] execute method: addUser</span></span>
<span class="line"><span>[after] execute method: addUser, return value: null</span></span></code></pre></div><h2 id="jdk代理的流程" tabindex="-1">JDK代理的流程 <a class="header-anchor" href="#jdk代理的流程" aria-label="Permalink to &quot;JDK代理的流程&quot;">​</a></h2><blockquote><p>JDK代理自动生成的class是由sun.misc.ProxyGenerator来生成的。</p></blockquote><h3 id="proxygenerator生成代码" tabindex="-1">ProxyGenerator生成代码 <a class="header-anchor" href="#proxygenerator生成代码" aria-label="Permalink to &quot;ProxyGenerator生成代码&quot;">​</a></h3><p>我们看下sun.misc.ProxyGenerator生成代码的逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Generate a proxy class given a name and a list of proxy interfaces.</span></span>
<span class="line"><span>    *</span></span>
<span class="line"><span>    * @param name        the class name of the proxy class</span></span>
<span class="line"><span>    * @param interfaces  proxy interfaces</span></span>
<span class="line"><span>    * @param accessFlags access flags of the proxy class</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>public static byte[] generateProxyClass(final String name,</span></span>
<span class="line"><span>                                        Class&lt;?&gt;[] interfaces,</span></span>
<span class="line"><span>                                        int accessFlags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ProxyGenerator gen = new ProxyGenerator(name, interfaces, accessFlags);</span></span>
<span class="line"><span>    final byte[] classFile = gen.generateClassFile();</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>generateClassFile方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Generate a class file for the proxy class.  This method drives the</span></span>
<span class="line"><span>    * class file generation process.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>private byte[] generateClassFile() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 第一步：将所有方法包装成ProxyMethod对象 */</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 将Object类中hashCode、equals、toString方法包装成ProxyMethod对象</span></span>
<span class="line"><span>    addProxyMethod(hashCodeMethod, Object.class);</span></span>
<span class="line"><span>    addProxyMethod(equalsMethod, Object.class);</span></span>
<span class="line"><span>    addProxyMethod(toStringMethod, Object.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将代理类接口方法包装成ProxyMethod对象</span></span>
<span class="line"><span>    for (Class&lt;?&gt; intf : interfaces) {</span></span>
<span class="line"><span>        for (Method m : intf.getMethods()) {</span></span>
<span class="line"><span>            addProxyMethod(m, intf);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 校验返回类型</span></span>
<span class="line"><span>    for (List&lt;ProxyMethod&gt; sigmethods : proxyMethods.values()) {</span></span>
<span class="line"><span>        checkReturnTypes(sigmethods);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 第二步：为代理类组装字段，构造函数，方法，static初始化块等 */</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 添加构造函数，参数是InvocationHandler</span></span>
<span class="line"><span>        methods.add(generateConstructor());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 代理方法</span></span>
<span class="line"><span>        for (List&lt;ProxyMethod&gt; sigmethods : proxyMethods.values()) {</span></span>
<span class="line"><span>            for (ProxyMethod pm : sigmethods) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // 字段</span></span>
<span class="line"><span>                fields.add(new FieldInfo(pm.methodFieldName,</span></span>
<span class="line"><span>                    &quot;Ljava/lang/reflect/Method;&quot;,</span></span>
<span class="line"><span>                        ACC_PRIVATE | ACC_STATIC));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                // 上述ProxyMethod中的方法</span></span>
<span class="line"><span>                methods.add(pm.generateMethod());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // static初始化块</span></span>
<span class="line"><span>        methods.add(generateStaticInitializer());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        throw new InternalError(&quot;unexpected I/O Exception&quot;, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (methods.size() &gt; 65535) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;method limit exceeded&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (fields.size() &gt; 65535) {</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&quot;field limit exceeded&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 第三步：写入class文件 */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Make sure that constant pool indexes are reserved for the</span></span>
<span class="line"><span>        * following items before starting to write the final class file.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    cp.getClass(dotToSlash(className));</span></span>
<span class="line"><span>    cp.getClass(superclassName);</span></span>
<span class="line"><span>    for (Class&lt;?&gt; intf: interfaces) {</span></span>
<span class="line"><span>        cp.getClass(dotToSlash(intf.getName()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Disallow new constant pool additions beyond this point, since</span></span>
<span class="line"><span>        * we are about to write the final constant pool table.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    cp.setReadOnly();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ByteArrayOutputStream bout = new ByteArrayOutputStream();</span></span>
<span class="line"><span>    DataOutputStream dout = new DataOutputStream(bout);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>            * Write all the items of the &quot;ClassFile&quot; structure.</span></span>
<span class="line"><span>            * See JVMS section 4.1.</span></span>
<span class="line"><span>            */</span></span>
<span class="line"><span>                                    // u4 magic;</span></span>
<span class="line"><span>        dout.writeInt(0xCAFEBABE);</span></span>
<span class="line"><span>                                    // u2 minor_version;</span></span>
<span class="line"><span>        dout.writeShort(CLASSFILE_MINOR_VERSION);</span></span>
<span class="line"><span>                                    // u2 major_version;</span></span>
<span class="line"><span>        dout.writeShort(CLASSFILE_MAJOR_VERSION);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        cp.write(dout);             // (write constant pool)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                                    // u2 access_flags;</span></span>
<span class="line"><span>        dout.writeShort(accessFlags);</span></span>
<span class="line"><span>                                    // u2 this_class;</span></span>
<span class="line"><span>        dout.writeShort(cp.getClass(dotToSlash(className)));</span></span>
<span class="line"><span>                                    // u2 super_class;</span></span>
<span class="line"><span>        dout.writeShort(cp.getClass(superclassName));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                                    // u2 interfaces_count;</span></span>
<span class="line"><span>        dout.writeShort(interfaces.length);</span></span>
<span class="line"><span>                                    // u2 interfaces[interfaces_count];</span></span>
<span class="line"><span>        for (Class&lt;?&gt; intf : interfaces) {</span></span>
<span class="line"><span>            dout.writeShort(cp.getClass(</span></span>
<span class="line"><span>                dotToSlash(intf.getName())));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                                    // u2 fields_count;</span></span>
<span class="line"><span>        dout.writeShort(fields.size());</span></span>
<span class="line"><span>                                    // field_info fields[fields_count];</span></span>
<span class="line"><span>        for (FieldInfo f : fields) {</span></span>
<span class="line"><span>            f.write(dout);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                                    // u2 methods_count;</span></span>
<span class="line"><span>        dout.writeShort(methods.size());</span></span>
<span class="line"><span>                                    // method_info methods[methods_count];</span></span>
<span class="line"><span>        for (MethodInfo m : methods) {</span></span>
<span class="line"><span>            m.write(dout);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                                        // u2 attributes_count;</span></span>
<span class="line"><span>        dout.writeShort(0); // (no ClassFile attributes for proxy classes)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        throw new InternalError(&quot;unexpected I/O Exception&quot;, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return bout.toByteArray();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>一共三个步骤（<strong>把大象装进冰箱分几步</strong>？）：</p><ul><li>第一步：（把冰箱门打开）准备工作，将所有方法包装成ProxyMethod对象，包括Object类中hashCode、equals、toString方法，以及被代理的接口中的方法</li><li>第二步：（把大象装进去）为代理类组装字段，构造函数，方法，static初始化块等</li><li>第三步：（把冰箱门带上）写入class文件</li></ul><h3 id="从生成的proxy代码看执行流程" tabindex="-1">从生成的Proxy代码看执行流程 <a class="header-anchor" href="#从生成的proxy代码看执行流程" aria-label="Permalink to &quot;从生成的Proxy代码看执行流程&quot;">​</a></h3><p>从上述sun.misc.ProxyGenerator类中可以看到，这个类里面有一个配置参数<code>sun.misc.ProxyGenerator.saveGeneratedFiles</code>，可以通过这个参数将生成的Proxy类保存在本地，比如设置为true 执行后，生成的文件如下：</p><p><img src="`+n+`" alt="error.图片加载失败"></p><p>我们看下生成后的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//</span></span>
<span class="line"><span>// Source code recreated from a .class file by IntelliJ IDEA</span></span>
<span class="line"><span>// (powered by FernFlower decompiler)</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package com.sun.proxy;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.reflect.InvocationHandler;</span></span>
<span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span>import java.lang.reflect.Proxy;</span></span>
<span class="line"><span>import java.lang.reflect.UndeclaredThrowableException;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.IUserService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 所有类和方法都是final类型的</span></span>
<span class="line"><span>public final class $Proxy0 extends Proxy implements IUserService {</span></span>
<span class="line"><span>    private static Method m1;</span></span>
<span class="line"><span>    private static Method m3;</span></span>
<span class="line"><span>    private static Method m2;</span></span>
<span class="line"><span>    private static Method m0;</span></span>
<span class="line"><span>    private static Method m4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 构造函数注入 InvocationHandler</span></span>
<span class="line"><span>    public $Proxy0(InvocationHandler var1) throws  {</span></span>
<span class="line"><span>        super(var1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final boolean equals(Object var1) throws  {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            return (Boolean)super.h.invoke(this, m1, new Object[]{var1});</span></span>
<span class="line"><span>        } catch (RuntimeException | Error var3) {</span></span>
<span class="line"><span>            throw var3;</span></span>
<span class="line"><span>        } catch (Throwable var4) {</span></span>
<span class="line"><span>            throw new UndeclaredThrowableException(var4);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final List findUserList() throws  {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            return (List)super.h.invoke(this, m3, (Object[])null);</span></span>
<span class="line"><span>        } catch (RuntimeException | Error var2) {</span></span>
<span class="line"><span>            throw var2;</span></span>
<span class="line"><span>        } catch (Throwable var3) {</span></span>
<span class="line"><span>            throw new UndeclaredThrowableException(var3);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final String toString() throws  {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            return (String)super.h.invoke(this, m2, (Object[])null);</span></span>
<span class="line"><span>        } catch (RuntimeException | Error var2) {</span></span>
<span class="line"><span>            throw var2;</span></span>
<span class="line"><span>        } catch (Throwable var3) {</span></span>
<span class="line"><span>            throw new UndeclaredThrowableException(var3);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final int hashCode() throws  {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            return (Integer)super.h.invoke(this, m0, (Object[])null);</span></span>
<span class="line"><span>        } catch (RuntimeException | Error var2) {</span></span>
<span class="line"><span>            throw var2;</span></span>
<span class="line"><span>        } catch (Throwable var3) {</span></span>
<span class="line"><span>            throw new UndeclaredThrowableException(var3);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final void addUser() throws  {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            super.h.invoke(this, m4, (Object[])null);</span></span>
<span class="line"><span>        } catch (RuntimeException | Error var2) {</span></span>
<span class="line"><span>            throw var2;</span></span>
<span class="line"><span>        } catch (Throwable var3) {</span></span>
<span class="line"><span>            throw new UndeclaredThrowableException(var3);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 初始化 methods, 2个IUserService接口中的方法，3个Object中的接口</span></span>
<span class="line"><span>            m1 = Class.forName(&quot;java.lang.Object&quot;).getMethod(&quot;equals&quot;, Class.forName(&quot;java.lang.Object&quot;));</span></span>
<span class="line"><span>            m3 = Class.forName(&quot;tech.pdai.springframework.service.IUserService&quot;).getMethod(&quot;findUserList&quot;);</span></span>
<span class="line"><span>            m2 = Class.forName(&quot;java.lang.Object&quot;).getMethod(&quot;toString&quot;);</span></span>
<span class="line"><span>            m0 = Class.forName(&quot;java.lang.Object&quot;).getMethod(&quot;hashCode&quot;);</span></span>
<span class="line"><span>            m4 = Class.forName(&quot;tech.pdai.springframework.service.IUserService&quot;).getMethod(&quot;addUser&quot;);</span></span>
<span class="line"><span>        } catch (NoSuchMethodException var2) {</span></span>
<span class="line"><span>            throw new NoSuchMethodError(var2.getMessage());</span></span>
<span class="line"><span>        } catch (ClassNotFoundException var3) {</span></span>
<span class="line"><span>            throw new NoClassDefFoundError(var3.getMessage());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码是比较容易理解的，我就不画图了。</p><p>主要流程是：</p><ul><li>ProxyGenerator创建Proxy的具体类$Proxy0</li><li>由static初始化块初始化接口方法：2个IUserService接口中的方法，3个Object中的接口方法</li><li>由构造函数注入InvocationHandler</li><li>执行的时候，通过ProxyGenerator创建的Proxy，调用InvocationHandler的invoke方法，执行我们自定义的invoke方法</li></ul><h2 id="springaop中jdk代理的实现" tabindex="-1">SpringAOP中JDK代理的实现 <a class="header-anchor" href="#springaop中jdk代理的实现" aria-label="Permalink to &quot;SpringAOP中JDK代理的实现&quot;">​</a></h2><p>SpringAOP扮演的是JDK代理的创建和调用两个角色，我们通过这两个方向来看下SpringAOP的代码（JdkDynamicAopProxy类）</p><h3 id="springaop-jdk代理的创建" tabindex="-1">SpringAOP Jdk代理的创建 <a class="header-anchor" href="#springaop-jdk代理的创建" aria-label="Permalink to &quot;SpringAOP Jdk代理的创建&quot;">​</a></h3><p>代理的创建比较简单，调用getProxy方法，然后直接调用JDK中Proxy.newProxyInstance()方法将classloader和被代理的接口方法传入即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Object getProxy() {</span></span>
<span class="line"><span>    return getProxy(ClassUtils.getDefaultClassLoader());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Object getProxy(@Nullable ClassLoader classLoader) {</span></span>
<span class="line"><span>    if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>        logger.trace(&quot;Creating JDK dynamic proxy: &quot; + this.advised.getTargetSource());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Proxy.newProxyInstance(classLoader, this.proxiedInterfaces, this);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="springaop-jdk代理的执行" tabindex="-1">SpringAOP Jdk代理的执行 <a class="header-anchor" href="#springaop-jdk代理的执行" aria-label="Permalink to &quot;SpringAOP Jdk代理的执行&quot;">​</a></h3><p>执行的方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Implementation of {@code InvocationHandler.invoke}.</span></span>
<span class="line"><span>    * &lt;p&gt;Callers will see exactly the exception thrown by the target,</span></span>
<span class="line"><span>    * unless a hook method throws an exception.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {</span></span>
<span class="line"><span>    Object oldProxy = null;</span></span>
<span class="line"><span>    boolean setProxyContext = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    TargetSource targetSource = this.advised.targetSource;</span></span>
<span class="line"><span>    Object target = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 执行的是equal方法</span></span>
<span class="line"><span>        if (!this.equalsDefined &amp;&amp; AopUtils.isEqualsMethod(method)) {</span></span>
<span class="line"><span>            // The target does not implement the equals(Object) method itself.</span></span>
<span class="line"><span>            return equals(args[0]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 执行的是hashcode方法</span></span>
<span class="line"><span>        else if (!this.hashCodeDefined &amp;&amp; AopUtils.isHashCodeMethod(method)) {</span></span>
<span class="line"><span>            // The target does not implement the hashCode() method itself.</span></span>
<span class="line"><span>            return hashCode();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 如果是包装类，则dispatch to proxy config</span></span>
<span class="line"><span>        else if (method.getDeclaringClass() == DecoratingProxy.class) {</span></span>
<span class="line"><span>            // There is only getDecoratedClass() declared -&gt; dispatch to proxy config.</span></span>
<span class="line"><span>            return AopProxyUtils.ultimateTargetClass(this.advised);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 用反射方式来执行切点</span></span>
<span class="line"><span>        else if (!this.advised.opaque &amp;&amp; method.getDeclaringClass().isInterface() &amp;&amp;</span></span>
<span class="line"><span>                method.getDeclaringClass().isAssignableFrom(Advised.class)) {</span></span>
<span class="line"><span>            // Service invocations on ProxyConfig with the proxy config...</span></span>
<span class="line"><span>            return AopUtils.invokeJoinpointUsingReflection(this.advised, method, args);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Object retVal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (this.advised.exposeProxy) {</span></span>
<span class="line"><span>            // Make invocation available if necessary.</span></span>
<span class="line"><span>            oldProxy = AopContext.setCurrentProxy(proxy);</span></span>
<span class="line"><span>            setProxyContext = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Get as late as possible to minimize the time we &quot;own&quot; the target,</span></span>
<span class="line"><span>        // in case it comes from a pool.</span></span>
<span class="line"><span>        target = targetSource.getTarget();</span></span>
<span class="line"><span>        Class&lt;?&gt; targetClass = (target != null ? target.getClass() : null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 获取拦截链</span></span>
<span class="line"><span>        List&lt;Object&gt; chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Check whether we have any advice. If we don&#39;t, we can fallback on direct</span></span>
<span class="line"><span>        // reflective invocation of the target, and avoid creating a MethodInvocation.</span></span>
<span class="line"><span>        if (chain.isEmpty()) {</span></span>
<span class="line"><span>            // We can skip creating a MethodInvocation: just invoke the target directly</span></span>
<span class="line"><span>            // Note that the final invoker must be an InvokerInterceptor so we know it does</span></span>
<span class="line"><span>            // nothing but a reflective operation on the target, and no hot swapping or fancy proxying.</span></span>
<span class="line"><span>            Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);</span></span>
<span class="line"><span>            retVal = AopUtils.invokeJoinpointUsingReflection(target, method, argsToUse);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            // We need to create a method invocation...</span></span>
<span class="line"><span>            MethodInvocation invocation =</span></span>
<span class="line"><span>                    new ReflectiveMethodInvocation(proxy, target, method, args, targetClass, chain);</span></span>
<span class="line"><span>            // Proceed to the joinpoint through the interceptor chain.</span></span>
<span class="line"><span>            retVal = invocation.proceed();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Massage return value if necessary.</span></span>
<span class="line"><span>        Class&lt;?&gt; returnType = method.getReturnType();</span></span>
<span class="line"><span>        if (retVal != null &amp;&amp; retVal == target &amp;&amp;</span></span>
<span class="line"><span>                returnType != Object.class &amp;&amp; returnType.isInstance(proxy) &amp;&amp;</span></span>
<span class="line"><span>                !RawTargetAccess.class.isAssignableFrom(method.getDeclaringClass())) {</span></span>
<span class="line"><span>            // Special case: it returned &quot;this&quot; and the return type of the method</span></span>
<span class="line"><span>            // is type-compatible. Note that we can&#39;t help if the target sets</span></span>
<span class="line"><span>            // a reference to itself in another returned object.</span></span>
<span class="line"><span>            retVal = proxy;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (retVal == null &amp;&amp; returnType != Void.TYPE &amp;&amp; returnType.isPrimitive()) {</span></span>
<span class="line"><span>            throw new AopInvocationException(</span></span>
<span class="line"><span>                    &quot;Null return value from advice does not match primitive return type for: &quot; + method);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return retVal;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    finally {</span></span>
<span class="line"><span>        if (target != null &amp;&amp; !targetSource.isStatic()) {</span></span>
<span class="line"><span>            // Must have come from TargetSource.</span></span>
<span class="line"><span>            targetSource.releaseTarget(target);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (setProxyContext) {</span></span>
<span class="line"><span>            // Restore old proxy.</span></span>
<span class="line"><span>            AopContext.setCurrentProxy(oldProxy);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,56)]))}const v=a(i,[["render",t]]);export{m as __pageData,v as default};
