export interface MessageItem {
  bisSubType: string
  backId: string
  fromUserId: number
  isRead: string
  bisType: string
  title: string
  userId: number
  toUserId: number
  content: string
  fromName: string
  toUserName: string
  approvalId: number
  fromUserImg: string
  msgDate: string
}

// {

// 			"bisSubType": "leave",
// 			"backId": "101-168",
// 			"fromUserId": 764,
// 			"isRead": "N",
// 			"bisType": "approve",
// 			"title": "system通过了我的请假申请",
// 			"userId": 963,
// 			"toUserId": 963,
// 			"content": "申请日期:2025-07-10 2025-09-14 00时至2025-09-14 00时 OK",
// 			"fromName": "system",
// 			"toUserName": "刘广仓",
// 			"approvalId": 20,
// 			"fromUserImg": "https://www.bianxiukaoqing.top/images/up/2507/7642025072422userImage42.jpg",
// 			"msgDate": "2025-07-25 10:45:40"
// }

export interface MessaegDetailItem {
  backId: string
  isRead: string
  bisType: string
  title: string
  userId: number
  toUserId: number
  content: string
  toUserName: string
  msgDate: string
}
