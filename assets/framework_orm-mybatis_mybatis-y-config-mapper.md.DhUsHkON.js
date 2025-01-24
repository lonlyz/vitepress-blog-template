import{_ as a,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"MyBatis详解 - Mapper映射文件配置","description":"","frontmatter":{},"headers":[],"relativePath":"framework/orm-mybatis/mybatis-y-config-mapper.md","filePath":"framework/orm-mybatis/mybatis-y-config-mapper.md","lastUpdated":1737706346000}'),t={name:"framework/orm-mybatis/mybatis-y-config-mapper.md"};function l(i,s,c,o,r,u){return p(),n("div",null,s[0]||(s[0]=[e(`<h1 id="mybatis详解-mapper映射文件配置" tabindex="-1">MyBatis详解 - Mapper映射文件配置 <a class="header-anchor" href="#mybatis详解-mapper映射文件配置" aria-label="Permalink to &quot;MyBatis详解 - Mapper映射文件配置&quot;">​</a></h1><blockquote><p>在mapper文件中，以mapper作为根节点，其下面可以配置的元素节点有： select, insert, update, delete, cache, cache-ref, resultMap, sql; 本文将Mapper映射文件配置进行详解。@pdai</p></blockquote><h2 id="insert-update-delete-的配置及使用" tabindex="-1">insert, update, delete 的配置及使用 <a class="header-anchor" href="#insert-update-delete-的配置及使用" aria-label="Permalink to &quot;insert, update, delete 的配置及使用&quot;">​</a></h2><p>相信，看到insert, update, delete， 我们就知道其作用了，顾名思义嘛，myabtis 作为持久层框架，必须要对CRUD啊。好啦，咱们就先来看看 insert, update, delete 怎么配置， 能配置哪些元素吧：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;   </span></span>
<span class="line"><span>&lt;!DOCTYPE mapper   </span></span>
<span class="line"><span>PUBLIC &quot;-//ibatis.apache.org//DTD Mapper 3.0//EN&quot;  </span></span>
<span class="line"><span>&quot;http://ibatis.apache.org/dtd/ibatis-3-mapper.dtd&quot;&gt; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;!-- mapper 为根元素节点， 一个namespace对应一个dao --&gt;</span></span>
<span class="line"><span>&lt;!-- </span></span>
<span class="line"><span>Mapper元素只有一个属性namespace，它有两个作用：\`一是用于区分不同的mapper\`（在不同的mapper文件里，子元素的id可以相同，mybatis通过namespace和子元素的id联合区分），\`二是与接口关联\`（应用程序通过接口访问mybatis时，mybatis通过接口的完整名称查找对应的mapper配置，因此namespace的命名务必小心一定要某接口同名）。</span></span>
<span class="line"><span>--&gt;</span></span>
<span class="line"><span>&lt;mapper namespace=&quot;com.dy.dao.UserDao&quot;&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;!-- </span></span>
<span class="line"><span>    cache- 配置本定命名空间的缓存。</span></span>
<span class="line"><span>        type- cache实现类，默认为PERPETUAL，可以使用自定义的cache实现类（别名或完整类名皆可）</span></span>
<span class="line"><span>        eviction- 回收算法，默认为LRU，可选的算法有：</span></span>
<span class="line"><span>            LRU– 最近最少使用的：移除最长时间不被使用的对象。</span></span>
<span class="line"><span>            FIFO– 先进先出：按对象进入缓存的顺序来移除它们。</span></span>
<span class="line"><span>            SOFT– 软引用：移除基于垃圾回收器状态和软引用规则的对象。</span></span>
<span class="line"><span>            WEAK– 弱引用：更积极地移除基于垃圾收集器状态和弱引用规则的对象。</span></span>
<span class="line"><span>        flushInterval- 刷新间隔，默认为1个小时，单位毫秒</span></span>
<span class="line"><span>        size- 缓存大小，默认大小1024，单位为引用数</span></span>
<span class="line"><span>        readOnly- 只读</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>    &lt;cache type=&quot;PERPETUAL&quot; eviction=&quot;LRU&quot; flushInterval=&quot;60000&quot;  </span></span>
<span class="line"><span>        size=&quot;512&quot; readOnly=&quot;true&quot; /&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;!-- </span></span>
<span class="line"><span>    cache-ref–从其他命名空间引用缓存配置。</span></span>
<span class="line"><span>        如果你不想定义自己的cache，可以使用cache-ref引用别的cache。因为每个cache都以namespace为id，所以cache-ref只需要配置一个namespace属性就可以了。需要注意的是，如果cache-ref和cache都配置了，以cache为准。</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>    &lt;cache-ref namespace=&quot;com.someone.application.data.SomeMapper&quot;/&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;insert</span></span>
<span class="line"><span>      &lt;!-- 1. id （必须配置）</span></span>
<span class="line"><span>        id是命名空间中的唯一标识符，可被用来代表这条语句。 </span></span>
<span class="line"><span>        一个命名空间（namespace） 对应一个dao接口, </span></span>
<span class="line"><span>        这个id也应该对应dao里面的某个方法（相当于方法的实现），因此id 应该与方法名一致 --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      id=&quot;insertUser&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 2. parameterType （可选配置, 默认为mybatis自动选择处理）</span></span>
<span class="line"><span>        将要传入语句的参数的完全限定类名或别名， 如果不配置，mybatis会通过ParameterHandler 根据参数类型默认选择合适的typeHandler进行处理</span></span>
<span class="line"><span>        parameterType 主要指定参数类型，可以是int, short, long, string等类型，也可以是复杂类型（如对象） --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      parameterType=&quot;com.demo.User&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 3. flushCache （可选配置，默认配置为true）</span></span>
<span class="line"><span>        将其设置为 true，任何时候只要语句被调用，都会导致本地缓存和二级缓存都会被清空，默认值：true（对应插入、更新和删除语句） --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      flushCache=&quot;true&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 4. statementType （可选配置，默认配置为PREPARED）</span></span>
<span class="line"><span>        STATEMENT，PREPARED 或 CALLABLE 的一个。这会让 MyBatis 分别使用 Statement，PreparedStatement 或 CallableStatement，默认值：PREPARED。 --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      statementType=&quot;PREPARED&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 5. keyProperty (可选配置， 默认为unset)</span></span>
<span class="line"><span>        （仅对 insert 和 update 有用）唯一标记一个属性，MyBatis 会通过 getGeneratedKeys 的返回值或者通过 insert 语句的 selectKey 子元素设置它的键值，默认：unset。如果希望得到多个生成的列，也可以是逗号分隔的属性名称列表。 --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      keyProperty=&quot;&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 6. keyColumn     (可选配置)</span></span>
<span class="line"><span>        （仅对 insert 和 update 有用）通过生成的键值设置表中的列名，这个设置仅在某些数据库（像 PostgreSQL）是必须的，当主键列不是表中的第一列的时候需要设置。如果希望得到多个生成的列，也可以是逗号分隔的属性名称列表。 --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      keyColumn=&quot;&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 7. useGeneratedKeys (可选配置， 默认为false)</span></span>
<span class="line"><span>        （仅对 insert 和 update 有用）这会令 MyBatis 使用 JDBC 的 getGeneratedKeys 方法来取出由数据库内部生成的主键（比如：像 MySQL 和 SQL Server 这样的关系数据库管理系统的自动递增字段），默认值：false。  --&gt;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      useGeneratedKeys=&quot;false&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      &lt;!-- 8. timeout  (可选配置， 默认为unset, 依赖驱动)</span></span>
<span class="line"><span>        这个设置是在抛出异常之前，驱动程序等待数据库返回请求结果的秒数。默认值为 unset（依赖驱动）。 --&gt;</span></span>
<span class="line"><span>      timeout=&quot;20&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;update</span></span>
<span class="line"><span>      id=&quot;updateUser&quot;</span></span>
<span class="line"><span>      parameterType=&quot;com.demo.User&quot;</span></span>
<span class="line"><span>      flushCache=&quot;true&quot;</span></span>
<span class="line"><span>      statementType=&quot;PREPARED&quot;</span></span>
<span class="line"><span>      timeout=&quot;20&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;delete</span></span>
<span class="line"><span>      id=&quot;deleteUser&quot;</span></span>
<span class="line"><span>      parameterType=&quot;com.demo.User&quot;</span></span>
<span class="line"><span>      flushCache=&quot;true&quot;</span></span>
<span class="line"><span>      statementType=&quot;PREPARED&quot;</span></span>
<span class="line"><span>      timeout=&quot;20&quot;&gt;</span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><p>以上就是一个模板配置， 哪些是必要配置，哪些是根据自己实际需求，看一眼就知道了。看一个真实的UserDao-Mapper.xml配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;   </span></span>
<span class="line"><span>&lt;!DOCTYPE mapper   </span></span>
<span class="line"><span>PUBLIC &quot;-//ibatis.apache.org//DTD Mapper 3.0//EN&quot;  </span></span>
<span class="line"><span>&quot;http://ibatis.apache.org/dtd/ibatis-3-mapper.dtd&quot;&gt; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;mapper namespace=&quot;com.dy.dao.UserDao&quot;&gt;</span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>   &lt;!-- 对应userDao中的insertUser方法，  --&gt;</span></span>
<span class="line"><span>   &lt;insert id=&quot;insertUser&quot; parameterType=&quot;com.dy.entity.User&quot;&gt;</span></span>
<span class="line"><span>           insert into user(id, name, password, age, deleteFlag) </span></span>
<span class="line"><span>               values(#{id}, #{name}, #{password}, #{age}, #{deleteFlag})</span></span>
<span class="line"><span>   &lt;/insert&gt;</span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>   &lt;!-- 对应userDao中的updateUser方法 --&gt;</span></span>
<span class="line"><span>   &lt;update id=&quot;updateUser&quot; parameterType=&quot;com.dy.entity.User&quot;&gt;</span></span>
<span class="line"><span>           update user set name = #{name}, password = #{password}, age = #{age}, deleteFlag = #{deleteFlag}</span></span>
<span class="line"><span>               where id = #{id};</span></span>
<span class="line"><span>   &lt;/update&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>   &lt;!-- 对应userDao中的deleteUser 方法 --&gt; </span></span>
<span class="line"><span>   &lt;delete id=&quot;deleteUser&quot; parameterType=&quot;com.dy.entity.User&quot;&gt;</span></span>
<span class="line"><span>           delete from user where id = #{id};</span></span>
<span class="line"><span>   &lt;/delete&gt;</span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><p>这样，一个简单的映射关系就建立了。仔细观察上面parameterType, &quot;com.dy.entity.User&quot;，包名要是再长点呢，每次都这样写，写得蛋疼了。别忘了之前讲的 typeAliases（别名）， 那么这个地方，用上别名，岂不是技能跟蛋疼的长长的包名说拜拜了。好啦，咱们配上别名，在哪儿配？ 当然是在mybatis 的全局配置文件（我这儿名字是mybatis-conf.xml）， 不要认为是在mapper的配置文件里面配置哈。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;typeAliases&gt;</span></span>
<span class="line"><span>     &lt;!--</span></span>
<span class="line"><span>        通过package, 可以直接指定package的名字， mybatis会自动扫描你指定包下面的javabean,</span></span>
<span class="line"><span>        并且默认设置一个别名，默认的名字为： javabean 的首字母小写的非限定类名来作为它的别名。</span></span>
<span class="line"><span>        也可在javabean 加上注解@Alias 来自定义别名， 例如： @Alias(user) </span></span>
<span class="line"><span>        &lt;package name=&quot;com.dy.entity&quot;/&gt;</span></span>
<span class="line"><span>     --&gt;</span></span>
<span class="line"><span>     &lt;typeAlias alias=&quot;user&quot; type=&quot;com.dy.entity.User&quot;/&gt;</span></span>
<span class="line"><span>&lt;/typeAliases&gt;</span></span></code></pre></div><p>这样，一个别名就取好了，咱们可以把上面的 com.dy.entity.User 都直接改为user 了。 这多方便呀！</p><p>我这儿数据库用的是mysql, 我把user表的主键id 设置了自动增长， 以上代码运行正常， 那么问题来了（当然，我不是要问学挖掘机哪家强），我要是换成oracle数据库怎么办？ oracle 可是不支持id自增长啊？ 怎么办？请看下面：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   &lt;!-- 对应userDao中的insertUser方法，  --&gt;</span></span>
<span class="line"><span>   &lt;insert id=&quot;insertUser&quot; parameterType=&quot;com.dy.entity.User&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- oracle等不支持id自增长的，可根据其id生成策略，先获取id --&gt;  </span></span>
<span class="line"><span>        &lt;selectKey resultType=&quot;int&quot; order=&quot;BEFORE&quot; keyProperty=&quot;id&quot;&gt;</span></span>
<span class="line"><span>              select seq_user_id.nextval as id from dual</span></span>
<span class="line"><span>        &lt;/selectKey&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>           </span></span>
<span class="line"><span>        insert into user(id, name, password, age, deleteFlag) </span></span>
<span class="line"><span>        values(#{id}, #{name}, #{password}, #{age}, #{deleteFlag})</span></span>
<span class="line"><span>   &lt;/insert&gt;</span></span></code></pre></div><p>同理，如果我们在使用mysql的时候，想在数据插入后返回插入的id, 我们也可以使用 selectKey 这个元素：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   &lt;!-- 对应userDao中的insertUser方法，  --&gt;</span></span>
<span class="line"><span>   &lt;insert id=&quot;insertUser&quot; parameterType=&quot;com.dy.entity.User&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- oracle等不支持id自增长的，可根据其id生成策略，先获取id </span></span>
<span class="line"><span>        &lt;selectKey resultType=&quot;int&quot; order=&quot;BEFORE&quot; keyProperty=&quot;id&quot;&gt;</span></span>
<span class="line"><span>              select seq_user_id.nextval as id from dual</span></span>
<span class="line"><span>        &lt;/selectKey&gt;</span></span>
<span class="line"><span>        --&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- mysql插入数据后，获取id，该方法LAST_INSERT_ID()与数据库连接绑定，同属统一会话级别。--&gt;</span></span>
<span class="line"><span>        &lt;selectKey keyProperty=&quot;id&quot; resultType=&quot;int&quot; order=&quot;AFTER&quot; &gt;</span></span>
<span class="line"><span>               SELECT LAST_INSERT_ID() as id</span></span>
<span class="line"><span>        &lt;/selectKey&gt;</span></span>
<span class="line"><span>          </span></span>
<span class="line"><span>        insert into user(id, name, password, age, deleteFlag) </span></span>
<span class="line"><span>        values(#{id}, #{name}, #{password}, #{age}, #{deleteFlag})</span></span>
<span class="line"><span>   &lt;/insert&gt;</span></span></code></pre></div><p><strong>这儿，我们就简单提一下<code>&lt;selectKey&gt;</code>这个元素节点吧</strong></p><p>selectKey给了你一个简单的行为在你的数据库中来处理自动生成的主键，而不需要使你的Java代码变得复杂。在上面的示例中，selectKey元素将会首先运行，userid会被设置，然后插入语句会被调用。另外，selectKey节点生成的KeyGenerator优先级高于statement节点的useGeneratedKeys属性生成的KeyGenerator对象，也就是说配置了SelectKey子节点就不需要再配置useGeneratedKeys属性了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;selectKey</span></span>
<span class="line"><span>        &lt;!-- selectKey 语句结果应该被设置的目标属性。如果希望得到多个生成的列，也可以是逗号分隔的属性名称列表。 --&gt;</span></span>
<span class="line"><span>        keyProperty=&quot;id&quot;</span></span>
<span class="line"><span>        &lt;!-- 结果的类型。MyBatis 通常可以推算出来，但是为了更加确定写上也不会有什么问题。MyBatis 允许任何简单类型用作主键的类型，包括字符串。如果希望作用于多个生成的列，则可以使用一个包含期望属性的 Object 或一个 Map。 --&gt;</span></span>
<span class="line"><span>        resultType=&quot;int&quot;</span></span>
<span class="line"><span>        &lt;!-- 这可以被设置为 BEFORE 或 AFTER。如果设置为 BEFORE，那么它会首先选择主键，设置 keyProperty 然后执行插入语句。如果设置为 AFTER，那么先执行插入语句，然后是 selectKey 元素 - 这和像 Oracle 的数据库相似，在插入语句内部可能有嵌入索引调用。 --&gt;</span></span>
<span class="line"><span>        order=&quot;BEFORE&quot;</span></span>
<span class="line"><span>        &lt;!-- 与前面相同，MyBatis 支持 STATEMENT，PREPARED 和 CALLABLE 语句的映射类型，分别代表 PreparedStatement 和 CallableStatement 类型。 --&gt;</span></span>
<span class="line"><span>        statementType=&quot;PREPARED&quot;&gt;</span></span></code></pre></div><h2 id="select、resultmap的配置及使用" tabindex="-1">select、resultMap的配置及使用 <a class="header-anchor" href="#select、resultmap的配置及使用" aria-label="Permalink to &quot;select、resultMap的配置及使用&quot;">​</a></h2><p>select无疑是我们最常用，也是最复杂的，mybatis通过resultMap能帮助我们很好地进行高级映射。下面就开始看看select 以及 resultMap的用法：</p><p>先看select的配置吧：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;select</span></span>
<span class="line"><span>     &lt;!--  1. id （必须配置）</span></span>
<span class="line"><span>        id是命名空间中的唯一标识符，可被用来代表这条语句。 </span></span>
<span class="line"><span>        一个命名空间（namespace） 对应一个dao接口, </span></span>
<span class="line"><span>        这个id也应该对应dao里面的某个方法（相当于方法的实现），因此id 应该与方法名一致</span></span>
<span class="line"><span>     --&gt;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     id=&quot;selectPerson&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 2. parameterType （可选配置, 默认为mybatis自动选择处理）</span></span>
<span class="line"><span>        将要传入语句的参数的完全限定类名或别名， 如果不配置，mybatis会通过ParameterHandler 根据参数类型默认选择合适的typeHandler进行处理</span></span>
<span class="line"><span>        parameterType 主要指定参数类型，可以是int, short, long, string等类型，也可以是复杂类型（如对象） --&gt;</span></span>
<span class="line"><span>     parameterType=&quot;int&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 3. resultType (resultType 与 resultMap 二选一配置)</span></span>
<span class="line"><span>         resultType用以指定返回类型，指定的类型可以是基本类型，可以是java容器，也可以是javabean --&gt;</span></span>
<span class="line"><span>     resultType=&quot;hashmap&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 4. resultMap (resultType 与 resultMap 二选一配置)</span></span>
<span class="line"><span>         resultMap用于引用我们通过 resultMap标签定义的映射类型，这也是mybatis组件高级复杂映射的关键 --&gt;</span></span>
<span class="line"><span>     resultMap=&quot;personResultMap&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 5. flushCache (可选配置)</span></span>
<span class="line"><span>         将其设置为 true，任何时候只要语句被调用，都会导致本地缓存和二级缓存都会被清空，默认值：false --&gt;</span></span>
<span class="line"><span>     flushCache=&quot;false&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 6. useCache (可选配置)</span></span>
<span class="line"><span>         将其设置为 true，将会导致本条语句的结果被二级缓存，默认值：对 select 元素为 true --&gt;</span></span>
<span class="line"><span>     useCache=&quot;true&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 7. timeout (可选配置) </span></span>
<span class="line"><span>         这个设置是在抛出异常之前，驱动程序等待数据库返回请求结果的秒数。默认值为 unset（依赖驱动）--&gt;</span></span>
<span class="line"><span>     timeout=&quot;10000&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 8. fetchSize (可选配置) </span></span>
<span class="line"><span>         这是尝试影响驱动程序每次批量返回的结果行数和这个设置值相等。默认值为 unset（依赖驱动)--&gt;</span></span>
<span class="line"><span>     fetchSize=&quot;256&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 9. statementType (可选配置) </span></span>
<span class="line"><span>         STATEMENT，PREPARED 或 CALLABLE 的一个。这会让 MyBatis 分别使用 Statement，PreparedStatement 或 CallableStatement，默认值：PREPARED--&gt;</span></span>
<span class="line"><span>     statementType=&quot;PREPARED&quot;</span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>     &lt;!-- 10. resultSetType (可选配置) </span></span>
<span class="line"><span>         FORWARD_ONLY，SCROLL_SENSITIVE 或 SCROLL_INSENSITIVE 中的一个，默认值为 unset （依赖驱动）--&gt;</span></span>
<span class="line"><span>     resultSetType=&quot;FORWARD_ONLY&quot;&gt;</span></span></code></pre></div><p>配置看起来总是这么多，不过实际常用的配置也就那么几个， 根据自己的需要吧，上面都已注明是否必须配置。看一个CourseDao-Mapper.xml配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;mapper namespace=&quot;com.dy.dao.CourseDao&quot;&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;!-- </span></span>
<span class="line"><span>         1.此处直接将resultType 设置为course, 一看就知道我设置了别名吧，如果没有设置别名，那么resultType = com.dy.entity.Course。</span></span>
<span class="line"><span>         2.可能细心的你会发现：Course.java中的属性名与数据库字段名不一致，下面，我就在sql语句中用了as, 使之匹配，当然方法不止一种，在学习了resultMap之后，你能看到一种更直观优雅的方式去将javabean中的属性与数据库字段名保持一致</span></span>
<span class="line"><span>         3.findCourseById 与CourseDao中findCourseById方法对应， 那么传入的参数名称以及类型也应该保持对应关系。</span></span>
<span class="line"><span>         4.可以看到，在sql语句中，通过#{}表达式可以获取参数。</span></span>
<span class="line"><span>         5.下面这条sql语句，实际上的形式是怎么样的？还记得之前说过，mybatis默认为preparedStatement吧，那么，用我们jdbc代码来看，它其实就是：</span></span>
<span class="line"><span>             select course_id as id, course_name as name, course_delete_flg as deleteFlag from t_course where course_id=?</span></span>
<span class="line"><span>     --&gt;</span></span>
<span class="line"><span>    &lt;select id=&quot;findCourseById&quot;  resultType=&quot;course&quot; &gt;</span></span>
<span class="line"><span>        select course_id as id, course_name as name, course_delete_flg as deleteFlag from t_course where course_id=#{courseId}</span></span>
<span class="line"><span>    &lt;/select&gt;</span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><p>上面的示例，我们针对course, 简单演示了 select的用法， 不过有个问题值得思考： 一个student可以对应多个course, 那么，在mybatis中如何处理这种一对多， 甚至于多对多，一对一的关系呢？</p><p>这儿，就不得不提到 resultMap 这个东西， mybatis的resultMap功能可谓十分强大，能够处理复杂的关系映射， 那么resultMap 该怎么配置呢？ 别急，这就来了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    &lt;!-- </span></span>
<span class="line"><span>        resultMap –结果映射，用来描述如何从数据库结果集映射到你想要的对象。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        1.type 对应类型，可以是javabean, 也可以是其它</span></span>
<span class="line"><span>        2.id 必须唯一， 用于标示这个resultMap的唯一性，在使用resultMap的时候，就是通过id指定</span></span>
<span class="line"><span>     --&gt;</span></span>
<span class="line"><span>    &lt;resultMap type=&quot;&quot; id=&quot;&quot;&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        &lt;!-- id, 唯一性，注意啦，这个id用于标示这个javabean对象的唯一性， 不一定会是数据库的主键（不要把它理解为数据库对应表的主键） </span></span>
<span class="line"><span>            property属性对应javabean的属性名，column对应数据库表的列名</span></span>
<span class="line"><span>            （这样，当javabean的属性与数据库对应表的列名不一致的时候，就能通过指定这个保持正常映射了）</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;id property=&quot;&quot; column=&quot;&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- result与id相比， 对应普通属性 --&gt;    </span></span>
<span class="line"><span>        &lt;result property=&quot;&quot; column=&quot;&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- </span></span>
<span class="line"><span>            constructor对应javabean中的构造方法</span></span>
<span class="line"><span>         --&gt;</span></span>
<span class="line"><span>        &lt;constructor&gt;</span></span>
<span class="line"><span>            &lt;!-- idArg 对应构造方法中的id参数；--&gt;</span></span>
<span class="line"><span>            &lt;idArg column=&quot;&quot;/&gt;</span></span>
<span class="line"><span>            &lt;!-- arg 对应构造方法中的普通参数；--&gt;</span></span>
<span class="line"><span>            &lt;arg column=&quot;&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/constructor&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- </span></span>
<span class="line"><span>            聚集元素用来处理“一对多”的关系。需要指定映射的Java实体类的属性，属性的javaType（一般为ArrayList）；列表中对象的类型ofType（Java实体类）；对应的数据库表的列名称；</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            collection，对应javabean中容器类型, 是实现一对多的关键 </span></span>
<span class="line"><span>            property 为javabean中容器对应字段名</span></span>
<span class="line"><span>            column 为体现在数据库中列名</span></span>
<span class="line"><span>            ofType 就是指定javabean中容器指定的类型</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            不同情况需要告诉MyBatis 如何加载一个聚集。MyBatis 可以用两种方式加载：</span></span>
<span class="line"><span>                1. select: 执行一个其它映射的SQL 语句返回一个Java实体类型。较灵活；</span></span>
<span class="line"><span>                2. resultMap: 使用一个嵌套的结果映射来处理通过join查询结果集，映射成Java实体类型。</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;collection property=&quot;&quot; column=&quot;&quot; ofType=&quot;&quot;&gt;&lt;/collection&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- </span></span>
<span class="line"><span>            联合元素用来处理“一对一”的关系。需要指定映射的Java实体类的属性，属性的javaType（通常MyBatis 自己会识别）。对应的数据库表的列名称。如果想覆写的话返回结果的值，需要指定typeHandler。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            association 为关联关系，是实现N对一的关键。</span></span>
<span class="line"><span>            property 为javabean中容器对应字段名</span></span>
<span class="line"><span>            column 为体现在数据库中列名</span></span>
<span class="line"><span>            javaType 指定关联的类型</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            不同情况需要告诉MyBatis 如何加载一个联合。MyBatis可以用两种方式加载：</span></span>
<span class="line"><span>                1. select: 执行一个其它映射的SQL 语句返回一个Java实体类型。较灵活；</span></span>
<span class="line"><span>                2. resultMap: 使用一个嵌套的结果映射来处理，通过join查询结果集，映射成Java实体类型。</span></span>
<span class="line"><span>         --&gt;</span></span>
<span class="line"><span>        &lt;association property=&quot;&quot; column=&quot;&quot; javaType=&quot;&quot;&gt;&lt;/association&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- </span></span>
<span class="line"><span>            有时一个单独的数据库查询也许返回很多不同（但是希望有些关联）数据类型的结果集。鉴别器元素就是被设计来处理这个情况的，还有包括类的继承层次结构。鉴别器非常容易理解，因为它的表现很像Java语言中的switch语句。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            定义鉴别器指定了column和javaType属性。列是MyBatis查找比较值的地方。JavaType是需要被用来保证等价测试的合适类型（尽管字符串在很多情形下都会有用）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            下面这个例子为，当classId为20000001时，才映射classId属性。</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;discriminator column=&quot;CLASS_ID&quot; javaType=&quot;String&quot; jdbcType=&quot;VARCHAR&quot;&gt;  </span></span>
<span class="line"><span>            &lt;case value=&quot;20000001&quot; resultType=&quot;liming.student.manager.data.model.StudentEntity&quot; &gt;  </span></span>
<span class="line"><span>                &lt;result property=&quot;classId&quot; column=&quot;CLASS_ID&quot; javaType=&quot;String&quot; jdbcType=&quot;VARCHAR&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;/case&gt; </span></span>
<span class="line"><span>        &lt;/discriminator&gt;</span></span>
<span class="line"><span>    &lt;/resultMap&gt;</span></span></code></pre></div><p>好啦，知道resutMap怎么配置后，咱们立即接着上面的demo来练习一下吧，一个student对应多个course， 典型的一对多，咱们就来看看mybatis怎么配置这种映射吧：StudentDao-Mapper.xml</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;mapper namespace=&quot;com.dy.dao.StudentDao&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- 这儿定义一个resultMap --&gt;</span></span>
<span class="line"><span>    &lt;resultMap type=&quot;student&quot; id=&quot;studentMap&quot;&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        &lt;!-- </span></span>
<span class="line"><span>            数据库中主键是id, 但是我这儿却是指定idCard为主键，为什么？ </span></span>
<span class="line"><span>            刚刚讲了，id用来表示唯一性， 我们可以认为只要idCard一样，那么他就是同一个学生。</span></span>
<span class="line"><span>            如果此处用数据库中id， 那么mybatis将会认为数据库中每条记录都是一个student, 这显然不符合逻辑</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;id property=&quot;idCard&quot; column=&quot;stu_id_card&quot;/&gt;</span></span>
<span class="line"><span>        &lt;result property=&quot;id&quot; column=&quot;stu_id&quot;/&gt;</span></span>
<span class="line"><span>        &lt;result property=&quot;name&quot; column=&quot;stu_name&quot;/&gt;</span></span>
<span class="line"><span>        &lt;result property=&quot;deleteFlag&quot; column=&quot;stu_delete_flg&quot;/&gt;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>        &lt;constructor&gt;  </span></span>
<span class="line"><span>            &lt;idArg javaType=&quot;String&quot; column=&quot;STUDENT_ID&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;arg javaType=&quot;String&quot; column=&quot;STUDENT_NAME&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;arg javaType=&quot;String&quot; column=&quot;STUDENT_SEX&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;arg javaType=&quot;Date&quot; column=&quot;STUDENT_BIRTHDAY&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/constructor&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- </span></span>
<span class="line"><span>            这儿就是实现一对多的关键。 </span></span>
<span class="line"><span>            在Student中，courseList为List&lt;Course&gt;, 因此，ofType也应该与之对应（当然，我用了别名，不然要蛋疼的写全名了）。</span></span>
<span class="line"><span>            collection的子标签是在指定Course的映射关系（由于Course的javabean的属性名与数据库的列名不一致）</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>        &lt;collection property=&quot;courseList&quot; column=&quot;stu_course_id&quot; ofType=&quot;Course&quot;&gt;</span></span>
<span class="line"><span>            &lt;id property=&quot;id&quot; column=&quot;course_id&quot;/&gt;</span></span>
<span class="line"><span>            &lt;result property=&quot;name&quot; column=&quot;course_name&quot;/&gt;</span></span>
<span class="line"><span>            &lt;result property=&quot;deleteFlag&quot; column=&quot;course_delete_flg&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/collection&gt;</span></span>
<span class="line"><span>    &lt;/resultMap&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;!-- 这儿将返回类型设置成了上面指定的studentMap --&gt;</span></span>
<span class="line"><span>    &lt;select id=&quot;findStudentById&quot; resultMap=&quot;studentMap&quot;&gt;</span></span>
<span class="line"><span>        SELECT s.*, c.* FROM t_student s LEFT JOIN t_course c ON s.stu_course_id=c.course_id WHERE s.stu_id_card=#{idCard}</span></span>
<span class="line"><span>    &lt;/select&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- </span></span>
<span class="line"><span>        sql –可以重用的SQL块，可以被其他数据库操作语句引用。</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>    &lt;sql id=&quot;userColumns&quot;&gt; userid,username,password&lt;/sql&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;select id=&quot;queryUsers&quot; parameterType=&quot;UserDto&quot; resultType=&quot;UserDto&quot; useCache=&quot;false&quot;&gt;</span></span>
<span class="line"><span>	select &lt;include refid=&quot;userColumns&quot;/&gt; from t_user t where t.username = #{username}</span></span>
<span class="line"><span>    &lt;/select&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>&lt;/mapper&gt;</span></span></code></pre></div><p>当然，我们需要定义StudentEntity实体类的构造方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public StudentEntity(String studentID, String studentName, String studentSex, Date studentBirthday){  </span></span>
<span class="line"><span>    this.studentID = studentID;  </span></span>
<span class="line"><span>    this.studentName = studentName;  </span></span>
<span class="line"><span>    this.studentSex = studentSex;  </span></span>
<span class="line"><span>    this.studentBirthday = studentBirthday;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>相信通过以上示例， 大家也能够使用mybatis的select 和 resultMap的用法了。上面只演示了一对多的映射，其实多对一、多对多也与它类似，所以我就没演示了，有兴趣的可以自己动手再做做。</p><h2 id="字符串代入法" tabindex="-1">字符串代入法 <a class="header-anchor" href="#字符串代入法" aria-label="Permalink to &quot;字符串代入法&quot;">​</a></h2><p>默认的情况下，使用#{}语法会促使MyBatis 生成PreparedStatement 属性并且使用PreparedStatement 的参数（=？）来安全的设置值。尽量这些是快捷安全，也是经常使用的。但有时候你可能想直接未更改的字符串代入到SQL 语句中。比如说，对于ORDER BY，你可能会这样使用：ORDER BY \${columnName}但MyBatis 不会修改和规避掉这个字符串。</p><blockquote><p>注意：这样地接收和应用一个用户输入到未更改的语句中，是非常不安全的。这会让用户能植入破坏代码，所以，要么要求字段不要允许客户输入，要么你直接来检测他的合法性 。</p></blockquote><h2 id="子元素之cache解析" tabindex="-1">子元素之cache解析 <a class="header-anchor" href="#子元素之cache解析" aria-label="Permalink to &quot;子元素之cache解析&quot;">​</a></h2><p>Mapper配置文件是由XMLMapperBuilder解析的，其中cacheElement方法负责解析cache元素，它通过调用CacheBuilder的相应方法完成cache的创建。每个cache内部都有一个唯一的ID，这个id的值就是namespace。创建好的cache对象存入configuration的cache缓存中（该缓存以cache的ID属性即namespace为key，这里再次体现了mybatis的namespace的强大用处）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private void cacheElement(XNode context) throws Exception {</span></span>
<span class="line"><span>    if (context != null) {</span></span>
<span class="line"><span>      String type = context.getStringAttribute(&quot;type&quot;, &quot;PERPETUAL&quot;);</span></span>
<span class="line"><span>      Class&lt;? extends Cache&gt; typeClass = typeAliasRegistry.resolveAlias(type);</span></span>
<span class="line"><span>      String eviction = context.getStringAttribute(&quot;eviction&quot;, &quot;LRU&quot;);</span></span>
<span class="line"><span>      Class&lt;? extends Cache&gt; evictionClass = typeAliasRegistry.resolveAlias(eviction);</span></span>
<span class="line"><span>      Long flushInterval = context.getLongAttribute(&quot;flushInterval&quot;);</span></span>
<span class="line"><span>      Integer size = context.getIntAttribute(&quot;size&quot;);</span></span>
<span class="line"><span>      boolean readWrite = !context.getBooleanAttribute(&quot;readOnly&quot;, false);</span></span>
<span class="line"><span>      Properties props = context.getChildrenAsProperties();</span></span>
<span class="line"><span>      builderAssistant.useNewCache(typeClass, evictionClass, flushInterval, size, readWrite, props);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="子元素之cache-ref解析" tabindex="-1">子元素之cache-ref解析 <a class="header-anchor" href="#子元素之cache-ref解析" aria-label="Permalink to &quot;子元素之cache-ref解析&quot;">​</a></h2><p>cacheRefElement方法负责解析cache-ref元素，它通过调用CacheRefResolver的相应方法完成cache的引用。创建好的cache-ref引用关系存入configuration的cacheRefMap缓存中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private void cacheRefElement(XNode context) {</span></span>
<span class="line"><span>    if (context != null) {</span></span>
<span class="line"><span>      configuration.addCacheRef(builderAssistant.getCurrentNamespace(), context.getStringAttribute(&quot;namespace&quot;));</span></span>
<span class="line"><span>      CacheRefResolver cacheRefResolver = new CacheRefResolver(builderAssistant, context.getStringAttribute(&quot;namespace&quot;));</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>    	  cacheRefResolver.resolveCacheRef();</span></span>
<span class="line"><span>      } catch (IncompleteElementException e) {</span></span>
<span class="line"><span>    	  configuration.addIncompleteCacheRef(cacheRefResolver);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="子元素之resultmap解析" tabindex="-1">子元素之resultMap解析 <a class="header-anchor" href="#子元素之resultmap解析" aria-label="Permalink to &quot;子元素之resultMap解析&quot;">​</a></h2><p>resultMapElement方法负责解析resultMap元素，它通过调用ResultMapResolver的相应方法完成resultMap的解析。创建好的resultMap存入configuration的resultMaps缓存中（该缓存以namespace+resultMap的id为key，这里再次体现了mybatis的namespace的强大用处）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private ResultMap resultMapElement(XNode resultMapNode) throws Exception {</span></span>
<span class="line"><span>    return resultMapElement(resultMapNode, Collections.&lt;ResultMapping&gt; emptyList());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private ResultMap resultMapElement(XNode resultMapNode, List&lt;ResultMapping&gt; additionalResultMappings) throws Exception {</span></span>
<span class="line"><span>    ErrorContext.instance().activity(&quot;processing &quot; + resultMapNode.getValueBasedIdentifier());</span></span>
<span class="line"><span>    String id = resultMapNode.getStringAttribute(&quot;id&quot;,</span></span>
<span class="line"><span>        resultMapNode.getValueBasedIdentifier());</span></span>
<span class="line"><span>    String type = resultMapNode.getStringAttribute(&quot;type&quot;,</span></span>
<span class="line"><span>        resultMapNode.getStringAttribute(&quot;ofType&quot;,</span></span>
<span class="line"><span>            resultMapNode.getStringAttribute(&quot;resultType&quot;,</span></span>
<span class="line"><span>                resultMapNode.getStringAttribute(&quot;javaType&quot;))));</span></span>
<span class="line"><span>    String extend = resultMapNode.getStringAttribute(&quot;extends&quot;);</span></span>
<span class="line"><span>    Boolean autoMapping = resultMapNode.getBooleanAttribute(&quot;autoMapping&quot;);</span></span>
<span class="line"><span>    Class&lt;?&gt; typeClass = resolveClass(type);</span></span>
<span class="line"><span>    Discriminator discriminator = null;</span></span>
<span class="line"><span>    List&lt;ResultMapping&gt; resultMappings = new ArrayList&lt;ResultMapping&gt;();</span></span>
<span class="line"><span>    resultMappings.addAll(additionalResultMappings);</span></span>
<span class="line"><span>    List&lt;XNode&gt; resultChildren = resultMapNode.getChildren();</span></span>
<span class="line"><span>    for (XNode resultChild : resultChildren) {</span></span>
<span class="line"><span>      if (&quot;constructor&quot;.equals(resultChild.getName())) {</span></span>
<span class="line"><span>        processConstructorElement(resultChild, typeClass, resultMappings);</span></span>
<span class="line"><span>      } else if (&quot;discriminator&quot;.equals(resultChild.getName())) {</span></span>
<span class="line"><span>        discriminator = processDiscriminatorElement(resultChild, typeClass, resultMappings);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        ArrayList&lt;ResultFlag&gt; flags = new ArrayList&lt;ResultFlag&gt;();</span></span>
<span class="line"><span>        if (&quot;id&quot;.equals(resultChild.getName())) {</span></span>
<span class="line"><span>          flags.add(ResultFlag.ID);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        resultMappings.add(buildResultMappingFromContext(resultChild, typeClass, flags));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ResultMapResolver resultMapResolver = new ResultMapResolver(builderAssistant, id, typeClass, extend, discriminator, resultMappings, autoMapping);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      return resultMapResolver.resolve();</span></span>
<span class="line"><span>    } catch (IncompleteElementException  e) {</span></span>
<span class="line"><span>      configuration.addIncompleteResultMap(resultMapResolver);</span></span>
<span class="line"><span>      throw e;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="子元素之sql解析" tabindex="-1">子元素之sql解析 <a class="header-anchor" href="#子元素之sql解析" aria-label="Permalink to &quot;子元素之sql解析&quot;">​</a></h2><p>sqlElement方法负责解析sql元素。id属性用于区分不同的sql元素，在同一个mapper配置文件中可以配置多个sql元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private void sqlElement(List&lt;XNode&gt; list) throws Exception {</span></span>
<span class="line"><span>    if (configuration.getDatabaseId() != null) {</span></span>
<span class="line"><span>      sqlElement(list, configuration.getDatabaseId());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    sqlElement(list, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void sqlElement(List&lt;XNode&gt; list, String requiredDatabaseId) throws Exception {</span></span>
<span class="line"><span>    for (XNode context : list) {</span></span>
<span class="line"><span>      String databaseId = context.getStringAttribute(&quot;databaseId&quot;);</span></span>
<span class="line"><span>      String id = context.getStringAttribute(&quot;id&quot;);</span></span>
<span class="line"><span>      id = builderAssistant.applyCurrentNamespace(id, false);</span></span>
<span class="line"><span>      if (databaseIdMatchesCurrent(id, databaseId, requiredDatabaseId)) sqlFragments.put(id, context);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  private boolean databaseIdMatchesCurrent(String id, String databaseId, String requiredDatabaseId) {</span></span>
<span class="line"><span>    if (requiredDatabaseId != null) {</span></span>
<span class="line"><span>      if (!requiredDatabaseId.equals(databaseId)) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      if (databaseId != null) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // skip this fragment if there is a previous one with a not null databaseId</span></span>
<span class="line"><span>      if (this.sqlFragments.containsKey(id)) {</span></span>
<span class="line"><span>        XNode context = this.sqlFragments.get(id);</span></span>
<span class="line"><span>        if (context.getStringAttribute(&quot;databaseId&quot;) != null) {</span></span>
<span class="line"><span>          return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="子元素之statement解析" tabindex="-1">子元素之statement解析 <a class="header-anchor" href="#子元素之statement解析" aria-label="Permalink to &quot;子元素之statement解析&quot;">​</a></h2><p>buildStatementFromContext方法负责解析statement元素。id属性用于区分不同的statement元素，在同一个配置文件中可以配置多个statement元素。通过调用XMLStatementBuilder的parseStatementNode方法完成解析。在这个方法内有几个重要的步骤，理解他们对正确的配置statement元素很有帮助。</p><h3 id="动态解析子元素" tabindex="-1">动态解析子元素 <a class="header-anchor" href="#动态解析子元素" aria-label="Permalink to &quot;动态解析子元素&quot;">​</a></h3><p>statement节点可以配置各种子元素，比如前面提到的include子元素和selectKey子元素等（在动态sql里还有更多的子元素，具体参考mybatis的官方文档）。动态解析子元素通过parseDynamicTags方法完成。该方法根据子元素的类型递归的解析成一个个的SqlNode，这些SqlNode对象提供了apply方法，供后续调用时生成sql语句所需。需要注意的是SelectKey没有对应的SqlNode对象，因为它的功能是用来生成KeyGenerator对象的（具体来说是SelectKeyGenerator对象）。另外，SelectKey节点生成的KeyGenerator优先级高于statement节点的useGeneratedKeys属性生成的KeyGenerator对象，也就是说配置了SelectKey子节点就不需要再配置useGeneratedKeys属性了。</p><h3 id="生成sqlsource" tabindex="-1">生成SqlSource <a class="header-anchor" href="#生成sqlsource" aria-label="Permalink to &quot;生成SqlSource&quot;">​</a></h3><p>SqlSource用于后续调用时根据SqlNode和参数对象生成sql语句。它接收一个叫做rootsqlNode的对象作为构造参数。</p><h3 id="生成keygenerator" tabindex="-1">生成KeyGenerator <a class="header-anchor" href="#生成keygenerator" aria-label="Permalink to &quot;生成KeyGenerator&quot;">​</a></h3><p>如果配置了selectKey子元素，KeyGenerator直接使用selectKey子元素里生成的KeyGenerator对象（具体来说是SelectKeyGenerator对象）。若没配置，则如果useGeneratedKeys属性的值为&quot;true&quot;且配置了 keyProperty属性，则生成默认的Jdbc3KeyGenerator对象，该对象调用JDBC驱动的getGeneratedKeys方法返回insert语句执行后生成的自增长主键。</p><h3 id="创建mappedstatement" tabindex="-1">创建MappedStatement <a class="header-anchor" href="#创建mappedstatement" aria-label="Permalink to &quot;创建MappedStatement&quot;">​</a></h3><p>MappedStatement对象封装了statement元素的所有属性以及子节点值，MappedStatement对象有一个id属性用于唯一标记它，这个id由namespace加statement元素的id属性值构成。创建好的MappedStatement对象存入Configuration对象的mappedStatements缓存中，key为MappedStatement对象的id值。</p><p>XMLMapperBuilder.java：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private void buildStatementFromContext(List&lt;XNode&gt; list) {</span></span>
<span class="line"><span>    if (configuration.getDatabaseId() != null) {</span></span>
<span class="line"><span>      buildStatementFromContext(list, configuration.getDatabaseId());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    buildStatementFromContext(list, null);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void buildStatementFromContext(List&lt;XNode&gt; list, String requiredDatabaseId) {</span></span>
<span class="line"><span>    for (XNode context : list) {</span></span>
<span class="line"><span>      final XMLStatementBuilder statementParser = new XMLStatementBuilder(configuration, builderAssistant, context, requiredDatabaseId);</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        statementParser.parseStatementNode();</span></span>
<span class="line"><span>      } catch (IncompleteElementException e) {</span></span>
<span class="line"><span>        configuration.addIncompleteStatement(statementParser);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>XMLStatementBuilder.java：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public void parseStatementNode() {</span></span>
<span class="line"><span>    String id = context.getStringAttribute(&quot;id&quot;);</span></span>
<span class="line"><span>    String databaseId = context.getStringAttribute(&quot;databaseId&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!databaseIdMatchesCurrent(id, databaseId, this.requiredDatabaseId)) return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Integer fetchSize = context.getIntAttribute(&quot;fetchSize&quot;);</span></span>
<span class="line"><span>    Integer timeout = context.getIntAttribute(&quot;timeout&quot;);</span></span>
<span class="line"><span>    String parameterMap = context.getStringAttribute(&quot;parameterMap&quot;);</span></span>
<span class="line"><span>    String parameterType = context.getStringAttribute(&quot;parameterType&quot;);</span></span>
<span class="line"><span>    Class&lt;?&gt; parameterTypeClass = resolveClass(parameterType);</span></span>
<span class="line"><span>    String resultMap = context.getStringAttribute(&quot;resultMap&quot;);</span></span>
<span class="line"><span>    String resultType = context.getStringAttribute(&quot;resultType&quot;);</span></span>
<span class="line"><span>    String lang = context.getStringAttribute(&quot;lang&quot;);</span></span>
<span class="line"><span>    LanguageDriver langDriver = getLanguageDriver(lang);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Class&lt;?&gt; resultTypeClass = resolveClass(resultType);</span></span>
<span class="line"><span>    String resultSetType = context.getStringAttribute(&quot;resultSetType&quot;);</span></span>
<span class="line"><span>    StatementType statementType = StatementType.valueOf(context.getStringAttribute(&quot;statementType&quot;, StatementType.PREPARED.toString()));</span></span>
<span class="line"><span>    ResultSetType resultSetTypeEnum = resolveResultSetType(resultSetType);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String nodeName = context.getNode().getNodeName();</span></span>
<span class="line"><span>    SqlCommandType sqlCommandType = SqlCommandType.valueOf(nodeName.toUpperCase(Locale.ENGLISH));</span></span>
<span class="line"><span>    boolean isSelect = sqlCommandType == SqlCommandType.SELECT;</span></span>
<span class="line"><span>    boolean flushCache = context.getBooleanAttribute(&quot;flushCache&quot;, !isSelect);</span></span>
<span class="line"><span>    boolean useCache = context.getBooleanAttribute(&quot;useCache&quot;, isSelect);</span></span>
<span class="line"><span>    boolean resultOrdered = context.getBooleanAttribute(&quot;resultOrdered&quot;, false);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Include Fragments before parsing</span></span>
<span class="line"><span>    XMLIncludeTransformer includeParser = new XMLIncludeTransformer(configuration, builderAssistant);</span></span>
<span class="line"><span>    includeParser.applyIncludes(context.getNode());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Parse selectKey after includes and remove them.</span></span>
<span class="line"><span>    processSelectKeyNodes(id, parameterTypeClass, langDriver);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Parse the SQL (pre: &lt;selectKey&gt; and &lt;include&gt; were parsed and removed)</span></span>
<span class="line"><span>    SqlSource sqlSource = langDriver.createSqlSource(configuration, context, parameterTypeClass);</span></span>
<span class="line"><span>    String resultSets = context.getStringAttribute(&quot;resultSets&quot;);</span></span>
<span class="line"><span>    String keyProperty = context.getStringAttribute(&quot;keyProperty&quot;);</span></span>
<span class="line"><span>    String keyColumn = context.getStringAttribute(&quot;keyColumn&quot;);</span></span>
<span class="line"><span>    KeyGenerator keyGenerator;</span></span>
<span class="line"><span>    String keyStatementId = id + SelectKeyGenerator.SELECT_KEY_SUFFIX;</span></span>
<span class="line"><span>    keyStatementId = builderAssistant.applyCurrentNamespace(keyStatementId, true);</span></span>
<span class="line"><span>    if (configuration.hasKeyGenerator(keyStatementId)) {</span></span>
<span class="line"><span>      keyGenerator = configuration.getKeyGenerator(keyStatementId);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      keyGenerator = context.getBooleanAttribute(&quot;useGeneratedKeys&quot;,</span></span>
<span class="line"><span>          configuration.isUseGeneratedKeys() &amp;&amp; SqlCommandType.INSERT.equals(sqlCommandType))</span></span>
<span class="line"><span>          ? new Jdbc3KeyGenerator() : new NoKeyGenerator();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    builderAssistant.addMappedStatement(id, sqlSource, statementType, sqlCommandType,</span></span>
<span class="line"><span>        fetchSize, timeout, parameterMap, parameterTypeClass, resultMap, resultTypeClass,</span></span>
<span class="line"><span>        resultSetTypeEnum, flushCache, useCache, resultOrdered, </span></span>
<span class="line"><span>        keyGenerator, keyProperty, keyColumn, databaseId, langDriver, resultSets);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="注册mapper类型" tabindex="-1">注册mapper类型 <a class="header-anchor" href="#注册mapper类型" aria-label="Permalink to &quot;注册mapper类型&quot;">​</a></h2><p>我们知道每个mapper配置文件的namespace属性对应于某个接口，应用程序通过接口访问mybatis时，mybatis会为这个接口生成一个代理对象，这个对象就叫mapper对象，在生成代理对象前mybatis会校验接口是否已注册，未注册的接口会产生一个异常。为了避免这种异常，就需要注册mapper类型。这个步骤是在XMLMapperBuilder的bindMapperForNamespace方法中完成的。它通过调用Configuration对象的addMapper方法完成，而Configuration对象的addMapper方法是通过MapperRegistry的addMapper方法完成的，它只是简单的将namespace属性对应的接口类型存入本地缓存中。</p><p>Configuration对象提供了一个重载的addMappers(StringpackageName)方法，该方法以包路径名为参数，它的功能是自动扫描包路径下的接口并注册到MapperRegistry的缓存中，同时扫描包路径下的mapper配置文件并解析之。解析配置文件是在MapperAnnotationBuilder类的parse方法里完成的，该方法先解析配置文件，然后再解析接口里的注解配置，且注解里的配置会覆盖配置文件里的配置，也就是说注解的优先级高于配置文件，这点需要注意。采用自动扫描会大大简化配置，只不过需要应用程序自己调用，mybatis默认是不会调用这个方法的（后续将会讲解的spring集成mybatis就用到了自动扫描）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private void bindMapperForNamespace() {</span></span>
<span class="line"><span>    String namespace = builderAssistant.getCurrentNamespace();</span></span>
<span class="line"><span>    if (namespace != null) {</span></span>
<span class="line"><span>      Class&lt;?&gt; boundType = null;</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        boundType = Resources.classForName(namespace);</span></span>
<span class="line"><span>      } catch (ClassNotFoundException e) {</span></span>
<span class="line"><span>        //ignore, bound type is not required</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (boundType != null) {</span></span>
<span class="line"><span>        if (!configuration.hasMapper(boundType)) {</span></span>
<span class="line"><span>          // Spring may not know the real resource name so we set a flag</span></span>
<span class="line"><span>          // to prevent loading again this resource from the mapper interface</span></span>
<span class="line"><span>          // look at MapperAnnotationBuilder#loadXmlResource</span></span>
<span class="line"><span>          configuration.addLoadedResource(&quot;namespace:&quot; + namespace);</span></span>
<span class="line"><span>          configuration.addMapper(boundType);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,65)]))}const m=a(t,[["render",l]]);export{g as __pageData,m as default};
