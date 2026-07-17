# IrradianceMap细节

## 基于图像的shading

### RSM细节
$$
\begin{aligned}
L_o\left(\mathrm{p}, \omega_o\right) &=\int_{\Omega_{\mathrm{patch}}} L_i\left(\mathrm{p}, \omega_i\right) V\left(\mathrm{p}, \omega_i\right) f_r\left(\mathrm{p}, \omega_i, \omega_o\right) \cos \theta_i \mathrm{~d} \omega_i \\
&=\int_{A_{\mathrm{patch}}} L_i(\mathrm{q} \rightarrow \mathrm{p}) V\left(\mathrm{p}, \omega_i\right) f_r\left(\mathrm{p}, \mathrm{q} \rightarrow \mathrm{p}, \omega_o\right) \frac{\cos \theta_p \cos \theta_q}{\|q-p\|^2} \mathrm{~d} A\\
&=\int_{A_{\mathrm{patch}}} f_r \frac{\Phi}{d A} \frac{\cos \theta_p \cos \theta_q}{\|q-p\|^2} \mathrm{d}A\\
&=\frac{albedo}{\pi}  \Phi \frac{\cos \theta_p \cos \theta_q}{\|q-p\|^2}\\
\end{aligned}
$$


## 预计算 Irradiance map

### 1. lightmap
针对静态物体，静态光照

### 2. Light Probe
适用于静态光照环境下的可自由移动的动态物体， 预计算indirectDiffuseLight

>Note:
>* A_{patch} is small
>* $f_r=\rho / \pi$
>* $L_i=f_r \cdot \frac{\Phi}{d A}$ ( $\Phi$ is the incident flux or energy)