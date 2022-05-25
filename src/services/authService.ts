import axios, { EndPoints } from '../api/axios';

export type UserModel = {
  email: string;
  password: string;
};

export type RegisterModel = {
  email: string;
  password: string;
  name: string;
  mobile: string;
  policy: boolean;
};

export async function loginRequest(userModel: UserModel) {
  const { data } = await axios.post<{ accessToken: string }>(
    EndPoints.login,
    userModel,
  );
  return data;
}

export async function registerRequest(registerModel: RegisterModel) {
  const { data } = await axios.post<{ accessToken: string }>(
    EndPoints.register,
    registerModel,
  );
  return data;
}
