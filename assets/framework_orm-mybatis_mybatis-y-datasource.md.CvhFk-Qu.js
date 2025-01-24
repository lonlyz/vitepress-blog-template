import{_ as s,c as a,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const o="/vitepress-blog-template/images/mybatis/mybatis-y-datasource-2.png",t="/vitepress-blog-template/images/mybatis/mybatis-y-datasource-3.png",l="/vitepress-blog-template/images/mybatis/mybatis-y-datasource-4.png",i="/vitepress-blog-template/images/mybatis/mybatis-y-datasource-5.png",c="/vitepress-blog-template/images/mybatis/mybatis-y-datasource-6.png",r="/vitepress-blog-template/images/mybatis/mybatis-y-datasource-7.png",S=JSON.parse('{"title":"MyBatis详解 - 数据源与连接池","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-datasource.md","filePath":"framework/orm-mybatis/mybatis-y-datasource.md","lastUpdated":1737706346000}'),u={name:"framework/orm-mybatis/mybatis-y-datasource.md"};function d(g,n,C,m,h,b){return p(),a("div",null,n[0]||(n[0]=[e('<h1 id="mybatis详解-数据源与连接池" tabindex="-1">MyBatis详解 - 数据源与连接池 <a class="header-anchor" href="#mybatis详解-数据源与连接池" aria-label="Permalink to &quot;MyBatis详解 - 数据源与连接池&quot;">​</a></h1><blockquote><p>本文主要介绍MyBatis数据源和连接池相关的内容。@pdai</p></blockquote><h2 id="mybatis数据源datasource分类" tabindex="-1">MyBatis数据源DataSource分类 <a class="header-anchor" href="#mybatis数据源datasource分类" aria-label="Permalink to &quot;MyBatis数据源DataSource分类&quot;">​</a></h2><p>MyBatis把数据源DataSource分为三种：</p><ul><li>UNPOOLED 不使用连接池的数据源</li><li>POOLED 使用连接池的数据源</li><li>JNDI 使用JNDI实现的数据源</li></ul><p>相应地，MyBatis内部分别定义了实现了java.sql.DataSource接口的UnpooledDataSource，PooledDataSource类来表示UNPOOLED、POOLED类型的数据源。</p><p><img src="'+o+`" alt="error.图片加载失败"></p><p>对于JNDI类型的数据源DataSource，则是通过JNDI上下文中取值。</p><h2 id="官网datasource配置内容清单" tabindex="-1">官网DataSource配置内容清单 <a class="header-anchor" href="#官网datasource配置内容清单" aria-label="Permalink to &quot;官网DataSource配置内容清单&quot;">​</a></h2><p>dataSource 元素使用标准的 JDBC 数据源接口来配置 JDBC 连接对象的资源。</p><p>大多数 MyBatis 应用程序会按示例中的例子来配置数据源。虽然数据源配置是可选的，但如果要启用延迟加载特性，就必须配置数据源。 有三种内建的数据源类型（也就是 <code>type=&quot;[UNPOOLED|POOLED|JNDI]&quot;</code>）：</p><h3 id="unpooled" tabindex="-1">UNPOOLED <a class="header-anchor" href="#unpooled" aria-label="Permalink to &quot;UNPOOLED&quot;">​</a></h3><p>这个数据源的实现会每次请求时打开和关闭连接。虽然有点慢，但对那些数据库连接可用性要求不高的简单应用程序来说，是一个很好的选择。 性能表现则依赖于使用的数据库，对某些数据库来说，使用连接池并不重要，这个配置就很适合这种情形。UNPOOLED 类型的数据源仅仅需要配置以下 5 种属性：</p><ul><li>driver – 这是 JDBC 驱动的 Java 类全限定名（并不是 JDBC 驱动中可能包含的数据源类）。</li><li>url – 这是数据库的 JDBC URL 地址。</li><li>username – 登录数据库的用户名。</li><li>password – 登录数据库的密码。</li><li>defaultTransactionIsolationLevel – 默认的连接事务隔离级别。</li><li>defaultNetworkTimeout – 等待数据库操作完成的默认网络超时时间（单位：毫秒）。查看 java.sql.Connection#setNetworkTimeout() 的 API 文档以获取更多信息。</li></ul><p>作为可选项，你也可以传递属性给数据库驱动。只需在属性名加上“driver.”前缀即可，例如：</p><ul><li>driver.encoding=UTF8</li></ul><p>这将通过 DriverManager.getConnection(url, driverProperties) 方法传递值为 UTF8 的 encoding 属性给数据库驱动。</p><h3 id="pooled" tabindex="-1">POOLED <a class="header-anchor" href="#pooled" aria-label="Permalink to &quot;POOLED&quot;">​</a></h3><p>这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来，避免了创建新的连接实例时所必需的初始化和认证时间。 这种处理方式很流行，能使并发 Web 应用快速响应请求。</p><p>除了上述提到 UNPOOLED 下的属性外，还有更多属性用来配置 POOLED 的数据源：</p><ul><li>poolMaximumActiveConnections – 在任意时间可存在的活动（正在使用）连接数量，默认值：10</li><li>poolMaximumIdleConnections – 任意时间可能存在的空闲连接数。</li><li>poolMaximumCheckoutTime – 在被强制返回之前，池中连接被检出（checked out）时间，默认值：20000 毫秒（即 20 秒）</li><li>poolTimeToWait – 这是一个底层设置，如果获取连接花费了相当长的时间，连接池会打印状态日志并重新尝试获取一个连接（避免在误配置的情况下一直失败且不打印日志），默认值：20000 毫秒（即 20 秒）。</li><li>poolMaximumLocalBadConnectionTolerance – 这是一个关于坏连接容忍度的底层设置， 作用于每一个尝试从缓存池获取连接的线程。 如果这个线程获取到的是一个坏的连接，那么这个数据源允许这个线程尝试重新获取一个新的连接，但是这个重新尝试的次数不应该超过 poolMaximumIdleConnections 与 poolMaximumLocalBadConnectionTolerance 之和。 默认值：3（新增于 3.4.5）</li><li>poolPingQuery – 发送到数据库的侦测查询，用来检验连接是否正常工作并准备接受请求。默认是“NO PING QUERY SET”，这会导致多数数据库驱动出错时返回恰当的错误消息。</li><li>poolPingEnabled – 是否启用侦测查询。若开启，需要设置 poolPingQuery 属性为一个可执行的 SQL 语句（最好是一个速度非常快的 SQL 语句），默认值：false。</li><li>poolPingConnectionsNotUsedFor – 配置 poolPingQuery 的频率。可以被设置为和数据库连接超时时间一样，来避免不必要的侦测，默认值：0（即所有连接每一时刻都被侦测 — 当然仅当 poolPingEnabled 为 true 时适用）。</li></ul><h3 id="jndi" tabindex="-1">JNDI <a class="header-anchor" href="#jndi" aria-label="Permalink to &quot;JNDI&quot;">​</a></h3><p>这个数据源实现是为了能在如 EJB 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个 JNDI 上下文的数据源引用。这种数据源配置只需要两个属性：</p><ul><li>initial_context – 这个属性用来在 InitialContext 中寻找上下文（即，initialContext.lookup(initial_context)）。这是个可选属性，如果忽略，那么将会直接从 InitialContext 中寻找 data_source 属性。</li><li>data_source – 这是引用数据源实例位置的上下文路径。提供了 initial_context 配置时会在其返回的上下文中进行查找，没有提供时则直接在 InitialContext 中查找。</li></ul><p>和其他数据源配置类似，可以通过添加前缀“env.”直接把属性传递给 InitialContext。比如：</p><ul><li>env.encoding=UTF8</li></ul><p>这就会在 InitialContext 实例化时往它的构造方法传递值为 UTF8 的 encoding 属性。</p><p>你可以通过实现接口 org.apache.ibatis.datasource.DataSourceFactory 来使用第三方数据源实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface DataSourceFactory {</span></span>
<span class="line"><span>  void setProperties(Properties props);</span></span>
<span class="line"><span>  DataSource getDataSource();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>org.apache.ibatis.datasource.unpooled.UnpooledDataSourceFactory 可被用作父类来构建新的数据源适配器，比如下面这段插入 C3P0 数据源所必需的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.apache.ibatis.datasource.unpooled.UnpooledDataSourceFactory;</span></span>
<span class="line"><span>import com.mchange.v2.c3p0.ComboPooledDataSource;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class C3P0DataSourceFactory extends UnpooledDataSourceFactory {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public C3P0DataSourceFactory() {</span></span>
<span class="line"><span>    this.dataSource = new ComboPooledDataSource();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了令其工作，记得在配置文件中为每个希望 MyBatis 调用的 setter 方法增加对应的属性。 下面是一个可以连接至 PostgreSQL 数据库的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dataSource type=&quot;org.myproject.C3P0DataSourceFactory&quot;&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;driver&quot; value=&quot;org.postgresql.Driver&quot;/&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;url&quot; value=&quot;jdbc:postgresql:mydb&quot;/&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;username&quot; value=&quot;postgres&quot;/&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;password&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>&lt;/dataSource&gt;</span></span></code></pre></div><h2 id="数据源datasource的创建过程" tabindex="-1">数据源DataSource的创建过程 <a class="header-anchor" href="#数据源datasource的创建过程" aria-label="Permalink to &quot;数据源DataSource的创建过程&quot;">​</a></h2><p>MyBatis数据源DataSource对象的创建发生在MyBatis初始化的过程中。下面让我们一步步地了解MyBatis是如何创建数据源DataSource的。</p><p>在mybatis的XML配置文件中，使用<code>&lt;dataSource&gt;</code>元素来配置数据源：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dataSource type=&quot;org.myproject.C3P0DataSourceFactory&quot;&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;driver&quot; value=&quot;org.postgresql.Driver&quot;/&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;url&quot; value=&quot;jdbc:postgresql:mydb&quot;/&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;username&quot; value=&quot;postgres&quot;/&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;password&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>&lt;/dataSource&gt;</span></span></code></pre></div><p>MyBatis在初始化时，解析此文件，根据<code>&lt;dataSource&gt;</code>的type属性来创建相应类型的的数据源DataSource，即：</p><ul><li>type=”POOLED” ：MyBatis会创建PooledDataSource实例</li><li>type=”UNPOOLED” ：MyBatis会创建UnpooledDataSource实例</li><li>type=”JNDI” ：MyBatis会从JNDI服务上查找DataSource实例，然后返回使用</li></ul><p>顺便说一下，MyBatis是通过工厂模式来创建数据源DataSource对象的，MyBatis定义了抽象的工厂接口:org.apache.ibatis.datasource.DataSourceFactory,通过其getDataSource()方法返回数据源DataSource：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface DataSourceFactory { </span></span>
<span class="line"><span>    void setProperties(Properties props);  </span></span>
<span class="line"><span>    // 生产DataSource  </span></span>
<span class="line"><span>    DataSource getDataSource();  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述三种不同类型的type，则有对应的以下dataSource工厂：</p><ul><li>POOLED PooledDataSourceFactory</li><li>UNPOOLED UnpooledDataSourceFactory</li><li>JNDI JndiDataSourceFactory</li></ul><p>其类图如下所示：</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>MyBatis创建了DataSource实例后，会将其放到Configuration对象内的Environment对象中，供以后使用。</p><h2 id="datasource什么时候创建connection对象" tabindex="-1">DataSource什么时候创建Connection对象 <a class="header-anchor" href="#datasource什么时候创建connection对象" aria-label="Permalink to &quot;DataSource什么时候创建Connection对象&quot;">​</a></h2><p>当我们需要创建SqlSession对象并需要执行SQL语句时，这时候MyBatis才会去调用dataSource对象来创建java.sql.Connection对象。也就是说，java.sql.Connection对象的创建一直延迟到执行SQL语句的时候。</p><p>比如，我们有如下方法执行一个简单的SQL语句：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String resource = &quot;mybatis-config.xml&quot;;  </span></span>
<span class="line"><span>InputStream inputStream = Resources.getResourceAsStream(resource);  </span></span>
<span class="line"><span>SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);  </span></span>
<span class="line"><span>SqlSession sqlSession = sqlSessionFactory.openSession();  </span></span>
<span class="line"><span>sqlSession.selectList(&quot;SELECT * FROM STUDENTS&quot;);</span></span></code></pre></div><p>前4句都不会导致java.sql.Connection对象的创建，只有当第5句sqlSession.selectList(&quot;SELECT * FROM STUDENTS&quot;)，才会触发MyBatis在底层执行下面这个方法来创建java.sql.Connection对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void openConnection() throws SQLException {  </span></span>
<span class="line"><span>    if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>        log.debug(&quot;Opening JDBC Connection&quot;);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    connection = dataSource.getConnection();  </span></span>
<span class="line"><span>    if (level != null) {  </span></span>
<span class="line"><span>        connection.setTransactionIsolation(level.getLevel());  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    setDesiredAutoCommit(autoCommmit);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="不使用连接池的unpooleddatasource" tabindex="-1">不使用连接池的UnpooledDataSource <a class="header-anchor" href="#不使用连接池的unpooleddatasource" aria-label="Permalink to &quot;不使用连接池的UnpooledDataSource&quot;">​</a></h2><p>当 <code>&lt;dataSource&gt;</code>的type属性被配置成了”UNPOOLED”，MyBatis首先会实例化一个UnpooledDataSourceFactory工厂实例，然后通过.getDataSource()方法返回一个UnpooledDataSource实例对象引用，我们假定为dataSource。</p><p>使用UnpooledDataSource的getConnection(),每调用一次就会产生一个新的Connection实例对象。</p><p>UnPooledDataSource的getConnection()方法实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * UnpooledDataSource的getConnection()实现 </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>public Connection getConnection() throws SQLException  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    return doGetConnection(username, password);  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>private Connection doGetConnection(String username, String password) throws SQLException  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    //封装username和password成properties  </span></span>
<span class="line"><span>    Properties props = new Properties();  </span></span>
<span class="line"><span>    if (driverProperties != null)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        props.putAll(driverProperties);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    if (username != null)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        props.setProperty(&quot;user&quot;, username);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    if (password != null)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        props.setProperty(&quot;password&quot;, password);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    return doGetConnection(props);  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>/* </span></span>
<span class="line"><span> *  获取数据连接 </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>private Connection doGetConnection(Properties properties) throws SQLException  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    //1.初始化驱动  </span></span>
<span class="line"><span>    initializeDriver();  </span></span>
<span class="line"><span>    //2.从DriverManager中获取连接，获取新的Connection对象  </span></span>
<span class="line"><span>    Connection connection = DriverManager.getConnection(url, properties);  </span></span>
<span class="line"><span>    //3.配置connection属性  </span></span>
<span class="line"><span>    configureConnection(connection);  </span></span>
<span class="line"><span>    return connection;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上代码所示，UnpooledDataSource会做以下事情：</p><ul><li><strong>初始化驱动</strong>：判断driver驱动是否已经加载到内存中，如果还没有加载，则会动态地加载driver类，并实例化一个Driver对象，使用DriverManager.registerDriver()方法将其注册到内存中，以供后续使用。</li><li><strong>创建Connection对象</strong>：使用DriverManager.getConnection()方法创建连接。</li><li><strong>配置Connection对象</strong>：设置是否自动提交autoCommit和隔离级别isolationLevel。</li><li><strong>返回Connection对象</strong>。</li></ul><p>上述的序列图如下所示：</p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>总结：从上述的代码中可以看到，我们每调用一次getConnection()方法，都会通过DriverManager.getConnection()返回新的java.sql.Connection实例。</p><h2 id="为什么要使用连接池" tabindex="-1">为什么要使用连接池 <a class="header-anchor" href="#为什么要使用连接池" aria-label="Permalink to &quot;为什么要使用连接池&quot;">​</a></h2><ul><li><strong>创建一个java.sql.Connection实例对象的代价</strong></li></ul><p>首先让我们来看一下创建一个java.sql.Connection对象的资源消耗。我们通过连接Oracle数据库，创建创建Connection对象，来看创建一个Connection对象、执行SQL语句各消耗多长时间。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws Exception  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   String sql = &quot;select * from hr.employees where employee_id &lt; ? and employee_id &gt;= ?&quot;;  </span></span>
<span class="line"><span>   PreparedStatement st = null;  </span></span>
<span class="line"><span>   ResultSet rs = null;  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   long beforeTimeOffset = -1L; //创建Connection对象前时间  </span></span>
<span class="line"><span>   long afterTimeOffset = -1L; //创建Connection对象后时间  </span></span>
<span class="line"><span>   long executeTimeOffset = -1L; //创建Connection对象后时间  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   Connection con = null;  </span></span>
<span class="line"><span>   Class.forName(&quot;oracle.jdbc.driver.OracleDriver&quot;);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   beforeTimeOffset = new Date().getTime();  </span></span>
<span class="line"><span>   System.out.println(&quot;before:\\t&quot; + beforeTimeOffset);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   con = DriverManager.getConnection(&quot;jdbc:oracle:thin:@127.0.0.1:1521:xe&quot;, &quot;louluan&quot;, &quot;123456&quot;);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   afterTimeOffset = new Date().getTime();  </span></span>
<span class="line"><span>   System.out.println(&quot;after:\\t\\t&quot; + afterTimeOffset);  </span></span>
<span class="line"><span>   System.out.println(&quot;Create Costs:\\t\\t&quot; + (afterTimeOffset - beforeTimeOffset) + &quot; ms&quot;);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   st = con.prepareStatement(sql);  </span></span>
<span class="line"><span>   //设置参数  </span></span>
<span class="line"><span>   st.setInt(1, 101);  </span></span>
<span class="line"><span>   st.setInt(2, 0);  </span></span>
<span class="line"><span>   //查询，得出结果集  </span></span>
<span class="line"><span>   rs = st.executeQuery();  </span></span>
<span class="line"><span>   executeTimeOffset = new Date().getTime();  </span></span>
<span class="line"><span>   System.out.println(&quot;Exec Costs:\\t\\t&quot; + (executeTimeOffset - afterTimeOffset) + &quot; ms&quot;);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述程序的执行结果为：</p><p><img src="`+i+'" alt="error.图片加载失败"></p><p>从此结果可以清楚地看出，创建一个Connection对象，用了250 毫秒；而执行SQL的时间用了170毫秒。</p><p>创建一个Connection对象用了250毫秒！这个时间对计算机来说可以说是一个非常奢侈的！</p><p>这仅仅是一个Connection对象就有这么大的代价，设想一下另外一种情况：如果我们在Web应用程序中，为用户的每一个请求就操作一次数据库，当有10000个在线用户并发操作的话，对计算机而言，仅仅创建Connection对象不包括做业务的时间就要损耗10000×250ms= 250 0000 ms = 2500 s = 41.6667 min,竟然要41分钟！！！如果对高用户群体使用这样的系统，简直就是开玩笑！</p><ul><li><strong>问题分析</strong>：</li></ul><p>创建一个java.sql.Connection对象的代价是如此巨大，是因为创建一个Connection对象的过程，在底层就相当于和数据库建立的通信连接，在建立通信连接的过程，消耗了这么多的时间，而往往我们建立连接后（即创建Connection对象后），就执行一个简单的SQL语句，然后就要抛弃掉，这是一个非常大的资源浪费！</p><ul><li><strong>解决方案</strong>：</li></ul><p>对于需要频繁地跟数据库交互的应用程序，可以在创建了Connection对象，并操作完数据库后，可以不释放掉资源，而是将它放到内存中，当下次需要操作数据库时，可以直接从内存中取出Connection对象，不需要再创建了，这样就极大地节省了创建Connection对象的资源消耗。由于内存也是有限和宝贵的，这又对我们对内存中的Connection对象怎么有效地维护提出了很高的要求。我们将在内存中存放Connection对象的容器称之为连接池（Connection Pool）。下面让我们来看一下MyBatis的线程池是怎样实现的。</p><h2 id="使用了连接池的pooleddatasource" tabindex="-1">使用了连接池的PooledDataSource <a class="header-anchor" href="#使用了连接池的pooleddatasource" aria-label="Permalink to &quot;使用了连接池的PooledDataSource&quot;">​</a></h2><p>同样地，我们也是使用PooledDataSource的getConnection()方法来返回Connection对象。现在让我们看一下它的基本原理：</p><p>PooledDataSource将java.sql.Connection对象包裹成PooledConnection对象放到了PoolState类型的容器中维护。 MyBatis将连接池中的PooledConnection分为两种状态：空闲状态（idle）和活动状态(active)，这两种状态的PooledConnection对象分别被存储到PoolState容器内的idleConnections和activeConnections两个List集合中：</p><ul><li><p><strong>idleConnections</strong>: 空闲(idle)状态PooledConnection对象被放置到此集合中，表示当前闲置的没有被使用的PooledConnection集合，调用PooledDataSource的getConnection()方法时，会优先从此集合中取PooledConnection对象。当用完一个java.sql.Connection对象时，MyBatis会将其包裹成PooledConnection对象放到此集合中。</p></li><li><p><strong>activeConnections</strong>: 活动(active)状态的PooledConnection对象被放置到名为activeConnections的ArrayList中，表示当前正在被使用的PooledConnection集合，调用PooledDataSource的getConnection()方法时，会优先从idleConnections集合中取PooledConnection对象,如果没有，则看此集合是否已满，如果未满，PooledDataSource会创建出一个PooledConnection，添加到此集合中，并返回。</p></li></ul><p><strong>PoolState连接池的大致结构</strong>如下所示：</p><p><img src="'+c+`" alt="error.图片加载失败"></p><ul><li><strong>获取java.sql.Connection对象的过程</strong></li></ul><p>下面让我们看一下PooledDataSource 的getConnection()方法获取Connection对象的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Connection getConnection() throws SQLException {  </span></span>
<span class="line"><span>    return popConnection(dataSource.getUsername(), dataSource.getPassword()).getProxyConnection();  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public Connection getConnection(String username, String password) throws SQLException {  </span></span>
<span class="line"><span>    return popConnection(username, password).getProxyConnection();  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述的popConnection()方法，会从连接池中返回一个可用的PooledConnection对象，然后再调用getProxyConnection()方法最终返回Conection对象。（至于为什么会有getProxyConnection(),请关注下一节）。</p><p>现在让我们看一下popConnection()方法到底做了什么：</p><ul><li>先看是否有空闲(idle)状态下的PooledConnection对象，如果有，就直接返回一个可用的PooledConnection对象；否则进行第2步。</li><li>查看活动状态的PooledConnection池activeConnections是否已满；如果没有满，则创建一个新的PooledConnection对象，然后放到activeConnections池中，然后返回此PooledConnection对象；否则进行第三步；</li><li>看最先进入activeConnections池中的PooledConnection对象是否已经过期：如果已经过期，从activeConnections池中移除此对象，然后创建一个新的PooledConnection对象，添加到activeConnections中，然后将此对象返回；否则进行第4步。</li><li>线程等待，循环2步</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * 传递一个用户名和密码，从连接池中返回可用的PooledConnection </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>private PooledConnection popConnection(String username, String password) throws SQLException  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>   boolean countedWait = false;  </span></span>
<span class="line"><span>   PooledConnection conn = null;  </span></span>
<span class="line"><span>   long t = System.currentTimeMillis();  </span></span>
<span class="line"><span>   int localBadConnectionCount = 0;  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   while (conn == null)  </span></span>
<span class="line"><span>   {  </span></span>
<span class="line"><span>       synchronized (state)  </span></span>
<span class="line"><span>       {  </span></span>
<span class="line"><span>           if (state.idleConnections.size() &gt; 0)  </span></span>
<span class="line"><span>           {  </span></span>
<span class="line"><span>               // 连接池中有空闲连接，取出第一个  </span></span>
<span class="line"><span>               conn = state.idleConnections.remove(0);  </span></span>
<span class="line"><span>               if (log.isDebugEnabled())  </span></span>
<span class="line"><span>               {  </span></span>
<span class="line"><span>                   log.debug(&quot;Checked out connection &quot; + conn.getRealHashCode() + &quot; from pool.&quot;);  </span></span>
<span class="line"><span>               }  </span></span>
<span class="line"><span>           }  </span></span>
<span class="line"><span>           else  </span></span>
<span class="line"><span>           {  </span></span>
<span class="line"><span>               // 连接池中没有空闲连接，则取当前正在使用的连接数小于最大限定值，  </span></span>
<span class="line"><span>               if (state.activeConnections.size() &lt; poolMaximumActiveConnections)  </span></span>
<span class="line"><span>               {  </span></span>
<span class="line"><span>                   // 创建一个新的connection对象  </span></span>
<span class="line"><span>                   conn = new PooledConnection(dataSource.getConnection(), this);  </span></span>
<span class="line"><span>                   @SuppressWarnings(&quot;unused&quot;)  </span></span>
<span class="line"><span>                   //used in logging, if enabled  </span></span>
<span class="line"><span>                   Connection realConn = conn.getRealConnection();  </span></span>
<span class="line"><span>                   if (log.isDebugEnabled())  </span></span>
<span class="line"><span>                   {  </span></span>
<span class="line"><span>                       log.debug(&quot;Created connection &quot; + conn.getRealHashCode() + &quot;.&quot;);  </span></span>
<span class="line"><span>                   }  </span></span>
<span class="line"><span>               }  </span></span>
<span class="line"><span>               else  </span></span>
<span class="line"><span>               {  </span></span>
<span class="line"><span>                   // Cannot create new connection 当活动连接池已满，不能创建时，取出活动连接池的第一个，即最先进入连接池的PooledConnection对象  </span></span>
<span class="line"><span>                   // 计算它的校验时间，如果校验时间大于连接池规定的最大校验时间，则认为它已经过期了，利用这个PoolConnection内部的realConnection重新生成一个PooledConnection  </span></span>
<span class="line"><span>                   //  </span></span>
<span class="line"><span>                   PooledConnection oldestActiveConnection = state.activeConnections.get(0);  </span></span>
<span class="line"><span>                   long longestCheckoutTime = oldestActiveConnection.getCheckoutTime();  </span></span>
<span class="line"><span>                   if (longestCheckoutTime &gt; poolMaximumCheckoutTime)  </span></span>
<span class="line"><span>                   {  </span></span>
<span class="line"><span>                       // Can claim overdue connection  </span></span>
<span class="line"><span>                       state.claimedOverdueConnectionCount++;  </span></span>
<span class="line"><span>                       state.accumulatedCheckoutTimeOfOverdueConnections += longestCheckoutTime;  </span></span>
<span class="line"><span>                       state.accumulatedCheckoutTime += longestCheckoutTime;  </span></span>
<span class="line"><span>                       state.activeConnections.remove(oldestActiveConnection);  </span></span>
<span class="line"><span>                       if (!oldestActiveConnection.getRealConnection().getAutoCommit())  </span></span>
<span class="line"><span>                       {  </span></span>
<span class="line"><span>                           oldestActiveConnection.getRealConnection().rollback();  </span></span>
<span class="line"><span>                       }  </span></span>
<span class="line"><span>                       conn = new PooledConnection(oldestActiveConnection.getRealConnection(), this);  </span></span>
<span class="line"><span>                       oldestActiveConnection.invalidate();  </span></span>
<span class="line"><span>                       if (log.isDebugEnabled())  </span></span>
<span class="line"><span>                       {  </span></span>
<span class="line"><span>                           log.debug(&quot;Claimed overdue connection &quot; + conn.getRealHashCode() + &quot;.&quot;);  </span></span>
<span class="line"><span>                       }  </span></span>
<span class="line"><span>                   }  </span></span>
<span class="line"><span>                   else  </span></span>
<span class="line"><span>                   {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>                       //如果不能释放，则必须等待有  </span></span>
<span class="line"><span>                       // Must wait  </span></span>
<span class="line"><span>                       try  </span></span>
<span class="line"><span>                       {  </span></span>
<span class="line"><span>                           if (!countedWait)  </span></span>
<span class="line"><span>                           {  </span></span>
<span class="line"><span>                               state.hadToWaitCount++;  </span></span>
<span class="line"><span>                               countedWait = true;  </span></span>
<span class="line"><span>                           }  </span></span>
<span class="line"><span>                           if (log.isDebugEnabled())  </span></span>
<span class="line"><span>                           {  </span></span>
<span class="line"><span>                               log.debug(&quot;Waiting as long as &quot; + poolTimeToWait + &quot; milliseconds for connection.&quot;);  </span></span>
<span class="line"><span>                           }  </span></span>
<span class="line"><span>                           long wt = System.currentTimeMillis();  </span></span>
<span class="line"><span>                           state.wait(poolTimeToWait);  </span></span>
<span class="line"><span>                           state.accumulatedWaitTime += System.currentTimeMillis() - wt;  </span></span>
<span class="line"><span>                       }  </span></span>
<span class="line"><span>                       catch (InterruptedException e)  </span></span>
<span class="line"><span>                       {  </span></span>
<span class="line"><span>                           break;  </span></span>
<span class="line"><span>                       }  </span></span>
<span class="line"><span>                   }  </span></span>
<span class="line"><span>               }  </span></span>
<span class="line"><span>           }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>           //如果获取PooledConnection成功，则更新其信息  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>           if (conn != null)  </span></span>
<span class="line"><span>           {  </span></span>
<span class="line"><span>               if (conn.isValid())  </span></span>
<span class="line"><span>               {  </span></span>
<span class="line"><span>                   if (!conn.getRealConnection().getAutoCommit())  </span></span>
<span class="line"><span>                   {  </span></span>
<span class="line"><span>                       conn.getRealConnection().rollback();  </span></span>
<span class="line"><span>                   }  </span></span>
<span class="line"><span>                   conn.setConnectionTypeCode(assembleConnectionTypeCode(dataSource.getUrl(), username, password));  </span></span>
<span class="line"><span>                   conn.setCheckoutTimestamp(System.currentTimeMillis());  </span></span>
<span class="line"><span>                   conn.setLastUsedTimestamp(System.currentTimeMillis());  </span></span>
<span class="line"><span>                   state.activeConnections.add(conn);  </span></span>
<span class="line"><span>                   state.requestCount++;  </span></span>
<span class="line"><span>                   state.accumulatedRequestTime += System.currentTimeMillis() - t;  </span></span>
<span class="line"><span>               }  </span></span>
<span class="line"><span>               else  </span></span>
<span class="line"><span>               {  </span></span>
<span class="line"><span>                   if (log.isDebugEnabled())  </span></span>
<span class="line"><span>                   {  </span></span>
<span class="line"><span>                       log.debug(&quot;A bad connection (&quot; + conn.getRealHashCode() + &quot;) was returned from the pool, getting another connection.&quot;);  </span></span>
<span class="line"><span>                   }  </span></span>
<span class="line"><span>                   state.badConnectionCount++;  </span></span>
<span class="line"><span>                   localBadConnectionCount++;  </span></span>
<span class="line"><span>                   conn = null;  </span></span>
<span class="line"><span>                   if (localBadConnectionCount &gt; (poolMaximumIdleConnections + 3))  </span></span>
<span class="line"><span>                   {  </span></span>
<span class="line"><span>                       if (log.isDebugEnabled())  </span></span>
<span class="line"><span>                       {  </span></span>
<span class="line"><span>                           log.debug(&quot;PooledDataSource: Could not get a good connection to the database.&quot;);  </span></span>
<span class="line"><span>                       }  </span></span>
<span class="line"><span>                       throw new SQLException(&quot;PooledDataSource: Could not get a good connection to the database.&quot;);  </span></span>
<span class="line"><span>                   }  </span></span>
<span class="line"><span>               }  </span></span>
<span class="line"><span>           }  </span></span>
<span class="line"><span>       }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   if (conn == null)  </span></span>
<span class="line"><span>   {  </span></span>
<span class="line"><span>       if (log.isDebugEnabled())  </span></span>
<span class="line"><span>       {  </span></span>
<span class="line"><span>           log.debug(&quot;PooledDataSource: Unknown severe error condition.  The connection pool returned a null connection.&quot;);  </span></span>
<span class="line"><span>       }  </span></span>
<span class="line"><span>       throw new SQLException(&quot;PooledDataSource: Unknown severe error condition.  The connection pool returned a null connection.&quot;);  </span></span>
<span class="line"><span>   }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   return conn;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对应的处理流程图如下所示：</p><p><img src="`+r+`" alt="error.图片加载失败"></p><p>如上所示,对于PooledDataSource的getConnection()方法内，先是调用类PooledDataSource的popConnection()方法返回了一个PooledConnection对象，然后调用了PooledConnection的getProxyConnection()来返回Connection对象。</p><ul><li><strong>java.sql.Connection对象的回收</strong></li></ul><p>当我们的程序中使用完Connection对象时，如果不使用数据库连接池，我们一般会调用 connection.close()方法，关闭connection连接，释放资源。如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void test() throws ClassNotFoundException, SQLException  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>   String sql = &quot;select * from hr.employees where employee_id &lt; ? and employee_id &gt;= ?&quot;;  </span></span>
<span class="line"><span>   PreparedStatement st = null;  </span></span>
<span class="line"><span>   ResultSet rs = null;  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>   Connection con = null;  </span></span>
<span class="line"><span>   Class.forName(&quot;oracle.jdbc.driver.OracleDriver&quot;);  </span></span>
<span class="line"><span>   try  </span></span>
<span class="line"><span>   {  </span></span>
<span class="line"><span>       con = DriverManager.getConnection(&quot;jdbc:oracle:thin:@127.0.0.1:1521:xe&quot;, &quot;louluan&quot;, &quot;123456&quot;);  </span></span>
<span class="line"><span>       st = con.prepareStatement(sql);  </span></span>
<span class="line"><span>       //设置参数  </span></span>
<span class="line"><span>       st.setInt(1, 101);  </span></span>
<span class="line"><span>       st.setInt(2, 0);  </span></span>
<span class="line"><span>       //查询，得出结果集  </span></span>
<span class="line"><span>       rs = st.executeQuery();  </span></span>
<span class="line"><span>       //取数据，省略  </span></span>
<span class="line"><span>       //关闭，释放资源  </span></span>
<span class="line"><span>       con.close();  </span></span>
<span class="line"><span>   }  </span></span>
<span class="line"><span>   catch (SQLException e)  </span></span>
<span class="line"><span>   {  </span></span>
<span class="line"><span>       con.close();  </span></span>
<span class="line"><span>       e.printStackTrace();  </span></span>
<span class="line"><span>   }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调用过close()方法的Connection对象所持有的资源会被全部释放掉，Connection对象也就不能再使用。</p><p><strong>那么，如果我们使用了连接池，我们在用完了Connection对象时，需要将它放在连接池中，该怎样做呢</strong>？</p><p>为了和一般的使用Conneciton对象的方式保持一致，我们希望当Connection使用完后，调用.close()方法，而实际上Connection资源并没有被释放，而实际上被添加到了连接池中。这样可以做到吗？答案是可以。上述的要求从另外一个角度来描述就是：能否提供一种机制，让我们知道Connection对象调用了什么方法，从而根据不同的方法自定义相应的处理机制。恰好代理机制就可以完成上述要求.</p><p><strong>怎样实现Connection对象调用了close()方法，而实际是将其添加到连接池中</strong>：</p><p>这是要使用代理模式，为真正的Connection对象创建一个代理对象，代理对象所有的方法都是调用相应的真正Connection对象的方法实现。当代理对象执行close()方法时，要特殊处理，不调用真正Connection对象的close()方法，而是将Connection对象添加到连接池中。</p><p>MyBatis的PooledDataSource的PoolState内部维护的对象是PooledConnection类型的对象，而PooledConnection则是对真正的数据库连接java.sql.Connection实例对象的包裹器。</p><p>PooledConnection对象内持有一个真正的数据库连接java.sql.Connection实例对象和一个java.sql.Connection的代理，其部分定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class PooledConnection implements InvocationHandler {  </span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    //......  </span></span>
<span class="line"><span>    //所创建它的datasource引用  </span></span>
<span class="line"><span>    private PooledDataSource dataSource;  </span></span>
<span class="line"><span>    //真正的Connection对象  </span></span>
<span class="line"><span>    private Connection realConnection;  </span></span>
<span class="line"><span>    //代理自己的代理Connection  </span></span>
<span class="line"><span>    private Connection proxyConnection;  </span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    //......  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>PooledConenction实现了InvocationHandler接口，并且，proxyConnection对象也是根据这个它来生成的代理对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public PooledConnection(Connection connection, PooledDataSource dataSource) {  </span></span>
<span class="line"><span>   this.hashCode = connection.hashCode();  </span></span>
<span class="line"><span>   this.realConnection = connection;  </span></span>
<span class="line"><span>   this.dataSource = dataSource;  </span></span>
<span class="line"><span>   this.createdTimestamp = System.currentTimeMillis();  </span></span>
<span class="line"><span>   this.lastUsedTimestamp = System.currentTimeMillis();  </span></span>
<span class="line"><span>   this.valid = true;  </span></span>
<span class="line"><span>   this.proxyConnection = (Connection) Proxy.newProxyInstance(Connection.class.getClassLoader(), IFACES, this);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实际上，我们调用PooledDataSource的getConnection()方法返回的就是这个proxyConnection对象。当我们调用此proxyConnection对象上的任何方法时，都会调用PooledConnection对象内invoke()方法。</p><p>让我们看一下PooledConnection类中的invoke()方法定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  </span></span>
<span class="line"><span>    String methodName = method.getName();  </span></span>
<span class="line"><span>    //当调用关闭的时候，回收此Connection到PooledDataSource中  </span></span>
<span class="line"><span>    if (CLOSE.hashCode() == methodName.hashCode() &amp;&amp; CLOSE.equals(methodName)) {  </span></span>
<span class="line"><span>        dataSource.pushConnection(this);  </span></span>
<span class="line"><span>        return null;  </span></span>
<span class="line"><span>    } else {  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            if (!Object.class.equals(method.getDeclaringClass())) {  </span></span>
<span class="line"><span>                checkConnection();  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            return method.invoke(realConnection, args);  </span></span>
<span class="line"><span>        } catch (Throwable t) {  </span></span>
<span class="line"><span>            throw ExceptionUtil.unwrapThrowable(t);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码可以看到，当我们使用了pooledDataSource.getConnection()返回的Connection对象的close()方法时，不会调用真正Connection的close()方法，而是将此Connection对象放到连接池中。</p><h2 id="jndi类型的数据源datasource" tabindex="-1">JNDI类型的数据源DataSource <a class="header-anchor" href="#jndi类型的数据源datasource" aria-label="Permalink to &quot;JNDI类型的数据源DataSource&quot;">​</a></h2><p>对于JNDI类型的数据源DataSource的获取就比较简单，MyBatis定义了一个JndiDataSourceFactory工厂来创建通过JNDI形式生成的DataSource。下面让我们看一下JndiDataSourceFactory的关键代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (properties.containsKey(INITIAL_CONTEXT) &amp;&amp; properties.containsKey(DATA_SOURCE))  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    //从JNDI上下文中找到DataSource并返回  </span></span>
<span class="line"><span>    Context ctx = (Context) initCtx.lookup(properties.getProperty(INITIAL_CONTEXT));  </span></span>
<span class="line"><span>    dataSource = (DataSource) ctx.lookup(properties.getProperty(DATA_SOURCE));  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>else if (properties.containsKey(DATA_SOURCE))  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    //从JNDI上下文中找到DataSource并返回  </span></span>
<span class="line"><span>    dataSource = (DataSource) initCtx.lookup(properties.getProperty(DATA_SOURCE));  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,112)]))}const y=s(u,[["render",d]]);export{S as __pageData,y as default};
