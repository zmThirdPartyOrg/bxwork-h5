export interface Userinfo {
  userRoles: UserRole[]
  cmdType: string
  rtnMsg: string
  content: UserinfoContent
  rtnCode: string
  token: string
}

export interface UserinfoContent {
  userId: number
  realName: string
  gender: string
  phone: string
  mobile: string
  email: string
  userType: string
  jobRole: string
  jobTitle: string
  address: string
  depId: number
  noticeMethod: string
  depName: string
  compName: string
  roleId: number
  isReportSign: string
  isHourSign: string
  isPlanSign: string
  roleName: string
  smallImage?: string
}

export interface UserRole {
  roleId: number
  roleName: string
  roleType: string
  userId: number
}
