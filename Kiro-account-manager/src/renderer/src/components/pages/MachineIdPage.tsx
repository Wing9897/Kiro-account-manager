import { useEffect, useState } from 'react'
import { useAccountsStore } from '@/store/accounts'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../ui'
import { 
  Fingerprint, 
  RefreshCw, 
  RotateCcw, 
  Copy, 
  Download, 
  Upload, 
  Shield, 
  Link2, 
  Shuffle,
  History,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MachineIdPage() {
  const {
    machineIdConfig,
    currentMachineId,
    originalMachineId,
    originalBackupTime,
    accountMachineIds,
    machineIdHistory,
    accounts,
    setMachineIdConfig,
    refreshCurrentMachineId,
    changeMachineId,
    restoreOriginalMachineId,
    clearMachineIdHistory
  } = useAccountsStore()

  const [isLoading, setIsLoading] = useState(false)
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)
  const [osType, setOsType] = useState<string>('unknown')
  const [customMachineId, setCustomMachineId] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  // 初始化
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        // 获取操作系统类型
        const os = await window.api.machineIdGetOSType()
        setOsType(os)
        
        // 检查管理员权限
        const admin = await window.api.machineIdCheckAdmin()
        setHasAdmin(admin)
        
        // 刷新当前机器码
        await refreshCurrentMachineId()
      } catch (error) {
        console.error('初始化失败:', error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [refreshCurrentMachineId])

  // 复制机器码到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // 随机生成并应用新机器码
  const handleRandomChange = async () => {
    setIsLoading(true)
    try {
      await changeMachineId()
      await refreshCurrentMachineId()
    } finally {
      setIsLoading(false)
    }
  }

  // 应用自定义机器码
  const handleCustomChange = async () => {
    if (!customMachineId.trim()) return
    setIsLoading(true)
    try {
      await changeMachineId(customMachineId.trim())
      await refreshCurrentMachineId()
      setCustomMachineId('')
    } finally {
      setIsLoading(false)
    }
  }

  // 恢复原始机器码
  const handleRestore = async () => {
    setIsLoading(true)
    try {
      await restoreOriginalMachineId()
      await refreshCurrentMachineId()
    } finally {
      setIsLoading(false)
    }
  }

  // 备份机器码到文件
  const handleBackupToFile = async () => {
    if (!currentMachineId) return
    await window.api.machineIdBackupToFile(currentMachineId)
  }

  // 从文件恢复机器码
  const handleRestoreFromFile = async () => {
    setIsLoading(true)
    try {
      const result = await window.api.machineIdRestoreFromFile()
      if (result.success && result.machineId) {
        await changeMachineId(result.machineId)
        await refreshCurrentMachineId()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 请求管理员权限
  const handleRequestAdmin = async () => {
    await window.api.machineIdRequestAdminRestart()
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  // 获取操作系统显示名称
  const getOSName = () => {
    switch (osType) {
      case 'windows': return 'Windows'
      case 'macos': return 'macOS'
      case 'linux': return 'Linux'
      default: return '未知'
    }
  }

  // 获取账户绑定数量
  const boundAccountCount = Object.keys(accountMachineIds).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Fingerprint className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">机器码管理</h1>
          <p className="text-muted-foreground">
            管理设备标识符，防止账号关联和封禁
          </p>
        </div>
      </div>

      {/* 权限警告 */}
      {hasAdmin === false && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-400">需要管理员权限</p>
                  <p className="text-sm text-amber-600 dark:text-amber-500">修改机器码需要以管理员身份运行应用</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleRequestAdmin}>
                <Shield className="h-4 w-4 mr-1" />
                以管理员重启
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 当前机器码 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              当前机器码
              <Badge variant="outline" className="ml-2">{getOSName()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
              {isLoading ? (
                <span className="text-muted-foreground">加载中...</span>
              ) : currentMachineId || (
                <span className="text-muted-foreground">无法获取</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(currentMachineId)}
                disabled={!currentMachineId}
              >
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshCurrentMachineId()}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
                刷新
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 原始机器码备份 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              原始机器码备份
              {originalMachineId && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  已备份
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {originalMachineId ? (
              <>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {originalMachineId}
                </div>
                <p className="text-xs text-muted-foreground">
                  备份时间: {originalBackupTime ? formatTime(originalBackupTime) : '未知'}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(originalMachineId)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRestore}
                    disabled={isLoading || currentMachineId === originalMachineId}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    恢复原始
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                首次修改机器码时将自动备份原始值
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 机器码操作 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            机器码操作
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 随机生成 */}
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium">随机生成新机器码</h4>
              <p className="text-sm text-muted-foreground">
                一键生成随机 UUID 格式的机器码并应用
              </p>
              <Button onClick={handleRandomChange} disabled={isLoading}>
                <Shuffle className="h-4 w-4 mr-2" />
                随机生成并应用
              </Button>
            </div>

            {/* 自定义机器码 */}
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium">自定义机器码</h4>
              <input
                type="text"
                placeholder="输入 UUID 格式机器码..."
                value={customMachineId}
                onChange={(e) => setCustomMachineId(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleCustomChange} 
                disabled={isLoading || !customMachineId.trim()}
                variant="outline"
              >
                应用自定义机器码
              </Button>
            </div>
          </div>

          {/* 文件操作 */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleBackupToFile} disabled={!currentMachineId}>
              <Download className="h-4 w-4 mr-1" />
              导出到文件
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestoreFromFile} disabled={isLoading}>
              <Upload className="h-4 w-4 mr-1" />
              从文件导入
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 自动化设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            自动化设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 切号时自动更换 */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">切换账号时自动更换机器码</p>
              <p className="text-sm text-muted-foreground">
                每次切换账号时自动生成并应用新的机器码
              </p>
            </div>
            <Button
              variant={machineIdConfig.autoSwitchOnAccountChange ? "default" : "outline"}
              size="sm"
              onClick={() => setMachineIdConfig({ autoSwitchOnAccountChange: !machineIdConfig.autoSwitchOnAccountChange })}
            >
              {machineIdConfig.autoSwitchOnAccountChange ? '已开启' : '已关闭'}
            </Button>
          </div>

          {/* 账户绑定 */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <p className="font-medium">账户机器码绑定</p>
              <p className="text-sm text-muted-foreground">
                为每个账户分配唯一的机器码，切换时自动使用
                {boundAccountCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    已绑定 {boundAccountCount} 个账户
                  </Badge>
                )}
              </p>
            </div>
            <Button
              variant={machineIdConfig.bindMachineIdToAccount ? "default" : "outline"}
              size="sm"
              onClick={() => setMachineIdConfig({ bindMachineIdToAccount: !machineIdConfig.bindMachineIdToAccount })}
            >
              {machineIdConfig.bindMachineIdToAccount ? '已开启' : '已关闭'}
            </Button>
          </div>

          {/* 使用绑定的机器码 */}
          {machineIdConfig.bindMachineIdToAccount && (
            <div className="flex items-center justify-between py-2 border-t pl-6">
              <div>
                <p className="font-medium">使用绑定的唯一机器码</p>
                <p className="text-sm text-muted-foreground">
                  关闭时每次切换将随机生成新机器码
                </p>
              </div>
              <Button
                variant={machineIdConfig.useBindedMachineId ? "default" : "outline"}
                size="sm"
                onClick={() => setMachineIdConfig({ useBindedMachineId: !machineIdConfig.useBindedMachineId })}
              >
                {machineIdConfig.useBindedMachineId ? '已开启' : '已关闭'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 绑定的账户机器码列表 */}
      {machineIdConfig.bindMachineIdToAccount && boundAccountCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              账户绑定列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(accountMachineIds).map(([accountId, machineId]) => {
                const account = accounts.get(accountId)
                return (
                  <div key={accountId} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm truncate max-w-[200px]">
                      {account?.email || accountId}
                    </span>
                    <code className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {machineId}
                    </code>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 历史记录 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              变更历史
              <Badge variant="secondary">{machineIdHistory.length}</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? '收起' : '展开'}
              </Button>
              {machineIdHistory.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearMachineIdHistory}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showHistory && (
          <CardContent>
            {machineIdHistory.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...machineIdHistory].reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.action === 'initial' && '初始'}
                        {entry.action === 'manual' && '手动'}
                        {entry.action === 'auto_switch' && '自动'}
                        {entry.action === 'restore' && '恢复'}
                        {entry.action === 'bind' && '绑定'}
                      </Badge>
                      <code className="text-xs truncate max-w-[200px]">{entry.machineId}</code>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                暂无变更记录
              </p>
            )}
          </CardContent>
        )}
      </Card>

      {/* 平台说明 */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">平台说明</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Windows</strong>: 修改注册表 MachineGuid，需要管理员权限</li>
                <li><strong>macOS</strong>: 使用应用层覆盖方式，原生硬件 UUID 无法修改</li>
                <li><strong>Linux</strong>: 修改 /etc/machine-id，需要 root 权限</li>
              </ul>
              <p className="pt-2 text-amber-600 dark:text-amber-400">
                ⚠️ 修改机器码可能影响部分软件的授权，请谨慎操作
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
