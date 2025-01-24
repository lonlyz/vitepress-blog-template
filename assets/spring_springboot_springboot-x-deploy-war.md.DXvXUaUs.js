import{_ as n,c as s,ai as p,o as t}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/spring/springboot/springboot-x-war-1.png",l="/vitepress-blog-template/images/spring/springboot/springboot-x-war-2.png",r="/vitepress-blog-template/images/spring/springboot/springboot-x-war-3.png",m=JSON.parse('{"title":"SpringBoot应用部署 - 打包成war部署","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-deploy-war.md","filePath":"spring/springboot/springboot-x-deploy-war.md","lastUpdated":1737706346000}'),i={name:"spring/springboot/springboot-x-deploy-war.md"};function o(c,a,g,d,h,b){return t(),s("div",null,a[0]||(a[0]=[p(`<h1 id="springboot应用部署-打包成war部署" tabindex="-1">SpringBoot应用部署 - 打包成war部署 <a class="header-anchor" href="#springboot应用部署-打包成war部署" aria-label="Permalink to &quot;SpringBoot应用部署 - 打包成war部署&quot;">​</a></h1><blockquote><p>前文我们知道SpringBoot web项目默认打包成jar部署是非常方便的，那什么样的场景下还会打包成war呢？本文主要介绍SpringBoot应用打包成war包的示例。@pdai</p></blockquote><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><blockquote><p>前文我们知道SpringBoot web项目默认打包成jar部署是非常方便的，那什么样的场景下还会打包成war呢？</p></blockquote><p>这主要是由于在早期没有SpringBoot时，一些老的项目已经通过Tomcat独立部署war包，并构建了相应的部署体系和闭环。而且对于老的成熟的项目不期望在投入精力去升级和改造，只需要最小大家的保证运行稳定，为了投入和产出的平衡。</p><p>在这种情况下，如果有一些必要性的更新（比如高危漏洞的修复），需要编译成war包。</p><h2 id="打包成war" tabindex="-1">打包成war <a class="header-anchor" href="#打包成war" aria-label="Permalink to &quot;打包成war&quot;">​</a></h2><blockquote><p>这里以一个Helloworld项目（<a href="https://pdai.tech/md/spring/springboot/springboot-x-hello-world.html" target="_blank" rel="noreferrer">SpringBoot入门 - 创建第一个Hello world工程</a>）为例打包成war。</p></blockquote><h3 id="将pom中packaging设置为war类型" tabindex="-1">将pom中packaging设置为war类型 <a class="header-anchor" href="#将pom中packaging设置为war类型" aria-label="Permalink to &quot;将pom中packaging设置为war类型&quot;">​</a></h3><p>默认是jar类型，需要添加或者改成war类型</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;groupId&gt;tech.pdai&lt;/groupId&gt;</span></span>
<span class="line"><span>&lt;artifactId&gt;103-springboot-demo-helloworld-build-war&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;packaging&gt;war&lt;/packaging&gt;</span></span>
<span class="line"><span>&lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;</span></span></code></pre></div><h3 id="移除内嵌的tomcat-并增加servlet-api的依赖包" tabindex="-1">移除内嵌的Tomcat，并增加servlet-api的依赖包 <a class="header-anchor" href="#移除内嵌的tomcat-并增加servlet-api的依赖包" aria-label="Permalink to &quot;移除内嵌的Tomcat，并增加servlet-api的依赖包&quot;">​</a></h3><p>因为默认内嵌了tomcat，所以需要移除；并增加servlet-api相关的包。</p><p><img src="`+e+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;exclusions&gt;</span></span>
<span class="line"><span>        &lt;exclusion&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-boot-starter-tomcat&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;/exclusion&gt;</span></span>
<span class="line"><span>    &lt;/exclusions&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;javax.servlet&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;javax.servlet-api&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;scope&gt;provided&lt;/scope&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="启动类继承springbootservletinitialize" tabindex="-1">启动类继承SpringBootServletInitialize <a class="header-anchor" href="#启动类继承springbootservletinitialize" aria-label="Permalink to &quot;启动类继承SpringBootServletInitialize&quot;">​</a></h3><p>修改项目默认启动方式，启动类继承SpringBootServletInitializer类并重写configure()方法</p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>完整代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@SpringBootApplication</span></span>
<span class="line"><span>@RestController</span></span>
<span class="line"><span>public class SpringBootHelloWorldApplication extends SpringBootServletInitializer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * main interface.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param args args</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        SpringApplication.run(SpringBootHelloWorldApplication.class, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * hello world.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return hello</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @GetMapping(&quot;/hello&quot;)</span></span>
<span class="line"><span>    public ResponseEntity&lt;String&gt; hello() {</span></span>
<span class="line"><span>        return new ResponseEntity&lt;&gt;(&quot;hello world&quot;, HttpStatus.OK);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {</span></span>
<span class="line"><span>        return builder.sources(SpringBootHelloWorldApplication.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="maven打包成war的插件" tabindex="-1">maven打包成war的插件 <a class="header-anchor" href="#maven打包成war的插件" aria-label="Permalink to &quot;maven打包成war的插件&quot;">​</a></h3><p>使用maven-war-plugin插件进行打包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;plugin&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;maven-war-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.3.1&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;configuration&gt;</span></span>
<span class="line"><span>        &lt;failOnMissingWebXml&gt;false&lt;/failOnMissingWebXml&gt;</span></span>
<span class="line"><span>    &lt;/configuration&gt;</span></span>
<span class="line"><span>&lt;/plugin&gt;</span></span></code></pre></div><h3 id="打包测试" tabindex="-1">打包测试 <a class="header-anchor" href="#打包测试" aria-label="Permalink to &quot;打包测试&quot;">​</a></h3><p>通过maven 进行打包测试</p><p><img src="`+r+'" alt="error.图片加载失败"></p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过几个问题进一步理解。</p></blockquote><h3 id="如何将三方jar打包进来" tabindex="-1">如何将三方jar打包进来？ <a class="header-anchor" href="#如何将三方jar打包进来" aria-label="Permalink to &quot;如何将三方jar打包进来？&quot;">​</a></h3><blockquote><p>在项目中我们经常需要使用第三方的Jar，比如某些SDK，这些SDK没有直接发布到公开的maven仓库中，这种情况下如何使用这些三方JAR呢？</p></blockquote><p>请参看：<a href="https://pdai.tech/md/spring/springboot/springboot-x-deploy-jar-3rd.html" target="_blank" rel="noreferrer">SpringBoot应用部署 - 使用第三方JAR包</a></p><h3 id="如何打包成jar包呢" tabindex="-1">如何打包成jar包呢？ <a class="header-anchor" href="#如何打包成jar包呢" aria-label="Permalink to &quot;如何打包成jar包呢？&quot;">​</a></h3><p>请参看：<a href="https://pdai.tech/md/spring/springboot/springboot-x-deploy-jar.html" target="_blank" rel="noreferrer">SpringBoot应用部署 - 打包成jar部署</a></p><h3 id="如何打包成docker镜像呢" tabindex="-1">如何打包成docker镜像呢？ <a class="header-anchor" href="#如何打包成docker镜像呢" aria-label="Permalink to &quot;如何打包成docker镜像呢？&quot;">​</a></h3><p>请参看：<a href="https://pdai.tech/md/spring/springboot/springboot-x-deploy-docker.html" target="_blank" rel="noreferrer">SpringBoot应用部署 - 打包成docker镜像</a></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',38)]))}const k=n(i,[["render",o]]);export{m as __pageData,k as default};
