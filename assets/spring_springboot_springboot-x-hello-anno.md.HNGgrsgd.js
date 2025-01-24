import{_ as n,c as s,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"SpringBoot入门 - 开发中还有哪些常用注解","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-hello-anno.md","filePath":"spring/springboot/springboot-x-hello-anno.md","lastUpdated":1737706346000}'),t={name:"spring/springboot/springboot-x-hello-anno.md"};function i(o,a,l,r,c,u){return p(),s("div",null,a[0]||(a[0]=[e(`<h1 id="springboot入门-开发中还有哪些常用注解" tabindex="-1">SpringBoot入门 - 开发中还有哪些常用注解 <a class="header-anchor" href="#springboot入门-开发中还有哪些常用注解" aria-label="Permalink to &quot;SpringBoot入门 - 开发中还有哪些常用注解&quot;">​</a></h1><blockquote><p>本文主要介绍一些SpringBoot中常用的注解。@pdai</p></blockquote><h2 id="spring-boot-常用注解" tabindex="-1">Spring Boot 常用注解 <a class="header-anchor" href="#spring-boot-常用注解" aria-label="Permalink to &quot;Spring Boot 常用注解&quot;">​</a></h2><h3 id="springbootapplication" tabindex="-1">@SpringBootApplication <a class="header-anchor" href="#springbootapplication" aria-label="Permalink to &quot;@SpringBootApplication&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.TYPE)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Inherited</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>@EnableAutoConfiguration</span></span>
<span class="line"><span>@ComponentScan</span></span>
<span class="line"><span>public @interface SpringBootApplication {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Exclude specific auto-configuration classes such that they will never be applied.</span></span>
<span class="line"><span>	 * @return the classes to exclude</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	Class&lt;?&gt;[] exclude() default {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>定义在main方法入口类处，用于启动sping boot应用项目</p><h3 id="enableautoconfiguration" tabindex="-1">@EnableAutoConfiguration <a class="header-anchor" href="#enableautoconfiguration" aria-label="Permalink to &quot;@EnableAutoConfiguration&quot;">​</a></h3><p>让spring boot根据类路径中的jar包依赖当前项目进行自动配置</p><p>在src/main/resources的META-INF/spring.factories</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>org.springframework.boot.autoconfigure.EnableAutoConfiguration=\\</span></span>
<span class="line"><span>org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\\</span></span>
<span class="line"><span>org.springframework.boot.autoconfigure.aop.AopAutoConfiguration</span></span>
<span class="line"><span></span></span>
<span class="line"><span>若有多个自动配置，用“，”隔开</span></span></code></pre></div><h3 id="importresource" tabindex="-1">@ImportResource <a class="header-anchor" href="#importresource" aria-label="Permalink to &quot;@ImportResource&quot;">​</a></h3><p>加载xml配置，一般是放在启动main类上</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ImportResource(&quot;classpath*:/spring/*.xml&quot;)  单个</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@ImportResource({&quot;classpath*:/spring/1.xml&quot;,&quot;classpath*:/spring/2.xml&quot;})   多个</span></span></code></pre></div><h3 id="value" tabindex="-1">@Value <a class="header-anchor" href="#value" aria-label="Permalink to &quot;@Value&quot;">​</a></h3><p>application.properties定义属性，直接使用@Value注入即可</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class A{</span></span>
<span class="line"><span>	 @Value(&quot;\${push.start:0}&quot;)    如果缺失，默认值为0</span></span>
<span class="line"><span>     private Long  id;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="configurationproperties-prefix-person" tabindex="-1">@ConfigurationProperties(prefix=&quot;person&quot;) <a class="header-anchor" href="#configurationproperties-prefix-person" aria-label="Permalink to &quot;@ConfigurationProperties(prefix=&quot;person&quot;)&quot;">​</a></h3><p>可以新建一个properties文件，ConfigurationProperties的属性prefix指定properties的配置的前缀，通过location指定properties文件的位置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ConfigurationProperties(prefix=&quot;person&quot;)</span></span>
<span class="line"><span>public class PersonProperties {</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	private String name ;</span></span>
<span class="line"><span>	private int age;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="enableconfigurationproperties" tabindex="-1">@EnableConfigurationProperties <a class="header-anchor" href="#enableconfigurationproperties" aria-label="Permalink to &quot;@EnableConfigurationProperties&quot;">​</a></h3><p>用 @EnableConfigurationProperties注解使 @ConfigurationProperties生效，并从IOC容器中获取bean。</p><p><a href="https://blog.csdn.net/u010502101/article/details/78758330" target="_blank" rel="noreferrer">https://blog.csdn.net/u010502101/article/details/78758330</a></p><h3 id="restcontroller" tabindex="-1">@RestController <a class="header-anchor" href="#restcontroller" aria-label="Permalink to &quot;@RestController&quot;">​</a></h3><p>组合@Controller和@ResponseBody，当你开发一个和页面交互数据的控制时，比如bbs-web的api接口需要此注解</p><h3 id="requestmapping-api2-copper" tabindex="-1">@RequestMapping(&quot;/api2/copper&quot;) <a class="header-anchor" href="#requestmapping-api2-copper" aria-label="Permalink to &quot;@RequestMapping(&quot;/api2/copper&quot;)&quot;">​</a></h3><p>用来映射web请求(访问路径和参数)、处理类和方法，可以注解在类或方法上。注解在方法上的路径会继承注解在类上的路径。</p><p>produces属性: 定制返回的response的媒体类型和字符集，或需返回值是json对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RequestMapping(value=&quot;/api2/copper&quot;,produces=&quot;application/json;charset=UTF-8&quot;,method = RequestMethod.POST)</span></span></code></pre></div><h3 id="requestparam" tabindex="-1">@RequestParam <a class="header-anchor" href="#requestparam" aria-label="Permalink to &quot;@RequestParam&quot;">​</a></h3><p>获取request请求的参数值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public List&lt;CopperVO&gt; getOpList(HttpServletRequest request,</span></span>
<span class="line"><span>                                    @RequestParam(value = &quot;pageIndex&quot;, required = false) Integer pageIndex,</span></span>
<span class="line"><span>                                    @RequestParam(value = &quot;pageSize&quot;, required = false) Integer pageSize) {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="responsebody" tabindex="-1">@ResponseBody <a class="header-anchor" href="#responsebody" aria-label="Permalink to &quot;@ResponseBody&quot;">​</a></h3><p>支持将返回值放在response体内，而不是返回一个页面。比如Ajax接口，可以用此注解返回数据而不是页面。此注解可以放置在返回值前或方法前。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>另一个玩法，可以不用@ResponseBody。</span></span>
<span class="line"><span>继承FastJsonHttpMessageConverter类并对writeInternal方法扩展，在spring响应结果时，再次拦截、加工结果</span></span>
<span class="line"><span>// stringResult: json返回结果</span></span>
<span class="line"><span>//HttpOutputMessage outputMessage</span></span>
<span class="line"><span></span></span>
<span class="line"><span> byte[] payload = stringResult.getBytes();</span></span>
<span class="line"><span> outputMessage.getHeaders().setContentType(META_TYPE);</span></span>
<span class="line"><span> outputMessage.getHeaders().setContentLength(payload.length);</span></span>
<span class="line"><span> outputMessage.getBody().write(payload);</span></span>
<span class="line"><span> outputMessage.getBody().flush();</span></span></code></pre></div><h3 id="bean" tabindex="-1">@Bean <a class="header-anchor" href="#bean" aria-label="Permalink to &quot;@Bean&quot;">​</a></h3><p>@Bean(name=&quot;bean的名字&quot;,initMethod=&quot;初始化时调用方法名字&quot;,destroyMethod=&quot;close&quot;)</p><p>定义在方法上，在容器内初始化一个bean实例类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean(destroyMethod=&quot;close&quot;)</span></span>
<span class="line"><span>@ConditionalOnMissingBean</span></span>
<span class="line"><span>public PersonService registryService() {</span></span>
<span class="line"><span>		return new PersonService();</span></span>
<span class="line"><span>	}</span></span></code></pre></div><h3 id="service" tabindex="-1">@Service <a class="header-anchor" href="#service" aria-label="Permalink to &quot;@Service&quot;">​</a></h3><p>用于标注业务层组件</p><h3 id="controller" tabindex="-1">@Controller <a class="header-anchor" href="#controller" aria-label="Permalink to &quot;@Controller&quot;">​</a></h3><p>用于标注控制层组件(如struts中的action)</p><h3 id="repository" tabindex="-1">@Repository <a class="header-anchor" href="#repository" aria-label="Permalink to &quot;@Repository&quot;">​</a></h3><p>用于标注数据访问组件，即DAO组件</p><h3 id="component" tabindex="-1">@Component <a class="header-anchor" href="#component" aria-label="Permalink to &quot;@Component&quot;">​</a></h3><p>泛指组件，当组件不好归类的时候，我们可以使用这个注解进行标注。</p><h3 id="postconstruct" tabindex="-1">@PostConstruct <a class="header-anchor" href="#postconstruct" aria-label="Permalink to &quot;@PostConstruct&quot;">​</a></h3><p>spring容器初始化时，要执行该方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@PostConstruct  </span></span>
<span class="line"><span>public void init() {   </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="pathvariable" tabindex="-1">@PathVariable <a class="header-anchor" href="#pathvariable" aria-label="Permalink to &quot;@PathVariable&quot;">​</a></h3><p>用来获得请求url中的动态参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Controller  </span></span>
<span class="line"><span>public class TestController {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>     @RequestMapping(value=&quot;/user/{userId}/roles/{roleId}&quot;,method = RequestMethod.GET)  </span></span>
<span class="line"><span>     public String getLogin(@PathVariable(&quot;userId&quot;) String userId,  </span></span>
<span class="line"><span>         @PathVariable(&quot;roleId&quot;) String roleId){</span></span>
<span class="line"><span>           </span></span>
<span class="line"><span>         System.out.println(&quot;User Id : &quot; + userId);  </span></span>
<span class="line"><span>         System.out.println(&quot;Role Id : &quot; + roleId);  </span></span>
<span class="line"><span>         return &quot;hello&quot;;  </span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="componentscan" tabindex="-1">@ComponentScan <a class="header-anchor" href="#componentscan" aria-label="Permalink to &quot;@ComponentScan&quot;">​</a></h3><p>注解会告知Spring扫描指定的包来初始化Spring</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ComponentScan(basePackages = &quot;com.bbs.xx&quot;)</span></span></code></pre></div><h3 id="enablezuulproxy" tabindex="-1">@EnableZuulProxy <a class="header-anchor" href="#enablezuulproxy" aria-label="Permalink to &quot;@EnableZuulProxy&quot;">​</a></h3><p>路由网关的主要目的是为了让所有的微服务对外只有一个接口，我们只需访问一个网关地址，即可由网关将所有的请求代理到不同的服务中。Spring Cloud是通过Zuul来实现的，支持自动路由映射到在Eureka Server上注册的服务。Spring Cloud提供了注解@EnableZuulProxy来启用路由代理。</p><h3 id="autowired" tabindex="-1">@Autowired <a class="header-anchor" href="#autowired" aria-label="Permalink to &quot;@Autowired&quot;">​</a></h3><p>在默认情况下使用 @Autowired 注释进行自动注入时，Spring 容器中匹配的候选 Bean 数目必须有且仅有一个。当找不到一个匹配的 Bean 时，Spring 容器将抛出 BeanCreationException 异常，并指出必须至少拥有一个匹配的 Bean。</p><p>当不能确定 Spring 容器中一定拥有某个类的 Bean 时，可以在需要自动注入该类 Bean 的地方可以使用 @Autowired(required = false)，这等于告诉 Spring: 在找不到匹配 Bean 时也不报错</p><p><a href="https://blog.csdn.net/ethunsex/article/details/66475792" target="_blank" rel="noreferrer">@Autowired注解注入map、list与@Qualifier在新窗口打开</a></p><h3 id="configuration" tabindex="-1">@Configuration <a class="header-anchor" href="#configuration" aria-label="Permalink to &quot;@Configuration&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration(&quot;name&quot;)//表示这是一个配置信息类,可以给这个配置类也起一个名称</span></span>
<span class="line"><span>@ComponentScan(&quot;spring4&quot;)//类似于xml中的&lt;context:component-scan base-package=&quot;spring4&quot;/&gt;</span></span>
<span class="line"><span>public class Config {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired//自动注入，如果容器中有多个符合的bean时，需要进一步明确</span></span>
<span class="line"><span>    @Qualifier(&quot;compent&quot;)//进一步指明注入bean名称为compent的bean</span></span>
<span class="line"><span>    private Compent compent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean//类似于xml中的&lt;bean id=&quot;newbean&quot; class=&quot;spring4.Compent&quot;/&gt;</span></span>
<span class="line"><span>    public Compent newbean(){</span></span>
<span class="line"><span>        return new Compent();</span></span>
<span class="line"><span>    }   </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="import-config1-class" tabindex="-1">@Import(Config1.class) <a class="header-anchor" href="#import-config1-class" aria-label="Permalink to &quot;@Import(Config1.class)&quot;">​</a></h3><p>导入Config1配置类里实例化的bean</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class CDConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean   // 将SgtPeppers注册为 SpringContext中的bean</span></span>
<span class="line"><span>    public CompactDisc compactDisc() {</span></span>
<span class="line"><span>        return new CompactDisc();  // CompactDisc类型的</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>@Import(CDConfig.class)  //导入CDConfig的配置</span></span>
<span class="line"><span>public class CDPlayerConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean(name = &quot;cDPlayer&quot;)</span></span>
<span class="line"><span>    public CDPlayer cdPlayer(CompactDisc compactDisc) {  </span></span>
<span class="line"><span>         // 这里会注入CompactDisc类型的bean</span></span>
<span class="line"><span>         // 这里注入的这个bean是CDConfig.class中的CompactDisc类型的那个bean</span></span>
<span class="line"><span>        return new CDPlayer(compactDisc);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="order" tabindex="-1">@Order <a class="header-anchor" href="#order" aria-label="Permalink to &quot;@Order&quot;">​</a></h3><p>@Order(1)，值越小优先级超高，越先运行</p><h3 id="conditionalonexpression" tabindex="-1">@ConditionalOnExpression <a class="header-anchor" href="#conditionalonexpression" aria-label="Permalink to &quot;@ConditionalOnExpression&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>@ConditionalOnExpression(&quot;\${enabled:false}&quot;)</span></span>
<span class="line"><span>public class BigpipeConfiguration {</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public OrderMessageMonitor orderMessageMonitor(ConfigContext configContext) {</span></span>
<span class="line"><span>        return new OrderMessageMonitor(configContext);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>开关为true的时候才实例化bean</p><h3 id="conditionalonproperty" tabindex="-1">@ConditionalOnProperty <a class="header-anchor" href="#conditionalonproperty" aria-label="Permalink to &quot;@ConditionalOnProperty&quot;">​</a></h3><p>这个注解能够控制某个 @Configuration 是否生效。具体操作是通过其两个属性name以及havingValue来实现的，其中name用来从application.properties中读取某个属性值，如果该值为空，则返回false;如果值不为空，则将该值与havingValue指定的值进行比较，如果一样则返回true;否则返回false。如果返回值为false，则该configuration不生效；为true则生效。</p><p><a href="https://blog.csdn.net/dalangzhonghangxing/article/details/78420057" target="_blank" rel="noreferrer">https://blog.csdn.net/dalangzhonghangxing/article/details/78420057</a></p><h3 id="conditionalonclass" tabindex="-1">@ConditionalOnClass <a class="header-anchor" href="#conditionalonclass" aria-label="Permalink to &quot;@ConditionalOnClass&quot;">​</a></h3><p>该注解的参数对应的类必须存在，否则不解析该注解修饰的配置类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>@ConditionalOnClass({Gson.class})</span></span>
<span class="line"><span>public class GsonAutoConfiguration {</span></span>
<span class="line"><span>    public GsonAutoConfiguration() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    @ConditionalOnMissingBean</span></span>
<span class="line"><span>    public Gson gson() {</span></span>
<span class="line"><span>        return new Gson();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="conditionalonmisssingclass-applicationmanager-class" tabindex="-1">@ConditionalOnMisssingClass({ApplicationManager.class}) <a class="header-anchor" href="#conditionalonmisssingclass-applicationmanager-class" aria-label="Permalink to &quot;@ConditionalOnMisssingClass({ApplicationManager.class})&quot;">​</a></h3><p>如果存在它修饰的类的bean，则不需要再创建这个bean；</p><h3 id="conditiononmissingbean-name-example" tabindex="-1">@ConditionOnMissingBean(name = &quot;example&quot;) <a class="header-anchor" href="#conditiononmissingbean-name-example" aria-label="Permalink to &quot;@ConditionOnMissingBean(name = &quot;example&quot;)&quot;">​</a></h3><p>表示如果name为“example”的bean存在，该注解修饰的代码块不执行。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,82)]))}const g=n(t,[["render",i]]);export{h as __pageData,g as default};
