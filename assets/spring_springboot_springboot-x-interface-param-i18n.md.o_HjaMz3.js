import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-4.png",r="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-3.png",t="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-5.png",i="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-7.png",o="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-6.png",c="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-8.png",g="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-9.png",k=JSON.parse('{"title":"SpringBoot接口 - 如何参数校验国际化","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-param-i18n.md","filePath":"spring/springboot/springboot-x-interface-param-i18n.md","lastUpdated":1737706346000}'),u={name:"spring/springboot/springboot-x-interface-param-i18n.md"};function d(m,s,h,b,f,v){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="springboot接口-如何参数校验国际化" tabindex="-1">SpringBoot接口 - 如何参数校验国际化 <a class="header-anchor" href="#springboot接口-如何参数校验国际化" aria-label="Permalink to &quot;SpringBoot接口 - 如何参数校验国际化&quot;">​</a></h1><blockquote><p>上文我们学习了如何对SpringBoot接口进行参数校验，但是如果需要有国际化的信息（比如返回校验结果有中英文），应该如何优雅处理呢？@pdai</p></blockquote><h2 id="什么是国际化" tabindex="-1">什么是国际化 <a class="header-anchor" href="#什么是国际化" aria-label="Permalink to &quot;什么是国际化&quot;">​</a></h2><p>软件的国际化：软件开发时，要使它能同时应对世界不同地区和国家的访问，并针对不同地区和国家的访问，提供相应的、符合来访者阅读习惯的页面或数据。国际化又称为 i18n：internationalization</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>这里实现一个案例: 语言切换和国际化（中英文）验证信息。</p></blockquote><h3 id="定义资源文件" tabindex="-1">定义资源文件 <a class="header-anchor" href="#定义资源文件" aria-label="Permalink to &quot;定义资源文件&quot;">​</a></h3><p>在Resources下添加如下：</p><p><img src="'+l+'" alt="error.图片加载失败"></p><p>填写名称和资源语言类型</p><p><img src="'+r+'" alt="error.图片加载失败"></p><p>添加中英文对应的message</p><p><img src="'+t+`" alt="error.图片加载失败"></p><h3 id="使用message" tabindex="-1">使用message <a class="header-anchor" href="#使用message" aria-label="Permalink to &quot;使用message&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Builder</span></span>
<span class="line"><span>@ApiModel(value = &quot;User&quot;, subTypes = {AddressParam.class})</span></span>
<span class="line"><span>public class UserParam implements Serializable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;{user.msg.userId.notEmpty}&quot;) // 这里</span></span>
<span class="line"><span>    private String userId;</span></span></code></pre></div><h3 id="中英文切换拦截" tabindex="-1">中英文切换拦截 <a class="header-anchor" href="#中英文切换拦截" aria-label="Permalink to &quot;中英文切换拦截&quot;">​</a></h3><p>由于默认是拦截request参数获取locale参数来实现的切换语言，这里我们可以改下，优先从header中获取，如果没有获取到再从request参数中获取。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.validation.i18n.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.servlet.ServletException;</span></span>
<span class="line"><span>import javax.servlet.http.HttpServletRequest;</span></span>
<span class="line"><span>import javax.servlet.http.HttpServletResponse;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.extern.slf4j.Slf4j;</span></span>
<span class="line"><span>import org.springframework.lang.NonNull;</span></span>
<span class="line"><span>import org.springframework.util.ObjectUtils;</span></span>
<span class="line"><span>import org.springframework.web.servlet.LocaleResolver;</span></span>
<span class="line"><span>import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;</span></span>
<span class="line"><span>import org.springframework.web.servlet.support.RequestContextUtils;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * custom locale change interceptor.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class CustomLocaleChangeInterceptor extends LocaleChangeInterceptor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * try to get locale from header, if not exist then get it from request parameter.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param request  request</span></span>
<span class="line"><span>     * @param response response</span></span>
<span class="line"><span>     * @param handler  handler</span></span>
<span class="line"><span>     * @return bool</span></span>
<span class="line"><span>     * @throws ServletException ServletException</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean preHandle(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws ServletException {</span></span>
<span class="line"><span>        String newLocale = request.getHeader(getParamName());</span></span>
<span class="line"><span>        if (newLocale!=null) {</span></span>
<span class="line"><span>            if (checkHttpMethods(request.getMethod())) {</span></span>
<span class="line"><span>                LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);</span></span>
<span class="line"><span>                if (localeResolver==null) {</span></span>
<span class="line"><span>                    throw new IllegalStateException(&quot;No LocaleResolver found: not in a DispatcherServlet request?&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    localeResolver.setLocale(request, response, parseLocaleValue(newLocale));</span></span>
<span class="line"><span>                } catch (IllegalArgumentException ex) {</span></span>
<span class="line"><span>                    if (isIgnoreInvalidLocale()) {</span></span>
<span class="line"><span>                        log.debug(&quot;Ignoring invalid locale value [&quot; + newLocale + &quot;]: &quot; + ex.getMessage());</span></span>
<span class="line"><span>                    } else {</span></span>
<span class="line"><span>                        throw ex;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return super.preHandle(request, response, handler);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private boolean checkHttpMethods(String currentMethod) {</span></span>
<span class="line"><span>        String[] configuredMethods = getHttpMethods();</span></span>
<span class="line"><span>        if (ObjectUtils.isEmpty(configuredMethods)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        for (String configuredMethod : configuredMethods) {</span></span>
<span class="line"><span>            if (configuredMethod.equalsIgnoreCase(currentMethod)) {</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>初始化相关配置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.validation.i18n.config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Locale;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.RequiredArgsConstructor;</span></span>
<span class="line"><span>import org.springframework.boot.validation.MessageInterpolatorFactory;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Bean;</span></span>
<span class="line"><span>import org.springframework.context.annotation.Configuration;</span></span>
<span class="line"><span>import org.springframework.context.support.ResourceBundleMessageSource;</span></span>
<span class="line"><span>import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;</span></span>
<span class="line"><span>import org.springframework.web.servlet.LocaleResolver;</span></span>
<span class="line"><span>import org.springframework.web.servlet.config.annotation.InterceptorRegistry;</span></span>
<span class="line"><span>import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;</span></span>
<span class="line"><span>import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;</span></span>
<span class="line"><span>import org.springframework.web.servlet.i18n.SessionLocaleResolver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * This class is for web config.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>@RequiredArgsConstructor</span></span>
<span class="line"><span>public class WebConfig implements WebMvcConfigurer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * lang param name in header, default to &#39;locale&#39;.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private static final String LANGUAGE_PARAM_NAME = LocaleChangeInterceptor.DEFAULT_PARAM_NAME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * message source.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private final ResourceBundleMessageSource resourceBundleMessageSource;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * default locale.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return locale resolver</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public LocaleResolver localeResolver() {</span></span>
<span class="line"><span>        SessionLocaleResolver localeResolver = new SessionLocaleResolver();</span></span>
<span class="line"><span>        localeResolver.setDefaultLocale(Locale.SIMPLIFIED_CHINESE);</span></span>
<span class="line"><span>        return localeResolver;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * local validator factory bean.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return LocalValidatorFactoryBean</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public LocalValidatorFactoryBean localValidatorFactoryBean() {</span></span>
<span class="line"><span>        LocalValidatorFactoryBean factoryBean = new LocalValidatorFactoryBean();</span></span>
<span class="line"><span>        MessageInterpolatorFactory interpolatorFactory = new MessageInterpolatorFactory();</span></span>
<span class="line"><span>        factoryBean.setMessageInterpolator(interpolatorFactory.getObject());</span></span>
<span class="line"><span>        factoryBean.setValidationMessageSource(resourceBundleMessageSource);</span></span>
<span class="line"><span>        return factoryBean;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * locale change interceptor.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @return LocaleChangeInterceptor</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Bean</span></span>
<span class="line"><span>    public LocaleChangeInterceptor localeChangeInterceptor() {</span></span>
<span class="line"><span>        LocaleChangeInterceptor interceptor = new CustomLocaleChangeInterceptor();</span></span>
<span class="line"><span>        interceptor.setParamName(LANGUAGE_PARAM_NAME);</span></span>
<span class="line"><span>        return interceptor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * register locale change interceptor.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param registry registry</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void addInterceptors(InterceptorRegistry registry) {</span></span>
<span class="line"><span>        registry.addInterceptor(localeChangeInterceptor());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="校验" tabindex="-1">校验 <a class="header-anchor" href="#校验" aria-label="Permalink to &quot;校验&quot;">​</a></h3><ul><li><strong>设置语言是中文</strong></li></ul><p><img src="`+i+'" alt="error.图片加载失败"></p><p>查看校验结果</p><p><img src="'+o+'" alt="error.图片加载失败"></p><ul><li><strong>设置语言是英文</strong></li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><p>查看校验结果</p><p><img src="'+g+'" alt="error.图片加载失败"></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',32)]))}const _=n(u,[["render",d]]);export{k as __pageData,_ as default};
