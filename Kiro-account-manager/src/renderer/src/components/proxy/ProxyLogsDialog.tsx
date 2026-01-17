import { X, Trash2, Download } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../ui'

interface LogEntry {
  time: string
  path: string
  status: number
  tokens?: number
}

interface ProxyLogsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  logs: LogEntry[]
  onClearLogs: () => void
  isEn: boolean
}

export function ProxyLogsDialog({
  open,
  onOpenChange,
  logs,
  onClearLogs,
  isEn
}: ProxyLogsDialogProps) {
  if (!open) return null

  const handleExport = () => {
    const content = logs.map(log => 
      `${log.time}\t${log.path}\t${log.status}${log.tokens ? `\t${log.tokens} tokens` : ''}`
    ).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proxy-logs-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const successCount = logs.filter(l => l.status < 400).length
  const errorCount = logs.filter(l => l.status >= 400).length
  const totalTokens = logs.reduce((sum, l) => sum + (l.tokens || 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <Card className="relative w-[700px] max-h-[80vh] shadow-2xl border-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="pb-3 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{isEn ? 'Request Logs' : '请求日志'}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} disabled={logs.length === 0}>
                <Download className="h-4 w-4 mr-1" />
                {isEn ? 'Export' : '导出'}
              </Button>
              <Button variant="outline" size="sm" onClick={onClearLogs} disabled={logs.length === 0}>
                <Trash2 className="h-4 w-4 mr-1" />
                {isEn ? 'Clear' : '清空'}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <span>{isEn ? 'Total' : '总计'}: <Badge variant="secondary">{logs.length}</Badge></span>
            <span>{isEn ? 'Success' : '成功'}: <Badge className="bg-green-500/20 text-green-600">{successCount}</Badge></span>
            <span>{isEn ? 'Error' : '错误'}: <Badge className="bg-red-500/20 text-red-600">{errorCount}</Badge></span>
            <span>{isEn ? 'Tokens' : 'Token'}: <Badge variant="outline">{totalTokens.toLocaleString()}</Badge></span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[calc(80vh-120px)] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {isEn ? 'No logs yet' : '暂无日志'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium">{isEn ? 'Time' : '时间'}</th>
                    <th className="text-left p-2 font-medium">{isEn ? 'Path' : '路径'}</th>
                    <th className="text-center p-2 font-medium">{isEn ? 'Status' : '状态'}</th>
                    <th className="text-right p-2 font-medium">Tokens</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="border-b border-muted/30 hover:bg-muted/30">
                      <td className="p-2 text-muted-foreground whitespace-nowrap">{log.time}</td>
                      <td className="p-2 truncate max-w-[300px]" title={log.path}>{log.path}</td>
                      <td className="p-2 text-center">
                        <Badge className={log.status >= 400 ? 'bg-red-500/20 text-red-600' : 'bg-green-500/20 text-green-600'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-right text-muted-foreground">{log.tokens?.toLocaleString() || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
