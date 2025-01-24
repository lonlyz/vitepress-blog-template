import{_ as a,a as n}from"./chunks/dev-package-lombok-3.uMezgXQY.js";import{_ as p,c as e,ai as t,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/develop/package/package-mapstrcut-9.png",r="/vitepress-blog-template/images/develop/package/package-mapstrcut-10.png",o="/vitepress-blog-template/images/develop/package/package-mapstrcut-1.gif",c="/vitepress-blog-template/images/develop/package/package-mapstrcut-2.gif",g="/vitepress-blog-template/images/develop/package/package-mapstrcut-3.png",u="/vitepress-blog-template/images/develop/package/package-mapstrcut-4.png",d="/vitepress-blog-template/images/develop/package/package-mapstrcut-5.png",h="/vitepress-blog-template/images/develop/package/package-mapstrcut-6.png",m="/vitepress-blog-template/images/develop/package/package-mapstrcut-7.png",b="/vitepress-blog-template/images/develop/package/package-mapstrcut-8.png",v="/vitepress-blog-template/images/develop/package/package-mapstrcut-11.png",M=JSON.parse('{"title":"常用开发库 - MapStruct工具库详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/package/dev-package-x-mapstruct.md","filePath":"develop/package/dev-package-x-mapstruct.md","lastUpdated":1737706346000}'),f={name:"develop/package/dev-package-x-mapstruct.md"};function k(q,s,y,C,S,I){return l(),e("div",null,s[0]||(s[0]=[t('<h1 id="常用开发库-mapstruct工具库详解" tabindex="-1">常用开发库 - MapStruct工具库详解 <a class="header-anchor" href="#常用开发库-mapstruct工具库详解" aria-label="Permalink to &quot;常用开发库 - MapStruct工具库详解&quot;">​</a></h1><blockquote><p>MapStruct是一款非常实用Java工具，主要用于解决对象之间的拷贝问题，比如PO/DTO/VO/QueryParam之间的转换问题。区别于BeanUtils这种通过反射，它通过编译器编译生成常规方法，将可以很大程度上提升效率。全面的官方手册可以参考<a href="https://mapstruct.org/documentation/stable/reference/pdf/mapstruct-reference-guide.pdf" target="_blank" rel="noreferrer">官方文档PDF在新窗口打开</a>。@pdai</p></blockquote><h2 id="为什么会引入mapstruct这类工具" tabindex="-1">为什么会引入MapStruct这类工具 <a class="header-anchor" href="#为什么会引入mapstruct这类工具" aria-label="Permalink to &quot;为什么会引入MapStruct这类工具&quot;">​</a></h2><p>提示</p><p>首先看下这类工具出现的背景。@pdai</p><h3 id="javabean-问题引入" tabindex="-1">JavaBean 问题引入 <a class="header-anchor" href="#javabean-问题引入" aria-label="Permalink to &quot;JavaBean 问题引入&quot;">​</a></h3><p>在开发的时候经常会有业务代码之间有很多的 JavaBean 之间的相互转化，比如PO/DTO/VO/QueryParam之间的转换问题。之前我们的做法是：</p><ul><li><p><strong>拷贝技术</strong></p><ul><li>org.apache.commons.beanutils.PropertyUtils.copyProperties</li><li>org.apache.commons.beanutils.BeanUtils.copyProperties</li><li>org.springframework.beans.BeanUtils.copyProperties</li><li>net.sf.cglib.beans.BeanCopier</li></ul></li><li><p><strong>纯get/set</strong></p><ul><li>辅助IDE插件拷贝对象时可以自动set所有方法字段 （这种方式可能有些开发人员不清楚）</li><li>不仅看上去冗余添加新的字段时依然需要手动</li><li>开发效率比较低</li></ul></li></ul><h3 id="mapstruct-带来的改变" tabindex="-1">MapStruct 带来的改变 <a class="header-anchor" href="#mapstruct-带来的改变" aria-label="Permalink to &quot;MapStruct 带来的改变&quot;">​</a></h3><blockquote><p>MapSturct 是一个生成类型安全， 高性能且无依赖的 JavaBean 映射代码的注解处理器（annotation processor）。</p></blockquote><p>工具可以帮我们实现 JavaBean 之间的转换， 通过注解的方式。</p><p>同时， 作为一个工具类，相比于手写， 其应该具有便捷， 不容易出错的特点。</p><h2 id="mapstruct入门例子" tabindex="-1">MapStruct入门例子 <a class="header-anchor" href="#mapstruct入门例子" aria-label="Permalink to &quot;MapStruct入门例子&quot;">​</a></h2><blockquote><p>这里展示最基本的PO转VO的例子，使用的是IDEA + Lombok + MapStruct</p></blockquote><p><img src="'+i+`" alt="error.图片加载失败"></p><h3 id="pom-xml" tabindex="-1">Pom.xml <a class="header-anchor" href="#pom-xml" aria-label="Permalink to &quot;Pom.xml&quot;">​</a></h3><blockquote><p>注意：基于当前IDEA设置并不需要<code>mapstruct-processor</code>的依赖</p></blockquote><p>一般来说会加载两个包：</p><ul><li><code>org.mapstruct:mapstruct</code>: 包含Mapstruct核心，比如注解等；如果是<code>mapstruct-jdk8</code>会引入一些jdk8的语言特性;</li><li><code>org.mapstruct:mapstruct-processor</code>: 处理注解用的，可以根据注解自动生成mapstruct的mapperImpl类</li></ul><p>如下示例基于IDEA实现，可以在build阶段的<code>annotationProcessorPaths</code>中配置<code>mapstruct-processor</code>的path。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;packaging&gt;jar&lt;/packaging&gt;</span></span>
<span class="line"><span>&lt;properties&gt;</span></span>
<span class="line"><span>    &lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;</span></span>
<span class="line"><span>    &lt;maven.compiler.source&gt;1.8&lt;/maven.compiler.source&gt;</span></span>
<span class="line"><span>    &lt;maven.compiler.target&gt;1.8&lt;/maven.compiler.target&gt;</span></span>
<span class="line"><span>    &lt;org.mapstruct.version&gt;1.4.0.Beta3&lt;/org.mapstruct.version&gt;</span></span>
<span class="line"><span>    &lt;org.projectlombok.version&gt;1.18.12&lt;/org.projectlombok.version&gt;</span></span>
<span class="line"><span>&lt;/properties&gt;</span></span>
<span class="line"><span>&lt;dependencies&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;mapstruct&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;\${org.mapstruct.version}&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- lombok dependencies should not end up on classpath --&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;lombok&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;\${org.projectlombok.version}&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;scope&gt;provided&lt;/scope&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;!-- fastjson --&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;com.alibaba&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;fastjson&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;1.2.71&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;junit&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;junit&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;4.12&lt;/version&gt;</span></span>
<span class="line"><span>        &lt;scope&gt;test&lt;/scope&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;/dependencies&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;build&gt;</span></span>
<span class="line"><span>    &lt;pluginManagement&gt;</span></span>
<span class="line"><span>        &lt;plugins&gt;</span></span>
<span class="line"><span>            &lt;plugin&gt;</span></span>
<span class="line"><span>                &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span></span>
<span class="line"><span>                &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>                &lt;version&gt;3.8.1&lt;/version&gt;</span></span>
<span class="line"><span>                &lt;configuration&gt;</span></span>
<span class="line"><span>                    &lt;source&gt;1.8&lt;/source&gt;</span></span>
<span class="line"><span>                    &lt;target&gt;1.8&lt;/target&gt;</span></span>
<span class="line"><span>                    &lt;!-- See https://maven.apache.org/plugins/maven-compiler-plugin/compile-mojo.html --&gt;</span></span>
<span class="line"><span>                    &lt;!-- Classpath elements to supply as annotation processor path. If specified, the compiler   --&gt;</span></span>
<span class="line"><span>                    &lt;!-- will detect annotation processors only in those classpath elements. If omitted, the     --&gt;</span></span>
<span class="line"><span>                    &lt;!-- default classpath is used to detect annotation processors. The detection itself depends --&gt;</span></span>
<span class="line"><span>                    &lt;!-- on the configuration of annotationProcessors.                                           --&gt;</span></span>
<span class="line"><span>                    &lt;!--                                                                                         --&gt;</span></span>
<span class="line"><span>                    &lt;!-- According to this documentation, the provided dependency processor is not considered!   --&gt;</span></span>
<span class="line"><span>                    &lt;annotationProcessorPaths&gt;</span></span>
<span class="line"><span>                        &lt;path&gt;</span></span>
<span class="line"><span>                            &lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</span></span>
<span class="line"><span>                            &lt;artifactId&gt;mapstruct-processor&lt;/artifactId&gt;</span></span>
<span class="line"><span>                            &lt;version&gt;\${org.mapstruct.version}&lt;/version&gt;</span></span>
<span class="line"><span>                        &lt;/path&gt;</span></span>
<span class="line"><span>                        &lt;path&gt;</span></span>
<span class="line"><span>                            &lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</span></span>
<span class="line"><span>                            &lt;artifactId&gt;lombok&lt;/artifactId&gt;</span></span>
<span class="line"><span>                            &lt;version&gt;\${org.projectlombok.version}&lt;/version&gt;</span></span>
<span class="line"><span>                        &lt;/path&gt;</span></span>
<span class="line"><span>                    &lt;/annotationProcessorPaths&gt;</span></span>
<span class="line"><span>                &lt;/configuration&gt;</span></span>
<span class="line"><span>            &lt;/plugin&gt;</span></span>
<span class="line"><span>        &lt;/plugins&gt;</span></span>
<span class="line"><span>    &lt;/pluginManagement&gt;</span></span>
<span class="line"><span>&lt;/build&gt;</span></span></code></pre></div><h3 id="entity" tabindex="-1">Entity <a class="header-anchor" href="#entity" aria-label="Permalink to &quot;Entity&quot;">​</a></h3><p>这里面假设基于一些业务需求采用的是MySQL，且将一些扩展的数据放在了config字段中，并以JSON转String存储。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Accessors(chain = true)</span></span>
<span class="line"><span>public class User {</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span>    private String username;</span></span>
<span class="line"><span>    private String password; // 密码</span></span>
<span class="line"><span>    private Integer sex;  // 性别</span></span>
<span class="line"><span>    private LocalDate birthday; // 生日</span></span>
<span class="line"><span>    private LocalDateTime createTime; // 创建时间</span></span>
<span class="line"><span>    private String config; // 其他扩展信息，以JSON格式存储</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="vo-类" tabindex="-1">VO 类 <a class="header-anchor" href="#vo-类" aria-label="Permalink to &quot;VO 类&quot;">​</a></h3><p>最后真正展示的应该：</p><ul><li>不显示密码；</li><li>将日期转换；</li><li>config要转成对象的list；</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Accessors(chain = true)</span></span>
<span class="line"><span>public class UserVo {</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span>    private String username;</span></span>
<span class="line"><span>    private String password;</span></span>
<span class="line"><span>    private Integer gender;</span></span>
<span class="line"><span>    private LocalDate birthday;</span></span>
<span class="line"><span>    private String createTime;</span></span>
<span class="line"><span>    private List&lt;UserConfig&gt; config;</span></span>
<span class="line"><span>    @Data</span></span>
<span class="line"><span>    public static class UserConfig {</span></span>
<span class="line"><span>        private String field1;</span></span>
<span class="line"><span>        private Integer field2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="mapper-或者converter" tabindex="-1">mapper(或者converter) <a class="header-anchor" href="#mapper-或者converter" aria-label="Permalink to &quot;mapper(或者converter)&quot;">​</a></h3><p>注意：</p><ul><li>这里没用@Mappings，且看最后编译出的类文件，会自动加</li><li>密码需要ignore</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Mapper</span></span>
<span class="line"><span>public interface UserConverter {</span></span>
<span class="line"><span>    UserConverter INSTANCE = Mappers.getMapper(UserConverter.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Mapping(target = &quot;gender&quot;, source = &quot;sex&quot;)</span></span>
<span class="line"><span>    @Mapping(target = &quot;createTime&quot;, dateFormat = &quot;yyyy-MM-dd HH:mm:ss&quot;)</span></span>
<span class="line"><span>    UserVo do2vo(User var1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Mapping(target = &quot;sex&quot;, source = &quot;gender&quot;)</span></span>
<span class="line"><span>    @Mapping(target = &quot;password&quot;, ignore = true)</span></span>
<span class="line"><span>    @Mapping(target = &quot;createTime&quot;, dateFormat = &quot;yyyy-MM-dd HH:mm:ss&quot;)</span></span>
<span class="line"><span>    User vo2Do(UserVo var1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;UserVo&gt; do2voList(List&lt;User&gt; userList);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default List&lt;UserVo.UserConfig&gt; strConfigToListUserConfig(String config) {</span></span>
<span class="line"><span>        return JSON.parseArray(config, UserVo.UserConfig.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    default String listUserConfigToStrConfig(List&lt;UserVo.UserConfig&gt; list) {</span></span>
<span class="line"><span>        return JSON.toJSONString(list);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="测试类" tabindex="-1">测试类 <a class="header-anchor" href="#测试类" aria-label="Permalink to &quot;测试类&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void do2VoTest() {</span></span>
<span class="line"><span>    User user = new User()</span></span>
<span class="line"><span>            .setId(1L)</span></span>
<span class="line"><span>            .setUsername(&quot;zhangsan&quot;)</span></span>
<span class="line"><span>            .setSex(1)</span></span>
<span class="line"><span>            .setPassword(&quot;abc123&quot;)</span></span>
<span class="line"><span>            .setCreateTime(LocalDateTime.now())</span></span>
<span class="line"><span>            .setBirthday(LocalDate.of(1999, 9, 27))</span></span>
<span class="line"><span>            .setConfig(&quot;[{\\&quot;field1\\&quot;:\\&quot;Test Field1\\&quot;,\\&quot;field2\\&quot;:500}]&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    UserVo userVo = UserConverter.INSTANCE.do2vo(user);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // asset</span></span>
<span class="line"><span>    assertNotNull(userVo);</span></span>
<span class="line"><span>    assertEquals(userVo.getId(), user.getId());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // print</span></span>
<span class="line"><span>    System.out.println(user);</span></span>
<span class="line"><span>    System.out.println(userVo);</span></span>
<span class="line"><span>//        User(id=1, username=zhangsan, password=abc123, sex=1, birthday=1999-09-27, createTime=2020-08-17T14:54:01.528, config=[{&quot;field1&quot;:&quot;Test Field1&quot;,&quot;field2&quot;:500}])</span></span>
<span class="line"><span>//        UserVo(id=1, username=zhangsan, password=abc123, gender=1, birthday=1999-09-27, createTime=2020-08-17 14:54:01, config=[UserVo.UserConfig(field1=Test Field1, field2=500)])</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Test</span></span>
<span class="line"><span>public void vo2DoTest() {</span></span>
<span class="line"><span>    UserVo.UserConfig userConfig = new UserVo.UserConfig();</span></span>
<span class="line"><span>    userConfig.setField1(&quot;Test Field1&quot;);</span></span>
<span class="line"><span>    userConfig.setField2(500);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    UserVo userVo = new UserVo()</span></span>
<span class="line"><span>            .setId(1L)</span></span>
<span class="line"><span>            .setUsername(&quot;zhangsan&quot;)</span></span>
<span class="line"><span>            .setGender(2)</span></span>
<span class="line"><span>            .setCreateTime(&quot;2020-01-18 15:32:54&quot;)</span></span>
<span class="line"><span>            .setBirthday(LocalDate.of(1999, 9, 27))</span></span>
<span class="line"><span>            .setConfig(Collections.singletonList(userConfig));</span></span>
<span class="line"><span>    User user = UserConverter.INSTANCE.vo2Do(userVo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // asset</span></span>
<span class="line"><span>    assertNotNull(userVo);</span></span>
<span class="line"><span>    assertEquals(userVo.getId(), user.getId());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // print</span></span>
<span class="line"><span>    System.out.println(user);</span></span>
<span class="line"><span>    System.out.println(userVo);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="mapstrcut实现的原理" tabindex="-1">MapStrcut实现的原理? <a class="header-anchor" href="#mapstrcut实现的原理" aria-label="Permalink to &quot;MapStrcut实现的原理?&quot;">​</a></h2><p>MapStruct 来生成的代码， 其类似于人手写。 速度上可以得到保证。</p><p>前面例子中生成的代码可以在编译后看到, 在 target/generated-sources/annotations 里可以看到; 同时真正在代码包执行的可以在target/classes包中看到。</p><h3 id="编译后的类" tabindex="-1">编译后的类 <a class="header-anchor" href="#编译后的类" aria-label="Permalink to &quot;编译后的类&quot;">​</a></h3><ul><li>编译后的class位置</li></ul><p><img src="`+r+`" alt="error.图片加载失败"></p><ul><li>编译后的内容</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class UserConverterImpl implements UserConverter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public UserVo do2vo(User var1) {</span></span>
<span class="line"><span>        if ( var1 == null ) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        UserVo userVo = new UserVo();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        userVo.setGender( var1.getSex() );</span></span>
<span class="line"><span>        if ( var1.getCreateTime() != null ) {</span></span>
<span class="line"><span>            userVo.setCreateTime( DateTimeFormatter.ofPattern( &quot;yyyy-MM-dd HH:mm:ss&quot; ).format( var1.getCreateTime() ) );</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        userVo.setId( var1.getId() );</span></span>
<span class="line"><span>        userVo.setUsername( var1.getUsername() );</span></span>
<span class="line"><span>        userVo.setPassword( var1.getPassword() );</span></span>
<span class="line"><span>        userVo.setBirthday( var1.getBirthday() );</span></span>
<span class="line"><span>        userVo.setConfig( strConfigToListUserConfig( var1.getConfig() ) );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return userVo;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public User vo2Do(UserVo var1) {</span></span>
<span class="line"><span>        if ( var1 == null ) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        User user = new User();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        user.setSex( var1.getGender() );</span></span>
<span class="line"><span>        if ( var1.getCreateTime() != null ) {</span></span>
<span class="line"><span>            user.setCreateTime( LocalDateTime.parse( var1.getCreateTime(), DateTimeFormatter.ofPattern( &quot;yyyy-MM-dd HH:mm:ss&quot; ) ) );</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        user.setId( var1.getId() );</span></span>
<span class="line"><span>        user.setUsername( var1.getUsername() );</span></span>
<span class="line"><span>        user.setBirthday( var1.getBirthday() );</span></span>
<span class="line"><span>        user.setConfig( listUserConfigToStrConfig( var1.getConfig() ) );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return user;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public List&lt;UserVo&gt; do2voList(List&lt;User&gt; userList) {</span></span>
<span class="line"><span>        if ( userList == null ) {</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&lt;UserVo&gt; list = new ArrayList&lt;UserVo&gt;( userList.size() );</span></span>
<span class="line"><span>        for ( User user : userList ) {</span></span>
<span class="line"><span>            list.add( do2vo( user ) );</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return list;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="这里面用了什么机制" tabindex="-1">这里面用了什么机制？ <a class="header-anchor" href="#这里面用了什么机制" aria-label="Permalink to &quot;这里面用了什么机制？&quot;">​</a></h3><blockquote><p>这和Lombok实现机制一致。</p></blockquote><p>核心之处就是对于注解的解析上。JDK5引入了注解的同时，也提供了两种解析方式。</p><ul><li><strong>运行时解析</strong></li></ul><p>运行时能够解析的注解，必须将@Retention设置为RUNTIME, 比如<code>@Retention(RetentionPolicy.RUNTIME)</code>，这样就可以通过反射拿到该注解。java.lang,reflect反射包中提供了一个接口AnnotatedElement，该接口定义了获取注解信息的几个方法，Class、Constructor、Field、Method、Package等都实现了该接口，对反射熟悉的朋友应该都会很熟悉这种解析方式。</p><ul><li><strong>编译时解析</strong></li></ul><p>编译时解析有两种机制，分别简单描述下：</p><p>1）Annotation Processing Tool</p><p>apt自JDK5产生，JDK7已标记为过期，不推荐使用，JDK8中已彻底删除，自JDK6开始，可以使用Pluggable Annotation Processing API来替换它，apt被替换主要有2点原因：</p><ul><li>api都在com.sun.mirror非标准包下</li><li>没有集成到javac中，需要额外运行</li></ul><p>2）Pluggable Annotation Processing API</p><p><a href="https://www.jcp.org/en/jsr/proposalDetails?id=269" target="_blank" rel="noreferrer">JSR 269: Pluggable Annotation Processing API在新窗口打开</a>自JDK6加入，作为apt的替代方案，它解决了apt的两个问题，javac在执行的时候会调用实现了该API的程序，这样我们就可以对编译器做一些增强，这时javac执行的过程如下：</p><p><img src="`+a+'" alt="error.图片加载失败"></p><p>Lombok本质上就是一个实现了“JSR 269 API”的程序。在使用javac的过程中，它产生作用的具体流程如下：</p><ul><li>javac对源代码进行分析，生成了一棵抽象语法树（AST）</li><li>运行过程中调用实现了“JSR 269 API”的Lombok程序</li><li>此时Lombok就对第一步骤得到的AST进行处理，找到@Data注解所在类对应的语法树（AST），然后修改该语法树（AST），增加getter和setter方法定义的相应树节点</li><li>javac使用修改后的抽象语法树（AST）生成字节码文件，即给class增加新的节点（代码块）</li></ul><p><img src="'+n+`" alt="error.图片加载失败"></p><p>从上面的Lombok执行的流程图中可以看出，在Javac 解析成AST抽象语法树之后, Lombok 根据自己编写的注解处理器，动态地修改 AST，增加新的节点（即Lombok自定义注解所需要生成的代码），最终通过分析生成JVM可执行的字节码Class文件。使用Annotation Processing自定义注解是在编译阶段进行修改，而JDK的反射技术是在运行时动态修改，两者相比，反射虽然更加灵活一些但是带来的性能损耗更加大。</p><h2 id="mapstruct更多例子" tabindex="-1">MapStruct更多例子 <a class="header-anchor" href="#mapstruct更多例子" aria-label="Permalink to &quot;MapStruct更多例子&quot;">​</a></h2><p>提示</p><p>一般特性和例子最好直接<a href="https://github.com/mapstruct/mapstruct-examples" target="_blank" rel="noreferrer">参考官网例子在新窗口打开</a>， 这里会差异化的体现一些常见的用法。@pdai</p><h3 id="自定义属性的转化" tabindex="-1">自定义属性的转化 <a class="header-anchor" href="#自定义属性的转化" aria-label="Permalink to &quot;自定义属性的转化&quot;">​</a></h3><blockquote><p>注意在不同的JDK版本中做法不太一样。@pdai</p></blockquote><ul><li><strong>JDK 8以上版本</strong></li></ul><p>一般常用的类型字段转换 MapStruct都能替我们完成，但是有一些是我们自定义的对象类型，MapStruct就不能进行字段转换，这就需要我们编写对应的类型转换方法，笔者使用的是JDK8，支持接口中的默认方法，可以直接在转换器中添加自定义类型转换方法。</p><p>上述例子中User对象的config属性是一个JSON字符串，UserVo对象中是List类型的，这需要实现JSON字符串与对象的互转。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>default List&lt;UserConfig&gt; strConfigToListUserConfig(String config) {</span></span>
<span class="line"><span>  return JSON.parseArray(config, UserConfig.class);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>default String listUserConfigToStrConfig(List&lt;UserConfig&gt; list) {</span></span>
<span class="line"><span>  return JSON.toJSONString(list);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>JDK 8 以下版本</strong></li></ul><p>如果是 JDK8以下的，不支持默认方法，可以另外定义一个 转换器，然后再当前转换器的 @Mapper 中通过 uses = XXX.class 进行引用。</p><p>定义好方法之后，MapStruct当匹配到合适类型的字段时，会调用我们自定义的转换方法进行转换。</p><h3 id="转为多个对象" tabindex="-1">转为多个对象 <a class="header-anchor" href="#转为多个对象" aria-label="Permalink to &quot;转为多个对象&quot;">​</a></h3><p>比如上面例子中User可以转为UserQueryParam, 业务功能上比如通过UserQueryParam里面的参数进行查找用户的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Accessors(chain = true)</span></span>
<span class="line"><span>public class UserQueryParam {</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span>    private String username;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>添加转换方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UserQueryParam vo2QueryParam(User var1);</span></span></code></pre></div><h3 id="spring中使用mapstruct" tabindex="-1">Spring中使用MapStruct <a class="header-anchor" href="#spring中使用mapstruct" aria-label="Permalink to &quot;Spring中使用MapStruct&quot;">​</a></h3><blockquote><p>除了UserConverter.INSTANCE这种方式还可以注入Spring容器中使用。</p></blockquote><ul><li>componentModel</li></ul><p>当添加<code>componentModel=&quot;spring&quot;</code>时，它会在实现类上自动添加<code>@Component</code>注解，这样就能被Spring记性component scan，从而加载到springContext中，进而被<code>@Autowird</code>注入使用。（其它还有<code>jsr330</code>和<code>cdi</code>标准，基本上使用<code>componentModel=&quot;spring&quot;</code>就够了）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Mapper(componentModel=&quot;spring&quot;)</span></span>
<span class="line"><span>public interface UserConverter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>引入和测试</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@RunWith(SpringRunner.class)</span></span>
<span class="line"><span>@SpringBootTest</span></span>
<span class="line"><span>public class UserConverterTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Resource</span></span>
<span class="line"><span>  private UserConverter userConverter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // test methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="多个对象转一个对象" tabindex="-1">多个对象转一个对象 <a class="header-anchor" href="#多个对象转一个对象" aria-label="Permalink to &quot;多个对象转一个对象&quot;">​</a></h3><p>比如上述例子中User购买了东西，需要邮寄到他的地址Address，这时需要展示UserWithAddress的信息：</p><ul><li>Address</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>public class Address {</span></span>
<span class="line"><span>    private String street;</span></span>
<span class="line"><span>    private Integer zipCode;</span></span>
<span class="line"><span>    private Integer houseNo;</span></span>
<span class="line"><span>    private String description;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>UserWithAddressVo</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>public class UserWithAddressVo {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String username;</span></span>
<span class="line"><span>    private Integer sex;</span></span>
<span class="line"><span>    private String street;</span></span>
<span class="line"><span>    private Integer zipCode;</span></span>
<span class="line"><span>    private Integer houseNumber;</span></span>
<span class="line"><span>    private String description;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>converter方法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Mapping(source = &quot;person.description&quot;, target = &quot;description&quot;)</span></span>
<span class="line"><span>@Mapping(source = &quot;address.houseNo&quot;, target = &quot;houseNumber&quot;)</span></span>
<span class="line"><span>UserWithAddressVo userAndAddress2Vo(User user, Address address);</span></span></code></pre></div><blockquote><p>注意：在多对一转换时， 遵循以下几个原则</p></blockquote><ul><li>当多个对象中， 有其中一个为 null， 则会直接返回 null</li><li>如一对一转换一样， 属性通过名字来自动匹配。 因此， 名称和类型相同的不需要进行特殊处理</li><li>当多个原对象中，<strong>有相同名字的属性时，需要通过 @Mapping 注解来具体的指定</strong>， 以免出现歧义（不指定会报错）。 如上面的 description</li></ul><p>属性也可以直接从传入的参数来赋值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Mapping(source = &quot;person.description&quot;, target = &quot;description&quot;)</span></span>
<span class="line"><span>@Mapping(source = &quot;hn&quot;, target = &quot;houseNumber&quot;)</span></span>
<span class="line"><span>UserWithAddressVo userAndAddressHn2Vo(User user, Integer hn);</span></span></code></pre></div><h2 id="mapstruct再深入理解" tabindex="-1">MapStruct再深入理解 <a class="header-anchor" href="#mapstruct再深入理解" aria-label="Permalink to &quot;MapStruct再深入理解&quot;">​</a></h2><p>提示</p><p>在了解基本的MapStruct使用之后，我们将从多个角度来深入理解MapStruct这个工具。@pdai</p><h3 id="intellij-idea-中对mapstruct的支持如何" tabindex="-1">IntelliJ IDEA 中对MapStruct的支持如何？ <a class="header-anchor" href="#intellij-idea-中对mapstruct的支持如何" aria-label="Permalink to &quot;IntelliJ IDEA 中对MapStruct的支持如何？&quot;">​</a></h3><blockquote><p>通常来说IDE对于MapStruct这类工具的支持体现在两方面，一个是Maven的集成，另一个是编辑时的提示（Hit）； 相关的支持可以<a href="https://mapstruct.org/documentation/ide-support/" target="_blank" rel="noreferrer">参考官网在新窗口打开</a>。@pdai</p></blockquote><h4 id="maven支持" tabindex="-1">Maven支持 <a class="header-anchor" href="#maven支持" aria-label="Permalink to &quot;Maven支持&quot;">​</a></h4><ul><li>在IntelliJ 2018.1.1之前, 注意在早期的版本中<code>artifactId</code>还需要加jdk版本，比如<code>mapstruct-jdk8</code>；</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;mapstruct&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;\${org.mapstruct.version}&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>  &lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</span></span>
<span class="line"><span>  &lt;artifactId&gt;mapstruct-processor&lt;/artifactId&gt;</span></span>
<span class="line"><span>  &lt;version&gt;\${org.mapstruct.version}&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li><strong>在IntelliJ 2018.1.1之后</strong>是可以不添加<code>mapstruct-processor</code>的</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;properties&gt;</span></span>
<span class="line"><span>    &lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;</span></span>
<span class="line"><span>    &lt;maven.compiler.source&gt;1.8&lt;/maven.compiler.source&gt;</span></span>
<span class="line"><span>    &lt;maven.compiler.target&gt;1.8&lt;/maven.compiler.target&gt;</span></span>
<span class="line"><span>    &lt;org.mapstruct.version&gt;1.4.0.Beta3&lt;/org.mapstruct.version&gt;</span></span>
<span class="line"><span>&lt;/properties&gt;</span></span>
<span class="line"><span>&lt;dependencies&gt;</span></span>
<span class="line"><span>    &lt;dependency&gt;</span></span>
<span class="line"><span>        &lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</span></span>
<span class="line"><span>        &lt;artifactId&gt;mapstruct&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;version&gt;\${org.mapstruct.version}&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;/dependencies&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;build&gt;</span></span>
<span class="line"><span>    &lt;pluginManagement&gt;</span></span>
<span class="line"><span>        &lt;plugins&gt;</span></span>
<span class="line"><span>            &lt;plugin&gt;</span></span>
<span class="line"><span>                &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span></span>
<span class="line"><span>                &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>                &lt;version&gt;3.8.1&lt;/version&gt;</span></span>
<span class="line"><span>                &lt;configuration&gt;</span></span>
<span class="line"><span>                    &lt;source&gt;1.8&lt;/source&gt;</span></span>
<span class="line"><span>                    &lt;target&gt;1.8&lt;/target&gt;</span></span>
<span class="line"><span>                    &lt;!-- See https://maven.apache.org/plugins/maven-compiler-plugin/compile-mojo.html --&gt;</span></span>
<span class="line"><span>                    &lt;!-- Classpath elements to supply as annotation processor path. If specified, the compiler   --&gt;</span></span>
<span class="line"><span>                    &lt;!-- will detect annotation processors only in those classpath elements. If omitted, the     --&gt;</span></span>
<span class="line"><span>                    &lt;!-- default classpath is used to detect annotation processors. The detection itself depends --&gt;</span></span>
<span class="line"><span>                    &lt;!-- on the configuration of annotationProcessors.                                           --&gt;</span></span>
<span class="line"><span>                    &lt;!--                                                                                         --&gt;</span></span>
<span class="line"><span>                    &lt;!-- According to this documentation, the provided dependency processor is not considered!   --&gt;</span></span>
<span class="line"><span>                    &lt;annotationProcessorPaths&gt;</span></span>
<span class="line"><span>                        &lt;path&gt;</span></span>
<span class="line"><span>                            &lt;groupId&gt;org.mapstruct&lt;/groupId&gt;</span></span>
<span class="line"><span>                            &lt;artifactId&gt;mapstruct-processor&lt;/artifactId&gt;</span></span>
<span class="line"><span>                            &lt;version&gt;\${org.mapstruct.version}&lt;/version&gt;</span></span>
<span class="line"><span>                        &lt;/path&gt;</span></span>
<span class="line"><span>                    &lt;/annotationProcessorPaths&gt;</span></span>
<span class="line"><span>                &lt;/configuration&gt;</span></span>
<span class="line"><span>            &lt;/plugin&gt;</span></span>
<span class="line"><span>        &lt;/plugins&gt;</span></span>
<span class="line"><span>    &lt;/pluginManagement&gt;</span></span>
<span class="line"><span>&lt;/build&gt;</span></span></code></pre></div><h4 id="编辑器支持" tabindex="-1">编辑器支持 <a class="header-anchor" href="#编辑器支持" aria-label="Permalink to &quot;编辑器支持&quot;">​</a></h4><ul><li>编辑器支持：自动补全</li></ul><p><img src="`+o+'" alt="error.图片加载失败"></p><ul><li>编辑器支持：连接跳转</li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><ul><li>编辑器支持：查找使用方式</li></ul><p><img src="'+g+`" alt="error.图片加载失败"></p><h3 id="eclipse-中对mapstruct的支持如何" tabindex="-1">Eclipse 中对MapStruct的支持如何？ <a class="header-anchor" href="#eclipse-中对mapstruct的支持如何" aria-label="Permalink to &quot;Eclipse 中对MapStruct的支持如何？&quot;">​</a></h3><blockquote><p>必须保证你使用的Eclipse中包含<code>m2e-apt</code>插件，且尽可能的升级这个插件到最新的版本，这个插件主要用于自动应用<code>annotation processor</code>相关的配置。</p></blockquote><h4 id="maven支持-1" tabindex="-1">Maven支持 <a class="header-anchor" href="#maven支持-1" aria-label="Permalink to &quot;Maven支持&quot;">​</a></h4><p>同时在pom.xml中推荐你加入如下配置, 原因请看官方给的如下注释:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;properties&gt;</span></span>
<span class="line"><span>    &lt;!-- automatically run annotation processors within the incremental compilation --&gt;</span></span>
<span class="line"><span>    &lt;m2e.apt.activation&gt;jdt_apt&lt;/m2e.apt.activation&gt;</span></span>
<span class="line"><span>&lt;/properties&gt;</span></span></code></pre></div><h3 id="编辑器支持-1" tabindex="-1">编辑器支持 <a class="header-anchor" href="#编辑器支持-1" aria-label="Permalink to &quot;编辑器支持&quot;">​</a></h3><ul><li>自动补全</li></ul><p><img src="`+u+'" alt="error.图片加载失败"></p><ul><li>快速修复</li></ul><p><img src="'+d+'" alt="error.图片加载失败"></p><h3 id="与其它属性拷贝框架性能到底相差多少" tabindex="-1">与其它属性拷贝框架性能到底相差多少？ <a class="header-anchor" href="#与其它属性拷贝框架性能到底相差多少" aria-label="Permalink to &quot;与其它属性拷贝框架性能到底相差多少？&quot;">​</a></h3><blockquote><p>基于我们对它原理的理解，我们知道mapstrcut最后执行时依然是get/set，所以性能是比较高的。同时我们也知道反射优化是可以解决一部分性能问题的，那么通过反射方式进行的属性拷贝和get/set这种性能相差多少呢？</p></blockquote><h4 id="有哪些属性拷贝方式呢" tabindex="-1">有哪些属性拷贝方式呢？ <a class="header-anchor" href="#有哪些属性拷贝方式呢" aria-label="Permalink to &quot;有哪些属性拷贝方式呢？&quot;">​</a></h4><p>综合我们前面的文章，常用的util包中有如下属性拷贝类：</p><ul><li>org.apache.commons.beanutils.PropertyUtils.copyProperties</li><li>org.apache.commons.beanutils.BeanUtils.copyProperties</li><li>org.springframework.beans.BeanUtils.copyProperties</li><li>net.sf.cglib.beans.BeanCopier</li></ul><h4 id="使用属性拷贝和set-get方式性能差异" tabindex="-1">使用属性拷贝和set/get方式性能差异 <a class="header-anchor" href="#使用属性拷贝和set-get方式性能差异" aria-label="Permalink to &quot;使用属性拷贝和set/get方式性能差异&quot;">​</a></h4><ul><li>10000次</li></ul><p><img src="'+h+'" alt="error.图片加载失败"></p><ul><li>1000次</li></ul><p><img src="'+m+'" alt="error.图片加载失败"></p><ul><li>10次</li></ul><p><img src="'+b+'" alt="error.图片加载失败"></p><ul><li><strong>结论</strong><ul><li>property少，写起来也不麻烦，就直接用传统的getter/setter，性能最好</li><li>property多，转换不频繁，那就省点事吧，使用org.apache.commons.beanutils.BeanUtils.copyProperties</li><li>property多，转换很频繁，为性能考虑，使用net.sf.cglib.beans.BeanCopier.BeanCopier，性能近乎getter/setter。但是BeanCopier的创建时消耗较大，所以不要频繁创建该实体，最好的处理方式是静态化或者缓存起来。</li></ul></li></ul><p>更多测试对比可以参考<a href="https://www.cnblogs.com/zhaoyanghoo/p/5722113.html" target="_blank" rel="noreferrer">这里在新窗口打开</a></p><h3 id="和mapstruct类似框架的对比" tabindex="-1">和MapStruct类似框架的对比？ <a class="header-anchor" href="#和mapstruct类似框架的对比" aria-label="Permalink to &quot;和MapStruct类似框架的对比？&quot;">​</a></h3><blockquote><p>我们再看下是否有其它类似的框架呢？这里主要来源<a href="https://www.baeldung.com/java-performance-mapping-frameworks" target="_blank" rel="noreferrer">这篇文章在新窗口打开</a></p></blockquote><h4 id="其它类似方案" tabindex="-1">其它类似方案 <a class="header-anchor" href="#其它类似方案" aria-label="Permalink to &quot;其它类似方案&quot;">​</a></h4><ul><li><strong>Dozer</strong></li></ul><p>Dozer 是一个映射框架，它使用递归将数据从一个对象复制到另一个对象。框架不仅能够在 bean 之间复制属性，还能够在不同类型之间自动转换。</p><p>更多关于 Dozer 的内容可以在官方文档中找到： <a href="http://dozer.sourceforge.net/documentation/gettingstarted.html" target="_blank" rel="noreferrer">http://dozer.sourceforge.net/documentation/gettingstarted.html</a> ，或者你也可以阅读这篇文章：<a href="https://www.baeldung.com/dozer" target="_blank" rel="noreferrer">https://www.baeldung.com/dozer</a> 。</p><ul><li><strong>Orika</strong></li></ul><p>Orika 是一个 bean 到 bean 的映射框架，它递归地将数据从一个对象复制到另一个对象。</p><p>Orika 的工作原理与 Dozer 相似。两者之间的主要区别是 Orika 使用字节码生成。这允许以最小的开销生成更快的映射器。</p><p>更多关于 Orika 的内容可以在官方文档中找到：<a href="https://orika-mapper.github.io/orika-docs/%EF%BC%8C%E6%88%96%E8%80%85%E4%BD%A0%E4%B9%9F%E5%8F%AF%E4%BB%A5%E9%98%85%E8%AF%BB%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0%EF%BC%9Ahttps://www.baeldung.com/orika-mapping%E3%80%82" target="_blank" rel="noreferrer">https://orika-mapper.github.io/orika-docs/，或者你也可以阅读这篇文章：https://www.baeldung.com/orika-mapping。</a></p><ul><li><strong>ModelMapper</strong></li></ul><p>ModelMapper 是一个旨在简化对象映射的框架，它根据约定确定对象之间的映射方式。它提供了类型安全的和重构安全的 API。</p><p>更多关于 ModelMapper 的内容可以在官方文档中找到：<a href="http://modelmapper.org/" target="_blank" rel="noreferrer">http://modelmapper.org/</a> 。</p><ul><li><strong>JMapper</strong></li></ul><p>JMapper 是一个映射框架，旨在提供易于使用的、高性能的 Java bean 之间的映射。该框架旨在使用注释和关系映射应用 DRY 原则。该框架允许不同的配置方式:基于注释、XML 或基于 api。</p><p>更多关于 JMapper 的内容可以在官方文档中找到：<a href="https://github.com/jmapper-framework/jmapper-core/wiki%E3%80%82" target="_blank" rel="noreferrer">https://github.com/jmapper-framework/jmapper-core/wiki。</a></p><h4 id="性能对比" tabindex="-1">性能对比 <a class="header-anchor" href="#性能对比" aria-label="Permalink to &quot;性能对比&quot;">​</a></h4><p>对于性能测试，我们可以使用 Java Microbenchmark Harness，关于如何使用它的更多信息可以在 这篇文章：<a href="https://www.baeldung.com/java-microbenchmark-harness" target="_blank" rel="noreferrer">https://www.baeldung.com/java-microbenchmark-harness</a> 中找到。</p><p>测试结果（某一种）</p><p><img src="'+v+'" alt="error.图片加载失败"></p><p>所有的基准测试都表明，根据场景的不同，MapStruct 和 JMapper 都是不错的选择，尽管 MapStruct 对 SingleShotTime 给出的结果要差得多。</p><h3 id="其它常见问题" tabindex="-1">其它常见问题? <a class="header-anchor" href="#其它常见问题" aria-label="Permalink to &quot;其它常见问题?&quot;">​</a></h3><ul><li><p>当两个对象属性不一致时，比如User对象中某个字段不存在与UserVo当中时，在编译时会有警告提示，可以在@Mapping中配置 ignore = true，当字段较多时，可以直接在@Mapper中设置unmappedTargetPolicy属性或者unmappedSourcePolicy属性为 ReportingPolicy.IGNORE即可。</p></li><li><p>如果项目中也同时使用到了 Lombok，一定要注意 Lombok的版本要等于或者高于1.18.10，否则会有编译不通过的情况发生。</p></li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><p><a href="https://mapstruct.org/documentation/stable/reference/pdf/mapstruct-reference-guide.pdf" target="_blank" rel="noreferrer">官方文档PDF在新窗口打开</a></p></li><li><p><a href="https://mapstruct.org/documentation" target="_blank" rel="noreferrer">https://mapstruct.org/documentation</a></p></li><li><p><a href="https://www.cnblogs.com/zhaoyanghoo/p/5722113.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/zhaoyanghoo/p/5722113.html</a></p></li><li><p><a href="https://www.baeldung.com/java-performance-mapping-frameworks" target="_blank" rel="noreferrer">https://www.baeldung.com/java-performance-mapping-frameworks</a></p></li><li><p><a href="https://www.cnblogs.com/javaguide/p/11861749.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/javaguide/p/11861749.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',162)]))}const w=p(f,[["render",k]]);export{M as __pageData,w as default};
