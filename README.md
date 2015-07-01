# PandaCUT 熊猫切图

一个photoshop CC的javascript脚本,可以帮助任何被PS切图折磨的人
进行自动的,批量的,跨越图层的切图.


![image](https://github.com/menzi11/PandaCUT/blob/master/thePandaWhoCUT.png)


## 为什么需要一个新的切图工具?

世界上有不少切图工具,但大部分是基于图层的切图,但事实上,我们经常会遇到
跨越多个图层的切图需求,例如从后向前ABC三个图层,PandaCUT可以实现先隐藏B图层,
打开A和C图层导出,再隐藏A图层,打开C和B图层导出.如此批量导出图片,几乎是全自动化!
你还可以设置无论怎么导出都不隐藏的图层,例如背景图层,曲线/亮度对比度调整图层.


## 那么,如何使用呢?


我们来假设一种情况,老板让我绘制一个按钮,于是我先画了一个按钮的底板:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/1.png)


看上去它是这样的:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/1.png)


然后,我又在它上面画了一个按钮:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/3.png)


在它上面,我写了一行字:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/4.png)


于是这个图看上去是这样的:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/5.png)


当然,有按钮抬起来,就有按下去,于是我又新建了两个图层,分别是按钮和按钮上的文字:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/6.png)


按钮按下去的状态是这样的:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/7.png)



###现在,我们需要导出它了!

首先，我们先需要创建一个组，这个组的位置需要在最外层，和背景同层，把这个组的名字改成“@PandaCUT_MASKS”，然后我们可以把需要截图的区域用一个矩形(矢量)来覆盖，给这个承载矢量矩形的图层创建起一个已@开头的名字（如@button1），就像这样:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/9.png)
![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/8.png)

我们给矢量矩形图层起的名字,被作为一个标示,任何在"@PandaCUT_MASKS"组以下的图层中,
一旦出现了名字中有@button1字样的图层,即会被导出在@button1图片中.无论这个图层的层叠状态
如何,无论图层是矢量图层,文字图层,调整图层.


在本例中,我们要导出两个元素,一个是button1,另一个是button1_down,那么,我们就这样写:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/10.png)




写好之后,点击photoshop上方菜单,执行PandaCUT!


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/11.png)
![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/12.png)


点击PandaCUT后,你需要告诉它你想把图标导到哪里去,一个文件夹选框会弹出:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/13.png)


选择您想要的目录后,让熊猫来工作吧! 当它完成工作后,您将看到以下提示:


![image](https://github.com/jiangduoduo/PandaCUT/blob/master/doc/14.png)



按照相同



这个名字将作为标志用来检索其他图层的名字里是否包含这个标志，来确定在截这个区域的时候哪个图层需要显示，蒙版的大小和位置则用来确定截图的位置，蒙版的其他属性则不重要，我们可以同时创建多各蒙版。

然后给需要被某一个蒙版截图的图层或组的名字加上蒙版标志，每一个图层或组可以加多个标志，并且这些标志可以加到名字里的任何位置。

所有没加过蒙版标志或特殊标志的图层或组，在截图时则一定会被隐藏。

特殊标志“@PandaCUT_NEVERHIDE”
可以给图层或组的名字里加上这个标志，这样无论在截哪一个蒙版区域的时候，这个图层或组都会显示出来。

在photoshop里顺序点击 文件->脚本->浏览，然后选择你本机PandaCUT.jsx的路径，运行后会弹出文件夹选择框，选择一个你用来保存导出图片的文件夹，然后等程序提示运行完成就可以了。

导出图片的名字将和蒙版名字一样，但是会自动去掉@字符，格式则为png。

Example
打开TestForPandaCUT.psd，可以看到有4个蒙版分别是:@green,@black,@yellow,@red; 运行脚本最终会得到4个png,这4个png分别和4个蒙版大小宽高相同，名字相同（除去@）。
可以看到每个截图都只有自己名字的颜色和紫色，因为紫色的图层都是@PandaCUT_NEVERHIDE的所以每个截图都会有紫色。

##English Doc ?

I will do it futrue.

------------

如果有任何意见或建议或使用不明之处,可以提issues,或者可发我的邮箱:
nanxingjiang@gmail.com

另外我们在北京招聘热爱金属材质和拟真风格的设计师,如果你有兴趣,也可向这个邮箱发邮件.
或者您有朋友,同学,学生,徒弟亲戚是热爱金属材质和拟真风格的设计师,想找工作,也可以联系我们.
