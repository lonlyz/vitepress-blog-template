import{_ as s,c as a,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/develop/ut/dev-qt-9.png",e="/vitepress-blog-template/images/develop/ut/dev-qt-11.png",o="/vitepress-blog-template/images/develop/ut/dev-qt-12.png",u="/vitepress-blog-template/images/develop/ut/dev-qt-13.png",y=JSON.parse('{"title":"代码质量 - 统一风格：静态样式检查详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/ut/dev-qt-code-style-1.md","filePath":"develop/ut/dev-qt-code-style-1.md","lastUpdated":1737706346000}'),i={name:"develop/ut/dev-qt-code-style-1.md"};function c(q,n,r,m,g,d){return l(),a("div",null,n[0]||(n[0]=[p('<h1 id="代码质量-统一风格-静态样式检查详解" tabindex="-1">代码质量 - 统一风格：静态样式检查详解 <a class="header-anchor" href="#代码质量-统一风格-静态样式检查详解" aria-label="Permalink to &quot;代码质量 - 统一风格：静态样式检查详解&quot;">​</a></h1><blockquote><p>统一样式检查规范里，最为常用的统一样式工具是checkstyle插件，本文将介绍常用的统一风格的措施之<strong>静态样式检查</strong>。@pdai</p></blockquote><h2 id="统一样式检查" tabindex="-1">统一样式检查 <a class="header-anchor" href="#统一样式检查" aria-label="Permalink to &quot;统一样式检查&quot;">​</a></h2><blockquote><p>在标准化的统一样式检查规范里，最为常用的统一样式工具是checkstyle插件，而不是国内阿里的代码规约插件。</p></blockquote><ul><li><strong>下载插件</strong></li></ul><p><img src="'+t+'" alt="error.图片加载失败"></p><ul><li><strong>配置生效</strong></li></ul><p>配置生效及告警设置</p><p><img src="'+e+`" alt="error.图片加载失败"></p><ul><li><strong>配置checkstyle.xml</strong><ul><li>官网地址 <a href="https://checkstyle.sourceforge.io/" target="_blank" rel="noreferrer">https://checkstyle.sourceforge.io/</a></li><li>官网最新Releases <a href="https://github.com/checkstyle/checkstyle/releases/" target="_blank" rel="noreferrer">https://github.com/checkstyle/checkstyle/releases/</a></li><li>下面不是最新的版本，但是提供了中文的解释，可以参考下；实际使用时或者兼容问题请到官网下载最新的规则；</li></ul></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot;?&gt;</span></span>
<span class="line"><span>&lt;!DOCTYPE module PUBLIC</span></span>
<span class="line"><span>    &quot;-//Puppy Crawl//DTD Check Configuration 1.3//EN&quot;</span></span>
<span class="line"><span>    &quot;http://www.puppycrawl.com/dtds/configuration_1_3.dtd&quot;&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>&lt;module name=&quot;Checker&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;module name=&quot;TreeWalker&quot;&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        &lt;!-- =============注释检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!-- 检查类和接口的javadoc 默认不检查author 和version tags         </span></span>
<span class="line"><span>            authorFormat: 检查author标签的格式  </span></span>
<span class="line"><span>            versionFormat: 检查version标签的格式  </span></span>
<span class="line"><span>            scope: 可以检查的类的范围，例如：public只能检查public修饰的类，private可以检查所有的类  </span></span>
<span class="line"><span>            excludeScope: 不能检查的类的范围，例如：public，public的类将不被检查，但访问权限小于public的类仍然会检查，其他的权限以此类推  </span></span>
<span class="line"><span>            tokens: 该属性适用的类型，例如：CLASS_DEF,INTERFACE_DEF --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;JavadocType&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;authorFormat&quot; value=&quot;\\S&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;scope&quot; value=&quot;protected&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;versionFormat&quot; value=&quot;\\$Revision.*\\$&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;excludeScope&quot; value=&quot;public&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;CLASS_DEF,INTERFACE_DEF&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>        &lt;!-- 检查方法的javadoc的注释  </span></span>
<span class="line"><span>            scope: 可以检查的方法的范围，例如：public只能检查public修饰的方法，private可以检查所有的方法  </span></span>
<span class="line"><span>            allowMissingParamTags: 是否忽略对参数注释的检查  </span></span>
<span class="line"><span>            allowMissingThrowsTags: 是否忽略对throws注释的检查  </span></span>
<span class="line"><span>            allowMissingReturnTag: 是否忽略对return注释的检查 --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;JavadocMethod&quot;&gt;    </span></span>
<span class="line"><span>            &lt;property name=&quot;scope&quot; value=&quot;private&quot;/&gt;    </span></span>
<span class="line"><span>            &lt;property name=&quot;allowMissingParamTags&quot; value=&quot;false&quot;/&gt;    </span></span>
<span class="line"><span>            &lt;property name=&quot;allowMissingThrowsTags&quot; value=&quot;false&quot;/&gt;    </span></span>
<span class="line"><span>            &lt;property name=&quot;allowMissingReturnTag&quot; value=&quot;false&quot;/&gt;    </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;METHOD_DEF&quot;/&gt;    </span></span>
<span class="line"><span>            &lt;property name=&quot;allowUndeclaredRTE&quot; value=&quot;true&quot;/&gt;    </span></span>
<span class="line"><span>            &lt;property name=&quot;allowThrowsTagsForSubclasses&quot; value=&quot;true&quot;/&gt;    </span></span>
<span class="line"><span>            &lt;!--允许get set 方法没有注释--&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;allowMissingPropertyJavadoc&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;   </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查变量是否具有Javadoc注释</span></span>
<span class="line"><span>            scope: 检查变量的范围，例如：public只能检查public修饰的变量，private可以检查所有的变量 --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;JavadocVariable&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;scope&quot; value=&quot;private&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============命名检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!-- 检查抽象类的名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义抽象类的命名规则 --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;AbstractClassName&quot;&gt;　　　　　　　</span></span>
<span class="line"><span>　　        &lt;property name=&quot;format&quot; value=&quot;^Abstract.*$|^.*Factory$&quot;/&gt; </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!-- 检查常量（用static final修饰的字段）的名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义全局常量的命名规则 --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;ConstantName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查局部final变量的名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义局部常量的命名规则 --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;LocalFinalVariableName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[A_Z][A-Z0-9]*(_[A_Z0-9]+)*$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查局部变量的名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义局部常量的命名规则 --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;LocalVariableName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[a-z][a-zA-Z0-9]*$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查成员变量（非静态字段）的名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义非静态成员变量的命名规则</span></span>
<span class="line"><span>　　　　    applyToPublic: 是否适用于public的成员变量</span></span>
<span class="line"><span>　　　　    applyToProtected: 是否适用于protected的成员变量</span></span>
<span class="line"><span>　　　　    applyToPackage: 是否适用于package的成员变量</span></span>
<span class="line"><span>　　　　    applyToPrivate: 是否适用于private的成员变量 --&gt;  </span></span>
<span class="line"><span>        &lt;module name=&quot;MemberName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[a-z][a-zA-Z0-9]*$&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;applyToPublic&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;applyToProtected&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;applyToPackage&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;applyToPrivate&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查方法名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义方法名的命名规则 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;MethodName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[a-z][a-zA-Z0-9]*$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查包名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义包名的命名规则 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;PackageName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[a-z]+(\\.[a-z][a-z0-9]*)*$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查参数名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义参数名的命名规则 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;ParameterName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[a-z][a-zA-Z0-9]*$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查静态变量（用static修饰，但没用final修饰的字段）的名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义静态变量的命名规则 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;StaticVariableName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[a-z][a-zA-Z0-9]*$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查类的名称是否遵守命名规约</span></span>
<span class="line"><span>            format: 定义类和接口的命名规则</span></span>
<span class="line"><span>　　　　    tokens: 定义规则适用的类型，例如：CLASS_DEF表示类，INTERFACE_DEF 表示接口 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;TypeName&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;^[A-Z][a-zA-Z0-9]*$&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;CLASS_DEF,INTERFACE_DEF&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============import检查=============--&gt;</span></span>
<span class="line"><span>        &lt;!--　检查没有import语句使用*符号</span></span>
<span class="line"><span>            excludes: 定义可以使用*导入的包 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;AvoidStarImport&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;excludes&quot; value=&quot;java.io,java.util&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查是否导入了指定的非法包 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;IllegalImport&quot;/&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查导入包的顺序/分组</span></span>
<span class="line"><span>            groups: 定义导入包的顺序，默认以字母顺序导入</span></span>
<span class="line"><span>　　　　    ordered: 定义包是否必须按规定的顺序显示</span></span>
<span class="line"><span>　　　　    separated: 定义包与包之间是否应添加空白行</span></span>
<span class="line"><span>　　　　    caseSensitive: 是否区分包名的大小写　--&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;ImportOrder&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;groups&quot; value=&quot;java,javax&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;ordered&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;separated&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;caseSensitive&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查是否存在多余的导入语句 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;RedundantImport&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查未使用的导入语句 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;UnusedImports&quot;/&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============长度检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!--　检查匿名内部类的长度</span></span>
<span class="line"><span>            max: 定义匿名内部类最多容许的行数 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;AnonInnerLength&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;20&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查要执行的语句的数目，将可执行语句的数量限制为一个指定的限值</span></span>
<span class="line"><span>            max: 定义所能容许的语句的最多数目</span></span>
<span class="line"><span>　　　　    tokens: 定义可以检查的类型，例如：CTOR_DEF,METHOD_DEF,STATIC_INIT,INSTANCE_INIT --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;ExecutableStatementCount&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;20&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;CTOR_DEF,METHOD_DEF,STATIC_INIT,INSTANCE_INIT&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查源码文件的长度</span></span>
<span class="line"><span>            max: 定义一个文件所能容许的行数 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;FileLength&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;1000&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查源码每行的长度 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;LineLength&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;80&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;ignorePattern&quot; value=&quot;^ *\\* *[^ ]+$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查方法和构造器的长度</span></span>
<span class="line"><span>            max: 最多容许的行数</span></span>
<span class="line"><span>　　　　    countEmpty: 是否计算空行</span></span>
<span class="line"><span>　　　　    tokens: 定义检查的类型 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;MethodLength&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;100&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;countEmpty&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;METHOD_DEF&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查一个方法或构造器的参数的数量</span></span>
<span class="line"><span>            max: 定义最多有多少个参数</span></span>
<span class="line"><span>　　　　    tokens: 定义检查的类型　 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;ParameterNumber&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;10&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;METHOD_DEF,CTOR_DEF&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============空格检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!--　检查空的for循环初始化语句的填充符</span></span>
<span class="line"><span>            option: 定义初始化语句中是否使用空格，例如：space表示使用空格，则for(int i = 0; i &lt; 100; i++)</span></span>
<span class="line"><span>            就是符合格式要求的，而for(int i=0; i&lt;100;i++)就不符合要求　 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;EmptyForInitializerPad&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;space&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查for iterator语句是否使用空格</span></span>
<span class="line"><span>            option:定义初始化语句是否使用空格，例如：space表示使用空格，则for(Iterator iterator = List.iterator();iterator.hasNext(); iterator.next())就是形式合理的，否则就是形式不合理的 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;EmptyForIteratorPad&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;space&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查指定标记之后没有空格。若要禁用指定标记之后的换行符，将allowLineBreaks属性设为false即可。 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;NoWhitespaceAfter&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查指定标记之前没有空格。若要允许指定标记之前的换行符，将allowLineBreaks属性设为true即可 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;NoWhitespaceBefore&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查代码自动换行时，运算符所处位置的策略</span></span>
<span class="line"><span>            option: 定义运算符的位置，eol在同一行，nl在下一行</span></span>
<span class="line"><span>　　　　    tokens: 定义检查的类型 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;OperatorWrap&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot;   </span></span>
<span class="line"><span>                value=&quot;ASSIGN, DIV, DIV_ASSIGN, PLUS_ASSIGN, MINUS, MINUS_ASSIGN, STAR, STAR_ASSIGN, MOD, MOD_ASSIGN, SR, SR_ASSIGN, BSR, BSR_ASSIGN, SL, SL_ASSIGN, BXOR, BXOR_ASSIGN, BOR, BOR_ASSIGN, BAND, BAND_ASSIGN,PLUS, QUESTION&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;eol&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查方法定义、构造器定义、方法调用、构造器调用的标识符和参数列表的左圆括号之间的填充符</span></span>
<span class="line"><span>            allowLineBreaks: 参数是否允许在不同行</span></span>
<span class="line"><span>　　　　    option: 在参数和括号、参数和标识符之间是否包含空格</span></span>
<span class="line"><span>　　　　    tokens: 检查的类型 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;MethodParamPad&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;allowLineBreaks&quot; value=&quot;false&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;space&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;METHOD_DEF,CTOR_DEF&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查圆括号的填充符策略，也就是在左圆括号之后和右圆括号之前是否需要有一个空格</span></span>
<span class="line"><span>            option: space表示有空格，nospace表示没有空格</span></span>
<span class="line"><span>　　　　    tokens: 定义检查的类型 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;ParenPad&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;nospace&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查类型转换的圆括号的填充符策略。也就是，在左圆括号之后和右圆括号之前是否需要有一个空格</span></span>
<span class="line"><span>            option: space表示有空格，nospace表示没有空格</span></span>
<span class="line"><span>　　　　    tokens: 定义检查的类型 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;TypecastParenPad&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;space&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查源码中没有制表符（&#39;\\t&#39;） --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;TabCharacter&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!--　检查指定标记之后是否紧跟了空格</span></span>
<span class="line"><span>        　    tokens: 检查的类型 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;WhitespaceAfter&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;COMMA,SEMI,TYPECAST&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查指定标记的周围是否有空格</span></span>
<span class="line"><span>            可以选择性地从检查策略中排除，通过设置allowEmptyMethods和allowEmptyConstructors属性即可</span></span>
<span class="line"><span>        　    tokens: 检查的类型 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;WhitespaceAround&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;ASSIGN&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============修饰符检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!--　检查代码中的标识符的顺序是否符合《Java Language Specification》中的第8.1.1、8.3.1章节所建议的顺序</span></span>
<span class="line"><span>            正确的顺序应当如下：</span></span>
<span class="line"><span>　　　　    1. public</span></span>
<span class="line"><span>　　　　    2. protected</span></span>
<span class="line"><span>　　　　    3. private</span></span>
<span class="line"><span>　　　　    4. abstract</span></span>
<span class="line"><span>　　　　    5. static</span></span>
<span class="line"><span>　　　　    6. final</span></span>
<span class="line"><span>　　　　    7. transient</span></span>
<span class="line"><span>　　　　    8. volatile</span></span>
<span class="line"><span>　　　　    9. synchronized</span></span>
<span class="line"><span>　　　　    10. native</span></span>
<span class="line"><span>　　　　    11. strictfp --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;ModifierOrder&quot;/&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　在以下部分检查是否有多余的修饰符：</span></span>
<span class="line"><span>　　　　    1. 接口和注解的定义；</span></span>
<span class="line"><span>　　　　    2. final类的方法的final修饰符；</span></span>
<span class="line"><span>　　　　    3. 被声明为static的内部接口声明</span></span>
<span class="line"><span>　            tokens: 检查的类型 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;RedundantModifier&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;METHOD_DEF,VARIABLE_DEF&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============代码块检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!--　找到嵌套代码块，也就是在代码中无节制使用的代码块</span></span>
<span class="line"><span>            allowInSwitchCase: 定义是否允许switch case中使用嵌套的代码块 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;AvoidNestedBlocks&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;allowInSwitchCase&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查空代码块</span></span>
<span class="line"><span>            option: 定义代码块中应该包含的内容，例如：stmt表示语句</span></span>
<span class="line"><span>　　　　    tokens: 检查的类型 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;EmptyBlock&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;stmt&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查代码块的左花括号的放置位置</span></span>
<span class="line"><span>            option: 定义左大括号&#39;{&#39;显示位置，eol在同一行显示，nl在下一行显示</span></span>
<span class="line"><span>　　　　    maxLineLength: 大括号&#39;{&#39;所在行行最多容纳的字符数</span></span>
<span class="line"><span>　　　　    tokens: 该属性适用的类型，例：CLASS_DEF,INTERFACE_DEF,METHOD_DEF,CTOR_DEF --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;LeftCurly&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;eol&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;maxLineLength&quot; value=&quot;80&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;CLASS_DEF,INTERFACE_DEF,METHOD_DEF,CTOR_DEF&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查代码块周围是否有大括号，可以检查do、else、if、for、while等关键字所控制的代码块</span></span>
<span class="line"><span>            tokens: 定义检查的类型 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;NeedBraces&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &lt;!--　检查else、try、catch标记的代码块的右花括号的放置位置</span></span>
<span class="line"><span>            tokens: 定义检查的类型 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;RightCurly&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;option&quot; value=&quot;alone&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;tokens&quot; value=&quot;LITERAL_TRY&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============编码检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!--　检查是否在同一行初始化， 例如：private int Age = nGe==1 ? 100 : 0; 就应该避免 --&gt; </span></span>
<span class="line"><span>        &lt;module name=&quot;AvoidInlineConditionals&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查定义了共变equals()方法的类中是否同样覆盖了equals(java.lang.Object)方法 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;CovariantEquals&quot;/&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查switch语句中的default是否在所有的case分支之后 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;DefaultComesLast&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查空的代码段 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;EmptyStatement&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查覆盖了equals()方法的类是否也覆盖了hashCode()方法 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;EqualsHashCode&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查类或对象的成员是否显式地初始化为成员所属类型的默认值</span></span>
<span class="line"><span>        （对象引用的默认值为null，数值和字符类型的默认值为0，布尔类型的默认值为false） --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;ExplicitInitialization&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查switch语句中是否存在跨越分支。</span></span>
<span class="line"><span>        如果一个case分支的代码中缺少break、return、throw或continue语句，那么就会导致跨越分支 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;FallThrough&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查变量值没有改动的情况下，该变量是否定义成了final --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;FinalLocalVariable&quot;/&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查局部变量或参数是否会遮蔽在相同类中定义的字段 --&gt;</span></span>
<span class="line"><span>         &lt;module name=&quot;HiddenField&quot;/&gt;</span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>        &lt;!--　检查是否有不合法的实例化操作，是否使用工厂方法更好 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;IllegalInstantiation&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　非法异常捕捉,不允许捕捉java.lang.Exception、java.lang.Error、java.lang.RuntimeException的行为 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;IllegalCatch&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查子表达式中是否有赋值操作 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;InnerAssignment&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查是否有&quot;魔术&quot;数字 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;MagicNumber&quot;&gt;</span></span>
<span class="line"><span>           &lt;property name=&quot;ignoreNumbers&quot; value=&quot;0, 1&quot;/&gt;</span></span>
<span class="line"><span>           &lt;property name=&quot;ignoreAnnotation&quot; value=&quot;true&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查switch语句是否含有default子句 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;MissingSwitchDefault&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查循环控制变量是否被修改 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;ModifiedControlVariable&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查一个字符串变量在不改变变量值的情况下或者字符串出现的次数</span></span>
<span class="line"><span>            allowedDuplicates: 定义在类中一个字符串变量在不改变变量值的情况下或者字符串所能使用的最多次数 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;MultipleStringLiterals&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;allowedDuplicates&quot; value=&quot;3&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查一次声明多个变量时，变量是否在同一行或者在同一个语句中 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;MultipleVariableDeclarations&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　限制if-else代码块的嵌套层数（默认值为1）--&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;NestedIfDepth&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;1&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　限制try代码块的嵌套层数（默认值为1）--&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;NestedTryDepth&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;3&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 确保一个类具有一个包声明，并且（可选地）包名要与源代码文件所在的目录名相匹配 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;PackageDeclaration&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 不允许对参数进行赋值 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;ParameterAssignment&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查throws子句中是否声明了多余的异常 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;RedundantThrows&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;allowUnchecked&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;allowSubclasses&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查是否使用了this --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;RequireThis&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;checkFields&quot; value=&quot;false&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;checkMethods&quot; value=&quot;false&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 禁止使用System.out.println --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;Regexp&quot;&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;format&quot; value=&quot;System\\.out\\.println&quot;/&gt;</span></span>
<span class="line"><span>            &lt;property name=&quot;illegalPattern&quot; value=&quot;true&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 限制return语句的数量。默认值为2。可以忽略检查指定的方法（默认忽略equals()方法 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;ReturnCount&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;3&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查是否有过于复杂的布尔表达式。现在能够发现诸如if (b == true)、b || true、!false等类型的代码 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;SimplifyBooleanExpression&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查是否有过于复杂的布尔类型return语句 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;SimplifyBooleanReturn&quot;/&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查在判断字符串是否相等时是否使用了正确的形式 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;StringLiteralEquality&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查一个覆盖的clone()方法是否调用了super.clone()方法 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;SuperClone&quot;/&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查一个覆盖的finalize()方法是否调用了super.finalize()方法 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;SuperFinalize&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查初始化数祖时，最后一个元素后面是否加了逗号，如果左右大括号都在同一行，则可以不加逗号 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;ArrayTrailingComma&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查代码中是否使用了不必要的圆括号 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;UnnecessaryParentheses&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============类设计检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!-- 检查类是否被设计为可扩展的，如果是，则方法应该abstract、final或者是空的 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;DesignForExtension&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查一个只有私有构造器的类是否被声明为final --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;FinalClass&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 确保工具类（在API中只有静态方法和字段的类）没有任何公有构造器 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;HideUtilityClassConstructor&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查接口是否只定义了变量而没有定义方法，因为接口应该用来描述一个类型，所以只定义变量而不定义方法是不恰当的</span></span>
<span class="line"><span>            allowMarkerInterfaces: 是否检查空接口 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;InterfaceIsType&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;allowMarkerInterfaces&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　将异常抛出语句的数量配置为一个指定的限值（默认值为1）--&gt;</span></span>
<span class="line"><span>         &lt;module name=&quot;ThrowsCount&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;7&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!--　检查类成员的可见性。</span></span>
<span class="line"><span>            只有static final的类成员可以是公有的，其他的类成员必须是私有的，除非设置了protectedAllowed属性或packageAllowed属性</span></span>
<span class="line"><span>            packageAllowed: 变量包内成员可以访问</span></span>
<span class="line"><span>            protectedAllowed: 变量是受保护的</span></span>
<span class="line"><span>            publicMemberPattern: 可以公开访问的变量所匹配的命名形式 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;VisibilityModifier&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;packageAllowed&quot; value=&quot;false&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;protectedAllowed&quot; value=&quot;false&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;publicMemberPattern&quot; value=&quot;^seriaVersionUID$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============重复检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!-- 逐行地比较所有的代码行，如果有若干行只有缩进有所不同，那么就报告存在重复代码</span></span>
<span class="line"><span>            min: 允许代码重复的最小行数</span></span>
<span class="line"><span>            charset: 文件所用的字符集 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;StrictDuplicateCode&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;min&quot; value=&quot;7&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;charset&quot; value=&quot;UTF-8&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt; </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============度量检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!-- 限制一个表达式中的&amp;&amp;、||、&amp;、|、^等逻辑运算符的数量</span></span>
<span class="line"><span>            max: 布尔运算符在一条语句中允许出现的最大数目 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;BooleanExpressionComplexity&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;7&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 测量给定类中的其他类的实例化操作的次数 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;ClassDataAbstractionCoupling&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;max&quot; value=&quot;7&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查循环复杂度是否超出了指定的限值。</span></span>
<span class="line"><span>        该复杂度由构造器、方法、静态初始化程序、</span></span>
<span class="line"><span>        实例初始化程序中的if、while、do、for、?:、catch、switch、case等语句，以及&amp;&amp;和||运算符的数量所测量 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;CyclomaticComplexity&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;severity&quot; value=&quot;ignore&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- =============杂项检查============= --&gt;</span></span>
<span class="line"><span>        &lt;!-- 检查数组定义的风格。有的开发者使用Java风格：public static void main(String[] args)；有的开发者使用C风格：public static void main(String args[]) --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;ArrayTypeStyle&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;javaStyle&quot; value=&quot;true&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查方法/构造器的参数是否是final的。这项检查会忽略接口方法的检查 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;FinalParameters&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查Java代码的缩进是否正确</span></span>
<span class="line"><span>            basicOffset: 定义代码体相对于所属的代码体的缩进量</span></span>
<span class="line"><span>　　　　    braceAdjustment: 定义括号的缩进量</span></span>
<span class="line"><span>　　　　    caseIndent: 定义case的缩进量 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;Indentation&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;basicOffset&quot; value=&quot;4&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;braceAdjustment&quot; value=&quot;0&quot;/&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;caseIndent&quot; value=&quot;4&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查文件是否以新行结束 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;NewlineAtEndOfFile&quot;/&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 这是一项FileSetCheck检查，通过检查关键字的一致性属性文件，它可以确保代码的语言转换的正确性 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;Translation&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;severity&quot; value=&quot;info&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查源码中是否有未注释的main()方法（调试的残留物）</span></span>
<span class="line"><span>            excludedClasses: 定义可以带main方法的类所匹配的名字形式 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;UncommentedMain&quot;&gt;  </span></span>
<span class="line"><span>            &lt;property name=&quot;excludedClasses&quot; value=&quot;^$&quot;/&gt;  </span></span>
<span class="line"><span>        &lt;/module&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;!-- 检查long类型的常量在定义时是否由大写的“L”开头 --&gt;</span></span>
<span class="line"><span>        &lt;module name=&quot;UpperEll&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/module&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/module&gt;</span></span></code></pre></div><p>首先在本地新建一个XML文件，将上面的代码保存到XML文件中，打开Settings-&gt;Tools-&gt;CheckStyle</p><p><img src="`+o+'" alt="error.图片加载失败"></p><ul><li><strong>测试配置的CheckStyle</strong></li></ul><p><img src="'+u+'" alt="error.图片加载失败"></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',16)]))}const h=s(i,[["render",c]]);export{y as __pageData,h as default};
