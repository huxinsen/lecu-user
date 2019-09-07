import fetch from '@/utils/fetch'
// {get} /commodities Get list of Commodities
export function getCommoditiesUser(searchParams) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/commodities',
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
// {get} /commodities/:cid Get data of a Commodity
export function getCommodity(commodityId) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/commodities/' + commodityId,
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

// {get} /commodities/shops/:sid/classes/:cls Get list of Commodities by class
export function getCommoditiesByClass(shopId, classValue) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/commodities/shops/' + shopId + '/classes/' + classValue,
      method: 'get',
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// {get} /commodities/count Get number of Commodities on sales promotion
export function getCommoditiesCount(shopId) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/commodities/count/onsale',
      method: 'get',
      params: {
        shopId,
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
