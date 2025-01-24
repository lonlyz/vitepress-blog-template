import{_ as a,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"SQL语言 - SQL题目进阶","description":"","frontmatter":{},"headers":[],"relativePath":"db/sql-lan/sql-lan-leetcode.md","filePath":"db/sql-lan/sql-lan-leetcode.md","lastUpdated":1737706346000}'),l={name:"db/sql-lan/sql-lan-leetcode.md"};function i(t,s,c,o,r,d){return e(),n("div",null,s[0]||(s[0]=[p(`<h1 id="sql语言-sql题目进阶" tabindex="-1">SQL语言 - SQL题目进阶 <a class="header-anchor" href="#sql语言-sql题目进阶" aria-label="Permalink to &quot;SQL语言 - SQL题目进阶&quot;">​</a></h1><blockquote><p>接下来，通过Leetcode上的SQL题目进行进阶吧。@pdai</p></blockquote><h2 id="相关题目" tabindex="-1">相关题目 <a class="header-anchor" href="#相关题目" aria-label="Permalink to &quot;相关题目&quot;">​</a></h2><h3 id="_595-big-countries" tabindex="-1">595. Big Countries <a class="header-anchor" href="#_595-big-countries" aria-label="Permalink to &quot;595\\. Big Countries&quot;">​</a></h3><p><a href="https://leetcode.com/problems/big-countries/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/big-countries/description/</a></p><h4 id="description" tabindex="-1">Description <a class="header-anchor" href="#description" aria-label="Permalink to &quot;Description&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-----------------+------------+------------+--------------+---------------+</span></span>
<span class="line"><span>| name            | continent  | area       | population   | gdp           |</span></span>
<span class="line"><span>+-----------------+------------+------------+--------------+---------------+</span></span>
<span class="line"><span>| Afghanistan     | Asia       | 652230     | 25500100     | 20343000      |</span></span>
<span class="line"><span>| Albania         | Europe     | 28748      | 2831741      | 12960000      |</span></span>
<span class="line"><span>| Algeria         | Africa     | 2381741    | 37100000     | 188681000     |</span></span>
<span class="line"><span>| Andorra         | Europe     | 468        | 78115        | 3712000       |</span></span>
<span class="line"><span>| Angola          | Africa     | 1246700    | 20609294     | 100990000     |</span></span>
<span class="line"><span>+-----------------+------------+------------+--------------+---------------+</span></span></code></pre></div><p>查找面积超过 3,000,000 或者人口数超过 25,000,000 的国家。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+--------------+-------------+--------------+</span></span>
<span class="line"><span>| name         | population  | area         |</span></span>
<span class="line"><span>+--------------+-------------+--------------+</span></span>
<span class="line"><span>| Afghanistan  | 25500100    | 652230       |</span></span>
<span class="line"><span>| Algeria      | 37100000    | 2381741      |</span></span>
<span class="line"><span>+--------------+-------------+--------------+</span></span></code></pre></div><h4 id="sql-schema" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS World;</span></span>
<span class="line"><span>CREATE TABLE World ( NAME VARCHAR ( 255 ), continent VARCHAR ( 255 ), area INT, population INT, gdp INT );</span></span>
<span class="line"><span>INSERT INTO World ( NAME, continent, area, population, gdp )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( &#39;Afghanistan&#39;, &#39;Asia&#39;, &#39;652230&#39;, &#39;25500100&#39;, &#39;203430000&#39; ),</span></span>
<span class="line"><span>    ( &#39;Albania&#39;, &#39;Europe&#39;, &#39;28748&#39;, &#39;2831741&#39;, &#39;129600000&#39; ),</span></span>
<span class="line"><span>    ( &#39;Algeria&#39;, &#39;Africa&#39;, &#39;2381741&#39;, &#39;37100000&#39;, &#39;1886810000&#39; ),</span></span>
<span class="line"><span>    ( &#39;Andorra&#39;, &#39;Europe&#39;, &#39;468&#39;, &#39;78115&#39;, &#39;37120000&#39; ),</span></span>
<span class="line"><span>    ( &#39;Angola&#39;, &#39;Africa&#39;, &#39;1246700&#39;, &#39;20609294&#39;, &#39;1009900000&#39; );</span></span></code></pre></div><h4 id="solution" tabindex="-1">Solution <a class="header-anchor" href="#solution" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT name,</span></span>
<span class="line"><span>    population,</span></span>
<span class="line"><span>    area</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    World</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    area &gt; 3000000</span></span>
<span class="line"><span>    OR population &gt; 25000000;</span></span></code></pre></div><h3 id="_627-swap-salary" tabindex="-1">627. Swap Salary <a class="header-anchor" href="#_627-swap-salary" aria-label="Permalink to &quot;627\\. Swap Salary&quot;">​</a></h3><p><a href="https://leetcode.com/problems/swap-salary/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/swap-salary/description/</a></p><h4 id="description-1" tabindex="-1">Description <a class="header-anchor" href="#description-1" aria-label="Permalink to &quot;Description&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>| id | name | sex | salary |</span></span>
<span class="line"><span>|----|------|-----|--------|</span></span>
<span class="line"><span>| 1  | A    | m   | 2500   |</span></span>
<span class="line"><span>| 2  | B    | f   | 1500   |</span></span>
<span class="line"><span>| 3  | C    | m   | 5500   |</span></span>
<span class="line"><span>| 4  | D    | f   | 500    |</span></span></code></pre></div><p>只用一个 SQL 查询，将 sex 字段反转。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>| id | name | sex | salary |</span></span>
<span class="line"><span>|----|------|-----|--------|</span></span>
<span class="line"><span>| 1  | A    | f   | 2500   |</span></span>
<span class="line"><span>| 2  | B    | m   | 1500   |</span></span>
<span class="line"><span>| 3  | C    | f   | 5500   |</span></span>
<span class="line"><span>| 4  | D    | m   | 500    |</span></span></code></pre></div><h4 id="sql-schema-1" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-1" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS salary;</span></span>
<span class="line"><span>CREATE TABLE salary ( id INT, NAME VARCHAR ( 100 ), sex CHAR ( 1 ), salary INT );</span></span>
<span class="line"><span>INSERT INTO salary ( id, NAME, sex, salary )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( &#39;1&#39;, &#39;A&#39;, &#39;m&#39;, &#39;2500&#39; ),</span></span>
<span class="line"><span>    ( &#39;2&#39;, &#39;B&#39;, &#39;f&#39;, &#39;1500&#39; ),</span></span>
<span class="line"><span>    ( &#39;3&#39;, &#39;C&#39;, &#39;m&#39;, &#39;5500&#39; ),</span></span>
<span class="line"><span>    ( &#39;4&#39;, &#39;D&#39;, &#39;f&#39;, &#39;500&#39; );</span></span></code></pre></div><h4 id="solution-1" tabindex="-1">Solution <a class="header-anchor" href="#solution-1" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UPDATE salary</span></span>
<span class="line"><span>SET sex = CHAR ( ASCII(sex) ^ ASCII( &#39;m&#39; ) ^ ASCII( &#39;f&#39; ) );</span></span></code></pre></div><h3 id="_620-not-boring-movies" tabindex="-1">620. Not Boring Movies <a class="header-anchor" href="#_620-not-boring-movies" aria-label="Permalink to &quot;620\\. Not Boring Movies&quot;">​</a></h3><p><a href="https://leetcode.com/problems/not-boring-movies/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/not-boring-movies/description/</a></p><h4 id="description-2" tabindex="-1">Description <a class="header-anchor" href="#description-2" aria-label="Permalink to &quot;Description&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------+-----------+--------------+-----------+</span></span>
<span class="line"><span>|   id    | movie     |  description |  rating   |</span></span>
<span class="line"><span>+---------+-----------+--------------+-----------+</span></span>
<span class="line"><span>|   1     | War       |   great 3D   |   8.9     |</span></span>
<span class="line"><span>|   2     | Science   |   fiction    |   8.5     |</span></span>
<span class="line"><span>|   3     | irish     |   boring     |   6.2     |</span></span>
<span class="line"><span>|   4     | Ice song  |   Fantacy    |   8.6     |</span></span>
<span class="line"><span>|   5     | House card|   Interesting|   9.1     |</span></span>
<span class="line"><span>+---------+-----------+--------------+-----------+</span></span></code></pre></div><p>查找 id 为奇数，并且 description 不是 boring 的电影，按 rating 降序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------+-----------+--------------+-----------+</span></span>
<span class="line"><span>|   id    | movie     |  description |  rating   |</span></span>
<span class="line"><span>+---------+-----------+--------------+-----------+</span></span>
<span class="line"><span>|   5     | House card|   Interesting|   9.1     |</span></span>
<span class="line"><span>|   1     | War       |   great 3D   |   8.9     |</span></span>
<span class="line"><span>+---------+-----------+--------------+-----------+</span></span></code></pre></div><h4 id="sql-schema-2" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-2" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS cinema;</span></span>
<span class="line"><span>CREATE TABLE cinema ( id INT, movie VARCHAR ( 255 ), description VARCHAR ( 255 ), rating FLOAT ( 2, 1 ) );</span></span>
<span class="line"><span>INSERT INTO cinema ( id, movie, description, rating )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, &#39;War&#39;, &#39;great 3D&#39;, 8.9 ),</span></span>
<span class="line"><span>    ( 2, &#39;Science&#39;, &#39;fiction&#39;, 8.5 ),</span></span>
<span class="line"><span>    ( 3, &#39;irish&#39;, &#39;boring&#39;, 6.2 ),</span></span>
<span class="line"><span>    ( 4, &#39;Ice song&#39;, &#39;Fantacy&#39;, 8.6 ),</span></span>
<span class="line"><span>    ( 5, &#39;House card&#39;, &#39;Interesting&#39;, 9.1 );</span></span></code></pre></div><h4 id="solution-2" tabindex="-1">Solution <a class="header-anchor" href="#solution-2" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    *</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    cinema</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    id % 2 = 1</span></span>
<span class="line"><span>    AND description != &#39;boring&#39;</span></span>
<span class="line"><span>ORDER BY</span></span>
<span class="line"><span>    rating DESC;</span></span></code></pre></div><h3 id="_596-classes-more-than-5-students" tabindex="-1">596. Classes More Than 5 Students <a class="header-anchor" href="#_596-classes-more-than-5-students" aria-label="Permalink to &quot;596\\. Classes More Than 5 Students&quot;">​</a></h3><p><a href="https://leetcode.com/problems/classes-more-than-5-students/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/classes-more-than-5-students/description/</a></p><h4 id="description-3" tabindex="-1">Description <a class="header-anchor" href="#description-3" aria-label="Permalink to &quot;Description&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------+------------+</span></span>
<span class="line"><span>| student | class      |</span></span>
<span class="line"><span>+---------+------------+</span></span>
<span class="line"><span>| A       | Math       |</span></span>
<span class="line"><span>| B       | English    |</span></span>
<span class="line"><span>| C       | Math       |</span></span>
<span class="line"><span>| D       | Biology    |</span></span>
<span class="line"><span>| E       | Math       |</span></span>
<span class="line"><span>| F       | Computer   |</span></span>
<span class="line"><span>| G       | Math       |</span></span>
<span class="line"><span>| H       | Math       |</span></span>
<span class="line"><span>| I       | Math       |</span></span>
<span class="line"><span>+---------+------------+</span></span></code></pre></div><p>查找有五名及以上 student 的 class。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------+</span></span>
<span class="line"><span>| class   |</span></span>
<span class="line"><span>+---------+</span></span>
<span class="line"><span>| Math    |</span></span>
<span class="line"><span>+---------+</span></span></code></pre></div><h4 id="sql-schema-3" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-3" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS courses;</span></span>
<span class="line"><span>CREATE TABLE courses ( student VARCHAR ( 255 ), class VARCHAR ( 255 ) );</span></span>
<span class="line"><span>INSERT INTO courses ( student, class )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( &#39;A&#39;, &#39;Math&#39; ),</span></span>
<span class="line"><span>    ( &#39;B&#39;, &#39;English&#39; ),</span></span>
<span class="line"><span>    ( &#39;C&#39;, &#39;Math&#39; ),</span></span>
<span class="line"><span>    ( &#39;D&#39;, &#39;Biology&#39; ),</span></span>
<span class="line"><span>    ( &#39;E&#39;, &#39;Math&#39; ),</span></span>
<span class="line"><span>    ( &#39;F&#39;, &#39;Computer&#39; ),</span></span>
<span class="line"><span>    ( &#39;G&#39;, &#39;Math&#39; ),</span></span>
<span class="line"><span>    ( &#39;H&#39;, &#39;Math&#39; ),</span></span>
<span class="line"><span>    ( &#39;I&#39;, &#39;Math&#39; );</span></span></code></pre></div><h4 id="solution-3" tabindex="-1">Solution <a class="header-anchor" href="#solution-3" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    class</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    courses</span></span>
<span class="line"><span>GROUP BY</span></span>
<span class="line"><span>    class</span></span>
<span class="line"><span>HAVING</span></span>
<span class="line"><span>    count( DISTINCT student ) &gt;= 5;</span></span></code></pre></div><h3 id="_182-duplicate-emails" tabindex="-1">182. Duplicate Emails <a class="header-anchor" href="#_182-duplicate-emails" aria-label="Permalink to &quot;182\\. Duplicate Emails&quot;">​</a></h3><p><a href="https://leetcode.com/problems/duplicate-emails/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/duplicate-emails/description/</a></p><h4 id="description-4" tabindex="-1">Description <a class="header-anchor" href="#description-4" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>邮件地址表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+---------+</span></span>
<span class="line"><span>| Id | Email   |</span></span>
<span class="line"><span>+----+---------+</span></span>
<span class="line"><span>| 1  | a@b.com |</span></span>
<span class="line"><span>| 2  | c@d.com |</span></span>
<span class="line"><span>| 3  | a@b.com |</span></span>
<span class="line"><span>+----+---------+</span></span></code></pre></div><p>查找重复的邮件地址:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------+</span></span>
<span class="line"><span>| Email   |</span></span>
<span class="line"><span>+---------+</span></span>
<span class="line"><span>| a@b.com |</span></span>
<span class="line"><span>+---------+</span></span></code></pre></div><h4 id="sql-schema-4" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-4" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Person;</span></span>
<span class="line"><span>CREATE TABLE Person ( Id INT, Email VARCHAR ( 255 ) );</span></span>
<span class="line"><span>INSERT INTO Person ( Id, Email )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, &#39;a@b.com&#39; ),</span></span>
<span class="line"><span>    ( 2, &#39;c@d.com&#39; ),</span></span>
<span class="line"><span>    ( 3, &#39;a@b.com&#39; );</span></span></code></pre></div><h4 id="solution-4" tabindex="-1">Solution <a class="header-anchor" href="#solution-4" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    Email</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Person</span></span>
<span class="line"><span>GROUP BY</span></span>
<span class="line"><span>    Email</span></span>
<span class="line"><span>HAVING</span></span>
<span class="line"><span>    COUNT( * ) &gt;= 2;</span></span></code></pre></div><h3 id="_196-delete-duplicate-emails" tabindex="-1">196. Delete Duplicate Emails <a class="header-anchor" href="#_196-delete-duplicate-emails" aria-label="Permalink to &quot;196\\. Delete Duplicate Emails&quot;">​</a></h3><p><a href="https://leetcode.com/problems/delete-duplicate-emails/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/delete-duplicate-emails/description/</a></p><h4 id="description-5" tabindex="-1">Description <a class="header-anchor" href="#description-5" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>邮件地址表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+---------+</span></span>
<span class="line"><span>| Id | Email   |</span></span>
<span class="line"><span>+----+---------+</span></span>
<span class="line"><span>| 1  | a@b.com |</span></span>
<span class="line"><span>| 2  | c@d.com |</span></span>
<span class="line"><span>| 3  | a@b.com |</span></span>
<span class="line"><span>+----+---------+</span></span></code></pre></div><p>删除重复的邮件地址:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+------------------+</span></span>
<span class="line"><span>| Id | Email            |</span></span>
<span class="line"><span>+----+------------------+</span></span>
<span class="line"><span>| 1  | john@example.com |</span></span>
<span class="line"><span>| 2  | bob@example.com  |</span></span>
<span class="line"><span>+----+------------------+</span></span></code></pre></div><h4 id="sql-schema-5" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-5" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><p>与 182 相同。</p><h4 id="solution-5" tabindex="-1">Solution <a class="header-anchor" href="#solution-5" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><p>连接:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DELETE p1</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Person p1,</span></span>
<span class="line"><span>    Person p2</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    p1.Email = p2.Email</span></span>
<span class="line"><span>    AND p1.Id &gt; p2.Id</span></span></code></pre></div><p>子查询:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DELETE</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Person</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    id NOT IN ( SELECT id FROM ( SELECT min( id ) AS id FROM Person GROUP BY email ) AS m );</span></span></code></pre></div><p>应该注意的是上述解法额外嵌套了一个 SELECT 语句，如果不这么做，会出现错误: You can&#39;t specify target table &#39;Person&#39; for update in FROM clause。以下演示了这种错误解法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DELETE</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Person</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    id NOT IN ( SELECT min( id ) AS id FROM Person GROUP BY email );</span></span></code></pre></div><p>参考: <a href="https://stackoverflow.com/questions/45494/mysql-error-1093-cant-specify-target-table-for-update-in-from-clause" target="_blank" rel="noreferrer">pMySQL Error 1093 - Can&#39;t specify target table for update in FROM clause在新窗口打开</a></p><h3 id="_175-combine-two-tables" tabindex="-1">175. Combine Two Tables <a class="header-anchor" href="#_175-combine-two-tables" aria-label="Permalink to &quot;175\\. Combine Two Tables&quot;">​</a></h3><p><a href="https://leetcode.com/problems/combine-two-tables/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/combine-two-tables/description/</a></p><h4 id="description-6" tabindex="-1">Description <a class="header-anchor" href="#description-6" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>Person 表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| Column Name | Type    |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| PersonId    | int     |</span></span>
<span class="line"><span>| FirstName   | varchar |</span></span>
<span class="line"><span>| LastName    | varchar |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>PersonId is the primary key column for this table.</span></span></code></pre></div><p>Address 表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| Column Name | Type    |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>| AddressId   | int     |</span></span>
<span class="line"><span>| PersonId    | int     |</span></span>
<span class="line"><span>| City        | varchar |</span></span>
<span class="line"><span>| State       | varchar |</span></span>
<span class="line"><span>+-------------+---------+</span></span>
<span class="line"><span>AddressId is the primary key column for this table.</span></span></code></pre></div><p>查找 FirstName, LastName, City, State 数据，而不管一个用户有没有填地址信息。</p><h4 id="sql-schema-6" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-6" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Person;</span></span>
<span class="line"><span>CREATE TABLE Person ( PersonId INT, FirstName VARCHAR ( 255 ), LastName VARCHAR ( 255 ) );</span></span>
<span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Address;</span></span>
<span class="line"><span>CREATE TABLE Address ( AddressId INT, PersonId INT, City VARCHAR ( 255 ), State VARCHAR ( 255 ) );</span></span>
<span class="line"><span>INSERT INTO Person ( PersonId, LastName, FirstName )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, &#39;Wang&#39;, &#39;Allen&#39; );</span></span>
<span class="line"><span>INSERT INTO Address ( AddressId, PersonId, City, State )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, 2, &#39;New York City&#39;, &#39;New York&#39; );</span></span></code></pre></div><h4 id="solution-6" tabindex="-1">Solution <a class="header-anchor" href="#solution-6" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><p>使用左外连接。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    FirstName,</span></span>
<span class="line"><span>    LastName,</span></span>
<span class="line"><span>    City,</span></span>
<span class="line"><span>    State</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Person P</span></span>
<span class="line"><span>    LEFT JOIN Address A</span></span>
<span class="line"><span>    ON P.PersonId = A.PersonId;</span></span></code></pre></div><h3 id="_181-employees-earning-more-than-their-managers" tabindex="-1">181. Employees Earning More Than Their Managers <a class="header-anchor" href="#_181-employees-earning-more-than-their-managers" aria-label="Permalink to &quot;181\\. Employees Earning More Than Their Managers&quot;">​</a></h3><p><a href="https://leetcode.com/problems/employees-earning-more-than-their-managers/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/employees-earning-more-than-their-managers/description/</a></p><h4 id="description-7" tabindex="-1">Description <a class="header-anchor" href="#description-7" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>Employee 表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+-------+--------+-----------+</span></span>
<span class="line"><span>| Id | Name  | Salary | ManagerId |</span></span>
<span class="line"><span>+----+-------+--------+-----------+</span></span>
<span class="line"><span>| 1  | Joe   | 70000  | 3         |</span></span>
<span class="line"><span>| 2  | Henry | 80000  | 4         |</span></span>
<span class="line"><span>| 3  | Sam   | 60000  | NULL      |</span></span>
<span class="line"><span>| 4  | Max   | 90000  | NULL      |</span></span>
<span class="line"><span>+----+-------+--------+-----------+</span></span></code></pre></div><p>查找薪资大于其经理薪资的员工信息。</p><h4 id="sql-schema-7" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-7" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Employee;</span></span>
<span class="line"><span>CREATE TABLE Employee ( Id INT, NAME VARCHAR ( 255 ), Salary INT, ManagerId INT );</span></span>
<span class="line"><span>INSERT INTO Employee ( Id, NAME, Salary, ManagerId )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, &#39;Joe&#39;, 70000, 3 ),</span></span>
<span class="line"><span>    ( 2, &#39;Henry&#39;, 80000, 4 ),</span></span>
<span class="line"><span>    ( 3, &#39;Sam&#39;, 60000, NULL ),</span></span>
<span class="line"><span>    ( 4, &#39;Max&#39;, 90000, NULL );</span></span></code></pre></div><h4 id="solution-7" tabindex="-1">Solution <a class="header-anchor" href="#solution-7" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    E1.NAME AS Employee</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Employee E1</span></span>
<span class="line"><span>    INNER JOIN Employee E2</span></span>
<span class="line"><span>    ON E1.ManagerId = E2.Id</span></span>
<span class="line"><span>    AND E1.Salary &gt; E2.Salary;</span></span></code></pre></div><h3 id="_183-customers-who-never-order" tabindex="-1">183. Customers Who Never Order <a class="header-anchor" href="#_183-customers-who-never-order" aria-label="Permalink to &quot;183\\. Customers Who Never Order&quot;">​</a></h3><p><a href="https://leetcode.com/problems/customers-who-never-order/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/customers-who-never-order/description/</a></p><h4 id="description-8" tabindex="-1">Description <a class="header-anchor" href="#description-8" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>Curstomers 表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+-------+</span></span>
<span class="line"><span>| Id | Name  |</span></span>
<span class="line"><span>+----+-------+</span></span>
<span class="line"><span>| 1  | Joe   |</span></span>
<span class="line"><span>| 2  | Henry |</span></span>
<span class="line"><span>| 3  | Sam   |</span></span>
<span class="line"><span>| 4  | Max   |</span></span>
<span class="line"><span>+----+-------+</span></span></code></pre></div><p>Orders 表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+------------+</span></span>
<span class="line"><span>| Id | CustomerId |</span></span>
<span class="line"><span>+----+------------+</span></span>
<span class="line"><span>| 1  | 3          |</span></span>
<span class="line"><span>| 2  | 1          |</span></span>
<span class="line"><span>+----+------------+</span></span></code></pre></div><p>查找没有订单的顾客信息:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-----------+</span></span>
<span class="line"><span>| Customers |</span></span>
<span class="line"><span>+-----------+</span></span>
<span class="line"><span>| Henry     |</span></span>
<span class="line"><span>| Max       |</span></span>
<span class="line"><span>+-----------+</span></span></code></pre></div><h4 id="sql-schema-8" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-8" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Customers;</span></span>
<span class="line"><span>CREATE TABLE Customers ( Id INT, NAME VARCHAR ( 255 ) );</span></span>
<span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Orders;</span></span>
<span class="line"><span>CREATE TABLE Orders ( Id INT, CustomerId INT );</span></span>
<span class="line"><span>INSERT INTO Customers ( Id, NAME )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, &#39;Joe&#39; ),</span></span>
<span class="line"><span>    ( 2, &#39;Henry&#39; ),</span></span>
<span class="line"><span>    ( 3, &#39;Sam&#39; ),</span></span>
<span class="line"><span>    ( 4, &#39;Max&#39; );</span></span>
<span class="line"><span>INSERT INTO Orders ( Id, CustomerId )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, 3 ),</span></span>
<span class="line"><span>    ( 2, 1 );</span></span></code></pre></div><h4 id="solution-8" tabindex="-1">Solution <a class="header-anchor" href="#solution-8" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><p>左外链接</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    C.Name AS Customers</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Customers C</span></span>
<span class="line"><span>    LEFT JOIN Orders O</span></span>
<span class="line"><span>    ON C.Id = O.CustomerId</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    O.CustomerId IS NULL;</span></span></code></pre></div><p>子查询</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    Name AS Customers</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Customers</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    Id NOT IN ( SELECT CustomerId FROM Orders );</span></span></code></pre></div><h3 id="_184-department-highest-salary" tabindex="-1">184. Department Highest Salary <a class="header-anchor" href="#_184-department-highest-salary" aria-label="Permalink to &quot;184\\. Department Highest Salary&quot;">​</a></h3><p><a href="https://leetcode.com/problems/department-highest-salary/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/department-highest-salary/description/</a></p><h4 id="description-9" tabindex="-1">Description <a class="header-anchor" href="#description-9" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>Employee 表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+-------+--------+--------------+</span></span>
<span class="line"><span>| Id | Name  | Salary | DepartmentId |</span></span>
<span class="line"><span>+----+-------+--------+--------------+</span></span>
<span class="line"><span>| 1  | Joe   | 70000  | 1            |</span></span>
<span class="line"><span>| 2  | Henry | 80000  | 2            |</span></span>
<span class="line"><span>| 3  | Sam   | 60000  | 2            |</span></span>
<span class="line"><span>| 4  | Max   | 90000  | 1            |</span></span>
<span class="line"><span>+----+-------+--------+--------------+</span></span></code></pre></div><p>Department 表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+----------+</span></span>
<span class="line"><span>| Id | Name     |</span></span>
<span class="line"><span>+----+----------+</span></span>
<span class="line"><span>| 1  | IT       |</span></span>
<span class="line"><span>| 2  | Sales    |</span></span>
<span class="line"><span>+----+----------+</span></span></code></pre></div><p>查找一个 Department 中收入最高者的信息:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+------------+----------+--------+</span></span>
<span class="line"><span>| Department | Employee | Salary |</span></span>
<span class="line"><span>+------------+----------+--------+</span></span>
<span class="line"><span>| IT         | Max      | 90000  |</span></span>
<span class="line"><span>| Sales      | Henry    | 80000  |</span></span>
<span class="line"><span>+------------+----------+--------+</span></span></code></pre></div><h4 id="sql-schema-9" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-9" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE IF EXISTS Employee;</span></span>
<span class="line"><span>CREATE TABLE Employee ( Id INT, NAME VARCHAR ( 255 ), Salary INT, DepartmentId INT );</span></span>
<span class="line"><span>DROP TABLE IF EXISTS Department;</span></span>
<span class="line"><span>CREATE TABLE Department ( Id INT, NAME VARCHAR ( 255 ) );</span></span>
<span class="line"><span>INSERT INTO Employee ( Id, NAME, Salary, DepartmentId )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, &#39;Joe&#39;, 70000, 1 ),</span></span>
<span class="line"><span>    ( 2, &#39;Henry&#39;, 80000, 2 ),</span></span>
<span class="line"><span>    ( 3, &#39;Sam&#39;, 60000, 2 ),</span></span>
<span class="line"><span>    ( 4, &#39;Max&#39;, 90000, 1 );</span></span>
<span class="line"><span>INSERT INTO Department ( Id, NAME )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, &#39;IT&#39; ),</span></span>
<span class="line"><span>    ( 2, &#39;Sales&#39; );</span></span></code></pre></div><h4 id="solution-9" tabindex="-1">Solution <a class="header-anchor" href="#solution-9" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><p>创建一个临时表，包含了部门员工的最大薪资。可以对部门进行分组，然后使用 MAX() 汇总函数取得最大薪资。</p><p>之后使用连接找到一个部门中薪资等于临时表中最大薪资的员工。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    D.NAME Department,</span></span>
<span class="line"><span>    E.NAME Employee,</span></span>
<span class="line"><span>    E.Salary</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Employee E,</span></span>
<span class="line"><span>    Department D,</span></span>
<span class="line"><span>    ( SELECT DepartmentId, MAX( Salary ) Salary FROM Employee GROUP BY DepartmentId ) M</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    E.DepartmentId = D.Id</span></span>
<span class="line"><span>    AND E.DepartmentId = M.DepartmentId</span></span>
<span class="line"><span>    AND E.Salary = M.Salary;</span></span></code></pre></div><h3 id="_176-second-highest-salary" tabindex="-1">176. Second Highest Salary <a class="header-anchor" href="#_176-second-highest-salary" aria-label="Permalink to &quot;176\\. Second Highest Salary&quot;">​</a></h3><p><a href="https://leetcode.com/problems/second-highest-salary/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/second-highest-salary/description/</a></p><h4 id="description-10" tabindex="-1">Description <a class="header-anchor" href="#description-10" aria-label="Permalink to &quot;Description&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+--------+</span></span>
<span class="line"><span>| Id | Salary |</span></span>
<span class="line"><span>+----+--------+</span></span>
<span class="line"><span>| 1  | 100    |</span></span>
<span class="line"><span>| 2  | 200    |</span></span>
<span class="line"><span>| 3  | 300    |</span></span>
<span class="line"><span>+----+--------+</span></span></code></pre></div><p>查找工资第二高的员工。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| SecondHighestSalary |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| 200                 |</span></span>
<span class="line"><span>+---------------------+</span></span></code></pre></div><p>没有找到返回 null 而不是不返回数据。</p><h4 id="sql-schema-10" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-10" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Employee;</span></span>
<span class="line"><span>CREATE TABLE Employee ( Id INT, Salary INT );</span></span>
<span class="line"><span>INSERT INTO Employee ( Id, Salary )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, 100 ),</span></span>
<span class="line"><span>    ( 2, 200 ),</span></span>
<span class="line"><span>    ( 3, 300 );</span></span></code></pre></div><h4 id="solution-10" tabindex="-1">Solution <a class="header-anchor" href="#solution-10" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><p>为了在没有查找到数据时返回 null，需要在查询结果外面再套一层 SELECT。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    ( SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT 1, 1 ) SecondHighestSalary;</span></span></code></pre></div><h3 id="_177-nth-highest-salary" tabindex="-1">177. Nth Highest Salary <a class="header-anchor" href="#_177-nth-highest-salary" aria-label="Permalink to &quot;177\\. Nth Highest Salary&quot;">​</a></h3><h4 id="description-11" tabindex="-1">Description <a class="header-anchor" href="#description-11" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>查找工资第 N 高的员工。</p><h4 id="sql-schema-11" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-11" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><p>同 176。</p><h4 id="solution-11" tabindex="-1">Solution <a class="header-anchor" href="#solution-11" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE FUNCTION getNthHighestSalary ( N INT ) RETURNS INT BEGIN</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SET N = N - 1;</span></span>
<span class="line"><span>RETURN ( SELECT ( SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT N, 1 ) );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>END</span></span></code></pre></div><h3 id="_178-rank-scores" tabindex="-1">178. Rank Scores <a class="header-anchor" href="#_178-rank-scores" aria-label="Permalink to &quot;178\\. Rank Scores&quot;">​</a></h3><p><a href="https://leetcode.com/problems/rank-scores/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/rank-scores/description/</a></p><h4 id="description-12" tabindex="-1">Description <a class="header-anchor" href="#description-12" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>得分表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+-------+</span></span>
<span class="line"><span>| Id | Score |</span></span>
<span class="line"><span>+----+-------+</span></span>
<span class="line"><span>| 1  | 3.50  |</span></span>
<span class="line"><span>| 2  | 3.65  |</span></span>
<span class="line"><span>| 3  | 4.00  |</span></span>
<span class="line"><span>| 4  | 3.85  |</span></span>
<span class="line"><span>| 5  | 4.00  |</span></span>
<span class="line"><span>| 6  | 3.65  |</span></span>
<span class="line"><span>+----+-------+</span></span></code></pre></div><p>将得分排序，并统计排名。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-------+------+</span></span>
<span class="line"><span>| Score | Rank |</span></span>
<span class="line"><span>+-------+------+</span></span>
<span class="line"><span>| 4.00  | 1    |</span></span>
<span class="line"><span>| 4.00  | 1    |</span></span>
<span class="line"><span>| 3.85  | 2    |</span></span>
<span class="line"><span>| 3.65  | 3    |</span></span>
<span class="line"><span>| 3.65  | 3    |</span></span>
<span class="line"><span>| 3.50  | 4    |</span></span>
<span class="line"><span>+-------+------+</span></span></code></pre></div><h4 id="sql-schema-12" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-12" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS Scores;</span></span>
<span class="line"><span>CREATE TABLE Scores ( Id INT, Score DECIMAL ( 3, 2 ) );</span></span>
<span class="line"><span>INSERT INTO Scores ( Id, Score )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, 3.5 ),</span></span>
<span class="line"><span>    ( 2, 3.65 ),</span></span>
<span class="line"><span>    ( 3, 4.0 ),</span></span>
<span class="line"><span>    ( 4, 3.85 ),</span></span>
<span class="line"><span>    ( 5, 4.0 ),</span></span>
<span class="line"><span>    ( 6, 3.65 );</span></span></code></pre></div><h4 id="solution-12" tabindex="-1">Solution <a class="header-anchor" href="#solution-12" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    S1.score,</span></span>
<span class="line"><span>    COUNT( DISTINCT S2.score ) Rank</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Scores S1</span></span>
<span class="line"><span>    INNER JOIN Scores S2</span></span>
<span class="line"><span>    ON S1.score &lt;= S2.score</span></span>
<span class="line"><span>GROUP BY</span></span>
<span class="line"><span>    S1.id</span></span>
<span class="line"><span>ORDER BY</span></span>
<span class="line"><span>    S1.score DESC;</span></span></code></pre></div><h3 id="_180-consecutive-numbers" tabindex="-1">180. Consecutive Numbers <a class="header-anchor" href="#_180-consecutive-numbers" aria-label="Permalink to &quot;180\\. Consecutive Numbers&quot;">​</a></h3><p><a href="https://leetcode.com/problems/consecutive-numbers/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/consecutive-numbers/description/</a></p><h4 id="description-13" tabindex="-1">Description <a class="header-anchor" href="#description-13" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>数字表:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+----+-----+</span></span>
<span class="line"><span>| Id | Num |</span></span>
<span class="line"><span>+----+-----+</span></span>
<span class="line"><span>| 1  |  1  |</span></span>
<span class="line"><span>| 2  |  1  |</span></span>
<span class="line"><span>| 3  |  1  |</span></span>
<span class="line"><span>| 4  |  2  |</span></span>
<span class="line"><span>| 5  |  1  |</span></span>
<span class="line"><span>| 6  |  2  |</span></span>
<span class="line"><span>| 7  |  2  |</span></span>
<span class="line"><span>+----+-----+</span></span></code></pre></div><p>查找连续出现三次的数字。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+-----------------+</span></span>
<span class="line"><span>| ConsecutiveNums |</span></span>
<span class="line"><span>+-----------------+</span></span>
<span class="line"><span>| 1               |</span></span>
<span class="line"><span>+-----------------+</span></span></code></pre></div><h4 id="sql-schema-13" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-13" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS LOGS;</span></span>
<span class="line"><span>CREATE TABLE LOGS ( Id INT, Num INT );</span></span>
<span class="line"><span>INSERT INTO LOGS ( Id, Num )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( 1, 1 ),</span></span>
<span class="line"><span>    ( 2, 1 ),</span></span>
<span class="line"><span>    ( 3, 1 ),</span></span>
<span class="line"><span>    ( 4, 2 ),</span></span>
<span class="line"><span>    ( 5, 1 ),</span></span>
<span class="line"><span>    ( 6, 2 ),</span></span>
<span class="line"><span>    ( 7, 2 );</span></span></code></pre></div><h4 id="solution-13" tabindex="-1">Solution <a class="header-anchor" href="#solution-13" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    DISTINCT L1.num ConsecutiveNums</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    Logs L1,</span></span>
<span class="line"><span>    Logs L2,</span></span>
<span class="line"><span>    Logs L3</span></span>
<span class="line"><span>WHERE L1.id = l2.id - 1</span></span>
<span class="line"><span>    AND L2.id = L3.id - 1</span></span>
<span class="line"><span>    AND L1.num = L2.num</span></span>
<span class="line"><span>    AND l2.num = l3.num;</span></span></code></pre></div><h3 id="_626-exchange-seats" tabindex="-1">626. Exchange Seats <a class="header-anchor" href="#_626-exchange-seats" aria-label="Permalink to &quot;626\\. Exchange Seats&quot;">​</a></h3><p><a href="https://leetcode.com/problems/exchange-seats/description/" target="_blank" rel="noreferrer">https://leetcode.com/problems/exchange-seats/description/</a></p><h4 id="description-14" tabindex="-1">Description <a class="header-anchor" href="#description-14" aria-label="Permalink to &quot;Description&quot;">​</a></h4><p>seat 表存储着座位对应的学生。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------+---------+</span></span>
<span class="line"><span>|    id   | student |</span></span>
<span class="line"><span>+---------+---------+</span></span>
<span class="line"><span>|    1    | Abbot   |</span></span>
<span class="line"><span>|    2    | Doris   |</span></span>
<span class="line"><span>|    3    | Emerson |</span></span>
<span class="line"><span>|    4    | Green   |</span></span>
<span class="line"><span>|    5    | Jeames  |</span></span>
<span class="line"><span>+---------+---------+</span></span></code></pre></div><p>要求交换相邻座位的两个学生，如果最后一个座位是奇数，那么不交换这个座位上的学生。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>+---------+---------+</span></span>
<span class="line"><span>|    id   | student |</span></span>
<span class="line"><span>+---------+---------+</span></span>
<span class="line"><span>|    1    | Doris   |</span></span>
<span class="line"><span>|    2    | Abbot   |</span></span>
<span class="line"><span>|    3    | Green   |</span></span>
<span class="line"><span>|    4    | Emerson |</span></span>
<span class="line"><span>|    5    | Jeames  |</span></span>
<span class="line"><span>+---------+---------+</span></span></code></pre></div><h4 id="sql-schema-14" tabindex="-1">SQL Schema <a class="header-anchor" href="#sql-schema-14" aria-label="Permalink to &quot;SQL Schema&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DROP TABLE</span></span>
<span class="line"><span>IF</span></span>
<span class="line"><span>    EXISTS seat;</span></span>
<span class="line"><span>CREATE TABLE seat ( id INT, student VARCHAR ( 255 ) );</span></span>
<span class="line"><span>INSERT INTO seat ( id, student )</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>    ( &#39;1&#39;, &#39;Abbot&#39; ),</span></span>
<span class="line"><span>    ( &#39;2&#39;, &#39;Doris&#39; ),</span></span>
<span class="line"><span>    ( &#39;3&#39;, &#39;Emerson&#39; ),</span></span>
<span class="line"><span>    ( &#39;4&#39;, &#39;Green&#39; ),</span></span>
<span class="line"><span>    ( &#39;5&#39;, &#39;Jeames&#39; );</span></span></code></pre></div><h4 id="solution-14" tabindex="-1">Solution <a class="header-anchor" href="#solution-14" aria-label="Permalink to &quot;Solution&quot;">​</a></h4><p>使用多个 union。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    s1.id - 1 AS id,</span></span>
<span class="line"><span>    s1.student</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    seat s1</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    s1.id MOD 2 = 0 UNION</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    s2.id + 1 AS id,</span></span>
<span class="line"><span>    s2.student</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    seat s2</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    s2.id MOD 2 = 1</span></span>
<span class="line"><span>    AND s2.id != ( SELECT max( s3.id ) FROM seat s3 ) UNION</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    s4.id AS id,</span></span>
<span class="line"><span>    s4.student</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    seat s4</span></span>
<span class="line"><span>WHERE</span></span>
<span class="line"><span>    s4.id MOD 2 = 1</span></span>
<span class="line"><span>    AND s4.id = ( SELECT max( s5.id ) FROM seat s5 )</span></span>
<span class="line"><span>ORDER BY</span></span>
<span class="line"><span>    id;</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,179)]))}const b=a(l,[["render",i]]);export{u as __pageData,b as default};
