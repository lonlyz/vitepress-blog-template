import{_ as n,c as a,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/security/dev-security-csrf-1.jpg",k=JSON.parse('{"title":"开发安全 - CSRF 详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/security/dev-security-x-csrf.md","filePath":"develop/security/dev-security-x-csrf.md","lastUpdated":1737706346000}'),l={name:"develop/security/dev-security-x-csrf.md"};function i(o,s,r,c,u,h){return p(),a("div",null,s[0]||(s[0]=[e('<h1 id="开发安全-csrf-详解" tabindex="-1">开发安全 - CSRF 详解 <a class="header-anchor" href="#开发安全-csrf-详解" aria-label="Permalink to &quot;开发安全 - CSRF 详解&quot;">​</a></h1><blockquote><p>CSRF(Cross-site request forgery跨站请求伪造，也被称成为“one click attack”或者session riding，通常缩写为CSRF或者XSRF，是一种对网站的恶意利用。 @pdai</p></blockquote><h2 id="csrf-简介" tabindex="-1">CSRF 简介 <a class="header-anchor" href="#csrf-简介" aria-label="Permalink to &quot;CSRF 简介&quot;">​</a></h2><p>CSRF（Cross Site Request Forgery, 跨站域请求伪造）是一种网络的攻击方式，它在 2007 年曾被列为互联网 20 大安全隐患之一。其他安全隐患，比如 SQL 脚本注入，跨站域脚本攻击等在近年来已经逐渐为众人熟知，很多网站也都针对他们进行了防御。然而，对于大多数人来说，CSRF 却依然是一个陌生的概念。即便是大名鼎鼎的 Gmail, 在 2007 年底也存在着 CSRF 漏洞，从而被黑客攻击而使 Gmail 的用户造成巨大的损失。</p><h2 id="csrf-如何攻击" tabindex="-1">CSRF 如何攻击 <a class="header-anchor" href="#csrf-如何攻击" aria-label="Permalink to &quot;CSRF 如何攻击&quot;">​</a></h2><p><strong>先看图</strong>：</p><p><img src="'+t+`" alt=""></p><p>从上图可以看出，A网站通过cookie来识别用户（C），当用户成功进行身份验证之后浏览器就会得到一个标识其身份的cookie，只要不关闭浏览器或者退出登录，以后访问A网站会一直带上这个cookie。如果这期间浏览器被人控制着向A网站发起请求去执行一些用户不想做的功能（比如添加账号），这就是会话劫持了。因为这个不是用户真正想发出的请求，这就是所谓的“请求伪造”。此外，由于请求可以从第三方网站提交，所以前缀跨站二字，即从B网站发起。</p><p><strong>具体到银行转账为例（这是网上的一个例子，一大坨...)</strong>：</p><p>CSRF 攻击可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击站点，从而在并未授权的情况下执行在权限保护之下的操作。比如说，受害者 Bob 在银行有一笔存款，通过对银行的网站发送请求 <a href="http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=bob2" target="_blank" rel="noreferrer">http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=bob2</a> 可以使 Bob 把 1000000 的存款转到 bob2 的账号下。通常情况下，该请求发送到网站后，服务器会先验证该请求是否来自一个合法的 session，并且该 session 的用户 Bob 已经成功登陆。黑客 Mallory 自己在该银行也有账户，他知道上文中的 URL 可以把钱进行转帐操作。Mallory 可以自己发送一个请求给银行：<a href="http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=Mallory%E3%80%82%E4%BD%86%E6%98%AF%E8%BF%99%E4%B8%AA%E8%AF%B7%E6%B1%82%E6%9D%A5%E8%87%AA" target="_blank" rel="noreferrer">http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=Mallory。但是这个请求来自</a> Mallory 而非 Bob，他不能通过安全认证，因此该请求不会起作用。这时，Mallory 想到使用 CSRF 的攻击方式，他先自己做一个网站，在网站中放入如下代码： src=”<a href="http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=Mallory" target="_blank" rel="noreferrer">http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=Mallory</a> ”，并且通过广告等诱使 Bob 来访问他的网站。当 Bob 访问该网站时，上述 url 就会从 Bob 的浏览器发向银行，而这个请求会附带 Bob 浏览器中的 cookie 一起发向银行服务器。大多数情况下，该请求会失败，因为他要求 Bob 的认证信息。但是，如果 Bob 当时恰巧刚访问他的银行后不久，他的浏览器与银行网站之间的 session 尚未过期，浏览器的 cookie 之中含有 Bob 的认证信息。这时，悲剧发生了，这个 url 请求就会得到响应，钱将从 Bob 的账号转移到 Mallory 的账号，而 Bob 当时毫不知情。等以后 Bob 发现账户钱少了，即使他去银行查询日志，他也只能发现确实有一个来自于他本人的合法请求转移了资金，没有任何被攻击的痕迹。而 Mallory 则可以拿到钱后逍遥法外。</p><h2 id="csrf-理解的注意点" tabindex="-1">CSRF 理解的注意点 <a class="header-anchor" href="#csrf-理解的注意点" aria-label="Permalink to &quot;CSRF 理解的注意点&quot;">​</a></h2><blockquote><p>要理解CSRF，我认为你需要理解如下几个问题：@pdai</p></blockquote><h3 id="黑客能拿到cookie吗" tabindex="-1">黑客能拿到Cookie吗? <a class="header-anchor" href="#黑客能拿到cookie吗" aria-label="Permalink to &quot;黑客能拿到Cookie吗?&quot;">​</a></h3><blockquote><p>CSRF 攻击是黑客借助受害者的 cookie 骗取服务器的信任，但是黑客并不能拿到 cookie，也看不到 cookie 的内容。</p></blockquote><p>对于服务器返回的结果，由于浏览器同源策略的限制，黑客也无法进行解析。因此，黑客无法从返回的结果中得到任何东西，他所能做的就是给服务器发送请求，以执行请求中所描述的命令，在服务器端直接改变数据的值，而非窃取服务器中的数据。</p><h3 id="什么样的请求是要csrf保护的" tabindex="-1">什么样的请求是要CSRF保护的? <a class="header-anchor" href="#什么样的请求是要csrf保护的" aria-label="Permalink to &quot;什么样的请求是要CSRF保护的?&quot;">​</a></h3><blockquote><p>为什么有些框架（比如Spring Security)里防护CSRF的filter限定的Method是POST/PUT/DELETE等，而没有限定GET Method?</p></blockquote><p>我们要保护的对象是那些可以直接产生数据改变的服务，而对于读取数据的服务，则不需要进行 CSRF 的保护。通常而言GET请作为请求数据，不作为修改数据，所以这些框架没有拦截Get等方式请求。比如银行系统中转账的请求会直接改变账户的金额，会遭到 CSRF 攻击，需要保护。而查询余额是对金额的读取操作，不会改变数据，CSRF 攻击无法解析服务器返回的结果，无需保护。</p><h3 id="为什么对请求做了csrf拦截-但还是会报crsf漏洞" tabindex="-1">为什么对请求做了CSRF拦截，但还是会报CRSF漏洞? <a class="header-anchor" href="#为什么对请求做了csrf拦截-但还是会报crsf漏洞" aria-label="Permalink to &quot;为什么对请求做了CSRF拦截，但还是会报CRSF漏洞?&quot;">​</a></h3><blockquote><p>为什么我在前端已经采用POST+CSRF Token请求，后端也对POST请求做了CSRF Filter，但是渗透测试中还有CSRF漏洞?</p></blockquote><p>直接看下面代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 这里没有限制POST Method，导致用户可以不通过POST请求提交数据。</span></span>
<span class="line"><span>@RequestMapping(&quot;/url&quot;)</span></span>
<span class="line"><span>public ReponseData saveSomething(XXParam param){</span></span>
<span class="line"><span>    // 数据保存操作...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>PS：这一点是很容易被忽视的，在笔者经历过的几个项目的渗透测试中，多次出现。@pdai</p><h2 id="csrf-防御常规思路" tabindex="-1">CSRF 防御常规思路 <a class="header-anchor" href="#csrf-防御常规思路" aria-label="Permalink to &quot;CSRF 防御常规思路&quot;">​</a></h2><blockquote><p>一定要注意，下面只是给你提供常规思路而已（以下文字摘自<a href="https://www.ibm.com/developerworks/cn/web/1102_niugang_csrf/index.html" target="_blank" rel="noreferrer">CSRF 攻击的应对之道在新窗口打开</a>，具体实现请看下一个章节。@pdai</p></blockquote><h3 id="验证-http-referer-字段" tabindex="-1">验证 HTTP Referer 字段 <a class="header-anchor" href="#验证-http-referer-字段" aria-label="Permalink to &quot;验证 HTTP Referer 字段&quot;">​</a></h3><p>根据 HTTP 协议，在 HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址。在通常情况下，访问一个安全受限页面的请求来自于同一个网站，比如需要访问 <a href="http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=Mallory%EF%BC%8C%E7%94%A8%E6%88%B7%E5%BF%85%E9%A1%BB%E5%85%88%E7%99%BB%E9%99%86" target="_blank" rel="noreferrer">http://bank.example/withdraw?account=bob&amp;amount=1000000&amp;for=Mallory，用户必须先登陆</a> bank.example，然后通过点击页面上的按钮来触发转账事件。这时，该转帐请求的 Referer 值就会是转账按钮所在的页面的 URL，通常是以 bank.example 域名开头的地址。而如果黑客要对银行网站实施 CSRF 攻击，他只能在他自己的网站构造请求，当用户通过黑客的网站发送请求到银行时，该请求的 Referer 是指向黑客自己的网站。因此，要防御 CSRF 攻击，银行网站只需要对于每一个转账请求验证其 Referer 值，如果是以 bank.example 开头的域名，则说明该请求是来自银行网站自己的请求，是合法的。如果 Referer 是其他网站的话，则有可能是黑客的 CSRF 攻击，拒绝该请求。</p><h3 id="在请求地址中添加-token-并验证" tabindex="-1">在请求地址中添加 token 并验证 <a class="header-anchor" href="#在请求地址中添加-token-并验证" aria-label="Permalink to &quot;在请求地址中添加 token 并验证&quot;">​</a></h3><p>CSRF 攻击之所以能够成功，是因为黑客可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 cookie 中，因此黑客可以在不知道这些验证信息的情况下直接利用用户自己的 cookie 来通过安全验证。要抵御 CSRF，关键在于在请求中放入黑客所不能伪造的信息，并且该信息不存在于 cookie 之中。可以在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。</p><p>这种方法要比检查 Referer 要安全一些，token 可以在用户登陆后产生并放于 session 之中，然后在每次请求时把 token 从 session 中拿出，与请求中的 token 进行比对，但这种方法的难点在于如何把 token 以参数的形式加入请求。对于 GET 请求，token 将附在请求地址之后，这样 URL 就变成 <a href="http://url?csrftoken=tokenvalue%E3%80%82" target="_blank" rel="noreferrer">http://url?csrftoken=tokenvalue。</a> 而对于 POST 请求来说，要在 form 的最后加上 <code>&lt;input type=”hidden” name=”csrftoken” value=”tokenvalue”/&gt;</code>，这样就把 token 以参数的形式加入请求了。但是，在一个网站中，可以接受请求的地方非常多，要对于每一个请求都加上 token 是很麻烦的，并且很容易漏掉，通常使用的方法就是在每次页面加载时，使用 javascript 遍历整个 dom 树，对于 dom 中所有的 a 和 form 标签后加入 token。这样可以解决大部分的请求，但是对于在页面加载之后动态生成的 html 代码，这种方法就没有作用，还需要程序员在编码时手动添加 token。</p><p>该方法还有一个缺点是难以保证 token 本身的安全。特别是在一些论坛之类支持用户自己发表内容的网站，黑客可以在上面发布自己个人网站的地址。由于系统也会在这个地址后面加上 token，黑客可以在自己的网站上得到这个 token，并马上就可以发动 CSRF 攻击。为了避免这一点，系统可以在添加 token 的时候增加一个判断，如果这个链接是链到自己本站的，就在后面添加 token，如果是通向外网则不加。不过，即使这个 csrftoken 不以参数的形式附加在请求之中，黑客的网站也同样可以通过 Referer 来得到这个 token 值以发动 CSRF 攻击。这也是一些用户喜欢手动关闭浏览器 Referer 功能的原因。</p><h3 id="在-http-头中自定义属性并验证" tabindex="-1">在 HTTP 头中自定义属性并验证 <a class="header-anchor" href="#在-http-头中自定义属性并验证" aria-label="Permalink to &quot;在 HTTP 头中自定义属性并验证&quot;">​</a></h3><p>这种方法也是使用 token 并进行验证，和上一种方法不同的是，这里并不是把 token 以参数的形式置于 HTTP 请求之中，而是把它放到 HTTP 头中自定义的属性里。通过 XMLHttpRequest 这个类，可以一次性给所有该类请求加上 csrftoken 这个 HTTP 头属性，并把 token 值放入其中。这样解决了上种方法在请求中加入 token 的不便，同时，通过 XMLHttpRequest 请求的地址不会被记录到浏览器的地址栏，也不用担心 token 会透过 Referer 泄露到其他网站中去。</p><p>然而这种方法的局限性非常大。XMLHttpRequest 请求通常用于 Ajax 方法中对于页面局部的异步刷新，并非所有的请求都适合用这个类来发起，而且通过该类请求得到的页面不能被浏览器所记录下，从而进行前进，后退，刷新，收藏等操作，给用户带来不便。另外，对于没有进行 CSRF 防护的遗留系统来说，要采用这种方法来进行防护，要把所有请求都改为 XMLHttpRequest 请求，这样几乎是要重写整个网站，这代价无疑是不能接受的。</p><h2 id="csrf-防御实战" tabindex="-1">CSRF 防御实战 <a class="header-anchor" href="#csrf-防御实战" aria-label="Permalink to &quot;CSRF 防御实战&quot;">​</a></h2><blockquote><p>主流的框架一般都包含了CSRF的拦截。</p></blockquote><h3 id="非框架型-自定义xxxcsrffilter" tabindex="-1">非框架型 - 自定义XXXCsrfFilter <a class="header-anchor" href="#非框架型-自定义xxxcsrffilter" aria-label="Permalink to &quot;非框架型 - 自定义XXXCsrfFilter&quot;">​</a></h3><p>可以通过自定义xxxCsrfFilter去拦截实现， 这里建议你参考 Spring Security - org.springframework.security.web.csrf.CsrfFilter.java。</p><h3 id="spring-security-什么时候禁用csrf" tabindex="-1">Spring Security - 什么时候禁用CSRF <a class="header-anchor" href="#spring-security-什么时候禁用csrf" aria-label="Permalink to &quot;Spring Security - 什么时候禁用CSRF&quot;">​</a></h3><blockquote><p>你开发的应用在何时，会考虑禁用CSRF呢? 这时候需要考虑CSRF本质是盗用cookie, 无cookie方案就可以禁用。</p></blockquote><ul><li>如果你只是创建一个非浏览器客户端使用的服务,你可能会想要禁用CSRF保护</li></ul><p><strong>Spring Security中禁用CSRF</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@EnableWebSecurity</span></span>
<span class="line"><span>public class WebSecurityConfig extends WebSecurityConfigurerAdapter {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>        http.csrf().disable();// 默认是启用的，需要禁用CSRF保护</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="spring-security-cookiecsrftokenrepository-withhttponlyfalse" tabindex="-1">Spring Security - CookieCsrfTokenRepository.withHttpOnlyFalse() <a class="header-anchor" href="#spring-security-cookiecsrftokenrepository-withhttponlyfalse" aria-label="Permalink to &quot;Spring Security - CookieCsrfTokenRepository.withHttpOnlyFalse()&quot;">​</a></h3><blockquote><p>存Cookie，比如前后端分离方案：Spring Security CookieCsrfTokenRepository + 前端路由统一设置</p></blockquote><p><strong>Spring Security依赖包</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-security&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p><strong>Spring Security - CookieCsrfTokenRepository.withHttpOnlyFalse()</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>    // 本例子给个范例而已，对于xxx的部分，自己根据业务定义</span></span>
<span class="line"><span>    http</span></span>
<span class="line"><span>        .authorizeRequests()</span></span>
<span class="line"><span>            /* allow */</span></span>
<span class="line"><span>            .antMatchers(&quot;/plugins/**&quot;, &quot;/api-docs/**&quot;) .permitAll()</span></span>
<span class="line"><span>            .antMatchers(&quot;/login&quot;, &quot;/logout&quot;).permitAll()</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            /* auth control */</span></span>
<span class="line"><span>            .antMatchers(&quot;/xxx/user&quot;, &quot;/xxx/user/**&quot;).access(&quot;hasAuthority(&#39;xxx:user&#39;)&quot;)</span></span>
<span class="line"><span>            .antMatchers(&quot;/xxx/role&quot;, &quot;/xxx/role/**&quot;).access(&quot;hasAuthority(&#39;xxx:role&#39;)&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            /* others */</span></span>
<span class="line"><span>            .anyRequest().authenticated()</span></span>
<span class="line"><span>           </span></span>
<span class="line"><span>        /* other Filters */</span></span>
<span class="line"><span>        .and()</span></span>
<span class="line"><span>            .addFilterBefore(xxxFilter(), UsernamePasswordAuthenticationFilter.class)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* iframe */</span></span>
<span class="line"><span>        .headers()</span></span>
<span class="line"><span>            .frameOptions()</span></span>
<span class="line"><span>            .sameOrigin()</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* form login &amp; logout */</span></span>
<span class="line"><span>        .and().formLogin()</span></span>
<span class="line"><span>            .loginPage(&quot;/login&quot;)</span></span>
<span class="line"><span>            .usernameParameter(&quot;username&quot;)</span></span>
<span class="line"><span>            .passwordParameter(&quot;password&quot;)</span></span>
<span class="line"><span>            .defaultSuccessUrl(&quot;/admin/&quot;, true)</span></span>
<span class="line"><span>        .and().rememberMe()</span></span>
<span class="line"><span>            .rememberMeParameter(&quot;remember&quot;)</span></span>
<span class="line"><span>            .rememberMeCookieName(&quot;remember&quot;)</span></span>
<span class="line"><span>        .and().logout()</span></span>
<span class="line"><span>            .deleteCookies(&quot;JSESSIONID&quot;)</span></span>
<span class="line"><span>            .invalidateHttpSession(true)</span></span>
<span class="line"><span>            .logoutSuccessHandler(new XXXLogoutSuccessHandler(localeResolver()))</span></span>
<span class="line"><span>            .logoutRequestMatcher(new AntPathRequestMatcher(&quot;/logout&quot;))</span></span>
<span class="line"><span>            .permitAll()</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        /* csrf */</span></span>
<span class="line"><span>        .and().csrf()</span></span>
<span class="line"><span>            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());</span></span>
<span class="line"><span>//		.and().cors()</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>后端thymeleaf登录页面&quot;/login&quot;</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span>&lt;html lang=&quot;en&quot; xmlns:th=&quot;http://www.thymeleaf.org&quot;&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>    &lt;meta charset=&quot;UTF-8&quot;&gt;</span></span>
<span class="line"><span>    &lt;title&gt;登录页面&lt;/title&gt;</span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body&gt;</span></span>
<span class="line"><span>&lt;form id=&quot;form&quot; method=&quot;post&quot;&gt;</span></span>
<span class="line"><span>    &lt;label&gt;用户名：&lt;/label&gt;&lt;input name=&quot;username&quot; type=&quot;text&quot; value=&quot;&quot; /&gt;</span></span>
<span class="line"><span>    &lt;label&gt;密码：&lt;/label&gt;&lt;input name=&quot;password&quot; type=&quot;text&quot; value=&quot;&quot; /&gt;</span></span>
<span class="line"><span>    &lt;!--csrf验证需要--&gt;</span></span>
<span class="line"><span>    &lt;input type=&quot;hidden&quot; th:name=&quot;\${_csrf.parameterName}&quot; th:value=&quot;\${_csrf.token}&quot;/&gt;</span></span>
<span class="line"><span>    &lt;br/&gt;</span></span>
<span class="line"><span>    &lt;input type=&quot;submit&quot; value=&quot;登录&quot;&gt;</span></span>
<span class="line"><span>&lt;/form&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div><p><strong>前端调用后端API: 方式一 （前后端分离的）</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//  将Cookie转换为JS Object</span></span>
<span class="line"><span>function initCookies() {</span></span>
<span class="line"><span>    var cookie = document.cookie,</span></span>
<span class="line"><span>        items = cookie.split(&quot;;&quot;),</span></span>
<span class="line"><span>        keys = {};</span></span>
<span class="line"><span>    items.forEach(function(item) {</span></span>
<span class="line"><span>        var kv = item.split(&#39;=&#39;);</span></span>
<span class="line"><span>        keys[$.trim(kv[0])] = $.trim(kv[1]);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    return keys;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//  提交数据</span></span>
<span class="line"><span>$.post(url, {</span></span>
<span class="line"><span>    userId : code,</span></span>
<span class="line"><span>    _csrf : initCookies()[&#39;X-XSRF-TOKEN&#39;];</span></span>
<span class="line"><span>}, function(datas) {</span></span>
<span class="line"><span>    //  TODO something</span></span>
<span class="line"><span>})</span></span></code></pre></div><p><strong>前端调用后端API: 方式二 （后端写前端，用的后端模板）</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;meta name=&quot;_csrf&quot; content=&quot;\${_csrf.token}&quot;/&gt;</span></span>
<span class="line"><span>&lt;meta name=&quot;_csrf_header&quot; content=&quot;\${_csrf.headerName}&quot;/&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>&lt;script&gt;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    var token = $(&quot;meta[name=&#39;_csrf&#39;]&quot;).attr(&quot;content&quot;);</span></span>
<span class="line"><span>    var header = $(&quot;meta[name=&#39;_csrf_header&#39;]&quot;).attr(&quot;content&quot;);</span></span>
<span class="line"><span>    $.ajaxSetup({</span></span>
<span class="line"><span>        beforeSend: function (xhr) {</span></span>
<span class="line"><span>            if(header &amp;&amp; token ){</span></span>
<span class="line"><span>                xhr.setRequestHeader(header, token);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }}</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><h3 id="spring-security-new-cookiecsrftokenrepository" tabindex="-1">Spring Security - new CookieCsrfTokenRepository() <a class="header-anchor" href="#spring-security-new-cookiecsrftokenrepository" aria-label="Permalink to &quot;Spring Security - new CookieCsrfTokenRepository()&quot;">​</a></h3><p>可以通过<code>new CookieCsrfTokenRepository()</code>自定义拦截的逻辑，大概意思：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>        http.csrf().csrfTokenRepository(new CookieCsrfTokenRepository())</span></span>
<span class="line"><span>                .requireCsrfProtectionMatcher(</span></span>
<span class="line"><span>                        /**</span></span>
<span class="line"><span>                         * 拦截“/login”开头的访问路径，不让访问</span></span>
<span class="line"><span>                         * 拦截所有“POST”请求，不让访问</span></span>
<span class="line"><span>                         */</span></span>
<span class="line"><span>//                        httpServletRequest -&gt; httpServletRequest.getRequestURI().startsWith(&quot;/login&quot;)</span></span>
<span class="line"><span>//                                &amp;&amp; httpServletRequest.getMethod().equals(&quot;POST&quot;)</span></span>
<span class="line"><span>                        httpServletRequest -&gt; httpServletRequest.getMethod().equals(&quot;POST&quot;)</span></span>
<span class="line"><span>                );</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然也可以这么写，可以看后续对默认的<code>DefaultRequiresCsrfMatcher</code>的源码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CsrfSecurityRequestMatcher implements RequestMatcher {</span></span>
<span class="line"><span>    private Pattern allowedMethods = Pattern.compile(&quot;^(GET|HEAD|TRACE|OPTIONS)$&quot;);</span></span>
<span class="line"><span>    private RegexRequestMatcher unprotectedMatcher = new RegexRequestMatcher(&quot;^/rest/.*&quot;, null);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean matches(HttpServletRequest request) {</span></span>
<span class="line"><span>        if(allowedMethods.matcher(request.getMethod()).matches()){</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        return !unprotectedMatcher.matches(request);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="spring-security-cookiecsrftokenrepository如何工作的呢" tabindex="-1">Spring Security - CookieCsrfTokenRepository如何工作的呢? <a class="header-anchor" href="#spring-security-cookiecsrftokenrepository如何工作的呢" aria-label="Permalink to &quot;Spring Security - CookieCsrfTokenRepository如何工作的呢?&quot;">​</a></h3><p><code>CookieCsrfTokenRepository.withHttpOnlyFalse()</code> 本质就是<code>new CookieCsrfTokenRepository()</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static CookieCsrfTokenRepository withHttpOnlyFalse() {</span></span>
<span class="line"><span>    CookieCsrfTokenRepository result = new CookieCsrfTokenRepository();</span></span>
<span class="line"><span>    result.setCookieHttpOnly(false);</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>为何默认的存放CSRFToken的cookie是httpOnly呢？</strong></p><p>如果cookie中设置了HttpOnly属性，那么通过js脚本将无法读取到cookie信息，这样能有效的防止XSS攻击，窃取cookie内容，这样就增加了cookie的安全性，即便是这样，也不要将重要信息存入cookie。XSS全称Cross SiteScript，跨站脚本攻击，是Web程序中常见的漏洞，XSS属于被动式且用于客户端的攻击方式，所以容易被忽略其危害性。其原理是攻击者向有XSS漏洞的网站中输入(传入)恶意的HTML代码，当其它用户浏览该网站时，这段HTML代码会自动执行，从而达到攻击的目的。如，盗取用户Cookie、破坏页面结构、重定向到其它网站等。这里请看<a href="https://pdai.tech/md/develop/security/dev-security-x-xss.html" target="_blank" rel="noreferrer">开发安全 - XSS 详解</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 比如，设置https的cookie</span></span>
<span class="line"><span>response.addHeader(&quot;Set-Cookie&quot;, &quot;uid=112; Path=/; Secure; HttpOnly&quot;);</span></span></code></pre></div><p><strong>Cookie CsrfToken 默认的封装</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static final String DEFAULT_CSRF_COOKIE_NAME = &quot;XSRF-TOKEN&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static final String DEFAULT_CSRF_PARAMETER_NAME = &quot;_csrf&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static final String DEFAULT_CSRF_HEADER_NAME = &quot;X-XSRF-TOKEN&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String parameterName = DEFAULT_CSRF_PARAMETER_NAME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String headerName = DEFAULT_CSRF_HEADER_NAME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String cookieName = DEFAULT_CSRF_COOKIE_NAME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public CsrfToken generateToken(HttpServletRequest request) {</span></span>
<span class="line"><span>    return new DefaultCsrfToken(this.headerName, this.parameterName,</span></span>
<span class="line"><span>            createNewToken());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>CsrfToken的保存</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void saveToken(CsrfToken token, HttpServletRequest request,</span></span>
<span class="line"><span>        HttpServletResponse response) {</span></span>
<span class="line"><span>    String tokenValue = token == null ? &quot;&quot; : token.getToken();</span></span>
<span class="line"><span>    Cookie cookie = new Cookie(this.cookieName, tokenValue);</span></span>
<span class="line"><span>    cookie.setSecure(request.isSecure());</span></span>
<span class="line"><span>    if (this.cookiePath != null &amp;&amp; !this.cookiePath.isEmpty()) {</span></span>
<span class="line"><span>            cookie.setPath(this.cookiePath);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>            cookie.setPath(this.getRequestContext(request));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (token == null) {</span></span>
<span class="line"><span>        cookie.setMaxAge(0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        cookie.setMaxAge(-1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (cookieHttpOnly &amp;&amp; setHttpOnlyMethod != null) {</span></span>
<span class="line"><span>        ReflectionUtils.invokeMethod(setHttpOnlyMethod, cookie, Boolean.TRUE);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    response.addCookie(cookie);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>CsrfToken的加载</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public CsrfToken loadToken(HttpServletRequest request) {</span></span>
<span class="line"><span>    Cookie cookie = WebUtils.getCookie(request, this.cookieName);</span></span>
<span class="line"><span>    if (cookie == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    String token = cookie.getValue();</span></span>
<span class="line"><span>    if (!StringUtils.hasLength(token)) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return new DefaultCsrfToken(this.headerName, this.parameterName, token);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="spring-security-csrffilter是如何完成拦截和校验的呢" tabindex="-1">Spring Security - CsrfFilter是如何完成拦截和校验的呢? <a class="header-anchor" href="#spring-security-csrffilter是如何完成拦截和校验的呢" aria-label="Permalink to &quot;Spring Security - CsrfFilter是如何完成拦截和校验的呢?&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class CsrfFilter extends OncePerRequestFilter {</span></span>
<span class="line"><span>    // 负责CsrfToken生成，加载等</span></span>
<span class="line"><span>    private final CsrfTokenRepository tokenRepository;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 负责拦截Csrf的匹配</span></span>
<span class="line"><span>    private RequestMatcher requireCsrfProtectionMatcher = DEFAULT_CSRF_MATCHER;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 被拦截后的拒绝策略</span></span>
<span class="line"><span>	private AccessDeniedHandler accessDeniedHandler = new AccessDeniedHandlerImpl();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // CsrfFilter的过滤逻辑</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	protected void doFilterInternal(HttpServletRequest request,</span></span>
<span class="line"><span>			HttpServletResponse response, FilterChain filterChain)</span></span>
<span class="line"><span>					throws ServletException, IOException {</span></span>
<span class="line"><span>		request.setAttribute(HttpServletResponse.class.getName(), response);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 加载token,没有的自动生成一个</span></span>
<span class="line"><span>		CsrfToken csrfToken = this.tokenRepository.loadToken(request);</span></span>
<span class="line"><span>		final boolean missingToken = csrfToken == null;</span></span>
<span class="line"><span>		if (missingToken) {</span></span>
<span class="line"><span>			csrfToken = this.tokenRepository.generateToken(request);</span></span>
<span class="line"><span>			this.tokenRepository.saveToken(csrfToken, request, response);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		request.setAttribute(CsrfToken.class.getName(), csrfToken);</span></span>
<span class="line"><span>		request.setAttribute(csrfToken.getParameterName(), csrfToken);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 拦截请求</span></span>
<span class="line"><span>		if (!this.requireCsrfProtectionMatcher.matches(request)) {</span></span>
<span class="line"><span>			filterChain.doFilter(request, response);</span></span>
<span class="line"><span>			return;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 校验token</span></span>
<span class="line"><span>		String actualToken = request.getHeader(csrfToken.getHeaderName());</span></span>
<span class="line"><span>		if (actualToken == null) {</span></span>
<span class="line"><span>			actualToken = request.getParameter(csrfToken.getParameterName());</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		if (!csrfToken.getToken().equals(actualToken)) {</span></span>
<span class="line"><span>			if (this.logger.isDebugEnabled()) {</span></span>
<span class="line"><span>				this.logger.debug(&quot;Invalid CSRF token found for &quot;</span></span>
<span class="line"><span>						+ UrlUtils.buildFullRequestUrl(request));</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			if (missingToken) {</span></span>
<span class="line"><span>				this.accessDeniedHandler.handle(request, response,</span></span>
<span class="line"><span>						new MissingCsrfTokenException(actualToken));</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			else {</span></span>
<span class="line"><span>				this.accessDeniedHandler.handle(request, response,</span></span>
<span class="line"><span>						new InvalidCsrfTokenException(csrfToken, actualToken));</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			return;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		filterChain.doFilter(request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="spring-security-默认对哪些method拦截呢" tabindex="-1">Spring Security - 默认对哪些Method拦截呢? <a class="header-anchor" href="#spring-security-默认对哪些method拦截呢" aria-label="Permalink to &quot;Spring Security - 默认对哪些Method拦截呢?&quot;">​</a></h3><p>&quot;GET&quot;, &quot;HEAD&quot;, &quot;TRACE&quot;, &quot;OPTIONS&quot; 不会拦截：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final class DefaultRequiresCsrfMatcher implements RequestMatcher {</span></span>
<span class="line"><span>    private final HashSet&lt;String&gt; allowedMethods = new HashSet&lt;String&gt;(</span></span>
<span class="line"><span>            Arrays.asList(&quot;GET&quot;, &quot;HEAD&quot;, &quot;TRACE&quot;, &quot;OPTIONS&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * (non-Javadoc)</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * @see</span></span>
<span class="line"><span>        * org.springframework.security.web.util.matcher.RequestMatcher#matches(javax.</span></span>
<span class="line"><span>        * servlet.http.HttpServletRequest)</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean matches(HttpServletRequest request) {</span></span>
<span class="line"><span>        return !this.allowedMethods.contains(request.getMethod());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="spring-security-httpsessioncsrftokenrepository" tabindex="-1">Spring Security - HttpSessionCsrfTokenRepository <a class="header-anchor" href="#spring-security-httpsessioncsrftokenrepository" aria-label="Permalink to &quot;Spring Security - HttpSessionCsrfTokenRepository&quot;">​</a></h3><blockquote><p>经过上面的分析，你再看Session的，是不是很简单? 我这边贴个代码，你眼睛扫一下即可。@pdai</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class HttpSessionCsrfTokenRepository implements CsrfTokenRepository {</span></span>
<span class="line"><span>	private static final String DEFAULT_CSRF_PARAMETER_NAME = &quot;_csrf&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private static final String DEFAULT_CSRF_HEADER_NAME = &quot;X-CSRF-TOKEN&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private static final String DEFAULT_CSRF_TOKEN_ATTR_NAME = HttpSessionCsrfTokenRepository.class</span></span>
<span class="line"><span>			.getName().concat(&quot;.CSRF_TOKEN&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private String parameterName = DEFAULT_CSRF_PARAMETER_NAME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private String headerName = DEFAULT_CSRF_HEADER_NAME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private String sessionAttributeName = DEFAULT_CSRF_TOKEN_ATTR_NAME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * (non-Javadoc)</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @see org.springframework.security.web.csrf.CsrfTokenRepository#saveToken(org.</span></span>
<span class="line"><span>	 * springframework .security.web.csrf.CsrfToken,</span></span>
<span class="line"><span>	 * javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void saveToken(CsrfToken token, HttpServletRequest request,</span></span>
<span class="line"><span>			HttpServletResponse response) {</span></span>
<span class="line"><span>		if (token == null) {</span></span>
<span class="line"><span>			HttpSession session = request.getSession(false);</span></span>
<span class="line"><span>			if (session != null) {</span></span>
<span class="line"><span>				session.removeAttribute(this.sessionAttributeName);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		else {</span></span>
<span class="line"><span>			HttpSession session = request.getSession();</span></span>
<span class="line"><span>			session.setAttribute(this.sessionAttributeName, token);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * (non-Javadoc)</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @see</span></span>
<span class="line"><span>	 * org.springframework.security.web.csrf.CsrfTokenRepository#loadToken(javax.servlet</span></span>
<span class="line"><span>	 * .http.HttpServletRequest)</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public CsrfToken loadToken(HttpServletRequest request) {</span></span>
<span class="line"><span>		HttpSession session = request.getSession(false);</span></span>
<span class="line"><span>		if (session == null) {</span></span>
<span class="line"><span>			return null;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return (CsrfToken) session.getAttribute(this.sessionAttributeName);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * (non-Javadoc)</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @see org.springframework.security.web.csrf.CsrfTokenRepository#generateToken(javax.</span></span>
<span class="line"><span>	 * servlet .http.HttpServletRequest)</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public CsrfToken generateToken(HttpServletRequest request) {</span></span>
<span class="line"><span>		return new DefaultCsrfToken(this.headerName, this.parameterName,</span></span>
<span class="line"><span>				createNewToken());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="spring-security-设置csrf不对会造成哪些错误呢" tabindex="-1">Spring Security - 设置Csrf不对会造成哪些错误呢? <a class="header-anchor" href="#spring-security-设置csrf不对会造成哪些错误呢" aria-label="Permalink to &quot;Spring Security - 设置Csrf不对会造成哪些错误呢?&quot;">​</a></h3><ul><li>403 - 用CSRF作为控制权限，引发权限问题</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>There was an unexpected error (type=Forbidden, status=403).</span></span>
<span class="line"><span>Invalid CSRF Token &#39;null&#39; was found on the request parameter &#39;_csrf&#39; or header &#39;X-XSRF-TOKEN&#39;.</span></span></code></pre></div><ul><li>405 - 前置的参数绑定问题</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST method not supported。// 本质上还是参数绑定时，Csrf没有设置或者不正确。</span></span></code></pre></div><h2 id="总结与展望" tabindex="-1">总结与展望 <a class="header-anchor" href="#总结与展望" aria-label="Permalink to &quot;总结与展望&quot;">​</a></h2><p>可见，CSRF 是一种危害非常大的攻击，又很难以防范。目前几种防御策略虽然可以很大程度上抵御 CSRF 的攻击，但并没有一种完美的解决方案。一些新的方案正在研究之中，比如对于每次请求都使用不同的动态口令，把 Referer 和 token 方案结合起来，甚至尝试修改 HTTP 规范，但是这些新的方案尚不成熟，要正式投入使用并被业界广为接受还需时日。在这之前，我们只有充分重视 CSRF，根据系统的实际情况选择最合适的策略，这样才能把 CSRF 的危害降到最低。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://www.ibm.com/developerworks/cn/web/1102%5C_niugang%5C_csrf/index.html" target="_blank" rel="noreferrer">https://www.ibm.com/developerworks/cn/web/1102\\_niugang\\_csrf/index.html</a></li><li><a href="https://blog.csdn.net/panchang199266/article/details/83152587" target="_blank" rel="noreferrer">https://blog.csdn.net/panchang199266/article/details/83152587</a></li><li><a href="https://www.freebuf.com/column/186939.html" target="_blank" rel="noreferrer">https://www.freebuf.com/column/186939.html</a></li><li><a href="https://blog.csdn.net/u013185616/article/details/70446392" target="_blank" rel="noreferrer">https://blog.csdn.net/u013185616/article/details/70446392</a></li><li><a href="https://blog.csdn.net/yiifaa/article/details/78459677" target="_blank" rel="noreferrer">https://blog.csdn.net/yiifaa/article/details/78459677</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,90)]))}const g=n(l,[["render",i]]);export{k as __pageData,g as default};
