import{_ as s,c as a,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/mybatis/mybatis-y-sql-1.jpg",t="/vitepress-blog-template/images/mybatis/mybatis-y-sql-2.jpg",i="/vitepress-blog-template/images/mybatis/mybatis-y-sql-3.png",y=JSON.parse('{"title":"MyBatis详解 - sqlSession执行流程","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-sql-exec.md","filePath":"framework/orm-mybatis/mybatis-y-sql-exec.md","lastUpdated":1737706346000}'),r={name:"framework/orm-mybatis/mybatis-y-sql-exec.md"};function c(o,n,u,d,m,g){return p(),a("div",null,n[0]||(n[0]=[e('<h1 id="mybatis详解-sqlsession执行流程" tabindex="-1">MyBatis详解 - sqlSession执行流程 <a class="header-anchor" href="#mybatis详解-sqlsession执行流程" aria-label="Permalink to &quot;MyBatis详解 - sqlSession执行流程&quot;">​</a></h1><blockquote><p>前面的章节主要讲mybatis如何解析配置文件，这些都是一次性的过程。从本章开始讲解动态的过程，它们跟应用程序对mybatis的调用密切相关。@pdai</p></blockquote><h2 id="sqlsessionfactory-与-sqlsession" tabindex="-1">sqlSessionFactory 与 SqlSession <a class="header-anchor" href="#sqlsessionfactory-与-sqlsession" aria-label="Permalink to &quot;sqlSessionFactory 与 SqlSession&quot;">​</a></h2><blockquote><p>通过前面的章节对于mybatis 的介绍及使用，大家都能体会到SqlSession的重要性了吧，没错，从表面上来看，咱们都是通过SqlSession去执行sql语句（注意：是从表面看，实际的待会儿就会讲）。</p></blockquote><p>正如其名，Sqlsession对应着一次数据库会话。由于数据库会话不是永久的，因此Sqlsession的生命周期也不应该是永久的，相反，在你每次访问数据库时都需要创建它（当然并不是说在Sqlsession里只能执行一次sql，你可以执行多次，当一旦关闭了Sqlsession就需要重新创建它）。</p><p>那么咱们就先看看是怎么获取SqlSession的吧：</p><p><img src="'+l+`" alt="error.图片加载失败"></p><p>首先，SqlSessionFactoryBuilder去读取mybatis的配置文件，然后build一个DefaultSqlSessionFactory。源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> /**</span></span>
<span class="line"><span>  * 一系列的构造方法最终都会调用本方法（配置文件为Reader时会调用本方法，还有一个InputStream方法与此对应）</span></span>
<span class="line"><span>  * @param reader</span></span>
<span class="line"><span>  * @param environment</span></span>
<span class="line"><span>  * @param properties</span></span>
<span class="line"><span>  * @return</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span> public SqlSessionFactory build(Reader reader, String environment, Properties properties) {</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>     //通过XMLConfigBuilder解析配置文件，解析的配置相关信息都会封装为一个Configuration对象</span></span>
<span class="line"><span>     XMLConfigBuilder parser = new XMLConfigBuilder(reader, environment, properties);</span></span>
<span class="line"><span>     //这儿创建DefaultSessionFactory对象</span></span>
<span class="line"><span>     return build(parser.parse());</span></span>
<span class="line"><span>   } catch (Exception e) {</span></span>
<span class="line"><span>     throw ExceptionFactory.wrapException(&quot;Error building SqlSession.&quot;, e);</span></span>
<span class="line"><span>   } finally {</span></span>
<span class="line"><span>     ErrorContext.instance().reset();</span></span>
<span class="line"><span>     try {</span></span>
<span class="line"><span>       reader.close();</span></span>
<span class="line"><span>     } catch (IOException e) {</span></span>
<span class="line"><span>       // Intentionally ignore. Prefer previous error.</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> public SqlSessionFactory build(Configuration config) {</span></span>
<span class="line"><span>   return new DefaultSqlSessionFactory(config);</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>当我们获取到SqlSessionFactory之后，就可以通过SqlSessionFactory去获取SqlSession对象。源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>  * 通常一系列openSession方法最终都会调用本方法</span></span>
<span class="line"><span>  * @param execType </span></span>
<span class="line"><span>  * @param level</span></span>
<span class="line"><span>  * @param autoCommit</span></span>
<span class="line"><span>  * @return</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span> private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {</span></span>
<span class="line"><span>   Transaction tx = null;</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>     //通过Confuguration对象去获取Mybatis相关配置信息, Environment对象包含了数据源和事务的配置</span></span>
<span class="line"><span>     final Environment environment = configuration.getEnvironment();</span></span>
<span class="line"><span>     final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);</span></span>
<span class="line"><span>     tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);</span></span>
<span class="line"><span>     //之前说了，从表面上来看，咱们是用sqlSession在执行sql语句， 实际呢，其实是通过excutor执行， excutor是对于Statement的封装</span></span>
<span class="line"><span>     final Executor executor = configuration.newExecutor(tx, execType);</span></span>
<span class="line"><span>     //关键看这儿，创建了一个DefaultSqlSession对象</span></span>
<span class="line"><span>     return new DefaultSqlSession(configuration, executor, autoCommit);</span></span>
<span class="line"><span>   } catch (Exception e) {</span></span>
<span class="line"><span>     closeTransaction(tx); // may have fetched a connection so lets call close()</span></span>
<span class="line"><span>     throw ExceptionFactory.wrapException(&quot;Error opening session.  Cause: &quot; + e, e);</span></span>
<span class="line"><span>   } finally {</span></span>
<span class="line"><span>     ErrorContext.instance().reset();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>通过以上步骤，咱们已经得到SqlSession对象了。接下来就是该干嘛干嘛去了（话说还能干嘛，当然是执行sql语句咯）。看了上面，咱们也回想一下之前写的Demo：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SqlSessionFactory sessionFactory = null;  </span></span>
<span class="line"><span>String resource = &quot;mybatis-conf.xml&quot;;  </span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>    //SqlSessionFactoryBuilder读取配置文件</span></span>
<span class="line"><span>   sessionFactory = new SqlSessionFactoryBuilder().build(Resources.getResourceAsReader(resource));</span></span>
<span class="line"><span>} catch (IOException e) {  </span></span>
<span class="line"><span>   e.printStackTrace();  </span></span>
<span class="line"><span>}    </span></span>
<span class="line"><span>//通过SqlSessionFactory获取SqlSession</span></span>
<span class="line"><span>SqlSession sqlSession = sessionFactory.openSession();</span></span></code></pre></div><p>创建Sqlsession的地方只有一个，那就是SqlsessionFactory的openSession方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public SqlSessionopenSession() {  </span></span>
<span class="line"><span>    return openSessionFromDataSource(configuration.getDefaultExecutorType(),null, false);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到实际创建SqlSession的地方是openSessionFromDataSource，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    Connection connection = null;  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    try {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        final Environment environment = configuration.getEnvironment();  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        final DataSource dataSource = getDataSourceFromEnvironment(environment);  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // MyBatis对事务的处理相对简单，TransactionIsolationLevel中定义了几种隔离级别，并不支持内嵌事务这样较复杂的场景，同时由于其是持久层的缘故，所以真正在应用开发中会委托Spring来处理事务实现真正的与开发者隔离。分析事务的实现是个入口，借此可以了解不少JDBC规范方面的事情。</span></span>
<span class="line"><span>        TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        connection = dataSource.getConnection();  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        if (level != null) {  </span></span>
<span class="line"><span>            connection.setTransactionIsolation(level.getLevel());</span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        connection = wrapConnection(connection);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        Transaction tx = transactionFactory.newTransaction(connection,autoCommit);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        Executorexecutor = configuration.newExecutor(tx, execType);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        return newDefaultSqlSession(configuration, executor, autoCommit);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    } catch (Exceptione) {  </span></span>
<span class="line"><span>        closeConnection(connection);  </span></span>
<span class="line"><span>        throwExceptionFactory.wrapException(&quot;Error opening session.  Cause: &quot; + e, e);  </span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        ErrorContext.instance().reset();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，创建sqlsession经过了以下几个主要步骤：</p><ul><li><p>从配置中获取Environment；</p></li><li><p>从Environment中取得DataSource；</p></li><li><p>从Environment中取得TransactionFactory；</p></li><li><p>从DataSource里获取数据库连接对象Connection；</p></li><li><p>在取得的数据库连接上创建事务对象Transaction；</p></li><li><p>创建Executor对象（该对象非常重要，事实上sqlsession的所有操作都是通过它完成的）；</p></li><li><p>创建sqlsession对象。</p></li></ul><p>SqlSession咱们也拿到了，咱们可以调用SqlSession中一系列的select..., insert..., update..., delete...方法轻松自如的进行CRUD操作了。就这样？那咱配置的映射文件去哪儿了？别急，咱们接着往下看。</p><h2 id="利器之mapperproxy" tabindex="-1">利器之MapperProxy <a class="header-anchor" href="#利器之mapperproxy" aria-label="Permalink to &quot;利器之MapperProxy&quot;">​</a></h2><p><img src="`+t+`" alt="error.图片加载失败"></p><p>在mybatis中，通过MapperProxy动态代理咱们的dao， 也就是说， 当咱们执行自己写的dao里面的方法的时候，其实是对应的mapperProxy在代理。那么，咱们就看看怎么获取MapperProxy对象吧：</p><p>通过SqlSession从Configuration中获取。源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> /**</span></span>
<span class="line"><span>  * 什么都不做，直接去configuration中找， 哥就是这么任性</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span> @Override</span></span>
<span class="line"><span> public &lt;T&gt; T getMapper(Class&lt;T&gt; type) {</span></span>
<span class="line"><span>   return configuration.&lt;T&gt;getMapper(type, this);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>SqlSession把包袱甩给了Configuration, 接下来就看看Configuration。源码如下：</span></span>
<span class="line"><span> /**</span></span>
<span class="line"><span>  * 烫手的山芋，俺不要，你找mapperRegistry去要</span></span>
<span class="line"><span>  * @param type</span></span>
<span class="line"><span>  * @param sqlSession</span></span>
<span class="line"><span>  * @return</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span> public &lt;T&gt; T getMapper(Class&lt;T&gt; type, SqlSession sqlSession) {</span></span>
<span class="line"><span>   return mapperRegistry.getMapper(type, sqlSession);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>Configuration不要这烫手的山芋，接着甩给了MapperRegistry， 那咱看看MapperRegistry。 源码如下：</span></span>
<span class="line"><span> /**</span></span>
<span class="line"><span>  * 烂活净让我来做了，没法了，下面没人了，我不做谁来做</span></span>
<span class="line"><span>  * @param type</span></span>
<span class="line"><span>  * @param sqlSession</span></span>
<span class="line"><span>  * @return</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span> @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span> public &lt;T&gt; T getMapper(Class&lt;T&gt; type, SqlSession sqlSession) {</span></span>
<span class="line"><span>   //能偷懒的就偷懒，俺把粗活交给MapperProxyFactory去做</span></span>
<span class="line"><span>   final MapperProxyFactory&lt;T&gt; mapperProxyFactory = (MapperProxyFactory&lt;T&gt;) knownMappers.get(type);</span></span>
<span class="line"><span>   if (mapperProxyFactory == null) {</span></span>
<span class="line"><span>     throw new BindingException(&quot;Type &quot; + type + &quot; is not known to the MapperRegistry.&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>     //关键在这儿</span></span>
<span class="line"><span>     return mapperProxyFactory.newInstance(sqlSession);</span></span>
<span class="line"><span>   } catch (Exception e) {</span></span>
<span class="line"><span>     throw new BindingException(&quot;Error getting mapper instance. Cause: &quot; + e, e);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>MapperProxyFactory是个苦B的人，粗活最终交给它去做了。咱们看看源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> /**</span></span>
<span class="line"><span>  * 别人虐我千百遍，我待别人如初恋</span></span>
<span class="line"><span>  * @param mapperProxy</span></span>
<span class="line"><span>  * @return</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span> @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span> protected T newInstance(MapperProxy&lt;T&gt; mapperProxy) {</span></span>
<span class="line"><span>   //动态代理我们写的dao接口</span></span>
<span class="line"><span>   return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[] { mapperInterface }, mapperProxy);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> public T newInstance(SqlSession sqlSession) {</span></span>
<span class="line"><span>   final MapperProxy&lt;T&gt; mapperProxy = new MapperProxy&lt;T&gt;(sqlSession, mapperInterface, methodCache);</span></span>
<span class="line"><span>   return newInstance(mapperProxy);</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>通过以上的动态代理，咱们就可以方便地使用dao接口啦， 就像之前咱们写的demo那样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UserDao userMapper = sqlSession.getMapper(UserDao.class);  </span></span>
<span class="line"><span>User insertUser = new User();</span></span></code></pre></div><p>这下方便多了吧， 呵呵， 貌似mybatis的源码就这么一回事儿啊。具体详细介绍，请参见MyBatis Mapper 接口如何通过JDK动态代理来包装SqlSession 源码分析。别急，还没完， 咱们还没看具体是怎么执行sql语句的呢。</p><h2 id="excutor" tabindex="-1">Excutor <a class="header-anchor" href="#excutor" aria-label="Permalink to &quot;Excutor&quot;">​</a></h2><p>Executor与Sqlsession的关系就像市长与书记，Sqlsession只是个门面，真正干事的是Executor，Sqlsession对数据库的操作都是通过Executor来完成的。与Sqlsession一样，Executor也是动态创建的：</p><p><img src="`+i+`" alt="error.图片加载失败"></p><ul><li><strong>Executor创建的源代码</strong>：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Executor newExecutor(Transaction transaction, ExecutorType executorType) {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    executorType = executorType == null ? defaultExecutorType : executorType;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    executorType = executorType == null ?ExecutorType.SIMPLE : executorType;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Executor executor;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(ExecutorType.BATCH == executorType) {</span></span>
<span class="line"><span>        executor = new BatchExecutor(this,transaction);</span></span>
<span class="line"><span>    } else if(ExecutorType.REUSE == executorType) {</span></span>
<span class="line"><span>        executor = new ReuseExecutor(this,transaction);  </span></span>
<span class="line"><span>    } else {  </span></span>
<span class="line"><span>        executor = newSimpleExecutor(this, transaction);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (cacheEnabled) {</span></span>
<span class="line"><span>        executor = new CachingExecutor(executor);  </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    executor = (Executor) interceptorChain.pluginAll(executor);  </span></span>
<span class="line"><span>    return executor;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，如果不开启cache的话，创建的Executor只是3中基础类型之一，BatchExecutor专门用于执行批量sql操作，ReuseExecutor会重用statement执行sql操作，SimpleExecutor只是简单执行sql没有什么特别的。开启cache的话（默认是开启的并且没有任何理由去关闭它），就会创建CachingExecutor，它以前面创建的Executor作为唯一参数。CachingExecutor在查询数据库前先查找缓存，若没找到的话调用delegate（就是构造时传入的Executor对象）从数据库查询，并将查询结果存入缓存中。</p><p>Executor对象是可以被插件拦截的，如果定义了针对Executor类型的插件，最终生成的Executor对象是被各个插件插入后的代理对象。</p><p>接下来，咱们才要真正去看sql的执行过程了。上面，咱们拿到了MapperProxy, 每个MapperProxy对应一个dao接口， 那么咱们在使用的时候，MapperProxy是怎么做的呢？ 源码奉上：</p><ul><li><strong>MapperProxy</strong></li></ul><p>我们知道对被代理对象的方法的访问都会落实到代理者的invoke上来，MapperProxy的invoke如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  /**</span></span>
<span class="line"><span>   * MapperProxy在执行时会触发此方法</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {</span></span>
<span class="line"><span>    if (Object.class.equals(method.getDeclaringClass())) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        return method.invoke(this, args);</span></span>
<span class="line"><span>      } catch (Throwable t) {</span></span>
<span class="line"><span>        throw ExceptionUtil.unwrapThrowable(t);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    final MapperMethod mapperMethod = cachedMapperMethod(method);</span></span>
<span class="line"><span>    //二话不说，主要交给MapperMethod自己去管</span></span>
<span class="line"><span>    return mapperMethod.execute(sqlSession, args);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><ul><li><strong>MapperMethod</strong></li></ul><p>就像是一个分发者，他根据参数和返回值类型选择不同的sqlsession方法来执行。这样mapper对象与sqlsession就真正的关联起来了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  /**</span></span>
<span class="line"><span>   * 看着代码不少，不过其实就是先判断CRUD类型，然后根据类型去选择到底执行sqlSession中的哪个方法，绕了一圈，又转回sqlSession了</span></span>
<span class="line"><span>   * @param sqlSession</span></span>
<span class="line"><span>   * @param args</span></span>
<span class="line"><span>   * @return</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public Object execute(SqlSession sqlSession, Object[] args) {</span></span>
<span class="line"><span>    Object result;</span></span>
<span class="line"><span>    if (SqlCommandType.INSERT == command.getType()) {</span></span>
<span class="line"><span>      Object param = method.convertArgsToSqlCommandParam(args);</span></span>
<span class="line"><span>      result = rowCountResult(sqlSession.insert(command.getName(), param));</span></span>
<span class="line"><span>    } else if (SqlCommandType.UPDATE == command.getType()) {</span></span>
<span class="line"><span>      Object param = method.convertArgsToSqlCommandParam(args);</span></span>
<span class="line"><span>      result = rowCountResult(sqlSession.update(command.getName(), param));</span></span>
<span class="line"><span>    } else if (SqlCommandType.DELETE == command.getType()) {</span></span>
<span class="line"><span>      Object param = method.convertArgsToSqlCommandParam(args);</span></span>
<span class="line"><span>      result = rowCountResult(sqlSession.delete(command.getName(), param));</span></span>
<span class="line"><span>    } else if (SqlCommandType.SELECT == command.getType()) {</span></span>
<span class="line"><span>      if (method.returnsVoid() &amp;&amp; method.hasResultHandler()) {</span></span>
<span class="line"><span>        executeWithResultHandler(sqlSession, args);</span></span>
<span class="line"><span>        result = null;</span></span>
<span class="line"><span>      } else if (method.returnsMany()) {</span></span>
<span class="line"><span>        result = executeForMany(sqlSession, args);</span></span>
<span class="line"><span>      } else if (method.returnsMap()) {</span></span>
<span class="line"><span>        result = executeForMap(sqlSession, args);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        Object param = method.convertArgsToSqlCommandParam(args);</span></span>
<span class="line"><span>        result = sqlSession.selectOne(command.getName(), param);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      throw new BindingException(&quot;Unknown execution method for: &quot; + command.getName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (result == null &amp;&amp; method.getReturnType().isPrimitive() &amp;&amp; !method.returnsVoid()) {</span></span>
<span class="line"><span>      throw new BindingException(&quot;Mapper method &#39;&quot; + command.getName() </span></span>
<span class="line"><span>          + &quot; attempted to return null from a method with a primitive return type (&quot; + method.getReturnType() + &quot;).&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>既然又回到SqlSession了，前面提到过，sqlsession只是一个门面，真正发挥作用的是executor，对sqlsession方法的访问最终都会落到executor的相应方法上去。Executor分成两大类，一类是CacheExecutor，另一类是普通Executor。Executor的创建前面已经介绍了，那么咱们就看看SqlSession的CRUD方法了，为了省事，还是就选择其中的一个方法来做分析吧。这儿，咱们选择了selectList方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public &lt;E&gt; List&lt;E&gt; selectList(String statement, Object parameter, RowBounds rowBounds) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      MappedStatement ms = configuration.getMappedStatement(statement);</span></span>
<span class="line"><span>      //CRUD实际上是交给Excetor去处理， excutor其实也只是穿了个马甲而已，小样，别以为穿个马甲我就不认识你嘞！</span></span>
<span class="line"><span>      return executor.query(ms, wrapCollection(parameter), rowBounds, Executor.NO_RESULT_HANDLER);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      throw ExceptionFactory.wrapException(&quot;Error querying database.  Cause: &quot; + e, e);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      ErrorContext.instance().reset();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><ul><li><strong>CacheExecutor</strong></li></ul><p>CacheExecutor有一个重要属性delegate，它保存的是某类普通的Executor，值在构照时传入。执行数据库update操作时，它直接调用delegate的update方法，执行query方法时先尝试从cache中取值，取不到再调用delegate的查询方法，并将查询结果存入cache中。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List query(MappedStatement ms, Object parameterObject, RowBounds rowBounds,ResultHandler resultHandler) throws SQLException {  </span></span>
<span class="line"><span>    if (ms != null) {  </span></span>
<span class="line"><span>        Cache cache = ms.getCache();  </span></span>
<span class="line"><span>        if (cache != null) {  </span></span>
<span class="line"><span>            flushCacheIfRequired(ms);  </span></span>
<span class="line"><span>            cache.getReadWriteLock().readLock().lock();  </span></span>
<span class="line"><span>            try {  </span></span>
<span class="line"><span>                if (ms.isUseCache() &amp;&amp; resultHandler ==null) {  </span></span>
<span class="line"><span>                    CacheKey key = createCacheKey(ms, parameterObject, rowBounds);  </span></span>
<span class="line"><span>                    final List cachedList = (List)cache.getObject(key);  </span></span>
<span class="line"><span>                    if (cachedList != null) {  </span></span>
<span class="line"><span>                        return cachedList;  </span></span>
<span class="line"><span>                    } else {  </span></span>
<span class="line"><span>                        List list = delegate.query(ms,parameterObject, rowBounds, resultHandler);  </span></span>
<span class="line"><span>                        tcm.putObject(cache,key, list);  </span></span>
<span class="line"><span>                        return list;  </span></span>
<span class="line"><span>                    }  </span></span>
<span class="line"><span>                } else {  </span></span>
<span class="line"><span>                    return delegate.query(ms,parameterObject, rowBounds, resultHandler);  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>            } finally {  </span></span>
<span class="line"><span>                cache.getReadWriteLock().readLock().unlock();  </span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    return delegate.query(ms,parameterObject, rowBounds, resultHandler);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>普通Executor</strong></li></ul><p>有3类，他们都继承于BaseExecutor，BatchExecutor专门用于执行批量sql操作，ReuseExecutor会重用statement执行sql操作，SimpleExecutor只是简单执行sql没有什么特别的。下面以SimpleExecutor为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds,ResultHandler resultHandler) throws SQLException {  </span></span>
<span class="line"><span>    Statement stmt = null;  </span></span>
<span class="line"><span>    try {  </span></span>
<span class="line"><span>        Configuration configuration = ms.getConfiguration();  </span></span>
<span class="line"><span>        StatementHandler handler = configuration.newStatementHandler(this, ms,parameter, rowBounds,resultHandler);  </span></span>
<span class="line"><span>        stmt =prepareStatement(handler);  </span></span>
<span class="line"><span>        returnhandler.query(stmt, resultHandler);  </span></span>
<span class="line"><span>    } finally {  </span></span>
<span class="line"><span>        closeStatement(stmt);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，通过一层一层的调用，最终会来到doQuery方法， 这儿咱们就随便找个Excutor看看doQuery方法的实现吧，我这儿选择了SimpleExecutor:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public &lt;E&gt; List&lt;E&gt; doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) throws SQLException {</span></span>
<span class="line"><span>    Statement stmt = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      Configuration configuration = ms.getConfiguration();</span></span>
<span class="line"><span>      StatementHandler handler = configuration.newStatementHandler(wrapper, ms, parameter, rowBounds, resultHandler, boundSql);</span></span>
<span class="line"><span>      stmt = prepareStatement(handler, ms.getStatementLog());</span></span>
<span class="line"><span>      //StatementHandler封装了Statement, 让 StatementHandler 去处理</span></span>
<span class="line"><span>      return handler.&lt;E&gt;query(stmt, resultHandler);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      closeStatement(stmt);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>Mybatis内置的ExecutorType有3种，默认的是simple，该模式下它为每个语句的执行创建一个新的预处理语句，单条提交sql；而batch模式重复使用已经预处理的语句， 并且批量执行所有更新语句，显然batch性能将更优；</p><p>但batch模式也有自己的问题，比如在Insert操作时，在事务没有提交之前，是没有办法获取到自增的id，这在某型情形下是不符合业务要求的；</p><p>通过走码和研读spring相关文件发现，在同一事务中batch模式和simple模式之间无法转换，由于本项目一开始选择了simple模式，所以碰到需要批量更新时，只能在单独的事务中进行；</p><p>在代码中使用batch模式可以使用以下方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//从spring注入原有的sqlSessionTemplate</span></span>
<span class="line"><span>@Autowired</span></span>
<span class="line"><span>private SqlSessionTemplate sqlSessionTemplate;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public void testInsertBatchByTrue() {</span></span>
<span class="line"><span>    //新获取一个模式为BATCH，自动提交为false的session</span></span>
<span class="line"><span>    //如果自动提交设置为true,将无法控制提交的条数，改为最后统一提交，可能导致内存溢出</span></span>
<span class="line"><span>    SqlSession session = sqlSessionTemplate.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);</span></span>
<span class="line"><span>    //通过新的session获取mapper</span></span>
<span class="line"><span>    fooMapper = session.getMapper(FooMapper.class);</span></span>
<span class="line"><span>    int size = 10000;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; size; i++) {</span></span>
<span class="line"><span>            Foo foo = new Foo();</span></span>
<span class="line"><span>            foo.setName(String.valueOf(System.currentTimeMillis()));</span></span>
<span class="line"><span>            fooMapper.insert(foo);</span></span>
<span class="line"><span>            if (i % 1000 == 0 || i == size - 1) {</span></span>
<span class="line"><span>                //手动每1000个一提交，提交后无法回滚</span></span>
<span class="line"><span>                session.commit();</span></span>
<span class="line"><span>                //清理缓存，防止溢出</span></span>
<span class="line"><span>                session.clearCache();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        //没有提交的数据可以回滚</span></span>
<span class="line"><span>        session.rollback();</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        session.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码没有使用spring的事务，改手动控制，如果和原spring事务一起使用，将无法回滚，必须注意，最好单独使用；</p><h2 id="statementhandler" tabindex="-1">StatementHandler <a class="header-anchor" href="#statementhandler" aria-label="Permalink to &quot;StatementHandler&quot;">​</a></h2><p>可以看出，Executor本质上也是个甩手掌柜，具体的事情原来是StatementHandler来完成的。当Executor将指挥棒交给StatementHandler后，接下来的工作就是StatementHandler的事了。我们先看看StatementHandler是如何创建的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public StatementHandler newStatementHandler(Executor executor, MappedStatementmappedStatement,  </span></span>
<span class="line"><span>        ObjectparameterObject, RowBounds rowBounds, ResultHandler resultHandler) {  </span></span>
<span class="line"><span>    StatementHandler statementHandler = new RoutingStatementHandler(executor, mappedStatement,parameterObject,rowBounds, resultHandler);  </span></span>
<span class="line"><span>    statementHandler = (StatementHandler) interceptorChain.pluginAll(statementHandler);  </span></span>
<span class="line"><span>    return statementHandler;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到每次创建的StatementHandler都是RoutingStatementHandler，它只是一个分发者，他一个属性delegate用于指定用哪种具体的StatementHandler。可选的StatementHandler有SimpleStatementHandler、PreparedStatementHandler和CallableStatementHandler三种。选用哪种在mapper配置文件的每个statement里指定，默认的是PreparedStatementHandler。同时还要注意到StatementHandler是可以被拦截器拦截的，和Executor一样，被拦截器拦截后的对像是一个代理对象。由于mybatis没有实现数据库的物理分页，众多物理分页的实现都是在这个地方使用拦截器实现的，本文作者也实现了一个分页拦截器，在后续的章节会分享给大家，敬请期待。</p><p>StatementHandler创建后需要执行一些初始操作，比如statement的开启和参数设置、对于PreparedStatement还需要执行参数的设置操作等。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Statement prepareStatement(StatementHandler handler) throws SQLException {  </span></span>
<span class="line"><span>    Statement stmt;  </span></span>
<span class="line"><span>    Connection connection = transaction.getConnection();  </span></span>
<span class="line"><span>    stmt =handler.prepare(connection);  </span></span>
<span class="line"><span>    handler.parameterize(stmt);  </span></span>
<span class="line"><span>    return stmt;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>statement的开启和参数设置没什么特别的地方，handler.parameterize倒是可以看看是怎么回事。handler.parameterize通过调用ParameterHandler的setParameters完成参数的设置，ParameterHandler随着StatementHandler的创建而创建，默认的实现是DefaultParameterHandler：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ParameterHandler newParameterHandler(MappedStatement mappedStatement, Object parameterObject, BoundSql boundSql) {  </span></span>
<span class="line"><span>   ParameterHandler parameterHandler = new DefaultParameterHandler(mappedStatement,parameterObject,boundSql);  </span></span>
<span class="line"><span>   parameterHandler = (ParameterHandler) interceptorChain.pluginAll(parameterHandler);  </span></span>
<span class="line"><span>   return parameterHandler;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同Executor和StatementHandler一样，ParameterHandler也是可以被拦截的。DefaultParameterHandler里设置参数的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setParameters(PreparedStatement ps) throws SQLException {  </span></span>
<span class="line"><span>    ErrorContext.instance().activity(&quot;settingparameters&quot;).object(mappedStatement.getParameterMap().getId());  </span></span>
<span class="line"><span>    List&lt;ParameterMapping&gt; parameterMappings = boundSql.getParameterMappings();  </span></span>
<span class="line"><span>    if(parameterMappings != null) {  </span></span>
<span class="line"><span>        MetaObject metaObject = parameterObject == null ? null :configuration.newMetaObject(parameterObject);  </span></span>
<span class="line"><span>        for (int i = 0; i&lt; parameterMappings.size(); i++) {  </span></span>
<span class="line"><span>            ParameterMapping parameterMapping = parameterMappings.get(i);  </span></span>
<span class="line"><span>            if(parameterMapping.getMode() != ParameterMode.OUT) {  </span></span>
<span class="line"><span>                Object value;  </span></span>
<span class="line"><span>                String propertyName = parameterMapping.getProperty();  </span></span>
<span class="line"><span>                PropertyTokenizer prop = newPropertyTokenizer(propertyName);  </span></span>
<span class="line"><span>                if (parameterObject == null) {  </span></span>
<span class="line"><span>                    value = null;  </span></span>
<span class="line"><span>                } else if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())){  </span></span>
<span class="line"><span>                    value = parameterObject;  </span></span>
<span class="line"><span>                } else if (boundSql.hasAdditionalParameter(propertyName)){  </span></span>
<span class="line"><span>                    value = boundSql.getAdditionalParameter(propertyName);  </span></span>
<span class="line"><span>                } else if(propertyName.startsWith(ForEachSqlNode.ITEM_PREFIX)  </span></span>
<span class="line"><span>                        &amp;&amp; boundSql.hasAdditionalParameter(prop.getName())){  </span></span>
<span class="line"><span>                    value = boundSql.getAdditionalParameter(prop.getName());  </span></span>
<span class="line"><span>                    if (value != null) {  </span></span>
<span class="line"><span>                        value = configuration.newMetaObject(value).getValue(propertyName.substring(prop.getName().length()));  </span></span>
<span class="line"><span>                    }  </span></span>
<span class="line"><span>                } else {  </span></span>
<span class="line"><span>                    value = metaObject == null ? null :metaObject.getValue(propertyName);  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>                TypeHandler typeHandler = parameterMapping.getTypeHandler();  </span></span>
<span class="line"><span>                if (typeHandler == null) {  </span></span>
<span class="line"><span>                   throw new ExecutorException(&quot;Therewas no TypeHandler found for parameter &quot; + propertyName  + &quot; of statement &quot; + mappedStatement.getId());  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>                typeHandler.setParameter(ps, i + 1, value,parameterMapping.getJdbcType());  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面最重要的一句其实就是最后一句代码，它的作用是用合适的TypeHandler完成参数的设置。那么什么是合适的TypeHandler呢，它又是如何决断出来的呢？BaseStatementHandler的构造方法里有这么一句：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this.boundSql= mappedStatement.getBoundSql(parameterObject);</span></span></code></pre></div><p>它触发了sql 的解析，在解析sql的过程中，TypeHandler也被决断出来了，决断的原则就是根据参数的类型和参数对应的JDBC类型决定使用哪个TypeHandler。比如：参数类型是String的话就用StringTypeHandler，参数类型是整数的话就用IntegerTypeHandler等。</p><p>参数设置完毕后，执行数据库操作（update或query）。如果是query最后还有个查询结果的处理过程。</p><p>接下来，咱们看看StatementHandler 的一个实现类 PreparedStatementHandler（这也是我们最常用的，封装的是PreparedStatement）, 看看它使怎么去处理的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public &lt;E&gt; List&lt;E&gt; query(Statement statement, ResultHandler resultHandler) throws SQLException {</span></span>
<span class="line"><span>    // 到此，原形毕露， PreparedStatement, 这个大家都已经滚瓜烂熟了吧</span></span>
<span class="line"><span>    PreparedStatement ps = (PreparedStatement) statement;</span></span>
<span class="line"><span>    ps.execute();</span></span>
<span class="line"><span>    // 结果交给了ResultSetHandler 去处理</span></span>
<span class="line"><span>    return resultSetHandler.&lt;E&gt; handleResultSets(ps);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>结果处理使用ResultSetHandler来完成，默认的ResultSetHandler是FastResultSetHandler，它在创建StatementHandler时一起创建，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ResultSetHandler newResultSetHandler(Executor executor, MappedStatement mappedStatement,  </span></span>
<span class="line"><span>RowBounds rowBounds, ParameterHandler parameterHandler, ResultHandler resultHandler, BoundSql boundSql) {  </span></span>
<span class="line"><span>   ResultSetHandler resultSetHandler = mappedStatement.hasNestedResultMaps() ? newNestedResultSetHandler(executor, mappedStatement, parameterHandler, resultHandler, boundSql, rowBounds): new FastResultSetHandler(executor,mappedStatement, parameterHandler, resultHandler, boundSql, rowBounds);  </span></span>
<span class="line"><span>   resultSetHandler = (ResultSetHandler) interceptorChain.pluginAll(resultSetHandler);  </span></span>
<span class="line"><span>   return resultSetHandler;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出ResultSetHandler也是可以被拦截的，可以编写自己的拦截器改变ResultSetHandler的默认行为。ResultSetHandler内部一条记录一条记录的处理，在处理每条记录的每一列时会调用TypeHandler转换结果，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected boolean applyAutomaticMappings(ResultSet rs, List&lt;String&gt; unmappedColumnNames,MetaObject metaObject) throws SQLException {  </span></span>
<span class="line"><span>    boolean foundValues = false;  </span></span>
<span class="line"><span>    for (String columnName : unmappedColumnNames) {  </span></span>
<span class="line"><span>        final String property = metaObject.findProperty(columnName);  </span></span>
<span class="line"><span>        if (property!= null) {  </span></span>
<span class="line"><span>            final ClasspropertyType =metaObject.getSetterType(property);  </span></span>
<span class="line"><span>            if (typeHandlerRegistry.hasTypeHandler(propertyType)) {  </span></span>
<span class="line"><span>                final TypeHandler typeHandler = typeHandlerRegistry.getTypeHandler(propertyType);  </span></span>
<span class="line"><span>                final Object value = typeHandler.getResult(rs,columnName);  </span></span>
<span class="line"><span>                if (value != null) {  </span></span>
<span class="line"><span>                    metaObject.setValue(property, value);  </span></span>
<span class="line"><span>                    foundValues = true;  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    return foundValues;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码里可以看到，决断TypeHandler使用的是结果参数的属性类型。因此我们在定义作为结果的对象的属性时一定要考虑与数据库字段类型的兼容性。到此， 一次sql的执行流程就完了。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,82)]))}const S=s(r,[["render",c]]);export{y as __pageData,S as default};
