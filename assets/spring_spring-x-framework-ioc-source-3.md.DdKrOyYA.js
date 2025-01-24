import{_ as a}from"./chunks/spring-framework-ioc-source-102.D7MFqtX8.js";import{_ as s,c as e,ai as p,o as t}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/spring/springframework/spring-framework-ioc-source-74.png",l="/vitepress-blog-template/images/spring/springframework/spring-framework-ioc-source-100.png",B=JSON.parse('{"title":"Spring进阶- Spring IOC实现原理详解之Bean实例化(生命周期,循环依赖等)","description":"","frontmatter":{},"headers":[],"relativePath":"spring/spring-x-framework-ioc-source-3.md","filePath":"spring/spring-x-framework-ioc-source-3.md","lastUpdated":1737706346000}'),o={name:"spring/spring-x-framework-ioc-source-3.md"};function r(c,n,g,b,u,d){return t(),e("div",null,n[0]||(n[0]=[p('<h1 id="spring进阶-spring-ioc实现原理详解之bean实例化-生命周期-循环依赖等" tabindex="-1">Spring进阶- Spring IOC实现原理详解之Bean实例化(生命周期,循环依赖等) <a class="header-anchor" href="#spring进阶-spring-ioc实现原理详解之bean实例化-生命周期-循环依赖等" aria-label="Permalink to &quot;Spring进阶- Spring IOC实现原理详解之Bean实例化(生命周期,循环依赖等)&quot;">​</a></h1><blockquote><p>上文，我们看了IOC设计要点和设计结构；以及Spring如何实现将资源配置（以xml配置为例）通过加载，解析，生成BeanDefination并注册到IoC容器中的；容器中存放的是Bean的定义即BeanDefinition放到beanDefinitionMap中，本质上是一个<code>ConcurrentHashMap&lt;String, Object&gt;</code>；并且BeanDefinition接口中包含了这个类的Class信息以及是否是单例等。那么如何从BeanDefinition中实例化Bean对象呢，这是本文主要研究的内容？@pdai</p></blockquote><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><blockquote><p>上文，我们看了IOC设计要点和设计结构；\b以及Spring如何实现将资源配置（以xml配置为例）通过加载，解析，生成BeanDefination并注册到IoC容器中的；容器中存放的是Bean的定义即BeanDefinition放到beanDefinitionMap中，本质上是一个<code>ConcurrentHashMap&lt;String, Object&gt;</code>；并且BeanDefinition接口中包含了这个类的Class信息以及是否是单例等。那么如何从BeanDefinition中实例化Bean对象呢？</p></blockquote><p>本文主要研究如何从IOC容器已有的BeanDefinition信息，实例化出Bean对象；这里还会包括三块重点内容：</p><ul><li>BeanFactory中getBean的主体思路</li><li>Spring如何解决循环依赖问题</li><li>Spring中Bean的生命周期</li></ul><p><img src="'+i+`" alt="error.图片加载失败"></p><h2 id="beanfactory中getbean的主体思路" tabindex="-1">BeanFactory中getBean的主体思路 <a class="header-anchor" href="#beanfactory中getbean的主体思路" aria-label="Permalink to &quot;BeanFactory中getBean的主体思路&quot;">​</a></h2><blockquote><p>上文中我们知道BeanFactory定义了Bean容器的规范，其中包含根据bean的名字, Class类型和参数等来得到bean实例。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 根据bean的名字和Class类型等来得到bean实例    </span></span>
<span class="line"><span>Object getBean(String name) throws BeansException;    </span></span>
<span class="line"><span>Object getBean(String name, Class requiredType) throws BeansException;    </span></span>
<span class="line"><span>Object getBean(String name, Object... args) throws BeansException;</span></span>
<span class="line"><span>&lt;T&gt; T getBean(Class&lt;T&gt; requiredType) throws BeansException;</span></span>
<span class="line"><span>&lt;T&gt; T getBean(Class&lt;T&gt; requiredType, Object... args) throws BeansException;</span></span></code></pre></div><h3 id="初步的思考" tabindex="-1">初步的思考 <a class="header-anchor" href="#初步的思考" aria-label="Permalink to &quot;初步的思考&quot;">​</a></h3><p>上文我们已经分析了IoC初始化的流程，最终的将Bean的定义即BeanDefinition放到beanDefinitionMap中，本质上是一个<code>ConcurrentHashMap&lt;String, Object&gt;</code>；并且BeanDefinition接口中包含了这个类的Class信息以及是否是单例等；</p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>这样我们初步有了实现<code>Object getBean(String name)</code>这个方法的思路：</p><ul><li>从beanDefinitionMap通过beanName获得BeanDefinition</li><li>从BeanDefinition中获得beanClassName</li><li>通过反射初始化beanClassName的实例instance <ul><li>构造函数从BeanDefinition的getConstructorArgumentValues()方法获取</li><li>属性值从BeanDefinition的getPropertyValues()方法获取</li></ul></li><li>返回beanName的实例instance</li></ul><p>由于BeanDefinition还有单例的信息，如果是无参构造函数的实例还可以放在一个缓存中，这样下次获取这个单例的实例时只需要从缓存中获取，如果获取不到再通过上述步骤获取。</p><p>（PS：如上只是我们初步的思路，而Spring还需要考虑各种设计上的问题，比如beanDefinition中其它定义，循环依赖等；所以我们来看下Spring是如何是如何实现的）</p><h3 id="spring中getbean的主体思路" tabindex="-1">Spring中getBean的主体思路 <a class="header-anchor" href="#spring中getbean的主体思路" aria-label="Permalink to &quot;Spring中getBean的主体思路&quot;">​</a></h3><p>BeanFactory实现getBean方法在AbstractBeanFactory中，这个方法重载都是调用doGetBean方法进行实现的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object getBean(String name) throws BeansException {</span></span>
<span class="line"><span>  return doGetBean(name, null, null, false);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public &lt;T&gt; T getBean(String name, Class&lt;T&gt; requiredType) throws BeansException {</span></span>
<span class="line"><span>  return doGetBean(name, requiredType, null, false);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public Object getBean(String name, Object... args) throws BeansException {</span></span>
<span class="line"><span>  return doGetBean(name, null, args, false);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public &lt;T&gt; T getBean(String name, @Nullable Class&lt;T&gt; requiredType, @Nullable Object... args)</span></span>
<span class="line"><span>    throws BeansException {</span></span>
<span class="line"><span>  return doGetBean(name, requiredType, args, false);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们来看下doGetBean方法(这个方法很长，我们主要看它的整体思路和设计要点）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 参数typeCheckOnly：bean实例是否包含一个类型检查</span></span>
<span class="line"><span>protected &lt;T&gt; T doGetBean(</span></span>
<span class="line"><span>			String name, @Nullable Class&lt;T&gt; requiredType, @Nullable Object[] args, boolean typeCheckOnly)</span></span>
<span class="line"><span>			throws BeansException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 解析bean的真正name，如果bean是工厂类，name前缀会加&amp;，需要去掉</span></span>
<span class="line"><span>  String beanName = transformedBeanName(name);</span></span>
<span class="line"><span>  Object beanInstance;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Eagerly check singleton cache for manually registered singletons.</span></span>
<span class="line"><span>  Object sharedInstance = getSingleton(beanName);</span></span>
<span class="line"><span>  if (sharedInstance != null &amp;&amp; args == null) {</span></span>
<span class="line"><span>    // 无参单例从缓存中获取</span></span>
<span class="line"><span>    beanInstance = getObjectForBeanInstance(sharedInstance, name, beanName, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    // 如果bean实例还在创建中，则直接抛出异常</span></span>
<span class="line"><span>    if (isPrototypeCurrentlyInCreation(beanName)) {</span></span>
<span class="line"><span>      throw new BeanCurrentlyInCreationException(beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果 bean definition 存在于父的bean工厂中，委派给父Bean工厂获取</span></span>
<span class="line"><span>    BeanFactory parentBeanFactory = getParentBeanFactory();</span></span>
<span class="line"><span>    if (parentBeanFactory != null &amp;&amp; !containsBeanDefinition(beanName)) {</span></span>
<span class="line"><span>      // Not found -&gt; check parent.</span></span>
<span class="line"><span>      String nameToLookup = originalBeanName(name);</span></span>
<span class="line"><span>      if (parentBeanFactory instanceof AbstractBeanFactory) {</span></span>
<span class="line"><span>        return ((AbstractBeanFactory) parentBeanFactory).doGetBean(</span></span>
<span class="line"><span>            nameToLookup, requiredType, args, typeCheckOnly);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else if (args != null) {</span></span>
<span class="line"><span>        // Delegation to parent with explicit args.</span></span>
<span class="line"><span>        return (T) parentBeanFactory.getBean(nameToLookup, args);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else if (requiredType != null) {</span></span>
<span class="line"><span>        // No args -&gt; delegate to standard getBean method.</span></span>
<span class="line"><span>        return parentBeanFactory.getBean(nameToLookup, requiredType);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>        return (T) parentBeanFactory.getBean(nameToLookup);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!typeCheckOnly) {</span></span>
<span class="line"><span>      // 将当前bean实例放入alreadyCreated集合里，标识这个bean准备创建了</span></span>
<span class="line"><span>      markBeanAsCreated(beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    StartupStep beanCreation = this.applicationStartup.start(&quot;spring.beans.instantiate&quot;)</span></span>
<span class="line"><span>        .tag(&quot;beanName&quot;, name);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      if (requiredType != null) {</span></span>
<span class="line"><span>        beanCreation.tag(&quot;beanType&quot;, requiredType::toString);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);</span></span>
<span class="line"><span>      checkMergedBeanDefinition(mbd, beanName, args);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 确保它的依赖也被初始化了.</span></span>
<span class="line"><span>      String[] dependsOn = mbd.getDependsOn();</span></span>
<span class="line"><span>      if (dependsOn != null) {</span></span>
<span class="line"><span>        for (String dep : dependsOn) {</span></span>
<span class="line"><span>          if (isDependent(beanName, dep)) {</span></span>
<span class="line"><span>            throw new BeanCreationException(mbd.getResourceDescription(), beanName,</span></span>
<span class="line"><span>                &quot;Circular depends-on relationship between &#39;&quot; + beanName + &quot;&#39; and &#39;&quot; + dep + &quot;&#39;&quot;);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          registerDependentBean(dep, beanName);</span></span>
<span class="line"><span>          try {</span></span>
<span class="line"><span>            getBean(dep); // 初始化它依赖的Bean</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          catch (NoSuchBeanDefinitionException ex) {</span></span>
<span class="line"><span>            throw new BeanCreationException(mbd.getResourceDescription(), beanName,</span></span>
<span class="line"><span>                &quot;&#39;&quot; + beanName + &quot;&#39; depends on missing bean &#39;&quot; + dep + &quot;&#39;&quot;, ex);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 创建Bean实例：单例</span></span>
<span class="line"><span>      if (mbd.isSingleton()) {</span></span>
<span class="line"><span>        sharedInstance = getSingleton(beanName, () -&gt; {</span></span>
<span class="line"><span>          try {</span></span>
<span class="line"><span>            // 真正创建bean的方法</span></span>
<span class="line"><span>            return createBean(beanName, mbd, args);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          catch (BeansException ex) {</span></span>
<span class="line"><span>            // Explicitly remove instance from singleton cache: It might have been put there</span></span>
<span class="line"><span>            // eagerly by the creation process, to allow for circular reference resolution.</span></span>
<span class="line"><span>            // Also remove any beans that received a temporary reference to the bean.</span></span>
<span class="line"><span>            destroySingleton(beanName);</span></span>
<span class="line"><span>            throw ex;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        beanInstance = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 创建Bean实例：原型</span></span>
<span class="line"><span>      else if (mbd.isPrototype()) {</span></span>
<span class="line"><span>        // It&#39;s a prototype -&gt; create a new instance.</span></span>
<span class="line"><span>        Object prototypeInstance = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          beforePrototypeCreation(beanName);</span></span>
<span class="line"><span>          prototypeInstance = createBean(beanName, mbd, args);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        finally {</span></span>
<span class="line"><span>          afterPrototypeCreation(beanName);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        beanInstance = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 创建Bean实例：根据bean的scope创建</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>        String scopeName = mbd.getScope();</span></span>
<span class="line"><span>        if (!StringUtils.hasLength(scopeName)) {</span></span>
<span class="line"><span>          throw new IllegalStateException(&quot;No scope name defined for bean ´&quot; + beanName + &quot;&#39;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Scope scope = this.scopes.get(scopeName);</span></span>
<span class="line"><span>        if (scope == null) {</span></span>
<span class="line"><span>          throw new IllegalStateException(&quot;No Scope registered for scope name &#39;&quot; + scopeName + &quot;&#39;&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          Object scopedInstance = scope.get(beanName, () -&gt; {</span></span>
<span class="line"><span>            beforePrototypeCreation(beanName);</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>              return createBean(beanName, mbd, args);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            finally {</span></span>
<span class="line"><span>              afterPrototypeCreation(beanName);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>          });</span></span>
<span class="line"><span>          beanInstance = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch (IllegalStateException ex) {</span></span>
<span class="line"><span>          throw new ScopeNotActiveException(beanName, scopeName, ex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (BeansException ex) {</span></span>
<span class="line"><span>      beanCreation.tag(&quot;exception&quot;, ex.getClass().toString());</span></span>
<span class="line"><span>      beanCreation.tag(&quot;message&quot;, String.valueOf(ex.getMessage()));</span></span>
<span class="line"><span>      cleanupAfterBeanCreationFailure(beanName);</span></span>
<span class="line"><span>      throw ex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    finally {</span></span>
<span class="line"><span>      beanCreation.end();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return adaptBeanInstance(name, beanInstance, requiredType);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码很长，主要看我加中文注释的方法即可。</p><ul><li>解析bean的真正name，如果bean是工厂类，name前缀会加&amp;，需要去掉</li><li>无参单例先从缓存中尝试获取</li><li>如果bean实例还在创建中，则直接抛出异常</li><li>如果bean definition 存在于父的bean工厂中，委派给父Bean工厂获取</li><li>标记这个beanName的实例正在创建</li><li>确保它的依赖也被初始化</li><li>真正创建 <ul><li>单例时</li><li>原型时</li><li>根据bean的scope创建</li></ul></li></ul><h2 id="重点-spring如何解决循环依赖问题" tabindex="-1">重点：Spring如何解决循环依赖问题 <a class="header-anchor" href="#重点-spring如何解决循环依赖问题" aria-label="Permalink to &quot;重点：Spring如何解决循环依赖问题&quot;">​</a></h2><blockquote><p>首先我们需要说明，Spring只是解决了单例模式下属性依赖的循环问题；Spring为了解决单例的循环依赖问题，使用了三级缓存。</p></blockquote><h3 id="spring单例模式下的属性依赖" tabindex="-1">Spring单例模式下的属性依赖 <a class="header-anchor" href="#spring单例模式下的属性依赖" aria-label="Permalink to &quot;Spring单例模式下的属性依赖&quot;">​</a></h3><p>先来看下这三级缓存</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** Cache of singleton objects: bean name --&gt; bean instance */</span></span>
<span class="line"><span>private final Map&lt;String, Object&gt; singletonObjects = new ConcurrentHashMap&lt;String, Object&gt;(256);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>/** Cache of early singleton objects: bean name --&gt; bean instance */</span></span>
<span class="line"><span>private final Map&lt;String, Object&gt; earlySingletonObjects = new HashMap&lt;String, Object&gt;(16);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/** Cache of singleton factories: bean name --&gt; ObjectFactory */</span></span>
<span class="line"><span>private final Map&lt;String, ObjectFactory&lt;?&gt;&gt; singletonFactories = new HashMap&lt;String, ObjectFactory&lt;?&gt;&gt;(16);</span></span></code></pre></div><ul><li><strong>第一层缓存（singletonObjects）</strong>：单例对象缓存池，已经实例化并且属性赋值，这里的对象是<strong>成熟对象</strong>；</li><li><strong>第二层缓存（earlySingletonObjects）</strong>：单例对象缓存池，已经实例化但尚未属性赋值，这里的对象是<strong>半成品对象</strong>；</li><li><strong>第三层缓存（singletonFactories）</strong>: 单例工厂的缓存</li></ul><p>如下是获取单例中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object getSingleton(String beanName, boolean allowEarlyReference) {</span></span>
<span class="line"><span>  // Spring首先从singletonObjects（一级缓存）中尝试获取</span></span>
<span class="line"><span>  Object singletonObject = this.singletonObjects.get(beanName);</span></span>
<span class="line"><span>  // 若是获取不到而且对象在建立中，则尝试从earlySingletonObjects(二级缓存)中获取</span></span>
<span class="line"><span>  if (singletonObject == null &amp;&amp; isSingletonCurrentlyInCreation(beanName)) {</span></span>
<span class="line"><span>    synchronized (this.singletonObjects) {</span></span>
<span class="line"><span>        singletonObject = this.earlySingletonObjects.get(beanName);</span></span>
<span class="line"><span>        if (singletonObject == null &amp;&amp; allowEarlyReference) {</span></span>
<span class="line"><span>          ObjectFactory&lt;?&gt; singletonFactory = this.singletonFactories.get(beanName);</span></span>
<span class="line"><span>          if (singletonFactory != null) {</span></span>
<span class="line"><span>            //若是仍是获取不到而且容许从singletonFactories经过getObject获取，则经过singletonFactory.getObject()(三级缓存)获取</span></span>
<span class="line"><span>              singletonObject = singletonFactory.getObject();</span></span>
<span class="line"><span>              //若是获取到了则将singletonObject放入到earlySingletonObjects,也就是将三级缓存提高到二级缓存中</span></span>
<span class="line"><span>              this.earlySingletonObjects.put(beanName, singletonObject);</span></span>
<span class="line"><span>              this.singletonFactories.remove(beanName);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return (singletonObject != NULL_OBJECT ? singletonObject : null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>补充一些方法和参数</p><ul><li><code>isSingletonCurrentlyInCreation()</code>：判断当前单例bean是否正在建立中，也就是没有初始化完成(好比A的构造器依赖了B对象因此得先去建立B对象， 或则在A的populateBean过程当中依赖了B对象，得先去建立B对象，这时的A就是处于建立中的状态。)</li><li><code>allowEarlyReference</code> ：是否容许从singletonFactories中经过getObject拿到对象</li></ul><p>分析getSingleton()的整个过程，Spring首先从一级缓存singletonObjects中获取。若是获取不到，而且对象正在建立中，就再从二级缓存earlySingletonObjects中获取。若是仍是获取不到且容许singletonFactories经过getObject()获取，就从三级缓存singletonFactory.getObject()(三级缓存)获取，若是获取到了则从三级缓存移动到了二级缓存。</p><p>从上面三级缓存的分析，咱们能够知道，Spring解决循环依赖的诀窍就在于singletonFactories这个三级cache。这个cache的类型是ObjectFactory，定义以下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ObjectFactory&lt;T&gt; {</span></span>
<span class="line"><span>    T getObject() throws BeansException;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在bean建立过程当中，有两处比较重要的匿名内部类实现了该接口。一处是Spring利用其建立bean的时候，另外一处就是:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>addSingletonFactory(beanName, new ObjectFactory&lt;Object&gt;() {</span></span>
<span class="line"><span>   @Override   public Object getObject() throws BeansException {</span></span>
<span class="line"><span>      return getEarlyBeanReference(beanName, mbd, bean);</span></span>
<span class="line"><span>   }});</span></span></code></pre></div><p>此处就是解决循环依赖的关键，这段代码发生在createBeanInstance以后，也就是说单例对象此时已经被建立出来的。这个对象已经被生产出来了，虽然还不完美（尚未进行初始化的第二步和第三步），可是已经能被人认出来了（根据对象引用能定位到堆中的对象），因此Spring此时将这个对象提早曝光出来让你们认识，让你们使用。</p><p>好比“A对象setter依赖B对象，B对象setter依赖A对象”，A首先完成了初始化的第一步，而且将本身提早曝光到singletonFactories中，此时进行初始化的第二步，发现本身依赖对象B，此时就尝试去get(B)，发现B尚未被create，因此走create流程，B在初始化第一步的时候发现本身依赖了对象A，因而尝试get(A)，尝试一级缓存singletonObjects(确定没有，由于A还没初始化彻底)，尝试二级缓存earlySingletonObjects（也没有），尝试三级缓存singletonFactories，因为A经过ObjectFactory将本身提早曝光了，因此B可以经过ObjectFactory.getObject拿到A对象(半成品)，B拿到A对象后顺利完成了初始化阶段一、二、三，彻底初始化以后将本身放入到一级缓存singletonObjects中。此时返回A中，A此时能拿到B的对象顺利完成本身的初始化阶段二、三，最终A也完成了初始化，进去了一级缓存singletonObjects中，并且更加幸运的是，因为B拿到了A的对象引用，因此B如今hold住的A对象完成了初始化。</p><h3 id="spring为何不能解决非单例属性之外的循环依赖" tabindex="-1">Spring为何不能解决非单例属性之外的循环依赖？ <a class="header-anchor" href="#spring为何不能解决非单例属性之外的循环依赖" aria-label="Permalink to &quot;Spring为何不能解决非单例属性之外的循环依赖？&quot;">​</a></h3><blockquote><p>通过以下几个问题，辅助我们进一步理解。</p></blockquote><h4 id="spring为什么不能解决构造器的循环依赖" tabindex="-1">Spring为什么不能解决构造器的循环依赖？ <a class="header-anchor" href="#spring为什么不能解决构造器的循环依赖" aria-label="Permalink to &quot;Spring为什么不能解决构造器的循环依赖？&quot;">​</a></h4><p>构造器注入形成的循环依赖： 也就是beanB需要在beanA的构造函数中完成初始化，beanA也需要在beanB的构造函数中完成初始化，这种情况的结果就是两个bean都不能完成初始化，循环依赖难以解决。</p><p>Spring解决循环依赖主要是依赖三级缓存，但是的<strong>在调用构造方法之前还未将其放入三级缓存之中</strong>，因此后续的依赖调用构造方法的时候并不能从三级缓存中获取到依赖的Bean，因此不能解决。</p><h4 id="spring为什么不能解决prototype作用域循环依赖" tabindex="-1">Spring为什么不能解决prototype作用域循环依赖？ <a class="header-anchor" href="#spring为什么不能解决prototype作用域循环依赖" aria-label="Permalink to &quot;Spring为什么不能解决prototype作用域循环依赖？&quot;">​</a></h4><p>这种循环依赖同样无法解决，因为spring不会缓存‘prototype’作用域的bean，而spring中循环依赖的解决正是通过缓存来实现的。</p><h4 id="spring为什么不能解决多例的循环依赖" tabindex="-1">Spring为什么不能解决多例的循环依赖？ <a class="header-anchor" href="#spring为什么不能解决多例的循环依赖" aria-label="Permalink to &quot;Spring为什么不能解决多例的循环依赖？&quot;">​</a></h4><p>多实例Bean是每次调用一次getBean都会执行一次构造方法并且给属性赋值，根本没有三级缓存，因此不能解决循环依赖。</p><h3 id="那么其它循环依赖如何解决" tabindex="-1">那么其它循环依赖如何解决？ <a class="header-anchor" href="#那么其它循环依赖如何解决" aria-label="Permalink to &quot;那么其它循环依赖如何解决？&quot;">​</a></h3><blockquote><p>那么实际开发中，类似的依赖是如何解决？</p></blockquote><ul><li><strong>生成代理对象产生的循环依赖</strong></li></ul><p>这类循环依赖问题解决方法很多，主要有：</p><ol><li>使用@Lazy注解，延迟加载</li><li>使用@DependsOn注解，指定加载先后关系</li><li>修改文件名称，改变循环依赖类的加载顺序</li></ol><ul><li><strong>使用@DependsOn产生的循环依赖</strong></li></ul><p>这类循环依赖问题要找到@DependsOn注解循环依赖的地方，迫使它不循环依赖就可以解决问题。</p><ul><li><strong>多例循环依赖</strong></li></ul><p>这类循环依赖问题可以通过把bean改成单例的解决。</p><ul><li><strong>构造器循环依赖</strong></li></ul><p>这类循环依赖问题可以通过使用@Lazy注解解决。</p><h2 id="重点-spring中bean的生命周期" tabindex="-1">重点：Spring中Bean的生命周期 <a class="header-anchor" href="#重点-spring中bean的生命周期" aria-label="Permalink to &quot;重点：Spring中Bean的生命周期&quot;">​</a></h2><blockquote><p>Spring 只帮我们管理单例模式 Bean 的<strong>完整</strong>生命周期，对于 prototype 的 bean ，Spring 在创建好交给使用者之后则不会再管理后续的生命周期。</p></blockquote><p>Spring 容器可以管理 singleton 作用域 Bean 的生命周期，在此作用域下，Spring 能够精确地知道该 Bean 何时被创建，何时初始化完成，以及何时被销毁。</p><p>而对于 prototype 作用域的 Bean，Spring 只负责创建，当容器创建了 Bean 的实例后，Bean 的实例就交给客户端代码管理，Spring 容器将不再跟踪其生命周期。每次客户端请求 prototype 作用域的 Bean 时，Spring 容器都会创建一个新的实例，并且不会管那些被配置成 prototype 作用域的 Bean 的生命周期。</p><p>了解 Spring 生命周期的意义就在于，<strong>可以利用 Bean 在其存活期间的指定时刻完成一些相关操作</strong>。这种时刻可能有很多，但一般情况下，会在 Bean 被初始化后和被销毁前执行一些相关操作。</p><h3 id="spring-bean生命周期流程" tabindex="-1">Spring Bean生命周期流程 <a class="header-anchor" href="#spring-bean生命周期流程" aria-label="Permalink to &quot;Spring Bean生命周期流程&quot;">​</a></h3><blockquote><p>在 Spring 中，Bean 的生命周期是一个很复杂的执行过程，我们可以利用 Spring 提供的方法定制 Bean 的创建过程。</p></blockquote><p><strong>Spring 容器中 Bean 的生命周期流程</strong></p><p><img src="`+a+`" alt="error.图片加载失败"></p><ul><li>如果 BeanFactoryPostProcessor 和 Bean 关联, 则调用postProcessBeanFactory方法.(即首<strong>先尝试从Bean工厂中获取Bean</strong>)</li><li>如果 InstantiationAwareBeanPostProcessor 和 Bean 关联，则调用postProcessBeforeInstantiation方法</li><li>根据配置情况调用 Bean 构造方法<strong>实例化 Bean</strong>。</li><li>利用依赖注入完成 Bean 中所有<strong>属性值的配置注入</strong>。</li><li>如果 InstantiationAwareBeanPostProcessor 和 Bean 关联，则调用postProcessAfterInstantiation方法和postProcessProperties</li><li><strong>调用xxxAware接口</strong> (上图只是给了几个例子) <ul><li><strong>第一类Aware接口</strong><ul><li>如果 Bean 实现了 BeanNameAware 接口，则 Spring 调用 Bean 的 setBeanName() 方法传入当前 Bean 的 id 值。</li><li>如果 Bean 实现了 BeanClassLoaderAware 接口，则 Spring 调用 setBeanClassLoader() 方法传入classLoader的引用。</li><li>如果 Bean 实现了 BeanFactoryAware 接口，则 Spring 调用 setBeanFactory() 方法传入当前工厂实例的引用。</li></ul></li><li><strong>第二类Aware接口</strong><ul><li>如果 Bean 实现了 EnvironmentAware 接口，则 Spring 调用 setEnvironment() 方法传入当前 Environment 实例的引用。</li><li>如果 Bean 实现了 EmbeddedValueResolverAware 接口，则 Spring 调用 setEmbeddedValueResolver() 方法传入当前 StringValueResolver 实例的引用。</li><li>如果 Bean 实现了 ApplicationContextAware 接口，则 Spring 调用 setApplicationContext() 方法传入当前 ApplicationContext 实例的引用。</li><li>...</li></ul></li></ul></li><li>如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用该接口的预初始化方法 postProcessBeforeInitialzation() 对 Bean 进行加工操作，此处非常重要，Spring 的 AOP 就是利用它实现的。</li><li>如果 Bean 实现了 InitializingBean 接口，则 Spring 将调用 afterPropertiesSet() 方法。(或者有执行@PostConstruct注解的方法)</li><li>如果在配置文件中通过 <strong>init-method</strong> 属性指定了初始化方法，则调用该初始化方法。</li><li>如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用该接口的初始化方法 postProcessAfterInitialization()。此时，Bean 已经可以被应用系统使用了。</li><li>如果在 <code>&lt;bean&gt;</code> 中指定了该 Bean 的作用范围为 scope=&quot;singleton&quot;，则将该 Bean 放入 Spring IoC 的缓存池中，将触发 Spring 对该 Bean 的生命周期管理；如果在 <code>&lt;bean&gt;</code> 中指定了该 Bean 的作用范围为 scope=&quot;prototype&quot;，则将该 Bean 交给调用者，调用者管理该 Bean 的生命周期，Spring 不再管理该 Bean。</li><li>如果 Bean 实现了 DisposableBean 接口，则 Spring 会调用 destory() 方法将 Spring 中的 Bean 销毁；(或者有执行@PreDestroy注解的方法)</li><li>如果在配置文件中通过 <strong>destory-method</strong> 属性指定了 Bean 的销毁方法，则 Spring 将调用该方法对 Bean 进行销毁。</li></ul><p><strong>Bean的完整生命周期经历了各种方法调用，这些方法可以划分为以下几类</strong>：(结合上图，需要有如下顶层思维)</p><ul><li><strong>Bean自身的方法</strong>： 这个包括了Bean本身调用的方法和通过配置文件中<code>&lt;bean&gt;</code>的init-method和destroy-method指定的方法</li><li><strong>Bean级生命周期接口方法</strong>： 这个包括了BeanNameAware、BeanFactoryAware、ApplicationContextAware；当然也包括InitializingBean和DiposableBean这些接口的方法（可以被@PostConstruct和@PreDestroy注解替代)</li><li><strong>容器级生命周期接口方法</strong>： 这个包括了InstantiationAwareBeanPostProcessor 和 BeanPostProcessor 这两个接口实现，一般称它们的实现类为“后处理器”。</li><li><strong>工厂后处理器接口方法</strong>： 这个包括了AspectJWeavingEnabler, ConfigurationClassPostProcessor, CustomAutowireConfigurer等等非常有用的工厂后处理器接口的方法。工厂后处理器也是容器级的。在应用上下文装配配置文件之后立即调用。</li></ul><h3 id="spring-bean生命周期案例" tabindex="-1">Spring Bean生命周期案例 <a class="header-anchor" href="#spring-bean生命周期案例" aria-label="Permalink to &quot;Spring Bean生命周期案例&quot;">​</a></h3><blockquote><p>我们通过一个例子来验证上面的整个流程</p></blockquote><p>定义Bean（这里是User）, 并让它实现BeanNameAware,BeanFactoryAware,ApplicationContextAware接口和InitializingBean,DisposableBean接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springframework.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import lombok.ToString;</span></span>
<span class="line"><span>import lombok.extern.slf4j.Slf4j;</span></span>
<span class="line"><span>import org.springframework.beans.BeansException;</span></span>
<span class="line"><span>import org.springframework.beans.factory.BeanFactory;</span></span>
<span class="line"><span>import org.springframework.beans.factory.BeanFactoryAware;</span></span>
<span class="line"><span>import org.springframework.beans.factory.BeanNameAware;</span></span>
<span class="line"><span>import org.springframework.beans.factory.DisposableBean;</span></span>
<span class="line"><span>import org.springframework.beans.factory.InitializingBean;</span></span>
<span class="line"><span>import org.springframework.context.ApplicationContext;</span></span>
<span class="line"><span>import org.springframework.context.ApplicationContextAware;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@ToString</span></span>
<span class="line"><span>public class User implements BeanFactoryAware, BeanNameAware, ApplicationContextAware,</span></span>
<span class="line"><span>        InitializingBean, DisposableBean {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user&#39;s name.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user&#39;s age.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * bean factory.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private BeanFactory beanFactory;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * application context.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private ApplicationContext applicationContext;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * bean name.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private String beanName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public User() {</span></span>
<span class="line"><span>        log.info(&quot;execute User#new User()&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setName(String name) {</span></span>
<span class="line"><span>        log.info(&quot;execute User#setName({})&quot;, name);</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setAge(int age) {</span></span>
<span class="line"><span>        log.info(&quot;execute User#setAge({})&quot;, age);</span></span>
<span class="line"><span>        this.age = age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute BeanFactoryAware#setBeanFactory&quot;);</span></span>
<span class="line"><span>        this.beanFactory = beanFactory;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setBeanName(String s) {</span></span>
<span class="line"><span>        log.info(&quot;execute BeanNameAware#setBeanName&quot;);</span></span>
<span class="line"><span>        this.beanName = s;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute ApplicationContextAware#setApplicationContext&quot;);</span></span>
<span class="line"><span>        this.applicationContext = applicationContext;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void destroy() throws Exception {</span></span>
<span class="line"><span>        log.info(&quot;execute DisposableBean#destroy&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void afterPropertiesSet() throws Exception {</span></span>
<span class="line"><span>        log.info(&quot;execute InitializingBean#afterPropertiesSet&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void doInit() {</span></span>
<span class="line"><span>        log.info(&quot;execute User#doInit&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void doDestroy() {</span></span>
<span class="line"><span>        log.info(&quot;execute User#doDestroy&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>定义BeanFactoryPostProcessor的实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute BeanFactoryPostProcessor#postProcessBeanFactory&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>定义InstantiationAwareBeanPostProcessor的实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class MyInstantiationAwareBeanPostProcessor implements InstantiationAwareBeanPostProcessor {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object postProcessBeforeInstantiation(Class&lt;?&gt; beanClass, String beanName) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation for {}&quot;, beanName);</span></span>
<span class="line"><span>        return InstantiationAwareBeanPostProcessor.super.postProcessBeforeInstantiation(beanClass, beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute InstantiationAwareBeanPostProcessor#postProcessAfterInstantiation for {}&quot;, beanName);</span></span>
<span class="line"><span>        return InstantiationAwareBeanPostProcessor.super.postProcessAfterInstantiation(bean, beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute InstantiationAwareBeanPostProcessor#postProcessProperties for {}&quot;, beanName);</span></span>
<span class="line"><span>        return InstantiationAwareBeanPostProcessor.super.postProcessProperties(pvs, bean, beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>定义BeanPostProcessor的实现类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class MyBeanPostProcessor implements BeanPostProcessor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute BeanPostProcessor#postProcessBeforeInitialization for {}&quot;, beanName);</span></span>
<span class="line"><span>        return BeanPostProcessor.super.postProcessBeforeInitialization(bean, beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {</span></span>
<span class="line"><span>        log.info(&quot;execute BeanPostProcessor#postProcessAfterInitialization for {}&quot;, beanName);</span></span>
<span class="line"><span>        return BeanPostProcessor.super.postProcessAfterInitialization(bean, beanName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过Java配置方式初始化Bean</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>public class BeansConfig {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Bean(name = &quot;user&quot;, initMethod = &quot;doInit&quot;, destroyMethod = &quot;doDestroy&quot;)</span></span>
<span class="line"><span>    public User create() {</span></span>
<span class="line"><span>        User user = new User();</span></span>
<span class="line"><span>        user.setName(&quot;pdai&quot;);</span></span>
<span class="line"><span>        user.setAge(18);</span></span>
<span class="line"><span>        return user;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试的主方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Cglib proxy demo.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class App {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * main interface.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param args args</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        log.info(&quot;Init application context&quot;);</span></span>
<span class="line"><span>        // create and configure beans</span></span>
<span class="line"><span>        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(</span></span>
<span class="line"><span>                &quot;tech.pdai.springframework&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // retrieve configured instance</span></span>
<span class="line"><span>        User user = (User) context.getBean(&quot;user&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // print info from beans</span></span>
<span class="line"><span>        log.info(user.toString());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        log.info(&quot;Shutdown application context&quot;);</span></span>
<span class="line"><span>        context.registerShutdownHook();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果（剔除无关输出）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>12:44:42.547 [main] INFO tech.pdai.springframework.App - Init application context</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>12:44:43.134 [main] INFO tech.pdai.springframework.processor.MyBeanFactoryPostProcessor - execute BeanFactoryPostProcessor#postProcessBeanFactory</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>12:44:43.216 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean &#39;user&#39;</span></span>
<span class="line"><span>12:44:43.216 [main] INFO tech.pdai.springframework.processor.MyInstantiationAwareBeanPostProcessor - execute InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation for user</span></span>
<span class="line"><span>12:44:43.236 [main] INFO tech.pdai.springframework.entity.User - execute User#new User()</span></span>
<span class="line"><span>12:44:43.237 [main] INFO tech.pdai.springframework.entity.User - execute User#setName(pdai)</span></span>
<span class="line"><span>12:44:43.237 [main] INFO tech.pdai.springframework.entity.User - execute User#setAge(18)</span></span>
<span class="line"><span>12:44:43.237 [main] INFO tech.pdai.springframework.processor.MyInstantiationAwareBeanPostProcessor - execute InstantiationAwareBeanPostProcessor#postProcessAfterInstantiation for user</span></span>
<span class="line"><span>12:44:43.237 [main] INFO tech.pdai.springframework.processor.MyInstantiationAwareBeanPostProcessor - execute InstantiationAwareBeanPostProcessor#postProcessProperties for user</span></span>
<span class="line"><span>12:44:43.242 [main] INFO tech.pdai.springframework.entity.User - execute BeanNameAware#setBeanName</span></span>
<span class="line"><span>12:44:43.242 [main] INFO tech.pdai.springframework.entity.User - execute BeanFactoryAware#setBeanFactory</span></span>
<span class="line"><span>12:44:43.242 [main] INFO tech.pdai.springframework.entity.User - execute ApplicationContextAware#setApplicationContext</span></span>
<span class="line"><span>12:44:43.242 [main] INFO tech.pdai.springframework.processor.MyBeanPostProcessor - execute BeanPostProcessor#postProcessBeforeInitialization for user</span></span>
<span class="line"><span>12:44:43.242 [main] INFO tech.pdai.springframework.entity.User - execute InitializingBean#afterPropertiesSet</span></span>
<span class="line"><span>12:44:43.243 [main] INFO tech.pdai.springframework.entity.User - execute User#doInit</span></span>
<span class="line"><span>12:44:43.243 [main] INFO tech.pdai.springframework.processor.MyBeanPostProcessor - execute BeanPostProcessor#postProcessAfterInitialization for user</span></span>
<span class="line"><span>12:44:43.270 [main] INFO tech.pdai.springframework.App - User(name=pdai, age=18)</span></span>
<span class="line"><span>12:44:43.270 [main] INFO tech.pdai.springframework.App - Shutdown application context</span></span>
<span class="line"><span>12:44:43.276 [SpringContextShutdownHook] INFO tech.pdai.springframework.entity.User - execute DisposableBean#destroy</span></span>
<span class="line"><span>12:44:43.276 [SpringContextShutdownHook] INFO tech.pdai.springframework.entity.User - execute User#doDestroy</span></span></code></pre></div><h3 id="spring-bean生命周期源码" tabindex="-1">Spring Bean生命周期源码 <a class="header-anchor" href="#spring-bean生命周期源码" aria-label="Permalink to &quot;Spring Bean生命周期源码&quot;">​</a></h3><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://juejin.cn/post/6844903843596107790" target="_blank" rel="noreferrer">https://juejin.cn/post/6844903843596107790</a></p><p><a href="https://www.zhihu.com/question/438247718/answer/1730527725" target="_blank" rel="noreferrer">https://www.zhihu.com/question/438247718/answer/1730527725</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,94)]))}const f=s(o,[["render",r]]);export{B as __pageData,f as default};
