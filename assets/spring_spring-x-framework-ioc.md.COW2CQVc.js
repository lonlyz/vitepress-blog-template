import{_ as n}from"./chunks/spring-framework-ioc-2.ZDvZEn1B.js";import{_ as a,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springframework/spring-framework-ioc-1.png",t="/vitepress-blog-template/images/spring/springframework/spring-framework-ioc-3.png",v=JSON.parse('{"title":"Spring基础 - Spring核心之控制反转(IOC)","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-ioc.md","filePath":"spring/spring-x-framework-ioc.md","lastUpdated":1737706346000}'),o={name:"spring/spring-x-framework-ioc.md"};function r(c,s,u,d,g,h){return l(),p("div",null,s[0]||(s[0]=[e('<h1 id="spring基础-spring核心之控制反转-ioc" tabindex="-1">Spring基础 - Spring核心之控制反转(IOC) <a class="header-anchor" href="#spring基础-spring核心之控制反转-ioc" aria-label="Permalink to &quot;Spring基础 - Spring核心之控制反转(IOC)&quot;">​</a></h1><blockquote><p>在<a href="https://pdai.tech/md/spring/spring-x-framework-helloworld.html" target="_blank" rel="noreferrer">Spring基础 - Spring简单例子引入Spring的核心</a>中向你展示了IoC的基础含义，同时以此发散了一些IoC相关知识点; 本节将在此基础上进一步解读IOC的含义以及IOC的使用方式。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>我们在<a href="https://pdai.tech/md/spring/spring-x-framework-helloworld.html" target="_blank" rel="noreferrer">Spring基础 - Spring简单例子引入Spring的核心</a>中向你展示了IoC的基础含义，同时以此发散了一些IoC相关知识点。</p></blockquote><ol><li>Spring框架管理这些Bean的创建工作，即由用户管理Bean转变为框架管理Bean，这个就叫<strong>控制反转 - Inversion of Control (IoC)</strong></li><li>Spring 框架托管创建的Bean放在哪里呢？ 这便是<strong>IoC Container</strong>;</li><li>Spring 框架为了更好让用户配置Bean，必然会引入<strong>不同方式来配置Bean？ 这便是xml配置，Java配置，注解配置</strong>等支持</li><li>Spring 框架既然接管了Bean的生成，必然需要<strong>管理整个Bean的生命周期</strong>等；</li><li>应用程序代码从Ioc Container中获取依赖的Bean，注入到应用程序中，这个过程叫 <strong>依赖注入(Dependency Injection，DI)</strong> ； 所以说控制反转是通过依赖注入实现的，其实它们是同一个概念的不同角度描述。通俗来说就是<strong>IoC是设计思想，DI是实现方式</strong></li><li>在依赖注入时，有哪些方式呢？这就是构造器方式，@Autowired, @Resource, @Qualifier... 同时Bean之间存在依赖（可能存在先后顺序问题，以及<strong>循环依赖问题</strong>等）</li></ol><p>本节将在此基础上进一步解读IOC的含义以及IOC的使用方式；后续的文章还将深入IOC的实现原理：</p><ul><li><a href="https://pdai.tech/md/spring/spring-x-framework-ioc-source-1.html" target="_blank" rel="noreferrer">Spring进阶- Spring IOC实现原理详解之IOC体系结构设计</a></li><li><a href="https://pdai.tech/md/spring/spring-x-framework-ioc-source-2.html" target="_blank" rel="noreferrer">Spring进阶- Spring IOC实现原理详解之IOC初始化流程</a></li><li><a href="https://pdai.tech/md/spring/spring-x-framework-ioc-source-3.html" target="_blank" rel="noreferrer">Spring进阶- Spring IOC实现原理详解之Bean的注入和生命周期</a></li></ul><h2 id="如何理解ioc" tabindex="-1">如何理解IoC <a class="header-anchor" href="#如何理解ioc" aria-label="Permalink to &quot;如何理解IoC&quot;">​</a></h2><p>如果你有精力看英文，首推 Martin Fowler大师的 <a href="https://www.martinfowler.com/articles/injection.html" target="_blank" rel="noreferrer">Inversion of Control Containers and the Dependency Injection pattern在新窗口打开</a>；其次IoC作为一种设计思想，不要过度解读，而是应该简化理解，所以我这里也整合了 张开涛早前的博客<a href="https://www.iteye.com/blog/jinnianshilongnian-1413846" target="_blank" rel="noreferrer">IoC基础在新窗口打开</a>并加入了自己的理解。</p><h3 id="spring-bean是什么" tabindex="-1">Spring Bean是什么 <a class="header-anchor" href="#spring-bean是什么" aria-label="Permalink to &quot;Spring Bean是什么&quot;">​</a></h3><blockquote><p>IoC Container管理的是Spring Bean， 那么Spring Bean是什么呢？</p></blockquote><p>Spring里面的bean就类似是定义的一个组件，而这个组件的作用就是实现某个功能的，这里所定义的bean就相当于给了你一个更为简便的方法来调用这个组件去实现你要完成的功能。</p><h3 id="ioc是什么" tabindex="-1">IoC是什么 <a class="header-anchor" href="#ioc是什么" aria-label="Permalink to &quot;IoC是什么&quot;">​</a></h3><blockquote><p>Ioc—Inversion of Control，即“控制反转”，<strong>不是什么技术，而是一种设计思想</strong>。在Java开发中，Ioc意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。</p></blockquote><p>我们来深入分析一下：</p><ul><li><strong>谁控制谁，控制什么</strong>？</li></ul><p>传统Java SE程序设计，我们直接在对象内部通过new进行创建对象，是程序主动去创建依赖对象；而IoC是有专门一个容器来创建这些对象，即由Ioc容器来控制对 象的创建；谁控制谁？当然是IoC 容器控制了对象；控制什么？那就是主要控制了外部资源获取（不只是对象包括比如文件等）。</p><ul><li><strong>为何是反转，哪些方面反转了</strong>?</li></ul><p>有反转就有正转，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；为何是反转？因为由容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转；哪些方面反转了？依赖对象的获取被反转了。</p><ul><li><strong>用图例说明一下</strong>?</li></ul><p>传统程序设计下，都是主动去创建相关对象然后再组合起来：</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>当有了IoC/DI的容器后，在客户端类中不再主动去创建这些对象了，如图</p><p><img src="'+n+`" alt="error.图片加载失败"></p><h3 id="ioc能做什么" tabindex="-1">IoC能做什么 <a class="header-anchor" href="#ioc能做什么" aria-label="Permalink to &quot;IoC能做什么&quot;">​</a></h3><blockquote><p>IoC <strong>不是一种技术，只是一种思想</strong>，一个重要的面向对象编程的法则，它能指导我们如何设计出松耦合、更优良的程序。</p></blockquote><p>传统应用程序都是由我们在类内部主动创建依赖对象，从而导致类与类之间高耦合，难于测试；有了IoC容器后，<strong>把创建和查找依赖对象的控制权交给了容器，由容器进行注入组合对象，所以对象与对象之间是 松散耦合，这样也方便测试，利于功能复用，更重要的是使得程序的整个体系结构变得非常灵活</strong>。</p><p>其实IoC对编程带来的最大改变不是从代码上，而是从思想上，发生了“主从换位”的变化。应用程序原本是老大，要获取什么资源都是主动出击，但是在IoC/DI思想中，应用程序就变成被动的了，被动的等待IoC容器来创建并注入它所需要的资源了。</p><p>IoC很好的体现了面向对象设计法则之一—— <strong>好莱坞法则：“别找我们，我们找你”</strong>；即由IoC容器帮对象找相应的依赖对象并注入，而不是由对象主动去找。</p><h3 id="ioc和di是什么关系" tabindex="-1">IoC和DI是什么关系 <a class="header-anchor" href="#ioc和di是什么关系" aria-label="Permalink to &quot;IoC和DI是什么关系&quot;">​</a></h3><blockquote><p>控制反转是通过依赖注入实现的，其实它们是同一个概念的不同角度描述。通俗来说就是<strong>IoC是设计思想，DI是实现方式</strong>。</p></blockquote><p>DI—Dependency Injection，即依赖注入：组件之间依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。依赖注入的目的并非为软件系统带来更多功能，而是为了提升组件重用的频率，并为系统搭建一个灵活、可扩展的平台。通过依赖注入机制，我们只需要通过简单的配置，而无需任何代码就可指定目标需要的资源，完成自身的业务逻辑，而不需要关心具体的资源来自何处，由谁实现。</p><p>我们来深入分析一下：</p><ul><li><strong>谁依赖于谁</strong>？</li></ul><p>当然是应用程序依赖于IoC容器；</p><ul><li><strong>为什么需要依赖</strong>？</li></ul><p>应用程序需要IoC容器来提供对象需要的外部资源；</p><ul><li><strong>谁注入谁</strong>？</li></ul><p>很明显是IoC容器注入应用程序某个对象，应用程序依赖的对象；</p><ul><li><strong>注入了什么</strong>？</li></ul><p>就是注入某个对象所需要的外部资源（包括对象、资源、常量数据）。</p><ul><li><strong>IoC和DI有什么关系呢</strong>？</li></ul><p>其实它们是同一个概念的不同角度描述，由于控制反转概念比较含糊（可能只是理解为容器控制对象这一个层面，很难让人想到谁来维护对象关系），所以2004年大师级人物Martin Fowler又给出了一个新的名字：“依赖注入”，相对IoC 而言，“依赖注入”明确描述了“被注入对象依赖IoC容器配置依赖对象”。通俗来说就是<strong>IoC是设计思想，DI是实现方式</strong>。</p><h2 id="ioc-配置的三种方式" tabindex="-1">Ioc 配置的三种方式 <a class="header-anchor" href="#ioc-配置的三种方式" aria-label="Permalink to &quot;Ioc 配置的三种方式&quot;">​</a></h2><blockquote><p>在<a href="https://pdai.tech/md/spring/spring-x-framework-helloworld.html" target="_blank" rel="noreferrer">Spring基础 - Spring简单例子引入Spring的核心</a>已经给出了三种配置方式，这里再总结下；总体上目前的主流方式是 <strong>注解 + Java 配置</strong>。</p></blockquote><h3 id="xml-配置" tabindex="-1">xml 配置 <a class="header-anchor" href="#xml-配置" aria-label="Permalink to &quot;xml 配置&quot;">​</a></h3><p>顾名思义，就是将bean的信息配置.xml文件里，通过Spring加载文件为我们创建bean。这种方式出现很多早前的SSM项目中，将第三方类库或者一些配置工具类都以这种方式进行配置，主要原因是由于第三方类不支持Spring注解。</p><ul><li><p><strong>优点</strong>： 可以使用于任何场景，结构清晰，通俗易懂</p></li><li><p><strong>缺点</strong>： 配置繁琐，不易维护，枯燥无味，扩展性差</p></li></ul><p><strong>举例</strong>：</p><ol><li>配置xx.xml文件</li><li>声明命名空间和配置bean</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
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
<span class="line"><span>&lt;/beans&gt;</span></span></code></pre></div><h3 id="java-配置" tabindex="-1">Java 配置 <a class="header-anchor" href="#java-配置" aria-label="Permalink to &quot;Java 配置&quot;">​</a></h3><p>将类的创建交给我们配置的JavcConfig类来完成，Spring只负责维护和管理，采用纯Java创建方式。其本质上就是把在XML上的配置声明转移到Java配置类中</p><ul><li><p><strong>优点</strong>：适用于任何场景，配置方便，因为是纯Java代码，扩展性高，十分灵活</p></li><li><p><strong>缺点</strong>：由于是采用Java类的方式，声明不明显，如果大量配置，可读性比较差</p></li></ul><p><strong>举例</strong>：</p><ol><li>创建一个配置类， 添加@Configuration注解声明为配置类</li><li>创建方法，方法上加上@bean，该方法用于创建实例并返回，该实例创建后会交给spring管理，方法名建议与实例名相同（首字母小写）。注：实例类不需要加任何注解</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h3 id="注解配置" tabindex="-1">注解配置 <a class="header-anchor" href="#注解配置" aria-label="Permalink to &quot;注解配置&quot;">​</a></h3><p>通过在类上加注解的方式，来声明一个类交给Spring管理，Spring会自动扫描带有@Component，@Controller，@Service，@Repository这四个注解的类，然后帮我们创建并管理，前提是需要先配置Spring的注解扫描器。</p><ul><li><p><strong>优点</strong>：开发便捷，通俗易懂，方便维护。</p></li><li><p><strong>缺点</strong>：具有局限性，对于一些第三方资源，无法添加注解。只能采用XML或JavaConfig的方式配置</p></li></ul><p><strong>举例</strong>：</p><ol><li>对类添加@Component相关的注解，比如@Controller，@Service，@Repository</li><li>设置ComponentScan的basePackage, 比如<code>&lt;context:component-scan base-package=&#39;tech.pdai.springframework&#39;&gt;</code>, 或者<code>@ComponentScan(&quot;tech.pdai.springframework&quot;)</code>注解，或者 <code>new AnnotationConfigApplicationContext(&quot;tech.pdai.springframework&quot;)</code>指定扫描的basePackage.</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h2 id="依赖注入的三种方式" tabindex="-1">依赖注入的三种方式 <a class="header-anchor" href="#依赖注入的三种方式" aria-label="Permalink to &quot;依赖注入的三种方式&quot;">​</a></h2><blockquote><p>常用的注入方式主要有三种：构造方法注入（Construct注入），setter注入，基于注解的注入（接口注入）</p></blockquote><h3 id="setter方式" tabindex="-1">setter方式 <a class="header-anchor" href="#setter方式" aria-label="Permalink to &quot;setter方式&quot;">​</a></h3><ul><li><strong>在XML配置方式中</strong>，property都是setter方式注入，比如下面的xml:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
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
<span class="line"><span>&lt;/beans&gt;</span></span></code></pre></div><p>本质上包含两步：</p><ol><li>第一步，需要new UserServiceImpl()创建对象, 所以需要默认构造函数</li><li>第二步，调用setUserDao()函数注入userDao的值, 所以需要setUserDao()函数</li></ol><p>所以对应的service类是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>在注解和Java配置方式下</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
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
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    public void setUserDao(UserDaoImpl userDao) {</span></span>
<span class="line"><span>        this.userDao = userDao;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Spring3.x刚推出的时候，推荐使用注入的就是这种, 但是这种方式比较麻烦，所以在Spring4.x版本中推荐构造函数注入。</p><h3 id="构造函数" tabindex="-1">构造函数 <a class="header-anchor" href="#构造函数" aria-label="Permalink to &quot;构造函数&quot;">​</a></h3><ul><li><strong>在XML配置方式中</strong>，<code>&lt;constructor-arg&gt;</code>是通过构造函数参数注入，比如下面的xml:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>       xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>       xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans</span></span>
<span class="line"><span> http://www.springframework.org/schema/beans/spring-beans.xsd&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- services --&gt;</span></span>
<span class="line"><span>    &lt;bean id=&quot;userService&quot; class=&quot;tech.pdai.springframework.service.UserServiceImpl&quot;&gt;</span></span>
<span class="line"><span>        &lt;constructor-arg name=&quot;userDao&quot; ref=&quot;userDao&quot;/&gt;</span></span>
<span class="line"><span>        &lt;!-- additional collaborators and configuration for this bean go here --&gt;</span></span>
<span class="line"><span>    &lt;/bean&gt;</span></span>
<span class="line"><span>    &lt;!-- more bean definitions for services go here --&gt;</span></span>
<span class="line"><span>&lt;/beans&gt;</span></span></code></pre></div><p>本质上是new UserServiceImpl(userDao)创建对象, 所以对应的service类是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserServiceImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user dao impl.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final UserDaoImpl userDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     * @param userDaoImpl user dao impl</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public UserServiceImpl(UserDaoImpl userDaoImpl) {</span></span>
<span class="line"><span>        this.userDao = userDaoImpl;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>在注解和Java配置方式下</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span> @Service</span></span>
<span class="line"><span>public class UserServiceImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user dao impl.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final UserDaoImpl userDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     * @param userDaoImpl user dao impl</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Autowired // 这里@Autowired也可以省略</span></span>
<span class="line"><span>    public UserServiceImpl(final UserDaoImpl userDaoImpl) {</span></span>
<span class="line"><span>        this.userDao = userDaoImpl;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>在Spring4.x版本中推荐的注入方式就是这种， 具体原因看后续章节。</p><h3 id="注解注入" tabindex="-1">注解注入 <a class="header-anchor" href="#注解注入" aria-label="Permalink to &quot;注解注入&quot;">​</a></h3><p>以@Autowired（自动注入）注解注入为例，修饰符有三个属性：Constructor，byType，byName。默认按照byType注入。</p><ul><li><strong>constructor</strong>：通过构造方法进行自动注入，spring会匹配与构造方法参数类型一致的bean进行注入，如果有一个多参数的构造方法，一个只有一个参数的构造方法，在容器中查找到多个匹配多参数构造方法的bean，那么spring会优先将bean注入到多参数的构造方法中。</li><li><strong>byName</strong>：被注入bean的id名必须与set方法后半截匹配，并且id名称的第一个单词首字母必须小写，这一点与手动set注入有点不同。</li><li><strong>byType</strong>：查找所有的set方法，将符合符合参数类型的bean注入。</li></ul><p>比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h2 id="ioc和di使用问题小结" tabindex="-1">IoC和DI使用问题小结 <a class="header-anchor" href="#ioc和di使用问题小结" aria-label="Permalink to &quot;IoC和DI使用问题小结&quot;">​</a></h2><blockquote><p>这里总结下实际开发中会遇到的一些问题：</p></blockquote><h3 id="为什么推荐构造器注入方式" tabindex="-1">为什么推荐构造器注入方式？ <a class="header-anchor" href="#为什么推荐构造器注入方式" aria-label="Permalink to &quot;为什么推荐构造器注入方式？&quot;">​</a></h3><p>先来看看Spring在文档里怎么说：</p><blockquote><p>The Spring team generally advocates constructor injection as it enables one to implement application components as immutable objects and to ensure that required dependencies are not null. Furthermore constructor-injected components are always returned to client (calling) code in a fully initialized state.</p></blockquote><p>简单的翻译一下：这个构造器注入的方式<strong>能够保证注入的组件不可变，并且确保需要的依赖不为空</strong>。此外，构造器注入的依赖总是能够在返回客户端（组件）代码的时候保证完全初始化的状态。</p><p>下面来简单的解释一下：</p><ul><li><strong>依赖不可变</strong>：其实说的就是final关键字。</li><li><strong>依赖不为空</strong>（省去了我们对其检查）：当要实例化UserServiceImpl的时候，由于自己实现了有参数的构造函数，所以不会调用默认构造函数，那么就需要Spring容器传入所需要的参数，所以就两种情况：1、有该类型的参数-&gt;传入，OK 。2：无该类型的参数-&gt;报错。</li><li><strong>完全初始化的状态</strong>：这个可以跟上面的依赖不为空结合起来，向构造器传参之前，要确保注入的内容不为空，那么肯定要调用依赖组件的构造方法完成实例化。而在Java类加载实例化的过程中，构造方法是最后一步（之前如果有父类先初始化父类，然后自己的成员变量，最后才是构造方法），所以返回来的都是初始化之后的状态。</li></ul><p>所以通常是这样的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span> @Service</span></span>
<span class="line"><span>public class UserServiceImpl {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user dao impl.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final UserDaoImpl userDao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * init.</span></span>
<span class="line"><span>     * @param userDaoImpl user dao impl</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public UserServiceImpl(final UserDaoImpl userDaoImpl) {</span></span>
<span class="line"><span>        this.userDao = userDaoImpl;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果使用setter注入，缺点显而易见，对于IOC容器以外的环境，除了使用反射来提供它需要的依赖之外，<strong>无法复用该实现类</strong>。而且将一直是个潜在的隐患，因为你不调用将一直无法发现NPE的存在。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 这里只是模拟一下，正常来说我们只会暴露接口给客户端，不会暴露实现。</span></span>
<span class="line"><span>UserServiceImpl userService = new UserServiceImpl();</span></span>
<span class="line"><span>userService.findUserList(); // -&gt; NullPointerException, 潜在的隐患</span></span></code></pre></div><p><strong>循环依赖的问题</strong>：使用field注入可能会导致循环依赖，即A里面注入B，B里面又注入A：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class A {</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private B b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class B {</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private A a;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果使用构造器注入，在spring项目启动的时候，就会抛出：BeanCurrentlyInCreationException：Requested bean is currently in creation: Is there an unresolvable circular reference？从而提醒你避免循环依赖，如果是field注入的话，启动的时候不会报错，在使用那个bean的时候才会报错。</p><h3 id="我在使用构造器注入方式时注入了太多的类导致bad-smell怎么办" tabindex="-1">我在使用构造器注入方式时注入了太多的类导致Bad Smell怎么办？ <a class="header-anchor" href="#我在使用构造器注入方式时注入了太多的类导致bad-smell怎么办" aria-label="Permalink to &quot;我在使用构造器注入方式时注入了太多的类导致Bad Smell怎么办？&quot;">​</a></h3><p>比如当你一个Controller中注入了太多的Service类，Sonar会给你提示相关告警</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>对于这个问题，说明你的类当中有太多的责任，那么你要好好想一想是不是自己违反了类的<a href="https://pdai.tech/md/dev-spec/spec/dev-th-solid.html#s%E5%8D%95%E4%B8%80%E8%81%8C%E8%B4%A3srp" target="_blank" rel="noreferrer">单一性职责原则</a>，从而导致有这么多的依赖要注入。</p><p>（pdai： 想起来一句话：<strong>所有困难问题的解决方式，都在另外一个层次</strong>）</p><h3 id="autowired和-resource以及-inject等注解注入有何区别" tabindex="-1">@Autowired和@Resource以及@Inject等注解注入有何区别？ <a class="header-anchor" href="#autowired和-resource以及-inject等注解注入有何区别" aria-label="Permalink to &quot;@Autowired和@Resource以及@Inject等注解注入有何区别？&quot;">​</a></h3><blockquote><p>@Autowired和@Resource以及@Inject等注解注入有何区别？ 这时平时在开发中，或者常见的面试题。</p></blockquote><h4 id="autowired" tabindex="-1">@Autowired <a class="header-anchor" href="#autowired" aria-label="Permalink to &quot;@Autowired&quot;">​</a></h4><ul><li><strong>Autowired注解源码</strong></li></ul><p>在Spring 2.5 引入了 @Autowired 注解</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface Autowired {</span></span>
<span class="line"><span>  boolean required() default true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从Autowired注解源码上看，可以使用在下面这些地方：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.CONSTRUCTOR) #构造函数</span></span>
<span class="line"><span>@Target(ElementType.METHOD) #方法</span></span>
<span class="line"><span>@Target(ElementType.PARAMETER) #方法参数</span></span>
<span class="line"><span>@Target(ElementType.FIELD) #字段、枚举的常量</span></span>
<span class="line"><span>@Target(ElementType.ANNOTATION_TYPE) #注解</span></span></code></pre></div><p>还有一个value属性，默认是true。</p><ul><li><strong>简单总结</strong>：</li></ul><p>1、@Autowired是Spring自带的注解，通过AutowiredAnnotationBeanPostProcessor 类实现的依赖注入</p><p>2、@Autowired可以作用在CONSTRUCTOR、METHOD、PARAMETER、FIELD、ANNOTATION_TYPE</p><p>3、@Autowired默认是根据类型（byType ）进行自动装配的</p><p>4、如果有多个类型一样的Bean候选者，需要指定按照名称（byName ）进行装配，则需要配合@Qualifier。</p><p>指定名称后，如果Spring IOC容器中没有对应的组件bean抛出NoSuchBeanDefinitionException。也可以将@Autowired中required配置为false，如果配置为false之后，当没有找到相应bean的时候，系统不会抛异常</p><ul><li><strong>简单使用代码</strong>：</li></ul><p>在字段属性上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Autowired</span></span>
<span class="line"><span>private HelloDao helloDao;</span></span></code></pre></div><p>或者</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private HelloDao helloDao;</span></span>
<span class="line"><span>public HelloDao getHelloDao() {</span></span>
<span class="line"><span> return helloDao;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Autowired</span></span>
<span class="line"><span>public void setHelloDao(HelloDao helloDao) {</span></span>
<span class="line"><span> this.helloDao = helloDao;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>或者</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private HelloDao helloDao;</span></span>
<span class="line"><span>//@Autowired</span></span>
<span class="line"><span>public HelloServiceImpl(@Autowired HelloDao helloDao) {</span></span>
<span class="line"><span> this.helloDao = helloDao;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 构造器注入也可不写@Autowired，也可以注入成功。</span></span></code></pre></div><p>将@Autowired写在被注入的成员变量上，setter或者构造器上，就不用再xml文件中配置了。</p><p>如果有多个类型一样的Bean候选者，则默认根据设定的属性名称进行获取。如 HelloDao 在Spring中有 helloWorldDao 和 helloDao 两个Bean候选者。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Autowired</span></span>
<span class="line"><span>private HelloDao helloDao;</span></span></code></pre></div><p>首先根据类型获取，发现多个HelloDao，然后根据helloDao进行获取，如果要获取限定的其中一个候选者，结合@Qualifier进行注入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Autowired</span></span>
<span class="line"><span>@Qualifier(&quot;helloWorldDao&quot;)</span></span>
<span class="line"><span>private HelloDao helloDao;</span></span></code></pre></div><p>注入名称为helloWorldDao 的Bean组件。@Qualifier(&quot;XXX&quot;) 中的 XX是 Bean 的名称，所以 @Autowired 和 @Qualifier 结合使用时，自动注入的策略就从 byType 转变成 byName 了。</p><p>多个类型一样的Bean候选者，也可以@Primary进行使用，设置首选的组件，也就是默认优先使用哪一个。</p><p>注意：使用@Qualifier 时候，如何设置的指定名称的Bean不存在，则会抛出异常，如果防止抛出异常，可以使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Qualifier(&quot;xxxxyyyy&quot;)</span></span>
<span class="line"><span>@Autowired(required = false)</span></span>
<span class="line"><span>private HelloDao helloDao;</span></span></code></pre></div><p>在SpringBoot中也可以使用@Bean+@Autowired进行组件注入，将@Autowired加到参数上，其实也可以省略。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public Person getPerson(@Autowired Car car){</span></span>
<span class="line"><span> return new Person();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// @Autowired 其实也可以省略</span></span></code></pre></div><h4 id="resource" tabindex="-1">@Resource <a class="header-anchor" href="#resource" aria-label="Permalink to &quot;@Resource&quot;">​</a></h4><ul><li><strong>Resource注解源码</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({TYPE, FIELD, METHOD})</span></span>
<span class="line"><span>@Retention(RUNTIME)</span></span>
<span class="line"><span>public @interface Resource {</span></span>
<span class="line"><span>    String name() default &quot;&quot;;</span></span>
<span class="line"><span>    // 其他省略</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从Resource注解源码上看，可以使用在下面这些地方：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.TYPE) #接口、类、枚举、注解</span></span>
<span class="line"><span>@Target(ElementType.FIELD) #字段、枚举的常量</span></span>
<span class="line"><span>@Target(ElementType.METHOD) #方法</span></span></code></pre></div><p>name 指定注入指定名称的组件。</p><ul><li><strong>简单总结</strong>：</li></ul><p>1、@Resource是JSR250规范的实现，在javax.annotation包下</p><p>2、@Resource可以作用TYPE、FIELD、METHOD上</p><p>3、@Resource是默认根据属性名称进行自动装配的，如果有多个类型一样的Bean候选者，则可以通过name进行指定进行注入</p><ul><li><strong>简单使用代码</strong>：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class SuperMan {</span></span>
<span class="line"><span>    @Resource</span></span>
<span class="line"><span>    private Car car;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按照属性名称 car 注入容器中的组件。如果容器中BMW还有BYD两种类型组件。指定加入BMW。如下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class SuperMan {</span></span>
<span class="line"><span>    @Resource(name = &quot;BMW&quot;)</span></span>
<span class="line"><span>    private Car car;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>name 的作用类似 @Qualifier</p><h4 id="inject" tabindex="-1">@Inject <a class="header-anchor" href="#inject" aria-label="Permalink to &quot;@Inject&quot;">​</a></h4><ul><li><strong>Inject注解源码</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ METHOD, CONSTRUCTOR, FIELD })</span></span>
<span class="line"><span>@Retention(RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface Inject {}</span></span></code></pre></div><p>从Inject注解源码上看，可以使用在下面这些地方：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.CONSTRUCTOR) #构造函数</span></span>
<span class="line"><span>@Target(ElementType.METHOD) #方法</span></span>
<span class="line"><span>@Target(ElementType.FIELD) #字段、枚举的常量</span></span></code></pre></div><ul><li><strong>简单总结</strong>：</li></ul><p>1、@Inject是JSR330 (Dependency Injection for Java)中的规范，需要导入javax.inject.Inject jar包 ，才能实现注入</p><p>2、@Inject可以作用CONSTRUCTOR、METHOD、FIELD上</p><p>3、@Inject是根据类型进行自动装配的，如果需要按名称进行装配，则需要配合@Named；</p><ul><li><strong>简单使用代码</strong>：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Inject</span></span>
<span class="line"><span>private Car car;</span></span></code></pre></div><p>指定加入BMW组件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Inject</span></span>
<span class="line"><span>@Named(&quot;BMW&quot;)</span></span>
<span class="line"><span>private Car car;</span></span></code></pre></div><p>@Named 的作用类似 @Qualifier！</p><h4 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h4><p>1、@Autowired是Spring自带的，@Resource是JSR250规范实现的，@Inject是JSR330规范实现的</p><p>2、@Autowired、@Inject用法基本一样，不同的是@Inject没有required属性</p><p>3、@Autowired、@Inject是默认按照类型匹配的，@Resource是按照名称匹配的</p><p>4、@Autowired如果需要按照名称匹配需要和@Qualifier一起使用，@Inject和@Named一起使用，@Resource则通过name进行指定</p><p>如果你还期望源码层理解，我给你找了一篇文章<a href="https://blog.csdn.net/qq_35634181/article/details/104802906" target="_blank" rel="noreferrer">Spring源码分析@Autowired、@Resource注解的区别在新窗口打开</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://www.martinfowler.com/articles/injection.html" target="_blank" rel="noreferrer">Inversion of Control Containers and the Dependency Injection pattern在新窗口打开</a></p><p><a href="https://www.iteye.com/blog/jinnianshilongnian-1413846" target="_blank" rel="noreferrer">https://www.iteye.com/blog/jinnianshilongnian-1413846</a></p><p><a href="https://blog.csdn.net/qq%5C_35634181/article/details/104276056" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_35634181/article/details/104276056</a></p><p><a href="https://www.cnblogs.com/diandianquanquan/p/11518365.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/diandianquanquan/p/11518365.html</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,182)]))}const k=a(o,[["render",r]]);export{v as __pageData,k as default};
