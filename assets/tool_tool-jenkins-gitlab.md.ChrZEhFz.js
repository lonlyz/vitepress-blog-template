import{_ as a,c as n,ai as e,o as i}from"./chunks/framework.BrYByd3F.js";const p="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_4.png",t="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_8.png",l="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_3.png",r="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_1.png",o="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_2.png",c="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_7.png",g="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_5.png",d="/vitepress-blog-template/images/jenkins_gitlab/ci_action_jenkins_gitlab_6.png",j=JSON.parse('{"title":"工具详解 - Jenkins+Gitlab","description":"","frontmatter":{},"headers":[],"relativePath":"tool/tool-jenkins-gitlab.md","filePath":"tool/tool-jenkins-gitlab.md","lastUpdated":1737706346000}'),h={name:"tool/tool-jenkins-gitlab.md"};function u(b,s,m,k,_,f){return i(),n("div",null,s[0]||(s[0]=[e(`<h1 id="工具详解-jenkins-gitlab" tabindex="-1">工具详解 - Jenkins+Gitlab <a class="header-anchor" href="#工具详解-jenkins-gitlab" aria-label="Permalink to &quot;工具详解 - Jenkins+Gitlab&quot;">​</a></h1><blockquote><p>我在尝试在容器中安装Jenkins时，初衷是希望使用docker in docker 的模式来实现Jenkins slave容器按需创建。在实现的时候需要在Jenkins 中安装Kubernetes插件。 kubernetes的插件目前来看存在一个Bug，这个bug很小但是会导致我们无法设置和kubernetes mastert认证的机制。Bug是由于配置代理时候是用的IP地址，但是jenkins必须加入http协议，可惜的是加入http协议后更新的代理又不能使用了，进入这种死循环了。所以这种方案暂时搁置。</p></blockquote><p>So，这里我会写常用的实现自动化部署的方案之Jenkins+Gitlab这种模式，在小型的开发时候完全够用了，从来没有一致的最佳方案，只有适不适合咱们的团队方案。</p><h2 id="jenkins的安装" tabindex="-1">Jenkins的安装 <a class="header-anchor" href="#jenkins的安装" aria-label="Permalink to &quot;Jenkins的安装&quot;">​</a></h2><p>RedHat Linux RPM packages for Jenkins - <a href="https://pkg.jenkins.io/redhat-stable/" target="_blank" rel="noreferrer">https://pkg.jenkins.io/redhat-stable/</a></p><p>To use this repository, run the following command:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo</span></span>
<span class="line"><span>sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key</span></span></code></pre></div><p>If you&#39;ve previously imported the key from Jenkins, the &quot;rpm --import&quot; will fail because you already have a key. Please ignore that and move on.</p><p>You will need to explicitly install a Java runtime environment, because Oracle&#39;s Java RPMs are incorrect and fail to register as providing a java dependency. Thus, adding an explicit dependency requirement on Java would force installation of the OpenJDK JVM.</p><p>2.54 (2017-04) and newer: Java 8 1.612 (2015-05) and newer: Java 7 With that set up, the Jenkins package can be installed with:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>yum install jenkins</span></span></code></pre></div><p>See Wiki for more information, including how Jenkins is run and where the configuration is stored, etc.</p><h2 id="gitlab的安装" tabindex="-1">Gitlab的安装 <a class="header-anchor" href="#gitlab的安装" aria-label="Permalink to &quot;Gitlab的安装&quot;">​</a></h2><p>自己网上找吧，但是安装8.0+的版本，因为后面webhooks是有版本的要求的。</p><h2 id="自动化部署配置" tabindex="-1">自动化部署配置 <a class="header-anchor" href="#自动化部署配置" aria-label="Permalink to &quot;自动化部署配置&quot;">​</a></h2><h3 id="创建普通编译job" tabindex="-1">创建普通编译Job <a class="header-anchor" href="#创建普通编译job" aria-label="Permalink to &quot;创建普通编译Job&quot;">​</a></h3><h4 id="jenkins创建一个job-并配置git信息" tabindex="-1">Jenkins创建一个Job，并配置git信息 <a class="header-anchor" href="#jenkins创建一个job-并配置git信息" aria-label="Permalink to &quot;Jenkins创建一个Job，并配置git信息&quot;">​</a></h4><p><img src="`+p+'" alt="error.图片加载失败"></p><blockquote><p>注意，这里连接Gitlab需要配置认证</p></blockquote><p><img src="'+t+`" alt="error.图片加载失败"></p><blockquote><p>同时，保证jenkins机器安装了Java， maven。</p></blockquote><p>Maven 中需要配置成我们自己的仓库，配置settings.xm即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@jenkins ~]# find / -name settings.xml</span></span>
<span class="line"><span>/etc/maven/settings.xml</span></span>
<span class="line"><span>/var/lib/jenkins/.m2/settings.xml</span></span>
<span class="line"><span>/usr/share/maven/conf/settings.xml</span></span>
<span class="line"><span>[root@jenkins ~]# cat /usr/share/maven/conf/settings.xml</span></span></code></pre></div><h4 id="更改成公司artificatory配置" tabindex="-1">更改成公司artificatory配置 <a class="header-anchor" href="#更改成公司artificatory配置" aria-label="Permalink to &quot;更改成公司artificatory配置&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   &lt;mirror&gt;</span></span>
<span class="line"><span>      &lt;id&gt;mirrorId_2&lt;/id&gt;</span></span>
<span class="line"><span>      &lt;mirrorOf&gt;*&lt;/mirrorOf&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Human Readable Name for this Mirror.&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;url&gt;http://maven.aliyun.com/nexus/content/groups/public/&lt;/url&gt;</span></span>
<span class="line"><span>    &lt;/mirror&gt;--&gt;</span></span>
<span class="line"><span>   &lt;mirror&gt;</span></span>
<span class="line"><span>      &lt;id&gt;mirrorId_1&lt;/id&gt;</span></span>
<span class="line"><span>      &lt;mirrorOf&gt;*&lt;/mirrorOf&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Human Readable Name for this Mirror.&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;url&gt;http://139.24.120.251:58086/artifactory/list/maven2/&lt;/url&gt;</span></span>
<span class="line"><span>    &lt;/mirror&gt;</span></span></code></pre></div><h3 id="加入ci-trigger功能" tabindex="-1">加入CI Trigger功能 <a class="header-anchor" href="#加入ci-trigger功能" aria-label="Permalink to &quot;加入CI Trigger功能&quot;">​</a></h3><h4 id="jenkins-trigger配置" tabindex="-1">Jenkins Trigger配置 <a class="header-anchor" href="#jenkins-trigger配置" aria-label="Permalink to &quot;Jenkins Trigger配置&quot;">​</a></h4><p><img src="`+l+'" alt="error.图片加载失败"></p><h4 id="gitlab配置webhook" tabindex="-1">Gitlab配置webhook <a class="header-anchor" href="#gitlab配置webhook" aria-label="Permalink to &quot;Gitlab配置webhook&quot;">​</a></h4><p><img src="'+r+'" alt="error.图片加载失败"></p><h4 id="测试webhook" tabindex="-1">测试webhook: <a class="header-anchor" href="#测试webhook" aria-label="Permalink to &quot;测试webhook:&quot;">​</a></h4><p><img src="'+o+`" alt="error.图片加载失败"></p><h3 id="加入cd功能" tabindex="-1">加入CD功能 <a class="header-anchor" href="#加入cd功能" aria-label="Permalink to &quot;加入CD功能&quot;">​</a></h3><h4 id="自动化运行脚本编写" tabindex="-1">自动化运行脚本编写 <a class="header-anchor" href="#自动化运行脚本编写" aria-label="Permalink to &quot;自动化运行脚本编写&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@jenkins ~]# cat run.sh</span></span>
<span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span>echo &#39;Checking scic document system status...&#39;</span></span>
<span class="line"><span>SCIC_APP_PID=$(ps -ef | grep scic_paas_doc | grep -v grep | awk &#39;{ print $2 }&#39;)</span></span>
<span class="line"><span>if [ -z &quot;$SCIC_APP_PID&quot; ]</span></span>
<span class="line"><span>  then</span></span>
<span class="line"><span>      echo Starting scic document...</span></span>
<span class="line"><span>      nohup java -jar scic_paas_doc-0.0.1-RELEASE.jar &gt; doc.log 2&gt;&amp;1 &amp;</span></span>
<span class="line"><span>      echo Started successfully.</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    echo killing old service -  $SCIC_APP_PID ...</span></span>
<span class="line"><span>    kill $SCIC_APP_PID</span></span>
<span class="line"><span>    echo Restarting scic document...</span></span>
<span class="line"><span>    nohup java -jar scic_paas_doc-0.0.1-RELEASE.jar &gt; doc.log 2&gt;&amp;1 &amp;</span></span>
<span class="line"><span>    echo Restarted successfully.</span></span>
<span class="line"><span>fi</span></span></code></pre></div><h4 id="global配置ssh-server" tabindex="-1">Global配置SSH Server <a class="header-anchor" href="#global配置ssh-server" aria-label="Permalink to &quot;Global配置SSH Server&quot;">​</a></h4><p><img src="`+c+'" alt="error.图片加载失败"></p><h4 id="build-job中配置postbuild-over-ssh" tabindex="-1">Build Job中配置PostBuild，Over SSH <a class="header-anchor" href="#build-job中配置postbuild-over-ssh" aria-label="Permalink to &quot;Build Job中配置PostBuild，Over SSH&quot;">​</a></h4><p>通过SSH上传jar，并使用脚本运行</p><p><img src="'+g+`" alt="error.图片加载失败"></p><h4 id="更新并提交代码" tabindex="-1">更新并提交代码 <a class="header-anchor" href="#更新并提交代码" aria-label="Permalink to &quot;更新并提交代码&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pdai@pdai MINGW64 /d/git/k8s/scic_paas_doc (master)</span></span>
<span class="line"><span>$ git add .</span></span>
<span class="line"><span>warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.</span></span>
<span class="line"><span>The file will have its original line endings in your working directory.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pdai@pdai MINGW64 /d/git/k8s/scic_paas_doc (master)</span></span>
<span class="line"><span>$ git commit</span></span>
<span class="line"><span>warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.</span></span>
<span class="line"><span>The file will have its original line endings in your working directory.</span></span>
<span class="line"><span>[master warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.</span></span>
<span class="line"><span>The file will have its original line endings in your working directory.</span></span>
<span class="line"><span>50c1cc4] test trigger</span></span>
<span class="line"><span>warning: LF will be replaced by CRLF in src/main/resources/static/_sidebar.md.</span></span>
<span class="line"><span>The file will have its original line endings in your working directory.</span></span>
<span class="line"><span> 1 file changed, 1 insertion(+), 1 deletion(-)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pdai@pdai MINGW64 /d/git/k8s/scic_paas_doc (master)</span></span>
<span class="line"><span>$ git push</span></span>
<span class="line"><span>Counting objects: 7, done.</span></span>
<span class="line"><span>Delta compression using up to 4 threads.</span></span>
<span class="line"><span>Compressing objects: 100% (6/6), done.</span></span>
<span class="line"><span>Writing objects: 100% (7/7), 499 bytes | 0 bytes/s, done.</span></span>
<span class="line"><span>Total 7 (delta 5), reused 0 (delta 0)</span></span>
<span class="line"><span>To git@10.192.29.91:k8s_test/scic_paas_doc.git</span></span>
<span class="line"><span>   63b8ff4..50c1cc4  master -&gt; master</span></span></code></pre></div><h4 id="触发编译和自动化部署" tabindex="-1">触发编译和自动化部署 <a class="header-anchor" href="#触发编译和自动化部署" aria-label="Permalink to &quot;触发编译和自动化部署&quot;">​</a></h4><p><img src="`+d+`" alt="error.图片加载失败"></p><h4 id="tigger-build-logs" tabindex="-1">Tigger Build Logs <a class="header-anchor" href="#tigger-build-logs" aria-label="Permalink to &quot;Tigger Build Logs&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Started by GitLab push by daipeng</span></span>
<span class="line"><span>Building in workspace /var/lib/jenkins/workspace/SCIC_DOC_TRIGGER_BUILD</span></span>
<span class="line"><span> &gt; git rev-parse --is-inside-work-tree # timeout=10</span></span>
<span class="line"><span>Fetching changes from the remote Git repository</span></span>
<span class="line"><span> &gt; git config remote.origin.url git@10.192.29.91:k8s_test/scic_paas_doc.git # timeout=10</span></span>
<span class="line"><span>Fetching upstream changes from git@10.192.29.91:k8s_test/scic_paas_doc.git</span></span>
<span class="line"><span> &gt; git --version # timeout=10</span></span>
<span class="line"><span>using GIT_SSH to set credentials jenkins master server key</span></span>
<span class="line"><span> &gt; git fetch --tags --progress git@10.192.29.91:k8s_test/scic_paas_doc.git +refs/heads/*:refs/remotes/origin/*</span></span>
<span class="line"><span> &gt; git rev-parse remotes/origin/master^{commit} # timeout=10</span></span>
<span class="line"><span> &gt; git branch -a -v --no-abbrev --contains 50c1cc4499394d70919a470db5961cec00e65457 # timeout=10</span></span>
<span class="line"><span>Checking out Revision 50c1cc4499394d70919a470db5961cec00e65457 (origin/master)</span></span>
<span class="line"><span>Commit message: &quot;test trigger&quot;</span></span>
<span class="line"><span> &gt; git config core.sparsecheckout # timeout=10</span></span>
<span class="line"><span> &gt; git checkout -f 50c1cc4499394d70919a470db5961cec00e65457</span></span>
<span class="line"><span> &gt; git rev-list 99d919b08d5a2010fe750d4d920a10024401bc92 # timeout=10</span></span>
<span class="line"><span>[SCIC_DOC_TRIGGER_BUILD] $ /bin/sh -xe /tmp/jenkins3779972667920467885.sh</span></span>
<span class="line"><span>+ mvn package</span></span>
<span class="line"><span>[INFO] Scanning for projects...</span></span>
<span class="line"><span>[INFO]                                                                         </span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Building pass_doc 0.0.1-RELEASE</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ scic_paas_doc ---</span></span>
<span class="line"><span>[INFO] Using &#39;UTF-8&#39; encoding to copy filtered resources.</span></span>
<span class="line"><span>[INFO] Copying 1 resource</span></span>
<span class="line"><span>[INFO] Copying 71 resources</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ scic_paas_doc ---</span></span>
<span class="line"><span>[INFO] Nothing to compile - all classes are up to date</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ scic_paas_doc ---</span></span>
<span class="line"><span>[INFO] Using &#39;UTF-8&#39; encoding to copy filtered resources.</span></span>
<span class="line"><span>[INFO] skip non existing resourceDirectory /var/lib/jenkins/workspace/SCIC_DOC_TRIGGER_BUILD/src/test/resources</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ scic_paas_doc ---</span></span>
<span class="line"><span>[INFO] No sources to compile</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-surefire-plugin:2.18.1:test (default-test) @ scic_paas_doc ---</span></span>
<span class="line"><span>[INFO] No tests to run.</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- maven-jar-plugin:2.6:jar (default-jar) @ scic_paas_doc ---</span></span>
<span class="line"><span>[INFO] Building jar: /var/lib/jenkins/workspace/SCIC_DOC_TRIGGER_BUILD/target/scic_paas_doc-0.0.1-RELEASE.jar</span></span>
<span class="line"><span>[INFO] </span></span>
<span class="line"><span>[INFO] --- spring-boot-maven-plugin:1.4.1.RELEASE:repackage (default) @ scic_paas_doc ---</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] BUILD SUCCESS</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>[INFO] Total time: 3.695s</span></span>
<span class="line"><span>[INFO] Finished at: Fri Jul 28 09:15:43 CST 2017</span></span>
<span class="line"><span>[INFO] Final Memory: 16M/237M</span></span>
<span class="line"><span>[INFO] ------------------------------------------------------------------------</span></span>
<span class="line"><span>SSH: Connecting from host [jenkins]</span></span>
<span class="line"><span>SSH: Connecting with configuration [PAAS_DOC_SERVER_200] ...</span></span>
<span class="line"><span>SSH: EXEC: STDOUT/STDERR from command [/root/run.sh] ...</span></span>
<span class="line"><span>Checking scic document system status...</span></span>
<span class="line"><span>killing old service - 19970 ...</span></span>
<span class="line"><span>Restarting scic document...</span></span>
<span class="line"><span>Restarted successfully.</span></span>
<span class="line"><span>SSH: EXEC: completed after 200 ms</span></span>
<span class="line"><span>SSH: Disconnecting configuration [PAAS_DOC_SERVER_200] ...</span></span>
<span class="line"><span>SSH: Transferred 1 file(s)</span></span>
<span class="line"><span>Finished: SUCCESS</span></span></code></pre></div><h4 id="查看网站更新" tabindex="-1">查看网站更新 <a class="header-anchor" href="#查看网站更新" aria-label="Permalink to &quot;查看网站更新&quot;">​</a></h4><p>发现确实已经更新 啦。</p><h2 id="参考文档" tabindex="-1">参考文档 <a class="header-anchor" href="#参考文档" aria-label="Permalink to &quot;参考文档&quot;">​</a></h2><p><a href="https://jenkins.io/doc/pipeline/tour/hello-world/" target="_blank" rel="noreferrer">https://jenkins.io/doc/pipeline/tour/hello-world/</a></p><p><a href="https://jenkins.io/user-handbook.pdf" target="_blank" rel="noreferrer">https://jenkins.io/user-handbook.pdf</a></p><p><a href="http://www.cnblogs.com/kevingrace/p/5651447.html" target="_blank" rel="noreferrer">http://www.cnblogs.com/kevingrace/p/5651447.html</a></p><p><a href="http://www.cnblogs.com/ceshi2016/p/6529557.html" target="_blank" rel="noreferrer">http://www.cnblogs.com/ceshi2016/p/6529557.html</a></p><p><a href="http://linuxsogood.org/1539.html" target="_blank" rel="noreferrer">http://linuxsogood.org/1539.html</a></p><p><a href="http://www.mamicode.com/info-detail-1264849.html" target="_blank" rel="noreferrer">http://www.mamicode.com/info-detail-1264849.html</a></p><p><a href="http://blog.didispace.com/spring-boot-run-backend/" target="_blank" rel="noreferrer">http://blog.didispace.com/spring-boot-run-backend/</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,57)]))}const I=a(h,[["render",u]]);export{j as __pageData,I as default};
