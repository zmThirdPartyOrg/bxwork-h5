import { baseURL } from './curl/config'
import { curl } from './curl'
import { uploadFile, fileToBase64 } from '@pkstar/horn-jssdk'
import { withLoading } from '@/utils'
import { blobToBase64, formatDate } from '@pkstar/utils'
import { getRandomNumber } from '@pkstar/utils'

type FileSourceType = 'attend' | 'userinfo' | string

// 上传
export const doFileUpload = async (data: { file: File }, source: FileSourceType) => {
  // 文件转blob
  const arrayBuffer = await data.file.arrayBuffer()
  const blob = new Blob([arrayBuffer], { type: data.file.type })
  const base64Str = (await blobToBase64(blob)) as string
  console.log(base64Str)
  // 去除base64Str前缀
  const base64StrWithoutPrefix = base64Str.replace(/^data:image\/\w+;base64,/, '')
  return doFileUploadWithBase64({ data: base64StrWithoutPrefix }, source)
}

// base64 上传
export const doFileUploadWithBase64 = (data: { data: string }, source: FileSourceType) => {
  const filename = `${formatDate(Date.now(), 'yyyyMMddhh')}${source}${getRandomNumber(2)}.jpg`
  const content = [
    {
      filename,
      source,
      ...data,
    },
  ]
  console.log('content', content)
  return curl<{ id: number; url: string }[]>(
    `/user/upload.json`,
    {
      content,
    },
    { method: 'POST' },
  ).then((res) => {
    return res[0]
  })
}

// 利用原生容器去上传
export const doFileUploadWithSdk = withLoading((filePath: string) => {
  return new Promise((resolve, reject) => {
    uploadFile({
      url: baseURL + `/user/upload.json`,
      header: {},
      formData: {},
      filePath,
      name: 'file',
    })
      .then((res) => {
        if (res.status === 0) {
          resolve(res.data)
        } else {
          reject(res)
        }
      })
      .catch((_) => {
        reject(_)
      })
  })
})
