import{_ as s}from"./chunks/ssl-offloading.Ur2W8WGR.js";import{_ as a,c as p,ai as e,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springboot/springboot-api-sign-1.png",l="/vitepress-blog-template/images/spring/springboot/springboot-sign-2.png",r="/vitepress-blog-template/images/spring/springboot/springboot-sign-3.png",o="/vitepress-blog-template/images/spring/springboot/springboot-sign-4.png",c="/vitepress-blog-template/images/spring/springboot/springboot-sign-1.png",S=JSON.parse('{"title":"SpringBoot接口 - 如何对接口进行签名","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-jiami.md","filePath":"spring/springboot/springboot-x-interface-jiami.md","lastUpdated":1737706346000}'),g={name:"spring/springboot/springboot-x-interface-jiami.md"};function u(h,n,d,m,b,q){return t(),p("div",null,n[0]||(n[0]=[e('<h1 id="springboot接口-如何对接口进行签名" tabindex="-1">SpringBoot接口 - 如何对接口进行签名 <a class="header-anchor" href="#springboot接口-如何对接口进行签名" aria-label="Permalink to &quot;SpringBoot接口 - 如何对接口进行签名&quot;">​</a></h1><blockquote><p>在以SpringBoot开发后台API接口时，会存在哪些接口不安全的因素呢？通常如何去解决的呢？本文主要介绍API<strong>接口有不安全的因素</strong>以及<strong>常见的保证接口安全的方式</strong>，重点<strong>实践如何对接口进行签名</strong>。@pdai</p></blockquote><h2 id="准备知识点" tabindex="-1">准备知识点 <a class="header-anchor" href="#准备知识点" aria-label="Permalink to &quot;准备知识点&quot;">​</a></h2><blockquote><p>建议从接口整体的安全体系角度来理解，比如存在哪些不安全的因素，加密解密等知识点。</p></blockquote><h3 id="api接口有哪些不安全的因素" tabindex="-1">API接口有哪些不安全的因素？ <a class="header-anchor" href="#api接口有哪些不安全的因素" aria-label="Permalink to &quot;API接口有哪些不安全的因素？&quot;">​</a></h3><blockquote><p>这里从体系角度，简单列举一些不安全的因素：</p></blockquote><ul><li><strong>开发者访问开放接口</strong><ul><li>是不是一个合法的开发者？</li></ul></li><li><strong>多客户端访问接口</strong><ul><li>是不是一个合法的客户端？</li></ul></li><li><strong>用户访问接口</strong><ul><li>是不是一个合法的用户?</li><li>有没有权限访问接口？</li></ul></li><li><strong>接口传输</strong><ul><li>http明文传输数据？</li></ul></li><li><strong>其它方面</strong><ul><li>接口重放，上文介绍的<a href="https://pdai.tech/md/spring/springboot/springboot-x-interface-mideng.html" target="_blank" rel="noreferrer">接口幂等</a></li><li>接口超时，加timestamp控制？</li><li>...</li></ul></li></ul><h2 id="常见的保证接口安全的方式" tabindex="-1">常见的保证接口安全的方式？ <a class="header-anchor" href="#常见的保证接口安全的方式" aria-label="Permalink to &quot;常见的保证接口安全的方式？&quot;">​</a></h2><blockquote><p>针对上述接口存在的不安全因素，这里向你展示一些典型的保障接口安全的方式。</p></blockquote><h3 id="accesskey-secretkey" tabindex="-1">AccessKey&amp;SecretKey <a class="header-anchor" href="#accesskey-secretkey" aria-label="Permalink to &quot;AccessKey&amp;SecretKey&quot;">​</a></h3><blockquote><p>这种设计一般用在开发接口的安全，以确保是一个<strong>合法的开发者</strong>。</p></blockquote><ul><li>AccessKey： 开发者唯一标识</li><li>SecretKey: 开发者密钥</li></ul><p>以阿里云相关产品为例</p><p><img src="'+i+'" alt="error.图片加载失败"></p><h3 id="认证和授权" tabindex="-1">认证和授权 <a class="header-anchor" href="#认证和授权" aria-label="Permalink to &quot;认证和授权&quot;">​</a></h3><blockquote><p>从两个视角去看</p><ul><li>第一: <strong>认证和授权</strong>，认证是访问者的合法性，授权是访问者的权限分级；</li><li>第二: 其中认证包括<strong>对客户端的认证</strong>以及<strong>对用户的认证</strong>；</li></ul></blockquote><ul><li><strong>对于客户端的认证</strong></li></ul><p>典型的是AppKey&amp;AppSecret，或者ClientId&amp;ClientSecret等</p><p>比如oauth2协议的client cridential模式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>https://api.xxxx.com/token?grant_type=client_credentials&amp;client_id=CLIENT_ID&amp;client_secret=CLIENT_SECRET</span></span></code></pre></div><p>grant_type参数等于client_credentials表示client credentials方式，client_id是客户端id，client_secret是客户端密钥。</p><p>返回token后，通过token访问其它接口。</p><ul><li><strong>对于用户的认证和授权</strong></li></ul><p>比如oauth2协议的授权码模式(authorization code)和密码模式(resource owner password credentials)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>https://api.xxxx.com/token?grant_type=password&amp;username=USERNAME&amp;password=PASSWORD&amp;client_id=CLIENT_ID&amp;scope=read</span></span></code></pre></div><p>grant_type参数等于password表示密码方式，client_id是客户端id，username是用户名，password是密码。</p><p>(PS：password模式只有在授权码模式(authorization code)不可用时才会采用，这里只是举个例子而已)</p><p>可选参数scope表示申请的权限范围。（相关开发框架可以参考spring security, Apache Shiro，<a href="https://sa-token.dev33.cn/doc/index.html" target="_blank" rel="noreferrer">SA-Token在新窗口打开</a>等）</p><h3 id="https" tabindex="-1">https <a class="header-anchor" href="#https" aria-label="Permalink to &quot;https&quot;">​</a></h3><blockquote><p>从接口传输安全的角度，防止接口数据明文传输， 具体可以看<a href="https://pdai.tech/md/develop/protocol/dev-protocol-http.html#%E8%AE%A4%E8%AF%81" target="_blank" rel="noreferrer">这里</a></p></blockquote><p>HTTP 有以下安全性问题:</p><ul><li>使用明文进行通信，内容可能会被窃听；</li><li>不验证通信方的身份，通信方的身份有可能遭遇伪装；</li><li>无法证明报文的完整性，报文有可能遭篡改。</li></ul><p>HTTPs 并不是新协议，而是让 HTTP 先和 SSL(Secure Sockets Layer)通信，再由 SSL 和 TCP 通信，也就是说 HTTPs 使用了隧道进行通信。</p><p>通过使用 SSL，HTTPs 具有了加密(防窃听)、认证(防伪装)和完整性保护(防篡改)。</p><p><img src="'+s+`" alt="error.图片加载失败"></p><h3 id="接口签名-加密" tabindex="-1">接口签名（加密） <a class="header-anchor" href="#接口签名-加密" aria-label="Permalink to &quot;接口签名（加密）&quot;">​</a></h3><blockquote><p>接口签名（加密），主要防止请求参数被篡改。特别是安全要求比较高的接口，比如支付领域的接口。</p></blockquote><ul><li><strong>签名的主要流程</strong></li></ul><p>首先我们需要分配给客户端一个私钥用于URL签名加密，一般的签名算法如下：</p><p>1、首先对请求参数按key进行字母排序放入有序集合中（其它参数请参看后续补充部分）；</p><p>2、对排序完的数组键值对用&amp;进行连接，形成用于加密的参数字符串；</p><p>3、在加密的参数字符串前面或者后面加上私钥，然后用加密算法进行加密，得到sign，然后随着请求接口一起传给服务器。</p><p>例如： <a href="https://api.xxxx.com/token?key=value&amp;timetamp=xxxx&amp;sign=xxxx-xxx-xxx-xxxx" target="_blank" rel="noreferrer">https://api.xxxx.com/token?key=value&amp;timetamp=xxxx&amp;sign=xxxx-xxx-xxx-xxxx</a></p><p>服务器端接收到请求后，用同样的算法获得服务器的sign，对比客户端的sign是否一致，如果一致请求有效；如果不一致返回指定的错误信息。</p><ul><li><strong>补充：对什么签名？</strong></li></ul><ol><li>主要包括请求参数，这是最主要的部分，<strong>签名的目的要防止参数被篡改，就要对可能被篡改的参数签名</strong>；</li><li>同时考虑到请求参数的来源可能是请求路径path中，请求header中，请求body中。</li><li>如果对客户端分配了AppKey&amp;AppSecret，也可加入签名计算；</li><li>考虑到其它幂等，token失效等，也会将涉及的参数一并加入签名，比如timestamp，流水号nonce等（这些参数可能来源于header）</li></ol><ul><li><strong>补充: 签名算法？</strong></li></ul><p>一般涉及这块，主要包含三点：密钥，签名算法，签名规则</p><ol><li><strong>密钥secret</strong>： 前后端约定的secret，这里要注意前端可能无法妥善保存好secret，比如SPA单页应用；</li><li><strong>签名算法</strong>：也不一定要是对称加密算法，对称是反过来解析sign，这里是用同样的算法和规则计算出sign，并对比前端传过来的sign是否一致。</li><li><strong>签名规则</strong>：比如多次加盐加密等；</li></ol><blockquote><p>PS：有读者会问，我们是可能从有些客户端获取密钥，算法和规则的（比如前端SPA单页应用生成的js中获取密钥，算法和规则），那么签名的意义在哪里？我认为签名是手段而不是目的，签名是加大攻击者攻击难度的一种手段，至少是可以抵挡大部分简单的攻击的，再加上其它防范方式（流水号，时间戳，token等)进一步提升攻击的难度而已。</p></blockquote><ul><li><strong>补充：签名和加密是不是一回事？</strong></li></ul><p>严格来说不是一回事：</p><ol><li><p><strong>签名</strong>是通过对参数按照指定的算法、规则计算出sign，最后前后端通过同样的算法计算出sign是否一致来防止参数篡改的，所以你可以看到参数是明文的，只是多加了一个计算出的sign。</p></li><li><p><strong>加密</strong>是对请求的参数加密，后端进行解密；同时有些情况下，也会对返回的response进行加密，前端进行解密；这里存在加密和解密的过程，所以思路上必然是对称加密的形式+时间戳接口时效性等。</p></li></ol><ul><li><strong>补充：签名放在哪里？</strong></li></ul><p>签名可以放在请求参数中（path中，body中等），更为优雅的可以放在HEADER中，比如X-Sign（通常第三方的header参数以X-开头）</p><ul><li><strong>补充：大厂开放平台是怎么做的呢？哪些可以借鉴？</strong></li></ul><p>以腾讯开放平台为例，请参考<a href="https://wiki.open.qq.com/wiki/%E8%85%BE%E8%AE%AF%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%94%E7%94%A8%E7%AD%BE%E5%90%8D%E5%8F%82%E6%95%B0sig%E7%9A%84%E8%AF%B4%E6%98%8E" target="_blank" rel="noreferrer">腾讯开放平台第三方应用签名参数sig的说明在新窗口打开</a></p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>本例子采用AOP拦截自定义注解方式实现，主要看实现的思路而已(签名的目的要防止参数被篡改，就要对可能被篡改的参数签名)。@pdai</p></blockquote><h3 id="定义注解" tabindex="-1">定义注解 <a class="header-anchor" href="#定义注解" aria-label="Permalink to &quot;定义注解&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.sign.config.sign;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.ElementType;</span></span>
<span class="line"><span>import java.lang.annotation.Retention;</span></span>
<span class="line"><span>import java.lang.annotation.RetentionPolicy;</span></span>
<span class="line"><span>import java.lang.annotation.Target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Target(ElementType.METHOD)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public @interface Signature {</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="aop拦截" tabindex="-1">AOP拦截 <a class="header-anchor" href="#aop拦截" aria-label="Permalink to &quot;AOP拦截&quot;">​</a></h3><p>这里可以看到需要对所有用户可能修改的参数点进行按规则签名</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.sign.config.sign;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.nio.charset.StandardCharsets;</span></span>
<span class="line"><span>import java.util.Map;</span></span>
<span class="line"><span>import java.util.Objects;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.servlet.http.HttpServletRequest;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import cn.hutool.core.text.CharSequenceUtil;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Aspect;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Before;</span></span>
<span class="line"><span>import org.aspectj.lang.annotation.Pointcut;</span></span>
<span class="line"><span>import org.springframework.stereotype.Component;</span></span>
<span class="line"><span>import org.springframework.util.CollectionUtils;</span></span>
<span class="line"><span>import org.springframework.web.context.request.RequestAttributes;</span></span>
<span class="line"><span>import org.springframework.web.context.request.RequestContextHolder;</span></span>
<span class="line"><span>import org.springframework.web.context.request.ServletRequestAttributes;</span></span>
<span class="line"><span>import org.springframework.web.context.request.ServletWebRequest;</span></span>
<span class="line"><span>import org.springframework.web.servlet.HandlerMapping;</span></span>
<span class="line"><span>import org.springframework.web.util.ContentCachingRequestWrapper;</span></span>
<span class="line"><span>import tech.pdai.springboot.api.sign.config.exception.BusinessException;</span></span>
<span class="line"><span>import tech.pdai.springboot.api.sign.util.SignUtil;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Aspect</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class SignAspect {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * SIGN_HEADER.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final String SIGN_HEADER = &quot;X-SIGN&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * pointcut.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Pointcut(&quot;execution(@tech.pdai.springboot.api.sign.config.sign.Signature * *(..))&quot;)</span></span>
<span class="line"><span>    private void verifySignPointCut() {</span></span>
<span class="line"><span>        // nothing</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * verify sign.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Before(&quot;verifySignPointCut()&quot;)</span></span>
<span class="line"><span>    public void verify() {</span></span>
<span class="line"><span>        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();</span></span>
<span class="line"><span>        String sign = request.getHeader(SIGN_HEADER);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // must have sign in header</span></span>
<span class="line"><span>        if (CharSequenceUtil.isBlank(sign)) {</span></span>
<span class="line"><span>            throw new BusinessException(&quot;no signature in header: &quot; + SIGN_HEADER);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // check signature</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            String generatedSign = generatedSignature(request);</span></span>
<span class="line"><span>            if (!sign.equals(generatedSign)) {</span></span>
<span class="line"><span>                throw new BusinessException(&quot;invalid signature&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Throwable throwable) {</span></span>
<span class="line"><span>            throw new BusinessException(&quot;invalid signature&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String generatedSignature(HttpServletRequest request) throws IOException {</span></span>
<span class="line"><span>        // @RequestBody</span></span>
<span class="line"><span>        String bodyParam = null;</span></span>
<span class="line"><span>        if (request instanceof ContentCachingRequestWrapper) {</span></span>
<span class="line"><span>            bodyParam = new String(((ContentCachingRequestWrapper) request).getContentAsByteArray(), StandardCharsets.UTF_8);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // @RequestParam</span></span>
<span class="line"><span>        Map&lt;String, String[]&gt; requestParameterMap = request.getParameterMap();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // @PathVariable</span></span>
<span class="line"><span>        String[] paths = null;</span></span>
<span class="line"><span>        ServletWebRequest webRequest = new ServletWebRequest(request, null);</span></span>
<span class="line"><span>        Map&lt;String, String&gt; uriTemplateVars = (Map&lt;String, String&gt;) webRequest.getAttribute(</span></span>
<span class="line"><span>                HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE, RequestAttributes.SCOPE_REQUEST);</span></span>
<span class="line"><span>        if (!CollectionUtils.isEmpty(uriTemplateVars)) {</span></span>
<span class="line"><span>            paths = uriTemplateVars.values().toArray(new String[0]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return SignUtil.sign(bodyParam, requestParameterMap, paths);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="request封装" tabindex="-1">Request封装 <a class="header-anchor" href="#request封装" aria-label="Permalink to &quot;Request封装&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.sign.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.servlet.FilterChain;</span></span>
<span class="line"><span>import javax.servlet.ServletException;</span></span>
<span class="line"><span>import javax.servlet.http.HttpServletRequest;</span></span>
<span class="line"><span>import javax.servlet.http.HttpServletResponse;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.NonNull;</span></span>
<span class="line"><span>import lombok.extern.slf4j.Slf4j;</span></span>
<span class="line"><span>import org.springframework.web.filter.OncePerRequestFilter;</span></span>
<span class="line"><span>import org.springframework.web.util.ContentCachingRequestWrapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class RequestCachingFilter extends OncePerRequestFilter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * This {@code doFilter} implementation stores a request attribute for</span></span>
<span class="line"><span>     * &quot;already filtered&quot;, proceeding without filtering again if the</span></span>
<span class="line"><span>     * attribute is already there.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param request     request</span></span>
<span class="line"><span>     * @param response    response</span></span>
<span class="line"><span>     * @param filterChain filterChain</span></span>
<span class="line"><span>     * @throws ServletException ServletException</span></span>
<span class="line"><span>     * @throws IOException      IOException</span></span>
<span class="line"><span>     * @see #getAlreadyFilteredAttributeName</span></span>
<span class="line"><span>     * @see #shouldNotFilter</span></span>
<span class="line"><span>     * @see #doFilterInternal</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {</span></span>
<span class="line"><span>        boolean isFirstRequest = !isAsyncDispatch(request);</span></span>
<span class="line"><span>        HttpServletRequest requestWrapper = request;</span></span>
<span class="line"><span>        if (isFirstRequest &amp;&amp; !(request instanceof ContentCachingRequestWrapper)) {</span></span>
<span class="line"><span>            requestWrapper = new ContentCachingRequestWrapper(request);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            filterChain.doFilter(requestWrapper, response);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注册</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.sign.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.boot.web.servlet.FilterRegistrationBean;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Bean;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class FilterConfig {</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public RequestCachingFilter requestCachingFilter() {</span></span>
<span class="line"><span>        return new RequestCachingFilter();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public FilterRegistrationBean requestCachingFilterRegistration(</span></span>
<span class="line"><span>            RequestCachingFilter requestCachingFilter) {</span></span>
<span class="line"><span>        FilterRegistrationBean bean = new FilterRegistrationBean(requestCachingFilter);</span></span>
<span class="line"><span>        bean.setOrder(1);</span></span>
<span class="line"><span>        return bean;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="实现接口" tabindex="-1">实现接口 <a class="header-anchor" href="#实现接口" aria-label="Permalink to &quot;实现接口&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.api.sign.controller;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.PathVariable;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.PostMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestBody;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestMapping;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RequestParam;</span></span>
<span class="line"><span>import org.springframework.web.bind.annotation.RestController;</span></span>
<span class="line"><span>import tech.pdai.springboot.api.sign.config.response.ResponseResult;</span></span>
<span class="line"><span>import tech.pdai.springboot.api.sign.config.sign.Signature;</span></span>
<span class="line"><span>import tech.pdai.springboot.api.sign.entity.User;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;user&quot;)</span></span>
<span class="line"><span>public class SignTestController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Signature</span></span>
<span class="line"><span>    @PostMapping(&quot;test/{id}&quot;)</span></span>
<span class="line"><span>    public ResponseResult&lt;String&gt; myController(@PathVariable String id</span></span>
<span class="line"><span>            , @RequestParam String client</span></span>
<span class="line"><span>            , @RequestBody User user) {</span></span>
<span class="line"><span>        return ResponseResult.success(String.join(&quot;,&quot;, id, client, user.toString()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="接口测试" tabindex="-1">接口测试 <a class="header-anchor" href="#接口测试" aria-label="Permalink to &quot;接口测试&quot;">​</a></h3><p>body参数</p><p><img src="`+l+'" alt="error.图片加载失败"></p><p>如果不带X-SIGN</p><p><img src="'+r+'" alt="error.图片加载失败"></p><p>如果X-SIGN错误</p><p><img src="'+o+'" alt="error.图片加载失败"></p><p>如果X-SIGN正确</p><p><img src="'+c+'" alt="error.图片加载失败"></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',82)]))}const f=a(g,[["render",u]]);export{S as __pageData,f as default};
