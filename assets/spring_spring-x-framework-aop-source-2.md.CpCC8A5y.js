import{_ as a}from"./chunks/spring-springframework-aop-51.CF47XxCW.js";import{_ as n,c as p,ai as e,o as i}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"Spring进阶 - Spring AOP实现原理详解之AOP代理的创建","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-aop-source-2.md","filePath":"spring/spring-x-framework-aop-source-2.md","lastUpdated":1737706346000}'),l={name:"spring/spring-x-framework-aop-source-2.md"};function t(r,s,o,c,d,g){return i(),p("div",null,s[0]||(s[0]=[e(`<h1 id="spring进阶-spring-aop实现原理详解之aop代理的创建" tabindex="-1">Spring进阶 - Spring AOP实现原理详解之AOP代理的创建 <a class="header-anchor" href="#spring进阶-spring-aop实现原理详解之aop代理的创建" aria-label="Permalink to &quot;Spring进阶 - Spring AOP实现原理详解之AOP代理的创建&quot;">​</a></h1><blockquote><p>上文我们介绍了Spring AOP原理解析的切面实现过程(将切面类的所有切面方法根据使用的注解生成对应Advice，并将Advice连同切入点匹配器和切面类等信息一并封装到Advisor)。本文在此基础上继续介绍，代理（cglib代理和JDK代理）的创建过程。@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>前文主要Spring AOP原理解析的切面实现过程(加载配置，将切面类的所有切面方法根据使用的注解生成对应Advice，并将Advice连同切入点匹配器和切面类等信息一并封装到Advisor)。</p></blockquote><p>同时我们也总结了Spring AOP初始化的过程，具体如下：</p><ol><li>由<strong>IOC Bean加载</strong>方法栈中找到parseCustomElement方法，找到parse <code>aop:aspectj-autoproxy</code>的handler(org.springframework.aop.config.AopNamespaceHandler)</li><li><strong>AopNamespaceHandler</strong>注册了<code>&lt;aop:aspectj-autoproxy/&gt;</code>的解析类是AspectJAutoProxyBeanDefinitionParser</li><li><strong>AspectJAutoProxyBeanDefinitionParser</strong>的parse 方法 通过AspectJAwareAdvisorAutoProxyCreator类去创建</li><li><strong>AspectJAwareAdvisorAutoProxyCreator</strong>实现了两类接口，BeanFactoryAware和BeanPostProcessor；根据Bean生命周期方法找到两个核心方法：postProcessBeforeInstantiation和postProcessAfterInitialization <ol><li><strong>postProcessBeforeInstantiation</strong>：主要是处理使用了@Aspect注解的切面类，然后将切面类的所有切面方法根据使用的注解生成对应Advice，并将Advice连同切入点匹配器和切面类等信息一并封装到Advisor</li><li><strong>postProcessAfterInitialization</strong>：主要负责将Advisor注入到合适的位置，创建代理（cglib或jdk)，为后面给代理进行增强实现做准备。</li></ol></li></ol><blockquote><p>本文接着介绍postProcessAfterInitialization的方法，即Spring AOP的代理（cglib或jdk)的创建过程。</p></blockquote><h2 id="代理的创建" tabindex="-1">代理的创建 <a class="header-anchor" href="#代理的创建" aria-label="Permalink to &quot;代理的创建&quot;">​</a></h2><p>创建代理的方法是postProcessAfterInitialization：如果bean被子类标识为代理，则使用配置的拦截器创建一个代理</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Create a proxy with the configured interceptors if the bean is</span></span>
<span class="line"><span>  * identified as one to proxy by the subclass.</span></span>
<span class="line"><span>  * @see #getAdvicesAndAdvisorsForBean</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {</span></span>
<span class="line"><span>  if (bean != null) {</span></span>
<span class="line"><span>    Object cacheKey = getCacheKey(bean.getClass(), beanName);</span></span>
<span class="line"><span>    // 如果不是提前暴露的代理</span></span>
<span class="line"><span>    if (this.earlyProxyReferences.remove(cacheKey) != bean) {</span></span>
<span class="line"><span>      return wrapIfNecessary(bean, beanName, cacheKey);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return bean;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>wrapIfNecessary方法主要用于判断是否需要创建代理，如果Bean能够获取到advisor才需要创建代理</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Wrap the given bean if necessary, i.e. if it is eligible for being proxied.</span></span>
<span class="line"><span>  * @param bean the raw bean instance</span></span>
<span class="line"><span>  * @param beanName the name of the bean</span></span>
<span class="line"><span>  * @param cacheKey the cache key for metadata access</span></span>
<span class="line"><span>  * @return a proxy wrapping the bean, or the raw bean instance as-is</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {</span></span>
<span class="line"><span>   // 如果bean是通过TargetSource接口获取</span></span>
<span class="line"><span>   if (beanName != null &amp;&amp; this.targetSourcedBeans.contains(beanName)) {</span></span>
<span class="line"><span>      return bean;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   // 如果bean是切面类</span></span>
<span class="line"><span>   if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {</span></span>
<span class="line"><span>      return bean;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   // 如果是aop基础类？是否跳过？</span></span>
<span class="line"><span>   if (isInfrastructureClass(bean.getClass()) || shouldSkip(bean.getClass(), beanName)) {</span></span>
<span class="line"><span>      this.advisedBeans.put(cacheKey, Boolean.FALSE);</span></span>
<span class="line"><span>      return bean;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 重点：获取所有advisor，如果没有获取到，那说明不要进行增强，也就不需要代理了。</span></span>
<span class="line"><span>  Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);</span></span>
<span class="line"><span>  if (specificInterceptors != DO_NOT_PROXY) {</span></span>
<span class="line"><span>    this.advisedBeans.put(cacheKey, Boolean.TRUE);</span></span>
<span class="line"><span>    // 重点：创建代理</span></span>
<span class="line"><span>    Object proxy = createProxy(</span></span>
<span class="line"><span>        bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));</span></span>
<span class="line"><span>    this.proxyTypes.put(cacheKey, proxy.getClass());</span></span>
<span class="line"><span>    return proxy;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  this.advisedBeans.put(cacheKey, Boolean.FALSE);</span></span>
<span class="line"><span>  return bean;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="获取所有的advisor" tabindex="-1">获取所有的Advisor <a class="header-anchor" href="#获取所有的advisor" aria-label="Permalink to &quot;获取所有的Advisor&quot;">​</a></h3><p>我们看下获取所有advisor的方法getAdvicesAndAdvisorsForBean</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>@Nullable</span></span>
<span class="line"><span>protected Object[] getAdvicesAndAdvisorsForBean(</span></span>
<span class="line"><span>    Class&lt;?&gt; beanClass, String beanName, @Nullable TargetSource targetSource) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  List&lt;Advisor&gt; advisors = findEligibleAdvisors(beanClass, beanName);</span></span>
<span class="line"><span>  if (advisors.isEmpty()) {</span></span>
<span class="line"><span>    return DO_NOT_PROXY;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return advisors.toArray();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过findEligibleAdvisors方法获取advisor， 如果获取不到返回DO_NOT_PROXY（不需要创建代理），findEligibleAdvisors方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Find all eligible Advisors for auto-proxying this class.</span></span>
<span class="line"><span>  * @param beanClass the clazz to find advisors for</span></span>
<span class="line"><span>  * @param beanName the name of the currently proxied bean</span></span>
<span class="line"><span>  * @return the empty List, not {@code null},</span></span>
<span class="line"><span>  * if there are no pointcuts or interceptors</span></span>
<span class="line"><span>  * @see #findCandidateAdvisors</span></span>
<span class="line"><span>  * @see #sortAdvisors</span></span>
<span class="line"><span>  * @see #extendAdvisors</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected List&lt;Advisor&gt; findEligibleAdvisors(Class&lt;?&gt; beanClass, String beanName) {</span></span>
<span class="line"><span>  // 和上文一样，获取所有切面类的切面方法生成Advisor</span></span>
<span class="line"><span>  List&lt;Advisor&gt; candidateAdvisors = findCandidateAdvisors();</span></span>
<span class="line"><span>  // 找到这些Advisor中能够应用于beanClass的Advisor</span></span>
<span class="line"><span>  List&lt;Advisor&gt; eligibleAdvisors = findAdvisorsThatCanApply(candidateAdvisors, beanClass, beanName);</span></span>
<span class="line"><span>  // 如果需要，交给子类拓展</span></span>
<span class="line"><span>  extendAdvisors(eligibleAdvisors);</span></span>
<span class="line"><span>  // 对Advisor排序</span></span>
<span class="line"><span>  if (!eligibleAdvisors.isEmpty()) {</span></span>
<span class="line"><span>    eligibleAdvisors = sortAdvisors(eligibleAdvisors);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return eligibleAdvisors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>获取所有切面类的切面方法生成Advisor</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Find all candidate Advisors to use in auto-proxying.</span></span>
<span class="line"><span>  * @return the List of candidate Advisors</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected List&lt;Advisor&gt; findCandidateAdvisors() {</span></span>
<span class="line"><span>  Assert.state(this.advisorRetrievalHelper != null, &quot;No BeanFactoryAdvisorRetrievalHelper available&quot;);</span></span>
<span class="line"><span>  return this.advisorRetrievalHelper.findAdvisorBeans();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>找到这些Advisor中能够应用于beanClass的Advisor</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Determine the sublist of the {@code candidateAdvisors} list</span></span>
<span class="line"><span>  * that is applicable to the given class.</span></span>
<span class="line"><span>  * @param candidateAdvisors the Advisors to evaluate</span></span>
<span class="line"><span>  * @param clazz the target class</span></span>
<span class="line"><span>  * @return sublist of Advisors that can apply to an object of the given class</span></span>
<span class="line"><span>  * (may be the incoming List as-is)</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public static List&lt;Advisor&gt; findAdvisorsThatCanApply(List&lt;Advisor&gt; candidateAdvisors, Class&lt;?&gt; clazz) {</span></span>
<span class="line"><span>  if (candidateAdvisors.isEmpty()) {</span></span>
<span class="line"><span>    return candidateAdvisors;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  List&lt;Advisor&gt; eligibleAdvisors = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>  for (Advisor candidate : candidateAdvisors) {</span></span>
<span class="line"><span>    // 通过Introduction实现的advice</span></span>
<span class="line"><span>    if (candidate instanceof IntroductionAdvisor &amp;&amp; canApply(candidate, clazz)) {</span></span>
<span class="line"><span>      eligibleAdvisors.add(candidate);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  boolean hasIntroductions = !eligibleAdvisors.isEmpty();</span></span>
<span class="line"><span>  for (Advisor candidate : candidateAdvisors) {</span></span>
<span class="line"><span>    if (candidate instanceof IntroductionAdvisor) {</span></span>
<span class="line"><span>      // already processed</span></span>
<span class="line"><span>      continue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 是否能够应用于clazz的Advice</span></span>
<span class="line"><span>    if (canApply(candidate, clazz, hasIntroductions)) {</span></span>
<span class="line"><span>      eligibleAdvisors.add(candidate);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return eligibleAdvisors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="创建代理的入口方法" tabindex="-1">创建代理的入口方法 <a class="header-anchor" href="#创建代理的入口方法" aria-label="Permalink to &quot;创建代理的入口方法&quot;">​</a></h3><p>获取所有advisor后，如果有advisor，则说明需要增强，即需要创建代理，创建代理的方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Create an AOP proxy for the given bean.</span></span>
<span class="line"><span>  * @param beanClass the class of the bean</span></span>
<span class="line"><span>  * @param beanName the name of the bean</span></span>
<span class="line"><span>  * @param specificInterceptors the set of interceptors that is</span></span>
<span class="line"><span>  * specific to this bean (may be empty, but not null)</span></span>
<span class="line"><span>  * @param targetSource the TargetSource for the proxy,</span></span>
<span class="line"><span>  * already pre-configured to access the bean</span></span>
<span class="line"><span>  * @return the AOP proxy for the bean</span></span>
<span class="line"><span>  * @see #buildAdvisors</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>protected Object createProxy(Class&lt;?&gt; beanClass, @Nullable String beanName,</span></span>
<span class="line"><span>    @Nullable Object[] specificInterceptors, TargetSource targetSource) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (this.beanFactory instanceof ConfigurableListableBeanFactory) {</span></span>
<span class="line"><span>    AutoProxyUtils.exposeTargetClass((ConfigurableListableBeanFactory) this.beanFactory, beanName, beanClass);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ProxyFactory proxyFactory = new ProxyFactory();</span></span>
<span class="line"><span>  proxyFactory.copyFrom(this);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (proxyFactory.isProxyTargetClass()) {</span></span>
<span class="line"><span>    // Explicit handling of JDK proxy targets (for introduction advice scenarios)</span></span>
<span class="line"><span>    if (Proxy.isProxyClass(beanClass)) {</span></span>
<span class="line"><span>      // Must allow for introductions; can&#39;t just set interfaces to the proxy&#39;s interfaces only.</span></span>
<span class="line"><span>      for (Class&lt;?&gt; ifc : beanClass.getInterfaces()) {</span></span>
<span class="line"><span>        proxyFactory.addInterface(ifc);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    // No proxyTargetClass flag enforced, let&#39;s apply our default checks...</span></span>
<span class="line"><span>    if (shouldProxyTargetClass(beanClass, beanName)) {</span></span>
<span class="line"><span>      proxyFactory.setProxyTargetClass(true);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      evaluateProxyInterfaces(beanClass, proxyFactory);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);</span></span>
<span class="line"><span>  proxyFactory.addAdvisors(advisors);</span></span>
<span class="line"><span>  proxyFactory.setTargetSource(targetSource);</span></span>
<span class="line"><span>  customizeProxyFactory(proxyFactory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  proxyFactory.setFrozen(this.freezeProxy);</span></span>
<span class="line"><span>  if (advisorsPreFiltered()) {</span></span>
<span class="line"><span>    proxyFactory.setPreFiltered(true);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Use original ClassLoader if bean class not locally loaded in overriding class loader</span></span>
<span class="line"><span>  ClassLoader classLoader = getProxyClassLoader();</span></span>
<span class="line"><span>  if (classLoader instanceof SmartClassLoader &amp;&amp; classLoader != beanClass.getClassLoader()) {</span></span>
<span class="line"><span>    classLoader = ((SmartClassLoader) classLoader).getOriginalClassLoader();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return proxyFactory.getProxy(classLoader);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>proxyFactory.getProxy(classLoader)</p><p><img src="`+a+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * Create a new proxy according to the settings in this factory.</span></span>
<span class="line"><span>  * &lt;p&gt;Can be called repeatedly. Effect will vary if we&#39;ve added</span></span>
<span class="line"><span>  * or removed interfaces. Can add and remove interceptors.</span></span>
<span class="line"><span>  * &lt;p&gt;Uses the given class loader (if necessary for proxy creation).</span></span>
<span class="line"><span>  * @param classLoader the class loader to create the proxy with</span></span>
<span class="line"><span>  * (or {@code null} for the low-level proxy facility&#39;s default)</span></span>
<span class="line"><span>  * @return the proxy object</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>public Object getProxy(@Nullable ClassLoader classLoader) {</span></span>
<span class="line"><span>  return createAopProxy().getProxy(classLoader);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="依据条件创建代理-jdk或cglib" tabindex="-1">依据条件创建代理(jdk或cglib) <a class="header-anchor" href="#依据条件创建代理-jdk或cglib" aria-label="Permalink to &quot;依据条件创建代理(jdk或cglib)&quot;">​</a></h3><p>DefaultAopProxyFactory.createAopProxy</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {</span></span>
<span class="line"><span>  if (!NativeDetector.inNativeImage() &amp;&amp;</span></span>
<span class="line"><span>      (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config))) {</span></span>
<span class="line"><span>    Class&lt;?&gt; targetClass = config.getTargetClass();</span></span>
<span class="line"><span>    if (targetClass == null) {</span></span>
<span class="line"><span>      throw new AopConfigException(&quot;TargetSource cannot determine target class: &quot; +</span></span>
<span class="line"><span>          &quot;Either an interface or a target is required for proxy creation.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {</span></span>
<span class="line"><span>      return new JdkDynamicAopProxy(config);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return new ObjenesisCglibAopProxy(config);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    return new JdkDynamicAopProxy(config);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>几个要点</p><ul><li>config.isOptimize() 是通过optimize设置，表示配置是自定义的，默认是false；</li><li>config.isProxyTargetClass()是通过<code>&lt;aop:config proxy-target-class=&quot;true&quot; /&gt;</code> 来配置的，表示优先使用cglib代理，默认是false；</li><li>hasNoUserSuppliedProxyInterfaces(config) 表示是否目标类实现了接口</li></ul><p>由此我们可以知道：</p><p>Spring默认在目标类实现接口时是通过JDK代理实现的，只有非接口的是通过Cglib代理实现的。当设置proxy-target-class为true时在目标类不是接口或者代理类时优先使用cglib代理实现。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,35)]))}const v=n(l,[["render",t]]);export{h as __pageData,v as default};
