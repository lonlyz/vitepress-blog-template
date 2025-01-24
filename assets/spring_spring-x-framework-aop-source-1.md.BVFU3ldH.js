import{_ as n}from"./chunks/spring-springframework-aop-4.D64pTDnH.js";import{_ as a,c as e,ai as p,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-1.png",l="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-2.png",c="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-7.png",o="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-3.png",r="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-5.png",d="/vitepress-blog-template/images/spring/springframework/spring-springframework-aop-6.png",C=JSON.parse('{"title":"Spring进阶 - Spring AOP实现原理详解之AOP切面的实现","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-aop-source-1.md","filePath":"spring/spring-x-framework-aop-source-1.md","lastUpdated":1737706346000}'),g={name:"spring/spring-x-framework-aop-source-1.md"};function u(h,s,A,v,m,b){return t(),e("div",null,s[0]||(s[0]=[p('<h1 id="spring进阶-spring-aop实现原理详解之aop切面的实现" tabindex="-1">Spring进阶 - Spring AOP实现原理详解之AOP切面的实现 <a class="header-anchor" href="#spring进阶-spring-aop实现原理详解之aop切面的实现" aria-label="Permalink to &quot;Spring进阶 - Spring AOP实现原理详解之AOP切面的实现&quot;">​</a></h1><blockquote><p>前文，我们分析了Spring IOC的初始化过程和Bean的生命周期等，而Spring AOP也是基于IOC的Bean加载来实现的。本文主要介绍Spring AOP原理解析的切面实现过程（将切面类的所有切面方法根据使用的注解生成对应Advice，并将Advice连同切入点匹配器和切面类等信息一并封装到Advisor，为后续交给代理增强实现做准备的过程）。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>我们应该从哪里开始着手看Spring AOP的源码呢？和我们上文分析的IOC源码实现有什么关系呢？</p></blockquote><ol><li>前文中我们写了AOP的Demo，根据其XML配置我们不难发现<strong>AOP是基于IOC的Bean加载来实现的</strong>；这便使我们的主要入口</li></ol><p><img src="'+i+'" alt="error.图片加载失败"></p><p>所以理解Spring AOP的初始化必须要先理解<a href="https://pdai.tech/md/spring/spring-x-framework-ioc-source-2.html" target="_blank" rel="noreferrer">Spring IOC的初始化</a>。</p><ol start="2"><li>然后我们就能找到如下<strong>初始化的流程和aop对应的handler</strong>类</li></ol><p>即parseCustomElement方法找到parse <code>aop:aspectj-autoproxy</code>的handler(org.springframework.aop.config.AopNamespaceHandler)</p><p><img src="'+l+`" alt="error.图片加载失败"></p><p>（PS：其实你会发现，最重要的是知识点的关联关系，而不是知识点本身，就后续代码而言不就是打个断点慢慢看的事了么。）</p><h2 id="aop配置标签的解析" tabindex="-1">aop配置标签的解析 <a class="header-anchor" href="#aop配置标签的解析" aria-label="Permalink to &quot;aop配置标签的解析&quot;">​</a></h2><blockquote><p>上文中，我们找到了AopNamespaceHandler，其实就是注册BeanDefinition的解析器BeanDefinitionParser，将<code>aop:xxxxxx</code>配置标签交给指定的parser来处理。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AopNamespaceHandler extends NamespaceHandlerSupport {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Register the {@link BeanDefinitionParser BeanDefinitionParsers} for the</span></span>
<span class="line"><span>	 * &#39;{@code config}&#39;, &#39;{@code spring-configured}&#39;, &#39;{@code aspectj-autoproxy}&#39;</span></span>
<span class="line"><span>	 * and &#39;{@code scoped-proxy}&#39; tags.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public void init() {</span></span>
<span class="line"><span>		// In 2.0 XSD as well as in 2.5+ XSDs</span></span>
<span class="line"><span>        // 注册解析&lt;aop:config&gt; 配置</span></span>
<span class="line"><span>		registerBeanDefinitionParser(&quot;config&quot;, new ConfigBeanDefinitionParser());</span></span>
<span class="line"><span>        // 注册解析&lt;aop:aspectj-autoproxy&gt; 配置</span></span>
<span class="line"><span>		registerBeanDefinitionParser(&quot;aspectj-autoproxy&quot;, new AspectJAutoProxyBeanDefinitionParser());</span></span>
<span class="line"><span>		registerBeanDefinitionDecorator(&quot;scoped-proxy&quot;, new ScopedProxyBeanDefinitionDecorator());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// Only in 2.0 XSD: moved to context namespace in 2.5+</span></span>
<span class="line"><span>		registerBeanDefinitionParser(&quot;spring-configured&quot;, new SpringConfiguredBeanDefinitionParser());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="config配置标签的解析" tabindex="-1">config配置标签的解析 <a class="header-anchor" href="#config配置标签的解析" aria-label="Permalink to &quot;config配置标签的解析&quot;">​</a></h3><p><code>&lt;aop:config/&gt;</code>由ConfigBeanDefinitionParser这个类处理，作为parser类最重要的就是parse方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>public BeanDefinition parse(Element element, ParserContext parserContext) {</span></span>
<span class="line"><span>    CompositeComponentDefinition compositeDef =</span></span>
<span class="line"><span>            new CompositeComponentDefinition(element.getTagName(), parserContext.extractSource(element));</span></span>
<span class="line"><span>    parserContext.pushContainingComponent(compositeDef);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    configureAutoProxyCreator(parserContext, element);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;Element&gt; childElts = DomUtils.getChildElements(element);</span></span>
<span class="line"><span>    for (Element elt: childElts) {</span></span>
<span class="line"><span>        String localName = parserContext.getDelegate().getLocalName(elt);</span></span>
<span class="line"><span>        if (POINTCUT.equals(localName)) {</span></span>
<span class="line"><span>            parsePointcut(elt, parserContext);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (ADVISOR.equals(localName)) {</span></span>
<span class="line"><span>            parseAdvisor(elt, parserContext);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (ASPECT.equals(localName)) {</span></span>
<span class="line"><span>            parseAspect(elt, parserContext);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    parserContext.popAndRegisterContainingComponent();</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>打个断点看下</p><p><img src="`+c+`" alt="error.图片加载失败"></p><p>parseAspect的方法如下, 处理方法不难，我这里就不展开了</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void parseAspect(Element aspectElement, ParserContext parserContext) {</span></span>
<span class="line"><span>    String aspectId = aspectElement.getAttribute(ID);</span></span>
<span class="line"><span>    String aspectName = aspectElement.getAttribute(REF);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        this.parseState.push(new AspectEntry(aspectId, aspectName));</span></span>
<span class="line"><span>        List&lt;BeanDefinition&gt; beanDefinitions = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        List&lt;BeanReference&gt; beanReferences = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;Element&gt; declareParents = DomUtils.getChildElementsByTagName(aspectElement, DECLARE_PARENTS);</span></span>
<span class="line"><span>        for (int i = METHOD_INDEX; i &lt; declareParents.size(); i++) {</span></span>
<span class="line"><span>            Element declareParentsElement = declareParents.get(i);</span></span>
<span class="line"><span>            beanDefinitions.add(parseDeclareParents(declareParentsElement, parserContext));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // We have to parse &quot;advice&quot; and all the advice kinds in one loop, to get the</span></span>
<span class="line"><span>        // ordering semantics right.</span></span>
<span class="line"><span>        NodeList nodeList = aspectElement.getChildNodes();</span></span>
<span class="line"><span>        boolean adviceFoundAlready = false;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; nodeList.getLength(); i++) {</span></span>
<span class="line"><span>            Node node = nodeList.item(i);</span></span>
<span class="line"><span>            if (isAdviceNode(node, parserContext)) {</span></span>
<span class="line"><span>                if (!adviceFoundAlready) {</span></span>
<span class="line"><span>                    adviceFoundAlready = true;</span></span>
<span class="line"><span>                    if (!StringUtils.hasText(aspectName)) {</span></span>
<span class="line"><span>                        parserContext.getReaderContext().error(</span></span>
<span class="line"><span>                                &quot;&lt;aspect&gt; tag needs aspect bean reference via &#39;ref&#39; attribute when declaring advices.&quot;,</span></span>
<span class="line"><span>                                aspectElement, this.parseState.snapshot());</span></span>
<span class="line"><span>                        return;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    beanReferences.add(new RuntimeBeanReference(aspectName));</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                AbstractBeanDefinition advisorDefinition = parseAdvice(</span></span>
<span class="line"><span>                        aspectName, i, aspectElement, (Element) node, parserContext, beanDefinitions, beanReferences);</span></span>
<span class="line"><span>                beanDefinitions.add(advisorDefinition);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AspectComponentDefinition aspectComponentDefinition = createAspectComponentDefinition(</span></span>
<span class="line"><span>                aspectElement, aspectId, beanDefinitions, beanReferences, parserContext);</span></span>
<span class="line"><span>        parserContext.pushContainingComponent(aspectComponentDefinition);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;Element&gt; pointcuts = DomUtils.getChildElementsByTagName(aspectElement, POINTCUT);</span></span>
<span class="line"><span>        for (Element pointcutElement : pointcuts) {</span></span>
<span class="line"><span>            parsePointcut(pointcutElement, parserContext);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        parserContext.popAndRegisterContainingComponent();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    finally {</span></span>
<span class="line"><span>        this.parseState.pop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="aspectj-autoproxy配置标签的解析" tabindex="-1">aspectj-autoproxy配置标签的解析 <a class="header-anchor" href="#aspectj-autoproxy配置标签的解析" aria-label="Permalink to &quot;aspectj-autoproxy配置标签的解析&quot;">​</a></h3><p><code>&lt;aop:aspectj-autoproxy/&gt;</code>则由AspectJAutoProxyBeanDefinitionParser这个类处理的，我们看下parse 方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>public BeanDefinition parse(Element element, ParserContext parserContext) {</span></span>
<span class="line"><span>    // 注册AspectJAnnotationAutoProxyCreator</span></span>
<span class="line"><span>    AopNamespaceUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(parserContext, element);</span></span>
<span class="line"><span>    // 拓展BeanDefinition</span></span>
<span class="line"><span>    extendBeanDefinition(element, parserContext);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AopNamespaceUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary方法对应如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void registerAspectJAnnotationAutoProxyCreatorIfNecessary(</span></span>
<span class="line"><span>        ParserContext parserContext, Element sourceElement) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    BeanDefinition beanDefinition = AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(</span></span>
<span class="line"><span>            parserContext.getRegistry(), parserContext.extractSource(sourceElement));</span></span>
<span class="line"><span>    useClassProxyingIfNecessary(parserContext.getRegistry(), sourceElement);</span></span>
<span class="line"><span>    registerComponentIfNecessary(beanDefinition, parserContext);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary对应如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Nullable</span></span>
<span class="line"><span>public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorIfNecessary(</span></span>
<span class="line"><span>        BeanDefinitionRegistry registry, @Nullable Object source) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return registerOrEscalateApcAsRequired(AnnotationAwareAspectJAutoProxyCreator.class, registry, source);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这里，我们发现AOP的创建工作是交给AnnotationAwareAspectJAutoProxyCreator来完成的。</p><h2 id="注解切面代理创建类-annotationawareaspectjautoproxycreator" tabindex="-1">注解切面代理创建类(AnnotationAwareAspectJAutoProxyCreator) <a class="header-anchor" href="#注解切面代理创建类-annotationawareaspectjautoproxycreator" aria-label="Permalink to &quot;注解切面代理创建类(AnnotationAwareAspectJAutoProxyCreator)&quot;">​</a></h2><blockquote><p>AnnotationAwareAspectJAutoProxyCreator是如何工作的呢？这时候我们就要看AnnotationAwareAspectJAutoProxyCreator类结构关系了。</p></blockquote><p>如下是类结构关系</p><p><img src="`+o+'" alt="error.图片加载失败"></p><p>它实现了两类接口：</p><ul><li>BeanFactoryAware属于<strong>Bean级生命周期接口方法</strong></li><li>InstantiationAwareBeanPostProcessor 和 BeanPostProcessor 这两个接口实现，一般称它们的实现类为“后处理器”，是<strong>容器级生命周期接口方法</strong>；</li></ul><p>结合前文Spring Bean生命周期的流程</p><p><img src="'+n+'" alt="error.图片加载失败"></p><p>我们就可以定位到核心的初始化方法肯定在postProcessBeforeInstantiation和postProcessAfterInitialization中。</p><h3 id="postprocessbeforeinstantiation" tabindex="-1">postProcessBeforeInstantiation <a class="header-anchor" href="#postprocessbeforeinstantiation" aria-label="Permalink to &quot;postProcessBeforeInstantiation&quot;">​</a></h3><p>如下是上述类结构中postProcessBeforeInstantiation的方法，读者在自己看代码的时候建议打个断点看，可以方便理解</p><p><img src="'+r+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Object postProcessBeforeInstantiation(Class&lt;?&gt; beanClass, String beanName) {</span></span>
<span class="line"><span>    Object cacheKey = getCacheKey(beanClass, beanName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!StringUtils.hasLength(beanName) || !this.targetSourcedBeans.contains(beanName)) {</span></span>
<span class="line"><span>        // 如果已经在缓存中，则忽略</span></span>
<span class="line"><span>        if (this.advisedBeans.containsKey(cacheKey)) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 是否是aop基础类？是否跳过？</span></span>
<span class="line"><span>        if (isInfrastructureClass(beanClass) || shouldSkip(beanClass, beanName)) {</span></span>
<span class="line"><span>            this.advisedBeans.put(cacheKey, Boolean.FALSE);</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Create proxy here if we have a custom TargetSource.</span></span>
<span class="line"><span>    // Suppresses unnecessary default instantiation of the target bean:</span></span>
<span class="line"><span>    // The TargetSource will handle target instances in a custom fashion.</span></span>
<span class="line"><span>    TargetSource targetSource = getCustomTargetSource(beanClass, beanName);</span></span>
<span class="line"><span>    if (targetSource != null) {</span></span>
<span class="line"><span>        if (StringUtils.hasLength(beanName)) {</span></span>
<span class="line"><span>            this.targetSourcedBeans.add(beanName);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(beanClass, beanName, targetSource);</span></span>
<span class="line"><span>        Object proxy = createProxy(beanClass, beanName, specificInterceptors, targetSource);</span></span>
<span class="line"><span>        this.proxyTypes.put(cacheKey, proxy.getClass());</span></span>
<span class="line"><span>        return proxy;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="判断是否是aop基础类" tabindex="-1">判断是否是aop基础类 <a class="header-anchor" href="#判断是否是aop基础类" aria-label="Permalink to &quot;判断是否是aop基础类&quot;">​</a></h4><p>是否是aop基础类的判断方法 isInfrastructureClass 如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected boolean isInfrastructureClass(Class&lt;?&gt; beanClass) {</span></span>
<span class="line"><span>    // Previously we setProxyTargetClass(true) in the constructor, but that has too</span></span>
<span class="line"><span>    // broad an impact. Instead we now override isInfrastructureClass to avoid proxying</span></span>
<span class="line"><span>    // aspects. I&#39;m not entirely happy with that as there is no good reason not</span></span>
<span class="line"><span>    // to advise aspects, except that it causes advice invocation to go through a</span></span>
<span class="line"><span>    // proxy, and if the aspect implements e.g the Ordered interface it will be</span></span>
<span class="line"><span>    // proxied by that interface and fail at runtime as the advice method is not</span></span>
<span class="line"><span>    // defined on the interface. We could potentially relax the restriction about</span></span>
<span class="line"><span>    // not advising aspects in the future.</span></span>
<span class="line"><span>    // 父类判断它是aop基础类 or 使用@Aspect注解</span></span>
<span class="line"><span>    return (super.isInfrastructureClass(beanClass) ||</span></span>
<span class="line"><span>            (this.aspectJAdvisorFactory != null &amp;&amp; this.aspectJAdvisorFactory.isAspect(beanClass)));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>父类判断它是否是aop基础类的方法 super.isInfrastructureClass(beanClass), 本质上就是判断该类是否实现了Advice, Pointcut, Advisor或者AopInfrastructureBean接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected boolean isInfrastructureClass(Class&lt;?&gt; beanClass) {</span></span>
<span class="line"><span>    // 该类是否实现了Advice, Pointcut, Advisor或者AopInfrastructureBean接口</span></span>
<span class="line"><span>    boolean retVal = Advice.class.isAssignableFrom(beanClass) ||</span></span>
<span class="line"><span>            Pointcut.class.isAssignableFrom(beanClass) ||</span></span>
<span class="line"><span>            Advisor.class.isAssignableFrom(beanClass) ||</span></span>
<span class="line"><span>            AopInfrastructureBean.class.isAssignableFrom(beanClass);</span></span>
<span class="line"><span>    if (retVal &amp;&amp; logger.isTraceEnabled()) {</span></span>
<span class="line"><span>        logger.trace(&quot;Did not attempt to auto-proxy infrastructure class [&quot; + beanClass.getName() + &quot;]&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return retVal;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="是否应该跳过shouldskip" tabindex="-1">是否应该跳过shouldSkip <a class="header-anchor" href="#是否应该跳过shouldskip" aria-label="Permalink to &quot;是否应该跳过shouldSkip&quot;">​</a></h4><p>通过断点辅助，candidateAdvisors是就是xml配置的通知是对应的</p><p><img src="`+d+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected boolean shouldSkip(Class&lt;?&gt; beanClass, String beanName) {</span></span>
<span class="line"><span>    // TODO: Consider optimization by caching the list of the aspect names</span></span>
<span class="line"><span>    List&lt;Advisor&gt; candidateAdvisors = findCandidateAdvisors();</span></span>
<span class="line"><span>    for (Advisor advisor : candidateAdvisors) {</span></span>
<span class="line"><span>        if (advisor instanceof AspectJPointcutAdvisor &amp;&amp;</span></span>
<span class="line"><span>                ((AspectJPointcutAdvisor) advisor).getAspectName().equals(beanName)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return super.shouldSkip(beanClass, beanName);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="切面方法转成advisor" tabindex="-1">切面方法转成Advisor <a class="header-anchor" href="#切面方法转成advisor" aria-label="Permalink to &quot;切面方法转成Advisor&quot;">​</a></h4><p>findCandidateAdvisors方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected List&lt;Advisor&gt; findCandidateAdvisors() {</span></span>
<span class="line"><span>    // 在父类中找到所有的advisor：基于xml配置的&lt;aop:before/&gt;生成的</span></span>
<span class="line"><span>    List&lt;Advisor&gt; advisors = super.findCandidateAdvisors();</span></span>
<span class="line"><span>    // 为bean Factory中AspectJ切面构建advistor：通过AspectJ注解的方式生成Advisor类</span></span>
<span class="line"><span>    if (this.aspectJAdvisorsBuilder != null) {</span></span>
<span class="line"><span>        advisors.addAll(this.aspectJAdvisorsBuilder.buildAspectJAdvisors());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return advisors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在当前的bean Factory中通过AspectJ注解的方式生成Advisor类，buildAspectJAdvisors方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Look for AspectJ-annotated aspect beans in the current bean factory,</span></span>
<span class="line"><span>    * and return to a list of Spring AOP Advisors representing them.</span></span>
<span class="line"><span>    * &lt;p&gt;Creates a Spring Advisor for each AspectJ advice method.</span></span>
<span class="line"><span>    * @return the list of {@link org.springframework.aop.Advisor} beans</span></span>
<span class="line"><span>    * @see #isEligibleBean</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>public List&lt;Advisor&gt; buildAspectJAdvisors() {</span></span>
<span class="line"><span>    List&lt;String&gt; aspectNames = this.aspectBeanNames;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (aspectNames == null) {</span></span>
<span class="line"><span>        synchronized (this) {</span></span>
<span class="line"><span>            aspectNames = this.aspectBeanNames;</span></span>
<span class="line"><span>            if (aspectNames == null) {</span></span>
<span class="line"><span>                List&lt;Advisor&gt; advisors = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>                aspectNames = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>                String[] beanNames = BeanFactoryUtils.beanNamesForTypeIncludingAncestors(</span></span>
<span class="line"><span>                        this.beanFactory, Object.class, true, false);</span></span>
<span class="line"><span>                for (String beanName : beanNames) {</span></span>
<span class="line"><span>                    if (!isEligibleBean(beanName)) {</span></span>
<span class="line"><span>                        continue;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    // We must be careful not to instantiate beans eagerly as in this case they</span></span>
<span class="line"><span>                    // would be cached by the Spring container but would not have been weaved.</span></span>
<span class="line"><span>                    Class&lt;?&gt; beanType = this.beanFactory.getType(beanName, false);</span></span>
<span class="line"><span>                    if (beanType == null) {</span></span>
<span class="line"><span>                        continue;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    if (this.advisorFactory.isAspect(beanType)) {</span></span>
<span class="line"><span>                        aspectNames.add(beanName);</span></span>
<span class="line"><span>                        AspectMetadata amd = new AspectMetadata(beanType, beanName);</span></span>
<span class="line"><span>                        if (amd.getAjType().getPerClause().getKind() == PerClauseKind.SINGLETON) {</span></span>
<span class="line"><span>                            MetadataAwareAspectInstanceFactory factory =</span></span>
<span class="line"><span>                                    new BeanFactoryAspectInstanceFactory(this.beanFactory, beanName);</span></span>
<span class="line"><span>                            List&lt;Advisor&gt; classAdvisors = this.advisorFactory.getAdvisors(factory);</span></span>
<span class="line"><span>                            // 单例加到advisorsCache, 非单例加到aspectFactoryCache</span></span>
<span class="line"><span>                            if (this.beanFactory.isSingleton(beanName)) {</span></span>
<span class="line"><span>                                this.advisorsCache.put(beanName, classAdvisors);</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                            else {</span></span>
<span class="line"><span>                                this.aspectFactoryCache.put(beanName, factory);</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                            advisors.addAll(classAdvisors);</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        else {</span></span>
<span class="line"><span>                            // Per target or per this.</span></span>
<span class="line"><span>                            if (this.beanFactory.isSingleton(beanName)) {</span></span>
<span class="line"><span>                                throw new IllegalArgumentException(&quot;Bean with name &#39;&quot; + beanName +</span></span>
<span class="line"><span>                                        &quot;&#39; is a singleton, but aspect instantiation model is not singleton&quot;);</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                            MetadataAwareAspectInstanceFactory factory =</span></span>
<span class="line"><span>                                    new PrototypeAspectInstanceFactory(this.beanFactory, beanName);</span></span>
<span class="line"><span>                            this.aspectFactoryCache.put(beanName, factory);</span></span>
<span class="line"><span>                            // advisorFactory工厂获取advisors</span></span>
<span class="line"><span>                            advisors.addAll(this.advisorFactory.getAdvisors(factory));</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                this.aspectBeanNames = aspectNames;</span></span>
<span class="line"><span>                return advisors;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (aspectNames.isEmpty()) {</span></span>
<span class="line"><span>        return Collections.emptyList();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    List&lt;Advisor&gt; advisors = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (String aspectName : aspectNames) {</span></span>
<span class="line"><span>        List&lt;Advisor&gt; cachedAdvisors = this.advisorsCache.get(aspectName);</span></span>
<span class="line"><span>        if (cachedAdvisors != null) {</span></span>
<span class="line"><span>            advisors.addAll(cachedAdvisors);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            MetadataAwareAspectInstanceFactory factory = this.aspectFactoryCache.get(aspectName);</span></span>
<span class="line"><span>            advisors.addAll(this.advisorFactory.getAdvisors(factory));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return advisors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述方法本质上的思路是：用DCL双重锁的单例实现方式，拿到切面类里的切面方法，将其转换成advisor（并放入缓存中）。</p><p>转换的成advisor的方法是：this.advisorFactory.getAdvisors</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public List&lt;Advisor&gt; getAdvisors(MetadataAwareAspectInstanceFactory aspectInstanceFactory) {</span></span>
<span class="line"><span>    Class&lt;?&gt; aspectClass = aspectInstanceFactory.getAspectMetadata().getAspectClass();</span></span>
<span class="line"><span>    String aspectName = aspectInstanceFactory.getAspectMetadata().getAspectName();</span></span>
<span class="line"><span>    validate(aspectClass);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // We need to wrap the MetadataAwareAspectInstanceFactory with a decorator</span></span>
<span class="line"><span>    // so that it will only instantiate once.</span></span>
<span class="line"><span>    MetadataAwareAspectInstanceFactory lazySingletonAspectInstanceFactory =</span></span>
<span class="line"><span>            new LazySingletonAspectInstanceFactoryDecorator(aspectInstanceFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;Advisor&gt; advisors = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    for (Method method : getAdvisorMethods(aspectClass)) {</span></span>
<span class="line"><span>        // Prior to Spring Framework 5.2.7, advisors.size() was supplied as the declarationOrderInAspect</span></span>
<span class="line"><span>        // to getAdvisor(...) to represent the &quot;current position&quot; in the declared methods list.</span></span>
<span class="line"><span>        // However, since Java 7 the &quot;current position&quot; is not valid since the JDK no longer</span></span>
<span class="line"><span>        // returns declared methods in the order in which they are declared in the source code.</span></span>
<span class="line"><span>        // Thus, we now hard code the declarationOrderInAspect to 0 for all advice methods</span></span>
<span class="line"><span>        // discovered via reflection in order to support reliable advice ordering across JVM launches.</span></span>
<span class="line"><span>        // Specifically, a value of 0 aligns with the default value used in</span></span>
<span class="line"><span>        // AspectJPrecedenceComparator.getAspectDeclarationOrder(Advisor).</span></span>
<span class="line"><span>        Advisor advisor = getAdvisor(method, lazySingletonAspectInstanceFactory, 0, aspectName);</span></span>
<span class="line"><span>        if (advisor != null) {</span></span>
<span class="line"><span>            advisors.add(advisor);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // If it&#39;s a per target aspect, emit the dummy instantiating aspect.</span></span>
<span class="line"><span>    if (!advisors.isEmpty() &amp;&amp; lazySingletonAspectInstanceFactory.getAspectMetadata().isLazilyInstantiated()) {</span></span>
<span class="line"><span>        Advisor instantiationAdvisor = new SyntheticInstantiationAdvisor(lazySingletonAspectInstanceFactory);</span></span>
<span class="line"><span>        advisors.add(0, instantiationAdvisor);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Find introduction fields.</span></span>
<span class="line"><span>    for (Field field : aspectClass.getDeclaredFields()) {</span></span>
<span class="line"><span>        Advisor advisor = getDeclareParentsAdvisor(field);</span></span>
<span class="line"><span>        if (advisor != null) {</span></span>
<span class="line"><span>            advisors.add(advisor);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return advisors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>getAdvisor方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>public Advisor getAdvisor(Method candidateAdviceMethod, MetadataAwareAspectInstanceFactory aspectInstanceFactory,</span></span>
<span class="line"><span>        int declarationOrderInAspect, String aspectName) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    validate(aspectInstanceFactory.getAspectMetadata().getAspectClass());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AspectJExpressionPointcut expressionPointcut = getPointcut(</span></span>
<span class="line"><span>            candidateAdviceMethod, aspectInstanceFactory.getAspectMetadata().getAspectClass());</span></span>
<span class="line"><span>    if (expressionPointcut == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 封装成advisor</span></span>
<span class="line"><span>    return new InstantiationModelAwarePointcutAdvisorImpl(expressionPointcut, candidateAdviceMethod,</span></span>
<span class="line"><span>            this, aspectInstanceFactory, declarationOrderInAspect, aspectName);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="获取表达式的切点" tabindex="-1">获取表达式的切点 <a class="header-anchor" href="#获取表达式的切点" aria-label="Permalink to &quot;获取表达式的切点&quot;">​</a></h4><p>获取表达式的切点的方法getPointcut如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Nullable</span></span>
<span class="line"><span>private AspectJExpressionPointcut getPointcut(Method candidateAdviceMethod, Class&lt;?&gt; candidateAspectClass) {</span></span>
<span class="line"><span>    AspectJAnnotation&lt;?&gt; aspectJAnnotation =</span></span>
<span class="line"><span>            AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(candidateAdviceMethod);</span></span>
<span class="line"><span>    if (aspectJAnnotation == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AspectJExpressionPointcut ajexp =</span></span>
<span class="line"><span>            new AspectJExpressionPointcut(candidateAspectClass, new String[0], new Class&lt;?&gt;[0]);</span></span>
<span class="line"><span>    ajexp.setExpression(aspectJAnnotation.getPointcutExpression());</span></span>
<span class="line"><span>    if (this.beanFactory != null) {</span></span>
<span class="line"><span>        ajexp.setBeanFactory(this.beanFactory);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ajexp;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod的方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final Class&lt;?&gt;[] ASPECTJ_ANNOTATION_CLASSES = new Class&lt;?&gt;[] {</span></span>
<span class="line"><span>        Pointcut.class, Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>    * Find and return the first AspectJ annotation on the given method</span></span>
<span class="line"><span>    * (there &lt;i&gt;should&lt;/i&gt; only be one anyway...).</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>@SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>protected static AspectJAnnotation&lt;?&gt; findAspectJAnnotationOnMethod(Method method) {</span></span>
<span class="line"><span>    for (Class&lt;?&gt; clazz : ASPECTJ_ANNOTATION_CLASSES) {</span></span>
<span class="line"><span>        AspectJAnnotation&lt;?&gt; foundAnnotation = findAnnotation(method, (Class&lt;Annotation&gt;) clazz);</span></span>
<span class="line"><span>        if (foundAnnotation != null) {</span></span>
<span class="line"><span>            return foundAnnotation;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>findAnnotation方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Nullable</span></span>
<span class="line"><span>private static &lt;A extends Annotation&gt; AspectJAnnotation&lt;A&gt; findAnnotation(Method method, Class&lt;A&gt; toLookFor) {</span></span>
<span class="line"><span>    A result = AnnotationUtils.findAnnotation(method, toLookFor);</span></span>
<span class="line"><span>    if (result != null) {</span></span>
<span class="line"><span>        return new AspectJAnnotation&lt;&gt;(result);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AnnotationUtils.findAnnotation 获取注解方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Find a single {@link Annotation} of {@code annotationType} on the supplied</span></span>
<span class="line"><span>    * {@link Method}, traversing its super methods (i.e. from superclasses and</span></span>
<span class="line"><span>    * interfaces) if the annotation is not &lt;em&gt;directly present&lt;/em&gt; on the given</span></span>
<span class="line"><span>    * method itself.</span></span>
<span class="line"><span>    * &lt;p&gt;Correctly handles bridge {@link Method Methods} generated by the compiler.</span></span>
<span class="line"><span>    * &lt;p&gt;Meta-annotations will be searched if the annotation is not</span></span>
<span class="line"><span>    * &lt;em&gt;directly present&lt;/em&gt; on the method.</span></span>
<span class="line"><span>    * &lt;p&gt;Annotations on methods are not inherited by default, so we need to handle</span></span>
<span class="line"><span>    * this explicitly.</span></span>
<span class="line"><span>    * @param method the method to look for annotations on</span></span>
<span class="line"><span>    * @param annotationType the annotation type to look for</span></span>
<span class="line"><span>    * @return the first matching annotation, or {@code null} if not found</span></span>
<span class="line"><span>    * @see #getAnnotation(Method, Class)</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>public static &lt;A extends Annotation&gt; A findAnnotation(Method method, @Nullable Class&lt;A&gt; annotationType) {</span></span>
<span class="line"><span>    if (annotationType == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Shortcut: directly present on the element, with no merging needed?</span></span>
<span class="line"><span>    if (AnnotationFilter.PLAIN.matches(annotationType) ||</span></span>
<span class="line"><span>            AnnotationsScanner.hasPlainJavaAnnotationsOnly(method)) {</span></span>
<span class="line"><span>        return method.getDeclaredAnnotation(annotationType);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Exhaustive retrieval of merged annotations...</span></span>
<span class="line"><span>    return MergedAnnotations.from(method, SearchStrategy.TYPE_HIERARCHY, RepeatableContainers.none())</span></span>
<span class="line"><span>            .get(annotationType).withNonMergedAttributes()</span></span>
<span class="line"><span>            .synthesize(MergedAnnotation::isPresent).orElse(null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="封装成advisor" tabindex="-1">封装成Advisor <a class="header-anchor" href="#封装成advisor" aria-label="Permalink to &quot;封装成Advisor&quot;">​</a></h4><p>注：Advisor 是 advice的包装器，包含了advice及其它信息</p><p>由InstantiationModelAwarePointcutAdvisorImpl构造完成</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public InstantiationModelAwarePointcutAdvisorImpl(AspectJExpressionPointcut declaredPointcut,</span></span>
<span class="line"><span>        Method aspectJAdviceMethod, AspectJAdvisorFactory aspectJAdvisorFactory,</span></span>
<span class="line"><span>        MetadataAwareAspectInstanceFactory aspectInstanceFactory, int declarationOrder, String aspectName) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.declaredPointcut = declaredPointcut;</span></span>
<span class="line"><span>    this.declaringClass = aspectJAdviceMethod.getDeclaringClass();</span></span>
<span class="line"><span>    this.methodName = aspectJAdviceMethod.getName();</span></span>
<span class="line"><span>    this.parameterTypes = aspectJAdviceMethod.getParameterTypes();</span></span>
<span class="line"><span>    this.aspectJAdviceMethod = aspectJAdviceMethod;</span></span>
<span class="line"><span>    this.aspectJAdvisorFactory = aspectJAdvisorFactory;</span></span>
<span class="line"><span>    this.aspectInstanceFactory = aspectInstanceFactory;</span></span>
<span class="line"><span>    this.declarationOrder = declarationOrder;</span></span>
<span class="line"><span>    this.aspectName = aspectName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (aspectInstanceFactory.getAspectMetadata().isLazilyInstantiated()) {</span></span>
<span class="line"><span>        // Static part of the pointcut is a lazy type.</span></span>
<span class="line"><span>        Pointcut preInstantiationPointcut = Pointcuts.union(</span></span>
<span class="line"><span>                aspectInstanceFactory.getAspectMetadata().getPerClausePointcut(), this.declaredPointcut);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Make it dynamic: must mutate from pre-instantiation to post-instantiation state.</span></span>
<span class="line"><span>        // If it&#39;s not a dynamic pointcut, it may be optimized out</span></span>
<span class="line"><span>        // by the Spring AOP infrastructure after the first evaluation.</span></span>
<span class="line"><span>        this.pointcut = new PerTargetInstantiationModelPointcut(</span></span>
<span class="line"><span>                this.declaredPointcut, preInstantiationPointcut, aspectInstanceFactory);</span></span>
<span class="line"><span>        this.lazy = true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        // A singleton aspect.</span></span>
<span class="line"><span>        this.pointcut = this.declaredPointcut;</span></span>
<span class="line"><span>        this.lazy = false;</span></span>
<span class="line"><span>        this.instantiatedAdvice = instantiateAdvice(this.declaredPointcut);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过pointcut获取advice</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Advice instantiateAdvice(AspectJExpressionPointcut pointcut) {</span></span>
<span class="line"><span>    Advice advice = this.aspectJAdvisorFactory.getAdvice(this.aspectJAdviceMethod, pointcut,</span></span>
<span class="line"><span>            this.aspectInstanceFactory, this.declarationOrder, this.aspectName);</span></span>
<span class="line"><span>    return (advice != null ? advice : EMPTY_ADVICE);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>交给aspectJAdvisorFactory获取</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>public Advice getAdvice(Method candidateAdviceMethod, AspectJExpressionPointcut expressionPointcut,</span></span>
<span class="line"><span>        MetadataAwareAspectInstanceFactory aspectInstanceFactory, int declarationOrder, String aspectName) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取切面类</span></span>
<span class="line"><span>    Class&lt;?&gt; candidateAspectClass = aspectInstanceFactory.getAspectMetadata().getAspectClass();</span></span>
<span class="line"><span>    validate(candidateAspectClass);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取切面注解</span></span>
<span class="line"><span>    AspectJAnnotation&lt;?&gt; aspectJAnnotation =</span></span>
<span class="line"><span>            AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(candidateAdviceMethod);</span></span>
<span class="line"><span>    if (aspectJAnnotation == null) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // If we get here, we know we have an AspectJ method.</span></span>
<span class="line"><span>    // Check that it&#39;s an AspectJ-annotated class</span></span>
<span class="line"><span>    if (!isAspect(candidateAspectClass)) {</span></span>
<span class="line"><span>        throw new AopConfigException(&quot;Advice must be declared inside an aspect type: &quot; +</span></span>
<span class="line"><span>                &quot;Offending method &#39;&quot; + candidateAdviceMethod + &quot;&#39; in class [&quot; +</span></span>
<span class="line"><span>                candidateAspectClass.getName() + &quot;]&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>        logger.debug(&quot;Found AspectJ method: &quot; + candidateAdviceMethod);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 切面注解转换成advice</span></span>
<span class="line"><span>    AbstractAspectJAdvice springAdvice;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    switch (aspectJAnnotation.getAnnotationType()) {</span></span>
<span class="line"><span>        case AtPointcut: // AtPointcut忽略</span></span>
<span class="line"><span>            if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>                logger.debug(&quot;Processing pointcut &#39;&quot; + candidateAdviceMethod.getName() + &quot;&#39;&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        case AtAround:</span></span>
<span class="line"><span>            springAdvice = new AspectJAroundAdvice(</span></span>
<span class="line"><span>                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case AtBefore:</span></span>
<span class="line"><span>            springAdvice = new AspectJMethodBeforeAdvice(</span></span>
<span class="line"><span>                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case AtAfter:</span></span>
<span class="line"><span>            springAdvice = new AspectJAfterAdvice(</span></span>
<span class="line"><span>                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case AtAfterReturning:</span></span>
<span class="line"><span>            springAdvice = new AspectJAfterReturningAdvice(</span></span>
<span class="line"><span>                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);</span></span>
<span class="line"><span>            AfterReturning afterReturningAnnotation = (AfterReturning) aspectJAnnotation.getAnnotation();</span></span>
<span class="line"><span>            if (StringUtils.hasText(afterReturningAnnotation.returning())) {</span></span>
<span class="line"><span>                springAdvice.setReturningName(afterReturningAnnotation.returning());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case AtAfterThrowing:</span></span>
<span class="line"><span>            springAdvice = new AspectJAfterThrowingAdvice(</span></span>
<span class="line"><span>                    candidateAdviceMethod, expressionPointcut, aspectInstanceFactory);</span></span>
<span class="line"><span>            AfterThrowing afterThrowingAnnotation = (AfterThrowing) aspectJAnnotation.getAnnotation();</span></span>
<span class="line"><span>            if (StringUtils.hasText(afterThrowingAnnotation.throwing())) {</span></span>
<span class="line"><span>                springAdvice.setThrowingName(afterThrowingAnnotation.throwing());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            throw new UnsupportedOperationException(</span></span>
<span class="line"><span>                    &quot;Unsupported advice type on method: &quot; + candidateAdviceMethod);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 最后将其它切面信息配置到advice</span></span>
<span class="line"><span>    springAdvice.setAspectName(aspectName);</span></span>
<span class="line"><span>    springAdvice.setDeclarationOrder(declarationOrder);</span></span>
<span class="line"><span>    String[] argNames = this.parameterNameDiscoverer.getParameterNames(candidateAdviceMethod);</span></span>
<span class="line"><span>    if (argNames != null) {</span></span>
<span class="line"><span>        springAdvice.setArgumentNamesFromStringArray(argNames);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    springAdvice.calculateArgumentBindings();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return springAdvice;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h4><p>回头看，主要是处理使用了@Aspect注解的切面类，然后将切面类的所有切面方法根据使用的注解生成对应Advice，并将Advice连同切入点匹配器和切面类等信息一并封装到Advisor的过程。</p><h3 id="postprocessafterinitialization" tabindex="-1">postProcessAfterInitialization <a class="header-anchor" href="#postprocessafterinitialization" aria-label="Permalink to &quot;postProcessAfterInitialization&quot;">​</a></h3><p>有了Adisor, 注入到合适的位置并交给代理（cglib和jdk)实现了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* Create a proxy with the configured interceptors if the bean is</span></span>
<span class="line"><span>* identified as one to proxy by the subclass.</span></span>
<span class="line"><span>* @see #getAdvicesAndAdvisorsForBean</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {</span></span>
<span class="line"><span>    if (bean != null) {</span></span>
<span class="line"><span>        Object cacheKey = getCacheKey(bean.getClass(), beanName);</span></span>
<span class="line"><span>        if (this.earlyProxyReferences.remove(cacheKey) != bean) {</span></span>
<span class="line"><span>            return wrapIfNecessary(bean, beanName, cacheKey);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return bean;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>后文中将分别介绍代理的创建和实现：</p><ul><li><a href="https://pdai.tech/md/spring/spring-x-framework-aop-source-2.html" target="_blank" rel="noreferrer">Spring进阶 - Spring AOP实现原理详解之AOP代理的创建</a></li><li><a href="https://pdai.tech/md/spring/spring-x-framework-aop-source-3.html" target="_blank" rel="noreferrer">Spring进阶 - Spring AOP实现原理详解之Cglib代理实现</a></li><li><a href="https://pdai.tech/md/spring/spring-x-framework-aop-source-4.html" target="_blank" rel="noreferrer">Spring进阶 - Spring AOP实现原理详解之JDK代理实现</a></li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>通过上文的分析，我们做下小结：</p><ol><li>由<strong>IOC Bean加载</strong>方法栈中找到parseCustomElement方法，找到parse <code>aop:aspectj-autoproxy</code>的handler(org.springframework.aop.config.AopNamespaceHandler)</li><li><strong>AopNamespaceHandler</strong>注册了<code>&lt;aop:aspectj-autoproxy/&gt;</code>的解析类是AspectJAutoProxyBeanDefinitionParser</li><li><strong>AspectJAutoProxyBeanDefinitionParser</strong>的parse 方法 通过AspectJAwareAdvisorAutoProxyCreator类去创建</li><li><strong>AspectJAwareAdvisorAutoProxyCreator</strong>实现了两类接口，BeanFactoryAware和BeanPostProcessor；根据Bean生命周期方法找到两个核心方法：postProcessBeforeInstantiation和postProcessAfterInitialization <ol><li><strong>postProcessBeforeInstantiation</strong>：主要是处理使用了@Aspect注解的切面类，然后将切面类的所有切面方法根据使用的注解生成对应Advice，并将Advice连同切入点匹配器和切面类等信息一并封装到Advisor</li><li><strong>postProcessAfterInitialization</strong>：主要负责将Advisor注入到合适的位置，创建代理（cglib或jdk)，为后面给代理进行增强实现做准备。</li></ol></li></ol><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,89)]))}const x=a(g,[["render",u]]);export{C as __pageData,x as default};
