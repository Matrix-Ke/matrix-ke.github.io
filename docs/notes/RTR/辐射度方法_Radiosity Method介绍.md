# 辐射度方法_Radiosity Method介绍

## 一. 什么是辐射度？ 

### 从渲染方程到漫反射方程
因为入射辐射亮度与出射方向无关时，任何入射辐射照度都被均匀分布到各个方向。得到漫反射方程；
$$
\begin{aligned}
    L(x \rightarrow \omega) &=L_e(x \rightarrow \omega)+\int_{\Omega_x} f_r\left(x, \omega^{\prime} \rightarrow \omega\right) L\left(x \leftarrow \omega^{\prime}\right) \cos \left(N_x, \omega^{\prime}\right) \mathrm{d} \omega_{\omega^{\prime}}\\
    L(x) & = L_e(x)+\int_{\Omega_x} f_r(x) L\left(x \leftarrow \omega^{\prime}\right) \cos \left(N_x, \omega^{\prime}\right) \mathrm{d} \omega_{\omega^{\prime}} \\
\end{aligned}\\
$$

### 辐射度方程
辐射度（radiosity）表示的是光离开一个表面的辐射能量，在一个漫反射环境中，辐射度和出射辐射亮度的关系可以表述为 $B(x) = πL(x)$ 和 $B_e(x) = πL_e(x)$, 对漫反射方程两边同时乘以 $\pi$ 得到辐射度方程(具体推导见[从辐射度量学理解BRDF](https://zhuanlan.zhihu.com/p/549572824))
$$
\begin{aligned}
    L(x)& =L_e(x)+\rho(x) \int_S K(x, y) L(y) \mathrm{d} A_y \\
    \pi L(x)& =\pi (L_e(x)+\rho(x) \int_S K(x, y) L(y) \mathrm{d} A_y )\\
    B(x)&=B_e(x)+\rho(x) \int_S K(x, y) B(y) \mathrm{d} A_y \\
\end{aligned}
$$

对于任意一个面积 $A_i$ 的曲面片 i，其所有点发射辐射度的平均值 $B_i$ 可以表述为:
**假设条件：**
* 即面积 $A_i$ 的曲面上的平均辐射度等于辐射度 $B(x)$ 在该面面积 $S_i$ 上的积分除 于该面的面积。
* 假设每个曲面 $A_i$ 上各处的辐射度 $B(x)$ 为常数，即 $B(x) =B_i, x ∈ S_i$

$$
\begin{aligned}
    B_i&=\frac{1}{A_i} \int_{S_i} B(x) \mathrm{d} A_x \\
&=B_{e i}+\sum_j B_j \frac{1}{A_i} \int_{S_i} \int_{S_j} \rho(x) K(x, y) \mathrm{d} A_y \mathrm{~d} A_x \\
\end{aligned}
$$



### 经典辐射度线性方程
表面 $A_i$ 的辐射度 $B_i$ 等于该表面自发光辐射照度 $E_i$ 加上该表面反射来自其他表面的辐照度 之和， 数学公式如下：
$$
\begin{aligned}
    B_i &=E_i+\rho_i \sum_{j} B_j F_{j i} \\
    E_i &=B_i - \rho_i \sum_{j} B_j F_{j i} \\
\end{aligned}
$$
其中： 
$$
\begin{aligned}
F_{i j}&=\frac{1}{A_i} \int_{S_i} \int_{S_j} K(x, y) \mathrm{d} A_y \mathrm{~d} A_x \\
\end{aligned}
$$

>Note:
>* $F_{ij}$ 称为形状系数（form factor），它表示曲面 j 向整个空间发射的辐射能量中落于曲面 $i$ 上的分数部分
>* 这里假设： 每个曲面 i 内各处的反射系数为一个常数，即 $ρ(x) = ρi, x ∈ Si$

写成线性方程组的形式如下： 
$$
\left[\begin{array}{cccc}
1-\rho_1 F_{11} & -\rho_1 F_{12} & \cdots & -\rho_1 F_{1 N} \\
-\rho_2 F_{21} & 1-\rho_2 F_{22} & \cdots & -\rho_2 F_{2 N} \\
\vdots & \vdots & \ddots & \vdots \\
-\rho_N F_{N 1} & -\rho_N F_{N 2} & \cdots & 1-\rho_N F_{N N}
\end{array}\right]\left[\begin{array}{c}
B_1 \\
B_2 \\
\vdots \\
B_N
\end{array}\right]=\left[\begin{array}{c}
E_1 \\
E_2 \\
\vdots \\
E_N
\end{array}\right]\\
$$


## 二. 形状系数计算方法

### 半立方体算法（hemi-cube method）

### 蒙特卡罗方法（Monte Carlo method）
todo... 


## 整体算法框架
1. 把场景中物体的表面划分成总计 $N$ 个面片 $s_i$ ；
2. 计算光能在这些面片之间辐射传输的形状因子 $F_{i j}$ ；
3. 求解线性方程组 $B_i=E_i+\rho_i \sum_{j=1}^N B_j F_{j i}, \quad i=1, \cdots, N$ ；
4. 在场景中选择一个视点，根据解得的辐射度 $B_i$ 生成图像；




### 参考资料
1. [theGIBook]()
2. [辐射度方法（Radiosity Method）原理介绍] (https://zhuanlan.zhihu.com/p/479052804)