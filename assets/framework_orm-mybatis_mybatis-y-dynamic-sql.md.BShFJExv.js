import{_ as a,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-1.png",l="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-2.png",i="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-4.png",o="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-5.png",c="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-6.png",r="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-7.png",d="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-8.png",u="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-9.png",g="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-10.png",m="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-11.png",h="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-12.png",q="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-13.png",b="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-14.png",y="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-15.png",v="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-16.png",f="/vitepress-blog-template/images/mybatis/mybatis-y-dynamic-sql-17.png",M=JSON.parse('{"title":"MyBatis详解 - 动态SQL使用与原理","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-dynamic-sql.md","filePath":"framework/orm-mybatis/mybatis-y-dynamic-sql.md","lastUpdated":1737706346000}'),S={name:"framework/orm-mybatis/mybatis-y-dynamic-sql.md"};function x(k,s,L,C,B,T){return p(),n("div",null,s[0]||(s[0]=[e(`<h1 id="mybatis详解-动态sql使用与原理" tabindex="-1">MyBatis详解 - 动态SQL使用与原理 <a class="header-anchor" href="#mybatis详解-动态sql使用与原理" aria-label="Permalink to &quot;MyBatis详解 - 动态SQL使用与原理&quot;">​</a></h1><blockquote><p>动态 SQL 是 MyBatis 的强大特性之一。如果你使用过 JDBC 或其它类似的框架，你应该能理解根据不同条件拼接 SQL 语句有多痛苦，例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL，可以彻底摆脱这种痛苦。@pdai</p></blockquote><h2 id="动态sql官方使用参考" tabindex="-1">动态SQL官方使用参考 <a class="header-anchor" href="#动态sql官方使用参考" aria-label="Permalink to &quot;动态SQL官方使用参考&quot;">​</a></h2><p>动态 SQL 是 MyBatis 的强大特性之一。如果你使用过 JDBC 或其它类似的框架，你应该能理解根据不同条件拼接 SQL 语句有多痛苦，例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL，可以彻底摆脱这种痛苦。</p><p>使用动态 SQL 并非一件易事，但借助可用于任何 SQL 映射语句中的强大的动态 SQL 语言，MyBatis 显著地提升了这一特性的易用性。</p><p>如果你之前用过 JSTL 或任何基于类 XML 语言的文本处理器，你对动态 SQL 元素可能会感觉似曾相识。在 MyBatis 之前的版本中，需要花时间了解大量的元素。借助功能强大的基于 OGNL 的表达式，MyBatis 3 替换了之前的大部分元素，大大精简了元素种类，现在要学习的元素种类比原来的一半还要少。</p><ul><li>if</li><li>choose (when, otherwise)</li><li>trim (where, set)</li><li>foreach</li></ul><h3 id="if" tabindex="-1">if <a class="header-anchor" href="#if" aria-label="Permalink to &quot;if&quot;">​</a></h3><p>使用动态 SQL 最常见情景是根据条件包含 where 子句的一部分。比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;findActiveBlogWithTitleLike&quot;</span></span>
<span class="line"><span>     resultType=&quot;Blog&quot;&gt;</span></span>
<span class="line"><span>  SELECT * FROM BLOG</span></span>
<span class="line"><span>  WHERE state = ‘ACTIVE’</span></span>
<span class="line"><span>  &lt;if test=&quot;title != null&quot;&gt;</span></span>
<span class="line"><span>    AND title like #{title}</span></span>
<span class="line"><span>  &lt;/if&gt;</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><p>这条语句提供了可选的查找文本功能。如果不传入 “title”，那么所有处于 “ACTIVE” 状态的 BLOG 都会返回；如果传入了 “title” 参数，那么就会对 “title” 一列进行模糊查找并返回对应的 BLOG 结果（细心的读者可能会发现，“title” 的参数值需要包含查找掩码或通配符字符）。</p><p>如果希望通过 “title” 和 “author” 两个参数进行可选搜索该怎么办呢？首先，我想先将语句名称修改成更名副其实的名称；接下来，只需要加入另一个条件即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;findActiveBlogLike&quot;</span></span>
<span class="line"><span>     resultType=&quot;Blog&quot;&gt;</span></span>
<span class="line"><span>  SELECT * FROM BLOG WHERE state = ‘ACTIVE’</span></span>
<span class="line"><span>  &lt;if test=&quot;title != null&quot;&gt;</span></span>
<span class="line"><span>    AND title like #{title}</span></span>
<span class="line"><span>  &lt;/if&gt;</span></span>
<span class="line"><span>  &lt;if test=&quot;author != null and author.name != null&quot;&gt;</span></span>
<span class="line"><span>    AND author_name like #{author.name}</span></span>
<span class="line"><span>  &lt;/if&gt;</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><h3 id="choose、when、otherwise" tabindex="-1">choose、when、otherwise <a class="header-anchor" href="#choose、when、otherwise" aria-label="Permalink to &quot;choose、when、otherwise&quot;">​</a></h3><p>有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。</p><p>还是上面的例子，但是策略变为：传入了 “title” 就按 “title” 查找，传入了 “author” 就按 “author” 查找的情形。若两者都没有传入，就返回标记为 featured 的 BLOG（这可能是管理员认为，与其返回大量的无意义随机 Blog，还不如返回一些由管理员挑选的 Blog）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;findActiveBlogLike&quot;</span></span>
<span class="line"><span>     resultType=&quot;Blog&quot;&gt;</span></span>
<span class="line"><span>  SELECT * FROM BLOG WHERE state = ‘ACTIVE’</span></span>
<span class="line"><span>  &lt;choose&gt;</span></span>
<span class="line"><span>    &lt;when test=&quot;title != null&quot;&gt;</span></span>
<span class="line"><span>      AND title like #{title}</span></span>
<span class="line"><span>    &lt;/when&gt;</span></span>
<span class="line"><span>    &lt;when test=&quot;author != null and author.name != null&quot;&gt;</span></span>
<span class="line"><span>      AND author_name like #{author.name}</span></span>
<span class="line"><span>    &lt;/when&gt;</span></span>
<span class="line"><span>    &lt;otherwise&gt;</span></span>
<span class="line"><span>      AND featured = 1</span></span>
<span class="line"><span>    &lt;/otherwise&gt;</span></span>
<span class="line"><span>  &lt;/choose&gt;</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><h3 id="trim、where、set" tabindex="-1">trim、where、set <a class="header-anchor" href="#trim、where、set" aria-label="Permalink to &quot;trim、where、set&quot;">​</a></h3><p>前面几个例子已经合宜地解决了一个臭名昭著的动态 SQL 问题。现在回到之前的 “if” 示例，这次我们将 “state = ‘ACTIVE’” 设置成动态条件，看看会发生什么。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;findActiveBlogLike&quot;</span></span>
<span class="line"><span>     resultType=&quot;Blog&quot;&gt;</span></span>
<span class="line"><span>  SELECT * FROM BLOG</span></span>
<span class="line"><span>  WHERE</span></span>
<span class="line"><span>  &lt;if test=&quot;state != null&quot;&gt;</span></span>
<span class="line"><span>    state = #{state}</span></span>
<span class="line"><span>  &lt;/if&gt;</span></span>
<span class="line"><span>  &lt;if test=&quot;title != null&quot;&gt;</span></span>
<span class="line"><span>    AND title like #{title}</span></span>
<span class="line"><span>  &lt;/if&gt;</span></span>
<span class="line"><span>  &lt;if test=&quot;author != null and author.name != null&quot;&gt;</span></span>
<span class="line"><span>    AND author_name like #{author.name}</span></span>
<span class="line"><span>  &lt;/if&gt;</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><p>如果没有匹配的条件会怎么样？最终这条 SQL 会变成这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT * FROM BLOG</span></span>
<span class="line"><span>WHERE</span></span></code></pre></div><p>这会导致查询失败。如果匹配的只是第二个条件又会怎样？这条 SQL 会是这样:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT * FROM BLOG</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>AND title like ‘someTitle’</span></span></code></pre></div><p>这个查询也会失败。这个问题不能简单地用条件元素来解决。这个问题是如此的难以解决，以至于解决过的人不会再想碰到这种问题。</p><p>MyBatis 有一个简单且适合大多数场景的解决办法。而在其他场景中，可以对其进行自定义以符合需求。而这，只需要一处简单的改动：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;findActiveBlogLike&quot;</span></span>
<span class="line"><span>     resultType=&quot;Blog&quot;&gt;</span></span>
<span class="line"><span>  SELECT * FROM BLOG</span></span>
<span class="line"><span>  &lt;where&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;state != null&quot;&gt;</span></span>
<span class="line"><span>         state = #{state}</span></span>
<span class="line"><span>    &lt;/if&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;title != null&quot;&gt;</span></span>
<span class="line"><span>        AND title like #{title}</span></span>
<span class="line"><span>    &lt;/if&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;author != null and author.name != null&quot;&gt;</span></span>
<span class="line"><span>        AND author_name like #{author.name}</span></span>
<span class="line"><span>    &lt;/if&gt;</span></span>
<span class="line"><span>  &lt;/where&gt;</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><p>where 元素只会在子元素返回任何内容的情况下才插入 “WHERE” 子句。而且，若子句的开头为 “AND” 或 “OR”，where 元素也会将它们去除。</p><p>如果 where 元素与你期望的不太一样，你也可以通过自定义 trim 元素来定制 where 元素的功能。比如，和 where 元素等价的自定义 trim 元素为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;trim prefix=&quot;WHERE&quot; prefixOverrides=&quot;AND |OR &quot;&gt;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>&lt;/trim&gt;</span></span></code></pre></div><p>prefixOverrides 属性会忽略通过管道符分隔的文本序列（注意此例中的空格是必要的）。上述例子会移除所有 prefixOverrides 属性中指定的内容，并且插入 prefix 属性中指定的内容。</p><p>用于动态更新语句的类似解决方案叫做 set。set 元素可以用于动态包含需要更新的列，忽略其它不更新的列。比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;update id=&quot;updateAuthorIfNecessary&quot;&gt;</span></span>
<span class="line"><span>  update Author</span></span>
<span class="line"><span>    &lt;set&gt;</span></span>
<span class="line"><span>      &lt;if test=&quot;username != null&quot;&gt;username=#{username},&lt;/if&gt;</span></span>
<span class="line"><span>      &lt;if test=&quot;password != null&quot;&gt;password=#{password},&lt;/if&gt;</span></span>
<span class="line"><span>      &lt;if test=&quot;email != null&quot;&gt;email=#{email},&lt;/if&gt;</span></span>
<span class="line"><span>      &lt;if test=&quot;bio != null&quot;&gt;bio=#{bio}&lt;/if&gt;</span></span>
<span class="line"><span>    &lt;/set&gt;</span></span>
<span class="line"><span>  where id=#{id}</span></span>
<span class="line"><span>&lt;/update&gt;</span></span></code></pre></div><p>这个例子中，set 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）。</p><p>来看看与 set 元素等价的自定义 trim 元素吧：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;trim prefix=&quot;SET&quot; suffixOverrides=&quot;,&quot;&gt;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>&lt;/trim&gt;</span></span></code></pre></div><p>注意，我们覆盖了后缀值设置，并且自定义了前缀值。</p><h3 id="foreach" tabindex="-1">foreach <a class="header-anchor" href="#foreach" aria-label="Permalink to &quot;foreach&quot;">​</a></h3><p>动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;selectPostIn&quot; resultType=&quot;domain.blog.Post&quot;&gt;</span></span>
<span class="line"><span>  SELECT *</span></span>
<span class="line"><span>  FROM POST P</span></span>
<span class="line"><span>  WHERE ID in</span></span>
<span class="line"><span>  &lt;foreach item=&quot;item&quot; index=&quot;index&quot; collection=&quot;list&quot;</span></span>
<span class="line"><span>      open=&quot;(&quot; separator=&quot;,&quot; close=&quot;)&quot;&gt;</span></span>
<span class="line"><span>        #{item}</span></span>
<span class="line"><span>  &lt;/foreach&gt;</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><p>foreach 元素的功能非常强大，它允许你指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量。它也允许你指定开头与结尾的字符串以及集合项迭代之间的分隔符。这个元素也不会错误地添加多余的分隔符，看它多智能！</p><blockquote><p>提示 你可以将任何可迭代对象（如 List、Set 等）、Map 对象或者数组对象作为集合参数传递给 foreach。当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。</p></blockquote><p>至此，我们已经完成了与 XML 配置及映射文件相关的讨论。下一章将详细探讨 Java API，以便你能充分利用已经创建的映射配置。</p><h3 id="script" tabindex="-1">script <a class="header-anchor" href="#script" aria-label="Permalink to &quot;script&quot;">​</a></h3><p>要在带注解的映射器接口类中使用动态 SQL，可以使用 script 元素。比如:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    @Update({&quot;&lt;script&gt;&quot;,</span></span>
<span class="line"><span>      &quot;update Author&quot;,</span></span>
<span class="line"><span>      &quot;  &lt;set&gt;&quot;,</span></span>
<span class="line"><span>      &quot;    &lt;if test=&#39;username != null&#39;&gt;username=#{username},&lt;/if&gt;&quot;,</span></span>
<span class="line"><span>      &quot;    &lt;if test=&#39;password != null&#39;&gt;password=#{password},&lt;/if&gt;&quot;,</span></span>
<span class="line"><span>      &quot;    &lt;if test=&#39;email != null&#39;&gt;email=#{email},&lt;/if&gt;&quot;,</span></span>
<span class="line"><span>      &quot;    &lt;if test=&#39;bio != null&#39;&gt;bio=#{bio}&lt;/if&gt;&quot;,</span></span>
<span class="line"><span>      &quot;  &lt;/set&gt;&quot;,</span></span>
<span class="line"><span>      &quot;where id=#{id}&quot;,</span></span>
<span class="line"><span>      &quot;&lt;/script&gt;&quot;})</span></span>
<span class="line"><span>    void updateAuthorValues(Author author);</span></span></code></pre></div><h3 id="bind" tabindex="-1">bind <a class="header-anchor" href="#bind" aria-label="Permalink to &quot;bind&quot;">​</a></h3><p>bind 元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;selectBlogsLike&quot; resultType=&quot;Blog&quot;&gt;</span></span>
<span class="line"><span>  &lt;bind name=&quot;pattern&quot; value=&quot;&#39;%&#39; + _parameter.getTitle() + &#39;%&#39;&quot; /&gt;</span></span>
<span class="line"><span>  SELECT * FROM BLOG</span></span>
<span class="line"><span>  WHERE title LIKE #{pattern}</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><h3 id="多数据库支持" tabindex="-1">多数据库支持 <a class="header-anchor" href="#多数据库支持" aria-label="Permalink to &quot;多数据库支持&quot;">​</a></h3><p>如果配置了 databaseIdProvider，你就可以在动态代码中使用名为 “_databaseId” 的变量来为不同的数据库构建特定的语句。比如下面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;insert id=&quot;insert&quot;&gt;</span></span>
<span class="line"><span>  &lt;selectKey keyProperty=&quot;id&quot; resultType=&quot;int&quot; order=&quot;BEFORE&quot;&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;_databaseId == &#39;oracle&#39;&quot;&gt;</span></span>
<span class="line"><span>      select seq_users.nextval from dual</span></span>
<span class="line"><span>    &lt;/if&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;_databaseId == &#39;db2&#39;&quot;&gt;</span></span>
<span class="line"><span>      select nextval for seq_users from sysibm.sysdummy1&quot;</span></span>
<span class="line"><span>    &lt;/if&gt;</span></span>
<span class="line"><span>  &lt;/selectKey&gt;</span></span>
<span class="line"><span>  insert into users values (#{id}, #{name})</span></span>
<span class="line"><span>&lt;/insert&gt;</span></span></code></pre></div><h3 id="动态-sql-中的插入脚本语言" tabindex="-1">动态 SQL 中的插入脚本语言 <a class="header-anchor" href="#动态-sql-中的插入脚本语言" aria-label="Permalink to &quot;动态 SQL 中的插入脚本语言&quot;">​</a></h3><p>MyBatis 从 3.2 版本开始支持插入脚本语言，这允许你插入一种语言驱动，并基于这种语言来编写动态 SQL 查询语句。</p><p>可以通过实现以下接口来插入一种语言：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface LanguageDriver {</span></span>
<span class="line"><span>  ParameterHandler createParameterHandler(MappedStatement mappedStatement, Object parameterObject, BoundSql boundSql);</span></span>
<span class="line"><span>  SqlSource createSqlSource(Configuration configuration, XNode script, Class&lt;?&gt; parameterType);</span></span>
<span class="line"><span>  SqlSource createSqlSource(Configuration configuration, String script, Class&lt;?&gt; parameterType);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实现自定义语言驱动后，你就可以在 mybatis-config.xml 文件中将它设置为默认语言：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;typeAliases&gt;</span></span>
<span class="line"><span>  &lt;typeAlias type=&quot;org.sample.MyLanguageDriver&quot; alias=&quot;myLanguage&quot;/&gt;</span></span>
<span class="line"><span>&lt;/typeAliases&gt;</span></span>
<span class="line"><span>&lt;settings&gt;</span></span>
<span class="line"><span>  &lt;setting name=&quot;defaultScriptingLanguage&quot; value=&quot;myLanguage&quot;/&gt;</span></span>
<span class="line"><span>&lt;/settings&gt;</span></span></code></pre></div><p>或者，你也可以使用 lang 属性为特定的语句指定语言：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select id=&quot;selectBlog&quot; lang=&quot;myLanguage&quot;&gt;</span></span>
<span class="line"><span>  SELECT * FROM BLOG</span></span>
<span class="line"><span>&lt;/select&gt;</span></span></code></pre></div><p>或者，在你的 mapper 接口上添加 @Lang 注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Mapper {</span></span>
<span class="line"><span>  @Lang(MyLanguageDriver.class)</span></span>
<span class="line"><span>  @Select(&quot;SELECT * FROM BLOG&quot;)</span></span>
<span class="line"><span>  List&lt;Blog&gt; selectBlog();</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>提示 可以使用 Apache Velocity 作为动态语言，更多细节请参考 MyBatis-Velocity 项目。</p></blockquote><p>你前面看到的所有 xml 标签都由默认 MyBatis 语言提供，而它由语言驱动 org.apache.ibatis.scripting.xmltags.XmlLanguageDriver（别名为 xml）所提供。</p><h2 id="动态sql解析原理" tabindex="-1">动态SQL解析原理 <a class="header-anchor" href="#动态sql解析原理" aria-label="Permalink to &quot;动态SQL解析原理&quot;">​</a></h2><p>我们在使用mybatis的时候，会在xml中编写sql语句。比如这段动态sql代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;update id=&quot;update&quot; parameterType=&quot;org.format.dynamicproxy.mybatis.bean.User&quot;&gt;</span></span>
<span class="line"><span>    UPDATE users</span></span>
<span class="line"><span>    &lt;trim prefix=&quot;SET&quot; prefixOverrides=&quot;,&quot;&gt;</span></span>
<span class="line"><span>        &lt;if test=&quot;name != null and name != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>            name = #{name}</span></span>
<span class="line"><span>        &lt;/if&gt;</span></span>
<span class="line"><span>        &lt;if test=&quot;age != null and age != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>            , age = #{age}</span></span>
<span class="line"><span>        &lt;/if&gt;</span></span>
<span class="line"><span>        &lt;if test=&quot;birthday != null and birthday != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>            , birthday = #{birthday}</span></span>
<span class="line"><span>        &lt;/if&gt;</span></span>
<span class="line"><span>    &lt;/trim&gt;</span></span>
<span class="line"><span>    where id = \${id}</span></span>
<span class="line"><span>&lt;/update&gt;</span></span></code></pre></div><p>mybatis底层是如何构造这段sql的？下面带着这个疑问，我们一步一步分析。</p><h3 id="关于动态sql的接口和类" tabindex="-1">关于动态SQL的接口和类 <a class="header-anchor" href="#关于动态sql的接口和类" aria-label="Permalink to &quot;关于动态SQL的接口和类&quot;">​</a></h3><p>SqlNode接口，简单理解就是xml中的每个标签，比如上述sql的update,trim,if标签：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface SqlNode {</span></span>
<span class="line"><span>    boolean apply(DynamicContext context);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+t+`" alt="error.图片加载失败"></p><p>SqlSource Sql源接口，代表从xml文件或注解映射的sql内容，主要就是用于创建BoundSql，有实现类DynamicSqlSource(动态Sql源)，StaticSqlSource(静态Sql源)等：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface SqlSource {</span></span>
<span class="line"><span>    BoundSql getBoundSql(Object parameterObject);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><img src="`+l+'" alt="error.图片加载失败"></p><p>BoundSql类，封装mybatis最终产生sql的类，包括sql语句，参数，参数源数据等参数：</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>XNode，一个Dom API中的Node接口的扩展类：</p><p><img src="'+o+'" alt="error.图片加载失败"></p><p>BaseBuilder接口及其实现类(属性，方法省略了，大家有兴趣的自己看),这些Builder的作用就是用于构造sql：</p><p><img src="'+c+'" alt="error.图片加载失败"></p><p>下面我们简单分析下其中4个Builder：</p><ul><li><strong>XMLConfigBuilder</strong>：解析mybatis中configLocation属性中的全局xml文件，内部会使用XMLMapperBuilder解析各个xml文件。</li><li><strong>XMLMapperBuilder</strong>：遍历mybatis中mapperLocations属性中的xml文件中每个节点的Builder，比如user.xml，内部会使用XMLStatementBuilder处理xml中的每个节点。</li><li><strong>XMLStatementBuilder</strong>：解析xml文件中各个节点，比如select,insert,update,delete节点，内部会使用XMLScriptBuilder处理节点的sql部分，遍历产生的数据会丢到Configuration的mappedStatements中。</li><li><strong>XMLScriptBuilder</strong>：解析xml中各个节点sql部分的Builder。</li></ul><p>LanguageDriver接口及其实现类(属性，方法省略了，大家有兴趣的自己看)，该接口主要的作用就是构造sql:</p><p><img src="'+r+`" alt="error.图片加载失败"></p><p>简单分析下XMLLanguageDriver(处理xml中的sql，RawLanguageDriver处理静态sql)：XMLLanguageDriver内部会使用XMLScriptBuilder解析xml中的sql部分。</p><h3 id="源码分析走起" tabindex="-1">源码分析走起 <a class="header-anchor" href="#源码分析走起" aria-label="Permalink to &quot;源码分析走起&quot;">​</a></h3><p>Spring与Mybatis整合的时候需要配置SqlSessionFactoryBean，该配置会加入数据源和mybatis xml配置文件路径等信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;bean id=&quot;sqlSessionFactory&quot; class=&quot;org.mybatis.spring.SqlSessionFactoryBean&quot;&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;dataSource&quot; ref=&quot;dataSource&quot;/&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;configLocation&quot; value=&quot;classpath:mybatisConfig.xml&quot;/&gt;</span></span>
<span class="line"><span>    &lt;property name=&quot;mapperLocations&quot; value=&quot;classpath*:org/format/dao/*.xml&quot;/&gt;</span></span>
<span class="line"><span>&lt;/bean&gt;</span></span></code></pre></div><p>我们就分析这一段配置背后的细节：</p><p>SqlSessionFactoryBean实现了Spring的InitializingBean接口，InitializingBean接口的afterPropertiesSet方法中会调用buildSqlSessionFactory方法 该方法内部会使用XMLConfigBuilder解析属性configLocation中配置的路径，还会使用XMLMapperBuilder属性解析mapperLocations属性中的各个xml文件。部分源码如下：</p><p><img src="`+d+'" alt="error.图片加载失败"></p><p>由于XMLConfigBuilder内部也是使用XMLMapperBuilder，我们就看看XMLMapperBuilder的解析细节：</p><p><img src="'+u+'" alt="error.图片加载失败"></p><p><img src="'+g+'" alt="error.图片加载失败"></p><p>我们关注一下，增删改查节点的解析：</p><p><img src="'+m+'" alt="error.图片加载失败"></p><p>XMLStatementBuilder的解析：</p><p><img src="'+h+'" alt="error.图片加载失败"></p><p>默认会使用XMLLanguageDriver创建SqlSource（Configuration构造函数中设置）。</p><p>XMLLanguageDriver创建SqlSource：</p><p><img src="'+q+'" alt="error.图片加载失败"></p><p>XMLScriptBuilder解析sql：</p><p><img src="'+b+`" alt="error.图片加载失败"></p><p>得到SqlSource之后，会放到Configuration中，有了SqlSource，就能拿BoundSql了，BoundSql可以得到最终的sql。</p><h3 id="实例分析" tabindex="-1">实例分析 <a class="header-anchor" href="#实例分析" aria-label="Permalink to &quot;实例分析&quot;">​</a></h3><p>以下面的xml解析大概说下parseDynamicTags的解析过程：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;update id=&quot;update&quot; parameterType=&quot;org.format.dynamicproxy.mybatis.bean.User&quot;&gt;</span></span>
<span class="line"><span>    UPDATE users</span></span>
<span class="line"><span>    &lt;trim prefix=&quot;SET&quot; prefixOverrides=&quot;,&quot;&gt;</span></span>
<span class="line"><span>        &lt;if test=&quot;name != null and name != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>            name = #{name}</span></span>
<span class="line"><span>        &lt;/if&gt;</span></span>
<span class="line"><span>        &lt;if test=&quot;age != null and age != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>            , age = #{age}</span></span>
<span class="line"><span>        &lt;/if&gt;</span></span>
<span class="line"><span>        &lt;if test=&quot;birthday != null and birthday != &#39;&#39;&quot;&gt;</span></span>
<span class="line"><span>            , birthday = #{birthday}</span></span>
<span class="line"><span>        &lt;/if&gt;</span></span>
<span class="line"><span>    &lt;/trim&gt;</span></span>
<span class="line"><span>    where id = \${id}</span></span>
<span class="line"><span>&lt;/update&gt;</span></span></code></pre></div><p>parseDynamicTags方法的返回值是一个List，也就是一个Sql节点集合。SqlNode本文一开始已经介绍，分析完解析过程之后会说一下各个SqlNode类型的作用。</p><p>首先根据update节点(Node)得到所有的子节点，分别是3个子节点：</p><ul><li>文本节点 \\n UPDATE users</li><li>trim子节点 ...</li><li>文本节点 \\n where id = #</li></ul><p>遍历各个子节点：</p><ul><li>如果节点类型是文本或者CDATA，构造一个TextSqlNode或StaticTextSqlNode；</li><li>如果节点类型是元素，说明该update节点是个动态sql，然后会使用NodeHandler处理各个类型的子节点。这里的NodeHandler是XMLScriptBuilder的一个内部接口，其实现类包括TrimHandler、WhereHandler、SetHandler、IfHandler、ChooseHandler等。看类名也就明白了这个Handler的作用，比如我们分析的trim节点，对应的是TrimHandler；if节点，对应的是IfHandler...这里子节点trim被TrimHandler处理，TrimHandler内部也使用parseDynamicTags方法解析节点。</li></ul><p>遇到子节点是元素的话，重复以上步骤：</p><p>trim子节点内部有7个子节点，分别是文本节点、if节点、是文本节点、if节点、是文本节点、if节点、文本节点。文本节点跟之前一样处理，if节点使用IfHandler处理。遍历步骤如上所示，下面我们看下几个Handler的实现细节。</p><p>IfHandler处理方法也是使用parseDynamicTags方法，然后加上if标签必要的属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private class IfHandler implements NodeHandler {</span></span>
<span class="line"><span>    public void handleNode(XNode nodeToHandle, List&lt;SqlNode&gt; targetContents) {</span></span>
<span class="line"><span>      List&lt;SqlNode&gt; contents = parseDynamicTags(nodeToHandle);</span></span>
<span class="line"><span>      MixedSqlNode mixedSqlNode = new MixedSqlNode(contents);</span></span>
<span class="line"><span>      String test = nodeToHandle.getStringAttribute(&quot;test&quot;);</span></span>
<span class="line"><span>      IfSqlNode ifSqlNode = new IfSqlNode(mixedSqlNode, test);</span></span>
<span class="line"><span>      targetContents.add(ifSqlNode);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>TrimHandler处理方法也是使用parseDynamicTags方法，然后加上trim标签必要的属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private class TrimHandler implements NodeHandler {</span></span>
<span class="line"><span>    public void handleNode(XNode nodeToHandle, List&lt;SqlNode&gt; targetContents) {</span></span>
<span class="line"><span>      List&lt;SqlNode&gt; contents = parseDynamicTags(nodeToHandle);</span></span>
<span class="line"><span>      MixedSqlNode mixedSqlNode = new MixedSqlNode(contents);</span></span>
<span class="line"><span>      String prefix = nodeToHandle.getStringAttribute(&quot;prefix&quot;);</span></span>
<span class="line"><span>      String prefixOverrides = nodeToHandle.getStringAttribute(&quot;prefixOverrides&quot;);</span></span>
<span class="line"><span>      String suffix = nodeToHandle.getStringAttribute(&quot;suffix&quot;);</span></span>
<span class="line"><span>      String suffixOverrides = nodeToHandle.getStringAttribute(&quot;suffixOverrides&quot;);</span></span>
<span class="line"><span>      TrimSqlNode trim = new TrimSqlNode(configuration, mixedSqlNode, prefix, prefixOverrides, suffix, suffixOverrides);</span></span>
<span class="line"><span>      targetContents.add(trim);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上update方法最终通过parseDynamicTags方法得到的SqlNode集合如下：</p><p><img src="`+y+'" alt="error.图片加载失败"></p><p>trim节点：</p><p><img src="'+v+'" alt="error.图片加载失败"></p><p>由于这个update方法是个动态节点，因此构造出了DynamicSqlSource。DynamicSqlSource内部就可以构造sql了:</p><p><img src="'+f+`" alt="error.图片加载失败"></p><p>DynamicSqlSource内部的SqlNode属性是一个MixedSqlNode。然后我们看看各个SqlNode实现类的apply方法。下面分析一下各个SqlNode实现类的apply方法实现：</p><p>MixedSqlNode：MixedSqlNode会遍历调用内部各个sqlNode的apply方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean apply(DynamicContext context) {</span></span>
<span class="line"><span>   for (SqlNode sqlNode : contents) {</span></span>
<span class="line"><span>     sqlNode.apply(context);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>StaticTextSqlNode：直接append sql文本。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean apply(DynamicContext context) {</span></span>
<span class="line"><span>   context.appendSql(text);</span></span>
<span class="line"><span>   return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>IfSqlNode：这里的evaluator是一个ExpressionEvaluator类型的实例，内部使用了OGNL处理表达式逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean apply(DynamicContext context) {</span></span>
<span class="line"><span>   if (evaluator.evaluateBoolean(test, context.getBindings())) {</span></span>
<span class="line"><span>     contents.apply(context);</span></span>
<span class="line"><span>     return true;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>TrimSqlNode：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean apply(DynamicContext context) {</span></span>
<span class="line"><span>    FilteredDynamicContext filteredDynamicContext = new FilteredDynamicContext(context);</span></span>
<span class="line"><span>    boolean result = contents.apply(filteredDynamicContext);</span></span>
<span class="line"><span>    filteredDynamicContext.applyAll();</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void applyAll() {</span></span>
<span class="line"><span>    sqlBuffer = new StringBuilder(sqlBuffer.toString().trim());</span></span>
<span class="line"><span>    String trimmedUppercaseSql = sqlBuffer.toString().toUpperCase(Locale.ENGLISH);</span></span>
<span class="line"><span>    if (trimmedUppercaseSql.length() &gt; 0) {</span></span>
<span class="line"><span>        applyPrefix(sqlBuffer, trimmedUppercaseSql);</span></span>
<span class="line"><span>        applySuffix(sqlBuffer, trimmedUppercaseSql);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    delegate.appendSql(sqlBuffer.toString());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void applyPrefix(StringBuilder sql, String trimmedUppercaseSql) {</span></span>
<span class="line"><span>    if (!prefixApplied) {</span></span>
<span class="line"><span>        prefixApplied = true;</span></span>
<span class="line"><span>        if (prefixesToOverride != null) {</span></span>
<span class="line"><span>            for (String toRemove : prefixesToOverride) {</span></span>
<span class="line"><span>                if (trimmedUppercaseSql.startsWith(toRemove)) {</span></span>
<span class="line"><span>                    sql.delete(0, toRemove.trim().length());</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (prefix != null) {</span></span>
<span class="line"><span>            sql.insert(0, &quot; &quot;);</span></span>
<span class="line"><span>            sql.insert(0, prefix);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>TrimSqlNode的apply方法也是调用属性contents(一般都是MixedSqlNode)的apply方法，按照实例也就是7个SqlNode，都是StaticTextSqlNode和IfSqlNode。 最后会使用FilteredDynamicContext过滤掉prefix和suffix。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,136)]))}const _=a(S,[["render",x]]);export{M as __pageData,_ as default};
