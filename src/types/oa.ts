// 打卡入参
export interface AttendDto {
  locationName?: string
  locationDetail?: string
  fileIds: string
  longitude: string | number
  latitude: string | number
  type: 'sign' | 'attend'
  attendType?: string
  remark: string
}

export interface NoticeItem {
  [x: string]: any
  publishDt: string
}

export interface AttendItem {
  attendDt: string
  attendType: string
}

// 打卡记录
export interface AttendRecord {
  summ: AttendSumm
  sign: AttendSignItem[]
}

interface AttendSignItem {
  dt: string
  locationDetail: string
  location: string
}

export interface AttendSumm {
  tripHour: number
  awayNum: number
  leaveHour: number
  lackNum: number
  earlyNum: number
  normalAttend: number
  userId: number
  outHour: number
  signDays: number
  month: string
  lateNum: number
  attendDays: number
  overHour: number
}

// 签到记录
export interface SignRecord {
  summ: SignSumm
  sign: SignRecordItem[]
}

interface SignRecordItem {
  dt: string
  locationDetail: string
  latitude?: string
  location: string
  longitude?: string
}
interface SignSumm {
  signNum: number
  month: string
  userId: number
}

// 审批相关
export interface ApplyItem {
  modifyDt: string
  title: string
  type: string
  iconPath: string
  isFinished: BooleanString
  submitStatus: string
  approveId: number
  status: string
}

// 审批详情
export interface ApplyDetailVo {
  special: any[]
  cmdType: string
  approval: ApplyDetailApproval[]
  rtnMsg: string
  logs: ApplyDetailLog[]
  content: {
    overtime?: ApplyOvertimeDeatil
    leave?: ApplyLeaveDeatil
  }
  rtnCode: string
  approveSign: number
}

export interface ApplyOvertimeDeatil {
  reason: string
  endDt: string
  uuid: string
  applyUserId: number
  isProject: string
  isAllDay: string
  approvalId: number
  myStatus: string
  submitStatus: string
  userdep: string
  hours: number
  isFinished: string
  createDt: string
  startDt: string
  days: number
  location: string
  iconPath: string
  username: string
  status: string
  pics: any[]
}
export interface ApplyLeaveDeatil {
  reason: string
  hours: number
  typeName: string
  endDt: string
  isFinished: string
  type: string
  createDt: string
  uuid: string
  applyUserId: number
  isAllDay: string
  startDt: string
  days: number
  approvalId: number
  myStatus: string
  iconPath: string
  pics: any[]
  submitStatus: string
  username: string
  userdep: string
  status: string
}
interface ApplyDetailLog {
  activityDt: string
  description: string
  iconPath: string
  username: string
}

interface ApplyDetailApproval {
  activityDt: string
  approveUserType: string
  approvalType: string
  iconPath: string
  isFinished: string
  userId: number
  username: string
  status: string
}

// 请假类型
export interface LeaveInfoItem {
  rest: number
  dictId: number
  type: string
  priority: number
  shortCode: string
  parentId: number
  longName: string
}

// {
//     "special": [],
//     "picarray": [],
//     "cmdType": "",
//     "approval": [
//         {
//             "activityDt": "2025-07-10 21:29:21",
//             "approveUserType": "admin",
//             "approvalType": "approve",
//             "iconPath": "https://www.bianxiukaoqing.top/images/up/2507/7642025072422userImage42.jpg",
//             "isFinished": "N",
//             "userId": 764,
//             "username": "system",
//             "status": "init"
//         }
//     ],
//     "rtnMsg": "成功",
//     "logs": [
//         {
//             "activityDt": "2025-07-10 21:29:21",
//             "description": "请假申请",
//             "iconPath": "https://www.bianxiukaoqing.top/images/up/2507/9632025072516userImage40.jpg",
//             "username": "刘广仓"
//         },
//         {
//             "description": "等待审批",
//             "iconPath": "https://www.bianxiukaoqing.top/images/up/2507/7642025072422userImage42.jpg",
//             "username": "system"
//         }
//     ],
//     "content": {
//         "leave": {
//             "reason": "OK",
//             "hours": 0.0,
//             "typeName": "病假",
//             "endDt": "2025-09-10 00:00:00",
//             "isFinished": "N",
//             "type": "sick",
//             "createDt": "2025-07-10 21:29:21",
//             "uuid": "LV20250021",
//             "applyUserId": 963,
//             "isAllDay": "Y",
//             "startDt": "2025-09-10 00:00:00",
//             "days": 1,
//             "approvalId": 18,
//             "myStatus": "",
//             "iconPath": "https://www.bianxiukaoqing.top/images/up/2507/9632025072516userImage40.jpg",
//             "pics": [],
//             "submitStatus": "submit",
//             "username": "刘广仓",
//             "userdep": "上海总部-行政部",
//             "status": "init"
//         }
//     },
//     "rtnCode": "0",
//     "approveSign": 0
// }

// {
// 	"special": [],
// 	"cmdType": "",
// 	"approval": [{
// 		"activityDt": "2025-07-03 21:00:47",
// 		"approveUserType": "admin",
// 		"approvalType": "approve",
// 		"iconPath": "https://www.bianxiukaoqing.top/images/up/2507/7642025072422userImage42.jpg",
// 		"isFinished": "N",
// 		"userId": 764,
// 		"username": "system",
// 		"status": "init"
// 	}],
// 	"rtnMsg": "成功",
// 	"logs": [{
// 		"activityDt": "2025-07-03 21:00:47",
// 		"description": "加班申请",
// 		"iconPath": "https://www.bianxiukaoqing.top/images/up/2507/9632025072516userImage40.jpg",
// 		"username": "刘广仓"
// 	}, {
// 		"activityDt": "2025-07-03 21:02:47",
// 		"description": "审批通过",
// 		"iconPath": "https://www.bianxiukaoqing.top/images/up/2507/7642025072422userImage42.jpg",
// 		"username": "system"
// 	}],
// 	"content": {
// 		"overtime": {
// 			"reason": "系统上线",
// 			"endDt": "2025-07-03 00:00:00",
// 			"uuid": "OT20250003",
// 			"applyUserId": 963,
// 			"isProject": "N",
// 			"isAllDay": "Y",
// 			"approvalId": 2,
// 			"myStatus": "",
// 			"submitStatus": "submit",
// 			"userdep": "上海总部-行政部",
// 			"hours": 0.0,
// 			"isFinished": "Y",
// 			"createDt": "2025-07-03 21:00:47",
// 			"startDt": "2025-07-03 00:00:00",
// 			"days": 1,
// 			"location": "上海宝山",
// 			"iconPath": "https://www.bianxiukaoqing.top/images/up/2507/9632025072516userImage40.jpg",
// 			"username": "刘广仓",
// 			"status": "pass"
// 		}
// 	},
// 	"rtnCode": "0",
// 	"approveSign": 0
// }

// 请假申请
export interface ApplyLeaveDto {
  reason: string
  startDt: string
  userId: number
  days: number
  hours?: number
  fileIds: string
  isAllDay: BooleanString
  receiveRoleId: string
  receiveId: string
  endDt: string
  type: 'leave' | 'overtime'
  receiveType: string
}
export interface ApplyLeaveVoItem {
  userList: ApplyLeaveUser[]
  roleId: number
  approvalType: string
  roleName: string
}
export interface ApplyLeaveUser {
  userId: number
  username: string
  userdep: string
  jobtitle?: string
  iconPath?: string
  approvalType?: string
  roleId?: number
  roleName?: string
}

// 加班申请
export interface ApplyOvertimeDto {
  startDt: string
  hours: number
  receiveId: string
  receiveRoleId: string
  userId: number
  location: string
  receiveType: string
  reason: string
  days: number
  isAllDay: BooleanString
  endDt: string
  isProject: BooleanString
}
