import{_ as s,c as a,ai as p,o as t}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/alg/alg-tree-hafman-1.png",e="/vitepress-blog-template/images/alg/alg-tree-hafman-2.png",i="/vitepress-blog-template/images/alg/alg-tree-hafman-5.jpeg",g=JSON.parse('{"title":"树 - 哈夫曼树(Huffman Tree)","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-tree-hafman.md","filePath":"algorithm/alg-basic-tree-hafman.md","lastUpdated":1737706346000}'),c={name:"algorithm/alg-basic-tree-hafman.md"};function r(o,n,d,u,m,f){return t(),a("div",null,n[0]||(n[0]=[p('<h1 id="树-哈夫曼树-huffman-tree" tabindex="-1">树 - 哈夫曼树(Huffman Tree) <a class="header-anchor" href="#树-哈夫曼树-huffman-tree" aria-label="Permalink to &quot;树 - 哈夫曼树(Huffman Tree)&quot;">​</a></h1><blockquote><p>哈夫曼又称最优二叉树, 是一种带权路径长度最短的二叉树。(注意带权路径WPL是指叶子节点，很多网上的文章有误导) @pdai</p></blockquote><h2 id="哈夫曼树相关名词" tabindex="-1">哈夫曼树相关名词 <a class="header-anchor" href="#哈夫曼树相关名词" aria-label="Permalink to &quot;哈夫曼树相关名词&quot;">​</a></h2><p>先看一棵哈夫曼树: (哈夫曼树推理是通过叶子节点，所以理解的时候需要忽略非叶子节点，很多文章在这点上有误导)</p><p><img src="'+l+'" alt="error.图片加载失败"></p><ul><li><p><code>路径与路径长度</code>: 从树中一个节点到另一个节点之间的分支构成了两个节点之间的路径，路径上的分支数目称作路径长度。若规定根节点位于第一层，则根节点到第H层的节点的路径长度为H-1。如到40 的路径长度为1；30的路径长度为2；20的路径长度为3。</p></li><li><p><code>节点的权</code>: 将树中的节点赋予一个某种含义的数值作为该节点的权值，该值称为节点的权；</p></li><li><p><code>带权路径长度</code>: 从根节点到某个节点之间的路径长度与该节点的权的乘积。例如上图节点10的路径长度为3,它的带权路径长度为10 * 3 = 30；</p></li><li><p><code>树的带权路径长度</code>: 树的带权路径长度为所有叶子节点的带权路径长度之和，称为WPL。上图的WPL = 1x40+2x30+3x10+3x20 = 190，而哈夫曼树就是树的带权路径最小的二叉树。</p></li></ul><h2 id="哈夫曼树的构建" tabindex="-1">哈夫曼树的构建 <a class="header-anchor" href="#哈夫曼树的构建" aria-label="Permalink to &quot;哈夫曼树的构建&quot;">​</a></h2><p>假设有n个权值，则构造出的哈夫曼树有n个叶子结点。 n个权值分别设为 w1、w2、…、wn，哈夫曼树的构造规则为:</p><ul><li>将w1、w2、…，wn看成是有n 棵树的森林(每棵树仅有一个结点)；</li><li>在森林中选出根结点的权值最小的两棵树进行合并，作为一棵新树的左、右子树，且新树的根结点权值为其左、右子树根结点权值之和；</li><li>从森林中删除选取的两棵树，并将新树加入森林；</li><li>重复上面两步，直到森林中只剩一棵树为止，该树即为所求得的哈夫曼树。</li></ul><p>上图中，它的叶子节点为{10，20，30，40}，以这4个权值构建哈夫曼树的过程为:</p><p><img src="'+e+'" alt="error.图片加载失败"></p><h2 id="哈夫曼编码" tabindex="-1">哈夫曼编码 <a class="header-anchor" href="#哈夫曼编码" aria-label="Permalink to &quot;哈夫曼编码&quot;">​</a></h2><p>为{10，20，30，40}这四个权值构建了哈夫曼编码后，我们可以由如下规则获得它们的哈夫曼编码:</p><p>从根节点到每一个叶子节点的路径上，左分支记为0，右分支记为1，将这些0与1连起来即为叶子节点的哈夫曼编码。如下图:</p><table tabindex="0"><thead><tr><th>(字母)权值</th><th>编码</th></tr></thead><tbody><tr><td>10</td><td>100</td></tr><tr><td>20</td><td>101</td></tr><tr><td>30</td><td>11</td></tr><tr><td>40</td><td>0</td></tr><tr><td>由此可见，出现频率越高的字母(也即权值越大)，其编码越短。这便使编码之后的字符串的平均长度、期望值降低，从而达到无损压缩数据的目的。</td><td></td></tr></tbody></table><p>具体流程如下:</p><p><img src="'+i+`" alt="error.图片加载失败"></p><h2 id="哈夫曼树的实现" tabindex="-1">哈夫曼树的实现 <a class="header-anchor" href="#哈夫曼树的实现" aria-label="Permalink to &quot;哈夫曼树的实现&quot;">​</a></h2><p>哈夫曼树的重点是如何构造哈夫曼树。本文构造哈夫曼时，用到了&quot;(二叉堆)最小堆&quot;。下面对哈夫曼树进行讲解。</p><ul><li>哈夫曼树节点</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HuffmanNode implements Comparable, Cloneable {</span></span>
<span class="line"><span>    protected int key;              // 权值</span></span>
<span class="line"><span>    protected HuffmanNode left;     // 左孩子</span></span>
<span class="line"><span>    protected HuffmanNode right;    // 右孩子</span></span>
<span class="line"><span>    protected HuffmanNode parent;   // 父结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected HuffmanNode(int key, HuffmanNode left, HuffmanNode right, HuffmanNode parent) {</span></span>
<span class="line"><span>        this.key = key;</span></span>
<span class="line"><span>        this.left = left;</span></span>
<span class="line"><span>        this.right = right;</span></span>
<span class="line"><span>        this.parent = parent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object clone() {</span></span>
<span class="line"><span>        Object obj=null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            obj = (HuffmanNode)super.clone();//Object 中的clone()识别出你要复制的是哪一个对象。    </span></span>
<span class="line"><span>        } catch(CloneNotSupportedException e) {</span></span>
<span class="line"><span>            System.out.println(e.toString());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return obj;    </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int compareTo(Object obj) {</span></span>
<span class="line"><span>        return this.key - ((HuffmanNode)obj).key;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>哈夫曼树</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.List;</span></span>
<span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.Collections;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Huffman {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private HuffmanNode mRoot;	// 根结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* </span></span>
<span class="line"><span>	 * 创建Huffman树</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * @param 权值数组</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public Huffman(int a[]) {</span></span>
<span class="line"><span>        HuffmanNode parent = null;</span></span>
<span class="line"><span>		MinHeap heap;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 建立数组a对应的最小堆</span></span>
<span class="line"><span>		heap = new MinHeap(a);</span></span>
<span class="line"><span>	 </span></span>
<span class="line"><span>		for(int i=0; i&lt;a.length-1; i++) {   </span></span>
<span class="line"><span>        	HuffmanNode left = heap.dumpFromMinimum();  // 最小节点是左孩子</span></span>
<span class="line"><span>        	HuffmanNode right = heap.dumpFromMinimum(); // 其次才是右孩子</span></span>
<span class="line"><span>	 </span></span>
<span class="line"><span>			// 新建parent节点，左右孩子分别是left/right；</span></span>
<span class="line"><span>			// parent的大小是左右孩子之和</span></span>
<span class="line"><span>			parent = new HuffmanNode(left.key+right.key, left, right, null);</span></span>
<span class="line"><span>			left.parent = parent;</span></span>
<span class="line"><span>			right.parent = parent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			// 将parent节点数据拷贝到&quot;最小堆&quot;中</span></span>
<span class="line"><span>			heap.insert(parent);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		mRoot = parent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 销毁最小堆</span></span>
<span class="line"><span>		heap.destroy();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 前序遍历&quot;Huffman树&quot;</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private void preOrder(HuffmanNode tree) {</span></span>
<span class="line"><span>		if(tree != null) {</span></span>
<span class="line"><span>			System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>			preOrder(tree.left);</span></span>
<span class="line"><span>			preOrder(tree.right);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void preOrder() {</span></span>
<span class="line"><span>		preOrder(mRoot);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 中序遍历&quot;Huffman树&quot;</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private void inOrder(HuffmanNode tree) {</span></span>
<span class="line"><span>		if(tree != null) {</span></span>
<span class="line"><span>			inOrder(tree.left);</span></span>
<span class="line"><span>			System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>			inOrder(tree.right);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void inOrder() {</span></span>
<span class="line"><span>		inOrder(mRoot);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 后序遍历&quot;Huffman树&quot;</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private void postOrder(HuffmanNode tree) {</span></span>
<span class="line"><span>		if(tree != null)</span></span>
<span class="line"><span>		{</span></span>
<span class="line"><span>			postOrder(tree.left);</span></span>
<span class="line"><span>			postOrder(tree.right);</span></span>
<span class="line"><span>			System.out.print(tree.key+&quot; &quot;);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void postOrder() {</span></span>
<span class="line"><span>		postOrder(mRoot);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 销毁Huffman树</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private void destroy(HuffmanNode tree) {</span></span>
<span class="line"><span>		if (tree==null)</span></span>
<span class="line"><span>			return ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (tree.left != null)</span></span>
<span class="line"><span>			destroy(tree.left);</span></span>
<span class="line"><span>		if (tree.right != null)</span></span>
<span class="line"><span>			destroy(tree.right);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		tree=null;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void destroy() {</span></span>
<span class="line"><span>		destroy(mRoot);</span></span>
<span class="line"><span>		mRoot = null;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 打印&quot;Huffman树&quot;</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * key        -- 节点的键值 </span></span>
<span class="line"><span>	 * direction  --  0，表示该节点是根节点;</span></span>
<span class="line"><span>	 *               -1，表示该节点是它的父结点的左孩子;</span></span>
<span class="line"><span>	 *                1，表示该节点是它的父结点的右孩子。</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private void print(HuffmanNode tree, int key, int direction) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if(tree != null) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if(direction==0)	// tree是根节点</span></span>
<span class="line"><span>				System.out.printf(&quot;%2d is root\\n&quot;, tree.key);</span></span>
<span class="line"><span>			else				// tree是分支节点</span></span>
<span class="line"><span>				System.out.printf(&quot;%2d is %2d&#39;s %6s child\\n&quot;, tree.key, key, direction==1?&quot;right&quot; : &quot;left&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			print(tree.left, tree.key, -1);</span></span>
<span class="line"><span>			print(tree.right,tree.key,  1);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void print() {</span></span>
<span class="line"><span>		if (mRoot != null)</span></span>
<span class="line"><span>			print(mRoot, mRoot.key, 0);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>最小堆</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MinHeap {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private List&lt;HuffmanNode&gt; mHeap;		// 存放堆的数组</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* </span></span>
<span class="line"><span>	 * 创建最小堆</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * 参数说明：</span></span>
<span class="line"><span>	 *     a -- 数据所在的数组</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	protected MinHeap(int a[]) {</span></span>
<span class="line"><span>		mHeap = new ArrayList&lt;HuffmanNode&gt;();</span></span>
<span class="line"><span>		// 初始化数组</span></span>
<span class="line"><span>		for(int i=0; i&lt;a.length; i++) {</span></span>
<span class="line"><span>		    HuffmanNode node = new HuffmanNode(a[i], null, null, null);</span></span>
<span class="line"><span>			mHeap.add(node);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 从(size/2-1) --&gt; 0逐次遍历。遍历之后，得到的数组实际上是一个最小堆。</span></span>
<span class="line"><span>		for (int i = a.length / 2 - 1; i &gt;= 0; i--)</span></span>
<span class="line"><span>			filterdown(i, a.length-1);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* </span></span>
<span class="line"><span>	 * 最小堆的向下调整算法</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * 注：数组实现的堆中，第N个节点的左孩子的索引值是(2N+1)，右孩子的索引是(2N+2)。</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * 参数说明：</span></span>
<span class="line"><span>	 *     start -- 被下调节点的起始位置(一般为0，表示从第1个开始)</span></span>
<span class="line"><span>	 *     end   -- 截至范围(一般为数组中最后一个元素的索引)</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	protected void filterdown(int start, int end) {</span></span>
<span class="line"><span>		int c = start; 	 	// 当前(current)节点的位置</span></span>
<span class="line"><span>		int l = 2*c + 1; 	// 左(left)孩子的位置</span></span>
<span class="line"><span>		HuffmanNode tmp = mHeap.get(c);	// 当前(current)节点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		while(l &lt;= end) {</span></span>
<span class="line"><span>			// &quot;l&quot;是左孩子，&quot;l+1&quot;是右孩子</span></span>
<span class="line"><span>			if(l &lt; end &amp;&amp; (mHeap.get(l).compareTo(mHeap.get(l+1))&gt;0))</span></span>
<span class="line"><span>				l++;		// 左右两孩子中选择较小者，即mHeap[l+1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			int cmp = tmp.compareTo(mHeap.get(l));</span></span>
<span class="line"><span>			if(cmp &lt;= 0)</span></span>
<span class="line"><span>				break;		//调整结束</span></span>
<span class="line"><span>			else {</span></span>
<span class="line"><span>				mHeap.set(c, mHeap.get(l));</span></span>
<span class="line"><span>				c = l;</span></span>
<span class="line"><span>				l = 2*l + 1;   </span></span>
<span class="line"><span>			}       </span></span>
<span class="line"><span>		}   </span></span>
<span class="line"><span>		mHeap.set(c, tmp);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 最小堆的向上调整算法(从start开始向上直到0，调整堆)</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * 注：数组实现的堆中，第N个节点的左孩子的索引值是(2N+1)，右孩子的索引是(2N+2)。</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * 参数说明：</span></span>
<span class="line"><span>	 *     start -- 被上调节点的起始位置(一般为数组中最后一个元素的索引)</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	protected void filterup(int start) {</span></span>
<span class="line"><span>		int c = start;			// 当前节点(current)的位置</span></span>
<span class="line"><span>		int p = (c-1)/2;		// 父(parent)结点的位置 </span></span>
<span class="line"><span>		HuffmanNode tmp = mHeap.get(c);	// 当前(current)节点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		while(c &gt; 0) {</span></span>
<span class="line"><span>			int cmp = mHeap.get(p).compareTo(tmp);</span></span>
<span class="line"><span>			if(cmp &lt;= 0)</span></span>
<span class="line"><span>				break;</span></span>
<span class="line"><span>			else {</span></span>
<span class="line"><span>				mHeap.set(c, mHeap.get(p));</span></span>
<span class="line"><span>				c = p;</span></span>
<span class="line"><span>				p = (p-1)/2;   </span></span>
<span class="line"><span>			}       </span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		mHeap.set(c, tmp);</span></span>
<span class="line"><span>	} </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>	/* </span></span>
<span class="line"><span>	 * 将node插入到二叉堆中</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	protected void insert(HuffmanNode node) {</span></span>
<span class="line"><span>		int size = mHeap.size();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		mHeap.add(node);	// 将&quot;数组&quot;插在表尾</span></span>
<span class="line"><span>		filterup(size);		// 向上调整堆</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 交换两个HuffmanNode节点的全部数据</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private void swapNode(int i, int j) {</span></span>
<span class="line"><span>		HuffmanNode tmp = mHeap.get(i);</span></span>
<span class="line"><span>		mHeap.set(i, mHeap.get(j));</span></span>
<span class="line"><span>		mHeap.set(j, tmp);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* </span></span>
<span class="line"><span>	 * 新建一个节点，并将最小堆中最小节点的数据复制给该节点。</span></span>
<span class="line"><span>	 * 然后除最小节点之外的数据重新构造成最小堆。</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 * 返回值：</span></span>
<span class="line"><span>	 *     失败返回null。</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	protected HuffmanNode dumpFromMinimum() {</span></span>
<span class="line"><span>		int size = mHeap.size();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 如果&quot;堆&quot;已空，则返回</span></span>
<span class="line"><span>		if(size == 0)</span></span>
<span class="line"><span>			return null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 将&quot;最小节点&quot;克隆一份，将克隆得到的对象赋值给node</span></span>
<span class="line"><span>		HuffmanNode node = (HuffmanNode)mHeap.get(0).clone();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 交换&quot;最小节点&quot;和&quot;最后一个节点&quot;</span></span>
<span class="line"><span>		mHeap.set(0, mHeap.get(size-1));</span></span>
<span class="line"><span>		// 删除最后的元素</span></span>
<span class="line"><span>		mHeap.remove(size-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (mHeap.size() &gt; 1)</span></span>
<span class="line"><span>			filterdown(0, mHeap.size()-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		return node;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 销毁最小堆</span></span>
<span class="line"><span>	protected void destroy() {</span></span>
<span class="line"><span>		mHeap.clear();</span></span>
<span class="line"><span>		mHeap = null;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="哈夫曼树测试" tabindex="-1">哈夫曼树测试 <a class="header-anchor" href="#哈夫曼树测试" aria-label="Permalink to &quot;哈夫曼树测试&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HuffmanTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private static final int a[]= {5,6,8,7,15};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span>		int i;</span></span>
<span class="line"><span>		Huffman tree;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		System.out.print(&quot;== 添加数组: &quot;);</span></span>
<span class="line"><span>		for(i=0; i&lt;a.length; i++) </span></span>
<span class="line"><span>			System.out.print(a[i]+&quot; &quot;);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>		// 创建数组a对应的Huffman树</span></span>
<span class="line"><span>		tree = new Huffman(a);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		System.out.print(&quot;\\n== 前序遍历: &quot;);</span></span>
<span class="line"><span>		tree.preOrder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		System.out.print(&quot;\\n== 中序遍历: &quot;);</span></span>
<span class="line"><span>		tree.inOrder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		System.out.print(&quot;\\n== 后序遍历: &quot;);</span></span>
<span class="line"><span>		tree.postOrder();</span></span>
<span class="line"><span>		System.out.println();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		System.out.println(&quot;== 树的详细信息: &quot;);</span></span>
<span class="line"><span>		tree.print();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 销毁二叉树</span></span>
<span class="line"><span>		tree.destroy();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><p><a href="https://www.cnblogs.com/QG-whz/p/5175485.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/QG-whz/p/5175485.html</a></p></li><li><p><a href="https://www.cnblogs.com/skywang12345/p/3706833.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/skywang12345/p/3706833.html</a></p></li><li><p><a href="http://c.biancheng.net/view/3398.html" target="_blank" rel="noreferrer">http://c.biancheng.net/view/3398.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,30)]))}const H=s(c,[["render",r]]);export{g as __pageData,H as default};
