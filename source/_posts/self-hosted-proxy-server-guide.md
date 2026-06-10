---
title: 从零开始搭建自己的代理服务器 —— 以 Akile 为例
date: 2026-06-11 03:00:00
tags:
  - 代理
  - VPS
  - 搭建
  - Akile
  - Xray
  - VLESS
  - 翻墙
categories:
  - 网络
  - 教程
---

## 写在前面

> **免责声明：** 本文仅用于技术学习与交流目的，旨在帮助读者了解服务器搭建与网络代理的基本原理。请遵守所在地区的法律法规，合理合法地使用相关技术。文中所涉及的服务商信息仅供参考，请以官方最新信息为准。

你好呀！如果你正在看这篇文章，说明你可能受够了那些三天两头跑路、速度慢得像蜗牛、还时不时要你续费的"机场"服务了。别急，今天我就手把手教你从零开始，搭建一个属于自己的代理服务器。

整个过程其实没你想的那么难——哪怕你从来没有碰过服务器，跟着这篇教程一步步来，半小时内就能搞定。准备好了吗？Let's go! 🚀

<!-- more -->

---

## 为什么自建比买现成的好？

市面上代理服务那么多，为什么还要折腾自己搭？这个问题问得好，原因其实很现实：

### 1. 稳定性碾压"机场"

你有没有遇到过：突然有一天，机场公告说"线路调整"，然后就再也连不上了？自建服务器不存在这个问题——只要你的 VPS 还在跑，它就一直在线。没有老板跑路的风险，没有"线路优化"导致的突然断连。

### 2. 速度完全取决于你自己

买机场的时候，你和几百甚至几千人共享带宽，高峰时段卡成 PPT 是常态。自建的话，VPS 的带宽是独享的，体验天差地别。

### 3. 安全性更高

你的数据经过别人的服务器，隐私风险是实实在在的。自建服务器，从 VPS 到客户端，全链路你自己掌控，不用担心中间人看到你的浏览记录。

### 4. 长期成本可能更低

很多机场月费十几二十块，一年下来也不少。自建服务器的 VPS 费用其实不高，特别是用一些性价比高的服务商，算下来可能比买机场还划算。

### 5. 技术成长

说真的，搭建和维护一个代理服务器的过程，能让你学到很多关于 Linux、网络、加密的知识。这些技能以后都有用！

---

## 选购服务器指南

这是最关键的一步——选对了服务器，后面的体验会好很多。别被各种参数吓到，其实就几个要点。

### 推荐服务商：Akile

这里推荐 **[Akile](https://akile.ai)** 作为服务商，原因如下：

- **线路质量好**：Akile 的 CN2 GIA 和优化线路在圈内口碑不错，特别是移动和联通用户
- **价格合理**：经常有优惠活动，性价比高
- **支持多种线路**：CN2 GIA、CMI、联通 9929、联通 4837 等都有覆盖
- **支付方式方便**：支持支付宝等国内常用支付方式

> 💡 价格会变动，请以 **akile.ai 官网** 实际显示的价格为准，别完全照搬文中的参考价哦。

### 按运营商选线路

不同的运营商（移动/电信/联通）走的最优线路不一样，选错了可能速度拉胯：

| 运营商 | 推荐线路 | 理由 |
|--------|----------|------|
| **中国移动** | CMI / CN2 GIA | 移动走 CMI 回程延迟最低，CN2 GIA 也是不错的选择 |
| **中国电信** | CN2 GIA | 电信用户的首选，延迟低、丢包少、速度快 |
| **中国联通** | 联通 9929（AS9929）| 9929 是联通的精品线路，质量接近 CN2 GIA |

> 🎯 **小贴士：** 不确定自己是什么运营商？打开 [ipip.net](https://ipip.net) 或者在命令行运行 `curl ip.sb` 就能看到。

### 推荐配置

对于个人日常使用（看视频、刷网页、开发用），推荐以下配置：

```bash
CPU:    1 核
内存:   1 GB
硬盘:   10-20 GB SSD
带宽:   1 Gbps
流量:   按需选择（推荐 500GB-1TB/月）
```

这个配置跑 Xray 绑绑有余，完全够个人使用。

> ⚠️ **注意：** 如果你要看 4K 视频或者有大量下载需求，建议选带宽更大、流量更多的方案。具体价格请到 [Akile 官网](https://akile.ai) 查看。

---

## 服务器初始化

买到 VPS 后，你会收到一封邮件，里面有服务器 IP 地址、SSH 端口（默认 22）、root 密码。现在我们来连接它。

### 第一步：SSH 连接

**Linux / macOS 用户：**

打开终端，输入：

```bash
ssh root@你的服务器IP
```

第一次连接会提示确认指纹，输入 `yes` 回车，然后输入收到的密码。注意：输入密码时屏幕上不会显示任何字符（包括星号），这是正常的，输完直接回车就行。

**Windows 用户：**

推荐使用 [PuTTY](https://www.putty.org/)：
1. 下载安装 PuTTY
2. 打开后在 "Host Name" 栏输入你的服务器 IP
3. 点击 "Open"
4. 输入 `root`，回车
5. 输入密码（同样不显示），回车

或者如果你用 Windows 10/11，可以直接用 PowerShell 或 Windows Terminal 里的 SSH 命令，用法和 Linux 一样。

### 第二步：修改 root 密码（可选但推荐）

```bash
passwd
```

按提示输入两次新密码即可。建议设置一个强密码。

### 第三步：更新系统

连上服务器后，第一件事就是更新系统软件包：

**Debian / Ubuntu：**

```bash
apt update && apt upgrade -y
```

**CentOS / AlmaLinux：**

```bash
yum update -y
```

这一步可能需要几分钟，取决于服务器的速度和软件包的数量。去倒杯水，回来就好了 ☕

### 第四步：开启 BBR 加速（强烈推荐）

BBR 是 Google 开发的拥塞控制算法，能显著提升网络传输速度。一条命令搞定：

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf && echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf && sysctl -p
```

验证是否生效：

```bash
sysctl net.ipv4.tcp_congestion_control
```

输出 `net.ipv4.tcp_congestion_control = bbr` 就说明成功了。

---

## 安装 Xray

### 什么是 Xray？

[Xray-core](https://xtls.github.io/) 是目前最主流的代理核心之一，原作者是 V2Ray 的作者（也就是那位传说中的 @v2ray）。相比 V2Ray，Xray 支持更多先进协议，特别是 **VLESS + Reality**，被公认为目前最安全的方案。

### 使用 Xray-install 一键脚本安装

虽然 Xray 不难装，但手动配置确实有点繁琐。这里推荐使用 [Xray-install](https://github.com/XTLS/Xray-install) 官方安装脚本，一键搞定：

```bash
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
```

这个脚本会自动：
- 下载并安装最新版 Xray-core
- 创建 systemd 服务，实现开机自启
- 安装默认配置文件

安装完成后，你会看到类似这样的输出：

```bash
Installation complete!
Installed: /usr/local/bin/xray
Config:    /usr/local/etc/xray/config.json
```

> 🎉 **恭喜！** 你已经成功安装了 Xray。不过别急着庆祝，我们还需要配置它才能真正用起来。

---

## 配置 VLESS + Reality（最安全最推荐的方案）

### 为什么选 VLESS + Reality？

简单来说，这是目前最安全的方案，没有之一。

- **VLESS**：比 VMess 更轻量，没有加密层的额外开销（加密交给 TLS）
- **Reality**：一种革命性的技术，你的代理流量看起来就像在访问一个正常的网站，GFW 根本分辨不出来

以前的方案（如 VLESS+TLS）需要你有一个域名，而且要配置证书。Reality 不需要域名，不需要证书，也不需要伪装网站——它直接"借用"一个真实网站的 TLS 证书，完美伪装。

### 第一步：生成必要参数


然后生成 UUID（用户唯一标识）：

```bash
/usr/local/bin/xray uuid
```

记下输出的 UUID，后面要用到。

### 第二步：生成 Reality 密钥对

```bash
/usr/local/bin/xray x25519
```

输出类似：

```text
Private key: XXXXXXXXXX
Public key:  YYYYYYYYYY
```

> 🔑 **请务必妥善保存 Private key（私钥）！** 客户端配置需要 Public key（公钥），而私钥只能留在服务器上。

### 第三步：生成 shortId

shortId 是一个随机字符串，用于验证客户端身份。可以随便生成一个 16 位的十六进制字符串：

```bash
openssl rand -hex 16
```

### 第四步：选择目标网站（Dest）

Reality 需要一个"伪装目标"——也就是你流量看起来要去访问的网站。这个网站需要：
- 支持 TLSv1.3 和 H2
- 不能使用 CDN
- 最好是国内能访问的

推荐的目标网站：

- `www.microsoft.com`
- `www.samsung.com`
- `www.apple.com`
- `www.yahoo.com`

这里我们用 `www.microsoft.com` 作为示例。

### 第五步：编辑配置文件

现在编辑 Xray 的配置文件：

```bash
nano /usr/local/etc/xray/config.json
```

清空原有内容，粘贴以下配置（记得替换标注的部分）：

```json
{
    "log": {
        "loglevel": "warning"
    },
    "inbounds": [
        {
            "listen": "0.0.0.0",
            "port": 443,
            "protocol": "vless",
            "settings": {
                "clients": [
                    {
                        "id": "你的UUID",
                        "flow": "xtls-rprx-vision"
                    }
                ],
                "decryption": "none"
            },
            "streamSettings": {
                "network": "tcp",
                "security": "reality",
                "realitySettings": {
                    "show": false,
                    "dest": "www.microsoft.com:443",
                    "xver": 0,
                    "serverNames": [
                        "www.microsoft.com"
                    ],
                    "privateKey": "你的私钥",
                    "shortIds": [
                        "你的shortId"
                    ]
                }
            },
            "sniffing": {
                "enabled": true,
                "destOverride": [
                    "http",
                    "tls",
                    "quic"
                ]
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "tag": "direct"
        },
        {
            "protocol": "blackhole",
            "tag": "block"
        }
    ],
    "routing": {
        "rules": [
            {
                "type": "field",
                "outboundTag": "block",
                "protocol": ["bittorrent"]
            }
        ]
    }
}
```

**你需要替换的内容：**

| 占位符 | 替换为 |
|--------|--------|
| `你的UUID` | 第一步生成的 UUID |
| `你的私钥` | 第二步生成的 Private key |
| `你的shortId` | 第三步生成的 shortId |

修改完毕后，保存并退出（在 nano 中按 `Ctrl + O`，回车确认，再按 `Ctrl + X` 退出）。

### 第六步：重启 Xray 使配置生效

```bash
systemctl restart xray
```

检查运行状态：

```bash
systemctl status xray
```

看到 `active (running)` 就说明运行正常了。

### 第七步：开启防火墙端口

如果你的服务器开启了防火墙，需要放行 443 端口。

**使用 ufw（Ubuntu/Debian）：**

```bash
ufw allow 443/tcp
ufw reload
```

**使用 firewalld（CentOS/AlmaLinux）：**

```bash
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload
```

> ⚠️ **重要：** 部分云服务商（如阿里云、腾讯云）还有安全组设置，需要在控制台放行 443 端口，否则即使服务器防火墙放了，流量也进不来。

---

## 客户端配置

好了，服务端配置完毕！现在轮到客户端了。不同平台的推荐客户端如下：

### Windows —— Nekoray

[Nekoray](https://github.com/MatsuriDayo/nekoray) 是目前 Windows 上最好用的代理客户端之一，支持 Xray-core，界面简洁。

**安装步骤：**

1. 从 GitHub Releases 下载最新的 `nekoray-*-win64.zip`
2. 解压到任意文件夹
3. 运行 `nekoray.exe`
4. 首次运行会提示选择核心，选 **Xray**

**添加服务器配置：**

1. 点击菜单栏 `Program` -> `Preference`，将 Core 路径设为 Xray
2. 点击 `Program` -> `Add Vmess / VLESS`
3. 选择 **VLESS**
4. 填写：
   - **地址**：你的服务器 IP
   - **端口**：443
   - **ID**：你的 UUID
   - **Flow**：`xtls-rprx-vision`
   - **传输协议**：tcp
   - **安全性**：reality
   - **服务器名称 (SNI)**：www.microsoft.com
   - **公钥**：你的 Public key
   - **ShortId**：你的 shortId
5. 点击确定保存

右键点击配置，选择 `Start`，然后开启系统代理或 TUN 模式就可以使用了。

### macOS —— V2rayU

[V2rayU](https://github.com/yanue/V2rayU) 是 macOS 上的优秀客户端。

**安装步骤：**

1. 从 GitHub Releases 下载 `.dmg` 文件
> ⚠️ **注意：** V2rayU 更新较慢，也可考虑 [V2rayN macOS 版](https://github.com/2dust/v2rayN) 或 [ClashX Meta](https://github.com/MetaCubeX/ClashX.Meta)。
2. 安装后打开 V2rayU
3. 点击菜单栏的小灯泡图标 -> `服务器设置`

**添加服务器：**

1. 点击左下角 `+` -> 选择 VLESS
2. 填写服务器信息（和 Windows 一样）
3. 保存后，选择该服务器
4. 开启代理即可

### Android —— v2rayNG

[v2rayNG](https://github.com/2dust/v2rayNG) 是 Android 上最流行的客户端。

**安装步骤：**

1. 从 GitHub Releases 下载 APK 安装
2. 打开 app，点击右上角 `+` 号

**手动添加配置：**

1. 选择 `手动输入[VLESS]`
2. 填写以下信息：
   - **地址**：你的服务器 IP
   - **端口**：443
   - **ID (UUID)**：你的 UUID
   - **传输协议**：tcp
   - **Flow**：xtls-rprx-vision
   - **TLS**：reality
   - **服务器名称 (SNI)**：www.microsoft.com
   - **公钥**：你的 Public key
   - **ShortId**：你的 shortId
3. 点击右上角保存
4. 回到主界面，点击右下角的 V 图标启动

### iOS —— Shadowrocket（小火箭）

iOS 因为 App Store 的限制，选择比较少。推荐 **Shadowrocket**（小火箭），需要在外区 App Store 购买。

**添加节点：**

1. 打开 Shadowrocket -> 点击右上角 `+`
2. 选择类型为 **VLESS**
3. 填写所有参数（和其他平台一样）
4. 保存后，点击开关连接

> 💡 **没有外区 Apple ID？** 可以考虑使用 [Loon](https://www.loonios.com) 或 [Stash](https://stash.run) 等其他代理工具，它们有的可以在国区使用，或者你可以注册一个美区 Apple ID。

---

## 速度测试和优化建议

### 测试速度

连接成功后，最简单的方法是打开浏览器访问 [Speedtest](https://www.speedtest.net) 测试一下。一般来说：

- **CN2 GIA / CMI 线路**：延迟 30-80ms，下载速度通常能跑满带宽
- **普通线路**：延迟 100-300ms，速度可能差一些

也可以用命令行工具测试，先安装 speedtest-cli：

```bash
# 在本地电脑安装（Ubuntu/Debian）
sudo apt install speedtest-cli

# 运行测试
speedtest-cli
```

### 优化建议

1. **确保 BBR 已开启**：前面已经讲过，这是最简单有效的优化
2. **更换端口**：443 是 HTTPS 端口，有时候会被重点关照。如果速度不好，可以尝试换成 8443 或其他端口（记得同步修改服务器防火墙和客户端配置）
3. **调整 MTU 值**：某些情况下调整 MTU 可以改善丢包问题
4. **选择合适的客户端模式**：
   - **PAC / 规则模式**：国内网站直连，国外走代理，日常使用推荐
   - **全局模式**：所有流量走代理，看特定内容时用
   - **TUN 模式**：最干净的全局代理，推荐开发者使用
5. **多线路测试**：如果速度不理想，可以考虑换一条线路或换一个机房

### 一键检测脚本

如果想更详细地了解你的服务器表现，可以用这个脚本：

```bash
curl -sL https://raw.githubusercontent.com/mack-a/v2ray-agent/master/install.sh | bash
```

它会帮你检测线路、延迟、丢包率等信息。

---

## 常见问题 FAQ

### Q1：连上了但是打不开网页？

**可能的原因和解决方法：**

- 检查客户端配置是否正确，特别是 UUID、公钥、ShortId 有没有填错
- 确认服务器防火墙（ufw/firewalld）和云服务商安全组都放行了端口
- 尝试 `ping 你的服务器IP` 看看是否能通

```bash
# 在本地电脑测试连接
ping 你的服务器IP
```

### Q2：速度很慢怎么办？

- 检查是否开启了 BBR
- 尝试换一个目标网站（dest），不同的目标网站可能影响握手速度
- 检查本地网络，WiFi 信号不好也会影响速度
- 考虑更换线路或机房

### Q3：证书问题 / TLS 握手失败？

Reality 方案一般不会遇到这个问题，因为它是直接借用目标网站的证书。如果出现错误：

- 检查目标网站是否仍然支持 TLSv1.3 和 H2
- 确认 `serverNames` 和 `dest` 配置一致
- 尝试更换目标网站

### Q4：Xray 服务挂了怎么办？

```bash
# 查看 Xray 状态
systemctl status xray

# 查看日志
journalctl -u xray --no-pager -n 50

# 重启服务
systemctl restart xray

# 如果配置有误，检查配置文件语法
/usr/local/bin/xray run -test -c /usr/local/etc/xray/config.json
```

### Q5：如何更新 Xray 到最新版本？

```bash
# 重新运行安装脚本即可自动更新
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install

# 重启服务
systemctl restart xray
```

### Q6：想添加多个用户/设备怎么办？

编辑配置文件，在 `clients` 数组中添加多个 `id` 即可：

```json
"clients": [
    {
        "id": "用户1的UUID",
        "flow": "xtls-rprx-vision"
    },
    {
        "id": "用户2的UUID",
        "flow": "xtls-rprx-vision"
    }
]
```

每个用户需要各自生成一个 UUID。修改后记得重启 Xray。

### Q7：可以搭建多个不同的代理配置吗？

当然可以！在 `inbounds` 数组中添加多个入站配置即可，每个配置可以使用不同的端口和参数。不过对于大多数个人用户来说，一个 VLESS + Reality 配置就完全够用了。

### Q8：安全性如何保证？

- VLESS + Reality 本身已经非常安全，流量被检测到的概率极低
- 定期更新 Xray 到最新版本
- 不要把配置信息泄露给不信任的人
- 定期检查服务器日志，看是否有异常连接

---

## 写在最后

恭喜你！跟着这篇文章走下来，你已经成功搭建了自己的代理服务器。回顾一下我们做了什么：

1. ✅ 了解了自建代理的优势
2. ✅ 选购了合适的 VPS
3. ✅ 初始化了服务器环境
4. ✅ 安装并配置了 Xray
5. ✅ 设置了 VLESS + Reality 协议
6. ✅ 在各种设备上配置了客户端
7. ✅ 学会了基本的优化和排错

整个过程大约 20-30 分钟，对于新手来说可能需要更长一些（毕竟第一次嘛），但绝对没有想象中那么难。

如果你在搭建过程中遇到了问题，可以：
- 仔细检查每一步的配置，UUID、公钥、ShortId 这些参数一定要准确
- 查看 Xray 的日志排查问题
- 在评论区留言，我会尽力解答

最后再说一句：技术本身是中性的，关键在于使用它的人。希望这篇文章能帮助你更好地理解网络技术的原理。如果觉得有用，欢迎分享给需要的朋友！👋

---

> 📝 **最后提醒：** 服务器和线路的价格会随时变动，本文中的价格信息仅供参考，请以 [Akile 官网](https://akile.ai) 实际显示为准。
