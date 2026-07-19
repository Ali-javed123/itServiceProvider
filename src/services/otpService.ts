import { RedisService } from "../config/redis.js";

const OTP_TTL_SECONDS = 300; // 5 minutes


export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email: string, otp: string): Promise<void> {
  const key = `otp:login:${email}`;

  await RedisService.set(key, otp, OTP_TTL_SECONDS);

  console.log("OTP Saved");
  console.log("Key:", key);
  console.log("OTP:", otp);
}

export async function verifyOTP(
  email: string,
  otp: string
): Promise<boolean> {

  const key = `otp:login:${email}`;

  const storedOtp = await RedisService.get<string>(key);

  console.log("Key:", key);
  console.log("Redis OTP:", storedOtp);
  console.log("User OTP:", otp);

  // OTP exist nahi karta
  if (!storedOtp) {
    return false;
  }

  // OTP match nahi hua
  if (storedOtp !== otp) {
    return false;
  }

  // OTP match ho gaya -> delete
  await RedisService.remove(key);

  return true;
}