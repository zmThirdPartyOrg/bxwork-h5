export interface ReqVo<T> {
  cmdType: string
  rtnMsg: string
  content: T
  rtnCode: string
  token: string
  userRoles?: UserRole[]
}
interface UserRole {
  roleId: number
  roleName: string
  roleType: string
  userId: number
}

// 部门
export interface DepItem {
  depId: number
  depName: string
}

// 系统配置
export interface SysConfig {
  dict: SysConfigDict[]
  para: Para[]
  module: any[]
}

interface Para {
  paraCode: string
  paraName: string
  paraValue?: string
  parentCode?: string
  paraType?: string
  priority: number
}

export interface SysConfigDict {
  dictId: number
  type: string
  shortCode: string
  longName: string
  priority: number
  parentId: number
}
