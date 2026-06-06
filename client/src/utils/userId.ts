const USER_ID_KEY = 'paperplane_user_id'

export function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = 'anon_' + Math.random().toString(36).substring(2, 10)
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}
