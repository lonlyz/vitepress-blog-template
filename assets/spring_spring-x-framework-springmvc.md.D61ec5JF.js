import{_ as n}from"./chunks/spring-springframework-mvc-5.BsR4fwMq.js";import{_ as a,c as p,ai as e,o as t}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-3.png",i="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-2.png",r="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-1.png",o="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-4.png",c="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-8.png",g="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-6.png",m="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-9.png",d="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-7.png",u="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-14.png",h="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-15.png",v="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-16.png",b="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-17.png",w="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-18.png",k="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-19.png",q="/vitepress-blog-template/images/spring/springframework/spring-springframework-mvc-20.png",j=JSON.parse('{"title":"Spring基础 - SpringMVC请求流程和案例","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-springmvc.md","filePath":"spring/spring-x-framework-springmvc.md","lastUpdated":1737706346000}'),f={name:"spring/spring-x-framework-springmvc.md"};function x(S,s,C,M,V,_){return t(),p("div",null,s[0]||(s[0]=[e('<h1 id="spring基础-springmvc请求流程和案例" tabindex="-1">Spring基础 - SpringMVC请求流程和案例 <a class="header-anchor" href="#spring基础-springmvc请求流程和案例" aria-label="Permalink to &quot;Spring基础 - SpringMVC请求流程和案例&quot;">​</a></h1><blockquote><p>前文我们介绍了Spring框架和Spring框架中最为重要的两个技术点（IOC和AOP），那我们如何更好的构建上层的应用呢（比如web 应用），这便是SpringMVC；Spring MVC是Spring在Spring Container Core和AOP等技术基础上，遵循上述Web MVC的规范推出的web开发框架，目的是为了简化Java栈的web开发。 本文主要介绍SpringMVC主要的流程和基础案例的编写和运行。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>前文我们介绍了Spring框架和Spring框架中最为重要的两个技术点（IOC和AOP），同时我们也通过几个Demo应用了Core Container中包</p></blockquote><p><img src="'+l+'" alt="error.图片加载失败"></p><p>Demo中core container中包使用如下</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>那么问题是，我们如何更好的构建上层的应用呢？比如web 应用？</p><p><img src="'+r+'" alt="error.图片加载失败"></p><p>针对上层的Web应用，SpringMVC诞生了，它也是Spring技术栈中最为重要的一个框架。</p><p><strong>所以为了更好的帮助你串联整个知识体系，我列出了几个问题，通过如下几个问题帮你深入浅出的构建对SpringMVC的认知</strong>。</p><ul><li>Java技术栈的Web应用是如何发展的？</li><li>什么是MVC，什么是SpringMVC？</li><li>SpringMVC主要的请求流程是什么样的？</li><li>SpringMVC中还有哪些组件？</li><li>如何编写一个简单的SpringMVC程序呢？</li></ul><h2 id="什么是mvc" tabindex="-1">什么是MVC <a class="header-anchor" href="#什么是mvc" aria-label="Permalink to &quot;什么是MVC&quot;">​</a></h2><blockquote><p>MVC英文是Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写，一种软件设计规范。本质上也是一种解耦。</p></blockquote><p>用一种业务逻辑、数据、界面显示分离的方法，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。MVC被独特的发展起来用于映射传统的输入、处理和输出功能在一个逻辑的图形化用户界面的结构中。</p><p><img src="'+o+'" alt="error.图片加载失败"></p><ul><li><strong>Model</strong>（模型）是应用程序中用于处理应用程序数据逻辑的部分。通常模型对象负责在数据库中存取数据。</li><li><strong>View</strong>（视图）是应用程序中处理数据显示的部分。通常视图是依据模型数据创建的。</li><li><strong>Controller</strong>（控制器）是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入，并向模型发送数据。</li></ul><h2 id="什么是spring-mvc" tabindex="-1">什么是Spring MVC <a class="header-anchor" href="#什么是spring-mvc" aria-label="Permalink to &quot;什么是Spring MVC&quot;">​</a></h2><blockquote><p>简单而言，Spring MVC是Spring在Spring Container Core和AOP等技术基础上，遵循上述Web MVC的规范推出的web开发框架，目的是为了简化Java栈的web开发。@pdai</p></blockquote><p>(PS：从我的理解就上述一句话，为了读者学习，这里找了下kaitao老师写的SpringMVC的介绍)</p><p>Spring Web MVC 是一种基于Java 的实现了Web MVC 设计模式的请求驱动类型的轻量级Web 框架，即使用了MVC 架 构模式的思想，将 web 层进行职责解耦，基于请求驱动指的就是使用请求-响应模型，框架的目的就是帮助我们简化开 发，Spring Web MVC 也是要简化我们日常Web 开发的。</p><p><strong>相关特性如下</strong>：</p><ul><li>让我们能非常简单的设计出干净的Web 层和薄薄的Web 层；</li><li>进行更简洁的Web 层的开发；</li><li>天生与Spring 框架集成（如IoC 容器、AOP 等）；</li><li>提供强大的约定大于配置的契约式编程支持；</li><li>能简单的进行Web 层的单元测试；</li><li>支持灵活的URL 到页面控制器的映射；</li><li>非常容易与其他视图技术集成，如 Velocity、FreeMarker 等等，因为模型数据不放在特定的 API 里，而是放在一个 Model 里（Map 数据结构实现，因此很容易被其他框架使用）；</li><li>非常灵活的数据验证、格式化和数据绑定机制，能使用任何对象进行数据绑定，不必实现特定框架的API；</li><li>提供一套强大的JSP 标签库，简化JSP 开发；</li><li>支持灵活的本地化、主题等解析；</li><li>更加简单的异常处理；</li><li>对静态资源的支持；</li><li>支持Restful 风格。</li></ul><h2 id="spring-mvc的请求流程" tabindex="-1">Spring MVC的请求流程 <a class="header-anchor" href="#spring-mvc的请求流程" aria-label="Permalink to &quot;Spring MVC的请求流程&quot;">​</a></h2><blockquote><p>Spring Web MVC 框架也是一个基于请求驱动的Web 框架，并且也使用了前端控制器模式来进行设计，再根据请求映射 规则分发给相应的页面控制器（动作/处理器）进行处理。</p></blockquote><h3 id="核心架构的具体流程步骤" tabindex="-1">核心架构的具体流程步骤 <a class="header-anchor" href="#核心架构的具体流程步骤" aria-label="Permalink to &quot;核心架构的具体流程步骤&quot;">​</a></h3><blockquote><p>首先让我们整体看一下Spring Web MVC 处理请求的流程：</p></blockquote><p><img src="'+n+'" alt="error.图片加载失败"></p><p><strong>核心架构的具体流程步骤</strong>如下：</p><ol><li><strong>首先用户发送请求——&gt;DispatcherServlet</strong>，前端控制器收到请求后自己不进行处理，而是委托给其他的解析器进行 处理，作为统一访问点，进行全局的流程控制；</li><li><strong>DispatcherServlet——&gt;HandlerMapping</strong>， HandlerMapping 将会把请求映射为 HandlerExecutionChain 对象（包含一 个Handler 处理器（页面控制器）对象、多个HandlerInterceptor 拦截器）对象，通过这种策略模式，很容易添加新 的映射策略；</li><li><strong>DispatcherServlet——&gt;HandlerAdapter</strong>，HandlerAdapter 将会把处理器包装为适配器，从而支持多种类型的处理器， 即适配器设计模式的应用，从而很容易支持很多类型的处理器；</li><li><strong>HandlerAdapter——&gt;处理器功能处理方法的调用</strong>，HandlerAdapter 将会根据适配的结果调用真正的处理器的功能处 理方法，完成功能处理；并返回一个ModelAndView 对象（包含模型数据、逻辑视图名）；</li><li><strong>ModelAndView 的逻辑视图名——&gt; ViewResolver</strong>，ViewResolver 将把逻辑视图名解析为具体的View，通过这种策 略模式，很容易更换其他视图技术；</li><li><strong>View——&gt;渲染</strong>，View 会根据传进来的Model 模型数据进行渲染，此处的Model 实际是一个Map 数据结构，因此 很容易支持其他视图技术；</li><li><strong>返回控制权给DispatcherServlet</strong>，由DispatcherServlet 返回响应给用户，到此一个流程结束。</li></ol><h3 id="对上述流程的补充" tabindex="-1">对上述流程的补充 <a class="header-anchor" href="#对上述流程的补充" aria-label="Permalink to &quot;对上述流程的补充&quot;">​</a></h3><blockquote><p>上述流程只是核心流程，这里我们再补充一些其它组件：</p></blockquote><ol><li><strong>Filter(ServletFilter)</strong></li></ol><p>进入Servlet前可以有preFilter, Servlet处理之后还可有postFilter</p><p><img src="'+c+'" alt="error.图片加载失败"></p><ol start="2"><li><strong>LocaleResolver</strong></li></ol><p>在视图解析/渲染时，还需要考虑国际化(Local)，显然这里需要有LocaleResolver.</p><p><img src="'+g+'" alt="error.图片加载失败"></p><ol start="3"><li><strong>ThemeResolver</strong></li></ol><p>如何控制视图样式呢？SpringMVC中还设计了ThemeSource接口和ThemeResolver，包含一些静态资源的集合(样式及图片等），用来控制应用的视觉风格。</p><p><img src="'+m+'" alt="error.图片加载失败"></p><ol start="4"><li><strong>对于文件的上传请求</strong>？</li></ol><p>对于常规请求上述流程是合理的，但是如果是文件的上传请求，那么就不太一样了；所以这里便出现了MultipartResolver。</p><p><img src="'+d+'" alt="error.图片加载失败"></p><h2 id="spring-mvc案例" tabindex="-1">Spring MVC案例 <a class="header-anchor" href="#spring-mvc案例" aria-label="Permalink to &quot;Spring MVC案例&quot;">​</a></h2><blockquote><p>这里主要向你展示一个基本的SpringMVC例子，后文中将通过以Debug的方式分析源码。</p></blockquote><p>本例子中主要文件和结构如下：</p><p><img src="'+u+`" alt="error.图片加载失败"></p><h3 id="maven包引入" tabindex="-1">Maven包引入 <a class="header-anchor" href="#maven包引入" aria-label="Permalink to &quot;Maven包引入&quot;">​</a></h3><p>主要引入spring-webmvc包（spring-webmvc包中已经包含了Spring Core Container相关的包），以及servlet和jstl（JSP中使用jstl)的包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
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
<span class="line"><span>    &lt;artifactId&gt;011-spring-framework-demo-springmvc&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;packaging&gt;war&lt;/packaging&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;properties&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.source&gt;8&lt;/maven.compiler.source&gt;</span></span>
<span class="line"><span>        &lt;maven.compiler.target&gt;8&lt;/maven.compiler.target&gt;</span></span>
<span class="line"><span>        &lt;spring.version&gt;5.3.9&lt;/spring.version&gt;</span></span>
<span class="line"><span>        &lt;servlet.version&gt;4.0.1&lt;/servlet.version&gt;</span></span>
<span class="line"><span>    &lt;/properties&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;dependencies&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-webmvc&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;\${spring.version}&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;javax.servlet&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;javax.servlet-api&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;\${servlet.version}&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;javax.servlet&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;jstl&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;1.2&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;taglibs&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;standard&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;1.1.2&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;/dependencies&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/project&gt;</span></span></code></pre></div><h3 id="业务代码的编写" tabindex="-1">业务代码的编写 <a class="header-anchor" href="#业务代码的编写" aria-label="Permalink to &quot;业务代码的编写&quot;">​</a></h3><p>User实体</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.springmvc.entity;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>Dao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.springmvc.dao;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.stereotype.Repository;</span></span>
<span class="line"><span>import tech.pdai.springframework.springmvc.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Collections;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>Service</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.springmvc.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>import tech.pdai.springframework.springmvc.dao.UserDaoImpl;</span></span>
<span class="line"><span>import tech.pdai.springframework.springmvc.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>Controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.springmvc.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.stereotype.Controller;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.servlet.ModelAndView;</span></span>
<span class="line"><span>import tech.pdai.springframework.springmvc.service.UserServiceImpl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.servlet.http.HttpServletRequest;</span></span>
<span class="line"><span>import javax.servlet.http.HttpServletResponse;</span></span>
<span class="line"><span>import java.util.Date;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * User Controller.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Controller</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private UserServiceImpl userService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * find user list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param request  request</span></span>
<span class="line"><span>     * @param response response</span></span>
<span class="line"><span>     * @return model and view</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @RequestMapping(&quot;/user&quot;)</span></span>
<span class="line"><span>    public ModelAndView list(HttpServletRequest request, HttpServletResponse response) {</span></span>
<span class="line"><span>        ModelAndView modelAndView = new ModelAndView();</span></span>
<span class="line"><span>        modelAndView.addObject(&quot;dateTime&quot;, new Date());</span></span>
<span class="line"><span>        modelAndView.addObject(&quot;userList&quot;, userService.findUserList());</span></span>
<span class="line"><span>        modelAndView.setViewName(&quot;userList&quot;); // views目录下userList.jsp</span></span>
<span class="line"><span>        return modelAndView;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="webapp下的web-xml" tabindex="-1">webapp下的web.xml <a class="header-anchor" href="#webapp下的web-xml" aria-label="Permalink to &quot;webapp下的web.xml&quot;">​</a></h3><p>（创建上图的文件结构）</p><p>webapp下的web.xml如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;web-app xmlns=&quot;http://xmlns.jcp.org/xml/ns/javaee&quot;</span></span>
<span class="line"><span>         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd&quot;</span></span>
<span class="line"><span>         version=&quot;3.1&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;display-name&gt;SpringFramework - SpringMVC Demo @pdai&lt;/display-name&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;servlet&gt;</span></span>
<span class="line"><span>        &lt;servlet-name&gt;springmvc-demo&lt;/servlet-name&gt;</span></span>
<span class="line"><span>        &lt;servlet-class&gt;org.springframework.web.servlet.DispatcherServlet&lt;/servlet-class&gt;</span></span>
<span class="line"><span>        &lt;!-- 通过初始化参数指定SpringMVC配置文件的位置和名称 --&gt;</span></span>
<span class="line"><span>        &lt;init-param&gt;</span></span>
<span class="line"><span>            &lt;param-name&gt;contextConfigLocation&lt;/param-name&gt;</span></span>
<span class="line"><span>            &lt;param-value&gt;classpath:springmvc.xml&lt;/param-value&gt;</span></span>
<span class="line"><span>        &lt;/init-param&gt;</span></span>
<span class="line"><span>        &lt;load-on-startup&gt;1&lt;/load-on-startup&gt;</span></span>
<span class="line"><span>    &lt;/servlet&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;servlet-mapping&gt;</span></span>
<span class="line"><span>        &lt;servlet-name&gt;springmvc-demo&lt;/servlet-name&gt;</span></span>
<span class="line"><span>        &lt;url-pattern&gt;/&lt;/url-pattern&gt;</span></span>
<span class="line"><span>    &lt;/servlet-mapping&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;filter&gt;</span></span>
<span class="line"><span>        &lt;filter-name&gt;encodingFilter&lt;/filter-name&gt;</span></span>
<span class="line"><span>        &lt;filter-class&gt;org.springframework.web.filter.CharacterEncodingFilter&lt;/filter-class&gt;</span></span>
<span class="line"><span>        &lt;init-param&gt;</span></span>
<span class="line"><span>            &lt;param-name&gt;encoding&lt;/param-name&gt;</span></span>
<span class="line"><span>            &lt;param-value&gt;UTF-8&lt;/param-value&gt;</span></span>
<span class="line"><span>        &lt;/init-param&gt;</span></span>
<span class="line"><span>        &lt;init-param&gt;</span></span>
<span class="line"><span>            &lt;param-name&gt;forceEncoding&lt;/param-name&gt;</span></span>
<span class="line"><span>            &lt;param-value&gt;true&lt;/param-value&gt;</span></span>
<span class="line"><span>        &lt;/init-param&gt;</span></span>
<span class="line"><span>    &lt;/filter&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;filter-mapping&gt;</span></span>
<span class="line"><span>        &lt;filter-name&gt;encodingFilter&lt;/filter-name&gt;</span></span>
<span class="line"><span>        &lt;url-pattern&gt;/*&lt;/url-pattern&gt;</span></span>
<span class="line"><span>    &lt;/filter-mapping&gt;</span></span>
<span class="line"><span>&lt;/web-app&gt;</span></span></code></pre></div><h3 id="springmvc-xml" tabindex="-1">springmvc.xml <a class="header-anchor" href="#springmvc-xml" aria-label="Permalink to &quot;springmvc.xml&quot;">​</a></h3><p>web.xml中我们配置初始化参数contextConfigLocation，路径是classpath:springmvc.xml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;init-param&gt;</span></span>
<span class="line"><span>    &lt;param-name&gt;contextConfigLocation&lt;/param-name&gt;</span></span>
<span class="line"><span>    &lt;param-value&gt;classpath:springmvc.xml&lt;/param-value&gt;</span></span>
<span class="line"><span>&lt;/init-param&gt;</span></span></code></pre></div><p>在resources目录下创建</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>       xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>       xmlns:context=&quot;http://www.springframework.org/schema/context&quot;</span></span>
<span class="line"><span>       xmlns:mvc=&quot;http://www.springframework.org/schema/mvc&quot;</span></span>
<span class="line"><span>       xmlns:jpa=&quot;http://www.springframework.org/schema/data/jpa&quot;</span></span>
<span class="line"><span>       xmlns:tx=&quot;http://www.springframework.org/schema/tx&quot;</span></span>
<span class="line"><span>       xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd</span></span>
<span class="line"><span>       http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd</span></span>
<span class="line"><span>       http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd</span></span>
<span class="line"><span>       http://www.springframework.org/schema/data/jpa http://www.springframework.org/schema/data/jpa/spring-jpa.xsd</span></span>
<span class="line"><span>       http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 扫描注解 --&gt;</span></span>
<span class="line"><span>    &lt;context:component-scan base-package=&quot;tech.pdai.springframework.springmvc&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 静态资源处理 --&gt;</span></span>
<span class="line"><span>    &lt;mvc:default-servlet-handler/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 开启注解 --&gt;</span></span>
<span class="line"><span>    &lt;mvc:annotation-driven/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 视图解析器 --&gt;</span></span>
<span class="line"><span>    &lt;bean id=&quot;jspViewResolver&quot; class=&quot;org.springframework.web.servlet.view.InternalResourceViewResolver&quot;&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;viewClass&quot; value=&quot;org.springframework.web.servlet.view.JstlView&quot;/&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;prefix&quot; value=&quot;/WEB-INF/views/&quot;/&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;suffix&quot; value=&quot;.jsp&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/bean&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/beans&gt;</span></span></code></pre></div><h3 id="jsp视图" tabindex="-1">JSP视图 <a class="header-anchor" href="#jsp视图" aria-label="Permalink to &quot;JSP视图&quot;">​</a></h3><p>创建userList.jsp</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;%@ page contentType=&quot;text/html;charset=UTF-8&quot; language=&quot;java&quot; %&gt;</span></span>
<span class="line"><span>&lt;%@ taglib prefix=&quot;c&quot; uri=&quot;http://java.sun.com/jsp/jstl/core&quot; %&gt;</span></span>
<span class="line"><span>&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span>&lt;html lang=&quot;zh-CN&quot;&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>    &lt;meta charset=&quot;utf-8&quot;&gt;</span></span>
<span class="line"><span>    &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge&quot;&gt;</span></span>
<span class="line"><span>    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;title&gt;User List&lt;/title&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- Bootstrap --&gt;</span></span>
<span class="line"><span>    &lt;link rel=&quot;stylesheet&quot; href=&quot;//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body&gt;</span></span>
<span class="line"><span>    &lt;div class=&quot;container&quot;&gt;</span></span>
<span class="line"><span>        &lt;c:if test=&quot;\${!empty userList}&quot;&gt;</span></span>
<span class="line"><span>            &lt;table class=&quot;table table-bordered table-striped&quot;&gt;</span></span>
<span class="line"><span>                &lt;tr&gt;</span></span>
<span class="line"><span>                    &lt;th&gt;Name&lt;/th&gt;</span></span>
<span class="line"><span>                    &lt;th&gt;Age&lt;/th&gt;</span></span>
<span class="line"><span>                &lt;/tr&gt;</span></span>
<span class="line"><span>                &lt;c:forEach items=&quot;\${userList}&quot; var=&quot;user&quot;&gt;</span></span>
<span class="line"><span>                    &lt;tr&gt;</span></span>
<span class="line"><span>                        &lt;td&gt;\${user.name}&lt;/td&gt;</span></span>
<span class="line"><span>                        &lt;td&gt;\${user.age}&lt;/td&gt;</span></span>
<span class="line"><span>                    &lt;/tr&gt;</span></span>
<span class="line"><span>                &lt;/c:forEach&gt;</span></span>
<span class="line"><span>            &lt;/table&gt;</span></span>
<span class="line"><span>        &lt;/c:if&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div><h3 id="部署测试" tabindex="-1">部署测试 <a class="header-anchor" href="#部署测试" aria-label="Permalink to &quot;部署测试&quot;">​</a></h3><blockquote><p>我们通过IDEA的tomcat插件来进行测试</p></blockquote><p>下载Tomcat：<a href="https://downloads.apache.org/tomcat/" target="_blank" rel="noreferrer">tomcat地址在新窗口打开</a></p><p>下载后给tomcat/bin执行文件赋权</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pdai@MacBook-Pro pdai % cd apache-tomcat-9.0.62 </span></span>
<span class="line"><span>pdai@MacBook-Pro apache-tomcat-9.0.62 % cd bin </span></span>
<span class="line"><span>pdai@MacBook-Pro bin % ls</span></span>
<span class="line"><span>bootstrap.jar			makebase.sh</span></span>
<span class="line"><span>catalina-tasks.xml		setclasspath.bat</span></span>
<span class="line"><span>catalina.bat			setclasspath.sh</span></span>
<span class="line"><span>catalina.sh			shutdown.bat</span></span>
<span class="line"><span>ciphers.bat			shutdown.sh</span></span>
<span class="line"><span>ciphers.sh			startup.bat</span></span>
<span class="line"><span>commons-daemon-native.tar.gz	startup.sh</span></span>
<span class="line"><span>commons-daemon.jar		tomcat-juli.jar</span></span>
<span class="line"><span>configtest.bat			tomcat-native.tar.gz</span></span>
<span class="line"><span>configtest.sh			tool-wrapper.bat</span></span>
<span class="line"><span>daemon.sh			tool-wrapper.sh</span></span>
<span class="line"><span>digest.bat			version.bat</span></span>
<span class="line"><span>digest.sh			version.sh</span></span>
<span class="line"><span>makebase.bat</span></span>
<span class="line"><span>pdai@MacBook-Pro bin % chmod 777 *.sh</span></span>
<span class="line"><span>pdai@MacBook-Pro bin %</span></span></code></pre></div><p>配置Run Congfiuration</p><p><img src="`+h+'" alt="error.图片加载失败"></p><p>添加Tomcat Server - Local</p><p><img src="'+v+'" alt="error.图片加载失败"></p><p>将我们下载的Tomcat和Tomcat Server - Local关联</p><p><img src="'+b+'" alt="error.图片加载失败"></p><p>在Deploy中添加我们的项目</p><p><img src="'+w+'" alt="error.图片加载失败"></p><p>运行和管理Tomcat Sever（注意context路径）</p><p><img src="'+k+'" alt="error.图片加载失败"></p><p>运行后访问我们的web程序页面（注意context路径）</p><p><img src="'+q+'" alt="error.图片加载失败"></p><p>PS：是不是so easy~ @pdai</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>注：</p><p>本文中SpringMVC流程图来源于kaitao的博客，如果你希望全面学习SpringMVC可以查看kaitao总结的<a href="https://pdai.tech/files/kaitao-springMVC.pdf" target="_blank" rel="noreferrer">跟开涛学 SpringMVC</a> （向曾经的大佬致敬）</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',95)]))}const I=a(f,[["render",x]]);export{j as __pageData,I as default};
