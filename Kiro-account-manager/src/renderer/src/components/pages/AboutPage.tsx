import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui'
import { Github, Heart, Code, ExternalLink, User, Coffee, MessageCircle, X } from 'lucide-react'
import kiroLogo from '@/assets/kiro-high-resolution-logo-transparent.png'
import alipayQR from '@/assets/支付宝支付.png'
import wechatQR from '@/assets/微信支付.png'
import groupQR from '@/assets/交流群.png'
import { useAccountsStore } from '@/store/accounts'
import { cn } from '@/lib/utils'

export function AboutPage() {
  const [version, setVersion] = useState('...')
  const [showGroupQR, setShowGroupQR] = useState(false)
  const { darkMode } = useAccountsStore()

  useEffect(() => {
    window.api.getAppVersion().then(setVersion)
  }, [])

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <img 
          src={kiroLogo} 
          alt="Kiro" 
          className={cn("h-20 w-auto mx-auto transition-all", darkMode && "invert brightness-0")} 
        />
        <div>
          <h1 className="text-2xl font-bold">Kiro 账户管理器</h1>
          <p className="text-muted-foreground">版本 {version}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setShowGroupQR(true)}
        >
          <MessageCircle className="h-4 w-4" />
          加入交流群
        </Button>
      </div>

      {/* 交流群弹窗 */}
      {showGroupQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowGroupQR(false)} />
          <div className="relative bg-card rounded-xl p-6 shadow-xl z-10">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowGroupQR(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-lg">扫码加入交流群</h3>
              <div className="bg-[#07C160]/5 rounded-xl p-3 border border-[#07C160]/20">
                <img src={groupQR} alt="交流群" className="w-48 h-48 object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">微信扫码加入</p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">关于本应用</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            Kiro 账户管理器是一个功能强大的 Kiro IDE 多账号管理工具。
            支持多账号快速切换、自动 Token 刷新、分组标签管理、机器码管理等功能，
            帮助你高效管理和使用多个 Kiro 账号。
          </p>
          <p>
            本应用使用 Electron + React + TypeScript 开发，支持 Windows、macOS 和 Linux 平台。
            所有数据均存储在本地，保护你的隐私安全。
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">主要功能</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>多账号管理</strong>：支持添加、编辑、删除多个 Kiro 账号
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>一键切换</strong>：快速切换当前使用的账号
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>自动刷新</strong>：Token 过期前自动刷新，保持登录状态
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>分组与标签</strong>：多选账户批量设置分组/标签，支持多标签
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>隐私模式</strong>：隐藏邮箱和账号敏感信息
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>批量导入</strong>：支持 SSO Token 和 OIDC 凭证批量导入
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">✓</span>
              <strong>机器码管理</strong>：修改设备标识符，防止账号关联封禁
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">✓</span>
              <strong>自动换机器码</strong>：切换账号时自动更换机器码
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">✓</span>
              <strong>账户机器码绑定</strong>：为每个账户分配唯一机器码
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>自动换号</strong>：余额不足时自动切换可用账号
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>代理支持</strong>：支持 HTTP/HTTPS/SOCKS5 代理
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <strong>主题定制</strong>：13 种主题颜色，深色/浅色模式
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="h-4 w-4" />
            技术栈
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Electron', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Vite'].map((tech) => (
              <span 
                key={tech}
                className="px-2.5 py-1 text-xs bg-muted rounded-full text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Author */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            作者
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
                C
              </div>
              <p className="font-medium">chaogei666</p>
            </div>
            <a 
              href="https://github.com/chaogei" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Sponsor */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            赞助支持
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            如果这个项目对你有帮助，可以请作者喝杯咖啡 ☕
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="bg-[#1677FF]/5 rounded-xl p-3 border border-[#1677FF]/20">
                <img src={alipayQR} alt="支付宝" className="w-full aspect-square object-contain rounded-lg" />
              </div>
              <p className="text-sm font-medium text-[#1677FF]">支付宝</p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-[#07C160]/5 rounded-xl p-3 border border-[#07C160]/20">
                <img src={wechatQR} alt="微信支付" className="w-full aspect-square object-contain rounded-lg" />
              </div>
              <p className="text-sm font-medium text-[#07C160]">微信支付</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="h-3 w-3 text-red-500" /> for Kiro users
        </p>
      </div>
    </div>
  )
}
