import api from './index';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  telegramAccount?: string | null;
  role: string;
  isActive: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  currentPassword: string;
  newPassword?: string;
}

export const usersApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/v1/users/me');
    return response.data;
  },

  updateMe: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.put<UserProfile>('/api/v1/users/me', data);
    return response.data;
  },
};
