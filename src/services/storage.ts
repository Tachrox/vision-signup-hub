
// Local storage management functions
export const storeUserId = (uuid: string) => {
  localStorage.setItem('userId', uuid);
};

export const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

export const clearUserId = () => {
  localStorage.removeItem('userId');
};

export const isLoggedIn = (): boolean => {
  return !!getUserId();
};
