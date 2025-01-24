import{_ as a,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"SpringBoot接口 - 如何实现接口限流之分布式","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-xianliu-dist.md","filePath":"spring/springboot/springboot-x-interface-xianliu-dist.md","lastUpdated":1737706346000}'),i={name:"spring/springboot/springboot-x-interface-xianliu-dist.md"};function t(l,s,r,o,c,d){return e(),n("div",null,s[0]||(s[0]=[p(`<h1 id="springboot接口-如何实现接口限流之分布式" tabindex="-1">SpringBoot接口 - 如何实现接口限流之分布式 <a class="header-anchor" href="#springboot接口-如何实现接口限流之分布式" aria-label="Permalink to &quot;SpringBoot接口 - 如何实现接口限流之分布式&quot;">​</a></h1><blockquote><p>上文中介绍了单实例下如何在业务接口层做限流，本文主要介绍分布式场景下限流的方案，以及什么样的分布式场景下需要在业务层加限流而不是接入层; 并且结合<a href="https://gitee.com/kailing/ratelimiter-spring-boot-starter" target="_blank" rel="noreferrer">开源的ratelimiter-spring-boot-starter在新窗口打开</a>为例，作者是kailing， 学习<strong>思路+代码封装+starter封装</strong>。 @pdai</p></blockquote><h2 id="准备知识点" tabindex="-1">准备知识点 <a class="header-anchor" href="#准备知识点" aria-label="Permalink to &quot;准备知识点&quot;">​</a></h2><blockquote><p>上文我们提到了分布式限流的思路：</p></blockquote><p>我们需要<strong>分布式限流</strong>和<strong>接入层限流</strong>来进行全局限流。</p><ol><li>redis+lua实现中的lua脚本</li><li>使用Nginx+Lua实现的Lua脚本</li><li>使用 OpenResty 开源的限流方案</li><li>限流框架，比如Sentinel实现降级限流熔断</li></ol><h2 id="实现思路之redis-lua封装" tabindex="-1">实现思路之redis+lua封装 <a class="header-anchor" href="#实现思路之redis-lua封装" aria-label="Permalink to &quot;实现思路之redis+lua封装&quot;">​</a></h2><blockquote><p>redis+lua是代码层实现较为常见的方案，网上有很多的封装， 我这里找一个给你分享下。以<a href="https://gitee.com/kailing/ratelimiter-spring-boot-starter" target="_blank" rel="noreferrer">gitee开源的ratelimiter-spring-boot-starter在新窗口打开</a>为例，作者是kailing， 值得初学者学习<strong>思路+代码封装+starter封装</strong>：</p></blockquote><h3 id="使用场景-为什么有些分布式场景下-还会在代码层进行控制限流" tabindex="-1">使用场景：为什么有些分布式场景下，还会在代码层进行控制限流？ <a class="header-anchor" href="#使用场景-为什么有些分布式场景下-还会在代码层进行控制限流" aria-label="Permalink to &quot;使用场景：为什么有些分布式场景下，还会在代码层进行控制限流？&quot;">​</a></h3><p>基于 redis 的偏业务应用的分布式限流组件，使得项目拥有分布式限流能力变得很简单。限流的场景有很多，常说的限流一般指网关限流，控制好洪峰流量，以免打垮后方应用。这里突出<code>偏业务应用的分布式限流</code>的原因，是因为区别于网关限流，业务侧限流可以轻松根据业务性质做到细粒度的流量控制。比如如下场景，</p><ul><li>案例一：</li></ul><p>有一个公开的 openApi 接口， openApi 会给接入方派发一个 appId，此时，如果需要根据各个接入方的 appId 限流，网关限流就不好做了，只能在业务侧实现</p><ul><li>案例二：</li></ul><p>公司内部的短信接口，内部对接了多个第三方的短信通道，每个短信通道对流量的控制都不尽相同，假设有的第三方根据手机号和短信模板组合限流，网关限流就更不好做了</p><p>让我们看下，作者kailing是如何封装实现ratelimiter-spring-boot-starter的。</p><h3 id="源代码的要点" tabindex="-1">源代码的要点 <a class="header-anchor" href="#源代码的要点" aria-label="Permalink to &quot;源代码的要点&quot;">​</a></h3><ul><li><strong>Redis 客户端采用redisson，AOP拦截方式</strong></li></ul><p>所以引入如下包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ext {</span></span>
<span class="line"><span>    redisson_Version = &#39;3.15.1&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>dependencies {</span></span>
<span class="line"><span>    compile &quot;org.redisson:redisson:\${redisson_Version}&quot;</span></span>
<span class="line"><span>    compile &#39;org.springframework.boot:spring-boot-starter-aop&#39;</span></span>
<span class="line"><span>    compileOnly &#39;org.springframework.boot:spring-boot-starter-web&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    annotationProcessor &#39;org.springframework.boot:spring-boot-configuration-processor&#39;</span></span>
<span class="line"><span>    testImplementation &#39;org.springframework.boot:spring-boot-starter-test&#39;</span></span>
<span class="line"><span>    testImplementation &#39;org.springframework.boot:spring-boot-starter-web&#39;</span></span>
<span class="line"><span>    testImplementation &#39;org.springdoc:springdoc-openapi-ui:1.5.2&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>RateLimit注解</strong></li></ul><p>作者考虑了时间表达式，限流后的自定义回退后的拒绝逻辑, 用户自定义Key（PS：<strong>这里其实可以加一些默认的Key生成策略</strong>，比如<strong>按照方法</strong>策略， <strong>按照方法&amp;IP</strong> 策略, <strong>按照自定义策略</strong>等，默认为按照方法）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.taptap.ratelimiter.annotation;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.ElementType;</span></span>
<span class="line"><span>import java.lang.annotation.Retention;</span></span>
<span class="line"><span>import java.lang.annotation.RetentionPolicy;</span></span>
<span class="line"><span>import java.lang.annotation.Target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author kl (http://kailing.pub)</span></span>
<span class="line"><span> * @since 2021/3/16</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Target(value = {ElementType.METHOD})</span></span>
<span class="line"><span>@Retention(value = RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public @interface RateLimit {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 时间窗口流量数量</span></span>
<span class="line"><span>     * @return rate</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    long rate();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 时间窗口流量数量表达式</span></span>
<span class="line"><span>     * @return rateExpression</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    String rateExpression() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 时间窗口，最小单位秒，如 2s，2h , 2d</span></span>
<span class="line"><span>     * @return rateInterval</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    String rateInterval();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 获取key</span></span>
<span class="line"><span>     * @return keys</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    String [] keys() default {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 限流后的自定义回退后的拒绝逻辑</span></span>
<span class="line"><span>     * @return fallback</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    String fallbackFunction() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 自定义业务 key 的 Function</span></span>
<span class="line"><span>     * @return key</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    String customKeyFunction() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>AOP拦截</strong></li></ul><p>around环绕方式， 通过定义RateLimiterService获取方法注解的信息，存放在为RateLimiterInfo</p><p>如果还定义了回调方法，被限流后还会执行回调方法，回调方法也在RateLimiterService中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.taptap.ratelimiter.core;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.taptap.ratelimiter.annotation.RateLimit;</span></span>
<span class="line"><span>import com.taptap.ratelimiter.exception.RateLimitException;</span></span>
<span class="line"><span>import com.taptap.ratelimiter.model.LuaScript;</span></span>
<span class="line"><span>import com.taptap.ratelimiter.model.RateLimiterInfo;</span></span>
<span class="line"><span>import org.aspectj.lang.ProceedingJoinPoint;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Around;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Aspect;</span></span>
<span class="line"><span>import org.redisson.api.RScript;</span></span>
<span class="line"><span>import org.redisson.api.RedissonClient;</span></span>
<span class="line"><span>import org.slf4j.Logger;</span></span>
<span class="line"><span>import org.slf4j.LoggerFactory;</span></span>
<span class="line"><span>import org.springframework.core.annotation.Order;</span></span>
<span class="line"><span>import org.springframework.stereotype.Component;</span></span>
<span class="line"><span>import org.springframework.util.StringUtils;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Created by kl on 2017/12/29.</span></span>
<span class="line"><span> * Content : 切面拦截处理器</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Aspect</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>@Order(0)</span></span>
<span class="line"><span>public class RateLimitAspectHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final Logger logger = LoggerFactory.getLogger(RateLimitAspectHandler.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final RateLimiterService rateLimiterService;</span></span>
<span class="line"><span>    private final RScript rScript;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RateLimitAspectHandler(RedissonClient client, RateLimiterService lockInfoProvider) {</span></span>
<span class="line"><span>        this.rateLimiterService = lockInfoProvider;</span></span>
<span class="line"><span>        this.rScript = client.getScript();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Around(value = &quot;@annotation(rateLimit)&quot;)</span></span>
<span class="line"><span>    public Object around(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {</span></span>
<span class="line"><span>        RateLimiterInfo limiterInfo = rateLimiterService.getRateLimiterInfo(joinPoint, rateLimit);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;Object&gt; keys = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        keys.add(limiterInfo.getKey());</span></span>
<span class="line"><span>        keys.add(limiterInfo.getRate());</span></span>
<span class="line"><span>        keys.add(limiterInfo.getRateInterval());</span></span>
<span class="line"><span>        List&lt;Long&gt; results = rScript.eval(RScript.Mode.READ_WRITE, LuaScript.getRateLimiterScript(), RScript.ReturnType.MULTI, keys);</span></span>
<span class="line"><span>        boolean allowed = results.get(0) == 0L;</span></span>
<span class="line"><span>        if (!allowed) {</span></span>
<span class="line"><span>            logger.info(&quot;Trigger current limiting,key:{}&quot;, limiterInfo.getKey());</span></span>
<span class="line"><span>            if (StringUtils.hasLength(rateLimit.fallbackFunction())) {</span></span>
<span class="line"><span>                return rateLimiterService.executeFunction(rateLimit.fallbackFunction(), joinPoint);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            long ttl = results.get(1);</span></span>
<span class="line"><span>            throw new RateLimitException(&quot;Too Many Requests&quot;, ttl);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return joinPoint.proceed();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里LuaScript加载定义的lua脚本</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.taptap.ratelimiter.model;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.slf4j.Logger;</span></span>
<span class="line"><span>import org.slf4j.LoggerFactory;</span></span>
<span class="line"><span>import org.springframework.util.StreamUtils;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.io.InputStream;</span></span>
<span class="line"><span>import java.nio.charset.StandardCharsets;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author kl (http://kailing.pub)</span></span>
<span class="line"><span> * @since 2021/3/18</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public final class LuaScript {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private LuaScript(){}</span></span>
<span class="line"><span>    private static final Logger log = LoggerFactory.getLogger(LuaScript.class);</span></span>
<span class="line"><span>    private static final String RATE_LIMITER_FILE_PATH = &quot;META-INF/ratelimiter-spring-boot-starter-rateLimit.lua&quot;;</span></span>
<span class="line"><span>    private static String rateLimiterScript;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        InputStream in = Thread.currentThread().getContextClassLoader()</span></span>
<span class="line"><span>                .getResourceAsStream(RATE_LIMITER_FILE_PATH);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            rateLimiterScript =  StreamUtils.copyToString(in, StandardCharsets.UTF_8);</span></span>
<span class="line"><span>        } catch (IOException e) {</span></span>
<span class="line"><span>            log.error(&quot;ratelimiter-spring-boot-starter Initialization failure&quot;,e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static String getRateLimiterScript() {</span></span>
<span class="line"><span>        return rateLimiterScript;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>lua脚本放在META-INF/ratelimiter-spring-boot-starter-rateLimit.lua， 如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--</span></span>
<span class="line"><span>-- Created by IntelliJ IDEA.</span></span>
<span class="line"><span>-- User: kl</span></span>
<span class="line"><span>-- Date: 2021/3/18</span></span>
<span class="line"><span>-- Time: 11:17 上午</span></span>
<span class="line"><span>-- To change this template use File | Settings | File Templates.</span></span>
<span class="line"><span>local rateLimitKey = KEYS[1];</span></span>
<span class="line"><span>local rate = tonumber(KEYS[2]);</span></span>
<span class="line"><span>local rateInterval = tonumber(KEYS[3]);</span></span>
<span class="line"><span>local limitResult = 0;</span></span>
<span class="line"><span>local ttlResult = 0;</span></span>
<span class="line"><span>local currValue = redis.call(&#39;incr&#39;, rateLimitKey);</span></span>
<span class="line"><span>if (currValue == 1) then</span></span>
<span class="line"><span>    redis.call(&#39;expire&#39;, rateLimitKey, rateInterval);</span></span>
<span class="line"><span>    limitResult = 0;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    if (currValue &gt; rate) then</span></span>
<span class="line"><span>        limitResult = 1;</span></span>
<span class="line"><span>        ttlResult = redis.call(&#39;ttl&#39;, rateLimitKey);</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span>return { limitResult, ttlResult }</span></span></code></pre></div><ul><li><strong>starter自动装配</strong></li></ul><p>RateLimiterAutoConfiguration + RateLimiterProperties + spring.factories</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.taptap.ratelimiter.configuration;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.taptap.ratelimiter.core.BizKeyProvider;</span></span>
<span class="line"><span>import com.taptap.ratelimiter.core.RateLimitAspectHandler;</span></span>
<span class="line"><span>import com.taptap.ratelimiter.core.RateLimiterService;</span></span>
<span class="line"><span>import com.taptap.ratelimiter.web.RateLimitExceptionHandler;</span></span>
<span class="line"><span>import io.netty.channel.nio.NioEventLoopGroup;</span></span>
<span class="line"><span>import org.redisson.Redisson;</span></span>
<span class="line"><span>import org.redisson.api.RedissonClient;</span></span>
<span class="line"><span>import org.redisson.codec.JsonJacksonCodec;</span></span>
<span class="line"><span>import org.redisson.config.Config;</span></span>
<span class="line"><span>import org.springframework.boot.autoconfigure.AutoConfigureAfter;</span></span>
<span class="line"><span>import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;</span></span>
<span class="line"><span>import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;</span></span>
<span class="line"><span>import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;</span></span>
<span class="line"><span>import org.springframework.boot.context.properties.EnableConfigurationProperties;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Bean;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Import;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author kl (http://kailing.pub)</span></span>
<span class="line"><span> * @since 2021/3/16</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>@ConditionalOnProperty(prefix = RateLimiterProperties.PREFIX, name = &quot;enabled&quot;, havingValue = &quot;true&quot;)</span></span>
<span class="line"><span>@AutoConfigureAfter(RedisAutoConfiguration.class)</span></span>
<span class="line"><span>@EnableConfigurationProperties(RateLimiterProperties.class)</span></span>
<span class="line"><span>@Import({RateLimitAspectHandler.class, RateLimitExceptionHandler.class})</span></span>
<span class="line"><span>public class RateLimiterAutoConfiguration {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final RateLimiterProperties limiterProperties;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RateLimiterAutoConfiguration(RateLimiterProperties limiterProperties) {</span></span>
<span class="line"><span>        this.limiterProperties = limiterProperties;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean(destroyMethod = &quot;shutdown&quot;)</span></span>
<span class="line"><span>    @ConditionalOnMissingBean</span></span>
<span class="line"><span>    RedissonClient redisson() {</span></span>
<span class="line"><span>        Config config = new Config();</span></span>
<span class="line"><span>        if (limiterProperties.getRedisClusterServer() != null) {</span></span>
<span class="line"><span>            config.useClusterServers().setPassword(limiterProperties.getRedisPassword())</span></span>
<span class="line"><span>                    .addNodeAddress(limiterProperties.getRedisClusterServer().getNodeAddresses());</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            config.useSingleServer().setAddress(limiterProperties.getRedisAddress())</span></span>
<span class="line"><span>                    .setDatabase(limiterProperties.getRedisDatabase())</span></span>
<span class="line"><span>                    .setPassword(limiterProperties.getRedisPassword());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        config.setCodec(new JsonJacksonCodec());</span></span>
<span class="line"><span>        config.setEventLoopGroup(new NioEventLoopGroup());</span></span>
<span class="line"><span>        return Redisson.create(config);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public RateLimiterService rateLimiterInfoProvider() {</span></span>
<span class="line"><span>        return new RateLimiterService();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public BizKeyProvider bizKeyProvider() {</span></span>
<span class="line"><span>        return new BizKeyProvider();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_1、快速开始" tabindex="-1">1、快速开始 <a class="header-anchor" href="#_1、快速开始" aria-label="Permalink to &quot;1、快速开始&quot;">​</a></h3><blockquote><p>来看下作者kailing是如何提供的ratelimiter-spring-boot-starter使用文档。</p></blockquote><h4 id="_1-1、添加组件依赖-已上传到maven中央仓库" tabindex="-1">1.1、添加组件依赖，已上传到maven中央仓库 <a class="header-anchor" href="#_1-1、添加组件依赖-已上传到maven中央仓库" aria-label="Permalink to &quot;1.1、添加组件依赖，已上传到maven中央仓库&quot;">​</a></h4><p>maven</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.github.taptap&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;ratelimiter-spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.2&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>gradle</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>implementation &#39;com.github.taptap:ratelimiter-spring-boot-starter:1.2&#39;</span></span></code></pre></div><h4 id="_1-2、application-properties-配置" tabindex="-1">1.2、application.properties 配置 <a class="header-anchor" href="#_1-2、application-properties-配置" aria-label="Permalink to &quot;1.2、application.properties 配置&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.ratelimiter.enabled = true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>spring.ratelimiter.redis-address = redis://127.0.0.1:6379</span></span>
<span class="line"><span>spring.ratelimiter.redis-password = xxx</span></span></code></pre></div><p>启用 ratelimiter 的配置必须加，默认不会加载。redis 相关的连接是非必须的，如果你的项目里已经使用了 <code>Redisson</code> ，则不用配置限流框架的 redis 连接</p><h4 id="_1-3、在需要加限流逻辑的方法上-添加注解-ratelimit-如" tabindex="-1">1.3、在需要加限流逻辑的方法上，添加注解 @RateLimit，如： <a class="header-anchor" href="#_1-3、在需要加限流逻辑的方法上-添加注解-ratelimit-如" aria-label="Permalink to &quot;1.3、在需要加限流逻辑的方法上，添加注解 @RateLimit，如：&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/test&quot;)</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @GetMapping(&quot;/get&quot;)</span></span>
<span class="line"><span>    @RateLimit(rate = 5, rateInterval = &quot;10s&quot;)</span></span>
<span class="line"><span>    public String get(String name) {</span></span>
<span class="line"><span>        return &quot;hello&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="_1-3-1-ratelimit-注解说明" tabindex="-1">1.3.1 @RateLimit 注解说明 <a class="header-anchor" href="#_1-3-1-ratelimit-注解说明" aria-label="Permalink to &quot;1.3.1 @RateLimit 注解说明&quot;">​</a></h5><p>@RateLimit 注解可以添加到任意被 spring 管理的 bean 上，不局限于 controller ,service 、repository 也可以。在最基础限流功能使用上，以上三个步骤就已经完成了。@RateLimit 有两个最基础的参数，rateInterval 设置了时间窗口，rate 设置了时间窗口内允许通过的请求数量</p><h5 id="_1-3-2-限流的粒度-限流-key" tabindex="-1">1.3.2 限流的粒度，限流 key <a class="header-anchor" href="#_1-3-2-限流的粒度-限流-key" aria-label="Permalink to &quot;1.3.2 限流的粒度，限流 key&quot;">​</a></h5><p>。限流的粒度是通过限流的 key 来做的，在最基础的设置下，限流的 key 默认是通过方法名称拼出来的，规则如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>key = RateLimiter_ + 类名 + 方法名</span></span></code></pre></div><p>除了默认的 key 策略，ratelimiter-spring-boot-starter 充分考虑了业务限流时的复杂性，提供了多种方式。结合业务特征，达到更细粒度的限流控制。</p><h5 id="_1-3-3-触发限流后的行为" tabindex="-1">1.3.3 触发限流后的行为 <a class="header-anchor" href="#_1-3-3-触发限流后的行为" aria-label="Permalink to &quot;1.3.3 触发限流后的行为&quot;">​</a></h5><p>默认触发限流后 程序会返回一个 http 状态码为 429 的响应，响应值如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;code&quot;:429,</span></span>
<span class="line"><span>  &quot;msg&quot;:&quot;Too Many Requests&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同时，响应的 header 里会携带一个 Retry-After 的时间值，单位 s，用来告诉调用方多久后可以重试。当然这一切都是可以自定义的，进阶用法可以继续往下看</p><h3 id="_2、进阶用法" tabindex="-1">2、进阶用法 <a class="header-anchor" href="#_2、进阶用法" aria-label="Permalink to &quot;2、进阶用法&quot;">​</a></h3><h4 id="_2-1、自定义限流的-key" tabindex="-1">2.1、自定义限流的 key <a class="header-anchor" href="#_2-1、自定义限流的-key" aria-label="Permalink to &quot;2.1、自定义限流的 key&quot;">​</a></h4><p>自定义限流 key 有三种方式，当自定义限流的 key 生效时，限流的 key 就变成了（默认的 key + 自定义的 key）。下面依次给出示例</p><h5 id="_2-1-1、-ratelimitkey-的方式" tabindex="-1">2.1.1、@RateLimitKey 的方式 <a class="header-anchor" href="#_2-1-1、-ratelimitkey-的方式" aria-label="Permalink to &quot;2.1.1、@RateLimitKey 的方式&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/test&quot;)</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @GetMapping(&quot;/get&quot;)</span></span>
<span class="line"><span>    @RateLimit(rate = 5, rateInterval = &quot;10s&quot;)</span></span>
<span class="line"><span>    public String get(@RateLimitKey String name) {</span></span>
<span class="line"><span>        return &quot;get&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>@RateLimitKey 注解可以放在方法的入参上，要求入参是基础数据类型，上面的例子，如果 name = kl。那么最终限流的 key 如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>key = RateLimiter_com.taptap.ratelimiter.web.TestController.get-kl</span></span></code></pre></div><h5 id="_2-1-2、指定-keys-的方式" tabindex="-1">2.1.2、指定 keys 的方式 <a class="header-anchor" href="#_2-1-2、指定-keys-的方式" aria-label="Permalink to &quot;2.1.2、指定 keys 的方式&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/test&quot;)</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @GetMapping(&quot;/get&quot;)</span></span>
<span class="line"><span>    @RateLimit(rate = 5, rateInterval = &quot;10s&quot;,keys = {&quot;#name&quot;})</span></span>
<span class="line"><span>    public String get(String name) {</span></span>
<span class="line"><span>        return &quot;get&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @GetMapping(&quot;/hello&quot;)</span></span>
<span class="line"><span>    @RateLimit(rate = 5, rateInterval = &quot;10s&quot;,keys = {&quot;#user.name&quot;,&quot;user.id&quot;})</span></span>
<span class="line"><span>    public String hello(User user) {</span></span>
<span class="line"><span>        return &quot;hello&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>keys 这个参数比 @RateLimitKey 注解更智能，基本可以包含 @RateLimitKey 的能力，只是简单场景下，使用起来没有 @RateLimitKey 那么便捷。keys 的语法来自 spring 的 <code>Spel</code>，可以获取对象入参里的属性，支持获取多个，最后会拼接起来。使用过 spring-cache 的同学可能会更加熟悉 如果不清楚 <code>Spel</code> 的用法，可以参考 spring-cache 的注解文档</p><h5 id="_2-1-3、自定义-key-获取函数" tabindex="-1">2.1.3、自定义 key 获取函数 <a class="header-anchor" href="#_2-1-3、自定义-key-获取函数" aria-label="Permalink to &quot;2.1.3、自定义 key 获取函数&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/test&quot;)</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @GetMapping(&quot;/get&quot;)</span></span>
<span class="line"><span>    @RateLimit(rate = 5, rateInterval = &quot;10s&quot;,customKeyFunction = &quot;keyFunction&quot;)</span></span>
<span class="line"><span>    public String get(String name) {</span></span>
<span class="line"><span>        return &quot;get&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String keyFunction(String name) {</span></span>
<span class="line"><span>        return &quot;keyFunction&quot; + name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当 @RateLimitKey 和 keys 参数都没法满足时，比如入参的值是一个加密的值，需要解密后根据相关明文内容限流。可以通过在同一类里自定义获取 key 的函数，这个函数要求和被限流的方法入参一致，返回值为 String 类型。返回值不能为空，为空时，会回退到默认的 key 获取策略。</p><h4 id="_2-2、自定义限流后的行为" tabindex="-1">2.2、自定义限流后的行为 <a class="header-anchor" href="#_2-2、自定义限流后的行为" aria-label="Permalink to &quot;2.2、自定义限流后的行为&quot;">​</a></h4><h5 id="_2-2-1、配置响应内容" tabindex="-1">2.2.1、配置响应内容 <a class="header-anchor" href="#_2-2-1、配置响应内容" aria-label="Permalink to &quot;2.2.1、配置响应内容&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.ratelimiter.enabled=true</span></span>
<span class="line"><span>spring.ratelimiter.response-body=Too Many Requests</span></span>
<span class="line"><span>spring.ratelimiter.status-code=509</span></span></code></pre></div><p>添加如上配置后，触发限流时，http 的状态码就变成了 509 。响应的内容变成了 Too Many Requests 了</p><h5 id="_2-2-2、自定义限流触发异常处理器" tabindex="-1">2.2.2、自定义限流触发异常处理器 <a class="header-anchor" href="#_2-2-2、自定义限流触发异常处理器" aria-label="Permalink to &quot;2.2.2、自定义限流触发异常处理器&quot;">​</a></h5><p>默认的触发限流后，限流器会抛出一个异常，限流器框架内定义了一个异常处理器来处理。自定义限流触发处理器，需要先禁用系统默认的限流触发处理器，禁用方式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.ratelimiter.exceptionHandler.enable=false</span></span></code></pre></div><p>然后在项目里添加自定义处理器，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ControllerAdvice</span></span>
<span class="line"><span>public class RateLimitExceptionHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final  RateLimiterProperties limiterProperties;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RateLimitExceptionHandler(RateLimiterProperties limiterProperties) {</span></span>
<span class="line"><span>        this.limiterProperties = limiterProperties;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ExceptionHandler(value = RateLimitException.class)</span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    public String exceptionHandler(HttpServletResponse response, RateLimitException e){</span></span>
<span class="line"><span>        response.setStatus(limiterProperties.getStatusCode());</span></span>
<span class="line"><span>        response.setHeader(&quot;Retry-After&quot;, String.valueOf(e.getRetryAfter()));</span></span>
<span class="line"><span>        return limiterProperties.getResponseBody();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h5 id="_2-2-3、自定义触发限流处理函数-限流降级" tabindex="-1">2.2.3、自定义触发限流处理函数，限流降级 <a class="header-anchor" href="#_2-2-3、自定义触发限流处理函数-限流降级" aria-label="Permalink to &quot;2.2.3、自定义触发限流处理函数，限流降级&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RequestMapping(&quot;/test&quot;)</span></span>
<span class="line"><span>public class TestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @GetMapping(&quot;/get&quot;)</span></span>
<span class="line"><span>    @RateLimit(rate = 5, rateInterval = &quot;10s&quot;,fallbackFunction = &quot;getFallback&quot;)</span></span>
<span class="line"><span>    public String get(String name) {</span></span>
<span class="line"><span>        return &quot;get&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getFallback(String name){</span></span>
<span class="line"><span>        return &quot;Too Many Requests&quot; + name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这种方式实现和使用和 2.1.3、自定义 key 获取函数类似。但是多一个要求，返回值的类型需要和原限流函数的返回值类型一致，当触发限流时，框架会调用 fallbackFunction 配置的函数执行并返回，达到限流降级的效果</p><h4 id="_2-3-动态设置限流大小" tabindex="-1">2.3 动态设置限流大小 <a class="header-anchor" href="#_2-3-动态设置限流大小" aria-label="Permalink to &quot;2.3 动态设置限流大小&quot;">​</a></h4><h5 id="_2-3-1、rateexpression-的使用" tabindex="-1">2.3.1、rateExpression 的使用 <a class="header-anchor" href="#_2-3-1、rateexpression-的使用" aria-label="Permalink to &quot;2.3.1、rateExpression 的使用&quot;">​</a></h5><p>从 <code>v1.2</code> 版本开始，在 <code>@RateLimit</code> 注解里新增了属性 rateExpression。该属性支持 <code>Spel</code> 表达式从 Spring 的配置上下文中获取值。 当配置了 rateExpression 后，rate 属性的配置就不生效了。使用方式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    @GetMapping(&quot;/get2&quot;)</span></span>
<span class="line"><span>    @RateLimit(rate = 2, rateInterval = &quot;10s&quot;,rateExpression = &quot;\${spring.ratelimiter.max}&quot;)</span></span>
<span class="line"><span>    public String get2() {</span></span>
<span class="line"><span>        return &quot;get&quot;;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>集成 apollo 等配置中心后，可以做到限流大小的动态调整在线热更。</p><h3 id="_3、集成示例、测验" tabindex="-1">3、集成示例、测验 <a class="header-anchor" href="#_3、集成示例、测验" aria-label="Permalink to &quot;3、集成示例、测验&quot;">​</a></h3><h4 id="_3-1、集成测验" tabindex="-1">3.1、集成测验 <a class="header-anchor" href="#_3-1、集成测验" aria-label="Permalink to &quot;3.1、集成测验&quot;">​</a></h4><p>启动 src/test/java/com/taptap/ratelimiter/Application.java 后，访问 <code>http://localhost:8080/swagger-ui.html</code></p><h4 id="_3-2、压力测试" tabindex="-1">3.2、压力测试 <a class="header-anchor" href="#_3-2、压力测试" aria-label="Permalink to &quot;3.2、压力测试&quot;">​</a></h4><ul><li>压测工具 wrk： <a href="https://github.com/wg/wrk" target="_blank" rel="noreferrer">https://github.com/wg/wrk</a></li><li>测试环境: 8 核心 cpu ，jvm 内存给的 -Xms2048m -Xmx2048m ，链接的本地的 redis</li></ul><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#压测数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kldeMacBook-Pro-6:ratelimiter-spring-boot-starter</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> kl</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">wrk</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t16</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -c100</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d15s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --latency</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> http://localhost:8080/test/wrk</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Running</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 15s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> http://localhost:8080/test/wrk</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  16</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> threads</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> and</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> connections</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  Thread</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Stats</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   Avg</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">      Stdev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     Max</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   +/-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Stdev</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Latency</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     6.18ms</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   20.70ms</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 281.21ms</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   98.17%</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Req/Sec</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     1.65k</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   307.06</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     2.30k</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    76.44%</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  Latency</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Distribution</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     50%</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    3.57ms</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     75%</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    4.11ms</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     90%</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    5.01ms</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     99%</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  115.48ms</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  389399</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> requests</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 15.03s,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 43.15MB</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> read</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Requests/sec:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  25915.91</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Transfer/sec:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">      2.87MB</span></span></code></pre></div><p>压测下，所有流量都过限流器，qps 可以达到 2w+。</p><h3 id="_4、版本更新" tabindex="-1">4、版本更新 <a class="header-anchor" href="#_4、版本更新" aria-label="Permalink to &quot;4、版本更新&quot;">​</a></h3><h4 id="_4-1、-v1-1-1-版本更新内容" tabindex="-1">4.1、（v1.1.1）版本更新内容 <a class="header-anchor" href="#_4-1、-v1-1-1-版本更新内容" aria-label="Permalink to &quot;4.1、（v1.1.1）版本更新内容&quot;">​</a></h4><ul><li>1、触发限流时，header 的 Retry-After 值，单位由 ms ，调整成了 s</li></ul><h4 id="_4-2、-v1-2-版本更新内容" tabindex="-1">4.2、（v1.2）版本更新内容 <a class="header-anchor" href="#_4-2、-v1-2-版本更新内容" aria-label="Permalink to &quot;4.2、（v1.2）版本更新内容&quot;">​</a></h4><ul><li>1、触发限流时，响应的类型从 <code>text/plain</code> 变成了 <code>application/json</code></li><li>2、优化了限流的 lua 脚本，将原来的两步 lua 脚本请求，合并成了一个，减少了和 redis 的交互</li><li>3、限流的时间窗口大小，支持 <code>Spel</code> 从 Spring 的配置上下文中获取，结合 <code>apollo</code> 等配置中心后，支持规则的动态下发热更新</li></ul><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://gitee.com/kailing/ratelimiter-spring-boot-starter" target="_blank" rel="noreferrer">https://gitee.com/kailing/ratelimiter-spring-boot-starter</a></p><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,101)]))}const u=a(i,[["render",t]]);export{g as __pageData,u as default};
