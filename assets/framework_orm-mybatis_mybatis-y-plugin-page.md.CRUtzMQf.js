import{_ as n,c as s,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"MyBatis详解 - 插件之分页机制","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-plugin-page.md","filePath":"framework/orm-mybatis/mybatis-y-plugin-page.md","lastUpdated":1737706346000}'),t={name:"framework/orm-mybatis/mybatis-y-plugin-page.md"};function l(i,a,c,r,o,u){return p(),s("div",null,a[0]||(a[0]=[e(`<h1 id="mybatis详解-插件之分页机制" tabindex="-1">MyBatis详解 - 插件之分页机制 <a class="header-anchor" href="#mybatis详解-插件之分页机制" aria-label="Permalink to &quot;MyBatis详解 - 插件之分页机制&quot;">​</a></h1><blockquote><p>Mybatis的分页功能很弱，它是基于内存的分页（查出所有记录再按偏移量和limit取结果），在大数据量的情况下这样的分页基本上是没有用的。本文基于插件，通过拦截StatementHandler重写sql语句，实现数据库的物理分页。@pdai</p></blockquote><h2 id="准备" tabindex="-1">准备 <a class="header-anchor" href="#准备" aria-label="Permalink to &quot;准备&quot;">​</a></h2><h3 id="为什么在statementhandler拦截" tabindex="-1">为什么在StatementHandler拦截 <a class="header-anchor" href="#为什么在statementhandler拦截" aria-label="Permalink to &quot;为什么在StatementHandler拦截&quot;">​</a></h3><p>在前面章节介绍了一次sqlsession的完整执行过程，从中可以知道sql的解析是在StatementHandler里完成的，所以为了重写sql需要拦截StatementHandler。</p><h3 id="metaobject简介" tabindex="-1">MetaObject简介 <a class="header-anchor" href="#metaobject简介" aria-label="Permalink to &quot;MetaObject简介&quot;">​</a></h3><p>在实现里大量使用了MetaObject这个对象，因此有必要先介绍下它。MetaObject是Mybatis提供的一个的工具类，通过它包装一个对象后可以获取或设置该对象的原本不可访问的属性（比如那些私有属性）。它有个三个重要方法经常用到：</p><ul><li><p>MetaObject forObject(Object object,ObjectFactory objectFactory, ObjectWrapperFactory objectWrapperFactory) 用于包装对象；</p></li><li><p>Object getValue(String name) 用于获取属性的值（支持OGNL的方法）；</p></li><li><p>void setValue(String name, Object value) 用于设置属性的值（支持OGNL的方法）；</p></li></ul><h2 id="拦截器签名" tabindex="-1">拦截器签名 <a class="header-anchor" href="#拦截器签名" aria-label="Permalink to &quot;拦截器签名&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Intercepts({@Signature(type =StatementHandler.class, method = &quot;prepare&quot;, args ={Connection.class})})  </span></span>
<span class="line"><span>public class PageInterceptor implements Interceptor {  </span></span>
<span class="line"><span>    ...  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从签名里可以看出，要拦截的目标类型是StatementHandler（注意：type只能配置成接口类型），拦截的方法是名称为prepare参数为Connection类型的方法。</p><h2 id="intercept实现" tabindex="-1">intercept实现 <a class="header-anchor" href="#intercept实现" aria-label="Permalink to &quot;intercept实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object intercept(Invocation invocation) throws Throwable {  </span></span>
<span class="line"><span>     StatementHandler statementHandler = (StatementHandler) invocation.getTarget();  </span></span>
<span class="line"><span>     MetaObject metaStatementHandler = MetaObject.forObject(statementHandler,  </span></span>
<span class="line"><span>     DEFAULT_OBJECT_FACTORY, DEFAULT_OBJECT_WRAPPER_FACTORY);  </span></span>
<span class="line"><span>     // 分离代理对象链(由于目标类可能被多个拦截器拦截，从而形成多次代理，通过下面的两次循环  </span></span>
<span class="line"><span>     // 可以分离出最原始的的目标类)  </span></span>
<span class="line"><span>     while (metaStatementHandler.hasGetter(&quot;h&quot;)) {  </span></span>
<span class="line"><span>         Object object = metaStatementHandler.getValue(&quot;h&quot;);  </span></span>
<span class="line"><span>         metaStatementHandler = MetaObject.forObject(object, DEFAULT_OBJECT_FACTORY,   </span></span>
<span class="line"><span>         DEFAULT_OBJECT_WRAPPER_FACTORY);  </span></span>
<span class="line"><span>     }  </span></span>
<span class="line"><span>     // 分离最后一个代理对象的目标类  </span></span>
<span class="line"><span>     while (metaStatementHandler.hasGetter(&quot;target&quot;)) {  </span></span>
<span class="line"><span>         Object object = metaStatementHandler.getValue(&quot;target&quot;);  </span></span>
<span class="line"><span>         metaStatementHandler = MetaObject.forObject(object, DEFAULT_OBJECT_FACTORY,   </span></span>
<span class="line"><span>         DEFAULT_OBJECT_WRAPPER_FACTORY);  </span></span>
<span class="line"><span>     }  </span></span>
<span class="line"><span>     Configuration configuration = (Configuration) metaStatementHandler.  </span></span>
<span class="line"><span>     getValue(&quot;delegate.configuration&quot;);  </span></span>
<span class="line"><span>     dialect = configuration.getVariables().getProperty(&quot;dialect&quot;);  </span></span>
<span class="line"><span>     if (null == dialect || &quot;&quot;.equals(dialect)) {  </span></span>
<span class="line"><span>         logger.warn(&quot;Property dialect is not setted,use default &#39;mysql&#39; &quot;);  </span></span>
<span class="line"><span>         dialect = defaultDialect;  </span></span>
<span class="line"><span>     }  </span></span>
<span class="line"><span>     pageSqlId = configuration.getVariables().getProperty(&quot;pageSqlId&quot;);  </span></span>
<span class="line"><span>     if (null == pageSqlId || &quot;&quot;.equals(pageSqlId)) {  </span></span>
<span class="line"><span>         logger.warn(&quot;Property pageSqlId is not setted,use default &#39;.*Page$&#39; &quot;);  </span></span>
<span class="line"><span>         pageSqlId = defaultPageSqlId;  </span></span>
<span class="line"><span>     }  </span></span>
<span class="line"><span>     MappedStatement mappedStatement = (MappedStatement)   </span></span>
<span class="line"><span>     metaStatementHandler.getValue(&quot;delegate.mappedStatement&quot;);  </span></span>
<span class="line"><span>     // 只重写需要分页的sql语句。通过MappedStatement的ID匹配，默认重写以Page结尾的  </span></span>
<span class="line"><span>     //  MappedStatement的sql  </span></span>
<span class="line"><span>     if (mappedStatement.getId().matches(pageSqlId)) {  </span></span>
<span class="line"><span>         BoundSql boundSql = (BoundSql) metaStatementHandler.getValue(&quot;delegate.boundSql&quot;);  </span></span>
<span class="line"><span>         Object parameterObject = boundSql.getParameterObject();  </span></span>
<span class="line"><span>         if (parameterObject == null) {  </span></span>
<span class="line"><span>             throw new NullPointerException(&quot;parameterObject is null!&quot;);  </span></span>
<span class="line"><span>         } else {  </span></span>
<span class="line"><span>             // 分页参数作为参数对象parameterObject的一个属性  </span></span>
<span class="line"><span>             PageParameter page = (PageParameter) metaStatementHandler  </span></span>
<span class="line"><span>                     .getValue(&quot;delegate.boundSql.parameterObject.page&quot;);  </span></span>
<span class="line"><span>             String sql = boundSql.getSql();  </span></span>
<span class="line"><span>             // 重写sql  </span></span>
<span class="line"><span>             String pageSql = buildPageSql(sql, page);  </span></span>
<span class="line"><span>             metaStatementHandler.setValue(&quot;delegate.boundSql.sql&quot;, pageSql);  </span></span>
<span class="line"><span>             // 采用物理分页后，就不需要mybatis的内存分页了，所以重置下面的两个参数  </span></span>
<span class="line"><span>             metaStatementHandler.setValue(&quot;delegate.rowBounds.offset&quot;,   </span></span>
<span class="line"><span>             RowBounds.NO_ROW_OFFSET);  </span></span>
<span class="line"><span>             metaStatementHandler.setValue(&quot;delegate.rowBounds.limit&quot;, RowBounds.NO_ROW_LIMIT);  </span></span>
<span class="line"><span>             Connection connection = (Connection) invocation.getArgs()[0];  </span></span>
<span class="line"><span>             // 重设分页参数里的总页数等  </span></span>
<span class="line"><span>             setPageParameter(sql, connection, mappedStatement, boundSql, page);  </span></span>
<span class="line"><span>         }  </span></span>
<span class="line"><span>     }  </span></span>
<span class="line"><span>     // 将执行权交给下一个拦截器  </span></span>
<span class="line"><span>     return invocation.proceed();  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>StatementHandler的默认实现类是RoutingStatementHandler，因此拦截的实际对象是它。RoutingStatementHandler的主要功能是分发，它根据配置Statement类型创建真正执行数据库操作的StatementHandler，并将其保存到delegate属性里。由于delegate是一个私有属性并且没有提供访问它的方法，因此需要借助MetaObject的帮忙。通过MetaObject的封装后我们可以轻易的获得想要的属性。</p><p>在上面的方法里有个两个循环，通过他们可以分离出原始的RoutingStatementHandler（而不是代理对象）。</p><p>前面提到，签名里配置的要拦截的目标类型是StatementHandler拦截的方法是名称为prepare参数为Connection类型的方法，而这个方法是每次数据库访问都要执行的。因为我是通过重写sql的方式实现分页，为了不影响其他sql（update或不需要分页的query），我采用了通过ID匹配的方式过滤。默认的过滤方式只对id以Page结尾的进行拦截（注意区分大小写），如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;queryUserByPage&quot; parameterType=&quot;UserDto&quot; resultType=&quot;UserDto&quot;&gt;  </span></span>
<span class="line"><span>    &lt;![CDATA[ </span></span>
<span class="line"><span>    select * from t_user t where t.username = #{username} </span></span>
<span class="line"><span>    ]]&gt;  </span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><p>当然，也可以自定义拦截模式，在mybatis的配置文件里加入以下配置项：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;properties&gt;  </span></span>
<span class="line"><span>    &lt;property name=&quot;dialect&quot; value=&quot;mysql&quot; /&gt;  </span></span>
<span class="line"><span>    &lt;property name=&quot;pageSqlId&quot; value=&quot;.*Page$&quot; /&gt;  </span></span>
<span class="line"><span>&lt;/properties&gt;</span></span></code></pre></div><p>其中，属性dialect指示数据库类型，目前只支持mysql和oracle两种数据库。其中，属性pageSqlId指示拦截的规则，以正则方式匹配。</p><h2 id="sql重写" tabindex="-1">sql重写 <a class="header-anchor" href="#sql重写" aria-label="Permalink to &quot;sql重写&quot;">​</a></h2><p>sql重写其实在原始的sql语句上加入分页的参数，目前支持mysql和oracle两种数据库的分页。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private String buildPageSql(String sql, PageParameter page) {  </span></span>
<span class="line"><span>    if (page != null) {  </span></span>
<span class="line"><span>        StringBuilder pageSql = new StringBuilder();  </span></span>
<span class="line"><span>        if (&quot;mysql&quot;.equals(dialect)) {  </span></span>
<span class="line"><span>            pageSql = buildPageSqlForMysql(sql, page);  </span></span>
<span class="line"><span>        } else if (&quot;oracle&quot;.equals(dialect)) {  </span></span>
<span class="line"><span>            pageSql = buildPageSqlForOracle(sql, page);  </span></span>
<span class="line"><span>        } else {  </span></span>
<span class="line"><span>            return sql;  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return pageSql.toString();  </span></span>
<span class="line"><span>    } else {  </span></span>
<span class="line"><span>        return sql;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>mysql的分页实现</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public StringBuilder buildPageSqlForMysql(String sql, PageParameter page) {  </span></span>
<span class="line"><span>    StringBuilder pageSql = new StringBuilder(100);  </span></span>
<span class="line"><span>    String beginrow = String.valueOf((page.getCurrentPage() - 1) * page.getPageSize());  </span></span>
<span class="line"><span>    pageSql.append(sql);  </span></span>
<span class="line"><span>    pageSql.append(&quot; limit &quot; + beginrow + &quot;,&quot; + page.getPageSize());  </span></span>
<span class="line"><span>    return pageSql;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>oracle的分页实现</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public StringBuilder buildPageSqlForOracle(String sql, PageParameter page) {  </span></span>
<span class="line"><span>    StringBuilder pageSql = new StringBuilder(100);  </span></span>
<span class="line"><span>    String beginrow = String.valueOf((page.getCurrentPage() - 1) * page.getPageSize());  </span></span>
<span class="line"><span>    String endrow = String.valueOf(page.getCurrentPage() * page.getPageSize());  </span></span>
<span class="line"><span>    pageSql.append(&quot;select * from ( select temp.*, rownum row_id from ( &quot;);  </span></span>
<span class="line"><span>    pageSql.append(sql);  </span></span>
<span class="line"><span>    pageSql.append(&quot; ) temp where rownum &lt;= &quot;).append(endrow);  </span></span>
<span class="line"><span>    pageSql.append(&quot;) where row_id &gt; &quot;).append(beginrow);  </span></span>
<span class="line"><span>    return pageSql;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="分页参数重写" tabindex="-1">分页参数重写 <a class="header-anchor" href="#分页参数重写" aria-label="Permalink to &quot;分页参数重写&quot;">​</a></h2><p>有时候会有这种需求，就是不但要查出指定页的结果，还需要知道总的记录数和页数。我通过重写分页参数的方式提供了一种解决方案：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** </span></span>
<span class="line"><span> * 从数据库里查询总的记录数并计算总页数，回写进分页参数&lt;code&gt;PageParameter&lt;/code&gt;,这样调用  </span></span>
<span class="line"><span> * 者就可用通过 分页参数&lt;code&gt;PageParameter&lt;/code&gt;获得相关信息。 </span></span>
<span class="line"><span> *  </span></span>
<span class="line"><span> * @param sql </span></span>
<span class="line"><span> * @param connection </span></span>
<span class="line"><span> * @param mappedStatement </span></span>
<span class="line"><span> * @param boundSql </span></span>
<span class="line"><span> * @param page </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>private void setPageParameter(String sql, Connection connection, MappedStatement mappedStatement,  </span></span>
<span class="line"><span>        BoundSql boundSql, PageParameter page) {  </span></span>
<span class="line"><span>    // 记录总记录数  </span></span>
<span class="line"><span>    String countSql = &quot;select count(0) from (&quot; + sql + &quot;) as total&quot;;  </span></span>
<span class="line"><span>    PreparedStatement countStmt = null;  </span></span>
<span class="line"><span>    ResultSet rs = null;  </span></span>
<span class="line"><span>    try {  </span></span>
<span class="line"><span>        countStmt = connection.prepareStatement(countSql);  </span></span>
<span class="line"><span>        BoundSql countBS = new BoundSql(mappedStatement.getConfiguration(), countSql,  </span></span>
<span class="line"><span>                boundSql.getParameterMappings(), boundSql.getParameterObject());  </span></span>
<span class="line"><span>        setParameters(countStmt, mappedStatement, countBS, boundSql.getParameterObject());  </span></span>
<span class="line"><span>        rs = countStmt.executeQuery();  </span></span>
<span class="line"><span>        int totalCount = 0;  </span></span>
<span class="line"><span>        if (rs.next()) {  </span></span>
<span class="line"><span>            totalCount = rs.getInt(1);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        page.setTotalCount(totalCount);  </span></span>
<span class="line"><span>        int totalPage = totalCount / page.getPageSize() + ((totalCount % page.getPageSize() == 0) ? 0 : 1);  </span></span>
<span class="line"><span>        page.setTotalPage(totalPage);  </span></span>
<span class="line"><span>    } catch (SQLException e) {  </span></span>
<span class="line"><span>        logger.error(&quot;Ignore this exception&quot;, e);  </span></span>
<span class="line"><span>    } finally {  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            rs.close();  </span></span>
<span class="line"><span>        } catch (SQLException e) {  </span></span>
<span class="line"><span>            logger.error(&quot;Ignore this exception&quot;, e);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            countStmt.close();  </span></span>
<span class="line"><span>        } catch (SQLException e) {  </span></span>
<span class="line"><span>            logger.error(&quot;Ignore this exception&quot;, e);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>/** </span></span>
<span class="line"><span> * 对SQL参数(?)设值 </span></span>
<span class="line"><span> *  </span></span>
<span class="line"><span> * @param ps </span></span>
<span class="line"><span> * @param mappedStatement </span></span>
<span class="line"><span> * @param boundSql </span></span>
<span class="line"><span> * @param parameterObject </span></span>
<span class="line"><span> * @throws SQLException </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>private void setParameters(PreparedStatement ps, MappedStatement mappedStatement, BoundSql boundSql,  </span></span>
<span class="line"><span>        Object parameterObject) throws SQLException {  </span></span>
<span class="line"><span>    ParameterHandler parameterHandler = new DefaultParameterHandler(mappedStatement, parameterObject, boundSql);  </span></span>
<span class="line"><span>    parameterHandler.setParameters(ps);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="plugin实现" tabindex="-1">plugin实现 <a class="header-anchor" href="#plugin实现" aria-label="Permalink to &quot;plugin实现&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object plugin(Object target) {  </span></span>
<span class="line"><span>    // 当目标类是StatementHandler类型时，才包装目标类，否者直接返回目标本身,减少目标被代理的  </span></span>
<span class="line"><span>    // 次数  </span></span>
<span class="line"><span>    if (target instanceof StatementHandler) {  </span></span>
<span class="line"><span>        return Plugin.wrap(target, this);  </span></span>
<span class="line"><span>    } else {  </span></span>
<span class="line"><span>        return target;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,33)]))}const m=n(t,[["render",l]]);export{g as __pageData,m as default};
