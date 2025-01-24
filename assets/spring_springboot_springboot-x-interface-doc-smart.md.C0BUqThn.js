import{_ as a,c as n,ai as t,o as e}from"./chunks/framework.BrYByd3F.js";const o="/vitepress-blog-template/images/spring/springboot/springboot-api-smart-doc-1.png",p="/vitepress-blog-template/images/spring/springboot/springboot-api-smart-doc-2.png",l="/vitepress-blog-template/images/spring/springboot/springboot-api-smart-doc-3.png",c="/vitepress-blog-template/images/spring/springboot/springboot-api-smart-doc-4.png",i="/vitepress-blog-template/images/spring/springboot/springboot-api-smart-doc-6.png",v=JSON.parse('{"title":"SpringBoot接口 - 如何生成接口文档之集成Smart-Doc","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-doc-smart.md","filePath":"spring/springboot/springboot-x-interface-doc-smart.md","lastUpdated":1737706346000}'),d={name:"spring/springboot/springboot-x-interface-doc-smart.md"};function r(u,s,g,m,q,h){return e(),n("div",null,s[0]||(s[0]=[t(`<h1 id="springboot接口-如何生成接口文档之集成smart-doc" tabindex="-1">SpringBoot接口 - 如何生成接口文档之集成Smart-Doc <a class="header-anchor" href="#springboot接口-如何生成接口文档之集成smart-doc" aria-label="Permalink to &quot;SpringBoot接口 - 如何生成接口文档之集成Smart-Doc&quot;">​</a></h1><blockquote><p>上文我们看到可以通过Swagger系列可以快速生成API文档， 但是这种API文档生成是需要在接口上添加注解等，这表明这是一种侵入式方式； 那么有没有非侵入式方式呢, 比如通过注释生成文档？ 本文主要介绍非侵入式的方式及集成Smart-doc案例。我们构建知识体系时使用Smart-doc这类工具并不是目标，而是<strong>要了解非侵入方式能做到什么程度和技术思路</strong>, 最后<strong>平衡</strong>下来多数情况下多数人还是会选择Swagger+openapi技术栈的。 @pdai</p></blockquote><h2 id="准备知识点" tabindex="-1">准备知识点 <a class="header-anchor" href="#准备知识点" aria-label="Permalink to &quot;准备知识点&quot;">​</a></h2><blockquote><p>需要了解Swagger侵入性和依赖性， 以及Smart-Doc这类工具如何解决这些问题, 部分内容来自<a href="https://gitee.com/smart-doc-team/smart-doc" target="_blank" rel="noreferrer">官方网站在新窗口打开</a>。@pdai</p></blockquote><h3 id="为什么会产生smart-doc这类工具" tabindex="-1">为什么会产生Smart-Doc这类工具？ <a class="header-anchor" href="#为什么会产生smart-doc这类工具" aria-label="Permalink to &quot;为什么会产生Smart-Doc这类工具？&quot;">​</a></h3><blockquote><p>既然有了Swagger， 为何还会产生Smart-Doc这类工具呢？ 本质上是Swagger侵入性和依赖性。</p></blockquote><p>我们来看下目前主流的技术文档工具存在什么问题：</p><ol><li><strong>侵入性强</strong>，需要编写大量注解，代表工具如：swagger，还有一些公司自研的文档工具</li><li><strong>强依赖性</strong>，如果项目不想使用该工具，业务代码无法编译通过。</li><li>代码解析能力弱，使用文档不齐全，主要代表为国内众多开源的相关工具。</li><li>众多基于注释分析的工具无法解析jar包里面的注释(sources jar包)，需要人工配置源码路径，无法满足DevOps构建场景。</li><li>部分工具无法支持多模块复杂项目代码分析。</li></ol><h3 id="什么是smart-doc-有哪些特性" tabindex="-1">什么是Smart-Doc？有哪些特性？ <a class="header-anchor" href="#什么是smart-doc-有哪些特性" aria-label="Permalink to &quot;什么是Smart-Doc？有哪些特性？&quot;">​</a></h3><blockquote><p>smart-doc是一款同时支持JAVA REST API和Apache Dubbo RPC接口文档生成的工具，smart-doc在业内率先提出<strong>基于JAVA泛型定义推导</strong>的理念， 完全基于接口源码来分析生成接口文档，不采用任何注解侵入到业务代码中。你只需要<strong>按照java-doc标准</strong>编写注释， smart-doc就能帮你生成一个简易明了的Markdown、HTML5、Postman Collection2.0+、OpenAPI 3.0+的文档。</p></blockquote><ul><li>零注解、零学习成本、只需要写标准JAVA注释。</li><li>基于源代码接口定义自动推导，强大的返回结构推导。</li><li>支持Spring MVC、Spring Boot、Spring Boot Web Flux(controller书写方式)、Feign。</li><li>支持Callable、Future、CompletableFuture等异步接口返回的推导。</li><li>支持JavaBean上的JSR303参数校验规范，包括分组验证。</li><li>对JSON请求参数的接口能够自动生成模拟JSON参数。</li><li>对一些常用字段定义能够生成有效的模拟值。</li><li>支持生成JSON返回值示例。</li><li>支持从项目外部加载源代码来生成字段注释(包括标准规范发布的jar包)。</li><li>支持生成多种格式文档：Markdown、HTML5、Asciidoctor、Postman Collection、OpenAPI 3.0。 Up- 开放文档数据，可自由实现接入文档管理系统。</li><li>支持导出错误码和定义在代码中的各种字典码到接口文档。</li><li>支持Maven、Gradle插件式轻松集成。</li><li>支持Apache Dubbo RPC接口文档生成。</li><li>debug接口调试html5页面完全支持文件上传，下载(@download tag标记下载方法)测试。</li></ul><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>从smart-doc 1.7.9开始官方提供了Maven插件，可以通过在项目中集成smart-doc的Maven插件，然后运行插件直接生成文档。 我们的案例基于smart-doc-maven-plugin，生成文档。示例参考官方<a href="https://smart-doc-group.github.io/#/zh-cn/plugins/maven_plugin" target="_blank" rel="noreferrer">配置文档在新窗口打开</a>而写。</p></blockquote><h3 id="配置" tabindex="-1">配置 <a class="header-anchor" href="#配置" aria-label="Permalink to &quot;配置&quot;">​</a></h3><p>添加maven的插件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;build&gt;</span></span>
<span class="line"><span>    &lt;plugins&gt;</span></span>
<span class="line"><span>        &lt;plugin&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>        &lt;/plugin&gt;</span></span>
<span class="line"><span>        &lt;plugin&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;com.github.shalousun&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;smart-doc-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;2.4.8&lt;/version&gt;</span></span>
<span class="line"><span>            &lt;configuration&gt;</span></span>
<span class="line"><span>                &lt;!--指定生成文档的使用的配置文件,配置文件放在自己的项目中--&gt;</span></span>
<span class="line"><span>                &lt;configFile&gt;./src/main/resources/smart-doc.json&lt;/configFile&gt;</span></span>
<span class="line"><span>                &lt;!--指定项目名称，推荐使用动态参数，例如\${project.description}--&gt;</span></span>
<span class="line"><span>                &lt;!--如果smart-doc.json中和此处都未设置projectName，2.3.4开始，插件自动采用pom中的projectName作为设置--&gt;</span></span>
<span class="line"><span>                &lt;!--&lt;projectName&gt;\${project.description}&lt;/projectName&gt;--&gt;</span></span>
<span class="line"><span>                &lt;!--smart-doc实现自动分析依赖树加载第三方依赖的源码，如果一些框架依赖库加载不到导致报错，这时请使用excludes排除掉--&gt;</span></span>
<span class="line"><span>                &lt;excludes&gt;</span></span>
<span class="line"><span>                    &lt;!--格式为：groupId:artifactId;参考如下--&gt;</span></span>
<span class="line"><span>                    &lt;!--也可以支持正则式如：com.alibaba:.* --&gt;</span></span>
<span class="line"><span>                    &lt;exclude&gt;com.alibaba:fastjson&lt;/exclude&gt;</span></span>
<span class="line"><span>                &lt;/excludes&gt;</span></span>
<span class="line"><span>                &lt;!--includes配置用于配置加载外部依赖源码,配置后插件会按照配置项加载外部源代码而不是自动加载所有，因此使用时需要注意--&gt;</span></span>
<span class="line"><span>                &lt;!--smart-doc能自动分析依赖树加载所有依赖源码，原则上会影响文档构建效率，因此你可以使用includes来让插件加载你配置的组件--&gt;</span></span>
<span class="line"><span>                &lt;includes&gt;</span></span>
<span class="line"><span>                    &lt;!--格式为：groupId:artifactId;参考如下--&gt;</span></span>
<span class="line"><span>                    &lt;!--也可以支持正则式如：com.alibaba:.* --&gt;</span></span>
<span class="line"><span>                    &lt;include&gt;com.alibaba:fastjson&lt;/include&gt;</span></span>
<span class="line"><span>                &lt;/includes&gt;</span></span>
<span class="line"><span>            &lt;/configuration&gt;</span></span>
<span class="line"><span>            &lt;executions&gt;</span></span>
<span class="line"><span>                &lt;execution&gt;</span></span>
<span class="line"><span>                    &lt;!--如果不需要在执行编译时启动smart-doc，则将phase注释掉--&gt;</span></span>
<span class="line"><span>                    &lt;phase&gt;compile&lt;/phase&gt;</span></span>
<span class="line"><span>                    &lt;goals&gt;</span></span>
<span class="line"><span>                        &lt;!--smart-doc提供了html、openapi、markdown等goal，可按需配置--&gt;</span></span>
<span class="line"><span>                        &lt;goal&gt;html&lt;/goal&gt;</span></span>
<span class="line"><span>                    &lt;/goals&gt;</span></span>
<span class="line"><span>                &lt;/execution&gt;</span></span>
<span class="line"><span>            &lt;/executions&gt;</span></span>
<span class="line"><span>        &lt;/plugin&gt;</span></span>
<span class="line"><span>    &lt;/plugins&gt;</span></span>
<span class="line"><span>&lt;/build&gt;</span></span></code></pre></div><p>其中./src/main/resources/smart-doc.json是配置文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;serverUrl&quot;: &quot;http://127.0.0.1&quot;, //服务器地址,非必须。导出postman建议设置成http://{{server}}方便直接在postman直接设置环境变量</span></span>
<span class="line"><span>  &quot;pathPrefix&quot;: &quot;&quot;, //设置path前缀,非必须。如配置Servlet ContextPath 。@since 2.2.3</span></span>
<span class="line"><span>  &quot;isStrict&quot;: false, //是否开启严格模式</span></span>
<span class="line"><span>  &quot;allInOne&quot;: true,  //是否将文档合并到一个文件中，一般推荐为true</span></span>
<span class="line"><span>  &quot;outPath&quot;: &quot;D://md2&quot;, //指定文档的输出路径</span></span>
<span class="line"><span>  &quot;coverOld&quot;: true,  //是否覆盖旧的文件，主要用于markdown文件覆盖</span></span>
<span class="line"><span>  &quot;createDebugPage&quot;: true,//@since 2.0.0 smart-doc支持创建可以测试的html页面，仅在AllInOne模式中起作用。</span></span>
<span class="line"><span>  &quot;packageFilters&quot;: &quot;&quot;,//controller包过滤，多个包用英文逗号隔开，2.2.2开始需要采用正则：com.test.controller.*</span></span>
<span class="line"><span>  &quot;md5EncryptedHtmlName&quot;: false,//只有每个controller生成一个html文件时才使用</span></span>
<span class="line"><span>  &quot;style&quot;:&quot;xt256&quot;, //基于highlight.js的代码高设置,可选值很多可查看码云wiki，喜欢配色统一简洁的同学可以不设置</span></span>
<span class="line"><span>  &quot;projectName&quot;: &quot;pdai-springboot-demo-smart-doc&quot;,//配置自己的项目名称，不设置则插件自动获取pom中的projectName</span></span>
<span class="line"><span>  &quot;skipTransientField&quot;: true,//目前未实现</span></span>
<span class="line"><span>  &quot;sortByTitle&quot;:false,//接口标题排序，默认为false,@since 1.8.7版本开始</span></span>
<span class="line"><span>  &quot;showAuthor&quot;:true,//是否显示接口作者名称，默认是true,不想显示可关闭</span></span>
<span class="line"><span>  &quot;requestFieldToUnderline&quot;:true,//自动将驼峰入参字段在文档中转为下划线格式,//@since 1.8.7版本开始</span></span>
<span class="line"><span>  &quot;responseFieldToUnderline&quot;:true,//自动将驼峰入参字段在文档中转为下划线格式,//@since 1.8.7版本开始</span></span>
<span class="line"><span>  &quot;inlineEnum&quot;:true,//设置为true会将枚举详情展示到参数表中，默认关闭，//@since 1.8.8版本开始</span></span>
<span class="line"><span>  &quot;recursionLimit&quot;:7,//设置允许递归执行的次数用于避免一些对象解析卡主，默认是7，正常为3次以内，//@since 1.8.8版本开始</span></span>
<span class="line"><span>  &quot;allInOneDocFileName&quot;:&quot;index.html&quot;,//自定义设置输出文档名称, @since 1.9.0</span></span>
<span class="line"><span>  &quot;requestExample&quot;:&quot;true&quot;,//是否将请求示例展示在文档中，默认true，@since 1.9.0</span></span>
<span class="line"><span>  &quot;responseExample&quot;:&quot;true&quot;,//是否将响应示例展示在文档中，默认为true，@since 1.9.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &quot;ignoreRequestParams&quot;:[ //忽略请求参数对象，把不想生成文档的参数对象屏蔽掉，@since 1.9.2</span></span>
<span class="line"><span>    &quot;org.springframework.ui.ModelMap&quot;</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  &quot;dataDictionaries&quot;: [{ //配置数据字典，没有需求可以不设置</span></span>
<span class="line"><span>    &quot;title&quot;: &quot;http状态码字典&quot;, //数据字典的名称</span></span>
<span class="line"><span>    &quot;enumClassName&quot;: &quot;tech.pdai.springboot.smartdoc.constant.ResponseStatus&quot;, //数据字典枚举类名称</span></span>
<span class="line"><span>    &quot;codeField&quot;: &quot;responseCode&quot;,//数据字典字典码对应的字段名称</span></span>
<span class="line"><span>    &quot;descField&quot;: &quot;description&quot;//数据字典对象的描述信息字典</span></span>
<span class="line"><span>  }],</span></span>
<span class="line"><span>  &quot;errorCodeDictionaries&quot;: [{ //错误码列表，没有需求可以不设置</span></span>
<span class="line"><span>    &quot;title&quot;: &quot;title&quot;,</span></span>
<span class="line"><span>    &quot;enumClassName&quot;: &quot;tech.pdai.springboot.smartdoc.constant.ResponseStatus&quot;, //错误码枚举类</span></span>
<span class="line"><span>    &quot;codeField&quot;: &quot;responseCode&quot;,//错误码的code码字段名称</span></span>
<span class="line"><span>    &quot;descField&quot;: &quot;description&quot;//错误码的描述信息对应的字段名</span></span>
<span class="line"><span>  }],</span></span>
<span class="line"><span>  &quot;revisionLogs&quot;: [{ //文档变更记录，非必须</span></span>
<span class="line"><span>    &quot;version&quot;: &quot;1.1&quot;, //文档版本号</span></span>
<span class="line"><span>    &quot;revisionTime&quot;: &quot;2022-07-01 22:12:01&quot;, //文档修订时间</span></span>
<span class="line"><span>    &quot;status&quot;: &quot;update&quot;, //变更操作状态，一般为：创建、更新等</span></span>
<span class="line"><span>    &quot;author&quot;: &quot;pdai&quot;, //文档变更作者</span></span>
<span class="line"><span>    &quot;remarks&quot;: &quot;init user api&quot; //变更描述</span></span>
<span class="line"><span>  },{ //文档变更记录，非必须</span></span>
<span class="line"><span>    &quot;version&quot;: &quot;1.2&quot;, //文档版本号</span></span>
<span class="line"><span>    &quot;revisionTime&quot;: &quot;2022-07-01 22:12:02&quot;, //文档修订时间</span></span>
<span class="line"><span>    &quot;status&quot;: &quot;update&quot;, //变更操作状态，一般为：创建、更新等</span></span>
<span class="line"><span>    &quot;author&quot;: &quot;pdai&quot;, //文档变更作者</span></span>
<span class="line"><span>    &quot;remarks&quot;: &quot;add address api&quot; //变更描述</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  &quot;customResponseFields&quot;: [{ //自定义添加字段和注释，一般用户处理第三方jar包库，非必须</span></span>
<span class="line"><span>    &quot;name&quot;: &quot;code&quot;,//覆盖响应码字段</span></span>
<span class="line"><span>    &quot;desc&quot;: &quot;响应代码&quot;,//覆盖响应码的字段注释</span></span>
<span class="line"><span>    &quot;ownerClassName&quot;: &quot;org.springframework.data.domain.Pageable&quot;, //指定你要添加注释的类名</span></span>
<span class="line"><span>    &quot;ignore&quot;:true, //设置true会被自动忽略掉不会出现在文档中</span></span>
<span class="line"><span>    &quot;value&quot;: &quot;00000&quot;//设置响应码的值</span></span>
<span class="line"><span>  }],</span></span>
<span class="line"><span>  &quot;requestHeaders&quot;: [{ //设置请求头，没有需求可以不设置</span></span>
<span class="line"><span>    &quot;name&quot;: &quot;token&quot;,//请求头名称</span></span>
<span class="line"><span>    &quot;type&quot;: &quot;string&quot;,//请求头类型</span></span>
<span class="line"><span>    &quot;desc&quot;: &quot;desc&quot;,//请求头描述信息</span></span>
<span class="line"><span>    &quot;value&quot;:&quot;token请求头的值&quot;,//不设置默认null</span></span>
<span class="line"><span>    &quot;required&quot;: false,//是否必须</span></span>
<span class="line"><span>    &quot;since&quot;: &quot;-&quot;,//什么版本添加的改请求头</span></span>
<span class="line"><span>    &quot;pathPatterns&quot;: &quot;/app/test/**&quot;,//请看https://gitee.com/smart-doc-team/smart-doc/wikis/请求头高级配置?sort_id=4178978</span></span>
<span class="line"><span>    &quot;excludePathPatterns&quot;:&quot;/app/page/**&quot;//请看https://gitee.com/smart-doc-team/smart-doc/wikis/请求头高级配置?sort_id=4178978</span></span>
<span class="line"><span>  },{</span></span>
<span class="line"><span>    &quot;name&quot;: &quot;appkey&quot;,//请求头</span></span>
<span class="line"><span>    &quot;type&quot;: &quot;string&quot;,//请求头类型</span></span>
<span class="line"><span>    &quot;desc&quot;: &quot;desc&quot;,//请求头描述信息</span></span>
<span class="line"><span>    &quot;value&quot;:&quot;appkey请求头的值&quot;,//不设置默认null</span></span>
<span class="line"><span>    &quot;required&quot;: false,//是否必须</span></span>
<span class="line"><span>    &quot;pathPatterns&quot;: &quot;/test/add,/testConstants/1.0&quot;,//正则表达式过滤请求头,url匹配上才会添加该请求头，多个正则用分号隔开</span></span>
<span class="line"><span>    &quot;since&quot;: &quot;-&quot;//什么版本添加的改请求头</span></span>
<span class="line"><span>  }],</span></span>
<span class="line"><span>  &quot;requestParams&quot;: [ //设置公共参数，没有需求可以不设置</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;configPathParam&quot;,//请求名称</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;string&quot;,//请求类型</span></span>
<span class="line"><span>      &quot;desc&quot;: &quot;desc&quot;,//请求描述信息</span></span>
<span class="line"><span>      &quot;paramIn&quot;: &quot;path&quot;, // 参数所在位置 header-请求头, path-路径参数, query-参数</span></span>
<span class="line"><span>      &quot;value&quot;:&quot;testPath&quot;,//不设置默认null</span></span>
<span class="line"><span>      &quot;required&quot;: false,//是否必须</span></span>
<span class="line"><span>      &quot;since&quot;: &quot;2.2.3&quot;,//什么版本添加的该请求</span></span>
<span class="line"><span>      &quot;pathPatterns&quot;: &quot;/app/test/**&quot;,//请看https://gitee.com/smart-doc-team/smart-doc/wikis/请求高级配置?sort_id=4178978</span></span>
<span class="line"><span>      &quot;excludePathPatterns&quot;:&quot;/app/page/**&quot;//请看https://gitee.com/smart-doc-team/smart-doc/wikis/请求高级配置?sort_id=4178978</span></span>
<span class="line"><span>    }],</span></span>
<span class="line"><span>  &quot;responseBodyAdvice&quot;:{ //自smart-doc 1.9.8起，非必须项，ResponseBodyAdvice统一返回设置(不要随便配置根据项目的技术来配置)，可用ignoreResponseBodyAdvice tag来忽略</span></span>
<span class="line"><span>    &quot;className&quot;:&quot;tech.pdai.springboot.smartdoc.entity.ResponseResult&quot; //通用响应体</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="运行测试" tabindex="-1">运行测试 <a class="header-anchor" href="#运行测试" aria-label="Permalink to &quot;运行测试&quot;">​</a></h3><p>可以通过Maven命令生成文档</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//生成html</span></span>
<span class="line"><span>mvn -Dfile.encoding=UTF-8 smart-doc:html</span></span></code></pre></div><p>在IDEA中，也可以通过maven插件构建</p><p><img src="`+o+`" alt="error.图片加载失败"></p><p>maven构建日志如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[INFO] Scanning for projects...</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --------------&lt; tech.pdai:115-springboot-demo-smart-doc &gt;---------------</span></span>
<span class="line"><span>[INFO] Building 115-springboot-demo-smart-doc 1.0-SNAPSHOT</span></span>
<span class="line"><span>[INFO] --------------------------------[ jar ]---------------------------------</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] &gt;&gt;&gt; smart-doc-maven-plugin:2.4.8:html (default-cli) &gt; compile @ 115-springboot-demo-smart-doc &gt;&gt;&gt;</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-resources-plugin:3.2.0:resources (default-resources) @ 115-springboot-demo-smart-doc ---</span></span>
<span class="line"><span>[INFO] Using &#39;UTF-8&#39; encoding to copy filtered resources.</span></span>
<span class="line"><span>[INFO] Using &#39;UTF-8&#39; encoding to copy filtered properties files.</span></span>
<span class="line"><span>[INFO] Copying 0 resource</span></span>
<span class="line"><span>[INFO] Copying 1 resource</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-compiler-plugin:3.8.1:compile (default-compile) @ 115-springboot-demo-smart-doc ---</span></span>
<span class="line"><span>[INFO] Nothing to compile - all classes are up to date</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] &lt;&lt;&lt; smart-doc-maven-plugin:2.4.8:html (default-cli) &lt; compile @ 115-springboot-demo-smart-doc &lt;&lt;&lt;</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- smart-doc-maven-plugin:2.4.8:html (default-cli) @ 115-springboot-demo-smart-doc ---</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Smart-doc Start preparing sources at: 2022-07-01 22:43:54</span></span>
<span class="line"><span>[INFO] Artifacts that the current project depends on: [&quot;org.springframework.boot:spring-boot-starter-web&quot;,&quot;org.springframework.boot:spring-boot-configuration-processor&quot;,&quot;org.projectlombok:lombok&quot;]</span></span>
<span class="line"><span>[INFO] Smart-doc has loaded the source code path: [{&quot;path&quot;:&quot;D:/git/tech-pdai-spring-demos/115-springboot-demo-smart-doc/src/main/java&quot;}]</span></span>
<span class="line"><span>[INFO] Smart-doc Starting Create API Documentation at: 2022-07-01 22:43:54</span></span>
<span class="line"><span>[INFO] API documentation is output to =&gt; D://md2</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] BUILD SUCCESS</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Total time:  2.196 s</span></span>
<span class="line"><span>[INFO] Finished at: 2022-07-01T22:43:55+08:00</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span></code></pre></div><p>构建后的html如下：</p><p><img src="`+p+'" alt="error.图片加载失败"></p><p>也可以看到还自动提供了mock的数据，以及测试接口的按钮。还包含自定义的返回枚举类型等。</p><p><img src="'+l+`" alt="error.图片加载失败"></p><p>展示效果，可以参看<a href="https://api.doubans.com/" target="_blank" rel="noreferrer">https://api.doubans.com/在新窗口打开</a></p><h3 id="生成更多类型的文档" tabindex="-1">生成更多类型的文档 <a class="header-anchor" href="#生成更多类型的文档" aria-label="Permalink to &quot;生成更多类型的文档&quot;">​</a></h3><p>smart-doc 还支持生成如下类型的文档：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//生成markdown</span></span>
<span class="line"><span>mvn -Dfile.encoding=UTF-8 smart-doc:markdown</span></span>
<span class="line"><span>//生成adoc</span></span>
<span class="line"><span>mvn -Dfile.encoding=UTF-8 smart-doc:adoc</span></span>
<span class="line"><span>//生成postman json数据</span></span>
<span class="line"><span>mvn -Dfile.encoding=UTF-8 smart-doc:postman</span></span>
<span class="line"><span>// 生成 Open Api 3.0+, Since smart-doc-maven-plugin 1.1.5</span></span>
<span class="line"><span>mvn -Dfile.encoding=UTF-8 smart-doc:openapi</span></span></code></pre></div><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>结合smart-doc官方文档，我们通过几个问题进一步理解smart-doc。主要内容来源于<a href="https://smart-doc-group.github.io/" target="_blank" rel="noreferrer">官方文档在新窗口打开</a>。</p></blockquote><h3 id="注释信息是有限的-smart-doc如何从注释拓展文档内容呢" tabindex="-1">注释信息是有限的，smart-doc如何从注释拓展文档内容呢？ <a class="header-anchor" href="#注释信息是有限的-smart-doc如何从注释拓展文档内容呢" aria-label="Permalink to &quot;注释信息是有限的，smart-doc如何从注释拓展文档内容呢？&quot;">​</a></h3><blockquote><p>我们知道注释的信息是有限的，swagger技术栈的方式通过定义注解来约束并拓展文档中的内容，那么smart-doc如何从注释拓展文档内容呢？</p></blockquote><p>一方面<code>smart-doc</code>的实现初衷是通过使用<code>javadoc</code>文档注释来去除注解式的侵入，因此<code>smart-doc</code>每增加一个功能首先都是去考虑<code>javadoc</code>原生的<code>tag</code>,</p><p>下面对<code>smart-doc</code>使用的一些<code>javadoc</code>的注释<code>tag</code>做介绍。</p><table tabindex="0"><thead><tr><th>tag名称</th><th>使用描述</th></tr></thead><tbody><tr><td><code>@param</code></td><td>对于在<code>Spring Boot</code>接口层，对于简单类型的参数必须在使用<code>@param</code>时写上注释描述，对于<code>Entity</code>类型<code>smart-doc</code>则不会检查</td></tr><tr><td><code>@deprecated</code></td><td>可以在注释中用于标记接口已经废弃，作用同<code>@Deprecated</code>注解</td></tr><tr><td><code>@apiNote</code></td><td><code>@apiNote</code>是<code>JAVA</code>新增的文档<code>tag</code>,<code>smart-doc</code>使用<code>@apiNote</code>的注释作为方法的详细描述，因此可以使用<code>@apiNote</code>来写一段长注释。如果一个方法不写 <code>@apiNote</code>注释说明，<code>smart-doc</code>直接使用方法默认注释填充</td></tr></tbody></table><p>另一方面，原生的tag是不够的，所以<code>smart-doc</code>又通过自定义tag来支持更多功能的拓展</p><table tabindex="0"><thead><tr><th>tag名称</th><th>描述</th></tr></thead><tbody><tr><td><code>@ignore</code></td><td><code>@ignore</code> <code>tag</code>用于过滤请求参数对象上的某个字段，设置后<code>smart-doc</code>不输出改字段到请求参数列表中。关于响应字段忽略的请看<a href="https://smart-doc-group.github.io/#/zh-cn/diy/advancedFeatures?id=%E5%93%8D%E5%BA%94%E5%AD%97%E6%AE%B5%E5%BF%BD%E7%95%A5" target="_blank" rel="noreferrer">【忽略响应字段】在新窗口打开</a> 如果<code>@ignore</code>加到方法上，则接口方法不会输出到文档。从<code>1.8.4</code>开始<code>@ignore</code>支持添加到<code>Controller</code>上进行忽略不想生成文档的接口类。<code>@ignore</code>也可以用于方法上忽略某个请求参数。</td></tr><tr><td><code>@required</code></td><td>如果你没有使用<code>JSR303</code>参数验证规范实现的方式来标注字段，就可以使用<code>@required</code>去标注请求参数对象的字段，标注<code>smart-doc</code>在输出参数列表时会设置为<code>true</code>。</td></tr><tr><td><code>@mock</code></td><td>从<code>smart-doc 1.8.0</code>开始，<code>@mock</code> <code>tag</code>用于在对象基本类型字段设置自定义文档展示值。设置值后<code>smart-doc</code>不再帮你生成随机值。方便可以通过<code>smart-doc</code>直接输出交付文档。</td></tr><tr><td><code>@dubbo</code></td><td>从<code>smart-doc 1.8.7</code>开始，<code>@dubbo</code> <code>tag</code>用于在<code>Dubbo</code>的<code>API</code>接口类上添加让<code>smart-doc</code>可以扫描到<code>Dubbo RPC</code>的接口生成文档。</td></tr><tr><td><code>@restApi</code></td><td>从<code>smart-doc 1.8.8</code>开始，<code>@restApi</code> <code>tag</code>用于支持<code>smart-doc</code>去扫描<code>Spring Cloud Feign</code>的定义接口生成文档。</td></tr><tr><td><code>@order</code></td><td>从<code>smart-doc 1.9.4</code>开始，<code>@order</code> <code>tag</code>用于设置<code>Controller</code>接口或者<code>API</code>入口的自定义排序序号，<code>@order 1</code>就表示设置序号为<code>1</code>。</td></tr><tr><td><code>@ignoreResponseBodyAdvice</code></td><td>从<code>smart-doc 1.9.8</code>开始，<code>@ignoreResponseBodyAdvice</code> <code>tag</code>用于忽略<code>ResponseBodyAdvice</code>设置的包装类。</td></tr><tr><td><code>@download</code></td><td>从<code>smart-doc 2.0.1</code>开始，<code>@download</code> <code>tag</code>用于标注在<code>Controller</code>的文件下载方法上，生成<code>debug</code>页面时可实现文件下载测试。并且支持下载文件带请求头参数测试。</td></tr><tr><td><code>@page</code></td><td>从<code>smart-doc 2.0.2</code>开始，<code>@page</code> <code>tag</code>用于标注在<code>Controller</code>的方法上表示该方法用来渲染返回一个静态页面，生成<code>debug</code>页面时如果发起测试，测试页面会自动在浏览器开启新标签显示页面。</td></tr><tr><td><code>@ignoreParams</code></td><td>从<code>smart-doc 2.1.0</code>开始，<code>@ignoreParams</code> <code>tag</code>用于标注在<code>Controller</code>方法上忽略掉不想显示在文档中的参数，例如：<code>@ignoreParams id name</code>，多个参数名用空格隔开</td></tr><tr><td><code>@response</code></td><td>从<code>smart-doc 2.2.0</code>开始，<code>@response</code> <code>tag</code>标注在<code>Controller</code>方法上可以允许用这自己定义返回的<code>json example</code>。建议只在返回基础类型时使用，如：<code>Result&lt;String&gt;</code>类型这种泛型是简单原生类型的响应。</td></tr><tr><td><code>@tag</code></td><td><code>@since 2.2.5</code>, <code>@tag</code>用于将<code>Controller</code>方法分类, 可以将不同<code>Contoller</code>下的方法指定到多个分类下, 同时也可以直接指定<code>Controller</code>为一个分类或多个分类</td></tr></tbody></table><h3 id="maven多模块中使用插件有没有比较好的实践" tabindex="-1">Maven多模块中使用插件有没有比较好的实践？ <a class="header-anchor" href="#maven多模块中使用插件有没有比较好的实践" aria-label="Permalink to &quot;Maven多模块中使用插件有没有比较好的实践？&quot;">​</a></h3><blockquote><p>在独立的Maven项目中使用smart-doc，当前可以说是如丝般爽滑。但是在Maven的多模块项目中使用smart-doc-maven-plugin时，很多同学就有疑问了， smart-doc插件我到底是放在什么地方合适？是放在Maven的根pom.xml中？还是说各个需要生成API接口文档的模块中呢？ 下面就来说说根据不同的项目结构应该怎么放插件。</p></blockquote><p>完全的父子级关系的maven项目：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├─parent</span></span>
<span class="line"><span>├──common</span></span>
<span class="line"><span>│   pom.xml</span></span>
<span class="line"><span>├──web1</span></span>
<span class="line"><span>│   pom.xml</span></span>
<span class="line"><span>├──web2</span></span>
<span class="line"><span>│   pom.xml</span></span>
<span class="line"><span>└─pom.xml</span></span></code></pre></div><p>上面的maven结构假设是严格按照父子级来配置的，然后web1和web2都依赖于common， 这种情况下如果跑到web1下或者web2目录下直接执行mvn命令来编译 都是无法完成的。需要在根目录上去执行命令编译命令才能通过，而smart-doc插件会通过类加载器去加载用户配置的一些类，因此是需要调用编译的和执行命令 是一样的。这种情况下建议你建smart-doc-maven-plugin放到根pom.xml中，在web1和web2中放置各自的smart-doc.json配置。 然后通过-pl去指定让smart-doc生成指定 模块的文档。操作命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 生成web1模块的api文档</span></span>
<span class="line"><span>mvn smart-doc:markdown -Dfile.encoding=UTF-8  -pl :web1 -am</span></span>
<span class="line"><span># 生成web2模块的api文档</span></span>
<span class="line"><span>mvn smart-doc:markdown -Dfile.encoding=UTF-8  -pl :web2 -am</span></span></code></pre></div><p>如果不是按照严格父子级构建的项目，还是以上面的结构例子来说。common模块放在类parent中，但是common的pom.xml并没有定义parent。 common模块也很少变更，很多公司内部可能就直接把common单独depoly上传到了公司的Nexus仓库中，这种情况下web1和web2虽然依赖于common， 但是web1和web2都可以在web1和web2目录下用命令编译，这种情况下直接将smart-doc-maven-plugin单独放到web1和web2中是可以做构建生成文档的。</p><p>【<a href="https://gitee.com/smart-doc-team/spring-boot-maven-multiple-module" target="_blank" rel="noreferrer">多模块测试用例参考在新窗口打开</a>】</p><p>注意： 怎么去使用插件并没有固定的模式，最重要的是熟练Maven的一些列操作，然后根据自己的项目情况来调整。技巧娴熟就能应对自如。 对于插件的使用，从smart-doc-maven-plugin 1.2.0开始，插件是能够自动分析生成模块的依赖来加载必要的源码，并不会将所有模块的接口文档合并到一个文档中。</p><h3 id="如果生成文档时遇到问题-该如何调试" tabindex="-1">如果生成文档时遇到问题，该如何调试？ <a class="header-anchor" href="#如果生成文档时遇到问题-该如何调试" aria-label="Permalink to &quot;如果生成文档时遇到问题，该如何调试？&quot;">​</a></h3><blockquote><p>在使用<code>smart-doc-maven-plugin</code>插件来构建生成<code>API</code>文档的过程中可能会出现一些错误问题。官方文档中提供了调试的方案：</p></blockquote><ol><li><strong>添加smart-doc依赖</strong></li></ol><p>因为<code>smart-doc-maven-plugin</code>最终是使用<code>smart-doc</code>来完成项目的源码分析和文档生成的， 通常情况下真正的调试的代码是<code>smart-doc</code>。但这个过程主要通过<code>smart-doc-maven-plugin</code>来排查。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>     &lt;groupId&gt;com.github.shalousun&lt;/groupId&gt;</span></span>
<span class="line"><span>     &lt;artifactId&gt;smart-doc&lt;/artifactId&gt;</span></span>
<span class="line"><span>     &lt;version&gt;[最新版本]&lt;/version&gt;</span></span>
<span class="line"><span>     &lt;scope&gt;test&lt;/scope&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p><strong>注意：</strong> 使用<code>smart-doc</code>的版本最好和插件依赖的<code>smart-doc</code>版本一致。</p><ol start="2"><li><strong>添加断点</strong></li></ol><p>添加断点如图所示</p><p><img src="`+c+'" alt="error.图片加载失败"></p><ol start="3"><li><strong>Debug模式运行构建目标</strong></li></ol><p><code>maven</code>插件在<code>idea</code>中运行<code>debug</code>非常简单，操作如下图。</p><p><img src="'+i+`" alt="error.图片加载失败"></p><p>这样就可以直接进入断点了。</p><p><strong>提示：</strong> 上面是通过插件去作为入口调试<code>smart-doc</code>的源码，如果你想调试插件本身的源码执行过程，则将插件的依赖添加到项目依赖中,如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.github.shalousun&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;smart-doc-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;【maven仓库最新版本】&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>然后通过上面的类似步骤调试<code>smart-doc-maven-plugin</code>的源码</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p><a href="https://smart-doc-group.github.io/" target="_blank" rel="noreferrer">https://smart-doc-group.github.io/</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,71)]))}const k=a(d,[["render",r]]);export{v as __pageData,k as default};
