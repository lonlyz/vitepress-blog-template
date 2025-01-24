import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"SpringBoot接口 - 如何提供多个版本接口","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-version.md","filePath":"spring/springboot/springboot-x-interface-version.md","lastUpdated":1737706346000}'),i={name:"spring/springboot/springboot-x-interface-version.md"};function l(t,n,o,r,c,u){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="springboot接口-如何提供多个版本接口" tabindex="-1">SpringBoot接口 - 如何提供多个版本接口 <a class="header-anchor" href="#springboot接口-如何提供多个版本接口" aria-label="Permalink to &quot;SpringBoot接口 - 如何提供多个版本接口&quot;">​</a></h1><blockquote><p>在以SpringBoot开发Restful接口时，由于模块，系统等业务的变化，需要对同一接口提供不同版本的参数实现（老的接口还有模块或者系统在用，不能直接改，所以需要不同版本）。如何更加优雅的实现多版本接口呢？@pdai</p></blockquote><h2 id="为什么接口会出现多个版本" tabindex="-1">为什么接口会出现多个版本？ <a class="header-anchor" href="#为什么接口会出现多个版本" aria-label="Permalink to &quot;为什么接口会出现多个版本？&quot;">​</a></h2><blockquote><p>为什么接口会出现多个版本？</p></blockquote><p>一般来说，Restful API接口是提供给其它模块，系统或是其他公司使用，不能随意频繁的变更。然而，需求和业务不断变化，接口和参数也会发生相应的变化。如果直接对原来的接口进行修改，势必会影响线其他系统的正常运行。这就必须对api 接口进行有效的版本控制。</p><h3 id="有哪些控制接口多版本的方式" tabindex="-1">有哪些控制接口多版本的方式？ <a class="header-anchor" href="#有哪些控制接口多版本的方式" aria-label="Permalink to &quot;有哪些控制接口多版本的方式？&quot;">​</a></h3><ul><li><p>相同URL，用<strong>不同的版本参数</strong>区分</p><ul><li><code>api.pdai.tech/user?version=v1</code> 表示 v1版本的接口, 保持原有接口不动</li><li><code>api.pdai.tech/user?version=v2</code> 表示 v2版本的接口，更新新的接口</li></ul></li><li><p>区分<strong>不同的接口域名</strong>，不同的版本有不同的子域名, 路由到不同的实例:</p><ul><li><code>v1.api.pdai.tech/user</code> 表示 v1版本的接口, 保持原有接口不动, 路由到instance1</li><li><code>v2.api.pdai.tech/user</code> 表示 v2版本的接口，更新新的接口, 路由到instance2</li></ul></li><li><p>网关路由不同子目录到<strong>不同的实例</strong>（不同package也可以）</p><ul><li><code>api.pdai.tech/v1/user</code> 表示 v1版本的接口, 保持原有接口不动, 路由到instance1</li><li><code>api.pdai.tech/v2/user</code> 表示 v2版本的接口，更新新的接口, 路由到instance2</li></ul></li><li><p><strong>同一实例</strong>，用注解隔离不同版本控制</p><ul><li><code>api.pdai.tech/v1/user</code> 表示 v1版本的接口, 保持原有接口不动，匹配@ApiVersion(&quot;1&quot;)的handlerMapping</li><li><code>api.pdai.tech/v2/user</code> 表示 v2版本的接口，更新新的接口，匹配@ApiVersion(&quot;2&quot;)的handlerMapping</li></ul></li></ul><p>这里主要展示第四种单一实例中如何优雅的控制接口的版本。</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>这个例子基于SpringBoot封装了@ApiVersion注解方式控制接口版本。</p></blockquote><h3 id="自定义-apiversion注解" tabindex="-1">自定义@ApiVersion注解 <a class="header-anchor" href="#自定义-apiversion注解" aria-label="Permalink to &quot;自定义@ApiVersion注解&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.version.config.version;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.Mapping;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Target({ElementType.METHOD, ElementType.TYPE})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Mapping</span></span>
<span class="line"><span>public @interface ApiVersion {</span></span>
<span class="line"><span>    String value();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="定义版本匹配requestcondition" tabindex="-1">定义版本匹配RequestCondition <a class="header-anchor" href="#定义版本匹配requestcondition" aria-label="Permalink to &quot;定义版本匹配RequestCondition&quot;">​</a></h3><p>版本匹配支持三层版本</p><ul><li>v1.1.1 （大版本.小版本.补丁版本）</li><li>v1.1 (等同于v1.1.0)</li><li>v1 （等同于v1.0.0)</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.version.config.version;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.Getter;</span></span>
<span class="line"><span>import lombok.extern.slf4j.Slf4j;</span></span>
<span class="line"><span>import org.springframework.web.servlet.mvc.condition.RequestCondition;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.servlet.http.HttpServletRequest;</span></span>
<span class="line"><span>import java.util.Arrays;</span></span>
<span class="line"><span>import java.util.Collections;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span>import java.util.regex.Matcher;</span></span>
<span class="line"><span>import java.util.regex.Pattern;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class ApiVersionCondition implements RequestCondition&lt;ApiVersionCondition&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * support v1.1.1, v1.1, v1; three levels .</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final Pattern VERSION_PREFIX_PATTERN_1 = Pattern.compile(&quot;/v\\\\d\\\\.\\\\d\\\\.\\\\d/&quot;);</span></span>
<span class="line"><span>    private static final Pattern VERSION_PREFIX_PATTERN_2 = Pattern.compile(&quot;/v\\\\d\\\\.\\\\d/&quot;);</span></span>
<span class="line"><span>    private static final Pattern VERSION_PREFIX_PATTERN_3 = Pattern.compile(&quot;/v\\\\d/&quot;);</span></span>
<span class="line"><span>    private static final List&lt;Pattern&gt; VERSION_LIST = Collections.unmodifiableList(</span></span>
<span class="line"><span>            Arrays.asList(VERSION_PREFIX_PATTERN_1, VERSION_PREFIX_PATTERN_2, VERSION_PREFIX_PATTERN_3)</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Getter</span></span>
<span class="line"><span>    private final String apiVersion;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ApiVersionCondition(String apiVersion) {</span></span>
<span class="line"><span>        this.apiVersion = apiVersion;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * method priority is higher then class.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param other other</span></span>
<span class="line"><span>     * @return ApiVersionCondition</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public ApiVersionCondition combine(ApiVersionCondition other) {</span></span>
<span class="line"><span>        return new ApiVersionCondition(other.apiVersion);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public ApiVersionCondition getMatchingCondition(HttpServletRequest request) {</span></span>
<span class="line"><span>        for (int vIndex = 0; vIndex &lt; VERSION_LIST.size(); vIndex++) {</span></span>
<span class="line"><span>            Matcher m = VERSION_LIST.get(vIndex).matcher(request.getRequestURI());</span></span>
<span class="line"><span>            if (m.find()) {</span></span>
<span class="line"><span>                String version = m.group(0).replace(&quot;/v&quot;, &quot;&quot;).replace(&quot;/&quot;, &quot;&quot;);</span></span>
<span class="line"><span>                if (vIndex == 1) {</span></span>
<span class="line"><span>                    version = version + &quot;.0&quot;;</span></span>
<span class="line"><span>                } else if (vIndex == 2) {</span></span>
<span class="line"><span>                    version = version + &quot;.0.0&quot;;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (compareVersion(version, this.apiVersion) &gt;= 0) {</span></span>
<span class="line"><span>                    log.info(&quot;version={}, apiVersion={}&quot;, version, this.apiVersion);</span></span>
<span class="line"><span>                    return this;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int compareTo(ApiVersionCondition other, HttpServletRequest request) {</span></span>
<span class="line"><span>        return compareVersion(other.getApiVersion(), this.apiVersion);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int compareVersion(String version1, String version2) {</span></span>
<span class="line"><span>        if (version1 == null || version2 == null) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;compareVersion error:illegal params.&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        String[] versionArray1 = version1.split(&quot;\\\\.&quot;);</span></span>
<span class="line"><span>        String[] versionArray2 = version2.split(&quot;\\\\.&quot;);</span></span>
<span class="line"><span>        int idx = 0;</span></span>
<span class="line"><span>        int minLength = Math.min(versionArray1.length, versionArray2.length);</span></span>
<span class="line"><span>        int diff = 0;</span></span>
<span class="line"><span>        while (idx &lt; minLength</span></span>
<span class="line"><span>                &amp;&amp; (diff = versionArray1[idx].length() - versionArray2[idx].length()) == 0</span></span>
<span class="line"><span>                &amp;&amp; (diff = versionArray1[idx].compareTo(versionArray2[idx])) == 0) {</span></span>
<span class="line"><span>            ++idx;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        diff = (diff != 0) ? diff : versionArray1.length - versionArray2.length;</span></span>
<span class="line"><span>        return diff;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="定义handlermapping" tabindex="-1">定义HandlerMapping <a class="header-anchor" href="#定义handlermapping" aria-label="Permalink to &quot;定义HandlerMapping&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.version.config.version;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.core.annotation.AnnotationUtils;</span></span>
<span class="line"><span>import org.springframework.lang.NonNull;</span></span>
<span class="line"><span>import org.springframework.web.servlet.mvc.condition.RequestCondition;</span></span>
<span class="line"><span>import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ApiVersionRequestMappingHandlerMapping extends RequestMappingHandlerMapping {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * add @ApiVersion to controller class.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param handlerType handlerType</span></span>
<span class="line"><span>     * @return RequestCondition</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected RequestCondition&lt;?&gt; getCustomTypeCondition(@NonNull Class&lt;?&gt; handlerType) {</span></span>
<span class="line"><span>        ApiVersion apiVersion = AnnotationUtils.findAnnotation(handlerType, ApiVersion.class);</span></span>
<span class="line"><span>        return null == apiVersion ? super.getCustomTypeCondition(handlerType) : new ApiVersionCondition(apiVersion.value());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * add @ApiVersion to controller method.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param method method</span></span>
<span class="line"><span>     * @return RequestCondition</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected RequestCondition&lt;?&gt; getCustomMethodCondition(@NonNull Method method) {</span></span>
<span class="line"><span>        ApiVersion apiVersion = AnnotationUtils.findAnnotation(method, ApiVersion.class);</span></span>
<span class="line"><span>        return null == apiVersion ? super.getCustomMethodCondition(method) : new ApiVersionCondition(apiVersion.value());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="配置注册handlermapping" tabindex="-1">配置注册HandlerMapping <a class="header-anchor" href="#配置注册handlermapping" aria-label="Permalink to &quot;配置注册HandlerMapping&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.version.config.version;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span>import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;</span></span>
<span class="line"><span>import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class CustomWebMvcConfiguration extends WebMvcConfigurationSupport {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public RequestMappingHandlerMapping createRequestMappingHandlerMapping() {</span></span>
<span class="line"><span>        return new ApiVersionRequestMappingHandlerMapping();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>或者实现WebMvcRegistrations的接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>@RequiredArgsConstructor</span></span>
<span class="line"><span>public class WebConfig implements WebMvcConfigurer, WebMvcRegistrations {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    @NonNull</span></span>
<span class="line"><span>    public RequestMappingHandlerMapping getRequestMappingHandlerMapping() {</span></span>
<span class="line"><span>        return new ApiVersionRequestMappingHandlerMapping();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="测试运行" tabindex="-1">测试运行 <a class="header-anchor" href="#测试运行" aria-label="Permalink to &quot;测试运行&quot;">​</a></h3><p>controller</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.version.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.api.version.config.version.ApiVersion;</span></span>
<span class="line"><span>import tech.pdai.springboot.api.version.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;api/{v}/user&quot;)</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @RequestMapping(&quot;get&quot;)</span></span>
<span class="line"><span>    public User getUser() {</span></span>
<span class="line"><span>        return User.builder().age(18).name(&quot;pdai, default&quot;).build();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ApiVersion(&quot;1.0.0&quot;)</span></span>
<span class="line"><span>    @RequestMapping(&quot;get&quot;)</span></span>
<span class="line"><span>    public User getUserV1() {</span></span>
<span class="line"><span>        return User.builder().age(18).name(&quot;pdai, v1.0.0&quot;).build();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ApiVersion(&quot;1.1.0&quot;)</span></span>
<span class="line"><span>    @RequestMapping(&quot;get&quot;)</span></span>
<span class="line"><span>    public User getUserV11() {</span></span>
<span class="line"><span>        return User.builder().age(19).name(&quot;pdai, v1.1.0&quot;).build();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ApiVersion(&quot;1.1.2&quot;)</span></span>
<span class="line"><span>    @RequestMapping(&quot;get&quot;)</span></span>
<span class="line"><span>    public User getUserV112() {</span></span>
<span class="line"><span>        return User.builder().age(19).name(&quot;pdai2, v1.1.2&quot;).build();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8080/api/v1/user/get</span></span>
<span class="line"><span>// {&quot;name&quot;:&quot;pdai, v1.0.0&quot;,&quot;age&quot;:18}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>http://localhost:8080/api/v1.1/user/get</span></span>
<span class="line"><span>// {&quot;name&quot;:&quot;pdai, v1.1.0&quot;,&quot;age&quot;:19}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>http://localhost:8080/api/v1.1.1/user/get</span></span>
<span class="line"><span>// {&quot;name&quot;:&quot;pdai, v1.1.0&quot;,&quot;age&quot;:19} 匹配比1.1.1小的中最大的一个版本号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>http://localhost:8080/api/v1.1.2/user/get</span></span>
<span class="line"><span>// {&quot;name&quot;:&quot;pdai2, v1.1.2&quot;,&quot;age&quot;:19}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>http://localhost:8080/api/v1.2/user/get</span></span>
<span class="line"><span>// {&quot;name&quot;:&quot;pdai2, v1.1.2&quot;,&quot;age&quot;:19} 匹配最大的版本号，v1.1.2</span></span></code></pre></div><p>这样，如果我们向另外一个模块提供v1版本的接口，新的需求中只变动了一个接口方法，这时候我们只需要增加一个接口添加版本号v1.1即可用v1.1版本访问所有接口。</p><blockquote><p>此外，这种方式可能会导致v3版本接口没有发布，但是是可以通过v3访问接口的；这种情况下可以添加一些限制版本的逻辑，比如最大版本，版本集合等。</p></blockquote><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,32)]))}const h=s(i,[["render",l]]);export{g as __pageData,h as default};
