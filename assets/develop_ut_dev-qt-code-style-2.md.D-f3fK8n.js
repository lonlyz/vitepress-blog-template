import{_ as a,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/develop/ut/dev-qt-10.png",g=JSON.parse('{"title":"代码质量 - 统一风格：统一命名规范详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/ut/dev-qt-code-style-2.md","filePath":"develop/ut/dev-qt-code-style-2.md","lastUpdated":1737706346000}'),i={name:"develop/ut/dev-qt-code-style-2.md"};function t(c,s,o,r,d,u){return e(),n("div",null,s[0]||(s[0]=[p(`<h1 id="代码质量-统一风格-统一命名规范详解" tabindex="-1">代码质量 - 统一风格：统一命名规范详解 <a class="header-anchor" href="#代码质量-统一风格-统一命名规范详解" aria-label="Permalink to &quot;代码质量 - 统一风格：统一命名规范详解&quot;">​</a></h1><blockquote><p>好的代码本身就是注释, 所以我们需要统一命名风格，本文将介绍常用的统一风格的措施之<strong>统一命名规范</strong>。@pdai</p></blockquote><h2 id="统一命名风格" tabindex="-1">统一命名风格 <a class="header-anchor" href="#统一命名风格" aria-label="Permalink to &quot;统一命名风格&quot;">​</a></h2><blockquote><p>好的代码本身就是注释, 所以我们需要统一命名风格。</p></blockquote><p>​ 在本文中，将从大到小，从外到内，总结Java编程中的命名规范。文中将会涉及到日常工作中常见的命名示例，如包命名，类命名，接口命名，方法命名，变量命名，常类命名，抽象类命名，异常类命名以及扩展类命名等。我将按照项目工程目录结构，从包，类(接口，抽象类，异常类)，方法，变量和常量的顺序展开介绍。</p><h3 id="包命名规范" tabindex="-1">包命名规范 <a class="header-anchor" href="#包命名规范" aria-label="Permalink to &quot;包命名规范&quot;">​</a></h3><p>​&gt; 包(Package)的作用是将功能相似或相关的类或者接口进行分组管理，便于类的定位和查找，同时也可以使用包来避免类名的冲突和访问控制，使代码更容易维护。通常，包命使用小写英文字母进行命名，并使用“.”进行分割，每个被分割的单元只能包含一个名词。一般地，包命名常采用顶级域名作为前缀，例如com，net，org，edu，gov，cn，io等，随后紧跟公司/组织/个人名称以及功能模块名称。</p><p>下面是一些包命名示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.springframework.boot.autoconfigure.cloud</span></span>
<span class="line"><span>package org.springframework.boot.util</span></span>
<span class="line"><span>package org.hibernate.action</span></span>
<span class="line"><span>package org.hibernate.cfg</span></span>
<span class="line"><span>package com.alibaba.druid</span></span>
<span class="line"><span>package com.alibaba.druid.filter</span></span>
<span class="line"><span>package com.alibaba.nacos.client.config</span></span>
<span class="line"><span>package com.ramostear.blog.web</span></span></code></pre></div><p>下面是Oracle Java的一些常见包命名例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package java.beans</span></span>
<span class="line"><span>package java.io</span></span>
<span class="line"><span>package java.lang</span></span>
<span class="line"><span>package java.net</span></span>
<span class="line"><span>package java.util</span></span>
<span class="line"><span>package javax.annotation</span></span></code></pre></div><h3 id="类命名规范" tabindex="-1">类命名规范 <a class="header-anchor" href="#类命名规范" aria-label="Permalink to &quot;类命名规范&quot;">​</a></h3><blockquote><p>类(Class)通常采用名词进行命名，且首字母大写，如果一个类名包含两个以上名词，建议使用驼峰命名(Camel-Case)法书写类名,每个名词首字母也应该大写。一般地，类名的书写尽量使其保持简单和描述的完整性，因此在书写类名时不建议使用缩写(一些约定俗成的命名除外，例如Internationalization and Localization缩写成i18n，Uniform Resource Identifier缩写成URI，Data Access Object缩写成DAO，JSON Web Token缩写成JWT，HyperText Markup Language缩写成HTML等等)。下列是一些常见的类命名示例：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class UserDTO{</span></span>
<span class="line"><span>    //TODO...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class EmployeeService{</span></span>
<span class="line"><span>    //TODO...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class StudentDAO{</span></span>
<span class="line"><span>    //TODO...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class OrderItemEntity{</span></span>
<span class="line"><span>    //TODO...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class UserServiceImpl{</span></span>
<span class="line"><span>    //TODO...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class OrderItemController{</span></span>
<span class="line"><span>    //TODO...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是Oracle Java中的一些标准命名示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HTMLEditorKit{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class HttpContext{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface ImageObserver{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class ArrayIndexOutOfBoundsException{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class enum Thread.State{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="接口命名规范" tabindex="-1">接口命名规范 <a class="header-anchor" href="#接口命名规范" aria-label="Permalink to &quot;接口命名规范&quot;">​</a></h3><blockquote><p>首先，接口(Interface)是一种表述某一类型对象动作的特殊类；简单来说，接口也是类(不太严谨)，所以，接口的名称的书写也应该符合类名书写规范，首字母应该大写，与普通类名不同的是，接口命名时通常采用形容词或动词来描述接口的动作行为。下列是Oracle Java中一些标准库的接口使用形容词命名示例：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Closeable{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface Cloneable{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface RunnableP{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface Comparable&lt;T&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface CompletionService&lt;V&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface Iterable&lt;T&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface EventListener{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Spring Framework标准库中，通常采用名词+动词/形容词的组合方式来命名接口，下列是Spring Framework中一些接口命名示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface AfterAdvice{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface TargetClassAware{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface ApplicationContextAware{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface MessageSourceResolvable{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="抽象类命名规范" tabindex="-1">抽象类命名规范 <a class="header-anchor" href="#抽象类命名规范" aria-label="Permalink to &quot;抽象类命名规范&quot;">​</a></h3><blockquote><p>抽象类(Abstract Class)是一种特殊的类，其命名与普通类的命名规范相当。一般地，为了将抽象类与普通类和接口做出区别，提高抽象类的可读性，在命名抽象类时，会以“Abstract”/“Base”作为类命的前缀。下面是编程中一些常规的命名示例：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractRepository&lt;T&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class AbstractController{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class BaseDao&lt;T,ID&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class AbstractCommonService&lt;T&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以下是Spring Framework中常见的抽象类示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractAspectJAdvice{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class AbstractSingletonProxyFactoryBean{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class AbstractBeanFactoryPointcutAdvisor{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class AbstractCachingConfiguration{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public abstract class AbstractContextLoaderInitializer{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="异常类命名规范" tabindex="-1">异常类命名规范 <a class="header-anchor" href="#异常类命名规范" aria-label="Permalink to &quot;异常类命名规范&quot;">​</a></h3><blockquote><p>异常类(Exception Class)也是类的一种，但与普通类命名不同的是，异常类在命名时需要使用“Exception”作为其后缀。下面是常见的异常类命名示例：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FileNotFoundException{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class UserAlreadyExistException{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class TransactionException{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class ClassNotFoundException{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class IllegalArgumentException{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class IndexOutOfBoundsException{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外，在Java中还有另外一类异常类，它们属于系统异常，这一类异常类的命名使用“Error”作为其后缀，以区分Exception(编码，环境，操作等异常)。下面是系统异常(非检查异常)的命名示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class VirtualMachineError{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class StackOverflowError{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class OutOfMemoryError{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class IllegalAccessError{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class NoClassDefFoundError{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class NoSuchFieldError{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class NoSuchMethodError{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="方法命名规范" tabindex="-1">方法命名规范 <a class="header-anchor" href="#方法命名规范" aria-label="Permalink to &quot;方法命名规范&quot;">​</a></h3><blockquote><p>方法(Method)命名时,其首字母应该小写，如果方法签名由多个单词组成，则从第二个单词起，使用驼峰命名法进行书写。一般地，在对方法进行命名时，通常采用动词/动词+名词的组合，下面是方法命名的一些常见示例。</p></blockquote><h4 id="表述获取" tabindex="-1">表述获取 <a class="header-anchor" href="#表述获取" aria-label="Permalink to &quot;表述获取&quot;">​</a></h4><p>​ 如果一个方法用于获取某个值，通常使用“get”作为其前缀，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public String getUserName(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public List&lt;Integer&gt; getUserIds(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public User getOne(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="表述查询" tabindex="-1">表述查询 <a class="header-anchor" href="#表述查询" aria-label="Permalink to &quot;表述查询&quot;">​</a></h4><p>​ 如果方法需要通过查询或筛选的方式获取某个数据，通常使用“find”/“query”作为其前缀，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public List&lt;User&gt; findOne(Integer id){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public List&lt;Integer&gt; findAll(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>public List&lt;String&gt; queryOrders(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="表述条件" tabindex="-1">表述条件 <a class="header-anchor" href="#表述条件" aria-label="Permalink to &quot;表述条件&quot;">​</a></h4><p>​ 如果一个方法需要一些条件参数，则可以使用“by”/“with”等字符作为方法名中条件的连接符，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public User findByUsername(String username){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public List&lt;Integer&gt; getUserIdsWithState(boolean state){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public List&lt;User&gt; findAllByUsernameOrderByIdDesc(String username){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="表述设置" tabindex="-1">表述设置 <a class="header-anchor" href="#表述设置" aria-label="Permalink to &quot;表述设置&quot;">​</a></h4><p>​ 如果一个方法是要设置，插入，修改，删除等操作，应该将对应的动词(set,insert,update,delete)作为其名词的前缀，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setName(String name){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public User insert(User user){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public void update(User user){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public void clearAll(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="其他规范" tabindex="-1">其他规范 <a class="header-anchor" href="#其他规范" aria-label="Permalink to &quot;其他规范&quot;">​</a></h4><p>​ 如果一个方法用于获取某组数据的长度或数量，则该方法应该使用length或size命名；如果方法的返回值为布尔类型(Boolean)，则该方法应该使用“is”或”has”作为前缀；如果方法用于将一种类型的数据转换为另一种数据数类型，则可以使用“to”作为前缀。下面是综合示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public long length(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public int size(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public boolean isOpen(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public boolean isNotEmpty(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public boolean hasLength(){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public Set&lt;Integer&gt; mapToSet(Map map){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public UserDto convertTo(User user){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public String toString(Object obj){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="变量命名规范" tabindex="-1">变量命名规范 <a class="header-anchor" href="#变量命名规范" aria-label="Permalink to &quot;变量命名规范&quot;">​</a></h3><blockquote><p>变量(Variable)命名包括参数名称，成员变量和局部变量。变量命名通常以小写字母开头，如果变量名由多个单词构成，则从第二个单词起首字母需要大写，在变量命名过程中，不建议使用“_”作为前缀或者单词之间的分割符号。下面是一些常见的变量命名示例：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private String nickName;</span></span>
<span class="line"><span>private String mobileNumber;</span></span>
<span class="line"><span>private Long id;</span></span>
<span class="line"><span>private String username;</span></span>
<span class="line"><span>private Long orderId;</span></span>
<span class="line"><span>private Long orderItemId;</span></span></code></pre></div><h3 id="常量命名规范" tabindex="-1">常量命名规范 <a class="header-anchor" href="#常量命名规范" aria-label="Permalink to &quot;常量命名规范&quot;">​</a></h3><blockquote><p>一般地，常量名称采用全部大写的英文单词书写，如果常量名称由多个单词组成，则单词之间统一使用“_”进行分割，下面是常量命名示例：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static final String LOGIN_USER_SESSION_KEY = &quot;current_login_user&quot;;</span></span>
<span class="line"><span>public static final int MAX_AGE_VALUE = 120;</span></span>
<span class="line"><span>public static final int DEFAULT_PAGE_NO = 1;</span></span>
<span class="line"><span>public static final long MAX_PAGE_SIZE = 1000;</span></span>
<span class="line"><span>public static final boolean HAS_LICENSE = false;</span></span>
<span class="line"><span>public static final boolean IS_CHECKED = false;</span></span></code></pre></div><h3 id="枚举命名规范" tabindex="-1">枚举命名规范 <a class="header-anchor" href="#枚举命名规范" aria-label="Permalink to &quot;枚举命名规范&quot;">​</a></h3><blockquote><p>枚举(Enum)类是一种特殊的类，其命名规范遵循普通类的命名约束条件，首字母大写，采用驼峰命名法；枚举类中定义的值的名称遵循常量的命名规范，且枚举值的名称需要与类名有一定的关联性，下面是枚举的一些示例：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum Color{</span></span>
<span class="line"><span>    RED,YELLOW,BLUE,GREEN,WHITE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public enum PhysicalSize{</span></span>
<span class="line"><span>    TINY,SMALL,MEDIUM,LARGE,HUGE,GIGANTIC;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是Oracle Java标准库中的一个示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum ElementType{</span></span>
<span class="line"><span>    TYPE,</span></span>
<span class="line"><span>    FIELD,</span></span>
<span class="line"><span>    METHOD,</span></span>
<span class="line"><span>    PARAMETER,</span></span>
<span class="line"><span>    CONSTRUCTOR,</span></span>
<span class="line"><span>    LOCAL_VARIABLE,</span></span>
<span class="line"><span>    ANNOTATION_TYPE,</span></span>
<span class="line"><span>    PACKAGE,</span></span>
<span class="line"><span>    TYPE_PARAMETER,</span></span>
<span class="line"><span>    TYPE_USE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="其他命名规范" tabindex="-1">其他命名规范 <a class="header-anchor" href="#其他命名规范" aria-label="Permalink to &quot;其他命名规范&quot;">​</a></h3><h4 id="数组" tabindex="-1">数组 <a class="header-anchor" href="#数组" aria-label="Permalink to &quot;数组&quot;">​</a></h4><p>​ 在定义数组时，为了便于阅读，尽量保持以下的书写规范：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int[] array = new int[10];</span></span>
<span class="line"><span>int[] idArray ={1,2,3,4,5};</span></span>
<span class="line"><span>String[] nameArray = {&quot;First&quot;,&quot;Yellow&quot;,&quot;Big&quot;}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public List&lt;String&gt; getNameById(Integer[] ids){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//或者</span></span>
<span class="line"><span>public List&lt;String&gt; getNameById(Integer...ids){</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="表述复数或者集合" tabindex="-1">表述复数或者集合 <a class="header-anchor" href="#表述复数或者集合" aria-label="Permalink to &quot;表述复数或者集合&quot;">​</a></h4><p>​ 如果一个变量用于描述多个数据时，尽量使用单词的复数形式进行书写，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Collection&lt;Order&gt; orders;</span></span>
<span class="line"><span>int[] values;</span></span>
<span class="line"><span>List&lt;Item&gt; items;</span></span></code></pre></div><p>另外，如果表述的是一个Map数据，则应使用“map”作为其后缀，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Map&lt;String,User&gt; userMap;</span></span>
<span class="line"><span>Map&lt;String,List&lt;Object&gt;&gt; listMap;</span></span></code></pre></div><h4 id="泛型类" tabindex="-1">泛型类 <a class="header-anchor" href="#泛型类" aria-label="Permalink to &quot;泛型类&quot;">​</a></h4><p>在书写泛型类时，通常做以下的约定：</p><ul><li>E表示Element，通常用在集合中；</li><li>ID用于表示对象的唯一标识符类型</li><li>T表示Type(类型)，通常指代类；</li><li>K表示Key(键),通常用于Map中；</li><li>V表示Value(值),通常用于Map中，与K结对出现；</li><li>N表示Number,通常用于表示数值类型；</li><li>？表示不确定的Java类型；</li><li>X用于表示异常；</li><li>U,S表示任意的类型。</li></ul><p>下面时泛型类的书写示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HashSet&lt;E&gt; extends AbstractSet&lt;E&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class HashMap&lt;K,V&gt; extends AbstractMap&lt;K,V&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class ThreadLocal&lt;T&gt;{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface Functor&lt;T,X extends Throwable&gt;{</span></span>
<span class="line"><span>    T val() throws X;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class Container&lt;K,V&gt;{</span></span>
<span class="line"><span>    private K key;</span></span>
<span class="line"><span>    private V value;</span></span>
<span class="line"><span>    Container(K key,V value){</span></span>
<span class="line"><span>        this.key = key;</span></span>
<span class="line"><span>        this.value = value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //getter and setter ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public interface BaseRepository&lt;T,ID&gt;{</span></span>
<span class="line"><span>    T findById(ID id);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    void update(T t);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    List&lt;T&gt; findByIds(ID...ids);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public static &lt;T&gt; List&lt;T&gt; methodName(Class&lt;T&gt; clz){</span></span>
<span class="line"><span>    List&lt;T&gt; dataList = getByClz(clz);</span></span>
<span class="line"><span>    return dataList;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="接口实现类" tabindex="-1">接口实现类 <a class="header-anchor" href="#接口实现类" aria-label="Permalink to &quot;接口实现类&quot;">​</a></h4><p>​ 为了便于阅读，在通常情况下，建议接口实现类使用“Impl作为后缀”，不建议使用大写的“I”作为接口前缀(PS:当然也有很多代码是用I开头的），下面是接口和接口实现类的书写示例。</p><p>推荐写法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface OrderService{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class OrderServiceImpl implements OrderService{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不建议的写法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface IOrderService{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class OrderService implements IOrderService{</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="测试类和测试方法" tabindex="-1">测试类和测试方法 <a class="header-anchor" href="#测试类和测试方法" aria-label="Permalink to &quot;测试类和测试方法&quot;">​</a></h4><p>​ 在项目中，测试类采用被测试业务模块名/被测试接口/被测试类+“Test”的方法进行书写，测试类中的测试函数采用“test”+用例操作_状态的组合方式进行书写，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class UserServiceTest{</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public void testFindByUsernameAndPassword(){</span></span>
<span class="line"><span>        //...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public void testUsernameExist_notExist(){</span></span>
<span class="line"><span>        //...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public void testDeleteById_isOk(){</span></span>
<span class="line"><span>        //...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="阿里代码手册中命名规范" tabindex="-1">阿里代码手册中命名规范 <a class="header-anchor" href="#阿里代码手册中命名规范" aria-label="Permalink to &quot;阿里代码手册中命名规范&quot;">​</a></h2><ol><li><p>【强制】代码中的命名均不能以下划线或美元符号开始，也不能以下划线或美元符号结束。<br><strong>反例</strong> : <code>_name / __name / $Object / name_ / name$ / Object$</code></p></li><li><p>【强制】代码中的命名严禁使用拼音与英文混合的方式，更不允许直接使用中文的方式。说明: 正确的英文拼写和语法可以让阅读者易于理解，避免歧义。注意，即使纯拼音命名方式也要避免采用。<br><strong>正例</strong> : <code>alibaba / taobao / youku / hangzhou</code> 等国际通用的名称，可视同英文。<br><strong>反例</strong> : <code>DaZhePromotion [打折] / getPingfenByName() [评分] / int 某变量 = 3</code></p></li><li><p>【强制】类名使用 <code>UpperCamelCase</code> 风格，必须遵从驼峰形式，但以下情形例外: <code>DO / BO / DTO / VO / AO</code><br><strong>正例</strong> : <code>MarcoPolo / UserDO / XmlService / TcpUdpDeal / TaPromotion</code><br><strong>反例</strong> : <code>macroPolo / UserDo / XMLService / TCPUDPDeal / TAPromotion</code></p></li><li><p>【强制】方法名、参数名、成员变量、局部变量都统一使用 <code>lowerCamelCase</code> 风格，必须遵从驼峰形式。<br><strong>正例</strong> : <code>localValue / getHttpMessage() / inputUserId</code></p></li><li><p>【强制】常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长。<br><strong>正例</strong> : <code>MAX_STOCK_COUNT</code><br><strong>反例</strong> : <code>MAX_COUNT</code></p></li><li><p>【强制】抽象类命名使用 <code>Abstract</code> 或 <code>Base</code> 开头；异常类命名使用 <code>Exception</code> 结尾；测试类命名以它要测试的类的名称开始，以 <code>Test</code> 结尾。</p></li><li><p>【强制】中括号是数组类型的一部分，数组定义如下: <code>String[] args</code>。<br><strong>反例</strong> : 使用 <code>String args[]</code> 的方式来定义。</p></li><li><p>【强制】POJO 类中布尔类型的变量，都不要加 is，否则部分框架解析会引起序列化错误。<br><strong>反例</strong> : 定义为基本数据类型 <code>Boolean isDeleted</code>；的属性，它的方法也是 <code>isDeleted()</code>，RPC 框架在反向解析的时候，“以为”对应的属性名称是 <code>deleted</code>，导致属性获取不到，进而抛出异常。</p></li><li><p>【强制】包名统一使用小写，点分隔符之间有且仅有一个自然语义的英语单词。包名统一使用单数形式，但是类名如果有复数含义，类名可以使用复数形式。<br><strong>正例</strong> : 应用工具类包名为 <code>com.alibaba.open.util</code>、类名为 <code>MessageUtils</code>(此规则参考 spring 的框架结构)</p></li><li><p>【强制】杜绝完全不规范的缩写，避免望文不知义。<br><strong>反例</strong> : <code>AbstractClass</code> “缩写”命名成 <code>AbsClass</code>；<code>condition</code> “缩写”命名成 <code>condi</code>，此类随意缩写严重降低了代码的可阅读性。</p></li><li><p>【推荐】如果使用到了设计模式，建议在类名中体现出具体模式。<br><strong>说明</strong> : 将设计模式体现在名字中，有利于阅读者快速理解架构设计思想。<br><strong>正例</strong> :</p></li></ol><pre><code>\`\`\`
public class OrderFactory;
public class LoginProxy;
public class ResourceObserver;

\`\`\`
</code></pre><ol start="12"><li><p>【推荐】接口类中的方法和属性不要加任何修饰符号(<code>public</code> 也不要加)，保持代码的简洁性，并加上有效的 Javadoc 注释。尽量不要在接口里定义变量，如果一定要定义变量，肯定是与接口方法相关，并且是整个应用的基础常量。<br><strong>正例</strong> : 接口方法签名: <code>void f();</code><br> 接口基础常量表示: <code>String COMPANY = &quot;alibaba&quot;;</code><br><strong>反例</strong> : 接口方法定义: <code>public abstract void f();</code><br><strong>说明</strong> : JDK8 中接口允许有默认实现，那么这个 <code>default</code> 方法，是对所有实现类都有价值的默认实现。</p></li><li><p>接口和实现类的命名有两套规则:</p></li></ol><pre><code>1.  【强制】对于 Service 和 DAO 类，基于 SOA 的理念，暴露出来的服务一定是接口，内部的实现类用 Impl 的后缀与接口区别。  
    **正例** : \`CacheServiceImpl\` 实现 \`CacheService\` 接口。
2.  【推荐】如果是形容能力的接口名称，取对应的形容词做接口名(通常是–able 的形式)。  
    **正例** : \`AbstractTranslator\` 实现 \`Translatable\`。
</code></pre><ol start="14"><li><p>【参考】枚举类名建议带上 Enum 后缀，枚举成员名称需要全大写，单词间用下划线隔开。<br><strong>说明</strong> : 枚举其实就是特殊的常量类，且构造方法被默认强制是私有。<br><strong>正例</strong> : 枚举名字: <code>DealStatusEnum</code>，成员名称: <code>SUCCESS / UNKOWN_REASON</code>。</p></li><li><p>【参考】各层命名规约:</p></li></ol><pre><code>1.  \`Service/DAO\` 层方法命名规约
    1.  获取单个对象的方法用 \`get\` 做前缀。
    2.  获取多个对象的方法用 \`list\` 做前缀。
    3.  获取统计值的方法用 \`count\` 做前缀。
    4.  插入的方法用 \`save\`(推荐)或 \`insert\` 做前缀。
    5.  删除的方法用 \`remove\`(推荐)或 \`delete\` 做前缀。
    6.  修改的方法用 \`update\` 做前缀。
2.  领域模型命名规约
    1.  数据对象: \`xxxDO\`，\`xxx\` 即为数据表名。
    2.  数据传输对象: \`xxxDTO\`，\`xxx\` 为业务领域相关的名称。
    3.  展示对象: \`xxxVO\`，\`xxx\` 一般为网页名称。
    4.  \`POJO\` 是 \`DO/DTO/BO/VO\` 的统称，禁止命名成 \`xxxPOJO\`。
</code></pre><h3 id="常量定义" tabindex="-1">常量定义 <a class="header-anchor" href="#常量定义" aria-label="Permalink to &quot;常量定义&quot;">​</a></h3><ol><li><p>【强制】不允许任何魔法值(即未经定义的常量)直接出现在代码中。<br><strong>反例</strong> :</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> String key = &quot;Id#taobao_&quot; + tradeId;  </span></span>
<span class="line"><span> cache.put(key, value);</span></span></code></pre></div></li><li><p>【强制】long 或者 Long 初始赋值时，必须使用大写的 L，不能是小写的 l，小写容易跟数字 1 混淆，造成误解。 说明: <code>Long a = 2l;</code> 写的是数字的 21，还是 Long 型的 2?</p></li><li><p>【推荐】不要使用一个常量类维护所有常量，应该按常量功能进行归类，分开维护。如: 缓存相关的常量放在类: CacheConsts 下；系统配置相关的常量放在类: ConfigConsts 下。<br><strong>说明</strong> : 大而全的常量类，非得使用查找功能才能定位到修改的常量，不利于理解和维护。</p></li><li><p>【推荐】常量的复用层次有五层: 跨应用共享常量、应用内共享常量、子工程内共享常量、包内共享常量、类内共享常量。</p><ol><li><p>跨应用共享常量: 放置在二方库中，通常是 <code>client.jar</code> 中的 <code>constant</code> 目录下。</p></li><li><p>应用内共享常量: 放置在一方库的 <code>modules</code> 中的 <code>constant</code> 目录下。<br><strong>反例</strong> : 易懂变量也要统一定义成应用内共享常量，两位攻城师在两个类中分别定义了表示“是”的变量:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> 类 A 中: public static final String YES = &quot;yes&quot;;  </span></span>
<span class="line"><span> 类 B 中: public static final String YES = &quot;y&quot;;  </span></span>
<span class="line"><span> A.YES.equals(B.YES)，预期是 true，但实际返回为 false，导致线上问题。</span></span></code></pre></div></li><li><p>子工程内部共享常量: 即在当前子工程的 <code>constant</code> 目录下。</p></li><li><p>包内共享常量: 即在当前包下单独的 <code>constant</code> 目录下。</p></li><li><p>类内共享常量: 直接在类内部 <code>private static final</code> 定义。</p></li></ol></li><li><p>【推荐】如果变量值仅在一个范围内变化，且带有名称之外的延伸属性，定义为枚举类。下面正例中的数字就是延伸信息，表示星期几。<br><strong>正例</strong> : <code>public Enum { MONDAY(1), TUESDAY(2), WEDNESDAY(3), THURSDAY(4), FRIDAY(5), SATURDAY(6), SUNDAY(7);}</code></p></li></ol><h3 id="代码格式" tabindex="-1">代码格式 <a class="header-anchor" href="#代码格式" aria-label="Permalink to &quot;代码格式&quot;">​</a></h3><ol><li><p>【强制】大括号的使用约定。如果是大括号内为空，则简洁地写成{}即可，不需要换行；如果是非空代码块则:</p><ol><li>左大括号前不换行。</li><li>左大括号后换行。</li><li>右大括号前换行。</li><li>右大括号后还有 else 等代码则不换行；表示终止的右大括号后必须换行。</li></ol></li><li><p>【强制】 左小括号和字符之间不出现空格；同样，右小括号和字符之间也不出现空格。详见 第 5 条下方正例提示。<br><strong>反例</strong> : <code>if (空格 a == b 空格)</code></p></li><li><p>【强制】<code>if/for/while/switch/do</code> 等保留字与括号之间都必须加空格。</p></li><li><p>【强制】任何二目、三目运算符的左右两边都需要加一个空格。<br><strong>说明</strong> : 运算符包括赋值运算符=、逻辑运算符&amp;&amp;、加减乘除符号等。</p></li><li><p>【强制】缩进采用 4 个空格，禁止使用 tab 字符。<br><strong>说明</strong> : 如果使用 tab 缩进，必须设置 1 个 tab 为 4 个空格。IDEA 设置 tab 为 4 个空格时，请勿勾选 <code>Use tab character</code>；而在 eclipse 中，必须勾选 <code>insert spaces for tabs</code>。<br><strong>正例</strong> : (涉及 1-5 点)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public static void main(String[] args) {</span></span>
<span class="line"><span>     // 缩进 4 个空格</span></span>
<span class="line"><span>     String say = &quot;hello&quot;;</span></span>
<span class="line"><span>     // 运算符的左右必须有一个空格</span></span>
<span class="line"><span>     int flag = 0;</span></span>
<span class="line"><span>     // 关键词 if 与括号之间必须有一个空格，括号内的 f 与左括号，0 与右括号不需要空格</span></span>
<span class="line"><span>     if (flag == 0) {</span></span>
<span class="line"><span>         System.out.println(say);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     // 左大括号前加空格且不换行；左大括号后换行</span></span>
<span class="line"><span>     if (flag == 1) {</span></span>
<span class="line"><span>         System.out.println(&quot;world&quot;);</span></span>
<span class="line"><span>     // 右大括号前换行，右大括号后有 else，不用换行</span></span>
<span class="line"><span>     } else {</span></span>
<span class="line"><span>         System.out.println(&quot;ok&quot;);</span></span>
<span class="line"><span>     // 在右大括号后直接结束，则必须换行</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span></code></pre></div></li><li><p>【强制】单行字符数限制不超过 120 个，超出需要换行，换行时遵循如下原则:</p></li><li><p>第二行相对第一行缩进 4 个空格，从第三行开始，不再继续缩进，参考示例。</p></li><li><p>运算符与下文一起换行。</p></li><li><p>方法调用的点符号与下文一起换行。</p></li><li><p>在多个参数超长，在逗号后换行。</p></li><li><p>在括号前不要换行，见反例。<br><strong>正例</strong> :</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> StringBuffer sb = new StringBuffer();</span></span>
<span class="line"><span> //超过 120 个字符的情况下，换行缩进 4 个空格，并且方法前的点符号一起换行</span></span>
<span class="line"><span> sb.append(&quot;zi&quot;).append(&quot;xin&quot;)...</span></span>
<span class="line"><span> .append(&quot;huang&quot;)...</span></span>
<span class="line"><span> .append(&quot;huang&quot;)...</span></span>
<span class="line"><span> .append(&quot;huang&quot;);</span></span></code></pre></div><p><strong>反例</strong> :</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> StringBuffer sb = new StringBuffer();</span></span>
<span class="line"><span> //超过 120 个字符的情况下，不要在括号前换行</span></span>
<span class="line"><span> sb.append(&quot;zi&quot;).append(&quot;xin&quot;)...append</span></span>
<span class="line"><span> (&quot;huang&quot;);</span></span>
<span class="line"><span> //参数很多的方法调用可能超过 120 个字符，不要在逗号前换行</span></span>
<span class="line"><span> method(args1, args2, args3, ...</span></span>
<span class="line"><span> , argsX);</span></span></code></pre></div></li><li><p>【强制】方法参数在定义和传入时，多个参数逗号后边必须加空格。<br><strong>正例</strong> : 下例中实参的&quot;a&quot;,后边必须要有一个空格。<code>method(&quot;a&quot;, &quot;b&quot;, &quot;c&quot;);</code></p></li><li><p>【强制】IDE 的 text file encoding 设置为 UTF-8; IDE 中文件的换行符使用 Unix 格式，不要使用 windows 格式。</p></li><li><p>【推荐】没有必要增加若干空格来使某一行的字符与上一行对应位置的字符对齐。<br><strong>正例</strong> :</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> int a = 3;</span></span>
<span class="line"><span> long b = 4L;</span></span>
<span class="line"><span> float c = 5F;</span></span>
<span class="line"><span> StringBuffer sb = new StringBuffer();</span></span></code></pre></div><p><strong>说明</strong> : 增加 sb 这个变量，如果需要对齐，则给 a、b、c 都要增加几个空格，在变量比较多的情况下，是一种累赘的事情。</p></li><li><p>【推荐】方法体内的执行语句组、变量的定义语句组、不同的业务逻辑之间或者不同的语义之间插入一个空行。相同业务逻辑和语义之间不需要插入空行。<br><strong>说明</strong> : 没有必要插入多个空行进行隔开。</p></li></ol><h2 id="扩展-速记java开发中的各种o" tabindex="-1">扩展：速记Java开发中的各种O <a class="header-anchor" href="#扩展-速记java开发中的各种o" aria-label="Permalink to &quot;扩展：速记Java开发中的各种O&quot;">​</a></h2><blockquote><p>最后，通过一张表和图快速对Java中的BO,DTO,DAO,PO,POJO,VO之间的含义，区别以及联系进行梳理。</p></blockquote><table tabindex="0"><thead><tr><th>名称</th><th>使用范围</th><th>解释说明</th></tr></thead><tbody><tr><td>BO</td><td>用于Service,Manager,Business等业务相关类的命名</td><td>Business Object业务处理对象，主要作用是把业务逻辑封装成一个对象。</td></tr><tr><td>DTO</td><td>经过加工后的PO对象，其内部属性可能增加或减少</td><td>Data Transfer Object数据传输对象，主要用于远程调用等需要大量传输数据的地方，例如，可以将一个或多个PO类的部分或全部属性封装为DTO进行传输</td></tr><tr><td>DAO</td><td>用于对数据库进行读写操作的类进行命名</td><td>Data Access Object数据访问对象，主要用来封装对数据库的访问，通过DAO可以将POJO持久化为PO，也可以利用PO封装出VO和DTO</td></tr><tr><td>PO</td><td>Bean,Entity等类的命名</td><td>Persistant Object持久化对象，数据库表中的数据在Java对象中的映射状态，可以简单的理解为一个PO对象即为数据库表中的一条记录</td></tr><tr><td>POJO</td><td>POJO是DO/DTO/BO/VO的统称</td><td>Plain Ordinary Java Object 简单Java对象，它是一个简单的普通Java对象，禁止将类命名为XxxxPOJO</td></tr><tr><td>VO</td><td>通常是视图控制层和模板引擎之间传递的数据对象</td><td>Value Object 值对象，主要用于视图层，视图控制器将视图层所需的属性封装成一个对象，然后用一个VO对象在视图控制器和视图之间进行数据传输。</td></tr><tr><td>AO</td><td>应用层对象</td><td>Application Object，在Web层与Service层之间抽象的复用对象模型，很少用。</td></tr></tbody></table><p>下面将通过一张图来理解上述几种O之间相互转换的关系:</p><p><img src="`+l+'" alt="error.图片加载失败"></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',99)]))}const h=a(i,[["render",t]]);export{g as __pageData,h as default};
