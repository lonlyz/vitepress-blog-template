import{_ as a,c as n,ai as p,o as t}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"SpringBoot应用部署 - 使用第三方JAR包","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-deploy-jar-3rd.md","filePath":"spring/springboot/springboot-x-deploy-jar-3rd.md","lastUpdated":1737706346000}'),l={name:"spring/springboot/springboot-x-deploy-jar-3rd.md"};function e(i,s,o,r,c,g){return t(),n("div",null,s[0]||(s[0]=[p(`<h1 id="springboot应用部署-使用第三方jar包" tabindex="-1">SpringBoot应用部署 - 使用第三方JAR包 <a class="header-anchor" href="#springboot应用部署-使用第三方jar包" aria-label="Permalink to &quot;SpringBoot应用部署 - 使用第三方JAR包&quot;">​</a></h1><blockquote><p>在项目中我们经常需要使用第三方的Jar，比如某些SDK，这些SDK没有直接发布到公开的maven仓库中，这种情况下如何使用这些三方JAR呢？本文提供最常用的两种方式。@pdai</p></blockquote><h2 id="方案一-安装到maven仓库" tabindex="-1">方案一：安装到Maven仓库 <a class="header-anchor" href="#方案一-安装到maven仓库" aria-label="Permalink to &quot;方案一：安装到Maven仓库&quot;">​</a></h2><blockquote><p>如果有项目的Maven仓库，则推荐按照到的Maven仓库（比如私服）中。（最好不是本地的Maven仓库，因为还有CI环境需要集成。）</p></blockquote><p>配置Maven私服, server &amp; profile</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!-- server --&gt;</span></span>
<span class="line"><span>&lt;server&gt;</span></span>
<span class="line"><span>    &lt;id&gt;nexus&lt;/id&gt;</span></span>
<span class="line"><span>    &lt;username&gt;pdai&lt;/username&gt;</span></span>
<span class="line"><span>    &lt;password&gt;passw0rd&lt;/password&gt;</span></span>
<span class="line"><span>&lt;/server&gt;</span></span>
<span class="line"><span>&lt;!-- profile --&gt;</span></span>
<span class="line"><span>&lt;profile&gt;</span></span>
<span class="line"><span>    &lt;id&gt;pdai-artifactory&lt;/id&gt;</span></span>
<span class="line"><span>    &lt;repositories&gt;</span></span>
<span class="line"><span>        &lt;repository&gt;</span></span>
<span class="line"><span>            &lt;id&gt;nexus&lt;/id&gt;</span></span>
<span class="line"><span>            &lt;url&gt;xxx.xxx.xxx.xxx&lt;/url&gt;</span></span>
<span class="line"><span>            &lt;releases&gt;</span></span>
<span class="line"><span>                &lt;enabled&gt;true&lt;/enabled&gt;</span></span>
<span class="line"><span>            &lt;/releases&gt;</span></span>
<span class="line"><span>            &lt;snapshots&gt;</span></span>
<span class="line"><span>                &lt;enabled&gt;true&lt;/enabled&gt;</span></span>
<span class="line"><span>            &lt;/snapshots&gt;</span></span>
<span class="line"><span>        &lt;/repository&gt;</span></span>
<span class="line"><span>    &lt;/repositories&gt;</span></span>
<span class="line"><span>&lt;/profile&gt;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -X：详细信息输出用于调试</span></span>
<span class="line"><span># -Dfile：本地jar路径</span></span>
<span class="line"><span># gav: group, artifactId, verson</span></span>
<span class="line"><span># -Durl：仓库地址</span></span>
<span class="line"><span># -DrepositoryId：settings文件中的ID</span></span>
<span class="line"><span>mvn -X deploy:deploy-file -DgroupId=tech.pdai -DartifactId=test-xxx -Dversion=1.1.0 -Dpackaging=jar -Dfile=/xxxx/xxx.jar -Durl=http://nexus.pdai.tech/repository/releases/ -DrepositoryId=nexus</span></span></code></pre></div><h2 id="方案二-使用systempath属性" tabindex="-1">方案二：使用systemPath属性 <a class="header-anchor" href="#方案二-使用systempath属性" aria-label="Permalink to &quot;方案二：使用systemPath属性&quot;">​</a></h2><blockquote><p>如果Jar无法放到maven仓库，即放在项目代码中，比如项目中libs文件夹中</p></blockquote><p>使用systemPath属性，<code>&lt;scope&gt;system&lt;/scope&gt;</code>, 其它gav三元组是可以随意填写的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.aliyun&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;taobao-sdk-java&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.0.0&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;scope&gt;system&lt;/scope&gt;</span></span>
<span class="line"><span>    &lt;systemPath&gt;\${project.basedir}/libs/taobao-sdk-java-auto_1479188381469-20180831.jar&lt;/systemPath&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><ul><li><strong>SpringBoot JAR打包</strong></li></ul><p>springboot在打包的时候，调用spring-boot-maven-plugin，执行repackage把tomcat和resource，lib等合成一个新的jar。想要将系统jar打进去，必须配置includeSystemScope。最终会将lib放入BOOT-INF\\lib</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;build&gt;</span></span>
<span class="line"><span>    &lt;plugins&gt;</span></span>
<span class="line"><span>        &lt;plugin&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;configuration&gt;</span></span>
<span class="line"><span>                &lt;includeSystemScope&gt;true&lt;/includeSystemScope&gt;</span></span>
<span class="line"><span>            &lt;/configuration&gt;</span></span>
<span class="line"><span>            &lt;executions&gt;</span></span>
<span class="line"><span>                &lt;execution&gt;</span></span>
<span class="line"><span>                    &lt;goals&gt;</span></span>
<span class="line"><span>                        &lt;goal&gt;build-info&lt;/goal&gt;</span></span>
<span class="line"><span>                        &lt;goal&gt;repackage&lt;/goal&gt;</span></span>
<span class="line"><span>                    &lt;/goals&gt;</span></span>
<span class="line"><span>                &lt;/execution&gt;</span></span>
<span class="line"><span>            &lt;/executions&gt;</span></span>
<span class="line"><span>        &lt;/plugin&gt;</span></span>
<span class="line"><span>    &lt;/plugins&gt;</span></span>
<span class="line"><span>&lt;/build&gt;</span></span></code></pre></div><ul><li><strong>SpringBoot War打包</strong></li></ul><p>使用mvn clean package命令打包时需要在pom文件加入以下webResources配置，并设置jar包在WEB-INF/lib目录下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;plugin&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;maven-war-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.4&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;configuration&gt;</span></span>
<span class="line"><span>        &lt;webResources&gt;</span></span>
<span class="line"><span>            &lt;resource&gt;</span></span>
<span class="line"><span>                &lt;directory&gt;src/main/resources/libs/&lt;/directory&gt;</span></span>
<span class="line"><span>                &lt;targetPath&gt;WEB-INF/lib/&lt;/targetPath&gt;</span></span>
<span class="line"><span>                &lt;includes&gt;</span></span>
<span class="line"><span>                    &lt;include&gt;**/*.jar&lt;/include&gt;</span></span>
<span class="line"><span>                &lt;/includes&gt;</span></span>
<span class="line"><span>            &lt;/resource&gt;</span></span>
<span class="line"><span>        &lt;/webResources&gt;</span></span>
<span class="line"><span>    &lt;/configuration&gt;</span></span>
<span class="line"><span>&lt;/plugin&gt;</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,18)]))}const b=a(l,[["render",e]]);export{u as __pageData,b as default};
