import fetch from '@/utils/fetch'
// {get} /lbs/location Get Location Info
export function getLocation(address) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/lbs/location',
      method: 'get',
      params: {
        address,
      },
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// {get} /lbs/tips Get Location Tips
export function getTips(keywords) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/lbs/tips',
      method: 'get',
      params: {
        keywords,
      },
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
