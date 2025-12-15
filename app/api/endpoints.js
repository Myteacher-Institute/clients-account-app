const endpoints = {
  login: 'users/login',
  register: 'users/register',
  userProfile: id => `users/${id}`,
  sendOtp: 'users/verify-email/send',
  uploadKYC: id => `kyc/${id}/upload`,
  resetPassword: 'users/reset-password',
  emailOtp: 'users/verify-email/confirm',
  verifyTopUp: id => 'users/verifyTopUp',
  forgotPassword: 'users/forgot-password',
  updateProfile: id => `users/${id}/update`,
  withdraw: id => `users/${id}/withdrawToBank`,
  updateAvatar: id => `users/${id}/avatar/upload`,
  topUpWithCard: id => `users/${id}/topUpWithCard`,
  updateAfterDeposit: id => `users/${id}/updateAfterDeposit`,
};

export default endpoints;
