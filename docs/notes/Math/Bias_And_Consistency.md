#! https://zhuanlan.zhihu.com/p/553388212
# 蒙特卡洛方法的统计量(有效性 无偏性 一致性)评估

**前言：**
 
由于使用蒙特卡洛方法去计算积分数值，需要对估算器的统计量有一个评估。而使用什么方式评估，需要深入了解统计量的各种性质,然后去评估蒙特卡洛方法。


### 无偏性
设$X_1, X_2, ...\, , X_n$是总体$X$的一个样本，$\theta \in H$是包含在总体$X$的分钟中的待估参数，这里$H$是$\theta$的取值范围
**无偏性**：  若估计量$\hat{\theta} = \hat{\theta}(X_1, X_2, ...\, , X_n)$的数学期望$E({\hat{\theta}})$存在，且对任意$\theta \in H$有：

$$E(\hat{\theta})=\theta\\$$

估计量的无偏性是说对于某些样本值,由这一估计量得到的估计值相对于真值来说偏大,有些则偏小.反复将这一估计量使用多次,就“平均”来说其偏差为零.在科学技术中$E(\hat{\theta}) - \theta\\$称为以作为$\theta$的估计的系统误差.无偏估计的实际意义就是无系统误差.

### 有效性
现在来比较参数$\theta$的两个无偏估计量$\hat{\theta_1}$和$\hat{\theta_2}$,如果在样本容量n相同的情况下,$\hat{\theta_1}$的观察值较$\hat{\theta_2}$更密集在真值$\theta$的附近,我们就认为$\hat{\theta_1}$较$\hat{\theta_2}$为理想.由于方差是随机变量取值与其数学期望(此时数学期望 $E(\hat{\theta_1}) = E(\hat{\theta_2})$ )的偏离程度的度量,所以**无偏估计以方差小者为好.这就引出了估计量的有效性这一概念**.

**有效性**:  设${\hat{\theta}}_{1}={\hat{\theta}}_{1}\left(X_{1}\,,X_{2}\,,\cdots,X_{s}\right)$与${\hat{\theta}}_{2}={\hat{\theta}}_{2}\,(\,X_{1}\,,X_{2}\,,\cdots,X_{n}\,)$都是$\theta$的无偏估计量,若对于任意$\theta \in H$,有: 
$$D({\hat{\theta}}_{1})\leq D({\hat{\theta}}_2)\\$$

且至少对于某一个$\theta \in H$上式中的不等号成立,则称$\hat{\theta_1}$较$\hat{\theta_2}$**有效**。

### 一致性(consistence)

前面讲的无偏性与有效性都是在样本容量n固定的前提下提出的.我们自然希望随着样本容量的增大，一个估计量的值稳定于待估参数的真值.这样,对估计量又有下述相合性的要求.

**一致性**： (也有叫相合性)是一个估计量所应具备的最基本的性质。相合估计亦称为一致估计、相容估计，估计量的一种大样本性质为：`当样本容量n充分大时，估计量可以以任意的精确程度逼近被估计参数的真值`

`一致性`  设$\hat{\theta}(X_{1}\,,X_{2}\,,\cdots,X_{n})$为参数$\theta$的估计量,若对于任意$\theta \in H$,当$n \rightarrow \infty$ 时$\mathbf{\hat{\theta}}(X_{1}\,,X_{2}\,,\cdots,X_{n})$依概率收敛于$\theta$,则称$\hat{\theta}$为$\theta$ 的一致估计量.
即﹐若对于任意$\theta \in H$都满足:对于任意$\varepsilon \gt 0$,有:

$$\lim_{n\to \infty}P\{\mid\hat{\theta}-\theta\mid \lt \varepsilon \}=1\\$$

则称$\hat{\theta}$是$\theta$的一致估计量.


### 总结
1. 估计量：用于样本推断总体，估计量是一个随机变量，服从一个分布
2. 无偏：随机变量（估计量）的期望（均值）等于总体的均值
3. 有效性：随机变量（估计量）围绕总体均值的波动（方差）小
4. 一致性：随着样本容量增加（即估计量具体的估计值增加），估计量的方差逐渐减小，依概率收敛到总体均值；`一致性： 渐近无偏性就是一致性`

**Remark**: 一致性对于估计量最重要：随着样本量增加，估计量会收敛致总体的数字特征，这样可以用样本推断总体（扰动项与同期解释变量不相关（无内生性）是OLS为一致估计量的最重要条件）


### 蒙特卡洛方法评估

总体待估参数值
$$
I = \int_{\Omega}f(x)\text{d}x\\
$$
Monte Carlo estimate: 
$$
\hat{I} = V(\Omega)\frac{1}{N}\sum_{i =1}^{N}\frac{f(x_i)}{p(x_i)} \\
$$

**蒙特卡洛方法的无偏性评估**

蒙特卡洛估计量的期望等于总体待估参数值（这里其实就是积分值）

- 用任意一个PDF去采样（`引入任意分布随机变量`），都可以用下面的式子求出积分的近似数值:
$$F_{N}=\frac{1}{N} \sum_{i=1}^{N} \frac{f\left(X_{i}\right)}{p\left(X_{i}\right)}$$
证明：
$$\int f(x) \mathrm{d} x=\frac{1}{N} \sum_{i=1}^{N} \frac{f\left(X_{i}\right)}{p\left(X_{i}\right)} \quad X_{i} \sim p(x)\\$$
过程：
$$
\begin{align*}
E[F_N] &= E\left[{\frac{1}{N}\sum\limits_{i=1}\limits^N\frac{f(X_i)}{p(X_i)}}\right] \\
        &= \frac{1}{N}\sum\limits_{i=1}\limits^N \, E\left[\frac{f(X_i)}{p(X_i)}\right]\\
        &= 1\cdot\int\frac{f(x)}{p(x)}p(x)\text{d}x\\
        &=\int f(x)\text{d}x \\
\end{align*}\\
$$
==**结论：该方法无偏，蒙特卡洛随机变量的期望等于积分值**==



**蒙特卡洛方法的有效性评估**

有效性： 方差越小，有效性越好

构造随机变量： $Y = \frac{f(X)}{p(X)}$
备注： 其中推导使用了Property of Variance: $\sigma^2\left[ \sum\limits_{i=1}\limits^N Y_i\right] = \sum\limits_{i=1}\limits^N \sigma^2 \left[Y_i\right]$
$$
\begin{align*}
  \sigma^2[F_N] &=\sigma^2\left[ {\frac{1}{N}\sum\limits_{i=1}\limits^N\frac{f(X_i)}{p(X_i)}} \right] \\
  &= \frac{1}{N^2} \sum\limits_{i=1}\limits^N \sigma^2  \left[  \frac{f(X_i)}{p(X_i)} \right]  \\
  &= \frac{1}{N^2}\sum\limits_{i=1}\limits^N\sigma^2\left[Y_i\right]\\
  &= \frac{1}{N^2}\left(N \sigma^2[Y] \right)\\
  &= \frac{1}{N} \sigma^2[Y]\\
  所以有：\sigma[F_N] = \frac{1}{\sqrt{N}}\sigma[Y]\\
\end{align*}\\
$$
结论： 
1. 蒙特卡洛估值不稳定来源于随机变量$Y$ 取值的不稳定，即在$Y = \frac{f(x_i)}{p_i}$中$\frac{f(x_i)}{p_i}$值越大，就会是Y的方差越大。 从而影响蒙特卡洛估值的准确度。  所以若p(x)的形状越接近f(x)，则有益于最终结果的收敛。这就是**重要性采样**的思想
2. 要想$E[\frac{f(x_i)}{p_i}]$期望值越小，那么在使用蒙特卡洛求解积分器的时候采样的样本pdf$p(x)$尽量和被积函数$f(x)$相似。 **即$f(x)$值越大的时候，用更高的概率去采样，而对于$f(x)$数值小时候用更低的频率去采样。**
3. 估计值与理论值之间的误差可以通过增加样本数来减小，但收敛速率仅为$O(\sqrt{N})$。

### 重要性采样

蒙特卡洛估值不稳定来源于随机变量$Y$ 取值的不稳定，即：
$$Y = \frac{f(x_i)}{p_i}\\$$
其中$\frac{f(x_i)}{p_i}$值越大，就会是Y的方差越大。 从而影响蒙特卡洛估值的准确度。  
* 重要性采样的思想： **若p(x)的形状越接近f(x)，则有益于最终结果的收敛。**

### todo...

* 蒙特卡洛估计量收敛到正确答案并不足以证明其使用是合理的；良好的收敛速度也很重要。
* veach已经证明： 蒙特卡洛估计器中的误差以所取样本数量的$O({\sqrt{N}})$速度减少。
  * 其中提到在一个维度上虽然标准正交技术收敛速度快$O({\sqrt{N}})$，但是它们的性能随着被积函数维数的增加而呈指数级下降，而蒙特卡洛的收敛速度与维度无关，使得蒙特卡洛成为高维积分唯一实用的数值积分算法。

**参考资料：**
1. [《概率论与数理统计(浙大四版)》]（第七章：参数估计）
2. [《veach_thesis》( Veach 1997 , p. 39)] (http://graphics.stanford.edu/papers/veach_thesis/)