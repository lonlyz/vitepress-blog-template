import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/mybatis/mybatis-y-init-1.png",t="/vitepress-blog-template/images/mybatis/mybatis-y-init-2.png",l="/vitepress-blog-template/images/mybatis/mybatis-y-init-4.png",S=JSON.parse('{"title":"MyBatis详解 - 初始化基本过程","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-init.md","filePath":"framework/orm-mybatis/mybatis-y-init.md","lastUpdated":1737706346000}'),o={name:"framework/orm-mybatis/mybatis-y-init.md"};function r(c,n,u,d,g,m){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="mybatis详解-初始化基本过程" tabindex="-1">MyBatis详解 - 初始化基本过程 <a class="header-anchor" href="#mybatis详解-初始化基本过程" aria-label="Permalink to &quot;MyBatis详解 - 初始化基本过程&quot;">​</a></h1><blockquote><p>从上文我们知道MyBatis和数据库的交互有两种方式有Java API和Mapper接口两种，所以MyBatis的初始化必然也有两种；那么MyBatis是如何初始化的呢？@pdai</p></blockquote><h2 id="mybatis初始化的方式及引入" tabindex="-1">MyBatis初始化的方式及引入 <a class="header-anchor" href="#mybatis初始化的方式及引入" aria-label="Permalink to &quot;MyBatis初始化的方式及引入&quot;">​</a></h2><p>MyBatis的初始化可以有两种方式：</p><ul><li><p><strong>基于XML配置文件</strong>：基于XML配置文件的方式是将MyBatis的所有配置信息放在XML文件中，MyBatis通过加载并XML配置文件，将配置文信息组装成内部的Configuration对象。</p></li><li><p><strong>基于Java API</strong>：这种方式不使用XML配置文件，需要MyBatis使用者在Java代码中，手动创建Configuration对象，然后将配置参数set 进入Configuration对象中。</p></li></ul><h2 id="初始化方式-xml配置" tabindex="-1">初始化方式 - XML配置 <a class="header-anchor" href="#初始化方式-xml配置" aria-label="Permalink to &quot;初始化方式 - XML配置&quot;">​</a></h2><blockquote><p>接下来我们将通过 基于XML配置文件方式的MyBatis初始化，深入探讨MyBatis是如何通过配置文件构建Configuration对象，并使用它。</p></blockquote><p>现在就从使用MyBatis的简单例子入手，深入分析一下MyBatis是怎样完成初始化的，都初始化了什么。看以下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// mybatis初始化</span></span>
<span class="line"><span>String resource = &quot;mybatis-config.xml&quot;;  </span></span>
<span class="line"><span>InputStream inputStream = Resources.getResourceAsStream(resource);  </span></span>
<span class="line"><span>SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 创建SqlSession</span></span>
<span class="line"><span>SqlSession sqlSession = sqlSessionFactory.openSession();  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 执行SQL语句</span></span>
<span class="line"><span>List list = sqlSession.selectList(&quot;com.foo.bean.BlogMapper.queryAllBlogInfo&quot;);</span></span></code></pre></div><p>有过MyBatis使用经验的读者会知道，上述语句的作用是执行<code>com.foo.bean.BlogMapper.queryAllBlogInfo</code> 定义的SQL语句，返回一个List结果集。总的来说，上述代码经历了三个阶段(本系列也对应三篇文章分别讲解)：</p><ul><li><code>mybatis初始化</code> 本文</li><li><code>创建SqlSession</code> - 详解后文</li><li><code>执行SQL语句</code> - 详解后文</li></ul><p>上述代码的功能是根据配置文件mybatis-config.xml 配置文件，创建SqlSessionFactory对象，然后产生SqlSession，执行SQL语句。而mybatis的初始化就发生在第三句：SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream); 现在就让我们看看第三句到底发生了什么。</p><h3 id="mybatis初始化基本过程" tabindex="-1">MyBatis初始化基本过程： <a class="header-anchor" href="#mybatis初始化基本过程" aria-label="Permalink to &quot;MyBatis初始化基本过程：&quot;">​</a></h3><p>SqlSessionFactoryBuilder根据传入的数据流生成Configuration对象，然后根据Configuration对象创建默认的SqlSessionFactory实例。</p><p>初始化的基本过程如下序列图所示：</p><p><img src="`+i+`" alt="error.图片加载失败"></p><p>由上图所示，mybatis初始化要经过简单的以下几步：</p><ul><li><p>调用SqlSessionFactoryBuilder对象的build(inputStream)方法；</p></li><li><p>SqlSessionFactoryBuilder会根据输入流inputStream等信息创建XMLConfigBuilder对象;</p></li><li><p>SqlSessionFactoryBuilder调用XMLConfigBuilder对象的parse()方法；</p></li><li><p>XMLConfigBuilder对象返回Configuration对象；</p></li><li><p>SqlSessionFactoryBuilder根据Configuration对象创建一个DefaultSessionFactory对象；</p></li><li><p>SqlSessionFactoryBuilder返回 DefaultSessionFactory对象给Client，供Client使用。</p></li></ul><p>SqlSessionFactoryBuilder相关的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public SqlSessionFactory build(InputStream inputStream)  {  </span></span>
<span class="line"><span>    return build(inputStream, null, null);  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties)  {  </span></span>
<span class="line"><span>    try  {  </span></span>
<span class="line"><span>        //2. 创建XMLConfigBuilder对象用来解析XML配置文件，生成Configuration对象  </span></span>
<span class="line"><span>        XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);  </span></span>
<span class="line"><span>        //3. 将XML配置文件内的信息解析成Java对象Configuration对象  </span></span>
<span class="line"><span>        Configuration config = parser.parse();  </span></span>
<span class="line"><span>        //4. 根据Configuration对象创建出SqlSessionFactory对象  </span></span>
<span class="line"><span>        return build(config);  </span></span>
<span class="line"><span>    } catch (Exception e) {  </span></span>
<span class="line"><span>        throw ExceptionFactory.wrapException(&quot;Error building SqlSession.&quot;, e);  </span></span>
<span class="line"><span>    } finally {  </span></span>
<span class="line"><span>        ErrorContext.instance().reset();  </span></span>
<span class="line"><span>        try {  </span></span>
<span class="line"><span>            inputStream.close();  </span></span>
<span class="line"><span>        } catch (IOException e) {  </span></span>
<span class="line"><span>            // Intentionally ignore. Prefer previous error.  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 从此处可以看出，MyBatis内部通过Configuration对象来创建SqlSessionFactory,用户也可以自己通过API构造好Configuration对象，调用此方法创SqlSessionFactory  </span></span>
<span class="line"><span>public SqlSessionFactory build(Configuration config) {  </span></span>
<span class="line"><span>    return new DefaultSqlSessionFactory(config);  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述的初始化过程中，涉及到了以下几个对象：</p><ul><li><p>SqlSessionFactoryBuilder ： SqlSessionFactory的构造器，用于创建SqlSessionFactory，采用了Builder设计模式</p></li><li><p>Configuration ：该对象是mybatis-config.xml文件中所有mybatis配置信息</p></li><li><p>SqlSessionFactory：SqlSession工厂类，以工厂形式创建SqlSession对象，采用了Factory工厂设计模式</p></li><li><p>XmlConfigParser ：负责将mybatis-config.xml配置文件解析成Configuration对象，共SqlSessonFactoryBuilder使用，创建SqlSessionFactory</p></li></ul><h3 id="创建configuration对象的过程" tabindex="-1">创建Configuration对象的过程 <a class="header-anchor" href="#创建configuration对象的过程" aria-label="Permalink to &quot;创建Configuration对象的过程&quot;">​</a></h3><blockquote><p>接着上述的 MyBatis初始化基本过程讨论，当SqlSessionFactoryBuilder执行build()方法，调用了XMLConfigBuilder的parse()方法，然后返回了Configuration对象。那么parse()方法是如何处理XML文件，生成Configuration对象的呢？</p></blockquote><ul><li><strong>XMLConfigBuilder会将XML配置文件的信息转换为Document对象</strong></li></ul><p>而XML配置定义文件DTD转换成XMLMapperEntityResolver对象，然后将二者封装到XpathParser对象中，XpathParser的作用是提供根据Xpath表达式获取基本的DOM节点Node信息的操作。如下图所示：</p><p><img src="`+t+`" alt="error.图片加载失败"></p><ul><li><strong>之后XMLConfigBuilder调用parse()方法</strong></li></ul><p>会从XPathParser中取出<code>&lt;configuration&gt;</code>节点对应的Node对象，然后解析此Node节点的子Node：properties, settings, typeAliases,typeHandlers, objectFactory, objectWrapperFactory, plugins, environments,databaseIdProvider, mappers：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Configuration parse() {  </span></span>
<span class="line"><span>    if (parsed) {  </span></span>
<span class="line"><span>        throw new BuilderException(&quot;Each XMLConfigBuilder can only be used once.&quot;);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    parsed = true;  </span></span>
<span class="line"><span>    //源码中没有这一句，只有 parseConfiguration(parser.evalNode(&quot;/configuration&quot;));  </span></span>
<span class="line"><span>    //为了让读者看得更明晰，源码拆分为以下两句  </span></span>
<span class="line"><span>    XNode configurationNode = parser.evalNode(&quot;/configuration&quot;);  </span></span>
<span class="line"><span>    parseConfiguration(configurationNode);  </span></span>
<span class="line"><span>    return configuration;  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>/** </span></span>
<span class="line"><span> * 解析 &quot;/configuration&quot;节点下的子节点信息，然后将解析的结果设置到Configuration对象中 </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>private void parseConfiguration(XNode root) {  </span></span>
<span class="line"><span>    try {  </span></span>
<span class="line"><span>        //1.首先处理properties 节点     </span></span>
<span class="line"><span>        propertiesElement(root.evalNode(&quot;properties&quot;)); //issue #117 read properties first  </span></span>
<span class="line"><span>        //2.处理typeAliases  </span></span>
<span class="line"><span>        typeAliasesElement(root.evalNode(&quot;typeAliases&quot;));  </span></span>
<span class="line"><span>        //3.处理插件  </span></span>
<span class="line"><span>        pluginElement(root.evalNode(&quot;plugins&quot;));  </span></span>
<span class="line"><span>        //4.处理objectFactory  </span></span>
<span class="line"><span>        objectFactoryElement(root.evalNode(&quot;objectFactory&quot;));  </span></span>
<span class="line"><span>        //5.objectWrapperFactory  </span></span>
<span class="line"><span>        objectWrapperFactoryElement(root.evalNode(&quot;objectWrapperFactory&quot;));  </span></span>
<span class="line"><span>        //6.settings  </span></span>
<span class="line"><span>        settingsElement(root.evalNode(&quot;settings&quot;));  </span></span>
<span class="line"><span>        //7.处理environments  </span></span>
<span class="line"><span>        environmentsElement(root.evalNode(&quot;environments&quot;)); // read it after objectFactory and objectWrapperFactory issue #631  </span></span>
<span class="line"><span>        //8.database  </span></span>
<span class="line"><span>        databaseIdProviderElement(root.evalNode(&quot;databaseIdProvider&quot;));  </span></span>
<span class="line"><span>        //9.typeHandlers  </span></span>
<span class="line"><span>        typeHandlerElement(root.evalNode(&quot;typeHandlers&quot;));  </span></span>
<span class="line"><span>        //10.mappers  </span></span>
<span class="line"><span>        mapperElement(root.evalNode(&quot;mappers&quot;));  </span></span>
<span class="line"><span>    } catch (Exception e) {  </span></span>
<span class="line"><span>        throw new BuilderException(&quot;Error parsing SQL Mapper Configuration. Cause: &quot; + e, e);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意：在上述代码中，还有一个非常重要的地方，就是解析XML配置文件子节点<code>&lt;mappers&gt;</code>的方法mapperElements(root.evalNode(&quot;mappers&quot;)), 它将解析我们配置的Mapper.xml配置文件，Mapper配置文件可以说是MyBatis的核心，MyBatis的特性和理念都体现在此Mapper的配置和设计上。</p><ul><li><strong>然后将这些值解析出来设置到Configuration对象中</strong></li></ul><p>解析子节点的过程这里就不一一介绍了，用户可以参照MyBatis源码仔细揣摩，我们就看上述的environmentsElement(root.evalNode(&quot;environments&quot;)); 方法是如何将environments的信息解析出来，设置到Configuration对象中的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** </span></span>
<span class="line"><span> * 解析environments节点，并将结果设置到Configuration对象中 </span></span>
<span class="line"><span> * 注意：创建envronment时，如果SqlSessionFactoryBuilder指定了特定的环境（即数据源）； </span></span>
<span class="line"><span> *      则返回指定环境（数据源）的Environment对象，否则返回默认的Environment对象； </span></span>
<span class="line"><span> *      这种方式实现了MyBatis可以连接多数据源 </span></span>
<span class="line"><span> */  </span></span>
<span class="line"><span>private void environmentsElement(XNode context) throws Exception {  </span></span>
<span class="line"><span>    if (context != null)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        if (environment == null)  </span></span>
<span class="line"><span>        {  </span></span>
<span class="line"><span>            environment = context.getStringAttribute(&quot;default&quot;);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>        for (XNode child : context.getChildren())  </span></span>
<span class="line"><span>        {  </span></span>
<span class="line"><span>            String id = child.getStringAttribute(&quot;id&quot;);  </span></span>
<span class="line"><span>            if (isSpecifiedEnvironment(id))  </span></span>
<span class="line"><span>            {  </span></span>
<span class="line"><span>                //1.创建事务工厂 TransactionFactory  </span></span>
<span class="line"><span>                TransactionFactory txFactory = transactionManagerElement(child.evalNode(&quot;transactionManager&quot;));  </span></span>
<span class="line"><span>                DataSourceFactory dsFactory = dataSourceElement(child.evalNode(&quot;dataSource&quot;));  </span></span>
<span class="line"><span>                //2.创建数据源DataSource  </span></span>
<span class="line"><span>                DataSource dataSource = dsFactory.getDataSource();  </span></span>
<span class="line"><span>                //3. 构造Environment对象  </span></span>
<span class="line"><span>                Environment.Builder environmentBuilder = new Environment.Builder(id)  </span></span>
<span class="line"><span>                .transactionFactory(txFactory)  </span></span>
<span class="line"><span>                .dataSource(dataSource);  </span></span>
<span class="line"><span>                //4. 将创建的Envronment对象设置到configuration 对象中  </span></span>
<span class="line"><span>                configuration.setEnvironment(environmentBuilder.build());  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean isSpecifiedEnvironment(String id)  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    if (environment == null)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        throw new BuilderException(&quot;No environment specified.&quot;);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    else if (id == null)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        throw new BuilderException(&quot;Environment requires an id attribute.&quot;);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    else if (environment.equals(id))  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        return true;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    return false;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>返回Configuration对象</strong></li></ul><p>将上述的MyBatis初始化基本过程的序列图细化：</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h2 id="初始化方式-基于java-api" tabindex="-1">初始化方式 - 基于Java API <a class="header-anchor" href="#初始化方式-基于java-api" aria-label="Permalink to &quot;初始化方式 - 基于Java API&quot;">​</a></h2><p>当然我们可以使用XMLConfigBuilder手动解析XML配置文件来创建Configuration对象，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String resource = &quot;mybatis-config.xml&quot;;  </span></span>
<span class="line"><span>InputStream inputStream = Resources.getResourceAsStream(resource);  </span></span>
<span class="line"><span>// 手动创建XMLConfigBuilder，并解析创建Configuration对象  </span></span>
<span class="line"><span>XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, null,null); // 看这里 </span></span>
<span class="line"><span>Configuration configuration = parser.parse();  </span></span>
<span class="line"><span>// 使用Configuration对象创建SqlSessionFactory  </span></span>
<span class="line"><span>SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);  </span></span>
<span class="line"><span>// 使用MyBatis  </span></span>
<span class="line"><span>SqlSession sqlSession = sqlSessionFactory.openSession();  </span></span>
<span class="line"><span>List list = sqlSession.selectList(&quot;com.foo.bean.BlogMapper.queryAllBlogInfo&quot;);</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,41)]))}const q=s(o,[["render",r]]);export{S as __pageData,q as default};
