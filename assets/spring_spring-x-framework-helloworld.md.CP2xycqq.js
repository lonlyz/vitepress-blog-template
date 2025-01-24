import{_ as n}from"./chunks/spring-framework-helloworld-2.Dor-J5t1.js";import{_ as a,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-3.png",t="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-4.png",r="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-5.png",o="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-6.png",c="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-7.png",g="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-9.png",u="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-8.png",d="/vitepress-blog-template/images/spring/springframework/spring-framework-helloworld-10.png",x=JSON.parse('{"title":"Spring基础 - Spring简单例子引入Spring要点","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-helloworld.md","filePath":"spring/spring-x-framework-helloworld.md","lastUpdated":1737706346000}'),m={name:"spring/spring-x-framework-helloworld.md"};function h(v,s,b,f,k,w){return l(),p("div",null,s[0]||(s[0]=[e('<h1 id="spring基础-spring简单例子引入spring要点" tabindex="-1">Spring基础 - Spring简单例子引入Spring要点 <a class="header-anchor" href="#spring基础-spring简单例子引入spring要点" aria-label="Permalink to &quot;Spring基础 - Spring简单例子引入Spring要点&quot;">​</a></h1><blockquote><p><a href="https://pdai.tech/md/spring/spring-x-framework-introduce.html" target="_blank" rel="noreferrer">上文</a>中我们简单介绍了Spring和Spring Framework的组件，那么这些Spring Framework组件是如何配合工作的呢？本文主要承接上文，向你展示Spring Framework组件的典型应用场景和基于这个场景设计出的简单案例，并以此引出Spring的核心要点，比如IOC和AOP等；在此基础上还引入了不同的配置方式， 如XML，Java配置和注解方式的差异。@pdai</p></blockquote><h2 id="spring框架如何应用" tabindex="-1">Spring框架如何应用 <a class="header-anchor" href="#spring框架如何应用" aria-label="Permalink to &quot;Spring框架如何应用&quot;">​</a></h2><blockquote><p><a href="https://pdai.tech/md/spring/spring-x-framework-introduce.html" target="_blank" rel="noreferrer">上文</a>中，我们展示了Spring和Spring Framework的组件, 这里对于开发者来说有几个问题：</p><ol><li>首先，对于Spring进阶，直接去看IOC和AOP，存在一个断层，所以需要整体上构建对Spring框架认知上进一步深入，这样才能构建知识体系。</li><li>其次，很多开发者入门都是从Spring Boot开始的，他对Spring整体框架底层，以及发展历史不是很了解； 特别是对于一些老旧项目维护和底层bug分析没有全局观。</li><li>再者，Spring代表的是一种框架设计理念，需要全局上理解Spring Framework组件是如何配合工作的，需要理解它设计的初衷和未来趋势。</li></ol></blockquote><p>如下是官方在解释Spring框架的常用场景的图</p><p><img src="'+n+'" alt="error.图片加载失败"></p><p>我加上一些注释后，是比较好理解的；引入这个图，重要的原因是为后面设计一个案例帮助你构建认知。</p><h2 id="设计一个spring的hello-world" tabindex="-1">设计一个Spring的Hello World <a class="header-anchor" href="#设计一个spring的hello-world" aria-label="Permalink to &quot;设计一个Spring的Hello World&quot;">​</a></h2><blockquote><p>结合上面的使用场景，<strong>设计一个查询用户的案例的两个需求</strong>，来看Spring框架帮我们简化了什么开发工作:</p><ol><li><strong>查询用户数据</strong> - 来看DAO+POJO-&gt; Service 的初始化和装载。</li><li><strong>给所有Service的查询方法记录日志</strong></li></ol></blockquote><ul><li><strong>创建一个Maven的Java项目</strong></li></ul><p><img src="'+i+`" alt="error.图片加载失败"></p><ul><li><strong>引入Spring框架的POM依赖，以及查看这些依赖之间的关系</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span></span>
<span class="line"><span>         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;</span></span>
<span class="line"><span>    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;groupId&gt;tech.pdai&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;001-spring-framework-demo-helloworld-xml&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;properties&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.source&gt;8&lt;/maven.compiler.source&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.target&gt;8&lt;/maven.compiler.target&gt;</span></span>
<span class="line"><span>        &lt;spring.version&gt;5.3.9&lt;/spring.version&gt;</span></span>
<span class="line"><span>        &lt;aspectjweaver.version&gt;1.9.6&lt;/aspectjweaver.version&gt;</span></span>
<span class="line"><span>    &lt;/properties&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;dependencies&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-context&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;\${spring.version}&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;\${spring.version}&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-beans&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;\${spring.version}&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.aspectj&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;aspectjweaver&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;\${aspectjweaver.version}&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;/dependencies&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/project&gt;</span></span></code></pre></div><p><img src="`+t+`" alt="error.图片加载失败"></p><ul><li><strong>POJO - User</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.entity;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>DAO 获取 POJO， UserDaoServiceImpl (mock 数据)</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Collections;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserDaoImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public UserDaoImpl() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * mocked to find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public List&lt;User&gt; findUserList() {</span></span>
<span class="line"><span>        return Collections.singletonList(new User(&quot;pdai&quot;, 18));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>并增加daos.xml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>       xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>       xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans</span></span>
<span class="line"><span> http://www.springframework.org/schema/beans/spring-beans.xsd&quot;&gt;</span></span>
<span class="line"><span>    &lt;bean id=&quot;userDao&quot; class=&quot;tech.pdai.springframework.dao.UserDaoImpl&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- additional collaborators and configuration for this bean go here --&gt;</span></span>
<span class="line"><span>    &lt;/bean&gt;</span></span>
<span class="line"><span>    &lt;!-- more bean definitions for data access objects go here --&gt;</span></span>
<span class="line"><span>&lt;/beans&gt;</span></span></code></pre></div><ul><li><strong>业务层 UserServiceImpl（调用DAO层）</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tech.pdai.springframework.dao.UserDaoImpl;</span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserServiceImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user dao impl.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private UserDaoImpl userDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public UserServiceImpl() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public List&lt;User&gt; findUserList() {</span></span>
<span class="line"><span>        return this.userDao.findUserList();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * set dao.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param userDao user dao</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void setUserDao(UserDaoImpl userDao) {</span></span>
<span class="line"><span>        this.userDao = userDao;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>并增加services.xml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>       xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>       xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans</span></span>
<span class="line"><span> http://www.springframework.org/schema/beans/spring-beans.xsd&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- services --&gt;</span></span>
<span class="line"><span>    &lt;bean id=&quot;userService&quot; class=&quot;tech.pdai.springframework.service.UserServiceImpl&quot;&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;userDao&quot; ref=&quot;userDao&quot;/&gt;</span></span>
<span class="line"><span>        &lt;!-- additional collaborators and configuration for this bean go here --&gt;</span></span>
<span class="line"><span>    &lt;/bean&gt;</span></span>
<span class="line"><span>    &lt;!-- more bean definitions for services go here --&gt;</span></span>
<span class="line"><span>&lt;/beans&gt;</span></span></code></pre></div><ul><li><strong>拦截所有service中的方法，并输出记录</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.aspect;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.aspectj.lang.ProceedingJoinPoint;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Around;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Aspect;</span></span>
<span class="line"><span>import org.aspectj.lang.reflect.MethodSignature;</span></span>
<span class="line"><span>import org.springframework.context.annotation.EnableAspectJAutoProxy;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Aspect</span></span>
<span class="line"><span>public class LogAspect {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * aspect for every methods under service package.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Around(&quot;execution(* tech.pdai.springframework.service.*.*(..))&quot;)</span></span>
<span class="line"><span>    public Object businessService(ProceedingJoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        // get attribute through annotation</span></span>
<span class="line"><span>        Method method = ((MethodSignature) pjp.getSignature()).getMethod();</span></span>
<span class="line"><span>        System.out.println(&quot;execute method: &quot; + method.getName());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // continue to process</span></span>
<span class="line"><span>        return pjp.proceed();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>并增加aspects.xml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>       xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>       xmlns:aop=&quot;http://www.springframework.org/schema/aop&quot;</span></span>
<span class="line"><span>       xmlns:context=&quot;http://www.springframework.org/schema/context&quot;</span></span>
<span class="line"><span>       xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans</span></span>
<span class="line"><span> http://www.springframework.org/schema/beans/spring-beans.xsd</span></span>
<span class="line"><span> http://www.springframework.org/schema/aop</span></span>
<span class="line"><span> http://www.springframework.org/schema/aop/spring-aop.xsd</span></span>
<span class="line"><span> http://www.springframework.org/schema/context</span></span>
<span class="line"><span> http://www.springframework.org/schema/context/spring-context.xsd</span></span>
<span class="line"><span>&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;context:component-scan base-package=&quot;tech.pdai.springframework&quot; /&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;aop:aspectj-autoproxy/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;bean id=&quot;logAspect&quot; class=&quot;tech.pdai.springframework.aspect.LogAspect&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- configure properties of aspect here as normal --&gt;</span></span>
<span class="line"><span>    &lt;/bean&gt;</span></span>
<span class="line"><span>    &lt;!-- more bean definitions for data access objects go here --&gt;</span></span>
<span class="line"><span>&lt;/beans&gt;</span></span></code></pre></div><ul><li><strong>组装App</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.context.ApplicationContext;</span></span>
<span class="line"><span>import org.springframework.context.support.ClassPathXmlApplicationContext;</span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class App {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * main interfaces.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param args args</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        // create and configure beans</span></span>
<span class="line"><span>        ApplicationContext context =</span></span>
<span class="line"><span>                new ClassPathXmlApplicationContext(&quot;aspects.xml&quot;, &quot;daos.xml&quot;, &quot;services.xml&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // retrieve configured instance</span></span>
<span class="line"><span>        UserServiceImpl service = context.getBean(&quot;userService&quot;, UserServiceImpl.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // use configured instance</span></span>
<span class="line"><span>        List&lt;User&gt; userList = service.findUserList();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // print info from beans</span></span>
<span class="line"><span>        userList.forEach(a -&gt; System.out.println(a.getName() + &quot;,&quot; + a.getAge()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>整体结构和运行app</strong></li></ul><p><img src="`+r+`" alt="error.图片加载失败"></p><h2 id="这个例子体现了spring的哪些核心要点" tabindex="-1">这个例子体现了Spring的哪些核心要点 <a class="header-anchor" href="#这个例子体现了spring的哪些核心要点" aria-label="Permalink to &quot;这个例子体现了Spring的哪些核心要点&quot;">​</a></h2><blockquote><p>那么Spring框架帮助我们做什么，它体现了什么哪些要点呢?</p></blockquote><h3 id="控制反转-ioc" tabindex="-1">控制反转 - IOC <a class="header-anchor" href="#控制反转-ioc" aria-label="Permalink to &quot;控制反转 - IOC&quot;">​</a></h3><blockquote><p>来看第一个需求：<strong>查询用户</strong>（service通过调用dao查询pojo)，本质上如何创建User/Dao/Service等；</p></blockquote><ul><li><strong>如果没有Spring框架，我们需要自己创建User/Dao/Service等</strong>，比如：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UserDaoImpl userDao = new UserDaoImpl();</span></span>
<span class="line"><span>UserSericeImpl userService = new UserServiceImpl();</span></span>
<span class="line"><span>userService.setUserDao(userDao);</span></span>
<span class="line"><span>List&lt;User&gt; userList = userService.findUserList();</span></span></code></pre></div><ul><li><strong>有了Spring框架，可以将原有Bean的创建工作转给框架, 需要用时从Bean的容器中获取即可，这样便简化了开发工作</strong></li></ul><p>Bean的创建和使用分离了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// create and configure beans</span></span>
<span class="line"><span>ApplicationContext context =</span></span>
<span class="line"><span>        new ClassPathXmlApplicationContext(&quot;aspects.xml&quot;, &quot;daos.xml&quot;, &quot;services.xml&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// retrieve configured instance</span></span>
<span class="line"><span>UserServiceImpl service = context.getBean(&quot;userService&quot;, UserServiceImpl.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// use configured instance</span></span>
<span class="line"><span>List&lt;User&gt; userList = service.findUserList();</span></span></code></pre></div><p><img src="`+o+`" alt="error.图片加载失败"></p><p>更进一步，<strong>你便能理解为何会有如下的知识点了</strong>：</p><ol><li>Spring框架管理这些Bean的创建工作，即由用户管理Bean转变为框架管理Bean，这个就叫<strong>控制反转 - Inversion of Control (IoC)</strong></li><li>Spring 框架托管创建的Bean放在哪里呢？ 这便是<strong>IoC Container</strong>;</li><li>Spring 框架为了更好让用户配置Bean，必然会引入<strong>不同方式来配置Bean？ 这便是xml配置，Java配置，注解配置</strong>等支持</li><li>Spring 框架既然接管了Bean的生成，必然需要<strong>管理整个Bean的生命周期</strong>等；</li><li>应用程序代码从Ioc Container中获取依赖的Bean，注入到应用程序中，这个过程叫 <strong>依赖注入(Dependency Injection，DI)</strong> ； 所以说控制反转是通过依赖注入实现的，其实它们是同一个概念的不同角度描述。通俗来说就是<strong>IoC是设计思想，DI是实现方式</strong></li><li>在依赖注入时，有哪些方式呢？这就是构造器方式，@Autowired, @Resource, @Qualifier... 同时Bean之间存在依赖（可能存在先后顺序问题，以及<strong>循环依赖问题</strong>等）</li></ol><p>这边引入我们后续的相关文章：<a href="https://pdai.tech/md/spring/spring-x-framework-ioc.html" target="_blank" rel="noreferrer">Spring基础 - Spring之控制反转(IOC)</a></p><h3 id="面向切面-aop" tabindex="-1">面向切面 - AOP <a class="header-anchor" href="#面向切面-aop" aria-label="Permalink to &quot;面向切面 - AOP&quot;">​</a></h3><blockquote><p>来看第二个需求：<strong>给Service所有方法调用添加日志</strong>（调用方法时)，本质上是解耦问题；</p></blockquote><ul><li><strong>如果没有Spring框架，我们需要在每个service的方法中都添加记录日志的方法</strong>，比如：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* find user list.</span></span>
<span class="line"><span>*</span></span>
<span class="line"><span>* @return user list</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>public List&lt;User&gt; findUserList() {</span></span>
<span class="line"><span>    System.out.println(&quot;execute method findUserList&quot;);</span></span>
<span class="line"><span>    return this.userDao.findUserList();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>有了Spring框架，通过@Aspect注解 定义了切面，这个切面中定义了拦截所有service中的方法，并记录日志； 可以明显看到，框架将日志记录和业务需求的代码解耦了，不再是侵入式的了</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* aspect for every methods under service package.</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>@Around(&quot;execution(* tech.pdai.springframework.service.*.*(..))&quot;)</span></span>
<span class="line"><span>public Object businessService(ProceedingJoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>    // get attribute through annotation</span></span>
<span class="line"><span>    Method method = ((MethodSignature) pjp.getSignature()).getMethod();</span></span>
<span class="line"><span>    System.out.println(&quot;execute method: &quot; + method.getName());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // continue to process</span></span>
<span class="line"><span>    return pjp.proceed();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>更进一步，<strong>你便能理解为何会有如下的知识点了</strong>：</p><ol><li>Spring 框架通过定义切面, 通过拦截切点实现了不同业务模块的解耦，这个就叫<strong>面向切面编程 - Aspect Oriented Programming (AOP)</strong></li><li>为什么@Aspect注解使用的是aspectj的jar包呢？这就引出了<strong>Aspect4J和Spring AOP的历史渊源</strong>，只有理解了Aspect4J和Spring的渊源才能理解有些注解上的兼容设计</li><li>如何支持<strong>更多拦截方式</strong>来实现解耦， 以满足更多场景需求呢？ 这就是@Around, @Pointcut... 等的设计</li><li>那么Spring框架又是如何实现AOP的呢？ 这就引入<strong>代理技术，分静态代理和动态代理</strong>，动态代理又包含JDK代理和CGLIB代理等</li></ol><p>这边引入我们后续的相关文章：<a href="https://pdai.tech/md/spring/spring-x-framework-aop.html" target="_blank" rel="noreferrer">Spring基础 - Spring之面向切面编程(AOP)</a></p><h2 id="spring框架设计如何逐步简化开发的" tabindex="-1">Spring框架设计如何逐步简化开发的 <a class="header-anchor" href="#spring框架设计如何逐步简化开发的" aria-label="Permalink to &quot;Spring框架设计如何逐步简化开发的&quot;">​</a></h2><blockquote><p>通过上述的框架介绍和例子，已经初步知道了Spring设计的两个大的要点：IOC和AOP；从框架的设计角度而言，更为重要的是简化开发，比如提供更为便捷的配置Bean的方式，直至0配置（即约定大于配置）。这里我将通过Spring历史版本的发展，和SpringBoot的推出等，来帮你理解Spring框架是如何逐步简化开发的。</p></blockquote><h3 id="java-配置方式改造" tabindex="-1">Java 配置方式改造 <a class="header-anchor" href="#java-配置方式改造" aria-label="Permalink to &quot;Java 配置方式改造&quot;">​</a></h3><p>在前文的例子中， 通过xml配置方式实现的，这种方式实际上比较麻烦； 我通过Java配置进行改造：</p><ul><li>User，UserDaoImpl, UserServiceImpl，LogAspect不用改</li><li>将原通过.xml配置转换为Java配置</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.context.annotation.Bean;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span>import org.springframework.context.annotation.EnableAspectJAutoProxy;</span></span>
<span class="line"><span>import tech.pdai.springframework.aspect.LogAspect;</span></span>
<span class="line"><span>import tech.pdai.springframework.dao.UserDaoImpl;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@EnableAspectJAutoProxy</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class BeansConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return user dao</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean(&quot;userDao&quot;)</span></span>
<span class="line"><span>    public UserDaoImpl userDao() {</span></span>
<span class="line"><span>        return new UserDaoImpl();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return user service</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean(&quot;userService&quot;)</span></span>
<span class="line"><span>    public UserServiceImpl userService() {</span></span>
<span class="line"><span>        UserServiceImpl userService = new UserServiceImpl();</span></span>
<span class="line"><span>        userService.setUserDao(userDao());</span></span>
<span class="line"><span>        return userService;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @return log aspect</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean(&quot;logAspect&quot;)</span></span>
<span class="line"><span>    public LogAspect logAspect() {</span></span>
<span class="line"><span>        return new LogAspect();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>在App中加载BeansConfig的配置</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.context.annotation.AnnotationConfigApplicationContext;</span></span>
<span class="line"><span>import tech.pdai.springframework.config.BeansConfig;</span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class App {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * main interfaces.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param args args</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        // create and configure beans</span></span>
<span class="line"><span>        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(BeansConfig.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // retrieve configured instance</span></span>
<span class="line"><span>        UserServiceImpl service = context.getBean(&quot;userService&quot;, UserServiceImpl.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // use configured instance</span></span>
<span class="line"><span>        List&lt;User&gt; userList = service.findUserList();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // print info from beans</span></span>
<span class="line"><span>        userList.forEach(a -&gt; System.out.println(a.getName() + &quot;,&quot; + a.getAge()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>整体结构和运行app</strong></li></ul><p><img src="`+c+`" alt="error.图片加载失败"></p><h3 id="注解配置方式改造" tabindex="-1">注解配置方式改造 <a class="header-anchor" href="#注解配置方式改造" aria-label="Permalink to &quot;注解配置方式改造&quot;">​</a></h3><p>更进一步，Java 5开始提供注解支持，Spring 2.5 开始完全支持基于注解的配置并且也支持JSR250 注解。在Spring后续的版本发展倾向于通过注解和Java配置结合使用.</p><ul><li><strong>BeanConfig 不再需要Java配置</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.context.annotation.ComponentScan;</span></span>
<span class="line"><span>import org.springframework.context.annotation.ComponentScans;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span>import org.springframework.context.annotation.EnableAspectJAutoProxy;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>@EnableAspectJAutoProxy</span></span>
<span class="line"><span>public class BeansConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>UserDaoImpl 增加了 @Repository注解</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public class UserDaoImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * mocked to find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public List&lt;User&gt; findUserList() {</span></span>
<span class="line"><span>        return Collections.singletonList(new User(&quot;pdai&quot;, 18));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>UserServiceImpl 增加了@Service 注解，并通过@Autowired注入userDao</strong>.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Service</span></span>
<span class="line"><span>public class UserServiceImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user dao impl.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private UserDaoImpl userDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return user list</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public List&lt;User&gt; findUserList() {</span></span>
<span class="line"><span>        return userDao.findUserList();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>在App中扫描tech.pdai.springframework包</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.context.annotation.AnnotationConfigApplicationContext;</span></span>
<span class="line"><span>import tech.pdai.springframework.entity.User;</span></span>
<span class="line"><span>import tech.pdai.springframework.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class App {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * main interfaces.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param args args</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        // create and configure beans</span></span>
<span class="line"><span>        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(</span></span>
<span class="line"><span>                &quot;tech.pdai.springframework&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // retrieve configured instance</span></span>
<span class="line"><span>        UserServiceImpl service = context.getBean(UserServiceImpl.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // use configured instance</span></span>
<span class="line"><span>        List&lt;User&gt; userList = service.findUserList();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // print info from beans</span></span>
<span class="line"><span>        userList.forEach(a -&gt; System.out.println(a.getName() + &quot;,&quot; + a.getAge()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>整体结构和运行app</strong></li></ul><p><img src="`+g+'" alt="error.图片加载失败"></p><h3 id="springboot托管配置" tabindex="-1">SpringBoot托管配置 <a class="header-anchor" href="#springboot托管配置" aria-label="Permalink to &quot;SpringBoot托管配置&quot;">​</a></h3><p>Springboot实际上通过约定大于配置的方式，使用xx-starter统一的对Bean进行默认初始化，用户只需要很少的配置就可以进行开发了。</p><p>这个因为很多开发者都是从SpringBoot开始着手开发的，所以这个比较好理解。我们需要的是将知识点都串联起来，构筑认知体系。</p><h3 id="结合spring历史版本和springboot看发展" tabindex="-1">结合Spring历史版本和SpringBoot看发展 <a class="header-anchor" href="#结合spring历史版本和springboot看发展" aria-label="Permalink to &quot;结合Spring历史版本和SpringBoot看发展&quot;">​</a></h3><p>最后结合Spring历史版本总结下它的发展：</p><p>（这样是不是能够帮助你在整体上构建了知识体系的认知了呢？）</p><p><img src="'+u+'" alt="error.图片加载失败"></p><p>PS：相关代码，可以通过<a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">这里在新窗口打开</a>直接查看</p><p><img src="'+d+'" alt="error.图片加载失败"></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',86)]))}const C=a(m,[["render",h]]);export{x as __pageData,C as default};
