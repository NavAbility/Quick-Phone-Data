function setAuthToken(token) {
  return window.localStorage.setItem('authToken', token);
}

function setIdToken(token) {
  return window.localStorage.setItem('idToken', token);
}

function getAuthToken() {
  return window.localStorage.getItem('authToken');
}

function getIdToken() {
  return window.localStorage.getItem('idToken');
}

function clearTokens() {
  window.localStorage.clear();
}

function getLoginUrl() {
  return "https://synchrony.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=13d5f6opbi4o4sevg6fm3lpuml&redirect_uri=http://localhost:8000/callback&state=STATE&scope=openid+profile";
}
