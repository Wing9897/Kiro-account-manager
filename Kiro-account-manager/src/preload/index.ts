import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 打开外部链接
  openExternal: (url: string): void => {
    ipcRenderer.send('open-external', url)
  },

  // 获取应用版本
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version')
  },

  // 监听 OAuth 回调
  onAuthCallback: (callback: (data: { code: string; state: string }) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: { code: string; state: string }): void => {
      callback(data)
    }
    ipcRenderer.on('auth-callback', handler)
    return () => {
      ipcRenderer.removeListener('auth-callback', handler)
    }
  },

  // 账号管理 - 加载账号数据
  loadAccounts: (): Promise<unknown> => {
    return ipcRenderer.invoke('load-accounts')
  },

  // 账号管理 - 保存账号数据
  saveAccounts: (data: unknown): Promise<void> => {
    return ipcRenderer.invoke('save-accounts', data)
  },

  // 账号管理 - 刷新 Token
  refreshAccountToken: (account: unknown): Promise<unknown> => {
    return ipcRenderer.invoke('refresh-account-token', account)
  },

  // 账号管理 - 检查账号状态
  checkAccountStatus: (account: unknown): Promise<unknown> => {
    return ipcRenderer.invoke('check-account-status', account)
  },

  // 切换账号 - 写入凭证到本地 SSO 缓存
  switchAccount: (credentials: {
    accessToken: string
    refreshToken: string
    clientId: string
    clientSecret: string
    region?: string
    authMethod?: 'IdC' | 'social'
    provider?: 'BuilderId' | 'Github' | 'Google'
  }): Promise<{ success: boolean; error?: string }> => {
    return ipcRenderer.invoke('switch-account', credentials)
  },

  // 文件操作 - 导出到文件
  exportToFile: (data: string, filename: string): Promise<boolean> => {
    return ipcRenderer.invoke('export-to-file', data, filename)
  },

  // 文件操作 - 从文件导入
  importFromFile: (): Promise<string | null> => {
    return ipcRenderer.invoke('import-from-file')
  },

  // 验证凭证并获取账号信息
  verifyAccountCredentials: (credentials: {
    refreshToken: string
    clientId: string
    clientSecret: string
    region?: string
    authMethod?: string  // 'IdC' 或 'social'
    provider?: string    // 'BuilderId', 'Github', 'Google'
  }): Promise<{
    success: boolean
    data?: {
      email: string
      userId: string
      accessToken: string
      refreshToken: string
      expiresIn?: number
      subscriptionType: string
      subscriptionTitle: string
      usage: { current: number; limit: number }
      daysRemaining?: number
      expiresAt?: number
    }
    error?: string
  }> => {
    return ipcRenderer.invoke('verify-account-credentials', credentials)
  },

  // 获取本地 SSO 缓存中当前使用的账号信息
  getLocalActiveAccount: (): Promise<{
    success: boolean
    data?: {
      refreshToken: string
      accessToken?: string
      authMethod?: string
      provider?: string
    }
    error?: string
  }> => {
    return ipcRenderer.invoke('get-local-active-account')
  },

  // 从 Kiro 本地配置导入凭证
  loadKiroCredentials: (): Promise<{
    success: boolean
    data?: {
      accessToken: string
      refreshToken: string
      clientId: string
      clientSecret: string
      region: string
      authMethod: string  // 'IdC' 或 'social'
      provider: string    // 'BuilderId', 'Github', 'Google'
    }
    error?: string
  }> => {
    return ipcRenderer.invoke('load-kiro-credentials')
  },

  // 从 AWS SSO Token (x-amz-sso_authn) 导入账号
  importFromSsoToken: (bearerToken: string, region?: string): Promise<{
    success: boolean
    data?: {
      accessToken: string
      refreshToken: string
      clientId: string
      clientSecret: string
      region: string
      expiresIn?: number
      email?: string
      userId?: string
      idp?: string
      status?: string
    }
    error?: { message: string }
  }> => {
    return ipcRenderer.invoke('import-from-sso-token', bearerToken, region || 'us-east-1')
  },

  // ============ 手动登录 API ============

  // 启动 Builder ID 手动登录
  startBuilderIdLogin: (region?: string): Promise<{
    success: boolean
    userCode?: string
    verificationUri?: string
    expiresIn?: number
    interval?: number
    error?: string
  }> => {
    return ipcRenderer.invoke('start-builder-id-login', region || 'us-east-1')
  },

  // 轮询 Builder ID 授权状态
  pollBuilderIdAuth: (region?: string): Promise<{
    success: boolean
    completed?: boolean
    status?: string
    accessToken?: string
    refreshToken?: string
    clientId?: string
    clientSecret?: string
    region?: string
    expiresIn?: number
    error?: string
  }> => {
    return ipcRenderer.invoke('poll-builder-id-auth', region || 'us-east-1')
  },

  // 取消 Builder ID 登录
  cancelBuilderIdLogin: (): Promise<{ success: boolean }> => {
    return ipcRenderer.invoke('cancel-builder-id-login')
  },

  // 启动 Social Auth 登录 (Google/GitHub)
  startSocialLogin: (provider: 'Google' | 'Github'): Promise<{
    success: boolean
    loginUrl?: string
    state?: string
    error?: string
  }> => {
    return ipcRenderer.invoke('start-social-login', provider)
  },

  // 交换 Social Auth token
  exchangeSocialToken: (code: string, state: string): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
    profileArn?: string
    expiresIn?: number
    authMethod?: string
    provider?: string
    error?: string
  }> => {
    return ipcRenderer.invoke('exchange-social-token', code, state)
  },

  // 取消 Social Auth 登录
  cancelSocialLogin: (): Promise<{ success: boolean }> => {
    return ipcRenderer.invoke('cancel-social-login')
  },

  // 监听 Social Auth 回调
  onSocialAuthCallback: (callback: (data: { code?: string; state?: string; error?: string }) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: { code?: string; state?: string; error?: string }): void => {
      callback(data)
    }
    ipcRenderer.on('social-auth-callback', handler)
    return () => {
      ipcRenderer.removeListener('social-auth-callback', handler)
    }
  },

  // 代理设置
  setProxy: (enabled: boolean, url: string): Promise<{ success: boolean; error?: string }> => {
    return ipcRenderer.invoke('set-proxy', enabled, url)
  },

  // ============ 机器码管理 API ============

  // 获取操作系统类型
  machineIdGetOSType: (): Promise<'windows' | 'macos' | 'linux' | 'unknown'> => {
    return ipcRenderer.invoke('machine-id:get-os-type')
  },

  // 获取当前机器码
  machineIdGetCurrent: (): Promise<{
    success: boolean
    machineId?: string
    error?: string
    requiresAdmin?: boolean
  }> => {
    return ipcRenderer.invoke('machine-id:get-current')
  },

  // 设置新机器码
  machineIdSet: (newMachineId: string): Promise<{
    success: boolean
    machineId?: string
    error?: string
    requiresAdmin?: boolean
  }> => {
    return ipcRenderer.invoke('machine-id:set', newMachineId)
  },

  // 生成随机机器码
  machineIdGenerateRandom: (): Promise<string> => {
    return ipcRenderer.invoke('machine-id:generate-random')
  },

  // 检查管理员权限
  machineIdCheckAdmin: (): Promise<boolean> => {
    return ipcRenderer.invoke('machine-id:check-admin')
  },

  // 请求管理员权限重启
  machineIdRequestAdminRestart: (): Promise<boolean> => {
    return ipcRenderer.invoke('machine-id:request-admin-restart')
  },

  // 备份机器码到文件
  machineIdBackupToFile: (machineId: string): Promise<boolean> => {
    return ipcRenderer.invoke('machine-id:backup-to-file', machineId)
  },

  // 从文件恢复机器码
  machineIdRestoreFromFile: (): Promise<{
    success: boolean
    machineId?: string
    error?: string
  }> => {
    return ipcRenderer.invoke('machine-id:restore-from-file')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
