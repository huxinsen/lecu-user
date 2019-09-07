import fetch from '@/utils/fetch'
// {post} /session/:type Login
export function login(userInfo) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/session/user',
      method: 'post',
      data: userInfo,
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// {post} /users Add a User
export function signUp(userInfo) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/users',
      method: 'post',
      data: userInfo,
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// {put} /users/:uid Update data of a User
export function changePwd(userInfo) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/users/' + userInfo.username,
      method: 'put',
      data: userInfo,
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
