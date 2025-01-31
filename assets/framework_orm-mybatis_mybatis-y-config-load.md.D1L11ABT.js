import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"MyBatis详解 - 配置解析过程","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-config-load.md","filePath":"framework/orm-mybatis/mybatis-y-config-load.md","lastUpdated":1737706346000}'),l={name:"framework/orm-mybatis/mybatis-y-config-load.md"};function t(i,s,r,c,o,u){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="mybatis详解-配置解析过程" tabindex="-1">MyBatis详解 - 配置解析过程 <a class="header-anchor" href="#mybatis详解-配置解析过程" aria-label="Permalink to &quot;MyBatis详解 - 配置解析过程&quot;">​</a></h1><blockquote><p>【本文为中优先级】通过上文我们知道MyBatis初始化过程中会解析配置，那具体是如何解析的呢？@pdai</p></blockquote><h2 id="回顾上文配置解析方法" tabindex="-1">回顾上文配置解析方法 <a class="header-anchor" href="#回顾上文配置解析方法" aria-label="Permalink to &quot;回顾上文配置解析方法&quot;">​</a></h2><p>上文配置解析中，我们看到如下的主体方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Configuration parse() {  </span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>通过以上源码，我们就能看出，在mybatis的配置文件中：</p><ul><li>configuration节点为根节点。</li><li>在configuration节点之下，我们可以配置10个子节点， 分别为：properties、typeAliases、plugins、objectFactory、objectWrapperFactory、settings、environments、databaseIdProvider、typeHandlers、mappers。</li></ul><h2 id="配置文件元素" tabindex="-1">配置文件元素 <a class="header-anchor" href="#配置文件元素" aria-label="Permalink to &quot;配置文件元素&quot;">​</a></h2><h3 id="元素1-properties" tabindex="-1">元素1：properties <a class="header-anchor" href="#元素1-properties" aria-label="Permalink to &quot;元素1：properties&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>    &lt;!-- 方法一： 从外部指定properties配置文件, 除了使用resource属性指定外，还可通过url属性指定url  </span></span>
<span class="line"><span>        &lt;properties resource=&quot;dbConfig.properties&quot;&gt;&lt;/properties&gt; </span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>    &lt;!-- 方法二： 直接配置为xml --&gt;</span></span>
<span class="line"><span>    &lt;properties&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;driver&quot; value=&quot;com.mysql.jdbc.Driver&quot;/&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;url&quot; value=&quot;jdbc:mysql://localhost:3306/test1&quot;/&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;username&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;password&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/properties&gt;</span></span></code></pre></div><p>那么，我要是两种方法都同时配置了，那么最终会采用什么样的配置呢？</p><p>首先会加载文件中的xml配置，其次是加载外部指定的properties，最后加载Java Configuration的配置。因为配置存放在Properties，它继承自HashTable类，当依次将上述几种配置源put进去时，后加载的配置会覆盖先加载的配置。所以，最终应用配置时Configuration配置优先级最高，其次是外部的properties配置文件，最后是当前xml中的配置。具体可以参考接下来的源码分析。</p><h3 id="元素2-envirements" tabindex="-1">元素2：envirements <a class="header-anchor" href="#元素2-envirements" aria-label="Permalink to &quot;元素2：envirements&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;environments default=&quot;development&quot;&gt;</span></span>
<span class="line"><span>    &lt;environment id=&quot;development&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- </span></span>
<span class="line"><span>        JDBC–这个配置直接简单使用了JDBC的提交和回滚设置。它依赖于从数据源得到的连接来管理事务范围。</span></span>
<span class="line"><span>        MANAGED–这个配置几乎没做什么。它从来不提交或回滚一个连接。而它会让容器来管理事务的整个生命周期（比如Spring或JEE应用服务器的上下文）。</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;transactionManager type=&quot;JDBC&quot;/&gt;</span></span>
<span class="line"><span>        &lt;!--</span></span>
<span class="line"><span>        UNPOOLED–这个数据源的实现是每次被请求时简单打开和关闭连接</span></span>
<span class="line"><span>        POOLED–mybatis实现的简单的数据库连接池类型，它使得数据库连接可被复用，不必在每次请求时都去创建一个物理的连接。</span></span>
<span class="line"><span>        JNDI – 通过jndi从tomcat之类的容器里获取数据源。</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;dataSource type=&quot;POOLED&quot;&gt;</span></span>
<span class="line"><span>            &lt;!--</span></span>
<span class="line"><span>            如果上面没有指定数据库配置的properties文件，那么此处可以这样直接配置 </span></span>
<span class="line"><span>            &lt;property name=&quot;driver&quot; value=&quot;com.mysql.jdbc.Driver&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;url&quot; value=&quot;jdbc:mysql://localhost:3306/test1&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;username&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;password&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>            --&gt;</span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>            &lt;!-- 上面指定了数据库配置文件， 配置文件里面也是对应的这四个属性 --&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;driver&quot; value=&quot;\${driver}&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;url&quot; value=&quot;\${url}&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;username&quot; value=&quot;\${username}&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;password&quot; value=&quot;\${password}&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/dataSource&gt;</span></span>
<span class="line"><span>    &lt;/environment&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;!-- 我再指定一个environment --&gt;</span></span>
<span class="line"><span>    &lt;environment id=&quot;test&quot;&gt;</span></span>
<span class="line"><span>        &lt;transactionManager type=&quot;JDBC&quot;/&gt;</span></span>
<span class="line"><span>        &lt;dataSource type=&quot;POOLED&quot;&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;driver&quot; value=&quot;com.mysql.jdbc.Driver&quot;/&gt;</span></span>
<span class="line"><span>            &lt;!-- 与上面的url不一样 --&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;url&quot; value=&quot;jdbc:mysql://localhost:3306/demo&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;username&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;password&quot; value=&quot;root&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/dataSource&gt;</span></span>
<span class="line"><span>    &lt;/environment&gt;</span></span>
<span class="line"><span>&lt;/environments&gt;</span></span></code></pre></div><p>environments元素节点可以配置多个environment子节点， 怎么理解呢？</p><p>假如我们系统的开发环境和正式环境所用的数据库不一样（这是肯定的）， 那么可以设置两个environment, 两个id分别对应开发环境（dev）和正式环境（final），那么通过配置environments的default属性就能选择对应的environment了， 例如，我将environments的deault属性的值配置为dev, 那么就会选择dev的environment。 至于这个是怎么实现的，下面源码就会讲。</p><h3 id="解析方法-propertieselement、environmentselement" tabindex="-1">解析方法：propertiesElement、environmentsElement <a class="header-anchor" href="#解析方法-propertieselement、environmentselement" aria-label="Permalink to &quot;解析方法：propertiesElement、environmentsElement&quot;">​</a></h3><p>好啦，上面简单给大家介绍了一下properties 和 environments 的配置， 接下来就正式开始看源码了： 上次我们说过mybatis 是通过XMLConfigBuilder这个类在解析mybatis配置文件的，那么本次就接着看看XMLConfigBuilder对于properties和environments的解析：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class XMLConfigBuilder extends BaseBuilder {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private boolean parsed;</span></span>
<span class="line"><span>    // xml解析器</span></span>
<span class="line"><span>    private XPathParser parser;</span></span>
<span class="line"><span>    private String environment;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    // 上次说到这个方法是在解析mybatis配置文件中能配置的元素节点</span></span>
<span class="line"><span>    // 今天首先要看的就是properties节点和environments节点</span></span>
<span class="line"><span>    private void parseConfiguration(XNode root) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 解析properties元素</span></span>
<span class="line"><span>            propertiesElement(root.evalNode(&quot;properties&quot;)); //issue #117 read properties first</span></span>
<span class="line"><span>            typeAliasesElement(root.evalNode(&quot;typeAliases&quot;));</span></span>
<span class="line"><span>            pluginElement(root.evalNode(&quot;plugins&quot;));</span></span>
<span class="line"><span>            objectFactoryElement(root.evalNode(&quot;objectFactory&quot;));</span></span>
<span class="line"><span>            objectWrapperFactoryElement(root.evalNode(&quot;objectWrapperFactory&quot;));</span></span>
<span class="line"><span>            settingsElement(root.evalNode(&quot;settings&quot;));</span></span>
<span class="line"><span>            // 解析environments元素</span></span>
<span class="line"><span>            environmentsElement(root.evalNode(&quot;environments&quot;)); // read it after objectFactory and objectWrapperFactory issue #631</span></span>
<span class="line"><span>            databaseIdProviderElement(root.evalNode(&quot;databaseIdProvider&quot;));</span></span>
<span class="line"><span>            typeHandlerElement(root.evalNode(&quot;typeHandlers&quot;));</span></span>
<span class="line"><span>            mapperElement(root.evalNode(&quot;mappers&quot;));</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            throw new BuilderException(&quot;Error parsing SQL Mapper Configuration. Cause: &quot; + e, e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //下面就看看解析properties的具体方法</span></span>
<span class="line"><span>    private void propertiesElement(XNode context) throws Exception {</span></span>
<span class="line"><span>        if (context != null) {</span></span>
<span class="line"><span>            // 将子节点的 name 以及value属性set进properties对象</span></span>
<span class="line"><span>            Properties defaults = context.getChildrenAsProperties();</span></span>
<span class="line"><span>            // 获取properties节点上 resource属性的值</span></span>
<span class="line"><span>            String resource = context.getStringAttribute(&quot;resource&quot;);</span></span>
<span class="line"><span>            // 获取properties节点上 url属性的值, resource和url不能同时配置</span></span>
<span class="line"><span>            String url = context.getStringAttribute(&quot;url&quot;);</span></span>
<span class="line"><span>            if (resource != null &amp;&amp; url != null) {</span></span>
<span class="line"><span>                throw new BuilderException(&quot;The properties element cannot specify both a URL and a resource based property file reference.  Please specify one or the other.&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 把解析出的properties文件set进Properties对象</span></span>
<span class="line"><span>            if (resource != null) {</span></span>
<span class="line"><span>                defaults.putAll(Resources.getResourceAsProperties(resource));</span></span>
<span class="line"><span>            } else if (url != null) {</span></span>
<span class="line"><span>                defaults.putAll(Resources.getUrlAsProperties(url));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 将configuration对象中已配置的Properties属性与刚刚解析的融合</span></span>
<span class="line"><span>            // configuration这个对象会装载所解析mybatis配置文件的所有节点元素，以后也会频频提到这个对象</span></span>
<span class="line"><span>            // 既然configuration对象用有一系列的get/set方法， 那是否就标志着我们可以使用java代码直接配置？ </span></span>
<span class="line"><span>            // 答案是肯定的， 不过使用配置文件进行配置，优势不言而喻</span></span>
<span class="line"><span>            Properties vars = configuration.getVariables();</span></span>
<span class="line"><span>            if (vars != null) {</span></span>
<span class="line"><span>                defaults.putAll(vars);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 把装有解析配置propertis对象set进解析器， 因为后面可能会用到</span></span>
<span class="line"><span>            parser.setVariables(defaults);</span></span>
<span class="line"><span>            // set进configuration对象</span></span>
<span class="line"><span>            configuration.setVariables(defaults);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //下面再看看解析enviroments元素节点的方法</span></span>
<span class="line"><span>    private void environmentsElement(XNode context) throws Exception {</span></span>
<span class="line"><span>        if (context != null) {</span></span>
<span class="line"><span>            if (environment == null) {</span></span>
<span class="line"><span>                //解析environments节点的default属性的值</span></span>
<span class="line"><span>                //例如: &lt;environments default=&quot;development&quot;&gt;</span></span>
<span class="line"><span>                environment = context.getStringAttribute(&quot;default&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            //递归解析environments子节点</span></span>
<span class="line"><span>            for (XNode child : context.getChildren()) {</span></span>
<span class="line"><span>                //&lt;environment id=&quot;development&quot;&gt;, 只有enviroment节点有id属性，那么这个属性有何作用？</span></span>
<span class="line"><span>                //environments 节点下可以拥有多个 environment子节点</span></span>
<span class="line"><span>                //类似于这样： &lt;environments default=&quot;development&quot;&gt;&lt;environment id=&quot;development&quot;&gt;...&lt;/environment&gt;&lt;environment id=&quot;test&quot;&gt;...&lt;/environments&gt;</span></span>
<span class="line"><span>                //意思就是我们可以对应多个环境，比如开发环境，测试环境等， 由environments的default属性去选择对应的enviroment</span></span>
<span class="line"><span>                String id = child.getStringAttribute(&quot;id&quot;);</span></span>
<span class="line"><span>                //isSpecial就是根据由environments的default属性去选择对应的enviroment</span></span>
<span class="line"><span>                if (isSpecifiedEnvironment(id)) {</span></span>
<span class="line"><span>                    //事务， mybatis有两种：JDBC 和 MANAGED, 配置为JDBC则直接使用JDBC的事务，配置为MANAGED则是将事务托管给容器， </span></span>
<span class="line"><span>                    TransactionFactory txFactory = transactionManagerElement(child.evalNode(&quot;transactionManager&quot;));</span></span>
<span class="line"><span>                    //enviroment节点下面就是dataSource节点了，解析dataSource节点（下面会贴出解析dataSource的具体方法）</span></span>
<span class="line"><span>                    DataSourceFactory dsFactory = dataSourceElement(child.evalNode(&quot;dataSource&quot;));</span></span>
<span class="line"><span>                    DataSource dataSource = dsFactory.getDataSource();</span></span>
<span class="line"><span>                    Environment.Builder environmentBuilder = new Environment.Builder(id)</span></span>
<span class="line"><span>                          .transactionFactory(txFactory)</span></span>
<span class="line"><span>                          .dataSource(dataSource);</span></span>
<span class="line"><span>                    //老规矩，会将dataSource设置进configuration对象</span></span>
<span class="line"><span>                    configuration.setEnvironment(environmentBuilder.build());</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //下面看看dataSource的解析方法</span></span>
<span class="line"><span>    private DataSourceFactory dataSourceElement(XNode context) throws Exception {</span></span>
<span class="line"><span>        if (context != null) {</span></span>
<span class="line"><span>            //dataSource的连接池</span></span>
<span class="line"><span>            String type = context.getStringAttribute(&quot;type&quot;);</span></span>
<span class="line"><span>            //子节点 name, value属性set进一个properties对象</span></span>
<span class="line"><span>            Properties props = context.getChildrenAsProperties();</span></span>
<span class="line"><span>            //创建dataSourceFactory</span></span>
<span class="line"><span>            DataSourceFactory factory = (DataSourceFactory) resolveClass(type).newInstance();</span></span>
<span class="line"><span>            factory.setProperties(props);</span></span>
<span class="line"><span>            return factory;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        throw new BuilderException(&quot;Environment declaration requires a DataSourceFactory.&quot;);</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过以上对mybatis源码的解读，相信大家对mybatis的配置又有了一个深入的认识。还有一个问题， 上面我们看到，在配置dataSource的时候使用了 \${driver} 这种表达式， 这种形式是怎么解析的？其实，是通过PropertyParser这个类解析：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 这个类解析\${}这种形式的表达式</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class PropertyParser {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static String parse(String string, Properties variables) {</span></span>
<span class="line"><span>        VariableTokenHandler handler = new VariableTokenHandler(variables);</span></span>
<span class="line"><span>        GenericTokenParser parser = new GenericTokenParser(&quot;\${&quot;, &quot;}&quot;, handler);</span></span>
<span class="line"><span>        return parser.parse(string);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static class VariableTokenHandler implements TokenHandler {</span></span>
<span class="line"><span>        private Properties variables;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public VariableTokenHandler(Properties variables) {</span></span>
<span class="line"><span>            this.variables = variables;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public String handleToken(String content) {</span></span>
<span class="line"><span>            if (variables != null &amp;&amp; variables.containsKey(content)) {</span></span>
<span class="line"><span>                return variables.getProperty(content);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return &quot;\${&quot; + content + &quot;}&quot;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上就是对于properties 和 environments元素节点的分析，比较重要的都在对于源码的注释中标出。</p><h3 id="元素3-typealiases" tabindex="-1">元素3：typeAliases <a class="header-anchor" href="#元素3-typealiases" aria-label="Permalink to &quot;元素3：typeAliases&quot;">​</a></h3><p>typeAliases节点主要用来设置别名，其实这是挺好用的一个功能， 通过配置别名，我们不用再指定完整的包名，并且还能取别名。</p><p>例如： 我们在使用 com.demo.entity. UserEntity 的时候，我们可以直接配置一个别名user, 这样以后在配置文件中要使用到com.demo.entity.UserEntity的时候，直接使用User即可。</p><p>就以上例为例，我们来实现一下，看看typeAliases的配置方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>    &lt;typeAliases&gt;</span></span>
<span class="line"><span>        &lt;!--</span></span>
<span class="line"><span>        通过package, 可以直接指定package的名字， mybatis会自动扫描你指定包下面的javabean,</span></span>
<span class="line"><span>        并且默认设置一个别名，默认的名字为： javabean 的首字母小写的非限定类名来作为它的别名。</span></span>
<span class="line"><span>        也可在javabean 加上注解@Alias 来自定义别名， 例如： @Alias(user) </span></span>
<span class="line"><span>        &lt;package name=&quot;com.dy.entity&quot;/&gt;</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;typeAlias alias=&quot;UserEntity&quot; type=&quot;com.dy.entity.User&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/typeAliases&gt;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><p>再写一段测试代码，看看有没生效：（我只写一段伪代码）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Configuration con = sqlSessionFactory.getConfiguration();</span></span>
<span class="line"><span>Map&lt;String, Class&lt;?&gt;&gt; typeMap = con.getTypeAliasRegistry().getTypeAliases();</span></span>
<span class="line"><span>for(Entry&lt;String, Class&lt;?&gt;&gt; entry: typeMap.entrySet()) {</span></span>
<span class="line"><span>    System.out.println(entry.getKey() + &quot; ================&gt; &quot; + entry.getValue().getSimpleName());</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="解析方法-typealiaseselement" tabindex="-1">解析方法：typeAliasesElement <a class="header-anchor" href="#解析方法-typealiaseselement" aria-label="Permalink to &quot;解析方法：typeAliasesElement&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 解析typeAliases节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void typeAliasesElement(XNode parent) {</span></span>
<span class="line"><span>    if (parent != null) {</span></span>
<span class="line"><span>        for (XNode child : parent.getChildren()) {</span></span>
<span class="line"><span>            //如果子节点是package, 那么就获取package节点的name属性， mybatis会扫描指定的package</span></span>
<span class="line"><span>            if (&quot;package&quot;.equals(child.getName())) {</span></span>
<span class="line"><span>                String typeAliasPackage = child.getStringAttribute(&quot;name&quot;);</span></span>
<span class="line"><span>                //TypeAliasRegistry 负责管理别名， 这儿就是通过TypeAliasRegistry 进行别名注册， 下面就会看看TypeAliasRegistry源码</span></span>
<span class="line"><span>                configuration.getTypeAliasRegistry().registerAliases(typeAliasPackage);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                //如果子节点是typeAlias节点，那么就获取alias属性和type的属性值</span></span>
<span class="line"><span>                String alias = child.getStringAttribute(&quot;alias&quot;);</span></span>
<span class="line"><span>                String type = child.getStringAttribute(&quot;type&quot;);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    Class&lt;?&gt; clazz = Resources.classForName(type);</span></span>
<span class="line"><span>                    if (alias == null) {</span></span>
<span class="line"><span>                        typeAliasRegistry.registerAlias(clazz);</span></span>
<span class="line"><span>                    } else {</span></span>
<span class="line"><span>                        typeAliasRegistry.registerAlias(alias, clazz);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>                    throw new BuilderException(&quot;Error registering typeAlias for &#39;&quot; + alias + &quot;&#39;. Cause: &quot; + e, e);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重要的源码在这儿：TypeAliasRegistry.java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TypeAliasRegistry {</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  //这就是核心所在啊， 原来别名就仅仅通过一个HashMap来实现， key为别名， value就是别名对应的类型（class对象）</span></span>
<span class="line"><span>  private final Map&lt;String, Class&lt;?&gt;&gt; TYPE_ALIASES = new HashMap&lt;String, Class&lt;?&gt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 以下就是mybatis默认为我们注册的别名</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public TypeAliasRegistry() {</span></span>
<span class="line"><span>    registerAlias(&quot;string&quot;, String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;byte&quot;, Byte.class);</span></span>
<span class="line"><span>    registerAlias(&quot;long&quot;, Long.class);</span></span>
<span class="line"><span>    registerAlias(&quot;short&quot;, Short.class);</span></span>
<span class="line"><span>    registerAlias(&quot;int&quot;, Integer.class);</span></span>
<span class="line"><span>    registerAlias(&quot;integer&quot;, Integer.class);</span></span>
<span class="line"><span>    registerAlias(&quot;double&quot;, Double.class);</span></span>
<span class="line"><span>    registerAlias(&quot;float&quot;, Float.class);</span></span>
<span class="line"><span>    registerAlias(&quot;boolean&quot;, Boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;byte[]&quot;, Byte[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;long[]&quot;, Long[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;short[]&quot;, Short[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;int[]&quot;, Integer[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;integer[]&quot;, Integer[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;double[]&quot;, Double[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;float[]&quot;, Float[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;boolean[]&quot;, Boolean[].class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;_byte&quot;, byte.class);</span></span>
<span class="line"><span>    registerAlias(&quot;_long&quot;, long.class);</span></span>
<span class="line"><span>    registerAlias(&quot;_short&quot;, short.class);</span></span>
<span class="line"><span>    registerAlias(&quot;_int&quot;, int.class);</span></span>
<span class="line"><span>    registerAlias(&quot;_integer&quot;, int.class);</span></span>
<span class="line"><span>    registerAlias(&quot;_double&quot;, double.class);</span></span>
<span class="line"><span>    registerAlias(&quot;_float&quot;, float.class);</span></span>
<span class="line"><span>    registerAlias(&quot;_boolean&quot;, boolean.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;_byte[]&quot;, byte[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;_long[]&quot;, long[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;_short[]&quot;, short[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;_int[]&quot;, int[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;_integer[]&quot;, int[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;_double[]&quot;, double[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;_float[]&quot;, float[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;_boolean[]&quot;, boolean[].class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;date&quot;, Date.class);</span></span>
<span class="line"><span>    registerAlias(&quot;decimal&quot;, BigDecimal.class);</span></span>
<span class="line"><span>    registerAlias(&quot;bigdecimal&quot;, BigDecimal.class);</span></span>
<span class="line"><span>    registerAlias(&quot;biginteger&quot;, BigInteger.class);</span></span>
<span class="line"><span>    registerAlias(&quot;object&quot;, Object.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;date[]&quot;, Date[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;decimal[]&quot;, BigDecimal[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;bigdecimal[]&quot;, BigDecimal[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;biginteger[]&quot;, BigInteger[].class);</span></span>
<span class="line"><span>    registerAlias(&quot;object[]&quot;, Object[].class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;map&quot;, Map.class);</span></span>
<span class="line"><span>    registerAlias(&quot;hashmap&quot;, HashMap.class);</span></span>
<span class="line"><span>    registerAlias(&quot;list&quot;, List.class);</span></span>
<span class="line"><span>    registerAlias(&quot;arraylist&quot;, ArrayList.class);</span></span>
<span class="line"><span>    registerAlias(&quot;collection&quot;, Collection.class);</span></span>
<span class="line"><span>    registerAlias(&quot;iterator&quot;, Iterator.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    registerAlias(&quot;ResultSet&quot;, ResultSet.class);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 处理别名， 直接从保存有别名的hashMap中取出即可</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>  public &lt;T&gt; Class&lt;T&gt; resolveAlias(String string) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      if (string == null) return null;</span></span>
<span class="line"><span>      String key = string.toLowerCase(Locale.ENGLISH); // issue #748</span></span>
<span class="line"><span>      Class&lt;T&gt; value;</span></span>
<span class="line"><span>      if (TYPE_ALIASES.containsKey(key)) {</span></span>
<span class="line"><span>        value = (Class&lt;T&gt;) TYPE_ALIASES.get(key);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        value = (Class&lt;T&gt;) Resources.classForName(string);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return value;</span></span>
<span class="line"><span>    } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>      throw new TypeException(&quot;Could not resolve type alias &#39;&quot; + string + &quot;&#39;.  Cause: &quot; + e, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 配置文件中配置为package的时候， 会调用此方法，根据配置的报名去扫描javabean ，然后自动注册别名</span></span>
<span class="line"><span>   * 默认会使用 Bean 的首字母小写的非限定类名来作为它的别名</span></span>
<span class="line"><span>   * 也可在javabean 加上注解@Alias 来自定义别名， 例如： @Alias(user)</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public void registerAliases(String packageName){</span></span>
<span class="line"><span>    registerAliases(packageName, Object.class);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void registerAliases(String packageName, Class&lt;?&gt; superType){</span></span>
<span class="line"><span>    ResolverUtil&lt;Class&lt;?&gt;&gt; resolverUtil = new ResolverUtil&lt;Class&lt;?&gt;&gt;();</span></span>
<span class="line"><span>    resolverUtil.find(new ResolverUtil.IsA(superType), packageName);</span></span>
<span class="line"><span>    Set&lt;Class&lt;? extends Class&lt;?&gt;&gt;&gt; typeSet = resolverUtil.getClasses();</span></span>
<span class="line"><span>    for(Class&lt;?&gt; type : typeSet){</span></span>
<span class="line"><span>      // Ignore inner classes and interfaces (including package-info.java)</span></span>
<span class="line"><span>      // Skip also inner classes. See issue #6</span></span>
<span class="line"><span>      if (!type.isAnonymousClass() &amp;&amp; !type.isInterface() &amp;&amp; !type.isMemberClass()) {</span></span>
<span class="line"><span>        registerAlias(type);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void registerAlias(Class&lt;?&gt; type) {</span></span>
<span class="line"><span>    String alias = type.getSimpleName();</span></span>
<span class="line"><span>    Alias aliasAnnotation = type.getAnnotation(Alias.class);</span></span>
<span class="line"><span>    if (aliasAnnotation != null) {</span></span>
<span class="line"><span>      alias = aliasAnnotation.value();</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    registerAlias(alias, type);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //这就是注册别名的本质方法， 其实就是向保存别名的hashMap新增值而已， 呵呵， 别名的实现太简单了，对吧</span></span>
<span class="line"><span>  public void registerAlias(String alias, Class&lt;?&gt; value) {</span></span>
<span class="line"><span>    if (alias == null) throw new TypeException(&quot;The parameter alias cannot be null&quot;);</span></span>
<span class="line"><span>    String key = alias.toLowerCase(Locale.ENGLISH); // issue #748</span></span>
<span class="line"><span>    if (TYPE_ALIASES.containsKey(key) &amp;&amp; TYPE_ALIASES.get(key) != null &amp;&amp; !TYPE_ALIASES.get(key).equals(value)) {</span></span>
<span class="line"><span>      throw new TypeException(&quot;The alias &#39;&quot; + alias + &quot;&#39; is already mapped to the value &#39;&quot; + TYPE_ALIASES.get(key).getName() + &quot;&#39;.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    TYPE_ALIASES.put(key, value);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void registerAlias(String alias, String value) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      registerAlias(alias, Resources.classForName(value));</span></span>
<span class="line"><span>    } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>      throw new TypeException(&quot;Error registering type alias &quot;+alias+&quot; for &quot;+value+&quot;. Cause: &quot; + e, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 获取保存别名的HashMap, Configuration对象持有对TypeAliasRegistry的引用，因此，如果需要，我们可以通过Configuration对象获取</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public Map&lt;String, Class&lt;?&gt;&gt; getTypeAliases() {</span></span>
<span class="line"><span>    return Collections.unmodifiableMap(TYPE_ALIASES);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由源码可见，设置别名的原理就这么简单，Mybatis默认给我们设置了不少别名，在上面代码中都可以见到。</p><h3 id="元素4-typehandler" tabindex="-1">元素4：TypeHandler <a class="header-anchor" href="#元素4-typehandler" aria-label="Permalink to &quot;元素4：TypeHandler&quot;">​</a></h3><blockquote><p>Mybatis中的TypeHandler是什么？</p></blockquote><p>无论是 MyBatis 在预处理语句（PreparedStatement）中设置一个参数时，还是从结果集中取出一个值时，都会用类型处理器将获取的值以合适的方式转换成 Java 类型。Mybatis默认为我们实现了许多TypeHandler, 当我们没有配置指定TypeHandler时，Mybatis会根据参数或者返回结果的不同，默认为我们选择合适的TypeHandler处理。</p><p>那么，Mybatis为我们实现了哪些TypeHandler呢? 我们怎么自定义实现一个TypeHandler ? 这些都会在接下来的mybatis的源码中看到。在看源码之前，还是像之前一样，先看看怎么配置吧？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>    &lt;typeHandlers&gt;</span></span>
<span class="line"><span>      &lt;!-- </span></span>
<span class="line"><span>          当配置package的时候，mybatis会去配置的package扫描TypeHandler</span></span>
<span class="line"><span>          &lt;package name=&quot;com.dy.demo&quot;/&gt;</span></span>
<span class="line"><span>       --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- handler属性直接配置我们要指定的TypeHandler --&gt;</span></span>
<span class="line"><span>      &lt;typeHandler handler=&quot;&quot;/&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- javaType 配置java类型，例如String, 如果配上javaType, 那么指定的typeHandler就只作用于指定的类型 --&gt;</span></span>
<span class="line"><span>      &lt;typeHandler javaType=&quot;&quot; handler=&quot;&quot;/&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- jdbcType 配置数据库基本数据类型，例如varchar, 如果配上jdbcType, 那么指定的typeHandler就只作用于指定的类型  --&gt;</span></span>
<span class="line"><span>      &lt;typeHandler jdbcType=&quot;&quot; handler=&quot;&quot;/&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 也可两者都配置 --&gt;</span></span>
<span class="line"><span>      &lt;typeHandler javaType=&quot;&quot; jdbcType=&quot;&quot; handler=&quot;&quot;/&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>  &lt;/typeHandlers&gt;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><h3 id="解析方法-typehandlerelement" tabindex="-1">解析方法：typeHandlerElement <a class="header-anchor" href="#解析方法-typehandlerelement" aria-label="Permalink to &quot;解析方法：typeHandlerElement&quot;">​</a></h3><p>上面简单介绍了一下TypeHandler, 下面就看看mybatis中TypeHandler的源码了。老规矩，先从对xml的解析讲起：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 解析typeHandlers节点</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void typeHandlerElement(XNode parent) throws Exception {</span></span>
<span class="line"><span>    if (parent != null) {</span></span>
<span class="line"><span>      for (XNode child : parent.getChildren()) {</span></span>
<span class="line"><span>        //子节点为package时，获取其name属性的值，然后自动扫描package下的自定义typeHandler</span></span>
<span class="line"><span>        if (&quot;package&quot;.equals(child.getName())) {</span></span>
<span class="line"><span>          String typeHandlerPackage = child.getStringAttribute(&quot;name&quot;);</span></span>
<span class="line"><span>          typeHandlerRegistry.register(typeHandlerPackage);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          //子节点为typeHandler时， 可以指定javaType属性， 也可以指定jdbcType, 也可两者都指定</span></span>
<span class="line"><span>          //javaType 是指定java类型</span></span>
<span class="line"><span>          //jdbcType 是指定jdbc类型（数据库类型： 如varchar）</span></span>
<span class="line"><span>          String javaTypeName = child.getStringAttribute(&quot;javaType&quot;);</span></span>
<span class="line"><span>          String jdbcTypeName = child.getStringAttribute(&quot;jdbcType&quot;);</span></span>
<span class="line"><span>          //handler就是我们配置的typeHandler</span></span>
<span class="line"><span>          String handlerTypeName = child.getStringAttribute(&quot;handler&quot;);</span></span>
<span class="line"><span>          //resolveClass方法就是我们上篇文章所讲的TypeAliasRegistry里面处理别名的方法</span></span>
<span class="line"><span>          Class&lt;?&gt; javaTypeClass = resolveClass(javaTypeName);</span></span>
<span class="line"><span>          //JdbcType是一个枚举类型，resolveJdbcType方法是在获取枚举类型的值</span></span>
<span class="line"><span>          JdbcType jdbcType = resolveJdbcType(jdbcTypeName);</span></span>
<span class="line"><span>          Class&lt;?&gt; typeHandlerClass = resolveClass(handlerTypeName);</span></span>
<span class="line"><span>          //注册typeHandler, typeHandler通过TypeHandlerRegistry这个类管理</span></span>
<span class="line"><span>          if (javaTypeClass != null) {</span></span>
<span class="line"><span>            if (jdbcType == null) {</span></span>
<span class="line"><span>              typeHandlerRegistry.register(javaTypeClass, typeHandlerClass);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>              typeHandlerRegistry.register(javaTypeClass, jdbcType, typeHandlerClass);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            typeHandlerRegistry.register(typeHandlerClass);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来看看TypeHandler的管理注册类：TypeHandlerRegistry.java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * typeHandler注册管理类</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public final class TypeHandlerRegistry {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //源码一上来，二话不说，几个大大的HashMap就出现，这不又跟上次讲的typeAliases的注册类似么</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //基本数据类型与其包装类</span></span>
<span class="line"><span>  private static final Map&lt;Class&lt;?&gt;, Class&lt;?&gt;&gt; reversePrimitiveMap = new HashMap&lt;Class&lt;?&gt;, Class&lt;?&gt;&gt;() {</span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      put(Byte.class, byte.class);</span></span>
<span class="line"><span>      put(Short.class, short.class);</span></span>
<span class="line"><span>      put(Integer.class, int.class);</span></span>
<span class="line"><span>      put(Long.class, long.class);</span></span>
<span class="line"><span>      put(Float.class, float.class);</span></span>
<span class="line"><span>      put(Double.class, double.class);</span></span>
<span class="line"><span>      put(Boolean.class, boolean.class);</span></span>
<span class="line"><span>      put(Character.class, char.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //这几个MAP不用说就知道存的是什么东西吧，命名的好处</span></span>
<span class="line"><span>  private final Map&lt;JdbcType, TypeHandler&lt;?&gt;&gt; JDBC_TYPE_HANDLER_MAP = new EnumMap&lt;JdbcType, TypeHandler&lt;?&gt;&gt;(JdbcType.class);</span></span>
<span class="line"><span>  private final Map&lt;Type, Map&lt;JdbcType, TypeHandler&lt;?&gt;&gt;&gt; TYPE_HANDLER_MAP = new HashMap&lt;Type, Map&lt;JdbcType, TypeHandler&lt;?&gt;&gt;&gt;();</span></span>
<span class="line"><span>  private final TypeHandler&lt;Object&gt; UNKNOWN_TYPE_HANDLER = new UnknownTypeHandler(this);</span></span>
<span class="line"><span>  private final Map&lt;Class&lt;?&gt;, TypeHandler&lt;?&gt;&gt; ALL_TYPE_HANDLERS_MAP = new HashMap&lt;Class&lt;?&gt;, TypeHandler&lt;?&gt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //就像上篇文章讲的typeAliases一样，mybatis也默认给我们注册了不少的typeHandler</span></span>
<span class="line"><span>  //具体如下</span></span>
<span class="line"><span>  public TypeHandlerRegistry() {</span></span>
<span class="line"><span>    register(Boolean.class, new BooleanTypeHandler());</span></span>
<span class="line"><span>    register(boolean.class, new BooleanTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.BOOLEAN, new BooleanTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.BIT, new BooleanTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Byte.class, new ByteTypeHandler());</span></span>
<span class="line"><span>    register(byte.class, new ByteTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.TINYINT, new ByteTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Short.class, new ShortTypeHandler());</span></span>
<span class="line"><span>    register(short.class, new ShortTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.SMALLINT, new ShortTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Integer.class, new IntegerTypeHandler());</span></span>
<span class="line"><span>    register(int.class, new IntegerTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.INTEGER, new IntegerTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Long.class, new LongTypeHandler());</span></span>
<span class="line"><span>    register(long.class, new LongTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Float.class, new FloatTypeHandler());</span></span>
<span class="line"><span>    register(float.class, new FloatTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.FLOAT, new FloatTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Double.class, new DoubleTypeHandler());</span></span>
<span class="line"><span>    register(double.class, new DoubleTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.DOUBLE, new DoubleTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(String.class, new StringTypeHandler());</span></span>
<span class="line"><span>    register(String.class, JdbcType.CHAR, new StringTypeHandler());</span></span>
<span class="line"><span>    register(String.class, JdbcType.CLOB, new ClobTypeHandler());</span></span>
<span class="line"><span>    register(String.class, JdbcType.VARCHAR, new StringTypeHandler());</span></span>
<span class="line"><span>    register(String.class, JdbcType.LONGVARCHAR, new ClobTypeHandler());</span></span>
<span class="line"><span>    register(String.class, JdbcType.NVARCHAR, new NStringTypeHandler());</span></span>
<span class="line"><span>    register(String.class, JdbcType.NCHAR, new NStringTypeHandler());</span></span>
<span class="line"><span>    register(String.class, JdbcType.NCLOB, new NClobTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.CHAR, new StringTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.VARCHAR, new StringTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.CLOB, new ClobTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.LONGVARCHAR, new ClobTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.NVARCHAR, new NStringTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.NCHAR, new NStringTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.NCLOB, new NClobTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Object.class, JdbcType.ARRAY, new ArrayTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.ARRAY, new ArrayTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(BigInteger.class, new BigIntegerTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.BIGINT, new LongTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(BigDecimal.class, new BigDecimalTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.REAL, new BigDecimalTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.DECIMAL, new BigDecimalTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.NUMERIC, new BigDecimalTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Byte[].class, new ByteObjectArrayTypeHandler());</span></span>
<span class="line"><span>    register(Byte[].class, JdbcType.BLOB, new BlobByteObjectArrayTypeHandler());</span></span>
<span class="line"><span>    register(Byte[].class, JdbcType.LONGVARBINARY, new BlobByteObjectArrayTypeHandler());</span></span>
<span class="line"><span>    register(byte[].class, new ByteArrayTypeHandler());</span></span>
<span class="line"><span>    register(byte[].class, JdbcType.BLOB, new BlobTypeHandler());</span></span>
<span class="line"><span>    register(byte[].class, JdbcType.LONGVARBINARY, new BlobTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.LONGVARBINARY, new BlobTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.BLOB, new BlobTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Object.class, UNKNOWN_TYPE_HANDLER);</span></span>
<span class="line"><span>    register(Object.class, JdbcType.OTHER, UNKNOWN_TYPE_HANDLER);</span></span>
<span class="line"><span>    register(JdbcType.OTHER, UNKNOWN_TYPE_HANDLER);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(Date.class, new DateTypeHandler());</span></span>
<span class="line"><span>    register(Date.class, JdbcType.DATE, new DateOnlyTypeHandler());</span></span>
<span class="line"><span>    register(Date.class, JdbcType.TIME, new TimeOnlyTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.TIMESTAMP, new DateTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.DATE, new DateOnlyTypeHandler());</span></span>
<span class="line"><span>    register(JdbcType.TIME, new TimeOnlyTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    register(java.sql.Date.class, new SqlDateTypeHandler());</span></span>
<span class="line"><span>    register(java.sql.Time.class, new SqlTimeTypeHandler());</span></span>
<span class="line"><span>    register(java.sql.Timestamp.class, new SqlTimestampTypeHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // issue #273</span></span>
<span class="line"><span>    register(Character.class, new CharacterTypeHandler());</span></span>
<span class="line"><span>    register(char.class, new CharacterTypeHandler());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean hasTypeHandler(Class&lt;?&gt; javaType) {</span></span>
<span class="line"><span>    return hasTypeHandler(javaType, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean hasTypeHandler(TypeReference&lt;?&gt; javaTypeReference) {</span></span>
<span class="line"><span>    return hasTypeHandler(javaTypeReference, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean hasTypeHandler(Class&lt;?&gt; javaType, JdbcType jdbcType) {</span></span>
<span class="line"><span>    return javaType != null &amp;&amp; getTypeHandler((Type) javaType, jdbcType) != null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean hasTypeHandler(TypeReference&lt;?&gt; javaTypeReference, JdbcType jdbcType) {</span></span>
<span class="line"><span>    return javaTypeReference != null &amp;&amp; getTypeHandler(javaTypeReference, jdbcType) != null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public TypeHandler&lt;?&gt; getMappingTypeHandler(Class&lt;? extends TypeHandler&lt;?&gt;&gt; handlerType) {</span></span>
<span class="line"><span>    return ALL_TYPE_HANDLERS_MAP.get(handlerType);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public &lt;T&gt; TypeHandler&lt;T&gt; getTypeHandler(Class&lt;T&gt; type) {</span></span>
<span class="line"><span>    return getTypeHandler((Type) type, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public &lt;T&gt; TypeHandler&lt;T&gt; getTypeHandler(TypeReference&lt;T&gt; javaTypeReference) {</span></span>
<span class="line"><span>    return getTypeHandler(javaTypeReference, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public TypeHandler&lt;?&gt; getTypeHandler(JdbcType jdbcType) {</span></span>
<span class="line"><span>    return JDBC_TYPE_HANDLER_MAP.get(jdbcType);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public &lt;T&gt; TypeHandler&lt;T&gt; getTypeHandler(Class&lt;T&gt; type, JdbcType jdbcType) {</span></span>
<span class="line"><span>    return getTypeHandler((Type) type, jdbcType);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public &lt;T&gt; TypeHandler&lt;T&gt; getTypeHandler(TypeReference&lt;T&gt; javaTypeReference, JdbcType jdbcType) {</span></span>
<span class="line"><span>    return getTypeHandler(javaTypeReference.getRawType(), jdbcType);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private &lt;T&gt; TypeHandler&lt;T&gt; getTypeHandler(Type type, JdbcType jdbcType) {</span></span>
<span class="line"><span>    Map&lt;JdbcType, TypeHandler&lt;?&gt;&gt; jdbcHandlerMap = TYPE_HANDLER_MAP.get(type);</span></span>
<span class="line"><span>    TypeHandler&lt;?&gt; handler = null;</span></span>
<span class="line"><span>    if (jdbcHandlerMap != null) {</span></span>
<span class="line"><span>      handler = jdbcHandlerMap.get(jdbcType);</span></span>
<span class="line"><span>      if (handler == null) {</span></span>
<span class="line"><span>        handler = jdbcHandlerMap.get(null);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (handler == null &amp;&amp; type != null &amp;&amp; type instanceof Class &amp;&amp; Enum.class.isAssignableFrom((Class&lt;?&gt;) type)) {</span></span>
<span class="line"><span>      handler = new EnumTypeHandler((Class&lt;?&gt;) type);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>    // type drives generics here</span></span>
<span class="line"><span>    TypeHandler&lt;T&gt; returned = (TypeHandler&lt;T&gt;) handler;</span></span>
<span class="line"><span>    return returned;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public TypeHandler&lt;Object&gt; getUnknownTypeHandler() {</span></span>
<span class="line"><span>    return UNKNOWN_TYPE_HANDLER;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void register(JdbcType jdbcType, TypeHandler&lt;?&gt; handler) {</span></span>
<span class="line"><span>    JDBC_TYPE_HANDLER_MAP.put(jdbcType, handler);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //</span></span>
<span class="line"><span>  // REGISTER INSTANCE</span></span>
<span class="line"><span>  //</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 只配置了typeHandler, 没有配置jdbcType 或者javaType</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>  public &lt;T&gt; void register(TypeHandler&lt;T&gt; typeHandler) {</span></span>
<span class="line"><span>    boolean mappedTypeFound = false;</span></span>
<span class="line"><span>    //在自定义typeHandler的时候，可以加上注解MappedTypes 去指定关联的javaType</span></span>
<span class="line"><span>    //因此，此处需要扫描MappedTypes注解</span></span>
<span class="line"><span>    MappedTypes mappedTypes = typeHandler.getClass().getAnnotation(MappedTypes.class);</span></span>
<span class="line"><span>    if (mappedTypes != null) {</span></span>
<span class="line"><span>      for (Class&lt;?&gt; handledType : mappedTypes.value()) {</span></span>
<span class="line"><span>        register(handledType, typeHandler);</span></span>
<span class="line"><span>        mappedTypeFound = true;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // @since 3.1.0 - try to auto-discover the mapped type</span></span>
<span class="line"><span>    if (!mappedTypeFound &amp;&amp; typeHandler instanceof TypeReference) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        TypeReference&lt;T&gt; typeReference = (TypeReference&lt;T&gt;) typeHandler;</span></span>
<span class="line"><span>        register(typeReference.getRawType(), typeHandler);</span></span>
<span class="line"><span>        mappedTypeFound = true;</span></span>
<span class="line"><span>      } catch (Throwable t) {</span></span>
<span class="line"><span>        // maybe users define the TypeReference with a different type and are not assignable, so just ignore it</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!mappedTypeFound) {</span></span>
<span class="line"><span>      register((Class&lt;T&gt;) null, typeHandler);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 配置了typeHandlerhe和javaType</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public &lt;T&gt; void register(Class&lt;T&gt; javaType, TypeHandler&lt;? extends T&gt; typeHandler) {</span></span>
<span class="line"><span>    register((Type) javaType, typeHandler);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private &lt;T&gt; void register(Type javaType, TypeHandler&lt;? extends T&gt; typeHandler) {</span></span>
<span class="line"><span>    //扫描注解MappedJdbcTypes</span></span>
<span class="line"><span>    MappedJdbcTypes mappedJdbcTypes = typeHandler.getClass().getAnnotation(MappedJdbcTypes.class);</span></span>
<span class="line"><span>    if (mappedJdbcTypes != null) {</span></span>
<span class="line"><span>      for (JdbcType handledJdbcType : mappedJdbcTypes.value()) {</span></span>
<span class="line"><span>        register(javaType, handledJdbcType, typeHandler);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (mappedJdbcTypes.includeNullJdbcType()) {</span></span>
<span class="line"><span>        register(javaType, null, typeHandler);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      register(javaType, null, typeHandler);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public &lt;T&gt; void register(TypeReference&lt;T&gt; javaTypeReference, TypeHandler&lt;? extends T&gt; handler) {</span></span>
<span class="line"><span>    register(javaTypeReference.getRawType(), handler);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * typeHandlerhe、javaType、jdbcType都配置了</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public &lt;T&gt; void register(Class&lt;T&gt; type, JdbcType jdbcType, TypeHandler&lt;? extends T&gt; handler) {</span></span>
<span class="line"><span>    register((Type) type, jdbcType, handler);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 注册typeHandler的核心方法</span></span>
<span class="line"><span>   * 就是向Map新增数据而已</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  private void register(Type javaType, JdbcType jdbcType, TypeHandler&lt;?&gt; handler) {</span></span>
<span class="line"><span>    if (javaType != null) {</span></span>
<span class="line"><span>      Map&lt;JdbcType, TypeHandler&lt;?&gt;&gt; map = TYPE_HANDLER_MAP.get(javaType);</span></span>
<span class="line"><span>      if (map == null) {</span></span>
<span class="line"><span>        map = new HashMap&lt;JdbcType, TypeHandler&lt;?&gt;&gt;();</span></span>
<span class="line"><span>        TYPE_HANDLER_MAP.put(javaType, map);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      map.put(jdbcType, handler);</span></span>
<span class="line"><span>      if (reversePrimitiveMap.containsKey(javaType)) {</span></span>
<span class="line"><span>        register(reversePrimitiveMap.get(javaType), jdbcType, handler);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ALL_TYPE_HANDLERS_MAP.put(handler.getClass(), handler);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //</span></span>
<span class="line"><span>  // REGISTER CLASS</span></span>
<span class="line"><span>  //</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Only handler type</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void register(Class&lt;?&gt; typeHandlerClass) {</span></span>
<span class="line"><span>    boolean mappedTypeFound = false;</span></span>
<span class="line"><span>    MappedTypes mappedTypes = typeHandlerClass.getAnnotation(MappedTypes.class);</span></span>
<span class="line"><span>    if (mappedTypes != null) {</span></span>
<span class="line"><span>      for (Class&lt;?&gt; javaTypeClass : mappedTypes.value()) {</span></span>
<span class="line"><span>        register(javaTypeClass, typeHandlerClass);</span></span>
<span class="line"><span>        mappedTypeFound = true;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!mappedTypeFound) {</span></span>
<span class="line"><span>      register(getInstance(null, typeHandlerClass));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // java type + handler type</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void register(Class&lt;?&gt; javaTypeClass, Class&lt;?&gt; typeHandlerClass) {</span></span>
<span class="line"><span>    register(javaTypeClass, getInstance(javaTypeClass, typeHandlerClass));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // java type + jdbc type + handler type</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void register(Class&lt;?&gt; javaTypeClass, JdbcType jdbcType, Class&lt;?&gt; typeHandlerClass) {</span></span>
<span class="line"><span>    register(javaTypeClass, jdbcType, getInstance(javaTypeClass, typeHandlerClass));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Construct a handler (used also from Builders)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>  public &lt;T&gt; TypeHandler&lt;T&gt; getInstance(Class&lt;?&gt; javaTypeClass, Class&lt;?&gt; typeHandlerClass) {</span></span>
<span class="line"><span>    if (javaTypeClass != null) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        Constructor&lt;?&gt; c = typeHandlerClass.getConstructor(Class.class);</span></span>
<span class="line"><span>        return (TypeHandler&lt;T&gt;) c.newInstance(javaTypeClass);</span></span>
<span class="line"><span>      } catch (NoSuchMethodException ignored) {</span></span>
<span class="line"><span>        // ignored</span></span>
<span class="line"><span>      } catch (Exception e) {</span></span>
<span class="line"><span>        throw new TypeException(&quot;Failed invoking constructor for handler &quot; + typeHandlerClass, e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      Constructor&lt;?&gt; c = typeHandlerClass.getConstructor();</span></span>
<span class="line"><span>      return (TypeHandler&lt;T&gt;) c.newInstance();</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      throw new TypeException(&quot;Unable to find a usable constructor for &quot; + typeHandlerClass, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 根据指定的pacakge去扫描自定义的typeHander，然后注册</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public void register(String packageName) {</span></span>
<span class="line"><span>    ResolverUtil&lt;Class&lt;?&gt;&gt; resolverUtil = new ResolverUtil&lt;Class&lt;?&gt;&gt;();</span></span>
<span class="line"><span>    resolverUtil.find(new ResolverUtil.IsA(TypeHandler.class), packageName);</span></span>
<span class="line"><span>    Set&lt;Class&lt;? extends Class&lt;?&gt;&gt;&gt; handlerSet = resolverUtil.getClasses();</span></span>
<span class="line"><span>    for (Class&lt;?&gt; type : handlerSet) {</span></span>
<span class="line"><span>      //Ignore inner classes and interfaces (including package-info.java) and abstract classes</span></span>
<span class="line"><span>      if (!type.isAnonymousClass() &amp;&amp; !type.isInterface() &amp;&amp; !Modifier.isAbstract(type.getModifiers())) {</span></span>
<span class="line"><span>        register(type);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // get information</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 通过configuration对象可以获取已注册的所有typeHandler</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  public Collection&lt;TypeHandler&lt;?&gt;&gt; getTypeHandlers() {</span></span>
<span class="line"><span>    return Collections.unmodifiableCollection(ALL_TYPE_HANDLERS_MAP.values());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由源码可以看到， mybatis为我们实现了那么多TypeHandler, 随便打开一个TypeHandler，看其源码，都可以看到，它继承自一个抽象类：BaseTypeHandler， 那么我们是不是也能通过继承BaseTypeHandler，从而实现自定义的TypeHandler ? 答案是肯定的， 那么现在下面就为大家演示一下自定义TypeHandler。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@MappedJdbcTypes(JdbcType.VARCHAR)  </span></span>
<span class="line"><span>//此处如果不用注解指定jdbcType, 那么，就可以在配置文件中通过&quot;jdbcType&quot;属性指定， 同理， javaType 也可通过 @MappedTypes指定</span></span>
<span class="line"><span>public class ExampleTypeHandler extends BaseTypeHandler&lt;String&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType) throws SQLException {</span></span>
<span class="line"><span>    ps.setString(i, parameter);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public String getNullableResult(ResultSet rs, String columnName) throws SQLException {</span></span>
<span class="line"><span>    return rs.getString(columnName);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {</span></span>
<span class="line"><span>    return rs.getString(columnIndex);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {</span></span>
<span class="line"><span>    return cs.getString(columnIndex);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，就该配置我们的自定义TypeHandler了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>  &lt;typeHandlers&gt;</span></span>
<span class="line"><span>      &lt;!-- 由于自定义的TypeHandler在定义时已经通过注解指定了jdbcType, 所以此处不用再配置jdbcType --&gt;</span></span>
<span class="line"><span>      &lt;typeHandler handler=&quot;ExampleTypeHandler&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/typeHandlers&gt;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><p>也就是说，我们在自定义TypeHandler的时候，可以在TypeHandler通过@MappedJdbcTypes指定jdbcType, 通过 @MappedTypes 指定javaType, 如果没有使用注解指定，那么我们就需要在配置文件中配置。详细使用，请参见Mybatis类型转换介绍。</p><h3 id="元素5-objectfactory" tabindex="-1">元素5：objectFactory <a class="header-anchor" href="#元素5-objectfactory" aria-label="Permalink to &quot;元素5：objectFactory&quot;">​</a></h3><blockquote><p>objectFactory是干什么的？ 需要配置吗？</p></blockquote><p>MyBatis 每次创建结果对象的新实例时，它都会使用一个对象工厂（ObjectFactory）实例来完成。默认的对象工厂需要做的仅仅是实例化目标类，要么通过默认构造方法，要么在参数映射存在的时候通过参数构造方法来实例化。默认情况下，我们不需要配置，mybatis会调用默认实现的objectFactory。 除非我们要自定义ObjectFactory的实现， 那么我们才需要去手动配置。</p><p>那么怎么自定义实现ObjectFactory？ 怎么配置呢？自定义ObjectFactory只需要去继承DefaultObjectFactory（是ObjectFactory接口的实现类），并重写其方法即可。具体的，本处不多说，后面再具体讲解。</p><p>写好了ObjectFactory, 仅需做如下配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    &lt;objectFactory type=&quot;org.mybatis.example.ExampleObjectFactory&quot;&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;someProperty&quot; value=&quot;100&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/objectFactory&gt;</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><h3 id="元素6-plugins" tabindex="-1">元素6：plugins <a class="header-anchor" href="#元素6-plugins" aria-label="Permalink to &quot;元素6：plugins&quot;">​</a></h3><blockquote><p>plugin有何作用？ 需要配置吗？</p></blockquote><p>plugins 是一个可选配置。mybatis中的plugin其实就是个interceptor， 它可以拦截Executor 、ParameterHandler 、ResultSetHandler 、StatementHandler 的部分方法，处理我们自己的逻辑。Executor就是真正执行sql语句的东西， ParameterHandler 是处理我们传入参数的，还记得前面讲TypeHandler的时候提到过，mybatis默认帮我们实现了不少的typeHandler, 当我们不显示配置typeHandler的时候，mybatis会根据参数类型自动选择合适的typeHandler执行，其实就是ParameterHandler 在选择。ResultSetHandler 就是处理返回结果的。</p><p>怎么自定义plugin ? 怎么配置？要自定义一个plugin, 需要去实现Interceptor接口，这儿不细说，后面实战部分会详细讲解。定义好之后，配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    &lt;plugins&gt;</span></span>
<span class="line"><span>      &lt;plugin interceptor=&quot;org.mybatis.example.ExamplePlugin&quot;&gt;</span></span>
<span class="line"><span>        &lt;property name=&quot;someProperty&quot; value=&quot;100&quot;/&gt;</span></span>
<span class="line"><span>      &lt;/plugin&gt;</span></span>
<span class="line"><span>    &lt;/plugins&gt;</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><h3 id="元素7-mappers" tabindex="-1">元素7：mappers <a class="header-anchor" href="#元素7-mappers" aria-label="Permalink to &quot;元素7：mappers&quot;">​</a></h3><blockquote><p>mappers, 这下引出mybatis的核心之一了，mappers作用 ? 需要配置吗？</p></blockquote><p>mappers 节点下，配置我们的mapper映射文件， 所谓的mapper映射文件，就是让mybatis 用来建立数据表和javabean映射的一个桥梁。在我们实际开发中，通常一个mapper文件对应一个dao接口， 这个mapper可以看做是dao的实现。所以,mappers必须配置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;configuration&gt;</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    &lt;mappers&gt;</span></span>
<span class="line"><span>        &lt;!-- 第一种方式：通过resource指定 --&gt;</span></span>
<span class="line"><span>        &lt;mapper resource=&quot;com/dy/dao/userDao.xml&quot;/&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        &lt;!-- 第二种方式， 通过class指定接口，进而将接口与对应的xml文件形成映射关系</span></span>
<span class="line"><span>             不过，使用这种方式必须保证 接口与mapper文件同名(不区分大小写)， </span></span>
<span class="line"><span>             我这儿接口是UserDao,那么意味着mapper文件为UserDao.xml </span></span>
<span class="line"><span>        &lt;mapper class=&quot;com.dy.dao.UserDao&quot;/&gt;</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>        &lt;!-- 第三种方式，直接指定包，自动扫描，与方法二同理 </span></span>
<span class="line"><span>        &lt;package name=&quot;com.dy.dao&quot;/&gt;</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;!-- 第四种方式：通过url指定mapper文件位置</span></span>
<span class="line"><span>        &lt;mapper url=&quot;file://........&quot;/&gt;</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>    &lt;/mappers&gt;</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>&lt;/configuration&gt;</span></span></code></pre></div><p>本篇仅作简单介绍，更高级的使用以及其实现原理，会在后面的实战部分进行详细讲解。</p><h3 id="解析方法-objectfactoryelement、pluginelement、mapperelement" tabindex="-1">解析方法：objectFactoryElement、pluginElement、mapperElement <a class="header-anchor" href="#解析方法-objectfactoryelement、pluginelement、mapperelement" aria-label="Permalink to &quot;解析方法：objectFactoryElement、pluginElement、mapperElement&quot;">​</a></h3><p>以上几个节点的解析源码，与之前提到的那些节点的解析类似，故此处不再讲。 我将源码折叠， 需要的可以打开看看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * objectFactory 节点解析</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>private void objectFactoryElement(XNode context) throws Exception {</span></span>
<span class="line"><span>    if (context != null) {</span></span>
<span class="line"><span>      //读取type属性的值， 接下来进行实例化ObjectFactory, 并set进 configuration</span></span>
<span class="line"><span>      //到此，简单讲一下configuration这个对象，其实它里面主要保存的都是mybatis的配置</span></span>
<span class="line"><span>      String type = context.getStringAttribute(&quot;type&quot;);</span></span>
<span class="line"><span>      //读取propertie的值， 根据需要可以配置， mybatis默认实现的objectFactory没有使用properties</span></span>
<span class="line"><span>      Properties properties = context.getChildrenAsProperties();</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      ObjectFactory factory = (ObjectFactory) resolveClass(type).newInstance();</span></span>
<span class="line"><span>      factory.setProperties(properties);</span></span>
<span class="line"><span>      configuration.setObjectFactory(factory);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * plugins 节点解析</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  private void pluginElement(XNode parent) throws Exception {</span></span>
<span class="line"><span>    if (parent != null) {</span></span>
<span class="line"><span>      for (XNode child : parent.getChildren()) {</span></span>
<span class="line"><span>        String interceptor = child.getStringAttribute(&quot;interceptor&quot;);</span></span>
<span class="line"><span>        Properties properties = child.getChildrenAsProperties();</span></span>
<span class="line"><span>        //由此可见，我们在定义一个interceptor的时候，需要去实现Interceptor, 这儿先不具体讲，以后会详细讲解</span></span>
<span class="line"><span>        Interceptor interceptorInstance = (Interceptor) resolveClass(interceptor).newInstance();</span></span>
<span class="line"><span>        interceptorInstance.setProperties(properties);</span></span>
<span class="line"><span>        configuration.addInterceptor(interceptorInstance);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * mappers 节点解析</span></span>
<span class="line"><span>   * 这是mybatis的核心之一，这儿先简单介绍，在接下来的文章会对它进行分析</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  private void mapperElement(XNode parent) throws Exception {</span></span>
<span class="line"><span>    if (parent != null) {</span></span>
<span class="line"><span>      for (XNode child : parent.getChildren()) {</span></span>
<span class="line"><span>        if (&quot;package&quot;.equals(child.getName())) {</span></span>
<span class="line"><span>          //如果mappers节点的子节点是package, 那么就扫描package下的文件, 注入进configuration</span></span>
<span class="line"><span>          String mapperPackage = child.getStringAttribute(&quot;name&quot;);</span></span>
<span class="line"><span>          configuration.addMappers(mapperPackage);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          String resource = child.getStringAttribute(&quot;resource&quot;);</span></span>
<span class="line"><span>          String url = child.getStringAttribute(&quot;url&quot;);</span></span>
<span class="line"><span>          String mapperClass = child.getStringAttribute(&quot;class&quot;);</span></span>
<span class="line"><span>          //resource, url, class 三选一</span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>          if (resource != null &amp;&amp; url == null &amp;&amp; mapperClass == null) {</span></span>
<span class="line"><span>            ErrorContext.instance().resource(resource);</span></span>
<span class="line"><span>            InputStream inputStream = Resources.getResourceAsStream(resource);</span></span>
<span class="line"><span>            //mapper映射文件都是通过XMLMapperBuilder解析</span></span>
<span class="line"><span>            XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, configuration, resource, configuration.getSqlFragments());</span></span>
<span class="line"><span>            mapperParser.parse();</span></span>
<span class="line"><span>          } else if (resource == null &amp;&amp; url != null &amp;&amp; mapperClass == null) {</span></span>
<span class="line"><span>            ErrorContext.instance().resource(url);</span></span>
<span class="line"><span>            InputStream inputStream = Resources.getUrlAsStream(url);</span></span>
<span class="line"><span>            XMLMapperBuilder mapperParser = new XMLMapperBuilder(inputStream, configuration, url, configuration.getSqlFragments());</span></span>
<span class="line"><span>            mapperParser.parse();</span></span>
<span class="line"><span>          } else if (resource == null &amp;&amp; url == null &amp;&amp; mapperClass != null) {</span></span>
<span class="line"><span>            Class&lt;?&gt; mapperInterface = Resources.classForName(mapperClass);</span></span>
<span class="line"><span>            configuration.addMapper(mapperInterface);</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            throw new BuilderException(&quot;A mapper element may only specify a url, resource or class, but not more than one.&quot;);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="元素8-settings" tabindex="-1">元素8：settings <a class="header-anchor" href="#元素8-settings" aria-label="Permalink to &quot;元素8：settings&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;settings&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;cacheEnabled&quot; value=&quot;true&quot;/&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;lazyLoadingEnabled&quot; value=&quot;true&quot;/&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;multipleResultSetsEnabled&quot; value=&quot;true&quot;/&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;useColumnLabel&quot; value=&quot;true&quot;/&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;useGeneratedKeys&quot; value=&quot;false&quot;/&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;enhancementEnabled&quot; value=&quot;false&quot;/&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;defaultExecutorType&quot; value=&quot;SIMPLE&quot;/&gt; </span></span>
<span class="line"><span>    &lt;setting name=&quot;defaultStatementTimeout&quot; value=&quot;25000&quot;/&gt; </span></span>
<span class="line"><span>&lt;/settings&gt;</span></span></code></pre></div><p>setting节点里配置的值会直接改写Configuration对应的变量值，这些变量描述的是Mybatis的全局运行方式，如果对这些属性的含义不熟悉的话建议不要配置，使用默认值即可。</p><p>具体可以参考【官网的配置清单】，详解后文。</p><h3 id="解析方法-settingselement" tabindex="-1">解析方法：settingsElement <a class="header-anchor" href="#解析方法-settingselement" aria-label="Permalink to &quot;解析方法：settingsElement&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void settingsElement(XNode context) throws Exception {</span></span>
<span class="line"><span>    if (context != null) {</span></span>
<span class="line"><span>      Properties props = context.getChildrenAsProperties();</span></span>
<span class="line"><span>      // Check that all settings are known to the configuration class</span></span>
<span class="line"><span>      MetaClass metaConfig = MetaClass.forClass(Configuration.class);</span></span>
<span class="line"><span>      for (Object key : props.keySet()) {</span></span>
<span class="line"><span>        if (!metaConfig.hasSetter(String.valueOf(key))) {</span></span>
<span class="line"><span>          throw new BuilderException(&quot;The setting &quot; + key + &quot; is not known.  Make sure you spelled it correctly (case sensitive).&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      configuration.setAutoMappingBehavior(AutoMappingBehavior.valueOf(props.getProperty(&quot;autoMappingBehavior&quot;, &quot;PARTIAL&quot;)));</span></span>
<span class="line"><span>      configuration.setCacheEnabled(booleanValueOf(props.getProperty(&quot;cacheEnabled&quot;), true));</span></span>
<span class="line"><span>      configuration.setProxyFactory((ProxyFactory) createInstance(props.getProperty(&quot;proxyFactory&quot;)));</span></span>
<span class="line"><span>      configuration.setLazyLoadingEnabled(booleanValueOf(props.getProperty(&quot;lazyLoadingEnabled&quot;), false));</span></span>
<span class="line"><span>      configuration.setAggressiveLazyLoading(booleanValueOf(props.getProperty(&quot;aggressiveLazyLoading&quot;), true));</span></span>
<span class="line"><span>      configuration.setMultipleResultSetsEnabled(booleanValueOf(props.getProperty(&quot;multipleResultSetsEnabled&quot;), true));</span></span>
<span class="line"><span>      configuration.setUseColumnLabel(booleanValueOf(props.getProperty(&quot;useColumnLabel&quot;), true));</span></span>
<span class="line"><span>      configuration.setUseGeneratedKeys(booleanValueOf(props.getProperty(&quot;useGeneratedKeys&quot;), false));</span></span>
<span class="line"><span>      configuration.setDefaultExecutorType(ExecutorType.valueOf(props.getProperty(&quot;defaultExecutorType&quot;, &quot;SIMPLE&quot;)));</span></span>
<span class="line"><span>      configuration.setDefaultStatementTimeout(integerValueOf(props.getProperty(&quot;defaultStatementTimeout&quot;), null));</span></span>
<span class="line"><span>      configuration.setMapUnderscoreToCamelCase(booleanValueOf(props.getProperty(&quot;mapUnderscoreToCamelCase&quot;), false));</span></span>
<span class="line"><span>      configuration.setSafeRowBoundsEnabled(booleanValueOf(props.getProperty(&quot;safeRowBoundsEnabled&quot;), false));</span></span>
<span class="line"><span>      configuration.setLocalCacheScope(LocalCacheScope.valueOf(props.getProperty(&quot;localCacheScope&quot;, &quot;SESSION&quot;)));</span></span>
<span class="line"><span>      configuration.setJdbcTypeForNull(JdbcType.valueOf(props.getProperty(&quot;jdbcTypeForNull&quot;, &quot;OTHER&quot;)));</span></span>
<span class="line"><span>      configuration.setLazyLoadTriggerMethods(stringSetValueOf(props.getProperty(&quot;lazyLoadTriggerMethods&quot;), &quot;equals,clone,hashCode,toString&quot;));</span></span>
<span class="line"><span>      configuration.setSafeResultHandlerEnabled(booleanValueOf(props.getProperty(&quot;safeResultHandlerEnabled&quot;), true));</span></span>
<span class="line"><span>      configuration.setDefaultScriptingLanguage(resolveClass(props.getProperty(&quot;defaultScriptingLanguage&quot;)));</span></span>
<span class="line"><span>      configuration.setCallSettersOnNulls(booleanValueOf(props.getProperty(&quot;callSettersOnNulls&quot;), false));</span></span>
<span class="line"><span>      configuration.setLogPrefix(props.getProperty(&quot;logPrefix&quot;));</span></span>
<span class="line"><span>      configuration.setLogImpl(resolveClass(props.getProperty(&quot;logImpl&quot;)));</span></span>
<span class="line"><span>      configuration.setConfigurationFactory(resolveClass(props.getProperty(&quot;configurationFactory&quot;)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,75)]))}const y=n(l,[["render",t]]);export{g as __pageData,y as default};
