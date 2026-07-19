export const emailTemplate = (otp) => `
  <div style="font-family:Arial,sans-serif">
    <h2>Login Verification</h2>
    <p>Your OTP for login is:</p>
    <h1 style="letter-spacing:4px;color:#2d89ef;">${otp}</h1>
    <p>This OTP is valid for <strong>5 minutes</strong>.</p>
  </div>
`;
//# sourceMappingURL=emailTemplate.js.map