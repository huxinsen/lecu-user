import fetch from '@/utils/fetch'
// {post} /reports Add a Report
export function addReport(reportInfo) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/reports',
      method: 'post',
      data: reportInfo,
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
