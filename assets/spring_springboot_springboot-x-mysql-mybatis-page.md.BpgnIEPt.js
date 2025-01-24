import{_ as s,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"SpringBoot集成MySQL - MyBatis PageHelper分页","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-mybatis-page.md","filePath":"spring/springboot/springboot-x-mysql-mybatis-page.md","lastUpdated":1737706346000}'),l={name:"spring/springboot/springboot-x-mysql-mybatis-page.md"};function t(i,a,o,r,c,g){return p(),n("div",null,a[0]||(a[0]=[e(`<h1 id="springboot集成mysql-mybatis-pagehelper分页" tabindex="-1">SpringBoot集成MySQL - MyBatis PageHelper分页 <a class="header-anchor" href="#springboot集成mysql-mybatis-pagehelper分页" aria-label="Permalink to &quot;SpringBoot集成MySQL - MyBatis PageHelper分页&quot;">​</a></h1><blockquote><p>前文中，我们展示了Spring Boot与MyBatis的集成，但是没有展示分页实现。本文专门介绍分页相关知识体系和基于MyBatis的物理分页PageHelper。@pdai</p></blockquote><h2 id="准备知识" tabindex="-1">准备知识 <a class="header-anchor" href="#准备知识" aria-label="Permalink to &quot;准备知识&quot;">​</a></h2><blockquote><p>MyBatis的相关知识体系以及常见的数据库分页方式，MySQL物理分页的方式等。</p></blockquote><h3 id="mybatis的相关知识体系" tabindex="-1">MyBatis的相关知识体系 <a class="header-anchor" href="#mybatis的相关知识体系" aria-label="Permalink to &quot;MyBatis的相关知识体系&quot;">​</a></h3><p>MyBatis技术栈演化 <a href="https://pdai.tech/md/spring/springboot/springboot-x-mysql-mybatis-xml.html" target="_blank" rel="noreferrer">SpringBoot集成MySQL - MyBatis XML方式</a></p><p>MyBatis源码知识体系 <a href="https://pdai.tech/md/framework/orm-mybatis/mybatis-y-arch.html" target="_blank" rel="noreferrer">MyBatis详解 - 总体框架设计</a></p><h3 id="逻辑分页和物理分页的区别" tabindex="-1">逻辑分页和物理分页的区别？ <a class="header-anchor" href="#逻辑分页和物理分页的区别" aria-label="Permalink to &quot;逻辑分页和物理分页的区别？&quot;">​</a></h3><blockquote><p>为什么会出现PageHelper这类框架？</p></blockquote><p>这便要从逻辑分页和物理分页开始说起：</p><ul><li><p><strong>逻辑分页</strong>：从数据库将所有记录查询出来，存储到内存中，展示当前页，然后数据再直接从内存中获取（前台分页）</p></li><li><p><strong>物理分页</strong>：只从数据库中查询当前页的数据（后台分页）</p></li></ul><p>由于MyBatis默认实现中采用的是逻辑分页，所以才诞生了PageHelper一类的物理分页框架。hibernate不要是因为hibernate采用的就是物理分页。</p><h3 id="不同数据库的物理分页是如何实现的" tabindex="-1">不同数据库的物理分页是如何实现的？ <a class="header-anchor" href="#不同数据库的物理分页是如何实现的" aria-label="Permalink to &quot;不同数据库的物理分页是如何实现的？&quot;">​</a></h3><blockquote><p>那物理分页通常是如何实现的呢？</p></blockquote><p>不同的数据库有不同的实现方式：（简单而言：mysql 使用limit ，SQLServer 使用top ，Oracle使用rowNum）</p><ul><li><strong>MySQL 使用LIMIT</strong></li></ul><p>例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT username, password </span></span>
<span class="line"><span>FROM tb_user </span></span>
<span class="line"><span>WHERE id = 1 </span></span>
<span class="line"><span>LIMIT 100,10</span></span></code></pre></div><ul><li><strong>SQLServer 2012 使用top</strong></li></ul><p>SQL SERVER 2012 支持了OFFSET + TOP方式提高了性能</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT top(50) LastName, FirstName, EmailAddress</span></span>
<span class="line"><span>FROM Employee</span></span>
<span class="line"><span>ORDER BY LastName, FirstName, EmailAddress</span></span>
<span class="line"><span>OFFSET 14000 ROWS</span></span>
<span class="line"><span>FETCH NEXT 50 ROWS ONLY;</span></span></code></pre></div><ul><li>ORACLE</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT *  </span></span>
<span class="line"><span>  FROM (SELECT AA.*, ROWNUM RN  </span></span>
<span class="line"><span>          FROM (SELECT * FROM USERS ORDER BY ID DESC) AA  </span></span>
<span class="line"><span>         WHERE ROWNUM &lt;= 10 )  </span></span>
<span class="line"><span> WHERE RN &gt; 0</span></span></code></pre></div><p>（这里只是给你简单介绍，感兴趣的可以去查找更多的资料）</p><h3 id="pagehelper是如何实现物理分页的前提-mybatis的插件机制" tabindex="-1">PageHelper是如何实现物理分页的前提:MyBatis的插件机制？ <a class="header-anchor" href="#pagehelper是如何实现物理分页的前提-mybatis的插件机制" aria-label="Permalink to &quot;PageHelper是如何实现物理分页的前提:MyBatis的插件机制？&quot;">​</a></h3><blockquote><p>这就要谈到MyBatis的插件机制</p></blockquote><p>具体请参考这两篇文章</p><ul><li><a href="https://pdai.tech/md/framework/orm-mybatis/mybatis-y-plugin.html" target="_blank" rel="noreferrer">MyBatis详解 - 插件机制</a><ul><li>MyBatis提供了一种插件(plugin)的功能，虽然叫做插件，但其实这是拦截器功能。那么拦截器拦截MyBatis中的哪些内容呢？</li></ul></li><li><a href="https://pdai.tech/md/framework/orm-mybatis/mybatis-y-plugin-page.html" target="_blank" rel="noreferrer">MyBatis详解 - 插件之分页机制</a><ul><li>Mybatis的分页功能很弱，它是基于内存的分页（查出所有记录再按偏移量和limit取结果），在大数据量的情况下这样的分页基本上是没有用的。本文基于插件，通过拦截StatementHandler重写sql语句，实现数据库的物理分页</li></ul></li></ul><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><blockquote><p>PageHelper 有多种用法，这里主要介绍官网提供的几种常见用法。具体请参考<a href="https://github.com/pagehelper/Mybatis-PageHelper/blob/master/wikis/zh/HowToUse.md" target="_blank" rel="noreferrer">官网的介绍在新窗口打开</a></p></blockquote><h3 id="第一种-rowbounds方式的调用" tabindex="-1">第一种：RowBounds方式的调用 <a class="header-anchor" href="#第一种-rowbounds方式的调用" aria-label="Permalink to &quot;第一种：RowBounds方式的调用&quot;">​</a></h3><p>第一种，RowBounds方式的调用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>List&lt;User&gt; list = sqlSession.selectList(&quot;x.y.selectIf&quot;, null, new RowBounds(0, 10));</span></span></code></pre></div><h3 id="第二种-mapper接口方式的调用startpage" tabindex="-1">第二种：Mapper接口方式的调用startPage <a class="header-anchor" href="#第二种-mapper接口方式的调用startpage" aria-label="Permalink to &quot;第二种：Mapper接口方式的调用startPage&quot;">​</a></h3><p>第二种，Mapper接口方式的调用，推荐这种使用方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PageHelper.startPage(1, 10);</span></span>
<span class="line"><span>List&lt;User&gt; list = userMapper.selectIf(1);</span></span></code></pre></div><h3 id="第三种-mapper接口方式的调用offsetpage" tabindex="-1">第三种：Mapper接口方式的调用offsetPage <a class="header-anchor" href="#第三种-mapper接口方式的调用offsetpage" aria-label="Permalink to &quot;第三种：Mapper接口方式的调用offsetPage&quot;">​</a></h3><p>第三种，Mapper接口方式的调用，推荐这种使用方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PageHelper.offsetPage(1, 10);</span></span>
<span class="line"><span>List&lt;User&gt; list = userMapper.selectIf(1);</span></span></code></pre></div><h3 id="第四种-参数方法调用" tabindex="-1">第四种:参数方法调用 <a class="header-anchor" href="#第四种-参数方法调用" aria-label="Permalink to &quot;第四种:参数方法调用&quot;">​</a></h3><p>第四种:参数方法调用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//存在以下 Mapper 接口方法，你不需要在 xml 处理后两个参数</span></span>
<span class="line"><span>public interface CountryMapper {</span></span>
<span class="line"><span>    List&lt;User&gt; selectByPageNumSize(</span></span>
<span class="line"><span>            @Param(&quot;user&quot;) User user,</span></span>
<span class="line"><span>            @Param(&quot;pageNum&quot;) int pageNum, </span></span>
<span class="line"><span>            @Param(&quot;pageSize&quot;) int pageSize);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//配置supportMethodsArguments=true</span></span>
<span class="line"><span>//在代码中直接调用：</span></span>
<span class="line"><span>List&lt;User&gt; list = userMapper.selectByPageNumSize(user, 1, 10);</span></span></code></pre></div><h3 id="第五种-参数对象" tabindex="-1">第五种:参数对象 <a class="header-anchor" href="#第五种-参数对象" aria-label="Permalink to &quot;第五种:参数对象&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//如果 pageNum 和 pageSize 存在于 User 对象中，只要参数有值，也会被分页</span></span>
<span class="line"><span>//有如下 User 对象</span></span>
<span class="line"><span>public class User {</span></span>
<span class="line"><span>    //其他fields</span></span>
<span class="line"><span>    //下面两个参数名和 params 配置的名字一致</span></span>
<span class="line"><span>    private Integer pageNum;</span></span>
<span class="line"><span>    private Integer pageSize;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//存在以下 Mapper 接口方法，你不需要在 xml 处理后两个参数</span></span>
<span class="line"><span>public interface CountryMapper {</span></span>
<span class="line"><span>    List&lt;User&gt; selectByPageNumSize(User user);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//当 user 中的 pageNum!= null &amp;&amp; pageSize!= null 时，会自动分页</span></span>
<span class="line"><span>List&lt;User&gt; list = userMapper.selectByPageNumSize(user);</span></span></code></pre></div><h3 id="第六种-iselect-接口方式" tabindex="-1">第六种：ISelect 接口方式 <a class="header-anchor" href="#第六种-iselect-接口方式" aria-label="Permalink to &quot;第六种：ISelect 接口方式&quot;">​</a></h3><p>jdk6,7用法，创建接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Page&lt;User&gt; page = PageHelper.startPage(1, 10).doSelectPage(new ISelect() {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void doSelect() {</span></span>
<span class="line"><span>        userMapper.selectGroupBy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>jdk8 lambda用法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Page&lt;User&gt; page = PageHelper.startPage(1, 10).doSelectPage(()-&gt; userMapper.selectGroupBy());</span></span></code></pre></div><p>也可以直接返回PageInfo，注意doSelectPageInfo方法和doSelectPage</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pageInfo = PageHelper.startPage(1, 10).doSelectPageInfo(new ISelect() {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void doSelect() {</span></span>
<span class="line"><span>        userMapper.selectGroupBy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>对应的lambda用法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pageInfo = PageHelper.startPage(1, 10).doSelectPageInfo(() -&gt; userMapper.selectGroupBy());</span></span></code></pre></div><p>count查询，返回一个查询语句的count数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long total = PageHelper.count(new ISelect() {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void doSelect() {</span></span>
<span class="line"><span>        userMapper.selectLike(user);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对应的lambda用法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`java</span></span>
<span class="line"><span>total = PageHelper.count(()-&gt;userMapper.selectLike(user));</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>我们通过如下问题进一步理解PageHelper分页。@pdai</p></blockquote><h3 id="pagehelper是如何实现分页的" tabindex="-1">PageHelper是如何实现分页的？ <a class="header-anchor" href="#pagehelper是如何实现分页的" aria-label="Permalink to &quot;PageHelper是如何实现分页的？&quot;">​</a></h3><blockquote><p>我们知道如何使用PageHelper后，我们发现使用<code>PageHelper.startPage(pageNum, pageSize, orderBy)</code>方法后的第一个select是具备分页能力的，那它是如何做到的呢？</p></blockquote><p>理解它的原理，有两个点：</p><ol><li>第一，相对对于JDBC这种嵌入式的分页而言，PageHelper分页是独立的，能做到独立分页查询，那它<strong>必然是通过某个拦截点进行了拦截，这样它才能够进行解耦分离出分页</strong>。</li><li>第二，我们通过<code>PageHelper.startPage(pageNum, pageSize, orderBy)</code>方法后的第一个select是具备分页能力的，那它<strong>必然缓存了分页信息，同时结合线程知识，这里必然使用的是本地栈ThreadLocal</strong>，即每个线程有一个本地缓存。</li></ol><p>所以结合这两点，聪明的你就会想到它大概是如何实现的，关键就是两点（拦截，ThreadLocal), 我们看下源码：</p><p>简单看下拦截</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Mybatis拦截器方法</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param invocation 拦截器入参</span></span>
<span class="line"><span> * @return 返回执行结果</span></span>
<span class="line"><span> * @throws Throwable 抛出异常</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public Object intercept(Invocation invocation) throws Throwable {</span></span>
<span class="line"><span>    if (autoRuntimeDialect) {</span></span>
<span class="line"><span>        SqlUtil sqlUtil = getSqlUtil(invocation);</span></span>
<span class="line"><span>        return sqlUtil.processPage(invocation);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        if (autoDialect) {</span></span>
<span class="line"><span>            initSqlUtil(invocation);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return sqlUtil.processPage(invocation);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>进而看下<code>sqlUtil.processPage(invocation);</code>方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param invocation 拦截器入参</span></span>
<span class="line"><span> * @return 返回执行结果</span></span>
<span class="line"><span> * @throws Throwable 抛出异常</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private Object _processPage(Invocation invocation) throws Throwable {</span></span>
<span class="line"><span>    final Object[] args = invocation.getArgs();</span></span>
<span class="line"><span>    Page page = null;</span></span>
<span class="line"><span>    //支持方法参数时，会先尝试获取Page</span></span>
<span class="line"><span>    if (supportMethodsArguments) {</span></span>
<span class="line"><span>        // 从线程本地变量中获取Page信息，就是我们刚刚设置的</span></span>
<span class="line"><span>        page = getPage(args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //分页信息</span></span>
<span class="line"><span>    RowBounds rowBounds = (RowBounds) args[2];</span></span>
<span class="line"><span>    //支持方法参数时，如果page == null就说明没有分页条件，不需要分页查询</span></span>
<span class="line"><span>    if ((supportMethodsArguments &amp;&amp; page == null)</span></span>
<span class="line"><span>            //当不支持分页参数时，判断LocalPage和RowBounds判断是否需要分页</span></span>
<span class="line"><span>            || (!supportMethodsArguments &amp;&amp; SqlUtil.getLocalPage() == null &amp;&amp; rowBounds == RowBounds.DEFAULT)) {</span></span>
<span class="line"><span>        return invocation.proceed();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        //不支持分页参数时，page==null，这里需要获取</span></span>
<span class="line"><span>        if (!supportMethodsArguments &amp;&amp; page == null) {</span></span>
<span class="line"><span>            page = getPage(args);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 进入查看</span></span>
<span class="line"><span>        return doProcessPage(invocation, page, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以<code>startPage方法</code>和这里的<code>getPage(args);</code>这方法里应该包含了ThreadLocal中设置和获取分页参数的，让我们看下startPage方法即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &lt;E&gt; Page&lt;E&gt; startPage(int pageNum, int pageSize, boolean count, Boolean reasonable, Boolean pageSizeZero) {</span></span>
<span class="line"><span>    Page&lt;E&gt; page = new Page(pageNum, pageSize, count);</span></span>
<span class="line"><span>    page.setReasonable(reasonable);</span></span>
<span class="line"><span>    page.setPageSizeZero(pageSizeZero);</span></span>
<span class="line"><span>    Page&lt;E&gt; oldPage = getLocalPage();</span></span>
<span class="line"><span>    if (oldPage != null &amp;&amp; oldPage.isOrderByOnly()) {</span></span>
<span class="line"><span>        page.setOrderBy(oldPage.getOrderBy());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    setLocalPage(page);</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span>protected static final ThreadLocal&lt;Page&gt; LOCAL_PAGE = new ThreadLocal();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected static void setLocalPage(Page page) {</span></span>
<span class="line"><span>    LOCAL_PAGE.set(page); // 看这里</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ...</span></span></code></pre></div><blockquote><p>所以这里提示下想进阶的开发者，源码的阅读是伴随着思路现行的（有了思路，简单看源码），而不是直接源码。</p></blockquote><h3 id="使用pagehelper有何注意点" tabindex="-1">使用PageHelper有何注意点 <a class="header-anchor" href="#使用pagehelper有何注意点" aria-label="Permalink to &quot;使用PageHelper有何注意点&quot;">​</a></h3><blockquote><p><a href="https://github.com/pagehelper/Mybatis-PageHelper/blob/master/wikis/zh/Important.md" target="_blank" rel="noreferrer">看官网的说明在新窗口打开</a></p></blockquote><ol><li>只有紧跟在<code>PageHelper.startPage</code>方法后的<strong>第一个</strong>Mybatis的**查询（Select）**方法会被分页。</li><li>请不要配置多个分页插件：请不要在系统中配置多个分页插件(使用Spring时,<code>mybatis-config.xml</code>和<code>Spring&lt;bean&gt;</code>配置方式，请选择其中一种，不要同时配置多个分页插件)！</li><li>分页插件不支持带有<code>for update</code>语句的分页：对于带有<code>for update</code>的sql，会抛出运行时异常，对于这样的sql建议手动分页，毕竟这样的sql需要重视。</li><li>分页插件不支持嵌套结果映射: 由于嵌套结果方式会导致结果集被折叠，因此分页查询的结果在折叠后总数会减少，所以无法保证分页结果数量正确。</li></ol><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p>（上述代码中一些实体类和配置的完整代码，请参考如下代码仓库）</p><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,76)]))}const h=s(l,[["render",t]]);export{u as __pageData,h as default};
