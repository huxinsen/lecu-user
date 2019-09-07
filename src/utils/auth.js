import Cookies from 'js-cookie'

const TokenKey = 'Token'
const UsernameKey = 'Username'
const LoginTypeKey = 'LoginType'

// token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// username
export function getUsername() {
  return Cookies.get(UsernameKey)
}

export function setUsername(username) {
  return Cookies.set(UsernameKey, username)
}

export function removeUsername() {
  return Cookies.remove(UsernameKey)
}

// loginType
export function getLoginType() {
  return Cookies.get(LoginTypeKey)
}

export function setLoginType(loginType) {
  return Cookies.set(LoginTypeKey, loginType)
}

export function removeLoginType() {
  return Cookies.remove(LoginTypeKey)
}

// location
const AddrKey = 'LecuAddr'
const LatKey = 'LecuLat'
const LngKey = 'LecuLng'

export function getLocation() {
  return {
    addr: localStorage.getItem(AddrKey),
    lat: localStorage.getItem(LatKey),
    lng: localStorage.getItem(LngKey),
  }
}

export function setLocation(location) {
  localStorage.setItem(AddrKey, location.addr)
  localStorage.setItem(LatKey, location.lat)
  localStorage.setItem(LngKey, location.lng)
}

export function removeLocation() {
  localStorage.removeItem(AddrKey)
  localStorage.removeItem(LatKey)
  localStorage.removeItem(LngKey)
}
