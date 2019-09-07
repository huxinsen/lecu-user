import fetch from '@/utils/fetch'
// {get} /shops/:sid Get data of a Shop
export function getShop(shopId) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/shops/' + shopId,
      method: 'get',
      params: {
        type: 'lite',
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
// {get} /shops Get list of Shops
export function getShopsUser(searchParams) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/shops',
      method: 'get',
      params: searchParams,
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// {get} /shops/:sid/classes Get classes of a Shop
export function getClasses(shopId) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/shops/' + shopId + '/classes',
      method: 'get',
      params: {
        type: 'user',
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
