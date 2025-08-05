export default async function (options: any) {
  const { keyword } = options.params
  if (keyword === '1') {
    throw new Error('请求错误，测试错误请求错误')
  }

  return {
    code: 0,
    success: true,
    message: '请求成功',
    data: {
      count: 20,
      list: new Array(10).fill('').map((item, index) => {
        return {
          name: `张三${index}`,
          content:
            '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
        }
      }),
    },
  }
}
