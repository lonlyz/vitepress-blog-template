import{_ as a,c as t,ai as n,o as e}from"./chunks/framework.BrYByd3F.js";const q=JSON.parse('{"title":"SpringBoot集成MySQL - MyBatis 注解方式","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-mysql-mybatis-anno.md","filePath":"spring/springboot/springboot-x-mysql-mybatis-anno.md","lastUpdated":1737706346000}'),p={name:"spring/springboot/springboot-x-mysql-mybatis-anno.md"};function l(o,s,u,i,r,c){return e(),t("div",null,s[0]||(s[0]=[n(`<h1 id="springboot集成mysql-mybatis-注解方式" tabindex="-1">SpringBoot集成MySQL - MyBatis 注解方式 <a class="header-anchor" href="#springboot集成mysql-mybatis-注解方式" aria-label="Permalink to &quot;SpringBoot集成MySQL - MyBatis 注解方式&quot;">​</a></h1><blockquote><p>上文主要介绍了Spring集成MyBatis访问MySQL，采用的是XML配置方式；我们知道除了XML配置方式，MyBatis还支持注解方式。本文主要介绍SpringBoot+MyBatis注解方式。@pdai</p></blockquote><h2 id="准备知识" tabindex="-1">准备知识 <a class="header-anchor" href="#准备知识" aria-label="Permalink to &quot;准备知识&quot;">​</a></h2><blockquote><p>MyBatis的相关知识体系。</p></blockquote><p>具体可以参考 <a href="https://pdai.tech/md/spring/springboot/springboot-x-mysql-mybatis-xml.html" target="_blank" rel="noreferrer">SpringBoot集成MySQL - MyBatis XML方式</a></p><p>在构建知识体系时：我们最重要的<strong>目标并不是如何使用注解方式</strong>，而是要理解：</p><ol><li>对于有原有xml方式改为注解方式（一定要有对比），如何写？ <ol><li>基本的CRUD怎么用注解写？</li><li>对于复杂的动态SQL如何写？</li><li>对于表关联的如何写？</li></ol></li><li>为什么xml方式依然是比注解方式使用广泛？ <ol><li>xml方式和注解方式混合使用？</li></ol></li><li>注解方式是如何工作的呢？</li></ol><h2 id="基本查改删操作" tabindex="-1">基本查改删操作 <a class="header-anchor" href="#基本查改删操作" aria-label="Permalink to &quot;基本查改删操作&quot;">​</a></h2><blockquote><p>我们从最基本的增删改操作开始，对比xml方式进行理解。</p></blockquote><h3 id="查询操作" tabindex="-1">查询操作 <a class="header-anchor" href="#查询操作" aria-label="Permalink to &quot;查询操作&quot;">​</a></h3><h4 id="results和-result注解" tabindex="-1">@Results和@Result注解 <a class="header-anchor" href="#results和-result注解" aria-label="Permalink to &quot;@Results和@Result注解&quot;">​</a></h4><blockquote><p>对于xml配置查询时定义的ResultMap, 在注解中如何定义呢？</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;resultMap type=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot; id=&quot;UserResult1&quot;&gt;</span></span>
<span class="line"><span>  &lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;userName&quot;     column=&quot;user_name&quot;    	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;password&quot;     column=&quot;password&quot;    	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;email&quot;        column=&quot;email&quot;        	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;phoneNumber&quot;  column=&quot;phone_number&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;description&quot;  column=&quot;description&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>&lt;/resultMap&gt;</span></span></code></pre></div><p>使用注解方式，用@Results注解对应</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Results(</span></span>
<span class="line"><span>        id = &quot;UserResult1&quot;,</span></span>
<span class="line"><span>        value = {</span></span>
<span class="line"><span>                @Result(id = true, property = &quot;id&quot;, column = &quot;id&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;userName&quot;, column = &quot;user_name&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;password&quot;, column = &quot;password&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;email&quot;, column = &quot;email&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;phoneNumber&quot;, column = &quot;phone_number&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;description&quot;, column = &quot;description&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;createTime&quot;, column = &quot;create_time&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;updateTime&quot;, column = &quot;update_time&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>)</span></span></code></pre></div><h4 id="select和-param注解" tabindex="-1">@Select和@Param注解 <a class="header-anchor" href="#select和-param注解" aria-label="Permalink to &quot;@Select和@Param注解&quot;">​</a></h4><blockquote><p>对于查询，用@Select注解；对于参数, 使用@Param注解</p></blockquote><p>所以根据用户ID查询用户，使用注解方式写法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Results(</span></span>
<span class="line"><span>        id = &quot;UserResult1&quot;,</span></span>
<span class="line"><span>        value = {</span></span>
<span class="line"><span>                @Result(id = true, property = &quot;id&quot;, column = &quot;id&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;userName&quot;, column = &quot;user_name&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;password&quot;, column = &quot;password&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;email&quot;, column = &quot;email&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;phoneNumber&quot;, column = &quot;phone_number&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;description&quot;, column = &quot;description&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;createTime&quot;, column = &quot;create_time&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;updateTime&quot;, column = &quot;update_time&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>@Select(&quot;select u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time from tb_user u where id = #{id}&quot;)</span></span>
<span class="line"><span>User findById1(@Param(&quot;id&quot;) Long id);</span></span></code></pre></div><h4 id="resultmap注解" tabindex="-1">@ResultMap注解 <a class="header-anchor" href="#resultmap注解" aria-label="Permalink to &quot;@ResultMap注解&quot;">​</a></h4><blockquote><p>xml配置查询时定义的ResultMap是可以复用的，那么我们上面通过@Results定义在某个方法上的，如何复用呢？</p></blockquote><p>比如查询所有用户返回用户实体@Results是和查询单个用户一致的，那么我们可以通过@ResultMap指定返回值对应关系</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ResultMap(&quot;UserResult1&quot;)</span></span>
<span class="line"><span>@Select(&quot;select u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time from tb_user u&quot;)</span></span>
<span class="line"><span>User findAll1();</span></span></code></pre></div><p>由此你可以猜到，@ResultMap定义在哪个方法上并没有什么关系，因为它会被优先通过注解解析为数据库字段与Java字段的映射关系。</p><h4 id="表关联查询" tabindex="-1">表关联查询 <a class="header-anchor" href="#表关联查询" aria-label="Permalink to &quot;表关联查询&quot;">​</a></h4><blockquote><p>用户和角色存在着一对多的关系，上面的查询只是查询了用户的基本信息，如何关联查询（查询用户同时返回角色信息）呢？</p></blockquote><p>我们看下xml配置方式是如何做到的？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;resultMap type=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot; id=&quot;UserResult&quot;&gt;</span></span>
<span class="line"><span>  &lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;userName&quot;     column=&quot;user_name&quot;    	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;password&quot;     column=&quot;password&quot;    	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;email&quot;        column=&quot;email&quot;        	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;phoneNumber&quot;  column=&quot;phone_number&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;description&quot;  column=&quot;description&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;collection property=&quot;roles&quot; ofType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.Role&quot;&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;id&quot; column=&quot;id&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;name&quot; column=&quot;name&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;roleKey&quot; column=&quot;role_key&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;description&quot; column=&quot;description&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;/collection&gt;</span></span>
<span class="line"><span>&lt;/resultMap&gt;</span></span></code></pre></div><p>使用注解方式, 可以通过@Results+@Many注解</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Results(</span></span>
<span class="line"><span>        id = &quot;UserResult&quot;,</span></span>
<span class="line"><span>        value = {</span></span>
<span class="line"><span>                @Result(id = true, property = &quot;id&quot;, column = &quot;id&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;userName&quot;, column = &quot;user_name&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;password&quot;, column = &quot;password&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;email&quot;, column = &quot;email&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;phoneNumber&quot;, column = &quot;phone_number&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;description&quot;, column = &quot;description&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;createTime&quot;, column = &quot;create_time&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;updateTime&quot;, column = &quot;update_time&quot;),</span></span>
<span class="line"><span>                @Result(property = &quot;roles&quot;, column = &quot;id&quot;, many = @Many(select = &quot;tech.pdai.springboot.mysql57.mybatis.anno.dao.IRoleDao.findRoleByUserId&quot;, fetchType = FetchType.EAGER))</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>其中findRoleByUserId是通过user表中的id查找Role, 具体方法如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Results(</span></span>
<span class="line"><span>            id = &quot;RoleResult&quot;,</span></span>
<span class="line"><span>            value = {</span></span>
<span class="line"><span>                    @Result(id = true, property = &quot;id&quot;, column = &quot;id&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;name&quot;, column = &quot;name&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;roleKey&quot;, column = &quot;role_key&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;description&quot;, column = &quot;description&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;createTime&quot;, column = &quot;create_time&quot;),</span></span>
<span class="line"><span>                    @Result(property = &quot;updateTime&quot;, column = &quot;update_time&quot;)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    @Select(&quot;select r.id, r.name, r.role_key, r.description, r.create_time, r.update_time from tb_role r, tb_user_role ur where r.id = ur.user_id and ur.user_id = #{userId}&quot;)</span></span>
<span class="line"><span>    List&lt;Role&gt; findRoleByUserId(Long userId);</span></span></code></pre></div><p>对于一对一的可以使用@One注解。</p><h3 id="插入操作" tabindex="-1">插入操作 <a class="header-anchor" href="#插入操作" aria-label="Permalink to &quot;插入操作&quot;">​</a></h3><blockquote><p>涉及插入操作的主要注解有：@Insert, @SelectKey等。</p></blockquote><h4 id="insert注解" tabindex="-1">@Insert注解 <a class="header-anchor" href="#insert注解" aria-label="Permalink to &quot;@Insert注解&quot;">​</a></h4><p>对于插入操作，在xml配置可以定义为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;insert id=&quot;save&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot; useGeneratedKeys=&quot;true&quot; keyProperty=&quot;id&quot;&gt;</span></span>
<span class="line"><span> 		insert into tb_user(</span></span>
<span class="line"><span> 			&lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;user_name,&lt;/if&gt;</span></span>
<span class="line"><span>			&lt;if test=&quot;password != null and password != &#39;&#39;&quot;&gt;password,&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;email,&lt;/if&gt;</span></span>
<span class="line"><span>			&lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;phone_number,&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;description,&lt;/if&gt;</span></span>
<span class="line"><span> 			create_time,</span></span>
<span class="line"><span>			update_time</span></span>
<span class="line"><span> 		)values(</span></span>
<span class="line"><span> 			&lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;#{userName},&lt;/if&gt;</span></span>
<span class="line"><span>			&lt;if test=&quot;password != null and password != &#39;&#39;&quot;&gt;#{password},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;#{email},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;#{phoneNumber},&lt;/if&gt;</span></span>
<span class="line"><span> 			&lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;#{description},&lt;/if&gt;</span></span>
<span class="line"><span> 			sysdate(),</span></span>
<span class="line"><span>			sysdate()</span></span>
<span class="line"><span> 		)</span></span>
<span class="line"><span>	&lt;/insert&gt;</span></span></code></pre></div><p>特别是，这里通过<code>&lt;if&gt;</code>判断条件更新的情况应该如何在注解中写呢？</p><p>可以通过@Insert + <code>&lt;script&gt;</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Insert({&quot;&lt;script&gt; &quot;, &quot;insert into tb_user(\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;userName != null and userName != &#39;&#39;\\&quot;&gt;user_name,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;password != null and password != &#39;&#39;\\&quot;&gt;password,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;email != null and email != &#39;&#39;\\&quot;&gt;email,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;phoneNumber != null and phoneNumber != &#39;&#39;\\&quot;&gt;phone_number,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;description != null and description != &#39;&#39;\\&quot;&gt;description,&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; create_time,\\n&quot; +</span></span>
<span class="line"><span>        &quot; update_time\\n&quot; +</span></span>
<span class="line"><span>        &quot; )values(\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;userName != null and userName != &#39;&#39;\\&quot;&gt;#{userName},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;password != null and password != &#39;&#39;\\&quot;&gt;#{password},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;email != null and email != &#39;&#39;\\&quot;&gt;#{email},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;phoneNumber != null and phoneNumber != &#39;&#39;\\&quot;&gt;#{phoneNumber},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;description != null and description != &#39;&#39;\\&quot;&gt;#{description},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; sysdate(),\\n&quot; +</span></span>
<span class="line"><span>        &quot; sysdate()\\n&quot; +</span></span>
<span class="line"><span>        &quot; )&quot;, &quot; &lt;/script&gt;&quot;})</span></span>
<span class="line"><span>@Options(useGeneratedKeys = true, keyProperty = &quot;id&quot;)</span></span>
<span class="line"><span>int save(User user);</span></span></code></pre></div><h4 id="返回insert后实体的主键值" tabindex="-1">返回Insert后实体的主键值 <a class="header-anchor" href="#返回insert后实体的主键值" aria-label="Permalink to &quot;返回Insert后实体的主键值&quot;">​</a></h4><blockquote><p>上述<code>@Options(useGeneratedKeys = true, keyProperty = &quot;id&quot;)</code> 表示什么意思呢？</p></blockquote><p>表示，如果数据库提供了自增列生成Key的方式（比如这里的id), 并且需要返回自增主键时，可以通过这种方式返回实体。</p><p>那么，如果id的自增不使用数据库自增主键时, 在xml中可以使用SelectKey：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;selectKey keyColumn=&quot;id&quot; resultType=&quot;long&quot; keyProperty=&quot;id&quot; order=&quot;AFTER&quot;&gt;</span></span>
<span class="line"><span>    SELECT LAST_INSERT_ID()</span></span>
<span class="line"><span>&lt;/selectKey&gt;</span></span></code></pre></div><p>对应着注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@SelectKey(statement = &quot;SELECT LAST_INSERT_ID()&quot;, keyColumn = &quot;id&quot;, keyProperty = &quot;id&quot;, resultType = Long.class, before = false)</span></span></code></pre></div><ul><li><code>before = false</code>, 相当于XML中的order=&quot;AFTRE&quot;，这是MySql数据库的配置。</li><li><code>before = true</code>, 相当于XML中的order=&quot;BEFORE&quot;，这是Oracle数据库的配置。</li></ul><p>注意事项：不同的数据库statement的值会不同，上面中的值适用于MySql数据库，使用其他类型的数据库时要注意修改。</p><h3 id="更新操作" tabindex="-1">更新操作 <a class="header-anchor" href="#更新操作" aria-label="Permalink to &quot;更新操作&quot;">​</a></h3><blockquote><p>涉及更新操作的主要注解有：@Update等。</p></blockquote><h4 id="update-注解" tabindex="-1">@Update 注解 <a class="header-anchor" href="#update-注解" aria-label="Permalink to &quot;@Update 注解&quot;">​</a></h4><p>对于xml的更新操作如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;update id=&quot;update&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot;&gt;</span></span>
<span class="line"><span>  update tb_user</span></span>
<span class="line"><span>  &lt;set&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;userName != null and userName != &#39;&#39;&quot;&gt;user_name = #{userName},&lt;/if&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;email != null and email != &#39;&#39;&quot;&gt;email = #{email},&lt;/if&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;phoneNumber != null and phoneNumber != &#39;&#39;&quot;&gt;phone_number = #{phoneNumber},&lt;/if&gt;</span></span>
<span class="line"><span>    &lt;if test=&quot;description != null and description != &#39;&#39;&quot;&gt;description = #{description},&lt;/if&gt;</span></span>
<span class="line"><span>    update_time = sysdate()</span></span>
<span class="line"><span>  &lt;/set&gt;</span></span>
<span class="line"><span>  where id = #{id}</span></span>
<span class="line"><span>&lt;/update&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;update id=&quot;updatePassword&quot; parameterType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot;&gt;</span></span>
<span class="line"><span>  update tb_user</span></span>
<span class="line"><span>  &lt;set&gt;</span></span>
<span class="line"><span>    password = #{password}, update_time = sysdate()</span></span>
<span class="line"><span>  &lt;/set&gt;</span></span>
<span class="line"><span>  where id = #{id}</span></span>
<span class="line"><span>&lt;/update&gt;</span></span></code></pre></div><p>对应的注解写法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Update({&quot;update tb_user set password = #{password}, update_time = sysdate()&quot;, &quot; where id = #{id}&quot;})</span></span>
<span class="line"><span>int updatePassword(User user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Update({&quot;&lt;script&gt; &quot;, &quot;update tb_user\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;set&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;userName != null and userName != &#39;&#39;\\&quot;&gt;user_name = #{userName},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;email != null and email != &#39;&#39;\\&quot;&gt;email = #{email},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;phoneNumber != null and phoneNumber != &#39;&#39;\\&quot;&gt;phone_number = #{phoneNumber},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;if test=\\&quot;description != null and description != &#39;&#39;\\&quot;&gt;description = #{description},&lt;/if&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; update_time = sysdate()\\n&quot; +</span></span>
<span class="line"><span>        &quot; &lt;/set&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot; where id = #{id}&quot;, &quot; &lt;/script&gt;&quot;})</span></span>
<span class="line"><span>int update(User user);</span></span></code></pre></div><h3 id="删除操作" tabindex="-1">删除操作 <a class="header-anchor" href="#删除操作" aria-label="Permalink to &quot;删除操作&quot;">​</a></h3><blockquote><p>涉及删除操作的主要注解有：@Delete等。</p></blockquote><h4 id="delete-注解" tabindex="-1">@Delete 注解 <a class="header-anchor" href="#delete-注解" aria-label="Permalink to &quot;@Delete 注解&quot;">​</a></h4><p>对于xml的删除操作如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;delete id=&quot;deleteById&quot; parameterType=&quot;Long&quot;&gt;</span></span>
<span class="line"><span>  delete from tb_user where id = #{id}</span></span>
<span class="line"><span>&lt;/delete&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;delete id=&quot;deleteByIds&quot; parameterType=&quot;Long&quot;&gt;</span></span>
<span class="line"><span>  delete from tb_user where id in</span></span>
<span class="line"><span>  &lt;foreach collection=&quot;array&quot; item=&quot;id&quot; open=&quot;(&quot; separator=&quot;,&quot; close=&quot;)&quot;&gt;</span></span>
<span class="line"><span>    #{id}</span></span>
<span class="line"><span>      &lt;/foreach&gt; </span></span>
<span class="line"><span>&lt;/delete&gt;</span></span></code></pre></div><p>对应的注解写法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Delete(&quot;delete from tb_user where id = #{id}&quot;)</span></span>
<span class="line"><span>int deleteById(Long id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Delete({&quot;&lt;script&gt; &quot;, &quot;delete from tb_user where id in\\n&quot; +</span></span>
<span class="line"><span>        &quot;&lt;foreach collection=\\&quot;array\\&quot; item=\\&quot;id\\&quot; open=\\&quot;(\\&quot; separator=\\&quot;,\\&quot; close=\\&quot;)\\&quot;&gt;\\n&quot; +</span></span>
<span class="line"><span>        &quot;#{id}\\n&quot; +</span></span>
<span class="line"><span>        &quot;&lt;/foreach&gt;&quot;, &quot; &lt;/script&gt;&quot;})</span></span>
<span class="line"><span>int deleteByIds(Long[] ids);</span></span></code></pre></div><h2 id="provider注解" tabindex="-1">Provider注解 <a class="header-anchor" href="#provider注解" aria-label="Permalink to &quot;Provider注解&quot;">​</a></h2><blockquote><p>其实你可以发现通过注解方式，对于有一些需要通过动态构建查询条件的操作是非常不方便的。MyBatis的作者们自然就想到了动态构建SQL，动态构建SQL的方式是配合@Provider注解来完成的。</p></blockquote><p>MyBatis提供了4种Provider注解，分别是@SelectProvider、@InsertProvider、@UpdateProvider和@DeleteProvider。</p><p>这里以@SelectProvider为例来根据Id查询User：</p><ol><li>定义包含自定义生成的动态SQL的类，比如UserDaoProvider</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserDaoProvider {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String findById(final Long id) {</span></span>
<span class="line"><span>        SQL sql = new SQL();</span></span>
<span class="line"><span>        sql.SELECT(&quot;u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time&quot;);</span></span>
<span class="line"><span>        sql.FROM(&quot;tb_user u&quot;);</span></span>
<span class="line"><span>        sql.WHERE(&quot;id = &quot; + id);</span></span>
<span class="line"><span>        return sql.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>通过@SelectProvider注解关联到定义的类和方法</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ResultMap(&quot;UserResult&quot;)</span></span>
<span class="line"><span>@SelectProvider(type = UserDaoProvider.class, method = &quot;findById&quot;)</span></span>
<span class="line"><span>User findById2(Long id);</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>让我们通过几个问题，进一步理解MyBatis注解方式。</p></blockquote><h3 id="其它注解" tabindex="-1">其它注解 <a class="header-anchor" href="#其它注解" aria-label="Permalink to &quot;其它注解&quot;">​</a></h3><ul><li><p><code>@CacheNamespace</code> ：为给定的命名空间 (比如类) 配置缓存。对应xml中的<code>&lt;cache&gt;</code>。</p></li><li><p><code>@CacheNamespaceRef</code> ：参照另外一个命名空间的缓存来使用。属性:value,应该是一个名空间的字 符串值(也就是类的完全限定名) 。对应xml中的<code>&lt;cacheRef&gt;</code>标签。</p></li><li><p><code>@ConstructorArgs</code> ：收集一组结果传递给一个劫夺对象的 构造方法。属性:value,是形式参数 的数组。</p></li><li><p><code>@Arg</code> ：单 独 的 构 造 方 法 参 数 , 是 ConstructorArgs 集合的一部分。属性: id,column,javaType,typeHandler。id 属性是布尔值, 来标识用于比较的属 性,和XML 元素相似。对应xml中的<code>&lt;arg&gt;</code>标签。</p></li><li><p><code>@Case</code> ：单独实例的值和它对应的映射。属性: value,type,results。Results 属性是结 果数组,因此这个注解和实际的 ResultMap 很相似,由下面的 Results 注解指定。对应xml中标签<code>&lt;case&gt;</code>。</p></li><li><p><code>@TypeDiscriminator</code> : 一组实例值被用来决定结果映射的表 现。 属性: column, javaType, jdbcType, typeHandler,cases。cases 属性就是实 例的数组。对应xml中标签<code>&lt;discriminator&gt;</code>。</p></li><li><p><code>@Flush</code>： 在MyBatis 3.3以上版本，可以通过此注解在Mapper接口中调用SqlSession#flushStatements()。</p></li></ul><h3 id="xml方式和注解方式融合" tabindex="-1">xml方式和注解方式融合 <a class="header-anchor" href="#xml方式和注解方式融合" aria-label="Permalink to &quot;xml方式和注解方式融合&quot;">​</a></h3><p>xml方式和注解方式是可以融合写的， 我们可以将复杂的SQL写在xml中</p><p>比如将resultMap定义在xml中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;resultMap type=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.User&quot; id=&quot;UserResult3&quot;&gt;</span></span>
<span class="line"><span>  &lt;id     property=&quot;id&quot;       	column=&quot;id&quot;      		/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;userName&quot;     column=&quot;user_name&quot;    	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;password&quot;     column=&quot;password&quot;    	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;email&quot;        column=&quot;email&quot;        	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;phoneNumber&quot;  column=&quot;phone_number&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;description&quot;  column=&quot;description&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;collection property=&quot;roles&quot; ofType=&quot;tech.pdai.springboot.mysql57.mybatis.xml.entity.Role&quot;&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;id&quot; column=&quot;id&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;name&quot; column=&quot;name&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;roleKey&quot; column=&quot;role_key&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;description&quot; column=&quot;description&quot;  /&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;createTime&quot;   column=&quot;create_time&quot;  	/&gt;</span></span>
<span class="line"><span>    &lt;result property=&quot;updateTime&quot;   column=&quot;update_time&quot;  	/&gt;</span></span>
<span class="line"><span>  &lt;/collection&gt;</span></span>
<span class="line"><span>&lt;/resultMap&gt;</span></span></code></pre></div><p>在方法中用@ResultMap</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ResultMap(&quot;UserResult3&quot;)</span></span>
<span class="line"><span>@Select(&quot;select u.id, u.password, u.user_name, u.email, u.phone_number, u.description, u.create_time, u.update_time from tb_user u&quot;)</span></span>
<span class="line"><span>User findAll1();</span></span></code></pre></div><h3 id="为什么纯注解方式不是最佳选择" tabindex="-1">为什么纯注解方式不是最佳选择? <a class="header-anchor" href="#为什么纯注解方式不是最佳选择" aria-label="Permalink to &quot;为什么纯注解方式不是最佳选择?&quot;">​</a></h3><blockquote><p>纯注解方式为何很少大规模呢？ 说说我的一些看法</p></blockquote><ul><li>对于复杂的SQL，特别是按照条件动态生成方式极为不便，即便有<code>&lt;script&gt;</code>， 代码的阅读体验和维护极为不佳；</li><li>对于复杂的SQL，即便有@Provider方式，这种充其量是一个半成品 <ul><li>不是所见即所得的写法，需要再定义额外的类和方法</li><li>动态构建时不便利</li><li>函数式编程成为主流，lambda方式才是未来</li><li>...</li></ul></li></ul><p>这也是mybatis-plus等工具改进的地方。</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p>（上述代码中一些实体类和配置的完整代码，请参考如下代码仓库）</p><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,90)]))}const m=a(p,[["render",l]]);export{q as __pageData,m as default};
