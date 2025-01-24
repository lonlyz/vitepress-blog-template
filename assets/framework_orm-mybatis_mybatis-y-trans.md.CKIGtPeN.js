import{_ as a,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/mybatis/mybatis-y-trans-1.png",i="/vitepress-blog-template/images/mybatis/mybatis-y-trans-2.png",o="/vitepress-blog-template/images/mybatis/mybatis-y-trans-3.png",l="/vitepress-blog-template/images/mybatis/mybatis-y-trans-4.png",c="/vitepress-blog-template/images/mybatis/mybatis-y-trans-5.png",v=JSON.parse('{"title":"MyBatis详解 - 事务管理机制","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-trans.md","filePath":"framework/orm-mybatis/mybatis-y-trans.md","lastUpdated":1737706346000}'),r={name:"framework/orm-mybatis/mybatis-y-trans.md"};function d(u,n,m,g,b,h){return e(),s("div",null,n[0]||(n[0]=[p('<h1 id="mybatis详解-事务管理机制" tabindex="-1">MyBatis详解 - 事务管理机制 <a class="header-anchor" href="#mybatis详解-事务管理机制" aria-label="Permalink to &quot;MyBatis详解 - 事务管理机制&quot;">​</a></h1><blockquote><p>本文主要介绍MyBatis事务管理相关的使用和机制。@pdai</p></blockquote><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p>对数据库的事务而言，应该具有以下几点：创建（create）、提交（commit）、回滚（rollback）、关闭（close）。对应地，MyBatis将事务抽象成了Transaction接口：</p><p><img src="'+t+'" alt="error.图片加载失败"></p><p>MyBatis的事务管理分为两种形式：</p><ul><li><strong>使用JDBC的事务管理机制</strong>：即利用java.sql.Connection对象完成对事务的提交（commit()）、回滚（rollback()）、关闭（close()）等。</li><li><strong>使用MANAGED的事务管理机制</strong>：这种机制MyBatis自身不会去实现事务管理，而是让程序的容器如（JBOSS，Weblogic）来实现对事务的管理。</li></ul><p>这两者的类图如下所示：</p><p><img src="'+i+`" alt="error.图片加载失败"></p><h2 id="官网关于事务配置的内容" tabindex="-1">官网关于事务配置的内容 <a class="header-anchor" href="#官网关于事务配置的内容" aria-label="Permalink to &quot;官网关于事务配置的内容&quot;">​</a></h2><p>在 MyBatis 中有两种类型的事务管理器（也就是 <code>type=&quot;[JDBC|MANAGED]&quot;</code>）：</p><ul><li><strong>JDBC</strong> – 这个配置直接使用了 JDBC 的提交和回滚设施，它依赖从数据源获得的连接来管理事务作用域。</li><li><strong>MANAGED</strong> – 这个配置几乎没做什么。它从不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如 JEE 应用服务器的上下文）。 默认情况下它会关闭连接。然而一些容器并不希望连接被关闭，因此需要将 closeConnection 属性设置为 false 来阻止默认的关闭行为。例如:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;transactionManager type=&quot;MANAGED&quot;&gt;</span></span>
<span class="line"><span>  &lt;property name=&quot;closeConnection&quot; value=&quot;false&quot;/&gt;</span></span>
<span class="line"><span>&lt;/transactionManager&gt;</span></span></code></pre></div><blockquote><p>如果你正在使用 Spring + MyBatis，则没有必要配置事务管理器，因为 Spring 模块会使用自带的管理器来覆盖前面的配置。</p></blockquote><p>这两种事务管理器类型都不需要设置任何属性。它们其实是类型别名，换句话说，你可以用 TransactionFactory 接口实现类的全限定名或类型别名代替它们。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface TransactionFactory {</span></span>
<span class="line"><span>  default void setProperties(Properties props) { // 从 3.5.2 开始，该方法为默认方法</span></span>
<span class="line"><span>    // 空实现</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  Transaction newTransaction(Connection conn);</span></span>
<span class="line"><span>  Transaction newTransaction(DataSource dataSource, TransactionIsolationLevel level, boolean autoCommit);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在事务管理器实例化后，所有在 XML 中配置的属性将会被传递给 setProperties() 方法。你的实现还需要创建一个 Transaction 接口的实现类，这个接口也很简单：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Transaction {</span></span>
<span class="line"><span>  Connection getConnection() throws SQLException;</span></span>
<span class="line"><span>  void commit() throws SQLException;</span></span>
<span class="line"><span>  void rollback() throws SQLException;</span></span>
<span class="line"><span>  void close() throws SQLException;</span></span>
<span class="line"><span>  Integer getTimeout() throws SQLException;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用这两个接口，你可以完全自定义 MyBatis 对事务的处理。</p><h2 id="事务的配置、创建和使用" tabindex="-1">事务的配置、创建和使用 <a class="header-anchor" href="#事务的配置、创建和使用" aria-label="Permalink to &quot;事务的配置、创建和使用&quot;">​</a></h2><h3 id="事务的配置" tabindex="-1">事务的配置 <a class="header-anchor" href="#事务的配置" aria-label="Permalink to &quot;事务的配置&quot;">​</a></h3><p>我们在使用MyBatis时，一般会在MyBatisXML配置文件中定义类似如下的信息：</p><p><img src="`+o+`" alt="error.图片加载失败"></p><p><code>&lt;environment&gt;</code>节点定义了连接某个数据库的信息，其子节点<code>&lt;transactionManager&gt;</code> 的type 会决定我们用什么类型的事务管理机制。</p><h3 id="事务工厂的创建" tabindex="-1">事务工厂的创建 <a class="header-anchor" href="#事务工厂的创建" aria-label="Permalink to &quot;事务工厂的创建&quot;">​</a></h3><p>MyBatis事务的创建是交给TransactionFactory 事务工厂来创建的，如果我们将<code>&lt;transactionManager&gt;</code>的type 配置为&quot;JDBC&quot;,那么，在MyBatis初始化解析 <code>&lt;environment&gt;</code>节点时，会根据type=&quot;JDBC&quot;创建一个JdbcTransactionFactory工厂，其源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** </span></span>
<span class="line"><span> * 解析&lt;transactionManager&gt;节点，创建对应的TransactionFactory </span></span>
<span class="line"><span> * @param context </span></span>
<span class="line"><span> * @return </span></span>
<span class="line"><span> * @throws Exception </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>private TransactionFactory transactionManagerElement(XNode context) throws Exception {  </span></span>
<span class="line"><span>    if (context != null) {  </span></span>
<span class="line"><span>        String type = context.getStringAttribute(&quot;type&quot;);  </span></span>
<span class="line"><span>        Properties props = context.getChildrenAsProperties();  </span></span>
<span class="line"><span>        /* </span></span>
<span class="line"><span>         * 在Configuration初始化的时候，会通过以下语句，给JDBC和MANAGED对应的工厂类 </span></span>
<span class="line"><span>         * typeAliasRegistry.registerAlias(&quot;JDBC&quot;, JdbcTransactionFactory.class); </span></span>
<span class="line"><span>         * typeAliasRegistry.registerAlias(&quot;MANAGED&quot;, ManagedTransactionFactory.class); </span></span>
<span class="line"><span>         * 下述的resolveClass(type).newInstance()会创建对应的工厂实例 </span></span>
<span class="line"><span>         */  </span></span>
<span class="line"><span>        TransactionFactory factory = (TransactionFactory) resolveClass(type).newInstance();  </span></span>
<span class="line"><span>        factory.setProperties(props);  </span></span>
<span class="line"><span>        return factory;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    throw new BuilderException(&quot;Environment declaration requires a TransactionFactory.&quot;);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上述代码所示，如果type = &quot;JDBC&quot;,则MyBatis会创建一个JdbcTransactionFactory.class 实例；如果type=&quot;MANAGED&quot;，则MyBatis会创建一个MangedTransactionFactory.class实例。</p><p>MyBatis对<code>&lt;transactionManager&gt;</code>节点的解析会生成TransactionFactory实例；而对<code>&lt;dataSource&gt;</code>解析会生成datasouce实例，作为<code>&lt;environment&gt;</code>节点，会根据TransactionFactory和DataSource实例创建一个Environment对象，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void environmentsElement(XNode context) throws Exception {  </span></span>
<span class="line"><span>    if (context != null) {  </span></span>
<span class="line"><span>        if (environment == null) {  </span></span>
<span class="line"><span>            environment = context.getStringAttribute(&quot;default&quot;);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        for (XNode child : context.getChildren()) {  </span></span>
<span class="line"><span>            String id = child.getStringAttribute(&quot;id&quot;);  </span></span>
<span class="line"><span>            //是和默认的环境相同时，解析之  </span></span>
<span class="line"><span>            if (isSpecifiedEnvironment(id)) {  </span></span>
<span class="line"><span>                //1.解析&lt;transactionManager&gt;节点，决定创建什么类型的TransactionFactory  </span></span>
<span class="line"><span>                TransactionFactory txFactory = transactionManagerElement(child.evalNode(&quot;transactionManager&quot;));  </span></span>
<span class="line"><span>                //2. 创建dataSource  </span></span>
<span class="line"><span>                DataSourceFactory dsFactory = dataSourceElement(child.evalNode(&quot;dataSource&quot;));  </span></span>
<span class="line"><span>                DataSource dataSource = dsFactory.getDataSource();  </span></span>
<span class="line"><span>                //3. 使用了Environment内置的构造器Builder，传递id 事务工厂TransactionFactory和数据源DataSource  </span></span>
<span class="line"><span>                Environment.Builder environmentBuilder = new Environment.Builder(id)  </span></span>
<span class="line"><span>                .transactionFactory(txFactory)  </span></span>
<span class="line"><span>                .dataSource(dataSource);  </span></span>
<span class="line"><span>                configuration.setEnvironment(environmentBuilder.build());  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Environment表示着一个数据库的连接，生成后的Environment对象会被设置到Configuration实例中，以供后续的使用。</p><p><img src="`+l+'" alt="error.图片加载失败"></p><p>上述一直在讲事务工厂TransactionFactory来创建的Transaction，现在让我们看一下MyBatis中的TransactionFactory的定义吧。</p><h3 id="事务工厂transactionfactory" tabindex="-1">事务工厂TransactionFactory <a class="header-anchor" href="#事务工厂transactionfactory" aria-label="Permalink to &quot;事务工厂TransactionFactory&quot;">​</a></h3><p>事务工厂Transaction定义了创建Transaction的两个方法：一个是通过指定的Connection对象创建Transaction，另外是通过数据源DataSource来创建Transaction。与JDBC 和MANAGED两种Transaction相对应，TransactionFactory有两个对应的实现的子类：</p><p><img src="'+c+`" alt="error.图片加载失败"></p><h3 id="事务transaction的创建" tabindex="-1">事务Transaction的创建 <a class="header-anchor" href="#事务transaction的创建" aria-label="Permalink to &quot;事务Transaction的创建&quot;">​</a></h3><p>通过事务工厂TransactionFactory很容易获取到Transaction对象实例。我们以JdbcTransaction为例，看一下JdbcTransactionFactory是怎样生成JdbcTransaction的，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class JdbcTransactionFactory implements TransactionFactory {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public void setProperties(Properties props) {  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /** </span></span>
<span class="line"><span>     * 根据给定的数据库连接Connection创建Transaction </span></span>
<span class="line"><span>     * @param conn Existing database connection </span></span>
<span class="line"><span>     * @return </span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public Transaction newTransaction(Connection conn) {  </span></span>
<span class="line"><span>        return new JdbcTransaction(conn);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /** </span></span>
<span class="line"><span>     * 根据DataSource、隔离级别和是否自动提交创建Transacion </span></span>
<span class="line"><span>     * </span></span>
<span class="line"><span>     * @param ds </span></span>
<span class="line"><span>     * @param level Desired isolation level </span></span>
<span class="line"><span>     * @param autoCommit Desired autocommit </span></span>
<span class="line"><span>     * @return </span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public Transaction newTransaction(DataSource ds, TransactionIsolationLevel level, boolean autoCommit) {  </span></span>
<span class="line"><span>        return new JdbcTransaction(ds, level, autoCommit);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上说是，JdbcTransactionFactory会创建JDBC类型的Transaction，即JdbcTransaction。类似地，ManagedTransactionFactory也会创建ManagedTransaction。下面我们会分别深入JdbcTranaction 和ManagedTransaction，看它们到底是怎样实现事务管理的。</p><h3 id="jdbctransaction" tabindex="-1">JdbcTransaction <a class="header-anchor" href="#jdbctransaction" aria-label="Permalink to &quot;JdbcTransaction&quot;">​</a></h3><p>JdbcTransaction直接使用JDBC的提交和回滚事务管理机制。它依赖与从dataSource中取得的连接connection 来管理transaction 的作用域，connection对象的获取被延迟到调用getConnection()方法。如果autocommit设置为on，开启状态的话，它会忽略commit和rollback。</p><p>直观地讲，就是JdbcTransaction是使用的java.sql.Connection 上的commit和rollback功能，JdbcTransaction只是相当于对java.sql.Connection事务处理进行了一次包装（wrapper），Transaction的事务管理都是通过java.sql.Connection实现的。JdbcTransaction的代码实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class JdbcTransaction implements Transaction {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    private static final Log log = LogFactory.getLog(JdbcTransaction.class);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    //数据库连接  </span></span>
<span class="line"><span>    protected Connection connection;  </span></span>
<span class="line"><span>    //数据源  </span></span>
<span class="line"><span>    protected DataSource dataSource;  </span></span>
<span class="line"><span>    //隔离级别  </span></span>
<span class="line"><span>    protected TransactionIsolationLevel level;  </span></span>
<span class="line"><span>    //是否为自动提交  </span></span>
<span class="line"><span>    protected boolean autoCommmit;  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public JdbcTransaction(DataSource ds, TransactionIsolationLevel desiredLevel, boolean desiredAutoCommit) {  </span></span>
<span class="line"><span>        dataSource = ds;  </span></span>
<span class="line"><span>        level = desiredLevel;  </span></span>
<span class="line"><span>        autoCommmit = desiredAutoCommit;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public JdbcTransaction(Connection connection) {  </span></span>
<span class="line"><span>        this.connection = connection;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public Connection getConnection() throws SQLException {  </span></span>
<span class="line"><span>        if (connection == null) {  </span></span>
<span class="line"><span>            openConnection();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return connection;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /** </span></span>
<span class="line"><span>     * commit()功能 使用connection的commit() </span></span>
<span class="line"><span>     * @throws SQLException </span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public void commit() throws SQLException {  </span></span>
<span class="line"><span>        if (connection != null &amp;&amp; !connection.getAutoCommit()) {  </span></span>
<span class="line"><span>            if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>                log.debug(&quot;Committing JDBC Connection [&quot; + connection + &quot;]&quot;);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            connection.commit();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /** </span></span>
<span class="line"><span>     * rollback()功能 使用connection的rollback() </span></span>
<span class="line"><span>     * @throws SQLException </span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public void rollback() throws SQLException {  </span></span>
<span class="line"><span>        if (connection != null &amp;&amp; !connection.getAutoCommit()) {  </span></span>
<span class="line"><span>            if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>                log.debug(&quot;Rolling back JDBC Connection [&quot; + connection + &quot;]&quot;);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            connection.rollback();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    /** </span></span>
<span class="line"><span>     * close()功能 使用connection的close() </span></span>
<span class="line"><span>     * @throws SQLException </span></span>
<span class="line"><span>     */  </span></span>
<span class="line"><span>    public void close() throws SQLException {  </span></span>
<span class="line"><span>        if (connection != null) {  </span></span>
<span class="line"><span>            resetAutoCommit();  </span></span>
<span class="line"><span>            if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>                log.debug(&quot;Closing JDBC Connection [&quot; + connection + &quot;]&quot;);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            connection.close();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    protected void setDesiredAutoCommit(boolean desiredAutoCommit) {  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            if (connection.getAutoCommit() != desiredAutoCommit) {  </span></span>
<span class="line"><span>                if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>                    log.debug(&quot;Setting autocommit to &quot; + desiredAutoCommit + &quot; on JDBC Connection [&quot; + connection + &quot;]&quot;);  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>                connection.setAutoCommit(desiredAutoCommit);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        } catch (SQLException e) {  </span></span>
<span class="line"><span>            // Only a very poorly implemented driver would fail here,  </span></span>
<span class="line"><span>            // and there&#39;s not much we can do about that.  </span></span>
<span class="line"><span>            throw new TransactionException(&quot;Error configuring AutoCommit.  &quot;  </span></span>
<span class="line"><span>             + &quot;Your driver may not support getAutoCommit() or setAutoCommit(). &quot;  </span></span>
<span class="line"><span>             + &quot;Requested setting: &quot; + desiredAutoCommit + &quot;.  Cause: &quot; + e, e);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    protected void resetAutoCommit() {  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            if (!connection.getAutoCommit()) {  </span></span>
<span class="line"><span>                // MyBatis does not call commit/rollback on a connection if just selects were performed.  </span></span>
<span class="line"><span>                // Some databases start transactions with select statements  </span></span>
<span class="line"><span>                // and they mandate a commit/rollback before closing the connection.  </span></span>
<span class="line"><span>                // A workaround is setting the autocommit to true before closing the connection.  </span></span>
<span class="line"><span>                // Sybase throws an exception here.  </span></span>
<span class="line"><span>                if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>                    log.debug(&quot;Resetting autocommit to true on JDBC Connection [&quot; + connection + &quot;]&quot;);  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>                connection.setAutoCommit(true);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        } catch (SQLException e) {  </span></span>
<span class="line"><span>            log.debug(&quot;Error resetting autocommit to true &quot;  </span></span>
<span class="line"><span>             + &quot;before closing the connection.  Cause: &quot; + e);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    protected void openConnection() throws SQLException {  </span></span>
<span class="line"><span>        if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>            log.debug(&quot;Opening JDBC Connection&quot;);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        connection = dataSource.getConnection();  </span></span>
<span class="line"><span>        if (level != null) {  </span></span>
<span class="line"><span>            connection.setTransactionIsolation(level.getLevel());  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        setDesiredAutoCommit(autoCommmit);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="managedtransaction" tabindex="-1">ManagedTransaction <a class="header-anchor" href="#managedtransaction" aria-label="Permalink to &quot;ManagedTransaction&quot;">​</a></h3><p>ManagedTransaction让容器来管理事务Transaction的整个生命周期，意思就是说，使用ManagedTransaction的commit和rollback功能不会对事务有任何的影响，它什么都不会做，它将事务管理的权利移交给了容器来实现。看如下Managed的实现代码大家就会一目了然：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** </span></span>
<span class="line"><span> *  </span></span>
<span class="line"><span> * 让容器管理事务transaction的整个生命周期 </span></span>
<span class="line"><span> * connection的获取延迟到getConnection()方法的调用 </span></span>
<span class="line"><span> * 忽略所有的commit和rollback操作 </span></span>
<span class="line"><span> * 默认情况下，可以关闭一个连接connection，也可以配置它不可以关闭一个连接 </span></span>
<span class="line"><span> * 让容器来管理transaction的整个生命周期 </span></span>
<span class="line"><span> * @see ManagedTransactionFactory </span></span>
<span class="line"><span> */   </span></span>
<span class="line"><span>public class ManagedTransaction implements Transaction {  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    private static final Log log = LogFactory.getLog(ManagedTransaction.class);  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    private DataSource dataSource;  </span></span>
<span class="line"><span>    private TransactionIsolationLevel level;  </span></span>
<span class="line"><span>    private Connection connection;  </span></span>
<span class="line"><span>    private boolean closeConnection;  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public ManagedTransaction(Connection connection, boolean closeConnection) {  </span></span>
<span class="line"><span>        this.connection = connection;  </span></span>
<span class="line"><span>        this.closeConnection = closeConnection;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public ManagedTransaction(DataSource ds, TransactionIsolationLevel level, boolean closeConnection) {  </span></span>
<span class="line"><span>        this.dataSource = ds;  </span></span>
<span class="line"><span>        this.level = level;  </span></span>
<span class="line"><span>        this.closeConnection = closeConnection;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public Connection getConnection() throws SQLException {  </span></span>
<span class="line"><span>        if (this.connection == null) {  </span></span>
<span class="line"><span>            openConnection();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        return this.connection;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public void commit() throws SQLException {  </span></span>
<span class="line"><span>        // Does nothing  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public void rollback() throws SQLException {  </span></span>
<span class="line"><span>        // Does nothing  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public void close() throws SQLException {  </span></span>
<span class="line"><span>        if (this.closeConnection &amp;&amp; this.connection != null) {  </span></span>
<span class="line"><span>            if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>                log.debug(&quot;Closing JDBC Connection [&quot; + this.connection + &quot;]&quot;);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            this.connection.close();  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    protected void openConnection() throws SQLException {  </span></span>
<span class="line"><span>        if (log.isDebugEnabled()) {  </span></span>
<span class="line"><span>            log.debug(&quot;Opening JDBC Connection&quot;);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        this.connection = this.dataSource.getConnection();  </span></span>
<span class="line"><span>        if (this.level != null) {  </span></span>
<span class="line"><span>            this.connection.setTransactionIsolation(this.level.getLevel());  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意：如果我们使用MyBatis构建本地程序，即不是WEB程序，若将type设置成&quot;MANAGED&quot;，那么，我们执行的任何update操作，即使我们最后执行了commit操作，数据也不会保留，不会对数据库造成任何影响。因为我们将MyBatis配置成了“MANAGED”，即MyBatis自己不管理事务，而我们又是运行的本地程序，没有事务管理功能，所以对数据库的update操作都是无效的。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,49)]))}const C=a(r,[["render",d]]);export{v as __pageData,C as default};
