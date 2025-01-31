import{_ as a,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const d=JSON.parse('{"title":"MyBatis详解 - 插件机制","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-plugin.md","filePath":"framework/orm-mybatis/mybatis-y-plugin.md","lastUpdated":1737706346000}'),t={name:"framework/orm-mybatis/mybatis-y-plugin.md"};function l(i,n,c,r,o,g){return e(),s("div",null,n[0]||(n[0]=[p(`<h1 id="mybatis详解-插件机制" tabindex="-1">MyBatis详解 - 插件机制 <a class="header-anchor" href="#mybatis详解-插件机制" aria-label="Permalink to &quot;MyBatis详解 - 插件机制&quot;">​</a></h1><blockquote><p>MyBatis提供了一种插件(plugin)的功能，虽然叫做插件，但其实这是拦截器功能。那么拦截器拦截MyBatis中的哪些内容呢？@pdai</p></blockquote><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p>MyBatis 允许你在已映射语句执行过程中的某一点进行拦截调用。默认情况下，MyBatis允许使用插件来拦截的方法调用包括：</p><ul><li>Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed) 拦截执行器的方法</li><li>ParameterHandler (getParameterObject, setParameters) 拦截参数的处理</li><li>ResultSetHandler (handleResultSets, handleOutputParameters) 拦截结果集的处理</li><li>StatementHandler (prepare, parameterize, batch, update, query) 拦截Sql语法构建的处理</li></ul><p>Mybatis采用责任链模式，通过动态代理组织多个拦截器（插件），通过这些拦截器可以改变Mybatis的默认行为（诸如SQL重写之类的），由于插件会深入到Mybatis的核心，因此在编写自己的插件前最好了解下它的原理，以便写出安全高效的插件。</p><h2 id="拦截器的使用" tabindex="-1">拦截器的使用 <a class="header-anchor" href="#拦截器的使用" aria-label="Permalink to &quot;拦截器的使用&quot;">​</a></h2><h3 id="拦截器介绍及配置" tabindex="-1">拦截器介绍及配置 <a class="header-anchor" href="#拦截器介绍及配置" aria-label="Permalink to &quot;拦截器介绍及配置&quot;">​</a></h3><p>首先我们看下MyBatis拦截器的接口定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Interceptor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Object intercept(Invocation invocation) throws Throwable;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Object plugin(Object target);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void setProperties(Properties properties);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>比较简单，只有3个方法。 MyBatis默认没有一个拦截器接口的实现类，开发者们可以实现符合自己需求的拦截器。下面的MyBatis官网的一个拦截器实例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Intercepts({@Signature(type= Executor.class, method = &quot;update&quot;, args = {MappedStatement.class,Object.class})})</span></span>
<span class="line"><span>public class ExamplePlugin implements Interceptor {</span></span>
<span class="line"><span>  public Object intercept(Invocation invocation) throws Throwable {</span></span>
<span class="line"><span>    return invocation.proceed();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public Object plugin(Object target) {</span></span>
<span class="line"><span>    return Plugin.wrap(target, this);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public void setProperties(Properties properties) {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>全局xml配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;plugins&gt;</span></span>
<span class="line"><span>    &lt;plugin interceptor=&quot;org.format.mybatis.cache.interceptor.ExamplePlugin&quot;&gt;&lt;/plugin&gt;</span></span>
<span class="line"><span>&lt;/plugins&gt;</span></span></code></pre></div><p>这个拦截器拦截Executor接口的update方法（其实也就是SqlSession的新增，删除，修改操作），所有执行executor的update方法都会被该拦截器拦截到。</p><h3 id="源码分析" tabindex="-1">源码分析 <a class="header-anchor" href="#源码分析" aria-label="Permalink to &quot;源码分析&quot;">​</a></h3><p>首先从源头-&gt;配置文件开始分析：</p><p>XMLConfigBuilder解析MyBatis全局配置文件的pluginElement私有方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void pluginElement(XNode parent) throws Exception {</span></span>
<span class="line"><span>    if (parent != null) {</span></span>
<span class="line"><span>        for (XNode child : parent.getChildren()) {</span></span>
<span class="line"><span>            String interceptor = child.getStringAttribute(&quot;interceptor&quot;);</span></span>
<span class="line"><span>            Properties properties = child.getChildrenAsProperties();</span></span>
<span class="line"><span>            Interceptor interceptorInstance = (Interceptor) resolveClass(interceptor).newInstance();</span></span>
<span class="line"><span>            interceptorInstance.setProperties(properties);</span></span>
<span class="line"><span>            configuration.addInterceptor(interceptorInstance);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>具体的解析代码其实比较简单，就不贴了，主要就是通过反射实例化plugin节点中的interceptor属性表示的类。然后调用全局配置类Configuration的addInterceptor方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void addInterceptor(Interceptor interceptor) {</span></span>
<span class="line"><span>    interceptorChain.addInterceptor(interceptor);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个interceptorChain是Configuration的内部属性，类型为InterceptorChain，也就是一个拦截器链，我们来看下它的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InterceptorChain {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final List&lt;Interceptor&gt; interceptors = new ArrayList&lt;Interceptor&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object pluginAll(Object target) {</span></span>
<span class="line"><span>        for (Interceptor interceptor : interceptors) {</span></span>
<span class="line"><span>            target = interceptor.plugin(target);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return target;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void addInterceptor(Interceptor interceptor) {</span></span>
<span class="line"><span>        interceptors.add(interceptor);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public List&lt;Interceptor&gt; getInterceptors() {</span></span>
<span class="line"><span>        return Collections.unmodifiableList(interceptors);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在我们理解了拦截器配置的解析以及拦截器的归属，现在我们回过头看下为何拦截器会拦截这些方法（Executor，ParameterHandler，ResultSetHandler，StatementHandler的部分方法）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ParameterHandler newParameterHandler(MappedStatement mappedStatement, Object parameterObject, BoundSql boundSql) {</span></span>
<span class="line"><span>    ParameterHandler parameterHandler = mappedStatement.getLang().createParameterHandler(mappedStatement, parameterObject, boundSql);</span></span>
<span class="line"><span>    parameterHandler = (ParameterHandler) interceptorChain.pluginAll(parameterHandler);</span></span>
<span class="line"><span>    return parameterHandler;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public ResultSetHandler newResultSetHandler(Executor executor, MappedStatement mappedStatement, RowBounds rowBounds, ParameterHandler parameterHandler, ResultHandler resultHandler, BoundSql boundSql) {</span></span>
<span class="line"><span>    ResultSetHandler resultSetHandler = new DefaultResultSetHandler(executor, mappedStatement, parameterHandler, resultHandler, boundSql, rowBounds);</span></span>
<span class="line"><span>    resultSetHandler = (ResultSetHandler) interceptorChain.pluginAll(resultSetHandler);</span></span>
<span class="line"><span>    return resultSetHandler;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public StatementHandler newStatementHandler(Executor executor, MappedStatement mappedStatement, Object parameterObject, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) {</span></span>
<span class="line"><span>    StatementHandler statementHandler = new RoutingStatementHandler(executor, mappedStatement, parameterObject, rowBounds, resultHandler, boundSql);</span></span>
<span class="line"><span>    statementHandler = (StatementHandler) interceptorChain.pluginAll(statementHandler);</span></span>
<span class="line"><span>    return statementHandler;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Executor newExecutor(Transaction transaction, ExecutorType executorType, boolean autoCommit) {</span></span>
<span class="line"><span>    executorType = executorType == null ? defaultExecutorType : executorType;</span></span>
<span class="line"><span>    executorType = executorType == null ? ExecutorType.SIMPLE : executorType;</span></span>
<span class="line"><span>    Executor executor;</span></span>
<span class="line"><span>    if (ExecutorType.BATCH == executorType) {</span></span>
<span class="line"><span>        executor = new BatchExecutor(this, transaction);</span></span>
<span class="line"><span>    } else if (ExecutorType.REUSE == executorType) {</span></span>
<span class="line"><span>        executor = new ReuseExecutor(this, transaction);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        executor = new SimpleExecutor(this, transaction);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (cacheEnabled) {</span></span>
<span class="line"><span>        executor = new CachingExecutor(executor, autoCommit);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    executor = (Executor) interceptorChain.pluginAll(executor);</span></span>
<span class="line"><span>    return executor;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上4个方法都是Configuration的方法。这些方法在MyBatis的一个操作(新增，删除，修改，查询)中都会被执行到，执行的先后顺序是Executor，ParameterHandler，ResultSetHandler，StatementHandler(其中ParameterHandler和ResultSetHandler的创建是在创建StatementHandler[3个可用的实现类CallableStatementHandler,PreparedStatementHandler,SimpleStatementHandler]的时候，其构造函数调用的[这3个实现类的构造函数其实都调用了父类BaseStatementHandler的构造函数])。</p><p>这4个方法实例化了对应的对象之后，都会调用interceptorChain的pluginAll方法，InterceptorChain的pluginAll刚才已经介绍过了，就是遍历所有的拦截器，然后调用各个拦截器的plugin方法。注意：拦截器的plugin方法的返回值会直接被赋值给原先的对象。</p><p>由于可以拦截StatementHandler，这个接口主要处理sql语法的构建，因此比如分页的功能，可以用拦截器实现，只需要在拦截器的plugin方法中处理StatementHandler接口实现类中的sql即可，可使用反射实现。</p><p>MyBatis还提供了@Intercepts和 @Signature关于拦截器的注解。官网的例子就是使用了这2个注解，还包括了Plugin类的使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Object plugin(Object target) {</span></span>
<span class="line"><span>    return Plugin.wrap(target, this);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="代理链的生成" tabindex="-1">代理链的生成 <a class="header-anchor" href="#代理链的生成" aria-label="Permalink to &quot;代理链的生成&quot;">​</a></h2><blockquote><p>Mybatis支持对Executor、StatementHandler、ParameterHandler和ResultSetHandler进行拦截，也就是说会对这4种对象进行代理。通过查看Configuration类的源代码我们可以看到，每次都对目标对象进行代理链的生成。</p></blockquote><p>下面以Executor为例。Mybatis在创建Executor对象时会执行下面一行代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>executor =(Executor) interceptorChain.pluginAll(executor);</span></span></code></pre></div><p>InterceptorChain里保存了所有的拦截器，它在mybatis初始化的时候创建。上面这句代码的含义是调用拦截器链里的每个拦截器依次对executor进行plugin（插入？）代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> /** </span></span>
<span class="line"><span>  * 每一个拦截器对目标类都进行一次代理 </span></span>
<span class="line"><span>  * @param target </span></span>
<span class="line"><span>  * @return 层层代理后的对象 </span></span>
<span class="line"><span>  */  </span></span>
<span class="line"><span> public Object pluginAll(Object target) {  </span></span>
<span class="line"><span>     for(Interceptor interceptor : interceptors) {  </span></span>
<span class="line"><span>         target= interceptor.plugin(target);  </span></span>
<span class="line"><span>     }  </span></span>
<span class="line"><span>     return target;  </span></span>
<span class="line"><span> }</span></span></code></pre></div><p>下面以一个简单的例子来看看这个plugin方法里到底发生了什么：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Intercepts({@Signature(type = Executor.class, method =&quot;update&quot;, args = {MappedStatement.class, Object.class})})  </span></span>
<span class="line"><span>public class ExamplePlugin implements Interceptor {  </span></span>
<span class="line"><span>    @Override  </span></span>
<span class="line"><span>    public Object intercept(Invocation invocation) throws Throwable {  </span></span>
<span class="line"><span>        return invocation.proceed();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    @Override  </span></span>
<span class="line"><span>    public Object plugin(Object target) {  </span></span>
<span class="line"><span>        return Plugin.wrap(target, this);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    @Override  </span></span>
<span class="line"><span>    public void setProperties(Properties properties) {  </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>每一个拦截器都必须实现上面的三个方法</strong>，其中：</p><ul><li><p><code>Object intercept(Invocation invocation)</code>是实现拦截逻辑的地方，内部要通过invocation.proceed()显式地推进责任链前进，也就是调用下一个拦截器拦截目标方法。</p></li><li><p><code>Object plugin(Object target)</code> 就是用当前这个拦截器生成对目标target的代理，实际是通过Plugin.wrap(target,this)来完成的，把目标target和拦截器this传给了包装函数。</p></li><li><p><code>setProperties(Properties properties)</code>用于设置额外的参数，参数配置在拦截器的Properties节点里。</p></li></ul><blockquote><p>注解里描述的是指定拦截方法的签名 [type,method,args] （即对哪种对象的哪种方法进行拦截），它在拦截前用于决断。</p></blockquote><p>定义自己的Interceptor最重要的是要实现plugin方法和intercept方法，在plugin方法中我们可以决定是否要进行拦截进而决定要返回一个什么样的目标对象。而intercept方法就是要进行拦截的时候要执行的方法。</p><p>对于plugin方法而言，其实Mybatis已经为我们提供了一个实现。Mybatis中有一个叫做Plugin的类，里面有一个静态方法wrap(Object target,Interceptor interceptor)，通过该方法可以决定要返回的对象是目标对象还是对应的代理。这里我们先来看一下Plugin的源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.apache.ibatis.plugin;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.reflect.InvocationHandler;</span></span>
<span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span>import java.lang.reflect.Proxy;</span></span>
<span class="line"><span>import java.util.HashMap;</span></span>
<span class="line"><span>import java.util.HashSet;</span></span>
<span class="line"><span>import java.util.Map;</span></span>
<span class="line"><span>import java.util.Set;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.apache.ibatis.reflection.ExceptionUtil;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//这个类是Mybatis拦截器的核心,大家可以看到该类继承了InvocationHandler</span></span>
<span class="line"><span>//又是JDK动态代理机制</span></span>
<span class="line"><span>public class Plugin implements InvocationHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //目标对象</span></span>
<span class="line"><span>  private Object target;</span></span>
<span class="line"><span>  //拦截器</span></span>
<span class="line"><span>  private Interceptor interceptor;</span></span>
<span class="line"><span>  //记录需要被拦截的类与方法</span></span>
<span class="line"><span>  private Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private Plugin(Object target, Interceptor interceptor, Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap) {</span></span>
<span class="line"><span>    this.target = target;</span></span>
<span class="line"><span>    this.interceptor = interceptor;</span></span>
<span class="line"><span>    this.signatureMap = signatureMap;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //一个静态方法,对一个目标对象进行包装，生成代理类。</span></span>
<span class="line"><span>  public static Object wrap(Object target, Interceptor interceptor) {</span></span>
<span class="line"><span>    //首先根据interceptor上面定义的注解 获取需要拦截的信息</span></span>
<span class="line"><span>    Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap = getSignatureMap(interceptor);</span></span>
<span class="line"><span>    //目标对象的Class</span></span>
<span class="line"><span>    Class&lt;?&gt; type = target.getClass();</span></span>
<span class="line"><span>    //返回需要拦截的接口信息</span></span>
<span class="line"><span>    Class&lt;?&gt;[] interfaces = getAllInterfaces(type, signatureMap);</span></span>
<span class="line"><span>    //如果长度为&gt;0 则返回代理类 否则不做处理</span></span>
<span class="line"><span>    if (interfaces.length &gt; 0) {</span></span>
<span class="line"><span>      return Proxy.newProxyInstance(</span></span>
<span class="line"><span>          type.getClassLoader(),</span></span>
<span class="line"><span>          interfaces,</span></span>
<span class="line"><span>          new Plugin(target, interceptor, signatureMap));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return target;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //代理对象每次调用的方法</span></span>
<span class="line"><span>  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      //通过method参数定义的类 去signatureMap当中查询需要拦截的方法集合</span></span>
<span class="line"><span>      Set&lt;Method&gt; methods = signatureMap.get(method.getDeclaringClass());</span></span>
<span class="line"><span>      //判断是否需要拦截</span></span>
<span class="line"><span>      if (methods != null &amp;&amp; methods.contains(method)) {</span></span>
<span class="line"><span>        return interceptor.intercept(new Invocation(target, method, args));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //不拦截 直接通过目标对象调用方法</span></span>
<span class="line"><span>      return method.invoke(target, args);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      throw ExceptionUtil.unwrapThrowable(e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //根据拦截器接口（Interceptor）实现类上面的注解获取相关信息</span></span>
<span class="line"><span>  private static Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; getSignatureMap(Interceptor interceptor) {</span></span>
<span class="line"><span>    //获取注解信息</span></span>
<span class="line"><span>    Intercepts interceptsAnnotation = interceptor.getClass().getAnnotation(Intercepts.class);</span></span>
<span class="line"><span>    //为空则抛出异常</span></span>
<span class="line"><span>    if (interceptsAnnotation == null) { // issue #251</span></span>
<span class="line"><span>      throw new PluginException(&quot;No @Intercepts annotation was found in interceptor &quot; + interceptor.getClass().getName());      </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //获得Signature注解信息</span></span>
<span class="line"><span>    Signature[] sigs = interceptsAnnotation.value();</span></span>
<span class="line"><span>    Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap = new HashMap&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt;();</span></span>
<span class="line"><span>    //循环注解信息</span></span>
<span class="line"><span>    for (Signature sig : sigs) {</span></span>
<span class="line"><span>      //根据Signature注解定义的type信息去signatureMap当中查询需要拦截方法的集合</span></span>
<span class="line"><span>      Set&lt;Method&gt; methods = signatureMap.get(sig.type());</span></span>
<span class="line"><span>      //第一次肯定为null 就创建一个并放入signatureMap</span></span>
<span class="line"><span>      if (methods == null) {</span></span>
<span class="line"><span>        methods = new HashSet&lt;Method&gt;();</span></span>
<span class="line"><span>        signatureMap.put(sig.type(), methods);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        //找到sig.type当中定义的方法 并加入到集合</span></span>
<span class="line"><span>        Method method = sig.type().getMethod(sig.method(), sig.args());</span></span>
<span class="line"><span>        methods.add(method);</span></span>
<span class="line"><span>      } catch (NoSuchMethodException e) {</span></span>
<span class="line"><span>        throw new PluginException(&quot;Could not find method on &quot; + sig.type() + &quot; named &quot; + sig.method() + &quot;. Cause: &quot; + e, e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return signatureMap;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //根据对象类型与signatureMap获取接口信息</span></span>
<span class="line"><span>  private static Class&lt;?&gt;[] getAllInterfaces(Class&lt;?&gt; type, Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap) {</span></span>
<span class="line"><span>    Set&lt;Class&lt;?&gt;&gt; interfaces = new HashSet&lt;Class&lt;?&gt;&gt;();</span></span>
<span class="line"><span>    //循环type类型的接口信息 如果该类型存在与signatureMap当中则加入到set当中去</span></span>
<span class="line"><span>    while (type != null) {</span></span>
<span class="line"><span>      for (Class&lt;?&gt; c : type.getInterfaces()) {</span></span>
<span class="line"><span>        if (signatureMap.containsKey(c)) {</span></span>
<span class="line"><span>          interfaces.add(c);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      type = type.getSuperclass();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //转换为数组返回</span></span>
<span class="line"><span>    return interfaces.toArray(new Class&lt;?&gt;[interfaces.size()]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是俩个注解类的定义源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.apache.ibatis.plugin;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.ElementType;</span></span>
<span class="line"><span>import java.lang.annotation.Retention;</span></span>
<span class="line"><span>import java.lang.annotation.RetentionPolicy;</span></span>
<span class="line"><span>import java.lang.annotation.Target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target(ElementType.TYPE)</span></span>
<span class="line"><span>public @interface Intercepts {</span></span>
<span class="line"><span>  Signature[] value();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>package org.apache.ibatis.plugin;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.ElementType;</span></span>
<span class="line"><span>import java.lang.annotation.Retention;</span></span>
<span class="line"><span>import java.lang.annotation.RetentionPolicy;</span></span>
<span class="line"><span>import java.lang.annotation.Target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target(ElementType.TYPE)</span></span>
<span class="line"><span>public @interface Signature {</span></span>
<span class="line"><span>  Class&lt;?&gt; type();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  String method();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Class&lt;?&gt;[] args();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="plugin-wrap方法" tabindex="-1">Plugin.wrap方法 <a class="header-anchor" href="#plugin-wrap方法" aria-label="Permalink to &quot;Plugin.wrap方法&quot;">​</a></h2><p>从前面可以看出，每个拦截器的plugin方法是通过调用Plugin.wrap方法来实现的。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static Object wrap(Object target, Interceptor interceptor) {  </span></span>
<span class="line"><span>   // 从拦截器的注解中获取拦截的类名和方法信息  </span></span>
<span class="line"><span>   Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap = getSignatureMap(interceptor);  </span></span>
<span class="line"><span>   Class&lt;?&gt; type = target.getClass();  </span></span>
<span class="line"><span>   // 解析被拦截对象的所有接口（注意是接口）  </span></span>
<span class="line"><span>   Class&lt;?&gt;[] interfaces = getAllInterfaces(type, signatureMap);  </span></span>
<span class="line"><span>   if(interfaces.length &gt; 0) {  </span></span>
<span class="line"><span>        // 生成代理对象， Plugin对象为该代理对象的InvocationHandler  （InvocationHandler属于java代理的一个重要概念，不熟悉的请参考相关概念）  </span></span>
<span class="line"><span>        return Proxy.newProxyInstance(type.getClassLoader(), interfaces, new Plugin(target,interceptor,signatureMap));  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    return target;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个Plugin类有三个属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Object target;// 被代理的目标类</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Interceptor interceptor;// 对应的拦截器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap;// 拦截器拦截的方法缓存</span></span></code></pre></div><p><strong>getSignatureMap方法</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; getSignatureMap(Interceptor interceptor) {</span></span>
<span class="line"><span>    Intercepts interceptsAnnotation = interceptor.getClass().getAnnotation(Intercepts.class);</span></span>
<span class="line"><span>    if (interceptsAnnotation == null) { // issue #251</span></span>
<span class="line"><span>      throw new PluginException(&quot;No @Intercepts annotation was found in interceptor &quot; + interceptor.getClass().getName());      </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Signature[] sigs = interceptsAnnotation.value();</span></span>
<span class="line"><span>    Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap = new HashMap&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt;();</span></span>
<span class="line"><span>    for (Signature sig : sigs) {</span></span>
<span class="line"><span>      Set&lt;Method&gt; methods = signatureMap.get(sig.type());</span></span>
<span class="line"><span>      if (methods == null) {</span></span>
<span class="line"><span>        methods = new HashSet&lt;Method&gt;();</span></span>
<span class="line"><span>        signatureMap.put(sig.type(), methods);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        Method method = sig.type().getMethod(sig.method(), sig.args());</span></span>
<span class="line"><span>        methods.add(method);</span></span>
<span class="line"><span>      } catch (NoSuchMethodException e) {</span></span>
<span class="line"><span>        throw new PluginException(&quot;Could not find method on &quot; + sig.type() + &quot; named &quot; + sig.method() + &quot;. Cause: &quot; + e, e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return signatureMap;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>getSignatureMap方法解释</strong>：首先会拿到拦截器这个类的 @Interceptors注解，然后拿到这个注解的属性 @Signature注解集合，然后遍历这个集合，遍历的时候拿出 @Signature注解的type属性(Class类型)，然后根据这个type得到带有method属性和args属性的Method。由于 @Interceptors注解的 @Signature属性是一个属性，所以最终会返回一个以type为key，value为<code>Set&lt;Method&gt;</code>的Map。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Intercepts({@Signature(type= Executor.class, method = &quot;update&quot;, args = {MappedStatement.class,Object.class})})</span></span></code></pre></div><p>比如这个 @Interceptors注解会返回一个key为Executor，value为集合(这个集合只有一个元素，也就是Method实例，这个Method实例就是Executor接口的update方法，且这个方法带有MappedStatement和Object类型的参数)。这个Method实例是根据 @Signature的method和args属性得到的。如果args参数跟type类型的method方法对应不上，那么将会抛出异常。</p><p><strong>getAllInterfaces方法</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static Class&lt;?&gt;[] getAllInterfaces(Class&lt;?&gt; type, Map&lt;Class&lt;?&gt;, Set&lt;Method&gt;&gt; signatureMap) {</span></span>
<span class="line"><span>    Set&lt;Class&lt;?&gt;&gt; interfaces = new HashSet&lt;Class&lt;?&gt;&gt;();</span></span>
<span class="line"><span>    while (type != null) {</span></span>
<span class="line"><span>      for (Class&lt;?&gt; c : type.getInterfaces()) {</span></span>
<span class="line"><span>        if (signatureMap.containsKey(c)) {</span></span>
<span class="line"><span>          interfaces.add(c);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      type = type.getSuperclass();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return interfaces.toArray(new Class&lt;?&gt;[interfaces.size()]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>getAllInterfaces方法解释</strong>： 根据目标实例target(这个target就是之前所说的MyBatis拦截器可以拦截的类，Executor,ParameterHandler,ResultSetHandler,StatementHandler)和它的父类们，返回signatureMap中含有target实现的接口数组。</p><p>所以Plugin这个类的作用就是根据 @Interceptors注解，得到这个注解的属性 @Signature数组，然后根据每个 @Signature注解的type，method，args属性使用反射找到对应的Method。最终根据调用的target对象实现的接口决定是否返回一个代理对象替代原先的target对象。</p><p>我们再次结合(Executor)interceptorChain.pluginAll(executor)这个语句来看，这个语句内部对executor执行了多次plugin,第一次plugin后通过Plugin.wrap方法生成了第一个代理类，姑且就叫executorProxy1，这个代理类的target属性是该executor对象。第二次plugin后通过Plugin.wrap方法生成了第二个代理类，姑且叫executorProxy2，这个代理类的target属性是executorProxy1...这样通过每个代理类的target属性就构成了一个代理链（从最后一个executorProxyN往前查找，通过target属性可以找到最原始的executor类）。</p><h2 id="代理链上的拦截" tabindex="-1">代理链上的拦截 <a class="header-anchor" href="#代理链上的拦截" aria-label="Permalink to &quot;代理链上的拦截&quot;">​</a></h2><blockquote><p>代理链生成后，对原始目标的方法调用都转移到代理者的invoke方法上来了。Plugin作为InvocationHandler的实现类，他的invoke方法是怎么样的呢？</p></blockquote><p>比如MyBatis官网的例子，当Configuration调用newExecutor方法的时候，由于Executor接口的update(MappedStatement ms, Object parameter)方法被拦截器被截获。因此最终返回的是一个代理类Plugin，而不是Executor。这样调用方法的时候，如果是个代理类，那么会执行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  </span></span>
<span class="line"><span>    try {  </span></span>
<span class="line"><span>       Set&lt;Method&gt; methods = signatureMap.get(method.getDeclaringClass());  </span></span>
<span class="line"><span>        if(methods != null &amp;&amp; methods.contains(method)) {  </span></span>
<span class="line"><span>           // 调用代理类所属拦截器的intercept方法，  </span></span>
<span class="line"><span>           return interceptor.intercept(new Invocation(target, method, args));  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return method.invoke(target, args);  </span></span>
<span class="line"><span>    } catch(Exception e) {  </span></span>
<span class="line"><span>        throw ExceptionUtil.unwrapThrowable(e);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>没错，如果找到对应的方法被代理之后，那么会执行Interceptor接口的interceptor方法。</p><p>在invoke里，如果方法签名和拦截中的签名一致，就调用拦截器的拦截方法。我们看到传递给拦截器的是一个Invocation对象，这个对象是什么样子的，他的功能又是什么呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Invocation {  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    private Object target;  </span></span>
<span class="line"><span>    private Method method;  </span></span>
<span class="line"><span>    private Object[] args;  </span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    public Invocation(Object target, Method method, Object[] args) {  </span></span>
<span class="line"><span>        this.target =target;  </span></span>
<span class="line"><span>        this.method =method;  </span></span>
<span class="line"><span>        this.args =args;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    ...  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    public Object proceed() throws InvocationTargetException, IllegalAccessException {  </span></span>
<span class="line"><span>        return method.invoke(target, args);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，Invocation类保存了代理对象的目标类，执行的目标类方法以及传递给它的参数。</p><p>在每个拦截器的intercept方法内，最后一个语句一定是return invocation.proceed()（不这么做的话拦截器链就断了，你的mybatis基本上就不能正常工作了）。invocation.proceed()只是简单的调用了下target的对应方法，如果target还是个代理，就又回到了上面的Plugin.invoke方法了。这样就形成了拦截器的调用链推进。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object intercept(Invocation invocation) throws Throwable {  </span></span>
<span class="line"><span>    //完成代理类本身的逻辑  </span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    //通过invocation.proceed()方法完成调用链的推进</span></span>
<span class="line"><span>    return invocation.proceed();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>MyBatis拦截器接口提供的3个方法中，plugin方法用于某些处理器(Handler)的构建过程。interceptor方法用于处理代理类的执行。setProperties方法用于拦截器属性的设置。</p><p>其实MyBatis官网提供的使用 @Interceptors和 @Signature注解以及Plugin类这样处理拦截器的方法，我们不一定要直接这样使用。我们也可以抛弃这3个类，直接在plugin方法内部根据target实例的类型做相应的操作。</p><p>总体来说MyBatis拦截器还是很简单的，拦截器本身不需要太多的知识点，但是学习拦截器需要对MyBatis中的各个接口很熟悉，因为拦截器涉及到了各个接口的知识点。</p><p>我们假设在MyBatis配置了一个插件，在运行时会发生什么？</p><ul><li>所有可能被拦截的处理类都会生成一个代理</li><li>处理类代理在执行对应方法时，判断要不要执行插件中的拦截方法</li><li>执行插接中的拦截方法后，推进目标的执行</li><li>如果有N个插件，就有N个代理，每个代理都要执行上面的逻辑。这里面的层层代理要多次生成动态代理，是比较影响性能的。虽然能指定插件拦截的位置，但这个是在执行方法时动态判断，初始化的时候就是简单的把插件包装到了所有可以拦截的地方。</li></ul><p>因此，在<strong>编写插件时需注意以下几个原则</strong>：</p><ul><li>不编写不必要的插件；</li><li>实现plugin方法时判断一下目标类型，是本插件要拦截的对象才执行Plugin.wrap方法，否者直接返回目标本省，这样可以减少目标被代理的次数。</li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,80)]))}const h=a(t,[["render",l]]);export{d as __pageData,h as default};
