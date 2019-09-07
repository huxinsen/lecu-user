import fetch from '@/utils/fetch'
// {post} /favors Add a Favor
export function addFavor(favorInfo) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/favors',
      method: 'post',
      data: favorInfo,
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// {get} /favors/:uid/shops Get list of Favors
export function getFavors(userId) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/favors/' + userId + '/shops',
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
// {delete} /favors/:uid/shops/:sid Delete a Favor
export function deleteFavor(favorInfo) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/favors/' + favorInfo.userId + '/shops/' + favorInfo.shopId,
      method: 'delete',
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
