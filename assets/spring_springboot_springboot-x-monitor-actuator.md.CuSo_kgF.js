import{_ as n,c as s,ai as t,o as p}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/spring/springboot/springboot-actuator-1.png",o="/vitepress-blog-template/images/spring/springboot/springboot-actuator-5.png",i="/vitepress-blog-template/images/spring/springboot/springboot-actuator-2.png",l="/vitepress-blog-template/images/spring/springboot/springboot-actuator-3.png",r="/vitepress-blog-template/images/spring/springboot/springboot-actuator-4.png",k=JSON.parse('{"title":"▶SpringBoot监控 - 集成actuator监控工具","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-monitor-actuator.md","filePath":"spring/springboot/springboot-x-monitor-actuator.md","lastUpdated":1737706346000}'),d={name:"spring/springboot/springboot-x-monitor-actuator.md"};function c(u,a,h,g,b,m){return p(),s("div",null,a[0]||(a[0]=[t(`<h1 id="▶springboot监控-集成actuator监控工具" tabindex="-1">▶SpringBoot监控 - 集成actuator监控工具 <a class="header-anchor" href="#▶springboot监控-集成actuator监控工具" aria-label="Permalink to &quot;▶SpringBoot监控 - 集成actuator监控工具&quot;">​</a></h1><blockquote><p>当SpringBoot的应用部署到生产环境中后，如何监控和管理呢？比如审计日志，监控状态，指标收集等。为了解决这个问题，SpringBoot提供了Actuator。本文主要介绍Spring Boot Actuator及实现案例。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要了解什么是Spring Boot Actuator， 以及其提供的功能(Endpoints)。</p></blockquote><h3 id="什么是actuator" tabindex="-1">什么是Actuator? <a class="header-anchor" href="#什么是actuator" aria-label="Permalink to &quot;什么是Actuator?&quot;">​</a></h3><blockquote><p>致动器（actuator）是2018年公布的计算机科学技术名词。</p></blockquote><p><a href="https://baike.baidu.com/item/%E8%87%B4%E5%8A%A8%E5%99%A8/56538368?fr=aladdin" target="_blank" rel="noreferrer">百度百科在新窗口打开</a>的解释如下： 致动器能将某种形式的能量转换为机械能的驱动装置。如热致动器、磁致动器等，在磁盘中是指将电能转换为机械能并带动磁头运动的装置。</p><p>官网给的解释是：An actuator is a manufacturing term that refers to a mechanical device for moving or controlling something. Actuators can generate a large amount of motion from a small change.</p><p>从上述的解释不难知道Spring 命名这个组件为Actuator，就是为了提供监测程序的能力。</p><h3 id="什么是spring-boot-actuator" tabindex="-1">什么是Spring Boot Actuator？ <a class="header-anchor" href="#什么是spring-boot-actuator" aria-label="Permalink to &quot;什么是Spring Boot Actuator？&quot;">​</a></h3><blockquote><p>什么是Spring Boot Actuator? 用在什么样的场景呢？</p></blockquote><p>Spring Boot Actuator提供了对SpringBoot应用程序（可以是生产环境）监视和管理的能力， 可以选择通过使用<strong>HTTP Endpoint</strong>或使用<strong>JMX</strong>来管理和监控SpringBoot应用程序。</p><h3 id="什么是actuator-endpoints" tabindex="-1">什么是Actuator Endpoints？ <a class="header-anchor" href="#什么是actuator-endpoints" aria-label="Permalink to &quot;什么是Actuator Endpoints？&quot;">​</a></h3><p>Spring Boot Actuator 允许你通过Endpoints对Spring Boot进行监控和交互。</p><p>Spring Boot 内置的Endpoint包括（两种Endpoint： WEB和JMX， web方式考虑到安全性默认只开启了/health）：</p><table tabindex="0"><thead><tr><th>ID</th><th>JMX</th><th>Web</th><th>Endpoint功能描述</th></tr></thead><tbody><tr><td>auditevents</td><td>Yes</td><td>No</td><td>暴露当前应用的audit events （依赖AuditEventRepository）</td></tr><tr><td>beans</td><td>Yes</td><td>No</td><td>Spring中所有Beans</td></tr><tr><td>caches</td><td>Yes</td><td>No</td><td>暴露可用的缓存</td></tr><tr><td>conditions</td><td>Yes</td><td>No</td><td>展示configuration 和auto-configuration类中解析的condition，并展示是否匹配的信息.</td></tr><tr><td>configprops</td><td>Yes</td><td>No</td><td>展示所有的@ConfigurationProperties</td></tr><tr><td>env</td><td>Yes</td><td>No</td><td>展示环境变量，来源于ConfigurableEnvironment</td></tr><tr><td>flyway</td><td>Yes</td><td>No</td><td>flyway数据迁移信息（依赖Flyway）</td></tr><tr><td>health</td><td>Yes</td><td><strong>Yes</strong></td><td>展示应用的健康信息</td></tr><tr><td>heapdump</td><td>N/A</td><td>No</td><td>（<strong>web应用时</strong>）hprof 堆的dump文件（依赖HotSpot JVM）</td></tr><tr><td>httptrace</td><td>Yes</td><td>No</td><td>展示HTTP trace信息, 默认展示前100个（依赖HttpTraceRepository）</td></tr><tr><td>info</td><td>Yes</td><td>No</td><td>应用信息</td></tr><tr><td>integrationgraph</td><td>Yes</td><td>No</td><td>展示spring集成信息（依赖spring-integration-core）</td></tr><tr><td>jolokia</td><td>N/A</td><td>No</td><td>（<strong>web应用时</strong>）通过HTTP暴露JMX beans（依赖jolokia-core）</td></tr><tr><td>logfile</td><td>N/A</td><td>No</td><td>（<strong>web应用时</strong>）如果配置了logging.file.name 或者 logging.file.path，展示logfile内容</td></tr><tr><td>loggers</td><td>Yes</td><td>No</td><td>展示或者配置loggers，比如修改日志的等级</td></tr><tr><td>liquibase</td><td>Yes</td><td>No</td><td>Liquibase 数据迁移信息（依赖Liquibase）</td></tr><tr><td>metrics</td><td>Yes</td><td>No</td><td>指标信息</td></tr><tr><td>mappings</td><td>Yes</td><td>No</td><td>@RequestMapping映射路径</td></tr><tr><td>prometheus</td><td>N/A</td><td>No</td><td>（<strong>web应用时</strong>）向prometheus暴露监控信息（依赖micrometer-registry-prometheus）</td></tr><tr><td>quartz</td><td>Yes</td><td>No</td><td>展示 quartz任务信息</td></tr><tr><td>scheduledtasks</td><td>Yes</td><td>No</td><td>展示Spring Scheduled 任务信息</td></tr><tr><td>sessions</td><td>Yes</td><td>No</td><td>session信息</td></tr><tr><td>shutdown</td><td>Yes</td><td>No</td><td>关闭应用</td></tr><tr><td>startup</td><td>Yes</td><td>No</td><td>展示ApplicationStartup的startup步骤的数据（依赖通在SpringApplication配置BufferingApplicationStartup）</td></tr><tr><td>threaddump</td><td>Yes</td><td>No</td><td>线程dump</td></tr></tbody></table><p>当然你也可以自己定义暴露哪些endpoint,</p><p>不如JMX时：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management:</span></span>
<span class="line"><span>  endpoints:</span></span>
<span class="line"><span>    jmx:</span></span>
<span class="line"><span>      exposure:</span></span>
<span class="line"><span>        include: &quot;health,info&quot;</span></span></code></pre></div><p>web时(*代表所有）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management:</span></span>
<span class="line"><span>  endpoints:</span></span>
<span class="line"><span>    web:</span></span>
<span class="line"><span>      exposure:</span></span>
<span class="line"><span>        include: &quot;*&quot;</span></span>
<span class="line"><span>        exclude: &quot;env,beans&quot;</span></span></code></pre></div><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>我们通过一个简单的例子，来展示自定义配置指定的endpoint，然后围绕这个简单的例子，谈谈后续拓展。</p></blockquote><h3 id="pom引入actuator包" tabindex="-1">POM引入actuator包 <a class="header-anchor" href="#pom引入actuator包" aria-label="Permalink to &quot;POM引入actuator包&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="yml配置" tabindex="-1">yml配置 <a class="header-anchor" href="#yml配置" aria-label="Permalink to &quot;yml配置&quot;">​</a></h3><p>自定义暴露哪些endpoint, 比如如下yml配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server:</span></span>
<span class="line"><span>  port: 8080</span></span>
<span class="line"><span></span></span>
<span class="line"><span>management:</span></span>
<span class="line"><span>  endpoints:</span></span>
<span class="line"><span>    enabled-by-default: false</span></span>
<span class="line"><span>    web:</span></span>
<span class="line"><span>      base-path: /manage</span></span>
<span class="line"><span>      exposure:</span></span>
<span class="line"><span>        include: &#39;info,health,env,beans&#39;</span></span>
<span class="line"><span>  endpoint:</span></span>
<span class="line"><span>    info:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>    health:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>    env:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>    beans:</span></span>
<span class="line"><span>      enabled: true</span></span></code></pre></div><p>上述配置只暴露info,health,env,beans四个endpoints, web通过可以<code>/manage</code>访问，</p><p><img src="`+e+`" alt="error.图片加载失败"></p><h3 id="endpoints的进一步拓展配置" tabindex="-1">Endpoints的进一步拓展配置 <a class="header-anchor" href="#endpoints的进一步拓展配置" aria-label="Permalink to &quot;Endpoints的进一步拓展配置&quot;">​</a></h3><h4 id="与springsecurity集成保障安全" tabindex="-1">与SpringSecurity集成保障安全 <a class="header-anchor" href="#与springsecurity集成保障安全" aria-label="Permalink to &quot;与SpringSecurity集成保障安全&quot;">​</a></h4><p>正是由于endpoint可能潜在暴露应用的安全性，web方式的endpoint才在默认情况下只暴露了一个/health。</p><p>如果你需要暴露更多，并保证endpoint接口安全，可以与Spring Security集成，比如</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration(proxyBeanMethods = false)</span></span>
<span class="line"><span>public class MySecurityConfiguration {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>        http.requestMatcher(EndpointRequest.toAnyEndpoint())</span></span>
<span class="line"><span>                .authorizeRequests((requests) -&gt; requests.anyRequest().hasRole(&quot;ENDPOINT_ADMIN&quot;));</span></span>
<span class="line"><span>        http.httpBasic();</span></span>
<span class="line"><span>        return http.build();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="endpoint跨域访问" tabindex="-1">Endpoint跨域访问 <a class="header-anchor" href="#endpoint跨域访问" aria-label="Permalink to &quot;Endpoint跨域访问&quot;">​</a></h4><p>跨域访问，可以通过如下配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management:</span></span>
<span class="line"><span>  endpoints:</span></span>
<span class="line"><span>    web:</span></span>
<span class="line"><span>      cors:</span></span>
<span class="line"><span>        allowed-origins: &quot;https://example.com&quot;</span></span>
<span class="line"><span>        allowed-methods: &quot;GET,POST&quot;</span></span></code></pre></div><h4 id="实现自己的endpoint" tabindex="-1">实现自己的Endpoint <a class="header-anchor" href="#实现自己的endpoint" aria-label="Permalink to &quot;实现自己的Endpoint&quot;">​</a></h4><p>我们可以通过@JmxEndpoint or @WebEndpoint注解来定义自己的endpoint, 然后通过@ReadOperation, @WriteOperation或者@DeleteOperation来暴露操作，</p><p>比如添加系统时间date的endpoint</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.actuator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.time.LocalDateTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;</span></span>
<span class="line"><span>import org.springframework.boot.actuate.endpoint.web.annotation.WebEndpoint;</span></span>
<span class="line"><span>import org.springframework.http.ResponseEntity;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RestController(&quot;custom&quot;)</span></span>
<span class="line"><span>@WebEndpoint(id = &quot;date&quot;)</span></span>
<span class="line"><span>public class CustomEndpointController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ReadOperation</span></span>
<span class="line"><span>    public ResponseEntity&lt;String&gt; currentDate() {</span></span>
<span class="line"><span>        return ResponseEntity.ok(LocalDateTime.now().toString());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>enable 自定义的date</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management:</span></span>
<span class="line"><span>  endpoints:</span></span>
<span class="line"><span>    enabled-by-default: false</span></span>
<span class="line"><span>    web:</span></span>
<span class="line"><span>      base-path: /manage</span></span>
<span class="line"><span>      exposure:</span></span>
<span class="line"><span>        include: &#39;info,health,env,beans,date&#39;</span></span>
<span class="line"><span>  endpoint:</span></span>
<span class="line"><span>    info:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>    health:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>    env:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>    beans:</span></span>
<span class="line"><span>      enabled: true</span></span>
<span class="line"><span>    date:</span></span>
<span class="line"><span>      enabled: true</span></span></code></pre></div><p>你可以看到所有开放的接口中增加了date</p><p><img src="`+o+'" alt="error.图片加载失败"></p><p>访问效果</p><p><img src="'+i+'" alt="error.图片加载失败"></p><h4 id="组件的health状况" tabindex="-1">组件的health状况 <a class="header-anchor" href="#组件的health状况" aria-label="Permalink to &quot;组件的health状况&quot;">​</a></h4><p>SpringBoot默认集成了如下常见中间件的health监控</p><p><img src="'+l+`" alt="error.图片加载失败"></p><p>当然你也可以自定义HealthIndicator</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.actuator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.boot.actuate.health.Health;</span></span>
<span class="line"><span>import org.springframework.boot.actuate.health.HealthIndicator;</span></span>
<span class="line"><span>import org.springframework.stereotype.Component;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class CustomHealthIndicator implements HealthIndicator {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Health health() {</span></span>
<span class="line"><span>        int errorCode = check();</span></span>
<span class="line"><span>        if (errorCode!=0) {</span></span>
<span class="line"><span>            return Health.down().withDetail(&quot;Error Code&quot;, errorCode).build();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return Health.up().build();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int check() {</span></span>
<span class="line"><span>        // perform some specific health check</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>更详细的信息可以参考<a href="https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.endpoints.health" target="_blank" rel="noreferrer">官网在新窗口打开</a></p><h4 id="metrics接入监控系统" tabindex="-1">Metrics接入监控系统 <a class="header-anchor" href="#metrics接入监控系统" aria-label="Permalink to &quot;Metrics接入监控系统&quot;">​</a></h4><p>这个也是比较常用的，具体参考</p><p><img src="`+r+`" alt="error.图片加载失败"></p><h4 id="info信息如何获取" tabindex="-1">Info信息如何获取 <a class="header-anchor" href="#info信息如何获取" aria-label="Permalink to &quot;Info信息如何获取&quot;">​</a></h4><p>有细心的小伙伴会发现/info是空的，最简单的配置方式是在spring-boot-maven-plugin中加入build-info， 编译成jar后运行，即可获取info：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;plugins&gt;</span></span>
<span class="line"><span>    &lt;plugin&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;executions&gt;</span></span>
<span class="line"><span>            &lt;execution&gt;</span></span>
<span class="line"><span>                &lt;goals&gt;</span></span>
<span class="line"><span>                    &lt;goal&gt;build-info&lt;/goal&gt;</span></span>
<span class="line"><span>                &lt;/goals&gt;</span></span>
<span class="line"><span>            &lt;/execution&gt;</span></span>
<span class="line"><span>        &lt;/executions&gt;</span></span>
<span class="line"><span>    &lt;/plugin&gt;</span></span>
<span class="line"><span>&lt;/plugins&gt;</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考资料" tabindex="-1">参考资料 <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料&quot;">​</a></h2><p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.enabling" target="_blank" rel="noreferrer">https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.enabling</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,65)]))}const v=n(d,[["render",c]]);export{k as __pageData,v as default};
